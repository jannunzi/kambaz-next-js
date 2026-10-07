/**
 * A3 checker against a student project built from the Chapter 3 listings
 * in book order with the reference JSON (fixtures/a3-student-build.json,
 * scripts stripped). Each variant edits that build the way a real
 * submission could differ; ids are used only to simulate removals, never
 * by the checks.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { A3_RUBRIC } from "./a3";
import { A3_CHECKER, A3_SEED_PATHS, A3_VERIFY_PATHS } from "./a3-checker";
import { criterionCoverage, getChecker } from "./checkers";
import { latestResultByCriterion, runA3Checks } from "./checks";
import type { AssignmentCheckResult, HtmlFetchResult } from "./checks";
import { supportsUrlSubmission } from "./access";
import { formatPointsPercent } from "./grade";
import { stripWdIds } from "./html";
import { resolveNameQuery } from "./names";

const ORIGIN = "https://webdev-client-git-a3-jane-doe.vercel.app";
const TREE = "https://github.com/jane-doe/webdev-client/tree/a3";

type Page = { status: number; html: string };
const BUILD: Record<string, Page> = JSON.parse(
  readFileSync(new URL("./fixtures/a3-student-build.json", import.meta.url), "utf8"),
);

const CRITERIA = A3_RUBRIC.groups.flatMap((group) => group.criteria);
const TOTAL = CRITERIA.reduce((sum, row) => sum + row.points, 0);

/** A page source: returns a page, or a fetch failure. */
type Serve = (path: string) => Page | HtmlFetchResult;
const fromBuild: Serve = (path) => BUILD[path] ?? { status: 404, html: "<html><body><h1>404</h1><p>This page could not be found.</p></body></html>" };

async function grade(serve: Serve): Promise<{ results: AssignmentCheckResult[]; points: number; failed: string[]; review: string[]; recheck: string[] }> {
  const results = await runA3Checks({
    githubUrl: TREE,
    vercelUrl: ORIGIN,
    nameQuery: resolveNameQuery({ firstName: "Jane", lastName: "Doe" }),
    probes: {
      getHtml: async (url) => {
        const path = new URL(url).pathname;
        const page = serve(path);
        if ("ok" in page) return page;
        if (page.status >= 200 && page.status < 300) {
          return { ok: true, status: page.status, finalUrl: ORIGIN + path, html: page.html };
        }
        return { ok: false, status: page.status, finalUrl: ORIGIN + path, html: page.html, code: "http_error", message: `HTTP ${page.status}` };
      },
      probeUrl: async () => ({ ok: true, status: 200 }),
    },
  });
  const byCriterion = latestResultByCriterion(results);
  let points = 0;
  const failed: string[] = [];
  const review: string[] = [];
  const recheck: string[] = [];
  for (const row of CRITERIA) {
    const result = byCriterion.get(row.id);
    if (result?.passed && !result.skipped) points += row.points;
    else failed.push(row.id);
    if (result?.needsReview) (/re-check/i.test(result.message) ? recheck : review).push(row.id);
  }
  return { results, points, failed, review, recheck };
}

/* ---------------------------- variant helpers ---------------------------- */

function removeElement(html: string, attribute: RegExp): string {
  const open = new RegExp(`<([a-zA-Z0-9]+)\\b[^>]*${attribute.source}[^>]*>`).exec(html);
  if (!open) throw new Error(`no element matching ${attribute}`);
  const tag = open[1];
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  re.lastIndex = open.index + open[0].length;
  let depth = 1;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    if (!match[1] && /\/>$/.test(match[0])) continue;
    depth += match[1] ? -1 : 1;
    if (depth === 0) return html.slice(0, open.index) + html.slice(re.lastIndex);
  }
  throw new Error("unbalanced");
}
const byId = (id: string) => new RegExp(`\\bid="${id}"`);

const on = (match: (path: string) => boolean, edit: (html: string, path: string) => string): Serve => (path) => {
  const page = fromBuild(path) as Page;
  return match(path) && page.status === 200 ? { ...page, html: edit(page.html, path) } : page;
};
const is = (target: string) => (path: string) => path === target;
const remove = (path: string, id: string) => on(is(path), (html) => removeElement(html, byId(id)));
const notFound = (match: (path: string) => boolean): Serve => (path) => (match(path) ? { status: 404, html: "<html><body>404</body></html>" } : fromBuild(path));
const serveAs = (match: (path: string) => boolean, target: (path: string) => string): Serve => (path) =>
  match(path) ? fromBuild(target(path)) : fromBuild(path);

