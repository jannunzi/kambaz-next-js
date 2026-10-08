"use client";

import { useRouter } from "next/navigation";
import { formatPointsPercent } from "@/lib/assignments/grade";
import {
  adjacentStaffStudentKeys,
  countStaffGradeFilters,
  filterStaffQueueByReopen,
  filterStaffQueueBySection,
  filterStaffQueueByStatus,
  findStaffStudent,
  hasStaffGradeSave,
  listStaffQueueSections,
  priorSubmissionLabel,
  resolveStaffGradeFilter,
  resolveStaffReopenFilter,
  resolveStaffSectionFilter,
  STAFF_GRADE_FILTERS,
  staffGradeFilterLabel,
  staffGraderHref,
  type StaffGradeFilter,
  type StaffStudentRow,
} from "@/lib/assignments/staff";

/** Closed dropdown. Tailwind only; no size and no multiple. */
const staffSelectClass =
  "mt-1 box-border block h-10 w-full truncate rounded border border-neutral-400 bg-white px-3 font-normal";

function studentStatus(row: StaffStudentRow): string {
  if (row.unmatched) return "unmatched";
  if (!row.hasSubmission) return "not submitted";
  if (hasStaffGradeSave(row.staffGrade)) return "graded";
  return "ungraded";
}

function studentOptionLabel(row: StaffStudentRow): string {
  const bits = [row.name, studentStatus(row)];
  if (row.regradeResubmission) bits.push("regrade");
  if (row.reopen) bits.push(row.reopen.label);
  return bits.join(" · ");
}

function selectedScore(row: StaffStudentRow): string {
  if (!hasStaffGradeSave(row.staffGrade) || !row.staffGrade) return "";
  const score = formatPointsPercent(
    row.staffGrade.earnedPoints,
    row.staffGrade.totalPoints,
  );
  return score === "—" ? "" : score;
}

