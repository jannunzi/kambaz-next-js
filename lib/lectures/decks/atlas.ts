import type { LectureSlide } from "../types";

export const ATLAS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Integrating with Atlas",
      "§6.3 · hosted Mongo, then remote sessions",
    ],
  },
  {
    id: "purpose",
    title: "127.0.0.1 is empty on Render",
    kind: "content",
    bullets: [
      "Local `mongod` lives on your laptop — Compass at `27017`",
      "The remote Express VM has no `kambaz` and no Compass documents",
      "A public Node process needs a database that is also public",
      "Atlas hosts MongoDB and gives you a connection string",
    ],
  },
  {
    id: "why",
    title: "Atlas is the public MongoDB",
    kind: "content",
    bullets: [
      "Free cluster, Compass import, Network Access, then a **new** Render service",
      "Same `DATABASE_CONNECTION_STRING` key you already used on localhost",
      "Do not overwrite the Chapter 5 `a5` URL while TAs are grading",
      "A6 and the 12/7 project both grade against this hosted cluster",
    ],
  },
  {
    id: "signup",
    title: "Sign in at mongodb.com",
    kind: "content",
    bullets: [
      "Google account or email — confirm the validation message if asked",
      "Answer the signup questions, then **Deploy your cluster**",
      "Choose the **Free** plan — enough for the course and the project",
    ],
  },
  {
    id: "cluster",
    title: "Free cluster named Kambaz",
    kind: "content",
    bullets: [
      "Name the cluster `Kambaz` so the hostname is easy to recognize",
      "Pick a nearby region — AWS North Virginia is fine",
      "Click Create Deployment and wait for the cluster to provision",
    ],
  },
  {
    id: "user",
    title: "A user Mongoose will remember",
    kind: "content",
    bullets: [
      "Create a database user on the Connect screen — for example `dbuser`",
      "These credentials are how Mongoose logs in from Render",
      "Store them in a password manager. Do **not** commit the password",
      "Forget them and you must create a new user later",
    ],
  },
  {
    id: "scheme",
    title: "The URI is mongodb+srv",
    kind: "demo",
    bullets: [
      "Atlas URIs use `mongodb+srv://`, not `mongodb://127.0.0.1`",
      "The host will differ. Scheme, username, password, and cluster matter",
      "Next lecture pastes this into Compass. Later, Drivers add `/kambaz?`",
    ],
    code: `mongodb+srv://dbuser:<password>@kambaz.jxui0bc.mongodb.net/`,
    codeLanguage: "text",
    interactiveHint:
      "This sample password is fake. Never paste a real Atlas password into a commit.",
  },
  {
    id: "recap",
    title: "Atlas recap",
    kind: "content",
    bullets: [
      "Render cannot see localhost Mongo — Atlas is the public cluster",
      "Free `Kambaz` cluster plus a database user you will remember",
      "Same pattern for A6 and the project graders open the week of 12/7",
    ],
  },
  {
    id: "next-up",
    title: "Next: connect Compass",
    kind: "title",
    bullets: [
      "Paste the Compass `mongodb+srv` string and import the JSON",
      "§6.3.1.1: a second Compass window, not `127.0.0.1`",
    ],
  },
];
