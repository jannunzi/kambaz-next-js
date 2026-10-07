import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import LocalUrl from "../../components/LocalUrl";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import BookFigure from "../../components/BookFigure";
import AccountScreensDemo from "../embeds/AccountScreensDemo";
import DashboardDemo from "../embeds/DashboardDemo";
import ModulesDemo from "../embeds/ModulesDemo";
import HomeDemo from "../embeds/HomeDemo";
import AssignmentsDemo from "../embeds/AssignmentsDemo";
import AssignmentsStep from "../embeds/assignments-step/Assignments";
import AssignmentEditorDemo from "../embeds/AssignmentEditorDemo";
import DemoSignin from "../embeds/DemoSignin";
import DemoSignup from "../embeds/DemoSignup";
import DemoProfile from "../embeds/DemoProfile";
import AccountNavigation from "../embeds/_styled/AccountNavigation";
import Link from "next/link";

export default function KambazSections() {
  return (
    <>
      <Section
        id="sec-1-4"
        title="1.4 Prototyping the React Kambaz User Interface with HTML"
      >
        <p>
          So far the exercises in this chapter practiced HTML pieces in
          isolation. The following sections put those skills to work building{" "}
          <strong>Kambaz</strong> — a website inspired by a popular Online
          Learning Management System (<strong>LMS</strong>). This chapter
          focuses on simple prototype screens; later chapters improve the same
          structure with CSS, state, and data. A single coverage checklist is in{" "}
          <SectionLink to="1.4.9" /> — use it after you have walked through the
          screens, not instead of building them as you read.
        </p>
        <p>
          Do all Kambaz work under <code>app/(kambaz)</code>. This is still the
          App Router from <SectionLink to="1.2.5" /> — folders plus <code>page.tsx</code>{" "}create
          routes — with one new wrinkle: parentheses make a{" "}
          <strong>route group</strong>. A route group organizes files and
          layouts without appearing in the URL. A page at{" "}
          <code>app/(kambaz)/dashboard/page.tsx</code>{" "}is still the route{" "}
          <code>/dashboard</code>, not <code>/(kambaz)/dashboard</code>.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-1-4-1"
        title="1.4.1 Implementing the Kambaz Landing Page"
      >
        <p>
          A <strong>landing page</strong>{" "}is the primary entry point of a web
          application — the screen for the root route <code>/</code>. In the App
          Router that is normally <code>app/page.tsx</code>. To keep Kambaz
          modular while still owning <code>/</code>, put that homepage inside
          the <code>(kambaz)</code>{" "}route group (
          <code>app/(kambaz)/page.tsx</code>) instead of leaving a separate root{" "}
          <code>page.tsx</code>{" "}beside the group.
        </p>
        <p>
          Start with a minimal landing page, remove any leftover root{" "}
          <code>app/page.tsx</code>{" "}so the route group owns <code>/</code>, and
          add a Kambaz link in both the Labs TOC and the Labs index page:
        </p>
        <CodeBlock
          language="tsx"
          name="KambazLanding"
          file="app/(kambaz)/page.tsx"
        >{`export default function Kambaz() {
  return (
    <div id="wd-kambaz">
      <h1>Kambaz</h1>
    </div>
  );
}`}</CodeBlock>
        <CodeBlock language="tsx" name="LabsTOC" file="app/labs/TOC.tsx">{`import Link from "next/link";

export default function TOC() {
  return (
    <ul>
      <li>
        <Link href="/labs" id="wd-home-link">
          Home
        </Link>
      </li>
      {/* ... lab links ... */}
      <li>
        <Link href="/" id="wd-kambaz-link">
          Kambaz
        </Link>
      </li>
    </ul>
  );
}`}</CodeBlock>
        <p>
          At <LocalUrl href="/" />{" "}you should see the Kambaz
          heading and that the Labs TOC link with id{" "}
          <code>wd-kambaz-link</code>{" "}reaches it. In the next section you will
          change this landing page to redirect into Sign in so authentication is
          the default entry.
        </p>
        <p>
          Open the live app:{" "}
          <Link href="/account/signin" target="_blank">
            /account/signin (Kambaz)
          </Link>
        </p>
      </Section>

      <Section
        level={3}
        id="sec-1-4-2"
        title="1.4.2 The Kambaz Account Screens"
      >
        <p>
          Account screens manage identity and personal details.{" "}
          <strong>Sign up</strong>{" "}registers a new user,{" "}
          <strong>Sign in</strong>{" "}identifies a returning user, and{" "}
          <strong>Profile</strong>{" "}lets them view and edit account fields. An{" "}
          <strong>Account Navigation</strong>{" "}sidebar keeps those screens a
          click apart without reloading the whole app.
        </p>

        <h3
          id="sec-1-4-2-1"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.4.2.1 The Sign In Screen
        </h3>
        <p>
          Create <code>app/(kambaz)/account/signin/page.tsx</code>{" "}with username
          and password fields plus links to Profile and Sign up. Use{" "}
          <code>defaultValue</code>{" "} for starter credentials — useful while you
          prototype before real authentication exists.
        </p>
        <p>
          You will also see <code>className</code>{" "}on some tags (for example{" "}
          <code>className=&quot;wd-username&quot;</code>). In plain HTML the
          attribute is named <code>class</code>; in JSX it must be{" "}
          <code>className</code>{" "}because <code>class</code>{" "}is a reserved word
          in JavaScript — the same reason labels use <code>htmlFor</code>{" "}
          instead of <code>for</code>. Keep these names exactly as written:
          automated tests (and graders) look for them to verify your markup. They
          can also hook up CSS later in <ChapterLink to={2} />; with Tailwind commented out
          they may not change how the page looks yet.
        </p>
        <p>
          Create the Sign in screen as follows:
        </p>
        <CodeBlock
          language="tsx"
          name="Signin"
          file="app/(kambaz)/account/signin/page.tsx"
        >{`import Link from "next/link";

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
}`}</CodeBlock>
        <p>
          A minimal Sign in screen: username and password with starter defaults,
          plus links toward Profile and Sign up:
        </p>
        <LiveDemo
          name="Signin"
          file="app/(kambaz)/account/signin/page.tsx"
        >
          <DemoSignin />
        </LiveDemo>
        <p>
          Make Sign in the default for both <code>/account</code>{" "}and the
          Kambaz root by redirecting with{" "}
          <code>redirect</code>{" "}from <code>next/navigation</code>. Unlike a{" "}
          <code>Link</code>{" "}(which the user clicks), <code>redirect</code>{" "}
          runs when the route renders and immediately sends the browser to
          another path — useful for default screens:
        </p>
        <CodeBlock
          language="tsx"
          name="AccountPage"
          file="app/(kambaz)/account/page.tsx"
        >{`import { redirect } from "next/navigation";

export default function AccountPage() {
  redirect("/account/signin");
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Kambaz"
          file="app/(kambaz)/page.tsx"
        >{`import { redirect } from "next/navigation";

export default function Kambaz() {
  redirect("/account/signin");
}`}</CodeBlock>
        <p>
          <code>/account</code>{" "}and <code>/</code>{" "}should both land on{" "}
          <code>/account/signin</code>.
        </p>

        <h3
          id="sec-1-4-2-2"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.4.2.2 The Sign Up Screen
        </h3>
        <p>
          Sign up mirrors Sign in but adds a password-verification field.
          Create <code>app/(kambaz)/account/signup/page.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Signup"
          file="app/(kambaz)/account/signup/page.tsx"
        >{`import Link from "next/link";

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
}`}</CodeBlock>
        <p>
          Sign up mirrors Sign in but adds a second password field for
          verification:
        </p>
        <LiveDemo
          name="Signup"
          file="app/(kambaz)/account/signup/page.tsx"
        >
          <DemoSignup />
        </LiveDemo>

        <h3
          id="sec-1-4-2-3"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.4.2.3 The Profile Screen
        </h3>
        <p>
          Profile shows a fuller set of user fields. Reuse typed inputs from
          Lab 1 — <code>date</code>, <code>email</code>, and a{" "}
          <code>select</code>{" "}for role:
        </p>
        <CodeBlock
          language="tsx"
          name="Profile"
          file="app/(kambaz)/account/profile/page.tsx"
        >{`import Link from "next/link";

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
}`}</CodeBlock>
        <p>
          Profile collects identity fields — try the role dropdown and date of
          birth control:
        </p>
        <LiveDemo
          name="Profile"
          file="app/(kambaz)/account/profile/page.tsx"
        >
          <DemoProfile />
        </LiveDemo>

        <h3
          id="sec-1-4-2-4"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.4.2.4 Account Navigation
        </h3>
        <p>
          Create <code>app/(kambaz)/account/Navigation.tsx</code>{" "}with links to
          Signin, Signup, and Profile. Then wrap account routes in{" "}
          <code>app/(kambaz)/account/layout.tsx</code>{" "}using a two-column table
          — navigation on the left, <code>children</code>{" "}on the right (same
          layout idea as Labs in <SectionLink to="1.3.11" />):
        </p>
        <CodeBlock
          language="tsx"
          name="AccountNavigation"
          file="app/(kambaz)/account/Navigation.tsx"
        >{`import Link from "next/link";

export default function AccountNavigation() {
  return (
    <div id="wd-account-navigation">
      <Link href="/account/signin">Signin</Link> <br />
      <Link href="/account/signup">Signup</Link> <br />
      <Link href="/account/profile">Profile</Link> <br />
    </div>
  );
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="AccountLayout"
          file="app/(kambaz)/account/layout.tsx"
        >{`import { ReactNode } from "react";
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
}`}</CodeBlock>
        <p>
          Three absolute account links — Signin, Signup, and Profile — ready to
          sit in the layout&apos;s left column:
        </p>
        <LiveDemo
          name="AccountNavigation"
          file="app/(kambaz)/account/Navigation.tsx"
        >
          <AccountNavigation />
        </LiveDemo>
        <p>
          With the layout in place, Sign in is the default content beside the
          sidebar. Nav stays on the left while Sign in fills the right column —
          then open <code>/account</code>{" "}in the running app and click the
          sidebar so Sign up and Profile swap into that same column.{" "}
          <code>/account</code>{" "}and <code>/</code>{" "}should redirect to{" "}
          <code>/account/signin</code>.
        </p>
        <LiveDemo
          name="AccountLayout"
          file="app/(kambaz)/account/layout.tsx"
        >
          <table width="100%">
            <tbody>
              <tr>
                <td valign="top">
                  <AccountNavigation />
                </td>
                <td valign="top" width="100%">
                  <DemoSignin />
                </td>
              </tr>
            </tbody>
          </table>
        </LiveDemo>
        <p>
          For reference, here are all four account pieces side by side — nav,
          Sign in, Sign up, and Profile:
        </p>
        <LiveDemo
          name="AccountScreensDemo"
          file="app/book/ch1/embeds/AccountScreensDemo.tsx"
        >
          <AccountScreensDemo />
        </LiveDemo>
      </Section>

      <Section
        level={3}
        id="sec-1-4-3"
        title="1.4.3 Implementing the Dashboard Screen"
      >
        <p>
          The Dashboard lists courses a student is enrolled in (or a faculty
          member is teaching). Clicking a course navigates to that course&apos;s
          route. For course thumbnails, use the Next.js{" "}
          <code>Image</code>{" "}component from <code>next/image</code>{" "}instead of
          a raw <code>&lt;img&gt;</code>. It still needs <code>src</code>,{" "}
          <code>alt</code>, <code>width</code>, and <code>height</code>; Next.js
          uses those sizes for layout and optimization. For this chapter, treat{" "}
          <code>Image</code>{" "}as the preferred way to show local files under{" "}
          <code>public/images/</code>{" "}— look images up online or generate
          placeholders with an AI tool. Include{" "}
          <strong>at least three</strong>{" "}courses.
        </p>
        <p>
          Each course repeats the same markup — image, title, subtitle, and a
          Go button — so extract that block into a{" "}
          <code>CourseCard</code>{" "}component that accepts the differing values
          as <strong>props</strong>. Use{" "}
          <code>type=&quot;button&quot;</code>{" "}on Go (
          <SectionLink to="1.3.6.7" />) so the click does not try to submit a
          form. Keep the markup plain for now;{" "}
          <ChapterLink to={2} />{" "}will add Tailwind classes to this same
          component and lay the cards out in a responsive grid.
        </p>
        <CodeBlock
          language="tsx"
          name="CourseCard"
          file="app/(kambaz)/dashboard/CourseCard.tsx"
        >{`import Link from "next/link";
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
}`}</CodeBlock>
        <p>
          The Dashboard page then mounts one <code>CourseCard</code>{" "}per
          course — at least three in total:
        </p>
        <CodeBlock
          language="tsx"
          name="Dashboard"
          file="app/(kambaz)/dashboard/page.tsx"
        >{`import CourseCard from "./CourseCard";

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
}`}</CodeBlock>
        <p>
          The prototype does not need to match the polished target below yet —
          <ChapterLink to={2} />{" "}styles <code>CourseCard</code>{" "}and the courses container.
          Point the Sign in button at the Dashboard so a successful
          &quot;sign in&quot; lands on courses:
        </p>
        <BookFigure
          id="fig-1.4.3a"
          src="/images/book/kambaz/dashboard.png"
          alt="Target Kambaz Dashboard with course cards"
          caption="Figure 1.4.3a — Dashboard Screen"
        />
        <CodeBlock
          language="tsx"
          name="SigninToDashboard"
          file="app/(kambaz)/account/signin/page.tsx"
        >{`<Link href="/dashboard" id="wd-signin-btn">
  Sign in
</Link>`}</CodeBlock>

        <h3
          id="sec-1-4-3-1"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.4.3.1 Kambaz Navigation Sidebar
        </h3>
        <p>
          Global navigation belongs in{" "}
          <code>app/(kambaz)/Navigation.tsx</code>{" "}and the{" "}
          <code>app/(kambaz)/layout.tsx</code>{" "}table layout so Account,
          Dashboard, Calendar, Inbox, and Labs stay visible across screens.
          Northeastern can stay an external <code>&lt;a&gt;</code>{" "}with{" "}
          <code>target=&quot;_blank&quot;</code>; in-app destinations use{" "}
          <code>Link</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="KambazNavigation"
          file="app/(kambaz)/Navigation.tsx"
        >{`import Link from "next/link";

export default function KambazNavigation() {
  return (
    <div id="wd-kambaz-navigation">
      <a
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
        target="_blank"
        rel="noreferrer"
      >
        Northeastern
      </a>
      <br />
      <Link href="/account" id="wd-account-link">
        Account
      </Link>
      <br />
      <Link href="/dashboard" id="wd-dashboard-link">
        Dashboard
      </Link>
      <br />
      <Link href="/dashboard" id="wd-course-link">
        Courses
      </Link>
      <br />
      <Link href="/calendar" id="wd-calendar-link">
        Calendar
      </Link>
      <br />
      <Link href="/inbox" id="wd-inbox-link">
        Inbox
      </Link>
      <br />
      <Link href="/labs" id="wd-labs-link">
        Labs
      </Link>
      <br />
    </div>
  );
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="KambazLayout"
          file="app/(kambaz)/layout.tsx"
        >{`import { ReactNode } from "react";
import KambazNavigation from "./Navigation";

export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <table>
      <tbody>
        <tr>
          <td valign="top" width="200">
            <KambazNavigation />
          </td>
          <td valign="top" width="100%">
            {children}
          </td>
        </tr>
      </tbody>
    </table>
  );
}`}</CodeBlock>

        <h3
          id="sec-1-4-3-2"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.4.3.2 Handling Missing Pages
        </h3>
        <p>
          Calendar and Inbox links will 404 until those pages exist. Handle
          missing routes gracefully with <code>app/not-found.tsx</code>{" "}— another
          reserved App Router filename (like <code>page.tsx</code>{" "}in{" "}
          <SectionLink to="1.2.5" />{" "}and <code>layout.tsx</code>{" "}in{" "}
          <SectionLink to="1.3.11" />) — so users can return to the
          Dashboard. Keep the markup simple; fancy <code>className</code>{" "}values
          are optional placeholders until <ChapterLink to={2} />{" "}styling is on:
        </p>
        <CodeBlock
          language="tsx"
          name="NotFound"
          file="app/not-found.tsx"
        >{`import Link from "next/link";

export default function NotFound() {
  return (
    <div id="wd-not-found">
      <h2>Page Not Found</h2>
      <p>
        The requested page could not be found. Please check the page URL or
        return to the dashboard.
      </p>
      <Link href="/dashboard" id="wd-not-found-dashboard-link">
        Back to Dashboard
      </Link>
    </div>
  );
}`}</CodeBlock>
        <p>
          Kambaz chrome on the left, Dashboard courses on the right. Sign in
          should land here; Account still reaches the account screens; Calendar
          and Inbox should show the not-found page with Back to Dashboard:
        </p>
        <LiveDemo
          name="DashboardDemo"
          file="app/book/ch1/embeds/DashboardDemo.tsx"
        >
          <DashboardDemo />
        </LiveDemo>
      </Section>

      <Section
        level={3}
        id="sec-1-4-4"
        title="1.4.4 Implementing the Courses Screen"
      >
        <p>
          Clicking a course on the Dashboard should open that course&apos;s{" "}
          <strong>Home</strong>{" "}screen at{" "}
          <code>/courses/[cid]/home</code>. Same App Router rule as <SectionLink to="1.2.5" /> — a
          folder with <code>page.tsx</code>{" "}is a route — except{" "}
          <code>[cid]</code>{" "}is a <strong>dynamic segment</strong>: Next.js
          fills <code>cid</code>{" "}from whatever appears in that part of the URL
          (for example <code>1234</code>{" "}in{" "}
          <code>/courses/1234/home</code>). You do{" "}
          <strong>not</strong>{" "}need a <code>page.tsx</code>{" "}directly under{" "}
          <code>[cid]</code>{" "}— Home lives in the <code>home</code>{" "}folder.
          Start with a placeholder Home page, then add Course Navigation and a
          courses layout.
        </p>
        <CodeBlock
          language="tsx"
          name="HomePlaceholder"
          file="app/(kambaz)/courses/[cid]/home/page.tsx"
        >{`export default function Home() {
  return (
    <div id="wd-home">
      <h2>Home 1234</h2>
    </div>
  );
}`}</CodeBlock>
        <p>
          Point each <code>CourseCard</code>{" "}at that route, for example{" "}
          <code>{`href={\`/courses/\${id}/home\`}`}</code>.
        </p>

        <h3
          id="sec-1-4-4-1"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.4.4.1 Course Navigation Sidebar
        </h3>
        <p>
          Course Navigation links to Home, Modules, Piazza, Zoom, Assignments,
          Quizzes, Grades, and People. Implement real screens for Home,
          Modules, and Assignments in this chapter. For the rest, add simple
          placeholder pages that only show a heading — for example{" "}
          <code>app/(kambaz)/courses/[cid]/piazza/page.tsx</code>,{" "}
          <code>zoom/page.tsx</code>, <code>quizzes/page.tsx</code>,{" "}
          <code>grades/page.tsx</code>, and{" "}
          <code>people/table/page.tsx</code>.
        </p>
        <p>
          Pass <code>cid</code>{" "}into the navigation so links stay correct for
          every course. The <code>href</code>{" "}values use a JavaScript{" "}
          <strong>template literal</strong>{" "}(backticks):{" "}
          <code>{`\`/courses/\${cid}/home\``}</code>{" "}builds a string and inserts
          the current <code>cid</code>{" "}where <code>{`\${cid}`}</code>{" "}appears.
          Copy the pattern for now; Chapter 3 covers JavaScript strings in more
          depth.
        </p>
        <CodeBlock
          language="tsx"
          name="CourseNavigation"
          file="app/(kambaz)/courses/[cid]/Navigation.tsx"
        >{`import Link from "next/link";

export default function CourseNavigation({ cid }: { cid: string }) {
  return (
    <div id="wd-courses-navigation">
      <Link href={\`/courses/\${cid}/home\`} id="wd-course-home-link">
        Home
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/modules\`} id="wd-course-modules-link">
        Modules
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/piazza\`} id="wd-course-piazza-link">
        Piazza
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/zoom\`} id="wd-course-zoom-link">
        Zoom
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/assignments\`} id="wd-course-assignments-link">
        Assignments
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/quizzes\`} id="wd-course-quizzes-link">
        Quizzes
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/grades\`} id="wd-course-grades-link">
        Grades
      </Link>{" "}
      <br />
      <Link href={\`/courses/\${cid}/people/table\`} id="wd-course-people-link">
        People
      </Link>{" "}
      <br />
    </div>
  );
}`}</CodeBlock>
        <p>
          Wire the sidebar into{" "}
          <code>app/(kambaz)/courses/[cid]/layout.tsx</code>. In the current App
          Router, layouts (and some pages) receive the dynamic segment through a{" "}
          <code>params</code>{" "}prop that is a Promise — so the function is marked{" "}
          <code>async</code>{" "}and you <code>await params</code>{" "}before reading{" "}
          <code>cid</code>. Copy this shape for now;{" "}
          <SectionLink to="6.2.6.1" />{" "}explains{" "}
          <code>async</code>/<code>await</code>{" "}more carefully:
        </p>
        <CodeBlock
          language="tsx"
          name="CoursesLayout"
          file="app/(kambaz)/courses/[cid]/layout.tsx"
        >{`import { ReactNode } from "react";
import CourseNavigation from "./Navigation";

export default async function CoursesLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ cid: string }>;
}>) {
  const { cid } = await params;
  return (
    <div id="wd-courses">
      <h2>Courses {cid}</h2>
      <hr />
      <table>
        <tbody>
          <tr>
            <td valign="top" width="200">
              <CourseNavigation cid={cid} />
            </td>
            <td valign="top" width="100%">
              {children}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}`}</CodeBlock>
        <p>
          Opening a course from the Dashboard should show the course id
          in the heading and the Course Navigation sidebar on the left. Placeholder
          links such as Piazza should render their simple heading pages.
        </p>
        <p>
          If <code>npm run dev</code>{" "}works but <code>npm run build</code>{" "}or
          your Vercel deploy fails with{" "}
          <em>
            Next.js encountered URL data <code>usePathname()</code>{" "}in a
            Client Component outside of <code>&lt;Suspense&gt;</code>
          </em>{" "}
          or, further down the log,{" "}
          <em>Next.js encountered uncached or runtime data during prerendering</em>
          , your project was created with Next.js 16.4 (<code>package.json</code>{" "}
          says <code>&quot;next&quot;: &quot;16.4.0&quot;</code>). Delete both the{" "}
          <code>cacheComponents: true,</code>{" "}and{" "}
          <code>partialPrefetching: true,</code>{" "}lines from{" "}
          <code>next.config.ts</code>{" "}as described in{" "}
          <a href="#next-16-4-cache-components-fix">the Next.js 16.4 fix note</a>
          , then build again.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-1-4-5"
        title="1.4.5 Implementing the Modules Screen"
      >
        <p>
          When a user opens a course from the Dashboard, the default destination
          will be that course&apos;s <strong>Home</strong>{" "}screen. Home shows the
          same module list you see under Modules — Week 1 / Lecture 1 material,
          with nested sections such as LEARNING OBJECTIVES, READING, and SLIDES.
          Build the <strong>Modules</strong>{" "}screen first, then reuse that
          component when you assemble Home in <SectionLink to="1.4.6" />.
        </p>
        <p>
          On screen you effectively have three columns of chrome and content:
          Kambaz Navigation (from the Kambaz layout), Course Navigation (from
          the courses layout), and the Modules list in the main area. Focus now
          on prototyping Modules as nested lists: a top-level list of{" "}
          <strong>modules</strong>, each containing a nested list of{" "}
          <strong>lessons</strong>, each lesson containing{" "}
          <strong>content items</strong>. Include at least Weeks 1–3; expand Week
          1 with LEARNING OBJECTIVES, READING, and SLIDES.
        </p>
        <p>
          Same idea as <code>CourseCard</code>: those nested blocks repeat, so
          extract them into plain components before you fill the page. Keep the
          markup unstyled; <ChapterLink to={2} />{" "}will add Tailwind and a small checkmark
          helper to these same files.
        </p>
        <p>
          Start with <code>Module</code>: one week&apos;s title, plus a{" "}
          <code>children</code>{" "}slot where its lessons will nest (the same{" "}
          <code>children</code>{" "}pattern from <SectionLink to="1.3" />):
        </p>
        <CodeBlock
          language="tsx"
          name="Module"
          file="app/(kambaz)/courses/[cid]/modules/Module.tsx"
        >{`import type { ReactNode } from "react";

export default function Module({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <li className="wd-module">
      <div className="wd-title">{title}</div>
      <ul className="wd-lessons">{children}</ul>
    </li>
  );
}`}</CodeBlock>
        <p>
          Next, <code>Lesson</code>{" "}— same shape one level down. Its title is
          something like LEARNING OBJECTIVES or READING; its{" "}
          <code>children</code>{" "}are the content-item <code>li</code>s. Always
          render the <code>wd-content</code>{" "}list (even if empty for now) so
          you stay with the <code>{`{children}`}</code>{" "}pattern and avoid
          new JavaScript conditionals:
        </p>
        <CodeBlock
          language="tsx"
          name="Lesson"
          file="app/(kambaz)/courses/[cid]/modules/Lesson.tsx"
        >{`import type { ReactNode } from "react";

export default function Lesson({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <li className="wd-lesson">
      <span className="wd-title">{title}</span>
      <ul className="wd-content">{children}</ul>
    </li>
  );
}`}</CodeBlock>
        <p>
          Assemble them on the Modules page: a short toolbar on top, then{" "}
          <code>Module</code>{" "}elements whose children are{" "}
          <code>Lesson</code>s. Expand Week 1 fully; Weeks 2–3 can start thin
          and grow as you like:
        </p>
        <CodeBlock
          language="tsx"
          name="Modules"
          file="app/(kambaz)/courses/[cid]/modules/page.tsx"
        >{`import Module from "./Module";
import Lesson from "./Lesson";

export default function Modules() {
  return (
    <div>
      <button>Collapse All</button> <button>View Progress</button>{" "}
      <select defaultValue="publish-all">
        <option value="publish-all">Publish All</option>
      </select>{" "}
      <button>+ Module</button>
      <ul id="wd-modules">
        <Module title="Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda">
          <Lesson title="LEARNING OBJECTIVES">
            <li className="wd-content-item">Introduction to the course</li>
            <li className="wd-content-item">Learn what is Web Development</li>
          </Lesson>
          <Lesson title="READING">
            <li className="wd-content-item">
              Full Stack Developer - Chapter 1 - Introduction
            </li>
            <li className="wd-content-item">
              Full Stack Developer - Chapter 2 - Creating User Interfaces
            </li>
          </Lesson>
          <Lesson title="SLIDES">
            <li className="wd-content-item">Introduction to Web Development</li>
            <li className="wd-content-item">
              Creating an HTTP server with Node.js
            </li>
            <li className="wd-content-item">Creating a React Application</li>
          </Lesson>
        </Module>
        <Module title="Week 2">{/* Expand lessons on your own */}</Module>
        <Module title="Week 3" />
      </ul>
    </div>
  );
}`}</CodeBlock>
        <p>
          Aim for the structure of the target Modules screen below; this
          chapter&apos;s HTML prototype stays unstyled. The nested list should
          read as weeks → lessons → content items. Expand Weeks 2–3 with more
          lessons if you want a fuller prototype:
        </p>
        <BookFigure
          id="fig-1.4.5a"
          src="/images/book/kambaz/modules.png"
          alt="Target Kambaz Modules screen"
          caption="Figure 1.4.5a — Modules Screen"
        />
        <LiveDemo
          name="ModulesDemo"
          file="app/book/ch1/embeds/ModulesDemo.tsx"
        >
          <ModulesDemo />
        </LiveDemo>
      </Section>

      <Section
        level={3}
        id="sec-1-4-6"
        title="1.4.6 Implementing the Course Home Screen"
      >
        <p>
          The finished Home target shows four columns: Kambaz Navigation,
          Course Navigation, Modules, and a <strong>Course Status</strong>{" "}
          sidebar. The first two already come from outer layouts — Home only
          needs Modules plus Course Status side by side:
        </p>
        <BookFigure
          id="fig-1.4.6a"
          src="/images/book/kambaz/home.png"
          alt="Target Kambaz Home screen with Course Status"
          caption="Figure 1.4.6a — Home Screen"
        />
        <p>
          Create <code>app/(kambaz)/courses/[cid]/home/Status.tsx</code>. Start
          from the stub below, then complete the status actions on your own.
          Include all of these buttons (labels matter for graders):
        </p>
        <ul>
          <li>Unpublish and Publish</li>
          <li>Import Existing Content</li>
          <li>Import from Commons</li>
          <li>Choose Home Page</li>
          <li>View Course Stream</li>
          <li>New Announcement</li>
          <li>New Analytics</li>
          <li>View Course Notifications</li>
        </ul>
        <CodeBlock
          language="tsx"
          name="CourseStatus"
          file="app/(kambaz)/courses/[cid]/home/Status.tsx"
        >{`export default function CourseStatus() {
  return (
    <div id="wd-course-status">
      <h2>Course Status</h2>
      <button>Unpublish</button> <button>Publish</button>
      <br />
      <br />
      {/* Complete the remaining status actions on your own */}
      <button>View Course Notifications</button>
    </div>
  );
}`}</CodeBlock>
        <p>
          Combine Course Status with Modules in{" "}
          <code>app/(kambaz)/courses/[cid]/home/page.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Home"
          file="app/(kambaz)/courses/[cid]/home/page.tsx"
        >{`import Modules from "../modules/page";
import CourseStatus from "./Status";

export default function Home() {
  return (
    <div id="wd-home">
      <table>
        <tbody>
          <tr>
            <td valign="top" width="70%">
              <Modules />
            </td>
            <td valign="top">
              <CourseStatus />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}`}</CodeBlock>
        <p>
          If you still have an early <code>page.tsx</code>{" "}directly under{" "}
          <code>courses/[cid]/</code>, delete it — Dashboard and Course
          Navigation both target <code>/courses/[cid]/home</code>, so that
          extra page is unused. Home splits the screen: modules on the left,
          course status actions on the right. Opening a course from the
          Dashboard should land here:
        </p>
        <LiveDemo name="HomeDemo" file="app/book/ch1/embeds/HomeDemo.tsx">
          <HomeDemo />
        </LiveDemo>
      </Section>

      <Section
        level={3}
        id="sec-1-4-7"
        title="1.4.7 Assignments Screen (On Your Own)"
      >
        <p>
          Build the Assignments screen yourself using the same HTML patterns
          from Dashboard, Modules, and Home — no line-by-line walkthrough this
          time. From the Dashboard, open a course, then choose Assignments in
          Course Navigation. The polished target is below; match the plain
          HTML demo for this chapter. Exact due dates may differ. Keep the
          given <code>id</code>{" "}and <code>className</code>{" "}values so later
          chapters and graders can find them.{" "}
          <ChapterLink to={2} />{" "}will style this screen with Tailwind.
        </p>
        <BookFigure
          id="fig-1.4.7a"
          src="/images/book/kambaz/assignments.png"
          alt="Target Kambaz Assignments screen"
          caption="Figure 1.4.7a — Assignments Screen"
        />
        <p>
          <strong>What to build</strong>
        </p>
        <ul>
          <li>
            Route:{" "}
            <code>app/(kambaz)/courses/[cid]/assignments/page.tsx</code>
          </li>
          <li>
            A search field (
            <code>id=&quot;wd-search-assignment&quot;</code>, placeholder{" "}
            <code>Search for Assignments</code>), plus{" "}
            <code>+ Group</code>{" "}(<code>wd-add-assignment-group</code>) and{" "}
            <code>+ Assignment</code>{" "}(<code>wd-add-assignment</code>) buttons
          </li>
          <li>
            A group heading{" "}
            <code>id=&quot;wd-assignments-title&quot;</code>{" "}— text like{" "}
            <code>ASSIGNMENTS 40% of Total</code>{" "}with a small{" "}
            <code>+</code>{" "}button. Only the ASSIGNMENTS group is required
            (QUIZZES / EXAMS / PROJECT can wait)
          </li>
          <li>
            A list <code>id=&quot;wd-assignment-list&quot;</code>{" "}with your
            assignments, each linking to its editor. Aim for three (A1 ENV +
            HTML, A2 CSS + TAILWIND, A3 JS + REACT are fine examples)
          </li>
          <li>
            Each row: title link to{" "}
            <code>{`/courses/\${cid}/assignments/\${aid}`}</code>{" "}with{" "}
            <code>className=&quot;wd-assignment-link&quot;</code>, plus a
            due-date / points blurb underneath. Wrap the row in{" "}
            <code>className=&quot;wd-assignment-list-item&quot;</code>
          </li>
          <li>
            Same idea as <code>CourseCard</code>: extract a plain{" "}
            <code>AssignmentItem</code>{" "}component for each row (props for{" "}
            <code>cid</code>, <code>aid</code>, <code>title</code>,{" "}
            <code>details</code>) so you are not copying the markup three times
          </li>
          <li>
            The page needs <code>cid</code>{" "}from the URL for those links — use
            the same <code>async</code> / <code>await params</code>{" "}shape as the
            courses layout (copy for now; <SectionLink to="6.2.6.1" />{" "}
            explains <code>async</code>/<code>await</code>)
          </li>
        </ul>
        <p>
          Start from these two files. <code>AssignmentItem</code>{" "}is complete,
          and the page already renders one assignment (A1) that links to its
          editor. Add the rest yourself: three assignments are recommended (A2
          and A3 after A1), plus the search field, buttons, and group heading.
        </p>
        <CodeBlock
          language="tsx"
          name="AssignmentItem"
          file="app/(kambaz)/courses/[cid]/assignments/AssignmentItem.tsx"
        >{`import Link from "next/link";

export default function AssignmentItem({
  cid,
  aid,
  title,
  details,
}: {
  cid: string;
  aid: string;
  title: string;
  details: string;
}) {
  return (
    <li className="wd-assignment-list-item">
      <Link
        href={\`/courses/\${cid}/assignments/\${aid}\`}
        className="wd-assignment-link"
      >
        {title}
      </Link>
      <div>{details}</div>
    </li>
  );
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Assignments"
          file="app/(kambaz)/courses/[cid]/assignments/page.tsx"
        >{`import AssignmentItem from "./AssignmentItem";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return (
    <div id="wd-assignments">
      {/* search input, + Group, + Assignment */}
      {/* h3 wd-assignments-title */}
      <ul id="wd-assignment-list">
        <AssignmentItem
          cid={cid}
          aid="123"
          title="A1 - ENV + HTML"
          details="Multiple Modules | Due May 13 at 11:59pm | 100 pts"
        />
        {/* Add more assignments here (three recommended, like A2, A3), each linking to its editor */}
      </ul>
    </div>
  );
}`}</CodeBlock>
        <p>The page as written renders one assignment:</p>
        <LiveDemo
          name="Assignments"
          file="app/(kambaz)/courses/[cid]/assignments/page.tsx"
        >
          <AssignmentsStep params={Promise.resolve({ cid: "1234" })} />
        </LiveDemo>
        <p>
          Expected result (plain HTML prototype — styling comes in{" "}
          <ChapterLink to={2} />):
        </p>
        <LiveDemo
          name="AssignmentsDemo"
          file="app/book/ch1/embeds/AssignmentsDemo.tsx"
        >
          <AssignmentsDemo />
        </LiveDemo>
      </Section>

      <Section
        level={3}
        id="sec-1-4-8"
        title="1.4.8 Assignment Editor Screen (On Your Own)"
      >
        <p>
          Clicking an assignment title opens the Assignment Editor at{" "}
          <code>app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx</code>.
          Faculty edit the assignment&apos;s details there. The polished target
          is below; this chapter only needs a plain HTML form. Start from the
          stub (name, description, points), then complete the rest on your own.
          Use the ids listed so later chapters and graders can find the fields.
        </p>
        <BookFigure
          id="fig-1.4.8a"
          src="/images/book/kambaz/assignment-editor.png"
          alt="Target Kambaz Assignment Editor screen"
          caption="Figure 1.4.8a — Assignment Editor"
        />
        <CodeBlock
          language="tsx"
          name="AssignmentEditor"
          file="app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx"
        >{`export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" />
      <br />
      <br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
      </textarea>
      <br />
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>
          {/* Complete on your own — see checklist below */}
        </tbody>
      </table>
    </div>
  );
}`}</CodeBlock>
        <p>
          <strong>Complete on your own</strong>{" "}— add these controls (with{" "}
          <code>htmlFor</code>/<code>id</code>{" "}pairs):
        </p>
        <ul>
          <li>
            Assignment Group <code>select</code>{" "}— id <code>wd-group</code>{" "}
            (options ASSIGNMENTS, QUIZZES, EXAMS, PROJECT)
          </li>
          <li>
            Display Grade as <code>select</code>{" "}— id{" "}
            <code>wd-display-grade-as</code>
          </li>
          <li>
            Submission Type <code>select</code>{" "}— id{" "}
            <code>wd-submission-type</code>
          </li>
          <li>
            Online Entry Options checkboxes — ids{" "}
            <code>wd-text-entry</code>, <code>wd-website-url</code>,{" "}
            <code>wd-media-recordings</code>,{" "}
            <code>wd-student-annotation</code>, <code>wd-file-upload</code>
          </li>
          <li>
            Assign section — Assign to (<code>wd-assign-to</code>), Due (
            <code>wd-due-date</code>), Available from (
            <code>wd-available-from</code>), Until (
            <code>wd-available-until</code>)
          </li>
          <li>
            Cancel and Save links back to the assignments list — ids{" "}
            <code>wd-cancel</code>{" "}and <code>wd-save</code>
          </li>
        </ul>
        <p>
          Label behavior must work the way Lab 1 forms do:
        </p>
        <ul>
          <li>
            Clicking a label next to or above a text field focuses that field.
          </li>
          <li>
            Clicking a label next to a checkbox toggles the checkbox.
          </li>
          <li>
            Clicking a label above a date input focuses the date field.
          </li>
        </ul>
        <p>
          For now every assignment can show the same editor content — link each
          title to <code>/courses/[cid]/assignments/[aid]</code>. Later chapters
          will load details for a specific <code>aid</code>. The editor below
          is a labeled form for points, dates, and description — clicking A1
          should open it, and Cancel/Save should return to the assignments
          list.
        </p>
        <LiveDemo
          name="AssignmentEditorDemo"
          file="app/book/ch1/embeds/AssignmentEditorDemo.tsx"
        >
          <AssignmentEditorDemo />
        </LiveDemo>
      </Section>

      <Section level={3} id="sec-1-4-9" title="1.4.9 Exercises">
        <p>
          Use this checklist to confirm the Kambaz prototype covers every
          screen in <SectionLink to="1.4" />. Each item points back to the
          section where you built the worked example. Build the screens in
          order as you read — this list is for checking coverage, not a
          substitute for the walkthroughs. Assignments and the Assignment
          Editor stay On your own: match the ids and interactive demos in those
          sections.
        </p>
        <ol>
          <li>
            Create the Kambaz landing page in{" "}
            <code>app/(kambaz)/page.tsx</code>{" "}with id{" "}
            <code>wd-kambaz</code>{" "}and an <code>h1</code>{" "}heading (
            <SectionLink to="1.4.1" />
            ).
          </li>
          <li>
            Remove any leftover root <code>app/page.tsx</code>{" "}and ensure the
            Kambaz folder is named <code>(kambaz)</code>{" "}with parentheses so it
            is a route group (<SectionLink to="1.4.1" />).
          </li>
          <li>
            Update <code>app/labs/TOC.tsx</code>{" "}and{" "}
            <code>app/labs/page.tsx</code>{" "}with a{" "}
            <code>Link</code>{" "}to <code>/</code>{" "}and id{" "}
            <code>wd-kambaz-link</code>{" "}(<SectionLink to="1.4.1" />).
          </li>
          <li>
            Create Sign in in{" "}
            <code>app/(kambaz)/account/signin/page.tsx</code>{" "}(
            <SectionLink to="1.4.2.1" />
            ).
          </li>
          <li>
            Redirect <code>app/(kambaz)/account/page.tsx</code>{" "}and{" "}
            <code>app/(kambaz)/page.tsx</code>{" "}to{" "}
            <code>/account/signin</code>{" "}(<SectionLink to="1.4.2" />).
          </li>
          <li>
            Implement Sign up in{" "}
            <code>app/(kambaz)/account/signup/page.tsx</code>{" "}(
            <SectionLink to="1.4.2.2" />
            ).
          </li>
          <li>
            Create Profile in{" "}
            <code>app/(kambaz)/account/profile/page.tsx</code>{" "}with date, email,
            and role <code>select</code>{" "}(<SectionLink to="1.4.2.3" />).
          </li>
          <li>
            Build <code>app/(kambaz)/account/Navigation.tsx</code>{" "}and wrap
            account routes in{" "}
            <code>app/(kambaz)/account/layout.tsx</code>{" "}(nav left,{" "}
            <code>children</code>{" "}right) (<SectionLink to="1.4.2.4" />).
          </li>
          <li>
            Extract <code>CourseCard</code>{" "}and implement the Dashboard in{" "}
            <code>app/(kambaz)/dashboard/page.tsx</code>{" "}with at least three
            cards linking to <code>/courses/[cid]/home</code>{" "}(
            <SectionLink to="1.4.3" />
            ).
          </li>
          <li>
            Create <code>app/(kambaz)/Navigation.tsx</code>{" "}and{" "}
            <code>app/(kambaz)/layout.tsx</code>{" "}(Kambaz Navigation left,{" "}
            <code>children</code>{" "}right). Point Sign in (
            <code>wd-signin-btn</code>) at <code>/dashboard</code>{" "}(
            <SectionLink to="1.4.3.1" />
            ).
          </li>
          <li>
            Implement <code>app/not-found.tsx</code>{" "}so Calendar and Inbox use
            it with a link back to the Dashboard (
            <SectionLink to="1.4.3.2" />
            ).
          </li>
          <li>
            Add Course Navigation and{" "}
            <code>app/(kambaz)/courses/[cid]/layout.tsx</code>. Include
            placeholder pages for Piazza, Zoom, Quizzes, Grades, and People (
            <SectionLink to="1.4.4" />
            ).
          </li>
          <li>
            Create <code>Module</code>{" "}and <code>Lesson</code>, then the
            Modules page with nested weeks, lessons, and content items (
            <SectionLink to="1.4.5" />
            ).
          </li>
          <li>
            Build Course Status and assemble Home (Modules plus Status). Delete
            any leftover <code>page.tsx</code>{" "}directly under{" "}
            <code>courses/[cid]/</code>{" "}(<SectionLink to="1.4.6" />).
          </li>
          <li>
            Build the Assignments screen (
            <SectionLink to="1.4.7" />
            ).
          </li>
          <li>
            Build the Assignment Editor screen (
            <SectionLink to="1.4.8" />
            ).
          </li>
        </ol>
      </Section>
    </>
  );
}
