import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { authoredSlideTextParts } from "./blocks";
import { getLectureDeck } from "./catalog";
import {
  LECTURE_1_SLUGS,
  LECTURE_2_SLUGS,
  LECTURE_3_SLUGS,
  lectureSlideCodeBlocks,
  type LectureSlide,
} from "./types";

// A1 slides-only walkthrough: the Chapter 1 slides must carry the book's
// listings verbatim, so a student copying slides in deck order builds the
// same Lab 1 the book does.

const HTML = "app/book/ch1/sections/HtmlSections.tsx";
const KAMBAZ = "app/book/ch1/sections/KambazSections.tsx";
const INTRO = "app/book/ch1/sections/IntroAndSetup.tsx";

function read(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8");
}

function unescapeTemplate(raw: string): string {
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === "\\" && i + 1 < raw.length) {
      const next = raw[i + 1];
      if (next === "`" || next === "\\" || next === "$") {
        out += next;
        i++;
        continue;
      }
    }
    out += raw[i];
  }
  return out;
}

type BookBlock = { name?: string; file?: string; body: string };

function bookBlocks(path: string): BookBlock[] {
  const src = read(path);
  const re = /<CodeBlock\b([^>]*)>\{`([\s\S]*?)`\}<\/CodeBlock>/g;
  const out: BookBlock[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(src))) {
    out.push({
      name: match[1].match(/name="([^"]+)"/)?.[1],
      file: match[1].match(/file="([^"]+)"/)?.[1],
      body: unescapeTemplate(match[2]),
    });
  }
  return out;
}

/** The one book listing with this name (if given) whose body passes `pick`. */
function bookListing(
  path: string,
  name: string | undefined,
  pick: (body: string) => boolean = () => true,
): string {
  const hits = bookBlocks(path).filter(
    (block) => (name === undefined || block.name === name) && pick(block.body),
  );
  assert.equal(hits.length, 1, `${path} ${name ?? "(unnamed)"}: ${hits.length} matches`);
  return hits[0].body;
}

function slide(slug: string, id: string): LectureSlide {
  const deck = getLectureDeck(slug);
  assert.ok(deck, slug);
  const row = deck.slides.find((s) => s.id === id);
  assert.ok(row, `${slug} missing slide ${id}`);
  return row as LectureSlide;
}

function code(slug: string, id: string): string {
  const row = slide(slug, id);
  assert.ok(row.code, `${slug} ${id} has no code`);
  return row.code;
}

const has = (needle: string) => (body: string) => body.includes(needle);
const lacks = (needle: string) => (body: string) => !body.includes(needle);
const both =
  (...checks: Array<(body: string) => boolean>) =>
  (body: string) =>
    checks.every((check) => check(body));

/** [deck, slide id, book file, listing name, picker] */
const BOOK_COPIES: Array<
  [string, string, string, string | undefined, ((body: string) => boolean)?]
> = [
  ["creating-a-nextjs-react-application", "comment-globals", INTRO, "RootLayout"],
  ["headings-and-paragraphs", "lab1-nest", HTML, "HeadingTags"],
  ["headings-and-paragraphs", "heading-practice", HTML, undefined, has("<h1>h1</h1>")],
  ["headings-and-paragraphs", "import-headings", HTML, "Lab1", lacks("ParagraphTag")],
  ["headings-and-paragraphs", "whitespace-without-p", HTML, "ParagraphTag", has('<p id="wd-p-1">...</p>')],
  ["headings-and-paragraphs", "wrap-p", HTML, "ParagraphTag", has("wd-p-4")],
  ["headings-and-paragraphs", "import-paragraph", HTML, "Lab1", has("ParagraphTag")],
  ["lists-and-tables", "pancakes-before", HTML, "ListTags", has("1. Mix dry ingredients.")],
  ["lists-and-tables", "pancakes-after", HTML, "ListTags", both(has("export default"), has("<li>Mix"))],
  ["lists-and-tables", "books-ul", HTML, "ListTags", has("wd-my-books")],
  ["lists-and-tables", "images-intro", HTML, undefined, has("my-picture.jpg")],
  ["lists-and-tables", "images", HTML, "Images"],
  ["web-forms", "text-fields", HTML, "TextFields"],
  ["web-forms", "forms-wrapper", HTML, "Forms", lacks("use client")],
  ["web-forms", "textarea-html", HTML, undefined, has('<textarea id="wd-textarea" cols="30"')],
  ["web-forms", "textarea", HTML, "Textarea"],
  ["web-forms", "radio-genre", HTML, "RadioButtons", lacks("radio-frequency")],
  ["web-forms", "radio-groups", HTML, "RadioButtons", has("radio-frequency")],
  ["web-forms", "radio-label-patterns", HTML, "RadioLabelPatterns"],
  ["web-forms", "checkboxes", HTML, "Checkboxes"],
  ["web-forms", "select-one", HTML, "Dropdowns", lacks("multiple")],
  ["web-forms", "select-many", HTML, "Dropdowns", has("multiple")],
  ["web-forms", "email", HTML, "OtherFieldTypes", both(lacks("salary"), lacks("rating"))],
  ["web-forms", "number", HTML, "OtherFieldTypes", both(has("salary"), lacks("rating"))],
  ["web-forms", "range", HTML, "OtherFieldTypes", has("... email and number fields ...")],
  ["web-forms", "date", HTML, "OtherFieldTypes", has("wd-text-fields-dob")],
  ["web-forms", "buttons", HTML, "Buttons"],
  ["web-forms", "forms-complete", HTML, "Forms", has("use client")],
  ["anchors", "href-documents", HTML, "AnchorTag"],
  ["single-page-navigation", "layout-children", HTML, "LabsLayout"],
  ["kambaz-assignments", "await-params", KAMBAZ, "Assignments"],
];

