import type { BookExerciseParent } from "./types";

function lab(id: string, description: string) {
  return { id, kind: "core" as const, description };
}

function oyo(id: string, description: string) {
  return { id, kind: "oyo" as const, description };
}

function ai(id: string, description: string) {
  return { id, kind: "ai" as const, description };
}

function rangeOwn(from: string, to: string): string {
  return `Complete each section's On your own in §${from}–§${to}.`;
}

function rangeAi(from: string, to: string): string {
  return `Complete each section's With AI extra in §${from}–§${to}.`;
}

/** §2.3.7 Lab 2 recap — same parents as the previous flat list. */
export const CH2_LAB_EXERCISES: readonly BookExerciseParent[] = [
  {
    id: "2.1",
    parentLabel: "Lab 2 page and CSS file",
    section: "2.1",
    tasks: [
      lab(
        "2.1-lab",
        "Create app/labs/lab2/page.tsx and index.css, and link Lab 2 from the Labs index and TOC.",
      ),
    ],
  },
  {
    id: "2.1.1",
    parentLabel: "Selectors",
    section: "2.1.1",
    sectionEnd: "2.1.5",
    tasks: [
      lab(
        "2.1.1-lab",
        "Practice the style attribute, then move rules into the CSS file with id, class, and document-structure selectors.",
      ),
      oyo("2.1.1-oyo", rangeOwn("2.1.1", "2.1.5")),
      ai("2.1.1-ai", rangeAi("2.1.1", "2.1.5")),
    ],
  },
  {
    id: "2.1.7",
    parentLabel: "Color, border, and box model",
    section: "2.1.7",
    sectionEnd: "2.1.12",
    tasks: [
      lab(
        "2.1.7-lab",
        "Create the color, border, box-model, corner, dimension, and display samples and import them.",
      ),
      oyo("2.1.7-oyo", rangeOwn("2.1.7", "2.1.12")),
      ai("2.1.7-ai", rangeAi("2.1.7", "2.1.12")),
    ],
  },
  {
    id: "2.1.13",
    parentLabel: "Position, float, flex, and media queries",
    section: "2.1.13",
    sectionEnd: "2.1.20",
    tasks: [
      lab(
        "2.1.13-lab",
        "Create the position, z-index, float, grid, flex, and media-query samples and import them.",
      ),
      oyo("2.1.13-oyo", rangeOwn("2.1.13", "2.1.20")),
      ai("2.1.13-ai", rangeAi("2.1.13", "2.1.20")),
    ],
  },
  {
    id: "2.2",
    parentLabel: "React Icons",
    section: "2.2",
    tasks: [
      lab("2.2-lab", "Create ReactIconsSampler.tsx and import it."),
      oyo(
        "2.2-oyo",
        "In ReactIconsSampler.tsx, import two more icons from families you have not used yet, give them a className for size or color, and keep them on the Lab 2 page.",
      ),
      ai(
        "2.2-ai",
        "Ask the assistant to add two sample icons from other families — leave your personal pair as yours.",
      ),
    ],
  },
  {
    id: "2.3",
    parentLabel: "Tailwind samples",
    section: "2.3",
    tasks: [
      lab(
        "2.3-lab",
        "Create the Tailwind samples under app/labs/lab2/tailwind/ — spacing, typography, backgrounds, responsive prefixes, filters, and grids.",
      ),
      oyo(
        "2.3-oyo",
        "Complete each Tailwind section's On your own (spacing, typography, backgrounds, responsive, filters, grids).",
      ),
      ai(
        "2.3-ai",
        "Complete each Tailwind section's With AI extra.",
      ),
    ],
  },
];

