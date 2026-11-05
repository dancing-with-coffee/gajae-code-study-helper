// HTML templates. Plain strings, no framework, so learners can read it easily.
import { escapeHtml } from "./wiki.ts";

type NavKey = "home" | "ask" | "quiz" | "page";

export function layout(title: string, nav: NavKey, body: string, scripts: string[] = []): string {
	const link = (key: NavKey, href: string, label: string) =>
		`<a href="${href}" class="${nav === key ? "active" : ""}">${label}</a>`;
	return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · 하네스 공부 도우미</title>
<link rel="stylesheet" href="/static/style.css">
</head>
<body>
<header class="topbar">
  <a href="/" class="brand">🦞 하네스 공부 도우미</a>
  <nav>
    ${link("home", "/", "홈")}
    ${link("ask", "/ask", "질문하기")}
    ${link("quiz", "/quiz", "퀴즈")}
  </nav>
</header>
<main>
${body}
</main>
<footer class="footer">위키 파일(wiki/)이 바뀌면 새로고침만 하면 됩니다.</footer>
${scripts.map((src) => `<script src="${src}"></script>`).join("\n")}
</body>
</html>`;
}

export function notFound(what: string): string {
	return layout("찾을 수 없음", "page", `<h1>찾을 수 없어요</h1><p>${escapeHtml(what)}</p><p><a href="/">홈으로</a></p>`);
}
