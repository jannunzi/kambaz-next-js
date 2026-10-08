"use client";

import { useState, useTransition } from "react";
import type { AssignmentCheckResult } from "@/lib/assignments/checks";
import { listRubricCriteria } from "@/lib/assignments/catalog";
import { criterionCoverage } from "@/lib/assignments/checkers";
import {
  gradeRowsFromResults,
  rowIsStaffDecided,
  withCustomPoints,
  withOverrideChecked,
  type CriterionGradeRow,
} from "@/lib/assignments/grade-rows";
import { finalGrade, finalGradeLine, type FinalGrade } from "@/lib/assignments/final-grade";
import type { AssignmentGradeView } from "@/lib/assignments/grade-rows";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";
import { type StaffStudentRow } from "@/lib/assignments/staff";
import type { AssignmentHubItem } from "@/lib/assignments/types";
import type { AssignmentSubmissionView } from "@/lib/assignments/submissions-store";
import { saveAssignmentGrade } from "../staff-actions";
import A1SubmissionForm, { type SubmissionGateReason } from "./A1SubmissionForm";
import AssignmentChecklist from "./AssignmentChecklist";
import { AssignmentViewer } from "./AssignmentViewer";
import StaffGraderNav from "./StaffGraderNav";
import StaffBatchTools from "./StaffBatchTools";

type RosterFlags = { unmatched?: boolean; duplicates?: number };

export default function A1WorkArea({
  serverUserId,
  authEnabled,
  ...props
}: {
  assignment: AssignmentHubItem;
  initialSubmission: AssignmentSubmissionView | null;
  initialGrade: AssignmentGradeView | null;
  serverUserId: string | null;
  authEnabled: boolean;
  canSubmit: boolean;
  showSubmissionStatus?: boolean;
  impersonating: boolean;
  gateReason: SubmissionGateReason;
  staffQueue?: StaffStudentRow[];
  selectedStudent?: StaffStudentRow | null;
  selectedSection?: string;
  selectedFilter?: string;
  /** The signed-in student's roster flags, computed the same way as the export. */
  studentRoster?: RosterFlags | null;
}) {
  return (
    <AssignmentViewer serverUserId={serverUserId} authEnabled={authEnabled}>
      {(viewerUserId) => (
        <A1WorkSession
          key={`${viewerUserId ?? "out"}:${props.selectedStudent?.key ?? "self"}:${props.initialGrade?.savedAt ?? "none"}:${props.initialSubmission?.updatedAt ?? "none"}:${props.initialSubmission?.lastCheckedAt ?? "none"}`}
          {...props}
          initialSubmission={
            viewerUserId === serverUserId ? props.initialSubmission : null
          }
          initialGrade={viewerUserId === serverUserId ? props.initialGrade : null}
          studentRoster={viewerUserId === serverUserId ? props.studentRoster : null}
        />
      )}
    </AssignmentViewer>
  );
}

