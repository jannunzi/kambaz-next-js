/**
 * A2 checker follows Jose's id rule: students still add wd-* ids, but a
 * missing id never costs points. Every row is judged from the compiled CSS
 * and page structure of a real book build (fixtures/a2-book-build).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { A2_RUBRIC } from "./a2";
import { judgeA2Labs } from "./a2-judge";
import {
  A2_LAB2_SAMPLES,
  A2_TAILWIND_SAMPLES,
  runSamples,
  stylePage,
  stylesheetHrefs,
} from "./a2-structure";
import { latestResultByCriterion, runConfiguredChecks } from "./checks";
import type { AssignmentCheckResult } from "./checks";
import { parseCss } from "./css-rules";
import { parseDom, parseSelector, selectorMatches, bodyElements } from "./dom-lite";
import {
  A2_FIXTURE_NAME,
  A2_FIXTURE_ORIGIN,
  A2_FIXTURE_TREE,
  bookSite,
  editPages,
  emptySite,
  fixtureProbes,
  idsOnlySkeleton,
  addStyle,
  override,
  removeElement,
  removeFrom,
  removeSectionByHeading,
  replaceElement,
  replaceText,
  stripIds,
  templateSite,
  type FixtureSite,
} from "./fixtures/a2-deploy";
import { proposedGradeFromResults } from "./grade";
import { resolveNameQuery } from "./names";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";

const LAB2 = "/labs/lab2";
const TAILWIND = "/labs/lab2/tailwind";
const RESPONSIVE_FIVE = ["breakpoint", "show-hide", "flex", "grid", "spacing-text"];

type Graded = {
  points: number;
  results: AssignmentCheckResult[];
  row: (criterionId: string) => AssignmentCheckResult;
  failed: string[];
  review: string[];
};

async function grade(site: FixtureSite): Promise<Graded> {
  const results = await runConfiguredChecks("a2", {
    githubUrl: A2_FIXTURE_TREE,
    vercelUrl: A2_FIXTURE_ORIGIN,
    nameQuery: resolveNameQuery({ rosterName: A2_FIXTURE_NAME }),
    probes: fixtureProbes(site),
  });
  const latest = latestResultByCriterion(results);
  return {
    points: proposedGradeFromResults(A2_RUBRIC, results).earnedPoints,
    results,
    row: (criterionId) => {
      const result = latest.get(criterionId);
      assert.ok(result, criterionId);
      return result;
    },
    failed: [...latest.values()].filter((r) => !r.passed && !r.skipped).map((r) => r.criterionId ?? r.id),
    review: [...latest.values()].filter((r) => r.needsReview).map((r) => r.criterionId ?? r.id),
  };
}

function assertNoIdsInFeedback(graded: Graded, label: string) {
  for (const result of graded.results) {
    assert.doesNotMatch(result.message, /\bwd-/i, `${label} / ${result.id}: ${result.message}`);
  }
}

/** Every wd- class and id renamed, in the pages and the compiled CSS. */
const ownClassNames: FixtureSite = (path) => {
  const res = bookSite(path);
  return "body" in res ? { ...res, body: res.body.replace(/wd-/g, "zz-") } : res;
};

/** Remove a book sample from the Lab 2 page (its CSS stays, like a component never imported). */
const without = (...targets: string[]) => removeFrom(bookSite, LAB2, targets);

