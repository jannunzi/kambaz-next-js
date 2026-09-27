import { A2_RUBRIC } from "./a2";
import type { A1RubricAutoSpec } from "./a1-rubric-types";
import type { AssignmentChecker } from "./checker-types";
/**
 * Same follow-up budget as A1. Seeds already include the A2 checklist
 * screens; follow-ups cover a second course id when the dashboard uses one.
 */
export const A2_CHECKER_FOLLOWUP_CAP = 16;

export const A2_SEED_PATHS = [
  "/",
  "/labs",
  "/labs/lab2",
  "/labs/lab2/tailwind",
  "/account/signin",
  "/dashboard",
  "/courses/1234/home",
  "/courses/1234/modules",
  "/courses/1234/people/table",
  "/courses/1234/assignments",
  "/courses/1234/assignments/123",
] as const;

export const A2_VERIFY_PATHS: Record<string, string> = {
  "a2-delivery-branch": "/",
  "a2-delivery-vercel": "/",
  "a2-delivery-name-github": "/labs",
  "a2-delivery-labs-nav": "/labs",
  "a2-lab-page": "/labs/lab2",
  "a2-lab-selectors": "/labs/lab2",
  "a2-lab-box-model": "/labs/lab2",
  "a2-lab-layout": "/labs/lab2",
  "a2-lab-icons": "/labs/lab2",
  "a2-lab-tailwind": "/labs/lab2/tailwind",
  "a2-kambaz-nav": "/dashboard",
  "a2-kambaz-dashboard": "/dashboard",
  "a2-kambaz-course-nav": "/courses/1234/home",
  "a2-kambaz-modules": "/courses/1234/modules",
  "a2-kambaz-home": "/courses/1234/home",
  "a2-kambaz-people": "/courses/1234/people/table",
  "a2-kambaz-assignments": "/courses/1234/assignments",
  "a2-kambaz-editor": "/courses/1234/assignments/123",
  "a2-kambaz-account": "/account/signin",
};

export const A2_VERIFY_HASHES: Record<string, string> = {
  "a2-delivery-name-github": "wd-github",
  "a2-lab-page": "wd-lab2",
  "a2-lab-selectors": "wd-css-id-selectors",
  "a2-lab-box-model": "wd-css-colors",
  "a2-lab-layout": "wd-css-positions",
  "a2-lab-icons": "wd-react-icons-sampler",
  "a2-lab-tailwind": "wd-tailwind-grid-system",
  "a2-kambaz-nav": "wd-kambaz-navigation",
  "a2-kambaz-dashboard": "wd-dashboard",
  "a2-kambaz-course-nav": "wd-courses-navigation",
  "a2-kambaz-modules": "wd-modules",
  "a2-kambaz-home": "wd-home",
  "a2-kambaz-people": "wd-people-table",
  "a2-kambaz-assignments": "wd-assignments",
  "a2-kambaz-editor": "wd-assignments-editor",
  "a2-kambaz-account": "wd-signin-screen",
};

const A2_LAB_SPECS: A1RubricAutoSpec[] = [
  {
    criterionId: "a2-lab-page",
    groupId: "lab",
    label: "Lab 2 page and CSS file",
    kind: "ids",
    htmlScope: "labs",
    requireAllIds: ["wd-lab2"],
    requireAnchorPaths: ["/labs/lab2"],
    passMessage: "Found the Lab 2 page (wd-lab2) and a link to /labs/lab2.",
    failMessage:
      "Lab 2 needs id wd-lab2 on /labs/lab2 and a Labs index or TOC link to /labs/lab2.",
  },
  {
    criterionId: "a2-lab-selectors",
    groupId: "lab",
    label: "Selectors",
    kind: "ids",
    htmlScope: "labs",
    requireAllIds: [
      "wd-css-id-selectors",
      "wd-id-selector-1",
      "wd-id-selector-2",
      "wd-css-class-selectors",
      "wd-css-document-structure",
    ],
    requireHtmlIncludes: ["wd-class-selector", "wd-selector-1"],
    passMessage: "Found the id, class, and document-structure selector samples.",
    failMessage:
      "Lab 2 should include the id, class, and document-structure selector samples from §2.1.1–§2.1.5.",
  },
  {
    criterionId: "a2-lab-box-model",
    groupId: "lab",
    label: "Color, border, and box model",
    kind: "ids",
    htmlScope: "labs",
    requireAllIds: [
      "wd-css-colors",
      "wd-css-background-colors",
      "wd-css-borders",
      "wd-css-paddings",
      "wd-css-margins",
      "wd-css-box-model",
      "wd-css-corners",
      "wd-css-dimensions",
      "wd-css-display",
    ],
    passMessage: "Found the color, border, spacing, and box-model samples.",
    failMessage:
      "Lab 2 should include the color, background, border, padding, margin, box model, corner, dimension, and display samples.",
  },
  {
    criterionId: "a2-lab-layout",
    groupId: "lab",
    label: "Position, float, flex, and media queries",
    kind: "ids",
    htmlScope: "labs",
    requireAllIds: [
      "wd-css-positions",
      "wd-css-position-relative",
      "wd-css-position-absolute",
      "wd-css-position-fixed",
      "wd-z-index",
      "wd-float-divs",
      "wd-css-grid-layout",
      "wd-css-flex",
    ],
    requireHtmlIncludes: ["wd-media-queries-demo"],
    passMessage: "Found the position, float, grid, flex, and media-query samples.",
    failMessage:
      "Lab 2 should include the position, z-index, float, grid, flex, and media-query samples (class wd-media-queries-demo).",
  },
  {
    criterionId: "a2-lab-icons",
    groupId: "lab",
    label: "React Icons",
    kind: "ids",
    htmlScope: "labs",
    requireAllIds: ["wd-react-icons-sampler"],
    requireDescendantTag: { id: "wd-react-icons-sampler", tag: "svg" },
    passMessage: "Found wd-react-icons-sampler with an icon svg.",
    failMessage:
      "Import ReactIconsSampler on Lab 2 with id wd-react-icons-sampler and at least one icon svg inside it.",
  },
  {
    criterionId: "a2-lab-tailwind",
    groupId: "lab",
    label: "Tailwind samples",
    kind: "ids",
    pagePath: "/labs/lab2/tailwind",
    requireAllIds: ["wd-tailwind-grid-system"],
    requireClassTokens: ["ms-4", "font-thin", "bg-red-500", "md:flex", "blur-lg", "grid"],
    requireClassTokenPatterns: [{ label: "grid-cols-*", pattern: "^grid-cols-.+$" }],
    passMessage: "Found the Tailwind spacing, type, color, responsive, filter, and grid samples.",
    failMessage:
      "Add the Tailwind samples on /labs/lab2/tailwind, including wd-tailwind-grid-system and the spacing, type, color, responsive, filter, and grid classes from §2.3.",
  },
];

