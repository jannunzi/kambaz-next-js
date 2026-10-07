import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import LabsNameGithub from "../../app/labs/lab1/intermediates/1-5-LabsNameGithub";
import { htmlHasStudentName, resolveNameQuery } from "../assignments/names";
import { getLectureDeck } from "../lectures/catalog";

// Book fixes from the A1 slides-only walkthrough: a real code step for the
// name / section / GitHub link on Labs, the create-next-app@16.3 prompts as
// they actually appear, and no relative profile.html link that 404s in the app.
function read(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

function unescapeTemplate(raw: string): string {
  return raw.replace(/\\([`\\$])/g, "$1");
}

function codeBlock(bookPath: string, name: string): string {
  const src = read(bookPath);
  const re = /<CodeBlock\b([^>]*)>(\{`)([\s\S]*?)(`\})<\/CodeBlock>/g;
  const hits: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(src))) {
    if (match[1].match(/name="([^"]+)"/)?.[1] === name) hits.push(unescapeTemplate(match[3]));
  }
  assert.equal(hits.length, 1, `${bookPath} code block ${name}`);
  return hits[0];
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(new URL(`../../${dir}`, import.meta.url))) {
    const path = `${dir}/${entry}`;
    if (statSync(new URL(`../../${path}`, import.meta.url)).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

const closing = "app/book/ch1/sections/ClosingSections.tsx";
const intro = read("app/book/ch1/sections/IntroAndSetup.tsx");

describe("§1.5 name, section, and GitHub link on Labs", () => {
  it("shows the exact file the live demo renders", () => {
    assert.equal(
      read("app/labs/lab1/intermediates/1-5-LabsNameGithub.tsx").trim(),
      codeBlock(closing, "LabsNameGithub").trim(),
    );
    assert.match(read(closing), /<LiveDemo name="LabsNameGithub" file="app\/labs\/page\.tsx">\s*<LabsNameGithub \/>/);
  });

  it("renders a full name, a section, and a github.com repository link", () => {
    const html = renderToStaticMarkup(createElement(LabsNameGithub));
    assert.ok(htmlHasStudentName(html, resolveNameQuery({ firstName: "Jose", lastName: "Annunziato" })));
    assert.match(html, /<h2>Jose Annunziato<\/h2>/);
    assert.match(html, /Section 01/);
    assert.match(html, /<a href="https:\/\/github\.com\/jannunzi\/webdev-client"[^>]*>/);
    // The sample keeps the ids students should add (the checker has fallbacks).
    assert.match(html, /id="wd-labs"/);
    assert.match(html, /id="wd-github"/);
    // Lab links from §1.3.10 and On your own / With AI, plus Kambaz from §1.4.1.
    for (const href of ["/labs/lab1", "/labs/lab2", "/labs/lab3", "/labs/lab4", "/labs/lab5", "/"]) {
      assert.match(html, new RegExp(`href="${href}"`));
    }
  });

  it("is linked from the §1.7 checklist", () => {
    assert.match(read(closing), /id="labs-name-github"/);
    assert.match(read(closing), /href="#labs-name-github"/);
  });
});

describe("§1.2.4 create-next-app@16.3 prompts", () => {
  it("shows the first-run menu with two choices and explains the reuse choice", () => {
    const menu = intro.match(/\{`\? Would you like to use the recommended Next\.js defaults\?[\s\S]*?`\}/)?.[0] ?? "";
    assert.match(menu, /Yes, use recommended defaults/);
    assert.match(menu, /TypeScript, ESLint, No React Compiler, Tailwind CSS, No src\/ directory, App Router, AGENTS\.md/);
    assert.match(menu, /No, customize settings/);
    assert.doesNotMatch(menu, /reuse previous settings/);
    assert.match(intro, /No, reuse previous settings/);
  });

  it("lists every customize question with the course answer", () => {
    for (const line of [
      "✔ Would you like to use TypeScript? … Yes",
      "✔ Which linter would you like to use? › ESLint",
      "✔ Would you like to use React Compiler? … No",
      "✔ Would you like to use Tailwind CSS? … Yes",
      "✔ Would you like your code inside a \\`src/\\` directory? … No",
      "✔ Would you like to use App Router? (recommended) … Yes",
      "✔ Would you like to customize the import alias (\\`@/*\\` by default)? … No",
      "✔ Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? … Yes",
    ]) {
      assert.ok(intro.includes(line), line);
    }
    assert.doesNotMatch(intro, /Turbopack\?/);
  });
});

describe("AnchorTag relative link", () => {
  it("keeps the book block, the Lab 1 component, and the slide listing identical", () => {
    const component = read("app/labs/lab1/AnchorTag.tsx").trim();
    assert.equal(codeBlock("app/book/ch1/sections/HtmlSections.tsx", "AnchorTag").trim(), component);
    const slide = getLectureDeck("anchors")?.slides.find((row) => row.id === "href-documents");
    assert.equal(slide?.codeFile, "app/labs/lab1/AnchorTag.tsx");
    assert.equal(slide?.code?.trim(), component);
  });

  it("never links to profile.html, which 404s inside the Next.js app", () => {
    for (const file of [...walk("app/book"), ...walk("lib/lectures/decks"), ...walk("app/labs/lab1")]) {
      if (!/\.(tsx?|mdx?)$/.test(file)) continue;
      assert.doesNotMatch(read(file), /profile\.html/, file);
    }
  });
});

describe("§1.3 Lab 1 page listings", () => {
  const html = "app/book/ch1/sections/HtmlSections.tsx";
  it("shows the finished lab1/page.tsx the final live demo renders", () => {
    assert.equal(codeBlock(html, "Lab1Complete").trim(), read("app/labs/lab1/page.tsx").trim());
  });

  it("imports ParagraphTag only after the step that creates it", () => {
    const src = read(html);
    const created = src.indexOf('file="app/labs/lab1/ParagraphTag.tsx"');
    const imported = src.indexOf('import ParagraphTag from "./ParagraphTag";');
    assert.ok(created > 0 && imported > created, "ParagraphTag import comes after its file");
  });

  it("describes the App Router choice as the real 16.3 prompts do", () => {
    assert.doesNotMatch(intro, /answered\s+&quot;Would you like to use App Router\?&quot;/);
    assert.match(intro, /Would\s+you like to use App Router\? \(recommended\)/);
  });
});
