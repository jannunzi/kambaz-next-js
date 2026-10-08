import type { AssignmentCheckResult } from "./checks";
import type { CriterionGradeRow } from "./grade-rows";
import type { CriterionPassMap } from "./grade";
import type { AssignmentId } from "./types";

export const ASSIGNMENT_SUBMISSIONS_COLLECTION = "assignment_submissions";

export type AssignmentStaffGrade = {
  earnedPoints: number;
  totalPoints: number;
  percent: number;
  acceptedProposed: boolean;
  /** Pass/fail flips from older saves. Newer saves also store `rows`. */
  criterionOverrides?: CriterionPassMap;
  comments?: Record<string, string>;
  gradedByEmail?: string;
  gradedByClerkUserId?: string;
  gradedAt: Date | string;
  /** Auto result, override, and points for each criterion. */
  rows?: CriterionGradeRow[];
  /** Autograder output captured with this grade. Run does not replace it. */
  checkResults?: AssignmentCheckResult[];
};

export type AssignmentSubmissionIdentity = {
  email?: string;
  rosterEmail?: string;
  name?: string;
  canvasUserId?: string;
  section?: string;
};

export type PreviousSubmissionSnapshot = {
  githubUrl: string;
  vercelUrl: string;
  updatedAt: Date | string;
  clerkUserId: string;
};

export type AssignmentSubmissionDoc = AssignmentSubmissionIdentity & {
  clerkUserId: string;
  assignmentId: AssignmentId;
  githubUrl: string;
  vercelUrl: string;
  createdAt: Date;
  updatedAt: Date;
  lastCheckedAt?: Date;
  checkResults?: AssignmentCheckResult[];
  staffGrade?: AssignmentStaffGrade;
  /** Set when this document is a resubmit during a staff reopen window. */
  regradeResubmission?: boolean;
  regradeSubmittedAt?: Date | string;
  previousStaffGrade?: AssignmentStaffGrade;
  previousSubmission?: PreviousSubmissionSnapshot;
};

export type AssignmentSubmissionHistoryDoc = {
  kind: "prior" | "regrade";
  recordedAt: Date;
  assignmentId: AssignmentId;
  clerkUserId: string;
  rosterEmail?: string;
  regradeResubmission?: boolean;
  githubUrl: string;
  vercelUrl: string;
  updatedAt: Date | string;
  staffGrade?: AssignmentStaffGrade;
  previousStaffGrade?: AssignmentStaffGrade;
};

export type AssignmentSubmissionView = AssignmentSubmissionIdentity & {
  githubUrl: string;
  vercelUrl: string;
  updatedAt: string;
  lastCheckedAt?: string;
  checkResults?: AssignmentCheckResult[];
  staffGrade?: AssignmentStaffGrade;
  regradeResubmission?: boolean;
  regradeSubmittedAt?: string;
  previousStaffGrade?: AssignmentStaffGrade;
  previousSubmission?: {
    githubUrl: string;
    vercelUrl: string;
    updatedAt: string;
    clerkUserId: string;
  };
};

export type SubmissionStore = {
  find(
    clerkUserId: string,
    assignmentId: AssignmentId,
  ): Promise<AssignmentSubmissionDoc | null>;
  upsert(doc: AssignmentSubmissionDoc): Promise<void>;
  listByAssignment?(
    assignmentId: AssignmentId,
  ): Promise<AssignmentSubmissionDoc[]>;
};

export type SubmissionHistoryStore = {
  insert(doc: AssignmentSubmissionHistoryDoc): Promise<void>;
};

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function toStaffGradeView(
  grade: AssignmentStaffGrade | undefined,
): AssignmentStaffGrade | undefined {
  if (!grade) return undefined;
  return {
    ...grade,
    gradedAt: toIso(grade.gradedAt),
  };
}

export function toSubmissionView(
  doc: AssignmentSubmissionDoc,
): AssignmentSubmissionView {
  const previous = doc.previousSubmission;
  return {
    githubUrl: doc.githubUrl,
    vercelUrl: doc.vercelUrl,
    updatedAt: toIso(doc.updatedAt),
    lastCheckedAt: doc.lastCheckedAt ? toIso(doc.lastCheckedAt) : undefined,
    checkResults: doc.checkResults,
    email: doc.email,
    rosterEmail: doc.rosterEmail,
    name: doc.name,
    canvasUserId: doc.canvasUserId,
    section: doc.section,
    staffGrade: toStaffGradeView(doc.staffGrade),
    regradeResubmission: doc.regradeResubmission || undefined,
    regradeSubmittedAt: doc.regradeSubmittedAt
      ? toIso(doc.regradeSubmittedAt)
      : undefined,
    previousStaffGrade: toStaffGradeView(doc.previousStaffGrade),
    previousSubmission: previous
      ? {
          githubUrl: previous.githubUrl,
          vercelUrl: previous.vercelUrl,
          updatedAt: toIso(previous.updatedAt),
          clerkUserId: previous.clerkUserId,
        }
      : undefined,
  };
}

