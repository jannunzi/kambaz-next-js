import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import StyleAttribute from "@/app/labs/lab2/intermediates/2-1-1-StyleAttribute";
import CssImport from "@/app/labs/lab2/intermediates/2-1-2-CssImport";
import IdSelectors from "@/app/labs/lab2/intermediates/2-1-3-IdSelectors";
import ClassSelectors from "@/app/labs/lab2/intermediates/2-1-4-ClassSelectors";
import DocumentStructureSelectors from "@/app/labs/lab2/intermediates/2-1-5-DocumentStructureSelectors";

export default function CssBasics() {
  return (
    <>
      <Section
        level={3}
        id="sec-2-1-1"
        title="2.1.1 Styling HTML Tags with the Style Attribute"
      >
        <p>
          Every HTML tag accepts a <code>style</code>{" "}attribute — the same
          name/value pattern introduced with <code>id</code>{" "}in{" "}
          <SectionLink to="1.3.1" />{" "}— that configures the look and feel of
          that one tag directly. In JSX the
          value is not a plain string like in HTML — it is a JavaScript
          object literal (hence the double curly braces: one pair to enter a
          JSX expression, one pair for the object itself), and property names
          are camelCase instead of hyphenated, so{" "}
          <code>background-color</code>{" "}becomes <code>backgroundColor</code>.
        </p>
        <CodeBlock language="tsx">{`<p style={{ backgroundColor: "blue", color: "white" }}>
  ...
</p>`}</CodeBlock>
        <p>
          Add a styled paragraph to <code>app/labs/lab2/page.tsx</code>{" "}
          warning readers about the very technique it demonstrates — the
          style attribute is convenient for a quick experiment, but scattering
          styles across individual tags makes a real project hard to
          maintain, which is why the rest of this section moves styling into
          separate CSS files instead:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab2"
          file="app/labs/lab2/page.tsx"
        >{`export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2 - Cascading Style Sheets</h2>
      <h3>Styling with the STYLE attribute</h3>
      <p style={{ backgroundColor: "blue", color: "white" }}>
        Style attribute allows configuring look and feel right on the
        element. Although it&apos;s very convenient it is considered bad
        practice and you should avoid using the style attribute
      </p>
    </div>
  );
}`}</CodeBlock>
        <p>
          The paragraph&apos;s background turns blue and its text turns white
          — styling applied directly on the element, with no separate CSS
          file involved:
        </p>
        <LiveDemo mode="styled" name="StyleAttribute" file="app/labs/lab2/page.tsx">
          <StyleAttribute />
        </LiveDemo>
      
        <OnYourOwn>
          Still in{" "}
          <code>app/labs/lab2/page.tsx</code>, add another paragraph with a{" "}
          <code>style</code>{" "}attribute that sets a green background and yellow
          foreground text (camelCase: <code>backgroundColor</code>{" "}and{" "}
          <code>color</code>).
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/page.tsx, keep my personal green-on-yellow paragraph unchanged. After the sample blue-on-white style-attribute paragraph, add one more sample paragraph with id wd-ai-style-attr that uses a style attribute for a purple background and white text. Not a sentence about me.`}
        >
          Paste this prompt to add a second sample color combo — then confirm
          the personal green-on-yellow paragraph is still there:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-2"
        title="2.1.2 Importing CSS Documents from React"
      >
        <p>
          The recommended alternative to inline styles is a dedicated{" "}
          <strong>CSS file</strong>: a plain text document you import into a
          component, the same way you import a React component or a library.
          Create <code>app/labs/lab2/index.css</code>{" "}alongside{" "}
          <code>page.tsx</code>{" "}with this content:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`p {
  background-color: green;
  color: white;
}`}</CodeBlock>
        <p>
          The code snippet above is referred to as a CSS <strong>rule</strong> which consists of the following parts:
        </p>
        <ul>
          <li>
            The <strong>selector</strong>{" "}is everything before the opening
            curly brace — here, the tag name <code>p</code>. The selector is used to refer to the HTML elements that will be styled.
          </li>
          <li>
            The curly braces wrap a <strong>declaration block</strong> which contains the
            list of styles to apply to the selected elements.
          </li>
          <li>
            Each line inside the block is a <strong>declaration</strong> which consists of a{" "}
            <strong>property</strong>{" "}(what to change), a colon, a{" "}
            <strong>value</strong>{" "}(what to change it to), and a semicolon.
            So <code>background-color</code>{" "}is the property and{" "}
            <code>green</code>{" "}is the value.
          </li>
        </ul>
        <p>
          In a CSS file, property names use hyphens —{" "}
          <code>background-color</code>{" "}— that is the original CSS syntax.
          The JSX <code>style</code>{" "}object in <SectionLink to="2.1.1" />{" "}
          is not a CSS document. It is a JavaScript object, so an
          unquoted key must be a valid identifier. Hyphens are not allowed in
          identifiers, which is why that object used camelCase:{" "}
          <code>backgroundColor</code>. You can keep the hyphenated CSS name
          in JavaScript if you quote the key, as in{" "}
          <code>{`{ "background-color": "green" }`}</code>. Unquoted camelCase
          is the usual convention in React.
        </p>
        <p>
          A rule, then, is a selector plus its declaration block. Later
          sections introduce new kinds of selectors and many more properties;
          they still assemble into this same shape.
        </p>
        <p>
          Remove the <code>style</code>{" "}attribute from the paragraph and
          import <code>index.css</code>{" "}at the top of{" "}
          <code>page.tsx</code>{" "}instead:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab2"
          file="app/labs/lab2/page.tsx"
        >{`import "./index.css";

export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2 - Cascading Style Sheets</h2>
      <h3>Styling with the STYLE attribute</h3>
      <p>
        Style attribute allows configuring look and feel right on the
        element. Although it&apos;s very convenient it is considered bad
        practice and you should avoid using the style attribute
      </p>
    </div>
  );
}`}</CodeBlock>
        <p>
          Even though the paragraph no longer has a <code>style</code>{" "}
          attribute, it now has a green background and white text — the{" "}
          <code>p</code>{" "}selector in <code>index.css</code>{" "}reaches every
          paragraph in the file, current and future, without touching the
          markup again:
        </p>
        <LiveDemo mode="styled" name="CssImport" file="app/labs/lab2/index.css">
          <CssImport />
        </LiveDemo>
        <p>
          A tag selector is the broadest option: it matches every instance of
          that tag in the document, which is powerful but blunt. The next
          three sections introduce narrower selectors so you can style one
          element, or a chosen group, without restyling every{" "}
          <code>p</code>{" "}on the page.
        </p>
      
        <OnYourOwn>
          In <code>index.css</code>, add a second tag
          rule that styles every <code>h3</code>{" "}(pick a background and text color),
          then confirm it applies to the headings already in{" "}
          <code>page.tsx</code>{" "}without changing their markup.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/index.css, keep my personal h3 tag rule unchanged. After the sample p rule, add one more sample tag rule for h2 with a distinct background and text color (for example navy background and white text). Do not change any markup in page.tsx.`}
        >
          Paste this prompt to add an extra sample tag rule — then reload Lab 2
          and confirm every h2 picks it up without markup changes:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-3"
        title="2.1.3 Selecting HTML Content with CSS ID Selectors"
      >
        <p>
          Instead of restyling every paragraph on the page, an{" "}
          <strong>ID selector</strong>{" "}targets one specific tag by its{" "}
          <code>id</code>{" "}attribute — the same unique identifier introduced
          for styling and DOM lookups back in <SectionLink to="1.3.1" />. An ID selector is
          written as the tag name, a <code>#</code>, and the id value. Comment
          out the blanket <code>p</code>{" "}rule in <code>index.css</code>{" "}and
          add two ID-scoped rules instead:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`/* p {
  background-color: green;
  color: white;
} */

p#wd-id-selector-1 {
  background-color: red;
  color: white;
}
p#wd-id-selector-2 {
  background-color: yellow;
  color: black;
}`}</CodeBlock>
        <p>
          Add two paragraphs carrying those ids to{" "}
          <code>page.tsx</code>, inside a wrapping{" "}
          <code>div</code>{" "}so the exercise stays organized as the file
          grows:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab2"
          file="app/labs/lab2/page.tsx"
        >{`<div id="wd-css-id-selectors">
  <h3>ID selectors</h3>
  <p id="wd-id-selector-1">
    Instead of changing the look and feel of all the
    elements of the same name, e.g., P, we can refer to a
    specific element by its ID
  </p>
  <p id="wd-id-selector-2">
    Here&apos;s another paragraph using a different ID and a
    different look and feel
  </p>
</div>`}</CodeBlock>
        <p>
          Each paragraph now carries its own color scheme — red-on-white for
          the first id, yellow-on-black for the second — while any other
          paragraph on the page is unaffected:
        </p>
        <LiveDemo mode="styled" name="IdSelectors" file="app/labs/lab2/page.tsx">
          <IdSelectors />
        </LiveDemo>
      
        <OnYourOwn>
          Add a third paragraph in{" "}
          <code>page.tsx</code>{" "}with a new id (for example{" "}
          <code>wd-id-selector-3</code>) and a matching{" "}
          <code>p#…</code>{" "}rule in <code>index.css</code>{" "}with its own color
          scheme — leave the other two ids unchanged.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/page.tsx and app/labs/lab2/index.css, keep my personal third id paragraph (for example wd-id-selector-3) unchanged. After the sample wd-id-selector-1 and wd-id-selector-2 paragraphs, add one more sample paragraph with id wd-ai-id-selector and a matching p#wd-ai-id-selector rule with its own background and text color. Do not restyle the other ids.`}
        >
          Paste this prompt to add a fourth sample id — then confirm only that
          new paragraph changes color:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-4"
        title="2.1.4 Selecting HTML Content with CSS Class Selectors"
      >
        <p>
          An id is unique — only one element on the page should carry a given{" "}
          <code>id</code>. When several elements, even of different tag
          types, should share the same look, use a{" "}
          <strong>class selector</strong>{" "}instead: a name prefixed with a
          dot (<code>.</code>) in CSS, applied through the{" "}
          <code>className</code>{" "}attribute in JSX (React reserves the plain{" "}
          <code>class</code>{" "}keyword for JavaScript classes, so JSX renames
          the attribute). Append a class rule to <code>index.css</code>:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-class-selector {
  background-color: yellow;
  color: blue;
}`}</CodeBlock>
        <p>
          Apply that one class to both a paragraph and a heading in{" "}
          <code>page.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab2"
          file="app/labs/lab2/page.tsx"
        >{`<div id="wd-css-class-selectors">
  <h3>Class selectors</h3>
  <p className="wd-class-selector">
    Instead of using IDs to refer to elements, you can use an
    element&apos;s CLASS attribute
  </p>
  <h4 className="wd-class-selector">
    This heading has same style as paragraph above
  </h4>
