/**
 * Class-wide Fall 2026 quiz take + answer-review windows.
 *
 * Civil times are America/New_York (ET). Stored values are ISO UTC.
 * Unlock is the same instant for every student — not “one week after you
 * submitted”.
 *
 * Answers are available the week after the take week, for one week only
 * (Monday 00:00 ET through the next Monday 00:00 ET). There is no exam-prep
 * reopen and no second window. Per-section windows belong to PR #191. A key
 * is never shown before the take lock unless staff set answersVisible to
 * `on`.
 *
 * Take windows are the class-wide website window for the quiz week
 * (Monday 00:00 ET unlock through Sunday 23:59 ET lock). These dates do
 * not open a quiz by themselves; staff enable taking. Student-facing
 * schedule copy names the week only. How a quiz is taken is the
 * Evaluation Quizzes row.
 */

/**
 * Staff per-section take gate. Taking is allowed only when mode is `open`.
 * `closed`, `schedule`, and unset keep the quiz disabled. Syllabus dates
 * are still shown; they do not open the quiz by themselves.
 */
export type QuizTakeOverrideMode = "open" | "closed" | "schedule";

/**
 * Staff per-section answer-key gate. `on` / `off` override the calendar.
 * `schedule` / unset keep the class-wide review week
 * (default: hidden until `answers_open`).
 */
export type QuizAnswersVisibleMode = "on" | "off" | "schedule";

export type QuizPhase =
  | "take_open"
  | "take_closed"
  | "submitted_waiting"
  | "answers_open"
  | "answers_closed";

export type QuizSchedule = {
  quizId: string;
  takeUnlockAt: Date;
  takeLockAt: Date;
  answersOpenAt: Date;
  answersCloseAt: Date;
};

export type AnswerWindowInfo = {
  phase: QuizPhase;
  answersOpenAt: string;
  answersCloseAt: string;
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
};

export function scheduleToIso(schedule: QuizSchedule): QuizScheduleIso {
  return {
    quizId: schedule.quizId,
    takeUnlockAt: schedule.takeUnlockAt.toISOString(),
    takeLockAt: schedule.takeLockAt.toISOString(),
    answersOpenAt: schedule.answersOpenAt.toISOString(),
    answersCloseAt: schedule.answersCloseAt.toISOString(),
  };
}

export function scheduleFromIso(iso: QuizScheduleIso): QuizSchedule {
  return {
    quizId: iso.quizId,
    takeUnlockAt: new Date(iso.takeUnlockAt),
    takeLockAt: new Date(iso.takeLockAt),
    answersOpenAt: new Date(iso.answersOpenAt),
    answersCloseAt: new Date(iso.answersCloseAt),
  };
}

/** Q1–Q6 and X1/X2 take + the single answer week (ISO UTC). */
const QUIZ_WINDOW_ISO: Record<
  string,
  {
    takeUnlockAt: string;
    takeLockAt: string;
    answersOpenAt: string;
    answersCloseAt: string;
  }
