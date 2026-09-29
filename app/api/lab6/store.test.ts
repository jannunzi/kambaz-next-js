import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { lab6Todos, mongoStatus } from "./store";

const CONNECTION_KEYS = [
  "DATABASE_CONNECTION_STRING",
  "MONGO_CONNECTION_STRING",
] as const;

const saved = Object.fromEntries(
  CONNECTION_KEYS.map((key) => [key, process.env[key]]),
);

function restoreEnv() {
  for (const key of CONNECTION_KEYS) {
    const value = saved[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function clearConnectionEnv() {
  for (const key of CONNECTION_KEYS) delete process.env[key];
}

describe("Lab 6 connection status", () => {
  afterEach(() => {
    restoreEnv();
  });

  it("does not name an in-memory store when the connection string is unset", () => {
    clearConnectionEnv();
    const status = mongoStatus();
    assert.equal(status.mongo, false);
    assert.equal(status.database, "not configured");
    assert.equal(
      "note" in status ? status.note : undefined,
      "DATABASE_CONNECTION_STRING is not set.",
    );
    assert.equal("store" in status, false);
    assert.equal(JSON.stringify(status).includes("memory"), false);
    assert.equal(lab6Todos()[0]?.title, "Learn MongoDB");
  });

  it("stays disconnected when the string is set but Mongo is unreachable", () => {
    clearConnectionEnv();
    process.env.DATABASE_CONNECTION_STRING = "mongodb://127.0.0.1:27017/kambaz";
    const status = mongoStatus();
    assert.equal(status.mongo, false);
    assert.equal(status.database, "configured");
    assert.equal("note" in status, false);
    assert.equal(JSON.stringify(status).includes("memory"), false);
  });

  it("treats MONGO_CONNECTION_STRING as configured and still disconnected", () => {
    clearConnectionEnv();
    process.env.MONGO_CONNECTION_STRING = "mongodb://127.0.0.1:27017/kambaz";
    const status = mongoStatus();
    assert.equal(status.mongo, false);
    assert.equal(status.database, "configured");
    assert.equal("note" in status, false);
  });
});
