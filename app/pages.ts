// Page templates for each screen.
import { existsSync } from "node:fs";
import { basename, join } from "node:path";
import { icon, layout, notFound } from "./views.ts";
import {
	escapeHtml,
	listQuizzes,
	pageTitle,
	rawDir,
	readIndexSection,
	readQuiz,
	readRecentLog,
	readText,
	renderMarkdownWithToc,
	safeResolve,
	splitFrontMatter,
	wikiDir,
} from "./wiki.ts";

export type Page = { status: number; body: string };
const ok = (body: string): Page => ({ status: 200, body });
const missing = (what: string): Page => ({ status: 404, body: notFound(what) });

const pad = (n: number) => String(n).padStart(2, "0");

const LOG_LABELS: Record<string, string> = { ingest: "자료 추가", query: "질문", lint: "점검", quiz: "퀴즈" };

function parseLogLine(line: string) {
	const m = line.match(/^\[(\d{4}-\d{2}-\d{2})\]\s*([a-z]+)\s*\|\s*([^|]*)\|?\s*(.*)$/);
	if (!m) return { date: "", kind: "", what: line, pages: "" };
	return { date: m[1], kind: m[2], what: m[3].trim(), pages: m[4].trim() };
}

function parseSourceSummary(summary: string) {
	const m = summary.match(/^([^,]+),\s*(\d{4}-\d{2}-\d{2})\.\s*(.*)$/);
	return m ? { publisher: m[1].trim(), date: m[2], desc: m[3] } : { publisher: "", date: "", desc: summary };
}

export function homePage(): Page {
	const concepts = readIndexSection("개념");
	const sources = readIndexSection("원본 요약");
	const quizzes = listQuizzes();
	const log = readRecentLog(5).map(parseLogLine);
	const lastUpdate = log[0]?.date ?? "-";

	const cards = concepts
		.map(
			(c, i) => `<a class="concept-card" href="${escapeHtml(c.href)}">
  <span class="concept-num">${pad(i + 1)}</span>
  <strong>${escapeHtml(c.title)}</strong>
  <p>${escapeHtml(c.summary)}</p>
  <span class="card-cta">읽어 보기 ${icon("arrow", 15)}</span>
</a>`,
		)
		.join("\n");

	const sourceRows = sources
		.map((s) => {
			const info = parseSourceSummary(s.summary);
			return `<a class="source-row" href="${escapeHtml(s.href)}">
  <span class="source-icon">${icon("file", 18)}</span>
  <span class="source-body">
    <span class="source-meta">${info.publisher ? `<span class="tag">${escapeHtml(info.publisher)}</span>` : ""}${info.date ? `<span>${info.date}</span>` : ""}</span>
    <strong>${escapeHtml(s.title)}</strong>
    <small>${escapeHtml(info.desc)}</small>
  </span>
</a>`;
		})
		.join("\n");

	const timeline = log
		.map(
			(e) => `<li class="timeline-item">
  <span class="timeline-dot kind-${escapeHtml(e.kind)}"></span>
  <div>
    <div class="timeline-head"><span class="pill kind-${escapeHtml(e.kind)}">${escapeHtml(LOG_LABELS[e.kind] ?? e.kind)}</span><time>${escapeHtml(e.date)}</time></div>
    <p>${escapeHtml(e.what)}</p>
  </div>
</li>`,
		)
		.join("\n");

	return ok(
		layout(
			"홈",
			"home",
			`<section class="hero">
  <div class="hero-copy">
    <span class="eyebrow">${icon("spark", 14)} LLM Wiki · 가재코드로 만든 공부 도우미</span>
    <h1>하네스 엔지니어링을<br><em>위키로</em> 배워 보세요</h1>
    <p class="lede">에이전트가 Anthropic·Karpathy의 원문을 읽고 정리한 위키입니다. 개념을 읽고, 궁금한 것을 묻고, 퀴즈로 확인하세요.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="/ask">${icon("ask", 17)} 질문하기</a>
      <a class="btn btn-secondary" href="/quiz">${icon("quiz", 17)} 퀴즈 풀기</a>
    </div>
    <dl class="stats">
      <div><dt>개념</dt><dd>${concepts.length}</dd></div>
      <div><dt>원본 자료</dt><dd>${sources.length}</dd></div>
      <div><dt>퀴즈</dt><dd>${quizzes.length}</dd></div>
      <div><dt>마지막 업데이트</dt><dd class="small">${escapeHtml(lastUpdate)}</dd></div>
    </dl>
  </div>
  <div class="hero-visual" aria-hidden="true">
    <div class="flow-card"><span class="flow-step">1</span><div><strong>raw/</strong><small>사람이 원본 자료를 넣어요</small></div></div>
    <div class="flow-line"></div>
    <div class="flow-card accent"><span class="flow-step">2</span><div><strong>가재코드 + AGENTS.md</strong><small>에이전트가 규칙대로 정리해요</small></div></div>
    <div class="flow-line"></div>
    <div class="flow-card"><span class="flow-step">3</span><div><strong>wiki/</strong><small>여러분은 읽고, 묻고, 풀어요</small></div></div>
  </div>
</section>

<section class="section">
  <div class="section-head">
    <div><h2>개념</h2><p>wiki/index.md 에 정리된 핵심 개념 ${concepts.length}개</p></div>
  </div>
  <div class="concept-grid">${cards || '<p class="muted">아직 개념이 없어요. gjc에서 /skill:wiki-ingest 를 실행해 보세요.</p>'}</div>
</section>

<section class="section split">
  <div class="panel">
    <div class="panel-head"><h2>원본 자료</h2><span class="muted">에이전트가 요약한 원문</span></div>
    <div class="source-list">${sourceRows}</div>
  </div>
  <div class="panel">
    <div class="panel-head"><h2>최근 작업</h2><a class="text-link" href="/wiki/log.md">전체 기록 ${icon("arrow", 14)}</a></div>
    <ul class="timeline">${timeline || '<li class="muted">기록 없음</li>'}</ul>
  </div>
</section>`,
		),
	);
}

