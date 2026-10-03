import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { sections } from "./sections.ts";
import {
  deadlines,
  deadlinesNote,
  formatQuizDeadlineLabel,
  formatSharedQuizDeadlineDate,
  quizHolidayAnnouncements,
  quizLectureMeetingDayNote,
  quizMeetingTba,
} from "./deadlines.ts";

const deadlinesTable = readFileSync(
  new URL("../components/DeadlinesTable.tsx", import.meta.url),
  "utf8",
);
const agendaTable = readFileSync(
  new URL("../components/AgendaTable.tsx", import.meta.url),
  "utf8",
);
const calendarPage = readFileSync(
  new URL("../../calendar/page.tsx", import.meta.url),
  "utf8",
);
const academicCalendar = readFileSync(
  new URL("../components/AcademicCalendar.tsx", import.meta.url),
  "utf8",
);

describe("quiz lecture meeting-day copy", () => {
  it("splits in-person end of lecture from the online Monday–Sunday window", () => {
    assert.match(
      quizLectureMeetingDayNote,
      /at the end of their own lecture that week: CS 5610-02 on Monday, CS 4550 on Wednesday/,
    );
    assert.doesNotMatch(quizLectureMeetingDayNote, /labeled “today”/);
    assert.doesNotMatch(quizLectureMeetingDayNote, /not any weekday that week/);
    assert.match(quizLectureMeetingDayNote, /attendance is not required/);
    assert.match(
      quizLectureMeetingDayNote,
      /Monday 12:00am ET through Sunday 11:59pm ET/,
    );
    assert.match(
      quizLectureMeetingDayNote,
      /Q1 is the week of Sep 28 \(2026-09-28 through 2026-10-04 ET\)/,
    );
    assert.match(
      quizLectureMeetingDayNote,
      /CS 5610-02: Q2 time to be announced \(no class Mon Oct 12\)/,
    );
    assert.match(
      quizLectureMeetingDayNote,
      /CS 4550: Q4 time to be announced \(no class Wed Nov 11\)/,
    );
    assert.match(
      quizLectureMeetingDayNote,
      /CS 4550: Q5 time to be announced \(no class Wed Nov 25\)/,
    );
    assert.doesNotMatch(quizLectureMeetingDayNote, /Tue Sep 29/);
    assert.doesNotMatch(
      quizLectureMeetingDayNote,
      /CS 5610-09 Tuesdays 6:00–9:00pm ET/,
    );
    assert.equal(
      quizLectureMeetingDayNote.split("end of their own lecture").length,
      2,
    );
    assert.equal(deadlinesNote.includes(quizLectureMeetingDayNote), true);
    assert.match(
      deadlinesNote,
      /Quizzes \(Q1–Q6\) are the week after each chapter’s assignment is due/,
    );
    assert.doesNotMatch(quizLectureMeetingDayNote, /less runway/i);
    assert.doesNotMatch(quizLectureMeetingDayNote, /do not slide/i);
    assert.doesNotMatch(quizLectureMeetingDayNote, /section starts later/i);
  });

  it("labels shared, in-person, and online quiz weeks differently", () => {
    assert.equal(
      formatQuizDeadlineLabel("2026-09-28"),
      "Week of Sep 28 · in person: end of lecture; online: Mon–Sun",
    );
    assert.equal(
      formatQuizDeadlineLabel("2026-09-28", "in-person"),
      "Week of Sep 28 · end of lecture",
    );
    assert.equal(
      formatQuizDeadlineLabel("2026-09-28", "online"),
      "Week of Sep 28 · open Monday–Sunday",
    );
    assert.equal(
      formatQuizDeadlineLabel("2026-10-12", "online"),
      "Week of Oct 12 · open Monday–Sunday",
    );
    assert.equal(
      formatQuizDeadlineLabel("2026-10-12", "in-person"),
      "Week of Oct 12 · end of lecture",
    );
    const q2 = deadlines.find((deadline) => deadline.label.startsWith("Q2 "));
    assert.ok(q2);
    assert.equal(
      formatSharedQuizDeadlineDate(q2),
      "Week of Oct 12 · in person: end of lecture; online: Mon–Sun. CS 5610-02: Q2 time to be announced (no class Mon Oct 12)",
    );
    const q4 = deadlines.find((deadline) => deadline.label.startsWith("Q4 "));
    const q5 = deadlines.find((deadline) => deadline.label.startsWith("Q5 "));
    assert.ok(q4);
    assert.ok(q5);
    assert.match(
      formatSharedQuizDeadlineDate(q4),
      /CS 4550: Q4 time to be announced \(no class Wed Nov 11\)/,
    );
    assert.match(
      formatSharedQuizDeadlineDate(q5),
      /CS 4550: Q5 time to be announced \(no class Wed Nov 25\)/,
    );
    const quizDates = deadlines
      .filter((deadline) => deadline.kind === "quiz")
      .map((deadline) => deadline.date);
    assert.deepEqual(quizDates, [
      "2026-09-28",
      "2026-10-12",
      "2026-10-26",
      "2026-11-09",
      "2026-11-23",
      "2026-12-07",
    ]);
  });

  it("uses the shared meeting-day label on Shared deadlines and agenda quiz rows", () => {
    assert.match(deadlinesTable, /formatSharedQuizDeadlineDate/);
    assert.match(agendaTable, /quizMeetingTba/);
    assert.doesNotMatch(agendaTable, /\btabs\b/);
    assert.match(agendaTable, /formatQuizDeadlineLabel\(row\.date, section\.modality\)/);
    assert.match(agendaTable, /quizLectureMeetingDayNote/);
    assert.match(agendaTable, /deadline\.kind === "quiz"/);
    assert.match(calendarPage, /quizLectureMeetingDayNote/);
    assert.match(calendarPage, /quizWeekOfLabel\("q1"\)/);
    assert.doesNotMatch(calendarPage, /week of Sep 21/);
    assert.doesNotMatch(calendarPage, /week of Sep 28/);
    assert.match(academicCalendar, /quizLectureMeetingDayNote/);
    assert.match(academicCalendar, /quizWeekOfLabel\("q1"\)/);
    assert.doesNotMatch(academicCalendar, /week of Sep 21/);
    assert.doesNotMatch(academicCalendar, /week of Sep 28/);
  });

  it("announces TBA when an in-person quiz meeting is a no-class day", () => {
    const expected = [
      "CS 4550: Q4 time to be announced (no class Wed Nov 11)",
      "CS 4550: Q5 time to be announced (no class Wed Nov 25)",
      "CS 5610-02: Q2 time to be announced (no class Mon Oct 12)",
    ];
    const found: string[] = [];
    for (const section of sections) {
      for (const quiz of deadlines.filter((deadline) => deadline.kind === "quiz")) {
        const tba = quizMeetingTba(section, quiz);
        if (tba) found.push(tba);
      }
    }
    assert.deepEqual(found, expected);
    const q1 = deadlines.find((deadline) => deadline.label.startsWith("Q1 "));
    assert.ok(q1);
    assert.deepEqual(quizHolidayAnnouncements(q1), []);
    const online = sections.find((section) => section.id === "cs5610-09");
    assert.ok(online);
    for (const quiz of deadlines.filter((deadline) => deadline.kind === "quiz")) {
      assert.equal(quizMeetingTba(online, quiz), undefined);
    }
  });
});
