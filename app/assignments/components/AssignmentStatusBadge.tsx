import {
  submissionStatusLabel,
  type StudentSubmissionStatus,
} from "@/lib/assignments/submission-status";

const TONE: Record<StudentSubmissionStatus, string> = {
  not_submitted: "border-neutral-400 bg-neutral-100 text-neutral-800",
  submitted: "border-emerald-600 bg-emerald-50 text-emerald-950",
  graded: "border-emerald-800 bg-emerald-100 text-emerald-950",
};

export default function AssignmentStatusBadge({
  status,
}: {
  status: StudentSubmissionStatus;
}) {
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 align-middle font-sans text-xs font-semibold ${TONE[status]}`}
    >
      {submissionStatusLabel(status)}
    </span>
  );
}
