import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assignmentSubmitAccess, canPersistAssignmentSubmission, supportsUrlSubmission } from "./access";
import {
  classifyDeployFetch,
  deployOpenFailureMessage,
  htmlHasA1LabMarkers,
  htmlHasLabsNavigation,
  htmlHasWdHooks,
  latestResultByCriterion,
  runA1Checks,
} from "./checks";
import { htmlHasStudentName, resolveNameQuery } from "./names";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import {
  loadAssignmentSubmission,
  upsertAssignmentSubmission,
  type AssignmentSubmissionDoc,
  type SubmissionStore,
} from "./submissions-store";

function memorySubmissionStore(): SubmissionStore {
  const docs: AssignmentSubmissionDoc[] = [];
  return {
    async find(clerkUserId, assignmentId) {
      return (
        docs.find(
          (doc) =>
            doc.clerkUserId === clerkUserId && doc.assignmentId === assignmentId,
        ) ?? null
      );
    },
    async upsert(doc) {
      const index = docs.findIndex(
        (row) =>
          row.clerkUserId === doc.clerkUserId &&
          row.assignmentId === doc.assignmentId,
      );
      if (index === -1) docs.push(doc);
      else docs[index] = doc;
    },
  };
}

const LABS_HTML = `
  <div id="wd-labs">
    <h2>Jane Doe</h2>
    <a id="wd-lab1-link" href="/labs/lab1">Lab 1</a>
    <a id="wd-lab4-link" href="/labs/lab4">Lab 4</a>
    <a href="/labs/lab5">Lab 5</a>
    <a id="wd-toc-book-link" href="/book/ch1">Chapter 1</a>
    <a id="wd-github" href="https://github.com/jane-doe/webdev-client">GitHub</a>
  </div>
`;

describe("html lab markers", () => {
  it("finds Labs navigation and wd- hooks", () => {
    assert.equal(htmlHasLabsNavigation(LABS_HTML), true);
    assert.equal(htmlHasWdHooks(LABS_HTML), true);
    assert.equal(htmlHasA1LabMarkers(LABS_HTML), true);
    assert.equal(htmlHasA1LabMarkers("<main>Hello</main>"), false);
    assert.equal(htmlHasWdHooks('<input id="wd-your-heading" />'), true);
  });
});

describe("name markers", () => {
  it("parses Clerk/profile and Canvas last, first names", () => {
    const fromClerk = resolveNameQuery({
      firstName: "Jane",
      lastName: "Doe",
      fullName: "Jane Doe",
    });
    assert.equal(fromClerk.first, "Jane");
    assert.equal(fromClerk.last, "Doe");
    assert.equal(htmlHasStudentName(LABS_HTML, fromClerk), true);

    const fromRoster = resolveNameQuery({ rosterName: "Doe, Jane" });
    assert.ok(fromRoster.phrases.includes("Jane Doe"));
    assert.equal(htmlHasStudentName(LABS_HTML, fromRoster), true);
    assert.equal(
      htmlHasStudentName("<h2>Alex Rivera</h2>", fromClerk),
      false,
    );
  });

  it("skips dummy impersonation tokens", () => {
    const query = resolveNameQuery({
      firstName: "Demo",
      lastName: "Student",
      rosterName: "Demo Student",
    });
    assert.equal(query.markers.length, 0);
  });
});

const KENNETH_ORIGIN =
  "https://kambaz-next-js-sp26-git-a1-kenneth-aldridges-projects.vercel.app";
const SIGNIN_HTML = `
  <div id="wd-signin-screen">
    <button id="wd-signin-btn">Sign in</button>
  </div>
`;
const KENNETH_LABS_HTML = `
  <div id="wd-labs">
    <h2>Kenneth Aldridge</h2>
    <a id="wd-lab1-link" href="/labs/lab1">Lab 1</a>
    <a id="wd-github" href="https://github.com/kenneth/webdev">GitHub</a>
  </div>
`;

