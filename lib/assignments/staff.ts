import { normalizeEmail } from "../roster/emails";
import {
  compareSectionLabels,
  compareStudents,
  studentDisplayName,
  UNSECTIONED_LABEL,
} from "../roster/sections";
import type { CanvasRosterEntry } from "../roster/types";
import type { AssignmentCheckResult } from "./check-types";
import type { AssignmentStaffGrade, AssignmentSubmissionDoc } from "./submissions-store";

/** Same fallback as `/people` when `canvas_roster.section` is blank. */
export { UNSECTIONED_LABEL };

export type StaffGraderAccess = {
  canView: boolean;
  canPersist: boolean;
};

/**
 * Same allowlist as People (`INSTRUCTOR_EMAILS` / `TA_EMAILS`) via
 * `isActualStaff`. Impersonation hides the navigator and blocks writes.
 */
export function staffGraderAccess(input: {
  isActualStaff: boolean;
  impersonating: boolean;
}): StaffGraderAccess {
  const canView = input.isActualStaff && !input.impersonating;
  return {
    canView,
    canPersist: canView,
  };
}

export function canViewStaffGrader(
  isActualStaff: boolean,
  impersonating: boolean,
): boolean {
  return staffGraderAccess({ isActualStaff, impersonating }).canView;
}

export function canPersistStaffGrade(
  isActualStaff: boolean,
  impersonating: boolean,
): boolean {
  return staffGraderAccess({ isActualStaff, impersonating }).canPersist;
}

/**
 * Save writes `assignment_submissions.staffGrade`. Call this before that write.
 * Staff means the INSTRUCTOR_EMAILS / TA_EMAILS allowlist (`isActualStaff`).
 * Students, signed-out visitors, and View as student are rejected.
 */
export function assignmentGradeSaveAccess(input: {
  isAuthenticated: boolean;
  isActualStaff: boolean;
  impersonating: boolean;
}): { ok: true } | { ok: false; code: "unauthenticated" | "forbidden" } {
  if (!input.isAuthenticated) return { ok: false, code: "unauthenticated" };
  if (!canPersistStaffGrade(input.isActualStaff, input.impersonating)) {
    return { ok: false, code: "forbidden" };
  }
  return { ok: true };
}

export type StaffStudentRow = {
  key: string;
  email: string;
  name: string;
  section?: string;
  clerkUserId?: string;
  canvasUserId?: string;
  hasSubmission: boolean;
  githubUrl?: string;
  vercelUrl?: string;
  lastCheckedAt?: string;
  checkResults?: AssignmentCheckResult[];
  staffGrade?: AssignmentStaffGrade;
};

function submissionEmails(doc: AssignmentSubmissionDoc): string[] {
  return [doc.rosterEmail, doc.email]
    .filter((value): value is string => Boolean(value))
    .map(normalizeEmail);
}

function submissionUpdatedAt(doc: AssignmentSubmissionDoc): number {
  const value = doc.updatedAt as Date | string;
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
}

/** Same identity the staff queue uses: roster email or Canvas user id. */
export function submissionMatchesRosterStudent(
  entry: { email?: string | null; canvasUserId?: string | null },
  doc: AssignmentSubmissionDoc,
): boolean {
  const email = entry.email ? normalizeEmail(entry.email) : "";
  if (email && submissionEmails(doc).includes(email)) return true;
  const canvasId = entry.canvasUserId?.trim();
  return Boolean(canvasId && doc.canvasUserId && doc.canvasUserId.trim() === canvasId);
}

/**
 * Newest submission for one canvas_roster student across every linked
 * Clerk account. Staff grading and the student Submitted banner both
 * call this so they show the same record.
 */
export function selectRosterSubmission(
  entry: { email?: string | null; canvasUserId?: string | null },
  submissions: readonly AssignmentSubmissionDoc[],
): AssignmentSubmissionDoc | undefined {
  let newest: AssignmentSubmissionDoc | undefined;
  let newestTime = Number.NEGATIVE_INFINITY;
  for (const doc of submissions) {
    if (!submissionMatchesRosterStudent(entry, doc)) continue;
    const time = submissionUpdatedAt(doc);
    if (!newest || time > newestTime) {
      newest = doc;
      newestTime = time;
    }
  }
  return newest;
}

/**
 * Submission the signed-in student should see. A roster match uses
 * `selectRosterSubmission` (the staff grader's record). Otherwise the
 * caller's own account document.
 */
export function studentVisibleSubmission(input: {
  clerkUserId: string;
  rosterEntry?: { email?: string | null; canvasUserId?: string | null } | null;
  submissions: readonly AssignmentSubmissionDoc[];
}): AssignmentSubmissionDoc | null {
  if (input.rosterEntry) {
    return selectRosterSubmission(input.rosterEntry, input.submissions) ?? null;
  }
  return input.submissions.find((doc) => doc.clerkUserId === input.clerkUserId) ?? null;
}

