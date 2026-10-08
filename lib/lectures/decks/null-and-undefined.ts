import type { LectureSlide } from "../types";

export const NULL_AND_UNDEFINED_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Null and Undefined",
      "§3.2.7 · two kinds of “no value”",
    ],
  },
  {
    id: "purpose",
    title: "Empty on purpose vs never assigned",
    kind: "content",
    bullets: [
      "`null` is an **assigned** empty value — you put it there",
      "`undefined` means nothing was assigned: missing property, no `return`",
      "They are not interchangeable. APIs pick one and stick to it",
      "Create `NullUndefined.tsx` and import it into Lab 3",
    ],
  },
  {
    id: "sample",
    title: "Print both so you can see them",
    kind: "demo",
    bullets: [
      "JSX will not show a bare `null` or `undefined` — use `String()`",
      "`typeof null` is the famous quirk: it reports `\"object\"`",
      "`typeof undefined` is `\"undefined\"`",
    ],
    code: `export default function NullUndefined() {
  const nullValue = null;
  const undefinedValue = undefined;
  return (
    <div id="wd-null-undefined">
      <h4>Null vs Undefined</h4>
      nullValue = {String(nullValue)}
      <br />
      undefinedValue = {String(undefinedValue)}
      <br />
      typeof nullValue = {typeof nullValue}
      <br />
      typeof undefinedValue = {typeof undefinedValue}
      <br />
      String(null) = {String(null)}
      <br />
      String(undefined) = {String(undefined)}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/NullUndefined.tsx",
    codeHighlightLines: [2, 3, [7, 17]],
    embed: "js-null-undefined",
  },
  {
    id: "when",
    title: "When you will see each",
    kind: "content",
    bullets: [
      "`null` — a field you cleared: no course selected, signed-out user",
      "`undefined` — a key that was never set, or a function with no `return`",
      "Optional chaining (`?.`) and `??` come later in §3.4.17",
      "For now: know they exist, print them, do not treat them as `false`",
    ],
  },
  {
    id: "lab3-page-3-2-7",
    title: "Add NullUndefined to Lab 3",
    kind: "content",
    bullets: [
      "Import `NullUndefined` into `app/labs/lab3/page.tsx` and render it last",
      "Every later Lab 3 component is added the same way: one import at the top, one tag at the bottom of the `wd-lab3` `div`",
    ],
    code: `import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";

export default function Lab3() {
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [8, 21],
  },
  {
    id: "recap",
    title: "JavaScript basics recap",
    kind: "content",
    bullets: [
      "`let` / `const` store values; `{expr}` interpolates them in JSX",
      "`typeof` reports a string. Coerce booleans with `+ \"\"`",
      "`===`, `&&`, and `? :` decide what React puts in the tree",
      "`null` is assigned empty. `undefined` was never assigned",
    ],
  },
  {
    id: "next-up",
    title: "Next: JavaScript functions",
    kind: "title",
    bullets: [
      "Reuse an algorithm by wrapping it in a named block",
      "§3.3: legacy `function`, arrows, implied return, templates",
    ],
  },
];
