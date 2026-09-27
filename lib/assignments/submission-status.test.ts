import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatGradeSummary } from "./grade";
import {
  NOT_GRADED_YET,
  formatGradedConfirmation,
  formatSubmittedTimestamp,
  hasSavedStaffGrade,
  notSubmittedMessage,
  showSubmittedConfirmation,
  statusForAssignment,
  storedSubmissionLinks,
  studentSubmissionStatus,
  submissionGradeLine,
  submissionStatusLabel,
  submitActionLabel,
  submittedBannerHeading,
} from "./submission-status";

const GRADE_95 = {
  earnedPoints: 95,
  totalPoints: 100,
  percent: 95,
  gradedAt: "2026-09-28T01:00:00.000Z",
  acceptedProposed: false,
};

describe("student submission status", () => {
  it("is not submitted, submitted, or graded", () => {
    assert.equal(
      studentSubmissionStatus({ hasSubmission: false }),
      "not_submitted",
    );
    assert.equal(
      studentSubmissionStatus({ hasSubmission: false, staffGrade: GRADE_95 }),
      "not_submitted",
    );
    assert.equal(
      studentSubmissionStatus({ hasSubmission: true, staffGrade: null }),
      "submitted",
    );
    assert.equal(
      studentSubmissionStatus({ hasSubmission: true }),
      "submitted",
    );
    assert.equal(
      studentSubmissionStatus({ hasSubmission: true, staffGrade: GRADE_95 }),
      "graded",
    );
    assert.equal(submissionStatusLabel("not_submitted"), "Not submitted");
    assert.equal(submissionStatusLabel("submitted"), "Submitted");
    assert.equal(submissionStatusLabel("graded"), "Graded");
  });

  it("treats a saved staff grade as graded and ignores an empty snapshot", () => {
    assert.equal(hasSavedStaffGrade(null), false);
    assert.equal(hasSavedStaffGrade({}), false);
    assert.equal(hasSavedStaffGrade({ gradedAt: GRADE_95.gradedAt }), true);
    assert.equal(hasSavedStaffGrade({ earnedPoints: 0, totalPoints: 100, percent: 0 }), true);
    assert.equal(
      studentSubmissionStatus({
        hasSubmission: true,
        staffGrade: { rows: [{ points: 95, maxPoints: 100 }] },
      }),
      "graded",
    );
  });

  it("badges only assignments that store a URL submission", () => {
    assert.equal(
      statusForAssignment({ assignmentId: "a1", hasSubmission: false }),
      "not_submitted",
    );
    assert.equal(
      statusForAssignment({
        assignmentId: "a2",
        hasSubmission: true,
        staffGrade: null,
      }),
      "submitted",
    );
    assert.equal(
      statusForAssignment({
        assignmentId: "a2",
        hasSubmission: true,
        staffGrade: GRADE_95,
      }),
      "graded",
    );
    assert.equal(
      statusForAssignment({ assignmentId: "a3", hasSubmission: false }),
      null,
    );
    assert.equal(
      statusForAssignment({ assignmentId: "a6", hasSubmission: true }),
      null,
    );
  });
});

describe("submitted timestamp", () => {
  it("formats America/New_York with an ET zone label", () => {
    assert.equal(
      formatSubmittedTimestamp("2026-09-28T00:52:00.000Z"),
      "Sun, Sep 27, 8:52 PM ET",
    );
    assert.equal(
      submittedBannerHeading("2026-09-28T00:52:00.000Z"),
      "Submitted Sun, Sep 27, 8:52 PM ET",
    );
    assert.equal(
      formatSubmittedTimestamp(new Date("2026-09-28T00:52:00.000Z")),
      "Sun, Sep 27, 8:52 PM ET",
    );
  });

  it("keeps the ET label during standard time", () => {
    assert.equal(
      formatSubmittedTimestamp("2026-01-15T01:52:00.000Z"),
      "Wed, Jan 14, 8:52 PM ET",
    );
  });

  it("returns null for a missing or invalid time", () => {
    assert.equal(formatSubmittedTimestamp(null), null);
    assert.equal(formatSubmittedTimestamp(undefined), null);
    assert.equal(formatSubmittedTimestamp(""), null);
    assert.equal(formatSubmittedTimestamp("not-a-date"), null);
    assert.equal(submittedBannerHeading("not-a-date"), null);
  });
});

