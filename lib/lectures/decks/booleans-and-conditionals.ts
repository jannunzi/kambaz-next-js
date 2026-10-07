import type { LectureSlide } from "../types";

export const BOOLEANS_AND_CONDITIONALS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Booleans and Conditionals",
      "§3.2.3–3.2.6 · decisions that change the tree",
    ],
  },
  {
    id: "purpose",
    title: "Booleans are the raw material of decisions",
    kind: "content",
    bullets: [
      "`&&` and, `||` or, `!` not, then comparisons",
      "Always compare with `===` and `!==` — value **and** type",
      "`==` coerces types and hides bugs. Do not use it in this course",
      "Cast booleans for display: `{false3 + \"\"}`",
    ],
  },
  {
    id: "boolean-sample",
    title: "And, or, not, and ===",
    kind: "demo",
    bullets: [
      "`true1 && false1` is `false`. `true1 || false1` is `true`",
      "`numberVariable === 123` is `true` — same value and type",
      "`numberVariable < 100` is `false`",
    ],
    code: `export default function BooleanVariables() {
  let numberVariable = 123,
    floatingPointNumber = 234.345;
  let true1 = true,
    false1 = false;
  let false2 = true1 && false1;
  let true2 = true1 || false1;
  let true3 = !false2;
  let true4 = numberVariable === 123;
  let true5 = floatingPointNumber !== 321.432;
  let false3 = numberVariable < 100;
  return (
    <div id="wd-boolean-variables">
      <h4>Boolean Variables</h4>
      true1 = {true1 + ""}
      <br />
      false1 = {false1 + ""}
      <br />
      false2 = {false2 + ""}
      <br />
      true2 = {true2 + ""}
      <br />
      true3 = {true3 + ""}
      <br />
      true4 = {true4 + ""}
      <br />
      true5 = {true5 + ""}
      <br />
      false3 = {false3 + ""}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/BooleanVariables.tsx",
    codeHighlightLines: [[6, 11]],
    embed: "js-booleans",
  },
  {
    id: "lab3-page-3-2-3",
    title: "Add BooleanVariables to Lab 3",
    kind: "content",
    bullets: [
      "Import it into `app/labs/lab3/page.tsx` the same way, after `VariableTypes`",
      "Render `<BooleanVariables />` last inside the `wd-lab3` `div`",
    ],
    code: `import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";

export default function Lab3() {
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [3, 11],
  },
  {
    id: "if-else",
    title: "Short-circuit a paragraph",
    kind: "demo",
    bullets: [
      "`{true1 && <p>true1</p>}` renders the paragraph only if `true1` is true",
      "If the left side is false, the right side never runs",
      "The `? :` form always picks one of two branches",
    ],
    code: `export default function IfElse() {
  let true1 = true,
    false1 = false;
  return (
    <div id="wd-if-else">
      <h4>If Else</h4>
      {true1 && <p>true1</p>}
      {!false1 ? <p>!false1</p> : <p>false1</p>}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/IfElse.tsx",
    codeHighlightLines: [7, 8],
    embed: "js-if-else",
  },
  {
    id: "lab3-page-3-2-4",
    title: "Add IfElse to Lab 3",
    kind: "content",
    bullets: [
      "Import `IfElse` into `app/labs/lab3/page.tsx`",
      "Render `<IfElse />` last inside the `wd-lab3` `div`",
    ],
    code: `import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";

export default function Lab3() {
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [4, 13],
  },
  {
    id: "ternary",
    title: "A ternary picks one of two trees",
    kind: "demo",
    bullets: [
      "Predicate `?` if-true `:` if-false — three pieces, one expression",
      "With `loggedIn` true the page greets; flip it and the login line appears",
      "This is the spelling you will use in JSX more than `if`/`else`",
    ],
    code: `export default function TernaryOperator() {
  let loggedIn = true;
  return (
    <div id="wd-ternary-operator">
      <h4>Logged In</h4>
      {loggedIn ? <p>Welcome</p> : <p>Please login</p>}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/TernaryOperator.tsx",
    codeHighlightLines: [6],
    embed: "js-ternary",
  },
  {
    id: "lab3-page-3-2-5",
    title: "Add TernaryOperator to Lab 3",
    kind: "content",
    bullets: [
      "Import `TernaryOperator` into `app/labs/lab3/page.tsx`",
      "Render `<TernaryOperator />` last inside the `wd-lab3` `div`",
    ],
    code: `import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";

export default function Lab3() {
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [5, 15],
  },
  {
    id: "output-if-else",
    title: "Return a different heading",
    kind: "demo",
    bullets: [
      "An `if`/`else` can return two completely different trees",
      "`loggedIn` true → Welcome. false → Please login",
      "Each branch is a full `return` — the other heading is not in the tree",
    ],
    code: `export default function ConditionalOutputIfElse() {
  const loggedIn = true;
  if (loggedIn) {
    return (
      <h2 id="wd-conditional-output-if-else-welcome">Welcome If Else</h2>
    );
  } else {
    return (
      <h2 id="wd-conditional-output-if-else-login">Please login If Else</h2>
    );
  }
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ConditionalOutputIfElse.tsx",
    codeHighlightLines: [[3, 11]],
    embed: "js-conditional-if-else",
  },
  {
    id: "output-inline",
    title: "Or short-circuit inside one return",
    kind: "demo",
    bullets: [
      "One wrapper. Each heading is included only when its flag is true",
      "Here `loggedIn` is `false`, so only the login heading appears",
      "Import both components into Lab 3 and flip the flags to confirm",
    ],
    code: `export default function ConditionalOutputInline() {
  const loggedIn = false;
  return (
    <div id="wd-conditional-output-inline">
      {loggedIn && <h2>Welcome Inline</h2>}
      {!loggedIn && <h2>Please login Inline</h2>}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ConditionalOutputInline.tsx",
    codeAddedLines: [5, 6],
    embed: "js-conditional-inline",
  },
  {
    id: "lab3-page-3-2-6",
    title: "Add both conditional outputs to Lab 3",
    kind: "content",
    bullets: [
      "Import both components into `app/labs/lab3/page.tsx`",
      "Render `<ConditionalOutputIfElse />`, then `<ConditionalOutputInline />`",
      "The if/else version returns early. The inline version always returns one wrapper",
    ],
    code: `import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";

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
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [6, 7, 18, 19],
  },
  {
    id: "next-up",
    title: "Next: null vs undefined",
    kind: "title",
    bullets: [
      "Two values mean “no value,” and they are not the same",
      "§3.2.7: assigned empty vs never assigned",
    ],
  },
];
