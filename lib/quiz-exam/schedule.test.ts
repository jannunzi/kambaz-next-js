import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COURSE_EXAMS,
  answerWindowCopy,
  canRevealAnswers,
  clampedExamPrepWindow,
  etWallTimeToUtc,
  examPrepOpenAt,
  formatEasternCivilTimestamp,
  formatEasternDateTime,
  getAnswerRevealPhase,
  getQuizSchedule,
  isEasternDaylightTime,
  isScheduledTakeWindow,
  isTakeWindowOpen,
  listQuizSchedules,
  nthWeekdayOfMonth,
  quizWeekOfLabel,
} from "./schedule";
import { sections } from "@/app/syllabus/data/sections";

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
    const midtermPrep = clampedExamPrepWindow("midterm", midterm);
    assert.equal(midtermPrep.open.toISOString(), et(2026, 11, 2).toISOString());
    assert.equal(midtermPrep.close.toISOString(), et(2026, 11, 5).toISOString());
    const finalPrep = clampedExamPrepWindow("final", final);
    assert.equal(finalPrep.open.toISOString(), finalPrep.close.toISOString());
    assert.equal(finalPrep.close.toISOString(), et(2026, 12, 14).toISOString());
    assert.equal(quizWeekOfLabel("q1"), "Sep 28");
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

describe("answer keys stay closed through every section’s take window", () => {
  function overlapsTake(
    revealOpen: Date,
    revealClose: Date,
    takeUnlock: Date,
    takeLock: Date,
  ): boolean {
    if (revealOpen.getTime() >= revealClose.getTime()) return false;
    return (
      revealOpen.getTime() <= takeLock.getTime() &&
      revealClose.getTime() > takeUnlock.getTime()
    );
  }

  it("does not start a reveal before, or during, a take window it covers", () => {
    const groups = [
      ["q1", "q2", "q3"],
      ["q4", "q5", "q6"],
    ];
    assert.ok(sections.length >= 3);
    for (const group of groups) {
      const covered = group.map((quizId) => {
        const schedule = getQuizSchedule(quizId);
        assert.ok(schedule, quizId);
        return schedule;
      });
      const prepOpen = covered[0]!.examPrepOpenAt;
      const prepClose = covered[0]!.examPrepCloseAt;
      for (const schedule of covered) {
        for (const section of sections) {
          if (section.modality === "in-person") {
            const meetingOffset =
              section.daysOfWeek[0] === 0 ? 6 : section.daysOfWeek[0]! - 1;
            const lectureEnd = et(
              schedule.takeUnlockAt.getUTCFullYear(),
              schedule.takeUnlockAt.getUTCMonth() + 1,
              schedule.takeUnlockAt.getUTCDate() + meetingOffset,
              21,
            );
            assert.ok(
              lectureEnd.getTime() < schedule.takeLockAt.getTime(),
              `${section.id} lecture ends before the Sunday lock`,
            );
          }
          assert.equal(
            prepOpen.getTime() < schedule.takeUnlockAt.getTime(),
            false,
            `${section.id} ${schedule.quizId} exam prep starts before take`,
          );
          assert.equal(
            overlapsTake(
              prepOpen,
              prepClose,
              schedule.takeUnlockAt,
              schedule.takeLockAt,
            ),
            false,
            `${section.id} ${schedule.quizId} exam prep overlaps take`,
          );
        }
      }
    }

    for (const schedule of listQuizSchedules()) {
      for (const section of sections) {
        assert.equal(
          schedule.answersOpenAt.getTime() < schedule.takeUnlockAt.getTime(),
          false,
          `${section.id} ${schedule.quizId} first answers start before take`,
        );
        assert.equal(
          overlapsTake(
            schedule.answersOpenAt,
            schedule.answersCloseAt,
            schedule.takeUnlockAt,
            schedule.takeLockAt,
          ),
          false,
          `${section.id} ${schedule.quizId} first answers overlap take`,
        );
      }
    }
  });
});