function rowFromSubmission(
  doc: AssignmentSubmissionDoc,
  fallback?: CanvasRosterEntry,
): StaffStudentRow {
  const email =
    (fallback?.email && normalizeEmail(fallback.email)) ||
    (doc.rosterEmail && normalizeEmail(doc.rosterEmail)) ||
    (doc.email && normalizeEmail(doc.email)) ||
    "";
  const name =
    fallback?.name?.trim() ||
    doc.name?.trim() ||
    email ||
    doc.clerkUserId;
  return {
    key: email || `clerk:${doc.clerkUserId}`,
    email,
    name,
    section: fallback?.section ?? doc.section,
    clerkUserId: doc.clerkUserId,
    canvasUserId: fallback?.canvasUserId ?? doc.canvasUserId,
    hasSubmission: true,
    githubUrl: doc.githubUrl,
    vercelUrl: doc.vercelUrl,
    lastCheckedAt: doc.lastCheckedAt
      ? doc.lastCheckedAt instanceof Date
        ? doc.lastCheckedAt.toISOString()
        : new Date(doc.lastCheckedAt).toISOString()
      : undefined,
    checkResults: doc.checkResults,
    staffGrade: doc.staffGrade,
  };
}

/**
 * Roster students first (with or without a submission), then leftover
 * submissions that did not match the roster.
 */
export function buildStaffStudentQueue(
  roster: readonly CanvasRosterEntry[],
  submissions: readonly AssignmentSubmissionDoc[],
): StaffStudentRow[] {
  const docs = [...submissions];
  const used = new Set<AssignmentSubmissionDoc>();
  const rows: StaffStudentRow[] = [];

  const rosterSorted = [...roster].sort(compareStudents);
  for (const entry of rosterSorted) {
    const available = docs.filter((doc) => !used.has(doc));
    const matched = selectRosterSubmission(entry, available);
    for (const doc of available) {
      if (submissionMatchesRosterStudent(entry, doc)) used.add(doc);
    }
    const email = normalizeEmail(entry.email);
    if (matched) {
      rows.push(rowFromSubmission(matched, entry));
      continue;
    }
    rows.push({
      key: email,
      email,
      name: studentDisplayName(entry),
      section: entry.section,
      canvasUserId: entry.canvasUserId,
      hasSubmission: false,
    });
  }

  const leftovers = docs
    .filter((doc) => !used.has(doc))
    .map((doc) => rowFromSubmission(doc))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  rows.push(...leftovers);
  return rows;
}

export function findStaffStudent(
  queue: readonly StaffStudentRow[],
  key: string | undefined | null,
): StaffStudentRow | undefined {
  if (!key) return undefined;
  const needle = key.startsWith("clerk:") ? key : normalizeEmail(key);
  return queue.find((row) => row.key === needle || row.email === needle);
}

export function parseStaffStudentKey(
  key: string | undefined | null,
): { clerkUserId?: string; email?: string } {
  if (!key) return {};
  if (key.startsWith("clerk:")) {
    return { clerkUserId: key.slice("clerk:".length) };
  }
  return { email: normalizeEmail(key) };
}

export function adjacentStaffStudentKeys(
  queue: readonly StaffStudentRow[],
  key: string | undefined | null,
): { previous: string | null; next: string | null; index: number } {
  if (queue.length === 0) {
    return { previous: null, next: null, index: -1 };
  }
  const current = findStaffStudent(queue, key);
  const index = current ? queue.indexOf(current) : 0;
  const previous = index > 0 ? queue[index - 1].key : null;
  const next = index < queue.length - 1 ? queue[index + 1].key : null;
  return { previous, next, index };
}

/** Raw `canvas_roster.section` (trimmed), or `Unsectioned` — same as People tabs. */
export function staffRowSectionLabel(row: {
  section?: string | null;
}): string {
  return row.section?.trim() || UNSECTIONED_LABEL;
}

export function listStaffQueueSections(
  queue: readonly StaffStudentRow[],
): string[] {
  return [...new Set(queue.map(staffRowSectionLabel))].sort(compareSectionLabels);
}

/**
 * Unknown or empty `?section=` is All (same as `/people`).
 * Valid values are the stored Canvas section labels.
 */
export function resolveStaffSectionFilter(
  section: string | undefined | null,
  available: readonly string[],
): string | undefined {
  const selected = section?.trim();
  if (!selected) return undefined;
  return available.includes(selected) ? selected : undefined;
}

export function filterStaffQueueBySection(
  queue: readonly StaffStudentRow[],
  section: string | undefined | null,
): StaffStudentRow[] {
  const selected = section?.trim();
  if (!selected) return [...queue];
  return queue.filter((row) => staffRowSectionLabel(row) === selected);
}

export function staffQueueForSection(
  queue: readonly StaffStudentRow[],
  section: string | undefined | null,
): StaffStudentRow[] {
  const resolved = resolveStaffSectionFilter(
    section,
    listStaffQueueSections(queue),
  );
  return filterStaffQueueBySection(queue, resolved);
}

export function staffGraderHref(
  assignmentId: string,
  options?: { section?: string | null; student?: string | null },
): string {
  const params = new URLSearchParams();
  const section = options?.section?.trim();
  const student = options?.student?.trim();
  if (section) params.set("section", section);
  if (student) params.set("student", student);
  const query = params.toString();
  return query
    ? `/assignments/${assignmentId}?${query}`
    : `/assignments/${assignmentId}`;
}
