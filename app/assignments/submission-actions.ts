"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import {
  assignmentSubmitAccess,
  canPersistAssignmentSubmission,
  supportsUrlSubmission,
} from "@/lib/assignments/access";
import { runConfiguredChecks, type AssignmentCheckResult } from "@/lib/assignments/checks";
import { fetchDeployHtml, probeGithubRepo } from "@/lib/assignments/fetch-deploy";
import { resolveNameQuery, type NameSource } from "@/lib/assignments/names";
import {
  readAssignmentSubmission,
  writeAssignmentSubmission,
} from "@/lib/assignments/submissions";
import {
  toSubmissionView,
  type AssignmentSubmissionView,
} from "@/lib/assignments/submissions-store";
import {
  missingA2GithubMessage,
  preparePublicAssignmentCheck,
} from "@/lib/assignments/submission-form";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";
import { isAssignmentId } from "@/lib/assignments/catalog";
import { getChecker } from "@/lib/assignments/checkers";
import { checkerVersionLabel } from "@/lib/assignments/checker-version";
import type { AssignmentId } from "@/lib/assignments/types";
import { isAssignmentProgressConfigured } from "@/lib/config";
import {
  canvasUserIdFromMetadata,
  preferredRosterEmail,
} from "@/lib/roster/emails";
import { loadClerkRosterEmails } from "@/lib/roster/load-clerk-emails";
import { lookupCanvasRoster } from "@/lib/roster/lookup";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";
import type { AssignmentSubmissionIdentity } from "@/lib/assignments/submissions-store";

export type SubmissionActionResult =
  | {
      ok: true;
      persisted: boolean;
      impersonation?: boolean;
      submission: AssignmentSubmissionView;
    }
  | {
      ok: false;
      code:
        | "unauthenticated"
        | "not_configured"
        | "not_on_roster"
        | "roster_empty"
        | "invalid"
        | "persist_failed";
      message: string;
    };

function gateMessage(
  code: Exclude<SubmissionActionResult, { ok: true }>["code"],
): string {
  switch (code) {
    case "unauthenticated":
      return ASSIGNMENT_STUDENT_COPY.signInToSubmit;
    case "not_configured":
      return ASSIGNMENT_STUDENT_COPY.notConfigured;
    case "not_on_roster":
      return ASSIGNMENT_STUDENT_COPY.notOnRoster;
    case "roster_empty":
      return ASSIGNMENT_STUDENT_COPY.rosterEmpty;
    case "invalid":
      return ASSIGNMENT_STUDENT_COPY.unknownAssignment;
    default:
      return "Could not submit.";
  }
}

function nameSourceFromActor(
  user: Awaited<ReturnType<typeof currentUser>>,
  roster: Awaited<ReturnType<typeof lookupCanvasRoster>>,
): NameSource {
  if (roster.status === "matched" && roster.entry.source === "impersonation") {
    return {};
  }
  return {
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    rosterName: roster.status === "matched" ? roster.entry.name : undefined,
  };
}

function identityFromRoster(
  user: Awaited<ReturnType<typeof currentUser>>,
  roster: Awaited<ReturnType<typeof lookupCanvasRoster>>,
): AssignmentSubmissionIdentity {
  const matched = roster.status === "matched" ? roster.entry : undefined;
  return {
    email: preferredRosterEmail(user, matched?.email),
    rosterEmail: matched?.email,
    name: matched?.name ?? user?.fullName ?? undefined,
    canvasUserId: matched?.canvasUserId ?? canvasUserIdFromMetadata(user),
    section: matched?.section,
  };
}

async function authorizeSubmission(assignmentId: string): Promise<
  | {
      ok: true;
      userId: string;
      impersonating: boolean;
      canPersist: boolean;
      nameSource: NameSource;
      identity: AssignmentSubmissionIdentity;
    }
  | { ok: false; result: Extract<SubmissionActionResult, { ok: false }> }
> {
  if (!supportsUrlSubmission(assignmentId) || !isAssignmentId(assignmentId)) {
    return {
      ok: false,
      result: { ok: false, code: "invalid", message: gateMessage("invalid") },
    };
  }

  const configured = isAssignmentProgressConfigured();
  const { userId, sessionClaims } = await auth();
  const signedIn = Boolean(userId);
  if (!signedIn || !userId) {
    return {
      ok: false,
      result: {
        ok: false,
        code: "unauthenticated",
        message: gateMessage("unauthenticated"),
      },
    };
  }

  const user = await currentUser();
  const emails = await loadClerkRosterEmails({
    user,
    sessionClaims,
    userId,
  });
  const canvasUserId = canvasUserIdFromMetadata(user);
  const impersonating = await isImpersonatingStudent();
  const staff = await isActualStaff();
  const roster = await lookupCanvasRoster({
    emails,
    canvasUserIds: canvasUserId ? [canvasUserId] : [],
    impersonating,
  });
  const access = assignmentSubmitAccess({
    signedIn: true,
    configured,
    isActualStaff: staff,
    roster,
  });
  if (!access.ok) {
    return {
      ok: false,
      result: {
        ok: false,
        code: access.code,
        message: gateMessage(access.code),
      },
    };
  }

  return {
    ok: true,
    userId,
    impersonating,
    canPersist:
      configured && canPersistAssignmentSubmission(impersonating),
    nameSource: nameSourceFromActor(user, roster),
    identity: identityFromRoster(user, roster),
  };
}

