/**
 * Fail when rendered HTML or JSX source glues a word to link text
 * (`fromChapter`). Pass HTML files or directories to scan rendered pages.
 * With no arguments, scans app and lib TSX source.
 *
 *   tsx scripts/check-link-spacing.ts
 *   tsx scripts/check-link-spacing.ts .next/server/app
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { gluedLinkBoundaries } from "../lib/link-spacing";
import { gluedJsxLinkBoundaries } from "../lib/link-spacing-jsx";

function walk(dir: string, exts: string[], out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "webdev-server") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, exts, out);
    else if (exts.some((ext) => path.endsWith(ext))) out.push(path);
  }
  return out;
}

function scanSource(root: string): string[] {
  const lines: string[] = [];
  for (const file of walk(root, [".tsx"])) {
    const hits = gluedJsxLinkBoundaries(file, readFileSync(file, "utf8"));
    for (const hit of hits) {
      lines.push(`${relative(root, file)}:${hit.line} ${hit.side} ${hit.snippet}`);
    }
  }
  return lines;
}

function scanHtml(path: string): string[] {
  const files = statSync(path).isDirectory()
    ? walk(path, [".html"])
    : [path];
  const lines: string[] = [];
  for (const file of files) {
    const hits = gluedLinkBoundaries(readFileSync(file, "utf8"));
    for (const hit of hits) {
      lines.push(`${file} ${hit.side} ${hit.snippet}`);
    }
  }
  return lines;
}

const args = process.argv.slice(2);
const hits = args.length === 0 ? scanSource(process.cwd()) : args.flatMap(scanHtml);

if (hits.length === 0) {
  console.log(args.length === 0 ? "no glued link boundaries in TSX" : "no glued link boundaries in HTML");
  process.exit(0);
}

console.error(hits.join("\n"));
process.exit(1);
