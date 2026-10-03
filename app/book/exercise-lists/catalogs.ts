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

/** §3.7.5 Lab 3 recap. */
export const CH3_LAB_EXERCISES: readonly BookExerciseParent[] = [
  {
    id: "3.2",
    parentLabel: "Variables and conditionals",
    section: "3.2",
    tasks: [
      lab(
        "3.2-lab",
        "Create VariablesAndConstants, VariableTypes, BooleanVariables, IfElse, TernaryOperator, ConditionalOutputIfElse, ConditionalOutputInline, and NullUndefined.",
      ),
      oyo("3.2-oyo", rangeOwn("3.2.1", "3.2.7")),
      ai("3.2-ai", rangeAi("3.2.1", "3.2.7")),
    ],
  },
  {
    id: "3.3",
    parentLabel: "Functions",
    section: "3.3",
    tasks: [
      lab(
        "3.3-lab",
        "Create LegacyFunctions, ArrowFunctions, ImpliedReturn, and TemplateLiterals.",
      ),
      oyo("3.3-oyo", rangeOwn("3.3", "3.3.3")),
      ai("3.3-ai", rangeAi("3.3", "3.3.3")),
    ],
  },
  {
    id: "3.4.1",
    parentLabel: "Arrays",
    section: "3.4.1",
    sectionEnd: "3.4.9",
    tasks: [
      lab("3.4.1-lab", "Create the array samples through ReduceFunction."),
      oyo("3.4.1-oyo", rangeOwn("3.4.1", "3.4.9")),
      ai("3.4.1-ai", rangeAi("3.4.1", "3.4.9")),
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
        "Create JsonStringify, House, Spreader, Destructing, FunctionDestructing, Math.ts, DestructingImports, and OptionalChaining.",
      ),
      oyo("3.4.10-oyo", rangeOwn("3.4.10", "3.4.17")),
      ai("3.4.10-ai", rangeAi("3.4.10", "3.4.17")),
    ],
  },
  {
    id: "3.5",
    parentLabel: "Classes and styles",
    section: "3.5",
    tasks: [
      lab("3.5-lab", "Create Classes.css, Classes.tsx, and Styles.tsx."),
      oyo("3.5-oyo", rangeOwn("3.5.1", "3.5.2")),
      ai("3.5-ai", rangeAi("3.5.1", "3.5.2")),
    ],
  },
  {
    id: "3.6",
    parentLabel: "Client and server components",
    section: "3.6",
    tasks: [
      lab(
        "3.6-lab",
        'Create ClientComponentDemo with "use client" and ServerComponentDemo without it.',
      ),
      oyo("3.6-oyo", rangeOwn("3.6.1", "3.6.2")),
      ai("3.6-ai", rangeAi("3.6.1", "3.6.2")),
    ],
  },
  {
    id: "3.7",
    parentLabel: "Add, Square, and Highlight",
    section: "3.7",
    sectionEnd: "3.7.1",
    tasks: [
      lab("3.7-lab", "Create Add.tsx, Square.tsx, and Highlight.tsx."),
      oyo("3.7-oyo", rangeOwn("3.7", "3.7.1")),
      ai("3.7-ai", rangeAi("3.7", "3.7.1")),
    ],
  },
  {
    id: "3.7.2",
    parentLabel: "Labs TOC highlight",
    section: "3.7.2",
    tasks: [
      lab("3.7.2-lab", "Highlight the active lab in app/labs/TOC.tsx with usePathname."),
      oyo(
        "3.7.2-oyo",
        "Complete the On your own in §3.7.2.",
      ),
      ai("3.7.2-ai", "Complete the With AI extra in §3.7.2."),
    ],
  },
  {
    id: "3.7.3",
    parentLabel: "Path parameters",
    section: "3.7.3",
    tasks: [
      lab("3.7.3-lab", "Create the add/[a]/[b] page and PathParameters.tsx."),
      oyo("3.7.3-oyo", "Complete the On your own in §3.7.3."),
      ai("3.7.3-ai", "Complete the With AI extra in §3.7.3."),
    ],
  },
  {
    id: "3.7.4",
    parentLabel: "Todo list",
    section: "3.7.4",
    tasks: [
      lab(
        "3.7.4-lab",
        "Create todos/TodoItem.tsx, todos/todos.json, and todos/TodoList.tsx that maps with key={todo.title}.",
      ),
      oyo("3.7.4-oyo", "Complete the On your own in §3.7.4."),
      ai("3.7.4-ai", "Complete the With AI extra in §3.7.4."),
    ],
  },
];

