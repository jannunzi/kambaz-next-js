import type { LectureSlide } from "../types";

export const CREATING_A_NEXTJS_REACT_APPLICATION_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "NEXT.JS REACT APPLICATIONS",
    kind: "title",
    bullets: ["Jose Annunziato"],
  },
  {
    id: "react-is",
    title: "React",
    kind: "content",
    bullets: [
      "JavaScript library for creating Web **user interface**",
      "Applications consist of JavaScript functions, AKA **components**",
      "Implement an algorithm to calculate user interfaces in the browser",
      "Functions transform **user inputs**, **data structures**, and **server resources** into a UI",
      "**Web applications** — HTML, CSS, JavaScript, interacting with HTTP servers",
    ],
  },
  {
    id: "react-transform",
    title: "React Transforms Data into UI",
    kind: "content",
    bullets: [
      "React programs are functions that transform **data** into a visual representation in a **browser**",
    ],
    diagram: "react-data-ui",
  },
  {
    id: "user-component",
    title: "A User component",
    kind: "demo",
    bullets: [
      "**JSX**: HTML-like markup written right inside a JavaScript function",
      "Same function, different data → different UI",
    ],
    code: `import user from "./user.json";

export default function User() {
  return (
    <div>
      Username: {user.username}<br/>
      First: {user.first}<br/>
      Last: {user.last}<br/>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/components/User.tsx",
    embed: "user-card",
  },
  {
    id: "create-next-app",
    title: "Create a Next.js Application",
    kind: "demo",
    bullets: [
      "Creating a React application requires **Node.js**",
      "Run it at the command line, from your course folder. It names the project **webdev-client**",
      "Pin **@16.3**, not `@latest`. Next.js 16.4 turns on **Cache Components** (a setting that prerenders and caches parts of each page), and Kambaz then fails `npm run build`",
    ],
    code: "npx create-next-app@16.3 webdev-client",
    codeLanguage: "bash",
  },
  {
    id: "defaults-explained",
    title: "What the Defaults Set Up",
    kind: "content",
    bullets: [
      "**TypeScript**: a superset of JavaScript that adds static typing",
      "**ESLint**: a code checker. **React Compiler**: an optional optimizer, left off",
      "**Tailwind CSS**: a utility-first framework. You style with small classes such as `p-4` (padding)",
      "**App Router**: Next.js’s current routing model. Folders under `app/` become URLs",
      "No `src/` folder. **AGENTS.md**: Next.js notes for AI coding assistants",
    ],
  },
  {
    id: "defaults",
    title: "Accept the Recommended Defaults",
    kind: "content",
    bullets: [
      "At **Ok to proceed? (y)**, press Enter",
      "Keep **Yes, use recommended defaults** and press **Enter**",
      "Ran it before? Skip the middle choice, **No, reuse previous settings**",
    ],
    code: `? Would you like to use the recommended Next.js defaults? › - Use arrow-keys. Return to submit.
❯   Yes, use recommended defaults
    TypeScript, ESLint, No React Compiler, Tailwind CSS, No src/ directory, App Router, AGENTS.md
    No, customize settings`,
    codeLanguage: "text",
  },
  {
    id: "customize-settings",
    title: "Or Customize: Give These Answers",
    kind: "content",
    bullets: [
      "**No, customize settings** asks each question. Pressing **Enter** on every one keeps the defaults’ answers",
    ],
    code: `✔ Would you like to use the recommended Next.js defaults? › No, customize settings
✔ Would you like to use TypeScript? … Yes
✔ Which linter would you like to use? › ESLint
✔ Would you like to use React Compiler? … No
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a \`src/\` directory? … No
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the import alias (\`@/*\` by default)? … No
✔ Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? … Yes`,
    codeLanguage: "text",
  },
  {
    id: "npm-run-dev",
    title: "Running a React Application",
    kind: "demo",
    bullets: [
      "Once created, navigate to the folder and run",
      "The default Next.js app appears in a browser window — usually `http://localhost:3000`",
    ],
    code: `cd webdev-client
npm run dev`,
    codeLanguage: "bash",
    diagram: "npm-run-dev-mock",
  },
  {
    id: "ide",
    title: "Editing React.js with an IDE",
    kind: "content",
    bullets: [
      "Open the new project with an IDE such as **VS Code** or **Cursor**",
      "**File → Open** · navigate to the folder · select **webdev-client**",
      "Use **Terminal → New Terminal** so commands run in the project root",
    ],
  },
  {
    id: "structure",
    title: "Project File Structure",
    kind: "content",
    bullets: [
      "A Next.js project content",
      "`node_modules` — libraries. Never commit this",
      "`public` — static files served as `/filename`",
      "`app` — **App Router** root. A folder + `page.tsx` becomes a URL",
      "`.gitignore` — files to ignore",
      "`package.json` — project description",
    ],
  },
  {
    id: "comment-globals",
    title: "Remove Default Styling",
    kind: "demo",
    bullets: [
      "For Chapter 1 HTML we want the browser’s default look",
      "In `app/layout.tsx`, comment out the CSS import. Leave the rest alone",
    ],
    code: `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// ... leave the rest of this file alone`,
    codeLanguage: "tsx",
    codeFile: "app/layout.tsx",
    codeAddedLines: [3],
    interactiveHint:
      "Do not delete `globals.css`. You will turn Tailwind back on in Chapter 2.",
  },
  {
    id: "welcome-page",
    title: "Pages are Just Functions",
    kind: "demo",
    bullets: [
      "`app/page.tsx` — React pages **compute** the user interface",
      "Replace the starter markup. Save. `/` shows the heading",
    ],
    code: `export default function Home() {
  return (
    <div>
      <h1>Welcome to Web Dev</h1>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/page.tsx",
    embed: "welcome-home",
  },
  {
    id: "lab1-route",
    title: "Create Pages to Practice",
    kind: "demo",
    bullets: [
      "Create pages to practice Web skills",
      "File path **is** the URL: `app/labs/lab1/page.tsx` → `/labs/lab1`",
      "`id=\"wd-lab1\"` is an **attribute**: a `name=\"value\"` pair on the opening tag",
    ],
    code: `export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/page.tsx",
    embed: "lab1-stub",
  },
  {
    id: "link-to-lab1",
    title: "Use Links to Navigate",
    kind: "demo",
    bullets: [
      "Use **Links** to navigate between pages",
      "`Link` from `next/link` — not a raw `<a>` for in-app routes",
    ],
    code: `import Link from "next/link";
