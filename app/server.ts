// 하네스 공부 도우미 웹 서버. 실행: bun run start
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { ask, checkSdk, type AskEvent } from "./ask.ts";
import { rootDir } from "./paths.ts";
import { askPage, homePage, type Page, quizListPage, quizPage, rawPage, wikiPage } from "./pages.ts";
import { layout, notFound } from "./views.ts";
import { escapeHtml, pageTitle, readText, renderMarkdown } from "./wiki.ts";

// env.txt (optional): KEY=VALUE lines, e.g. ANTHROPIC_API_KEY=... or GJC_MODEL=...
function loadEnvTxt() {
	const file = join(rootDir, "env.txt");
	if (!existsSync(file)) return;
	for (const line of readFileSync(file, "utf8").split("\n")) {
		const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
		if (m && m[2] && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
	}
}
loadEnvTxt();

const publicDir = resolve(import.meta.dir, "public");
const html = (body: string, status = 200) =>
	new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8" } });
const page = (p: Page) => html(p.body, p.status);

function streamAsk(question: string): Response {
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			const send = (event: object) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
			const emit = (event: AskEvent) => {
				if (event.type !== "done") return send(event);
				// Render the final answer on the server so links work like on wiki pages.
				const sources = event.sources.map((p) => ({ path: p, href: `/${p}`, title: pageTitle(readText(join(rootDir, p)) ?? "", p) }));
				const linked = event.answer.replace(/(?<![(\[/])(wiki\/[a-z0-9/-]+\.md)/g, "[$1]($1)");
				send({ ...event, html: renderMarkdown(linked, join(rootDir, "answer.md")), sources });
			};
			try {
				await ask(question, emit);
			} catch (error) {
				emit({ type: "error", text: String(error) });
			} finally {
				controller.close();
			}
		},
	});
	return new Response(stream, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" } });
}

const port = Number(process.env.PORT || 3000);

let server: ReturnType<typeof Bun.serve>;
try {
	server = startServer();
} catch (error) {
	console.error(`\n  포트 ${port}번을 이미 다른 프로그램이 쓰고 있어요.`);
	console.error("  이미 켜 둔 공부 도우미 창이 있는지 확인하거나, 다른 번호로 켜세요:  PORT=3001 bun run start\n");
	process.exit(1);
}

function startServer() {
	return Bun.serve({
	port,
	idleTimeout: 255,
	async fetch(request) {
		const url = new URL(request.url);
		const path = decodeURIComponent(url.pathname);
		try {
			if (path === "/") return page(homePage());
			if (path === "/ask") return page(askPage());
			if (path === "/quiz") return page(quizListPage());
			if (path.startsWith("/quiz/")) return page(quizPage(path.slice("/quiz/".length)));
			if (path.startsWith("/wiki/")) return page(wikiPage(path.slice("/wiki/".length)));
			if (path.startsWith("/raw/")) return page(rawPage(path.slice("/raw/".length)));
			if (path.startsWith("/static/")) {
				const file = Bun.file(join(publicDir, path.slice("/static/".length).replace(/\.\./g, "")));
				if (await file.exists()) return new Response(file);
			}
			if (path === "/api/status") {
				const state = await checkSdk(url.searchParams.has("force"));
				return Response.json(state);
			}
			if (path === "/api/ask" && request.method === "POST") {
				const body = (await request.json().catch(() => ({}))) as { question?: string };
				const question = (body.question ?? "").trim();
				if (!question) return Response.json({ error: "질문을 입력해 주세요." }, { status: 400 });
				return streamAsk(question.slice(0, 1000));
			}
			return html(notFound(path), 404);
		} catch (error) {
			console.error(error);
			return html(layout("오류", "page", `<h1>화면을 그리다 문제가 생겼어요</h1><pre>${escapeHtml(String(error))}</pre>`), 500);
		}
	},
	});
}

console.log("");
console.log("  🦞 하네스 공부 도우미가 켜졌습니다.");
console.log(`  브라우저에서 여세요:  http://localhost:${server.port}`);
console.log("  끄려면 이 창에서 Ctrl + C");
console.log("");
