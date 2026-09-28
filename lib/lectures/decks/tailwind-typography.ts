import type { LectureSlide } from "../types";

export const TAILWIND_TYPOGRAPHY_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Tailwind Typography",
      "§2.3.2 · `TailwindTypography.tsx` — size and weight",
    ],
  },
  {
    id: "purpose",
    title: "Size and weight have names",
    kind: "content",
    bullets: [
      "Font size: `text-sm` through `text-3xl` (and beyond)",
      "Font weight: `font-thin` through `font-black`",
      "Same predictable naming as spacing — a prefix plus a step",
      "Pair them: `text-xl font-semibold`",
    ],
  },
  {
    id: "tsx",
    title: "TailwindTypography.tsx",
    kind: "content",
    bullets: [
      "Typography utilities cover font size and weight with the same predictable naming.",
      "The listing is the whole scale, and that is what the live demo renders",
      "`text-3xl` on the heading is the same utility as on the last size line",
    ],
    code: `export default function TailwindTypography() {
  return (
    <div>
      <h2 className="text-3xl">Font Size</h2>
      <p className="text-sm">This is small text.</p>
      <p className="text-base">This is base text.</p>
      <p className="text-lg">This is large text.</p>
      <p className="text-xl">This is extra large text.</p>
      <p className="text-2xl">This is 2x extra large text.</p>
      <p className="text-3xl">This is 3x extra large text.</p>
      <h2 className="text-3xl font-bold mt-4">Font Weight</h2>
      <p className="font-thin">This is thin font weight.</p>
      <p className="font-light">This is light font weight.</p>
      <p className="font-normal">This is normal font weight.</p>
      <p className="font-medium">This is medium font weight.</p>
      <p className="font-semibold">This is semi-bold font weight.</p>
      <p className="font-bold">This is bold font weight.</p>
      <p className="font-extrabold">This is extra-bold font weight.</p>
      <p className="font-black">This is black font weight.</p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindTypography.tsx",
  },
  {
    id: "demo",
    title: "Live size and weight scale",
    kind: "demo",
    bullets: [
      "Sizes step from `text-sm` to `text-3xl`",
      "Weights step from barely-there `font-thin` to heavy `font-black`",
    ],
    embed: "tw-typography",
  },
  {
    id: "page",
    title: "Add typography to the page",
    kind: "content",
    bullets: [
      "Add `TailwindTypography` to the lab page. Put this import after `TailwindSpacing`, and render the component after that one",
    ],
    code: `import TailwindTypography from "./TailwindTypography";

      <TailwindSpacing />
      <hr className="my-8" />
      <TailwindTypography />`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/page.tsx",
    codeAddedLines: [1, 5],
  },
  {
    id: "pair",
    title: "Pair a size with a weight",
    kind: "content",
    bullets: [
      "On your own: add a line that uses a combo you have not shown yet",
      "Example: `text-xl font-semibold` or `text-2xl font-medium`",
      "Kambaz headings later: `text-2xl font-semibold` on Sign in, `text-lg font-semibold` on cards",
    ],
    code: `<p className="text-xl font-semibold">A size plus a weight</p>`,
    codeLanguage: "tsx",
  },
  {
    id: "next-up",
    title: "Next: background colors",
    kind: "title",
    bullets: [
      "You can set type size and weight without a CSS file",
      "§2.3.3: `bg-{color}-{shade}` plus a contrasting `text-*`",
    ],
  },
];
