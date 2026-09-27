import type { RubricGroupId } from "./types";

export type RubricAutoKind = "ids" | "headings" | "manual";

export type A1RubricAutoSpec = {
  criterionId: string;
  groupId: RubricGroupId;
  label: string;
  kind: RubricAutoKind;
  /** Which crawled HTML the spec reads. Lab rows default to Labs pages. */
  htmlScope?: "labs" | "all";
  requireAllIds?: string[];
  requireAnyIds?: string[];
  headingLevels?: number[];
  requireHtmlIncludes?: string[];
  passMessage: string;
  failMessage: string;
};