describe("A2 checker: book build variants", () => {
  it("scores the full book build, ids stripped, and text changed 38/38", async () => {
    for (const [label, site] of [
      ["full", bookSite],
      ["ids stripped", editPages(bookSite, stripIds)],
      ["text changed", editPages(bookSite, (html) => replaceText(html))],
      ["ids stripped and text changed", editPages(bookSite, (html) => replaceText(stripIds(html)))],
      ["own class names (pages and CSS)", ownClassNames],
    ] as const) {
      const graded = await grade(site);
      assert.equal(graded.points, 38, `${label}: ${graded.failed.join(", ")}`);
      assert.deepEqual(graded.failed, [], label);
      assertNoIdsInFeedback(graded, label);
    }
  });

  it("sends only the ID-selector sample to TA review when ids are stripped", async () => {
    const graded = await grade(editPages(bookSite, stripIds));
    assert.deepEqual(graded.review, ["a2-lab-selectors"]);
    assert.match(graded.row("a2-lab-selectors").message, /Needs TA review: .*ID selectors \(§2\.1\.3\)/);
    assert.match(graded.row("a2-lab-selectors").message, /no points taken off/);
  });

  it("does not credit empty elements that only carry the book's ids", async () => {
    const graded = await grade(editPages(bookSite, idsOnlySkeleton, (path) => path.startsWith(LAB2)));
    // Delivery rows (12) only: every lab row fails.
    assert.equal(graded.points, 12);
    for (const id of ["a2-lab-page", "a2-lab-selectors", "a2-lab-box-model", "a2-lab-layout", "a2-lab-icons", "a2-lab-tailwind"]) {
      assert.equal(graded.row(id).passed, false, id);
    }
    assertNoIdsInFeedback(graded, "skeleton");
  });

  it("scores an empty site and the create-next-app starter 3 (branch only)", async () => {
    for (const [label, site] of [
      ["empty", emptySite],
      ["template", templateSite],
    ] as const) {
      const graded = await grade(site);
      assert.equal(graded.points, 3, label);
      assert.equal(graded.row("a2-delivery-branch").passed, true, label);
      assert.equal(graded.row("a2-delivery-vercel").passed, false, label);
      assertNoIdsInFeedback(graded, label);
    }
    const starter = await grade(templateSite);
    assert.match(
      starter.results.find((r) => r.id === "a2-delivery-vercel-content")?.message ?? "",
      /starter|Labs/i,
    );
  });

  it("charges a removed Lab 2 TOC link once (labs nav), not twice", async () => {
    const graded = await grade(
      editPages(
        bookSite,
        (html) => html.replace(/<a\b[^>]*href="\/labs\/lab2"[^>]*>[\s\S]*?<\/a>/g, ""),
        (path) => path.startsWith("/labs"),
      ),
    );
    assert.equal(graded.points, 35);
    assert.deepEqual(graded.failed, ["a2-delivery-labs-nav"]);
    assertNoIdsInFeedback(graded, "toc lab2");
  });

  it("catches each removed delivery requirement once", async () => {
    const cases: [string, FixtureSite, string][] = [
      ["Kambaz link", editPages(bookSite, (html) => removeElement(html, "wd-kambaz-link"), (p) => p.startsWith("/labs")), "a2-delivery-labs-nav"],
      ["GitHub link", removeFrom(bookSite, "/labs", ["wd-github"]), "a2-delivery-name-github"],
      ["name", editPages(bookSite, (html) => html.split(A2_FIXTURE_NAME).join("")), "a2-delivery-name-github"],
    ];
    for (const [label, site, row] of cases) {
      const graded = await grade(site);
      assert.equal(graded.points, 35, label);
      assert.deepEqual(graded.failed, [row], label);
      assertNoIdsInFeedback(graded, label);
    }
  });

  /*
   * Each §2.1 sample removed on its own. "fail" costs the row; "review"
   * keeps the points and asks a TA: the page still has that sample's CSS
   * built into other samples, or (ID selectors) the CSS has id rules that
   * nothing on the page carries, which can't be told apart from a student
   * who skipped the ids. No removal passes silently.
   */
  const REMOVALS: [string, string[], string, "fail" | "review", RegExp][] = [
    ["ID selectors", ["wd-css-id-selectors"], "a2-lab-selectors", "review", /ID selectors \(§2\.1\.3\)/],
    ["class selectors", ["wd-css-class-selectors"], "a2-lab-selectors", "review", /Class selectors/],
    ["document structure", ["wd-css-document-structure"], "a2-lab-selectors", "review", /Document structure/],
    ["foreground colors", ["wd-css-colors"], "a2-lab-box-model", "fail", /Foreground colors \(§2\.1\.7\)/],
    ["background colors", ["wd-css-background-colors"], "a2-lab-box-model", "fail", /Background colors \(§2\.1\.8\)/],
    ["borders", ["wd-css-borders"], "a2-lab-box-model", "review", /Borders/],
    ["padding", ["wd-css-paddings"], "a2-lab-box-model", "review", /Padding/],
    ["margins", ["wd-css-margins"], "a2-lab-box-model", "fail", /Margins/],
    ["box model", ["wd-css-box-model"], "a2-lab-box-model", "review", /Box model/],
    ["corners", ["wd-css-corners"], "a2-lab-box-model", "fail", /Rounded corners/],
    ["dimensions", ["wd-css-dimensions"], "a2-lab-box-model", "fail", /Dimensions/],
    ["display", ["wd-css-display"], "a2-lab-box-model", "fail", /Display/],
    ["relative", ["wd-css-position-relative"], "a2-lab-layout", "fail", /Relative position/],
    ["absolute", ["wd-css-position-absolute"], "a2-lab-layout", "fail", /Absolute position/],
    ["fixed", ["wd-css-position-fixed"], "a2-lab-layout", "fail", /Fixed position/],
    ["z-index", ["wd-z-index"], "a2-lab-layout", "fail", /Z-index/],
    ["float", ["wd-float-divs"], "a2-lab-layout", "fail", /Float/],
    ["grid layout", ["wd-css-grid-layout"], "a2-lab-layout", "fail", /Grid layout/],
    ["flex", ["wd-css-flex"], "a2-lab-layout", "fail", /Flex/],
    ["media queries", [".wd-media-queries-demo"], "a2-lab-layout", "fail", /Media queries/],
    ["React icons", ["wd-react-icons-sampler"], "a2-lab-icons", "fail", /ReactIconsSampler/],
  ];

  for (const [label, targets, row, expected, message] of REMOVALS) {
    it(`removed ${label}: ${expected}`, async () => {
      const graded = await grade(without(...targets));
      const result = graded.row(row);
      const others = graded.failed.filter((id) => id !== row);
      assert.deepEqual(others, [], `${label} touched other rows`);
      if (expected === "fail") {
        assert.equal(result.passed, false, result.message);
        assert.equal(graded.points, 38 - (row === "a2-lab-icons" ? 3 : 5));
      } else {
        assert.equal(result.passed, true, result.message);
        assert.equal(result.needsReview, true, result.message);
        assert.equal(graded.points, 38);
      }
      assert.match(result.message, message);
      assertNoIdsInFeedback(graded, label);
    });
  }

  /*
   * Each §2.3 Tailwind section removed on its own (by its heading or its
   * component; ids and text are never read). Sections that were in the book
   * from the start fail the Tailwind row. The five responsive samples and
   * the responsive card go to TA review while the page still uses
   * responsive utilities elsewhere: the five joined the book on Sep 28, so
   * a page built before that (only the card) can't be told apart from a
   * skipped sample.
   */
  const TW_REMOVALS: [string, (html: string) => string, "fail" | "review", RegExp][] = [
    ["Margin and Padding (spacing component)", (html) => removeSectionByHeading(html, "Margin"), "fail", /Tailwind margins and Tailwind padding samples/],
    [
      "Margin demo only",
      (html) => html.replace(/<h2 class="text-3xl">Margin<\/h2>(<div class="[^"]*">[^<]*<\/div>){2}/, ""),
      "fail",
      /Tailwind margins sample/,
    ],
    [
      "Padding demo only",
      (html) => html.replace(/<h2 class="text-3xl mt-8">Padding<\/h2>(<div class="[^"]*">[^<]*<\/div>){2}/, ""),
      "fail",
      /Tailwind padding sample/,
    ],
    ["Font Size and Weight", (html) => removeSectionByHeading(html, "Font Size"), "fail", /Tailwind font size and weight/],
    ["Background Colors", (html) => removeSectionByHeading(html, "Background Colors"), "fail", /Tailwind background colors/],
    ["Blurs", (html) => removeSectionByHeading(html, "Blurs"), "fail", /Tailwind filters/],
    ["Tailwind Grids", (html) => removeSectionByHeading(html, "Tailwind Grids"), "fail", /Tailwind grid system/],
    ["responsive breakpoint", (html) => removeElement(html, "wd-tailwind-responsive-breakpoint"), "review", /Tailwind responsive breakpoint/],
    ["responsive show/hide", (html) => removeElement(html, "wd-tailwind-responsive-show-hide"), "review", /Tailwind responsive show and hide/],
    ["responsive flex", (html) => removeElement(html, "wd-tailwind-responsive-flex"), "review", /Tailwind responsive flex/],
    ["responsive grid", (html) => removeElement(html, "wd-tailwind-responsive-grid"), "review", /Tailwind responsive grid/],
    ["responsive spacing and text", (html) => removeElement(html, "wd-tailwind-responsive-spacing-text"), "review", /Tailwind responsive spacing and text size/],
    [
      "all 5 responsive sections (the card stays)",
      (html) => RESPONSIVE_FIVE.reduce((out, name) => removeElement(out, `wd-tailwind-responsive-${name}`), html),
      "review",
      /responsive breakpoint.*responsive show and hide.*responsive flex.*responsive grid.*responsive spacing and text size/,
    ],
    ["Responsive Design card", (html) => removeSectionByHeading(html, "Responsive Design"), "review", /Tailwind responsive design/],
    [
      "every responsive section and the card",
      (html) =>
        removeSectionByHeading(
          RESPONSIVE_FIVE.reduce((out, name) => removeElement(out, `wd-tailwind-responsive-${name}`), html),
          "Responsive Design",
        ),
      "fail",
      /responsive breakpoint.*responsive design/,
    ],
  ];

  for (const [label, edit, expected, message] of TW_REMOVALS) {
    it(`removed Tailwind ${label}: ${expected}`, async () => {
      for (const [variant, prep] of [
        ["ids kept", (html: string) => html],
        ["ids stripped", stripIds],
      ] as const) {
        const graded = await grade(editPages(bookSite, (html) => prep(edit(html)), TAILWIND));
        const row = graded.row("a2-lab-tailwind");
        if (expected === "fail") {
          assert.equal(graded.points, 33, `${label} (${variant}): ${graded.failed.join(", ")}`);
          assert.deepEqual(graded.failed, ["a2-lab-tailwind"], `${label} (${variant})`);
          assert.match(row.message, /^Missing on/, `${label} (${variant})`);
        } else {
          assert.equal(graded.points, 38, `${label} (${variant}): ${graded.failed.join(", ")}`);
          assert.deepEqual(graded.failed, [], `${label} (${variant})`);
          assert.equal(row.needsReview, true, `${label} (${variant}): ${row.message}`);
          assert.match(row.message, /Needs TA review/, `${label} (${variant})`);
        }
        assert.match(row.message, message, `${label} (${variant})`);
        assertNoIdsInFeedback(graded, label);
      }
    });
  }

  it("fails Tailwind when its page is gone, and reviews a grid without spans", async () => {
    const gone = await grade(override(bookSite, TAILWIND, { status: 404, body: "nf" }));
    assert.equal(gone.points, 33);
    assert.deepEqual(gone.failed, ["a2-lab-tailwind"]);
    assert.match(gone.row("a2-lab-tailwind").message, /404/);

    const noSpans = await grade(removeFrom(bookSite, TAILWIND, ["wd-tailwind-grid-system"]));
    assert.equal(noSpans.points, 38);
    assert.equal(noSpans.row("a2-lab-tailwind").needsReview, true);
    assert.match(noSpans.row("a2-lab-tailwind").message, /Tailwind grid system/);
  });
});

describe("A2 checker: samples built another way go to TA review", () => {
  const onLab2 = (edit: (html: string) => string) => editPages(bookSite, edit, LAB2);

  async function assertReview(site: FixtureSite, row: string, sample: RegExp) {
    const graded = await grade(site);
    assert.equal(graded.points, 38, graded.failed.join(", "));
    assert.deepEqual(graded.failed, []);
    const result = graded.row(row);
    assert.equal(result.passed, true, result.message);
    assert.equal(result.needsReview, true, result.message);
    assert.match(result.message, /Needs TA review/);
    assert.match(result.message, sample);
    assert.match(result.message, /built differently from the book/);
    assertNoIdsInFeedback(graded, row);
  }

  it("keeps the points for a Float sample built with CSS grid", async () => {
    await assertReview(
      onLab2((html) =>
        addStyle(
          replaceElement(
            html,
            "wd-float-divs",
            `<div><h2>Float</h2><div class="pic-row"><img class="pic" src="/x.jpg" alt="Starship"/><p>Text that sits next to the picture, laid out with a grid.</p></div></div>`,
          ),
          ".pic-row{display:grid;grid-template-columns:200px 1fr;gap:8px}.pic{width:200px}",
        ),
      ),
      "a2-lab-layout",
      /Float \(§2\.1\.17\)/,
    );
  });

  it("keeps the points for a Float sample built with flex", async () => {
    await assertReview(
      onLab2((html) =>
        addStyle(
          replaceElement(
            html,
            "wd-float-divs",
            `<div><h2>Float</h2><div class="pic-row"><div><img src="/x.jpg" alt="Starship"/></div><p>Text beside the picture.</p></div></div>`,
          ),
          ".pic-row{display:flex;gap:8px}",
        ),
      ),
      "a2-lab-layout",
      /Float \(§2\.1\.17\)/,
    );
  });

  for (const [label, css] of [
    ["flex-basis", ".cols{display:flex}.c1{flex-basis:30%;background:#eee}.c2{flex-basis:70%;background:#ddd}"],
    ["the flex shorthand", ".cols{display:flex}.c1{flex:0 0 30%;background:#eee}.c2{flex:0 0 70%;background:#ddd}"],
  ] as const) {
    it(`keeps the points for Grid layout columns sized with ${label} percentages`, async () => {
      await assertReview(
        onLab2((html) =>
          addStyle(
            replaceElement(
              html,
              "wd-css-grid-layout",
              `<div><h2>Grid layout</h2><div class="cols"><div class="c1">Left</div><div class="c2">Main</div></div></div>`,
            ),
            css,
          ),
        ),
        "a2-lab-layout",
        /Grid layout \(§2\.1\.18\)/,
      );
    });
  }

  it("passes a Grid layout sample built with CSS grid columns", async () => {
    const graded = await grade(
      onLab2((html) =>
        addStyle(
          replaceElement(
            html,
            "wd-css-grid-layout",
            `<div><h2>Grid layout</h2><div class="g"><div class="c">Left</div><div class="c">Main</div><div class="c">Right</div></div></div>`,
          ),
          ".g{display:grid;grid-template-columns:25% 50% 25%}.c{background:#eee}",
        ),
      ),
    );
    assert.equal(graded.points, 38);
    assert.ok(!graded.row("a2-lab-layout").needsReview, graded.row("a2-lab-layout").message);
  });
});

describe("A2 checker: unreachable pages", () => {
  it("fails the Lab 2 rows when /labs/lab2 returns 404", async () => {
    const graded = await grade(override(bookSite, LAB2, { status: 404, body: "nf" }));
    assert.equal(graded.points, 17);
    for (const id of ["a2-lab-page", "a2-lab-selectors", "a2-lab-box-model", "a2-lab-layout", "a2-lab-icons"]) {
      assert.equal(graded.row(id).passed, false, id);
      assert.match(graded.row(id).message, /404/, id);
    }
  });

  it("keeps points and asks for a re-check on a timeout, 5xx, or login wall", async () => {
    for (const [label, res] of [
      ["timeout", { network: true }],
      ["503", { status: 503, body: "busy" }],
      ["login wall", { status: 401, body: "Log in to Vercel" }],
    ] as const) {
      const graded = await grade(override(bookSite, LAB2, res));
      assert.equal(graded.points, 38, label);
      for (const id of ["a2-lab-page", "a2-lab-selectors", "a2-lab-box-model", "a2-lab-layout", "a2-lab-icons"]) {
        const row = graded.row(id);
        assert.equal(row.passed, true, `${label} ${id}`);
        assert.equal(row.needsReview, true, `${label} ${id}`);
        assert.match(row.message, /Needs re-check/, `${label} ${id}`);
      }
    }
  });

  it("keeps points when a stylesheet can't be downloaded", async () => {
    const graded = await grade((path) => (path.endsWith(".css") ? { status: 503, body: "" } : bookSite(path)));
    assert.equal(graded.points, 38);
    assert.match(graded.row("a2-lab-box-model").message, /Needs re-check: the stylesheet/);
  });

  it("tells A1 and A2+ students which Vercel URL to submit after a 404", () => {
    const copy = ASSIGNMENT_STUDENT_COPY.vercelNotFound;
    assert.match(copy, /A1 the production/);
    assert.match(copy, /A2 and later the Vercel preview URL of your assignment branch/);
    assert.match(copy, /cannot be loaded/);
    assert.match(copy, /private window/);
  });
});

describe("A2 structure: students' own variants", () => {
  const sheet = (css: string) => `<html><head><style>${css}</style></head><body>`;
  const judge = (html: string) => {
    const page = stylePage(html, []);
    return runSamples(A2_LAB2_SAMPLES, page);
  };

  it("counts inline styles as the student's CSS", () => {
    const html = `${sheet("")}
      <p style="border:2px solid red">solid</p><p style="border:2px dashed blue">dashed</p>
      <div style="position:relative;top:10px">moved</div></body></html>`;
    const result = judge(html);
    assert.ok(result.found.includes("Borders (§2.1.9)"));
    assert.ok(result.found.includes("Relative position (§2.1.13)"));
  });

  it("asks a TA instead of failing a sample built differently from the book", () => {
    const html = `${sheet(".box{position:absolute;top:0;right:0;background:#bbf7d0}.wrap{position:relative;height:120px}")}
      <div class="wrap"><div class="box">absolute</div></div></body></html>`;
    const result = judge(html);
    assert.ok(result.weak.includes("Absolute position (§2.1.14)"), JSON.stringify(result));
    assert.ok(!result.missing.includes("Absolute position (§2.1.14)"));
  });

  it("never counts bare tag rules or Tailwind layers as §2.1 samples", () => {
    const html = `${sheet("p{border:1px solid red}@layer utilities{.b{border:1px dashed red}}")}
      <p>one</p><p class="b">two</p></body></html>`;
    assert.ok(judge(html).missing.includes("Borders (§2.1.9)"));
  });

  it("needs a utility class with its own rule for Tailwind samples", () => {
    const css = "@layer utilities{.ms-4{margin-inline-start:1rem}.me-4{margin-inline-end:1rem}}*{margin:0}";
    const styled = stylePage(`${sheet(css)}<p class="ms-4 me-4">a</p></body></html>`, []);
    const typo = stylePage(`${sheet(css)}<p class="ms-40 me-40">a</p></body></html>`, []);
    const margins = A2_TAILWIND_SAMPLES.filter((sample) => sample.name === "Tailwind margins");
    assert.equal(margins.length, 1);
    assert.deepEqual(runSamples(margins, styled, A2_TAILWIND_SAMPLES).found, ["Tailwind margins"]);
    assert.deepEqual(runSamples(margins, typo, A2_TAILWIND_SAMPLES).missing, ["Tailwind margins"]);
  });

  it("reads the compiled stylesheet links of a Next page", () => {
    const page = bookSite(LAB2);
    assert.ok("body" in page);
    const hrefs = stylesheetHrefs(page.body);
    assert.ok(hrefs.length >= 2);
    assert.ok(hrefs.every((href) => href.startsWith("/_next/static/") && href.endsWith(".css")));
  });

  it("judges the Lab 2 rows directly from page structure", async () => {
    const page = bookSite(LAB2);
    const tw = bookSite(TAILWIND);
    assert.ok("body" in page && "body" in tw);
    const verdicts = await judgeA2Labs({
      structure: { pages: [{ path: LAB2, html: page.body }, { path: TAILWIND, html: tw.body }] } as never,
      attempted: [],
      fetchText: async (href) => {
        const res = bookSite(href);
        return "body" in res && res.status < 400 ? { ok: true, text: res.body } : { ok: false, missing: true };
      },
    });
    for (const [id, verdict] of Object.entries(verdicts)) assert.equal(verdict.kind, "pass", `${id}: ${JSON.stringify(verdict)}`);
  });
});

describe("CSS and selector parsing", () => {
  it("flattens nesting, @media and @layer, and skips @font-face", () => {
    const rules = parseCss(
      "@font-face{font-family:x}.a{color:red;&:hover{color:blue}}@media (min-width:1px){.b{margin:0}}@layer base{p{padding:1px}}",
    );
    const bySelector = new Map(rules.map((rule) => [rule.selector, rule]));
    assert.equal(bySelector.get(".a")?.decls.get("color"), "red");
    assert.ok([...bySelector.keys()].some((s) => s.includes(":hover")));
    assert.deepEqual(bySelector.get(".b")?.atRules.map((a) => a.split(" ")[0]), ["@media"]);
    assert.deepEqual(bySelector.get("p")?.atRules.map((a) => a.split(" ")[0]), ["@layer"]);
    assert.equal(rules.some((rule) => rule.selector.includes("font")), false);
  });

  it("matches descendant, child and sibling combinators", () => {
    const root = parseDom(`<html><body><div class="p"><span id="s">x</span></div><p class="n">y</p></body></html>`);
    const els = bodyElements(root);
    const span = els.find((n) => n.id === "s")!;
    const next = els.find((n) => n.classes.includes("n"))!;
    assert.ok(selectorMatches(span, parseSelector(".p span")!));
    assert.ok(selectorMatches(span, parseSelector("div > #s")!));
    assert.ok(selectorMatches(next, parseSelector(".p + .n")!));
    assert.ok(selectorMatches(next, parseSelector("div ~ p")!));
    assert.equal(selectorMatches(span, parseSelector("p span")!), false);
  });
});
