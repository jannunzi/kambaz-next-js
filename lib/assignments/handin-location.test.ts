import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { handInUrl } from "../../app/book/components/hand-in";
import { canvasHandInSentence, listCanvasFollowupCopy } from "./canvas-copy";

/**
 * Jose, Oct 7 2026: students hand in A1–A6 on kambaz.dev, not in Canvas.
 * Canvas still shows grades, so "posted in Canvas" and "not in Canvas"
 * are fine; any "submit … in Canvas" hand-in wording is not.
 */
const ALLOWED_CANVAS_PHRASES = [
  /\bnot in Canvas\b/gi,
  /\bDo not submit anything in Canvas\b/gi,
  /\bposted in Canvas\b/gi,
];

const CANVAS_HAND_IN_PATTERNS = [
  /\b(submit\w*|hand(?:ed)? in|turn(?:ed)? in|deliverable)\b[^.;:]{0,80}\bCanvas\b/i,
  /\bCanvas\b[^.;:]{0,40}\b(submit\w*|hand in|turn in)\b/i,
  /\bFor Canvas\b/i,
];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (path.endsWith(".tsx") || path.endsWith(".ts")) {
      if (!path.includes(".test.")) out.push(path);
    }
  }
  return out;
}

/** Prose-ish text: drop JSX spacing helpers, tags, and extra whitespace. */
function proseText(source: string): string {
  return source
    .replace(/\{"\s*"\}/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

function canvasHandInHits(text: string): string[] {
  let cleaned = text;
  for (const allowed of ALLOWED_CANVAS_PHRASES) cleaned = cleaned.replace(allowed, "");
  const hits: string[] = [];
  for (const pattern of CANVAS_HAND_IN_PATTERNS) {
    const match = cleaned.match(pattern);
    if (match) hits.push(match[0]);
  }
  return hits;
}

describe("assignments are handed in on kambaz.dev, not Canvas", () => {
  it("flags the old book wording", () => {
    assert.ok(canvasHandInHits("Submit both URLs in Canvas.").length > 0);
    assert.ok(canvasHandInHits("In Canvas, submit the Vercel URL.").length > 0);
    assert.ok(canvasHandInHits("As a deliverable in Canvas, submit the URL").length > 0);
    assert.ok(canvasHandInHits("For Canvas you git init that folder").length > 0);
    assert.deepEqual(
      canvasHandInHits("Hand in A1 on kambaz.dev, not in Canvas. Your grade is posted in Canvas."),
      [],
    );
  });

  for (const chapter of [1, 2, 3, 4, 5, 6]) {
    it(`book Chapter ${chapter} never says to submit assignments in Canvas`, () => {
      const dir = join(process.cwd(), "app", "book", `ch${chapter}`);
      for (const file of walk(dir)) {
        const hits = canvasHandInHits(proseText(readFileSync(file, "utf8")));
        assert.deepEqual(hits, [], `${file} still says to hand in on Canvas`);
      }
    });
  }

  it("book hand-in links point at kambaz.dev assignment pages", () => {
    assert.equal(handInUrl("a1"), "https://kambaz.dev/assignments/a1");
    assert.equal(handInUrl("a6"), "https://kambaz.dev/assignments/a6");
    const expected: Record<number, string> = {
      1: "ClosingSections.tsx",
      2: "Delivery.tsx",
      3: "Delivery.tsx",
      4: "Delivery.tsx",
      5: "Conclusion.tsx",
      6: "Deliverables.tsx",
    };
    for (const [chapter, file] of Object.entries(expected)) {
      const source = readFileSync(
        join(process.cwd(), "app", "book", `ch${chapter}`, "sections", file),
        "utf8",
      );
      assert.match(source, new RegExp(`<HandInLink id="a${chapter}"`));
      assert.doesNotMatch(source, /vercel\.app\/assignments/);
    }
  });

  it("canvas-copy.ts source never says to submit in Canvas", () => {
    const source = readFileSync(
      join(process.cwd(), "lib", "assignments", "canvas-copy.ts"),
      "utf8",
    );
    assert.deepEqual(canvasHandInHits(source), []);
  });

  it("Canvas A1–A6 descriptions send students to kambaz.dev to hand in", () => {
    const copy = listCanvasFollowupCopy();
    assert.equal(copy.length, 6);
    for (const row of copy) {
      const text = row.html.replace(/<[^>]+>/g, " ");
      assert.deepEqual(canvasHandInHits(text), [], `${row.canvasId} Canvas copy`);
      assert.match(row.html, new RegExp(`https://kambaz\\.dev/assignments/${row.assignmentId}\\b`));
      assert.match(row.html, new RegExp(`Hand in ${row.canvasId} on kambaz\\.dev, not in Canvas`));
      assert.match(row.html, /Do not submit anything in Canvas/);
      assert.doesNotMatch(row.html, /vercel\.app|here in Canvas|late|penalt|waive/i);
    }
  });

  it("exposes the exact hand-in sentence staff paste into Canvas", () => {
    assert.equal(
      canvasHandInSentence({ canvasId: "A1", publicUrl: "https://kambaz.dev/assignments/a1" }),
      "Hand in A1 on kambaz.dev, not in Canvas: sign in at https://kambaz.dev/assignments/a1 and submit your GitHub repository and Vercel deployment URLs there. Do not submit anything in Canvas; your grade will be posted in Canvas.",
    );
  });
});
