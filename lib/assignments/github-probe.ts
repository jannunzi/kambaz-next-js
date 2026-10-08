/**
 * Probe a GitHub repository (or a /tree/<branch> page) to confirm it is
 * public. Rate limits and other transient GitHub failures come back as
 * `transient: true` so a check never takes points off for them; only a 404
 * (not found or private) is a real "not public".
 *
 * When GITHUB_TOKEN is set, the GitHub REST API is used with the token (a much
 * higher rate limit). Without it, github.com pages are probed directly.
 * Concurrency is capped per server instance, 403/429 responses are retried
 * when GitHub says when to come back (within a short cap), and 5xx / network
 * errors get one quick retry.
 */
import type { UrlProbeResult } from "./check-types";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";

export const GITHUB_TOKEN_ENV = "GITHUB_TOKEN";
export const GITHUB_MAX_CONCURRENCY = 4;
export const GITHUB_MAX_ATTEMPTS = 3;
/** Longest single wait GitHub may ask for before we give up as transient. */
export const GITHUB_MAX_WAIT_MS = 5_000;
const BACKOFF_BASE_MS = 500;
const FETCH_TIMEOUT_MS = 10_000;

export const GITHUB_TRANSIENT_MESSAGE =
  "GitHub was busy (rate limit or a temporary error), so the repository could not be confirmed public.";
export const GITHUB_NOT_PUBLIC_MESSAGE = ASSIGNMENT_STUDENT_COPY.githubPrivate;

export type GithubProbeDeps = {
  fetch?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  env?: Record<string, string | undefined>;
  userAgent?: string;
};

type Target = { owner: string; repo: string; branch?: string };

function parseTarget(url: string): Target | null {
  try {
    const parsed = new URL(url);
    if (!/^(www\.)?github\.com$/i.test(parsed.hostname)) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const [owner, rawRepo, kind, ...rest] = parts;
    const repo = rawRepo.replace(/\.git$/i, "");
    if (kind === "tree" && rest.length) {
      return { owner, repo, branch: decodeURIComponent(rest.join("/")) };
    }
    return { owner, repo };
  } catch {
    return null;
  }
}

// --- per-instance concurrency cap and rate-limit cooldown -----------------

let active = 0;
const waiting: (() => void)[] = [];
let cooldownUntil = 0;

async function acquire(): Promise<void> {
  if (active < GITHUB_MAX_CONCURRENCY) {
    active += 1;
    return;
  }
  await new Promise<void>((resolve) => waiting.push(resolve));
  active += 1;
}

function release(): void {
  active -= 1;
  waiting.shift()?.();
}

/** Test hook: clear the cooldown and concurrency state. */
export function resetGithubProbeState(): void {
  active = 0;
  waiting.length = 0;
  cooldownUntil = 0;
}

/** Test hook: how many probes are in flight. */
export function githubProbesInFlight(): number {
  return active;
}

// --- classification -------------------------------------------------------

export function isRateLimited(res: Pick<Response, "status" | "headers">): boolean {
  if (res.status === 429) return true;
  if (res.status !== 403) return false;
  return (
    res.headers.get("x-ratelimit-remaining") === "0" ||
    res.headers.get("retry-after") != null
  );
}

/** How long GitHub asks us to wait, in ms (retry-after, then x-ratelimit-reset). */
export function rateLimitWaitMs(
  res: Pick<Response, "headers">,
  nowMs: number,
  attempt: number,
): number {
  const retryAfter = res.headers.get("retry-after");
  if (retryAfter != null) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
    const date = Date.parse(retryAfter);
    if (Number.isFinite(date)) return Math.max(0, date - nowMs);
  }
  const reset = Number(res.headers.get("x-ratelimit-reset"));
  if (res.headers.get("x-ratelimit-remaining") === "0" && Number.isFinite(reset) && reset > 0) {
    return Math.max(0, reset * 1000 - nowMs);
  }
  return BACKOFF_BASE_MS * 2 ** attempt;
}

function transient(status?: number): UrlProbeResult {
  return { ok: false, status, transient: true, message: GITHUB_TRANSIENT_MESSAGE };
}

function notPublic(): UrlProbeResult {
  return { ok: false, status: 404, message: GITHUB_NOT_PUBLIC_MESSAGE };
}

type Attempt = { kind: "response"; res: Response } | { kind: "error" };

