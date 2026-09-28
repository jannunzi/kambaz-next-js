import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import LocalUrl from "../../components/LocalUrl";
import Dashboard from "@/app/(kambaz)/dashboard/page";
import Link from "next/link";
import { OnYourOwn, WithAI } from "../../components/Practice";
import NestedExerciseList from "../../components/NestedExerciseList";
import { CH3_KAMBAZ_EXERCISES } from "../../exercise-lists/catalogs";

export default function KambazData() {
  return (
    <Section
      id="sec-3-9"
      title="3.9 Implementing a Data Driven Kambaz Application"
    >
      <p>
        <ChapterLink to={1} />{" "}and <ChapterLink to={2} />{" "}built Kambaz
        screens whose markup never changed. The labs you just finished were
        practice — throwaway snippets that nail one idea. Kambaz is the
        application you keep building across the course. Wire those screens
        to JSON so the UI follows the data: different courses on the
        dashboard, and different modules, assignments, and people once the
        URL encodes a course id. A single coverage checklist is in{" "}
        <SectionLink to="3.9.10" /> — use it after you have walked through
        the screens, not instead of wiring data as you read.
      </p>
      <p>
        Confirm the Kambaz landing route still redirects to Sign in:
      </p>
      <CodeBlock
        language="tsx"
        name="Kambaz"
        file="app/(kambaz)/page.tsx"
      >{`import { redirect } from "next/navigation";

export default function Kambaz() {
  redirect("/account/signin");
}`}</CodeBlock>

      <Section
        level={3}
        id="sec-3-9-1"
        title="3.9.1 Data Driven Kambaz Navigation"
      >
        <p>
          The sidebar in <SectionLink to="2.4.1" />{" "}listed each link by
          hand. Replace that repetition with an array of labels, paths, and
          icons, then <code>map</code>{" "}it — the same pattern as the Labs
          TOC in <SectionLink to="3.7.2" />. Account stays a special case
          (white-on-red when active). Courses intentionally points at{" "}
          <code>/dashboard</code>, because you only reach a course from a
          dashboard card.
        </p>
        <p>
          The component is a Client Component: it calls{" "}
          <code>usePathname</code>{" "}to highlight the active route. Each
          mapped <code>Link</code>{" "}needs <code>key={"{link.label}"}</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="KambazNavigation"
          file="app/(kambaz)/Navigation.tsx"
        >{`"use client";

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/app/labs/lab2/tailwind/utilities.css";

const LINKS = [
  { label: "Dashboard", path: "/dashboard", icon: AiOutlineDashboard },
  { label: "Courses", path: "/dashboard", icon: LiaBookSolid },
  { label: "Calendar", path: "/calendar", icon: IoCalendarOutline },
  { label: "Inbox", path: "/inbox", icon: FaInbox },
  { label: "Labs", path: "/labs", icon: LiaCogSolid },
] as const;

export default function KambazNavigation() {
  const pathname = usePathname() ?? "";
  const accountActive = pathname.includes("/account");

  return (
    <nav
      id="wd-kambaz-navigation"
      className="fixed bottom-0 top-0 z-20 hidden w-[120px] bg-black md:block"
    >
      <a
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
        target="_blank"
        rel="noreferrer"
        className="block bg-black py-3 text-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/NEU.png"
          width={75}
          height={75}
          alt="Northeastern University"
          className="mx-auto"
        />
      </a>
      <Link
        href="/account"
        id="wd-account-link"
        className={\`block py-3 text-center text-sm no-underline \${
          accountActive ? "bg-white text-red-600" : "bg-black text-white"
        }\`}
      >
        <FaRegCircleUser
          className={\`inline-block text-3xl \${
            accountActive ? "text-red-600" : "text-white"
          }\`}
        />
        <br />
        Account
      </Link>
      {LINKS.map((link) => {
        const active =
          link.label === "Dashboard" || link.label === "Courses"
            ? pathname.includes("/dashboard") || pathname.includes("/courses")
            : pathname.includes(link.path);
        const Icon = link.icon;
        return (
          <Link
            key={link.label}
            href={link.path}
            id={\`wd-\${link.label.toLowerCase()}-link\`}
            className={\`block py-3 text-center text-sm no-underline \${
              active ? "bg-white text-red-600" : "bg-black text-white"
            }\`}
          >
            <Icon className="inline-block text-3xl text-red-500" />
            <br />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}`}</CodeBlock>
        <OnYourOwn>
          If any sidebar item is still
          hardcoded, move it into <code>LINKS</code>{" "}and confirm the
          highlight still follows Dashboard, Courses, and Labs.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/Navigation.tsx, keep the existing LINKS array and Account as a special case. After Labs, add { label: "History", path: "/history", icon: IoCalendarOutline } so map renders one extra sample item. Do not hardcode that item outside LINKS, and do not remove Dashboard, Courses, or Labs.`}
        >
          Ask the assistant to add one extra sample sidebar item via{" "}
          <code>LINKS</code>{" "}— you still fold any leftover hardcoded links
          yourself:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-9-2"
        title="3.9.2 Implementing a Kambaz Database"
      >
        <p>
          Collect the JSON the UI will read under{" "}
          <code>app/(kambaz)/database</code>. Start with{" "}
          <code>courses.json</code>{" "}— each course has an{" "}
          <code>_id</code>{" "}(the value you will encode in the URL),{" "}
          <code>name</code>, <code>description</code>, and{" "}
          <code>image</code>, plus metadata such as dates and credits.
          Re-export every file from <code>index.ts</code>{" "}so screens can
          write <code>import * as db from &quot;../database&quot;</code>:
        </p>
        <CodeBlock
          language="ts"
          name="database"
          file="app/(kambaz)/database/index.ts"
        >{`import courses from "./courses.json";
import modules from "./modules.json";
import assignments from "./assignments.json";
import users from "./users.json";
import enrollments from "./enrollments.json";
export { courses, modules, assignments, users, enrollments };`}</CodeBlock>
        <p>
          You will add <code>modules.json</code>,{" "}
          <code>assignments.json</code>, <code>users.json</code>, and{" "}
          <code>enrollments.json</code>{" "}as the later screens need them. Keep
          at least three courses so the dashboard grid is obviously
          data-driven.
        </p>
        <OnYourOwn>
          Open <code>courses.json</code>{" "}and
          confirm each object has a unique <code>_id</code>{" "}you can put in
          a path such as <code>/courses/RS101/home</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/database/courses.json, keep every existing _id as it is. On each course object, add a "term" field set to "Spring 2023" if it is missing. Do not rename RS101, RS102, or RS103.`}
        >
          Paste this prompt so the assistant adds one extra sample JSON field
          — you still confirm each <code>_id</code>{" "}is unique:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-9-3"
        title="3.9.3 Data Driven Dashboard"
      >
        <p>
          Refactor the dashboard from <SectionLink to="2.4.2" />{" "}so it maps{" "}
          <code>db.courses</code>{" "}onto <code>CourseCard</code>. Spread each
          course into the card and key the card by{" "}
          <code>course._id</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Dashboard"
          file="app/(kambaz)/dashboard/page.tsx"
        >{`import "@/app/labs/lab2/tailwind/utilities.css";
import CourseCard from "./CourseCard";
import * as db from "../database";

export default function Dashboard() {
  const courses = db.courses;
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />
      <div
        id="wd-dashboard-courses"
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {courses.map((course) => (
          <CourseCard key={course._id} {...course} />
        ))}
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>CourseCard</code>{" "}destructures <code>_id</code>,{" "}
          <code>name</code>, <code>description</code>, and{" "}
          <code>image</code>. The <code>Link</code>{" "}encodes{" "}
          <code>_id</code>{" "}in the path so later screens can look the
          course up:
        </p>
        <CodeBlock
          language="tsx"
          name="CourseCard"
          file="app/(kambaz)/dashboard/CourseCard.tsx"
        >{`import Link from "next/link";
import Image from "next/image";

export default function CourseCard({
  _id,
  name,
  description,
  image,
}: {
  _id: string;
  name: string;
  description: string;
  image: string;
}) {
  return (
    <div className="wd-dashboard-course w-[300px] max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <Link
        href={\`/courses/\${_id}/home\`}
        className="wd-dashboard-course-link block text-neutral-900 no-underline"
      >
        <Image
          src={image}
          width={300}
          height={160}
          alt={name}
          className="h-40 w-full object-cover"
        />
        <div className="p-4">
          <h5 className="wd-dashboard-course-title m-0 mb-2 truncate text-lg font-semibold whitespace-nowrap">
            {name}
          </h5>
          <p className="wd-dashboard-course-description m-0 mb-3 h-[100px] overflow-hidden text-sm text-neutral-600">
            {description}
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
}`}</CodeBlock>
        <p>
          The published count interpolates{" "}
          <code>courses.length</code>. Clicking a card should land on{" "}
          <code>/courses/RS101/home</code>{" "}(or whichever{" "}
          <code>_id</code>{" "}you clicked). The target grid looks like{" "}
          <FigureLink to="3.9.3" />:
        </p>
        <BookFigure
          id="fig-3.9.3"
          src="/images/book/ch3/figures/fig-3-10-3-dashboard.png"
          alt="Data-driven Kambaz Dashboard with course cards from JSON"
          caption="Figure 3.9.3 — Data-driven Dashboard"
        />
        <LiveDemo
          mode="styled"
          name="Dashboard"
          file="app/(kambaz)/dashboard/page.tsx"
        >
          <Dashboard />
        </LiveDemo>
        <OnYourOwn>
          Add or rename one course in{" "}
          <code>courses.json</code>{" "}and confirm the dashboard grid and the
          published count update without editing{" "}
          <code>CourseCard.tsx</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/database/courses.json, keep any course I added or renamed. Append one more sample course with _id "RS104", name "Organic Chemistry", number "RS4580", the same date range as the others, department "D123", credits 4, a short description, and image "/images/reactjs.jpg". Do not edit app/(kambaz)/dashboard/CourseCard.tsx or overwrite my course.`}
        >
          Ask the assistant to append one extra sample course — leave the
          course you added or renamed as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-9-4"
        title="3.9.4 Data Driven Courses Screen"
      >
        <p>
          The course layout lives at{" "}
          <code>app/(kambaz)/courses/[cid]/layout.tsx</code>. Next.js
          provides <code>params</code>{" "}for the dynamic{" "}
          <code>[cid]</code>{" "}segment — await it, then{" "}
          <code>find</code>{" "}the course whose <code>_id</code>{" "}matches:
        </p>
        <CodeBlock
          language="tsx"
          name="CoursesLayout"
          file="app/(kambaz)/courses/[cid]/layout.tsx"
        >{`import { ReactNode } from "react";
import { FaAlignJustify } from "react-icons/fa6";
import "@/app/labs/lab2/tailwind/utilities.css";
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
}`}</CodeBlock>
        <p>
          Pass <code>cid</code>{" "}into course navigation so its links stay
          inside this course. The heading should show the selected course
          name, as in <FigureLink to="3.9.4" />:
        </p>
        <BookFigure
          id="fig-3.9.4"
          src="/images/book/ch3/figures/fig-3-10-4-courses.png"
          alt="Course screen heading with breadcrumb showing Home"
          caption="Figure 3.9.4 — Course Home breadcrumb"
        />
        <OnYourOwn>
          Open two different dashboard cards
          and confirm the red heading name changes with{" "}
          <code>cid</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/courses/[cid]/layout.tsx, keep the Breadcrumb as it is. After <Breadcrumb course={course} />, add a small span that interpolates {course?._id} in parentheses so the heading shows the id next to the name. Do not change how cid is found.`}
        >
          Paste this prompt so the assistant shows the sample{" "}
          <code>_id</code>{" "}beside the heading — you still click two cards
          to confirm the name follows <code>cid</code>:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-9-5"
        title="3.9.5 Data Driven Course Navigation (On Your Own)"
      >
        <p>
          Map the course sidebar the same way you mapped Kambaz
          navigation. Start from an array of sections — Home, Modules,
          Piazza, Zoom, Assignments, Quizzes, Grades, People — and build
          each <code>href</code>{" "}as{" "}
          <code>{`/courses/\${cid}/\${segment}`}</code>. Highlight with{" "}
          <code>usePathname</code>. The layout already passes{" "}
          <code>cid</code>{" "}as a prop, so this file does not need{" "}
          <code>useParams</code>.
        </p>
        <p>
          The course <code>Navigation.tsx</code>{" "}in the project already
          follows that pattern:
        </p>
        <CodeBlock
          language="tsx"
          name="CourseNavigation"
          file="app/(kambaz)/courses/[cid]/Navigation.tsx"
        >{`"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/app/labs/lab2/tailwind/utilities.css";
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
}`}</CodeBlock>
        <OnYourOwn>
          If any course link is still written
          out by hand, fold it into <code>LINKS</code>{" "}and confirm Home,
          Modules, Assignments, and People still highlight on their
          routes.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/courses/[cid]/Navigation.tsx, keep the existing LINKS entries. After People, add { segment: "announcements", id: "wd-course-announcements-link", label: "Announcements" } so map renders one extra sample item. Do not hardcode that link outside LINKS.`}
        >
          Ask the assistant to add one extra sample course-nav item via{" "}
          <code>LINKS</code>{" "}— you still fold any leftover handwritten
          links yourself:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-9-6"
        title="3.9.6 Implementing the Breadcrumb"
      >
        <p>
          A breadcrumb shows where you are in a nest of screens. The course
          name already identifies the course; appending the last path
          segment identifies the section — Home, Modules, Assignments (
          <FigureLink to="3.9.6a" />{" "}and <FigureLink to="3.9.6b" />
          ):
        </p>
        <BookFigure
          sources={[
            {
              id: "fig-3.9.6a",
              src: "/images/book/ch3/figures/fig-3-10-6a-breadcrumb.png",
              alt: "Breadcrumb showing a course name and Home",
              caption: "Figure 3.9.6a — Breadcrumb",
            },
            {
              id: "fig-3.9.6b",
              src: "/images/book/ch3/figures/fig-3-10-6b-breadcrumb.png",
              alt: "Breadcrumb showing a course name and another section",
              caption: "Figure 3.9.6b — Breadcrumb",
            },
          ]}
        />
        <p>
          <code>Breadcrumb</code>{" "}is a Client Component so it can read{" "}
          <code>usePathname</code>. The layout passes the{" "}
          <code>course</code>{" "}found in <SectionLink to="3.9.4" />:
        </p>
        <CodeBlock
          language="tsx"
          name="Breadcrumb"
          file="app/(kambaz)/courses/[cid]/Breadcrumb.tsx"
        >{`"use client";

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
      Course {course?.name} &gt; {label}
    </span>
  );
}`}</CodeBlock>
        <p>
          Optional chaining on <code>course?.name</code>{" "}guards the case
          where <code>find</code>{" "}returns <code>undefined</code>{" "}— the
          same <code>?.</code>{" "}from <SectionLink to="3.4.17" />.
        </p>
        <OnYourOwn>
          Click Home, then Modules, then
          Assignments and confirm the text after{" "}
          <code>&gt;</code>{" "}tracks the last path segment.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/courses/[cid]/Breadcrumb.tsx, keep the course name and last-segment label. If section === "table", show "People" instead of "Table"; otherwise keep the capitalized segment. Do not remove course?.name.`}
        >
          Paste this prompt so the assistant maps the People table segment as
          a sample extra — you still click Home, Modules, and Assignments:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-9-7"
        title="3.9.7 Data Driven Modules"
      >
        <p>
          Modules currently ignore which course you opened. Each module in{" "}
          <code>modules.json</code>{" "}has a <code>course</code>{" "}field that
          matches a course <code>_id</code>. Filter by the{" "}
          <code>cid</code>{" "}from <code>useParams</code>, then map modules
          and nested lessons — each with a <code>key</code>{" "}from{" "}
          <code>_id</code>. The target list looks like{" "}
          <FigureLink to="3.9.7" />:
        </p>
        <BookFigure
          id="fig-3.9.7"
          src="/images/book/ch3/figures/fig-3-10-7-modules.png"
          alt="Modules screen listing modules and lessons for the selected course"
          caption="Figure 3.9.7 — Data-driven Modules"
        />
        <CodeBlock
          language="tsx"
          name="Modules"
          file="app/(kambaz)/courses/[cid]/modules/page.tsx"
        >{`"use client";

import { useParams } from "next/navigation";
import "@/app/labs/lab2/tailwind/utilities.css";
import Module from "./Module";
import Lesson from "./Lesson";
import * as db from "../../../database";

export default function Modules() {
  const { cid } = useParams();
  const modules = db.modules.filter((module) => module.course === cid);
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
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
          <option value="unpublish-all">Unpublish All</option>
        </select>
        <button
          type="button"
          className="rounded border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          + Module
        </button>
      </div>
      <ul id="wd-modules" className="m-0 list-none p-0">
        {modules.map((module) => (
          <Module key={module._id} title={module.name}>
            {module.lessons?.map((lesson) => (
              <Lesson key={lesson._id} title={lesson.name} />
            ))}
          </Module>
        ))}
      </ul>
    </div>
  );
}`}</CodeBlock>
        <p>
          This page is a Client Component because it uses{" "}
          <code>useParams</code>. Nested <code>lessons?.map</code>{" "}uses
          optional chaining so a module without lessons does not throw.
          Open two courses and confirm the module titles change.
        </p>
        <OnYourOwn>
          Add one lesson to a module in{" "}
          <code>modules.json</code>{" "}and confirm it appears only for that
          module&apos;s course.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/database/modules.json, keep any lesson I added. On module M102 (Fuel and Combustion, course RS101), append one more sample lesson { "_id": "L204", "name": "Nozzle Design", "description": "How nozzle shape affects thrust.", "module": "M102" }. Do not change my personal lesson or move lessons to another course.`}
        >
          Ask the assistant to append one extra sample lesson — leave the
          lesson you added as yours, then confirm it stays on that course:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-9-8"
        title="3.9.8 Data Driven Assignments (On Your Own)"
      >
        <p>
          Refactor Assignments the same way as Modules: filter{" "}
          <code>db.assignments</code>{" "}where <code>assignment.course</code>{" "}
          equals the current <code>cid</code>, then map each row to{" "}
          <code>AssignmentItem</code>{" "}with <code>key={"{assignment._id}"}</code>.
          Encode both course id and assignment id in the editor URL. This
          screen can stay a Server Component and <code>await params</code>{" "}
          instead of <code>useParams</code>. The list should match{" "}
          <FigureLink to="3.9.8" />:
        </p>
        <BookFigure
          id="fig-3.9.8"
          src="/images/book/ch3/figures/fig-3-10-8-assignments.png"
          alt="Assignments screen listing assignments for the selected course"
          caption="Figure 3.9.8 — Data-driven Assignments"
        />
        <CodeBlock
          language="tsx"
          name="Assignments"
          file="app/(kambaz)/courses/[cid]/assignments/page.tsx"
        >{`import "@/app/labs/lab2/tailwind/utilities.css";
