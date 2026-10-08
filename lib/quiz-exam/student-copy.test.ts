import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  CANVAS_ONLY_QUIZ_PAGE_COPY,
  CANVAS_ONLY_QUIZ_SENTENCE,
  canvasOnlySubmitBlocked,
  isCanvasOnlyQuiz,
} from "./schedule";
import { STUDENT_COPY } from "./student-copy";

const quizTakePage = readFileSync(
  new URL("../../app/quizzes/take/[quizId]/page.tsx", import.meta.url),
  "utf8",
);
const quizIndexPage = readFileSync(
  new URL("../../app/quizzes/take/page.tsx", import.meta.url),
  "utf8",
);
const quizzesDenied = readFileSync(
  new URL("../../app/quizzes/components/StaffReviewDenied.tsx", import.meta.url),
  "utf8",
);
const quizzesReview = readFileSync(
  new URL("../../app/quizzes/(review)/page.tsx", import.meta.url),
  "utf8",
);
const questionBankReview = readFileSync(
  new URL("../../app/quizzes/components/QuestionBankReview.tsx", import.meta.url),
  "utf8",
);
const quiz1ReviewPage = readFileSync(
  new URL("../../app/quizzes/(review)/q1/page.tsx", import.meta.url),
  "utf8",
);
const quiz2ReviewPage = readFileSync(
  new URL("../../app/quizzes/(review)/q2/page.tsx", import.meta.url),
  "utf8",
);
const examForm = readFileSync(
  new URL("../../app/quizzes/take/components/ExamForm.tsx", import.meta.url),
  "utf8",
);
const attemptReview = readFileSync(
  new URL("../../app/quizzes/take/components/AttemptReview.tsx", import.meta.url),
  "utf8",
);
const takeActions = readFileSync(
  new URL("../../app/quizzes/take/actions.ts", import.meta.url),
  "utf8",
);
const staffAttemptBrowser = readFileSync(
  new URL(
    "../../app/quizzes/staff/components/StaffAttemptBrowser.tsx",
    import.meta.url,
  ),
  "utf8",
);

