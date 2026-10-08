/**
 * GitHub public-repo probe: rate limits, 5xx and network errors are transient
 * (never cost a point); only a 404 means "not found or private".
 */
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { A1_RUBRIC } from "./a1";
import { GITHUB_RECHECK_MESSAGE, needsReviewCriterionIds } from "./check-status";
import type { UrlProbeResult } from "./check-types";
import { latestResultByCriterion, runA1Checks } from "./checks";
import { buildSubmissionExportRow } from "./export";
import { fixtureProbes, FIXTURE_ORIGIN, passingDeployPages } from "./fixtures/a1-deploy";
import { proposedGradeFromResults } from "./grade";
import {
  GITHUB_MAX_CONCURRENCY,
  GITHUB_MAX_WAIT_MS,
  GITHUB_TOKEN_ENV,
  githubProbesInFlight,
  probeGithub,
  resetGithubProbeState,
} from "./github-probe";
import { resolveNameQuery } from "./names";
import type { StaffStudentRow } from "./staff";

const REPO = "https://github.com/jane-doe/webdev-client";
const NOW = 1_800_000_000_000;

type Reply = { status: number; headers?: Record<string, string>; body?: string } | "network";

function mockFetch(replies: Reply[]) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fn = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    const reply = replies.length > 1 ? replies.shift()! : replies[0];
    if (reply === "network") throw new TypeError("fetch failed");
    return new Response(reply.body ?? null, { status: reply.status, headers: reply.headers });
  }) as typeof fetch;
  return { fn, calls };
}

function deps(replies: Reply[], env: Record<string, string | undefined> = {}) {
  const sleeps: number[] = [];
  const mock = mockFetch(replies);
  let now = NOW;
  return {
    sleeps,
    calls: mock.calls,
    deps: {
      fetch: mock.fn,
      env,
      now: () => now,
      sleep: async (ms: number) => {
        sleeps.push(ms);
        now += ms;
      },
    },
  };
}

const rateLimited403 = (resetInSec: number): Reply => ({
  status: 403,
  headers: {
    "x-ratelimit-remaining": "0",
    "x-ratelimit-reset": String(Math.floor(NOW / 1000) + resetInSec),
  },
});

beforeEach(() => resetGithubProbeState());

describe("probeGithub (no token, github.com page)", () => {
  it("200 is public", async () => {
    const t = deps([{ status: 200 }]);
    assert.deepEqual(await probeGithub(REPO, t.deps), { ok: true, status: 200 });
    assert.equal(t.calls[0].init?.method, "HEAD");
  });

  it("404 is a genuine not found / private (not transient)", async () => {
    const t = deps([{ status: 404 }]);
    const result = await probeGithub(REPO, t.deps);
    assert.equal(result.ok, false);
    assert.equal(result.status, 404);
    assert.equal(!result.ok && result.transient, undefined);
    assert.equal(t.calls.length, 1);
  });

  it("403 rate limit with a near reset waits for the reset, then retries", async () => {
    const t = deps([rateLimited403(2), { status: 200 }]);
    assert.deepEqual(await probeGithub(REPO, t.deps), { ok: true, status: 200 });
    assert.deepEqual(t.sleeps, [2000]);
  });

  it("403 rate limit with a far reset gives up at once as transient, and cools down", async () => {
    const t = deps([rateLimited403(3600)]);
    const first = await probeGithub(REPO, t.deps);
    assert.equal(first.ok, false);
    assert.equal(!first.ok && first.transient, true);
    assert.equal(first.status, 403);
    assert.deepEqual(t.sleeps, []);
    assert.equal(t.calls.length, 1);
    // Later probes in the cooldown do not hit GitHub at all.
    const second = await probeGithub(REPO, t.deps);
    assert.equal(!second.ok && second.transient, true);
    assert.equal(t.calls.length, 1);
  });

  it("429 honors retry-after (seconds) within the cap", async () => {
    const t = deps([{ status: 429, headers: { "retry-after": "1" } }, { status: 200 }]);
    assert.deepEqual(await probeGithub(REPO, t.deps), { ok: true, status: 200 });
    assert.deepEqual(t.sleeps, [1000]);
  });

  it("persistent 429 is transient after the retry cap", async () => {
    const t = deps([{ status: 429, headers: { "retry-after": "1" } }]);
    const result = await probeGithub(REPO, t.deps);
    assert.equal(!result.ok && result.transient, true);
    assert.equal(result.status, 429);
    assert.equal(t.calls.length, 3);
    assert.ok(t.sleeps.every((ms) => ms <= GITHUB_MAX_WAIT_MS));
  });

  it("429 asking for longer than the cap is transient without waiting", async () => {
    const t = deps([{ status: 429, headers: { "retry-after": "120" } }]);
    const result = await probeGithub(REPO, t.deps);
    assert.equal(!result.ok && result.transient, true);
    assert.deepEqual(t.sleeps, []);
  });

  it("5xx retries once, then is transient", async () => {
    const t = deps([{ status: 502 }]);
    const result = await probeGithub(REPO, t.deps);
    assert.equal(!result.ok && result.transient, true);
    assert.equal(result.status, 502);
    assert.equal(t.calls.length, 2);
  });

  it("5xx then 200 passes", async () => {
    const t = deps([{ status: 503 }, { status: 200 }]);
    assert.deepEqual(await probeGithub(REPO, t.deps), { ok: true, status: 200 });
  });

  it("network error / timeout is transient", async () => {
    const t = deps(["network"]);
    const result = await probeGithub(REPO, t.deps);
    assert.equal(!result.ok && result.transient, true);
    assert.equal(t.calls.length, 2);
  });

  it("a plain 403 without rate-limit headers is transient, not 'private'", async () => {
    const t = deps([{ status: 403 }]);
    const result = await probeGithub(REPO, t.deps);
    assert.equal(!result.ok && result.transient, true);
  });

  it("caps concurrent probes per instance", async () => {
    let peak = 0;
    const slow = (async () => {
      peak = Math.max(peak, githubProbesInFlight());
      await new Promise((r) => setTimeout(r, 5));
      return new Response(null, { status: 200 });
    }) as typeof fetch;
    await Promise.all(
      Array.from({ length: 12 }, () => probeGithub(REPO, { fetch: slow, env: {} })),
    );
    assert.ok(peak <= GITHUB_MAX_CONCURRENCY, `peak ${peak}`);
    assert.equal(githubProbesInFlight(), 0);
  });
});

