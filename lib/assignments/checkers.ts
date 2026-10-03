import { A1_CHECKER } from "./a1-checker";
import { A2_CHECKER } from "./a2-checker";
import type { AssignmentChecker } from "./checker-types";

const CHECKERS: readonly AssignmentChecker[] = [A1_CHECKER, A2_CHECKER];

export function getChecker(assignmentId: string): AssignmentChecker | undefined {
  return CHECKERS.find((checker) => checker.assignmentId === assignmentId);
}

export function getCheckerForCriterion(
  criterionId: string,
): AssignmentChecker | undefined {
  return CHECKERS.find((checker) =>
    Object.prototype.hasOwnProperty.call(checker.verifyPaths, criterionId),
  );
}

export function criterionCoverage(
  assignmentId: string,
  criterionId: string,
): "auto" | "manual" {
  const checker = getChecker(assignmentId);
  if (!checker) return "manual";
  if (checker.manualIds.has(criterionId)) return "manual";
  if (checker.autoIds.has(criterionId)) return "auto";
  return "manual";
}
