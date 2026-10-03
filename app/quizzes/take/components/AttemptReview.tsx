import type { ReactNode } from "react";
import {
  answerWindowCopy,
  canRevealAnswers,
  formatEasternDateTime,
  type QuizAnswersVisibleMode,
  type QuizPhase,
  type QuizSchedule,
  type QuizTakeOverrideMode,
} from "@/lib/quiz-exam/schedule";
import { formatStudentResponse } from "@/lib/quiz-exam/review";
import type { GradedAnswer, StudentQuestion } from "@/lib/quiz-exam/types";
import PromptMarkup from "../../components/PromptMarkup";
import CodingPreview from "../../components/CodingPreview";

function resultLabel(item: GradedAnswer): string {
  if (item.type === "coding") {
    if ((item.scoreRatio ?? (item.correct ? 1 : 0)) >= 0.999) return "Correct";
    if ((item.scoreRatio ?? 0) > 0 || item.points > 0) return "Partial credit";
    return "Incorrect";
  }
  return item.correct ? "Correct" : "Incorrect";
}

export function WindowBanner({
  schedule,
  phase,
  now,
  takeOverride,
  answersVisible,
}: {
  schedule: QuizSchedule;
  phase: QuizPhase;
  now?: Date;
  takeOverride?: QuizTakeOverrideMode | null;
  answersVisible?: QuizAnswersVisibleMode | null;
}) {
  const copy = answerWindowCopy(
    schedule,
    phase,
    now,
    takeOverride,
    answersVisible,
  );
  const toneClass =
    copy.tone === "ok"
      ? "border-emerald-600 bg-emerald-50 text-emerald-950"
      : copy.tone === "warn"
        ? "border-amber-500 bg-amber-50 text-amber-950"
        : "border-sky-300 bg-sky-50 text-sky-950";

  return (
    <div role="status" className={`rounded-lg border-2 px-4 py-3 ${toneClass}`}>
      <p className="m-0 text-lg font-semibold">{copy.title}</p>
      {copy.paragraphs.map((paragraph) => (
        <p key={paragraph} className="mb-0 mt-2 text-sm">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function AttemptScore({
  title,
  score,
  maxScore,
  submittedAt,
  persisted = true,
  impersonation = false,
}: {
  title: string;
  score: number;
  maxScore: number;
  submittedAt?: Date | string;
  persisted?: boolean;
  impersonation?: boolean;
}) {
  return (
    <div
      className={`mb-4 rounded-lg border-2 px-4 py-3 ${
        impersonation
          ? "border-amber-500 bg-amber-50 text-amber-950"
          : "border-emerald-600 bg-emerald-50 text-emerald-950"
      }`}
    >
      <p className="m-0 text-lg font-semibold">
        {title}: {score} / {maxScore}
      </p>
      {submittedAt ? (
        <p className="mb-0 mt-1 text-sm">
          Submitted {formatEasternDateTime(submittedAt)}.
        </p>
      ) : null}
      <p className="mb-0 mt-1 text-sm">
        {impersonation
          ? "Impersonation — attempt not saved."
          : persisted
            ? "This attempt is stored for later Canvas grade import."
            : "Your score was calculated, but the attempt was not stored. Ask the instructor to check Atlas configuration."}
      </p>
    </div>
  );
}

export function GradedQuestionList({
  questions,
  graded,
  revealAnswers,
  renderExtra,
  showGroupTitle = false,
}: {
  questions: StudentQuestion[];
  graded: GradedAnswer[];
  revealAnswers: boolean;
  renderExtra?: (item: GradedAnswer, question?: StudentQuestion) => ReactNode;
  /** Staff-only. Topic titles give students the answer category. */
  showGroupTitle?: boolean;
}) {
  const byId = new Map(questions.map((question) => [question.id, question]));

  return (
    <ol className="m-0 list-none space-y-3 p-0">
      {graded.map((item, index) => {
        const question = byId.get(item.questionId);
        const showMark = revealAnswers;
        return (
          <li
            key={item.questionId}
            className={`rounded-lg border px-4 py-3 ${
              showMark
                ? item.correct
                  ? "border-emerald-300 bg-emerald-50"
                  : item.points > 0
                    ? "border-amber-300 bg-amber-50"
                    : "border-rose-200 bg-rose-50"
                : "border-neutral-300 bg-white"
            }`}
          >
            <p className="m-0 text-sm font-semibold">
              {index + 1}.
              {showGroupTitle
                ? ` ${question?.groupName ?? item.groupId}`
                : ""}
              {showMark ? ` — ${resultLabel(item)}` : ""}
              {showMark && item.maxPoints
                ? ` (${item.points} / ${item.maxPoints})`
                : ""}
            </p>
            {question ? (
              <PromptMarkup
                text={question.prompt}
                className="mt-1 mb-0 whitespace-pre-wrap"
              />
            ) : null}
            {question?.preview ? <CodingPreview preview={question.preview} /> : null}
            {question?.code ? (
              <pre className="mt-2 overflow-x-auto rounded border border-neutral-300 bg-white px-3 py-2 font-mono text-[0.8rem] leading-relaxed">
                <code>{question.code}</code>
              </pre>
            ) : null}
            {question ? (
              question.type === "coding" &&
              item.response?.type === "coding" &&
              item.response.code.trim() &&
              !item.response.blanks?.length ? (
                <pre className="mt-2 overflow-x-auto rounded border border-neutral-300 bg-white px-3 py-2 font-mono text-[0.8rem] leading-relaxed">
                  <code>{item.response.code}</code>
                </pre>
              ) : (
                <p className="mb-0 mt-2 text-sm">
                  Your answer:{" "}
                  <PromptMarkup
                    as="span"
                    text={formatStudentResponse(question, item.response)}
                  />
                </p>
              )
            ) : null}
            {revealAnswers && item.feedback ? (
              <p className="mb-0 mt-2 text-sm">{item.feedback}</p>
            ) : null}
            {revealAnswers && item.correctReveal ? (
              <pre className="mt-2 overflow-x-auto rounded border border-emerald-300 bg-white px-3 py-2 font-mono text-[0.8rem] leading-relaxed">
                <code>{item.correctReveal}</code>
              </pre>
            ) : null}
            {renderExtra ? renderExtra(item, question) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function SubmittedAttemptView({
  title,
  schedule,
  phase,
  score,
  maxScore,
  questions,
  graded,
  submittedAt,
  persisted = true,
  impersonation = false,
  now,
  takeOverride,
  answersVisible,
}: {
  title: string;
  schedule: QuizSchedule;
  phase: QuizPhase;
  score: number;
  maxScore: number;
  questions: StudentQuestion[];
  graded: GradedAnswer[];
  submittedAt?: Date | string;
  persisted?: boolean;
  impersonation?: boolean;
  now?: Date;
  takeOverride?: QuizTakeOverrideMode | null;
  answersVisible?: QuizAnswersVisibleMode | null;
}) {
  const revealAnswers = canRevealAnswers(phase, answersVisible);
  return (
    <div className="space-y-4">
      <AttemptScore
        title={title}
        score={score}
        maxScore={maxScore}
        submittedAt={submittedAt}
        persisted={persisted}
        impersonation={impersonation}
      />
      <WindowBanner
        schedule={schedule}
        phase={phase}
        now={now}
        takeOverride={takeOverride}
        answersVisible={answersVisible}
      />
      {revealAnswers ? (
        <GradedQuestionList
          questions={questions}
          graded={graded}
          revealAnswers
        />
      ) : null}
    </div>
  );
}