const BOILERPLATE = `<html><head><title>Create Next App</title></head><body><main><img src="/next.svg" alt="Next.js logo"/><h1>To get started, edit the page.tsx file.</h1><p>Looking for a starting point or more instructions? Head over to Templates or the Learning center.</p></main></body></html>`;
const SKELETON_IDS = ["wd-lab3", "wd-dashboard", "wd-dashboard-courses", "wd-courses", "wd-courses-navigation", "wd-modules", "wd-assignments", "wd-assignment-list", "wd-assignments-editor", "wd-people-table", "wd-labs", "wd-github", "wd-kambaz-link", "wd-path-parameters", "wd-styles", "wd-classes", "wd-house", "wd-todo-list", "wd-kambaz-navigation"];
const SKELETON = `<html><body>${SKELETON_IDS.map((id) => `<div id="${id}"></div>`).join("")}</body></html>`;

const RENAMES: [RegExp, string][] = [
  [/Rocket Propulsion/g, "Intro to Painting"],
  [/Aerodynamics/g, "Ceramics"],
  [/Spacecraft Design/g, "Sculpture"],
  [/Tony/g, "Mia"],
  [/Stark/g, "Wong"],
  [/>A1</g, ">Color wheel<"],
  [/value="A1"/g, 'value="Color wheel"'],
];
const relabel: Serve = on(() => true, (html) => {
  let out = html;
  for (const [from, to] of RENAMES) out = out.replace(from, to);
  return out.replace(/>Published Courses/g, ">Live classes").replace(/>Lab 3</g, ">Third lab<");
});

/** The pre-fix book logic: Dashboard is also highlighted inside a course. */
const doubleHighlight = on(
  (path) => path.startsWith("/courses/"),
  (html) => html.replace(/(id="wd-dashboard-link" class="[^"]*?)bg-black text-white/, "$1bg-white text-red-600"),
);

const LAB3_ROWS = CRITERIA.filter((row) => row.id.startsWith("a3-lab-")).map((row) => row.id);

/* -------------------------------- tests -------------------------------- */

