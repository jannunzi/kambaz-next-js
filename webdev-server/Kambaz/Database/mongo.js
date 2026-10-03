import mongoose from "mongoose";

let connected = false;
/** @type {Promise<boolean> | null} */
let connectPromise = null;
/** Epoch ms of the last failed attempt, or 0 when there is nothing to cool down. */
let lastFailureAt = 0;

/** Pause before another connect after a failure. Tests override with MONGO_RETRY_COOLDOWN_MS. */
const CONNECT_COOLDOWN_MS = 10_000;

/**
 * PDF: DATABASE_CONNECTION_STRING
 * Also accepted: MONGO_CONNECTION_STRING (CI / book env).
 *
 * isMongoConfigured() is true when a connection string is set. DAOs take
 * the Mongo path in that case and wait for this connection; they do not
 * use in-memory arrays just because the driver is not connected yet.
 * isMongoConnected() is only for /lab6/status `mongo`.
 *
 * No string → in-memory DAOs. A string that never connects → 503.
 * After a failure, requests fail immediately until CONNECT_COOLDOWN_MS
 * elapses. The next request then starts one shared connect attempt.
 * connectDatabase() returns before the connection so listen is not blocked.
 */
export function mongoConnectionString() {
  return (
    process.env.DATABASE_CONNECTION_STRING ||
    process.env.MONGO_CONNECTION_STRING ||
    ""
  );
}

export function isMongoConfigured() {
  return Boolean(mongoConnectionString());
}

export function isMongoConnected() {
  return connected;
}

function serverSelectionTimeoutMS() {
  const raw = process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS;
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function connectCooldownMS() {
  const raw = process.env.MONGO_RETRY_COOLDOWN_MS;
  if (raw == null || raw === "") return CONNECT_COOLDOWN_MS;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : CONNECT_COOLDOWN_MS;
}

function coolingDown() {
  return lastFailureAt > 0 && Date.now() - lastFailureAt < connectCooldownMS();
}

function noteFailure(err) {
  connected = false;
  lastFailureAt = Date.now();
  console.warn(
    "[kambaz] MongoDB unavailable:",
    err instanceof Error ? err.message : err,
  );
}

function startConnect() {
  // One in-flight attempt. Callers that arrive while it is running share it.
  if (connectPromise) return connectPromise;
  const uri = mongoConnectionString();
  if (!uri) {
    connectPromise = Promise.resolve(false);
    return connectPromise;
  }
  // Fail fast until the cooldown elapses, then the next request may connect.
  if (coolingDown()) return Promise.resolve(false);
  const timeout = serverSelectionTimeoutMS();
  const options = { bufferCommands: true };
  if (timeout) {
    options.serverSelectionTimeoutMS = timeout;
    mongoose.set("bufferTimeoutMS", timeout);
  }
  let attempt;
  try {
    attempt = mongoose.connect(uri, options).then(
      () => {
        connected = true;
        lastFailureAt = 0;
        console.log("[kambaz] Connected to MongoDB");
        return true;
      },
      async (err) => {
        noteFailure(err);
        // Close the dead driver before a later request opens a new one.
        await mongoose.disconnect().catch(() => {});
        if (connectPromise === attempt) connectPromise = null;
        return false;
      },
    );
  } catch (err) {
    noteFailure(err);
    connectPromise = null;
    return Promise.resolve(false);
  }
  connectPromise = attempt;
  return attempt;
}

export class DatabaseUnavailableError extends Error {
  constructor() {
    super("Database unavailable");
    this.name = "DatabaseUnavailableError";
    this.statusCode = 503;
  }
}

/** Query and save hooks await the shared connection, then fail closed. */
async function waitForDatabase() {
  if (!isMongoConfigured()) return;
  const ok = await startConnect();
  if (!ok) throw new DatabaseUnavailableError();
}

const queryOps = [
  "find",
  "findOne",
  "findOneAndDelete",
  "findOneAndUpdate",
  "findOneAndReplace",
  "updateOne",
  "updateMany",
  "deleteOne",
  "deleteMany",
  "replaceOne",
  "countDocuments",
];

mongoose.plugin((schema) => {
  for (const op of queryOps) {
    schema.pre(op, function waitForMongo() {
      return waitForDatabase();
    });
  }
  schema.pre("save", function waitForMongo() {
    return waitForDatabase();
  });
});

export async function connectDatabase() {
  const uri = mongoConnectionString();
  if (!uri) {
    console.log(
      "[kambaz] No DATABASE_CONNECTION_STRING / MONGO_CONNECTION_STRING — in-memory DAOs",
    );
    return false;
  }
  // Start the connection and return. index.js awaits this before listen;
  // awaiting the driver here would block on server selection (~30s).
  startConnect();
  return false;
}

function isDatabaseUnavailable(err, depth = 0) {
  if (!err || depth > 5) return false;
  if (err.statusCode === 503 || err.name === "DatabaseUnavailableError") return true;
  if (
    err.name === "MongoServerSelectionError" ||
    err.name === "MongooseServerSelectionError"
  ) {
    return true;
  }
  if (/buffering timed out/i.test(String(err.message ?? ""))) return true;
  return isDatabaseUnavailable(err.cause, depth + 1);
}

export function databaseErrorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }
  if (isDatabaseUnavailable(err)) {
    res.status(503).json({ error: "Database unavailable" });
    return;
  }
  next(err);
}
