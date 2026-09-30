import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COURSE_EXAMS,
  EXAM_PREP_ANSWER_REOPEN_ENABLED,
  answerWindowCopy,
  answerWindowFromSectionClose,
  canRevealAnswers,
  etWallTimeToUtc,
  examPrepOpenAt,
  formatEasternDateTime,
  formatEasternDateTimeLocal,
  getAnswerRevealPhase,
  getQuizSchedule,
  isEasternDaylightTime,
  isScheduledTakeWindow,
  isTakeWindowOpen,
  nthWeekdayOfMonth,
  parseEasternDateTimeLocal,
} from "./schedule";

function et(year: number, month: number, day: number, hour = 0, minute = 0) {
  return etWallTimeToUtc(year, month, day, hour, minute);
}

describe("Eastern wall-time conversion", () => {
  it("uses the 2026 US DST bounds (8 Mar / 1 Nov)", () => {
    assert.equal(nthWeekdayOfMonth(2026, 3, 0, 2), 8);
    assert.equal(nthWeekdayOfMonth(2026, 11, 0, 1), 1);
    assert.equal(isEasternDaylightTime(2026, 3, 8, 1), false);
    assert.equal(isEasternDaylightTime(2026, 3, 8, 2), true);
    assert.equal(isEasternDaylightTime(2026, 11, 1, 1), true);
    assert.equal(isEasternDaylightTime(2026, 11, 1, 2), false);
  });

  it("stores package-14 Q1 windows as ISO UTC", () => {
    const q1 = getQuizSchedule("q1");
    assert.ok(q1);
    assert.equal(q1.takeUnlockAt.toISOString(), et(2026, 9, 21).toISOString());
    assert.equal(
      q1.takeLockAt.toISOString(),
      et(2026, 9, 27, 23, 59).toISOString(),
    );
    assert.equal(q1.answersOpenAt.toISOString(), et(2026, 9, 28).toISOString());
    assert.equal(q1.answersCloseAt.toISOString(), et(2026, 10, 5).toISOString());
    assert.equal(q1.examName, "midterm");
  });

  it("crosses the Nov 1 DST fallback for X1 lock vs answers open", () => {
    const x1 = getQuizSchedule("x1");
    assert.ok(x1);
    assert.equal(
      x1.takeLockAt.toISOString(),
      et(2026, 11, 1, 23, 59).toISOString(),
    );
    assert.equal(x1.answersOpenAt.toISOString(), et(2026, 11, 2).toISOString());
    assert.equal(x1.takeLockAt.toISOString(), "2026-11-02T04:59:00.000Z");
    assert.equal(x1.answersOpenAt.toISOString(), "2026-11-02T05:00:00.000Z");
  });
});

describe("exam prep reopen windows", () => {
  it("uses syllabus X2 week as finalAt and the weekday after X1 as midtermAt", () => {
    assert.equal(COURSE_EXAMS.midtermAt, et(2026, 11, 5).toISOString());
    assert.equal(COURSE_EXAMS.finalAt, et(2026, 12, 14).toISOString());
    const midterm = new Date(COURSE_EXAMS.midtermAt);
    const final = new Date(COURSE_EXAMS.finalAt);
    assert.equal(
      examPrepOpenAt(midterm).toISOString(),
      et(2026, 10, 29).toISOString(),
    );
    assert.equal(
      examPrepOpenAt(final).toISOString(),
      et(2026, 12, 7).toISOString(),
    );
  });

  it("labels Q1–Q3 midterm and Q4–Q6 final", () => {
    assert.equal(getQuizSchedule("q1")?.examName, "midterm");
    assert.equal(getQuizSchedule("q3")?.examName, "midterm");
    assert.equal(getQuizSchedule("q4")?.examName, "final");
    assert.equal(getQuizSchedule("q6")?.examName, "final");
  });

  it("opens X1/X2 take windows and skips exam-prep reopen", () => {
    const x1 = getQuizSchedule("x1");
    const x2 = getQuizSchedule("x2");
    assert.ok(x1);
    assert.ok(x2);
    assert.equal(x1.examName, "midterm");
    assert.equal(x2.examName, "final");
    assert.equal(x1.takeUnlockAt.toISOString(), et(2026, 10, 26).toISOString());
    assert.equal(x1.takeLockAt.toISOString(), et(2026, 11, 1, 23, 59).toISOString());
    assert.equal(x1.examPrepOpenAt.toISOString(), x1.examPrepCloseAt.toISOString());
    assert.equal(x2.takeUnlockAt.toISOString(), et(2026, 12, 14).toISOString());
    assert.equal(x2.takeLockAt.toISOString(), et(2026, 12, 20, 23, 59).toISOString());
    assert.equal(x2.examPrepOpenAt.toISOString(), x2.examPrepCloseAt.toISOString());
  });
});

