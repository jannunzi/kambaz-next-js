import "server-only";

import { getCollection } from "../mongo";
import { courseSectionIdFromRoster } from "../roster/sections";
import {
  planQuizAccessOverrideWrite,
  toOverrideView,
  type QuizAccessOverrideRecord,
  type QuizAccessOverrideView,
} from "./access-override";
import {
  parseInstant,
  type QuizAnswersVisibleMode,
  type QuizTakeOverrideMode,
} from "./schedule";

export const QUIZ_ACCESS_OVERRIDES_COLLECTION = "quiz_access_overrides";

export type QuizAccessOverrideDoc = QuizAccessOverrideRecord & {
  updatedAt: Date;
};

export async function getQuizAccessOverridesCollection() {
  return getCollection<QuizAccessOverrideDoc>(QUIZ_ACCESS_OVERRIDES_COLLECTION);
}

export type QuizAccessForRoster = {
  takeOverride?: QuizTakeOverrideMode;
  answersVisible?: QuizAnswersVisibleMode;
  closesAt?: Date;
  closedAt?: Date;
};

export async function loadTakeOverrideForRoster(
  quizId: string,
  rosterSection: string | undefined | null,
): Promise<QuizTakeOverrideMode | undefined> {
  const access = await loadQuizAccessForRoster(quizId, rosterSection);
  return access.takeOverride;
}

export async function loadAnswersVisibleForRoster(
  quizId: string,
  rosterSection: string | undefined | null,
): Promise<QuizAnswersVisibleMode | undefined> {
  const access = await loadQuizAccessForRoster(quizId, rosterSection);
  return access.answersVisible;
}

export async function loadQuizAccessForRoster(
  quizId: string,
  rosterSection: string | undefined | null,
): Promise<QuizAccessForRoster> {
  const sectionId = courseSectionIdFromRoster(rosterSection);
  if (!sectionId) return {};
  try {
    const doc = await findQuizAccessOverride(quizId, sectionId);
    return {
      takeOverride: doc?.mode,
      answersVisible: doc?.answersVisible,
      closesAt: parseInstant(doc?.closesAt),
      closedAt: parseInstant(doc?.closedAt),
    };
  } catch {
    return {};
  }
}

export async function findQuizAccessOverride(
  quizId: string,
  sectionId: string,
): Promise<QuizAccessOverrideDoc | null> {
  const collection = await getQuizAccessOverridesCollection();
  return collection.findOne({ quizId, sectionId });
}

export async function listQuizAccessOverrides(
  quizIds?: string[],
): Promise<QuizAccessOverrideDoc[]> {
  const collection = await getQuizAccessOverridesCollection();
  const filter = quizIds?.length ? { quizId: { $in: quizIds } } : {};
  return collection.find(filter).toArray();
}

export async function upsertQuizAccessOverride(input: {
  quizId: string;
  sectionId: string;
  mode?: QuizTakeOverrideMode;
  answersVisible?: QuizAnswersVisibleMode;
  /** A Date sets the close. `null` clears it. Omit to leave it unchanged. */
  closesAt?: Date | null;
  updatedBy?: string;
  updatedAt?: Date;
}): Promise<QuizAccessOverrideDoc> {
  const quizId = input.quizId;
  const sectionId = input.sectionId;
  const updatedAt = input.updatedAt ?? new Date();
  const collection = await getQuizAccessOverridesCollection();
  const existing = await collection.findOne({ quizId, sectionId });
  const plan = planQuizAccessOverrideWrite(existing, {
    quizId,
    sectionId,
    mode: input.mode,
    answersVisible: input.answersVisible,
    closesAt: input.closesAt,
    updatedBy: input.updatedBy,
    updatedAt,
  });

  await collection.updateOne(
    { quizId, sectionId },
    {
      $set: plan.$set,
      ...(plan.$setOnInsert ? { $setOnInsert: plan.$setOnInsert } : {}),
      ...(plan.$unset ? { $unset: plan.$unset } : {}),
    },
    { upsert: true },
  );
  const saved = await collection.findOne({ quizId, sectionId });
  if (saved) return saved;
  return {
    quizId,
    sectionId,
    mode: plan.$set.mode ?? existing?.mode ?? "schedule",
    answersVisible:
      plan.$set.answersVisible ?? existing?.answersVisible ?? "schedule",
    closesAt:
      input.closesAt === null
        ? undefined
        : (plan.$set.closesAt ?? existing?.closesAt),
    closedAt: plan.$set.closedAt ?? existing?.closedAt,
    updatedAt,
    updatedBy: input.updatedBy ?? existing?.updatedBy,
  };
}

export function overrideDocsToViews(
  docs: readonly QuizAccessOverrideDoc[],
): QuizAccessOverrideView[] {
  return docs.map(toOverrideView);
}

export async function ensureOverrideIndexes(): Promise<void> {
  const collection = await getQuizAccessOverridesCollection();
  await collection.createIndex({ quizId: 1, sectionId: 1 }, { unique: true });
}
