import { isDemoRosterEmail } from "../roster/demo-students";
import { emailMatchKeys, normalizeEmail, rosterDocumentEmails } from "../roster/emails";
import { isStaff } from "../roster/instructors";
import {
  compareSectionLabels,
  compareStudents,
  studentDisplayName,
  UNSECTIONED_LABEL,
} from "../roster/sections";
import type { CanvasRosterEntry } from "../roster/types";
import type { AssignmentCheckResult } from "./check-types";
import { formatPointsPercent } from "./grade";
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

export type PriorSubmissionNote = {
  url: string;
  /** ISO timestamp of the older submission (`updatedAt`, else `createdAt`). */
  at: string;
  /** Present when that older submission already has a staff Save. */
  graded?: {
    earnedPoints: number;
    totalPoints: number;
    gradedAt: string;
  };
};

export type StaffStudentRow = {
  key: string;
  email: string;
  name: string;
  section?: string;
  clerkUserId?: string;
  canvasUserId?: string;
  hasSubmission: boolean;
  /** Submission that did not match a roster student. Not part of section counts. */
  unmatched?: boolean;
  githubUrl?: string;
  vercelUrl?: string;
  lastCheckedAt?: string;
  checkResults?: AssignmentCheckResult[];
  staffGrade?: AssignmentStaffGrade;
  /** Older submissions for the same student. The row itself is the newest. */
  priorSubmissions?: PriorSubmissionNote[];
};

export type StaffQueueOptions = {
  instructorEmails?: readonly string[];
  taEmails?: readonly string[];
};

