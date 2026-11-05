// Reads wiki/ and raw/ files on every request (no build step, refresh shows changes).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { Marked, Renderer } from "marked";
import { rawDir, rootDir, wikiDir } from "./paths.ts";

export type IndexEntry = { title: string; href: string; summary: string };
export type QuizQuestion = { question: string; options: { key: string; text: string }[]; answer: string; explanationHtml: string };
export type Quiz = { slug: string; title: string; concept: string; questions: QuizQuestion[] };

export function escapeHtml(text: string): string {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Turn a repository file path into the URL the web app serves it at.
export function routeForFile(absPath: string): string | null {
	const rel = relative(rootDir, absPath).split(sep).join("/");
	if (rel.startsWith("wiki/quizzes/") && rel.endsWith(".md")) return `/quiz/${rel.slice("wiki/quizzes/".length, -3)}`;
	if (rel === "wiki/index.md") return "/";
	if (rel.startsWith("wiki/") && rel.endsWith(".md")) return `/${rel}`;
	if (rel.startsWith("raw/") && rel.endsWith(".md")) return `/${rel}`;
	return null;
}

function rewriteHref(href: string, fromFile: string): { href: string; external: boolean } {
	if (/^https?:\/\//.test(href)) return { href, external: true };
	if (href.startsWith("#") || href.startsWith("/")) return { href, external: false };
	const [pathPart, hash] = href.split("#");
	const route = routeForFile(resolve(dirname(fromFile), pathPart));
	return { href: (route ?? href) + (hash ? `#${hash}` : ""), external: false };
}

export type TocItem = { id: string; text: string; depth: number };

export function renderMarkdown(markdown: string, fromFile: string): string {
	return renderMarkdownWithToc(markdown, fromFile).html;
}

export function renderMarkdownWithToc(markdown: string, fromFile: string): { html: string; toc: TocItem[] } {
	const toc: TocItem[] = [];
	const marked = new Marked({ gfm: true });
	marked.use({
		renderer: {
			heading({ tokens, depth }) {
				const text = this.parser.parseInline(tokens);
				if (depth === 1) return `<h1>${text}</h1>\n`;
				const id = `section-${toc.length + 1}`;
				toc.push({ id, text: text.replace(/<[^>]+>/g, ""), depth });
				return `<h${depth} id="${id}">${text}</h${depth}>\n`;
			},
			table(token) {
				return `<div class="table-wrap">${Renderer.prototype.table.call(this, token)}</div>`;
			},
			link({ href, tokens }) {
				const text = this.parser.parseInline(tokens);
				const target = rewriteHref(href, fromFile);
				const isSource = target.href.startsWith("/raw/");
				const attrs = target.external ? ' target="_blank" rel="noopener"' : "";
				const cls = isSource ? ' class="source-link"' : "";
				return `<a href="${escapeHtml(target.href)}"${attrs}${cls}>${text}</a>`;
			},
			html({ text }) {
				return escapeHtml(text);
			},
		},
	});
	// "문장. ([출처](...))" → show the source as a chip without the surrounding parentheses.
	let cleaned = markdown.replace(/\((\[출처\]\([^)\s]+\))\)/g, "$1");
	// CommonMark does not close **bold** when ")" is followed directly by a Korean particle
	// (e.g. **하네스(harness)**를). Mark those spans and turn them into <strong> afterwards.
	cleaned = cleaned.replace(/\*\*([^*\n]*?[)\]"'])\*\*(?=[\uAC00-\uD7A3])/g, "\u0001$1\u0002");
	const html = (marked.parse(cleaned, { async: false }) as string).replace(/\u0001/g, "<strong>").replace(/\u0002/g, "</strong>");
	return { html, toc };
}

export function splitFrontMatter(text: string): { meta: Record<string, string>; body: string } {
	const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!match) return { meta: {}, body: text };
	const meta: Record<string, string> = {};
	for (const line of match[1].split("\n")) {
		const kv = line.match(/^([a-z_]+):\s*(.*)$/);
		if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1");
	}
	return { meta, body: text.slice(match[0].length) };
}

export function readText(absPath: string): string | null {
	try {
		return readFileSync(absPath, "utf8");
	} catch {
		return null;
	}
}

// Resolve a URL path like "concepts/x.md" safely inside a base directory.
export function safeResolve(baseDir: string, urlPath: string): string | null {
	const abs = resolve(baseDir, decodeURIComponent(urlPath));
	if (!abs.startsWith(baseDir + sep) || !abs.endsWith(".md")) return null;
	return existsSync(abs) ? abs : null;
}

export function pageTitle(markdown: string, fallback: string): string {
	return markdown.match(/^#\s+(.+)$/m)?.[1].trim() ?? fallback;
}

function sectionLines(markdown: string, heading: string): string[] {
	const parts = markdown.split(/^## /m);
	const section = parts.find((p) => p.startsWith(heading));
	return section ? section.split("\n").slice(1) : [];
}

export function readIndexSection(heading: string): IndexEntry[] {
	const indexFile = resolve(wikiDir, "index.md");
	const text = readText(indexFile) ?? "";
	const entries: IndexEntry[] = [];
	for (const line of sectionLines(text, heading)) {
		const m = line.match(/^- \[([^\]]+)\]\(([^)]+)\)\s*(?:[—-]\s*(.*))?$/);
		if (m) entries.push({ title: m[1], href: rewriteHref(m[2], indexFile).href, summary: m[3] ?? "" });
	}
	return entries;
}

export function readRecentLog(count: number): string[] {
	const text = readText(resolve(wikiDir, "log.md")) ?? "";
	return text
		.split("\n")
		.filter((line) => /^- \[\d{4}-\d{2}-\d{2}\]/.test(line))
		.slice(-count)
		.reverse()
		.map((line) => line.slice(2));
}

export function listQuizzes(): Quiz[] {
	const dir = resolve(wikiDir, "quizzes");
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((name) => name.endsWith(".md"))
		.sort()
		.map((name) => readQuiz(name.slice(0, -3)))
		.filter((quiz): quiz is Quiz => quiz !== null);
}

export function readQuiz(slug: string): Quiz | null {
	if (!/^[a-z0-9-]+$/.test(slug)) return null;
	const file = resolve(wikiDir, "quizzes", `${slug}.md`);
	const text = readText(file);
	if (text === null) return null;
	const { meta, body } = splitFrontMatter(text);
	const questions: QuizQuestion[] = [];
	for (const block of body.split(/^## /m).slice(1)) {
		if (!/^문제\s*\d+/.test(block)) continue;
		const lines = block.split("\n").slice(1);
		const options: { key: string; text: string }[] = [];
		const questionLines: string[] = [];
		let answer = "";
		let explanation = "";
		let inExplanation = false;
		for (const line of lines) {
			const opt = line.match(/^- ([A-D])\)\s*(.+)$/);
			const ans = line.match(/^정답:\s*([A-D])/);
			const exp = line.match(/^해설:\s*(.*)$/);
			if (opt) options.push({ key: opt[1], text: opt[2] });
			else if (ans) answer = ans[1];
			else if (exp) {
				explanation = exp[1];
				inExplanation = true;
			} else if (inExplanation && line.trim()) explanation += ` ${line.trim()}`;
			else if (!answer && options.length === 0 && line.trim()) questionLines.push(line.trim());
		}
		if (options.length >= 2 && answer) {
			questions.push({ question: questionLines.join(" "), options, answer, explanationHtml: renderMarkdown(explanation, file) });
		}
	}
	return { slug, title: meta.title || pageTitle(body, slug).replace(/^퀴즈:\s*/, ""), concept: meta.concept ?? slug, questions };
}

export { rawDir, wikiDir };
