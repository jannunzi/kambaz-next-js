import type { LectureSlide } from "../types";

export const WEB_FORMS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "FORMS",
      "Lab 1 folder: app/labs/lab1/forms/",
    ],
  },
  {
    id: "why-forms",
    title: "Forms collect data",
    kind: "content",
    bullets: [
      "A `<form>` wraps controls so users fill in and submit them as one unit",
      "Put the form files in `app/labs/lab1/forms/`. **No** `page.tsx` there, so no new route",
      "`Forms.tsx` assembles the pieces. `page.tsx` imports `./forms/Forms`",
    ],
  },
  {
    id: "text",
    title: "The input tag",
    kind: "content",
    bullets: [
      "`<input>` collects short strings. The default `type` is `text`",
      "**Uncontrolled** input: the browser owns what the user types. React does not track each keystroke",
      "Set starting text with `defaultValue`. Leave `value` for later chapters",
      "Useful attributes: `id`, `type`, `placeholder`, `title`, `defaultValue`",
    ],
  },
  {
    id: "labels",
    title: "Input fields and labels",
    kind: "content",
    bullets: [
      "`<label htmlFor=\"the-id\">` points at the control’s `id` (JSX: `htmlFor`, HTML: `for`)",
      "Clicking the label focuses the field. **Match** `id` and `htmlFor`",
      "A **fragment** `<>…</>` groups sibling tags without adding a `div` to the DOM",
    ],
  },
  {
    id: "text-fields",
    title: "Text Fields",
    kind: "content",
    bullets: [
      "Lab 1 ids: `wd-text-fields-username`, `-password`, `-first-name`, `-last-name`",
      "`type=\"password\"` masks the characters. `placeholder` is a hint, not a label",
    ],
    code: `export default function TextFields() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/TextFields.tsx",
  },
  {
    id: "text-fields-live",
    title: "Text Fields: live demo",
    kind: "demo",
    embed: "text-fields",
  },
  {
    id: "forms-wrapper",
    title: "Wire TextFields into Forms.tsx",
    kind: "content",
    bullets: [
      "`#wd-forms` wraps a `<form id=\"wd-text-fields\">`",
      "Import `Forms` into `page.tsx` from the folder: `./forms/Forms`",
    ],
    code: `import TextFields from "./TextFields";

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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Forms.tsx",
  },
  {
    id: "textarea-html",
    title: "Text boxes in HTML",
    kind: "content",
    bullets: [
      "`<textarea>` holds longer multi-line text, such as a biography",
      "In HTML the starting text sits between the tags",
      "React 19 throws on that. Put the text on `defaultValue` instead",
    ],
    code: `<textarea id="wd-textarea" cols="30" rows="10">
