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
  it("shows the whole app/labs/lab3/page.tsx after every Chapter 3 step that changes it, growing toward the finished file", () => {
    const final = read("app/labs/lab3/page.tsx").trim();
    const finalImports = final.split("\n").filter((line) => line.startsWith("import "));
    const finalNames = finalImports.map((line) => line.match(/^import (\w+) from "\.\/([\w/]+)";$/)?.[1] ?? "");
    const finalPaths = finalImports.map((line) => line.match(/from "\.\/([\w/]+)";$/)?.[1] ?? "");
    // JSX children of the finished page, grouped by component. A heading
    // right before a component (<h4>Square of 4</h4>) belongs to it, and
    // anything after a component tag (<hr />, Highlight's text) stays with it.
    const lines = final.split("\n");
    const children = lines.slice(lines.indexOf("      <h2>Lab 3</h2>") + 1, lines.lastIndexOf("    </div>"));
    const groups: Array<{ name: string; lines: string[] }> = [];
    let headingOnly = false;
    for (const line of children) {
      const tag = line.match(/^ {6}<([A-Z]\w*)\b/)?.[1];
      if (/^ {6}<h4>/.test(line)) {
        groups.push({ name: "", lines: [line] });
        headingOnly = true;
      } else if (tag && headingOnly) {
        groups[groups.length - 1].name = tag;
        groups[groups.length - 1].lines.push(line);
        headingOnly = false;
      } else if (tag) {
        groups.push({ name: tag, lines: [line] });
      } else {
        groups[groups.length - 1].lines.push(line);
      }
    }
    assert.deepEqual(groups.map((group) => group.name), finalNames, "page.tsx renders its imports in import order");
    const LOG = '  console.log("Hello World!");';
    const expected = (count: number, log: boolean) =>
      [
        ...finalImports.slice(0, count),
        "",
        "export default function Lab3() {",
        ...(log ? [LOG] : []),
        "  return (",
        '    <div id="wd-lab3">',
        "      <h2>Lab 3</h2>",
        ...groups.slice(0, count).flatMap((group) => group.lines),
        "    </div>",
        "  );",
        "}",
      ].join("\n");

    // The four Lab 3 section files, in book order, as one source.
    const files = ["JsBasics", "Functions", "DataStructures", "StylingAndComponents"].map(
      (name) => `app/book/ch3/sections/${name}.tsx`,
    );
    const src = files.map(read).join("\n");
    const all: Array<{ at: number; file: string; name: string; body: string }> = [];
    const re = /<CodeBlock\b([^>]*)>\{`([\s\S]*?)`\}<\/CodeBlock>/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(src))) {
      all.push({
        at: match.index,
        file: match[1].match(/file="([^"]+)"/)?.[1] ?? "",
        name: match[1].match(/name="([^"]+)"/)?.[1] ?? "",
        body: unescapeTemplate(match[2]),
      });
    }
    const steps = all.filter((block) => block.file === "app/labs/lab3/page.tsx" && block.name !== "Lab3 (complete)");
    assert.deepEqual(
      steps.map((block) => block.name),
      [
        "3.2.1", "3.2.2", "3.2.3", "3.2.4", "3.2.5", "3.2.6", "3.2.7",
        "3.3", "3.3.1", "3.3.2", "3.3.3",
        "3.4", "3.4.1", "3.4.2", "3.4.3", "3.4.4", "3.4.5", "3.4.6", "3.4.7", "3.4.8", "3.4.9",
        "3.4.10", "3.4.11", "3.4.12", "3.4.13", "3.4.14", "3.4.15", "3.4.16", "3.4.17",
        "3.5.1", "3.5.2", "3.6.1", "3.6.2", "3.7", "3.7.1", "3.7.3", "3.7.4",
      ].map((section) => `Lab3 (after ${section})`),
    );
    // No partial page.tsx snippets (e.g. "...lab components...") are left.
    assert.ok(all.every((block) => !/export default function Lab3\(/.test(block.body) || block.file === "app/labs/lab3/page.tsx"));

    let previous = 0;
    let logged = false;
    for (const step of steps) {
      const section = step.name.match(/^Lab3 \(after ([\d.]+)\)$/)?.[1];
      // The block sits in the section its label names.
      const titles = [...src.slice(0, step.at).matchAll(/title="([\d.]+) /g)];
      assert.equal(titles[titles.length - 1]?.[1], section, `${step.name} is not in §${section}`);
      const count = step.body.split("\n").filter((line) => line.startsWith("import ")).length;
      if (section === "3.4.12") {
        // Writing to the Console adds console.log, not a component.
        assert.equal(count, previous, step.name);
        logged = true;
      } else {
        assert.ok(count > previous, `${step.name} adds no component`);
      }
      assert.equal(step.body, expected(count, logged), `${step.name} is not the cumulative page`);
      // Every component listed between the previous step and this one is
      // one this step adds (sub-files like Math.ts or TodoItem are not page imports).
      const listedBetween = all
        .filter((block) => block.at < step.at && block.at > (steps[steps.indexOf(step) - 1]?.at ?? -1))
        .map((block) => block.file.match(/^app\/labs\/lab3\/([\w/]+)\.tsx$/)?.[1])
        .filter((path): path is string => !!path && finalPaths.includes(path));
      for (const path of listedBetween) {
        const at = finalPaths.indexOf(path);
        assert.ok(at >= previous && at < count, `${path} is listed in ${step.name}'s section but not added there`);
      }
      for (const path of finalPaths.slice(previous, count)) {
        assert.ok(listedBetween.includes(path), `${step.name} adds ${path} without its listing`);
      }
      previous = count;
    }
    assert.equal(steps[steps.length - 1].body, final, "the last step is the finished Lab 3 page");
  });
it("shows the §3.7.1 Square and Highlight demos with the same markup as the Lab 3 page", () => {
    const dedent = (text: string) => {
      const rows = text.split("\n").filter((line) => line.trim() !== "");
      const indent = Math.min(...rows.map((line) => line.match(/^ */)![0].length));
      return rows.map((line) => line.slice(indent)).join("\n");
    };
    const page = read("app/labs/lab3/page.tsx");
    const squareOnPage = page.match(/^ {6}<h4>Square of 4<\/h4>\n {6}<Square>4<\/Square>\n {6}<hr \/>$/m)?.[0];
    const highlightOnPage = page.match(/^ {6}<Highlight>\n[\s\S]*?^ {6}<\/Highlight>$/m)?.[0];
    assert.ok(squareOnPage, "page.tsx renders <h4>Square of 4</h4>, <Square>4</Square>, <hr />");
    assert.ok(highlightOnPage, "page.tsx renders a Highlight");
    const styling = read(STYLING);
    const section = styling.slice(styling.indexOf('id="sec-3-7-1"'), styling.indexOf('id="sec-3-7-2"'));
    const demo = (name: string) =>
      section.match(new RegExp(`<LiveDemo name="${name}" file="app/labs/lab3/${name}\\.tsx">\\n([\\s\\S]*?)\\n *</LiveDemo>`))?.[1] ?? "";
    assert.equal(dedent(demo("Square")), dedent(squareOnPage), "§3.7.1 Square demo");
    assert.equal(dedent(demo("Highlight")), dedent(highlightOnPage), "§3.7.1 Highlight demo");
    // The slide embeds show the same markup.
    const embeds = read("app/slides/_components/embeds/Lab3Embeds.tsx");
    const embed = (fn: string) =>
      embeds.match(new RegExp(`export function ${fn}\\(\\) \\{\\n  return \\(\\n    <Lab3Demo label="[^"]+">\\n([\\s\\S]*?)\\n    </Lab3Demo>`))?.[1] ?? "";
    assert.equal(dedent(embed("JsSquareEmbed")), dedent(squareOnPage), "js-square slide embed");
    assert.equal(dedent(embed("JsHighlightEmbed")), dedent(highlightOnPage), "js-highlight slide embed");
    for (const file of ["Functions", "DataStructures", "StylingAndComponents", "JsBasics"]) {
      assert.doesNotMatch(read(`app/book/ch3/sections/${file}.tsx`), /Square of 4 =/, file);
    }
    assert.doesNotMatch(embeds, /Square of 4 =/);
  });
});
