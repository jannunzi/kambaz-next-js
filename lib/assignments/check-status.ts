/**
 * Status of a check run: scored, Needs re-check (deploy could not be opened),
 * or not checked yet. Plus "Needs TA review" rows, which are not fails and
 * keep their points until staff look at them.
 */
import type { AssignmentCheckResult } from "./check-types";

export type CheckRunStatus = "scored" | "needs_recheck" | "not_checked";

export const NEEDS_RECHECK_LABEL = "Needs re-check";
export const NEEDS_REVIEW_LABEL = "Needs TA review";

export const NEEDS_RECHECK_ROW_MESSAGE =
  "Needs re-check: the deploy could not be opened, so this was not checked.";

export const NEEDS_RECHECK_SUMMARY =
  "Needs re-check. The deploy could not be opened, so nothing was scored. This is not a grade.";

export function needsReviewMessage(looksFor?: string): string {
  return looksFor
    ? `Needs TA review: no wd- id and no clear match for ${looksFor}. Not marked wrong; no points taken off.`
    : "Needs TA review: no wd- id and no reliable way to confirm this automatically. Not marked wrong; no points taken off.";
}

export function checkRunStatus(
  results: readonly AssignmentCheckResult[] | null | undefined,
): CheckRunStatus {
  if (!results || results.length === 0) return "not_checked";
  if (results.some((row) => row.needsRecheck)) return "needs_recheck";
  return "scored";
}

/** Why the deploy could not be opened (the failing open/URL row). */
export function needsRecheckReason(
  results: readonly AssignmentCheckResult[] | null | undefined,
): string | null {
  const row = results?.find((entry) => entry.needsRecheck && !entry.skipped);
  return row?.message ?? null;
}

/** Criterion ids flagged "Needs TA review", in result order, unique. */
export function needsReviewCriterionIds(
  results: readonly AssignmentCheckResult[] | null | undefined,
): string[] {
  const ids: string[] = [];
  for (const row of results ?? []) {
    if (row.needsReview && row.criterionId && !ids.includes(row.criterionId)) {
      ids.push(row.criterionId);
    }
  }
  return ids;
}
