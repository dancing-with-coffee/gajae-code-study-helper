import { resolve } from "node:path";

export const rootDir = resolve(import.meta.dir, "..");
export const wikiDir = resolve(rootDir, "wiki");
export const rawDir = resolve(rootDir, "raw");
