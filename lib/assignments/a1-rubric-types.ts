import type { RubricGroupId } from "./types";

/**
 * "structure": judged only by the checker's own structure rules
 * (`AssignmentChecker.judgeAutoSpecs`, used by A2); the spec never reads ids.
 */
export type RubricAutoKind = "ids" | "headings" | "manual" | "structure";

export type A1RubricAutoSpec = {
  criterionId: string;
  groupId: RubricGroupId;
  label: string;
  kind: RubricAutoKind;
  /** Which crawled HTML the spec reads. Lab rows default to Labs pages. */
  htmlScope?: "labs" | "all";
  /**
   * When set, only this pathname is read. A missing page or a non-OK
   * response (including 404) fails the row. Not mixed with other Labs HTML.
   */
  pagePath?: string;
  requireAllIds?: string[];
  requireAnyIds?: string[];
  headingLevels?: number[];
  requireHtmlIncludes?: string[];
  /** Anchor href pathnames that must all be present (relative or absolute). */
  requireAnchorPaths?: string[];
  /** Exact class/className tokens. `ms-40` does not satisfy `ms-4`. */
  requireClassTokens?: string[];
  /** Whole-token patterns, for example `^grid-cols-.+$`. */
  requireClassTokenPatterns?: { label: string; pattern: string }[];
  /** A start tag that must appear inside the element with this id. */
  requireDescendantTag?: { id: string; tag: string };
  /** A start tag that must appear inside an element with any of these ids. */
  requireDescendantTagInAnyId?: { ids: string[]; tag: string };
  passMessage: string;
  failMessage: string;
};
