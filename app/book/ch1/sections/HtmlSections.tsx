import BookSectionVideosLink from "../../components/BookSectionVideosLink";
import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import LocalUrl from "../../components/LocalUrl";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import HeadingTags from "@/app/labs/lab1/HeadingTags";
import ParagraphTag from "@/app/labs/lab1/ParagraphTag";
import Tables from "@/app/labs/lab1/Tables";
import Images from "@/app/labs/lab1/Images";
import AnchorTag from "@/app/labs/lab1/AnchorTag";
import Lab1 from "@/app/labs/lab1/page";
import ParagraphUnwrapped from "@/app/labs/lab1/intermediates/1-3-2a-ParagraphUnwrapped";
import OrderedListPlain from "@/app/labs/lab1/intermediates/1-3-3a-OrderedListPlain";
import OrderedListTagged from "@/app/labs/lab1/intermediates/1-3-3b-OrderedListTagged";
import UnorderedLists from "@/app/labs/lab1/intermediates/1-3-4-UnorderedLists";
import ListTags from "@/app/labs/lab1/ListTags";
import TextFields from "@/app/labs/lab1/forms/TextFields";
import Textarea from "@/app/labs/lab1/forms/Textarea";
import RadioButtonsGenre from "@/app/labs/lab1/intermediates/1-3-7c-RadioButtons";
import RadioButtons from "@/app/labs/lab1/forms/RadioButtons";
import Checkboxes from "@/app/labs/lab1/forms/Checkboxes";
import Dropdowns from "@/app/labs/lab1/forms/Dropdowns";
import DropdownSingle from "@/app/labs/lab1/intermediates/1-3-7e1-DropdownSingle";
import OtherFieldTypes from "@/app/labs/lab1/forms/OtherFieldTypes";
import Buttons from "@/app/labs/lab1/forms/Buttons";
import FieldEmail from "@/app/labs/lab1/intermediates/1-3-7f1-FieldEmail";
import FieldEmailNumber from "@/app/labs/lab1/intermediates/1-3-7f2-FieldEmailNumber";
import FieldEmailNumberRange from "@/app/labs/lab1/intermediates/1-3-7f3-FieldEmailNumberRange";
import Forms from "@/app/labs/lab1/forms/Forms";
import RadioLabelPatterns from "@/app/labs/lab1/intermediates/1-3-7c3-RadioLabelPatterns";
import HighlightedParagraph from "@/app/labs/lab1/HighlightedParagraph";
import HighlightedBox from "@/app/labs/lab1/HighlightedBox";
import LabsIndexDemo from "@/app/labs/lab1/intermediates/1-3-11-LabsIndex";
import LabsLayoutDemo from "@/app/labs/lab1/intermediates/1-3-12-LabsLayout";
import AnchorHrefPatterns from "@/app/labs/lab1/intermediates/1-3-10b-AnchorHrefPatterns";
import { OnYourOwn, WithAI } from "../../components/Practice";
import A1LabExerciseList, {
  A1LabExerciseIntroLink,
} from "./A1LabExerciseList";

