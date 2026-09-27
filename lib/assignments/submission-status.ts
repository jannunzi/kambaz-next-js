import { supportsUrlSubmission } from "./access";
import { formatGradeSummary, type GradeBreakdown } from "./grade";

/**
 * Student-facing submission status. Staff grades live on
 * `assignment_submissions.staffGrade`. This does not model regrade windows.
 */
export const SUBMISSION_STATUS_LABEL = {
  not_submitted: "Not submitted",
  submitted: "Submitted",
  graded: "Graded",
} as const;

export type StudentSubmissionStatus = keyof typeof SUBMISSION_STATUS_LABEL;

export const NOT_GRADED_YET = "Not graded yet";

export type StaffGradeSnapshot = {
  earnedPoints?: number;
  totalPoints?: number;
  percent?: number;
  gradedAt?: Date | string | null;
  rows?: readonly { points: number; maxPoints: number }[];
};

const SUBMITTED_AT_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function submissionStatusLabel(status: StudentSubmissionStatus): string {
  return SUBMISSION_STATUS_LABEL[status];
}

export function hasSavedStaffGrade(
  staffGrade: StaffGradeSnapshot | null | undefined,
): boolean {
  if (!staffGrade) return false;
  if (staffGrade.gradedAt) return true;
  if (typeof staffGrade.earnedPoints === "number") return true;
  if (staffGrade.rows && staffGrade.rows.length > 0) return true;
  return false;
}

export function studentSubmissionStatus(input: {
  hasSubmission: boolean;
  staffGrade?: StaffGradeSnapshot | null;
}): StudentSubmissionStatus {
  if (!input.hasSubmission) return "not_submitted";
  if (hasSavedStaffGrade(input.staffGrade)) return "graded";
  return "submitted";
}

/**
 * Badge for one row on the student assignment list. Assignments that do not
 * store a URL submission (A3 and later) have no badge.
 */
export function statusForAssignment(input: {
  assignmentId: string;
  hasSubmission: boolean;
  staffGrade?: StaffGradeSnapshot | null;
}): StudentSubmissionStatus | null {
  if (!supportsUrlSubmission(input.assignmentId)) return null;
  return studentSubmissionStatus(input);
}

/**
 * America/New_York clock time with an ET zone label.
 * Example: "Sun, Sep 27, 8:52 PM ET".
 */
export function formatSubmittedTimestamp(
  value: string | Date | null | undefined,
): string | null {
  if (value == null || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = SUBMITTED_AT_FORMAT.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const weekday = read("weekday");
  const month = read("month");
  const day = read("day");
  const hour = read("hour");
  const minute = read("minute");
  const dayPeriod = read("dayPeriod");
  if (!weekday || !month || !day || !hour || !minute || !dayPeriod) return null;
  return `${weekday}, ${month} ${day}, ${hour}:${minute} ${dayPeriod} ET`;
}

export function submittedBannerHeading(
  value: string | Date | null | undefined,
): string | null {
  const when = formatSubmittedTimestamp(value);
  if (!when) return null;
  return `Submitted ${when}`;
}

export type StoredSubmissionLink = {
  label: string;
  /** Exact stored value. */
  url: string;
  /** Set only for http(s) URLs that can be used as an href. */
  href: string | null;
};

function linkableHttpUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return url;
  } catch {
    return null;
  }
}

/** URLs the submit form stores. Empty fields are omitted. */
export function storedSubmissionLinks(input: {
  githubUrl?: string | null;
  vercelUrl?: string | null;
}): StoredSubmissionLink[] {
  const links: StoredSubmissionLink[] = [];
  const githubUrl = input.githubUrl?.trim() ?? "";
  const vercelUrl = input.vercelUrl?.trim() ?? "";
  if (githubUrl) {
    links.push({
      label: "GitHub repository",
      url: githubUrl,
      href: linkableHttpUrl(githubUrl),
    });
  }
  if (vercelUrl) {
    links.push({
      label: "Vercel URL",
      url: vercelUrl,
      href: linkableHttpUrl(vercelUrl),
    });
  }
  return links;
}

export function showSubmittedConfirmation(input: {
  hasSubmission: boolean;
  submitFailed: boolean;
}): boolean {
  return input.hasSubmission && !input.submitFailed;
}

/**
 * "Submit" until a submission is stored, then "Update submission"
 * (resubmit replaces the stored URLs). This is not a regrade request.
 */
export function submitActionLabel(input: {
  hasSubmission: boolean;
  pending: boolean;
}): string {
  if (input.pending) {
    return input.hasSubmission ? "Updating…" : "Submitting…";
  }
  return input.hasSubmission ? "Update submission" : "Submit";
}

export function formatGradedConfirmation(input: {
  earnedPoints: number;
  totalPoints: number;
  percent: number;
}): string {
  const summary = formatGradeSummary({
    earnedPoints: input.earnedPoints,
    totalPoints: input.totalPoints,
    percent: input.percent,
    passedCount: 0,
    totalCount: 0,
    passedIds: [],
  } satisfies GradeBreakdown);
  return `Graded: ${summary.replace(" pts", "")}`;
}

function numericStaffGrade(
  staffGrade: StaffGradeSnapshot,
): { earnedPoints: number; totalPoints: number; percent: number } | null {
  let earned = staffGrade.earnedPoints;
  let total = staffGrade.totalPoints;
  let percent = staffGrade.percent;
  if (
    (typeof earned !== "number" || typeof total !== "number") &&
    staffGrade.rows &&
    staffGrade.rows.length > 0
  ) {
    earned = staffGrade.rows.reduce((sum, row) => sum + row.points, 0);
    total = staffGrade.rows.reduce((sum, row) => sum + row.maxPoints, 0);
  }
  if (typeof earned !== "number" || typeof total !== "number") return null;
  if (typeof percent !== "number") {
    percent = total === 0 ? 0 : Math.round((earned / total) * 100);
  }
  return { earnedPoints: earned, totalPoints: total, percent };
}

/** "Graded: 95 / 100 (95%)", or "Not graded yet" when staff have not saved a grade. */
export function submissionGradeLine(
  staffGrade: StaffGradeSnapshot | null | undefined,
): string {
  if (!hasSavedStaffGrade(staffGrade) || !staffGrade) return NOT_GRADED_YET;
  const summary = numericStaffGrade(staffGrade);
  if (!summary) return "Graded";
  return formatGradedConfirmation(summary);
}

export function notSubmittedMessage(detail?: string): string {
  const lead = "Not submitted. This assignment was not submitted.";
  const extra = detail?.trim();
  if (!extra) return lead;
  if (/not submitted/i.test(extra)) return extra;
  return `${lead} ${extra}`;
}
