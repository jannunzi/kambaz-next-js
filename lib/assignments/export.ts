/**
 * Staff export for loading assignment scores into Canvas.
 *
 * One row per submission (roster students with a submission, plus unmatched
 * submissions). The score comes from `finalGrade` (final-grade.ts), the same
 * function the student page and staff view use, so every screen agrees.
 *
 * Nothing goes to Canvas until the student is fully graded:
 *   - `ready_for_canvas` is "yes" only when staff graded every manual item,
 *     no item still needs TA review or a re-check, and the submission
 *     matches one roster student with no duplicate. `ready_reason` says why
 *     not. `canvas_percent` (points / max, one decimal) is filled only when
 *     ready.
 *   - Manual points are never credited automatically: `manual_points` is the
 *     staff-entered value, blank until staff graded every manual item.
 *   - A saved staff grade replaces the auto score.
 *
 * `confidence`:
 *   - full_marks: ready, every point earned; load as is.
 *   - confident_deduction: ready, some points lost; load with feedback.
 *   - needs_review: not ready (see ready_reason).
 */
import { criterionCoverage } from "./checkers";
import { latestResultByCriterion } from "./checks";
import { needsReviewCriterionIds, type CheckRunStatus } from "./check-status";
import { COURSE_SITE_ORIGIN, listRubricCriteria } from "./catalog";
import type { AssignmentCheckResult } from "./check-types";
import { finalGradeForStaffRow } from "./final-grade";
import { hasStaffGradeSave, type StaffStudentRow } from "./staff";
import type { AssignmentRubric, RubricCriterion } from "./types";

export type ExportConfidence = "full_marks" | "confident_deduction" | "needs_review";

export type ItemOutcome = "pass" | "fail" | "review" | "recheck" | "manual" | "not_checked";

export type SubmissionExportRow = {
  name: string;
  email: string;
  section: string;
  canvasUserId: string;
  clerkUserId: string;
  githubUrl: string;
  submittedUrl: string;
  submittedAt: string;
  lastCheckedAt: string;
  checkerVersion: string;
  checkStatus: CheckRunStatus;
  autoPoints: number | null;
  autoMax: number;
  /** Staff-entered manual points; null until staff graded every manual item. */
  manualPoints: number | null;
  manualMax: number;
  /** Current points: the staff grade when saved, else auto (+ staff manual). */
  points: number | null;
  maxPoints: number;
  /** "120 / 125 (96.0%)" when ready; "113 / 125 (grading in progress)" before. */
  score: string;
  readyForCanvas: boolean;
  /** Why the row isn't ready, or "fully graded". */
  readyReason: string;
  /** points / max to one decimal, only when ready. */
  canvasPercent: number | null;
  /** "staff" when a saved staff grade sets the score. */
  scoreSource: "staff" | "auto";
  confidence: ExportConfidence;
  reviewReasons: string[];
  needsReviewItems: string[];
  lostItems: string[];
  feedback: string;
  staffPoints: number | null;
  staffGradedBy: string;
  staffGradedAt: string;
  items: Record<string, ItemOutcome>;
};

function isoOrEmpty(value: Date | string | undefined | null): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function itemTitle(criterion: RubricCriterion): string {
  return criterion.parentLabel ? `${criterion.parentLabel} — ${criterion.label}` : criterion.label;
}

function bookUrl(criterion: RubricCriterion): string {
  return `${COURSE_SITE_ORIGIN}${criterion.bookHref ?? "/book"}`;
}

/** First sentence-ish of a checker message, kept to one short line. */
function shortReason(message: string | undefined): string {
  const text = (message ?? "").replace(/\s+/g, " ").trim();
  if (!text) return "Not found on the deploy.";
  return text.length > 220 ? `${text.slice(0, 217)}…` : text;
}

export function itemOutcome(
  assignmentId: string,
  criterion: RubricCriterion,
  result: AssignmentCheckResult | undefined,
): ItemOutcome {
  if (criterionCoverage(assignmentId, criterion.id) === "manual") return "manual";
  if (!result) return "not_checked";
  if (result.needsRecheck) return "recheck";
  if (result.skipped) return "not_checked";
  if (result.needsReview) return "review";
  return result.passed ? "pass" : "fail";
}

