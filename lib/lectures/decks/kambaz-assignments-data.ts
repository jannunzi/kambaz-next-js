import type { LectureSlide } from "../types";

export const KAMBAZ_ASSIGNMENTS_DATA_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Assignments and People",
      "§3.9.8–3.9.9 · filter rows, then join enrollments",
    ],
  },
  {
    id: "purpose",
    title: "Same filter, two more screens",
    kind: "content",
    bullets: [
      "Assignments: `db.assignments.filter` where `assignment.course === cid`",
      "The editor `find`s by `aid` and fills fields with `assignment?.title ?? \"\"`",
      "People: `users` plus `enrollments` — `some` ties a user to this course",
      "Course Navigation, Assignments, and the editor stay On your own",
    ],
  },
  {
    id: "list",
    title: "Assignments can stay a Server page",
    kind: "demo",
    bullets: [
      "`await params` instead of `useParams` — no `\"use client\"`",
      "Search, Group, and + Assignment stay static — only the list is data-driven",
      "Map each row to `AssignmentItem` with `key={assignment._id}`",
      "Encode both ids: `/courses/${cid}/assignments/${aid}`",
    ],
    code: `import { FaPlus, FaSearch } from "react-icons/fa";
import AssignmentItem from "./AssignmentItem";
import * as db from "../../../database";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  const assignments = db.assignments.filter(
    (assignment) => assignment.course === cid,
  );
  return (
    <div id="wd-assignments">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="relative">
          <FaSearch className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
          <input
            placeholder="Search for Assignments"
            id="wd-search-assignment"
            className="rounded border py-1.5 pr-3 pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            id="wd-add-assignment-group"
            type="button"
            className="inline-flex items-center gap-1 rounded border px-3 py-1.5 text-sm"
          >
            <FaPlus /> Group
          </button>
          <button
            id="wd-add-assignment"
            type="button"
            className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            <FaPlus /> Assignment
          </button>
        </div>
      </div>
      <h3
        id="wd-assignments-title"
        className="mb-3 flex items-center justify-between rounded bg-neutral-200 p-3 text-lg"
      >
        <span>ASSIGNMENTS 40% of Total</span>
        <button
          type="button"
          className="inline-flex items-center rounded border bg-white px-2 py-0.5 text-sm"
        >
          <FaPlus />
        </button>
      </h3>
      <ul id="wd-assignment-list" className="m-0 list-none p-0">
        {assignments.map((assignment) => (
          <AssignmentItem
            key={assignment._id}
            cid={cid}
            aid={assignment._id}
            title={assignment.title}
            details={\`Multiple Modules | Not available until \${assignment.available} | Due \${assignment.due} | \${assignment.points} pts\`}
          />
        ))}
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
    codeHighlightLines: [[10, 13], [55, 63]],
    embed: "kambaz-ch3-assignments",
  },
  {
    id: "editor",
    title: "Editor find + optional fields",
    kind: "content",
    bullets: [
      "Await `cid` and `aid`, then `db.assignments.find((a) => a._id === aid)`",
      "`assignment?.title ?? \"\"` — the same `?.` / `??` as §3.4.17",
      "Points, due, and available from use that same `assignment?.` read",
      "Cancel and Save are `Link`s back to that course’s list",
    ],
    code: `import Link from "next/link";
import * as db from "../../../../database";

export default async function AssignmentEditor({
  params,
}: {
  params: Promise<{ cid: string; aid: string }>;
}) {
  const { cid, aid } = await params;
  const assignment = db.assignments.find((a) => a._id === aid);
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue={assignment?.title ?? ""} />
      <br />
      <br />
      <textarea
        id="wd-description"
        defaultValue={assignment?.description ?? ""}
        rows={8}
        className="w-full"
      />
      <br />
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={assignment?.points ?? 100} />
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-due-date">Due</label>
            </td>
            <td>
              <input
                type="date"
                id="wd-due-date"
                defaultValue={assignment?.due}
              />
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-available-from">Available from</label>
            </td>
            <td>
              <input
                type="date"
                id="wd-available-from"
                defaultValue={assignment?.available}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <Link href={\`/courses/\${cid}/assignments\`} id="wd-cancel">
        Cancel
      </Link>{" "}
      <Link href={\`/courses/\${cid}/assignments\`} id="wd-save">
        Save
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx",
    codeHighlightLines: [9, 10, 14],
  },
  {
    id: "people",
    title: "People joins users to enrollments",
    kind: "demo",
    bullets: [
      "`enrollments.some` — the same `some` as §3.4.8",
      "Keep users whose enrollment `user` and `course` both match",
      "Each row shows name, login id, section, role, and activity",
      "Open People for RS101 vs RS102 and confirm the names change",
    ],
    code: `import { FaUserCircle } from "react-icons/fa";
import * as db from "../../../../database";

export default async function PeopleTable({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  const { users, enrollments } = db;
  const enrolled = users.filter((usr) =>
    enrollments.some(
      (enrollment) => enrollment.user === usr._id && enrollment.course === cid,
    ),
  );
  return (
    <div id="wd-people-table" className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300">
            <th className="p-2">Name</th>
            <th className="p-2">Login ID</th>
            <th className="p-2">Section</th>
            <th className="p-2">Role</th>
            <th className="p-2">Last Activity</th>
            <th className="p-2">Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {enrolled.map((user) => (
            <tr key={user._id} className="odd:bg-neutral-50">
              <td className="wd-full-name p-2 text-nowrap">
                <FaUserCircle className="me-2 inline align-middle text-3xl text-neutral-500" />
                <span className="wd-first-name">{user.firstName}</span>{" "}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id p-2">{user.loginId}</td>
              <td className="wd-section p-2">{user.section}</td>
              <td className="wd-role p-2">{user.role}</td>
              <td className="wd-last-activity p-2">{user.lastActivity}</td>
              <td className="wd-total-activity p-2">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/page.tsx",
    codeHighlightLines: [[11, 15], 31],
    embed: "kambaz-ch3-people",
  },
  {
    id: "recap",
    title: "Kambaz data recap",
    kind: "content",
    bullets: [
      "Nav and course nav: `LINKS.map`. Dashboard: `courses.map`",
      "Modules and assignments: `filter` by `cid`. Editor: `find` by `aid`",
      "People: `filter` + `some` on enrollments. Every list needs a `key`",
    ],
  },
  {
    id: "done",
    title: "Chapter 3 decks are complete",
    kind: "title",
    bullets: [
      "Lab 3 taught the language. Kambaz now renders from JSON",
      "§3.9.10 is the coverage checklist — then Chapter 4 adds state",
    ],
  },
];