describe("student-facing quiz copy", () => {
  it("never names Clerk in strings shown to students", () => {
    for (const [key, value] of Object.entries(STUDENT_COPY)) {
      assert.equal(/\bClerk\b/i.test(value), false, key);
    }
  });

  it("tells students to use the Canvas email and the course roster", () => {
    assert.match(STUDENT_COPY.signInWithSchoolEmail, /Canvas email/i);
    assert.match(STUDENT_COPY.useRosterEmail, /same Northeastern email you use on Canvas/i);
    assert.match(STUDENT_COPY.notOnRosterSubmit, /same Northeastern email you use on Canvas/i);
    assert.match(STUDENT_COPY.notOnRosterSubmit, /course roster/i);
    for (const value of Object.values(STUDENT_COPY)) {
      assert.doesNotMatch(value, /hard[-\s]?refresh/i);
      assert.doesNotMatch(value, /refresh (this|the) page/i);
    }
    assert.match(quizTakePage, /ask the instructor to refresh the roster/);
    assert.doesNotMatch(quizTakePage, /hard[-\s]?refresh/i);
    assert.doesNotMatch(quizTakePage, /refresh (this|the) page/i);
  });

  it("keeps Sign up first and Canvas-email match for taking an exam", () => {
    assert.match(STUDENT_COPY.takeIndexLead, /Exams are taken on this site/);
    assert.doesNotMatch(STUDENT_COPY.takeIndexLead, /graded (attempt|quiz)/i);
    assert.match(STUDENT_COPY.takeMetaDescription, /Graded quizzes are taken in Canvas, not on this site/);
    assert.doesNotMatch(STUDENT_COPY.signInToSubmit, /graded quiz/i);
    assert.match(STUDENT_COPY.takeIndexLead, /Sign up first/i);
    assert.match(STUDENT_COPY.takeIndexLead, /not pre-provisioned/i);
    assert.match(STUDENT_COPY.takeIndexLead, /this site is not Canvas/i);
    assert.match(
      STUDENT_COPY.takeIndexLead,
      /same Northeastern email you use on Canvas/i,
    );
    assert.match(STUDENT_COPY.takeIndexLead, /that Canvas email/i);
    assert.match(STUDENT_COPY.takeMetaDescription, /Sign up if you don['’]t have/i);
    assert.match(
      STUDENT_COPY.takeMetaDescription,
      /same Northeastern email you use on Canvas/i,
    );
    assert.match(STUDENT_COPY.signInPageHint, /Sign up first/i);
    assert.match(
      STUDENT_COPY.signInPageHint,
      /same Northeastern email you use on Canvas/i,
    );
    assert.match(
      STUDENT_COPY.signUpPageHint,
      /Graded quizzes are taken in Canvas, not on this site/,
    );
  });

  it("says graded quizzes are taken in Canvas, not on this site", () => {
    assert.equal(
      CANVAS_ONLY_QUIZ_SENTENCE,
      "Graded quizzes are taken in Canvas, not on this site.",
    );
    for (const id of ["q1", "q2", "q3", "q4", "q5", "q6"]) {
      assert.equal(isCanvasOnlyQuiz(id), true, id);
    }
    assert.equal(isCanvasOnlyQuiz("x1"), false);
    assert.equal(isCanvasOnlyQuiz("x2"), false);
    assert.equal(CANVAS_ONLY_QUIZ_PAGE_COPY.paragraphs[0], CANVAS_ONLY_QUIZ_SENTENCE);
    assert.match(CANVAS_ONLY_QUIZ_PAGE_COPY.paragraphs.join(" "), /Open this quiz from your Canvas course/);
    assert.match(quizIndexPage, /CANVAS_ONLY_QUIZ_SENTENCE/);
    assert.match(quizIndexPage, /isCanvasOnlyQuiz\(quizId\)/);
    assert.match(quizIndexPage, /Taken on Canvas/);
    assert.match(quizIndexPage, /You cannot start a graded quiz here/);
    assert.doesNotMatch(quizIndexPage, /canvasQuizTakeUrl/);
    assert.doesNotMatch(quizIndexPage, /Not open yet/);
    assert.doesNotMatch(quizIndexPage, /"Open"/);
    assert.doesNotMatch(quizIndexPage, /8 topic items \+ 2 coding items/);
    assert.match(quizzesReview, /CANVAS_ONLY_QUIZ_SENTENCE/);
    assert.match(quizzesReview, /Taken on Canvas/);
    assert.doesNotMatch(quizzesReview, /\/quizzes\/take\/q1/);
    assert.doesNotMatch(quizzesReview, /\/quizzes\/take\/q2/);
    assert.doesNotMatch(quizzesReview, /Student exam/);
    assert.match(questionBankReview, /isCanvasOnlyQuiz/);
    assert.match(questionBankReview, /CANVAS_ONLY_QUIZ_SENTENCE/);
    assert.match(quizzesDenied, /CANVAS_ONLY_QUIZ_SENTENCE/);
    assert.doesNotMatch(quizzesDenied, /later quizzes are on/i);
    assert.doesNotMatch(quizIndexPage, /later quizzes are on/i);
    assert.doesNotMatch(quizzesDenied, /\/quizzes\/take\/q1/);
  });

  it("never starts or stores a student graded-quiz attempt on this site", () => {
    // Take page: students get the Canvas note, never the exam form.
    assert.match(quizTakePage, /const canvasOnly = isCanvasOnlyQuiz\(quizId\)/);
    assert.match(
      quizTakePage,
      /\(impersonating \|\| \(phase === "take_open" && !canvasOnly\)\)/,
    );
    assert.match(quizTakePage, /CANVAS_ONLY_QUIZ_PAGE_COPY/);
    assert.match(quizTakePage, /schedule && !canvasOnly \?/);
    assert.match(quizTakePage, /!isAuthenticated && canvasOnly/);
    // Submit action: refuses Canvas-only quizzes unless impersonating (not saved).
    assert.match(takeActions, /canvasOnlySubmitBlocked\(input\.quizId, impersonating\)/);
    for (const id of ["q1", "q2", "q3", "q4", "q5", "q6"]) {
      assert.equal(canvasOnlySubmitBlocked(id, false), true, id);
      assert.equal(canvasOnlySubmitBlocked(id, true), false, id);
    }
    assert.equal(canvasOnlySubmitBlocked("x1", false), false);
    assert.equal(canvasOnlySubmitBlocked("x2", false), false);
  });

  it("does not link graded quizzes to this site's take pages", () => {
    const pages = [
      quizIndexPage,
      quizTakePage,
      quizzesReview,
      questionBankReview,
      quiz1ReviewPage,
      quiz2ReviewPage,
    ];
    for (const source of pages) {
      assert.doesNotMatch(source, /href=["'{][^"'}]*\/quizzes\/take\/q1/);
      assert.doesNotMatch(source, /href=["'{][^"'}]*\/quizzes\/take\/q2/);
      assert.doesNotMatch(source, /canvasQuizTakeUrl/);
    }
    assert.match(questionBankReview, /quizId \?\? takeHref/);
    assert.match(quiz1ReviewPage, /quizId="q1"/);
    assert.match(quiz2ReviewPage, /quizId="q2"/);
    assert.match(quizIndexPage, /Taken on Canvas/);
    assert.doesNotMatch(quizIndexPage, /is on Canvas/);
  });

  it("does not put topic titles beside student question numbers", () => {
    assert.doesNotMatch(examForm, /question\.groupName/);
    assert.match(attemptReview, /showGroupTitle = false/);
    assert.match(
      attemptReview,
      /showGroupTitle\s*\?\s*` \$\{question\?\.groupName/,
    );
    assert.match(staffAttemptBrowser, /showGroupTitle/);
    assert.doesNotMatch(
      quizTakePage,
      /<GradedQuestionList[\s\S]*showGroupTitle/,
    );
  });
});
