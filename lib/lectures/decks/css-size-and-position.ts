import type { LectureSlide } from "../types";

export const CSS_SIZE_AND_POSITION_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Size and Position",
      "Chapter 2 §2.1.12–2.1.16 · `Dimensions`, `Display`, `Positions`, `Zindex`",
    ],
  },
  {
    id: "purpose",
    title: "Size, then take it off-flow",
    kind: "content",
    bullets: [
      "Block boxes stretch to the parent unless you set `width` and `height`",
      "Narrowing a block does **not** put it on the same line as its neighbor",
      "`position` then nudges or removes a box from normal flow",
    ],
  },
  {
    id: "dimensions",
    title: "Portrait, landscape, square",
    kind: "demo",
    bullets: [
      "Three sized `div`s still **stack** — they are still block boxes",
      "Ids live on `wd-css-dimensions`. Classes: `wd-dimension-*`",
    ],
    code: `.wd-dimension-portrait { width: 75px; height: 100px; }
.wd-dimension-landscape { width: 100px; height: 75px; }
.wd-dimension-square { width: 75px; height: 75px; }`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    embed: "css-dimensions",
  },
  {
    id: "display",
    title: "Block, inline, inline-block",
    kind: "content",
    bullets: [
      "`inline` — stay in the line. `width` / `height` are **ignored** (`span`, `a`)",
      "`block` — new line; honor size; stretch to the parent by default",
      "`inline-block` — sit in the line **and** honor `width` / `height`",
    ],
    code: `.wd-display-inline {
  display: inline;
  width: 150px;
  height: 50px;
}
.wd-display-inline-block {
  display: inline-block;
  width: 150px;
  height: 50px;
}
.wd-display-block {
  display: block;
  width: 150px;
  height: 50px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "display-demo",
    title: "Same spans, three display values",
    kind: "demo",
    bullets: [
      "Lab 2 applies all three to `span` tags so the only change is `display`",
      "Row 1 stays text-sized. Row 2 is 150×50 chips on one line. Row 3 stacks",
    ],
    code: `<span className="wd-display-inline wd-bg-color-red">Inline 1</span>
<span className="wd-display-inline-block wd-bg-color-yellow">
  Inline-block 2
</span>
<span className="wd-display-block wd-bg-color-blue wd-fg-color-white">
  Block 3
</span>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Display.tsx",
    embed: "css-display",
  },
  {
    id: "relative",
    title: "Relative leaves a ghost space",
    kind: "demo",
    bullets: [
      "`position: relative` plus `top` / `left` / `right` / `bottom` nudges the box",
      "The original space stays behind — neighbors do **not** reflow into the gap",
    ],
    code: `.wd-pos-relative-nudge-up-right {
  position: relative;
  bottom: 30px;
  left: 30px;
}
.wd-pos-relative-nudge-down-right {
  position: relative;
  top: 20px;
  left: 20px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeAddedLines: [2, 8],
    embed: "css-position-relative",
  },
  {
    id: "absolute",
    title: "Absolute leaves the normal flow",
    kind: "demo",
    bullets: [
      "`position: absolute` is offset from the nearest positioned ancestor",
      "That ancestor must be `relative`, `absolute`, or `fixed` — else the page itself",
      "Lab 2 wraps three boxes in `wd-pos-relative` with an explicit height",
    ],
    code: `.wd-pos-absolute-10-10 {
  position: absolute;
  top: 10px;
  left: 10px;
}
.wd-pos-absolute-50-50 {
  position: absolute;
  top: 50px;
  left: 50px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeAddedLines: [2, 7],
    embed: "css-position-absolute",
  },
  {
    id: "fixed",
    title: "Fixed sticks to the viewport",
    kind: "demo",
    bullets: [
      "`position: fixed` anchors to the **browser window**, not an ancestor",
      "Scroll the page: the blue square stays glued to the right, halfway down",
      "This embed contains the square so it does not escape the slide",
    ],
    code: `.wd-pos-fixed {
  position: fixed;
  right: 0px;
  bottom: 50%;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    embed: "css-position-fixed",
  },
  {
    id: "zindex",
    title: "z-index wins the overlap",
    kind: "demo",
    bullets: [
      "Positioned boxes can overlap. Later HTML wins by default",
      "`z-index: 10` on the landscape box pulls it above the red square even though it is declared first",
    ],
    code: `.wd-zindex-bring-to-front {
  z-index: 10;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    embed: "css-zindex",
  },
  {
    id: "next-up",
    title: "Next: media queries",
    kind: "title",
    bullets: [
      "You can size a box, change how it flows, and stack overlaps on purpose",
      "Deck 5: `@media` so the same markup changes at different viewport widths",
    ],
  },
];