function htmlForPath(url: string): string {
  if (url.includes("/labs/lab1")) {
    return `
      <div id="wd-lab1">
        <div id="wd-h-tag"><h1></h1><h2></h2><h3></h3><h4></h4><h5></h5><h6></h6></div>
        <div id="wd-your-heading"><span id="wd-your-span">hi</span></div>
        <div id="wd-p-tag"><p id="wd-p-1"></p></div>
        <p id="wd-p-your-1"></p><p id="wd-p-your-2"></p>
        <div id="wd-lists"><ol id="wd-pancakes"></ol></div>
        <ol id="wd-your-favorite-recipe"></ol><ul id="wd-your-books"></ul>
        <div id="wd-tables"></div><table id="wd-your-table"></table>
        <div id="wd-images"><img id="wd-starship" /></div>
        <img id="wd-your-image" />
        <div id="wd-forms"><input id="wd-text-fields-username" /></div>
        <form id="wd-your-form"></form>
        <div id="wd-highlighted-paragraph"></div>
        <div id="wd-highlighted-box"></div>
        <a id="wd-lipsum" href="https://www.lipsum.com">lipsum</a>
        <a id="wd-your-link" href="#"></a><a id="wd-your-github" href="#"></a>
        <a id="wd-home-link" href="/labs"></a>
        <a id="wd-lab4-link" href="/labs/lab4"></a>
        <div id="wd-ai-headings"></div>
        <p id="wd-ai-p"></p>
        <ul id="wd-ai-html-tags"></ul>
        <table><tr><td>Q4</td></tr><tr><td>Q10</td></tr></table>
        <img id="wd-ai-image" />
        <a id="wd-ai-link" href="https://developer.mozilla.org">MDN</a>
      </div>
    `;
  }
  if (url.endsWith("/labs") || url.includes("/labs?")) return LABS_HTML;
  if (url.includes("/account/signin")) return SIGNIN_HTML;
  if (url.includes("/dashboard")) {
    return '<div id="wd-dashboard"></div><nav id="wd-kambaz-navigation"></nav>';
  }
  if (url.includes("/account/signup")) return '<div id="wd-signup-screen"></div>';
  if (url.includes("/account/profile")) {
    return '<div id="wd-profile-screen"></div><div id="wd-account-navigation"></div>';
  }
  if (/\/courses\/[^/]+\/home/i.test(url)) {
    return '<div id="wd-home"></div><div id="wd-courses-navigation"></div>';
  }
  if (/\/courses\/[^/]+\/modules/i.test(url)) {
    return '<ul id="wd-modules"></ul>';
  }
  if (/\/courses\/[^/]+\/assignments\/[^/]+/i.test(url)) {
    return '<div id="wd-assignments-editor"><input id="wd-name" /></div>';
  }
  if (/\/courses\/[^/]+\/assignments/i.test(url)) {
    return '<div id="wd-assignments"></div>';
  }
  return "<html><body>Home</body></html>";
}

