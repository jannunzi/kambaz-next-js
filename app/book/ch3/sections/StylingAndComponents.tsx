import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import LocalUrl from "../../components/LocalUrl";
import Classes from "@/app/labs/lab3/Classes";
import Styles from "@/app/labs/lab3/Styles";
import ClientComponentDemo from "@/app/labs/lab3/ClientComponentDemo";
import ServerComponentDemo from "@/app/labs/lab3/ServerComponentDemo";
import Add from "@/app/labs/lab3/Add";
import Square from "@/app/labs/lab3/Square";
import Highlight from "@/app/labs/lab3/Highlight";
import PathParameters from "@/app/labs/lab3/PathParameters";
import TodoList from "@/app/labs/lab3/todos/TodoList";
import Link from "next/link";
import { OnYourOwn, WithAI } from "../../components/Practice";
import NestedExerciseList from "../../components/NestedExerciseList";
import { CH3_LAB_EXERCISES } from "../../exercise-lists/catalogs";

export default function StylingAndComponents() {
  return (
    <>
      <Section id="sec-3-5" title="3.5 Dynamic Styling">
        <p>
          <ChapterLink to={2} />{" "}styled tags with CSS files and Tailwind
          classes. React can generate content dynamically based on
          algorithms written in JavaScript, and we can also dynamically
          style that content by programmatically controlling the classes
          and styles applied to it so the look follows the data. In the
          next couple of exercises we first learn to work with classes and
          then with styles.
        </p>

        <Section
          level={3}
          id="sec-3-5-1"
          title="3.5.1 Working with HTML Classes"
        >
          <p>
            Let&apos;s start practicing simple things, like classes and
            styles. Start with static classes, then build the class name
            from a variable, then pick a class with a ternary. Under the{" "}
            <code>app/labs/lab3</code>{" "}folder, create a new component{" "}
            <code>Classes</code>{" "}with a matching styling file. From the
            Lab 3 component, import the new <code>Classes</code>{" "}
            component and confirm it renders as shown:
          </p>
          <CodeBlock
            language="css"
            name="Classes styles"
            file="app/labs/lab3/Classes.css"
          >{`.wd-bg-yellow {
  background-color: lightyellow;
}
.wd-bg-blue {
  background-color: lightblue;
}
.wd-bg-red {
  background-color: lightcoral;
}
.wd-bg-green {
  background-color: lightgreen;
}
.wd-fg-black {
  color: black;
}
.wd-padding-10px {
  padding: 10px;
}`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="Classes"
            file="app/labs/lab3/Classes.tsx"
          >{`import "./Classes.css";

export default function Classes() {
  const color = "blue";
  const dangerous = true;
  return (
    <div id="wd-classes">
      <h2>Classes</h2>
      <div className="wd-bg-yellow wd-fg-black wd-padding-10px">
        Yellow background
      </div>
      <div className="wd-bg-blue wd-fg-black wd-padding-10px">
        Blue background
      </div>
      <div className="wd-bg-red wd-fg-black wd-padding-10px">
        Red background
      </div>
      <div className={\`wd-bg-\${color} wd-fg-black wd-padding-10px\`}>
        Dynamic Blue background
      </div>
      <div
        className={\`\${dangerous ? "wd-bg-red" : "wd-bg-green"} wd-fg-black wd-padding-10px\`}
      >
        Dangerous background
      </div>
      <hr />
    </div>
  );
}`}</CodeBlock>
          <p>
            Importing <code>Classes.css</code>{" "}loads the rules. The fourth
            box concatenates <code>wd-bg-</code>{" "}with the{" "}
            <code>color</code>{" "}constant. The fifth box picks{" "}
            <code>wd-bg-red</code>{" "}or <code>wd-bg-green</code>{" "}from{" "}
            <code>dangerous</code>. Flip that flag to see the background
            change:
          </p>
          <LiveDemo
            mode="styled"
            name="Classes"
            file="app/labs/lab3/Classes.tsx"
          >
            <Classes />
          </LiveDemo>
          <OnYourOwn>
            Set <code>color</code>{" "}to{" "}
            <code>&quot;yellow&quot;</code>{" "}and <code>dangerous</code>{" "}to{" "}
            <code>false</code>, confirm the last two boxes change, then
            restore the values above.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/Classes.tsx, keep color as "blue" and dangerous as true. After the existing boxes, add a sixth div whose className uses a new const shade = "green" as \`wd-bg-\${shade} wd-fg-black wd-padding-10px\` and the text "Dynamic Green background". Do not flip color or dangerous.`}
          >
            Ask the assistant to add one extra dynamic-class box — you still
            flip <code>color</code>{" "}and <code>dangerous</code>{" "}yourself,
            then restore them:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-3-5-2"
          title="3.5.2 Working with the Style Attribute"
        >
          <p>
            In React, the <code>style</code>{" "}attribute accepts a
            JavaScript object where the properties are CSS properties —
            camelCase, the same object you used in{" "}
            <SectionLink to="2.1.1" /> — and the values are CSS values.
            Spread smaller objects into larger ones so padding and color
            are reused. To practice how this works, implement the{" "}
            <code>Styles</code>{" "}component below and then import it into
            the Lab 3 component. The component declares constant objects
            that can be applied to elements using the <code>style</code>{" "}
            attribute. Alternatively, the <code>style</code>{" "}attribute
            accepts an object literal, which results in a double
            curly-bracket syntax. Refresh the browser and confirm it
            renders as expected:
          </p>
          <CodeBlock
            language="tsx"
            name="Styles"
            file="app/labs/lab3/Styles.tsx"
          >{`export default function Styles() {
  const colorBlack = { color: "black" };
  const padding10px = { padding: "10px" };
  const bgBlue = {
    backgroundColor: "lightblue",
    color: "black",
    ...padding10px,
  };
  const bgRed = {
    backgroundColor: "lightcoral",
    ...colorBlack,
    ...padding10px,
  };
  return (
    <div id="wd-styles">
      <h2>Styles</h2>
      <div
        style={{
          backgroundColor: "lightyellow",
          color: "black",
          padding: "10px",
        }}
      >
        Yellow background
      </div>
      <div style={bgRed}>Red background</div>
      <div style={bgBlue}>Blue background</div>
    </div>
  );
}`}</CodeBlock>
          <p>
            Double curly braces on the yellow box are one pair to enter a
            JSX expression and one pair for the object literal. The red and
            blue boxes pass a named object instead:
          </p>
          <LiveDemo mode="styled" name="Styles" file="app/labs/lab3/Styles.tsx">
            <Styles />
          </LiveDemo>
          <OnYourOwn>
            Declare a <code>bgGreen</code>{" "}
            object (spread <code>colorBlack</code>{" "}and{" "}
            <code>padding10px</code>) and apply it to a fourth box.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/Styles.tsx, keep bgGreen if I already added it. After the existing boxes, add const bgGray = { backgroundColor: "lightgray", ...colorBlack, ...padding10px } and a fifth div style={bgGray} with the text "Gray background". Do not overwrite bgGreen.`}
          >
            Paste this prompt so the assistant adds a sample gray box — leave
            the green one as yours:
          </WithAI>
        </Section>
      </Section>

      <Section
        id="sec-3-6"
        title="3.6 Client and Server Components"
      >
        <p>
          In Next.js, all components are Server Components by default.
          This means they execute only on the server during rendering,
          producing HTML that is sent to the browser. Server Components
          are fast, secure, and can directly access server-only resources
          such as the filesystem or environment variables, but they cannot
          use browser-specific features like interactivity, state, or DOM
          APIs, including hooks such as <code>usePathname</code>. If you
          need interactivity or browser APIs, you must explicitly turn a
          component into a <strong>Client Component</strong>{" "}by adding{" "}
          <code>&quot;use client&quot;</code>{" "}at the top of the file.
          Client Components run only in the browser, allowing hooks, event
          handlers, and browser globals — but they lose direct server
          access. The two simple examples below highlight exactly what
          each side can and cannot do.
        </p>

        <Section
          level={3}
          id="sec-3-6-1"
          title="3.6.1 Client Components"
        >
          <p>
            This Client Component below is marked with the{" "}
            <code>&quot;use client&quot;</code>{" "}directive at the top,
            which forces it to execute exclusively in the browser rather
            than on the server. The directive must be the first statement
            in the file. This allows safe use of browser-only features,
            such as hooks from <code>next/navigation</code>. In this
            example, the component uses the <code>usePathname()</code>{" "}
            hook to read the current route. This hook is client-only and
            would cause a server-side error if the component were treated
            as a Server Component. Removing the directive would result in
            a build or runtime failure because{" "}
            <code>usePathname()</code>{" "}is not available during server
            rendering. The code renders a simple heading and displays the
            current pathname. Create <code>ClientComponentDemo.tsx</code>,
            import it into Lab 3, and confirm it renders as shown:
          </p>
          <CodeBlock
            language="tsx"
            name="ClientComponentDemo"
            file="app/labs/lab3/ClientComponentDemo.tsx"
          >{`"use client";

import { usePathname } from "next/navigation";

export default function ClientComponentDemo() {
  const pathname = usePathname();
  return (
    <div id="wd-client-component-demo">
      <h1>Client Component Demo</h1>
      <p>Current pathname: {pathname}</p>
    </div>
  );
}`}</CodeBlock>
          <p>
            Embedded in this book page, the pathname is the book route.
            Open it from <LocalUrl href="/labs/lab3" />{" "}to see{" "}
            <code>/labs/lab3</code>:
          </p>
          <LiveDemo
            name="ClientComponentDemo"
            file="app/labs/lab3/ClientComponentDemo.tsx"
          >
            <ClientComponentDemo />
          </LiveDemo>
          <OnYourOwn>
            Temporarily remove{" "}
            <code>&quot;use client&quot;</code>{" "}and confirm the error,
            then put the directive back.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/ClientComponentDemo.tsx, keep "use client" as the first statement. After the pathname paragraph, add a second <p>Last segment: {pathname.split("/").pop()}</p>. Do not remove the directive.`}
          >
            Ask the assistant to display one extra pathname snippet — you still
            remove and restore <code>&quot;use client&quot;</code>{" "}yourself:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-3-6-2"
          title="3.6.2 Server Components"
        >
          <p>
            By default, Next.js pages and components are Server Components
            and are marked by omitting the{" "}
            <code>&quot;use client&quot;</code>{" "}directive, making the
            file execute exclusively on the server. The server component
            below demonstrates server-only capabilities by accessing
            Node.js globals like the <code>process</code>{" "}object and using{" "}
            <code>fs.readdirSync()</code>{" "}to list files from{" "}
            <code>app/labs/lab3</code>{" "}on the server&apos;s filesystem.
            Adding <code>&quot;use client&quot;</code>{" "}would cause a
            build failure, as APIs like <code>process</code>{" "}and{" "}
            <code>fs</code>{" "}are unavailable in the browser environment.
            Create <code>ServerComponentDemo.tsx</code>, import it into
            Lab 3, and confirm it renders as shown:
          </p>
          <CodeBlock
            language="tsx"
            name="ServerComponentDemo"
            file="app/labs/lab3/ServerComponentDemo.tsx"
          >{`import fs from "node:fs";
import path from "node:path";

export default function ServerComponentDemo() {
  const platform = process.platform;
  const nodeVersion = process.version;
  const serverRenderTime = new Date().toLocaleTimeString();
  const lab3Dir = path.join(process.cwd(), "app/labs/lab3");
  let files: string[] = [];
  try {
    files = fs.readdirSync(lab3Dir);
  } catch (error) {
    console.error("Error reading lab3 directory:", error);
    files = [];
  }
  return (
    <div id="wd-server-component-demo">
      <h1>Server Component Demo</h1>
      <h2>Server Render Time</h2>
      <p>Rendered on server at: {serverRenderTime}</p>
      <h2>Server Information</h2>
      <pre>
        {JSON.stringify({ platform, nodeVersion, serverRenderTime }, null, 2)}
      </pre>
      <h2>Filesystem Access Demo</h2>
      <pre>{JSON.stringify(files, null, 2)}</pre>
    </div>
  );
}`}</CodeBlock>
          <p>
            The file list is whatever sits in{" "}
            <code>app/labs/lab3</code>{" "}on the machine that rendered this
            page — a capability the browser does not have:
          </p>
          <LiveDemo
            name="ServerComponentDemo"
            file="app/labs/lab3/ServerComponentDemo.tsx"
          >
            <ServerComponentDemo />
          </LiveDemo>
          <p>
            Import both demos into Lab 3. A useful mental box: server
            components fetch and format data; client components handle
            hooks, clicks, and anything that reads the address bar.
          </p>
          <p>
            The <code>try</code>/<code>catch</code>{" "}around{" "}
            <code>readdirSync</code>{" "}is how JavaScript handles a call that
            might throw. If the folder is missing, the{" "}
            <code>catch</code>{" "}logs the error and leaves{" "}
            <code>files</code>{" "}as an empty array instead of crashing the
            page. Use this pattern whenever Node I/O — and later, a network
            call — can fail.
          </p>
          <OnYourOwn>
            Log one extra{" "}
            <code>process</code>{" "}field (for example{" "}
            <code>process.arch</code>) into the JSON the component
            stringifies.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/ServerComponentDemo.tsx, keep any extra process field I already added. Include process.pid in the JSON.stringify object next to platform, nodeVersion, and serverRenderTime. Do not remove my extra field or the try/catch around readdirSync.`}
          >
            Paste this prompt so the assistant adds <code>process.pid</code>{" "}
            to the sample JSON — leave your extra field as the personal bit:
          </WithAI>
        </Section>
      </Section>

      <Section id="sec-3-7" title="3.7 Parameterizing Components">
        <p>
          React components can be parameterized by using the familiar HTML
          attribute syntax, which passes attribute values to the
          component&apos;s function as an object map parameter. The
          following <code>Add</code>{" "}component can receive properties{" "}
          <code>a</code>{" "}and <code>b</code>{" "}deconstructed from the
          attributes — the same parameter destructuring as{" "}
          <SectionLink to="3.4.15" />. Implement the <code>Add</code>{" "}
          component below and confirm that passing it{" "}
          <code>a={"{3}"}</code>{" "}and <code>b={"{4}"}</code>{" "}results in{" "}
          <code>a + b = 7</code>. Note that the values of <code>a</code>{" "}
          and <code>b</code>{" "}are destructed from the object parameter in
          the <code>Add</code>{" "}function parameter list. Render{" "}
          <code>{`<Add a={3} b={4} />`}</code>{" "}from Lab 3:
        </p>
        <CodeBlock
          language="tsx"
          name="Add"
          file="app/labs/lab3/Add.tsx"
        >{`export default function Add({ a, b }: { a: number; b: number }) {
  return (
    <div id="wd-add">
      <h4>Add</h4>
      a = {a}
      b = {b}
      <br />
      a + b = {a + b}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The braces around <code>3</code>{" "}and <code>4</code>{" "}pass
          numbers, not the strings <code>&quot;3&quot;</code>{" "}and{" "}
          <code>&quot;4&quot;</code>. The sum is <code>7</code>:
        </p>
        <LiveDemo name="Add" file="app/labs/lab3/Add.tsx">
          <Add a={3} b={4} />
        </LiveDemo>
        <OnYourOwn>
          Render a second{" "}
          <code>{`<Add a={10} b={20} />`}</code>{" "}on the Lab 3 page and
          confirm it prints <code>30</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/page.tsx, keep <Add a={3} b={4} /> and any <Add a={10} b={20} /> I added. Render one more sample <Add a={7} b={8} /> under those. Do not change Add.tsx.`}
        >
          Ask the assistant to render one extra sample{" "}
          <code>{`<Add a={7} b={8} />`}</code>{" "}— leave the 10 + 20 instance
          as yours:
        </WithAI>

        <Section
          level={3}
          id="sec-3-7-1"
          title="3.7.1 Child Components"
        >
          <p>
            In the previous section we discussed passing data to a
            component through attributes. Another way to pass data to a
            component is in its body, that is, between the opening and
            closing tag of the element. In HTML it is common to wrap
            content with specific tags to add certain formatting. For
            instance the tags <code>h1</code>{" "}and <code>p</code>{" "}format
            the content in their bodies with specific font sizes and
            margins — they take the content in the body and return a
            transformed version. We can implement React components the
            same way. The content in the body of a React component is
            passed to the component function as a parameter called{" "}
            <code>children</code>. For instance, the <code>Square</code>{" "}
            component below takes a number in its body and returns the
            square of the number. Import the new component, use it to
            compute the square of 4, and confirm it renders the correct
            result:
          </p>
          <CodeBlock
            language="tsx"
            name="Square"
            file="app/labs/lab3/Square.tsx"
          >{`import { ReactNode } from "react";

export default function Square({ children }: { children: ReactNode }) {
  const num = Number(children);
  return <span id="wd-square">{num * num}</span>;
}`}</CodeBlock>
          <p>
            On the Lab 3 page, render{" "}
            <code>{`<Square>4</Square>`}</code>{" "}under a heading. The child
            text <code>4</code>{" "}becomes <code>16</code>:
          </p>
          <LiveDemo name="Square" file="app/labs/lab3/Square.tsx">
            <p>
              Square of 4 = <Square>4</Square>
            </p>
          </LiveDemo>
          <p>
            <code>Highlight</code>{" "}wraps arbitrary children in a yellow
            span with red text — formatting, not arithmetic:
          </p>
          <CodeBlock
            language="tsx"
            name="Highlight"
            file="app/labs/lab3/Highlight.tsx"
          >{`import { ReactNode } from "react";

export default function Highlight({ children }: { children: ReactNode }) {
  return (
    <span
      id="wd-highlight"
      style={{ backgroundColor: "yellow", color: "red" }}
    >
      {children}
    </span>
  );
}`}</CodeBlock>
          <LiveDemo name="Highlight" file="app/labs/lab3/Highlight.tsx">
            <Highlight>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </Highlight>
          </LiveDemo>
          <OnYourOwn>
            Wrap a sentence of your own in{" "}
            <code>Highlight</code>{" "}on the Lab 3 page, and render{" "}
            <code>{`<Square>9</Square>`}</code>{" "}next to the square of 4.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/page.tsx, keep any Highlight sentence I wrote and any <Square>9</Square> I added. After the sample Square of 4, add <p>Square of 5 = <Square>5</Square></p> and one more <Highlight>Children can be any JSX</Highlight>. Do not change my personal sentence.`}
          >
            Ask the assistant to add one extra sample highlight and square —
            leave your sentence as the personal bit:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-3-7-2"
          title="3.7.2 Working with the Pathname"
        >
          <p>
            <code>usePathname</code>{" "}returns the current URL path so
            navigation can highlight the active screen. The Labs table of
            contents is already a client component: it maps a{" "}
            <code>LINKS</code>{" "}array and applies Tailwind classes when a
            link&apos;s <code>match</code>{" "}function says the pathname
            belongs to that lab. Read
            the file you already maintain:
          </p>
          <CodeBlock
            language="tsx"
            name="TOC"
            file="app/labs/TOC.tsx"
          >{`"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/labs", id: "wd-home-link", label: "Home", match: (p: string) => p === "/labs" },
  { href: "/labs/lab1", id: "wd-lab1-link", label: "Lab 1", match: (p: string) => p.endsWith("/lab1") || p.includes("/lab1/") },
  { href: "/labs/lab2", id: "wd-lab2-link", label: "Lab 2", match: (p: string) => p.includes("/lab2") },
  { href: "/labs/lab3", id: "wd-lab3-link", label: "Lab 3", match: (p: string) => p.includes("/lab3") },
  { href: "/", id: "wd-kambaz-link", label: "Kambaz", match: () => false },
] as const;

export default function TOC() {
  const pathname = usePathname() ?? "";
  return (
    <ul>
      {LINKS.map((link) => (
        <li key={link.id}>
          <Link
            href={link.href}
            id={link.id}
            className={
              link.match(pathname)
                ? "rounded bg-blue-600 px-2 py-0.5 text-white no-underline"
                : undefined
            }
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <Link href="/labs/lab1/intermediates" id="wd-lab1-intermediates-link">
          Lab 1 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch1" id="wd-book-ch1-link">
          Book Ch1
        </Link>
      </li>
      <li>
        <Link href="/labs/lab2/intermediates" id="wd-lab2-intermediates-link">
          Lab 2 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch2" id="wd-book-ch2-link">
          Book Ch2
        </Link>
      </li>
      <li>
        <Link href="/labs/lab3/intermediates" id="wd-lab3-intermediates-link">
          Lab 3 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch3" id="wd-book-ch3-link">
          Book Ch3
        </Link>
      </li>
    </ul>
  );
}`}</CodeBlock>
          <p>
            The file starts with <code>&quot;use client&quot;</code>{" "}because{" "}
            <code>usePathname</code>{" "}reads the address bar. Each mapped{" "}
            <code>Link</code>{" "}uses <code>key={"{link.id}"}</code>. Visit{" "}
            <LocalUrl href="/labs/lab3" />{" "}and confirm the Lab 3 item
            picks up the blue pill classes; Lab 1 and Lab 2 should do the
            same on their routes.
          </p>
          <OnYourOwn>
            If Lab 3 is not yet in{" "}
            <code>LINKS</code>, add it with a <code>match</code>{" "}that
            uses <code>includes(&quot;/lab3&quot;)</code>, and confirm the
            highlight follows you between labs.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/TOC.tsx, keep the existing LINKS entries including Lab 3. After the Lab 3 object, add { href: "/labs/lab4", id: "wd-lab4-link", label: "Lab 4", match: (p: string) => p.includes("/lab4") }. Do not remove or rename my Lab 3 link.`}
          >
            Paste this prompt so the assistant adds a sample Lab 4 TOC entry —
            you still confirm Lab 3 highlights on its own route:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-3-7-3"
          title="3.7.3 Encoding Path Parameters"
        >
          <p>
            Dynamic folders in the App Router —{" "}
            <code>[a]</code>{" "}and <code>[b]</code> — capture path segments
            as parameters. A client page reads them with{" "}
            <code>useParams</code>. Create{" "}
            <code>app/labs/lab3/add/[a]/[b]/page.tsx</code>:
          </p>
          <CodeBlock
            language="tsx"
            name="AddPathParameters"
            file="app/labs/lab3/add/[a]/[b]/page.tsx"
          >{`"use client";

import { useParams } from "next/navigation";

export default function AddPathParameters() {
  const { a, b } = useParams();
  return (
    <div id="wd-add-path-parameters">
      <h4>Add Path Parameters</h4>
      {a} + {b} = {parseInt(a as string) + parseInt(b as string)}
    </div>
  );
}`}</CodeBlock>
          <p>
            Path values are strings (or string arrays), so{" "}
            <code>parseInt</code>{" "}turns them into numbers. Link to that
            route from a <code>PathParameters</code>{" "}component you import
            into Lab 3:
          </p>
          <CodeBlock
            language="tsx"
            name="PathParameters"
            file="app/labs/lab3/PathParameters.tsx"
          >{`import Link from "next/link";

export default function PathParameters() {
  return (
    <div id="wd-path-parameters">
      <h2>Path Parameters</h2>
      <Link href="/labs/lab3/add/1/2">1 + 2</Link>
      <br />
      <Link href="/labs/lab3/add/3/4">3 + 4</Link>
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="PathParameters"
            file="app/labs/lab3/PathParameters.tsx"
          >
            <PathParameters />
          </LiveDemo>
          <p>
            Click <Link href="/labs/lab3/add/1/2">1 + 2</Link>{" "}and confirm
            the URL is <code>/labs/lab3/add/1/2</code>{" "}and the page prints{" "}
            <code>1 + 2 = 3</code>. The second link should print{" "}
            <code>3 + 4 = 7</code>.
          </p>
          <OnYourOwn>
            Add a third link that encodes two
            numbers of your choice and confirm the add page sums them.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/PathParameters.tsx, keep the 1+2 and 3+4 links and any third link I added. After them, add <Link href="/labs/lab3/add/5/6">5 + 6</Link>. Do not change app/labs/lab3/add/[a]/[b]/page.tsx or overwrite my numbers.`}
          >
            Ask the assistant to add a sample 5 + 6 link — leave the third
            pair of numbers as yours:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-3-7-4"
          title="3.7.4 Rendering a Data Structure"
        >
          <p>
            Arrays, JSON, <code>map</code>, keys, default parameters, and
            parameterized components come together as a todo list — still
            throwaway Lab 3 code, now combining the ideas instead of
            introducing a new one. In{" "}
            <code>app/labs/lab3/todos</code>, create{" "}
            <code>TodoItem.tsx</code>{" "}that receives one todo as a prop.
            The <code>todo = {"{ … }"}</code>{" "}in the parameter list is a{" "}
            <strong>default parameter</strong>{" "}(
            <SectionLink to="3.4.15" />
            ): if the parent omits <code>todo</code>, the milk item is
            used.
          </p>
          <CodeBlock
            language="tsx"
            name="TodoItem"
            file="app/labs/lab3/todos/TodoItem.tsx"
          >{`type Todo = {
  done: boolean;
  title: string;
  status: string;
};

const TodoItem = ({
  todo = { done: true, title: "Buy milk", status: "COMPLETED" },
}: {
  todo?: Todo;
}) => {
  return (
    <li className="flex items-center gap-2 border-b py-1">
      <input type="checkbox" className="me-2" defaultChecked={todo.done} />
      {todo.title} ({todo.status})
    </li>
  );
};

export default TodoItem;`}</CodeBlock>
          <p>
            Store the list next to the component as JSON — Next.js lets you
            import JSON as a value:
          </p>
          <CodeBlock
            language="json"
            name="todos"
            file="app/labs/lab3/todos/todos.json"
          >{`[
  { "title": "Buy milk", "status": "CANCELED", "done": true },
  { "title": "Pickup the kids", "status": "IN PROGRESS", "done": false },
  { "title": "Walk the dog", "status": "DEFERRED", "done": false }
]`}</CodeBlock>
          <p>
            <code>TodoList</code>{" "}maps that array onto{" "}
            <code>TodoItem</code>, using <code>todo.title</code>{" "}as the{" "}
            <code>key</code>{" "}(
            <SectionLink to="3.4.4" />
            ) because the titles are unique in this file:
          </p>
          <CodeBlock
            language="tsx"
            name="TodoList"
            file="app/labs/lab3/todos/TodoList.tsx"
          >{`import TodoItem from "./TodoItem";
import todos from "./todos.json";

export default function TodoList() {
  return (
    <>
      <h3>Todo List</h3>
      <ul className="list-none p-0">
        {todos.map((todo) => (
          <TodoItem key={todo.title} todo={todo} />
        ))}
      </ul>
      <hr />
    </>
  );
}`}</CodeBlock>
          <p>
            Import <code>TodoList</code>{" "}into Lab 3. Each row is a checkbox
            whose default matches <code>todo.done</code>:
          </p>
          <LiveDemo name="TodoList" file="app/labs/lab3/todos/TodoList.tsx">
            <TodoList />
          </LiveDemo>
          <OnYourOwn>
            Add a fourth object to{" "}
            <code>todos.json</code>{" "}with a unique title and confirm a
            fourth row appears — then put a <code>key</code>{" "}on every
            mapped <code>TodoItem</code>{" "}if it is missing. Log the{" "}
            <code>todos</code>{" "}array from <code>TodoList.tsx</code>{" "}and
            confirm the objects appear in the console (
            <SectionLink to="3.4.12" />
            ).
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/todos/todos.json, keep any fourth todo I added. Append one more sample object { "title": "Email the TA", "status": "COMPLETED", "done": true } with a unique title. In app/labs/lab3/todos/TodoList.tsx, keep key={todo.title} on every TodoItem and add console.log(todos) if it is missing. Do not change my personal todo title.`}
          >
            Paste this prompt so the assistant adds one extra sample todo and
            the console log — leave your fourth title as the personal bit:
          </WithAI>
        </Section>

        <Section level={3} id="sec-3-7-5" title="3.7.5 Exercises">
          <p>
            Use this checklist to confirm Lab 3 covers every JavaScript
            topic in <SectionLink to="3.2" />–<SectionLink to="3.7" />.
            Import each component into <code>app/labs/lab3/page.tsx</code>{" "}
            in order. Each topic is listed once, with Lab,{" "}
            <strong>On your own</strong>, and <strong>With AI</strong>{" "}
            nested as a/b/c. Give every mapped JSX sibling a{" "}
            <code>key</code>.
          </p>
          <NestedExerciseList groups={CH3_LAB_EXERCISES} />
        </Section>
      </Section>
    </>
  );
}
