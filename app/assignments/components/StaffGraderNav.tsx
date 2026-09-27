"use client";

import { useRouter } from "next/navigation";
import { formatPointsPercent } from "@/lib/assignments/grade";
import {
  adjacentStaffStudentKeys,
  countStaffGradeFilters,
  filterStaffQueueBySection,
  filterStaffQueueByStatus,
  findStaffStudent,
  hasStaffGradeSave,
  listStaffQueueSections,
  priorSubmissionLabel,
  resolveStaffGradeFilter,
  resolveStaffSectionFilter,
  STAFF_GRADE_FILTERS,
  staffGradeFilterLabel,
  staffGraderHref,
  type StaffGradeFilter,
  type StaffStudentRow,
} from "@/lib/assignments/staff";

/** Closed dropdown. Same classes as Section; no size and no multiple. */
const staffSelectClass =
  "form-select mt-1 box-border block h-10 w-full truncate rounded border border-neutral-400 bg-white px-3 font-normal";

function studentOptionLabel(row: StaffStudentRow): string {
  const parts = [row.name];
  if (row.email && row.email !== row.name) parts.push(row.email);
  if (row.section) parts.push(row.section);
  if (!row.hasSubmission) {
    parts.push("not submitted");
  } else if (hasStaffGradeSave(row.staffGrade) && row.staffGrade) {
    const score = formatPointsPercent(
      row.staffGrade.earnedPoints,
      row.staffGrade.totalPoints,
    );
    if (score !== "—") parts.push(score);
  } else if (!row.unmatched) {
    parts.push("ungraded");
  }
  const prior = priorSubmissionLabel(row.priorSubmissions);
  if (prior) parts.push(prior);
  return parts.join(" · ");
}

export default function StaffGraderNav({
  assignmentId,
  queue,
  selectedKey,
  selectedSection,
  selectedFilter,
}: {
  assignmentId: string;
  queue: StaffStudentRow[];
  selectedKey?: string;
  selectedSection?: string;
  selectedFilter?: string;
}) {
  const router = useRouter();
  const sections = listStaffQueueSections(queue);
  const section = resolveStaffSectionFilter(selectedSection, sections);
  const filter: StaffGradeFilter = resolveStaffGradeFilter(selectedFilter);
  const sectionQueue = filterStaffQueueBySection(queue, section);
  const counts = countStaffGradeFilters(sectionQueue);
  const visible = filterStaffQueueByStatus(sectionQueue, filter);
  const { previous, next, index } = adjacentStaffStudentKeys(
    visible,
    selectedKey,
  );
  const submitted = visible.filter((row) => row.hasSubmission).length;

  function go(
    key: string | null,
    nextSection = section,
    nextFilter: StaffGradeFilter = filter,
  ) {
    router.push(
      staffGraderHref(assignmentId, {
        section: nextSection,
        student: key,
        filter: nextFilter,
      }),
    );
  }

  function onSectionChange(value: string) {
    const nextSection = value || undefined;
    const nextQueue = filterStaffQueueByStatus(
      filterStaffQueueBySection(queue, nextSection),
      filter,
    );
    const keep = findStaffStudent(nextQueue, selectedKey)?.key ?? null;
    go(keep, nextSection, filter);
  }

  function onFilterChange(value: string) {
    const nextFilter = resolveStaffGradeFilter(value);
    const nextQueue = filterStaffQueueByStatus(sectionQueue, nextFilter);
    const keep = findStaffStudent(nextQueue, selectedKey)?.key ?? null;
    go(keep, section, nextFilter);
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
        <label className="w-52 shrink-0 text-sm font-semibold">
          Show
          <select
            aria-label="Submission and grade filter"
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
    </section>
  );
}
