import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  COURSE_INFO_LINKS,
  isCourseInfoCurrent,
} from "../../app/course-info/links.ts";

const root = process.cwd();

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("shared course chrome", () => {
  it("keeps Blog next to Book in COURSE_INFO_LINKS", () => {
    const hrefs = COURSE_INFO_LINKS.map((link) => link.href);
    assert.ok(hrefs.includes("/blog"));
    assert.ok(hrefs.indexOf("/blog") === hrefs.indexOf("/book") + 1);
    assert.ok(hrefs.includes("/assignments"));
    // Graded quizzes are taken in Canvas, so the course nav has no quiz-take link.
    assert.ok(!(hrefs as readonly string[]).includes("/quizzes/take"));
    assert.ok(!hrefs.some((href) => href.startsWith("/quizzes")));
    assert.ok(hrefs.includes("/office-hours"));
    assert.ok(hrefs.includes("/slides"));
    assert.ok(hrefs.includes("/videos"));
    assert.equal(hrefs.indexOf("/videos"), hrefs.indexOf("/slides") + 1);
    assert.ok(!hrefs.includes("/calendar"));
    assert.ok(!hrefs.includes("/piazza-hours"));
    assert.match(read("app/syllabus/components/SyllabusNav.tsx"), /href="\/calendar"/);
    assert.match(
      read("app/syllabus/components/SyllabusNav.tsx"),
      /href="\/piazza-hours"/,
    );
  });

  it("keeps graded-quiz take links out of student navigation", () => {
    for (const file of [
      "app/course-info/links.ts",
      "app/syllabus/components/SyllabusNav.tsx",
      "app/sign-in/[[...sign-in]]/page.tsx",
      "app/sign-up/[[...sign-up]]/page.tsx",
      "app/assignments/components/AssignmentHubNav.tsx",
    ]) {
      assert.doesNotMatch(read(file), /\/quizzes\/take/, file);
    }
  });

  it("treats nested book and assignment paths as current", () => {
    assert.equal(isCourseInfoCurrent("/book/ch1", "/book"), true);
    assert.equal(isCourseInfoCurrent("/assignments/a1", "/assignments"), true);
    assert.equal(isCourseInfoCurrent("/assignmentsx", "/assignments"), false);
    assert.equal(isCourseInfoCurrent("/account/profile", "/account/signin"), true);
    assert.equal(isCourseInfoCurrent("/syllabus", "/book"), false);
    assert.equal(isCourseInfoCurrent("/videos", "/videos"), true);
  });

  it("mounts CourseSiteHeader on syllabus, course-info, book, assignments, quizzes, slides, and people", () => {
    const files = [
      "app/course-info/CourseInfoLayout.tsx",
      "app/syllabus/layout.tsx",
      "app/book/layout.tsx",
      "app/assignments/layout.tsx",
      "app/quizzes/layout.tsx",
      "app/slides/layout.tsx",
      "app/people/layout.tsx",
    ];
    for (const file of files) {
      assert.match(read(file), /CourseSiteHeader|CourseInfoLayout/, file);
    }
    assert.match(read("app/syllabus/layout.tsx"), /CourseInfoLayout/);
    assert.match(
      read("app/course-info/CourseInfoLayout.tsx"),
      /<CourseSiteHeader/,
    );
    assert.match(read("app/course-info/CourseSiteHeader.tsx"), /CourseAuthButtons/);
    assert.match(read("app/course-info/CourseSiteHeader.tsx"), /CourseAuthFallback/);
    assert.match(read("app/course-info/CourseSiteHeader.tsx"), /CourseSiteNav/);
  });

  it("constrains CourseSiteHeader to the shared page-content column by default", () => {
    const header = read("app/course-info/CourseSiteHeader.tsx");
    assert.match(header, /constrain = true/);
    assert.match(header, /page-content/);
    assert.match(header, /course-site-header-align/);
  });

  it("keeps course layouts on the same centered header / reading column", () => {
    const info = read("app/course-info/CourseInfoLayout.tsx");
    const book = read("app/book/layout.tsx");
    const quizzes = read("app/quizzes/layout.tsx");
    const people = read("app/people/layout.tsx");
    const assignments = read("app/assignments/layout.tsx");
    const slides = read("app/slides/layout.tsx");
    const toc = read("app/book/TOC.tsx");
    const css = read("app/book/book.css");

    for (const [file, source] of [
      ["CourseInfoLayout", info],
      ["book layout", book],
      ["quizzes layout", quizzes],
      ["people layout", people],
      ["assignments layout", assignments],
    ] as const) {
      assert.match(source, /page-content/, file);
      assert.doesNotMatch(
        source,
        /<main className="[^"]*px-4/,
        `${file} should not pad main outside the shared column`,
      );
    }

    assert.match(info, /<CourseSiteHeader/);
    assert.match(book, /<CourseSiteHeader/);
    assert.match(quizzes, /<CourseSiteHeader/);
    assert.match(people, /<CourseSiteHeader/);
    assert.match(assignments, /<CourseSiteHeader/);
    assert.match(slides, /<CourseSiteHeader/);
    assert.match(toc, /data-expanded="true"/);
    assert.match(toc, /data-expanded="false"/);
    assert.match(css, /course-site-header-align/);
    assert.match(css, /\.page-content \.book-content/);
  });

  it("keeps assignment hub nav and chapter link in the shared page-content column", () => {
    const header = read("app/course-info/CourseSiteHeader.tsx");
    const layout = read("app/assignments/layout.tsx");
    const index = read("app/assignments/page.tsx");
    const detail = read("app/assignments/[assignmentId]/page.tsx");
    assert.match(header, /constrain/);
    assert.match(header, /page-content/);
    assert.match(layout, /<CourseSiteHeader constrain/);
    assert.match(layout, /page-content/);
    assert.match(index, /<article className="page-content">/);
    assert.match(index, /<AssignmentHubNav current="index"/);
    assert.match(detail, /<article className="page-content">/);
    assert.match(detail, /<AssignmentHubNav current="detail"/);
    assert.match(detail, /<AssignmentChapterLink assignment=\{assignment\}/);
    const hubIndex = detail.indexOf("<AssignmentHubNav");
    const chapterIndex = detail.indexOf("<AssignmentChapterLink");
    const articleOpen = detail.indexOf("<article className=\"page-content\">");
    const articleClose = detail.lastIndexOf("</article>");
    assert.ok(articleOpen !== -1 && articleClose !== -1);
    assert.ok(hubIndex > articleOpen && hubIndex < articleClose);
    assert.ok(chapterIndex > articleOpen && chapterIndex < articleClose);
  });

  it("keeps Sign in / Sign up on shared chrome and does not name Clerk", () => {
    const buttons = read("app/course-info/CourseAuthButtons.tsx");
    const fallback = read("app/course-info/CourseAuthFallback.tsx");
    assert.match(buttons, /Sign in/);
    assert.match(buttons, /Sign up/);
    assert.match(buttons, /UserButton/);
    assert.match(fallback, /href="\/sign-in"/);
    assert.match(fallback, /href="\/sign-up"/);
    assert.match(buttons, /signInLabel = "Sign in"/);
    assert.match(buttons, /signUpLabel = "Sign up"/);
    assert.doesNotMatch(fallback, /\bClerk\b/);
  });

  it("does not weaken staff quiz or people auth bars — they keep title/hint only", () => {
    assert.match(
      read("app/quizzes/take/components/QuizAuthBar.tsx"),
      /showActions=\{false\}/,
    );
    assert.match(
      read("app/quizzes/(review)/layout.tsx"),
      /showActions=\{false\}/,
    );
    assert.match(
      read("app/people/components/PeopleAuthBar.tsx"),
      /showActions=\{false\}/,
    );
    assert.match(read("app/people/page.tsx"), /getEffectiveStaffAccess/);
    assert.match(read("app/quizzes/(review)/page.tsx"), /renderStaffReview/);
    assert.match(
      read("app/quizzes/staff/layout.tsx"),
      /showActions=\{false\}/,
    );
    assert.match(read("app/quizzes/staff/page.tsx"), /renderStaffReview/);
  });
});
