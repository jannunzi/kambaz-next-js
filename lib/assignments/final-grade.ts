/**
 * The one grade that goes to Canvas, and the one percentage every screen
 * shows (student page, staff view, staff export).
 *
 * Jose's rule (Oct 7, 2026): no grade goes to Canvas until the student is
 * fully graded, including the manual items, which only staff can grade.
 * Manual points are never credited automatically. A staff grade, when one
 * is saved, replaces the auto score. A student is ready for Canvas when:
 *   - staff graded every manual item,
 *   - no item still needs TA review or a re-check (unless staff decided it),
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
import { hasStaffGradeSave, type StaffStudentRow } from "./staff";
import type { AssignmentRubric } from "./types";

/** A saved staff grade (stored record or the page's view of it). */
export type FinalGradeStaffInput = {
  earnedPoints: number;
  /** Rows saved with the grade: every criterion staff decided, with points. */
  rows?: readonly { criterionId: string; points: number }[] | null;
  /** Older saves: pass/fail flips only. */
  criterionOverrides?: CriterionPassMap | null;
};

export type FinalGradeInput = {
  assignmentId: string;
  rubric: AssignmentRubric;
  /** The stored (or live) autograder results. */
  results?: readonly AssignmentCheckResult[] | null;
  /** A saved staff grade, or null when staff haven't saved one. */
  staff?: FinalGradeStaffInput | null;
  /** Roster flags, known on staff screens and the export. */
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

/** Criterion ids staff decided, with the points they gave. */
function staffDecisions(
  rubric: AssignmentRubric,
  staff: FinalGradeStaffInput | null | undefined,
): Map<string, number> {
  const decided = new Map<string, number>();
  if (!staff) return decided;
  if (staff.rows?.length) {
    for (const row of staff.rows) decided.set(row.criterionId, row.points);
    return decided;
  }
  const points = new Map(listRubricCriteria(rubric).map((criterion) => [criterion.id, criterion.points]));
  for (const [id, passed] of Object.entries(staff.criterionOverrides ?? {})) {
    if (typeof passed === "boolean" && points.has(id)) decided.set(id, passed ? points.get(id)! : 0);
  }
  return decided;
}

export function finalGrade(input: FinalGradeInput): FinalGrade {
  const { assignmentId, rubric } = input;
  const results = input.results ?? [];
  const criteria = listRubricCriteria(rubric);
  const maxPoints = rubricPointTotal(rubric);
  const checkStatus = checkRunStatus(results);
  const scored = checkStatus === "scored";
  const latest = latestResultByCriterion(results);
  const decided = staffDecisions(rubric, input.staff);
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
  const source = input.staff ? "staff" : "auto";
  const points = input.staff
    ? input.staff.earnedPoints
    : scored
      ? autoPoints + (manualGraded ? manualPoints : 0)
      : null;

  const reasons: string[] = [];
  if (!manualGraded) {
    reasons.push(`${ungradedManual.length} manual item(s) not graded by staff yet`);
  }
  if (openItems.length) {
    if (!input.staff && checkStatus === "not_checked") reasons.push("not checked yet");
    else if (!input.staff && checkStatus === "needs_recheck") {
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