describe("runA1Checks", () => {
  it("validates URLs and reads Labs HTML from /labs when needed", async () => {
    const calls: string[] = [];
    const results = await runA1Checks({
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: "https://jane-a1.vercel.app",
      nameQuery: resolveNameQuery({ firstName: "Jane", lastName: "Doe" }),
      probes: {
        async getHtml(url) {
          calls.push(url);
          return { ok: true, status: 200, finalUrl: url, html: htmlForPath(url) };
        },
        async probeUrl() {
          return { ok: true, status: 200 };
        },
      },
    });
    const byId = Object.fromEntries(results.map((row) => [row.id, row]));
    assert.equal(byId["github-url"]?.passed, true);
    assert.equal(byId["github-public"]?.passed, true);
    assert.equal(byId["a1-delivery-vercel"]?.passed, true);
    assert.equal(byId["a1-delivery-vercel-open"]?.passed, true);
    assert.equal(byId["a1-delivery-labs-nav"]?.passed, true);
    assert.equal(byId["a1-delivery-name-section"]?.passed, true);
    assert.ok(calls.includes("https://jane-a1.vercel.app/labs"));
    assert.ok(calls.includes("https://jane-a1.vercel.app/labs/lab1"));
    const byCriterion = latestResultByCriterion(results);
    assert.equal(byCriterion.get("a1-lab-heading-tags")?.passed, true);
    assert.equal(byCriterion.get("a1-lab-heading-tags-ai")?.passed, true);
    assert.equal(byCriterion.get("a1-lab-tables-ai")?.passed, true);
    assert.equal(byCriterion.get("a1-lab-toc-ai")?.passed, true);
    assert.equal(byCriterion.get("a1-kambaz-account")?.passed, true);
    assert.equal(byCriterion.get("a1-lab-highlighted-paragraph-oyo")?.skipped, true);
    assert.equal(
      byCriterion.get("a1-lab-highlighted-paragraph-oyo")?.message,
      ASSIGNMENT_STUDENT_COPY.manualCheckHint,
    );
    assert.equal(byCriterion.get("a1-lab-forms-ai")?.skipped, true);
  });

  it("runs HTML checks from a Vercel URL alone and skips GitHub format", async () => {
    const results = await runA1Checks({
      vercelUrl: "https://jane-a1.vercel.app",
      nameQuery: resolveNameQuery({ firstName: "Jane", lastName: "Doe" }),
      probes: {
        async getHtml(url) {
          return { ok: true, status: 200, finalUrl: url, html: htmlForPath(url) };
        },
      },
    });
    assert.equal(
      results.some((row) => row.id === "github-url"),
      false,
    );
    assert.equal(
      results.find((row) => row.id === "a1-delivery-vercel")?.passed,
      true,
    );
    assert.equal(
      results.find((row) => row.id === "a1-delivery-name-section")?.passed,
      true,
    );
  });

  it("finds the student name on /labs after a sign-in URL (Jose trial)", async () => {
    const calls: string[] = [];
    const results = await runA1Checks({
      vercelUrl: `${KENNETH_ORIGIN}/account/signin`,
      nameQuery: resolveNameQuery({
        firstName: "Kenneth",
        lastName: "Aldridge",
      }),
      probes: {
        async getHtml(url) {
          calls.push(url);
          const html = url.includes("/labs") && !url.includes("/labs/lab1")
            ? KENNETH_LABS_HTML
            : htmlForPath(url);
          return { ok: true, status: 200, finalUrl: url, html };
        },
      },
    });
    assert.ok(calls.includes(`${KENNETH_ORIGIN}/labs`));
    assert.ok(calls.includes(`${KENNETH_ORIGIN}/`));
    assert.ok(calls.includes(`${KENNETH_ORIGIN}/labs/lab1`));
    const name = results.find((row) => row.id === "a1-delivery-name-section");
    assert.equal(name?.passed, true);
    assert.equal(
      results.find((row) => row.id === "a1-delivery-labs-nav")?.passed,
      true,
    );
  });

  it("keeps Name on Labs as a skipped row when the student is signed out", async () => {
    const results = await runA1Checks({
      vercelUrl: "https://jane-a1.vercel.app",
      probes: {
        async getHtml(url) {
          return { ok: true, status: 200, finalUrl: url, html: htmlForPath(url) };
        },
      },
    });
    const name = results.find((row) => row.id === "a1-delivery-name-section");
    assert.ok(name);
    assert.equal(name.label, "Name on Labs");
    assert.equal(name.skipped, true);
    assert.equal(name.passed, false);
    assert.equal(
      name.message,
      "Sign in with your roster (Northeastern) account to check your name on Labs",
    );
    assert.equal(name.message, ASSIGNMENT_STUDENT_COPY.nameCheckNeedsRoster);
  });

  it("does not treat a sign-in page as Labs when /labs is available", async () => {
    const results = await runA1Checks({
      vercelUrl: `${KENNETH_ORIGIN}/account/signin`,
      nameQuery: resolveNameQuery({
        firstName: "Kenneth",
        lastName: "Aldridge",
      }),
      probes: {
        async getHtml(url) {
          if (url.includes("/account/signin")) {
            return {
              ok: true,
              status: 200,
              finalUrl: url,
              html: `${SIGNIN_HTML}<h2>Kenneth Aldridge</h2>`,
            };
          }
          if (url.includes("/labs") && !url.includes("/labs/lab1")) {
            return {
              ok: true,
              status: 200,
              finalUrl: url,
              html: '<div id="wd-labs"><a id="wd-lab1-link" href="/labs/lab1">Lab 1</a></div>',
            };
          }
          return { ok: true, status: 200, finalUrl: url, html: "<p>Hi</p>" };
        },
      },
    });
    assert.equal(
      results.find((row) => row.id === "a1-delivery-name-section")?.passed,
      false,
    );
    assert.equal(
      results.find((row) => row.id === "a1-delivery-labs-nav")?.passed,
      true,
    );
  });

  it("fails localhost, auth walls, and missing labs markers", async () => {
    const localhost = await runA1Checks({
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: "http://localhost:3000",
      probes: {
        async getHtml() {
          throw new Error("should not fetch localhost");
        },
      },
    });
    assert.equal(
      localhost.find((row) => row.id === "a1-delivery-vercel")?.passed,
      false,
    );

    const auth = await runA1Checks({
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: "https://protected.vercel.app",
      probes: {
        async getHtml() {
          return {
            ok: false,
            status: 401,
            code: "auth_wall",
            message: ASSIGNMENT_STUDENT_COPY.vercelAuthWall,
          };
        },
      },
    });
    const authOpen = auth.find((row) => row.id === "a1-delivery-vercel-open");
    assert.equal(authOpen?.passed, false);
    assert.match(authOpen?.message ?? "", /Deployment Protection/i);

    const missing = await runA1Checks({
      githubUrl: "not-github",
      vercelUrl: "https://empty.vercel.app",
      probes: {
        async getHtml(url) {
          return { ok: true, status: 200, finalUrl: url, html: "<p>Hi</p>" };
        },
      },
    });
    assert.equal(missing.find((row) => row.id === "github-url")?.passed, false);
    assert.equal(
      missing.find((row) => row.id === "a1-delivery-labs-nav")?.passed,
      false,
    );
  });

  it("still opens the deploy when only the pasted path 404s", async () => {
    const results = await runA1Checks({
      vercelUrl: "https://jane-a1.vercel.app/missing",
      nameQuery: resolveNameQuery({ firstName: "Jane", lastName: "Doe" }),
      probes: {
        async getHtml(url) {
          if (url.includes("/missing")) {
            return {
              ok: false,
              status: 404,
              code: "http_error",
              message: ASSIGNMENT_STUDENT_COPY.vercelNotFound,
            };
          }
          return { ok: true, status: 200, finalUrl: url, html: htmlForPath(url) };
        },
      },
    });
    assert.equal(
      results.find((row) => row.id === "a1-delivery-vercel-open")?.passed,
      true,
    );
    assert.equal(
      results.find((row) => row.id === "a1-delivery-name-section")?.passed,
      true,
    );
  });

  it("explains a 404 when no deploy page opens", async () => {
    const results = await runA1Checks({
      vercelUrl: "https://gone.vercel.app",
      probes: {
        async getHtml() {
          return {
            ok: false,
            status: 404,
            code: "http_error",
            message: ASSIGNMENT_STUDENT_COPY.vercelNotFound,
          };
        },
      },
    });
    const open = results.find((row) => row.id === "a1-delivery-vercel-open");
    assert.equal(open?.passed, false);
    assert.match(open?.message ?? "", /cannot be loaded/i);
    assert.match(
      deployOpenFailureMessage({
        ok: false,
        status: 502,
        code: "http_error",
        message: "bad gateway",
      }),
      /private\/incognito window/i,
    );
  });

  it("classifies 403 and Vercel SSO redirects as auth walls", () => {
    const classified = classifyDeployFetch({
      ok: true,
      status: 200,
      finalUrl: "https://vercel.com/login?next=https://x.vercel.app",
      html: "<html></html>",
    });
    assert.equal(classified.ok, false);
    if (!classified.ok) assert.equal(classified.code, "auth_wall");
  });
});

