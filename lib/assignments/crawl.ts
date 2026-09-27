import type { HtmlFetchResult } from "./check-types";
import {
  extractAssignmentIds,
  extractCourseIds,
  extractInternalHrefs,
  isCourseScreenPath,
  isLabsPath,
  pathnameOf,
  uniqueUrls,
} from "./html";
import { A1_CHECKER } from "./a1-checker";
import {
  A1_SEED_PATHS,
  deployOriginFromUrl,
  looksLikeDeployUrl,
  seedUrlsForDeploy,
  urlOnDeployOrigin,
} from "./urls";

export type PageSnapshot = {
  path: string;
  url: string;
  result: HtmlFetchResult;
};

export type DeployCorpus = {
  ok: true;
  origin: string;
  pages: PageSnapshot[];
  allHtml: string;
  labsHtml: string;
};

const FALLBACK_COURSE_IDS = ["1234", "RS101"];

/**
 * Follow-up fetches after the seed pages. Checklist screens are ordered
 * ahead of links discovered from labs and course cards, then this cap is
 * applied so a busy dashboard cannot crowd out Assignments or the editor.
 */
export const A1_FOLLOWUP_URL_CAP = 16;

const DEFAULT_ASSIGNMENT_ID = "123";
const EXTRA_COURSE_LIMIT = 2;

function successfulHtml(pages: PageSnapshot[]): string {
  return pages
    .filter((page) => page.result.ok)
    .map((page) => page.result.html)
    .join("\n");
}

function labsHtmlFrom(pages: PageSnapshot[]): string {
  const labsPages = pages.filter(
    (page) => page.result.ok && isLabsPath(page.path),
  );
  if (labsPages.length > 0) return successfulHtml(labsPages);
  return successfulHtml(pages);
}

function sameOriginHref(origin: string, href: string): string | null {
  try {
    const resolved = new URL(href, origin);
    if (resolved.origin !== new URL(origin).origin) return null;
    return resolved.href;
  } catch {
    return null;
  }
}

function checklistFollowupPaths(
  seedPaths: readonly string[],
  verifyPaths: readonly string[],
): string[] {
  const seeds = new Set<string>(seedPaths);
  const paths: string[] = [];
  for (const path of verifyPaths) {
    if (seeds.has(path) || paths.includes(path)) continue;
    paths.push(path);
  }
  return paths;
}

function caseVariantPath(path: string): string | null {
  const match = /^\/courses\/([^/]+)\/([^/]+)(\/[^/]+)?$/i.exec(path);
  if (!match) return null;
  const [, courseId, screen, rest = ""] = match;
  const titled = screen.charAt(0).toUpperCase() + screen.slice(1).toLowerCase();
  return `/Courses/${courseId}/${titled}${rest}`;
}

function withCaseVariants(paths: readonly string[]): string[] {
  const variants: string[] = [];
  for (const path of paths) {
    const variant = caseVariantPath(path);
    if (variant && variant !== path) variants.push(variant);
  }
  return [...paths, ...variants];
}

function courseIdsInPaths(paths: readonly string[]): Set<string> {
  const ids = new Set<string>();
  for (const path of paths) {
    const match = /^\/courses\/([^/]+)\//i.exec(path);
    if (match) ids.add(match[1].toLowerCase());
  }
  return ids;
}

function canonicalCoursePaths(courseId: string, assignmentId: string): string[] {
  return [
    `/courses/${courseId}/assignments`,
    `/courses/${courseId}/assignments/${assignmentId}`,
    `/courses/${courseId}/home`,
    `/courses/${courseId}/modules`,
    `/courses/${courseId}/people`,
  ];
}

function extraCourseIds(html: string, reserved: ReadonlySet<string>): string[] {
  const found = extractCourseIds(html);
  const extras = found.filter((id) => !reserved.has(id.toLowerCase()));
  if (found.length === 0) {
    return FALLBACK_COURSE_IDS.filter((id) => !reserved.has(id.toLowerCase())).slice(
      0,
      EXTRA_COURSE_LIMIT,
    );
  }
  return extras.slice(0, EXTRA_COURSE_LIMIT);
}

function discoveryRank(url: string): number {
  const path = pathnameOf(url);
  if (/\/assignments\/[^/]+$/i.test(path)) return 0;
  if (/\/assignments$/i.test(path)) return 1;
  if (isCourseScreenPath(path)) return 2;
  return 3;
}

