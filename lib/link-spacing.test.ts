import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { getLectureDeck, listLectureSlugs } from "./lectures/catalog.ts";
import { slideTextToHtml } from "./lectures/slide-markup.ts";
import { gluedLinkBoundaries } from "./link-spacing.ts";
import { cleanJsxText, gluedJsxLinkBoundaries } from "./link-spacing-jsx.ts";

function walk(dir: string, ext = ".tsx", out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, ext, out);
    else if (path.endsWith(ext)) out.push(path);
  }
  return out;
}

describe("gluedLinkBoundaries", () => {
  it("flags a lowercase word running into link text", () => {
    const hits = gluedLinkBoundaries(
      `<p>already available from<a href="/book/ch1">Chapter 1</a>&#x27;s exercise</p>`,
    );
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.side, "before");
    assert.match(hits[0]?.snippet ?? "", /from\|Chapter 1/);
  });

  it("keeps a real space, a React space comment, and a possessive", () => {
    assert.deepEqual(
      gluedLinkBoundaries(`from <a href="/book/ch1">Chapter 1</a>`),
      [],
    );
    assert.deepEqual(
      gluedLinkBoundaries(`from<!-- --> <a href="/book/ch1">Chapter 1</a>&#x27;s`),
      [],
    );
    assert.deepEqual(
      gluedLinkBoundaries(`<a href="/book/ch1">Chapter 1</a>&#x27;s`),
      [],
    );
  });

  it("flags prose after a link and ignores plurals, blocks, and link-to-link", () => {
    assert.equal(
      gluedLinkBoundaries(`<a href="/x">notes</a>Here`).length,
      1,
    );
    assert.deepEqual(gluedLinkBoundaries(`<a href="/x">URL</a>s`), []);
    assert.deepEqual(
      gluedLinkBoundaries(`<p>from</p><a href="/x">Chapter</a>`),
      [],
    );
    assert.deepEqual(
      gluedLinkBoundaries(`<a href="/a">Book</a><a href="/b">Labs</a>`),
      [],
    );
    assert.deepEqual(
      gluedLinkBoundaries(`see <a href="/x">chapter</a> and <a href="/y">2</a>`),
      [],
    );
    assert.equal(
      gluedLinkBoundaries(`from<a href="/s">§1.3.9</a>`).length,
      0,
    );
    assert.equal(gluedLinkBoundaries(`from<a href="/n">2</a>`).length, 1);
  });
});

describe("JSX link spacing", () => {
  it("trims a newline between a word and a tag", () => {
    assert.equal(cleanJsxText("from\n          "), "from");
    assert.equal(cleanJsxText("from "), "from ");
    assert.equal(cleanJsxText("\n          Built"), "Built");
  });

  it("flags the ChapterLink newline that renders as fromChapter", () => {
    const hits = gluedJsxLinkBoundaries(
      "sample.tsx",
      `export function Sample() {
        return <p>already available from
          <ChapterLink to={1} />&apos;s exercise</p>;
      }`,
    );
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.side, "before");
    assert.match(hits[0]?.snippet ?? "", /from\|Chapter 1/);
  });

  it("accepts an explicit space and a same-line possessive", () => {
    const spaced = gluedJsxLinkBoundaries(
      "sample.tsx",
      `export function Sample() {
        return <p>from{" "}<ChapterLink to={1} />&apos;s exercise</p>;
      }`,
    );
    assert.deepEqual(spaced, []);
    const after = gluedJsxLinkBoundaries(
      "sample.tsx",
      `export function Sample() {
        return <p><a href="/x">notes</a>Here</p>;
      }`,
    );
    assert.equal(after.length, 1);
    assert.equal(after[0]?.side, "after");
  });

  it("finds no missing space at a link boundary in site JSX", () => {
    const root = join(import.meta.dirname, "../app");
    const hits = walk(root).flatMap((file) =>
      gluedJsxLinkBoundaries(file, readFileSync(file, "utf8")).map((hit) => ({
        file: file.slice(root.length + 1),
        ...hit,
      })),
    );
    assert.deepEqual(hits, []);
  });

  it("finds no missing space in lecture bullets after they become links", () => {
    const hits: string[] = [];
    for (const slug of listLectureSlugs()) {
      const deck = getLectureDeck(slug);
      if (!deck) continue;
      for (const slide of deck.slides) {
        const bits = [slide.title, ...(slide.bullets ?? []), slide.interactiveHint, slide.imageCaption];
        for (const bit of bits) {
          if (!bit) continue;
          for (const hit of gluedLinkBoundaries(`<p>${slideTextToHtml(bit)}</p>`)) {
            hits.push(`${slug} ${slide.id} ${hit.side} ${hit.snippet}`);
          }
        }
      }
    }
    assert.deepEqual(hits, []);
  });

  it("finds no missing space in prerendered book HTML", () => {
    const root = join(import.meta.dirname, "../.next/server/app/book");
    if (!existsSync(root)) return;
    const hits = walk(root, ".html").flatMap((file) =>
      gluedLinkBoundaries(readFileSync(file, "utf8")).map((hit) => ({
        file: file.slice(root.length + 1),
        ...hit,
      })),
    );
    assert.deepEqual(hits, []);
  });
});
