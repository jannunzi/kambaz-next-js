import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import Section from "../../components/Section";
import BookSectionSlidesLink from "../../components/BookSectionSlidesLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import ContainFixed from "../../components/ContainFixed";
import KambazNavigation from "@/app/(kambaz)/Navigation";
import CourseNavigation from "@/app/(kambaz)/courses/[cid]/Navigation";
import Dashboard from "@/app/(kambaz)/dashboard/page";
import Modules from "@/app/(kambaz)/courses/[cid]/modules/page";
import Home from "@/app/(kambaz)/courses/[cid]/home/page";
import Assignments from "@/app/(kambaz)/courses/[cid]/assignments/page";
import PeopleTable from "@/app/(kambaz)/courses/[cid]/people/table/page";
import AssignmentEditor from "@/app/(kambaz)/courses/[cid]/assignments/[aid]/page";
import Signin from "@/app/(kambaz)/account/signin/page";
import PlainKambazNavigation from "@/app/book/ch1/embeds/PlainKambazNavigation";
import PlainCourseNavigation from "@/app/book/ch1/embeds/PlainCourseNavigation";
import DashboardDemo from "@/app/book/ch1/embeds/DashboardDemo";
import ModulesDemo from "@/app/book/ch1/embeds/ModulesDemo";
import HomeDemo from "@/app/book/ch1/embeds/HomeDemo";
import AssignmentsDemo from "@/app/book/ch1/embeds/AssignmentsDemo";
import AssignmentEditorDemo from "@/app/book/ch1/embeds/AssignmentEditorDemo";
import AccountScreensDemo from "@/app/book/ch1/embeds/AccountScreensDemo";
import Link from "next/link";
import { OnYourOwn, WithAI } from "../../components/Practice";
import NestedExerciseList from "../../components/NestedExerciseList";
import { CH2_KAMBAZ_EXERCISES } from "../../exercise-lists/catalogs";

