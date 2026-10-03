"use client";

import { useState, useTransition } from "react";
import type { AssignmentCheckResult } from "@/lib/assignments/checks";
import type { AssignmentSubmissionView } from "@/lib/assignments/submissions-store";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";
import {
  a1CheckAction,
  a1SubmissionFormState,
  submissionGateCopy,
  type SubmissionGateReason,
} from "@/lib/assignments/submission-form";
import {
  showSubmittedConfirmation,
  submitActionLabel,
  submitFailureCopy,
  type SubmitFailureCopy,
} from "@/lib/assignments/submission-status";
import {
  runAssignmentChecks,
  runPublicAssignmentChecks,
  saveAssignmentSubmission,
} from "../submission-actions";
import { runStaffAssignmentChecks } from "../staff-actions";
import SubmittedConfirmation from "./SubmittedConfirmation";

export type { SubmissionGateReason };

function formatSavedAt(iso?: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString();
}

export default function A1SubmissionForm({
  assignmentId,
  initialSubmission,
  canSubmit,
  showSubmissionStatus = false,
  impersonating = false,
  gateReason = null,
  staffStudentKey,
  canSaveGrade = false,
  saveGradeDisabled = true,
  pendingGrade = false,
  onClear,
  onSaveGrade,
  onResults,
  onSubmission,
  onDeployUrlChange,
}: {
  assignmentId: string;
  initialSubmission: AssignmentSubmissionView | null;
  canSubmit: boolean;
  /** Roster-matched students see Submitted / Graded. Everyone else does not. */
  showSubmissionStatus?: boolean;
  impersonating?: boolean;
  gateReason?: SubmissionGateReason;
  staffStudentKey?: string;
  canSaveGrade?: boolean;
  saveGradeDisabled?: boolean;
  pendingGrade?: boolean;
  onClear?: () => void;
  onSaveGrade?: () => void;
  onResults?: (results: AssignmentCheckResult[]) => void;
  onSubmission?: (submission: AssignmentSubmissionView) => void;
  onDeployUrlChange?: (url: string) => void;
}) {
  const [githubUrl, setGithubUrl] = useState(initialSubmission?.githubUrl ?? "");
  const [vercelUrl, setVercelUrl] = useState(initialSubmission?.vercelUrl ?? "");
  const [submission, setSubmission] = useState(initialSubmission);
  const [savedToAccount, setSavedToAccount] = useState(
    Boolean(initialSubmission),
  );
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<SubmitFailureCopy | null>(null);
  const [pendingAction, setPendingAction] = useState<"save" | "check" | null>(
    null,
  );
  const [, startTransition] = useTransition();
  const staffReview = Boolean(staffStudentKey);
  const formState = a1SubmissionFormState({ canSubmit, gateReason });
  const checkAction = a1CheckAction({ staffReview, form: formState });
  const saveGate =
    formState.mode === "check" ? submissionGateCopy(formState.gateReason) : null;

  const savedAt = savedToAccount ? formatSavedAt(submission?.updatedAt) : null;
  const checkedAt = formatSavedAt(submission?.lastCheckedAt);
  const hasStoredSubmission = Boolean(savedToAccount && submission);
  const showSubmitted =
    showSubmissionStatus &&
    showSubmittedConfirmation({
      hasSubmission: hasStoredSubmission,
      submitFailed: Boolean(submitError),
    });

  function applySave(
    result: Awaited<ReturnType<typeof saveAssignmentSubmission>>,
  ) {
    if (!result.ok) {
      setSubmitError(
        submitFailureCopy({
          hasSubmission: hasStoredSubmission,
          submittedAt: submission?.updatedAt,
          detail: result.message,
        }),
      );
      setError(null);
      setNote(null);
      return;
    }
    setSubmitError(null);
    setError(null);
    setGithubUrl(result.submission.githubUrl);
    setVercelUrl(result.submission.vercelUrl);
    onDeployUrlChange?.(result.submission.vercelUrl);
    setSubmission(result.submission);
    setSavedToAccount(result.persisted);
    onSubmission?.(result.submission);
    setNote(result.persisted ? null : ASSIGNMENT_STUDENT_COPY.savedButNotPersisted);
  }

  function applyRun(result: {
    ok: boolean;
    message?: string;
    submission?: { checkResults?: AssignmentCheckResult[] };
  }) {
    if (!result.ok) {
      setError(result.message ?? "Could not run checks.");
      setNote(null);
      return;
    }
    setError(null);
    onResults?.(result.submission?.checkResults ?? []);
    setNote(
      staffReview
        ? "Checks finished. Save records the grade. Running checks again does not change a saved grade."
        : "Checks finished. These results stay on this page until you Clear or leave. They are not submitted.",
    );
  }

  function onSaveUrls() {
    setPendingAction("save");
    setError(null);
    startTransition(async () => {
      const result = await saveAssignmentSubmission({
        assignmentId,
        githubUrl,
        vercelUrl,
      });
      applySave(result);
      setPendingAction(null);
    });
  }

  function onRunChecks() {
    setPendingAction("check");
    setError(null);
    startTransition(async () => {
      const result =
        checkAction === "staff" && staffStudentKey
          ? await runStaffAssignmentChecks({
              assignmentId,
              studentKey: staffStudentKey,
              githubUrl,
              vercelUrl,
            })
          : checkAction === "public"
            ? await runPublicAssignmentChecks({
                assignmentId,
                githubUrl,
                vercelUrl,
              })
            : await runAssignmentChecks({
                assignmentId,
                githubUrl,
                vercelUrl,
              });
      applyRun(result);
      setPendingAction(null);
    });
  }

  return (
    <section className="mb-6 rounded-lg border border-neutral-300 bg-white p-4 shadow-sm">
      <h2 className="mt-0 mb-1 font-sans text-xl font-semibold tracking-tight">
        {staffReview ? "Student URLs" : "Submit URLs"}
      </h2>
      {staffReview ? null : (
        <p className="mt-0 mb-2 text-neutral-800">
          {ASSIGNMENT_STUDENT_COPY.urlSubmitWhen}
        </p>
      )}
      <p className="mt-0 text-neutral-800">
        {assignmentId === "a2"
          ? "Paste the a2 branch preview URL (the hostname contains -git-a2-) and the GitHub URL for that branch (…/tree/a2). Checks open that branch, then fetch Labs, Lab 2, the Tailwind page, and Kambaz screens."
          : ASSIGNMENT_STUDENT_COPY.checkInstructions}
      </p>

      {impersonating ? (
        <p className="rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950">
          {ASSIGNMENT_STUDENT_COPY.impersonationBanner}
        </p>
      ) : null}

      {!staffReview && submitError ? (
        <div
          role="alert"
          className="mb-3 rounded-lg border-2 border-red-600 bg-red-50 px-4 py-3 font-sans text-sm text-red-950"
        >
          <p className="m-0 font-semibold">{submitError.title}</p>
          <p className="mb-0 mt-1">{submitError.body}</p>
        </div>
      ) : null}
      {!staffReview && showSubmitted && submission ? (
        <SubmittedConfirmation submission={submission} />
      ) : null}

      <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            onRunChecks();
          }}
        >
          <div>
            <label
              htmlFor={`${assignmentId}-github-url`}
              className="font-sans text-sm font-semibold"
            >
              {assignmentId === "a2"
                ? "GitHub a2 branch URL (…/tree/a2)"
                : "Public GitHub repository URL (optional)"}
            </label>
            <input
              id={`${assignmentId}-github-url`}
              name="githubUrl"
              type="url"
              inputMode="url"
              autoComplete="url"
              required={assignmentId === "a2"}
              placeholder={
                assignmentId === "a2"
                  ? "https://github.com/yourname/webdev-client/tree/a2"
                  : "https://github.com/yourname/webdev-client"
              }
              className="mt-1 box-border w-full rounded border border-neutral-400 bg-white px-3 py-2 font-sans text-sm"
              value={githubUrl}
              onChange={(event) => setGithubUrl(event.target.value)}
              disabled={pendingAction !== null}
            />
            {githubUrl ? (
              <p className="mb-0 mt-1 font-sans text-sm">
                <a href={githubUrl} target="_blank" rel="noreferrer">
                  Open GitHub
                </a>
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor={`${assignmentId}-vercel-url`}
              className="font-sans text-sm font-semibold"
            >
              Public Vercel deployment URL
            </label>
            <input
              id={`${assignmentId}-vercel-url`}
              name="vercelUrl"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://your-app.vercel.app"
              className="mt-1 box-border w-full rounded border border-neutral-400 bg-white px-3 py-2 font-sans text-sm"
              value={vercelUrl}
              onChange={(event) => {
                setVercelUrl(event.target.value);
                onDeployUrlChange?.(event.target.value);
              }}
              disabled={pendingAction !== null}
            />
            {vercelUrl ? (
              <p className="mb-0 mt-1 font-sans text-sm">
                <a href={vercelUrl} target="_blank" rel="noreferrer">
                  Open Vercel deploy
                </a>
              </p>
            ) : null}
          </div>
          {saveGate ? (
            <div
              role="status"
              className="rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950"
            >
              <p className="m-0 font-semibold">{saveGate.title}</p>
              <p className="mb-0 mt-1">{saveGate.body}</p>
            </div>
          ) : null}
          {checkAction === "account" && !staffReview ? (
            <button
              type="button"
              className="rounded border border-neutral-800 bg-white px-3 py-2 font-sans text-sm hover:bg-neutral-50 disabled:opacity-60"
              disabled={pendingAction !== null}
              onClick={onSaveUrls}
            >
              {submitActionLabel({
                hasSubmission: hasStoredSubmission,
                pending: pendingAction === "save",
              })}
            </button>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded border border-neutral-800 bg-white px-3 py-2 font-sans text-sm hover:bg-neutral-50 disabled:opacity-60"
              disabled={pendingAction !== null || pendingGrade}
              onClick={onClear}
            >
              Clear
            </button>
            {canSaveGrade ? (
              <button
                type="button"
                className="rounded border border-neutral-800 bg-neutral-800 px-3 py-2 font-sans text-sm text-white hover:bg-neutral-700 disabled:opacity-60"
                disabled={saveGradeDisabled || pendingAction !== null}
                onClick={onSaveGrade}
              >
                {pendingGrade ? "Saving…" : "Save"}
              </button>
            ) : null}
            <button
              type="submit"
              className="rounded border border-neutral-800 bg-neutral-800 px-3 py-2 font-sans text-sm text-white hover:bg-neutral-700 disabled:opacity-60"
              disabled={pendingAction !== null || pendingGrade}
            >
              {pendingAction === "check" ? "Running…" : "Run"}
            </button>
          </div>
        </form>

      {staffReview && savedAt ? (
        <p className="mb-1 mt-3 font-sans text-sm text-neutral-700">
          Last saved {savedAt}
          {checkedAt ? ` · Last checked ${checkedAt}` : null}
        </p>
      ) : checkedAt ? (
        <p className="mb-1 mt-3 font-sans text-sm text-neutral-700">
          Last checked {checkedAt}
        </p>
      ) : null}
      {note ? (
        <p className="mb-2 mt-2 font-sans text-sm text-emerald-800">{note}</p>
      ) : null}
      {error ? (
        <p className="mb-2 mt-2 font-sans text-sm text-amber-800">{error}</p>
      ) : null}
    </section>
  );
}