/** §2.4.10 Kambaz restyle recap. */
export const CH2_KAMBAZ_EXERCISES: readonly BookExerciseParent[] = [
  {
    id: "2.4.1",
    parentLabel: "Kambaz Navigation",
    section: "2.4.1",
    tasks: [
      lab(
        "2.4.1-lab",
        "Style Kambaz Navigation and replace the table layout with flex.",
      ),
      oyo(
        "2.4.1-oyo",
        "In Navigation.tsx, finish remaining sidebar links with fitting React Icons, then confirm the active link and wd-main-content-offset still keep content clear of the fixed bar.",
      ),
      ai(
        "2.4.1-ai",
        "Add a second sample tile (wd-ai-nav-help to /labs) — leave your personal icons as yours.",
      ),
    ],
  },
  {
    id: "2.4.2",
    parentLabel: "Dashboard",
    section: "2.4.2",
    tasks: [
      lab("2.4.2-lab", "Style the Dashboard and CourseCard."),
      oyo(
        "2.4.2-oyo",
        "Personalize a card and confirm the responsive grid.",
      ),
      ai("2.4.2-ai", "Add a fourth sample course card — leave your personal card as yours."),
    ],
  },
  {
    id: "2.4.3",
    parentLabel: "Course Navigation",
    section: "2.4.3",
    tasks: [
      lab("2.4.3-lab", "Style Course Navigation."),
      oyo(
        "2.4.3-oyo",
        "Finish the list-group links, active border, and ~140px sidebar.",
      ),
      ai("2.4.3-ai", "Add a second sample course link — leave your personal link as yours."),
    ],
  },
  {
    id: "2.4.4",
    parentLabel: "Modules",
    section: "2.4.4",
    tasks: [
      lab("2.4.4-lab", "Style Modules, Module, and Lesson."),
      oyo("2.4.4-oyo", "Add a module or lesson with your title."),
      ai("2.4.4-ai", "Add a second sample module — leave your personal title as yours."),
    ],
  },
  {
    id: "2.4.5",
    parentLabel: "Home",
    section: "2.4.5",
    tasks: [
      lab("2.4.5-lab", "Style Home and Course Status."),
      oyo(
        "2.4.5-oyo",
        "Finish the Status buttons and confirm Status stacks below lg and sidebars below md.",
      ),
      ai("2.4.5-ai", "Add a second sample status action — leave your personal button as yours."),
    ],
  },
  {
    id: "2.4.6",
    parentLabel: "People",
    section: "2.4.6",
    tasks: [
      lab("2.4.6-lab", "Style the People table."),
      oyo("2.4.6-oyo", "Show at least three people rows."),
      ai("2.4.6-ai", "Add three sample roster rows — leave your personal rows as yours."),
    ],
  },
  {
    id: "2.4.7",
    parentLabel: "Assignments",
    section: "2.4.7",
    tasks: [
      lab("2.4.7-lab", "Style the Assignments screen."),
      oyo("2.4.7-oyo", "Add one more assignment row."),
      ai("2.4.7-ai", "Add a second sample assignment — leave your personal row as yours."),
    ],
  },
  {
    id: "2.4.8",
    parentLabel: "Assignment Editor",
    section: "2.4.8",
    tasks: [
      lab(
        "2.4.8-lab",
        "Style the Assignment Editor to match the figures and interactive demo (On your own).",
      ),
      oyo(
        "2.4.8-oyo",
        "Apply Tailwind form utilities on the editor; Cancel and Save return to the list.",
      ),
      ai(
        "2.4.8-ai",
        "Add a second sample field on the editor — leave your personal labels as yours.",
      ),
    ],
  },
  {
    id: "2.4.9",
    parentLabel: "Account screens",
    section: "2.4.9",
    tasks: [
      lab(
        "2.4.9-lab",
        "Style Sign in, Sign up, Profile, and Account Navigation (On your own).",
      ),
      oyo(
        "2.4.9-oyo",
        "Style the account screens and nav so /account/signin is still the first Kambaz screen.",
      ),
      ai(
        "2.4.9-ai",
        "Add a sample note field on Sign in — do not change Sign up, Profile, or routing.",
      ),
    ],
  },
];

