import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import StatusPanel from "@/app/quizzes/components/StatusPanel";
import { formatLongDate } from "@/app/syllabus/data/dates";
import {
  assignmentSubmitAccess,
  canViewStaffGrader,
  supportsUrlSubmission,
} from "@/lib/assignments/access";
import {
  resolveA1SubmitVisibility,
  type SubmissionGateReason,
} from "@/lib/assignments/submission-form";
import {
  getAssignment,
  listAssignmentIds,
  listRubricCriteria,
  rubricPointTotal,
} from "@/lib/assignments/catalog";
import { gradeViewFromStaffGrade } from "@/lib/assignments/grade-rows";
import type { AssignmentGradeView } from "@/lib/assignments/grade-rows";
import {
  listSubmissionsForAssignment,
  readAssignmentSubmission,
} from "@/lib/assignments/submissions";
import {
  toSubmissionView,
  type AssignmentSubmissionView,
} from "@/lib/assignments/submissions-store";
import {
  assignmentDueInstant,
  describeReopenPanel,
  reopenBadgeForStudent,
  studentLockView,
  type AssignmentReopenRecord,
  type ReopenPanelState,
  type StudentLockView,
} from "@/lib/assignments/lock";
import { listAssignmentReopens } from "@/lib/assignments/reopens";
import {
  buildStaffStudentQueue,
  resolveStaffGraderView,
  resolveStaffReopenFilter,
  studentVisibleSubmission,
  type StaffGradeFilter,
  type StaffStudentRow,
} from "@/lib/assignments/staff";
import { buildA1GateDiagnostics } from "@/lib/assignments/diagnostics";
import type { A1GateDiagnostics } from "@/lib/assignments/diagnostics";
import {
  isAssignmentProgressConfigured,
  isClerkConfigured,
  isClerkPublishableKeySet,
  isMongoConfigured,
  mongoDbName,
} from "@/lib/config";
import { canvasUserIdFromMetadata } from "@/lib/roster/emails";
import { listCanvasRoster } from "@/lib/roster/list";
import { loadClerkRosterEmails } from "@/lib/roster/load-clerk-emails";
import {
  CANVAS_ROSTER_COLLECTION,
  getRosterCollection,
  lookupCanvasRoster,
} from "@/lib/roster/lookup";
import { matchRoster } from "@/lib/roster/match";
import {
  isActualStaff,
  isImpersonatingStudent,
} from "@/lib/roster/staff-access";
import { COURSE_WEBSITE_ACCOUNT_COPY } from "@/lib/course-site/account-copy";
import { SIGN_IN_FOR_SUBMISSION_STATUS } from "@/lib/assignments/submission-status";
import A1SubmitDiagnostics from "../components/A1SubmitDiagnostics";
import A1WorkArea from "../components/A1WorkArea";
import AssignmentChapterLink from "../components/AssignmentChapterLink";
import AssignmentChecklist from "../components/AssignmentChecklist";
import AssignmentHubNav from "../components/AssignmentHubNav";

export const dynamic = "force-dynamic";

/** Signed-out save gate. Sign-in wins over roster/config misses. */
function loggedOutSubmitVisibility(assignmentId: string, configured: boolean) {
  return resolveA1SubmitVisibility({
    assignmentId,
    access: assignmentSubmitAccess({
      signedIn: false,
      configured,
      isActualStaff: false,
      roster: { status: "not_configured" },
    }),
  });
}

type PageProps = {
  params: Promise<{ assignmentId: string }>;
  searchParams: Promise<{
    student?: string;
    section?: string;
    filter?: string;
    reopen?: string;
  }>;
};

