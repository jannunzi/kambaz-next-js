import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { latestResultByCriterion, runA1Checks } from "./checks";
import { A1_FOLLOWUP_URL_CAP, crawlA1Deploy } from "./crawl";
import { pathnameOf } from "./html";
import { a1SeedUrls } from "./urls";

const ORIGIN = "https://student-a1.vercel.app";

const MANY_COURSE_IDS = [
  "RS101",
  "RS102",
  "RS103",
  "RS104",
  "RS105",
  "RS106",
  "RS107",
  "RS108",
  "RS109",
  "RS110",
  "1234",
];

function dashboardHtml(): string {
  const cards = MANY_COURSE_IDS.map(
    (id) => `<a href="/courses/${id}/home">${id}</a>`,
  ).join("\n");
  return `<div id="wd-dashboard"><nav id="wd-kambaz-navigation"></nav>${cards}</div>`;
}

function labsIndexHtml(): string {
  return `
    <div id="wd-labs">
      <a id="wd-lab1-link" href="/labs/lab1">Lab 1</a>
      <a href="/labs/lab2">Lab 2</a>
      <a href="/labs/lab3">Lab 3</a>
      <a href="/labs/lab4">Lab 4</a>
      <a href="/labs/lab5">Lab 5</a>
    </div>
  `;
}

/**
 * Marker ids live only on the seed course's canonical screens. Other course
 * homes and lab pages stay empty so a crawl that never reaches 1234 fails.
 */
function htmlForBusyDeploy(url: string): string {
  const path = pathnameOf(url);
  if (path === "/dashboard") return dashboardHtml();
  if (path === "/labs") return labsIndexHtml();
  if (path === "/account/signin") return '<div id="wd-signin-screen"></div>';
  if (path === "/account/signup") return '<div id="wd-signup-screen"></div>';
  if (path === "/account/profile") return '<div id="wd-profile-screen"></div>';
  if (path === "/courses/1234/home") {
    return '<div id="wd-home"></div><div id="wd-courses-navigation"></div>';
  }
  if (path === "/courses/1234/modules") return '<ul id="wd-modules"></ul>';
  if (path === "/courses/1234/assignments") {
    return '<div id="wd-assignments"><ul id="wd-assignment-list"><li><a href="/courses/1234/assignments/123">A1</a></li></ul></div>';
  }
  if (path === "/courses/1234/assignments/123") {
    return '<div id="wd-assignments-editor"><input id="wd-name" /></div>';
  }
  return "<main>empty</main>";
}

describe("crawlA1Deploy follow-up priority", () => {
  it("checks seed-course assignments pages when labs and course cards exceed the cap", async () => {
    const calls: string[] = [];
    const crawled = await crawlA1Deploy({
      deployUrl: ORIGIN,
      async getHtml(url) {
        calls.push(url);
        return { ok: true, status: 200, finalUrl: url, html: htmlForBusyDeploy(url) };
      },
    });

    assert.equal(crawled.ok, true);
    const seeds = new Set(a1SeedUrls(ORIGIN));
    const followups = calls.filter((url) => !seeds.has(url));
    assert.ok(followups.length <= A1_FOLLOWUP_URL_CAP);

    const required = [
      `${ORIGIN}/courses/1234/home`,
      `${ORIGIN}/courses/1234/modules`,
      `${ORIGIN}/courses/1234/assignments`,
      `${ORIGIN}/courses/1234/assignments/123`,
    ];
    for (const url of required) {
      assert.ok(followups.includes(url), url);
    }
    assert.deepEqual(followups.slice(0, required.length), required);

    assert.ok(followups.includes(`${ORIGIN}/Courses/1234/Assignments`));
    assert.ok(followups.includes(`${ORIGIN}/Courses/1234/Assignments/123`));
    assert.equal(followups.includes(`${ORIGIN}/courses/RS110/home`), false);
    assert.equal(followups.includes(`${ORIGIN}/labs/lab5`), false);
    assert.equal(
      followups.some((url) => url.toLowerCase().includes("/people")),
      false,
    );

    const results = await runA1Checks({
      vercelUrl: ORIGIN,
      probes: {
        async getHtml(url) {
          return { ok: true, status: 200, finalUrl: url, html: htmlForBusyDeploy(url) };
        },
      },
    });
    const byCriterion = latestResultByCriterion(results);
    assert.equal(byCriterion.get("a1-kambaz-assignments")?.passed, true);
    assert.equal(byCriterion.get("a1-kambaz-editor")?.passed, true);
    assert.equal(byCriterion.get("a1-kambaz-home")?.passed, true);
    assert.equal(byCriterion.get("a1-kambaz-modules")?.passed, true);
    assert.equal(byCriterion.get("a1-kambaz-course-nav")?.passed, true);
    assert.equal(byCriterion.get("a1-kambaz-dashboard")?.passed, true);
  });

  it("still fetches checklist course screens when the dashboard has no course cards", async () => {
    const calls: string[] = [];
    await crawlA1Deploy({
      deployUrl: ORIGIN,
      async getHtml(url) {
        calls.push(url);
        const path = pathnameOf(url);
        const html =
          path === "/labs"
            ? `<div id="wd-labs"><a href="/labs/lab2">Lab 2</a><a href="/labs/lab3">Lab 3</a><a href="/labs/lab4">Lab 4</a><a href="/labs/lab5">Lab 5</a></div>`
            : "<main>empty</main>";
        return { ok: true, status: 200, finalUrl: url, html };
      },
    });

    assert.ok(calls.includes(`${ORIGIN}/courses/1234/assignments`));
    assert.ok(calls.includes(`${ORIGIN}/courses/1234/assignments/123`));
    assert.ok(calls.includes(`${ORIGIN}/courses/1234/home`));
    assert.ok(calls.includes(`${ORIGIN}/courses/1234/modules`));
    const seeds = new Set(a1SeedUrls(ORIGIN));
    const followups = calls.filter((url) => !seeds.has(url));
    assert.ok(followups.length <= A1_FOLLOWUP_URL_CAP);
  });
});