</div>`}</CodeBlock>
        <p>
          Both the paragraph and the heading — two different tag types —
          pick up the identical yellow background and blue text, because
          both carry the same class:
        </p>
        <LiveDemo mode="styled" name="ClassSelectors" file="app/labs/lab2/page.tsx">
          <ClassSelectors />
        </LiveDemo>
      
        <OnYourOwn>
          Still in <code>page.tsx</code>, invent a
          second class (for example <code>wd-your-class</code>) in{" "}
          <code>index.css</code>{" "}and apply it to both a{" "}
          <code>p</code>{" "}and an <code>h4</code>{" "}so two different tags share
          one look.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/page.tsx and app/labs/lab2/index.css, keep my personal class (wd-your-class or similar) unchanged. After the sample wd-class-selector block, add a sample class .wd-ai-class-selector with a distinct background and text color, and apply it to both a p and an h4. Not my personal class.`}
        >
          Paste this prompt to add a second sample class on two tags — then
          confirm your personal class still only styles your elements:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-5"
        title="2.1.5 Selecting HTML Content Based on the Document Structure"
      >
        <p>
          Selectors can also be combined to target tags by their position in
          the document tree. Separating two class names with a space, as in{" "}
          <code>.wd-selector-1 .wd-selector-3</code>, matches any element with{" "}
          <code>wd-selector-3</code>{" "}nested anywhere inside an element with{" "}
          <code>wd-selector-1</code>{" "}— a <strong>descendant</strong>{" "}
          relationship, no matter how deeply nested. Separating them with a{" "}
          <code>&gt;</code>, as in{" "}
          <code>.wd-selector-2 &gt; .wd-selector-3</code>, is stricter: it only
          matches a <strong>direct child</strong>. Nest four elements in{" "}
          <code>page.tsx</code>{" "}to see both relationships in action:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab2"
          file="app/labs/lab2/page.tsx"
        >{`<div id="wd-css-document-structure">
  <div className="wd-selector-1">
    <h3>Document structure selectors</h3>
    <div className="wd-selector-2">
      Selectors can be combined to refer elements in particular
      places in the document
      <p className="wd-selector-3">
        This paragraph&apos;s red background is referenced as
        <br />
        .selector-2 .selector3
        <br />
        meaning the descendant of some ancestor.
        <br />
        <span className="wd-selector-4">
          Whereas this span is a direct child of its parent
        </span>
        <br />
        You can combine these relationships to create specific
        styles depending on the document structure
      </p>
    </div>
  </div>
</div>`}</CodeBlock>
        <p>
          Style <code>.wd-selector-3</code>{" "}as a descendant of{" "}
          <code>.wd-selector-1</code>{" "}(any depth), and{" "}
          <code>.wd-selector-4</code>{" "}only when it is a direct child of{" "}
          <code>.wd-selector-3</code>, which in turn must be a direct child
          of <code>.wd-selector-2</code>:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-selector-1 .wd-selector-3 {
  background-color: red;
  color: white;
}
.wd-selector-2 > .wd-selector-3 > .wd-selector-4 {
  background-color: yellow;
  color: blue;
}`}</CodeBlock>
        <p>
          The paragraph renders with a red background from the first,
          broader descendant rule, while the span nested directly inside it
          switches to yellow-on-blue from the second, stricter child rule —
          both rules matching the same paragraph, with the more specific one
          winning for the span:
        </p>
        <LiveDemo
          mode="styled"
          name="DocumentStructureSelectors"
          file="app/labs/lab2/page.tsx"
        >
          <DocumentStructureSelectors />
        </LiveDemo>
      
        <OnYourOwn>
          Extend the nested structure in{" "}
          <code>page.tsx</code>{" "}with one more element and a new descendant or
          child selector in <code>index.css</code>{" "}— then verify only the intended
          node changes color when you tweak the combinator.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/page.tsx and app/labs/lab2/index.css, keep my extra nested element and its selector unchanged. After the sample .wd-selector-1 .wd-selector-3 and child combinator rules, add a sample span with class wd-ai-selector-5 nested inside .wd-selector-3 and a descendant rule .wd-selector-1 .wd-ai-selector-5 with its own background and text color. Do not restyle my personal node.`}
        >
          Paste this prompt to add one extra sample descendant — then tweak the
          combinator and confirm only that new node changes color:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-6"
        title="2.1.6 CSS Selection Rule Mechanism"
      >
        <p>
          By the time a browser paints an element, several rules may compete
          to set the same property — a browser default, a tag selector, a
          class, an id. The &quot;<strong>Cascading</strong>&quot;{" "}in
          Cascading Style Sheets describes exactly how the browser picks a
          winner:
        </p>
        <ol>
          <li>
            <strong>Specificity</strong>: more precise selectors win over
            more general ones. An id selector beats a class selector, which
            beats a plain tag selector, which beats the browser&apos;s
            built-in default.
          </li>
          <li>
            <strong>Source order</strong>: if two rules have the same
            specificity, the rule declared later in the CSS wins — this is
            why the ID selectors in <SectionLink to="2.1.3" />{" "}had to come after (or replace) the
            tag selector from <SectionLink to="2.1.2" />, not merely exist alongside it with
            lower specificity resolving the conflict on their own.
          </li>
          <li>
            <strong>Inheritance</strong>: some properties, like{" "}
            <code>color</code>{" "}and other font properties, pass down from a
            parent element to its children automatically unless overridden.
            Layout properties like <code>width</code>{" "}and{" "}
            <code>margin</code>{" "}do not inherit — each element needs its own
            rule.
          </li>
        </ol>
        <p>
          Keep this order in mind whenever a style you expect to see does not
          appear: check first whether a more specific selector elsewhere is
          winning, then whether a later rule with equal specificity is
          overriding it.
        </p>
      
        <OnYourOwn>
          In <code>index.css</code>, deliberately
          conflict a tag rule, a class rule, and an id rule on the same property for
          one element in <code>page.tsx</code>, then use DevTools to confirm
          specificity (and source order) pick the winner you expect.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/index.css and app/labs/lab2/page.tsx, keep my personal specificity experiment unchanged. Add a sample paragraph with id wd-ai-cascade and class wd-ai-cascade that also matches a p tag rule, all three setting background-color to different colors (tag green, class yellow, id red). Put the id rule last. Add a short comment above the rules naming which selector should win.`}
        >
          Paste this prompt to add a labeled sample conflict — then use DevTools
          to confirm the id background wins:
        </WithAI>
      </Section>
    </>
  );
}