/** One feedback line per lost item: what was missing and where to fix it. */
export function feedbackLine(criterion: RubricCriterion, result?: AssignmentCheckResult): string {
  const section = criterion.bookLabel ? ` (${criterion.bookLabel})` : "";
  return `- ${itemTitle(criterion)}${section}, −${criterion.points}: ${shortReason(result?.message)} Fix: ${bookUrl(criterion)}`;
}

export function buildSubmissionExportRow(input: {
  assignmentId: string;
  rubric: AssignmentRubric;
  row: StaffStudentRow;
}): SubmissionExportRow {
  const { assignmentId, rubric, row } = input;
  const criteria = listRubricCriteria(rubric);
  const results = row.checkResults ?? [];
  const latest = latestResultByCriterion(results);
  const grade = row.staffGrade && hasStaffGradeSave(row.staffGrade) ? row.staffGrade : undefined;
  const final = finalGradeForStaffRow(assignmentId, rubric, row);

  const items: Record<string, ItemOutcome> = {};
  const lost: { criterion: RubricCriterion; result?: AssignmentCheckResult }[] = [];
  for (const criterion of criteria) {
    const result = latest.get(criterion.id);
    const outcome = itemOutcome(assignmentId, criterion, result);
    items[criterion.id] = outcome;
    if (outcome === "fail") lost.push({ criterion, result });
  }

  const scored = final.checkStatus === "scored";
  const confidence: ExportConfidence = !final.ready
    ? "needs_review"
    : final.points === final.maxPoints
      ? "full_marks"
      : "confident_deduction";
  const score = final.ready
    ? final.canvasScore
    : final.points == null
      ? ""
      : `${final.points} / ${final.maxPoints} (grading in progress)`;

  return {
    name: row.name,
    email: row.email,
    section: row.section ?? "",
    canvasUserId: row.canvasUserId ?? "",
    clerkUserId: row.clerkUserId ?? "",
    githubUrl: row.githubUrl ?? "",
    submittedUrl: row.vercelUrl ?? "",
    submittedAt: isoOrEmpty(row.submittedAt),
    lastCheckedAt: isoOrEmpty(row.lastCheckedAt),
    checkerVersion: row.checkerVersion ?? "",
    checkStatus: final.checkStatus,
    autoPoints: final.autoPoints,
    autoMax: final.autoMax,
    manualPoints: final.manualPoints,
    manualMax: final.manualMax,
    points: final.points,
    maxPoints: final.maxPoints,
    score,
    readyForCanvas: final.ready,
    readyReason: final.ready ? "fully graded" : final.reasons.join("; "),
    canvasPercent: final.canvasPercent,
    scoreSource: final.source,
    confidence,
    reviewReasons: final.reasons,
    needsReviewItems: needsReviewCriterionIds(results),
    lostItems: lost.map(({ criterion }) => criterion.id),
    feedback: scored ? lost.map(({ criterion, result }) => feedbackLine(criterion, result)).join("\n") : "",
    staffPoints: grade ? grade.earnedPoints : null,
    staffGradedBy: grade?.gradedByEmail ?? "",
    staffGradedAt: grade ? isoOrEmpty(grade.gradedAt) : "",
    items,
  };
}

export function buildSubmissionExportRows(input: {
  assignmentId: string;
  rubric: AssignmentRubric;
  queue: readonly StaffStudentRow[];
}): SubmissionExportRow[] {
  return input.queue
    .filter((row) => row.hasSubmission)
    .map((row) => buildSubmissionExportRow({ ...input, row }));
}

