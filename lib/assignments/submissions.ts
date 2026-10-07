import "server-only";

import { normalizeEmail } from "../roster/emails";
import { getCollection } from "../mongo";
import { selectRosterSubmission } from "./staff";
import type { AssignmentId } from "./types";
import {
  ASSIGNMENT_SUBMISSIONS_COLLECTION,
  listAssignmentSubmissions,
  loadAssignmentSubmission,
  recordStaffGrade,
  upsertAssignmentSubmission,
  type AssignmentStaffGrade,
  type AssignmentSubmissionDoc,
  type AssignmentSubmissionIdentity,
  type SubmissionStore,
} from "./submissions-store";

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
    async setCheckRun(clerkUserId, assignmentId, fields) {
      // Only the check fields: a concurrent staff Save keeps its grade.
      const result = await collection.updateOne(
        { clerkUserId, assignmentId },
        {
          $set: {
            checkResults: fields.checkResults,
            lastCheckedAt: fields.lastCheckedAt,
            checkerVersion: fields.checkerVersion,
          },
        },
      );
      return result.matchedCount > 0;
    },
    async setStaffGrade(clerkUserId, assignmentId, fields) {
      // Only the grade (and the run it was decided on): never updatedAt,
      // so a staff Save doesn't change the student's submission time.
      const set: Partial<AssignmentSubmissionDoc> = { staffGrade: fields.staffGrade };
      if (fields.checkResults) set.checkResults = fields.checkResults;
      if (fields.lastCheckedAt) set.lastCheckedAt = fields.lastCheckedAt;
      const result = await collection.updateOne({ clerkUserId, assignmentId }, { $set: set });
      return result.matchedCount > 0;
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

/** Indexed submission store for server actions that batch their own writes. */
export async function assignmentSubmissionStore(): Promise<SubmissionStore> {
  return readyStore();
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
  checkerVersion?: string;
  identity?: AssignmentSubmissionIdentity;
  staffGrade?: AssignmentStaffGrade | null;
}): Promise<AssignmentSubmissionDoc> {
  const store = await readyStore();
  return upsertAssignmentSubmission(store, input);
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

/**
 * Staff Save: store the grade without touching the submission time or URLs
 * (see recordStaffGrade). Returns null when the submission is gone.
 */
export async function writeStaffGrade(input: {
  clerkUserId: string;
  assignmentId: AssignmentId;
  staffGrade: AssignmentStaffGrade;
  checkResults?: AssignmentSubmissionDoc["checkResults"];
  seenSubmittedAt?: string | null;
}): Promise<AssignmentSubmissionDoc | null> {
  const store = await readyStore();
  return recordStaffGrade(store, input);
}
