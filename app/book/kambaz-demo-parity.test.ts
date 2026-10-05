import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import LinksNavigation from "./ch3/embeds/_styled/Navigation";
import AsDashboardPath from "../slides/_components/embeds/AsDashboardPath";

function read(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

/** Template-literal body as it appears in the book source, turned into file text. */
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

function bookCodeBlocks(): Array<{ file: string; body: string }> {
  const blocks: Array<{ file: string; body: string }> = [];
  for (const file of walk("app/book")) {
    if (!file.endsWith(".tsx")) continue;
    const src = read(file);
    const re = /<CodeBlock\b([^>]*)>(\{`)([\s\S]*?)(`\})<\/CodeBlock>/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(src))) {
      blocks.push({
        file: match[1].match(/file="([^"]+)"/)?.[1] ?? "",
        body: unescapeTemplate(match[3]),
      });
    }
  }
  return blocks;
}

function codeBlock(bookPath: string, name: string): string {
  const src = read(bookPath);
  const re = /<CodeBlock\b([^>]*)>(\{`)([\s\S]*?)(`\})<\/CodeBlock>/g;
  const hits: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(src))) {
    const blockName = match[1].match(/name="([^"]+)"/)?.[1];
    if (blockName === name) hits.push(unescapeTemplate(match[3]));
  }
  assert.equal(hits.length, 1, `${bookPath} code block ${name}`);
  return hits[0];
}

/** Snapshot rendered by a Kambaz book demo, paired with the code block it must equal. */
const SNAPSHOTS: Array<{ book: string; name: string; file: string }> = [
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "KambazNavigation",
    file: "app/book/ch2/embeds/_styled/Navigation.tsx",
  },
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "CourseCard",
    file: "app/book/ch2/embeds/_styled/dashboard/CourseCard.tsx",
  },
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "Dashboard",
    file: "app/book/ch2/embeds/_styled/dashboard/Dashboard.tsx",
  },
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "CourseNavigation",
    file: "app/book/ch2/embeds/_styled/courses/cid/Navigation.tsx",
  },
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "GreenCheckmark",
    file: "app/book/ch2/embeds/_styled/courses/cid/modules/GreenCheckmark.tsx",
  },
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "Module",
    file: "app/book/ch2/embeds/_styled/courses/cid/modules/Module.tsx",
  },
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "Lesson",
    file: "app/book/ch2/embeds/_styled/courses/cid/modules/Lesson.tsx",
  },
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "CourseStatus",
    file: "app/book/ch2/embeds/_styled/courses/cid/home/Status.tsx",
  },
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "Home",
    file: "app/book/ch2/embeds/_styled/courses/cid/home/page.tsx",
  },
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "PeopleTable",
    file: "app/book/ch2/embeds/_styled/courses/cid/people/PeopleTable.tsx",
  },
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "AssignmentItem",
    file: "app/book/ch2/embeds/_styled/courses/cid/assignments/AssignmentItem.tsx",
  },
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "Assignments",
    file: "app/book/ch2/embeds/_styled/courses/cid/assignments/Assignments.tsx",
  },
  {
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "AssignmentEditor",
    file: "app/book/ch2/embeds/_styled/courses/cid/assignments/AssignmentEditor.tsx",
  },
  {
    book: "app/book/ch3/sections/KambazData.tsx",
    name: "Dashboard",
    file: "app/book/ch3/embeds/_styled/dashboard/Dashboard.tsx",
  },
  {
    book: "app/book/ch3/sections/KambazData.tsx",
    name: "database",
    file: "app/book/ch3/embeds/_styled/database.ts",
  },
  {
    book: "app/book/ch1/sections/KambazSections.tsx",
    name: "AccountNavigation",
    file: "app/book/ch1/embeds/_styled/AccountNavigation.tsx",
  },
  {
    book: "app/book/ch4/sections/KambazState.tsx",
    name: "Dashboard",
    file: "app/book/ch4/embeds/_styled/dashboard/Dashboard.tsx",
  },
  {
    book: "app/book/ch4/sections/KambazState.tsx",
    name: "coursesStore",
    file: "app/book/ch4/embeds/_styled/store/coursesStore.ts",
  },
  {
    book: "app/book/ch3/sections/KambazData.tsx",
    name: "KambazNavigation",
    file: "app/book/ch3/embeds/_styled/Navigation.tsx",
  },
  {
    book: "app/book/ch3/sections/KambazData.tsx",
    name: "CourseCard",
    file: "app/book/ch3/embeds/_styled/dashboard/CourseCard.tsx",
  },
];

