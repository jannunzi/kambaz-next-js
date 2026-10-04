import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { CANVAS_ONLY_QUIZ_SENTENCE } from "./schedule";
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
const examForm = readFileSync(
  new URL("../../app/quizzes/take/components/ExamForm.tsx", import.meta.url),
  "utf8",
);
const attemptReview = readFileSync(
  new URL("../../app/quizzes/take/components/AttemptReview.tsx", import.meta.url),
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

  it("keeps Sign up first and Canvas-email match for taking a quiz", () => {
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
      /taking a graded quiz still requires your Canvas roster email/i,
    );
  });

  it("says closed Quiz 1 and Quiz 2 are taken on Canvas, not on this site", () => {
    assert.equal(
      CANVAS_ONLY_QUIZ_SENTENCE,
      "Quiz 1 and Quiz 2 are taken on Canvas, not on this site.",
    );
    assert.match(quizTakePage, /isCanvasOnlyQuiz\(quizId\) && phase !== "take_open"/);
    assert.match(quizIndexPage, /CANVAS_ONLY_QUIZ_SENTENCE/);
    assert.match(quizIndexPage, /isCanvasOnlyQuiz\(quizId\)/);
    assert.doesNotMatch(quizIndexPage, /Take or review \$\{bank\.title\}[\s\S]*isCanvasOnlyQuiz/);
    assert.match(quizzesDenied, /CANVAS_ONLY_QUIZ_SENTENCE/);
    assert.doesNotMatch(quizzesDenied, /later quizzes are on/i);
    assert.doesNotMatch(quizIndexPage, /later quizzes are on/i);
    assert.doesNotMatch(quizzesDenied, /\/quizzes\/take\/q1/);
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
