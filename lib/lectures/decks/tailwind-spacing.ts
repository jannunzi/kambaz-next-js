import type { LectureSlide } from "../types";

export const TAILWIND_SPACING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Tailwind Spacing",
      "§2.3.1 · `TailwindSpacing.tsx` — margin and padding utilities",
    ],
  },
  {
    id: "purpose",
    title: "m is margin, p is padding",
    kind: "content",
    bullets: [
      "A letter for the property, a number for the amount",
      "`m-4` / `p-4` — all sides. The scale is consistent (`-2`, `-4`, `-8`, …)",
      "Direction letters narrow which side: `t` top, `b` bottom, `s` start, `e` end",
      "Start/end are logical — left/right in English. Prefer them over `l` / `r`",
    ],
  },
  {
    id: "directions",
    title: "Direction letters",
    kind: "content",
    bullets: [
      "Nothing after `m`/`p` = all sides (`p-6`)",
      "`s` / `e` = inline start / end (`ms-4 me-8`)",
      "`t` / `b` = top / bottom (`pt-4 pb-8`)",
      "`x` / `y` exist too (`px-4` is left+right) — Lab 2 uses the directional letters",
    ],
  },
  {
    id: "tsx",
    title: "Margin and padding utilities",
    kind: "content",
    bullets: [
      "Blue boxes show margin. Green boxes show padding",
      "No stylesheet. The class list is the style",
    ],
    code: `export default function TailwindSpacing() {
  return (
    <div>
      <h2 className="text-3xl">Margin</h2>
      <div className="bg-blue-200 mb-4 p-4">
        This div has a bottom margin of 4.
      </div>
      <div className="bg-blue-200 ms-4 me-8 p-4">
        This div has a start margin of 4 and an end margin of 8.
      </div>
      <h2 className="text-3xl mt-8">Padding</h2>
      <div className="bg-green-200 ps-2 pt-4 pb-8 mb-4">
        This div has starting padding of 2, top padding of 4, and bottom padding of 8.
      </div>
      <div className="bg-green-200 p-6">This div has padding all around of 6.</div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindSpacing.tsx",
  },
  {
    id: "demo",
    title: "Live spacing boxes",
    kind: "demo",
    bullets: [
      "The gap under the first blue box is `mb-4`",
      "The second blue box is inset from both sides (`ms-4 me-8`)",
      "Green boxes grow from the inside — that is padding",
    ],
    embed: "tw-spacing",
  },
  {
    id: "vs-css",
    title: "Same job as Lab 2 Padding.tsx",
    kind: "content",
    bullets: [
      "§2.1 wrote `.wd-padded-top-left { padding-top: 50px; }`",
      "`pt-4` is the utility version of that idea — a scale, not a one-off pixel",
      "Use custom CSS when you need a value Tailwind does not ship",
    ],
  },
  {
    id: "next-up",
    title: "Next: typography",
    kind: "title",
    bullets: [
      "You can space a box with `m-*` / `p-*` and a direction letter",
      "§2.3.2: `text-*` sizes and `font-*` weights",
    ],
  },
];
