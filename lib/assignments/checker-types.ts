import type { A1RubricAutoSpec } from "./a1-rubric-types";
import type { StructureFallback } from "./a1-structure";
import type { IdElement } from "./html";
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
  /** Passes on page structure when the ids are missing. */
  structurePassed?: (labsHtml: string, siteHost?: string) => boolean;
  passMessage: string;
  failMessage: string;
};

/**
 * Per-assignment crawl + grade configuration. A1 and A2 share one runner.
 */
export type AssignmentChecker = {
  assignmentId: AssignmentId;
  /**
   * Version of the grading rules. Bump it whenever a check changes what it
   * passes or fails, so stored results and exports show which rules ran.
   */
  rulesVersion: string;
  /**
   * When true, a missing wd-* id never fails a row by itself: the row falls
   * back to `structureFallbacks` on the page that should hold it, and a row
   * with no fallback becomes "Needs TA review" (points kept) when its
   * `reviewGates` entry allows it.
   */
  idsOptional?: boolean;
  structureFallbacks?: Readonly<Record<string, StructureFallback>>;
  /**
   * Ids-optional checkers: an element found by its wd-* id counts only when
   * this returns true (it holds real content, not an empty div).
   */
  idHasContent?: (id: string, element: IdElement) => boolean;
  /**
   * A "Needs TA review" candidate keeps its points only when at least
   * `minPassed` of `requires` (criterion ids) passed; otherwise it fails.
   * Missing entry: review is always allowed.
   */
  reviewGates?: Readonly<Record<string, { requires: readonly string[]; minPassed: number }>>;
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
     * When set, the first DNS label must match `-git-<branch>` (Vercel
     * truncates labels at 63 characters) and the host must end in `.vercel.app`.
     */
    previewBranch?: string;
    previewHostMessage?: string;
    labsNav: CheckerLabsNav;
    github: {
      criterionId: string;
      groupId: RubricGroupId;
      linkLabel: string;
      linkPassMessage: string;
      linkFailMessage: string;
      /** Passes on page structure when the wd-github id is missing. */
      linkStructurePassed?: (labsHtml: string) => boolean;
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
