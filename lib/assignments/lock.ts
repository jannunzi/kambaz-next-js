import { normalizeEmail } from "../roster/emails";
import { courseSectionIdFromRoster } from "../roster/sections";
import { etWallTimeToUtc } from "../quiz-exam/schedule";
import { supportsUrlSubmission } from "./access";
import {
  formatSubmittedTimestamp,
  statusForAssignment,
  type StaffGradeSnapshot,
  type StudentSubmissionStatus,
} from "./submission-status";

/**
 * Assignment URL submit stays open through 23:59:00 America/New_York on the
 * due date (Canvas Sunday 11:59pm ET). Fall 2026 uses one shared calendar.
 * `SECTION_ASSIGNMENT_DUE_DATES` is only consulted when a section override
 * is actually posted.
 */
export const ASSIGNMENT_DUE_CIVIL_TIME = {
  hour: 23,
  minute: 59,
  second: 0,
} as const;

export const DEFAULT_REOPEN_DAYS = 7;
export const MAX_REOPEN_DAYS = 366;

export const SUBMISSIONS_CLOSED = "Submissions closed.";
export const NOT_SUBMITTED_CLOSED = "Not submitted. Submissions closed.";
export const RESUBMIT_FOR_REGRADE = "Resubmit for regrade";

export type SectionAssignmentDue = {
  assignmentId: string;
  /** Course section id (`CS4550`) or a `canvas_roster.section` label. */
  section: string;
  /** Calendar date `YYYY-MM-DD`. The instant is 23:59:00 America/New_York. */
  dueDate: string;
};

/** Empty until a section is given its own assignment due date. */
export const SECTION_ASSIGNMENT_DUE_DATES: readonly SectionAssignmentDue[] = [];

export type ReopenAction = "open" | "extend" | "restart" | "close";

export type AssignmentReopenRecord = {
  assignmentId: string;
  clerkUserId?: string;
  rosterEmail?: string;
  canvasUserId?: string;
  message: string;
  openedBy: string;
  openedAt: Date | string;
  closesAt: Date | string;
  closedAt?: Date | string;
  action: ReopenAction;
};

export type ReopenStudentKey = {
  email?: string | null;
  clerkUserId?: string | null;
  canvasUserId?: string | null;
};

const ET_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function easternCivilParts(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const parts = ET_PARTS.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");
  let year = read("year");
  let month = read("month");
  let day = read("day");
  let hour = read("hour");
  const minute = read("minute");
  const second = read("second");
  if (hour === 24) {
    hour = 0;
    const next = new Date(Date.UTC(year, month - 1, day + 1));
    year = next.getUTCFullYear();
    month = next.getUTCMonth() + 1;
    day = next.getUTCDate();
  }
  return { year, month, day, hour, minute, second };
}

export function asDate(value: Date | string | null | undefined): Date | null {
  if (value == null || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 23:59:00 America/New_York on `YYYY-MM-DD`, or null when the date is unusable. */
export function dueInstantFromDate(dueDate: string | null | undefined): Date | null {
  if (!dueDate?.trim()) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dueDate.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return etWallTimeToUtc(
    year,
    month,
    day,
    ASSIGNMENT_DUE_CIVIL_TIME.hour,
    ASSIGNMENT_DUE_CIVIL_TIME.minute,
    ASSIGNMENT_DUE_CIVIL_TIME.second,
  );
}

function sectionsMatch(studentSection: string, overrideSection: string): boolean {
  if (studentSection.trim() === overrideSection.trim()) return true;
  const studentId = courseSectionIdFromRoster(studentSection);
  const overrideId = courseSectionIdFromRoster(overrideSection);
  return Boolean(studentId && overrideId && studentId === overrideId);
}

export function resolveAssignmentDueDate(input: {
  assignmentId: string;
  sharedDueDate?: string | null;
  section?: string | null;
  sectionDueDates?: readonly SectionAssignmentDue[];
}): string | null {
  const section = input.section?.trim();
  const overrides = input.sectionDueDates ?? SECTION_ASSIGNMENT_DUE_DATES;
  if (section) {
    const match = overrides.find(
      (row) =>
        row.assignmentId === input.assignmentId &&
        sectionsMatch(section, row.section),
    );
    if (match?.dueDate.trim()) return match.dueDate.trim();
  }
  const shared = input.sharedDueDate?.trim();
  return shared || null;
}

export function assignmentDueInstant(input: {
  assignmentId: string;
  sharedDueDate?: string | null;
  section?: string | null;
  sectionDueDates?: readonly SectionAssignmentDue[];
}): Date | null {
  return dueInstantFromDate(resolveAssignmentDueDate(input));
}

/**
 * Same ET clock time `days` civil days later. Crossing the DST boundary
 * keeps the wall clock and shifts the UTC offset.
 */
export function addEasternDays(from: Date, days: number): Date {
  const parts = easternCivilParts(from);
  const shifted = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  return etWallTimeToUtc(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth() + 1,
    shifted.getUTCDate(),
    parts.hour,
    parts.minute,
    parts.second,
  );
}

export function parseEasternDeadline(
  date: string,
  time: string,
): Date | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time.trim());
  if (!dateMatch || !timeMatch) return null;
  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (hour > 23 || minute > 59) return null;
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return etWallTimeToUtc(year, month, day, hour, minute, 0);
}

