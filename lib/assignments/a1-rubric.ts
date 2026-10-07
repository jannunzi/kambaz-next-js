/**
 * A1 auto-check mapping.
 *
 * Auto (ids / headings / delivery probes):
 *   a1-delivery-vercel, a1-delivery-name-section, a1-delivery-github,
 *   a1-delivery-labs-nav, plus every criterion in A1_RUBRIC_AUTO_SPECS.
 * Manual (no extra required id): lab With AI / On your own rows without a
 *   stable extra id — see a1LabManualIds().
 */
import {
  A1_LAB_SPECIAL_AUTO_IDS,
  a1LabAutoSpecs,
  a1LabManualIds,
} from "./a1-lab-exercises";
import type { A1RubricAutoSpec } from "./a1-rubric-types";
import {
  htmlClassTokens,
  htmlHasAllIds,
  htmlHasAllSnippets,
  htmlHasAnchorPath,
  htmlHasAnyId,
  htmlHasHeadingLevels,
  htmlHasId,
  htmlIdContainsTag,
} from "./html";

export type { A1RubricAutoSpec, RubricAutoKind } from "./a1-rubric-types";

const A1_KAMBAZ_AUTO_SPECS: A1RubricAutoSpec[] = [
  {
    criterionId: "a1-kambaz-account",
    groupId: "kambaz",
    label: "Account screens",
    kind: "ids",
    requireAllIds: ["wd-signin-screen"],
    requireAnyIds: ["wd-signup-screen", "wd-profile-screen", "wd-account-navigation"],
    passMessage: "Found Kambaz sign-in and another account screen id.",
    failMessage:
      "The Account screens need a Sign in form with a password field, plus a Sign up or Profile screen.",
  },
  {
    criterionId: "a1-kambaz-dashboard",
    groupId: "kambaz",
    label: "Dashboard",
    kind: "ids",
    requireAllIds: ["wd-dashboard"],
    passMessage: "Found wd-dashboard.",
    failMessage:
      "The Dashboard doesn't link to any courses (/courses/…/home).",
  },
  {
    criterionId: "a1-kambaz-nav",
    groupId: "kambaz",
    label: "Kambaz navigation",
    kind: "ids",
    requireAnyIds: ["wd-kambaz-navigation", "wd-kambaz", "wd-account-link"],
    passMessage: "Found Kambaz navigation ids.",
    failMessage:
      "We couldn't find the Kambaz navigation (links to /dashboard and /account).",
  },
  {
    criterionId: "a1-kambaz-course-nav",
    groupId: "kambaz",
    label: "Course navigation",
    kind: "ids",
    requireAnyIds: [
      "wd-courses-navigation",
      "wd-course-home-link",
      "wd-course-modules-link",
      "wd-course-piazza-link",
    ],
    passMessage: "Found course navigation ids.",
    failMessage:
      "We couldn't find the course navigation (links to the course Home and Modules screens).",
  },
  {
    criterionId: "a1-kambaz-modules",
    groupId: "kambaz",
    label: "Modules",
    kind: "ids",
    requireAnyIds: ["wd-modules", "wd-modules-controls"],
    passMessage: "Found Modules ids.",
    failMessage:
      "The Modules screen doesn't show a list of modules.",
  },
  {
    criterionId: "a1-kambaz-home",
    groupId: "kambaz",
    label: "Course Home",
    kind: "ids",
    requireAnyIds: ["wd-home", "wd-course-status"],
    passMessage: "Found Course Home ids.",
    failMessage:
      "The course Home screen doesn't show the modules or the course status buttons.",
  },
  {
    criterionId: "a1-kambaz-assignments",
    groupId: "kambaz",
    label: "Assignments screen",
    kind: "ids",
    requireAnyIds: ["wd-assignments", "wd-assignment-list"],
    // An empty list is not an Assignments screen: it needs at least one link.
    requireDescendantTagInAnyId: {
      ids: ["wd-assignments", "wd-assignment-list"],
      tag: "a",
    },
    passMessage: "Found the Assignments list with assignment links.",
    failMessage:
      "The Assignments screen needs a list of at least three assignments that each link to /courses/:cid/assignments/:aid.",
  },
  {
    criterionId: "a1-kambaz-editor",
    groupId: "kambaz",
    label: "Assignment Editor",
    kind: "ids",
    requireAnyIds: ["wd-assignments-editor", "wd-name"],
    passMessage: "Found Assignment Editor ids.",
    failMessage:
      "The Assignment Editor needs its form fields (a name field plus a description or dropdowns).",
  },
];

export const A1_MANUAL_CRITERION_IDS = a1LabManualIds();

export const A1_RUBRIC_AUTO_SPECS: A1RubricAutoSpec[] = [
  ...a1LabAutoSpecs(),
  ...A1_KAMBAZ_AUTO_SPECS,
];

