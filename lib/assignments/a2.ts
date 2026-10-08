import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import type { AssignmentRubric } from "./types";

/**
 * Student checklist for A2 from Chapter 2 lab + Kambaz restyle + delivery.
 * Grouped like the Canvas rubric: Delivery / Lab / Kambaz.
 */
export const A2_RUBRIC: AssignmentRubric = {
  assignmentId: "a2",
  groups: [
    {
      id: "delivery",
      title: "Delivery",
      intro:
        "Push an a2 branch on the same webdev-client repo and submit that branch’s Vercel URL.",
      criteria: [
        {
          id: "a2-delivery-branch",
          label: "a2 GitHub branch",
          description:
            "Create, commit, and push a branch named a2 on the same public repository from A1. Submit that branch’s GitHub URL (…/tree/a2). The tree page must load.",
          points: 3,
          bookHref: "/book/ch2#sec-2-5",
          bookLabel: "§2.5",
        },
        {
          id: "a2-delivery-vercel",
          label: "Vercel branch deployment",
          description:
            "Enable branch deployments so a2 has its own preview URL whose hostname contains -git-a2-, with Deployment Protection off.",
          points: 3,
          bookHref: "/book/ch2#sec-2-5",
          bookLabel: "§2.5",
        },
        {
          id: "a2-delivery-name-github",
          label: "Name and GitHub link",
          description:
            "Labs still shows your full name and a link to your GitHub repository.",
          points: 3,
          bookHref: "/book/ch2#sec-2-5",
          bookLabel: "§2.5",
        },
        {
          id: "a2-delivery-labs-nav",
          label: "Labs still listed",
          description:
            "app/labs/TOC.tsx and app/labs/page.tsx still link Lab 1 (/labs/lab1), Lab 2 (/labs/lab2), and Kambaz.",
          points: 3,
          bookHref: "/book/ch2#sec-2-5",
          bookLabel: "§2.5",
        },
      ],
    },
    {
      id: "lab",
      title: "Lab — CSS, icons, and Tailwind",
      intro:
        "Build Lab 2 in app/labs/lab2. CSS samples stay on the lab page; Tailwind samples live under app/labs/lab2/tailwind/. Keep the book's wd-* ids on your samples, but a missing id never costs points: Run checks looks at what your CSS does to the page, not at ids or text.",
      criteria: [
        {
          id: "a2-lab-page",
          label: "Lab 2 page and CSS file",
          description:
            "Create app/labs/lab2/page.tsx and index.css, import the CSS in the page, and link Lab 2 from the Labs index and TOC (href /labs/lab2).",
          points: 3,
          bookHref: "/book/ch2#sec-2-1",
          bookLabel: "§2.1",
        },
        {
          id: "a2-lab-selectors",
          label: "Selectors",
          description:
            "Practice the style attribute, then move rules into the CSS file with id, class, and document-structure selectors.",
          points: 5,
          bookHref: "/book/ch2#sec-2-1-1",
          bookLabel: "§2.1.1",
        },
        {
          id: "a2-lab-box-model",
          label: "Color, border, and box model",
          description:
            "Create the color, background, border, padding, margin, box-model, corner, dimension, and display samples and import them.",
          points: 5,
          bookHref: "/book/ch2#sec-2-1-7",
          bookLabel: "§2.1.7",
        },
        {
          id: "a2-lab-layout",
          label: "Position, float, flex, and media queries",
          description:
            "Create the position, z-index, float, grid, flex, and media-query samples and import them.",
          points: 5,
          bookHref: "/book/ch2#sec-2-1-13",
          bookLabel: "§2.1.13",
        },
        {
          id: "a2-lab-icons",
          label: "React Icons",
          description:
            "Create ReactIconsSampler.tsx with at least one icon and import it on Lab 2.",
          points: 3,
          bookHref: "/book/ch2#sec-2-2",
          bookLabel: "§2.2",
        },
        {
          id: "a2-lab-tailwind",
          label: "Tailwind samples",
          description:
            "Create every Tailwind section of §2.3 under app/labs/lab2/tailwind/: margins and padding, font size and weight, background colors, the five responsive samples (breakpoint color, show/hide, flex row, grid columns, spacing and text size), the responsive card, blurs, and a grid whose columns span. Each section is checked on its own.",
          points: 5,
          bookHref: "/book/ch2#sec-2-3",
          bookLabel: "§2.3",
        },
      ],
    },
    {
      id: "kambaz",
      title: "Kambaz — Chapter 2 restyle",
      intro:
        `Restyle the prototype so navigation, Dashboard, Modules, and related screens start to resemble the target product. Editor and Account stay On your own. ${ASSIGNMENT_STUDENT_COPY.manualCheckLabNote}`,
      criteria: [
        {
          id: "a2-kambaz-nav",
          label: "Kambaz Navigation",
          description:
            "Style Kambaz Navigation and replace the table layout with flex.",
          points: 5,
          bookHref: "/book/ch2#sec-2-4-1",
          bookLabel: "§2.4.1",
        },
        {
          id: "a2-kambaz-dashboard",
          label: "Dashboard",
          description: "Style the Dashboard and CourseCard.",
          points: 5,
          bookHref: "/book/ch2#sec-2-4-2",
          bookLabel: "§2.4.2",
        },
        {
          id: "a2-kambaz-course-nav",
          label: "Course Navigation",
          description: "Style Course Navigation.",
          points: 5,
          bookHref: "/book/ch2#sec-2-4-3",
          bookLabel: "§2.4.3",
        },
        {
          id: "a2-kambaz-modules",
          label: "Modules",
          description: "Style Modules, Module, and Lesson.",
          points: 5,
          bookHref: "/book/ch2#sec-2-4-4",
          bookLabel: "§2.4.4",
        },
        {
          id: "a2-kambaz-home",
          label: "Home",
          description: "Style Home and Course Status.",
          points: 5,
          bookHref: "/book/ch2#sec-2-4-5",
          bookLabel: "§2.4.5",
        },
        {
          id: "a2-kambaz-people",
          label: "People",
          description: "Style the People table.",
          points: 5,
          bookHref: "/book/ch2#sec-2-4-6",
          bookLabel: "§2.4.6",
        },
        {
          id: "a2-kambaz-assignments",
          label: "Assignments",
          description: "Style the Assignments screen.",
          points: 5,
          bookHref: "/book/ch2#sec-2-4-7",
          bookLabel: "§2.4.7",
        },
        {
          id: "a2-kambaz-editor",
          label: "Assignment Editor",
          description:
            "Style the Assignment Editor to match the figures and interactive demo (On your own).",
          points: 5,
          bookHref: "/book/ch2#sec-2-4-8",
          bookLabel: "§2.4.8",
          onYourOwn: true,
        },
        {
          id: "a2-kambaz-account",
          label: "Account screens",
          description:
            "Style Sign in, Sign up, Profile, and Account Navigation (On your own).",
          points: 5,
          bookHref: "/book/ch2#sec-2-4-9",
          bookLabel: "§2.4.9",
          onYourOwn: true,
        },
      ],
    },
  ],
};
