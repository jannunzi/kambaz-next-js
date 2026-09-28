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
      "A `<form>` wraps controls so they submit as one unit",
      "Lab 1 wrapper id: `wd-forms`. Sample form id: `wd-text-fields`",
      "Do **not** let the sample form reload the page — `onSubmit` + `preventDefault()`",
      "Default submit behavior will **not** be used in this course",
    ],
  },
  {
    id: "labels",
    title: "Input fields and labels",
    kind: "content",
    bullets: [
      "`<label htmlFor=\"the-id\">` points at the control’s `id` (JSX: `htmlFor`, HTML: `for`)",
      "Clicking the label focuses the field. **Match** `id` and `htmlFor`",
      "Placeholder text is a hint, not a label",
    ],
    code: `<label htmlFor="usernameFld">
  Username
</label>
<input
  id="usernameFld"
  type="text"
  title="Username"
  placeholder="alice"
/>`,
    codeLanguage: "tsx",
  },
  {
    id: "text",
    title: "Text Fields",
    kind: "content",
    bullets: [
      "`<input>` default `type` is `text` — short strings: username, first name",
      "Use `defaultValue` (uncontrolled). Do not set `value` without React state",
      "Useful attributes: `id`, `placeholder`, `defaultValue`, `title`",
    ],
  },
  {
    id: "password",
    title: "Password fields",
    kind: "content",
    bullets: [
      "`type=\"password\"` masks characters",
      "Still an `input`. Same labeling rules",
      "Lab 1 id: `wd-text-fields-password`",
    ],
    code: `<label htmlFor="wd-text-fields-password">Password:</label>
<input
  type="password"
  defaultValue="123@#$asd"
  id="wd-text-fields-password"
/>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/TextFields.tsx",
  },
  {
    id: "text-fields-demo",
    title: "Text Fields",
    kind: "demo",
    bullets: [
      "Lab 1 ids: `wd-text-fields-username`, `-password`, `-first-name`, `-last-name`",
      "Type in the fields. The browser owns the text — that is **uncontrolled**",
    ],
    embed: "text-fields",
    code: `<div id="wd-forms">
  <h4>Form Elements</h4>
  <form id="wd-text-fields">
    <h5>Text Fields</h5>
    <label htmlFor="wd-text-fields-username">Username:</label>
    <input id="wd-text-fields-username" placeholder="jdoe" />
  </form>
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/TextFields.tsx",
  },
  {
    id: "textarea",
    title: "Text Areas",
    kind: "demo",
    embed: "textarea",
    bullets: [
      "`<textarea>` is for longer text: bios, comments",
      "Opening and closing tag. Prefer `defaultValue` in React",
      "Lab 1 id: `wd-textarea`",
    ],
    code: `<h5>Text boxes</h5>
<label>Biography:</label><br />
<textarea id="wd-textarea" cols={30} rows={10}
  defaultValue="Lorem ipsum dolor sit amet..." />`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Textarea.tsx",
  },
  {
    id: "buttons",
    title: "Buttons",
    kind: "demo",
    embed: "buttons",
    bullets: [
      "`type=\"button\"` does **not** submit. `type=\"submit\"` sends the form",
      "Default submit behavior will **not** be used in this course",
      "Lab 1 ids: `wd-html-button-save`, `wd-html-button-cancel`",
    ],
    code: `<button type="button">Delete</button>
<button type="button">Edit</button>
<button type="submit">Update</button>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Buttons.tsx",
  },
  {
    id: "onclick-alert",
    title: "On Click Event Handlers",
    kind: "demo",
    bullets: [
      "`type=\"button\"` plus `onClick` runs JavaScript without sending the form",
      "Classroom demo: `alert(\"Life is Good!\")`",
    ],
    embed: "alert-button",
    code: `<h5 id="wd-buttons">Buttons</h5>
<button
  id="wd-all-good"
  type="button"
  onClick={() => alert("Life is Good!")}
>
  Hello World!
</button>`,
    codeLanguage: "tsx",
  },
  {
    id: "file",
    title: "File Upload",
    kind: "demo",
    bullets: [
      "`type=\"file\"` lets the user pick a file. The browser draws the control",
      "Lab 1 can use `id=\"wd-upload\"` or `wd-file` — still pair it with a `label`",
    ],
    code: `<h5>File upload</h5>
<input id="wd-upload" type="file" />`,
    codeLanguage: "tsx",
    embed: "file-field",
  },
  {
    id: "radio-vs-checkbox",
    title: "Checkbox and radio buttons",
    kind: "content",
    bullets: [
      "**Radio** — one choice in a group. Checking one unchecks the others",
      "**Checkbox** — each box is independent",
      "Wrap with `label` to increase the click area",
    ],
    code: `<label>
  <input name="b" type="checkbox" /> Tenured
</label>
Tenured:
<label>
  <input name="a" type="radio" /> Yes
</label>
<label>
  <input name="a" type="radio" defaultChecked /> No
</label>`,
    codeLanguage: "tsx",
  },
  {
    id: "radio-same-name",
    title: "Radio Buttons with Labels",
    kind: "demo",
    bullets: [
      "Match `id` and `htmlFor` to associate label and input",
      "Use the **same `name`** to group mutually exclusive buttons — Lab 1: `name=\"radio-genre\"`",
    ],
    code: `<input id="wd-radio-comedy" type="radio" name="radio-genre" />
<label htmlFor="wd-radio-comedy">Comedy</label>
<input id="wd-radio-drama" type="radio" name="radio-genre" />
<label htmlFor="wd-radio-drama">Drama</label>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/RadioButtons.tsx",
    embed: "radio-buttons",
  },
  {
    id: "checkboxes-multi",
    title: "Check Boxes",
    kind: "demo",
    embed: "checkboxes",
    bullets: [
      "Each checkbox can stay on while others are on",
      "They may share a `name` for grouping, but they do **not** exclude each other",
    ],
    code: `<input id="wd-chkbox-comedy" type="checkbox" name="check-genre" />
<label htmlFor="wd-chkbox-comedy">Comedy</label>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Checkboxes.tsx",
  },
  {
    id: "select-one",
    title: "Select One Option",
    kind: "demo",
    embed: "dropdowns",
    bullets: [
      "`<select>` plus `<option value=\"…\">`",
      "`defaultValue` on `select` picks the initial option (match an option’s `value`)",
      "Lab 1 id: `wd-select-one-genre`",
    ],
    code: `<select id="wd-select-one-genre" defaultValue="SCIFI">
  <option value="COMEDY">Comedy</option>
  <option value="SCIFI">Science Fiction</option>
</select>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Dropdowns.tsx",
  },
  {
    id: "select-many",
    title: "Select Many",
    kind: "demo",
    embed: "dropdowns",
    bullets: [
      "`multiple` plus `defaultValue={[\"COMEDY\", \"SCIFI\"]}`",
      "Hold Cmd (macOS) or Ctrl (Windows) to pick more than one",
      "Lab 1 id: `wd-select-many-genre`",
    ],
    code: `<select id="wd-select-many-genre" multiple
  defaultValue={["COMEDY", "SCIFI"]}>
  <option value="COMEDY">Comedy</option>
  <option value="SCIFI">Science Fiction</option>
</select>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Dropdowns.tsx",
  },
  {
    id: "number",
    title: "Range and Numbers",
    kind: "demo",
    embed: "typed-fields",
    bullets: [
      "`type=\"number\"` — numeric keyboard / stepper",
      "Lab 1: starting salary `wd-text-fields-salary-start`",
    ],
    code: `<label htmlFor="wd-text-fields-salary-start">
  Starting salary:
</label>
<input type="number"
  id="wd-text-fields-salary-start"
  placeholder="1000"
  defaultValue="100000" />`,
    codeLanguage: "tsx",
  },
  {
    id: "range",
    title: "type=range",
    kind: "demo",
    embed: "typed-fields",
    bullets: [
      "A slider. Pair it with a label so the value’s meaning is clear",
      "Lab 1: rating `wd-text-fields-rating` — `max=\"5\"`",
    ],
    code: `<label htmlFor="wd-text-fields-rating">Rating:</label>
<input type="range" id="wd-text-fields-rating"
  max="5" defaultValue="4" />`,
    codeLanguage: "tsx",
  },
  {
    id: "email",
    title: "Emails and Dates",
    kind: "demo",
    embed: "typed-fields",
    bullets: [
      "`type=\"email\"` — the browser can hint a keyboard and do a basic format check",
      "Lab 1 id: `wd-text-fields-email`",
    ],
    code: `<label htmlFor="wd-text-fields-email">Email:</label>
<input type="email"
  placeholder="jdoe@somewhere.com"
  id="wd-text-fields-email" />`,
    codeLanguage: "tsx",
  },
  {
    id: "date",
    title: "Date input fields",
    kind: "demo",
    bullets: [
      "`type=\"date\"` — a date picker where the browser supports it",
      "Lab 1 id: `wd-text-fields-dob`",
    ],
    code: `<label htmlFor="wd-text-fields-dob">Date of birth:</label>
<input type="date"
  id="wd-text-fields-dob"
  defaultValue="2000-01-21" />`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/OtherFieldTypes.tsx",
    embed: "typed-fields",
  },
  {
    id: "uncontrolled-reminder",
    title: "defaultValue, not value",
    kind: "content",
    bullets: [
      "HTML samples often write `value=`. In React Lab 1 use **`defaultValue`**",
      "`value` without `onChange` + state **freezes** the field",
      "Lab 1 stays **uncontrolled**. Controlled inputs return when you learn `useState`",
    ],
  },
  {
    id: "next-up",
    title: "Next: anchors",
    kind: "title",
    bullets: [
      "You can collect data without reloading the slide",
      "Next: `href`, `mailto:`, `tel:`, and in-page `#hash` TOC",
    ],
  },
];
