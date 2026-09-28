import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import LocalUrl from "../../components/LocalUrl";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import OfficialLink from "../../components/OfficialLink";
import Link from "next/link";

export default function Intro() {
  return (
    <>
      <header id="intro" className="scroll-mt-6 mb-8">
        <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
          Developing Full Stack Next.js Web Applications
        </p>
        <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
          Chapter 4 — Managing Client State
        </h1>
        <p className="text-neutral-600">Dr. Jose Annunziato</p>
      </header>

      <section className="space-y-4 text-[1.05rem]">
        <p>
          In an application, <strong>state</strong> is the collection of
          data values stored in the various constants, variables, and data
          structures while the page is open. Some of that data is relevant
          across the entire application or a significant subset of related
          screens; some of it is relevant only to a specific component or
          a small set of related components. If information is relevant
          across several or most components, then it should live in{" "}
          <strong>application state</strong>. If information is relevant
          only in one component, or a small set of related components,
          then it should live in <strong>component state</strong>. The
          currently signed-in user is a typical application-state value:
          username, first name, last name, role, and whether the user is
          logged in all matter on Sign in, Profile, Dashboard, and the
          course screens. Filling out a shipping form, by contrast, might
          only be relevant while checking out, so that draft belongs next
          to the checkout component rather than in a store the rest of the
          application has to ignore.
        </p>
        <p>
          <ChapterLink to={3} />{" "}showed how to render content dynamically
          from JSON: the Dashboard loops over an array of courses instead
          of eight copies of the same markup, and the Course screen reads
          an object indexed by an ID parsed from the URL. What we cannot
          do yet is change that data from the UI. The Add, Edit, and
          Delete buttons are still for decoration. A module you type on
          one screen never appears on another, because both pages are
          still reading from static files and are not connected to each
          other. This chapter introduces how to maintain state at the
          application level as well as at the component level so those
          buttons start to mean something.
        </p>
        <p>
          The useful question is who needs the data.{" "}
          <strong>Local state</strong> — component state — is data only
          one screen cares about, such as a form draft, a dialog that is
          open or closed, or the course name you are still typing on
          Dashboard. Nobody else needs that draft until you click Add.{" "}
          <strong>Shared state</strong> — application state — is data
          several screens need, such as who is signed in or the list of
          courses. Sign in, Profile, and Dashboard all need the current
          user; Dashboard and Home both change the same courses array, so
          that data belongs where those screens can all reach it. As those
          values change, the user interface renders again to match, giving
          the user feedback that their clicks and keystrokes are having
          the intended effect.
        </p>
        <p>
          This chapter moves through{" "}
          <em>
            forms and events → Redux → Context → Zustand → Kambaz
          </em>
          . The Redux Hello, Add, and Todo labs stay so you can read a
          slice when you meet one.{" "}
          <SectionLink to="4.6" />{" "}covers Hello, Counter, Add, and
          Todos even though Kambaz itself will not use those reducers.
          Put{" "}
          <OfficialLink href="https://zustand.docs.pmnd.rs/">
            Zustand
          </OfficialLink>{" "}
          on Kambaz courses and modules — it is the smaller store you
          will maintain.
        </p>
        <p>
          React&apos;s{" "}
          <OfficialLink href="https://react.dev/reference/react/useState">
            useState
          </OfficialLink>{" "}
          hook holds local state — a counter, a controlled input, a
          dialog flag.{" "}
          <OfficialLink href="https://react.dev/learn/passing-data-deeply-with-context">
            React Context
          </OfficialLink>{" "}
          lets nested components read who is signed in without passing
          that user through every parent in between.{" "}
          <OfficialLink href="https://redux-toolkit.js.org/">
            Redux Toolkit
          </OfficialLink>{" "}
          is an application store: a single object, reducers
          that receive actions, <code>useSelector</code> and{" "}
          <code>dispatch</code>. Zustand is the store for
          Kambaz courses and modules. After the labs,{" "}
          <SectionLink to="4.10" />{" "}applies these ideas to Kambaz so
          Add, Edit, and Delete change the screens that already render
          from JSON.
        </p>
      </section>

      <Section id="sec-4-1" title="4.1 Learning Objectives">
        <p>
          By the end of this chapter you will understand state management
          in React applications well enough to decide where a value
          belongs, how it is updated, and how the user interface stays in
          sync. You will handle user input with controlled components,
          use the <code>useState</code>{" "}hook to manage component-level
          state, explore two-way data binding for form elements, and
          implement React forms with text fields, checkboxes, date
          pickers, and other input types. You will also handle side
          effects with the{" "}
          <OfficialLink href="https://react.dev/reference/react/useEffect">
            useEffect
          </OfficialLink>{" "}
          hook, add state management to the Kambaz user interface, and
          render dynamic content based on application state. The lab
          walk-throughs teach Redux Toolkit as optional literacy — the
          store, actions, reducers, <code>useSelector</code>, and{" "}
          <code>useDispatch</code> — so you can follow existing
          codebases, while Zustand holds the Kambaz lists you will keep
          building in later chapters.
        </p>
        <p>More specifically, you will be able to:</p>
        <ul>
          <li>
            Handle user events in Client Components and pass both data and
            functions into event handlers.
          </li>
          <li>
            Declare local state with <code>useState</code>{" "}for numbers,
            booleans, strings, dates, objects, and arrays.
          </li>
          <li>
            Bind form fields to state with <code>value</code>{" "}and{" "}
            <code>onChange</code>{" "}so the UI and the data stay in sync.
          </li>
          <li>
            Share state by declaring it in a parent both components can
            reach, and recognize when that sharing becomes prop drilling.
          </li>
          <li>
            Encode optional or structural data in the URL with query
            parameters and path parameters.
          </li>
          <li>
            Share the signed-in user with React Context from the Kambaz
            layout, without turning Context into a database of courses.
          </li>
          <li>
            Put courses and modules in a Zustand store and subscribe from
            any Client Component.
          </li>
          <li>
            Read a Redux Toolkit slice, store, selector, and dispatch so
            you can follow existing codebases.
          </li>
          <li>
            Run side effects with <code>useEffect</code>{" "}after React
            paints.
          </li>
          <li>
            Add, update, and delete Kambaz courses and modules from a
            shared Zustand store so Dashboard and Home stay in sync.
          </li>
        </ul>
        <p>
          Those objectives are best achieved by building along with the
          narration — each Lab 4 component and Kambaz store as it appears —
          rather than reading first and coding later. Implement the
          component, import it from the Lab 4 page, and confirm the
          browser displays as shown before you move on. Glance at the Lab
          4 checklist in <SectionLink to="4.8" />{" "}and the Kambaz
          checklist in <SectionLink to="4.11" />{" "}so the expected
          coverage is visible from the start. Those lists are recaps, not
          a reason to skip ahead: work through each section, then use them
          to confirm what stuck.
        </p>
      </Section>

      <Section id="sec-4-2" title="4.2 Managing State and User Input with Forms">
        <p>
          This section presents React examples that program the browser,
          interact with the user, and generate dynamic HTML. Use the same
          project you worked on in the last chapter. After you work
          through the examples you will apply the same skills while
          creating a stateful Kambaz on your own. Using Visual Studio
          Code, Cursor, or your favorite IDE, open the project you created
          in previous chapters. Include all the work in the Labs section
          as part of your final deliverable. Do your work on a new branch
          called <code>a4</code>{" "}and deploy it to{" "}
          <OfficialLink href="https://vercel.com/">Vercel</OfficialLink>{" "}
          as a branch deployment of the same name, the same way earlier
          chapters deployed <code>a2</code>{" "}and <code>a3</code>.
        </p>
        <p>
          HTML and CSS describe what a screen looks like. As users
          interact with the application, they generate a stream of events
          that describe what the user did. Events change the state of the
          application and the user interface updates to reflect the new
          state. To practice managing state and user interaction, create a
          new lab directory called <code>lab4</code> in the{" "}
          <code>app/labs</code>{" "}directory.
        </p>
        <CodeBlock language="shell">{`mkdir app/labs/lab4`}</CodeBlock>
        <p>
          In{" "}
          <OfficialLink href="https://nextjs.org/">Next.js</OfficialLink>
          , files run on the server by default and cannot handle clicks,
          typing, or dialogs. Those events need the browser, so Lab 4
          starts with <code>&quot;use client&quot;</code>. Create{" "}
          <code>app/labs/lab4/page.tsx</code>{" "}with that directive and a
          heading. You will import each new component under that heading
          as you go, the same implement-import-confirm cadence you used
          throughout Lab 3:
        </p>
        <CodeBlock language="tsx" name="Lab4" file="app/labs/lab4/page.tsx">{`"use client";

export default function Lab4() {
  return (
    <div id="wd-lab4">
      <h2>Lab 4</h2>
    </div>
  );
}`}</CodeBlock>
        <p>
          Add a link to the new lab in both{" "}
          <code>app/labs/page.tsx</code>{" "}and{" "}
          <code>app/labs/TOC.tsx</code>, the same two files you updated in
          earlier chapters. Style the Labs table of contents with the
          existing{" "}
          <OfficialLink href="https://tailwindcss.com/">
            Tailwind CSS
          </OfficialLink>{" "}
          classes from{" "}
          <Link href="/labs/lab2">Lab 2</Link>, not a separate Bootstrap
          pill bar. Confirm you can reach{" "}
          <LocalUrl href="/labs/lab4" />{" "}from the Labs table of contents
          before continuing. A coverage checklist for Lab 4 is in{" "}
          <SectionLink to="4.8" /> — use it after you have walked through
          the samples, not instead of building them as you read. Those lab
          files are throwaway drills — one idea per component. Kambaz,
          later in this chapter, is the application you keep.
        </p>
        <p>
          Install the two store libraries now so later sections can import
          them. Zustand is the store Kambaz will use for courses and
          modules; Redux Toolkit is the literacy store you will rebuild
          the Hello, Counter, Add, and Todos examples with in{" "}
          <SectionLink to="4.6" />. Use Lab 2&apos;s Tailwind classes for
          buttons and fields throughout these exercises:
        </p>
        <CodeBlock language="shell">{`npm install zustand @reduxjs/toolkit react-redux`}</CodeBlock>
      </Section>
    </>
  );
}
