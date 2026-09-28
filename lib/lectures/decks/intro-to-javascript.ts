import type { LectureSlide } from "../types";

export const INTRO_TO_JAVASCRIPT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Introduction to JavaScript",
      "§3.1–3.2 · Logic in the page — Lab 3 starts here",
    ],
  },
  {
    id: "why-now",
    title: "HTML and CSS were static on purpose",
    kind: "content",
    bullets: [
      "Chapters 1–2 gave Kambaz **structure** and **style**",
      "Those screens still show the same markup no matter who is signed in",
      "This chapter takes control of **data and logic** so the UI can change with the data",
      "Same spine as `/book/ch3` and Lab 3 — one component per idea",
    ],
  },
  {
    id: "javascript",
    title: "JavaScript is the language of the page",
    kind: "content",
    bullets: [
      "**JavaScript**, officially **ECMAScript**, is what browsers run to script pages",
      "ECMA standardized it in 1997 so implementations would agree",
      "**ES6 / ECMAScript 2015** added `let`/`const`, arrows, templates, modules",
      "That dialect is what React uses to build **single-page applications**",
    ],
  },
  {
    id: "typescript",
    title: "TypeScript is JavaScript plus types",
    kind: "content",
    bullets: [
      "This course writes React in `.tsx` — JavaScript with type annotations",
      "Types are compile-time only. Browsers and Node still run JavaScript",
      "`a: number` catches mistakes before the page does",
    ],
  },
  {
    id: "objectives",
    title: "What Chapter 3 teaches",
    kind: "content",
    bullets: [
      "Variables, types, booleans, `null` vs `undefined`",
      "Conditionals, the ternary, and short-circuit `&&` output",
      "Functions — legacy, arrows, implied return, template literals",
      "Arrays, objects, then a data-driven Kambaz (later decks)",
    ],
  },
  {
    id: "lab3-stub",
    title: "Start a Lab 3 page",
    kind: "demo",
    bullets: [
      "Keep working in the same `webdev-client` project",
      "`mkdir app/labs/lab3` then a single top-level component",
      "Link it from `app/labs/page.tsx` and `app/labs/TOC.tsx` — same as Lab 2",
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
    codeHighlightLines: [3, [4, 5]],
    embed: "lab3-stub",
  },
  {
    id: "grow-it",
    title: "Grow Lab 3 one import at a time",
    kind: "content",
    bullets: [
      "Each section is a throwaway drill — one idea per file",
      "Import the new component into `page.tsx` and confirm the output",
      "Kambaz later in the chapter is the application you keep",
      "Checklists in §3.7.5 and §3.9.10 are recaps, not a reason to skip ahead",
    ],
  },
  {
    id: "next-up",
    title: "Next: variables and constants",
    kind: "title",
    bullets: [
      "You have a Lab 3 route. Now store values in it",
      "§3.2.1: `var`, `let`, `const`, and `{value}` in JSX",
    ],
  },
];
