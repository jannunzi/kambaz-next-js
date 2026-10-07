/**
 * A1 checker fixes from the Oct 7 QA sweep, plus the "ids are optional" rule.
 * Cases S6, X1, X2, X5, S1/X4 (login wall) and X3 (404 alias) are rebuilt as
 * small edits of the synthetic passing deploy in fixtures/a1-deploy.ts.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { A1_RUBRIC } from "./a1";
import { A1_CHECKER } from "./a1-checker";
import {
  A1_STRUCTURE_FALLBACKS,
  MIN_ASSIGNMENT_LINKS,
  a1IdHasContent,
  a1PersonalLinksFound,
  isBoilerplateUrl,
  realImageCount,
} from "./a1-structure";
import { checkRunStatus, needsRecheckReason, needsReviewCriterionIds } from "./check-status";
import type { AssignmentCheckResult, HtmlFetchResult } from "./check-types";
import { A1_CHECKER_RULES_VERSION, checkerVersionLabel } from "./checker-version";
import { latestResultByCriterion, runA1Checks } from "./checks";
import {
  buildSubmissionExportRow,
  csvCell,
  missedItemSummary,
  missedItemSummaryCsv,
  submissionExportCsv,
  type SubmissionExportRow,
} from "./export";
import { proposedGradeFromResults } from "./grade";
import {
  gradeRowsFromResults,
  gradeViewFromStaffGrade,
  rowPresentation,
  sanitizeCheckResults,
  staffGradeRecordFromRows,
  type CriterionGradeRow,
} from "./grade-rows";
import { finalGrade, finalGradeForStaffRow, gradingInProgressText } from "./final-grade";
import { criterionCoverage } from "./checkers";
import { elementsWithId, renderedMarkup, stripWdIds } from "./html";
import { resolveNameQuery } from "./names";
import { rerunCheckBatch } from "./rerun";
import type { StaffStudentRow } from "./staff";
import {
  upsertAssignmentSubmission,
  type AssignmentSubmissionDoc,
  type SubmissionStore,
} from "./submissions-store";
import { listRubricCriteria } from "./catalog";
import {
  ASSIGNMENTS_CONTENT,
  CREATE_NEXT_APP_HTML,
  IDS_ONLY_HTML,
  bareCreateNextAppPages,
  catchAllProbes,
  FIXTURE_ORIGIN,
  FIXTURE_TOC,
  LAB1_CONTENT,
  LABS_INDEX_CONTENT,
  fixtureProbes,
  passingDeployPages,
} from "./fixtures/a1-deploy";

const AUTO_MAX = 113;
const TOTAL = 125;

async function check(
  pages: Record<string, string>,
  options: { transform?: (html: string) => string; vercelUrl?: string } = {},
) {
  const results = await runA1Checks({
    githubUrl: "https://github.com/jane-doe/webdev-client",
    vercelUrl: options.vercelUrl ?? FIXTURE_ORIGIN,
    nameQuery: resolveNameQuery({ rosterName: "Doe, Jane" }),
    probes: fixtureProbes(pages, options.transform),
  });
  return {
    results,
    byCriterion: latestResultByCriterion(results),
    points: proposedGradeFromResults(A1_RUBRIC, results).earnedPoints,
  };
}

/** Replace one page's HTML by editing its source string. */
function edit(path: string, from: string, to: string): Record<string, string> {
  const pages = passingDeployPages();
  assert.ok(pages[path].includes(from), `fixture ${path} should contain ${from}`);
  pages[path] = pages[path].split(from).join(to);
  return pages;
}

describe("synthetic passing deploy", () => {
  it("scores the full 113 auto points with every auto row passing", async () => {
    const { byCriterion, points } = await check(passingDeployPages());
    assert.equal(points, AUTO_MAX);
    for (const [id, row] of byCriterion) {
      if (row.skipped) continue;
      assert.equal(row.passed, true, `${id}: ${row.message}`);
      assert.equal(row.needsReview, undefined, id);
    }
  });
});

describe("fix 1: Lab 4 / Lab 5 links by href", () => {
  it("S6: passes a /labs/lab4 link whose id is wd-toc-lab4-link", async () => {
    const pages = edit("/labs", '<a id="wd-lab4-link" href="/labs/lab4">', '<a id="wd-toc-lab4-link" href="/labs/lab4">');
    const { byCriterion } = await check(pages);
    assert.equal(byCriterion.get("a1-lab-labs-nav-oyo")?.passed, true);
    assert.equal(byCriterion.get("a1-lab-labs-nav-oyo")?.needsReview, undefined);
  });

  it("X5: passes a /labs/lab4 link with no id at all", async () => {
    const pages = edit("/labs", '<a id="wd-lab4-link" href="/labs/lab4">', '<a href="/labs/lab4">');
    const { byCriterion } = await check(pages);
    assert.equal(byCriterion.get("a1-lab-labs-nav-oyo")?.passed, true);
  });

  it("fails when there is no Lab 4 link, and says what is missing (not an id)", async () => {
    const pages = edit("/labs", '<li><a id="wd-lab4-link" href="/labs/lab4">Lab 4</a></li>', "");
    const { byCriterion } = await check(pages);
    const row = byCriterion.get("a1-lab-labs-nav-oyo");
    assert.equal(row?.passed, false);
    assert.match(row?.message ?? "", /\/labs\/lab4/);
    assert.doesNotMatch(row?.message ?? "", /wd-/);
  });

  it("Lab 5 needs a real anchor: the path in a script payload does not count", async () => {
    const pages = edit("/labs", '<li><a href="/labs/lab5">Lab 5</a></li>', '<script>self.__next_f.push([1,"\\"href\\":\\"/labs/lab5\\""])</script>');
    const { byCriterion } = await check(pages);
    assert.equal(byCriterion.get("a1-lab-labs-nav-ai")?.passed, false);
    const linked = await check(passingDeployPages());
    assert.equal(linked.byCriterion.get("a1-lab-labs-nav-ai")?.passed, true);
  });
});

describe("fix 2: Assignments list must contain links", () => {
  it("S6: an empty #wd-assignment-list fails", async () => {
    const pages = passingDeployPages();
    pages["/courses/1234/assignments"] = pages["/courses/1234/assignments"].replace(
      ASSIGNMENTS_CONTENT,
      '<div id="wd-assignments"><ul id="wd-assignment-list"></ul></div>',
    );
    const { byCriterion, points } = await check(pages);
    assert.equal(byCriterion.get("a1-kambaz-assignments")?.passed, false);
    assert.equal(points, AUTO_MAX - 5);
  });

  it("a list with assignment links passes, with or without the ids", async () => {
    const withIds = await check(passingDeployPages());
    assert.equal(withIds.byCriterion.get("a1-kambaz-assignments")?.passed, true);
    const pages = passingDeployPages();
    pages["/courses/1234/assignments"] = pages["/courses/1234/assignments"]
      .replace('<div id="wd-assignments">', "<div>")
      .replace('<ul id="wd-assignment-list">', "<ul>");
    const noIds = await check(pages);
    const row = noIds.byCriterion.get("a1-kambaz-assignments");
    assert.equal(row?.passed, true);
    assert.equal(row?.needsReview, undefined);
  });
});

