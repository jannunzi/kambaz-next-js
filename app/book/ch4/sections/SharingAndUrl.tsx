import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import LocalUrl from "../../components/LocalUrl";
import OfficialLink from "../../components/OfficialLink";
import { OnYourOwn, WithAI } from "../../components/Practice";
import ParentStateComponent from "@/app/labs/lab4/ParentStateComponent";
import PropDrilling from "@/app/labs/lab4/PropDrilling";
import UrlEncoding from "@/app/labs/lab4/UrlEncoding";

export default function SharingAndUrl() {
  return (
    <Section
      id="sec-4-3"
        title="4.3 Sharing State, Prop Drilling, and URLs"
    >
      <p>
        State can be shared between components by passing references to
        state variables and the functions that update them. This section
        covers sharing state, then URL encoding with query parameters and
        then path parameters, so the problem is visible before Redux, Context,
        and Zustand offer to solve it.
      </p>
      <p>
        The <code>useState</code>{" "}hook belongs to the component that
        calls it, so a sibling or a nested screen cannot read that value
        on its own. To share it you can move the value and its setter up
        to a parent both can reach and pass them down as props, encode the
        data in the URL of the next page, or keep it in a store that any
        Client Component can import. The exercises below work through the
        first two of those — sharing through a parent, and encoding in
        the URL — so that when Context and Zustand show up, you already
        know the problem they are meant to solve. Although passing
        references is sufficient as a general approach among a few
        components, it is fraught with challenges when building larger
        applications: every rename of the prop touches files that only
        existed to forward it. That is the moment a store starts to earn
        its keep.
      </p>

      <Section
        level={3}
        id="sec-4-3-1"
        title="4.3.1 Sharing State Between Parent and Child"
      >
        <p>
          When two components need the same counter, declare it in the
          parent and pass both the value and the setter down as props.
          The example below demonstrates a{" "}
          <code>ParentStateComponent</code>{" "}sharing a{" "}
          <code>counter</code>{" "}state variable and a{" "}
          <code>setCounter</code>{" "}mutator function with{" "}
          <code>ChildStateComponent</code>{" "}by passing references to{" "}
          <code>counter</code>{" "}and <code>setCounter</code>{" "}as
          attributes. The child does not own the data; it only displays
          the number and calls the setter the parent provided. The child
          can use those references to render the state variable and
          manipulate it through the mutator. To practice sharing state
          between a parent and a child, create both components below,
          import <code>ParentStateComponent</code>{" "}into Lab 4, and
          confirm it works as expected.
        </p>
        <CodeBlock
          language="tsx"
          name="ParentStateComponent"
          file="app/labs/lab4/ParentStateComponent.tsx"
        >{`"use client";

import { useState } from "react";
import ChildStateComponent from "./ChildStateComponent";

export default function ParentStateComponent() {
  const [counter, setCounter] = useState(123);
  return (
    <div id="wd-parent-state">
      <h2>Counter {counter}</h2>
      <ChildStateComponent counter={counter} setCounter={setCounter} />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="ChildStateComponent"
          file="app/labs/lab4/ChildStateComponent.tsx"
        >{`"use client";

export default function ChildStateComponent({
  counter,
  setCounter,
}: {
  counter: number;
  setCounter: (counter: number) => void;
}) {
  return (
    <div id="wd-child-state">
      <h3>Counter {counter}</h3>
      <button
        type="button"
        onClick={() => setCounter(counter + 1)}
        id="wd-increment-child-state-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Increment
      </button>
      <button
        type="button"
        onClick={() => setCounter(counter - 1)}
        id="wd-decrement-child-state-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Decrement
      </button>
    </div>
  );
}`}</CodeBlock>
        <p>
          Click Increment in the child and confirm both headings update —
          parent and child are looking at the same counter. The child
          never called <code>useState</code>; it only received a number
          and a function. That is the smallest form of shared state, and
          it is the right tool when the two components already sit next to
          each other:
        </p>
        <LiveDemo
          name="ParentStateComponent"
          file="app/labs/lab4/ParentStateComponent.tsx"
          mode="styled"
        >
          <ParentStateComponent />
        </LiveDemo>
        <OnYourOwn>
          Add a Reset button in the child that sets the counter back to
          123, still using the setter from the parent.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/ChildStateComponent.tsx, keep any extra button I added. After Decrement, add a sample button id="wd-reset-child-state-click" that calls setCounter(123). Do not rename my personal button.`}
        >
          Ask the assistant to add a sample Reset in the child:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-3-2"
        title="4.3.2 Prop Drilling"
      >
        <p>
          Passing <code>counter</code>{" "}one level is fine. Passing it
          through a chain of components that do not use it — parent →
          middle → child — is <strong>prop drilling</strong>. Every
          rename of the prop touches files that only existed to forward
          it. Context and stores exist so the middle components can stay
          out of that conversation.
        </p>
        <p>
          Passing state down as props works until a component in the
          middle does not care about the value and only forwards it. That
          forwarding is the drill: the child below never reads{" "}
          <code>count</code> — it only hands it to a grandchild. To
          practice seeing the problem, create the{" "}
          <code>PropDrilling</code>{" "}component below and import it from
          the Lab 4 page. Confirm the browser displays as shown, then
          click Increment in the grandchild and watch the parent heading
          update through a component that never used the number itself.
        </p>
        <CodeBlock
          language="tsx"
          name="PropDrilling"
          file="app/labs/lab4/PropDrilling.tsx"
        >{`"use client";

import { useState } from "react";

function Grandchild({
  count,
  setCount,
}: {
  count: number;
  setCount: (n: number) => void;
}) {
  return (
    <div id="wd-prop-drill-grandchild" className="rounded border border-neutral-200 p-3">
      <h4>Grandchild</h4>
      <p>Count: {count}</p>
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Increment in grandchild
      </button>
    </div>
  );
}

function Child({
  count,
  setCount,
}: {
  count: number;
  setCount: (n: number) => void;
}) {
  return (
    <div id="wd-prop-drill-child" className="mb-2 rounded border border-neutral-200 p-3">
      <h4>Child</h4>
      <p>This component never uses count itself. It only forwards props.</p>
      <Grandchild count={count} setCount={setCount} />
    </div>
  );
}

export default function PropDrilling() {
  const [count, setCount] = useState(0);
  return (
    <div id="wd-prop-drilling">
      <h2>Prop Drilling</h2>
      <p>Parent count: {count}</p>
      <Child count={count} setCount={setCount} />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="PropDrilling"
          file="app/labs/lab4/PropDrilling.tsx"
          mode="styled"
        >
          <PropDrilling />
        </LiveDemo>
        <p>
          Two extra layers for a counter is already tedious; Dashboard,
          Home, Modules, and Assignments all changing the same courses
          array would be worse. You would have to move the courses state
          variable and mutator functions to a component that is parent to
          all of them — the Kambaz layout, or even the root of the app —
          and then thread the array through every screen that does not
          care about it. Context will help when a stable value is needed
          deep in a subtree, and Zustand when many screens mutate a list.
          Neither is worth the extra machinery for a single counter in one
          file — that still belongs in <code>useState</code>.
        </p>
        <OnYourOwn>
          Insert one more middle component between Child and Grandchild
          that also only forwards <code>count</code>{" "}and{" "}
          <code>setCount</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/PropDrilling.tsx, keep any extra layer I added. Insert a sample Middle component between Child and Grandchild that only forwards count and setCount and renders a heading "Middle". Do not rename my personal layer.`}
        >
          Ask the assistant to add one extra sample forwarding layer:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-3-3"
        title="4.3.3 Encoding State in the URL"
      >
        <p>
          Components can pass data to each other through attributes or as
          child content in the component&apos;s body. Pages can also pass
          data to each other by encoding it in the URL that navigates to
          the page. A{" "}
          <OfficialLink href="https://url.spec.whatwg.org/">
            URL
          </OfficialLink>{" "}
          is made up of the following parts:
        </p>
        <p>
          <code>http://example.com/path/to/the/page?optional=data&amp;encoded=in-query</code>
        </p>
        <ul>
          <li>
            <code>http://</code> — the protocol.
          </li>
          <li>
            <code>example.com</code> — the domain or IP address of the
            server.
          </li>
          <li>
            <code>/path/to/the/page</code> — the real or virtual path to
            an actual document, or a path resolved to some virtual
            computed content.
          </li>
          <li>
            <code>?optional=data&amp;encoded=in-query</code> — an
            optional query string with name/value pairs delimited with
            ampersand (<code>&amp;</code>).
          </li>
        </ul>
        <p>
          There are two strategies to encode data in the URL:{" "}
          <strong>query parameters</strong> and{" "}
          <strong>path parameters</strong>. Query parameters after{" "}
          <code>?</code>{" "}are a good fit for optional filters, search
          terms, pagination, and other non-structural data. Path
          parameters in folders named <code>[a]</code>{" "}and{" "}
          <code>[b]</code>{" "}are a good fit for values that identify the
          resource — the same idea as <code>[cid]</code>{" "}in Kambaz.
        </p>

        <Section
          level={3}
          id="sec-4-3-3-1"
          title="4.3.3.1 Query Search Parameters"
        >
          <p>
            The <code>QueryCalculator</code>{" "}page demonstrates how to
            read data from the query string using Next.js{" "}
            <code>useSearchParams</code>. The hook decodes the names and
            values from the URL and returns an object map where the keys
            are the names of the parameters and the values are the
            parameter values. This strategy is great for optional filters,
            search terms, pagination, or any non-structural data. Create a
            query calculator at{" "}
            <code>app/labs/lab4/url-encoding/query-params/page.tsx</code>.
            Wrap <code>useSearchParams</code>{" "}in{" "}
            <code>Suspense</code>{" "}so Next.js can stream the page.
            Confirm the browser displays as shown when you open the URL
            with <code>a</code>{" "}and <code>b</code>{" "}in the query
            string.
          </p>
          <CodeBlock
            language="tsx"
            name="QueryCalculator"
            file="app/labs/lab4/url-encoding/query-params/QueryCalculator.tsx"
          >{`"use client";

import { useSearchParams } from "next/navigation";

export default function QueryCalculator() {
  const searchParams = useSearchParams();
  const aRaw = searchParams.get("a") || "0";
  const bRaw = searchParams.get("b") || "0";
  const a = parseFloat(aRaw);
  const b = parseFloat(bRaw);
  const sum = a + b;
  return (
    <div id="wd-query-calculator">
      <h1>Calculator – Query Parameters</h1>
      <p>Raw query values (already decoded by Next.js):</p>
      <p>
        a = <code>{aRaw}</code>
      </p>
      <p>
        b = <code>{bRaw}</code>
      </p>
      <h2 className="text-green-700">Sum = {sum}</h2>
    </div>
  );
}`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="QueryCalculatorPage"
            file="app/labs/lab4/url-encoding/query-params/page.tsx"
          >{`import { Suspense } from "react";
import QueryCalculator from "./QueryCalculator";

export default function QueryCalculatorPage() {
  return (
    <Suspense fallback={<p>Loading calculator…</p>}>
      <QueryCalculator />
    </Suspense>
  );
}`}</CodeBlock>
          <p>
            <code>searchParams.get(&quot;a&quot;)</code>{" "}returns the
            string after <code>a=</code>, or <code>null</code>{" "}if the
            name is missing, which is why the sample falls back to{" "}
            <code>&quot;0&quot;</code>. Next.js has already decoded the
            values, so you do not call <code>decodeURIComponent</code>{" "}
            yourself. Parse the strings as floats, add them, and render
            the sum. Try{" "}
            <LocalUrl href="/labs/lab4/url-encoding/query-params?a=5&b=10" />{" "}
            and confirm the page prints a sum of 15.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-3-3-2"
          title="4.3.3.2 Path Parameters"
        >
          <p>
            The <code>PathCalculator</code>{" "}page demonstrates the same
            capabilities as the query calculator, but using path
            parameters where data is encoded as part of the URL path
            instead of name/value pairs after the <code>?</code>{" "}at the
            end of the URL. Here we use the <code>useParams</code>{" "}hook
            instead, which decodes the parameters from the path. Note that
            the names of the parameters are encoded as part of the
            physical name of the directory path, for example{" "}
            <code>[a]</code>{" "}and <code>[b]</code>. The path version
            lives at{" "}
            <code>
              app/labs/lab4/url-encoding/path-params/[a]/[b]/page.tsx
            </code>
            . Create that page, import nothing extra into Lab 4 yet, and
            confirm you can open a URL whose path contains the two
            numbers.
          </p>
          <CodeBlock
            language="tsx"
            name="PathCalculator"
            file="app/labs/lab4/url-encoding/path-params/[a]/[b]/page.tsx"
          >{`"use client";

import { useParams } from "next/navigation";

export default function PathCalculator() {
  const params = useParams();
  const aRaw = params.a as string;
  const bRaw = params.b as string;
  const a = parseFloat(aRaw);
  const b = parseFloat(bRaw);
  const sum = a + b;
  return (
    <div id="wd-path-calculator">
      <h1>Calculator – Path Parameters</h1>
      <p>Raw path segments (already decoded by Next.js):</p>
      <p>
        a = <code>{aRaw}</code>
      </p>
      <p>
        b = <code>{bRaw}</code>
      </p>
      <h2 className="text-green-700">Sum = {sum}</h2>
    </div>
  );
}`}</CodeBlock>
          <p>
            The pages above read data from the URL using either query or
            path parameters. The <code>UrlEncoding</code>{" "}component
            below illustrates how the parameters can be encoded into the
            URLs and then navigate to either the query calculator or the
            path calculator accordingly. A parent form can navigate either
            way: <code>router.push</code>{" "}for a click handler, or{" "}
            <code>Link</code>{" "}for a declarative href. Programmatic
            navigation builds a <code>URLSearchParams</code>{" "}object or
            an encoded path and then asks the router to go there.
            Declarative navigation puts the same URL on a{" "}
            <code>Link</code>{" "}so the browser can open it without a
            click handler. To practice encoding state in the URL, create
            the <code>UrlEncoding</code>{" "}component below and import it
            into Lab 4. Confirm the browser displays as shown.
          </p>
          <CodeBlock
            language="tsx"
            name="UrlEncoding"
            file="app/labs/lab4/UrlEncoding.tsx"
          >{`"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UrlEncoding() {
  const [a, setA] = useState("5");
  const [b, setB] = useState("10");
  const router = useRouter();
  const baseUrl = "/labs/lab4/url-encoding";

  const goToQueryVersion = () => {
    const params = new URLSearchParams();
    params.set("a", a);
    params.set("b", b);
    router.push(\`\${baseUrl}/query-params?\${params.toString()}\`);
  };

  const goToPathVersion = () => {
    const safeA = encodeURIComponent(a);
    const safeB = encodeURIComponent(b);
    router.push(\`\${baseUrl}/path-params/\${safeA}/\${safeB}\`);
  };

  return (
    <div id="wd-url-encoding" className="max-w-xl">
      <h2>Addition Calculator</h2>
      <p>
        Enter two numbers and navigate using either buttons (programmatic) or
        links (declarative):
      </p>
      <input
        type="number"
        value={a}
        onChange={(e) => setA(e.target.value)}
        className="mb-2 block w-full rounded border border-neutral-300 px-3 py-1.5"
        id="wd-url-a"
      />
      <input
        type="number"
        value={b}
        onChange={(e) => setB(e.target.value)}
        className="mb-3 block w-full rounded border border-neutral-300 px-3 py-1.5"
        id="wd-url-b"
      />
      <h4>Programmatic navigation (using router.push):</h4>
      <button
        type="button"
        onClick={goToQueryVersion}
        className="mb-2 w-full rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
        id="wd-url-query-programmatic"
      >
        {a} + {b} → Query Params (programmatic)
      </button>
      <button
        type="button"
        onClick={goToPathVersion}
        className="mb-3 w-full rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
        id="wd-url-path-programmatic"
      >
        {a} + {b} → Path Params (programmatic)
      </button>
      <h4>Declarative navigation (using Link):</h4>
      <Link
        href={\`\${baseUrl}/query-params?a=\${encodeURIComponent(a)}&b=\${encodeURIComponent(b)}\`}
        className="mb-2 block w-full rounded bg-blue-600 px-3 py-1.5 text-center text-sm font-medium text-white no-underline"
        id="wd-url-query-link"
      >
        {a} + {b} → Query Params (Link)
      </Link>
      <Link
        href={\`\${baseUrl}/path-params/\${encodeURIComponent(a)}/\${encodeURIComponent(b)}\`}
        className="mb-2 block w-full rounded bg-blue-600 px-3 py-1.5 text-center text-sm font-medium text-white no-underline"
        id="wd-url-path-link"
      >
        {a} + {b} → Path Params (Link)
      </Link>
      <hr />
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="UrlEncoding"
            file="app/labs/lab4/UrlEncoding.tsx"
            mode="styled"
          >
            <UrlEncoding />
          </LiveDemo>
          <p>
            Enter two numbers and try both the programmatic buttons and
            the declarative links. Try{" "}
            <LocalUrl href="/labs/lab4/url-encoding/query-params?a=5&b=10" />{" "}
            and{" "}
            <LocalUrl href="/labs/lab4/url-encoding/path-params/5/10" />.
            Both should print a sum of 15. Course ids in Kambaz already
            use the path strategy from <SectionLink to="3.9.4" />; query
            strings will matter later for search and filters. The URL is
            a third place to put state: it survives a refresh, it can be
            bookmarked, and it does not require a parent to pass props.
          </p>
          <OnYourOwn>
            Add a third number <code>c</code>{" "}to the form and include it in
            both the query URL and a new path segment{" "}
            <code>[c]</code>.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab4/UrlEncoding.tsx, keep any extra field I added. Add a sample third controlled input id="wd-url-c" with useState("2") and append c to the query string as c=. Do not rename my personal field or change my extra path segment.`}
          >
            Ask the assistant to add one extra sample query parameter:
          </WithAI>
        </Section>
      </Section>
    </Section>
  );
}
