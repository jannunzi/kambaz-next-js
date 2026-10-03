import "server-only";

import { isMongoConfigured } from "../config";
import { mergeDemoRosterEntries } from "./demo-students";
import { rosterDocumentEmails } from "./emails";
import { getRosterCollection } from "./lookup";
import type { CanvasRosterEntry } from "./types";

export type CanvasRosterListResult =
  | { status: "not_configured" }
  | { status: "ok"; entries: CanvasRosterEntry[] };

const ROSTER_LIST_PROJECTION = {
  _id: 0,
  email: 1,
  Email: 1,
  canvasUserId: 1,
  sisUserId: 1,
  sis_user_id: 1,
  sisLoginId: 1,
  sis_login_id: 1,
  loginId: 1,
  login_id: 1,
  emails: 1,
  name: 1,
  section: 1,
} as const;

function withDisplayEmail(entry: CanvasRosterEntry): CanvasRosterEntry {
  const emails = rosterDocumentEmails(entry);
  if (entry.email?.trim()) return entry;
  if (emails[0]) return { ...entry, email: emails[0] };
  return entry;
}

/**
 * Full Canvas roster for the instructor People page.
 * Call only after a server-side instructor gate.
 */
export async function listCanvasRoster(): Promise<CanvasRosterListResult> {
  if (!isMongoConfigured()) {
    return { status: "not_configured" };
  }

  const collection = await getRosterCollection();
  const entries = await collection
    .find({})
    .project<CanvasRosterEntry>(ROSTER_LIST_PROJECTION)
    .toArray();

  return {
    status: "ok",
    entries: mergeDemoRosterEntries(entries.map(withDisplayEmail)),
  };
}
