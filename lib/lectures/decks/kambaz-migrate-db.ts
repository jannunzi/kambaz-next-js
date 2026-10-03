import type { LectureSlide } from "../types";

export const KAMBAZ_MIGRATE_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Migrating the Database",
      "§5.4.1 · JSON files become server modules",
    ],
  },
  {
    id: "purpose",
    title: "Data belongs on the server",
    kind: "content",
    bullets: [
      "Dashboard Add / Edit / Delete still die on refresh",
      "Copy Chapter 3 JSON into `webdev-server/Kambaz/Database`",
      "URLs stay the same in Chapter 6 — only the storage changes",
    ],
  },
  {
    id: "courses-js",
    title: "Copy JSON into .js modules",
    kind: "demo",
    bullets: [
      "Rename `courses.json` → `courses.js`. Same for users, modules, …",
      "`export default` the array. Keep the Chapter 3 `_id`s",
    ],
    code: `export default [
  { _id: "RS101", name: "Rocket Propulsion", number: "RS4550",
    startDate: "2023-01-10", endDate: "2023-05-15",
    department: "D123", credits: 4, description: "..." },
  // … remaining courses from Chapter 3
];`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Database/courses.js",
    codeHighlightLines: [1],
  },
  {
    id: "barrel",
    title: "One barrel re-exports the arrays",
    kind: "demo",
    bullets: [
      "Routes receive `db` and read `db.courses`, `db.users`, …",
      "Customize the seed if you want — the shape stays",
    ],
    code: `import courses from "./courses.js";
import modules from "./modules.js";
import assignments from "./assignments.js";
import users from "./users.js";
import enrollments from "./enrollments.js";
export default { courses, modules, assignments, users, enrollments };`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Database/index.js",
    codeAddedLines: [6],
  },
  {
    id: "recap",
    title: "Database migrate recap",
    kind: "content",
    bullets: [
      "`Kambaz/Database/*.js` — arrays, not React imports",
      "Barrel `export default { courses, users, … }`",
      "Mongo replaces these arrays in Chapter 6",
    ],
  },
  {
    id: "next-up",
    title: "Next: account REST APIs",
    kind: "title",
    bullets: [
      "A Users DAO, then signin / signup / profile / signout",
      "§5.4.2: axios posts credentials; Context stores the user",
    ],
  },
];
