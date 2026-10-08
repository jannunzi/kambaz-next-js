/**
 * Follow-ups to the A1 grader QA (Quentin's PR #209 report v4):
 *   S1  Run on a saved grade keeps every staff decision (flagging any whose
 *       Auto result changed) instead of dropping overrides on auto items.
 *   N1  Clearing a Points box returns the row to unset, never 0.
 *   N2  With every Lab page 404, each message names the 404 once, in
 *       plain grammar ("The Labs pages weren't found").
 *   N3  A staff Save never changes the student's submission time, and a
 *       submission after the staff grade is "resubmitted after grading" on
 *       every screen (finalGrade), with submitted_at / graded_at exported.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { A1_RUBRIC } from "./a1";
import { listRubricCriteria } from "./catalog";
import type { AssignmentCheckResult } from "./check-types";
import { criterionCoverage } from "./checkers";
import { latestResultByCriterion, runA1Checks } from "./checks";
import { buildSubmissionExportRow, submissionExportCsv } from "./export";
import {
  LEGACY_SAVE_STAMP_MS,
  RESUBMITTED_AFTER_GRADING,
  finalGrade,
  finalGradeForStaffRow,
  finalGradeLine,
  gradingInProgressText,
  resubmittedAfterGrading,
} from "./final-grade";
import { FIXTURE_ORIGIN, fixtureProbes, passingDeployPages } from "./fixtures/a1-deploy";
import {
  GRADE_ROW_COPY,
  autoChangedSaveWarning,
  autoChangedSinceDecision,
  carryStaffDecisions,
  gradePoints,
  gradeRowsFromResults,
  gradeViewFromStaffGrade,
  normalizeGradeRows,
  pointsFromInput,
  rowIsStaffDecided,
  staffGradeRecordFromRows,
  withCleared,
  withCustomPoints,
  withOverrideChecked,
  withPointsInput,
  type CriterionGradeRow,
} from "./grade-rows";
import { resolveNameQuery } from "./names";
import { buildStaffStudentQueue } from "./staff";
import {
  recordStaffGrade,
  toSubmissionView,
  upsertAssignmentSubmission,
  type AssignmentStaffGrade,
  type AssignmentSubmissionDoc,
  type SubmissionStore,
} from "./submissions-store";

const TOTAL = 125;
const CRITERIA = listRubricCriteria(A1_RUBRIC).map((c) => ({ id: c.id, points: c.points }));
const LABELS = new Map(listRubricCriteria(A1_RUBRIC).map((c) => [c.id, c.label]));
const MANUAL_IDS = CRITERIA.filter((c) => criterionCoverage("a1", c.id) === "manual").map((c) => c.id);
const TABLES = "a1-lab-tables";

async function fullRun(pages = passingDeployPages()): Promise<AssignmentCheckResult[]> {
  return runA1Checks({
    githubUrl: "https://github.com/jane-doe/webdev-client",
    vercelUrl: FIXTURE_ORIGIN,
    nameQuery: resolveNameQuery({ rosterName: "Doe, Jane" }),
    probes: fixtureProbes(pages),
  });
}

/** The same run with one criterion's Auto result flipped. */
function flipAuto(results: AssignmentCheckResult[], criterionId: string, passed: boolean): AssignmentCheckResult[] {
  return results.map((row) =>
    row.criterionId === criterionId ? { ...row, passed, needsReview: undefined, message: passed ? "ok" : "Lab 1 doesn't have the quiz table." } : row,
  );
}

function setRow(rows: CriterionGradeRow[], id: string, fn: (row: CriterionGradeRow) => CriterionGradeRow) {
  return rows.map((row) => (row.criterionId === id ? fn(row) : row));
}

/** What the server stores for a Save of these draft rows (saveAssignmentGrade). */
function save(rows: CriterionGradeRow[], results: AssignmentCheckResult[], gradedAt = new Date("2026-10-08T15:00:00Z")) {
  return staffGradeRecordFromRows({
    rows: normalizeGradeRows(CRITERIA, rows),
    checkResults: results,
    gradedByEmail: "ta@northeastern.edu",
    gradedAt,
  });
}

