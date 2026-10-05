import ContainFixed from "@/app/book/components/ContainFixed";
import KambazNavigation from "@/app/book/ch2/embeds/_styled/Navigation";
import CourseNavigation from "@/app/book/ch3/embeds/_styled/courses/cid/Navigation";
import PeopleTable from "@/app/book/ch2/embeds/_styled/courses/cid/people/PeopleTable";
import CourseStatus from "@/app/book/ch2/embeds/_styled/courses/cid/home/Status";
import Module from "@/app/book/ch2/embeds/_styled/courses/cid/modules/Module";
import Lesson from "@/app/book/ch2/embeds/_styled/courses/cid/modules/Lesson";
import AssignmentItem from "@/app/book/ch2/embeds/_styled/courses/cid/assignments/AssignmentItem";
import Image from "next/image";
import Link from "next/link";
import { FaPlus, FaSearch } from "react-icons/fa";
import LectureDemoFrame from "./LectureDemoFrame";

function StyledCourseCard({
  id,
  title,
  subtitle,
  image,
}: {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <div className="wd-dashboard-course w-[300px] max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <Link
        href={`/courses/${id}/home`}
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
          <p className="wd-dashboard-course-title m-0 mb-3 h-[72px] overflow-hidden text-sm text-neutral-600">
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
}

export function KambazStyledNavEmbed() {
  return (
    <LectureDemoFrame label="Navigation.tsx" url="/dashboard">
      <div className="font-sans text-sm [&_nav]:!top-auto [&_nav]:!bottom-auto [&_nav]:!block [&_nav]:!h-auto [&_nav]:!relative">
        <ContainFixed height="auto">
          <KambazNavigation />
          <div
            className="wd-main-content-offset p-3 text-neutral-500"
            style={{ marginLeft: 120 }}
          >
            Dashboard, Courses, and every other Kambaz screen render here,
            offset by <code>wd-main-content-offset</code>.
          </div>
        </ContainFixed>
      </div>
    </LectureDemoFrame>
  );
}

export function KambazStyledDashboardEmbed() {
  return (
    <LectureDemoFrame label="dashboard/page.tsx" url="/dashboard">
      <div id="wd-dashboard" className="font-sans">
        <h1 id="wd-dashboard-title" className="mt-0 mb-1 text-xl font-semibold">
          Dashboard
        </h1>
        <hr />
        <h2 id="wd-dashboard-published" className="mt-2 mb-1 text-lg font-semibold">
          Published Courses (3)
        </h2>
        <hr />
        <div
          id="wd-dashboard-courses"
          className="grid grid-cols-1 gap-8 pt-2 sm:grid-cols-2 xl:grid-cols-3"
        >
          <StyledCourseCard
            id="1234"
            title="CS1234 React JS"
            subtitle="Full Stack software developer"
            image="/images/reactjs.jpg"
          />
          <StyledCourseCard
            id="2345"
            title="CS2345 Node JS"
            subtitle="Server side JavaScript"
            image="/images/nodejs.jpg"
          />
          <StyledCourseCard
            id="3456"
            title="CS3456 MongoDB"
            subtitle="NoSQL Databases"
            image="/images/mongodb.jpg"
          />
        </div>
      </div>
    </LectureDemoFrame>
  );
}

export function KambazStyledCourseNavEmbed() {
  return (
    <LectureDemoFrame
      label="courses/[cid]/Navigation.tsx"
      url="/courses/1234/home"
    >
      <div className="w-[140px] font-sans">
        <CourseNavigation cid="1234" />
      </div>
    </LectureDemoFrame>
  );
}

export function KambazStyledModulesEmbed() {
  return (
    <LectureDemoFrame
      label="modules/page.tsx"
      url="/courses/1234/modules"
    >
      <div id="wd-modules" className="font-sans">
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
          </select>
          <button
            type="button"
            className="rounded border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            + Module
          </button>
        </div>
        <ul className="m-0 list-none p-0">
          <Module title="Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda">
            <Lesson title="LEARNING OBJECTIVES">
              <li>Introduction to the course</li>
              <li>Learn what is Web Development</li>
            </Lesson>
            <Lesson title="READING">
              <li>Full Stack Developer - Chapter 1 - Introduction</li>
            </Lesson>
          </Module>
        </ul>
      </div>
    </LectureDemoFrame>
  );
}

export function KambazStyledHomeEmbed() {
  return (
    <LectureDemoFrame label="home/page.tsx" url="/courses/1234/home">
      <div id="wd-home" className="flex gap-4 font-sans">
        <div className="w-[140px] shrink-0">
          <CourseNavigation cid="1234" />
        </div>
        <div className="min-w-0 flex-1">
          <ul className="m-0 list-none p-0">
            <Module title="Week 1 — Course Introduction">
              <Lesson title="LEARNING OBJECTIVES">
                <li>Introduction to the course</li>
              </Lesson>
            </Module>
          </ul>
        </div>
        <div className="hidden w-[250px] shrink-0 lg:block">
          <CourseStatus />
        </div>
      </div>
    </LectureDemoFrame>
  );
}

export function KambazStyledPeopleEmbed() {
  return (
    <LectureDemoFrame
      label="people/table/page.tsx"
      url="/courses/1234/people/table"
    >
      <div className="font-sans">
        <PeopleTable />
      </div>
    </LectureDemoFrame>
  );
}

export function KambazStyledAssignmentsEmbed() {
  return (
    <LectureDemoFrame
      label="assignments/page.tsx"
      url="/courses/1234/assignments"
    >
      <div id="wd-assignments" className="font-sans">
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
            cid="1234"
            aid="123"
            title="A1 - ENV + HTML"
            details="Multiple Modules | Not available until May 6 at 12:00am | Due May 13 at 11:59pm | 100 pts"
          />
          <AssignmentItem
            cid="1234"
            aid="234"
            title="A2 - CSS + TAILWIND"
            details="Multiple Modules | Not available until May 13 at 12:00am | Due May 20 at 11:59pm | 100 pts"
          />
        </ul>
      </div>
    </LectureDemoFrame>
  );
}

export function KambazStyledSigninEmbed() {
  return (
    <LectureDemoFrame label="account/signin/page.tsx" url="/account/signin">
      <div id="wd-signin-screen" className="max-w-sm">
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
      </div>
    </LectureDemoFrame>
  );
}