/** §3.7.5 Lab 3 recap. Each item says what the deployed /labs/lab3 page shows. */
export const CH3_LAB_EXERCISES: readonly BookExerciseParent[] = [
  {
    id: "3.2",
    parentLabel: "Variables and conditionals",
    section: "3.2",
    tasks: [
      lab(
        "3.2-lab",
        "Create VariablesAndConstants, VariableTypes, BooleanVariables, IfElse, TernaryOperator, ConditionalOutputIfElse, ConditionalOutputInline, and NullUndefined, and render each on /labs/lab3 under its own heading, in book order.",
      ),
      oyo(
        "3.2-oyo",
        "On /labs/lab3: one more let and one more const in Variables and Constants; a second string and number with their typeof in Variable Types; one more === comparison in Boolean Variables; a visible third paragraph (not false1) in If Else; a Good morning / Good afternoon ternary on hour; a Guest Inline heading; and nullValue ?? \"default\" = default in Null vs Undefined.",
      ),
      ai(
        "3.2-ai",
        "On /labs/lab3: sampleSum, sampleCount and sampleLabel with their typeof, true6, a hidden false1 paragraph, a Premium/Free ternary showing Free, an Admin Inline heading, and the two null == / === undefined lines — next to your own additions, not replacing them.",
      ),
    ],
  },
  {
    id: "3.3",
    parentLabel: "Functions",
    section: "3.3",
    tasks: [
      lab(
        "3.3-lab",
        "Create LegacyFunctions, ArrowFunctions, ImpliedReturn, and TemplateLiterals, and render each on /labs/lab3 under its own heading.",
      ),
      oyo(
        "3.3-oyo",
        "On /labs/lab3: a subtract result under the legacy sum, add(2, 4) = 6 in Arrow Functions, square(9) = 81 in Implied Return, and a template string that includes your name and a ternary in Template Literals.",
      ),
      ai(
        "3.3-ai",
        "On /labs/lab3: multiply(3, 7) = 21 (also logged to the console), multiply(3, 4) = 12, divide(20, 4) = 5, and the RS101 published: Yes string — next to your own additions.",
      ),
    ],
  },
  {
    id: "3.4.1",
    parentLabel: "Arrays",
    section: "3.4.1",
    sectionEnd: "3.4.9",
    tasks: [
      lab(
        "3.4.1-lab",
        "Create the array samples from SimpleArrays through ReduceFunction, and render each on /labs/lab3 under its own heading.",
      ),
      oyo(
        "3.4.1-oyo",
        "On /labs/lab3: a third item in the SimpleArrays list, indexOf(9) = -1, one more pushed todo, a lowercased array from the loop, a third mapped todo, a missing find, findIndex for 3 = -1, a filter of numbers >= 5, every(n > 4) = false and some(n === 1), and a product reduce.",
      ),
      ai(
        "3.4.1-ai",
        "On /labs/lab3: Call the dentist, indexOf1 = 0, Buy stamps, stringLengths, Email the TA with doubles, two = 2, sixIndex = 4, numbersLessThan2, includes(5), and joined — next to your own additions.",
      ),
    ],
  },
  {
    id: "3.4.10",
    parentLabel: "JSON, objects, and destructuring",
    section: "3.4.10",
    sectionEnd: "3.4.17",
    tasks: [
      lab(
        "3.4.10-lab",
        "Create JsonStringify, House, Spreader, Destructing, FunctionDestructing, Math.ts, DestructingImports, and OptionalChaining and render them on /labs/lab3: the House section pretty-prints an object with a nested object and an array inside a <pre> (JSON.stringify(house, null, 2)), and Destructing Imports is a table with at least 4 rows of 3 cells (Math, Matematica, named functions).",
      ),
      oyo(
        "3.4.10-oyo",
        "On /labs/lab3: a stringified object of your own, yearBuilt and the owners (Alice, Bob) under House, obj4 stringified, a fourth array item or third property destructured, multiply and greet() with the default name, a fifth Destructing Imports row for add(10, 20) = 30, and house.garage?.cars ?? 0 = 0 — and npm run build still succeeds.",
      ),
      ai(
        "3.4.10-ai",
        "On /labs/lab3: sampleCourse, house.garage.cars, arr3, city = Boston, the divide quotient, a sixth Destructing Imports row for remainder(10, 3) = 1, and the zip line reading unknown — next to your own additions.",
      ),
    ],
  },
  {
    id: "3.5",
    parentLabel: "Classes and styles",
    section: "3.5",
    tasks: [
      lab(
        "3.5-lab",
        "Create Classes.css, Classes.tsx, and Styles.tsx and render both on /labs/lab3: at least 4 boxes colored by classes defined in Classes.css (not inline styles), and at least 3 boxes colored with inline style={{ backgroundColor: … }} objects.",
      ),
      oyo(
        "3.5-oyo",
        "Classes shows a sixth box whose class comes from a ternary on a const of yours; Styles shows a fourth box, Green background, using a bgGreen object that spreads colorBlack and padding10px.",
      ),
      ai(
        "3.5-ai",
        "Classes also shows Dynamic Green background (seven boxes); Styles also shows Gray background (five boxes).",
      ),
    ],
  },
  {
    id: "3.6",
    parentLabel: "Client and server components",
    section: "3.6",
    tasks: [
      lab(
        "3.6-lab",
        'On /labs/lab3: a Client Component ("use client") that prints the current pathname (/labs/lab3), and a Server Component that prints the server information and a list of at least 3 file names read from app/labs/lab3 with fs.',
      ),
      oyo(
        "3.6-oyo",
        "The Client Component also shows Pathname length: 10 on /labs/lab3; the Server Information block also shows arch.",
      ),
      ai(
        "3.6-ai",
        "The Client Component also shows Last segment: lab3; the Server Information block also shows pid.",
      ),
    ],
  },
  {
    id: "3.7",
    parentLabel: "Add, Square, and Highlight",
    section: "3.7",
    sectionEnd: "3.7.1",
    tasks: [
      lab(
        "3.7-lab",
        "Create Add.tsx, Square.tsx, and Highlight.tsx. /labs/lab3 shows a + b = 7 for <Add a={3} b={4} />, 16 for <Square>4</Square>, and a sentence wrapped in Highlight (yellow background, red text).",
      ),
      oyo(
        "3.7-oyo",
        "/labs/lab3 also shows a + b = 30 for <Add a={10} b={20} />, 81 for <Square>9</Square>, and a Highlight around a sentence you wrote.",
      ),
      ai(
        "3.7-ai",
        "/labs/lab3 also shows a + b = 15, Square of 5 = 25, and Children can be any JSX highlighted.",
      ),
    ],
  },
  {
    id: "3.7.2",
    parentLabel: "Labs TOC highlight",
    section: "3.7.2",
    tasks: [
      lab(
        "3.7.2-lab",
        "Replace app/labs/TOC.tsx with the client version that maps LINKS and uses usePathname. On each Lab page the TOC (from app/labs/layout.tsx) links Home, Lab 1, Lab 2, Lab 3, and Kambaz, and only the current lab's link is marked as active (the blue pill style and aria-current).",
      ),
      oyo(
        "3.7.2-oyo",
        "The marking moves with you: on /labs/lab1 only Lab 1 is the pill, and on /labs/lab3 only Lab 3 is.",
      ),
      ai(
        "3.7.2-ai",
        "The TOC also has a Book Ch3 link to https://kambaz.dev/book/ch3 that is never highlighted.",
      ),
    ],
  },
  {
    id: "3.7.3",
    parentLabel: "Path parameters",
    section: "3.7.3",
    tasks: [
      lab(
        "3.7.3-lab",
        "Create app/labs/lab3/add/[a]/[b]/page.tsx and PathParameters.tsx. /labs/lab3 links to at least two /labs/lab3/add/<a>/<b> URLs, and visiting /labs/lab3/add/<a>/<b> shows a + b for any two numbers (for example /labs/lab3/add/12/30 shows 42).",
      ),
      oyo(
        "3.7.3-oyo",
        "Path Parameters shows a third link with two numbers of your choice, and its page prints their sum.",
      ),
      ai(
        "3.7.3-ai",
        "Path Parameters also links 5 + 6, and its page prints 5 + 6 = 11.",
      ),
    ],
  },
  {
    id: "3.7.4",
    parentLabel: "Todo list",
    section: "3.7.4",
    tasks: [
      lab(
        "3.7.4-lab",
        "Create todos/TodoItem.tsx, todos/todos.json, and todos/TodoList.tsx (map with key={todo.title}). /labs/lab3 shows a list of at least 3 todo checkboxes from todos.json, with at least one checked and one unchecked.",
      ),
      oyo(
        "3.7.4-oyo",
        "The Todo List shows a fourth row from a todo you added to todos.json, and TodoList logs the todos array to the console.",
      ),
      ai(
        "3.7.4-ai",
        "The Todo List also shows Email the TA (COMPLETED), checked.",
      ),
    ],
  },
];

