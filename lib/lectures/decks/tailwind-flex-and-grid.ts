import type { LectureSlide } from "../types";

export const TAILWIND_FLEX_AND_GRID_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Filters and Grid",
      "§2.3.5–2.3.6 · blur utilities, then CSS Grid",
    ],
  },
  {
    id: "purpose",
    title: "Filters, then a real grid",
    kind: "content",
    bullets: [
      "§2.3.5: `blur-*`, `grayscale`, `brightness-*`, `contrast-*` on the element",
      "**CSS Grid** places children into columns. `grid` turns the grid on and `grid-cols-*` sets how many columns",
      "`gap` is the gutter, the space between those cells",
      "`col-span-*` stretches one cell across that many columns",
      "A **12-column grid** divides the page into twelve columns",
      "The last slides write that flex row with Tailwind",
    ],
  },
  {
    id: "filters-purpose",
    title: "Filters are utilities too",
    kind: "content",
    bullets: [
      "Apply the effect on the element — usually an image",
      "Swap one class to change the strength. No extra CSS file",
    ],
  },
  {
    id: "filters-tsx",
    title: "Blur utilities",
    kind: "content",
    bullets: [
      "Filter utilities apply visual effects like blur straight onto an image or element.",
      "Four copies of the same image, blur growing from none to `2xl`",
    ],
    code: `export default function TailwindFilters() {
  // reactjs.jpg is used here so the lab runs out of the box.
  const src = "/images/reactjs.jpg";
  return (
    <div>
      <h2 className="text-2xl font-bold">Blurs</h2>
      <div className="flex">
        <img className="blur-none w-1/4" src={src} alt="blur none" />
        <img className="blur-sm w-1/4" src={src} alt="blur sm" />
        <img className="blur-lg w-1/4" src={src} alt="blur lg" />
        <img className="blur-2xl w-1/4" src={src} alt="blur 2xl" />
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindFilters.tsx",
  },
  {
    id: "filters-demo",
    title: "Live blur row",
    kind: "demo",
    bullets: [
      "Each blur level is one utility class swapped for another.",
      "`w-1/4` plus `flex` puts four images in one row",
      "On your own: a second row with `grayscale` or `brightness-*`",
    ],
    embed: "tw-filters",
  },
  {
    id: "filters-page",
    title: "Add filters to the page",
    kind: "content",
    bullets: [
      "Add `TailwindFilters` to the lab page. Put this import after `TailwindResponsiveDesign`, and render the component after that one",
    ],
    code: `import TailwindFilters from "./TailwindFilters";

      <TailwindResponsiveDesign />
      <hr className="my-8" />
      <TailwindFilters />`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/page.tsx",
    codeAddedLines: [1, 4, 5],
  },
  {
    id: "grid-four",
    title: "grid-cols-4 wraps children",
    kind: "content",
    bullets: [
      "`grid grid-cols-4 gap-4` — four columns, consistent gutters",
      "Nine cells wrap onto a third row. No manual row break",
      "Start `TailwindGrids.tsx` with the outer wrapper, the Tailwind Grids `h2`, and this four-column grid",
    ],
    code: `export default function TailwindGrids() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Tailwind Grids</h2>
      <div>
        <h3 className="mt-6 text-3xl font-bold">4 Columns Grid</h3>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="text-center bg-blue-300 p-3">
              {String(i + 1).padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindGrids.tsx",
  },
  {
    id: "grid-three",
    title: "Paste the 3 Columns Grid",
    kind: "content",
    bullets: [
      "`col-span` lets one cell stretch across several grid tracks without changing the column count.",
      "Paste the TSX below after the 4 Columns Grid",
      "`col-span-2` makes two of the cells twice as wide",
    ],
    code: `      <div>
        <h3 className="mt-6 text-3xl font-bold">3 Columns Grid</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-blue-300 p-3">01</div>
          <div className="text-center bg-blue-300 p-3">02</div>
          <div className="text-center bg-blue-300 p-3">03</div>
          <div className="col-span-2 text-center bg-blue-300 p-3">04</div>
          <div className="text-center bg-blue-300 p-3">05</div>
          <div className="text-center bg-blue-300 p-3">06</div>
          <div className="col-span-2 text-center bg-blue-300 p-3">07</div>
        </div>
      </div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindGrids.tsx",
  },
  {
    id: "grid-system",
    title: "Paste the grid system",
    kind: "content",
    bullets: [
      "A twelve-column grid is the sweet spot because twelve divides evenly by two, three, four, and six.",
      "Paste the TSX below after the 3 Columns Grid",
      "Twelve columns: `col-span-4` + `col-span-8`, then `2 / 8 / 2`",
    ],
    code: `      <div id="wd-tailwind-grid-system" className="mt-6">
        <h2 className="text-2xl font-bold">Grid system</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-red-500 text-white">
            <h3 className="text-lg font-bold">Left half</h3>
          </div>
          <div className="bg-blue-500 text-white">
            <h3 className="text-lg font-bold">Right half</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-4 bg-yellow-500">
            <h3 className="text-lg font-bold">One third</h3>
          </div>
          <div className="col-span-8 bg-green-500 text-white">
            <h3 className="text-lg font-bold">Two thirds</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-2 bg-black text-white">
            <h3 className="text-lg font-bold">Sidebar</h3>
          </div>
          <div className="col-span-8 bg-gray-500 text-white">
            <h3 className="text-lg font-bold">Main content</h3>
          </div>
          <div className="col-span-2 bg-blue-400">
            <h3 className="text-lg font-bold">Sidebar</h3>
          </div>
        </div>
      </div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindGrids.tsx",
  },
  {
    id: "col-span",
    title: "col-span on a 12-column grid",
    kind: "content",
    bullets: [
      "This is the finished `TailwindGrids.tsx`: four columns, three columns, then the 12-column system",
      "A 3-column grid uses `col-span-2` on two of the cells",
      "Twelve divides by 2, 3, 4, and 6 — `col-span-4` + `col-span-8`, then `2 / 8 / 2`",
    ],
    code: `export default function TailwindGrids() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Tailwind Grids</h2>
      <div>
        <h3 className="mt-6 text-3xl font-bold">4 Columns Grid</h3>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="text-center bg-blue-300 p-3">
              {String(i + 1).padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mt-6 text-3xl font-bold">3 Columns Grid</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-blue-300 p-3">01</div>
          <div className="text-center bg-blue-300 p-3">02</div>
          <div className="text-center bg-blue-300 p-3">03</div>
          <div className="col-span-2 text-center bg-blue-300 p-3">04</div>
          <div className="text-center bg-blue-300 p-3">05</div>
          <div className="text-center bg-blue-300 p-3">06</div>
          <div className="col-span-2 text-center bg-blue-300 p-3">07</div>
        </div>
      </div>
      <div id="wd-tailwind-grid-system" className="mt-6">
        <h2 className="text-2xl font-bold">Grid system</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-red-500 text-white">
            <h3 className="text-lg font-bold">Left half</h3>
          </div>
          <div className="bg-blue-500 text-white">
            <h3 className="text-lg font-bold">Right half</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-4 bg-yellow-500">
            <h3 className="text-lg font-bold">One third</h3>
          </div>
          <div className="col-span-8 bg-green-500 text-white">
            <h3 className="text-lg font-bold">Two thirds</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-2 bg-black text-white">
            <h3 className="text-lg font-bold">Sidebar</h3>
          </div>
          <div className="col-span-8 bg-gray-500 text-white">
            <h3 className="text-lg font-bold">Main content</h3>
          </div>
          <div className="col-span-2 bg-blue-400">
            <h3 className="text-lg font-bold">Sidebar</h3>
          </div>
        </div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindGrids.tsx",
  },
  {
    id: "grid-demo",
    title: "Live Tailwind grids",
    kind: "demo",
    bullets: [
      "Four-column wrap, a 3-column grid with `col-span-2`, then the 12-column splits",
      "§2.1’s float “grid” was percentages. This is CSS Grid",
    ],
    embed: "tw-grids",
  },
  {
    id: "grids-page",
    title: "Add grids to the page",
    kind: "content",
    bullets: [
      "Add `TailwindGrids` to the lab page. Put this import after `TailwindFilters`, and render the component after that one",
    ],
    code: `import TailwindGrids from "./TailwindGrids";

      <TailwindFilters />
      <hr className="my-8" />
      <TailwindGrids />`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/page.tsx",
    codeAddedLines: [1, 4, 5],
  },
  {
    id: "flex-map",
    title: "Flex.tsx → Tailwind classes",
    kind: "content",
    bullets: [
      "The Lab 2 flex row, written with Tailwind utilities",
      "`w-[110px]` sets a width of 110px. `shrink-0` stops that column from shrinking. `grow` gives column 3 the leftover space",
    ],
    code: `<div className="flex flex-row">
  <div className="w-[110px] shrink-0 bg-yellow-300 p-2.5">Column 1</div>
  <div className="bg-blue-400 p-2.5 text-white">Column 2</div>
  <div className="grow bg-red-400 p-2.5 text-white">Column 3</div>
</div>`,
    codeLanguage: "tsx",
    codeHighlightLines: [1, 2, 4],
  },
  {
    id: "flex-demo",
    title: "Live Tailwind flex row",
    kind: "demo",
    bullets: [
      "Column 1 stays ~110px. Column 3 eats the leftover width",
      "Kambaz Home later: `flex gap-4` plus `min-w-0 flex-1` on the main column",
    ],
    embed: "tw-flex",
  },
  {
    id: "lab2-final-imports",
    title: "Finished Lab 2 page: imports",
    kind: "content",
    bullets: [
      "Here is the finished `app/labs/lab2/page.tsx`, with every §2.1 and §2.2 sample imported in order",
      "Compare it with yours: a missing import means a missing sample on `/labs/lab2`",
    ],
    code: `import "./index.css";
import ForegroundColors from "./ForegroundColors";
import BackgroundColors from "./BackgroundColors";
import Borders from "./Borders";
import Padding from "./Padding";
import Margins from "./Margins";
import BoxModel from "./BoxModel";
import Corners from "./Corners";
import Dimensions from "./Dimensions";
import Display from "./Display";
import Positions from "./Positions";
import Zindex from "./Zindex";
import Float from "./Float";
import GridLayout from "./GridLayout";
import Flex from "./Flex";
import MediaQueriesDemo from "./MediaQueriesDemo";
import ReactIconsSampler from "./ReactIconsSampler";`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
  },
  {
    id: "lab2-final-intro",
    title: "Finished Lab 2 page: link and style",
    kind: "content",
    bullets: [
      "The link to the Tailwind lab from §2.3 sits under the heading",
      "The Tailwind samples themselves stay in `app/labs/lab2/tailwind/page.tsx`",
    ],
    code: `export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2 - Cascading Style Sheets</h2>
      <p>
        <a href="/labs/lab2/tailwind">Open Tailwind CSS lab →</a>
      </p>

      <h3>Styling with the STYLE attribute</h3>
      <p>
        Style attribute allows configuring look and feel right on the element.
        Although it&apos;s very convenient it is considered bad practice and you
        should avoid using the style attribute
      </p>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
  },
  {
    id: "lab2-final-selectors",
    title: "Finished Lab 2 page: id and class",
    kind: "content",
    bullets: [
      "The id selector section from §2.1.3, then the class selector section from §2.1.4",
    ],
    code: `      <div id="wd-css-id-selectors">
        <h3>ID selectors</h3>
        <p id="wd-id-selector-1">
          Instead of changing the look and feel of all the elements of the same
          name, e.g., P, we can refer to a specific element by its ID
        </p>
        <p id="wd-id-selector-2">
          Here&apos;s another paragraph using a different ID and a different look
          and feel
        </p>
      </div>

      <div id="wd-css-class-selectors">
        <h3>Class selectors</h3>
        <p className="wd-class-selector">
          Instead of using IDs to refer to elements, you can use an element&apos;s
          CLASS attribute
        </p>
        <h4 className="wd-class-selector">
          This heading has same style as paragraph above
        </h4>
      </div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
  },
  {
    id: "lab2-final-structure",
    title: "Finished Lab 2 page: document structure",
    kind: "content",
    bullets: [
      "The document structure section from §2.1.5",
    ],
    code: `      <div id="wd-css-document-structure">
        <div className="wd-selector-1">
          <h3>Document structure selectors</h3>
          <div className="wd-selector-2">
            Selectors can be combined to refer elements in particular places in
            the document
            <p className="wd-selector-3">
              This paragraph&apos;s red background is referenced as
              <br />
              .wd-selector-1 .wd-selector-3
              <br />
              meaning the descendant of some ancestor.
              <br />
              <span className="wd-selector-4">
                Whereas this span is a direct child of its parent
              </span>
              <br />
              You can combine these relationships to create specific styles
              depending on the document structure
            </p>
          </div>
        </div>
      </div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
  },
  {
    id: "lab2-final-samples",
    title: "Finished Lab 2 page: every sample",
    kind: "content",
    bullets: [
      "One tag per sample component, in the same order as the imports",
      "Any extra practice you added to Lab 2 goes on top of this",
    ],
    code: `      <ForegroundColors />
      <BackgroundColors />
      <Borders />
      <Padding />
      <Margins />
      <BoxModel />
      <Corners />
      <Dimensions />
      <Display />
      <Positions />
      <Zindex />
      <Float />
      <GridLayout />
      <Flex />
      <MediaQueriesDemo />
      <ReactIconsSampler />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
  },
  {
    id: "next-up",
    title: "Next: style Kambaz",
    kind: "title",
    bullets: [
      "You can blur an image, span grid tracks with utilities, and check your finished Lab 2 page",
      "§2.4: wire Tailwind into the Kambaz shell — theme + utilities, no Preflight",
    ],
  },
];
