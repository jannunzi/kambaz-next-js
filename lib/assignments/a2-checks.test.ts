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
import { A1_FOLLOWUP_URL_CAP } from "./crawl";
import { listRubricCriteria, rubricPointTotal } from "./catalog";
import { preparePublicAssignmentCheck } from "./submission-form";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import { criterionVerifyPath, criterionVerifyUrl } from "./verify-urls";
import { resolveNameQuery } from "./names";

const ORIGIN = "https://jane-a2.vercel.app";

const PASS_LABS = `
  <div id="wd-labs">
    <h2>Jane Doe</h2>
    <a id="wd-lab1-link" href="/labs/lab1">Lab 1</a>
    <a id="wd-lab2-link" href="/labs/lab2">Lab 2</a>
    <a id="wd-kambaz-link" href="/account/signin">Kambaz</a>
    <a id="wd-github" href="https://github.com/jane-doe/webdev-client">GitHub</a>
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
    <div id="wd-react-icons-sampler"></div>
  </div>
`;

const PASS_TAILWIND = `
  <div class="ms-4 font-thin bg-red-500 md:flex">
    <img class="blur-lg" alt="" />
    <div id="wd-tailwind-grid-system"></div>
  </div>
`;

function passingHtml(url: string): string {
  if (url.includes("/labs/lab2/tailwind")) return PASS_TAILWIND;
  if (url.includes("/labs/lab2")) return PASS_LAB2;
  if (url.includes("/labs")) return PASS_LABS;
  return "<main>Home</main>";
}

function failingHtml(url: string): string {
  if (url.includes("/labs/lab2/tailwind")) {
    return `<div id="wd-tailwind-grid-system" class="ms-4 font-thin bg-red-500 md:flex"></div>`;
  }
  if (url.includes("/labs/lab2")) {
    return PASS_LAB2.replace('id="wd-id-selector-2"', 'id="wd-other"').replace(
      "wd-media-queries-demo",
      "wd-media-queries-missing",
    );
  }
  if (url.includes("/labs")) {
    return PASS_LABS.replace('id="wd-lab2-link"', 'id="wd-lab-link"');
  }
  return "<main>Home</main>";
}

describe("A2 rubric and checker config", () => {
  it("keeps the Chapter 2 point total and covers every row", () => {
    const criteria = listRubricCriteria(A2_RUBRIC);
    assert.equal(rubricPointTotal(A2_RUBRIC), 83);
    assert.equal(criteria.length, 19);
    let autoPoints = 0;
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
        autoPoints += row.points;
      }
    }
    assert.equal(autoPoints, 38);
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
      `${ORIGIN}/courses/1234/people#wd-people-table`,
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
  it("passes a fixture site that has the Chapter 2 markers", async () => {
    const calls: string[] = [];
    const results = await runA2Checks({
      githubUrl: "https://github.com/jane-doe/webdev-client/tree/a2",
      vercelUrl: ORIGIN,
      nameQuery: resolveNameQuery({ firstName: "Jane", lastName: "Doe" }),
      probes: {
        async getHtml(url) {
          calls.push(url);
          return { ok: true, status: 200, finalUrl: url, html: passingHtml(url) };
        },
        async probeUrl() {
          return { ok: true, status: 200 };
        },
      },
    });
    assert.ok(calls.includes(`${ORIGIN}/labs/lab2`));
    assert.ok(calls.includes(`${ORIGIN}/labs/lab2/tailwind`));
    const byCriterion = latestResultByCriterion(results);
    for (const row of listRubricCriteria(A2_RUBRIC)) {
      const result = byCriterion.get(row.id);
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
    const prepared = preparePublicAssignmentCheck({
      assignmentId: "a2",
      githubUrl: "https://github.com/jane-doe/webdev-client/tree/a2",
      vercelUrl: ORIGIN,
    });
    assert.equal(prepared.ok, true);
    assert.equal(supportsUrlSubmission("a2"), true);
  });

  it("fails branch, labs nav, selectors, layout, and tailwind on a partial site", async () => {
    const results = await runA2Checks({
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: ORIGIN,
      nameQuery: resolveNameQuery({ firstName: "Jane", lastName: "Doe" }),
      probes: {
        async getHtml(url) {
          return { ok: true, status: 200, finalUrl: url, html: failingHtml(url) };
        },
        async probeUrl() {
          return { ok: true, status: 200 };
        },
      },
    });
    const byCriterion = latestResultByCriterion(results);
    assert.equal(byCriterion.get("a2-delivery-branch")?.passed, false);
    assert.match(byCriterion.get("a2-delivery-branch")?.message ?? "", /tree\/a2/);
    assert.equal(byCriterion.get("a2-delivery-vercel")?.passed, true);
    assert.equal(byCriterion.get("a2-delivery-name-github")?.passed, true);
    assert.equal(byCriterion.get("a2-delivery-labs-nav")?.passed, false);
    assert.equal(byCriterion.get("a2-lab-page")?.passed, false);
    assert.equal(byCriterion.get("a2-lab-selectors")?.passed, false);
    assert.match(byCriterion.get("a2-lab-selectors")?.message ?? "", /wd-id-selector-2/);
    assert.equal(byCriterion.get("a2-lab-box-model")?.passed, true);
    assert.equal(byCriterion.get("a2-lab-layout")?.passed, false);
    assert.match(byCriterion.get("a2-lab-layout")?.message ?? "", /wd-media-queries-demo/);
    assert.equal(byCriterion.get("a2-lab-icons")?.passed, true);
    assert.equal(byCriterion.get("a2-lab-tailwind")?.passed, false);
    assert.match(byCriterion.get("a2-lab-tailwind")?.message ?? "", /blur-lg/);
    assert.equal(byCriterion.get("a2-kambaz-nav")?.skipped, true);
  });
});
