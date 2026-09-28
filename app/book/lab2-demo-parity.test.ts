import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

function read(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

type Snippet = {
  book: string;
  name: string;
  file: string;
  code: string;
};

/** Code blocks in document order, then the live demo that follows each one. */
function listingsBeforeDemos(bookPath: string): Array<Snippet & { demoName: string; demoFile: string }> {
  const src = read(bookPath);
  const re = /<CodeBlock\b([^>]*)>(\{`)([\s\S]*?)(`\})<\/CodeBlock>|<LiveDemo\b([^>]*?)>/g;
  const out: Array<Snippet & { demoName: string; demoFile: string }> = [];
  let pending: Snippet | null = null;
  let match: RegExpExecArray | null;
  while ((match = re.exec(src))) {
    if (match[0].startsWith("<LiveDemo")) {
      const attrs = match[5];
      if (pending) {
        out.push({
          ...pending,
          demoName: attrs.match(/name="([^"]+)"/)?.[1] ?? "",
          demoFile: attrs.match(/file="([^"]+)"/)?.[1] ?? "",
        });
        pending = null;
      }
      continue;
    }
    pending = {
      book: bookPath,
      name: match[1].match(/name="([^"]+)"/)?.[1] ?? "",
      file: match[1].match(/file="([^"]+)"/)?.[1] ?? "",
      code: match[3],
    };
  }
  return out;
}

const LAB2_BOOKS = [
  "app/book/ch2/sections/CssBasics.tsx",
  "app/book/ch2/sections/CssProperties.tsx",
  "app/book/ch2/sections/IconsAndTailwind.tsx",
];

describe("Lab 2 finished demo listings", () => {
  const finished = LAB2_BOOKS.flatMap(listingsBeforeDemos).filter((listing) => {
    const fn = listing.code.match(/export default function (\w+)/)?.[1];
    return (
      fn &&
      fn === listing.demoName &&
      listing.file.startsWith("app/labs/lab2/") &&
      listing.demoFile === listing.file
    );
  });

  it("finds a finished listing for every Tailwind sample and the CSS samples", () => {
    const names = finished.map((listing) => listing.demoName);
    for (const name of [
      "ForegroundColors",
      "BackgroundColors",
      "Borders",
      "Padding",
      "Margins",
      "BoxModel",
      "Corners",
      "Dimensions",
      "Display",
      "Positions",
      "Zindex",
      "Float",
      "GridLayout",
      "Flex",
      "MediaQueriesDemo",
      "ReactIconsSampler",
      "TailwindSpacing",
      "TailwindTypography",
      "TailwindBackgroundColors",
      "TailwindResponsiveDesign",
      "TailwindFilters",
      "TailwindGrids",
    ]) {
      assert.ok(names.includes(name), name);
    }
  });

  for (const listing of finished) {
    it(`${listing.demoName} code is the file the figure renders`, () => {
      assert.equal(listing.code.trim(), read(listing.file).trim());
    });
  }
});

function plain(html: string): string {
  return html
    .replace(/\{`[\s\S]*?`\}/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{["']\s*["']\}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function norm(source: string): string {
  return source.replace(/\s+/g, " ").trim();
}

type Step = { file: string; code: string; prose: string; language: string };

function bookSteps(bookPath: string): Step[] {
  const src = read(bookPath);
  const re = /<CodeBlock\b([^>]*)>(\{`)([\s\S]*?)(`\})<\/CodeBlock>/g;
  const steps: Step[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(src))) {
    steps.push({
      file: match[1].match(/file="([^"]+)"/)?.[1] ?? "",
      language: match[1].match(/language="([^"]+)"/)?.[1] ?? "",
      code: match[3],
      prose: plain(src.slice(last, match.index)),
    });
    last = match.index + match[0].length;
  }
  return steps;
}

function isFullFunction(code: string): boolean {
  return /export default function \w+/.test(code);
}

