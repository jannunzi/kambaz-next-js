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
    kind: "content",
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
  },
  {
    id: "tsx",
    title: "First version of Flex.tsx is just the row",
    kind: "content",
    bullets: [
      "`display: flex` lines children up in a row with no floats, clearing, or percentage math.",
      "The next steps add `wd-flex-grow-1`, then `wd-width-75px`, and reprint the file",
    ],
    code: `export default function Flex() {
  return (
    <div id="wd-css-flex">
      <h2>Flex</h2>
      <div className="wd-flex-row-container">
        <div className="wd-bg-color-yellow">Column 1</div>
        <div className="wd-bg-color-blue wd-fg-color-white">Column 2</div>
        <div className="wd-bg-color-red wd-fg-color-white">Column 3</div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Flex.tsx",
  },
  {
    id: "row-live",
    title: "Live flex row",
    kind: "demo",
    bullets: [
      "Three columns on one line. None of them grows yet",
      "Column 3 is only as wide as the words “Column 3”",
    ],
    embed: "css-flex-row",
  },
  {
    id: "grow",
    title: "flex-grow absorbs leftover space",
    kind: "content",
    bullets: [
      "Default grow is 0 — a child stays as wide as its content",
      "`flex-grow: 1` on column 3 stretches it across the leftover width",
      "Next slide: paste `Flex.tsx` with `wd-flex-grow-1` on Column 3",
    ],
    code: `.wd-flex-grow-1 {
  flex-grow: 1;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeAddedLines: [[1, 3]],
  },
  {
    id: "grow-tsx",
    title: "Column 3 grows",
    kind: "content",
    bullets: [
      "`flex-grow: 1` lets the last column stretch to fill room the others do not use.",
      "Same file. Column 3’s `className` gains `wd-flex-grow-1`",
      "Columns 1 and 2 stay as wide as their text",
    ],
    code: `export default function Flex() {
  return (
    <div id="wd-css-flex">
      <h2>Flex</h2>
      <div className="wd-flex-row-container">
        <div className="wd-bg-color-yellow">Column 1</div>
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
    codeHighlightLines: [8],
  },
  {
    id: "grow-live",
    title: "Live flex-grow",
    kind: "demo",
    bullets: [
      "Flex children can grow to absorb leftover space; only the column with `flex-grow: 1` stretches.",
      "Columns 1 and 2 stay text-sized",
      "The `Flex.tsx` you just pasted: Column 3 carries `wd-flex-grow-1`",
    ],
    embed: "css-flex-grow",
  },
  {
    id: "pin",
    title: "Pin a column, grow the last",
    kind: "content",
    bullets: [
      "`wd-width-75px` sets `width: 110px` and `flex-shrink: 0`",
      "The name says 75. The declaration is 110 so “Column 1” plus padding fits",
      "Column 2 stays natural. Column 3 (`wd-flex-grow-1`) takes the rest",
    ],
    code: `.wd-width-75px {
  /* Room for "Column 1" + 10px padding under border-box */
  width: 110px;
  flex-shrink: 0;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeHighlightLines: [3],
  },
  {
    id: "pin-tsx",
    title: "Pin column 1",
    kind: "content",
    bullets: [
      "Pin the first column to a fixed width and let the last column absorb what is left.",
      "Column 1 gains `wd-width-75px`. Column 3 keeps `wd-flex-grow-1`",
      "This is the finished `Flex.tsx`",
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
    codeHighlightLines: [8],
  },
  {
    id: "pin-live",
    title: "Live pinned column",
    kind: "demo",
    bullets: [
      "Column 1 cannot shrink below the declared width",
      "Column 3 still eats whatever is left",
    ],
    embed: "css-flex-width",
  },
  {
    id: "next-up",
    title: "Next: media queries",
    kind: "title",
    bullets: [
      "You can line children up, grow leftover space, and pin a sidebar column",
      "§2.1.20: `@media` so the same markup changes at different viewport widths",
    ],
  },
];
