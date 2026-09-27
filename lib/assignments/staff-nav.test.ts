import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("staff grader dropdowns", () => {
  const source = readFileSync(
    "app/assignments/components/StaffGraderNav.tsx",
    "utf8",
  );
  const selects = [...source.matchAll(/<select\b[\s\S]*?>/g)].map((match) => match[0]);

  it("renders Section, Show, and Student as closed form-select dropdowns", () => {
    assert.equal(selects.length, 3);
    assert.match(source, /"form-select mt-1 box-border block h-10 w-full/);
    for (const tag of selects) {
      assert.match(tag, /className=\{staffSelectClass\}/);
      assert.doesNotMatch(tag, /\bsize\s*=/);
      assert.doesNotMatch(tag, /\bmultiple\b/);
    }
    assert.match(source, /flex-nowrap items-end/);
    assert.match(source, />\s*Previous\s*</);
    assert.match(source, />\s*Next\s*</);
    assert.match(source, /staffGradeFilterLabel\(id, counts\[id\]\)/);
  });
});
