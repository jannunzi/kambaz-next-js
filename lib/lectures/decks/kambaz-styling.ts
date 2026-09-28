import type { LectureSlide } from "../types";

export const KAMBAZ_STYLING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Kambaz Styling",
      "§2.4 · Tailwind on the Kambaz shell — then each screen",
    ],
  },
  {
    id: "purpose",
    title: "Chapter 1 was unstyled on purpose",
    kind: "content",
    bullets: [
      "Kambaz screens used tables to force columns. Functional, not CSS",
      "§2.1.18–2.1.19 replaced table layout with Grid and Flex",
      "Now dress the real app: utilities on the same markup, tables out",
      "Each screen: target look → Chapter 1 prototype → code → live styled result",
    ],
  },
  {
    id: "no-preflight",
    title: "Kambaz skips Preflight",
    kind: "content",
    bullets: [
      "The Tailwind lab imported `@import \"tailwindcss\"` — that reset would wipe Labs HTML",
      "Kambaz loads **theme + utilities only**",
      "Import once from the Kambaz layout. Screens can import it too, but once is enough",
    ],
    code: `/* Utilities + theme only — safe for Kambaz without Preflight reset */
@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/utilities" layer(utilities);`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/tailwind/utilities.css",
  },
  {
    id: "kambaz-css",
    title: "kambaz.css sets the base",
    kind: "content",
    bullets: [
      "Without Preflight the browser often falls back to Times",
      "A system sans stack, `color`, `line-height`, and `box-sizing`",
      "`font-sans` on the root still applies Tailwind’s system stack",
    ],
    code: `/* System sans-serif — Tailwind utilities alone do not set the body font */
#wd-kambaz {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    "Noto Sans", "Liberation Sans", Arial, sans-serif;
  color: #212529;
  line-height: 1.5;
}
#wd-kambaz,
#wd-kambaz * {
  box-sizing: border-box;
}`,
    codeLanguage: "css",
    codeFile: "app/(kambaz)/kambaz.css",
  },
  {
    id: "layout",
    title: "Layout imports both files",
    kind: "content",
    bullets: [
      "Drop the Chapter 1 `<table>` wrapper",
      "`KambazNavigation` is a sibling. Children sit in `wd-main-content-offset`",
      "`p-3` is the page gutter. The 120px left offset comes next, with the sidebar",
    ],
    code: `import { ReactNode } from "react";
import "@/app/labs/lab2/tailwind/utilities.css";
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/layout.tsx",
    codeAddedLines: [1, [2, 3], 8, 12],
  },
  {
    id: "tables-out",
    title: "Tables out of course chrome",
    kind: "content",
    bullets: [
      "Also drop tables from `courses/[cid]/layout.tsx` and `home/page.tsx`",
      "Replace them with `flex` so Course Nav and Course Status sit beside content",
      "Hide order later: Status first (`hidden lg:block`), then both sidebars (`hidden md:block`)",
    ],
  },
  {
    id: "checklist",
    title: "Coverage is §2.4.10",
    kind: "content",
    bullets: [
      "Navigation, Dashboard, Course Nav, Modules, Home, People, Assignments",
      "Assignment Editor and Account stay **On your own** — match the figures",
      "Walk those screens after you restyle.",
    ],
  },
  {
    id: "next-up",
    title: "Next: the black sidebar",
    kind: "title",
    bullets: [
      "The shell loads utilities without resetting Labs HTML",
      "§2.4.1: pin Kambaz Navigation as a fixed icon column",
    ],
  },
];
