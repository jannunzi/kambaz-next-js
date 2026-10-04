"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  QUESTION_TYPE_LABEL,
  type BankQuestion,
  type QuestionBank,
  type QuestionGroup,
  type QuestionType,
} from "@/lib/question-bank/types";
import { CANVAS_ONLY_QUIZ_SENTENCE, isCanvasOnlyQuiz } from "@/lib/quiz-exam/schedule";
import PromptMarkup from "./PromptMarkup";
import CodingPreview from "./CodingPreview";
import ChoiceContent from "./ChoiceContent";

type Stats = {
  groups: number;
  questions: number;
  byType: Record<
    QuestionType,
    { groups: number; questions: number }
  >;
};

const FILTERS: { id: "all" | QuestionType; label: string }[] = [
  { id: "all", label: "All types" },
  { id: "fill_in_blank", label: "Fill in the blank" },
  { id: "multiple_choice", label: "Multiple choice" },
  { id: "true_false", label: "True / false" },
  { id: "coding", label: "Coding" },
];

function typeBadgeClass(type: QuestionType): string {
  switch (type) {
    case "fill_in_blank":
      return "bg-sky-50 text-sky-900 ring-sky-200";
    case "multiple_choice":
      return "bg-violet-50 text-violet-900 ring-violet-200";
    case "true_false":
      return "bg-teal-50 text-teal-900 ring-teal-200";
    case "coding":
      return "bg-orange-50 text-orange-900 ring-orange-200";
  }
}

export default function QuestionBankReview({
  bank,
  stats,
  studentDrawNote,
  chapterHref = "/book/ch1",
  quizId,
  takeHref = "/quizzes/take/q3",
}: {
  bank: QuestionBank;
  stats: Stats;
  studentDrawNote?: string;
  chapterHref?: string;
  quizId?: string;
  takeHref?: string;
}) {
  const reviewQuizId =
    quizId ?? takeHref.split("/").filter(Boolean).pop() ?? "";
  const canvasOnly = isCanvasOnlyQuiz(reviewQuizId);
  const [filter, setFilter] = useState<"all" | QuestionType>("all");
  const [openIds, setOpenIds] = useState<string[]>(() =>
    bank.groups.map((group) => group.id),
  );

  const visibleGroups = useMemo(
    () =>
      filter === "all"
        ? bank.groups
        : bank.groups.filter((group) => group.type === filter),
    [bank.groups, filter],
  );

  function setAll(open: boolean) {
    setOpenIds(open ? visibleGroups.map((group) => group.id) : []);
  }

  function toggle(id: string) {
    setOpenIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <article className="page-content font-sans text-[0.95rem] leading-relaxed text-neutral-900">
      <p className="mb-4 text-sm">
        <Link href="/quizzes">Question banks</Link>
        {" · "}
        <Link href={chapterHref}>Chapter {bank.chapter}</Link>
        {" · "}
        <Link href="/book">Book home</Link>
      </p>

      <div
        role="status"
        className="mb-6 rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-3 text-amber-950 shadow-sm"
      >
        <p className="m-0 text-base font-semibold tracking-tight">
          Review draft / answers shown
        </p>
        <p className="mb-0 mt-1 text-sm">
          Author review only — not a student exam. Correct answers are visible
          on purpose so the bank can be revised.{" "}
          {canvasOnly ? (
            CANVAS_ONLY_QUIZ_SENTENCE
          ) : (
            <>
              Students take the graded version at <Link href={takeHref}>{takeHref}</Link>.
            </>
          )}
        </p>
      </div>

      <header className="mb-6">
        <p className="m-0 text-sm font-medium uppercase tracking-wide text-neutral-500">
          Chapter {bank.chapter} · {bank.status.replace("_", " ")}
        </p>
        <h1 className="mt-1 mb-2 text-3xl font-semibold tracking-tight">
          {bank.title} question bank
        </h1>
        <p className="m-0 text-neutral-700">
          {stats.groups} groups · {stats.questions} questions
          {" · "}
          {stats.byType.fill_in_blank.groups} FIB
          {" · "}
          {stats.byType.multiple_choice.groups} MC
          {" · "}
          {stats.byType.true_false.groups} TF
          {stats.byType.coding.groups
            ? ` · ${stats.byType.coding.groups} coding`
            : ""}
        </p>
        {studentDrawNote ? (
          <p className="mt-2 mb-0 text-sm text-neutral-700">{studentDrawNote}</p>
        ) : null}
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter by question type"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((item) => {
            const pressed = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => setFilter(item.id)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  pressed
                    ? "border-neutral-800 bg-neutral-800 text-white"
                    : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50"
            onClick={() => setAll(true)}
          >
            Expand all
          </button>
          <button
            type="button"
            className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50"
            onClick={() => setAll(false)}
          >
            Collapse all
          </button>
        </div>
      </div>

      <nav
        aria-label="Question groups"
        className="mb-8 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <p className="mt-0 mb-2 text-sm font-semibold">Jump to a group</p>
        <ol className="m-0 grid list-decimal gap-1 pl-5 sm:grid-cols-2">
          {visibleGroups.map((group) => (
            <li key={group.id}>
              <a href={`#${group.id}`}>
                {group.name}
                <span className="text-neutral-500">
                  {" "}
                  ({group.questions.length})
                </span>
              </a>
            </li>
          ))}
        </ol>
        {visibleGroups.length === 0 ? (
          <p className="m-0 text-sm text-neutral-600">No groups for this filter.</p>
        ) : null}
      </nav>

      <div className="space-y-4">
        {visibleGroups.map((group) => (
          <GroupPanel
            key={group.id}
            group={group}
            open={openIds.includes(group.id)}
            onToggle={() => toggle(group.id)}
          />
        ))}
      </div>
    </article>
  );
}