/** Inclusive of the due instant. No due date stays open. */
export function isSubmissionBeforeDue(now: Date, dueAt: Date | null): boolean {
  if (!dueAt) return true;
  return now.getTime() <= dueAt.getTime();
}

export function reopenMatchesStudent(
  record: AssignmentReopenRecord,
  student: ReopenStudentKey,
): boolean {
  const email = student.email ? normalizeEmail(student.email) : "";
  if (email && record.rosterEmail && normalizeEmail(record.rosterEmail) === email) {
    return true;
  }
  const clerkUserId = student.clerkUserId?.trim() ?? "";
  if (clerkUserId && record.clerkUserId && record.clerkUserId === clerkUserId) {
    return true;
  }
  const canvasUserId = student.canvasUserId?.trim() ?? "";
  if (
    canvasUserId &&
    record.canvasUserId &&
    record.canvasUserId.trim() === canvasUserId
  ) {
    return true;
  }
  return false;
}

function openedAtMs(record: AssignmentReopenRecord): number {
  return asDate(record.openedAt)?.getTime() ?? Number.NEGATIVE_INFINITY;
}

export function reopensForStudent(
  records: readonly AssignmentReopenRecord[],
  student: ReopenStudentKey,
): AssignmentReopenRecord[] {
  return records
    .filter((record) => reopenMatchesStudent(record, student))
    .sort((a, b) => openedAtMs(a) - openedAtMs(b));
}

export function latestReopen(
  records: readonly AssignmentReopenRecord[],
): AssignmentReopenRecord | null {
  let latest: AssignmentReopenRecord | null = null;
  let latestMs = Number.NEGATIVE_INFINITY;
  for (const record of records) {
    const time = openedAtMs(record);
    if (!latest || time >= latestMs) {
      latest = record;
      latestMs = time;
    }
  }
  return latest;
}

/** Active while `now` is strictly before `closesAt` and nobody closed it early. */
export function isReopenActive(
  record: AssignmentReopenRecord,
  now: Date,
): boolean {
  if (record.action === "close" || record.closedAt) return false;
  const closesAt = asDate(record.closesAt);
  if (!closesAt) return false;
  return now.getTime() < closesAt.getTime();
}

export function activeReopenForStudent(
  records: readonly AssignmentReopenRecord[],
  student: ReopenStudentKey,
  now: Date,
): AssignmentReopenRecord | null {
  const latest = latestReopen(reopensForStudent(records, student));
  if (!latest || !isReopenActive(latest, now)) return null;
  return latest;
}

export type SubmissionLockDecision =
  | { allowed: true; path: "standard" }
  | { allowed: true; path: "regrade"; reopen: AssignmentReopenRecord }
  | { allowed: false; code: "submissions_closed"; message: string };

/**
 * Before the due instant this always returns the normal submit path, even
 * when a reopen record exists. After the due instant, an active per-student
 * window allows another submit. A student who already has a submission is
 * on the regrade path.
 */
export function evaluateSubmissionLock(input: {
  now: Date;
  dueAt: Date | null;
  reopens: readonly AssignmentReopenRecord[];
  student: ReopenStudentKey;
  hasSubmission: boolean;
}): SubmissionLockDecision {
  if (isSubmissionBeforeDue(input.now, input.dueAt)) {
    return { allowed: true, path: "standard" };
  }
  const reopen = activeReopenForStudent(input.reopens, input.student, input.now);
  if (reopen && input.hasSubmission) {
    return { allowed: true, path: "regrade", reopen };
  }
  if (reopen) return { allowed: true, path: "standard" };
  return {
    allowed: false,
    code: "submissions_closed",
    message: input.hasSubmission ? SUBMISSIONS_CLOSED : NOT_SUBMITTED_CLOSED,
  };
}

export function closedSubmissionHeading(hasSubmission: boolean): string {
  return hasSubmission ? "Submissions closed" : NOT_SUBMITTED_CLOSED;
}

export function lastSubmissionLine(
  updatedAt: string | Date | null | undefined,
): string | null {
  const when = formatSubmittedTimestamp(updatedAt);
  return when ? `Last submission ${when}` : null;
}

