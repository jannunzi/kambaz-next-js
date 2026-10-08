import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  CANVAS_FALLBACK_PERMISSION_BLURB,
  CANVAS_FALLBACK_QUIZZES,
  CANVAS_QUIZ_TAKEN_HERE_SENTENCE,
  canvasFallbackIdent,
  canvasQuizDescriptionHtml,
  canvasQuizTakeUrl,
  listCanvasQuizFollowupCopy,
} from "./canvas-copy";
import {
  formatEasternCivilTimestamp,
  formatEasternDateTime,
  getQuizSchedule,
} from "./schedule";

describe("Canvas quiz fallback copy", () => {
  it("says Q1–Q6 are taken in Canvas and never links a website take page", () => {
    const quizzes = CANVAS_FALLBACK_QUIZZES.filter((quiz) => quiz.quizId.startsWith("q"));
    assert.deepEqual(
      quizzes.map((quiz) => quiz.quizId),
      ["q1", "q2", "q3", "q4", "q5", "q6"],
    );
    for (const quiz of quizzes) {
      const html = canvasQuizDescriptionHtml(quiz);
      assert.equal(canvasQuizTakeUrl(quiz.quizId), null, quiz.quizId);
      assert.equal(quiz.takePath, null, quiz.quizId);
      assert.match(html, new RegExp(CANVAS_QUIZ_TAKEN_HERE_SENTENCE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.match(html, /taken here in Canvas, not on the course website/);
      assert.doesNotMatch(html, /kambaz\.dev|quizzes\/take|<a /i, quiz.quizId);
      assert.doesNotMatch(html, /on the course site:|Take .* on the course site/i, quiz.quizId);
      assert.doesNotMatch(html, new RegExp(CANVAS_FALLBACK_PERMISSION_BLURB.slice(0, 30)), quiz.quizId);
      assert.doesNotMatch(html, /website quiz|graded on the website/i, quiz.quizId);
      assert.doesNotMatch(html, /Correct answers are available/i, quiz.quizId);
      assert.doesNotMatch(html, /Clerk|Kambaz|Lab [0-9]|wd-/i, quiz.quizId);
    }
  });

  it("keeps the website take URL first and a staff-permission blurb for exams", () => {
    for (const quiz of CANVAS_FALLBACK_QUIZZES.filter((row) => row.quizId.startsWith("x"))) {
      const html = canvasQuizDescriptionHtml(quiz);
      const url = canvasQuizTakeUrl(quiz.quizId);
      assert.ok(url, quiz.quizId);
      assert.equal(quiz.takePath, `/quizzes/take/${quiz.quizId}`);
      assert.match(html, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.match(html, /kambaz\.dev\/quizzes\/take\/x[12]/);
      assert.match(html, /ask your instructor or TA for permission/i);
      assert.doesNotMatch(html, /use this Canvas quiz instead of the website/i);
      assert.doesNotMatch(html, /take this Canvas quiz by default/i);
      assert.doesNotMatch(html, /end of lecture|Monday through Sunday|in person|time to be announced/i);
      assert.doesNotMatch(html, /available again|prep window|one week before the/i);
      const schedule = getQuizSchedule(quiz.quizId);
      assert.ok(schedule, quiz.quizId);
      const answersOpen = formatEasternDateTime(schedule.answersOpenAt);
      const answersClose = formatEasternDateTime(schedule.answersCloseAt);
      assert.match(
        html,
        new RegExp(
          `Correct answers are available for one week only, from ${answersOpen.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} until ${answersClose.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.`,
        ),
      );
      assert.doesNotMatch(html.replaceAll(url, ""), /Clerk|Kambaz|Lab [0-9]|wd-/i);
      assert.ok(html.indexOf(url) < html.indexOf(CANVAS_FALLBACK_PERMISSION_BLURB));
      assert.doesNotMatch(html, /coding items are graded on the website/i);
    }
  });

  it("gives Canvas-taken quizzes no public website URL in the follow-up copy", () => {
    for (const row of listCanvasQuizFollowupCopy()) {
      if (row.quizId.startsWith("q")) {
        assert.equal(row.publicUrl, null, row.quizId);
        assert.doesNotMatch(row.html, /quizzes\/take/, row.quizId);
      } else {
        assert.equal(row.publicUrl, `https://kambaz.dev/quizzes/take/${row.quizId}`);
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
      assert.equal(
        quiz.answersOpenAt,
        formatEasternCivilTimestamp(schedule.answersOpenAt),
      );
      assert.equal(
        quiz.answersCloseAt,
        formatEasternCivilTimestamp(schedule.answersCloseAt),
      );
      assert.doesNotMatch(quiz.dueAt, /2026-09-27/);
      assert.doesNotMatch(quiz.lockAt, /2026-09-27/);
    }
    const q1 = CANVAS_FALLBACK_QUIZZES.find((quiz) => quiz.quizId === "q1");
    assert.equal(q1?.unlockAt, "2026-09-28T00:00:00");
    assert.equal(q1?.dueAt, "2026-10-04T23:59:00");
    assert.equal(q1?.lockAt, "2026-10-04T23:59:00");
    assert.equal(q1?.answersOpenAt, "2026-10-05T00:00:00");
    assert.equal(q1?.answersCloseAt, "2026-10-12T00:00:00");
    const q3 = CANVAS_FALLBACK_QUIZZES.find((quiz) => quiz.quizId === "q3");
    assert.equal(q3?.answersOpenAt, "2026-11-02T00:00:00");
    assert.equal(q3?.answersCloseAt, "2026-11-09T00:00:00");
    const q6 = CANVAS_FALLBACK_QUIZZES.find((quiz) => quiz.quizId === "q6");
    assert.equal(q6?.answersOpenAt, "2026-12-14T00:00:00");
    assert.equal(q6?.answersCloseAt, "2026-12-21T00:00:00");
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
    assert.match(sample, /taken here in Canvas, not on the course website/);
    assert.doesNotMatch(sample, /quizzes\/take|kambaz\.dev/);
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