describe("submit confirmation copy", () => {
  it("labels the button Submit, then Update submission", () => {
    assert.equal(
      submitActionLabel({ hasSubmission: false, pending: false }),
      "Submit",
    );
    assert.equal(
      submitActionLabel({ hasSubmission: true, pending: false }),
      "Update submission",
    );
    assert.equal(
      submitActionLabel({ hasSubmission: false, pending: true }),
      "Submitting…",
    );
    assert.equal(
      submitActionLabel({ hasSubmission: true, pending: true }),
      "Updating…",
    );
  });

  it("hides the Submitted banner when the submit call failed", () => {
    assert.equal(
      showSubmittedConfirmation({ hasSubmission: true, submitFailed: false }),
      true,
    );
    assert.equal(
      showSubmittedConfirmation({ hasSubmission: true, submitFailed: true }),
      false,
    );
    assert.equal(
      showSubmittedConfirmation({ hasSubmission: false, submitFailed: false }),
      false,
    );
    assert.equal(
      showSubmittedConfirmation({ hasSubmission: false, submitFailed: true }),
      false,
    );
  });

  it("lists the exact stored GitHub and Vercel URLs", () => {
    assert.deepEqual(
      storedSubmissionLinks({
        githubUrl: "  https://github.com/jane-doe/webdev-client  ",
        vercelUrl: "https://jane-a1.vercel.app",
      }),
      [
        {
          label: "GitHub repository",
          url: "https://github.com/jane-doe/webdev-client",
          href: "https://github.com/jane-doe/webdev-client",
        },
        {
          label: "Vercel URL",
          url: "https://jane-a1.vercel.app",
          href: "https://jane-a1.vercel.app",
        },
      ],
    );
    assert.deepEqual(
      storedSubmissionLinks({ githubUrl: "  ", vercelUrl: "https://jane-a1.vercel.app" }),
      [
        {
          label: "Vercel URL",
          url: "https://jane-a1.vercel.app",
          href: "https://jane-a1.vercel.app",
        },
      ],
    );
    assert.equal(
      storedSubmissionLinks({ githubUrl: "javascript:alert(1)", vercelUrl: "" })[0]?.href,
      null,
    );
  });

  it("formats a saved grade like the grades pages, and says when there is no grade", () => {
    assert.equal(submissionGradeLine(null), NOT_GRADED_YET);
    assert.equal(submissionGradeLine({}), NOT_GRADED_YET);
    assert.equal(NOT_GRADED_YET, "Not graded yet");
    const line = formatGradedConfirmation(GRADE_95);
    assert.equal(line, "Graded: 95 / 100 (95%)");
    assert.equal(
      line,
      `Graded: ${formatGradeSummary({
        ...GRADE_95,
        passedCount: 0,
        totalCount: 0,
        passedIds: [],
      }).replace(" pts", "")}`,
    );
    assert.equal(submissionGradeLine(GRADE_95), "Graded: 95 / 100 (95%)");
    assert.equal(
      submissionGradeLine({
        gradedAt: GRADE_95.gradedAt,
        rows: [{ points: 95, maxPoints: 100 }],
      }),
      "Graded: 95 / 100 (95%)",
    );
  });

  it("says the assignment was not submitted when save fails", () => {
    assert.equal(
      notSubmittedMessage(),
      "Not submitted. This assignment was not submitted.",
    );
    assert.match(notSubmittedMessage("Could not save the submission."), /not submitted/i);
    assert.match(notSubmittedMessage("Could not save the submission."), /Could not save the submission/);
    assert.equal(
      notSubmittedMessage("Not submitted. Try again."),
      "Not submitted. Try again.",
    );
  });
});