function timeMs(value: Date | string | undefined): number {
  if (!value) return 0;
  const ms = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

function submissionStamp(doc: AssignmentSubmissionDoc): string {
  const ms = timeMs(doc.updatedAt) || timeMs(doc.createdAt);
  return ms ? new Date(ms).toISOString() : "";
}

/** Newer `updatedAt` first, then newer `createdAt`. */
function compareNewestSubmission(
  a: AssignmentSubmissionDoc,
  b: AssignmentSubmissionDoc,
): number {
  const updated = timeMs(b.updatedAt) - timeMs(a.updatedAt);
  if (updated !== 0) return updated;
  return timeMs(b.createdAt) - timeMs(a.createdAt);
}

function priorNoteText(note: PriorSubmissionNote): string {
  const date = note.at ? note.at.slice(0, 10) : "unknown date";
  const parts = [`also submitted: ${note.url}, ${date}`];
  if (note.graded) {
    const score = formatPointsPercent(note.graded.earnedPoints, note.graded.totalPoints);
    const gradedOn = note.graded.gradedAt.slice(0, 10) || date;
    parts.push(`previously graded: ${score} on ${gradedOn} for ${note.url}`);
  }
  return parts.join("; ");
}

export function priorSubmissionLabel(
  notes: readonly PriorSubmissionNote[] | undefined,
): string {
  if (!notes?.length) return "";
  return notes.map(priorNoteText).join("; ");
}

function submissionEmails(doc: AssignmentSubmissionDoc): string[] {
  return [doc.rosterEmail, doc.email]
    .filter((value): value is string => Boolean(value))
    .map(normalizeEmail)
    .filter(Boolean);
}

type RosterMatchEntry = {
  email?: string | null;
  canvasUserId?: string | null;
  sisLoginId?: string | null;
  emails?: readonly string[] | null;
  source?: CanvasRosterEntry["source"];
};

function emailKeys(emails: readonly string[]): Set<string> {
  const keys = new Set<string>();
  for (const email of emails) {
    for (const key of emailMatchKeys(email)) keys.add(key);
  }
  return keys;
}

function isDemoIdentity(emails: readonly string[], canvasUserId?: string): boolean {
  if (emails.some((email) => isDemoRosterEmail(email))) return true;
  const id = canvasUserId?.trim();
  return id === "demo-ada-lovelace" || id === "demo-bob-marley";
}

function isStaffIdentity(
  emails: readonly string[],
  options?: StaffQueueOptions,
): boolean {
  return isStaff(
    [...emails],
    options?.instructorEmails ? [...options.instructorEmails] : undefined,
    options?.taEmails ? [...options.taEmails] : undefined,
  );
}

function excludedRosterEntry(
  entry: CanvasRosterEntry,
  options?: StaffQueueOptions,
): boolean {
  const emails = rosterDocumentEmails(entry);
  return (
    entry.source === "demo" ||
    isDemoIdentity(emails, entry.canvasUserId) ||
    isStaffIdentity(emails, options)
  );
}

function excludedSubmission(
  doc: AssignmentSubmissionDoc,
  options?: StaffQueueOptions,
): boolean {
  const emails = submissionEmails(doc);
  return isDemoIdentity(emails, doc.canvasUserId) || isStaffIdentity(emails, options);
}

/** Every roster mailbox (primary, SIS, aliases) or Canvas user id. */
function submissionMatchesRoster(
  doc: AssignmentSubmissionDoc,
  entry: RosterMatchEntry,
): boolean {
  const rosterKeys = emailKeys(rosterDocumentEmails(entry));
  const submissionKeys = emailKeys(submissionEmails(doc));
  for (const key of submissionKeys) {
    if (rosterKeys.has(key)) return true;
  }
  const canvasId = entry.canvasUserId?.trim();
  return Boolean(canvasId && doc.canvasUserId?.trim() === canvasId);
}

function priorNote(doc: AssignmentSubmissionDoc): PriorSubmissionNote {
  const url = doc.vercelUrl?.trim() || doc.githubUrl?.trim() || "(no url)";
  const note: PriorSubmissionNote = { url, at: submissionStamp(doc) };
  const grade = doc.staffGrade;
  if (grade && hasStaffGradeSave(grade)) {
    const gradedAt = grade.gradedAt;
    note.graded = {
      earnedPoints: grade.earnedPoints,
      totalPoints: grade.totalPoints,
      gradedAt: gradedAt instanceof Date ? gradedAt.toISOString() : String(gradedAt),
    };
  }
  return note;
}

/**
 * Newest submission for one canvas_roster student across every linked
 * Clerk account. A document matches any roster email (or Canvas id).
 * Staff and demo accounts are skipped. When `clerkUserId` is set, that
 * signed-in account's own document matches too, so an older dev-Clerk
 * submission found by `rosterEmail` and a newer production account agree.
 * Staff grading omits `clerkUserId` and still collapses every roster match
 * to this same newest record.
 */
export function selectRosterSubmission(
  entry: RosterMatchEntry,
  submissions: readonly AssignmentSubmissionDoc[],
  options?: { clerkUserId?: string | null } & StaffQueueOptions,
): AssignmentSubmissionDoc | undefined {
  const clerkUserId = options?.clerkUserId?.trim() ?? "";
  const matches = submissions.filter((doc) => {
    const matchesClerk = clerkUserId !== "" && doc.clerkUserId === clerkUserId;
    if (excludedSubmission(doc, options) && !matchesClerk) return false;
    return submissionMatchesRoster(doc, entry) || matchesClerk;
  });
  matches.sort(compareNewestSubmission);
  return matches[0];
}

/**
 * Submission the signed-in student should see. Candidates are documents
 * that match any roster email, plus the document stored under the current
 * `clerkUserId`. The newest `updatedAt`, then `createdAt`, wins.
 */
export function studentVisibleSubmission(input: {
  clerkUserId: string;
  rosterEntry?: RosterMatchEntry | null;
  submissions: readonly AssignmentSubmissionDoc[];
}): AssignmentSubmissionDoc | null {
  return (
    selectRosterSubmission(input.rosterEntry ?? {}, input.submissions, {
      clerkUserId: input.clerkUserId,
    }) ?? null
  );
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
    priorSubmissions: undefined,
  };
}

/**
 * Active roster students first. Each student keeps the newest matching
 * submission (`updatedAt`, then `createdAt`). Older matches stay on the row
 * as prior notes and are not extra queue rows. Staff and demo students are
 * omitted. Submissions that match nobody else are `unmatched`.
 * Nothing is deleted from the database.
 */
