import mongoose from "mongoose";

let connected = false;

/**
 * PDF: DATABASE_CONNECTION_STRING
 * Also accepted: MONGO_CONNECTION_STRING (CI / book env).
 * Unset or unreachable → in-memory DAOs so the server still boots.
 * The driver handshake runs in the background: index.js awaits this
 * function before listen, and an unreachable host must not block it.
 */
export function mongoConnectionString() {
  return (
    process.env.DATABASE_CONNECTION_STRING ||
    process.env.MONGO_CONNECTION_STRING ||
    ""
  );
}

export function isMongoEnabled() {
  return connected;
}

export async function connectDatabase() {
  const uri = mongoConnectionString();
  if (!uri) {
    console.log(
      "[kambaz] No DATABASE_CONNECTION_STRING / MONGO_CONNECTION_STRING — in-memory DAOs",
    );
    return false;
  }
  // Do not await. serverSelectionTimeoutMS defaults to 30s, so a dead
  // host would hold listen() if this promise were returned to index.js.
  // isMongoEnabled() flips to true when the handshake succeeds.
  try {
    mongoose.connect(uri).then(
      () => {
        connected = true;
        console.log("[kambaz] Connected to MongoDB");
      },
      (err) => {
        connected = false;
        console.warn(
          "[kambaz] MongoDB unavailable, using in-memory DAOs:",
          err instanceof Error ? err.message : err,
        );
      },
    );
  } catch (err) {
    connected = false;
    console.warn(
      "[kambaz] MongoDB unavailable, using in-memory DAOs:",
      err instanceof Error ? err.message : err,
    );
  }
  return false;
}
