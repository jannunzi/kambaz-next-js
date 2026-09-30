import type { CanvasRosterEntry, RosterLookupResult } from "../roster/types";
import { STUDENT_COPY } from "./student-copy";
import { getExamBank } from "./banks";
import type { CodingLlmComplete } from "./coding-grade";
import { gradeCodingItems, gradeDrawnQuestions } from "./grade";
import { stripCorrectReveals } from "./sanitize";
import { findQuizQuestion, invalidWebsiteDrawReason } from "./website-draw";
import {
  canRevealAnswers,
  getAnswerRevealPhase,
  getQuizSchedule,
  isTakeWindowOpen,
  toAnswerWindowInfo,
  type QuizAnswersVisibleMode,
  type QuizTakeOverrideMode,
  type SectionCloseInput,
} from "./schedule";
import type {
  QuizAttemptDoc,
  StudentAnswer,
  SubmitExamFailure,
  SubmitExamResult,
} from "./types";

export type ExamSubmitActor = {
  clerkUserId: string;
  email?: string;
  canvasUserId?: string;
};

export type ExamSubmitDeps = {
  quizId: string;
  drawnQuestionIds: string[];
  answers: Record<string, StudentAnswer>;
  startedAt: string;
  now?: Date;
  actor: ExamSubmitActor;
  roster: RosterLookupResult;
  persist?: (doc: QuizAttemptDoc) => Promise<{ insertedId: unknown }>;
  /** Per-section staff override for the take window only. */
  takeOverride?: QuizTakeOverrideMode | null;
  /** Per-section staff override for student answer-key visibility. */
  answersVisible?: QuizAnswersVisibleMode | null;
  /** Section close that stops taking and starts the answer clock. */
  sectionClose?: SectionCloseInput | null;
  /** Tests inject a mock so coding items never call the network. */
  gradeCodingComplete?: CodingLlmComplete;
};

function fail(
  code: SubmitExamFailure["code"],
  message: string,
): SubmitExamFailure {
  return { ok: false, code, message };
}

export function rosterGateMessage(roster: RosterLookupResult): SubmitExamFailure | null {
  if (roster.status === "not_configured") {
    return fail(
      "not_configured",
      "Graded quizzes are not available yet.",
    );
  }
  if (roster.status === "empty") {
    return fail(
      "roster_empty",
      "The Canvas roster for this course has not been loaded yet. Graded attempts are closed until the instructor imports the roster.",
    );
  }
  if (roster.status === "not_on_roster") {
    return fail("not_on_roster", STUDENT_COPY.notOnRosterSubmit);
  }
  return null;
}

export async function runExamSubmit(deps: ExamSubmitDeps): Promise<SubmitExamResult> {
  const rosterError = rosterGateMessage(deps.roster);
  if (rosterError) return rosterError;

  const bank = getExamBank(deps.quizId);
  if (!bank) {
    return fail("unknown_quiz", `Unknown exam “${deps.quizId}”.`);
  }

  if (!deps.drawnQuestionIds.length) {
    return fail("invalid", "This exam is missing the drawn question set.");
  }

  const drawn = [];
  for (const questionId of deps.drawnQuestionIds) {
    const found = findQuizQuestion(deps.quizId, questionId);
    if (!found) {
      return fail("invalid", `Question ${questionId} is not part of this exam.`);
    }
    drawn.push(found);
  }

  const drawError = invalidWebsiteDrawReason(deps.quizId, drawn);
  if (drawError) {
    return fail("invalid", drawError);
  }

  const submittedAt = deps.now ?? new Date();
  const schedule = getQuizSchedule(deps.quizId);
  const sectionClose: SectionCloseInput = {
    mode: deps.sectionClose?.mode ?? deps.takeOverride,
    closesAt: deps.sectionClose?.closesAt,
    closedAt: deps.sectionClose?.closedAt,
  };
  if (
    deps.persist &&
    schedule &&
    !isTakeWindowOpen(
      schedule,
      submittedAt,
      sectionClose.mode,
      sectionClose.closesAt,
    )
  ) {
    return fail(
      "take_closed",
      "The take window for this quiz is closed. New attempts are not accepted.",
    );
  }

  const startedAt = parseStartedAt(deps.startedAt, submittedAt);
  const codingResults = await gradeCodingItems(drawn, deps.answers, {
    complete: deps.gradeCodingComplete,
  });
  const graded = gradeDrawnQuestions(drawn, deps.answers, codingResults);
  const phase = schedule
    ? getAnswerRevealPhase(
        schedule,
        submittedAt,
        true,
        sectionClose.mode,
        sectionClose,
      )
    : "submitted_waiting";
  const reveal = canRevealAnswers(phase, deps.answersVisible);
  const publicGraded = reveal ? graded : stripCorrectReveals(graded);
  const score = graded.reduce((sum, item) => sum + item.points, 0);
  const maxScore = graded.reduce((sum, item) => sum + item.maxPoints, 0);
  const rosterEntry = (deps.roster as { entry: CanvasRosterEntry }).entry;
  const window =
    schedule && phase
      ? toAnswerWindowInfo(
          schedule,
          phase,
          deps.answersVisible,
          sectionClose,
          submittedAt,
        )
      : undefined;

  const doc: QuizAttemptDoc = {
    clerkUserId: deps.actor.clerkUserId,
    email: deps.actor.email ?? rosterEntry.email,
    canvasUserId: deps.actor.canvasUserId ?? rosterEntry.canvasUserId,
    quizId: deps.quizId,
    startedAt,
    submittedAt,
    score,
    maxScore,
    answers: graded.map((item) => ({
      questionId: item.questionId,
      groupId: item.groupId,
      type: item.type,
      response: item.response,
      correct: item.correct,
      points: item.points,
      scoreRatio: item.scoreRatio,
      feedback: item.feedback,
      gradingError: item.gradingError,
    })),
    meta: {
      drawnQuestionIds: deps.drawnQuestionIds,
      rosterEmail: rosterEntry.email,
      durationMs: Math.max(0, submittedAt.getTime() - startedAt.getTime()),
      source: "student-exam",
    },
  };

  if (!deps.persist) {
    return {
      ok: true,
      score,
      maxScore,
      persisted: false,
      graded: publicGraded,
      window,
    };
  }

  const inserted = await deps.persist(doc);
  return {
    ok: true,
    score,
    maxScore,
    persisted: true,
    attemptId: String(inserted.insertedId),
    graded: publicGraded,
    window,
  };
}

function parseStartedAt(value: string, fallback: Date): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  if (parsed.getTime() > fallback.getTime()) return fallback;
  return parsed;
}
