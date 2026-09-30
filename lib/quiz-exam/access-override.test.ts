import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COURSE_SECTION_IDS,
  courseSectionIdFromRoster,
} from "../roster/sections";
import {
  activeTakeOverride,
  answersVisibleForRosterSection,
  closedAtOnOpenToClosed,
  describeAnswersVisible,
  describeTakeAccess,
  isOverridableQuizId,
  listOverridableQuizIds,
  lookupAnswersVisible,
  lookupOverrideMode,
  planQuizAccessOverrideWrite,
  takeOverrideForRosterSection,
  toOverrideView,
} from "./access-override";
import { drawWebsiteAttempt } from "./website-draw";
import {
  answerWindowCopy,
  canRevealAnswers,
  etWallTimeToUtc,
  getAnswerRevealPhase,
  getQuizSchedule,
  isScheduledTakeWindow,
  isTakeWindowOpen,
} from "./schedule";
import { runExamSubmit } from "./submit";
import type { QuizAttemptDoc } from "./types";

function et(year: number, month: number, day: number, hour = 0, minute = 0) {
  return etWallTimeToUtc(year, month, day, hour, minute);
}

const q1 = getQuizSchedule("q1");
assert.ok(q1);

describe("course section ids for quiz overrides", () => {
  it("maps roster labels and short ids to CS4550 / CS5610-02 / CS5610-09", () => {
    assert.deepEqual([...COURSE_SECTION_IDS], [
      "CS4550",
      "CS5610-02",
      "CS5610-09",
    ]);
    assert.equal(courseSectionIdFromRoster("CS4550"), "CS4550");
    assert.equal(courseSectionIdFromRoster("CS4550 CRN 11464"), "CS4550");
    assert.equal(courseSectionIdFromRoster("  CS5610-02 CRN 17395 "), "CS5610-02");
    assert.equal(courseSectionIdFromRoster("CS5610-09 CRN 17396"), "CS5610-09");
    assert.equal(courseSectionIdFromRoster("Impersonation"), undefined);
    assert.equal(courseSectionIdFromRoster(""), undefined);
    assert.equal(courseSectionIdFromRoster("CS5610"), undefined);
  });
});

