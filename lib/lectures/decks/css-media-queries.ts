import type { LectureSlide } from "../types";

export const CSS_MEDIA_QUERIES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Media Queries",
      "Chapter 2 §2.1.20 · `MediaQueriesDemo.tsx` + `.css`",
    ],
  },
  {
    id: "purpose",
    title: "Same markup, different viewports",
    kind: "content",
    bullets: [
      "**Media queries** apply a CSS block only when the browser matches a condition",
      "Most common condition: a viewport **width** range — the foundation of responsive design",
      "This deck uses Lab 2’s own breakpoints (750 / 1000 / 1250). Not Bootstrap’s grid",
      "Tailwind later wraps the same idea as `md:` / `lg:` utilities. Learn the CSS first",
    ],
  },
  {
    id: "syntax",
    title: "@media wraps a rule block",
    kind: "content",
    bullets: [
      "`@media (min-width: 750px) and (max-width: 1000px) { … }`",
      "Rules inside only apply while the viewport stays in that range",
      "Give this demo its own CSS file — the rules only make sense as a set",
    ],
    code: `.wd-media-queries-demo {
  background-color: green;
  color: white;
  padding: 1rem;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/MediaQueriesDemo.css",
  },
  {
    id: "ranges",
    title: "Green, yellow, blue, then red",
    kind: "content",
    bullets: [
      "Default (narrow): white text on green",
      "750–1000: black on yellow",
      "1000–1250: white on blue",
      "1250 and up: white on red — that last block has **no** `max-width`",
    ],
    code: `@media (min-width: 750px) and (max-width: 1000px) {
  .wd-media-queries-demo {
    background-color: yellow;
    color: black;
  }
}

@media (min-width: 1250px) {
  .wd-media-queries-demo {
    background-color: red;
    color: white;
  }
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/MediaQueriesDemo.css",
  },
  {
    id: "tsx",
    title: "MediaQueriesDemo.tsx",
    kind: "content",
    bullets: [
      "Import the CSS, then list the four promises as `li` tags",
      "The matching bullet is bold and underlined so you can see which rule is live",
    ],
    code: `import "./MediaQueriesDemo.css";

export default function MediaQueriesDemo() {
  return (
    <div className="wd-media-queries-demo">
      <h2>Media Query Demo</h2>
      <p>
        This demo uses CSS media queries to change colors based on screen width:
      </p>
      <ul>
        <li className="wd-mq-rule-default">
          Default is White text on Green background
        </li>
        <li className="wd-mq-rule-750">
          750px to 1000px: Black text on Yellow background
        </li>
        <li className="wd-mq-rule-1000">
          1000px to 1250px: White text on Blue background
        </li>
        <li className="wd-mq-rule-1250">
          Above 1250px: White text on Red background
        </li>
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/MediaQueriesDemo.tsx",
  },
  {
    id: "demo",
    title: "Resize the window to cycle colors",
    kind: "demo",
    bullets: [
      "`@media` watches the **viewport**, not this figure’s width",
      "Shrink or widen the browser (or DevTools device mode) and watch the fill + bold bullet",
    ],
    embed: "css-media-queries",
    interactiveHint:
      "Queries use the window width. Present mode on a wide display lands on red; a phone-sized window is green.",
  },
  {
    id: "later",
    title: "Utilities come after the CSS",
    kind: "content",
    bullets: [
      "You now know why a layout can change at a breakpoint",
      "Chapter 2 later uses Tailwind `sm:` / `md:` / `lg:` for the same job",
      "Those prefixes compile down to `@media` — they are not a different language",
    ],
  },
  {
    id: "next-up",
    title: "Next: float",
    kind: "title",
    bullets: [
      "You can restyle a page when the viewport crosses a width",
      "Deck 6: `float` to wrap text, then percentage columns — historical layout before flex",
    ],
  },
];
