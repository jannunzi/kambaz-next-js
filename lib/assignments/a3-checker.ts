import { A3_RUBRIC } from "./a3";
import type { A1RubricAutoSpec } from "./a1-rubric-types";
import {
  A3_STRUCTURE_FALLBACKS,
  a3IdHasContent,
  a3GithubLinkStructurePassed,
  a3LabsNavStructurePassed,
} from "./a3-structure";
import type { AssignmentChecker } from "./checker-types";
import { A3_CHECKER_RULES_VERSION } from "./checker-version";

/**
 * Follow-ups after the seeds: two more course ids from the Dashboard (four
 * canonical screens + People each, with case variants), then editor links
 * found on the Assignments screens.
 */
export const A3_CHECKER_FOLLOWUP_CAP = 24;

/**
 * Seeds cover every A3 screen for the reference data (RS101, RS102) plus the
 * two path-parameter probes. Renamed course ids are found on the Dashboard.
 */
export const A3_SEED_PATHS = [
  "/",
  "/labs",
  "/labs/lab1",
  "/labs/lab2",
  "/labs/lab3",
  "/labs/lab3/add/12/30",
  "/labs/lab3/add/7/8",
  "/dashboard",
  "/courses/RS101/home",
  "/courses/RS101/modules",
  "/courses/RS101/assignments",
  "/courses/RS101/assignments/A101",
  "/courses/RS101/assignments/A102",
  "/courses/RS101/people/table",
  "/courses/RS102/home",
  "/courses/RS102/modules",
  "/courses/RS102/assignments",
  "/courses/RS102/people/table",
] as const;

/** Where staff open each item. A3 links never carry an element id. */
export const A3_VERIFY_PATHS: Record<string, string> = {
  "a3-delivery-branch": "/",
  "a3-delivery-vercel": "/",
  "a3-delivery-name-github": "/labs",
  "a3-delivery-labs-nav": "/labs",
  "a3-lab-page": "/labs/lab3",
  "a3-lab-json": "/labs/lab3",
  "a3-lab-imports-table": "/labs/lab3",
  "a3-lab-styles": "/labs/lab3",
  "a3-lab-classes": "/labs/lab3",
  "a3-lab-client-server": "/labs/lab3",
  "a3-lab-toc-highlight": "/labs/lab3",
  "a3-lab-path-params": "/labs/lab3/add/12/30",
  "a3-lab-todos": "/labs/lab3",
  "a3-kambaz-nav": "/dashboard",
  "a3-kambaz-dashboard": "/dashboard",
  "a3-kambaz-courses": "/courses/RS101/home",
  "a3-kambaz-course-nav": "/courses/RS101/home",
  "a3-kambaz-breadcrumb": "/courses/RS101/modules",
  "a3-kambaz-modules": "/courses/RS101/modules",
  "a3-kambaz-assignments": "/courses/RS101/assignments",
  "a3-kambaz-editor": "/courses/RS101/assignments/A101",
  "a3-kambaz-people": "/courses/RS101/people/table",
};

const DELIVERY_ROWS = new Set([
  "a3-delivery-branch",
  "a3-delivery-vercel",
  "a3-delivery-name-github",
  "a3-delivery-labs-nav",
]);

/** One structure-only spec per Lab and Kambaz item (no ids, no fixed text). */
export const A3_AUTO_SPECS: A1RubricAutoSpec[] = A3_RUBRIC.groups.flatMap((group) => group.criteria)
  .filter((row) => !DELIVERY_ROWS.has(row.id))
  .map((row) => {
    const groupId = row.id.startsWith("a3-lab-") ? ("lab" as const) : ("kambaz" as const);
    const fallback = A3_STRUCTURE_FALLBACKS[row.id];
    if (!fallback) throw new Error(`A3 item ${row.id} has no structure check`);
    return {
      criterionId: row.id,
      groupId,
      label: row.label,
      kind: "headings" as const,
      passMessage: `Found ${fallback.looksFor}.`,
      failMessage: fallback.missMessage,
    };
  });

