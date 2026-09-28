import type { LectureSlide } from "../types";

export const TAILWIND_INTRO_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Tailwind Intro",
      "§2.3 · Utility-first CSS, scoped to a Lab 2 sub-route",
    ],
  },
  {
    id: "purpose",
    title: "Utilities instead of custom rules",
    kind: "content",
    bullets: [
      "**Tailwind CSS** is utility-first: compose a look in `className`",
      "`p-4` is padding. `bg-red-500` is a background. One job per class",
      "`create-next-app` already installed Tailwind — Chapter 1 commented it out so HTML used browser defaults",
      "Do **not** turn it on globally yet. Scope it to a sub-lab",
    ],
  },
  {
    id: "mental-model",
    title: "Read a class list left to right",
    kind: "content",
    bullets: [
      "A class is a tiny CSS rule Tailwind already wrote",
      "A length in **rem** is relative to the root font size, usually 16px, so 2rem = 32px.",
      "`gap` is the space between flex or grid items. `flex gap-3 text-3xl` is a row, a 0.75rem gap, and large type",
      "You are not inventing selector names. You are picking utilities",
      "Plain CSS from §2.1 still matters — utilities compile down to the same properties",
    ],
  },
  {
    id: "why-scope",
    title: "Full Tailwind includes Preflight",
    kind: "content",
    bullets: [
      "`@import \"tailwindcss\"` loads **Preflight**, Tailwind's base reset. It wipes plain HTML defaults",
      "Lab 2’s CSS samples (`p`, headings, lists) would look wrong under that reset",
      "So Lab 2 Tailwind lives on its own route: `app/labs/lab2/tailwind/`",
      "Kambaz later imports **theme + utilities only** — no Preflight",
    ],
  },
  {
    id: "entry-css",
    title: "A tiny CSS entry file",
    kind: "content",
    bullets: [
      "Create `app/labs/lab2/tailwind/index.css`",
      "One line pulls in the library for pages that import this file",
    ],
    code: `@import "tailwindcss";`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/tailwind/index.css",
    codeHighlightLines: [1],
  },
  {
    id: "page",
    title: "A page that opts in",
    kind: "content",
    bullets: [
      "`import \"./index.css\"` — same pattern as Lab 2’s custom CSS",
      "Because this file is `app/labs/lab2/tailwind/page.tsx`, it has its own URL",
      "`p-8` and `text-4xl` only work here because this page imported Tailwind",
    ],
    code: `import "./index.css";

export default function TailwindLab() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Tailwind CSS</h1>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/page.tsx",
    codeAddedLines: [1, [5, 6]],
  },
  {
    id: "link-it",
    title: "Link it from Lab 2",
    kind: "content",
    bullets: [
      "Link to `/labs/lab2/tailwind` from the main Lab 2 page so both are reachable from the Labs table of contents",
      "Both routes stay in the Labs TOC — CSS first, then utilities",
      "Work through spacing, type, color, responsive, filters, and grid one component at a time",
    ],
    code: `import Link from "next/link";

<p>
  <Link href="/labs/lab2/tailwind">Open Tailwind CSS lab →</Link>
</p>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
    codeAddedLines: [1],
  },
  {
    id: "tailwind-and-icons",
    title: "Tailwind and React Icons",
    kind: "content",
    bullets: [
      "This course styles screens with **Tailwind** utilities and **React Icons**",
      "Follow `/book/ch2` and `/labs/lab2/tailwind`",
      "A **breakpoint** is a viewport width at which styles change. `md:` starts at 48rem (768px)",
      "A **12-column grid** divides the page into twelve columns. `md:col-span-6` spans six of them",
      "Course Navigation’s list group is CSS you write in `kambaz.css`",
    ],
  },
  {
    id: "next-up",
    title: "Next: spacing utilities",
    kind: "title",
    bullets: [
      "You can opt a route into Tailwind without resetting the rest of Lab 2",
      "§2.3.1: `m-*` and `p-*` with direction letters",
    ],
  },
];
