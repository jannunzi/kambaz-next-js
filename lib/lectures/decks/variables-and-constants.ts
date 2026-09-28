import type { LectureSlide } from "../types";

export const VARIABLES_AND_CONSTANTS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Variables and Constants",
      "§3.2.1 · `var`, `let`, `const`, and JSX interpolation",
    ],
  },
  {
    id: "purpose",
    title: "Variables store application state",
    kind: "content",
    bullets: [
      "User info, preferences, courses, enrollments — all values in memory",
      "JavaScript offers three declarations. Prefer `let` and `const`",
      "Create `VariablesAndConstants` and import it from Lab 3",
      "Confirm the browser prints the numbers from the sample",
    ],
  },
  {
    id: "three-keywords",
    title: "Three ways to declare a value",
    kind: "content",
    bullets: [
      "`var` — function-scoped, the old default. Avoid in new code",
      "`let` — block-scoped, use when the value will change",
      "`const` — block-scoped, not reassigned after the first write",
      "A `const` object’s *properties* can still change. The binding cannot",
    ],
  },
  {
    id: "sample",
    title: "Declare, compute, interpolate",
    kind: "demo",
    bullets: [
      "`constant1` is the difference of the other two — the page shows `-3`",
      "Curly braces in JSX interpolate a JavaScript expression",
      "`{functionScoped}` prints `2`. No quotes around the name",
    ],
    code: `export default function VariablesAndConstants() {
  var functionScoped = 2;
  let blockScoped = 5;
  const constant1 = functionScoped - blockScoped;
  return (
    <div id="wd-variables-and-constants">
      <h4>Variables and Constants</h4>
      functionScoped = {functionScoped}
      <br />
      blockScoped = {blockScoped}
      <br />
      constant1 = {constant1}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/VariablesAndConstants.tsx",
    codeHighlightLines: [[2, 4], [8, 12]],
    embed: "js-variables",
  },
  {
    id: "import-it",
    title: "Import it into Lab 3",
    kind: "content",
    bullets: [
      "Add the import at the top of `app/labs/lab3/page.tsx`",
      "Render `<VariablesAndConstants />` under the Lab 3 heading",
      "Same import-and-place pattern for every exercise in this chapter",
    ],
    code: `import VariablesAndConstants from "./VariablesAndConstants";

export default function Lab3() {
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [1, 7],
  },
  {
    id: "on-your-own",
    title: "Add one more let and const",
    kind: "content",
    bullets: [
      "Still in `VariablesAndConstants.tsx`",
      "Declare one more `let` and one more `const` — a name and a greeting",
      "Interpolate both so they appear under the existing values",
    ],
  },
  {
    id: "next-up",
    title: "Next: variable types",
    kind: "title",
    bullets: [
      "You can store a number. Next: ask JavaScript what kind it is",
      "§3.2.2: `typeof` and why `{true}` prints nothing",
    ],
  },
];