describe("getAnswerRevealPhase boundaries", () => {
  const q1 = getQuizSchedule("q1");
  assert.ok(q1);

  it("is take_open only when staff Enable, not from the syllabus window", () => {
    assert.equal(isScheduledTakeWindow(q1, et(2026, 9, 20, 23, 59)), false);
    assert.equal(isScheduledTakeWindow(q1, et(2026, 9, 21)), true);
    assert.equal(isScheduledTakeWindow(q1, et(2026, 9, 27, 23, 59)), true);
    assert.equal(isScheduledTakeWindow(q1, et(2026, 9, 28)), false);
    assert.equal(getAnswerRevealPhase("q1", et(2026, 9, 21), false), "take_closed");
    assert.equal(getAnswerRevealPhase("q1", et(2026, 9, 27, 23, 59), false), "take_closed");
    assert.equal(
      getAnswerRevealPhase("q1", et(2026, 9, 21), false, "open"),
      "take_open",
    );
    assert.equal(isTakeWindowOpen(q1, et(2026, 9, 27, 23, 59)), false);
    assert.equal(isTakeWindowOpen(q1, et(2026, 9, 27, 23, 59), "open"), true);
    assert.equal(isTakeWindowOpen(q1, et(2026, 9, 28)), false);
  });

  it("stays submitted_waiting at the legacy class answer date when the section has not closed", () => {
    assert.equal(
      getAnswerRevealPhase("q1", et(2026, 9, 27, 23, 59), true),
      "submitted_waiting",
    );
    assert.equal(getAnswerRevealPhase(q1, q1.answersOpenAt, true), "submitted_waiting");
    assert.equal(getAnswerRevealPhase("q1", q1.answersCloseAt, true), "submitted_waiting");
    assert.equal(canRevealAnswers("submitted_waiting"), false);
    assert.equal(
      canRevealAnswers(getAnswerRevealPhase(q1, q1.answersOpenAt, true)),
      false,
    );
  });

  it("reopens Q1 one week before the midterm placeholder, exclusive of midtermAt", () => {
    assert.equal(
      getAnswerRevealPhase("q1", et(2026, 10, 28, 23, 59), true),
      "submitted_waiting",
    );
    assert.equal(getAnswerRevealPhase("q1", et(2026, 10, 29), true), "answers_reopen");
    const lastPrep = new Date(q1.examPrepCloseAt.getTime() - 1);
    assert.equal(getAnswerRevealPhase(q1, lastPrep, true), "answers_reopen");
    assert.equal(
      getAnswerRevealPhase("q1", q1.examPrepCloseAt, true),
      "answers_closed",
    );
    assert.equal(canRevealAnswers("answers_reopen"), true);
  });

  it("prefers a section answer window when it overlaps exam prep (Q3)", () => {
    const closesAt = et(2026, 10, 25, 23, 59);
    const section = { mode: "open" as const, closesAt };
    assert.equal(
      getAnswerRevealPhase("q3", et(2026, 10, 30, 12), true, "open", section),
      "answers_reopen",
    );
    assert.equal(
      getAnswerRevealPhase("q3", et(2026, 11, 2), true, "open", section),
      "answers_open",
    );
    assert.equal(
      getAnswerRevealPhase("q3", et(2026, 11, 4, 12), true, "open", section),
      "answers_open",
    );
    assert.equal(
      getAnswerRevealPhase("q3", et(2026, 11, 5), true, "open", section),
      "answers_open",
    );
    assert.equal(
      getAnswerRevealPhase("q3", et(2026, 11, 9), true, "open", section),
      "answers_closed",
    );
  });

  it("reopens Q4–Q6 the week before the syllabus Exam (final)", () => {
    const q4 = getQuizSchedule("q4");
    assert.ok(q4);
    assert.equal(q4.examName, "final");
    assert.equal(
      getAnswerRevealPhase("q4", et(2026, 12, 6, 23, 59), true),
      "submitted_waiting",
    );
    assert.equal(getAnswerRevealPhase("q4", et(2026, 12, 7), true), "answers_reopen");
    assert.equal(getAnswerRevealPhase("q4", et(2026, 12, 14), true), "answers_closed");
  });

  it("does not treat a missing attempt during the answer window as a reveal phase", () => {
    assert.equal(getAnswerRevealPhase("q1", et(2026, 10, 6), false), "take_closed");
    assert.equal(canRevealAnswers(getAnswerRevealPhase("q1", et(2026, 10, 6), false)), false);
  });

  it("returns null for an unknown quiz id", () => {
    assert.equal(getAnswerRevealPhase("qz", et(2026, 10, 6), true), null);
  });
});