/** The saved grade as A1WorkArea loads it (gradeViewFromStaffGrade). */
function view(staffGrade: AssignmentStaffGrade, results: AssignmentCheckResult[]) {
  const loaded = gradeViewFromStaffGrade({
    studentClerkUserId: "user_1",
    assignmentId: "a1",
    githubUrl: "",
    vercelUrl: FIXTURE_ORIGIN,
    criteria: CRITERIA,
    staffGrade,
    checkResults: results,
  });
  assert.ok(loaded);
  return loaded;
}

/** A1WorkArea onResults: a new Run on top of the draft or the saved rows. */
function runAgain(previous: CriterionGradeRow[], results: AssignmentCheckResult[]) {
  return carryStaffDecisions(previous, gradeRowsFromResults(CRITERIA, results));
}

function gradeOf(staffGrade: AssignmentStaffGrade, results: AssignmentCheckResult[], submittedAt?: string | Date) {
  return finalGrade({ assignmentId: "a1", rubric: A1_RUBRIC, results, staff: staffGrade, roster: {}, submittedAt });
}

/** Staff graded every manual item Full credit and overrode Tables to 0: 122. */
async function savedWithTablesOverride() {
  const results = await fullRun();
  let draft = gradeRowsFromResults(CRITERIA, results);
  for (const id of MANUAL_IDS) draft = setRow(draft, id, (row) => withOverrideChecked(row, true));
  draft = setRow(draft, TABLES, (row) => withOverrideChecked(row, false));
  const saved = save(draft, results);
  return { results, saved };
}

