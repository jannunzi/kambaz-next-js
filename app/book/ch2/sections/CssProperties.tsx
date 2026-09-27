import "../lab2-styles";
import Section from "../../components/Section";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import ContainFixed from "../../components/ContainFixed";
import ForegroundColors from "@/app/labs/lab2/intermediates/2-1-7-ForegroundColors";
import BackgroundColors from "@/app/labs/lab2/intermediates/2-1-8-BackgroundColors";
import Borders from "@/app/labs/lab2/intermediates/2-1-9-Borders";
import Padding from "@/app/labs/lab2/intermediates/2-1-10a-Padding";
import Margins from "@/app/labs/lab2/intermediates/2-1-10b-Margins";
import BoxModel from "@/app/labs/lab2/intermediates/2-1-10c-BoxModel";
import Corners from "@/app/labs/lab2/intermediates/2-1-11-Corners";
import Dimensions from "@/app/labs/lab2/intermediates/2-1-12-Dimensions";
import Display from "@/app/labs/lab2/intermediates/2-1-12b-Display";
import PositionRelative from "@/app/labs/lab2/intermediates/2-1-13-PositionRelative";
import PositionAbsolute from "@/app/labs/lab2/intermediates/2-1-14-PositionAbsolute";
import PositionFixed from "@/app/labs/lab2/intermediates/2-1-15-PositionFixed";
import Zindex from "@/app/labs/lab2/intermediates/2-1-16-Zindex";
import Float from "@/app/labs/lab2/intermediates/2-1-17-Float";
import GridLayout from "@/app/labs/lab2/intermediates/2-1-18-GridLayout";
import FlexRow from "@/app/labs/lab2/intermediates/2-1-19a-FlexRow";
import FlexGrow from "@/app/labs/lab2/intermediates/2-1-19b-FlexGrow";
import FlexWidth from "@/app/labs/lab2/intermediates/2-1-19c-FlexWidth";
import MediaQueriesDemo from "@/app/labs/lab2/intermediates/2-1-20-MediaQueries";
import PracticeCard from "../../components/PracticeCard";
import SectionLink from "../../components/SectionLink";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function CssProperties() {
  return (
    <>
      <Section
        level={3}
        id="sec-2-1-7"
        title="2.1.7 Styling an HTML Tag's Foreground Color with CSS"
      >
        <p>
          The <code>color</code>{" "}property sets an element&apos;s{" "}
          <strong>foreground</strong>{" "}(text) color. CSS accepts colors in
          several notations: named colors such as <code>blue</code>{" "}or{" "}
          <code>red</code>; hexadecimal triples such as{" "}
          <code>#7070ff</code>{" "}(red, green, and blue intensity, two digits
          each); or the functional <code>rgb(12, 34, 56)</code>{" "}form. From
          this exercise on, move each new demo into its own file under{" "}
          <code>app/labs/lab2/</code>. One exercise per component keeps{" "}
          <code>page.tsx</code>{" "}manageable, the same organization used for
          Lab 1&apos;s HTML exercises. Import each demo into{" "}
          <code>page.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab2"
          file="app/labs/lab2/page.tsx"
        >{`import "./index.css";
import ForegroundColors from "./ForegroundColors";

export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2 - Cascading Style Sheets</h2>
      {/* ...earlier exercises... */}
      <ForegroundColors />
    </div>
  );
}`}</CodeBlock>
        <p>
          Start with <code>ForegroundColors.tsx</code>:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-fg-color-black { color: black; }
.wd-fg-color-white { color: white; }
.wd-fg-color-blue { color: #7070ff; }
.wd-fg-color-red { color: #ff7070; }
.wd-fg-color-green { color: green; }`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="ForegroundColors"
          file="app/labs/lab2/ForegroundColors.tsx"
        >{`export default function ForegroundColors() {
  return (
    <div id="wd-css-colors">
      <h2>Colors</h2>
      <h3 className="wd-fg-color-blue">Foreground color</h3>
      <p className="wd-fg-color-red">
        The text in this paragraph is red but{" "}
        <span className="wd-fg-color-green">this text is green</span>
      </p>
    </div>
  );
}`}</CodeBlock>
        <p>
          The heading renders blue, the paragraph text red, and the nested
          span green — three foreground colors applied through three
          separate class selectors on three different elements:
        </p>
        <LiveDemo mode="styled" name="ForegroundColors" file="app/labs/lab2/ForegroundColors.tsx">
          <ForegroundColors />
        </LiveDemo>
      
        <OnYourOwn>
          In <code>ForegroundColors.tsx</code>, add
          one more sentence that mixes at least two of your{" "}
          <code>wd-fg-color-*</code>{" "}classes (paragraph plus nested{" "}
          <code>span</code>) so different words show different foreground colors.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/ForegroundColors.tsx, keep my personal mixed-color sentence unchanged. After the sample red paragraph with the green span, add one more sample paragraph with id wd-ai-fg that uses wd-fg-color-blue on the paragraph and wd-fg-color-black on a nested span. Not a sentence about me.`}
        >
          Paste this prompt to add a second sample color mix — then confirm
          your personal sentence is still there:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-8"
        title="2.1.8 Styling an HTML Tag's Background Color with CSS"
      >
        <p>
          The <code>background-color</code>{" "}property works the same way,
          just for the area behind the content instead of the text itself.
          Add a matching set of background classes and a{" "}
          <code>BackgroundColors.tsx</code>{" "}component that stacks background
          and foreground classes on the same element:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-bg-color-yellow { background-color: #ffff07; }
.wd-bg-color-blue { background-color: #7070ff; }
.wd-bg-color-red { background-color: #ff7070; }
.wd-bg-color-green { background-color: green; }
.wd-bg-color-gray { background-color: lightgray; }`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="BackgroundColors"
          file="app/labs/lab2/BackgroundColors.tsx"
        >{`export default function BackgroundColors() {
  return (
    <div id="wd-css-background-colors">
      <h3 className="wd-bg-color-blue wd-fg-color-white">Background color</h3>
      <p className="wd-bg-color-red wd-fg-color-black">
        This background of this paragraph is red but{" "}
        <span className="wd-bg-color-green wd-fg-color-white">
          the background of this text is green and the foreground white
        </span>
      </p>
    </div>
  );
}`}</CodeBlock>
        <p>
          Each element now applies two classes at once — one for background,
          one for foreground — which is exactly how <code>className</code>{" "}
          composes multiple selectors: list them space-separated and every
          matching rule&apos;s properties apply together:
        </p>
        <LiveDemo mode="styled" name="BackgroundColors" file="app/labs/lab2/BackgroundColors.tsx">
          <BackgroundColors />
        </LiveDemo>
      
        <OnYourOwn>
          In <code>BackgroundColors.tsx</code>, add
          another block that stacks a background class with a contrasting
          foreground class (for example yellow background with dark text) so the
          content stays readable.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/BackgroundColors.tsx, keep my personal stacked background/foreground block unchanged. After the sample heading and paragraph, add one more sample block with id wd-ai-bg that uses wd-bg-color-yellow and wd-fg-color-black. Not about me.`}
        >
          Paste this prompt to add a second sample stacked block — then confirm
          the yellow-on-dark text stays readable:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-9"
        title="2.1.9 Styling an HTML Tag's Borders with CSS"
      >
        <p>
          Borders are configured with <code>border-width</code>,{" "}
          <code>border-style</code>{" "}(<code>solid</code>,{" "}
          <code>dotted</code>, <code>dashed</code>, <code>double</code>, …),
          and <code>border-color</code>. Declare each aspect of a border as
          its own reusable class so demos can mix and match a width, a style,
          and a color independently:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-border-fat { border-width: 20px 30px 20px 30px; }
.wd-border-thin { border-width: 4px; }
.wd-border-solid { border-style: solid; }
.wd-border-dashed { border-style: dashed; }
.wd-border-yellow { border-color: #ffff07; }
.wd-border-red { border-color: #ff7070; }
.wd-border-blue { border-color: #7070ff; }`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Borders"
          file="app/labs/lab2/Borders.tsx"
        >{`export default function Borders() {
  return (
    <div id="wd-css-borders">
      <h2>Borders</h2>
      <p className="wd-border-fat wd-border-red wd-border-solid">
        Solid fat red border
      </p>
      <p className="wd-border-thin wd-border-blue wd-border-dashed">
        Dashed thin blue border
      </p>
    </div>
  );
}`}</CodeBlock>
        <p>
          The first paragraph combines the fat width, red color, and solid
          style classes into one thick red border; the second combines thin,
          blue, and dashed into a completely different look — three small
          classes, many combinations:
        </p>
        <LiveDemo mode="styled" name="Borders" file="app/labs/lab2/Borders.tsx">
          <Borders />
        </LiveDemo>
      
        <OnYourOwn>
          In <code>Borders.tsx</code>, add a third
          paragraph that mixes a different width, style, and color class from{" "}
          <code>index.css</code>{" "}(for example fat + dashed + yellow) without
          writing a new combined rule.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/Borders.tsx, keep my personal third border paragraph unchanged. After the sample fat-red-solid and thin-blue-dashed paragraphs, add one more sample paragraph with id wd-ai-border that mixes wd-border-fat wd-border-dashed wd-border-yellow. Do not write a new combined CSS rule.`}
        >
          Paste this prompt to add a fourth sample mix — then confirm it uses
          only existing width, style, and color classes:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-10"
        title="2.1.10 Styling an HTML Tag's Padding, Margins, and Box Model with CSS"
      >
        <p>
          <strong>Padding</strong>{" "}is the space between an element&apos;s
          content and its border; <strong>margin</strong>{" "}is the space
          outside the border, separating the element from its neighbors.
          Both can be set on all four sides at once, or per side with{" "}
          <code>-top</code>, <code>-right</code>, <code>-bottom</code>, and{" "}
          <code>-left</code>{" "}suffixes. Add padding classes and a{" "}
          <code>Padding.tsx</code>{" "}that reuses the border and background
          classes from the previous two exercises so the padded regions are
          easy to see:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-padded-top-left {
  padding-top: 50px;
  padding-left: 50px;
}
.wd-padded-bottom-right {
  padding-bottom: 50px;
  padding-right: 50px;
}
.wd-padding-fat {
  padding: 50px;
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Padding"
          file="app/labs/lab2/Padding.tsx"
        >{`export default function Padding() {
  return (
    <div id="wd-css-paddings">
      <h2>Padding</h2>
      <div className="wd-padded-top-left wd-border-fat wd-border-red wd-border-solid wd-bg-color-yellow">
        Padded top left
      </div>
      <div className="wd-padded-bottom-right wd-border-fat wd-border-blue wd-border-solid wd-bg-color-yellow">
        Padded bottom right
      </div>
      <div className="wd-padding-fat wd-border-fat wd-border-yellow wd-border-solid wd-bg-color-blue wd-fg-color-white">
        Padded all around
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Each box&apos;s text sits a fixed distance from its border — only
          on the top and left for the first box, only bottom and right for
          the second, and evenly on all sides for the third:
        </p>
        <LiveDemo mode="styled" name="Padding" file="app/labs/lab2/Padding.tsx">
          <Padding />
        </LiveDemo>
        <p>
          Margin classes follow the identical pattern, just pushing
          neighboring content away from the outside of the border instead of
          the content in from the inside:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-margin-bottom {
  margin-bottom: 50px;
}
.wd-margin-right-left {
  margin-left: 50px;
  margin-right: 50px;
}
.wd-margin-all-around {
  margin: 30px;
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Margins"
          file="app/labs/lab2/Margins.tsx"
        >{`export default function Margins() {
  return (
    <div id="wd-css-margins">
      <h2>Margins</h2>
      <div className="wd-margin-bottom wd-padded-top-left wd-border-fat wd-border-red wd-border-solid wd-bg-color-yellow">
        Margin bottom
      </div>
      <div className="wd-margin-right-left wd-padded-bottom-right wd-border-fat wd-border-blue wd-border-solid wd-bg-color-yellow">
        Margin left right
      </div>
      <div className="wd-margin-all-around wd-padding-fat wd-border-fat wd-border-yellow wd-border-solid wd-bg-color-blue wd-fg-color-white">
        Margin all around
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Compare the gaps between these three boxes to the padding demo
          above — the space now shows up outside each box&apos;s border,
          pushing the boxes apart from one another rather than pushing the
          text inward:
        </p>
        <LiveDemo mode="styled" name="Margins" file="app/labs/lab2/Margins.tsx">
          <Margins />
        </LiveDemo>
        <p>
          Padding and margin are two layers of a larger picture: the CSS{" "}
          <strong>box model</strong>. Every element is a box made of four
          concentric layers, from the inside out: <strong>content</strong>{" "}
          (the text or children), <strong>padding</strong>{" "}(space between
          content and border), <strong>border</strong>, then{" "}
          <strong>margin</strong>{" "}(space outside the border). Background
          color fills the content and padding; the border sits on top of that
          edge; margin is transparent — you see whatever is behind the gap.
        </p>
        <p>
          Those layers also change how <code>width</code>{" "}is measured: the{" "}
          <code>box-sizing</code>{" "}property chooses the rule. The CSS default
          is <code>content-box</code>: <code>width: 200px</code>{" "}sizes only
          the content, then padding and border add extra pixels outside it.{" "}
          <code>border-box</code>{" "}counts padding and border{" "}
          <em>inside</em>{" "}the 200px, so the box you see on screen stays 200px
          wide. Layout math is much easier with{" "}
          <code>border-box</code>, which is why many style resets (and Tailwind
          later) set it globally. Draw those four layers the way the browser
          does in the Computed pane, then two boxes that share the same{" "}
          <code>width</code>, <code>padding</code>, and <code>border</code>{" "}
          but differ only in <code>box-sizing</code>:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-devtools-box {
  box-sizing: border-box;
  width: 100%;
  max-width: 34rem;
  color: #222;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  font-size: clamp(12px, 2.5vw, 14px);
  line-height: 1.2;
}
.wd-devtools-box *,
.wd-devtools-box *::before,
.wd-devtools-box *::after {
  box-sizing: border-box;
}
.wd-devtools-box .wd-bm-margin,
.wd-devtools-box .wd-bm-border,
.wd-devtools-box .wd-bm-padding {
  display: grid;
  grid-template-columns: minmax(2.75rem, auto) minmax(0, 1fr) minmax(2.75rem, auto);
  grid-template-rows: auto minmax(2.25rem, 1fr) auto;
}
.wd-devtools-box .wd-bm-margin {
  background-color: #f9cc9d;
  border: 1px dashed #222;
}
.wd-devtools-box .wd-bm-border,
.wd-devtools-box .wd-bm-padding,
.wd-devtools-box .wd-bm-content {
  grid-column: 2;
  grid-row: 2;
  min-width: 0;
}
.wd-devtools-box .wd-bm-border {
  background-color: #fddd9b;
  border: 1px solid #222;
}
.wd-devtools-box .wd-bm-padding {
  background-color: #c3d08b;
  border: 1px dashed #222;
}
.wd-devtools-box .wd-bm-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.45rem 0.6rem;
  background-color: #8cb6c0;
  border: 1px solid #222;
  text-align: center;
  white-space: nowrap;
}
.wd-devtools-box .wd-bm-label {
  z-index: 1;
  grid-column: 1;
  grid-row: 1;
  align-self: start;
  justify-self: start;
  padding: 3px 5px 0;
  font-size: 0.85em;
}
.wd-devtools-box .wd-bm-top,
.wd-devtools-box .wd-bm-bottom {
  grid-column: 1 / -1;
  padding: 0.35rem 0.25rem;
  text-align: center;
}
.wd-devtools-box .wd-bm-top {
  grid-row: 1;
}
.wd-devtools-box .wd-bm-bottom {
  grid-row: 3;
}
.wd-devtools-box .wd-bm-left,
.wd-devtools-box .wd-bm-right {
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
}
.wd-devtools-box .wd-bm-left {
  grid-column: 1;
}
.wd-devtools-box .wd-bm-right {
  grid-column: 3;
}
.wd-box-sizing-demo {
  background-color: lightgray;
  padding: 10px;
}
.wd-box-sizing-content,
.wd-box-sizing-border {
  width: 200px;
  height: 180px;
  padding: 20px;
  border: 10px solid #c41e3a;
  background-color: #ffff07;
  margin-bottom: 10px;
}
.wd-box-sizing-content {
  box-sizing: content-box;
}
.wd-box-sizing-border {
  box-sizing: border-box;
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="BoxModel"
          file="app/labs/lab2/BoxModel.tsx"
        >{`export function BoxModelWidget() {
  return (
    <div
      className="wd-devtools-box"
      role="img"
      aria-label="Box model of the content-box sample: margin 0, 0, 10, 0; border 10; padding 20; content 200 by 180"
    >
      <div className="wd-bm-margin">
        <span className="wd-bm-label">margin</span>
        <span className="wd-bm-top">0</span>
        <span className="wd-bm-left">0</span>
        <span className="wd-bm-right">0</span>
        <span className="wd-bm-bottom">10</span>
        <div className="wd-bm-border">
          <span className="wd-bm-label">border</span>
          <span className="wd-bm-top">10</span>
          <span className="wd-bm-left">10</span>
          <span className="wd-bm-right">10</span>
          <span className="wd-bm-bottom">10</span>
          <div className="wd-bm-padding">
            <span className="wd-bm-label">padding</span>
            <span className="wd-bm-top">20</span>
            <span className="wd-bm-left">20</span>
            <span className="wd-bm-right">20</span>
            <span className="wd-bm-bottom">20</span>
            <div className="wd-bm-content">200×180</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BoxModel() {
  return (
    <div id="wd-css-box-model">
      <h2>Box model</h2>
      <BoxModelWidget />
      <h3>box-sizing</h3>
      <div className="wd-box-sizing-demo">
        <div className="wd-box-sizing-content">
          content-box: width 200px plus padding and border
        </div>
        <div className="wd-box-sizing-border">
          border-box: width 200px includes padding and border
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The figure is the box model the way DevTools draws it: a tan margin,
          a yellow border, a green padding ring, and a blue content box in the
          center. It draws the <code>content-box</code> sample. Both yellow
          boxes set <code>margin-bottom: 10px</code> (the other margins stay
          0), a 10px border, and 20px of padding, so those rings read 0, 10,
          10, and 20. The shared rule also sets <code>width: 200px</code> and{" "}
          <code>height: 180px</code>. Under <code>content-box</code> those
          lengths are the content box, so the center reads <code>200×180</code>.
          The <code>border-box</code> box uses the same width, height, padding,
          and border, so its content box is <code>140×120</code> (200 − 40
          padding − 20 border wide, and 180 − 40 − 20 tall). On screen the
          content-box box measures 260×240 (200 + 40 + 20 by 180 + 40 + 20)
          and the border-box box stays 200×180:
        </p>
        <LiveDemo mode="styled" name="BoxModel" file="app/labs/lab2/BoxModel.tsx">
          <BoxModel />
        </LiveDemo>
      
        <OnYourOwn>
          In <code>Padding.tsx</code>{" "}or{" "}
          <code>Margins.tsx</code>, add one more box that uses a new per-side
          padding or margin class from <code>index.css</code>, keeping a fat border
          so the spacing is easy to see. Then change the{" "}
          <code>width</code>{" "}on the two <code>box-sizing</code>{" "}boxes (or add
          a third) and confirm which one stays the declared width on screen.
        </OnYourOwn>
        <WithAI
          prompt={`Keep my personal extra padding/margin box and any box-sizing width change I made. In app/labs/lab2/Padding.tsx, after the three sample boxes, add one more sample box with id wd-ai-padded that uses a new class in app/labs/lab2/index.css (padding-top only, plus a fat red solid border and yellow background). In app/labs/lab2/BoxModel.tsx, add a third sample box with the same width/padding/border as the others but a comment noting which box-sizing keeps the declared width. Do not overwrite my personal boxes.`}
        >
          Paste this prompt to add another sample padded box and a third
          box-sizing demo — then confirm which box stays the declared width:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-11"
        title="2.1.11 Styling an HTML Tag's Corners with CSS"
      >
        <p>
          The <code>border-radius</code>{" "}property rounds an element&apos;s
          corners. Set all four at once, or list four values (top-left,
          top-right, bottom-right, bottom-left) to round each corner by a
          different amount, or target one corner directly with properties
          like <code>border-top-left-radius</code>:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-rounded-corners-top {
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
}
.wd-rounded-corners-bottom {
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
}
.wd-rounded-corners-all-around {
  border-radius: 50px;
}
.wd-rounded-corners-inline {
  border-radius: 30px 0px 20px 50px;
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Corners"
          file="app/labs/lab2/Corners.tsx"
        >{`export default function Corners() {
  return (
    <div id="wd-css-corners">
      <h3>Rounded corners</h3>
      <p className="wd-rounded-corners-top wd-border-thin wd-border-blue wd-border-solid wd-padding-fat">
        Rounded corners on the top
      </p>
      <p className="wd-rounded-corners-bottom wd-border-thin wd-border-blue wd-border-solid wd-padding-fat">
        Rounded corners at the bottom
      </p>
      <p className="wd-rounded-corners-all-around wd-border-thin wd-border-blue wd-border-solid wd-padding-fat">
        Rounded corners all around
      </p>
      <p className="wd-rounded-corners-inline wd-border-thin wd-border-blue wd-border-solid wd-padding-fat">
        Different rounded corners
      </p>
    </div>
  );
}`}</CodeBlock>
        <p>
          The four paragraphs each round a different combination of corners
          — top only, bottom only, all four evenly, and all four by
          different amounts on the last one:
        </p>
        <LiveDemo mode="styled" name="Corners" file="app/labs/lab2/Corners.tsx">
          <Corners />
        </LiveDemo>
      
        <OnYourOwn>
          In <code>Corners.tsx</code>, add another
          box that rounds only some corners (or uses a larger radius) via your{" "}
          <code>border-radius</code>{" "}classes in <code>index.css</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/Corners.tsx and app/labs/lab2/index.css, keep my personal rounded box unchanged. After the four sample paragraphs, add one more sample paragraph with id wd-ai-corners using a new class .wd-ai-rounded-left that rounds only the left corners (border-top-left-radius and border-bottom-left-radius 40px) plus the existing thin blue solid border and fat padding.`}
        >
          Paste this prompt to add a second sample radius — then confirm only
          the left corners round on that new box:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-12"
        title="2.1.12 Styling an HTML Tag's Dimensions and Display with CSS"
      >
        <p>
          By default, block-level elements — <code>div</code>, headings,
          paragraphs — stretch to fill the full width of their parent
          container. The <code>width</code>{" "}and{" "}
          <code>height</code>{" "}properties override that default so an
          element only occupies the space you specify:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-dimension-portrait {
  width: 75px;
  height: 100px;
}
.wd-dimension-landscape {
  width: 100px;
  height: 75px;
}
.wd-dimension-square {
  width: 75px;
  height: 75px;
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Dimensions"
          file="app/labs/lab2/Dimensions.tsx"
        >{`export default function Dimensions() {
  return (
    <div id="wd-css-dimensions">
      <h2>Dimension</h2>
      <div>
        <div className="wd-dimension-portrait wd-bg-color-yellow">Portrait</div>
        <div className="wd-dimension-landscape wd-bg-color-blue wd-fg-color-white">
          Landscape
        </div>
        <div className="wd-dimension-square wd-bg-color-red">Square</div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Three small boxes appear where three full-width divs would have
          stood by default — but block elements still stack vertically even
          at reduced widths, since narrowing an element does not change
          whether it starts a new line:
        </p>
        <LiveDemo mode="styled" name="Dimensions" file="app/labs/lab2/Dimensions.tsx">
          <Dimensions />
        </LiveDemo>
        <p>
          <code>width</code>{" "}and <code>height</code>{" "}apply to{" "}
          <strong>block</strong>{" "}boxes (and to{" "}
          <code>inline-block</code>, below). They do{" "}
          <em>not</em>{" "}apply to <strong>inline</strong>{" "}boxes —{" "}
          <code>span</code>, <code>a</code>, and text-level tags from{" "}
          <SectionLink to="1.3.1" />. An inline element sizes to its content
          and sits in the line; assigning <code>width: 150px</code>{" "}is
          ignored. The CSS <code>display</code>{" "}property overrides the
          tag&apos;s default:
        </p>
        <ul>
          <li>
            <code>display: inline</code>{" "}— stay in the line;{" "}
            <code>width</code>/<code>height</code>{" "}are ignored
          </li>
          <li>
            <code>display: block</code>{" "}— start a new line; honor{" "}
            <code>width</code>/<code>height</code>{" "}and stretch to the parent
            by default
          </li>
          <li>
            <code>display: inline-block</code>{" "}— sit in the line{" "}
            <em>and</em>{" "}honor <code>width</code>/<code>height</code>{" "}—
            the usual choice when you want a box that still flows like a word
          </li>
        </ul>
        <p>
          Add display classes and a <code>Display.tsx</code>{" "}that applies all
          three to <code>span</code>{" "}tags (which default to inline) so the
          only difference is the <code>display</code>{" "}value. Each span also
          sets <code>width: 150px</code>{" "}and <code>height: 50px</code>{" "}—
          watch which ones obey:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-display-inline {
  display: inline;
  width: 150px;
  height: 50px;
  padding: 5px;
}
.wd-display-inline-block {
  display: inline-block;
  width: 150px;
  height: 50px;
  padding: 5px;
}
.wd-display-block {
  display: block;
  width: 150px;
  height: 50px;
  padding: 5px;
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Display"
          file="app/labs/lab2/Display.tsx"
        >{`export default function Display() {
  return (
    <div id="wd-css-display">
      <h2>Display</h2>
      <h3>Inline</h3>
      <div>
        <span className="wd-display-inline wd-bg-color-red">Inline 1</span>
        <span className="wd-display-inline wd-bg-color-yellow">Inline 2</span>
        <span className="wd-display-inline wd-bg-color-blue wd-fg-color-white">
          Inline 3
        </span>
      </div>
      <h3>Inline-block</h3>
      <div>
        <span className="wd-display-inline-block wd-bg-color-red">
          Inline-block 1
        </span>
        <span className="wd-display-inline-block wd-bg-color-yellow">
          Inline-block 2
        </span>
        <span className="wd-display-inline-block wd-bg-color-blue wd-fg-color-white">
          Inline-block 3
        </span>
      </div>
      <h3>Block</h3>
      <div>
        <span className="wd-display-block wd-bg-color-red">Block 1</span>
        <span className="wd-display-block wd-bg-color-yellow">Block 2</span>
        <span className="wd-display-block wd-bg-color-blue wd-fg-color-white">
          Block 3
        </span>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The first row stays a single line of text-sized chips — 150px was
          ignored. The second row still shares a line, but each chip is a
          150×50 box. The third row stacks, one per line:
        </p>
        <LiveDemo mode="styled" name="Display" file="app/labs/lab2/Display.tsx">
          <Display />
        </LiveDemo>
      
        <OnYourOwn>
          In <code>Dimensions.tsx</code>, add one
          more element with an explicit width and height from{" "}
          <code>index.css</code>{" "}and confirm it keeps that size even when its
          text is short or long. In <code>Display.tsx</code>, force a{" "}
          <code>div</code>{" "}to <code>display: inline</code>{" "}and confirm its{" "}
          <code>width</code>{" "}stops applying.
        </OnYourOwn>
        <WithAI
          prompt={`Keep my personal extra dimension box and my inline div experiment unchanged. In app/labs/lab2/Dimensions.tsx, after the portrait/landscape/square samples, add a sample box with id wd-ai-dimension using a new class in app/labs/lab2/index.css (width 120px, height 60px, yellow background) whose text is a long sentence so the declared size is obvious. In app/labs/lab2/Display.tsx, after the block row, add a sample div with id wd-ai-display that uses wd-display-inline plus a background class. Do not overwrite my personal elements.`}
        >
          Paste this prompt to add another sized box and an inline sample div —
          then confirm the long text still fits the declared size and the div
          width is ignored:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-13"
        title="2.1.13 Styling an HTML Tag's Relative Position with CSS"
      >
        <p>
          The CSS <code>position</code>{" "}property overrides where an element
          would normally sit. Setting it to <code>relative</code>{" "}nudges the
          element away from its default spot — using{" "}
          <code>top</code>, <code>bottom</code>, <code>left</code>, and{" "}
          <code>right</code>{" "}to say how far — while leaving a
          &quot;ghost&quot; of its original space behind, so surrounding
          elements do not shift to fill the gap:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-pos-relative-nudge-up-right {
  position: relative;
  bottom: 30px;
  left: 30px;
}
.wd-pos-relative-nudge-down-right {
  position: relative;
  top: 20px;
  left: 20px;
}
.wd-pos-relative {
  position: relative;
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Positions"
          file="app/labs/lab2/Positions.tsx"
        >{`export default function Positions() {
  return (
    <div id="wd-css-positions">
      <div id="wd-css-position-relative">
        <h2>Relative</h2>
        <div className="wd-bg-color-gray">
          <div className="wd-bg-color-yellow wd-dimension-portrait">
            <div className="wd-pos-relative-nudge-down-right">Portrait</div>
          </div>
          <div className="wd-pos-relative-nudge-up-right wd-bg-color-blue wd-fg-color-white wd-dimension-landscape">
            Landscape
          </div>
          <div className="wd-bg-color-red wd-dimension-square">Square</div>
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The &quot;Portrait&quot; label drifts down and right inside its own
          yellow box, and the landscape box drifts up and right — both
          nudged away from where they would otherwise sit, without the gray
          container or the red square reflowing around them:
        </p>
        <LiveDemo mode="styled" name="Positions (relative)" file="app/labs/lab2/Positions.tsx">
          <PositionRelative />
        </LiveDemo>
      
        <OnYourOwn>
          In <code>Positions.tsx</code>, add another
          relatively positioned box that nudges itself with{" "}
          <code>top</code>/<code>left</code>{" "}(or <code>right</code>/<code>bottom</code>)
          so it clearly leaves its normal spot in the flow.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/Positions.tsx and app/labs/lab2/index.css, keep my personal relatively positioned box unchanged. In the relative-position demo, after the sample portrait/landscape/square boxes, add a sample box with id wd-ai-relative using a new class .wd-ai-pos-relative-nudge (position: relative; top: 15px; right: 25px) plus a background and dimension class so the nudge is obvious.`}
        >
          Paste this prompt to add a second sample nudge — then confirm the new
          box leaves its normal spot while neighbors do not reflow:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-14"
        title="2.1.14 Styling a Tag's Absolute Position with CSS"
      >
        <p>
          Setting <code>position</code>{" "}to <code>absolute</code>{" "}removes
          the element from the normal flow entirely and positions it
          relative to its nearest ancestor whose own position is{" "}
          <code>relative</code>, <code>absolute</code>, or{" "}
          <code>fixed</code>{" "}— falling back to the page itself if no such
          ancestor exists. Wrap three absolutely positioned boxes in a{" "}
          <code>relative</code>{" "}container so they anchor to it instead of
          the whole page:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-pos-absolute-10-10 {
  position: absolute;
  top: 10px;
  left: 10px;
}
.wd-pos-absolute-50-50 {
  position: absolute;
  top: 50px;
  left: 50px;
}
.wd-pos-absolute-120-20 {
  position: absolute;
  top: 20px;
  left: 120px;
}`}</CodeBlock>
        <p>
          Paste the TSX below inside <code>#wd-css-positions</code>, after the
          previous section.
        </p>
        <CodeBlock
          language="tsx"
          name="Positions"
          file="app/labs/lab2/Positions.tsx"
        >{`<div id="wd-css-position-absolute">
  <h2>Absolute position</h2>
  <div className="wd-pos-relative" style={{ height: 150 }}>
    <div className="wd-pos-absolute-10-10 wd-bg-color-yellow wd-dimension-portrait">
      Portrait
    </div>
    <div className="wd-pos-absolute-50-50 wd-bg-color-blue wd-fg-color-white wd-dimension-landscape">
      Landscape
    </div>
    <div className="wd-pos-absolute-120-20 wd-bg-color-red wd-dimension-square">
      Square
    </div>
  </div>
</div>`}</CodeBlock>
        <p>
          The three boxes stack on top of one another, each offset from the
          top-left corner of the shared relative container by its own{" "}
          <code>top</code>/<code>left</code>{" "}pair — proof that
          &quot;absolute&quot; means relative to an ancestor, not to some
          fixed point on the screen:
        </p>
        <LiveDemo mode="styled" name="Positions (absolute)" file="app/labs/lab2/Positions.tsx">
          <PositionAbsolute />
        </LiveDemo>
      
        <OnYourOwn>
          Still in <code>Positions.tsx</code>, place
          one more absolutely positioned element inside a{" "}
          <code>position: relative</code>{" "}parent and offset it to a different corner
          than the demo already shows.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/Positions.tsx and app/labs/lab2/index.css, keep my personal absolute-positioned element unchanged. In the absolute-position demo, add a sample box with id wd-ai-absolute using a new class .wd-ai-pos-absolute-br (position: absolute; right: 10px; bottom: 10px) plus a background and dimension class, inside the existing position: relative parent. Offset it to the bottom-right corner the demo does not already show.`}
        >
          Paste this prompt to pin a second sample box to another corner — then
          confirm it sits bottom-right of the relative parent:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-15"
        title="2.1.15 Styling an HTML Tag's Fixed Position with CSS"
      >
        <p>
          Setting <code>position</code>{" "}to <code>fixed</code>{" "}anchors an
          element to the browser&apos;s <strong>viewport</strong>{" "}instead of
          any ancestor, so it stays put even while the rest of the page
          scrolls. Add one fixed box to the bottom-right of the demo:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-pos-fixed {
  position: fixed;
  right: 0px;
  bottom: 50%;
}`}</CodeBlock>
        <p>
          Paste the TSX below inside <code>#wd-css-positions</code>, after the
          previous section.
        </p>
        <CodeBlock
          language="tsx"
          name="Positions"
          file="app/labs/lab2/Positions.tsx"
        >{`<div id="wd-css-position-fixed">
  <h2>Fixed position</h2>
  Checkout the blue square that says "Fixed position" stuck all the way
  on the right and half way down the page. It doesn't scroll with the
  rest of the page. Its position is "Fixed".
  <div className="wd-pos-fixed wd-dimension-square wd-bg-color-blue wd-fg-color-white">
    Fixed position
  </div>
</div>`}</CodeBlock>
        <p>
          Combined into one <code>Positions.tsx</code>{" "}component, the relative,
          absolute, and fixed demos all render together — scroll this figure
          and the blue &quot;Fixed position&quot; square stays glued to the
          right edge instead of scrolling away with the rest of the content:
        </p>
        <LiveDemo mode="styled" name="Positions" file="app/labs/lab2/Positions.tsx">
          <ContainFixed height={200}>
            <PositionFixed />
          </ContainFixed>
        </LiveDemo>
        <p className="text-sm text-neutral-500">
          This figure box wraps the demo so the fixed square stays inside it
          for the screenshot — in the real Lab 2 page it anchors to the
          browser window itself, exactly as <code>position: fixed</code>{" "}
          intends.
        </p>
      
        <OnYourOwn>
          In <code>Positions.tsx</code>, add a small
          fixed-position badge (corner of the viewport) with its own background
          color, then scroll the page to confirm it stays put.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/Positions.tsx and app/labs/lab2/index.css, keep my personal fixed badge unchanged. After the sample wd-pos-fixed square, add a small sample badge with id wd-ai-fixed using a new class .wd-ai-pos-fixed (position: fixed; left: 0; bottom: 0) plus a distinct background and white text saying "AI fixed". Do not replace the existing blue square.`}
        >
          Paste this prompt to add a second sample fixed badge — then scroll Lab
          2 and confirm both badges stay put:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-16"
        title="2.1.16 Styling an HTML Tag's Z Index with CSS"
      >
        <p>
          Once elements are positioned with <code>relative</code>,{" "}
          <code>absolute</code>, or <code>fixed</code>, they can end up
          overlapping. By default, later elements in the HTML render on top
          of earlier ones. The <code>z-index</code>{" "}property overrides that
          default stacking order directly — a higher{" "}
          <code>z-index</code>{" "}always renders above a lower one, regardless
          of source order:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-zindex-bring-to-front {
  z-index: 10;
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Zindex"
          file="app/labs/lab2/Zindex.tsx"
        >{`export default function Zindex() {
  return (
    <div id="wd-z-index">
      <h2>Z index</h2>
      <div className="wd-pos-relative" style={{ height: 150 }}>
        <div className="wd-pos-absolute-10-10 wd-bg-color-yellow wd-dimension-portrait">
          Portrait
        </div>
        <div className="wd-zindex-bring-to-front wd-pos-absolute-50-50 wd-dimension-landscape wd-bg-color-blue wd-fg-color-white">
          Landscape
        </div>
        <div className="wd-pos-absolute-120-20 wd-bg-color-red wd-dimension-square">
          Square
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The blue landscape box is declared before the red square in the
          markup, yet it renders above it, because{" "}
          <code>wd-zindex-bring-to-front</code>{" "}gives it a higher stacking
          order than the default:
        </p>
        <LiveDemo mode="styled" name="Zindex" file="app/labs/lab2/Zindex.tsx">
          <Zindex />
        </LiveDemo>
      
        <OnYourOwn>
          In <code>Zindex.tsx</code>, add a fourth
          overlapping box and assign <code>z-index</code>{" "}values so your new box
          sits above or below the existing stack on purpose.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/Zindex.tsx and app/labs/lab2/index.css, keep my personal fourth overlapping box unchanged. After the sample portrait/landscape/square stack, add a sample box with id wd-ai-zindex using a new class .wd-ai-zindex-top (z-index: 20; position: absolute; top: 80px; left: 80px) plus a background and dimension class so it sits above the existing stack. Do not change my personal z-index values.`}
        >
          Paste this prompt to add another overlapping sample — then confirm it
          stacks above the existing boxes:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-17"
        title="2.1.17 Floating Images and Content with CSS"
      >
        <p>
          The <code>float</code>{" "}property pulls an element to the left or
          right edge of its container and lets adjacent inline content wrap
          around it — the classic technique for flowing paragraphs of text
          around an image. Because floated elements leave the normal flow, a
          following element with <code>clear: both</code>{" "}is needed to stop
          the wrapping and resume normal stacking:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-float-left {
  float: left;
  height: 100px;
}
.wd-float-right {
  float: right;
  height: 100px;
}
img.wd-float-left,
img.wd-float-right {
  width: auto;
  max-width: 35%;
}
img.wd-float-left {
  margin: 0 1rem 0.5rem 0;
}
img.wd-float-right {
  margin: 0 0 0.5rem 1rem;
}
.wd-float-done {
  clear: both;
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Float"
          file="app/labs/lab2/Float.tsx"
        >{`export default function Float() {
  return (
    <div id="wd-float-divs">
      <h2>Float</h2>
      <div>
        <img className="wd-float-right" src={STARSHIP} alt="Starship" />
        {LOREM} {LOREM}
        <img className="wd-float-left" src={STARSHIP} alt="Starship" />
        {LOREM} {LOREM}
        <div className="wd-float-done" />
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Swap in some{" "}
          <a href="https://www.lipsum.com" target="_blank" rel="noreferrer">
            lorem ipsum
          </a>{" "}
          placeholder text for <code>LOREM</code>{" "}and any image URL for{" "}
          <code>STARSHIP</code>. Keep the images small with{" "}
          <code>height: 100px</code>{" "}(and a modest <code>max-width</code>) so
          the paragraph text has room to wrap beside them instead of stacking
          under a full-width image. The same{" "}
          <code>wd-float-left</code>{" "}and <code>wd-float-right</code>{" "}
          classes also arrange plain colored boxes side by side, which is how
          the next section builds a grid out of nothing but float:
        </p>
        <LiveDemo mode="styled" name="Float" file="app/labs/lab2/Float.tsx">
          <Float />
        </LiveDemo>
      
        <OnYourOwn>
          In <code>Float.tsx</code>, float one more
          image (or colored box) the opposite direction from your first float, wrap
          text around it, and end the wrap with a{" "}
          <code>clear: both</code>{" "}element.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/Float.tsx, keep my personal extra float and its clear unchanged. After the sample left/right image floats, add a sample colored box with id wd-ai-float, class wd-float-right plus a background class, a short lorem paragraph wrapping around it, and a wd-float-done clearer after. Not my personal image.`}
        >
          Paste this prompt to add a second sample float — then confirm text
          wraps and the clearer stops the wrap:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-18"
        title="2.1.18 Laying Out Content in a Grid Using CSS"
      >
        <p>
          Combine <code>float: left</code>{" "}with percentage widths and you can
          arrange any number of columns side by side — a half-and-half split,
          a sidebar-and-main-content layout, or anything in between. Each row
          needs a wrapper with <code>clear: both</code>{" "}so the next row
          starts fresh below the previous one instead of floating up beside
          it:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-grid-row {
  clear: both;
}
.wd-grid-col-half-page { width: 50%; float: left; }
.wd-grid-col-third-page { width: 33%; float: left; }
.wd-grid-col-two-thirds-page { width: 67%; float: left; }
.wd-grid-col-left-sidebar { width: 20%; float: left; }
.wd-grid-col-main-content { width: 60%; float: left; }
.wd-grid-col-right-sidebar { width: 20%; float: left; }`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="GridLayout"
          file="app/labs/lab2/GridLayout.tsx"
        >{`export default function GridLayout() {
  return (
    <div id="wd-css-grid-layout">
      <div className="wd-grid-row">
        <div className="wd-grid-col-half-page wd-bg-color-yellow">
          <h3>Left half</h3>
        </div>
        <div className="wd-grid-col-half-page wd-bg-color-blue wd-fg-color-white">
          <h3>Right half</h3>
        </div>
      </div>
      <div className="wd-grid-row">
        <div className="wd-grid-col-left-sidebar wd-bg-color-yellow">
          <h3>Side bar</h3>
        </div>
        <div className="wd-grid-col-main-content wd-bg-color-blue wd-fg-color-white">
          <h3>Main content</h3>
        </div>
        <div className="wd-grid-col-right-sidebar wd-bg-color-green wd-fg-color-white">
          <h3>Side bar</h3>
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The first row splits evenly in two; the second row arranges a
          narrow sidebar, wide main content, and a second sidebar across the
          same width — the whole layout built from nothing more than{" "}
          <code>float</code>{" "}and percentage widths, no dedicated layout
          property required yet:
        </p>
        <LiveDemo mode="styled" name="GridLayout" file="app/labs/lab2/GridLayout.tsx">
          <GridLayout />
        </LiveDemo>
      
        <OnYourOwn>
          In <code>GridLayout.tsx</code>, add another{" "}
          <code>wd-grid-row</code>{" "}that uses a layout you have not built yet — for
          example a one-third / two-thirds split with your float column classes.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/GridLayout.tsx, keep my personal extra grid row unchanged. After the sample half/half and sidebar/main/sidebar rows, add one more sample wd-grid-row with id wd-ai-grid that uses wd-grid-col-third-page and wd-grid-col-two-thirds-page plus background classes. Do not overwrite my personal row.`}
        >
          Paste this prompt to add a 1/3–2/3 sample row — then confirm it sits
          on its own line below the existing rows:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-19"
        title="2.1.19 Laying Out Content with CSS Flex"
      >
        <p>
          <strong>Flexbox</strong>{" "}(<code>display: flex</code>) is a
          purpose-built alternative to float-based layout. Declaring a
          container&apos;s <code>display</code>{" "}as <code>flex</code>{" "}and its{" "}
          <code>flex-direction</code>{" "}as <code>row</code>{" "}immediately lines
          up its children horizontally — no floats, no clearing, no
          percentage math:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-flex-row-container {
  display: flex;
  flex-direction: row;
}
.wd-flex-row-container > div {
  height: 100px;
  padding: 10px;
  white-space: nowrap;
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Flex"
          file="app/labs/lab2/Flex.tsx"
        >{`export default function Flex() {
  return (
    <div id="wd-css-flex">
      <h2>Flex</h2>
      <div className="wd-flex-row-container">
        <div className="wd-bg-color-yellow">Column 1</div>
        <div className="wd-bg-color-blue wd-fg-color-white">Column 2</div>
        <div className="wd-bg-color-red wd-fg-color-white">Column 3</div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Three divs that would normally stack vertically instead sit in a
          single row. A shared rule gives each child a 100px height and a bit
          of padding; blue and red use <code>wd-fg-color-white</code>{" "}so
          their labels stay readable:
        </p>
        <LiveDemo mode="styled" name="Flex (row)" file="app/labs/lab2/Flex.tsx">
          <FlexRow />
        </LiveDemo>
        <p>
          Flex children can also grow to absorb leftover space. Add{" "}
          <code>flex-grow: 1</code>{" "}to the last column so it stretches to
          fill whatever room the other two do not use:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-flex-grow-1 {
  flex-grow: 1;
}`}</CodeBlock>
        <p>
          Apply <code>wd-flex-grow-1</code>{" "}to Column 3 in{" "}
          <code>Flex.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Flex"
          file="app/labs/lab2/Flex.tsx"
        >{`export default function Flex() {
  return (
    <div id="wd-css-flex">
      <h2>Flex</h2>
      <div className="wd-flex-row-container">
        <div className="wd-bg-color-yellow">Column 1</div>
        <div className="wd-bg-color-blue wd-fg-color-white">Column 2</div>
        <div className="wd-bg-color-red wd-fg-color-white wd-flex-grow-1">
          Column 3
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The third column now expands to consume all the remaining width in
          the row, while the first two stay exactly as wide as their text:
        </p>
        <LiveDemo mode="styled" name="Flex (grow)" file="app/labs/lab2/Flex.tsx">
          <FlexGrow />
        </LiveDemo>
        <p>
          Finally, pin the first column to a fixed width so it neither
          shrinks nor grows, letting the third column absorb whatever space
          is left after that fixed column and the second column&apos;s
          natural width are accounted for:
        </p>
        <CodeBlock
          language="css"
          name="Lab2 styles"
          file="app/labs/lab2/index.css"
        >{`.wd-width-75px {
  /* Room for "Column 1" + 10px padding under border-box */
  width: 110px;
  flex-shrink: 0;
}`}</CodeBlock>
        <p>
          Apply <code>wd-width-75px</code>{" "}to Column 1 and keep{" "}
          <code>wd-flex-grow-1</code>{" "}on Column 3:
        </p>
        <CodeBlock
          language="tsx"
          name="Flex"
          file="app/labs/lab2/Flex.tsx"
        >{`export default function Flex() {
  return (
    <div id="wd-css-flex">
      <h2>Flex</h2>
      <div className="wd-flex-row-container">
        <div className="wd-bg-color-yellow wd-width-75px">Column 1</div>
        <div className="wd-bg-color-blue wd-fg-color-white">Column 2</div>
        <div className="wd-bg-color-red wd-fg-color-white wd-flex-grow-1">
          Column 3
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <LiveDemo mode="styled" name="Flex" file="app/labs/lab2/Flex.tsx">
          <FlexWidth />
        </LiveDemo>
      
        <OnYourOwn>
          In <code>Flex.tsx</code>, add a fourth
          flex row where one child uses <code>flex-grow</code>{" "}and another has a
          fixed width, then confirm which columns stretch and which stay pinned.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/Flex.tsx, keep my personal fourth flex row unchanged. After the sample rows, add one more sample flex row with id wd-ai-flex: three children, the first with wd-width-75px, the last with wd-flex-grow-1, and background classes so it is obvious which column stretches. Do not overwrite my personal row.`}
        >
          Paste this prompt to add another sample grow/pin row — then confirm
          which column stretches and which stays pinned:
        </WithAI>
      </Section>

      <Section level={3} id="sec-2-1-20" title="2.1.20 Media Queries">
        <p>
          <strong>Media queries</strong>{" "}apply a block of CSS rules only when
          the browser matches a condition — most commonly a viewport width
          range — which is the foundation of <strong>responsive
          design</strong>: the same markup rendering differently on a phone,
          a tablet, and a desktop. Give this demo its own CSS file, since the
          rules only make sense together as a set:
        </p>
        <CodeBlock
          language="css"
          name="MediaQueriesDemo styles"
          file="app/labs/lab2/MediaQueriesDemo.css"
        >{`.wd-media-queries-demo {
  background-color: green;
  color: white;
  padding: 1rem;
}

.wd-media-queries-demo li {
  opacity: 0.55;
  font-weight: normal;
  text-decoration: none;
}

.wd-media-queries-demo li.wd-mq-rule-default {
  opacity: 1;
  font-weight: bold;
  text-decoration: underline;
}

@media (min-width: 750px) and (max-width: 1000px) {
  .wd-media-queries-demo {
    background-color: yellow;
    color: black;
  }
  /* Same specificity as the default highlight — must clear it here */
  .wd-media-queries-demo li.wd-mq-rule-default {
    opacity: 0.55;
    font-weight: normal;
    text-decoration: none;
  }
  .wd-media-queries-demo li.wd-mq-rule-750 {
    opacity: 1;
    font-weight: bold;
    text-decoration: underline;
  }
}

@media (min-width: 1000px) and (max-width: 1250px) {
  .wd-media-queries-demo {
    background-color: blue;
    color: white;
  }
  .wd-media-queries-demo li.wd-mq-rule-default {
    opacity: 0.55;
    font-weight: normal;
    text-decoration: none;
  }
  .wd-media-queries-demo li.wd-mq-rule-1000 {
    opacity: 1;
    font-weight: bold;
    text-decoration: underline;
  }
}

@media (min-width: 1250px) {
  .wd-media-queries-demo {
    background-color: red;
    color: white;
  }
  .wd-media-queries-demo li.wd-mq-rule-default {
    opacity: 0.55;
    font-weight: normal;
    text-decoration: none;
  }
  .wd-media-queries-demo li.wd-mq-rule-1250 {
    opacity: 1;
    font-weight: bold;
    text-decoration: underline;
  }
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="MediaQueriesDemo"
          file="app/labs/lab2/MediaQueriesDemo.tsx"
        >{`import "./MediaQueriesDemo.css";

export default function MediaQueriesDemo() {
  return (
    <div className="wd-media-queries-demo">
      <h1>Media Query Demo</h1>
      <p>
        This demo uses CSS media queries to change colors based on screen width:
      </p>
      <ul>
        <li className="wd-mq-rule-default">
          Default is White text on Green background
        </li>
        <li className="wd-mq-rule-750">
          750px to 1000px: Black text on Yellow background
        </li>
        <li className="wd-mq-rule-1000">
          1000px to 1250px: White text on Blue background
        </li>
        <li className="wd-mq-rule-1250">
          Above 1250px: White text on Red background
        </li>
      </ul>
    </div>
  );
}`}</CodeBlock>
        <p>
          Notice that only the last <code>@media</code>{" "}block has no{" "}
          <code>max-width</code>, so it matches every width from 1250px
          upward. The matching bullet is bold and underlined so you can see
          which rule is active. Resize the browser window to watch the
          background — and the highlighted bullet — cycle through green,
          yellow, blue, and red:
        </p>
        <LiveDemo mode="styled" name="MediaQueriesDemo" file="app/labs/lab2/MediaQueriesDemo.tsx">
          <MediaQueriesDemo />
        </LiveDemo>
      
        <OnYourOwn>
          In <code>MediaQueriesDemo.css</code>, add
          one more <code>@media</code>{" "}breakpoint (or change an existing
          background) and update the checklist in{" "}
          <code>MediaQueriesDemo.tsx</code>{" "}so resizing the window still matches
          what the list promises.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/MediaQueriesDemo.css and app/labs/lab2/MediaQueriesDemo.tsx, keep my personal extra breakpoint (or background change) unchanged. Add a sample @media (max-width: 749px) that sets .wd-media-queries-demo to a purple background and white text, plus a matching checklist li with class wd-mq-rule-ai. Highlight that bullet the same way the other range bullets are highlighted. Do not remove existing breakpoints.`}
        >
          Paste this prompt to add one extra sample breakpoint — then resize the
          window and confirm the new bullet matches the color you see:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-2-1-21"
        title="2.1.21 Check Your Understanding"
      >
        <p>
          Before React Icons and Tailwind, pause and test the CSS topics
          from this section. The practice quiz draws 10 items — concepts
          (why the{" "}
          <code>style</code>{" "}attribute is a bad habit, padding vs margin, the
          box model, block vs inline), syntax (hyphens vs camelCase,{" "}
          <code>#</code> vs <code>.</code>, <code>box-sizing</code>,{" "}
          <code>display</code>), button types (
          <SectionLink to="1.3.6.7" />), acronyms, snippets, fill-in-the-blank,
          and short puzzles. It is a self-check, not part of your course
          grade. Misses link back to the subsection you should reread; each
          new attempt draws a different 10.
        </p>
        <PracticeCard quizId="2.1" />
      </Section>
    </>
  );
}
