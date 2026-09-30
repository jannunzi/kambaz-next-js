/**
 * Class-wide Fall 2026 quiz schedules, plus per-section answer windows.
 *
 * Civil times are America/New_York (ET). Stored values are ISO UTC.
 *
 * `QUIZ_WINDOW_ISO` take dates are syllabus display only. They do not open
 * or close a quiz. Taking is staff-enabled per section (`mode === "open"`)
 * and stops at that section’s `closesAt` when one is set.
 *
 * Student answer visibility does **not** use the class-wide
 * `answersOpenAt` / `answersCloseAt` instants stored below. Jose’s rule
 * (2026-09-29): answers open one week after that section’s quiz closes and
 * hide again two weeks after the close (visible for one week, same ET
 * wall-clock time). With no effective section close, answers stay hidden.
 * Staff `answersVisible` on/off still overrides.
 *
 * `EXAM_PREP_ANSWER_REOPEN_ENABLED` is the only switch for the extra
 * midterm/final prep reopen.
 */

export type ExamName = "midterm" | "final";

/**
 * Staff per-section take gate. Taking is allowed only when mode is `open`
 * and (`closesAt` is unset or `now < closesAt`). `closed`, `schedule`, and
 * unset keep the quiz disabled. Syllabus dates are still shown; they do not
 * open the quiz by themselves.
 */
export type QuizTakeOverrideMode = "open" | "closed" | "schedule";

/**
 * Staff per-section answer-key gate. `on` / `off` override the section
 * window. `schedule` / unset follow Jose’s rule: hidden until one week
 * after the section close, visible for the next week, then hidden again.
 */
export type QuizAnswersVisibleMode = "on" | "off" | "schedule";

/**
 * Per-section close fields from `quiz_access_overrides`.
 * `closesAt` is the staff-set stop time. `closedAt` is recorded the first
 * time staff switches that section from open to closed.
 */
export type SectionCloseInput = {
  mode?: QuizTakeOverrideMode | null;
  closesAt?: Date | string | null;
  closedAt?: Date | string | null;
};

export type QuizPhase =
  | "take_open"
  | "take_closed"
  | "submitted_waiting"
  | "answers_open"
  | "answers_closed"
  | "answers_reopen";

export type QuizSchedule = {
  quizId: string;
  takeUnlockAt: Date;
  takeLockAt: Date;
  answersOpenAt: Date;
  answersCloseAt: Date;
  examPrepOpenAt: Date;
  examPrepCloseAt: Date;
  examName: ExamName;
};

export type AnswerWindowInfo = {
  phase: QuizPhase;
  answersOpenAt: string;
  answersCloseAt: string;
  examPrepOpenAt: string;
  examPrepCloseAt: string;
  examName: ExamName;
  revealAnswers: boolean;
  /** Staff override when set to `on` / `off`. Unset means follow schedule. */
  answersVisible?: QuizAnswersVisibleMode;
};

export type QuizScheduleIso = {
  quizId: string;
  takeUnlockAt: string;
  takeLockAt: string;
  answersOpenAt: string;
  answersCloseAt: string;
  examPrepOpenAt: string;
  examPrepCloseAt: string;
  examName: ExamName;
};

export function scheduleToIso(schedule: QuizSchedule): QuizScheduleIso {
  return {
    quizId: schedule.quizId,
    takeUnlockAt: schedule.takeUnlockAt.toISOString(),
    takeLockAt: schedule.takeLockAt.toISOString(),
    answersOpenAt: schedule.answersOpenAt.toISOString(),
    answersCloseAt: schedule.answersCloseAt.toISOString(),
    examPrepOpenAt: schedule.examPrepOpenAt.toISOString(),
    examPrepCloseAt: schedule.examPrepCloseAt.toISOString(),
    examName: schedule.examName,
  };
}

export function scheduleFromIso(iso: QuizScheduleIso): QuizSchedule {
  return {
    quizId: iso.quizId,
    takeUnlockAt: new Date(iso.takeUnlockAt),
    takeLockAt: new Date(iso.takeLockAt),
    answersOpenAt: new Date(iso.answersOpenAt),
    answersCloseAt: new Date(iso.answersCloseAt),
    examPrepOpenAt: new Date(iso.examPrepOpenAt),
    examPrepCloseAt: new Date(iso.examPrepCloseAt),
    examName: iso.examName,
  };
}

