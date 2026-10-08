import type { LectureSlide } from "../types";

export const ARRAY_ITERATION_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Array Iteration",
      "§3.4.3–3.4.4 · for loops, then map",
    ],
  },
  {
    id: "purpose",
    title: "Same walk, two spellings",
    kind: "content",
    bullets: [
      "A `for` loop is useful when you need the **index** as well as the value",
      "Build a **new** array inside the loop rather than mutating the source",
      "`map` does the same walk and returns the new array for you",
      "Mapping to JSX is how Kambaz will turn courses into cards",
    ],
  },
  {
    id: "for-loop",
    title: "for builds a second array",
    kind: "demo",
    bullets: [
      "`string[]` tells TypeScript the empty array will hold strings",
      "Each pass pushes an uppercased copy",
      "JSX still omits commas, so the page shows `STRING1STRING3`",
    ],
    code: `export default function ForLoops() {
  let stringArray1 = ["string1", "string3"];
  let stringArray2: string[] = [];
  for (let i = 0; i < stringArray1.length; i++) {
    const string1 = stringArray1[i];
    stringArray2.push(string1.toUpperCase());
  }
  return (
    <div id="wd-for-loops">
      <h4>Looping through arrays</h4>
      stringArray2 = {stringArray2}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ForLoops.tsx",
    codeHighlightLines: [[3, 6]],
    embed: "js-for-loops",
  },
  {
    id: "lab3-page-3-4-3",
    title: "Add ForLoops to Lab 3",
    kind: "content",
    bullets: [
      "Import `ForLoops` into `app/labs/lab3/page.tsx` and render it last",
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
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";

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
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [16, 37],
  },
  {
    id: "map",
    title: "map returns a new array",
    kind: "demo",
    bullets: [
      "Pass a named function, or an implied-return arrow",
      "`squares` uses `square`. `cubes` inlines `(a) => a * a * a`",
      "Create `MapFunction` and import it into Lab 3",
    ],
    code: `export default function MapFunction() {
  let numberArray1 = [1, 2, 3, 4, 5, 6];
  const square = (a: number) => a * a;
  const todos = ["Buy milk", "Feed the pets"];
  const squares = numberArray1.map(square);
  const cubes = numberArray1.map((a) => a * a * a);
  return (
    <div id="wd-map-function">
      <h4>Map Function</h4>
      squares = {squares}
      <br />
      cubes = {cubes}
      <br />
      Todos:
      <ol>
        {todos.map((todo) => (
          <li key={todo}>{todo}</li>
        ))}
      </ol>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/MapFunction.tsx",
    codeHighlightLines: [5, 6, [16, 18]],
    embed: "js-map",
  },
  {
    id: "lab3-page-3-4-4",
    title: "Add MapFunction to Lab 3",
    kind: "content",
    bullets: [
      "Import `MapFunction` into `app/labs/lab3/page.tsx` and render it last",
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
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";

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
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [17, 39],
  },
  {
    id: "keys",
    title: "Give each sibling a key",
    kind: "content",
    bullets: [
      "`key={todo}` works here because the strings are unique",
      "When two titles could collide, use a real id from the data",
      "Without a key the console warns and updates can reuse the wrong node",
    ],
  },
  {
    id: "recap",
    title: "Iteration recap",
    kind: "content",
    bullets: [
      "`for (let i = 0; i < arr.length; i++)` when you need the index",
      "`arr.map(fn)` returns a new array — named function or implied arrow",
      "Mapping to `<li key={…}>` is the list pattern the rest of the course uses",
    ],
  },
  {
    id: "next-up",
    title: "Next: search and filter",
    kind: "title",
    bullets: [
      "`map` transforms every item. The next tools pick some of them",
      "§3.4.5–3.4.8: find, findIndex, filter, includes / some / every",
    ],
  },
];
