import mongoose from "mongoose";

let connected = false;
/** @type {Promise<boolean> | null} */
let connectPromise = null;

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
 * A failed attempt is forgotten so the next request tries again.
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

function startConnect() {
  if (connectPromise) return connectPromise;
  const uri = mongoConnectionString();
  if (!uri) {
    connectPromise = Promise.resolve(false);
    return connectPromise;
  }
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
        console.log("[kambaz] Connected to MongoDB");
        return true;
      },
      async (err) => {
        connected = false;
        console.warn(
          "[kambaz] MongoDB unavailable:",
          err instanceof Error ? err.message : err,
        );
        // Close the dead driver before the next request opens a new one.
        await mongoose.disconnect().catch(() => {});
        if (connectPromise === attempt) connectPromise = null;
        return false;
      },
    );
  } catch (err) {
    connected = false;
    console.warn(
      "[kambaz] MongoDB unavailable:",
      err instanceof Error ? err.message : err,
    );
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
