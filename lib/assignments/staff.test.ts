import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  adjacentStaffStudentKeys,
  buildStaffStudentQueue,
  assignmentGradeSaveAccess,
  canPersistStaffGrade,
  canViewStaffGrader,
  filterStaffQueueBySection,
  findStaffStudent,
  listStaffQueueSections,
  parseStaffStudentKey,
  resolveStaffSectionFilter,
  selectRosterSubmission,
  staffGraderAccess,
  staffGraderHref,
  staffQueueForSection,
  staffRowSectionLabel,
  studentVisibleSubmission,
  UNSECTIONED_LABEL,
} from "./staff";
import {
  statusForAssignment,
  storedSubmissionLinks,
  submittedBannerHeading,
} from "./submission-status";
import {
  upsertAssignmentSubmission,
  type AssignmentSubmissionDoc,
  type SubmissionStore,
} from "./submissions-store";

function submission(
  partial: Partial<AssignmentSubmissionDoc> & { clerkUserId: string },
): AssignmentSubmissionDoc {
  return {
    assignmentId: "a1",
    githubUrl: "https://github.com/jane-doe/webdev-client",
    vercelUrl: "https://jane-a1.vercel.app",
    createdAt: new Date("2026-09-05T12:00:00.000Z"),
    updatedAt: new Date("2026-09-05T12:00:00.000Z"),
    ...partial,
  };
}

describe("staff grader access helpers", () => {
  it("is staff-only and hidden while impersonating", () => {
    assert.deepEqual(
      staffGraderAccess({ isActualStaff: false, impersonating: false }),
      { canView: false, canPersist: false },
    );
    assert.equal(canViewStaffGrader(false, false), false);
    assert.equal(canViewStaffGrader(false, true), false);
    assert.equal(canViewStaffGrader(true, true), false);
    assert.equal(canViewStaffGrader(true, false), true);
  });

  it("does not persist staff grades while impersonating", () => {
    assert.equal(canPersistStaffGrade(true, true), false);
    assert.equal(canPersistStaffGrade(true, false), true);
    assert.equal(canPersistStaffGrade(false, false), false);
  });

  it("rejects Save unless the caller is signed-in allowlist staff", () => {
    assert.deepEqual(
      assignmentGradeSaveAccess({
        isAuthenticated: false,
        isActualStaff: false,
        impersonating: false,
      }),
      { ok: false, code: "unauthenticated" },
    );
    assert.deepEqual(
      assignmentGradeSaveAccess({
        isAuthenticated: true,
        isActualStaff: false,
        impersonating: false,
      }),
      { ok: false, code: "forbidden" },
    );
    assert.deepEqual(
      assignmentGradeSaveAccess({
        isAuthenticated: true,
        isActualStaff: true,
        impersonating: true,
      }),
      { ok: false, code: "forbidden" },
    );
    assert.deepEqual(
      assignmentGradeSaveAccess({
        isAuthenticated: true,
        isActualStaff: true,
        impersonating: false,
      }),
      { ok: true },
    );
  });
});