async function requestWithRetry(
  url: string,
  init: RequestInit,
  deps: Required<Pick<GithubProbeDeps, "fetch" | "sleep" | "now">>,
): Promise<{ res?: Response; transientStatus?: number; failed: boolean }> {
  let lastStatus: number | undefined;
  for (let attempt = 0; attempt < GITHUB_MAX_ATTEMPTS; attempt += 1) {
    if (deps.now() < cooldownUntil) return { failed: true, transientStatus: lastStatus ?? 429 };
    let outcome: Attempt;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      outcome = {
        kind: "response",
        res: await deps.fetch(url, { ...init, redirect: "follow", signal: controller.signal }),
      };
    } catch {
      outcome = { kind: "error" };
    } finally {
      clearTimeout(timer);
    }

    if (outcome.kind === "error") {
      lastStatus = undefined;
      if (attempt >= 1) return { failed: true };
      await deps.sleep(BACKOFF_BASE_MS);
      continue;
    }

    const { res } = outcome;
    if (isRateLimited(res)) {
      lastStatus = res.status;
      await res.body?.cancel().catch(() => undefined);
      const wait = rateLimitWaitMs(res, deps.now(), attempt);
      if (wait > GITHUB_MAX_WAIT_MS) {
        cooldownUntil = Math.max(cooldownUntil, deps.now() + wait);
        return { failed: true, transientStatus: res.status };
      }
      if (attempt < GITHUB_MAX_ATTEMPTS - 1) await deps.sleep(wait);
      continue;
    }
    if (res.status >= 500) {
      lastStatus = res.status;
      await res.body?.cancel().catch(() => undefined);
      if (attempt >= 1) return { failed: true, transientStatus: res.status };
      await deps.sleep(BACKOFF_BASE_MS * 2 ** attempt);
      continue;
    }
    return { res, failed: false };
  }
  return { failed: true, transientStatus: lastStatus };
}

export async function probeGithub(url: string, deps: GithubProbeDeps = {}): Promise<UrlProbeResult> {
  const run = {
    fetch: deps.fetch ?? fetch,
    sleep: deps.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms))),
    now: deps.now ?? Date.now,
  };
  const env = deps.env ?? process.env;
  const token = env[GITHUB_TOKEN_ENV]?.trim();
  const userAgent = deps.userAgent ?? "webdev-client-assignment-check";
  const target = parseTarget(url);

  await acquire();
  try {
    if (token && target) {
      const headers = {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": userAgent,
        "X-GitHub-Api-Version": "2022-11-28",
      };
      const base = `https://api.github.com/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}`;
      const repo = await requestWithRetry(base, { method: "GET", headers }, run);
      if (repo.failed || !repo.res) return transient(repo.transientStatus);
      if (repo.res.status === 404) return notPublic();
      if (repo.res.status === 401 || repo.res.status === 403) {
        // A bad or under-scoped token is our problem, not the student's.
        return transient(repo.res.status);
      }
      if (!repo.res.ok) return transient(repo.res.status);
      const body = (await repo.res.json().catch(() => null)) as { private?: boolean } | null;
      if (body?.private) return notPublic();
      if (!target.branch) return { ok: true, status: 200 };
      const branch = await requestWithRetry(
        `${base}/branches/${encodeURIComponent(target.branch)}`,
        { method: "GET", headers },
        run,
      );
      if (branch.failed || !branch.res) return transient(branch.transientStatus);
      await branch.res.body?.cancel().catch(() => undefined);
      if (branch.res.status === 404) return { ok: false, status: 404, message: GITHUB_NOT_PUBLIC_MESSAGE };
      if (!branch.res.ok) return transient(branch.res.status);
      return { ok: true, status: 200 };
    }

    const treePage = Boolean(target?.branch);
    const headers = { Accept: "text/html,*/*;q=0.8", "User-Agent": userAgent };
    let attempt = await requestWithRetry(url, { method: treePage ? "GET" : "HEAD", headers }, run);
    if (!attempt.failed && attempt.res && !treePage && (attempt.res.status === 405 || attempt.res.status === 501)) {
      attempt = await requestWithRetry(url, { method: "GET", headers }, run);
    }
    if (attempt.failed || !attempt.res) return transient(attempt.transientStatus);
    const res = attempt.res;
    await res.body?.cancel().catch(() => undefined);
    if (res.status === 404) return notPublic();
    // github.com uses 404 for private repos; any other non-OK answer is not
    // evidence the repo is missing, so it must not cost a point.
    if (!res.ok) return transient(res.status);
    return { ok: true, status: res.status };
  } finally {
    release();
  }
}
