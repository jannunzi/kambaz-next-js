import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { A1_RUBRIC } from "./a1";
import {
  A1_MANUAL_CRITERION_IDS,
  a1CriterionCoverage,
  evaluateRubricSpec,
} from "./a1-rubric";
import { A2_RUBRIC } from "./a2";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import { listCanvasFollowupCopy, listCanvasQuizFollowupCopy } from "./canvas-copy";
import { supportsUrlSubmission } from "./access";
import {
  COURSE_SITE_ORIGIN,
  findCriterion,
  getAssignment,
  listAssignmentIds,
  listAssignments,
  listRubricCriteria,
  nestRubricCriteria,
  rubricPointTotal,
} from "./catalog";
import type { AssignmentCheckResult } from "./check-types";
import { clearLegacyAssignmentProgressStorage } from "./clear-legacy-progress";
import {
  applyCriterionToggle,
  completedIdsAfterAutoCheckRun,
  loadCompletedCriterionIds,
  mergeCompletedIds,
  replaceCompletedCriterionIds,
  summarizeProgress,
  upsertCriterionProgress,
  type ProgressStore,
} from "./progress-store";
import { studentAutoPoints, type CriterionGradeRow } from "./grade-rows";
import type { AssignmentProgressDoc } from "./types";

function autoResult(
  criterionId: string,
  passed: boolean,
  extra: Partial<AssignmentCheckResult> = {},
): AssignmentCheckResult {
  return {
    id: criterionId,
    label: criterionId,
    passed,
    message: passed ? "ok" : "missing",
    criterionId,
    ...extra,
  };
}

function memoryProgressStore(): ProgressStore {
  const docs: AssignmentProgressDoc[] = [];
  return {
    async list(clerkUserId, assignmentId) {
      return docs.filter(
        (doc) =>
          doc.clerkUserId === clerkUserId && doc.assignmentId === assignmentId,
      );
    },
    async upsert(input) {
      const index = docs.findIndex(
        (doc) =>
          doc.clerkUserId === input.clerkUserId &&
          doc.assignmentId === input.assignmentId &&
          doc.criterionId === input.criterionId,
      );
      const next: AssignmentProgressDoc = {
        ...input,
        updatedAt: new Date(),
      };
      if (index === -1) docs.push(next);
      else docs[index] = next;
    },
  };
}

