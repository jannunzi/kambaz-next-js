import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COURSE_EXAMS,
  addEasternDays,
  answerWindowCopy,
  canRevealAnswers,
  clampedExamPrepWindow,
  easternIsoDate,
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
    assert.equal(q1.answersOpenAt.toISOString(), et(2026, 10, 12).toISOString());
    assert.equal(q1.answersCloseAt.toISOString(), et(2026, 10, 19).toISOString());
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

  /**
   * Jose's one-week-after-close rule reveals a quiz's answers while the next
   * quiz (or X1, the same week as Q3) is still open. Kept as todos so the
   * suite stays green until he decides whether that leak is acceptable.
   */
  const answerRuleOverlaps = [
    ["q1", "q2"],
    ["q2", "q3"],
    ["q2", "x1"],
    ["q3", "q4"],
    ["q4", "q5"],
    ["q5", "q6"],
  ] as const;

  function isAnswerRuleOverlap(hit: Overlap): boolean {
    return (
      hit.kind === "first-answer" &&
      answerRuleOverlaps.some(
        ([revealQuiz, takeQuiz]) =>
          hit.revealQuiz === revealQuiz && hit.takeQuiz === takeQuiz,
      )
    );
  }

  it("does not overlap any take window except the one-week-after-close cases", () => {
    const hits = collectOverlaps();
    const known = hits.filter(isAnswerRuleOverlap);
    const unexpected = hits.filter((hit) => !isAnswerRuleOverlap(hit));
    assert.equal(known.length, answerRuleOverlaps.length * sections.length);
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

  it.todo(
    "Q1 answers Mon Oct 12–Mon Oct 19 overlap Q2 take (week of Oct 12): Jose's one-week-after-close rule",
  );
  it.todo(
    "Q2 answers Mon Oct 26–Mon Nov 2 overlap Q3 and X1 take (week of Oct 26): Jose's one-week-after-close rule",
  );
  it.todo(
    "Q3 answers Mon Nov 9–Mon Nov 16 overlap Q4 take (week of Nov 9): Jose's one-week-after-close rule",
  );
  it.todo(
    "Q4 answers Mon Nov 23–Mon Nov 30 overlap Q5 take (week of Nov 23): Jose's one-week-after-close rule",
  );
  it.todo(
    "Q5 answers Mon Dec 7–Mon Dec 14 overlap Q6 take (week of Dec 7): Jose's one-week-after-close rule",
  );
});

