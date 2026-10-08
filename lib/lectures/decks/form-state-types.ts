import type { LectureSlide } from "../types";

export const FORM_STATE_TYPES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Form State Types",
      "§4.2.5–4.2.9 · boolean through array, same hook",
    ],
  },
  {
    id: "purpose",
    title: "Bind the field to the value",
    kind: "content",
    bullets: [
      "A controlled field has `value` (or `checked`) plus `onChange`",
      "The UI and the data stay in sync because they share one source",
      "Objects and arrays must be copied — never mutate the previous state",
    ],
  },
  {
    id: "boolean",
    title: "Boolean: checked and a ternary",
    kind: "demo",
    bullets: [
      "`useState(true)` seeds Done. The checkbox writes `!done`",
      "`{done ? \"Done\" : \"Not done\"}` and `{done && <div>Yay!</div>}`",
      "Use `checked={done}`, not `value`, on a checkbox",
    ],
    code: `const [done, setDone] = useState(true);
<p>{done ? "Done" : "Not done"}</p>
<input
  type="checkbox"
  checked={done}
  onChange={() => setDone(!done)}
  id="wd-boolean-checkbox"
/>
{done && <div className="mt-2 rounded bg-yellow-100 p-2">Yay! Done</div>}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/BooleanStateVariables.tsx",
    codeHighlightLines: [1, [3, 8]],
    embed: "boolean-state",
  },
  {
    id: "string",
    title: "String: value and onChange",
    kind: "demo",
    bullets: [
      "`value={firstName}` shows the current string",
      "`onChange={(e) => setFirstName(e.target.value)}` writes each keystroke",
      "Without `value`, the field is uncontrolled and React cannot reset it",
    ],
    code: `const [firstName, setFirstName] = useState("John");
<p>{firstName}</p>
<input
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
  id="wd-first-name"
/>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/StringStateVariables.tsx",
    codeHighlightLines: [1, [3, 6]],
    embed: "string-state",
  },
  {
    id: "date",
    title: "Date: format for type=date",
    kind: "demo",
    bullets: [
      "`useState(new Date(2026, 0, 15, 10, 30))` — year, month, day, hour, minute. Months start at 0",
      "`type=\"date\"` wants `YYYY-MM-DD` — helper `dateObjectToHtmlDateString`",
      "`htmlDateStringToDate` reads the picker as a local date, so the day you pick stays that day",
    ],
    code: `"use client";

import { useState } from "react";

function dateObjectToHtmlDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return \`\${year}-\${month}-\${day}\`;
}

function htmlDateStringToDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0);
}

export default function DateStateVariable() {
  const [startDate, setStartDate] = useState(new Date(2026, 0, 15, 10, 30));
  return (
    <div id="wd-date-state-variables">
      <h2>Date State Variables</h2>
      <h3>{startDate.toDateString()}</h3>
      <h3>{dateObjectToHtmlDateString(startDate)}</h3>
      <input
        type="date"
        className="rounded border border-neutral-300 px-3 py-1.5"
        value={dateObjectToHtmlDateString(startDate)}
        onChange={(e) => setStartDate(htmlDateStringToDate(e.target.value))}
        id="wd-start-date"
      />
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/DateStateVariable.tsx",
    codeHighlightLines: [[5, 15], 18, 28],
    embed: "date-state",
  },
  {
    id: "object",
    title: "Object: spread, then overwrite",
    kind: "demo",
    bullets: [
      "`setPerson({ ...person, name: e.target.value })` copies, then writes one key",
      "Do not do `person.name = …` — that mutates and React may skip the paint",
      "`parseInt` on age; `|| 0` keeps the field a number if the box is empty",
    ],
    code: `const [person, setPerson] = useState({ name: "Peter", age: 24 });
<pre>{JSON.stringify(person, null, 2)}</pre>
<input
  value={person.name}
  onChange={(e) => setPerson({ ...person, name: e.target.value })}
  id="wd-person-name"
/>
<input
  type="number"
  value={person.age}
  onChange={(e) =>
    setPerson({ ...person, age: parseInt(e.target.value) || 0 })
  }
  id="wd-person-age"
/>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ObjectStateVariable.tsx",
    codeHighlightLines: [1, 5, [11, 12]],
    embed: "object-state",
  },
  {
    id: "array",
    title: "Array: copy, then add or filter",
    kind: "demo",
    bullets: [
      "`setArray([...array, Math.floor(Math.random() * 100)])` appends a copy",
      "`filter((_item, i) => i !== index)` drops one index without mutate",
      "Each `li` needs a `key`. Delete wraps `deleteElement(index)` in an arrow",
    ],
    code: `const [array, setArray] = useState([1, 2, 3, 4, 5]);
const addElement = () => {
  setArray([...array, Math.floor(Math.random() * 100)]);
};
const deleteElement = (index: number) => {
  setArray(array.filter((_item, i) => i !== index));
};

{array.map((item, index) => (
  <li key={\`\${item}-\${index}\`}>
    <span>{item}</span>
    <button type="button" onClick={() => deleteElement(index)}>
      Delete
    </button>
  </li>
))}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ArrayStateVariable.tsx",
    codeHighlightLines: [[2, 7], [9, 16]],
    embed: "array-state",
  },
  {
    id: "recap",
    title: "Form state recap",
    kind: "content",
    bullets: [
      "Boolean → `checked`. Text and date → `value` + `onChange`",
      "Objects and arrays: spread or `filter` / `map`, never mutate",
      "Kambaz New Course will reuse the object-spread draft",
    ],
  },
  {
    id: "next-up",
    title: "Next: share state with a child",
    kind: "title",
    bullets: [
      "`useState` belongs to the component that calls it",
      "§4.3.1: lift the counter so a child can increment it",
    ],
  },
];
