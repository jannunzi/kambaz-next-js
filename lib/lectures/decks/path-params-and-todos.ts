import type { LectureSlide } from "../types";

export const PATH_PARAMS_AND_TODOS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Path Parameters and Todos",
      "§3.7.2–3.7.4 · the URL, then a JSON list",
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
      "`\"use client\"` because `usePathname` reads the address bar",
      "Each `Link` uses `key={link.id}` and a `match` predicate",
      "After the map, the list also links Lab Steps and each Book chapter",
      "Visit `/labs/lab3` and confirm Lab 3 picks up the blue pill",
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

export default function TOC() {
  const pathname = usePathname() ?? "";
  return (
    <ul>
      {LINKS.map((link) => (
        <li key={link.id}>
          <Link
            href={link.href}
            id={link.id}
            className={
              link.match(pathname)
                ? "rounded bg-blue-600 px-2 py-0.5 text-white no-underline"
                : undefined
            }
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <Link href="/labs/lab1/intermediates" id="wd-lab1-intermediates-link">
          Lab 1 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch1" id="wd-book-ch1-link">
          Book Ch1
        </Link>
      </li>
      <li>
        <Link href="/labs/lab2/intermediates" id="wd-lab2-intermediates-link">
          Lab 2 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch2" id="wd-book-ch2-link">
          Book Ch2
        </Link>
      </li>
      <li>
        <Link href="/labs/lab3/intermediates" id="wd-lab3-intermediates-link">
          Lab 3 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch3" id="wd-book-ch3-link">
          Book Ch3
        </Link>
      </li>
    </ul>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/TOC.tsx",
    codeHighlightLines: [[6, 11], [18, 27]],
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
