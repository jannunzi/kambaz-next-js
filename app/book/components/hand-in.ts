import { COURSE_SITE_ORIGIN } from "../../../lib/course-site/origin";

export type HandInAssignmentId = "a1" | "a2" | "a3" | "a4" | "a5" | "a6";

/** Absolute kambaz.dev URL where students hand in an assignment. */
export function handInUrl(id: HandInAssignmentId): string {
  return `${COURSE_SITE_ORIGIN}/assignments/${id}`;
}
