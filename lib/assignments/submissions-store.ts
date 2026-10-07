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
  /**
   * The student's submission time (`updatedAt`) staff were grading when
   * they saved. A later submission means the grade is out of date.
   * Missing on saves made before Oct 7, 2026.
   */
  gradedSubmissionAt?: Date | string;
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

export type AssignmentSubmissionDoc = AssignmentSubmissionIdentity & {
  clerkUserId: string;
  assignmentId: AssignmentId;
  githubUrl: string;
  vercelUrl: string;
  createdAt: Date;
  updatedAt: Date;
  lastCheckedAt?: Date;
  checkResults?: AssignmentCheckResult[];
  /** Checker rules version (and deploy commit) that produced checkResults. */
  checkerVersion?: string;
  staffGrade?: AssignmentStaffGrade;
};

export type AssignmentSubmissionView = AssignmentSubmissionIdentity & {
  githubUrl: string;
  vercelUrl: string;
  updatedAt: string;
  lastCheckedAt?: string;
  checkResults?: AssignmentCheckResult[];
  checkerVersion?: string;
  staffGrade?: AssignmentStaffGrade;
};

export type SubmissionStore = {
  find(
    clerkUserId: string,
    assignmentId: AssignmentId,
  ): Promise<AssignmentSubmissionDoc | null>;
  upsert(doc: AssignmentSubmissionDoc): Promise<void>;
  /**
   * Write only the check-run fields of an existing submission ($set on
   * checkResults, lastCheckedAt, checkerVersion). Never touches the staff
   * grade, comments, URLs, or submission time, so a staff Save landing at
   * the same moment is not overwritten. Returns false when no doc matched.
   */
  setCheckRun?(
    clerkUserId: string,
    assignmentId: AssignmentId,
    fields: Pick<AssignmentSubmissionDoc, "checkResults" | "lastCheckedAt" | "checkerVersion">,
  ): Promise<boolean>;
  /**
   * Write only the staff-grade fields of an existing submission ($set on
   * staffGrade, plus checkResults / lastCheckedAt when given). Never touches
   * the submission time (`updatedAt`), URLs or identity, so a staff Save
   * can't make a submission look new, and a student resubmitting at the
   * same moment isn't overwritten. Returns false when no doc matched.
   */
  setStaffGrade?(
    clerkUserId: string,
    assignmentId: AssignmentId,
    fields: Pick<AssignmentSubmissionDoc, "staffGrade"> &
      Partial<Pick<AssignmentSubmissionDoc, "checkResults" | "lastCheckedAt">>,
  ): Promise<boolean>;
  listByAssignment?(
    assignmentId: AssignmentId,
  ): Promise<AssignmentSubmissionDoc[]>;
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
    ...(grade.gradedSubmissionAt ? { gradedSubmissionAt: toIso(grade.gradedSubmissionAt) } : {}),
  };
}

export function toSubmissionView(
  doc: AssignmentSubmissionDoc,
): AssignmentSubmissionView {
  return {
    githubUrl: doc.githubUrl,
    vercelUrl: doc.vercelUrl,
    updatedAt: toIso(doc.updatedAt),
    lastCheckedAt: doc.lastCheckedAt ? toIso(doc.lastCheckedAt) : undefined,
    checkResults: doc.checkResults,
    checkerVersion: doc.checkerVersion,
    email: doc.email,
    rosterEmail: doc.rosterEmail,
    name: doc.name,
    canvasUserId: doc.canvasUserId,
    section: doc.section,
    staffGrade: toStaffGradeView(doc.staffGrade),
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
    checkerVersion?: string;
    identity?: AssignmentSubmissionIdentity;
    staffGrade?: AssignmentStaffGrade | null;
    /**
     * Keep `updatedAt` (the submission time). Re-checking a submission is
     * not a new submission.
     */
    preserveUpdatedAt?: boolean;
  },
  now: Date = new Date(),
): Promise<AssignmentSubmissionDoc> {
  const existing = await store.find(input.clerkUserId, input.assignmentId);
  const identity = input.identity ?? {};
  const staffGrade =
    input.staffGrade === null
      ? undefined
      : (input.staffGrade ?? existing?.staffGrade);
  const doc: AssignmentSubmissionDoc = {
    clerkUserId: input.clerkUserId,
    assignmentId: input.assignmentId,
    githubUrl: input.githubUrl,
    vercelUrl: input.vercelUrl,
    createdAt: existing?.createdAt ?? now,
    updatedAt: input.preserveUpdatedAt && existing ? existing.updatedAt : now,
    lastCheckedAt: input.checked ? now : existing?.lastCheckedAt,
    checkResults: input.checkResults ?? existing?.checkResults,
    checkerVersion: input.checkResults
      ? (input.checkerVersion ?? existing?.checkerVersion)
      : existing?.checkerVersion,
    email: identity.email ?? existing?.email,
    rosterEmail: identity.rosterEmail ?? existing?.rosterEmail,
    name: identity.name ?? existing?.name,
    canvasUserId: identity.canvasUserId ?? existing?.canvasUserId,
    section: identity.section ?? existing?.section,
    staffGrade,
  };
  await store.upsert(doc);
  return doc;
}

