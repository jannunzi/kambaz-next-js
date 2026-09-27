"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { canViewStaffGrader, supportsUrlSubmission } from "@/lib/assignments/access";
import { runConfiguredChecks } from "@/lib/assignments/checks";
import { fetchDeployHtml, probeGithubRepo } from "@/lib/assignments/fetch-deploy";
import type { AssignmentCheckResult } from "@/lib/assignments/check-types";
import {
  gradeViewFromStaffGrade,
  normalizeGradeRows,
  sanitizeCheckResults,
  staffGradeRecordFromRows,
  type AssignmentGradeView,
  type CriterionGradeRow,
} from "@/lib/assignments/grade-rows";
import { getAssignment, isAssignmentId, listRubricCriteria } from "@/lib/assignments/catalog";
import {
  assignmentGradeSaveAccess,
  canPersistStaffGrade,
  parseStaffStudentKey,
} from "@/lib/assignments/staff";
import { resolveNameQuery } from "@/lib/assignments/names";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";
import {
  findSubmissionForStaffStudent,
  writeAssignmentSubmission,
} from "@/lib/assignments/submissions";
import {
  toSubmissionView,
  type AssignmentSubmissionView,
} from "@/lib/assignments/submissions-store";
import type { AssignmentId } from "@/lib/assignments/types";
import { isAssignmentProgressConfigured } from "@/lib/config";
import { collectClerkEmails, normalizeEmail } from "@/lib/roster/emails";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";
import type { ReopenAction } from "@/lib/assignments/lock";
import { createAssignmentNotifier } from "@/lib/assignments/notify";
import { reopenStore } from "@/lib/assignments/reopens";
import { applyAssignmentReopen } from "@/lib/assignments/submit-lock";

export type StaffActionResult =
  | {
      ok: true;
      persisted: boolean;
      impersonation?: boolean;
      submission: AssignmentSubmissionView;
    }
  | {
      ok: false;
      code: "forbidden" | "not_configured" | "not_found" | "invalid";
      message: string;
    };

async function authorizeStaffGrader(): Promise<
  | { ok: true; persist: boolean; staffEmail?: string }
  | { ok: false; result: Extract<StaffActionResult, { ok: false }> }
> {
  if (!isAssignmentProgressConfigured()) {
    return {
      ok: false,
      result: {
        ok: false,
        code: "not_configured",
        message: ASSIGNMENT_STUDENT_COPY.notConfigured,
      },
    };
  }
  const { isAuthenticated } = await auth();
  const staff = await isActualStaff();
  const impersonating = await isImpersonatingStudent();
  if (!isAuthenticated || !canViewStaffGrader(staff, impersonating)) {
    return {
      ok: false,
      result: {
        ok: false,
        code: "forbidden",
        message: "This grading view is for course staff only.",
      },
    };
  }
  const user = await currentUser();
  return {
    ok: true,
    persist: canPersistStaffGrade(staff, impersonating),
    staffEmail: collectClerkEmails(user)[0],
  };
}

async function loadStaffTarget(input: {
  assignmentId: string;
  studentKey: string;
}) {
  if (!isAssignmentId(input.assignmentId) || !supportsUrlSubmission(input.assignmentId)) {
    return { ok: false as const, message: ASSIGNMENT_STUDENT_COPY.unknownAssignment };
  }
  const parsed = parseStaffStudentKey(input.studentKey);
  const doc = await findSubmissionForStaffStudent({
    assignmentId: input.assignmentId,
    clerkUserId: parsed.clerkUserId,
    email: parsed.email,
  });
  if (!doc) {
    return { ok: false as const, message: ASSIGNMENT_STUDENT_COPY.noSubmission };
  }
  return { ok: true as const, assignmentId: input.assignmentId as AssignmentId, doc };
}

