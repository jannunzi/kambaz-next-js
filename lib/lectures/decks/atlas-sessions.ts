import type { LectureSlide } from "../types";

export const ATLAS_SESSIONS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Atlas remote sessions",
      "§6.3.2 · five keys, then sign in",
    ],
  },
  {
    id: "purpose",
    title: "Remote sessions need five keys",
    kind: "content",
    bullets: [
      "Local Node already stores `currentUser` in a cookie",
      "Render must do the same so Vercel can send that cookie back",
      "CORS and `sameSite` read `CLIENT_URL` and `SERVER_ENV`",
      "The Atlas URI is one of the five keys — not the only one",
    ],
  },
  {
    id: "keys",
    title: "Five Render environment keys",
    kind: "demo",
    bullets: [
      "Use these **keys**. Do not copy the sample values",
      "`SERVER_URL` must **not** start with `https://`",
      "`SESSION_SECRET` is a long random phrase you choose",
    ],
    code: `DATABASE_CONNECTION_STRING=mongodb+srv://USER:PASSWORD@cluster/kambaz?retryWrites=true&w=majority
CLIENT_URL=https://your-a6-preview.vercel.app
SERVER_URL=your-webdev-server.onrender.com
SERVER_ENV=production
SESSION_SECRET=a long random phrase`,
    codeLanguage: "bash",
    codeFile: "Render Environment",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "client",
    title: "CLIENT_URL is the Vercel origin",
    kind: "demo",
    bullets: [
      "Must be the Vercel `a6` origin — CORS and cookie `sameSite`",
      "No trailing slash. Must match the browser address bar",
      "Wrong origin → Sign in fails even when Atlas is reachable",
    ],
    code: `app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL || "http://localhost:3000",
}));`,
    codeLanguage: "js",
    codeFile: "webdev-server/index.js",
    codeHighlightLines: [3],
    embed: "kambaz-styled-signin",
  },
  {
    id: "secure",
    title: "SERVER_ENV turns on cookies",
    kind: "demo",
    bullets: [
      "`SERVER_ENV=production` is what turns on secure cookies",
      "`sameSite: \"none\"` plus `secure: true` so Vercel can send them",
      "Leave this as `development` on your laptop",
    ],
    code: `if (process.env.SERVER_ENV === "production") {
  app.set("trust proxy", 1);
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/index.js",
    codeHighlightLines: [1, [4, 7]],
  },
  {
    id: "host",
    title: "SERVER_URL has no https://",
    kind: "content",
    bullets: [
      "Render hostname only — `your-webdev-server.onrender.com`",
      "Strip `https://` if the dashboard prefilled it",
      "Vercel `NEXT_PUBLIC_HTTP_SERVER` **does** include `https://`",
    ],
  },
  {
    id: "redeploy",
    title: "Redeploy after every env change",
    kind: "content",
    bullets: [
      "Render: Manual Deploy → Deploy latest commit",
      "Vercel: Redeploy after changing `NEXT_PUBLIC_HTTP_SERVER`",
      "Env edits do nothing until both processes restart",
    ],
  },
  {
    id: "verify",
    title: "Sign in against Atlas",
    kind: "content",
    bullets: [
      "Open the Vercel `a6` URL, sign in, confirm Dashboard lists courses",
      "Network error? Check `NEXT_PUBLIC_HTTP_SERVER` matches Render",
      "Empty Dashboard? Drivers URI is missing `/kambaz?` or Network Access",
      "Compass on the Atlas connection should show the same documents",
    ],
  },
  {
    id: "secrets",
    title: "Keep the URI off the client",
    kind: "content",
    bullets: [
      "Atlas credentials live on Render — never in `NEXT_PUBLIC_*`",
      "The browser talks to Express. Express talks to Atlas",
      "Do not commit `.env`, and never paste the password into code or a commit",
    ],
  },
  {
    id: "project",
    title: "Project week uses this cluster",
    kind: "content",
    bullets: [
      "Quizzes, Pazza, and open-ended all persist through Atlas",
      "Graders on 12/7 open Vercel, sign in, and read hosted documents",
      "Same five keys. Same `/dbname?` rule. Same `0.0.0.0/0` allow list",
      "Zustand still talks to Express — Mongoose is what reaches Atlas",
    ],
  },
  {
    id: "recap",
    title: "Remote sessions recap",
    kind: "content",
    bullets: [
      "Five keys: Atlas URI, `CLIENT_URL`, `SERVER_URL`, `SERVER_ENV`, secret",
      "`SERVER_ENV=production` plus a Vercel origin with no trailing slash",
      "Manual Deploy, then sign in. Secrets stay on Render",
    ],
  },
  {
    id: "next-up",
    title: "Next: check your understanding",
    kind: "title",
    bullets: [
      "A 10-item self-check on schemas, DAOs, and Atlas",
      "§6-check, then migrate Kambaz collections in §6.4",
    ],
  },
];
