// Tailwind utility classes (bg-red-500, grid-cols-4, md:flex, blur-lg, …) are
// already available book-wide via app/book/book.css, which imports only the
// `theme` + `utilities` layers (no `preflight`) so it never resets default
// HTML rendering the way the full `tailwindcss` import in
// app/labs/lab2/tailwind/index.css does — importing that here would leak
// Tailwind's CSS reset into this chapter's own prose.
import Section from "../../components/Section";
import BookSectionSlidesLink from "../../components/BookSectionSlidesLink";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import LocalUrl from "../../components/LocalUrl";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import NestedExerciseList from "../../components/NestedExerciseList";
import { CH2_LAB_EXERCISES } from "../../exercise-lists/catalogs";
import ReactIconsSampler from "@/app/labs/lab2/intermediates/2-2-ReactIconsSampler";
import TailwindSpacing from "@/app/labs/lab2/tailwind/TailwindSpacing";
import TailwindTypography from "@/app/labs/lab2/tailwind/TailwindTypography";
import TailwindBackgroundColors from "@/app/labs/lab2/tailwind/TailwindBackgroundColors";
import ResponsivePreview from "../../components/ResponsivePreview";
import {
  TAILWIND_BREAKPOINT_PREVIEW_FRAMES,
  TAILWIND_FLEX_PREVIEW_FRAMES,
  TAILWIND_GRID_PREVIEW_FRAMES,
  TAILWIND_RESPONSIVE_BREAKPOINT_PREVIEW_SRC,
  TAILWIND_RESPONSIVE_FLEX_PREVIEW_SRC,
  TAILWIND_RESPONSIVE_GRID_PREVIEW_SRC,
  TAILWIND_RESPONSIVE_PREVIEW_SRC,
  TAILWIND_RESPONSIVE_SHOW_HIDE_PREVIEW_SRC,
  TAILWIND_RESPONSIVE_SPACING_TEXT_PREVIEW_SRC,
  TAILWIND_SHOW_HIDE_PREVIEW_FRAMES,
  TAILWIND_SPACING_TEXT_PREVIEW_FRAMES,
} from "../../components/responsive-preview-model";
import TailwindFilters from "@/app/labs/lab2/tailwind/TailwindFilters";
import TailwindGrids from "@/app/labs/lab2/tailwind/TailwindGrids";

