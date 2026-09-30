"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  describeAnswersVisible,
  describeTakeAccess,
  overrideKey,
  type QuizAccessOverrideView,
} from "@/lib/quiz-exam/access-override";
import {
  formatEasternDateTime,
  formatEasternDateTimeLocal,
  parseEasternDateTimeLocal,
  resolveSectionAnswerWindow,
  scheduleFromIso,
  type QuizAnswersVisibleMode,
  type QuizScheduleIso,
  type QuizTakeOverrideMode,
} from "@/lib/quiz-exam/schedule";
import {
  setQuizAccessOverride,
  setQuizAnswersVisible,
  setQuizSectionClose,
} from "../override-actions";

const MODES: { id: QuizTakeOverrideMode; label: string }[] = [
  { id: "open", label: "Enable" },
  { id: "closed", label: "Disable" },
  { id: "schedule", label: "Off (dates only)" },
];

const ANSWER_MODES: { id: QuizAnswersVisibleMode; label: string }[] = [
  { id: "on", label: "On" },
  { id: "off", label: "Off" },
  { id: "schedule", label: "Follow schedule" },
];

export type OverrideQuizRow = {
  quizId: string;
  title: string;
  schedule: QuizScheduleIso;
};

function pressedClass(kind: "open" | "closed" | "neutral" | "on" | "off"): string {
  if (kind === "open" || kind === "on") {
    return "border-emerald-800 bg-emerald-800 text-white";
  }
  if (kind === "closed" || kind === "off") {
    return "border-amber-800 bg-amber-800 text-white";
  }
  return "border-neutral-800 bg-neutral-800 text-white";
}

