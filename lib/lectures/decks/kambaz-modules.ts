import type { LectureSlide } from "../types";

export const KAMBAZ_MODULES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "KAMBAZ MODULES",
      "Nested lists, then Home + Course Status",
    ],
  },
  {
    id: "nesting",
    title: "Creating the Modules Screen",
    kind: "content",
    bullets: [
      "Opening a course lands on **Home**. Home shows the same module list",
      "Build **Modules** first, then reuse that page on Home",
      "Top-level **modules** → nested **lessons** → **content items**",
    ],
  },
  {
    id: "module",
    title: "Module is one week",
    kind: "content",
    bullets: [
      "`app/(kambaz)/courses/[cid]/modules/Module.tsx`",
      "Title plus a `children` slot where lessons nest",
      "Classes: `wd-module`, `wd-title`, `wd-lessons`",
    ],
    code: `import type { ReactNode } from "react";

export default function Module({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <li className="wd-module">
      <div className="wd-title">{title}</div>
      <ul className="wd-lessons">{children}</ul>
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/Module.tsx",
  },
  {
    id: "lesson",
    title: "Lesson nests content items",
    kind: "content",
    bullets: [
      "`app/(kambaz)/courses/[cid]/modules/Lesson.tsx`",
      "Same shape one level down — LEARNING OBJECTIVES, READING, SLIDES",
      "Always render `wd-content` so `{children}` stay the pattern",
    ],
    code: `import type { ReactNode } from "react";

export default function Lesson({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <li className="wd-lesson">
      <span className="wd-title">{title}</span>
      <ul className="wd-content">{children}</ul>
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/Lesson.tsx",
  },
  {
    id: "target-modules",
    title: "Canvas target: Modules",
    kind: "content",
    bullets: [
      "Book Figure 1.4.5a — weeks → lessons → content items",
      "This week is the **nested list**. Chapter 2 styles the bars",
    ],
    imageSrc: "/images/book/kambaz/modules.png",
    imageAlt: "Target Kambaz Modules screen",
    imageCaption: "Figure 1.4.5a — Modules Screen",
  },
  {
    id: "modules-page",
    title: "Modules.tsx uses Module + Lesson",
    kind: "content",
    bullets: [
      "Import `Module` and `Lesson`, then nest Week 1 fully",
      "Weeks 2–3 can start thin",
      "List id `wd-modules`",
    ],
    code: `import Module from "./Module";
import Lesson from "./Lesson";

export default function Modules() {
  return (
    <div>
      <button>Collapse All</button> <button>View Progress</button>{" "}
      <select defaultValue="publish-all">
        <option value="publish-all">Publish All</option>
      </select>{" "}
      <button>+ Module</button>
      <ul id="wd-modules">
        <Module title="Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda">
          <Lesson title="LEARNING OBJECTIVES">
            <li className="wd-content-item">Introduction to the course</li>
            <li className="wd-content-item">Learn what is Web Development</li>
          </Lesson>
          <Lesson title="READING">
            <li className="wd-content-item">
              Full Stack Developer - Chapter 1 - Introduction
            </li>
            <li className="wd-content-item">
              Full Stack Developer - Chapter 2 - Creating User Interfaces
            </li>
          </Lesson>
          <Lesson title="SLIDES">
            <li className="wd-content-item">Introduction to Web Development</li>
            <li className="wd-content-item">
              Creating an HTTP server with Node.js
            </li>
            <li className="wd-content-item">Creating a React Application</li>
          </Lesson>
        </Module>
        <Module title="Week 2">{/* Expand lessons on your own */}</Module>
        <Module title="Week 3" />
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
  },
  {
    id: "modules-page-live",
    title: "Modules: live demo",
    kind: "demo",
    embed: "kambaz-modules",
    bullets: [
      "Live Modules list — weeks → lessons → content items",
      "Match the Canvas target: expand Week 1 with LEARNING OBJECTIVES",
      "Unstyled HTML prototype — Tailwind is Chapter 2",
    ],
  },
  {
    id: "status",
    title: "Implement Course Status Sidebar",
    kind: "content",
    bullets: [
      "`app/(kambaz)/courses/[cid]/home/Status.tsx` — wrapper `wd-course-status`",
      "Start from the stub; complete the remaining buttons on your own",
    ],
    code: `export default function CourseStatus() {
  return (
    <div id="wd-course-status">
      <h2>Course Status</h2>
      <button>Unpublish</button> <button>Publish</button>
      <br />
      <br />
      {/* Complete the remaining status actions on your own */}
      <button>View Course Notifications</button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/home/Status.tsx",
  },
  {
    id: "target-home",
    title: "Canvas target: Home",
    kind: "content",
    bullets: [
      "Book Figure 1.4.6a — Modules beside Course Status",
      "Kambaz + Course nav already come from the outer layouts",
    ],
    imageSrc: "/images/book/kambaz/home.png",
    imageAlt: "Target Kambaz Home screen with Course Status",
    imageCaption: "Figure 1.4.6a — Home Screen",
  },
  {
    id: "home",
    title: "Implementing the Home Screen",
    kind: "content",
    bullets: [
      "Home only needs Modules (70%) beside Course Status",
      "Import the Modules **page** — `import Modules from \"../modules/page\"`",
      "Delete any leftover `page.tsx` directly under `courses/[cid]/`",
    ],
    code: `import Modules from "../modules/page";
import CourseStatus from "./Status";

export default function Home() {
  return (
    <div id="wd-home">
      <table>
        <tbody>
          <tr>
            <td valign="top" width="70%">
              <Modules />
            </td>
            <td valign="top">
              <CourseStatus />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/home/page.tsx",
    codeAddedLines: [1, 2, 15, 18],
  },
  {
    id: "home-live",
    title: "Home: live demo",
    kind: "demo",
    embed: "kambaz-home",
  },
  {
    id: "next-up",
    title: "Next: Assignments",
    kind: "title",
    bullets: [
      "On your own — match the Assignments screen in the book and the `wd-*` ids",
    ],
  },
];
