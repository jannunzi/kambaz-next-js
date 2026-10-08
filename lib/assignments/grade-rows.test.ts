import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pointsPercent } from "./grade";
import {
  GRADE_ROW_COPY,
  changedCriterionIds,
  clampPoints,
  defaultPointsFor,
  gradePoints,
  gradeRowsFromResults,
  gradeViewFromStaffGrade,
  isOverridden,
  rowsFromStaffGrade,
  staffGradeRecordFromRows,
  normalizeGradeRows,
  rowPresentation,
  studentAutoPoints,
  withCustomPoints,
  withOverrideChecked,
  type CriterionGradeRow,
} from "./grade-rows";

function row(partial: Partial<CriterionGradeRow> & Pick<CriterionGradeRow, "criterionId">): CriterionGradeRow {
  const maxPoints = partial.maxPoints ?? 3;
  const autoPassed = partial.autoPassed ?? false;
  const overridePassed = partial.overridePassed ?? autoPassed;
  return {
    criterionId: partial.criterionId,
    maxPoints,
    autoPassed,
    overridePassed,
    points: partial.points ?? defaultPointsFor(overridePassed, maxPoints),
  };
}

describe("override detection and points", () => {
  it("defaults points to full credit when override is checked and 0 when it is not", () => {
    assert.equal(defaultPointsFor(true, 5), 5);
    assert.equal(defaultPointsFor(false, 5), 0);
    assert.equal(clampPoints(9, 5), 5);
    assert.equal(clampPoints(-2, 5), 0);
    assert.equal(clampPoints(1.6, 5), 2);
  });

  it("marks a row overridden when the checkmark or the points leave the default", () => {
    const pass = row({ criterionId: "auto", autoPassed: true, maxPoints: 4 });
    assert.equal(isOverridden(pass), false);
    assert.equal(pass.points, 4);

    const flipped = withOverrideChecked(pass, false);
    assert.equal(flipped.overridePassed, false);
    assert.equal(flipped.points, 0);
    assert.equal(isOverridden(flipped), true);

    const partial = withCustomPoints(pass, 1);
    assert.equal(partial.overridePassed, true);
    assert.equal(partial.points, 1);
    assert.equal(isOverridden(partial), true);

    const restored = withCustomPoints(partial, 4);
    assert.equal(isOverridden(restored), false);
  });

  it("sums the saved total from each row's points", () => {
    const rows = [
      row({ criterionId: "a", autoPassed: true, maxPoints: 3 }),
      withCustomPoints(
        row({ criterionId: "b", autoPassed: false, maxPoints: 5 }),
        2,
      ),
    ];
    assert.deepEqual(gradePoints(rows), {
      earnedPoints: 5,
      totalPoints: 8,
      percent: 62.5,
    });
  });

  it("leaves a skipped Name on Labs row out of the student auto total", () => {
    const rows = [
      row({ criterionId: "rest", autoPassed: true, maxPoints: 110 }),
      row({
        criterionId: "a1-delivery-name-section",
        autoPassed: false,
        maxPoints: 3,
      }),
    ];
    assert.deepEqual(
      studentAutoPoints(rows, new Set(), new Set(["a1-delivery-name-section"])),
      { earnedPoints: 110, totalPoints: 110, percent: 100 },
    );
    assert.deepEqual(studentAutoPoints(rows, new Set()), {
      earnedPoints: 110,
      totalPoints: 113,
      percent: pointsPercent(110, 113),
    });
  });

  it("keeps manual override points out of the student auto total", () => {
    const rows = [
      row({ criterionId: "auto", autoPassed: true, maxPoints: 3 }),
      withOverrideChecked(
        row({ criterionId: "manual", autoPassed: false, maxPoints: 4 }),
        true,
      ),
    ];
    assert.deepEqual(studentAutoPoints(rows, new Set(["manual"])), {
      earnedPoints: 3,
      totalPoints: 3,
      percent: 100,
    });
    assert.equal(gradePoints(rows).earnedPoints, 7);
  });

  it("builds rows from autograder results and normalizes a save", () => {
    const criteria = [
      { id: "pass", points: 3 },
      { id: "fail", points: 2 },
      { id: "manual", points: 1 },
    ];
    const fromRun = gradeRowsFromResults(criteria, [
      {
        id: "pass",
        label: "pass",
        passed: true,
        message: "ok",
        criterionId: "pass",
      },
      {
        id: "fail",
        label: "fail",
        passed: false,
        message: "missing",
        criterionId: "fail",
      },
      {
        id: "manual",
        label: "manual",
        passed: false,
        message: "staff",
        criterionId: "manual",
        skipped: true,
      },
    ]);
    assert.deepEqual(
      fromRun.map((item) => [item.criterionId, item.autoPassed, item.points]),
      [
        ["pass", true, 3],
        ["fail", false, 0],
        ["manual", false, 0],
      ],
    );
    const saved = normalizeGradeRows(criteria, [
      {
        criterionId: "pass",
        autoPassed: true,
        overridePassed: true,
        points: 1,
      },
    ]);
    assert.equal(saved[0]?.points, 1);
    assert.equal(saved[1]?.autoPassed, false);
    assert.equal(saved[1]?.points, 0);
    assert.equal(saved[2]?.maxPoints, 1);
  });
});

