// "질문하기" backend: answers a question from the wiki using the Gajae-Code SDK.
// The SDK is loaded lazily so that the rest of the site keeps working even if
// the SDK, login, or network is broken.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { rootDir } from "./paths.ts";

export type AskEvent =
	| { type: "status"; text: string }
	| { type: "delta"; text: string }
	| { type: "done"; answer: string; sources: string[] }
	| { type: "error"; text: string };

type SdkState = { ok: boolean; reason?: string; checkedAt: number };
let sdkState: SdkState = { ok: false, reason: "아직 확인하지 않았어요.", checkedAt: 0 };

const READ_ONLY_TOOLS = ["read", "find", "search"];

async function loadSdk() {
	return await import("@gajae-code/coding-agent");
}

// Lightweight check: can the SDK load, and is there any model with credentials?
export async function checkSdk(force = false): Promise<SdkState> {
	if (!force && sdkState.checkedAt && Date.now() - sdkState.checkedAt < 30_000) return sdkState;
	try {
		const sdk = await loadSdk();
		const authStorage = await sdk.discoverAuthStorage();
		const registry = new sdk.ModelRegistry(authStorage);
		await registry.refresh();
		const available = registry.getAvailable();
		sdkState =
			available.length > 0
				? { ok: true, checkedAt: Date.now() }
				: { ok: false, reason: "로그인된 모델이 없어요. 터미널에서 gjc를 실행하고 /login 을 먼저 해 주세요.", checkedAt: Date.now() };
	} catch (error) {
		sdkState = { ok: false, reason: `가재코드 SDK를 불러오지 못했어요: ${messageOf(error)}`, checkedAt: Date.now() };
	}
	return sdkState;
}

export function markSdkFailed(reason: string) {
	sdkState = { ok: false, reason, checkedAt: Date.now() };
}

function messageOf(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

function buildPrompt(question: string): string {
	return [
		"아래 질문에 이 저장소의 wiki/ 를 근거로 답해 주세요.",
		"1. 먼저 wiki/index.md 를 read 도구로 읽고, 관련된 wiki 페이지를 2~4개 골라 읽으세요.",
		"2. AGENTS.md 의 '설명 수준' 규칙을 반드시 지켜서 답하세요.",
		"3. 위키에 없는 내용은 지어내지 말고 '위키에 아직 없는 내용입니다'라고 말하세요.",
		"4. 답의 마지막 줄에 '근거:' 로 시작하는 줄을 쓰고, 읽은 위키 페이지 경로(예: wiki/concepts/harness-engineering.md)를 쉼표로 나열하세요.",
		"5. 이 화면은 읽기 전용입니다. 파일을 저장하거나 사용자에게 되묻지 마세요.",
		"",
		`질문: ${question}`,
	].join("\n");
}

function collectSources(answer: string, readPaths: Set<string>): string[] {
	const found = new Set<string>();
	for (const match of answer.matchAll(/wiki\/(?:concepts|sources|quizzes)\/[a-z0-9-]+\.md/g)) found.add(match[0]);
	if (found.size === 0) {
		for (const path of readPaths) {
			const match = path.match(/wiki\/(?:concepts|sources)\/[a-z0-9-]+\.md/);
			if (match) found.add(match[0]);
		}
	}
	return [...found];
}

export async function ask(question: string, emit: (event: AskEvent) => void): Promise<void> {
	let sdk: Awaited<ReturnType<typeof loadSdk>>;
	try {
		sdk = await loadSdk();
	} catch (error) {
		const text = `가재코드 SDK를 불러오지 못했어요: ${messageOf(error)}`;
		markSdkFailed(text);
		emit({ type: "error", text });
		return;
	}

	// AGENTS.md is read fresh on every question, so switching demo-before/demo-after
	// takes effect immediately without restarting the server.
	const agentsPath = join(rootDir, "AGENTS.md");
	const agentsMd = readFileSync(agentsPath, "utf8");

	emit({ type: "status", text: "가재코드 에이전트를 준비하고 있어요..." });
	let session: Awaited<ReturnType<typeof sdk.createAgentSession>>["session"] | undefined;
	try {
		const created = await sdk.createAgentSession({
			cwd: rootDir,
			sessionManager: sdk.SessionManager.inMemory(),
			toolNames: READ_ONLY_TOOLS,
			contextFiles: [{ path: agentsPath, content: agentsMd }],
			skills: [],
			hasUI: false,
			enableMCP: false,
			enableLsp: false,
			disableExtensionDiscovery: true,
			skipPythonPreflight: true,
			modelPattern: process.env.GJC_MODEL || undefined,
		});
		session = created.session;
		// Keep only read-only tools active (the runtime may add helper tools by default).
		const active = session.getActiveToolNames().filter((name: string) => READ_ONLY_TOOLS.includes(name));
		await session.setActiveToolsByName(active);

		const readPaths = new Set<string>();
		let answer = "";
		session.subscribe((event: any) => {
			if (event.type === "message_update" && event.assistantMessageEvent?.type === "text_delta") {
				answer += event.assistantMessageEvent.delta;
				emit({ type: "delta", text: event.assistantMessageEvent.delta });
			} else if (event.type === "tool_execution_start") {
				const args = event.args ?? {};
				const target = String(args.path ?? args.pattern ?? args.query ?? "");
				if (event.toolName === "read" && target) readPaths.add(target);
				emit({ type: "status", text: `${event.toolName} ${target}`.trim() });
			}
		});

		emit({ type: "status", text: "위키를 읽고 있어요..." });
		await session.prompt(buildPrompt(question));

		const last = [...(session.messages ?? [])].reverse().find((m: any) => m.role === "assistant") as any;
		if (last?.stopReason === "error" || !answer.trim()) {
			const reason = last?.errorMessage ?? "모델이 답을 돌려주지 않았어요.";
			const text = `모델 호출에 실패했어요: ${reason}`;
			markSdkFailed(text);
			emit({ type: "error", text });
			return;
		}
		sdkState = { ok: true, checkedAt: Date.now() };
		emit({ type: "done", answer, sources: collectSources(answer, readPaths) });
	} catch (error) {
		const text = `가재코드 에이전트 실행 중 문제가 생겼어요: ${messageOf(error)}`;
		markSdkFailed(text);
		emit({ type: "error", text });
	} finally {
		await session?.dispose?.().catch?.(() => {});
	}
}
