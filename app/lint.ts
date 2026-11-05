// Mechanical wiki checks used by the wiki-lint skill: `bun run lint`
// Checks: broken links, concept pages without a source section,
// paragraphs without a source link, orphan pages, raw files without a summary page.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const rootDir = resolve(import.meta.dir, "..");
const wikiDir = join(rootDir, "wiki");
const rawDir = join(rootDir, "raw");

type Issue = { kind: string; file: string; detail: string };
const issues: Issue[] = [];

function listMarkdown(dir: string): string[] {
	if (!existsSync(dir)) return [];
	const out: string[] = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...listMarkdown(full));
		else if (entry.name.endsWith(".md")) out.push(full);
	}
	return out;
}

function stripCode(text: string): string {
	return text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
}

function extractLinks(text: string): string[] {
	const links: string[] = [];
	for (const match of stripCode(text).matchAll(/\]\(([^)\s]+)\)/g)) links.push(match[1]);
	return links;
}

const wikiFiles = listMarkdown(wikiDir);
const inbound = new Map<string, number>();
for (const file of wikiFiles) inbound.set(file, 0);

for (const file of wikiFiles) {
	const text = readFileSync(file, "utf8");
	const rel = relative(rootDir, file);

	// 1. Broken links
	for (const link of extractLinks(text)) {
		if (/^(https?:|mailto:|#)/.test(link)) continue;
		const target = resolve(dirname(file), link.split("#")[0]);
		if (!existsSync(target)) {
			issues.push({ kind: "깨진 링크", file: rel, detail: link });
		} else if (inbound.has(target) && target !== file) {
			inbound.set(target, (inbound.get(target) ?? 0) + 1);
		}
	}

	if (!file.includes(`${join("wiki", "concepts")}`)) continue;

	// 2. Concept page format
	const required = ["## 왜 중요한가", "## 핵심 내용", "## 관련 개념", "## 출처"];
	for (const heading of required) {
		if (!text.includes(heading)) issues.push({ kind: "형식 누락", file: rel, detail: `${heading} 섹션이 없음` });
	}
	const sourceSection = text.split("## 출처")[1] ?? "";
	if (!/\.\.\/\.\.\/raw\/[^)]+\.md/.test(sourceSection)) {
		issues.push({ kind: "출처 없음", file: rel, detail: "## 출처 섹션에 raw 파일 링크가 없음" });
	}

	// 3. Paragraphs without a source link (inside 왜 중요한가 / 핵심 내용)
	const body = text.split("## 관련 개념")[0].split("## 왜 중요한가")[1] ?? "";
	const blocks = stripCode(body)
		.split(/\n\s*\n/)
		.map((b) => b.trim())
		.filter((b) => b && !b.startsWith("#") && !b.startsWith("|"));
	for (const block of blocks) {
		const items = block.startsWith("- ") ? block.split(/\n(?=- )/) : [block];
		for (const item of items) {
			if (!/\(\.\.\/\.\.\/raw\/[^)]+\.md\)/.test(item)) {
				issues.push({ kind: "출처 없는 문장", file: rel, detail: item.slice(0, 60).replace(/\n/g, " ") });
			}
		}
	}
	// Tables must be followed by a source link line
	for (const tableMatch of body.matchAll(/((?:^\|.*\n)+)\n?([^\n]*)/gm)) {
		if (!/\(\.\.\/\.\.\/raw\/[^)]+\.md\)/.test(tableMatch[2] ?? "")) {
			issues.push({ kind: "출처 없는 표", file: rel, detail: "표 바로 아래에 출처 링크가 없음" });
		}
	}
}

// 4. Orphan pages (no inbound link from any other wiki page)
for (const [file, count] of inbound) {
	const rel = relative(rootDir, file);
	if (rel === join("wiki", "index.md") || rel === join("wiki", "log.md")) continue;
	if (count === 0) issues.push({ kind: "고아 페이지", file: rel, detail: "어디에서도 링크되지 않음" });
}

// 5. Raw files without a summary page, and raw front matter
for (const rawFile of listMarkdown(rawDir)) {
	const name = relative(rawDir, rawFile);
	if (!existsSync(join(wikiDir, "sources", name))) {
		issues.push({ kind: "요약 없음", file: relative(rootDir, rawFile), detail: `wiki/sources/${name} 가 없음 (ingest 필요)` });
	}
	const head = readFileSync(rawFile, "utf8").slice(0, 600);
	for (const key of ["title:", "source_url:", "published:", "collected:"]) {
		if (!head.includes(key)) issues.push({ kind: "raw 정보 누락", file: relative(rootDir, rawFile), detail: `${key} 없음` });
	}
}

console.log(`위키 기계 검사: 페이지 ${wikiFiles.length}개, 오류 ${issues.length}개`);
for (const issue of issues) console.log(`- [${issue.kind}] ${issue.file} — ${issue.detail}`);
process.exit(issues.length > 0 ? 1 : 0);