describe("reveal windows vs every quiz and exam take window", () => {
  function overlapsTake(
    revealOpen: Date,
    revealClose: Date,
    takeUnlock: Date,
    takeLock: Date,
  ): boolean {
    if (revealOpen.getTime() >= revealClose.getTime()) return false;
    return (
      revealOpen.getTime() <= takeLock.getTime() &&
      revealClose.getTime() > takeUnlock.getTime()
    );
  }

  type Overlap = {
    sectionId: string;
    revealQuiz: string;
    kind: "first-answer" | "exam-prep";
    takeQuiz: string;
    reveal: string;
    take: string;
  };

  function collectOverlaps(): Overlap[] {
    const schedules = listQuizSchedules();
    const hits: Overlap[] = [];
    for (const section of sections) {
      for (const reveal of schedules) {
        const windows: Array<{
          kind: Overlap["kind"];
          open: Date;
          close: Date;
        }> = [
          {
            kind: "first-answer",
            open: reveal.answersOpenAt,
            close: reveal.answersCloseAt,
          },
          {
            kind: "exam-prep",
            open: reveal.examPrepOpenAt,
            close: reveal.examPrepCloseAt,
          },
        ];
        for (const window of windows) {
          for (const take of schedules) {
            if (
              !overlapsTake(
                window.open,
                window.close,
                take.takeUnlockAt,
                take.takeLockAt,
              )
            ) {
              continue;
            }
            hits.push({
              sectionId: section.id,
              revealQuiz: reveal.quizId,
              kind: window.kind,
              takeQuiz: take.quizId,
              reveal: `${formatEasternCivilTimestamp(window.open)} – ${formatEasternCivilTimestamp(window.close)}`,
              take: `${formatEasternCivilTimestamp(take.takeUnlockAt)} – ${formatEasternCivilTimestamp(take.takeLockAt)}`,
            });
          }
        }
      }
    }
    return hits;
  }

  /** Q3 answers Mon Nov 9–Mon Nov 16 overlap Q4’s take week. Jose has not moved that window. */
  function isPendingQ3AnswerTiming(hit: Overlap): boolean {
    return (
      hit.revealQuiz === "q3" &&
      hit.kind === "first-answer" &&
      hit.takeQuiz === "q4"
    );
  }

  it("does not overlap any take window except the pending Q3 answer case", () => {
    const hits = collectOverlaps();
    const known = hits.filter(isPendingQ3AnswerTiming);
    const unexpected = hits.filter((hit) => !isPendingQ3AnswerTiming(hit));
    assert.equal(
      known.length,
      sections.length,
      "Q3’s first-answer window should overlap Q4’s take once per section until Jose decides",
    );
    assert.deepEqual(
      unexpected,
      [],
      unexpected
        .map(
          (hit) =>
            `${hit.sectionId}: ${hit.revealQuiz} ${hit.kind} (${hit.reveal}) overlaps ${hit.takeQuiz} take (${hit.take})`,
        )
        .join("\n"),
    );
  });

  it.todo("pending Jose decision on Q3 answer timing");
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

  it("reopens Q1 only after Q3 has locked, and closes at midtermAt", () => {
    assert.equal(
      getAnswerRevealPhase("q1", et(2026, 10, 30, 12), true),
      "answers_closed",
    );
    assert.equal(
      getAnswerRevealPhase("q1", et(2026, 11, 1, 23, 59), true),
      "answers_closed",
    );
    assert.equal(getAnswerRevealPhase("q1", et(2026, 11, 2), true), "answers_reopen");
    const lastPrep = new Date(q1.examPrepCloseAt.getTime() - 1);
    assert.equal(getAnswerRevealPhase(q1, lastPrep, true), "answers_reopen");
    assert.equal(
      getAnswerRevealPhase("q1", q1.examPrepCloseAt, true),
      "answers_closed",
    );
    assert.equal(canRevealAnswers("answers_reopen"), true);
    assert.equal(canRevealAnswers(getAnswerRevealPhase("q1", et(2026, 10, 30, 12), true)), false);
  });

  it("does not reveal Q3 during its take week, including the QA instant", () => {
    assert.equal(
      getAnswerRevealPhase("q3", et(2026, 10, 30, 12), true),
      "submitted_waiting",
    );
    assert.equal(
      canRevealAnswers(getAnswerRevealPhase("q3", et(2026, 10, 30, 12), true)),
      false,
    );
    assert.equal(getAnswerRevealPhase("q3", et(2026, 11, 1, 23, 59), true), "submitted_waiting");
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

  it("does not reopen Q4–Q6 while Q6 is still open", () => {
    const q4 = getQuizSchedule("q4");
    const q6 = getQuizSchedule("q6");
    assert.ok(q4);
    assert.ok(q6);
    assert.equal(q4.examName, "final");
    assert.equal(q4.examPrepOpenAt.toISOString(), q4.examPrepCloseAt.toISOString());
    assert.equal(q6.examPrepOpenAt.toISOString(), q6.examPrepCloseAt.toISOString());
    assert.equal(getAnswerRevealPhase("q4", et(2026, 12, 6, 23, 59), true), "answers_closed");
    assert.equal(getAnswerRevealPhase("q4", et(2026, 12, 7), true), "answers_closed");
    assert.equal(getAnswerRevealPhase("q6", et(2026, 12, 8), true), "submitted_waiting");
    assert.equal(getAnswerRevealPhase("q6", et(2026, 12, 10), true), "submitted_waiting");
    assert.equal(canRevealAnswers(getAnswerRevealPhase("q6", et(2026, 12, 8), true)), false);
    assert.equal(canRevealAnswers(getAnswerRevealPhase("q6", et(2026, 12, 10), true)), false);
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

  it("does not promise a review before the final for Q4–Q6", () => {
    const policy =
      /Q4 and Q5 answers are available in their normal windows, and Q6 answers open after X2/;
    for (const quizId of ["q4", "q5", "q6"] as const) {
      const schedule = getQuizSchedule(quizId);
      assert.ok(schedule);
      for (const phase of ["submitted_waiting", "answers_open", "answers_closed", "answers_reopen"] as const) {
        const copy = answerWindowCopy(schedule, phase, et(2026, 11, 28));
        const text = `${copy.title} ${copy.paragraphs.join(" ")}`;
        assert.match(text, policy);
        assert.doesNotMatch(text, /before the final/i);
        assert.doesNotMatch(text, /prep window before/i);
        assert.doesNotMatch(text, /one week before/i);
      }
    }
    const x2 = getQuizSchedule("x2");
    assert.ok(x2);
    const x2Copy = answerWindowCopy(x2, "submitted_waiting", et(2026, 12, 21));
    assert.doesNotMatch(x2Copy.paragraphs.join(" "), policy);
  });
});
