import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import SimpleArrays from "@/app/labs/lab3/SimpleArrays";
import ArrayIndexAndLength from "@/app/labs/lab3/ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "@/app/labs/lab3/AddingAndRemovingToFromArrays";
import ForLoops from "@/app/labs/lab3/ForLoops";
import MapFunction from "@/app/labs/lab3/MapFunction";
import FindFunction from "@/app/labs/lab3/FindFunction";
import FindIndex from "@/app/labs/lab3/FindIndex";
import FilterFunction from "@/app/labs/lab3/FilterFunction";
import JsonStringify from "@/app/labs/lab3/JsonStringify";
import House from "@/app/labs/lab3/House";
import Spreader from "@/app/labs/lab3/Spreader";
import Destructing from "@/app/labs/lab3/Destructing";
import FunctionDestructing from "@/app/labs/lab3/FunctionDestructing";
import DestructingImports from "@/app/labs/lab3/DestructingImports";
import IncludesSomeEvery from "@/app/labs/lab3/IncludesSomeEvery";
import ReduceFunction from "@/app/labs/lab3/ReduceFunction";
import OptionalChaining from "@/app/labs/lab3/OptionalChaining";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function DataStructures() {
  return (
    <Section id="sec-3-4" title="3.4 JavaScript Data Structures">
      <p>
        Up to this point we have been discussing primitive datatypes such
        as strings, numbers, and booleans. These can be combined into
        complex datatypes such as arrays and objects — an array gathers
        several values into a single variable, an object names each one —
        and those are the structures Kambaz will use for courses, modules,
        and people. Arrays can group values of the same datatype, such as
        number arrays and string arrays, or even a mix of datatypes in the
        same array, though you would rarely want a mixed list of
        primitives. Gathering JSX elements is something you will do often,
        so a todo list can render as HTML. To practice with arrays, create
        a component called <code>SimpleArrays</code>{" "}and copy the code
        below. Import the component into Lab 3 and confirm the browser
        renders as shown. Note that the arrays render without the commas;
        this feature will come in handy when the array items are HTML
        elements.
      </p>
      <CodeBlock
        language="tsx"
        name="SimpleArrays"
        file="app/labs/lab3/SimpleArrays.tsx"
      >{`export default function SimpleArrays() {
  var functionScoped = 2;
  let blockScoped = 5;
  const constant1 = functionScoped - blockScoped;
  let numberArray1 = [1, 2, 3, 4, 5];
  let stringArray1 = ["string1", "string2"];
  let htmlArray1 = [
    <li key={1}>Buy milk</li>,
    <li key={2}>Feed the pets</li>,
  ];
  let variableArray1 = [
    functionScoped,
    blockScoped,
    constant1,
    numberArray1,
    stringArray1,
  ];
  return (
    <div id="wd-simple-arrays">
      <h4>Simple Arrays</h4>
      numberArray1 = {numberArray1}
      <br />
      stringArray1 = {stringArray1}
      <br />
      variableArray1 = {variableArray1}
      <br />
      Todo list:
      <ol>{htmlArray1}</ol>
      <hr />
    </div>
  );
}`}</CodeBlock>
      <p>
        JSX interpolates an array of numbers or strings without commas —
        handy once the items are HTML. Each <code>li</code>{" "}in{" "}
        <code>htmlArray1</code>{" "}carries a <code>key</code>, which React
        uses to match list items across renders; without it, the console
        warns and updates can reuse the wrong DOM node. Prefer a stable id
        from your data; here the keys are <code>1</code>{" "}and{" "}
        <code>2</code>{" "}because the list is static:
      </p>
      <LiveDemo name="SimpleArrays" file="app/labs/lab3/SimpleArrays.tsx">
        <SimpleArrays />
      </LiveDemo>
      <OnYourOwn>
        Push a third <code>li</code>{" "}onto{" "}
        <code>htmlArray1</code>{" "}with its own <code>key</code>{" "}and confirm
        the ordered list grows.
      </OnYourOwn>
      <WithAI
        prompt={`In app/labs/lab3/SimpleArrays.tsx, keep any third li I added to htmlArray1. Push one more sample <li key={4}>Call the dentist</li> onto htmlArray1. Do not change my personal todo text or its key.`}
      >
        Ask the assistant to add one extra sample todo item — leave the third
        item as yours:
      </WithAI>

      <Section
        level={3}
        id="sec-3-4-1"
        title="3.4.1 Array Index and Length"
      >
        <p>
          An array&apos;s length is available as the property{" "}
          <code>length</code>. The <code>indexOf()</code>{" "}function finds
          where a particular array member sits — the first matching index,
          or <code>-1</code>{" "}if that value is missing. To practice with
          array indices and length, implement a new component called{" "}
          <code>ArrayIndexAndLength</code>{" "}based on the code below. Import
          this new component in Lab 3 and confirm the browser renders as
          shown:
        </p>
        <CodeBlock
          language="tsx"
          name="ArrayIndexAndLength"
          file="app/labs/lab3/ArrayIndexAndLength.tsx"
        >{`export default function ArrayIndexAndLength() {
  let numberArray1 = [1, 2, 3, 4, 5];
  const length1 = numberArray1.length;
  const index1 = numberArray1.indexOf(3);
  return (
    <div id="wd-array-index-and-length">
      <h4>Array index and length</h4>
      length1 = {length1}
      <br />
      index1 = {index1}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Five items, and <code>3</code>{" "}sits at index <code>2</code>{" "}
          (arrays are zero-based):
        </p>
        <LiveDemo
          name="ArrayIndexAndLength"
          file="app/labs/lab3/ArrayIndexAndLength.tsx"
        >
          <ArrayIndexAndLength />
        </LiveDemo>
        <OnYourOwn>
          Display{" "}
          <code>numberArray1.indexOf(9)</code>{" "}and confirm it is{" "}
          <code>-1</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/ArrayIndexAndLength.tsx, keep any indexOf(9) display I added. After index1, also interpolate numberArray1.indexOf(1) labeled indexOf1 so the page shows 0. Do not remove my missing-value line.`}
        >
          Paste this prompt so the assistant also shows a hit at index{" "}
          <code>0</code>{" "}— you still display the missing <code>9</code>:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-4-2"
        title="3.4.2 Adding and Removing From Arrays"
      >
        <p>
          In many languages an array has a fixed size, whereas in
          JavaScript elements can easily be added and removed. The{" "}
          <code>push()</code>{" "}function appends elements at the end of an
          array. The <code>splice()</code>{" "}function removes or adds
          elements anywhere in the array. To practice adding and removing
          data from arrays, implement component{" "}
          <code>AddingAndRemovingToFromArrays</code>{" "}based on the code
          below. Import this new component in Lab 3 and confirm the
          browser renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="AddingAndRemovingToFromArrays"
          file="app/labs/lab3/AddingAndRemovingToFromArrays.tsx"
        >{`export default function AddingAndRemovingToFromArrays() {
  let numberArray1 = [1, 2, 3, 4, 5];
  let stringArray1 = ["string1", "string2"];
  let todoArray = [
    <li key={1}>Buy milk</li>,
    <li key={2}>Feed the pets</li>,
  ];
  numberArray1.push(6);
  stringArray1.push("string3");
  todoArray.push(<li key={3}>Walk the dogs</li>);
  numberArray1.splice(2, 1);
  stringArray1.splice(1, 1);
  return (
    <div id="wd-adding-removing-from-arrays">
      <h4>Add/remove to/from arrays</h4>
      numberArray1 = {numberArray1}
      <br />
      stringArray1 = {stringArray1}
      <br />
      Todo list:
      <ol>{todoArray}</ol>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          After a push and a splice, the number array is{" "}
          <code>1, 2, 4, 5, 6</code>{" "}— the <code>3</code>{" "}at index 2 is
          gone, and <code>6</code>{" "}was appended first. Each new{" "}
          <code>li</code>{" "}still needs its own <code>key</code>:
        </p>
        <LiveDemo
          name="AddingAndRemovingToFromArrays"
          file="app/labs/lab3/AddingAndRemovingToFromArrays.tsx"
        >
          <AddingAndRemovingToFromArrays />
        </LiveDemo>
        <OnYourOwn>
          <code>push</code>{" "}one more todo
          with a new key, then <code>splice</code>{" "}the first item, and
          confirm the list on screen matches.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/AddingAndRemovingToFromArrays.tsx, keep any extra todo I pushed. After the existing todoArray.push for Walk the dogs, also push <li key={4}>Buy stamps</li>. Leave the number and string splices as they are. Do not overwrite my extra todo.`}
        >
          Ask the assistant to push one extra sample todo — you still splice
          the first item yourself:
        </WithAI>
      </Section>

      <Section level={3} id="sec-3-4-3" title="3.4.3 For Loops">
        <p>
          We can operate on each array value by iterating over them in a{" "}
          <code>for</code>{" "}loop, which is useful when you need the
          position as well as the value. Build a new array inside the loop
          rather than mutating the source. To practice with for loops,
          implement a new component called <code>ForLoops</code>{" "}based on
          the code below. Import this new component in Lab 3 and confirm
          the browser renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="ForLoops"
          file="app/labs/lab3/ForLoops.tsx"
        >{`export default function ForLoops() {
  let stringArray1 = ["string1", "string3"];
  let stringArray2: string[] = [];
  for (let i = 0; i < stringArray1.length; i++) {
    const string1 = stringArray1[i];
    stringArray2.push(string1.toUpperCase());
  }
  return (
    <div id="wd-for-loops">
      <h4>Looping through arrays</h4>
      stringArray2 = {stringArray2}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The TypeScript annotation <code>string[]</code>{" "}tells the compiler
          the empty array will hold strings. The result is{" "}
          <code>STRING1STRING3</code>{" "}(JSX still omits commas):
        </p>
        <LiveDemo name="ForLoops" file="app/labs/lab3/ForLoops.tsx">
          <ForLoops />
        </LiveDemo>
        <OnYourOwn>
          Build a third array of lowercased
          copies in the same loop (or a second loop) and display it.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/ForLoops.tsx, keep any lowercased array I built. In the same loop (or a second loop), also push string1.length into a number[] named stringLengths and display stringLengths under stringArray2. Do not overwrite my lowercase array.`}
        >
          Paste this prompt so the assistant maps lengths as a sample extra —
          leave the lowercased copies as yours:
        </WithAI>
      </Section>

      <Section level={3} id="sec-3-4-4" title="3.4.4 Map Function">
        <p>
          An array&apos;s <code>map</code>{" "}function can iterate over an
          array&apos;s values, apply a function to each value, and collate
          all the results in a <em>new</em>{" "}array. The first example below
          iterates over <code>numberArray1</code>{" "}and calls the{" "}
          <code>square</code>{" "}function for each element. The{" "}
          <code>square</code>{" "}function accepts a parameter and returns the
          square of that parameter, and <code>map</code>{" "}collates all the
          squares into a new array called <code>squares</code>. The second
          example does the same thing, but uses an implied-return arrow
          that calculates the cubes of all numbers in the same{" "}
          <code>numberArray1</code>. Mapping to JSX is how Kambaz will
          turn a courses array into cards. To practice with{" "}
          <code>map</code>, implement a new component called{" "}
          <code>MapFunction</code>{" "}based on the code below. Import this
          new component in Lab 3 and confirm the browser renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="MapFunction"
          file="app/labs/lab3/MapFunction.tsx"
        >{`export default function MapFunction() {
  let numberArray1 = [1, 2, 3, 4, 5, 6];
  const square = (a: number) => a * a;
  const todos = ["Buy milk", "Feed the pets"];
  const squares = numberArray1.map(square);
  const cubes = numberArray1.map((a) => a * a * a);
  return (
    <div id="wd-map-function">
      <h4>Map Function</h4>
      squares = {squares}
      <br />
      cubes = {cubes}
      <br />
      Todos:
      <ol>
        {todos.map((todo) => (
          <li key={todo}>{todo}</li>
        ))}
      </ol>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The first <code>map</code>{" "}passes a named function; the second
          inlines an implied-return arrow. Mapping to JSX is how Kambaz
          will turn a courses array into cards. Give each sibling a{" "}
          <code>key</code>{" "}— here the todo string is unique, so{" "}
          <code>key={"{todo}"}</code>{" "}works. When two titles could collide,
          use a real id from the data instead:
        </p>
        <LiveDemo name="MapFunction" file="app/labs/lab3/MapFunction.tsx">
          <MapFunction />
        </LiveDemo>
        <OnYourOwn>
          Add a third string to{" "}
          <code>todos</code>{" "}and confirm the ordered list grows — the{" "}
          <code>key</code>{" "}must stay unique.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/MapFunction.tsx, keep any third todo I added. Append "Email the TA" to the todos array (unique string) so map renders a fourth <li key={todo}>. Also interpolate numberArray1.map((a) => a * 2) labeled doubles under cubes. Do not change my personal todo text.`}
        >
          Ask the assistant to add one extra sample todo and a doubles map —
          leave your third string as the personal bit:
        </WithAI>
      </Section>

      <Section level={3} id="sec-3-4-5" title="3.4.5 Find Function">
        <p>
          An array&apos;s <code>find</code>{" "}function can search for an
          item in an array and return the element it finds, or{" "}
          <code>undefined</code>{" "}if none match. The <code>find</code>{" "}
          function takes a function as an argument that serves as a
          predicate. The predicate should return true if the element is
          the one you&apos;re looking for. The predicate function is
          invoked for each of the elements in the array, and when the
          function returns true, <code>find</code>{" "}stops because it has
          found the element it was looking for. To practice, implement a
          new component called <code>FindFunction</code>{" "}based on the
          code below. Import this new component in Lab 3 and confirm the
          browser renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="FindFunction"
          file="app/labs/lab3/FindFunction.tsx"
        >{`export default function FindFunction() {
  let numberArray1 = [1, 2, 3, 4, 5];
  let stringArray1 = ["string1", "string2", "string3"];
  const four = numberArray1.find((a) => a === 4);
  const string3 = stringArray1.find((a) => a === "string3");
  return (
    <div id="wd-find-function">
      <h4>Find Function</h4>
      four = {four}
      <br />
      string3 = {string3}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo name="FindFunction" file="app/labs/lab3/FindFunction.tsx">
          <FindFunction />
        </LiveDemo>
        <OnYourOwn>
          <code>find</code>{" "}a value that is
          not in the array and display the result — it should be empty on
          the page because JSX hides <code>undefined</code>. Wrap it in{" "}
          <code>String(...)</code>{" "}if you want to see the word
          &quot;undefined&quot;.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/FindFunction.tsx, keep any missing-value find I added. After string3, also find 2 in numberArray1 as const two = numberArray1.find((a) => a === 2) and interpolate two = {two}. Do not remove my undefined example.`}
        >
          Ask the assistant to also find a value that exists — you still
          display the missing one:
        </WithAI>
      </Section>

      <Section level={3} id="sec-3-4-6" title="3.4.6 Find Index">
        <p>
          Alternatively we can use the <code>findIndex</code>{" "}function to
          determine the index where an element is located inside an array,
          or <code>-1</code>{" "}when the predicate never matches. Copy the
          code below into a <code>FindIndex</code>{" "}component, import it
          in Lab 3, and confirm the browser renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="FindIndex"
          file="app/labs/lab3/FindIndex.tsx"
        >{`export default function FindIndex() {
  let numberArray1 = [1, 2, 4, 5, 6];
  let stringArray1 = ["string1", "string3"];
  const fourIndex = numberArray1.findIndex((a) => a === 4);
  const string3Index = stringArray1.findIndex((a) => a === "string3");
  return (
    <div id="wd-find-index">
      <h4>Find Index Function</h4>
      fourIndex = {fourIndex}
      <br />
      string3Index = {string3Index}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>4</code>{" "}is at index <code>2</code>.{" "}
          <code>&quot;string3&quot;</code>{" "}is at index <code>1</code>:
        </p>
        <LiveDemo name="FindIndex" file="app/labs/lab3/FindIndex.tsx">
          <FindIndex />
        </LiveDemo>
        <OnYourOwn>
          Display{" "}
          <code>numberArray1.findIndex((a) =&gt; a === 3)</code>{" "}— there is
          no <code>3</code>{" "}in this array, so the index is{" "}
          <code>-1</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/FindIndex.tsx, keep any findIndex for 3 that I added. After string3Index, also interpolate numberArray1.findIndex((a) => a === 6) labeled sixIndex so the page shows 4. Do not remove my -1 line.`}
        >
          Paste this prompt so the assistant also shows a hit at index{" "}
          <code>4</code>{" "}— you still display the missing <code>3</code>:
        </WithAI>
      </Section>

      <Section level={3} id="sec-3-4-7" title="3.4.7 Filter Function">
        <p>
          The <code>filter</code>{" "}function can look for elements that meet
          a criteria and collate them into a new array. For instance, the
          example below looks through the <code>numberArray1</code>{" "}array
          for all values that are greater than 2. Then we look for all
          even numbers and then for all odd numbers. All the results are
          stored in corresponding arrays with appropriate names. Kambaz
          will use the same tool to show only the modules, assignments, or
          people for the current course. To practice, implement a new
          component called <code>FilterFunction</code>{" "}based on the code
          below. Import this new component in Lab 3 and confirm the
          browser renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="FilterFunction"
          file="app/labs/lab3/FilterFunction.tsx"
        >{`export default function FilterFunction() {
  let numberArray1 = [1, 2, 4, 5, 6];
  const numbersGreaterThan2 = numberArray1.filter((a) => a > 2);
  const evenNumbers = numberArray1.filter((a) => a % 2 === 0);
  const oddNumbers = numberArray1.filter((a) => a % 2 !== 0);
  return (
    <div id="wd-filter-function">
      <h4>Filter Function</h4>
      numbersGreaterThan2 = {numbersGreaterThan2}
      <br />
      evenNumbers = {evenNumbers}
      <br />
      oddNumbers = {oddNumbers}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="FilterFunction"
          file="app/labs/lab3/FilterFunction.tsx"
        >
          <FilterFunction />
        </LiveDemo>
        <OnYourOwn>
          Filter numbers greater than or equal
          to <code>5</code>{" "}into a new constant and display it.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/FilterFunction.tsx, keep any >= 5 filter I added. After oddNumbers, add const numbersLessThan2 = numberArray1.filter((a) => a < 2) and interpolate it. Do not overwrite my >= 5 constant.`}
        >
          Ask the assistant to add a sample less-than-2 filter — leave the
          greater-than-or-equal-to-5 array as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-4-8"
        title="3.4.8 Includes, some, and every"
      >
        <p>
          Three more array questions, each returning a boolean:{" "}
          <code>includes(value)</code>{" "}asks whether the value is present,{" "}
          <code>some(predicate)</code>{" "}whether <em>at least one</em>{" "}
          item passes, and <code>every(predicate)</code>{" "}whether{" "}
          <em>all</em>{" "}items pass. To practice, implement a new
          component called <code>IncludesSomeEvery</code>{" "}based on the
          code below. Import this new component in Lab 3 and confirm the
          browser renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="IncludesSomeEvery"
          file="app/labs/lab3/IncludesSomeEvery.tsx"
        >{`export default function IncludesSomeEvery() {
  const numbers = [1, 2, 3, 4, 5];
  const includes3 = numbers.includes(3);
  const includes8 = numbers.includes(8);
  const someGreaterThan4 = numbers.some((n) => n > 4);
  const everyGreaterThan0 = numbers.every((n) => n > 0);
  return (
    <div id="wd-includes-some-every">
      <h4>Includes, Some, Every</h4>
      includes(3) = {includes3 + ""}
      <br />
      includes(8) = {includes8 + ""}
      <br />
      some(n &gt; 4) = {someGreaterThan4 + ""}
      <br />
      every(n &gt; 0) = {everyGreaterThan0 + ""}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Coerce the booleans with <code>+ &quot;&quot;</code>{" "}again so they
          print. Kambaz people-table enrollment checks will use{" "}
          <code>some</code>{" "}the same way:
        </p>
        <LiveDemo
          name="IncludesSomeEvery"
          file="app/labs/lab3/IncludesSomeEvery.tsx"
        >
          <IncludesSomeEvery />
        </LiveDemo>
        <OnYourOwn>
          Display{" "}
          <code>numbers.every((n) =&gt; n &gt; 4)</code>{" "}— it should be
          false — and <code>numbers.some((n) =&gt; n === 1)</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/IncludesSomeEvery.tsx, keep any extra every/some I added. After the existing booleans, also display numbers.includes(5) as includes(5) = {numbers.includes(5) + ""}. Do not remove my every(n > 4) or some(n === 1) lines.`}
        >
          Ask the assistant to add one extra sample <code>includes</code>{" "}
          line — you still display the two predicates yourself:
        </WithAI>
      </Section>

      <Section level={3} id="sec-3-4-9" title="3.4.9 Reduce">
        <p>
          <code>reduce</code>{" "}folds an array down to one value: a running
          total, a concatenated string, a grouped object. The callback
          receives the accumulator and the current item; the second
          argument to <code>reduce</code>{" "}is the starting accumulator.
          To practice, implement a new component called{" "}
          <code>ReduceFunction</code>{" "}based on the code below. Import
          this new component in Lab 3 and confirm the browser renders as
          shown:
        </p>
        <CodeBlock
          language="tsx"
          name="ReduceFunction"
          file="app/labs/lab3/ReduceFunction.tsx"
        >{`export default function ReduceFunction() {
  const numbers = [1, 2, 3, 4, 5];
  const sum = numbers.reduce((total, n) => total + n, 0);
  return (
    <div id="wd-reduce-function">
      <h4>Reduce Function</h4>
      sum = {sum}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Starting from <code>0</code>, the callback adds each{" "}
          <code>n</code>, so the sum is <code>15</code>:
        </p>
        <LiveDemo
          name="ReduceFunction"
          file="app/labs/lab3/ReduceFunction.tsx"
        >
          <ReduceFunction />
        </LiveDemo>
        <OnYourOwn>
          Reduce the same array to a product
          (start the accumulator at <code>1</code>) and display it.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/ReduceFunction.tsx, keep any product reduce I added. After sum, also reduce numbers to a concatenated string const joined = numbers.reduce((text, n) => text + n, "") and interpolate joined. Do not overwrite my product.`}
        >
          Paste this prompt so the assistant adds a sample string reduce —
          leave the product as yours:
        </WithAI>
      </Section>

      <Section level={3} id="sec-3-4-10" title="3.4.10 JSON Stringify">
        <p>
          JavaScript has a global object called <strong>JSON</strong>,
          which stands for JavaScript Object Notation — the text format
          APIs and files use to ship data. The object provides several
          useful formatting functions such as <code>stringify()</code>{" "}
          and <code>parse()</code>. <code>stringify()</code>{" "}converts
          JavaScript data structures to formatted strings;{" "}
          <code>parse()</code>{" "}reads that text back into a value. JSX
          prints arrays without brackets or commas;{" "}
          <code>JSON.stringify</code>{" "}puts them back so you can see the
          real structure — the array rendered with square brackets and
          items separated by commas. To practice, implement a new
          component called <code>JsonStringify</code>{" "}based on the code
          below. Import this new component in Lab 3 and confirm the
          browser renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="JsonStringify"
          file="app/labs/lab3/JsonStringify.tsx"
        >{`export default function JsonStringify() {
  const squares = [1, 4, 16, 25, 36];
  return (
    <div id="wd-json-stringify">
      <h3>JSON Stringify</h3>
      squares = {JSON.stringify(squares)}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo name="JsonStringify" file="app/labs/lab3/JsonStringify.tsx">
          <JsonStringify />
        </LiveDemo>
        <OnYourOwn>
          Stringify a small object (for
          example <code>{`{ course: "RS101", credits: 4 }`}</code>) and
          display it next to the array.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/JsonStringify.tsx, keep any extra object I stringified. After the squares line, also interpolate JSON.stringify({ course: "RS102", modules: 3 }) labeled sampleCourse. Do not change my personal object.`}
        >
          Ask the assistant to stringify one extra sample object — leave
          yours next to the array:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-4-11"
        title="3.4.11 JavaScript Objects"
      >
        <p>
          Multiple values of various datatypes can be combined together to
          create complex datatypes called <strong>objects</strong>. For
          example the code below declares a house object collecting
          several numbers, strings, arrays, and other objects to represent
          a particular instance of a house. The <code>house</code>{" "}
          variable is assigned an object literal declared within opening
          and closing curly braces <code>{"{"}</code>{" "}and{" "}
          <code>{"}"}</code>. Objects contain pairs of properties and
          values separated by commas. Values can be of any datatype
          including Number, String, Boolean, arrays, and other objects. In
          the example below we declared a house with 4{" "}
          <code>bedrooms</code>, 2.5 <code>bathrooms</code>, and 2000{" "}
          <code>squareFeet</code>. The house has a nested object stored in
          property <code>address</code>{" "}which contains String properties
          such as <code>street</code>, <code>city</code>, and{" "}
          <code>state</code>. The <code>owners</code>{" "}String array
          declares the names of the owners. To practice with objects,
          create a <code>House</code>{" "}component as shown below, import
          it into the Lab 3 component, and confirm it renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="House"
          file="app/labs/lab3/House.tsx"
        >{`export default function House() {
  const house = {
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2000,
    address: {
      street: "Via Roma",
      city: "Roma",
      state: "RM",
      zip: "00100",
      country: "Italy",
    },
    owners: ["Alice", "Bob"],
  };
  console.log(house);
  return (
    <div id="wd-house">
      <h4>House</h4>
      <h5>bedrooms</h5>
      {house.bedrooms}
      <h5>bathrooms</h5>
      {house.bathrooms}
      <h5>Data</h5>
      <pre>{JSON.stringify(house, null, 2)}</pre>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Dot notation reads a property: <code>house.bedrooms</code>,{" "}
          <code>house.address.city</code>. The pretty-printed{" "}
          <code>&lt;pre&gt;</code>{" "}uses the optional second and third
          arguments to <code>stringify</code>{" "}— a replacer (here{" "}
          <code>null</code>) and an indent width of <code>2</code>.{" "}
          <code>console.log(house)</code>{" "}prints that tree in the
          Console tab — the next subsection:
        </p>
        <LiveDemo name="House" file="app/labs/lab3/House.tsx">
          <House />
        </LiveDemo>
        <OnYourOwn>
          Add a <code>yearBuilt</code>{" "}
          property and interpolate it under bathrooms.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/House.tsx, keep yearBuilt if I added it. Add garage: { cars: 2 } to the house object and interpolate house.garage.cars under bathrooms (or under yearBuilt if that heading exists). Do not remove yearBuilt.`}
        >
          Ask the assistant to add a sample nested <code>garage</code>{" "}
          object — leave <code>yearBuilt</code>{" "}as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-4-12"
        title="3.4.12 Writing to the Console"
      >
        <p>
          DevTools&apos; Elements tab showed the DOM in{" "}
          <SectionLink to="1.3.1" />. Functions and objects need the{" "}
          <strong>Console</strong>{" "}tab as well — a place to print values
          without putting them on the page. Right-click the Lab 3 page and
          choose Inspect. Click the Console tab — empty until your scripts
          write to it (
          <FigureLink to="3.4.12a" />
          ):
        </p>
        <BookFigure
          id="fig-3.4.12a"
          src="/images/book/ch3/figures/fig-3-9-1a-console.png"
          alt="Chrome DevTools Console tab, empty"
          caption="Figure 3.4.12a — Console tab"
        />
        <p>
          Add <code>console.log(&quot;Hello World!&quot;)</code>{" "}at the
          top of the Lab 3 function, reload, and confirm the string
          appears in the console:
        </p>
        <CodeBlock language="tsx">{`export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      {/* ...lab components... */}
    </div>
  );
}`}</CodeBlock>
        <p>
          Objects print in the Console as expandable trees.{" "}
          <code>House.tsx</code>{" "}already logs the house — reload Lab 3,
          find that log, and expand <code>address</code>{" "}and{" "}
          <code>owners</code>{" "}(
          <FigureLink to="3.4.12c" />
          ):
        </p>
        <BookFigure
          id="fig-3.4.12c"
          src="/images/book/ch3/figures/fig-3-9-1c-house.png"
          alt="House object logged in the DevTools console"
          caption="Figure 3.4.12c — House object in the console"
        />
        <OnYourOwn>
          Log <code>house.owners</code>{" "}from <code>House.tsx</code>{" "}and
          confirm the two-string array appears in the console. Then show
          it on the page too: under bathrooms add an{" "}
          <code>&lt;h5&gt;owners&lt;/h5&gt;</code>{" "}heading followed by{" "}
          <code>{`{house.owners.join(", ")}`}</code>, which reads{" "}
          <code>Alice, Bob</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/House.tsx, keep console.log(house) and any console.log(house.owners) I added. Also console.log(house.address.city). Do not remove my owners log.`}
        >
          Paste this prompt so the assistant logs one extra sample field —
          you still log <code>house.owners</code>{" "}yourself:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-4-13"
        title="3.4.13 Spread Operator"
      >
        <p>
          The spread operator <code>...</code>{" "}is used to expand, or copy,
          an iterable object or array into another object or array. In the
          example below we declare array <code>arr1</code>{" "}and then copy
          its content (spread) into array <code>arr2</code>. The resulting
          array <code>arr2</code>{" "}contains the contents of{" "}
          <code>arr1</code>, followed by the rest of the items already
          declared in <code>arr2</code>. The spread operator can also be
          applied to objects. Below, <code>obj1</code>{" "}declares an object
          with three properties <code>a</code>, <code>b</code>, and{" "}
          <code>c</code>. We then spread <code>obj1</code>{" "}onto{" "}
          <code>obj2</code>{" "}so that <code>obj2</code>{" "}ends up with the
          properties from both <code>obj1</code>{" "}and{" "}
          <code>obj2</code>. When declaring <code>obj3</code>, we first
          spread <code>obj1</code>{" "}and then declare <code>b</code>{" "}with
          a value of 4. Since <code>obj1</code>{" "}also has a property
          called <code>b</code>{" "}with a value of <code>2</code>, there is
          a collision of properties in <code>obj3</code>. The collision is
          resolved by keeping the last declaration, so{" "}
          <code>obj3.b</code>{" "}ends up being <code>4</code>. To practice
          the spread operator, create the <code>Spreader</code>{" "}
          component as shown below — the function inside is named{" "}
          <code>Spreading</code>, matching the lab file — import it in the
          Lab 3 component, and confirm it renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="Spreading"
          file="app/labs/lab3/Spreader.tsx"
        >{`export default function Spreading() {
  const arr1 = [1, 2, 3];
  const arr2 = [...arr1, 4, 5, 6];
  const obj1 = { a: 1, b: 2, c: 3 };
  const obj2 = { ...obj1, d: 4, e: 5, f: 6 };
  const obj3 = { ...obj1, b: 4 };
  return (
    <div id="wd-spreading">
      <h2>Spread Operator</h2>
      <h3>Array Spread</h3>
      arr1 = {JSON.stringify(arr1)}
      <br />
      arr2 = {JSON.stringify(arr2)}
      <br />
      <h3>Object Spread</h3>
      {JSON.stringify(obj1)}
      <br />
      {JSON.stringify(obj2)}
      <br />
      {JSON.stringify(obj3)}
      <br />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>obj3.b</code>{" "}is <code>4</code>, not <code>2</code> — the
          later <code>b: 4</code>{" "}overrides the copy from{" "}
          <code>obj1</code>:
        </p>
        <LiveDemo name="Spreading" file="app/labs/lab3/Spreader.tsx">
          <Spreader />
        </LiveDemo>
        <OnYourOwn>
          Build <code>obj4</code>{" "}by spreading{" "}
          <code>obj2</code>{" "}and overriding <code>a</code>, then stringify
          it.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/Spreader.tsx, keep obj4 if I added it. After arr2, also declare const arr3 = [...arr2, 7] and interpolate JSON.stringify(arr3). Do not overwrite obj4.`}
        >
          Ask the assistant to spread one extra sample array — leave{" "}
          <code>obj4</code>{" "}as yours:
        </WithAI>
      </Section>

      <Section level={3} id="sec-3-4-14" title="3.4.14 Destructing">
        <p>
          While the spread operator is used to expand an iterable object
          into a new object or array, the <strong>destructing</strong>{" "}
          operator unpacks values from arrays, or properties from objects,
          into distinct variables. The lab file is named{" "}
          <code>Destructing.tsx</code>, but the operation in prose is
          destructuring. In the
          example below we declare object <code>person</code>{" "}and array{" "}
          <code>numbers</code>. These can be unpacked, or destructed, into
          new variables or constants by an object&apos;s property name or
          an array&apos;s item position. The curly brackets around
          constants <code>name</code>{" "}and <code>age</code>{" "}destruct the
          object <code>person</code>{" "}on the right side of the assignment
          and assign the properties of the same name into the new
          constants, so <code>name</code>{" "}and <code>age</code>{" "}end up
          with the values of <code>person.name</code>{" "}and{" "}
          <code>person.age</code>. While object destructing is based on
          the names of the properties, destructing arrays is based on the
          positions of the items: the square brackets unpack{" "}
          <code>numbers</code>{" "}into <code>first</code>,{" "}
          <code>second</code>, and <code>third</code>, which end up with
          the values of <code>numbers[0]</code>, <code>numbers[1]</code>,
          and <code>numbers[2]</code>. To practice destructing objects and
          arrays, create component <code>Destructing</code>{" "}as shown
          below, import it in the Lab 3 component, and confirm it renders
          as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="Destructing"
          file="app/labs/lab3/Destructing.tsx"
        >{`export default function Destructing() {
  const person = { name: "John", age: 25 };
  const { name, age } = person;
  const numbers = ["one", "two", "three"];
  const [first, second, third] = numbers;
  return (
    <div id="wd-destructing">
      <h2>Destructing</h2>
      <h3>Object Destructing</h3>
      const &#123; name, age &#125; = &#123; name: "John", age: 25 &#125;
      <br />
      <br />
      name = {name}
      <br />
      age = {age}
      <h3>Array Destructing</h3>
      const [first, second, third] = ["one","two","three"]
      <br />
      <br />
      first = {first}
      <br />
      second = {second}
      <br />
      third = {third}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>{`const { name, age } = person`}</code>{" "}is the same as{" "}
          <code>const name = person.name</code>{" "}and{" "}
          <code>const age = person.age</code>. Array destructuring is the
          same as <code>numbers[0]</code>, <code>numbers[1]</code>,{" "}
          <code>numbers[2]</code>:
        </p>
        <LiveDemo name="Destructing" file="app/labs/lab3/Destructing.tsx">
          <Destructing />
        </LiveDemo>
        <OnYourOwn>
          Destructure a fourth array item
          (add <code>&quot;four&quot;</code>{" "}to the array first) or a
          third object property, and display it.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/Destructing.tsx, keep any fourth array item or extra object property I added. Add city: "Boston" to person, destructure city with name and age, and interpolate city = {city}. Do not remove my fourth/third display.`}
        >
          Ask the assistant to destructure one extra sample property — leave
          the fourth array item as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-4-15"
        title="3.4.15 Function Destructing"
      >
        <p>
          The destructing-objects syntax is very popular in React,
          especially when passing parameters to functions. React
          components receive props as one object, and destructuring that
          object in the parameter list is the usual way to name each prop.
          In the example below we declare two functions{" "}
          <code>add</code>{" "}and <code>subtract</code>{" "}using the new
          arrow function syntax. The <code>add</code>{" "}function takes two
          arguments <code>a</code>{" "}and <code>b</code>{" "}and returns the
          sum of the arguments. The <code>subtract</code>{" "}function takes
          a single object argument with properties <code>a</code>{" "}and{" "}
          <code>b</code>{" "}with values 4 and 2. In the argument list
          declaration, <code>subtract</code>{" "}uses object destructing to
          declare constants <code>a</code>{" "}and <code>b</code>{" "}which
          unpack the values 4 and 2 from the object argument with
          properties of the same name. To practice function destructing,
          copy the code below into a <code>FunctionDestructing</code>{" "}
          component, import it into the Lab 3 component, and confirm it
          renders as shown:
        </p>
        <CodeBlock
          language="tsx"
          name="FunctionDestructing"
          file="app/labs/lab3/FunctionDestructing.tsx"
        >{`export default function FunctionDestructing() {
  const add = (a: number, b: number) => a + b;
  const sum = add(1, 2);
  const subtract = ({ a, b }: { a: number; b: number }) => a - b;
  const difference = subtract({ a: 4, b: 2 });
  return (
    <div id="wd-function-destructing">
      <h2>Function Destructing</h2>
      const add = (a, b) =&gt; a + b;
      <br />
      const sum = add(1, 2);
      <br />
      const subtract = (&#123; a, b &#125;) =&gt; a - b;
      <br />
      const difference = subtract(&#123; a: 4, b: 2 &#125;);
      <br />
      sum = {sum}
      <br />
      difference = {difference}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>add</code>{" "}takes two numbers. <code>subtract</code>{" "}takes
          one object and unpacks <code>a</code>{" "}and <code>b</code>{" "}from
          it — the same shape as{" "}
          <code>{`function Add({ a, b }: { a: number; b: number })`}</code>{" "}
          in <SectionLink to="3.7" />:
        </p>
        <p>
          Parameters can also carry a <strong>default</strong>:{" "}
          <code>{`(name = "Ada") => name`}</code>{" "}uses{" "}
          <code>&quot;Ada&quot;</code>{" "}when the caller omits the argument.
          Destructured props work the same way —{" "}
          <code>{`{ a, b = 0 }`}</code> — which{" "}
          <SectionLink to="3.7.4" />{" "}uses for a default todo.
        </p>
        <LiveDemo
          name="FunctionDestructing"
          file="app/labs/lab3/FunctionDestructing.tsx"
        >
          <FunctionDestructing />
        </LiveDemo>
        <OnYourOwn>
          Add a <code>multiply</code>{" "}arrow
          that destructures <code>{`{ a, b }`}</code>{" "}and display the
          product. Then add a <code>greet</code>{" "}arrow with a default{" "}
          <code>name = &quot;Ada&quot;</code>{" "}and interpolate a call with
          no argument.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/FunctionDestructing.tsx, keep multiply and greet if I already added them. Add const divide = ({ a, b }: { a: number; b: number }) => a / b, call it as divide({ a: 10, b: 2 }), and interpolate the quotient. Do not overwrite multiply or greet.`}
        >
          Paste this prompt so the assistant adds a sample destructured{" "}
          <code>divide</code>{" "}— leave <code>multiply</code>{" "}and{" "}
          <code>greet</code>{" "}as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-4-16"
        title="3.4.16 Destructing Imports"
      >
        <p>
          Let&apos;s create a simple library to illustrate various ways of
          importing the functions and constants declared in the{" "}
          <code>Math</code>{" "}library below. The functions{" "}
          <code>add</code>, <code>subtract</code>, <code>multiply</code>,
          and <code>divide</code>{" "}are all exported with the{" "}
          <code>export</code>{" "}keyword so that they can be imported
          individually. The <code>Math</code>{" "}constant declares an object
          containing references to the local functions. We export the{" "}
          <code>Math</code>{" "}object as the default export so that the
          functions can be imported as a single object map. To demonstrate
          how the functions can be imported in several ways, create the{" "}
          <code>DestructingImports</code>{" "}component below. First, the
          functions can be imported as the single <code>Math</code>{" "}
          object that contains references to all the functions as{" "}
          <code>{`import Math from "./Math"`}</code>, then accessed as{" "}
          <code>Math.add()</code>, <code>Math.subtract()</code>, and so
          on. An alternative is <code>{`import * as Matematica from "./Math"`}</code>,
          where <code>Matematica</code>{" "}is a custom local object name, so
          you invoke <code>Matematica.add()</code>{" "}and{" "}
          <code>Matematica.subtract()</code>. Finally, the functions can
          be imported individually by destructing the exported functions as{" "}
          <code>{`import { add, subtract, multiply, divide } from "./Math"`}</code>.
          Implement the <code>Math.ts</code>{" "}library and the{" "}
          <code>DestructingImports</code>{" "}component, import them in Lab
          3, and confirm the table renders as shown:
        </p>
        <CodeBlock
          language="ts"
          name="Math"
          file="app/labs/lab3/Math.ts"
        >{`export function add(a: number, b: number): number {
  return a + b;
}
export function subtract(a: number, b: number): number {
  return a - b;
}
export function multiply(a: number, b: number): number {
  return a * b;
}
export function divide(a: number, b: number): number {
  return a / b;
}
const Math = {
  add,
  subtract,
  multiply,
  divide,
};
export default Math;`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="DestructingImports"
          file="app/labs/lab3/DestructingImports.tsx"
        >{`import Math, { add, subtract, multiply, divide } from "./Math";
import * as Matematica from "./Math";

export default function DestructingImports() {
  return (
    <div id="wd-destructuring-imports">
      <h2>Destructing Imports</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th>Math</th>
            <th>Matematica</th>
            <th>Functions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Math.add(2, 3) = {Math.add(2, 3)}</td>
            <td>Matematica.add(2, 3) = {Matematica.add(2, 3)}</td>
            <td>add(2, 3) = {add(2, 3)}</td>
          </tr>
          <tr>
            <td>Math.subtract(5, 1) = {Math.subtract(5, 1)}</td>
            <td>Matematica.subtract(5, 1) = {Matematica.subtract(5, 1)}</td>
            <td>subtract(5, 1) = {subtract(5, 1)}</td>
          </tr>
          <tr>
            <td>Math.multiply(3, 4) = {Math.multiply(3, 4)}</td>
            <td>Matematica.multiply(3, 4) = {Matematica.multiply(3, 4)}</td>
            <td>multiply(3, 4) = {multiply(3, 4)}</td>
          </tr>
          <tr>
            <td>Math.divide(8, 2) = {Math.divide(8, 2)}</td>
            <td>Matematica.divide(8, 2) = {Matematica.divide(8, 2)}</td>
            <td>divide(8, 2) = {divide(8, 2)}</td>
          </tr>
        </tbody>
      </table>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          A module can export many <strong>named</strong>{" "}values (
          <code>export function add</code>) and at most one{" "}
          <strong>default</strong>{" "}(<code>export default Math</code>).
          Named imports use braces:{" "}
          <code>{`import { add } from "./Math"`}</code>. The default
          import does not: <code>{`import Math from "./Math"`}</code> — the
          same pattern as <code>{`import House from "./House"`}</code>{" "}and
          as every Next.js <code>page.tsx</code>, which must default-export
          the page component. <code>import * as Matematica</code>{" "}gathers
          every export as one object. Each column of the table is the same
          arithmetic:
        </p>
        <LiveDemo
          name="DestructingImports"
          file="app/labs/lab3/DestructingImports.tsx"
        >
          <DestructingImports />
        </LiveDemo>
        <OnYourOwn>
          Add a fifth table row for <code>add(10, 20)</code>{" "}that uses all
          three import styles — <code>Math.add(10, 20)</code>,{" "}
          <code>Matematica.add(10, 20)</code>, and{" "}
          <code>add(10, 20)</code>{" "}— so each cell shows <code>30</code>.
          Don&apos;t import <code>add</code>{" "}a second time: line 1 already
          imports it by name, and a second import of the same name in one
          file is a duplicate-identifier error.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/Math.ts, keep the existing named exports. Add export function remainder(a: number, b: number): number { return a % b; } and include remainder on the default Math object. In app/labs/lab3/DestructingImports.tsx, add remainder to the existing named import on line 1 (do not add a second import line for it), then add one table row that shows Math.remainder(10, 3), Matematica.remainder(10, 3), and remainder(10, 3). Do not remove my add(10, 20) row.`}
        >
          Ask the assistant to add a <code>remainder</code>{" "}export and a
          sixth table row whose three cells each show <code>1</code>:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-3-4-17"
        title="3.4.17 Optional chaining and nullish coalescing"
      >
        <p>
          Reading <code>house.address.city</code>{" "}throws if{" "}
          <code>address</code>{" "}is missing. Optional chaining{" "}
          <code>?.</code>{" "}stops at the first <code>null</code>{" "}or{" "}
          <code>undefined</code>{" "}and yields <code>undefined</code>{" "}instead
          of crashing. Nullish coalescing <code>??</code>{" "}supplies a
          default only when the left side is <code>null</code>{" "}or{" "}
          <code>undefined</code>{" "}(unlike <code>||</code>, which also
          treats <code>0</code>{" "}and <code>&quot;&quot;</code>{" "}as missing).
          Create <code>OptionalChaining.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="OptionalChaining"
          file="app/labs/lab3/OptionalChaining.tsx"
        >{`type House = {
  bedrooms: number;
  address?: { street: string; city: string; zip?: string };
  garage?: { cars: number };
};

export default function OptionalChaining() {
  const house: House = {
    bedrooms: 4,
    address: {
      street: "Via Roma",
      city: "Roma",
    },
  };
  const missing = undefined as { prop?: string } | undefined;
  return (
    <div id="wd-optional-chaining">
      <h4>Optional Chaining</h4>
      house.address?.city = {house.address?.city}
      <br />
      missing?.prop ?? "n/a" = {missing?.prop ?? "n/a"}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>house.address?.city</code>{" "}is <code>Roma</code>.{" "}
          <code>missing?.prop</code>{" "}is <code>undefined</code>, so{" "}
          <code>?? &quot;n/a&quot;</code>{" "}fills in the fallback — the same
          pattern the assignment editor uses for{" "}
          <code>assignment?.title ?? &quot;&quot;</code>{" "}in{" "}
          <SectionLink to="3.9.8.1" />. The <code>House</code>{" "}type marks{" "}
          <code>address</code>, <code>zip</code>, and <code>garage</code>{" "}
          optional with <code>?</code>. TypeScript only lets you read a
          property the type declares, even through <code>?.</code>, so
          without the type, <code>house.garage?.cars</code>{" "}below would
          work in <code>npm run dev</code>{" "}but fail{" "}
          <code>next build</code>{" "}(and your Vercel deploy):
        </p>
        <LiveDemo
          name="OptionalChaining"
          file="app/labs/lab3/OptionalChaining.tsx"
        >
          <OptionalChaining />
        </LiveDemo>
        <OnYourOwn>
          Add a line under the others that displays{" "}
          <code>house.garage?.cars ?? 0</code>, labeled the same way as the
          existing lines. There is no <code>garage</code>{" "}on this house,
          so it reads <code>house.garage?.cars ?? 0 = 0</code>. Run{" "}
          <code>npm run build</code>{" "}once to confirm it still builds.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/OptionalChaining.tsx, keep any house.garage?.cars ?? 0 display I added. After the existing lines, also interpolate house.address?.zip ?? "unknown" so the missing zip uses the fallback. Do not remove my garage line.`}
        >
          Paste this prompt so the assistant adds a zip line that reads{" "}
          <code>unknown</code>{" "}(this house has no zip). Your garage line
          stays:
        </WithAI>
      </Section>
    </Section>
  );
}
