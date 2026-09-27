import { A1_CHECKER } from "./a1-checker";
import { A2_CHECKER } from "./a2-checker";
import { getChecker } from "./checkers";
import type {
  AssignmentCheckProbes,
  AssignmentCheckResult,
} from "./check-types";
import type { NameQuery } from "./names";
import { runChecker } from "./run-checker";

export type {
  AssignmentCheckProbes,
  AssignmentCheckResult,
  HtmlFetchResult,
  UrlProbeResult,
} from "./check-types";

export {
  htmlHasA1LabMarkers,
  htmlHasLabsNavigation,
  htmlHasWdHooks,
} from "./markers";

export { classifyDeployFetch, deployOpenFailureMessage } from "./fetch-classify";

export async function runA1Checks(input: {
  githubUrl?: string;
  vercelUrl: string;
  nameQuery?: NameQuery;
  probes: AssignmentCheckProbes;
}): Promise<AssignmentCheckResult[]> {
  return runChecker(A1_CHECKER, input);
}

export async function runA2Checks(input: {
  githubUrl?: string;
  vercelUrl: string;
  nameQuery?: NameQuery;
  probes: AssignmentCheckProbes;
}): Promise<AssignmentCheckResult[]> {
  return runChecker(A2_CHECKER, input);
}

export async function runConfiguredChecks(
  assignmentId: string,
  input: {
    githubUrl?: string;
    vercelUrl: string;
    nameQuery?: NameQuery;
    probes: AssignmentCheckProbes;
  },
): Promise<AssignmentCheckResult[]> {
  const checker = getChecker(assignmentId);
  if (!checker) return [];
  return runChecker(checker, input);
}

export function latestResultByCriterion(
  results: readonly AssignmentCheckResult[],
): Map<string, AssignmentCheckResult> {
  const map = new Map<string, AssignmentCheckResult>();
  for (const row of results) {
    if (!row.criterionId) continue;
    const existing = map.get(row.criterionId);
    if (!existing) {
      map.set(row.criterionId, row);
      continue;
    }
    if (existing.skipped) {
      map.set(row.criterionId, row);
      continue;
    }
    if (row.skipped) continue;
    if (existing.passed && !row.passed) map.set(row.criterionId, row);
  }
  return map;
}