describe("A3 checker (structure only, ids optional)", () => {
  it("scores the full build 100 / 100 with points and percentage", async () => {
    const { points, failed, review, recheck, results } = await grade(fromBuild);
    assert.deepEqual(failed, []);
    assert.deepEqual(review, []);
    assert.deepEqual(recheck, []);
    assert.equal(TOTAL, 100);
    assert.equal(formatPointsPercent(points, TOTAL), "100 / 100 (100.0%)");
    assert.equal(results.filter((row) => row.criterionId?.startsWith("a3-")).length, results.length);
  });

  it("gives the same score with every wd-* id stripped", async () => {
    const stripped = await grade(on(() => true, (html) => stripWdIds(html)));
    assert.deepEqual(stripped.failed, []);
    assert.equal(stripped.points, 100);
  });

  it("does not depend on the reference text or data", async () => {
    const renamed = await grade(relabel);
    assert.deepEqual(renamed.failed, []);
  });

  it("gives nothing for empty elements that only carry the ids", async () => {
    const skeleton = await grade(() => ({ status: 200, html: SKELETON }));
    // Only the submitted URLs themselves (a3 branch, -git-a3- host) can pass.
    assert.deepEqual(
      CRITERIA.map((row) => row.id).filter((id) => !skeleton.failed.includes(id)),
      ["a3-delivery-branch", "a3-delivery-vercel"],
    );
    assert.equal(skeleton.points, 6);
  });

  it("gives nothing for the create-next-app template", async () => {
    const template = await grade(() => ({ status: 200, html: BOILERPLATE }));
    assert.equal(template.points, 6);
    assert.deepEqual(template.review, []);
  });

  it("scores nothing on the site for an empty deploy (every page 404)", async () => {
    const empty = await grade(() => ({ status: 404, html: "<html><body>404: This page could not be found.</body></html>" }));
    assert.equal(empty.points, 3); // the a3 branch on GitHub still loads
    assert.ok(empty.results.some((row) => row.needsRecheck));
  });

  const REMOVALS: { name: string; serve: Serve; fails: string[] }[] = [
    {
      name: "Lab 3 link removed from Labs",
      serve: on((path) => path.startsWith("/labs"), (html) => html.replace(/<a\b[^>]*href="\/labs\/lab3"[^>]*>[\s\S]*?<\/a>/g, "")),
      // The TOC loses its Lab 3 link too, so the highlight can't move there.
      fails: ["a3-delivery-labs-nav", "a3-lab-toc-highlight"],
    },
    { name: "GitHub link removed", serve: remove("/labs", "wd-github"), fails: ["a3-delivery-name-github"] },
    { name: "House JSON removed", serve: remove("/labs/lab3", "wd-house"), fails: ["a3-lab-json"] },
    { name: "imports table removed", serve: remove("/labs/lab3", "wd-destructuring-imports"), fails: ["a3-lab-imports-table"] },
    { name: "Styles removed", serve: remove("/labs/lab3", "wd-styles"), fails: ["a3-lab-styles"] },
    { name: "Classes removed", serve: remove("/labs/lab3", "wd-classes"), fails: ["a3-lab-classes"] },
    { name: "Client Component removed", serve: remove("/labs/lab3", "wd-client-component-demo"), fails: ["a3-lab-client-server"] },
    { name: "Server Component removed", serve: remove("/labs/lab3", "wd-server-component-demo"), fails: ["a3-lab-client-server"] },
    {
      name: "Chapter 1 TOC (no highlight)",
      serve: on((path) => path.startsWith("/labs"), (html) => html.replace(/ style="background-color:#2563eb[^"]*"/g, "").replace(/ aria-current="page"/g, "")),
      fails: ["a3-lab-toc-highlight"],
    },
    { name: "Path Parameters links removed", serve: remove("/labs/lab3", "wd-path-parameters"), fails: ["a3-lab-path-params"] },
    { name: "add/[a]/[b] route 404", serve: notFound((path) => path.startsWith("/labs/lab3/add/")), fails: ["a3-lab-path-params"] },
    {
      name: "add route ignores its parameters",
      serve: serveAs((path) => path.startsWith("/labs/lab3/add/"), () => "/labs/lab3/add/1/2"),
      fails: ["a3-lab-path-params"],
    },
    { name: "Todo list removed", serve: on(is("/labs/lab3"), (html) => removeElement(html, /\bclass="list-none[^"]*"/)), fails: ["a3-lab-todos"] },
    { name: "Lab 3 page 404", serve: notFound(is("/labs/lab3")), fails: LAB3_ROWS },
    {
      name: "Dashboard without course cards",
      serve: remove("/dashboard", "wd-dashboard-courses"),
      // Course screens are still found from the crawl; only the card checks fail.
      fails: ["a3-kambaz-dashboard", "a3-kambaz-courses"],
    },
    {
      name: "courses ignore the URL (always RS101)",
      serve: serveAs((path) => /^\/courses\/(?!RS101\/)[^/]+\/home$/.test(path), () => "/courses/RS101/home"),
      fails: ["a3-kambaz-courses", "a3-kambaz-course-nav"],
    },
    { name: "Course Navigation removed", serve: on((path) => path.startsWith("/courses/"), (html) => removeElement(html, byId("wd-courses-navigation"))), fails: ["a3-kambaz-course-nav"] },
    {
      name: "breadcrumb without the section",
      serve: on((path) => path.startsWith("/courses/"), (html) => html.replace(/<!-- --> &gt; <!-- -->[^<]*<\/span>/, "</span>")),
      fails: ["a3-kambaz-breadcrumb"],
    },
    { name: "Modules hardcoded", serve: serveAs((path) => /^\/courses\/[^/]+\/modules$/.test(path), () => "/courses/RS101/modules"), fails: ["a3-kambaz-modules"] },
    {
      name: "Assignments hardcoded",
      serve: serveAs((path) => /^\/courses\/[^/]+\/assignments$/.test(path), () => "/courses/RS101/assignments"),
      fails: ["a3-kambaz-assignments"],
    },
    {
      name: "Editor hardcoded (always A101)",
      serve: serveAs((path) => /^\/courses\/[^/]+\/assignments\/[^/]+$/.test(path), () => "/courses/RS101/assignments/A101"),
      fails: ["a3-kambaz-editor"],
    },
    { name: "People hardcoded", serve: serveAs((path) => /^\/courses\/[^/]+\/people\/table$/.test(path), () => "/courses/RS101/people/table"), fails: ["a3-kambaz-people"] },
    { name: "Dashboard and Courses both highlighted in a course", serve: doubleHighlight, fails: ["a3-kambaz-nav"] },
  ];

  for (const variant of REMOVALS) {
    it(`catches: ${variant.name}`, async () => {
      const { failed, points } = await grade(variant.serve);
      assert.deepEqual(failed, variant.fails);
      const lost = CRITERIA.filter((row) => variant.fails.includes(row.id)).reduce((sum, row) => sum + row.points, 0);
      assert.equal(points, 100 - lost);
    });
  }

  it("keeps points and asks for a re-check when Lab 3 can't be opened (503)", async () => {
    const { failed, recheck, points } = await grade((path) => (path === "/labs/lab3" ? { status: 503, html: "Service Unavailable" } : fromBuild(path)));
    assert.deepEqual(failed, []);
    assert.deepEqual(recheck, LAB3_ROWS);
    assert.equal(points, 100);
  });

  it("keeps points when the add page times out", async () => {
    const { failed, recheck } = await grade((path) =>
      path === "/labs/lab3/add/12/30" ? { ok: false, code: "network", message: "timeout" } : fromBuild(path),
    );
    assert.deepEqual(failed, []);
    assert.deepEqual(recheck, ["a3-lab-path-params"]);
  });

  it("keeps points behind a login wall on the course screens", async () => {
    const { failed, recheck } = await grade((path) =>
      path.startsWith("/courses/RS102/") ? { status: 401, html: "<html><body>Log in to Vercel</body></html>" } : fromBuild(path),
    );
    assert.deepEqual(failed, []);
    assert.ok(recheck.includes("a3-kambaz-modules"));
    assert.ok(recheck.includes("a3-kambaz-people"));
  });

  it("fails the TOC highlight when /labs/lab1 is a 404", async () => {
    const { failed } = await grade(notFound(is("/labs/lab1")));
    assert.deepEqual(failed, ["a3-lab-toc-highlight"]);
  });

  it("finds courses with renamed ids and sends the unreached editor to TA review", async () => {
    const renameIds = (text: string) => text.replace(/RS101/g, "CS1").replace(/RS102/g, "CS2").replace(/RS103/g, "CS3");
    const serve: Serve = (path) => {
      const original = path.replace(/CS1/g, "RS101").replace(/CS2/g, "RS102").replace(/CS3/g, "RS103");
      if (/RS10[123]/.test(path)) return { status: 404, html: "<html><body>404</body></html>" };
      const page = fromBuild(original) as Page;
      return { ...page, html: renameIds(page.html) };
    };
    const { failed, review } = await grade(serve);
    assert.deepEqual(failed, []);
    assert.deepEqual(review, ["a3-kambaz-editor"]);
  });

  it("never names an id or wd- in any message", async () => {
    const variants: Serve[] = [fromBuild, () => ({ status: 200, html: SKELETON }), () => ({ status: 200, html: BOILERPLATE }), ...REMOVALS.map((variant) => variant.serve)];
    for (const serve of variants) {
      const { results } = await grade(serve);
      for (const row of results) {
        assert.doesNotMatch(row.message, /wd-|\sids?[\s.,]/i, `${row.id}: ${row.message}`);
      }
    }
    for (const row of CRITERIA) assert.doesNotMatch(row.description, /wd-/, row.id);
  });
});

describe("A3 wiring", () => {
  it("is registered like A1/A2 but does not open submissions", () => {
    assert.equal(getChecker("a3"), A3_CHECKER);
    assert.equal(criterionCoverage("a3", "a3-kambaz-editor"), "auto");
    assert.equal(supportsUrlSubmission("a3"), false);
  });

  it("verifies every rubric item at a seeded path, with no element ids", () => {
    for (const row of CRITERIA) {
      assert.ok(A3_VERIFY_PATHS[row.id], row.id);
      assert.ok((A3_SEED_PATHS as readonly string[]).includes(A3_VERIFY_PATHS[row.id]), row.id);
    }
    assert.deepEqual(A3_CHECKER.verifyHashes, {});
  });
});