import { FaPlus, FaSearch } from "react-icons/fa";
import AssignmentItem from "./AssignmentItem";
import * as db from "../../../database";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  const assignments = db.assignments.filter(
    (assignment) => assignment.course === cid,
  );
  return (
    <div id="wd-assignments">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="relative">
          <FaSearch className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
          <input
            placeholder="Search for Assignments"
            id="wd-search-assignment"
            className="rounded border py-1.5 pr-3 pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            id="wd-add-assignment-group"
            type="button"
            className="inline-flex items-center gap-1 rounded border px-3 py-1.5 text-sm"
          >
            <FaPlus /> Group
          </button>
          <button
            id="wd-add-assignment"
            type="button"
            className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            <FaPlus /> Assignment
          </button>
        </div>
      </div>
      <h3
        id="wd-assignments-title"
        className="mb-3 flex items-center justify-between rounded bg-neutral-200 p-3 text-lg"
      >
        <span>ASSIGNMENTS 40% of Total</span>
        <button
          type="button"
          className="inline-flex items-center rounded border bg-white px-2 py-0.5 text-sm"
        >
          <FaPlus />
        </button>
      </h3>
      <ul id="wd-assignment-list" className="m-0 list-none p-0">
        {assignments.map((assignment) => (
          <AssignmentItem
            key={assignment._id}
            cid={cid}
            aid={assignment._id}
            title={assignment.title}
            details={\`Multiple Modules | Not available until \${assignment.available} | Due \${assignment.due} | \${assignment.points} pts\`}
          />
        ))}
      </ul>
    </div>
  );
}`}</CodeBlock>
        <OnYourOwn>
          Point each{" "}
          <code>AssignmentItem</code>{" "}at{" "}
          <code>{`/courses/\${cid}/assignments/\${aid}`}</code>{" "}and confirm
          two courses show different assignment titles from{" "}
          <code>assignments.json</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/database/assignments.json, keep existing assignments. Append one more sample assignment for RS102 with _id "A204", title "A4", points 100, due "2024-06-03", available "2024-05-27", and a short aerodynamics description. Do not change AssignmentItem hrefs I already set to /courses/\${cid}/assignments/\${aid}.`}
        >
          Paste this prompt so the assistant adds one extra sample assignment
          row — you still wire each item to the editor URL:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-9-8-1"
        title="3.9.8.1 Assignment Editor (On Your Own)"
      >
        <p>
          The editor at <code>assignments/[aid]/page.tsx</code>{" "}should
          display the assignment you clicked, not a hardcoded A1. Await{" "}
          <code>cid</code>{" "}and <code>aid</code>,{" "}
          <code>find</code>{" "}the row, and fill the fields with{" "}
          <code>assignment?.title ?? &quot;&quot;</code>{" "}and the other
          properties. Cancel and Save are <code>Link</code>s back to that
          course&apos;s assignments list. The form should match{" "}
          <FigureLink to="3.9.8.1" />:
        </p>
        <BookFigure
          id="fig-3.9.8.1"
          src="/images/book/ch3/figures/fig-3-10-8-1-editor.png"
          alt="Assignment editor filled from the selected assignment JSON"
          caption="Figure 3.9.8.1 — Data-driven Assignment Editor"
        />
        <CodeBlock
          language="tsx"
          name="AssignmentEditor"
          file="app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx"
        >{`import Link from "next/link";
import * as db from "../../../database";

export default async function AssignmentEditor({
  params,
}: {
  params: Promise<{ cid: string; aid: string }>;
}) {
  const { cid, aid } = await params;
  const assignment = db.assignments.find((a) => a._id === aid);
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue={assignment?.title ?? ""} />
      <br />
      <br />
      <textarea
        id="wd-description"
        defaultValue={assignment?.description ?? ""}
        rows={8}
        className="w-full"
      />
      <br />
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={assignment?.points ?? 100} />
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-due-date">Due</label>
            </td>
            <td>
              <input
                type="date"
                id="wd-due-date"
                defaultValue={assignment?.due}
              />
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-available-from">Available from</label>
            </td>
            <td>
              <input
                type="date"
                id="wd-available-from"
                defaultValue={assignment?.available}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <Link href={\`/courses/\${cid}/assignments\`} id="wd-cancel">
        Cancel
      </Link>{" "}
      <Link href={\`/courses/\${cid}/assignments\`} id="wd-save">
        Save
      </Link>
    </div>
  );
}`}</CodeBlock>
        <OnYourOwn>
          Open two different assignments and
          confirm the title, description, points, due date, and available
          date follow <code>aid</code>, and that Cancel/Save return to that
          course&apos;s list.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx, keep the existing fields filled from assignment?.title and the other properties. After the name input, add a read-only line Assignment id: {aid} so the sample id is visible. Do not change Cancel/Save hrefs back to /courses/\${cid}/assignments.`}
        >
          Ask the assistant to show the sample <code>aid</code>{" "}on the form
          — you still open two assignments and check Cancel/Save:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-9-9"
        title="3.9.9 Data Driven People Screen"
      >
        <p>
          People currently lists the same hardcoded rows for every course.
          <code>users.json</code>{" "}holds the people;{" "}
          <code>enrollments.json</code>{" "}ties a <code>user</code>{" "}id to a{" "}
          <code>course</code>{" "}id. Filter users with{" "}
          <code>enrollments.some</code>{" "}— the same <code>some</code>{" "}from{" "}
          <SectionLink to="3.4.8" /> — then map the enrolled users with{" "}
          <code>key={"{user._id}"}</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="PeopleTable"
          file="app/(kambaz)/courses/[cid]/people/table/page.tsx"
        >{`import { FaUserCircle } from "react-icons/fa";
import "@/app/labs/lab2/tailwind/utilities.css";
import * as db from "../../../../database";

export default async function PeopleTable({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  const { users, enrollments } = db;
  const enrolled = users.filter((usr) =>
    enrollments.some(
      (enrollment) => enrollment.user === usr._id && enrollment.course === cid,
    ),
  );
  return (
    <div id="wd-people-table" className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300">
            <th className="p-2">Name</th>
            <th className="p-2">Login ID</th>
            <th className="p-2">Section</th>
            <th className="p-2">Role</th>
            <th className="p-2">Last Activity</th>
            <th className="p-2">Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {enrolled.map((user) => (
            <tr key={user._id} className="odd:bg-neutral-50">
              <td className="wd-full-name p-2 text-nowrap">
                <FaUserCircle className="me-2 inline align-middle text-3xl text-neutral-500" />
                <span className="wd-first-name">{user.firstName}</span>{" "}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id p-2">{user.loginId}</td>
              <td className="wd-section p-2">{user.section}</td>
              <td className="wd-role p-2">{user.role}</td>
              <td className="wd-last-activity p-2">{user.lastActivity}</td>
              <td className="wd-total-activity p-2">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`}</CodeBlock>
        <p>
          Open People for RS101 versus RS102 and confirm the names change
          with enrollment. Visit{" "}
          <LocalUrl href="/dashboard" />{" "}to start from the data-driven
          dashboard, or jump to a course Home such as{" "}
          <Link href="/courses/RS101/home">/courses/RS101/home</Link>.
        </p>
        <OnYourOwn>
          Enroll an existing user in a second
          course in <code>enrollments.json</code>{" "}and confirm that person
          appears in both People tables.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/database/enrollments.json, keep any enrollment I added. Append one more sample object { "_id": "16", "user": "567", "course": "RS102" } so user 567 also appears in the RS102 People table. Do not remove my extra enrollment or change existing ids.`}
        >
          Ask the assistant to add one extra sample enrollment — leave the
          second-course enrollment you added as yours:
        </WithAI>
      </Section>

      <Section level={3} id="sec-3-9-10" title="3.9.10 Exercises">
        <p>
          Use this checklist to confirm the data-driven Kambaz prototype
          covers every screen in <SectionLink to="3.9" />. Each item points
          back to the section where you wired the worked example. Build in
          order as you read — this list is for checking coverage, not a
          substitute for the walkthroughs. Course Navigation, Assignments,
          and the Assignment Editor stay <strong>On your own</strong>: match the ids and
          LiveDemos in those sections. Each screen is listed once, with
          Lab, <strong>On your own</strong>, and <strong>With AI</strong>{" "}
          nested as a/b/c.
        </p>
        <NestedExerciseList groups={CH3_KAMBAZ_EXERCISES} />
      </Section>
    </Section>
  );
}