async function runChecksForAssignment(input: {
  assignmentId: string;
  githubUrl: string;
  vercelUrl: string;
  nameSource: NameSource;
}): Promise<AssignmentCheckResult[]> {
  return runConfiguredChecks(input.assignmentId, {
    githubUrl: input.githubUrl,
    vercelUrl: input.vercelUrl,
    nameQuery: resolveNameQuery(input.nameSource),
    probes: {
      getHtml: fetchDeployHtml,
      probeUrl: probeGithubRepo,
    },
  });
}

function viewFromInputs(input: {
  githubUrl: string;
  vercelUrl: string;
  checkResults: AssignmentCheckResult[];
  now?: Date;
}): AssignmentSubmissionView {
  const now = (input.now ?? new Date()).toISOString();
  return {
    githubUrl: input.githubUrl,
    vercelUrl: input.vercelUrl,
    updatedAt: now,
    lastCheckedAt: now,
    checkResults: input.checkResults,
  };
}

/**
 * Logged-out (and other save-gated) visitors can run A1 checks.
 * This action never reads or writes assignment_submissions and does not
 * consult Clerk. Saving stays on saveAssignmentSubmission.
 */
export async function runPublicAssignmentChecks(input: {
  assignmentId: string;
  githubUrl: string;
  vercelUrl: string;
}): Promise<SubmissionActionResult> {
  const prepared = preparePublicAssignmentCheck(input);
  if (!prepared.ok) return prepared;

  const checkResults = await runChecksForAssignment({
    assignmentId: input.assignmentId,
    githubUrl: prepared.githubUrl,
    vercelUrl: prepared.vercelUrl,
    nameSource: {},
  });

  return {
    ok: true,
    persisted: false,
    submission: viewFromInputs({
      githubUrl: prepared.githubUrl,
      vercelUrl: prepared.vercelUrl,
      checkResults,
    }),
  };
}

export async function saveAssignmentSubmission(input: {
  assignmentId: string;
  githubUrl: string;
  vercelUrl: string;
}): Promise<SubmissionActionResult> {
  const authz = await authorizeSubmission(input.assignmentId);
  if (!authz.ok) return authz.result;

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

  const persist = authz.canPersist;

  if (!persist) {
    return {
      ok: true,
      persisted: false,
      impersonation: authz.impersonating || undefined,
      submission: viewFromInputs({ githubUrl, vercelUrl, checkResults: [] }),
    };
  }

  // Check the submitted URLs and store the results with the submission, so
  // staff always see results for exactly what was submitted.
  let checkResults: AssignmentCheckResult[] = [];
  try {
    checkResults = await runChecksForAssignment({
      assignmentId: input.assignmentId,
      githubUrl,
      vercelUrl,
      nameSource: authz.nameSource,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checks failed.";
    console.error("assignment submission checks failed", message);
  }
  const checker = getChecker(input.assignmentId);

  try {
    const doc = await writeAssignmentSubmission({
      clerkUserId: authz.userId,
      assignmentId: input.assignmentId as AssignmentId,
      githubUrl,
      vercelUrl,
      identity: authz.identity,
      // An empty array clears results stored for an earlier URL.
      checkResults,
      checked: checkResults.length > 0,
      checkerVersion: checker ? checkerVersionLabel(checker.rulesVersion) : undefined,
    });
    return {
      ok: true,
      persisted: true,
      submission: toSubmissionView(doc),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the submission.";
    console.error("assignment submission persist failed", message);
    return { ok: false, code: "persist_failed", message };
  }
}

/**
 * Authenticated Run checks. Results stay in the response only.
 * This action does not write checklist progress or a grade.
 * Anonymous visitors use runPublicAssignmentChecks instead.
 */
export async function runAssignmentChecks(input: {
  assignmentId: string;
  githubUrl: string;
  vercelUrl: string;
}): Promise<SubmissionActionResult> {
  const authz = await authorizeSubmission(input.assignmentId);
  if (!authz.ok) return authz.result;

  let githubUrl = input.githubUrl.trim();
  let vercelUrl = input.vercelUrl.trim();

  if (!vercelUrl && authz.canPersist) {
    try {
      const existing = await readAssignmentSubmission(
        authz.userId,
        input.assignmentId as AssignmentId,
      );
      githubUrl = githubUrl || existing?.githubUrl || "";
      vercelUrl = vercelUrl || existing?.vercelUrl || "";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not load the submission.";
      console.error("assignment submission load failed", message);
    }
  }

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

  const checkResults = await runChecksForAssignment({
    assignmentId: input.assignmentId,
    githubUrl,
    vercelUrl,
    nameSource: authz.nameSource,
  });

  return {
    ok: true,
    persisted: false,
    impersonation: authz.impersonating || undefined,
    submission: viewFromInputs({ githubUrl, vercelUrl, checkResults }),
  };
}
