import {
  addEasternDays,
  easternIsoDate,
  formatEasternMonthDay,
  formatEasternWeekdayMonthDay,
  getQuizSchedule,
} from "@/lib/quiz-exam/schedule";
import { formatWeekOf } from "./dates";
import type { Deadline, IsoDate, SectionModality } from "./types";

/**
 * Shared calendar dates for every section. Do not shift assignment, exam, or
 * project dates per section.
 *
 * Assignment dues are Canvas Sunday 23:59 ET (`all_day_date`). Keep the
 * published A1–A3 Sundays. Do not invent A4–A6 Sunday dues — Jose is still
 * settling those with Canvas.
 *
 * Quizzes (Piazza Post 33) are the week after that chapter’s assignment is
 * due. The quiz `date` is the shared Monday of that week (the “Week of”
 * label). In-person sections take the quiz at the end of their meeting that
 * week. CS 5610-09 (online) has the quiz open Monday 00:00 ET through Sunday
 * 23:59 ET; attendance is not required. Website take windows in
 * `lib/quiz-exam/schedule.ts` are that Monday–Sunday window for every section.
 *
 * Q1’s week label comes from `quizWeekOfLabel("q1")` / the Q1 take
 * unlock in `lib/quiz-exam/schedule.ts` (the Monday after A1 due Sun Sep 27).
 * Q3 shares
 * the week of Oct 26 with X1; X1’s date is unchanged. X1 is the second half
 * of lecture that week. X2 is finals week (week of Dec 14) and locks Sunday
 * Dec 20. Project due is 2026-12-06; grading begins the week of Dec 7.
 */
export const deadlines: Deadline[] = [
  { date: "2026-09-14", kind: "assignment", label: "A1 assigned — HTML" },
  {
    date: "2026-09-27",
    kind: "assignment",
    label: "A1 due · A2 assigned — CSS & Tailwind",
  },
  {
    date: "2026-09-28",
    kind: "quiz",
    label: "Q1 — HTML (week after Chapter 1)",
  },
  {
    date: "2026-10-11",
    kind: "assignment",
    label: "A2 due · A3 assigned — JavaScript",
  },
  {
    date: "2026-10-12",
    kind: "quiz",
    label: "Q2 — CSS & Tailwind (week after Chapter 2)",
  },
  {
    date: "2026-10-25",
    kind: "assignment",
    label: "A3 due · A4 assigned — Client state",
  },
  {
    date: "2026-10-26",
    kind: "exam",
    label: "X1 — Midterm (2nd half of lecture)",
  },
  {
    date: "2026-10-26",
    kind: "quiz",
    label: "Q3 — JavaScript (week after Chapter 3)",
  },
  {
    date: "2026-11-09",
    kind: "quiz",
    label: "Q4 — Client state (week after Chapter 4)",
  },
  {
    date: "2026-11-23",
    kind: "quiz",
    label: "Q5 — REST APIs (week after Chapter 5)",
  },
  { date: "2026-12-06", kind: "project", label: "Project due" },
  {
    date: "2026-12-07",
    kind: "quiz",
    label: "Q6 — MongoDB (week after Chapter 6)",
  },
  {
    date: "2026-12-20",
    kind: "exam",
    label: "X2 due",
  },
];

function q1TakeWeek(): { monday: Date; wednesday: Date; sunday: Date } {
  const q1 = getQuizSchedule("q1");
  if (!q1) {
    throw new Error("Q1 schedule is missing");
  }
  return {
    monday: q1.takeUnlockAt,
    wednesday: addEasternDays(q1.takeUnlockAt, 2),
    sunday: q1.takeLockAt,
  };
}

/** "Sep 28", from Q1’s take unlock in schedule.ts. */
export function q1WeekOfLabel(): string {
  return formatEasternMonthDay(q1TakeWeek().monday);
}

/**
 * Student-facing quiz timing (Piazza Post 33, clarified in the course chat).
 * In-person: end of lecture on that section’s meeting day. Online: the quiz
 * is open Monday through Sunday; attendance is not required. Q1’s week and
 * online span come from schedule.ts.
 */
export const quizLectureMeetingDayNote = (() => {
  const { monday, wednesday, sunday } = q1TakeWeek();
  const weekOf = formatEasternMonthDay(monday);
  const mon = formatEasternWeekdayMonthDay(monday);
  const wed = formatEasternWeekdayMonthDay(wednesday);
  const sun = formatEasternWeekdayMonthDay(sunday);
  const span = `${easternIsoDate(monday)} through ${easternIsoDate(sunday)}`;
  return `In-person sections take each quiz at the end of lecture on your section’s own meeting that week — CS 5610-02 Mondays 6:00–9:00pm ET and CS 4550-01 Wednesdays 6:00–9:00pm ET — not a calendar day labeled “today,” and not any weekday that week. CS 5610-09 (online): attendance is not required. Each quiz is open the whole week, Monday 12:00am ET through Sunday 11:59pm ET. Q1 in the week of ${weekOf} is ${mon} at the end of lecture for CS 5610-02, ${wed} at the end of lecture for CS 4550, and open ${mon} through ${sun} (${span} ET) for CS 5610-09.`;
})();

/**
 * Shared deadlines Date label when no section is selected. Agenda rows pass
 * the section modality so online is not labeled “end of lecture”.
 */
export function formatQuizDeadlineLabel(
  iso: IsoDate,
  modality?: SectionModality,
): string {
  const week = formatWeekOf(iso);
  if (modality === "online") return `${week} · open Monday–Sunday`;
  if (modality === "in-person") return `${week} · end of lecture`;
  return `${week} · in person: end of lecture; online: Mon–Sun`;
}

export const deadlinesNote =
  `Assignment, exam, and project dates are one Canvas calendar for every section. Assignments are due Sunday 11:59pm ET. Quizzes (Q1–Q6) are the week after each chapter’s assignment is due. ${quizLectureMeetingDayNote} X1 is taken in the second half of lecture the week of October 26. The project is due Sunday, December 6; grading begins the week of December 7. X2 is due Sunday 11:59pm ET the week of December 14 (finals week). A4–A6 due dates will be posted on Canvas.`;