function docShell(opts: { crumb: string; title: string; html: string; asideHtml: string; extraClass?: string; head?: string }): string {
	return `<nav class="breadcrumb"><a href="/">홈</a><span>/</span><span>${opts.crumb}</span></nav>
<div class="doc-layout">
  <article class="doc ${opts.extraClass ?? ""}">${opts.head ?? ""}${opts.html}</article>
  <aside class="doc-aside">${opts.asideHtml}</aside>
</div>`;
}

function tocBlock(toc: { id: string; text: string; depth: number }[]): string {
	if (toc.length === 0) return "";
	return `<div class="aside-card"><h4>이 페이지에서</h4><ol class="toc">${toc
		.map((t) => `<li class="d${t.depth}"><a href="#${t.id}">${escapeHtml(t.text)}</a></li>`)
		.join("")}</ol></div>`;
}

export function wikiPage(urlPath: string): Page {
	const file = safeResolve(wikiDir, urlPath);
	if (!file) return missing(`wiki/${urlPath}`);
	const text = readText(file) ?? "";
	const title = pageTitle(text, urlPath);
	const { html, toc } = renderMarkdownWithToc(text, file);
	const kind = urlPath.startsWith("concepts/") ? "개념" : urlPath.startsWith("sources/") ? "원본 요약" : "위키";

	const rawLinks = [...new Set([...text.matchAll(/\.\.\/\.\.\/raw\/([a-z0-9-]+\.md)/g)].map((m) => m[1]))];
	const sourcesCard = rawLinks.length
		? `<div class="aside-card"><h4>근거 자료</h4><ul class="aside-links">${rawLinks
				.map((name) => {
					const raw = readText(join(rawDir, name));
					const t = raw ? splitFrontMatter(raw).meta.title ?? name : name;
					return `<li><a href="/raw/${name}">${icon("file", 15)}<span>${escapeHtml(t)}</span></a></li>`;
				})
				.join("")}</ul></div>`
		: "";
	const slug = basename(urlPath, ".md");
	const quizCard =
		urlPath.startsWith("concepts/") && existsSync(join(wikiDir, "quizzes", `${slug}.md`))
			? `<a class="aside-cta" href="/quiz/${slug}">${icon("quiz", 18)}<span><strong>이 개념 퀴즈 풀기</strong><small>객관식으로 확인해 보세요</small></span></a>`
			: "";

	return ok(
		layout(
			title,
			"page",
			docShell({
				crumb: `${kind} · ${escapeHtml(title)}`,
				title,
				html,
				extraClass: urlPath.startsWith("concepts/") ? "concept" : "",
				head: `<span class="doc-kind">${kind}</span>`,
				asideHtml: tocBlock(toc) + sourcesCard + quizCard,
			}),
		),
	);
}

export function rawPage(urlPath: string): Page {
	const file = safeResolve(rawDir, urlPath);
	if (!file) return missing(`raw/${urlPath}`);
	const { meta, body } = splitFrontMatter(readText(file) ?? "");
	const url = meta.source_url ?? "";
	const { html, toc } = renderMarkdownWithToc(body, file);
	const head = `<div class="raw-head">
  <span class="doc-kind raw">원본 자료 · raw/${escapeHtml(urlPath)}</span>
  <div class="raw-row">
  <dl class="raw-meta">
    <div><dt>게시일</dt><dd>${escapeHtml(meta.published ?? "-")}</dd></div>
    <div><dt>수집일</dt><dd>${escapeHtml(meta.collected ?? "-")}</dd></div>
    ${meta.author ? `<div><dt>저자</dt><dd>${escapeHtml(meta.author)}</dd></div>` : ""}
  </dl>
  ${url ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(url)}" target="_blank" rel="noopener">${icon("external", 15)} 원문 보기</a>` : ""}
  </div>
  <p class="raw-note">사람이 넣은 원문입니다. 에이전트는 이 파일을 읽기만 하고 고치지 않습니다.</p>
