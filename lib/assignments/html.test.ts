import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extractAssignmentIds,
  extractCourseIds,
  htmlHasAllIds,
  htmlHasAllSnippets,
  htmlHasAnyId,
  htmlHasHeadingLevels,
  htmlHasId,
  anchorPathname,
  htmlClassTokens,
  htmlHasAnchorPath,
  htmlIdContainsTag,
  isCourseScreenPath,
  isLabsPath,
  pathnameOf,
  uniqueUrls,
} from "./html";

describe("htmlHasId", () => {
  it("matches quoted and unquoted ids", () => {
    assert.equal(htmlHasId('<div id="wd-labs">', "wd-labs"), true);
    assert.equal(htmlHasId("<div id='wd-labs'>", "wd-labs"), true);
    assert.equal(htmlHasId("<div id=wd-labs>", "wd-labs"), true);
    assert.equal(htmlHasId('<div id="wd-signin-btn">', "wd-labs"), false);
    assert.equal(htmlHasId('<div id="wd-labs-extra">', "wd-labs"), false);
  });
});

describe("html id and heading helpers", () => {
  it("requires all ids or any id", () => {
    const html = '<p id="wd-p-tag"></p><p id="wd-p-1"></p>';
    assert.deepEqual(htmlHasAllIds(html, ["wd-p-tag", "wd-p-1"]), {
      ok: true,
      missing: [],
    });
    assert.deepEqual(htmlHasAllIds(html, ["wd-p-tag", "wd-p-2"]), {
      ok: false,
      missing: ["wd-p-2"],
    });
    assert.equal(htmlHasAnyId(html, ["wd-p-2", "wd-p-1"]), true);
    assert.equal(htmlHasAnyId(html, ["wd-p-2", "wd-p-3"]), false);
  });

  it("requires all text snippets", () => {
    const html = "<table><tr><td>Q4</td></tr><tr><td>Q10</td></tr></table>";
    assert.deepEqual(htmlHasAllSnippets(html, ["Q4", "Q10"]), {
      ok: true,
      missing: [],
    });
    assert.deepEqual(htmlHasAllSnippets(html, ["Q4", "Q11"]), {
      ok: false,
      missing: ["Q11"],
    });
  });

  it("detects heading levels", () => {
    const html = "<h1>A</h1><h4>B</h4><h6>C</h6>";
    assert.deepEqual(htmlHasHeadingLevels(html, [1, 4, 6]), {
      ok: true,
      missing: [],
    });
    assert.deepEqual(htmlHasHeadingLevels(html, [1, 2, 3, 4, 5, 6]), {
      ok: false,
      missing: [2, 3, 5],
    });
  });
});

describe("url and path helpers", () => {
  it("strips trailing slashes from pathnames", () => {
    assert.equal(
      pathnameOf(
        "https://kambaz-next-js-sp26-git-a1-kenneth-aldridges-projects.vercel.app/account/signin",
      ),
      "/account/signin",
    );
    assert.equal(pathnameOf("https://app.vercel.app/labs/"), "/labs");
    assert.equal(pathnameOf("https://app.vercel.app/"), "/");
  });

  it("classifies labs and course screens", () => {
    assert.equal(isLabsPath("/labs"), true);
    assert.equal(isLabsPath("/labs/lab1"), true);
    assert.equal(isLabsPath("/account/signin"), false);
    assert.equal(isCourseScreenPath("/courses/RS101/home"), true);
    assert.equal(isCourseScreenPath("/Courses/RS101/Assignments/123"), true);
    assert.equal(isCourseScreenPath("/dashboard"), false);
    assert.equal(isCourseScreenPath("/courses/1234/people"), false);
    assert.equal(isCourseScreenPath("/courses/1234/people/table"), false);
  });

  it("dedupes absolute urls", () => {
    assert.deepEqual(
      uniqueUrls([
        "https://app.vercel.app/labs",
        "https://app.vercel.app/labs",
        "not a url",
      ]),
      ["https://app.vercel.app/labs"],
    );
  });
});

describe("course and assignment id extraction", () => {
  it("reads /courses and /Courses hrefs", () => {
    const html = `
      <a href="/courses/1234/home">Home</a>
      <a href="/Courses/RS101/Home">RS101</a>
      <a href="/Courses/RS101/Assignments/A1">Editor</a>
    `;
    assert.deepEqual(extractCourseIds(html), ["1234", "RS101"]);
    assert.deepEqual(extractAssignmentIds(html, "RS101"), ["A1"]);
  });
});

describe("anchor paths and class tokens", () => {
  it("matches lab hrefs with or without a host and trailing slash", () => {
    const html = `
      <a href="/labs/lab1">Lab 1</a>
      <a href="/labs/lab2/">Lab 2</a>
      <a href="https://app.vercel.app/labs/lab1/">absolute</a>
      <a id="wd-kambaz-link" href="/">Kambaz</a>
    `;
    assert.equal(htmlHasAnchorPath(html, "/labs/lab1"), true);
    assert.equal(htmlHasAnchorPath(html, "/labs/lab2"), true);
    assert.equal(anchorPathname("https://app.vercel.app/labs/lab1/"), "/labs/lab1");
    assert.equal(htmlHasAnchorPath(html, "/labs/lab3"), false);
  });

  it("reads whole class tokens and ignores prose and prefixes", () => {
    const html = `
      <p>Use ms-4 and grid and grid-cols-4 in your notes.</p>
      <div class="ms-40 font-thin"></div>
      <div className="bg-red-500 md:flex blur-lg"></div>
      <div class="grid grid-cols-4 gap-4"></div>
    `;
    const tokens = htmlClassTokens(html);
    assert.equal(tokens.includes("ms-4"), false);
    assert.equal(tokens.includes("ms-40"), true);
    assert.equal(tokens.includes("font-thin"), true);
    assert.equal(tokens.includes("grid"), true);
    assert.equal(tokens.includes("grid-cols-4"), true);
    assert.equal(tokens.includes("md:flex"), true);
  });

  it("requires an svg inside the named element", () => {
    const withIcon = `<div id="wd-react-icons-sampler"><div><svg class="icon"></svg></div></div>`;
    const empty = `<div id="wd-react-icons-sampler"></div><svg></svg>`;
    assert.equal(htmlIdContainsTag(withIcon, "wd-react-icons-sampler", "svg"), true);
    assert.equal(htmlIdContainsTag(empty, "wd-react-icons-sampler", "svg"), false);
  });
});
