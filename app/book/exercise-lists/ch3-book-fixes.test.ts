import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { CH3_KAMBAZ_EXERCISES, CH3_LAB_EXERCISES } from "./catalogs.ts";

function read(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8");
}

function unescapeTemplate(raw: string): string {
  return raw.replace(/\\([`\\$])/g, "$1");
}

/** Every <CodeBlock …>{`…`}</CodeBlock> in a book file, in order. */
function blocks(path: string): Array<{ attrs: string; file: string; name: string; body: string }> {
  const src = read(path);
  const out: Array<{ attrs: string; file: string; name: string; body: string }> = [];
  const re = /<CodeBlock\b([^>]*)>\{`([\s\S]*?)`\}<\/CodeBlock>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(src))) {
    out.push({
      attrs: match[1],
      file: match[1].match(/file="([^"]+)"/)?.[1] ?? "",
      name: match[1].match(/name="([^"]+)"/)?.[1] ?? "",
      body: unescapeTemplate(match[2]),
    });
  }
  return out;
}

const KAMBAZ = "app/book/ch3/sections/KambazData.tsx";
const STYLING = "app/book/ch3/sections/StylingAndComponents.tsx";
const DATA = "app/book/ch3/sections/DataStructures.tsx";
const FILES = ["courses", "modules", "assignments", "users", "enrollments"];

describe("Chapter 3 book fixes (A3 walkthrough)", () => {
  it("publishes the reference JSON files students download, identical to the demo data", () => {
    for (const name of FILES) {
      assert.equal(
        read(`public/downloads/kambaz-database/${name}.json`),
        read(`app/(kambaz)/database/${name}.json`),
        `${name}.json download drifted from the reference database`,
      );
      assert.match(read(KAMBAZ), new RegExp(`/downloads/kambaz-database/${name}\\.json`));
    }
  });

  it("grows index.ts one import at a time, after each file is downloaded", () => {
    const src = read(KAMBAZ);
    const index = blocks(KAMBAZ).filter((block) => block.file === "app/(kambaz)/database/index.ts");
    const imported = index.map((block) =>
      FILES.filter((name) => block.body.includes(`./${name}.json`)),
    );
    assert.deepEqual(imported, [
      ["courses"],
      ["courses", "modules"],
      ["courses", "modules", "assignments"],
      FILES,
    ]);
    // Each later file's download link comes before the first index.ts that
    // imports it. (§3.9.2 shows the one-line index.ts first, then downloads
    // courses.json right below it, before anything builds.)
    for (const name of FILES) {
      const download = src.indexOf(`/downloads/kambaz-database/${name}.json`);
      const firstImport = src.indexOf(`import ${name} from "./${name}.json"`);
      assert.ok(download > 0 && firstImport > 0, name);
      if (name === "courses") {
        assert.ok(download - firstImport < 1000, "courses.json download is not next to its import");
      } else {
        assert.ok(download < firstImport, `${name}.json is imported before it is downloaded`);
      }
    }
    // Only the final, complete listing carries the name the demo parity test pins.
    assert.deepEqual(
      index.map((block) => block.name),
      ["", "", "", "database"],
    );
  });

  it("imports the database four levels up from the Assignment Editor", () => {
    const editor = blocks(KAMBAZ).find((block) => block.name === "AssignmentEditor");
    assert.ok(editor);
    assert.equal(editor.file, "app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx");
    assert.match(editor.body, /import \* as db from "\.\.\/\.\.\/\.\.\/\.\.\/database";/);
    // Every Kambaz listing's relative import resolves to app/(kambaz)/database.
    for (const block of blocks(KAMBAZ)) {
      const rel = block.body.match(/from "((?:\.\.\/)+)database"/)?.[1];
      if (!rel || !block.file.startsWith("app/(kambaz)/")) continue;
      const depth = block.file.split("/").length - 3; // folders below app/(kambaz)
      assert.equal(rel.length / 3, depth, `${block.name || block.file} imports ${rel}database`);
    }
  });

  it("types the §3.4.17 house so the On your own / With AI reads build", () => {
    const listing = blocks(DATA).find((block) => block.name === "OptionalChaining");
    assert.ok(listing);
    assert.match(listing.body, /garage\?: \{ cars: number \}/);
    assert.match(listing.body, /zip\?: string/);
    assert.match(listing.body, /const house: House = \{/);
    assert.equal(read("app/labs/lab3/OptionalChaining.tsx").trim(), listing.body.trim());
  });

  it("gives students a TOC that works on their site and shows the active lab", () => {
    const toc = blocks(STYLING).find((block) => block.name === "TOC");
    assert.ok(toc);
    assert.doesNotMatch(toc.body, /\/book\/|intermediates/);
    assert.match(toc.body, /aria-current=\{active \? "page" : undefined\}/);
    assert.match(toc.body, /style=\{active \? activeStyle : undefined\}/);
    assert.match(read(STYLING), /Replace the whole file/);
    assert.doesNotMatch(read(STYLING), /blue pill classes/);
  });

  it("says Client Components also prerender on the server", () => {
    const text = read(STYLING);
    assert.doesNotMatch(text, /run only in the browser|exclusively in the browser/);
    assert.match(text, /rendered once on the server/);
  });

  it("matches the figures: no Course prefix, one highlighted nav item", () => {
    const crumb = blocks(KAMBAZ).find((block) => block.name === "Breadcrumb");
    assert.ok(crumb);
    assert.match(crumb.body, /\{course\?\.name\} &gt; \{label\}/);
    assert.doesNotMatch(crumb.body, /Course \{course/);
    assert.equal(read("app/(kambaz)/courses/[cid]/Breadcrumb.tsx").trim(), crumb.body.trim());
    const nav = blocks(KAMBAZ).find((block) => block.name === "KambazNavigation");
    assert.ok(nav);
    assert.doesNotMatch(nav.body, /pathname\.includes\("\/dashboard"\) \|\| pathname\.includes\("\/courses"\)/);
  });

  it("never asks students to match ids, and ids never cost points", () => {
    for (const file of [KAMBAZ, STYLING]) {
      const text = read(file);
      assert.doesNotMatch(text, /match the ids/);
      assert.match(text, /a\s+missing id never\s+costs points/);
    }
  });

  it("states a checkable requirement for every Chapter 3 checklist item", () => {
    for (const group of [...CH3_LAB_EXERCISES, ...CH3_KAMBAZ_EXERCISES]) {
      for (const task of group.tasks) {
        assert.doesNotMatch(task.description, /^Complete (each section's|the) (On your own|With AI)/, task.id);
        assert.doesNotMatch(task.description, /\bwd-[a-z]/, `${task.id} names an id`);
        assert.ok(task.description.length >= 40, `${task.id} is too vague`);
      }
    }
  });

  it("shows the complete Lab 3 page exactly as the live page", () => {
    const page = blocks(STYLING).find((block) => block.name === "Lab3 (complete)");
    assert.ok(page);
    assert.equal(page.body.trim(), read("app/labs/lab3/page.tsx").trim());
  });
  it("shows app/labs/lab3/page.tsx at every early Lab 3 step, growing in the same order as the finished file", () => {
    const complete = blocks(STYLING).find((block) => block.name === "Lab3 (complete)");
    assert.ok(complete);
    const finalImports = complete.body.split("\n").filter((line) => line.startsWith("import "));
    const steps = blocks("app/book/ch3/sections/JsBasics.tsx").filter((block) => block.file === "app/labs/lab3/page.tsx");
    assert.deepEqual(
      steps.map((block) => block.name),
      ["3.2.1", "3.2.2", "3.2.3", "3.2.4", "3.2.5", "3.2.6", "3.2.7"].map((section) => `Lab3 (after ${section})`),
    );
    let previous = 0;
    for (const step of steps) {
      const imports = step.body.split("\n").filter((line) => line.startsWith("import "));
      assert.ok(imports.length > previous, step.name);
      previous = imports.length;
      assert.deepEqual(imports, finalImports.slice(0, imports.length), step.name);
      const names = imports.map((line) => line.match(/^import (\w+) from/)?.[1]);
      const rendered = [...step.body.matchAll(/^ {6}<(\w+) \/>$/gm)].map((match) => match[1]);
      assert.deepEqual(rendered, names, step.name);
      assert.match(step.body, /export default function Lab3\(\) \{\n  return \(\n    <div id="wd-lab3">\n      <h2>Lab 3<\/h2>\n/, step.name);
      for (const name of names) assert.ok(complete.body.includes(`      <${name} />\n`), name);
    }
  });
});
