import type { LectureSlide } from "../types";

export const CSS_FLEX_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Flex",
      "Chapter 2 §2.1.19 · `Flex.tsx` row, grow, then a pinned column",
    ],
  },
  {
    id: "purpose",
    title: "Flex is a purpose-built row",
    kind: "content",
    bullets: [
      "`display: flex` on a **container** lines up its children",
      "`flex-direction: row` is horizontal — the Lab 2 default",
      "No floats, no `clear`, no 33% / 67% arithmetic",
      "Tailwind later: `flex`, `flex-row`, `grow`, `w-*`. Same CSS under the hood",
    ],
  },
  {
    id: "row",
    title: "Three columns in one row",
    kind: "demo",
    bullets: [
      "Three `div`s that would stack as blocks sit side by side",
      "A shared child rule sets height 100px and a little padding",
    ],
    code: `.wd-flex-row-container {
  display: flex;
  flex-direction: row;
}
.wd-flex-row-container > div {
  height: 100px;
  padding: 10px;
  white-space: nowrap;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    embed: "css-flex-row",
  },
  {
    id: "grow",
    title: "flex-grow absorbs leftover space",
    kind: "demo",
    bullets: [
      "Default grow is 0 — a child stays as wide as its content",
      "`flex-grow: 1` on column 3 stretches it across the leftover width",
      "Columns 1 and 2 stay text-sized",
    ],
    code: `.wd-flex-grow-1 {
  flex-grow: 1;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeAddedLines: [[1, 3]],
    embed: "css-flex-grow",
  },
  {
    id: "pin",
    title: "Pin a column, grow the last",
    kind: "demo",
    bullets: [
      "`wd-width-75px` sets a fixed width and `flex-shrink: 0` so column 1 cannot collapse",
      "Column 2 stays natural. Column 3 (`wd-flex-grow-1`) takes the rest",
    ],
    code: `.wd-width-75px {
  /* Room for "Column 1" + 10px padding under border-box */
  width: 110px;
  flex-shrink: 0;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    embed: "css-flex-width",
  },
  {
    id: "tsx",
    title: "Flex.tsx — the pinned row",
    kind: "content",
    bullets: [
      "Lab 2’s finished `Flex.tsx` is the third step: pin + grow",
      "Build it incrementally: row, then grow on column 3, then pin column 1",
    ],
    code: `import "./index.css";

export default function Flex() {
  return (
    <div id="wd-css-flex">
      <h2>Flex</h2>
      <div className="wd-flex-row-container">
        <div className="wd-bg-color-yellow wd-width-75px">Column 1</div>
        <div className="wd-bg-color-blue wd-fg-color-white">Column 2</div>
        <div className="wd-bg-color-red wd-fg-color-white wd-flex-grow-1">
          Column 3
        </div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Flex.tsx",
    codeAddedLines: [6, 8],
  },
  {
    id: "next-up",
    title: "Next: rotation and gradients",
    kind: "title",
    bullets: [
      "You can line children up, grow leftover space, and pin a sidebar column",
      "Optional deck 8: `transform: rotate` and CSS gradients — extras, not Lab 2 required",
    ],
  },
];
