import type { LectureSlide } from "../types";

export const HEADINGS_AND_PARAGRAPHS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "HEADINGS & PARAGRAPHS",
      "Lab 1: HeadingTags.tsx (`wd-h-tag`) and ParagraphTag.tsx (`wd-p-tag`)",
    ],
  },
  {
    id: "heading-scale",
    title: "Headings",
    kind: "demo",
    bullets: [
      "Use headings as **titles** to introduce distinct sections",
      "Six sizes: `h1`, `h2`, through `h6`",
      "**`h1`** is the largest. **`h6`** is the smallest",
    ],
    code: `<h1>This is the largest heading</h1>
<h2>This is the second largest heading</h2>
<h6>This is the smallest heading</h6>`,
    codeLanguage: "html",
    embed: "heading-scale",
  },
  {
    id: "import-lab1",
    title: "Using headings",
    kind: "content",
    bullets: [
      "Use headings to introduce the topics you have covered so far",
      "A page usually has one `h1`. Nested topics step down (`h2`, `h3`, …)",
    ],
    code: `<h1>HTML</h1>
<h2>Paragraphs</h2>
{/* content discussing paragraphs */}
<h2>Headings</h2>
{/* content discussing headings */}`,
    codeLanguage: "tsx",
  },
  {
    id: "lab1-nest",
    title: "Heading, Div, and Span Tags",
    kind: "content",
    bullets: [
      "Create `app/labs/lab1/HeadingTags.tsx`: a `div` holds an `h4` and the text",
      "`id=\"wd-h-tag\"` is an **attribute**, a `name=\"value\"` pair on the opening tag",
      "`div` is a **block**: it starts a new line. `span` is **inline**: it stays in the sentence",
    ],
    code: `export default function HeadingTags() {
  return (
    <div id="wd-h-tag">
      <h4>Heading Tags</h4>
      Text documents are often broken up into several sections and subsections.
      Each section is usually prefaced with a short title or heading that
      attempts to summarize the topic of the section it precedes. For instance
      this paragraph is preceded by the heading Heading Tags. The font of the
      section headings are usually larger and bolder than their subsection
      headings. This document uses headings to introduce topics such as HTML
      Documents, HTML Tags, Heading Tags, etc. HTML heading tags can be used
      to format plain text so that it renders in a browser as large headings.
      There are 6 heading tags for different sizes: h1, h2, h3, h4, h5, and
      h6. Tag h1 is the largest heading and h6 is the smallest heading. A{" "}
      <span id="wd-inline-span">span</span> sits in this sentence without
      starting a new line.
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/HeadingTags.tsx",
  },
  {
    id: "lab1-nest-live",
    title: "Heading Tags: live demo",
    kind: "demo",
    embed: "heading-tags",
  },
  {
    id: "heading-practice",
    title: "Practice h1 through h6",
    kind: "content",
    bullets: [
      "In the same `wd-h-tag` div, add `h1`–`h6` **after** the sample text, just before `</div>`",
      "Keep the sample `h4` and its text in place",
    ],
    code: `<h1>h1</h1>
<h2>h2</h2>
<h3>h3</h3>
<h4>h4</h4>
<h5>h5</h5>
<h6>h6</h6>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/HeadingTags.tsx",
  },
  {
    id: "heading-practice-live",
    title: "Practice headings: live demo",
    kind: "demo",
    embed: "heading-practice",
  },
  {
    id: "import-headings",
    title: "Import HeadingTags into Lab 1",
    kind: "content",
    bullets: [
      "`import` brings the default export of `HeadingTags.tsx` into the page",
      "Render it like an HTML tag: `<HeadingTags />`",
      "Keep the `{/* do the next exercise here */}` marker for the next exercises",
    ],
    code: `import HeadingTags from "./HeadingTags";

export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <h3>HTML Examples</h3>
      <HeadingTags />
      {/* do the next exercise here */}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/page.tsx",
    codeAddedLines: [1, [7, 9]],
  },
  {
    id: "devtools",
    title: "Find wd-h-tag in DevTools",
    kind: "content",
    bullets: [
      "Open Lab 1 in Chrome. Press `F12` (`Cmd+Option+I` on macOS)",
      "**Elements** shows the live DOM. Find (`Cmd+F` / `Ctrl+F`) `wd-h-tag`",
      "Click the node to see its attributes and styles",
    ],
  },
  {
    id: "paragraph-why",
    title: "Paragraphs",
    kind: "content",
    bullets: [
      "Use `<p>` to **explicitly** add **vertical spacing** between portions of text",
      "Without `p`, leftover text inside a `div` flows as one stream",
      "Lab 1 wrapper id: `wd-p-tag`. Intro sample: `wd-p-1`",
    ],
    code: `<p>
  Lorem Ipsum is simply dummy text of the printing
  and typesetting industry.
</p>
<p>
  Lorem Ipsum has been the industry's standard dummy
  text ever since the 1500s.
</p>`,
    codeLanguage: "html",
  },
  {
    id: "whitespace-without-p",
    title: "Browser ignores white spaces",
    kind: "content",
    bullets: [
      "Create `app/labs/lab1/ParagraphTag.tsx`. The three chunks look separate in the file",
      "The browser still paints them as **one** contiguous block",
      "`...` stands in for the `wd-p-1` text. Tabs and newlines are **not** structure",
    ],
    code: `export default function ParagraphTag() {
  return (
    <div id="wd-p-tag">
      <h4>Paragraph Tag</h4>
      <p id="wd-p-1">...</p>
      This is the first paragraph. The paragraph tag is used to format
      vertical gaps between long pieces of text like this one.

      This is the second paragraph. Even though there is a deliberate white
      gap between the paragraph above and this paragraph, by default browsers
      render them as one contiguous piece of text as shown here on the right.

      This is the third paragraph. Wrap each paragraph with the paragraph tag
      to tell browsers to render the gaps.
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ParagraphTag.tsx",
  },
  {
    id: "wrap-p",
    title: "Add Paragraph Tags for Vertical Spacing",
    kind: "content",
    bullets: [
      "Wrap each chunk so the browser **keeps** the vertical gaps",
      "The three demonstration paragraphs are `wd-p-2`, `wd-p-3`, and `wd-p-4`",
    ],
    code: `export default function ParagraphTag() {
  return (
    <div id="wd-p-tag">
      <h4>Paragraph Tag</h4>
      <p id="wd-p-1">
        This is a paragraph. We often separate a long set of sentences with
        vertical spaces to make the text easier to read. Browsers ignore
        vertical white spaces and render all the text as one single set of
        sentences. To force the browser to add vertical spacing, wrap the
        paragraphs you want to separate with the paragraph tag
      </p>
      <p id="wd-p-2">
        This is the first paragraph. The paragraph tag is used to format
        vertical gaps between long pieces of text like this one.
      </p>
      <p id="wd-p-3">
        This is the second paragraph. Even though there is a deliberate white
        gap between the paragraph above and this paragraph, by default
        browsers render them as one contiguous piece of text as shown here on
        the right.
      </p>
      <p id="wd-p-4">
        This is the third paragraph. Wrap each paragraph with the paragraph
        tag to tell browsers to render the gaps.
      </p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ParagraphTag.tsx",
    codeAddedLines: [[5, 25]],
  },
  {
    id: "wrap-p-live",
    title: "Paragraph Tag: live demo",
    kind: "demo",
    embed: "paragraph-tag",
  },
  {
    id: "import-paragraph",
    title: "Import ParagraphTag into Lab 1",
    kind: "content",
    bullets: [
      "Import `ParagraphTag` the same way you imported `HeadingTags`",
      "Render it right after `<HeadingTags />`",
    ],
    code: `import HeadingTags from "./HeadingTags";
import ParagraphTag from "./ParagraphTag";

export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <h3>HTML Examples</h3>
      <HeadingTags />
      <ParagraphTag />
      {/* do the next exercise here */}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/page.tsx",
    codeAddedLines: [2, 10],
  },
  {
    id: "next-up",
    title: "Next: lists and tables",
    kind: "title",
    bullets: [
      "You can outline a page and keep paragraphs from blending",
      "Next: `ol` / `ul` / `li`, a semantic `table`, then images",
    ],
  },
];