export default function HtmlSections() {
  return (
    <>
      <Section id="sec-1-3" title="1.3 Introduction to HTML">
        <p>
          <strong>HTML</strong>{" "}(HyperText Markup Language) is a specialized
          dialect of <strong>XML</strong>{" "}(eXtensible Markup Language) designed
          for structuring and formatting plain text so web browsers can interpret
          and render it with specific styles, layouts, and interactivity. In
          Next.js you write that HTML as <strong>JSX</strong>{" "}inside React
          components (in <code>.tsx</code>{" "}files — see <SectionLink to="1.2.5" />). For this chapter,
          focus on the tags and structure; treat the surrounding component syntax
          as the container that delivers HTML to the browser. A coverage
          checklist is in <SectionLink to="1.3.12" /> — use it after you have
          walked through the tags, not instead of building them as you read.
        </p>
        <p>
          Consider the following snippet, which marks the text &quot;Labs&quot;
          as a level-1 heading so the browser typically shows it large and bold:
        </p>
        <CodeBlock language="html">{`<h1>Labs</h1>`}</CodeBlock>
        <p>
          The browser shows &quot;Labs&quot; as a large, bold level-1 heading —
          the visual cue that this is a top-level title:
        </p>
        <LiveDemo>
          <h1>Labs</h1>
        </LiveDemo>
        <p>
          In that code, <code>&lt;h1&gt;</code>{" "}and <code>&lt;/h1&gt;</code>{" "}are
          called <strong>tags</strong>. <code>&lt;h1&gt;</code>{" "}is the{" "}
          <strong>opening tag</strong>, and <code>&lt;/h1&gt;</code>{" "}is the{" "}
          <strong>closing tag</strong>. The text &quot;Labs&quot; between them
          is the <strong>body</strong>{" "}(or content) of the tag. Tags add
          semantic meaning — for example, <code>h1</code>{" "}signals a top-level
          heading, which browsers style with a larger font and bold weight by
          default.
        </p>
        <p>
          When a browser parses this HTML (or JSX in a Next.js component), it
          builds an in-memory tree called the <strong>DOM</strong>{" "}(Document
          Object Model). Each tag becomes a <strong>node</strong>{" "}in that tree.
          The DOM is what the browser uses to paint the page, and JavaScript —
          including React in Next.js — can programmatically update nodes later without reloading
          the whole page.
        </p>
        <p>
          We often say &quot;tag&quot; and &quot;element&quot; interchangeably,
          but there is a small distinction. A <strong>tag</strong>{" "}is the
          textual syntax in your source (for example{" "}
          <code>&lt;h1&gt;</code>), while an <strong>element</strong>{" "}is the
          fuller idea — the tag, optional <strong>attributes</strong>{" "}(settings
          on the opening tag — introduced with <code>id</code>{" "}in <SectionLink to="1.3.1" />), its
          body, and the DOM node that results. Either word is fine day to day;
          the distinction mainly helps when you inspect the page in tools like{" "}
          <strong>Chrome DevTools</strong>.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-1-3-1"
        title="1.3.1 Structuring Web Content with the HTML Heading, Div, and Span Tags"
      >
        <p>
          The <code>&lt;h1&gt;</code>{" "}through <code>&lt;h6&gt;</code>{" "}tags
          format section titles so they render larger and bolder than the plain
          text that follows. Text documents are often broken up into several
          sections and subsections, and each section is usually prefaced with a
          short title that summarizes the topic it precedes.{" "}
          <code>&lt;h1&gt;</code>{" "}is the largest heading;{" "}
          <code>&lt;h6&gt;</code>{" "}is the smallest.
        </p>
        <p>
          Another common element is the <code>&lt;div&gt;</code>{" "}tag (division
          tag) — a generic container used to group elements together. Unlike
          headings, <code>&lt;div&gt;</code>{" "}does not add much inherent visual
          styling beyond behaving like a <strong>block</strong>. It starts on a
          new line and stretches as wide as its parent. Its job is grouping a
          heading, paragraph, and image as one unit so you can style or lay
          them out together later with CSS.
        </p>
        <p>
          The opposite of a block is an <strong>inline</strong>{" "}element. Inline
          tags sit in the line of text without breaking to a new row — the way
          a word sits among other words. The generic inline container is the{" "}
          <code>&lt;span&gt;</code>{" "}tag. Later you will meet other inline tags such as{" "}
          <code>a</code>{" "}(links in <SectionLink to="1.3.9" />) and many form
          controls. Headings, <code>p</code>, <code>div</code>, lists, and{" "}
          <code>form</code>{" "}are blocks; <code>span</code>, <code>a</code>, and{" "}
          <code>strong</code>{" "}are inline. <ChapterLink to={2} />{" "}lets you
          change that default with the CSS <code>display</code>{" "}property (
          <SectionLink to="2.1.12" />); for now, notice the difference in the
          heading example below — the{" "}
          <code>div</code>{" "}and <code>h4</code>{" "}each start on their own line,
          while the <code>span</code>{" "}stays in its sentence.
        </p>
        <p>
          For Lab 1, keep each HTML topic in its own component under{" "}
          <code>app/labs/lab1/</code>, then import those components into{" "}
          <code>app/labs/lab1/page.tsx</code>. Start with headings by creating{" "}
          <code>app/labs/lab1/HeadingTags.tsx</code>{" "}with a{" "}
          <code>div</code>{" "}that holds an <code>h4</code>{" "}plus the explanatory
          text about heading tags:
        </p>
        <CodeBlock
          language="tsx"
          name="HeadingTags"
          file="app/labs/lab1/HeadingTags.tsx"
        >{`export default function HeadingTags() {
  return (
    <div id="wd-h-tag">
      <h4>Heading Tags</h4>
      Text documents are often broken up into several sections and subsections.
      Each section is usually prefaced with a short title or heading that
      attempts to summarize the topic of the section it precedes. For instance
      this paragraph is preceded by the heading Heading Tags. The font of the
      section headings are usually larger and bolder than their subsection
      headings. This document uses headings to introduce topics such as HTML
      Documents, HTML Tags, Heading Tags, etc. HTML heading tags can be used
      to format plain text so that it renders in a browser as large headings.
      There are 6 heading tags for different sizes: h1, h2, h3, h4, h5, and
      h6. Tag h1 is the largest heading and h6 is the smallest heading. A{" "}
      <span id="wd-inline-span">span</span> sits in this sentence without
      starting a new line.
    </div>
  );
}`}</CodeBlock>
        <p>
          Notice <code>id=&quot;wd-h-tag&quot;</code>{" "}on the opening{" "}
          <code>&lt;div&gt;</code>. That is an <strong>attribute</strong> — a
          name/value pair written inside the opening tag that configures the
          element. Here the name is <code>id</code>{" "}and the value is{" "}
          <code>wd-h-tag</code>. An <code>id</code>{" "}gives the element a unique
          name on the page — useful for styling, testing, and (later) linking to
          a spot in the document. You will see many more attributes as you add
          images, forms, and links. The pattern is always{" "}
          <code>name=&quot;value&quot;</code>{" "}on the opening tag.
        </p>
        <p>
          The <code>h4</code>{" "}stands out above the body text, and the{" "}
          <code>div</code>{" "}keeps them grouped as one block — nothing flashy yet,
          just structure:
        </p>
        <LiveDemo name="HeadingTags" file="app/labs/lab1/HeadingTags.tsx">
          <HeadingTags />
        </LiveDemo>
        <p>
          That markup is the book sample. Keep its text — the <code>h4</code>{" "}
          titled Heading Tags and the paragraph under it — unless a step says
          to replace it. Do not erase the book sample every time you add
          something.
        </p>
        <p>
          As practice, add <code>h1</code>{" "}through <code>h6</code>{" "}in the
          same <code>wd-h-tag</code>{" "}division, after the sample paragraph, so
          you can see the six sizes. Leave the sample <code>h4</code>{" "}and its
          paragraph in place. Add this practice block before{" "}
          <strong>With AI</strong>. That later prompt refers to these practice
          headings. Your personal <code>h4</code>{" "}in On your own stays in its
          own section:
        </p>
        <CodeBlock language="tsx">{`<h1>h1</h1>
<h2>h2</h2>
<h3>h3</h3>
<h4>h4</h4>
<h5>h5</h5>
<h6>h6</h6>`}</CodeBlock>
        <p>
          <strong>Try Chrome DevTools.</strong>{" "}With Lab 1 open in Chrome, press{" "}
          <code>F12</code>{" "}(or <code>Cmd+Option+I</code>{" "}on macOS /{" "}
          <code>Ctrl+Shift+I</code>{" "}on Windows) to open{" "}
          <strong>Developer Tools</strong>. Choose the{" "}
          <strong>Elements</strong>{" "}panel — that shows the live DOM tree the
          browser built from your JSX. Use Find (<code>Cmd+F</code>{" "}/{" "}
          <code>Ctrl+F</code>{" "}inside the panel) and search for{" "}
          <code>wd-h-tag</code>. You should land on the{" "}
          <code>&lt;div id=&quot;wd-h-tag&quot;&gt;</code>{" "}node. Click it and
          glance at the styles and attributes on the right. This habit — find an{" "}
          <code>id</code>, inspect the node — is how you debug markup for the
          rest of the course.
        </p>
        <p>
          Next, wire the component into Lab 1. In{" "}
          <code>app/labs/lab1/page.tsx</code>, add an <code>h3</code>{" "}for
          &quot;HTML Examples&quot;, import <code>HeadingTags</code>, and render
          it. The <code>import</code>{" "}line brings the default export from{" "}
          <code>HeadingTags.tsx</code>{" "}into this file so you can use{" "}
          <code>&lt;HeadingTags /&gt;</code>{" "}like an HTML tag:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab1"
          file="app/labs/lab1/page.tsx"
        >{`import HeadingTags from "./HeadingTags";

export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <h3>HTML Examples</h3>
      <HeadingTags />
      {/* do the next exercise here */}
    </div>
  );
}`}</CodeBlock>
        <p>
          At <LocalUrl href="/labs/lab1">/labs/lab1</LocalUrl>{" "}you should see Lab 1, HTML Examples, and
          Heading Tags appear as successively smaller headings, the original
          sample paragraph still inside the <code>wd-h-tag</code>{" "}division, and
          the <code>h1</code>–<code>h6</code>{" "}you added as practice after that
          paragraph. Leave the <code>{`{/* do the next exercise here */}`}</code>{" "}
          comment as a marker for the following sections — you will replace it
          by importing more components the same way.
        </p>
        <OnYourOwn>
          In the same <code>HeadingTags.tsx</code>{" "}file, add a short personal
          section — an <code>h4</code>{" "}with your name (or a nickname) and a
          sentence or two about yourself under it. Wrap that block in a{" "}
          <code>div</code>{" "}with id <code>wd-your-heading</code>{" "}so you can
          find it later in DevTools. Wrap one word of that sentence in a{" "}
          <code>span</code>{" "}with id <code>wd-your-span</code>{" "}so you can
          compare a block and an inline element in the same personal section.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab1/HeadingTags.tsx, keep the existing book sample — the h4 titled "Heading Tags" and the paragraph under it — unless a step says to replace it. Do not erase that sample text. Keep my personal heading block as it is. After the practice h1–h6 headings you added, add a second sample outline (not about me) with id wd-ai-headings: an h4 titled "Lab notes", an h5 titled "What I built", and an h6 titled "Next step". Use placeholder sentences, not my name.`}
        >
          Add the practice <code>h1</code>–<code>h6</code>{" "}headings before
          this step. If that block is still missing, add it first; your
          personal <code>h4</code>{" "}from On your own stays in its own section.
          Then ask the assistant to add a second sample outline after the
          practice <code>h1</code>–<code>h6</code>{" "}headings you added. Keep
          the book sample (the <code>h4</code>{" "}and its paragraph) and your
          personal heading:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-1-3-2"
        title="1.3.2 Formatting Vertical Spacing with the HTML Paragraph Tag"
      >
        <p>
          The <code>&lt;p&gt;</code>{" "}tag wraps a block of text so the browser
          adds vertical space around it. Browsers ignore extra spaces, tabs, and
          newlines in your source, so without paragraph tags those blocks blend
          together. Create <code>app/labs/lab1/ParagraphTag.tsx</code>{" "}for this
          section; you will import it into Lab 1 once it is finished.
        </p>
        <p>
          Without paragraph tags around later blocks, the browser treats the
          text as one contiguous stream that flows left to right and wraps only
          when it runs out of horizontal space. That is{" "}
          <strong>inline</strong>{" "}layout behavior. Even if you put blank lines
          between paragraphs in the source, those breaks are ignored and the
          text blends together:
        </p>
        <CodeBlock
          language="tsx"
          name="ParagraphTag"
          file="app/labs/lab1/ParagraphTag.tsx"
        >{`export default function ParagraphTag() {
  return (
    <div id="wd-p-tag">
      <h4>Paragraph Tag</h4>
      <p id="wd-p-1">...</p>
      This is the first paragraph. The paragraph tag is used to format
      vertical gaps between long pieces of text like this one.

      This is the second paragraph. Even though there is a deliberate white
      gap between the paragraph above and this paragraph, by default browsers
      render them as one contiguous piece of text as shown here on the right.

      This is the third paragraph. Wrap each paragraph with the paragraph tag
      to tell browsers to render the gaps.
    </div>
  );
}`}</CodeBlock>
        <p>
          Those blank lines in the source disappear in the browser — the three
          chunks blend into one continuous stream of text:
        </p>
        <LiveDemo name="ParagraphTag" file="app/labs/lab1/ParagraphTag.tsx">
          <ParagraphUnwrapped />
        </LiveDemo>
        <p>
          To get the intended vertical spacing, wrap each paragraph so the
          browser adds margin above and below. Paragraph and heading tags are{" "}
          <strong>block elements</strong>. They take the full width of their
          parent and add vertical space before and after their content. By
          combining inline and block layout, you can build clearer document
          structures.
        </p>
        <CodeBlock
          language="tsx"
          name="ParagraphTag"
          file="app/labs/lab1/ParagraphTag.tsx"
        >{`export default function ParagraphTag() {
  return (
    <div id="wd-p-tag">
      <h4>Paragraph Tag</h4>
      <p id="wd-p-1">
        This is a paragraph. We often separate a long set of sentences with
        vertical spaces to make the text easier to read. Browsers ignore
        vertical white spaces and render all the text as one single set of
        sentences. To force the browser to add vertical spacing, wrap the
        paragraphs you want to separate with the paragraph tag
      </p>
      <p id="wd-p-2">
        This is the first paragraph. The paragraph tag is used to format
        vertical gaps between long pieces of text like this one.
      </p>
      <p id="wd-p-3">
        This is the second paragraph. Even though there is a deliberate white
        gap between the paragraph above and this paragraph, by default
        browsers render them as one contiguous piece of text as shown here on
        the right.
      </p>
      <p id="wd-p-4">
        This is the third paragraph. Wrap each paragraph with the paragraph
        tag to tell browsers to render the gaps.
      </p>
    </div>
  );
}`}</CodeBlock>
        <p>
          With each block wrapped in <code>&lt;p&gt;</code>, the browser adds
          vertical gaps so the three paragraphs read as separate units:
        </p>
        <LiveDemo name="ParagraphTag" file="app/labs/lab1/ParagraphTag.tsx">
          <ParagraphTag />
        </LiveDemo>
        <p>
          Now import <code>ParagraphTag</code>{" "}into Lab 1 the same way you
          imported <code>HeadingTags</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab1"
          file="app/labs/lab1/page.tsx"
        >{`import HeadingTags from "./HeadingTags";
import ParagraphTag from "./ParagraphTag";

export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <h3>HTML Examples</h3>
      <HeadingTags />
      <ParagraphTag />
      {/* do the next exercise here */}
    </div>
  );
}`}</CodeBlock>
        <OnYourOwn>
          Still in <code>ParagraphTag.tsx</code>, add two more{" "}
          <code>&lt;p&gt;</code>{" "}elements that introduce you — for example
          where you are from and what you hope to learn in this course. Give
          them ids <code>wd-p-your-1</code>{" "}and <code>wd-p-your-2</code>. You
          should see vertical gaps between your paragraphs the same way it does
          for the sample text.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab1/ParagraphTag.tsx, keep the two personal paragraphs (wd-p-your-1 and wd-p-your-2) unchanged. After the sample lorem paragraphs, add one more sample <p id="wd-ai-p"> that explains in one or two sentences why wrapping text in <p> creates vertical spacing. Do not write about me.`}
        >
          Ask the assistant to add one extra sample paragraph that explains the
          tag — leave your two personal paragraphs alone:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-1-3-3"
        title="1.3.3 Listing Content with HTML List Tags"
      >
        <p>
          The <code>&lt;ol&gt;</code>, <code>&lt;ul&gt;</code>, and{" "}
          <code>&lt;li&gt;</code>{" "}tags group related items into a collection the
          reader can scan as a unit — steps in a recipe, titles on a shelf,
          anything that belongs together rather than in a free-flowing paragraph.
          There are two primary types: <strong>ordered</strong>{" "}and{" "}
          <strong>unordered</strong>. Ordered lists (<code>&lt;ol&gt;</code>)
          are for sequences where order matters — for example, procedural steps.
          Unordered lists (<code>&lt;ul&gt;</code>) are for collections where
          order does not change the meaning; the browser uses bullets instead of
          numbers. Each item in either list is wrapped in a{" "}
          <code>&lt;li&gt;</code>. If you type numbered lines without list
          tags, the browser still treats them as ordinary text and blends them
          into one paragraph, just like unwrapped paragraphs earlier.
        </p>
        <p>
          Create <code>ListTags.tsx</code>{" "}and import it into{" "}
          <code>page.tsx</code>{" "}the same way. First write the pancake steps below as
          plain text (no <code>&lt;ol&gt;</code>{" "}yet):
        </p>
        <CodeBlock
          language="tsx"
          name="ListTags"
          file="app/labs/lab1/ListTags.tsx"
        >{`export default function ListTags() {
  return (
    <div id="wd-lists">
      <h4>List Tags</h4>
      <h5>Ordered List Tag</h5>
      How to make pancakes:
      1. Mix dry ingredients.
      2. Add wet ingredients.
      3. Stir to combine.
      4. Heat a skillet or griddle.
      5. Pour batter onto the skillet.
      6. Cook until bubbly on top.
      7. Flip and cook the other side.
      8. Serve and enjoy!
    </div>
  );
}`}</CodeBlock>
        <p>
          The numbered steps do not look like a list — they run together on one
          flowing line, the same way unwrapped paragraphs did:
        </p>
        <LiveDemo name="ListTags" file="app/labs/lab1/ListTags.tsx">
          <OrderedListPlain />
        </LiveDemo>
        <p>
          The intended formatting can be achieved by wrapping the whole list
          in <code>&lt;ol&gt;</code> / <code>&lt;/ol&gt;</code>, and each step
          in <code>&lt;li&gt;</code> / <code>&lt;/li&gt;</code>. The browser
          numbers the items for you, so the sequence stays correct even if you
          add or remove steps. You might want to remove the unnecessary numbers added earlier.
        </p>
        <CodeBlock
          language="tsx"
          name="ListTags"
          file="app/labs/lab1/ListTags.tsx"
        >{`export default function ListTags() {
  return (
    <div id="wd-lists">
      <h4>List Tags</h4>
      <h5>Ordered List Tag</h5>
      How to make pancakes:
      <ol id="wd-pancakes">
        <li>Mix dry ingredients.</li>
        <li>Add wet ingredients.</li>
        <li>Stir to combine.</li>
        <li>Heat a skillet or griddle.</li>
        <li>Pour batter onto the skillet.</li>
        <li>Cook until bubbly on top.</li>
        <li>Flip and cook the other side.</li>
        <li>Serve and enjoy!</li>
      </ol>
    </div>
  );
}`}</CodeBlock>
        <p>
          Both <code>&lt;ol&gt;</code>{" "}and <code>&lt;li&gt;</code>{" "}are{" "}
          <strong>block elements</strong>, so items stack vertically across the
          width of their container. Now each step sits on its own line with
          automatic numbering:
        </p>
        <LiveDemo name="ListTags" file="app/labs/lab1/ListTags.tsx">
          <OrderedListTagged />
        </LiveDemo>
        <p>
          Unordered lists use the same <code>&lt;li&gt;</code>{" "}items inside{" "}
          <code>&lt;ul&gt;</code>{" "}instead of <code>&lt;ol&gt;</code>.{" "}
          <code>&lt;ul&gt;</code>{" "}is a <strong>block element</strong> too.
          Continue in the same <code>ListTags.tsx</code>{" "}file. After the pancake
          list, add an unordered list of my favorite books:
        </p>
        <CodeBlock
          language="tsx"
          name="ListTags"
          file="app/labs/lab1/ListTags.tsx"
        >{`How to make pancakes:
<ol id="wd-pancakes">
  {/* pancake steps */}
</ol>
<h5>Unordered List Tag</h5>
My favorite books (in no particular order)
<ul id="wd-my-books">
  <li>Dune</li>
  <li>Lord of the Rings</li>
  <li>Ender&apos;s Game</li>
  <li>Red Mars</li>
  <li>The Forever War</li>
</ul>`}</CodeBlock>
        <p>
          The books appear as a bulleted list — no numbers, and no blending into
          a single paragraph:
        </p>
        <LiveDemo name="ListTags" file="app/labs/lab1/ListTags.tsx">
          <UnorderedLists />
        </LiveDemo>
        <OnYourOwn>
          In the same file, add two personal lists — an ordered list of your own
          favorite recipe (at least three steps) with id{" "}
          <code>wd-your-favorite-recipe</code>, and an unordered list with id{" "}
          <code>wd-your-books</code>{" "}and at least three titles you actually
          like (books, albums, or podcasts — your call). Do not copy the sample
          below — pick content that is yours. The figure is one possible result;
          yours will look different.
        </OnYourOwn>
        <LiveDemo name="ListTags" file="app/labs/lab1/ListTags.tsx">
          <ListTags />
        </LiveDemo>
        <WithAI
          prompt={`In app/labs/lab1/ListTags.tsx, keep my personal lists (wd-your-favorite-recipe and wd-your-books) unchanged. After the sample pancake and book lists, add an unordered list with id wd-ai-html-tags of at least five HTML tags from this chapter (for example h1, p, ol, ul, table) with a short phrase each. Not about me.`}
        >
          Ask the assistant to add one more sample list of HTML tags from this
          chapter — not your recipe or favorites:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-1-3-4"
        title="1.3.4 Tabulating Data with the HTML Table Tags"
      >
        <p>
          The <code>&lt;table&gt;</code>{" "}tag organizes data into rows and
          columns. HTML began as a way to share scientific documents among
          physicists, and those documents often included structured measurements
          — speed, temperature, location — presented in tabular form, which is
          why the tag was added in the mid-1990s. For example, quiz grades over a
          semester can look like this:
        </p>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse border border-neutral-400 text-left text-sm">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border border-neutral-400 px-2 py-1">Quiz</th>
                <th className="border border-neutral-400 px-2 py-1 text-center">
                  Topic
                </th>
                <th className="border border-neutral-400 px-2 py-1 text-center">
                  Date
                </th>
                <th className="border border-neutral-400 px-2 py-1">Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-neutral-400 px-2 py-1">Q1</td>
                <td className="border border-neutral-400 px-2 py-1 text-center">
                  HTML
                </td>
                <td className="border border-neutral-400 px-2 py-1 text-center">
                  2/3/21
                </td>
                <td className="border border-neutral-400 px-2 py-1 text-right">
                  85
                </td>
              </tr>
              <tr>
                <td className="border border-neutral-400 px-2 py-1">Q2</td>
                <td className="border border-neutral-400 px-2 py-1 text-center">
                  CSS
                </td>
                <td className="border border-neutral-400 px-2 py-1 text-center">
                  2/10/21
                </td>
                <td className="border border-neutral-400 px-2 py-1 text-right">
                  90
                </td>
              </tr>
              <tr>
                <td className="border border-neutral-400 px-2 py-1">Q3</td>
                <td className="border border-neutral-400 px-2 py-1 text-center">
                  JavaScript
                </td>
                <td className="border border-neutral-400 px-2 py-1 text-center">
                  2/17/21
                </td>
                <td className="border border-neutral-400 px-2 py-1 text-right">
                  95
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="border border-neutral-400 px-2 py-1" colSpan={3}>
                  Average
                </td>
                <td className="border border-neutral-400 px-2 py-1 text-right">
                  90
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p>Several things to note:</p>
        <ol>
          <li>The first row is formatted as headings for each column.</li>
          <li>There are data rows — one quiz per row.</li>
          <li>Data under the same column shares the same kind of value, e.g. name, date, grade, etc.</li>
          <li>The last row is formatted as a footer.</li>
          <li>
            The first three columns of the footer are merged into one cell
            (cells can span to adjacent rows or columns).
          </li>
        </ol>
        <p>HTML tables use nested tags:</p>
        <ul>
          <li>
            <code>table</code> — declares the table
          </li>
          <li>
            <code>thead</code> — heading section
          </li>
          <li>
            <code>tbody</code> — main data rows
          </li>
          <li>
            <code>tfoot</code> — footer section
          </li>
          <li>
            <code>tr</code> — a row
          </li>
          <li>
            <code>th</code> — a heading cell
          </li>
          <li>
            <code>td</code> — a data cell
          </li>
        </ul>
        <p>
          Those tags define structure. Presentational attributes on the table
          and its cells control size, borders, merging, and alignment — useful
          now, before CSS in <ChapterLink to="2" />. In JSX some names are
          camelCase because they map to DOM properties:
        </p>
        <ul>
          <li>
            <code>border</code> — on <code>table</code>. Pixel thickness of the
            grid. Use <code>0</code> for none, <code>1</code> for a thin line (
            <code>border={"{1}"}</code>). Larger integers draw thicker lines.
          </li>
          <li>
            <code>width</code> — on <code>table</code>, <code>td</code>, or{" "}
            <code>th</code>. Size as a percentage of the parent (
            <code>&quot;100%&quot;</code>, <code>&quot;25%&quot;</code>) or in
            pixels (<code>&quot;200&quot;</code>).{" "}
            <code>width=&quot;100%&quot;</code> stretches the table across its
            container.
          </li>
          <li>
            <code>colSpan</code> — on <code>td</code> or <code>th</code> (HTML{" "}
            <code>colspan</code>). How many columns this cell occupies. A
            positive integer; default is <code>1</code>. The Average row uses{" "}
            <code>colSpan={"{3}"}</code> so the label covers Quiz, Topic, and
            Date.
          </li>
          <li>
            <code>rowSpan</code> — on <code>td</code> or <code>th</code> (HTML{" "}
            <code>rowspan</code>). How many rows this cell occupies. A positive
            integer; default is <code>1</code>. Use it when one label should sit
            beside several rows — for example a unit that covers Q1–Q3.
          </li>
          <li>
            <code>align</code> — on <code>td</code>, <code>th</code>, or{" "}
            <code>tr</code>. Horizontal placement of the cell&apos;s content:{" "}
            <code>&quot;left&quot;</code>, <code>&quot;center&quot;</code>,{" "}
            <code>&quot;right&quot;</code> (also{" "}
            <code>&quot;justify&quot;</code>). Default for data cells is left;
            heading cells often default to center. Numbers read more clearly
            when right-aligned; short labels and dates often sit in the center.
          </li>
          <li>
            <code>valign</code> — on <code>td</code>, <code>th</code>, or{" "}
            <code>tr</code>. Vertical placement when a row is taller than its
            content: <code>&quot;top&quot;</code>,{" "}
            <code>&quot;middle&quot;</code>, <code>&quot;bottom&quot;</code>{" "}
            (also <code>&quot;baseline&quot;</code>). Default is middle. Layout
            tables later use <code>valign=&quot;top&quot;</code> so navigation
            stays at the top of a tall cell.
          </li>
        </ul>
        <p>
          Put them on the quiz table: full width, a visible border, Average
          spanning three columns, Topic and Date centered, grade numbers
          right-aligned. Create <code>Tables.tsx</code>, import it into{" "}
          <code>page.tsx</code>, and include Q1–Q3 with sample dates and
          scores:
        </p>
        <CodeBlock
          language="tsx"
          name="Tables"
          file="app/labs/lab1/Tables.tsx"
        >{`export default function Tables() {
  return (
    <div id="wd-tables">
      <h4>Table Tag</h4>
      <table border={1} width="100%">
        <thead>
          <tr>
            <th>Quiz</th>
            <th align="center">Topic</th>
            <th align="center">Date</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Q1</td>
            <td align="center">HTML</td>
            <td align="center">2/3/21</td>
            <td align="right">85</td>
          </tr>
          <tr>
            <td>Q2</td>
            <td align="center">CSS</td>
            <td align="center">2/10/21</td>
            <td align="right">90</td>
          </tr>
          <tr>
            <td>Q3</td>
            <td align="center">JavaScript</td>
            <td align="center">2/17/21</td>
            <td align="right">95</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Average</td>
            <td align="right">90</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}`}</CodeBlock>
        <p>
          Apply the same <code>align</code>{" "}on every Topic, Date, and grade
          number through Q3. Leave the Grade heading with the default
          alignment. Quiz stays left; Average stays left under the merged
          cells; the average number lines up with the scores:
        </p>
        <LiveDemo name="Tables" file="app/labs/lab1/Tables.tsx">
          <Tables />
        </LiveDemo>
        <OnYourOwn>
          Still in <code>Tables.tsx</code>, add a second table with id{" "}
          <code>wd-your-table</code>{" "}for something personal — for example
          courses you are taking this term, or a short weekly schedule (Day /
          Activity / Time). Use <code>thead</code>, <code>tbody</code>, at
          least three data rows, and <code>align</code>{" "}where it helps (center
          labels, right-align numbers).
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab1/Tables.tsx, keep my personal table (wd-your-table) unchanged. In the quiz grades table, keep Q1–Q3 as they are. Add rows Q4 through Q10 with plausible weekly topics, dates, and grades. Copy the same align attributes as Q1–Q3 (Topic and Date center, grade numbers right). Recalculate the Average in the footer from all ten scores.`}
        >
          Typing ten similar rows is busywork. Paste this prompt so the
          assistant extends the quiz table — then check that every new grade is
          still right-aligned and that the average matches the ten scores:
        </WithAI>
      </Section>

      <Section level={3} id="sec-1-3-5" title="1.3.5 Image Tag">
        <p>
          The <code>&lt;img&gt;</code>{" "}tag places pictures in an HTML document,
          whether they live at a remote URL on the internet or as files in your
          project. Attributes on the tag change <em>what</em>{" "}and <em>how</em>{" "}
          the picture displays. The <code>src</code>{" "}attribute points at the
          file, either a remote URL or a local path. The optional attributes{" "}
          <code>width</code>{" "}and <code>height</code>{" "}set the display size; if
          you provide only one, the other scales proportionally.{" "}
          <code>alt</code>{" "}holds a short text description when the image cannot
          load. That description matters for{" "}
          <strong>accessibility</strong>: it helps people and tools that cannot
          see the picture understand what it shows.
        </p>
        <p>
          <code>&lt;img&gt;</code>{" "}is a <strong>void element</strong>: it has
          no body and no closing tag in HTML. In JSX you write it as a
          self-closing tag ending in <code>/&gt;</code>. The same pattern
          applies to other void elements you will meet next, including{" "}
          <code>&lt;br /&gt;</code>{" "}(a line break) and{" "}
          <code>&lt;input /&gt;</code>. Void elements cannot wrap children, so
          attributes carry all of their configuration.
        </p>
        <CodeBlock language="html">{`<img
  src="my-picture.jpg"
  width="200px"
  height="300px"
