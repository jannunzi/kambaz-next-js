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
    kind: "content",
    bullets: [
      "Three sized `div`s still **stack** — they are still block boxes",
      "Classes: `wd-dimension-portrait`, `wd-dimension-landscape`, `wd-dimension-square`",
    ],
    code: `.wd-dimension-portrait {
  width: 75px;
  height: 100px;
}
.wd-dimension-landscape {
  width: 100px;
  height: 75px;
}
.wd-dimension-square {
  width: 75px;
  height: 75px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "dimensions-tsx",
    title: "Dimensions.tsx",
    kind: "content",
    bullets: [
      "Wrapper id `wd-css-dimensions`",
      "Yellow portrait, blue landscape, red square — same classes the later demos reuse",
    ],
    code: `export default function Dimensions() {
  return (
    <div id="wd-css-dimensions">
      <h2>Dimension</h2>
      <div>
        <div className="wd-dimension-portrait wd-bg-color-yellow">Portrait</div>
        <div className="wd-dimension-landscape wd-bg-color-blue wd-fg-color-white">
          Landscape
        </div>
        <div className="wd-dimension-square wd-bg-color-red">Square</div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Dimensions.tsx",
  },
  {
    id: "dimensions-live",
    title: "Live Dimensions.tsx",
    kind: "demo",
    bullets: [
      "Three different sizes, still one column",
      "Width does not turn a block into a row",
    ],
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
      "Each rule also sets `padding: 5px`",
    ],
    code: `.wd-display-inline {
  display: inline;
  width: 150px;
  height: 50px;
  padding: 5px;
}
.wd-display-inline-block {
  display: inline-block;
  width: 150px;
  height: 50px;
  padding: 5px;
}
.wd-display-block {
  display: block;
  width: 150px;
  height: 50px;
  padding: 5px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeHighlightLines: [5, 11, 17],
  },
  {
    id: "display-tsx",
    title: "Display.tsx",
    kind: "content",
    bullets: [
      "Wrapper id `wd-css-display`. Three headings, nine spans",
      "Same colors in each row so the only change is `display`",
    ],
    code: `export default function Display() {
  return (
    <div id="wd-css-display">
      <h2>Display</h2>
      <h3>Inline</h3>
      <div>
        <span className="wd-display-inline wd-bg-color-red">Inline 1</span>
        <span className="wd-display-inline wd-bg-color-yellow">Inline 2</span>
        <span className="wd-display-inline wd-bg-color-blue wd-fg-color-white">
          Inline 3
        </span>
      </div>
      <h3>Inline-block</h3>
      <div>
        <span className="wd-display-inline-block wd-bg-color-red">
          Inline-block 1
        </span>
        <span className="wd-display-inline-block wd-bg-color-yellow">
          Inline-block 2
        </span>
        <span className="wd-display-inline-block wd-bg-color-blue wd-fg-color-white">
          Inline-block 3
        </span>
      </div>
      <h3>Block</h3>
      <div>
        <span className="wd-display-block wd-bg-color-red">Block 1</span>
        <span className="wd-display-block wd-bg-color-yellow">Block 2</span>
        <span className="wd-display-block wd-bg-color-blue wd-fg-color-white">
          Block 3
        </span>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Display.tsx",
  },
  {
    id: "display-demo",
    title: "Live Display.tsx",
    kind: "demo",
    bullets: [
      "Row 1 stays text-sized. `width` and `height` do not apply to `inline`",
      "Row 2 is 150×50 chips on one line. Row 3 stacks",
    ],
    embed: "css-display",
  },
  {
    id: "relative",
    title: "Relative leaves a ghost space",
    kind: "content",
    bullets: [
      "`position: relative` plus `top` / `left` / `right` / `bottom` nudges the box",
      "The original space stays behind — neighbors do **not** reflow into the gap",
      "`.wd-pos-relative` is the positioned ancestor the absolute boxes need next",
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
}
.wd-pos-relative {
  position: relative;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeAddedLines: [2, 8, [11, 13]],
  },
  {
    id: "relative-tsx",
    title: "Positions.tsx — relative",
    kind: "content",
    bullets: [
      "The file’s root is `#wd-css-positions`. The relative section sits inside it",
      "Portrait nudges down-right. Landscape nudges up-right. Square stays put",
    ],
    code: `export default function Positions() {
  return (
    <div id="wd-css-positions">
      <div id="wd-css-position-relative">
        <h2>Relative</h2>
        <div className="wd-bg-color-gray">
          <div className="wd-bg-color-yellow wd-dimension-portrait">
            <div className="wd-pos-relative-nudge-down-right">Portrait</div>
          </div>
          <div className="wd-pos-relative-nudge-up-right wd-bg-color-blue wd-fg-color-white wd-dimension-landscape">
            Landscape
          </div>
          <div className="wd-bg-color-red wd-dimension-square">Square</div>
        </div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Positions.tsx",
    codeHighlightLines: [3, 16],
  },
  {
    id: "relative-live",
    title: "Live relative position",
    kind: "demo",
    bullets: [
      "The nudged boxes overlap their neighbors. The gray row does not close the gap",
      "That leftover space is the “ghost”",
    ],
    embed: "css-position-relative",
  },
  {
    id: "absolute",
    title: "Absolute leaves the normal flow",
    kind: "content",
    bullets: [
      "`position: absolute` is offset from the nearest positioned ancestor",
      "That ancestor must be `relative`, `absolute`, or `fixed` — else the page itself",
      "`.wd-pos-absolute-120-20` is the red square: 20px down, 120px from the left",
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
}
.wd-pos-absolute-120-20 {
  position: absolute;
  top: 20px;
  left: 120px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeAddedLines: [2, 7, [11, 15]],
  },
  {
    id: "absolute-tsx",
    title: "Positions.tsx — absolute",
    kind: "content",
    bullets: [
      "Paste the TSX below inside `#wd-css-positions`, after the previous section.",
      "`wd-pos-relative` plus `height: 150` is the containing block",
    ],
    code: `<div id="wd-css-position-absolute">
  <h2>Absolute position</h2>
  <div className="wd-pos-relative" style={{ height: 150 }}>
    <div className="wd-pos-absolute-10-10 wd-bg-color-yellow wd-dimension-portrait">
      Portrait
    </div>
    <div className="wd-pos-absolute-50-50 wd-bg-color-blue wd-fg-color-white wd-dimension-landscape">
      Landscape
    </div>
    <div className="wd-pos-absolute-120-20 wd-bg-color-red wd-dimension-square">
      Square
    </div>
  </div>
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Positions.tsx",
    codeHighlightLines: [[3, 12]],
  },
  {
    id: "absolute-live",
    title: "Live absolute position",
    kind: "demo",
    bullets: [
      "Three boxes overlap inside the 150px relative frame",
      "The red square uses `.wd-pos-absolute-120-20`",
    ],
    embed: "css-position-absolute",
  },
  {
    id: "fixed",
    title: "Fixed sticks to the viewport",
    kind: "content",
    bullets: [
      "`position: fixed` anchors to the **browser window**, not an ancestor",
      "Scroll the page: the blue square stays glued to the right, halfway down",
    ],
    code: `.wd-pos-fixed {
  position: fixed;
  right: 0px;
  bottom: 50%;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "fixed-tsx",
    title: "Positions.tsx — fixed",
    kind: "content",
    bullets: [
      "Paste the TSX below inside `#wd-css-positions`, after the previous section.",
      "This embed contains the square so it does not escape the slide",
    ],
    code: `<div id="wd-css-position-fixed">
  <h2>Fixed position</h2>
  Checkout the blue square that says "Fixed position" stuck all the way
  on the right and half way down the page. It doesn't scroll with the
  rest of the page. Its position is "Fixed".
  <div className="wd-pos-fixed wd-dimension-square wd-bg-color-blue wd-fg-color-white">
    Fixed position
  </div>
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Positions.tsx",
  },
  {
    id: "fixed-live",
    title: "Live fixed position",
    kind: "demo",
    bullets: [
      "The blue square is fixed to this figure, not the browser window",
      "In Lab 2 the same class sticks to the viewport",
    ],
    embed: "css-position-fixed",
  },
  {
    id: "positions-file",
    title: "One Positions.tsx file",
    kind: "content",
    bullets: [
      "The three blocks are siblings inside `wd-css-positions`",
      "Pasting them as three roots is invalid JSX. Save this file",
    ],
    code: `export default function Positions() {
  return (
    <div id="wd-css-positions">
      <div id="wd-css-position-relative">
        <h2>Relative</h2>
        <div className="wd-bg-color-gray">
          <div className="wd-bg-color-yellow wd-dimension-portrait">
            <div className="wd-pos-relative-nudge-down-right">Portrait</div>
          </div>
          <div className="wd-pos-relative-nudge-up-right wd-bg-color-blue wd-fg-color-white wd-dimension-landscape">
            Landscape
          </div>
          <div className="wd-bg-color-red wd-dimension-square">Square</div>
        </div>
      </div>
      <div id="wd-css-position-absolute">
        <h2>Absolute position</h2>
        <div className="wd-pos-relative" style={{ height: 150 }}>
          <div className="wd-pos-absolute-10-10 wd-bg-color-yellow wd-dimension-portrait">
            Portrait
          </div>
          <div className="wd-pos-absolute-50-50 wd-bg-color-blue wd-fg-color-white wd-dimension-landscape">
            Landscape
          </div>
          <div className="wd-pos-absolute-120-20 wd-bg-color-red wd-dimension-square">
            Square
          </div>
        </div>
      </div>
      <div id="wd-css-position-fixed">
        <h2>Fixed position</h2>
        Checkout the blue square that says "Fixed position" stuck all the way
        on the right and half way down the page. It doesn't scroll with the
        rest of the page. Its position is "Fixed".
        <div className="wd-pos-fixed wd-dimension-square wd-bg-color-blue wd-fg-color-white">
          Fixed position
        </div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Positions.tsx",
    codeHighlightLines: [3, 4, 16, 30, 39],
  },
  {
    id: "zindex",
    title: "z-index wins the overlap",
    kind: "content",
    bullets: [
      "Positioned boxes can overlap. Later HTML wins by default",
      "`z-index: 10` on the landscape box pulls it above the red square even though it is declared first",
    ],
    code: `.wd-zindex-bring-to-front {
  z-index: 10;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "zindex-tsx",
    title: "Zindex.tsx",
    kind: "content",
    bullets: [
      "Wrapper id `wd-z-index`. Same three absolute classes as the red/yellow/blue stack",
      "Landscape carries `wd-zindex-bring-to-front`",
    ],
    code: `export default function Zindex() {
  return (
    <div id="wd-z-index">
      <h2>Z index</h2>
      <div className="wd-pos-relative" style={{ height: 150 }}>
        <div className="wd-pos-absolute-10-10 wd-bg-color-yellow wd-dimension-portrait">
          Portrait
        </div>
        <div className="wd-zindex-bring-to-front wd-pos-absolute-50-50 wd-dimension-landscape wd-bg-color-blue wd-fg-color-white">
          Landscape
        </div>
        <div className="wd-pos-absolute-120-20 wd-bg-color-red wd-dimension-square">
          Square
        </div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Zindex.tsx",
    codeHighlightLines: [9],
  },
  {
    id: "zindex-live",
    title: "Live Zindex.tsx",
    kind: "demo",
    bullets: [
      "Landscape sits above the red square",
      "Remove `wd-zindex-bring-to-front` and the later red square covers it",
    ],
    embed: "css-zindex",
  },
  {
    id: "next-up",
    title: "Next: float",
    kind: "title",
    bullets: [
      "You can size a box, change how it flows, and stack overlaps on purpose",
      "§2.1.17: `float` to wrap text, then percentage columns",
    ],
  },
];
