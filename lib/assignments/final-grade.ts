/**
 * The one grade that goes to Canvas, and the one percentage every screen
 * shows (student page, staff view, staff export).
 *
 * Jose's rule (Oct 7, 2026): no grade goes to Canvas until the student is
 * fully graded, including the manual items, which only staff can grade.
 * Manual points are never credited automatically. A staff grade, when one
 * is saved, replaces the auto score. A student is ready for Canvas when:
 *   - staff explicitly graded every manual item (an untouched row in a
 *     Save is not a grade),
 *   - no item still needs TA review or a re-check unless staff explicitly
 *     decided it,
 *   - and (when known) the submission matches one roster student with no
 *     duplicate on file.
 * Until then there is no Canvas percentage, only points "in progress".
 */
import { criterionCoverage } from "./checkers";
import { checkRunStatus, needsRecheckReason, needsReviewCriterionIds, type CheckRunStatus } from "./check-status";
import { listRubricCriteria, rubricPointTotal } from "./catalog";
import type { AssignmentCheckResult } from "./check-types";
import { latestResultByCriterion } from "./checks";
import { formatPointsPercent, pointsPercent, type CriterionPassMap } from "./grade";
import { rowIsStaffDecided, rowsFromStaffGrade, type CriterionGradeRow } from "./grade-rows";
import { hasStaffGradeSave, type StaffStudentRow } from "./staff";
import { NOT_GRADED_YET } from "./submission-status";
import type { AssignmentRubric } from "./types";

/** One saved staff row (stored record or the page's normalized view of it). */
export type FinalGradeStaffRow = {
  criterionId: string;
  points: number;
  autoPassed?: boolean;
  overridePassed?: boolean;
  maxPoints?: number;
  /** True only when staff explicitly set the row (see grade-rows.ts). */
  decided?: boolean;
};

/** A saved staff grade (stored record or the page's view of it). */
export type FinalGradeStaffInput = {
  /**
   * Stored total. Not used for the grade: finalGrade recomputes the points
   * from the rows so the student page, staff view and export always agree.
   */
  earnedPoints?: number;
  /** Rows saved with the grade. Only rows staff explicitly set count as decided. */
  rows?: readonly FinalGradeStaffRow[] | null;
  /** Older saves: pass/fail flips only. Each flip is a staff decision. */
  criterionOverrides?: CriterionPassMap | null;
  /** The check run this grade was decided against (stored with the grade). */
  checkResults?: readonly AssignmentCheckResult[] | null;
};

export type FinalGradeInput = {
  assignmentId: string;
  rubric: AssignmentRubric;
  /**
   * The stored check results. With a staff grade, the results saved with
   * that grade win (falling back to these), so every screen judges the
   * grade against the same run.
   */
  results?: readonly AssignmentCheckResult[] | null;
  /** A saved staff grade, or null when staff haven't saved one. */
  staff?: FinalGradeStaffInput | null;
  /** Roster flags: one roster student, no duplicate on file. */
  roster?: { unmatched?: boolean; duplicates?: number };
};

export type FinalGrade = {
  checkStatus: CheckRunStatus;
  /** Auto points (pass + TA-review rows), when the check scored. */
  autoPoints: number | null;
  autoMax: number;
  manualMax: number;
  /** Staff-entered manual points; null until staff graded every manual item. */
  manualPoints: number | null;
  /** Manual items staff haven't graded yet. */
  ungradedManual: string[];
  /** "staff" when a saved staff grade sets the score. */
  source: "staff" | "auto";
  /** Current points (staff grade, else auto + staff manual points). */
  points: number | null;
  maxPoints: number;
  /** Items still flagged (TA review, re-check, not checked) with no staff decision. */
  openItems: string[];
  ready: boolean;
  /** Why the grade isn't ready (empty when ready). */
  reasons: string[];
  /** points / maxPoints to one decimal, only when ready. */
  canvasPercent: number | null;
  /** `120 / 125 (96.0%)` when ready, else "". */
  canvasScore: string;
};

/**
 * The staff rows as every screen sees them: stored rows normalized (an
 * untouched row is undecided), or an older override-only save turned into
 * rows on top of its check run (only the flips are decided).
 */
export function staffGradeRows(
  rubric: AssignmentRubric,
  staff: FinalGradeStaffInput,
  results: readonly AssignmentCheckResult[],
): CriterionGradeRow[] {
  const criteria = listRubricCriteria(rubric).map((criterion) => ({
    id: criterion.id,
    points: criterion.points,
  }));
  return rowsFromStaffGrade(
    criteria,
    {
      rows: staff.rows?.length
        ? staff.rows.map((row) => ({
            ...row,
            autoPassed: Boolean(row.autoPassed),
            overridePassed: Boolean(row.overridePassed),
          }))
        : null,
      criterionOverrides: staff.criterionOverrides ?? null,
      checkResults: results,
    },
    results,
  );
}

/** Rows that need an explicit staff decision before the grade can be final. */
export function rowsNeedingStaffDecision(
  assignmentId: string,
  rubric: AssignmentRubric,
  results: readonly AssignmentCheckResult[],
): Set<string> {
  const scored = checkRunStatus(results) === "scored";
  const latest = latestResultByCriterion(results);
  const review = new Set(needsReviewCriterionIds(results));
  const ids = new Set<string>();
  for (const criterion of listRubricCriteria(rubric)) {
    if (criterionCoverage(assignmentId, criterion.id) === "manual") {
      ids.add(criterion.id);
      continue;
    }
    const result = latest.get(criterion.id);
    if (!scored || !result || result.skipped || result.needsRecheck || review.has(criterion.id)) {
      ids.add(criterion.id);
    }
  }
  return ids;
}

