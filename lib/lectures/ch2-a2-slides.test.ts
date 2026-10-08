import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { authoredSlideTextParts } from "./blocks";
import { getLectureDeck } from "./catalog";
import type { LectureSlide } from "./types";

// A2 slides-only walkthrough: pins the Chapter 2 slide text fixes so
// reverting any of them fails a test, not just a slide count.

function slide(slug: string, id: string): LectureSlide {
  const deck = getLectureDeck(slug);
  assert.ok(deck, slug);
  const row = deck.slides.find((s) => s.id === id);
  assert.ok(row, `${slug} missing slide ${id}`);
  return row as LectureSlide;
}

function text(s: LectureSlide): string {
  return [s.title, ...authoredSlideTextParts(s)].join("\n");
}

function deckText(slug: string): string {
  const deck = getLectureDeck(slug);
  assert.ok(deck, slug);
  return deck.slides.map((r) => text(r as LectureSlide)).join("\n");
}

describe("A2 slide text fixes", () => {
  it("16.4 build slides name both errors, the 16.4.0 check, both lines and the partialPrefetching error", () => {
    const t =
      text(slide("kambaz-courses", "next-16-4-build-fix")) +
      "\n" +
      text(slide("kambaz-courses", "next-16-4-build-fix-steps"));
    assert.match(t, /Next\.js encountered URL data `usePathname\(\)` in a Client Component outside of `<Suspense>`/);
    assert.match(t, /Next\.js encountered uncached or runtime data during prerendering/);
    assert.match(t, /"next": "16\.4\.0"/);
    assert.match(t, /`cacheComponents: true,`/);
    assert.match(t, /`partialPrefetching: true,`/);
    assert.match(t, /`partialPrefetching` requires `cacheComponents` to be enabled/);
  });

  it("scope-lab2 explains global CSS and the #wd-lab2 prefix", () => {
    const t = text(slide("css-intro", "scope-lab2"));
    assert.match(t, /every CSS file you import as global/);
    assert.match(t, /`#wd-lab2 h3`/);
  });

  it("css-intro keeps the serif note and the temporary p rule", () => {
    const t = deckText("css-intro");
    assert.match(t, /serif font such as Times/);
    assert.match(t, /Comment out the blanket `p` rule/);
  });

  it("explains em sizing for React Icons", () => {
    assert.match(deckText("react-icons"), /sized in \*\*em\*\*, a length relative to the element's own font size/);
  });

  it("tailwind-intro explains Preflight's effect on headings", () => {
    assert.match(deckText("tailwind-intro"), /Preflight resets every heading to body-text size and weight/);
  });

  it("no deck bullet uses single-asterisk italics, which slides don't render", () => {
    for (const slug of ["kambaz-courses", "css-intro", "css-box-model"]) {
      const deck = getLectureDeck(slug);
      assert.ok(deck, slug);
      for (const row of deck.slides) {
        for (const b of (row as LectureSlide).bullets ?? []) {
          const stripped = b.replace(/`[^`]*`/g, "").replace(/\*\*/g, "");
          assert.ok(!stripped.includes("*"), `${slug}: stray * in "${b}"`);
        }
      }
    }
  });
});