/**
 * Course exam instants (00:00 America/New_York), stored as ISO UTC.
 *
 * The syllabus lists X1 (due 2026-11-01) and X2 (due 2026-12-20) in
 * `app/syllabus/data/deadlines.ts`, plus a university final-exam period of
 * 2026-12-14–2026-12-20 (`app/syllabus/data/course.ts`).
 *
 * - `midtermAt` — Q1–Q3 answer-reopen close: Thursday 2026-11-05 00:00 ET,
 *   the first weekday after X1’s Sunday due.
 * - `finalAt` — syllabus X2 unlock / finals week Monday: 2026-12-14 00:00 ET.
 *
 * Edit these two strings if Jose moves the exam instants used for Q1–Q6
 * answer reopen. Q1–Q3 reopen `[midtermAt − 7d, midtermAt)`. Q4–Q6 reopen
 * `[finalAt − 7d, finalAt)`.
 */
export const COURSE_EXAMS = {
  midtermAt: "2026-11-05T05:00:00.000Z",
  finalAt: "2026-12-14T05:00:00.000Z",
} as const;

/**
 * Extra answer reopen during the week before the midterm (Q1–Q3) and the
 * final (Q4–Q6). X1/X2 already skip it via `skipExamPrep`.
 *
 * Jose’s default is the per-section window (close + 7 days through close +
 * 14 days). Set this flag to `false` to remove the exam-prep reopen from
 * both the phase and the student copy. Open question for Jose: keep it?
 */
export const EXAM_PREP_ANSWER_REOPEN_ENABLED = true;

/** Answers become visible this many ET calendar days after the section close. */
export const SECTION_ANSWERS_OPEN_AFTER_DAYS = 7;
/** Answers hide again this many ET calendar days after the section close. */
export const SECTION_ANSWERS_HIDE_AFTER_DAYS = 14;

const PRE_MIDTERM_QUIZZES = new Set(["q1", "q2", "q3", "x1"]);

/**
 * Q1–Q6 and X1/X2 syllabus take windows (ISO UTC).
 * `answersOpenAt` / `answersCloseAt` are the legacy class-wide calendar.
 * They stay on the schedule for reference and do not control student
 * answer visibility.
 */
const QUIZ_WINDOW_ISO: Record<
  string,
  {
    takeUnlockAt: string;
    takeLockAt: string;
    answersOpenAt: string;
    answersCloseAt: string;
    /** Exams skip the chapter-quiz exam-prep reopen (avoids leaking during the take week). */
    skipExamPrep?: boolean;
  }
> = {
  q1: {
    takeUnlockAt: "2026-09-21T04:00:00.000Z",
    takeLockAt: "2026-09-28T03:59:00.000Z",
    answersOpenAt: "2026-09-28T04:00:00.000Z",
    answersCloseAt: "2026-10-05T04:00:00.000Z",
  },
  q2: {
    takeUnlockAt: "2026-10-05T04:00:00.000Z",
    takeLockAt: "2026-10-12T03:59:00.000Z",
    answersOpenAt: "2026-10-12T04:00:00.000Z",
    answersCloseAt: "2026-10-19T04:00:00.000Z",
  },
  q3: {
    takeUnlockAt: "2026-10-19T04:00:00.000Z",
    takeLockAt: "2026-10-26T03:59:00.000Z",
    answersOpenAt: "2026-11-02T05:00:00.000Z",
    answersCloseAt: "2026-11-09T05:00:00.000Z",
  },
  q4: {
    takeUnlockAt: "2026-11-02T05:00:00.000Z",
    takeLockAt: "2026-11-09T04:59:00.000Z",
    answersOpenAt: "2026-11-09T05:00:00.000Z",
    answersCloseAt: "2026-11-16T05:00:00.000Z",
  },
  q5: {
    takeUnlockAt: "2026-11-16T05:00:00.000Z",
    takeLockAt: "2026-11-23T04:59:00.000Z",
    answersOpenAt: "2026-11-23T05:00:00.000Z",
    answersCloseAt: "2026-11-30T05:00:00.000Z",
  },
  q6: {
    takeUnlockAt: "2026-11-30T05:00:00.000Z",
    takeLockAt: "2026-12-07T04:59:00.000Z",
    answersOpenAt: "2026-12-21T05:00:00.000Z",
    answersCloseAt: "2026-12-28T05:00:00.000Z",
  },
  x1: {
    takeUnlockAt: "2026-10-26T04:00:00.000Z",
    takeLockAt: "2026-11-02T04:59:00.000Z",
    answersOpenAt: "2026-11-02T05:00:00.000Z",
    answersCloseAt: "2026-11-09T05:00:00.000Z",
    skipExamPrep: true,
  },
  x2: {
    takeUnlockAt: "2026-12-14T05:00:00.000Z",
    takeLockAt: "2026-12-21T04:59:00.000Z",
    answersOpenAt: "2026-12-21T05:00:00.000Z",
    answersCloseAt: "2026-12-28T05:00:00.000Z",
    skipExamPrep: true,
  },
};

