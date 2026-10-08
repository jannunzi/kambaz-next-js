import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addEasternDays,
  CANVAS_ONLY_QUIZ_SENTENCE,
  isCanvasOnlyQuiz,
  answerWindowCopy,
  canRevealAnswers,
  etWallTimeToUtc,
  formatEasternCivilTimestamp,
  formatEasternDateTime,
  getAnswerRevealPhase,
  getQuizSchedule,
  isEasternDaylightTime,
  isScheduledTakeWindow,
  isTakeWindowOpen,
  nthWeekdayOfMonth,
  quizWeekOfLabel,
  syllabusTakeWindowSentence,
  visibleAnswerWindows,
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
    assert.equal(quizWeekOfLabel("q1"), "Sep 28");
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

describe("X1 and X2 take windows", () => {
  it("keeps the exam take weeks and the single answer week after each lock", () => {
    const x1 = getQuizSchedule("x1");
    const x2 = getQuizSchedule("x2");
    assert.ok(x1);
    assert.ok(x2);
    assert.equal(x1.takeUnlockAt.toISOString(), et(2026, 10, 26).toISOString());
    assert.equal(x1.takeLockAt.toISOString(), et(2026, 11, 1, 23, 59).toISOString());
    assert.equal(x1.answersOpenAt.toISOString(), et(2026, 11, 2).toISOString());
    assert.equal(x1.answersCloseAt.toISOString(), et(2026, 11, 9).toISOString());
    assert.equal(x2.takeUnlockAt.toISOString(), et(2026, 12, 14).toISOString());
    assert.equal(x2.takeLockAt.toISOString(), et(2026, 12, 20, 23, 59).toISOString());
    assert.equal(x2.answersOpenAt.toISOString(), et(2026, 12, 21).toISOString());
    assert.equal(x2.answersCloseAt.toISOString(), et(2026, 12, 28).toISOString());
  });
});

