// 하네스 공부 도우미 웹 서버. 실행: bun run start
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { ask, checkSdk, type AskEvent } from "./ask.ts";
import { rootDir } from "./paths.ts";
import { layout, notFound } from "./views.ts";
import {
	escapeHtml,
	listQuizzes,
	pageTitle,
	rawDir,
	readIndexSection,
	readQuiz,
	readRecentLog,
	readText,
	renderMarkdown,
	safeResolve,
	splitFrontMatter,
	wikiDir,
} from "./wiki.ts";

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

function homePage(): string {
	const concepts = readIndexSection("개념");
	const sources = readIndexSection("원본 요약");
	const log = readRecentLog(5);
	const cards = concepts
		.map(
			(c) => `<a class="card" href="${escapeHtml(c.href)}"><strong>${escapeHtml(c.title)}</strong><span>${escapeHtml(c.summary)}</span></a>`,
		)
		.join("\n");
	const sourceList = sources
		.map((s) => `<li><a href="${escapeHtml(s.href)}">${escapeHtml(s.title)}</a> <span class="muted">${escapeHtml(s.summary)}</span></li>`)
		.join("\n");
	const logList = log.map((line) => `<li>${escapeHtml(line)}</li>`).join("\n");
	return layout(
		"홈",
		"home",
		`<section class="hero">
  <h1>하네스 엔지니어링, 위키로 공부하기</h1>
  <p>에이전트(가재코드)가 원본 자료를 읽고 정리한 위키입니다. 개념을 골라 읽거나, 질문하거나, 퀴즈를 풀어 보세요.</p>
</section>
<h2>개념 <span class="count">${concepts.length}</span></h2>
<div class="cards">${cards || '<p class="muted">아직 개념이 없어요. gjc에서 /skill:wiki-ingest 를 실행해 보세요.</p>'}</div>
<div class="two-col">
  <section><h2>원본 요약</h2><ul class="plain">${sourceList}</ul></section>
  <section><h2>최근 작업 기록</h2><ul class="log">${logList || '<li class="muted">기록 없음</li>'}</ul><p><a href="/wiki/log.md">전체 기록 보기 →</a></p></section>
</div>`,
	);
}

function wikiPage(urlPath: string): Response {
	const file = safeResolve(wikiDir, urlPath);
	if (!file) return html(notFound(`wiki/${urlPath}`), 404);
	const text = readText(file) ?? "";
	return html(layout(pageTitle(text, urlPath), "page", `<article class="doc">${renderMarkdown(text, file)}</article>`));
}

function rawPage(urlPath: string): Response {
	const file = safeResolve(rawDir, urlPath);
	if (!file) return html(notFound(`raw/${urlPath}`), 404);
	const { meta, body } = splitFrontMatter(readText(file) ?? "");
	const url = meta.source_url ?? "";
	const header = `<div class="raw-meta">
  <div><strong>원본 자료</strong> (raw/${escapeHtml(urlPath)}) — 사람이 넣은 원문이며, 에이전트는 수정하지 않습니다.</div>
  <div>원문 URL: <a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(url)}</a></div>
  <div>게시일: ${escapeHtml(meta.published ?? "-")} · 수집일: ${escapeHtml(meta.collected ?? "-")}</div>
</div>`;
	return html(layout(meta.title ?? urlPath, "page", `${header}<article class="doc raw">${renderMarkdown(body, file)}</article>`));
}

function askPage(): string {
	return layout(
		"질문하기",
		"ask",
		`<h1>질문하기</h1>
<p class="muted">위키를 근거로 가재코드 에이전트가 답합니다. 에이전트는 읽기 도구(read, find, search)만 쓰고, AGENTS.md 규칙을 따릅니다.</p>
<div id="sdk-status" class="notice">가재코드 연결을 확인하고 있어요...</div>
<form id="ask-form">
  <textarea id="question" rows="3" placeholder="예: 하네스와 모델은 어떻게 다른가요?"></textarea>
  <div class="row">
    <button type="submit" id="ask-button" disabled>질문하기</button>
    <button type="button" id="example-button" class="ghost">예시 질문 넣기</button>
  </div>
</form>
<div id="progress" class="muted"></div>
<article id="answer" class="doc answer" hidden></article>
<div id="sources" hidden></div>`,
		["/static/ask.js"],
	);
}

function quizListPage(): string {
	const items = listQuizzes()
		.map((q) => `<a class="card" href="/quiz/${q.slug}"><strong>${escapeHtml(q.title)}</strong><span>${q.questions.length}문제</span></a>`)
		.join("\n");
	return layout(
		"퀴즈",
		"quiz",
		`<h1>퀴즈</h1><p class="muted">wiki/quizzes/ 의 문제를 풀어 봅니다. gjc에서 /skill:wiki-quiz 로 새 퀴즈를 만들 수 있어요.</p><div class="cards">${items || '<p class="muted">아직 퀴즈가 없어요.</p>'}</div>`,
	);
}

function quizPage(slug: string): Response {
	const quiz = readQuiz(slug);
	if (!quiz) return html(notFound(`퀴즈 ${slug}`), 404);
	const questions = quiz.questions
		.map(
			(q, i) => `<section class="quiz-q" data-answer="${q.answer}">
  <h2>문제 ${i + 1}</h2>
  <p>${escapeHtml(q.question)}</p>
  <div class="options">${q.options
		.map((o) => `<button type="button" class="option" data-key="${o.key}">${o.key}) ${escapeHtml(o.text)}</button>`)
		.join("")}</div>
  <div class="feedback" hidden></div>
  <div class="explanation" hidden>${q.explanationHtml}</div>
</section>`,
		)
		.join("\n");
	const conceptLink = existsSync(join(wikiDir, "concepts", `${quiz.concept}.md`))
		? `<p><a href="/wiki/concepts/${quiz.concept}.md">개념 페이지 먼저 읽기 →</a></p>`
		: "";
	return html(
		layout(
			`퀴즈: ${quiz.title}`,
			"quiz",
			`<h1>퀴즈: ${escapeHtml(quiz.title)}</h1>${conceptLink}${questions}<div id="score" class="notice" hidden></div>`,
			["/static/quiz.js"],
		),
	);
}

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
			if (path === "/") return html(homePage());
			if (path === "/ask") return html(askPage());
			if (path === "/quiz") return html(quizListPage());
			if (path.startsWith("/quiz/")) return quizPage(path.slice("/quiz/".length));
			if (path.startsWith("/wiki/")) return wikiPage(path.slice("/wiki/".length));
			if (path.startsWith("/raw/")) return rawPage(path.slice("/raw/".length));
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
