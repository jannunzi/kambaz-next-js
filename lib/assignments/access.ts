import type { RosterLookupResult } from "../roster/types";

export const ASSIGNMENT_SUBMISSION_IDS = ["a1", "a2"] as const;

export type AssignmentSubmitGate =
  | { ok: true }
  | {
      ok: false;
      code:
        | "unauthenticated"
        | "not_configured"
        | "not_on_roster"
        | "roster_empty"
        | "invalid";
    };

export function supportsUrlSubmission(assignmentId: string): boolean {
  return (ASSIGNMENT_SUBMISSION_IDS as readonly string[]).includes(
    assignmentId,
  );
}

export function canPersistAssignmentSubmission(impersonating: boolean): boolean {
  return !impersonating;
}

export {
  canPersistStaffGrade,
  canViewStaffGrader,
  staffGraderAccess,
} from "./staff";

/**
 * Rostered students and staff (including View as student) may use the form.
 * Sign-in and a roster match (including built-in Ada / Bob) are checked
 * before the Clerk+Mongo env gate so those reasons are not mislabeled as
 * “not configured.” Persist is decided separately so impersonation can
 * smoke-test without writes.
 */
export function assignmentSubmitAccess(input: {
  signedIn: boolean;
  configured: boolean;
  isActualStaff: boolean;
  roster: RosterLookupResult;
}): AssignmentSubmitGate {
  if (!input.signedIn) return { ok: false, code: "unauthenticated" };
  if (input.isActualStaff) return { ok: true };
  if (input.roster.status === "matched") return { ok: true };
  // A known miss is never “not configured” — students must see the
  // off-roster message, not “URL submit is not available yet.”
  if (input.roster.status === "not_on_roster") {
    return { ok: false, code: "not_on_roster" };
  }
  if (input.roster.status === "empty") return { ok: false, code: "roster_empty" };
  if (!input.configured) return { ok: false, code: "not_configured" };
  if (input.roster.status === "not_configured") {
    return { ok: false, code: "not_configured" };
  }
  return { ok: false, code: "not_on_roster" };
}
