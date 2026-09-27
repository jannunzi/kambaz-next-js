import type { LectureSlide } from "../types";

export const TAILWIND_COLORS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Tailwind Colors",
      "§2.3.3–2.3.5 · backgrounds, contrast, then filters",
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
      "Same `-500` shade, four hues",
      "On your own: add a non-500 shade (`bg-indigo-700`) and a contrasting `text-*`",
    ],
    embed: "tw-backgrounds",
  },
  {
    id: "filters-purpose",
    title: "Filters are utilities too",
    kind: "content",
    bullets: [
      "§2.3.5: `blur-*`, `grayscale`, `brightness-*`, `contrast-*`",
      "Apply the effect on the element — usually an image",
      "Swap one class to change the strength. No extra CSS file",
    ],
  },
  {
    id: "filters-tsx",
    title: "TailwindFilters.tsx",
    kind: "content",
    bullets: [
      "Four copies of the same image, blur growing from none to `2xl`",
      "The book’s PDF used Angel Falls; `reactjs.jpg` is enough to see the effect",
    ],
    code: `export default function TailwindFilters() {
  // Download angel-falls.jpg into public/images for the PDF exercise;
  // reactjs.jpg is used here so the lab runs out of the box.
  const src = "/images/reactjs.jpg";
  return (
    <div>
      <h3>Blurs</h3>
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
      "`w-1/4` plus `flex` puts four images in one row",
      "On your own: a second row with `grayscale` or `brightness-*`",
    ],
    embed: "tw-filters",
  },
  {
    id: "next-up",
    title: "Next: flex and grid",
    kind: "title",
    bullets: [
      "You can paint a band and blur an image with one class each",
      "§2.3.6: `flex` / `grow` the Tailwind way, then `grid` + `col-span-*`",
    ],
  },
];
