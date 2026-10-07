import type { LectureSlide } from "../types";

export const KAMBAZ_DATABASE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Kambaz Database",
      "§3.9.1–3.9.2 · map the sidebar, then collect JSON",
    ],
  },
  {
    id: "purpose",
    title: "Kambaz is the app you keep",
    kind: "content",
    bullets: [
      "Chapters 1–2 built screens whose markup never changed",
      "Lab 3 drills were throwaway. Wire Kambaz so the UI follows JSON",
      "Different courses on the dashboard; modules and people once the URL has a course id",
      "A coverage checklist is in §3.9.10 — after you walk the screens",
    ],
  },
  {
    id: "nav",
    title: "Sidebar links come from an array",
    kind: "demo",
    bullets: [
      "Replace handwritten links with `LINKS` — label, path, icon",
      "Account stays a special case (red text on white when active)",
      "Courses points at `/dashboard` — you reach a course from a card",
    ],
    code: `"use client";

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/Navigation.tsx",
    codeHighlightLines: [[10, 16], [58, 78]],
    embed: "kambaz-links-nav",
  },
  {
    id: "client",
    title: "Navigation is a Client Component",
    kind: "content",
    bullets: [
      "`usePathname` highlights the active route — needs `\"use client\"`",
      "Each mapped `Link` needs `key={link.label}`",
      "Same pattern as the Labs TOC in §3.7.2",
    ],
  },
  {
    id: "database",
    title: "Collect JSON under database/",
    kind: "content",
    bullets: [
      "`app/(kambaz)/database` — courses, modules, assignments, users, enrollments",
      "Re-export from `index.ts` so screens write `import * as db from \"../database\"`",
      "Keep at least three courses so the dashboard is obviously data-driven",
    ],
    code: `import courses from "./courses.json";
import modules from "./modules.json";
import assignments from "./assignments.json";
import users from "./users.json";
import enrollments from "./enrollments.json";
export { courses, modules, assignments, users, enrollments };`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/database/index.ts",
    codeHighlightLines: [[1, 6]],
  },
  {
    id: "ids",
    title: "_id is the value in the URL",
    kind: "content",
    bullets: [
      "Each course object has `_id`, `name`, `description`, and `image`",
      "You will encode `_id` as `/courses/RS101/home`",
      "Add the other JSON files as later screens need them",
    ],
  },
  {
    id: "recap",
    title: "Database recap",
    kind: "content",
    bullets: [
      "Kambaz nav: `LINKS.map` + `usePathname` + a `key`",
      "`database/index.ts` re-exports JSON. Screens import `* as db`",
      "Next: map `db.courses` onto dashboard cards",
    ],
  },
  {
    id: "next-up",
    title: "Next: a data-driven dashboard",
    kind: "title",
    bullets: [
      "Cards come from `db.courses`, not hardcoded markup",
      "§3.9.3: `CourseCard` keyed by `_id`",
    ],
  },
];
