import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  CANVAS_FALLBACK_PERMISSION_BLURB,
  CANVAS_FALLBACK_QUIZZES,
  canvasFallbackIdent,
  canvasQuizDescriptionHtml,
  canvasQuizTakeUrl,
  listCanvasQuizFollowupCopy,
} from "./canvas-copy";
import {
  formatEasternCivilTimestamp,
  getQuizSchedule,
} from "./schedule";

describe("Canvas quiz fallback copy", () => {
  it("keeps the website take URL first and a staff-permission blurb", () => {
    for (const quiz of CANVAS_FALLBACK_QUIZZES) {
      const html = canvasQuizDescriptionHtml(quiz);
      const url = canvasQuizTakeUrl(quiz.quizId);
      assert.match(html, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.match(html, /kambaz\.dev\/quizzes\/take\//);
      assert.match(html, /ask your instructor or TA for permission/i);
      assert.doesNotMatch(html, /use this Canvas quiz instead of the website/i);
      assert.doesNotMatch(html, /take this Canvas quiz by default/i);
      assert.doesNotMatch(html, /end of lecture|Monday through Sunday|in person|time to be announced/i);
      assert.doesNotMatch(html.replaceAll(url, ""), /Clerk|Kambaz|Lab [0-9]|wd-/i);
      assert.ok(html.indexOf(url) < html.indexOf(CANVAS_FALLBACK_PERMISSION_BLURB));
      if (quiz.quizId.startsWith("q")) {
        assert.match(html, /coding items are graded on the website/i);
      } else {
        assert.doesNotMatch(html, /coding items are graded on the website/i);
      }
    }
  });

  it("derives Canvas unlock, due, and lock from the website take window", () => {
    for (const quiz of CANVAS_FALLBACK_QUIZZES) {
      const schedule = getQuizSchedule(quiz.quizId);
      assert.ok(schedule, quiz.quizId);
      assert.equal(
        quiz.unlockAt,
        formatEasternCivilTimestamp(schedule.takeUnlockAt),
      );
      assert.equal(
        quiz.dueAt,
        formatEasternCivilTimestamp(schedule.takeLockAt),
      );
      assert.equal(quiz.lockAt, quiz.dueAt);
      assert.doesNotMatch(quiz.dueAt, /2026-09-27/);
      assert.doesNotMatch(quiz.lockAt, /2026-09-27/);
    }
    const q1 = CANVAS_FALLBACK_QUIZZES.find((quiz) => quiz.quizId === "q1");
    assert.equal(q1?.unlockAt, "2026-09-28T00:00:00");
    assert.equal(q1?.dueAt, "2026-10-04T23:59:00");
    assert.equal(q1?.lockAt, "2026-10-04T23:59:00");
  });

  it("keeps the checked-in Q1 assessment meta on the shifted window", () => {
    const sample = readFileSync(
      new URL(
        "../../scripts/canvas-fallback/sample/q1.assessment_meta.xml",
        import.meta.url,
      ),
      "utf8",
    );
    assert.match(sample, /<unlock_at>2026-09-28T00:00:00<\/unlock_at>/);
    assert.match(sample, /<due_at>2026-10-04T23:59:00<\/due_at>/);
    assert.match(sample, /<lock_at>2026-10-04T23:59:00<\/lock_at>/);
    assert.doesNotMatch(sample, /2026-09-27/);
    assert.doesNotMatch(sample, /2026-09-21T00:00:00/);
  });

  it("lists Q1–Q6 and X1/X2 with stable fallback identifiers", () => {
    const copy = listCanvasQuizFollowupCopy();
    assert.deepEqual(
      copy.map((row) => row.quizId),
      ["q1", "q2", "q3", "q4", "q5", "q6", "x1", "x2"],
    );
    assert.equal(canvasFallbackIdent("q1"), "gwebdev_q1_fallback");
    assert.equal(copy[0]?.ident, "gwebdev_q1_fallback");
  });
});
