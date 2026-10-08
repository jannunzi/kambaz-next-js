import type { LectureSlide } from "../types";

export const SINGLE_PAGE_NAVIGATION_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "REACT NAVIGATION",
      "Move between lab screens without a full reload",
    ],
  },
  {
    id: "section",
    title: "SINGLE PAGE NAV",
    kind: "content",
    bullets: [
      "A **SPA** keeps one HTML shell loaded and updates the UI as the user moves around",
      "Prefer `Link` from `next/link` for routes you created with `page.tsx`",
      "A raw `<a href=\"/labs/lab1\">` still works — and tells the browser to fetch a **new** document",
    ],
  },
  {
    id: "lab-screens",
    title: "Implement Some Screens",
    kind: "content",
    bullets: [
      "Stub Lab 2 and Lab 3 so the TOC has somewhere to go",
      "Each screen is a `page.tsx`. CSS and JavaScript fill these files in later chapters",
    ],
    code: `export default function Lab2() {
  return (
    <div>
      <h2>Lab 2</h2>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
    codeBlocks: [
      {
        file: "app/labs/lab3/page.tsx",
        language: "tsx",
        code: `export default function Lab3() {
  return (
    <div>
      <h2>Lab 3</h2>
    </div>
  );
}`,
      },
    ],
  },
  {
    id: "link-toc",
    title: "Add Table of Content",
    kind: "demo",
    embed: "labs-index",
    bullets: [
      "`import Link from \"next/link\"`",
      "`<Link href=\"/labs/lab1\">Lab 1</Link>` — `href` is the path, not a file path",
      "`Link` still renders an anchor. It intercepts the click so React can swap the page",
    ],
    code: `import Link from "next/link";

<Link href="/labs/lab1" id="wd-lab1-link">Lab 1</Link>
<Link href="/labs/lab2" id="wd-lab2-link">Lab 2</Link>
<Link href="/labs/lab3" id="wd-lab3-link">Lab 3</Link>`,
    codeLanguage: "tsx",
  },
  {
    id: "labs-index-toc",
    title: "Create a Table of Content",
    kind: "demo",
    bullets: [
      "The Labs index is `app/labs/page.tsx` — URL `/labs`",
      "`TOC.tsx` is the reusable table of contents — not copied into every lab",
    ],
    code: `import Link from "next/link";

export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <ul>
        <li>
          <Link href="/labs/lab1">Lab 1: HTML Examples</Link>
        </li>
        <li>
          <Link href="/labs/lab2">Lab 2: CSS Basics</Link>
        </li>
        <li>
          <Link href="/labs/lab3">Lab 3: JavaScript Fundamentals</Link>
        </li>
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/page.tsx",
    codeBlocks: [
      {
        file: "app/labs/TOC.tsx",
        language: "tsx",
        code: `import Link from "next/link";

export default function TOC() {
  return (
    <ul>
      <li><Link href="/labs">Home</Link></li>
      <li><Link href="/labs/lab1">Lab 1</Link></li>
      <li><Link href="/labs/lab2">Lab 2</Link></li>
      <li><Link href="/labs/lab3">Lab 3</Link></li>
    </ul>
  );
}`,
      },
    ],
    embed: "labs-index",
  },
  {
    id: "layout-children",
    title: "LAYOUTS",
    kind: "demo",
    bullets: [
      "`layout.tsx` keeps the TOC. `{children}` is the page that **swaps**",
      "`page.tsx` creates a URL. `layout.tsx` does **not**",
      "`Readonly<…>` is TypeScript: the function cannot change its props object",
    ],
    code: `import { ReactNode } from "react";
import TOC from "./TOC";

export default function LabsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <table>
      <tbody>
        <tr>
          <td valign="top" width="100px">
            <TOC />
          </td>
          <td valign="top">{children}</td>
        </tr>
      </tbody>
    </table>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/layout.tsx",
    codeAddedLines: [2, [12, 14]],
    embed: "labs-layout",
    interactiveHint:
      "Click Lab 2 in the live TOC. The left column stays. Only the page column — {children} — changes.",
  },
  {
    id: "lab2-page",
    title: "Lab 2 is its own page.tsx",
    kind: "demo",
    embed: "labs-layout",
    bullets: [
      "Create `app/labs/lab2/page.tsx` — URL `/labs/lab2`",
      "A heading is enough for this week. CSS fills the file in Chapter 2",
    ],
    code: `export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2</h2>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
  },
  {
    id: "lab3-page",
    title: "Lab 3 is the same pattern",
    kind: "demo",
    embed: "labs-layout",
    bullets: [
      "`app/labs/lab3/page.tsx` — URL `/labs/lab3`",
      "Add a `Link` on the Labs index (and in `TOC.tsx`) so the screen is reachable",
    ],
    code: `export default function Lab3() {
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
  },
  {
    id: "history-not-hash",
    title: "Paths, not hash routes",
    kind: "content",
    bullets: [
      "Old SPAs used `#/lab1` because changing the fragment does not reload",
      "That is **not** how the App Router works",
      "Next.js uses the **History API** so `/labs/lab1` updates without a full reload",
      "Reserve `#fragment` for in-page TOC (the last deck)",
    ],
  },
  {
    id: "kambaz-group",
    title: "KAMBAZ",
    kind: "content",
    bullets: [
      "Create the Kambaz screen under a **route group**: `app/(kambaz)/page.tsx`",
      "Parentheses are for organization. The group name does **not** appear in the URL",
      "Put the screen at `app/(kambaz)/page.tsx`, not `app/Kambaz/page.tsx`",
    ],
    code: `export default function Kambaz() {
  return (
    <div id="wd-kambaz">
      <h1>Kambaz</h1>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/page.tsx",
  },
  {
    id: "kambaz-default",
    title: "DEFAULT SCREEN",
    kind: "content",
    bullets: [
      "Rename the folder to **`(kambaz)`**. Remove a leftover `app/page.tsx` if it also claims `/`",
      "`app/(kambaz)/page.tsx` **is** the `/` route — not `/(kambaz)`",
      "Point the Labs TOC at `/` so Kambaz is the default landing screen",
    ],
    code: `<Link href="/" id="wd-kambaz-link">Kambaz</Link>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/TOC.tsx",
  },
  {
    id: "table-layout-temp",
    title: "Add New Link to New Screen",
    kind: "content",
    bullets: [
      "Add a Kambaz `Link` to `TOC.tsx` once the screen exists",
      "The labs (and Kambaz) layouts still use a `<table>` to sit nav beside content — temporary until CSS",
    ],
    code: `<li>
  <Link href="/" id="wd-kambaz-link">
    Kambaz
  </Link>
</li>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/TOC.tsx",
  },
  {
    id: "checklist",
    title: "Make Kambaz the landing screen",
    kind: "content",
    bullets: [
      "Lab 1 covers headings, paragraphs, lists, tables, images, forms, and anchors",
      "Labs index + TOC use `Link` to Lab 1–3",
      "A labs layout keeps navigation visible while `{children}` swap",
      "`(kambaz)` can own `/` after you remove the extra `app/page.tsx`",
    ],
  },
  {
    id: "next-up",
    title: "OFFICE HOURS",
    kind: "break",
    bullets: [
      "Bring the Lab 1 URL and the DevTools Elements panel if a `wd-` id is missing",
      "Hours and links: the course Office Hours page and the syllabus",
    ],
  },
];
