import { auth } from "@clerk/nextjs/server";
import { canViewStaffGrader, supportsUrlSubmission } from "@/lib/assignments/access";
import { getAssignment } from "@/lib/assignments/catalog";
import {
  buildSubmissionExportRows,
  missedItemSummary,
  missedItemSummaryCsv,
  submissionExportCsv,
} from "@/lib/assignments/export";
import { buildStaffStudentQueue } from "@/lib/assignments/staff";
import { listSubmissionsForAssignment } from "@/lib/assignments/submissions";
import { isAssignmentProgressConfigured } from "@/lib/config";
import { listCanvasRoster } from "@/lib/roster/list";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";

export const dynamic = "force-dynamic";

/**
 * Staff-only CSV export.
 *   /assignments/a1/export               one row per submission
 *   /assignments/a1/export?view=summary  missed-count per rubric item
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ assignmentId: string }> },
) {
  const { assignmentId } = await context.params;
  const assignment = getAssignment(assignmentId);
  if (!assignment?.rubric || !supportsUrlSubmission(assignmentId)) {
    return new Response("Not found", { status: 404 });
  }
  const { userId } = await auth();
  if (!userId) return new Response("Sign in as course staff.", { status: 401 });
  const staff = await isActualStaff();
  const impersonating = await isImpersonatingStudent();
  if (!canViewStaffGrader(staff, impersonating)) {
    return new Response("This export is for course staff only.", { status: 403 });
  }
  if (!isAssignmentProgressConfigured()) {
    return new Response("Submissions are not configured.", { status: 503 });
  }

  const [roster, submissions] = await Promise.all([
    listCanvasRoster(),
    listSubmissionsForAssignment(assignment.id),
  ]);
  const queue = buildStaffStudentQueue(
    roster.status === "ok" ? roster.entries : [],
    submissions,
  );
  const rows = buildSubmissionExportRows({
    assignmentId: assignment.id,
    rubric: assignment.rubric,
    queue,
  });

  const view = new URL(request.url).searchParams.get("view");
  const date = new Date().toISOString().slice(0, 10);
  const summary = view === "summary";
  const csv = summary
    ? missedItemSummaryCsv(
        missedItemSummary({ assignmentId: assignment.id, rubric: assignment.rubric, rows }),
      )
    : submissionExportCsv(assignment.rubric, rows);
  const filename = summary
    ? `${assignment.id}-missed-items-${date}.csv`
    : `${assignment.id}-auto-grades-${date}.csv`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
