import type { LectureSlide } from "../types";

export const CSS_FLOAT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Float",
      "Chapter 2 §2.1.17–2.1.18 · wrap text, then a float “grid”",
    ],
  },
  {
    id: "purpose",
    title: "Float pulls a box to an edge",
    kind: "content",
    bullets: [
      "`float: left` or `float: right` takes a box out of normal stacking",
      "Following **inline** content wraps beside it — the classic “image + paragraph” trick",
      "This deck uses **colored boxes**, not photos. Same `wd-float-*` classes as Lab 2",
      "Flex (next deck) is the modern row/column tool. Still learn float — Lab 2 grades it",
    ],
  },
  {
    id: "classes",
    title: "float left, right, then clear",
    kind: "content",
    bullets: [
      "Floated boxes leave the flow. The next block can slide up beside them",
      "`clear: both` on `wd-float-done` stops the wrap and starts a new row",
    ],
    code: `.wd-float-left {
  float: left;
  height: 100px;
}
.wd-float-right {
  float: right;
  height: 100px;
}
.wd-float-done {
  clear: both;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "float-demo",
    title: "Boxes wrap, then clear",
    kind: "demo",
    bullets: [
      "Yellow / blue / red portrait boxes float left in a row",
      "A gray card floats right so text can wrap the other way",
      "The empty `wd-float-done` div ends the wrap",
    ],
    code: `<div className="wd-float-left wd-dimension-portrait wd-bg-color-yellow">
  Yellow
</div>
<div className="wd-float-left wd-dimension-portrait wd-bg-color-blue wd-fg-color-white">
  Blue
</div>
<div className="wd-float-done" />`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Float.tsx",
    embed: "css-float",
  },
  {
    id: "grid-idea",
    title: "Float plus % widths is a grid",
    kind: "content",
    bullets: [
      "`width: 50%; float: left` — two columns",
      "Each **row** needs `wd-grid-row` with `clear: both` so the next row does not climb up",
      "No `display: grid` yet. Lab 2 builds columns from float + percentages only",
    ],
    code: `.wd-grid-row {
  clear: both;
}
.wd-grid-col-half-page { width: 50%; float: left; }
.wd-grid-col-third-page { width: 33%; float: left; }
.wd-grid-col-two-thirds-page { width: 67%; float: left; }
.wd-grid-col-left-sidebar { width: 20%; float: left; }
.wd-grid-col-main-content { width: 60%; float: left; }
.wd-grid-col-right-sidebar { width: 20%; float: left; }`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "halves",
    title: "Half and half, then sidebars",
    kind: "content",
    bullets: [
      "Row 1: `wd-grid-col-half-page` twice",
      "Row 2: 20% / 60% / 20% — sidebar, main, sidebar",
    ],
    code: `<div className="wd-grid-row">
  <div className="wd-grid-col-half-page wd-bg-color-yellow">
    <h3>Left half</h3>
  </div>
  <div className="wd-grid-col-half-page wd-bg-color-blue wd-fg-color-white">
    <h3>Right half</h3>
  </div>
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/GridLayout.tsx",
  },
  {
    id: "grid-demo",
    title: "GridLayout.tsx",
    kind: "demo",
    bullets: [
      "Two rows, no flex, no CSS Grid module",
      "If a row climbs beside the one above, you forgot `wd-grid-row` / `clear`",
    ],
    embed: "css-grid-layout",
  },
  {
    id: "next-up",
    title: "Next: flex",
    kind: "title",
    bullets: [
      "Float wraps text and can fake columns if you clear each row",
      "Deck 7: `display: flex` — rows without floats, clearing, or percentage math",
    ],
  },
];
