import "server-only";

import { getCollection } from "../mongo";
import type { AssignmentReopenRecord } from "./lock";
import type { ReopenStore } from "./submit-lock";

export const ASSIGNMENT_REOPENS_COLLECTION = "assignment_reopens";

export async function getAssignmentReopensCollection() {
  return getCollection<AssignmentReopenRecord>(ASSIGNMENT_REOPENS_COLLECTION);
}

export function mongoReopenStore(
  collection: Awaited<ReturnType<typeof getAssignmentReopensCollection>>,
): ReopenStore {
  return {
    async list(assignmentId) {
      return collection.find({ assignmentId }).toArray();
    },
    async insert(record) {
      await collection.insertOne(record);
    },
  };
}

let reopenIndexesPromise: Promise<void> | null = null;

export async function ensureAssignmentReopenIndexes(): Promise<void> {
  const collection = await getAssignmentReopensCollection();
  await collection.createIndex({ assignmentId: 1, openedAt: -1 });
  await collection.createIndex({ assignmentId: 1, rosterEmail: 1 });
  await collection.createIndex({ assignmentId: 1, clerkUserId: 1 });
}

export async function reopenStore(): Promise<ReopenStore> {
  const collection = await getAssignmentReopensCollection();
  reopenIndexesPromise ??= ensureAssignmentReopenIndexes().catch((error) => {
    reopenIndexesPromise = null;
    console.error("assignment reopen index ensure failed", error);
  });
  await reopenIndexesPromise;
  return mongoReopenStore(collection);
}

export async function listAssignmentReopens(
  assignmentId: string,
): Promise<AssignmentReopenRecord[]> {
  const store = await reopenStore();
  return store.list(assignmentId);
}
