import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

describe("Chapter 1 A1 wording", () => {
  it("§1.3.11 TOC book link uses an address that opens on the deploy", () => {
    const toc = promptsIn(html).find((p) => p.includes("wd-toc-book-link"));
    assert.ok(toc, "TOC With AI prompt");
    assert.match(toc, /https:\/\/kambaz\.dev\/book\/ch1/);
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
    for (const prompt of promptsIn(ch1)) {
      assert.doesNotMatch(prompt, /(?<!\\)`/, prompt.slice(0, 60));
    }
  });

  it("§1.4.2.4 explains why live Kambaz may show fewer account links", () => {
    assert.match(prose(kambaz), /Build all three for this chapter\./);
  });
});
