import type { LectureSlide } from "../types";

export const HTML_AND_DOM_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "HTML",
      "Chapter 1 · HyperText Markup Language and the DOM",
    ],
  },
  {
    id: "html-means",
    title: "What is HTML?",
    kind: "content",
    bullets: [
      "**HTML** stands for **HyperText Markup Language**",
      "A language browsers understand so they can **format** webpages",
      "We **mark up** plain text with **tags** — special symbols that name each piece",
      "Not a programming language. A vocabulary of tags",
    ],
  },
  {
    id: "tags",
    title: "Tags format the text",
    kind: "content",
    bullets: [
      "These tags format the text as **bold**",
      "Opening tag, **body**, closing tag",
      "A **tag** is the syntax. An **element** is the tag + attributes + body + the DOM node",
    ],
    code: `<b>This text is bold</b>`,
    codeLanguage: "html",
  },
  {
    id: "plain-text",
    title: "Creating an HTML Webpage",
    kind: "content",
    bullets: [
      "Page format is **plain text** — not a proprietary binary format",
      "Save a new file with the **`.html`** extension. That file is an HTML **document**",
      "Some text can trigger an action. We call that **hypertext** to distinguish it from inert text",
      "Open `hello.html` in an editor, then open the same file in a browser",
    ],
  },
  {
    id: "hello-html",
    title: "A minimal HTML page",
    kind: "demo",
    bullets: [
      "The smallest useful page: a document type, an `html` root, a `head`, and a `body`",
      "Save this as `hello.html` and open it in Chrome",
    ],
    code: `<!DOCTYPE html>
<html>
  <head>
    <title>This is the Page Title</title>
    <link href="style.css" rel="stylesheet" />
  </head>
  <body>
    Hello World!
  </body>
</html>`,
    codeLanguage: "html",
    codeFile: "hello.html",
    embed: "html-skeleton",
  },
  {
    id: "doctype-skeleton",
    title: "The document type",
    kind: "content",
    bullets: [
      "`<!DOCTYPE html>` declares the type of the document as **html**",
      "Helps browsers open the **right** type of document — HTML5, not a 1990s quirk mode",
      "First line. **Not** a tag. A declaration",
    ],
    code: `<!DOCTYPE html>
<html>
  <head>
    <title>This is the Page Title</title>
  </head>
  <body>
    Hello World!
  </body>
</html>`,
    codeLanguage: "html",
    codeFile: "hello.html",
  },
  {
    id: "comments",
    title: "HTML Comments",
    kind: "content",
    bullets: [
      "Comments are short notes for **developers**. Browsers **ignore** them",
      "HTML: `<!-- this is ignored -->`",
      "In React / JSX use `{/* */}` instead — do not paste `<!-- -->` inside a `.tsx` return",
    ],
    code: `<!-- This is a short one line comment -->

{/* This is a comment in JSX files */}`,
    codeLanguage: "tsx",
  },
  {
    id: "body",
    title: "The body tag",
    kind: "content",
    bullets: [
      "`<body>` holds the **main content** of the page — where we spend most of our time",
      "Headings, paragraphs, lists, tables, forms, and images go here",
      "In Next.js, `app/layout.tsx` already owns the document shell. Your `page.tsx` return is **body content**",
    ],
    code: `<body>
  Hello World!
</body>`,
    codeLanguage: "html",
  },
  {
    id: "structure",
    title: "The structure of HTML documents",
    kind: "content",
    bullets: [
      "HTML documents nest: `html` → `head` + `body`",
      "Rewrite `hello.html` so visible copy lives in **`body`**",
      "Close tags in reverse order. Indent children — you are drawing the tree",
    ],
    code: `<!DOCTYPE html>
<html>
  <head>
    <title>This is the Page Title</title>
    <link href="style.css" rel="stylesheet" />
  </head>
  <body>
    Hello World!
  </body>
</html>`,
    codeLanguage: "html",
    codeFile: "hello.html",
  },
  {
    id: "html-root-xml",
    title: "The HTML root tag",
    kind: "content",
    bullets: [
      "HTML documents are **XML** (eXtensible Markup Language) documents with root tag **`html`**",
      "XML: every element has a name, optional attributes, optional children",
      "HTML adds a fixed vocabulary (`h1`, `p`, `form`, …) and browser default styles",
    ],
  },
  {
    id: "head-title-link",
    title: "The head tag",
    kind: "content",
    bullets: [
      "`<head>` configures **meta** information: author, document **title**, scripts, styling",
      "`<title>` is the tab label — not an `h1` on the page",
      "`<link rel=\"stylesheet\" href=\"…\">` attaches CSS",
    ],
    code: `<head>
  <title>This is the Page Title</title>
  <link href="style.css" rel="stylesheet" />
</head>`,
    codeLanguage: "html",
  },
  {
    id: "whitespace",
    title: "White spaces are ignored",
    kind: "content",
    bullets: [
      "We use whitespace to structure documents **visually** in the file",
      "Browsers only respect **single spaces**. Tabs and newlines are ignored",
      "This whole `body` renders as **one** paragraph — wrap later with `p`",
    ],
    code: `<body>
Hello World!

    Consider this paragraph of text. It's separated
visually from the text above by a new line.

    Also these paragraphs are indented with tabs.
Tabs and newlines are ignored so this whole
content will render as a single paragraph.
</body>`,
    codeLanguage: "html",
  },
  {
    id: "the-dom",
    title: "Document Object Model (DOM)",
    kind: "content",
    bullets: [
      "The **DOM** is a **tree** browsers use to represent and render the page",
      "A browser **parses** HTML and creates an equivalent DOM instance",
      "The browser’s **Window** owns a **Document**. The document’s tree is the DOM",
    ],
    diagram: "dom-tree",
  },
  {
    id: "triad",
    title: "HTML, CSS, and JavaScript",
    kind: "content",
    bullets: [
      "**HTML** controls the DOM’s **content** and **structure**",
      "**CSS** controls the DOM’s **styling** — look and feel",
      "**JavaScript** can add, remove, and modify the DOM from algorithms and events",
    ],
  },
  {
    id: "jsx-lab1",
    title: "Lab 1 delivers HTML as JSX",
    kind: "demo",
    bullets: [
      "In this course you write the same tags as **JSX** in `.tsx` components",
      "Keep each HTML topic in its own file under `app/labs/lab1/`, then import it into `page.tsx`",
      "Wrapper id `wd-lab1` helps us test your work and find the node in DevTools",
    ],
    code: `export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <h3>HTML Examples</h3>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/page.tsx",
    codeAddedLines: [5],
    embed: "lab1-stub",
  },
  {
    id: "next-up",
    title: "Example DOM",
    kind: "content",
    bullets: [
      "This HTML becomes a tree: **Window** → **Document** → **Heading** and **Link**",
      "The `href` and the link text are properties on the Link node",
      "Next deck: `h1`–`h6`, then `p` so whitespace becomes real vertical gaps",
    ],
    code: `<body>
  <h1>Read about the DOM</h1>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model">
    DOM on MDN
  </a>
</body>`,
    codeLanguage: "html",
  },
];
