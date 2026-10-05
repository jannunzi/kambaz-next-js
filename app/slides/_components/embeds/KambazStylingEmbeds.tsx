import ContainFixed from "@/app/book/components/ContainFixed";
import KambazNavigation from "@/app/book/ch2/embeds/_styled/Navigation";
import LinksNavigation from "@/app/book/ch3/embeds/_styled/Navigation";
import CourseNavigation from "@/app/book/ch2/embeds/_styled/courses/cid/Navigation";
import FullCourseNavigation from "@/app/book/ch3/embeds/_styled/courses/cid/Navigation";
import Dashboard from "@/app/book/ch2/embeds/_styled/dashboard/Dashboard";
import Modules from "@/app/book/ch2/embeds/_styled/courses/cid/modules/page";
import Home from "@/app/book/ch2/embeds/_styled/courses/cid/home/page";
import PeopleTable from "@/app/book/ch2/embeds/_styled/courses/cid/people/PeopleTable";
import AssignmentItem from "@/app/book/ch2/embeds/_styled/courses/cid/assignments/AssignmentItem";
import Link from "next/link";
import { FaPlus, FaSearch } from "react-icons/fa";
import AsDashboardPath from "./AsDashboardPath";
import LectureDemoFrame from "./LectureDemoFrame";

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

/** Chapter 3 LINKS sidebar: Account plus Dashboard, Courses, Calendar, Inbox, and Labs. */
export function KambazLinksNavEmbed() {
  return (
    <LectureDemoFrame label="Navigation.tsx" url="/dashboard">
      <div className="font-sans text-sm [&_nav]:!top-auto [&_nav]:!bottom-auto [&_nav]:!block [&_nav]:!h-auto [&_nav]:!relative">
        <ContainFixed height="auto">
          <AsDashboardPath>
            <LinksNavigation />
          </AsDashboardPath>
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
      <div className="font-sans">
        <Dashboard />
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
        <FullCourseNavigation cid="1234" />
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
      <div className="font-sans">
        <Modules />
      </div>
    </LectureDemoFrame>
  );
}

export function KambazStyledHomeEmbed() {
  return (
    <LectureDemoFrame label="home/page.tsx" url="/courses/1234/home">
      <div className="font-sans">
        <div className="flex gap-4">
          <div className="w-[140px] shrink-0">
            <CourseNavigation cid="1234" />
          </div>
          <Home />
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
  const cid = "1234";
  return (
    <LectureDemoFrame
      label="assignments/page.tsx"
      url="/courses/1234/assignments"
    >
      <div className="font-sans">
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