export function buildStaffStudentQueue(
  roster: readonly CanvasRosterEntry[],
  submissions: readonly AssignmentSubmissionDoc[],
  options?: StaffQueueOptions,
): StaffStudentRow[] {
  const docs = submissions.filter((doc) => !excludedSubmission(doc, options));
  const used = new Set<AssignmentSubmissionDoc>();
  const rows: StaffStudentRow[] = [];

  const rosterSorted = [...roster]
    .filter((entry) => !excludedRosterEntry(entry, options))
    .sort(compareStudents);
  for (const entry of rosterSorted) {
    const available = docs.filter((doc) => !used.has(doc));
    const matches = available
      .filter((doc) => submissionMatchesRoster(doc, entry))
      .sort(compareNewestSubmission);
    for (const doc of matches) used.add(doc);
    const email = normalizeEmail(entry.email) || rosterDocumentEmails(entry)[0] || "";
    const newest = selectRosterSubmission(entry, available, options) ?? matches[0];
    if (!newest) {
      rows.push({
        key: email || `canvas:${entry.canvasUserId ?? ""}`,
        email,
        name: studentDisplayName(entry),
        section: entry.section,
        canvasUserId: entry.canvasUserId,
        hasSubmission: false,
      });
      continue;
    }
    const row = rowFromSubmission(newest, entry);
    const prior = matches.slice(1).map(priorNote);
    if (prior.length) row.priorSubmissions = prior;
    rows.push(row);
  }

  const leftovers = docs
    .filter((doc) => !used.has(doc))
    .map((doc) => ({ ...rowFromSubmission(doc), unmatched: true }))
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
  const labels = new Set<string>();
  for (const row of queue) {
    if (row.unmatched) {
      if (row.section?.trim()) labels.add(staffRowSectionLabel(row));
      continue;
    }
    labels.add(staffRowSectionLabel(row));
  }
  return [...labels].sort(compareSectionLabels);
}

/**
 * Unknown or empty `?section=` is All (same as `/people`).
 * Valid values are labels that at least one row actually has.
 * `Unsectioned` is valid only when a roster row has a blank section.
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
  return queue.filter((row) => {
    if (row.unmatched) {
      return Boolean(row.section?.trim()) && staffRowSectionLabel(row) === selected;
    }
    return staffRowSectionLabel(row) === selected;
  });
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

/**
 * A staff Save exists when `staffGrade` was written (including older
 * pass/fail overrides). An empty object, including `criterionOverrides: {}`,
 * is not a grade.
 */
export function hasStaffGradeSave(
  grade: AssignmentStaffGrade | null | undefined,
): boolean {
  if (!grade) return false;
  const overrides = grade.criterionOverrides;
  const hasOverrides = Boolean(
    overrides && Object.keys(overrides).some((key) => key && typeof overrides[key] === "boolean"),
  );
  return Boolean(grade.gradedAt || grade.rows?.length || hasOverrides);
}

export const STAFF_GRADE_FILTERS = [
  "all",
  "submitted",
  "not-submitted",
  "graded",
  "ungraded",
  "unmatched",
] as const;

export type StaffGradeFilter = (typeof STAFF_GRADE_FILTERS)[number];

export type StaffGradeFilterCounts = Record<StaffGradeFilter, number>;

const STAFF_GRADE_FILTER_LABEL: Record<StaffGradeFilter, string> = {
  all: "All",
  submitted: "Submitted",
  "not-submitted": "Not submitted",
  graded: "Graded",
  ungraded: "Ungraded",
  unmatched: "Unmatched",
};

/** Missing or unknown `?filter=` is All. */
export function resolveStaffGradeFilter(
  filter: string | undefined | null,
): StaffGradeFilter {
  const value = filter?.trim().toLowerCase();
  if (value === "submitted") return "submitted";
  if (value === "not-submitted" || value === "not_submitted") return "not-submitted";
  if (value === "graded") return "graded";
  if (value === "ungraded") return "ungraded";
  if (value === "unmatched") return "unmatched";
  return "all";
}

export function staffGradeFilterLabel(
  filter: StaffGradeFilter,
  count: number,
): string {
  return `${STAFF_GRADE_FILTER_LABEL[filter]} (${count})`;
}

function countsTowardRoster(row: StaffStudentRow): boolean {
  return !row.unmatched;
}

