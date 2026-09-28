import type { LectureSlide } from "../types";

export const TAILWIND_COLORS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Tailwind Colors",
      "§2.3.3 · backgrounds and contrast",
    ],
  },
  {
    id: "purpose",
    title: "bg-color-shade",
    kind: "content",
    bullets: [
      "Background utilities: `bg-{color}-{shade}`",
      "Shade is 50 (lightest) to 950 (darkest), steps of 100",
      "`-500` is the middle swatch — Lab 2 starts there",
      "Pair a fill with a contrasting `text-*` so the copy stays readable",
    ],
  },
  {
    id: "tsx",
    title: "TailwindBackgroundColors.tsx",
    kind: "content",
    bullets: [
      "Four bands. Red, green, and blue use white text",
      "`yellow-500` is light — it needs `text-black`",
    ],
    code: `export default function TailwindBackgroundColors() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Background Colors</h2>
      <div className="bg-red-500 text-white p-4 mb-4">This div has a red background.</div>
      <div className="bg-green-500 text-white p-4 mb-4">This div has a green background.</div>
      <div className="bg-blue-500 text-white p-4 mb-4">This div has a blue background.</div>
      <div className="bg-yellow-500 text-black p-4 mb-4">This div has a yellow background.</div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindBackgroundColors.tsx",
  },
  {
    id: "demo",
    title: "Live color bands",
    kind: "demo",
    bullets: [
      "Backgrounds follow `bg-{color}-{shade}`, paired with a contrasting text color so content stays readable.",
      "Same `-500` shade, four hues",
      "On your own: add a non-500 shade (`bg-indigo-700`) and a contrasting `text-*`",
    ],
    embed: "tw-backgrounds",
  },
  {
    id: "page",
    title: "Add colors to the page",
    kind: "content",
    bullets: [
      "Add `TailwindBackgroundColors` to the lab page. Put this import after `TailwindTypography`, and render the component after that one",
    ],
    code: `import TailwindBackgroundColors from "./TailwindBackgroundColors";

      <TailwindTypography />
      <hr className="my-8" />
      <TailwindBackgroundColors />`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/page.tsx",
    codeAddedLines: [1, 5],
  },
  {
    id: "next-up",
    title: "Next: responsive prefixes",
    kind: "title",
    bullets: [
      "You can paint a band with `bg-{color}-{shade}` and a contrasting `text-*`",
      "§2.3.4: mobile-first `md:` / `lg:` — then filters, then grid",
    ],
  },
];