describe("per-section take overrides", () => {
  const beforeUnlock = et(2026, 9, 20, 12);
  const duringWindow = et(2026, 9, 23, 12);
  const afterLock = et(2026, 9, 28, 12);

  it("keeps taking closed on the date window unless staff Enable", () => {
    assert.equal(isScheduledTakeWindow(q1, duringWindow), true);
    assert.equal(isTakeWindowOpen(q1, beforeUnlock), false);
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, "schedule"), false);
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, undefined), false);
    assert.equal(isTakeWindowOpen(q1, duringWindow), false);
    assert.equal(isTakeWindowOpen(q1, duringWindow, "schedule"), false);
    assert.equal(isTakeWindowOpen(q1, afterLock, "schedule"), false);
    assert.equal(getAnswerRevealPhase(q1, beforeUnlock, false), "take_closed");
    assert.equal(
      getAnswerRevealPhase(q1, duringWindow, false, "schedule"),
      "take_closed",
    );
    assert.equal(activeTakeOverride("schedule"), undefined);
    assert.equal(activeTakeOverride(undefined), undefined);
    assert.deepEqual(describeTakeAccess(q1, "schedule", duringWindow), {
      open: false,
      mode: "schedule",
      scheduledOpen: true,
    });
  });

  it("force-opens a quiz before the scheduled unlock", () => {
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, "open"), true);
    assert.equal(
      getAnswerRevealPhase(q1, beforeUnlock, false, "open"),
      "take_open",
    );
    assert.deepEqual(describeTakeAccess(q1, "open", beforeUnlock), {
      open: true,
      mode: "open",
      scheduledOpen: false,
    });
  });

  it("force-closes a quiz during the scheduled window", () => {
    assert.equal(isTakeWindowOpen(q1, duringWindow, "closed"), false);
    assert.equal(
      getAnswerRevealPhase(q1, duringWindow, false, "closed"),
      "take_closed",
    );
    assert.deepEqual(describeTakeAccess(q1, "closed", duringWindow), {
      open: false,
      mode: "closed",
      scheduledOpen: true,
    });
  });

  it("does not apply section A’s override to section B", () => {
    const overrides = [
      {
        quizId: "q1",
        sectionId: "CS4550",
        mode: "open" as const,
        updatedAt: beforeUnlock,
      },
      {
        quizId: "q1",
        sectionId: "CS5610-02",
        mode: "closed" as const,
        updatedAt: duringWindow,
      },
    ];
    const a = takeOverrideForRosterSection(
      overrides,
      "q1",
      "CS4550 CRN 11464",
    );
    const b = takeOverrideForRosterSection(
      overrides,
      "q1",
      "CS5610-09 CRN 17396",
    );
    const c = takeOverrideForRosterSection(
      overrides,
      "q1",
      "CS5610-02 CRN 17395",
    );
    assert.equal(a, "open");
    assert.equal(b, undefined);
    assert.equal(c, "closed");
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, a), true);
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, b), false);
    assert.equal(isTakeWindowOpen(q1, duringWindow, c), false);
    assert.equal(
      lookupOverrideMode(overrides, "q2", "CS4550"),
      undefined,
    );
  });

  it("Disable / Off (dates only) both block taking; Enable is required", () => {
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, "open"), true);
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, "schedule"), false);
    assert.equal(isTakeWindowOpen(q1, duringWindow, "closed"), false);
    assert.equal(isTakeWindowOpen(q1, duringWindow, "schedule"), false);
    assert.equal(
      getAnswerRevealPhase(q1, beforeUnlock, false, "schedule"),
      "take_closed",
    );
    assert.equal(
      getAnswerRevealPhase(q1, duringWindow, false, "schedule"),
      "take_closed",
    );
    assert.equal(
      getAnswerRevealPhase(q1, duringWindow, false, "open"),
      "take_open",
    );
  });

  it("does not reveal answers from the class calendar just because taking was overridden", () => {
    assert.equal(
      getAnswerRevealPhase(q1, duringWindow, true, "open"),
      "submitted_waiting",
    );
    assert.equal(
      getAnswerRevealPhase(q1, afterLock, true, "closed"),
      "submitted_waiting",
    );
    assert.equal(
      getAnswerRevealPhase(q1, afterLock, true, "closed", {
        mode: "closed",
        closedAt: et(2026, 9, 21, 12),
      }),
      "answers_open",
    );
    assert.equal(
      getAnswerRevealPhase(q1, afterLock, false, "open"),
      "take_open",
    );
  });

  it("covers Q1–Q6 and X1/X2 take windows", () => {
    assert.deepEqual(listOverridableQuizIds(), [
      "q1",
      "q2",
      "q3",
      "q4",
      "q5",
      "q6",
      "x1",
      "x2",
    ]);
    assert.equal(isOverridableQuizId("q1"), true);
    assert.equal(isOverridableQuizId("x1"), true);
    assert.equal(isOverridableQuizId("x2"), true);
  });

  it("uses section-closed copy instead of the date-window message", () => {
    const copy = answerWindowCopy(q1, "take_closed", duringWindow, "closed");
    assert.match(copy.title, /disabled for your section/i);
    assert.match(copy.paragraphs.join(" "), /your section/);
    assert.match(copy.paragraphs.join(" "), /Syllabus window/);
  });

  it("serializes override audit fields for the staff panel", () => {
    const view = toOverrideView({
      quizId: "q1",
      sectionId: "CS4550",
      mode: "open",
      updatedAt: new Date("2026-09-28T16:00:00.000Z"),
      updatedBy: "jannunzi@gmail.com",
    });
    assert.equal(view.updatedAt, "2026-09-28T16:00:00.000Z");
    assert.equal(view.updatedBy, "jannunzi@gmail.com");
    assert.equal(view.mode, "open");
    assert.equal(view.answersVisible, "schedule");
  });
});