export function openUntilLine(closesAt: string | Date | null | undefined): string | null {
  const when = formatSubmittedTimestamp(closesAt);
  return when ? `Open until ${when}` : null;
}

export function reopenedUntilBadge(
  closesAt: string | Date | null | undefined,
): string | null {
  const when = formatSubmittedTimestamp(closesAt);
  return when ? `Reopened until ${when}` : null;
}

export type StudentLockView =
  | { kind: "open" }
  | { kind: "closed"; heading: string; lastSubmittedAt: string | null; detail: string | null }
  | {
      kind: "reopened";
      message: string;
      closesAt: string;
      openUntil: string;
      lastSubmittedAt: string | null;
    };

export function studentLockView(input: {
  now: Date;
  dueAt: Date | null;
  reopens: readonly AssignmentReopenRecord[];
  student: ReopenStudentKey;
  hasSubmission: boolean;
  lastSubmittedAt?: Date | string | null;
}): StudentLockView {
  const decision = evaluateSubmissionLock({
    now: input.now,
    dueAt: input.dueAt,
    reopens: input.reopens,
    student: input.student,
    hasSubmission: input.hasSubmission,
  });
  if (!decision.allowed) {
    const last = asDate(input.lastSubmittedAt);
    return {
      kind: "closed",
      heading: closedSubmissionHeading(input.hasSubmission),
      lastSubmittedAt: last ? last.toISOString() : null,
      detail: input.hasSubmission ? lastSubmissionLine(input.lastSubmittedAt) : null,
    };
  }
  if (decision.path === "regrade" || (decision.path === "standard" && !isSubmissionBeforeDue(input.now, input.dueAt))) {
    const reopen = activeReopenForStudent(input.reopens, input.student, input.now);
    const closesAt = reopen ? asDate(reopen.closesAt) : null;
    const openUntil = closesAt ? openUntilLine(closesAt) : null;
    if (reopen && closesAt && openUntil) {
      const last = asDate(input.lastSubmittedAt);
      return {
        kind: "reopened",
        message: reopen.message,
        closesAt: closesAt.toISOString(),
        openUntil,
        lastSubmittedAt: last ? last.toISOString() : null,
      };
    }
  }
  return { kind: "open" };
}

export function assignmentListStatus(input: {
  assignmentId: string;
  hasSubmission: boolean;
  staffGrade?: StaffGradeSnapshot | null;
  now: Date;
  dueAt: Date | null;
  reopens: readonly AssignmentReopenRecord[];
  student: ReopenStudentKey;
}): StudentSubmissionStatus | null {
  if (!supportsUrlSubmission(input.assignmentId)) return null;
  const reopened =
    !isSubmissionBeforeDue(input.now, input.dueAt) &&
    Boolean(activeReopenForStudent(input.reopens, input.student, input.now));
  return statusForAssignment({
    assignmentId: input.assignmentId,
    hasSubmission: input.hasSubmission,
    staffGrade: input.staffGrade,
    reopened,
  });
}

export type ReopenBadge = {
  label: string;
  closesAt: string;
  message: string;
};

export function reopenBadgeForStudent(
  records: readonly AssignmentReopenRecord[],
  student: ReopenStudentKey,
  now: Date,
): ReopenBadge | null {
  const active = activeReopenForStudent(records, student, now);
  if (!active) return null;
  const closesAt = asDate(active.closesAt);
  const label = closesAt ? reopenedUntilBadge(closesAt) : null;
  if (!closesAt || !label) return null;
  return {
    label,
    closesAt: closesAt.toISOString(),
    message: active.message,
  };
}

type ClosesAtResult = { ok: true; closesAt: Date } | { ok: false; message: string };

export function resolveReopenClosesAt(input: {
  now: Date;
  mode: "from_now" | "from_current";
  currentClosesAt?: Date | null;
  days?: number | null;
  exactDate?: string | null;
  exactTime?: string | null;
}): ClosesAtResult {
  const exactDate = input.exactDate?.trim() ?? "";
  const exactTime = input.exactTime?.trim() ?? "";
  if (exactDate || exactTime) {
    if (!exactDate || !exactTime) {
      return { ok: false, message: "Enter both an Eastern Time date and time." };
    }
    const closesAt = parseEasternDeadline(exactDate, exactTime);
    if (!closesAt) {
      return { ok: false, message: "Enter a valid Eastern Time deadline." };
    }
    if (closesAt.getTime() <= input.now.getTime()) {
      return { ok: false, message: "The deadline has to be in the future." };
    }
    if (
      input.mode === "from_current" &&
      input.currentClosesAt &&
      closesAt.getTime() <= input.currentClosesAt.getTime()
    ) {
      return {
        ok: false,
        message: "Extend the deadline past the current close time, or restart the clock.",
      };
    }
    return { ok: true, closesAt };
  }

  const days = input.days == null ? DEFAULT_REOPEN_DAYS : input.days;
  if (!Number.isInteger(days) || days < 1 || days > MAX_REOPEN_DAYS) {
    return {
      ok: false,
      message: `Enter a whole number of days from 1 to ${MAX_REOPEN_DAYS}.`,
    };
  }
  const base =
    input.mode === "from_current" && input.currentClosesAt
      ? input.currentClosesAt
      : input.now;
  return { ok: true, closesAt: addEasternDays(base, days) };
}

