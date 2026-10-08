/**
 * Student-facing graded-quiz copy. Do not name the auth vendor (Clerk)
 * here — staff pages and the README still can.
 *
 * Creating a course-website account is not Canvas. Students Sign up with
 * the same Northeastern email they use on Canvas so progress can be
 * mapped to the roster. Graded quizzes (Q1–Q6) are taken in Canvas, not
 * on this site; roster match is still required to take / submit an exam
 * here. Shared Sign up / Sign in page hints live in
 * `lib/course-site/account-copy.ts`.
 */
import { COURSE_WEBSITE_ACCOUNT_COPY } from "../course-site/account-copy";

export const STUDENT_COPY = {
  signInWithSchoolEmail: COURSE_WEBSITE_ACCOUNT_COPY.signInWithCanvasEmail,
  signUpWithSchoolEmail: COURSE_WEBSITE_ACCOUNT_COPY.signUpWithCanvasEmail,
  useRosterEmail: "Use the same Northeastern email you use on Canvas.",
  takeMetaDescription:
    "Graded quizzes are taken in Canvas, not on this site. For exams, Sign up if you don’t have a course-website account yet, then Sign in with the same Northeastern email you use on Canvas.",
  takeIndexLead:
    "Exams are taken on this site. If you don’t have a course-website account yet, Sign up first with the same Northeastern email you use on Canvas — accounts are not pre-provisioned and this site is not Canvas. Then Sign in with that Canvas email to start or submit an exam attempt.",
  notOnRosterTitle: "This email isn’t on the course roster",
  notOnRosterPage:
    "Sign in with the same Northeastern email you use on Canvas. Browsing the book, syllabus, labs, and practice pages is fine. A graded attempt was not created.",
  notOnRosterSubmit:
    "This email isn’t on the course roster. Sign in with the same Northeastern email you use on Canvas. You can browse the book, but a graded attempt was not created.",
  signInToSubmit: "Sign in with your Canvas email to submit.",
  signInPageHint: COURSE_WEBSITE_ACCOUNT_COPY.signInPageHint,
  signUpPageHint: COURSE_WEBSITE_ACCOUNT_COPY.signUpPageHint,
} as const;

export type StudentCopyKey = keyof typeof STUDENT_COPY;
