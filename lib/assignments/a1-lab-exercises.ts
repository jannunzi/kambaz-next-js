/**
 * Shared Lab 1 exercise catalog for A1 and book §1.3.12.
 *
 * Nested by Lab section (1.3.1–1.3.11): one parent per section
 * (HeadingTags, …) with lettered sub-tasks a/b/c — Lab component,
 * On your own, With AI. A1's Lab checklist and the §1.3.12 recap
 * both render this tree so the lists stay in parity.
 */
import type { RubricCriterion } from "./types";
import type { A1RubricAutoSpec } from "./a1-rubric-types";

export type LabExerciseKind = "core" | "oyo" | "ai";

export const LAB_EXERCISE_KIND_LABELS = {
  core: "Lab component",
  oyo: "On your own",
  ai: "With AI",
} as const;

export type A1LabExerciseAuto = {
  kind: "ids" | "headings";
  requireAllIds?: string[];
  requireAnyIds?: string[];
  headingLevels?: number[];
  requireHtmlIncludes?: string[];
  /** Anchor href pathnames that must all be present (relative or absolute). */
  requireAnchorPaths?: string[];
  /**
   * Read only this page (for example `/labs/lab1`) instead of every Labs
   * page joined together.
   */
  pagePath?: string;
  passMessage: string;
  failMessage: string;
};

/** One a/b/c sub-task under a Lab section parent. */
export type A1LabExerciseTask = {
  id: string;
  kind: LabExerciseKind;
  description: string;
  points: number;
  /** Present when auto-check can look at Lab HTML. Omitted = manual. */
  auto?: A1LabExerciseAuto;
  /**
   * Element id to scroll to on the student deploy. Use this when the
   * section wrapper is a better target than the first requireAllIds entry,
   * or when the check has no requireAllIds.
   */
  verifyHash?: string;
};

/** One top-level Lab section (HeadingTags, …) with nested a/b/c tasks. */
export type A1LabExerciseSection = {
  section: string;
  label: string;
  verifyPath: string;
  tasks: readonly A1LabExerciseTask[];
};

export type A1LabExercise = A1LabExerciseTask & {
  section: string;
  parentLabel: string;
  verifyPath: string;
  label: string;
};