/** §3.9.10 Kambaz data recap. Each item says what the deployed screen shows. */
export const CH3_KAMBAZ_EXERCISES: readonly BookExerciseParent[] = [
  {
    id: "3.9.1",
    parentLabel: "Kambaz Navigation from data",
    section: "3.9.1",
    tasks: [
      lab(
        "3.9.1-lab",
        "Kambaz Navigation renders Dashboard, Courses, Calendar, Inbox, and Labs by mapping a LINKS array (Account stays a special case), and only the item for the current screen is highlighted.",
      ),
      oyo(
        "3.9.1-oyo",
        "No sidebar item is hardcoded outside LINKS: on /dashboard only Dashboard is highlighted, on /courses/RS101/home only Courses, and on /labs only Labs.",
      ),
      ai("3.9.1-ai", "The sidebar also shows a sixth item, History, rendered from LINKS."),
    ],
  },
  {
    id: "3.9.2",
    parentLabel: "JSON database",
    section: "3.9.2",
    tasks: [
      lab(
        "3.9.2-lab",
        "app/(kambaz)/database/ holds the reference JSON files (download them from §3.9.2) and index.ts re-exports each one as its section needs it. Keep at least 3 courses, and at least 2 courses that each have modules, assignments, and enrolled users.",
      ),
      oyo(
        "3.9.2-oyo",
        "courses.json has at least 3 courses, each with a unique _id that works in a URL such as /courses/RS101/home.",
      ),
      ai("3.9.2-ai", "Every course in courses.json also has a term field; no _id changed."),
    ],
  },
  {
    id: "3.9.3",
    parentLabel: "Dashboard from JSON",
    section: "3.9.3",
    tasks: [
      lab(
        "3.9.3-lab",
        "The Dashboard shows one card per course in courses.json (at least 3), the published count matches, and each card links to /courses/<course _id>/home.",
      ),
      oyo(
        "3.9.3-oyo",
        "A course you renamed or added in courses.json shows on its card without changes to CourseCard.tsx.",
      ),
      ai("3.9.3-ai", "The Dashboard also shows the RS104 Organic Chemistry card."),
    ],
  },
  {
    id: "3.9.4",
    parentLabel: "Courses from the URL",
    section: "3.9.4",
    tasks: [
      lab(
        "3.9.4-lab",
        "Clicking a Dashboard card opens /courses/<_id>/home, and the course heading shows that card's course name. A different card shows a different name.",
      ),
      oyo(
        "3.9.4-oyo",
        "/courses/RS101/home shows Rocket Propulsion and /courses/RS102/home shows Aerodynamics (or your renamed courses).",
      ),
      ai("3.9.4-ai", "The course heading also shows the course _id in parentheses, for example (RS101)."),
    ],
  },
  {
    id: "3.9.5",
    parentLabel: "Course Navigation from data",
    section: "3.9.5",
    tasks: [
      lab(
        "3.9.5-lab",
        "Course Navigation maps a LINKS array, and its links (Home, Modules, Assignments, People, …) keep the current course's _id in the URL.",
      ),
      oyo(
        "3.9.5-oyo",
        "On /courses/RS102/modules every course link starts with /courses/RS102/ and only Modules is highlighted; the same holds on Home, Assignments, and People.",
      ),
      ai("3.9.5-ai", "Course Navigation also shows Announcements, rendered from LINKS."),
    ],
  },
  {
    id: "3.9.6",
    parentLabel: "Breadcrumb",
    section: "3.9.6",
    tasks: [
      lab(
        "3.9.6-lab",
        "The course heading shows the course name and the current section, and the section changes when you switch between Home, Modules, and Assignments.",
      ),
      oyo(
        "3.9.6-oyo",
        "The heading reads <course name> > Home, > Modules, and > Assignments on those three screens.",
      ),
      ai("3.9.6-ai", "On /courses/<_id>/people/table the heading ends in > People instead of > Table."),
    ],
  },
  {
    id: "3.9.7",
    parentLabel: "Modules from JSON",
    section: "3.9.7",
    tasks: [
      lab(
        "3.9.7-lab",
        "/courses/<_id>/modules lists only that course's modules from modules.json, each with its lessons. Two courses show different module lists.",
      ),
      oyo(
        "3.9.7-oyo",
        "A lesson you added to module M101 shows on /courses/RS101/modules and not on /courses/RS102/modules.",
      ),
      ai("3.9.7-ai", "Nozzle Design also shows under Fuel and Combustion on /courses/RS101/modules only."),
    ],
  },
  {
    id: "3.9.8",
    parentLabel: "Assignments from JSON",
    section: "3.9.8",
    tasks: [
      lab(
        "3.9.8-lab",
        "/courses/<_id>/assignments lists only that course's assignments from assignments.json, each linking to /courses/<_id>/assignments/<assignment _id>. Two courses show different lists (On your own).",
      ),
      oyo(
        "3.9.8-oyo",
        "/courses/RS101/assignments lists A101–A103 and /courses/RS102/assignments lists A201–A203, each row linking to its editor URL.",
      ),
      ai("3.9.8-ai", "/courses/RS102/assignments also lists A4 (A204), which opens /courses/RS102/assignments/A204."),
    ],
  },
  {
    id: "3.9.8.1",
    parentLabel: "Assignment Editor from JSON",
    section: "3.9.8.1",
    tasks: [
      lab(
        "3.9.8.1-lab",
        "The Assignment Editor's name field shows the title of the assignment you clicked, and its description, points, due, and available fields come from the same row (On your own).",
      ),
      oyo(
        "3.9.8.1-oyo",
        "Opening A1 and then A2 from /courses/RS101/assignments changes the fields, and Cancel and Save both return to /courses/RS101/assignments.",
      ),
      ai("3.9.8.1-ai", "The editor also shows Assignment id: <aid>, for example Assignment id: A101."),
    ],
  },
  {
    id: "3.9.9",
    parentLabel: "People from enrollments",
    section: "3.9.9",
    tasks: [
      lab(
        "3.9.9-lab",
        "/courses/<_id>/people/table lists only the users enrolled in that course (from users.json and enrollments.json). Two courses show different rosters.",
      ),
      oyo(
        "3.9.9-oyo",
        "A user you enrolled in a second course (new unique enrollment _id) shows in the People table of both courses.",
      ),
      ai("3.9.9-ai", "Thor Odinson (user 567) also shows in the RS102 People table."),
    ],
  },
];