/>
{/* src references a local or remote image.
    width / height configure size; one alone scales the other */}`}</CodeBlock>
        <p>
          Remote images use absolute URLs, while local images in Next.js usually
          go under <code>public/images</code>{" "}and are referenced from the site
          root (for example <code>/images/teslabot.jpg</code>). Download a Tesla Bot
          picture and save it as <code>public/images/teslabot.jpg</code>, then
          create <code>Images.tsx</code>, import it into <code>page.tsx</code>,
          and add both a remote Starship image and the local bot:
        </p>
        <CodeBlock
          language="tsx"
          name="Images"
          file="app/labs/lab1/Images.tsx"
        >{`export default function Images() {
  return (
    <div id="wd-images">
      <h4>Image tag</h4>
      Loading an image from the internet:
      <br />
      <img
        id="wd-starship"
        width="400px"
        alt="Starship"
        src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
      />
      <br />
      Loading a local image:
      <br />
      <img
        id="wd-teslabot"
        src="/images/teslabot.jpg"
        height="200px"
        alt="Tesla Bot (Optimus) humanoid robot"
      />
    </div>
  );
}`}</CodeBlock>
        <p>
          Two images stack in the page flow, Starship from a remote URL, then
          Tesla Bot from <code>/images/teslabot.jpg</code>{" "}in your{" "}
          <code>public</code>{" "}folder:
        </p>
        <LiveDemo name="Images" file="app/labs/lab1/Images.tsx">
          <Images />
        </LiveDemo>
        <OnYourOwn>
          In <code>Images.tsx</code>, add one more image that matters to you — a
          remote URL of a place, pet, or product you like, or a second file
          under <code>public/images/</code>. Give it id{" "}
          <code>wd-your-image</code>, a meaningful <code>alt</code>, and a{" "}
          <code>width</code>{" "}or <code>height</code>{" "}so it does not dominate
          the page.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab1/Images.tsx, keep my personal image (wd-your-image) unchanged. After the Starship and teslabot samples, add one more remote sample image with id wd-ai-image. Use a public URL (for example from nasa.gov), a short alt, and width="200px". Not a photo of me.`}
        >
          Ask the assistant to add one extra sample image from a public URL —
          leave yours as the personal one:
        </WithAI>
      </Section>

      <Section level={3} id="sec-1-3-6" title="1.3.6 Creating Web Forms">
        <p>
          The <code>&lt;form&gt;</code>{" "}tag is different from the static markup
          so far — headings, paragraphs, lists, tables, and images that the
          browser displays. Forms let users <strong>interact</strong>{" "}with the
          interface, in particular to <strong>enter data</strong>{" "}such as a
          username, password, biography, or preferred options. That input is
          what applications later validate, store, or send to a server for long term storage and later retrieval.
        </p>
        <p>
          The following sections present several kinds of input, each in turn:
          text fields, multi-line text areas, radio buttons, checkboxes,
          dropdowns, typed inputs such as email, number, range, and date, and
          buttons that save or cancel. A <code>&lt;form&gt;</code>{" "}wraps those
          controls — <code>&lt;input&gt;</code>,{" "}
          <code>&lt;textarea&gt;</code>, <code>&lt;select&gt;</code>,{" "}
          <code>&lt;button&gt;</code>, and related options — so users can fill
          in and submit information as one unit.
        </p>
        <p>
          Until now each Lab 1 topic was a single file next to{" "}
          <code>page.tsx</code>. Forms is a cluster of related components —
          enough that dumping them all in <code>app/labs/lab1/</code>{" "}would
          bury the rest of the lab. Put the form work in its own folder,{" "}
          <code>app/labs/lab1/forms/</code>, so related files sit together and
          the lab folder stays easy to browse. That folder is only for organization:
          do not add a <code>page.tsx</code>{" "}inside it, or Next.js would
          create a <code>/labs/lab1/forms</code>{" "}route. Inside the folder,
          files still import each other the same way (
          <code>import TextFields from &quot;./TextFields&quot;</code>). From{" "}
          <code>page.tsx</code>{" "}you reach one level down:{" "}
          <code>import Forms from &quot;./forms/Forms&quot;</code>.
        </p>
        <p>
          Each form topic lives in its own file under that folder — for example{" "}
          <code>TextFields.tsx</code>, <code>Textarea.tsx</code>, and so on.
          <code>Forms.tsx</code>{" "}assembles them, and <code>page.tsx</code>{" "}
          imports <code>Forms</code>.
        </p>

        <h3
          id="sec-1-3-6-1"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.3.6.1 Text Fields <BookSectionVideosLink sectionId="sec-1-3-6-1" />
        </h3>
        <p>
          The <code>&lt;input&gt;</code>{" "}tag is the most common way to collect
          short strings such as usernames, passwords, names, and similar values.
        </p>
        <p>
          In React, form fields come in two flavors. An{" "}
          <strong>uncontrolled</strong>{" "}input gets an initial value and then
          the <em>browser</em>{" "}owns what the user types — React does not
          track every keystroke — while a <strong>controlled</strong>{" "}input
          is the opposite: React state holds the current text, and every
          change goes through <code>onChange</code>{" "}so your code stays in
          sync. For these early HTML labs, stay uncontrolled with{" "}
          <code>defaultValue</code>; controlled inputs return when you learn
          state in later chapters — if you set <code>value</code>{" "}without that
          state wiring, the field looks frozen because React keeps forcing the
          same text back onto the input. Later chapters discuss controlled inputs in detail.
        </p>
        <p>Useful attributes include:</p>
        <ul>
          <li>
            <code>id</code> — a unique identifier for the field so CSS,
            JavaScript, and other elements can refer to it.
          </li>
          <li>
            <code>type</code> — kind of input such as <code>text</code>, <code>password</code>, <code>email</code>, <code>date</code>, <code>number</code>, <code>range</code>, etc.
            The default is <code>text</code> so if you want a simple single-line text, omit it (or use{" "}
            <code>type=&quot;text&quot;</code>).
            Use <code>type=&quot;password&quot;</code>{" "}to mask characters as
            the user types. Later sections introduce other types such as <code>email</code>{" "}
            and <code>date</code>.
          </li>
          <li>
            <code>placeholder</code> — hint text shown inside an empty field
            (for example <code>jdoe</code>). It disappears when the user starts
            typing and is not submitted as the field&apos;s value.
          </li>
          <li>
            <code>title</code> — advisory text, often shown as a tooltip on
            hover. Useful for extra guidance beyond the caption next to the
            field.
          </li>
          <li>
            <code>defaultValue</code> — initial text for an uncontrolled
            field; the user can edit freely afterward. Prefer this for this chapter.
          </li>
          <li>
            <code>value</code> — current text for a controlled field (paired
            with state and <code>onChange</code>). Skip it for now.
          </li>
        </ul>
        <p>
          Beside each field, add a <code>&lt;label&gt;</code>{" "}element for the
          visible caption (for example &quot;Username:&quot;). Give the label a{" "}
          <code>htmlFor</code>{" "}attribute whose value matches the input&apos;s{" "}
          <code>id</code>. That links the two. Clicking the label focuses the
          field, and screen readers can announce the connection. In plain HTML
          the attribute is named <code>for</code>; in JSX it must be{" "}
          <code>htmlFor</code>{" "}because <code>for</code>{" "}is a reserved word in
          JavaScript.
        </p>
        <p>
          Associating labels this way is good practice because it enlarges the
          clickable area — especially on small mobile screens, where tapping the
          label text is often easier than hitting a narrow input. Later examples
          with radio buttons and checkboxes make the point even clearer. Their
          controls are tiny, so being able to tap the adjacent label text is a
          real usability win.
        </p>
        <p>
          Create <code>app/labs/lab1/forms/TextFields.tsx</code>{" "}with labeled
          text inputs for username, password, and name fields. The component
          returns a{" "}
          <strong>fragment</strong>{" "}(<code>&lt;&gt;…&lt;/&gt;</code>) — a React
          wrapper that groups several sibling tags without adding an extra{" "}
          <code>&lt;div&gt;</code>{" "}to the DOM:
        </p>
        <CodeBlock
          language="tsx"
          name="TextFields"
          file="app/labs/lab1/forms/TextFields.tsx"
        >{`export default function TextFields() {
  return (
    <>
      <h5>Text Fields</h5>
      <label htmlFor="wd-text-fields-username">Username:</label>
      <input placeholder="jdoe" id="wd-text-fields-username" /> <br />
      <label htmlFor="wd-text-fields-password">Password:</label>
      <input
        type="password"
        defaultValue="123@#$asd"
        id="wd-text-fields-password"
      />
      <br />
      <label htmlFor="wd-text-fields-first-name">First name:</label>
      <input type="text" title="John" id="wd-text-fields-first-name" />{" "}
      <br />
      <label htmlFor="wd-text-fields-last-name">Last name:</label>
      <input
        type="text"
        placeholder="Doe"
        defaultValue="Wonderland"
        title="The last name"
        id="wd-text-fields-last-name"
      />
    </>
  );
}`}</CodeBlock>
        <p>
          Try clicking a label to focus its field, hover for{" "}
          <code>title</code>{" "}tooltips, type in the Username field and notice the placeholder text disappears, and notice the password hides its value
          while last name shows the default value <code>Wonderland</code>:
        </p>
        <LiveDemo name="TextFields" file="app/labs/lab1/forms/TextFields.tsx">
          <TextFields />
        </LiveDemo>
        <p>
          Wire <code>TextFields</code>{" "}into a new{" "}
          <code>app/labs/lab1/forms/Forms.tsx</code>{" "}that wraps everything in{" "}
          <code>#wd-forms</code>{" "}and a{" "}
          <code>&lt;form id=&quot;wd-text-fields&quot;&gt;</code>. Leave room
          for the later form components:
        </p>
        <CodeBlock
          language="tsx"
          name="Forms"
          file="app/labs/lab1/forms/Forms.tsx"
        >{`import TextFields from "./TextFields";

export default function Forms() {
  return (
    <div id="wd-forms">
      <h4>Form Elements</h4>
      <form id="wd-text-fields">
        <TextFields />
        {/* add the next form components here */}
      </form>
    </div>
  );
}`}</CodeBlock>
        <p>
          Then import <code>Forms</code>{" "}into <code>page.tsx</code>{" "}from the
          new folder — <code>import Forms from &quot;./forms/Forms&quot;</code>{" "}
          — not the same one-level <code>./HeadingTags</code>{" "}path as the
          earlier Lab 1 components.
        </p>

        <h3
          id="sec-1-3-6-2"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.3.6.2 Textarea <BookSectionVideosLink sectionId="sec-1-3-6-2" />
        </h3>
        <p>
          Use <code>&lt;textarea&gt;</code>{" "}for longer multi-line text such as
          a biography. Unlike the void <code>&lt;input&gt;</code>{" "}(<SectionLink to="1.3.5" /> /
          <SectionLink to="1.3.6.1" />), a textarea is <em>not</em>{" "}void in
          HTML — it has an opening and closing tag, and the browser uses the
          text between those tags as the starting value:
        </p>
        <CodeBlock language="html">{`<textarea id="wd-textarea" cols="30" rows="10">
Lorem ipsum dolor sit amet...
</textarea>`}</CodeBlock>
        <p>
          That HTML pattern does not carry over to JSX. React models every
          form field the same way it models <code>&lt;input&gt;</code>, so
          the current text is a <strong>prop</strong>{" "}
          (<code>defaultValue</code>{" "}or <code>value</code>), not child
          nodes. Through React 18, body text still rendered and you only got
          a development warning; React 19, which this course uses, throws:{" "}
          <code>
            Use the defaultValue or value props instead of setting children
            on &lt;textarea&gt;
          </code>
          . Put the biography on <code>defaultValue</code>{" "}instead — the same
          idea as on <code>&lt;input&gt;</code>, and what Lab 1 uses.
        </p>
        <p>
          Create <code>Textarea.tsx</code>{" "}in the same{" "}
          <code>forms</code>{" "}folder, with the <code>cols</code>{" "}and{" "}
          <code>rows</code>{" "}attributes for the visible size:
        </p>
        <CodeBlock
          language="tsx"
          name="Textarea"
          file="app/labs/lab1/forms/Textarea.tsx"
        >{`export default function Textarea() {
  return (
    <>
      <h5>Text boxes</h5>
      <label>Biography:</label>
      <br />
      <textarea
        id="wd-textarea"
        cols={30}
        rows={10}
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      />
    </>
  );
}`}</CodeBlock>
        <p>
          A multi-line box appears with room for longer text — taller and wider
          than a single-line input, sized by <code>rows</code>{" "}and{" "}
          <code>cols</code>:
        </p>
        <LiveDemo name="Textarea" file="app/labs/lab1/forms/Textarea.tsx">
          <Textarea />
        </LiveDemo>
        <p>
          Import <code>Textarea</code>{" "}into <code>Forms.tsx</code>{" "}the same way
          you imported <code>TextFields</code>, and place{" "}
          <code>&lt;Textarea /&gt;</code>{" "}inside the form.
        </p>

        <h3
          id="sec-1-3-6-3"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.3.6.3 Radio Buttons <BookSectionVideosLink sectionId="sec-1-3-6-3" />
        </h3>
        <p>
          The <code>&lt;input type=&quot;radio&quot;&gt;</code>{" "}tag lets the
          user pick <strong>one</strong>{" "}option from a set, so choices in the
          same group are <strong>mutually exclusive</strong> — selecting the Comedy option
          clears the Drama option. The browser groups radios that share the same{" "}
          <code>name</code>{" "}attribute: give each option its own{" "}
          <code>id</code>{" "}(and usually a <code>value</code>{" "}when you submit
          the form later), but reuse one <code>name</code>{" "}for the whole group.
        </p>
        <p>
          Create <code>RadioButtons.tsx</code>{" "}in <code>forms</code>{" "}with a
          favorite-genre radio
          group. Here each caption sits <strong>next to</strong>{" "}its input and
          uses <code>htmlFor</code>{" "}to match the input&apos;s <code>id</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="RadioButtons"
          file="app/labs/lab1/forms/RadioButtons.tsx"
        >{`export default function RadioButtons() {
  return (
    <>
      <h5 id="wd-radio-buttons">Radio buttons</h5>
      <label>Favorite movie genre:</label>
      <br />
      <input type="radio" name="radio-genre" id="wd-radio-comedy" />
      <label htmlFor="wd-radio-comedy">Comedy</label>
      <br />
      <input type="radio" name="radio-genre" id="wd-radio-drama" />
      <label htmlFor="wd-radio-drama">Drama</label>
      <br />
      <input type="radio" name="radio-genre" id="wd-radio-scifi" />
      <label htmlFor="wd-radio-scifi">Science Fiction</label>
      <br />
      <input type="radio" name="radio-genre" id="wd-radio-fantasy" />
      <label htmlFor="wd-radio-fantasy">Fantasy</label>
    </>
  );
}`}</CodeBlock>
        <p>
          Four genre radios share one <code>name</code>, so picking Comedy
          clears Drama — only one choice stays selected:
        </p>
        <LiveDemo name="RadioButtons" file="app/labs/lab1/forms/RadioButtons.tsx">
          <RadioButtonsGenre />
        </LiveDemo>
        <p>
          Import <code>RadioButtons</code>{" "}into <code>Forms.tsx</code>{" "}and add{" "}
          <code>&lt;RadioButtons /&gt;</code>{" "}inside the form.
        </p>
        <p>
          Mutual exclusion applies <strong>within a name group</strong>, not
          across the whole page. Add a second independent choice to the same
          file — for example how often someone watches movies — with a different{" "}
          <code>name</code>{" "}for the second set. Selecting Weekly does not
          clear Comedy, because <code>radio-frequency</code>{" "}and{" "}
          <code>radio-genre</code>{" "}are separate groups:
        </p>
        <CodeBlock
          language="tsx"
          name="RadioButtons"
          file="app/labs/lab1/forms/RadioButtons.tsx"
        >{`export default function RadioButtons() {
  return (
    <>
      <h5 id="wd-radio-buttons">Radio buttons</h5>
      <label>Favorite movie genre:</label>
      <br />
      <input type="radio" name="radio-genre" id="wd-radio-comedy" />
      <label htmlFor="wd-radio-comedy">Comedy</label>
      <br />
      <input type="radio" name="radio-genre" id="wd-radio-drama" />
      <label htmlFor="wd-radio-drama">Drama</label>
      <br />
      <input type="radio" name="radio-genre" id="wd-radio-scifi" />
      <label htmlFor="wd-radio-scifi">Science Fiction</label>
      <br />
      <input type="radio" name="radio-genre" id="wd-radio-fantasy" />
      <label htmlFor="wd-radio-fantasy">Fantasy</label>
      <br />
      <label>How often do you watch movies?</label>
      <br />
      <input type="radio" name="radio-frequency" id="wd-radio-daily" />
      <label htmlFor="wd-radio-daily">Daily</label>
      <br />
      <input type="radio" name="radio-frequency" id="wd-radio-weekly" />
      <label htmlFor="wd-radio-weekly">Weekly</label>
      <br />
      <input type="radio" name="radio-frequency" id="wd-radio-rarely" />
      <label htmlFor="wd-radio-rarely">Rarely</label>
    </>
  );
}`}</CodeBlock>
        <p>
          Two groups, two <code>name</code>s: pick a genre and a frequency and
          both selections stay selected at once:
        </p>
        <LiveDemo name="RadioButtons" file="app/labs/lab1/forms/RadioButtons.tsx">
          <RadioButtons />
        </LiveDemo>
        <p>
          Labels work with radios in two common ways. You already used the first:
          keep the <code>&lt;input&gt;</code>{" "}and <code>&lt;label&gt;</code>{" "}as
          siblings and connect them with <code>htmlFor</code> / <code>id</code>.
          Alternatively, <strong>wrap</strong>{" "}the input inside the label — then
          you can omit <code>htmlFor</code>{" "}and <code>id</code>, because nesting
          creates the association. Wrapping is compact; separate labels are more
          flexible when the caption and control are not next to each other (for
          example labels in one column and radios in another). Clicking either
          the text or the circle still selects the option. Illustrative — optional
          to add to your project:
        </p>
        <CodeBlock
          language="tsx"
          name="RadioLabelPatterns"
        >{`{/* Sibling label + htmlFor */}
<input type="radio" name="radio-beside" id="wd-radio-beside-yes" />
<label htmlFor="wd-radio-beside-yes">Yes</label>

{/* Wrapping label — no htmlFor needed */}
<label>
  <input type="radio" name="radio-wrap" /> Yes
</label>

{/* Separate placement still works with htmlFor */}
<label htmlFor="wd-radio-distant-a">Option A</label>
{/* ... elsewhere in the layout ... */}
<input type="radio" name="radio-distant" id="wd-radio-distant-a" />`}</CodeBlock>
        <p>
          Same radios, three label styles — click the label text in each row and
          the matching radio should select:
        </p>
        <LiveDemo name="RadioLabelPatterns">
          <RadioLabelPatterns />
        </LiveDemo>
        <p>
          For Lab 1, keep both groups in <code>RadioButtons.tsx</code>{" "}with
          sibling labels and <code>htmlFor</code>. The other label patterns are
          here so you understand how grouping and labeling work when you design
          denser layouts later.
        </p>

        <h3
          id="sec-1-3-6-4"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.3.6.4 Checkboxes <BookSectionVideosLink sectionId="sec-1-3-6-4" />
        </h3>
        <p>
          The <code>&lt;input type=&quot;checkbox&quot;&gt;</code>{" "}tag uses the
          same label pattern as radio buttons, but each box can be selected{" "}
          <strong>independently</strong>. Unlike radios, choosing Comedy does
          not clear Drama — the user can pick several genres at once. Create{" "}
          <code>Checkboxes.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Checkboxes"
          file="app/labs/lab1/forms/Checkboxes.tsx"
        >{`export default function Checkboxes() {
  return (
    <>
      <h5 id="wd-checkboxes">Checkboxes</h5>
      <label>Favorite movie genre:</label>
      <br />
      <input type="checkbox" name="check-genre" id="wd-chkbox-comedy" />
      <label htmlFor="wd-chkbox-comedy">Comedy</label>
      <br />
      <input type="checkbox" name="check-genre" id="wd-chkbox-drama" />
      <label htmlFor="wd-chkbox-drama">Drama</label>
      <br />
      <input type="checkbox" name="check-genre" id="wd-chkbox-scifi" />
      <label htmlFor="wd-chkbox-scifi">Science Fiction</label>
      <br />
      <input type="checkbox" name="check-genre" id="wd-chkbox-fantasy" />
      <label htmlFor="wd-chkbox-fantasy">Fantasy</label>
    </>
  );
}`}</CodeBlock>
        <p>
          Unlike radios, each box is independent — Comedy and Drama can both
          stay checked:
        </p>
        <LiveDemo name="Checkboxes" file="app/labs/lab1/forms/Checkboxes.tsx">
          <Checkboxes />
        </LiveDemo>
        <p>
          Import <code>Checkboxes</code>{" "}into <code>Forms.tsx</code>{" "}and add{" "}
          <code>&lt;Checkboxes /&gt;</code>{" "}inside the form.
        </p>

        <h3
          id="sec-1-3-6-5"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.3.6.5 Dropdowns <BookSectionVideosLink sectionId="sec-1-3-6-5" />
        </h3>
        <p>
          Use <code>&lt;select&gt;</code>{" "}when the user can pick from a fixed
          list of choices. Each choice is rendered as an{" "}
          <code>&lt;option&gt;</code>{" "}inside that list. The text between the
          option tags is what people see (for example &quot;Science Fiction&quot;);
          the <code>value</code>{" "}attribute is what the form actually records
          when that option is selected and is what would be sent to the server.
        </p>
        <p>
          Option <code>value</code>s are typically short{" "}
          <strong>tokens</strong> — stable identifiers that match something in a
          database, an API, or application logic — rather than the display label.
          They are often written in capitals (for example{" "}
          <code>SCIFI</code>, <code>COMEDY</code>) so they read clearly as codes,
          not prose. The visible label can stay human-friendly and even change
          later without breaking stored data.
        </p>
        <p>
          On the <code>&lt;select&gt;</code>{" "}itself, the{" "}
          <code>defaultValue</code>{" "}attribute sets the initial selection
          (uncontrolled, as with text fields). That value must match one of the
          option <code>value</code>s — for example{" "}
          <code>defaultValue=&quot;SCIFI&quot;</code>{" "}selects the Science Fiction
          option. Prefer <code>defaultValue</code>{" "}here; controlled{" "}
          <code>value</code>{" "}+ state comes later.
        </p>
        <p>
          Start <code>Dropdowns.tsx</code>{" "}with a single-choice list:
        </p>
        <CodeBlock
          language="tsx"
          name="Dropdowns"
          file="app/labs/lab1/forms/Dropdowns.tsx"
        >{`export default function Dropdowns() {
  return (
    <>
      <h4 id="wd-dropdowns">Dropdowns</h4>
      <h5>Select one</h5>
      <label htmlFor="wd-select-one-genre">Favorite movie genre: </label>
      <br />
      <select id="wd-select-one-genre" defaultValue="SCIFI">
        <option value="COMEDY">Comedy</option>
        <option value="DRAMA">Drama</option>
        <option value="SCIFI">Science Fiction</option>
        <option value="FANTASY">Fantasy</option>
      </select>
    </>
  );
}`}</CodeBlock>
        <p>
          A compact dropdown opens to the genre list; Science Fiction starts
          selected because <code>defaultValue</code>{" "}matches{" "}
          <code>SCIFI</code>:
        </p>
        <LiveDemo name="Dropdowns" file="app/labs/lab1/forms/Dropdowns.tsx">
          <DropdownSingle />
        </LiveDemo>

        <p>
          Sometimes the user needs more than one selection from the same list,
          which you enable by adding the <code>multiple</code>{" "}attribute to the{" "}
          <code>&lt;select&gt;</code>. Then{" "}
          <code>defaultValue</code>{" "}(or <code>value</code>) can be an{" "}
          <strong>array</strong>{" "}of tokens — for example{" "}
          <code>{`defaultValue={["COMEDY", "SCIFI"]}`}</code> — so more than one
          option starts selected.
        </p>
        <p>
          In the browser, use <strong>Shift</strong>{" "}to select a contiguous
          range of options, and <strong>Command</strong>{" "}(macOS) or{" "}
          <strong>Control</strong>{" "}(Windows / Linux) to add or remove individual
          options without clearing the rest.
        </p>
        <p>
          Extend <code>Dropdowns.tsx</code>{" "}with a second list for selecting
          many genres:
        </p>
        <CodeBlock
          language="tsx"
          name="Dropdowns"
          file="app/labs/lab1/forms/Dropdowns.tsx"
        >{`export default function Dropdowns() {
  return (
    <>
      <h4 id="wd-dropdowns">Dropdowns</h4>
      <h5>Select one</h5>
      <label htmlFor="wd-select-one-genre">Favorite movie genre: </label>
      <br />
      <select id="wd-select-one-genre" defaultValue="SCIFI">
        <option value="COMEDY">Comedy</option>
        <option value="DRAMA">Drama</option>
        <option value="SCIFI">Science Fiction</option>
        <option value="FANTASY">Fantasy</option>
      </select>
      <h5>Select many</h5>
      <label htmlFor="wd-select-many-genre">Favorite movie genres: </label>
      <br />
      <select
        multiple
        id="wd-select-many-genre"
        defaultValue={["COMEDY", "SCIFI"]}
      >
        <option value="COMEDY">Comedy</option>
        <option value="DRAMA">Drama</option>
        <option value="SCIFI">Science Fiction</option>
        <option value="FANTASY">Fantasy</option>
      </select>
    </>
  );
}`}</CodeBlock>
        <p>
          The multi list shows several options at once, with Comedy and Science
          Fiction preselected. Shift- and Command-/Control-click to change the
          set:
        </p>
        <LiveDemo name="Dropdowns" file="app/labs/lab1/forms/Dropdowns.tsx">
          <Dropdowns />
        </LiveDemo>
        <p>
          Import <code>Dropdowns</code>{" "}into <code>Forms.tsx</code>{" "}and add{" "}
          <code>&lt;Dropdowns /&gt;</code>{" "}inside the form.
        </p>

        <h3
          id="sec-1-3-6-6"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.3.6.6 Other Field Types <BookSectionVideosLink sectionId="sec-1-3-6-6" />
        </h3>
        <p>
          Plain <code>type=&quot;text&quot;</code>{" "}accepts almost any string. HTML
          also provides <strong>strongly typed</strong>{" "}input types that expect a
          particular kind of data — email addresses, numbers, dates, and more.
          Prefer these when you can. They nudge users toward valid input (and on
          phones often show a specialized keyboard), help the browser validate
          before submit, and reduce mistakes you would otherwise catch only in
          JavaScript later.
        </p>
        <p>
          Build them one at a time in <code>OtherFieldTypes.tsx</code>, then
          import that component into <code>Forms.tsx</code>.
        </p>

        <h4 className="font-sans text-base font-semibold">Email</h4>
        <p>
          Use <code>type=&quot;email&quot;</code>{" "}for email addresses. Browsers
          check for a basic address shape (something like{" "}
          <code>name@domain</code>), and on many mobile devices the on-screen
          keyboard emphasizes <code>@</code>{" "}and <code>.</code>{" "}so typing an
          address is easier than with a full text keyboard.
        </p>
        <CodeBlock
          language="tsx"
          name="OtherFieldTypes"
          file="app/labs/lab1/forms/OtherFieldTypes.tsx"
        >{`export default function OtherFieldTypes() {
  return (
    <>
      <h4>Other HTML field types</h4>
      <label htmlFor="wd-text-fields-email">Email: </label>
      <input
        type="email"
        placeholder="jdoe@somewhere.com"
        id="wd-text-fields-email"
      />
      <br />
    </>
  );
}`}</CodeBlock>
        <p>
          An email field with a sample placeholder — on a phone (or emulator),
          tap it and notice the keyboard emphasizes <code>@</code>{" "}and{" "}
          <code>.</code>:
        </p>
        <LiveDemo name="OtherFieldTypes" file="app/labs/lab1/forms/OtherFieldTypes.tsx">
          <FieldEmail />
        </LiveDemo>

        <h4 className="font-sans text-base font-semibold">Number</h4>
        <p>
          Use <code>type=&quot;number&quot;</code>{" "}for numeric values such as a
          salary. On many mobiles the field brings up a numeric keypad. The
          optional attributes <code>min</code>{" "}and <code>max</code>{" "}limit the
          allowed range (for example <code>min={"{0}"}</code>{" "}to reject
          negative salaries), and some browsers also provide step buttons for
          incrementing the value.
        </p>
        <CodeBlock
          language="tsx"
          name="OtherFieldTypes"
          file="app/labs/lab1/forms/OtherFieldTypes.tsx"
        >{`export default function OtherFieldTypes() {
  return (
    <>
      <h4>Other HTML field types</h4>
      <label htmlFor="wd-text-fields-email">Email: </label>
      <input
        type="email"
        placeholder="jdoe@somewhere.com"
        id="wd-text-fields-email"
      />
      <br />
      <label htmlFor="wd-text-fields-salary-start">Starting salary: </label>
      <input
        type="number"
        defaultValue="100000"
        placeholder="1000"
        min={0}
        id="wd-text-fields-salary-start"
      />
      <br />
    </>
  );
}`}</CodeBlock>
        <p>
          Email plus a number field for starting salary — steppers or a numeric
          keypad often appear, and <code>min={"{0}"}</code>{" "}blocks negatives:
        </p>
        <LiveDemo name="OtherFieldTypes" file="app/labs/lab1/forms/OtherFieldTypes.tsx">
          <FieldEmailNumber />
        </LiveDemo>

        <h4 className="font-sans text-base font-semibold">Range</h4>
        <p>
          Use <code>type=&quot;range&quot;</code>{" "}for a value chosen along a
          continuum — ratings, volume, or similar. It renders as a slider.
          Pair it with <code>min</code>, <code>max</code>, and often{" "}
          <code>defaultValue</code>{" "}(or <code>value</code>) so the thumb starts
          in a sensible place. Here a rating runs from 1 to 5 with a default of
          4.
        </p>
        <CodeBlock
          language="tsx"
          name="OtherFieldTypes"
          file="app/labs/lab1/forms/OtherFieldTypes.tsx"
        >{`export default function OtherFieldTypes() {
  return (
    <>
      <h4>Other HTML field types</h4>
      {/* ... email and number fields ... */}
      <label htmlFor="wd-text-fields-rating">Rating: </label>
      <input
        type="range"
        defaultValue="4"
        min="1"
        max="5"
        id="wd-text-fields-rating"
      />
      <br />
    </>
  );
}`}</CodeBlock>
        <p>
          A slider joins the typed fields — drag it and it stays between 1 and
          5:
        </p>
        <LiveDemo name="OtherFieldTypes" file="app/labs/lab1/forms/OtherFieldTypes.tsx">
          <FieldEmailNumberRange />
        </LiveDemo>

        <h4 className="font-sans text-base font-semibold">Date</h4>
        <p>
          Use <code>type=&quot;date&quot;</code>{" "}for calendar dates. The value
          uses a fixed <code>YYYY-MM-DD</code>{" "}format (year-month-day), even if
          the browser displays dates according to the user&apos;s locale. On
          many phones, tapping the field opens a native date picker rather than
          a text keyboard — another reason typed fields reduce entry mistakes.{" "}
          <code>min</code>{" "}and <code>max</code>{" "}(also in{" "}
          <code>YYYY-MM-DD</code>{" "}form) restrict which dates are allowed.
        </p>
        <CodeBlock
          language="tsx"
          name="OtherFieldTypes"
          file="app/labs/lab1/forms/OtherFieldTypes.tsx"
        >{`export default function OtherFieldTypes() {
  return (
    <>
      <h4>Other HTML field types</h4>
      <label htmlFor="wd-text-fields-email">Email: </label>
      <input
        type="email"
        placeholder="jdoe@somewhere.com"
        id="wd-text-fields-email"
      />
      <br />
      <label htmlFor="wd-text-fields-salary-start">Starting salary: </label>
      <input
        type="number"
        defaultValue="100000"
        placeholder="1000"
        min={0}
        id="wd-text-fields-salary-start"
      />
      <br />
      <label htmlFor="wd-text-fields-rating">Rating: </label>
      <input
        type="range"
        defaultValue="4"
        min="1"
        max="5"
        id="wd-text-fields-rating"
      />
      <br />
      <label htmlFor="wd-text-fields-dob">Date of birth: </label>
      <input
        type="date"
        defaultValue="2000-01-21"
        min="1900-01-01"
        max="2025-12-31"
        id="wd-text-fields-dob"
      />
      <br />
    </>
  );
}`}</CodeBlock>
        <p>
          The full set includes a date of birth control — open it and try a day
          outside the min/max range if your browser enforces those bounds:
        </p>
        <LiveDemo name="OtherFieldTypes" file="app/labs/lab1/forms/OtherFieldTypes.tsx">
          <OtherFieldTypes />
        </LiveDemo>

        <p>
          HTML defines many more input types than this lab covers. Explore these
          on your own when you need them:
        </p>
        <ul>
          <li>
            <code>tel</code> — telephone numbers (mobile phone keypad)
          </li>
          <li>
            <code>url</code> — web addresses
          </li>
          <li>
            <code>search</code> — search boxes (often with clear affordances)
          </li>
          <li>
            <code>time</code>, <code>datetime-local</code>, <code>month</code>,{" "}
            <code>week</code> — other date/time pickers
          </li>
          <li>
            <code>color</code> — color picker
          </li>
          <li>
            <code>file</code> — file upload
          </li>
          <li>
            <code>hidden</code> — values included on submit but not shown
          </li>
        </ul>
        <p>
          MDN&apos;s documentation for the{" "}
          <code>&lt;input&gt;</code>{" "}element is a good place to browse the full
          list and try examples in the browser.
        </p>
        <p>
          Import <code>OtherFieldTypes</code>{" "}into <code>Forms.tsx</code>{" "}and
          add <code>&lt;OtherFieldTypes /&gt;</code>{" "}inside the form. Buttons
          come next, then the completed <code>Forms.tsx</code>.
        </p>

        <h3
          id="sec-1-3-6-7"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          1.3.6.7 Buttons <BookSectionVideosLink sectionId="sec-1-3-6-7" />
        </h3>
        <p>
          The <code>&lt;button&gt;</code>{" "}tag gives a form a way to{" "}
          <strong>submit</strong>{" "}or <strong>cancel</strong>. Prefer it over{" "}
          <code>&lt;input type=&quot;submit&quot;&gt;</code>{" "}or{" "}
          <code>&lt;input type=&quot;button&quot;&gt;</code>, because the label
          is nested text (so later you can put an icon inside) and the{" "}
          <code>type</code>{" "}attribute says what the click should do.
        </p>
        <p>
          Always write <code>type</code>{" "}explicitly. Inside a{" "}
          <code>&lt;form&gt;</code>, a <code>&lt;button&gt;</code>{" "}with no{" "}
          <code>type</code>{" "}defaults to <code>submit</code>{" "}and the browser
          sends the form — which reloads the page unless you stop it. Use{" "}
          <code>type=&quot;submit&quot;</code>{" "}for Save (or Sign in). Use{" "}
          <code>type=&quot;button&quot;</code>{" "}for Cancel and for every Kambaz
          action that is not sending a form — Go, Publish,{" "}
          <code>+ Assignment</code>, and the rest in <SectionLink to="1.4.3" />.
        </p>
        <p>
          Create <code>Buttons.tsx</code>{" "}with both kinds:
        </p>
        <CodeBlock
          language="tsx"
          name="Buttons"
          file="app/labs/lab1/forms/Buttons.tsx"
        >{`export default function Buttons() {
  return (
    <>
      <h4>Buttons</h4>
      <button id="wd-html-button-save" type="submit">
        Save
      </button>
      <button id="wd-html-button-cancel" type="button">
        Cancel
      </button>
    </>
  );
}`}</CodeBlock>
        <p>
          Save submits the form; Cancel does not:
        </p>
        <LiveDemo name="Buttons" file="app/labs/lab1/forms/Buttons.tsx">
          <Buttons />
        </LiveDemo>
        <p>
          Import <code>Buttons</code>{" "}into <code>Forms.tsx</code>. Clicking
          Save would reload Lab 1 (and this book page) unless the form stops
          that default. The <code>onSubmit</code>{" "}handler below is a sneak
          preview of event handling from later chapters:{" "}
          <code>event.preventDefault()</code>{" "}keeps you on the page so the live
          demo is safe to click. Because the handler is a function, the file
          must start with <code>&quot;use client&quot;</code>{" "}— Server
          Components cannot pass event handlers. Chapter 3 explains that
          directive; for now it is the switch that makes Save work without a
          reload. When all field components are wired in,{" "}
          <code>Forms.tsx</code>{" "}should look like this:
        </p>
        <CodeBlock
          language="tsx"
          name="Forms"
          file="app/labs/lab1/forms/Forms.tsx"
        >{`"use client";

import TextFields from "./TextFields";
import Textarea from "./Textarea";
import RadioButtons from "./RadioButtons";
import Checkboxes from "./Checkboxes";
import Dropdowns from "./Dropdowns";
import OtherFieldTypes from "./OtherFieldTypes";
import Buttons from "./Buttons";

export default function Forms() {
  return (
    <div id="wd-forms">
      <h4>Form Elements</h4>
      <form
        id="wd-text-fields"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <TextFields />
        <Textarea />
        <RadioButtons />
        <Checkboxes />
        <Dropdowns />
        <OtherFieldTypes />
        <Buttons />
      </form>
    </div>
  );
}`}</CodeBlock>
        <p>
          All the field components assemble into one form — text, textarea,
          radios, checkboxes, dropdowns, typed inputs, and buttons in order.
          Click Save here; the page should stay put:
        </p>
        <LiveDemo name="Forms" file="app/labs/lab1/forms/Forms.tsx">
          <Forms />
        </LiveDemo>
        <OnYourOwn>
          <p>
            Build a personal <strong>Student Profile</strong>{" "}form that reuses
            every control family from this section — not a tiny stub. There is
            one canonical file for that work:{" "}
            <code>app/labs/lab1/forms/YourForm.tsx</code>. Wrap the fields in{" "}
            <code>&lt;form id=&quot;wd-your-form&quot;&gt;</code>, import that
            one <code>YourForm</code>{" "}component into{" "}
            <code>Forms.tsx</code>{" "}once after the sample components, and
            include all of the following:
          </p>
          <ul>
            <li>
              <strong>Text fields</strong> — first name, last name, and a
              password (or student ID) field, each with a labeled{" "}
              <code>htmlFor</code>/<code>id</code>{" "}pair.
            </li>
            <li>
              <strong>Textarea</strong> — a short bio or &quot;why I am taking
              this course&quot; blurb (<code>cols</code>/<code>rows</code>{" "}
              set).
            </li>
            <li>
              <strong>Radio buttons</strong> — two mutually exclusive groups,
              each with its own <code>name</code>: class standing (for example
              Freshman / Sophomore / Junior / Senior / Graduate) and one more
              exclusive choice such as full-time / part-time or on-campus /
              commuter.
            </li>
            <li>
              <strong>Checkboxes</strong> — at least three independent interests
              (languages, frameworks, or career goals you care about).
            </li>
            <li>
              <strong>Dropdowns</strong> — a single-select for your major (or
              college), plus a <code>multiple</code>{" "}select for topics you want
              to deepen this term (at least four options; preselect two).
            </li>
            <li>
              <strong>Typed fields</strong> —{" "}
              <code>type=&quot;email&quot;</code>{" "}for your school email,{" "}
              <code>type=&quot;number&quot;</code>{" "}for expected graduation year
              (with a sensible <code>min</code>/<code>max</code>),{" "}
              <code>type=&quot;date&quot;</code>{" "}for your birthday or program
              start date, and <code>type=&quot;range&quot;</code>{" "}for how
              excited you are about the course (0–10) with a visible label.
            </li>
            <li>
              <strong>Buttons</strong> — a Save control with{" "}
              <code>type=&quot;submit&quot;</code>{" "}and a Cancel control with{" "}
              <code>type=&quot;button&quot;</code>, each with its own{" "}
              <code>id</code>.
            </li>
          </ul>
          <p>
            Prefer realistic defaults that describe you (placeholders,{" "}
            <code>defaultValue</code>, checked options). The live demo above is
            the course sample; your profile form is the ambitious personal piece
            graders can skim for coverage of each input type.
          </p>
          <p>
            If you use an assistant, overwrite that same path —{" "}
            <code>app/labs/lab1/forms/YourForm.tsx</code>
            {" "}— rather than letting it create a second file under another
            name, in a nested folder, or as a parallel &quot;AI&quot; form.
            Keep the same form id,{" "}
            <code>wd-your-form</code>, on that single component — do not invent
            a new form id such as <code>wd-ai-form</code>{" "}or{" "}
            <code>wd-ai-your-form</code>.{" "}
            <code>Forms.tsx</code>{" "}must import that one{" "}
            <code>YourForm</code>{" "}only — do not keep both an original and an
            AI-generated form imported or rendered.
          </p>
        </OnYourOwn>
        <WithAI
          prompt={`Overwrite the same file app/labs/lab1/forms/YourForm.tsx only. Keep id="wd-your-form" — the same id as On your own. No second file. No new form id: do not invent wd-ai-form, wd-ai-your-form, or any similar id. Unlike earlier With AI steps that add a new wd-ai-* id, this step reuses wd-your-form. Forms.tsx still imports that one YourForm only; do not import or render a second form. Cover every control from Lab 1 forms: labeled text/password fields, textarea bio, two radio name-groups (class standing plus one more exclusive choice such as full-time/part-time), at least three checkboxes, a single select and a multiple select (four+ options, two preselected), email, number (graduation year with min/max), date, range 0–10, submit Save and type=button Cancel with their own ids. Use obvious SAMPLE placeholders (Jane Doe, jane@university.edu) — I will replace them with my own details.`}
        >
          The profile form is a lot of markup. Paste this prompt so the
          assistant overwrites the <strong>same file</strong>,{" "}
          <code>app/labs/lab1/forms/YourForm.tsx</code>. Keep{" "}
          <code>id=&quot;wd-your-form&quot;</code> — the{" "}
          <strong>same id as On your own</strong>.{" "}
          <strong>No second file</strong>, and{" "}
          <strong>no new form id</strong>: do not invent{" "}
          <code>wd-ai-form</code>, <code>wd-ai-your-form</code>, or anything
          like them. Unlike earlier With AI steps that add a new{" "}
          <code>wd-ai-*</code>{" "}id, this one reuses the On your own id.{" "}
          <code>Forms.tsx</code>{" "}still imports that one{" "}
          <code>YourForm</code>{" "}only. Then replace every sample default with
          facts about you so the form still reads as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-1-3-7"
        title="1.3.7 Parameterizing Components with Props"
      >
        <p>
          Since <SectionLink to="1.3.1" />{" "}you have been configuring HTML tags with{" "}
          <strong>attributes</strong>{" "}— <code>id</code>, then{" "}
          <code>src</code>/<code>alt</code>{" "}on images, <code>type</code>/
          <code>name</code>{" "}on form controls, and more. Your own React
          components can accept values the same way; in React those values are
          called <strong>props</strong>{" "}(short for properties). You declare them
          as parameters on the function, then pass them as attributes when you
          use the component — including the paragraph text itself via a{" "}
          <code>text</code>{" "}prop. Stay with self-closing tags for now; nested
          content and <code>children</code>{" "}come in the next section.
        </p>
        <p>
          To make the highlight visible we need a little styling. This chapter
          is about HTML structure, not CSS — so treat the inline{" "}
          <code>style</code>{" "}object below as a <strong>sneak preview</strong>.
          Those property names (<code>backgroundColor</code>,{" "}
          <code>borderColor</code>, <code>borderWidth</code>,{" "}
          <code>borderRadius</code>) are CSS written in JavaScript camelCase.
          <ChapterLink to={2} />{" "}covers CSS in detail; for now just copy the pattern and
          focus on how props flow into the component.
        </p>
        <p>
          Create <code>HighlightedParagraph.tsx</code>. Define a component that
          takes <code>text</code>, <code>backgroundColor</code>,{" "}
          <code>borderColor</code>, <code>borderWidth</code>, and{" "}
          <code>borderRadius</code> as props, applies the styles on a{" "}
          <code>&lt;p&gt;</code>, and displays <code>text</code>. Show a few
          variations with different attribute values and import the lab into{" "}
          <code>page.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="HighlightedParagraph"
          file="app/labs/lab1/HighlightedParagraph.tsx"
        >{`function HighlightedParagraph({
  text = "This paragraph is highlighted using component props.",
  backgroundColor = "lightyellow",
  borderColor = "orange",
  borderWidth = 2,
  borderRadius = 8,
}: {
  text?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string | number;
  borderRadius?: string | number;
}) {
  return (
    <p
      style={{
        backgroundColor,
        borderColor,
        borderWidth,
        borderStyle: "solid",
        borderRadius,
        padding: "0.5rem 0.75rem",
      }}
    >
      {text}
    </p>
  );
}

export default function HighlightedParagraphLab() {
  return (
    <div id="wd-highlighted-paragraph">
      <h3>Highlighted Paragraph</h3>
      <HighlightedParagraph text="Default highlight: light yellow background, orange border." />
      <HighlightedParagraph
        text="Custom props: light blue background, navy border, thicker width, more rounding."
        backgroundColor="lightblue"
        borderColor="navy"
        borderWidth={4}
        borderRadius={16}
      />
      <HighlightedParagraph
        text="Another variation: misty rose background, crimson border, square corners."
        backgroundColor="#ffe4e1"
        borderColor="crimson"
        borderWidth="3px"
        borderRadius="0px"
      />
    </div>
  );
}`}</CodeBlock>
        <p>
          Three highlighted paragraphs, each with different style props — change
          a color or radius in the code and that paragraph updates:
        </p>
        <LiveDemo
          name="HighlightedParagraph"
          file="app/labs/lab1/HighlightedParagraph.tsx"
        >
          <HighlightedParagraph />
        </LiveDemo>
        <OnYourOwn>
          Add one more <code>HighlightedParagraph</code>{" "}with a short sentence
          about you (hobby, hometown, or favorite course) and style props you
          choose — your colors, border width, and corner radius. Self-closing
          tag only; pass the wording through the <code>text</code>{" "}attribute.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab1/page.tsx (or wherever HighlightedParagraph is rendered), keep my personal HighlightedParagraph unchanged. Add one more sample <HighlightedParagraph text="Props let the same component render with different colors." backgroundColor="lavender" borderColor="purple" borderWidth={3} borderRadius={12} />. Not a sentence about me.`}
        >
          Ask the assistant to add one extra sample highlight with different
          colors — not your personal sentence:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-1-3-8"
        title="1.3.8 Wrapping Content with Children"
      >
        <p>
          In <SectionLink to="1.3.7" />{" "}every value — including the paragraph wording — arrived as
          an attribute. That works for a string, but not when you want to wrap{" "}
          <em>arbitrary markup</em>{" "}(headings, paragraphs, lists, and so on).
          In React, content nested between a component&apos;s opening and closing
          tags arrives as the special prop <code>children</code>. That is how
          you build reusable wrappers.
        </p>
        <p>
          Create <code>HighlightedBox.tsx</code>{" "}with the same style props as{" "}
          <code>HighlightedParagraph</code>, but drop <code>text</code>. Render
          a <code>&lt;div&gt;</code>{" "}that displays <code>children</code>{" "}
          instead. Import it into <code>page.tsx</code>{" "}after the paragraph lab:
        </p>
        <CodeBlock
          language="tsx"
          name="HighlightedBox"
          file="app/labs/lab1/HighlightedBox.tsx"
        >{`import type { ReactNode } from "react";

