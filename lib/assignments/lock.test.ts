import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_REOPEN_DAYS,
  NOT_SUBMITTED_CLOSED,
  SECTION_ASSIGNMENT_DUE_DATES,
  SUBMISSIONS_CLOSED,
  activeReopenForStudent,
  addEasternDays,
  assignmentDueInstant,
  assignmentListStatus,
  dueInstantFromDate,
  evaluateSubmissionLock,
  isReopenActive,
  isSubmissionBeforeDue,
  openUntilLine,
  planReopenChange,
  reopenedUntilBadge,
  reopenBadgeForStudent,
  resolveAssignmentDueDate,
  studentLockView,
  type AssignmentReopenRecord,
} from "./lock";

const A1_DUE = "2026-09-28T03:59:00.000Z";
const BEFORE_A1 = new Date("2026-09-28T03:58:59.000Z");
const AT_A1 = new Date(A1_DUE);
const AFTER_A1 = new Date("2026-09-28T03:59:01.000Z");

function reopen(
  partial: Partial<AssignmentReopenRecord> & { closesAt: Date | string },
): AssignmentReopenRecord {
  return {
    assignmentId: "a1",
    rosterEmail: "jane.doe@northeastern.edu",
    clerkUserId: "user_dev",
    message: "Fix the Kambaz nav.",
    openedBy: "ta@northeastern.edu",
    openedAt: new Date("2026-09-28T15:00:00.000Z"),
    action: "open",
    ...partial,
  };
}

describe("assignment due instant", () => {
  it("locks A1 at Sunday 11:59pm ET during daylight time", () => {
    assert.equal(SECTION_ASSIGNMENT_DUE_DATES.length, 0);
    const due = assignmentDueInstant({
      assignmentId: "a1",
      sharedDueDate: "2026-09-27",
    });
    assert.equal(due?.toISOString(), A1_DUE);
    assert.equal(isSubmissionBeforeDue(BEFORE_A1, due), true);
    assert.equal(isSubmissionBeforeDue(AT_A1, due), true);
    assert.equal(isSubmissionBeforeDue(AFTER_A1, due), false);
  });

  it("uses the EST offset for a winter due date", () => {
    assert.equal(
      dueInstantFromDate("2026-01-15")?.toISOString(),
      "2026-01-16T04:59:00.000Z",
    );
  });

  it("shifts the UTC offset across the spring-forward and fall-back boundaries", () => {
    assert.equal(
      dueInstantFromDate("2026-03-07")?.toISOString(),
      "2026-03-08T04:59:00.000Z",
    );
    assert.equal(
      dueInstantFromDate("2026-03-08")?.toISOString(),
      "2026-03-09T03:59:00.000Z",
    );
    assert.equal(
      dueInstantFromDate("2026-11-01")?.toISOString(),
      "2026-11-02T04:59:00.000Z",
    );
    assert.equal(
      dueInstantFromDate("2026-11-02")?.toISOString(),
      "2026-11-03T04:59:00.000Z",
    );
  });

  it("keeps a section override and otherwise uses the shared date", () => {
    const overrides = [
      { assignmentId: "a1", section: "CS4550", dueDate: "2026-09-28" },
    ];
    assert.equal(
      resolveAssignmentDueDate({
        assignmentId: "a1",
        sharedDueDate: "2026-09-27",
        section: "CS4550 CRN 11464",
        sectionDueDates: overrides,
      }),
      "2026-09-28",
    );
    assert.equal(
      assignmentDueInstant({
        assignmentId: "a1",
        sharedDueDate: "2026-09-27",
        section: "CS4550 CRN 11464",
        sectionDueDates: overrides,
      })?.toISOString(),
      "2026-09-29T03:59:00.000Z",
    );
    assert.equal(
      resolveAssignmentDueDate({
        assignmentId: "a1",
        sharedDueDate: "2026-09-27",
        section: "CS5610-02 CRN 17395",
        sectionDueDates: overrides,
      }),
      "2026-09-27",
    );
    assert.equal(
      resolveAssignmentDueDate({
        assignmentId: "a2",
        sharedDueDate: "2026-10-11",
        section: "CS4550",
        sectionDueDates: overrides,
      }),
      "2026-10-11",
    );
  });

  it("stays open when the assignment has no due date", () => {
    const due = assignmentDueInstant({ assignmentId: "a4", sharedDueDate: undefined });
    assert.equal(due, null);
    assert.equal(isSubmissionBeforeDue(AFTER_A1, due), true);
  });
});

