import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { A1_RUBRIC } from "./a1";
import { A1_CHECKER_FOLLOWUP_CAP } from "./a1-checker";
import { a1CriterionCoverage } from "./a1-rubric";
import { A2_RUBRIC } from "./a2";
import { A2_VERIFY_HASHES, A2_VERIFY_PATHS, a2CriterionCoverage } from "./a2-checker";
import { supportsUrlSubmission } from "./access";
import { criterionCoverage } from "./checkers";
import { latestResultByCriterion, runA2Checks } from "./checks";
import type { AssignmentCheckResult, HtmlFetchResult } from "./checks";
import { A1_FOLLOWUP_URL_CAP } from "./crawl";
import { listRubricCriteria, rubricPointTotal } from "./catalog";
import { preparePublicAssignmentCheck } from "./submission-form";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import { criterionVerifyPath, criterionVerifyUrl } from "./verify-urls";
import { resolveNameQuery } from "./names";

const ORIGIN = "https://webdev-client-git-a2-jane.vercel.app";
const MAIN_ORIGIN = "https://jane-a1.vercel.app";
const TREE = "https://github.com/jane-doe/webdev-client/tree/a2";
const REPO = "https://github.com/jane-doe/webdev-client";

const PASS_LABS = `
  <div id="wd-labs">
    <h2>Jane Doe</h2>
    <a href="/labs/lab1/">Lab 1</a>
    <a href="${ORIGIN}/labs/lab2">Lab 2</a>
    <a id="wd-kambaz-link" href="/">Kambaz</a>
    <a id="wd-github" href="${REPO}">GitHub</a>
  </div>
`;

const PASS_LAB2 = `
  <div id="wd-lab2">
    <div id="wd-css-id-selectors">
      <p id="wd-id-selector-1"></p>
      <p id="wd-id-selector-2"></p>
    </div>
    <div id="wd-css-class-selectors">
      <p class="wd-class-selector">Class</p>
    </div>
    <div id="wd-css-document-structure">
      <div class="wd-selector-1"></div>
    </div>
    <div id="wd-css-colors"></div>
    <div id="wd-css-background-colors"></div>
    <div id="wd-css-borders"></div>
    <div id="wd-css-paddings"></div>
    <div id="wd-css-margins"></div>
    <div id="wd-css-box-model"></div>
    <div id="wd-css-corners"></div>
    <div id="wd-css-dimensions"></div>
    <div id="wd-css-display"></div>
    <div id="wd-css-positions">
      <div id="wd-css-position-relative"></div>
      <div id="wd-css-position-absolute"></div>
      <div id="wd-css-position-fixed"></div>
    </div>
    <div id="wd-z-index"></div>
    <div id="wd-float-divs"></div>
    <div id="wd-css-grid-layout"></div>
    <div id="wd-css-flex"></div>
    <div class="wd-media-queries-demo"></div>
    <div id="wd-react-icons-sampler"><svg viewBox="0 0 24 24"></svg></div>
  </div>
`;

const PASS_TAILWIND = `
  <div class="ms-4 font-thin">
    <div class="bg-red-500 md:flex"></div>
    <img class="blur-lg" alt="" />
    <div id="wd-tailwind-grid-system" class="grid grid-cols-4 gap-4"></div>
  </div>
`;

function autoPoints(results: readonly AssignmentCheckResult[]): number {
  const byCriterion = latestResultByCriterion(results);
  let points = 0;
  for (const row of listRubricCriteria(A2_RUBRIC)) {
    if (a2CriterionCoverage(row.id) !== "auto") continue;
    const result = byCriterion.get(row.id);
    if (result?.passed && !result.skipped) points += row.points;
  }
  return points;
}

function bookHtml(url: string): string {
  if (url.includes("/labs/lab2/tailwind")) return PASS_TAILWIND;
  if (url.includes("/labs/lab2")) return PASS_LAB2;
  if (url.includes("/labs")) return PASS_LABS;
  return "<main>Home</main>";
}

async function grade(input: {
  githubUrl?: string;
  vercelUrl?: string;
  html: (url: string) => string | HtmlFetchResult;
  name?: boolean;
  probeStatus?: number;
}) {
  const probed: string[] = [];
  const calls: string[] = [];
  const results = await runA2Checks({
    githubUrl: input.githubUrl,
    vercelUrl: input.vercelUrl ?? ORIGIN,
    nameQuery:
      input.name === false
        ? undefined
        : resolveNameQuery({ firstName: "Jane", lastName: "Doe" }),
    probes: {
      async getHtml(url) {
        calls.push(url);
        const body = input.html(url);
        if (typeof body !== "string") return body;
        return { ok: true, status: 200, finalUrl: url, html: body };
      },
      async probeUrl(url) {
        probed.push(url);
        if (input.probeStatus === 200 || input.probeStatus === undefined) {
          return url === TREE
            ? { ok: true as const, status: 200 }
            : { ok: false as const, status: 404, message: "missing" };
        }
        return { ok: false as const, status: input.probeStatus, message: "missing" };
      },
    },
  });
  return {
    results,
    probed,
    calls,
    points: autoPoints(results),
    by: latestResultByCriterion(results),
  };
}

