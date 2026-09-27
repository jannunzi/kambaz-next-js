import {
  COURSE_SITE_ORIGIN,
  assignmentPublicUrl,
  listAssignments,
} from "./catalog";
import type { AssignmentHubItem, AssignmentId } from "./types";

/**
 * Minimal Canvas assignment description. The IMSCC cartridge is not in this
 * git repo (Jose’s tooling keeps it under canvas-fall). Paste these into A1–A6
 * descriptions in a follow-up package; do not dump the website rubric into
 * Canvas.
 *
 * Quiz / exam fallback copy (website take + staff-permission blurb) lives in
 * `lib/quiz-exam/canvas-copy.ts` and is packed by `npm run canvas:export-qti`.
 */
export function canvasAssignmentDescriptionHtml(
  assignment: AssignmentHubItem,
): string {
  const url = assignment.publicUrl;
  return [
    `<p>Complete ${assignment.canvasId} — ${assignment.title} on the course site:</p>`,
    `<p><a href="${url}">${url}</a></p>`,
    `<p>Sign up on the course site if you do not have an account yet with the same Northeastern email you use on Canvas, then Sign in to submit your GitHub and Vercel URLs. This site is not Canvas and accounts are not pre-provisioned. Using your Canvas email lets us map site progress back to the roster. Submit your GitHub repository and Vercel URL here in Canvas.</p>`,
  ].join("");
}

export function listCanvasFollowupCopy(): Array<{
  canvasId: string;
  assignmentId: AssignmentId;
  publicUrl: string;
  html: string;
}> {
  return listAssignments().map((assignment) => ({
    canvasId: assignment.canvasId,
    assignmentId: assignment.id,
    publicUrl: assignment.publicUrl,
    html: canvasAssignmentDescriptionHtml(assignment),
  }));
}

export { COURSE_SITE_ORIGIN, assignmentPublicUrl };
export {
  CANVAS_FALLBACK_PERMISSION_BLURB,
  canvasQuizDescriptionHtml,
  listCanvasQuizFollowupCopy,
} from "../quiz-exam/canvas-copy";