describe("reopen window clock", () => {
  it("adds calendar days in Eastern Time across the fall DST change", () => {
    const opened = new Date("2026-10-30T16:00:00.000Z");
    const closes = addEasternDays(opened, 7);
    assert.equal(closes.toISOString(), "2026-11-06T17:00:00.000Z");
    assert.equal(isReopenActive(reopen({ closesAt: closes, openedAt: opened }), new Date("2026-11-06T16:59:59.000Z")), true);
    assert.equal(isReopenActive(reopen({ closesAt: closes, openedAt: opened }), closes), false);
  });

  it("defaults a new window to 7 days and can take an exact ET deadline", () => {
    const now = new Date("2026-09-28T16:00:00.000Z");
    const opened = planReopenChange({
      now,
      action: "open",
      message: "  Please fix the footer.  ",
      history: [],
    });
    assert.equal(opened.ok, true);
    if (!opened.ok) return;
    assert.equal(opened.record.action, "open");
    assert.equal(opened.record.message, "Please fix the footer.");
    assert.equal(
      opened.record.closesAt.toISOString(),
      addEasternDays(now, DEFAULT_REOPEN_DAYS).toISOString(),
    );

    const exact = planReopenChange({
      now,
      action: "open",
      message: "Use this deadline.",
      exactDate: "2026-10-04",
      exactTime: "15:30",
      history: [],
    });
    assert.equal(exact.ok, true);
    if (!exact.ok) return;
    assert.equal(exact.record.closesAt.toISOString(), "2026-10-04T19:30:00.000Z");
  });

  it("rejects a missing message, a past deadline, and a non-positive day count", () => {
    const now = new Date("2026-09-28T16:00:00.000Z");
    assert.equal(
      planReopenChange({ now, action: "open", message: "  ", history: [] }).ok,
      false,
    );
    const past = planReopenChange({
      now,
      action: "open",
      message: "Too late.",
      exactDate: "2026-09-27",
      exactTime: "23:59",
      history: [],
    });
    assert.equal(past.ok, false);
    const zero = planReopenChange({
      now,
      action: "open",
      message: "Zero days.",
      days: 0,
      history: [],
    });
    assert.equal(zero.ok, false);
  });

  it("extends from the current close and can restart from now", () => {
    const now = new Date("2026-09-29T15:00:00.000Z");
    const current = reopen({
      closesAt: new Date("2026-10-05T15:00:00.000Z"),
      openedAt: new Date("2026-09-28T15:00:00.000Z"),
    });
    const extended = planReopenChange({
      now,
      action: "extend",
      message: "Three more days.",
      days: 3,
      history: [current],
    });
    assert.equal(extended.ok, true);
    if (!extended.ok) return;
    assert.equal(extended.record.closesAt.toISOString(), "2026-10-08T15:00:00.000Z");

    const restarted = planReopenChange({
      now,
      action: "restart",
      message: "Clock starts over.",
      days: 7,
      history: [current],
    });
    assert.equal(restarted.ok, true);
    if (!restarted.ok) return;
    assert.equal(
      restarted.record.closesAt.toISOString(),
      addEasternDays(now, 7).toISOString(),
    );
  });

  it("refuses to extend an expired window and closes an open one early", () => {
    const now = new Date("2026-10-06T15:00:00.000Z");
    const expired = reopen({
      closesAt: new Date("2026-10-05T15:00:00.000Z"),
      openedAt: new Date("2026-09-28T15:00:00.000Z"),
    });
    assert.equal(
      planReopenChange({
        now,
        action: "extend",
        message: "Too late to extend.",
        days: 2,
        history: [expired],
      }).ok,
      false,
    );
    const openNow = new Date("2026-09-29T15:00:00.000Z");
    const closed = planReopenChange({
      now: openNow,
      action: "close",
      history: [expired.closesAt ? reopen({
        closesAt: new Date("2026-10-05T15:00:00.000Z"),
        openedAt: new Date("2026-09-28T15:00:00.000Z"),
      }) : expired],
    });
    assert.equal(closed.ok, true);
    if (!closed.ok) return;
    assert.equal(closed.record.action, "close");
    assert.equal(closed.record.closedAt?.toISOString(), openNow.toISOString());
    assert.equal(isReopenActive({ ...expired, ...closed.record, rosterEmail: expired.rosterEmail }, openNow), false);
  });
});

