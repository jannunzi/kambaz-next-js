import {
  COURSE_SECTION_IDS,
  courseSectionIdFromRoster,
  isCourseSectionId,
  type CourseSectionId,
} from "../roster/sections";
import {
  canRevealAnswers,
  getAnswerRevealPhase,
  getQuizSchedule,
  isScheduledTakeWindow,
  isTakeWindowOpen,
  listQuizSchedules,
  parseInstant,
  type QuizAnswersVisibleMode,
  type QuizSchedule,
  type QuizTakeOverrideMode,
  type SectionCloseInput,
} from "./schedule";

export type { CourseSectionId, QuizAnswersVisibleMode, QuizTakeOverrideMode };
export { COURSE_SECTION_IDS, courseSectionIdFromRoster, isCourseSectionId };

export type QuizAccessOverrideRecord = {
  quizId: string;
  sectionId: string;
  mode: QuizTakeOverrideMode;
  /** Default `schedule` / unset: follow the per-section close window. */
  answersVisible?: QuizAnswersVisibleMode;
  /** Staff-set stop time. Taking ends at this instant while mode is open. */
  closesAt?: Date | string;
  /**
   * First time staff switched this section from open to closed.
   * Later closed writes do not overwrite it.
   */
  closedAt?: Date | string;
  updatedAt: Date | string;
  updatedBy?: string;
};

export type QuizAccessOverrideView = {
  quizId: string;
  sectionId: string;
  mode: QuizTakeOverrideMode;
  answersVisible: QuizAnswersVisibleMode;
  closesAt?: string;
  closedAt?: string;
  updatedAt: string;
  updatedBy?: string;
};

export function isOverridableQuizId(quizId: string): boolean {
  return Boolean(getQuizSchedule(quizId));
}

export function listOverridableQuizIds(): string[] {
  return listQuizSchedules().map((schedule) => schedule.quizId);
}

/** `open` enables taking. `closed` / `schedule` / unset stay disabled. */
export function activeTakeOverride(
  mode: QuizTakeOverrideMode | undefined | null,
): QuizTakeOverrideMode | undefined {
  return mode === "open" || mode === "closed" ? mode : undefined;
}

export function lookupOverrideMode(
  overrides: readonly QuizAccessOverrideRecord[],
  quizId: string,
  sectionId: string | undefined,
): QuizTakeOverrideMode | undefined {
  if (!sectionId) return undefined;
  return overrides.find(
    (row) => row.quizId === quizId && row.sectionId === sectionId,
  )?.mode;
}

export function lookupAnswersVisible(
  overrides: readonly QuizAccessOverrideRecord[],
  quizId: string,
  sectionId: string | undefined,
): QuizAnswersVisibleMode | undefined {
  if (!sectionId) return undefined;
  return overrides.find(
    (row) => row.quizId === quizId && row.sectionId === sectionId,
  )?.answersVisible;
}

export function answersVisibleForRosterSection(
  overrides: readonly QuizAccessOverrideRecord[],
  quizId: string,
  rosterSection: string | undefined | null,
): QuizAnswersVisibleMode | undefined {
  return lookupAnswersVisible(
    overrides,
    quizId,
    courseSectionIdFromRoster(rosterSection),
  );
}

export function describeAnswersVisible(
  schedule: QuizSchedule,
  override: QuizAnswersVisibleMode | undefined | null,
  now: Date = new Date(),
  sectionClose?: SectionCloseInput | null,
): {
  visible: boolean;
  mode: QuizAnswersVisibleMode;
  scheduledVisible: boolean;
} {
  const mode: QuizAnswersVisibleMode =
    override === "on" || override === "off" ? override : "schedule";
  const phase = getAnswerRevealPhase(
    schedule,
    now,
    true,
    sectionClose?.mode,
    sectionClose,
  );
  return {
    visible: canRevealAnswers(phase, mode),
    mode,
    scheduledVisible: canRevealAnswers(phase),
  };
}

export function takeOverrideForRosterSection(
  overrides: readonly QuizAccessOverrideRecord[],
  quizId: string,
  rosterSection: string | undefined | null,
): QuizTakeOverrideMode | undefined {
  return lookupOverrideMode(
    overrides,
    quizId,
    courseSectionIdFromRoster(rosterSection),
  );
}

