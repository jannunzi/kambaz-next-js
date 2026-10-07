/**
 * Checker versions stored with every saved check run and shown in the staff
 * export.
 *
 * Bump the rules version whenever a check changes what it passes or fails.
 * A1 history:
 *   v1: rules through Oct 7, 2026 (stored results did not record a version).
 *   v2: wd-* ids are optional (structure fallbacks, "Needs TA review"),
 *       Lab 4/5 links by href, TOC read on /labs/lab1, Assignments list must
 *       contain links, unreachable deploys are "Needs re-check". Before
 *       merge (PR #209 QA): an id counts only with real content, structure
 *       is read on one page (never summed, never the home page), template
 *       boilerplate is ignored, a 404 page fails its items, TA review keeps
 *       points only behind its core item, and the Assignments list needs
 *       at least one assignment link with text (three recommended, never
 *       required). A miss on a page that couldn't
 *       be opened (timeout, 5xx, login wall), including any Lab page, is a
 *       re-check with points kept; it is never graded against other pages.
 */
export const A1_CHECKER_RULES_VERSION = "a1-rules-v2";
export const A2_CHECKER_RULES_VERSION = "a2-rules-v1";
/**
 * A3 history:
 *   v1: structure-only checks (no ids, no fixed text), cross-screen
 *       consistency for Kambaz, path-parameter probes, Needs re-check for
 *       pages that couldn't be opened.
 */
export const A3_CHECKER_RULES_VERSION = "a3-rules-v1";

/** Short commit of the running deployment, when Vercel provides it. */
export function deployedCommit(env: Record<string, string | undefined> = process.env): string {
  return (env.VERCEL_GIT_COMMIT_SHA ?? env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "")
    .trim()
    .slice(0, 7);
}

/** `a1-rules-v2+abc1234` (or just the rules version off Vercel). */
export function checkerVersionLabel(
  rulesVersion: string,
  env: Record<string, string | undefined> = process.env,
): string {
  const commit = deployedCommit(env);
  return commit ? `${rulesVersion}+${commit}` : rulesVersion;
}
