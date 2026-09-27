import type { Metadata } from "next";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { formatLongDate } from "@/app/syllabus/data/dates";
import { assignmentsIntro } from "@/app/syllabus/data/assignments";
import { supportsUrlSubmission } from "@/lib/assignments/access";
import {
  getAssignment,
  listAssignmentIds,
  listAssignments,
  rubricPointTotal,
} from "@/lib/assignments/catalog";
import {
  assignmentDueInstant,
  assignmentListStatus,
} from "@/lib/assignments/lock";
import { listAssignmentReopens } from "@/lib/assignments/reopens";
import { studentVisibleSubmission } from "@/lib/assignments/staff";
import { listSubmissionsForAssignment } from "@/lib/assignments/submissions";
import {
  SIGN_IN_FOR_SUBMISSION_STATUS,
  type StudentSubmissionStatus,
} from "@/lib/assignments/submission-status";
import type { AssignmentId } from "@/lib/assignments/types";
import { COURSE_WEBSITE_ACCOUNT_COPY } from "@/lib/course-site/account-copy";
import {
  isAssignmentProgressConfigured,
  isClerkConfigured,
} from "@/lib/config";
import { canvasUserIdFromMetadata } from "@/lib/roster/emails";
import { loadClerkRosterEmails } from "@/lib/roster/load-clerk-emails";
import { lookupCanvasRoster } from "@/lib/roster/lookup";
import type { CanvasRosterEntry } from "@/lib/roster/types";
import AssignmentHubNav from "./components/AssignmentHubNav";
import AssignmentStatusBadge from "./components/AssignmentStatusBadge";

export const dynamic = "force-dynamic";

async function loadSubmissionStatuses(): Promise<{
  note: string | null;
  statuses: Map<AssignmentId, StudentSubmissionStatus>;
}> {
  const urlIds = listAssignmentIds().filter((id) => supportsUrlSubmission(id));
  const signedOut = {
    note: SIGN_IN_FOR_SUBMISSION_STATUS,
    statuses: new Map<AssignmentId, StudentSubmissionStatus>(),
  };
  if (!isClerkConfigured() || !isAssignmentProgressConfigured()) {
    return signedOut;
  }
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return signedOut;
    let rosterEntry: CanvasRosterEntry | null = null;
    try {
      const user = await currentUser();
      const emails = await loadClerkRosterEmails({
        user,
        sessionClaims,
        userId,
      });
      const canvasUserId = canvasUserIdFromMetadata(user);
      const roster = await lookupCanvasRoster({
        emails,
        canvasUserIds: canvasUserId ? [canvasUserId] : [],
      });
      if (roster.status === "matched") rosterEntry = roster.entry;
    } catch (error) {
      console.error("assignment list roster lookup failed", error);
    }
    if (!rosterEntry) {
      return { note: null, statuses: new Map() };
    }
    const now = new Date();
    const reopenLists = await Promise.all(
      urlIds.map((id) =>
        listAssignmentReopens(id).catch((error) => {
          console.error("assignment list reopen load failed", error);
          return [];
        }),
      ),
    );
    const chosen = (
      await Promise.all(urlIds.map((id) => listSubmissionsForAssignment(id)))
    ).map((submissions) =>
      studentVisibleSubmission({
        clerkUserId: userId,
        rosterEntry,
        submissions,
      }),
    );
    const statuses = new Map<AssignmentId, StudentSubmissionStatus>();
    urlIds.forEach((id, index) => {
      const doc = chosen[index] ?? null;
      const status = assignmentListStatus({
        assignmentId: id,
        hasSubmission: Boolean(doc),
        staffGrade: doc?.staffGrade,
        now,
        dueAt: assignmentDueInstant({
          assignmentId: id,
          sharedDueDate: getAssignment(id)?.dueDate,
          section: rosterEntry?.section,
        }),
        reopens: reopenLists[index] ?? [],
        student: {
          email: rosterEntry?.email,
          clerkUserId: userId,
          canvasUserId: rosterEntry?.canvasUserId,
        },
      });
      if (status) statuses.set(id, status);
    });
    return { note: null, statuses };
  } catch (error) {
    console.error("assignment list submission status failed", error);
    return { note: null, statuses: new Map() };
  }
}

export const metadata: Metadata = {
  title: "Assignments — CS 4550 / CS 5610",
};

export default async function AssignmentsIndexPage() {
  const items = listAssignments();
  const { note: statusNote, statuses } = await loadSubmissionStatuses();

  return (
    <article className="page-content">
      <AssignmentHubNav current="index" />
      <h1 className="mt-0 font-sans text-3xl font-semibold tracking-tight">
        Assignments
      </h1>
      {assignmentsIntro.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
      <p className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 font-sans text-sm text-sky-950">
        Use the checklists to track Delivery, Lab, and Kambaz work. Due dates
        are informational — Canvas is still the official calendar. A1 grades
        on this site are all-or-nothing per criterion from a public Vercel
        URL (GitHub is optional). Canvas is a grade shell only.
      </p>
      <p className="rounded-lg border-2 border-sky-400 bg-sky-50 px-4 py-3 font-sans text-sm text-sky-950">
        <span className="font-semibold">
          {COURSE_WEBSITE_ACCOUNT_COPY.heading}.{" "}
        </span>
        {COURSE_WEBSITE_ACCOUNT_COPY.assignmentAuthHint}
      </p>
      {statusNote ? (
        <p className="rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3 font-sans text-sm text-neutral-800">
          {statusNote}
        </p>
      ) : null}
      <ul className="mt-6 list-none space-y-3 p-0">
        {items.map((item) => {
          const points = item.rubric ? rubricPointTotal(item.rubric) : null;
          const status = statuses.get(item.id);
          return (
            <li
              key={item.id}
              className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm"
            >
              <h2 className="mt-0 mb-1 flex flex-wrap items-center gap-2 font-sans text-lg font-semibold">
                <Link href={`/assignments/${item.id}`}>
                  {item.canvasId} — {item.title}
                </Link>
                {status ? <AssignmentStatusBadge status={status} /> : null}
              </h2>
              <p className="mt-0 mb-2 font-sans text-sm text-neutral-700">
                {item.dueDate ? `Due ${formatLongDate(item.dueDate)}` : null}
                {points != null
                  ? `${item.dueDate ? " · " : ""}${points} pts`
                  : null}
                {item.status === "coming_soon"
                  ? `${item.dueDate || points != null ? " · " : ""}Checklist coming soon`
                  : null}
              </p>
              <p className="mb-3 mt-0 text-neutral-800">{item.summary}</p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/assignments/${item.id}`}
                  className="book-practice-cta inline-block rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm"
                >
                  {item.status === "ready"
                    ? `Open ${item.canvasId} checklist`
                    : `Open ${item.canvasId}`}
                </Link>
                <Link
                  href={item.chapterHref}
                  className="inline-block rounded border border-neutral-800 bg-white px-3 py-2 font-sans text-sm"
                >
                  Open {item.chapter} in the book
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