export const A1_LAB_EXERCISE_SECTIONS: readonly A1LabExerciseSection[] = [
  {
    section: "1.3.1",
    label: "HeadingTags",
    verifyPath: "/labs/lab1",
    tasks: [
      {
        id: "a1-lab-heading-tags",
        kind: "core",
        description:
          "Create HeadingTags.tsx from the book sample (h4 \"Heading Tags\" and its paragraph). Before With AI, add h1–h6 as practice without erasing that sample text, and import the component on the Lab 1 page.",
        points: 3,
        auto: {
          kind: "headings",
          requireAllIds: ["wd-h-tag"],
          headingLevels: [1, 2, 3, 4, 5, 6],
          passMessage: "Found wd-h-tag and practice headings h1–h6.",
          failMessage:
            "Lab 1 doesn't show the h1–h6 headings you add as practice (on top of the Heading Tags sample) yet.",
        },
      },
      {
        id: "a1-lab-heading-tags-oyo",
        kind: "oyo",
        description:
          "Personal heading under wd-your-heading, including a span with id wd-your-span.",
        points: 2,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-your-heading", "wd-your-span"],
          passMessage: "Found wd-your-heading and wd-your-span.",
          failMessage:
            "We couldn't find your personal heading with a span inside it on Lab 1.",
        },
      },
      {
        id: "a1-lab-heading-tags-ai",
        kind: "ai",
        description:
          "After the practice h1–h6 headings you added, add a sample outline with id wd-ai-headings (h4 Lab notes, h5 What I built, h6 Next step). Keep the book sample text.",
        points: 2,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-ai-headings"],
          passMessage: "Found wd-ai-headings.",
          failMessage:
            "We couldn't find the With AI sample outline (h4 Lab notes, h5 What I built, h6 Next step) on Lab 1.",
        },
      },
    ],
  },
  {
    section: "1.3.2",
    label: "ParagraphTag",
    verifyPath: "/labs/lab1",
    tasks: [
      {
        id: "a1-lab-paragraph",
        kind: "core",
        description:
          "Create ParagraphTag.tsx and wrap sample text in paragraph tags for vertical spacing.",
        points: 3,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-p-tag"],
          requireAnyIds: ["wd-p-1", "wd-p-2"],
          passMessage: "Found paragraph sample ids on Lab 1.",
          failMessage:
            "Lab 1 doesn't have the Paragraph Tag sample paragraphs yet.",
        },
      },
      {
        id: "a1-lab-paragraph-oyo",
        kind: "oyo",
        description: "Two personal paragraphs with ids wd-p-your-1 and wd-p-your-2.",
        points: 2,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-p-your-1", "wd-p-your-2"],
          passMessage: "Found wd-p-your-1 and wd-p-your-2.",
          failMessage:
            "We couldn't find your two personal paragraphs on Lab 1.",
        },
      },
      {
        id: "a1-lab-paragraph-ai",
        kind: "ai",
        description:
          "Extra sample paragraph with id wd-ai-p that explains why wrapping text in p creates vertical spacing.",
        points: 2,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-ai-p"],
          passMessage: "Found wd-ai-p.",
          failMessage:
            "We couldn't find the With AI paragraph that explains why p creates vertical spacing on Lab 1.",
        },
      },
    ],
  },
  {
    section: "1.3.3",
    label: "ListTags",
    verifyPath: "/labs/lab1",
    tasks: [
      {
        id: "a1-lab-lists",
        kind: "core",
        description:
          "Create ListTags.tsx with the pancake ordered list and the sample book unordered list.",
        points: 3,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-lists", "wd-pancakes"],
          passMessage: "Found wd-lists and the pancake sample list.",
          failMessage:
            "Lab 1 doesn't have the List Tags samples (the pancake ordered list and the unordered list) yet.",
        },
      },
      {
        id: "a1-lab-lists-oyo",
        kind: "oyo",
        description:
          "Favorite recipe ordered list (wd-your-favorite-recipe) and favorites unordered list (wd-your-books).",
        points: 2,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-your-favorite-recipe", "wd-your-books"],
          passMessage: "Found wd-your-favorite-recipe and wd-your-books.",
          failMessage:
            "We couldn't find your favorite-recipe ordered list and favorites unordered list on Lab 1.",
        },
      },
      {
        id: "a1-lab-lists-ai",
        kind: "ai",
        description:
          "Sample HTML-tags list with id wd-ai-html-tags (at least five tags from this chapter).",
        points: 2,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-ai-html-tags"],
          passMessage: "Found wd-ai-html-tags.",
          failMessage:
            "We couldn't find the With AI list of HTML tags on Lab 1.",
        },
      },
    ],
  },
  {
    section: "1.3.4",
    label: "Tables",
    verifyPath: "/labs/lab1",
    tasks: [
      {
        id: "a1-lab-tables",
        kind: "core",
        description:
          "Create Tables.tsx with the quiz grades table (Q1–Q3) and an average row.",
        points: 3,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-tables"],
          passMessage: "Found wd-tables.",
          failMessage:
            "Lab 1 doesn't have the quiz grades table yet.",
        },
      },
      {
        id: "a1-lab-tables-oyo",
        kind: "oyo",
        description: "Second personal table with id wd-your-table.",
        points: 2,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-your-table"],
          passMessage: "Found wd-your-table.",
          failMessage:
            "We couldn't find your own table on Lab 1.",
        },
      },
      {
        id: "a1-lab-tables-ai",
        kind: "ai",
        description:
          "Quiz rows Q4–Q10 in the sample grades table, with a recalculated average from all ten scores.",
        points: 2,
        auto: {
          kind: "ids",
          requireHtmlIncludes: ["Q4", "Q10"],
          passMessage: "Found Q4 and Q10 in the quiz table.",
          failMessage:
            "Extend the quiz table with rows Q4–Q10 and recalculate the average.",
        },
        verifyHash: "wd-tables",
      },
    ],
  },
  {
    section: "1.3.5",
    label: "Images",
    verifyPath: "/labs/lab1",
    tasks: [
      {
        id: "a1-lab-images",
        kind: "core",
        description:
          "Create Images.tsx with the remote Starship image and the local teslabot image.",
        points: 3,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-images"],
          requireAnyIds: ["wd-starship", "wd-teslabot"],
          passMessage: "Found wd-images and a sample image id.",
          failMessage:
            "Lab 1 doesn't show the sample images (Starship and teslabot) yet.",
        },
      },
      {
        id: "a1-lab-images-oyo",
        kind: "oyo",
        description: "Your image with id wd-your-image.",
        points: 2,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-your-image"],
          passMessage: "Found wd-your-image.",
          failMessage:
            "We couldn't find your own image on Lab 1.",
        },
      },
      {
        id: "a1-lab-images-ai",
        kind: "ai",
        description: "Extra sample image with id wd-ai-image from a public URL.",
        points: 2,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-ai-image"],
          passMessage: "Found wd-ai-image.",
          failMessage:
            "We couldn't find the With AI sample image on Lab 1.",
        },
      },
    ],
  },
  {
    section: "1.3.6",
    label: "Forms",
    verifyPath: "/labs/lab1",
    tasks: [
      {
        id: "a1-lab-forms",
        kind: "core",
        description:
          "Build the form components under app/labs/lab1/forms/ (text, textarea, radio, checkboxes, dropdowns, other types, buttons) and assemble them in Forms.tsx.",
        points: 5,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-forms"],
          requireAnyIds: [
            "wd-text-fields-username",
            "wd-textarea",
            "wd-radio-comedy",
            "wd-select-one-genre",
          ],
          passMessage: "Found wd-forms and sample form field ids.",
          failMessage:
            "Lab 1 doesn't have the sample form controls (text field, textarea, radio buttons, dropdown) yet.",
        },
      },
      {
        id: "a1-lab-forms-oyo",
        kind: "oyo",
        description:
          "Student Profile form in the single canonical app/labs/lab1/forms/YourForm.tsx with id wd-your-form covering the field types from the chapter, plus Save and Cancel — overwrite that same path and keep that same id; Forms.tsx imports that one YourForm only.",
        points: 3,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-your-form"],
          passMessage: "Found wd-your-form.",
          failMessage:
            "We couldn't find your Student Profile form on Lab 1.",
        },
      },
      {
        id: "a1-lab-forms-ai",
        kind: "ai",
        description:
          "Overwrite the same file app/labs/lab1/forms/YourForm.tsx and keep id wd-your-form — the same id as On your own. No second file and no new form id (do not invent wd-ai-form, wd-ai-your-form, or similar). Unlike earlier With AI steps that add a new wd-ai-* id, Forms reuses the On-your-own id. Forms.tsx still imports that one YourForm only. Then replace every SAMPLE default with your own details.",
        points: 2,
        verifyHash: "wd-your-form",
      },
    ],
  },
  {
    section: "1.3.7",
    label: "HighlightedParagraph",
    verifyPath: "/labs/lab1",
    tasks: [
      {
        id: "a1-lab-highlighted-paragraph",
        kind: "core",
        description:
          "Create HighlightedParagraph.tsx with text and style props (attributes only) and show a few variations.",
        points: 3,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-highlighted-paragraph"],
          passMessage: "Found wd-highlighted-paragraph.",
          failMessage:
            "We couldn't find a HighlightedParagraph (a paragraph with a color or background style) on Lab 1.",
        },
      },
      {
        id: "a1-lab-highlighted-paragraph-oyo",
        kind: "oyo",
        description: "Extra HighlightedParagraph with your text and colors.",
        points: 2,
        verifyHash: "wd-highlighted-paragraph",
      },
      {
        id: "a1-lab-highlighted-paragraph-ai",
        kind: "ai",
        description:
          "Extra sample HighlightedParagraph (not your personal sentence) with different colors.",
        points: 2,
        verifyHash: "wd-highlighted-paragraph",
      },
    ],
  },
  {
    section: "1.3.8",
    label: "HighlightedBox",
    verifyPath: "/labs/lab1",
    tasks: [
      {
        id: "a1-lab-highlighted-box",
        kind: "core",
        description:
          "Create HighlightedBox.tsx that wraps nested children with the same style props.",
        points: 3,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-highlighted-box"],
          passMessage: "Found wd-highlighted-box.",
          failMessage:
            "We couldn't find a HighlightedBox (a styled box that wraps other elements) on Lab 1.",
        },
      },
      {
        id: "a1-lab-highlighted-box-oyo",
        kind: "oyo",
        description: "Extra HighlightedBox wrapping your goals list.",
        points: 2,
        verifyHash: "wd-highlighted-box",
      },
      {
        id: "a1-lab-highlighted-box-ai",
        kind: "ai",
        description:
          "Extra sample HighlightedBox of nested tags (not your personal goals list).",
        points: 2,
        verifyHash: "wd-highlighted-box",
      },
    ],
  },
  {
    section: "1.3.9",
    label: "AnchorTag",
    verifyPath: "/labs/lab1",
    tasks: [
      {
        id: "a1-lab-anchor",
        kind: "core",
        description:
          "Create AnchorTag.tsx with lipsum plus GitHub anchors and import it on the Lab 1 page.",
        points: 3,
        auto: {
          kind: "ids",
          requireAnyIds: ["wd-lipsum", "wd-github"],
          passMessage: "Found Lab 1 anchor ids (wd-lipsum or wd-github).",
          failMessage:
            "Lab 1 doesn't have the AnchorTag sample links yet.",
        },
        verifyHash: "wd-lipsum",
      },
      {
        id: "a1-lab-anchor-oyo",
        kind: "oyo",
        description: "Personal anchors wd-your-link and wd-your-github.",
        points: 2,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-your-link", "wd-your-github"],
          passMessage: "Found wd-your-link and wd-your-github.",
          failMessage:
            "We couldn't find a personal link (your GitHub profile, LinkedIn, or portfolio) on Lab 1.",
        },
      },
      {
        id: "a1-lab-anchor-ai",
        kind: "ai",
        description: "Sample docs link with id wd-ai-link (for example MDN table element).",
        points: 2,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-ai-link"],
          passMessage: "Found wd-ai-link.",
          failMessage:
            "We couldn't find the With AI documentation link (for example MDN) on Lab 1.",
        },
      },
    ],
  },
  {
    section: "1.3.10",
    label: "Labs navigation",
    verifyPath: "/labs",
    tasks: [
      {
        id: "a1-delivery-labs-nav",
        kind: "core",
        description:
          "Labs index at app/labs/page.tsx lists Lab 1–3 with Link, plus a Kambaz link so graders can reach every required page.",
        points: 3,
        // Special-cased in runA1Checks (labs HTML / navigation ids).
        verifyHash: "wd-labs",
      },
      {
        id: "a1-lab-labs-nav-oyo",
        kind: "oyo",
        description:
          "Create Lab 4 and link to it from the Labs index (id wd-lab4-link).",
        points: 2,
        auto: {
          kind: "ids",
          // Either the id or a real link to /labs/lab4 passes (structure fallback
          // in a1-structure.ts).
          requireAnyIds: ["wd-lab4-link"],
          passMessage: "Found a Lab 4 link (wd-lab4-link).",
          failMessage:
            "The Labs index doesn't link to Lab 4 (/labs/lab4).",
        },
        verifyHash: "wd-lab4-link",
      },
      {
        id: "a1-lab-labs-nav-ai",
        kind: "ai",
        description:
          "Lab 5 placeholder page and a Labs index link to /labs/lab5.",
        points: 2,
        auto: {
          kind: "ids",
          requireAnchorPaths: ["/labs/lab5"],
          passMessage: "Found a Lab 5 index link.",
          failMessage:
            "Add a Lab 5 placeholder and link it from the Labs index.",
        },
        verifyHash: "wd-labs",
      },
    ],
  },
  {
    section: "1.3.11",
    label: "Labs TOC and layout",
    verifyPath: "/labs",
    tasks: [
      {
        id: "a1-lab-toc",
        kind: "core",
        description:
          "Create app/labs/TOC.tsx and app/labs/layout.tsx so the TOC wraps lab pages via children.",
        points: 3,
        auto: {
          kind: "ids",
          // Read Lab 1 itself: the TOC must wrap lab pages via the layout, so
          // TOC links on the Labs index alone do not count.
          pagePath: "/labs/lab1",
          requireAnyIds: ["wd-home-link", "wd-lab1-link", "wd-lab2-link"],
          passMessage: "Found the Labs TOC on the Lab 1 page.",
          failMessage:
            "The Lab 1 page doesn't show the Labs table of contents (links to the other labs). Put the TOC in app/labs/layout.tsx so it wraps every lab page.",
        },
        verifyHash: "wd-home-link",
      },
      {
        id: "a1-lab-toc-oyo",
        kind: "oyo",
        description:
          "Personal note or link in the labs TOC — your name, a one-line motto, or a link back to the book.",
        points: 2,
      },
      {
        id: "a1-lab-toc-ai",
        kind: "ai",
        description:
          "Chapter 1 link in the labs TOC (id wd-toc-book-link). Your own app has no /book routes, so the link uses the full course-book address, https://kambaz.dev/book/ch1, and opens the chapter. Keep the id wd-toc-book-link on it; the ids help us test your work.",
        points: 2,
        auto: {
          kind: "ids",
          requireAllIds: ["wd-toc-book-link"],
          passMessage: "Found wd-toc-book-link.",
          failMessage:
            "The Labs table of contents doesn't link to Chapter 1 of the book (https://kambaz.dev/book/ch1).",
        },
      },
    ],
  },
];