/**
 * Counts for the status dropdown. Call this on the section-filtered queue
 * so the counts follow the section filter.
 * All / Submitted / Not submitted / Graded / Ungraded are roster students only.
 * Staff, demo students, and unmatched submissions are outside those counts.
 * Unmatched is its own option.
 */
export function countStaffGradeFilters(
  queue: readonly StaffStudentRow[],
): StaffGradeFilterCounts {
  const counts: StaffGradeFilterCounts = {
    all: 0,
    submitted: 0,
    "not-submitted": 0,
    graded: 0,
    ungraded: 0,
    unmatched: 0,
  };
  for (const row of queue) {
    if (!countsTowardRoster(row)) {
      counts.unmatched += 1;
      continue;
    }
    counts.all += 1;
    if (!row.hasSubmission) {
      counts["not-submitted"] += 1;
      continue;
    }
    counts.submitted += 1;
    if (hasStaffGradeSave(row.staffGrade)) counts.graded += 1;
    else counts.ungraded += 1;
  }
  return counts;
}

export function filterStaffQueueByStatus(
  queue: readonly StaffStudentRow[],
  filter: string | undefined | null,
): StaffStudentRow[] {
  const selected = resolveStaffGradeFilter(filter);
  if (selected === "unmatched") return queue.filter((row) => row.unmatched);
  const roster = queue.filter(countsTowardRoster);
  if (selected === "all") return roster;
  if (selected === "submitted") return roster.filter((row) => row.hasSubmission);
  if (selected === "not-submitted") {
    return roster.filter((row) => !row.hasSubmission);
  }
  if (selected === "graded") {
    return roster.filter(
      (row) => row.hasSubmission && hasStaffGradeSave(row.staffGrade),
    );
  }
  return roster.filter(
    (row) => row.hasSubmission && !hasStaffGradeSave(row.staffGrade),
  );
}

/**
 * A `?student=` who is outside the current status or section filter is
 * included by widening that filter, instead of leaving the grader on their
 * own checklist.
 */
export function resolveStaffGraderView(input: {
  queue: readonly StaffStudentRow[];
  section?: string | null;
  filter?: string | null;
  studentKey?: string | null;
}): {
  section?: string;
  filter: StaffGradeFilter;
  student?: StaffStudentRow;
} {
  const sections = listStaffQueueSections(input.queue);
  let section = resolveStaffSectionFilter(input.section, sections);
  const filter = resolveStaffGradeFilter(input.filter);
  const key = input.studentKey?.trim();
  if (!key) return { section, filter };

  const visible = findStaffStudent(
    visibleStaffQueue(input.queue, section, filter),
    key,
  );
  if (visible) return { section, filter, student: visible };

  const anywhere = findStaffStudent(input.queue, key);
  if (!anywhere) return { section, filter };

  if (anywhere.unmatched) {
    const hint = anywhere.section?.trim();
    return {
      section: hint ? staffRowSectionLabel(anywhere) : undefined,
      filter: "unmatched",
      student: anywhere,
    };
  }

  const inSection = findStaffStudent(staffQueueForSection(input.queue, section), key);
  if (!inSection) section = staffRowSectionLabel(anywhere);
  return { section, filter: "all", student: anywhere };
}

/** Section first, then submission/grade status. */
export function visibleStaffQueue(
  queue: readonly StaffStudentRow[],
  section: string | undefined | null,
  filter: string | undefined | null,
): StaffStudentRow[] {
  return filterStaffQueueByStatus(staffQueueForSection(queue, section), filter);
}

export function staffGraderHref(
  assignmentId: string,
  options?: {
    section?: string | null;
    student?: string | null;
    filter?: string | null;
  },
): string {
  const params = new URLSearchParams();
  const section = options?.section?.trim();
  const student = options?.student?.trim();
  const filter = resolveStaffGradeFilter(options?.filter);
  if (section) params.set("section", section);
  if (filter !== "all") params.set("filter", filter);
  if (student) params.set("student", student);
  const query = params.toString();
  return query
    ? `/assignments/${assignmentId}?${query}`
    : `/assignments/${assignmentId}`;
}
