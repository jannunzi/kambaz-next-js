import type { LectureSlide } from "../types";

export const TAILWIND_RESPONSIVE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Tailwind Responsive",
      "§2.3.4 · `TailwindResponsiveDesign.tsx` — mobile-first prefixes",
    ],
  },
  {
    id: "purpose",
    title: "Unprefixed first, then md:",
    kind: "content",
    bullets: [
      "Tailwind is **mobile-first**: a bare class applies at every width",
      "A prefix like `md:` applies from that breakpoint **and up**",
      "§2.1’s `@media` demo watched the viewport. Same idea, shorter spelling",
      "`md:flex` is `display: flex` inside `@media (min-width: 48rem)`",
    ],
  },
  {
    id: "breakpoints",
    title: "Common prefixes",
    kind: "content",
    bullets: [
      "`sm:` ~40rem · `md:` ~48rem · `lg:` ~64rem · `xl:` · `2xl:`",
      "Kambaz later: `hidden md:block` on sidebars, `hidden lg:block` on Course Status",
      "Dashboard cards: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4`",
    ],
  },
  {
    id: "tsx",
    title: "A card that stacks, then rows",
    kind: "content",
    bullets: [
      "Narrow: a tall `h-56` image on top, text below — a single column",
      "At `md`: `md:flex` puts the image beside the copy at full height",
      "`md:w-48 md:h-full` pins the image; `md:max-w-2xl` widens the card",
    ],
    code: `export default function TailwindResponsiveDesign() {
  return (
    <div className="font-sans">
      <h2 className="text-3xl font-bold mb-4">Responsive Design</h2>
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
        <div className="md:flex">
          <div className="relative md:w-48 md:shrink-0">
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
          </div>
          <div className="min-w-0 p-8">
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
  },
  {
    id: "demo",
    title: "Resize to swap the layout",
    kind: "demo",
    bullets: [
      "Widen the window (or Present on a desktop): the image moves beside the text",
      "The figure is only a preview — prefixes watch the **viewport**, like `@media`",
    ],
    embed: "tw-responsive",
    interactiveHint:
      "md: utilities use the window width. A phone-sized window stays stacked; a wide present stage goes side-by-side.",
  },
  {
    id: "vs-media",
    title: "Prefixes compile to @media",
    kind: "content",
    bullets: [
      "You already know why a layout can change at a width",
      "`md:` is not a different language — it is a media query with a name",
      "Use a raw `@media` file when the condition is not a Tailwind breakpoint",
    ],
  },
  {
    id: "next-up",
    title: "Next: style Kambaz",
    kind: "title",
    bullets: [
      "You can stack on phones and row at `md` with prefix utilities",
      "§2.4: wire Tailwind into the Kambaz shell — theme + utilities, no Preflight",
    ],
  },
];