export function finalGrade(input: FinalGradeInput): FinalGrade {
  const { assignmentId, rubric } = input;
  const staff = input.staff ?? null;
  // A staff grade is judged against the run it was saved with.
  const results = (staff ? staff.checkResults ?? input.results : input.results) ?? [];
  const criteria = listRubricCriteria(rubric);
  const maxPoints = rubricPointTotal(rubric);
  const checkStatus = checkRunStatus(results);
  const scored = checkStatus === "scored";
  const latest = latestResultByCriterion(results);
  const staffRows = staff ? staffGradeRows(rubric, staff, results) : [];
  // Only rows staff explicitly set are decisions. An untouched row (manual,
  // TA review or re-check) stays open even after a Save.
  const decided = new Map<string, number>();
  for (const row of staffRows) {
    if (rowIsStaffDecided(row)) decided.set(row.criterionId, row.points);
  }
  const review = new Set(needsReviewCriterionIds(results));

  let autoPoints = 0;
  let autoMax = 0;
  let manualMax = 0;
  let manualPoints = 0;
  const ungradedManual: string[] = [];
  const openItems: string[] = [];
  for (const criterion of criteria) {
    if (criterionCoverage(assignmentId, criterion.id) === "manual") {
      manualMax += criterion.points;
      if (decided.has(criterion.id)) manualPoints += decided.get(criterion.id)!;
      else ungradedManual.push(criterion.id);
      continue;
    }
    autoMax += criterion.points;
    const result = latest.get(criterion.id);
    const open =
      !scored || !result || result.skipped || result.needsRecheck || review.has(criterion.id);
    if (open && !decided.has(criterion.id)) openItems.push(criterion.id);
    if (scored && result && !result.skipped && result.passed) autoPoints += criterion.points;
  }

  const manualGraded = ungradedManual.length === 0;
  const source = staff ? "staff" : "auto";
  const points = staff
    ? staffRows.reduce((sum, row) => sum + row.points, 0)
    : scored
      ? autoPoints + (manualGraded ? manualPoints : 0)
      : null;

  const reasons: string[] = [];
  if (!manualGraded) {
    reasons.push(`${ungradedManual.length} manual item(s) not graded by staff yet`);
  }
  if (openItems.length) {
    if (checkStatus === "not_checked") reasons.push("not checked yet");
    else if (checkStatus === "needs_recheck") {
      reasons.push(`needs re-check: ${needsRecheckReason(results) ?? "the deploy couldn't be opened"}`);
    } else {
      const reviewOpen = openItems.filter((id) => review.has(id)).length;
      if (reviewOpen) reasons.push(`${reviewOpen} item(s) need TA review`);
      if (openItems.length > reviewOpen) {
        reasons.push(`${openItems.length - reviewOpen} item(s) not checked or need a re-check`);
      }
    }
  }
  if (input.roster?.duplicates) {
    reasons.push(`duplicate submission (${input.roster.duplicates + 1} on file)`);
  }
  if (input.roster?.unmatched) reasons.push("submission does not match a roster student");

  const ready = reasons.length === 0 && points != null;
  const canvasPercent = ready ? pointsPercent(points, maxPoints) : null;
  return {
    checkStatus,
    autoPoints: scored ? autoPoints : null,
    autoMax,
    manualMax,
    manualPoints: manualGraded ? manualPoints : null,
    ungradedManual,
    source,
    points,
    maxPoints,
    openItems,
    ready,
    reasons,
    canvasPercent,
    canvasScore: ready ? formatPointsPercent(points, maxPoints) : "",
  };
}

/** Student banner line: a percentage only when the grade is final. */
export function finalGradeLine(grade: FinalGrade | null, hasStaffGrade: boolean): string {
  if (grade?.ready) return `Graded: ${grade.canvasScore}`;
  if (hasStaffGrade) return "Grading in progress";
  return NOT_GRADED_YET;
}

/** Student/staff header text for a grade that isn't ready: points, no percent. */
export function gradingInProgressText(grade: FinalGrade): string {
  if (grade.source === "staff" && grade.points != null) {
    return `${grade.points} / ${grade.maxPoints} points so far · grading in progress`;
  }
  if (grade.autoPoints != null) {
    return `Auto checks ${grade.autoPoints} / ${grade.autoMax} points · grading in progress`;
  }
  return "Grading in progress";
}

/** The final grade for one staff-queue row (staff grade, check, roster flags). */
export function finalGradeForStaffRow(
  assignmentId: string,
  rubric: AssignmentRubric,
  row: StaffStudentRow,
): FinalGrade {
  const staff = row.staffGrade && hasStaffGradeSave(row.staffGrade) ? row.staffGrade : null;
  return finalGrade({
    assignmentId,
    rubric,
    results: row.checkResults ?? [],
    staff,
    roster: { unmatched: row.unmatched, duplicates: row.priorSubmissions?.length ?? 0 },
  });
}
