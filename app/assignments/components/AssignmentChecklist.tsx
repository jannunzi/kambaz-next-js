"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import { criterionCoverage } from "@/lib/assignments/checkers";
import { listRubricCriteria, nestRubricCriteria } from "@/lib/assignments/catalog";
import type { AssignmentCheckResult } from "@/lib/assignments/checks";
import { latestResultByCriterion } from "@/lib/assignments/checks";
import {
  GRADE_ROW_COPY,
  changedCriterionIds,
  gradePoints,
  rowPresentation,
  studentAutoPoints,
  type CriterionGradeRow,
  type GradeAudience,
} from "@/lib/assignments/grade-rows";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";
import type { AssignmentHubItem, RubricCriterion } from "@/lib/assignments/types";
import { criterionVerifyUrl } from "@/lib/assignments/verify-urls";
import { supportsUrlSubmission } from "@/lib/assignments/access";

function DeployTitle({
  href,
  children,
}: {
  href: string | null;
  children: ReactNode;
}) {
  if (!href) return <>{children}</>;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="underline">
      {children}
    </a>
  );
}

function isManualCriterion(assignmentId: string, criterionId: string): boolean {
  return criterionCoverage(assignmentId, criterionId) !== "auto";
}

function Legend({
  audience,
  showChanged,
}: {
  audience: GradeAudience;
  showChanged: boolean;
}) {
  return (
    <ul className="mb-0 mt-3 flex list-none flex-wrap gap-x-4 gap-y-2 p-0 font-sans text-sm text-neutral-900">
      <li className="inline-flex items-center gap-2">
        <span className="inline-block size-3 border border-emerald-700 bg-emerald-50" aria-hidden />
        <span>✓ {GRADE_ROW_COPY.fullCredit}</span>
      </li>
      <li className="inline-flex items-center gap-2">
        <span className="inline-block size-3 border border-red-700 bg-red-50" aria-hidden />
        <span>✗ {GRADE_ROW_COPY.noCredit}</span>
      </li>
      {audience === "staff" ? (
        <li className="inline-flex items-center gap-2">
          <span className="inline-block size-3 border border-amber-700 bg-amber-100" aria-hidden />
          <span>{GRADE_ROW_COPY.override}</span>
        </li>
      ) : null}
      {showChanged ? (
        <li className="inline-flex items-center gap-2">
          <span
            className="inline-block size-3 bg-white shadow-[inset_4px_0_0_0_#075985] ring-2 ring-sky-800"
            aria-hidden
          />
          <span>{GRADE_ROW_COPY.changedSinceGraded}</span>
        </li>
      ) : null}
    </ul>
  );
}

function CriterionRow({
  row,
  criterion,
  audience,
  scored,
  changed,
  manual,
  result,
  vercelUrl,
  onOverride,
  onPoints,
}: {
  row: CriterionGradeRow;
  criterion: RubricCriterion;
  audience: GradeAudience;
  scored: boolean;
  changed: boolean;
  manual: boolean;
  result?: AssignmentCheckResult;
  vercelUrl?: string;
  onOverride?: (criterionId: string, checked: boolean) => void;
  onPoints?: (criterionId: string, points: number) => void;
}) {
  const presentation = rowPresentation({
    row,
    scored,
    changed,
    audience,
    manual,
  });
  const autoId = `auto-${criterion.id}`;
  const overrideId = `override-${criterion.id}`;
  const pointsId = `points-${criterion.id}`;
  const verifyHref = criterionVerifyUrl(vercelUrl, criterion.id);
  const staff = audience === "staff";
  const showAuto = scored && (staff || !manual);
  return (
    <div
      className={`rounded-md border px-3 py-3 ${presentation.className}`}
      data-grade-fill={presentation.fill}
      data-grade-changed={presentation.changed ? "true" : "false"}
    >
      <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
        {showAuto ? (
          <label htmlFor={autoId} className="inline-flex items-center gap-2 font-sans text-sm font-semibold">
            <input
              id={autoId}
              type="checkbox"
              className="size-4 accent-emerald-800"
              checked={scored && row.autoPassed}
              disabled
              readOnly
              aria-readonly="true"
            />
            {GRADE_ROW_COPY.auto}
          </label>
        ) : null}
        {staff && scored ? (
          <label htmlFor={overrideId} className="inline-flex items-center gap-2 font-sans text-sm font-semibold">
            <input
              id={overrideId}
              type="checkbox"
              className="size-4 accent-amber-700"
              checked={row.overridePassed}
              onChange={(event) => onOverride?.(criterion.id, event.target.checked)}
            />
            {GRADE_ROW_COPY.override}
          </label>
        ) : null}
        {staff && scored ? (
          <label htmlFor={pointsId} className="inline-flex items-center gap-2 font-sans text-sm">
            Points
            <input
              id={pointsId}
              type="number"
              min={0}
              max={row.maxPoints}
              step={1}
              inputMode="numeric"
              className="w-16 rounded border border-neutral-500 bg-white px-2 py-1 text-neutral-950"
              value={row.points}
              onChange={(event) => {
                const next = event.target.value === "" ? 0 : Number(event.target.value);
                onPoints?.(criterion.id, next);
              }}
            />
            <span>/ {row.maxPoints}</span>
          </label>
        ) : null}
        {presentation.label ? (
          <span className="font-sans text-sm font-semibold">
            {presentation.mark && presentation.mark !== "override" ? `${presentation.mark} ` : null}
            {presentation.label}
          </span>
        ) : null}
        {presentation.changed ? (
          <span className="rounded bg-sky-100 px-2 py-0.5 font-sans text-xs font-semibold uppercase tracking-wide text-sky-950 ring-1 ring-sky-800">
            {GRADE_ROW_COPY.changed}
          </span>
        ) : null}
      </div>
      <p className="mb-1 mt-2 font-sans text-base font-semibold text-inherit">
        <DeployTitle href={verifyHref}>{criterion.label}</DeployTitle>
        {criterion.onYourOwn ? (
          <span className="ml-2 font-sans text-xs font-medium uppercase tracking-wide">
            On your own
          </span>
        ) : null}
        {criterion.withAI ? (
          <span className="ml-2 font-sans text-xs font-medium uppercase tracking-wide">
            With AI
          </span>
        ) : null}
      </p>
      {manual && audience === "student" ? (
        <p className="mb-1 font-sans text-sm">{ASSIGNMENT_STUDENT_COPY.manualCheckHint}</p>
      ) : null}
      <p className="mb-1 text-sm">{criterion.description}</p>
      {result && !result.skipped && result.message ? (
        <p className="mb-1 font-sans text-sm">{result.message}</p>
      ) : null}
      <p className="mb-0 font-sans text-sm">
        <span className="font-medium">{criterion.points} pts</span>
        {criterion.bookHref ? (
          <>
            {" · "}
            <Link href={criterion.bookHref}>{criterion.bookLabel ?? "Book section"}</Link>
          </>
        ) : null}
        {verifyHref ? (
          <>
            {" · "}
            <a href={verifyHref} target="_blank" rel="noreferrer">
              Open on deploy
            </a>
          </>
        ) : null}
      </p>
    </div>
  );
}

