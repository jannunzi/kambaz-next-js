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
<a href="profile.html">See my profile</a>
<a href="mailto:jannunzi@gmail.com">Email</a>
<a href="tel:+123456789">Call me</a>`,
    codeLanguage: "html",
  },
  {
    id: "href-documents",
    title: "href to other documents",
    kind: "demo",
    bullets: [
      "**Absolute** — another site: `https://www.lipsum.com`",
      "**Relative** — this origin: `profile.html` or `/labs/lab1`",
      "Lab 1 file: `AnchorTag.tsx` — sample ids `wd-lipsum` and `wd-github`",
    ],
    code: `<a href="https://www.lipsum.com" id="wd-lipsum">click here</a>
<a href="https://github.com/jannunzi" id="wd-github">GitHub</a>
<a href="profile.html">See my profile</a>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/AnchorTag.tsx",
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
];
