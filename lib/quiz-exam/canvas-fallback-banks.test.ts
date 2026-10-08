import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHAPTER1_BANK } from "../question-bank/q1";
import { renderCanvasQtiAssessment } from "../question-bank/qti";
import { getExamBank, listExamBanks } from "./banks";
import {
  canvasFallbackIdent,
  canvasQuizDescriptionHtml,
  getCanvasFallbackQuiz,
} from "./canvas-copy";
import {
  buildCanvasFallbackBanks,
  practiceChapterBank,
  practiceQuestionToBank,
  sampleGroups,
} from "./canvas-fallback-banks";
import {
  EXAM_SOURCE_GROUP_TAKE,
  QUIZ_DRAW_COUNTS,
  QUIZ_TIME_LIMIT_MINUTES,
} from "./draw-counts";

const FORBIDDEN = /\bLab [0-9]|\bLabs\b|Kambaz|\bwd-|this chapter|the chapter|§\d|\/labs\b|the book/i;

describe("Canvas fallback banks", () => {
  it("sizes Q1–Q6 to 10 groups and X1/X2 to 36 (12 per source chapter)", () => {
    const banks = buildCanvasFallbackBanks();
    assert.equal(banks.q1.groups.length, QUIZ_DRAW_COUNTS.q1);
    assert.equal(banks.q1.groups.length, 10);
    assert.ok(banks.q1.groups.every((group) =>
      CHAPTER1_BANK.groups.some((source) => source.id === group.id),
    ));
    for (const bank of Object.values(banks)) {
      assert.equal(
        bank.groups.some((group) => group.type === "coding"),
        false,
        `${bank.id} Canvas fallback must stay traditional-only`,
      );
    }
    assert.ok(CHAPTER1_BANK.groups.length > banks.q1.groups.length);
    assert.equal(banks.q2.groups.length, 10);
    assert.equal(banks.q3.groups.length, 10);
    assert.equal(banks.q4.groups.length, 10);
    assert.equal(banks.q5.groups.length, 10);
    assert.equal(banks.q6.groups.length, 10);
    assert.equal(banks.x1.groups.length, QUIZ_DRAW_COUNTS.x1);
    assert.equal(banks.x2.groups.length, QUIZ_DRAW_COUNTS.x2);
    assert.equal(EXAM_SOURCE_GROUP_TAKE, 12);
    assert.equal(banks.x1.groups.filter((group) => group.name.startsWith("Q1 ·")).length, 12);
    assert.equal(banks.x1.groups.filter((group) => group.name.startsWith("Q2 ·")).length, 12);
    assert.equal(banks.x1.groups.filter((group) => group.name.startsWith("Q3 ·")).length, 12);
    assert.equal(banks.x2.groups.filter((group) => group.name.startsWith("Q4 ·")).length, 12);
    assert.equal(banks.x2.groups.filter((group) => group.name.startsWith("Q6 ·")).length, 12);
    assert.equal(banks.q2.id, "q2-practice");
    assert.match(banks.q2.groups[0]?.id ?? "", /^q2-sec-/);
  });

  it("keeps website EXAM_BANKS identical to the Canvas fallback banks", () => {
    const fallback = buildCanvasFallbackBanks();
    const listed = listExamBanks();
    assert.deepEqual(
      listed.map((row) => row.quizId),
      ["q1", "q2", "q3", "q4", "q5", "q6", "x1", "x2"],
    );
    for (const [quizId, bank] of Object.entries(fallback)) {
      const exam = getExamBank(quizId);
      assert.ok(exam);
      assert.deepEqual(
        exam.groups.map((group) => group.id),
        bank.groups.map((group) => group.id),
      );
      assert.equal(exam.groups.length, QUIZ_DRAW_COUNTS[quizId as keyof typeof QUIZ_DRAW_COUNTS]);
    }
  });

  it("emits 10 QTI selection groups at 10 points for Q1 and 36 for X1", () => {
    const banks = buildCanvasFallbackBanks();
    const q1 = renderCanvasQtiAssessment(banks.q1, canvasFallbackIdent("q1"));
    assert.equal((q1.match(/<section ident="g/g) ?? []).length, 10);
    assert.match(q1, /<points_per_item>10<\/points_per_item>/);
    const x1 = renderCanvasQtiAssessment(banks.x1, canvasFallbackIdent("x1"));
    assert.equal((x1.match(/<section ident="g/g) ?? []).length, 36);
    assert.match(x1, /<points_per_item>2\.7778<\/points_per_item>/);
  });

  it("drops Jose 2026-09-20 stems from Q1 and X1 traditional fallback", () => {
    const banks = buildCanvasFallbackBanks();
    const blob = [...banks.q1.groups, ...banks.x1.groups]
      .flatMap((group) => group.questions)
      .map((question) => question.prompt)
      .join("\n");
    assert.doesNotMatch(blob, /XML stands for/);
    assert.doesNotMatch(blob, /Wrap each block of ordinary body text/);
    assert.doesNotMatch(blob, /A div heading/);
    assert.doesNotMatch(blob, /the list of choices/);
    assert.doesNotMatch(blob, /Which type should a Save control use/);
    assert.doesNotMatch(blob, /arrives as the _____ prop/);
    assert.doesNotMatch(blob, /robot demo/i);
    assert.doesNotMatch(blob, /class standing/i);
    assert.equal(
      [...banks.q1.groups, ...banks.x1.groups].some((group) =>
        group.questions.some((question) =>
          question.id === "q1-g01-02" || question.id === "q1-g13-02",
        ),
      ),
      false,
    );
  });

  it("keeps exported stems standalone", () => {
    const banks = buildCanvasFallbackBanks();
    for (const bank of Object.values(banks)) {
      const xml = renderCanvasQtiAssessment(
        bank,
        canvasFallbackIdent(bank.id.startsWith("x") ? (bank.id.slice(0, 2) as "x1") : "q1"),
      );
      assert.doesNotMatch(xml, FORBIDDEN);
      for (const group of bank.groups) {
        for (const question of group.questions) {
          assert.doesNotMatch(question.prompt, FORBIDDEN, question.id);
        }
      }
    }
  });

  it("converts practice MC and blanks", () => {
    const mc = practiceQuestionToBank({
      id: "demo-mc",
      section: "2.1.1",
      kind: "concept",
      prompt: "Why avoid inline styles?",
      choices: [
        { id: "a", text: "Browsers ignore them" },
        { id: "b", text: "They are hard to maintain" },
        { id: "c", text: "React forbids them" },
        { id: "d", text: "They cannot set color" },
      ],
      answer: "b",
      explanation: "A stylesheet is easier to reuse.",
    });
    assert.equal(mc?.type, "multiple_choice");
    if (mc?.type === "multiple_choice") {
      assert.equal(mc.correctChoiceId, "b");
    }
    const blank = practiceQuestionToBank({
      id: "demo-blank",
      section: "2.1.2",
      kind: "blank",
      prompt: "The part before the curly brace is the _____.",
      answer: "selector",
      accept: ["the selector"],
      explanation: "Selector plus declarations make a rule.",
    });
    assert.equal(blank?.type, "fill_in_blank");
    const q2 = practiceChapterBank(2, "q2");
    assert.ok(q2.groups.every((group) => group.questions.length >= 1));
    assert.ok(q2.groups.length > QUIZ_DRAW_COUNTS.q2);
    assert.equal(sampleGroups(q2.groups, 10).length, 10);
    assert.equal(QUIZ_TIME_LIMIT_MINUTES.q1, 30);
    assert.equal(QUIZ_TIME_LIMIT_MINUTES.x1, 90);
  });

  it("says quizzes are taken in Canvas and keeps the website URL only for exams", () => {
    for (const quizId of ["q1", "q2", "q3", "q4", "q5", "q6"] as const) {
      const quiz = getCanvasFallbackQuiz(quizId);
      assert.ok(quiz);
      const html = canvasQuizDescriptionHtml(quiz);
      assert.doesNotMatch(html, /quizzes\/take/);
      assert.doesNotMatch(html, /permission to take this Canvas quiz instead/);
      assert.match(html, /taken here in Canvas/);
    }
    for (const quizId of ["x1", "x2"] as const) {
      const quiz = getCanvasFallbackQuiz(quizId);
      assert.ok(quiz);
      const html = canvasQuizDescriptionHtml(quiz);
      assert.match(html, new RegExp(`quizzes/take/${quizId}`));
      assert.match(html, /permission to take this Canvas quiz instead/);
    }
  });
});