describe("per-section answers-visible overrides", () => {
  const waiting = et(2026, 9, 27, 12);
  const reviewOpen = et(2026, 9, 29, 12);

  it("defaults to hidden until the section close window", () => {
    assert.equal(canRevealAnswers("submitted_waiting"), false);
    assert.equal(canRevealAnswers("submitted_waiting", "schedule"), false);
    assert.equal(canRevealAnswers("submitted_waiting", undefined), false);
    assert.equal(canRevealAnswers("answers_open"), true);
    assert.equal(canRevealAnswers("answers_open", "schedule"), true);
    assert.deepEqual(describeAnswersVisible(q1, "schedule", waiting), {
      visible: false,
      mode: "schedule",
      scheduledVisible: false,
    });
    assert.deepEqual(describeAnswersVisible(q1, undefined, reviewOpen), {
      visible: false,
      mode: "schedule",
      scheduledVisible: false,
    });
    const closesAt = et(2026, 9, 22, 12);
    assert.deepEqual(
      describeAnswersVisible(q1, undefined, reviewOpen, {
        mode: "open",
        closesAt,
      }),
      {
        visible: true,
        mode: "schedule",
        scheduledVisible: true,
      },
    );
  });

  it("staff On shows answers before the review week", () => {
    assert.equal(canRevealAnswers("submitted_waiting", "on"), true);
    assert.equal(canRevealAnswers("answers_closed", "on"), true);
    assert.deepEqual(describeAnswersVisible(q1, "on", waiting), {
      visible: true,
      mode: "on",
      scheduledVisible: false,
    });
    const copy = answerWindowCopy(q1, "submitted_waiting", waiting, undefined, "on");
    assert.match(copy.title, /answers are visible/i);
    assert.match(copy.paragraphs.join(" "), /turned on the answer key/i);
  });

  it("staff Off hides answers during the review week", () => {
    assert.equal(canRevealAnswers("answers_open", "off"), false);
    assert.equal(canRevealAnswers("answers_reopen", "off"), false);
    assert.deepEqual(
      describeAnswersVisible(q1, "off", reviewOpen, {
        mode: "open",
        closesAt: et(2026, 9, 22, 12),
      }),
      {
        visible: false,
        mode: "off",
        scheduledVisible: true,
      },
    );
    const copy = answerWindowCopy(q1, "answers_open", reviewOpen, undefined, "off");
    assert.match(copy.title, /answers are hidden/i);
    assert.match(copy.paragraphs.join(" "), /hid the answer key/i);
    assert.match(copy.paragraphs.join(" "), /score/i);
  });

  it("does not apply section A’s answers override to section B", () => {
    const overrides = [
      {
        quizId: "q1",
        sectionId: "CS4550",
        mode: "open" as const,
        answersVisible: "on" as const,
        updatedAt: waiting,
      },
      {
        quizId: "q1",
        sectionId: "CS5610-02",
        mode: "open" as const,
        answersVisible: "off" as const,
        updatedAt: reviewOpen,
      },
    ];
    assert.equal(
      answersVisibleForRosterSection(overrides, "q1", "CS4550 CRN 11464"),
      "on",
    );
    assert.equal(
      answersVisibleForRosterSection(overrides, "q1", "CS5610-09 CRN 17396"),
      undefined,
    );
    assert.equal(
      answersVisibleForRosterSection(overrides, "q1", "CS5610-02 CRN 17395"),
      "off",
    );
    assert.equal(lookupAnswersVisible(overrides, "q2", "CS4550"), undefined);
  });

  it("keeps take enable and answers-visible independent", () => {
    const view = toOverrideView({
      quizId: "q1",
      sectionId: "CS4550",
      mode: "closed",
      answersVisible: "on",
      updatedAt: waiting,
      updatedBy: "jannunzi@gmail.com",
    });
    assert.equal(view.mode, "closed");
    assert.equal(view.answersVisible, "on");
    assert.equal(isTakeWindowOpen(q1, waiting, view.mode), false);
    assert.equal(canRevealAnswers("submitted_waiting", view.answersVisible), true);
  });
});

