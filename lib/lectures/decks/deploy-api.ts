import type { LectureSlide } from "../types";

export const DEPLOY_API_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Deploy the API",
      "§5.5 · GitHub, Render, Vercel env",
    ],
  },
  {
    id: "purpose",
    title: "Two remotes, one pair",
    kind: "content",
    bullets: [
      "Finish locally first. Then replicate the two-process setup",
      "Next.js already deploys to Vercel on `git push`",
      "Express needs its own host — Render (or Heroku)",
    ],
  },
  {
    id: "github",
    title: "Push webdev-server to GitHub",
    kind: "demo",
    bullets: [
      "A **separate** public repo so graders see server history alone",
      "`node_modules` and `.env*` stay out of git",
      "Work on branch `a5` in both repositories",
    ],
    codeBlocks: [
      {
        file: "webdev-server/.gitignore",
        language: "bash",
        code: `node_modules
.env
.env.development
.idea`,
      },
      {
        language: "bash",
        code: `git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/<you>/webdev-server.git
git push -u origin main`,
      },
    ],
  },
  {
    id: "render",
    title: "Render Web Service + env",
    kind: "content",
    bullets: [
      "Add New → Web Service → the `webdev-server` repo",
      "Build `npm install`. Start `npm start`. Instance **Free**",
      "`SERVER_URL` is the hostname **without** `https://`",
      "Confirm `/` and `/api/courses` on the Render URL",
    ],
  },
  {
    id: "render-env",
    title: "Render environment values",
    kind: "demo",
    bullets: [
      "`CLIENT_URL` is your Vercel origin — no trailing slash",
      "`SESSION_SECRET` is not the sample phrase from the notes",
    ],
    code: `SERVER_ENV=production
CLIENT_URL=https://your-app.vercel.app
SERVER_URL=webdev-server.onrender.com
SESSION_SECRET=a phrase that is not committed`,
    codeLanguage: "bash",
  },
  {
    id: "vercel",
    title: "Vercel points at Render",
    kind: "demo",
    bullets: [
      "Project Settings → Environment Variables → Production",
      "`NEXT_PUBLIC_HTTP_SERVER` **includes** `https://`, no trailing slash",
      "Save and Redeploy. Network tab must not show `localhost:4000`",
    ],
    code: `NEXT_PUBLIC_HTTP_SERVER=https://webdev-server.onrender.com`,
    codeLanguage: "bash",
    interactiveHint:
      "Local .env.development stays http://localhost:4000. Same httpServer() helper — only the value changes.",
  },
  {
    id: "recap",
    title: "Deploy recap",
    kind: "content",
    bullets: [
      "Second GitHub repo. Render runs `npm start`",
      "Render `SERVER_URL` has no protocol. Vercel env has `https://`",
      "You can finish Lab 5 on your machine without this Vercel step",
    ],
  },
  {
    id: "next-up",
    title: "Next: conclusion and a5",
    kind: "title",
    bullets: [
      "Push `a5` on both repos and submit the Vercel URL",
      "§5.6–5.7: what shipped, then the deliverable list",
    ],
  },
];
