import type { LectureSlide } from "../types";

export const ANCHORS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "ANCHORS",
      "The Hyper in HyperText Markup Language",
    ],
  },
  {
    id: "section",
    title: "Anchors",
    kind: "content",
    bullets: [
      "Use anchors to **link** to other documents, email, or phones",
      "`href` (hypertext reference) is the destination",
      "Same tag, different schemes: `https:`, relative files, `mailto:`, `tel:`, `#hash`",
    ],
    code: `<a href="https://www.wikipedia.org">Wikipedia</a>
<a href="https://github.com/jannunzi">GitHub</a>
<a href="/labs">Labs</a>
<a href="mailto:jannunzi@gmail.com">Email</a>
<a href="tel:+123456789">Call me</a>`,
    codeLanguage: "html",
  },
  {
    id: "href-documents",
    title: "href to other documents",
    kind: "content",
    bullets: [
      "**Absolute** — another site: `https://www.lipsum.com`",
      "**Relative** — a path on this site: `/labs/lab1`",
      "Create `AnchorTag.tsx` and import it into `page.tsx`. Sample ids `wd-lipsum` and `wd-github`",
    ],
    code: `export default function AnchorTag() {
  return (
    <>
      <h4>Anchor tag</h4>
      Please{" "}
      <a href="https://www.lipsum.com" id="wd-lipsum">
        click here
      </a>{" "}
      to get dummy text
      <br />
      <a href="https://github.com/jannunzi" id="wd-github">
        GitHub
      </a>
    </>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/AnchorTag.tsx",
  },
  {
    id: "href-documents-live",
    title: "Anchor Tag: live demo",
    kind: "demo",
    embed: "anchors",
  },
  {
    id: "mailto-tel",
    title: "mailto: and tel:",
    kind: "demo",
    bullets: [
      "`mailto:jannunzi@gmail.com` opens the user’s mail client",
      "`tel:+123456789` opens the phone dialer (or a helper app on a laptop)",
      "These are still `a` tags. The **scheme** in `href` is what changes",
    ],
    code: `<a href="mailto:jannunzi@gmail.com">Email</a>
<a href="tel:+123456789">Call me</a>`,
    codeLanguage: "html",
    embed: "mailto-tel",
  },
  {
    id: "hash-toc",
    title: "Hashes in URLs",
    kind: "demo",
    bullets: [
      "Hashes navigate to the **same** screen, but **scroll**",
      "The hash matches an element **`id`**: `#wd-anchor-bottom` → `id=\"wd-anchor-bottom\"`",
      "Wikipedia-style fragments. Reserve `#` for in-page TOC — app routes use paths (next deck)",
    ],
    code: `<h2 id="toc">Table of Content</h2>
<a href="#wd-anchor-bottom">Jump to bottom</a>
<p id="wd-anchor-bottom">You landed here.</p>
<a href="#toc">TOC</a>`,
    codeLanguage: "tsx",
    embed: "hash-toc",
  },
  {
    id: "lab1-page",
    title: "The Completed Lab 1 page.tsx",
    kind: "content",
    bullets: [
      "`page.tsx` stays thin: import each exercise, then render it in order",
      "`Forms` comes from the `forms` folder: `./forms/Forms`",
    ],
    code: `import HeadingTags from "./HeadingTags";
import ParagraphTag from "./ParagraphTag";
import ListTags from "./ListTags";
import Tables from "./Tables";
import Images from "./Images";
import Forms from "./forms/Forms";
import HighlightedParagraph from "./HighlightedParagraph";
import HighlightedBox from "./HighlightedBox";
import AnchorTag from "./AnchorTag";

export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <h3>HTML Examples</h3>
      <HeadingTags />
      <ParagraphTag />
      <ListTags />
      <Tables />
      <Images />
      <Forms />
      <HighlightedParagraph />
      <HighlightedBox />
      <AnchorTag />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/page.tsx",
    codeAddedLines: [[3, 9], [18, 24]],
  },
];
