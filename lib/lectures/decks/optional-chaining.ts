import type { LectureSlide } from "../types";

export const OPTIONAL_CHAINING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Optional Chaining",
      "§3.4.17 · stop at missing, then fill a default",
    ],
  },
  {
    id: "purpose",
    title: "Do not crash on a missing field",
    kind: "content",
    bullets: [
      "`house.address.city` throws if `address` is `null` or `undefined`",
      "`?.` stops at the first empty value and yields `undefined`",
      "`??` fills a default **only** for `null` / `undefined`",
      "`||` also treats `0` and `\"\"` as missing — usually the wrong default",
    ],
  },
  {
    id: "sample",
    title: "?. then ?? on the page",
    kind: "demo",
    bullets: [
      "`house.address?.city` is `Roma`",
      "`missing?.prop` is `undefined`, so `?? \"n/a\"` prints the fallback",
      "The `House` **type** names the object’s shape. `?` marks `address`, `zip`, and `garage` optional",
      "TypeScript only lets you read properties the type declares, even through `?.`",
      "Without the type, `house.garage?.cars` works in `npm run dev` but fails `next build`",
    ],
    code: `type House = {
  bedrooms: number;
  address?: { street: string; city: string; zip?: string };
  garage?: { cars: number };
};

export default function OptionalChaining() {
  const house: House = {
    bedrooms: 4,
    address: {
      street: "Via Roma",
      city: "Roma",
    },
  };
  const missing = undefined as { prop?: string } | undefined;
  return (
    <div id="wd-optional-chaining">
      <h4>Optional Chaining</h4>
      house.address?.city = {house.address?.city}
      <br />
      missing?.prop ?? "n/a" = {missing?.prop ?? "n/a"}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/OptionalChaining.tsx",
    codeHighlightLines: [[1, 5], 8, 19, 21],
    embed: "js-optional-chaining",
  },
  {
    id: "lab3-page-3-4-17",
    title: "Add OptionalChaining to Lab 3",
    kind: "content",
    bullets: [
      "Import `OptionalChaining` into `app/labs/lab3/page.tsx` and render it last",
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
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [29, 64],
  },
  {
    id: "recap",
    title: "Data structures recap",
    kind: "content",
    bullets: [
      "Arrays: `map`, `filter`, `find`, `reduce`, and a `key` on every sibling",
      "Objects: named fields, `JSON.stringify`, `console.log`",
      "Spread copies. Destructuring unpacks. `?.` / `??` stay safe",
    ],
  },
  {
    id: "next-up",
    title: "Next: style from data",
    kind: "title",
    bullets: [
      "Classes and inline styles can follow a variable",
      "§3.5: `className={\`wd-bg-${color}\`}` and `style={bgBlue}`",
    ],
  },
];