export default function AssignmentChecklist({
  assignment,
  rows,
  scored,
  live,
  savedRows = null,
  results = [],
  audience,
  savedPoints = null,
  vercelUrl,
  onOverride,
  onPoints,
}: {
  assignment: AssignmentHubItem;
  rows: CriterionGradeRow[];
  scored: boolean;
  live: boolean;
  savedRows?: CriterionGradeRow[] | null;
  results?: AssignmentCheckResult[];
  audience: GradeAudience;
  savedPoints?: { earnedPoints: number; totalPoints: number; savedAt?: string; gradedByEmail?: string } | null;
  vercelUrl?: string;
  onOverride?: (criterionId: string, checked: boolean) => void;
  onPoints?: (criterionId: string, points: number) => void;
}) {
  const rubric = assignment.rubric;
  const criteria = useMemo(
    () => (rubric ? listRubricCriteria(rubric) : []),
    [rubric],
  );
  const byId = useMemo(() => {
    const map = new Map<string, CriterionGradeRow>();
    for (const row of rows) map.set(row.criterionId, row);
    return map;
  }, [rows]);
  const manualIds = useMemo(() => {
    return new Set(
      criteria
        .filter((criterion) => isManualCriterion(assignment.id, criterion.id))
        .map((criterion) => criterion.id),
    );
  }, [assignment.id, criteria]);
  const changed = useMemo(
    () => new Set(changedCriterionIds(rows, savedRows, live, audience)),
    [rows, savedRows, live, audience],
  );
  const autoByCriterion = useMemo(() => latestResultByCriterion(results), [results]);
  const staffPoints = gradePoints(rows);
  const studentPoints = studentAutoPoints(rows, manualIds);
  const headerPoints = audience === "staff" ? staffPoints : studentPoints;

  if (!rubric) return null;

  function rowFor(criterion: RubricCriterion): CriterionGradeRow {
    return (
      byId.get(criterion.id) ?? {
        criterionId: criterion.id,
        maxPoints: criterion.points,
        autoPassed: false,
        overridePassed: false,
        points: 0,
      }
    );
  }

  return (
    <div>
      {supportsUrlSubmission(assignment.id) && audience === "student" ? (
        <p className="mb-3 rounded-lg border border-neutral-300 bg-white px-4 py-3 font-sans text-sm text-neutral-800">
          {ASSIGNMENT_STUDENT_COPY.urlSubmitWhen}
        </p>
      ) : null}
      <div className="mb-4 rounded-lg border border-neutral-300 bg-white px-4 py-3 font-sans text-neutral-950 shadow-sm">
        <p className="m-0 text-base font-semibold tracking-tight">
          {scored
            ? audience === "staff"
              ? `${headerPoints.earnedPoints} / ${headerPoints.totalPoints} pts`
              : `Auto checks ${headerPoints.earnedPoints} / ${headerPoints.totalPoints} pts`
            : supportsUrlSubmission(assignment.id)
              ? "No checks yet. Run to score this page. Checkmarks are not saved."
              : "Checked by staff at grading. This page does not save checkmarks or award points."}
        </p>
        {savedPoints ? (
          <p className="mb-0 mt-1 text-sm">
            Staff grade {savedPoints.earnedPoints} / {savedPoints.totalPoints} pts
            {savedPoints.gradedByEmail ? ` · saved by ${savedPoints.gradedByEmail}` : ""}
            {savedPoints.savedAt
              ? ` · ${new Date(savedPoints.savedAt).toLocaleString()}`
              : ""}
          </p>
        ) : null}
        {live && savedPoints && audience === "staff" ? (
          <p className="mb-0 mt-1 text-sm font-semibold">
            Saved {savedPoints.earnedPoints} / {savedPoints.totalPoints} pts · This run{" "}
            {staffPoints.earnedPoints} / {staffPoints.totalPoints} pts
          </p>
        ) : null}
        {scored ? <Legend audience={audience} showChanged={Boolean(savedPoints)} /> : null}
        <p className="mb-0 mt-2 text-sm text-neutral-800">
          {audience === "staff"
            ? "Auto is the checker result and cannot be edited. Override and points are saved only when you click Save. Run does not change a saved grade."
            : ASSIGNMENT_STUDENT_COPY.checksNotSaved}
        </p>
      </div>

      {rubric.groups.map((group) => {
        const groupRows = group.criteria.map(rowFor);
        const groupPoints =
          audience === "staff"
            ? gradePoints(groupRows)
            : studentAutoPoints(groupRows, manualIds);
        return (
          <section
            key={group.id}
            className="mb-6 rounded-lg border border-neutral-300 bg-white p-4 text-neutral-950 shadow-sm"
          >
            <h2 className="mt-0 mb-1 font-sans text-xl font-semibold tracking-tight">
              {group.title}
            </h2>
            {scored ? (
              <p className="mt-0 mb-3 font-sans text-sm text-neutral-700">
                {groupPoints.earnedPoints} / {groupPoints.totalPoints} pts
              </p>
            ) : null}
            {group.intro ? <p className="mt-0 text-neutral-800">{group.intro}</p> : null}
            <GroupList
              criteria={group.criteria}
              audience={audience}
              scored={scored}
              changed={changed}
              manualIds={manualIds}
              autoByCriterion={autoByCriterion}
              vercelUrl={vercelUrl}
              rowFor={rowFor}
              onOverride={onOverride}
              onPoints={onPoints}
            />
          </section>
        );
      })}
    </div>
  );
}

