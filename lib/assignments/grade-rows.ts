import type { AssignmentCheckResult } from "./check-types";
import { latestResultByCriterion } from "./checks";
import { pointsPercent } from "./grade";
import type { AssignmentId } from "./types";

/**
 * One graded criterion. Auto is the autograder result. Override starts equal
 * to Auto. Points default to full credit when Override is checked and 0 when
 * it is not. Staff may set any point value from 0 through maxPoints.
 *
 * `decided` is true only after staff explicitly set the row (Override,
 * Points, or Confirm). A draft starts with every row undecided, so a Save
 * that never touched the manual items (or a TA-review / re-check item)
 * leaves them ungraded: they never count toward a Canvas-ready grade.
 */
export type CriterionGradeRow = {
  criterionId: string;
  maxPoints: number;
  autoPassed: boolean;
  overridePassed: boolean;
  points: number;
  decided?: boolean;
  /**
   * Draft only (never stored): the Auto result a carried staff decision was
   * made against, set by carryStaffDecisions when a new run's Auto result
   * differs from it. See autoChangedSinceDecision.
   */
  decidedOnAuto?: boolean;
};

export type GradeAudience = "staff" | "student";

/** Latest staff snapshot passed to the page. Dates are ISO strings. */
export type AssignmentGradeView = {
  studentClerkUserId: string;
  assignmentId: AssignmentId;
  githubUrl: string;
  vercelUrl: string;
  rows: CriterionGradeRow[];
  checkResults: AssignmentCheckResult[];
  earnedPoints: number;
  totalPoints: number;
  percent: number;
  gradedByClerkUserId: string;
  gradedByEmail?: string;
  savedAt: string;
  /**
   * The student's submission time this grade was decided against (saved
   * with the grade). A later submission means the grade is out of date.
   */
  gradedSubmissionAt?: string;
};

export type RowFill = "green" | "red" | "yellow" | "neutral" | "review";

export type RowPresentation = {
  fill: RowFill;
  changed: boolean;
  /** Visible text. Color is never the only signal. */
  label: string;
  /** Short mark shown beside the label. */
  mark: "✓" | "✗" | "override" | "";
  className: string;
};

export const GRADE_ROW_COPY = {
  fullCredit: "Full credit",
  noCredit: "No credit",
  override: "Override",
  partialCredit: "Partial credit",
  changed: "changed",
  changedSinceGraded: "changed since last graded",
  checkedByStaff: "Checked by staff at grading",
  auto: "Auto",
  needsReview: "Needs TA review",
  needsReviewLegend: "Needs TA review (not marked wrong, no points taken off)",
  notGradedYet: "Not graded yet",
  notDecided: "not decided yet",
  needsRecheck: "Needs a re-check",
  unsetLegend: "Not set by staff yet (doesn't count until you set it)",
  autoChanged: "auto result changed since you decided this",
} as const;

export function defaultPointsFor(overridePassed: boolean, maxPoints: number): number {
  return overridePassed ? maxPoints : 0;
}

export function clampPoints(value: number, maxPoints: number): number {
  if (!Number.isFinite(value)) return 0;
  const max = Math.max(0, maxPoints);
  return Math.min(max, Math.max(0, Math.round(value)));
}

/**
 * Overridden when the Override checkmark differs from Auto, or when the
 * points differ from the default for that checkmark (full points if checked,
 * otherwise 0).
 */
export function isOverridden(row: CriterionGradeRow): boolean {
  if (row.overridePassed !== row.autoPassed) return true;
  return row.points !== defaultPointsFor(row.overridePassed, row.maxPoints);
}

/** A fresh staff decision on this row, against its current Auto result. */
function decidedNow(row: CriterionGradeRow): CriterionGradeRow {
  const { decidedOnAuto: _carried, ...rest } = row;
  void _carried;
  return { ...rest, decided: true };
}

export function withOverrideChecked(
  row: CriterionGradeRow,
  overridePassed: boolean,
): CriterionGradeRow {
  return decidedNow({
    ...row,
    overridePassed,
    points: defaultPointsFor(overridePassed, row.maxPoints),
  });
}

export function withCustomPoints(
  row: CriterionGradeRow,
  points: number,
): CriterionGradeRow {
  return decidedNow({
    ...row,
    points: clampPoints(points, row.maxPoints),
  });
}

/** Staff accept the row as it stands (e.g. a TA-review item, or a manual item at 0). */
export function withDecided(row: CriterionGradeRow): CriterionGradeRow {
  return decidedNow(row);
}

/**
 * Back to unset: no staff decision, Override and points follow Auto again.
 * A manual item goes back to "Not graded yet".
 */
