import "server-only";

import { normalizeEmail } from "../roster/emails";
import { getCollection } from "../mongo";
import { selectRosterSubmission } from "./staff";
import {
  commitAssignmentSubmission,
  type CommitSubmissionResult,
} from "./submit-lock";
import type { AssignmentId } from "./types";
import {
  ASSIGNMENT_SUBMISSIONS_COLLECTION,
  listAssignmentSubmissions,
  loadAssignmentSubmission,
  upsertAssignmentSubmission,
  type AssignmentStaffGrade,
  type AssignmentSubmissionDoc,
  type AssignmentSubmissionHistoryDoc,
  type AssignmentSubmissionIdentity,
  type SubmissionHistoryStore,
  type SubmissionStore,
} from "./submissions-store";

export const ASSIGNMENT_SUBMISSION_HISTORY_COLLECTION =
  "assignment_submission_history";

export type { AssignmentStaffGrade, AssignmentSubmissionDoc, SubmissionStore };

export async function getAssignmentSubmissionsCollection() {
  return getCollection<AssignmentSubmissionDoc>(
    ASSIGNMENT_SUBMISSIONS_COLLECTION,
  );
}

export function mongoSubmissionStore(
  collection: Awaited<ReturnType<typeof getAssignmentSubmissionsCollection>>,
): SubmissionStore {
  return {
    async find(clerkUserId, assignmentId) {
      return collection.findOne({ clerkUserId, assignmentId });
    },
    async upsert(doc) {
      await collection.updateOne(
        { clerkUserId: doc.clerkUserId, assignmentId: doc.assignmentId },
        { $set: doc },
        { upsert: true },
      );
    },
    async listByAssignment(assignmentId) {
      return collection.find({ assignmentId }).toArray();
    },
  };
}

let submissionIndexesPromise: Promise<void> | null = null;

export async function ensureAssignmentSubmissionIndexes(): Promise<void> {
  const collection = await getAssignmentSubmissionsCollection();
  await collection.createIndex(
    { clerkUserId: 1, assignmentId: 1 },
    { unique: true },
  );
  await collection.createIndex({ assignmentId: 1, rosterEmail: 1 });
}

async function readyStore(): Promise<SubmissionStore> {
  const collection = await getAssignmentSubmissionsCollection();
  submissionIndexesPromise ??= ensureAssignmentSubmissionIndexes().catch(
    (error) => {
      submissionIndexesPromise = null;
      console.error("assignment submission index ensure failed", error);
    },
  );
  await submissionIndexesPromise;
  return mongoSubmissionStore(collection);
}

export async function readAssignmentSubmission(
  clerkUserId: string,
  assignmentId: AssignmentId,
): Promise<AssignmentSubmissionDoc | null> {
  const collection = await getAssignmentSubmissionsCollection();
  return loadAssignmentSubmission(
    mongoSubmissionStore(collection),
    clerkUserId,
    assignmentId,
  );
}

export async function listSubmissionsForAssignment(
  assignmentId: AssignmentId,
): Promise<AssignmentSubmissionDoc[]> {
  const store = await readyStore();
  return listAssignmentSubmissions(store, assignmentId);
}

export async function writeAssignmentSubmission(input: {
  clerkUserId: string;
  assignmentId: AssignmentId;
  githubUrl: string;
  vercelUrl: string;
  checkResults?: AssignmentSubmissionDoc["checkResults"];
  checked?: boolean;
  identity?: AssignmentSubmissionIdentity;
  staffGrade?: AssignmentStaffGrade | null;
}): Promise<AssignmentSubmissionDoc> {
  const store = await readyStore();
  return upsertAssignmentSubmission(store, input);
}

export async function getAssignmentSubmissionHistoryCollection() {
  return getCollection<AssignmentSubmissionHistoryDoc>(
    ASSIGNMENT_SUBMISSION_HISTORY_COLLECTION,
  );
}

export function mongoSubmissionHistoryStore(
  collection: Awaited<ReturnType<typeof getAssignmentSubmissionHistoryCollection>>,
): SubmissionHistoryStore {
  return {
    async insert(doc) {
      await collection.insertOne(doc);
    },
  };
}

let historyIndexesPromise: Promise<void> | null = null;

export async function ensureAssignmentSubmissionHistoryIndexes(): Promise<void> {
  const collection = await getAssignmentSubmissionHistoryCollection();
  await collection.createIndex({ assignmentId: 1, rosterEmail: 1 });
  await collection.createIndex({ assignmentId: 1, clerkUserId: 1, recordedAt: -1 });
}

export async function submissionHistoryStore(): Promise<SubmissionHistoryStore> {
  const collection = await getAssignmentSubmissionHistoryCollection();
  historyIndexesPromise ??= ensureAssignmentSubmissionHistoryIndexes().catch(
    (error) => {
      historyIndexesPromise = null;
      console.error("assignment submission history index ensure failed", error);
    },
  );
  await historyIndexesPromise;
  return mongoSubmissionHistoryStore(collection);
}

export async function commitStoredAssignmentSubmission(
  input: Omit<Parameters<typeof commitAssignmentSubmission>[0], "store" | "history">,
): Promise<CommitSubmissionResult> {
  const store = await readyStore();
  const history = await submissionHistoryStore();
  return commitAssignmentSubmission({ ...input, store, history });
}

export async function findSubmissionForStaffStudent(input: {
  assignmentId: AssignmentId;
  clerkUserId?: string;
  email?: string;
}): Promise<AssignmentSubmissionDoc | null> {
  if (input.clerkUserId) {
    return readAssignmentSubmission(input.clerkUserId, input.assignmentId);
  }
  if (!input.email) return null;
  const submissions = await listSubmissionsForAssignment(input.assignmentId);
  return (
    selectRosterSubmission(
      { email: normalizeEmail(input.email) },
      submissions,
    ) ?? null
  );
}
