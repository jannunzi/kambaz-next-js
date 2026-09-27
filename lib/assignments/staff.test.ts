import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  adjacentStaffStudentKeys,
  buildStaffStudentQueue,
  assignmentGradeSaveAccess,
  canPersistStaffGrade,
  canViewStaffGrader,
  countStaffGradeFilters,
  filterStaffQueueBySection,
  filterStaffQueueByStatus,
  findStaffStudent,
  hasStaffGradeSave,
  listStaffQueueSections,
  parseStaffStudentKey,
  priorSubmissionLabel,
  resolveStaffGradeFilter,
  resolveStaffGraderView,
  resolveStaffSectionFilter,
  selectRosterSubmission,
  staffGradeFilterLabel,
  staffGraderAccess,
  staffGraderHref,
  staffQueueForSection,
  staffRowSectionLabel,
  studentVisibleSubmission,
  visibleStaffQueue,
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
    assert.equal(queue[1].unmatched, true);
    const counts = countStaffGradeFilters(queue);
    assert.equal(counts.all, 1);
    assert.equal(counts.submitted, 0);
    assert.equal(counts.unmatched, 1);
    assert.equal(counts["not-submitted"], 1);
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
    assert.equal(
      staffGraderHref("a2", { filter: "ungraded", section: "CS4550 CRN 11464" }),
      "/assignments/a2?section=CS4550+CRN+11464&filter=ungraded",
    );
    assert.equal(staffGraderHref("a1", { filter: "all" }), "/assignments/a1");
    assert.equal(staffGraderHref("a1", { filter: "nope" }), "/assignments/a1");
  });
});

