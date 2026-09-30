"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { fillTemplate } from "@/lib/question-bank/blanks";
import {
  pointsPerDrawnItem,
  quizTimeLimitMinutes,
} from "@/lib/quiz-exam/draw-counts";
import type {
  StudentAnswer,
  StudentQuestion,
  SubmitExamResult,
} from "@/lib/quiz-exam/types";
import {
  scheduleFromIso,
  type QuizPhase,
  type QuizScheduleIso,
  type SectionCloseInput,
} from "@/lib/quiz-exam/schedule";
import { submitExamAttempt } from "../actions";
import ChoiceContent from "../../components/ChoiceContent";
import CodingPreview from "../../components/CodingPreview";
import FibBlankFields from "../../components/FibBlankFields";
import PromptMarkup from "../../components/PromptMarkup";
import { SubmittedAttemptView } from "./AttemptReview";

function formatItemPoints(groupCount: number): string {
  const raw = pointsPerDrawnItem(groupCount);
  if (Number.isInteger(raw)) return String(raw);
  return raw.toFixed(2);
}

function readAnswers(
  questions: StudentQuestion[],
  form: FormData,
): Record<string, StudentAnswer> {
  const answers: Record<string, StudentAnswer> = {};
  for (const question of questions) {
    if (question.type === "multiple_choice") {
      const choiceId = String(form.get(`q-${question.id}`) ?? "");
      if (choiceId) {
        answers[question.id] = { type: "multiple_choice", choiceId };
      }
    } else if (question.type === "true_false") {
      const value = String(form.get(`q-${question.id}`) ?? "");
      if (value === "true" || value === "false") {
        answers[question.id] = { type: "true_false", value: value === "true" };
      }
    } else if (question.type === "coding") {
      if (question.style === "fib") {
        const blanks = Array.from(
          { length: question.blankCount ?? 1 },
          (_, index) => String(form.get(`q-${question.id}-${index}`) ?? ""),
        );
        if (blanks.some((blank) => blank.trim() !== "")) {
          answers[question.id] = {
            type: "coding",
            blanks,
            code: fillTemplate(question.code ?? "", blanks),
          };
        }
      } else {
        const code = String(form.get(`q-${question.id}`) ?? "");
        if (code.trim() !== "") {
          answers[question.id] = { type: "coding", code };
        }
      }
    } else {
      const blanks = Array.from(
        { length: question.blankCount ?? 1 },
        (_, index) => String(form.get(`q-${question.id}-${index}`) ?? ""),
      );
      if (blanks.some((blank) => blank.trim() !== "")) {
        answers[question.id] = { type: "fill_in_blank", blanks };
      }
    }
  }
  return answers;
}

export default function ExamForm({
  quizId,
  title,
  questions,
  startedAt,
  schedule,
  impersonating = false,
  sectionClose,
}: {
  quizId: string;
  title: string;
  questions: StudentQuestion[];
  startedAt: string;
  schedule: QuizScheduleIso;
  impersonating?: boolean;
  sectionClose?: SectionCloseInput | null;
}) {
  const [result, setResult] = useState<SubmitExamResult | null>(null);
  const [pending, setPending] = useState(false);
  const minutes = quizTimeLimitMinutes(quizId);
  const timeLimitLabel = minutes ? `, about ${minutes} minutes` : "";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    const next = await submitExamAttempt({
      quizId,
      drawnQuestionIds: questions.map((question) => question.id),
      answers: readAnswers(questions, form),
      startedAt,
    });
    setPending(false);
    setResult(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (result?.ok) {
    const phase: QuizPhase = result.window?.phase ?? "submitted_waiting";
    return (
      <SubmittedAttemptView
        title={title}
        schedule={scheduleFromIso(schedule)}
        phase={phase}
        score={result.score}
        maxScore={result.maxScore}
        questions={questions}
        graded={result.graded}
        persisted={result.persisted}
        impersonation={result.impersonation === true}
        answersVisible={result.window?.answersVisible}
        sectionClose={sectionClose}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {result && !result.ok ? (
        <div
          role="alert"
          className="rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-3 text-amber-950"
        >
          <p className="m-0 font-semibold">{result.message}</p>
        </div>
      ) : null}

      <p className="text-sm text-neutral-700">
        This attempt has {questions.length} questions (topic items plus short
        coding items){timeLimitLabel}, {formatItemPoints(questions.length)} points
        each (100 total). Correct answers stay hidden until one week after
        your section closes the quiz — not immediately after you submit.
        Grading happens on the server. Coding items are scored leniently (misspellings, missing
        slashes, and extra whitespace are forgiven).
      </p>

      {questions.map((question, index) => (
        <QuestionField key={question.id} question={question} index={index + 1} />
      ))}

      <button
        type="submit"
        disabled={pending}
        className="rounded border border-neutral-800 bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700 disabled:opacity-60"
      >
        {pending
          ? "Submitting…"
          : impersonating
            ? "Submit (preview — not saved)"
            : "Submit graded attempt"}
      </button>
    </form>
  );
}

function QuestionField({
  question,
  index,
}: {
  question: StudentQuestion;
  index: number;
}) {
  return (
    <fieldset className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm">
      {/* Index only — group/topic titles give away the answer category. */}
      <legend className="px-1 text-sm font-semibold text-neutral-700">
        {index}.
      </legend>
      <PromptMarkup
        text={question.prompt}
        className="mt-1 font-medium whitespace-pre-wrap break-words"
      />
      {question.preview ? <CodingPreview preview={question.preview} /> : null}
      {question.code ? (
        <pre className="mt-2 overflow-x-auto rounded border border-neutral-300 bg-neutral-50 px-3 py-2 font-mono text-[0.8rem] leading-relaxed">
          <code>{question.code}</code>
        </pre>
      ) : null}

      {question.type === "multiple_choice" ? (
        <ul className="mt-3 mb-0 list-none space-y-1.5 p-0">
          {question.choices?.map((choice) => (
            <li key={choice.id}>
              <label className="flex cursor-pointer items-start gap-2 rounded border border-neutral-200 bg-neutral-50 px-3 py-2 has-[:checked]:border-neutral-800 has-[:checked]:bg-white">
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  value={choice.id}
                  className="mt-1"
                />
                <ChoiceContent letter={choice.id} text={choice.text} />
              </label>
            </li>
          ))}
        </ul>
      ) : null}

      {question.type === "true_false" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {(["true", "false"] as const).map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded border border-neutral-200 bg-neutral-50 px-3 py-2 has-[:checked]:border-neutral-800 has-[:checked]:bg-white"
            >
              <input type="radio" name={`q-${question.id}`} value={value} />
              {value === "true" ? "True" : "False"}
            </label>
          ))}
        </div>
      ) : null}

      {question.type === "fill_in_blank" ||
      (question.type === "coding" && question.style === "fib") ? (
        <FibBlankFields
          questionId={question.id}
          blankCount={question.blankCount ?? 1}
        />
      ) : null}

      {question.type === "coding" && question.style !== "fib" ? (
        <label className="mt-3 block text-sm">
          <span className="mb-1 block text-neutral-600">Your code</span>
          <textarea
            name={`q-${question.id}`}
            rows={8}
            spellCheck={false}
            placeholder={question.placeholder}
            className="w-full rounded border border-neutral-300 bg-white px-3 py-2 font-mono text-[0.85rem] leading-relaxed"
          />
        </label>
      ) : null}
    </fieldset>
  );
}