describe("A2 rubric and checker config", () => {
  it("keeps the Chapter 2 point total and covers every row", () => {
    const criteria = listRubricCriteria(A2_RUBRIC);
    assert.equal(rubricPointTotal(A2_RUBRIC), 83);
    assert.equal(criteria.length, 19);
    let autoPointsTotal = 0;
    let manualPoints = 0;
    const manual: string[] = [];
    for (const row of criteria) {
      assert.equal(criterionVerifyPath(row.id), A2_VERIFY_PATHS[row.id]);
      const coverage = a2CriterionCoverage(row.id);
      assert.equal(criterionCoverage("a2", row.id), coverage);
      if (coverage === "manual") {
        manual.push(row.id);
        manualPoints += row.points;
        assert.equal(row.points, 5);
      } else {
        autoPointsTotal += row.points;
      }
    }
    assert.equal(autoPointsTotal, 38);
    assert.equal(manualPoints, 45);
    assert.deepEqual(manual, [
      "a2-kambaz-nav",
      "a2-kambaz-dashboard",
      "a2-kambaz-course-nav",
      "a2-kambaz-modules",
      "a2-kambaz-home",
      "a2-kambaz-people",
      "a2-kambaz-assignments",
      "a2-kambaz-editor",
      "a2-kambaz-account",
    ]);
    assert.equal(A1_CHECKER_FOLLOWUP_CAP, A1_FOLLOWUP_URL_CAP);
    for (const row of listRubricCriteria(A1_RUBRIC)) {
      assert.equal(
        criterionCoverage("a1", row.id),
        a1CriterionCoverage(row.id),
        row.id,
      );
    }
  });

  it("deep-links each A2 row to the student deploy", () => {
    assert.equal(
      criterionVerifyUrl(`${ORIGIN}/account/signin`, "a2-lab-selectors"),
      `${ORIGIN}/labs/lab2#wd-css-id-selectors`,
    );
    assert.equal(
      criterionVerifyUrl(ORIGIN, "a2-lab-tailwind"),
      `${ORIGIN}/labs/lab2/tailwind#${A2_VERIFY_HASHES["a2-lab-tailwind"]}`,
    );
    assert.equal(
      criterionVerifyUrl(ORIGIN, "a2-kambaz-people"),
      `${ORIGIN}/courses/1234/people/table#wd-people-table`,
    );
    assert.equal(
      criterionVerifyUrl(ORIGIN, "a2-delivery-labs-nav"),
      `${ORIGIN}/labs`,
    );
    assert.equal(
      criterionVerifyUrl(ORIGIN, "a2-kambaz-nav"),
      `${ORIGIN}/dashboard#wd-kambaz-navigation`,
    );
    assert.equal(criterionVerifyUrl(ORIGIN, "a2-delivery-branch"), `${ORIGIN}/`);
    assert.equal(criterionVerifyUrl(ORIGIN, "a2-delivery-vercel"), `${ORIGIN}/`);
  });
});

