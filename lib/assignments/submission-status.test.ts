import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatGradeSummary } from "./grade";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import {
  NOT_GRADED_YET,
  SIGN_IN_FOR_SUBMISSION_STATUS,
  formatGradedConfirmation,
  formatSubmittedTimestamp,
  hasSavedStaffGrade,
  notSubmittedMessage,
  showSubmittedConfirmation,
  submissionPersistMessage,
  signedOutStatusNote,
  statusForAssignment,
  statusForViewer,
  storedSubmissionLinks,
  studentSubmissionStatus,
  submissionGradeLine,
  submissionStatusLabel,
  submitActionLabel,
  submitFailureCopy,
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
    assert.equal(submissionStatusLabel("reopened"), "Reopened");
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
      statusForAssignment({
        assignmentId: "a1",
        hasSubmission: true,
        staffGrade: GRADE_95,
        reopened: true,
      }),
      "reopened",
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

  it("hides submission status unless the viewer is a signed-in roster match", () => {
    assert.equal(
      statusForViewer({
        signedIn: false,
        rosterMatched: false,
        assignmentId: "a1",
        hasSubmission: false,
      }),
      null,
    );
    assert.equal(
      statusForViewer({
        signedIn: false,
        rosterMatched: false,
        assignmentId: "a1",
        hasSubmission: true,
        staffGrade: GRADE_95,
      }),
      null,
    );
    assert.equal(
      statusForViewer({
        signedIn: true,
        rosterMatched: false,
        assignmentId: "a1",
        hasSubmission: true,
      }),
      null,
    );
    assert.equal(
      statusForViewer({
        signedIn: true,
        rosterMatched: true,
        assignmentId: "a1",
        hasSubmission: false,
      }),
      "not_submitted",
    );
    assert.equal(
      statusForViewer({
        signedIn: true,
        rosterMatched: true,
        assignmentId: "a1",
        hasSubmission: true,
      }),
      "submitted",
    );
    assert.equal(
      statusForViewer({
        signedIn: true,
        rosterMatched: true,
        assignmentId: "a2",
        hasSubmission: true,
        staffGrade: GRADE_95,
      }),
      "graded",
    );
    assert.equal(signedOutStatusNote(false), SIGN_IN_FOR_SUBMISSION_STATUS);
    assert.equal(signedOutStatusNote(true), null);
    assert.doesNotMatch(SIGN_IN_FOR_SUBMISSION_STATUS, /Not submitted|Submitted|Graded/);
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
    assert.equal(
      submitActionLabel({ hasSubmission: true, pending: false, regrade: true }),
      "Resubmit for regrade",
    );
    assert.equal(
      submitActionLabel({ hasSubmission: true, pending: true, regrade: true }),
      "Resubmitting…",
    );
    assert.equal(
      submitActionLabel({ hasSubmission: false, pending: false, regrade: true }),
      "Submit",
    );
  });

  it("keeps the Submitted banner when an update fails", () => {
    assert.equal(
      showSubmittedConfirmation({ hasSubmission: true, submitFailed: false }),
      true,
    );
    assert.equal(
      showSubmittedConfirmation({ hasSubmission: true, submitFailed: true }),
      true,
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
    assert.equal(line, "Graded: 95 / 100 (95.0%)");
    assert.equal(
      line,
      `Graded: ${formatGradeSummary({
        ...GRADE_95,
        passedCount: 0,
        totalCount: 0,
        passedIds: [],
      })}`,
    );
    assert.equal(submissionGradeLine(GRADE_95), "Graded: 95 / 100 (95.0%)");
    assert.equal(
      submissionGradeLine({
        gradedAt: GRADE_95.gradedAt,
        rows: [{ points: 95, maxPoints: 100 }],
      }),
      "Graded: 95 / 100 (95.0%)",
    );
  });

  it("says the assignment was not submitted when the first submit fails", () => {
    assert.equal(
      notSubmittedMessage(),
      "Not submitted. This assignment was not submitted.",
    );
    const first = submitFailureCopy({
      hasSubmission: false,
      detail: "Could not submit.",
    });
    assert.equal(first.title, "Not submitted");
    assert.match(first.body, /not submitted/i);
    assert.match(first.body, /Could not submit/);
  });

  it("shows the lock message when submissions are closed", () => {
    const empty = submitFailureCopy({
      hasSubmission: false,
      code: "submissions_closed",
      detail: "Not submitted. Submissions closed.",
    });
    assert.equal(empty.title, "Not submitted. Submissions closed.");
    assert.equal(empty.body, "");
    const filed = submitFailureCopy({
      hasSubmission: true,
      submittedAt: "2026-09-28T00:52:00.000Z",
      code: "submissions_closed",
      detail: "Submissions closed.",
    });
    assert.equal(filed.title, "Submissions closed.");
    assert.equal(filed.body, "");
    assert.doesNotMatch(`${filed.title} ${filed.body}`, /Update failed|not submitted/i);
  });

  it("says a failed update kept the previous submission", () => {
    const failed = submitFailureCopy({
      hasSubmission: true,
      submittedAt: "2026-09-28T00:52:00.000Z",
      detail: "Could not submit.",
    });
    assert.equal(failed.title, "Update failed");
    assert.equal(
      failed.body,
      "Update failed. Your previous submission from Sun, Sep 27, 8:52 PM ET is still on file. Could not submit.",
    );
    assert.match(failed.body, /Could not submit/);
    assert.doesNotMatch(`${failed.title} ${failed.body}`, /not submitted/i);
    assert.equal(
      submitFailureCopy({ hasSubmission: true, submittedAt: null }).body,
      "Update failed. Your previous submission is still on file.",
    );
    assert.equal(submissionPersistMessage(new Error("db down")), "db down");
    assert.equal(submissionPersistMessage(null), "Could not submit.");
    assert.doesNotMatch(submissionPersistMessage(undefined), /save the submission/i);
  });

  it("uses Submit and Update submission in the student helper copy", () => {
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
    assert.match(ASSIGNMENT_STUDENT_COPY.urlSubmitWhen, /Update submission/);
    assert.doesNotMatch(ASSIGNMENT_STUDENT_COPY.urlSubmitWhen, /\bSave\b|\bSaving\b/);
    assert.doesNotMatch(ASSIGNMENT_STUDENT_COPY.checksNotSaved, /\bSave\b|\bSaving\b/);
    assert.doesNotMatch(ASSIGNMENT_STUDENT_COPY.signInHint, /\bSave\b|\bSaving\b/);
    assert.doesNotMatch(ASSIGNMENT_STUDENT_COPY.saved, /\bSave\b|\bSaving\b/);
    assert.match(submittedBannerHeading("2026-09-28T00:52:00.000Z"), /^Submitted /);
  });
});
