import { A2_RUBRIC } from "./a2";
import type { A1RubricAutoSpec } from "./a1-rubric-types";
import { judgeA2Labs } from "./a2-judge";
import { a2GithubLinkPassed, a2LabsNavPassed } from "./a2-structure";
import type { AssignmentChecker } from "./checker-types";
import { A2_CHECKER_RULES_VERSION } from "./checker-version";
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

/**
 * Jump links for staff opening a row on the deploy (the browser simply
 * stays at the top when an id is missing). Never used for grading.
 */
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

/**
 * A2 lab rows. Ids are never read: `judgeA2Labs` grades what the CSS does
 * on /labs/lab2 and /labs/lab2/tailwind (see a2-structure.ts). These specs
 * only name the rows; the messages are the fallbacks staff see if a row was
 * not judged.
 */
const A2_LAB_SPECS: A1RubricAutoSpec[] = [
  {
    criterionId: "a2-lab-page",
    groupId: "lab",
    label: "Lab 2 page and CSS file",
    kind: "structure",
    pagePath: "/labs/lab2",
    passMessage: "Found your Lab 2 page at /labs/lab2, styled by your Lab 2 stylesheet.",
    failMessage: "Create the Lab 2 page at /labs/lab2 and import its CSS file (§2.1).",
  },
  {
    criterionId: "a2-lab-selectors",
    groupId: "lab",
    label: "Selectors",
    kind: "structure",
    pagePath: "/labs/lab2",
    passMessage: "Found the ID, class, and document-structure selector samples.",
    failMessage:
      "Lab 2 should include the ID, class, and document-structure selector samples from §2.1.3–§2.1.5.",
  },
  {
    criterionId: "a2-lab-box-model",
    groupId: "lab",
    label: "Color, border, and box model",
    kind: "structure",
    pagePath: "/labs/lab2",
    passMessage: "Found the color, border, spacing, and box-model samples.",
    failMessage:
      "Lab 2 should include the color, background, border, padding, margin, box model, corner, dimension, and display samples (§2.1.7–§2.1.12).",
  },
  {
    criterionId: "a2-lab-layout",
    groupId: "lab",
    label: "Position, float, flex, and media queries",
    kind: "structure",
    pagePath: "/labs/lab2",
    passMessage: "Found the position, z-index, float, grid, flex, and media-query samples.",
    failMessage:
      "Lab 2 should include the position, z-index, float, grid, flex, and media-query samples (§2.1.13–§2.1.20).",
  },
  {
    criterionId: "a2-lab-icons",
    groupId: "lab",
    label: "React Icons",
    kind: "structure",
    pagePath: "/labs/lab2",
    passMessage: "Found React icons on Lab 2.",
    failMessage: "Import ReactIconsSampler on Lab 2 so at least one React icon shows (§2.2).",
  },
  {
    criterionId: "a2-lab-tailwind",
    groupId: "lab",
    label: "Tailwind samples",
    kind: "structure",
    pagePath: "/labs/lab2/tailwind",
    passMessage: "Found the Tailwind spacing, type, color, responsive, filter, and grid samples.",
    failMessage:
      "Add the Tailwind samples on /labs/lab2/tailwind: spacing, typography, background colors, responsive prefixes, filters, and grids (§2.3).",
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
  rulesVersion: A2_CHECKER_RULES_VERSION,
  // Jose's rule: students still add wd-* ids, but a missing id never costs
  // points. A2 reads no ids at all: lab rows are judged from the compiled
  // CSS and page structure (judgeA2Labs), delivery rows from links.
  idsOptional: true,
  idHasContent: () => false,
  judgeAutoSpecs: judgeA2Labs,
  reviewGates: {
    // A sample built differently from the book (or the ID-selector sample
    // when no element carries the ids) keeps its points for a TA only when
    // the Lab 2 page itself is real: content styled by a Lab 2 stylesheet.
    "a2-lab-selectors": { requires: ["a2-lab-page"], minPassed: 1 },
    "a2-lab-box-model": { requires: ["a2-lab-page"], minPassed: 1 },
    "a2-lab-layout": { requires: ["a2-lab-page"], minPassed: 1 },
  },
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
    previewBranch: "a2",
    previewHostMessage:
      "Submit the a2 branch preview on Vercel. The first hostname label must include -git-a2- or end in -git-a2 (Vercel cuts labels after 63 characters), and the host must end in .vercel.app. Staff can override this at grading.",
    labsContent: {
      label: "Deployment shows your Labs",
      passMessage: "The deployment shows your own Labs pages.",
      failMessage:
        "The deployment doesn't show your Labs pages (only the create-next-app starter or \"not found\" pages). Push your a2 work and submit that branch's Vercel URL.",
    },
    labsNav: {
      criterionId: "a2-delivery-labs-nav",
      groupId: "delivery",
      label: "Labs still listed",
      test: a2LabsNavPassed,
      passMessage: "Found links to Lab 1, Lab 2, and Kambaz on Labs.",
      failMessage:
        "Labs (the TOC or the Labs page) should still link Lab 1 (/labs/lab1), Lab 2 (/labs/lab2), and Kambaz (a page outside /labs, such as /account/signin).",
    },
    github: {
      criterionId: "a2-delivery-name-github",
      groupId: "delivery",
      linkLabel: "GitHub link on Labs",
      linkPassMessage: "Found a link to your GitHub repository on Labs.",
      linkFailMessage: "Add a link to your public GitHub repository (https://github.com/you/webdev-client) on Labs.",
      linkStructurePassed: a2GithubLinkPassed,
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
