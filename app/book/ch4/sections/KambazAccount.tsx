import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import { OnYourOwn, WithAI } from "../../components/Practice";
import NestedExerciseList from "../../components/NestedExerciseList";
import { CH4_KAMBAZ_EXERCISES } from "../../exercise-lists/catalogs";
import Link from "next/link";

export default function KambazAccount() {
  return (
    <>
      <Section
        level={3}
        id="sec-4-10-5"
        title="4.10.5 Account Screens"
      >
        <p>
          The Account screens provide users access to their personal
          information and all related data such as courses they are
          enrolled in and courses they might be teaching. Users use the
          Sign in screen to identify themselves and access their Profile
          screen to view their personal information. This section
          describes refactoring the Sign in and Profile screens to
          confirm a user&apos;s identity and display their personal
          information. Account Navigation should hide Sign in and Sign
          up once someone is signed in, and hide Profile when nobody is.
        </p>
        <p>
          Put the current user in React Context, wrapped around the
          Kambaz layout, so Dashboard, Account, and Profile all read the
          same value. We could have used Zustand here as well — and we
          will for courses and modules — but who is signed in changes
          rarely, so Context is a fair fit, and it lets you practice the
          provider you already built in the lab. Local{" "}
          <code>useState</code>{" "}plus Zustand for everything shared
          would have worked, and would even have been simpler. Keep{" "}
          <code>currentUser</code>{" "}in{" "}
          <code>AccountContext</code>{" "}and leave the course and module
          lists in Zustand.
        </p>

        <Section
          level={3}
          id="sec-4-10-5-1"
          title="4.10.5.1 Account Context"
        >
          <p>
            Implement an account context to keep track of the currently
            signed-in user and share it across the entire application.
            The pattern is a context, a provider that holds{" "}
            <code>currentUser</code>{" "}in <code>useState</code>, and a
            hook that throws if you forget the provider — the same shape
            as the lab counter in <SectionLink to="4.4" />. Seed the
            type from <code>users.json</code>{" "}so the signed-in object
            has the same fields the Profile form will display. To
            practice the context, create{" "}
            <code>app/(kambaz)/account/AccountContext.tsx</code>{" "}as
            shown below. Confirm the file compiles and that{" "}
            <code>currentUser</code>{" "}starts as{" "}
            <code>null</code>{" "}until someone signs in.
          </p>
          <CodeBlock
            language="tsx"
            name="AccountContext"
            file="app/(kambaz)/account/AccountContext.tsx"
          >{`"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import usersJson from "../database/users.json";

export type User = (typeof usersJson)[number];

type AccountContextValue = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  return (
    <AccountContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  const value = useContext(AccountContext);
  if (!value) {
    throw new Error("useAccountContext must be used inside AccountProvider");
  }
  return value;
}`}</CodeBlock>
          <p>
            <code>setCurrentUser</code>{" "}is the only writer. Sign in
            will pass a user from <code>users.json</code>. Sign out will
            pass <code>null</code>. The hook throws if a screen calls it
            outside the provider so you notice a missing wrap immediately
            instead of reading a silent{" "}
            <code>null</code>.
          </p>
          <p>
            Wrap the Kambaz layout so every Kambaz screen sits inside the
            provider. Import the provider and render it around the
            existing navigation and main offset. The layout can stay a
            Server Component; it just renders the client{" "}
            <code>AccountProvider</code>. Confirm Sign in, Dashboard,
            and Profile can all call{" "}
            <code>useAccountContext</code>{" "}without throwing:
          </p>
          <CodeBlock
            language="tsx"
            name="KambazLayout"
            file="app/(kambaz)/layout.tsx"
          >{`import { AccountProvider } from "./account/AccountContext";

export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AccountProvider>
      <div id="wd-kambaz" className="font-sans">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">{children}</div>
      </div>
    </AccountProvider>
  );
}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-4-10-5-2"
          title="4.10.5.2 Sign in"
        >
          <p>
            Refactor the Sign in screen by adding a{" "}
            <code>credentials</code>{" "}state variable for users to enter
            their username and password. Convert the page to a Client
            Component so the fields can be controlled and the click
            handler can talk to the browser. When users click Sign in,
            search <code>users.json</code>{" "}for a user whose username
            and password match. If there is a user that matches, store
            it in the account context by calling{" "}
            <code>setCurrentUser(user)</code>. Ignore the sign-in
            attempt if there is no match — do not navigate and do not
            write a user. After signing in, navigate to the Dashboard.
            In a click handler use the router, not the server{" "}
            <code>redirect</code>{" "}helper. To practice Sign in, update{" "}
            <code>app/(kambaz)/account/signin/page.tsx</code>{" "}as shown
            below. Confirm that signing in navigates to the Dashboard
            only if valid credentials are used.
          </p>
          <CodeBlock
            language="tsx"
            name="Signin"
            file="app/(kambaz)/account/signin/page.tsx"
          >{`"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as db from "../../database";
import { useAccountContext } from "../AccountContext";

export default function Signin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { setCurrentUser } = useAccountContext();
  const router = useRouter();

  const signin = () => {
    const user = db.users.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password,
    );
    if (!user) return;
    setCurrentUser(user);
    router.push("/dashboard");
  };

  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input
        placeholder="username"
        id="wd-username"
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
      />
      <input
        placeholder="password"
        type="password"
        id="wd-password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      <button type="button" onClick={signin} id="wd-signin-btn">
        Sign in
      </button>
      <Link href="/account/signup" id="wd-signup-link">
        Sign up
      </Link>
    </div>
  );
}`}</CodeBlock>
          <p>
            Both fields use the object-spread update from{" "}
            <SectionLink to="4.2.8" />{" "}so typing a username does not
            erase the password. The password input keeps{" "}
            <code>type=&quot;password&quot;</code>{" "}so the value is
            hidden as you type. Try a user from{" "}
            <code>users.json</code> — for example{" "}
            <code>iron_man</code>{" "}/ <code>stark123</code>. A wrong
            password should stay on Sign in. A match should land on
            Dashboard. Open{" "}
            <Link href="/account/signin">/account/signin</Link>{" "}and
            confirm both paths before you filter the dashboard by
            enrollment.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-10-5-3"
          title="4.10.5.3 Dashboard by Enrollment"
        >
          <p>
            Now that the current user is stored in{" "}
            <code>AccountContext</code>, the Dashboard can filter the
            courses and only display the courses in which that user is
            enrolled. Refactor Dashboard so that it only shows the
            courses the current user is enrolled in. Sign in as
            different users and confirm that the Dashboard only displays
            the courses a user is enrolled in. Note that new courses
            added will not render now since enrollments would also need
            to be modified. This will be addressed in{" "}
            <SectionLink to="4.10.7" />{" "}and in later chapters. If
            nobody is signed in, keep showing every course so the
            Add / Edit / Delete work in{" "}
            <SectionLink to="4.10.2" />{" "}still has something to click:
          </p>
          <CodeBlock language="tsx">{`const { currentUser } = useAccountContext();
