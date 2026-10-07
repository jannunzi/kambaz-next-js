/**
 * Student-facing course-website account copy.
 * Piazza CS5610-09 Post 12 + Jose follow-up: this site is not Canvas /
 * Northeastern SSO; accounts are not pre-provisioned. Students Sign up
 * with the same Northeastern email they use on Canvas so site progress
 * can be mapped back to the roster, then Sign in.
 * Do not name the auth vendor (Clerk) here.
 */
export const COURSE_WEBSITE_ACCOUNT_COPY = {
  heading: "Course website accounts",
  separateFromCanvas:
    "This course website (Kambaz) at https://kambaz.dev/ is separate from Canvas and Northeastern SSO. Signing in here is not the same as signing into Canvas.",
  readOnlyBackup:
    "https://webdev-client.vercel.app is a read-only backup for reading notes if kambaz.dev won’t load on your network. You can’t sign in or submit there.",
  notPreProvisioned:
    "Accounts are not pre-provisioned. If Sign in says it couldn’t find your account, you do not need roster access — you still need to register.",
  signUpThenSignIn:
    "Use Sign up to create your own account with the same Northeastern email you use on Canvas, then Sign in. That email lets us map site progress back to the Canvas roster.",
  quizRosterSeparate:
    "Graded quizzes are taken in Canvas, not on this site. Sign up here with the same Northeastern email you use on Canvas so site progress can be mapped back to the roster. Creating a site account does not enroll you on the roster.",
  signInPageHint:
    "This site is separate from Canvas and Northeastern SSO. Accounts are not created for you. If you don’t have an account yet, Sign up first with the same Northeastern email you use on Canvas, then Sign in. That email lets us map site progress back to the Canvas roster. “Couldn’t find your account” means you still need to Sign up — not that you need roster access.",
  signUpPageHint:
    "This site is separate from Canvas and Northeastern SSO. Sign up with the same Northeastern email you use on Canvas — nothing is pre-provisioned. That email lets us map site progress back to the Canvas roster. After you register, Sign in. Graded quizzes are taken in Canvas, not on this site.",
  assignmentAuthHint:
    "Need an account? Sign up first with the same Northeastern email you use on Canvas, then Sign in. This site is not Canvas, and accounts are not pre-provisioned. Using your Canvas email lets us map site progress back to the roster.",
  assignmentSignInHint:
    "This site is separate from Canvas. Accounts are not created for you — Sign up first with the same Northeastern email you use on Canvas, then Sign in to submit URLs across devices.",
  signInWithCanvasEmail: "Sign in with your Canvas email",
  signUpWithCanvasEmail: "Sign up with your Canvas email",
  signUpCtaSuffix: "if you do not have an account yet.",
  signInCtaSuffix: "after you create your account.",
} as const;

export type CourseWebsiteAccountCopyKey = keyof typeof COURSE_WEBSITE_ACCOUNT_COPY;