/**
 * "Needs TA review" keeps points only behind real work: the editor needs a
 * passing Assignments list, and the course heading needs a passing Dashboard.
 */
export const A3_REVIEW_GATES: Record<string, { requires: string[]; minPassed: number }> = {
  "a3-kambaz-editor": { requires: ["a3-kambaz-assignments"], minPassed: 1 },
  "a3-kambaz-courses": { requires: ["a3-kambaz-dashboard"], minPassed: 1 },
  "a3-kambaz-nav": { requires: ["a3-kambaz-dashboard"], minPassed: 1 },
  "a3-kambaz-course-nav": { requires: ["a3-kambaz-dashboard"], minPassed: 1 },
  "a3-kambaz-breadcrumb": { requires: ["a3-kambaz-dashboard"], minPassed: 1 },
  "a3-lab-toc-highlight": { requires: ["a3-lab-page"], minPassed: 1 },
  "a3-lab-path-params": { requires: ["a3-lab-page"], minPassed: 1 },
};

const autoIds = new Set<string>([...DELIVERY_ROWS, ...A3_AUTO_SPECS.map((spec) => spec.criterionId)]);

export const A3_CHECKER: AssignmentChecker = {
  assignmentId: "a3",
  rulesVersion: A3_CHECKER_RULES_VERSION,
  idsOptional: true,
  structureFallbacks: A3_STRUCTURE_FALLBACKS,
  idHasContent: a3IdHasContent,
  reviewGates: A3_REVIEW_GATES,
  seedPaths: A3_SEED_PATHS,
  followupCap: A3_CHECKER_FOLLOWUP_CAP,
  extraCourseScreens: ["people/table"],
  verifyPaths: A3_VERIFY_PATHS,
  verifyHashes: {},
  autoSpecs: A3_AUTO_SPECS,
  autoIds,
  manualIds: new Set<string>(),
  manualRows: [],
  delivery: {
    vercelCriterionId: "a3-delivery-vercel",
    previewBranch: "a3",
    previewHostMessage:
      "Submit the a3 branch preview on Vercel. The first hostname label must include -git-a3- or end in -git-a3 (Vercel cuts labels after 63 characters), and the host must end in .vercel.app. Staff can override this at grading.",
    labsNav: {
      criterionId: "a3-delivery-labs-nav",
      groupId: "delivery",
      label: "Labs links",
      anyIds: ["wd-kambaz-link"],
      allHrefs: ["/labs/lab1", "/labs/lab2", "/labs/lab3"],
      structurePassed: a3LabsNavStructurePassed,
      passMessage: "Found links to Lab 1, Lab 2, Lab 3, and Kambaz on the Labs pages.",
      failMessage:
        "The Labs pages should link to /labs/lab1, /labs/lab2, /labs/lab3, and to your Kambaz screens.",
    },
    github: {
      criterionId: "a3-delivery-name-github",
      groupId: "delivery",
      linkLabel: "GitHub link on Labs",
      linkPassMessage: "Found a link to your GitHub repository on the Labs pages.",
      linkFailMessage:
        "We couldn't find a link to your GitHub repository (https://github.com/<you>/<repo>) on the Labs pages.",
      linkStructurePassed: a3GithubLinkStructurePassed,
    },
    name: {
      criterionId: "a3-delivery-name-github",
      groupId: "delivery",
      label: "Name on Labs",
    },
    branch: {
      criterionId: "a3-delivery-branch",
      groupId: "delivery",
      label: "a3 GitHub branch",
      branch: "a3",
      missingMessage:
        "Submit the GitHub URL for your a3 branch, for example https://github.com/you/webdev-client/tree/a3.",
      wrongBranchMessage:
        "Point the GitHub URL at the a3 branch (…/tree/a3), not the repository root or another branch.",
      notFoundMessage:
        "GitHub returned HTTP 404 for /tree/a3. Push a public a3 branch and submit https://github.com/you/webdev-client/tree/a3.",
      passMessage: "GitHub /tree/a3 loaded (HTTP 200).",
    },
  },
};
