import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import OfficialLink from "../../components/OfficialLink";
import { OnYourOwn, WithAI } from "../../components/Practice";
import ClickEvent from "@/app/labs/lab4/ClickEvent";
import PassingDataOnEvent from "@/app/labs/lab4/PassingDataOnEvent";
import PassingFunctionsDemo from "@/app/labs/lab4/PassingFunctionsDemo";
import CounterBroken from "@/app/labs/lab4/CounterBroken";
import Counter from "@/app/labs/lab4/Counter";
import BooleanStateVariables from "@/app/labs/lab4/BooleanStateVariables";
import StringStateVariables from "@/app/labs/lab4/StringStateVariables";
import DateStateVariable from "@/app/labs/lab4/DateStateVariable";
import ObjectStateVariable from "@/app/labs/lab4/ObjectStateVariable";
import ArrayStateVariable from "@/app/labs/lab4/ArrayStateVariable";

export default function EventsAndState() {
  return (
    <>
      <Section
        level={3}
        id="sec-4-2-1"
        title="4.2.1 Handling User Events"
      >
        <p>
          Users interact with the Web application user interface by
          clicking their mouse, typing at their keyboards, and, on mobile
          devices, tapping, swiping, and pinching at the screen. As they
          interact with the graphical user interface, they generate a
          stream of <strong>events</strong> that need to be handled by
          interpreting the user intent, modifying the Web application
          state, and rerendering the user interface to reflect the new
          state so the user can see that their actions are having the
          intended effect. HTML and CSS describe how a screen looks; the
          event stream describes what the user did. A click, a keystroke,
          and a form submit are events, and React listens with attributes
          such as <code>onClick</code>{" "}and <code>onChange</code>. The
          next few sections consider the various types of events users
          generate and how they can be handled. The next three
          subsections cover click events, passing data when handling
          events, and passing functions as parameters.
        </p>
        <p>
          The <code>onClick</code>{" "}attribute declares a function that
          handles clicks. Those listeners only run in the browser, so the
          file that uses them starts with{" "}
          <code>&quot;use client&quot;</code> — the same directive{" "}
          <SectionLink to="3.6.1" />{" "}introduced for pathname-aware
          components. In Next.js, JavaScript files execute on the server
          by default and cannot interact with the user. User interaction
          such as mouse clicks, keyboard typing, and dialog windows all
          need to talk to the browser and the computer hardware, and
          therefore need to run on the client. Files tagged with{" "}
          <code>&quot;use client&quot;</code>{" "}are not executed on the
          server for that interaction; they are sent to the browser to
          execute there. To practice handling a click event, create the{" "}
          <code>ClickEvent</code>{" "}component below and import it from
          the Lab 4 page. Confirm the browser displays as shown and that
          clicking the button opens an alert.
        </p>
        <CodeBlock
          language="tsx"
          name="ClickEvent"
          file="app/labs/lab4/ClickEvent.tsx"
        >{`"use client";

const hello = () => {
  alert("Hello World!");
};

export default function ClickEvent() {
  return (
    <div id="wd-click-event">
      <h2>Click Event</h2>
      <button
        type="button"
        onClick={hello}
        id="wd-onclick-hello"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Click Hello
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The handler is a function reference:{" "}
          <code>{`onClick={hello}`}</code>, not{" "}
          <code>{`onClick={hello()}`}</code>. Parentheses would call{" "}
          <code>hello</code>{" "}while React is rendering, before anyone
          clicks, and the alert would fire as soon as the page loaded.
          Passing the function by name tells React to invoke it later,
          when the click actually happens. You can also wrap
          several statements in an arrow when one click should call more
          than one function —{" "}
          <code>{`onClick={() => { hello(); lifeIs("Great!"); }}`}</code>{" "}
          — which you will use as soon as a handler needs an argument or
          more than one line of code. Click the button and confirm an
          alert appears:
        </p>
        <LiveDemo
          name="ClickEvent"
          file="app/labs/lab4/ClickEvent.tsx"
          mode="styled"
        >
          <ClickEvent />
        </LiveDemo>
        <OnYourOwn>
          In <code>ClickEvent.tsx</code>, add a second button with its own{" "}
          <code>id</code>{" "}that alerts a greeting that includes your name.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/ClickEvent.tsx, keep any extra button I added for myself. After the existing Click Hello button, add a sample button id="wd-onclick-goodbye" that alerts "Goodbye World!" using a goodbye function. Do not rename my personal button.`}
        >
          Paste this prompt so the assistant adds one extra sample click
          handler — leave your named greeting as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-2"
        title="4.2.2 Passing Data on Events"
      >
        <p>
          When handling an event, sometimes we need to pass parameters to
          the function that handles the event — which item to delete,
          which message to show, which two numbers to add. Write a
          function that takes those arguments, then wrap the call in a
          closure, an arrow function that React can invoke later, so the
          argument is not evaluated during render. If you do not wrap the
          function call inside a closure, you risk creating an infinite
          loop or at least running the handler on every render:{" "}
          <code>{`onClick={add(2, 3)}`}</code>{" "}calls{" "}
          <code>add</code>{" "}immediately and passes its return value,
          which is <code>undefined</code>, to <code>onClick</code>. To
          practice passing data when handling events, create the{" "}
          <code>PassingDataOnEvent</code>{" "}component below and import it
          from the Lab 4 page. Confirm the browser displays as shown.
        </p>
        <CodeBlock
          language="tsx"
          name="PassingDataOnEvent"
          file="app/labs/lab4/PassingDataOnEvent.tsx"
        >{`"use client";

const hello = () => {
  alert("Hello World!");
};

const lifeIs = (good: string) => {
  alert(good);
};

export default function PassingDataOnEvent() {
  return (
    <div id="wd-passing-data-on-event">
      <h2>Passing Data on Event</h2>
      <button
        type="button"
        onClick={hello}
        id="wd-pass-data-click"
        className="me-2 rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
      >
        Pass Data
      </button>
      <button
        type="button"
        onClick={() => lifeIs("Life is Good!")}
        id="wd-pass-data-parameter-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Pass Data Parameter
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The first button still uses a function reference because{" "}
          <code>hello</code>{" "}needs no arguments. The second button
          wraps <code>lifeIs(&quot;Life is Good!&quot;)</code>{" "}in an
          arrow so the string is only passed when the user clicks. Use
          that arrow syntax, and not{" "}
          <code>{`onClick={lifeIs("Life is Good!")}`}</code>, whenever
          the handler needs data. Click both buttons and confirm each
          alert matches the argument you passed:
        </p>
        <LiveDemo
          name="PassingDataOnEvent"
          file="app/labs/lab4/PassingDataOnEvent.tsx"
          mode="styled"
        >
          <PassingDataOnEvent />
        </LiveDemo>
        <OnYourOwn>
          Add a third button that passes a different string of your choosing
          into <code>lifeIs</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/PassingDataOnEvent.tsx, keep any extra button I added. After the existing buttons, add a sample button id="wd-pass-data-course-click" that calls lifeIs("Web Development") through an arrow function. Do not rename my personal button.`}
        >
          Ask the assistant to add one extra sample parameter button:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-3"
        title="4.2.3 Passing Functions"
      >
        <p>
          In JavaScript, functions can be treated as any other constant or
          variable, including passing them as parameters to other
          functions. A child can invoke behavior the parent owns if the
          parent passes the function as a prop. The example below passes
          function <code>sayHello</code>{" "}to component{" "}
          <code>PassingFunctions</code>. When the button is clicked,{" "}
          <code>sayHello</code>{" "}is invoked. That is why the Lab 4 page
          itself is a Client Component: the parent creates the function in
          the browser and hands the child a reference. To practice passing
          functions as parameters, create the{" "}
          <code>PassingFunctions</code>{" "}component below, declare a{" "}
          <code>sayHello</code>{" "}callback on the Lab 4 page, pass it as{" "}
          <code>{`theFunction={sayHello}`}</code>, and confirm it works
          as expected.
        </p>
        <CodeBlock
          language="tsx"
          name="PassingFunctions"
          file="app/labs/lab4/PassingFunctions.tsx"
        >{`"use client";

export default function PassingFunctions({
  theFunction,
}: {
  theFunction: () => void;
}) {
  return (
    <div id="wd-passing-functions">
      <h2>Passing Functions</h2>
      <button
        type="button"
        onClick={theFunction}
        id="wd-pass-functions-click"
        className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Invoke the Function
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          On the Lab 4 page the callback is a small function that alerts{" "}
          <code>&quot;Hello from Lab 4&quot;</code>. The child does not
          know what the function does; it only knows the type{" "}
          <code>{`() => void`}</code>{" "}and invokes it on click. That
          same pattern will later let a todo item ask a store to delete a
          row without owning the array itself. Click the button in the
          demo and confirm the parent&apos;s alert appears:
        </p>
        <LiveDemo
          name="PassingFunctions"
          file="app/labs/lab4/PassingFunctions.tsx"
          mode="styled"
        >
          <PassingFunctionsDemo />
        </LiveDemo>
        <OnYourOwn>
          Pass a second function from <code>page.tsx</code>{" "}that alerts
          your name, and add a second button in{" "}
          <code>PassingFunctions</code>{" "}that calls it.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/PassingFunctions.tsx and app/labs/lab4/page.tsx, keep any extra function I passed. Add a sample prop theOtherFunction: () => void and a button id="wd-pass-functions-other-click" that calls it. From page.tsx pass a function that alerts "Sample from parent". Do not rename my personal function.`}
        >
          Ask the assistant to add one extra sample function prop:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-4"
        title="4.2.4 useState and the Counter"
      >
        <p>
          Web applications implemented with React can be considered as a
          set of functions that transform a set of data structures into an
          equivalent user interface. The collection of data structures and
          values is often referred to as an application state. So far we
          have explored React applications that transform a static data
          set into a static user interface. We will now consider how the
          state can change over time as users interact with the user
          interface and how those state changes can be represented on the
          screen. Users interact with an application by clicking,
          dragging, and typing, filling out forms, clicking buttons, and
          scrolling through data. As they interact they create a stream of
          events that can be handled by a set of event-handling functions,
          often referred to as controllers. Controllers handle user events
          and convert them into changes in the application&apos;s state.
          Applications render those state changes into corresponding
          changes in the user interface. In Web applications, user
          interface changes consist of changes to the{" "}
          <OfficialLink href="https://dom.spec.whatwg.org/">
            DOM
          </OfficialLink>
          .
        </p>
        <p>
          Updating the DOM with JavaScript is slow and can degrade the
          performance of Web applications. React optimizes the process by
          creating a <strong>virtual DOM</strong>, a more compact and
          efficient version of the real DOM. When React renders something
          on the screen, it first updates the virtual DOM, and then
          converts these changes into updates to the actual DOM. To avoid
          unnecessary and slow updates, React only updates the real DOM if
          there have been changes to the virtual DOM. We can participate
          in this process of state change and DOM updates by using the{" "}
          <OfficialLink href="https://react.dev/reference/react/useState">
            useState
          </OfficialLink>{" "}
          hook. The hook is used to declare state variables that we want
          to affect the DOM rendering. The next subsections declare
          integer, boolean, string, date, object, and array state
          variables with that same hook. The syntax of the hook is a
          pair:
        </p>
        <CodeBlock language="tsx">{`const [stateVariable, setStateVariable] = useState(initialStateValue);`}</CodeBlock>
        <p>
          The <code>useState</code>{" "}hook takes as argument the initial
          value of a state variable and returns an array whose first item
          is the initialized state variable and whose second item is a
          mutator function that allows updating it. The array destructor
          syntax is commonly used to bind these items to local constants
          as shown above. The mutator function not only changes the value
          of the state variable, but it also notifies React that it should
          check if the state has caused changes to the virtual DOM and
          therefore make changes to the actual DOM. A plain{" "}
          <code>let</code>{" "}can change in memory and the heading will
          not move, because React does not know to paint again. To
          illustrate the point of the virtual DOM and how changes in
          state affect the actual DOM, create{" "}
          <code>CounterBroken.tsx</code>{" "}first so the failure is
          visible. A <code>count</code>{" "}variable is initialized and
          rendered on the screen. Buttons Up and Down update the variable
          in memory, but the heading stays at 7 because as far as React is
          concerned there have been no changes to the virtual DOM.
        </p>
        <CodeBlock
          language="tsx"
          name="CounterBroken"
          file="app/labs/lab4/CounterBroken.tsx"
        >{`"use client";

export default function CounterBroken() {
  let count = 7;
  return (
    <div id="wd-counter-broken">
      <h2>Broken Counter: {count}</h2>
      <button
        type="button"
        onClick={() => {
          count++;
        }}
        id="wd-counter-broken-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => {
          count--;
        }}
        id="wd-counter-broken-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="CounterBroken"
          file="app/labs/lab4/CounterBroken.tsx"
          mode="styled"
        >
          <CounterBroken />
        </LiveDemo>
        <p>
          For the DOM to be updated as expected, we need to tell React
          that changes to a particular variable are indeed relevant to
          changes in the DOM. To do this, use the{" "}
          <code>useState</code>{" "}hook to declare the state variable, and
          update it using the mutator function. Calling the setter queues
          a new render with the new value. Implement the{" "}
          <code>Counter</code>{" "}component below, import it in Lab 4, and
          confirm it works as expected. Do the same with the rest of the
          exercises that follow.
        </p>
        <CodeBlock
          language="tsx"
          name="Counter"
          file="app/labs/lab4/Counter.tsx"
        >{`"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(7);
  return (
    <div id="wd-counter">
      <h2>Counter: {count}</h2>
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        id="wd-counter-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => setCount(count - 1)}
        id="wd-counter-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Click Up and Down and confirm the heading changes. The mutator
          is called with the next integer, React compares the virtual DOM
          to the previous tree, and the heading is the part that actually
          writes to the real DOM. That is the same integer you will
          rebuild with Context, Zustand, and Redux so the three APIs stay
          comparable:
        </p>
        <LiveDemo name="Counter" file="app/labs/lab4/Counter.tsx" mode="styled">
          <Counter />
        </LiveDemo>
        <OnYourOwn>
          Add a Reset button that sets the counter back to 7.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/Counter.tsx, keep any extra button I added. After Down, add a sample button id="wd-counter-reset-click" that calls setCount(7). Do not rename my personal button.`}
        >
          Ask the assistant to add a sample Reset after your own control:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-5"
        title="4.2.5 Boolean State Variables"
      >
        <p>
          The <code>useState</code>{" "}hook works with all JavaScript data
          types and structures including booleans, integers, strings,
          numbers, arrays, and objects. The exercise below illustrates
          using the hook with boolean state variables. The variable is
          used to hide or show a DIV as well as render a checkbox as
          checked or not. Also note the use of <code>onChange</code>{" "}
          on the checkbox to set the value of the state variable: bind{" "}
          <code>checked</code>{" "}to the current boolean and toggle it
          when the user clicks. Boolean state is a natural fit for
          checkboxes and for markup that should appear only when a flag is
          true. To practice with boolean state, create the{" "}
          <code>BooleanStateVariables</code>{" "}component below and import
          it from the Lab 4 page. Confirm the browser displays as shown.
        </p>
        <CodeBlock
          language="tsx"
          name="BooleanStateVariables"
          file="app/labs/lab4/BooleanStateVariables.tsx"
        >{`"use client";

import { useState } from "react";

export default function BooleanStateVariables() {
  const [done, setDone] = useState(true);
  return (
    <div id="wd-boolean-state-variables">
      <h2>Boolean State Variables</h2>
      <p>{done ? "Done" : "Not done"}</p>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={done}
          onChange={() => setDone(!done)}
          id="wd-boolean-checkbox"
        />
        Done
      </label>
      {done && <div className="mt-2 rounded bg-yellow-100 p-2">Yay! Done</div>}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The paragraph chooses its text with a ternary on{" "}
          <code>done</code>. The checkbox is a controlled input:{" "}
          <code>checked={"{done}"}</code>{" "}shows the current flag, and{" "}
          <code>onChange</code>{" "}writes the opposite value back into
          state. The yellow banner uses the same short-circuit you
          practiced in <SectionLink to="3.2.4" />: when{" "}
          <code>done</code>{" "}is true the DIV appears; when it is false
          the right-hand side never runs. Toggle the checkbox and confirm
          the heading, the box, and the banner all move together:
        </p>
        <LiveDemo
          name="BooleanStateVariables"
          file="app/labs/lab4/BooleanStateVariables.tsx"
          mode="styled"
        >
          <BooleanStateVariables />
        </LiveDemo>
        <OnYourOwn>
          Add a second boolean (for example <code>urgent</code>) with its
          own checkbox and a short message that appears only when it is
          true.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/BooleanStateVariables.tsx, keep any extra boolean I added. After the Done checkbox, add const [saved, setSaved] = useState(false), a checkbox id="wd-boolean-saved", and {saved && <div>Saved</div>}. Do not rename my personal boolean.`}
        >
          Ask the assistant to add one extra sample boolean:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-6"
        title="4.2.6 String State Variables"
      >
        <p>
          The <code>StringStateVariables</code>{" "}exercise illustrates
          using <code>useState</code>{" "}with string state variables. A{" "}
          <strong>controlled</strong> input uses <code>value</code>{" "}for
          what the field shows and <code>onChange</code>{" "}to write each
          keystroke back into state. The input field&apos;s value is
          initialized to the <code>firstName</code>{" "}state variable. The{" "}
          <code>onChange</code>{" "}attribute invokes the{" "}
          <code>setFirstName</code>{" "}mutator to update the state
          variable. The <code>e.target.value</code>{" "}contains the value
          of the input field and is used to update the current value of
          the state variable. Using <code>defaultValue</code>{" "}would
          leave the field uncontrolled after the first render — the
          heading and the input could drift apart. Lab 1 used{" "}
          <code>defaultValue</code>{" "}because there was no state yet;
          from here on, bind <code>value</code>. To practice with string
          state, create the <code>StringStateVariables</code>{" "}component
          below and import it from the Lab 4 page. Confirm the browser
          displays as shown.
        </p>
        <CodeBlock
          language="tsx"
          name="StringStateVariables"
          file="app/labs/lab4/StringStateVariables.tsx"
        >{`"use client";

import { useState } from "react";

export default function StringStateVariables() {
  const [firstName, setFirstName] = useState("John");
  return (
    <div id="wd-string-state-variables">
      <h2>String State Variables</h2>
      <p>{firstName}</p>
      <input
        className="w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        id="wd-first-name"
      />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          This is two-way data binding for a text field: the paragraph
          reads <code>firstName</code>, the input writes it on every
          keystroke, and React rerenders so both stay in sync. Type in the
          input and watch the paragraph update:
        </p>
        <LiveDemo
          name="StringStateVariables"
          file="app/labs/lab4/StringStateVariables.tsx"
          mode="styled"
        >
          <StringStateVariables />
        </LiveDemo>
        <OnYourOwn>
          Add a <code>lastName</code>{" "}state string and a second controlled
          input. Show both names together under the heading.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/StringStateVariables.tsx, keep any extra string I added. After firstName, add const [nickName, setNickName] = useState("JD") with a controlled input id="wd-nick-name" and interpolate nickName under firstName. Do not rename my personal field.`}
        >
          Ask the assistant to add one extra sample string field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-7"
        title="4.2.7 Date State Variables"
      >
        <p>
          The <code>DateStateVariable</code>{" "}component illustrates how
          to work with date state variables. The{" "}
          <code>startDate</code>{" "}state variable is initialized to the
          current date using <code>new Date()</code>, which has a string
          representation that is not what an HTML date input expects. HTML
          date inputs speak <code>YYYY-MM-DD</code>. A JavaScript{" "}
          <code>Date</code>{" "}does not. The{" "}
          <code>dateObjectToHtmlDateString</code>{" "}function converts a{" "}
          <code>Date</code>{" "}object into that format so the field&apos;s{" "}
          <code>value</code>{" "}attribute matches what the browser
          picker requires. Changes in the date field are handled by the{" "}
          <code>onChange</code>{" "}attribute, which constructs a new{" "}
          <code>Date</code>{" "}from <code>e.target.value</code>{" "}and
          updates the state with the <code>setStartDate</code>{" "}mutator.
          To practice with date state, create the{" "}
          <code>DateStateVariable</code>{" "}component below and import it
          from the Lab 4 page. Confirm the browser displays as shown.
        </p>
        <CodeBlock
          language="tsx"
          name="DateStateVariable"
          file="app/labs/lab4/DateStateVariable.tsx"
        >{`"use client";

import { useState } from "react";

function dateObjectToHtmlDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return \`\${year}-\${month}-\${day}\`;
}

export default function DateStateVariable() {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div id="wd-date-state-variables">
      <h2>Date State Variables</h2>
      <h3>{JSON.stringify(startDate)}</h3>
      <h3>{dateObjectToHtmlDateString(startDate)}</h3>
      <input
        type="date"
        className="rounded border border-neutral-300 px-3 py-1.5"
        value={dateObjectToHtmlDateString(startDate)}
        onChange={(e) => setStartDate(new Date(e.target.value))}
        id="wd-start-date"
      />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The first heading shows the raw date object through{" "}
          <code>JSON.stringify</code>; the second shows the{" "}
          <code>YYYY-MM-DD</code>{" "}string the picker understands. Pick a
          new date and confirm both headings update. Assignment due dates
          and course start dates in Kambaz will use this same conversion
          later:
        </p>
        <LiveDemo
          name="DateStateVariable"
          file="app/labs/lab4/DateStateVariable.tsx"
          mode="styled"
        >
          <DateStateVariable />
        </LiveDemo>
        <OnYourOwn>
          Add an <code>endDate</code>{" "}state value and a second date input.
          Show both formatted strings.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/DateStateVariable.tsx, keep any extra date I added. After startDate, add const [dueDate, setDueDate] = useState(new Date()) with a type="date" input id="wd-due-date" bound the same way as startDate. Do not rename my personal date.`}
        >
          Ask the assistant to add one extra sample date field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-8"
        title="4.2.8 Object State Variables"
      >
        <p>
          The <code>ObjectStateVariable</code>{" "}component demonstrates
          how to work with object state variables. We declare a{" "}
          <code>person</code>{" "}object state variable with initial
          property values <code>name</code>{" "}and <code>age</code>. The
          object is rendered on the screen using{" "}
          <code>JSON.stringify</code>{" "}so you can see the changes in
          real time. Two input fields are initialized to the object&apos;s{" "}
          <code>person.name</code>{" "}string property and the object&apos;s{" "}
          <code>person.age</code>{" "}number property. As the user types,
          the <code>onChange</code>{" "}attribute updates the object&apos;s
          property using the <code>setPerson</code>{" "}mutator. The object
          is updated by creating a new object copied from the previous
          value using the spread operator{" "}
          <code>{`{ ...person }`}</code>, and then overriding the{" "}
          <code>name</code>{" "}or <code>age</code>{" "}property with the
          new <code>target.value</code>. When the state value is an
          object, replace it with a new one rather than editing the old
          one in place. Writing{" "}
          <code>person.name = e.target.value</code>{" "}would edit the old
          object in place, and React may skip the render because the
          reference did not change. To practice with object state, create
          the <code>ObjectStateVariable</code>{" "}component below and
          import it from the Lab 4 page. Confirm the browser displays as
          shown.
        </p>
        <CodeBlock
          language="tsx"
          name="ObjectStateVariable"
          file="app/labs/lab4/ObjectStateVariable.tsx"
        >{`"use client";

import { useState } from "react";

export default function ObjectStateVariable() {
  const [person, setPerson] = useState({ name: "Peter", age: 24 });
  return (
    <div id="wd-object-state-variables">
      <h2>Object State Variables</h2>
      <pre>{JSON.stringify(person, null, 2)}</pre>
      <input
        className="mb-2 block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={person.name}
        onChange={(e) => setPerson({ ...person, name: e.target.value })}
        id="wd-person-name"
      />
      <input
        type="number"
        className="block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={person.age}
        onChange={(e) =>
          setPerson({ ...person, age: parseInt(e.target.value) || 0 })
        }
        id="wd-person-age"
      />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Each keystroke builds a new object: the spread copies every
          field you did not touch, and the named field overrides the one
          you did. The age field parses the string from the number input
          so the property stays a number. Type in either field and watch
          the JSON preview update:
        </p>
        <LiveDemo
          name="ObjectStateVariable"
          file="app/labs/lab4/ObjectStateVariable.tsx"
          mode="styled"
        >
          <ObjectStateVariable />
        </LiveDemo>
        <OnYourOwn>
          Add a <code>city</code>{" "}property to the person object and a
          controlled input that updates it with the spread pattern.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/ObjectStateVariable.tsx, keep any extra field I added. Add a sample city: "Boston" on the initial person object and a controlled input id="wd-person-city" that sets city with { ...person, city: e.target.value }. Do not rename my personal field.`}
        >
          Ask the assistant to add one extra sample object field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-9"
        title="4.2.9 Array State Variables"
      >
        <p>
          The <code>ArrayStateVariable</code>{" "}component demonstrates
          how to work with array state variables. An array of integers is
          declared as a state variable, and functions{" "}
          <code>addElement</code>{" "}and <code>deleteElement</code>{" "}
          add and remove elements. We render the array as a map of line
          items in an unordered list. We render the array&apos;s value and
          a Delete button for each element. Clicking Delete calls{" "}
          <code>deleteElement</code>{" "}and passes the index of the
          element we want to remove. That function computes a new array
          filtering out the element by its position and updates the state
          variable to contain a new array without the element we filtered
          out. Clicking Add Element invokes{" "}
          <code>addElement</code>, which computes a new array with a copy
          of the previous array spread at the beginning and a new random
          element at the end. Arrays follow the same
          replace-don&apos;t-mutate rule as objects: compute a new array,
          append with spread, and remove with <code>filter</code>. The
          Delete button receives the index through an arrow so it is not
          called during render. To practice with array state, create the{" "}
          <code>ArrayStateVariable</code>{" "}component below, import it
          from the Lab 4 page, and confirm it works as expected. Style the
          list with Tailwind so the output renders as shown.
        </p>
        <CodeBlock
          language="tsx"
          name="ArrayStateVariable"
          file="app/labs/lab4/ArrayStateVariable.tsx"
        >{`"use client";

import { useState } from "react";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((_item, i) => i !== index));
  };
  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <button
        type="button"
        onClick={addElement}
        id="wd-add-element-click"
        className="mb-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Add Element
      </button>
      <ul className="m-0 max-w-xs list-none p-0">
        {array.map((item, index) => (
          <li
            key={\`\${item}-\${index}\`}
            className="mb-1 flex items-center justify-between rounded border border-neutral-200 bg-green-50 px-3 py-1"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => deleteElement(index)}
              id={\`wd-delete-element-\${index}-click\`}
              className="rounded bg-red-600 px-2 py-0.5 text-sm font-medium text-white"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Add a few random numbers, then delete one from the middle, and
          confirm the list redraws without mutating the old array in
          place. Kambaz courses and modules will use this same spread and{" "}
          <code>filter</code>{" "}pattern inside a Zustand store:
        </p>
        <LiveDemo
          name="ArrayStateVariable"
          file="app/labs/lab4/ArrayStateVariable.tsx"
          mode="styled"
        >
          <ArrayStateVariable />
        </LiveDemo>
        <OnYourOwn>
          Add a Clear button that sets the array back to{" "}
          <code>[1, 2, 3, 4, 5]</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/ArrayStateVariable.tsx, keep any extra button I added. After Add Element, add a sample button id="wd-clear-array-click" that calls setArray([1, 2, 3, 4, 5]). Do not rename my personal button.`}
        >
          Ask the assistant to add a sample Clear after your own control:
        </WithAI>
      </Section>
    </>
  );
}
