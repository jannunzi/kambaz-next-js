/**
 * Staff "Re-run all and save": re-check every stored submission in batches
 * and persist the results with the checker version. Submission time, URLs,
 * and staff grades are left alone.
 */
import { checkRunStatus } from "./check-status";
import type { AssignmentCheckResult } from "./check-types";
import {
  recordAssignmentCheckRun,
  type AssignmentSubmissionDoc,
  type SubmissionStore,
} from "./submissions-store";

export const RERUN_BATCH_SIZE = 5;

export type RerunBatchResult = {
  total: number;
  /** Submissions handled so far, including this batch. */
  processed: number;
  /** Offset for the next batch, or null when every submission is done. */
  nextOffset: number | null;
  scored: number;
  needsRecheck: number;
  needsReviewItems: number;
  errors: { clerkUserId: string; message: string }[];
};

/** Stable order so batches do not skip or repeat submissions. */
export function rerunOrder(docs: readonly AssignmentSubmissionDoc[]): AssignmentSubmissionDoc[] {
  return [...docs].sort((a, b) => a.clerkUserId.localeCompare(b.clerkUserId));
}

export function clampBatch(offset: unknown, limit: unknown): { offset: number; limit: number } {
  const start = typeof offset === "number" && Number.isFinite(offset) ? Math.max(0, Math.floor(offset)) : 0;
  const size =
    typeof limit === "number" && Number.isFinite(limit)
      ? Math.min(10, Math.max(1, Math.floor(limit)))
      : RERUN_BATCH_SIZE;
  return { offset: start, limit: size };
}

export async function rerunCheckBatch(input: {
  store: SubmissionStore;
  docs: readonly AssignmentSubmissionDoc[];
  offset: number;
  limit: number;
  checkerVersion: string;
  runChecks: (doc: AssignmentSubmissionDoc) => Promise<AssignmentCheckResult[]>;
  now?: () => Date;
}): Promise<RerunBatchResult> {
  const ordered = rerunOrder(input.docs);
  const batch = ordered.slice(input.offset, input.offset + input.limit);
  const result: RerunBatchResult = {
    total: ordered.length,
    processed: Math.min(ordered.length, input.offset + batch.length),
    nextOffset: input.offset + batch.length < ordered.length ? input.offset + batch.length : null,
    scored: 0,
    needsRecheck: 0,
    needsReviewItems: 0,
    errors: [],
  };
  await Promise.all(
    batch.map(async (doc) => {
      try {
        const checkResults = await input.runChecks(doc);
        await recordAssignmentCheckRun(
          input.store,
          {
            clerkUserId: doc.clerkUserId,
            assignmentId: doc.assignmentId,
            checkResults,
            checkerVersion: input.checkerVersion,
          },
          input.now?.() ?? new Date(),
        );
        if (checkRunStatus(checkResults) === "needs_recheck") result.needsRecheck += 1;
        else result.scored += 1;
        result.needsReviewItems += checkResults.filter((row) => row.needsReview).length;
      } catch (error) {
        result.errors.push({
          clerkUserId: doc.clerkUserId,
          message: error instanceof Error ? error.message : "Check failed.",
        });
      }
    }),
  );
  return result;
}