/** Close the <div> that starts at `open`, counting nested div tags. */
function closeOfDiv(source: string, open: number): number {
  const tagRe = /<\/?div\b[^>]*>/g;
  tagRe.lastIndex = open;
  let depth = 0;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(source))) {
    if (match[0].startsWith("</")) depth -= 1;
    else depth += 1;
    if (depth === 0) return match.index + match[0].length;
  }
  return -1;
}

/** Insert `fragment` after the div that wraps `heading`, as a "paste after" step says. */
function insertAfterHeading(source: string, heading: string, fragment: string): string | null {
  const at = source.indexOf(`>${heading}<`);
  if (at < 0) return null;
  const h3 = source.lastIndexOf("<h3", at);
  const h2 = source.lastIndexOf("<h2", at);
  const headingTag = Math.max(h3, h2);
  if (headingTag < 0) return null;
  const open = Math.max(source.lastIndexOf("<div>", headingTag), source.lastIndexOf("<div ", headingTag));
  if (open < 0) return null;
  const end = closeOfDiv(source, open);
  if (end < 0) return null;
  const piece = fragment.replace(/^\n/, "").replace(/\s+$/, "");
  return `${source.slice(0, end)}\n${piece}${source.slice(end)}`;
}

/**
 * Apply a section's TSX steps in order.
 * A full function seeds the file. Later "Paste the TSX below after the …" fragments
 * are inserted at that heading. A trailing full listing is the answer key, not a step.
 * Returns null when the cues are not insert-after-heading steps (impractical to simulate).
 */
function assembleSteps(steps: Step[]): string | null {
  const inserts = steps.filter((step) => !isFullFunction(step.code));
  if (inserts.length === 0) {
    const fulls = steps.filter((step) => isFullFunction(step.code));
    return fulls.length ? fulls[fulls.length - 1].code : null;
  }
  const firstInsert = steps.findIndex((step) => !isFullFunction(step.code));
  const seed = [...steps.slice(0, firstInsert)].reverse().find((step) => isFullFunction(step.code));
  if (!seed) return null;
  let doc = seed.code;
  for (const step of steps.slice(firstInsert)) {
    if (isFullFunction(step.code)) continue;
    const after = step.prose.match(/paste the tsx below after the ([^,.<]+)/i);
    if (!after) return null;
    const next = insertAfterHeading(doc, after[1].trim(), step.code);
    if (next == null) return null;
    doc = next;
  }
  return doc;
}

const LAB2_COMPONENT_STEPS = LAB2_BOOKS.flatMap(bookSteps).filter(
  (step) =>
    step.file.startsWith("app/labs/lab2/") &&
    step.file.endsWith(".tsx") &&
    !step.file.endsWith("/page.tsx") &&
    (step.language === "" || step.language === "tsx"),
);

describe("Lab 2 multi-step paste parity", () => {
  const byFile = new Map<string, Step[]>();
  for (const step of LAB2_COMPONENT_STEPS) {
    const list = byFile.get(step.file) ?? [];
    list.push(step);
    byFile.set(step.file, list);
  }

  const simulated: string[] = [];
  const fallback: string[] = [];

  for (const [file, steps] of byFile) {
    const assembled = assembleSteps(steps);
    const disk = read(file);
    if (assembled != null && norm(assembled) === norm(disk)) {
      simulated.push(file);
      continue;
    }
    const lastFull = [...steps].reverse().find((step) => isFullFunction(step.code));
    if (lastFull && lastFull.code.trim() === disk.trim()) {
      fallback.push(file);
      continue;
    }
    it(`${file} steps reproduce the file`, () => {
      assert.equal(norm(assembled ?? ""), norm(disk));
    });
  }

  it("reproduces each component from its steps when the cues can be applied", () => {
    assert.ok(simulated.includes("app/labs/lab2/tailwind/TailwindGrids.tsx"));
    assert.ok(simulated.includes("app/labs/lab2/Flex.tsx"));
    assert.ok(simulated.includes("app/labs/lab2/ForegroundColors.tsx"));
  });

  it("keeps a finished listing where paste simulation is impractical", () => {
    assert.deepEqual(fallback, ["app/labs/lab2/Positions.tsx"]);
  });
});

