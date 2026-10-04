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
    title: "Step 1: Tailwind without Preflight",
    kind: "content",
    bullets: [
      "Preflight is Tailwind's base reset: it strips browser defaults like heading sizes, margins, and list bullets",
      "The §2.3 Tailwind lab used `@import \"tailwindcss\"`, which includes Preflight. That reset would also wipe plain HTML on the Labs pages",
      "For Kambaz, create `utilities.css`, which loads only Tailwind's theme and utility classes",
    ],
    code: `/* Utilities + theme only — safe for Kambaz without Preflight reset */
@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/utilities" layer(utilities);`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/tailwind/utilities.css",
  },
  {
    id: "kambaz-css",
    title: "Step 2: kambaz.css sets the base",
    kind: "content",
    bullets: [
      "This file adds no Tailwind. It sets the base that Preflight would have set",
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
    title: "Step 3: Layout imports both files",
    kind: "content",
    bullets: [
      "Line 2 is where Kambaz imports Tailwind (`utilities.css`); line 3 adds `kambaz.css`",
      "Import both once in the layout so every Kambaz screen gets them",
      "Drop the Chapter 1 `<table>` wrapper. `KambazNavigation` is a sibling; children sit in `wd-main-content-offset`",
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
      "Use the §2.4.10 checklist after you restyle, not instead of walking the screens",
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