/** nth Sunday of a month (1-based month). Used for US DST bounds. */
export function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  n: number,
): number {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const firstWeekday = first.getUTCDay();
  const day = 1 + ((weekday - firstWeekday + 7) % 7) + (n - 1) * 7;
  return day;
}

/**
 * Whether a civil America/New_York wall time is in Eastern Daylight Time
 * (UTC−4). US DST: 2nd Sunday of March 02:00 → 1st Sunday of November 02:00.
 */
export function isEasternDaylightTime(
  year: number,
  month: number,
  day: number,
  hour = 0,
): boolean {
  const startDay = nthWeekdayOfMonth(year, 3, 0, 2);
  const endDay = nthWeekdayOfMonth(year, 11, 0, 1);
  if (month < 3 || month > 11) return false;
  if (month > 3 && month < 11) return true;
  if (month === 3) {
    if (day < startDay) return false;
    if (day > startDay) return true;
    return hour >= 2;
  }
  if (day < endDay) return true;
  if (day > endDay) return false;
  return hour < 2;
}

/** Convert an America/New_York civil time to a UTC `Date`. */
export function etWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): Date {
  const offsetHours = isEasternDaylightTime(year, month, day, hour) ? 4 : 5;
  return new Date(
    Date.UTC(year, month - 1, day, hour + offsetHours, minute, second),
  );
}

function examNameForQuiz(quizId: string): ExamName {
  return PRE_MIDTERM_QUIZZES.has(quizId) ? "midterm" : "final";
}

function examAtForQuiz(quizId: string): Date {
  return new Date(
    examNameForQuiz(quizId) === "midterm"
      ? COURSE_EXAMS.midtermAt
      : COURSE_EXAMS.finalAt,
  );
}

/**
 * Shift an instant by whole ET calendar days, keeping the same wall-clock
 * time. DST is applied for the destination civil date (fall-back and
 * spring-forward), matching `etWallTimeToUtc`.
 */
export function addEasternCalendarDays(date: Date, days: number): Date {
  const parts = easternCivilParts(date);
  const shifted = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day + days),
  );
  return etWallTimeToUtc(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth() + 1,
    shifted.getUTCDate(),
    parts.hour,
    parts.minute,
    parts.second,
  );
}

/** One week before an ET instant, as the same clock time seven calendar days earlier. */
export function examPrepOpenAt(examAt: Date): Date {
  return addEasternCalendarDays(examAt, -7);
}

export function parseInstant(
  value: Date | string | null | undefined,
): Date | undefined {
  if (value == null || value === "") return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
}

/**
 * Close instant that starts Jose’s answer clock.
 * `closesAt` once it has passed; otherwise `closedAt` when mode is closed;
 * otherwise none.
 */
export function effectiveSectionCloseAt(
  input: SectionCloseInput | null | undefined,
  now: Date = new Date(),
): Date | undefined {
  if (!input) return undefined;
  const closesAt = parseInstant(input.closesAt);
  if (closesAt && now.getTime() >= closesAt.getTime()) return closesAt;
  if (input.mode === "closed") return parseInstant(input.closedAt);
  return undefined;
}

/** Default answer window: [close + 7d, close + 14d) at the same ET clock time. */
export function answerWindowFromSectionClose(closeAt: Date): {
  answersOpenAt: Date;
  answersCloseAt: Date;
} {
  return {
    answersOpenAt: addEasternCalendarDays(closeAt, SECTION_ANSWERS_OPEN_AFTER_DAYS),
    answersCloseAt: addEasternCalendarDays(closeAt, SECTION_ANSWERS_HIDE_AFTER_DAYS),
  };
}

export type ResolvedSectionAnswerWindow = {
  closeAt: Date;
  answersOpenAt: Date;
  answersCloseAt: Date;
  /** False when `closesAt` is still in the future (display only). */
  effective: boolean;
};

/**
 * Window for student copy and the staff panel. A future `closesAt` is
 * included so the dates can be shown before the quiz actually closes.
 * Reveal uses only `effective` windows.
 */