export function withCleared(row: CriterionGradeRow): CriterionGradeRow {
  const { decidedOnAuto: _carried, ...rest } = row;
  void _carried;
  return {
    ...rest,
    overridePassed: row.autoPassed,
    points: defaultPointsFor(row.autoPassed, row.maxPoints),
    decided: false,
  };
}

/**
 * The Points box value as staff typed it. Empty (or not a number) means
 * "no value": the row goes back to unset instead of being recorded as 0.
 */
export function pointsFromInput(raw: string): number | null {
  const text = raw.trim();
  if (text === "") return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

/** Apply what staff typed in a row's Points box (empty clears the row). */
export function withPointsInput(
  row: CriterionGradeRow,
  points: number | null,
): CriterionGradeRow {
  return points == null ? withCleared(row) : withCustomPoints(row, points);
}

/**
 * Whether staff explicitly set this row. Rows saved before the `decided`
 * flag existed count only when staff visibly changed them (an override or
 * custom points); an untouched older row is not a staff decision.
 */
export function rowIsStaffDecided(row: {
  decided?: boolean;
  autoPassed?: boolean;
  overridePassed?: boolean;
  points: number;
  maxPoints?: number;
}): boolean {
  if (typeof row.decided === "boolean") return row.decided;
  if (
    typeof row.autoPassed !== "boolean" ||
    typeof row.overridePassed !== "boolean" ||
    typeof row.maxPoints !== "number"
  ) {
    return false;
  }
  return isOverridden({
    criterionId: "",
    maxPoints: row.maxPoints,
    autoPassed: row.autoPassed,
    overridePassed: row.overridePassed,
    points: row.points,
  });
}

export function gradePoints(rows: readonly CriterionGradeRow[]): {
  earnedPoints: number;
  totalPoints: number;
  percent: number;
} {
  const earnedPoints = rows.reduce((sum, row) => sum + row.points, 0);
  const totalPoints = rows.reduce((sum, row) => sum + row.maxPoints, 0);
  return {
    earnedPoints,
    totalPoints,
    percent: pointsPercent(earnedPoints, totalPoints),
  };
}

/** Student-facing auto-check total. Manual rows and override points are excluded. */
export function studentAutoPoints(
  rows: readonly CriterionGradeRow[],
  manualIds: ReadonlySet<string>,
): { earnedPoints: number; totalPoints: number; percent: number } {
  let earnedPoints = 0;
  let totalPoints = 0;
  for (const row of rows) {
    if (manualIds.has(row.criterionId)) continue;
    totalPoints += row.maxPoints;
    if (row.autoPassed) earnedPoints += row.maxPoints;
  }
  return {
    earnedPoints,
    totalPoints,
    percent: pointsPercent(earnedPoints, totalPoints),
  };
}

export function sanitizeCheckResults(
  results: readonly AssignmentCheckResult[] | null | undefined,
): AssignmentCheckResult[] {
  if (!results) return [];
  return results.slice(0, 200).flatMap((row) => {
    if (!row || typeof row.id !== "string" || typeof row.label !== "string") {
      return [];
    }
    return [
      {
        id: row.id,
        label: row.label,
        passed: Boolean(row.passed),
        message: typeof row.message === "string" ? row.message.slice(0, 500) : "",
        criterionId: typeof row.criterionId === "string" ? row.criterionId : undefined,
        groupId:
          row.groupId === "delivery" || row.groupId === "lab" || row.groupId === "kambaz"
            ? row.groupId
            : undefined,
        skipped: Boolean(row.skipped),
        ...(row.needsReview ? { needsReview: true } : {}),
        ...(row.needsRecheck ? { needsRecheck: true } : {}),
      },
    ];
  });
}

export function gradeRowsFromResults(
  criteria: readonly { id: string; points: number }[],
  results: readonly AssignmentCheckResult[],
): CriterionGradeRow[] {
  const byId = latestResultByCriterion(results);
  return criteria.map((criterion) => {
    const result = byId.get(criterion.id);
    const autoPassed = Boolean(result && result.passed && !result.skipped);
    return {
      criterionId: criterion.id,
      maxPoints: criterion.points,
      autoPassed,
      overridePassed: autoPassed,
      points: defaultPointsFor(autoPassed, criterion.points),
      decided: false,
    };
  });
}

/**
 * A new Run on a draft or a saved grade. Every row staff already decided
 * keeps its decision (Override, points, decided), on top of the new Auto
 * result; undecided rows take the new run as is. When the new Auto result
 * differs from the one staff decided against, the decision is still kept
 * but the row is flagged (autoChangedSinceDecision) so staff can look again
 * before saving. Nothing here decides a row staff haven't set, so a partial
 * grade stays partial.
 */
export function carryStaffDecisions(
  previous: readonly CriterionGradeRow[] | null | undefined,
  fresh: readonly CriterionGradeRow[],
): CriterionGradeRow[] {
  const decided = new Map(
    (previous ?? []).filter(rowIsStaffDecided).map((row) => [row.criterionId, row]),
  );
  return fresh.map((row) => {
    const prior = decided.get(row.criterionId);
    if (!prior) return row;
    const decidedOnAuto =
      typeof prior.decidedOnAuto === "boolean" ? prior.decidedOnAuto : prior.autoPassed;
    return {
      criterionId: row.criterionId,
      maxPoints: row.maxPoints,
      autoPassed: row.autoPassed,
      overridePassed: prior.overridePassed,
      points: clampPoints(prior.points, row.maxPoints),
      decided: true,
      ...(decidedOnAuto !== row.autoPassed ? { decidedOnAuto } : {}),
    };
  });
}

/** A kept staff decision whose Auto result changed in a later run. */
export function autoChangedSinceDecision(row: CriterionGradeRow): boolean {
  return (
    rowIsStaffDecided(row) &&
    typeof row.decidedOnAuto === "boolean" &&
    row.decidedOnAuto !== row.autoPassed
  );
}

/** Confirm text before a Save that keeps decisions whose Auto result changed. */
export function autoChangedSaveWarning(labels: readonly string[]): string | null {
  if (labels.length === 0) return null;
  const items = labels.length === 1 ? "1 item" : `${labels.length} items`;
  return `${items} you decided earlier now ${labels.length === 1 ? "has" : "have"} a different auto result: ${labels.join(", ")}. Your earlier decision is kept on ${labels.length === 1 ? "it" : "each"}. Save anyway?`;
}

/** Older `staffGrade` documents: pass/fail overrides, no per-row points. */
export type LegacyStaffGrade = {
  acceptedProposed?: boolean;
  criterionOverrides?: Record<string, boolean> | null;
  earnedPoints?: number;
  totalPoints?: number;
  percent?: number;
  gradedByEmail?: string;
  gradedByClerkUserId?: string;
  gradedAt?: Date | string;
  /** Submission time the grade was decided against (newer saves). */
  gradedSubmissionAt?: Date | string;
  rows?: readonly {
    criterionId: string;
    autoPassed: boolean;
    overridePassed: boolean;
    points: number;
    maxPoints?: number;
    decided?: boolean;
  }[] | null;
  checkResults?: readonly AssignmentCheckResult[] | null;
};

/**
 * Load a saved staff grade into checklist rows.
 * Grades that already store `rows` keep their points. Older grades use
 * `criterionOverrides` as all-or-nothing flips on top of the saved checks.
 */
export function rowsFromStaffGrade(
  criteria: readonly { id: string; points: number }[],
  staffGrade: LegacyStaffGrade,
  checkResults: readonly AssignmentCheckResult[] = [],
): CriterionGradeRow[] {
  if (staffGrade.rows?.length) {
    return normalizeGradeRows(criteria, staffGrade.rows);
  }
  const base = gradeRowsFromResults(criteria, staffGrade.checkResults ?? checkResults);
  const overrides = staffGrade.criterionOverrides ?? {};
  return base.map((row) => {
    const override = overrides[row.criterionId];
    if (typeof override !== "boolean") return row;
    return {
      ...row,
      overridePassed: override,
      points: defaultPointsFor(override, row.maxPoints),
      // An explicit pass/fail flip is a staff decision; nothing else is.
      decided: true,
    };
  });
}

export function gradeViewFromStaffGrade(input: {
  studentClerkUserId: string;
  assignmentId: AssignmentId;
  githubUrl: string;
  vercelUrl: string;
  criteria: readonly { id: string; points: number }[];
  staffGrade?: LegacyStaffGrade | null;
  checkResults?: AssignmentCheckResult[];
}): AssignmentGradeView | null {
  const staffGrade = input.staffGrade;
  if (!staffGrade?.gradedAt && !staffGrade?.rows?.length && !staffGrade?.criterionOverrides) {
    return null;
  }
  if (!staffGrade) return null;
  const checkResults = sanitizeCheckResults(
    staffGrade.checkResults ?? input.checkResults ?? [],
  );
  const rows = rowsFromStaffGrade(input.criteria, staffGrade, checkResults);
  const totals = rows.length ? gradePoints(rows) : {
    earnedPoints: staffGrade.earnedPoints ?? 0,
    totalPoints: staffGrade.totalPoints ?? 0,
    percent: staffGrade.percent ?? 0,
  };
  const gradedAt = staffGrade.gradedAt;
  const savedAt =
    gradedAt instanceof Date
      ? gradedAt.toISOString()
      : gradedAt
        ? new Date(gradedAt).toISOString()
        : new Date(0).toISOString();
  return {
    studentClerkUserId: input.studentClerkUserId,
    assignmentId: input.assignmentId,
    githubUrl: input.githubUrl,
    vercelUrl: input.vercelUrl,
    rows,
    checkResults,
    earnedPoints: totals.earnedPoints,
    totalPoints: totals.totalPoints,
    percent: totals.percent,
    gradedByClerkUserId: staffGrade.gradedByClerkUserId ?? "",
    gradedByEmail: staffGrade.gradedByEmail,
    savedAt,
    ...(isoOrUndefined(staffGrade.gradedSubmissionAt)
      ? { gradedSubmissionAt: isoOrUndefined(staffGrade.gradedSubmissionAt) }
      : {}),
  };
}

function isoOrUndefined(value: Date | string | undefined | null): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Fields written onto `assignment_submissions.staffGrade`. */
export function staffGradeRecordFromRows(input: {
  rows: readonly CriterionGradeRow[];
  checkResults?: readonly AssignmentCheckResult[];
  comments?: Record<string, string>;
  gradedByEmail?: string;
  gradedByClerkUserId?: string;
  gradedAt?: Date;
  /** The student's submission time staff graded (see recordStaffGrade). */
  gradedSubmissionAt?: Date;
}): {
  earnedPoints: number;
  totalPoints: number;
  percent: number;
  acceptedProposed: boolean;
  criterionOverrides?: Record<string, boolean>;
  comments?: Record<string, string>;
  gradedByEmail?: string;
  gradedByClerkUserId?: string;
  gradedAt: Date;
  gradedSubmissionAt?: Date;
  rows: CriterionGradeRow[];
  checkResults: AssignmentCheckResult[];
} {
  // decidedOnAuto is a draft-only marker; it is never stored.
  const rows = input.rows.map(({ decidedOnAuto: _draftOnly, ...row }) => {
    void _draftOnly;
    return { ...row };
  });
  const totals = gradePoints(rows);
  const criterionOverrides: Record<string, boolean> = {};
  for (const row of rows) {
    if (row.overridePassed !== row.autoPassed) {
      criterionOverrides[row.criterionId] = row.overridePassed;
    }
  }
  return {
    ...totals,
    acceptedProposed: !rows.some(isOverridden),
    criterionOverrides:
      Object.keys(criterionOverrides).length > 0 ? criterionOverrides : undefined,
    comments: input.comments,
    gradedByEmail: input.gradedByEmail,
    gradedByClerkUserId: input.gradedByClerkUserId,
    gradedAt: input.gradedAt ?? new Date(),
    ...(input.gradedSubmissionAt ? { gradedSubmissionAt: input.gradedSubmissionAt } : {}),
    rows,
    checkResults: sanitizeCheckResults(input.checkResults),
  };
}

export function normalizeGradeRows(
  criteria: readonly { id: string; points: number }[],
  submitted: readonly {
    criterionId: string;
    autoPassed: boolean;
    overridePassed: boolean;
    points: number;
    decided?: boolean;
  }[],
): CriterionGradeRow[] {
  const byId = new Map(submitted.map((row) => [row.criterionId, row]));
  return criteria.map((criterion) => {
    const incoming = byId.get(criterion.id);
    const autoPassed = Boolean(incoming?.autoPassed);
    const overridePassed = incoming
      ? Boolean(incoming.overridePassed)
      : autoPassed;
    const row: CriterionGradeRow = {
      criterionId: criterion.id,
      maxPoints: criterion.points,
      autoPassed,
      overridePassed,
      points: clampPoints(
        incoming?.points ?? defaultPointsFor(overridePassed, criterion.points),
        criterion.points,
      ),
    };
    // A row staff never sent, or never set, stays undecided.
    return {
      ...row,
      decided: incoming
        ? rowIsStaffDecided({ ...row, decided: incoming.decided })
        : false,
    };
  });
}

export function rowDiffersFromSaved(
  current: CriterionGradeRow,
  saved: CriterionGradeRow | undefined,
  audience: GradeAudience,
): boolean {
  if (!saved) return false;
  if (audience === "student") return current.autoPassed !== saved.autoPassed;
  return (
    current.autoPassed !== saved.autoPassed ||
    current.overridePassed !== saved.overridePassed ||
    current.points !== saved.points ||
    Boolean(current.decided) !== Boolean(saved.decided)
  );
}

export function changedCriterionIds(
  current: readonly CriterionGradeRow[],
  saved: readonly CriterionGradeRow[] | null | undefined,
  live: boolean,
  audience: GradeAudience,
): string[] {
  if (!live || !saved?.length) return [];
  const savedById = new Map(saved.map((row) => [row.criterionId, row]));
  return current
    .filter((row) => rowDiffersFromSaved(row, savedById.get(row.criterionId), audience))
    .map((row) => row.criterionId);
}

const FILL_CLASS: Record<RowFill, string> = {
  green: "border-emerald-700 bg-emerald-50 text-emerald-950",
  red: "border-red-700 bg-red-50 text-red-950",
  yellow: "border-amber-700 bg-amber-100 text-amber-950",
  neutral: "border-neutral-300 bg-white text-neutral-950",
  review: "border-dashed border-amber-600 bg-amber-50 text-amber-950",
};

/**
 * Checker text under a row. A skipped Name on Labs row keeps its sign-in
 * hint. Manual rows already show their own hint, so that skipped message
 * is not repeated.
 */
export function visibleCheckMessage(input: {
  message?: string | null;
  skipped?: boolean;
  manual: boolean;
}): string | null {
  const message = input.message?.trim() ?? "";
  if (!message) return null;
  if (input.manual && input.skipped) return null;
  return message;
}

/**
 * Blue is an edge and a badge, not a fill, so it can sit on green, red, or
 * yellow. Yellow replaces green and red when the row is overridden.
 * A skipped auto row stays neutral so "No credit" does not replace its hint.
 */
export function rowPresentation(input: {
  row: CriterionGradeRow;
  scored: boolean;
  changed: boolean;
  audience: GradeAudience;
  manual: boolean;
  skipped?: boolean;
  /** Auto could not confirm the row; it keeps its points until staff look. */
  needsReview?: boolean;
  /**
   * Staff view: the row needs an explicit staff decision (manual item,
   * TA review, re-check) and staff haven't set it yet.
   */
  unset?: boolean;
}): RowPresentation {
  const changed = input.scored && input.changed;
  if (!input.scored || (input.audience === "student" && input.manual)) {
    return {
      fill: "neutral",
      changed,
      label:
        input.manual && input.audience === "student"
          ? GRADE_ROW_COPY.checkedByStaff
          : "",
      mark: "",
      className: className("neutral", changed),
    };
  }

  if (input.audience === "staff" && input.unset) {
    return {
      fill: "review",
      changed,
      label: input.manual
        ? GRADE_ROW_COPY.notGradedYet
        : `${input.needsReview && !input.skipped ? GRADE_ROW_COPY.needsReview : GRADE_ROW_COPY.needsRecheck} · ${GRADE_ROW_COPY.notDecided}`,
      mark: "",
      className: className("review", changed),
    };
  }

  if (input.audience === "staff" && isOverridden(input.row)) {
    const partial =
      input.row.points !== 0 && input.row.points !== input.row.maxPoints;
    return {
      fill: "yellow",
      changed,
      label: partial
        ? `${GRADE_ROW_COPY.override} · ${GRADE_ROW_COPY.partialCredit}`
        : GRADE_ROW_COPY.override,
      mark: "override",
      className: className("yellow", changed),
    };
  }

  if (input.needsReview && !input.skipped) {
    return {
      fill: "review",
      changed,
      label: GRADE_ROW_COPY.needsReview,
      mark: "",
      className: className("review", changed),
    };
  }

  if (input.skipped) {
    return {
      fill: "neutral",
      changed,
      label: "",
      mark: "",
      className: className("neutral", changed),
    };
  }

  const fullCredit =
    input.row.autoPassed &&
    (input.audience === "student" || input.row.points === input.row.maxPoints);
  if (fullCredit && input.row.autoPassed) {
    return {
      fill: "green",
      changed,
      label: GRADE_ROW_COPY.fullCredit,
      mark: "✓",
      className: className("green", changed),
    };
  }

  return {
    fill: "red",
    changed,
    label: GRADE_ROW_COPY.noCredit,
    mark: "✗",
    className: className("red", changed),
  };
}

function className(fill: RowFill, changed: boolean): string {
  const fillClass = FILL_CLASS[fill];
  if (!changed) return fillClass;
  return `${fillClass} shadow-[inset_8px_0_0_0_#075985] ring-2 ring-sky-800`;
}
