import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import LocalUrl from "../../components/LocalUrl";
import OfficialLink from "../../components/OfficialLink";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Dashboard from "@/app/(kambaz)/dashboard/page";
import Link from "next/link";
import KambazModules from "./KambazModules";
import KambazAccount from "./KambazAccount";

export default function KambazState() {
  return (
    <Section
      id="sec-4-10"
      title="4.10 Adding State to the Kambaz User Interface"
    >
      <p>
        The current Kambaz implementation reads data from a collection of
        objects we combined into a database in{" "}
        <SectionLink to="3.9.2" />{" "}—{" "}
        <code>courses</code>, <code>modules</code>,{" "}
        <code>assignments</code>, <code>users</code>, and{" "}
        <code>enrollments</code>. Those arrays are dynamically rendered in
        Dashboard, Home, Modules, Assignments, and People. The data is
        still static, and the Kambaz implementation is still a set of
        functions that transform that snapshot into a corresponding user
        interface. Change a title in JSON, reload, and the screen changes
        with it, without rewriting a card by hand. Because the files do
        not change while the app runs, Add, Edit, and Delete do nothing,
        and a module you create on Modules never shows up on Home. Each
        screen is reading a fixed snapshot. In this section we will use
        the component and application state management skills from the
        labs — events,{" "}
        <OfficialLink href="https://react.dev/reference/react/useState">
          useState
        </OfficialLink>
        ,{" "}
        <OfficialLink href="https://react.dev/learn/passing-data-deeply-with-context">
          React Context
        </OfficialLink>
        , and{" "}
        <OfficialLink href="https://zustand.docs.pmnd.rs/">
          Zustand
        </OfficialLink>{" "}
        — to refactor Kambaz so we can create new courses, modules, and
        assignments, then see those changes on every screen that reads the
        same lists.
      </p>
      <p>
        <ChapterLink to={3} />{" "}made Kambaz <strong>data driven</strong>:
        the dashboard, modules, and assignments are no longer static
        markup you copy and paste for every course. You iterate over a
        data structure such as arrays of courses, modules, or lessons, and
        the UI is <em>computed</em> from that data. State is how that
        computed UI can change over time — the same loops and maps, but
        the arrays can grow, shrink, and rename as the user interacts with
        the application. The labs gave you a chance to learn those skills
        one at a time, and now they go together so you can actually build
        something: a Kambaz that changes as the user works. Put these
        arrays in Zustand so any Client Component can subscribe without a
        provider around the tree. A coverage checklist is in{" "}
        <SectionLink to="4.11" /> — work through each screen as you read,
        then use the list to confirm you did everything. It is a recap,
        not a reason to skip ahead.
      </p>
      <p>
        As discussed in the labs, there are several options for
        maintaining state, such as <code>useState</code>, Context,
        Zustand, and Redux. It is important to understand where each is
        appropriate, both in general and in Kambaz.
      </p>
      <p>
        <code>useState</code>{" "}belongs in the component that owns a
        value, or a parent that shares it with a few children. A counter,
        a form draft, a dialog that is open or closed — those stay local.
        In Kambaz that is the course you are typing before Add, the
        hamburger that hides Course Navigation, the module name in the
        editor: UI that one screen cares about, not the shared lists. If
        you put the published courses array in Dashboard{" "}
        <code>useState</code>{" "}alone, Add, Edit, and Delete will work on
        that page and nowhere else. Home and the course layout would still
        be reading the JSON file, so a course you just created would have
        no name in the breadcrumb.
      </p>
      <p>
        Context lets a parent publish a value that any descendant can
        read without passing props through every layer. That fits a value
        that changes rarely, such as a theme or who is signed in. It is a
        poor place for courses and modules. Those arrays change whenever
        the user adds, edits, or deletes, and when a Context value
        changes, every component that reads it re-renders. Typing a new
        course on Dashboard would refresh Home, Modules, and anything else
        subscribed to that context.
      </p>
      <p>
        We will use Context in Kambaz for the signed-in user. Who is
        signed in changes at Sign in and Sign out, not while someone types
        a course name, so wrapping the Kambaz layout in a Provider is a
        reasonable cost. Sign in, Profile, Dashboard, and Account
        Navigation all sit under that layout, so they can read{" "}
        <code>currentUser</code>{" "}without passing it as a prop. We will
        not put courses or modules in that same context.
      </p>
      <p>
        We could have put <code>currentUser</code>{" "}in Zustand too. Local{" "}
        <code>useState</code>{" "}plus Zustand for everything shared would
        have worked — it would even have been simpler, with no Provider to
        wrap. We are using both so you practice each on a use that fits:
        Context for a stable value the tree needs, Zustand for the lists
        many screens mutate.
      </p>
      <p>
        Zustand is an external store you import as a hook — no Provider
        to wrap the tree. Components subscribe to the slices they need,
        so Dashboard and Home can add, edit, and delete the same courses
        array without living under one parent. That is how Kambaz will
        hold courses and modules. You could instead lift the courses
        array to a parent of both Dashboard and the course layout, but
        that parent is already the Kambaz layout, and stuffing every
        shared list into layout props quickly becomes unreadable. A store
        keeps the arrays next to the functions that change them.
      </p>
      <p>
        Redux Toolkit solves the same problem Zustand does — shared
        application state — but it takes more pieces to wire together:
        slices, a Provider, and <code>dispatch</code>. We are skipping
        Redux for Kambaz. It is mentioned here only for historical
        purposes: many existing apps still use it, and the lab counter is
        enough to read that code. Zustand already holds the lists.
        Context already holds who is signed in.
      </p>
      <table className="mb-4 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300">
            <th className="p-2">Tool</th>
            <th className="p-2">Use</th>
            <th className="p-2">Don&apos;t use</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-neutral-200">
            <td className="p-2">
              <code>useState</code>
            </td>
            <td className="p-2">One component or a small tree</td>
            <td className="p-2">
              Courses that Dashboard and Home both mutate
            </td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="p-2">Context</td>
            <td className="p-2">
              Signed-in user (changes at sign-in / sign-out)
            </td>
            <td className="p-2">
              Courses, modules, or any list that changes often
            </td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="p-2">Zustand</td>
            <td className="p-2">Kambaz courses and modules</td>
            <td className="p-2">
              Replacing <code>useState</code>{" "}on a single counter
            </td>
          </tr>
          <tr>
            <td className="p-2">Redux Toolkit</td>
            <td className="p-2">Historical literacy — skip for Kambaz</td>
            <td className="p-2">
              Porting courses and modules a second time
            </td>
          </tr>
        </tbody>
      </table>

      <Section
        level={3}
        id="sec-4-10-1"
        title="4.10.1 A Courses Store"
      >
        <p>
          The current Dashboard implementation renders a static array of
          courses. This section illustrates how to refactor Dashboard to
          implement CRUD operations — creating new courses, retrieving the
          published list, updating existing titles and descriptions, and
          deleting courses — and then share that same array with every
          other Kambaz screen. If you only converted the{" "}
          <code>courses</code>{" "}constant into a{" "}
          <code>useState</code>{" "}variable inside Dashboard, Add, Edit,
          and Delete would work on that page. The Courses layout, Home,
          and the breadcrumb would still import JSON, so a course you
          just created would not have a name when you opened it. To share
          the list we need either a parent that owns the array for both
          Dashboard and Courses, or a store that any Client Component can
          import. We will use Zustand. The functions below share the
          list without a provider around the tree.
        </p>
        <p>
          Start the store from the same JSON{" "}
          <SectionLink to="3.9.2" />{" "}introduced, then export functions
          that add, update, and delete. Those functions are the same
          operations you would have written next to Dashboard{" "}
          <code>useState</code> — append a copy with a new{" "}
          <code>_id</code>, filter one id out, map one id to a
          replacement — adapted to Zustand&apos;s{" "}
          <code>set</code>{" "}updater. Generate a new{" "}
          <code>_id</code>{" "}with <code>crypto.randomUUID()</code>{" "}so
          you do not need an extra library. To practice creating the
          courses store, create{" "}
          <code>app/(kambaz)/store/coursesStore.ts</code>{" "}as shown
          below. Confirm the file compiles and that the initial{" "}
          <code>courses</code>{" "}array is the same seed you already
          rendered on the data-driven dashboard.
        </p>
        <CodeBlock
          language="tsx"
          name="coursesStore"
          file="app/(kambaz)/store/coursesStore.ts"
        >{`"use client";

import { create } from "zustand";
import coursesJson from "../database/courses.json";

export type Course = (typeof coursesJson)[number];

const emptyCourse: Course = {
  _id: "0",
  name: "New Course",
  number: "New Number",
  startDate: "2023-09-10",
  endDate: "2023-12-15",
  department: "D123",
  credits: 4,
  description: "New Description",
  image: "/images/reactjs.jpg",
};

type CoursesStore = {
  courses: Course[];
  addCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  updateCourse: (course: Course) => void;
};

export const useCoursesStore = create<CoursesStore>((set) => ({
  courses: coursesJson,
  addCourse: (course) =>
    set((state) => ({
      courses: [
        ...state.courses,
        { ...emptyCourse, ...course, _id: crypto.randomUUID() },
      ],
    })),
  deleteCourse: (courseId) =>
    set((state) => ({
      courses: state.courses.filter((course) => course._id !== courseId),
    })),
  updateCourse: (course) =>
    set((state) => ({
      courses: state.courses.map((c) => (c._id === course._id ? course : c)),
    })),
}));

export { emptyCourse };`}</CodeBlock>
        <p>
          <code>emptyCourse</code>{" "}is the draft you will bind to the
          New Course form: a placeholder name, number, dates,
          description, and the same sample image the JSON courses already
          use. <code>addCourse</code>{" "}spreads that draft, then
          overrides <code>_id</code>{" "}with a unique value so two Adds
          never collide. <code>deleteCourse</code>{" "}keeps every course
          whose <code>_id</code>{" "}is not the one you passed.{" "}
          <code>updateCourse</code>{" "}replaces the course whose{" "}
          <code>_id</code>{" "}matches the draft and leaves the others
          alone. Any Client Component that calls{" "}
          <code>useCoursesStore</code>{" "}sees the same array, so the next
          section can delete the local courses mutators from Dashboard
          and call these functions instead. You do not wrap the Kambaz
          layout in a store Provider — importing the hook is enough.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-4-10-2"
        title="4.10.2 Dashboard Create, Edit, and Delete"
      >
        <p>
          Now that the courses array lives in the Zustand store, refactor
          Dashboard to use that store instead of a local courses{" "}
          <code>useState</code>. Dashboard still has to be a Client
          Component because it calls store hooks and keeps a local form
          draft. The published list comes from the store, but the form
          still needs a local <code>course</code>{" "}draft — that is
          one-screen UI state, so <code>useState</code>{" "}is enough. Add,
          Update, Edit, and Delete call store functions: Edit copies a
          card into the form, and Update writes that draft back by{" "}
          <code>_id</code>. To practice wiring the dashboard to the
          store, update{" "}
          <code>app/(kambaz)/dashboard/page.tsx</code>{" "}as shown below
          and import the store functions from{" "}
          <code>coursesStore.ts</code>. Confirm the published grid still
          renders the seeded courses before you click anything.
        </p>
        <CodeBlock
          language="tsx"
          name="Dashboard"
          file="app/(kambaz)/dashboard/page.tsx"
        >{`"use client";

import { useState } from "react";
import CourseCard from "./CourseCard";
import {
  emptyCourse,
  useCoursesStore,
  type Course,
} from "../store/coursesStore";

export default function Dashboard() {
  const courses = useCoursesStore((state) => state.courses);
  const addCourse = useCoursesStore((state) => state.addCourse);
  const deleteCourse = useCoursesStore((state) => state.deleteCourse);
  const updateCourse = useCoursesStore((state) => state.updateCourse);
  const [course, setCourse] = useState<Course>(emptyCourse);

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h5 className="flex flex-wrap items-center gap-2">
        New Course
        <button
          type="button"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          id="wd-add-new-course-click"
          onClick={() => addCourse(course)}
        >
          Add
        </button>
        <button
          type="button"
          className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
          id="wd-update-course-click"
          onClick={() => updateCourse(course)}
        >
          Update
        </button>
      </h5>
      <input
        className="mb-2 mt-2 block w-full max-w-xl rounded border border-neutral-300 px-3 py-1.5"
        value={course.name}
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
        id="wd-course-name"
      />
      <textarea
        className="mb-3 block w-full max-w-xl rounded border border-neutral-300 px-3 py-1.5"
        rows={3}
        value={course.description}
        onChange={(e) =>
          setCourse({ ...course, description: e.target.value })
        }
        id="wd-course-description"
      />
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />
      <div
        id="wd-dashboard-courses"
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {courses.map((c) => (
          <CourseCard
            key={c._id}
            {...c}
            onEdit={() => setCourse(c)}
            onDelete={() => deleteCourse(c._id)}
          />
        ))}
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The store selectors replace the old local{" "}
          <code>courses</code>{" "}array and the{" "}
          <code>setCourses</code>{" "}helpers you might have sketched first.
          <code>addCourse</code>, <code>deleteCourse</code>, and{" "}
          <code>updateCourse</code>{" "}are the store functions from{" "}
          <SectionLink to="4.10.1" />. The local{" "}
          <code>course</code>{" "}state is only the form: typing a name
          should not rewrite every card until you click Add or Update.
          The next three subsections walk through the Add form, the
          Delete button, and the Edit / Update path so you can confirm
          each control in the browser before you move on.
        </p>

        <Section
          level={3}
          id="sec-4-10-2-1"
          title="4.10.2.1 Creating New Courses"
        >
          <p>
            To create new courses, the Add button invokes{" "}
            <code>addCourse</code>{" "}with the current form draft. The
            store function copies that draft, overrides{" "}
            <code>_id</code>{" "}with <code>crypto.randomUUID()</code>, and
            appends the new course at the end of the{" "}
            <code>courses</code>{" "}array. The button does not take an
            argument in its click handler beyond the draft already in
            state —{" "}
            <code>{`onClick={() => addCourse(course)}`}</code> — so you
            do not wrap a second function that forgets to pass the
            object. Style Add as a blue Tailwind button and give it id{" "}
            <code>wd-add-new-course-click</code>{" "}so the control is
            easy to find in the document.
          </p>
          <p>
            The target Add row looks like{" "}
            <FigureLink to="4.10.2a" />. After you bind the form, it
            looks like <FigureLink to="4.10.2b" />:
          </p>
          <BookFigure
            sources={[
              {
                id: "fig-4.10.2a",
                src: "/images/book/ch4/figures/fig-4-10-2a-add-course.png",
                alt: "Dashboard heading with a New Course row and an Add button",
                caption: "Figure 4.10.2a — Creating a new course",
              },
              {
                id: "fig-4.10.2b",
                src: "/images/book/ch4/figures/fig-4-10-2b-course-form.png",
                alt: "New Course form with name and description fields",
                caption: "Figure 4.10.2b — Course name and description form",
              },
            ]}
          />
          <p>
            Convert the <code>course</code>{" "}constant into state so the
            fields can change and force a redraw of the form. Add an
            input for the course name and a textarea for the
            description, each bound to the matching property on the
            draft. At first you can set{" "}
            <code>value={"{course.name}"}</code>{" "}and{" "}
            <code>value={"{course.description}"}</code>{" "}so the fields
            show the placeholder text from{" "}
            <code>emptyCourse</code>. Then add{" "}
            <code>onChange</code>{" "}attributes that update each field
            with the same object-spread pattern as{" "}
            <SectionLink to="4.2.8" />:{" "}
            <code>{`setCourse({ ...course, name: e.target.value })`}</code>{" "}
            for the title and the same shape for{" "}
            <code>description</code>. Confirm the form shows the values
            of the course state variable as you type. Confirm you can
            type a title, click Add, and see a new card appear and the
            published count go up. Each card can keep the same sample
            image, or you can render{" "}
            <code>course.image</code>{" "}if you added image properties to{" "}
            <code>courses.json</code>{" "}in <ChapterLink to={3} />. The
            card still needs Delete and Edit, which the next two
            subsections add.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-10-2-2"
          title="4.10.2.2 Deleting a Course"
        >
          <p>
            Now implement deleting courses by adding a Delete button to
            each card. The button invokes{" "}
            <code>deleteCourse</code>{" "}and passes the{" "}
            <code>_id</code>{" "}of the course to remove. The store
            function filters that course out of the{" "}
            <code>courses</code>{" "}array and leaves the others in place.
            Use the Dashboard and{" "}
            <code>CourseCard</code>{" "}samples as an example, and confirm
            that you can remove courses. After a successful delete the
            published count decreases and the card is gone; the other
            cards keep their titles and links.
          </p>
          <p>
            The button sits inside a <code>Link</code>{" "}that navigates
            to the course Home screen, so you must call{" "}
            <code>event.preventDefault()</code>{" "}or the card navigates
            away before the course disappears. Pass the click through to{" "}
            <code>onDelete</code>{" "}so Dashboard can call{" "}
            <code>{`deleteCourse(c._id)`}</code>{" "}without the card
            importing the store. Style Delete as a red Tailwind button
            and give it id{" "}
            <code>wd-delete-course-click</code>. The Delete control
            looks like <FigureLink to="4.10.2c" />:
          </p>
          <BookFigure
            id="fig-4.10.2c"
            src="/images/book/ch4/figures/fig-4-10-2c-delete-course.png"
            alt="Course card with Go and Delete buttons"
            caption="Figure 4.10.2c — Deleting a course"
          />
          <p>
            Confirm in the browser that clicking Delete removes that
            course and does not open{" "}
            <code>/courses/…/home</code>. Confirm that clicking Go still
            navigates. If Delete navigates, the{" "}
            <code>preventDefault</code>{" "}call is missing or the handler
            is on the wrong element.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-10-2-3"
          title="4.10.2.3 Editing a Course"
        >
          <p>
            Now implement editing an existing course by adding an Edit
            button to each card. Clicking Edit should copy that card
            into the <code>course</code>{" "}form state so the name and
            description fields show the selected course. Prevent the{" "}
            <code>Link</code>&apos;s default navigation the same way
            Delete does, then call{" "}
            <code>{`setCourse(c)`}</code>. Confirm that clicking Edit on
            a course copies that course into the form.
          </p>
          <p>
            Add an Update button next to Add so the selected course can
            be written back with the values in the edited fields. Update
            calls <code>updateCourse(course)</code>, which maps over the
            store and replaces the object whose{" "}
            <code>_id</code>{" "}matches the draft. Confirm you can
            select a course, change the name and description, and click
            Update, and that the original card&apos;s title and
            description change while its{" "}
            <code>_id</code>{" "}and link stay the same. After Edit, the
            form and the card should match{" "}
            <FigureLink to="4.10.2d" />:
          </p>
          <BookFigure
            id="fig-4.10.2d"
            src="/images/book/ch4/figures/fig-4-10-2d-edit-course.png"
            alt="Course form filled from an existing course with Update, Edit, and Delete"
            caption="Figure 4.10.2d — Editing a course"
          />
          <p>
            To practice the card buttons, update{" "}
            <code>CourseCard</code>{" "}so it accepts{" "}
            <code>onEdit</code>{" "}and <code>onDelete</code>{" "}and
            wires both clicks through{" "}
            <code>preventDefault</code>. Confirm Edit fills the form
            and Delete removes the card:
          </p>
          <CodeBlock
            language="tsx"
            name="CourseCard"
            file="app/(kambaz)/dashboard/CourseCard.tsx"
          >{`"use client";

import Link from "next/link";
import Image from "next/image";

export default function CourseCard({
  _id,
  name,
  description,
  image,
  onEdit,
  onDelete,
}: {
  _id: string;
  name: string;
  description: string;
  image: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="wd-dashboard-course w-[300px] max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <Link
        href={\`/courses/\${_id}/home\`}
        className="wd-dashboard-course-link block text-neutral-900 no-underline"
      >
        {/* image, title, description */}
        <button type="button">Go</button>
        <button
          type="button"
          id="wd-edit-course-click"
          onClick={(event) => {
            event.preventDefault();
            onEdit();
          }}
        >
          Edit
        </button>
        <button
          type="button"
          id="wd-delete-course-click"
          onClick={(event) => {
            event.preventDefault();
            onDelete();
          }}
        >
          Delete
        </button>
      </Link>
    </div>
  );
}`}</CodeBlock>
          <p>
            The live dashboard below is the same component as{" "}
            <LocalUrl href="/dashboard" />. Add a course, confirm the
            published count increases, Edit a title, Update, then
            Delete. Because the array lives in Zustand, a course you add
            here is the same object the course layout will look up in{" "}
            <SectionLink to="4.10.3" /> — open the new card after Add
            and confirm the breadcrumb shows the name you typed.
          </p>
          <LiveDemo
            name="Dashboard"
            file="app/(kambaz)/dashboard/page.tsx"
            mode="styled"
          >
            <Dashboard />
          </LiveDemo>
          <OnYourOwn>
            Add controlled inputs for <code>number</code>{" "}and{" "}
            <code>startDate</code>{" "}on the Dashboard form so a new
            course can carry those fields too.
          </OnYourOwn>
          <WithAI
            prompt={`In app/(kambaz)/dashboard/page.tsx, keep any extra form fields I added. After the description textarea, add a sample controlled input id="wd-course-number" bound to course.number with the spread update pattern. Do not rename my personal fields.`}
          >
            Ask the assistant to add one extra sample course field:
          </WithAI>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-4-10-3"
        title="4.10.3 Course Navigation Toggle"
      >
        <p>
          Now that courses are declared in the Zustand store, the Courses
          layout can share them by retrieving the same array from{" "}
          <code>useCoursesStore</code>. The layout finds the course
          whose <code>_id</code>{" "}matches the{" "}
          <code>cid</code>{" "}path parameter, then renders that name in
          the heading and breadcrumb. In{" "}
          <ChapterLink to={3} />{" "}the layout imported{" "}
          <code>courses</code>{" "}from the JSON database, so a course you
          created on Dashboard could not appear here. Refactor{" "}
          <code>app/(kambaz)/courses/[cid]/layout.tsx</code>{" "}to a
          Client Component, read <code>cid</code>{" "}with{" "}
          <code>useParams</code>, and look up the course in the store so
          a newly added course still has a name in the breadcrumb.
          Confirm you can navigate to new courses created on the
          Dashboard.
        </p>
        <p>
          On the left of the course name there is a sandwich icon that
          should show and hide Course Navigation. Implement the toggling
          behavior so that when users click the icon, the sidebar hides,
          and if they click it again, the navigation shows again. That
          flag is local to the course layout, so{" "}
          <code>useState</code>{" "}is enough — leave it out of Zustand.
          To practice both the store lookup and the toggle, update the
          layout as shown below. Confirm a course you added on
          Dashboard opens with the name you typed, and confirm the
          hamburger hides and shows the sidebar.
        </p>
        <CodeBlock
          language="tsx"
          name="CoursesLayout"
          file="app/(kambaz)/courses/[cid]/layout.tsx"
        >{`"use client";

import { ReactNode, useState } from "react";
import { useParams } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa6";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { useCoursesStore } from "../../store/coursesStore";

export default function CoursesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { cid } = useParams();
  const courseId = typeof cid === "string" ? cid : "";
  const courses = useCoursesStore((state) => state.courses);
  const course = courses.find((c) => c._id === courseId);
  const [showCourseNav, setShowCourseNav] = useState(true);

  return (
    <div id="wd-courses">
      <h2 className="text-2xl font-semibold text-red-600">
        <FaAlignJustify
          className="me-4 mb-1 inline cursor-pointer text-xl"
          onClick={() => setShowCourseNav(!showCourseNav)}
          title="Toggle course navigation"
        />
        <Breadcrumb course={course} />
      </h2>
      <hr className="my-3" />
      <div className="flex gap-4">
        {showCourseNav ? (
          <div className="hidden w-[140px] shrink-0 md:block">
            <CourseNavigation cid={courseId} />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>useParams</code>{" "}can return a string or an array, so
          the layout normalizes <code>cid</code>{" "}before{" "}
          <code>find</code>. The hamburger calls{" "}
          <code>{`setShowCourseNav(!showCourseNav)`}</code>{" "}and the
          sidebar renders only when that flag is true. On medium
          viewports and wider the navigation is a narrow column; on
          small screens it stays hidden because the existing Tailwind{" "}
          <code>hidden md:block</code>{" "}classes already collapse it.
          Open{" "}
          <Link href="/courses/RS101/home">/courses/RS101/home</Link>{" "}
          and click the hamburger (<FigureLink to="4.10.3" />
          ). With the sidebar visible the screen looks like{" "}
          <FigureLink to="4.10.3a" />; after a click it looks like{" "}
          <FigureLink to="4.10.3b" />. Add a course on the dashboard,
          open it, and confirm the breadcrumb shows the name you typed.
        </p>
        <BookFigure
          id="fig-4.10.3"
          src="/images/book/ch4/figures/fig-4-10-3-hamburger.png"
          alt="Hamburger icon that toggles course navigation"
          caption="Figure 4.10.3 — Course navigation toggle"
          imageClassName="mx-auto h-auto w-16 max-w-full rounded border border-neutral-200 bg-white object-contain"
        />
        <BookFigure
          sources={[
            {
              id: "fig-4.10.3a",
              src: "/images/book/ch4/figures/fig-4-10-3a-nav-shown.png",
              alt: "Course Home with course navigation sidebar visible",
              caption: "Figure 4.10.3a — Course navigation shown",
            },
            {
              id: "fig-4.10.3b",
              src: "/images/book/ch4/figures/fig-4-10-3b-nav-hidden.png",
              alt: "Course Home with course navigation sidebar hidden",
              caption: "Figure 4.10.3b — Course navigation hidden",
            },
          ]}
        />
      </Section>

      <KambazModules />
      <KambazAccount />
    </Section>
  );
}
