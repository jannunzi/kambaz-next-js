import type { LectureSlide } from "../types";

export const KAMBAZ_ACCOUNT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "ACCOUNT SCREENS",
      "Sign in, Sign up, Profile, account layout",
    ],
  },
  {
    id: "screens",
    title: "The Account Screens",
    kind: "content",
    bullets: [
      "Users **Sign up** to register, then **Sign in** to identify themselves",
      "**Profile** lets them view and edit personal information",
      "**Placeholders** are good practice",
      "**IDs** can be used for testing",
    ],
  },
  {
    id: "target-signin",
    title: "Canvas target: Sign in",
    kind: "content",
    bullets: [
      "Book Figure 2.4.9a — the Canvas-inspired Account Sign in we match",
      "This week is **structure**. Chapter 2 / A2 add the Tailwind look",
    ],
    imageSrc: "/images/book/kambaz/account-signin.png",
    imageAlt: "Target Account Sign in screen with NEU chrome and Account nav",
    imageCaption: "Figure 2.4.9a — Account Sign in",
  },
  {
    id: "target-profile",
    title: "Canvas target: Profile",
    kind: "content",
    bullets: [
      "Book Figure 2.4.9b — Profile fields we will stub in HTML this week",
      "Sign up uses the same form pattern as Sign in",
    ],
    imageSrc: "/images/book/kambaz/account-profile.png",
    imageAlt: "Target Account Profile screen",
    imageCaption: "Figure 2.4.9b — Account Profile",
  },
  {
    id: "signin",
    title: "Implementing the Sign In Screen",
    kind: "content",
    bullets: [
      "`app/(kambaz)/account/signin/page.tsx` — URL `/account/signin`",
      "Wrapper `wd-signin-screen`. Classes `wd-username` and `wd-password`",
      "`defaultValue` is starter credentials while there is no real auth",
      "`Link` to Profile (`wd-signin-btn`) and Sign up (`wd-signup-link`)",
    ],
    code: `import Link from "next/link";

export default function Signin() {
  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input
        placeholder="username"
        className="wd-username"
        defaultValue="ada"
      />{" "}
      <br />
      <input
        placeholder="password"
        type="password"
        className="wd-password"
        defaultValue="123"
      />{" "}
      <br />
      <Link href="/account/profile" id="wd-signin-btn">
        Sign in
      </Link>{" "}
      <br />
      <Link href="/account/signup" id="wd-signup-link">
        Sign up
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signin/page.tsx",
  },
  {
    id: "signin-live",
    title: "Sign in: live demo",
    kind: "demo",
    embed: "kambaz-signin",
  },
  {
    id: "redirects",
    title: "Account Redirects to Signin",
    kind: "content",
    bullets: [
      "`redirect` from `next/navigation` — not a deep Next internals import",
      "`app/(kambaz)/account/page.tsx` sends `/account` to `/account/signin`",
      "The Kambaz landing does the same for `/`",
    ],
    code: `import { redirect } from "next/navigation";

export default function AccountPage() {
  redirect("/account/signin");
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/page.tsx",
    codeBlocks: [
      {
        file: "app/(kambaz)/page.tsx",
        language: "tsx",
        code: `import { redirect } from "next/navigation";

export default function Kambaz() {
  redirect("/account/signin");
}`,
      },
    ],
  },
  {
    id: "profile",
    title: "Implementing the Profile Screen",
    kind: "content",
    bullets: [
      "`app/(kambaz)/account/profile/page.tsx`",
      "Ids: `wd-firstname`, `wd-lastname`, `wd-dob`, `wd-email`, `wd-role`",
      "Reuse `date`, `email`, and a `select` from Lab 1",
      "Labels would have been nice",
    ],
    code: `import Link from "next/link";

export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <input
        defaultValue="alice"
        placeholder="username"
        className="wd-username"
      />
      <br />
      <input
        defaultValue="123"
        placeholder="password"
        type="password"
        className="wd-password"
      />
      <br />
      <input defaultValue="Alice" placeholder="First Name" id="wd-firstname" />
      <br />
      <input
        defaultValue="Wonderland"
        placeholder="Last Name"
        id="wd-lastname"
      />
      <br />
      <input defaultValue="2000-01-01" type="date" id="wd-dob" />
      <br />
      <input defaultValue="alice@wonderland" type="email" id="wd-email" />
      <br />
      <select defaultValue="FACULTY" id="wd-role">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </select>
      <br />
      <Link href="/account/signin">Sign out</Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/profile/page.tsx",
  },
  {
    id: "profile-live",
    title: "Profile: live demo",
    kind: "demo",
    embed: "kambaz-profile",
  },
  {
    id: "signup",
    title: "Implementing the Sign Up Screen",
    kind: "content",
    bullets: [
      "`app/(kambaz)/account/signup/page.tsx` — URL `/account/signup`",
      "Adds **verify password** — class `wd-password-verify`",
      "Absolute paths — not `href=\"profile\"`",
      "CSS will make these look much better",
    ],
    code: `import Link from "next/link";

export default function Signup() {
  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      <input
        placeholder="username"
        className="wd-username"
        defaultValue="ada"
      />
      <br />
      <input
        placeholder="password"
        type="password"
        className="wd-password"
        defaultValue="123"
      />
      <br />
      <input
        placeholder="verify password"
        type="password"
        className="wd-password-verify"
      />
      <br />
      <Link href="/account/profile">Sign up</Link>
      <br />
      <Link href="/account/signin">Sign in</Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signup/page.tsx",
    codeAddedLines: [[21, 24]],
  },
  {
    id: "signup-live",
    title: "Sign up: live demo",
    kind: "demo",
    embed: "kambaz-signup",
  },
  {
    id: "account-nav",
    title: "Account Navigation Sidebar",
    kind: "content",
    bullets: [
      "`app/(kambaz)/account/Navigation.tsx` — wrapper `wd-account-navigation`",
      "Three absolute `Link`s: Signin, Signup, Profile",
      "Navigation links between Account screens",
    ],
    code: `import Link from "next/link";

export default function AccountNavigation() {
  return (
    <div id="wd-account-navigation">
      <Link href="/account/signin">Signin</Link> <br />
      <Link href="/account/signup">Signup</Link> <br />
      <Link href="/account/profile">Profile</Link> <br />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/Navigation.tsx",
  },
  {
    id: "account-layout",
    title: "Layout Sidebar in Left Column",
    kind: "content",
    bullets: [
      "`app/(kambaz)/account/layout.tsx` does **not** create a URL",
      "Two-column `<table>`: navigation left, `{children}` right",
      "Wrapper id `wd-kambaz-account`",
    ],
    code: `import { ReactNode } from "react";
import AccountNavigation from "./Navigation";

export default function AccountLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-kambaz-account">
      <table>
        <tbody>
          <tr>
            <td valign="top">
              <AccountNavigation />
            </td>
            <td valign="top" width="100%">
              {children}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/layout.tsx",
    codeAddedLines: [2, 13, 16],
  },
  {
    id: "account-layout-live",
    title: "Account layout: live demo",
    kind: "demo",
    embed: "kambaz-account-nav",
    interactiveHint:
      "Click Signup in the live sidebar. Nav stays. Only {children} changes.",
  },
  {
    id: "next-up",
    title: "Next: Dashboard cards",
    kind: "title",
    bullets: [
      "After Sign in works, point `wd-signin-btn` at `/dashboard`",
      "Extract a `CourseCard` so you do not copy the markup three times",
    ],
  },
];
