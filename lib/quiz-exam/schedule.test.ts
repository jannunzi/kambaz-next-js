import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COURSE_EXAMS,
  answerWindowCopy,
  canRevealAnswers,
  etWallTimeToUtc,
  examPrepOpenAt,
  formatEasternCivilTimestamp,
  formatEasternDateTime,
  getAnswerRevealPhase,
  getQuizSchedule,
  isEasternDaylightTime,
  isScheduledTakeWindow,
  isTakeWindowOpen,
  nthWeekdayOfMonth,
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

  it("stores Q1 windows one week later as ISO UTC", () => {
    const q1 = getQuizSchedule("q1");
    assert.ok(q1);
    assert.equal(q1.takeUnlockAt.toISOString(), et(2026, 9, 28).toISOString());
    assert.equal(
      q1.takeLockAt.toISOString(),
      et(2026, 10, 4, 23, 59).toISOString(),
    );
    assert.equal(q1.answersOpenAt.toISOString(), et(2026, 10, 5).toISOString());
    assert.equal(q1.answersCloseAt.toISOString(), et(2026, 10, 12).toISOString());
    assert.equal(q1.examName, "midterm");
    assert.equal(
      formatEasternCivilTimestamp(q1.takeUnlockAt),
      "2026-09-28T00:00:00",
    );
    assert.equal(
      formatEasternCivilTimestamp(q1.takeLockAt),
      "2026-10-04T23:59:00",
    );
    assert.match(formatEasternDateTime(q1.takeLockAt), /October 4, 2026/);
    assert.doesNotMatch(formatEasternDateTime(q1.takeLockAt), /September 27/);
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
    assert.equal(isScheduledTakeWindow(q1, et(2026, 9, 27, 23, 59)), false);
    assert.equal(isScheduledTakeWindow(q1, et(2026, 9, 28)), true);
    assert.equal(isScheduledTakeWindow(q1, et(2026, 10, 4, 23, 59)), true);
    assert.equal(isScheduledTakeWindow(q1, et(2026, 10, 5)), false);
    assert.equal(getAnswerRevealPhase("q1", et(2026, 9, 28), false), "take_closed");
    assert.equal(getAnswerRevealPhase("q1", et(2026, 10, 4, 23, 59), false), "take_closed");
    assert.equal(
      getAnswerRevealPhase("q1", et(2026, 9, 28), false, "open"),
      "take_open",
    );
    assert.equal(isTakeWindowOpen(q1, et(2026, 10, 4, 23, 59)), false);
    assert.equal(isTakeWindowOpen(q1, et(2026, 10, 4, 23, 59), "open"), true);
    assert.equal(isTakeWindowOpen(q1, et(2026, 10, 5)), false);
  });

  it("is submitted_waiting from submit until the class-wide answers open (not per-student)", () => {
    assert.equal(
      getAnswerRevealPhase("q1", et(2026, 10, 4, 23, 59), true),
      "submitted_waiting",
    );
    assert.equal(
      getAnswerRevealPhase("q1", et(2026, 10, 4, 23, 59), true),
      "submitted_waiting",
    );
    const justBefore = new Date(q1.answersOpenAt.getTime() - 1);
    assert.equal(getAnswerRevealPhase(q1, justBefore, true), "submitted_waiting");
    assert.equal(canRevealAnswers("submitted_waiting"), false);
  });

  it("opens answers at Monday 00:00 ET and hides them at the +7d instant", () => {
    assert.equal(getAnswerRevealPhase("q1", q1.answersOpenAt, true), "answers_open");
    const lastMs = new Date(q1.answersCloseAt.getTime() - 1);
    assert.equal(getAnswerRevealPhase(q1, lastMs, true), "answers_open");
    assert.equal(getAnswerRevealPhase("q1", q1.answersCloseAt, true), "answers_closed");
    assert.equal(canRevealAnswers("answers_open"), true);
    assert.equal(canRevealAnswers("answers_closed"), false);
  });

  it("reopens Q1 one week before the midterm placeholder, exclusive of midtermAt", () => {
    assert.equal(
      getAnswerRevealPhase("q1", et(2026, 10, 28, 23, 59), true),
      "answers_closed",
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

  it("opens Q3 answers the week after the shifted take lock", () => {
    assert.equal(getAnswerRevealPhase("q3", et(2026, 11, 2), true), "answers_reopen");
    assert.equal(getAnswerRevealPhase("q3", et(2026, 11, 5), true), "submitted_waiting");
    assert.equal(getAnswerRevealPhase("q3", et(2026, 11, 9), true), "answers_open");
    assert.equal(getAnswerRevealPhase("q3", et(2026, 11, 16), true), "answers_closed");
  });

  it("prefers the first answer window when it overlaps exam prep", () => {
    const q3 = getQuizSchedule("q3");
    assert.ok(q3);
    const overlapping = { ...q3, answersOpenAt: q3.examPrepOpenAt };
    assert.equal(
      getAnswerRevealPhase(overlapping, et(2026, 11, 2), true),
      "answers_open",
    );
  });

  it("reopens Q4–Q6 the week before the syllabus Exam (final)", () => {
    const q4 = getQuizSchedule("q4");
    assert.ok(q4);
    assert.equal(q4.examName, "final");
    assert.equal(getAnswerRevealPhase("q4", et(2026, 12, 6, 23, 59), true), "answers_closed");
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

describe("answer-window copy", () => {
  const q1 = getQuizSchedule("q1");
  assert.ok(q1);

  it("mentions the one-week window, close time, and midterm reopen while waiting", () => {
    const copy = answerWindowCopy(q1, "submitted_waiting", et(2026, 10, 4, 12));
    assert.match(copy.title, /not open yet/i);
    assert.match(copy.paragraphs.join(" "), /only for one week/);
    assert.match(copy.paragraphs.join(" "), /midterm/);
    assert.ok(copy.paragraphs.join(" ").includes(formatEasternDateTime(q1.answersOpenAt)));
    assert.ok(copy.paragraphs.join(" ").includes(formatEasternDateTime(q1.answersCloseAt)));
  });

  it("says answers are available only for one week during the first window", () => {
    const copy = answerWindowCopy(q1, "answers_open", et(2026, 10, 6));
    assert.match(copy.paragraphs.join(" "), /only for one week/);
    assert.ok(copy.paragraphs.join(" ").includes(formatEasternDateTime(q1.answersCloseAt)));
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