export default function IconsAndTailwind() {
  return (
    <>
      <Section id="sec-2-2" title="2.2 Decorating Documents with React Icons">
        <p>
          <strong>React Icons</strong>{" "}bundles thousands of icons from
          several popular icon families — Font Awesome, Heroicons, and more —
          and exposes each one as a plain React
          component. Install it from the project root:
        </p>
        <CodeBlock language="shell">{`npm install react-icons`}</CodeBlock>
        <p>
          Browse{" "}
          <a
            href="https://react-icons.github.io/react-icons"
            target="_blank"
            rel="noreferrer"
          >
            react-icons.github.io/react-icons
          </a>{" "}
          and search by keyword or icon family — each result page shows the
          import path and component name to copy. Try a handful from
          different families in one component:
        </p>
        <CodeBlock
          language="tsx"
          name="ReactIconsSampler"
          file="app/labs/lab2/ReactIconsSampler.tsx"
        >{`import "@/app/labs/lab2/tailwind/utilities.css";
import { FaCalendar, FaEnvelopeOpenText, FaRegClock } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaBookBible } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";

export default function ReactIconsSampler() {
  return (
    <div id="wd-react-icons-sampler" className="mb-4 font-sans">
      <h2 className="text-lg font-semibold">React Icons Sampler</h2>
      <div className="flex gap-3 text-3xl">
        <VscAccount />
        <AiOutlineDashboard />
        <FaBookBible />
        <FaCalendar />
        <FaEnvelopeOpenText />
        <FaRegClock />
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Six icons render inline, each imported from a different icon
          family through a different package path — <code>fa</code>,{" "}
          <code>ai</code>, <code>fa6</code>, and <code>vsc</code>{" "}each group
          icons by their source library. The parent uses{" "}
          <code>text-3xl</code>{" "}so each icon (sized in <code>em</code>)
          scales up; that utility comes from Tailwind, introduced properly
          in <SectionLink to="2.3" />. Icon components also accept ordinary{" "}
          <code>className</code>, <code>style</code>, and{" "}
          <code>size</code>{" "}props like any other element:
        </p>
        <LiveDemo mode="styled" name="ReactIconsSampler" file="app/labs/lab2/ReactIconsSampler.tsx">
          <ReactIconsSampler />
        </LiveDemo>
        <p>
          Import <code>ReactIconsSampler</code>{" "}into <code>Lab2</code>{" "}to
          keep it on the growing exercise page, then keep an eye out for
          icons that fit Kambaz screens later in <SectionLink to="2.4" /> — a dashboard icon for
          the Dashboard link, a calendar icon for Calendar, and so on.
        </p>
      
        <OnYourOwn>
          In <code>ReactIconsSampler.tsx</code>,
          import two more icons from families you have not used yet, give them a{" "}
          <code>className</code>{" "}for size or color, and keep them on the Lab 2
          page.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/ReactIconsSampler.tsx, keep my personal extra icons unchanged. After the sample six icons, import two more sample icons from families not already used in the file (for example md and hi2), render them with className for size or color (text-4xl text-blue-600), and keep them on the Lab 2 page. Not icons I already added.`}
        >
          Paste this prompt to add two more sample icons — then confirm yours
          are still there and the new ones come from different families:
        </WithAI>
      </Section>

      <Section
        id="sec-2-3"
        title="2.3 Styling Webpages with the Tailwind CSS Library"
      >
        <p>
          <strong>Tailwind CSS</strong>{" "}is a utility-first framework: instead
          of writing custom CSS rules, you compose a look directly in{" "}
          <code>className</code>{" "}out of small, single-purpose utility
          classes like <code>p-4</code>{" "}(padding) or{" "}
          <code>bg-red-500</code>{" "}(background color). <code>create-next-app</code>{" "}
          already installed and configured Tailwind when you scaffolded{" "}
          <code>webdev-client</code>{" "}in <ChapterLink to={1} /> — you simply commented out
          its import in <code>app/layout.tsx</code>{" "}so the HTML exercises
          could render with plain browser defaults.
        </p>
        <p>
          Rather than re-enabling Tailwind globally, scope it to a new{" "}
          <code>tailwind</code>{" "}sub-lab so only pages that opt in load it.
          Create a small CSS file that imports the library:
        </p>
        <CodeBlock
          language="css"
          name="Tailwind entry"
          file="app/labs/lab2/tailwind/index.css"
        >{`@import "tailwindcss";`}</CodeBlock>
        <p>
          Then create the page that imports that CSS file — and, because it
          is its own route under <code>app/labs/lab2/tailwind/</code>, its own
          separate URL from the rest of Lab 2:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindLab"
          file="app/labs/lab2/tailwind/page.tsx"
        >{`import "./index.css";

export default function TailwindLab() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Tailwind CSS</h1>
    </div>
  );
}`}</CodeBlock>
        <p>
          Link to <LocalUrl href="/labs/lab2/tailwind">/labs/lab2/tailwind</LocalUrl>{" "}from the main Lab 2 page so
          both are reachable from the Labs table of contents, then work
          through the utility categories below one component at a time.
        </p>

        <h3
          id="sec-2-3-1"
          className="scroll-mt-6 font-sans text-xl font-semibold"
        >
          2.3.1 Spacing{" "}
          <BookSectionSlidesLink sectionId="sec-2-3-1" />
        </h3>
        <p>
          Tailwind&apos;s spacing utilities follow a compact naming
          convention: classes starting with <code>m</code>{" "}set margin,
          classes starting with <code>p</code>{" "}set padding, and a number
          suffix (<code>-4</code>, <code>-8</code>, …) sets the amount on a
          consistent scale. Direction letters narrow which side: nothing for
          all sides, <code>s</code>/<code>e</code>{" "}for the logical start/end
          (left/right in English), <code>t</code>/<code>b</code>{" "}for
          top/bottom:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindSpacing"
          file="app/labs/lab2/tailwind/TailwindSpacing.tsx"
        >{`export default function TailwindSpacing() {
  return (
    <div>
      <h2 className="text-3xl">Margin</h2>
      <div className="bg-blue-200 mb-4 p-4">
        This div has a bottom margin of 4.
      </div>
      <div className="bg-blue-200 ms-4 me-8 p-4">
        This div has a start margin of 4 and an end margin of 8.
      </div>
      <h2 className="text-3xl mt-8">Padding</h2>
      <div className="bg-green-200 ps-2 pt-4 pb-8 mb-4">
        This div has starting padding of 2, top padding of 4, and bottom padding of 8.
      </div>
      <div className="bg-green-200 p-6">This div has padding all around of 6.</div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Each box&apos;s spacing changes with nothing but its class list —
          no separate stylesheet, no selector to name:
        </p>
        <LiveDemo mode="styled" name="TailwindSpacing" file="app/labs/lab2/tailwind/TailwindSpacing.tsx">
          <TailwindSpacing />
        </LiveDemo>
        <OnYourOwn>
          In <code>TailwindSpacing.tsx</code>, add
          one more box that mixes directional spacing utilities (for example{" "}
          <code>mt-*</code>, <code>ps-*</code>, <code>pb-*</code>) so margin and
          padding differences are obvious.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/tailwind/TailwindSpacing.tsx, keep my personal extra spacing box unchanged. After the sample margin and padding boxes, add one more sample box with id wd-ai-spacing that mixes mt-6 ps-8 pb-4 and a distinct background (bg-purple-200) so the directional spacing is obvious. Not my personal box.`}
        >
          Paste this prompt to add a second sample spacing mix — then confirm
          margin and padding differences are visible:
        </WithAI>

        <h3
          id="sec-2-3-2"
          className="scroll-mt-6 font-sans text-xl font-semibold"
        >
          2.3.2 Typography{" "}
          <BookSectionSlidesLink sectionId="sec-2-3-2" />
        </h3>
        <p>
          Typography utilities cover font size (<code>text-sm</code>{" "}through{" "}
          <code>text-3xl</code>) and weight (<code>font-thin</code>{" "}through{" "}
          <code>font-black</code>) with the same predictable naming:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindTypography"
          file="app/labs/lab2/tailwind/TailwindTypography.tsx"
        >{`export default function TailwindTypography() {
  return (
    <div>
      <h2 className="text-3xl">Font Size</h2>
      <p className="text-sm">This is small text.</p>
      <p className="text-base">This is base text.</p>
      <p className="text-lg">This is large text.</p>
      <p className="text-xl">This is extra large text.</p>
      <p className="text-2xl">This is 2x extra large text.</p>
      <p className="text-3xl">This is 3x extra large text.</p>
      <h2 className="text-3xl font-bold mt-4">Font Weight</h2>
      <p className="font-thin">This is thin font weight.</p>
      <p className="font-light">This is light font weight.</p>
      <p className="font-normal">This is normal font weight.</p>
      <p className="font-medium">This is medium font weight.</p>
      <p className="font-semibold">This is semi-bold font weight.</p>
      <p className="font-bold">This is bold font weight.</p>
      <p className="font-extrabold">This is extra-bold font weight.</p>
      <p className="font-black">This is black font weight.</p>
    </div>
  );
}`}</CodeBlock>
        <p>
          Font sizes step up visibly from <code>text-sm</code>{" "}to{" "}
          <code>text-3xl</code>, and weights step up from a barely-there{" "}
          <code>font-thin</code>{" "}to a heavy <code>font-black</code> — build
          the full component with every step listed in the code above to see
          the whole scale:
        </p>
        <LiveDemo mode="styled" name="TailwindTypography" file="app/labs/lab2/tailwind/TailwindTypography.tsx">
          <TailwindTypography />
        </LiveDemo>
        <OnYourOwn>
          In <code>TailwindTypography.tsx</code>,
          add a short personal line that pairs a size utility with a weight utility
          you have not used yet (for example <code>text-xl</code>{" "}plus{" "}
          <code>font-semibold</code>).
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/tailwind/TailwindTypography.tsx, keep my personal size-plus-weight line unchanged. After the sample size and weight paragraphs, add one more sample line with id wd-ai-type that pairs text-2xl with font-medium. Not a sentence about me.`}
        >
          Paste this prompt to add a second sample size/weight pair — then
          confirm your personal line is still there:
        </WithAI>

        <h3
          id="sec-2-3-3"
          className="scroll-mt-6 font-sans text-xl font-semibold"
        >
          2.3.3 Background Colors{" "}
          <BookSectionSlidesLink sectionId="sec-2-3-3" />
        </h3>
        <p>
          Background color utilities follow the pattern{" "}
          <code>bg-{"{color}"}-{"{shade}"}</code>, where the shade is a number
          from 50 (lightest) to 950 (darkest) in steps of 100. Pair a
          background with a contrasting text color so the content stays
          readable:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindBackgroundColors"
          file="app/labs/lab2/tailwind/TailwindBackgroundColors.tsx"
        >{`export default function TailwindBackgroundColors() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Background Colors</h2>
      <div className="bg-red-500 text-white p-4 mb-4">This div has a red background.</div>
      <div className="bg-green-500 text-white p-4 mb-4">This div has a green background.</div>
      <div className="bg-blue-500 text-white p-4 mb-4">This div has a blue background.</div>
      <div className="bg-yellow-500 text-black p-4 mb-4">This div has a yellow background.</div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Four bands of color render top to bottom — the same{" "}
          <code>-500</code>{" "}shade across red, green, and blue, but{" "}
          <code>yellow-500</code>{" "}is light enough that it needs black text
          instead of white to stay legible:
        </p>
        <LiveDemo mode="styled" name="TailwindBackgroundColors" file="app/labs/lab2/tailwind/TailwindBackgroundColors.tsx">
          <TailwindBackgroundColors />
        </LiveDemo>
        <OnYourOwn>
          In{" "}
          <code>TailwindBackgroundColors.tsx</code>, add another band that uses a
          different color and shade (not just <code>-500</code>) and pick a
          contrasting <code>text-*</code>{" "}class so the text stays legible.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/tailwind/TailwindBackgroundColors.tsx, keep my personal extra color band unchanged. After the sample red/green/blue/yellow -500 bands, add one more sample band with id wd-ai-bg that uses a non-500 shade (for example bg-indigo-700) and a contrasting text class (text-white) plus p-4 mb-4. Not my personal band.`}
        >
          Paste this prompt to add a second sample shade — then confirm the
          text stays legible on the new band:
        </WithAI>

        <h3
          id="sec-2-3-4"
          className="scroll-mt-6 font-sans text-xl font-semibold"
        >
          2.3.4 Responsive Design{" "}
          <BookSectionSlidesLink sectionId="sec-2-3-4" />
        </h3>
        <p>
          A <strong>responsive</strong>{" "}page changes as the viewport gets
          wider. A <strong>breakpoint</strong>{" "}is a width where the layout
          is allowed to change. Tailwind names the common widths and lets you
          prefix a class with one of them. The five components below each
          teach one prefix. The card at the end combines them. Each figure is
          its own page at a fixed width, so a prefix follows that frame, not
          the width of this column.
        </p>

        <h4
          id="sec-2-3-4-1"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          2.3.4.1 One breakpoint
        </h4>
        <p>
          Tailwind is <strong>mobile-first</strong>. An unprefixed class
          applies at every width. A prefixed class applies at that breakpoint
          and up. Widths are written in <strong>rem</strong>. 1rem is the
          root font size, usually 16px, so 48rem is 768px.{" "}
          <code>md:</code>{" "}starts at 48rem (768px). This box is{" "}
          <code>bg-red-500</code>{" "}at every width, and{" "}
          <code>md:bg-green-500</code>{" "}replaces the red from 768px up:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindResponsiveBreakpoint"
          file="app/labs/lab2/tailwind/TailwindResponsiveBreakpoint.tsx"
        >{`export default function TailwindResponsiveBreakpoint() {
  return (
    <div
      id="wd-tailwind-responsive-breakpoint"
      className="bg-red-500 md:bg-green-500 p-4 text-white"
    >
      Red below md, green at md and up.
    </div>
  );
}`}</CodeBlock>
        <p>
          The phone frame is 375px, below <code>md</code>, so the box stays
          red. The desktop frame is 1024px, drawn smaller so it fits this
          column, and the box is green:
        </p>
        <LiveDemo mode="styled" name="TailwindResponsiveBreakpoint" file="app/labs/lab2/tailwind/TailwindResponsiveBreakpoint.tsx">
          <ResponsivePreview
            src={TAILWIND_RESPONSIVE_BREAKPOINT_PREVIEW_SRC}
            frames={TAILWIND_BREAKPOINT_PREVIEW_FRAMES}
          />
        </LiveDemo>

        <h4
          id="sec-2-3-4-2"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          2.3.4.2 Show and hide by width
        </h4>
        <p>
          <code>hidden</code>{" "}removes an element (
          <code>display: none</code>) and <code>block</code>{" "}puts it back
          on the page. Prefix either one to tie visibility to a breakpoint.{" "}
          <code>block md:hidden</code>{" "}shows the &quot;small screen&quot;{" "}
          line until <code>md</code>, then hides it.{" "}
          <code>hidden md:block</code>{" "}keeps the &quot;large screen&quot;{" "}
          line hidden until <code>md</code>, then shows it. Only one line is
          visible at a time:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindResponsiveShowHide"
          file="app/labs/lab2/tailwind/TailwindResponsiveShowHide.tsx"
        >{`export default function TailwindResponsiveShowHide() {
  return (
    <div id="wd-tailwind-responsive-show-hide">
      <p className="block md:hidden bg-red-200 p-2">small screen</p>
      <p className="hidden md:block bg-green-200 p-2">large screen</p>
    </div>
  );
}`}</CodeBlock>
        <p>
          The phone frame shows the red line. The desktop frame shows the
          green line:
        </p>
        <LiveDemo mode="styled" name="TailwindResponsiveShowHide" file="app/labs/lab2/tailwind/TailwindResponsiveShowHide.tsx">
          <ResponsivePreview
            src={TAILWIND_RESPONSIVE_SHOW_HIDE_PREVIEW_SRC}
            frames={TAILWIND_SHOW_HIDE_PREVIEW_FRAMES}
          />
        </LiveDemo>

        <h4
          id="sec-2-3-4-3"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          2.3.4.3 Stack, then side by side
        </h4>
        <p>
          CSS flex lines boxes up along one direction.{" "}
          <code>flex-direction: column</code>{" "}stacks them, and{" "}
          <code>flex-direction: row</code>{" "}places them side by side.
          Tailwind writes those as <code>flex-col</code>{" "}and{" "}
          <code>flex-row</code>. Start with a column, then switch direction
          at <code>md</code>.{" "}
          <code>flex flex-col</code>{" "}stacks the three boxes at every
          width. <code>md:flex-row</code>{" "}lays them side by side from
          768px up. <code>gap-4</code>{" "}is the space between the boxes. It
          is unprefixed, so that space stays in both layouts:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindResponsiveFlex"
          file="app/labs/lab2/tailwind/TailwindResponsiveFlex.tsx"
        >{`export default function TailwindResponsiveFlex() {
  return (
    <div
      id="wd-tailwind-responsive-flex"
      className="flex flex-col md:flex-row gap-4"
    >
      <div className="bg-red-500 p-4 text-white">One</div>
      <div className="bg-green-500 p-4 text-white">Two</div>
      <div className="bg-blue-500 p-4 text-white">Three</div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The phone frame stacks One, Two, and Three. The desktop frame puts
          them in a row:
        </p>
        <LiveDemo mode="styled" name="TailwindResponsiveFlex" file="app/labs/lab2/tailwind/TailwindResponsiveFlex.tsx">
          <ResponsivePreview
            src={TAILWIND_RESPONSIVE_FLEX_PREVIEW_SRC}
            frames={TAILWIND_FLEX_PREVIEW_FRAMES}
          />
        </LiveDemo>

        <h4
          id="sec-2-3-4-4"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          2.3.4.4 Grid columns by breakpoint
        </h4>
        <p>
          <strong>CSS Grid</strong>{" "}places children into columns, with a
          gap between the cells. <code>grid</code>{" "}turns the grid on,{" "}
          <code>grid-cols-*</code>{" "}sets how many columns, and{" "}
          <code>gap-4</code>{" "}sets that gap.{" "}
          <SectionLink to="2.3.6" />{" "}goes further with grid utilities.
          Column count uses the same breakpoint prefixes, including ones
          narrower and wider than <code>md</code>. <code>sm:</code>{" "}and{" "}
          <code>lg:</code>{" "}are minimum widths: once a prefix applies, it
          keeps applying at larger widths until a later prefix overrides it.
        </p>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse border border-neutral-400 text-left text-sm">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border border-neutral-400 px-2 py-1">Prefix</th>
                <th className="border border-neutral-400 px-2 py-1">
                  Min width
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-neutral-400 px-2 py-1">
                  <code>sm:</code>
                </td>
                <td className="border border-neutral-400 px-2 py-1">
                  40rem (640px)
                </td>
              </tr>
              <tr>
                <td className="border border-neutral-400 px-2 py-1">
                  <code>md:</code>
                </td>
                <td className="border border-neutral-400 px-2 py-1">
                  48rem (768px)
                </td>
              </tr>
              <tr>
                <td className="border border-neutral-400 px-2 py-1">
                  <code>lg:</code>
                </td>
                <td className="border border-neutral-400 px-2 py-1">
                  64rem (1024px)
                </td>
              </tr>
              <tr>
                <td className="border border-neutral-400 px-2 py-1">
                  <code>xl:</code>
                </td>
                <td className="border border-neutral-400 px-2 py-1">
                  80rem (1280px)
                </td>
              </tr>
              <tr>
                <td className="border border-neutral-400 px-2 py-1">
                  <code>2xl:</code>
                </td>
                <td className="border border-neutral-400 px-2 py-1">
                  96rem (1536px)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Eight tiles use{" "}
          <code>grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4</code>.
          Below 640px there is one column. From 640px up to just under 1024px
          there are two, because <code>sm:</code>{" "}applies and{" "}
          <code>lg:</code>{" "}does not yet. From 1024px up there are four:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindResponsiveGrid"
          file="app/labs/lab2/tailwind/TailwindResponsiveGrid.tsx"
        >{`export default function TailwindResponsiveGrid() {
  return (
    <div
      id="wd-tailwind-responsive-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div className="text-center bg-blue-300 p-3">01</div>
      <div className="text-center bg-blue-300 p-3">02</div>
      <div className="text-center bg-blue-300 p-3">03</div>
      <div className="text-center bg-blue-300 p-3">04</div>
      <div className="text-center bg-blue-300 p-3">05</div>
      <div className="text-center bg-blue-300 p-3">06</div>
      <div className="text-center bg-blue-300 p-3">07</div>
      <div className="text-center bg-blue-300 p-3">08</div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The phone frame is below <code>sm</code>, so one column. The middle
          frame is 700px, which is past <code>sm</code>{" "}(640px) and short
          of <code>lg</code>{" "}(1024px), so two columns. The desktop frame
          is 1024px, which is <code>lg</code>, so four columns:
        </p>
        <LiveDemo mode="styled" name="TailwindResponsiveGrid" file="app/labs/lab2/tailwind/TailwindResponsiveGrid.tsx">
          <ResponsivePreview
            src={TAILWIND_RESPONSIVE_GRID_PREVIEW_SRC}
            frames={TAILWIND_GRID_PREVIEW_FRAMES}
          />
        </LiveDemo>

        <h4
          id="sec-2-3-4-5"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          2.3.4.5 Spacing and text size
        </h4>
        <p>
          Spacing and font size take the same prefixes. <code>p-2</code>{" "}
          and <code>text-base</code>{" "}apply at every width.{" "}
          <code>md:p-8</code>{" "}and <code>md:text-2xl</code>{" "}increase the
          padding and the type from 768px up. Both the heading and the
          paragraph use that pair:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindResponsiveSpacingText"
          file="app/labs/lab2/tailwind/TailwindResponsiveSpacingText.tsx"
        >{`export default function TailwindResponsiveSpacingText() {
  return (
    <div id="wd-tailwind-responsive-spacing-text">
      <h2 className="bg-yellow-200 p-2 text-base md:p-8 md:text-2xl">
        Spacing and text size
      </h2>
      <p className="bg-yellow-100 p-2 text-base md:p-8 md:text-2xl">
        Padding and the font size grow at md.
      </p>
    </div>
  );
}`}</CodeBlock>
        <p>
          These frames stay at their real size, so <code>text-2xl</code>{" "}
          on the desktop frame is actually larger than <code>text-base</code>{" "}
          on the phone. Scroll the desktop frame sideways if it runs past
          the column:
        </p>
        <LiveDemo mode="styled" name="TailwindResponsiveSpacingText" file="app/labs/lab2/tailwind/TailwindResponsiveSpacingText.tsx">
          <ResponsivePreview
            src={TAILWIND_RESPONSIVE_SPACING_TEXT_PREVIEW_SRC}
            frames={TAILWIND_SPACING_TEXT_PREVIEW_FRAMES}
            fit="natural"
          />
        </LiveDemo>

        <h4
          id="sec-2-3-4-6"
          className="scroll-mt-6 font-sans text-lg font-semibold"
        >
          2.3.4.6 A responsive card
        </h4>
        <p>
          Save an image of the React logo to{" "}
          <code>public/images/reactjs.jpg</code>{" "}(already available from{" "}
          <ChapterLink to={1} />&apos;s Kambaz Dashboard exercise). This card
          combines the ideas above: an unprefixed layout that changes at{" "}
          <code>md</code>, including a stack that becomes a row. It also uses
          breakpoint utilities the small demos did not.{" "}
          <code>md:max-w-2xl</code>{" "}widens the card. <code>md:flex</code>{" "}
          turns the row on without a <code>flex-col</code>{" "}first. On the
          image, <code>md:w-48</code>{" "}sets a fixed width of 12rem,{" "}
          <code>md:shrink-0</code>{" "}stops flex from shrinking that width,{" "}
          <code>md:h-full</code>{" "}fills the card&apos;s height, and{" "}
          <code>md:min-h-56</code>{" "}keeps a minimum height of 14rem.{" "}
          <code>object-cover</code>{" "}crops the picture so it fills that box
          without stretching:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindResponsiveDesign"
          file="app/labs/lab2/tailwind/TailwindResponsiveDesign.tsx"
        >{`export default function TailwindResponsiveDesign() {
  return (
    <div className="font-sans">
      <h2 className="text-3xl font-bold mb-4">Responsive Design</h2>
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
        <div className="md:flex">
          <div className="relative md:w-48 md:shrink-0">
            <img
              className="h-56 w-full object-cover md:h-full md:min-h-56 md:w-48"
              src="/images/reactjs.jpg"
              alt="React JS"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <svg
                viewBox="0 0 24 24"
                className="h-24 w-24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="2.05" fill="currentColor" />
                <g fill="none" stroke="currentColor" strokeWidth="1">
                  <ellipse cx="12" cy="12" rx="10" ry="4.2" />
                  <ellipse
                    cx="12"
                    cy="12"
                    rx="10"
                    ry="4.2"
                    transform="rotate(60 12 12)"
                  />
                  <ellipse
                    cx="12"
                    cy="12"
                    rx="10"
                    ry="4.2"
                    transform="rotate(120 12 12)"
                  />
                </g>
              </svg>
              <div className="mt-2 text-2xl font-semibold">React JS</div>
            </div>
          </div>
          <div className="min-w-0 p-8">
            <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase">
              Professional Courses
            </div>
            <a
              href="#"
              className="mt-1 block text-lg leading-tight font-medium text-black no-underline hover:underline"
            >
              Rocket Propulsion Fundamentals
            </a>
            <p className="mt-2 text-gray-500">
              An in-depth study of the fundamentals of rocket propulsion...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The two frames below are separate pages, so <code>md:</code> follows
          each frame. The phone frame is 375px and stacks the image on top.
          The desktop frame is 1024px, drawn smaller so it fits this column,
          and <code>md:flex</code>{" "}puts the image beside the text:
        </p>
        <LiveDemo mode="styled" name="TailwindResponsiveDesign" file="app/labs/lab2/tailwind/TailwindResponsiveDesign.tsx">
          <ResponsivePreview src={TAILWIND_RESPONSIVE_PREVIEW_SRC} />
        </LiveDemo>
        <p>
          Import each responsive component into{" "}
          <code>app/labs/lab2/tailwind/page.tsx</code>{" "}and render it there.
          The five small demos come first, then{" "}
          <code>TailwindResponsiveDesign</code>. The finished page also keeps
          the spacing, typography, and background samples above them, and the
          filter and grid samples from <SectionLink to="2.3.5" />{" "}and{" "}
          <SectionLink to="2.3.6" />:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindLab"
          file="app/labs/lab2/tailwind/page.tsx"
        >{`import "./index.css";
import TailwindSpacing from "./TailwindSpacing";
import TailwindTypography from "./TailwindTypography";
import TailwindBackgroundColors from "./TailwindBackgroundColors";
import TailwindResponsiveBreakpoint from "./TailwindResponsiveBreakpoint";
import TailwindResponsiveShowHide from "./TailwindResponsiveShowHide";
import TailwindResponsiveFlex from "./TailwindResponsiveFlex";
import TailwindResponsiveGrid from "./TailwindResponsiveGrid";
import TailwindResponsiveSpacingText from "./TailwindResponsiveSpacingText";
import TailwindResponsiveDesign from "./TailwindResponsiveDesign";
import TailwindFilters from "./TailwindFilters";
import TailwindGrids from "./TailwindGrids";

export default function TailwindLab() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Tailwind CSS</h1>
      <TailwindSpacing />
      <hr className="my-8" />
      <TailwindTypography />
      <hr className="my-8" />
      <TailwindBackgroundColors />
      <hr className="my-8" />
      <TailwindResponsiveBreakpoint />
      <hr className="my-8" />
      <TailwindResponsiveShowHide />
      <hr className="my-8" />
      <TailwindResponsiveFlex />
      <hr className="my-8" />
      <TailwindResponsiveGrid />
      <hr className="my-8" />
      <TailwindResponsiveSpacingText />
      <hr className="my-8" />
      <TailwindResponsiveDesign />
      <hr className="my-8" />
      <TailwindFilters />
      <hr className="my-8" />
      <TailwindGrids />
    </div>
  );
}`}</CodeBlock>
        <OnYourOwn>
          In{" "}
          <code>TailwindResponsiveDesign.tsx</code>, change the copy or image to
          something personal, then add one more{" "}
          <code>md:</code>{" "}(or <code>lg:</code>) utility so a property clearly
          differs between narrow and wide viewports.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/tailwind/TailwindResponsiveDesign.tsx, keep my personal copy or image unchanged. After the existing card, add a second sample card with id wd-ai-responsive that keeps the course sample copy, and add one more breakpoint utility (for example lg:p-12 on the text column, or md:bg-indigo-50 on the card) so padding or background clearly differs between narrow and wide viewports. Do not overwrite my personal card.`}
        >
          Paste this prompt to add a second sample breakpoint — then compare the
          phone and desktop frames and confirm a property changes at md or lg:
        </WithAI>

        <h3
          id="sec-2-3-5"
          className="scroll-mt-6 font-sans text-xl font-semibold"
        >
          2.3.5 Filters
        </h3>
        <p>
          Filter utilities apply visual effects — blur, brightness, contrast,
          grayscale, and more — straight onto an image or element. The
          original exercise blurs a photo of Angel Falls at four increasing
          strengths; if you do not have that image handy, any photo under{" "}
          <code>public/images</code>{" "}works just as well to see the effect —
          the sample below reuses{" "}
          <code>reactjs.jpg</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindFilters"
          file="app/labs/lab2/tailwind/TailwindFilters.tsx"
        >{`export default function TailwindFilters() {
  // Download angel-falls.jpg into public/images for the PDF exercise;
  // reactjs.jpg is used here so the lab runs out of the box.
  const src = "/images/reactjs.jpg";
  return (
    <div>
      <h2>Blurs</h2>
      <div className="flex">
        <img className="blur-none w-1/4" src={src} alt="blur none" />
        <img className="blur-sm w-1/4" src={src} alt="blur sm" />
        <img className="blur-lg w-1/4" src={src} alt="blur lg" />
        <img className="blur-2xl w-1/4" src={src} alt="blur 2xl" />
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Four copies of the same image sit side by side, the blur growing
          from imperceptible to nearly unrecognizable — each variation is
          nothing more than one utility class swapped for another:
        </p>
        <LiveDemo mode="styled" name="TailwindFilters" file="app/labs/lab2/tailwind/TailwindFilters.tsx">
          <TailwindFilters />
        </LiveDemo>
        <OnYourOwn>
          In <code>TailwindFilters.tsx</code>, add a
          second row that demos a different filter family — for example{" "}
          <code>grayscale</code>, <code>brightness-*</code>, or{" "}
          <code>contrast-*</code> — on the same image.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/tailwind/TailwindFilters.tsx, keep my personal second filter row unchanged. After the sample blur row, add another sample row with id wd-ai-filters that demos grayscale, grayscale-0, brightness-50, and brightness-150 on the same image (w-1/4 each) under an h3 "Grayscale and brightness". Not my personal row.`}
        >
          Paste this prompt to add a third sample filter row — then confirm it
          uses a different filter family than blur:
        </WithAI>

        <h3
          id="sec-2-3-6"
          className="scroll-mt-6 font-sans text-xl font-semibold"
        >
          2.3.6 CSS Grid Layout{" "}
          <BookSectionSlidesLink sectionId="sec-2-3-6" />
        </h3>
        <p>
          Tailwind also wraps CSS Grid in utility classes:{" "}
          <code>grid grid-cols-4 gap-4</code>{" "}turns a container into a
          four-column grid with consistent gutters, and children automatically
          wrap onto new rows once a row fills up. Start{" "}
          <code>TailwindGrids.tsx</code> with the outer wrapper and the{" "}
          <code>h2</code> Tailwind Grids heading, then the four-column section:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindGrids"
          file="app/labs/lab2/tailwind/TailwindGrids.tsx"
        >{`export default function TailwindGrids() {
  return (
    <div>
      <h2>Tailwind Grids</h2>
      <div>
        <h3 className="mt-6 text-3xl font-bold">4 Columns Grid</h3>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="text-center bg-blue-300 p-3">
              {String(i + 1).padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Nine numbered cells flow across four columns and wrap onto a third
          row for the last one. <code>col-span-2</code> stretches a cell
          across two tracks of a three-column grid. Paste the TSX below after
          the 4 Columns Grid, still inside the outer <code>div</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindGrids"
          file="app/labs/lab2/tailwind/TailwindGrids.tsx"
        >{`      <div>
        <h3 className="mt-6 text-3xl font-bold">3 Columns Grid</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-blue-300 p-3">01</div>
          <div className="text-center bg-blue-300 p-3">02</div>
          <div className="text-center bg-blue-300 p-3">03</div>
          <div className="col-span-2 text-center bg-blue-300 p-3">04</div>
          <div className="text-center bg-blue-300 p-3">05</div>
          <div className="text-center bg-blue-300 p-3">06</div>
          <div className="col-span-2 text-center bg-blue-300 p-3">07</div>
        </div>
      </div>`}</CodeBlock>
        <p>
          The Grid system mixes an even two-column split with a twelve-column
          split for a one-third/two-thirds layout and a sidebar/content/sidebar
          layout — the same page layouts{" "}
          <SectionLink to="2.1.18" /> built with float, this time with Grid.
          Paste the TSX below after the 3 Columns Grid, still inside the outer{" "}
          <code>div</code>. The heading is an <code>h2</code>, the same level
          as Tailwind Grids:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindGrids"
          file="app/labs/lab2/tailwind/TailwindGrids.tsx"
        >{`      <div id="wd-tailwind-grid-system" className="mt-6">
        <h2>Grid system</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-red-500 text-white">
            <h3>Left half</h3>
          </div>
          <div className="bg-blue-500 text-white">
            <h3>Right half</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-4 bg-yellow-500">
            <h3>One third</h3>
          </div>
          <div className="col-span-8 bg-green-500 text-white">
            <h3>Two thirds</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-2 bg-black text-white">
            <h3>Sidebar</h3>
          </div>
          <div className="col-span-8 bg-gray-500 text-white">
            <h3>Main content</h3>
          </div>
          <div className="col-span-2 bg-blue-400">
            <h3>Sidebar</h3>
          </div>
        </div>
      </div>`}</CodeBlock>
        <p>
          A twelve-column grid is the sweet spot for page layout because
          twelve divides evenly by two, three, four, and six — which is why{" "}
          <code>col-span-4</code>{" "}(one third) and{" "}
          <code>col-span-8</code>{" "}(two thirds) add up cleanly to twelve, and
          why the sidebar/content/sidebar row below it uses 2/8/2. Pasting
          those three blocks in order is the finished component, which is what
          the figure renders:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindGrids"
          file="app/labs/lab2/tailwind/TailwindGrids.tsx"
        >{`export default function TailwindGrids() {
  return (
    <div>
      <h2>Tailwind Grids</h2>
      <div>
        <h3 className="mt-6 text-3xl font-bold">4 Columns Grid</h3>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="text-center bg-blue-300 p-3">
              {String(i + 1).padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mt-6 text-3xl font-bold">3 Columns Grid</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-blue-300 p-3">01</div>
          <div className="text-center bg-blue-300 p-3">02</div>
          <div className="text-center bg-blue-300 p-3">03</div>
          <div className="col-span-2 text-center bg-blue-300 p-3">04</div>
          <div className="text-center bg-blue-300 p-3">05</div>
          <div className="text-center bg-blue-300 p-3">06</div>
          <div className="col-span-2 text-center bg-blue-300 p-3">07</div>
        </div>
      </div>
      <div id="wd-tailwind-grid-system" className="mt-6">
        <h2>Grid system</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-red-500 text-white">
            <h3>Left half</h3>
          </div>
          <div className="bg-blue-500 text-white">
            <h3>Right half</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-4 bg-yellow-500">
            <h3>One third</h3>
          </div>
          <div className="col-span-8 bg-green-500 text-white">
            <h3>Two thirds</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-2 bg-black text-white">
            <h3>Sidebar</h3>
          </div>
          <div className="col-span-8 bg-gray-500 text-white">
            <h3>Main content</h3>
          </div>
          <div className="col-span-2 bg-blue-400">
            <h3>Sidebar</h3>
          </div>
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <LiveDemo mode="styled" name="TailwindGrids" file="app/labs/lab2/tailwind/TailwindGrids.tsx">
          <TailwindGrids />
        </LiveDemo>
        <OnYourOwn>
          In <code>TailwindGrids.tsx</code>, add one
          more grid row that uses <code>col-span-*</code>{" "}in a layout you have not
          shown yet (for example three equal columns or a 3/9 split on a
          twelve-column grid).
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab2/tailwind/TailwindGrids.tsx, keep my personal extra grid row unchanged. After the sample grid-system rows, add one more sample twelve-column row with id wd-ai-grid that uses col-span-3 and col-span-9 (a 3/9 split) with distinct background classes. Do not overwrite my personal row.`}
        >
          Paste this prompt to add a 3/9 sample split — then confirm it uses
          col-span utilities on a twelve-column grid:
        </WithAI>

      </Section>

      <Section level={3} id="sec-2-3-7" title="2.3.7 Exercises">
        <p>
          Use this checklist to confirm Lab 2 covers the CSS, icon, and
          Tailwind topics in <SectionLink to="2.1" />–<SectionLink to="2.3" />.
          Each item points back to the section where you built the worked
          example. When you are done, <code>app/labs/lab2/page.tsx</code>{" "}
          should import the CSS samples in order, and the Tailwind samples
          should live under <code>app/labs/lab2/tailwind/</code>. Each
          topic is listed once, with Lab, <strong>On your own</strong>,
          and <strong>With AI</strong>{" "}nested as a/b/c when that
          section has those blocks.
        </p>
        <NestedExerciseList groups={CH2_LAB_EXERCISES} />
      </Section>
    </>
  );
}
