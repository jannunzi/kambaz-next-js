import type { LectureSlide } from "../types";

export const KAMBAZ_ACCOUNT_STYLING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Account Styling",
      "§2.4.9 · Form utilities on Sign in, Sign up, Profile — On your own",
    ],
  },
  {
    id: "purpose",
    title: "Same patterns, account chrome",
    kind: "content",
    bullets: [
      "Sign in, Sign up, and Profile from §1.4.2 get Tailwind form classes",
      "Account Navigation reuses the `kambaz.css` list-group + active border",
      "`/account/signin` stays the first Kambaz screen a visitor sees",
    ],
  },
  {
    id: "signin",
    title: "Sign in is the template",
    kind: "content",
    bullets: [
      "`max-w-sm` keeps the form narrow",
      "Full-width inputs: `w-full rounded border border-neutral-300 px-3 py-2`",
      "Primary button: `block w-full rounded bg-blue-600 … text-white`",
    ],
    code: `<div id="wd-signin-screen" className="max-w-sm">
  <h1 className="mb-3 text-2xl font-semibold">Sign in</h1>
  <input
    id="wd-username"
    placeholder="username"
    className="mb-2 w-full rounded border border-neutral-300 px-3 py-2"
  />
  <input
    id="wd-password"
    placeholder="password"
    type="password"
    className="mb-2 w-full rounded border border-neutral-300 px-3 py-2"
  />
  <Link
    id="wd-signin-btn"
    href="/account/profile"
    className="mb-2 block w-full rounded bg-blue-600 px-3 py-2 text-center text-white no-underline"
  >
    Sign in
  </Link>
  <Link id="wd-signup-link" href="/account/signup">
    Sign up
  </Link>
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signin/page.tsx",
  },
  {
    id: "demo",
    title: "Live styled Sign in",
    kind: "demo",
    bullets: [
      "Start with Sign in, then reuse its form and button patterns on Sign up and Profile.",
      "This figure uses the book snippet — wire the same classes on your file",
      "Keep `wd-signin-screen`, `wd-username`, `wd-password`, `wd-signin-btn`",
    ],
    embed: "kambaz-styled-signin",
  },
  {
    id: "reuse",
    title: "Reuse on Sign up and Profile",
    kind: "content",
    bullets: [
      "Same full-width inputs and primary / danger buttons",
      "Profile: `wd-firstname` and the rest of the Chapter 1 fields, now labeled",
      "Account Navigation: same `kambaz.css` list-group + active left border",
    ],
  },
  {
    id: "recap",
    title: "Chapter 2 styling recap",
    kind: "content",
    bullets: [
      "§2.2 React Icons — components, not `<i class=\"fa\">`",
      "§2.3 Tailwind utilities on `/labs/lab2/tailwind`",
      "§2.4 Kambaz: theme + utilities, no Preflight; flex instead of tables",
      "Checklist: §2.4.10. Assignment Editor and Account stay On your own",
    ],
  },
  {
    id: "delivery",
    title: "Deliver on branch a2",
    kind: "content",
    bullets: [
      "Same `webdev-client` repo from Chapter 1. Graders compare `main` with this branch",
      "Vercel: Settings → Git, or Build & Deployment → Branches — deploy every branch",
      "Submit the GitHub URL pointed at `a2` and that branch’s preview URL",
      "Turn off Deployment Protection so graders can open it without signing in",
    ],
    code: `git checkout -b a2
git add .
git commit -am "a2 CSS and Tailwind"
git push -u origin a2`,
    codeLanguage: "bash",
  },
  {
    id: "next-up",
    title: "Lab 2, then Chapter 3",
    kind: "title",
    bullets: [
      "Push `a2` and confirm the branch preview before you submit",
      "Chapter 3 adds JavaScript and data-driven UI on these same screens",
    ],
  },
];
