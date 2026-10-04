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
      "**Tailwind CSS** is a utility-first framework: you style by combining small, single-purpose classes like `p-3` or `flex` in the markup",
      "The **theme** is the design values — colors, spacing, and fonts — those utilities use",
      "Chapter 1 forced columns with tables. §2.1.18–2.1.19 replaced that with CSS Grid and Flexbox layouts",
      "Now restyle each Kambaz screen with utility classes on the same markup",
    ],
  },
  {
    id: "no-preflight",
    title: "Step 1: Tailwind without Preflight",
    kind: "content",
    bullets: [
      "Preflight is Tailwind's base reset: it strips default heading sizes, margins, and list bullets",
      "It would also wipe Labs HTML, so Kambaz loads only the theme and utilities",
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
      "It sets the font, color, and box-sizing Preflight would.",
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
      "Line 2 imports Tailwind; line 3 adds `kambaz.css`",
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
    title: "Tables out of the course layout",
    kind: "content",
    bullets: [
      "Drop the Chapter 1 `<table>`. `KambazNavigation` sits beside the content wrapper, `wd-main-content-offset`",
      "`p-3` is the page gutter. The 120px left offset comes next",
      "Also drop tables from `courses/[cid]/layout.tsx` and `home/page.tsx`, and lay them out with `flex`",
      "`md:` (medium, 48rem) and `lg:` (large, 64rem) apply at that width and up. Hide Course Status first (`hidden lg:block`), then both sidebars (`hidden md:block`)",
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