export async function runStaffAssignmentChecks(input: {
  assignmentId: string;
  studentKey: string;
  githubUrl?: string;
  vercelUrl?: string;
}): Promise<StaffActionResult> {
  const authz = await authorizeStaffGrader();
  if (!authz.ok) return authz.result;

  let target;
  try {
    target = await loadStaffTarget(input);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load the submission.";
    return { ok: false, code: "not_found", message };
  }
  if (!target.ok) {
    return { ok: false, code: "not_found", message: target.message };
  }

  const githubUrl = (target.doc.githubUrl ?? "").trim();
  const vercelUrl = (target.doc.vercelUrl ?? "").trim();
  if (!vercelUrl) {
    return {
      ok: false,
      code: "invalid",
      message: ASSIGNMENT_STUDENT_COPY.vercelRequired,
    };
  }

  const checkResults = await runConfiguredChecks(target.assignmentId, {
    githubUrl,
    vercelUrl,
    nameQuery: resolveNameQuery({ rosterName: target.doc.name }),
    probes: {
      getHtml: fetchDeployHtml,
      probeUrl: probeGithubRepo,
    },
  });

  // On-screen only. Run never writes staffGrade or checklist progress.
  return {
    ok: true,
    persisted: false,
    impersonation: authz.persist ? undefined : true,
    submission: {
      ...toSubmissionView(target.doc),
      githubUrl,
      vercelUrl,
      checkResults,
    },
  };
}

export type GradeSaveActionResult =
  | { ok: true; grade: AssignmentGradeView }
  | {
      ok: false;
      code: "forbidden" | "unauthenticated" | "not_configured" | "not_found" | "invalid";
      message: string;
    };

export async function saveAssignmentGrade(input: {
  assignmentId: string;
  studentKey: string;
  rows: CriterionGradeRow[];
  checkResults?: AssignmentCheckResult[];
}): Promise<GradeSaveActionResult> {
  const { userId, isAuthenticated } = await auth();
  const staff = await isActualStaff();
  const impersonating = await isImpersonatingStudent();
  if (!isAuthenticated || !userId) {
    return {
      ok: false,
      code: "unauthenticated",
      message: ASSIGNMENT_STUDENT_COPY.syncProgress,
    };
  }
  const access = assignmentGradeSaveAccess({
    isAuthenticated: true,
    isActualStaff: staff,
    impersonating,
  });
  if (!access.ok) {
    return {
      ok: false,
      code: access.code,
      message:
        access.code === "unauthenticated"
          ? ASSIGNMENT_STUDENT_COPY.syncProgress
          : "Only course staff can save a grade.",
    };
  }

  if (!isAssignmentProgressConfigured()) {
    return {
      ok: false,
      code: "not_configured",
      message: ASSIGNMENT_STUDENT_COPY.notConfigured,
    };
  }

  const assignment = getAssignment(input.assignmentId);
  if (!assignment?.rubric || !isAssignmentId(input.assignmentId)) {
    return {
      ok: false,
      code: "invalid",
      message: ASSIGNMENT_STUDENT_COPY.unknownAssignment,
    };
  }

  let target;
  try {
    target = await loadStaffTarget(input);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load the submission.";
    return { ok: false, code: "not_found", message };
  }
  if (!target.ok) {
    return { ok: false, code: "not_found", message: target.message };
  }

  const vercelUrl = (target.doc.vercelUrl ?? "").trim();
  if (!vercelUrl) {
    return {
      ok: false,
      code: "invalid",
      message: ASSIGNMENT_STUDENT_COPY.vercelRequired,
    };
  }

  const rows = normalizeGradeRows(
    listRubricCriteria(assignment.rubric).map((row) => ({
      id: row.id,
      points: row.points,
    })),
    input.rows ?? [],
  );
  if (!input.rows?.length) {
    return {
      ok: false,
      code: "invalid",
      message: "Run checks before saving a grade.",
    };
  }

  const user = await currentUser();
  const gradedByEmail = collectClerkEmails(user)[0];

  const checkResults = sanitizeCheckResults(input.checkResults);
  const staffGrade = staffGradeRecordFromRows({
    rows,
    checkResults,
    comments: target.doc.staffGrade?.comments,
    gradedByEmail: gradedByEmail ? normalizeEmail(gradedByEmail) : undefined,
    gradedByClerkUserId: userId,
  });

  try {
    const doc = await writeAssignmentSubmission({
      clerkUserId: target.doc.clerkUserId,
      assignmentId: target.assignmentId,
      githubUrl: target.doc.githubUrl,
      vercelUrl,
      checkResults,
      checked: checkResults.length > 0,
      staffGrade,
    });
    const grade = gradeViewFromStaffGrade({
      studentClerkUserId: doc.clerkUserId,
      assignmentId: doc.assignmentId,
      githubUrl: doc.githubUrl,
      vercelUrl: doc.vercelUrl,
      criteria: listRubricCriteria(assignment.rubric).map((row) => ({
        id: row.id,
        points: row.points,
      })),
      staffGrade: doc.staffGrade,
      checkResults: doc.checkResults,
    });
    if (!grade) {
      return { ok: false, code: "invalid", message: "Could not save the grade." };
    }
    return { ok: true, grade };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the grade.";
    console.error("assignment grade save failed", message);
    return { ok: false, code: "invalid", message };
  }
}

