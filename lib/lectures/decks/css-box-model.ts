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
      "Default `content-box`: `width: 200px` sizes **only** the content. Padding and border add extra pixels",
      "`border-box`: 200px **includes** padding and border. The painted box stays 200px",
      "The layer classes paint margin, border, padding, and content as nested boxes",
    ],
    code: `.wd-box-model-margin {
  background-color: #f8d7da;
  padding: 20px;
  margin: 10px 0;
}
.wd-box-model-border {
  background-color: #fff3cd;
  border: 10px solid #c41e3a;
  padding: 20px;
}
.wd-box-model-padding {
  background-color: #cfe2ff;
  padding: 20px;
}
.wd-box-model-content {
  background-color: #d1e7dd;
  padding: 10px;
}
.wd-box-sizing-demo {
  background-color: lightgray;
  padding: 10px;
}
.wd-box-sizing-content,
.wd-box-sizing-border {
  width: 200px;
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
    codeHighlightLines: [[1, 22], 29],
  },
  {
    id: "box-model-tsx",
    title: "BoxModel.tsx",
    kind: "content",
    bullets: [
      "Nested labels walk outward: content → padding → border → margin",
      "Both yellow boxes declare 200px + 20px padding + 10px border",
      "`content-box` paints wider. `border-box` stays 200px",
    ],
    code: `export default function BoxModel() {
  return (
    <div id="wd-css-box-model">
      <h2>Box model</h2>
      <div className="wd-box-model-margin">
        margin
        <div className="wd-box-model-border">
          border
          <div className="wd-box-model-padding">
            padding
            <div className="wd-box-model-content">content</div>
          </div>
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
    codeHighlightLines: [[3, 16], 23],
  },
  {
    id: "box-model-demo",
    title: "Live BoxModel.tsx",
    kind: "demo",
    bullets: [
      "Pink margin, gold border, blue padding, green content",
      "The second yellow box is shorter because `border-box` counts the chrome",
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