export default function QuizAccessOverridePanel({
  quizzes,
  sections,
  overrides,
  now,
}: {
  quizzes: OverrideQuizRow[];
  sections: readonly string[];
  overrides: QuizAccessOverrideView[];
  now: string;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(overrides);
  const [closeDrafts, setCloseDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const clock = useMemo(() => new Date(now), [now]);
  const byKey = useMemo(() => {
    const map = new Map<string, QuizAccessOverrideView>();
    for (const row of rows) {
      map.set(overrideKey(row.quizId, row.sectionId), row);
    }
    return map;
  }, [rows]);

  function currentRow(quizId: string, sectionId: string): QuizAccessOverrideView {
    return (
      byKey.get(overrideKey(quizId, sectionId)) ?? {
        quizId,
        sectionId,
        mode: "schedule",
        answersVisible: "schedule",
        updatedAt: "",
      }
    );
  }

  function replaceRow(
    quizId: string,
    sectionId: string,
    next: QuizAccessOverrideView | undefined,
  ) {
    setRows((current) => {
      const filtered = current.filter(
        (row) => !(row.quizId === quizId && row.sectionId === sectionId),
      );
      if (next) filtered.push(next);
      return filtered;
    });
  }

  function closeDraft(quizId: string, sectionId: string, closesAt?: string) {
    const key = overrideKey(quizId, sectionId);
    if (key in closeDrafts) return closeDrafts[key];
    return closesAt ? formatEasternDateTimeLocal(closesAt) : "";
  }

  function setMode(quizId: string, sectionId: string, mode: QuizTakeOverrideMode) {
    const key = `${overrideKey(quizId, sectionId)}:take`;
    const previous = byKey.get(overrideKey(quizId, sectionId));
    const recordingClose =
      mode === "closed" && previous?.mode === "open" && !previous.closedAt;
    setError(null);
    setPendingKey(key);
    replaceRow(quizId, sectionId, {
      quizId,
      sectionId,
      mode,
      answersVisible: previous?.answersVisible ?? "schedule",
      closesAt: previous?.closesAt,
      closedAt: recordingClose ? new Date().toISOString() : previous?.closedAt,
      updatedAt: new Date().toISOString(),
      updatedBy: previous?.updatedBy,
    });
    startTransition(async () => {
      const result = await setQuizAccessOverride({ quizId, sectionId, mode });
      if (!result.ok) {
        replaceRow(quizId, sectionId, previous);
        setError(result.message);
        setPendingKey(null);
        return;
      }
      replaceRow(quizId, sectionId, result.override);
      setPendingKey(null);
      router.refresh();
    });
  }

  function setAnswers(
    quizId: string,
    sectionId: string,
    answersVisible: QuizAnswersVisibleMode,
  ) {
    const key = `${overrideKey(quizId, sectionId)}:answers`;
    const previous = byKey.get(overrideKey(quizId, sectionId));
    setError(null);
    setPendingKey(key);
    replaceRow(quizId, sectionId, {
      quizId,
      sectionId,
      mode: previous?.mode ?? "schedule",
      answersVisible,
      closesAt: previous?.closesAt,
      closedAt: previous?.closedAt,
      updatedAt: new Date().toISOString(),
      updatedBy: previous?.updatedBy,
    });
    startTransition(async () => {
      const result = await setQuizAnswersVisible({
        quizId,
        sectionId,
        answersVisible,
      });
      if (!result.ok) {
        replaceRow(quizId, sectionId, previous);
        setError(result.message);
        setPendingKey(null);
        return;
      }
      replaceRow(quizId, sectionId, result.override);
      setPendingKey(null);
      router.refresh();
    });
  }

  function saveClose(quizId: string, sectionId: string, clear = false) {
    const key = `${overrideKey(quizId, sectionId)}:close`;
    const previous = byKey.get(overrideKey(quizId, sectionId));
    const raw = clear ? "" : closeDraft(quizId, sectionId, previous?.closesAt);
    const parsed = clear || raw.trim() === "" ? null : parseEasternDateTimeLocal(raw);
    if (!clear && raw.trim() !== "" && !parsed) {
      setError("Enter a section close time in Eastern Time, or clear it.");
      return;
    }
    setError(null);
    setPendingKey(key);
    replaceRow(quizId, sectionId, {
      quizId,
      sectionId,
      mode: previous?.mode ?? "schedule",
      answersVisible: previous?.answersVisible ?? "schedule",
      closesAt: parsed ? parsed.toISOString() : undefined,
      closedAt: previous?.closedAt,
      updatedAt: new Date().toISOString(),
      updatedBy: previous?.updatedBy,
    });
    startTransition(async () => {
      const result = await setQuizSectionClose({
        quizId,
        sectionId,
        closesAt: parsed ? parsed.toISOString() : null,
      });
      if (!result.ok) {
        replaceRow(quizId, sectionId, previous);
        setError(result.message);
        setPendingKey(null);
        return;
      }
      setCloseDrafts((current) => {
        const next = { ...current };
        delete next[overrideKey(quizId, sectionId)];
        return next;
      });
      replaceRow(quizId, sectionId, result.override);
      setPendingKey(null);
      router.refresh();
    });
  }

  return (
    <section
      className="mt-6 rounded-lg border border-neutral-300 bg-neutral-50 p-4"
      aria-label="Quiz take and answer-key overrides"
    >
      <h2 className="mt-0 mb-1 text-lg font-semibold tracking-tight">
        Enable graded quizzes
      </h2>
      <p className="mt-0 mb-3 text-sm text-neutral-700">
        Quizzes stay closed until you <strong>Enable</strong> a section.
        Syllabus unlock/due dates are shown to students but do not open the
        quiz. Set a <strong>section close</strong> (Eastern Time) to stop
        taking at that moment. <strong>Disable</strong> turns it off
        immediately and records that close the first time you switch from
        Enable. Off (dates only) is the default. Practice quizzes are
        unchanged.
      </p>
      <h2 className="mt-4 mb-1 text-lg font-semibold tracking-tight">
        Answers visible to students
      </h2>
      <p className="mt-0 mb-3 text-sm text-neutral-700">
        Manual override for the answer key on completed attempts.{" "}
        <strong>On</strong> shows correct/incorrect marks and expected
        answers. <strong>Off</strong> hides them (score still shows).{" "}
        <strong>Follow schedule</strong> is the default: answers stay hidden
        until one week after that section&apos;s quiz closes, then stay
        visible for one week (close + 7 days through close + 14 days, same
        Eastern Time). Staff attempt review always shows answers. Changing
        Enable/Disable does not change this flag.
      </p>
      {error ? (
        <p role="alert" className="mb-3 rounded border border-amber-500 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {error}
        </p>
      ) : null}
      <div className="space-y-4">
        {quizzes.map((quiz) => {
          const schedule = scheduleFromIso(quiz.schedule);
          return (
            <div key={quiz.quizId}>
              <h3 className="mt-0 mb-2 text-base font-semibold">{quiz.title}</h3>
              <ul className="m-0 list-none space-y-2 p-0">
                {sections.map((sectionId) => {
                  const saved = currentRow(quiz.quizId, sectionId);
                  const sectionClose = {
                    mode: saved.mode,
                    closesAt: saved.closesAt,
                    closedAt: saved.closedAt,
                  };
                  const take = describeTakeAccess(
                    schedule,
                    saved.mode,
                    clock,
                    saved.closesAt,
                  );
                  const answers = describeAnswersVisible(
                    schedule,
                    saved.answersVisible,
                    clock,
                    sectionClose,
                  );
                  const answerWindow = resolveSectionAnswerWindow(
                    sectionClose,
                    clock,
                  );
                  const takeKey = `${overrideKey(quiz.quizId, sectionId)}:take`;
                  const answersKey = `${overrideKey(quiz.quizId, sectionId)}:answers`;
                  const closeKey = `${overrideKey(quiz.quizId, sectionId)}:close`;
                  const draft = closeDraft(
                    quiz.quizId,
                    sectionId,
                    saved.closesAt,
                  );
                  return (
                    <li
                      key={sectionId}
                      className="rounded border border-neutral-200 bg-white px-3 py-2"
                    >
                      <p className="m-0 font-medium">{sectionId}</p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="m-0 text-sm text-neutral-700">Take</p>
                        <div
                          role="group"
                          aria-label={`${quiz.title} ${sectionId} take access`}
                          className="flex flex-wrap gap-1.5"
                        >
                          {MODES.map((item) => {
                            const pressed = saved.mode === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                aria-pressed={pressed}
                                disabled={pending && pendingKey === takeKey}
                                onClick={() =>
                                  setMode(quiz.quizId, sectionId, item.id)
                                }
                                className={`rounded border px-2.5 py-1 text-sm ${
                                  pressed
                                    ? pressedClass(
                                        item.id === "open"
                                          ? "open"
                                          : item.id === "closed"
                                            ? "closed"
                                            : "neutral",
                                      )
                                    : "border-neutral-400 bg-white hover:bg-neutral-50"
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <p className="mb-0 mt-1 text-xs text-neutral-600">
                        Effective:{" "}
                        <strong>
                          {take.open ? "open" : "closed"}
                        </strong>
                        {take.mode === "schedule"
                          ? " (dates only — not enabled)"
                          : take.mode === "open"
                            ? take.open
                              ? " (enabled by staff)"
                              : " (enabled, but the section close time has passed)"
                            : " (disabled by staff)"}
                      </p>
                      <div className="mt-3">
                        <label
                          htmlFor={`${closeKey}-input`}
                          className="text-sm text-neutral-700"
                        >
                          Section close (Eastern Time)
                        </label>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <input
                            id={`${closeKey}-input`}
                            type="datetime-local"
                            value={draft}
                            onChange={(event) =>
                              setCloseDrafts((current) => ({
                                ...current,
                                [overrideKey(quiz.quizId, sectionId)]:
                                  event.target.value,
                              }))
                            }
                            className="rounded border border-neutral-400 bg-white px-2 py-1 text-sm"
                          />
                          <button
                            type="button"
                            disabled={pending && pendingKey === closeKey}
                            onClick={() => saveClose(quiz.quizId, sectionId)}
                            className="rounded border border-neutral-800 bg-neutral-800 px-2.5 py-1 text-sm text-white hover:bg-neutral-700 disabled:opacity-60"
                          >
                            Save close
                          </button>
                          <button
                            type="button"
                            disabled={
                              (pending && pendingKey === closeKey) ||
                              (!saved.closesAt && draft.trim() === "")
                            }
                            onClick={() =>
                              saveClose(quiz.quizId, sectionId, true)
                            }
                            className="rounded border border-neutral-400 bg-white px-2.5 py-1 text-sm hover:bg-neutral-50 disabled:opacity-60"
                          >
                            Clear
                          </button>
                        </div>
                        <p className="mb-0 mt-1 text-xs text-neutral-600">
                          {answerWindow ? (
                            <>
                              {answerWindow.effective
                                ? "Closed"
                                : "Scheduled close"}{" "}
                              {formatEasternDateTime(answerWindow.closeAt)}.
                              Answers{" "}
                              {answerWindow.effective ? "visible" : "will be visible"}{" "}
                              {formatEasternDateTime(answerWindow.answersOpenAt)}{" "}
                              until{" "}
                              {formatEasternDateTime(answerWindow.answersCloseAt)}
                              .
                            </>
                          ) : (
                            "No section close yet. Answers stay hidden until this section closes."
                          )}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <p className="m-0 text-sm text-neutral-700">
                          Answers visible to students
                        </p>
                        <div
                          role="group"
                          aria-label={`${quiz.title} ${sectionId} answers visible to students`}
                          className="flex flex-wrap gap-1.5"
                        >
                          {ANSWER_MODES.map((item) => {
                            const pressed = answers.mode === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                aria-pressed={pressed}
                                disabled={pending && pendingKey === answersKey}
                                onClick={() =>
                                  setAnswers(quiz.quizId, sectionId, item.id)
                                }
                                className={`rounded border px-2.5 py-1 text-sm ${
                                  pressed
                                    ? pressedClass(
                                        item.id === "on"
                                          ? "on"
                                          : item.id === "off"
                                            ? "off"
                                            : "neutral",
                                      )
                                    : "border-neutral-400 bg-white hover:bg-neutral-50"
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <p className="mb-0 mt-1 text-xs text-neutral-600">
                        Effective:{" "}
                        <strong>
                          {answers.visible ? "visible" : "hidden"}
                        </strong>
                        {answers.mode === "schedule"
                          ? answers.scheduledVisible
                            ? " (section answer window)"
                            : " (follows section close — hidden)"
                          : answers.mode === "on"
                            ? " (shown by staff)"
                            : " (hidden by staff)"}
                        {saved.updatedBy || saved.updatedAt
                          ? ` · last ${saved.updatedBy ?? "staff"} ${
                              saved.updatedAt
                                ? formatEasternDateTime(saved.updatedAt)
                                : ""
                            }`
                          : null}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