describe("assignment submission access and store", () => {
  it("lets rostered students and staff through; skips persist while impersonating", () => {
    assert.equal(supportsUrlSubmission("a1"), true);
    assert.equal(supportsUrlSubmission("a2"), true);
    assert.equal(canPersistAssignmentSubmission(true), false);
    assert.equal(canPersistAssignmentSubmission(false), true);

    assert.equal(
      assignmentSubmitAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        roster: {
          status: "matched",
          entry: { email: "jane.doe@northeastern.edu" },
        },
      }).ok,
      true,
    );
    assert.equal(
      assignmentSubmitAccess({
        signedIn: true,
        configured: true,
        isActualStaff: true,
        roster: { status: "not_on_roster" },
      }).ok,
      true,
    );
    assert.equal(
      assignmentSubmitAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        roster: { status: "not_on_roster" },
      }).ok,
      false,
    );
    const signedOut = assignmentSubmitAccess({
      signedIn: false,
      configured: true,
      isActualStaff: false,
      roster: { status: "empty" },
    });
    assert.equal(signedOut.ok, false);
    if (!signedOut.ok) assert.equal(signedOut.code, "unauthenticated");
  });

  it("upserts one document per clerk user + assignment and keeps createdAt", async () => {
    const store = memorySubmissionStore();
    const first = await upsertAssignmentSubmission(
      store,
      {
        clerkUserId: "user_1",
        assignmentId: "a1",
        githubUrl: "https://github.com/jane-doe/webdev-client",
        vercelUrl: "https://jane-a1.vercel.app",
        checkResults: [{ id: "vercel-url", label: "Vercel", passed: true, message: "ok" }],
        checked: true,
      },
      new Date("2026-09-05T12:00:00.000Z"),
    );
    const second = await upsertAssignmentSubmission(
      store,
      {
        clerkUserId: "user_1",
        assignmentId: "a1",
        githubUrl: "https://github.com/jane-doe/webdev-client",
        vercelUrl: "https://jane-a1-v2.vercel.app",
        checked: true,
      },
      new Date("2026-09-05T13:00:00.000Z"),
    );
    assert.equal(first.createdAt.toISOString(), second.createdAt.toISOString());
    assert.equal(second.vercelUrl, "https://jane-a1-v2.vercel.app");
    assert.equal(second.updatedAt.toISOString(), "2026-09-05T13:00:00.000Z");
    const loaded = await loadAssignmentSubmission(store, "user_1", "a1");
    assert.equal(loaded?.vercelUrl, second.vercelUrl);
    assert.equal(await loadAssignmentSubmission(store, "user_2", "a1"), null);

    const graded = await upsertAssignmentSubmission(store, {
      clerkUserId: "user_1",
      assignmentId: "a1",
      githubUrl: second.githubUrl,
      vercelUrl: second.vercelUrl,
      identity: { email: "jane.doe@northeastern.edu", name: "Jane Doe" },
      staffGrade: {
        earnedPoints: 8,
        totalPoints: 101,
        percent: 8,
        acceptedProposed: true,
        comments: { "a1-delivery-vercel": "Looks good." },
        gradedAt: new Date("2026-09-05T14:00:00.000Z"),
      },
    });
    assert.equal(graded.email, "jane.doe@northeastern.edu");
    const kept = await upsertAssignmentSubmission(store, {
      clerkUserId: "user_1",
      assignmentId: "a1",
      githubUrl: second.githubUrl,
      vercelUrl: "https://jane-a1-v3.vercel.app",
    });
    assert.equal(kept.staffGrade?.earnedPoints, 8);
    assert.equal(kept.staffGrade?.comments?.["a1-delivery-vercel"], "Looks good.");
    assert.equal(kept.email, "jane.doe@northeastern.edu");
  });
});

