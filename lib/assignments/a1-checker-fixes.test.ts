/**
 * A1 checker fixes from the Oct 7 QA sweep, plus the "ids are optional" rule.
 * Cases S6, X1, X2, X5, S1/X4 (login wall) and X3 (404 alias) are rebuilt as
 * small edits of the synthetic passing deploy in fixtures/a1-deploy.ts.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { A1_RUBRIC } from "./a1";
import { a1PersonalLinksFound } from "./a1-structure";
import { checkRunStatus, needsRecheckReason, needsReviewCriterionIds } from "./check-status";
import type { AssignmentCheckResult, HtmlFetchResult } from "./check-types";
import { A1_CHECKER_RULES_VERSION, checkerVersionLabel } from "./checker-version";
import { latestResultByCriterion, runA1Checks } from "./checks";
import {
  buildSubmissionExportRow,
  CONFIDENT_DEDUCTION_FLOOR,
  csvCell,
  missedItemSummary,
  missedItemSummaryCsv,
  submissionExportCsv,
  type SubmissionExportRow,
} from "./export";
import { proposedGradeFromResults } from "./grade";
import { gradeRowsFromResults, rowPresentation, sanitizeCheckResults } from "./grade-rows";
import { renderedMarkup, stripWdIds } from "./html";
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

  it("fails when there is no Lab 4 link, and keeps the book's id instruction", async () => {
    const pages = edit("/labs", '<li><a id="wd-lab4-link" href="/labs/lab4">Lab 4</a></li>', "");
    const { byCriterion } = await check(pages);
    const row = byCriterion.get("a1-lab-labs-nav-oyo");
    assert.equal(row?.passed, false);
    assert.match(row?.message ?? "", /wd-lab4-link/);
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

describe("staff export for Canvas loading", () => {
  it("full marks: 125 / 125 with no feedback", async () => {
    const { results } = await check(passingDeployPages());
    const row = exportRow(results);
    assert.equal(row.points, TOTAL);
    assert.equal(row.autoPoints, AUTO_MAX);
    assert.equal(row.manualPointsCredited, TOTAL - AUTO_MAX);
    assert.equal(row.score, "125 / 125 (100.0%)");
    assert.equal(row.confidence, "full_marks");
    assert.equal(row.feedback, "");
    assert.equal(row.submittedUrl, FIXTURE_ORIGIN);
    assert.equal(row.checkerVersion, "a1-rules-v2+abc1234");
  });

  it("confident deduction: one lost item gets one feedback line with the book section", async () => {
    const s6 = passingDeployPages();
    s6["/courses/1234/assignments"] = s6["/courses/1234/assignments"].replace(
      ASSIGNMENTS_CONTENT,
      '<div id="wd-assignments"><ul id="wd-assignment-list"></ul></div>',
    );
    const { results } = await check(s6);
    const row = exportRow(results);
    assert.equal(row.points, 120);
    assert.equal(row.percent, 96);
    assert.equal(row.confidence, "confident_deduction");
    assert.deepEqual(row.lostItems, ["a1-kambaz-assignments"]);
    const lines = row.feedback.split("\n");
    assert.equal(lines.length, 1);
    assert.match(lines[0], /^- Assignments screen \(§1\.4\.\d+\), −5: /);
    assert.match(lines[0], /Fix: https:\/\/kambaz\.dev\/book\/ch1#sec-1-4/);
  });

  it("needs review: a TA-review item, a duplicate, an unmatched submission, or a low total", async () => {
    const stripped = await check(passingDeployPages(), { transform: stripWdIds });
    const review = exportRow(stripped.results);
    assert.equal(review.points, TOTAL);
    assert.equal(review.confidence, "needs_review");
    assert.match(review.reviewReasons.join(";"), /need TA review/);

    const full = await check(passingDeployPages());
    const duplicate = exportRow(full.results, {
      priorSubmissions: [{ url: "https://old.vercel.app", at: "2026-09-10T00:00:00.000Z" }],
    });
    assert.equal(duplicate.confidence, "needs_review");
    assert.match(duplicate.reviewReasons.join(";"), /duplicate submission/);
    assert.equal(exportRow(full.results, { unmatched: true }).confidence, "needs_review");

    const pages = passingDeployPages();
    pages["/labs/lab1"] = pages["/labs/lab1"].replace(LAB1_CONTENT, "<h2>Lab 1</h2>");
    const low = exportRow((await check(pages)).results);
    assert.ok((low.points ?? 0) < CONFIDENT_DEDUCTION_FLOOR);
    assert.equal(low.confidence, "needs_review");
    assert.match(low.reviewReasons.join(";"), /below 113/);
  });

  it("not checked yet is needs review with no score", () => {
    const row = exportRow([]);
    assert.equal(row.checkStatus, "not_checked");
    assert.equal(row.points, null);
    assert.equal(row.confidence, "needs_review");
  });

  it("writes the CSV with URL, checker version, points and percent, and per-item outcomes", async () => {
    const { results } = await check(passingDeployPages());
    const csv = submissionExportCsv(A1_RUBRIC, [exportRow(results)]);
    const [header, line] = csv.trim().split("\r\n");
    const columns = header.split(",");
    for (const column of ["submitted_url", "checker_version", "points", "percent", "score", "confidence", "feedback", "item:a1-kambaz-assignments"]) {
      assert.ok(columns.includes(column), column);
    }
    assert.ok(line.includes(FIXTURE_ORIGIN));
    assert.ok(line.includes("a1-rules-v2+abc1234"));
    assert.ok(line.includes("100.0"));
    assert.equal(csvCell('a "b", c'), '"a ""b"", c"');
    assert.equal(csvCell("one\ntwo"), '"one\ntwo"');
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