describe("S1: Run on a saved grade keeps staff decisions on auto items", () => {
  it("122 stays 122 (97.6) after Run then Save when nothing changed", async () => {
    const { results, saved } = await savedWithTablesOverride();
    const before = gradeOf(saved, results);
    assert.equal(before.points, 122);
    assert.equal(before.canvasPercent, 97.6);

    const draft = runAgain(view(saved, results).rows, results);
    const tables = draft.find((row) => row.criterionId === TABLES)!;
    assert.equal(tables.decided, true);
    assert.equal(tables.points, 0);
    assert.equal(tables.overridePassed, false);
    assert.equal(autoChangedSinceDecision(tables), false);
    assert.equal(draft.some(autoChangedSinceDecision), false);
    assert.equal(gradePoints(draft).earnedPoints, 122);

    const after = gradeOf(save(draft, results, new Date("2026-10-09T15:00:00Z")), results);
    assert.equal(after.points, 122, "the Tables deduction must survive Run + Save");
    assert.equal(after.canvasPercent, 97.6);
    assert.equal(after.ready, true);
  });

  it("partial credit and a confirmed TA-review item are kept too", async () => {
    const results = await fullRun();
    let draft = gradeRowsFromResults(CRITERIA, results);
    for (const id of MANUAL_IDS) draft = setRow(draft, id, (row) => withOverrideChecked(row, true));
    draft = setRow(draft, TABLES, (row) => withCustomPoints(row, 1));
    const saved = save(draft, results);
    const again = runAgain(view(saved, results).rows, results);
    assert.equal(again.find((row) => row.criterionId === TABLES)?.points, 1);
    assert.equal(gradeOf(save(again, results), results).points, gradeOf(saved, results).points);
  });

  it("a decision whose Auto result changed is kept, flagged, and warned about before Save", async () => {
    const { results, saved } = await savedWithTablesOverride();
    // The new run now fails Tables (staff had overridden a pass to 0).
    const rerun = flipAuto(results, TABLES, false);
    const draft = runAgain(view(saved, results).rows, rerun);
    const tables = draft.find((row) => row.criterionId === TABLES)!;
    assert.equal(tables.autoPassed, false);
    assert.equal(tables.decided, true);
    assert.equal(tables.points, 0, "the decision is kept");
    assert.equal(autoChangedSinceDecision(tables), true);
    assert.deepEqual(draft.filter(autoChangedSinceDecision).map((row) => row.criterionId), [TABLES]);
    assert.equal(GRADE_ROW_COPY.autoChanged, "auto result changed since you decided this");

    const warning = autoChangedSaveWarning(draft.filter(autoChangedSinceDecision).map((row) => LABELS.get(row.criterionId)!));
    assert.ok(warning);
    assert.match(warning, new RegExp(LABELS.get(TABLES)!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(warning, /decision is kept/);
    assert.match(warning, /Save anyway\?/);
    assert.equal(autoChangedSaveWarning([]), null);

    // Running again keeps the flag (still changed since the decision)...
    const third = runAgain(draft, rerun);
    assert.equal(autoChangedSinceDecision(third.find((row) => row.criterionId === TABLES)!), true);
    // ...until Auto goes back to what staff decided against...
    const back = runAgain(third, results);
    assert.equal(autoChangedSinceDecision(back.find((row) => row.criterionId === TABLES)!), false);
    // ...or staff decide again on the new result.
    const redecided = setRow(third, TABLES, (row) => withCustomPoints(row, 0));
    assert.equal(autoChangedSinceDecision(redecided.find((row) => row.criterionId === TABLES)!), false);

    // Saving keeps the decision; the draft-only marker is never stored.
    const stored = save(draft, rerun);
    assert.equal(stored.rows.some((row) => "decidedOnAuto" in row), false);
    assert.equal(normalizeGradeRows(CRITERIA, draft).some((row) => "decidedOnAuto" in row), false);
    const final = gradeOf(stored, rerun);
    assert.equal(final.points, 122);
    assert.equal(final.ready, true);
  });

  it("Full credit on a failed item stays Full credit when the item now passes, flagged", async () => {
    const results = flipAuto(await fullRun(), TABLES, false);
    let draft = gradeRowsFromResults(CRITERIA, results);
    for (const id of MANUAL_IDS) draft = setRow(draft, id, (row) => withOverrideChecked(row, true));
    draft = setRow(draft, TABLES, (row) => withOverrideChecked(row, true));
    const saved = save(draft, results);
    const passing = flipAuto(results, TABLES, true);
    const again = runAgain(view(saved, results).rows, passing);
    const tables = again.find((row) => row.criterionId === TABLES)!;
    assert.equal(tables.points, tables.maxPoints);
    assert.equal(autoChangedSinceDecision(tables), true);
  });

  it("never makes a partial grade ready: untouched rows stay unset after Run", async () => {
    const results = await fullRun();
    let draft = gradeRowsFromResults(CRITERIA, results);
    for (const id of MANUAL_IDS.slice(0, 3)) draft = setRow(draft, id, (row) => withOverrideChecked(row, true));
    const saved = save(draft, results);
    assert.equal(gradeOf(saved, results).ready, false);
    const again = runAgain(view(saved, results).rows, results);
    for (const id of MANUAL_IDS.slice(3)) {
      assert.equal(rowIsStaffDecided(again.find((row) => row.criterionId === id)!), false, id);
    }
    const final = gradeOf(save(again, results), results);
    assert.equal(final.ready, false);
    assert.match(final.reasons.join("; "), /3 manual item\(s\) not graded/);
    assert.equal(final.canvasPercent, null);
    // A draft with nothing decided carries nothing.
    const fresh = runAgain(gradeRowsFromResults(CRITERIA, results), results);
    assert.equal(fresh.some(rowIsStaffDecided), false);
  });

  it("A1WorkArea's Run uses carryStaffDecisions on the draft or the saved rows", () => {
    const source = readFileSync(new URL("../../app/assignments/components/A1WorkArea.tsx", import.meta.url), "utf8");
    const onResults = source.slice(source.indexOf("function onResults("), source.indexOf("function onClear("));
    assert.match(onResults, /carryStaffDecisions\(current \?\? savedGrade\?\.rows \?\? null/);
    const onSave = source.slice(source.indexOf("function onSaveGrade("), source.indexOf("return (\n    <>"));
    assert.match(onSave, /autoChangedSaveWarning/);
    assert.match(onSave, /window\.confirm\(warning\)/);
  });
});

describe("N1: clearing a Points box returns the row to unset", () => {
  it("empty input is no value, not 0", () => {
    assert.equal(pointsFromInput(""), null);
    assert.equal(pointsFromInput("   "), null);
    assert.equal(pointsFromInput("abc"), null);
    assert.equal(pointsFromInput("0"), 0);
    assert.equal(pointsFromInput("2"), 2);
  });

  it("type a number on a manual item, clear it: unset again, and the grade stays not ready", async () => {
    const results = await fullRun();
    let draft = gradeRowsFromResults(CRITERIA, results);
    for (const id of MANUAL_IDS.slice(1)) draft = setRow(draft, id, (row) => withOverrideChecked(row, true));
    const id = MANUAL_IDS[0];
    const typed = setRow(draft, id, (row) => withPointsInput(row, pointsFromInput("1")));
    assert.equal(rowIsStaffDecided(typed.find((row) => row.criterionId === id)!), true);
    const cleared = setRow(typed, id, (row) => withPointsInput(row, pointsFromInput("")));
    const row = cleared.find((r) => r.criterionId === id)!;
    assert.equal(row.decided, false);
    assert.equal(rowIsStaffDecided(row), false);
    const final = gradeOf(save(cleared, results), results);
    assert.deepEqual(final.ungradedManual, [id]);
    assert.equal(final.ready, false);
    assert.equal(final.manualPoints, null);
  });

  it("clearing an auto item's Points goes back to the Auto result, undecided", async () => {
    const results = await fullRun();
    const row = gradeRowsFromResults(CRITERIA, results).find((r) => r.criterionId === TABLES)!;
    const cleared = withCleared(withCustomPoints(row, 1));
    assert.deepEqual(
      { overridePassed: cleared.overridePassed, points: cleared.points, decided: cleared.decided },
      { overridePassed: row.autoPassed, points: row.maxPoints, decided: false },
    );
  });

  it("the checklist's Points box clears through pointsFromInput, never `\"\" → 0`", () => {
    const source = readFileSync(new URL("../../app/assignments/components/AssignmentChecklist.tsx", import.meta.url), "utf8");
    assert.match(source, /onPoints\?\.\(criterion\.id, pointsFromInput\(event\.target\.value\)\)/);
    assert.doesNotMatch(source, /=== "" \? 0/);
  });
});

describe("N2: every Lab page 404 reads cleanly", () => {
  it("each lost item names the 404 once, with 'weren't' for the Labs pages", async () => {
    const pages = passingDeployPages();
    for (const path of Object.keys(pages)) if (path.startsWith("/labs")) delete pages[path];
    const results = await fullRun(pages);
    const lost = results.filter((row) => !row.passed && !row.skipped);
    assert.ok(lost.length >= 25, `${lost.length} lost`);
    for (const row of lost) {
      const label = `${row.criterionId}: ${row.message}`;
      assert.equal((row.message.match(/returned HTTP 404/g) ?? []).length, 1, label);
      assert.doesNotMatch(row.message, /pages wasn't/, label);
      assert.doesNotMatch(row.message, /^The Lab 1 page \(\/labs\/lab1\) returned HTTP 404\. .*found on your deploy/, label);
      assert.doesNotMatch(row.message, /wd-/, label);
      if (row.groupId === "lab") assert.match(row.message, /\/labs\/lab1\b[^.]*returned HTTP 404/, label);
    }
    const labs = lost.filter((row) => /Labs pages/.test(row.message));
    assert.ok(labs.length >= 10);
    for (const row of labs) {
      assert.equal(
        row.message,
        "The Labs pages weren't found on your deploy (/labs and /labs/lab1 returned HTTP 404), so this item couldn't pass.",
      );
    }
  });

  it("a 404 on /labs/lab1 alone still leads every lost Lab item with it", async () => {
    const pages = passingDeployPages();
    delete pages["/labs/lab1"];
    const results = await fullRun(pages);
    const lost = results.filter((row) => row.groupId === "lab" && !row.passed && !row.skipped);
    assert.ok(lost.length >= 10);
    for (const row of lost) {
      assert.equal((row.message.match(/returned HTTP 404/g) ?? []).length, 1, row.message);
      assert.match(row.message, /\/labs\/lab1\)? returned HTTP 404/, row.message);
    }
  });
});

// --- N3: submission time and resubmissions ---------------------------------

type MemoryStore = SubmissionStore & { docs: AssignmentSubmissionDoc[] };

function memoryStore(withSetStaffGrade: boolean): MemoryStore {
  const docs: AssignmentSubmissionDoc[] = [];
  const find = async (clerkUserId: string, assignmentId: string) =>
    docs.find((doc) => doc.clerkUserId === clerkUserId && doc.assignmentId === assignmentId) ?? null;
  const store: MemoryStore = {
    docs,
    find,
    async upsert(doc) {
      const index = docs.findIndex((row) => row.clerkUserId === doc.clerkUserId && row.assignmentId === doc.assignmentId);
      if (index === -1) docs.push(doc);
      else docs[index] = doc;
    },
    async listByAssignment(assignmentId) {
      return docs.filter((doc) => doc.assignmentId === assignmentId);
    },
  };
  if (withSetStaffGrade) {
    // Mirrors mongoSubmissionStore.setStaffGrade: $set on the given fields only.
    store.setStaffGrade = async (clerkUserId, assignmentId, fields) => {
      const doc = await find(clerkUserId, assignmentId);
      if (!doc) return false;
      Object.assign(doc, Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined)));
      return true;
    };
  }
  return store;
}

const T0 = new Date("2026-10-01T12:00:00Z"); // student submits
const T1 = new Date("2026-10-08T15:00:00Z"); // staff save
const T2 = new Date("2026-10-09T09:30:00Z"); // student resubmits
const T3 = new Date("2026-10-10T10:00:00Z"); // staff re-run and save

async function studentSubmit(store: SubmissionStore, at: Date, url = "https://jane-a1.vercel.app") {
  return upsertAssignmentSubmission(
    store,
    {
      clerkUserId: "user_1",
      assignmentId: "a1",
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: url,
      checkResults: await fullRun(),
      checked: true,
      identity: { email: "jane@northeastern.edu", name: "Doe, Jane", section: "CS5610 02" },
    },
    at,
  );
}

async function fullGrade(results: AssignmentCheckResult[], gradedAt: Date) {
  let draft = gradeRowsFromResults(CRITERIA, results);
  for (const id of MANUAL_IDS) draft = setRow(draft, id, (row) => withOverrideChecked(row, true));
  return save(draft, results, gradedAt);
}

async function staffSaveAt(store: SubmissionStore, at: Date, seen?: string) {
  const doc = (await store.find("user_1", "a1"))!;
  const results = doc.checkResults ?? [];
  return recordStaffGrade(
    store,
    { clerkUserId: "user_1", assignmentId: "a1", staffGrade: await fullGrade(results, at), checkResults: results, seenSubmittedAt: seen ?? toSubmissionView(doc).updatedAt },
    at,
  );
}

/** Minimal RFC 4180 reader for the export (quoted cells may hold commas and newlines). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\r" && text[i + 1] === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; i++; }
    else cell += ch;
  }
  return rows;
}

const ROSTER = [{ email: "jane@northeastern.edu", name: "Doe, Jane", section: "CS5610 02" }];

/** Every screen for the stored doc: export, staff nav, student page (A1WorkArea), hub. */
function screens(doc: AssignmentSubmissionDoc) {
  const row = buildStaffStudentQueue(ROSTER, [doc]).find((r) => r.clerkUserId === doc.clerkUserId)!;
  const exported = buildSubmissionExportRow({ assignmentId: "a1", rubric: A1_RUBRIC, row });
  const nav = finalGradeForStaffRow("a1", A1_RUBRIC, row);
  const submission = toSubmissionView(doc);
  const loaded = view(doc.staffGrade!, doc.checkResults ?? []);
  const page = finalGrade({
    assignmentId: "a1",
    rubric: A1_RUBRIC,
    results: submission.checkResults ?? [],
    staff: { rows: loaded.rows, checkResults: loaded.checkResults, gradedAt: loaded.savedAt, gradedSubmissionAt: loaded.gradedSubmissionAt },
    roster: { unmatched: row.unmatched, duplicates: row.priorSubmissions?.length ?? 0 },
    submittedAt: submission.updatedAt,
  });
  const hub = finalGrade({
    assignmentId: "a1",
    rubric: A1_RUBRIC,
    results: doc.checkResults ?? [],
    staff: doc.staffGrade,
    roster: {},
    submittedAt: doc.updatedAt ?? doc.createdAt,
  });
  for (const [name, grade] of [["nav", nav], ["page", page], ["hub", hub]] as const) {
    assert.equal(grade.ready, exported.readyForCanvas, name);
    assert.equal(grade.canvasPercent, exported.canvasPercent, name);
    assert.equal(grade.points, exported.points, name);
  }
  return { exported, page, header: page.ready ? `Grade ${page.canvasScore}` : gradingInProgressText(page), banner: finalGradeLine(page, true) };
}

describe("N3: a staff Save never changes the submission time", () => {
  for (const withSet of [true, false]) {
    it(`keeps updatedAt and URLs, records graded_at (${withSet ? "$set store" : "upsert fallback"})`, async () => {
      const store = memoryStore(withSet);
      await studentSubmit(store, T0);
      const saved = await staffSaveAt(store, T1);
      assert.ok(saved);
      assert.equal(saved.updatedAt.getTime(), T0.getTime(), "staff Save must not reset the submission time");
      assert.equal(saved.vercelUrl, "https://jane-a1.vercel.app");
      assert.equal(new Date(saved.staffGrade!.gradedAt).getTime(), T1.getTime());
      assert.equal(new Date(saved.staffGrade!.gradedSubmissionAt!).getTime(), T0.getTime());

      const { exported } = screens(saved);
      assert.equal(exported.submittedAt, T0.toISOString());
      assert.equal(exported.gradedAt, T1.toISOString());
      assert.equal(exported.staffGradedAt, T1.toISOString());
      assert.equal(exported.readyForCanvas, true, exported.readyReason);
      assert.equal(exported.canvasPercent, 100);
      const [header, values] = parseCsv(submissionExportCsv(A1_RUBRIC, [exported]));
      assert.equal(values[header.indexOf("submitted_at")], T0.toISOString());
      assert.equal(values[header.indexOf("graded_at")], T1.toISOString());
      assert.equal(values[header.indexOf("ready_for_canvas")], "yes");
    });
  }

  it("saveAssignmentGrade writes through writeStaffGrade, never a full submission write", () => {
    const source = readFileSync(new URL("../../app/assignments/staff-actions.ts", import.meta.url), "utf8");
    const save = source.slice(source.indexOf("export async function saveAssignmentGrade("), source.indexOf("export type RerunAllActionResult"));
    assert.match(save, /writeStaffGrade\(/);
    assert.doesNotMatch(save, /writeAssignmentSubmission\(/);
    assert.match(save, /seenSubmittedAt: input\.submittedAt/);
  });
});

describe("N3: resubmitted after grading is never ready, on every screen", () => {
  it("a submission after the staff grade: not ready, reason 'resubmitted after grading'", async () => {
    const store = memoryStore(true);
    await studentSubmit(store, T0);
    await staffSaveAt(store, T1);
    const resubmitted = await studentSubmit(store, T2, "https://jane-a1-v2.vercel.app");
    assert.ok(resubmitted.staffGrade, "the earlier staff grade is kept on file");
    const { exported, header, banner } = screens(resubmitted);
    assert.equal(exported.submittedAt, T2.toISOString());
    assert.equal(exported.gradedAt, T1.toISOString());
    assert.ok(exported.submittedAt > exported.gradedAt);
    assert.equal(exported.readyForCanvas, false);
    assert.equal(exported.readyReason, RESUBMITTED_AFTER_GRADING);
    assert.equal(exported.canvasPercent, null);
    assert.equal(exported.confidence, "needs_review");
    assert.doesNotMatch(header, /%/);
    assert.equal(banner, "Grading in progress");

    // Staff re-run and save on the new submission: ready again.
    const regraded = await staffSaveAt(store, T3);
    const after = screens(regraded!).exported;
    assert.equal(after.submittedAt, T2.toISOString());
    assert.equal(after.gradedAt, T3.toISOString());
    assert.equal(after.readyForCanvas, true, after.readyReason);
  });

  it("a resubmission that lands while staff are grading still counts", async () => {
    const store = memoryStore(true);
    await studentSubmit(store, T0);
    const seen = T0.toISOString(); // what was on the grader's screen
    await studentSubmit(store, T2);
    const saved = await staffSaveAt(store, T3, seen);
    assert.equal(new Date(saved!.staffGrade!.gradedSubmissionAt!).getTime(), T0.getTime());
    const { exported } = screens(saved!);
    assert.ok(exported.submittedAt < exported.gradedAt);
    assert.equal(exported.readyForCanvas, false);
    assert.equal(exported.readyReason, RESUBMITTED_AFTER_GRADING);
  });

  it("a grader time later than the stored submission is clamped to it", async () => {
    const store = memoryStore(false);
    await studentSubmit(store, T0);
    const saved = await staffSaveAt(store, T1, "2030-01-01T00:00:00.000Z");
    assert.equal(new Date(saved!.staffGrade!.gradedSubmissionAt!).getTime(), T0.getTime());
    await studentSubmit(store, T2);
    assert.equal(screens((await store.find("user_1", "a1"))!).exported.readyReason, RESUBMITTED_AFTER_GRADING);
  });

  it("older saves (Save reset the submission time) aren't read as resubmissions", () => {
    const graded = "2026-10-05T10:00:00.000Z";
    const legacy = { gradedAt: graded };
    assert.equal(resubmittedAfterGrading("2026-10-05T10:00:00.040Z", legacy), false, "the old Save's own stamp");
    assert.equal(resubmittedAfterGrading(new Date(Date.parse(graded) + LEGACY_SAVE_STAMP_MS - 1), legacy), false);
    assert.equal(resubmittedAfterGrading("2026-10-06T10:00:00.000Z", legacy), true, "a real resubmission a day later");
    assert.equal(resubmittedAfterGrading("2026-10-01T10:00:00.000Z", legacy), false);
    // New saves: any submission after graded_at or after the graded submission.
    const current = { gradedAt: graded, gradedSubmissionAt: "2026-10-01T10:00:00.000Z" };
    assert.equal(resubmittedAfterGrading("2026-10-01T10:00:00.000Z", current), false);
    assert.equal(resubmittedAfterGrading("2026-10-01T10:00:00.001Z", current), true);
    assert.equal(resubmittedAfterGrading("2026-10-05T10:00:00.001Z", { gradedAt: graded, gradedSubmissionAt: graded }), true);
    // Unknown times never flag; no staff grade never flags.
    assert.equal(resubmittedAfterGrading(undefined, current), false);
    assert.equal(resubmittedAfterGrading("", current), false);
    assert.equal(resubmittedAfterGrading("2026-10-06T10:00:00.000Z", null), false);
    assert.equal(resubmittedAfterGrading("2026-10-06T10:00:00.000Z", {}), false);
  });

  it("a partial grade that was also resubmitted lists both reasons and stays not ready", async () => {
    const results = await fullRun();
    let draft = gradeRowsFromResults(CRITERIA, results);
    for (const id of MANUAL_IDS.slice(0, 2)) draft = setRow(draft, id, (row) => withOverrideChecked(row, true));
    const saved = { ...save(draft, results, T1), gradedSubmissionAt: T0 };
    const final = gradeOf(saved, results, T2.toISOString());
    assert.equal(final.ready, false);
    assert.match(final.reasons.join("; "), /4 manual item\(s\) not graded/);
    assert.ok(final.reasons.includes(RESUBMITTED_AFTER_GRADING));
    assert.equal(gradeOf({ ...saved }, results, T0.toISOString()).reasons.includes(RESUBMITTED_AFTER_GRADING), false);
  });

  it("no staff grade: the submission time alone never flags", async () => {
    const results = await fullRun();
    const final = finalGrade({ assignmentId: "a1", rubric: A1_RUBRIC, results, staff: null, roster: {}, submittedAt: T2 });
    assert.equal(final.reasons.includes(RESUBMITTED_AFTER_GRADING), false);
    assert.equal(latestResultByCriterion(results).size > 0, true);
    assert.equal(TOTAL, final.maxPoints);
  });
});
