import {
  easternIsoDate,
  getQuizSchedule,
  quizWeekOfLabel,
} from "@/lib/quiz-exam/schedule";
import { CS5610_02_Q2_TBA } from "./deadlines";
import type { EvaluationItem, GradeBand } from "./types";

function q1OnlineSpan(): string {
  const q1 = getQuizSchedule("q1");
  if (!q1) {
    throw new Error("Q1 schedule is missing");
  }
  return `${easternIsoDate(q1.takeUnlockAt)} through ${easternIsoDate(q1.takeLockAt)}`;
}

export const evaluationItems: EvaluationItem[] = [
  {
    label: "Assignments (A1–A6)",
    weight: 30,
    description:
      "Six incremental implementations of Kambaz, one per book chapter. Each assignment is submitted as a GitHub repository and a deployed Vercel URL.",
  },
  {
    label: "Quizzes (Q1–Q6)",
    weight: 10,
    description:
      `Short checks on this course website (~10 questions, about 30 minutes). Each quiz is the week after that chapter’s assignment is due. In-person sections take it at the end of lecture that week (CS 5610-02 Mondays, CS 4550 Wednesdays). ${CS5610_02_Q2_TBA}. CS 5610-09 (online) has the quiz open Monday through Sunday of that week; attendance is not required. Q1 is the week of ${quizWeekOfLabel("q1")} (online: ${q1OnlineSpan()}), not the end of Chapter 1’s original two weeks (Sep 14 and Sep 21). Q2 through Q6 follow the same one-week shift. Canvas is a staff-approved fallback if the site is unavailable — ask your instructor or TA before using it.`,
  },
  {
    label: "Exams (X1–X2)",
    weight: 30,
    description:
      "X1 is taken in the second half of lecture the week after A3. X2 is exam week. Each exam is ~90 minutes.",
  },
  {
    label: "Project",
    weight: 30,
    description:
      "A completed, deployed full-stack application (usually polished Kambaz) with public source and a short written design note.",
  },
];

export const gradeBands: GradeBand[] = [
  { letter: "A", minimum: 93 },
  { letter: "A−", minimum: 90 },
  { letter: "B+", minimum: 87 },
  { letter: "B", minimum: 83 },
  { letter: "B−", minimum: 80 },
  { letter: "C+", minimum: 77 },
  { letter: "C", minimum: 73 },
  { letter: "C−", minimum: 70 },
  { letter: "D+", minimum: 67 },
  { letter: "D", minimum: 63 },
  { letter: "D−", minimum: 60 },
  { letter: "F", minimum: 0 },
];

export const evaluationNotes = [
  "Weights sum to 100%. The category weights above are what enter the final average.",
  "Graded quizzes and exams are taken online on this course website. Canvas is a staff-approved fallback if the site is unavailable — ask your instructor or TA before using it.",
  "You must submit every assignment and the project to be eligible for a passing grade, even if a late penalty applies.",
];
