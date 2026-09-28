import type { LectureSlide } from "../types";

export const KAMBAZ_COURSES_STYLING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Courses Chrome",
      "§2.4.3–2.4.5 · Course Nav, Modules, Home + Status",
    ],
  },
  {
    id: "purpose",
    title: "Three columns beside Kambaz nav",
    kind: "content",
    bullets: [
      "A course has its own sidebar, a Modules list, and a Status column",
      "Style the pieces, then swap leftover tables for `flex`",
      "Hide Status first (`lg`), then both nav sidebars together (`md`)",
    ],
  },
  {
    id: "course-nav",
    title: "Course Nav is a list group",
    kind: "content",
    bullets: [
      "Keep it ~140px — labels only, no icons",
      "Idle links red. Active: black text + 3px left border",
      "`usePathname` + `startsWith` so `/assignments/123` still lights Assignments",
      "`.list-group` lives in `kambaz.css` — write the selectors; do not import a kit",
    ],
    code: `"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/app/labs/lab2/tailwind/utilities.css";
import "../../kambaz.css";

export default function CourseNavigation({ cid }: { cid: string }) {
  const pathname = usePathname() ?? "";
  const home = \`/courses/\${cid}/home\`;
  const assignments = \`/courses/\${cid}/assignments\`;
  return (
    <div id="wd-courses-navigation" className="wd list-group rounded-none text-lg">
      <Link
        href={home}
        id="wd-course-home-link"
        className={
          pathname === home
            ? "list-group-item active border-0"
            : "list-group-item border-0 text-red-600"
        }
      >
        Home
      </Link>
      <Link
        href={assignments}
        id="wd-course-assignments-link"
        className={
          pathname === assignments || pathname.startsWith(assignments + "/")
            ? "list-group-item active border-0"
            : "list-group-item border-0 text-red-600"
        }
      >
        Assignments
      </Link>
      {/* ...Modules, Piazza, Zoom, Quizzes, Grades, People... */}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/Navigation.tsx",
  },
  {
    id: "list-group-css",
    title: "list-group rules in kambaz.css",
    kind: "content",
    bullets: [
      "You write these selectors — they are not imported from a CSS kit",
      "A few app-wide rules beat a pile of utilities on every link",
      "Active item: black, white fill, `border-left: 3px solid black`",
    ],
    code: `.list-group.wd {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.list-group.wd > .list-group-item {
  display: block;
  padding: 0.4rem 0.75rem;
  text-decoration: none;
  border: 0;
  border-left: 3px solid transparent;
  color: #dc2626;
  background-color: transparent;
  white-space: nowrap;
}
.list-group.wd > .list-group-item.active {
  color: black;
  background-color: white;
  border-left: 3px solid black !important;
  font-weight: 600;
}`,
    codeLanguage: "css",
    codeFile: "app/(kambaz)/kambaz.css",
  },
  {
    id: "course-nav-demo",
    title: "Live Course Navigation",
    kind: "demo",
    bullets: [
      "A narrow list group uses red idle links and a black left border on the active route.",
      "Home is active on this figure (the lecture route is not a course path)",
      "Clicking a link leaves the deck and opens the real course screen",
    ],
    embed: "kambaz-styled-course-nav",
  },
  {
    id: "checkmark",
    title: "GreenCheckmark helper",
    kind: "content",
    bullets: [
      "Modules and lessons share a publish indicator",
      "Stack `FaCheckCircle` on `FaCircle` — green on white",
    ],
    code: `import { FaCheckCircle, FaCircle } from "react-icons/fa";

export default function GreenCheckmark() {
  return (
    <span className="relative me-1 inline-flex">
      <FaCheckCircle
        className="absolute text-xl text-green-600"
        style={{ top: "2px" }}
      />
      <FaCircle className="text-base text-white" />
    </span>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/GreenCheckmark.tsx",
  },
  {
    id: "module-lesson",
    title: "Module.tsx",
    kind: "content",
    bullets: [
      "Modules and Home share this list, styled once with a gray header and a checkmark.",
      "Gray `bg-neutral-200` title bar, checkmark on the right",
      "Import `GreenCheckmark` — it is new in Chapter 2, so the JSX alone will not compile",
    ],
    code: `import type { ReactNode } from "react";
import GreenCheckmark from "./GreenCheckmark";

export default function Module({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <li className="wd-module mb-5 overflow-hidden border border-neutral-400 p-0 text-xl">
      <div className="wd-title flex items-center justify-between bg-neutral-200 p-3 ps-2">
        <span>{title}</span>
        <GreenCheckmark />
      </div>
      <ul className="wd-lessons m-0 list-none p-0">{children}</ul>
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/Module.tsx",
    codeAddedLines: [[1, 10]],
  },
  {
    id: "lesson",
    title: "Lesson.tsx",
    kind: "content",
    bullets: [
      "Lessons get a checkmark on the right and a green left border.",
      "Same imports as `Module` — `GreenCheckmark` is new in Chapter 2",
      "`border-l-[3px] border-green-600` is the accent Assignments reuse",
    ],
    code: `import type { ReactNode } from "react";
import GreenCheckmark from "./GreenCheckmark";

export default function Lesson({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <li className="wd-lesson border-l-[3px] border-green-600 p-3 pl-1">
      <div className="flex items-center justify-between">
        <span className="wd-title">{title}</span>
        <GreenCheckmark />
      </div>
      <ul className="wd-content mt-2 list-disc pl-6">{children}</ul>
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/Lesson.tsx",
    codeAddedLines: [[1, 10]],
  },
  {
    id: "toolbar",
    title: "Modules toolbar is a flex row",
    kind: "content",
    bullets: [
      "Collapse All, View Progress, Publish All, red `+ Module`",
      "`border-neutral-300` on secondary buttons — bare `border` looks near-black",
    ],
    code: `<div className="mb-3 flex flex-wrap items-center gap-2">
  <button
    type="button"
    className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
  >
    Collapse All
  </button>
  <button
    type="button"
    className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
  >
    View Progress
  </button>
  <select
    defaultValue="publish-all"
    className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
  >
    <option value="publish-all">Publish All</option>
  </select>
  <button
    type="button"
    className="rounded border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
  >
    + Module
  </button>
</div>
{/* ...Module / Lesson tree... */}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeAddedLines: [[8, 19], 27],
  },
  {
    id: "modules-demo",
    title: "Live styled Modules",
    kind: "demo",
    bullets: [
      "Gray module bar, green lesson border, checkmark on the right",
      "The Module / Lesson tree from Chapter 1 stays — only classes change",
    ],
    embed: "kambaz-styled-modules",
  },
  {
    id: "status",
    title: "Course Status button stack",
    kind: "content",
    bullets: [
      "Home already shows the styled Modules list, so only the Course Status column remains.",
      "Unpublish / Publish share a two-column `flex` row",
      "The rest are full-width bordered buttons with React Icons",
    ],
    code: `import { FaCheckCircle } from "react-icons/fa";
import { MdDoNotDisturbAlt } from "react-icons/md";

export default function CourseStatus() {
  return (
    <div id="wd-course-status">
      <h2 className="mb-3 text-xl font-semibold">Course Status</h2>
      <div className="flex gap-1">
        <button
          type="button"
          className="inline-flex min-w-0 flex-1 items-center justify-center rounded border border-neutral-300 bg-white px-1.5 py-1.5 text-xs"
        >
          <MdDoNotDisturbAlt className="me-1 shrink-0 text-base" /> Unpublish
        </button>
        <button
          type="button"
          className="inline-flex min-w-0 flex-1 items-center justify-center rounded bg-green-600 px-1.5 py-1.5 text-xs text-white hover:bg-green-700"
        >
          <FaCheckCircle className="me-1 shrink-0 text-base" /> Publish
        </button>
      </div>
      <button
        type="button"
        className="mb-1 flex w-full items-center rounded border border-neutral-300 bg-white px-3 py-2 text-left text-sm"
      >
        {/* icon */} Import Existing Content
      </button>
      {/* ...repeat full-width bordered buttons for Import from Commons,
             Choose Home Page, and the rest... */}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/home/Status.tsx",
    codeAddedLines: [[1, 2], 17, [22, 29]],
  },
  {
    id: "flex-layouts",
    title: "Flex replaces the last tables",
    kind: "content",
    bullets: [
      "Course layout: nav `hidden md:block` at 140px, children `flex-1`",
      "Home: Modules `flex-1`, Status `hidden lg:block` at 250px",
      "Status vanishes first. Both sidebars leave together below `md`",
    ],
    code: `<div className="flex gap-4">
  <div className="hidden w-[140px] shrink-0 md:block">
    <CourseNavigation cid={cid} />
  </div>
  <div className="min-w-0 flex-1">{children}</div>
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/layout.tsx",
    codeBlocks: [
      {
        file: "app/(kambaz)/courses/[cid]/home/page.tsx",
        language: "tsx",
        code: `<div id="wd-home" className="flex gap-4">
  <div className="min-w-0 flex-1">
    <Modules />
  </div>
  <div className="hidden w-[250px] shrink-0 lg:block">
    <CourseStatus />
  </div>
</div>`,
      },
    ],
  },
  {
    id: "home-demo",
    title: "Live Home chrome",
    kind: "demo",
    bullets: [
      "On a wide screen four columns sit side by side, then Status hides before both sidebars.",
      "Course Nav + Modules + Status (Status needs a wide viewport / `lg`)",
      "Four columns on a wide stage: Kambaz nav, Course nav, Modules, Status",
    ],
    embed: "kambaz-styled-home",
  },
  {
    id: "next-up",
    title: "Next: People and Assignments",
    kind: "title",
    bullets: [
      "You can style course chrome and hide columns in the right order",
      "§2.4.6–2.4.8: People table, assignment rows, then the editor form",
    ],
  },
];