describe("staff student queue", () => {
  it("joins roster entries to submissions and keeps students without a URL", () => {
    const queue = buildStaffStudentQueue(
      [
        {
          email: "jane.doe@northeastern.edu",
          name: "Doe, Jane",
          section: "CS4550-01",
          canvasUserId: "c1",
        },
        {
          email: "pat@northeastern.edu",
          name: "Pat Lee",
          section: "CS4550-01",
        },
      ],
      [
        submission({
          clerkUserId: "user_jane",
          rosterEmail: "Jane.Doe@northeastern.edu",
          email: "jane.doe@northeastern.edu",
          name: "Jane Doe",
          vercelUrl: "https://jane-a1.vercel.app",
        }),
      ],
    );
    assert.equal(queue.length, 2);
    assert.equal(queue[0].email, "jane.doe@northeastern.edu");
    assert.equal(queue[0].hasSubmission, true);
    assert.equal(queue[0].clerkUserId, "user_jane");
    assert.equal(queue[0].vercelUrl, "https://jane-a1.vercel.app");
    assert.equal(queue[1].email, "pat@northeastern.edu");
    assert.equal(queue[1].hasSubmission, false);
  });

  it("uses the newest submission when two Clerk accounts match one roster student", () => {
    const older = submission({
      clerkUserId: "user_old",
      email: "jane.personal@gmail.com",
      canvasUserId: "c1",
      githubUrl: "https://github.com/jane-doe/old",
      vercelUrl: "https://old.vercel.app",
      updatedAt: new Date("2026-09-20T15:00:00.000Z"),
    });
    const newer = submission({
      clerkUserId: "user_new",
      rosterEmail: "Jane.Doe@northeastern.edu",
      email: "jane.doe@northeastern.edu",
      canvasUserId: "c1",
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: "https://jane-new.vercel.app",
      updatedAt: new Date("2026-09-28T00:52:00.000Z"),
      staffGrade: {
        earnedPoints: 95,
        totalPoints: 100,
        percent: 95,
        acceptedProposed: false,
        gradedAt: new Date("2026-09-28T01:15:00.000Z"),
      },
    });
    const rosterEntry = {
      email: "jane.doe@northeastern.edu",
      name: "Doe, Jane",
      canvasUserId: "c1",
    };

    const selected = selectRosterSubmission(rosterEntry, [older, newer]);
    assert.equal(selected?.clerkUserId, "user_new");
    assert.equal(selected?.vercelUrl, "https://jane-new.vercel.app");
    assert.equal(
      selectRosterSubmission(rosterEntry, [newer, older])?.clerkUserId,
      "user_new",
    );

    const visible = studentVisibleSubmission({
      clerkUserId: "user_old",
      rosterEntry,
      submissions: [older, newer],
    });
    assert.equal(visible?.clerkUserId, "user_new");
    assert.equal(visible?.githubUrl, "https://github.com/jane-doe/webdev-client");
    assert.equal(
      statusForAssignment({
        assignmentId: "a1",
        hasSubmission: Boolean(visible),
        staffGrade: visible?.staffGrade,
      }),
      "graded",
    );

    const queue = buildStaffStudentQueue([rosterEntry], [older, newer]);
    assert.equal(queue.length, 1);
    assert.equal(queue[0].clerkUserId, "user_new");
    assert.equal(queue[0].vercelUrl, "https://jane-new.vercel.app");
    assert.equal(queue[0].hasSubmission, true);
    assert.equal(queue[0].staffGrade?.earnedPoints, 95);
  });

  it("finds a development Clerk submission when only rosterEmail matches", async () => {
    const devSubmission = submission({
      clerkUserId: "user_dev",
      rosterEmail: "Jane.Doe@northeastern.edu",
      email: "jane.doe@northeastern.edu",
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: "https://jane-dev.vercel.app",
      updatedAt: new Date("2026-09-22T16:00:00.000Z"),
    });
    const someoneElse = submission({
      clerkUserId: "user_other",
      rosterEmail: "pat@northeastern.edu",
      email: "pat@northeastern.edu",
      githubUrl: "https://github.com/pat/webdev-client",
      vercelUrl: "https://pat.vercel.app",
      updatedAt: new Date("2026-09-27T16:00:00.000Z"),
    });
    const rosterEntry = {
      email: "jane.doe@northeastern.edu",
      name: "Doe, Jane",
    };

    const visible = studentVisibleSubmission({
      clerkUserId: "user_prod",
      rosterEntry,
      submissions: [someoneElse, devSubmission],
    });
    assert.equal(visible?.clerkUserId, "user_dev");
    assert.notEqual(visible?.clerkUserId, "user_prod");
    assert.equal(visible?.githubUrl, "https://github.com/jane-doe/webdev-client");
    assert.equal(visible?.vercelUrl, "https://jane-dev.vercel.app");
    assert.equal(
      statusForAssignment({
        assignmentId: "a1",
        hasSubmission: Boolean(visible),
        staffGrade: visible?.staffGrade,
      }),
      "submitted",
    );
    assert.equal(
      submittedBannerHeading(visible?.updatedAt),
      "Submitted Tue, Sep 22, 12:00 PM ET",
    );
    assert.deepEqual(
      storedSubmissionLinks({
        githubUrl: visible?.githubUrl,
        vercelUrl: visible?.vercelUrl,
      }).map((link) => link.url),
      [
        "https://github.com/jane-doe/webdev-client",
        "https://jane-dev.vercel.app",
      ],
    );
    assert.equal(
      selectRosterSubmission(rosterEntry, [devSubmission, someoneElse])?.clerkUserId,
      "user_dev",
    );

    const store: SubmissionStore = (() => {
      const docs: AssignmentSubmissionDoc[] = [];
      return {
        async find(clerkUserId, assignmentId) {
          return (
            docs.find(
              (doc) =>
                doc.clerkUserId === clerkUserId &&
                doc.assignmentId === assignmentId,
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
      };
    })();
    const resubmitted = await upsertAssignmentSubmission(
      store,
      {
        clerkUserId: "user_prod",
        assignmentId: "a1",
        githubUrl: "https://github.com/jane-doe/webdev-client",
        vercelUrl: "https://jane-prod.vercel.app",
        identity: {
          email: "jane.doe@northeastern.edu",
          rosterEmail: "jane.doe@northeastern.edu",
        },
      },
      new Date("2026-09-28T00:52:00.000Z"),
    );
    assert.equal(resubmitted.clerkUserId, "user_prod");
    assert.equal(resubmitted.rosterEmail, "jane.doe@northeastern.edu");
    assert.equal(
      (await store.find("user_prod", "a1"))?.rosterEmail,
      "jane.doe@northeastern.edu",
    );

    const afterResubmit = [devSubmission, resubmitted];
    const queue = buildStaffStudentQueue([rosterEntry], afterResubmit);
    assert.equal(queue.length, 1);
    assert.equal(queue[0].clerkUserId, "user_prod");
    assert.equal(queue[0].email, "jane.doe@northeastern.edu");
    assert.equal(queue[0].vercelUrl, "https://jane-prod.vercel.app");
    const visibleAfter = studentVisibleSubmission({
      clerkUserId: "user_prod",
      rosterEntry,
      submissions: afterResubmit,
    });
    assert.equal(visibleAfter?.clerkUserId, "user_prod");
    assert.equal(visibleAfter?.rosterEmail, "jane.doe@northeastern.edu");
    assert.equal(visibleAfter?.vercelUrl, "https://jane-prod.vercel.app");
  });

  it("appends unmatched submissions after the roster", () => {
    const queue = buildStaffStudentQueue(
      [{ email: "on-roster@northeastern.edu", name: "On Roster" }],
      [
        submission({
          clerkUserId: "user_orphan",
          email: "orphan@northeastern.edu",
          name: "Orphan",
        }),
      ],
    );
    assert.equal(queue.length, 2);
    assert.equal(queue[0].email, "on-roster@northeastern.edu");
    assert.equal(queue[1].key, "orphan@northeastern.edu");
    assert.equal(queue[1].hasSubmission, true);
  });

  it("walks previous/next keys for the navigator", () => {
    const queue = buildStaffStudentQueue(
      [
        { email: "a@northeastern.edu", name: "Ada" },
        { email: "b@northeastern.edu", name: "Bea" },
        { email: "c@northeastern.edu", name: "Cyd" },
      ],
      [],
    );
    const mid = adjacentStaffStudentKeys(queue, "b@northeastern.edu");
    assert.equal(mid.previous, "a@northeastern.edu");
    assert.equal(mid.next, "c@northeastern.edu");
    assert.equal(findStaffStudent(queue, "B@northeastern.edu")?.name, "Bea");
    assert.equal(adjacentStaffStudentKeys(queue, "a@northeastern.edu").previous, null);
    assert.deepEqual(parseStaffStudentKey("Pat@Northeastern.edu"), {
      email: "pat@northeastern.edu",
    });
    assert.deepEqual(parseStaffStudentKey("clerk:user_1"), {
      clerkUserId: "user_1",
    });
  });
});

describe("staff queue section filter", () => {
  const queue = buildStaffStudentQueue(
    [
      {
        email: "ug@northeastern.edu",
        name: "Ada Undergrad",
        section: "CS4550 CRN 11464",
      },
      {
        email: "grad-a@northeastern.edu",
        name: "Bea Grad",
        section: "CS5610-02 CRN 17395",
      },
      {
        email: "grad-b@northeastern.edu",
        name: "Cyd Grad",
        section: "CS5610-09 CRN 17396",
      },
      { email: "pat@northeastern.edu", name: "Pat Lee" },
    ],
    [],
  );

  it("lists stored Canvas section labels, including Unsectioned", () => {
    assert.deepEqual(listStaffQueueSections(queue), [
      "CS4550 CRN 11464",
      "CS5610-02 CRN 17395",
      "CS5610-09 CRN 17396",
      UNSECTIONED_LABEL,
    ]);
    assert.equal(staffRowSectionLabel({ section: "  CS4550  " }), "CS4550");
    assert.equal(staffRowSectionLabel({}), UNSECTIONED_LABEL);
  });

  it("returns the full queue for All (empty, missing, or unknown section)", () => {
    assert.equal(filterStaffQueueBySection(queue, undefined).length, 4);
    assert.equal(filterStaffQueueBySection(queue, "").length, 4);
    assert.equal(staffQueueForSection(queue, "not-a-section").length, 4);
    assert.equal(resolveStaffSectionFilter("CS4550 CRN 11464", listStaffQueueSections(queue)), "CS4550 CRN 11464");
    assert.equal(resolveStaffSectionFilter("nope", listStaffQueueSections(queue)), undefined);
  });

  it("filters to one section and walks prev/next on that subset", () => {
    const cs561002 = staffQueueForSection(queue, "CS5610-02 CRN 17395");
    assert.deepEqual(
      cs561002.map((row) => row.email),
      ["grad-a@northeastern.edu"],
    );
    const cs4550 = staffQueueForSection(queue, "CS4550 CRN 11464");
    assert.equal(cs4550.length, 1);
    assert.equal(cs4550[0].name, "Ada Undergrad");

    const twoGrads = staffQueueForSection(
      [
        ...queue,
        ...buildStaffStudentQueue(
          [
            {
              email: "grad-c@northeastern.edu",
              name: "Dee Grad",
              section: "CS5610-02 CRN 17395",
            },
          ],
          [],
        ),
      ],
      "CS5610-02 CRN 17395",
    );
    assert.equal(twoGrads.length, 2);
    const mid = adjacentStaffStudentKeys(twoGrads, "grad-c@northeastern.edu");
    assert.equal(mid.previous, "grad-a@northeastern.edu");
    assert.equal(mid.next, null);
    assert.equal(mid.index, 1);
  });

  it("builds shareable assignment URLs with section and student", () => {
    assert.equal(staffGraderHref("a1"), "/assignments/a1");
    assert.equal(
      staffGraderHref("a1", { section: "CS5610-02 CRN 17395" }),
      "/assignments/a1?section=CS5610-02+CRN+17395",
    );
    assert.equal(
      staffGraderHref("a1", {
        section: "CS4550 CRN 11464",
        student: "ug@northeastern.edu",
      }),
      "/assignments/a1?section=CS4550+CRN+11464&student=ug%40northeastern.edu",
    );
  });
});