function HighlightedBox({
  backgroundColor = "lightyellow",
  borderColor = "orange",
  borderWidth = 2,
  borderRadius = 8,
  children,
}: {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string | number;
  borderRadius?: string | number;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor,
        borderColor,
        borderWidth,
        borderStyle: "solid",
        borderRadius,
        padding: "0.75rem 1rem",
        marginBottom: "0.75rem",
      }}
    >
      {children}
    </div>
  );
}

export default function HighlightedBoxLab() {
  return (
    <div id="wd-highlighted-box">
      <h3>Highlighted Box</h3>
      <HighlightedBox
        backgroundColor="lavender"
        borderColor="purple"
        borderWidth={3}
        borderRadius={12}
      >
        <h4>Callout</h4>
        <p>
          This box wraps <strong>any</strong>{" "}children — headings, paragraphs,
          lists, and more.
        </p>
        <ul>
          <li>backgroundColor</li>
          <li>borderColor</li>
          <li>borderWidth</li>
          <li>borderRadius</li>
        </ul>
      </HighlightedBox>
      <HighlightedBox
        backgroundColor="#e8f5e9"
        borderColor="green"
        borderWidth={2}
        borderRadius={20}
      >
        <p>
          A second box with different style props wrapping different content.
        </p>
      </HighlightedBox>
    </div>
  );
}`}</CodeBlock>
        <p>
          Two boxes share the same wrapper idea: border and background stay with
          the box, while nested headings, paragraphs, and lists (the{" "}
          <code>children</code>) differ — the pattern layouts reuse in <SectionLink to="1.3.11" />:
        </p>
        <LiveDemo
          name="HighlightedBox"
          file="app/labs/lab1/HighlightedBox.tsx"
        >
          <HighlightedBox />
        </LiveDemo>
        <OnYourOwn>
          Add another <code>HighlightedBox</code>{" "}that wraps personal content
          — for example an <code>h4</code>{" "}with your name and an unordered
          list of three goals for this course. Pick style props that feel
          different from the sample boxes so you can see the wrapper stay the
          same while <code>children</code>{" "}change.
        </OnYourOwn>
        <WithAI
          prompt={`Where HighlightedBox is rendered in Lab 1, keep my personal box unchanged. Add one more sample HighlightedBox with backgroundColor="honeydew", borderColor="seagreen", wrapping an h4 "Sample nested content" and a three-item ul of HTML tags (p, table, form). Not about me.`}
        >
          Ask the assistant to add one extra sample box of nested tags — leave
          your goals list as the personal one:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-1-3-9"
        title="1.3.9 Implementing Navigation with the Anchor Tag"
      >
        <p>
          The <code>&lt;a&gt;</code>{" "}tag creates <strong>hyperlinks</strong> —
          the ability to navigate from one document on the Web to another, or to
          a specific place within a document. The{" "}
          <strong>&quot;Hyper&quot;</strong>{" "}in HyperText Markup Language refers
          to that idea. Its <code>href</code>{" "}attribute, short for hypertext
          reference, holds the destination address the browser should load or
          jump to when the user follows the link.
        </p>
        <p>
          The shape of <code>href</code>{" "}matters:
        </p>
        <ul>
          <li>
            <strong>Absolute URL</strong> — a full address including the scheme
            and host, such as{" "}
            <code>https://www.lipsum.com</code>{" "}or{" "}
            <code>https://github.com/…</code>. Use this for other websites.
          </li>
          <li>
            <strong>Relative URL</strong> — a path on the{" "}
            <em>same</em>{" "}site, such as <code>/labs</code>{" "}or{" "}
            <code>/labs/lab1</code>. The browser resolves it against the current
            origin (for example <LocalUrl href="/" />).
          </li>
          <li>
            <strong>Fragment (hash)</strong> — a leading <code>#</code>{" "}plus an
            element <code>id</code>, such as <code>#wd-anchor-bottom</code>.
            That scrolls to a target on the <em>same page</em>{" "}without loading a
            new document. Fragments are classic in-page navigation; they are not
            the same as navigating to a different route.
          </li>
        </ul>
        <p>
          Optional attributes refine how the link behaves. The{" "}
          <code>target</code>{" "}attribute set to <code>&quot;_blank&quot;</code>{" "}
          opens the destination in a new browser tab or window — useful for
          external sites so users do not lose your app. When you use{" "}
          <code>target=&quot;_blank&quot;</code>, also set{" "}
          <code>rel=&quot;noreferrer&quot;</code>{" "}(or at least{" "}
          <code>noopener</code>) so the new page cannot access{" "}
          <code>window.opener</code> — a small but important security habit.
        </p>
        <p>
          Create <code>AnchorTag.tsx</code>, import it into{" "}
          <code>page.tsx</code>, and add a lipsum link plus a GitHub link with
          id <code>wd-github</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="AnchorTag"
          file="app/labs/lab1/AnchorTag.tsx"
        >{`export default function AnchorTag() {
  return (
    <>
      <h4>Anchor tag</h4>
      Please{" "}
      <a href="https://www.lipsum.com" id="wd-lipsum">
        click here
      </a>{" "}
      to get dummy text
      <br />
      <a href="https://github.com/jannunzi" id="wd-github">
        GitHub
      </a>
    </>
  );
}`}</CodeBlock>
        <p>
          Lipsum and GitHub appear as ordinary links — a plain{" "}
          <code>&lt;a&gt;</code>{" "}triggers a normal browser navigation (full
          page load for a new document):
        </p>
        <LiveDemo name="AnchorTag" file="app/labs/lab1/AnchorTag.tsx">
          <AnchorTag />
        </LiveDemo>
        <p>
          The following demo is illustrative — try absolute, relative, hash, and{" "}
          <code>target=&quot;_blank&quot;</code>{" "}links. Your Lab 1 file only
          needs the lipsum and GitHub anchors above.
        </p>
        <CodeBlock
          language="tsx"
          name="AnchorHrefPatterns"
        >{`{/* Absolute — another site */}
