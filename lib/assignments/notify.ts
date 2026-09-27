import type { ReopenAction } from "./lock";
import { formatSubmittedTimestamp } from "./submission-status";

/**
 * Reopen notices for the student.
 *
 * No email provider (Resend, nodemailer, or similar) is installed.
 * `ASSIGNMENT_NOTIFY_PROVIDER` selects a delivery channel:
 * - `log` (default) records the notice and leaves a TODO for a real provider
 * - `noop` drops the notice (tests)
 * - any other value is logged and not sent
 *
 * Piazza and Canvas posts stay outside this app. Subscribe with
 * `onAssignmentReopenEvent` and send those notices from the listener.
 */
export type AssignmentReopenEvent = {
  type: "assignment.reopen";
  action: ReopenAction;
  assignmentId: string;
  rosterEmail?: string;
  clerkUserId?: string;
  canvasUserId?: string;
  studentName?: string;
  message: string;
  closesAt: string | null;
  openedAt: string;
  openedBy: string;
};

export type ReopenEmail = {
  to: string;
  subject: string;
  text: string;
};

export type ReopenNoticeDelivery = {
  delivered: boolean;
  channel: "noop" | "log";
};

export type AssignmentNotifier = {
  notify(event: AssignmentReopenEvent): Promise<ReopenNoticeDelivery>;
};

type ReopenListener = (event: AssignmentReopenEvent) => void | Promise<void>;

const listeners = new Set<ReopenListener>();

export function onAssignmentReopenEvent(listener: ReopenListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function reopenNoticeShouldEmail(action: ReopenAction): boolean {
  return action === "open" || action === "extend" || action === "restart";
}

export function formatReopenEmail(event: AssignmentReopenEvent): ReopenEmail | null {
  const to = event.rosterEmail?.trim();
  if (!to) return null;
  const when = event.closesAt ? formatSubmittedTimestamp(event.closesAt) : null;
  const assignment = event.assignmentId.toUpperCase();
  const subject =
    event.action === "open"
      ? `${assignment} is open for resubmission`
      : `${assignment} resubmission window updated`;
  const lines = [event.message.trim()];
  if (when) lines.push(`Open until ${when}.`);
  lines.push("Resubmit on the course website.");
  return { to, subject, text: lines.filter(Boolean).join("\n\n") };
}

export async function publishAssignmentReopenEvent(
  event: AssignmentReopenEvent,
  notifier: AssignmentNotifier,
): Promise<void> {
  for (const listener of [...listeners]) {
    try {
      await listener(event);
    } catch (error) {
      console.error("assignment reopen listener failed", error);
    }
  }
  if (!reopenNoticeShouldEmail(event.action)) return;
  await notifier.notify(event);
}

export function createAssignmentNotifier(
  env?: { ASSIGNMENT_NOTIFY_PROVIDER?: string },
  log: (message: string, details: unknown) => void = console.info,
): AssignmentNotifier {
  const provider =
    (env ?? process.env).ASSIGNMENT_NOTIFY_PROVIDER?.trim().toLowerCase() ||
    "log";
  return {
    async notify(event) {
      if (provider === "noop") {
        return { delivered: false, channel: "noop" };
      }
      const email = formatReopenEmail(event);
      // TODO: Wire Resend, nodemailer, or another provider. Nothing is sent.
      log("TODO assignment reopen email", {
        provider,
        todo: "Wire an email provider before this notice can be delivered.",
        email,
        event,
      });
      return { delivered: false, channel: "log" };
    },
  };
}
