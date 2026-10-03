import { isLegacyCourseHost } from "@/lib/course-site/origin";
import { COURSE_SITE_ORIGIN } from "./catalog";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";

export const OFFICIAL_GITHUB_OWNER = "jannunzi";
export const OFFICIAL_GITHUB_REPO = "webdev-client";

export type UrlParseOk = { ok: true; url: URL; href: string };
export type UrlParseFail = { ok: false; message: string };
export type UrlParseResult = UrlParseOk | UrlParseFail;

export type GithubRepoRef = {
  owner: string;
  repo: string;
  href: string;
};

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

const BLOCKED_HOST_SUFFIXES = [".localhost", ".local", ".internal", ".lan"];

export function trimUrlInput(value: string): string {
  return value.trim();
}

export function parseHttpsUrl(raw: string): UrlParseResult {
  const trimmed = trimUrlInput(raw);
  if (!trimmed) {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.vercelRequired };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.vercelFormat };
  }

  if (parsed.protocol === "http:") {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.vercelHttps };
  }
  if (parsed.protocol !== "https:") {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.vercelFormat };
  }
  if (!parsed.hostname) {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.vercelFormat };
  }

  return { ok: true, url: parsed, href: parsed.href };
}

export function hostnameOf(value: string): string {
  return value.trim().toLowerCase().replace(/\.$/, "");
}

export function isLoopbackHostname(hostname: string): boolean {
  const host = hostnameOf(hostname);
  if (LOOPBACK_HOSTS.has(host)) return true;
  return host.startsWith("127.");
}

export function isPrivateIpv4(hostname: string): boolean {
  const host = hostnameOf(hostname);
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!match) return false;
  const octets = match.slice(1).map((part) => Number(part));
  if (octets.some((octet) => Number.isNaN(octet) || octet > 255)) return false;
  const [a, b] = octets;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

export function isBlockedHostname(hostname: string): boolean {
  const host = hostnameOf(hostname);
  if (!host) return true;
  if (isLoopbackHostname(host)) return true;
  if (isPrivateIpv4(host)) return true;
  if (BLOCKED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) return true;
  if (host.startsWith("[") && host.includes(":]")) return true;
  if (host.includes(":")) {
    const ipv6 = host.replace(/^\[|\]$/g, "");
    if (ipv6 === "::1" || ipv6.startsWith("fe80:") || ipv6.startsWith("fc") || ipv6.startsWith("fd")) {
      return true;
    }
  }
  return false;
}

export function isCourseSiteUrl(url: URL): boolean {
  const host = hostnameOf(url.hostname);
  let courseHost = "kambaz.dev";
  try {
    courseHost = hostnameOf(new URL(COURSE_SITE_ORIGIN).hostname);
  } catch {
    /* keep default */
  }
  return (
    host === courseHost ||
    host === `www.${courseHost}` ||
    isLegacyCourseHost(host)
  );
}

export function looksLikeDeployUrl(raw: string): UrlParseResult {
  const lower = trimUrlInput(raw).toLowerCase();
  if (
    lower.includes("localhost") ||
    lower.includes("127.0.0.1") ||
    lower.includes("[::1]")
  ) {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.vercelLocalhost };
  }

  const parsed = parseHttpsUrl(raw);
  if (!parsed.ok) {
    if (lower.startsWith("http://")) {
      return { ok: false, message: ASSIGNMENT_STUDENT_COPY.vercelHttps };
    }
    return {
      ok: false,
      message: ASSIGNMENT_STUDENT_COPY.vercelFormat,
    };
  }

  if (isLoopbackHostname(parsed.url.hostname)) {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.vercelLocalhost };
  }
  if (isBlockedHostname(parsed.url.hostname)) {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.vercelBlockedHost };
  }
  if (isCourseSiteUrl(parsed.url)) {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.vercelCourseSite };
  }
  if (!parsed.url.hostname.includes(".")) {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.vercelFormat };
  }

  return parsed;
}

export function parseGithubRepoUrl(
  raw: string,
): { ok: true; repo: GithubRepoRef } | UrlParseFail {
  const parsed = parseHttpsUrl(raw);
  if (!parsed.ok) {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.githubFormat };
  }

  const host = hostnameOf(parsed.url.hostname);
  if (host !== "github.com" && host !== "www.github.com") {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.githubFormat };
  }

  const parts = parsed.url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.githubFormat };
  }

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, "");
  if (!owner || !repo || owner === "." || repo === ".") {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.githubFormat };
  }
  if (
    ["gist", "settings", "orgs", "marketplace", "topics", "explore"].includes(
      owner.toLowerCase(),
    )
  ) {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.githubFormat };
  }

  const href = `https://github.com/${owner}/${repo}`;
  if (
    owner.toLowerCase() === OFFICIAL_GITHUB_OWNER &&
    repo.toLowerCase() === OFFICIAL_GITHUB_REPO
  ) {
    return { ok: false, message: ASSIGNMENT_STUDENT_COPY.githubOfficial };
  }

  return { ok: true, repo: { owner, repo, href } };
}