describe("per-section answer window", () => {
  const q1 = getQuizSchedule("q1");
  assert.ok(q1);
  const closesAt = et(2026, 10, 4, 23, 59);
  const section = { mode: "open" as const, closesAt };
  const answersOpenAt = et(2026, 10, 11, 23, 59);
  const answersCloseAt = et(2026, 10, 18, 23, 59);

  it("does not start the answer clock until the section has actually closed", () => {
    const future = et(2026, 10, 4, 23, 59);
    assert.equal(
      getAnswerRevealPhase(q1, et(2026, 10, 1, 12), true, "open", {
        mode: "open",
        closesAt: future,
      }),
      "submitted_waiting",
    );
    const closedAt = et(2026, 9, 27, 12);
    assert.equal(
      getAnswerRevealPhase(q1, et(2026, 10, 4, 12), true, "closed", {
        mode: "closed",
        closesAt: future,
        closedAt,
      }),
      "answers_open",
    );
  });

  it("blocks taking at closesAt while mode stays open", () => {
    const justBefore = new Date(closesAt.getTime() - 1);
    assert.equal(isTakeWindowOpen(q1, justBefore, "open", closesAt), true);
    assert.equal(isTakeWindowOpen(q1, closesAt, "open", closesAt), false);
    assert.equal(isTakeWindowOpen(q1, et(2026, 10, 5), "open"), true);
    assert.equal(
      getAnswerRevealPhase(q1, justBefore, false, "open", section),
      "take_open",
    );
    assert.equal(
      getAnswerRevealPhase(q1, closesAt, false, "open", section),
      "take_closed",
    );
  });

  it("hides answers before close+7d, shows them in [close+7d, close+14d), then hides", () => {
    const window = answerWindowFromSectionClose(closesAt);
    assert.equal(window.answersOpenAt.toISOString(), answersOpenAt.toISOString());
    assert.equal(window.answersCloseAt.toISOString(), answersCloseAt.toISOString());
    assert.equal(
      getAnswerRevealPhase(
        q1,
        new Date(answersOpenAt.getTime() - 1),
        true,
        "open",
        section,
      ),
      "submitted_waiting",
    );
    assert.equal(canRevealAnswers("submitted_waiting"), false);
    assert.equal(
      getAnswerRevealPhase(q1, answersOpenAt, true, "open", section),
      "answers_open",
    );
    assert.equal(
      getAnswerRevealPhase(
        q1,
        new Date(answersCloseAt.getTime() - 1),
        true,
        "open",
        section,
      ),
      "answers_open",
    );
    assert.equal(canRevealAnswers("answers_open"), true);
    assert.equal(
      getAnswerRevealPhase(q1, answersCloseAt, true, "open", section),
      "answers_closed",
    );
    assert.equal(canRevealAnswers("answers_closed"), false);
  });

  it("lets staff on/off override the section window", () => {
    assert.equal(canRevealAnswers("submitted_waiting", "on"), true);
    assert.equal(canRevealAnswers("answers_closed", "on"), true);
    assert.equal(canRevealAnswers("answers_open", "off"), false);
    assert.equal(canRevealAnswers("answers_reopen", "off"), false);
  });

  it("keeps the same ET wall-clock time across the November fallback", () => {
    const close = et(2026, 10, 25, 23, 59);
    const window = answerWindowFromSectionClose(close);
    assert.equal(close.toISOString(), "2026-10-26T03:59:00.000Z");
    assert.equal(
      window.answersOpenAt.toISOString(),
      et(2026, 11, 1, 23, 59).toISOString(),
    );
    assert.equal(
      window.answersCloseAt.toISOString(),
      et(2026, 11, 8, 23, 59).toISOString(),
    );
    assert.equal(window.answersOpenAt.toISOString(), "2026-11-02T04:59:00.000Z");
    assert.equal(window.answersCloseAt.toISOString(), "2026-11-09T04:59:00.000Z");
    const q6 = getQuizSchedule("q6");
    assert.ok(q6);
    const access = { mode: "closed" as const, closedAt: close };
    assert.equal(
      getAnswerRevealPhase(
        q6,
        new Date(window.answersOpenAt.getTime() - 1),
        true,
        "closed",
        access,
      ),
      "submitted_waiting",
    );
    assert.equal(
      getAnswerRevealPhase(q6, window.answersOpenAt, true, "closed", access),
      "answers_open",
    );
    assert.equal(
      getAnswerRevealPhase(
        q6,
        new Date(window.answersCloseAt.getTime() - 1),
        true,
        "closed",
        access,
      ),
      "answers_open",
    );
    assert.equal(
      getAnswerRevealPhase(q6, window.answersCloseAt, true, "closed", access),
      "answers_closed",
    );
    assert.equal(formatEasternDateTimeLocal(close), "2026-10-25T23:59");
    assert.equal(
      parseEasternDateTimeLocal("2026-11-01T23:59")?.toISOString(),
      et(2026, 11, 1, 23, 59).toISOString(),
    );
  });
});