export function describeTakeAccess(
  schedule: QuizSchedule,
  override: QuizTakeOverrideMode | undefined | null,
  now: Date = new Date(),
  closesAt?: Date | string | null,
): {
  open: boolean;
  mode: QuizTakeOverrideMode;
  scheduledOpen: boolean;
} {
  const mode: QuizTakeOverrideMode = activeTakeOverride(override) ?? "schedule";
  return {
    open: isTakeWindowOpen(schedule, now, mode, closesAt),
    mode,
    scheduledOpen: isScheduledTakeWindow(schedule, now),
  };
}

/**
 * `closedAt` to store when staff switches open → closed.
 * Returns undefined when the field must be left unchanged, including when
 * a previous close was already recorded.
 */
export function closedAtOnOpenToClosed(input: {
  previousMode?: QuizTakeOverrideMode | null;
  previousClosedAt?: Date | string | null;
  nextMode?: QuizTakeOverrideMode | null;
  now: Date;
}): Date | undefined {
  if (input.nextMode !== "closed") return undefined;
  if (input.previousMode !== "open") return undefined;
  if (parseInstant(input.previousClosedAt)) return undefined;
  return input.now;
}

export function planQuizAccessOverrideWrite(
  previous: Pick<
    QuizAccessOverrideRecord,
    "mode" | "closedAt" | "answersVisible"
  > | null,
  input: {
    quizId: string;
    sectionId: string;
    mode?: QuizTakeOverrideMode;
    answersVisible?: QuizAnswersVisibleMode;
    /** A Date sets the close. `null` clears it. Omit to leave it unchanged. */
    closesAt?: Date | null;
    updatedBy?: string;
    updatedAt: Date;
  },
): {
  $set: {
    quizId: string;
    sectionId: string;
    updatedAt: Date;
    mode?: QuizTakeOverrideMode;
    answersVisible?: QuizAnswersVisibleMode;
    updatedBy?: string;
    closesAt?: Date;
    closedAt?: Date;
  };
  $setOnInsert?: {
    mode?: QuizTakeOverrideMode;
    answersVisible?: QuizAnswersVisibleMode;
  };
  $unset?: { closesAt: "" };
} {
  const $set: {
    quizId: string;
    sectionId: string;
    updatedAt: Date;
    mode?: QuizTakeOverrideMode;
    answersVisible?: QuizAnswersVisibleMode;
    updatedBy?: string;
    closesAt?: Date;
    closedAt?: Date;
  } = {
    quizId: input.quizId,
    sectionId: input.sectionId,
    updatedAt: input.updatedAt,
  };
  if (input.mode) $set.mode = input.mode;
  if (input.answersVisible) $set.answersVisible = input.answersVisible;
  if (input.updatedBy) $set.updatedBy = input.updatedBy;
  if (input.closesAt instanceof Date) $set.closesAt = input.closesAt;

  const recorded = closedAtOnOpenToClosed({
    previousMode: previous?.mode,
    previousClosedAt: previous?.closedAt,
    nextMode: input.mode,
    now: input.updatedAt,
  });
  if (recorded) $set.closedAt = recorded;

  const $setOnInsert: {
    mode?: QuizTakeOverrideMode;
    answersVisible?: QuizAnswersVisibleMode;
  } = {};
  if (!input.mode) $setOnInsert.mode = "schedule";
  if (!input.answersVisible) $setOnInsert.answersVisible = "schedule";

  return {
    $set,
    ...(Object.keys($setOnInsert).length > 0 ? { $setOnInsert } : {}),
    ...(input.closesAt === null ? { $unset: { closesAt: "" as const } } : {}),
  };
}

function instantToIso(value: Date | string | undefined): string | undefined {
  const date = parseInstant(value);
  return date ? date.toISOString() : undefined;
}

export function toOverrideView(
  doc: QuizAccessOverrideRecord,
): QuizAccessOverrideView {
  const updatedAt =
    doc.updatedAt instanceof Date
      ? doc.updatedAt.toISOString()
      : new Date(doc.updatedAt).toISOString();
  return {
    quizId: doc.quizId,
    sectionId: doc.sectionId,
    mode: doc.mode,
    answersVisible:
      doc.answersVisible === "on" || doc.answersVisible === "off"
        ? doc.answersVisible
        : "schedule",
    closesAt: instantToIso(doc.closesAt),
    closedAt: instantToIso(doc.closedAt),
    updatedAt,
    updatedBy: doc.updatedBy,
  };
}

export function overrideKey(quizId: string, sectionId: string): string {
  return `${quizId}:${sectionId}`;
}