describe("staff grading status filter", () => {
  const gradedAt = new Date("2026-09-20T12:00:00.000Z");
  const queue = buildStaffStudentQueue(
    [
      {
        email: "ada@northeastern.edu",
        name: "Ada Submitted",
        section: "CS4550 CRN 11464",
      },
      {
        email: "bea@northeastern.edu",
        name: "Bea Graded",
        section: "CS4550 CRN 11464",
      },
      {
        email: "cyd@northeastern.edu",
        name: "Cyd Missing",
        section: "CS4550 CRN 11464",
      },
      {
        email: "dee@northeastern.edu",
        name: "Dee Other",
        section: "CS5610-02 CRN 17395",
      },
    ],
    [
      submission({
        clerkUserId: "user_ada",
        email: "ada@northeastern.edu",
        name: "Ada Submitted",
        section: "CS4550 CRN 11464",
      }),
      submission({
        clerkUserId: "user_bea",
        email: "bea@northeastern.edu",
        name: "Bea Graded",
        section: "CS4550 CRN 11464",
        githubUrl: "https://github.com/bea/webdev-client",
        vercelUrl: "https://bea-a1.vercel.app",
        staffGrade: {
          earnedPoints: 110,
          totalPoints: 125,
          percent: 88,
          acceptedProposed: false,
          gradedAt,
          gradedByEmail: "staff@northeastern.edu",
        },
      }),
      submission({
        clerkUserId: "user_dee",
        email: "dee@northeastern.edu",
        name: "Dee Other",
        section: "CS5610-02 CRN 17395",
      }),
    ],
  );

  it("keeps roster students with no submission and blank URLs", () => {
    const missing = queue.find((row) => row.email === "cyd@northeastern.edu");
    assert.ok(missing);
    assert.equal(missing.hasSubmission, false);
    assert.equal(missing.githubUrl, undefined);
    assert.equal(missing.vercelUrl, undefined);
    assert.equal(hasStaffGradeSave(missing.staffGrade), false);
    assert.equal(hasStaffGradeSave({} as never), false);
    assert.equal(
      hasStaffGradeSave({ criterionOverrides: {} } as never),
      false,
    );
    assert.equal(
      hasStaffGradeSave({
        criterionOverrides: { "a1-delivery-vercel": true },
      } as never),
      true,
    );
  });

  it("counts All, Submitted, Not submitted, Graded, and Ungraded", () => {
    const counts = countStaffGradeFilters(queue);
    assert.equal(counts.all, 4);
    assert.equal(counts.submitted, 3);
    assert.equal(counts["not-submitted"], 1);
    assert.equal(counts.graded, 1);
    assert.equal(counts.ungraded, 2);
    assert.equal(staffGradeFilterLabel("submitted", counts.submitted), "Submitted (3)");
    assert.equal(resolveStaffGradeFilter(undefined), "all");
    assert.equal(resolveStaffGradeFilter("not_submitted"), "not-submitted");
    assert.equal(resolveStaffGradeFilter("bogus"), "all");
  });

  it("filters by status and composes with the section filter", () => {
    assert.deepEqual(
      filterStaffQueueByStatus(queue, "not-submitted").map((row) => row.email),
      ["cyd@northeastern.edu"],
    );
    assert.deepEqual(
      filterStaffQueueByStatus(queue, "graded").map((row) => row.email),
      ["bea@northeastern.edu"],
    );
    assert.deepEqual(
      filterStaffQueueByStatus(queue, "ungraded").map((row) => row.email),
      ["ada@northeastern.edu", "dee@northeastern.edu"],
    );
    const section = visibleStaffQueue(queue, "CS4550 CRN 11464", "ungraded");
    assert.deepEqual(
      section.map((row) => row.email),
      ["ada@northeastern.edu"],
    );
    const counts = countStaffGradeFilters(
      staffQueueForSection(queue, "CS4550 CRN 11464"),
    );
    assert.equal(counts.all, 3);
    assert.equal(counts.submitted, 2);
    assert.equal(counts["not-submitted"], 1);
    assert.equal(counts.graded, 1);
    assert.equal(counts.ungraded, 1);
    assert.equal(visibleStaffQueue(queue, "CS4550 CRN 11464", "nope").length, 3);
  });

  it("widens the filter when the student is outside it", () => {
    const hidden = resolveStaffGraderView({
      queue,
      section: "CS4550 CRN 11464",
      filter: "ungraded",
      studentKey: "cyd@northeastern.edu",
    });
    assert.equal(hidden.filter, "all");
    assert.equal(hidden.student?.email, "cyd@northeastern.edu");
    assert.equal(hidden.section, "CS4550 CRN 11464");

    const otherSection = resolveStaffGraderView({
      queue,
      section: "CS4550 CRN 11464",
      filter: "submitted",
      studentKey: "dee@northeastern.edu",
    });
    assert.equal(otherSection.filter, "all");
    assert.equal(otherSection.section, "CS5610-02 CRN 17395");
    assert.equal(otherSection.student?.email, "dee@northeastern.edu");
  });
});

