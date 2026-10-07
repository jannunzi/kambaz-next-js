import { COURSE_SITE_ORIGIN } from "../assignments/catalog";
import { GRADED_QUIZ_IDS, type GradedQuizId } from "./draw-counts";
import {
  formatEasternCivilTimestamp,
  formatEasternDateTime,
  getQuizSchedule,
  isCanvasOnlyQuiz,
} from "./schedule";

/**
 * Canvas quiz / exam student copy for Fall 2026 packages.
 *
 * Graded quizzes (Q1–Q6) are taken in Canvas (Jose, Oct 7 2026), so their
 * Canvas description never links to a take page on this site. Exams
 * (X1/X2) are still taken on the course website; their Canvas copy stays a
 * staff-gated backup if the site is down.
 */

export const CANVAS_FALLBACK_PERMISSION_BLURB =
  "If the website quiz is unavailable, ask your instructor or TA for permission to take this Canvas quiz instead.";

/** Student-facing Canvas description line for Q1–Q6. */
export const CANVAS_QUIZ_TAKEN_HERE_SENTENCE =
  "This graded quiz is taken here in Canvas, not on the course website.";

export type CanvasFallbackQuizId = GradedQuizId;

export type CanvasFallbackQuizMeta = {
  quizId: CanvasFallbackQuizId;
  canvasTitle: string;
  /** Civil America/New_York times for Canvas `unlock_at` / `due_at` / `lock_at`. */
  unlockAt: string;
  dueAt: string;
  lockAt: string;
  /** Civil America/New_York bounds of the single answer week. */
  answersOpenAt: string;
  answersCloseAt: string;
  /**
   * Course-website take path for exams only (X1/X2). Quizzes are taken in
   * Canvas, so this is null for Q1–Q6 and never appears in their copy.
   */
  takePath: string | null;
};

/** Stable QTI / IMSCC identifiers. Shakespeare can remap these to package -20 GUIDs. */
export function canvasFallbackIdent(quizId: CanvasFallbackQuizId): string {
  return `gwebdev_${quizId}_fallback`;
}

/**
 * Course-website take URL for an exam (X1/X2). Returns null for Q1–Q6:
 * graded quizzes are taken in Canvas, so no student copy may point at a
 * website take page for them.
 */
export function canvasQuizTakeUrl(quizId: CanvasFallbackQuizId): string | null {
  if (isCanvasOnlyQuiz(quizId)) return null;
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

/** Canvas take and answer dates come from the website schedule, so they cannot drift. */
function canvasWindow(
  quizId: GradedQuizId,
): Pick<
  CanvasFallbackQuizMeta,
  "unlockAt" | "dueAt" | "lockAt" | "answersOpenAt" | "answersCloseAt"
> {
  const schedule = getQuizSchedule(quizId);
  if (!schedule) {
    throw new Error(`Missing quiz schedule for Canvas fallback ${quizId}`);
  }
  const dueAt = formatEasternCivilTimestamp(schedule.takeLockAt);
  return {
    unlockAt: formatEasternCivilTimestamp(schedule.takeUnlockAt),
    dueAt,
    lockAt: dueAt,
    answersOpenAt: formatEasternCivilTimestamp(schedule.answersOpenAt),
    answersCloseAt: formatEasternCivilTimestamp(schedule.answersCloseAt),
  };
}

export const CANVAS_FALLBACK_QUIZZES: CanvasFallbackQuizMeta[] = GRADED_QUIZ_IDS.map(
  (quizId) => ({
    quizId,
    canvasTitle: CANVAS_FALLBACK_TITLES[quizId],
    ...canvasWindow(quizId),
    takePath: isCanvasOnlyQuiz(quizId) ? null : `/quizzes/take/${quizId}`,
  }),
);

export function getCanvasFallbackQuiz(
  quizId: string,
): CanvasFallbackQuizMeta | undefined {
  return CANVAS_FALLBACK_QUIZZES.find((quiz) => quiz.quizId === quizId);
}

/**
 * Canvas quiz instructions / description.
 *
 * Q1–Q6: taken in Canvas. No course-website take link, no website
 * fallback blurb, no website answer-review week.
 * X1/X2: keep the website URL first; Canvas is only with staff permission.
 */
export function canvasQuizDescriptionHtml(quiz: CanvasFallbackQuizMeta): string {
  const schedule = getQuizSchedule(quiz.quizId);
  if (!schedule) {
    throw new Error(`Missing quiz schedule for Canvas fallback ${quiz.quizId}`);
  }
  const answersOpen = formatEasternDateTime(schedule.answersOpenAt);
  const answersClose = formatEasternDateTime(schedule.answersCloseAt);
  const answersLine = `<p>Correct answers are available for one week only, from ${answersOpen} until ${answersClose}.</p>`;
  const url = canvasQuizTakeUrl(quiz.quizId);
  if (!url) {
    // Answer visibility for a Canvas-taken quiz is a Canvas quiz setting,
    // so this copy does not promise the website's answer-review week.
    return `<p>${quiz.canvasTitle}. ${CANVAS_QUIZ_TAKEN_HERE_SENTENCE}</p>`;
  }
  return [
    `<p>Take ${quiz.canvasTitle} on the course site:</p>`,
    `<p><a href="${url}">${url}</a></p>`,
    answersLine,
    `<p>${CANVAS_FALLBACK_PERMISSION_BLURB}</p>`,
  ].join("");
}

export function listCanvasQuizFollowupCopy(): Array<{
  quizId: CanvasFallbackQuizId;
  canvasTitle: string;
  /** Course-website take URL (exams only); null for Canvas-taken quizzes. */
  publicUrl: string | null;
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