describe("submit honors the same per-section take override", () => {
  const drawn = drawWebsiteAttempt("q1", "override-submit");

  it("accepts a persisted submit when force-open before unlock", async () => {
    const stored: QuizAttemptDoc[] = [];
    const result = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers: {},
      startedAt: "2026-09-27T12:00:00.000Z",
      now: et(2026, 9, 27, 12),
      takeOverride: "open",
      actor: { clerkUserId: "user_early", email: "early@northeastern.edu" },
      roster: {
        status: "matched",
        entry: {
          email: "early@northeastern.edu",
          section: "CS4550 CRN 11464",
        },
      },
      persist: async (doc) => {
        stored.push(doc);
        return { insertedId: "early_1" };
      },
    });
    assert.equal(result.ok, true);
    assert.equal(stored.length, 1);
  });

  it("rejects a persisted submit when staff never enabled (schedule during the window)", async () => {
    const stored: QuizAttemptDoc[] = [];
    const result = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers: {},
      startedAt: "2026-09-23T16:00:00.000Z",
      now: et(2026, 9, 23, 12),
      takeOverride: "schedule",
      actor: { clerkUserId: "user_dates", email: "dates@northeastern.edu" },
      roster: {
        status: "matched",
        entry: {
          email: "dates@northeastern.edu",
          section: "CS4550 CRN 11464",
        },
      },
      persist: async (doc) => {
        stored.push(doc);
        return { insertedId: "nope-dates" };
      },
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "take_closed");
    assert.equal(stored.length, 0);
  });

  it("rejects a persisted submit after the section closesAt while still enabled", async () => {
    const stored: QuizAttemptDoc[] = [];
    const closesAt = et(2026, 10, 4, 23, 59);
    const result = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers: {},
      startedAt: "2026-10-04T12:00:00.000Z",
      now: closesAt,
      takeOverride: "open",
      sectionClose: { mode: "open", closesAt },
      actor: { clerkUserId: "user_late_section", email: "late@northeastern.edu" },
      roster: {
        status: "matched",
        entry: {
          email: "late@northeastern.edu",
          section: "CS5610-09 CRN 17396",
        },
      },
      persist: async (doc) => {
        stored.push(doc);
        return { insertedId: "late-section" };
      },
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "take_closed");
    assert.equal(stored.length, 0);
  });

  it("rejects a persisted submit when force-closed during the window", async () => {
    const stored: QuizAttemptDoc[] = [];
    const result = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers: {},
      startedAt: "2026-09-29T12:00:00.000Z",
      now: et(2026, 9, 29, 12),
      takeOverride: "closed",
      actor: { clerkUserId: "user_closed", email: "closed@northeastern.edu" },
      roster: {
        status: "matched",
        entry: {
          email: "closed@northeastern.edu",
          section: "CS5610-02 CRN 17395",
        },
      },
      persist: async (doc) => {
        stored.push(doc);
        return { insertedId: "nope" };
      },
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "take_closed");
    assert.equal(stored.length, 0);
  });

  it("includes the answer key on submit when staff On before the review week", async () => {
    const result = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers: {},
      startedAt: "2026-09-27T12:00:00.000Z",
      now: et(2026, 9, 27, 12),
      takeOverride: "open",
      answersVisible: "on",
      actor: { clerkUserId: "user_show", email: "show@northeastern.edu" },
      roster: {
        status: "matched",
        entry: {
          email: "show@northeastern.edu",
          section: "CS4550 CRN 11464",
        },
      },
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.window?.phase, "submitted_waiting");
      assert.equal(result.window?.revealAnswers, true);
      assert.equal(result.window?.answersVisible, "on");
      assert.ok(result.graded.every((item) => typeof item.correctReveal === "string"));
    }
  });

  it("strips the answer key on submit when staff Off during the review week", async () => {
    const result = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers: {},
      startedAt: "2026-09-29T12:00:00.000Z",
      now: et(2026, 9, 29, 12),
      takeOverride: "open",
      answersVisible: "off",
      sectionClose: { mode: "open", closesAt: et(2026, 9, 22, 12) },
      actor: { clerkUserId: "user_hide", email: "hide@northeastern.edu" },
      roster: {
        status: "matched",
        entry: {
          email: "hide@northeastern.edu",
          section: "CS4550 CRN 11464",
        },
      },
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.window?.phase, "answers_open");
      assert.equal(result.window?.revealAnswers, false);
      assert.equal(result.window?.answersVisible, "off");
      for (const item of result.graded) {
        assert.equal("correctReveal" in item, false);
        assert.equal("correct" in item, false);
      }
    }
  });
});