describe("Q1–Q6 first answer windows", () => {
  function midnightOf(date: Date): Date {
    const [year, month, day] = easternIsoDate(date).split("-").map(Number);
    return et(year!, month!, day!);
  }

  it("opens on the Monday one week after the Monday following the lock, for 7 days", () => {
    const expected: Record<string, [Date, Date]> = {
      q1: [et(2026, 10, 12), et(2026, 10, 19)],
      q2: [et(2026, 10, 26), et(2026, 11, 2)],
      q3: [et(2026, 11, 9), et(2026, 11, 16)],
      q4: [et(2026, 11, 23), et(2026, 11, 30)],
      q5: [et(2026, 12, 7), et(2026, 12, 14)],
      q6: [et(2026, 12, 21), et(2026, 12, 28)],
    };
    const take: Record<string, [Date, Date]> = {
      q1: [et(2026, 9, 28), et(2026, 10, 4, 23, 59)],
      q2: [et(2026, 10, 12), et(2026, 10, 18, 23, 59)],
      q3: [et(2026, 10, 26), et(2026, 11, 1, 23, 59)],
      q4: [et(2026, 11, 9), et(2026, 11, 15, 23, 59)],
      q5: [et(2026, 11, 23), et(2026, 11, 29, 23, 59)],
      q6: [et(2026, 12, 7), et(2026, 12, 13, 23, 59)],
    };
    for (const quizId of Object.keys(expected)) {
      const schedule = getQuizSchedule(quizId);
      assert.ok(schedule, quizId);
      const mondayFollowing = addEasternDays(midnightOf(schedule.takeLockAt), 1);
      const open = addEasternDays(mondayFollowing, 7);
      const close = addEasternDays(open, 7);
      assert.equal(schedule.answersOpenAt.toISOString(), open.toISOString(), quizId);
      assert.equal(schedule.answersCloseAt.toISOString(), close.toISOString(), quizId);
      assert.equal(schedule.answersOpenAt.toISOString(), expected[quizId]![0].toISOString(), quizId);
      assert.equal(schedule.answersCloseAt.toISOString(), expected[quizId]![1].toISOString(), quizId);
      assert.equal(schedule.takeUnlockAt.toISOString(), take[quizId]![0].toISOString(), quizId);
      assert.equal(schedule.takeLockAt.toISOString(), take[quizId]![1].toISOString(), quizId);
    }
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
    assert.equal(getAnswerRevealPhase("q3", et(2026, 11, 2), true), "submitted_waiting");
    assert.equal(canRevealAnswers(getAnswerRevealPhase("q3", et(2026, 11, 2), true)), false);
    assert.equal(getAnswerRevealPhase("q3", et(2026, 11, 5), true), "submitted_waiting");
    assert.equal(getAnswerRevealPhase("q3", et(2026, 11, 9), true), "answers_open");
    assert.equal(getAnswerRevealPhase("q3", et(2026, 11, 16), true), "answers_closed");
    const q3 = getQuizSchedule("q3");
    assert.ok(q3);
    assert.equal(q3.examPrepOpenAt.toISOString(), q3.examPrepCloseAt.toISOString());
  });

  it("does not reveal a quiz key before its own first answer window", () => {
    for (const schedule of listQuizSchedules()) {
      const justBefore = new Date(schedule.answersOpenAt.getTime() - 1);
      const phase = getAnswerRevealPhase(schedule, justBefore, true);
      assert.equal(canRevealAnswers(phase), false, schedule.quizId);
      assert.notEqual(phase, "answers_open", schedule.quizId);
      assert.notEqual(phase, "answers_reopen", schedule.quizId);
      if (schedule.examPrepOpenAt.getTime() < schedule.examPrepCloseAt.getTime()) {
        assert.ok(
          schedule.examPrepOpenAt.getTime() >= schedule.answersOpenAt.getTime(),
          `${schedule.quizId} review opens before its first answer window`,
        );
      }
    }
  });

  it("prefers the first answer window when it overlaps exam prep", () => {
    const q1 = getQuizSchedule("q1");
    assert.ok(q1);
    const overlapping = {
      ...q1,
      answersOpenAt: q1.examPrepOpenAt,
      answersCloseAt: q1.examPrepCloseAt,
    };
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

  it("mentions the one-week-after-close window and the Q1–Q2 review while waiting", () => {
    const copy = answerWindowCopy(q1, "submitted_waiting", et(2026, 10, 4, 12));
    const text = copy.paragraphs.join(" ");
    assert.match(copy.title, /not open yet/i);
    assert.match(text, /one week after this quiz closes/);
    assert.match(text, /for one week/);
    assert.match(text, /Q1–Q2 answers reopen for review/);
    assert.doesNotMatch(text, /Q1–Q3/);
    assert.doesNotMatch(text, /before the midterm/i);
    assert.ok(text.includes(formatEasternDateTime(q1.answersOpenAt)));
    assert.ok(text.includes(formatEasternDateTime(q1.answersCloseAt)));
    assert.ok(text.includes(formatEasternDateTime(q1.examPrepOpenAt)));
    assert.ok(text.includes(formatEasternDateTime(q1.examPrepCloseAt)));
  });

  it("says answers are available for one week during the first window", () => {
    const copy = answerWindowCopy(q1, "answers_open", et(2026, 10, 13));
    const text = copy.paragraphs.join(" ");
    assert.match(text, /for one week/);
    assert.match(text, /one week after the quiz closed/);
    assert.match(text, /Q1–Q2 answers reopen for review/);
    assert.doesNotMatch(text, /before the midterm/i);
    assert.ok(text.includes(formatEasternDateTime(q1.answersCloseAt)));
  });

  it("points at the Q1–Q2 review after the first week closes", () => {
    const copy = answerWindowCopy(q1, "answers_closed", et(2026, 10, 20));
    const text = copy.paragraphs.join(" ");
    assert.match(copy.title, /ended/i);
    assert.match(text, /Q1–Q2 answers reopen for review/);
    assert.doesNotMatch(text, /before the midterm/i);
    assert.doesNotMatch(text, /midterm prep/i);
  });

  it("hides the Q1–Q2 review sentence once Nov 5 has passed", () => {
    const copy = answerWindowCopy(q1, "answers_closed", et(2026, 11, 5));
    const text = copy.paragraphs.join(" ");
    assert.match(copy.title, /ended/i);
    assert.doesNotMatch(text, /reopen for review/);
    assert.doesNotMatch(text, /November 2/);
  });

  it("describes the Q1–Q2 review without calling it before the midterm", () => {
    const copy = answerWindowCopy(q1, "answers_reopen", et(2026, 11, 3));
    const text = `${copy.title} ${copy.paragraphs.join(" ")}`;
    assert.match(text, /Q1–Q2 answers reopen for review/);
    assert.doesNotMatch(text, /before the midterm/i);
    assert.doesNotMatch(text, /prep window/i);
  });

  it("tells Q3 its answers open Nov 9 and does not mention a Nov 2 reopen", () => {
    const q3 = getQuizSchedule("q3");
    assert.ok(q3);
    const waiting = answerWindowCopy(q3, "submitted_waiting", et(2026, 11, 2));
    assert.match(waiting.paragraphs.join(" "), /November 9/);
    for (const phase of ["submitted_waiting", "answers_open", "answers_closed", "answers_reopen"] as const) {
      const copy = answerWindowCopy(q3, phase, et(2026, 11, 2));
      const text = `${copy.title} ${copy.paragraphs.join(" ")}`;
      assert.doesNotMatch(text, /November 2/);
      assert.doesNotMatch(text, /reopen for review/);
    }
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
