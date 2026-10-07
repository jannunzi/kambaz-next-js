import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assignmentsIntro } from "@/app/syllabus/data/assignments";
import { deadlines, deadlinesNote } from "@/app/syllabus/data/deadlines";
import { isoWeekday, weekdayName } from "@/app/syllabus/data/dates";
import { evaluationItems, evaluationNotes } from "@/app/syllabus/data/evaluation";
import { projectBlurb } from "@/app/syllabus/data/project";
import { sections } from "@/app/syllabus/data/sections";
import { etWallTimeToUtc, getQuizSchedule } from "./schedule";

const CANVAS_ASSIGNMENT_DUES: Record<string, string> = {
  A1: "2026-09-27",
  A2: "2026-10-11",
  A3: "2026-10-25",
};

const QUIZ_WINDOWS: Record<string, { unlock: string; due: string }> = {
  Q1: { unlock: "2026-09-28", due: "2026-10-04" },
  Q2: { unlock: "2026-10-12", due: "2026-10-18" },
  Q3: { unlock: "2026-10-26", due: "2026-11-01" },
  Q4: { unlock: "2026-11-09", due: "2026-11-15" },
  Q5: { unlock: "2026-11-23", due: "2026-11-29" },
  Q6: { unlock: "2026-12-07", due: "2026-12-13" },
};

function easternIsoDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

