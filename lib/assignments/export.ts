/**
 * Staff export for loading auto-graded assignment scores into Canvas.
 *
 * One row per submission (roster students with a submission, plus unmatched
 * submissions). Scores are points and percent. A row's `confidence` says how
 * it can be loaded:
 *   - full_marks: every item earned; load as is.
 *   - confident_deduction: some auto items were missed, the total is at least
 *     CONFIDENT_DEDUCTION_FLOOR, and nothing needs review; load with feedback.
 *   - needs_review: anything that needs a person first (an item that needs TA
 *     review, a deploy that could not be opened, no stored check, a duplicate
 *     or unmatched submission, or a total below the floor).
 */
import { criterionCoverage } from "./checkers";
import { latestResultByCriterion } from "./checks";
import {
  checkRunStatus,
  needsRecheckReason,
  needsReviewCriterionIds,
  type CheckRunStatus,
} from "./check-status";
import { COURSE_SITE_ORIGIN, listRubricCriteria, rubricPointTotal } from "./catalog";
import type { AssignmentCheckResult } from "./check-types";
import { formatPointsPercent, pointsPercent } from "./grade";
import { hasStaffGradeSave, type StaffStudentRow } from "./staff";
import type { AssignmentRubric, RubricCriterion } from "./types";

export type ExportConfidence = "full_marks" | "confident_deduction" | "needs_review";

/** A total below this many points always needs review. */
export const CONFIDENT_DEDUCTION_FLOOR = 113;

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
  manualPointsCredited: number | null;
  points: number | null;
  maxPoints: number;
  percent: number | null;
  score: string;
  confidence: ExportConfidence;
  reviewReasons: string[];
  needsReviewItems: string[];
  lostItems: string[];
  feedback: string;
  staffPoints: number | null;
  staffPercent: number | null;
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
  const status = checkRunStatus(results);
  const latest = latestResultByCriterion(results);
  const maxPoints = rubricPointTotal(rubric);

  const items: Record<string, ItemOutcome> = {};
  let autoPoints = 0;
  let autoMax = 0;
  let manualPoints = 0;
  const lost: { criterion: RubricCriterion; result?: AssignmentCheckResult }[] = [];
  const unchecked: string[] = [];
  for (const criterion of criteria) {
    const result = latest.get(criterion.id);
    const outcome = itemOutcome(assignmentId, criterion, result);
    items[criterion.id] = outcome;
    if (outcome === "manual") {
      manualPoints += criterion.points;
      continue;
    }
    autoMax += criterion.points;
    if (outcome === "pass" || outcome === "review") autoPoints += criterion.points;
    else if (outcome === "fail") lost.push({ criterion, result });
    else if (outcome === "not_checked") unchecked.push(criterion.id);
  }

  const scored = status === "scored";
  // Manual rows are checked by staff at grading and are not deducted here.
  const points = scored ? autoPoints + manualPoints : null;
  const percent = points == null ? null : pointsPercent(points, maxPoints);
  const reviewItems = needsReviewCriterionIds(results);

  const reasons: string[] = [];
  if (status === "not_checked") reasons.push("not checked yet");
  if (status === "needs_recheck") {
    reasons.push(`needs re-check: ${shortReason(needsRecheckReason(results) ?? undefined)}`);
  }
  if (scored && reviewItems.length) reasons.push(`${reviewItems.length} item(s) need TA review`);
  if (scored && unchecked.length) reasons.push(`${unchecked.length} item(s) not checked`);
  if (row.priorSubmissions?.length) {
    reasons.push(`duplicate submission (${row.priorSubmissions.length + 1} on file)`);
  }
  if (row.unmatched) reasons.push("submission does not match a roster student");
  if (points != null && points < CONFIDENT_DEDUCTION_FLOOR) {
    reasons.push(`total below ${CONFIDENT_DEDUCTION_FLOOR}`);
  }

  const confidence: ExportConfidence = reasons.length
    ? "needs_review"
    : points === maxPoints
      ? "full_marks"
      : "confident_deduction";

  const grade = row.staffGrade && hasStaffGradeSave(row.staffGrade) ? row.staffGrade : undefined;
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
    checkStatus: status,
    autoPoints: scored ? autoPoints : null,
    autoMax,
    manualPointsCredited: scored ? manualPoints : null,
    points,
    maxPoints,
    percent,
    score: points == null ? "" : formatPointsPercent(points, maxPoints),
    confidence,
    reviewReasons: reasons,
    needsReviewItems: reviewItems,
    lostItems: lost.map(({ criterion }) => criterion.id),
    feedback: scored ? lost.map(({ criterion, result }) => feedbackLine(criterion, result)).join("\n") : "",
    staffPoints: grade ? grade.earnedPoints : null,
    staffPercent: grade ? pointsPercent(grade.earnedPoints, grade.totalPoints) : null,
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
  "manual_points_credited",
  "points",
  "max_points",
  "percent",
  "score",
  "confidence",
  "review_reasons",
  "needs_review_items",
  "lost_items",
  "feedback",
  "staff_points",
  "staff_percent",
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
    row.manualPointsCredited,
    row.points,
    row.maxPoints,
    row.percent == null ? "" : row.percent.toFixed(1),
    row.score,
    row.confidence,
    row.reviewReasons.join("; "),
    row.needsReviewItems.join(" "),
    row.lostItems.join(" "),
    row.feedback,
    row.staffPoints,
    row.staffPercent == null ? "" : row.staffPercent.toFixed(1),
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
