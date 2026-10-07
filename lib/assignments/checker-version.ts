/**
 * Checker versions stored with every saved check run and shown in the staff
 * export.
 *
 * Bump the rules version whenever a check changes what it passes or fails.
 * A1 history:
 *   v1: rules through Oct 7, 2026 (stored results did not record a version).
 *   v2: wd-* ids are optional (structure fallbacks, "Needs TA review"),
 *       Lab 4/5 links by href, TOC read on /labs/lab1, Assignments list must
 *       contain links, unreachable deploys are "Needs re-check".
 */
export const A1_CHECKER_RULES_VERSION = "a1-rules-v2";
export const A2_CHECKER_RULES_VERSION = "a2-rules-v1";

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