/**
 * Vercel branch previews put `-git-<branch>-` in the first DNS label.
 * Labels longer than 63 characters are truncated, so the label may end at
 * `-git-<branch>` with no trailing hyphen.
 */
export function isVercelBranchPreviewHost(hostname: string, branch: string): boolean {
  const host = hostnameOf(hostname);
  if (!host.endsWith(".vercel.app")) return false;
  const label = host.split(".")[0] ?? "";
  if (!label || !branch) return false;
  const safe = branch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`-git-${safe}(?:-|$)`).test(label);
}

/**
 * A2-only hint for http:// and schemeless GitHub URLs. Null for other inputs
 * so A1 keeps ASSIGNMENT_STUDENT_COPY.githubFormat.
 */
export function a2GithubSchemeMessage(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  const schemeless = !/^[a-z][a-z0-9+.-]*:/i.test(trimmed);
  if (!lower.startsWith("http://") && !schemeless) return null;
  return ASSIGNMENT_STUDENT_COPY.a2GithubBranchUrl;
}

/**
 * Branch name from a GitHub `/tree/<branch>` or `/commits/<branch>` URL.
 * A repository-root URL has no branch.
 */
export function githubUrlBranch(raw: string): string | null {
  const parsed = parseHttpsUrl(raw);
  if (!parsed.ok) return null;
  const host = hostnameOf(parsed.url.hostname);
  if (host !== "github.com" && host !== "www.github.com") return null;
  const parts = parsed.url.pathname.split("/").filter(Boolean);
  if (parts.length < 4) return null;
  if (parts[2] !== "tree" && parts[2] !== "commits") return null;
  const branch = parts[3];
  if (!branch) return null;
  try {
    return decodeURIComponent(branch);
  } catch {
    return branch;
  }
}

export function deployOriginFromUrl(raw: string): UrlParseResult {
  const parsed = looksLikeDeployUrl(raw);
  if (!parsed.ok) return parsed;
  const originUrl = new URL(parsed.url.origin);
  return { ok: true, url: originUrl, href: `${originUrl.origin}/` };
}

export function urlOnDeployOrigin(originHref: string, path: string): string {
  return new URL(path, originHref).href;
}

/** Seed paths always fetched after normalizing a student deploy to its origin. */
export const A1_SEED_PATHS = [
  "/",
  "/labs",
  "/labs/lab1",
  "/account/signin",
  "/account/signup",
  "/account/profile",
  "/dashboard",
] as const;

export function seedUrlsForDeploy(
  deployUrl: string,
  seedPaths: readonly string[],
): string[] {
  const origin = deployOriginFromUrl(deployUrl);
  if (!origin.ok) return [];
  const submitted = looksLikeDeployUrl(deployUrl);
  const urls = seedPaths.map((path) => urlOnDeployOrigin(origin.href, path));
  if (submitted.ok) urls.unshift(submitted.href);
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const href of urls) {
    if (seen.has(href)) continue;
    seen.add(href);
    unique.push(href);
  }
  return unique;
}

export function a1SeedUrls(deployUrl: string): string[] {
  return seedUrlsForDeploy(deployUrl, A1_SEED_PATHS);
}

export function labsUrlFromDeploy(deployUrl: string): string | null {
  const origin = deployOriginFromUrl(deployUrl);
  if (!origin.ok) return null;
  return urlOnDeployOrigin(origin.href, "/labs");
}

export function isVercelAuthWallUrl(finalUrl: string): boolean {
  try {
    const url = new URL(finalUrl);
    const host = hostnameOf(url.hostname);
    if (host === "vercel.com" || host.endsWith(".vercel.com")) {
      return /login|sso|auth|challenge/i.test(url.pathname + url.search);
    }
    return false;
  } catch {
    return false;
  }
}

export function htmlLooksLikeVercelAuthWall(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    lower.includes("vercel.com/sso") ||
    lower.includes("/sso-api") ||
    lower.includes('id="challenge"') ||
    (lower.includes("authentication required") && lower.includes("sso"))
  );
}
