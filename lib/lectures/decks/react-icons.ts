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
    id: "sampler",
    title: "Six families in one sampler",
    kind: "demo",
    bullets: [
      "Each icon comes from a different path: `vsc`, `ai`, `fa6`, `fa`",
      "The parent `text-3xl` scales them — icons size in `em`",
    ],
    code: `import "@/app/labs/lab2/tailwind/utilities.css";
import { FaCalendar, FaEnvelopeOpenText, FaRegClock } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaBookBible } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";

export default function ReactIconsSampler() {
  return (
    <div id="wd-react-icons-sampler" className="mb-4 font-sans">
      <h3 className="text-lg font-semibold">React Icons Sampler</h3>
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
    embed: "react-icons",
  },
  {
    id: "class-name",
    title: "className, style, and size",
    kind: "content",
    bullets: [
      "Icon components accept ordinary element props",
      "`className=\"text-4xl text-blue-600\"` — Tailwind utilities work here too",
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
      "Older slides linked a Font Awesome CSS kit and used `<i className=\"fa fa-…\">`",
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
