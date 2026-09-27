import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assignmentDueInstant } from "./lock";
import {
  createAssignmentNotifier,
  formatReopenEmail,
  onAssignmentReopenEvent,
} from "./notify";
import {
  applyAssignmentReopen,
  commitAssignmentSubmission,
  type ReopenStore,
} from "./submit-lock";
import type { AssignmentReopenRecord } from "./lock";
import {
  type AssignmentSubmissionDoc,
  type AssignmentSubmissionHistoryDoc,
  type SubmissionHistoryStore,
  type SubmissionStore,
} from "./submissions-store";

const DUE = assignmentDueInstant({
  assignmentId: "a1",
  sharedDueDate: "2026-09-27",
});
const BEFORE = new Date("2026-09-28T03:59:00.000Z");
const AFTER = new Date("2026-09-28T04:00:00.000Z");

function memoryStores() {
  const docs: AssignmentSubmissionDoc[] = [];
  const history: AssignmentSubmissionHistoryDoc[] = [];
  const reopens: AssignmentReopenRecord[] = [];
  const store: SubmissionStore = {
    async find(clerkUserId, assignmentId) {
      return (
        docs.find(
          (doc) =>
            doc.clerkUserId === clerkUserId && doc.assignmentId === assignmentId,
        ) ?? null
      );
    },
    async upsert(doc) {
      const index = docs.findIndex(
        (row) =>
          row.clerkUserId === doc.clerkUserId &&
          row.assignmentId === doc.assignmentId,
      );
      if (index === -1) docs.push(doc);
      else docs[index] = doc;
    },
    async listByAssignment(assignmentId) {
      return docs.filter((doc) => doc.assignmentId === assignmentId);
    },
  };
  const historyStore: SubmissionHistoryStore = {
    async insert(doc) {
      history.push(doc);
    },
  };
  const reopenStore: ReopenStore = {
    async list(assignmentId) {
      return reopens.filter((row) => row.assignmentId === assignmentId);
    },
    async insert(record) {
      reopens.push(record);
    },
  };
  return { docs, history, reopens, store, historyStore, reopenStore };
}

function priorSubmission(): AssignmentSubmissionDoc {
  return {
    clerkUserId: "user_dev",
    assignmentId: "a1",
    rosterEmail: "jane.doe@northeastern.edu",
    email: "jane.doe@northeastern.edu",
    githubUrl: "https://github.com/jane-doe/webdev-client",
    vercelUrl: "https://jane-dev.vercel.app",
    createdAt: new Date("2026-09-20T15:00:00.000Z"),
    updatedAt: new Date("2026-09-27T15:00:00.000Z"),
    staffGrade: {
      earnedPoints: 80,
      totalPoints: 100,
      percent: 80,
      acceptedProposed: false,
      gradedAt: new Date("2026-09-28T12:00:00.000Z"),
      gradedByEmail: "ta@northeastern.edu",
    },
  };
}

