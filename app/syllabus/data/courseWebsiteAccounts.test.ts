import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { COURSE_WEBSITE_ACCOUNT_COPY } from "@/lib/course-site/account-copy";

const syllabusView = readFileSync(
  new URL("../components/SyllabusView.tsx", import.meta.url),
  "utf8",
);
const syllabusNav = readFileSync(
  new URL("../components/SyllabusNav.tsx", import.meta.url),
  "utf8",
);
const syllabusHeader = readFileSync(
  new URL("../components/SyllabusHeader.tsx", import.meta.url),
  "utf8",
);

describe("syllabus course website accounts placement", () => {
  it("puts the accounts section next to How to use the book and meetings", () => {
    assert.match(syllabusView, /<HowToUseTheBook \/>/);
    assert.match(syllabusView, /<CourseWebsiteAccounts \/>/);
    assert.match(syllabusView, /<MeetingInfo /);
    const bookAt = syllabusView.indexOf("<HowToUseTheBook />");
    const accountsAt = syllabusView.indexOf("<CourseWebsiteAccounts />");
    const meetingsAt = syllabusView.indexOf("<MeetingInfo ");
    assert.ok(bookAt > 0 && accountsAt > bookAt && meetingsAt > accountsAt);
  });

  it("links the section from the syllabus nav and header", () => {
    assert.match(syllabusNav, /href: "#accounts"/);
    assert.match(syllabusHeader, /href="#accounts"/);
    assert.match(syllabusHeader, /Course website accounts/);
    assert.match(syllabusHeader, /Sign up first with your Canvas email/);
    assert.equal(
      COURSE_WEBSITE_ACCOUNT_COPY.heading,
      "Course website accounts",
    );
  });

  it("cross-links lecture recordings from the header how-to-use blurb", () => {
    assert.match(syllabusHeader, /href="#meetings"/);
    assert.match(syllabusHeader, /Lecture recordings/);
    assert.match(
      syllabusHeader,
      /Canvas →\s+Zoom Meetings → Cloud Recordings/,
    );
    assert.match(syllabusHeader, /after each lecture finishes/);
    assert.match(
      syllabusHeader,
      /empty list before or during the class day is/,
    );
    assert.match(syllabusHeader, /legitimate absence/);
    assert.match(syllabusHeader, /not as a replacement for\s+class/);
  });
});