export default function KambazStyling() {
  return (
    <Section id="sec-2-4" title="2.4 Styling Kambaz with CSS and Tailwind">
      <p>
        <ChapterLink to={1} />{" "}prototyped Kambaz with nothing but plain HTML, including{" "}
        <code>table</code>/<code>tr</code>/<code>td</code>{" "}elements to force
        content into side-by-side columns — functional, but exactly the kind
        of layout-via-table this chapter has spent <SectionLink to="2.1.18" />–<SectionLink to="2.1.19" />{" "}replacing
        with CSS. Before restyling each screen, we wire Tailwind into the Kambaz
        shell the right way, then swap those tables for flex layouts. A single
        coverage checklist is in <SectionLink to="2.4.10" /> — use it after
        you have walked through the screens, not instead of restyling them
        as you read.
      </p>
      <p>
        In <SectionLink to="2.3" />{" "}the Tailwind lab imports the full library
        (<code>@import &quot;tailwindcss&quot;</code>), which includes{" "}
        <strong>Preflight</strong> — a base reset that would also wipe plain
        HTML defaults elsewhere. <SectionLink to="2.2" />{" "}already loads theme
        and utilities, with no Preflight, from the Labs file{" "}
        <code>utilities.css</code>. Kambaz does not import that file. The same
        two lines open <code>kambaz.css</code>, then a few app-wide rules — a
        system sans-serif base (without Preflight the browser often falls back
        to Times), <code>box-sizing</code>, and later the fixed-sidebar offset.
        The Kambaz layout imports only <code>kambaz.css</code>, once. Putting{" "}
        <code>font-sans</code>{" "}on the root as well means Tailwind&apos;s
        system stack applies even if the CSS rule is incomplete:
      </p>
      <CodeBlock
        language="css"
        name="Kambaz base"
        file="app/(kambaz)/kambaz.css"
      >{`@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/utilities" layer(utilities);

/*
 * Base look for the live app. Book styled demos get a
 * sans stack from \`.book-live-demo-styled\`. Kambaz only
 * loads Tailwind utilities (no Preflight), so without
 * this the browser default (Times) shows through.
 */
#wd-kambaz {
  font-family: system-ui, -apple-system, "Segoe UI",
    Roboto, "Helvetica Neue", "Noto Sans",
    "Liberation Sans", Arial, sans-serif;
  color: #212529;
  line-height: 1.5;
}

#wd-kambaz,
#wd-kambaz * {
  box-sizing: border-box;
}`}</CodeBlock>
      <CodeBlock
        language="tsx"
        name="KambazLayout"
        file="app/(kambaz)/layout.tsx"
      >{`import { ReactNode } from "react";
import "./kambaz.css";
import KambazNavigation from "./Navigation";

export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-kambaz" className="font-sans">
      <KambazNavigation />
      <div className="wd-main-content-offset p-3">{children}</div>
    </div>
  );
}`}</CodeBlock>
      <p>
        With that shell in place, the remaining table wrappers come out of{" "}
        <code>app/(kambaz)/layout.tsx</code>{" "}(if any),{" "}
        <code>app/(kambaz)/courses/[cid]/layout.tsx</code>, and{" "}
        <code>app/(kambaz)/courses/[cid]/home/page.tsx</code>, replaced with{" "}
        <code>flex</code>{" "}containers so the Course Navigation sidebar and Course
        Status column sit beside the main content through CSS instead of table
        cells. Both course files come back into focus below once Navigation and
        Status are styled — including the responsive hide order (
        <code>hidden lg:block</code>{" "}for Status first, then{" "}
        <code>hidden md:block</code>{" "}for both sidebars together).
      </p>
      <p>
        Each Kambaz screen below follows the same arc: a <strong>target</strong>{" "}
        screenshot, the plain <ChapterLink to={1} />{" "}prototype already built,
        the <strong>code</strong> that closes the styling gap, and a{" "}
        <strong>styled result</strong> we can compare live.
      </p>

      <h3
        id="sec-2-4-1"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        2.4.1 Styling the Kambaz Navigation Sidebar{" "}
        <BookSectionSlidesLink sectionId="sec-2-4-1" />
      </h3>
      <p>
        The Kambaz Navigation sidebar from <SectionLink to="1.4" />{" "}was a plain vertical list of
        links. Pin it to the left edge as a fixed black column of icon-and-label
        tiles so the rest of Kambaz can scroll beside it.
      </p>
      <p>
        The finished sidebar is expected to look like a narrow black column of centered
        icon links, with the active route highlighted in white and red (
        <FigureLink to="2.4.1" />):
      </p>
      <BookFigure
        id="fig-2.4.1"
        src="/images/book/kambaz/navigation.png"
        alt="Target Kambaz Navigation sidebar with Dashboard"
        caption="Figure 2.4.1 — Kambaz Navigation"
      />
      <p>
        In <ChapterLink to={1} />{" "}it was left looking like this — functional HTML,
        no real styling:
      </p>
      <LiveDemo
        name="Chapter 1 — unstyled"
        file="app/book/ch1/embeds/PlainKambazNavigation.tsx"
      >
        <PlainKambazNavigation />
      </LiveDemo>
      <p>
        If we rebuild the sidebar with React Icons and Tailwind so
        each link becomes an icon-and-label tile, then pin the whole bar to the
        window, the gap closes. The markup can stay inline as in the starter below:
      </p>
      <CodeBlock
        language="tsx"
        name="KambazNavigation"
        file="app/(kambaz)/Navigation.tsx"
      >{`"use client";

import { AiOutlineDashboard } from "react-icons/ai";
import { FaRegCircleUser } from "react-icons/fa6";
import Link from "next/link";

export default function KambazNavigation() {
  return (
    <nav
      id="wd-kambaz-navigation"
      className="fixed bottom-0 top-0 z-20 hidden w-[120px] bg-black md:block"
    >
      <Link
        href="/account"
        id="wd-account-link"
        className="block bg-black py-3 text-center text-sm text-white no-underline"
      >
        <FaRegCircleUser className="inline-block text-3xl text-red-500" />
        <br />
        Account
      </Link>
      <Link
        href="/dashboard"
        id="wd-dashboard-link"
        className="block bg-white py-3 text-center text-sm text-red-600 no-underline"
      >
        <AiOutlineDashboard className="inline-block text-3xl text-red-600" />
        <br />
        Dashboard
      </Link>
      {/* ...Courses, Calendar, Inbox, Labs... */}
    </nav>
  );
}`}</CodeBlock>
      <p>
        A handful of Tailwind utilities do the positioning work:{" "}
        <code>fixed</code>{" "}with <code>top-0 bottom-0</code>{" "}stretches the
        sidebar the full height of the window and keeps it from scrolling with
        the page; <code>hidden md:block</code>{" "}hides it below the{" "}
        <code>md</code>{" "}breakpoint and reveals it again at{" "}
        <code>md</code>{" "}and up; and <code>z-20</code>{" "}keeps it above the
        page content it now overlaps. That overlap is the catch: once the
        sidebar leaves the normal flow, the content beside it no longer
        knows to leave 120 pixels of room. If we append this to the{" "}
        <code>kambaz.css</code>{" "}base started above, scoped inside a media
        query, the offset only applies when the sidebar is visible:
      </p>
      <CodeBlock
        language="css"
        name="Kambaz styles"
        file="app/(kambaz)/kambaz.css"
      >{`@media (min-width: 768px) {
  .wd-main-content-offset {
    margin-left: 120px;
  }
}`}</CodeBlock>
      <p>
        Optionally the Northeastern logo sits above Account (a plain{" "}
        <code>&lt;img&gt;</code>{" "}to <code>/images/NEU.png</code>) so the bar
        matches the target screenshots. With those classes in place, the live
        component looks like this
        (contained so <code>fixed</code> does not escape this figure):
      </p>
      <LiveDemo mode="styled" name="Styled result" file="app/(kambaz)/Navigation.tsx">
        <ContainFixed height={360}>
          <KambazNavigation />
          <div style={{ marginLeft: 120, padding: "1rem", color: "#6b7280" }}>
            Dashboard, Courses, and every other Kambaz screen render here,
            offset by <code>wd-main-content-offset</code>.
          </div>
        </ContainFixed>
      </LiveDemo>
      <p>The finished sidebar is expected to:</p>
      <ul>
        <li>
          be a narrow black column about 110–120 pixels wide
        </li>
        <li>
          use red icons, except the Account icon, which is white
        </li>
        <li>
          highlight the active link with a white background and red text;
          leave the others black with white text
        </li>
        <li>
          center icons and labels in the bar
        </li>
      </ul>
      <OnYourOwn>
        In <code>Navigation.tsx</code>, finish any
        remaining sidebar links with fitting React Icons, then confirm the active
        link (white background, red text) and the{" "}
        <code>wd-main-content-offset</code>{" "}rule in <code>kambaz.css</code>{" "}still
        keep content clear of the fixed bar.
      </OnYourOwn>
      <WithAI
        prompt={`In app/(kambaz)/Navigation.tsx, keep my personal sidebar links and icon choices unchanged. After the existing tiles, add one more sample link with id wd-ai-nav-help to /labs with a fitting icon (for example FaCircleQuestion) and the same tile classes as the idle black/white links. Do not change Account/Dashboard or my personal icons. Do not overwrite wd-main-content-offset in app/(kambaz)/kambaz.css.`}
      >
        Paste this prompt to add a second sample tile — then confirm the active
        link has a white background and red text, and content stays clear of the bar:
      </WithAI>

      <h3
        id="sec-2-4-2"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        2.4.2 Styling the Kambaz Dashboard Screen{" "}
        <BookSectionSlidesLink sectionId="sec-2-4-2" />
      </h3>
      <p>
        In <SectionLink to="1.4.3" />{" "}a plain{" "}
        <code>CourseCard</code>{" "}was already extracted and several of them rendered inside{" "}
        <code>#wd-dashboard-courses</code>. Those cards still look like unstyled
        HTML — add borders, shadows, and a responsive grid that wraps as the
        window narrows.
      </p>
      <p>
        The finished Dashboard is expected to show a titled page of course cards in a
        responsive grid — four across at the widest width, fewer columns as the
        window shrinks — <FigureLink to="2.4.2a" />{" "}at a wide width,{" "}
        <FigureLink to="2.4.2b" />{" "}as it
        narrows:
      </p>
      <BookFigure
        sources={[
          {
            id: "fig-2.4.2a",
            src: "/images/book/kambaz/dashboard-wide.png",
            alt: "Target Dashboard at wide width",
            caption: "Figure 2.4.2a — Dashboard Screen (wide)",
          },
          {
            id: "fig-2.4.2b",
            src: "/images/book/kambaz/dashboard-medium.png",
            alt: "Target Dashboard as the window narrows",
            caption: "Figure 2.4.2b — Dashboard Screen (medium)",
          },
        ]}
      />
      <p>
        In <ChapterLink to={1} />{" "}it was left looking like this — functional HTML,
        no real styling:
      </p>
      <LiveDemo
        name="Chapter 1 — unstyled"
        file="app/book/ch1/embeds/DashboardDemo.tsx"
      >
        <DashboardDemo />
      </LiveDemo>
      <p>
        If we add Tailwind utilities to <code>CourseCard</code>{" "}itself,
        then turn the courses container into a responsive{" "}
        <code>grid</code>{" "}with <code>gap-8</code>, the cards close the gap. No compound{" "}
        <code>Card</code>/<code>CardBody</code>{" "}kit and no custom{" "}
        <code>Row</code>/<code>Col</code>{" "}— the same HTML from{" "}
        <ChapterLink to={1} />{" "}stays in place and gets dressed with utility classes. Starting with{" "}
        <code>CourseCard</code>, the structure from <SectionLink to="1.4.3" />{" "}remains;
        border, shadow, fixed width, image crop, title truncation, and a
        primary-looking Go button do the rest:
      </p>
      <CodeBlock
        language="tsx"
        name="CourseCard"
        file="app/(kambaz)/dashboard/CourseCard.tsx"
      >{`import Link from "next/link";
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
}`}</CodeBlock>
      <p>
        After that, the Dashboard container becomes one column by default, two from{" "}
        <code>sm</code>, three from <code>xl</code>, four from{" "}
        <code>2xl</code>, with <code>gap-8</code>{" "}(~32px) between cards. The
        existing <code>CourseCard</code>{" "}calls stay the same:
      </p>
      <CodeBlock
        language="tsx"
        name="Dashboard"
        file="app/(kambaz)/dashboard/page.tsx"
      >{`import CourseCard from "./CourseCard";

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
        {/* ...two more CourseCards... */}
      </div>
    </div>
  );
}`}</CodeBlock>
      <p>
        With those classes in place, the live component looks like this:
      </p>
      <LiveDemo
        mode="styled"
        name="Styled result"
        file="app/(kambaz)/dashboard/page.tsx"
      >
        <Dashboard />
      </LiveDemo>
      <p>The finished Dashboard is expected to:</p>
      <ul>
        <li>
          show the Dashboard link selected in the sidebar (red text, red icon,
          white background)
        </li>
        <li>
          start with a <code>Dashboard</code>{" "}title and horizontal rule, then a{" "}
          <code>Published Courses</code>{" "}subtitle and a second rule
        </li>
        <li>
          render at least 3 courses as cards, each linking to the course Home
          screen
        </li>
        <li>
          keep cards roughly 300 pixels wide regardless of window width, with
          30–40 pixels of white space between them
        </li>
        <li>
          fit at least 4 course cards in a row at the widest window size, wrapping
          remaining cards as the window narrows
        </li>
      </ul>
      <OnYourOwn>
        In <code>CourseCard.tsx</code>{" "}or{" "}
        <code>dashboard/page.tsx</code>, personalize at least one card (title,
        subtitle, or image) and resize the window to confirm the responsive{" "}
        <code>grid</code>{" "}still wraps cleanly.
      </OnYourOwn>
      <WithAI
        prompt={`In app/(kambaz)/dashboard/page.tsx, keep my personalized course card unchanged. After the existing CourseCard calls, add one more sample CourseCard with id CS9999, title "CS9999 Sample Course", subtitle "Assistant-generated sample — not my course", and image "/images/reactjs.jpg". Do not change CourseCard.tsx styling.`}
      >
        Paste this prompt to add a fourth sample card — then resize the window
        and confirm the grid still wraps:
      </WithAI>

      <h3
        id="sec-2-4-3"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        2.4.3 Styling the Course Navigation Sidebar{" "}
        <BookSectionSlidesLink sectionId="sec-2-4-3" />
      </h3>
      <p>
        Clicking a course from the Dashboard opens that course&apos;s Home
        screen with its own Course Navigation sidebar from <SectionLink to="1.4.4" />.
        Style that sidebar as a narrow list group with red idle
        links and a black left border on the active route.
      </p>
      <p>
        The finished Course Navigation is expected to be a compact vertical list — red
        text for idle links, black text plus a left border for the active route
        (<FigureLink to="2.4.3" />):
      </p>
      <BookFigure
        id="fig-2.4.3"
        src="/images/book/kambaz/course-navigation.png"
        alt="Target Course Navigation sidebar"
        caption="Figure 2.4.3 — Course Navigation"
        imageClassName="h-auto w-[160px] rounded border border-neutral-200 bg-white object-contain"
      />
      <p>
        In <ChapterLink to={1} />{" "}it was left looking like this — functional HTML,
        no real styling:
      </p>
      <LiveDemo
        name="Chapter 1 — unstyled"
        file="app/book/ch1/embeds/PlainCourseNavigation.tsx"
      >
        <PlainCourseNavigation cid="1234" />
      </LiveDemo>
      <p>
        If we keep the sidebar narrow (~140px) — only the label
        column — and refactor the plain links into a list group, the gap closes. Here{" "}
        <code>usePathname</code>{" "}highlights the active route. Nested
        paths count as active too (so <code>/assignments/123</code> still lights up
        Assignments) with <code>startsWith</code>:
      </p>
      <CodeBlock
        language="tsx"
        name="CourseNavigation"
        file="app/(kambaz)/courses/[cid]/Navigation.tsx"
      >{`"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
}`}</CodeBlock>
      <p>
        With list-group rules in <code>kambaz.css</code>, the column stays
        narrow, idle links are red, and the active link is black with a 3px
        left border:
      </p>
      <CodeBlock
        language="css"
        name="Kambaz styles"
        file="app/(kambaz)/kambaz.css"
      >{`.list-group.wd {
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
}`}</CodeBlock>
      <p>
        With those classes in place, the live component looks like this:
      </p>
      <LiveDemo
        mode="styled"
        name="Styled result"
        file="app/(kambaz)/courses/[cid]/Navigation.tsx"
      >
        <div className="w-[140px]">
          <CourseNavigation cid="1234" />
        </div>
      </LiveDemo>
      <OnYourOwn>
        In{" "}
        <code>courses/[cid]/Navigation.tsx</code>, finish every course link as a
        list-group item, confirm the active route gets the black left border,
        and keep the sidebar about 140px wide in the course layout.
      </OnYourOwn>
      <WithAI
        prompt={`In app/(kambaz)/courses/[cid]/Navigation.tsx, keep any personal extra course links I added. After the existing list-group items, add one more sample link with id wd-course-ai-link labeled "Sample" pointing to the course home path, using the same idle list-group-item border-0 text-red-600 classes. Do not change my personal links or the active-route border logic. Keep the sidebar about 140px wide in app/(kambaz)/courses/[cid]/layout.tsx.`}
      >
        Paste this prompt to add a second sample course link — then confirm the
        active route still gets the black left border:
      </WithAI>

      <h3
        id="sec-2-4-4"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        2.4.4 Styling the Modules Screen
      </h3>
      <p>
        The Modules list is shared between the Modules screen and the Home
        screen, so it gets styled once here. In <SectionLink to="1.4.5" />{" "}plain{" "}
        <code>Module</code>{" "}and <code>Lesson</code>{" "}components were already extracted — this section
        adds gray module headers, green lesson borders, and checkmark controls.
      </p>
      <p>
        The finished Modules screen is expected to show a toolbar above a list of
        modules with gray title bars and green-bordered lessons, each with a
        checkmark on the right (<FigureLink to="2.4.4" />):
      </p>
      <BookFigure
        id="fig-2.4.4"
        src="/images/book/kambaz/modules-list.png"
        alt="Target styled Modules screen"
        caption="Figure 2.4.4 — Modules Screen"
      />
      <p>
        In <ChapterLink to={1} />{" "}it was left looking like this — functional HTML,
        no real styling:
      </p>
      <LiveDemo
        name="Chapter 1 — unstyled"
        file="app/book/ch1/embeds/ModulesDemo.tsx"
      >
        <ModulesDemo />
      </LiveDemo>
      <p>
        If we keep the HTML from <ChapterLink to={1} />{" "}and add
        Tailwind classes, the Modules list closes the gap. A small <code>GreenCheckmark</code>{" "}helper
        covers the publish indicator every module and lesson needs:
      </p>
      <CodeBlock
        language="tsx"
        name="GreenCheckmark"
        file="app/(kambaz)/courses/[cid]/modules/GreenCheckmark.tsx"
      >{`import { FaCheckCircle, FaCircle } from "react-icons/fa";

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
}`}</CodeBlock>
      <p>
        If we drop that checkmark into <code>Module</code>{" "}and add a gray header
        bar plus spacing:
      </p>
      <CodeBlock
        language="tsx"
        name="Module"
        file="app/(kambaz)/courses/[cid]/modules/Module.tsx"
      >{`import type { ReactNode } from "react";
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
}`}</CodeBlock>
      <p>
        After styling <code>Lesson</code>{" "}the same way — checkmark on the right, green
        left border for the accent (plain CSS in{" "}
        <code>kambaz.css</code>{" "}works too if preferred):
      </p>
      <CodeBlock
        language="tsx"
        name="Lesson"
        file="app/(kambaz)/courses/[cid]/modules/Lesson.tsx"
      >{`import type { ReactNode } from "react";
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
}`}</CodeBlock>
      <p>
        The Modules page keeps mounting the same{" "}
        <code>Module</code>/<code>Lesson</code>{" "}tree from <ChapterLink to={1} />.
        With the toolbar styled via flex and explicit light borders — bare{" "}
        <code>border</code>{" "}often renders near-black — the controls match Canvas with{" "}
        <code>border-neutral-300</code>{" "}on secondary buttons and{" "}
        <code>border-red-600</code>{" "}on the red <code>+ Module</code>{" "}button:
      </p>
      <CodeBlock
        language="tsx"
        name="Modules toolbar"
        file="app/(kambaz)/courses/[cid]/modules/page.tsx"
      >{`<div className="mb-3 flex flex-wrap items-center gap-2">
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
{/* ...Module / Lesson tree... */}`}</CodeBlock>
      <p>
        With those classes in place, the live component looks like this:
      </p>
      <LiveDemo
        mode="styled"
        name="Styled result"
        file="app/(kambaz)/courses/[cid]/modules/page.tsx"
      >
        <Modules />
      </LiveDemo>
      <p>The finished Modules screen is expected to:</p>
      <ul>
        <li>
          show a row of controls (Collapse All, View Progress, a Publish All
          dropdown, and an Add Module button) above the module list
        </li>
        <li>
          give each module title a gray header bar, and each lesson a green left
          border
        </li>
        <li>
          show a green checkmark control on the right of both modules and
          lessons
        </li>
      </ul>
      <OnYourOwn>
        In <code>Module.tsx</code>{" "}and{" "}
        <code>Lesson.tsx</code>, add one more module or lesson with your own
        title, keeping the gray module header, green lesson border, and{" "}
        <code>GreenCheckmark</code>.
      </OnYourOwn>
      <WithAI
        prompt={`In app/(kambaz)/courses/[cid]/modules/page.tsx, keep my personal extra module or lesson unchanged. After the existing Module/Lesson tree, add one more sample Module titled "Sample module (AI)" containing one Lesson titled "Sample lesson (AI)". Reuse Module.tsx, Lesson.tsx, and GreenCheckmark — do not restyle those components or overwrite my personal titles.`}
      >
        Paste this prompt to add a second sample module — then confirm the
        gray header, green lesson border, and checkmark still appear:
      </WithAI>

      <h3
        id="sec-2-4-5"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        2.4.5 Styling the Home Screen
      </h3>
      <p>
        Since the Home screen&apos;s main content is the Modules list just
        styled, only the Course Status column on the right remains — plus
        swapping the table layout for flex so four columns sit side by side on
        a wide screen.
      </p>
      <p>
        The finished Home screen is expected to show Course Navigation, the Modules list,
        and a Course Status column of styled action buttons on a wide layout
        (<FigureLink to="2.4.5" />):
      </p>
      <BookFigure
        id="fig-2.4.5"
        src="/images/book/kambaz/home-wide.png"
        alt="Target Home screen with four columns"
        caption="Figure 2.4.5 — Home Screen"
      />
      <p>
        In <ChapterLink to={1} />{" "}it was left looking like this — functional HTML,
        no real styling:
      </p>
      <LiveDemo
        name="Chapter 1 — unstyled"
        file="app/book/ch1/embeds/HomeDemo.tsx"
      >
        <HomeDemo />
      </LiveDemo>
      <p>
        If we restyle the Course Status buttons with Tailwind and
        React Icons — splitting Unpublish/Publish into a two-column row, and stacking
        the rest full width — the Status column closes the gap:
      </p>
      <CodeBlock
        language="tsx"
        name="CourseStatus"
        file="app/(kambaz)/courses/[cid]/home/Status.tsx"
      >{`import { FaCheckCircle } from "react-icons/fa";
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
}`}</CodeBlock>
      <p>
        Once the pieces are styled, the course layout and Home page can replace remaining
        tables with flex:{" "}
        <code>app/(kambaz)/courses/[cid]/layout.tsx</code>{" "}and{" "}
        <code>home/page.tsx</code>{" "}swap their remaining table elements for{" "}
        <code>flex</code>{" "}divs. On a wide
        screen the result is four columns — Kambaz Navigation, Course Navigation,
        Modules, and Course Status. As the window narrows, columns hide in this
        order:
      </p>
      <ul>
        <li>
          <strong>Course Status</strong>{" "}first — wrapped in{" "}
          <code>hidden lg:block</code>{" "}so it disappears below the{" "}
          <code>lg</code>{" "}breakpoint while both sidebars stay visible.
        </li>
        <li>
          <strong>Kambaz Navigation</strong>{" "}and{" "}
          <strong>Course Navigation</strong>{" "}together — both use{" "}
          <code>hidden md:block</code>{" "}(Kambaz Navigation already does; Course
          Navigation gets the same treatment in the course layout) so they leave
          at the same <code>md</code>{" "}width, leaving Modules full width.
        </li>
      </ul>
      <CodeBlock
        language="tsx"
        name="CoursesLayout"
        file="app/(kambaz)/courses/[cid]/layout.tsx"
      >{`<div className="flex gap-4">
  <div className="hidden w-[140px] shrink-0 md:block">
    <CourseNavigation cid={cid} />
  </div>
  <div className="min-w-0 flex-1">{children}</div>
</div>`}</CodeBlock>
      <CodeBlock
        language="tsx"
        name="Home"
        file="app/(kambaz)/courses/[cid]/home/page.tsx"
      >{`<div id="wd-home" className="flex gap-4">
  <div className="min-w-0 flex-1">
    <Modules />
  </div>
  <div className="hidden w-[250px] shrink-0 lg:block">
    <CourseStatus />
  </div>
</div>`}</CodeBlock>
      <p>
        With those classes in place, the live component looks like this:
      </p>
      <LiveDemo
        mode="styled"
        name="Styled result"
        file="app/(kambaz)/courses/[cid]/home/page.tsx"
      >
        <div className="flex gap-4">
          <div className="w-[140px] shrink-0">
            <CourseNavigation cid="1234" />
          </div>
          <Home />
        </div>
      </LiveDemo>
      <OnYourOwn>
        In <code>home/Status.tsx</code>, finish the
        remaining Course Status actions as full-width buttons with icons, then
        resize the window: Status should vanish first (below{" "}
        <code>lg</code>), then both navigation sidebars together (below{" "}
        <code>md</code>).
      </OnYourOwn>
      <WithAI
        prompt={`In app/(kambaz)/courses/[cid]/home/Status.tsx, keep any personal extra status buttons I added. After the existing full-width actions, add one more sample button with id wd-ai-status labeled "Sample action" using a fitting React Icon and the same full-width bordered button classes. Do not change my personal buttons or the hidden lg:block / hidden md:block layout in app/(kambaz)/courses/[cid]/home/page.tsx and layout.tsx.`}
      >
        Paste this prompt to add a second sample status action — then resize:
        Status should vanish first (below lg), then both sidebars (below md):
      </WithAI>

      <h3
        id="sec-2-4-6"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        2.4.6 Implementing the People Screen{" "}
        <BookSectionSlidesLink sectionId="sec-2-4-6" />
      </h3>
      <p>
        The People screen lists the students, teaching assistants, and
        faculty enrolled in a course as a table. Unlike the screens above,
        there is no <ChapterLink to={1} />{" "}prototype — this screen is built and styled
        entirely in this chapter.
      </p>
      <p>
        The finished People screen is expected to show a clean roster table with a user
        icon beside each name and alternating row shading (
        <FigureLink to="2.4.6" />):
      </p>
      <BookFigure
        id="fig-2.4.6"
        src="/images/book/kambaz/people.png"
        alt="Target People table screen"
        caption="Figure 2.4.6 — People Screen"
      />
      <p>
        If we style a plain HTML <code>table</code>{" "}with Tailwind — one
        row per person — the roster takes shape:
      </p>
      <CodeBlock
        language="tsx"
        name="PeopleTable"
        file="app/(kambaz)/courses/[cid]/people/table/page.tsx"
      >{`import { FaUserCircle } from "react-icons/fa";

export default function PeopleTable() {
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
          <tr className="odd:bg-neutral-50">
            <td className="p-2 text-nowrap">
              <FaUserCircle className="me-2 inline text-4xl text-neutral-500" />
              Tony Stark
            </td>
            <td className="p-2">001234561S</td>
            <td className="p-2">S101</td>
            <td className="p-2">STUDENT</td>
            <td className="p-2">2020-10-01</td>
            <td className="p-2">10:21:32</td>
          </tr>
          {/* ...at least 3 more rows, e.g. Bruce Wayne, Steve Rogers, Natasha Romanoff... */}
        </tbody>
      </table>
    </div>
  );
}`}</CodeBlock>
      <p>
        With those classes in place, the live component looks like this.
        The People link in the Course Navigation sidebar should reach this
        table:
      </p>
      <LiveDemo
        mode="styled"
        name="Styled result"
        file="app/(kambaz)/courses/[cid]/people/table/page.tsx"
      >
        <PeopleTable />
      </LiveDemo>
      <OnYourOwn>
        In{" "}
        <code>people/table/page.tsx</code>, add at least three more people rows
        (names you choose) with a user icon, and confirm the People nav link opens
        the styled table.
      </OnYourOwn>
      <WithAI
        prompt={`In app/(kambaz)/courses/[cid]/people/table/page.tsx, keep my personal extra people rows unchanged. After the sample Tony Stark row (and any other course samples), add three more sample rows with odd:bg-neutral-50, FaUserCircle, and placeholder names (for example Jane Sample, Alex Sample, Sam Sample) plus Login ID, Section, Role, Last Activity, and Total Activity cells matching the existing columns. Not names I already added.`}
      >
        Paste this prompt to add three more sample roster rows — then confirm
        the People nav link still opens the styled table:
      </WithAI>

      <h3
        id="sec-2-4-7"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        2.4.7 Styling the Assignments Screen
      </h3>
      <p>
        Same arc as Dashboard and Modules: the plain{" "}
        <code>AssignmentItem</code>{" "}from <SectionLink to="1.4.7" />{" "}stays, and
        each row plus the search/toolbar layout get Tailwind and React Icons.
      </p>
      <p>
        The finished Assignments screen is expected to show a search field on the left,
        action buttons on the right, a gray group header, and green-bordered
        assignment rows (<FigureLink to="2.4.7" />):
      </p>
      <BookFigure
        id="fig-2.4.7"
        src="/images/book/kambaz/assignments.png"
        alt="Target Assignments screen"
        caption="Figure 2.4.7 — Assignments Screen"
      />
      <p>
        In <ChapterLink to={1} />{" "}it was left looking like this — functional HTML,
        no real styling:
      </p>
      <LiveDemo
        name="Chapter 1 — unstyled"
        file="app/book/ch1/embeds/AssignmentsDemo.tsx"
      >
        <AssignmentsDemo />
      </LiveDemo>
      <p>
        If we add Tailwind to <code>AssignmentItem</code>{" "}(green left
        border like <code>Lesson</code>, title weight, muted details), then
        lay out the search field and toolbar with flex utilities, the gap closes:
      </p>
      <CodeBlock
        language="tsx"
        name="AssignmentItem"
        file="app/(kambaz)/courses/[cid]/assignments/AssignmentItem.tsx"
      >{`import Link from "next/link";
import { FaFileAlt } from "react-icons/fa";

export default function AssignmentItem({
  cid, aid, title, details,
}: {
  cid: string;
  aid: string;
  title: string;
  details: string;
}) {
  return (
    <li className="wd-assignment-list-item mb-3 flex gap-3 border border-neutral-300 border-l-[3px] border-l-green-600 bg-white p-3">
      <FaFileAlt className="mt-1 shrink-0 text-xl text-green-700" />
      <div>
        <Link
          href={\`/courses/\${cid}/assignments/\${aid}\`}
          className="wd-assignment-link font-semibold text-neutral-900 no-underline"
        >
          {title}
        </Link>
        <div className="mt-1 text-sm text-neutral-600">{details}</div>
      </div>
    </li>
  );
}`}</CodeBlock>
      <p>
        On the Assignments page, the search field sits on the left (with a
        magnifying-glass icon) and the <code>+ Group</code> /{" "}
        <code>+ Assignment</code>{" "}buttons on the right. The group header can
        reuse the same gray bar treatment as a module title:
      </p>
      <CodeBlock
        language="tsx"
        name="Assignments"
        file="app/(kambaz)/courses/[cid]/assignments/page.tsx"
      >{`import { FaPlus, FaSearch } from "react-icons/fa";
import AssignmentItem from "./AssignmentItem";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
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
        <button type="button" className="rounded border bg-white px-2 py-0.5 text-sm">
          <FaPlus />
        </button>
      </h3>
      <ul id="wd-assignment-list" className="m-0 list-none p-0">
        <AssignmentItem
          cid={cid}
          aid="123"
          title="A1 - ENV + HTML"
          details="Multiple Modules | Not available until May 6 at 12:00am | Due May 13 at 11:59pm | 100 pts"
        />
        {/* ...remaining AssignmentItems... */}
      </ul>
    </div>
  );
}`}</CodeBlock>
      <p>
        With those classes in place, the live component looks like this:
      </p>
      <LiveDemo
        mode="styled"
        name="Styled result"
        file="app/(kambaz)/courses/[cid]/assignments/page.tsx"
      >
        <div className="flex gap-4">
          <div className="w-[140px] shrink-0">
            <CourseNavigation cid="1234" />
          </div>
          <div className="min-w-0 flex-1">
            <Assignments params={Promise.resolve({ cid: "RS101" })} />
          </div>
        </div>
      </LiveDemo>
      <p>The finished Assignments screen is expected to:</p>
      <ul>
        <li>
          float the <code>+ Group</code>{" "}and <code>+ Assignment</code>{" "}
          buttons to the right, colored like the buttons in Modules, each with a
          plus icon
        </li>
        <li>
          render a <code>Search for Assignments</code>{" "}field on the left with a
          placeholder and a magnifying-glass icon
        </li>
        <li>
          use Tailwind margin and padding utilities for white space around and
          between assignment groups, not manual pixel values
        </li>
        <li>
          give each <code>AssignmentItem</code>{" "}a green left border, matching
          the lesson border style from <SectionLink to="2.4.4" />
        </li>
        <li>
          render each assignment title (A1, A2, …) and its due-date/points
          subtext as shown in the screenshots — exact dates and times may differ
        </li>
      </ul>
      <OnYourOwn>
        In <code>AssignmentItem.tsx</code>{" "}or{" "}
        <code>assignments/page.tsx</code>, add one more assignment with your own
        title and due-date line, keeping the green left border, search field, and
        toolbar button layout.
      </OnYourOwn>
      <WithAI
        prompt={`In app/(kambaz)/courses/[cid]/assignments/page.tsx, keep my personal extra assignment unchanged. After the existing AssignmentItem calls, add one more sample AssignmentItem with aid "ai-a", title "A9 - Sample assignment", and a due-date/points details line in the same format as A1. Do not restyle AssignmentItem.tsx or the search/toolbar layout.`}
      >
        Paste this prompt to add a second sample assignment — then confirm the
        green left border, search field, and toolbar still match:
      </WithAI>

      <h3
        id="sec-2-4-8"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        2.4.8 Styling the Assignment Editor Screen (On Your Own)
      </h3>
      <p>
        Clicking an assignment&apos;s title opens the Assignment Editor from{" "}
        <SectionLink to="1.4.8" /> — for now every assignment opens the same editor content; a
        later chapter wires each assignment to its own data. Tailwind form utilities
        turn Assignment Name, Description, Points, and Due Date into a clean, labeled form
        instead of a raw HTML table.
      </p>
      <p>
        The finished editor is expected to look like a structured form with labeled
        fields, aligned controls, and Cancel/Save actions at the bottom (
        <FigureLink to="2.4.8" />):
      </p>
      <BookFigure
        id="fig-2.4.8"
        src="/images/book/kambaz/assignment-editor.png"
        alt="Target Assignment Editor screen"
        caption="Figure 2.4.8 — Assignment Editor"
      />
      <p>
        In <ChapterLink to={1} />{" "}it was left looking like this — functional HTML,
        no real styling:
      </p>
      <LiveDemo
        name="Chapter 1 — unstyled"
        file="app/book/ch1/embeds/AssignmentEditorDemo.tsx"
      >
        <AssignmentEditorDemo />
      </LiveDemo>
      <p>
        The full form markup already lives in{" "}
        <code>assignments/[aid]/page.tsx</code>. Starting from that structure,
        Tailwind form utilities — labels above fields, full-width inputs, and
        spacing instead of <code>table</code>{" "}cells — produce the labeled layout:
      </p>
      <CodeBlock
        language="tsx"
        name="AssignmentEditor"
        file="app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx"
      >{`import Link from "next/link";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" />
      <br />
      <br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
        your Web application running on Vercel.
      </textarea>
      <br />
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>
          {/* ...remaining fields from Chapter 1... */}
        </tbody>
      </table>
      <br />
      <Link href="/courses/1234/assignments" id="wd-cancel">Cancel</Link>{" "}
      <Link href="/courses/1234/assignments" id="wd-save">Save</Link>
    </div>
  );
}`}</CodeBlock>
      <p>
        The starting markup is still the Chapter 1 form; Tailwind form utilities turn it into the labeled layout in the target.
        The demo below shows the current starting point — it should still look
        unstyled until the Tailwind classes are in place:
      </p>
      <LiveDemo
        mode="styled"
        name="Your turn to style"
        file="app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx"
      >
        <AssignmentEditor
          params={Promise.resolve({ cid: "1234", aid: "123" })}
        />
      </LiveDemo>
      <OnYourOwn>
        Restyle{" "}
        <code>assignments/[aid]/page.tsx</code>{" "}with Tailwind form utilities so
        Assignment Name, Description, Points, and Due Date read as a clean
        labeled form — then confirm Cancel/Save still return to the
        assignments list.
      </OnYourOwn>
      <WithAI
        prompt={`In app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx, keep any personal form styling I already applied. After the existing fields, add one more sample labeled field with id wd-ai-editor-notes: a label "Sample notes" and a full-width textarea using the same Tailwind form utilities as Assignment Name/Description. Do not overwrite my personal classes or change Cancel/Save so they still return to the assignments list.`}
      >
        Paste this prompt to add a second sample field — then confirm
        Cancel/Save still return to the assignments list:
      </WithAI>

      <h3
        id="sec-2-4-9"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        2.4.9 Styling the Account Screens (On Your Own){" "}
        <BookSectionSlidesLink sectionId="sec-2-4-9" />
      </h3>
      <p>
        The Sign in, Sign up, and Profile screens from <SectionLink to="1.4.2" />, along
        with the Account Navigation sidebar, get Tailwind form and button
        classes next. The Course Navigation sidebar from <SectionLink to="2.4.3" />{" "}is a model for
        the Account Navigation sidebar so the whole account section feels
        consistent with the rest of Kambaz.
      </p>
      <p>
        The finished Account screens are expected to show a narrow navigation sidebar
        beside clean, centered form fields and primary action buttons —
        <FigureLink to="2.4.9a" />{" "}(Sign in) and <FigureLink to="2.4.9b" />{" "}
        (Profile):
      </p>
      <BookFigure
        sources={[
          {
            id: "fig-2.4.9a",
            src: "/images/book/kambaz/account-signin.png",
            alt: "Target Account Sign in screen",
            caption: "Figure 2.4.9a — Account Sign in",
          },
          {
            id: "fig-2.4.9b",
            src: "/images/book/kambaz/account-profile.png",
            alt: "Target Account Profile screen",
            caption: "Figure 2.4.9b — Account Profile",
          },
        ]}
      />
      <p>
        In <ChapterLink to={1} />{" "}it was left looking like this — functional HTML,
        no real styling:
      </p>
      <LiveDemo
        name="Chapter 1 — unstyled"
        file="app/book/ch1/embeds/AccountScreensDemo.tsx"
      >
        <AccountScreensDemo />
      </LiveDemo>
      <p>
        If we start with Sign in and apply Tailwind form utilities for
        full-width inputs, spacing, and a primary Sign in button — then reuse
        the same patterns on Sign up and Profile — the account forms close the gap:
      </p>
      <CodeBlock
        language="tsx"
        name="Signin"
        file="app/(kambaz)/account/signin/page.tsx"
      >{`<div id="wd-signin-screen" className="max-w-sm">
  <h1 className="mb-3 text-2xl font-semibold">Sign in</h1>
  <input
    id="wd-username"
    placeholder="username"
    className="mb-2 w-full rounded border border-neutral-300 px-3 py-2"
  />
  <input
    id="wd-password"
    placeholder="password"
    type="password"
    className="mb-2 w-full rounded border border-neutral-300 px-3 py-2"
  />
  <Link
    id="wd-signin-btn"
    href="/account/profile"
    className="mb-2 block w-full rounded bg-blue-600 px-3 py-2 text-center text-white no-underline"
  >
    Sign in
  </Link>
  <Link id="wd-signup-link" href="/account/signup">
    Sign up
  </Link>
</div>`}</CodeBlock>
      <p>
        With those patterns in place on Sign in, Sign up, Profile, and{" "}
        <code>account/Navigation.tsx</code>, the account section matches the target.
        The demo below shows the current
        Sign in file — still unstyled until the Tailwind classes land:
      </p>
      <LiveDemo
        mode="styled"
        name="Your turn to style"
        file="app/(kambaz)/account/signin/page.tsx"
      >
        <Signin />
      </LiveDemo>
      <p>
        Sign up and Profile follow the same way, reusing the classes above
        as a template, and{" "}
        <Link href="/account/signin">/account/signin</Link>{" "}remains the
        first screen a visitor sees when navigating to Kambaz.
      </p>
      <OnYourOwn>
        Style Sign in, Sign up, Profile, and{" "}
        <code>account/Navigation.tsx</code>{" "}with the same Tailwind form/button
        patterns, mirroring Course Navigation for the account sidebar, and confirm{" "}
        <code>/account/signin</code>{" "}is still the first Kambaz screen.
      </OnYourOwn>
      <WithAI
        prompt={`Keep any personal styling I already applied on the account screens. In app/(kambaz)/account/signin/page.tsx, after the existing fields, add one more sample labeled input with id wd-ai-signin-note (placeholder "sample note") using the same full-width rounded border utilities as username/password. Do not change Sign up, Profile, or app/(kambaz)/account/Navigation.tsx, and do not change routing so /account/signin stays the first Kambaz screen.`}
      >
        Paste this prompt to add a second sample Sign in field — then confirm{" "}
        <code>/account/signin</code>{" "}is still the first Kambaz screen:
      </WithAI>
      <Section level={3} id="sec-2-4-10" title="2.4.10 Exercises">
        <p>
          Use this checklist to confirm the Kambaz restyle covers every
          screen in <SectionLink to="2.4" />. Each item points back to the
          section where you styled the worked example. Restyle the screens
          in order as you read — this list is for checking coverage, not a
          substitute for the walkthroughs. Assignment Editor and Account
          stay On your own: match the figures and interactive demos in those
          sections. Each screen is listed once, with Lab,{" "}
          <strong>On your own</strong>, and <strong>With AI</strong>{" "}
          nested as a/b/c.
        </p>
        <NestedExerciseList groups={CH2_KAMBAZ_EXERCISES} />
      </Section>
    </Section>
  );
}
