import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { A1_RUBRIC } from "./a1";
import {
  A1_LAB_EXERCISES,
  A1_LAB_EXERCISE_SECTIONS,
  LAB_EXERCISE_KIND_LABELS,
  a1LabCriteria,
  a1LabManualIds,
  flattenLabExercises,
} from "./a1-lab-exercises";
import { nestRubricCriteria } from "./catalog";
import { A1_MANUAL_CRITERION_IDS, evaluateRubricSpec } from "./a1-rubric";

const LAB_SECTIONS = [
  "1.3.1",
  "1.3.2",
  "1.3.3",
  "1.3.4",
  "1.3.5",
  "1.3.6",
  "1.3.7",
  "1.3.8",
  "1.3.9",
  "1.3.10",
  "1.3.11",
];

const PARENT_LABELS = [
  "HeadingTags",
  "ParagraphTag",
  "ListTags",
  "Tables",
  "Images",
  "Forms",
  "HighlightedParagraph",
  "HighlightedBox",
  "AnchorTag",
  "Labs navigation",
  "Labs TOC and layout",
];

describe("A1 Lab catalog / §1.3.12 parity", () => {
  it("nests one parent per 1.3.1–1.3.11 section with lettered a/b/c tasks", () => {
    assert.equal(A1_LAB_EXERCISE_SECTIONS.length, 11);
    assert.deepEqual(
      A1_LAB_EXERCISE_SECTIONS.map((section) => section.section),
      LAB_SECTIONS,
    );
    assert.deepEqual(
      A1_LAB_EXERCISE_SECTIONS.map((section) => section.label),
      PARENT_LABELS,
    );
    assert.equal(new Set(PARENT_LABELS).size, PARENT_LABELS.length);
    for (const section of A1_LAB_EXERCISE_SECTIONS) {
      assert.deepEqual(
        section.tasks.map((task) => task.kind),
        ["core", "oyo", "ai"],
        `${section.section} should be Lab component, On your own, With AI`,
      );
      assert.equal(section.tasks.length, 3);
    }
    assert.deepEqual(
      A1_LAB_EXERCISES.map((row) => row.id),
      flattenLabExercises(A1_LAB_EXERCISE_SECTIONS).map((row) => row.id),
    );
    assert.ok(
      A1_LAB_EXERCISES.every((row) => row.label !== row.parentLabel),
      "sub-task labels must not repeat the parent title",
    );
    assert.deepEqual(
      [...new Set(A1_LAB_EXERCISES.map((row) => row.label))].sort(),
      Object.values(LAB_EXERCISE_KIND_LABELS).slice().sort(),
    );
  });

  it("tells Forms With AI to reuse wd-your-form on the same YourForm file", () => {
    const section = A1_LAB_EXERCISE_SECTIONS.find((row) => row.section === "1.3.6");
    assert.ok(section);
    const oyo = section.tasks.find((task) => task.id === "a1-lab-forms-oyo");
    const ai = section.tasks.find((task) => task.id === "a1-lab-forms-ai");
    assert.ok(oyo);
    assert.ok(ai);
    assert.equal(oyo.points, 3);
    assert.equal(ai.points, 2);
    assert.equal(ai.auto, undefined);
    assert.deepEqual(oyo.auto?.requireAllIds, ["wd-your-form"]);
    assert.match(ai.description, /app\/labs\/lab1\/forms\/YourForm\.tsx/);
    assert.match(ai.description, /same id as On your own/);
    assert.match(ai.description, /wd-your-form/);
    assert.match(ai.description, /No second file/);
    assert.match(ai.description, /no new form id/);
    assert.match(ai.description, /wd-ai-form/);
    assert.match(ai.description, /wd-ai-your-form/);
    assert.match(ai.description, /Unlike earlier With AI steps/);
    assert.match(ai.description, /Forms\.tsx still imports that one YourForm only/);
  });

  it("treats §1.3.1 h1–h6 as practice added on top of the h4 book sample", () => {
    const section = A1_LAB_EXERCISE_SECTIONS.find((row) => row.section === "1.3.1");
    assert.ok(section);
    const core = section.tasks.find((task) => task.kind === "core");
    const ai = section.tasks.find((task) => task.kind === "ai");
    assert.ok(core);
    assert.ok(ai);
    assert.match(core.description, /book sample/);
    assert.match(core.description, /Before With AI, add h1–h6 as practice/);
    assert.match(core.description, /without erasing that sample text/);
    assert.doesNotMatch(core.description, /sample h1–h6/);
    assert.match(ai.description, /After the practice h1–h6 headings you added/);
    assert.doesNotMatch(ai.description, /sample h1/);
    assert.match(ai.description, /Keep the book sample text/);
    assert.match(core.auto?.failMessage ?? "", /h1–h6 headings you add as practice/);
    assert.doesNotMatch(core.auto?.failMessage ?? "", /wd-/);
  });

  it("walks 1.3.1–1.3.11 as create, On your own, With AI per section", () => {
    const sections = [...new Set(A1_LAB_EXERCISES.map((row) => row.section))];
    assert.deepEqual(sections, LAB_SECTIONS);
    for (const section of sections) {
      const kinds = A1_LAB_EXERCISES.filter((row) => row.section === section).map(
        (row) => row.kind,
      );
      assert.deepEqual(
        kinds,
        ["core", "oyo", "ai"],
        `${section} should be create, On your own, With AI`,
      );
    }
  });

  it("keeps A1 Lab checklist labels and ids identical to the catalog, in order", () => {
    const labGroup = A1_RUBRIC.groups.find((group) => group.id === "lab");
    assert.ok(labGroup);
    assert.deepEqual(
      labGroup.criteria.map((row) => row.id),
      A1_LAB_EXERCISES.map((row) => row.id),
    );
    assert.deepEqual(
      labGroup.criteria.map((row) => row.label),
      A1_LAB_EXERCISES.map((row) => row.label),
    );
    assert.deepEqual(
      labGroup.criteria.map((row) => row.description),
      A1_LAB_EXERCISES.map((row) => row.description),
    );
    assert.deepEqual(
      labGroup.criteria.map((row) => row.parentLabel),
      A1_LAB_EXERCISES.map((row) => row.parentLabel),
    );
    assert.deepEqual(labGroup.criteria, a1LabCriteria());
  });

  it("nests the A1 Lab checklist into the same 11 parents as §1.3.12", () => {
    const labGroup = A1_RUBRIC.groups.find((group) => group.id === "lab");
    assert.ok(labGroup);
    const blocks = nestRubricCriteria(labGroup.criteria);
    assert.ok(blocks.every((block) => block.type === "nested"));
    assert.deepEqual(
      blocks.map((block) => (block.type === "nested" ? block.parentLabel : "")),
      A1_LAB_EXERCISE_SECTIONS.map((section) => section.label),
    );
    assert.deepEqual(
      blocks.flatMap((block) =>
        block.type === "nested" ? block.rows.map((row) => row.id) : [block.row.id],
      ),
      A1_LAB_EXERCISE_SECTIONS.flatMap((section) =>
        section.tasks.map((task) => task.id),
      ),
    );
    for (const block of blocks) {
      if (block.type !== "nested") continue;
      assert.deepEqual(
        block.rows.map((row) => row.label),
        ["Lab component", "On your own", "With AI"],
      );
    }
  });

  it("includes every book With AI extra as an A1 check item", () => {
    const ai = A1_LAB_EXERCISES.filter((row) => row.kind === "ai");
    assert.equal(ai.length, 11);
    assert.ok(ai.every((row) => row.label === "With AI"));
    assert.ok(
      ai.every((row) => labGroupHas(row.id) && labGroupHasLabel(row.label)),
    );
    assert.deepEqual(
      ai.map((row) => row.id),
      [
        "a1-lab-heading-tags-ai",
        "a1-lab-paragraph-ai",
        "a1-lab-lists-ai",
        "a1-lab-tables-ai",
        "a1-lab-images-ai",
        "a1-lab-forms-ai",
        "a1-lab-highlighted-paragraph-ai",
        "a1-lab-highlighted-box-ai",
        "a1-lab-anchor-ai",
        "a1-lab-labs-nav-ai",
        "a1-lab-toc-ai",
      ],
    );
  });

  it("marks catalog manual rows as A1 manual criteria", () => {
    assert.deepEqual(A1_MANUAL_CRITERION_IDS, a1LabManualIds());
    assert.ok(A1_MANUAL_CRITERION_IDS.includes("a1-lab-forms-ai"));
    assert.ok(
      A1_MANUAL_CRITERION_IDS.includes("a1-lab-highlighted-paragraph-oyo"),
    );
    assert.ok(A1_MANUAL_CRITERION_IDS.includes("a1-lab-toc-oyo"));
    assert.equal(
      A1_MANUAL_CRITERION_IDS.includes("a1-delivery-labs-nav"),
      false,
    );
  });

  it("auto-checks With AI extras that have a stable id or snippet", () => {
    const headings = evaluateRubricSpec(
      {
        criterionId: "a1-lab-heading-tags-ai",
        groupId: "lab",
        label: "HeadingTags — With AI",
        kind: "ids",
        requireAllIds: ["wd-ai-headings"],
        passMessage: "ok",
        failMessage: "missing",
      },
      '<div id="wd-ai-headings"></div>',
    );
    assert.equal(headings.passed, true);
    const quizRows = evaluateRubricSpec(
      {
        criterionId: "a1-lab-tables-ai",
        groupId: "lab",
        label: "Tables — With AI",
        kind: "ids",
        requireHtmlIncludes: ["Q4", "Q10"],
        passMessage: "ok",
        failMessage: "missing",
      },
      "<table><tr><td>Q4</td></tr><tr><td>Q10</td></tr></table>",
    );
    assert.equal(quizRows.passed, true);
    const quizFail = evaluateRubricSpec(
      {
        criterionId: "a1-lab-tables-ai",
        groupId: "lab",
        label: "Tables — With AI",
        kind: "ids",
        requireHtmlIncludes: ["Q4", "Q10"],
        passMessage: "ok",
        failMessage: "missing",
      },
      "<table><tr><td>Q1</td></tr><tr><td>Q3</td></tr></table>",
    );
    assert.equal(quizFail.passed, false);
  });
});

function labGroupHas(id: string): boolean {
  return (
    A1_RUBRIC.groups
      .find((group) => group.id === "lab")
      ?.criteria.some((row) => row.id === id) ?? false
  );
}

function labGroupHasLabel(label: string): boolean {
  return (
    A1_RUBRIC.groups
      .find((group) => group.id === "lab")
      ?.criteria.some((row) => row.label === label) ?? false
  );
}
