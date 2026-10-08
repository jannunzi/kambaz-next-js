import type { LectureSlide } from "../types";

export const PATH_PARAMS_AND_TODOS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Path Parameters and Todos",
      "§3.7.2–3.7.5 · the URL, a JSON list, the full Lab 3 page",
    ],
  },
  {
    id: "purpose",
    title: "The address bar is data too",
    kind: "content",
    bullets: [
      "`usePathname` highlights the active Labs TOC item",
      "Dynamic folders `[a]` and `[b]` capture path segments",
      "Then import JSON and `map` it onto a parameterized row",
      "That combination is the Lab 3 recap — still throwaway practice",
    ],
  },
  {
    id: "toc",
    title: "TOC maps links and highlights",
    kind: "content",
    bullets: [
      "Your Chapter 1 TOC has no `\"use client\"`, no `LINKS`, no `match` — **replace the whole file**",
      "`\"use client\"` because `usePathname` reads the address bar. Each `li` uses `key={link.id}`",
      "The active link gets an inline style object (§3.5.2) — Labs pages don’t load Tailwind",
      "`aria-current=\"page\"` tells screen readers which link is the current page",
      "Visit `/labs/lab3`: only Lab 3 is a blue pill with white text",
    ],
    code: `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/labs", id: "wd-home-link", label: "Home", match: (p: string) => p === "/labs" },
  { href: "/labs/lab1", id: "wd-lab1-link", label: "Lab 1", match: (p: string) => p.endsWith("/lab1") || p.includes("/lab1/") },
  { href: "/labs/lab2", id: "wd-lab2-link", label: "Lab 2", match: (p: string) => p.includes("/lab2") },
  { href: "/labs/lab3", id: "wd-lab3-link", label: "Lab 3", match: (p: string) => p.includes("/lab3") },
  { href: "/", id: "wd-kambaz-link", label: "Kambaz", match: () => false },
] as const;

const activeStyle = {
  backgroundColor: "#2563eb",
  color: "white",
  borderRadius: "4px",
  padding: "2px 8px",
  textDecoration: "none",
};

export default function TOC() {
  const pathname = usePathname() ?? "";
  return (
    <ul>
      {LINKS.map((link) => {
        const active = link.match(pathname);
        return (
          <li key={link.id}>
            <Link
              href={link.href}
              id={link.id}
              style={active ? activeStyle : undefined}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/TOC.tsx",
    codeHighlightLines: [[6, 12], [14, 20], 27, [33, 34]],
  },
  {
    id: "path-page",
    title: "[a] and [b] are route params",
    kind: "content",
    bullets: [
      "Create `app/labs/lab3/add/[a]/[b]/page.tsx`",
      "`useParams` returns strings (or string arrays) — `parseInt` them",
      "This page is a Client Component because it uses a hook",
    ],
    code: `"use client";

import { useParams } from "next/navigation";

export default function AddPathParameters() {
  const { a, b } = useParams();
  return (
    <div id="wd-add-path-parameters">
      <h4>Add Path Parameters</h4>
      {a} + {b} = {parseInt(a as string) + parseInt(b as string)}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/add/[a]/[b]/page.tsx",
    codeHighlightLines: [6, 10],
  },
  {
    id: "path-links",
    title: "Link encodes the two numbers",
    kind: "demo",
    bullets: [
      "`/labs/lab3/add/1/2` prints `1 + 2 = 3`",
      "The second link should print `3 + 4 = 7`",
      "Import `PathParameters` into Lab 3 and click both",
    ],
    code: `import Link from "next/link";

export default function PathParameters() {
  return (
    <div id="wd-path-parameters">
      <h2>Path Parameters</h2>
      <Link href="/labs/lab3/add/1/2">1 + 2</Link>
      <br />
      <Link href="/labs/lab3/add/3/4">3 + 4</Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/PathParameters.tsx",
    codeHighlightLines: [7, 9],
    embed: "js-path-parameters",
  },
  {
    id: "lab3-page-3-7-3",
    title: "Add PathParameters to Lab 3",
    kind: "content",
    bullets: [
      "Import `PathParameters` and render it after the `Highlight`. The `add/[a]/[b]/page.tsx` route is a page of its own, so Lab 3 does not import it",
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
import PathParameters from "./PathParameters";

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
      <PathParameters />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [37, 84],
  },
  {
    id: "todo-item",
    title: "TodoItem takes one object",
    kind: "content",
    bullets: [
      "The `todo = { … }` in the parameter list is a **default**",
      "If the parent omits `todo`, the milk item is used",
      "Store the list next to the component as `todos.json`",
    ],
    code: `type Todo = {
  done: boolean;
  title: string;
  status: string;
};

const TodoItem = ({
  todo = { done: true, title: "Buy milk", status: "COMPLETED" },
}: {
  todo?: Todo;
}) => {
  return (
    <li className="flex items-center gap-2 border-b py-1">
      <input type="checkbox" className="me-2" defaultChecked={todo.done} />
      {todo.title} ({todo.status})
    </li>
  );
};

export default TodoItem;`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/todos/TodoItem.tsx",
    codeHighlightLines: [[7, 11], 14],
  },
  {
    id: "todos-json",
    title: "The list lives in todos.json",
    kind: "content",
    bullets: [
      "A `.json` file is data. Next.js can `import` it as a JavaScript value",
      "Each todo has a `title`, a `status`, and `done`",
      "`done: true` starts the checkbox checked",
    ],
    code: `[
  { "title": "Buy milk", "status": "CANCELED", "done": true },
  { "title": "Pickup the kids", "status": "IN PROGRESS", "done": false },
  { "title": "Walk the dog", "status": "DEFERRED", "done": false }
]`,
    codeLanguage: "json",
    codeFile: "app/labs/lab3/todos/todos.json",
    codeHighlightLines: [[2, 4]],
  },
  {
    id: "todo-list",
    title: "TodoList maps JSON onto rows",
    kind: "demo",
    bullets: [
      "Next.js lets you `import todos from \"./todos.json\"`",
      "`key={todo.title}` works because titles are unique in this file",
      "Import `TodoList` into Lab 3 — checkboxes follow `todo.done`",
    ],
    code: `import TodoItem from "./TodoItem";
import todos from "./todos.json";

export default function TodoList() {
  return (
    <>
      <h3>Todo List</h3>
      <ul className="list-none p-0">
        {todos.map((todo) => (
          <TodoItem key={todo.title} todo={todo} />
        ))}
      </ul>
      <hr />
    </>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/todos/TodoList.tsx",
    codeHighlightLines: [2, [9, 11]],
    embed: "js-todo-list",
  },
  {
    id: "lab3-complete",
    title: "Complete Lab 3 page",
    kind: "content",
    bullets: [
      "Import `TodoList` from its subfolder, `./todos/TodoList`, and render it last",
      "`TodoItem` is rendered inside `TodoList`, so the page does not import it",
      "This is the finished Lab 3 page: every component in book order, each under its own heading",
      "Your On your own and With AI additions live inside those components; extra `Add`, `Square`, and `Highlight` go right after them",
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
import PathParameters from "./PathParameters";
import TodoList from "./todos/TodoList";

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
      <PathParameters />
      <TodoList />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [38, 86],
  },
  {
    id: "recap",
    title: "Path and todos recap",
    kind: "content",
    bullets: [
      "`usePathname` + a `LINKS` array highlights the active item",
      "`[a]/[b]` + `useParams` encode values in the URL",
      "JSON + `map` + a parameterized row is the data-driven list pattern",
    ],
  },
  {
    id: "next-up",
    title: "Next: check your understanding",
    kind: "title",
    bullets: [
      "Pause on the practice quiz before wiring Kambaz to JSON",
      "§3.8: ten items from this chapter — not graded",
    ],
  },
];