function discoveredUrls(origin: string, html: string): string[] {
  const urls: string[] = [];
  for (const href of extractInternalHrefs(html)) {
    const resolved = sameOriginHref(origin, href);
    if (!resolved) continue;
    const path = pathnameOf(resolved);
    if (isLabsPath(path) || isCourseScreenPath(path)) urls.push(resolved);
  }
  return urls.sort((left, right) => discoveryRank(left) - discoveryRank(right));
}

function pathsOnOrigin(origin: string, paths: readonly string[]): string[] {
  return paths.map((path) => urlOnDeployOrigin(origin, path));
}

function followupUrls(
  origin: string,
  html: string,
  exclude: ReadonlySet<string>,
  seedPaths: readonly string[],
  verifyPaths: readonly string[],
  followupCap: number,
): string[] {
  const checklistPaths = checklistFollowupPaths(seedPaths, verifyPaths);
  const required = pathsOnOrigin(origin, withCaseVariants(checklistPaths));

  const extraCanonical: string[] = [];
  const extraVariants: string[] = [];
  for (const courseId of extraCourseIds(html, courseIdsInPaths(checklistPaths))) {
    const assignmentId =
      extractAssignmentIds(html, courseId)[0] ?? DEFAULT_ASSIGNMENT_ID;
    for (const path of canonicalCoursePaths(courseId, assignmentId)) {
      extraCanonical.push(path);
      const variant = caseVariantPath(path);
      if (variant) extraVariants.push(variant);
    }
  }

  const ranked = uniqueUrls([
    ...required,
    ...pathsOnOrigin(origin, extraCanonical),
    ...pathsOnOrigin(origin, extraVariants),
    ...discoveredUrls(origin, html),
  ]).filter((url) => !exclude.has(url));

  const requiredSet = new Set(uniqueUrls(required));
  let requiredKept = 0;
  for (const url of ranked) {
    if (requiredSet.has(url)) requiredKept += 1;
  }
  return ranked.slice(0, Math.max(followupCap, requiredKept));
}

export async function crawlDeploy(input: {
  deployUrl: string;
  getHtml: (url: string) => Promise<HtmlFetchResult>;
  seedPaths: readonly string[];
  verifyPaths: readonly string[];
  followupCap: number;
}): Promise<DeployCorpus | { ok: false; message: string }> {
  const origin = deployOriginFromUrl(input.deployUrl);
  if (!origin.ok) return { ok: false, message: origin.message };

  const seed = seedUrlsForDeploy(input.deployUrl, input.seedPaths);
  const first = await Promise.all(
    seed.map(async (url) => {
      const result = await input.getHtml(url);
      return {
        path: pathnameOf(result.ok ? result.finalUrl : url) || pathnameOf(url),
        url,
        result,
      } satisfies PageSnapshot;
    }),
  );

  const more = followupUrls(
    origin.href,
    successfulHtml(first),
    new Set(seed),
    input.seedPaths,
    input.verifyPaths,
    input.followupCap,
  );
  const second = await Promise.all(
    more.map(async (url) => {
      const result = await input.getHtml(url);
      return {
        path: pathnameOf(result.ok ? result.finalUrl : url) || pathnameOf(url),
        url,
        result,
      } satisfies PageSnapshot;
    }),
  );

  const pages = [...first, ...second];
  return {
    ok: true,
    origin: origin.href,
    pages,
    allHtml: successfulHtml(pages),
    labsHtml: labsHtmlFrom(pages),
  };
}

export async function crawlA1Deploy(input: {
  deployUrl: string;
  getHtml: (url: string) => Promise<HtmlFetchResult>;
}): Promise<DeployCorpus | { ok: false; message: string }> {
  return crawlDeploy({
    deployUrl: input.deployUrl,
    getHtml: input.getHtml,
    seedPaths: A1_SEED_PATHS,
    verifyPaths: Object.values(A1_CHECKER.verifyPaths),
    followupCap: A1_FOLLOWUP_URL_CAP,
  });
}

export function submittedUrlOpens(
  deployUrl: string,
  pages: PageSnapshot[],
): HtmlFetchResult | null {
  const parsed = looksLikeDeployUrl(deployUrl);
  if (!parsed.ok) return null;
  const exact = pages.find((page) => page.url === parsed.href);
  if (exact?.result.ok) return exact.result;

  const home = pages.find((page) => page.path === "/" && page.result.ok);
  if (home) return home.result;
  const labs = pages.find(
    (page) => page.result.ok && isLabsPath(page.path),
  );
  if (labs) return labs.result;
  const anyOk = pages.find((page) => page.result.ok);
  if (anyOk) return anyOk.result;

  return exact?.result ?? pages[0]?.result ?? null;
}
