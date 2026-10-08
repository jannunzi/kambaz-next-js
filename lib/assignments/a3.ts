import type { AssignmentRubric } from "./types";

/**
 * Student checklist for A3 (Chapter 3: JavaScript, components, and the
 * data-driven Kambaz). Every item says what the deployed page must show
 * (element, minimum count, content), so the checker can grade it without
 * ids or fixed text. wd-* ids help staff find things but never cost points.
 * Wording follows the A3 student walkthrough (Oct 7, 2026).
 */
export const A3_RUBRIC: AssignmentRubric = {
  assignmentId: "a3",
  groups: [
    {
      id: "delivery",
      title: "Delivery",
      intro:
        "Push an a3 branch on the same webdev-client repo and submit that branch’s Vercel URL. Run npm run build before you push.",
      criteria: [
        {
          id: "a3-delivery-branch",
          label: "a3 GitHub branch",
          description:
            "Create, commit, and push a branch named a3 on the same public repository. Submit that branch’s GitHub URL (…/tree/a3). The tree page must load.",
          points: 3,
          bookHref: "/book/ch3#sec-3-10",
          bookLabel: "§3.10",
        },
        {
          id: "a3-delivery-vercel",
          label: "Vercel branch deployment",
          description:
            "Branch deployments are on, so a3 has its own preview URL whose hostname contains -git-a3-, with Deployment Protection off.",
          points: 3,
          bookHref: "/book/ch3#sec-3-10",
          bookLabel: "§3.10",
        },
        {
          id: "a3-delivery-name-github",
          label: "Name and GitHub link",
          description:
            "The Labs pages show your full name (first name first, matching Canvas) and a link to your GitHub repository (https://github.com/<you>/<repo>).",
          points: 3,
          bookHref: "/book/ch3#sec-3-10",
          bookLabel: "§3.10",
        },
        {
          id: "a3-delivery-labs-nav",
          label: "Labs links",
          description:
            "The Labs pages link to /labs/lab1, /labs/lab2, and /labs/lab3, and to your Kambaz screens.",
          points: 3,
          bookHref: "/book/ch3#sec-3-10",
          bookLabel: "§3.10",
        },
      ],
    },
    {
      id: "lab",
      title: "Lab 3 — JavaScript and components",
      intro:
        "Build Lab 3 at /labs/lab3 from §3.2–§3.7. Each item says what the deployed page must show; you may change labels and sample values.",
      criteria: [
        {
          id: "a3-lab-page",
          label: "Lab 3 page",
          description:
            "/labs/lab3 shows a titled section for each exercise in §3.2–§3.7, in book order (at least 20 section headings).",
          points: 6,
          bookHref: "/book/ch3#sec-3-2",
          bookLabel: "§3.2",
        },
        {
          id: "a3-lab-json",
          label: "JSON.stringify",
          description:
            "A <pre> pretty-prints an object that has at least one nested object and one array (JSON.stringify(obj, null, 2)).",
          points: 4,
          bookHref: "/book/ch3#sec-3-4-11",
          bookLabel: "§3.4.11",
        },
        {
          id: "a3-lab-imports-table",
          label: "Destructing imports table",
          description:
            "A table with at least 4 rows of 3 cells compares the import styles (default object, namespace, named functions).",
          points: 4,
          bookHref: "/book/ch3#sec-3-4-16",
          bookLabel: "§3.4.16",
        },
        {
          id: "a3-lab-styles",
          label: "Style objects",
          description:
            "At least 3 boxes colored with inline style={{ backgroundColor: … }} objects.",
          points: 4,
          bookHref: "/book/ch3#sec-3-5-2",
          bookLabel: "§3.5.2",
        },
        {
          id: "a3-lab-classes",
          label: "CSS classes",
          description:
            "At least 4 boxes colored by classes from a stylesheet you import (className, not inline styles).",
          points: 4,
          bookHref: "/book/ch3#sec-3-5-1",
          bookLabel: "§3.5.1",
        },
        {
          id: "a3-lab-client-server",
          label: "Client and Server Components",
          description:
            "A Client Component prints the current pathname (/labs/lab3), and a Server Component prints a list of at least 3 file names read on the server.",
          points: 5,
          bookHref: "/book/ch3#sec-3-6",
          bookLabel: "§3.6",
        },
        {
          id: "a3-lab-toc-highlight",
          label: "Labs TOC highlight",
          description:
            "On each Lab page the TOC link for that lab is marked differently from the others (style, class, or aria-current), and the marking moves when you change labs (/labs/lab1 vs /labs/lab3).",
          points: 5,
          bookHref: "/book/ch3#sec-3-7-2",
          bookLabel: "§3.7.2",
        },
        {
          id: "a3-lab-path-params",
          label: "Path parameters",
          description:
            "/labs/lab3 links to at least two /labs/lab3/add/<a>/<b> URLs, and /labs/lab3/add/<a>/<b> shows a + b for any two numbers (for example /labs/lab3/add/12/30 shows 42).",
          points: 6,
          bookHref: "/book/ch3#sec-3-7-3",
          bookLabel: "§3.7.3",
        },
        {
          id: "a3-lab-todos",
          label: "Todo list",
          description:
            "A list of at least 3 todo checkboxes rendered from todos.json, with at least one checked and one unchecked.",
          points: 5,
          bookHref: "/book/ch3#sec-3-7-4",
          bookLabel: "§3.7.4",
        },
      ],
    },
    {
      id: "kambaz",
      title: "Kambaz — screens from JSON data",
      intro:
        "Drive Kambaz from the JSON files in app/(kambaz)/database (§3.9). Keep at least 3 courses, and at least 2 courses that each have modules, assignments, and enrolled users.",
      criteria: [
        {
          id: "a3-kambaz-nav",
          label: "Kambaz Navigation",
          description:
            "The Kambaz sidebar is rendered from an array, and only the item for the current screen is highlighted: Dashboard on /dashboard, Courses inside a course.",
          points: 5,
          bookHref: "/book/ch3#sec-3-9-1",
          bookLabel: "§3.9.1",
        },
        {
          id: "a3-kambaz-dashboard",
          label: "Dashboard",
          description:
            "The Dashboard shows one card per course in courses.json (at least 3), and each card links to /courses/<course _id>/home.",
          points: 5,
          bookHref: "/book/ch3#sec-3-9-3",
          bookLabel: "§3.9.3",
        },
        {
          id: "a3-kambaz-courses",
          label: "Course from the URL",
          description:
            "Clicking a Dashboard card opens /courses/<_id>/home, and the course heading shows that card’s course name. A different card shows a different name.",
          points: 5,
          bookHref: "/book/ch3#sec-3-9-4",
          bookLabel: "§3.9.4",
        },
        {
          id: "a3-kambaz-course-nav",
          label: "Course Navigation",
          description:
            "Course Navigation links (Home, Modules, Assignments, People) keep the current course’s _id in the URL.",
          points: 5,
          bookHref: "/book/ch3#sec-3-9-5",
          bookLabel: "§3.9.5",
        },
        {
          id: "a3-kambaz-breadcrumb",
          label: "Breadcrumb",
          description:
            "The course heading shows the course name and the current section, and changes when you switch between Home, Modules, and Assignments.",
          points: 5,
          bookHref: "/book/ch3#sec-3-9-6",
          bookLabel: "§3.9.6",
        },
        {
          id: "a3-kambaz-modules",
          label: "Modules",
          description:
            "/courses/<_id>/modules lists only that course’s modules from modules.json. Two courses show different module lists.",
          points: 5,
          bookHref: "/book/ch3#sec-3-9-7",
          bookLabel: "§3.9.7",
        },
        {
          id: "a3-kambaz-assignments",
          label: "Assignments",
          description:
            "/courses/<_id>/assignments lists only that course’s assignments, each linking to /courses/<_id>/assignments/<assignment _id>. Two courses show different lists.",
          points: 5,
          bookHref: "/book/ch3#sec-3-9-8",
          bookLabel: "§3.9.8",
        },
        {
          id: "a3-kambaz-editor",
          label: "Assignment Editor",
          description:
            "The Assignment Editor’s name field shows the title of the assignment you clicked; two assignments show two different titles (On your own).",
          points: 5,
          bookHref: "/book/ch3#sec-3-9-8-1",
          bookLabel: "§3.9.8.1",
          onYourOwn: true,
        },
        {
          id: "a3-kambaz-people",
          label: "People",
          description:
            "/courses/<_id>/people/table lists only the users enrolled in that course (users.json + enrollments.json). Two courses show different rosters.",
          points: 5,
          bookHref: "/book/ch3#sec-3-9-9",
          bookLabel: "§3.9.9",
        },
      ],
    },
  ],
};
