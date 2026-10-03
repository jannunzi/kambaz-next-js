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
      "This DevTools figure is an illustration of the content-box sample. The Lab 2 files come next",
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
    title: "Two bordered paragraphs",
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
    title: "Live border samples",
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
    title: "Padding on three boxes",
    kind: "content",
    bullets: [
      "Padding is the space between an element's content and its border.",
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
    title: "Live padding",
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
    title: "Margin on three boxes",
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
    title: "Live margins",
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
      "Padding, border, and margin stack on one box: content inside, padding between content and border, margin outside",
      "Background fills the content and the padding. Margin does not paint — you see the parent behind the gap",
      "`content-box` adds padding and border onto `width` and `height` (260×240). `border-box` keeps that yellow box 200×180. Layout math is much easier with `border-box`.",
    ],
    code: `.wd-box-model-parent {
  display: flow-root;
  background-color: lightgray;
  padding-top: 8px;
}
.wd-box-model-margin-label,
.wd-box-model-border-label,
.wd-box-model-padding-label {
  font-size: 12px;
  line-height: 12px;
}
.wd-box-model-box {
  position: relative;
  margin: 20px;
  padding: 20px;
  border: 10px solid #c41e3a;
  background-color: #cfe2ff;
}
.wd-box-model-border-label {
  position: absolute;
  top: -24px;
  left: 0;
  color: #c41e3a;
}
.wd-box-model-margin-label {
  position: absolute;
  bottom: -26px;
  left: -20px;
}
.wd-box-model-padding-label {
  position: absolute;
  top: 2px;
  left: 6px;
}
.wd-box-model-content {
  background-color: #d1e7dd;
  padding: 8px;
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
    codeHighlightLines: [[43, 51], [52, 57]],
  },
  {
    id: "box-model-tsx",
    title: "Same size, two box models",
    kind: "content",
    bullets: [
      "One component stacks the four layers on a single element, instead of three separate demos",
      "The margin stays empty, so the gray parent shows through — the same outside gap as the margin slides",
      "Both yellow boxes declare the same size. `border-box` is the one that stays that size on screen",
    ],
    code: `export default function BoxModel() {
  return (
    <div id="wd-css-box-model">
      <h2>Box model</h2>
      <div className="wd-box-model-parent">
        <div>parent background (shows through the margin)</div>
        <div className="wd-box-model-box">
          <span className="wd-box-model-border-label">border (the red ring)</span>
          <span className="wd-box-model-padding-label">padding</span>
          <div className="wd-box-model-content">content</div>
          <span className="wd-box-model-margin-label">
            margin: the 20px gray gap (transparent)
          </span>
        </div>
      </div>
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
    codeHighlightLines: [[5, 13], 18, 21],
  },
  {
    id: "box-model-demo",
    title: "Live box model",
    kind: "demo",
    bullets: [
      "`border-box` counts padding and border inside the 200px, so the box stays 200px wide.",
      "Gray parent, margin gap, red ring, light-blue padding, green content — plus the two yellow boxes",
      "`border-box` stays 200×180. `content-box` measures 260×240. The DevTools figure is only an illustration",
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
    title: "Four corner radii",
    kind: "content",
    bullets: [
      "Wrapper id `wd-css-corners`. Four paragraphs, four radius classes",
      "A thin blue border and fat padding make the curve visible",
    ],
    code: `export default function Corners() {
  return (
    <div id="wd-css-corners">
      <h2>Rounded corners</h2>
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
    title: "Live rounded corners",
    kind: "demo",
    bullets: [
      "`border-radius` rounds corners by setting all four, listing four values, or targeting one.",
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
