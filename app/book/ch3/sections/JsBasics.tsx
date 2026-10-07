import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import VariablesAndConstants from "@/app/labs/lab3/VariablesAndConstants";
import VariableTypes from "@/app/labs/lab3/VariableTypes";
import BooleanVariables from "@/app/labs/lab3/BooleanVariables";
import IfElse from "@/app/labs/lab3/IfElse";
import TernaryOperator from "@/app/labs/lab3/TernaryOperator";
import ConditionalOutputIfElse from "@/app/labs/lab3/ConditionalOutputIfElse";
import ConditionalOutputInline from "@/app/labs/lab3/ConditionalOutputInline";
import NullUndefined from "@/app/labs/lab3/NullUndefined";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function JsBasics() {
  return (
    <>
      <Section
        level={3}
        id="sec-3-2-1"
        title="3.2.1 Variables and Constants"
      >
        <p>
          Variables can store state information about applications such as
          user information, preferences, courses, and enrollments.
          JavaScript offers three declarations: <code>var</code>{" "}is
          function-scoped and the old default; <code>let</code>{" "}is
          block-scoped and the usual choice when the value will change;
          and <code>const</code>{" "}is block-scoped and not reassigned. To
          practice declaring variables and constants, create the{" "}
          <code>VariablesAndConstants</code>{" "}component below and import
          it from the Lab 3 component. Confirm the browser displays as
          shown. We will be creating several components to practice
          various features of the JavaScript language; import them into
          the Lab 3 page component and confirm the output is as described
          for each of the lab exercises.
        </p>
        <CodeBlock
          language="tsx"
          name="VariablesAndConstants"
          file="app/labs/lab3/VariablesAndConstants.tsx"
        >{`export default function VariablesAndConstants() {
  var functionScoped = 2;
  let blockScoped = 5;
  const constant1 = functionScoped - blockScoped;
  return (
    <div id="wd-variables-and-constants">
      <h4>Variables and Constants</h4>
      functionScoped = {functionScoped}
      <br />
      blockScoped = {blockScoped}
      <br />
      constant1 = {constant1}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Curly braces in JSX interpolate a JavaScript expression into the
          markup, so <code>{`{functionScoped}`}</code>{" "}prints{" "}
          <code>2</code>. The constant is the difference of the other two,
          so the page shows <code>-3</code>:
        </p>
        <LiveDemo
          name="VariablesAndConstants"
          file="app/labs/lab3/VariablesAndConstants.tsx"
        >
          <VariablesAndConstants />
        </LiveDemo>
        <p>
          Import the new component at the top of{" "}
          <code>page.tsx</code>{" "}and render it under the Lab 3 heading — the
          same import-and-place pattern you will repeat for every exercise
          in this chapter.
        </p>
        <OnYourOwn>
          Still in{" "}
          <code>VariablesAndConstants.tsx</code>, declare one more{" "}
          <code>let</code>{" "}and one more <code>const</code>{" "}(for example
          a name and a computed greeting) and interpolate both into the
          JSX so they appear under the existing values.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/VariablesAndConstants.tsx, keep any extra let/const I added for myself. After the existing sample values, declare const sampleSum = functionScoped + blockScoped and interpolate it as sampleSum = {sampleSum} under the other values. Do not rename my personal variables.`}
        >
          Paste this prompt so the assistant adds one extra sample constant —
          leave your name and greeting as the personal bit:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-2-2"
        title="3.2.2 Variable Types"
      >
        <p>
          JavaScript declares several datatypes such as Number, String,
          Date, and so on. The <code>typeof</code>{" "}operator reports that
          type as a string. To practice with variable types, create the{" "}
          <code>VariableTypes</code>{" "}component shown below and import it
          at the bottom of the Lab 3 component. Confirm that the browser
          renders as shown. Note that we had to convert the boolean
          variable into a string type before it could render in the
          browser — that conversion is explained after the sample.
        </p>
        <CodeBlock
          language="tsx"
          name="VariableTypes"
          file="app/labs/lab3/VariableTypes.tsx"
        >{`export default function VariableTypes() {
  let numberVariable = 123;
  let floatingPointNumber = 234.345;
  let stringVariable = "Hello World!";
  let booleanVariable = true;
  let isNumber = typeof numberVariable;
  let isString = typeof stringVariable;
  let isBoolean = typeof booleanVariable;
  return (
    <div id="wd-variable-types">
      <h4>Variables Types</h4>
      numberVariable = {numberVariable}
      <br />
      floatingPointNumber = {floatingPointNumber}
      <br />
      stringVariable = {stringVariable}
      <br />
      booleanVariable = {booleanVariable + ""}
      <br />
      isNumber = {isNumber}
      <br />
      isString = {isString}
      <br />
      isBoolean = {isBoolean}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          JSX does not render a bare boolean —{" "}
          <code>{`{true}`}</code>{" "}produces nothing on the page. Concatenating
          an empty string, <code>booleanVariable + &quot;&quot;</code>,
          coerces the value to <code>&quot;true&quot;</code>{" "}or{" "}
          <code>&quot;false&quot;</code>{" "}so it is visible:
        </p>
        <LiveDemo name="VariableTypes" file="app/labs/lab3/VariableTypes.tsx">
          <VariableTypes />
        </LiveDemo>
        <OnYourOwn>
          Add a second string and a second
          number, plus <code>typeof</code>{" "}for each, and display them in
          the same component.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/VariableTypes.tsx, keep any extra string and number I added. After the existing samples, add let sampleCount = 42 and let sampleLabel = "Lab 3", plus typeof for each, and display them the same way (value, then the typeof string). Do not change my personal variables.`}
        >
          Ask the assistant to add one extra sample string and number — not
          the ones you invented:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-2-3"
        title="3.2.3 Boolean Variables"
      >
        <p>
          To practice with Boolean data types, create a component called{" "}
          <code>BooleanVariables</code>{" "}and import it in the Lab 3
          component. Use the previous lab exercises as a guide. Booleans
          are the raw material of decisions: <code>&amp;&amp;</code>{" "}for
          and, <code>||</code>{" "}for or, <code>!</code>{" "}for not, and
          comparisons. Always compare with <code>===</code>{" "}and{" "}
          <code>!==</code>{" "}— they test value <em>and</em>{" "}type — not{" "}
          <code>==</code>, which coerces types and hides bugs. The new
          component should add a section called Boolean Variables that
          displays each of the new variables so that the browser renders
          as shown. You might need to cast the boolean values to string by
          concatenating an empty string, for example{" "}
          <code>{`false3 = {false3 + ""}`}</code>.
        </p>
        <CodeBlock
          language="tsx"
          name="BooleanVariables"
          file="app/labs/lab3/BooleanVariables.tsx"
        >{`export default function BooleanVariables() {
  let numberVariable = 123,
    floatingPointNumber = 234.345;
  let true1 = true,
    false1 = false;
  let false2 = true1 && false1;
  let true2 = true1 || false1;
  let true3 = !false2;
  let true4 = numberVariable === 123;
  let true5 = floatingPointNumber !== 321.432;
  let false3 = numberVariable < 100;
  return (
    <div id="wd-boolean-variables">
      <h4>Boolean Variables</h4>
      true1 = {true1 + ""}
      <br />
      false1 = {false1 + ""}
      <br />
      false2 = {false2 + ""}
      <br />
      true2 = {true2 + ""}
      <br />
      true3 = {true3 + ""}
      <br />
      true4 = {true4 + ""}
      <br />
      true5 = {true5 + ""}
      <br />
      false3 = {false3 + ""}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Concatenate <code>+ &quot;&quot;</code>{" "}again so each boolean
          prints as text:
        </p>
        <LiveDemo
          name="BooleanVariables"
          file="app/labs/lab3/BooleanVariables.tsx"
        >
          <BooleanVariables />
        </LiveDemo>
        <OnYourOwn>
          Add one more comparison that uses{" "}
          <code>===</code>{" "}(for example a string compared to another
          string) and display it the same way — then deliberately try{" "}
          <code>==</code>{" "}with <code>&quot;123&quot;</code>{" "}and{" "}
          <code>123</code>{" "}in the console so you see why{" "}
          <code>===</code>{" "}is the safer habit.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/BooleanVariables.tsx, keep any extra comparison I added. After the existing booleans, add const true6 = numberVariable !== 0 and display it as true6 = {true6 + ""} the same way as the others. Do not change my personal comparison.`}
        >
          Ask the assistant to add one extra sample comparison on the page —
          leave yours (and the console experiment) as the personal bit:
        </WithAI>
      </Section>

      <Section level={3} id="sec-3-2-4" title="3.2.4 Conditionals">
        <p>
          Conditional expressions allow scripts to make decisions based on
          predicates that compare values and variables. Scripts can decide
          to execute different parts of the code based on the result of
          these predicates using <code>if</code>/<code>else</code>{" "}and
          other constructs. The most common use is an{" "}
          <code>if</code>/<code>else</code>{" "}that evaluates a predicate
          and then runs one of two code blocks depending on whether the
          predicate is true or false — though in JSX you more often embed
          that choice in the tree itself. To practice with{" "}
          <code>if</code>/<code>else</code>, create a component called{" "}
          <code>IfElse</code>{" "}based on the code shown below. Import it
          into Lab 3 and confirm it renders a section labeled If Else as
          shown. The <code>true1</code>{" "}paragraph is only rendered if{" "}
          <code>true1</code>{" "}is true:
        </p>
        <CodeBlock
          language="tsx"
          name="IfElse"
          file="app/labs/lab3/IfElse.tsx"
        >{`export default function IfElse() {
  let true1 = true,
    false1 = false;
  return (
    <div id="wd-if-else">
      <h4>If Else</h4>
      {true1 && <p>true1</p>}
      {!false1 ? <p>!false1</p> : <p>false1</p>}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The <code>&amp;&amp;</code>{" "}form is a short circuit: if{" "}
          <code>true1</code>{" "}is true, React renders the paragraph; if it is
          false, the right-hand side never runs and nothing appears. The{" "}
          <code>?</code>/<code>:</code>{" "}form (the ternary, next section)
          always picks one of two branches:
        </p>
        <LiveDemo name="IfElse" file="app/labs/lab3/IfElse.tsx">
          <IfElse />
        </LiveDemo>
        <OnYourOwn>
          Flip <code>true1</code>{" "}to <code>false</code>{" "}and confirm
          the first paragraph disappears, then restore it. Then add a third
          paragraph that is visible: <code>{`{!false1 && <p>not false1</p>}`}</code>
          . The If Else section then shows three paragraphs:{" "}
          <code>true1</code>, <code>!false1</code>, and{" "}
          <code>not false1</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/IfElse.tsx, keep true1 as true (do not flip it for me). After the existing paragraphs, add {false1 && <p>false1</p>} so a third short-circuit example stays hidden. Do not change the ternary that is already there.`}
        >
          Paste this prompt so the assistant adds a short-circuit paragraph
          that stays hidden while <code>false1</code>{" "}is false. The page
          still shows the same three paragraphs:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-2-5"
        title="3.2.5 Ternary Operator"
      >
        <p>
          Ternary conditional operators are a concise alternative to{" "}
          <code>if</code>/<code>else</code>{" "}statements. A ternary takes
          three pieces: a predicate expression that evaluates to true or
          false followed by a question mark (<code>?</code>); an
          expression that evaluates if the predicate is true followed by a
          colon (<code>:</code>); and an expression that evaluates if the
          predicate is false. To practice the ternary operator, create a
          new component called <code>TernaryOperator</code>{" "}based on the
          code shown below, import it into Lab 3, and confirm the browser
          renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="TernaryOperator"
          file="app/labs/lab3/TernaryOperator.tsx"
        >{`export default function TernaryOperator() {
  let loggedIn = true;
  return (
    <div id="wd-ternary-operator">
      <h4>Logged In</h4>
      {loggedIn ? <p>Welcome</p> : <p>Please login</p>}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          With <code>loggedIn</code>{" "}true, the page greets the user; set it
          to <code>false</code>{" "}and the other paragraph appears instead:
        </p>
        <LiveDemo
          name="TernaryOperator"
          file="app/labs/lab3/TernaryOperator.tsx"
        >
          <TernaryOperator />
        </LiveDemo>
        <OnYourOwn>
          Set <code>loggedIn</code>{" "}to <code>false</code>{" "}and confirm
          the greeting switches to &quot;Please login&quot;, then set it
          back. Then add a second ternary on a new{" "}
          <code>const hour = 9</code>{" "}that renders{" "}
          <code>&lt;p&gt;Good morning&lt;/p&gt;</code>{" "}when{" "}
          <code>hour &lt; 12</code>{" "}and{" "}
          <code>&lt;p&gt;Good afternoon&lt;/p&gt;</code>{" "}otherwise. The
          section then shows Welcome and Good morning.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/TernaryOperator.tsx, keep loggedIn as true. After the Welcome/Please login ternary, add const premium = false and a second ternary that renders <p>Premium</p> or <p>Free</p>. Do not change the existing greeting.`}
        >
          Ask the assistant to add a third ternary for a{" "}
          <code>premium</code>{" "}flag. The section then also shows{" "}
          <code>Free</code>:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-2-6"
        title="3.2.6 Generating Conditional Output"
      >
        <p>
          With boolean expressions we can render content based on some
          logic. The following example decides rendering one content
          versus another based on a simple boolean constant{" "}
          <code>loggedIn</code>. If a user is <code>loggedIn</code>, then
          the component renders a greeting; otherwise it suggests the user
          should login. The same decision can live in the
          component&apos;s <code>return</code>{" "}path — two different trees
          — or inline in one tree. Implement{" "}
          <code>ConditionalOutputIfElse</code>{" "}to practice conditional
          rendering, starting with an <code>if</code>/<code>else</code>{" "}
          that returns a different heading:
        </p>
        <CodeBlock
          language="tsx"
          name="ConditionalOutputIfElse"
          file="app/labs/lab3/ConditionalOutputIfElse.tsx"
        >{`export default function ConditionalOutputIfElse() {
  const loggedIn = true;
  if (loggedIn) {
    return (
      <h2 id="wd-conditional-output-if-else-welcome">Welcome If Else</h2>
    );
  } else {
    return (
      <h2 id="wd-conditional-output-if-else-login">Please login If Else</h2>
    );
  }
}`}</CodeBlock>
        <LiveDemo
          name="ConditionalOutputIfElse"
          file="app/labs/lab3/ConditionalOutputIfElse.tsx"
        >
          <ConditionalOutputIfElse />
        </LiveDemo>
        <p>
          A more compact equivalent keeps a single{" "}
          <code>return</code>{" "}and short-circuits each heading with{" "}
          <code>&amp;&amp;</code>. Here <code>loggedIn</code>{" "}is{" "}
          <code>false</code>, so only the login heading appears:
        </p>
        <CodeBlock
          language="tsx"
          name="ConditionalOutputInline"
          file="app/labs/lab3/ConditionalOutputInline.tsx"
        >{`export default function ConditionalOutputInline() {
  const loggedIn = false;
  return (
    <div id="wd-conditional-output-inline">
      {loggedIn && <h2>Welcome Inline</h2>}
      {!loggedIn && <h2>Please login Inline</h2>}
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="ConditionalOutputInline"
          file="app/labs/lab3/ConditionalOutputInline.tsx"
        >
          <ConditionalOutputInline />
        </LiveDemo>
        <p>
          Import both components into Lab 3. The if/else version returns
          early; the inline version always returns one wrapper and includes
          whichever heading the flags allow.
        </p>
        <OnYourOwn>
          Swap the <code>loggedIn</code>{" "}constants in both files and
          confirm each heading pair flips, then restore the values shown
          above. Then add <code>const guest = true</code>{" "}to{" "}
          <code>ConditionalOutputInline.tsx</code>{" "}and a heading{" "}
          <code>{`{guest && <h2>Guest Inline</h2>}`}</code>{" "}inside the same
          wrapper, so the page shows Welcome If Else, Please login Inline,
          and Guest Inline.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/ConditionalOutputInline.tsx, keep loggedIn as false. Add const admin = true and a third heading {admin && <h2>Admin Inline</h2>} inside the same wrapper. Do not change ConditionalOutputIfElse.tsx or the two existing headings.`}
        >
          Paste this prompt so the assistant adds an Admin Inline heading
          after yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-2-7"
        title="3.2.7 Null vs Undefined"
      >
        <p>
          Two values mean &quot;no value,&quot; and they are not the same.{" "}
          <code>null</code>{" "}is an assigned empty value — you put it there
          on purpose. <code>undefined</code>{" "}means nothing was assigned:
          a missing property, a variable declared but not initialized, a
          function that did not <code>return</code>. Create{" "}
          <code>NullUndefined.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="NullUndefined"
          file="app/labs/lab3/NullUndefined.tsx"
        >{`export default function NullUndefined() {
  const nullValue = null;
  const undefinedValue = undefined;
  return (
    <div id="wd-null-undefined">
      <h4>Null vs Undefined</h4>
      nullValue = {String(nullValue)}
      <br />
      undefinedValue = {String(undefinedValue)}
      <br />
      typeof nullValue = {typeof nullValue}
      <br />
      typeof undefinedValue = {typeof undefinedValue}
      <br />
      String(null) = {String(null)}
      <br />
      String(undefined) = {String(undefined)}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          JSX renders neither <code>null</code>{" "}nor{" "}
          <code>undefined</code>{" "}— they vanish, the same way a boolean
          does. <code>String(...)</code>{" "}makes them visible. A famous
          JavaScript quirk: <code>typeof null</code>{" "}is{" "}
          <code>&quot;object&quot;</code>, while{" "}
          <code>typeof undefined</code>{" "}is{" "}
          <code>&quot;undefined&quot;</code>. Later,{" "}
          <SectionLink to="3.4.17" />{" "}uses <code>?.</code>{" "}and{" "}
          <code>??</code>{" "}so missing values do not crash the page:
        </p>
        <LiveDemo name="NullUndefined" file="app/labs/lab3/NullUndefined.tsx">
          <NullUndefined />
        </LiveDemo>
        <OnYourOwn>
          In the browser console, compare{" "}
          <code>null == undefined</code>{" "}(true, because <code>==</code>{" "}
          coerces) with <code>null === undefined</code>{" "}(false). That is
          another reason this chapter sticks to <code>===</code>. Then add
          one line to the page,{" "}
          <code>{`nullValue ?? "default" = {nullValue ?? "default"}`}</code>
          , which reads <code>nullValue ?? &quot;default&quot; = default</code>
          .
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/NullUndefined.tsx, keep the existing null/undefined displays. After them, add two more lines: null == undefined = {String(null == undefined)} and null === undefined = {String(null === undefined)}. Do not remove the String(...) lines already on the page.`}
        >
          Ask the assistant to print those two comparisons on the page so you
          can match them against what you typed in the console:
        </WithAI>
      </Section>
    </>
  );
}