const visibleCourses = currentUser
  ? courses.filter((c) =>
      db.enrollments.some(
        (enrollment) =>
          enrollment.user === currentUser._id && enrollment.course === c._id,
      ),
    )
  : courses;`}</CodeBlock>
          <p>
            The filter uses the same{" "}
            <code>enrollments.some</code>{" "}pattern{" "}
            <SectionLink to="3.9.9" />{" "}used on the People table: keep
            a course when there is an enrollment whose{" "}
            <code>user</code>{" "}is the signed-in id and whose{" "}
            <code>course</code>{" "}is that course&apos;s{" "}
            <code>_id</code>. Map{" "}
            <code>visibleCourses</code>{" "}instead of the full store
            array so Add still writes every course but the grid only
            shows the enrolled subset. Sign in as{" "}
            <code>iron_man</code>{" "}and confirm the published list
            shrinks to that student&apos;s courses. Sign in as{" "}
            <code>nick_fury</code>{" "}/ <code>fury123</code>{" "}and
            compare. A course you Add while signed in will not appear
            until you enroll in it — that is the{" "}
            <SectionLink to="4.10.7" />{" "}exercise.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-10-5-4"
          title="4.10.5.4 Account Navigation"
        >
          <p>
            Users can use the Account Navigation sidebar to navigate
            between Sign in, Sign up, and Profile, but not all of those
            screens should be available depending on whether a user is
            logged in. Reimplement the Account Navigation sidebar so
            that it hides the Sign in and Sign up links if a user is
            already signed in, and hides the Profile link if a user is
            not yet signed in. If <code>currentUser</code>{" "}is set, the
            sidebar should list only Profile. If it is{" "}
            <code>null</code>, list Signin and Signup. To practice the
            sidebar, update{" "}
            <code>app/(kambaz)/account/Navigation.tsx</code>{" "}as shown
            below. Confirm the links change after a successful sign in
            and again after sign out.
          </p>
          <CodeBlock
            language="tsx"
            name="AccountNavigation"
            file="app/(kambaz)/account/Navigation.tsx"
          >{`"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccountContext } from "./AccountContext";