describe("submission lock decision", () => {
  const due = new Date(A1_DUE);
  const student = {
    email: "Jane.Doe@northeastern.edu",
    clerkUserId: "user_prod",
    canvasUserId: "canvas-jane",
  };
  const window = reopen({
    closesAt: new Date("2026-10-05T19:00:00.000Z"),
    clerkUserId: "user_dev",
    rosterEmail: "jane.doe@northeastern.edu",
  });

  it("accepts a normal submit before the due instant even if a reopen exists", () => {
    const decision = evaluateSubmissionLock({
      now: AT_A1,
      dueAt: due,
      reopens: [window],
      student,
      hasSubmission: true,
    });
    assert.deepEqual(decision, { allowed: true, path: "standard" });
  });

  it("rejects after the due instant when nothing is reopened", () => {
    const missing = evaluateSubmissionLock({
      now: AFTER_A1,
      dueAt: due,
      reopens: [],
      student,
      hasSubmission: false,
    });
    assert.deepEqual(missing, {
      allowed: false,
      code: "submissions_closed",
      message: NOT_SUBMITTED_CLOSED,
    });
    const submitted = evaluateSubmissionLock({
      now: AFTER_A1,
      dueAt: due,
      reopens: [],
      student,
      hasSubmission: true,
    });
    assert.equal(submitted.allowed, false);
    if (submitted.allowed) return;
    assert.equal(submitted.message, SUBMISSIONS_CLOSED);
  });

  it("matches a dev Clerk reopen by roster email and treats it as a regrade", () => {
    const decision = evaluateSubmissionLock({
      now: AFTER_A1,
      dueAt: due,
      reopens: [window],
      student,
      hasSubmission: true,
    });
    assert.equal(decision.allowed, true);
    if (!decision.allowed) return;
    assert.equal(decision.path, "regrade");
    const other = evaluateSubmissionLock({
      now: AFTER_A1,
      dueAt: due,
      reopens: [window],
      student: { email: "pat@northeastern.edu", clerkUserId: "user_pat" },
      hasSubmission: true,
    });
    assert.equal(other.allowed, false);
  });

  it("rejects again once the window expires, and accepts after an extension", () => {
    const expired = evaluateSubmissionLock({
      now: new Date("2026-10-05T19:00:00.000Z"),
      dueAt: due,
      reopens: [window],
      student,
      hasSubmission: true,
    });
    assert.equal(expired.allowed, false);

    const extended = reopen({
      action: "extend",
      openedAt: new Date("2026-10-05T18:00:00.000Z"),
      closesAt: new Date("2026-10-08T19:00:00.000Z"),
      message: "Extended.",
    });
    const afterExtend = evaluateSubmissionLock({
      now: new Date("2026-10-05T19:30:00.000Z"),
      dueAt: due,
      reopens: [window, extended],
      student,
      hasSubmission: true,
    });
    assert.equal(afterExtend.allowed, true);
    if (!afterExtend.allowed) return;
    assert.equal(afterExtend.path, "regrade");
    assert.equal(
      activeReopenForStudent([window, extended], student, new Date("2026-10-08T19:00:00.000Z")),
      null,
    );
  });

  it("rejects after an early close even when closesAt is still ahead", () => {
    const closed = reopen({
      action: "close",
      openedAt: new Date("2026-09-29T12:00:00.000Z"),
      closesAt: window.closesAt,
      closedAt: new Date("2026-09-29T12:00:00.000Z"),
      message: window.message,
    });
    const decision = evaluateSubmissionLock({
      now: new Date("2026-09-29T13:00:00.000Z"),
      dueAt: due,
      reopens: [window, closed],
      student,
      hasSubmission: true,
    });
    assert.equal(decision.allowed, false);
  });

  it("describes the student lock, the list badge, and the staff queue badge", () => {
    const closed = studentLockView({
      now: AFTER_A1,
      dueAt: due,
      reopens: [],
      student,
      hasSubmission: true,
      lastSubmittedAt: "2026-09-28T00:52:00.000Z",
    });
    assert.equal(closed.kind, "closed");
    if (closed.kind !== "closed") return;
    assert.equal(closed.heading, "Submissions closed");
    assert.equal(closed.detail, "Last submission Sun, Sep 27, 8:52 PM ET");

    const none = studentLockView({
      now: AFTER_A1,
      dueAt: due,
      reopens: [],
      student,
      hasSubmission: false,
    });
    assert.equal(none.kind, "closed");
    if (none.kind !== "closed") return;
    assert.equal(none.heading, NOT_SUBMITTED_CLOSED);

    const open = studentLockView({
      now: AFTER_A1,
      dueAt: due,
      reopens: [window],
      student,
      hasSubmission: true,
      lastSubmittedAt: "2026-09-28T00:52:00.000Z",
    });
    assert.equal(open.kind, "reopened");
    if (open.kind !== "reopened") return;
    assert.equal(open.message, "Fix the Kambaz nav.");
    assert.equal(open.openUntil, openUntilLine(window.closesAt));
    assert.match(open.openUntil, /^Open until /);

    assert.equal(
      assignmentListStatus({
        assignmentId: "a1",
        hasSubmission: true,
        now: BEFORE_A1,
        dueAt: due,
        reopens: [window],
        student,
      }),
      "submitted",
    );
    assert.equal(
      assignmentListStatus({
        assignmentId: "a1",
        hasSubmission: true,
        staffGrade: { earnedPoints: 95, totalPoints: 100, percent: 95 },
        now: AFTER_A1,
        dueAt: due,
        reopens: [window],
        student,
      }),
      "reopened",
    );
    assert.equal(
      reopenBadgeForStudent([window], student, AFTER_A1)?.label,
      reopenedUntilBadge(window.closesAt),
    );
  });
});