describe("TailwindGrids", () => {
  it("paste steps add 4 columns, then 3 columns, then the grid system h2", () => {
    const file = read("app/labs/lab2/tailwind/TailwindGrids.tsx");
    const steps = bookSteps("app/book/ch2/sections/IconsAndTailwind.tsx").filter(
      (step) => step.file === "app/labs/lab2/tailwind/TailwindGrids.tsx",
    );
    const incremental = steps.filter((step) => step.code.trim() !== file.trim());
    const pasted = incremental.map((step) => step.code).join("\n");
    assert.match(pasted, /<h2>Tailwind Grids<\/h2>/);
    assert.match(pasted, /export default function TailwindGrids/);
    assert.match(pasted, /<h3 className="mt-6 text-3xl font-bold">4 Columns Grid<\/h3>/);
    assert.match(pasted, /<h3 className="mt-6 text-3xl font-bold">3 Columns Grid<\/h3>/);
    assert.match(pasted, /<h2>Grid system<\/h2>/);
    assert.match(incremental[1]?.prose ?? "", /paste the tsx below after the 4 Columns Grid/i);
    assert.match(incremental[2]?.prose ?? "", /paste the tsx below after the 3 Columns Grid/i);
    assert.equal(norm(assembleSteps(steps) ?? ""), norm(file));
    assert.equal(steps[steps.length - 1].code.trim(), file.trim());
    assert.doesNotMatch(
      file.slice(file.indexOf("3 Columns Grid"), file.indexOf("Grid system")),
      /md:|sm:|lg:/,
    );
  });
});

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, acc);
    else if (path.endsWith(".ts")) acc.push(path);
  }
  return acc;
}

/** Drop the lab file's PDF-exercise comments so a slide can omit them. */
function withoutPdfComments(code: string): string {
  return code
    .split("\n")
    .filter((line) => !/PDF exercise|runs out of the box/.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Pair each `codeFile` with the `code` template that belongs to that slide. */
function slideCodeFiles(src: string): Array<{ code: string; file: string }> {
  const out: Array<{ code: string; file: string }> = [];
  const fileRe = /\n[ \t]*codeFile:\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = fileRe.exec(src))) {
    const head = src.slice(0, match.index);
    const langAt = head.lastIndexOf("codeLanguage:");
    const close = head.lastIndexOf("`", langAt);
    const open = head.lastIndexOf("code: `", close);
    if (langAt < 0 || close < 0 || open < 0) continue;
    out.push({ code: head.slice(open + "code: `".length, close), file: match[1] });
  }
  return out;
}

describe("Lab 2 lecture listings of a whole component", () => {
  it("matches the lab file, or the same book step, when the slide function name is that file", () => {
    const bookStepsFor = new Map<string, Set<string>>();
    for (const step of LAB2_COMPONENT_STEPS) {
      const codes = bookStepsFor.get(step.file) ?? new Set<string>();
      codes.add(step.code.trim());
      bookStepsFor.set(step.file, codes);
    }
    const mismatches: string[] = [];
    for (const deck of walk("lib/lectures/decks")) {
      for (const listing of slideCodeFiles(read(deck))) {
        const { code, file } = listing;
        if (!file.startsWith("app/labs/lab2/") || !file.endsWith(".tsx")) continue;
        const fn = code.match(/export default function (\w+)/)?.[1];
        const base = file.split("/").pop()?.replace(/\.tsx$/, "");
        if (!fn || fn !== base) continue;
        const trimmed = code.trim();
        const onDisk = read(file).trim();
        if (trimmed === onDisk) continue;
        // A slide may copy one book step that starts with `export default function`
        // instead of the finished lab file.
        if (bookStepsFor.get(file)?.has(trimmed)) continue;
        // The filters slide omits the lab file's PDF-exercise comments.
        if (withoutPdfComments(trimmed) === withoutPdfComments(onDisk)) continue;
        mismatches.push(`${deck} ${file}`);
      }
    }
    assert.deepEqual(mismatches, []);
  });
});
