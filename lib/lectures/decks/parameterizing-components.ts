import type { LectureSlide } from "../types";

export const PARAMETERIZING_COMPONENTS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Parameterizing Components",
      "§3.7–3.7.1 · props and children",
    ],
  },
  {
    id: "purpose",
    title: "Attributes are a props object",
    kind: "content",
    bullets: [
      "HTML-style attributes become one object argument",
      "Destructure it in the parameter list — same as §3.4.15",
      "`a={3}` passes a **number**. `a=\"3\"` would pass a string",
      "Render `<Add a={3} b={4} />` from Lab 3 — the sum is `7`",
    ],
  },
  {
    id: "add",
    title: "Add reads a and b from props",
    kind: "demo",
    bullets: [
      "`{ a, b }: { a: number; b: number }` names and types the props",
      "Reuse the same component with different attributes",
      "Create `Add.tsx` and import it into Lab 3",
    ],
    code: `export default function Add({ a, b }: { a: number; b: number }) {
  return (
    <div id="wd-add">
      <h4>Add</h4>
      a = {a}
      b = {b}
      <br />
      a + b = {a + b}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/Add.tsx",
    codeHighlightLines: [1, 8],
    embed: "js-add",
  },
  {
    id: "lab3-page-3-7",
    title: "Render Add with two props in Lab 3",
    kind: "content",
    bullets: [
      "Import `Add` and render it with its two props after `ServerComponentDemo`",
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
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";
import Styles from "./Styles";
import ClientComponentDemo from "./ClientComponentDemo";
import ServerComponentDemo from "./ServerComponentDemo";
import Add from "./Add";

export default function Lab3() {
  console.log("Hello World!");
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
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
      <Styles />
      <ClientComponentDemo />
      <ServerComponentDemo />
      <Add a={3} b={4} />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [34, 74],
  },
  {
    id: "square",
    title: "children is the body",
    kind: "demo",
    bullets: [
      "Content between the tags arrives as `children`",
      "`<Square>4</Square>` — the child text `4` becomes `16`",
      "`Number(children)` turns that text into a number",
    ],
    code: `import { ReactNode } from "react";

export default function Square({ children }: { children: ReactNode }) {
  const num = Number(children);
  return <span id="wd-square">{num * num}</span>;
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/Square.tsx",
    codeHighlightLines: [3, 5],
    embed: "js-square",
  },
  {
    id: "highlight",
    title: "Highlight formats its children",
    kind: "demo",
    bullets: [
      "Same `children` prop — wrapping, not arithmetic",
      "A yellow span with red text around whatever you nest",
      "Create `Highlight.tsx` and wrap a sentence on Lab 3",
    ],
    code: `import { ReactNode } from "react";

export default function Highlight({ children }: { children: ReactNode }) {
  return (
    <span
      id="wd-highlight"
      style={{ backgroundColor: "yellow", color: "red" }}
    >
      {children}
    </span>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/Highlight.tsx",
    codeHighlightLines: [3, 9],
    embed: "js-highlight",
  },
  {
    id: "lab3-page-3-7-1",
    title: "Add Square and Highlight to Lab 3",
    kind: "content",
    bullets: [
      "Import `Square` and `Highlight`. The square of 4 sits under its own `<h4>` heading, then a rule and the highlighted sentence",
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
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";
import Styles from "./Styles";
import ClientComponentDemo from "./ClientComponentDemo";
import ServerComponentDemo from "./ServerComponentDemo";
import Add from "./Add";
import Square from "./Square";
import Highlight from "./Highlight";

export default function Lab3() {
  console.log("Hello World!");
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
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
      <Styles />
      <ClientComponentDemo />
      <ServerComponentDemo />
      <Add a={3} b={4} />
      <h4>Square of 4</h4>
      <Square>4</Square>
      <hr />
      <Highlight>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </Highlight>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [[35, 36], [77, 82]],
  },
  {
    id: "recap",
    title: "Props and children recap",
    kind: "content",
    bullets: [
      "`<Add a={3} b={4} />` — destructure `{ a, b }` from the props object",
      "`<Square>4</Square>` — the body is `children`",
      "`Highlight` is a wrapper: it returns `{children}` with a style",
    ],
  },
  {
    id: "next-up",
    title: "Next: encode data in the URL",
    kind: "title",
    bullets: [
      "`usePathname` highlights the TOC. `[a]/[b]` captures segments",
      "§3.7.2–3.7.4: path params, then a JSON todo list",
    ],
  },
];