export default function AccountNavigation() {
  const { currentUser } = useAccountContext();
  const links = currentUser
    ? (["profile"] as const)
    : (["signin", "signup"] as const);
  const pathname = usePathname() ?? "";
  return (
    <div id="wd-account-navigation">
      {links.map((link) => (
        <span key={link}>
          <Link href={\`/account/\${link}\`}>
            {link === "signin"
              ? "Signin"
              : link === "signup"
                ? "Signup"
                : "Profile"}
          </Link>
          <br />
        </span>
      ))}
    </div>
  );
}`}</CodeBlock>
          <p>
            Also refactor the Account landing screen so that the default
            screen is Sign in if no one is signed in yet, and Profile if
            someone is already signed in. Confirm that the Account
            Navigation links are Sign in and Sign up if no one is signed
            in yet, and Profile if someone is already signed in. Also
            confirm that clicking the Account link in the Kambaz
            Navigation sidebar displays the Sign in screen if no one is
            signed in yet, and displays the Profile screen if someone is
            already signed in.
          </p>
          <CodeBlock
            language="tsx"
            name="AccountPage"
            file="app/(kambaz)/account/page.tsx"
          >{`"use client";

import { redirect } from "next/navigation";
import { useAccountContext } from "./AccountContext";

export default function AccountPage() {
  const { currentUser } = useAccountContext();
  if (!currentUser) {
    redirect("/account/signin");
  } else {
    redirect("/account/profile");
  }
}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-4-10-5-5"
          title="4.10.5.5 Profile"
        >
          <p>
            The Profile screen displays the current user&apos;s personal
            information. Refactor Profile to retrieve the current user
            from <code>AccountContext</code>. If there is no{" "}
            <code>currentUser</code>, the screen should navigate to Sign
            in. If there is a <code>currentUser</code>, the screen
            should populate a form with the user&apos;s information. Copy
            that user into a local <code>profile</code>{" "}state in{" "}
            <code>useEffect</code>{" "}so the form can edit fields without
            writing the context on every keystroke. If the current user
            clicks Sign out, the current user should be set to{" "}
            <code>null</code>{" "}and the app should navigate to Sign in.
            To practice Profile, update{" "}
            <code>app/(kambaz)/account/profile/page.tsx</code>{" "}as shown
            below. Confirm the form fills after a successful sign in,
            and confirm Sign out returns you to Sign in with Account
            Navigation showing Signin and Signup again.
          </p>
          <CodeBlock
            language="tsx"
            name="Profile"
            file="app/(kambaz)/account/profile/page.tsx"
          >{`"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccountContext, type User } from "../AccountContext";

export default function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const { currentUser, setCurrentUser } = useAccountContext();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/account/signin");
      return;
    }
    setProfile(currentUser);
  }, [currentUser, router]);

  const signout = () => {
    setCurrentUser(null);
    router.push("/account/signin");
  };

  if (!profile) return null;
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <input
        id="wd-username"
        value={profile.username}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
      />
      {/* password, firstName, lastName, email, role */}
      <button type="button" onClick={signout} id="wd-signout-btn">
        Sign out
      </button>
    </div>
  );
}`}</CodeBlock>
          <p>
            The sample shows the username field and Sign out; bind the
            remaining inputs the same way — password, first name, last
            name, email, and a role select with User, Admin, Faculty,
            and Student — each spreading{" "}
            <code>profile</code>{" "}and overwriting one property. Confirm
            the form fills with <code>iron_man</code>&apos;s name after
            a successful sign in. Confirm that editing a field does not
            change the name in Account Navigation until you decide to
            write the context later. Confirm Sign out clears{" "}
            <code>currentUser</code>{" "}and that visiting Profile while
            signed out sends you back to Sign in.
          </p>
          <OnYourOwn>
            Bind the remaining profile fields from{" "}
            <code>app/(kambaz)/account/profile/page.tsx</code>{" "}so every
            input shows the signed-in user.
          </OnYourOwn>
          <WithAI
            prompt={`In app/(kambaz)/account/profile/page.tsx, keep any extra field I added. Ensure inputs for username, password, firstName, lastName, email, and role are controlled from profile state. Do not rename my personal field.`}
          >
            Ask the assistant to fill any sample fields you skipped:
          </WithAI>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-4-10-6"
        title="4.10.6 Assignments (On Your Own)"
      >
        <p>
          After completing the Dashboard, Courses, and Modules, refactor
          the Assignments and Assignment Editor screens so that faculty
          can create, update, and remove assignments as described in
          this section. Students can still view assignments. Follow the
          same path you used for modules: seed a Zustand store from{" "}
          <code>assignments.json</code>, filter the list by the current{" "}
          <code>cid</code>, and let the editor create or update a row
          before navigating back to the list. Use an{" "}
          <code>assignmentsStore</code>{" "}the same way you used{" "}
          <code>modulesStore</code>. The list target looks like{" "}
          <FigureLink to="4.10.6" />; the editor looks like{" "}
          <FigureLink to="4.10.6b" />:
        </p>
        <BookFigure
          id="fig-4.10.6"
          src="/images/book/ch4/figures/fig-4-10-6-assignments.png"
          alt="Assignments screen with search, + Assignment, and a list of assignments"
          caption="Figure 4.10.6 — Assignments"
        />
        <BookFigure
          id="fig-4.10.6b"
          src="/images/book/ch4/figures/fig-4-10-6b-assignment-editor.png"
          alt="Assignment editor with name, description, points, and dates"
          caption="Figure 4.10.6b — Creating and editing assignments"
        />

        <Section
          level={3}
          id="sec-4-10-6-1"
          title="4.10.6.1 Assignments Store"
        >
          <p>
            Following <code>modulesStore.ts</code>{" "}as an example, create{" "}
            <code>app/(kambaz)/store/assignmentsStore.ts</code>{" "}
            initialized with the assignments from{" "}
            <code>assignments.json</code>. Implement store functions
            such as <code>addAssignment</code>,{" "}
            <code>deleteAssignment</code>,{" "}
            <code>updateAssignment</code>, and any other functions you
            need — for example a helper that finds one assignment by{" "}
            <code>_id</code>{" "}when the editor opens. Generate new ids
            with <code>crypto.randomUUID()</code>{" "}the same way the
            courses and modules stores do. Confirm the store compiles
            and that the Assignments page can filter the array by the
            current course before you wire Save and Delete.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-10-6-2"
          title="4.10.6.2 Creating an Assignment"
        >
          <p>
            Refactor your Assignments screen so that creating a row
            goes through the editor instead of a dialog. Clicking the +
            Assignment button should navigate to the Assignment Editor,
            not append an empty title on the list. The editor should
            allow editing at least the name, description, points, due
            date, available-from date, and available-until date — the
            same fields <SectionLink to="3.9.8.1" />{" "}already displayed
            from JSON. Clicking Save creates the new assignment, adds
            it to the assignments array in the Zustand store, and
            navigates back to the Assignments screen, which must now
            contain the newly created assignment. Clicking Cancel does
            not create the new assignment and navigates back to the
            Assignments screen without the new row. Confirm in the
            browser that Save increases the list by one and that Cancel
            leaves the list unchanged.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-10-6-3"
          title="4.10.6.3 Editing an Assignment"
        >
          <p>
            Refactor the Assignment Editor so that clicking an
            assignment on the list navigates to the editor and displays
            that assignment&apos;s name, description, points, due date,
            available-from date, and available-until date. The editor
            should allow editing those same fields for the corresponding
            assignment. Clicking Save updates the assignment&apos;s
            fields in the store and navigates back to the Assignments
            screen with the updated values. Clicking Cancel does not
            update the assignment and navigates back to the list, which
            shows the assignments unchanged. Confirm you can open two
            different assignments and see different titles, then change
            one title, Save, and see only that row update.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-10-6-4"
          title="4.10.6.4 Deleting an Assignment"
        >
          <p>
            Refactor the Assignments list using the modules trash can
            as a model: add a Delete button or trash icon to the right
            of each assignment. Clicking Delete on an assignment should
            pop up a dialog asking whether you are sure you want to
            remove the assignment. Clicking Yes or Ok dismisses the
            dialog, removes the assignment from the store, and updates
            the Assignments screen without the deleted row. Clicking No
            or Cancel dismisses the dialog without removing the
            assignment. Confirm a delete that you confirm removes the
            row and that a delete you cancel leaves the title in place.
            Filter every list and every editor save by the current{" "}
            <code>cid</code>{" "}so an assignment created in RS101 does
            not appear in RS102.
          </p>
        </Section>
        <OnYourOwn>
          Implement the store, the editor save/cancel path, and the
          confirm-on-delete dialog. Filter by the current{" "}
          <code>cid</code>.
        </OnYourOwn>
        <WithAI
          prompt={`Create app/(kambaz)/store/assignmentsStore.ts seeded from assignments.json with addAssignment, updateAssignment, and deleteAssignment. Keep any extra fields I added. Wire + Assignment to navigate to the editor. Do not overwrite my personal assignment fields.`}
        >
          After your own assignment CRUD, you can ask the assistant to add
          a sample store:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-10-7"
        title="4.10.7 Enrollments (On Your Own)"
      >
        <p>
          Currently the Dashboard allows faculty to Add, Delete, Edit,
          and Update courses, as well as navigate to the course content.
          Other users currently only see the courses they are enrolled
          in. Refactor Dashboard so that there is a new blue Enrollments
          button at the top right of the screen. Clicking Enrollments
          displays all the courses. Clicking it again only shows the
          courses the user is enrolled in. Implement{" "}
          <code>app/(kambaz)/store/enrollmentsStore.ts</code>{" "}seeded
          from <code>enrollments.json</code>{" "}with{" "}
          <code>enroll</code>{" "}and <code>unenroll</code>{" "}functions,
          then wire the Dashboard and the People table to that store.
        </p>
        <p>
          Courses the user is enrolled in should provide a red Unenroll
          button, and courses the user is not enrolled in should provide
          a green Enroll button. When a user clicks Unenroll or Enroll,
          the enrollment status must actually change and the buttons
          should toggle to reflect the new state. If a user signs out
          and then signs in again, the enrollment choices should still
          persist for this session. If a user refreshes or reloads the
          page, the new enrollments are lost — that is expected until a
          later chapter persists them on a server. Protect the route to
          a course so that only users enrolled in that course can
          navigate to it, and stay on the Dashboard screen otherwise.
        </p>
        <OnYourOwn>
          Create <code>app/(kambaz)/store/enrollmentsStore.ts</code>{" "}
          seeded from <code>enrollments.json</code>. Wire the
          Enrollments toggle and the People table to that store.
        </OnYourOwn>
        <WithAI
          prompt={`Create app/(kambaz)/store/enrollmentsStore.ts seeded from enrollments.json with enroll and unenroll. In the Dashboard, keep any extra button I added and add a sample button id="wd-enrollments-toggle" that flips a showAllCourses flag. Do not remove my extra button.`}
        >
          Ask the assistant to add a sample enrollments toggle after your
          own extra control:
        </WithAI>
      </Section>

      <Section level={3} id="sec-4-11" title="4.11 Exercises">
        <p>
          Use this checklist to confirm the stateful Kambaz prototype
          covers every screen in <SectionLink to="4.10" />. The labs
          taught events, controlled fields, Context, and Zustand one
          idea at a time; these items are those ideas applied to the
          application you keep building. Each item points back to the
          section where you wired the worked example. Build in order as
          you read — this list is for checking coverage, not a
          substitute for the walkthroughs. Create the store, click the
          buttons, and confirm the browser before you tick a line.
          Assignments and enrollments stay <strong>On your own</strong>: match the ids,
          figures, and steps in those sections. Each screen is listed
          once, with Lab, <strong>On your own</strong>, and{" "}
          <strong>With AI</strong>{" "}nested as a/b/c when those blocks
          exist.
        </p>
        <NestedExerciseList groups={CH4_KAMBAZ_EXERCISES} />
      </Section>
    </>
  );
}
