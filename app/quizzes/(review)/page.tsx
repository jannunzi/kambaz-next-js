import Link from "next/link";
import { CANVAS_ONLY_QUIZ_SENTENCE } from "@/lib/quiz-exam/schedule";
import InstructorPeopleLink from "../components/InstructorPeopleLink";
import { renderStaffReview } from "../components/render-staff-review";

export default async function QuizzesIndexPage() {
  return renderStaffReview(() => (
    <article className="page-content font-sans">
      <p className="mb-4 text-sm">
        <Link href="/book">Course book</Link>
        {" · "}
        <Link href="/syllabus">Syllabus</Link>
        <InstructorPeopleLink />
      </p>
      <h1 className="mt-0 font-semibold text-3xl tracking-tight">
        Question banks
      </h1>
      <p className="text-neutral-700">
        Author review surfaces for proposed Canvas questions. Answers are
        visible. These pages are not student exams.
      </p>
      <p>
        {CANVAS_ONLY_QUIZ_SENTENCE} Practice self-checks stay on{" "}
        <Link href="/book/practice">/book/practice</Link>.
      </p>
      <ul className="list-disc pl-5">
        <li>
          <Link href="/quizzes/q1">Q1 — HTML (Chapter 1)</Link>
          {" "}
          <span className="text-sm text-amber-800">Review draft</span>
          {" · "}
          <span>Taken on Canvas</span>
          {" · "}
          <Link href="/quizzes/staff/q1/attempts">Staff attempts</Link>
        </li>
        <li>
          <Link href="/quizzes/q2">Q2 — CSS (Chapter 2)</Link>
          {" "}
          <span className="text-sm text-amber-800">Review draft</span>
          {" · "}
          <span>Taken on Canvas</span>
          {" · "}
          <Link href="/quizzes/staff/q2/attempts">Staff attempts</Link>
        </li>
        <li>
          <Link href="/quizzes/q3">Q3 — JavaScript (Chapter 3)</Link>
          {" "}
          <span className="text-sm text-amber-800">Review draft</span>
          {" · "}
          <Link href="/quizzes/take/q3">Student exam</Link>
          {" · "}
          <Link href="/quizzes/staff/q3/attempts">Staff attempts</Link>
        </li>
        <li>
          <Link href="/quizzes/q4">Q4 — Client state (Chapter 4)</Link>
          {" "}
          <span className="text-sm text-amber-800">Review draft</span>
          {" · "}
          <Link href="/quizzes/take/q4">Student exam</Link>
          {" · "}
          <Link href="/quizzes/staff/q4/attempts">Staff attempts</Link>
        </li>
        <li>
          <Link href="/quizzes/q5">Q5 — REST (Chapter 5)</Link>
          {" "}
          <span className="text-sm text-amber-800">Review draft</span>
          {" · "}
          <Link href="/quizzes/take/q5">Student exam</Link>
          {" · "}
          <Link href="/quizzes/staff/q5/attempts">Staff attempts</Link>
        </li>
        <li>
          <Link href="/quizzes/q6">Q6 — MongoDB (Chapter 6)</Link>
          {" "}
          <span className="text-sm text-amber-800">Review draft</span>
          {" · "}
          <Link href="/quizzes/take/q6">Student exam</Link>
          {" · "}
          <Link href="/quizzes/staff/q6/attempts">Staff attempts</Link>
        </li>
      </ul>
    </article>
  ));
}