function GroupList({
  criteria,
  audience,
  scored,
  changed,
  manualIds,
  autoByCriterion,
  vercelUrl,
  rowFor,
  onOverride,
  onPoints,
}: {
  criteria: RubricCriterion[];
  audience: GradeAudience;
  scored: boolean;
  changed: Set<string>;
  manualIds: Set<string>;
  autoByCriterion: Map<string, AssignmentCheckResult>;
  vercelUrl?: string;
  rowFor: (criterion: RubricCriterion) => CriterionGradeRow;
  onOverride?: (criterionId: string, checked: boolean) => void;
  onPoints?: (criterionId: string, points: number) => void;
}) {
  const blocks = nestRubricCriteria(criteria);
  const hasNesting = blocks.some((block) => block.type === "nested");

  function renderRow(criterion: RubricCriterion) {
    return (
      <CriterionRow
        row={rowFor(criterion)}
        criterion={criterion}
        audience={audience}
        scored={scored}
        changed={changed.has(criterion.id)}
        manual={manualIds.has(criterion.id)}
        result={autoByCriterion.get(criterion.id)}
        vercelUrl={vercelUrl}
        onOverride={onOverride}
        onPoints={onPoints}
      />
    );
  }

  if (!hasNesting) {
    return (
      <ul className="m-0 list-none space-y-3 p-0">
        {criteria.map((criterion) => (
          <li key={criterion.id}>{renderRow(criterion)}</li>
        ))}
      </ul>
    );
  }

  return (
    <ol className="m-0 list-decimal space-y-4 pl-6">
      {blocks.map((block) =>
        block.type === "nested" ? (
          <li key={block.parentLabel}>
            <div className="font-sans text-base font-semibold tracking-tight">
              <DeployTitle
                href={criterionVerifyUrl(vercelUrl, block.rows[0]?.id ?? "")}
              >
                {block.parentLabel}
              </DeployTitle>
            </div>
            <ol type="a" className="mt-2 mb-0 list-[lower-alpha] space-y-3 pl-5">
              {block.rows.map((criterion) => (
                <li key={criterion.id}>{renderRow(criterion)}</li>
              ))}
            </ol>
          </li>
        ) : (
          <li key={block.row.id} className="list-none">
            {renderRow(block.row)}
          </li>
        ),
      )}
    </ol>
  );
}
