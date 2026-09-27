import type { A1RubricAutoSpec } from "./a1-rubric-types";
import type { AssignmentId, RubricGroupId } from "./types";

export type CheckerManualRow = {
  id: string;
  label: string;
  groupId: RubricGroupId;
};

export type CheckerLabsNav = {
  criterionId: string;
  groupId: RubricGroupId;
  label: string;
  /** Every id must be present. */
  allIds?: readonly string[];
  /** At least one id must be present. */
  anyIds?: readonly string[];
  /** Anchor href pathnames that must all be present. */
  allHrefs?: readonly string[];
  passMessage: string;
  failMessage: string;
};

/**
 * Per-assignment crawl + grade configuration. A1 and A2 share one runner.
 */
export type AssignmentChecker = {
  assignmentId: AssignmentId;
  seedPaths: readonly string[];
  followupCap: number;
  /**
   * Extra screens under /courses/:id/ fetched for course ids discovered
   * on the deploy. A1 omits this so its crawl stays unchanged.
   */
  extraCourseScreens?: readonly string[];
  verifyPaths: Record<string, string>;
  /** Element id fragment, without a leading #. Omitted means path only. */
  verifyHashes: Record<string, string>;
  autoSpecs: readonly A1RubricAutoSpec[];
  autoIds: ReadonlySet<string>;
  manualIds: ReadonlySet<string>;
  manualRows: readonly CheckerManualRow[];
  delivery: {
    vercelCriterionId: string;
    /**
     * When set, the deployment hostname must contain this substring
     * (Vercel branch previews look like `…-git-a2-…`).
     */
    previewHostIncludes?: string;
    previewHostMessage?: string;
    labsNav: CheckerLabsNav;
    github: {
      criterionId: string;
      groupId: RubricGroupId;
      linkLabel: string;
      linkPassMessage: string;
      linkFailMessage: string;
    };
    name?: {
      criterionId: string;
      groupId: RubricGroupId;
      label: string;
    };
    /**
     * When set, the submitted GitHub URL must point at this branch
     * (`/tree/<branch>` or `/commits/<branch>`).
     */
    branch?: {
      criterionId: string;
      groupId: RubricGroupId;
      label: string;
      branch: string;
      missingMessage: string;
      wrongBranchMessage: string;
      /** Shown when /tree/<branch> responds 404. */
      notFoundMessage: string;
      passMessage: string;
    };
  };
};