export function labExerciseKindLabel(kind: LabExerciseKind): string {
  return LAB_EXERCISE_KIND_LABELS[kind];
}

export function flattenLabExercises(
  sections: readonly A1LabExerciseSection[],
): A1LabExercise[] {
  return sections.flatMap((section) =>
    section.tasks.map((task) => ({
      ...task,
      section: section.section,
      parentLabel: section.label,
      verifyPath: section.verifyPath,
      label: labExerciseKindLabel(task.kind),
    })),
  );
}

/** Flat scoring/auto-check rows in the same a/b/c order as the nested tree. */
export const A1_LAB_EXERCISES: readonly A1LabExercise[] =
  flattenLabExercises(A1_LAB_EXERCISE_SECTIONS);

export function bookHrefForSection(section: string): string {
  return `/book/ch1#sec-${section.split(".").join("-")}`;
}

export function bookLabelForSection(section: string): string {
  return `§${section}`;
}

export function labExerciseToCriterion(exercise: A1LabExercise): RubricCriterion {
  return {
    id: exercise.id,
    label: exercise.label,
    description: exercise.description,
    points: exercise.points,
    bookHref: bookHrefForSection(exercise.section),
    bookLabel: bookLabelForSection(exercise.section),
    onYourOwn: exercise.kind === "oyo" || undefined,
    withAI: exercise.kind === "ai" || undefined,
    parentLabel: exercise.parentLabel,
  };
}