> = {
  q1: {
    takeUnlockAt: "2026-09-28T04:00:00.000Z",
    takeLockAt: "2026-10-05T03:59:00.000Z",
    answersOpenAt: "2026-10-05T04:00:00.000Z",
    answersCloseAt: "2026-10-12T04:00:00.000Z",
  },
  q2: {
    takeUnlockAt: "2026-10-12T04:00:00.000Z",
    takeLockAt: "2026-10-19T03:59:00.000Z",
    answersOpenAt: "2026-10-19T04:00:00.000Z",
    answersCloseAt: "2026-10-26T04:00:00.000Z",
  },
  q3: {
    takeUnlockAt: "2026-10-26T04:00:00.000Z",
    takeLockAt: "2026-11-02T04:59:00.000Z",
    answersOpenAt: "2026-11-02T05:00:00.000Z",
    answersCloseAt: "2026-11-09T05:00:00.000Z",
  },
  q4: {
    takeUnlockAt: "2026-11-09T05:00:00.000Z",
    takeLockAt: "2026-11-16T04:59:00.000Z",
    answersOpenAt: "2026-11-16T05:00:00.000Z",
    answersCloseAt: "2026-11-23T05:00:00.000Z",
  },
  q5: {
    takeUnlockAt: "2026-11-23T05:00:00.000Z",
    takeLockAt: "2026-11-30T04:59:00.000Z",
    answersOpenAt: "2026-11-30T05:00:00.000Z",
    answersCloseAt: "2026-12-07T05:00:00.000Z",
  },
  q6: {
    takeUnlockAt: "2026-12-07T05:00:00.000Z",
    takeLockAt: "2026-12-14T04:59:00.000Z",
    answersOpenAt: "2026-12-14T05:00:00.000Z",
    answersCloseAt: "2026-12-21T05:00:00.000Z",
  },
  x1: {
    takeUnlockAt: "2026-10-26T04:00:00.000Z",
    takeLockAt: "2026-11-02T04:59:00.000Z",
    answersOpenAt: "2026-11-02T05:00:00.000Z",
    answersCloseAt: "2026-11-09T05:00:00.000Z",
  },
  x2: {
    takeUnlockAt: "2026-12-14T05:00:00.000Z",
    takeLockAt: "2026-12-21T04:59:00.000Z",
    answersOpenAt: "2026-12-21T05:00:00.000Z",
    answersCloseAt: "2026-12-28T05:00:00.000Z",
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
  return {
    quizId,
    takeUnlockAt: new Date(windows.takeUnlockAt),
    takeLockAt: new Date(windows.takeLockAt),
    answersOpenAt: new Date(windows.answersOpenAt),
    answersCloseAt: new Date(windows.answersCloseAt),
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
 */
export function isTakeWindowOpen(
  _schedule: QuizSchedule,
  _now: Date = new Date(),
  override?: QuizTakeOverrideMode | null,
): boolean {
  return override === "open";
}

export function isInFirstAnswerWindow(
  schedule: QuizSchedule,
  now: Date = new Date(),
): boolean {
  const t = now.getTime();
  return (
    t >= schedule.answersOpenAt.getTime() && t < schedule.answersCloseAt.getTime()
  );
}

export type VisibleAnswerWindow = {
  kind: "review";
  openAt: Date;
  closeAt: Date;
};

/**
 * The single week a submitted attempt’s key is shown. Copy uses these
 * same instants. A window that starts at or before the take lock is omitted
 * so a key cannot open during the take.
 */
export function visibleAnswerWindows(schedule: QuizSchedule): VisibleAnswerWindow[] {
  if (
    schedule.answersOpenAt.getTime() > schedule.takeLockAt.getTime() &&
    schedule.answersOpenAt.getTime() < schedule.answersCloseAt.getTime()
  ) {
    return [
      {
        kind: "review",
        openAt: schedule.answersOpenAt,
        closeAt: schedule.answersCloseAt,
      },
    ];
  }
  return [];
}

/**
 * Class-wide phase for `/quizzes/take/[quizId]`.
 * `now` must be the server clock when deciding whether to leak answers.
 */
export function getAnswerRevealPhase(
  quizIdOrSchedule: string | QuizSchedule,
  now: Date = new Date(),
  hasAttempt = false,
  override?: QuizTakeOverrideMode | null,
): QuizPhase | null {
  const schedule =
    typeof quizIdOrSchedule === "string"
      ? getQuizSchedule(quizIdOrSchedule)
      : quizIdOrSchedule;
  if (!schedule) return null;

  if (hasAttempt) {
    // Never show a key while this quiz's take window is still open.
    // Staff answersVisible "on" can still reveal via canRevealAnswers.
    if (now.getTime() <= schedule.takeLockAt.getTime()) {
      return "submitted_waiting";
    }
    const windows = visibleAnswerWindows(schedule);
    const openReview = windows.find(
      (window) =>
        now.getTime() >= window.openAt.getTime() &&
        now.getTime() < window.closeAt.getTime(),
    );
    if (openReview) return "answers_open";
    const upcoming = windows.some(
      (window) => now.getTime() < window.openAt.getTime(),
    );
    if (upcoming) return "submitted_waiting";
    return "answers_closed";
  }

  return isTakeWindowOpen(schedule, now, override) ? "take_open" : "take_closed";
}

export function activeAnswersVisibleOverride(
  mode: QuizAnswersVisibleMode | undefined | null,
): QuizAnswersVisibleMode | undefined {
  return mode === "on" || mode === "off" ? mode : undefined;
}

/**
 * Student-facing answer-key visibility. Staff `on` / `off` override the
 * calendar. Unset / `schedule` keep the single review week (default
 * hidden). Staff attempt review never uses this — it always reveals.
 */
export function canRevealAnswers(
  phase: QuizPhase | null,
  answersVisible?: QuizAnswersVisibleMode | null,
): boolean {
  const override = activeAnswersVisibleOverride(answersVisible);
  if (override === "on") return true;
  if (override === "off") return false;
  return phase === "answers_open";
}

export function toAnswerWindowInfo(
  schedule: QuizSchedule,
  phase: QuizPhase,
  answersVisible?: QuizAnswersVisibleMode | null,
): AnswerWindowInfo {
  const override = activeAnswersVisibleOverride(answersVisible);
  return {
    phase,
    answersOpenAt: schedule.answersOpenAt.toISOString(),
    answersCloseAt: schedule.answersCloseAt.toISOString(),
    revealAnswers: canRevealAnswers(phase, answersVisible),
    answersVisible: override ?? "schedule",
  };
}

/** `YYYY-MM-DD` in America/New_York. */
export function easternIsoDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

/** Short month and day in ET, e.g. "Sep 28". */
export function formatEasternMonthDay(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
  }).format(value);
}

/** Short weekday plus month and day in ET, e.g. "Mon Sep 28". */
export function formatEasternWeekdayMonthDay(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
  })
    .format(value)
    .replace(/,/g, "");
}

