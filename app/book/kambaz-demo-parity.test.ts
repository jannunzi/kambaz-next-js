import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

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
    name: "Modules",
    file: "app/book/ch2/embeds/_styled/courses/cid/modules/page.tsx",
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
    book: "app/book/ch2/sections/KambazStyling.tsx",
    name: "Signin",
    file: "app/book/ch2/embeds/_styled/account/Signin.tsx",
  },
  {
    book: "app/book/ch3/sections/KambazData.tsx",
    name: "Dashboard",
    file: "app/book/ch3/embeds/_styled/dashboard/Dashboard.tsx",
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
      "Modules",
      "Home",
      "Assignments",
      "PeopleTable",
      "AssignmentEditor",
      "Signin",
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
});
