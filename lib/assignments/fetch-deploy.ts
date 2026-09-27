import "server-only";

import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import type { HtmlFetchResult, UrlProbeResult } from "./checks";
import { COURSE_SITE_ORIGIN } from "@/lib/course-site/origin";
import { isBlockedHostname, isVercelAuthWallUrl, looksLikeDeployUrl } from "./urls";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_BODY_CHARS = 800_000;
const USER_AGENT =
  `webdev-client-assignment-check/1.0 (+${COURSE_SITE_ORIGIN})`;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml,*/*;q=0.8",
        "User-Agent": USER_AGENT,
        ...init.headers,
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function readBodyLimited(res: Response): Promise<string> {
  const text = await res.text();
  if (text.length <= MAX_BODY_CHARS) return text;
  return text.slice(0, MAX_BODY_CHARS);
}

function rejectIfBlockedFinalUrl(finalUrl: string): HtmlFetchResult | null {
  try {
    const parsed = new URL(finalUrl);
    if (isBlockedHostname(parsed.hostname)) {
      return {
        ok: false,
        code: "network",
        finalUrl,
        message: ASSIGNMENT_STUDENT_COPY.vercelBlockedHost,
      };
    }
  } catch {
    return {
      ok: false,
      code: "network",
      finalUrl,
      message: ASSIGNMENT_STUDENT_COPY.vercelUnreachable,
    };
  }
  return null;
}

export async function fetchDeployHtml(url: string): Promise<HtmlFetchResult> {
  const parsed = looksLikeDeployUrl(url);
  if (!parsed.ok) {
    return { ok: false, code: "network", message: parsed.message };
  }

  try {
    const res = await fetchWithTimeout(parsed.href, { method: "GET" });
    const finalUrl = res.url || parsed.href;
    const blocked = rejectIfBlockedFinalUrl(finalUrl);
    if (blocked) return blocked;
    const html = await readBodyLimited(res);

    if (res.status === 401 || res.status === 403 || isVercelAuthWallUrl(finalUrl)) {
      return {
        ok: false,
        status: res.status,
        finalUrl,
        html,
        code: "auth_wall",
        message: ASSIGNMENT_STUDENT_COPY.vercelAuthWall,
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        finalUrl,
        html,
        code: "http_error",
        message:
          res.status === 404
            ? ASSIGNMENT_STUDENT_COPY.vercelNotFound
            : `${ASSIGNMENT_STUDENT_COPY.vercelHttpError} (HTTP ${res.status}).`,
      };
    }

    return { ok: true, status: res.status, finalUrl, html };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : ASSIGNMENT_STUDENT_COPY.vercelUnreachable;
    return {
      ok: false,
      code: "network",
      message: message.includes("abort")
        ? "The deployment timed out."
        : ASSIGNMENT_STUDENT_COPY.vercelUnreachable,
    };
  }
}

export async function probeGithubRepo(url: string): Promise<UrlProbeResult> {
  try {
    let treePage = false;
    try {
      treePage = /\/tree\//.test(new URL(url).pathname);
    } catch {
      treePage = false;
    }
    let res = await fetchWithTimeout(url, { method: treePage ? "GET" : "HEAD" });
    if (!treePage && (res.status === 405 || res.status === 501)) {
      res = await fetchWithTimeout(url, { method: "GET" });
    }
    if (res.body) {
      await res.body.cancel().catch(() => undefined);
    }
    if (res.status === 404) {
      return { ok: false, status: 404, message: ASSIGNMENT_STUDENT_COPY.githubPrivate };
    }
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: ASSIGNMENT_STUDENT_COPY.githubUnreachable,
      };
    }
    return { ok: true, status: res.status };
  } catch {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.githubUnreachable };
  }
}
