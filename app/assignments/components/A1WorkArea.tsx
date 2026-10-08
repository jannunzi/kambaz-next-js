"use client";

import { useState, useTransition } from "react";
import type { AssignmentCheckResult } from "@/lib/assignments/checks";
import { listRubricCriteria } from "@/lib/assignments/catalog";
import {
  gradeRowsFromResults,
  withCustomPoints,
  withOverrideChecked,
  type CriterionGradeRow,
} from "@/lib/assignments/grade-rows";
import type { AssignmentGradeView } from "@/lib/assignments/grade-rows";
import type { ReopenPanelState, StudentLockView } from "@/lib/assignments/lock";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";
import { regradeStaffNote } from "@/lib/assignments/submission-status";
import type { StaffStudentRow } from "@/lib/assignments/staff";
import type { AssignmentHubItem } from "@/lib/assignments/types";
import type { AssignmentSubmissionView } from "@/lib/assignments/submissions-store";
import { saveAssignmentGrade } from "../staff-actions";
import A1SubmissionForm, { type SubmissionGateReason } from "./A1SubmissionForm";
import ReopenSubmissionPanel from "./ReopenSubmissionPanel";
import AssignmentChecklist from "./AssignmentChecklist";
import { AssignmentViewer } from "./AssignmentViewer";
import StaffGraderNav from "./StaffGraderNav";

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
  reopenFilter?: string;
  lockView?: StudentLockView;
  reopenPanel?: ReopenPanelState | null;
}) {
  return (
    <AssignmentViewer serverUserId={serverUserId} authEnabled={authEnabled}>
      {(viewerUserId) => (
        <A1WorkSession
          key={`${viewerUserId ?? "out"}:${props.selectedStudent?.key ?? "self"}:${props.initialGrade?.savedAt ?? "none"}:${props.initialSubmission?.updatedAt ?? "none"}:${props.lockView?.kind ?? "open"}`}
          {...props}
          initialSubmission={
            viewerUserId === serverUserId ? props.initialSubmission : null
          }
          initialGrade={viewerUserId === serverUserId ? props.initialGrade : null}
          lockView={
            viewerUserId === serverUserId ? props.lockView : { kind: "open" }
          }
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
  reopenFilter,
  lockView = { kind: "open" },
  reopenPanel = null,
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
  reopenFilter?: string;
  lockView?: StudentLockView;
  reopenPanel?: ReopenPanelState | null;
}) {
  const staffMode = Boolean(selectedStudent);
  const [submission, setSubmission] = useState(initialSubmission);
  const [deployUrl, setDeployUrl] = useState(initialSubmission?.vercelUrl ?? "");
  const [savedGrade, setSavedGrade] = useState(initialGrade);
  const [draft, setDraft] = useState<CriterionGradeRow[] | null>(null);
  const [live, setLive] = useState(false);
  const [liveResults, setLiveResults] = useState<AssignmentCheckResult[] | null>(null);
  const [gradeNote, setGradeNote] = useState<string | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [pendingGrade, setPendingGrade] = useState(false);
  const [, startTransition] = useTransition();

  const criteria = assignment.rubric ? listRubricCriteria(assignment.rubric) : [];
  const displayRows = draft ?? savedGrade?.rows ?? [];
  const scored = displayRows.length > 0;
  const results = liveResults ?? (live ? [] : savedGrade?.checkResults ?? []);

  function onResults(next: AssignmentCheckResult[]) {
    setLiveResults(next);
    setDraft(gradeRowsFromResults(criteria, next));
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
      setGradeNote("Saved the grade. Run again does not change it.");
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
          reopenFilter={reopenFilter}
        />
      ) : null}

      {staffMode && selectedStudent && reopenPanel ? (
        <ReopenSubmissionPanel
          assignmentId={assignment.id}
          studentKey={selectedStudent.key}
          studentName={selectedStudent.name}
          panel={reopenPanel}
          canReopen={!impersonating}
        />
      ) : null}
      {staffMode && submission?.regradeResubmission ? (
        <p className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 font-sans text-sm text-sky-950">
          {regradeStaffNote(submission)}
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
          lockView={lockView}
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
        vercelUrl={deployUrl}
        onOverride={staffMode ? onOverride : undefined}
        onPoints={staffMode ? onPoints : undefined}
      />
    </>
  );
}
