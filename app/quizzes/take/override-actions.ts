"use server";

import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  isOverridableQuizId,
  toOverrideView,
  type QuizAccessOverrideView,
} from "@/lib/quiz-exam/access-override";
import { upsertQuizAccessOverride } from "@/lib/quiz-exam/access-overrides";
import type {
  QuizAnswersVisibleMode,
  QuizTakeOverrideMode,
} from "@/lib/quiz-exam/schedule";
import { isMongoConfigured } from "@/lib/config";
import { collectClerkEmails, normalizeEmail } from "@/lib/roster/emails";
import { isCourseSectionId } from "@/lib/roster/sections";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";

export type SetQuizAccessOverrideResult =
  | { ok: true; override: QuizAccessOverrideView }
  | {
      ok: false;
      code: "forbidden" | "not_configured" | "invalid";
      message: string;
    };

const MODES: readonly QuizTakeOverrideMode[] = ["open", "closed", "schedule"];
const ANSWER_MODES: readonly QuizAnswersVisibleMode[] = ["on", "off", "schedule"];

function isOverrideMode(value: string): value is QuizTakeOverrideMode {
  return (MODES as readonly string[]).includes(value);
}

function isAnswersVisibleMode(value: string): value is QuizAnswersVisibleMode {
  return (ANSWER_MODES as readonly string[]).includes(value);
}

async function authorizeStaffWriter(): Promise<
  | { ok: true; email?: string }
  | { ok: false; result: Extract<SetQuizAccessOverrideResult, { ok: false }> }
> {
  if (!isMongoConfigured()) {
    return {
      ok: false,
      result: {
        ok: false,
        code: "not_configured",
        message: "MongoDB is not configured, so overrides cannot be saved.",
      },
    };
  }

  const { isAuthenticated } = await auth();
  const staff = await isActualStaff();
  const impersonating = await isImpersonatingStudent();
  if (!isAuthenticated || !staff || impersonating) {
    return {
      ok: false,
      result: {
        ok: false,
        code: "forbidden",
        message: "Only course staff can change quiz take or answer-key overrides.",
      },
    };
  }

  const user = await currentUser();
  return { ok: true, email: collectClerkEmails(user)[0] };
}

export async function setQuizAccessOverride(input: {
  quizId: string;
  sectionId: string;
  mode: string;
}): Promise<SetQuizAccessOverrideResult> {
  const authz = await authorizeStaffWriter();
  if (!authz.ok) return authz.result;

  const quizId = input.quizId.trim().toLowerCase();
  const sectionId = input.sectionId.trim();
  const mode = input.mode.trim();
  if (!isOverridableQuizId(quizId) || !isCourseSectionId(sectionId) || !isOverrideMode(mode)) {
    return {
      ok: false,
      code: "invalid",
      message: "Unknown quiz, section, or override mode.",
    };
  }

  try {
    const doc = await upsertQuizAccessOverride({
      quizId,
      sectionId,
      mode,
      updatedBy: authz.email ? normalizeEmail(authz.email) : undefined,
    });
    revalidatePath("/quizzes/take");
    revalidatePath(`/quizzes/take/${quizId}`);
    return { ok: true, override: toOverrideView(doc) };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the override.";
    console.error("quiz access override persist failed", message);
    return { ok: false, code: "invalid", message };
  }
}

export async function setQuizAnswersVisible(input: {
  quizId: string;
  sectionId: string;
  answersVisible: string;
}): Promise<SetQuizAccessOverrideResult> {
  const authz = await authorizeStaffWriter();
  if (!authz.ok) return authz.result;

  const quizId = input.quizId.trim().toLowerCase();
  const sectionId = input.sectionId.trim();
  const answersVisible = input.answersVisible.trim();
  if (
    !isOverridableQuizId(quizId) ||
    !isCourseSectionId(sectionId) ||
    !isAnswersVisibleMode(answersVisible)
  ) {
    return {
      ok: false,
      code: "invalid",
      message: "Unknown quiz, section, or answers-visible mode.",
    };
  }

  try {
    const doc = await upsertQuizAccessOverride({
      quizId,
      sectionId,
      answersVisible,
      updatedBy: authz.email ? normalizeEmail(authz.email) : undefined,
    });
    revalidatePath("/quizzes/take");
    revalidatePath(`/quizzes/take/${quizId}`);
    return { ok: true, override: toOverrideView(doc) };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the override.";
    console.error("quiz answers-visible override persist failed", message);
    return { ok: false, code: "invalid", message };
  }
}

/**
 * Set or clear the per-section close. `closesAt` is an ISO instant (the
 * client converts the Eastern Time datetime-local value) or null to clear.
 */
export async function setQuizSectionClose(input: {
  quizId: string;
  sectionId: string;
  closesAt: string | null;
}): Promise<SetQuizAccessOverrideResult> {
  const authz = await authorizeStaffWriter();
  if (!authz.ok) return authz.result;

  const quizId = input.quizId.trim().toLowerCase();
  const sectionId = input.sectionId.trim();
  if (!isOverridableQuizId(quizId) || !isCourseSectionId(sectionId)) {
    return {
      ok: false,
      code: "invalid",
      message: "Unknown quiz or section.",
    };
  }

  const closesAt = parseClosesAtIso(input.closesAt);
  if (closesAt === "invalid") {
    return {
      ok: false,
      code: "invalid",
      message: "Enter a section close time in Eastern Time, or clear it.",
    };
  }

  try {
    const doc = await upsertQuizAccessOverride({
      quizId,
      sectionId,
      closesAt,
      updatedBy: authz.email ? normalizeEmail(authz.email) : undefined,
    });
    revalidatePath("/quizzes/take");
    revalidatePath(`/quizzes/take/${quizId}`);
    return { ok: true, override: toOverrideView(doc) };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the override.";
    console.error("quiz section close persist failed", message);
    return { ok: false, code: "invalid", message };
  }
}

function parseClosesAtIso(value: string | null): Date | null | "invalid" {
  if (value == null || value.trim() === "") return null;
  const trimmed = value.trim();
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      trimmed,
    )
  ) {
    return "invalid";
  }
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return "invalid";
  return date;
}