const kambazCriteria =
  A2_RUBRIC.groups.find((group) => group.id === "kambaz")?.criteria ?? [];

const manualIds = new Set(kambazCriteria.map((row) => row.id));

const autoIds = new Set<string>([
  "a2-delivery-branch",
  "a2-delivery-vercel",
  "a2-delivery-name-github",
  "a2-delivery-labs-nav",
  ...A2_LAB_SPECS.map((spec) => spec.criterionId),
]);

export const A2_CHECKER: AssignmentChecker = {
  assignmentId: "a2",
  seedPaths: A2_SEED_PATHS,
  followupCap: A2_CHECKER_FOLLOWUP_CAP,
  extraCourseScreens: ["people/table"],
  verifyPaths: A2_VERIFY_PATHS,
  verifyHashes: A2_VERIFY_HASHES,
  autoSpecs: A2_LAB_SPECS,
  autoIds,
  manualIds,
  manualRows: kambazCriteria.map((row) => ({
    id: row.id,
    label: row.label,
    groupId: "kambaz" as const,
  })),
  delivery: {
    vercelCriterionId: "a2-delivery-vercel",
    previewHostIncludes: "-git-a2-",
    previewHostMessage:
      "Submit the a2 branch preview URL. Its hostname contains -git-a2- (for example https://your-app-git-a2-yourname.vercel.app), not the main deployment.",
    labsNav: {
      criterionId: "a2-delivery-labs-nav",
      groupId: "delivery",
      label: "Labs still listed",
      allIds: ["wd-kambaz-link"],
      allHrefs: ["/labs/lab1", "/labs/lab2"],
      passMessage: "Found links to Lab 1, Lab 2, and Kambaz on Labs.",
      failMessage:
        "Labs should still link /labs/lab1, /labs/lab2, and Kambaz (wd-kambaz-link).",
    },
    github: {
      criterionId: "a2-delivery-name-github",
      groupId: "delivery",
      linkLabel: "GitHub link on Labs",
      linkPassMessage: "Found a wd-github link on Labs.",
      linkFailMessage: "Add a public repo link with id wd-github on Labs.",
    },
    name: {
      criterionId: "a2-delivery-name-github",
      groupId: "delivery",
      label: "Name and GitHub link",
    },
    branch: {
      criterionId: "a2-delivery-branch",
      groupId: "delivery",
      label: "a2 GitHub branch",
      branch: "a2",
      missingMessage:
        "Submit the GitHub URL for your a2 branch, for example https://github.com/you/webdev-client/tree/a2.",
      wrongBranchMessage:
        "Point the GitHub URL at the a2 branch (…/tree/a2), not the repository root or another branch.",
      notFoundMessage:
        "GitHub returned HTTP 404 for /tree/a2. Push a public a2 branch and submit https://github.com/you/webdev-client/tree/a2.",
      passMessage: "GitHub /tree/a2 loaded (HTTP 200).",
    },
  },
};

export function a2CriterionCoverage(criterionId: string): "auto" | "manual" {
  if (manualIds.has(criterionId)) return "manual";
  if (autoIds.has(criterionId)) return "auto";
  return "manual";
}
