import { formatWeekOf } from "./dates";
import type { Deadline, IsoDate } from "./types";

/**
 * Shared calendar dates for every section. Do not shift assignment, exam, or
 * project dates per section.
 *
 * Assignment dues are Canvas Sunday 23:59 ET (`all_day_date`). Keep the
 * published A1–A3 Sundays. Do not invent A4–A6 Sunday dues — Jose is still
 * settling those with Canvas.
 *
 * Quizzes (Piazza Post 33) are the week after that chapter’s assignment is
 * due. The quiz `date` is the shared Monday of that week. Student-facing
 * calendar and schedule entries name that week only. How a quiz is taken
 * (in person at the end of lecture, online open for the whole week) is
 * stated once on the Evaluation Quizzes row.
 *
 * Q1 is the week of Sep 28 (the Monday after A1 due Sun Sep 27). Q3 shares
 * the week of Oct 26 with X1; X1’s date is unchanged. X1 is the second half
 * of lecture that week. X2 is finals week (week of Dec 14) and locks Sunday
 * Dec 20. Project due is 2026-12-06; grading begins the week of Dec 7.
 */

function quizLabel(title: string, date: IsoDate): string {
  const week = formatWeekOf(date).replace(/^Week of /, "week of ");
  return `${title} · ${week}`;
}

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
    label: quizLabel("Q1 — HTML", "2026-09-28"),
  },
  {
    date: "2026-10-11",
    kind: "assignment",
    label: "A2 due · A3 assigned — JavaScript",
  },
  {
    date: "2026-10-12",
    kind: "quiz",
    label: quizLabel("Q2 — CSS & Tailwind", "2026-10-12"),
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
    label: quizLabel("Q3 — JavaScript", "2026-10-26"),
  },
  {
    date: "2026-11-09",
    kind: "quiz",
    label: quizLabel("Q4 — Client state", "2026-11-09"),
  },
  {
    date: "2026-11-23",
    kind: "quiz",
    label: quizLabel("Q5 — REST APIs", "2026-11-23"),
  },
  { date: "2026-12-06", kind: "project", label: "Project due" },
  {
    date: "2026-12-07",
    kind: "quiz",
    label: quizLabel("Q6 — MongoDB", "2026-12-07"),
  },
  {
    date: "2026-12-20",
    kind: "exam",
    label: "X2 due",
  },
];

export const deadlinesNote =
  "Assignment, exam, and project dates are one Canvas calendar for every section. Assignments are due Sunday 11:59pm ET. Quizzes (Q1–Q6) are the week after each chapter’s assignment is due. X1 is taken in the second half of lecture the week of October 26. The project is due Sunday, December 6; grading begins the week of December 7. X2 is due Sunday 11:59pm ET the week of December 14 (finals week). A4–A6 due dates will be posted on Canvas.";
