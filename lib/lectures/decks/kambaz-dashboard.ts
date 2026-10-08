import type { LectureSlide } from "../types";

export const KAMBAZ_DASHBOARD_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "KAMBAZ DASHBOARD",
      "Course cards that open `/courses/[cid]/home`",
    ],
  },
  {
    id: "purpose",
    title: "Creating the Dashboard Screen",
    kind: "content",
    bullets: [
      "Lists courses a student is **enrolled** in and a faculty is **teaching**",
      "Clicking a course opens that course’s Home",
      "Include **at least three** courses",
      "File: `app/(kambaz)/dashboard/page.tsx` — URL `/dashboard`",
    ],
  },
  {
    id: "target-dashboard",
    title: "Canvas target: Dashboard",
    kind: "content",
    bullets: [
      "Book Figure 1.4.3a — course cards are the Canvas-inspired target",
      "This week is **plain HTML**. Chapter 2 styles the cards",
    ],
    imageSrc: "/images/book/kambaz/dashboard.png",
    imageAlt: "Target Kambaz Dashboard with course cards",
    imageCaption: "Figure 1.4.3a — Dashboard Screen",
  },
  {
    id: "course-card",
    title: "The Dashboard Component",
    kind: "content",
    bullets: [
      "Each card repeats image, title, subtitle, and Go — extract **`CourseCard`**",
      "`import Image from \"next/image\"` — not a raw `<img>`",
      "`Link` to `/courses/${id}/home` with class `wd-dashboard-course-link`",
      "Put course photos under `public/images/`",
    ],
    code: `import Link from "next/link";
import Image from "next/image";

export default function CourseCard({
  id,
  title,
  subtitle,
  image,
}: {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <div className="wd-dashboard-course">
      <Link href={\`/courses/\${id}/home\`} className="wd-dashboard-course-link">
        <Image src={image} width={200} height={150} alt={title} />
        <div>
          <h5>{title}</h5>
          <p className="wd-dashboard-course-title">{subtitle}</p>
          <button type="button">Go</button>
        </div>
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
  },
  {
    id: "dashboard-page",
    title: "The Dashboard Component",
    kind: "content",
    bullets: [
      "Ids: `wd-dashboard`, `wd-dashboard-title`, `wd-dashboard-published`",
      "**Published Courses (3)** matches the three cards",
      "Home is `/courses/[cid]/home` — not `/courses/1234`",
    ],
    code: `import CourseCard from "./CourseCard";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (3)</h2> <hr />
      <div id="wd-dashboard-courses">
        <CourseCard
          id="1234"
          title="CS1234 React JS"
          subtitle="Full Stack software developer"
          image="/images/reactjs.jpg"
        />
        <CourseCard
          id="2345"
          title="CS2345 Node JS"
          subtitle="Server side JavaScript"
          image="/images/nodejs.jpg"
        />
        <CourseCard
          id="3456"
          title="CS3456 MongoDB"
          subtitle="NoSQL Databases"
          image="/images/mongodb.jpg"
        />
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
  },
  {
    id: "dashboard-page-live",
    title: "Dashboard: live demo",
    kind: "demo",
    embed: "kambaz-dashboard",
  },
  {
    id: "signin-to-dashboard",
    title: "Navigate to Dashboard on Signin",
    kind: "content",
    bullets: [
      "Point the Sign in button at `/dashboard`",
      "Keep id `wd-signin-btn`; the ids help us test your work",
    ],
    code: `<Link href="/dashboard" id="wd-signin-btn">
  Sign in
</Link>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signin/page.tsx",
    codeHighlightLines: [1],
  },
  {
    id: "next-up",
    title: "Next: Kambaz navigation",
    kind: "title",
    bullets: [
      "A global sidebar so Account, Dashboard, Calendar, Inbox, and Labs stay visible",
    ],
  },
];