Lorem ipsum dolor sit amet...
</textarea>`,
    codeLanguage: "html",
  },
  {
    id: "textarea",
    title: "Textarea",
    kind: "content",
    bullets: [
      "`cols` and `rows` set the visible size",
      "Import `Textarea` into `Forms.tsx` and render `<Textarea />` in the form",
    ],
    code: `export default function Textarea() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Textarea.tsx",
  },
  {
    id: "textarea-live",
    title: "Textarea: live demo",
    kind: "demo",
    embed: "textarea",
  },
  {
    id: "radio-genre",
    title: "Radio Buttons",
    kind: "content",
    bullets: [
      "Radios in a group are **mutually exclusive**: picking one clears the rest",
      "Radios that share a `name` form a group. Each gets its own `id`",
      "Each label’s `htmlFor` matches its input’s `id`",
    ],
    code: `export default function RadioButtons() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/RadioButtons.tsx",
  },
  {
    id: "radio-groups",
    title: "Two Radio Groups",
    kind: "content",
    bullets: [
      "Exclusion applies **within** a `name` group",
      "Weekly does not clear Comedy: `radio-frequency` is its own group",
      "Import `RadioButtons` into `Forms.tsx`",
    ],
    code: `export default function RadioButtons() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/RadioButtons.tsx",
    codeAddedLines: [[18, 28]],
  },
  {
    id: "radio-groups-live",
    title: "Radio Buttons: live demo",
    kind: "demo",
    embed: "radio-buttons",
  },
  {
    id: "radio-label-patterns",
    title: "Label Patterns for Radios",
    kind: "content",
    bullets: [
      "Sibling label + `htmlFor`, or **wrap** the input inside the label",
      "Wrapping needs no `htmlFor`. Lab 1 keeps sibling labels",
    ],
    code: `{/* Sibling label + htmlFor */}
<input type="radio" name="radio-beside" id="wd-radio-beside-yes" />
<label htmlFor="wd-radio-beside-yes">Yes</label>

{/* Wrapping label — no htmlFor needed */}
<label>
  <input type="radio" name="radio-wrap" /> Yes
</label>

{/* Separate placement still works with htmlFor */}
<label htmlFor="wd-radio-distant-a">Option A</label>
{/* ... elsewhere in the layout ... */}
<input type="radio" name="radio-distant" id="wd-radio-distant-a" />`,
    codeLanguage: "tsx",
  },
  {
    id: "checkboxes",
    title: "Checkboxes",
    kind: "content",
    bullets: [
      "Same label pattern as radios, but each box is **independent**",
      "Comedy and Drama can both stay checked",
      "Import `Checkboxes` into `Forms.tsx`",
    ],
    code: `export default function Checkboxes() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Checkboxes.tsx",
  },
  {
    id: "checkboxes-live",
    title: "Checkboxes: live demo",
    kind: "demo",
    embed: "checkboxes",
  },
  {
    id: "select-one",
    title: "Dropdowns",
    kind: "content",
    bullets: [
      "`<select>` holds a fixed list of `<option>`s",
      "People see the option text. The form records its `value`",
      "`defaultValue` on `select` picks the starting option",
    ],
    code: `export default function Dropdowns() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Dropdowns.tsx",
  },
  {
    id: "select-many",
    title: "Select Many",
    kind: "content",
    bullets: [
      "`multiple` allows several choices. `defaultValue` becomes an **array**",
      "Shift selects a range. Cmd (macOS) or Ctrl adds one option",
      "Import `Dropdowns` into `Forms.tsx`",
    ],
    code: `export default function Dropdowns() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Dropdowns.tsx",
    codeAddedLines: [[14, 26]],
  },
  {
    id: "select-many-live",
    title: "Dropdowns: live demo",
    kind: "demo",
    embed: "dropdowns",
  },
  {
    id: "email",
    title: "Other Field Types",
    kind: "content",
    bullets: [
      "**Strongly typed** inputs expect one kind of data: email, number, date",
      "They nudge users toward valid input and let the browser check it",
      "`type=\"email\"` checks for a basic `name@domain` shape",
    ],
    code: `export default function OtherFieldTypes() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/OtherFieldTypes.tsx",
  },
  {
    id: "number",
    title: "Number",
    kind: "content",
    bullets: [
      "`type=\"number\"` brings up a numeric keypad on many phones",
      "`min={0}` rejects a negative salary",
    ],
    code: `export default function OtherFieldTypes() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/OtherFieldTypes.tsx",
    codeAddedLines: [[12, 20]],
  },
  {
    id: "range",
    title: "Range",
    kind: "content",
    bullets: [
      "`type=\"range\"` renders a slider",
      "`min`, `max`, and `defaultValue` keep the thumb in a sensible place",
      "The comment stands for the email and number fields you already wrote",
    ],
    code: `export default function OtherFieldTypes() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/OtherFieldTypes.tsx",
    codeAddedLines: [[6, 14]],
  },
  {
    id: "date",
    title: "Date",
    kind: "content",
    bullets: [
      "`type=\"date\"` stores `YYYY-MM-DD`, whatever the display format",
      "`min` and `max` restrict the allowed dates",
      "Import `OtherFieldTypes` into `Forms.tsx`",
    ],
    code: `export default function OtherFieldTypes() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/OtherFieldTypes.tsx",
    codeAddedLines: [[21, 38]],
  },
  {
    id: "date-live",
    title: "Other Field Types: live demo",
    kind: "demo",
    embed: "typed-fields",
  },
  {
    id: "more-types",
    title: "More input types",
    kind: "content",
    bullets: [
      "`tel` for phone numbers, `url` for web addresses, `search` for search boxes",
      "`time`, `datetime-local`, `month`, and `week` for other date and time pickers",
      "`color` picker, `type=\"file\"` upload, and `hidden` values",
    ],
  },
  {
    id: "buttons",
    title: "Buttons",
    kind: "content",
    bullets: [
      "Always set `type`. In a form, a `<button>` without one is a `submit`",
      "`type=\"submit\"` for Save. `type=\"button\"` for Cancel and other actions",
      "Lab 1 ids: `wd-html-button-save`, `wd-html-button-cancel`",
    ],
    code: `export default function Buttons() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Buttons.tsx",
  },
  {
    id: "buttons-live",
    title: "Buttons: live demo",
    kind: "demo",
    embed: "buttons",
  },
  {
    id: "forms-complete",
    title: "The Completed Forms.tsx",
    kind: "content",
    bullets: [
      "An **event handler** is a function that runs when something happens, such as a click or a form submit",
      "`onSubmit` runs one when Save submits the form. `event.preventDefault()` keeps the page from reloading",
      "An event handler needs `\"use client\"` as the first line of the file",
      "Without it the file is a **Server Component**, which cannot pass event handlers",
    ],
    code: `"use client";

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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Forms.tsx",
    codeAddedLines: [1, [4, 9], [15, 20], [22, 27]],
  },
  {
    id: "forms-complete-live",
    title: "Forms: live demo",
    kind: "demo",
    embed: "lab1-forms",
  },
  {
    id: "uncontrolled-reminder",
    title: "defaultValue, not value",
    kind: "content",
    bullets: [
      "HTML samples often write `value=`. In React Lab 1 use **`defaultValue`**",
      "`value` alone **freezes** the field: React keeps forcing the same text back",
      "Lab 1 stays **uncontrolled**. Controlled inputs return in later chapters",
    ],
  },
  {
    id: "props-title",
    title: "PROPS AND CHILDREN",
    kind: "title",
    bullets: [
      "Configure your own components the way attributes configure HTML tags",
    ],
  },
  {
    id: "props-intro",
    title: "Parameterizing Components with Props",
    kind: "content",
    bullets: [
      "HTML tags take **attributes**: `id`, `src`, `type`, …",
      "Your components take values the same way. React calls them **props** (properties)",
      "Declare props as function parameters. Pass them as attributes where you use the component",
      "The inline `style` object is a sneak peek at CSS. Copy the pattern for now",
    ],
  },
  {
    id: "highlighted-paragraph",
    title: "A Component with Props",
    kind: "content",
    bullets: [
      "Create `app/labs/lab1/HighlightedParagraph.tsx`",
      "`text` plus four style props, each with a default value",
      "`?:` marks a prop optional. `string | number` accepts either type",
    ],
    code: `function HighlightedParagraph({
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/HighlightedParagraph.tsx",
  },
  {
    id: "highlighted-paragraph-lab",
    title: "Pass Props as Attributes",
    kind: "content",
    bullets: [
      "Same file. The default export renders three variations",
      "Import `HighlightedParagraph.tsx` into `page.tsx`",
    ],
    code: `export default function HighlightedParagraphLab() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/HighlightedParagraph.tsx",
  },
  {
    id: "highlighted-paragraph-live",
    title: "Highlighted Paragraph: live demo",
    kind: "demo",
    embed: "highlighted-paragraph",
  },
  {
    id: "children-intro",
    title: "Wrapping Content with Children",
    kind: "content",
    bullets: [
      "A `text` prop works for a string, not for arbitrary markup",
      "Content between a component’s opening and closing tags arrives as the prop **`children`**",
      "**`ReactNode`** is the TypeScript type for anything React can render: tags, text, components",
    ],
  },
  {
    id: "highlighted-box",
    title: "A Component with Children",
    kind: "content",
    bullets: [
      "Create `app/labs/lab1/HighlightedBox.tsx`",
      "Same style props as `HighlightedParagraph`, minus `text`",
      "The `div` renders `{children}`",
    ],
    code: `import type { ReactNode } from "react";

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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/HighlightedBox.tsx",
  },
  {
    id: "highlighted-box-lab",
    title: "Nest Content Inside the Box",
    kind: "content",
    bullets: [
      "Same file. Each box wraps different children",
      "Import `HighlightedBox.tsx` into `page.tsx` after the paragraph lab",
    ],
    code: `export default function HighlightedBoxLab() {
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/HighlightedBox.tsx",
  },
  {
    id: "highlighted-box-live",
    title: "Highlighted Box: live demo",
    kind: "demo",
    embed: "highlighted-box",
  },
  {
    id: "next-up",
    title: "Next: anchors",
    kind: "title",
    bullets: [
      "Forms collect data. Props and children make components reusable",
      "Next: `href`, `mailto:`, `tel:`, and in-page `#hash` links",
    ],
  },
];