export async function loadAssignmentSubmission(
  store: SubmissionStore,
  clerkUserId: string,
  assignmentId: AssignmentId,
): Promise<AssignmentSubmissionDoc | null> {
  return store.find(clerkUserId, assignmentId);
}

export async function listAssignmentSubmissions(
  store: SubmissionStore,
  assignmentId: AssignmentId,
): Promise<AssignmentSubmissionDoc[]> {
  if (!store.listByAssignment) return [];
  return store.listByAssignment(assignmentId);
}

export async function upsertAssignmentSubmission(
  store: SubmissionStore,
  input: {
    clerkUserId: string;
    assignmentId: AssignmentId;
    githubUrl: string;
    vercelUrl: string;
    checkResults?: AssignmentCheckResult[];
    checked?: boolean;
    identity?: AssignmentSubmissionIdentity;
    staffGrade?: AssignmentStaffGrade | null;
    /**
     * Resubmit during a staff reopen. Copies the previous grade from this
     * document (often the roster-matched submission, which may use an older
     * Clerk id). Omitted on ordinary saves, including every save before the
     * due instant.
     */
    regradeFrom?: AssignmentSubmissionDoc | null;
  },
  now: Date = new Date(),
): Promise<AssignmentSubmissionDoc> {
  const existing = await store.find(input.clerkUserId, input.assignmentId);
  const identity = input.identity ?? {};
  const staffGrade =
    input.staffGrade === null
      ? undefined
      : (input.staffGrade ??
        input.regradeFrom?.staffGrade ??
        existing?.staffGrade);
  const doc: AssignmentSubmissionDoc = {
    clerkUserId: input.clerkUserId,
    assignmentId: input.assignmentId,
    githubUrl: input.githubUrl,
    vercelUrl: input.vercelUrl,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    lastCheckedAt: input.checked ? now : existing?.lastCheckedAt,
    checkResults: input.checkResults ?? existing?.checkResults,
    email: identity.email ?? existing?.email ?? input.regradeFrom?.email,
    rosterEmail:
      identity.rosterEmail ??
      existing?.rosterEmail ??
      input.regradeFrom?.rosterEmail,
    name: identity.name ?? existing?.name ?? input.regradeFrom?.name,
    canvasUserId:
      identity.canvasUserId ??
      existing?.canvasUserId ??
      input.regradeFrom?.canvasUserId,
    section: identity.section ?? existing?.section ?? input.regradeFrom?.section,
    staffGrade,
  };
  if (input.regradeFrom) {
    doc.regradeResubmission = true;
    doc.regradeSubmittedAt = now;
    doc.previousStaffGrade =
      input.regradeFrom.previousStaffGrade ?? input.regradeFrom.staffGrade;
    doc.previousSubmission = {
      githubUrl: input.regradeFrom.githubUrl,
      vercelUrl: input.regradeFrom.vercelUrl,
      updatedAt: input.regradeFrom.updatedAt,
      clerkUserId: input.regradeFrom.clerkUserId,
    };
  } else if (existing?.regradeResubmission) {
    doc.regradeResubmission = true;
    if (existing.regradeSubmittedAt) {
      doc.regradeSubmittedAt = existing.regradeSubmittedAt;
    }
    if (existing.previousStaffGrade) {
      doc.previousStaffGrade = existing.previousStaffGrade;
    }
    if (existing.previousSubmission) {
      doc.previousSubmission = existing.previousSubmission;
    }
  }
  await store.upsert(doc);
  return doc;
}

export function submissionHistoryFromDoc(
  kind: AssignmentSubmissionHistoryDoc["kind"],
  doc: AssignmentSubmissionDoc,
  recordedAt: Date,
): AssignmentSubmissionHistoryDoc {
  return {
    kind,
    recordedAt,
    assignmentId: doc.assignmentId,
    clerkUserId: doc.clerkUserId,
    rosterEmail: doc.rosterEmail,
    regradeResubmission: kind === "regrade" ? true : doc.regradeResubmission,
    githubUrl: doc.githubUrl,
    vercelUrl: doc.vercelUrl,
    updatedAt: doc.updatedAt,
    staffGrade: doc.staffGrade,
    previousStaffGrade: doc.previousStaffGrade,
  };
}