export function csvCell(value: unknown): string {
  if (value == null) return "";
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows: readonly (readonly unknown[])[]): string {
  return `${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

const SUBMISSION_COLUMNS = [
  "name",
  "email",
  "section",
  "canvas_user_id",
  "clerk_user_id",
  "github_url",
  "submitted_url",
  "submitted_at",
  "last_checked_at",
  "checker_version",
  "check_status",
  "auto_points",
  "auto_max",
  "manual_points",
  "manual_max",
  "points",
  "max_points",
  "score",
  "score_source",
  "ready_for_canvas",
  "ready_reason",
  "canvas_percent",
  "confidence",
  "needs_review_items",
  "lost_items",
  "feedback",
  "staff_points",
  "staff_graded_by",
  "staff_graded_at",
] as const;

export function submissionExportCsv(
  rubric: AssignmentRubric,
  rows: readonly SubmissionExportRow[],
): string {
  const criteria = listRubricCriteria(rubric);
  const header = [...SUBMISSION_COLUMNS, ...criteria.map((criterion) => `item:${criterion.id}`)];
  const body = rows.map((row) => [
    row.name,
    row.email,
    row.section,
    row.canvasUserId,
    row.clerkUserId,
    row.githubUrl,
    row.submittedUrl,
    row.submittedAt,
    row.lastCheckedAt,
    row.checkerVersion,
    row.checkStatus,
    row.autoPoints,
    row.autoMax,
    row.manualPoints,
    row.manualMax,
    row.points,
    row.maxPoints,
    row.score,
    row.scoreSource,
    row.readyForCanvas ? "yes" : "no",
    row.readyReason,
    row.canvasPercent == null ? "" : row.canvasPercent.toFixed(1),
    row.confidence,
    row.needsReviewItems.join(" "),
    row.lostItems.join(" "),
    row.feedback,
    row.staffPoints,
    row.staffGradedBy,
    row.staffGradedAt,
    ...criteria.map((criterion) => row.items[criterion.id] ?? ""),
  ]);
  return toCsv([header, ...body]);
}

export type MissedItemSummary = {
  criterionId: string;
  section: string;
  group: string;
  item: string;
  points: number;
  missed: number;
  needsReview: number;
  scored: number;
  missedPercent: number;
  bookUrl: string;
};

/**
 * Which rubric items students miss most, over scored submissions only
 * (Needs re-check and not-checked rows are left out). Sorted by missed, then
 * needs review. Manual items are omitted.
 */
export function missedItemSummary(input: {
  assignmentId: string;
  rubric: AssignmentRubric;
  rows: readonly SubmissionExportRow[];
}): MissedItemSummary[] {
  const scored = input.rows.filter((row) => row.checkStatus === "scored");
  const summaries: MissedItemSummary[] = [];
  for (const group of input.rubric.groups) {
    for (const criterion of group.criteria) {
      if (criterionCoverage(input.assignmentId, criterion.id) === "manual") continue;
      const missed = scored.filter((row) => row.items[criterion.id] === "fail").length;
      const needsReview = scored.filter((row) => row.items[criterion.id] === "review").length;
      summaries.push({
        criterionId: criterion.id,
        section: criterion.bookLabel ?? "",
        group: group.title,
        item: itemTitle(criterion),
        points: criterion.points,
        missed,
        needsReview,
        scored: scored.length,
        missedPercent: scored.length ? Math.round((missed / scored.length) * 1000) / 10 : 0,
        bookUrl: bookUrl(criterion),
      });
    }
  }
  return summaries.sort(
    (a, b) => b.missed - a.missed || b.needsReview - a.needsReview || a.criterionId.localeCompare(b.criterionId),
  );
}

export function missedItemSummaryCsv(rows: readonly MissedItemSummary[]): string {
  return toCsv([
    [
      "criterion_id",
      "section",
      "group",
      "item",
      "points",
      "missed",
      "needs_review",
      "scored_submissions",
      "missed_percent",
      "book_url",
    ],
    ...rows.map((row) => [
      row.criterionId,
      row.section,
      row.group,
      row.item,
      row.points,
      row.missed,
      row.needsReview,
      row.scored,
      row.missedPercent.toFixed(1),
      row.bookUrl,
    ]),
  ]);
}