/** §4.8 Lab 4 recap. */
export const CH4_LAB_EXERCISES: readonly BookExerciseParent[] = [
  {
    id: "4.2",
    parentLabel: "Lab 4 page",
    section: "4.2",
    tasks: [
      lab(
        "4.2-lab",
        "Create the Lab 4 Client Component page and link it from Labs and the Labs TOC.",
      ),
    ],
  },
  {
    id: "4.2.1",
    parentLabel: "Click events",
    section: "4.2.1",
    tasks: [
      lab(
        "4.2.1-lab",
        'Handle a click with onClick and "use client".',
      ),
      oyo(
        "4.2.1-oyo",
        "In ClickEvent.tsx, add a second button with its own id that alerts a greeting that includes your name.",
      ),
      ai(
        "4.2.1-ai",
        "Add a sample goodbye click handler (wd-onclick-goodbye) — leave your named greeting as yours.",
      ),
    ],
  },
  {
    id: "4.2.2",
    parentLabel: "Passing data on events",
    section: "4.2.2",
    tasks: [
      lab("4.2.2-lab", "Pass data into an event with an arrow wrapper."),
      oyo(
        "4.2.2-oyo",
        "Add a third button that passes a different string of your choosing into lifeIs.",
      ),
      ai(
        "4.2.2-ai",
        "Add a sample extra string button — leave your personal string as yours.",
      ),
    ],
  },
  {
    id: "4.2.3",
    parentLabel: "Passing functions",
    section: "4.2.3",
    tasks: [
      lab("4.2.3-lab", "Pass a function from parent to child."),
      oyo(
        "4.2.3-oyo",
        "Pass a second function from page.tsx that alerts your name, and add a second button in PassingFunctions that calls it.",
      ),
      ai(
        "4.2.3-ai",
        "Add a sample extra function button — leave your personal handler as yours.",
      ),
    ],
  },
  {
    id: "4.2.4",
    parentLabel: "let vs useState",
    section: "4.2.4",
    tasks: [
      lab("4.2.4-lab", "Contrast a broken let counter with useState."),
      oyo("4.2.4-oyo", "Add a Reset button that sets the counter back to 7."),
      ai(
        "4.2.4-ai",
        "Add a sample reset button (wd-counter-reset-click) — leave your personal button as yours.",
      ),
    ],
  },
  {
    id: "4.2.5",
    parentLabel: "Boolean, string, date, object, and array state",
    section: "4.2.5",
    sectionEnd: "4.2.9",
    tasks: [
      lab(
        "4.2.5-lab",
        "Bind boolean, string, date, object, and array state.",
      ),
      oyo(
        "4.2.5-oyo",
        "Complete each On your own: a second boolean, lastName, endDate, city on the person object, and a Clear array button.",
      ),
      ai("4.2.5-ai", rangeAi("4.2.5", "4.2.9")),
    ],
  },
  {
    id: "4.3.1",
    parentLabel: "Shared state and prop drilling",
    section: "4.3.1",
    sectionEnd: "4.3.2",
    tasks: [
      lab(
        "4.3.1-lab",
        "Move shared state to a parent and show prop drilling.",
      ),
      oyo("4.3.1-oyo", rangeOwn("4.3.1", "4.3.2")),
      ai("4.3.1-ai", rangeAi("4.3.1", "4.3.2")),
    ],
  },
  {
    id: "4.3.3",
    parentLabel: "Query and path parameters",
    section: "4.3.3",
    tasks: [
      lab(
        "4.3.3-lab",
        "Encode two numbers as query parameters and as path parameters.",
      ),
      oyo(
        "4.3.3-oyo",
        "Add a third number c in the form and URL (path and query).",
      ),
      ai(
        "4.3.3-ai",
        "Add a sample third-number field — leave your personal c as yours.",
      ),
    ],
  },
  {
    id: "4.4",
    parentLabel: "React Context",
    section: "4.4",
    tasks: [
      lab("4.4-lab", "Share a counter with React Context."),
      oyo("4.4-oyo", "Complete the On your own in §4.4.1 and the Context todo list in §4.4.2."),
      ai("4.4-ai", rangeAi("4.4.1", "4.4.2")),
    ],
  },
  {
    id: "4.5",
    parentLabel: "Zustand",
    section: "4.5",
    tasks: [
      lab("4.5-lab", "Rebuild the counter and a todo list with Zustand."),
      oyo("4.5-oyo", "Complete the On your own in §4.5.2."),
      ai("4.5-ai", "Complete the With AI extra in §4.5.2."),
    ],
  },
  {
    id: "4.6",
    parentLabel: "Redux Toolkit",
    section: "4.6",
    tasks: [
      lab(
        "4.6-lab",
        "Rebuild Hello, the counter, Add with a payload, and a todo list with Redux Toolkit.",
      ),
      oyo(
        "4.6-oyo",
        "Complete the On your own in §4.6.2 and split ReduxTodos in §4.6.4.",
      ),
      ai("4.6-ai", "Complete the With AI extra in §4.6.2."),
    ],
  },
  {
    id: "4.7",
    parentLabel: "useEffect",
    section: "4.7",
    tasks: [
      lab("4.7-lab", "Update the document title with useEffect."),
      oyo(
        "4.7-oyo",
        "Log name and count to the console from the same effect so you can see when it runs.",
      ),
      ai(
        "4.7-ai",
        "Add a sample console.log(name, count) in the existing effect — do not add a second useEffect for your personal log.",
      ),
    ],
  },
];

