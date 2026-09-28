import type { LectureSlide } from "../types";

export const CSS_COLORS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Colors",
      "Chapter 2 §2.1.7–2.1.8 · `ForegroundColors.tsx` and `BackgroundColors.tsx`",
    ],
  },
  {
    id: "purpose",
    title: "Foreground vs background",
    kind: "content",
    bullets: [
      "`color` paints the **foreground** — the text",
      "`background-color` fills the area **behind** the text",
      "From here on, each Lab 2 demo is its own file imported into `page.tsx`",
      "Stack classes on one `className` to compose a look",
    ],
  },
  {
    id: "notations",
    title: "Named, hex, and rgb colors",
    kind: "content",
    bullets: [
      "Named: `blue`, `red`, `green`, `white`",
      "Hex: `#7070ff` — two digits each for red, green, blue intensity",
      "Functional: `rgb(12, 34, 56)`",
      "Lab 2 uses names and hex. Pick whichever is easier to read",
    ],
    code: `.wd-fg-color-black { color: black; }
.wd-fg-color-white { color: white; }
.wd-fg-color-blue { color: #7070ff; }
.wd-fg-color-red { color: #ff7070; }
.wd-fg-color-green { color: green; }`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "fg-tsx",
    title: "ForegroundColors.tsx",
    kind: "content",
    bullets: [
      "Wrapper id: `wd-css-colors`",
      "The heading is blue. The paragraph is red. A nested `span` is green",
      "Three classes, three elements — the span overrides inherited `color`",
    ],
    code: `export default function ForegroundColors() {
  return (
    <div id="wd-css-colors">
      <h2>Colors</h2>
      <h3 className="wd-fg-color-blue">Foreground color</h3>
      <p className="wd-fg-color-red">
        The text in this paragraph is red but{" "}
        <span className="wd-fg-color-green">this text is green</span>
      </p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/ForegroundColors.tsx",
  },
  {
    id: "fg-demo",
    title: "Live foreground colors",
    kind: "demo",
    bullets: [
      "`color` inherits — the green span must set its own class to win",
      "White text on a white slide is invisible. Pair fg with a bg when contrast dies",
    ],
    embed: "css-foreground",
  },
  {
    id: "wire",
    title: "Import each demo into page.tsx",
    kind: "content",
    bullets: [
      "`import \"./index.css\"` once, then one component import and one tag per exercise",
      "Repeat the same two lines for BackgroundColors, Borders, and every later file",
      "Edit the Lab 2 page. Do not replace the style, id, and class sections already there",
    ],
    code: `import "./index.css";
import ForegroundColors from "./ForegroundColors";

export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2 - Cascading Style Sheets</h2>
      {/* ...earlier exercises... */}
      <ForegroundColors />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
    codeAddedLines: [2, 9],
  },
  {
    id: "bg-css",
    title: "Background color classes",
    kind: "content",
    bullets: [
      "Same pattern as foreground — one reusable class per fill",
      "Yellow is `#ffff07` so it stays loud next to the blue and red swatches",
    ],
    code: `.wd-bg-color-yellow { background-color: #ffff07; }
.wd-bg-color-blue { background-color: #7070ff; }
.wd-bg-color-red { background-color: #ff7070; }
.wd-bg-color-green { background-color: green; }
.wd-bg-color-gray { background-color: lightgray; }`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "bg-tsx",
    title: "BackgroundColors.tsx",
    kind: "content",
    bullets: [
      "One element, two classes: `wd-bg-color-blue wd-fg-color-white`",
      "`className` is a space-separated list. Every matching rule applies",
      "The nested span swaps both background and foreground again",
    ],
    code: `export default function BackgroundColors() {
  return (
    <div id="wd-css-background-colors">
      <h2 className="wd-bg-color-blue wd-fg-color-white">Background color</h2>
      <p className="wd-bg-color-red wd-fg-color-black">
        This background of this paragraph is red but{" "}
        <span className="wd-bg-color-green wd-fg-color-white">
          the background of this text is green and the foreground white
        </span>
      </p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/BackgroundColors.tsx",
  },
  {
    id: "bg-demo",
    title: "Live background colors",
    kind: "demo",
    bullets: [
      "Background does **not** inherit the way `color` does — each box paints its own fill",
      "Readable pairs: blue + white, red + black, green + white, yellow + black",
    ],
    embed: "css-background",
  },
  {
    id: "next-up",
    title: "Next: the box model",
    kind: "title",
    bullets: [
      "You can color text and fills with small reusable classes",
      "Deck 3: border, padding, margin, `box-sizing`, and rounded corners",
    ],
  },
];