describe(`probeGithub with ${GITHUB_TOKEN_ENV}`, () => {
  const env = { [GITHUB_TOKEN_ENV]: "test-token" };

  it("uses the REST API with the token", async () => {
    const t = deps([{ status: 200, body: JSON.stringify({ private: false }) }], env);
    assert.deepEqual(await probeGithub(REPO, t.deps), { ok: true, status: 200 });
    assert.equal(t.calls[0].url, "https://api.github.com/repos/jane-doe/webdev-client");
    const headers = t.calls[0].init?.headers as Record<string, string>;
    assert.equal(headers.Authorization, "Bearer test-token");
  });

  it("a private repo visible to the token is still not public", async () => {
    const t = deps([{ status: 200, body: JSON.stringify({ private: true }) }], env);
    const result = await probeGithub(REPO, t.deps);
    assert.equal(result.status, 404);
    assert.equal(!result.ok && result.transient, undefined);
  });

  it("API 404 is not public; API rate limit is transient", async () => {
    assert.equal((await probeGithub(REPO, deps([{ status: 404 }], env).deps)).status, 404);
    resetGithubProbeState();
    const limited = await probeGithub(REPO, deps([rateLimited403(3600)], env).deps);
    assert.equal(!limited.ok && limited.transient, true);
  });

  it("checks the branch for /tree/<branch> URLs", async () => {
    const t = deps(
      [{ status: 200, body: JSON.stringify({ private: false }) }, { status: 404 }],
      env,
    );
    const result = await probeGithub(`${REPO}/tree/a2`, t.deps);
    assert.equal(result.status, 404);
    assert.equal(t.calls[1].url, "https://api.github.com/repos/jane-doe/webdev-client/branches/a2");
  });
});

describe("A1 GitHub item: transient never costs a point", () => {
  async function gradeWith(probe: UrlProbeResult) {
    const probes = { ...fixtureProbes(passingDeployPages()), probeUrl: async () => probe };
    const results = await runA1Checks({
      githubUrl: REPO,
      vercelUrl: FIXTURE_ORIGIN,
      nameQuery: resolveNameQuery({ rosterName: "Doe, Jane" }),
      probes,
    });
    return {
      results,
      row: latestResultByCriterion(results).get("a1-delivery-github"),
      points: proposedGradeFromResults(A1_RUBRIC, results).earnedPoints,
    };
  }

  const transientCases: [string, UrlProbeResult][] = [
    ["403 rate limit", { ok: false, status: 403, transient: true, message: "x" }],
    ["429", { ok: false, status: 429, transient: true, message: "x" }],
    ["5xx", { ok: false, status: 502, transient: true, message: "x" }],
    ["network", { ok: false, transient: true, message: "x" }],
  ];
  for (const [name, probe] of transientCases) {
    it(`${name}: full points, flagged for re-check`, async () => {
      const graded = await gradeWith(probe);
      assert.equal(graded.points, 113);
      assert.equal(graded.row?.passed, true);
      assert.equal(graded.row?.needsReview, true);
      assert.equal(graded.row?.message, GITHUB_RECHECK_MESSAGE);
      assert.deepEqual(needsReviewCriterionIds(graded.results), ["a1-delivery-github"]);
      const exportRow = buildSubmissionExportRow({
        assignmentId: "a1",
        rubric: A1_RUBRIC,
        row: {
          name: "Doe, Jane",
          email: "jane@example.edu",
          hasSubmission: true,
          vercelUrl: FIXTURE_ORIGIN,
          checkResults: graded.results,
        } as unknown as StaffStudentRow,
      });
      // Full auto points (manual items wait for staff), flagged, not ready.
      assert.equal(exportRow.autoPoints, 113);
      assert.equal(exportRow.points, 113);
      assert.equal(exportRow.readyForCanvas, false);
      assert.match(exportRow.readyReason, /need TA review/);
      assert.equal(exportRow.confidence, "needs_review");
      assert.equal(exportRow.items["a1-delivery-github"], "review");
      assert.equal(exportRow.feedback, "");
    });
  }

  it("404 (not found / private) is a real deduction", async () => {
    const graded = await gradeWith({ ok: false, status: 404, message: "x" });
    assert.equal(graded.row?.passed, false);
    assert.equal(graded.row?.needsReview, undefined);
    assert.ok(graded.points < 113);
  });
});