export default function Home() {
  return (
    <div>
      <h1>Welcome to Web Dev</h1>
      <Link href="./labs/lab1">
            Lab 1 - HTML</Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/page.tsx",
    codeAddedLines: [1, [6, 7]],
    embed: "link-nav",
  },
  {
    id: "compose",
    title: "Components Import Components",
    kind: "content",
    bullets: [
      "Components can **aggregate** other components for more complex UIs",
      "Keep `page.tsx` thin. Import `HeadingTags.tsx` — a component, not a route",
      "Only `page.tsx` creates a URL. Other `.tsx` files are imported",
    ],
  },
  {
    id: "user-on-page",
    title: "Drop User onto a page",
    kind: "demo",
    bullets: [
      "Create `app/components/User.tsx` and its data, `app/components/user.json`",
      "Import `User` into the page. You did not register a route",
    ],
    code: `import Link from "next/link";
import User from "./components/User";
export default function Home() {
  return (
    <div>
      <h1>Welcome to Web Dev</h1>
      <Link href="./labs/lab1">
            Lab 1 - HTML</Link>
      <User />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/page.tsx",
    codeAddedLines: [2, 9],
    codeBlocks: [
      {
        file: "app/components/user.json",
        language: "json",
        code: `{
  "username": "alice",
  "first": "Alice",
  "last": "Wonderland"
}`,
      },
    ],
    embed: "user-card",
  },
  {
    id: "developer-tools",
    title: "DEVELOPER TOOLS",
    kind: "title",
    bullets: [
      "Chrome DevTools — inspect what the browser actually rendered",
    ],
  },
  {
    id: "browser-parses-dom",
    title: "Browser Parses HTML Into DOM",
    kind: "demo",
    bullets: [
      "The browser **parses** HTML into the **DOM**",
      "Open `/labs/lab1`, then **Elements**. The `h2` is what `page.tsx` rendered",
    ],
    diagram: "dom-tree",
    interactiveHint:
      "Right-click the heading → Inspect. Confirm the node matches the JSX.",
  },
];
