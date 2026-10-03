import type { LectureSlide } from "../types";

export const ATLAS_COMPASS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Atlas Compass",
      "§6.3.1.1 · connect, then import JSON",
    ],
  },
  {
    id: "purpose",
    title: "Compass talks to the cloud",
    kind: "content",
    bullets: [
      "Local Compass is still on `mongodb://127.0.0.1:27017`",
      "The cluster you just created needs its own Compass window",
      "Import the same five JSON files so counts match localhost",
    ],
  },
  {
    id: "copy",
    title: "Copy the Compass +srv string",
    kind: "demo",
    bullets: [
      "Choose a connection method → Compass",
      "Copy the string from **Access your data through tools**",
      "The host will differ. Scheme, username, password, and hostname matter",
    ],
    code: `mongodb+srv://giuseppi:supersecretpassword@kambaz.jxui0bc.mongodb.net/`,
    codeLanguage: "text",
    interactiveHint:
      "This is the Compass string. The Drivers string later adds `/kambaz?`.",
  },
  {
    id: "paste",
    title: "Connect Compass in a new window",
    kind: "content",
    bullets: [
      "Click Done in Atlas, then Compass → Connect → New Window",
      "Paste the URI and click Connect",
      "Compass is now talking to the cloud — not `127.0.0.1`",
      "Leave the localhost connection open for daily development",
    ],
  },
  {
    id: "create",
    title: "Create kambaz if Atlas did not",
    kind: "content",
    bullets: [
      "Same steps as §6.1.4: Create database, name `kambaz`",
      "First collection can be `users` — Mongo creates the database with it",
      "Keep the name **kambaz** — the Drivers URI later ends with `/kambaz?`",
    ],
  },
  {
    id: "import",
    title: "Import JSON on the remote DB",
    kind: "content",
    bullets: [
      "ADD DATA → Import JSON for `courses`, `modules`, `users`, `assignments`, `enrollments`",
      "Confirm document counts match the localhost Compass window",
      "Edits on localhost do not appear on Atlas until you import or the app writes",
    ],
    embed: "kambaz-styled-dashboard",
  },
  {
    id: "two",
    title: "Two Compass connections",
    kind: "demo",
    bullets: [
      "Local URI stays `mongodb://127.0.0.1:27017` for `nodemon`",
      "Remote URI is `mongodb+srv://…` for Render and the project",
      "Dashboard on Vercel reads Atlas. Dashboard on localhost reads `mongod`",
    ],
    codeBlocks: [
      {
        file: "localhost",
        language: "text",
        code: `mongodb://127.0.0.1:27017`,
      },
      {
        file: "Atlas / Compass",
        language: "text",
        code: `mongodb+srv://giuseppi:supersecretpassword@kambaz.jxui0bc.mongodb.net/`,
        addedLines: [1],
      },
    ],
  },
  {
    id: "recap",
    title: "Compass recap",
    kind: "content",
    bullets: [
      "New Compass window, `mongodb+srv` string, Connect",
      "Create `kambaz` if needed, then import all five JSON files",
      "Two connections: laptop for labs, Atlas for Render and 12/7",
    ],
  },
  {
    id: "next-up",
    title: "Next: connect from Node.js",
    kind: "title",
    bullets: [
      "Network Access, then the Drivers URI with `/kambaz?`",
      "§6.3.1.2: same env key, new Render service",
    ],
  },
];