describe("answer keys stay hidden until this quiz's take lock", () => {
  it("does not reveal during the take window, and staff On still can", () => {
    const duringQ3 = et(2026, 10, 30, 12);
    assert.equal(getAnswerRevealPhase("q3", duringQ3, true), "submitted_waiting");
    assert.equal(canRevealAnswers(getAnswerRevealPhase("q3", duringQ3, true)), false);
    assert.equal(canRevealAnswers(getAnswerRevealPhase("q3", duringQ3, true), "on"), true);

    const duringQ6 = et(2026, 12, 8, 12);
    assert.equal(getAnswerRevealPhase("q6", duringQ6, true), "submitted_waiting");
    assert.equal(canRevealAnswers(getAnswerRevealPhase("q6", duringQ6, true)), false);
    assert.equal(canRevealAnswers("submitted_waiting", "on"), true);
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

  it("keeps Q1 closed on the old exam-prep Monday", () => {
    assert.equal(getAnswerRevealPhase("q1", et(2026, 10, 12), true), "answers_closed");
    assert.equal(getAnswerRevealPhase("q1", et(2026, 10, 29), true), "answers_closed");
    assert.equal(canRevealAnswers(getAnswerRevealPhase("q1", et(2026, 10, 29), true)), false);
    assert.equal(
      canRevealAnswers(getAnswerRevealPhase("q1", et(2026, 10, 29), true), "on"),
      true,
    );
  });

  it("opens each quiz for the single week after its take week", () => {
    const expected = {
      q1: [et(2026, 10, 5), et(2026, 10, 12)],
      q2: [et(2026, 10, 19), et(2026, 10, 26)],
      q3: [et(2026, 11, 2), et(2026, 11, 9)],
      q4: [et(2026, 11, 16), et(2026, 11, 23)],
      q5: [et(2026, 11, 30), et(2026, 12, 7)],
      q6: [et(2026, 12, 14), et(2026, 12, 21)],
    } as const;
    for (const [id, [open, close]] of Object.entries(expected)) {
      const schedule = getQuizSchedule(id);
      assert.ok(schedule, id);
      assert.equal(schedule.answersOpenAt.toISOString(), open.toISOString(), id);
      assert.equal(schedule.answersCloseAt.toISOString(), close.toISOString(), id);
      const windows = visibleAnswerWindows(schedule);
      assert.equal(windows.length, 1, id);
      assert.equal(windows[0]?.openAt.toISOString(), open.toISOString(), id);
      assert.equal(windows[0]?.closeAt.toISOString(), close.toISOString(), id);
      assert.equal(getAnswerRevealPhase(schedule, open, true), "answers_open", id);
      const lastMs = new Date(close.getTime() - 1);
      assert.equal(getAnswerRevealPhase(schedule, lastMs, true), "answers_open", id);
      assert.equal(getAnswerRevealPhase(schedule, close, true), "answers_closed", id);
      assert.equal(
        getAnswerRevealPhase(schedule, addEasternDays(close, 7), true),
        "answers_closed",
        id,
      );
      assert.equal(
        canRevealAnswers(getAnswerRevealPhase(schedule, addEasternDays(close, 7), true)),
        false,
        id,
      );
    }
    assert.equal(getAnswerRevealPhase("q4", et(2026, 12, 7), true), "answers_closed");
    assert.equal(getAnswerRevealPhase("q6", et(2026, 12, 10), true), "submitted_waiting");
    assert.equal(getAnswerRevealPhase("q6", et(2026, 12, 14), true), "answers_open");
    assert.equal(getAnswerRevealPhase("q6", et(2026, 12, 21), true), "answers_closed");
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

  const reopenCopy = /available again|midterm|final|prep window/i;

  function paragraphsFromWindows(
    schedule: NonNullable<ReturnType<typeof getQuizSchedule>>,
    phase: "submitted_waiting" | "answers_open" | "answers_closed",
  ): string[] {
    const windows = visibleAnswerWindows(schedule);
    assert.equal(windows.length, 1, schedule.quizId);
    const review = windows[0];
    assert.ok(review);
    const open = formatEasternDateTime(review.openAt);
    const close = formatEasternDateTime(review.closeAt);
    if (phase === "submitted_waiting") {
      return [
        `Correct answers will be available starting ${open}, only for one week, until ${close}.`,
      ];
    }
    if (phase === "answers_open") {
      return [`Answers are available only for one week, until ${close}.`];
    }
    return [`The class review window ended on ${close}.`];
  }

  it("names the quiz week without saying how the section takes it", () => {
    const sentence = syllabusTakeWindowSentence(q1);
    assert.equal(
      sentence,
      "This quiz is the week of Sep 28. The instructor or a TA still has to enable it.",
    );
    assert.doesNotMatch(
      sentence,
      /end of lecture|Monday through Sunday|in person|online|is due|by themselves/i,
    );
    const q2 = getQuizSchedule("q2");
    assert.ok(q2);
    assert.match(syllabusTakeWindowSentence(q2), /week of Oct 12/);
  });

  it("tells closed graded quizzes they are taken in Canvas, with no answer dates", () => {
    for (const id of ["q1", "q2", "q3", "q4", "q5", "q6"]) {
      const schedule = getQuizSchedule(id);
      assert.ok(schedule, id);
      for (const phase of [
        "take_closed",
        "submitted_waiting",
        "answers_open",
        "answers_closed",
      ] as const) {
        const copy = answerWindowCopy(schedule, phase, schedule.answersOpenAt);
        const text = copy.paragraphs.join(" ");
        assert.equal(text, CANVAS_ONLY_QUIZ_SENTENCE, `${id} ${phase}`);
        assert.equal(copy.paragraphs.length, 1, `${id} ${phase}`);
        assert.doesNotMatch(
          text,
          /available|review window|answer key|October|November|December|week of/i,
          `${id} ${phase}`,
        );
      }
      const enabled = answerWindowCopy(
        schedule,
        "take_open",
        schedule.takeUnlockAt,
        "open",
      );
      // Even a staff-enabled section never invites a website attempt.
      assert.deepEqual(enabled.paragraphs, [CANVAS_ONLY_QUIZ_SENTENCE], id);
      assert.doesNotMatch(enabled.paragraphs.join(" "), /still has to enable|week of/i);
    }
  });

  it("shows the Canvas message for closed Q1–Q6 when answers are off", () => {
    for (const id of ["q1", "q2", "q3", "q4", "q5", "q6"]) {
      const schedule = getQuizSchedule(id);
      assert.ok(schedule, id);
      const noAttempt = answerWindowCopy(
        schedule,
        "take_closed",
        schedule.takeUnlockAt,
        "closed",
        "off",
      );
      assert.equal(noAttempt.title, "Taken on Canvas");
      assert.deepEqual(noAttempt.paragraphs, [CANVAS_ONLY_QUIZ_SENTENCE]);
      assert.doesNotMatch(
        noAttempt.paragraphs.join(" "),
        /disabled for your section|still has to enable|answer key/i,
      );

      const withAttempt = answerWindowCopy(
        schedule,
        "submitted_waiting",
        schedule.answersOpenAt,
        "closed",
        "off",
      );
      assert.equal(withAttempt.title, "Taken on Canvas");
      assert.deepEqual(withAttempt.paragraphs, [CANVAS_ONLY_QUIZ_SENTENCE]);
      assert.doesNotMatch(
        withAttempt.paragraphs.join(" "),
        /available|hid the answer key|still has to enable/i,
      );

      const answersOn = answerWindowCopy(
        schedule,
        "take_closed",
        schedule.takeUnlockAt,
        "closed",
        "on",
      );
      assert.deepEqual(answersOn.paragraphs, [CANVAS_ONLY_QUIZ_SENTENCE]);
    }
  });

  it("derives every answer date in student copy from the computed windows", () => {
    for (const id of ["q3", "q4", "q5", "q6", "x1", "x2"]) {
      const schedule = getQuizSchedule(id);
      assert.ok(schedule, id);
      const windows = visibleAnswerWindows(schedule);
      assert.equal(windows.length, 1, id);
      const review = windows[0];
      assert.ok(review);
      assert.equal(review.kind, "review", id);
      assert.equal(review.openAt.toISOString(), schedule.answersOpenAt.toISOString(), id);
      assert.equal(review.closeAt.toISOString(), schedule.answersCloseAt.toISOString(), id);

      const duringTake = new Date(schedule.takeLockAt.getTime() - 60_000);
      if (isCanvasOnlyQuiz(id)) {
        // Q3–Q6 are taken in Canvas: the website never promises an answer week.
        for (const phase of ["submitted_waiting", "answers_open", "answers_closed"] as const) {
          assert.deepEqual(
            answerWindowCopy(schedule, phase, review.openAt).paragraphs,
            [CANVAS_ONLY_QUIZ_SENTENCE],
            `${id} ${phase}`,
          );
        }
      } else {
      const waiting = answerWindowCopy(schedule, "submitted_waiting", duringTake);
      const openCopy = answerWindowCopy(schedule, "answers_open", review.openAt);
      const closedCopy = answerWindowCopy(schedule, "answers_closed", review.closeAt);
      assert.deepEqual(waiting.paragraphs, paragraphsFromWindows(schedule, "submitted_waiting"), id);
      assert.deepEqual(openCopy.paragraphs, paragraphsFromWindows(schedule, "answers_open"), id);
      assert.deepEqual(closedCopy.paragraphs, paragraphsFromWindows(schedule, "answers_closed"), id);
      const text = [...waiting.paragraphs, ...openCopy.paragraphs, ...closedCopy.paragraphs].join(" ");
      assert.doesNotMatch(text, reopenCopy, id);
      assert.equal(waiting.paragraphs.length, 1, id);
      assert.equal(openCopy.paragraphs.length, 1, id);
      assert.equal(closedCopy.paragraphs.length, 1, id);
      }

      assert.equal(getAnswerRevealPhase(schedule, duringTake, true), "submitted_waiting", id);
      assert.equal(getAnswerRevealPhase(schedule, review.openAt, true), "answers_open", id);
      assert.equal(
        getAnswerRevealPhase(schedule, new Date(review.closeAt.getTime() - 1), true),
        "answers_open",
        id,
      );
      assert.equal(getAnswerRevealPhase(schedule, review.closeAt, true), "answers_closed", id);
      assert.equal(
        getAnswerRevealPhase(schedule, addEasternDays(review.closeAt, 7), true),
        "answers_closed",
        id,
      );
    }
  });
});
