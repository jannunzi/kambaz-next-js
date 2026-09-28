import type { LectureSlide } from "../types";

export const COMMIT_TO_GITHUB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "GITHUB",
    kind: "title",
    bullets: ["Jose Annunziato"],
  },
  {
    id: "install-git",
    title: "Install GitHub Client",
    kind: "content",
    bullets: [
      "**macOS** already has a **git** client in Terminal",
      "On **Windows**, download and install from [https://git-scm.com/download/win](https://git-scm.com/download/win)",
      "Optionally, a graphical git client — [https://www.sourcetreeapp.com](https://www.sourcetreeapp.com)",
    ],
    interactiveHint:
      "Confirm with `git --version`. Not found? Install, then open a **new** terminal.",
  },
  {
    id: "gitignore",
    title: "Ignoring Files",
    kind: "content",
    bullets: [
      "In `.gitignore`, add files and directories Git should ignore",
      "Make sure to ignore **node_modules**",
    ],
    code: `node_modules/
.next/
.env*.local
*.log
.idea/
.DS_Store`,
    codeLanguage: "text",
    codeFile: ".gitignore",
    interactiveHint:
      "`create-next-app` already wrote a `.gitignore`. If `git status` lists `node_modules`, stop and fix it.",
  },
  {
    id: "create-repo",
    title: "Create a Remote Repository",
    kind: "demo",
    bullets: [
      "Use **GitHub.com** instead of the school's GitHub",
      "Create an account at GitHub.com and create a new **webdev-client** repo",
      "Public. **Empty** — do not add a README, `.gitignore`, or license",
    ],
    diagram: "github-create-repo-mock",
  },
  {
    id: "empty-repo-commands",
    title: "Empty Repository",
    kind: "content",
    bullets: [
      "When you create a new repository it contains commands to push your code",
      "**Your username will be different**",
    ],
    code: `git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/<your-username>/webdev-client.git
git push -u origin main`,
    codeLanguage: "bash",
  },
  {
    id: "from-project",
    title: "Add and Commit Your Source",
    kind: "demo",
    bullets: [
      "From the **root directory** of your project",
      "**Your username will be different**",
    ],
    code: `git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/<your-username>/webdev-client.git
git push -u origin main`,
    codeLanguage: "bash",
    codeAddedLines: [1, 2, 3],
    interactiveHint:
      "HTTPS push asks for a password: GitHub wants a **Personal Access Token**, not your account password.",
  },
  {
    id: "naming-and-next",
    title: "Then deploy",
    kind: "title",
    bullets: [
      "Confirm GitHub shows your source — and not `node_modules`",
      "Next: import that same repo into **Vercel** and share the URL",
    ],
  },
];
