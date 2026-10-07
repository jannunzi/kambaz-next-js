"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { rerunAssignmentChecksBatch } from "../staff-actions";

type Progress = {
  processed: number;
  total: number;
  scored: number;
  needsRecheck: number;
  needsReviewItems: number;
  errors: number;
};

/**
 * Staff-only tools: re-check every submission and save the results, and
 * download the grade export and the missed-items summary.
 */
export default function StaffBatchTools({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function rerunAll() {
    if (
      !window.confirm(
        "Re-check every submission and save the results? This replaces each submission's stored check results. It does not change submission times, URLs, or saved staff grades.",
      )
    ) {
      return;
    }
    setRunning(true);
    setError(null);
    const totals: Progress = {
      processed: 0,
      total: 0,
      scored: 0,
      needsRecheck: 0,
      needsReviewItems: 0,
      errors: 0,
    };
    setProgress({ ...totals });
    let offset: number | null = 0;
    try {
      while (offset !== null) {
        const result = await rerunAssignmentChecksBatch({ assignmentId, offset });
        if (!result.ok) {
          setError(result.message);
          break;
        }
        totals.processed = result.processed;
        totals.total = result.total;
        totals.scored += result.scored;
        totals.needsRecheck += result.needsRecheck;
        totals.needsReviewItems += result.needsReviewItems;
        totals.errors += result.errors.length;
        setProgress({ ...totals });
        offset = result.nextOffset;
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Re-run stopped.");
    } finally {
      setRunning(false);
      router.refresh();
    }
  }

  return (
    <section className="mb-6 rounded-lg border border-neutral-300 bg-white p-4 font-sans shadow-sm">
      <h2 className="mt-0 mb-1 text-lg font-semibold">Staff tools</h2>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="h-10 rounded border border-neutral-800 bg-neutral-800 px-3 text-sm text-white hover:bg-neutral-700 disabled:opacity-60"
          disabled={running}
          onClick={rerunAll}
        >
          {running ? "Re-running…" : "Re-run all and save"}
        </button>
        <a
          className="inline-flex h-10 items-center rounded border border-neutral-800 bg-white px-3 text-sm hover:bg-neutral-50"
          href={`/assignments/${assignmentId}/export`}
        >
          Download grade export (CSV)
        </a>
        <a
          className="inline-flex h-10 items-center rounded border border-neutral-800 bg-white px-3 text-sm hover:bg-neutral-50"
          href={`/assignments/${assignmentId}/export?view=summary`}
        >
          Most-missed items (CSV)
        </a>
      </div>
      {progress ? (
        <p className="mb-0 mt-2 text-sm text-neutral-800" role="status">
          Re-checked {progress.processed} of {progress.total}. {progress.scored} scored,{" "}
          {progress.needsRecheck} need re-check (deploy could not be opened),{" "}
          {progress.needsReviewItems} item{progress.needsReviewItems === 1 ? "" : "s"} need TA review
          {progress.errors ? `, ${progress.errors} failed to run` : ""}.
        </p>
      ) : null}
      {error ? <p className="mb-0 mt-2 text-sm text-amber-800">{error}</p> : null}
    </section>
  );
}
