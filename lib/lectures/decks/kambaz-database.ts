import type { LectureSlide } from "../types";

export const KAMBAZ_DATABASE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Kambaz Database",
      "§3.9–3.9.2 · redirect, map the sidebar, download JSON",
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
      "Keep your Chapter 2 styling and `wd-*` ids. Change only lines that read `params`, `usePathname`, or `db`",
      "A coverage checklist is in §3.9.10 — after you walk the screens",
    ],
  },
  {
    id: "redirect",
    title: "Landing still redirects to Sign in",
    kind: "content",
    bullets: [
      "`redirect` from `next/navigation` sends the browser to another route when the page renders",
      "Kambaz `/` still opens Sign in at `/account/signin`",
      "Confirm `/` opens Sign in before you change the sidebar",
    ],
    code: `import { redirect } from "next/navigation";

export default function Kambaz() {
  redirect("/account/signin");
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/page.tsx",
    codeHighlightLines: [4],
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
    id: "nav",
    title: "Sidebar links come from an array",
    kind: "demo",
    bullets: [
      "Replace handwritten links with `LINKS` — label, path, icon",
      "Account stays a special case (red text on white when active)",
      "Courses points at `/dashboard` — you reach a course from a card",
      "One item lit at a time: Dashboard on `/dashboard`, Courses inside `/courses/…`",
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
          link.label === "Courses"
            ? pathname.includes("/courses")
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
    id: "download-courses",
    title: "Download courses.json first",
    kind: "content",
    bullets: [
      "Kambaz keeps its data in **JSON** files under `app/(kambaz)/database/`",
      "Download [courses.json](https://kambaz.dev/downloads/kambaz-database/courses.json) into that folder — three courses: RS101, RS102, RS103",
      "Or open the link, copy the JSON, and paste it into a new `courses.json`",
      "Or download it from a terminal in your project folder (macOS, Linux, or Git Bash):",
    ],
    code: `curl -o "app/(kambaz)/database/courses.json" https://kambaz.dev/downloads/kambaz-database/courses.json`,
    codeLanguage: "shell",
  },
  {
    id: "database",
    title: "index.ts re-exports the JSON",
    kind: "content",
    bullets: [
      "Re-export from `index.ts` so screens write `import * as db from \"../database\"`",
      "For now it imports only `courses.json` — the one file in the folder",
      "Don’t import a file before it is in the folder: `next build` fails with `Module not found`",
    ],
    code: `import courses from "./courses.json";
export { courses };`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/database/index.ts",
    codeHighlightLines: [[1, 2]],
  },
  {
    id: "ids",
    title: "_id is the value in the URL",
    kind: "content",
    bullets: [
      "Each course object has `_id`, `name`, `description`, and `image`",
      "You will encode `_id` as `/courses/RS101/home` — no spaces or slashes",
      "Keep at least three courses so the screens visibly change per course",
      "Each later screen downloads the one file it needs and adds one import",
    ],
  },
  {
    id: "recap",
    title: "Database recap",
    kind: "content",
    bullets: [
      "Kambaz nav: `LINKS.map` + `usePathname` + a `key`",
      "Download a JSON file, then import it in `database/index.ts`. Screens import `* as db`",
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
