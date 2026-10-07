import type { LectureSlide } from "../types";

export const CSS_INTRO_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · CSS Intro",
      "Chapter 2 §2.1.1–2.1.6 · Lab 2 starts here",
    ],
  },
  {
    id: "purpose",
    title: "CSS configures look and feel",
    kind: "content",
    bullets: [
      "**CSS** = Cascading Style Sheets — a declarative language for color, space, borders, and layout",
      "HTML says what a node *is*. CSS says how it *looks*",
      "Chapter 1 Kambaz screens were unstyled on purpose. Lab 2 teaches the rules before Tailwind utilities",
      "The files are `app/labs/lab2/page.tsx` and `index.css`",
    ],
  },
  {
    id: "three-places",
    title: "Load CSS three ways",
    kind: "content",
    bullets: [
      "**Best** — a `.css` file you import (or, in plain HTML, `<link rel=\"stylesheet\">`)",
      "**Better** — a `<style>` block in the document (still local, still hard to reuse)",
      "**Avoid** — a `style` attribute on one tag. Fine for a one-off experiment, not a project",
      "This course writes CSS files and imports them in React — not `<link>` in `layout.tsx`",
    ],
  },
  {
    id: "mkdir",
    title: "Create the Lab 2 folder",
    kind: "content",
    bullets: [
      "Same `webdev-client` project from Chapter 1",
      "Under `app/labs`, add a `lab2` directory — mirror `app/labs/lab1`",
    ],
    code: "mkdir app/labs/lab2",
    codeLanguage: "bash",
    codeFile: "terminal",
  },
  {
    id: "lab2-page",
    title: "Starter Lab2 page",
    kind: "content",
    bullets: [
      "`app/labs/lab2/page.tsx` — one top-level component you grow one exercise at a time",
      "Wrapper id `wd-lab2`. Heading only, until the style attribute",
    ],
    code: `export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2 - Cascading Style Sheets</h2>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
  },
  {
    id: "link-labs",
    title: "Link Lab 2 from Labs",
    kind: "content",
    bullets: [
      "Add a link in both `app/labs/page.tsx` and `app/labs/TOC.tsx`",
      "Same two files you updated for Lab 1 (§1.3.10–1.3.11)",
      "Confirm `/labs/lab2` opens from the Labs table of contents before continuing",
    ],
    code: `<Link href="/labs/lab2" id="wd-lab2-link">
  Lab 2: CSS Basics
</Link>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/page.tsx",
    codeBlocks: [
      {
        file: "app/labs/TOC.tsx",
        language: "tsx",
        code: `<li>
  <Link href="/labs/lab2">Lab 2</Link>
</li>`,
      },
    ],
  },
  {
    id: "style-fragment",
    title: "Style attribute is a JSX object",
    kind: "content",
    bullets: [
      "In HTML the value is a string: `style=\"background-color: blue\"`",
      "In JSX it is an **object**: double curly braces, camelCase keys (`backgroundColor`)",
      "Hyphens are illegal in unquoted JS keys — that is why React uses camelCase",
    ],
    code: `<p style={{ backgroundColor: "blue", color: "white" }}>
  ...
</p>`,
    codeLanguage: "tsx",
  },
  {
    id: "style-page",
    title: "Style the Lab 2 paragraph",
    kind: "content",
    bullets: [
      "Add the warning paragraph to `page.tsx` — the technique the paragraph itself warns about",
      "Convenient for a quick experiment. The rest of Lab 2 moves rules into CSS files",
    ],
    code: `export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2 - Cascading Style Sheets</h2>
      <h3>Styling with the STYLE attribute</h3>
      <p style={{ backgroundColor: "blue", color: "white" }}>
        Style attribute allows configuring look and feel right on the
        element. Although it&apos;s very convenient it is considered bad
        practice and you should avoid using the style attribute
      </p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
    codeAddedLines: [[5, 11]],
  },
  {
    id: "style-attr",
    title: "Live style attribute",
    kind: "demo",
    bullets: [
      "Blue background, white text — no CSS file yet",
      "The paragraph is the warning. Do not leave styles scattered on tags",
    ],
    embed: "css-style-attr",
  },
  {
    id: "why-avoid",
    title: "Inline style does not scale",
    kind: "content",
    bullets: [
      "The blue-on-white paragraph is convenient — and a warning",
      "Scatter `style={{…}}` across tags and you cannot change a look in one place",
      "The rest of Lab 2 moves rules into `index.css` so markup stays markup",
    ],
  },
  {
    id: "css-rule",
    title: "A CSS rule has three parts",
    kind: "content",
    bullets: [
      "**Selector** — what to match (`p`, `#id`, `.class`)",
      "**Declaration block** — the `{ … }` list of styles",
      "**Declaration** — `property: value;` — hyphenated names in a CSS file",
    ],
    code: `p {
  background-color: green;
  color: white;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "import-css",
    title: "Import a CSS file in React",
    kind: "content",
    bullets: [
      "Create `app/labs/lab2/index.css` next to `page.tsx`",
      "`import \"./index.css\"` — same as importing a component",
      "A tag selector restyles **every** `p` in the file. Powerful, blunt",
      "JSX still uses `className`, not `class`",
    ],
    code: `import "./index.css";

export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2 - Cascading Style Sheets</h2>
      <h3>Styling with the STYLE attribute</h3>
      <p>
        Style attribute allows configuring look and feel right on the
        element. Although it&apos;s very convenient it is considered bad
        practice and you should avoid using the style attribute
      </p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
    codeAddedLines: [1],
  },
  {
    id: "import-live",
    title: "Live imported CSS",
    kind: "demo",
    bullets: [
      "The blanket `p` rule paints every paragraph green on white",
      "The style attribute is gone from this step — the file owns the look",
    ],
    embed: "css-import",
  },
  {
    id: "id-selectors",
    title: "ID selectors target one id",
    kind: "content",
    bullets: [
      "Write `p#wd-id-selector-1` — tag + `#` + the unique `id`",
      "Comment out the blanket `p` rule so it stops winning",
      "Each paragraph keeps its own colors. Other `p` tags stay untouched",
    ],
    code: `/* p {
  background-color: green;
  color: white;
} */

p#wd-id-selector-1 {
  background-color: red;
  color: white;
}
p#wd-id-selector-2 {
  background-color: yellow;
  color: black;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeAddedLines: [[1, 13]],
    codeBlocks: [
      {
        file: "app/labs/lab2/page.tsx",
        language: "tsx",
        code: `<div id="wd-css-id-selectors">
  <h3>ID selectors</h3>
  <p id="wd-id-selector-1">
    Instead of changing the look and feel of all the
    elements of the same name, e.g., P, we can refer to a
    specific element by its ID
  </p>
  <p id="wd-id-selector-2">
    Here&apos;s another paragraph using a different ID and a
    different look and feel
  </p>
