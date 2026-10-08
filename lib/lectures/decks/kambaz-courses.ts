import type { LectureSlide } from "../types";

export const KAMBAZ_COURSES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "KAMBAZ COURSES",
      "Dynamic [cid] + Course Navigation",
    ],
  },
  {
    id: "home-stub",
    title: "Creating the Courses Screen",
    kind: "content",
    bullets: [
      "Clicking a course in Dashboard navigates to the **Course** screen",
      "`[cid]` is a **dynamic segment** — `1234` in `/courses/1234/home`",
      "Start with Home: `app/(kambaz)/courses/[cid]/home/page.tsx`",
      "You do **not** need a leftover `page.tsx` directly under `[cid]`",
    ],
    code: `export default function Home() {
  return (
    <div id="wd-home">
      <h2>Home 1234</h2>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/home/page.tsx",
  },
  {
    id: "course-nav",
    title: "Course Navigation Sidebar",
    kind: "content",
    bullets: [
      "Home, Modules, Piazza, Zoom, Assignments, Quizzes, Grades, People",
      "Pass `cid` so links stay correct for every course",
      "Template literal: `` `/courses/${cid}/home` ``",
    ],
    code: `import Link from "next/link";

export default function CourseNavigation({ cid }: { cid: string }) {
  return (
    <div id="wd-courses-navigation">
      <Link href={\`/courses/\${cid}/home\`} id="wd-course-home-link">
        Home
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/modules\`} id="wd-course-modules-link">
        Modules
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/piazza\`} id="wd-course-piazza-link">
        Piazza
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/zoom\`} id="wd-course-zoom-link">
        Zoom
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/assignments\`} id="wd-course-assignments-link">
        Assignments
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/quizzes\`} id="wd-course-quizzes-link">
        Quizzes
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/grades\`} id="wd-course-grades-link">
        Grades
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/people/table\`} id="wd-course-people-link">
        People
      </Link>{" "}
      <br />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/Navigation.tsx",
  },
  {
    id: "target-course-nav",
    title: "Canvas target: Course nav",
    kind: "content",
    bullets: [
      "Book Figure 2.4.3 — Course Navigation beside the course content",
      "This week: a **plain list**. Active-route styling is Chapter 2",
    ],
    imageSrc: "/images/book/kambaz/course-navigation.png",
    imageAlt: "Target Course Navigation sidebar",
    imageCaption: "Figure 2.4.3 — Course Navigation",
  },
  {
    id: "layout",
    title: "Layout Navigation on Left",
    kind: "content",
    bullets: [
      "`params` holds the dynamic segment as a **Promise**: a value that arrives later",
      "Mark the layout **`async`** so it can wait, then **`await params`** to read `cid`",
      "Wrapper `wd-courses`. Heading shows `Courses {cid}`",
      "Nav left, `{children}` right — same table chrome as Account",
    ],
    code: `import { ReactNode } from "react";
import CourseNavigation from "./Navigation";

export default async function CoursesLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ cid: string }>;
}>) {
  const { cid } = await params;
  return (
    <div id="wd-courses">
      <h2>Courses {cid}</h2>
      <hr />
      <table>
        <tbody>
          <tr>
            <td valign="top" width="200">
              <CourseNavigation cid={cid} />
            </td>
            <td valign="top" width="100%">
              {children}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/layout.tsx",
  },
  {
    id: "layout-live",
    title: "Course layout: live demo",
    kind: "demo",
    embed: "kambaz-courses",
    interactiveHint:
      "Click Piazza or Zoom. Placeholder heading pages are enough this week.",
  },
  {
    id: "next-16-4-build-fix",
    title: "If npm run build fails on Next.js 16.4",
    kind: "content",
    bullets: [
      "`npm run dev` works, but `npm run build` or the Vercel deploy fails",
      "First error: “Next.js encountered URL data `usePathname()` in a Client Component outside of `<Suspense>`”",
      "Further down: “Next.js encountered uncached or runtime data during prerendering”",
    ],
  },
  {
    id: "next-16-4-build-fix-steps",
    title: "Fixing the Next.js 16.4 build",
    kind: "content",
    bullets: [
      "Check `package.json`: `\"next\": \"16.4.0\"` means the project was created with Next.js 16.4",
      "In `next.config.ts`, delete **both** `cacheComponents: true,` and `partialPrefetching: true,`",
      "Deleting only the first fails with “`partialPrefetching` requires `cacheComponents` to be enabled”",
      "Then run `npm run build` again",
    ],
  },
  {
    id: "placeholders",
    title: "Placeholder pages this week",
    kind: "content",
    bullets: [
      "Real screens this chapter: Home, Modules, Assignments",
      "Heading-only stubs: Piazza, Zoom, Quizzes, Grades, People",
      "People’s URL is `/courses/[cid]/people/table`",
    ],
    code: `export default function Piazza() {
  return <h2>Piazza</h2>;
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/piazza/page.tsx",
  },
  {
    id: "next-up",
    title: "Next: Modules nested lists",
    kind: "title",
    bullets: [
      "Weeks → lessons → content items, then reuse that list on Home",
    ],
  },
];
