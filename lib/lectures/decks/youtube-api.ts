import type { LectureSlide } from "../types";

export const YOUTUBE_API_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Integrating with the YouTube Video API",
      "Data API v3 · key, then search",
    ],
  },
  {
    id: "api",
    title: "API",
    kind: "title",
    bullets: [
      "Google Cloud project, then an **API key**",
      "Enable **YouTube Data API v3**",
    ],
  },
  {
    id: "docs",
    title: "YouTube Data API v3",
    kind: "content",
    bullets: [
      "[developers.google.com/youtube/v3](https://developers.google.com/youtube/v3)",
      "Optional walkthrough: [youtu.be/KSfs9fJW1rY](https://youtu.be/KSfs9fJW1rY)",
    ],
  },
  {
    id: "overview",
    title: "Overview",
    kind: "content",
    bullets: [
      "Need a **Google Account**, Google API Console, **API key**",
      "Create a project in Developers Console, obtain credentials",
      "Register the app for **YouTube Data API v3** — Enabled APIs status is **ON**",
      "OAuth 2.0 only if a method needs the signed-in Google user",
      "A client library can simplify calls — this course uses **axios**",
    ],
  },
  {
    id: "api-key",
    title: "API Key",
    kind: "title",
    bullets: [
      "Console → Credentials → **Create API key**",
      "Copy once. Do **not** commit it",
    ],
  },
  {
    id: "console",
    title: "Google Cloud dashboard",
    kind: "content",
    bullets: [
      "[console.cloud.google.com/apis/dashboard](https://console.cloud.google.com/apis/dashboard)",
      "**Create New Project** — a single class project is enough",
    ],
  },
  {
    id: "credentials",
    title: "Create Credentials",
    kind: "demo",
    bullets: [
      "APIs & Services → **Credentials** → Create credentials",
      "Choose **API key**. Copy it",
    ],
    diagram: "google-cloud-key-mock",
  },
  {
    id: "env",
    title: "Store Key as Environment Variable",
    kind: "demo",
    bullets: [
      "Same Next.js pattern as `NEXT_PUBLIC_HTTP_SERVER`",
      "Replace the sample. **Never paste a live key** into a commit",
    ],
    code: `NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000
NEXT_PUBLIC_YOUTUBE_API=https://www.googleapis.com/youtube/v3
NEXT_PUBLIC_YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY`,
    codeLanguage: "bash",
    codeFile: ".env.development",
    codeAddedLines: [[2, 3]],
  },
  {
    id: "safe",
    title: "Keep API Key Safe",
    kind: "content",
    bullets: [
      "Restrict the key in Cloud Console to **YouTube Data API v3**",
      "Classroom demos use `NEXT_PUBLIC_*` because the **browser** calls Google",
      "A production project can proxy search through Express instead",
    ],
  },
  {
    id: "enable",
    title: "Enable APIs and Services",
    kind: "demo",
    bullets: [
      "Enabled APIs → **Enable APIs and Services** → search YouTube",
      "Open **YouTube Data API v3** and click **Enable**",
    ],
    diagram: "youtube-enable-api-mock",
  },
  {
    id: "libraries",
    title: "Configure Version",
    kind: "content",
    bullets: [
      "Libraries: [developers.google.com/youtube/v3/libraries](https://developers.google.com/youtube/v3/libraries)",
      "Google JS client: [github.com/google/google-api-javascript-client](https://github.com/google/google-api-javascript-client)",
      "This course client uses **axios**, not the Google JS client",
    ],
  },
];
