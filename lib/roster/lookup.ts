import "server-only";

import { isMongoConfigured } from "../config";
import { getCollection } from "../mongo";
import { DEMO_ROSTER_STUDENTS, isDemoRosterEmail } from "./demo-students";
import { normalizeEmail, parseRosterEmailsEnv } from "./emails";
import { upsertDemoRosterStudents } from "./ensure-demo";
import { matchRoster, rosterIdentityMatchFilter } from "./match";
import type { CanvasRosterEntry, RosterLookupResult } from "./types";
import { impersonationRosterMatch } from "./view-mode";

export const CANVAS_ROSTER_COLLECTION = "canvas_roster";

const ROSTER_MATCH_PROJECTION = {
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
  source: 1,
} as const;

export async function getRosterCollection() {
  return getCollection<CanvasRosterEntry>(CANVAS_ROSTER_COLLECTION);
}

/**
 * Match a signed-in Clerk user to canvas_roster.
 *
 * Real students are matched with a targeted Atlas read (email / SIS login
 * / Canvas id). find({}) is only a fallback. `$expr` is not used — it can
 * miss or fail on Atlas and hide the Submit URLs fields.
 *
 * Ada Lovelace (`ada@ada.com`) and Bob Marley (`bob@bob.com`) are built-in
 * demo rows. They match even when Atlas is empty or the `find` throws, so
 * staff testing is not blocked on a prior seed. A successful Ada/Bob lookup
 * also upserts those rows when Mongo is reachable.
 */
function matchBuiltInAllowlists(input: {
  emails: string[];
  canvasUserIds?: string[];
}): Extract<RosterLookupResult, { status: "matched" }> | null {
  const result = matchRoster({
    emails: input.emails,
    canvasUserIds: input.canvasUserIds,
    mongoEntries: [],
    envEmails: parseRosterEmailsEnv(process.env.CANVAS_ROSTER_EMAILS),
    mongoCount: 0,
  });
  return result.status === "matched" ? result : null;
}

async function persistDemoRosterIfConfigured(): Promise<void> {
  if (!isMongoConfigured()) return;
  try {
    const collection = await getRosterCollection();
    await upsertDemoRosterStudents(collection);
  } catch (error) {
    console.error("demo roster upsert during lookup failed", error);
  }
}

export async function lookupCanvasRoster(input: {
  emails: string[];
  canvasUserIds?: string[];
  /** Staff “View as student”: synthetic Demo Student, no Mongo read or write. */
  impersonating?: boolean;
}): Promise<RosterLookupResult> {
  const dummy = impersonationRosterMatch(Boolean(input.impersonating));
  if (dummy) return dummy;

  // Ada / Bob (and CANVAS_ROSTER_EMAILS) match before any Atlas read so a
  // find({}) failure cannot relabel them as not_configured.
  const builtIn = matchBuiltInAllowlists(input);
  if (builtIn) {
    if (input.emails.some((email) => isDemoRosterEmail(email))) {
      await persistDemoRosterIfConfigured();
    }
    return builtIn;
  }

  if (!isMongoConfigured()) {
    return { status: "not_configured" };
  }

  const envEmails = parseRosterEmailsEnv(process.env.CANVAS_ROSTER_EMAILS);

  try {
    const collection = await getRosterCollection();

    // Targeted read first. find({}) can time out or fail on Atlas and then
    // relabel a rostered student (chen.rya@…) as not_configured. Ada/Bob
    // already returned above; real students need this query to succeed.
    const identityFilter = rosterIdentityMatchFilter({
      emails: input.emails,
      canvasUserIds: input.canvasUserIds,
    });
    if (identityFilter) {
      try {
        const hits = await collection
          .find(identityFilter)
          .project<CanvasRosterEntry>(ROSTER_MATCH_PROJECTION)
          .toArray();
        const targeted = matchRoster({
          emails: input.emails,
          canvasUserIds: input.canvasUserIds,
          mongoEntries: hits,
          envEmails,
          mongoCount: Math.max(hits.length, 1),
        });
        if (targeted.status === "matched") return targeted;
        if (hits.length === 0) {
          return matchRoster({
            emails: input.emails,
            canvasUserIds: input.canvasUserIds,
            mongoEntries: [],
            envEmails,
            mongoCount: await countRosterDocuments(collection),
          });
        }
        return targeted;
      } catch (error) {
        console.error("canvas roster targeted lookup failed", error);
      }
    }

    const mongoEntries = await collection
      .find({})
      .project<CanvasRosterEntry>(ROSTER_MATCH_PROJECTION)
      .toArray();
    const missingDemo = DEMO_ROSTER_STUDENTS.some(
      (demo) =>
        !mongoEntries.some(
          (row) =>
            normalizeEmail(row.email) === normalizeEmail(demo.email),
        ),
    );
    if (missingDemo) {
      try {
        await upsertDemoRosterStudents(collection);
      } catch (error) {
        console.error("demo roster upsert during lookup failed", error);
      }
    }

    return matchRoster({
      emails: input.emails,
      canvasUserIds: input.canvasUserIds,
      mongoEntries,
      envEmails,
      mongoCount: mongoEntries.length,
    });
  } catch (error) {
    console.error("canvas roster lookup failed", error);
    if (input.emails.length > 0) {
      return matchBuiltInAllowlists(input) ?? { status: "not_on_roster" };
    }
    return matchBuiltInAllowlists(input) ?? { status: "not_configured" };
  }
}

async function countRosterDocuments(
  collection: Awaited<ReturnType<typeof getRosterCollection>>,
): Promise<number> {
  try {
    return await collection.countDocuments();
  } catch (error) {
    console.error("canvas roster count failed", error);
    // We attempted a read against a configured roster. Treat as a miss
    // (not empty / not_configured) so the student sees the roster message.
    return 1;
  }
}

export async function ensureRosterIndexes(): Promise<void> {
  const collection = await getRosterCollection();
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.createIndex(
    { canvasUserId: 1 },
    { unique: true, sparse: true },
  );
}