describe("existing staffGrade documents", () => {
  const criteria = [
    { id: "pass", points: 3 },
    { id: "fail", points: 5 },
  ];

  it("loads an older pass/fail override as full points or zero", () => {
    const rows = rowsFromStaffGrade(
      criteria,
      {
        acceptedProposed: false,
        criterionOverrides: { fail: true },
        gradedAt: "2026-09-20T12:00:00.000Z",
      },
      [
        {
          id: "pass",
          label: "pass",
          passed: true,
          message: "ok",
          criterionId: "pass",
        },
        {
          id: "fail",
          label: "fail",
          passed: false,
          message: "missing",
          criterionId: "fail",
        },
      ],
    );
    assert.equal(rows[0]?.autoPassed, true);
    assert.equal(rows[0]?.overridePassed, true);
    assert.equal(rows[0]?.points, 3);
    assert.equal(isOverridden(rows[0]!), false);
    assert.equal(rows[1]?.autoPassed, false);
    assert.equal(rows[1]?.overridePassed, true);
    assert.equal(rows[1]?.points, 5);
    assert.equal(isOverridden(rows[1]!), true);
  });

  it("keeps partial points stored on a newer staffGrade", () => {
    const saved = staffGradeRecordFromRows({
      rows: [
        row({ criterionId: "pass", autoPassed: true, maxPoints: 3 }),
        withCustomPoints(
          row({ criterionId: "fail", autoPassed: false, maxPoints: 5 }),
          2,
        ),
      ],
      gradedAt: new Date("2026-09-24T15:00:00.000Z"),
      gradedByEmail: "jannunzi@gmail.com",
    });
    assert.equal(saved.earnedPoints, 5);
    assert.equal(saved.acceptedProposed, false);
    assert.equal(saved.criterionOverrides, undefined);
    const view = gradeViewFromStaffGrade({
      studentClerkUserId: "user_1",
      assignmentId: "a1",
      githubUrl: "",
      vercelUrl: "https://jane-a1.vercel.app",
      criteria,
      staffGrade: saved,
    });
    assert.equal(view?.rows[1]?.points, 2);
    assert.equal(view?.rows[1]?.overridePassed, false);
    assert.equal(view?.earnedPoints, 5);
    assert.equal(view?.gradedByEmail, "jannunzi@gmail.com");
    assert.equal(view?.savedAt, "2026-09-24T15:00:00.000Z");
  });

  it("returns null when the submission has no staff grade", () => {
    assert.equal(
      gradeViewFromStaffGrade({
        studentClerkUserId: "user_1",
        assignmentId: "a1",
        githubUrl: "",
        vercelUrl: "https://jane-a1.vercel.app",
        criteria,
        staffGrade: null,
      }),
      null,
    );
  });
});

