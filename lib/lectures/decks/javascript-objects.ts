import type { LectureSlide } from "../types";

export const JAVASCRIPT_OBJECTS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · JavaScript Objects",
      "§3.4.11–3.4.12 · named fields, then the console",
    ],
  },
  {
    id: "purpose",
    title: "An object names each value",
    kind: "content",
    bullets: [
      "Curly braces hold **property: value** pairs, separated by commas",
      "Values can be numbers, strings, arrays, or nested objects",
      "Dot notation reads a field: `house.bedrooms`, `house.address.city`",
      "Kambaz courses, modules, and users are objects in JSON files",
    ],
  },
  {
    id: "house",
    title: "A house is a nested object",
    kind: "demo",
    bullets: [
      "`address` is an object. `owners` is a string array",
      "`JSON.stringify(house, null, 2)` pretty-prints inside `<pre>`",
      "Create `House` and import it into Lab 3",
    ],
    code: `export default function House() {
  const house = {
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2000,
    address: {
      street: "Via Roma",
      city: "Roma",
      state: "RM",
      zip: "00100",
      country: "Italy",
    },
    owners: ["Alice", "Bob"],
  };
  console.log(house);
  return (
    <div id="wd-house">
      <h4>House</h4>
      <h5>bedrooms</h5>
      {house.bedrooms}
      <h5>bathrooms</h5>
      {house.bathrooms}
      <h5>Data</h5>
      <pre>{JSON.stringify(house, null, 2)}</pre>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/House.tsx",
    codeHighlightLines: [[2, 15], 25],
    embed: "js-house",
  },
  {
    id: "lab3-page-3-4-11",
    title: "Add House to Lab 3",
    kind: "content",
    bullets: [
      "Import `House` into `app/labs/lab3/page.tsx` and render it last",
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
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [24, 53],
  },
  {
    id: "console",
    title: "console.log writes off the page",
    kind: "content",
    bullets: [
      "Right-click Lab 3 → Inspect → **Console** tab",
      "`console.log(\"Hello World!\")` at the top of Lab 3, then reload",
      "`House.tsx` already logs the house — expand `address` and `owners`",
      "Use the console for values you do not want in the markup",
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
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeHighlightLines: [27],
  },
  {
    id: "recap",
    title: "Objects recap",
    kind: "content",
    bullets: [
      "`{ bedrooms: 4, address: { city: \"Roma\" } }` — nested object literals",
      "Read with dots. Pretty-print with `JSON.stringify(obj, null, 2)`",
      "`console.log` is the Console tab, not the page",
    ],
  },
  {
    id: "next-up",
    title: "Next: copy and unpack",
    kind: "title",
    bullets: [
      "Spread copies. Destructuring names the pieces",
      "§3.4.13–3.4.16: `...`, `{ name, age }`, and imports",
    ],
  },
];
