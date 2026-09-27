import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("canvas roster lookup projection", () => {
  it("loads emails so an alias reaches the student banner, same as the staff list", () => {
    const lookup = readFileSync(new URL("./lookup.ts", import.meta.url), "utf8");
    const list = readFileSync(new URL("./list.ts", import.meta.url), "utf8");
    const projection = lookup.slice(
      lookup.indexOf("const ROSTER_MATCH_PROJECTION"),
      lookup.indexOf("} as const;"),
    );
    assert.match(projection, /emails:\s*1/);
    assert.match(list, /emails:\s*1/);
    assert.doesNotMatch(projection, /emails:\s*0/);
  });
});
