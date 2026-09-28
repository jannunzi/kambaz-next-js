import type { LectureSlide } from "../types";

export const DEPLOYING_TO_VERCEL_SLIDES: LectureSlide[] = [
  {
    id: "chapter",
    title: "WEB DEV",
    kind: "title",
  },
  {
    id: "title",
    title: "VERCEL",
    kind: "title",
    bullets: ["Jose Annunziato"],
  },
  {
    id: "account",
    title: "Create an account at Vercel",
    kind: "demo",
    bullets: [
      "We're going to use **Vercel.com** to host our application",
      "Create an account at [Vercel.com](https://vercel.com)",
      "You can use your **GitHub** account",
      "OR you can use an email",
    ],
    diagram: "vercel-login-mock",
  },
  {
    id: "new-project",
    title: "Create a New Site from Git",
    kind: "demo",
    bullets: ["**Add New…** → **Project**"],
    diagram: "vercel-add-project-mock",
  },
  {
    id: "permissions",
    title: "Create Site from GitHub",
    kind: "demo",
    bullets: [
      "Create a website from several different source control",
      "We're using **GitHub** to store our source code",
      "Select **GitHub** for this course",
      "Give **Vercel** permissions to interact with GitHub on your behalf",
    ],
    diagram: "vercel-git-provider-mock",
  },
  {
    id: "select-repo",
    title: "Search/Select GitHub Repository",
    kind: "demo",
    bullets: [
      "Once you give permission to Vercel, it can list all your repositories",
      "Search for the repository you want to deploy, e.g. **webdev-client**",
    ],
    diagram: "vercel-import-mock",
  },
  {
    id: "deploy",
    title: "Deploy the Site",
    kind: "demo",
    bullets: [
      "After selecting the source repo, select **Deploy**",
      "Vercel will copy the source code onto their remote server and run it",
    ],
    diagram: "vercel-deploy-mock",
  },
  {
    id: "congratulations",
    title: "Congratulations!!",
    kind: "content",
    bullets: [
      "Click to navigate to your **website**",
      "Click to navigate to your **dashboard**",
    ],
    diagram: "vercel-success-mock",
  },
  {
    id: "share-url",
    title: "Remote App Identical to Local",
    kind: "content",
    bullets: [
      "**Project name**",
      "Share the **Website URL**",
      "GitHub **branch** and **commit**",
    ],
    diagram: "vercel-dashboard-mock",
  },
  {
    id: "protections",
    title: "Deployment Settings",
    kind: "demo",
    bullets: [
      "**Deployment Settings**",
      "**Deployment Protections**",
      "**Standard Protection**",
    ],
    diagram: "vercel-protect-mock",
  },
  {
    id: "disable-auth",
    title: "Vercel Authentication",
    kind: "demo",
    bullets: [
      "Disable authentication to easily share with TAs and instructors",
    ],
    diagram: "vercel-auth-mock",
    interactiveHint:
      "Incognito: the production URL must load with **no** Vercel login.",
  },
  {
    id: "break",
    title: "BREAK",
    kind: "break",
    bullets: ["Jose Annunziato"],
  },
  {
    id: "office-hours",
    title: "OFFICE HOURS",
    kind: "break",
  },
];