</div>`;
	return ok(
		layout(
			meta.title ?? urlPath,
			"page",
			docShell({ crumb: `원본 자료 · ${escapeHtml(meta.title ?? urlPath)}`, title: meta.title ?? urlPath, html, head, extraClass: "raw", asideHtml: tocBlock(toc.filter((t) => t.depth === 2)) }),
		),
	);
}

export function askPage(): Page {
	const examples = ["하네스와 모델은 어떻게 다른가요?", "컨텍스트 엔지니어링이 왜 중요한가요?", "생성자와 평가자를 왜 나누나요?"];
	return ok(
		layout(
			"질문하기",
			"ask",
			`<section class="page-head center">
  <span class="eyebrow">${icon("ask", 14)} 위키 근거 답변</span>
  <h1>무엇이 궁금한가요?</h1>
  <p class="lede">가재코드 에이전트가 위키를 읽고 근거 페이지와 함께 답합니다.<br>읽기 도구(read · find · search)만 쓰고, AGENTS.md 규칙을 따릅니다.</p>
</section>
<section class="ask-wrap">
  <div id="sdk-status" class="status-pill">${icon("clock", 15)} 가재코드 연결을 확인하고 있어요...</div>
  <form id="ask-form" class="composer">
    <textarea id="question" rows="3" placeholder="예: 하네스와 모델은 어떻게 다른가요?"></textarea>
    <div class="composer-foot">
      <div class="chips">${examples.map((q) => `<button type="button" class="chip" data-q="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join("")}</div>
      <button type="submit" id="ask-button" class="btn btn-primary" disabled>${icon("send", 16)} 질문하기</button>
    </div>
  </form>
  <div id="thread" class="thread" hidden>
    <div class="bubble-q" id="asked"></div>
    <div class="answer-card">
      <div class="answer-head"><span class="answer-avatar">${icon("spark", 16)}</span><strong>가재코드 에이전트</strong><span id="progress" class="progress-text"></span></div>
      <div id="answer" class="doc-body answer-body"><div class="typing"><span></span><span></span><span></span></div></div>
      <div id="sources" class="answer-sources" hidden></div>
    </div>
  </div>
</section>`,
			["/static/ask.js"],
		),
	);
}

export function quizListPage(): Page {
	const items = listQuizzes()
		.map(
			(q, i) => `<a class="quiz-card" href="/quiz/${q.slug}">
  <span class="quiz-badge">Q${i + 1}</span>
  <strong>${escapeHtml(q.title)}</strong>
  <span class="quiz-meta">객관식 ${q.questions.length}문제 · 약 ${Math.max(1, q.questions.length)}분</span>
  <span class="card-cta">시작하기 ${icon("arrow", 15)}</span>
</a>`,
		)
		.join("\n");
	return ok(
		layout(
			"퀴즈",
			"quiz",
			`<section class="page-head">
  <span class="eyebrow">${icon("quiz", 14)} 이해도 확인</span>
  <h1>퀴즈</h1>
  <p class="lede">wiki/quizzes/ 의 문제를 풀어 봅니다. 가재코드에서 <code>/skill:wiki-quiz</code> 로 새 퀴즈를 만들 수 있어요.</p>
</section>
<div class="quiz-grid">${items || '<p class="muted">아직 퀴즈가 없어요.</p>'}</div>`,
		),
	);
}

export function quizPage(slug: string): Page {
	const quiz = readQuiz(slug);
	if (!quiz) return missing(`퀴즈 ${slug}`);
	const total = quiz.questions.length;
	const questions = quiz.questions
		.map(
			(q, i) => `<section class="quiz-q" data-answer="${q.answer}">
  <div class="quiz-q-head"><span class="quiz-badge">문제 ${i + 1}</span><span class="muted">${i + 1} / ${total}</span></div>
  <h2>${escapeHtml(q.question)}</h2>
  <div class="options">${q.options
		.map((o) => `<button type="button" class="option" data-key="${o.key}"><span class="option-key">${o.key}</span><span>${escapeHtml(o.text)}</span></button>`)
		.join("")}</div>
  <div class="feedback" hidden></div>
  <div class="explanation doc-body" hidden>${q.explanationHtml}</div>
</section>`,
		)
		.join("\n");
	const conceptLink = existsSync(join(wikiDir, "concepts", `${quiz.concept}.md`))
		? `<a class="text-link" href="/wiki/concepts/${quiz.concept}.md">${icon("book", 15)} 개념 페이지 먼저 읽기</a>`
		: "";
	return ok(
		layout(
			`퀴즈: ${quiz.title}`,
			"quiz",
			`<nav class="breadcrumb"><a href="/">홈</a><span>/</span><a href="/quiz">퀴즈</a><span>/</span><span>${escapeHtml(quiz.title)}</span></nav>
<section class="quiz-wrap">
  <header class="quiz-top">
    <div><h1>${escapeHtml(quiz.title)}</h1>${conceptLink}</div>
    <div class="quiz-progress"><div class="bar"><span id="bar-fill"></span></div><span id="progress-label">0 / ${total}</span></div>
  </header>
  ${questions}
  <div id="score" class="score-card" hidden></div>
</section>`,
			["/static/quiz.js"],
		),
	);
}
