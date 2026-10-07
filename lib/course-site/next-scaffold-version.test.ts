import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

// Next.js 16.4 (create-next-app@latest since 2026-10-06) scaffolds with
// cacheComponents + partialPrefetching, and the book's `await params` Kambaz
// layouts then fail `next build`. The book pins the 16.3 scaffold and tells
// students who already scaffolded on 16.4 to delete both config lines.
function read(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

const intro = read("app/book/ch1/sections/IntroAndSetup.tsx");
const kambaz = read("app/book/ch1/sections/KambazSections.tsx");
const deck = read("lib/lectures/decks/creating-a-nextjs-react-application.ts");

describe("create-next-app version pin (Next.js 16.4 cacheComponents)", () => {
  it("pins the scaffold command to create-next-app@16.3 in the book and slides", () => {
    assert.match(intro, /npx create-next-app@16\.3 webdev-client/);
    assert.match(deck, /npx create-next-app@16\.3 webdev-client/);
    for (const [name, src] of [
      ["IntroAndSetup", intro],
      ["creating-a-nextjs-react-application", deck],
    ]) {
      assert.doesNotMatch(src, /create-next-app@latest/, name);
      assert.doesNotMatch(src, /15\.3\.5/, name);
    }
  });

  it("shows the 16.3 install prompt and the recommended-defaults question", () => {
    assert.match(intro, /create-next-app@16\.3\.8/);
    assert.match(intro, /Yes, use recommended defaults/);
    assert.doesNotMatch(intro, /Would you like to use Turbopack/);
  });

  it("tells already-scaffolded 16.4 students to delete both config lines", () => {
    assert.match(intro, /id="next-16-4-cache-components-fix"/);
    for (const src of [intro, kambaz]) {
      assert.match(src, /cacheComponents: true,/);
      assert.match(src, /partialPrefetching: true,/);
      assert.match(src, /next\.config\.ts/);
    }
    assert.match(intro, /October 6, 2026/);
    assert.match(kambaz, /uncached or runtime data during prerendering/);
  });
});
