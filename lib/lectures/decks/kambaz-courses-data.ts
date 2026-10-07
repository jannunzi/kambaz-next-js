import type { LectureSlide } from "../types";

export const KAMBAZ_COURSES_DATA_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Courses from Data",
      "§3.9.4–3.9.6 · find the course, then map its nav",
    ],
  },
  {
    id: "purpose",
    title: "cid selects one course object",
    kind: "content",
    bullets: [
      "The layout lives at `app/(kambaz)/courses/[cid]/layout.tsx`",
      "Await `params`, then `find` the course whose `_id` matches `cid`",
      "Pass `cid` into course navigation so links stay inside this course",
      "The red heading should show the selected course name",
    ],
  },
  {
    id: "layout",
    title: "Layout awaits params, then finds",
    kind: "content",
    bullets: [
      "`params` is a `Promise` — `const { cid } = await params`",
      "`courses.find((c) => c._id === cid)` — the same `find` as §3.4.5",
      "`Breadcrumb` is the heading text: the course name this layout just found",
      "Open two dashboard cards and confirm the heading name changes",
    ],
    code: `import { ReactNode } from "react";
import { FaAlignJustify } from "react-icons/fa6";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { courses } from "../../database";

export default async function CoursesLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ cid: string }>;
}>) {
  const { cid } = await params;
  const course = courses.find((c) => c._id === cid);
  return (
    <div id="wd-courses">
      <h2 className="text-2xl font-semibold text-red-600">
        <FaAlignJustify className="me-4 mb-1 inline text-xl" />
        <Breadcrumb course={course} />
      </h2>
      <hr className="my-3" />
      <div className="flex gap-4">
        <div className="hidden w-[140px] shrink-0 md:block">
          <CourseNavigation cid={cid} />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/layout.tsx",
    codeHighlightLines: [14, 15, 20, 25],
  },
  {
    id: "course-nav",
    title: "Course nav maps LINKS with cid",
    kind: "demo",
    bullets: [
      "`\"use client\"` lets `usePathname` read the URL and highlight the active section",
      "On your own: Home, Modules, Piazza, Zoom, Assignments, Quizzes, Grades, People",
      "Each `href` is `` /courses/${cid}/${segment} ``",
      "The layout already passes `cid` — this file does not need `useParams`",
    ],
    code: `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "../../kambaz.css";

const LINKS = [
  { segment: "home", id: "wd-course-home-link", label: "Home" },
  { segment: "modules", id: "wd-course-modules-link", label: "Modules" },
  { segment: "piazza", id: "wd-course-piazza-link", label: "Piazza" },
  { segment: "zoom", id: "wd-course-zoom-link", label: "Zoom" },
  { segment: "assignments", id: "wd-course-assignments-link", label: "Assignments" },
  { segment: "quizzes", id: "wd-course-quizzes-link", label: "Quizzes" },
  { segment: "grades", id: "wd-course-grades-link", label: "Grades" },
  { segment: "people/table", id: "wd-course-people-link", label: "People" },
] as const;

export default function CourseNavigation({ cid }: { cid: string }) {
  const pathname = usePathname() ?? "";
  const inCourse = pathname.startsWith(\`/courses/\${cid}\`);

  return (
    <div id="wd-courses-navigation" className="wd list-group rounded-none text-lg">
      {LINKS.map(({ segment, id, label }) => {
        const href = \`/courses/\${cid}/\${segment}\`;
        const active = inCourse
          ? pathname === href ||
            (segment !== "home" && pathname.startsWith(href))
          : segment === "home";
        return (
          <Link
            key={id}
            href={href}
            id={id}
            className={
              active
                ? "list-group-item active border-0"
                : "list-group-item border-0 text-red-600"
            }
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/Navigation.tsx",
    codeHighlightLines: [[7, 16], 25],
    embed: "kambaz-styled-course-nav",
  },
  {
    id: "breadcrumb",
    title: "Breadcrumb reads the last segment",
    kind: "content",
    bullets: [
      "Client Component so it can call `usePathname`",
      "Course name from the object the layout found; section from the URL",
      "`course?.name` guards a missing `find` — the same `?.` as §3.4.17",
      "On Home it reads `Rocket Propulsion > Home`; the part after `>` follows the URL",
    ],
    code: `"use client";

import { usePathname } from "next/navigation";

export default function Breadcrumb({
  course,
}: {
  course: { name: string } | undefined;
}) {
  const pathname = usePathname() ?? "";
  const section = pathname.split("/").pop() ?? "";
  const label = section.charAt(0).toUpperCase() + section.slice(1);
  return (
    <span>
      {course?.name} &gt; {label}
    </span>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/Breadcrumb.tsx",
    codeHighlightLines: [11, 15],
  },
  {
    id: "recap",
    title: "Courses data recap",
    kind: "content",
    bullets: [
      "`await params` → `find` by `_id` → pass `course` and `cid`",
      "Course nav: `LINKS.map` with `` /courses/${cid}/${segment} ``",
      "Breadcrumb: `course?.name` plus the last path segment",
    ],
  },
  {
    id: "next-up",
    title: "Next: filter modules by cid",
    kind: "title",
    bullets: [
      "Each module JSON row has a `course` field",
      "§3.9.7: `filter` then nested `lessons?.map`",
    ],
  },
];
