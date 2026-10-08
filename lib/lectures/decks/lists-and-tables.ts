import type { LectureSlide } from "../types";

export const LISTS_AND_TABLES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "LISTS",
      "Lab 1: ListTags.tsx (`wd-lists`) then Tables.tsx (`wd-tables`)",
    ],
  },
  {
    id: "ol-vs-ul",
    title: "Lists",
    kind: "content",
    bullets: [
      "`<ul>` — **unordered**. Order does not change the meaning. The browser uses bullets",
      "`<ol>` — **ordered**. Sequence matters. The browser numbers the items",
      "Each item is an `<li>`",
    ],
    code: `<h2>Topics</h2>
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
<h2>Steps</h2>
<ol>
  <li>Learn HTML</li>
  <li>Learn JavaScript</li>
  <li>Build cool stuff</li>
</ol>`,
    codeLanguage: "html",
  },
  {
    id: "ordered-lists",
    title: "Ordered lists",
    kind: "content",
    bullets: [
      "Ordered lists **enumerate** line items",
      "Use `ol` when the sequence is the point: steps, ranked results",
    ],
    code: `<h2>Ordered lists</h2>
Follow these steps
<ol>
  <li>Learn HTML</li>
  <li>Learn JavaScript</li>
  <li>Build cool stuff</li>
</ol>`,
    codeLanguage: "html",
  },
  {
    id: "unordered-lists",
    title: "Unordered lists",
    kind: "content",
    bullets: [
      "Unordered lists render as **bullet points**",
      "Same `li` children. Change the parent from `ol` to `ul`",
    ],
    code: `<h2>Unordered lists</h2>
Follow these steps
<ul>
  <li>Learn HTML</li>
  <li>Learn JavaScript</li>
  <li>Build cool stuff</li>
</ul>`,
    codeLanguage: "html",
  },
  {
    id: "pancakes-before",
    title: "Example",
    kind: "content",
    bullets: [
      "Create `app/labs/lab1/ListTags.tsx` and import it into `page.tsx`",
      "Start with the pancake steps as **plain text**, no `ol` yet",
      "Browsers **ignore** white spaces. The numbers look like a list in the file and fail on the page",
    ],
    code: `export default function ListTags() {
  return (
    <div id="wd-lists">
      <h4>List Tags</h4>
      <h5>Ordered List Tag</h5>
      How to make pancakes:
      1. Mix dry ingredients.
      2. Add wet ingredients.
      3. Stir to combine.
      4. Heat a skillet or griddle.
      5. Pour batter onto the skillet.
      6. Cook until bubbly on top.
      7. Flip and cook the other side.
      8. Serve and enjoy!
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ListTags.tsx",
  },
  {
    id: "pancakes-after",
    title: "Add ol and li for ordered list",
    kind: "content",
    bullets: [
      "Wrap the list in `ol` and each step in `li`. Drop the typed numbers",
      "The browser numbers them. Lab 1 sample id: `wd-pancakes`",
    ],
    code: `export default function ListTags() {
  return (
    <div id="wd-lists">
      <h4>List Tags</h4>
      <h5>Ordered List Tag</h5>
      How to make pancakes:
      <ol id="wd-pancakes">
        <li>Mix dry ingredients.</li>
        <li>Add wet ingredients.</li>
        <li>Stir to combine.</li>
        <li>Heat a skillet or griddle.</li>
        <li>Pour batter onto the skillet.</li>
        <li>Cook until bubbly on top.</li>
        <li>Flip and cook the other side.</li>
        <li>Serve and enjoy!</li>
      </ol>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ListTags.tsx",
    codeAddedLines: [[7, 16]],
  },
  {
    id: "books-ul",
    title: "Use ul for unordered lists",
    kind: "content",
    bullets: [
      "After the pancake list, add favorite books — order is **not** the point",
      "Lab 1 sample id: `wd-my-books`",
    ],
    code: `How to make pancakes:
<ol id="wd-pancakes">
  {/* pancake steps */}
</ol>
<h5>Unordered List Tag</h5>
My favorite books (in no particular order)
<ul id="wd-my-books">
  <li>Dune</li>
  <li>Lord of the Rings</li>
  <li>Ender&apos;s Game</li>
  <li>Red Mars</li>
  <li>The Forever War</li>
</ul>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ListTags.tsx",
    codeAddedLines: [[5, 13]],
  },
  {
    id: "list-tags-live",
    title: "List Tags: live demo",
    kind: "demo",
    embed: "list-tags",
  },
  {
    id: "tables-not-layout",
    title: "Tables",
    kind: "content",
    bullets: [
      "Use tables to display **tabular data** — each row is a record, each column has the same type",
      "Do **not** use tables to layout content. Use `div`s and CSS instead",
    ],
    code: `<table>
  <thead></thead>
  <tbody></tbody>
</table>`,
    codeLanguage: "html",
  },
  {
    id: "thead-th",
    title: "Table headings and rows",
    kind: "content",
    bullets: [
      "`thead` contains table heading content",
      "`tr` is a row. `th` is a **header cell**",
      "`border` sets border width — old HTML, fine for Lab 1",
    ],
    code: `<table border="1">
  <thead>
    <tr>
      <th>Quiz</th>
      <th>Topic</th>
      <th>Date</th>
      <th>Grade</th>
    </tr>
  </thead>
</table>`,
    codeLanguage: "html",
  },
  {
    id: "tbody-td",
    title: "Table body, rows, and data",
    kind: "content",
    bullets: [
      "`tbody` groups the data rows",
      "`td` is a data cell. One `tr` per record",
    ],
    code: `<table border="1">
  <tbody>
    <tr>
      <td>Q1</td>
      <td>HTML</td>
      <td>2/3/21</td>
      <td>85</td>
    </tr>
  </tbody>
</table>`,
    codeLanguage: "html",
  },
  {
    id: "tfoot-colspan",
    title: "tfoot and colSpan",
    kind: "content",
    bullets: [
      "`tfoot` is the summary row — Average, totals, notes",
      "`colSpan` stretches a cell across columns. In JSX it is camelCase: `colSpan={3}`",
    ],
    code: `<tfoot>
  <tr>
    <td colSpan={3}>Average</td>
    <td>90</td>
  </tr>
</tfoot>`,
    codeLanguage: "tsx",
  },
  {
    id: "quiz-table",
    title: "Example",
    kind: "demo",
    bullets: [
      "Lab 1 sample id: `wd-tables` — `thead` / `tbody` / `tfoot`",
      "Alignment attributes (`align`) are old HTML. Chapter 2 moves that into CSS",
    ],
    code: `export default function Tables() {
  return (
    <div id="wd-tables">
      <h4>Table Tag</h4>
      <table border={1} width="100%">
        <thead>
          <tr>
            <th>Quiz</th>
            <th align="center">Topic</th>
            <th align="center">Date</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Q1</td>
            <td align="center">HTML</td>
            <td align="center">2/3/21</td>
            <td align="right">85</td>
          </tr>
          <tr>
            <td>Q2</td>
            <td align="center">CSS</td>
            <td align="center">2/10/21</td>
            <td align="right">90</td>
          </tr>
          <tr>
            <td>Q3</td>
            <td align="center">JavaScript</td>
            <td align="center">2/17/21</td>
            <td align="right">95</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Average</td>
            <td align="right">90</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/Tables.tsx",
    codeAddedLines: [[34, 39]],
    embed: "tables",
  },
  {
    id: "images-intro",
    title: "Image Tag",
    kind: "content",
    bullets: [
      "`<img>` places a picture: a remote URL or a file in your project",
      "`src` points at the file. Give `width` or `height`; the other scales",
      "`alt` describes the picture when it cannot load. That matters for **accessibility**",
    ],
    code: `<img
  src="my-picture.jpg"
  width="200px"
  height="300px"
/>
{/* src references a local or remote image.
    width / height configure size; one alone scales the other */}`,
    codeLanguage: "html",
  },
  {
    id: "images",
    title: "Remote and Local Images",
    kind: "content",
    bullets: [
      "Save a Tesla Bot picture as `public/images/teslabot.jpg`. It loads from `/images/teslabot.jpg`",
      "`<img />` and `<br />` are **void elements**: no body, so JSX closes them with `/>`",
      "Create `Images.tsx` and import it into `page.tsx`",
    ],
    code: `export default function Images() {
  return (
    <div id="wd-images">
      <h4>Image tag</h4>
      Loading an image from the internet:
      <br />
      <img
        id="wd-starship"
        width="400px"
        alt="Starship"
        src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
      />
      <br />
      Loading a local image:
      <br />
      <img
        id="wd-teslabot"
        src="/images/teslabot.jpg"
        height="200px"
        alt="Tesla Bot (Optimus) humanoid robot"
      />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/Images.tsx",
  },
  {
    id: "images-live",
    title: "Image Tag: live demo",
    kind: "demo",
    embed: "images",
  },
  {
    id: "next-up",
    title: "Next: web forms",
    kind: "title",
    bullets: [
      "Lists and tables structure collections. Tables are data, **not layout**",
      "Images load from a remote URL or from `public/images`",
      "Next: labels, text fields, radios, checkboxes, dropdowns, typed inputs, buttons",
    ],
  },
];