<a href="https://www.lipsum.com">lipsum.com</a>

{/* Relative — same site */}
<a href="/labs">Back to Labs</a>

{/* Fragment — same page, scroll to id */}
<a href="#wd-anchor-bottom">Jump to bottom</a>

{/* New tab + safer external link */}
<a
  href="https://github.com/jannunzi"
  target="_blank"
  rel="noreferrer"
>
  GitHub (new tab)
</a>`}</CodeBlock>
        <p>
          Absolute, relative, hash, and new-tab patterns side by side — use the
          hash link to jump within the demo without leaving the page:
        </p>
        <LiveDemo name="AnchorHrefPatterns">
          <AnchorHrefPatterns />
        </LiveDemo>
        <OnYourOwn>
          In <code>AnchorTag.tsx</code>, add two more anchors — one absolute
          link to a website you visit often (news, docs, or a hobby site) with
          id <code>wd-your-link</code>, and one that opens your own GitHub (or
          LinkedIn) profile in a new tab with{" "}
          <code>target=&quot;_blank&quot;</code>{" "}and{" "}
          <code>rel=&quot;noreferrer&quot;</code>{" "}(id{" "}
          <code>wd-your-github</code>).
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab1/AnchorTag.tsx, keep wd-your-link and wd-your-github unchanged. Add one more sample absolute link with id wd-ai-link to https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table labeled "MDN: table element". Not a link to my profiles.`}
        >
          Ask the assistant to add one extra sample docs link — not your hobby
          site or GitHub:
        </WithAI>
      </Section>

      <Section level={3} id="sec-1-3-10" title="1.3.10 Implementing Navigation">
        <p>
          Recall from the chapter introduction: a{" "}
          <strong>Single Page Application</strong>{" "}(<strong>SPA</strong>) keeps
          one HTML shell loaded and updates the UI as the user moves around,
          instead of downloading a brand-new page for every click. Next.js apps
          are built that way for in-app routes: navigating from Labs to Lab 1
          should feel instant, without flashing a full reload.
        </p>
        <p>
          In <SectionLink to="1.2.5" />{" "}you defined routes by adding <code>page.tsx</code>{" "}files
          under <code>app/</code>{" "}(the App Router). Navigation is how the user{" "}
          <em>moves between</em>{" "}those routes. Historically, some SPAs used the
          URL <strong>hash</strong>{" "}(<code>#/lab1</code>) for client-side
          routes, because changing the fragment does not reload the document.
          That trick enabled early SPA navigation, but it is not how the App
          Router works. Today Next.js uses the browser{" "}
          <strong>History API</strong>{" "}so paths like <code>/labs/lab1</code>{" "}
          update without a full reload — and without requiring a{" "}
          <code>#</code>{" "}prefix. Reserve hash fragments for in-page jumps (as in{" "}
          <SectionLink to="1.3.9" />), not for app routes in this course.
        </p>
        <p>
          A plain <code>&lt;a href=&quot;/labs/lab1&quot;&gt;</code>{" "}still works,
          but it tells the browser to treat the click as a normal document
          request. Inside a Next.js app, prefer the built-in{" "}
          <code>Link</code>{" "}component from <code>next/link</code>.{" "}
          <code>Link</code>{" "}renders an anchor under the hood, yet intercepts
          navigation so React can swap in the next route&apos;s UI, prefetch
          linked pages when helpful, and keep client state where appropriate.
          Use <code>&lt;a&gt;</code>{" "}for true external URLs (or when you
          explicitly want a full reload); use <code>Link</code>{" "}for routes you
          already created with <code>page.tsx</code>.
        </p>
        <p>
          Create Lab 2 and Lab 3 as new App Router routes (
          <code>app/labs/lab2/page.tsx</code>{" "}and{" "}
          <code>app/labs/lab3/page.tsx</code>{" "}— simple headings are enough),
          then a Labs index at <code>app/labs/page.tsx</code>{" "}that links to each
          lab with <code>Link</code>:
        </p>
        <CodeBlock language="tsx" name="Labs" file="app/labs/page.tsx">{`import Link from "next/link";

export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <ul>
        <li>
          <Link href="/labs/lab1">Lab 1: HTML Examples</Link>
        </li>
        <li>
          <Link href="/labs/lab2">Lab 2: CSS Basics</Link>
        </li>
        <li>
          <Link href="/labs/lab3">Lab 3: JavaScript Fundamentals</Link>
        </li>
      </ul>
    </div>
  );
}`}</CodeBlock>
        <p>
          A Labs index lists Lab 1–3. In the running app, clicking a link
          changes the URL to a path such as <code>/labs/lab1</code>{" "}without the
          full-page flash a raw external <code>&lt;a&gt;</code>{" "}would cause:
        </p>
        <LiveDemo name="Labs" file="app/labs/page.tsx">
          <LabsIndexDemo />
        </LiveDemo>
        <OnYourOwn>
          Create a Lab 4 placeholder page at{" "}
          <code>app/labs/lab4/page.tsx</code>{" "}(a simple heading is enough), then
          add a <code>Link</code>{" "}to <code>/labs/lab4</code>{" "}on the Labs
          index. The new route should load without a full page refresh, just
          like Labs 1–3.
        </OnYourOwn>
        <WithAI
          prompt={`Create app/labs/lab5/page.tsx that exports a default component rendering an h2 "Lab 5". In app/labs/page.tsx, add a Next.js Link to /labs/lab5 next to the existing lab links. Do not replace Labs 1–4.`}
        >
          After Lab 4 works, paste this prompt to add a Lab 5 placeholder the
          same way — then confirm that link also navigates without a full
          reload:
        </WithAI>
      </Section>

      <Section level={3} id="sec-1-3-11" title="1.3.11 Implementing Layouts">
        <p>
          In the App Router, <code>page.tsx</code>{" "}creates a route (
          <SectionLink to="1.2.5" />
          ); another reserved filename is <code>layout.tsx</code>, which does{" "}
          <em>not</em>{" "}create its own URL by itself. Instead it{" "}
          <strong>wraps</strong>{" "}the <code>page.tsx</code>{" "}
          (and nested layouts) in the same folder and below, so shared chrome —
          navigation, sidebars, headers — belongs in a layout and every child
          route gets it without copying markup into each page.
        </p>
        <p>
          Nested folders nest layouts too. The root{" "}
          <code>app/layout.tsx</code>{" "}wraps the whole app;{" "}
          <code>app/labs/layout.tsx</code>{" "}wraps only routes under{" "}
          <code>/labs</code>. When you open Lab 1, Next.js renders the lab
          layout around the Lab 1 page.
        </p>
        <p>
          Layouts receive a prop named <code>children</code> — the same wrapping
          idea you practiced with <code>HighlightedBox</code>{" "}in <SectionLink to="1.3.8" />. You do
          not pass the page in by hand — the framework renders the matching{" "}
          <code>page.tsx</code>{" "}(and nested UI) into <code>children</code>{" "}for
          you. Create <code>app/labs/TOC.tsx</code>{" "}for a small table of
          contents, then <code>app/labs/layout.tsx</code>{" "}that places the TOC
          beside <code>children</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="LabsLayout"
          file="app/labs/layout.tsx"
        >{`import { ReactNode } from "react";
import TOC from "./TOC";

export default function LabsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <table>
      <tbody>
        <tr>
          <td valign="top" width="100px">
            <TOC />
          </td>
          <td valign="top">{children}</td>
        </tr>
      </tbody>
    </table>
  );
}`}</CodeBlock>
        <p>
          With the TOC on the left and page content on the right, the sidebar
          stays put while the main area (<code>children</code>) swaps as you
          open different labs:
        </p>
        <LiveDemo name="LabsLayout" file="app/labs/layout.tsx">
          <LabsLayoutDemo />
        </LiveDemo>
        <OnYourOwn>
          In <code>TOC.tsx</code>, add a small personal touch above or below the
          lab links — your name, a one-line motto, or a <code>Link</code>{" "}back
          to the book chapter. Keep the shared layout structure; only the TOC
          content should feel like yours.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/TOC.tsx, keep any personal name or motto I added. Add a Next.js Link to /book/ch1 labeled "Chapter 1" (id wd-toc-book-link) with the other lab links. Do not change the layout table in layout.tsx.`}
        >
          Ask the assistant to add a Chapter 1 link in the TOC — leave your
          name or motto as the personal bit. This link is expected to 404 in
          your own app (your app does not have the course-book routes). A1
          only checks that an element with id <code>wd-toc-book-link</code>{" "}
          exists:
        </WithAI>
      </Section>

      <Section level={3} id="sec-1-3-12" title="1.3.12 Exercises">
        <p>
          Use this checklist to confirm Lab 1 covers every HTML topic in{" "}
          <SectionLink to="1.3" />
          . It is the same list, in the same order, as the{" "}
          <A1LabExerciseIntroLink />{" "}on A1 — one top-level item per Lab
          section, with nested <strong>a / b / c</strong> for the Lab
          component, <strong>On your own</strong>, and{" "}
          <strong>With AI</strong> extra, walking <SectionLink to="1.3.1" />–
          <SectionLink to="1.3.11" />{" "}as you read. Each parent points back to
          the section where you built the worked example. When you are done,{" "}
          <code>app/labs/lab1/page.tsx</code>{" "}should import and render the
          components in order so the page matches the live demo below.
        </p>
        <A1LabExerciseList />
        <p>
          When the checklist is done, Lab 1 should match the core HTML examples
          below. Your On your own additions and With AI extras appear in the
          same page (and Labs chrome) beyond what this demo shows. Delivery
          (Vercel, name, GitHub) and Kambaz screens stay on the A1 page — see{" "}
          <SectionLink to="1.4.9" />{" "}for the Kambaz recap.
        </p>
        <p>
          Here is the finished <code>app/labs/lab1/page.tsx</code>, importing
          every Lab 1 component in section order:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab1Complete"
          file="app/labs/lab1/page.tsx"
        >{`import HeadingTags from "./HeadingTags";
import ParagraphTag from "./ParagraphTag";
import ListTags from "./ListTags";
import Tables from "./Tables";
import Images from "./Images";
import Forms from "./forms/Forms";
import HighlightedParagraph from "./HighlightedParagraph";
import HighlightedBox from "./HighlightedBox";
import AnchorTag from "./AnchorTag";

export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <h3>HTML Examples</h3>
      <HeadingTags />
      <ParagraphTag />
      <ListTags />
      <Tables />
      <Images />
      <Forms />
      <HighlightedParagraph />
      <HighlightedBox />
      <AnchorTag />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo name="Lab1" file="app/labs/lab1/page.tsx">
          <Lab1 />
        </LiveDemo>
        <p>
          When the checklist feels solid, try the self-check in{" "}
          <SectionLink to="1.3.13" />{" "}before you start Kambaz.
        </p>
      </Section>
    </>
  );
}