/** Live demo slide that must directly follow each book-copy code slide. */
const LIVE_AFTER: Array<[string, string, string, string]> = [
  ["headings-and-paragraphs", "lab1-nest", "lab1-nest-live", "heading-tags"],
  ["headings-and-paragraphs", "heading-practice", "heading-practice-live", "heading-practice"],
  ["headings-and-paragraphs", "wrap-p", "wrap-p-live", "paragraph-tag"],
  ["lists-and-tables", "books-ul", "list-tags-live", "list-tags"],
  ["lists-and-tables", "images", "images-live", "images"],
  ["web-forms", "text-fields", "text-fields-live", "text-fields"],
  ["web-forms", "textarea", "textarea-live", "textarea"],
  ["web-forms", "radio-groups", "radio-groups-live", "radio-buttons"],
  ["web-forms", "checkboxes", "checkboxes-live", "checkboxes"],
  ["web-forms", "select-many", "select-many-live", "dropdowns"],
  ["web-forms", "date", "date-live", "typed-fields"],
  ["web-forms", "buttons", "buttons-live", "buttons"],
  ["web-forms", "forms-complete", "forms-complete-live", "lab1-forms"],
  ["web-forms", "highlighted-paragraph-lab", "highlighted-paragraph-live", "highlighted-paragraph"],
  ["web-forms", "highlighted-box-lab", "highlighted-box-live", "highlighted-box"],
  ["anchors", "href-documents", "href-documents-live", "anchors"],
];

const A1_SLUGS = [...LECTURE_1_SLUGS, ...LECTURE_2_SLUGS, ...LECTURE_3_SLUGS];

function a1Slides(): Array<{ slug: string; slide: LectureSlide; text: string }> {
  return A1_SLUGS.flatMap((slug) => {
    const deck = getLectureDeck(slug);
    assert.ok(deck, slug);
    return deck.slides.map((row) => {
      const s = row as LectureSlide;
      const text = [s.title, ...authoredSlideTextParts(s)].join("\n");
      return { slug, slide: s, text };
    });
  });
}

