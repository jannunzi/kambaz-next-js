"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ReopenPanelState } from "@/lib/assignments/lock";
import { formatSubmittedTimestamp } from "@/lib/assignments/submission-status";
import { updateAssignmentReopen } from "../staff-actions";

export default function ReopenSubmissionPanel({
  assignmentId,
  studentKey,
  studentName,
  panel,
  canReopen,
}: {
  assignmentId: string;
  studentKey: string;
  studentName: string;
  panel: ReopenPanelState;
  canReopen: boolean;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState(panel.active?.message ?? "");
  const [days, setDays] = useState("7");
  const [exactDate, setExactDate] = useState("");
  const [exactTime, setExactTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openDialog() {
    setError(null);
    setMessage(panel.active?.message ?? "");
    dialogRef.current?.showModal();
  }

  function submit(action: "open" | "extend" | "restart" | "close") {
    setError(null);
    if (action !== "close" && !message.trim()) {
      setError("Enter a feedback message for the student.");
      return;
    }
    startTransition(async () => {
      const result = await updateAssignmentReopen({
        assignmentId,
        studentKey,
        action,
        message,
        days: days.trim() === "" ? undefined : Number(days),
        exactDate: exactDate || undefined,
        exactTime: exactTime || undefined,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      dialogRef.current?.close();
      router.refresh();
    });
  }

  return (
    <section className="mb-6 rounded-lg border border-sky-300 bg-white p-4 font-sans shadow-sm">
      <h2 className="mt-0 mb-1 text-lg font-semibold">Resubmission</h2>
      {panel.active ? (
        <p className="mt-0 mb-2 text-sm text-sky-950">
          <span className="mr-2 inline-block rounded-full border border-sky-700 bg-sky-100 px-2 py-0.5 text-xs font-semibold">
            {panel.active.badge}
          </span>
          {panel.active.openUntil}. {studentName} can resubmit until then.
        </p>
      ) : (
        <p className="mt-0 mb-2 text-sm text-neutral-800">
          Submissions follow the assignment due date. Open a window if{" "}
          {studentName} should submit again after that.
        </p>
      )}
      {panel.active ? (
        <p className="mt-0 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-950">
          {panel.active.message}
        </p>
      ) : null}
      {canReopen ? (
        <button
          type="button"
          className="rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm text-white hover:bg-neutral-700"
          onClick={openDialog}
        >
          {panel.active ? "Change resubmission window" : "Open for resubmission"}
        </button>
      ) : (
        <p className="mb-0 text-sm text-neutral-700">
          View as student cannot change a resubmission window.
        </p>
      )}
      {panel.history.length > 0 ? (
        <ol className="mb-0 mt-3 list-decimal space-y-1 pl-5 text-sm text-neutral-800">
          {panel.history.map((item) => (
            <li key={`${item.action}:${item.openedAt}:${item.closesAt}`}>
              {item.action} {formatSubmittedTimestamp(item.openedAt) ?? item.openedAt}
              {item.action === "close"
                ? " — closed early"
                : ` — until ${formatSubmittedTimestamp(item.closesAt) ?? item.closesAt}`}
              {item.openedBy ? ` by ${item.openedBy}` : ""}
            </li>
          ))}
        </ol>
      ) : null}

      <dialog
        ref={dialogRef}
        className="w-[min(36rem,calc(100vw-2rem))] rounded-lg border border-neutral-300 p-0 shadow-xl backdrop:bg-neutral-950/40"
        aria-labelledby={`${assignmentId}-reopen-title`}
      >
        <form
          className="p-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit(panel.active ? "extend" : "open");
          }}
        >
          <h3 id={`${assignmentId}-reopen-title`} className="mt-0 text-lg font-semibold">
            {panel.active ? "Change the resubmission window" : "Open for resubmission"}
          </h3>
          <p className="text-sm text-neutral-800">
            Students can still submit until the assignment due date. This window
            is what lets {studentName} submit after that. The feedback message
            is required.
          </p>
          <label className="block text-sm font-semibold" htmlFor={`${assignmentId}-reopen-message`}>
            Feedback message
            <textarea
              id={`${assignmentId}-reopen-message`}
              required
              rows={4}
              className="mt-1 box-border w-full rounded border border-neutral-400 px-3 py-2 font-normal"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="text-sm font-semibold" htmlFor={`${assignmentId}-reopen-days`}>
              Days
              <input
                id={`${assignmentId}-reopen-days`}
                type="number"
                min={1}
                max={366}
                className="mt-1 box-border w-full rounded border border-neutral-400 px-3 py-2 font-normal"
                value={days}
                onChange={(event) => setDays(event.target.value)}
              />
            </label>
            <label className="text-sm font-semibold" htmlFor={`${assignmentId}-reopen-date`}>
              Or date (ET)
              <input
                id={`${assignmentId}-reopen-date`}
                type="date"
                className="mt-1 box-border w-full rounded border border-neutral-400 px-3 py-2 font-normal"
                value={exactDate}
                onChange={(event) => setExactDate(event.target.value)}
              />
            </label>
            <label className="text-sm font-semibold" htmlFor={`${assignmentId}-reopen-time`}>
              Time (ET)
              <input
                id={`${assignmentId}-reopen-time`}
                type="time"
                className="mt-1 box-border w-full rounded border border-neutral-400 px-3 py-2 font-normal"
                value={exactTime}
                onChange={(event) => setExactTime(event.target.value)}
              />
            </label>
          </div>
          <p className="text-sm text-neutral-700">
            Leave the date blank to use the day count. The default is 7 days.
            Extend adds those days to the current deadline. Restart the clock
            sets it to now plus that many days.
          </p>
          {error ? (
            <p className="text-sm text-amber-800" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {panel.active ? (
              <>
                <button
                  type="submit"
                  className="rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm text-white disabled:opacity-60"
                  disabled={pending}
                >
                  {pending ? "Saving…" : "Extend deadline"}
                </button>
                <button
                  type="button"
                  className="rounded border border-neutral-800 bg-white px-3 py-2 text-sm disabled:opacity-60"
                  disabled={pending}
                  onClick={() => submit("restart")}
                >
                  Restart clock
                </button>
                <button
                  type="button"
                  className="rounded border border-neutral-800 bg-white px-3 py-2 text-sm disabled:opacity-60"
                  disabled={pending}
                  onClick={() => submit("close")}
                >
                  Close early
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm text-white disabled:opacity-60"
                disabled={pending}
              >
                {pending ? "Saving…" : "Open for resubmission"}
              </button>
            )}
            <button
              type="button"
              className="rounded border border-neutral-400 bg-white px-3 py-2 text-sm"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
