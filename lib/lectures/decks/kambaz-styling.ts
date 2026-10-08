import type { LectureSlide } from "../types";

export const KAMBAZ_STYLING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Kambaz Styling",
      "§2.4 · Style all of Kambaz, then each screen",
    ],
  },
  {
    id: "purpose",
    title: "Chapter 1 was unstyled on purpose",
    kind: "content",
    bullets: [
      "**Tailwind CSS** is a utility-first framework: you style by combining **utility classes**, small single-purpose classes like `p-3` or `flex`, in the markup",
      "The **theme** is the design values — colors, spacing, and fonts — those utilities use",
      "Chapter 1 forced columns with tables. §2.1.18–2.1.19 replaced that with CSS Grid and Flexbox layouts",
      "Now restyle each Kambaz screen with utility classes on the same markup",
    ],
  },
  {
    id: "no-preflight",
    title: "Step 1: Create kambaz.css",
    kind: "content",
    bullets: [
      "**Preflight** is Tailwind's base reset. `@import \"tailwindcss\"` includes it",
      "Kambaz skips Preflight because it would strip the default heading sizes, list bullets, and margins the Kambaz screens still rely on",
      "`layer(...)` puts each import in a named cascade layer, and layer order decides which rules win",
    ],
    code: `@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/utilities" layer(utilities);`,
    codeLanguage: "css",
    codeFile: "app/(kambaz)/kambaz.css",
  },
  {
    id: "kambaz-css",
    title: "Step 2: Append the base to kambaz.css",
    kind: "content",
    bullets: [
      "**Append** these rules below the two `@import` lines from Step 1. Pasting over the file drops the Tailwind imports",
      "Without Preflight the browser often falls back to Times, a serif font",
      "Add a system sans-serif font, `color`, `line-height`, and `box-sizing`",
    ],
    code: `/* System sans-serif — Tailwind utilities alone
   do not set the body font */
#wd-kambaz {
  font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    "Noto Sans",
    "Liberation Sans",
    Arial,
    sans-serif;
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
    title: "Step 3: Layout imports kambaz.css",
    kind: "content",
    bullets: [
      "The Kambaz layout imports `./kambaz.css`. Next.js bundles the file only once, even if another component imports it too",
      "`font-sans` on the root applies Tailwind's system font even if the CSS rule is incomplete",
    ],
    code: `import { ReactNode } from "react";
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
    codeAddedLines: [2, 9, [11, 12]],
  },
  {
    id: "tables-out",
    title: "Chapter 1 tables come out",
    kind: "content",
    bullets: [
      "Drop the Chapter 1 `<table>`: `KambazNavigation` now sits beside `wd-main-content-offset`",
      "`p-3` pads the page. The next deck adds a 120px left offset for Kambaz Navigation",
      "In the course layout and Home, `flex` puts Course Navigation and Course Status beside the content",
      "`md:` (medium, 48rem) and `lg:` (large, 64rem) apply at that width and up. Course Status hides below `lg`, then Kambaz Navigation and Course Navigation below `md`",
    ],
  },
  {
    id: "checklist",
    title: "Coverage is §2.4.10",
    kind: "content",
    bullets: [
      "§2.4 walks through Kambaz Navigation, Dashboard, Course Navigation, Modules, Home, People, and Assignments",
      "Assignment Editor and Account stay **On your own**: match the figures and interactive demos in those sections",
      "Use the §2.4.10 checklist after you restyle, not instead of walking the screens",
    ],
  },
  {
    id: "next-up",
    title: "Next: the black sidebar",
    kind: "title",
    bullets: [
      "Kambaz now loads the theme and utilities without Preflight",
      "§2.4.1: pin Kambaz Navigation as a fixed icon column",
    ],
  },
];
