import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { deadlines, deadlinesNote } from "./deadlines.ts";
import { formatWeekOf } from "./dates.ts";

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

describe("quiz week labels", () => {
  const quizCopy = [
    deadlinesNote,
    ...deadlines
      .filter((deadline) => deadline.kind === "quiz")
      .map((deadline) => deadline.label),
    agendaTable,
    calendarPage,
    academicCalendar,
  ].join("\n");

  it("names each quiz as that week and nothing about how it is taken", () => {
    assert.equal(
      deadlines.find((deadline) => deadline.label.startsWith("Q2 "))?.label,
      "Q2 — CSS & Tailwind · week of Oct 12",
    );
    for (const deadline of deadlines.filter((item) => item.kind === "quiz")) {
      assert.ok(deadline.date);
      const week = formatWeekOf(deadline.date).replace(/^Week of /, "week of ");
      assert.match(deadline.label, new RegExp(` · ${week.replace(/[.]/g, "\\.")}$`));
      assert.doesNotMatch(deadline.label, /end of lecture|Monday|Sunday|in person|online|to be announced/i);
    }
    assert.match(
      deadlinesNote,
      /Quizzes \(Q1–Q6\) are the week after each chapter’s assignment is due/,
    );
    assert.doesNotMatch(quizCopy, /time to be announced/);
    assert.doesNotMatch(quizCopy, /end of lecture/i);
    assert.doesNotMatch(quizCopy, /Monday through Sunday/);
    assert.doesNotMatch(quizCopy, /open Monday/);
    assert.doesNotMatch(quizCopy, /quizLectureMeetingDayNote/);
    assert.doesNotMatch(quizCopy, /quizMeetingTba/);
    assert.doesNotMatch(deadlinesNote, /less runway/i);
    assert.doesNotMatch(deadlinesNote, /do not slide/i);
    assert.doesNotMatch(deadlinesNote, /section starts later/i);
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

  it("keeps quiz weeks on the calendar without a meeting-day note or tabs", () => {
    assert.match(deadlinesTable, /formatWeekOf\(deadline\.date\)/);
    assert.doesNotMatch(agendaTable, /\btabs\b/);
    assert.doesNotMatch(agendaTable, /section buttons/);
    assert.match(calendarPage, /quizWeekOfLabel\("q1"\)/);
    assert.doesNotMatch(calendarPage, /week of Sep 21/);
    assert.match(academicCalendar, /quizWeekOfLabel\("q1"\)/);
    assert.doesNotMatch(academicCalendar, /week of Sep 21/);
  });
});
