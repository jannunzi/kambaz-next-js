import type { LectureSlide } from "../types";

export const ATLAS_NODE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Atlas from Node.js",
      "§6.3.1.2 · Network Access, then Drivers",
    ],
  },
  {
    id: "purpose",
    title: "Render needs a Drivers URI",
    kind: "content",
    bullets: [
      "Compass can see Atlas. Mongoose on Render still cannot",
      "Open Network Access so free Render outbound IPs can reach the cluster",
      "Then copy the **Drivers** string — it includes `/kambaz?`",
    ],
  },
  {
    id: "network",
    title: "Allow access from anywhere",
    kind: "demo",
    bullets: [
      "Atlas → Network Access → + ADD IP ADDRESS",
      "ALLOW ACCESS FROM ANYWHERE adds `0.0.0.0/0`",
      "Free Render outbound IPs change. A laptop-only allow list will fail",
      "Without this entry, Mongoose hangs even if the password is correct",
    ],
    code: `0.0.0.0/0`,
    codeLanguage: "text",
    codeFile: "Atlas Network Access",
  },
  {
    id: "drivers",
    title: "Drivers URI includes /kambaz",
    kind: "demo",
    bullets: [
      "Database → Connect → Drivers → Node.js 5.5 or later",
      "`kambaz` must sit between the last `/` and the `?`",
      "Replace `<password>`. Do not commit the completed URI",
    ],
    code: `mongodb+srv://dbuser:<password>@kambaz.jxui0bc.mongodb.net/kambaz?retryWrites=true&w=majority&appName=Kambaz`,
    codeLanguage: "text",
    codeHighlightLines: [1],
    interactiveHint:
      "Compass can omit the path. Node cannot — omit it and Mongoose writes to `test`.",
  },
  {
    id: "omit",
    title: "Omit the path and you write test",
    kind: "content",
    bullets: [
      "Mongoose connects to the cluster even if the path is missing",
      "Default database is `test` — Compass `kambaz` then looks empty",
      "Dashboard on Vercel shows no courses. Compass on Atlas still has them",
      "Fix: put `/kambaz?` in `DATABASE_CONNECTION_STRING` and redeploy",
    ],
  },
  {
    id: "env",
    title: "Same key, Atlas string",
    kind: "demo",
    bullets: [
      "Local `.env` can stay on `127.0.0.1` while you develop",
      "Render Environment holds the `mongodb+srv` value",
    ],
    code: `const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);`,
    codeLanguage: "js",
    codeFile: "webdev-server/index.js",
    codeHighlightLines: [[1, 3]],
    embed: "lab6-status",
  },
  {
    id: "render",
    title: "New Render service, same key",
    kind: "demo",
    bullets: [
      "Push branch `a6`. Deploy a **new** Render (or Heroku) service",
      "Do not overwrite the Chapter 5 `a5` URL while TAs are grading",
      "Environment: `DATABASE_CONNECTION_STRING` = the Atlas Drivers URI",
    ],
    code: `DATABASE_CONNECTION_STRING=mongodb+srv://USER:PASSWORD@cluster/kambaz?retryWrites=true&w=majority`,
    codeLanguage: "bash",
    codeFile: "Render Environment",
    codeAddedLines: [1],
  },
  {
    id: "vercel",
    title: "Point Vercel at the new origin",
    kind: "demo",
    bullets: [
      "Vercel `a6`: `NEXT_PUBLIC_HTTP_SERVER` = new Render origin",
      "Include `https://`. No trailing slash",
      "Redeploy both so the env vars take effect",
    ],
    code: `NEXT_PUBLIC_HTTP_SERVER=https://your-webdev-server.onrender.com`,
    codeLanguage: "bash",
    codeFile: "Vercel Environment",
    interactiveHint:
      "Local `.env.development` stays `http://localhost:4000`. Same `httpServer()` helper.",
  },
  {
    id: "recap",
    title: "Node.js recap",
    kind: "content",
    bullets: [
      "`0.0.0.0/0`, Drivers URI with `/kambaz?`, same env key",
      "New Render service — do not overwrite `a5`",
      "Vercel `NEXT_PUBLIC_HTTP_SERVER` points at the new origin",
    ],
  },
  {
    id: "next-up",
    title: "Next: remote session env",
    kind: "title",
    bullets: [
      "Sign in still needs a cookie the Vercel app can send back",
      "§6.3.2: five Render keys, then Manual Deploy",
    ],
  },
];
