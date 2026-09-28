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
      "Following **inline** content wraps beside it — the classic image + paragraph",
      "Lab 2 floats the Starship photo. The same classes also work on colored boxes",
      "Flex (next deck) is the modern row/column tool. Still learn float — Lab 2 grades it",
    ],
  },
  {
    id: "classes",
    title: "float left, right, then clear",
    kind: "content",
    bullets: [
      "A length in **rem** is relative to the root font size, usually 16px, so 2rem = 32px.",
      "Floated boxes leave the flow. The next block can slide up beside them",
      "`img.wd-float-*` caps the photo at 35% so the paragraph has room to wrap",
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
img.wd-float-left,
img.wd-float-right {
  width: auto;
  max-width: 35%;
}
img.wd-float-left {
  margin: 0 1rem 0.5rem 0;
}
img.wd-float-right {
  margin: 0 0 0.5rem 1rem;
}
.wd-float-done {
  clear: both;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeHighlightLines: [[9, 19]],
  },
  {
    id: "float-tsx",
    title: "Float.tsx",
    kind: "content",
    bullets: [
      "`float` pulls an element to one edge so content wraps around it, and `clear: both` stops that wrap.",
      "The book defines `STARSHIP` and `LOREM`, then floats the photo right and left",
      "The second block floats three colored boxes and one more image, then `wd-float-done`",
    ],
    code: `import "./index.css";

const STARSHIP =
  "https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg";
const LOREM =
  "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius hic reprehenderit doloremque adipisci iste deserunt. Inventore, hic. Esse nihil unde aut, dignissimos eos consequatur veniam distinctio?";

export default function Float() {
  return (
    <div id="wd-float-divs">
      <h2>Float</h2>
      <div>
        <img className="wd-float-right" src={STARSHIP} alt="Starship" />
        {LOREM} {LOREM}
        <img className="wd-float-left" src={STARSHIP} alt="Starship" />
        {LOREM} {LOREM}
        <img className="wd-float-right" src={STARSHIP} alt="Starship" />
        {LOREM} {LOREM}
        <img className="wd-float-left" src={STARSHIP} alt="Starship" />
        {LOREM} {LOREM}
        <div className="wd-float-done" />
      </div>
      <div>
        <div className="wd-float-left wd-dimension-portrait wd-bg-color-yellow">
          Yellow
        </div>
        <div className="wd-float-left wd-dimension-portrait wd-bg-color-blue wd-fg-color-white">
          Blue
        </div>
        <div className="wd-float-left wd-dimension-portrait wd-bg-color-red">
          Red
        </div>
        <img className="wd-float-right" src={STARSHIP} alt="Starship" />
        <div className="wd-float-done" />
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Float.tsx",
    codeHighlightLines: [[3, 6], [14, 22], [24, 35]],
  },
  {
    id: "float-demo",
    title: "Live Float.tsx",
    kind: "demo",
    bullets: [
      "Text wraps the Starship photo on the right, then on the left",
      "The empty `wd-float-done` div ends the wrap",
    ],
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
    title: "GridLayout.tsx",
    kind: "content",
    bullets: [
      "`float: left` plus percentage widths puts columns side by side, and each row needs `clear: both`.",
      "Row 1: `wd-grid-col-half-page` twice",
      "Row 2: 20% / 60% / 20% — sidebar, main, sidebar",
    ],
    code: `export default function GridLayout() {
  return (
    <div id="wd-css-grid-layout">
      <h2>Grid layout</h2>
      <div className="wd-grid-row">
        <div className="wd-grid-col-half-page wd-bg-color-yellow">
          <h3>Left half</h3>
        </div>
        <div className="wd-grid-col-half-page wd-bg-color-blue wd-fg-color-white">
          <h3>Right half</h3>
        </div>
      </div>
      <div className="wd-grid-row">
        <div className="wd-grid-col-left-sidebar wd-bg-color-yellow">
          <h3>Side bar</h3>
        </div>
        <div className="wd-grid-col-main-content wd-bg-color-blue wd-fg-color-white">
          <h3>Main content</h3>
        </div>
        <div className="wd-grid-col-right-sidebar wd-bg-color-green wd-fg-color-white">
          <h3>Side bar</h3>
        </div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/GridLayout.tsx",
    codeHighlightLines: [[13, 23]],
  },
  {
    id: "grid-demo",
    title: "Live GridLayout.tsx",
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
      "§2.1.19: `display: flex` — rows without floats, clearing, or percentage math",
    ],
  },
];