function GroupPanel({
  group,
  open,
  onToggle,
}: {
  group: QuestionGroup;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <section
      id={group.id}
      className="scroll-mt-4 overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm"
    >
      <h2 className="m-0 text-base">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${group.id}-body`}
          onClick={onToggle}
          className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-neutral-50"
        >
          <span aria-hidden="true" className="mt-0.5 w-4 shrink-0 text-neutral-500">
            {open ? "▾" : "▸"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">
              {group.order}. {group.name}
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-2 text-sm font-normal text-neutral-600">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${typeBadgeClass(group.type)}`}
              >
                {QUESTION_TYPE_LABEL[group.type]}
              </span>
              <span>
                {group.questions.length} variant
                {group.questions.length === 1 ? "" : "s"}
              </span>
              <span>§{group.section}</span>
            </span>
          </span>
        </button>
      </h2>
      {open ? (
        <div id={`${group.id}-body`} className="border-t border-neutral-200 px-4 py-3">
          <p className="mt-0 text-sm text-neutral-700">{group.skill}</p>
          {group.notes ? (
            <p className="text-sm text-neutral-600">{group.notes}</p>
          ) : null}
          <ol className="m-0 list-none space-y-4 p-0">
            {group.questions.map((question, index) => (
              <li
                key={question.id}
                className="rounded-md border border-neutral-200 bg-neutral-50/80 p-3 sm:p-4"
              >
                <QuestionBlock question={question} index={index + 1} />
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}

function QuestionBlock({
  question,
  index,
}: {
  question: BankQuestion;
  index: number;
}) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 text-xs text-neutral-500">
        <span className="font-medium text-neutral-700">Q{index}</span>
        <span className="font-mono">{question.id}</span>
      </div>
      <PromptMarkup
        text={question.prompt}
        className="m-0 font-medium whitespace-pre-wrap break-words"
      />
      {question.preview ? <CodingPreview preview={question.preview} /> : null}
      {question.code ? (
        <pre className="mt-2 overflow-x-auto rounded border border-neutral-300 bg-white px-3 py-2 font-mono text-[0.8rem] leading-relaxed">
          <code>{question.code}</code>
        </pre>
      ) : null}

      {question.type === "multiple_choice" ? (
        <ul className="mt-3 mb-0 list-none space-y-1.5 p-0">
          {question.choices.map((choice) => {
            const correct = choice.id === question.correctChoiceId;
            return (
              <li key={choice.id}>
                <div
                  className={`rounded border px-3 py-2 ${
                    correct
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  <ChoiceContent
                    letter={choice.id}
                    text={choice.text}
                    after={
                      correct ? (
                        <span className="shrink-0 text-xs font-semibold text-emerald-800">
                          Correct
                        </span>
                      ) : null
                    }
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {question.type === "true_false" ? (
        <p
          className="mb-0 mt-3 inline-block rounded border border-emerald-600 bg-emerald-50 px-3 py-2 font-semibold text-emerald-950"
        >
          Answer: {question.answer ? "True" : "False"}
        </p>
      ) : null}

      {question.type === "fill_in_blank" ? (
        <FibAnswers question={question} />
      ) : null}

      {question.type === "coding" ? <CodingAnswers question={question} /> : null}

      {question.explanation ? (
        <PromptMarkup
          text={question.explanation}
          className="mb-0 mt-3 text-sm text-neutral-600"
        />
      ) : null}
    </div>
  );
}

function FibAnswers({
  question,
}: {
  question: Extract<BankQuestion, { type: "fill_in_blank" }>;
}) {
  const multi = question.blankCount > 1;
  return (
    <div className="mt-3 rounded border border-emerald-600 bg-emerald-50 px-3 py-2">
      <p className="mt-0 mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-900">
        Accepted answer{question.acceptedCombinations.length === 1 ? "" : "s"}
        {multi ? ` · ${question.blankCount} blanks` : ""}
      </p>
      <ul className="mb-0 list-disc space-y-1 pl-5">
        {question.acceptedCombinations.map((combo, index) => (
          <li key={index} className="font-mono text-sm">
            {multi ? (
              <span>
                {combo.map((blank, blankIndex) => (
                  <span key={blankIndex}>
                    [{blank === "" ? "blank" : blank}]
                  </span>
                ))}
              </span>
            ) : (
              combo[0]
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CodingAnswers({
  question,
}: {
  question: Extract<BankQuestion, { type: "coding" }>;
}) {
  return (
    <div className="mt-3 space-y-2">
      <div className="rounded border border-emerald-600 bg-emerald-50 px-3 py-2">
        <p className="mt-0 mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-900">
          Reference solution · {question.language} · {question.style}
        </p>
        <pre className="mb-0 overflow-x-auto font-mono text-sm">
          <code>{question.referenceSolution}</code>
        </pre>
      </div>
      {question.acceptedBlanks?.length ? (
        <div className="rounded border border-emerald-600 bg-emerald-50 px-3 py-2">
          <p className="mt-0 mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-900">
            Accepted blanks
          </p>
          <ul className="mb-0 list-disc space-y-1 pl-5 font-mono text-sm">
            {question.acceptedBlanks.map((combo, index) => (
              <li key={index}>{combo.join(" · ")}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="mb-0 text-sm text-neutral-600">{question.rubric}</p>
    </div>
  );
}
