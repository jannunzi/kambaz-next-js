import type { AssignmentCheckResult } from "./check-types";
import { latestResultByCriterion } from "./checks";
import { listRubricCriteria, rubricPointTotal } from "./catalog";
import type { AssignmentRubric } from "./types";

export type GradeBreakdown = {
  earnedPoints: number;
  totalPoints: number;
  percent: number;
  passedCount: number;
  totalCount: number;
  passedIds: string[];
};

export type CriterionPassMap = Record<string, boolean>;

/**
 * Website grades are all-or-nothing per criterion: full points if the
 * criterion is treated as passed, otherwise 0.
 */
export function computeAllOrNothingGrade(
  rubric: AssignmentRubric,
  passedCriterionIds: Iterable<string>,
): GradeBreakdown {
  const passed = new Set(
    [...passedCriterionIds].filter((id) => typeof id === "string" && id),
  );
  const criteria = listRubricCriteria(rubric);
  const passedIds: string[] = [];
  let earnedPoints = 0;
  for (const row of criteria) {
    if (passed.has(row.id)) {
      passedIds.push(row.id);
      earnedPoints += row.points;
    }
  }
  const totalPoints = rubricPointTotal(rubric);
  const percent = pointsPercent(earnedPoints, totalPoints);
  return {
    earnedPoints,
    totalPoints,
    percent,
    passedCount: passedIds.length,
    totalCount: criteria.length,
    passedIds,
  };
}

/** Whole percent. 110 / 125 is 88. A zero total is 0. */
export function pointsPercent(earnedPoints: number, totalPoints: number): number {
  if (!Number.isFinite(earnedPoints) || !Number.isFinite(totalPoints) || totalPoints <= 0) {
    return 0;
  }
  return Math.round((earnedPoints / totalPoints) * 100);
}

/** Shared score text for A1, A2, and later assignments: `110 / 125 (88%)`. */
export function formatPointsPercent(earnedPoints: number, totalPoints: number): string {
  return `${earnedPoints} / ${totalPoints} (${pointsPercent(earnedPoints, totalPoints)}%)`;
}

export function formatGradeSummary(
  grade: Pick<GradeBreakdown, "earnedPoints" | "totalPoints">,
): string {
  return formatPointsPercent(grade.earnedPoints, grade.totalPoints);
}

/** Auto-pass only. Skipped / missing results do not earn points. */
export function proposedPassedIdsFromResults(
  results: readonly AssignmentCheckResult[],
): string[] {
  const passedIds: string[] = [];
  for (const row of latestResultByCriterion(results).values()) {
    if (row.skipped || !row.passed || !row.criterionId) continue;
    passedIds.push(row.criterionId);
  }
  return passedIds.sort();
}

export function proposedGradeFromResults(
  rubric: AssignmentRubric,
  results: readonly AssignmentCheckResult[],
): GradeBreakdown {
  return computeAllOrNothingGrade(rubric, proposedPassedIdsFromResults(results));
}

/**
 * Staff overrides win when present. Otherwise use auto-pass. Manual / skipped
 * criteria stay failed unless overridden.
 */
export function effectivePassedIds(input: {
  results?: readonly AssignmentCheckResult[];
  overrides?: CriterionPassMap | null;
}): string[] {
  const auto = new Set(proposedPassedIdsFromResults(input.results ?? []));
  const overrides = input.overrides ?? {};
  const ids = new Set<string>(auto);
  for (const [criterionId, passed] of Object.entries(overrides)) {
    if (!criterionId) continue;
    if (passed) ids.add(criterionId);
    else ids.delete(criterionId);
  }
  return [...ids].sort();
}

export function gradeFromResultsAndOverrides(
  rubric: AssignmentRubric,
  results: readonly AssignmentCheckResult[] | undefined,
  overrides?: CriterionPassMap | null,
): GradeBreakdown {
  return computeAllOrNothingGrade(
    rubric,
    effectivePassedIds({ results, overrides }),
  );
}

export function autoPassedCriterionIds(
  results: readonly AssignmentCheckResult[],
): string[] {
  return proposedPassedIdsFromResults(results);
}