export function evaluateRubricSpec(
  spec: A1RubricAutoSpec,
  html: string,
  options?: {
    siteHost?: string;
    /**
     * How an id counts. Default: the id attribute is present. Ids-optional
     * checkers pass a rule that also needs the element's content.
     */
    idPresent?: (html: string, id: string) => boolean;
  },
): { passed: boolean; message: string } {
  if (spec.kind === "manual") {
    return { passed: false, message: spec.failMessage };
  }

  const idPresent = options?.idPresent;
  const missing: string[] = [];
  if (spec.requireAllIds?.length) {
    if (idPresent) missing.push(...spec.requireAllIds.filter((id) => !idPresent(html, id)));
    else missing.push(...htmlHasAllIds(html, spec.requireAllIds).missing);
  }
  if (
    spec.requireAnyIds?.length &&
    !(idPresent
      ? spec.requireAnyIds.some((id) => idPresent(html, id))
      : htmlHasAnyId(html, spec.requireAnyIds))
  ) {
    missing.push(`one of ${spec.requireAnyIds.join(", ")}`);
  }
  if (spec.headingLevels?.length) {
    const headings = htmlHasHeadingLevels(html, spec.headingLevels);
    if (!headings.ok) {
      missing.push(`h${headings.missing.join("/h")}`);
    }
  }
  if (spec.requireHtmlIncludes?.length) {
    const snippets = htmlHasAllSnippets(html, spec.requireHtmlIncludes);
    missing.push(...snippets.missing);
  }
  if (spec.requireAnchorPaths?.length) {
    for (const path of spec.requireAnchorPaths) {
      if (!htmlHasAnchorPath(html, path, options?.siteHost)) {
        missing.push(`a link to ${path}`);
      }
    }
  }
  if (spec.requireClassTokens?.length || spec.requireClassTokenPatterns?.length) {
    const tokens = new Set(htmlClassTokens(html));
    for (const token of spec.requireClassTokens ?? []) {
      if (!tokens.has(token)) missing.push(`class ${token}`);
    }
    for (const rule of spec.requireClassTokenPatterns ?? []) {
      const pattern = new RegExp(rule.pattern);
      if (![...tokens].some((token) => pattern.test(token))) missing.push(rule.label);
    }
  }
  if (spec.requireDescendantTag) {
    const { id, tag } = spec.requireDescendantTag;
    if (!htmlIdContainsTag(html, id, tag)) {
      missing.push(`<${tag}> inside #${id}`);
    }
  }
  if (spec.requireDescendantTagInAnyId) {
    const { ids, tag } = spec.requireDescendantTagInAnyId;
    if (!ids.some((id) => htmlIdContainsTag(html, id, tag))) {
      missing.push(`<${tag}> inside ${ids.map((id) => `#${id}`).join(" or ")}`);
    }
  }

  if (missing.length === 0 && specHasRequirement(spec)) {
    return { passed: true, message: spec.passMessage };
  }
  if (missing.length === 0) {
    return { passed: htmlHasId(html, "wd-lab1"), message: spec.passMessage };
  }
  return {
    passed: false,
    message: `${spec.failMessage} Missing: ${missing.join(", ")}.`,
  };
}

/** True when the spec names at least one thing to look for. */
export function specHasRequirement(spec: A1RubricAutoSpec): boolean {
  return Boolean(
    spec.requireAllIds?.length ||
      spec.requireAnyIds?.length ||
      spec.headingLevels?.length ||
      spec.requireHtmlIncludes?.length ||
      spec.requireAnchorPaths?.length ||
      spec.requireClassTokens?.length ||
      spec.requireClassTokenPatterns?.length ||
      spec.requireDescendantTag ||
      spec.requireDescendantTagInAnyId,
  );
}

/** True when the spec's primary rule depends on wd-* ids. */
export function specUsesIds(spec: A1RubricAutoSpec): boolean {
  return Boolean(
    spec.requireAllIds?.length ||
      spec.requireAnyIds?.length ||
      spec.requireDescendantTag ||
      spec.requireDescendantTagInAnyId,
  );
}

export function isManualA1Criterion(criterionId: string): boolean {
  return A1_MANUAL_CRITERION_IDS.includes(criterionId);
}

const DELIVERY_AUTO_IDS = [
  "a1-delivery-vercel",
  "a1-delivery-name-section",
  "a1-delivery-github",
  ...A1_LAB_SPECIAL_AUTO_IDS,
] as const;

export function a1CriterionCoverage(
  criterionId: string,
): "auto" | "manual" {
  if (isManualA1Criterion(criterionId)) return "manual";
  if (A1_RUBRIC_AUTO_SPECS.some((spec) => spec.criterionId === criterionId)) {
    return "auto";
  }
  if ((DELIVERY_AUTO_IDS as readonly string[]).includes(criterionId)) {
    return "auto";
  }
  return "manual";
}