describe("answer-window copy", () => {
  const q1 = getQuizSchedule("q1");
  assert.ok(q1);
  const closesAt = et(2026, 10, 4, 23, 59);
  const section = { mode: "open" as const, closesAt };

  it("uses the per-section window dates while waiting", () => {
    const copy = answerWindowCopy(
      q1,
      "submitted_waiting",
      et(2026, 10, 5, 12),
      "open",
      undefined,
      section,
    );
    assert.match(copy.title, /not open yet/i);
    assert.match(copy.paragraphs.join(" "), /only for one week/);
    assert.ok(
      copy.paragraphs.join(" ").includes(formatEasternDateTime(et(2026, 10, 11, 23, 59))),
    );
    assert.ok(
      copy.paragraphs.join(" ").includes(formatEasternDateTime(et(2026, 10, 18, 23, 59))),
    );
    assert.equal(
      copy.paragraphs.join(" ").includes(formatEasternDateTime(q1.answersOpenAt)),
      false,
    );
    assert.equal(EXAM_PREP_ANSWER_REOPEN_ENABLED, true);
    assert.match(copy.paragraphs.join(" "), /midterm/);
  });

  it("does not quote the class-wide answer dates when the section has not closed", () => {
    const copy = answerWindowCopy(q1, "submitted_waiting", et(2026, 9, 27, 12));
    assert.match(copy.paragraphs.join(" "), /one week after your section/i);
    assert.equal(
      copy.paragraphs.join(" ").includes(formatEasternDateTime(q1.answersOpenAt)),
      false,
    );
    assert.equal(
      copy.paragraphs.join(" ").includes(formatEasternDateTime(q1.answersCloseAt)),
      false,
    );
  });

  it("says answers are available only for one week during the section window", () => {
    const copy = answerWindowCopy(
      q1,
      "answers_open",
      et(2026, 10, 12),
      "open",
      undefined,
      section,
    );
    assert.match(copy.paragraphs.join(" "), /only for one week/);
    assert.ok(
      copy.paragraphs.join(" ").includes(formatEasternDateTime(et(2026, 10, 18, 23, 59))),
    );
    assert.match(copy.paragraphs.join(" "), /midterm/);
  });

  it("points at the next reopen after the first week closes", () => {
    const copy = answerWindowCopy(q1, "answers_closed", et(2026, 10, 6));
    assert.match(copy.title, /ended/i);
    assert.match(copy.paragraphs.join(" "), /available again/);
    assert.match(copy.paragraphs.join(" "), /midterm/);
  });

  it("uses final labeling for post-midterm quizzes", () => {
    const q5 = getQuizSchedule("q5");
    assert.ok(q5);
    const copy = answerWindowCopy(q5, "answers_reopen", et(2026, 11, 28));
    assert.match(copy.title, /final/);
    assert.match(copy.paragraphs.join(" "), /final/);
  });
});