describe("TOC Chapter 1 link (wd-toc-book-link)", () => {
  const LINK = '<a id="wd-toc-book-link" href="https://kambaz.dev/book/ch1">Chapter 1</a>';
  it("the full https://kambaz.dev/book/ch1 address passes with or without the id", async () => {
    const pages = passingDeployPages();
    assert.equal((await check(pages)).byCriterion.get("a1-lab-toc-ai")?.passed, true);
    const stripped = await check(pages, { transform: stripWdIds });
    assert.equal(stripped.byCriterion.get("a1-lab-toc-ai")?.passed, true);
    assert.equal(stripped.byCriterion.get("a1-lab-toc-ai")?.needsReview, undefined);
  });
  it("a relative /book/ch1 link without the id passes", async () => {
    const pages = passingDeployPages();
    for (const path of Object.keys(pages)) {
      pages[path] = pages[path].split(LINK).join('<a href="/book/ch1">Chapter 1</a>');
    }
    assert.equal((await check(pages, { transform: stripWdIds })).byCriterion.get("a1-lab-toc-ai")?.passed, true);
  });
  it("no Chapter 1 link and no id fails", async () => {
    const pages = passingDeployPages();
    for (const path of Object.keys(pages)) pages[path] = pages[path].split(LINK).join("Chapter 1");
    const graded = await check(pages, { transform: stripWdIds });
    assert.equal(graded.byCriterion.get("a1-lab-toc-ai")?.passed, false);
  });
});

describe("fix 2b: assignment links with a broken course id template", () => {
  it("still counts as an Assignments list when ids are stripped", async () => {
    const pages = passingDeployPages();
    pages["/courses/1234/assignments"] = pages["/courses/1234/assignments"]
      .split('href="/courses/1234/assignments/12')
      .join('href="/courses/${cid}/assignments/{$aid}');
    const withIds = await check(pages);
    const stripped = await check(pages, { transform: stripWdIds });
    assert.equal(withIds.byCriterion.get("a1-kambaz-assignments")?.passed, true);
    assert.equal(stripped.byCriterion.get("a1-kambaz-assignments")?.passed, true);
  });
});

describe("fix 3: TOC is read on /labs/lab1", () => {
  it("X2: a wd-lab1-link on the Labs index does not pass when Lab 1 has no TOC", async () => {
    const pages = passingDeployPages();
    // X2 had no layout.tsx: the index lists labs (one <li id="wd-lab1-link">)
    // and the Lab 1 page renders without any TOC.
    pages["/labs"] = pages["/labs"].replace(FIXTURE_TOC, '<ul><li id="wd-lab1-link"><a href="/labs/lab1">Lab 1</a></li></ul><a id="wd-github" href="https://github.com/jane-doe/webdev-client">GitHub</a><p>Jane Doe</p>');
    pages["/labs/lab1"] = pages["/labs/lab1"].replace(FIXTURE_TOC, "");
    const { byCriterion } = await check(pages);
    assert.equal(byCriterion.get("a1-lab-toc")?.passed, false);
  });

  it("S5: a partial TOC on Lab 1 (Lab 2 and Lab 3 not links) still passes", async () => {
    const partial = '<ul><li><a id="wd-lab1-link" href="/labs">Labs</a></li><li>Lab 2</li><li>Lab 3</li><li><a id="wd-toc-book-link" href="https://kambaz.dev/book/ch1">Chapter 1</a></li><li><a id="wd-github" href="https://github.com/jane-doe/webdev-client">GitHub</a></li></ul><p>Jane Doe</p>';
    const pages = passingDeployPages();
    for (const path of ["/labs", "/labs/lab1"]) pages[path] = pages[path].replace(FIXTURE_TOC, partial);
    const { byCriterion } = await check(pages);
    assert.equal(byCriterion.get("a1-lab-toc")?.passed, true);
  });

  it("X5: TOC links without ids on Lab 1 pass", async () => {
    const { byCriterion } = await check(passingDeployPages(), { transform: stripWdIds });
    const row = byCriterion.get("a1-lab-toc");
    assert.equal(row?.passed, true);
    assert.equal(row?.needsReview, undefined);
  });
});

function wall(status: number, finalUrl?: string): HtmlFetchResult {
  return {
    ok: true,
    status,
    finalUrl: finalUrl ?? `${FIXTURE_ORIGIN}/`,
    html: "<html><body>Authentication Required</body></html>",
  };
}

async function unreachable(getHtml: (url: string) => Promise<HtmlFetchResult>) {
  return runA1Checks({
    githubUrl: "https://github.com/jane-doe/webdev-client",
    vercelUrl: FIXTURE_ORIGIN,
    nameQuery: resolveNameQuery({ rosterName: "Doe, Jane" }),
    probes: {
      getHtml,
      async probeUrl() {
        return { ok: true, status: 200 };
      },
    },
  });
}

describe("fix 4: unreachable deploys are Needs re-check, not a score", () => {
  const cases: [string, (url: string) => Promise<HtmlFetchResult>][] = [
    ["S1/X4 Vercel SSO redirect", async () => wall(200, "https://vercel.com/sso-api?url=x")],
    ["401", async () => ({ ok: false, status: 401, code: "http_error", message: "HTTP 401" })],
    ["403", async () => wall(403)],
    ["X3 alias 404", async () => ({ ok: false, status: 404, code: "http_error", message: "HTTP 404" })],
    ["network", async () => ({ ok: false, code: "network", message: "fetch failed" })],
  ];
  for (const [label, getHtml] of cases) {
    it(`${label}: every deploy row is skipped and flagged`, async () => {
      const results = await unreachable(getHtml);
      assert.equal(checkRunStatus(results), "needs_recheck", label);
      assert.ok(needsRecheckReason(results));
      const byCriterion = latestResultByCriterion(results);
      for (const id of ["a1-lab-heading-tags", "a1-kambaz-assignments", "a1-delivery-labs-nav", "a1-delivery-name-section"]) {
        assert.equal(byCriterion.get(id)?.skipped, true, id);
        assert.equal(byCriterion.get(id)?.needsRecheck, true, id);
      }
      const row = exportRow(results);
      assert.equal(row.checkStatus, "needs_recheck");
      assert.equal(row.points, null);
      assert.equal(row.score, "");
      assert.equal(row.confidence, "needs_review");
      assert.equal(row.feedback, "");
    });
  }

  it("an unusable URL is also Needs re-check", async () => {
    const results = await runA1Checks({
      vercelUrl: "http://localhost:3000",
      probes: {
        async getHtml() {
          throw new Error("should not fetch");
        },
      },
    });
    assert.equal(checkRunStatus(results), "needs_recheck");
  });

  it("keeps the flags through sanitize (saved grades)", () => {
    const rows = sanitizeCheckResults([
      { id: "x", label: "x", passed: false, message: "m", skipped: true, needsRecheck: true },
      { id: "y", label: "y", passed: true, message: "m", needsReview: true },
      { id: "z", label: "z", passed: true, message: "m" },
    ]);
    assert.equal(rows[0].needsRecheck, true);
    assert.equal(rows[1].needsReview, true);
    assert.equal("needsReview" in rows[2], false);
  });
});