describe("duplicate submissions, staff, and demo students", () => {
  const options = {
    instructorEmails: ["jannunzi@gmail.com"],
    taEmails: ["ta@northeastern.edu"],
  };

  it("keeps the newest submission and notes older urls", () => {
    const queue = buildStaffStudentQueue(
      [
        {
          email: "jane@northeastern.edu",
          sisLoginId: "jane@husky.neu.edu",
          name: "Jane Doe",
          section: "CS4550 CRN 11464",
          canvasUserId: "canvas-jane",
        },
      ],
      [
        submission({
          clerkUserId: "user_old",
          email: "jane@husky.neu.edu",
          vercelUrl: "https://jane-old.vercel.app",
          createdAt: new Date("2026-09-01T00:00:00.000Z"),
          updatedAt: new Date("2026-09-01T00:00:00.000Z"),
        }),
        submission({
          clerkUserId: "user_new",
          email: "jane@northeastern.edu",
          vercelUrl: "https://jane-new.vercel.app",
          createdAt: new Date("2026-09-02T00:00:00.000Z"),
          updatedAt: new Date("2026-09-10T00:00:00.000Z"),
        }),
      ],
      options,
    );
    assert.equal(queue.length, 1);
    assert.equal(queue[0].clerkUserId, "user_new");
    assert.equal(queue[0].vercelUrl, "https://jane-new.vercel.app");
    assert.equal(queue[0].unmatched, undefined);
    assert.equal(
      priorSubmissionLabel(queue[0].priorSubmissions),
      "also submitted: https://jane-old.vercel.app, 2026-09-01",
    );
    assert.equal(countStaffGradeFilters(queue).unmatched, 0);
    assert.equal(countStaffGradeFilters(queue).submitted, 1);
  });

  it("breaks a timestamp tie with createdAt and matches canvasUserId", () => {
    const queue = buildStaffStudentQueue(
      [
        {
          email: "pat@northeastern.edu",
          name: "Pat",
          canvasUserId: "canvas-pat",
          section: "CS5610-09 CRN 21441",
        },
      ],
      [
        submission({
          clerkUserId: "older-created",
          canvasUserId: "canvas-pat",
          email: "someone-else@gmail.com",
          vercelUrl: "https://pat-old.vercel.app",
          createdAt: new Date("2026-09-01T00:00:00.000Z"),
          updatedAt: new Date("2026-09-08T00:00:00.000Z"),
        }),
        submission({
          clerkUserId: "newer-created",
          canvasUserId: "canvas-pat",
          email: "someone-else@gmail.com",
          vercelUrl: "https://pat-new.vercel.app",
          createdAt: new Date("2026-09-03T00:00:00.000Z"),
          updatedAt: new Date("2026-09-08T00:00:00.000Z"),
        }),
      ],
      options,
    );
    assert.equal(queue[0].clerkUserId, "newer-created");
    assert.equal(queue[0].vercelUrl, "https://pat-new.vercel.app");
    assert.match(priorSubmissionLabel(queue[0].priorSubmissions), /pat-old.vercel.app/);
  });

  it("drops instructor, TA, and demo students from every count", () => {
    const queue = buildStaffStudentQueue(
      [
        {
          email: "student@northeastern.edu",
          name: "Real Student",
          section: "CS4550 CRN 11464",
        },
        {
          email: "jannunzi@gmail.com",
          name: "Jose",
          section: "CS4550 CRN 11464",
        },
        {
          email: "ada@ada.com",
          name: "Ada Lovelace",
          section: "CS4550 CRN 11464",
          source: "demo",
          canvasUserId: "demo-ada-lovelace",
        },
        {
          email: "bob@bob.com",
          name: "Bob Marley",
          section: "CS5610-02 CRN 17395",
          source: "demo",
        },
      ],
      [
        submission({
          clerkUserId: "jose",
          email: "jannunzi@gmail.com",
          vercelUrl: "https://jose.vercel.app",
        }),
        submission({
          clerkUserId: "ta",
          email: "ta@northeastern.edu",
          vercelUrl: "https://ta.vercel.app",
        }),
        submission({
          clerkUserId: "stranger",
          email: "stranger@gmail.com",
          name: "Stranger",
          vercelUrl: "https://stranger.vercel.app",
        }),
      ],
      options,
    );
    assert.deepEqual(
      queue.map((row) => row.email),
      ["student@northeastern.edu", "stranger@gmail.com"],
    );
    assert.equal(queue[1].unmatched, true);
    const counts = countStaffGradeFilters(queue);
    assert.equal(counts.all, 1);
    assert.equal(counts.submitted, 0);
    assert.equal(counts["not-submitted"], 1);
    assert.equal(counts.graded, 0);
    assert.equal(counts.ungraded, 0);
    assert.equal(counts.unmatched, 1);
    assert.equal(staffGradeFilterLabel("unmatched", 1), "Unmatched (1)");
    assert.equal(
      listStaffQueueSections(queue).includes(UNSECTIONED_LABEL),
      false,
    );
    const widened = resolveStaffGraderView({
      queue,
      filter: "not-submitted",
      studentKey: "stranger@gmail.com",
    });
    assert.equal(widened.filter, "unmatched");
    assert.equal(widened.student?.email, "stranger@gmail.com");
  });

  it("matches QA count parity for a 136-student roster with 10 duplicate submissions", () => {
    const sections = [
      ["CS4550 CRN 11464", 30, 12],
      ["CS5610-02 CRN 17395", 51, 16],
      ["CS5610-09 CRN 21441", 55, 18],
    ] as const;
    const roster: {
      email: string;
      name: string;
      section: string;
      canvasUserId: string;
      sisLoginId?: string;
    }[] = [];
    const submissions: ReturnType<typeof submission>[] = [];
    let index = 0;
    for (const [section, total, submittedCount] of sections) {
      for (let i = 0; i < total; i += 1) {
        const email = `student${index}@northeastern.edu`;
        const alias = `student${index}@husky.neu.edu`;
        roster.push({
          email,
          sisLoginId: index < 10 ? alias : undefined,
          name: `Student ${index}`,
          section,
          canvasUserId: `canvas-${index}`,
        });
        if (i < submittedCount) {
          if (index < 10) {
            submissions.push(
              submission({
                clerkUserId: `old_${index}`,
                email: alias,
                vercelUrl:
                  index < 3
                    ? `https://student${index}-old.vercel.app`
                    : `https://student${index}.vercel.app`,
                createdAt: new Date("2026-09-01T00:00:00.000Z"),
                updatedAt: new Date("2026-09-01T00:00:00.000Z"),
              }),
            );
          }
          submissions.push(
            submission({
              clerkUserId: `new_${index}`,
              email,
              vercelUrl: `https://student${index}.vercel.app`,
              createdAt: new Date("2026-09-02T00:00:00.000Z"),
              updatedAt: new Date("2026-09-12T00:00:00.000Z"),
            }),
          );
        }
        index += 1;
      }
    }
    roster.push(
      {
        email: "jannunzi@gmail.com",
        name: "Jose",
        section: "CS4550 CRN 11464",
        canvasUserId: "jose",
      },
      {
        email: "ada@ada.com",
        name: "Ada Lovelace",
        section: "CS4550 CRN 11464",
        canvasUserId: "demo-ada-lovelace",
        sisLoginId: undefined,
      },
      {
        email: "bob@bob.com",
        name: "Bob Marley",
        section: "CS5610-02 CRN 17395",
        canvasUserId: "demo-bob-marley",
      },
    );
    submissions.push(
      submission({
        clerkUserId: "jose",
        email: "jannunzi@gmail.com",
        vercelUrl: "https://jose.vercel.app",
      }),
      submission({
        clerkUserId: "ada",
        email: "ada@ada.com",
        vercelUrl: "https://ada.vercel.app",
      }),
    );

    const queue = buildStaffStudentQueue(roster, submissions, options);
    const expectCounts = (
      rows: typeof queue,
      all: number,
      submittedCount: number,
      missing: number,
      graded: number,
      ungraded: number,
    ) => {
      const counts = countStaffGradeFilters(rows);
      assert.deepEqual(
        [counts.all, counts.submitted, counts["not-submitted"], counts.graded, counts.ungraded],
        [all, submittedCount, missing, graded, ungraded],
      );
    };

    expectCounts(queue, 136, 46, 90, 0, 46);
    expectCounts(staffQueueForSection(queue, "CS4550 CRN 11464"), 30, 12, 18, 0, 12);
    expectCounts(staffQueueForSection(queue, "CS5610-02 CRN 17395"), 51, 16, 35, 0, 16);
    expectCounts(staffQueueForSection(queue, "CS5610-09 CRN 21441"), 55, 18, 37, 0, 18);
    assert.equal(listStaffQueueSections(queue).includes(UNSECTIONED_LABEL), false);
    assert.equal(
      resolveStaffSectionFilter(UNSECTIONED_LABEL, listStaffQueueSections(queue)),
      undefined,
    );
    assert.equal(countStaffGradeFilters(queue).unmatched, 0);
    const noted = queue.filter((row) => row.priorSubmissions?.length);
    assert.equal(noted.length, 10);
    const differentUrl = noted.filter((row) =>
      row.priorSubmissions?.some((note) => note.url !== row.vercelUrl),
    );
    assert.equal(differentUrl.length, 3);
    assert.equal(
      queue.some((row) => row.email === "jannunzi@gmail.com" || row.email === "ada@ada.com"),
      false,
    );

    const a2 = buildStaffStudentQueue(roster, [], options);
    expectCounts(a2, 136, 0, 136, 0, 0);
    assert.equal(listStaffQueueSections(a2).includes(UNSECTIONED_LABEL), false);
    assert.equal(
      resolveStaffSectionFilter(UNSECTIONED_LABEL, listStaffQueueSections(a2)),
      undefined,
    );
  });

  it("keeps unmatched rows with a section hint under that section", () => {
    const queue = buildStaffStudentQueue(
      [{ email: "on@northeastern.edu", name: "On Roster", section: "CS4550 CRN 11464" }],
      [
        submission({
          clerkUserId: "hinted",
          email: "hinted@gmail.com",
          name: "Hinted",
          section: "CS4550 CRN 11464",
          vercelUrl: "https://hinted.vercel.app",
        }),
        submission({
          clerkUserId: "blank",
          email: "blank@gmail.com",
          name: "Blank",
          vercelUrl: "https://blank.vercel.app",
        }),
      ],
      options,
    );
    assert.equal(listStaffQueueSections(queue).includes(UNSECTIONED_LABEL), false);
    assert.ok(listStaffQueueSections(queue).includes("CS4550 CRN 11464"));
    const sectionRows = staffQueueForSection(queue, "CS4550 CRN 11464");
    assert.equal(
      sectionRows.some((row) => row.email === "hinted@gmail.com" && row.unmatched),
      true,
    );
    assert.equal(sectionRows.some((row) => row.email === "blank@gmail.com"), false);
    const sectionCounts = countStaffGradeFilters(sectionRows);
    assert.equal(sectionCounts.unmatched, 1);
    assert.equal(sectionCounts.submitted, 0);
    assert.equal(countStaffGradeFilters(queue).unmatched, 2);
    const widened = resolveStaffGraderView({
      queue,
      section: "CS5610-02 CRN 17395",
      filter: "all",
      studentKey: "hinted@gmail.com",
    });
    assert.equal(widened.filter, "unmatched");
    assert.equal(widened.section, "CS4550 CRN 11464");
    const blank = resolveStaffGraderView({
      queue,
      section: "CS4550 CRN 11464",
      filter: "all",
      studentKey: "blank@gmail.com",
    });
    assert.equal(blank.filter, "unmatched");
    assert.equal(blank.section, undefined);
  });

  it("records a previously graded older submission with the same percent", () => {
    const queue = buildStaffStudentQueue(
      [
        {
          email: "jane@northeastern.edu",
          name: "Jane Doe",
          section: "CS4550 CRN 11464",
        },
      ],
      [
        submission({
          clerkUserId: "user_old",
          email: "jane@northeastern.edu",
          vercelUrl: "https://jane-old.vercel.app",
          createdAt: new Date("2026-09-01T00:00:00.000Z"),
          updatedAt: new Date("2026-09-01T00:00:00.000Z"),
          staffGrade: {
            earnedPoints: 110,
            totalPoints: 125,
            percent: 88,
            acceptedProposed: true,
            gradedAt: new Date("2026-09-02T12:00:00.000Z"),
          },
        }),
        submission({
          clerkUserId: "user_new",
          email: "jane@northeastern.edu",
          vercelUrl: "https://jane-new.vercel.app",
          createdAt: new Date("2026-09-03T00:00:00.000Z"),
          updatedAt: new Date("2026-09-10T00:00:00.000Z"),
        }),
      ],
      options,
    );
    assert.equal(
      priorSubmissionLabel(queue[0].priorSubmissions),
      "also submitted: https://jane-old.vercel.app, 2026-09-01; previously graded: 110 / 125 (88.0%) on 2026-09-02 for https://jane-old.vercel.app",
    );
  });
});
