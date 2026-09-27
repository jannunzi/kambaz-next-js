import { getCheckerForCriterion } from "./checkers";
import { deployOriginFromUrl, urlOnDeployOrigin } from "./urls";

export { A1_VERIFY_PATHS as A1_CRITERION_VERIFY_PATHS } from "./a1-checker";

/**
 * Path on the student deploy that graders should open for a criterion.
 */
export function criterionVerifyPath(criterionId: string): string | undefined {
  return getCheckerForCriterion(criterionId)?.verifyPaths[criterionId];
}

/** Id fragment for a criterion, without a leading #. */
export function criterionVerifyHash(criterionId: string): string | undefined {
  const hash = getCheckerForCriterion(criterionId)?.verifyHashes[criterionId];
  return hash || undefined;
}

export function criterionVerifyUrl(
  deployUrl: string | undefined,
  criterionId: string,
): string | null {
  if (!deployUrl) return null;
  const origin = deployOriginFromUrl(deployUrl);
  if (!origin.ok) return null;
  const path = criterionVerifyPath(criterionId);
  if (!path) return null;
  const href = urlOnDeployOrigin(origin.href, path);
  const hash = criterionVerifyHash(criterionId);
  return hash ? `${href}#${hash}` : href;
}
