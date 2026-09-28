import { a1LabCriteria } from "./a1-lab-exercises";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import type { AssignmentRubric } from "./types";

/**
 * Student checklist for A1, regrouped Delivery / Lab HTML / Kambaz Ch1.
 *
 * Website grades are all-or-nothing per criterion (full points or 0).
 * Canvas is a grade shell only — do not mention Canvas rubric levels
 * (Best / Better / Almost / Missing) to students. Rebuilding the IMSCC
 * Canvas package is a follow-up; this file only documents the website model.
 */
export const A1_RUBRIC: AssignmentRubric = {
  assignmentId: "a1",
  groups: [
    {
      id: "delivery",
      title: "Delivery",
      intro:
        `Submit a Vercel URL that graders can open without signing in. A public GitHub repository is optional for auto-checks, but graders still look for the repo and a wd-github link on Labs. ${ASSIGNMENT_STUDENT_COPY.nameAndSectionDeliveryNote}`,
      criteria: [
        {
          id: "a1-delivery-vercel",
          label: "Vercel deployment",
          description:
            "Import webdev-client on Vercel, disable Deployment Protection, and submit a URL that opens without a Vercel login.",
          points: 3,
          bookHref: "/book/ch1#sec-1-6",
          bookLabel: "§1.6",
        },
        {
          id: "a1-delivery-name-section",
          label: "Name on Labs",
          description: ASSIGNMENT_STUDENT_COPY.nameAndSection,
          points: 3,
          bookHref: "/book/ch1#sec-1-7",
          bookLabel: "§1.7",
        },
        {
          id: "a1-delivery-github",
          label: "GitHub repository",
          description:
            "Public webdev-client repo with the source that produced the deploy, plus a wd-github link on Labs.",
          points: 3,
          bookHref: "/book/ch1#sec-1-5",
          bookLabel: "§1.5",
        },
      ],
    },
    {
      id: "lab",
      title: "Lab — HTML components",
      intro:
        `Same nested list as book §1.3.12: one row per Lab 1 section (1.3.1–1.3.11), with lettered a/b/c for the Lab component, On your own, and With AI extra. ${ASSIGNMENT_STUDENT_COPY.manualCheckLabNote}`,
      criteria: a1LabCriteria(),
    },
    {
      id: "kambaz",
      title: "Kambaz — Chapter 1 screens",
      intro:
        "Prototype the Kambaz screens with HTML and the App Router. Assignments and the editor stay On your own.",
      criteria: [
        {
          id: "a1-kambaz-account",
          label: "Account screens",
          description:
            "Sign in, Sign up, Profile, and Account Navigation, with / and /account redirecting to /account/signin.",
          points: 5,
          bookHref: "/book/ch1#sec-1-4-2",
          bookLabel: "§1.4.2",
        },
        {
          id: "a1-kambaz-dashboard",
          label: "Dashboard",
          description:
            "Dashboard with at least three CourseCards linking to /courses/[cid]/home.",
          points: 5,
          bookHref: "/book/ch1#sec-1-4-3",
          bookLabel: "§1.4.3",
        },
        {
          id: "a1-kambaz-nav",
          label: "Kambaz navigation",
          description:
            "Kambaz Navigation sidebar in the (kambaz) layout; Sign in (wd-signin-btn) points at /dashboard.",
          points: 3,
          bookHref: "/book/ch1#sec-1-4-3-1",
          bookLabel: "§1.4.3.1",
        },
        {
          id: "a1-kambaz-course-nav",
          label: "Course navigation",
          description:
            "Course Navigation and course layout, including placeholder pages for Piazza, Zoom, Quizzes, Grades, and People.",
          points: 3,
          bookHref: "/book/ch1#sec-1-4-4",
          bookLabel: "§1.4.4",
        },
        {
          id: "a1-kambaz-modules",
          label: "Modules",
          description:
            "Modules page with Module and Lesson, nested weeks, lessons, and content items.",
          points: 5,
          bookHref: "/book/ch1#sec-1-4-5",
          bookLabel: "§1.4.5",
        },
        {
          id: "a1-kambaz-home",
          label: "Course Home",
          description:
            "Home assembles Modules plus Course Status. No leftover page.tsx directly under courses/[cid]/.",
          points: 5,
          bookHref: "/book/ch1#sec-1-4-6",
          bookLabel: "§1.4.6",
        },
        {
          id: "a1-kambaz-assignments",
          label: "Assignments screen",
          description:
            "Assignments list matching the book demo and required ids (On your own).",
          points: 5,
          bookHref: "/book/ch1#sec-1-4-7",
          bookLabel: "§1.4.7",
          onYourOwn: true,
        },
        {
          id: "a1-kambaz-editor",
          label: "Assignment Editor",
          description:
            "Assignment Editor matching the book demo and required ids (On your own).",
          points: 5,
          bookHref: "/book/ch1#sec-1-4-8",
          bookLabel: "§1.4.8",
          onYourOwn: true,
        },
      ],
    },
  ],
};