export function a1LabCriteria(): RubricCriterion[] {
  return A1_LAB_EXERCISES.map(labExerciseToCriterion);
}

export function a1LabAutoSpecs(): A1RubricAutoSpec[] {
  return A1_LAB_EXERCISES.filter((exercise) => exercise.auto).map((exercise) => {
    const auto = exercise.auto!;
    return {
      criterionId: exercise.id,
      groupId: "lab",
      label: `${exercise.parentLabel} — ${exercise.label}`,
      kind: auto.kind,
      requireAllIds: auto.requireAllIds,
      requireAnyIds: auto.requireAnyIds,
      headingLevels: auto.headingLevels,
      requireHtmlIncludes: auto.requireHtmlIncludes,
      requireAnchorPaths: auto.requireAnchorPaths,
      pagePath: auto.pagePath,
      passMessage: auto.passMessage,
      failMessage: auto.failMessage,
    };
  });
}

/** Labs navigation is auto-checked in runA1Checks, not via a rubric spec. */
export const A1_LAB_SPECIAL_AUTO_IDS = ["a1-delivery-labs-nav"] as const;

export function a1LabManualIds(): string[] {
  return A1_LAB_EXERCISES.filter(
    (exercise) =>
      !exercise.auto &&
      !(A1_LAB_SPECIAL_AUTO_IDS as readonly string[]).includes(exercise.id),
  ).map((exercise) => exercise.id);
}

export function a1LabVerifyPaths(): Record<string, string> {
  return Object.fromEntries(
    A1_LAB_EXERCISES.map((exercise) => [exercise.id, exercise.verifyPath]),
  );
}

export function isA1LabExerciseId(criterionId: string): boolean {
  return A1_LAB_EXERCISES.some((exercise) => exercise.id === criterionId);
}
