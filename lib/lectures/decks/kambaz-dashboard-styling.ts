import type { LectureSlide } from "../types";

export const KAMBAZ_DASHBOARD_STYLING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Dashboard Styling",
      "§2.4.2 · CourseCard utilities + a wrapping grid",
    ],
  },
  {
    id: "purpose",
    title: "Cards in a responsive grid",
    kind: "content",
    bullets: [
      "Chapter 1 already extracted `CourseCard` inside `#wd-dashboard-courses`",
      "Those cards still look like plain HTML",
      "Dress the same markup with Tailwind: border, shadow, crop, truncate, Go",
      "Wrap the list in `grid` + breakpoint column counts — §2.4.2",
    ],
  },
  {
    id: "card",
    title: "CourseCard gets dressed",
    kind: "content",
    bullets: [
      "`w-[300px] max-w-full` — ~300px, but shrink on a narrow pane",
      "`truncate` + `whitespace-nowrap` keeps long titles on one line",
      "`h-40 w-full object-cover` crops the `next/image` photo",
    ],
    code: `import Link from "next/link";
import Image from "next/image";

export default function CourseCard({
  id, title, subtitle, image,
}: {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <div className="wd-dashboard-course w-[300px] max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <Link
        href={\`/courses/\${id}/home\`}
        className="wd-dashboard-course-link block text-neutral-900 no-underline"
      >
        <Image
          src={image}
          width={300}
          height={160}
          alt={title}
          className="h-40 w-full object-cover"
        />
        <div className="p-4">
          <h5 className="m-0 mb-2 truncate text-lg font-semibold whitespace-nowrap">
            {title}
          </h5>
          <p className="wd-dashboard-course-title m-0 mb-3 h-[100px] overflow-hidden text-sm text-neutral-600">
            {subtitle}
          </p>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            Go
          </button>
        </div>
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeAddedLines: [[1, 2]],
  },
  {
    id: "grid",
    title: "One column, then 2 / 3 / 4",
    kind: "content",
    bullets: [
      "`grid-cols-1` default, `sm:grid-cols-2`, `xl:grid-cols-3`, `2xl:grid-cols-4`",
      "`gap-8` is ~32px of white space between cards. The space grows when a grid column is wider than its card",
      "Existing `CourseCard` calls stay the same",
    ],
    code: `import CourseCard from "./CourseCard";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (3)</h2>
      <hr />
      <div
        id="wd-dashboard-courses"
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        <CourseCard
          id="1234"
          title="CS1234 React JS"
          subtitle="Full Stack software developer"
          image="/images/reactjs.jpg"
        />
        <CourseCard
          id="2345"
          title="CS2345 Node JS"
          subtitle="Server side JavaScript"
          image="/images/nodejs.jpg"
        />
        <CourseCard
          id="3456"
          title="CS3456 MongoDB"
          subtitle="NoSQL Databases"
          image="/images/mongodb.jpg"
        />
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
  },
  {
    id: "demo",
    title: "Live styled Dashboard",
    kind: "demo",
    bullets: [
      "At least three published courses, each linking to course Home",
      "Widen the window: more cards fit in a row. Narrow it: they wrap",
    ],
    embed: "kambaz-styled-dashboard",
  },
  {
    id: "checklist",
    title: "Finished Dashboard checklist",
    kind: "content",
    bullets: [
      "Dashboard tile selected in the sidebar (white / red)",
      "`Dashboard` title, rule, `Published Courses (3)`, second rule",
      "Cards ~300px with at least 32px (the `gap-8` gutter) between them; four across at the widest width",
    ],
  },
  {
    id: "next-up",
    title: "Next: course chrome",
    kind: "title",
    bullets: [
      "You can dress a card and wrap a responsive grid around it",
      "§2.4.3–2.4.5: Course Navigation, Modules, and Home + Status",
    ],
  },
];