export default function StaffGraderNav({
  assignmentId,
  queue,
  selectedKey,
  selectedSection,
  selectedFilter,
  reopenFilter,
}: {
  assignmentId: string;
  queue: StaffStudentRow[];
  selectedKey?: string;
  selectedSection?: string;
  selectedFilter?: string;
  reopenFilter?: string;
}) {
  const router = useRouter();
  const sections = listStaffQueueSections(queue);
  const section = resolveStaffSectionFilter(selectedSection, sections);
  const filter: StaffGradeFilter = resolveStaffGradeFilter(selectedFilter);
  const reopen = resolveStaffReopenFilter(reopenFilter);
  const sectionQueue = filterStaffQueueBySection(queue, section);
  const counts = countStaffGradeFilters(sectionQueue);
  const visible = filterStaffQueueByReopen(
    filterStaffQueueByStatus(sectionQueue, filter),
    reopen,
  );
  const reopenedRows = visible.filter((row) => row.reopen);
  const { previous, next, index } = adjacentStaffStudentKeys(
    visible,
    selectedKey,
  );
  const submitted = visible.filter((row) => row.hasSubmission).length;
  const selectedRow =
    findStaffStudent(visible, selectedKey) ?? findStaffStudent(queue, selectedKey);
  const score = selectedRow ? selectedScore(selectedRow) : "";
  const prior = selectedRow ? priorSubmissionLabel(selectedRow.priorSubmissions) : "";

  function go(
    key: string | null,
    nextSection = section,
    nextFilter: StaffGradeFilter = filter,
    nextReopen = reopen,
  ) {
    router.push(
      staffGraderHref(assignmentId, {
        section: nextSection,
        student: key,
        filter: nextFilter,
        reopen: nextReopen,
      }),
    );
  }

  function onSectionChange(value: string) {
    const nextSection = value || undefined;
    const nextQueue = filterStaffQueueByReopen(
      filterStaffQueueByStatus(
        filterStaffQueueBySection(queue, nextSection),
        filter,
      ),
      reopen,
    );
    const keep = findStaffStudent(nextQueue, selectedKey)?.key ?? null;
    go(keep, nextSection, filter, reopen);
  }

  function onFilterChange(value: string) {
    const nextFilter = resolveStaffGradeFilter(value);
    const nextQueue = filterStaffQueueByReopen(
      filterStaffQueueByStatus(sectionQueue, nextFilter),
      reopen,
    );
    const keep = findStaffStudent(nextQueue, selectedKey)?.key ?? null;
    go(keep, section, nextFilter, reopen);
  }

  function onReopenFilterChange(value: string) {
    const nextReopen = resolveStaffReopenFilter(value);
    const nextQueue = filterStaffQueueByReopen(
      filterStaffQueueByStatus(sectionQueue, filter),
      nextReopen,
    );
    const keep = findStaffStudent(nextQueue, selectedKey)?.key ?? null;
    go(keep, section, filter, nextReopen);
  }

  if (queue.length === 0) {
    return (
      <section className="mb-6 rounded-lg border border-neutral-300 bg-white p-4 font-sans shadow-sm">
        <h2 className="mt-0 mb-1 text-lg font-semibold">Staff grading</h2>
        <p className="mb-0 text-sm text-neutral-700">
          No roster students or submissions are available yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-6 rounded-lg border border-sky-300 bg-sky-50 p-4 font-sans shadow-sm">
      <h2 className="mt-0 mb-1 text-lg font-semibold text-sky-950">
        Staff grading
      </h2>
      <p className="mt-0 mb-3 text-sm text-sky-950">
        {submitted} of {visible.length} students have a submitted Vercel URL.
        {selectedKey && index >= 0
          ? ` Viewing ${index + 1} of ${visible.length}.`
          : " Select a student to review their deploy."}
      </p>
      <div className="flex flex-nowrap items-end gap-2">
        <label className="w-52 shrink-0 text-sm font-semibold">
          Section
          <select
            className={staffSelectClass}
            value={section ?? ""}
            onChange={(event) => onSectionChange(event.target.value)}
          >
            <option value="">All sections</option>
            {sections.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label
          htmlFor="staff-show-filter"
          className="w-52 shrink-0 text-sm font-semibold"
        >
          Show
          <select
            id="staff-show-filter"
            className={staffSelectClass}
            value={filter}
            onChange={(event) => onFilterChange(event.target.value)}
          >
            {STAFF_GRADE_FILTERS.map((id) => (
              <option key={id} value={id}>
                {staffGradeFilterLabel(id, counts[id])}
              </option>
            ))}
          </select>
        </label>
        <label
          htmlFor="staff-reopen-filter"
          className="w-44 shrink-0 text-sm font-semibold"
        >
          Resubmission
          <select
            id="staff-reopen-filter"
            className={staffSelectClass}
            value={reopen ?? ""}
            onChange={(event) => onReopenFilterChange(event.target.value)}
          >
            <option value="">All students</option>
            <option value="reopened">Reopened</option>
          </select>
        </label>
        <label className="min-w-0 flex-1 text-sm font-semibold">
          Student
          <select
            className={staffSelectClass}
            value={selectedKey ?? ""}
            onChange={(event) => go(event.target.value || null)}
          >
            <option value="">Your own checklist</option>
            {visible.map((row) => (
              <option key={row.key} value={row.key}>
                {studentOptionLabel(row)}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="h-10 shrink-0 rounded border border-neutral-800 bg-white px-3 text-sm hover:bg-neutral-50 disabled:opacity-50"
          disabled={!previous}
          onClick={() => go(previous)}
        >
          Previous
        </button>
        <button
          type="button"
          className="h-10 shrink-0 rounded border border-neutral-800 bg-white px-3 text-sm hover:bg-neutral-50 disabled:opacity-50"
          disabled={!next}
          onClick={() => go(next)}
        >
          Next
        </button>
      </div>
      {score || prior ? (
        <div className="mt-3 text-sm text-sky-950">
          {score ? <p className="mb-1">{score}</p> : null}
          {prior ? <p className="mb-0 break-words">{prior}</p> : null}
        </div>
      ) : null}
      {reopenedRows.length > 0 ? (
        <ul className="mb-0 mt-3 flex list-none flex-wrap gap-2 p-0">
          {reopenedRows.map((row) => (
            <li key={row.key}>
              <button
                type="button"
                className="rounded-full border border-sky-700 bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-950 hover:bg-sky-200"
                onClick={() => go(row.key)}
              >
                {row.name}: {row.reopen?.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
