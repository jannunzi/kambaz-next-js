import { normalizeEmail } from "../roster/emails";
import {
  planReopenChange,
  reopensForStudent,
  type AssignmentReopenRecord,
  type ReopenAction,
  evaluateSubmissionLock,
} from "./lock";
import {
  publishAssignmentReopenEvent,
  type AssignmentNotifier,
  type AssignmentReopenEvent,
} from "./notify";
import {
  submissionHistoryFromDoc,
  upsertAssignmentSubmission,
  type AssignmentSubmissionDoc,
  type AssignmentSubmissionHistoryDoc,
  type AssignmentSubmissionIdentity,
  type SubmissionHistoryStore,
  type SubmissionStore,
} from "./submissions-store";
import type { AssignmentId } from "./types";

export type ReopenStore = {
  list(assignmentId: string): Promise<AssignmentReopenRecord[]>;
  insert(record: AssignmentReopenRecord): Promise<void>;
};

export type CommitSubmissionResult =
  | { ok: true; doc: AssignmentSubmissionDoc; regrade: boolean }
  | { ok: false; code: "submissions_closed"; message: string };

/**
 * Submit API used by the server action. Before the due instant this writes
 * through the ordinary upsert and does not read or write reopen history.
 * After the due instant it rejects, unless a matching reopen window is still
 * open. A resubmit in that window is stored as a new regrade submission.
 */
export async function commitAssignmentSubmission(input: {
  now?: Date;
  dueAt: Date | null;
  reopens?: readonly AssignmentReopenRecord[];
  student: {
    clerkUserId: string;
    rosterEmail?: string | null;
    canvasUserId?: string | null;
    email?: string | null;
  };
  prior?: AssignmentSubmissionDoc | null;
  store: SubmissionStore;
  history: SubmissionHistoryStore;
  assignmentId: AssignmentId;
  githubUrl: string;
  vercelUrl: string;
  identity?: AssignmentSubmissionIdentity;
}): Promise<CommitSubmissionResult> {
  const now = input.now ?? new Date();
  const decision = evaluateSubmissionLock({
    now,
    dueAt: input.dueAt,
    reopens: input.reopens ?? [],
    student: {
      email: input.student.rosterEmail ?? input.student.email,
      clerkUserId: input.student.clerkUserId,
      canvasUserId: input.student.canvasUserId,
    },
    hasSubmission: Boolean(input.prior),
  });
  if (!decision.allowed) {
    return { ok: false, code: decision.code, message: decision.message };
  }

  if (decision.path === "regrade" && input.prior) {
    await input.history.insert(
      submissionHistoryFromDoc("prior", input.prior, now),
    );
    const doc = await upsertAssignmentSubmission(
      input.store,
      {
        clerkUserId: input.student.clerkUserId,
        assignmentId: input.assignmentId,
        githubUrl: input.githubUrl,
        vercelUrl: input.vercelUrl,
        identity: input.identity,
        regradeFrom: input.prior,
      },
      now,
    );
    await input.history.insert(submissionHistoryFromDoc("regrade", doc, now));
    return { ok: true, doc, regrade: true };
  }

  const doc = await upsertAssignmentSubmission(
    input.store,
    {
      clerkUserId: input.student.clerkUserId,
      assignmentId: input.assignmentId,
      githubUrl: input.githubUrl,
      vercelUrl: input.vercelUrl,
      identity: input.identity,
    },
    now,
  );
  return { ok: true, doc, regrade: false };
}

export function reopenEventFromRecord(
  record: AssignmentReopenRecord,
  studentName?: string,
): AssignmentReopenEvent {
  const closesAt = record.closesAt instanceof Date
    ? record.closesAt.toISOString()
    : new Date(record.closesAt).toISOString();
  const openedAt = record.openedAt instanceof Date
    ? record.openedAt.toISOString()
    : new Date(record.openedAt).toISOString();
  return {
    type: "assignment.reopen",
    action: record.action,
    assignmentId: record.assignmentId,
    rosterEmail: record.rosterEmail,
    clerkUserId: record.clerkUserId,
    canvasUserId: record.canvasUserId,
    studentName,
    message: record.message,
    closesAt: Number.isNaN(new Date(closesAt).getTime()) ? null : closesAt,
    openedAt,
    openedBy: record.openedBy,
  };
}

export async function applyAssignmentReopen(input: {
  store: ReopenStore;
  notifier: AssignmentNotifier;
  now?: Date;
  assignmentId: string;
  action: ReopenAction;
  message?: string | null;
  days?: number | null;
  exactDate?: string | null;
  exactTime?: string | null;
  openedBy: string;
  student: {
    clerkUserId?: string;
    rosterEmail?: string;
    canvasUserId?: string;
    name?: string;
  };
}): Promise<
  | { ok: true; record: AssignmentReopenRecord; event: AssignmentReopenEvent }
  | { ok: false; message: string }
> {
  const now = input.now ?? new Date();
  const listed = await input.store.list(input.assignmentId);
  const planned = planReopenChange({
    now,
    action: input.action,
    message: input.message,
    days: input.days,
    exactDate: input.exactDate,
    exactTime: input.exactTime,
    history: reopensForStudent(listed, {
      email: input.student.rosterEmail,
      clerkUserId: input.student.clerkUserId,
      canvasUserId: input.student.canvasUserId,
    }),
  });
  if (!planned.ok) return planned;

  const rosterEmail = input.student.rosterEmail
    ? normalizeEmail(input.student.rosterEmail)
    : undefined;
  const record: AssignmentReopenRecord = {
    assignmentId: input.assignmentId,
    clerkUserId: input.student.clerkUserId?.trim() || undefined,
    rosterEmail: rosterEmail || undefined,
    canvasUserId: input.student.canvasUserId?.trim() || undefined,
    openedBy: input.openedBy,
    action: planned.record.action,
    message: planned.record.message,
    openedAt: planned.record.openedAt,
    closesAt: planned.record.closesAt,
    closedAt: planned.record.closedAt,
  };
  await input.store.insert(record);
  const event = reopenEventFromRecord(record, input.student.name);
  await publishAssignmentReopenEvent(event, input.notifier);
  return { ok: true, record, event };
}

export type { AssignmentSubmissionHistoryDoc };