/**
 * Store a fresh check run on an existing submission without touching the
 * submitted URLs, the submission time, or any staff grade. Stores that
 * support it write only the check fields ($set), so a staff Save in flight
 * cannot be overwritten by the re-run.
 */
export async function recordAssignmentCheckRun(
  store: SubmissionStore,
  input: {
    clerkUserId: string;
    assignmentId: AssignmentId;
    checkResults: AssignmentCheckResult[];
    checkerVersion: string;
  },
  now: Date = new Date(),
): Promise<AssignmentSubmissionDoc | null> {
  if (store.setCheckRun) {
    const matched = await store.setCheckRun(input.clerkUserId, input.assignmentId, {
      checkResults: input.checkResults,
      lastCheckedAt: now,
      checkerVersion: input.checkerVersion,
    });
    return matched ? store.find(input.clerkUserId, input.assignmentId) : null;
  }
  const existing = await store.find(input.clerkUserId, input.assignmentId);
  if (!existing) return null;
  return upsertAssignmentSubmission(
    store,
    {
      clerkUserId: existing.clerkUserId,
      assignmentId: existing.assignmentId,
      githubUrl: existing.githubUrl,
      vercelUrl: existing.vercelUrl,
      checkResults: input.checkResults,
      checked: true,
      checkerVersion: input.checkerVersion,
      preserveUpdatedAt: true,
    },
    now,
  );
}

function validTime(value: Date | string | undefined | null): number | null {
  if (!value) return null;
  const ms = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(ms) && ms > 0 ? ms : null;
}

/**
 * Store a staff grade on an existing submission. The submission time
 * (`updatedAt`), URLs and identity are never changed: a staff Save is not a
 * submission. The grade records `gradedSubmissionAt`, the submission time
 * staff were grading (`seenSubmittedAt` from the page, never later than the
 * stored one), so a resubmission that lands while staff grade still shows
 * as "resubmitted after grading".
 *
 * Check results are written to the submission only when the Save carries
 * some (an empty run never clears the stored check).
 */
export async function recordStaffGrade(
  store: SubmissionStore,
  input: {
    clerkUserId: string;
    assignmentId: AssignmentId;
    staffGrade: AssignmentStaffGrade;
    checkResults?: AssignmentCheckResult[];
    /** The submission time on the grader's screen (ISO), if known. */
    seenSubmittedAt?: string | Date | null;
  },
  now: Date = new Date(),
): Promise<AssignmentSubmissionDoc | null> {
  const existing = await store.find(input.clerkUserId, input.assignmentId);
  if (!existing) return null;
  const stored = validTime(existing.updatedAt) ?? validTime(existing.createdAt);
  const seen = validTime(input.seenSubmittedAt);
  const basis = seen != null && stored != null ? Math.min(seen, stored) : (stored ?? seen);
  const staffGrade: AssignmentStaffGrade = {
    ...input.staffGrade,
    ...(basis != null ? { gradedSubmissionAt: new Date(basis) } : {}),
  };
  const checked = Boolean(input.checkResults?.length);
  if (store.setStaffGrade) {
    const matched = await store.setStaffGrade(input.clerkUserId, input.assignmentId, {
      staffGrade,
      ...(checked ? { checkResults: input.checkResults, lastCheckedAt: now } : {}),
    });
    return matched ? store.find(input.clerkUserId, input.assignmentId) : null;
  }
  return upsertAssignmentSubmission(
    store,
    {
      clerkUserId: existing.clerkUserId,
      assignmentId: existing.assignmentId,
      githubUrl: existing.githubUrl,
      vercelUrl: existing.vercelUrl,
      ...(checked ? { checkResults: input.checkResults, checked: true } : {}),
      staffGrade,
      preserveUpdatedAt: true,
    },
    now,
  );
}
