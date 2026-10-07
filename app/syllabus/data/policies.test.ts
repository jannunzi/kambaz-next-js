import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { academicIntegrity, aiPolicy, regradePolicy } from "./policies.ts";

const syllabusView = readFileSync(
  new URL("../components/SyllabusView.tsx", import.meta.url),
  "utf8",
);
const syllabusNav = readFileSync(
  new URL("../components/SyllabusNav.tsx", import.meta.url),
  "utf8",
);

describe("regrade policy", () => {
  const text = regradePolicy.paragraphs.join(" ");

  it("allows a regrade only for the immediately prior assignment, for one week after the grade posts", () => {
    assert.match(
      text,
      /only for the assignment immediately before the one you are working on/,
    );
    assert.match(text, /Older assignments are not open for a regrade/);
    assert.match(
      text,
      /opens when you receive a grade for the prior assignment/,
    );
    assert.match(text, /lasts one week from when the grade is posted/);
    assert.match(
      text,
      /working on A2, once A1 is graded you have one week to resubmit A1/,
    );
    assert.match(
      text,
      /working on A4, you may only seek a regrade for A3 — not A2 or A1/,
    );
  });

  it("lets quizzes be rechecked, not retaken, within one week of the quiz grade", () => {
    assert.match(
      text,
      /Quizzes \(Q1–Q6\) can also be regraded within one week from when the quiz grade is posted/,
    );
    assert.match(text, /cannot be retaken or resubmitted/);
    assert.match(text, /only a recheck of how your existing answers were graded/);
  });

  it("sends regrade requests as a private Piazza post to Instructors", () => {
    assert.match(
      text,
      /regrade for an assignment or a quiz, make a private post to Instructors on Piazza/,
    );
  });

  it("does not add rules beyond the prior-assignment and quiz windows", () => {
    assert.doesNotMatch(
      text,
      /penalty|waive|late|cap|exam|percent|%|Canvas|email|online|in person/i,
    );
  });

  it("renders the section after late policy and before assignments", () => {
    const lateAt = syllabusView.indexOf("<LatePolicy ");
    const regradeAt = syllabusView.indexOf("<RegradePolicy ");
    const assignmentsAt = syllabusView.indexOf("<AssignmentsBlurb ");
    assert.ok(lateAt > 0 && regradeAt > lateAt && assignmentsAt > regradeAt);
    assert.match(syllabusNav, /href: "#regrade-policy", label: "Regrade policy"/);
  });
});

describe("AI policy", () => {
  const text = [...aiPolicy.paragraphs, ...(aiPolicy.bullets ?? [])].join(" ");

  it("uses the uncle-or-team standard and the book/exercise rules", () => {
    assert.match(text, /expert professional uncle or team at Google/i);
    assert.match(
      text,
      /If that would not be allowed with a person or a team, it is not allowed with AI/i,
    );
    assert.match(text, /that uncle or team/i);
    assert.match(text, /explain something/i);
    assert.match(text, /help you work things out/i);
    assert.match(text, /full responsibility/i);
    assert.match(text, /explicitly mentions/i);
    assert.match(text, /copy code wholesale/i);
    assert.match(text, /explicitly allows/i);
    assert.doesNotMatch(text, /\bask him\b/i);
    assert.doesNotMatch(text, /are (not )?allowed as learning aids/i);
    assert.doesNotMatch(text, /when in doubt, disclose/i);
    assert.doesNotMatch(text, /prior (written )?approval/i);
    assert.doesNotMatch(text, /permission/i);
    assert.doesNotMatch(text, /prohibited/i);
    assert.doesNotMatch(text, /always OK/i);
  });

  it("covers TA audits, a zero for suspected non-original code, and the learning intent", () => {
    assert.match(text, /regularly random audits/i);
    assert.match(text, /explain a random piece of code/i);
    assert.match(text, /slightest suspicion/i);
    assert.match(text, /zero for that assignment/i);
    assert.match(
      text,
      /unless the instructor or the book explicitly allowed AI for that particular purpose/i,
    );
    assert.match(
      text,
      /acquire the experience and the criteria to create and evaluate quality code/i,
    );
    assert.match(text, /become that expert uncle/i);
    assert.match(text, /join amazing teams/i);
  });

  it("allows IDE autocomplete and treats disabling it as optional preference", () => {
    assert.match(text, /IDE autocomplete is allowed/i);
    assert.match(text, /VS Code IntelliSense/i);
    assert.match(text, /Copilot-style inline suggestions/i);
    assert.match(text, /optional personal preference/i);
    assert.match(text, /not an academic integrity requirement/i);
  });

  it("aligns academic integrity with the wholesale-copy rule", () => {
    const integrity = academicIntegrity.paragraphs.join(" ");
    assert.match(integrity, /copying AI-generated code wholesale/i);
    assert.match(integrity, /explicitly allows/i);
    assert.doesNotMatch(
      integrity,
      /submitting AI-generated work you cannot explain/,
    );
  });
});