describe("runA2Checks", () => {
  it("scores 38/38 auto on a book-faithful Chapter 2 site", async () => {
    assert.equal(PASS_LABS.includes("wd-lab1-link"), false);
    assert.equal(PASS_LABS.includes("wd-lab2-link"), false);
    const graded = await grade({
      githubUrl: TREE,
      html: bookHtml,
    });
    assert.ok(graded.calls.includes(`${ORIGIN}/labs/lab2`));
    assert.ok(graded.calls.includes(`${ORIGIN}/labs/lab2/tailwind`));
    assert.ok(graded.calls.includes(`${ORIGIN}/courses/1234/people/table`));
    assert.deepEqual(graded.probed, [TREE]);
    assert.equal(
      graded.results.some((row) => row.id === "github-url" || row.id === "github-public"),
      false,
    );
    for (const row of listRubricCriteria(A2_RUBRIC)) {
      const result = graded.by.get(row.id);
      assert.ok(result, row.id);
      if (a2CriterionCoverage(row.id) === "manual") {
        assert.equal(result.skipped, true, row.id);
        assert.equal(result.message, ASSIGNMENT_STUDENT_COPY.manualCheckHint);
        assert.equal(result.passed, false);
      } else {
        assert.equal(result.passed, true, `${row.id}: ${result.message}`);
        assert.equal(result.skipped, undefined);
      }
    }
    assert.equal(graded.points, 38);
    const prepared = preparePublicAssignmentCheck({
      assignmentId: "a2",
      githubUrl: TREE,
      vercelUrl: ORIGIN,
    });
    assert.equal(prepared.ok, true);
    assert.equal(supportsUrlSubmission("a2"), true);
  });

  it("fails branch, labs nav, selectors, layout, and tailwind on a partial site", async () => {
    const graded = await grade({
      githubUrl: REPO,
      html(url) {
        if (url.includes("/labs/lab2/tailwind")) {
          return `<div id="wd-tailwind-grid-system" class="ms-4 font-thin bg-red-500 md:flex grid grid-cols-4"></div>`;
        }
        if (url.includes("/labs/lab2")) {
          return PASS_LAB2.replace('id="wd-id-selector-2"', 'id="wd-other"').replace(
            "wd-media-queries-demo",
            "wd-media-queries-missing",
          );
        }
        if (url.includes("/labs")) {
          return PASS_LABS.replace(`${ORIGIN}/labs/lab2`, "/labs/other");
        }
        return "<main>Home</main>";
      },
    });
    assert.equal(graded.by.get("a2-delivery-branch")?.passed, false);
    assert.match(graded.by.get("a2-delivery-branch")?.message ?? "", /tree\/a2/);
    assert.equal(graded.by.get("a2-delivery-vercel")?.passed, true);
    assert.equal(graded.by.get("a2-delivery-name-github")?.passed, true);
    assert.equal(graded.probed.length, 0);
    assert.equal(graded.by.get("a2-delivery-labs-nav")?.passed, false);
    assert.equal(graded.by.get("a2-lab-page")?.passed, false);
    assert.equal(graded.by.get("a2-lab-selectors")?.passed, false);
    assert.match(graded.by.get("a2-lab-selectors")?.message ?? "", /wd-id-selector-2/);
    assert.equal(graded.by.get("a2-lab-box-model")?.passed, true);
    assert.equal(graded.by.get("a2-lab-layout")?.passed, false);
    assert.match(graded.by.get("a2-lab-layout")?.message ?? "", /wd-media-queries-demo/);
    assert.equal(graded.by.get("a2-lab-icons")?.passed, true);
    assert.equal(graded.by.get("a2-lab-tailwind")?.passed, false);
    assert.match(graded.by.get("a2-lab-tailwind")?.message ?? "", /blur-lg/);
    assert.equal(graded.by.get("a2-kambaz-nav")?.skipped, true);
  });

  it("does not let one bad GitHub URL fail the name row", async () => {
    const graded = await grade({
      githubUrl: TREE,
      probeStatus: 404,
      html: bookHtml,
    });
    assert.deepEqual(graded.probed, [TREE]);
    assert.equal(graded.by.get("a2-delivery-branch")?.passed, false);
    assert.match(graded.by.get("a2-delivery-branch")?.message ?? "", /404/);
    assert.equal(graded.by.get("a2-delivery-name-github")?.passed, true);
    assert.equal(graded.points, 35);
  });

  it("rejects an A1 main deployment even when the site loads", async () => {
    const graded = await grade({
      githubUrl: TREE,
      vercelUrl: MAIN_ORIGIN,
      html: bookHtml,
    });
    assert.equal(graded.by.get("a2-delivery-vercel")?.passed, false);
    assert.match(graded.by.get("a2-delivery-vercel")?.message ?? "", /-git-a2-/);
    assert.equal(graded.by.get("a2-lab-page")?.passed, true);
    assert.equal(graded.points, 35);
  });

  it("scores a blank site 0 on the auto rows", async () => {
    const graded = await grade({
      githubUrl: "",
      vercelUrl: "https://blank.vercel.app",
      name: false,
      html: () => "<main></main>",
    });
    assert.equal(graded.points, 0);
    for (const row of listRubricCriteria(A2_RUBRIC)) {
      if (a2CriterionCoverage(row.id) !== "auto") continue;
      assert.equal(graded.by.get(row.id)?.passed, false, row.id);
    }
  });

  it("scores an A1-only site near 0 on the A2 auto rows", async () => {
    const graded = await grade({
      githubUrl: REPO,
      vercelUrl: MAIN_ORIGIN,
      html(url) {
        if (url.includes("/labs/lab2/tailwind") || url.includes("/labs/lab2")) {
          return {
            ok: false,
            status: 404,
            finalUrl: url,
            code: "http_error",
            message: "missing",
          };
        }
        if (url.includes("/labs")) {
          return `
            <div id="wd-labs">
              <h2>Jane Doe</h2>
              <a id="wd-home-link" href="/labs">Labs</a>
              <a href="/labs/lab1">Lab 1</a>
              <a id="wd-kambaz-link" href="/">Kambaz</a>
              <a id="wd-github" href="${REPO}">GitHub</a>
              <div id="wd-lab1"></div>
            </div>
          `;
        }
        if (url.includes("/dashboard")) {
          return `<div id="wd-dashboard"><nav id="wd-kambaz-navigation"></nav></div>`;
        }
        if (url.includes("/account/signin")) return `<div id="wd-signin-screen"></div>`;
        return "<main>A1</main>";
      },
    });
    assert.equal(graded.by.get("a2-delivery-name-github")?.passed, true);
    assert.equal(graded.by.get("a2-delivery-vercel")?.passed, false);
    assert.equal(graded.by.get("a2-delivery-branch")?.passed, false);
    assert.equal(graded.by.get("a2-delivery-labs-nav")?.passed, false);
    assert.equal(graded.by.get("a2-lab-page")?.passed, false);
    assert.equal(graded.by.get("a2-lab-tailwind")?.passed, false);
    assert.equal(graded.by.get("a2-lab-icons")?.passed, false);
    assert.equal(graded.points, 3);
  });

  it("does not pass Tailwind from prose, a longer utility, or a 404 page", async () => {
    const prose = await grade({
      githubUrl: TREE,
      html(url) {
        if (url.includes("/labs/lab2/tailwind")) {
          return `<p id="wd-tailwind-grid-system">ms-4 font-thin bg-red-500 md:flex blur-lg grid grid-cols-4</p>`;
        }
        return bookHtml(url);
      },
    });
    assert.equal(prose.by.get("a2-lab-tailwind")?.passed, false);
    assert.match(prose.by.get("a2-lab-tailwind")?.message ?? "", /ms-4/);

    const prefix = await grade({
      githubUrl: TREE,
      html(url) {
        if (url.includes("/labs/lab2/tailwind")) {
          return `<div id="wd-tailwind-grid-system" class="ms-40 font-thin bg-red-500 md:flex blur-lg grid grid-cols-4"></div>`;
        }
        return bookHtml(url);
      },
    });
    assert.equal(prefix.by.get("a2-lab-tailwind")?.passed, false);
    assert.match(prefix.by.get("a2-lab-tailwind")?.message ?? "", /ms-4/);

    const missingGrid = await grade({
      githubUrl: TREE,
      html(url) {
        if (url.includes("/labs/lab2/tailwind")) {
          return `<div id="wd-tailwind-grid-system" class="ms-4 font-thin bg-red-500 md:flex blur-lg grid-cols-4"></div>`;
        }
        return bookHtml(url);
      },
    });
    assert.equal(missingGrid.by.get("a2-lab-tailwind")?.passed, false);
    assert.match(missingGrid.by.get("a2-lab-tailwind")?.message ?? "", /class grid/);

    const missingPage = await grade({
      githubUrl: TREE,
      html(url) {
        if (url.includes("/labs/lab2/tailwind")) {
          return {
            ok: false,
            status: 404,
            finalUrl: url,
            html: PASS_TAILWIND,
            code: "http_error",
            message: "missing",
          };
        }
        if (url.includes("/labs/lab2")) return `${PASS_LAB2}\n${PASS_TAILWIND}`;
        return bookHtml(url);
      },
    });
    assert.equal(missingPage.by.get("a2-lab-tailwind")?.passed, false);
    assert.match(missingPage.by.get("a2-lab-tailwind")?.message ?? "", /404/);
    assert.equal(missingPage.by.get("a2-lab-icons")?.passed, true);
  });

  it("fails React Icons when the sampler has no svg", async () => {
    const graded = await grade({
      githubUrl: TREE,
      html(url) {
        if (url.includes("/labs/lab2/tailwind")) return PASS_TAILWIND;
        if (url.includes("/labs/lab2")) {
          return PASS_LAB2.replace(/<svg[^>]*><\/svg>/, "");
        }
        return bookHtml(url);
      },
    });
    assert.equal(graded.by.get("a2-lab-icons")?.passed, false);
    assert.match(graded.by.get("a2-lab-icons")?.message ?? "", /svg/);
    assert.equal(graded.points, 35);
  });
});