describe("Kambaz book demos match the code block they show", () => {
  for (const snapshot of SNAPSHOTS) {
    it(`${snapshot.name} in ${snapshot.book} equals ${snapshot.file}`, () => {
      assert.equal(read(snapshot.file).trim(), codeBlock(snapshot.book, snapshot.name).trim());
    });
  }

  it("renders §2.4.2 as the static three-card Dashboard, not the later editor", () => {
    const dashboard = read("app/book/ch2/embeds/_styled/dashboard/Dashboard.tsx");
    assert.match(dashboard, /Published Courses \(3\)/);
    assert.match(dashboard, /CS1234 React JS/);
    assert.match(dashboard, /CS2345 Node JS/);
    assert.match(dashboard, /CS3456 MongoDB/);
    assert.doesNotMatch(dashboard, /New Course|useState|Published Courses \(0\)/);
    const book = read("app/book/ch2/sections/KambazStyling.tsx");
    assert.match(
      book,
      /import Dashboard from "\.\.\/embeds\/_styled\/dashboard\/Dashboard"/,
    );
    assert.doesNotMatch(book, /from "@\/app\/\(kambaz\)\//);
  });

  it("keeps every Chapter 2 and 3.9 Kambaz live demo off the current app pages", () => {
    const styling = read("app/book/ch2/sections/KambazStyling.tsx");
    const data = read("app/book/ch3/sections/KambazData.tsx");
    for (const name of [
      "KambazNavigation",
      "CourseNavigation",
      "Dashboard",
      "Home",
      "Assignments",
      "PeopleTable",
      "AssignmentEditor",
    ]) {
      const imported = styling.match(new RegExp(`import ${name} from "([^"]+)"`));
      assert.ok(imported, name);
      assert.match(imported[1], /embeds\/_styled\//);
    }
    const ch3 = data.match(/import Dashboard from "([^"]+)"/);
    assert.ok(ch3);
    assert.match(ch3[1], /embeds\/_styled\/dashboard\/Dashboard/);
    assert.doesNotMatch(data, /from "@\/app\/\(kambaz\)\//);
  });

  it("renders the Modules toolbar and Sign in steps, not a later full page", () => {
    const styling = "app/book/ch2/sections/KambazStyling.tsx";
    assert.equal(
      demoBodyAfter(styling, "Modules toolbar"),
      codeBlock(styling, "Modules toolbar").trim(),
    );
    assert.equal(demoBodyAfter(styling, "Signin"), codeBlock(styling, "Signin").trim());
    const toolbarSlide = slideCode(
      "lib/lectures/decks/kambaz-courses-styling.ts",
      "toolbar",
    );
    const signinSlide = slideCode(
      "lib/lectures/decks/kambaz-account-styling.ts",
      "signin",
    );
    assert.equal(codeBlock(styling, "Modules toolbar").trim(), toolbarSlide.trim());
    assert.equal(codeBlock(styling, "Signin").trim(), signinSlide.trim());
  });

  it("shows a plain anchor where §2.3 adds the Tailwind lab link", () => {
    const link = codeBlock(
      "app/book/ch2/sections/IconsAndTailwind.tsx",
      "Lab2 Tailwind link",
    );
    assert.match(link, /<a href="\/labs\/lab2\/tailwind">/);
    assert.doesNotMatch(link, /next\/link/);
    const prose = read("app/book/ch2/sections/IconsAndTailwind.tsx");
    const layers = prose.indexOf("cascade layers");
    const layerCall = prose.indexOf("layer(...)");
    const tokens = prose.indexOf("design token");
    const theme = prose.indexOf("<strong>theme</strong>");
    assert.ok(layers > 0 && layerCall > layers && tokens > layerCall && theme > tokens);
    const styling = read("app/book/ch2/sections/KambazStyling.tsx");
    assert.match(styling, /default heading sizes, bullets, and margins/);
    assert.doesNotMatch(styling, /The same section|The same two lines/);
    assert.doesNotMatch(styling, /the live component/);
  });

  it("rejects live app/(kambaz) imports, dynamic imports, and reads, including the book layout", () => {
    const roots = readdirSync(repoPath("app/book"))
      .filter((name) => name.startsWith("ch"))
      .map((name) => `app/book/${name}`);
    roots.push("app/slides/_components/embeds");
    const files = roots.flatMap((root) => walk(root));
    files.push("app/book/layout.tsx");
    const live =
      /(?:from\s+|import\s*\(\s*|import\s+|require\s*\(\s*|@import\s+)["'][^"']*\(kambaz\)|readFile(?:Sync)?\([^)]*\(kambaz\)/;
    const offenders = files.filter((file) => live.test(read(file)));
    assert.deepEqual(offenders, []);
  });

  it("ties every styled snapshot to a book code block", () => {
    const blocks = bookCodeBlocks();
    const bodies = new Set(blocks.map((block) => block.body.trim()));
    const untied: string[] = [];
    for (const file of walk("app/book").filter((path) =>
      path.includes("/embeds/_styled/"),
    )) {
      if (file.endsWith(".json")) {
        const name = file.slice(file.lastIndexOf("/") + 1);
        const live = `app/(kambaz)/database/${name}`;
        if (!blocks.some((block) => block.body.includes(name)) || read(file) !== read(live)) {
          untied.push(file);
        }
        continue;
      }
      const text = read(file).trim();
      if (bodies.has(text)) continue;
      if (file.endsWith(".css")) {
        const base = file.slice(file.lastIndexOf("/") + 1);
        const parts = blocks
          .filter((block) => block.file.endsWith(base))
          .map((block) => block.body.trim());
        if (parts.length > 0 && text === parts.join("\n\n")) continue;
      }
      untied.push(file);
    }
    assert.deepEqual(untied, []);
  });

  it("catches hand-edited Kambaz JSX inside slide embeds", () => {
    const styling = read("app/slides/_components/embeds/KambazStylingEmbeds.tsx");
    const book = "app/book/ch2/sections/KambazStyling.tsx";
    assert.equal(
      read("app/book/ch2/embeds/_styled/dashboard/Dashboard.tsx").trim(),
      codeBlock(book, "Dashboard").trim(),
    );
    assert.equal(
      read("app/book/ch2/embeds/_styled/dashboard/CourseCard.tsx").trim(),
      codeBlock(book, "CourseCard").trim(),
    );
    assert.doesNotMatch(styling, /function StyledCourseCard|h-\[72px\]/);
    assert.match(
      fnBody(styling, "KambazStyledDashboardEmbed"),
      /<div className="font-sans">\s*<Dashboard\s*\/>\s*<\/div>/,
    );

    assert.equal(
      read("app/book/ch2/embeds/_styled/courses/cid/modules/page.tsx").trim(),
      codeBlock(book, "Modules page").trim(),
    );
    const modulesBody = fnBody(styling, "KambazStyledModulesEmbed");
    assert.match(modulesBody, /<div className="font-sans">\s*<Modules\s*\/>\s*<\/div>/);
    assert.doesNotMatch(modulesBody, /Collapse All/);

    assert.equal(
      innerMarkup(fnBody(styling, "KambazStyledHomeEmbed")),
      demoBodyAfter(book, "Home"),
    );
    assert.equal(
      read("app/book/ch2/embeds/_styled/courses/cid/home/page.tsx").trim(),
      codeBlock(book, "Home").trim(),
    );

    const assignmentsBody = fnBody(styling, "KambazStyledAssignmentsEmbed");
    assert.equal(
      markupFrom(assignmentsBody, 'id="wd-assignments"'),
      markupFrom(codeBlock(book, "Assignments"), 'id="wd-assignments"'),
    );
    assert.match(
      assignmentsBody,
      /<div className="font-sans">\s*<div id="wd-assignments">/,
    );
    assert.doesNotMatch(assignmentsBody, /A2 - CSS/);

    const navImport = styling.match(/import CourseNavigation from "([^"]+)"/);
    assert.ok(navImport);
    const navFile = `${navImport[1].replace(/^@\//, "")}.tsx`;
    assert.equal(
      read(navFile).trim(),
      codeBlock(book, "CourseNavigation").trim(),
    );
    const fullNavImport = styling.match(/import FullCourseNavigation from "([^"]+)"/);
    assert.ok(fullNavImport);
    assert.equal(
      read(`${fullNavImport[1].replace(/^@\//, "")}.tsx`).trim(),
      codeBlock("app/book/ch3/sections/KambazData.tsx", "CourseNavigation").trim(),
    );
    assert.match(fnBody(styling, "KambazStyledCourseNavEmbed"), /<FullCourseNavigation cid="1234"\s*\/>/);
    assert.doesNotMatch(fnBody(styling, "KambazStyledHomeEmbed"), /FullCourseNavigation/);
    const linksImport = styling.match(/import LinksNavigation from "([^"]+)"/);
    assert.ok(linksImport);
    assert.equal(
      read(`${linksImport[1].replace(/^@\//, "")}.tsx`).trim(),
      codeBlock("app/book/ch3/sections/KambazData.tsx", "KambazNavigation").trim(),
    );
    const linksBody = fnBody(styling, "KambazLinksNavEmbed");
    assert.match(
      linksBody,
      /<AsDashboardPath>\s*<LinksNavigation\s*\/>\s*<\/AsDashboardPath>/,
    );
    assert.doesNotMatch(linksBody, /pathname=/);
    const linksHtml = renderToStaticMarkup(
      createElement(AsDashboardPath, null, createElement(LinksNavigation)),
    );
    assert.match(linksHtml, /id="wd-dashboard-link"[^>]*bg-white text-red-600/);
    assert.match(linksHtml, /id="wd-courses-link"[^>]*bg-white text-red-600/);
    assert.match(linksHtml, /id="wd-account-link"[^>]*bg-black text-white/);
    assert.match(linksHtml, /id="wd-calendar-link"[^>]*bg-black text-white/);
    assert.match(styling, /<PeopleTable\s*\/>/);
    assert.equal(
      (read("app/book/ch2/embeds/_styled/courses/cid/people/PeopleTable.tsx").match(/odd:bg-neutral-50/g) ?? []).length,
      4,
    );
    const signin = codeBlock(book, "Signin");
    assert.ok(
      styling.replace(/\s+/g, " ").includes(signin.replace(/\s+/g, " ").trim()),
      "signin embed JSX drifted from the Signin code block",
    );
  });

  it("keeps the chapter 3 navigation listing identical to the app", () => {
    assert.equal(
      codeBlock("app/book/ch3/sections/KambazData.tsx", "KambazNavigation").trim(),
      read("app/(kambaz)/Navigation.tsx").trim(),
    );
  });

  it("keeps the dashboard slide listings identical to the book", () => {
    assert.equal(
      slideCode("lib/lectures/decks/kambaz-dashboard-styling.ts", "grid").trim(),
      codeBlock("app/book/ch2/sections/KambazStyling.tsx", "Dashboard").trim(),
    );
    assert.equal(
      slideCode("lib/lectures/decks/kambaz-dashboard-data.ts", "card").trim(),
      codeBlock("app/book/ch3/sections/KambazData.tsx", "CourseCard").trim(),
    );
    assert.equal(
      slideCode("lib/lectures/decks/kambaz-assignments-styling.ts", "people-tsx").trim(),
      codeBlock("app/book/ch2/sections/KambazStyling.tsx", "PeopleTable").trim(),
    );
  });

  it("renders chapter 5 and 6 dashboards from memory, not the network", () => {
    for (const section of [
      "app/book/ch5/sections/KambazServer.tsx",
      "app/book/ch6/sections/KambazDb.tsx",
    ]) {
      const src = read(section);
      const header = src.slice(0, src.indexOf("export default"));
      const imports = header
        .split("\n")
        .filter((line) => line.trimStart().startsWith("import"))
        .join("\n");
      assert.match(imports, /MemoryDashboard/);
      assert.doesNotMatch(imports, /_styled\/dashboard\/Dashboard/);
    }
    const demo = read("app/book/ch5/embeds/MemoryDashboard.tsx");
    assert.doesNotMatch(demo, /axios|httpServer|fetch\(/);
    const listing = codeBlock("app/book/ch5/sections/KambazServer.tsx", "Dashboard");
    assert.equal(jsxReturn(demo), jsxReturn(listing));
  });
});

function repoPath(rel: string): string {
  return new URL(`../../${rel}`, import.meta.url).pathname;
}

function walk(rel: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(repoPath(rel))) {
    const child = `${rel}/${name}`;
    if (statSync(repoPath(child)).isDirectory()) out.push(...walk(child));
    else if (/\.(tsx|ts|css|js|jsx|json)$/.test(name)) out.push(child);
  }
  return out;
}

function fnBody(src: string, name: string): string {
  const at = src.indexOf(`function ${name}`);
  assert.ok(at > 0, name);
  const next = src.indexOf("\nexport function ", at + 10);
  return next === -1 ? src.slice(at) : src.slice(at, next);
}

function markupFrom(source: string, startToken: string): string {
  const tokenAt = source.indexOf(startToken);
  assert.ok(tokenAt > 0, startToken);
  const open = source.lastIndexOf("<div", tokenAt);
  const lineStart = source.lastIndexOf("\n", open) + 1;
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source.startsWith("<div", i)) {
      depth++;
      i += 3;
      continue;
    }
    if (source.startsWith("</div>", i)) {
      depth--;
      if (depth === 0) return dedent(source.slice(lineStart, i + "</div>".length));
      i += 5;
      continue;
    }
  }
  throw new Error(`unbalanced markup for ${startToken}`);
}

