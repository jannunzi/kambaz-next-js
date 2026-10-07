import type { LectureSlide } from "../types";

export const JAVASCRIPT_FUNCTIONS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · JavaScript Functions",
      "§3.3 · reuse an algorithm from JSX",
    ],
  },
  {
    id: "purpose",
    title: "A function is a named, parameterized block",
    kind: "content",
    bullets: [
      "Wrap an algorithm, call it from JavaScript **or** from JSX",
      "Two styles: the older `function` keyword, then ES6 arrows",
      "TypeScript annotations (`a: number`) are compile-time only",
      "`console.log` writes to the browser console — inspect it later in §3.4.12",
    ],
  },
  {
    id: "legacy",
    title: "Legacy ES5 function add",
    kind: "demo",
    bullets: [
      "The sum prints both as a stored result and as a call inlined in JSX",
      "`add(2, 4)` inside `{…}` is just another expression",
      "Create `LegacyFunctions` and import it into Lab 3",
    ],
    code: `function add(a: number, b: number) {
  return a + b;
}

export default function LegacyFunctions() {
  const twoPlusFour = add(2, 4);
  console.log(twoPlusFour);
  return (
    <div id="wd-legacy-functions">
      <h4>Functions</h4>
      <h5>Legacy ES5 functions</h5>
      twoPlusFour = {twoPlusFour}
      <br />
      add(2, 4) = {add(2, 4)}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/LegacyFunctions.tsx",
    codeHighlightLines: [[1, 3], 6, 14],
    embed: "js-legacy-functions",
  },
  {
    id: "lab3-page-3-3",
    title: "Add LegacyFunctions to Lab 3",
    kind: "content",
    bullets: [
      "Import `LegacyFunctions` into `app/labs/lab3/page.tsx` and render it after `NullUndefined`",
    ],
    code: `import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";

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
      <LegacyFunctions />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [9, 23],
  },
  {
    id: "arrow",
    title: "ES6 arrows drop the function keyword",
    kind: "demo",
    bullets: [
      "`const subtract = (a, b) => { return a - b; }`",
      "The name is optional; you typically store the function in a `const`",
      "This is the shape of almost every callback — `map`, handlers, predicates",
    ],
    code: `const subtract = (a: number, b: number) => {
  return a - b;
};

export default function ArrowFunctions() {
  const threeMinusOne = subtract(3, 1);
  console.log(threeMinusOne);
  return (
    <div id="wd-arrow-functions">
      <h4>New ES6 arrow functions</h4>
      threeMinusOne = {threeMinusOne}
      <br />
      subtract(3, 1) = {subtract(3, 1)}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ArrowFunctions.tsx",
    codeAddedLines: [[1, 3]],
    embed: "js-arrow-functions",
  },
  {
    id: "lab3-page-3-3-1",
    title: "Add ArrowFunctions to Lab 3",
    kind: "content",
    bullets: [
      "Import `ArrowFunctions` into `app/labs/lab3/page.tsx` and render it last",
    ],
    code: `import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";

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
      <LegacyFunctions />
      <ArrowFunctions />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [10, 25],
  },
  {
    id: "implied",
    title: "Implied return drops the braces",
    kind: "demo",
    bullets: [
      "`(a, b) => a * b` is the same as `(a, b) => { return a * b; }`",
      "Use it when the body is a single expression",
      "That one-liner is what you will pass into `map` and `filter` in §3.4",
    ],
    code: `export default function ImpliedReturn() {
  const multiply = (a: number, b: number) => a * b;
  const fourTimesFive = multiply(4, 5);
  console.log(fourTimesFive);
  return (
    <div id="wd-implied-return">
      <h4>Implied return</h4>
      fourTimesFive = {fourTimesFive}
      <br />
      multiply(4, 5) = {multiply(4, 5)}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ImpliedReturn.tsx",
    codeHighlightLines: [2],
    embed: "js-implied-return",
  },
  {
    id: "lab3-page-3-3-2",
    title: "Add ImpliedReturn to Lab 3",
    kind: "content",
    bullets: [
      "Import `ImpliedReturn` into `app/labs/lab3/page.tsx` and render it last",
    ],
    code: `import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";

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
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [11, 27],
  },
  {
    id: "templates",
    title: "Template literals embed expressions",
    kind: "demo",
    bullets: [
      "Backticks, not quotes. `${expr}` interpolates inside the string",
      "`result1` concatenates with `+`. `result2` does the same with a template",
      "A ternary can live inside `${…}` — `Logged in: Yes` or `No`",
    ],
    code: `export default function TemplateLiterals() {
  const five = 2 + 3;
  const result1 = "2 + 3 = " + five;
  const result2 = \`2 + 3 = \${2 + 3}\`;
  const username = "alice";
  const greeting1 = \`Welcome home \${username}\`;
  const loggedIn = false;
  const greeting2 = \`Logged in: \${loggedIn ? "Yes" : "No"}\`;
  return (
    <div id="wd-template-literals">
      <h4>Template Literals</h4>
      result1 = {result1}
      <br />
      result2 = {result2}
      <br />
      greeting1 = {greeting1}
      <br />
      greeting2 = {greeting2}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/TemplateLiterals.tsx",
    codeHighlightLines: [4, 6, 8],
    embed: "js-template-literals",
  },
  {
    id: "lab3-page-3-3-3",
    title: "Add TemplateLiterals to Lab 3",
    kind: "content",
    bullets: [
      "Import `TemplateLiterals` into `app/labs/lab3/page.tsx` and render it last",
    ],
    code: `import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";

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
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [12, 29],
  },
  {
    id: "recap",
    title: "Functions recap",
    kind: "content",
    bullets: [
      "`function add(a, b) { return a + b; }` — the older spelling still works",
      "`const subtract = (a, b) => { return a - b; }` — ES6, named by the `const`",
      "`const multiply = (a, b) => a * b` — implied return for one expression",
      "`\`Welcome home ${username}\`` — templates, including a ternary",
    ],
  },
  {
    id: "next-up",
    title: "Next: data structures",
    kind: "title",
    bullets: [
      "Functions reuse logic. Arrays and objects reuse data",
      "§3.4: index, map, find, filter, spread — next decks",
    ],
  },
];