describe("student-facing copy", () => {
  it("never names Clerk", () => {
    for (const value of Object.values(ASSIGNMENT_STUDENT_COPY)) {
      assert.doesNotMatch(value, /Clerk/i);
    }
  });

  it("never names demo students or demo emails", () => {
    for (const value of Object.values(ASSIGNMENT_STUDENT_COPY)) {
      assert.doesNotMatch(value, /\bAda\b/i);
      assert.doesNotMatch(value, /\bBob\b/i);
      assert.doesNotMatch(value, /ada@ada\.com/i);
      assert.doesNotMatch(value, /bob@bob\.com/i);
    }
  });

  it("says URL fields are roster-gated, not date-gated", () => {
    assert.match(ASSIGNMENT_STUDENT_COPY.urlSubmitWhen, /not unlocked by a calendar date/i);
    assert.match(
      ASSIGNMENT_STUDENT_COPY.urlSubmitWhen,
      /same Northeastern email as your Canvas\/FACT roster/i,
    );
    assert.match(
      ASSIGNMENT_STUDENT_COPY.urlSubmitWhen,
      /on the course site roster/i,
    );
    assert.match(ASSIGNMENT_STUDENT_COPY.urlSubmitWhen, /Run checks/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.urlSubmitWhen, /without an account/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.notConfigured, /saving URLs stays closed/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.notConfigured, /still run checks/i);
    assert.doesNotMatch(ASSIGNMENT_STUDENT_COPY.notConfigured, /test fields stay closed/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.notConfigured, /not a date lock/i);
    assert.match(
      ASSIGNMENT_STUDENT_COPY.notConfigured,
      /same Northeastern email you use on Canvas/i,
    );
    assert.match(
      ASSIGNMENT_STUDENT_COPY.notConfigured,
      /could not read the imported Canvas\/FACT roster/i,
    );
    assert.match(
      ASSIGNMENT_STUDENT_COPY.notConfigured,
      /Piazza to refresh the roster or contact the instructor/i,
    );
    assert.equal(
      ASSIGNMENT_STUDENT_COPY.notConfiguredTitle,
      "URL submit is not available yet",
    );
    assert.match(
      ASSIGNMENT_STUDENT_COPY.notOnRoster,
      /Piazza to refresh the roster or contact the instructor/i,
    );
    for (const value of Object.values(ASSIGNMENT_STUDENT_COPY)) {
      assert.doesNotMatch(value, /hard[-\s]?refresh/i);
      assert.doesNotMatch(value, /refresh (this|the) page/i);
    }
  });

  it("tells students a failed Vercel URL cannot be loaded", () => {
    assert.match(ASSIGNMENT_STUDENT_COPY.vercelNotFound, /cannot be loaded/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.vercelNotFound, /private window/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.vercelUnreachable, /private\/incognito/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.vercelHttpError, /cannot load the page/i);
  });

  it("says Name and section is the Canvas name on Labs, not a Run checks control", () => {
    assert.match(ASSIGNMENT_STUDENT_COPY.nameAndSection, /full Canvas name on Labs/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.nameAndSection, /first then last/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.nameAndSection, /matching the roster/i);
    assert.match(
      ASSIGNMENT_STUDENT_COPY.nameAndSection,
      /no Name and section checkbox or control in Run checks/i,
    );
    assert.match(
      ASSIGNMENT_STUDENT_COPY.nameAndSectionDeliveryNote,
      /not a checkbox or control in Run checks/i,
    );
    assert.match(ASSIGNMENT_STUDENT_COPY.nameMissing, /full Canvas name/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.nameMissing, /no Name and section checkbox in Run checks/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.nameOk, /full Canvas name on Labs/i);
  });

  it("says Manual check is staff grading on the deploy URL, not an auto result", () => {
    assert.match(ASSIGNMENT_STUDENT_COPY.manualCheckHint, /Staff grade this row on your deploy URL/i);
    assert.match(
      ASSIGNMENT_STUDENT_COPY.manualCheckHint,
      /Run checks does not mark it pass or fail/i,
    );
    assert.match(
      ASSIGNMENT_STUDENT_COPY.manualCheckHint,
      /not a failed auto check/i,
    );
    assert.match(ASSIGNMENT_STUDENT_COPY.manualCheckLabNote, /Manual check badge/i);
    assert.match(
      ASSIGNMENT_STUDENT_COPY.manualCheckLabNote,
      /staff grade that row on your deploy URL/i,
    );
    assert.match(
      ASSIGNMENT_STUDENT_COPY.manualCheckLabNote,
      /never marks it pass or fail/i,
    );
    assert.doesNotMatch(ASSIGNMENT_STUDENT_COPY.manualCheckHint, /Best \/ Better/i);
  });

  it("describes origin normalize, Labs/Kambaz crawl, and optional GitHub", () => {
    assert.match(ASSIGNMENT_STUDENT_COPY.checkInstructions, /normalize the deploy origin/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.checkInstructions, /Labs and Lab pages/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.checkInstructions, /Kambaz/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.checkInstructions, /wd-\*/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.checkInstructions, /GitHub URL is optional/i);
    assert.doesNotMatch(ASSIGNMENT_STUDENT_COPY.checkInstructions, /Best \/ Better/i);
  });

  it("tells students to Sign up first with their Canvas email", () => {
    assert.match(ASSIGNMENT_STUDENT_COPY.signInHint, /Sign up first/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.signInHint, /separate from Canvas/i);
    assert.match(
      ASSIGNMENT_STUDENT_COPY.signInHint,
      /same Northeastern email you use on Canvas/i,
    );
    assert.doesNotMatch(ASSIGNMENT_STUDENT_COPY.signInHint, /school email is fine/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.signInToSubmit, /Sign up if you don['’]t have/i);
    assert.match(
      ASSIGNMENT_STUDENT_COPY.signInToSubmit,
      /same Northeastern email you use on Canvas/i,
    );
    assert.match(ASSIGNMENT_STUDENT_COPY.syncProgress, /Sign up if you don['’]t have/i);
    assert.match(
      ASSIGNMENT_STUDENT_COPY.notOnRoster,
      /same Northeastern email you use on Canvas/i,
    );
    assert.match(
      ASSIGNMENT_STUDENT_COPY.notOnRoster,
      /use your Canvas email so we can map progress/i,
    );
    assert.match(ASSIGNMENT_STUDENT_COPY.notOnRoster, /Canvas\/FACT/i);
    for (const value of Object.values(ASSIGNMENT_STUDENT_COPY)) {
      assert.doesNotMatch(value, /stay in this browser/i);
    }
    assert.match(ASSIGNMENT_STUDENT_COPY.checksNotSaved, /not saved/i);
    assert.match(ASSIGNMENT_STUDENT_COPY.manualCheckHint, /Checked by staff at grading/i);
  });
});