/** §4.11 Kambaz state recap. */
export const CH4_KAMBAZ_EXERCISES: readonly BookExerciseParent[] = [
  {
    id: "4.10.1",
    parentLabel: "Courses store",
    section: "4.10.1",
    tasks: [
      lab("4.10.1-lab", "Create the courses Zustand store seeded from JSON."),
    ],
  },
  {
    id: "4.10.2",
    parentLabel: "Dashboard CRUD",
    section: "4.10.2",
    tasks: [
      lab("4.10.2-lab", "Add, edit, update, and delete courses on the Dashboard."),
      oyo(
        "4.10.2-oyo",
        "Add number and startDate on the course form (§4.10.2.3).",
      ),
      ai(
        "4.10.2-ai",
        "Add a sample course-number field (wd-course-number) — leave your personal fields as yours.",
      ),
    ],
  },
  {
    id: "4.10.3",
    parentLabel: "Course Navigation toggle",
    section: "4.10.3",
    tasks: [
      lab(
        "4.10.3-lab",
        "Toggle Course Navigation from the hamburger and read the course name from the store.",
      ),
    ],
  },
  {
    id: "4.10.4",
    parentLabel: "Modules store",
    section: "4.10.4",
    tasks: [
      lab(
        "4.10.4-lab",
        "Add a module from the dialog, delete with trash, rename with the pencil, and share the list through the modules store.",
      ),
      oyo("4.10.4-oyo", rangeOwn("4.10.4.1", "4.10.4.4")),
      ai("4.10.4-ai", rangeAi("4.10.4.1", "4.10.4.4")),
    ],
  },
  {
    id: "4.10.5",
    parentLabel: "Account and enrollment",
    section: "4.10.5",
    tasks: [
      lab(
        "4.10.5-lab",
        "Sign in, filter Dashboard by enrollment, toggle Account Navigation, and fill Profile from the current user in Context.",
      ),
      oyo("4.10.5-oyo", "Complete the On your own on Profile in §4.10.5.5."),
      ai("4.10.5-ai", "Complete the With AI extra in §4.10.5.5."),
    ],
  },
  {
    id: "4.10.6",
    parentLabel: "Assignment CRUD",
    section: "4.10.6",
    tasks: [
      lab("4.10.6-lab", "Implement assignment CRUD in Zustand (On your own)."),
      oyo(
        "4.10.6-oyo",
        "Implement the assignments store, editor, confirm-delete, and filter by cid.",
      ),
      ai(
        "4.10.6-ai",
        "Ask the assistant for a sample assignmentsStore — you still wire the screens.",
      ),
    ],
  },
  {
    id: "4.10.7",
    parentLabel: "Enroll and unenroll",
    section: "4.10.7",
    tasks: [
      lab("4.10.7-lab", "Implement enroll and unenroll from Dashboard (On your own)."),
      oyo(
        "4.10.7-oyo",
        "Create enrollmentsStore.ts and wire the toggle and People list.",
      ),
      ai(
        "4.10.7-ai",
        "Add a sample enrollments toggle after your own extra control.",
      ),
    ],
  },
];

