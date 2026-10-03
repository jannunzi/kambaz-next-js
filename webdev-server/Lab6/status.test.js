import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { lab6Status } from "./status.js";

const NOTE_UNSET = "DATABASE_CONNECTION_STRING is not set.";

describe("Express Lab 6 status", () => {
  it("reports not configured when the connection string is unset", () => {
    const status = lab6Status({ connectionString: "", connected: false });
    assert.deepEqual(status, {
      mongo: false,
      database: "not configured",
      note: NOTE_UNSET,
    });
    assert.equal(JSON.stringify(status).includes("memory"), false);
  });

  it("stays configured when the string is set but Mongo is not connected", () => {
    const status = lab6Status({
      connectionString: "mongodb://127.0.0.1:27017/kambaz",
      connected: false,
    });
    assert.deepEqual(status, {
      mongo: false,
      database: "configured",
    });
    assert.equal("note" in status, false);
  });

  it("sets mongo only after a connection", () => {
    const status = lab6Status({
      connectionString: "mongodb://127.0.0.1:27017/kambaz",
      connected: true,
    });
    assert.deepEqual(status, {
      mongo: true,
      database: "configured",
    });
    assert.equal("note" in status, false);
  });
});