/** Same clock time, shifted by civil ET days (DST-safe). */
export function addEasternDays(date: Date, days: number): Date {
  const parts = easternCivilParts(date);
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

/** "Sep 28" for the Monday a quiz’s take window opens. */
export function quizWeekOfLabel(quizId: string): string {
  const schedule = getQuizSchedule(quizId);
  if (!schedule) {
    throw new Error(`No quiz schedule for ${quizId}`);
  }
  return formatEasternMonthDay(schedule.takeUnlockAt);
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

/**
 * Civil America/New_York timestamp with no offset, for Canvas
 * `unlock_at` / `due_at` / `lock_at` (`YYYY-MM-DDTHH:mm:ss`).
 */
export function formatEasternCivilTimestamp(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  const parts = easternCivilParts(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`;
}

/** Q1 and Q2 are taken on Canvas. */
export function isCanvasOnlyQuiz(quizId: string): boolean {
  return quizId === "q1" || quizId === "q2";
}

export const CANVAS_ONLY_QUIZ_SENTENCE =
  "Quiz 1 and Quiz 2 are taken on Canvas, not on this site.";

/** Student-facing take window. Dates are display-only; staff still enable taking. */
export function syllabusTakeWindowSentence(schedule: QuizSchedule): string {
  const staffNote = "The instructor or a TA still has to enable it.";
  if (!schedule.quizId.startsWith("q")) {
    const unlock = formatEasternDateTime(schedule.takeUnlockAt);
    const lock = formatEasternDateTime(schedule.takeLockAt);
    return `Syllabus window: opens ${unlock} and is due ${lock}. ${staffNote}`;
  }
  return `This quiz is the week of ${quizWeekOfLabel(schedule.quizId)}. ${staffNote}`;
}

export type AnswerWindowCopy = {
  title: string;
  paragraphs: string[];
  tone: "ok" | "warn" | "neutral";
};

export function answerWindowCopy(
  schedule: QuizSchedule,
  phase: QuizPhase,
  _now: Date = new Date(),
  override?: QuizTakeOverrideMode | null,
  answersVisible?: QuizAnswersVisibleMode | null,
): AnswerWindowCopy {
  const review = visibleAnswerWindows(schedule)[0];
  const open = review ? formatEasternDateTime(review.openAt) : "";
  const close = review ? formatEasternDateTime(review.closeAt) : "";
  const answersOverride = activeAnswersVisibleOverride(answersVisible);

  if (
    isCanvasOnlyQuiz(schedule.quizId) &&
    (phase === "take_closed" || override === "closed")
  ) {
    return {
      title: "Taken on Canvas",
      paragraphs: [CANVAS_ONLY_QUIZ_SENTENCE],
      tone: "warn",
    };
  }

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

  if (
    isCanvasOnlyQuiz(schedule.quizId) &&
    phase !== "take_open" &&
    answersOverride !== "on" &&
    answersOverride !== "off"
  ) {
    return {
      title: "Taken on Canvas",
      paragraphs: [CANVAS_ONLY_QUIZ_SENTENCE],
      tone: "warn",
    };
  }

  if (phase === "submitted_waiting") {
    return {
      title: "Answers are not open yet",
      paragraphs: [
        `Correct answers will be available starting ${open}, only for one week, until ${close}.`,
      ],
      tone: "warn",
    };
  }

  if (phase === "answers_open") {
    return {
      title: "Answers are available this week",
      paragraphs: [`Answers are available only for one week, until ${close}.`],
      tone: "ok",
    };
  }

  if (phase === "answers_closed") {
    return {
      title: "The answer review window has ended",
      paragraphs: [`The class review window ended on ${close}.`],
      tone: "warn",
    };
  }

  if (phase === "take_closed") {
    const dates = syllabusTakeWindowSentence(schedule);
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

  return {
    title: "Graded quiz",
    paragraphs: [
      schedule.quizId.startsWith("q")
        ? `${syllabusTakeWindowSentence(schedule)} Correct answers stay hidden until the class review window.`
        : `This attempt is open until ${formatEasternDateTime(schedule.takeLockAt)}. Correct answers stay hidden until the class review window.`,
    ],
    tone: "neutral",
  };
}