describe("Chapter 1 slides from the A1 slides-only walkthrough", () => {
  it("copies each Lab 1 / A1 listing from the book verbatim", () => {
    for (const [slug, id, book, name, pick] of BOOK_COPIES) {
      assert.equal(
        code(slug, id).trim(),
        bookListing(book, name, pick).trim(),
        `${slug} ${id} differs from ${book} ${name ?? ""}`,
      );
    }
  });

  it("splits HighlightedParagraph and HighlightedBox at the export, nothing dropped", () => {
    for (const [base, name] of [
      ["highlighted-paragraph", "HighlightedParagraph"],
      ["highlighted-box", "HighlightedBox"],
    ] as const) {
      const component = code("web-forms", base);
      const lab = code("web-forms", `${base}-lab`);
      assert.doesNotMatch(component, /export default/);
      assert.match(lab, /^export default function/);
      assert.equal(`${component}\n\n${lab}`, bookListing(HTML, name));
      assert.equal(slide("web-forms", base).codeFile, `app/labs/lab1/${name}.tsx`);
    }
  });

  it("shows the finished Lab 1 page.tsx after every component it imports", () => {
    const page = slide("anchors", "lab1-page");
    assert.equal(page.code, read("app/labs/lab1/page.tsx").trim());
    assert.equal(page.codeFile, "app/labs/lab1/page.tsx");
    const order = a1Slides();
    const pageAt = order.findIndex((row) => row.slide === page);
    for (const [, path] of (page.code ?? "").matchAll(/from "\.\/([^"]+)"/g)) {
      const file = `app/labs/lab1/${path}.tsx`;
      const createdAt = order.findIndex((row) =>
        lectureSlideCodeBlocks(row.slide).some(
          (block) => block.file === file && /export default function/.test(block.code),
        ),
      );
      assert.ok(createdAt >= 0, `${file} is never shown on a slide`);
      assert.ok(createdAt < pageAt, `${file} is shown after the page imports it`);
    }
  });

  it("puts each live demo on its own slide right after its code", () => {
    for (const [slug, codeId, liveId, embed] of LIVE_AFTER) {
      const deck = getLectureDeck(slug);
      assert.ok(deck);
      const ids = deck.slides.map((row) => row.id);
      assert.equal(ids.indexOf(liveId), ids.indexOf(codeId) + 1, `${slug} ${liveId}`);
      const codeSlide = slide(slug, codeId);
      const live = slide(slug, liveId);
      assert.equal(codeSlide.embed, undefined, `${slug} ${codeId} shares an embed`);
      assert.equal(live.embed, embed);
      assert.equal(lectureSlideCodeBlocks(live).length, 0, `${slug} ${liveId} is demo-only`);
    }
  });

  it("makes the User demo compile: default export, user.json shown, no stray props", () => {
    const user = slide("creating-a-nextjs-react-application", "user-component");
    assert.match(user.code ?? "", /^import user from "\.\/user\.json";/);
    assert.match(user.code ?? "", /export default function User\(\)/);
    assert.equal(user.codeFile, "app/components/User.tsx");
    const onPage = slide("creating-a-nextjs-react-application", "user-on-page");
    const blocks = lectureSlideCodeBlocks(onPage);
    const page = blocks.find((block) => block.file === "app/page.tsx");
    const json = blocks.find((block) => block.file === "app/components/user.json");
    assert.ok(page && json);
    assert.match(page.code, /import User from "\.\/components\/User";/);
    assert.match(page.code, /<User \/>/);
    const data = JSON.parse(json.code) as Record<string, unknown>;
    for (const [, key] of (user.code ?? "").matchAll(/\{user\.(\w+)\}/g)) {
      assert.equal(typeof data[key], "string", `user.json lacks ${key}`);
    }
  });

  it("drops the onClick demo and keeps \"use client\" with the book's Forms.tsx", () => {
    const forms = getLectureDeck("web-forms");
    assert.ok(forms);
    const ids = forms.slides.map((row) => row.id);
    assert.ok(!ids.includes("onclick-alert"));
    for (const row of a1Slides()) {
      for (const block of lectureSlideCodeBlocks(row.slide)) {
        if (/\bon(Click|Submit|Change)=/.test(block.code)) {
          assert.match(block.code, /^"use client";/, `${row.slug} ${row.slide.id}`);
        }
      }
    }
  });

  it("defines each term at its first use in deck order", () => {
    const terms: Array<[string, RegExp, RegExp]> = [
      ["Server Components", /Server Component/, /\*\*Server Components\*\*: /],
      ["hydrate", /hydrat/i, /\*\*Hydrate\*\*: /],
      ["JSX", /\bJSX\b/, /\*\*JSX\*\*: /],
      ["props", /\bprops\b/, /React calls them \*\*props\*\*/],
      ["ReactNode", /ReactNode/, /\*\*`ReactNode`\*\* is/],
      ["Readonly", /Readonly</, /`Readonly<…>` is TypeScript/],
      ["Promise", /\bPromise\b/, /\*\*Promise\*\*: /],
      ["async", /\basync\b/, /\*\*`async`\*\*/],
      ["dynamic segment", /\[cid\]/, /\*\*dynamic segment\*\*/],
      ["uncontrolled", /uncontrolled/i, /\*\*Uncontrolled\*\* input: /],
      ["use client", /use client/, /needs `"use client"`/],
      ["fragment", /fragment|<>/i, /\*\*fragment\*\*/],
      ["void element", /void element/i, /\*\*void elements\*\*/],
      ["TypeScript", /TypeScript/, /\*\*TypeScript\*\*:? (is )?a superset of JavaScript/],
      ["Tailwind CSS", /Tailwind/, /\*\*Tailwind CSS\*\*: a utility-first framework/],
      ["Cache Components", /Cache Components/, /\*\*Cache Components\*\* \(a setting that/],
      ["App Router", /App Router/, /\*\*App Router\*\*: Next\.js’s current routing model/],
      ["ESLint", /ESLint/, /\*\*ESLint\*\*: a code checker/],
      ["React Compiler", /React Compiler/, /\*\*React Compiler\*\*: an optional optimizer/],
      ["event handler", /event handler/i, /An \*\*event handler\*\* is a function that runs when/],
    ];
    const rows = a1Slides();
    for (const [term, use, def] of terms) {
      const first = rows.find((row) => use.test(row.text));
      assert.ok(first, `${term} never used`);
      assert.match(first.text, def, `${term} first used at ${first.slug} ${first.slide.id} without a definition`);
    }
    for (const row of rows) {
      assert.doesNotMatch(row.text, /Vite SPA/, `${row.slug} ${row.slide.id}`);
    }
  });

  it("shows the book's create-next-app@16.3 prompts word for word, split across slides", () => {
    // Text of #222's IntroAndSetup.tsx prompt blocks. Once #222 is merged the
    // book listings below are compared directly as well.
    const defaultsPrompt = `? Would you like to use the recommended Next.js defaults? › - Use arrow-keys. Return to submit.
❯   Yes, use recommended defaults
    TypeScript, ESLint, No React Compiler, Tailwind CSS, No src/ directory, App Router, AGENTS.md
    No, customize settings`;
    const customizeAnswers = [
      "✔ Would you like to use the recommended Next.js defaults? › No, customize settings",
      "✔ Would you like to use TypeScript? … Yes",
      "✔ Which linter would you like to use? › ESLint",
      "✔ Would you like to use React Compiler? … No",
      "✔ Would you like to use Tailwind CSS? … Yes",
      "✔ Would you like your code inside a `src/` directory? … No",
      "✔ Would you like to use App Router? (recommended) … Yes",
      "✔ Would you like to customize the import alias (`@/*` by default)? … No",
      "✔ Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? … Yes",
    ].join("\n");
    const deck = "creating-a-nextjs-react-application";
    assert.equal(code(deck, "defaults"), defaultsPrompt);
    assert.equal(code(deck, "customize-settings"), customizeAnswers);
    const book = bookBlocks(INTRO).map((block) => block.body.trim());
    const bookCustomize = book.find((body) => body.startsWith("✔ Would you like to use the recommended"));
    if (bookCustomize) {
      assert.equal(code(deck, "customize-settings"), bookCustomize);
      assert.ok(book.includes(defaultsPrompt), "book defaults prompt differs from the slide");
    }
    const ids = getLectureDeck(deck)!.slides.map((row) => row.id);
    assert.deepEqual(
      ids.slice(ids.indexOf("create-next-app"), ids.indexOf("npm-run-dev") + 1),
      ["create-next-app", "defaults-explained", "defaults", "customize-settings", "npm-run-dev"],
    );
    const defaults = slide(deck, "defaults");
    assert.ok((defaults.bullets ?? []).length <= 3, "defaults slide must fit at 1280x800");
    assert.match((defaults.bullets ?? []).join("\n"), /No, reuse previous settings/);
    assert.equal(defaults.interactiveHint, undefined, "no stale Pages Router hint");
    for (const row of a1Slides()) {
      assert.doesNotMatch(row.text, /Pages Router, say no/, `${row.slug} ${row.slide.id}`);
    }
  });

  it("fixes the anchors and h1–h6 practice wording", () => {
    const anchors = (slide("anchors", "section").bullets ?? []).join("\n");
    assert.match(anchors, /relative paths/);
    assert.doesNotMatch(anchors, /relative files/);
    const practice = (slide("headings-and-paragraphs", "heading-practice").bullets ?? []).join("\n");
    assert.doesNotMatch(practice, /paragraph/);
    assert.match(practice, /after\*\* the sample text, just before `<\/div>`/);
  });

  it("runs in CI through the npm test script", () => {
    const pkg = JSON.parse(read("package.json")) as { scripts: Record<string, string> };
    assert.match(pkg.scripts.test, /lib\/lectures\/ch1-a1-slides\.test\.ts/);
  });

  it("keeps the assignments search and title placeholders on the last A1 listing", () => {
    const listing = code("kambaz-assignments", "await-params");
    assert.match(listing, /\{\/\* search input, \+ Group, \+ Assignment \*\/\}/);
    assert.match(listing, /\{\/\* h3 wd-assignments-title \*\/\}/);
  });
});