</div>`,
      },
    ],
  },
  {
    id: "id-live",
    title: "Live ID selectors",
    kind: "demo",
    bullets: [
      "First paragraph red on white. Second yellow on black",
      "Any other `p` on the page is unchanged",
    ],
    embed: "css-id-selectors",
  },
  {
    id: "class-selectors",
    title: "Class selectors share a look",
    kind: "content",
    bullets: [
      "An `id` is unique. A **class** can sit on many tags, even different types",
      "CSS: `.wd-class-selector` (a leading dot). JSX: `className=\"wd-class-selector\"`",
      "React reserves `class` for JavaScript classes — that is why JSX renamed the attribute",
    ],
    code: `.wd-class-selector {
  background-color: yellow;
  color: blue;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeBlocks: [
      {
        file: "app/labs/lab2/page.tsx",
        language: "tsx",
        code: `<div id="wd-css-class-selectors">
  <h3>Class selectors</h3>
  <p className="wd-class-selector">
    Instead of using IDs to refer to elements, you can use an
    element&apos;s CLASS attribute
  </p>
  <h4 className="wd-class-selector">
    This heading has same style as paragraph above
  </h4>
</div>`,
      },
    ],
  },
  {
    id: "class-live",
    title: "Live class selectors",
    kind: "demo",
    bullets: [
      "The paragraph and the heading share yellow on blue",
      "One class, two tag types",
    ],
    embed: "css-class-selectors",
  },
  {
    id: "structure-markup",
    title: "Nest four document selectors",
    kind: "content",
    bullets: [
      "Selectors can be combined to target tags by their position in the document tree.",
      "Markup first, in `page.tsx`, id `wd-css-document-structure`",
      "`.wd-selector-1` wraps `.wd-selector-2`, which wraps `.wd-selector-3`, which wraps `.wd-selector-4`",
    ],
    code: `<div id="wd-css-document-structure">
  <div className="wd-selector-1">
    <h3>Document structure selectors</h3>
    <div className="wd-selector-2">
      Selectors can be combined to refer elements in particular
      places in the document
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
        You can combine these relationships to create specific
        styles depending on the document structure
      </p>
    </div>
  </div>
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
  },
  {
    id: "structure",
    title: "Descendant vs child combinators",
    kind: "content",
    bullets: [
      "A **space** is a descendant: `.wd-selector-1 .wd-selector-3` — any depth",
      "A `>` is a **direct child**: `.wd-selector-2 > .wd-selector-3 > .wd-selector-4`",
      "The paragraph turns red from the broader rule. The inner span is yellow-on-blue",
    ],
    code: `.wd-selector-1 .wd-selector-3 {
  background-color: red;
  color: white;
}
.wd-selector-2 > .wd-selector-3 > .wd-selector-4 {
  background-color: yellow;
  color: blue;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "structure-live",
    title: "Live document structure",
    kind: "demo",
    bullets: [
      "The paragraph is red because it is a descendant of `.wd-selector-1`",
      "The span is yellow-on-blue — a direct child chain, not just a descendant",
    ],
    embed: "css-structure-selectors",
  },
  {
    id: "cascade",
    title: "Cascade picks the winning rule",
    kind: "content",
    bullets: [
      "**Specificity** — id beats class beats tag beats the browser default",
      "**Source order** — equal specificity: the later rule in the file wins",
      "**Inheritance** — `color` and fonts pass down. `width` and `margin` do not",
      "If a style “does nothing,” check a more specific selector or a later twin",
    ],
  },
  {
    id: "next-up",
    title: "Next: colors",
    kind: "title",
    bullets: [
      "You can target a tag, one id, a shared class, or a place in the tree",
      "Deck 2: `color` and `background-color` as reusable `wd-fg-*` / `wd-bg-*` classes",
    ],
  },
];