/** §5.2 Lab 5 recap — topics already walked in the section, now nested a/b/c. */
export const CH5_LAB_EXERCISES: readonly BookExerciseParent[] = [
  {
    id: "5.2.1",
    parentLabel: "Environment variables",
    section: "5.2.1",
    tasks: [
      lab(
        "5.2.1-lab",
        "Declare NEXT_PUBLIC_HTTP_SERVER, wrap it in httpServer(), and use it on the Welcome link.",
      ),
      oyo(
        "5.2.1-oyo",
        "Click Welcome and confirm the Express greeting — not a Next.js page.",
      ),
      ai(
        "5.2.1-ai",
        "Use process.env.NEXT_PUBLIC_HTTP_SERVER (or httpServer()) and keep id wd-welcome-link — do not hard-code localhost:4000.",
      ),
    ],
  },
  {
    id: "5.2.2.1",
    parentLabel: "Path parameters",
    section: "5.2.2.1",
    tasks: [
      lab("5.2.2.1-lab", "Implement add and subtract path routes and matching UI links."),
      oyo(
        "5.2.2.1-oyo",
        "Implement multiply and divide path routes and matching links with ids starting wd-path-parameter-.",
      ),
    ],
  },
  {
    id: "5.2.2.2",
    parentLabel: "Query parameters",
    section: "5.2.2.2",
    tasks: [
      lab(
        "5.2.2.2-lab",
        "Implement a query-string calculator that reads operation, a, and b from req.query.",
      ),
      oyo(
        "5.2.2.2-oyo",
        "Also handle multiply and divide as query operations.",
      ),
    ],
  },
  {
    id: "5.2.2.3",
    parentLabel: "Path and query on your own",
    section: "5.2.2.3",
    tasks: [
      lab(
        "5.2.2.3-lab",
        "Repeat multiply and divide on both path and query so both UIs stay in parity.",
      ),
    ],
  },
  {
    id: "5.2.3",
    parentLabel: "Remote objects",
    section: "5.2.3",
    tasks: [
      lab(
        "5.2.3-lab",
        "Work with a remote assignment object: get, edit title, and related object routes.",
      ),
      oyo(
        "5.2.3-oyo",
        "Add a module object at /lab5/module, Get Module Name, and routes that edit assignment score/completed and the module description.",
      ),
      ai(
        "5.2.3-ai",
        "Ask the assistant for a /lab5/module URL checklist — you still write the routes.",
      ),
    ],
  },
  {
    id: "5.2.4",
    parentLabel: "Remote arrays",
    section: "5.2.4",
    tasks: [
      lab("5.2.4-lab", "Fetch and mutate the remote todos array from the Lab 5 UI."),
      oyo(
        "5.2.4-oyo",
        "Implement /lab5/todos/:id/completed/... and .../description/... routes plus matching UI.",
      ),
    ],
  },
  {
    id: "5.2.5",
    parentLabel: "Asynchronous axios",
    section: "5.2.5",
    tasks: [
      lab(
        "5.2.5-lab",
        "Load data with axios on mount and update an assignment title asynchronously.",
      ),
      oyo(
        "5.2.5-oyo",
        "Change the title, click Update Title, and confirm a refresh persists.",
      ),
    ],
  },
  {
    id: "5.2.6",
    parentLabel: "JSON in the HTTP body",
    section: "5.2.6",
    tasks: [
      lab(
        "5.2.6-lab",
        "Create, delete, and update todos with POST / DELETE / PUT and show errors.",
      ),
      oyo(
        "5.2.6-oyo",
        "Delete a todo with the GET /delete link, then try the X (HTTP DELETE) on the same id and confirm the 404 alert.",
      ),
      ai(
        "5.2.6-ai",
        "Keep the deleteTodo try/catch and errorMessage — do not strip error handling.",
      ),
    ],
  },
];

export const BOOK_EXERCISE_RECAPS = {
  "2.3.7": CH2_LAB_EXERCISES,
  "2.4.10": CH2_KAMBAZ_EXERCISES,
  "3.7.5": CH3_LAB_EXERCISES,
  "3.9.10": CH3_KAMBAZ_EXERCISES,
  "4.8": CH4_LAB_EXERCISES,
  "4.11": CH4_KAMBAZ_EXERCISES,
  "5.2": CH5_LAB_EXERCISES,
} as const;
