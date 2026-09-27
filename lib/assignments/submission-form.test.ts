import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assignmentSubmitAccess } from "./access";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import {
  a1CheckAction,
  a1SubmissionFormState,
  gateReasonFromAccess,
  preparePublicAssignmentCheck,
  resolveA1SubmitVisibility,
  submissionGateCopy,
  type SubmissionGateReason,
} from "./submission-form";
import { DEMO_ROSTER_STUDENTS } from "../roster/demo-students";
import { matchRoster } from "../roster/match";
import { mergeClerkRosterEmailSources, normalizeEmail } from "../roster/emails";
import type { AssignmentSubmitGate } from "./access";

function deny(code: Exclude<AssignmentSubmitGate, { ok: true }>["code"]) {
  return { ok: false as const, code };
}

describe("A1 submission form visibility", () => {
  it("shows GitHub and Vercel fields for a signed-in rostered student", () => {
    const ada = DEMO_ROSTER_STUDENTS[0];
    const roster = matchRoster({
      emails: ["  ADA@ADA.COM "],
      mongoEntries: [...DEMO_ROSTER_STUDENTS],
      envEmails: [],
      mongoCount: DEMO_ROSTER_STUDENTS.length,
    });
    assert.equal(roster.status, "matched");
    if (roster.status === "matched") {
      assert.equal(roster.entry.email, normalizeEmail(ada.email));
    }

    const access = assignmentSubmitAccess({
      signedIn: true,
      configured: true,
      isActualStaff: false,
      roster,
    });
    assert.equal(access.ok, true);
    assert.deepEqual(a1SubmissionFormState({ canSubmit: true, gateReason: null }), {
      mode: "fields",
      gateReason: null,
    });
  });

  it("shows URL fields for Ada even when canvas_roster has no demo row", () => {
    const roster = matchRoster({
      emails: ["ada@ada.com"],
      mongoEntries: [
        {
          email: "jane.doe@northeastern.edu",
          section: "CS4550 CRN 11464",
        },
      ],
      envEmails: [],
      mongoCount: 1,
    });
    assert.equal(roster.status, "matched");
    if (roster.status === "matched") {
      assert.equal(roster.entry.name, "Ada Lovelace");
      assert.equal(roster.entry.source, "demo");
    }

    const access = assignmentSubmitAccess({
      signedIn: true,
      configured: true,
      isActualStaff: false,
      roster,
    });
    assert.equal(access.ok, true);
    assert.deepEqual(a1SubmissionFormState({ canSubmit: true }), {
      mode: "fields",
      gateReason: null,
    });
  });

  it("shows URL fields for Ada when Atlas is empty (no seed required)", () => {
    const roster = matchRoster({
      emails: ["  Bob@Bob.com "],
      mongoEntries: [],
      envEmails: [],
      mongoCount: 0,
    });
    assert.equal(roster.status, "matched");

    const access = assignmentSubmitAccess({
      signedIn: true,
      configured: false,
      isActualStaff: false,
      roster,
    });
    assert.equal(access.ok, true);
  });

  it("maps every deny code to a distinct student-facing reason", () => {
    assert.equal(gateReasonFromAccess({ ok: true }), null);
    assert.equal(gateReasonFromAccess(deny("unauthenticated")), "sign_in");
    assert.equal(gateReasonFromAccess(deny("not_on_roster")), "not_on_roster");
    assert.equal(gateReasonFromAccess(deny("roster_empty")), "roster_empty");
    assert.equal(gateReasonFromAccess(deny("not_configured")), "not_configured");
    assert.equal(gateReasonFromAccess(deny("invalid")), "not_configured");

    const titles = (
      ["sign_in", "not_on_roster", "roster_empty", "not_configured"] as const
    ).map((reason) => submissionGateCopy(reason).title);
    assert.equal(new Set(titles).size, titles.length);
    assert.equal(titles[0], "Sign in to submit URLs");
    assert.equal(titles[1], ASSIGNMENT_STUDENT_COPY.notOnRosterTitle);
    assert.match(titles[2] ?? "", /roster has not been loaded/i);
    assert.equal(titles[3], ASSIGNMENT_STUDENT_COPY.notConfiguredTitle);
    assert.equal(titles[3], "URL submit is not available yet");
    assert.equal(
      submissionGateCopy("not_configured").body,
      ASSIGNMENT_STUDENT_COPY.notConfigured,
    );
    assert.match(
      submissionGateCopy("not_configured").body,
      /not a date lock/i,
    );
    assert.match(
      submissionGateCopy("not_configured").body,
      /could not read the imported Canvas\/FACT roster/i,
    );
    assert.match(
      submissionGateCopy("not_configured").body,
      /same Northeastern email you use on Canvas/i,
    );
    assert.match(
      submissionGateCopy("not_configured").body,
      /Piazza to refresh the roster or contact the instructor/i,
    );
    assert.doesNotMatch(
      submissionGateCopy("not_configured").body,
      /hard[-\s]?refresh/i,
    );
    assert.doesNotMatch(
      submissionGateCopy("not_configured").body,
      /refresh (this|the) page/i,
    );
    assert.match(submissionGateCopy("not_configured").body, /Piazza/i);
    assert.match(
      submissionGateCopy("not_configured").body,
      /site roster connection problem/i,
    );
    assert.doesNotMatch(submissionGateCopy("not_configured").body, /ada@/i);
    assert.doesNotMatch(submissionGateCopy("not_configured").body, /\bClerk\b/i);
  });

  it("does not use not_configured when a more specific access code applies", () => {
    const cases: Array<{
      access: AssignmentSubmitGate;
      reason: Exclude<SubmissionGateReason, null>;
    }> = [
      {
        access: assignmentSubmitAccess({
          signedIn: false,
          configured: true,
          isActualStaff: false,
          roster: { status: "empty" },
        }),
        reason: "sign_in",
      },
      {
        access: assignmentSubmitAccess({
          signedIn: true,
          configured: true,
          isActualStaff: false,
          roster: { status: "not_on_roster" },
        }),
        reason: "not_on_roster",
      },
      {
        access: assignmentSubmitAccess({
          signedIn: true,
          configured: true,
          isActualStaff: false,
          roster: { status: "empty" },
        }),
        reason: "roster_empty",
      },
      {
        access: assignmentSubmitAccess({
          signedIn: false,
          configured: false,
          isActualStaff: false,
          roster: { status: "not_configured" },
        }),
        reason: "sign_in",
      },
      {
        access: assignmentSubmitAccess({
          signedIn: true,
          configured: false,
          isActualStaff: false,
          roster: { status: "not_on_roster" },
        }),
        reason: "not_on_roster",
      },
    ];

    for (const { access, reason } of cases) {
      assert.equal(access.ok, false);
      const state = a1SubmissionFormState({
        canSubmit: false,
        gateReason: gateReasonFromAccess(access),
      });
      assert.equal(state.mode, "check");
      if (state.mode === "check") {
        assert.equal(state.gateReason, reason);
        assert.equal(a1CheckAction({ staffReview: false, form: state }), "public");
        if (reason !== "not_configured") {
          assert.notEqual(state.gateReason, "not_configured");
        }
      }
    }
  });

  it("shows an explicit off-roster message instead of a blank form", () => {
    const roster = matchRoster({
      emails: ["stranger@northeastern.edu"],
      mongoEntries: [...DEMO_ROSTER_STUDENTS],
      envEmails: [],
      mongoCount: DEMO_ROSTER_STUDENTS.length,
    });
    assert.equal(roster.status, "not_on_roster");

    const access = assignmentSubmitAccess({
      signedIn: true,
      configured: true,
      isActualStaff: false,
      roster,
    });
    assert.equal(access.ok, false);
    if (!access.ok) assert.equal(access.code, "not_on_roster");

    const state = a1SubmissionFormState({
      canSubmit: false,
      gateReason: gateReasonFromAccess(access),
    });
    assert.equal(state.mode, "check");
    if (state.mode === "check") {
      assert.equal(state.gateReason, "not_on_roster");
      const copy = submissionGateCopy(state.gateReason);
      assert.equal(copy.title, ASSIGNMENT_STUDENT_COPY.notOnRosterTitle);
      assert.match(copy.body, /isn.t on the Canvas\/FACT course roster/i);
      assert.match(copy.body, /same Northeastern email you use on Canvas/i);
      assert.match(
        copy.body,
        /Piazza to refresh the roster or contact the instructor/i,
      );
      assert.doesNotMatch(copy.body, /hard[-\s]?refresh/i);
      assert.doesNotMatch(copy.body, /refresh (this|the) page/i);
      assert.notEqual(copy.title, "URL submit is not available yet");
    }
  });

  it("keeps save behind canSubmit while Run checks stays available", () => {
    const ada = matchRoster({
      emails: ["ada@ada.com"],
      mongoEntries: [],
      envEmails: [],
      mongoCount: 0,
    });
    const allowed = resolveA1SubmitVisibility({
      assignmentId: "a1",
      access: assignmentSubmitAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        roster: ada,
      }),
    });
    assert.equal(allowed.canSubmit, true);
    assert.equal(allowed.gateReason, null);
    assert.equal(a1SubmissionFormState(allowed).mode, "fields");

    const laterPageErrorMustNotHideFields = {
      ...allowed,
    };
    assert.equal(laterPageErrorMustNotHideFields.canSubmit, true);
    assert.notEqual(
      submissionGateCopy("not_configured").title,
      "Sign in to submit URLs",
    );

    const pageOpenButOffRoster = resolveA1SubmitVisibility({
      assignmentId: "a1",
      access: assignmentSubmitAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        roster: { status: "not_on_roster" },
      }),
    });
    assert.equal(pageOpenButOffRoster.canSubmit, false);
    assert.equal(pageOpenButOffRoster.gateReason, "not_on_roster");
    assert.equal(a1SubmissionFormState(pageOpenButOffRoster).mode, "check");
    if (pageOpenButOffRoster.gateReason) {
      assert.notEqual(
        submissionGateCopy(pageOpenButOffRoster.gateReason).title,
        "URL submit is not available yet",
      );
    }

    const signedInUnmatchedUnconfigured = resolveA1SubmitVisibility({
      assignmentId: "a1",
      access: assignmentSubmitAccess({
        signedIn: true,
        configured: false,
        isActualStaff: false,
        roster: { status: "not_configured" },
      }),
    });
    assert.equal(signedInUnmatchedUnconfigured.canSubmit, false);
    assert.equal(signedInUnmatchedUnconfigured.gateReason, "not_configured");
    assert.equal(
      a1SubmissionFormState(signedInUnmatchedUnconfigured).mode,
      "check",
    );
    if (signedInUnmatchedUnconfigured.gateReason) {
      assert.equal(
        submissionGateCopy(signedInUnmatchedUnconfigured.gateReason).title,
        "URL submit is not available yet",
      );
    }
  });

  it("shows URL fields when a slim Clerk session still matches a rostered NEU email", () => {
    const emails = mergeClerkRosterEmailSources({
      sessionUser: { id: "user_chen", emailAddresses: [] },
      sessionClaims: { sub: "user_chen" },
      backendUser: {
        id: "user_chen",
        email_addresses: [
          { email_address: "Chen.Rya@Northeastern.edu" },
        ],
      },
    });
    assert.deepEqual(emails, ["chen.rya@northeastern.edu"]);

    const roster = matchRoster({
      emails,
      mongoEntries: [
        {
          email: "chen.rya@northeastern.edu",
          name: "Ryan Chen",
          section: "CS4550 CRN 11464",
        },
      ],
      envEmails: [],
      mongoCount: 80,
    });
    assert.equal(roster.status, "matched");

    const visibility = resolveA1SubmitVisibility({
      assignmentId: "a1",
      access: assignmentSubmitAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        roster,
      }),
    });
    assert.equal(visibility.canSubmit, true);
    assert.equal(visibility.gateReason, null);
    assert.equal(a1SubmissionFormState(visibility).mode, "fields");
  });

  it("never leaves Save as a blank control when the gate reason is missing", () => {
    const missingReason = a1SubmissionFormState({
      canSubmit: false,
      gateReason: null,
    });
    assert.equal(missingReason.mode, "check");
    if (missingReason.mode === "check") {
      assert.equal(missingReason.gateReason, "not_configured");
      assert.ok(submissionGateCopy(missingReason.gateReason).title);
      assert.equal(
        a1CheckAction({ staffReview: false, form: missingReason }),
        "public",
      );
    }
  });

  it("lets a logged-out visitor run checks while Save stays on the sign-in gate", () => {
    const visibility = resolveA1SubmitVisibility({
      assignmentId: "a1",
      access: assignmentSubmitAccess({
        signedIn: false,
        configured: false,
        isActualStaff: false,
        roster: { status: "not_configured" },
      }),
    });
    assert.equal(visibility.canSubmit, false);
    assert.equal(visibility.gateReason, "sign_in");

    const state = a1SubmissionFormState(visibility);
    assert.equal(state.mode, "check");
    if (state.mode === "check") {
      assert.equal(submissionGateCopy(state.gateReason).title, "Sign in to submit URLs");
      assert.equal(a1CheckAction({ staffReview: false, form: state }), "public");
    }

    const signedIn = a1SubmissionFormState({ canSubmit: true, gateReason: null });
    assert.equal(a1CheckAction({ staffReview: false, form: signedIn }), "account");
    assert.equal(a1CheckAction({ staffReview: true, form: signedIn }), "staff");

    const prepared = preparePublicAssignmentCheck({
      assignmentId: "a1",
      githubUrl: "  https://github.com/jane-doe/webdev-client  ",
      vercelUrl: " https://jane-a1.vercel.app ",
    });
    assert.deepEqual(prepared, {
      ok: true,
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: "https://jane-a1.vercel.app",
    });
    assert.equal(
      preparePublicAssignmentCheck({
        assignmentId: "a1",
        githubUrl: "",
        vercelUrl: "  ",
      }).ok,
      false,
    );
    const otherAssignment = preparePublicAssignmentCheck({
      assignmentId: "a3",
      githubUrl: "",
      vercelUrl: "https://jane-a1.vercel.app",
    });
    assert.equal(otherAssignment.ok, false);
    if (!otherAssignment.ok) {
      assert.equal(otherAssignment.code, "invalid");
      assert.equal(otherAssignment.message, ASSIGNMENT_STUDENT_COPY.unknownAssignment);
    }
  });
});
