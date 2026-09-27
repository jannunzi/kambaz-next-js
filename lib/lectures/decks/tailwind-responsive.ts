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
      "Narrow: image on top, text below — a single column",
      "At `md`: `md:flex` puts the image beside the copy",
      "`md:w-48 md:h-full` pins the image; `md:max-w-2xl` widens the card",
    ],
    code: `export default function TailwindResponsiveDesign() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Responsive Design</h2>
      <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
        <div className="md:flex">
          <div className="md:shrink-0">
            <img
              className="h-48 w-full object-cover md:h-full md:w-48"
              src="/images/reactjs.jpg"
              alt="ReactJS logo"
            />
          </div>
          <div className="p-8">
            <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase">
              Professional Courses
            </div>
            <a
              href="#"
              className="mt-1 block text-lg leading-tight font-medium text-black hover:underline"
            >
              Rocket Propulsion Fundamentals
            </a>
            <p className="mt-2 text-gray-500">
              This course provides an in-depth study of the fundamentals of rocket
              propulsion, covering topics such as propulsion theory, engine types,
              fuel chemistry, and the practical applications of rocket technology.
              Designed for students with a strong background in physics and
              engineering, the course includes both theoretical instruction and
              hands-on laboratory work
            </p>
          </div>
        </div>
        <br />
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
