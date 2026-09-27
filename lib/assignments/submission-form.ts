import { isAssignmentId } from "./catalog";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import {
  supportsUrlSubmission,
  type AssignmentSubmitGate,
} from "./access";

export type SubmissionGateReason =
  | "sign_in"
  | "not_on_roster"
  | "roster_empty"
  | "not_configured"
  | null;

/**
 * `fields` — signed-in roster (or staff) may save and run account checks.
 * `check` — URL fields and Run checks stay open; Save shows the gate.
 * A missing reason still gets an explicit save message, never a blank Save.
 */
export type A1SubmissionFormState =
  | { mode: "fields"; gateReason: null }
  | { mode: "check"; gateReason: Exclude<SubmissionGateReason, null> };

/** Which server action Run checks should call. Save is never the public action. */
export type A1CheckAction = "public" | "account" | "staff";

/**
 * Run checks is public. Save stays behind canSubmit (sign-in + roster,
 * or staff). Off-roster and other save misses still get an explicit
 * message where the Save button would be.
 */
export function a1SubmissionFormState(input: {
  canSubmit: boolean;
  gateReason?: SubmissionGateReason;
}): A1SubmissionFormState {
  if (input.canSubmit) return { mode: "fields", gateReason: null };
  return {
    mode: "check",
    gateReason: input.gateReason ?? "not_configured",
  };
}

/**
 * Staff review keeps the staff action. Account checks (including
 * impersonation, which may run but not persist) stay on the authenticated
 * action. Everyone else uses the public check, which does not read or
 * write a submission.
 */
export function a1CheckAction(input: {
  staffReview: boolean;
  form: A1SubmissionFormState;
}): A1CheckAction {
  if (input.staffReview) return "staff";
  if (input.form.mode === "fields") return "account";
  return "public";
}

/**
 * Validate a public Run checks request. No session and no roster.
 * Persistence is intentionally not representable here.
 */
export function preparePublicAssignmentCheck(input: {
  assignmentId: string;
  githubUrl: string;
  vercelUrl: string;
}):
  | { ok: true; githubUrl: string; vercelUrl: string }
  | { ok: false; code: "invalid"; message: string } {
  if (
    !supportsUrlSubmission(input.assignmentId) ||
    !isAssignmentId(input.assignmentId)
  ) {
    return {
      ok: false,
      code: "invalid",
      message: ASSIGNMENT_STUDENT_COPY.unknownAssignment,
    };
  }
  const githubUrl = input.githubUrl.trim();
  const vercelUrl = input.vercelUrl.trim();
  if (!vercelUrl) {
    return {
      ok: false,
      code: "invalid",
      message: ASSIGNMENT_STUDENT_COPY.vercelRequired,
    };
  }
  const githubMissing = missingA2GithubMessage(input.assignmentId, githubUrl);
  if (githubMissing) {
    return { ok: false, code: "invalid", message: githubMissing };
  }
  return { ok: true, githubUrl, vercelUrl };
}

/** A2 Save/submit requires a GitHub URL. A1 stays optional. */
export function missingA2GithubMessage(
  assignmentId: string,
  githubUrl: string,
): string | null {
  if (assignmentId !== "a2") return null;
  if (githubUrl.trim()) return null;
  return ASSIGNMENT_STUDENT_COPY.a2GithubRequired;
}

export function gateReasonFromAccess(
  access: AssignmentSubmitGate,
): SubmissionGateReason {
  if (access.ok) return null;
  switch (access.code) {
    case "unauthenticated":
      return "sign_in";
    case "not_on_roster":
      return "not_on_roster";
    case "roster_empty":
      return "roster_empty";
    case "not_configured":
    case "invalid":
      return "not_configured";
  }
}

export function submissionGateCopy(
  reason: Exclude<SubmissionGateReason, null>,
): { title: string; body: string } {
  switch (reason) {
    case "sign_in":
      return {
        title: "Sign in to submit URLs",
        body: ASSIGNMENT_STUDENT_COPY.signInHint,
      };
    case "not_on_roster":
      return {
        title: ASSIGNMENT_STUDENT_COPY.notOnRosterTitle,
        body: ASSIGNMENT_STUDENT_COPY.notOnRoster,
      };
    case "roster_empty":
      return {
        title: "Course roster has not been loaded",
        body: ASSIGNMENT_STUDENT_COPY.rosterEmpty,
      };
    case "not_configured":
      return {
        title: ASSIGNMENT_STUDENT_COPY.notConfiguredTitle,
        body: ASSIGNMENT_STUDENT_COPY.notConfigured,
      };
  }
}

export type A1SubmitVisibility = {
  canSubmit: boolean;
  gateReason: SubmissionGateReason;
};

/**
 * Single source for A1 URL-field visibility. Checklist / progress / staff
 * extras must not rewrite this — “the page loaded” is not canSubmit.
 */
export function resolveA1SubmitVisibility(input: {
  assignmentId: string;
  access: AssignmentSubmitGate;
}): A1SubmitVisibility {
  const canSubmit = input.access.ok && supportsUrlSubmission(input.assignmentId);
  return {
    canSubmit,
    gateReason: canSubmit ? null : gateReasonFromAccess(input.access),
  };
}