/** §3.9.10 Kambaz data recap. */
export const CH3_KAMBAZ_EXERCISES: readonly BookExerciseParent[] = [
  {
    id: "3.9.1",
    parentLabel: "Kambaz Navigation from data",
    section: "3.9.1",
    tasks: [
      lab("3.9.1-lab", "Drive Kambaz Navigation from data."),
      oyo("3.9.1-oyo", "Complete the On your own in §3.9.1."),
      ai("3.9.1-ai", "Complete the With AI extra in §3.9.1."),
    ],
  },
  {
    id: "3.9.2",
    parentLabel: "JSON database",
    section: "3.9.2",
    tasks: [
      lab("3.9.2-lab", "Add the JSON database under app/(kambaz)/database/."),
      oyo("3.9.2-oyo", "Complete the On your own in §3.9.2."),
      ai("3.9.2-ai", "Complete the With AI extra in §3.9.2."),
    ],
  },
  {
    id: "3.9.3",
    parentLabel: "Dashboard from JSON",
    section: "3.9.3",
    tasks: [
      lab("3.9.3-lab", "Render the Dashboard from courses JSON."),
      oyo("3.9.3-oyo", "Complete the On your own in §3.9.3."),
      ai("3.9.3-ai", "Complete the With AI extra in §3.9.3."),
    ],
  },
  {
    id: "3.9.4",
    parentLabel: "Courses from the URL",
    section: "3.9.4",
    tasks: [
      lab("3.9.4-lab", "Drive the Courses screen from the URL course id."),
      oyo("3.9.4-oyo", "Complete the On your own in §3.9.4."),
      ai("3.9.4-ai", "Complete the With AI extra in §3.9.4."),
    ],
  },
  {
    id: "3.9.5",
    parentLabel: "Course Navigation from data",
    section: "3.9.5",
    tasks: [
      lab("3.9.5-lab", "Drive Course Navigation from data."),
      oyo("3.9.5-oyo", "Complete the On your own in §3.9.5."),
      ai("3.9.5-ai", "Complete the With AI extra in §3.9.5."),
    ],
  },
  {
    id: "3.9.6",
    parentLabel: "Breadcrumb",
    section: "3.9.6",
    tasks: [
      lab("3.9.6-lab", "Implement the breadcrumb."),
      oyo("3.9.6-oyo", "Complete the On your own in §3.9.6."),
      ai("3.9.6-ai", "Complete the With AI extra in §3.9.6."),
    ],
  },
  {
    id: "3.9.7",
    parentLabel: "Modules from JSON",
    section: "3.9.7",
    tasks: [
      lab("3.9.7-lab", "Drive Modules from JSON."),
      oyo("3.9.7-oyo", "Complete the On your own in §3.9.7."),
      ai("3.9.7-ai", "Complete the With AI extra in §3.9.7."),
    ],
  },
  {
    id: "3.9.8",
    parentLabel: "Assignments from JSON",
    section: "3.9.8",
    tasks: [
      lab("3.9.8-lab", "Drive Assignments from JSON (On your own)."),
      oyo("3.9.8-oyo", "Complete the On your own in §3.9.8."),
      ai("3.9.8-ai", "Complete the With AI extra in §3.9.8."),
    ],
  },
  {
    id: "3.9.8.1",
    parentLabel: "Assignment Editor from JSON",
    section: "3.9.8.1",
    tasks: [
      lab(
        "3.9.8.1-lab",
        "Drive the Assignment Editor from JSON (On your own).",
      ),
      oyo("3.9.8.1-oyo", "Complete the On your own in §3.9.8.1."),
      ai("3.9.8.1-ai", "Complete the With AI extra in §3.9.8.1."),
    ],
  },
  {
    id: "3.9.9",
    parentLabel: "People from enrollments",
    section: "3.9.9",
    tasks: [
      lab("3.9.9-lab", "Drive the People table from users and enrollments."),
      oyo("3.9.9-oyo", "Complete the On your own in §3.9.9."),
      ai("3.9.9-ai", "Complete the With AI extra in §3.9.9."),
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