describe("row color and changed state", () => {
  it("maps full credit, no credit, and override to green, red, and yellow", () => {
    const pass = row({ criterionId: "pass", autoPassed: true, maxPoints: 3 });
    const fail = row({ criterionId: "fail", autoPassed: false, maxPoints: 3 });
    const overridden = withOverrideChecked(fail, true);
    const partial = withCustomPoints(pass, 1);

    const green = rowPresentation({
      row: pass,
      scored: true,
      changed: false,
      audience: "staff",
      manual: false,
    });
    const red = rowPresentation({
      row: fail,
      scored: true,
      changed: false,
      audience: "staff",
      manual: false,
    });
    const yellow = rowPresentation({
      row: overridden,
      scored: true,
      changed: false,
      audience: "staff",
      manual: false,
    });
    const partialYellow = rowPresentation({
      row: partial,
      scored: true,
      changed: false,
      audience: "staff",
      manual: false,
    });

    assert.equal(green.fill, "green");
    assert.equal(green.mark, "✓");
    assert.match(green.label, new RegExp(GRADE_ROW_COPY.fullCredit));
    assert.match(green.className, /bg-emerald-50/);
    assert.doesNotMatch(green.className, /ring-sky-800/);

    assert.equal(red.fill, "red");
    assert.equal(red.mark, "✗");
    assert.match(red.label, new RegExp(GRADE_ROW_COPY.noCredit));
    assert.match(red.className, /bg-red-50/);

    assert.equal(yellow.fill, "yellow");
    assert.equal(yellow.mark, "override");
    assert.match(yellow.label, new RegExp(GRADE_ROW_COPY.override));
    assert.match(yellow.className, /bg-amber-100/);
    assert.doesNotMatch(yellow.className, /bg-emerald-50|bg-red-50/);

    assert.equal(partialYellow.fill, "yellow");
    assert.match(partialYellow.label, new RegExp(GRADE_ROW_COPY.partialCredit));
  });

  it("paints a changed row with a blue edge without replacing the fill", () => {
    const saved = row({ criterionId: "pass", autoPassed: true, maxPoints: 3 });
    const current = row({ criterionId: "pass", autoPassed: false, maxPoints: 3 });
    const presentation = rowPresentation({
      row: current,
      scored: true,
      changed: true,
      audience: "staff",
      manual: false,
    });
    assert.equal(presentation.fill, "red");
    assert.equal(presentation.changed, true);
    assert.match(presentation.className, /bg-red-50/);
    assert.match(presentation.className, /ring-sky-800/);
    assert.match(presentation.className, /inset_8px_0_0_0_/);
    assert.deepEqual(
      changedCriterionIds([current], [saved], true, "staff"),
      ["pass"],
    );
    assert.deepEqual(changedCriterionIds([current], [saved], false, "staff"), []);
    assert.deepEqual(
      changedCriterionIds([saved], [saved], true, "student"),
      [],
    );
  });

  it("keeps the yellow override fill when a row also changed since the saved grade", () => {
    const saved = row({ criterionId: "row", autoPassed: false, maxPoints: 4 });
    const current = withCustomPoints(withOverrideChecked(saved, true), 2);
    const presentation = rowPresentation({
      row: current,
      scored: true,
      changed: true,
      audience: "staff",
      manual: false,
    });
    assert.equal(presentation.fill, "yellow");
    assert.equal(presentation.changed, true);
    assert.equal(presentation.mark, "override");
    assert.match(presentation.label, /Override/);
    assert.match(presentation.label, /Partial credit/);
    assert.match(presentation.className, /bg-amber-100/);
    assert.match(presentation.className, /ring-sky-800/);
    assert.doesNotMatch(presentation.className, /bg-sky|bg-blue|bg-emerald-50|bg-red-50/);
    assert.deepEqual(changedCriterionIds([current], [saved], true, "staff"), ["row"]);

    const savedPass = row({ criterionId: "pass", autoPassed: true, maxPoints: 4 });
    const pointsOnly = withCustomPoints(savedPass, 2);
    assert.equal(pointsOnly.autoPassed, true);
    assert.equal(isOverridden(pointsOnly), true);
    assert.deepEqual(changedCriterionIds([pointsOnly], [savedPass], true, "staff"), ["pass"]);
    assert.deepEqual(changedCriterionIds([pointsOnly], [savedPass], true, "student"), []);
  });

  it("leaves manual rows neutral for students and unscored rows uncolored", () => {
    const manual = row({ criterionId: "manual", autoPassed: false, maxPoints: 2 });
    const student = rowPresentation({
      row: manual,
      scored: true,
      changed: false,
      audience: "student",
      manual: true,
    });
    assert.equal(student.fill, "neutral");
    assert.equal(student.label, GRADE_ROW_COPY.checkedByStaff);
    assert.match(student.className, /bg-white/);

    const empty = rowPresentation({
      row: manual,
      scored: false,
      changed: true,
      audience: "staff",
      manual: false,
    });
    assert.equal(empty.fill, "neutral");
    assert.equal(empty.changed, false);
    assert.equal(empty.label, "");
  });
});