export function generateStaticParams() {
  return listAssignmentIds().map((assignmentId) => ({ assignmentId }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { assignmentId } = await params;
  const assignment = getAssignment(assignmentId);
  return {
    title: assignment
      ? `${assignment.canvasId} — ${assignment.title}`
      : "Assignment",
  };
}

export default async function AssignmentDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { assignmentId } = await params;
  const {
    student: studentKey,
    section: sectionParam,
    filter: filterParam,
    reopen: reopenParam,
  } = await searchParams;
  const assignment = getAssignment(assignmentId);
  if (!assignment) notFound();

  let signedIn = false;
  let rosterMatched = false;
  let serverUserId: string | null = null;
  const mongoReady = isAssignmentProgressConfigured();
  let initialGrade: AssignmentGradeView | null = null;
  let canSubmit = false;
  let impersonating = false;
  let gateReason: SubmissionGateReason = mongoReady ? "sign_in" : "not_configured";
  let initialSubmission: AssignmentSubmissionView | null = null;
  let staffQueue: StaffStudentRow[] | undefined;
  let selectedStudent: StaffStudentRow | null = null;
  let selectedSection: string | undefined;
  let selectedFilter: StaffGradeFilter = "all";
  let showStaffGrader = false;
  let staffDiagnostics: A1GateDiagnostics | null = null;
  let lockView: StudentLockView = { kind: "open" };
  let reopenPanel: ReopenPanelState | null = null;
  let reopenFilter = resolveStaffReopenFilter(reopenParam);
  let reopenRecords: AssignmentReopenRecord[] = [];

  if (isClerkConfigured()) {
    const { userId, sessionClaims } = await auth();
    signedIn = Boolean(userId);
    serverUserId = userId ?? null;
    if (signedIn && userId) {
      let staff = false;
      let user = null;
      let emails: string[] = [];
      try {
        user = await currentUser();
        impersonating = await isImpersonatingStudent();
        staff = await isActualStaff();
        showStaffGrader =
          supportsUrlSubmission(assignment.id) &&
          canViewStaffGrader(staff, impersonating);
      } catch (error) {
        console.error("assignment auth context failed", error);
      }

      try {
        emails = await loadClerkRosterEmails({
          user,
          sessionClaims,
          userId,
        });
      } catch (error) {
        console.error("assignment clerk emails failed", error);
      }

      const canvasUserId = canvasUserIdFromMetadata(user);
      let roster: Awaited<ReturnType<typeof lookupCanvasRoster>> = {
        status: "not_configured",
      };
      try {
        roster = await lookupCanvasRoster({
          emails,
          canvasUserIds: canvasUserId ? [canvasUserId] : [],
          impersonating,
        });
      } catch (error) {
        console.error("assignment roster lookup failed", error);
        const fallback = matchRoster({
          emails,
          canvasUserIds: canvasUserId ? [canvasUserId] : [],
          mongoEntries: [],
          envEmails: [],
          mongoCount: emails.length > 0 ? 1 : 0,
        });
        roster =
          fallback.status === "matched"
            ? fallback
            : emails.length > 0
              ? { status: "not_on_roster" }
              : { status: "not_configured" };
      }

      // Save gate is computed here and never rewritten by checklist / staff
      // extras. “The page loaded” is not canSubmit. Run checks does not use
      // canSubmit — logged-out visitors still get the URL fields.
      const visibility = resolveA1SubmitVisibility({
        assignmentId: assignment.id,
        access: assignmentSubmitAccess({
          signedIn: true,
          configured: isAssignmentProgressConfigured(),
          isActualStaff: staff,
          roster,
        }),
      });
      canSubmit = visibility.canSubmit;
      gateReason = visibility.gateReason;
      rosterMatched = roster.status === "matched";

      if (staff) {
        let rosterCount: number | null = null;
        if (isMongoConfigured()) {
          try {
            rosterCount = await (await getRosterCollection()).countDocuments();
          } catch (error) {
            console.error("assignment roster count failed", error);
          }
        }
        staffDiagnostics = buildA1GateDiagnostics({
          assignmentId: assignment.id,
          signedIn: true,
          mongoConfigured: isMongoConfigured(),
          assignmentConfigured: isAssignmentProgressConfigured(),
          isActualStaff: staff,
          clerkEmails: emails,
          roster,
          rosterDb: mongoDbName(),
          rosterCollection: CANVAS_ROSTER_COLLECTION,
          rosterCount,
        });
      }

      console.info("assignment submit gate", {
        assignmentId: assignment.id,
        emailCount: emails.length,
        hasNortheasternEmail: emails.some((email) =>
          /@(northeastern\.edu|husky\.neu\.edu|neu\.edu)$/.test(email),
        ),
        rosterStatus: roster.status,
        mongoConfigured: isMongoConfigured(),
        canSubmit,
        gateReason,
      });

      try {
        if (
          mongoReady &&
          canSubmit &&
          !impersonating &&
          supportsUrlSubmission(assignment.id)
        ) {
          const doc =
            roster.status === "matched"
              ? studentVisibleSubmission({
                  clerkUserId: userId,
                  rosterEntry: roster.entry,
                  submissions: await listSubmissionsForAssignment(assignment.id),
                })
              : await readAssignmentSubmission(userId, assignment.id);
          initialSubmission = doc ? toSubmissionView(doc) : null;
        }
      } catch (error) {
        console.error("assignment submission load failed", error);
      }
      const ownSubmission = initialSubmission;

      if (mongoReady && supportsUrlSubmission(assignment.id)) {
        try {
          reopenRecords = await listAssignmentReopens(assignment.id);
        } catch (error) {
          console.error("assignment reopen load failed", error);
        }
      }

      try {
        if (showStaffGrader && mongoReady) {
          const [rosterList, submissions] = await Promise.all([
            listCanvasRoster(),
            listSubmissionsForAssignment(assignment.id),
          ]);
          const now = new Date();
          staffQueue = buildStaffStudentQueue(
            rosterList.status === "ok" ? rosterList.entries : [],
            submissions,
          ).map((row) => ({
            ...row,
            reopen: reopenBadgeForStudent(
              reopenRecords,
              {
                email: row.email,
                clerkUserId: row.clerkUserId,
                canvasUserId: row.canvasUserId,
              },
              now,
            ),
          }));
          const view = resolveStaffGraderView({
            queue: staffQueue,
            section: sectionParam,
            filter: filterParam,
            studentKey,
          });
          selectedSection = view.section;
          selectedFilter = view.filter;
          if (view.student && reopenFilter === "reopened" && !view.student.reopen) {
            reopenFilter = undefined;
          }
          if (studentKey) {
            selectedStudent = view.student ?? null;
            if (selectedStudent?.clerkUserId) {
              const doc = await readAssignmentSubmission(
                selectedStudent.clerkUserId,
                assignment.id,
              );
              initialSubmission = doc ? toSubmissionView(doc) : null;
            } else if (selectedStudent) {
              initialSubmission = selectedStudent.vercelUrl
                ? {
                    githubUrl: selectedStudent.githubUrl ?? "",
                    vercelUrl: selectedStudent.vercelUrl,
                    updatedAt: new Date().toISOString(),
                    lastCheckedAt: selectedStudent.lastCheckedAt,
                    checkResults: selectedStudent.checkResults,
                    email: selectedStudent.email,
                    name: selectedStudent.name,
                    staffGrade: selectedStudent.staffGrade,
                    regradeResubmission: selectedStudent.regradeResubmission,
                    previousStaffGrade: selectedStudent.previousStaffGrade,
                  }
                : null;
            }
            if (selectedStudent) {
              reopenPanel = describeReopenPanel({
                records: reopenRecords,
                student: {
                  email: selectedStudent.email,
                  clerkUserId: selectedStudent.clerkUserId,
                  canvasUserId: selectedStudent.canvasUserId,
                },
                now,
              });
            }
          }
        }
      } catch (error) {
        console.error("assignment staff queue load failed", error);
      }

      if (canSubmit && !selectedStudent && supportsUrlSubmission(assignment.id)) {
        lockView = studentLockView({
          now: new Date(),
          dueAt: assignmentDueInstant({
            assignmentId: assignment.id,
            sharedDueDate: assignment.dueDate,
            section: roster.status === "matched" ? roster.entry.section : undefined,
          }),
          reopens: reopenRecords,
          student: {
            email:
              roster.status === "matched" ? roster.entry.email : emails[0],
            clerkUserId: userId,
            canvasUserId:
              roster.status === "matched"
                ? roster.entry.canvasUserId
                : canvasUserId,
          },
          hasSubmission: Boolean(ownSubmission),
          lastSubmittedAt: ownSubmission?.updatedAt,
        });
      }
    } else {
      const visibility = loggedOutSubmitVisibility(assignment.id, mongoReady);
      canSubmit = visibility.canSubmit;
      gateReason = visibility.gateReason ?? "sign_in";
    }
  } else {
    const visibility = loggedOutSubmitVisibility(assignment.id, false);
    canSubmit = visibility.canSubmit;
    gateReason = visibility.gateReason ?? "sign_in";
  }

  if (assignment.rubric && initialSubmission?.staffGrade) {
    initialGrade = gradeViewFromStaffGrade({
      studentClerkUserId: selectedStudent?.clerkUserId ?? serverUserId ?? "",
      assignmentId: assignment.id,
      githubUrl: initialSubmission.githubUrl,
      vercelUrl: initialSubmission.vercelUrl,
      criteria: listRubricCriteria(assignment.rubric).map((row) => ({
        id: row.id,
        points: row.points,
      })),
      staffGrade: initialSubmission.staffGrade,
      checkResults: initialSubmission.checkResults,
    });
  }

  const points = assignment.rubric
    ? rubricPointTotal(assignment.rubric)
    : null;

  return (
    <article className="page-content">
      <AssignmentHubNav current="detail" />
      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {assignment.canvasId}
      </p>
      <h1 className="mt-0 font-sans text-3xl font-semibold tracking-tight">
        {assignment.title}
      </h1>
      <p className="font-sans text-neutral-700">
        {assignment.dueDate
          ? `Due ${formatLongDate(assignment.dueDate)}`
          : null}
        {points != null
          ? `${assignment.dueDate ? " · " : ""}${points} pts`
          : null}
      </p>
      <p>{assignment.summary}</p>
      <p className="rounded-lg border-2 border-sky-400 bg-sky-50 px-4 py-3 font-sans text-sm text-sky-950">
        <span className="font-semibold">
          {COURSE_WEBSITE_ACCOUNT_COPY.heading}.{" "}
        </span>
        {COURSE_WEBSITE_ACCOUNT_COPY.assignmentAuthHint}
      </p>
      <AssignmentChapterLink assignment={assignment} />

      {supportsUrlSubmission(assignment.id) && !signedIn ? (
        <p className="rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3 font-sans text-sm text-neutral-800">
          {SIGN_IN_FOR_SUBMISSION_STATUS}
        </p>
      ) : null}

      {staffDiagnostics ? (
        <A1SubmitDiagnostics data={staffDiagnostics} />
      ) : null}

      {assignment.status === "coming_soon" || !assignment.rubric ? (
        <StatusPanel title="Checklist coming soon" tone="neutral">
          <p>
            The syllabus summary for {assignment.canvasId} is here. The
            Delivery / Lab / Kambaz checklist will be added when that
            chapter&apos;s rubric is ready. Work from{" "}
            <Link href={assignment.chapterHref}>{assignment.chapter}</Link>{" "}
            in the meantime.
          </p>
        </StatusPanel>
      ) : supportsUrlSubmission(assignment.id) ? (
        <A1WorkArea
          assignment={assignment}
          initialSubmission={initialSubmission}
          initialGrade={initialGrade}
          serverUserId={serverUserId}
          authEnabled={isClerkPublishableKeySet()}
          canSubmit={canSubmit}
          showSubmissionStatus={rosterMatched}
          impersonating={impersonating}
          gateReason={canSubmit ? null : gateReason}
          staffQueue={staffQueue}
          selectedStudent={selectedStudent}
          selectedSection={selectedSection}
          selectedFilter={selectedFilter}
          reopenFilter={reopenFilter}
          lockView={lockView}
          reopenPanel={reopenPanel}
        />
      ) : (
        <AssignmentChecklist
          assignment={assignment}
          rows={[]}
          scored={false}
          live={false}
          audience="student"
        />
      )}
    </article>
  );
}
