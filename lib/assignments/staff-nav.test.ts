import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("staff grader dropdowns", () => {
  const source = readFileSync(
    "app/assignments/components/StaffGraderNav.tsx",
    "utf8",
  );
  const selects = [...source.matchAll(/<select\b[\s\S]*?>/g)].map((match) => match[0]);

  it("renders Section, Show, Resubmission, and Student as closed dropdowns", () => {
    assert.equal(selects.length, 4);
    assert.match(source, /htmlFor="staff-reopen-filter"/);
    assert.match(source, /id="staff-reopen-filter"/);
    assert.doesNotMatch(source, /form-select/);
    assert.match(source, /"mt-1 box-border block h-10 w-full/);
    for (const tag of selects) {
      assert.match(tag, /className=\{staffSelectClass\}/);
      assert.doesNotMatch(tag, /\bsize\s*=/);
      assert.doesNotMatch(tag, /\bmultiple\b/);
      assert.doesNotMatch(tag, /aria-label/);
    }
    assert.match(source, /htmlFor="staff-show-filter"/);
    assert.match(source, /id="staff-show-filter"/);
    const optionFn = source.slice(
      source.indexOf("function studentOptionLabel"),
      source.indexOf("function selectedScore"),
    );
    assert.doesNotMatch(optionFn, /priorSubmissionLabel|formatPointsPercent|email/);
    assert.match(source, /priorSubmissionLabel\(selectedRow\.priorSubmissions\)/);
    assert.match(source, /flex-nowrap items-end/);
    assert.match(source, />\s*Previous\s*</);
    assert.match(source, />\s*Next\s*</);
    assert.match(source, /staffGradeFilterLabel\(id, counts\[id\]\)/);
  });
});
