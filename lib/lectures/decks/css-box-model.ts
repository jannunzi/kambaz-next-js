import type { LectureSlide } from "../types";

export const CSS_BOX_MODEL_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Box Model",
      "Chapter 2 §2.1.9–2.1.11 · borders, padding, margin, corners",
    ],
  },
  {
    id: "layers",
    title: "Four layers of every box",
    kind: "content",
    bullets: [
      "**Content** — the text or children",
      "**Padding** — space between content and border (background fills this too)",
      "**Border** — the edge: width, style, color",
      "**Margin** — transparent space outside the border, pushing neighbors away",
    ],
    diagram: "box-model",
  },
  {
    id: "borders-mix",
    title: "Mix width, style, and color",
    kind: "content",
    bullets: [
      "Three properties: `border-width`, `border-style`, `border-color`",
      "Lab 2 splits them into small classes so you can remix: fat + red + solid",
      "Styles: `solid`, `dashed`, `dotted`, `double`, …",
    ],
    code: `.wd-border-fat { border-width: 20px 30px 20px 30px; }
.wd-border-thin { border-width: 4px; }
.wd-border-solid { border-style: solid; }
.wd-border-dashed { border-style: dashed; }
.wd-border-yellow { border-color: #ffff07; }
.wd-border-red { border-color: #ff7070; }
.wd-border-blue { border-color: #7070ff; }`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "borders-tsx",
    title: "Borders.tsx",
    kind: "content",
    bullets: [
      "First paragraph: fat, red, solid. Second: thin, blue, dashed",
      "No combined “fat-red-solid” rule — composition is the point",
    ],
    code: `export default function Borders() {
  return (
    <div id="wd-css-borders">
      <h2>Borders</h2>
      <p className="wd-border-fat wd-border-red wd-border-solid">
        Solid fat red border
      </p>
      <p className="wd-border-thin wd-border-blue wd-border-dashed">
        Dashed thin blue border
      </p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Borders.tsx",
  },
  {
    id: "borders-demo",
    title: "Live Borders.tsx",
    kind: "demo",
    bullets: [
      "Fat red solid, then thin blue dashed",
      "Classes stack. Each rule contributes one property",
    ],
    embed: "css-borders",
  },
  {
    id: "padding",
    title: "Padding is inside the border",
    kind: "content",
    bullets: [
      "`padding-top` / `-right` / `-bottom` / `-left`, or one `padding` for all sides",
      "Keep a fat border and a yellow fill so you can *see* the gap",
    ],
    code: `.wd-padded-top-left {
  padding-top: 50px;
  padding-left: 50px;
}
.wd-padded-bottom-right {
  padding-bottom: 50px;
  padding-right: 50px;
}
.wd-padding-fat {
  padding: 50px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "padding-tsx",
    title: "Padding.tsx",
    kind: "content",
    bullets: [
      "Wrapper id `wd-css-paddings`",
      "Three boxes: top-left, bottom-right, and a fat pad on every side",
    ],
    code: `export default function Padding() {
  return (
    <div id="wd-css-paddings">
      <h2>Padding</h2>
      <div className="wd-padded-top-left wd-border-fat wd-border-red wd-border-solid wd-bg-color-yellow">
        Padded top left
      </div>
      <div className="wd-padded-bottom-right wd-border-fat wd-border-blue wd-border-solid wd-bg-color-yellow">
        Padded bottom right
      </div>
      <div className="wd-padding-fat wd-border-fat wd-border-yellow wd-border-solid wd-bg-color-blue wd-fg-color-white">
        Padded all around
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Padding.tsx",
  },
  {
    id: "padding-live",
    title: "Live Padding.tsx",
    kind: "demo",
    bullets: [
      "Yellow fill runs through the padding, up to the border",
      "The gap is inside the edge, not between boxes",
    ],
    embed: "css-padding",
  },
  {
    id: "margins",
    title: "Margin is outside the border",
    kind: "content",
    bullets: [
      "Same pattern as padding — but the gap sits **between** boxes",
      "Margin is transparent. You see whatever is behind the hole",
    ],
    code: `.wd-margin-bottom {
  margin-bottom: 50px;
}
.wd-margin-right-left {
  margin-left: 50px;
  margin-right: 50px;
}
.wd-margin-all-around {
  margin: 30px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "margins-tsx",
    title: "Margins.tsx",
    kind: "content",
    bullets: [
      "Wrapper id `wd-css-margins`",
      "The padding classes stay so you can still see the inside gap",
    ],
    code: `export default function Margins() {
  return (
    <div id="wd-css-margins">
      <h2>Margins</h2>
      <div className="wd-margin-bottom wd-padded-top-left wd-border-fat wd-border-red wd-border-solid wd-bg-color-yellow">
        Margin bottom
      </div>
      <div className="wd-margin-right-left wd-padded-bottom-right wd-border-fat wd-border-blue wd-border-solid wd-bg-color-yellow">
        Margin left right
      </div>
      <div className="wd-margin-all-around wd-padding-fat wd-border-fat wd-border-yellow wd-border-solid wd-bg-color-blue wd-fg-color-white">
        Margin all around
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Margins.tsx",
  },
  {
    id: "margins-live",
    title: "Live Margins.tsx",
    kind: "demo",
    bullets: [
      "The space between boxes is empty — margin does not paint",
      "Padding is still the yellow (or blue) band inside the border",
    ],
    embed: "css-margins",
  },
  {
    id: "box-sizing",
    title: "content-box vs border-box",
    kind: "content",
    bullets: [
      "DevTools colors: tan margin `#f9cc9d`, yellow border `#fddd9b`, green padding `#c3d08b`, blue content `#8cb6c0`",
      "Default `content-box`: `width: 200px` sizes **only** the content. Padding and border add extra pixels",
      "`border-box`: 200×180 **includes** padding and border. The painted box stays that size",
    ],
    code: `.wd-devtools-box {
  box-sizing: border-box;
  width: 100%;
  max-width: 34rem;
  color: #222;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  font-size: clamp(12px, 2.5vw, 14px);
  line-height: 1.2;
}
.wd-devtools-box *,
.wd-devtools-box *::before,
.wd-devtools-box *::after {
  box-sizing: border-box;
}
.wd-devtools-box .wd-bm-margin,
.wd-devtools-box .wd-bm-border,
.wd-devtools-box .wd-bm-padding {
  display: grid;
  grid-template-columns: minmax(2.75rem, auto) minmax(0, 1fr) minmax(2.75rem, auto);
  grid-template-rows: auto minmax(2.25rem, 1fr) auto;
}
.wd-devtools-box .wd-bm-margin {
  background-color: #f9cc9d;
  border: 1px dashed #222;
}
.wd-devtools-box .wd-bm-border,
.wd-devtools-box .wd-bm-padding,
.wd-devtools-box .wd-bm-content {
  grid-column: 2;
  grid-row: 2;
  min-width: 0;
}
.wd-devtools-box .wd-bm-border {
  background-color: #fddd9b;
  border: 1px solid #222;
}
.wd-devtools-box .wd-bm-padding {
  background-color: #c3d08b;
  border: 1px dashed #222;
}
.wd-devtools-box .wd-bm-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.45rem 0.6rem;
  background-color: #8cb6c0;
  border: 1px solid #222;
  text-align: center;
  white-space: nowrap;
}
.wd-devtools-box .wd-bm-label {
  z-index: 1;
  grid-column: 1;
  grid-row: 1;
  align-self: start;
  justify-self: start;
  padding: 3px 5px 0;
  font-size: 0.85em;
}
.wd-devtools-box .wd-bm-top,
.wd-devtools-box .wd-bm-bottom {
  grid-column: 1 / -1;
  padding: 0.35rem 0.25rem;
  text-align: center;
}
.wd-devtools-box .wd-bm-top {
  grid-row: 1;
}
.wd-devtools-box .wd-bm-bottom {
  grid-row: 3;
}
.wd-devtools-box .wd-bm-left,
.wd-devtools-box .wd-bm-right {
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
}
.wd-devtools-box .wd-bm-left {
  grid-column: 1;
}
.wd-devtools-box .wd-bm-right {
  grid-column: 3;
}
.wd-box-sizing-demo {
  background-color: lightgray;
  padding: 10px;
}
.wd-box-sizing-content,
.wd-box-sizing-border {
  width: 200px;
  height: 180px;
  padding: 20px;
  border: 10px solid #c41e3a;
  background-color: #ffff07;
  margin-bottom: 10px;
}
.wd-box-sizing-content {
  box-sizing: content-box;
}
.wd-box-sizing-border {
  box-sizing: border-box;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeHighlightLines: [24, 35, 39, 48, 102, 105],
  },
  {
    id: "box-model-tsx",
    title: "BoxModel.tsx",
    kind: "content",
    bullets: [
      "`BoxModelWidget` draws the DevTools rings: tan margin, yellow border, green padding, blue content",
      "It shows the content-box sample: margin 0, 0, 10, 0; border 10; padding 20; content `200×180`",
      "Both yellow boxes share width 200, height 180, padding 20, and a 10px border",
    ],
    code: `export function BoxModelWidget() {
  return (
    <div
      className="wd-devtools-box"
      role="img"
      aria-label="Box model of the content-box sample: margin 0, 0, 10, 0; border 10; padding 20; content 200 by 180"
    >
      <div className="wd-bm-margin">
        <span className="wd-bm-label">margin</span>
        <span className="wd-bm-top">0</span>
        <span className="wd-bm-left">0</span>
        <span className="wd-bm-right">0</span>
        <span className="wd-bm-bottom">10</span>
        <div className="wd-bm-border">
          <span className="wd-bm-label">border</span>
          <span className="wd-bm-top">10</span>
          <span className="wd-bm-left">10</span>
          <span className="wd-bm-right">10</span>
          <span className="wd-bm-bottom">10</span>
          <div className="wd-bm-padding">
            <span className="wd-bm-label">padding</span>
            <span className="wd-bm-top">20</span>
            <span className="wd-bm-left">20</span>
            <span className="wd-bm-right">20</span>
            <span className="wd-bm-bottom">20</span>
            <div className="wd-bm-content">200×180</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BoxModel() {
  return (
    <div id="wd-css-box-model">
      <h2>Box model</h2>
      <BoxModelWidget />
      <h3>box-sizing</h3>
      <div className="wd-box-sizing-demo">
        <div className="wd-box-sizing-content">
          content-box: width 200px plus padding and border
        </div>
        <div className="wd-box-sizing-border">
          border-box: width 200px includes padding and border
        </div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/BoxModel.tsx",
    codeHighlightLines: [[1, 32], 38],
  },
  {
    id: "box-model-demo",
    title: "Live BoxModel.tsx",
    kind: "demo",
    bullets: [
      "Tan margin, yellow border, green padding, blue content — the DevTools rings",
      "`border-box` stays 200×180. `content-box` measures 260×240",
    ],
    embed: "css-box-model",
  },
  {
    id: "corners",
    title: "border-radius rounds corners",
    kind: "content",
    bullets: [
      "One value rounds all four. Four values go TL, TR, BR, BL",
      "Or target one edge: top pair, then the bottom pair",
    ],
    code: `.wd-rounded-corners-top {
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
}
.wd-rounded-corners-bottom {
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
}
.wd-rounded-corners-all-around {
  border-radius: 50px;
}
.wd-rounded-corners-inline {
  border-radius: 30px 0px 20px 50px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeAddedLines: [[5, 8]],
  },
  {
    id: "corners-tsx",
    title: "Corners.tsx",
    kind: "content",
    bullets: [
      "Wrapper id `wd-css-corners`. Four paragraphs, four radius classes",
      "A thin blue border and fat padding make the curve visible",
    ],
    code: `export default function Corners() {
  return (
    <div id="wd-css-corners">
      <h3>Rounded corners</h3>
      <p className="wd-rounded-corners-top wd-border-thin wd-border-blue wd-border-solid wd-padding-fat">
        Rounded corners on the top
      </p>
      <p className="wd-rounded-corners-bottom wd-border-thin wd-border-blue wd-border-solid wd-padding-fat">
        Rounded corners at the bottom
      </p>
      <p className="wd-rounded-corners-all-around wd-border-thin wd-border-blue wd-border-solid wd-padding-fat">
        Rounded corners all around
      </p>
      <p className="wd-rounded-corners-inline wd-border-thin wd-border-blue wd-border-solid wd-padding-fat">
        Different rounded corners
      </p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Corners.tsx",
  },
  {
    id: "corners-live",
    title: "Live Corners.tsx",
    kind: "demo",
    bullets: [
      "Top only, bottom only, all four, then four different radii",
      "`.wd-rounded-corners-bottom` is the second paragraph",
    ],
    embed: "css-corners",
  },
  {
    id: "next-up",
    title: "Next: size and position",
    kind: "title",
    bullets: [
      "You can pad, space, border, and choose how width is measured",
      "Next: `width` / `height`, `display`, then relative / absolute / fixed / z-index",
    ],
  },
];