describe("submit API lock", () => {
  it("accepts a normal submit at the due instant and does not flag a regrade", async () => {
    const { docs, history, store, historyStore } = memoryStores();
    const result = await commitAssignmentSubmission({
      now: BEFORE,
      dueAt: DUE,
      reopens: [
        {
          assignmentId: "a1",
          rosterEmail: "jane.doe@northeastern.edu",
          message: "Ignore until after the deadline.",
          openedBy: "ta@northeastern.edu",
          openedAt: new Date("2026-09-27T12:00:00.000Z"),
          closesAt: new Date("2026-10-04T16:00:00.000Z"),
          action: "open",
        },
      ],
      student: {
        clerkUserId: "user_prod",
        rosterEmail: "jane.doe@northeastern.edu",
      },
      prior: priorSubmission(),
      store,
      history: historyStore,
      assignmentId: "a1",
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: "https://jane-prod.vercel.app",
      identity: { rosterEmail: "jane.doe@northeastern.edu" },
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.regrade, false);
    assert.equal("regradeResubmission" in result.doc, false);
    assert.equal(result.doc.vercelUrl, "https://jane-prod.vercel.app");
    assert.equal(history.length, 0);
    assert.equal(docs.length, 1);
  });

  it("rejects after the due date and leaves the store unchanged", async () => {
    const { docs, history, store, historyStore } = memoryStores();
    const existing = priorSubmission();
    docs.push(existing);
    const rejected = await commitAssignmentSubmission({
      now: AFTER,
      dueAt: DUE,
      reopens: [],
      student: {
        clerkUserId: "user_prod",
        rosterEmail: "jane.doe@northeastern.edu",
      },
      prior: existing,
      store,
      history: historyStore,
      assignmentId: "a1",
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: "https://should-not-save.vercel.app",
    });
    assert.deepEqual(rejected, {
      ok: false,
      code: "submissions_closed",
      message: "Submissions closed.",
    });
    assert.equal(docs[0]?.vercelUrl, "https://jane-dev.vercel.app");
    assert.equal(history.length, 0);

    const neverSubmitted = await commitAssignmentSubmission({
      now: AFTER,
      dueAt: DUE,
      student: { clerkUserId: "user_new", rosterEmail: "new@northeastern.edu" },
      store,
      history: historyStore,
      assignmentId: "a1",
      githubUrl: "",
      vercelUrl: "https://new.vercel.app",
    });
    assert.equal(neverSubmitted.ok, false);
    if (neverSubmitted.ok) return;
    assert.equal(neverSubmitted.message, "Not submitted. Submissions closed.");
    assert.equal(docs.length, 1);
  });

  it("accepts a roster-matched regrade and keeps the previous grade", async () => {
    const { docs, history, store, historyStore } = memoryStores();
    const existing = priorSubmission();
    docs.push(existing);
    const result = await commitAssignmentSubmission({
      now: AFTER,
      dueAt: DUE,
      reopens: [
        {
          assignmentId: "a1",
          clerkUserId: "user_dev",
          rosterEmail: "jane.doe@northeastern.edu",
          message: "Resubmit the nav.",
          openedBy: "ta@northeastern.edu",
          openedAt: new Date("2026-09-28T12:00:00.000Z"),
          closesAt: new Date("2026-10-05T16:00:00.000Z"),
          action: "open",
        },
      ],
      student: {
        clerkUserId: "user_prod",
        rosterEmail: "Jane.Doe@northeastern.edu",
      },
      prior: existing,
      store,
      history: historyStore,
      assignmentId: "a1",
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: "https://jane-regrade.vercel.app",
      identity: { rosterEmail: "jane.doe@northeastern.edu" },
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.regrade, true);
    assert.equal(result.doc.regradeResubmission, true);
    assert.equal(result.doc.clerkUserId, "user_prod");
    assert.equal(result.doc.vercelUrl, "https://jane-regrade.vercel.app");
    assert.equal(result.doc.previousStaffGrade?.earnedPoints, 80);
    assert.equal(result.doc.staffGrade?.earnedPoints, 80);
    assert.equal(result.doc.previousSubmission?.clerkUserId, "user_dev");
    assert.equal(result.doc.previousSubmission?.vercelUrl, "https://jane-dev.vercel.app");
    assert.deepEqual(
      history.map((row) => row.kind),
      ["prior", "regrade"],
    );
    assert.equal(history[1]?.regradeResubmission, true);
    assert.equal(history[1]?.vercelUrl, "https://jane-regrade.vercel.app");
    assert.equal(docs[0]?.clerkUserId, "user_dev");
    assert.equal(docs[1]?.clerkUserId, "user_prod");
  });

  it("rejects an expired reopen and accepts after the deadline is extended", async () => {
    const { store, historyStore } = memoryStores();
    const existing = priorSubmission();
    const expired = await commitAssignmentSubmission({
      now: new Date("2026-10-05T16:00:00.000Z"),
      dueAt: DUE,
      reopens: [
        {
          assignmentId: "a1",
          rosterEmail: "jane.doe@northeastern.edu",
          message: "First window.",
          openedBy: "ta@northeastern.edu",
          openedAt: new Date("2026-09-28T12:00:00.000Z"),
          closesAt: new Date("2026-10-05T16:00:00.000Z"),
          action: "open",
        },
      ],
      student: {
        clerkUserId: "user_dev",
        rosterEmail: "jane.doe@northeastern.edu",
      },
      prior: existing,
      store,
      history: historyStore,
      assignmentId: "a1",
      githubUrl: existing.githubUrl,
      vercelUrl: "https://late.vercel.app",
    });
    assert.equal(expired.ok, false);

    const extended = await commitAssignmentSubmission({
      now: new Date("2026-10-05T16:00:00.000Z"),
      dueAt: DUE,
      reopens: [
        {
          assignmentId: "a1",
          rosterEmail: "jane.doe@northeastern.edu",
          message: "First window.",
          openedBy: "ta@northeastern.edu",
          openedAt: new Date("2026-09-28T12:00:00.000Z"),
          closesAt: new Date("2026-10-05T16:00:00.000Z"),
          action: "open",
        },
        {
          assignmentId: "a1",
          rosterEmail: "jane.doe@northeastern.edu",
          message: "Extended through Monday.",
          openedBy: "ta@northeastern.edu",
          openedAt: new Date("2026-10-05T15:00:00.000Z"),
          closesAt: new Date("2026-10-08T16:00:00.000Z"),
          action: "extend",
        },
      ],
      student: {
        clerkUserId: "user_dev",
        rosterEmail: "jane.doe@northeastern.edu",
      },
      prior: existing,
      store,
      history: historyStore,
      assignmentId: "a1",
      githubUrl: existing.githubUrl,
      vercelUrl: "https://extended.vercel.app",
    });
    assert.equal(extended.ok, true);
    if (!extended.ok) return;
    assert.equal(extended.doc.vercelUrl, "https://extended.vercel.app");
    assert.equal(extended.regrade, true);
  });
});

describe("reopen API notices", () => {
  it("stores history, emails on open and extend, and does not email a close", async () => {
    const { reopenStore } = memoryStores();
    const sent: unknown[] = [];
    const seen: string[] = [];
    const unsubscribe = onAssignmentReopenEvent((event) => {
      seen.push(event.action);
    });
    const notifier = {
      async notify(event: { action: string; message: string; closesAt: string | null }) {
        sent.push(event);
        return { delivered: false, channel: "noop" as const };
      },
    };
    const now = new Date("2026-09-28T16:00:00.000Z");
    try {
      const opened = await applyAssignmentReopen({
        store: reopenStore,
        notifier,
        now,
        assignmentId: "a1",
        action: "open",
        message: "Fix the footer links.",
        openedBy: "ta@northeastern.edu",
        student: {
          clerkUserId: "user_dev",
          rosterEmail: "Jane.Doe@northeastern.edu",
          name: "Doe, Jane",
        },
      });
      assert.equal(opened.ok, true);
      if (!opened.ok) return;
      assert.equal(opened.record.rosterEmail, "jane.doe@northeastern.edu");
      assert.equal(opened.event.message, "Fix the footer links.");
      assert.ok(opened.event.closesAt);

      const extended = await applyAssignmentReopen({
        store: reopenStore,
        notifier,
        now: new Date("2026-09-29T16:00:00.000Z"),
        assignmentId: "a1",
        action: "extend",
        message: "Two more days.",
        days: 2,
        openedBy: "ta@northeastern.edu",
        student: { rosterEmail: "jane.doe@northeastern.edu" },
      });
      assert.equal(extended.ok, true);
      if (!extended.ok) return;
      assert.equal(extended.record.action, "extend");

      const closed = await applyAssignmentReopen({
        store: reopenStore,
        notifier,
        now: new Date("2026-09-30T16:00:00.000Z"),
        assignmentId: "a1",
        action: "close",
        openedBy: "ta@northeastern.edu",
        student: { rosterEmail: "jane.doe@northeastern.edu" },
      });
      assert.equal(closed.ok, true);
      assert.deepEqual(seen, ["open", "extend", "close"]);
      assert.equal(sent.length, 2);
      const email = formatReopenEmail(opened.event);
      assert.equal(email?.to, "jane.doe@northeastern.edu");
      assert.match(email?.text ?? "", /Fix the footer links/);
      assert.match(email?.text ?? "", /Open until /);
    } finally {
      unsubscribe();
    }
  });

  it("logs a TODO instead of sending mail", async () => {
    const lines: unknown[] = [];
    const notifier = createAssignmentNotifier(
      { ASSIGNMENT_NOTIFY_PROVIDER: "log" },
      (_message, details) => {
        lines.push(details);
      },
    );
    const delivery = await notifier.notify({
      type: "assignment.reopen",
      action: "open",
      assignmentId: "a1",
      rosterEmail: "jane.doe@northeastern.edu",
      message: "Please resubmit.",
      closesAt: "2026-10-05T16:00:00.000Z",
      openedAt: "2026-09-28T16:00:00.000Z",
      openedBy: "ta@northeastern.edu",
    });
    assert.deepEqual(delivery, { delivered: false, channel: "log" });
    assert.equal(lines.length, 1);
    const logged = lines[0] as { todo: string; email: { to: string } };
    assert.match(logged.todo, /email provider/i);
    assert.equal(logged.email.to, "jane.doe@northeastern.edu");

    const quiet = createAssignmentNotifier({ ASSIGNMENT_NOTIFY_PROVIDER: "noop" }, () => {
      throw new Error("noop should not log");
    });
    const skipped = await quiet.notify({
      type: "assignment.reopen",
      action: "restart",
      assignmentId: "a1",
      rosterEmail: "jane.doe@northeastern.edu",
      message: "Restarted.",
      closesAt: "2026-10-06T16:00:00.000Z",
      openedAt: "2026-09-29T16:00:00.000Z",
      openedBy: "ta@northeastern.edu",
    });
    assert.deepEqual(skipped, { delivered: false, channel: "noop" });
  });
});