describe("assignment catalog", () => {
  it("lists A1–A6 from the syllabus and marks A1/A2 ready", () => {
    const ids = listAssignmentIds();
    assert.deepEqual(ids, ["a1", "a2", "a3", "a4", "a5", "a6"]);
    const items = listAssignments();
    assert.equal(items.length, 6);
    assert.equal(getAssignment("A1")?.status, "ready");
    assert.equal(getAssignment("a2")?.status, "ready");
    assert.equal(getAssignment("a3")?.status, "coming_soon");
    assert.equal(getAssignment("a1")?.dueDate, "2026-09-27");
    assert.equal(getAssignment("a2")?.dueDate, "2026-10-11");
    assert.equal(getAssignment("a3")?.dueDate, "2026-10-25");
    assert.equal(getAssignment("a4")?.dueDate, undefined);
    assert.equal(getAssignment("a5")?.dueDate, undefined);
    assert.equal(getAssignment("a6")?.dueDate, undefined);
    assert.equal(getAssignment("a1")?.assignedDate, "2026-09-14");
    assert.equal(getAssignment("a2")?.assignedDate, "2026-09-27");
    assert.equal(getAssignment("a3")?.assignedDate, "2026-10-11");
    assert.equal(getAssignment("a4")?.assignedDate, "2026-10-25");
    assert.equal(getAssignment("a5")?.assignedDate, undefined);
    assert.equal(getAssignment("a6")?.assignedDate, undefined);
    assert.equal(getAssignment("a1")?.chapterHref, "/book/ch1");
    assert.match(getAssignment("a1")?.summary ?? "", /Labs/i);
    assert.match(getAssignment("a1")?.summary ?? "", /Kambaz/i);
    assert.doesNotMatch(getAssignment("a1")?.summary ?? "", /Best \/ Better/);
    for (const item of items) {
      const chapterNumber = item.id.slice(1);
      assert.equal(item.chapterHref, `/book/ch${chapterNumber}`);
      assert.ok(item.chapterTitle.length > 0);
      assert.equal(
        item.publicUrl,
        `${COURSE_SITE_ORIGIN}/assignments/${item.id}`,
      );
    }
  });

  it("lists Canvas follow-up URLs without dumping the rubric", () => {
    const copy = listCanvasFollowupCopy();
    assert.equal(copy.length, 6);
    assert.deepEqual(
      copy.map((row) => row.publicUrl),
      [
        "https://kambaz.dev/assignments/a1",
        "https://kambaz.dev/assignments/a2",
        "https://kambaz.dev/assignments/a3",
        "https://kambaz.dev/assignments/a4",
        "https://kambaz.dev/assignments/a5",
        "https://kambaz.dev/assignments/a6",
      ],
    );
    for (const row of copy) {
      assert.match(row.html, /same Northeastern email you use on Canvas/);
      assert.match(row.html, /Sign up on the course site/i);
      assert.match(row.html, /not pre-provisioned/i);
      assert.match(row.html, /This site is not Canvas/i);
      assert.match(row.html, /map site progress back to the roster/i);
      assert.doesNotMatch(row.html, /school email is fine/i);
      assert.doesNotMatch(row.html, /Clerk|rubric|Best \/ Better/i);
    }
  });

  it("re-exports Canvas quiz copy: quizzes in Canvas, exams keep the website URL", () => {
    const quizzes = listCanvasQuizFollowupCopy();
    assert.equal(quizzes.length, 8);
    assert.doesNotMatch(quizzes[0]?.html ?? "", /quizzes\/take/);
    assert.match(quizzes[0]?.html ?? "", /taken here in Canvas/);
    assert.doesNotMatch(quizzes[0]?.html ?? "", /Clerk|Kambaz|Lab [0-9]/);
    const x1 = quizzes.find((row) => row.quizId === "x1");
    assert.match(x1?.html ?? "", /quizzes\/take\/x1/);
    assert.match(x1?.html ?? "", /permission to take this Canvas quiz instead/);
  });

  it("keeps unique criterion ids and book deep links on A1 and A2", () => {
    for (const rubric of [A1_RUBRIC, A2_RUBRIC]) {
      const criteria = listRubricCriteria(rubric);
      const ids = criteria.map((row) => row.id);
      assert.equal(new Set(ids).size, ids.length);
      assert.ok(criteria.length > 0);
      assert.ok(rubricPointTotal(rubric) > 0);
      for (const row of criteria) {
        assert.ok(row.points > 0);
        assert.ok(row.bookHref, `${row.id} is missing bookHref`);
        assert.match(row.bookHref ?? "", /^\/book\/ch[1-6]#sec-/);
      }
      assert.ok(findCriterion(rubric, criteria[0].id));
    }
    assert.equal(
      A1_RUBRIC.groups.map((group) => group.id).join(","),
      "delivery,lab,kambaz",
    );
    assert.ok(findCriterion(A1_RUBRIC, "a1-lab-heading-tags"));
    assert.equal(findCriterion(A1_RUBRIC, "a1-lab-heading-tags")?.parentLabel, "HeadingTags");
    assert.equal(findCriterion(A1_RUBRIC, "a1-lab-heading-tags")?.label, "Lab component");
    assert.ok(findCriterion(A1_RUBRIC, "a1-lab-heading-tags-ai")?.withAI);
    assert.equal(findCriterion(A1_RUBRIC, "a1-lab-heading-tags-ai")?.label, "With AI");
    assert.ok(findCriterion(A1_RUBRIC, "a1-delivery-labs-nav"));
    assert.equal(
      A1_RUBRIC.groups.find((group) => group.id === "delivery")?.criteria.length,
      3,
    );
    assert.ok(
      nestRubricCriteria(
        A1_RUBRIC.groups.find((group) => group.id === "delivery")?.criteria ?? [],
      ).every((block) => block.type === "single"),
    );
    assert.ok(
      A1_RUBRIC.groups
        .find((group) => group.id === "lab")
        ?.criteria.some((row) => row.id === "a1-delivery-labs-nav"),
    );
    const nameAndSection = findCriterion(A1_RUBRIC, "a1-delivery-name-section");
    assert.equal(nameAndSection?.label, "Name on Labs");
    assert.equal(nameAndSection?.description, ASSIGNMENT_STUDENT_COPY.nameAndSection);
    assert.match(nameAndSection?.description ?? "", /full Canvas name on Labs/i);
    assert.match(nameAndSection?.description ?? "", /first then last/i);
    assert.match(nameAndSection?.description ?? "", /matching the roster/i);
    assert.match(
      nameAndSection?.description ?? "",
      /no Name and section checkbox or control in Run checks/i,
    );
    const deliveryIntro =
      A1_RUBRIC.groups.find((group) => group.id === "delivery")?.intro ?? "";
    assert.ok(deliveryIntro.includes(ASSIGNMENT_STUDENT_COPY.nameAndSectionDeliveryNote));
    assert.match(
      deliveryIntro,
      /full Canvas name on Labs \(first then last, matching the roster\)/i,
    );
    assert.match(deliveryIntro, /checked automatically/i);
    assert.match(deliveryIntro, /not a checkbox or control in Run checks/i);
    assert.match(deliveryIntro, /section is not checked/i);
    // Keep asking for the ids, but never say graders look for them.
    assert.match(deliveryIntro, /Keep the wd-github id/);
    assert.match(deliveryIntro, /the ids help us test your work/);
    assert.doesNotMatch(deliveryIntro, /graders (still )?look for/i);
    for (const row of listRubricCriteria(A1_RUBRIC)) {
      assert.doesNotMatch(row.description ?? "", /required ids/i, row.id);
    }
    const labIntro = A1_RUBRIC.groups.find((group) => group.id === "lab")?.intro ?? "";
    assert.match(labIntro, /Manual check badge/i);
    assert.match(labIntro, /staff grade that row on your deploy URL/i);
    assert.match(labIntro, /never marks it pass or fail/i);
    assert.match(labIntro, /not a failed auto check/i);
    assert.match(labIntro, /does not mean you lost points/i);
    assert.ok(findCriterion(A1_RUBRIC, "a1-kambaz-assignments")?.onYourOwn);
    assert.equal(supportsUrlSubmission("a1"), true);

    const autoIds = listRubricCriteria(A1_RUBRIC)
      .filter((row) => a1CriterionCoverage(row.id) === "auto")
      .map((row) => row.id);
    const manualIds = listRubricCriteria(A1_RUBRIC)
      .filter((row) => a1CriterionCoverage(row.id) === "manual")
      .map((row) => row.id);
    assert.ok(autoIds.includes("a1-delivery-vercel"));
    assert.ok(autoIds.includes("a1-lab-forms"));
    assert.ok(autoIds.includes("a1-kambaz-account"));
    assert.deepEqual(manualIds, [...A1_MANUAL_CRITERION_IDS]);

    const heading = evaluateRubricSpec(
      {
        criterionId: "a1-lab-heading-tags",
        groupId: "lab",
        label: "HeadingTags",
        kind: "headings",
        requireAllIds: ["wd-h-tag"],
        headingLevels: [1, 2, 3, 4, 5, 6],
        passMessage: "ok",
        failMessage: "missing",
      },
      "<div id=\"wd-h-tag\"><h1></h1><h2></h2><h3></h3><h4></h4><h5></h5><h6></h6></div>",
    );
    assert.equal(heading.passed, true);
    const headingFail = evaluateRubricSpec(
      {
        criterionId: "a1-lab-heading-tags",
        groupId: "lab",
        label: "HeadingTags",
        kind: "headings",
        requireAllIds: ["wd-h-tag"],
        headingLevels: [1, 2, 3, 4, 5, 6],
        passMessage: "ok",
        failMessage: "missing",
      },
      "<div id=\"wd-h-tag\"><h4>Heading Tags</h4></div>",
    );
    assert.equal(headingFail.passed, false);
    assert.equal(supportsUrlSubmission("a2"), true);
  });
});

describe("assignment progress helpers", () => {
  it("toggles, merges, and summarizes checklist progress", () => {
    const assignment = getAssignment("a1");
    assert.ok(assignment?.rubric);
    let completed = applyCriterionToggle([], "a1-delivery-vercel", true);
    completed = applyCriterionToggle(completed, "a1-delivery-github", true);
    completed = applyCriterionToggle(completed, "a1-delivery-github", false);
    assert.deepEqual(completed, ["a1-delivery-vercel"]);
    assert.deepEqual(
      mergeCompletedIds(completed, ["a1-delivery-github", "a1-delivery-vercel"]),
      ["a1-delivery-github", "a1-delivery-vercel"],
    );
    const summary = summarizeProgress(assignment, completed);
    assert.equal(summary.completedCount, 1);
    assert.equal(summary.earnedPoints, 3);
    assert.equal(summary.totalCount, listRubricCriteria(assignment.rubric).length);
    assert.equal(summary.totalPoints, rubricPointTotal(assignment.rubric));
  });

  it("drops a stale completed id when a later auto-check fails or omits it", () => {
    const previous = [
      "a1-delivery-vercel",
      "a1-lab-tables",
      "a1-lab-highlighted-paragraph-oyo",
    ];
    assert.deepEqual(
      completedIdsAfterAutoCheckRun(previous, [
        autoResult("a1-delivery-vercel", false),
        autoResult("a1-lab-tables", true),
      ]),
      ["a1-lab-tables"],
    );
    assert.deepEqual(
      completedIdsAfterAutoCheckRun(previous, [
        autoResult("a1-lab-tables", true),
      ]),
      ["a1-lab-tables"],
    );
    assert.deepEqual(completedIdsAfterAutoCheckRun(previous, []), []);
    assert.deepEqual(
      completedIdsAfterAutoCheckRun(previous, [
        autoResult("a1-lab-highlighted-paragraph-oyo", false, { skipped: true }),
      ]),
      [],
    );
  });

  it("replaces stored progress so a later fail unchecks the stale id", async () => {
    const store = memoryProgressStore();
    await upsertCriterionProgress(store, {
      clerkUserId: "user_1",
      assignmentId: "a1",
      criterionId: "a1-delivery-vercel",
      completed: true,
    });
    await upsertCriterionProgress(store, {
      clerkUserId: "user_1",
      assignmentId: "a1",
      criterionId: "a1-lab-tables",
      completed: true,
    });
    const afterFail = completedIdsAfterAutoCheckRun(
      ["a1-delivery-vercel", "a1-lab-tables"],
      [
        autoResult("a1-delivery-vercel", false),
        autoResult("a1-lab-tables", true),
      ],
    );
    assert.deepEqual(
      await replaceCompletedCriterionIds(store, {
        clerkUserId: "user_1",
        assignmentId: "a1",
        allCriterionIds: [
          "a1-delivery-vercel",
          "a1-lab-tables",
          "a1-lab-highlighted-paragraph-oyo",
        ],
        completedIds: afterFail,
      }),
      ["a1-lab-tables"],
    );
    assert.deepEqual(await loadCompletedCriterionIds(store, "user_1", "a1"), [
      "a1-lab-tables",
    ]);
  });

  it("drops legacy assignmentProgress localStorage keys only", () => {
    const map = new Map<string, string>([
      ["webdev.assignmentProgress.a1", "{\"completed\":[\"a1-delivery-vercel\"]}"],
      ["webdev.assignmentProgress.a2", "[]"],
      ["webdev.syllabus.section", "01"],
    ]);
    const storage = {
      get length() {
        return map.size;
      },
      key(index: number) {
        return [...map.keys()][index] ?? null;
      },
      removeItem(key: string) {
        map.delete(key);
      },
    };
    const removed = clearLegacyAssignmentProgressStorage(storage);
    assert.deepEqual(removed.sort(), [
      "webdev.assignmentProgress.a1",
      "webdev.assignmentProgress.a2",
    ]);
    assert.deepEqual([...map.keys()], ["webdev.syllabus.section"]);
  });

  it("does not count manual rows in the student auto total", () => {
    const assignment = getAssignment("a1");
    assert.ok(assignment?.rubric);
    const manualId = A1_MANUAL_CRITERION_IDS[0];
    const manual = listRubricCriteria(assignment.rubric).find(
      (row) => row.id === manualId,
    );
    assert.ok(manual);
    const rows: CriterionGradeRow[] = [
      {
        criterionId: "a1-delivery-vercel",
        maxPoints: 3,
        autoPassed: true,
        overridePassed: true,
        points: 3,
      },
      {
        criterionId: manual.id,
        maxPoints: manual.points,
        autoPassed: false,
        overridePassed: true,
        points: manual.points,
      },
    ];
    assert.deepEqual(
      studentAutoPoints(rows, new Set(A1_MANUAL_CRITERION_IDS)),
      { earnedPoints: 3, totalPoints: 3, percent: 100 },
    );
    const summary = summarizeProgress(assignment, ["a1-delivery-vercel"]);
    assert.equal(summary.earnedPoints, 3);
  });

  it("upserts per clerk user + assignment + criterion", async () => {
    const store = memoryProgressStore();
    await upsertCriterionProgress(store, {
      clerkUserId: "user_1",
      assignmentId: "a1",
      criterionId: "a1-delivery-vercel",
      completed: true,
    });
    await upsertCriterionProgress(store, {
      clerkUserId: "user_1",
      assignmentId: "a1",
      criterionId: "a1-delivery-github",
      completed: true,
    });
    await upsertCriterionProgress(store, {
      clerkUserId: "user_2",
      assignmentId: "a1",
      criterionId: "a1-delivery-vercel",
      completed: true,
    });
    await upsertCriterionProgress(store, {
      clerkUserId: "user_1",
      assignmentId: "a1",
      criterionId: "a1-delivery-github",
      completed: false,
    });
    assert.deepEqual(
      await loadCompletedCriterionIds(store, "user_1", "a1"),
      ["a1-delivery-vercel"],
    );
    assert.deepEqual(await loadCompletedCriterionIds(store, "user_2", "a1"), [
      "a1-delivery-vercel",
    ]);
    assert.equal(applyCriterionToggle([], "x", true).includes("x"), true);
  });
});