function innerMarkup(body: string): string {
  return markupFrom(body, 'className="flex gap-4"');
}

function jsxReturn(source: string): string {
  const at = source.lastIndexOf("return (");
  assert.ok(at > 0, "return");
  const start = source.indexOf("(", at);
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    if (source[i] === "(") depth++;
    else if (source[i] === ")") {
      depth--;
      if (depth === 0) return dedent(source.slice(start + 1, i));
    }
  }
  throw new Error("unbalanced return");
}

function dedent(text: string): string {
  const lines = text.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^ */)?.[0].length ?? 0);
  const min = Math.min(...indents);
  return lines.map((line) => (line.trim().length === 0 ? "" : line.slice(min))).join("\n");
}

/** JSX rendered by the first LiveDemo after the named code block. */
function demoBodyAfter(bookPath: string, blockName: string): string {
  const src = read(bookPath);
  const re =
    /<CodeBlock\b([^>]*)>(\{`)([\s\S]*?)(`\})<\/CodeBlock>|<LiveDemo\b[^>]*>([\s\S]*?)<\/LiveDemo>/g;
  let want = false;
  let match: RegExpExecArray | null;
  while ((match = re.exec(src))) {
    if (match[0].startsWith("<CodeBlock")) {
      want = match[1].match(/name="([^"]+)"/)?.[1] === blockName;
      continue;
    }
    if (want && match[5]) return dedent(match[5]);
  }
  throw new Error(`no live demo after ${blockName} in ${bookPath}`);
}

function slideCode(deckPath: string, id: string): string {
  const src = read(deckPath);
  const at = src.indexOf(`id: "${id}"`);
  assert.ok(at > 0, id);
  const codeAt = src.indexOf("code: `", at);
  assert.ok(codeAt > at, id);
  const start = codeAt + "code: `".length;
  let out = "";
  for (let i = start; i < src.length; i++) {
    if (src[i] === "\\" && i + 1 < src.length) {
      const next = src[i + 1];
      if (next === "`" || next === "\\" || next === "$") {
        out += next;
        i++;
        continue;
      }
    }
    if (src[i] === "`") return out;
    out += src[i];
  }
  throw new Error(`unterminated slide code ${id}`);
}
