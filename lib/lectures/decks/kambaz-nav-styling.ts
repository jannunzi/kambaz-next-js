import type { LectureSlide } from "../types";

export const KAMBAZ_NAV_STYLING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Kambaz Navigation",
      "§2.4.1 · Fixed black column of icon-and-label tiles",
    ],
  },
  {
    id: "purpose",
    title: "Pin a 120px icon column",
    kind: "content",
    bullets: [
      "Chapter 1’s sidebar was a plain vertical list of links",
      "Target: narrow black column, red icons, active tile white-on-red",
      "Account icon is white when idle. Active route: white background, red text",
      "Optional Northeastern logo above Account — `/images/NEU.png`",
    ],
  },
  {
    id: "tsx",
    title: "Tiles with React Icons",
    kind: "content",
    bullets: [
      "`fixed top-0 bottom-0` stretches the bar and takes it out of flow",
      "`hidden md:block` hides it on small viewports",
      "`z-20` keeps it above the scrolling page",
    ],
    code: `"use client";

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
        <FaRegCircleUser className="inline-block text-3xl text-white" />
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/Navigation.tsx",
  },
  {
    id: "offset",
    title: "Offset the overlapping content",
    kind: "content",
    bullets: [
      "`fixed` leaves the flow — content no longer knows to leave 120px",
      "Add `.wd-main-content-offset` inside a `768px` media query",
      "The offset only applies when `md:block` shows the sidebar",
    ],
    code: `@media (min-width: 768px) {
  .wd-main-content-offset {
    margin-left: 120px;
  }
}`,
    codeLanguage: "css",
    codeFile: "app/(kambaz)/kambaz.css",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "demo",
    title: "Live styled sidebar",
    kind: "demo",
    bullets: [
      "Pin the sidebar as a fixed black column of icon-and-label tiles so Kambaz scrolls beside it.",
      "In this preview the sidebar stays in the frame. On the Kambaz page, `fixed` pins it to the window",
      "Idle tiles: black + white text. Dashboard is the active white/red tile",
    ],
    embed: "kambaz-styled-nav",
  },
  {
    id: "checklist",
    title: "Finished sidebar checklist",
    kind: "content",
    bullets: [
      "About 110–120 pixels wide",
      "Red icons, except Account (white when idle)",
      "Active link: white background, red text",
      "Icons and labels centered in the bar",
    ],
  },
  {
    id: "next-up",
    title: "Next: Dashboard cards",
    kind: "title",
    bullets: [
      "You can pin a fixed icon rail and offset the page beside it",
      "§2.4.2: `CourseCard` borders + a responsive course grid",
    ],
  },
];