describe("Fall 2026 Canvas calendar", () => {
  it("keeps assignment dues on the Canvas Sunday all_day_date", () => {
    for (const [id, due] of Object.entries(CANVAS_ASSIGNMENT_DUES)) {
      const row = deadlines.find(
        (deadline) =>
          deadline.kind === "assignment" && deadline.label.includes(`${id} due`),
      );
      assert.ok(row, `${id} due is missing from syllabus deadlines`);
      assert.equal(row.date, due);
    }
    for (const id of ["A4", "A5", "A6"]) {
      assert.equal(
        deadlines.some(
          (deadline) =>
            deadline.kind === "assignment" && deadline.label.includes(`${id} due`),
        ),
        false,
        `${id} Sunday due should stay unset until Canvas is settled`,
      );
    }
  });

  it("keeps exam and project dates on the published syllabus days", () => {
    const x1 = deadlines.find(
      (deadline) => deadline.kind === "exam" && deadline.label.startsWith("X1"),
    );
    const examWeek = deadlines.find(
      (deadline) =>
        deadline.kind === "exam" && deadline.label.includes("X2"),
    );
    const project = deadlines.find((deadline) => deadline.kind === "project");
    assert.equal(x1?.date, "2026-10-26");
    assert.equal(x1?.label, "X1 — Midterm (2nd half of lecture)");
    assert.doesNotMatch(x1?.label ?? "", /\bdue\b/i);
    assert.equal(examWeek?.date, "2026-12-20");
    assert.equal(examWeek?.label, "X2 due");
    assert.equal(project?.date, "2026-12-06");
    for (const row of deadlines) {
      assert.doesNotMatch(row.label, /\(unlock/i);
    }
  });

  it("labels quizzes as the week after each chapter, not Sunday dues", () => {
    const expected: Record<string, { label: string; date: string }> = {
      Q1: {
        label: "Q1 — HTML · week of Sep 28",
        date: "2026-09-28",
      },
      Q2: {
        label: "Q2 — CSS & Tailwind · week of Oct 12",
        date: "2026-10-12",
      },
      Q3: {
        label: "Q3 — JavaScript · week of Oct 26",
        date: "2026-10-26",
      },
      Q4: {
        label: "Q4 — Client state · week of Nov 9",
        date: "2026-11-09",
      },
      Q5: {
        label: "Q5 — REST APIs · week of Nov 23",
        date: "2026-11-23",
      },
      Q6: {
        label: "Q6 — MongoDB · week of Dec 7",
        date: "2026-12-07",
      },
    };
    const quizRows = deadlines.filter((deadline) => deadline.kind === "quiz");
    assert.equal(quizRows.length, 6);
    for (const [id, want] of Object.entries(expected)) {
      const row = quizRows.find((deadline) => deadline.label.startsWith(`${id} `));
      assert.ok(row, `${id} is missing from syllabus deadlines`);
      assert.equal(row.label, want.label);
      assert.equal(row.date, want.date);
      assert.match(row.label, /· week of /);
      assert.doesNotMatch(row.label, /end of lecture|in person|online|Monday|Sunday|to be announced/i);
      assert.doesNotMatch(row.label, /\bdue\b/i);
      assert.doesNotMatch(row.label, /unlock/i);
      assert.doesNotMatch(row.label, /Sunday/i);
    }
  });

  it("starts the shared deadlines calendar on 2026-09-14", () => {
    const dated = deadlines.filter((deadline) => deadline.date);
    assert.ok(dated[0]?.date);
    assert.ok(dated[0].date >= "2026-09-14");
    assert.equal(
      deadlines.find((deadline) => deadline.label.startsWith("A1 assigned"))
        ?.date,
      "2026-09-14",
    );
    assert.equal(
      deadlines.some((deadline) => deadline.date && deadline.date < "2026-09-14"),
      false,
    );
  });

  it("keeps website take windows in schedule.ts", () => {
    for (const [id, window] of Object.entries(QUIZ_WINDOWS)) {
      const schedule = getQuizSchedule(id.toLowerCase());
      assert.ok(schedule, `${id} is missing from quiz schedule`);
      const [uy, um, ud] = window.unlock.split("-").map(Number);
      const [dy, dm, dd] = window.due.split("-").map(Number);
      assert.equal(
        schedule.takeUnlockAt.toISOString(),
        etWallTimeToUtc(uy, um, ud).toISOString(),
      );
      assert.equal(
        schedule.takeLockAt.toISOString(),
        etWallTimeToUtc(dy, dm, dd, 23, 59).toISOString(),
      );
      assert.equal(easternIsoDate(schedule.takeUnlockAt), window.unlock);
      assert.equal(easternIsoDate(schedule.takeLockAt), window.due);
    }
  });

  it("keeps quiz and exam syllabus copy student-facing", () => {
    const quiz = evaluationItems.find((item) => item.label.includes("Q1"));
    const exams = evaluationItems.find((item) => item.label.includes("X1"));
    assert.ok(quiz);
    assert.ok(exams);
    assert.match(quiz.description, /end of lecture/i);
    assert.match(quiz.description, /open for the whole week/i);
    assert.match(quiz.description, /week after that chapter/i);
    assert.match(quiz.description, /Quizzes are taken in Canvas/);
    assert.doesNotMatch(quiz.description, /Quiz 1 and Quiz 2/);
    assert.doesNotMatch(quiz.description, /later quizzes are on/i);
    assert.doesNotMatch(quiz.description, /course website/i);
    assert.match(
      evaluationNotes.join(" "),
      /Graded quizzes are taken in Canvas/,
    );
    assert.doesNotMatch(evaluationNotes.join(" "), /Quiz 1 and Quiz 2/);
    assert.doesNotMatch(
      evaluationNotes.join(" "),
      /quiz[^.]*(on this course website|on the course site|fallback)/i,
    );
    assert.doesNotMatch(
      evaluationNotes.join(" "),
      /later quizzes are (taken )?on/i,
    );
    assert.doesNotMatch(quiz.description, /CS 4550|CS 5610/);
    assert.doesNotMatch(quiz.description, /Sep 28|2026-09-28|Oct 12|Nov 11|Nov 25/);
    assert.doesNotMatch(quiz.description, /Monday|Sunday|Wednesday/);
    assert.doesNotMatch(quiz.description, /original two weeks/);
    assert.doesNotMatch(quiz.description, /one-week shift/);
    assert.doesNotMatch(quiz.description, /time to be announced/);
    assert.match(quiz.description, /10 questions/);
    assert.doesNotMatch(quiz.description, /unlocks Monday/);
    assert.doesNotMatch(quiz.description, /locks Sunday/);
    assert.match(exams.description, /~90 minutes/);
    assert.match(exams.description, /second half of lecture/);
    assert.doesNotMatch(exams.description, /36 questions/);
    assert.doesNotMatch(exams.description, /unlock Monday 2026-10-26/);
    assert.doesNotMatch(exams.description, /due Sunday 2026-11-01/);
    assert.doesNotMatch(exams.description, /unlock Monday 2026-11-30/);
    assert.doesNotMatch(exams.description, /due Thursday 2026-12-03/);
    assert.doesNotMatch(exams.description, /due Sunday 2026-12-20/);

    const studentCopy = [
      quiz.description,
      exams.description,
      ...evaluationNotes,
      deadlinesNote,
      ...assignmentsIntro,
      ...projectBlurb.paragraphs,
      ...sections.flatMap((section) => section.notes),
    ].join(" ");
    assert.doesNotMatch(studentCopy, /grade shell/i);
    assert.doesNotMatch(studentCopy, /empty website-linked/i);
    assert.doesNotMatch(studentCopy, /website-linked quizzes/i);
    assert.doesNotMatch(studentCopy, /100 points each/i);
    assert.doesNotMatch(studentCopy, /exports? (that score )?to Canvas/i);
    assert.doesNotMatch(studentCopy, /less runway/i);
    assert.doesNotMatch(studentCopy, /do not slide/i);
    assert.doesNotMatch(studentCopy, /section starts later/i);
    assert.doesNotMatch(studentCopy, /chapter quizzes \(Q1–Q6\) are due Sunday/);
    assert.match(deadlinesNote, /Quizzes \(Q1–Q6\) are the week after each chapter’s assignment is due/);
    assert.doesNotMatch(deadlinesNote, /end of lecture/i);
    assert.doesNotMatch(deadlinesNote, /Monday through Sunday/);
    assert.doesNotMatch(deadlinesNote, /time to be announced/);
    assert.doesNotMatch(deadlinesNote, /CS 5610-02 on Monday/);
    assert.match(deadlinesNote, /X1 is taken in the second half of lecture the week of October 26/);
    assert.doesNotMatch(deadlinesNote, /X1 is due Sunday/);
    assert.doesNotMatch(deadlinesNote, /Quizzes \(Q1–Q6\) are due Sunday/);
    assert.match(studentCopy, /course website/i);
    assert.match(studentCopy, /staff-approved fallback/i);
    assert.match(studentCopy, /ask your instructor or TA before using it/i);
    assert.doesNotMatch(studentCopy, /prior written approval/i);
    assert.match(studentCopy, /up to 5 members/);
    assert.match(
      studentCopy,
      /do not need the instructor.s permission to form a team/,
    );
  });

  it("names X2’s weekday as Sunday to match 2026-12-20", () => {
    assert.equal(weekdayName(isoWeekday("2026-12-20")), "Sunday");
    const exams = evaluationItems.find((item) => item.label.includes("X1"));
    assert.ok(exams, "Exams (X1–X2) evaluation item is missing");
    assert.doesNotMatch(exams.description, /Thursday 2026-12-03/);
    assert.match(deadlinesNote, /X2 is due Sunday 11:59pm ET/);
    assert.doesNotMatch(deadlinesNote, /X2 is due Thursday/);
  });
});
