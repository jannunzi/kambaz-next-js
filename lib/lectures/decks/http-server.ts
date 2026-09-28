import type { LectureSlide } from "../types";

export const HTTP_SERVER_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · HTTP Server",
      "§5.1 · sibling Express on port 4000",
    ],
  },
  {
    id: "purpose",
    title: "The client cannot keep the data",
    kind: "content",
    bullets: [
      "Chapters 1–4 built the Next.js UI. Refresh still resets Kambaz",
      "A browser cannot be the permanent store — it crashes, closes, and is untrusted",
      "This chapter adds the other half: an Express HTTP server in `webdev-server`",
      "MongoDB is Chapter 6. Here the arrays live in process memory",
    ],
  },
  {
    id: "sibling",
    title: "Sibling folders, two ports",
    kind: "content",
    bullets: [
      "`webdev-client` is Next.js on port 3000 — the user interface",
      "`webdev-server` is Express on port 4000 — HTTP and later Mongo",
      "**Do not nest** the server inside the Next.js tree",
      "Same parent folder. Own `package.json`, own GitHub repo later",
    ],
  },
  {
    id: "node-intro",
    title: "Node runs JS outside the browser",
    kind: "content",
    bullets: [
      "Browser JS cannot open files, sockets, or a database driver",
      "Node is a runtime plus `npm` — V8 with filesystem and network APIs",
      "You already installed it for `next dev`. Confirm with `node -v`",
      "LTS 20.9+ is enough. 22.x is what the book shows",
    ],
    code: `node -v
# v22.11.0`,
    codeLanguage: "bash",
  },
  {
    id: "project",
    title: "Create the sibling server project",
    kind: "demo",
    bullets: [
      "Lowercase, dashes, no spaces. Accept `npm init` defaults",
      "That writes `package.json` — Node’s project manifest",
    ],
    code: `mkdir webdev-server
cd webdev-server
npm init`,
    codeLanguage: "bash",
    interactiveHint:
      "This repo already includes `webdev-server/` so the demos can run. You still create that sibling folder yourself.",
  },
  {
    id: "hello-js",
    title: "Hello World from Node",
    kind: "demo",
    bullets: [
      "A Node program is a `.js` file the `node` command runs",
      "Later we export a function from this same `Hello.js`",
    ],
    code: `console.log("Hello World!");`,
    codeLanguage: "js",
    codeFile: "webdev-server/Hello.js",
    codeBlocks: [{ code: "node Hello.js\n# Hello World!", language: "bash" }],
  },
  {
    id: "express",
    title: "Express GET /hello on 4000",
    kind: "demo",
    bullets: [
      "Install Express so colleagues and Render can `npm install`",
      "`app.get` maps a URL pattern to a `(req, res)` handler",
      "`res.send` writes the HTTP body. Port 4000 leaves 3000 for Next.js",
    ],
    codeBlocks: [
      { code: "npm install express", language: "bash" },
      {
        file: "webdev-server/index.js",
        language: "js",
        code: `import express from "express";
const app = express();
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});
app.listen(4000);`,
        addedLines: [[3, 6]],
      },
    ],
  },
  {
    id: "visit",
    title: "Visit localhost:4000/hello",
    kind: "demo",
    bullets: [
      "The browser is the client. Your Node process is the server",
      "Stop with Ctrl+C. A later host can set `PORT`",
    ],
    codeBlocks: [
      { code: "node index.js", language: "bash" },
      { code: "http://localhost:4000/hello", language: "text" },
    ],
    interactiveHint:
      "404? Path must be /hello. Connection refused? The process is not listening.",
  },
  {
    id: "recap",
    title: "HTTP server recap",
    kind: "content",
    bullets: [
      "Sibling `webdev-server` — never inside the Next.js app",
      "`Hello.js` prints. `index.js` listens on 4000",
      "Express `app.get(\"/hello\", …)` plus `res.send`",
    ],
  },
  {
    id: "next-up",
    title: "Next: nodemon and ES modules",
    kind: "title",
    bullets: [
      "Restart on save, `\"type\": \"module\"`, then extract routes",
      "§5.1.6–5.1.8: Nodemon, ES6, and `Hello(app)`",
    ],
  },
];