function cleanReopenMessage(
  message: string | null | undefined,
  required: boolean,
): { ok: true; message: string } | { ok: false; message: string } {
  const text = message?.trim() ?? "";
  if (required && !text) {
    return { ok: false, message: "Enter a feedback message for the student." };
  }
  if (text.length > 4000) {
    return { ok: false, message: "Keep the feedback message under 4000 characters." };
  }
  return { ok: true, message: text };
}

export type PlannedReopen = {
  action: ReopenAction;
  message: string;
  openedAt: Date;
  closesAt: Date;
  closedAt?: Date;
};

export function planReopenChange(input: {
  now: Date;
  action: ReopenAction;
  message?: string | null;
  days?: number | null;
  exactDate?: string | null;
  exactTime?: string | null;
  history: readonly AssignmentReopenRecord[];
}): { ok: true; record: PlannedReopen } | { ok: false; message: string } {
  const history = [...input.history].sort((a, b) => openedAtMs(a) - openedAtMs(b));
  const latest = latestReopen(history);
  const active = latest && isReopenActive(latest, input.now) ? latest : null;

  if (input.action === "close") {
    if (!active) return { ok: false, message: "There is no open window to close." };
    const closesAt = asDate(active.closesAt);
    if (!closesAt) return { ok: false, message: "There is no open window to close." };
    return {
      ok: true,
      record: {
        action: "close",
        message: active.message,
        openedAt: input.now,
        closesAt,
        closedAt: input.now,
      },
    };
  }

  if (input.action === "open" && active) {
    return {
      ok: false,
      message: "This student already has an open window. Extend it or restart the clock.",
    };
  }
  if (input.action === "extend" && !active) {
    return { ok: false, message: "There is no open window to extend." };
  }
  if (input.action === "restart" && !latest) {
    return { ok: false, message: "Open a window before restarting the clock." };
  }

  const feedback = cleanReopenMessage(input.message, true);
  if (!feedback.ok) return feedback;

  const closes = resolveReopenClosesAt({
    now: input.now,
    mode: input.action === "extend" ? "from_current" : "from_now",
    currentClosesAt: active ? asDate(active.closesAt) : null,
    days: input.days,
    exactDate: input.exactDate,
    exactTime: input.exactTime,
  });
  if (!closes.ok) return closes;

  return {
    ok: true,
    record: {
      action: input.action,
      message: feedback.message,
      openedAt: input.now,
      closesAt: closes.closesAt,
    },
  };
}

export type ReopenHistoryItem = {
  action: ReopenAction;
  message: string;
  openedAt: string;
  closesAt: string;
  openedBy: string;
  closedAt?: string;
};

export type ReopenPanelState = {
  active: {
    message: string;
    closesAt: string;
    openUntil: string;
    badge: string;
    openedBy: string;
  } | null;
  history: ReopenHistoryItem[];
};

export function describeReopenPanel(input: {
  records: readonly AssignmentReopenRecord[];
  student: ReopenStudentKey;
  now?: Date;
}): ReopenPanelState {
  const now = input.now ?? new Date();
  const history = reopensForStudent(input.records, input.student);
  const active = activeReopenForStudent(input.records, input.student, now);
  const activeCloses = active ? asDate(active.closesAt) : null;
  const openUntil = activeCloses ? openUntilLine(activeCloses) : null;
  const badge = activeCloses ? reopenedUntilBadge(activeCloses) : null;
  return {
    active:
      active && activeCloses && openUntil && badge
        ? {
            message: active.message,
            closesAt: activeCloses.toISOString(),
            openUntil,
            badge,
            openedBy: active.openedBy,
          }
        : null,
    history: [...history].reverse().map((record) => {
      const openedAt = asDate(record.openedAt);
      const closesAt = asDate(record.closesAt);
      const closedAt = asDate(record.closedAt);
      return {
        action: record.action,
        message: record.message,
        openedAt: openedAt ? openedAt.toISOString() : "",
        closesAt: closesAt ? closesAt.toISOString() : "",
        openedBy: record.openedBy,
        closedAt: closedAt ? closedAt.toISOString() : undefined,
      };
    }),
  };
}
