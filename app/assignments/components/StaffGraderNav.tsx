"use client";

import { useRouter } from "next/navigation";
import {
  adjacentStaffStudentKeys,
  filterStaffQueueBySection,
  findStaffStudent,
  listStaffQueueSections,
  resolveStaffSectionFilter,
  staffGraderHref,
  type StaffStudentRow,
} from "@/lib/assignments/staff";

export default function StaffGraderNav({
  assignmentId,
  queue,
  selectedKey,
  selectedSection,
}: {
  assignmentId: string;
  queue: StaffStudentRow[];
  selectedKey?: string;
  selectedSection?: string;
}) {
  const router = useRouter();
  const sections = listStaffQueueSections(queue);
  const section = resolveStaffSectionFilter(selectedSection, sections);
  const visible = filterStaffQueueBySection(queue, section);
  const { previous, next, index } = adjacentStaffStudentKeys(
    visible,
    selectedKey,
  );
  const submitted = visible.filter((row) => row.hasSubmission).length;

  function go(key: string | null, nextSection = section) {
    router.push(staffGraderHref(assignmentId, { section: nextSection, student: key }));
  }

  function onSectionChange(value: string) {
    const nextSection = value || undefined;
    const nextQueue = filterStaffQueueBySection(queue, nextSection);
    const keep = findStaffStudent(nextQueue, selectedKey)?.key ?? null;
    go(keep, nextSection);
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
      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-[12rem] text-sm font-semibold">
          Section
          <select
            className="mt-1 box-border w-full rounded border border-neutral-400 bg-white px-3 py-2 font-normal"
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
        <label className="min-w-[16rem] flex-1 text-sm font-semibold">
          Student
          <select
            className="mt-1 box-border w-full rounded border border-neutral-400 bg-white px-3 py-2 font-normal"
            value={selectedKey ?? ""}
            onChange={(event) => go(event.target.value || null)}
          >
            <option value="">Your own checklist</option>
            {visible.map((row) => (
              <option key={row.key} value={row.key}>
                {row.name}
                {row.email && row.email !== row.name ? ` · ${row.email}` : ""}
                {row.section ? ` · ${row.section}` : ""}
                {row.hasSubmission ? "" : " · no submission"}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="rounded border border-neutral-800 bg-white px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
          disabled={!previous}
          onClick={() => go(previous)}
        >
          Previous
        </button>
        <button
          type="button"
          className="rounded border border-neutral-800 bg-white px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
          disabled={!next}
          onClick={() => go(next)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
