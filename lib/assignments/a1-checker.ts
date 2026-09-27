import {
  A1_LAB_EXERCISES,
  A1_LAB_SPECIAL_AUTO_IDS,
  a1LabVerifyPaths,
} from "./a1-lab-exercises";
import {
  A1_MANUAL_CRITERION_IDS,
  A1_RUBRIC_AUTO_SPECS,
} from "./a1-rubric";
import type { AssignmentChecker } from "./checker-types";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import { A1_SEED_PATHS } from "./urls";

/**
 * Same follow-up cap as `A1_FOLLOWUP_URL_CAP` in crawl.ts. Kept here so the
 * shared runner and the A1 crawl wrapper stay on one budget.
 */
export const A1_CHECKER_FOLLOWUP_CAP = 16;

const A1_KAMBAZ_VERIFY_HASH: Record<string, string> = {
  "a1-kambaz-account": "wd-signin-screen",
  "a1-kambaz-dashboard": "wd-dashboard",
  "a1-kambaz-modules": "wd-modules",
  "a1-kambaz-home": "wd-home",
  "a1-kambaz-assignments": "wd-assignments",
  "a1-kambaz-editor": "wd-assignments-editor",
};

function a1VerifyHashes(): Record<string, string> {
  const hashes: Record<string, string> = { ...A1_KAMBAZ_VERIFY_HASH };
  for (const exercise of A1_LAB_EXERCISES) {
    const explicit = exercise.verifyHash?.replace(/^#/, "").trim();
    if (explicit) {
      hashes[exercise.id] = explicit;
      continue;
    }
    const fromCheck = exercise.auto?.requireAllIds?.[0]?.trim();
    if (fromCheck) hashes[exercise.id] = fromCheck;
  }
  return hashes;
}

/** Insertion order is the A1 crawl follow-up order. Do not reorder. */
export const A1_VERIFY_PATHS: Record<string, string> = {
  "a1-delivery-vercel": "/",
  "a1-delivery-name-section": "/labs",
  "a1-delivery-github": "/labs",
  ...a1LabVerifyPaths(),
  "a1-kambaz-account": "/account/signin",
  "a1-kambaz-dashboard": "/dashboard",
  "a1-kambaz-nav": "/dashboard",
  "a1-kambaz-course-nav": "/courses/1234/home",
  "a1-kambaz-modules": "/courses/1234/modules",
  "a1-kambaz-home": "/courses/1234/home",
  "a1-kambaz-assignments": "/courses/1234/assignments",
  "a1-kambaz-editor": "/courses/1234/assignments/123",
};

const manualIds = new Set<string>(A1_MANUAL_CRITERION_IDS);

const autoIds = new Set<string>([
  "a1-delivery-vercel",
  "a1-delivery-name-section",
  "a1-delivery-github",
  ...A1_LAB_SPECIAL_AUTO_IDS,
  ...A1_RUBRIC_AUTO_SPECS.map((spec) => spec.criterionId),
]);
for (const id of manualIds) autoIds.delete(id);

export const A1_CHECKER: AssignmentChecker = {
  assignmentId: "a1",
  seedPaths: A1_SEED_PATHS,
  followupCap: A1_CHECKER_FOLLOWUP_CAP,
  verifyPaths: A1_VERIFY_PATHS,
  verifyHashes: a1VerifyHashes(),
  autoSpecs: A1_RUBRIC_AUTO_SPECS,
  autoIds,
  manualIds,
  manualRows: A1_LAB_EXERCISES.filter(
    (exercise) =>
      !exercise.auto &&
      !(A1_LAB_SPECIAL_AUTO_IDS as readonly string[]).includes(exercise.id),
  ).map((exercise) => ({
    id: exercise.id,
    label: exercise.label,
    groupId: "lab",
  })),
  delivery: {
    vercelCriterionId: "a1-delivery-vercel",
    labsNav: {
      criterionId: "a1-delivery-labs-nav",
      groupId: "lab",
      label: "Labs navigation",
      anyIds: ["wd-lab1-link", "wd-labs", "wd-kambaz-link", "wd-home-link"],
      passMessage: ASSIGNMENT_STUDENT_COPY.labsOk,
      failMessage: ASSIGNMENT_STUDENT_COPY.labsMissing,
    },
    github: {
      criterionId: "a1-delivery-github",
      groupId: "delivery",
      linkLabel: "GitHub link on Labs",
      linkPassMessage: "Found a wd-github link on Labs.",
      linkFailMessage: "Add a public repo link with id wd-github on Labs.",
    },
    name: {
      criterionId: "a1-delivery-name-section",
      groupId: "delivery",
      label: "Name and section",
    },
  },
};
