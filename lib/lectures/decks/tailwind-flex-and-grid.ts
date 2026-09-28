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
      "§2.3.6: `grid grid-cols-4 gap-4`, then `col-span-*` on a 12-column page",
      "A flex-class map at the end is a reminder of §2.1.19 — not a book step",
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
    title: "TailwindFilters.tsx",
    kind: "content",
    bullets: [
      "Filter utilities apply visual effects like blur straight onto an image or element.",
      "Four copies of the same image, blur growing from none to `2xl`",
      "The book’s PDF used Angel Falls; `reactjs.jpg` is enough to see the effect",
    ],
    code: `export default function TailwindFilters() {
  // reactjs.jpg is used here so the lab runs out of the box.
  const src = "/images/reactjs.jpg";
  return (
    <div>
      <h2>Blurs</h2>
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
    id: "grid-four",
    title: "grid-cols-4 wraps children",
    kind: "content",
    bullets: [
      "`grid grid-cols-4 gap-4` — four columns, consistent gutters",
      "Nine cells wrap onto a third row. No manual row break",
      "Book step 1 is the wrapper, the Tailwind Grids `h2`, and this grid. Paste the 3 Columns Grid next, then the Grid system `h2`",
    ],
    code: `export default function TailwindGrids() {
  return (
    <div>
      <h2>Tailwind Grids</h2>
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
        <h2>Grid system</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-red-500 text-white">
            <h3>Left half</h3>
          </div>
          <div className="bg-blue-500 text-white">
            <h3>Right half</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-4 bg-yellow-500">
            <h3>One third</h3>
          </div>
          <div className="col-span-8 bg-green-500 text-white">
            <h3>Two thirds</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-2 bg-black text-white">
            <h3>Sidebar</h3>
          </div>
          <div className="col-span-8 bg-gray-500 text-white">
            <h3>Main content</h3>
          </div>
          <div className="col-span-2 bg-blue-400">
            <h3>Sidebar</h3>
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
      "The listing is the whole `TailwindGrids.tsx` the next figure renders",
      "A 3-column grid uses `col-span-2` on two of the cells",
      "Twelve divides by 2, 3, 4, and 6 — `col-span-4` + `col-span-8`, then `2 / 8 / 2`",
    ],
    code: `export default function TailwindGrids() {
  return (
    <div>
      <h2>Tailwind Grids</h2>
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
        <h2>Grid system</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-red-500 text-white">
            <h3>Left half</h3>
          </div>
          <div className="bg-blue-500 text-white">
            <h3>Right half</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-4 bg-yellow-500">
            <h3>One third</h3>
          </div>
          <div className="col-span-8 bg-green-500 text-white">
            <h3>Two thirds</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-2 bg-black text-white">
            <h3>Sidebar</h3>
          </div>
          <div className="col-span-8 bg-gray-500 text-white">
            <h3>Main content</h3>
          </div>
          <div className="col-span-2 bg-blue-400">
            <h3>Sidebar</h3>
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
    id: "flex-map",
    title: "Flex.tsx → Tailwind classes",
    kind: "content",
    bullets: [
      "Not a book step — the utility spelling of the Lab 2 flex row",
      "`w-[110px] shrink-0` pins column 1. `grow` stretches column 3",
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
    id: "next-up",
    title: "Next: style Kambaz",
    kind: "title",
    bullets: [
      "You can blur an image and span grid tracks with utilities",
      "§2.4: wire Tailwind into the Kambaz shell — theme + utilities, no Preflight",
    ],
  },
];
