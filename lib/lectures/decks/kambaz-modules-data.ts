import type { LectureSlide } from "../types";

export const KAMBAZ_MODULES_DATA_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Modules from Data",
      "§3.9.7 · filter by course, then map lessons",
    ],
  },
  {
    id: "purpose",
    title: "Modules currently ignore the course",
    kind: "content",
    bullets: [
      "Each module in `modules.json` has a `course` field matching a course `_id`",
      "Filter by the `cid` from `useParams`, then map modules and nested lessons",
      "Key each row from `_id`. Open two courses and confirm the titles change",
    ],
  },
  {
    id: "page",
    title: "filter, then map, then lessons?.map",
    kind: "demo",
    bullets: [
      "Client Component because it uses `useParams`",
      "`lessons?.map` so a module without lessons does not throw",
      "The toolbar stays static — only the list is data-driven",
    ],
    code: `"use client";

import { useParams } from "next/navigation";
import Module from "./Module";
import Lesson from "./Lesson";
import * as db from "../../../database";

export default function Modules() {
  const { cid } = useParams();
  const modules = db.modules.filter((module) => module.course === cid);
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
        >
          Collapse All
        </button>
        <button
          type="button"
          className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
        >
          View Progress
        </button>
        <select
          defaultValue="publish-all"
          className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
        >
          <option value="publish-all">Publish All</option>
          <option value="unpublish-all">Unpublish All</option>
        </select>
        <button
          type="button"
          className="rounded border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          + Module
        </button>
      </div>
      <ul id="wd-modules" className="m-0 list-none p-0">
        {modules.map((module) => (
          <Module key={module._id} title={module.name}>
            {module.lessons?.map((lesson) => (
              <Lesson key={lesson._id} title={lesson.name} />
            ))}
          </Module>
        ))}
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [9, 10, [41, 45]],
    embed: "kambaz-ch3-modules",
  },
  {
    id: "pattern",
    title: "Same tools, now on real data",
    kind: "content",
    bullets: [
      "`filter` from §3.4.7 keeps this course’s modules",
      "`map` from §3.4.4 renders each `Module` and `Lesson`",
      "`?.` from §3.4.17 skips a missing `lessons` array",
      "Add a lesson in JSON and confirm it appears only for that course",
    ],
  },
  {
    id: "recap",
    title: "Modules data recap",
    kind: "content",
    bullets: [
      "`useParams()` → `cid` → `db.modules.filter(m => m.course === cid)`",
      "`key={module._id}` and `key={lesson._id}`",
      "Nested `lessons?.map` — optional chaining on the list",
    ],
  },
  {
    id: "next-up",
    title: "Next: assignments and people",
    kind: "title",
    bullets: [
      "Assignments filter the same way. People joins two JSON files",
      "§3.9.8–3.9.9: list, editor, then `enrollments.some`",
    ],
  },
];
