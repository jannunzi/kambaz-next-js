import type { Metadata } from "next";
import Link from "next/link";
import StaffOnly from "../components/StaffOnly";
import {
  listExamBanks,
  quizDrawCount,
  quizTimeLimitMinutes,
  STUDENT_COPY,
} from "@/lib/quiz-exam";
import {
  CANVAS_ONLY_QUIZ_SENTENCE,
  getQuizSchedule,
  isCanvasOnlyQuiz,
  quizWeekOfLabel,
  syllabusTakeWindowSentence,
} from "@/lib/quiz-exam/schedule";
import QuizAccessOverrides from "./components/QuizAccessOverrides";
import StaffAttemptsLink from "../staff/components/StaffAttemptsLink";

export const metadata: Metadata = {
  title: "Graded quizzes — CS 4550 / CS 5610",
};

export default function TakeQuizIndexPage() {
  const exams = listExamBanks();

  return (
    <article>
      <p className="mb-4 text-sm">
        <StaffOnly>
          <Link href="/quizzes">Question banks</Link>
          {" · "}
          <Link href="/quizzes/staff">Staff attempts</Link>
          {" · "}
        </StaffOnly>
        <Link href="/book">Course book</Link>
        {" · "}
        <Link href="/blog">Blog</Link>
        {" · "}
        <Link href="/assignments">Assignments</Link>
        {" · "}
        <Link href="/slides">Slides</Link>
        {" · "}
        <Link href="/book/practice">Practice (ungraded)</Link>
      </p>
      <h1 className="mt-0 text-3xl font-semibold tracking-tight">
        Graded quizzes
      </h1>
      <p className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-sky-950">
        <strong>{CANVAS_ONLY_QUIZ_SENTENCE}</strong> Open each quiz from your
        Canvas course. You cannot start a graded quiz here.
      </p>
      <p className="text-sm text-neutral-700">
        {STUDENT_COPY.takeIndexLead} After you submit an exam, the same URL is
        how you come back for your score and — during the class-wide review
        week — the answers. Ungraded practice self-checks stay on{" "}
        <Link href="/book/practice">/book/practice</Link>.
        <StaffOnly>
          {" "}
          Author review banks (answers shown) stay on{" "}
          <Link href="/quizzes">/quizzes</Link>.
        </StaffOnly>
      </p>
      <ul className="list-none space-y-3 p-0">
        {exams.map(({ quizId, bank }) => {
          const questions = quizDrawCount(quizId) ?? bank.groups.length;
          const minutes = quizTimeLimitMinutes(quizId);
          const schedule = getQuizSchedule(quizId);
          return (
            <li
              key={quizId}
              className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm"
            >
              <h2 className="mt-0 mb-2 text-lg font-semibold">{bank.title}</h2>
              {isCanvasOnlyQuiz(quizId) ? null : (
                <p className="mt-0 text-sm text-neutral-700">
                  {questions} questions (one from each topic group)
                  {minutes ? ` · about ${minutes} minutes` : ""}
                  {" · 100 points"}
                </p>
              )}
              {isCanvasOnlyQuiz(quizId) ? (
                <p className="text-sm text-neutral-700">
                  This quiz is the week of {quizWeekOfLabel(quizId)}.{" "}
                  {CANVAS_ONLY_QUIZ_SENTENCE}
                </p>
              ) : schedule ? (
                <p className="text-sm text-neutral-700">
                  {syllabusTakeWindowSentence(schedule)}
                </p>
              ) : null}
              {isCanvasOnlyQuiz(quizId) ? (
                <p className="m-0 text-sm font-medium text-neutral-800">
                  Taken on Canvas
                </p>
              ) : (
                <Link
                  href={`/quizzes/take/${quizId}`}
                  className="book-practice-cta inline-block rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm"
                >
                  {`Take or review ${bank.title}`}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      <QuizAccessOverrides />
      <StaffAttemptsLink />
    </article>
  );
}
