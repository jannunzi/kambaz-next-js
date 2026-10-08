import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

const html = readFileSync("app/book/ch1/sections/HtmlSections.tsx", "utf8");
const kambaz = readFileSync("app/book/ch1/sections/KambazSections.tsx", "utf8");
const ch1 = html + kambaz;

/** Collapse JSX tags, {" "} spacers and line wraps into plain prose. */
function prose(src: string): string {
  return src
    .replace(/\{" "\}/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ");
}

function promptsIn(src: string): string[] {
  return [...src.matchAll(/prompt=\{`([\s\S]*?)`\}/g)].map((m) => m[1]);
}

/**
 * Prompts (prompt={`…`}) that contain any backtick, escaped (\`, which the
 * Copy button hands over as a literal backtick) or bare, or a ${…}
 * interpolation. Each prompt runs from its opening prompt={` to the `}
 * that ends its line, so a stray backtick in the middle stays inside the
 * prompt instead of silently ending it (as a lazy `([\s\S]*?)` match would).
 * Returns the first 60 characters of each bad prompt.
 */
function strayBacktickPrompts(src: string): string[] {
  const bad: string[] = [];
  const open = "prompt={`";
  let from = src.indexOf(open);
  while (from !== -1) {
    const start = from + open.length;
    const close = /`\}[ \t]*(?:\r?\n|$)/g;
    close.lastIndex = start;
    const end = close.exec(src);
    const body = src.slice(start, end ? end.index : src.length);
    if (!end || body.includes("`") || /(?<!\\)\$\{/.test(body)) bad.push(body.slice(0, 60));
    from = src.indexOf(open, end ? end.index : src.length);
  }
  return bad;
}

describe("Chapter 1 A1 wording", () => {
  it("§1.3.11 TOC book link uses an address that opens on the deploy", () => {
    const toc = promptsIn(html).find((p) => p.includes("wd-toc-book-link"));
    assert.ok(toc, "TOC With AI prompt");
    assert.match(toc, /https:\/\/kambaz\.dev\/book\/ch1/);
    assert.doesNotMatch(prose(html), /a Link back to the book chapter/);
    assert.match(prose(html), /a link back to the book chapter that uses the full address https:\/\/kambaz\.dev\/book\/ch1/);
    assert.doesNotMatch(html, /expected to 404/i);
    assert.doesNotMatch(ch1, /only checks that an element with id/i);
  });

  it("§1.3.6 Forms With AI says it replaces the On your own form", () => {
    const text = prose(html);
    assert.match(text, /This step replaces your On your own form\. It does not add a second one\./);
    assert.match(text, /exactly one app\/labs\/lab1\/forms\/YourForm\.tsx, one form with id wd-your-form/);
  });

  it("keeps asking for wd-* ids without saying graders look for them", () => {
    assert.match(ch1, /the ids help us test your work/);
    assert.doesNotMatch(ch1, /graders (still )?(look for|can find)/i);
    assert.doesNotMatch(ch1, /automated tests \(and graders\)/i);
  });

  it("copyable prompts have no stray backticks", () => {
    const sources = readdirSync("app/book/ch1/sections")
      .filter((name) => name.endsWith(".tsx"))
      .map((name) => readFileSync(`app/book/ch1/sections/${name}`, "utf8"));
    for (const src of sources) {
      assert.deepEqual(strayBacktickPrompts(src), []);
    }
  });

  it("the stray-backtick check fails on a mutated §1.3.1 prompt", () => {
    // Self-check, so this guard can't go quietly blind again. Insert a
    // backtick into the §1.3.1 With AI prompt, escaped (it compiles, and the
    // copied prompt then shows a literal backtick) and bare, and make sure
    // both are caught. The real text has none.
    const marker = 'an h4 titled "Lab notes"';
    assert.ok(html.includes(marker), "§1.3.1 With AI prompt");
    assert.deepEqual(strayBacktickPrompts(html), []);
    for (const insert of ["\\`app/labs/lab1/HeadingTags.tsx\\` ", "`"]) {
      const found = strayBacktickPrompts(html.replace(marker, insert + marker));
      assert.equal(found.length, 1, JSON.stringify(insert));
      assert.match(found[0], /HeadingTags\.tsx/);
    }
  });

  it("§1.4.2.4 explains why live Kambaz may show fewer account links", () => {
    assert.match(prose(kambaz), /Build all three for this chapter\./);
  });
});
