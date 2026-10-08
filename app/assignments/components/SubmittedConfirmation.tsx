import type { AssignmentSubmissionView } from "@/lib/assignments/submissions-store";
import {
  NOT_GRADED_YET,
  storedSubmissionLinks,
  submittedBannerHeading,
} from "@/lib/assignments/submission-status";

/**
 * The grade line comes from finalGrade (via A1WorkArea), the same function
 * the staff view and export use: "Graded: X / Y (Z%)" only when the grade is
 * ready for Canvas, otherwise "Grading in progress" with no percentage.
 */
export default function SubmittedConfirmation({
  submission,
  gradeLine,
}: {
  submission: AssignmentSubmissionView;
  gradeLine?: string;
}) {
  const heading =
    submittedBannerHeading(submission.updatedAt) ?? "Submitted";
  const links = storedSubmissionLinks(submission);

  return (
    <div
      role="status"
      className="mb-3 rounded-lg border-2 border-emerald-600 bg-emerald-50 px-4 py-3 font-sans text-sm text-emerald-950"
    >
      <p className="m-0 text-base font-semibold">{heading}</p>
      {links.length > 0 ? (
        <ul className="mb-0 mt-2 list-none space-y-1 p-0">
          {links.map((link) => (
            <li key={link.label} className="break-all">
              <span className="font-semibold">{link.label}: </span>
              {link.href ? (
                <a href={link.href} target="_blank" rel="noreferrer" className="underline">
                  {link.url}
                </a>
              ) : (
                <span>{link.url}</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mb-0 mt-2 font-semibold">{gradeLine ?? NOT_GRADED_YET}</p>
    </div>
  );
}