export type ReopenActionResult =
  | { ok: true; closesAt: string | null; action: ReopenAction }
  | {
      ok: false;
      code: "forbidden" | "unauthenticated" | "not_configured" | "invalid";
      message: string;
    };

export async function updateAssignmentReopen(input: {
  assignmentId: string;
  studentKey: string;
  action: ReopenAction;
  message?: string;
  days?: number;
  exactDate?: string;
  exactTime?: string;
}): Promise<ReopenActionResult> {
  const { userId, isAuthenticated } = await auth();
  const staff = await isActualStaff();
  const impersonating = await isImpersonatingStudent();
  if (!isAuthenticated || !userId) {
    return {
      ok: false,
      code: "unauthenticated",
      message: ASSIGNMENT_STUDENT_COPY.syncProgress,
    };
  }
  const access = assignmentGradeSaveAccess({
    isAuthenticated: true,
    isActualStaff: staff,
    impersonating,
  });
  if (!access.ok) {
    return {
      ok: false,
      code: access.code,
      message: "Only course staff can reopen a submission.",
    };
  }
  if (!isAssignmentProgressConfigured()) {
    return {
      ok: false,
      code: "not_configured",
      message: ASSIGNMENT_STUDENT_COPY.notConfigured,
    };
  }
  if (!isAssignmentId(input.assignmentId) || !supportsUrlSubmission(input.assignmentId)) {
    return {
      ok: false,
      code: "invalid",
      message: ASSIGNMENT_STUDENT_COPY.unknownAssignment,
    };
  }
  const parsed = parseStaffStudentKey(input.studentKey);
  if (!parsed.clerkUserId && !parsed.email) {
    return { ok: false, code: "invalid", message: "Choose a student first." };
  }

  let rosterEmail = parsed.email;
  let clerkUserId = parsed.clerkUserId;
  let canvasUserId: string | undefined;
  let name: string | undefined;
  try {
    const doc = await findSubmissionForStaffStudent({
      assignmentId: input.assignmentId,
      clerkUserId: parsed.clerkUserId,
      email: parsed.email,
    });
    if (doc) {
      clerkUserId = doc.clerkUserId;
      rosterEmail = doc.rosterEmail || doc.email || rosterEmail;
      canvasUserId = doc.canvasUserId;
      name = doc.name;
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load the student.";
    return { ok: false, code: "invalid", message };
  }

  const user = await currentUser();
  const openedBy =
    collectClerkEmails(user)[0] ? normalizeEmail(collectClerkEmails(user)[0]) : userId;

  try {
    const result = await applyAssignmentReopen({
      store: await reopenStore(),
      notifier: createAssignmentNotifier(),
      assignmentId: input.assignmentId,
      action: input.action,
      message: input.message,
      days: input.days,
      exactDate: input.exactDate,
      exactTime: input.exactTime,
      openedBy,
      student: {
        clerkUserId,
        rosterEmail,
        canvasUserId,
        name,
      },
    });
    if (!result.ok) {
      return { ok: false, code: "invalid", message: result.message };
    }
    const closesAt =
      result.record.closesAt instanceof Date
        ? result.record.closesAt.toISOString()
        : new Date(result.record.closesAt).toISOString();
    return { ok: true, action: result.record.action, closesAt };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update the resubmission window.";
    console.error("assignment reopen failed", message);
    return { ok: false, code: "invalid", message };
  }
}