export function resolveSectionAnswerWindow(
  input: SectionCloseInput | null | undefined,
  now: Date = new Date(),
): ResolvedSectionAnswerWindow | undefined {
  if (!input) return undefined;
  const closesAt = parseInstant(input.closesAt);
  const closedAt =
    input.mode === "closed" ? parseInstant(input.closedAt) : undefined;
  if (closesAt && now.getTime() >= closesAt.getTime()) {
    return {
      closeAt: closesAt,
      ...answerWindowFromSectionClose(closesAt),
      effective: true,
    };
  }
  if (closedAt) {
    return {
      closeAt: closedAt,
      ...answerWindowFromSectionClose(closedAt),
      effective: true,
    };
  }
  if (closesAt) {
    return {
      closeAt: closesAt,
      ...answerWindowFromSectionClose(closesAt),
      effective: false,
    };
  }
  return undefined;
}

function easternCivilParts(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

export function getQuizSchedule(quizId: string): QuizSchedule | undefined {
  const windows = QUIZ_WINDOW_ISO[quizId];
  if (!windows) return undefined;
  const examName = examNameForQuiz(quizId);
  const examPrepCloseAt = examAtForQuiz(quizId);
  const examPrepOpen = windows.skipExamPrep
    ? examPrepCloseAt
    : examPrepOpenAt(examPrepCloseAt);
  return {
    quizId,
    takeUnlockAt: new Date(windows.takeUnlockAt),
    takeLockAt: new Date(windows.takeLockAt),
    answersOpenAt: new Date(windows.answersOpenAt),
    answersCloseAt: new Date(windows.answersCloseAt),
    examPrepOpenAt: examPrepOpen,
    examPrepCloseAt,
    examName,
  };
}

export function listQuizSchedules(): QuizSchedule[] {
  return Object.keys(QUIZ_WINDOW_ISO)
    .map((quizId) => getQuizSchedule(quizId))
    .filter((schedule): schedule is QuizSchedule => Boolean(schedule));
}

/** Syllabus unlock→due window. Display only — does not enable taking. */
export function isScheduledTakeWindow(
  schedule: QuizSchedule,
  now: Date = new Date(),
): boolean {
  const t = now.getTime();
  return t >= schedule.takeUnlockAt.getTime() && t <= schedule.takeLockAt.getTime();
}

/**
 * Graded take is staff-enabled only. Calendar dates never open a quiz.
 * A section `closesAt` stops taking at that instant even while mode is open.
 */
export function isTakeWindowOpen(
  _schedule: QuizSchedule,
  now: Date = new Date(),
  override?: QuizTakeOverrideMode | null,
  closesAt?: Date | string | null,
): boolean {
  if (override !== "open") return false;
  const close = parseInstant(closesAt);
  if (!close) return true;
  return now.getTime() < close.getTime();
}

export function isInExamPrepWindow(
  schedule: QuizSchedule,
  now: Date = new Date(),
): boolean {
  const t = now.getTime();
  return (
    t >= schedule.examPrepOpenAt.getTime() &&
    t < schedule.examPrepCloseAt.getTime()
  );
}

function sectionCloseFor(
  override: QuizTakeOverrideMode | null | undefined,
  sectionClose?: SectionCloseInput | null,
): SectionCloseInput {
  return {
    mode: sectionClose?.mode ?? override,
    closesAt: sectionClose?.closesAt,
    closedAt: sectionClose?.closedAt,
  };
}

function isInsideAnswerWindow(
  window: { answersOpenAt: Date; answersCloseAt: Date },
  now: Date,
): boolean {
  const t = now.getTime();
  return (
    t >= window.answersOpenAt.getTime() && t < window.answersCloseAt.getTime()
  );
}

/**
 * Phase for `/quizzes/take/[quizId]`.
 * `now` must be the server clock when deciding whether to leak answers.
 * Submitted attempts follow the per-section close, not `QUIZ_WINDOW_ISO`
 * answer dates. Exam-prep reopen stays behind
 * `EXAM_PREP_ANSWER_REOPEN_ENABLED`.
 */
export function getAnswerRevealPhase(
  quizIdOrSchedule: string | QuizSchedule,
  now: Date = new Date(),
  hasAttempt = false,
  override?: QuizTakeOverrideMode | null,
  sectionClose?: SectionCloseInput | null,
): QuizPhase | null {
  const schedule =
    typeof quizIdOrSchedule === "string"
      ? getQuizSchedule(quizIdOrSchedule)
      : quizIdOrSchedule;
  if (!schedule) return null;

  const access = sectionCloseFor(override, sectionClose);

  if (!hasAttempt) {
    return isTakeWindowOpen(schedule, now, access.mode, access.closesAt)
      ? "take_open"
      : "take_closed";
  }

  const window = resolveSectionAnswerWindow(access, now);
  if (window?.effective && isInsideAnswerWindow(window, now)) {
    return "answers_open";
  }
  if (EXAM_PREP_ANSWER_REOPEN_ENABLED && isInExamPrepWindow(schedule, now)) {
    return "answers_reopen";
  }
  if (window?.effective && now.getTime() < window.answersOpenAt.getTime()) {
    return "submitted_waiting";
  }
  if (!window?.effective) {
    if (
      EXAM_PREP_ANSWER_REOPEN_ENABLED &&
      now.getTime() >= schedule.examPrepCloseAt.getTime()
    ) {
      return "answers_closed";
    }
    return "submitted_waiting";
  }
  return "answers_closed";
}

export function activeAnswersVisibleOverride(
  mode: QuizAnswersVisibleMode | undefined | null,
): QuizAnswersVisibleMode | undefined {
  return mode === "on" || mode === "off" ? mode : undefined;
}

/**
 * Student-facing answer-key visibility. Staff `on` / `off` override the
 * section window. Unset / `schedule` follow that window (default hidden).
 * Staff attempt review never uses this — it always reveals.
 */
export function canRevealAnswers(
  phase: QuizPhase | null,
  answersVisible?: QuizAnswersVisibleMode | null,
): boolean {
  const override = activeAnswersVisibleOverride(answersVisible);
  if (override === "on") return true;
  if (override === "off") return false;
  return phase === "answers_open" || phase === "answers_reopen";
}

export function toAnswerWindowInfo(
  schedule: QuizSchedule,
  phase: QuizPhase,
  answersVisible?: QuizAnswersVisibleMode | null,
  sectionClose?: SectionCloseInput | null,
  now: Date = new Date(),
): AnswerWindowInfo {
  const override = activeAnswersVisibleOverride(answersVisible);
  const display = resolveSectionAnswerWindow(sectionClose, now);
  return {
    phase,
    answersOpenAt: (display?.answersOpenAt ?? schedule.answersOpenAt).toISOString(),
    answersCloseAt: (display?.answersCloseAt ?? schedule.answersCloseAt).toISOString(),
    examPrepOpenAt: schedule.examPrepOpenAt.toISOString(),
    examPrepCloseAt: schedule.examPrepCloseAt.toISOString(),
    examName: schedule.examName,
    revealAnswers: canRevealAnswers(phase, answersVisible),
    answersVisible: override ?? "schedule",
  };
}

export function formatEasternDateTime(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(value);
}

/** `datetime-local` value for an instant, as America/New_York wall time. */
export function formatEasternDateTimeLocal(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  const parts = easternCivilParts(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

/** Parse a `datetime-local` value as America/New_York wall time. */
export function parseEasternDateTimeLocal(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour > 23 ||
    minute > 59
  ) {
    return null;
  }
  const date = etWallTimeToUtc(year, month, day, hour, minute, 0);
  const parts = easternCivilParts(date);
  if (
    parts.year !== year ||
    parts.month !== month ||
    parts.day !== day ||
    parts.hour !== hour ||
    parts.minute !== minute
  ) {
    return null;
  }
  return date;
}

export function examLabel(name: ExamName): string {
  return name === "midterm" ? "midterm" : "final";
}

export type AnswerWindowCopy = {
  title: string;
  paragraphs: string[];
  tone: "ok" | "warn" | "neutral";
};

export function answerWindowCopy(
  schedule: QuizSchedule,
  phase: QuizPhase,
  now: Date = new Date(),
  override?: QuizTakeOverrideMode | null,
  answersVisible?: QuizAnswersVisibleMode | null,
  sectionClose?: SectionCloseInput | null,
): AnswerWindowCopy {
  const access = sectionCloseFor(override, sectionClose);
  const display = resolveSectionAnswerWindow(access, now);
  const open = display
    ? formatEasternDateTime(display.answersOpenAt)
    : undefined;
  const close = display
    ? formatEasternDateTime(display.answersCloseAt)
    : undefined;
  const prepOpen = formatEasternDateTime(schedule.examPrepOpenAt);
  const prepClose = formatEasternDateTime(schedule.examPrepCloseAt);
  const exam = examLabel(schedule.examName);
  const prepAgain = EXAM_PREP_ANSWER_REOPEN_ENABLED
    ? `They will be available again one week before the ${exam}, from ${prepOpen} until ${prepClose}.`
    : null;
  const answersOverride = activeAnswersVisibleOverride(answersVisible);
  const withPrep = (paragraphs: string[]) =>
    prepAgain ? [...paragraphs, prepAgain] : paragraphs;

  if (answersOverride === "on" && phase !== "take_open" && phase !== "take_closed") {
    return {
      title: "Answers are visible",
      paragraphs: [
        "The instructor or a TA turned on the answer key for your section. You can check correct and incorrect marks on this attempt.",
        "Staff can hide the key again at any time. Your score stays visible either way.",
      ],
      tone: "ok",
    };
  }

  if (answersOverride === "off" && phase !== "take_open" && phase !== "take_closed") {
    return {
      title: "Answers are hidden",
      paragraphs: [
        "The instructor or a TA hid the answer key for your section. Correct and incorrect marks, solutions, and the expected answers are not shown.",
        "Your score is still available on this page.",
      ],
      tone: "warn",
    };
  }

  if (phase === "submitted_waiting") {
    const lead =
      open && close
        ? `Correct answers will be available starting ${open}, only for one week, until ${close}.`
        : "Correct answers stay hidden until one week after your section's quiz closes, and then for one week.";
    return {
      title: "Answers are not open yet",
      paragraphs: withPrep([lead]),
      tone: "warn",
    };
  }

  if (phase === "answers_open") {
    const lead = close
      ? `Answers are available only for one week, until ${close}.`
      : "Answers are available only for one week.";
    return {
      title: "Answers are available this week",
      paragraphs: withPrep([lead]),
      tone: "ok",
    };
  }

  if (phase === "answers_reopen") {
    return {
      title: `Answers are available for ${exam} prep`,
      paragraphs: [
        `This is the one-week prep window before the ${exam}. Answers stay visible until ${prepClose}.`,
      ],
      tone: "ok",
    };
  }

  if (phase === "answers_closed") {
    const ended = close
      ? `The answer review window for your section ended on ${close}.`
      : "Answers are hidden for your section.";
    const paragraphs = [ended];
    if (EXAM_PREP_ANSWER_REOPEN_ENABLED) {
      const prepStillAhead = now.getTime() < schedule.examPrepOpenAt.getTime();
      paragraphs.push(
        prepStillAhead
          ? `Answers will be available again one week before the ${exam}, from ${prepOpen} until ${prepClose}.`
          : `The ${exam} prep window (${prepOpen} until ${prepClose}) has also ended.`,
      );
    }
    return {
      title: "The answer review window has ended",
      paragraphs,
      tone: "warn",
    };
  }

  if (phase === "take_closed") {
    const unlock = formatEasternDateTime(schedule.takeUnlockAt);
    const lock = formatEasternDateTime(schedule.takeLockAt);
    const dates = `Syllabus window: opens ${unlock} and is due ${lock}. Those dates do not open the quiz by themselves.`;
    const closesAt = parseInstant(access.closesAt);
    if (override === "open" && closesAt && now.getTime() >= closesAt.getTime()) {
      return {
        title: "The take window for your section has ended",
        paragraphs: [
          `New attempts closed at ${formatEasternDateTime(closesAt)}.`,
          dates,
        ],
        tone: "warn",
      };
    }
    if (override === "closed") {
      return {
        title: "This quiz is disabled for your section",
        paragraphs: [
          "New attempts are not being accepted. The instructor or a TA turned this quiz off for your section.",
          dates,
        ],
        tone: "warn",
      };
    }
    return {
      title: "This quiz is not enabled yet",
      paragraphs: [
        "Graded quizzes stay closed until the instructor or a TA enables them for your section.",
        dates,
      ],
      tone: "warn",
    };
  }

  const closesAt = parseInstant(access.closesAt);
  const until = closesAt
    ? `This attempt stays open until ${formatEasternDateTime(closesAt)}.`
    : "This attempt stays open until the instructor or a TA closes it for your section.";
  const syllabus = `Syllabus window: opens ${formatEasternDateTime(schedule.takeUnlockAt)} and is due ${formatEasternDateTime(schedule.takeLockAt)}. Those dates do not open or close the quiz by themselves.`;
  return {
    title: "Graded quiz",
    paragraphs: [
      `${until} Correct answers stay hidden until one week after your section closes, then for one week.`,
      syllabus,
    ],
    tone: "neutral",
  };
}
