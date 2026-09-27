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

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * Integer percent for stored grades. Never rounds up to 100 before full
 * credit, so 124.5 / 125 stays 99. Negatives clamp to 0. A missing or
 * non-positive total is 0.
 */
export function pointsPercent(earnedPoints: number, totalPoints: number): number {
  const total = finiteNumber(totalPoints);
  const earned = finiteNumber(earnedPoints);
  if (total == null || total <= 0 || earned == null) return 0;
  const clamped = Math.min(Math.max(0, earned), total);
  if (clamped >= total) return 100;
  const raw = (clamped / total) * 100;
  if (raw >= 99) return Math.floor(raw);
  return Math.round(raw);
}

function displayPercent(earned: number, total: number): string {
  if (earned >= total) return "100";
  const raw = (earned / total) * 100;
  if (raw >= 99) {
    const tenths = Math.floor(raw * 10) / 10;
    return Number.isInteger(tenths) ? String(tenths) : tenths.toFixed(1);
  }
  return String(Math.round(raw));
}

/**
 * Shared score text for A1, A2, and later assignments: `110 / 125 (88%)`.
 * Missing, NaN, or a zero total is an em dash — never `undefined / undefined`.
 * Negatives clamp to 0. A score above the max is flagged.
 * 124.5 / 125 is 99.6%, not 100%.
 */
export function formatPointsPercent(earnedPoints: unknown, totalPoints: unknown): string {
  const total = finiteNumber(totalPoints);
  const earned = finiteNumber(earnedPoints);
  if (total == null || total <= 0 || earned == null) return "—";
  if (earned > total) return `${earned} / ${total} (over max)`;
  const clamped = Math.max(0, earned);
  return `${clamped} / ${total} (${displayPercent(clamped, total)}%)`;
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
