/**
 * Student-facing assignment submit copy. Do not name the auth vendor
 * (Clerk) here — staff pages and the README still can.
 *
 * Creating a course-website account is not Canvas. Students Sign up
 * with the same Northeastern email they use on Canvas/FACT so progress
 * can be mapped to the roster. Run checks does not require an account.
 * Saving URLs still requires sign-in and a roster match. Save is not
 * unlocked by a calendar date. Do not name demo students in this file.
 *
 * Jose (2026-09-17): do not tell students to hard-refresh as a fix for
 * missing A1 URL submit fields or a roster mismatch. The student fix is
 * Sign in with the same Northeastern/Canvas email as on the course
 * roster. If that still fails, ask staff to refresh the roster or
 * contact the instructor.
 */
import { COURSE_WEBSITE_ACCOUNT_COPY } from "../course-site/account-copy";

export const ASSIGNMENT_STUDENT_COPY = {
  signInToSubmit:
    "Sign up if you don’t have a course-website account yet, then Sign in with the same Northeastern email you use on Canvas to submit your GitHub and Vercel URLs.",
  signInHint: COURSE_WEBSITE_ACCOUNT_COPY.assignmentSignInHint,
  syncProgress:
    "Sign up if you don’t have a course-website account yet, then Sign in with the same Northeastern email you use on Canvas to sync progress.",
  checksNotSaved:
    "Run checks updates this page only. Checkmarks are not saved. Sign up if you don’t have a course-website account yet, then Sign in with the same Northeastern email you use on Canvas to save your GitHub and Vercel URLs.",
  urlSubmitWhen:
    "Run checks on a public Vercel URL works without an account. Saving URLs is not unlocked by a calendar date. Save stays closed until you are signed in with the same Northeastern email as your Canvas/FACT roster, and that email is on the course site roster.",
  notOnRosterTitle: "This email isn’t on the course roster",
  notOnRoster:
    "This email isn’t on the Canvas/FACT course roster. You can still run checks on a public Vercel URL. Checkmarks are not saved. URL submit stays closed until you Sign in with the same Northeastern email you use on Canvas. Creating a site account does not enroll you on the roster; use your Canvas email so we can map progress. If you already did that and are still blocked, ask staff on Piazza to refresh the roster or contact the instructor.",
  rosterEmpty:
    "The course roster has not been loaded yet. This is not a date lock — URL submit stays closed until the instructor imports the roster.",
  notConfiguredTitle: "URL submit is not available yet",
  notConfigured:
    "This is not a date lock. The course site could not read the imported Canvas/FACT roster, so saving URLs stays closed. You can still run checks on a public Vercel URL. Sign in with the same Northeastern email you use on Canvas. If you are still blocked, ask staff on Piazza to refresh the roster or contact the instructor — this is a site roster connection problem, not a missing Sign-in.",
  unknownAssignment: "URL submit is only available for A1 and A2 right now.",
  impersonationBanner:
    "Impersonation — you can run checks to smoke-test the form. The submission is not saved.",
    saved: "Saved. You can run checks again after you update your Vercel URL.",
  savedButNotPersisted: "Checks finished. This preview was not saved.",
  checkInstructions:
    "Paste a public Vercel URL. Checks normalize the deploy origin, fetch Labs and Lab pages, crawl Kambaz screens, and look for wd-* ids and required content markers. A GitHub URL is optional for Run checks.",
  proposedGradeLabel: "Proposed grade",
  staffGradeLabel: "Staff grade",
  acceptProposed: "Accept proposed grade",
  overrideGrade: "Save override grade",
  noSubmission: "This student has not submitted a Vercel URL yet.",
  staffCommentsHint: "Comments are visible to the student.",
  studentFeedbackHint: "Staff comments on each item, if any, appear below.",
  bothUrlsRequired: "Enter both a GitHub repository URL and a Vercel deployment URL.",
  vercelRequired: "Enter a Vercel deployment URL so checks can open your site.",
  githubFormat:
    "Enter a public GitHub repository URL such as https://github.com/yourname/webdev-client.",
  githubOfficial:
    "Submit your own public GitHub repository, not the course starter repo.",
  githubPrivate:
    "This GitHub repository was not found or is private. Make the repo public so graders can open it.",
  githubUnreachable: "Could not reach GitHub to confirm the repository is public.",
  githubOk: "This looks like a public GitHub repository.",
  vercelFormat:
    "Enter an https Vercel deployment URL that graders can open. Localhost and http URLs cannot be checked.",
  vercelLocalhost:
    "Localhost URLs cannot be graded. Submit your public Vercel deployment.",
  vercelCourseSite: "Submit your own Vercel deployment, not the course website.",
  vercelBlockedHost:
    "That host cannot be checked. Submit a public https deployment URL.",
  vercelHttps: "Use an https URL, not http.",
  vercelOk: "This is an https deployment URL (not localhost).",
  vercelAuthWall:
    "Vercel Deployment Protection is on (login required, or HTTP 401/403). Turn protection off so the page opens without signing in.",
  vercelUnreachable:
    "Could not open your Vercel URL. Open that same URL in a private/incognito window. If the browser cannot load the page, Run checks cannot either — submit a public https://….vercel.app URL and turn off Deployment Protection.",
  vercelNotFound:
    "Your Vercel URL returned HTTP 404 (this page cannot be loaded). Open it in a private window and submit the production https://….vercel.app URL that actually opens — not a deleted preview or a path that 404s.",
  vercelHttpError:
    "Your Vercel URL did not load. Open that same URL in a private/incognito window. If the browser cannot load the page, Run checks cannot either.",
  labsOk: "Found Labs navigation or wd- hooks used in A1.",
  labsMissing:
    "The page opened, but Labs navigation / wd- ids were not found. Open /labs on your deploy and follow Chapter 1.",
  labsUnread: "Could not read the page to check Labs markers.",
  nameOk: "Found your full Canvas name on Labs.",
  nameMissing:
    "Your name was not found on Labs. Put your full Canvas name there (first then last, matching the roster). There is no Name and section checkbox in Run checks.",
  nameAndSection:
    "Show your full Canvas name on Labs (first then last, matching the roster). There is no Name and section checkbox or control in Run checks.",
  nameAndSectionDeliveryNote:
    "Name and section is your full Canvas name on Labs (first then last, matching the roster), not a checkbox or control in Run checks.",
  manualCheckHint:
    "Checked by staff at grading. Staff grade this row on your deploy URL. Run checks does not mark it pass or fail. Manual check is not a failed auto check.",
  manualCheckLabNote:
    "A Manual check badge means checked by staff at grading. Staff grade that row on your deploy URL. Run checks never marks it pass or fail, and it is not a failed auto check.",
} as const;

export type AssignmentStudentCopyKey = keyof typeof ASSIGNMENT_STUDENT_COPY;
