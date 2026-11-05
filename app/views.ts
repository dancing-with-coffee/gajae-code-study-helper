// HTML templates. Plain strings, no framework, so learners can read it easily.
import { escapeHtml } from "./wiki.ts";

type NavKey = "home" | "ask" | "quiz" | "page";

// Small inline icons (stroke icons, 24x24 grid).
const iconPaths: Record<string, string> = {
	home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
	ask: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
	quiz: '<path d="M9 11l2 2 4-4"/><rect x="3" y="4" width="18" height="16" rx="3"/>',
	arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
	book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M4 19V5"/>',
	file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/>',
	link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
	spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
	clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
	external: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
	send: '<path d="M4 12 20 4l-6 16-3-7Z"/>',
};

export function icon(name: string, size = 18): string {
	return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] ?? ""}</svg>`;
}

const logoMark = `<svg class="logo-mark" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
  <rect width="32" height="32" rx="9" fill="var(--brand)"/>
  <path d="M10 21c0-4.5 2.7-8 6-8s6 3.5 6 8" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M12.5 13.5 10 9M19.5 13.5 22 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="13.6" cy="18" r="1.3" fill="#fff"/><circle cx="18.4" cy="18" r="1.3" fill="#fff"/>
</svg>`;

export function layout(title: string, nav: NavKey, body: string, scripts: string[] = []): string {
	const link = (key: NavKey, href: string, label: string) =>
		`<a href="${href}" class="nav-link${nav === key ? " active" : ""}">${icon(key, 17)}<span>${label}</span></a>`;
	return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · Harness Study</title>
<link rel="preload" href="/static/fonts/PretendardVariable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/static/style.css">
</head>
<body>
<header class="topbar">
  <div class="topbar-inner">
    <a href="/" class="brand">${logoMark}<span class="brand-text"><strong>Harness Study</strong><small>하네스 공부 도우미</small></span></a>
    <nav class="nav">
      ${link("home", "/", "홈")}
      ${link("ask", "/ask", "질문하기")}
      ${link("quiz", "/quiz", "퀴즈")}
    </nav>
  </div>
</header>
<main class="container">
${body}
</main>
<footer class="footer">
  <div class="container footer-inner">
    <span>${logoMark}<strong>Harness Study</strong></span>
    <span>가재코드로 만든 LLM 위키 · 위키 파일이 바뀌면 새로고침만 하면 됩니다</span>
  </div>
</footer>
${scripts.map((src) => `<script src="${src}"></script>`).join("\n")}
</body>
</html>`;
}

export function notFound(what: string): string {
	return layout(
		"찾을 수 없음",
		"page",
		`<section class="empty-state"><div class="empty-code">404</div><h1>페이지를 찾을 수 없어요</h1><p>${escapeHtml(what)}</p><a class="btn btn-primary" href="/">홈으로 가기</a></section>`,
	);
}
