import type { LectureSlide } from "../types";

export const REACT_ICONS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · React Icons",
      "§2.2 · `ReactIconsSampler.tsx` — icons as React components",
    ],
  },
  {
    id: "purpose",
    title: "Icons are components, not images",
    kind: "content",
    bullets: [
      "**React Icons** bundles Font Awesome, Heroicons, and other families as JSX",
      "Each icon is a component you import — no sprite sheet, no `<i class=\"fa …\">`",
      "Browse [react-icons.github.io/react-icons](https://react-icons.github.io/react-icons) and copy the import",
      "Kambaz later uses these on Navigation, Modules, and Course Status",
    ],
  },
  {
    id: "install",
    title: "Install from the project root",
    kind: "content",
    bullets: [
      "One package. Many icon families live under different import paths",
      "`fa`, `fa6`, `ai`, `vsc`, `md`, `hi2` — the suffix is the family",
    ],
    code: "npm install react-icons",
    codeLanguage: "bash",
  },
  {
    id: "utilities-css",
    title: "Tailwind utilities, no Preflight",
    kind: "content",
    bullets: [
      "**Tailwind CSS** is a library of **utilities**: small one-job classes such as `flex` and `text-3xl`",
      "Its **theme** layer holds colors, spacing, and fonts as **CSS variables**, written `--name` and read with `var(--name)`",
      "**Preflight** is Tailwind's base reset. It strips default heading sizes, margins, and list bullets, so this file leaves it out",
      "`layer(...)` puts each import in a named **cascade layer**. When two rules conflict, the later layer wins",
    ],
    code: `/* Theme + utilities without Preflight, for the Labs */
@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/utilities" layer(utilities);`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/tailwind/utilities.css",
  },
  {
    id: "sampler",
    title: "Six families in one sampler",
    kind: "demo",
    bullets: [
      "Line 1 imports the `utilities.css` file from the previous slide",
      "Each icon comes from a different path: `vsc`, `ai`, `fa6`, `fa`",
      "`mb-4` adds bottom margin, `font-sans` picks a sans-serif font, and `text-lg font-semibold` makes a larger, bolder heading",
      "`flex` puts the icons in a row, `gap-3` spaces them 0.75rem apart, and `text-3xl` makes text large",
    ],
    code: `import "@/app/labs/lab2/tailwind/utilities.css";
import { FaCalendar, FaEnvelopeOpenText, FaRegClock } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaBookBible } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";

export default function ReactIconsSampler() {
  return (
    <div id="wd-react-icons-sampler" className="mb-4 font-sans">
      <h2 className="text-lg font-semibold">React Icons Sampler</h2>
      <div className="flex gap-3 text-3xl">
        <VscAccount />
        <AiOutlineDashboard />
        <FaBookBible />
        <FaCalendar />
        <FaEnvelopeOpenText />
        <FaRegClock />
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/ReactIconsSampler.tsx",
  },
  {
    id: "sampler-live",
    title: "Live ReactIconsSampler",
    kind: "demo",
    bullets: [
      "React Icons are sized in **em**, a length relative to the element's own font size. An icon inherits its parent's size, so a bigger font on the parent gives bigger icons.",
      "Six icons, one row, sized by the parent `text-3xl`",
      "Import the sampler into Lab 2 so it stays on the growing page",
    ],
    embed: "react-icons",
  },
  {
    id: "class-name",
    title: "className, style, and size",
    kind: "content",
    bullets: [
      "Icon components accept ordinary element props",
      "`className=\"text-4xl text-red-600\"` — Tailwind utilities work here too",
      "`size={32}` is pixels if you prefer a number",
      "`text-3xl` on the parent already scaled the sampler row",
    ],
    code: `<FaCalendar className="text-4xl text-red-600" />
<AiOutlineDashboard size={32} style={{ color: "navy" }} />`,
    codeLanguage: "tsx",
  },
  {
    id: "historical",
    title: "Font Awesome was the old path",
    kind: "content",
    bullets: [
      "This course uses **React Icons** so icons ship with the app and tree-shake",
      "You can still recognize FA names — `FaCalendar` is the same glyph",
    ],
  },
  {
    id: "kambaz-later",
    title: "These icons dress Kambaz",
    kind: "content",
    bullets: [
      "Dashboard link → `AiOutlineDashboard`",
      "Account → `FaRegCircleUser` / `VscAccount`",
      "Calendar, Inbox, checkmarks — pick a fitting family in §2.4",
      "Import the sampler into Lab 2 so it stays on the growing page",
    ],
  },
  {
    id: "next-up",
    title: "Next: enable Tailwind",
    kind: "title",
    bullets: [
      "You can import an icon from a family path and size it with `className`",
      "§2.3: scope Tailwind to `/labs/lab2/tailwind` and learn utility classes",
    ],
  },
];
