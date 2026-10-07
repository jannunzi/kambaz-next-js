import type { LectureSlide } from "../types";

export const KAMBAZ_ASSIGNMENTS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "KAMBAZ ASSIGNMENTS",
      "List + editor — on your own, match the ids",
    ],
  },
  {
    id: "on-your-own",
    title: "Creating the Assignments Screen",
    kind: "content",
    bullets: [
      "Lists assignments students must complete throughout a course",
      "From the Dashboard, open a course, then **Assignments** in Course Navigation",
      "Grouped as ASSIGNMENTS, QUIZZES, EXAMS, and PROJECT",
      "Match the Assignments screen and the `wd-*` ids",
    ],
  },
  {
    id: "target-assignments",
    title: "Canvas target: Assignments",
    kind: "content",
    bullets: [
      "Book Figure 1.4.7a — grouped list students see in Canvas-style LMS",
      "This week: **plain HTML**. Match the ids; Tailwind is Chapter 2",
    ],
    imageSrc: "/images/book/kambaz/assignments.png",
    imageAlt: "Target Kambaz Assignments screen",
    imageCaption: "Figure 1.4.7a — Assignments Screen",
  },
  {
    id: "list-screen",
    title: "Create Assignments Screen",
    kind: "content",
    bullets: [
      "`app/(kambaz)/courses/[cid]/assignments/page.tsx`",
      "Search: `id=\"wd-search-assignment\"`",
      "Buttons: `+ Group` and `+ Assignment`",
      "Heading `wd-assignments-title` — `ASSIGNMENTS 40% of Total`",
    ],
    code: `export default function Assignments() {
  return (
    <div id="wd-assignments">
      <input placeholder="Search for Assignments"
             id="wd-search-assignment" />
      <button id="wd-add-assignment-group">+ Group</button>
      <button id="wd-add-assignment">+ Assignment</button>
      <h3 id="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button>+</button>
      </h3>
      <ul id="wd-assignment-list">
        <li className="wd-assignment-list-item">
          {/* Link title with wd-assignment-link */}
        </li>
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
  },
  {
    id: "list-screen-live",
    title: "Assignments: live demo",
    kind: "demo",
    embed: "kambaz-assignments",
  },
  {
    id: "assignment-item",
    title: "Extract AssignmentItem",
    kind: "content",
    bullets: [
      "List id `wd-assignment-list` with **at least three** rows",
      "A1 ENV + HTML, A2 CSS + TAILWIND, A3 JS + REACT",
      "`Link` from `next/link` — not `<a>` — class `wd-assignment-link`",
    ],
    code: `import Link from "next/link";

export default function AssignmentItem({
  cid,
  aid,
  title,
  details,
}: {
  cid: string;
  aid: string;
  title: string;
  details: string;
}) {
  return (
    <li className="wd-assignment-list-item">
      {/* Link the title to /courses/\${cid}/assignments/\${aid}
          (className wd-assignment-link), then show details underneath */}
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/AssignmentItem.tsx",
  },
  {
    id: "await-params",
    title: "Page awaits cid from params",
    kind: "content",
    bullets: [
      "Same `async` / `await params` shape as the courses layout",
      "Keep the search box, `+ Group`, `+ Assignment`, and the `wd-assignments-title` heading",
      "Use `cid` so each `AssignmentItem` links to the right course",
    ],
    code: `import AssignmentItem from "./AssignmentItem";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return (
    <div id="wd-assignments">
      {/* search input, + Group, + Assignment */}
      {/* h3 wd-assignments-title */}
      <ul id="wd-assignment-list">
        {/* at least three AssignmentItems using cid */}
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
  },
  {
    id: "target-editor",
    title: "Canvas target: Assignment editor",
    kind: "content",
    bullets: [
      "Book Figure 1.4.8a — faculty edit name, points, dates, and assign",
      "Start from name / description / points, then complete on your own",
    ],
    imageSrc: "/images/book/kambaz/assignment-editor.png",
    imageAlt: "Target Kambaz Assignment Editor screen",
    imageCaption: "Figure 1.4.8a — Assignment Editor",
  },
  {
    id: "editor",
    title: "Create Assignment Editor Screen",
    kind: "content",
    bullets: [
      "`app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx`",
      "Wrapper `wd-assignments-editor`. Use **`defaultValue`**, not `value`",
      "Start from name (`wd-name`), description, points (`wd-points`)",
    ],
    code: `export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" />
      <br /><br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
      </textarea>
      <br />
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>
          {/* Complete on your own — see checklist below */}
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx",
  },
  {
    id: "editor-live",
    title: "Assignment editor: live",
    kind: "demo",
    embed: "kambaz-assignment-editor",
  },
  {
    id: "editor-rest",
    title: "Complete the editor fields",
    kind: "content",
    bullets: [
      "Group `wd-group` — ASSIGNMENTS, QUIZZES, EXAMS, PROJECT",
      "`wd-display-grade-as`, `wd-submission-type`",
      "Checkboxes: `wd-text-entry`, `wd-website-url`, `wd-media-recordings`",
      "Assign: `wd-assign-to`, `wd-due-date`, `wd-available-from`, `wd-available-until`",
      "Cancel `wd-cancel` and Save `wd-save` — `Link`s back to the list",
    ],
  },
  {
    id: "labels",
    title: "Labels must focus controls",
    kind: "content",
    bullets: [
      "Same Lab 1 rule: `htmlFor` on the label matches `id` on the control",
      "Clicking a label next to a text field **focuses** that field",
      "Clicking a label next to a checkbox **toggles** the checkbox",
    ],
  },
];
