import type { LectureSlide } from "../types";

export const TAILWIND_RESPONSIVE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Tailwind Responsive",
      "§2.3.4 · five small ideas, then the card",
    ],
  },
  {
    id: "intro",
    title: "Responsive Design",
    kind: "content",
    bullets: [
      "A **responsive** page changes as the viewport — the browser window — gets wider",
      "As in §2.1.20, a **breakpoint** is a viewport width at which styles change. Tailwind names five of those widths",
      "Five small components each teach one idea. The card at the end combines them",
    ],
  },
  {
    id: "prefixes",
    title: "Five min-width prefixes",
    kind: "content",
    bullets: [
      "Tailwind is **mobile-first**: no prefix means every width, and a prefix applies from that breakpoint up",
      "§2.1.17: 1rem is usually 16px, so 48rem is 768px",
      "`sm:` 40rem (640px)",
      "`md:` 48rem (768px)",
      "`lg:` 64rem (1024px)",
      "`xl:` 80rem (1280px)",
      "`2xl:` 96rem (1536px)",
    ],
  },
  {
    id: "prefix-ruler",
    title: "Where each prefix starts",
    kind: "content",
    diagram: "tailwind-breakpoints",
  },
  {
    id: "breakpoint-tsx",
    title: "One breakpoint",
    kind: "content",
    bullets: [
      "This box is `bg-red-500` at every width. `md:bg-green-500` replaces the red from `md` up",
    ],
    code: `export default function TailwindResponsiveBreakpoint() {
  return (
    <div
      id="wd-tailwind-responsive-breakpoint"
      className="bg-red-500 md:bg-green-500 p-4 text-white"
    >
      Red below md, green at md and up.
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindResponsiveBreakpoint.tsx",
  },
  {
    id: "breakpoint-demo",
    title: "Red, then green",
    kind: "demo",
    bullets: [
      "Below `md` the box is red. At `md` and wider it is green",
    ],
    embed: "tw-responsive-breakpoint",
  },
  {
    id: "show-hide-tsx",
    title: "Show and hide by width",
    kind: "content",
    bullets: [
      "`hidden` sets `display: none` and `block` shows the element. `block md:hidden` is the small-screen line until `md`; `hidden md:block` is the large-screen line from `md` up",
    ],
    code: `export default function TailwindResponsiveShowHide() {
  return (
    <div id="wd-tailwind-responsive-show-hide">
      <p className="block md:hidden bg-red-200 p-2">small screen</p>
      <p className="hidden md:block bg-green-200 p-2">large screen</p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindResponsiveShowHide.tsx",
  },
  {
    id: "show-hide-demo",
    title: "Small line, then large",
    kind: "demo",
    bullets: [
      "Below `md` the red line shows. At `md` and up the green line shows",
    ],
    embed: "tw-responsive-show-hide",
  },
  {
    id: "flex-tsx",
    title: "Stack, then side by side",
    kind: "content",
    bullets: [
      "CSS flex lines boxes up along one direction. `flex-direction: column` stacks them, and `flex-direction: row` places them side by side. Tailwind writes those as `flex-col` and `flex-row`. `flex flex-col` stacks the three boxes at every width. `md:flex-row` lays them side by side from `md` up. `gap-4` is the space between the boxes. It is unprefixed, so that space stays in both layouts",
    ],
    code: `export default function TailwindResponsiveFlex() {
  return (
    <div
      id="wd-tailwind-responsive-flex"
      className="flex flex-col md:flex-row gap-4"
    >
      <div className="bg-red-500 p-4 text-white">One</div>
      <div className="bg-green-500 p-4 text-white">Two</div>
      <div className="bg-blue-500 p-4 text-white">Three</div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindResponsiveFlex.tsx",
  },
  {
    id: "flex-demo",
    title: "Live stacked row",
    kind: "demo",
    bullets: [
      "Below `md` the boxes stack. At `md` they sit in a row",
    ],
    embed: "tw-responsive-flex",
  },
  {
    id: "widths",
    title: "Grid uses the prefixes",
    kind: "content",
    bullets: [
      "**CSS Grid** places children into columns, with a gap between the cells. `grid` turns the grid on, `grid-cols-*` sets how many columns, and `gap-4` sets that gap. §2.3.6 goes further with grid utilities",
      "Column count uses those same prefixes. A later prefix overrides an earlier one from its width up",
    ],
  },
  {
    id: "grid-tsx",
    title: "Grid columns by breakpoint",
    kind: "content",
    bullets: [
      "One column below `sm`, two from `sm` until `lg`, and four from `lg` up",
    ],
    code: `export default function TailwindResponsiveGrid() {
  return (
    <div
      id="wd-tailwind-responsive-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div className="text-center bg-blue-300 p-3">01</div>
      <div className="text-center bg-blue-300 p-3">02</div>
      <div className="text-center bg-blue-300 p-3">03</div>
      <div className="text-center bg-blue-300 p-3">04</div>
      <div className="text-center bg-blue-300 p-3">05</div>
      <div className="text-center bg-blue-300 p-3">06</div>
      <div className="text-center bg-blue-300 p-3">07</div>
      <div className="text-center bg-blue-300 p-3">08</div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindResponsiveGrid.tsx",
  },
  {
    id: "grid-demo",
    title: "Live grid columns",
    kind: "demo",
    bullets: [
      "Below `sm` there is one column. At `lg` there are four",
    ],
    embed: "tw-responsive-grid",
  },
  {
    id: "spacing-tsx",
    title: "Spacing and text size",
    kind: "content",
    bullets: [
      "`p-2` and `text-base` apply at every width. `md:p-8` and `md:text-2xl` grow the padding and the type from `md` up",
    ],
    code: `export default function TailwindResponsiveSpacingText() {
  return (
    <div id="wd-tailwind-responsive-spacing-text">
      <h2 className="bg-yellow-200 p-2 text-base md:p-8 md:text-2xl">
        Spacing and text size
      </h2>
      <p className="bg-yellow-100 p-2 text-base md:p-8 md:text-2xl">
        Padding and the font size grow at md.
      </p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindResponsiveSpacingText.tsx",
  },
  {
    id: "spacing-demo",
    title: "Live spacing and type",
    kind: "demo",
    bullets: [
      "Below `md` the type is compact. At `md` the padding and the type grow",
    ],
    embed: "tw-responsive-spacing",
  },
  {
    id: "tsx",
    title: "A responsive card",
    kind: "content",
    bullets: [
      "`h-56` sets a height of 14rem. `max-w-md` caps the width at 28rem. `hover:underline` underlines the link only while the pointer is over it",
      "`md:max-w-2xl` widens the card. `md:flex` turns the row on without a `flex-col` first. On the image, `md:w-48` sets a fixed width of 12rem, `md:shrink-0` stops flex from shrinking that width, `md:h-full` fills the card's height, and `md:min-h-56` keeps a minimum height of 14rem. `object-cover` crops the picture to fill that box",
    ],
  },
  {
    id: "card-frame",
    title: "The card frame (part 1 of 3)",
    kind: "content",
    code: `export default function TailwindResponsiveDesign() {
  return (
    <div className="font-sans">
      <h2 className="text-3xl font-bold mb-4">Responsive Design</h2>
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
        <div className="md:flex">`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindResponsiveDesign.tsx",
    codeHighlightLines: [5, 6],
  },
  {
    id: "card-image",
    title: "The image column (part 2 of 3)",
    kind: "content",
    code: `          <div className="relative md:w-48 md:shrink-0">
            <img
              className="h-56 w-full object-cover md:h-full md:min-h-56 md:w-48"
              src="/images/reactjs.jpg"
              alt="React JS"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <svg
                viewBox="0 0 24 24"
                className="h-24 w-24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="2.05" fill="currentColor" />
                <g fill="none" stroke="currentColor" strokeWidth="1">
                  <ellipse cx="12" cy="12" rx="10" ry="4.2" />
                  <ellipse
                    cx="12"
                    cy="12"
                    rx="10"
                    ry="4.2"
                    transform="rotate(60 12 12)"
                  />
                  <ellipse
                    cx="12"
                    cy="12"
                    rx="10"
                    ry="4.2"
                    transform="rotate(120 12 12)"
                  />
                </g>
              </svg>
              <div className="mt-2 text-2xl font-semibold">React JS</div>
            </div>
          </div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindResponsiveDesign.tsx",
    codeHighlightLines: [1, 3],
  },
  {
    id: "card-text",
    title: "The text column (part 3 of 3)",
    kind: "content",
    code: `          <div className="min-w-0 p-8">
            <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase">
              Professional Courses
            </div>
            <a
              href="#"
              className="mt-1 block text-lg leading-tight font-medium text-black no-underline hover:underline"
            >
              Rocket Propulsion Fundamentals
            </a>
            <p className="mt-2 text-gray-500">
              An in-depth study of the fundamentals of rocket propulsion...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindResponsiveDesign.tsx",
    codeHighlightLines: [7],
  },
  {
    id: "demo",
    title: "Image beside the text",
    kind: "demo",
    bullets: [
      "Below `md` the image sits on the text. At `md`, `md:flex` puts it beside the text",
    ],
    embed: "tw-responsive",
  },
  {
    id: "page",
    title: "Add each demo to the page",
    kind: "content",
    bullets: [
      "Import each responsive component into the lab page and render it there. The five small demos come first, then `TailwindResponsiveDesign`. Spacing, typography, and backgrounds stay above the responsive demos",
    ],
    code: `import "./index.css";
import TailwindSpacing from "./TailwindSpacing";
import TailwindTypography from "./TailwindTypography";
import TailwindBackgroundColors from "./TailwindBackgroundColors";
import TailwindResponsiveBreakpoint from "./TailwindResponsiveBreakpoint";
import TailwindResponsiveShowHide from "./TailwindResponsiveShowHide";
import TailwindResponsiveFlex from "./TailwindResponsiveFlex";
import TailwindResponsiveGrid from "./TailwindResponsiveGrid";
import TailwindResponsiveSpacingText from "./TailwindResponsiveSpacingText";
import TailwindResponsiveDesign from "./TailwindResponsiveDesign";

export default function TailwindLab() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Tailwind CSS</h1>
      <TailwindSpacing />
      <hr className="my-8" />
      <TailwindTypography />
      <hr className="my-8" />
      <TailwindBackgroundColors />
      <hr className="my-8" />
      <TailwindResponsiveBreakpoint />
      <hr className="my-8" />
      <TailwindResponsiveShowHide />
      <hr className="my-8" />
      <TailwindResponsiveFlex />
      <hr className="my-8" />
      <TailwindResponsiveGrid />
      <hr className="my-8" />
      <TailwindResponsiveSpacingText />
      <hr className="my-8" />
      <TailwindResponsiveDesign />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/page.tsx",
    codeAddedLines: [[5, 10], [21, 32]],
  },
  {
    id: "vs-media",
    title: "Prefixes compile to @media",
    kind: "content",
    bullets: [
      "A **media query** applies CSS only when the viewport matches a width",
      "`md:` is that query with a name: `@media (min-width: 48rem)`",
      "Use a raw `@media` file when the condition is not one of these prefixes",
    ],
  },
  {
    id: "next-up",
    title: "Next: filters",
    kind: "title",
    bullets: [
      "You can change color, visibility, direction, columns, spacing, and type with a prefix",
      "§2.3.5: `blur-*` on an image, then §2.3.6 grid",
    ],
  },
];