describe("closedAt is recorded once", () => {
  const t1 = et(2026, 10, 4, 23, 59);
  const t2 = et(2026, 10, 5, 9);
  const base = {
    quizId: "q1",
    sectionId: "CS5610-09",
  };

  it("sets closedAt on the first open → closed switch", () => {
    const plan = planQuizAccessOverrideWrite(
      { mode: "open" },
      { ...base, mode: "closed", updatedAt: t1 },
    );
    assert.equal(plan.$set.closedAt, t1);
    assert.equal(
      closedAtOnOpenToClosed({
        previousMode: "open",
        nextMode: "closed",
        now: t1,
      }),
      t1,
    );
  });

  it("does not overwrite an existing closedAt", () => {
    const stayingClosed = planQuizAccessOverrideWrite(
      { mode: "closed", closedAt: t1 },
      { ...base, mode: "closed", updatedAt: t2 },
    );
    assert.equal(stayingClosed.$set.closedAt, undefined);

    const closedAgain = planQuizAccessOverrideWrite(
      { mode: "open", closedAt: t1 },
      { ...base, mode: "closed", updatedAt: t2 },
    );
    assert.equal(closedAgain.$set.closedAt, undefined);
    assert.equal(
      closedAtOnOpenToClosed({
        previousMode: "open",
        previousClosedAt: t1,
        nextMode: "closed",
        now: t2,
      }),
      undefined,
    );
  });

  it("does not record closedAt unless the previous mode was open", () => {
    const fromSchedule = planQuizAccessOverrideWrite(
      { mode: "schedule" },
      { ...base, mode: "closed", updatedAt: t1 },
    );
    assert.equal(fromSchedule.$set.closedAt, undefined);
    const createdClosed = planQuizAccessOverrideWrite(null, {
      ...base,
      mode: "closed",
      updatedAt: t1,
    });
    assert.equal(createdClosed.$set.closedAt, undefined);
  });

  it("sets and clears closesAt without moving closedAt", () => {
    const set = planQuizAccessOverrideWrite(
      { mode: "open", closedAt: t1 },
      { ...base, closesAt: t2, updatedAt: t2 },
    );
    assert.equal(set.$set.closesAt, t2);
    assert.equal(set.$set.closedAt, undefined);
    assert.equal(set.$unset, undefined);

    const cleared = planQuizAccessOverrideWrite(
      { mode: "open", closedAt: t1 },
      { ...base, closesAt: null, updatedAt: t2 },
    );
    assert.equal(cleared.$set.closesAt, undefined);
    assert.equal(cleared.$set.closedAt, undefined);
    assert.deepEqual(cleared.$unset, { closesAt: "" });
  });
});
