import { COURSE_SITE_ORIGIN } from "../assignments/catalog";
import { GRADED_QUIZ_IDS, type GradedQuizId } from "./draw-counts";
import {
  formatEasternCivilTimestamp,
  getQuizSchedule,
} from "./schedule";

/**
 * Canvas quiz / exam student copy for Fall 2026 fallback packages.
 *
 * Website take remains primary. Canvas Q1–Q6 and X1/X2 are a staff-gated
 * backup if the site is down — never the default path.
 */

export const CANVAS_FALLBACK_PERMISSION_BLURB =
  "If the website quiz is unavailable, ask your instructor or TA for permission to take this Canvas quiz instead.";

export type CanvasFallbackQuizId = GradedQuizId;

export type CanvasFallbackQuizMeta = {
  quizId: CanvasFallbackQuizId;
  canvasTitle: string;
  /** Civil America/New_York times for Canvas `unlock_at` / `due_at` / `lock_at`. */
  unlockAt: string;
  dueAt: string;
  lockAt: string;
  takePath: string;
};

/** Stable QTI / IMSCC identifiers. Shakespeare can remap these to package -20 GUIDs. */
export function canvasFallbackIdent(quizId: CanvasFallbackQuizId): string {
  return `gwebdev_${quizId}_fallback`;
}

export function canvasQuizTakeUrl(quizId: CanvasFallbackQuizId): string {
  return `${COURSE_SITE_ORIGIN}/quizzes/take/${quizId}`;
}

const CANVAS_FALLBACK_TITLES: Record<GradedQuizId, string> = {
  q1: "Q1 — HTML",
  q2: "Q2 — CSS",
  q3: "Q3 — JavaScript",
  q4: "Q4 — Client state",
  q5: "Q5 — REST",
  q6: "Q6 — MongoDB",
  x1: "X1 — Midterm",
  x2: "X2 — Final",
};

/** Canvas dates are the website take window in civil ET, so they cannot drift. */
function canvasWindow(
  quizId: GradedQuizId,
): Pick<CanvasFallbackQuizMeta, "unlockAt" | "dueAt" | "lockAt"> {
  const schedule = getQuizSchedule(quizId);
  if (!schedule) {
    throw new Error(`Missing quiz schedule for Canvas fallback ${quizId}`);
  }
  const dueAt = formatEasternCivilTimestamp(schedule.takeLockAt);
  return {
    unlockAt: formatEasternCivilTimestamp(schedule.takeUnlockAt),
    dueAt,
    lockAt: dueAt,
  };
}

export const CANVAS_FALLBACK_QUIZZES: CanvasFallbackQuizMeta[] = GRADED_QUIZ_IDS.map(
  (quizId) => ({
    quizId,
    canvasTitle: CANVAS_FALLBACK_TITLES[quizId],
    ...canvasWindow(quizId),
    takePath: `/quizzes/take/${quizId}`,
  }),
);

export function getCanvasFallbackQuiz(
  quizId: string,
): CanvasFallbackQuizMeta | undefined {
  return CANVAS_FALLBACK_QUIZZES.find((quiz) => quiz.quizId === quizId);
}

/**
 * Canvas quiz instructions / description. Keep the website URL first; Canvas
 * is only with staff permission.
 */
export function canvasQuizDescriptionHtml(quiz: CanvasFallbackQuizMeta): string {
  const url = canvasQuizTakeUrl(quiz.quizId);
  return [
    `<p>Take ${quiz.canvasTitle} on the course site:</p>`,
    `<p><a href="${url}">${url}</a></p>`,
    quiz.quizId.startsWith("q")
      ? `<p>This Canvas copy is traditional questions only (multiple choice, true/false, fill in the blank). Short coding items are graded on the website and are not included here.</p>`
      : "",
    `<p>${CANVAS_FALLBACK_PERMISSION_BLURB}</p>`,
  ].join("");
}

export function listCanvasQuizFollowupCopy(): Array<{
  quizId: CanvasFallbackQuizId;
  canvasTitle: string;
  publicUrl: string;
  html: string;
  ident: string;
}> {
  return CANVAS_FALLBACK_QUIZZES.map((quiz) => ({
    quizId: quiz.quizId,
    canvasTitle: quiz.canvasTitle,
    publicUrl: canvasQuizTakeUrl(quiz.quizId),
    html: canvasQuizDescriptionHtml(quiz),
    ident: canvasFallbackIdent(quiz.quizId),
  }));
}

export { COURSE_SITE_ORIGIN };
