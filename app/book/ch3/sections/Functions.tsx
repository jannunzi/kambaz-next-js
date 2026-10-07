import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import LegacyFunctions from "@/app/labs/lab3/LegacyFunctions";
import ArrowFunctions from "@/app/labs/lab3/ArrowFunctions";
import ImpliedReturn from "@/app/labs/lab3/ImpliedReturn";
import TemplateLiterals from "@/app/labs/lab3/TemplateLiterals";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function Functions() {
  return (
    <Section id="sec-3-3" title="3.3 JavaScript Functions">
      <p>
        Functions allow reusing an algorithm by wrapping it in a named,
        parameterized code block, and you can call that block from JSX the
        same way you call it from any other JavaScript. JavaScript supports
        two styles of functions based on the language history. Functions
        are declared using the following syntax.
      </p>
      <CodeBlock language="ts">{`function <functionName>(<parameterList>) {
  <functionBody>
}`}</CodeBlock>
      <p>
        To practice using functions, create a new component called{" "}
        <code>LegacyFunctions</code>{" "}based on the code below. Import this
        new component in the Lab 3 component and confirm the browser
        renders as shown — the sum prints both as a stored result and as a
        call inlined in JSX:
      </p>
      <CodeBlock
        language="tsx"
        name="LegacyFunctions"
        file="app/labs/lab3/LegacyFunctions.tsx"
      >{`function add(a: number, b: number) {
  return a + b;
}

export default function LegacyFunctions() {
  const twoPlusFour = add(2, 4);
  console.log(twoPlusFour);
  return (
    <div id="wd-legacy-functions">
      <h4>Functions</h4>
      <h5>Legacy ES5 functions</h5>
      twoPlusFour = {twoPlusFour}
      <br />
      add(2, 4) = {add(2, 4)}
      <hr />
    </div>
  );
}`}</CodeBlock>
      <p>
        The TypeScript annotations <code>a: number</code>{" "}and{" "}
        <code>b: number</code>{" "}are compile-time only. The{" "}
        <code>console.log</code>{" "}writes to the browser console — you will
        inspect that output in <SectionLink to="3.4.12" />:
      </p>
      <LiveDemo
        name="LegacyFunctions"
        file="app/labs/lab3/LegacyFunctions.tsx"
      >
        <LegacyFunctions />
      </LiveDemo>
      <p>
        Import <code>LegacyFunctions</code>{" "}into{" "}
        <code>app/labs/lab3/page.tsx</code>{" "}and render it after{" "}
        <code>NullUndefined</code>:
      </p>
      <CodeBlock
        language="tsx"
        name="Lab3 (after 3.3)"
        file="app/labs/lab3/page.tsx"
      >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";

export default function Lab3() {
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
    </div>
  );
}`}</CodeBlock>
      <OnYourOwn>
        Add a <code>function subtract</code>{" "}
        in the same file, call it with two numbers, and interpolate the
        result under the existing sum.
      </OnYourOwn>
      <WithAI
        prompt={`In app/labs/lab3/LegacyFunctions.tsx, keep function subtract if I already added it. After the existing add examples, add function multiply(a: number, b: number) { return a * b; }, call it as const threeTimesSeven = multiply(3, 7), console.log that result, and interpolate both threeTimesSeven and multiply(3, 7) under the sum. Do not overwrite subtract.`}
      >
        Paste this prompt so the assistant adds a sample{" "}
        <code>multiply</code>{" "}next to your subtraction:
      </WithAI>

      <Section
        level={3}
        id="sec-3-3-1"
        title="3.3.1 Arrow Functions"
      >
        <p>
          A new version of JavaScript was introduced in 2015 and is
          officially referred to as ECMAScript 6 or ES6. A new syntax for
          declaring functions was introduced which is less verbose and
          provides features we will explore throughout this course. This
          function syntax is often referred to as{" "}
          <strong>arrow functions</strong>, and you will use it for almost
          every callback in this course — <code>map</code>, event
          handlers, and predicates. The name is optional; you typically
          store the function in a <code>const</code>. To practice using
          ES6 arrow functions, create a new component called{" "}
          <code>ArrowFunctions</code>{" "}based on the code below. Import this
          new component in the Lab 3 component and confirm the browser
          renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="ArrowFunctions"
          file="app/labs/lab3/ArrowFunctions.tsx"
        >{`const subtract = (a: number, b: number) => {
  return a - b;
};

export default function ArrowFunctions() {
  const threeMinusOne = subtract(3, 1);
  console.log(threeMinusOne);
  return (
    <div id="wd-arrow-functions">
      <h4>New ES6 arrow functions</h4>
      threeMinusOne = {threeMinusOne}
      <br />
      subtract(3, 1) = {subtract(3, 1)}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The <code>=&gt;</code>{" "}replaces the <code>function</code>{" "}
          keyword. Parameters still sit in parentheses; the body still sits
          in curly braces when it needs a <code>return</code>:
        </p>
        <LiveDemo
          name="ArrowFunctions"
          file="app/labs/lab3/ArrowFunctions.tsx"
        >
          <ArrowFunctions />
        </LiveDemo>
        <p>
          Import <code>ArrowFunctions</code>{" "}into{" "}
          <code>app/labs/lab3/page.tsx</code>{" "}and render it last:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab3 (after 3.3.1)"
          file="app/labs/lab3/page.tsx"
        >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";

export default function Lab3() {
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
    </div>
  );
}`}</CodeBlock>
        <OnYourOwn>
          Declare an arrow{" "}
          <code>const add</code>{" "}in the same file and display{" "}
          <code>add(2, 4)</code>{" "}next to the subtraction.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/ArrowFunctions.tsx, keep const add if I already added it. After the subtract examples, add const multiply = (a: number, b: number) => { return a * b; }, then display multiply(3, 4) under the subtraction. Do not overwrite add.`}
        >
          Ask the assistant to add a sample arrow{" "}
          <code>multiply</code>{" "}— leave <code>add</code>{" "}as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-3-2"
        title="3.3.2 Implied Return"
      >
        <p>
          One of the new features of the new ES6 functions is implied
          returns: if the body of the function consists of just returning
          some value or expression, then the <code>return</code>{" "}
          statement is optional and can be replaced with just the value or
          expression. To practice this feature, create a new component
          called <code>ImpliedReturn</code>{" "}based on the code below.
          Import this new component in the Lab 3 component and confirm the
          browser renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="ImpliedReturn"
          file="app/labs/lab3/ImpliedReturn.tsx"
        >{`export default function ImpliedReturn() {
  const multiply = (a: number, b: number) => a * b;
  const fourTimesFive = multiply(4, 5);
  console.log(fourTimesFive);
  return (
    <div id="wd-implied-return">
      <h4>Implied return</h4>
      fourTimesFive = {fourTimesFive}
      <br />
      multiply(4, 5) = {multiply(4, 5)}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>(a, b) =&gt; a * b</code>{" "}is the same as{" "}
          <code>{`(a, b) => { return a * b; }`}</code>. That one-liner is
          the shape you will pass into <code>map</code>{" "}and{" "}
          <code>filter</code>{" "}in <SectionLink to="3.4" />:
        </p>
        <LiveDemo
          name="ImpliedReturn"
          file="app/labs/lab3/ImpliedReturn.tsx"
        >
          <ImpliedReturn />
        </LiveDemo>
        <p>
          Import <code>ImpliedReturn</code>{" "}into{" "}
          <code>app/labs/lab3/page.tsx</code>{" "}and render it last:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab3 (after 3.3.2)"
          file="app/labs/lab3/page.tsx"
        >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";

export default function Lab3() {
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
    </div>
  );
}`}</CodeBlock>
        <OnYourOwn>
          Add an implied-return{" "}
          <code>const square = (n: number) =&gt; n * n</code>{" "}and display{" "}
          <code>square(9)</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/ImpliedReturn.tsx, keep const square if I already added it. After the multiply examples, add const divide = (a: number, b: number) => a / b and interpolate divide(20, 4) the same way as multiply(4, 5). Do not overwrite square.`}
        >
          Ask the assistant to add a sample implied-return{" "}
          <code>divide</code>{" "}— leave <code>square</code>{" "}as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-3-3"
        title="3.3.3 Template Literals"
      >
        <p>
          Generating dynamic HTML consists of writing code that
          manipulates and concatenates strings to generate new HTML
          strings based on some program logic — one language writing code
          in another language, similar to what a compiler does. Working
          with strings can be error prone especially if you have to use
          lots of extra operations and variables to concatenate the
          resulting string. JavaScript template strings provide a better
          approach by allowing embedding expressions and algorithms right
          within strings themselves, including a ternary. To practice,
          implement a new component called <code>TemplateLiterals</code>{" "}
          based on the code below. Import this new component in Lab 3 and
          confirm the browser renders as shown. In your return statement,
          wrap the HTML output in a <code>div</code>{" "}whose id is{" "}
          <code>wd-template-literals</code>. Do not hard-code the results{" "}
          <code>5</code>, Welcome home alice, and so on; interpolate the
          variables <code>result1</code>, <code>result2</code>, and the
          rest:
        </p>
        <CodeBlock
          language="tsx"
          name="TemplateLiterals"
          file="app/labs/lab3/TemplateLiterals.tsx"
        >{`export default function TemplateLiterals() {
  const five = 2 + 3;
  const result1 = "2 + 3 = " + five;
  const result2 = \`2 + 3 = \${2 + 3}\`;
  const username = "alice";
  const greeting1 = \`Welcome home \${username}\`;
  const loggedIn = false;
  const greeting2 = \`Logged in: \${loggedIn ? "Yes" : "No"}\`;
  return (
    <div id="wd-template-literals">
      <h4>Template Literals</h4>
      result1 = {result1}
      <br />
      result2 = {result2}
      <br />
      greeting1 = {greeting1}
      <br />
      greeting2 = {greeting2}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>result1</code>{" "}and <code>result2</code>{" "}print the same
          text; the backtick form is the one you will keep using:
        </p>
        <LiveDemo
          name="TemplateLiterals"
          file="app/labs/lab3/TemplateLiterals.tsx"
        >
          <TemplateLiterals />
        </LiveDemo>
        <p>
          Import <code>TemplateLiterals</code>{" "}into{" "}
          <code>app/labs/lab3/page.tsx</code>{" "}and render it last:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab3 (after 3.3.3)"
          file="app/labs/lab3/page.tsx"
        >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";

export default function Lab3() {
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
    </div>
  );
}`}</CodeBlock>
        <OnYourOwn>
          Add a template that embeds your
          name and a ternary (for example whether a course is published)
          and interpolate that string into the same component.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/TemplateLiterals.tsx, keep any greeting that embeds my name. After the existing samples, add const published = true and const courseStatus = \`RS101 published: \${published ? "Yes" : "No"}\`, then interpolate courseStatus under greeting2. Do not change my personal template.`}
        >
          Paste this prompt so the assistant adds a sample published-status
          template — leave the one with your name as the personal bit:
        </WithAI>
      </Section>
    </Section>
  );
}
