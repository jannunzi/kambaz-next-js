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

describe("TailwindGrids", () => {
  it("shows 4 columns, then 3 columns, then the grid system in the book and the lab file", () => {
    const file = read("app/labs/lab2/tailwind/TailwindGrids.tsx");
    const book = read("app/book/ch2/sections/IconsAndTailwind.tsx");
    const four = file.indexOf("4 Columns Grid");
    const three = file.indexOf("3 Columns Grid");
    const system = file.indexOf("Grid system");
    assert.ok(four >= 0 && three > four && system > three);
    assert.ok(book.includes(file.trim()));
    assert.match(file, /<h3 className="mt-6 text-3xl font-bold">3 Columns Grid<\/h3>/);
    assert.match(file, /grid-cols-3/);
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

describe("Lab 2 lecture listings of a whole component", () => {
  it("matches the lab file when the slide function name is that file", () => {
    const mismatches: string[] = [];
    for (const deck of walk("lib/lectures/decks")) {
      const src = read(deck);
      const re =
        /code:\s*`([\s\S]*?)`,\s*\n\s*codeLanguage:[^\n]*\n\s*codeFile:\s*"([^"]+)"/g;
      let match: RegExpExecArray | null;
      while ((match = re.exec(src))) {
        const code = match[1];
        const file = match[2];
        if (!file.startsWith("app/labs/lab2/") || !file.endsWith(".tsx")) continue;
        const fn = code.match(/export default function (\w+)/)?.[1];
        const base = file.split("/").pop()?.replace(/\.tsx$/, "");
        if (!fn || fn !== base) continue;
        if (code.trim() !== read(file).trim()) mismatches.push(`${deck} ${file}`);
      }
    }
    assert.deepEqual(mismatches, []);
  });
});