describe("ids are optional: stripping every wd-* id keeps the score", () => {
  it("strips ids from markup and from the script payload", () => {
    const stripped = stripWdIds(passingDeployPages()["/labs/lab1"]);
    assert.equal(/\bid\s*=\s*["']wd-/.test(stripped), false);
    assert.equal(/\\"id\\":\\"wd-/.test(stripped), false);
    assert.match(stripped, /href="\/labs\/lab2"/);
  });

  it("the passing deploy scores 113 with ids and 113 without them", async () => {
    const withIds = await check(passingDeployPages());
    const stripped = await check(passingDeployPages(), { transform: stripWdIds });
    assert.equal(withIds.points, AUTO_MAX);
    assert.equal(stripped.points, withIds.points);
    for (const [id, row] of withIds.byCriterion) {
      const after = stripped.byCriterion.get(id);
      assert.equal(after?.passed, row.passed, `${id}: ${after?.message}`);
      assert.equal(after?.skipped, row.skipped, id);
    }
    // Only rows with no reliable structure fall to TA review.
    assert.deepEqual(needsReviewCriterionIds(stripped.results).sort(), [
      "a1-lab-lists-ai",
      "a1-lab-paragraph-ai",
      "a1-lab-paragraph-oyo",
    ]);
  });

  it("each case above keeps its score when ids are stripped too", async () => {
    const s6 = passingDeployPages();
    s6["/courses/1234/assignments"] = s6["/courses/1234/assignments"].replace(
      ASSIGNMENTS_CONTENT,
      '<div id="wd-assignments"><ul id="wd-assignment-list"></ul></div>',
    );
    const a = await check(s6);
    const b = await check(s6, { transform: stripWdIds });
    assert.equal(b.points, a.points);
    assert.equal(b.byCriterion.get("a1-kambaz-assignments")?.passed, false);
  });

  it("review rows keep their points and are labeled, not marked wrong", async () => {
    const { results } = await check(passingDeployPages(), { transform: stripWdIds });
    const review = results.find((row) => row.criterionId === "a1-lab-paragraph-oyo");
    assert.equal(review?.passed, true);
    assert.match(review?.message ?? "", /Needs TA review/);
    const criteria = listRubricCriteria(A1_RUBRIC).map((row) => ({ id: row.id, points: row.points }));
    const row = gradeRowsFromResults(criteria, results).find((entry) => entry.criterionId === "a1-lab-paragraph-oyo");
    assert.equal(row?.points, 2);
    const presentation = rowPresentation({
      row: row!,
      scored: true,
      changed: false,
      audience: "staff",
      manual: false,
      needsReview: true,
    });
    assert.equal(presentation.label, "Needs TA review");
    assert.equal(presentation.fill, "review");
  });

  it("missing structure is still a real miss without ids", async () => {
    const pages = passingDeployPages();
    pages["/labs/lab1"] = pages["/labs/lab1"].replace(LAB1_CONTENT, "<h2>Lab 1</h2><p>Jane Doe</p><p>Coming soon.</p>");
    const { byCriterion } = await check(pages, { transform: stripWdIds });
    assert.equal(byCriterion.get("a1-lab-tables")?.passed, false);
    assert.equal(byCriterion.get("a1-lab-forms")?.passed, false);
    assert.equal(byCriterion.get("a1-lab-images")?.passed, false);
  });

  it("Labs navigation and the GitHub link pass on structure alone", async () => {
    const { byCriterion } = await check(passingDeployPages(), { transform: stripWdIds });
    assert.equal(byCriterion.get("a1-delivery-labs-nav")?.passed, true);
    assert.equal(byCriterion.get("a1-delivery-github")?.passed, true);
    assert.ok(LABS_INDEX_CONTENT.includes("/labs/lab1"));
  });
});

describe("personal links (any real personal link)", () => {
  it("X1: wd-your-link plus wd-your-linkedin passes", () => {
    assert.equal(
      a1PersonalLinksFound('<a id="wd-your-link" href="https://jane.dev">me</a><a id="wd-your-linkedin" href="https://www.linkedin.com/in/jane">in</a>'),
      true,
    );
  });
  it("a GitHub profile, LinkedIn, or portfolio with no ids passes", () => {
    assert.equal(a1PersonalLinksFound('<a href="https://github.com/jane-doe">GitHub</a>'), true);
    assert.equal(a1PersonalLinksFound('<a href="https://www.linkedin.com/in/jane">LinkedIn</a>'), true);
    assert.equal(a1PersonalLinksFound('<a href="https://jane-doe.dev">Portfolio</a>'), true);
  });
  it("only the book's sample links do not count", () => {
    const samples =
      '<a href="https://www.lipsum.com">lipsum</a><a href="https://github.com/jannunzi">author</a>' +
      '<a href="https://developer.mozilla.org/en-US/docs/Web/HTML">MDN</a><a href="https://github.com/jane-doe/webdev-client">repo</a>';
    assert.equal(a1PersonalLinksFound(samples), false);
  });
  it("the anchor On your own row passes without wd-your-github", async () => {
    const pages = edit("/labs/lab1", '<a id="wd-your-github" href="https://github.com/jane-doe">My GitHub</a><br />', "");
    const stripped = await check(pages, { transform: stripWdIds });
    assert.equal(stripped.byCriterion.get("a1-lab-anchor-oyo")?.passed, true);
    assert.equal(stripped.byCriterion.get("a1-lab-anchor-oyo")?.needsReview, undefined);
  });
});

function staffRow(results: AssignmentCheckResult[], extra: Partial<StaffStudentRow> = {}): StaffStudentRow {
  return {
    key: "jane@northeastern.edu",
    email: "jane@northeastern.edu",
    name: "Doe, Jane",
    section: "CS5610 02",
    clerkUserId: "user_1",
    hasSubmission: true,
    githubUrl: "https://github.com/jane-doe/webdev-client",
    vercelUrl: FIXTURE_ORIGIN,
    submittedAt: "2026-09-20T12:00:00.000Z",
    lastCheckedAt: "2026-10-07T14:00:00.000Z",
    checkerVersion: "a1-rules-v2+abc1234",
    checkResults: results,
    ...extra,
  };
}

function exportRow(results: AssignmentCheckResult[], extra: Partial<StaffStudentRow> = {}): SubmissionExportRow {
  return buildSubmissionExportRow({ assignmentId: "a1", rubric: A1_RUBRIC, row: staffRow(results, extra) });
}

const MANUAL_MAX = TOTAL - AUTO_MAX;
const MANUAL_IDS = listRubricCriteria(A1_RUBRIC)
  .filter((criterion) => criterionCoverage("a1", criterion.id) === "manual")
  .map((criterion) => criterion.id);

/** A staff Save: every row from the check, manual rows graded as given. */
function staffSave(
  results: AssignmentCheckResult[],
  options: { manual?: "full" | "none" | number; edit?: (rows: CriterionGradeRow[]) => CriterionGradeRow[] } = {},
) {
  const criteria = listRubricCriteria(A1_RUBRIC).map((c) => ({ id: c.id, points: c.points }));
  let rows = gradeRowsFromResults(criteria, results);
  const manual = options.manual ?? "full";
  let manualLeft = typeof manual === "number" ? manual : 0;
  rows = rows.map((row) => {
    if (!MANUAL_IDS.includes(row.criterionId)) return row;
    const points =
      manual === "full" ? row.maxPoints : manual === "none" ? 0 : Math.min(row.maxPoints, manualLeft);
    manualLeft -= points;
    return { ...row, overridePassed: points > 0, points };
  });
  if (options.edit) rows = options.edit(rows);
  return staffGradeRecordFromRows({
    rows,
    checkResults: results,
    gradedByEmail: "ta@northeastern.edu",
    gradedAt: new Date("2026-10-08T15:00:00.000Z"),
  });
}

describe("staff export for Canvas loading", () => {
  it("auto checks alone never credit the 12 manual points and are not ready for Canvas", async () => {
    const { results } = await check(passingDeployPages());
    const row = exportRow(results);
    assert.equal(row.autoPoints, AUTO_MAX);
    assert.equal(row.points, AUTO_MAX);
    assert.equal(row.manualPoints, null);
    assert.equal(row.manualMax, MANUAL_MAX);
    assert.equal(row.readyForCanvas, false);
    assert.match(row.readyReason, /manual item\(s\) not graded by staff/);
    assert.equal(row.canvasPercent, null);
    assert.equal(row.score, `${AUTO_MAX} / ${TOTAL} (grading in progress)`);
    assert.doesNotMatch(row.score, /%/);
    assert.equal(row.confidence, "needs_review");
    assert.equal(row.scoreSource, "auto");
    assert.equal(row.feedback, "");
    assert.equal(row.submittedUrl, FIXTURE_ORIGIN);
    assert.equal(row.checkerVersion, "a1-rules-v2+abc1234");
  });

  it("full marks: staff graded the manual items, nothing flagged, 125 / 125 ready right away", async () => {
    const { results } = await check(passingDeployPages());
    const row = exportRow(results, { staffGrade: staffSave(results) });
    assert.equal(row.points, TOTAL);
    assert.equal(row.manualPoints, MANUAL_MAX);
    assert.equal(row.readyForCanvas, true);
    assert.equal(row.readyReason, "fully graded");
    assert.equal(row.canvasPercent, 100);
    assert.equal(row.score, "125 / 125 (100.0%)");
    assert.equal(row.confidence, "full_marks");
    assert.equal(row.scoreSource, "staff");
  });

  it("confident deduction: one lost item, staff graded the manual items; one feedback line", async () => {
    const s6 = passingDeployPages();
    s6["/courses/1234/assignments"] = s6["/courses/1234/assignments"].replace(
      ASSIGNMENTS_CONTENT,
      '<div id="wd-assignments"><ul id="wd-assignment-list"></ul></div>',
    );
    const { results } = await check(s6);
    assert.equal(exportRow(results).confidence, "needs_review");
    const row = exportRow(results, { staffGrade: staffSave(results) });
    assert.equal(row.points, 120);
    assert.equal(row.canvasPercent, 96);
    assert.equal(row.confidence, "confident_deduction");
    assert.deepEqual(row.lostItems, ["a1-kambaz-assignments"]);
    const lines = row.feedback.split("\n");
    assert.equal(lines.length, 1);
    assert.match(lines[0], /^- Assignments screen \(§1\.4\.\d+\), −5: /);
    assert.match(lines[0], /Fix: https:\/\/kambaz\.dev\/book\/ch1#sec-1-4/);
  });

  it("a staff grade overrides the auto score, and staff-entered manual points are used", async () => {
    const { results } = await check(passingDeployPages());
    // TA takes 10 off an auto item the checker passed.
    const lower = staffSave(results, {
      edit: (rows) => rows.map((row) => (row.criterionId === "a1-kambaz-editor" ? { ...row, points: 0 } : row)),
    });
    const row = exportRow(results, { staffGrade: lower });
    assert.equal(row.autoPoints, AUTO_MAX);
    assert.equal(row.points, TOTAL - 5);
    assert.equal(row.canvasPercent, 96);
    assert.equal(row.staffPoints, TOTAL - 5);
    // Partial manual credit: 6 of 12.
    const partial = exportRow(results, { staffGrade: staffSave(results, { manual: 6 }) });
    assert.equal(partial.manualPoints, 6);
    assert.equal(partial.points, AUTO_MAX + 6);
    assert.equal(partial.readyForCanvas, true);
    assert.equal(partial.confidence, "confident_deduction");
  });

  it("an older override-only save that never graded the manual items is not ready", async () => {
    const { results } = await check(passingDeployPages());
    const row = exportRow(results, {
      staffGrade: {
        earnedPoints: AUTO_MAX,
        totalPoints: TOTAL,
        percent: 90.4,
        acceptedProposed: false,
        criterionOverrides: { "a1-kambaz-editor": true },
        gradedAt: "2026-10-08T15:00:00.000Z",
      },
    });
    assert.equal(row.readyForCanvas, false);
    assert.equal(row.canvasPercent, null);
    assert.match(row.readyReason, /manual item\(s\) not graded/);
  });

  it("not ready: open TA-review items, a duplicate, an unmatched submission, or a re-check", async () => {
    const stripped = await check(passingDeployPages(), { transform: stripWdIds });
    const review = exportRow(stripped.results);
    assert.equal(review.confidence, "needs_review");
    assert.match(review.reviewReasons.join(";"), /need TA review/);
    // A staff Save decides every row, review items included.
    const decided = exportRow(stripped.results, { staffGrade: staffSave(stripped.results) });
    assert.equal(decided.readyForCanvas, true, decided.readyReason);

    const full = await check(passingDeployPages());
    const graded = staffSave(full.results);
    const duplicate = exportRow(full.results, {
      staffGrade: graded,
      priorSubmissions: [{ url: "https://old.vercel.app", at: "2026-09-10T00:00:00.000Z" }],
    });
    assert.equal(duplicate.readyForCanvas, false);
    assert.equal(duplicate.canvasPercent, null);
    assert.equal(duplicate.confidence, "needs_review");
    assert.match(duplicate.readyReason, /duplicate submission/);
    const unmatched = exportRow(full.results, { staffGrade: graded, unmatched: true });
    assert.equal(unmatched.readyForCanvas, false);
    assert.match(unmatched.readyReason, /does not match a roster student/);

    const flaky = await checkWith(
      failingProbes(passingDeployPages(), /^\/courses\/1234\/modules$/, OPEN_FAILURES["503"]),
    );
    const recheck = exportRow(flaky.results, {
      staffGrade: staffSave(flaky.results, {
        edit: (rows) => rows.filter((row) => row.criterionId !== "a1-kambaz-modules"),
      }),
    });
    assert.equal(recheck.readyForCanvas, false);
    assert.match(recheck.readyReason, /1 item\(s\) need TA review/);
  });

  it("not checked yet is not ready, with no score", () => {
    const row = exportRow([]);
    assert.equal(row.checkStatus, "not_checked");
    assert.equal(row.points, null);
    assert.equal(row.readyForCanvas, false);
    assert.equal(row.confidence, "needs_review");
  });

  it("writes ready_for_canvas, ready_reason and canvas_percent (blank until ready)", async () => {
    const { results } = await check(passingDeployPages());
    const csv = submissionExportCsv(A1_RUBRIC, [
      exportRow(results, { staffGrade: staffSave(results) }),
      exportRow(results),
    ]);
    const [header, ready, pending] = csv.trim().split("\r\n");
    const columns = header.split(",");
    for (const column of ["submitted_url", "checker_version", "points", "manual_points", "score", "ready_for_canvas", "ready_reason", "canvas_percent", "confidence", "feedback", "item:a1-kambaz-assignments"]) {
      assert.ok(columns.includes(column), column);
    }
    for (const gone of ["percent", "staff_percent", "manual_points_credited"]) {
      assert.ok(!columns.includes(gone), gone);
    }
    const cells = (line: string): string[] =>
      [...line.matchAll(/("(?:[^"]|"")*"|[^,]*)(,|$)/g)]
        .slice(0, columns.length)
        .map((m) => m[1].replace(/^"|"$/g, "").replace(/""/g, '"'));
    const cell = (line: string, column: string) => cells(line)[columns.indexOf(column)];
    assert.equal(cell(ready, "ready_for_canvas"), "yes");
    assert.equal(cell(ready, "canvas_percent"), "100.0");
    assert.equal(cell(pending, "ready_for_canvas"), "no");
    assert.equal(cell(pending, "canvas_percent"), "");
    assert.equal(cell(pending, "manual_points"), "");
    assert.ok(ready.includes(FIXTURE_ORIGIN));
    assert.ok(ready.includes("a1-rules-v2+abc1234"));
    assert.equal(csvCell('a "b", c'), '"a ""b"", c"');
    assert.equal(csvCell("one\ntwo"), '"one\ntwo"');
  });

  it("the student page, staff view and export get the same percentage from finalGrade", async () => {
    const s6 = passingDeployPages();
    s6["/courses/1234/assignments"] = s6["/courses/1234/assignments"].replace(
      ASSIGNMENTS_CONTENT,
      '<div id="wd-assignments"><ul id="wd-assignment-list"></ul></div>',
    );
    const { results } = await check(s6);
    const saved = staffSave(results);
    const row = staffRow(results, { staffGrade: saved });
    const exported = buildSubmissionExportRow({ assignmentId: "a1", rubric: A1_RUBRIC, row });
    // What the page builds from the saved grade (AssignmentChecklist input).
    const view = gradeViewFromStaffGrade({
      studentClerkUserId: "user_1",
      assignmentId: "a1",
      githubUrl: "",
      vercelUrl: FIXTURE_ORIGIN,
      criteria: listRubricCriteria(A1_RUBRIC).map((c) => ({ id: c.id, points: c.points })),
      staffGrade: saved,
      checkResults: results,
    });
    assert.ok(view);
    const page = finalGrade({
      assignmentId: "a1",
      rubric: A1_RUBRIC,
      results,
      staff: { earnedPoints: view.earnedPoints, rows: view.rows },
    });
    const nav = finalGradeForStaffRow("a1", A1_RUBRIC, row);
    assert.equal(page.canvasPercent, 96);
    assert.equal(page.canvasPercent, exported.canvasPercent);
    assert.equal(nav.canvasScore, exported.score);
    assert.equal(page.canvasScore, exported.score);

    // Before staff grade: the page shows auto points and "grading in progress", no %.
    const before = finalGrade({ assignmentId: "a1", rubric: A1_RUBRIC, results, staff: null });
    assert.equal(before.ready, false);
    assert.equal(before.canvasPercent, null);
    assert.equal(before.canvasScore, "");
    const text = gradingInProgressText(before);
    assert.match(text, /108 \/ 113 points · grading in progress/);
    assert.doesNotMatch(text, /%/);
  });

  it("summarizes which items students miss most", async () => {
    const full = await check(passingDeployPages());
    const s6 = passingDeployPages();
    s6["/courses/1234/assignments"] = s6["/courses/1234/assignments"].replace(
      ASSIGNMENTS_CONTENT,
      '<div id="wd-assignments"><ul id="wd-assignment-list"></ul></div>',
    );
    const missed = await check(s6);
    const stripped = await check(passingDeployPages(), { transform: stripWdIds });
    const rows = [exportRow(full.results), exportRow(missed.results), exportRow(stripped.results), exportRow([])];
    const summary = missedItemSummary({ assignmentId: "a1", rubric: A1_RUBRIC, rows });
    assert.equal(summary[0].criterionId, "a1-kambaz-assignments");
    assert.equal(summary[0].missed, 1);
    assert.equal(summary[0].scored, 3);
    assert.equal(summary[0].missedPercent, 33.3);
    const paragraph = summary.find((row) => row.criterionId === "a1-lab-paragraph-oyo");
    assert.equal(paragraph?.needsReview, 1);
    assert.equal(summary.some((row) => row.criterionId === "a1-lab-forms-ai"), false, "manual rows omitted");
    const csv = missedItemSummaryCsv(summary);
    assert.ok(csv.startsWith("criterion_id,section,group,item,points,missed,needs_review,scored_submissions,missed_percent,book_url\r\n"));
  });
});

function memoryStore(initial: AssignmentSubmissionDoc[] = []): SubmissionStore & { docs: AssignmentSubmissionDoc[] } {
  const docs = [...initial];
  return {
    docs,
    async find(clerkUserId, assignmentId) {
      return docs.find((doc) => doc.clerkUserId === clerkUserId && doc.assignmentId === assignmentId) ?? null;
    },
    async upsert(doc) {
      const index = docs.findIndex((row) => row.clerkUserId === doc.clerkUserId && row.assignmentId === doc.assignmentId);
      if (index === -1) docs.push(doc);
      else docs[index] = doc;
    },
    async listByAssignment(assignmentId) {
      return docs.filter((doc) => doc.assignmentId === assignmentId);
    },
  };
}

function submission(clerkUserId: string): AssignmentSubmissionDoc {
  return {
    clerkUserId,
    assignmentId: "a1",
    githubUrl: "https://github.com/x/webdev-client",
    vercelUrl: `https://${clerkUserId}.vercel.app`,
    createdAt: new Date("2026-09-18T10:00:00Z"),
    updatedAt: new Date("2026-09-20T10:00:00Z"),
    checkResults: [{ id: "old", label: "old", passed: true, message: "stale" }],
    staffGrade: {
      earnedPoints: 115,
      totalPoints: 125,
      percent: 92,
      acceptedProposed: false,
      gradedAt: new Date("2026-09-29T10:00:00Z"),
    },
  };
}

describe("fix 5: re-run all and save", () => {
  it("re-checks every submission in batches and keeps submission time and staff grade", async () => {
    const store = memoryStore(["u3", "u1", "u2"].map(submission));
    const seen: string[] = [];
    const now = new Date("2026-10-07T15:00:00Z");
    const run = async (offset: number) =>
      rerunCheckBatch({
        store,
        docs: store.docs,
        offset,
        limit: 2,
        checkerVersion: "a1-rules-v2+abc1234",
        now: () => now,
        runChecks: async (doc) => {
          seen.push(doc.clerkUserId);
          return doc.clerkUserId === "u2"
            ? [{ id: "a1-delivery-vercel-open", label: "open", passed: false, message: "wall", needsRecheck: true }]
            : [{ id: "a1-lab-paragraph-oyo", label: "p", passed: true, message: "review", needsReview: true, criterionId: "a1-lab-paragraph-oyo" }];
        },
      });
    const first = await run(0);
    assert.equal(first.total, 3);
    assert.equal(first.processed, 2);
    assert.equal(first.nextOffset, 2);
    const second = await run(first.nextOffset!);
    assert.equal(second.nextOffset, null);
    assert.deepEqual(seen.sort(), ["u1", "u2", "u3"]);
    assert.equal(first.scored + second.scored, 2);
    assert.equal(first.needsRecheck + second.needsRecheck, 1);
    for (const doc of store.docs) {
      assert.equal(doc.updatedAt.toISOString(), "2026-09-20T10:00:00.000Z");
      assert.equal(doc.lastCheckedAt?.toISOString(), now.toISOString());
      assert.equal(doc.checkerVersion, "a1-rules-v2+abc1234");
      assert.equal(doc.staffGrade?.earnedPoints, 115);
      assert.notEqual(doc.checkResults?.[0].id, "old");
    }
  });

  it("a failed check is reported and leaves that submission untouched", async () => {
    const store = memoryStore([submission("u1")]);
    const result = await rerunCheckBatch({
      store,
      docs: store.docs,
      offset: 0,
      limit: 5,
      checkerVersion: "v",
      runChecks: async () => {
        throw new Error("boom");
      },
    });
    assert.equal(result.errors.length, 1);
    assert.equal(store.docs[0].checkResults?.[0].id, "old");
  });

  it("Submit stores check results and the checker version (and replaces stale ones)", async () => {
    const store = memoryStore([submission("u1")]);
    const doc = await upsertAssignmentSubmission(store, {
      clerkUserId: "u1",
      assignmentId: "a1",
      githubUrl: "https://github.com/x/webdev-client",
      vercelUrl: "https://new.vercel.app",
      checkResults: [],
      checked: false,
      checkerVersion: "a1-rules-v2",
    });
    assert.deepEqual(doc.checkResults, []);
    assert.equal(doc.checkerVersion, "a1-rules-v2");
    assert.notEqual(doc.updatedAt.toISOString(), "2026-09-20T10:00:00.000Z");
  });
});

describe("checker version", () => {
  it("is bumped to v2 and carries the deploy commit when present", () => {
    assert.equal(A1_CHECKER_RULES_VERSION, "a1-rules-v2");
    assert.equal(checkerVersionLabel("a1-rules-v2", { VERCEL_GIT_COMMIT_SHA: "abcdef1234567" }), "a1-rules-v2+abcdef1");
    assert.equal(checkerVersionLabel("a1-rules-v2", {}), "a1-rules-v2");
  });
});

describe("structure helpers ignore script payloads", () => {
  it("renderedMarkup drops scripts, styles, and comments", () => {
    const html = '<p>a</p><script>"<a href=\\"/labs/lab4\\">"</script><style>a{}</style><!-- <a href="/x"> -->';
    assert.equal(renderedMarkup(html), "<p>a</p>");
  });
});

/* ------------------------------------------------------------------ */
/* PR #209 QA blockers: empty sites, boilerplate, 404 pages, feedback  */
/* ------------------------------------------------------------------ */

async function checkWith(probes: ReturnType<typeof fixtureProbes>) {
  const results = await runA1Checks({
    githubUrl: "https://github.com/jane-doe/webdev-client",
    vercelUrl: FIXTURE_ORIGIN,
    nameQuery: resolveNameQuery({ rosterName: "Doe, Jane" }),
    probes,
  });
  return {
    results,
    byCriterion: latestResultByCriterion(results),
    points: proposedGradeFromResults(A1_RUBRIC, results).earnedPoints,
  };
}

/** main's results on Quentin's guard sites (Oct 7 audit). */
const MAIN_BARE = 3;
const MAIN_CATCH_ALL = 3;
const KAMBAZ_SCREENS = [
  "a1-kambaz-account",
  "a1-kambaz-dashboard",
  "a1-kambaz-modules",
  "a1-kambaz-home",
  "a1-kambaz-assignments",
  "a1-kambaz-editor",
];

function failedMessages(results: AssignmentCheckResult[]): string[] {
  return results.filter((row) => !row.passed && !row.skipped).map((row) => row.message);
}

describe("B1: a fetched 404 fails; review is not a pass for empty sites", () => {
  it("a bare create-next-app scores like main (about 3 / 113), with nothing in TA review", async () => {
    const { results, points } = await check(bareCreateNextAppPages());
    assert.ok(points <= MAIN_BARE + 3, `bare create-next-app scored ${points}`);
    assert.deepEqual(needsReviewCriterionIds(results), []);
    const row = exportRow(results);
    assert.equal(row.confidence, "needs_review");
    assert.ok((row.points ?? 0) <= MAIN_BARE + 3 + (TOTAL - AUTO_MAX));
  });

  it("every Kambaz screen that returns 404 fails, and says the page wasn't found", async () => {
    const pages = passingDeployPages();
    for (const path of Object.keys(pages)) {
      if (!path.startsWith("/labs") && path !== "/") delete pages[path];
    }
    const { byCriterion } = await check(pages);
    for (const id of KAMBAZ_SCREENS) {
      const row = byCriterion.get(id);
      assert.equal(row?.passed, false, `${id}: ${row?.message}`);
      assert.equal(row?.needsReview, undefined, id);
      assert.match(row?.message ?? "", /HTTP 404/, id);
    }
  });

  it("a Lab 1 page that returns 404 fails its lab items (no TA review)", async () => {
    const pages = passingDeployPages();
    delete pages["/labs/lab1"];
    pages["/labs"] = pages["/labs"].replace(LABS_INDEX_CONTENT, "<h1>Labs</h1>");
    const { byCriterion } = await check(pages, { transform: stripWdIds });
    for (const id of ["a1-lab-tables", "a1-lab-paragraph-oyo", "a1-lab-highlighted-box", "a1-lab-images-ai", "a1-lab-toc"]) {
      assert.equal(byCriterion.get(id)?.passed, false, id);
      assert.equal(byCriterion.get(id)?.needsReview, undefined, id);
    }
  });

  it("a page that couldn't be fetched (5xx or timeout) keeps its points and is flagged, not failed", async () => {
    const pages = passingDeployPages();
    const probes = fixtureProbes(pages);
    const flaky: typeof probes = {
      ...probes,
      async getHtml(url) {
        if (/\/modules$/i.test(new URL(url).pathname)) {
          return { ok: false, status: 503, code: "http_error", message: "HTTP 503" };
        }
        return probes.getHtml(url);
      },
    };
    const { byCriterion, points } = await checkWith(flaky);
    const row = byCriterion.get("a1-kambaz-modules");
    assert.equal(row?.passed, true);
    assert.equal(row?.needsReview, true);
    assert.match(row?.message ?? "", /Needs re-check/);
    assert.equal(points, AUTO_MAX);
  });

  it("On your own / With AI go to TA review only when the core item passed", async () => {
    // Core paragraph present (no ids): its On your own / With AI rows are review.
    const ok = await check(passingDeployPages(), { transform: stripWdIds });
    assert.equal(ok.byCriterion.get("a1-lab-paragraph-oyo")?.needsReview, true);
    // No paragraphs at all: the core fails, so On your own and With AI fail too.
    const pages = passingDeployPages();
    pages["/labs/lab1"] = pages["/labs/lab1"].replace(/<p\b[\s\S]*?<\/p>/g, "");
    const graded = await check(pages, { transform: stripWdIds });
    assert.equal(graded.byCriterion.get("a1-lab-paragraph")?.passed, false);
    for (const id of ["a1-lab-paragraph-oyo", "a1-lab-paragraph-ai"]) {
      assert.equal(graded.byCriterion.get(id)?.passed, false, id);
      assert.equal(graded.byCriterion.get(id)?.needsReview, undefined, id);
    }
  });

  it("a core item with no reliable structure is review only on a real lab page", async () => {
    // Highlighted box missing on an otherwise complete Lab 1: TA review, points kept.
    const pages = passingDeployPages();
    pages["/labs/lab1"] = pages["/labs/lab1"].replace(
      '<div id="wd-highlighted-box" style="background-color:lightblue;padding:10px"><h4>Box</h4><p>Nested</p></div>',
      "",
    );
    const graded = await check(pages, { transform: stripWdIds });
    assert.equal(graded.byCriterion.get("a1-lab-highlighted-box")?.needsReview, true);
    // On the template page it fails.
    const bare = await checkWith(catchAllProbes(CREATE_NEXT_APP_HTML));
    assert.equal(bare.byCriterion.get("a1-lab-highlighted-box")?.passed, false);
    assert.equal(bare.byCriterion.get("a1-kambaz-modules")?.passed, false);
  });
});

/* ------------------------------------------------------------------ */
/* B4: a Lab page that couldn't be opened never costs points           */
/* ------------------------------------------------------------------ */

const OPEN_FAILURES: Record<string, HtmlFetchResult> = {
  "503": { ok: false, status: 503, code: "http_error", message: "HTTP 503" },
  timeout: { ok: false, code: "network", message: "The request timed out." },
  "401 login wall": { ok: false, status: 401, code: "http_error", message: "HTTP 401" },
};

/** Fixture probes where every path matching `failing` returns `failure`. */
function failingProbes(
  pages: Record<string, string>,
  failing: RegExp,
  failure: HtmlFetchResult,
  transform?: (html: string) => string,
) {
  const probes = fixtureProbes(pages, transform);
  return {
    ...probes,
    async getHtml(url: string): Promise<HtmlFetchResult> {
      if (failing.test(new URL(url).pathname)) return failure;
      return probes.getHtml(url);
    },
  };
}

const LAB_ROW_IDS = A1_RUBRIC.groups
  .flatMap((group) => group.criteria)
  .filter((criterion) => criterion.id.startsWith("a1-lab-"))
  .map((criterion) => criterion.id);

describe("B4: a Lab page that couldn't be opened keeps the points", () => {
  for (const [label, failure] of Object.entries(OPEN_FAILURES)) {
    for (const strip of [false, true]) {
      it(`/labs/lab1 ${label}${strip ? " (no ids)" : ""}: a full site stays at 113 with re-check flags`, async () => {
        const probes = failingProbes(
          passingDeployPages(),
          /^\/labs\/lab1\/?$/,
          failure,
          strip ? stripWdIds : undefined,
        );
        const { results, byCriterion, points } = await checkWith(probes);
        assert.equal(points, AUTO_MAX, failedMessages(results).join("\n"));
        assert.deepEqual(failedMessages(results), []);
        // Lab 1 items are never graded against /labs: the ones that would
        // need Lab 1 are re-checks naming /labs/lab1.
        const recheck = results.filter((row) => row.needsReview && /Needs re-check/.test(row.message));
        assert.ok(recheck.length >= 10, `only ${recheck.length} re-check rows`);
        for (const row of recheck) assert.match(row.message, /\/labs\/lab1/, row.criterionId);
        for (const row of results) assert.doesNotMatch(row.message, /Lab 1 doesn't show/, row.criterionId);
        for (const id of ["a1-lab-tables", "a1-lab-images", "a1-lab-forms-text"].filter((id) => byCriterion.has(id))) {
          assert.equal(byCriterion.get(id)?.needsReview, true, id);
        }
        assert.equal(exportRow(results).confidence, "needs_review");
      });
    }
  }

  for (const [label, failure] of Object.entries(OPEN_FAILURES)) {
    it(`every /labs page ${label}: 113, and the Labs nav, GitHub link and name are re-checks`, async () => {
      const probes = failingProbes(passingDeployPages(), /^\/labs(\/|$)/, failure);
      const { results, byCriterion, points } = await checkWith(probes);
      assert.equal(points, AUTO_MAX, failedMessages(results).join("\n"));
      assert.deepEqual(failedMessages(results), []);
      for (const id of ["a1-delivery-labs-nav", "a1-delivery-github", "a1-delivery-name-section"]) {
        const rows = results.filter((row) => row.criterionId === id && row.needsReview);
        assert.ok(rows.length > 0, `${id} should be flagged`);
        for (const row of rows) assert.match(row.message, /Needs re-check: \/labs/, id);
      }
      for (const row of results) assert.doesNotMatch(row.message, /The page opened/, row.criterionId);
      for (const id of LAB_ROW_IDS) {
        const row = byCriterion.get(id);
        if (row && !row.skipped) assert.equal(row.passed, true, id);
      }
      assert.equal(exportRow(results).confidence, "needs_review");
    });
  }

  it("/labs/lab1 that returns 404 still fails its items, and says so", async () => {
    const pages = passingDeployPages();
    delete pages["/labs/lab1"];
    const { results, byCriterion, points } = await check(pages, { transform: stripWdIds });
    assert.ok(points < AUTO_MAX - 20, `scored ${points}`);
    const tables = byCriterion.get("a1-lab-tables");
    assert.equal(tables?.passed, false);
    assert.equal(tables?.needsReview, undefined);
    assert.match(tables?.message ?? "", /\/labs\/lab1, returned HTTP 404/);
    assert.equal(results.some((row) => /Needs re-check/.test(row.message)), false);
  });

  it("every /labs page returning 404 fails the Labs delivery checks without saying the page opened", async () => {
    const pages = passingDeployPages();
    for (const path of Object.keys(pages)) if (path.startsWith("/labs")) delete pages[path];
    const { results, byCriterion } = await check(pages);
    const nav = byCriterion.get("a1-delivery-labs-nav");
    assert.equal(nav?.passed, false);
    assert.equal(nav?.needsReview, undefined);
    assert.match(nav?.message ?? "", /HTTP 404/);
    assert.doesNotMatch(nav?.message ?? "", /The page opened/);
    const link = results.find((row) => row.id === "a1-delivery-github-link");
    assert.equal(link?.passed, false);
    assert.match(link?.message ?? "", /HTTP 404/);
  });

  it("the GitHub link check reads only the Lab pages, never the home page", async () => {
    const link = '<li><a id="wd-github" href="https://github.com/jane-doe/webdev-client">My GitHub</a></li>';
    const pages = passingDeployPages();
    for (const path of Object.keys(pages)) {
      pages[path] = pages[path].replace(/<a\b[^>]*github\.com[^>]*>[\s\S]*?<\/a>/gi, "");
    }
    pages["/"] = pages["/"].replace("</div>", `</div><ul>${link}</ul>`);
    const { results } = await check(pages);
    const row = results.find((entry) => entry.id === "a1-delivery-github-link");
    assert.equal(row?.passed, false, row?.message);
    assert.equal(row?.needsReview, undefined);
  });

  it("a 404 on /labs/lab1 and a 503 on /labs is a re-check naming /labs, not a fail", async () => {
    const pages = passingDeployPages();
    delete pages["/labs/lab1"];
    const probes = failingProbes(pages, /^\/labs\/?$/, OPEN_FAILURES["503"]);
    const { byCriterion } = await checkWith(probes);
    const tables = byCriterion.get("a1-lab-tables");
    assert.equal(tables?.passed, true);
    assert.equal(tables?.needsReview, true);
    assert.match(tables?.message ?? "", /Needs re-check: \/labs on your deploy/);
  });
});

describe("B2: one page at a time, no boilerplate, real content", () => {
  it("a catch-all site (the starter page on every route) scores like main", async () => {
    const { results, points, byCriterion } = await checkWith(catchAllProbes(CREATE_NEXT_APP_HTML));
    assert.ok(points <= MAIN_CATCH_ALL + 3, `catch-all scored ${points}`);
    assert.deepEqual(needsReviewCriterionIds(results), []);
    // The template's logos and its vercel.com / nextjs.org links are not lab work.
    for (const id of [
      "a1-lab-images",
      "a1-lab-images-oyo",
      "a1-lab-images-ai",
      "a1-lab-anchor",
      "a1-lab-anchor-ai",
      "a1-lab-paragraph",
    ]) {
      assert.equal(byCriterion.get(id)?.passed, false, id);
    }
  });

  it("lab items never read the home page", async () => {
    const pages = bareCreateNextAppPages();
    pages["/"] = page200(LAB1_CONTENT);
    const { byCriterion } = await check(pages, { transform: stripWdIds });
    for (const id of ["a1-lab-tables", "a1-lab-images", "a1-lab-forms", "a1-lab-anchor"]) {
      assert.equal(byCriterion.get(id)?.passed, false, id);
    }
  });

  it("counts do not add up across pages", async () => {
    const pages = passingDeployPages();
    for (const path of Object.keys(pages)) {
      if (path.startsWith("/labs")) pages[path] = pages[path].replace(/<p\b[\s\S]*?<\/p>/g, "");
    }
    pages["/labs/lab1"] = pages["/labs/lab1"].replace("<h2>Lab 1</h2>", "<h2>Lab 1</h2><p>Only one paragraph here.</p>");
    pages["/labs/lab2"] = pages["/labs/lab2"].replace("<h2>Lab 2</h2>", "<h2>Lab 2</h2><p>And one here.</p>");
    const joined = await check(pages, { transform: stripWdIds });
    assert.equal(joined.byCriterion.get("a1-lab-paragraph")?.passed, false);
    // Two on the same page pass.
    pages["/labs/lab1"] = pages["/labs/lab1"].replace("<p>Only one paragraph here.</p>", "<p>One.</p><p>Two.</p>");
    const { byCriterion } = await check(pages, { transform: stripWdIds });
    assert.equal(byCriterion.get("a1-lab-paragraph")?.passed, true);
  });

  it("ids on empty divs do not pass (structure and content, not ids)", async () => {
    const { byCriterion, points } = await checkWith(catchAllProbes(IDS_ONLY_HTML));
    for (const id of [
      "a1-delivery-labs-nav",
      "a1-lab-heading-tags",
      "a1-lab-paragraph",
      "a1-lab-lists",
      "a1-lab-tables",
      "a1-lab-images",
      "a1-lab-forms",
      "a1-lab-anchor",
      "a1-lab-highlighted-paragraph",
      "a1-lab-highlighted-box",
      "a1-lab-labs-nav-oyo",
      "a1-lab-toc",
      "a1-lab-toc-ai",
      ...KAMBAZ_SCREENS,
      "a1-kambaz-nav",
      "a1-kambaz-course-nav",
    ]) {
      assert.equal(byCriterion.get(id)?.passed, false, id);
    }
    assert.ok(points <= 10, `ids-only scored ${points}`);
  });

  it("an id counts only when its element has the content", () => {
    const el = (html: string, id: string) => elementsWithId(html, id)[0];
    assert.equal(a1IdHasContent("wd-tables", el('<div id="wd-tables"></div>', "wd-tables")), false);
    assert.equal(
      a1IdHasContent("wd-tables", el('<div id="wd-tables"><table><tr><th>Q</th></tr><tr><td>Q1</td></tr></table></div>', "wd-tables")),
      true,
    );
    assert.equal(a1IdHasContent("wd-pancakes", el('<ol id="wd-pancakes"></ol>', "wd-pancakes")), false);
    assert.equal(a1IdHasContent("wd-pancakes", el('<ol id="wd-pancakes"><li>Mix</li></ol>', "wd-pancakes")), true);
    assert.equal(a1IdHasContent("wd-your-form", el('<form id="wd-your-form"></form>', "wd-your-form")), false);
    assert.equal(a1IdHasContent("wd-your-form", el('<form id="wd-your-form"><input /></form>', "wd-your-form")), true);
    assert.equal(a1IdHasContent("wd-lab4-link", el('<div id="wd-lab4-link"></div>', "wd-lab4-link")), false);
    assert.equal(a1IdHasContent("wd-lab4-link", el('<li id="wd-lab4-link"><a href="/labs/lab4">Lab 4</a></li>', "wd-lab4-link")), true);
    assert.equal(a1IdHasContent("wd-your-image", el('<img id="wd-your-image" src="/me.jpg" alt="me" />', "wd-your-image")), true);
    assert.equal(a1IdHasContent("wd-your-image", el('<img id="wd-your-image" />', "wd-your-image")), false);
    assert.equal(a1IdHasContent("wd-p-your-1", el('<p id="wd-p-your-1"></p>', "wd-p-your-1")), false);
  });

  it("template images and links are ignored, a student's own image is not", () => {
    assert.equal(realImageCount(CREATE_NEXT_APP_HTML), 0);
    assert.equal(realImageCount('<img src="/next.svg" alt="my image" />'), 1);
    assert.equal(isBoilerplateUrl(new URL("https://nextjs.org/docs")), true);
    assert.equal(isBoilerplateUrl(new URL("https://vercel.com/new")), true);
    assert.equal(isBoilerplateUrl(new URL("https://nextjs.org/docs/app/api-reference/components/link")), false);
    assert.equal(isBoilerplateUrl(new URL("https://developer.mozilla.org/en-US/docs/Web/HTML")), false);
  });
});

describe("Assignments list: at least three assignment links (book §1.4.7)", () => {
  const twoLinks = '<div id="wd-assignments"><ul id="wd-assignment-list"><li><a href="/courses/1234/assignments/123">A1</a></li><li><a href="/courses/1234/assignments/124">A2</a></li></ul></div>';
  it("two links fail, with or without ids; three pass", async () => {
    const pages = passingDeployPages();
    pages["/courses/1234/assignments"] = pages["/courses/1234/assignments"].replace(ASSIGNMENTS_CONTENT, twoLinks);
    for (const transform of [undefined, stripWdIds]) {
      const graded = await check(pages, { transform });
      const row = graded.byCriterion.get("a1-kambaz-assignments");
      assert.equal(row?.passed, false);
      assert.match(row?.message ?? "", /at least three assignments/);
    }
    assert.equal(MIN_ASSIGNMENT_LINKS, 3);
    const full = await check(passingDeployPages(), { transform: stripWdIds });
    assert.equal(full.byCriterion.get("a1-kambaz-assignments")?.passed, true);
  });
});

describe("B3: feedback says what was missing, never an id", () => {
  async function failingCases() {
    const kambaz404 = passingDeployPages();
    for (const path of Object.keys(kambaz404)) {
      if (!path.startsWith("/labs") && path !== "/") delete kambaz404[path];
    }
    const s6 = passingDeployPages();
    s6["/courses/1234/assignments"] = s6["/courses/1234/assignments"].replace(
      ASSIGNMENTS_CONTENT,
      '<div id="wd-assignments"><ul id="wd-assignment-list"></ul></div>',
    );
    const x2 = passingDeployPages();
    x2["/labs/lab1"] = x2["/labs/lab1"].replace(FIXTURE_TOC, "");
    return [
      await check(bareCreateNextAppPages()),
      await checkWith(catchAllProbes(CREATE_NEXT_APP_HTML)),
      await checkWith(catchAllProbes(IDS_ONLY_HTML)),
      await check(kambaz404),
      await check(s6),
      await check(s6, { transform: stripWdIds }),
      await check(x2),
      await check(x2, { transform: stripWdIds }),
    ];
  }

  it("no fail message, review message, or export feedback line names a wd- id", async () => {
    const cases = await failingCases();
    let lines = 0;
    for (const { results } of cases) {
      for (const message of failedMessages(results)) {
        lines += 1;
        assert.doesNotMatch(message, /wd-/, message);
      }
      for (const row of results.filter((entry) => entry.needsReview)) {
        assert.doesNotMatch(row.message, /wd-/, row.message);
      }
      const feedback = exportRow(results).feedback;
      for (const line of feedback.split("\n").filter(Boolean)) {
        assert.doesNotMatch(line, /wd-/, line);
        assert.match(line, /Fix: https:\/\/kambaz\.dev\/book\//, line);
      }
    }
    assert.ok(lines > 50, `expected many failing rows, saw ${lines}`);
  });

  it("S6: the empty Assignments list says there are no assignment links", async () => {
    const s6 = passingDeployPages();
    s6["/courses/1234/assignments"] = s6["/courses/1234/assignments"].replace(
      ASSIGNMENTS_CONTENT,
      '<div id="wd-assignments"><ul id="wd-assignment-list"></ul></div>',
    );
    const { byCriterion } = await check(s6);
    assert.match(byCriterion.get("a1-kambaz-assignments")?.message ?? "", /assignments that each link/);
  });

  it("every A1 fail message and structure miss message is id-free", () => {
    for (const spec of A1_CHECKER.autoSpecs) {
      assert.doesNotMatch(spec.failMessage, /wd-/, spec.criterionId);
    }
    for (const [id, fallback] of Object.entries(A1_STRUCTURE_FALLBACKS)) {
      assert.doesNotMatch(fallback.missMessage, /wd-/, id);
    }
    assert.doesNotMatch(A1_CHECKER.delivery.labsNav.failMessage, /wd-/);
    assert.doesNotMatch(A1_CHECKER.delivery.github.linkFailMessage, /wd-/);
  });
});

describe("re-run writes only the check fields", () => {
  it("a staff grade saved while the batch runs is not overwritten", async () => {
    const store = memoryStore([submission("u1")]);
    let upserts = 0;
    const tracked: SubmissionStore = {
      ...store,
      async upsert(doc) {
        upserts += 1;
        await store.upsert(doc);
      },
      async setCheckRun(clerkUserId, assignmentId, fields) {
        const doc = store.docs.find((row) => row.clerkUserId === clerkUserId && row.assignmentId === assignmentId);
        if (!doc) return false;
        Object.assign(doc, fields);
        return true;
      },
    };
    await rerunCheckBatch({
      store: tracked,
      docs: store.docs,
      offset: 0,
      limit: 5,
      checkerVersion: "a1-rules-v2+abc1234",
      runChecks: async (doc) => {
        // Staff press Save while the check is running.
        const live = store.docs.find((row) => row.clerkUserId === doc.clerkUserId)!;
        live.staffGrade = { ...live.staffGrade!, earnedPoints: 120, comments: { x: "nice" } };
        return [{ id: "a1-lab-tables", label: "t", passed: true, message: "ok", criterionId: "a1-lab-tables" }];
      },
    });
    assert.equal(upserts, 0);
    assert.equal(store.docs[0].staffGrade?.earnedPoints, 120);
    assert.equal(store.docs[0].staffGrade?.comments?.x, "nice");
    assert.equal(store.docs[0].checkResults?.[0].id, "a1-lab-tables");
    assert.equal(store.docs[0].checkerVersion, "a1-rules-v2+abc1234");
    assert.equal(store.docs[0].updatedAt.toISOString(), "2026-09-20T10:00:00.000Z");
  });
});

function page200(body: string): string {
  return `<!DOCTYPE html><html><body>${body}</body></html>`;
}