function A1WorkSession({
  assignment,
  initialSubmission,
  initialGrade,
  canSubmit,
  showSubmissionStatus = false,
  impersonating,
  gateReason,
  staffQueue,
  selectedStudent,
  selectedSection,
  selectedFilter,
  studentRoster,
}: {
  assignment: AssignmentHubItem;
  initialSubmission: AssignmentSubmissionView | null;
  initialGrade: AssignmentGradeView | null;
  canSubmit: boolean;
  showSubmissionStatus?: boolean;
  impersonating: boolean;
  gateReason: SubmissionGateReason;
  staffQueue?: StaffStudentRow[];
  selectedStudent?: StaffStudentRow | null;
  selectedSection?: string;
  selectedFilter?: string;
  studentRoster?: RosterFlags | null;
}) {
  const staffMode = Boolean(selectedStudent);
  const criteriaForInit = assignment.rubric ? listRubricCriteria(assignment.rubric) : [];
  // Staff opening an ungraded submission start from its stored check run
  // (from Submit or "Re-run all and save"), so Save can record it as is.
  const storedResults =
    staffMode && !initialGrade && initialSubmission?.checkResults?.length
      ? initialSubmission.checkResults
      : null;
  const [submission, setSubmission] = useState(initialSubmission);
  const [deployUrl, setDeployUrl] = useState(initialSubmission?.vercelUrl ?? "");
  const [savedGrade, setSavedGrade] = useState(initialGrade);
  const [draft, setDraft] = useState<CriterionGradeRow[] | null>(() =>
    storedResults ? gradeRowsFromResults(criteriaForInit, storedResults) : null,
  );
  const [live, setLive] = useState(Boolean(storedResults));
  const [liveResults, setLiveResults] = useState<AssignmentCheckResult[] | null>(
    storedResults,
  );
  const [gradeNote, setGradeNote] = useState<string | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [pendingGrade, setPendingGrade] = useState(false);
  const [, startTransition] = useTransition();

  const criteria = assignment.rubric ? listRubricCriteria(assignment.rubric) : [];
  const displayRows = draft ?? savedGrade?.rows ?? [];
  const scored = displayRows.length > 0;
  const results = liveResults ?? (live ? [] : savedGrade?.checkResults ?? []);

  // Roster flags: the staff queue row, or the student's own (computed on the
  // server exactly as the export does). Unknown flags never count as ready.
  const roster: RosterFlags =
    staffMode && selectedStudent
      ? {
          unmatched: selectedStudent.unmatched,
          duplicates: selectedStudent.priorSubmissions?.length ?? 0,
        }
      : (studentRoster ?? { unmatched: true });
  // The saved grade, from stored data only (never a live run), so the page
  // shows the same grade and percentage as the staff view and export.
  const savedFinal: FinalGrade | null = assignment.rubric
    ? finalGrade({
        assignmentId: assignment.id,
        rubric: assignment.rubric,
        results: submission?.checkResults ?? [],
        staff: savedGrade
          ? { rows: savedGrade.rows, checkResults: savedGrade.checkResults }
          : null,
        roster,
      })
    : null;
  // What a Save would record right now (staff only).
  const draftFinal: FinalGrade | null =
    staffMode && draft && assignment.rubric
      ? finalGrade({
          assignmentId: assignment.id,
          rubric: assignment.rubric,
          results,
          staff: { rows: draft, checkResults: results },
          roster,
        })
      : null;

  function onResults(next: AssignmentCheckResult[]) {
    setLiveResults(next);
    // A new run resets the auto rows; manual items staff already set keep
    // their decision (the checker never grades them).
    setDraft((current) => {
      const kept = new Map(
        (current ?? savedGrade?.rows ?? [])
          .filter(
            (row) =>
              criterionCoverage(assignment.id, row.criterionId) === "manual" &&
              rowIsStaffDecided(row),
          )
          .map((row) => [row.criterionId, row]),
      );
      return gradeRowsFromResults(criteria, next).map(
        (row) => kept.get(row.criterionId) ?? row,
      );
    });
    setLive(true);
    setGradeNote(null);
    setGradeError(null);
  }

  function onClear() {
    setDraft(null);
    setLive(false);
    setLiveResults(null);
    setGradeNote(null);
    setGradeError(null);
  }

  function onOverride(criterionId: string, checked: boolean) {
    setDraft((current) => {
      const base = current ?? savedGrade?.rows ?? [];
      return base.map((row) =>
        row.criterionId === criterionId ? withOverrideChecked(row, checked) : row,
      );
    });
    setLive(true);
  }

  function onPoints(criterionId: string, points: number) {
    setDraft((current) => {
      const base = current ?? savedGrade?.rows ?? [];
      return base.map((row) =>
        row.criterionId === criterionId ? withCustomPoints(row, points) : row,
      );
    });
    setLive(true);
  }

  function onSaveGrade() {
    if (!selectedStudent || !draft) return;
    setPendingGrade(true);
    setGradeError(null);
    startTransition(async () => {
      const result = await saveAssignmentGrade({
        assignmentId: assignment.id,
        studentKey: selectedStudent.key,
        rows: draft,
        checkResults: liveResults ?? savedGrade?.checkResults ?? [],
      });
      setPendingGrade(false);
      if (!result.ok) {
        setGradeError(result.message);
        return;
      }
      setSavedGrade(result.grade);
      setDraft(null);
      setLive(false);
      setLiveResults(null);
      const saved = assignment.rubric
        ? finalGrade({
            assignmentId: assignment.id,
            rubric: assignment.rubric,
            results: result.grade.checkResults,
            staff: { rows: result.grade.rows, checkResults: result.grade.checkResults },
            roster,
          })
        : null;
      setGradeNote(
        saved && !saved.ready
          ? `Saved your progress. Not ready for Canvas yet: ${saved.reasons.join("; ")}. Run again does not change it.`
          : "Saved the grade. Run again does not change it.",
      );
    });
  }

  return (
    <>
      {staffQueue ? (
        <StaffGraderNav
          assignmentId={assignment.id}
          queue={staffQueue}
          selectedKey={selectedStudent?.key}
          selectedSection={selectedSection}
          selectedFilter={selectedFilter}
        />
      ) : null}
      {staffQueue && !impersonating ? (
        <StaffBatchTools assignmentId={assignment.id} />
      ) : null}
      {storedResults && submission?.lastCheckedAt ? (
        <p className="mb-3 font-sans text-sm text-neutral-700">
          Showing the stored check from {new Date(submission.lastCheckedAt).toLocaleString()}
          {submission.checkerVersion ? ` (checker ${submission.checkerVersion})` : ""}. Run checks again
          for a live result.
        </p>
      ) : null}

      {staffMode && selectedStudent && !selectedStudent.hasSubmission ? (
        <p className="rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950">
          {ASSIGNMENT_STUDENT_COPY.noSubmission}
        </p>
      ) : (
        <A1SubmissionForm
          key={`${selectedStudent?.key ?? "self"}:${submission?.updatedAt ?? "none"}`}
          assignmentId={assignment.id}
          initialSubmission={submission}
          canSubmit={canSubmit || staffMode}
          showSubmissionStatus={showSubmissionStatus && !staffMode}
          impersonating={impersonating}
          gateReason={canSubmit || staffMode ? null : gateReason}
          staffStudentKey={selectedStudent?.key}
          canSaveGrade={staffMode && !impersonating}
          saveGradeDisabled={!draft || pendingGrade}
          pendingGrade={pendingGrade}
          onClear={onClear}
          onSaveGrade={onSaveGrade}
          onResults={onResults}
          onSubmission={setSubmission}
          onDeployUrlChange={setDeployUrl}
          gradeLine={finalGradeLine(savedFinal, Boolean(savedGrade))}
        />
      )}

      {gradeNote ? (
        <p className="mb-3 font-sans text-sm text-emerald-800">{gradeNote}</p>
      ) : null}
      {gradeError ? (
        <p className="mb-3 font-sans text-sm text-amber-800">{gradeError}</p>
      ) : null}

      <AssignmentChecklist
        assignment={assignment}
        rows={displayRows}
        scored={scored}
        live={live}
        savedRows={savedGrade?.rows ?? null}
        results={results}
        audience={staffMode ? "staff" : "student"}
        savedPoints={
          savedGrade
            ? {
                earnedPoints: savedGrade.earnedPoints,
                totalPoints: savedGrade.totalPoints,
                savedAt: savedGrade.savedAt,
                gradedByEmail: savedGrade.gradedByEmail,
              }
            : null
        }
        final={savedFinal}
        draftFinal={draftFinal}
        vercelUrl={deployUrl}
        onOverride={staffMode ? onOverride : undefined}
        onPoints={staffMode ? onPoints : undefined}
      />
    </>
  );
}
