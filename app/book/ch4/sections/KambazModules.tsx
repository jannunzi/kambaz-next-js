import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Link from "next/link";

export default function KambazModules() {
  return (
    <Section
      level={3}
      id="sec-4-10-4"
      title="4.10.4 Adding State to the Modules Screen"
    >
      <p>
        Now do the same with Modules: refactor the component by adding
        state so that you can create, update, and remove modules. You
        will discover the same limitation you had with courses — new
        modules and edits cannot be used outside the Modules screen even
        though Home already embeds that page and should show the same
        list. Instead of moving the modules array and functions to a
        shared parent, we will put them in a Zustand store so the list is
        available throughout the application. The screens, dialog, trash
        can, and pencil below are the controls you will add.
      </p>
      <p>
        The walkthrough starts from the list you already have, adds a
        dialog for new names, puts trash and pencil on each row, and
        finishes with the store so Home sees the same array. Reuse the
        HTML and CSS from earlier chapters for the list itself — the
        screenshots show the target controls, not a new visual language.
        You can begin by converting the modules array into local{" "}
        <code>useState</code>{" "}seeded from{" "}
        <code>db.modules</code>{" "}and confirm Modules still renders as
        expected. That local array is enough to prove the dialog and the
        row buttons; <SectionLink to="4.10.4.4" />{" "}moves it into the
        store once the controls work.
      </p>

      <Section
        level={3}
        id="sec-4-10-4-1"
        title="4.10.4.1 Creating a Module"
      >
        <p>
          Let us create a dialog where users can type the name of a new
          module. The <code>ModuleEditor</code>{" "}component below pops up
          when you click the red + Module button on Modules and on Home.
          You type the name in an input field. As you type,{" "}
          <code>setModuleName</code>{" "}updates the draft string, and
          clicking Add Module calls <code>addModule</code>, which
          actually appends the module, then closes the dialog. That is a
          small piece of UI state: a <code>show</code>{" "}boolean plus the
          draft <code>moduleName</code> string. Create{" "}
          <code>ModuleEditor.tsx</code>{" "}as a dialog with these props —{" "}
          <code>show</code>, <code>handleClose</code>,{" "}
          <code>dialogTitle</code>, <code>moduleName</code>,{" "}
          <code>setModuleName</code>, and <code>addModule</code> — and
          style it with Tailwind overlays and rounded panels. Confirm
          the dialog appears, accepts a name, and disappears on Cancel.
        </p>
        <CodeBlock
          language="tsx"
          name="ModuleEditor"
          file="app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx"
        >{`"use client";

export default function ModuleEditor({
  show,
  handleClose,
  dialogTitle,
  moduleName,
  setModuleName,
  addModule,
}: {
  show: boolean;
  handleClose: () => void;
  dialogTitle: string;
  moduleName: string;
  setModuleName: (name: string) => void;
  addModule: () => void;
}) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      id="wd-add-module-dialog"
    >
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h3 className="m-0 text-lg font-semibold">{dialogTitle}</h3>
          <button type="button" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="px-4 py-3">
          <input
            className="w-full rounded border border-neutral-300 px-3 py-1.5"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            id="wd-add-module-name"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-neutral-200 px-4 py-3">
          <button type="button" onClick={handleClose} id="wd-add-module-cancel">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              addModule();
              handleClose();
            }}
            id="wd-add-module-submit"
          >
            Add Module
          </button>
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          When <code>show</code>{" "}is false the component returns{" "}
          <code>null</code>, so the overlay is not in the document. The
          name input is a controlled field:{" "}
          <code>value</code>{" "}is <code>moduleName</code>{" "}and{" "}
          <code>onChange</code>{" "}calls{" "}
          <code>setModuleName</code>. Add Module runs{" "}
          <code>addModule</code>{" "}and then{" "}
          <code>handleClose</code>{" "}so the dialog does not stay open
          over an empty name. Cancel and the × only close the dialog —
          they must not append a module.
        </p>
        <p>
          The + Module button was implemented in{" "}
          <code>ModulesControls</code>{" "}in a prior chapter. Refactor it
          so that it displays the <code>ModuleEditor</code>{" "}dialog when
          clicked. The toolbar that already has Collapse All, View
          Progress, and Publish All should own that dialog. The red +
          Module button sets <code>show</code>{" "}to true; Cancel or the ×
          sets it back to false. The target dialog and toolbar look like{" "}
          <FigureLink to="4.10.4a" />{" "}and{" "}
          <FigureLink to="4.10.4b" />:
        </p>
        <BookFigure
          sources={[
            {
              id: "fig-4.10.4a",
              src: "/images/book/ch4/figures/fig-4-10-4a-module-editor.png",
              alt: "Add Module dialog with a name field, Cancel, and Add Module",
              caption: "Figure 4.10.4a — Module editor dialog",
            },
            {
              id: "fig-4.10.4b",
              src: "/images/book/ch4/figures/fig-4-10-4b-modules-controls.png",
              alt: "Publish All dropdown and red + Module button",
              caption: "Figure 4.10.4b — Modules controls",
            },
          ]}
        />
        <CodeBlock
          language="tsx"
          name="ModulesControls"
          file="app/(kambaz)/courses/[cid]/modules/ModulesControls.tsx"
        >{`"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ModuleEditor from "./ModuleEditor";

export default function ModulesControls({
  moduleName,
  setModuleName,
  addModule,
}: {
  moduleName: string;
  setModuleName: (title: string) => void;
  addModule: () => void;
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div id="wd-modules-controls" className="mb-3 flex flex-wrap items-center gap-2">
      {/* Collapse All, View Progress, Publish All */}
      <button
        type="button"
        id="wd-add-module-btn"
        onClick={handleShow}
        className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        <FaPlus /> Module
      </button>
      <ModuleEditor
        show={show}
        handleClose={handleClose}
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>ModulesControls</code>{" "}owns only the dialog visibility.
          The draft name and the function that appends a module stay on
          the Modules page so the same{" "}
          <code>addModule</code>{" "}can later call the Zustand store. Pass{" "}
          <code>moduleName</code>, <code>setModuleName</code>, and{" "}
          <code>addModule</code>{" "}down as props; the dialog will invoke{" "}
          <code>setModuleName</code>{" "}when you edit the text field and{" "}
          <code>addModule</code>{" "}when you click Add Module.
        </p>
        <p>
          On the Modules page, declare a{" "}
          <code>moduleName</code>{" "}state variable that keeps track of
          the name edited in the dialog. Keep that string in{" "}
          <code>useState</code>. Pass it,{" "}
          <code>setModuleName</code>, and an{" "}
          <code>addModule</code>{" "}that appends{" "}
          <code>{`{ name: moduleName, course: courseId }`}</code>{" "}into
          the store — or into a local array while you are still proving
          the dialog. After Add Module, clear the name with{" "}
          <code>{`setModuleName("")`}</code>{" "}so the next open starts
          blank. Confirm you can add modules. Confirm the new row
          appears on{" "}
          <Link href="/courses/RS101/modules">/courses/RS101/modules</Link>{" "}
          and that it is tagged with that course&apos;s{" "}
          <code>cid</code>{" "}so RS102 does not show it.
        </p>
        <OnYourOwn>
          Type a module name that includes your initials and add it from
          the dialog so you can tell your row apart from the JSON seed.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx, keep any extra field I added. After the name input, add a sample placeholder "Module name" if the input has none. Do not rename my personal field.`}
        >
          Ask the assistant to add a sample placeholder after your own
          extra field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-10-4-2"
        title="4.10.4.2 Deleting a Module"
      >
        <p>
          To delete modules, add a trash can icon to the{" "}
          <code>ModuleControlButtons</code>{" "}you implemented in an
          earlier chapter. Pass a <code>deleteModule</code>{" "}function
          you can call when clicking the trash can, and also pass the id
          of the module to be deleted as{" "}
          <code>moduleId</code>. The icon should be red so it reads as a
          destructive control next to the green checkmark and the
          ellipsis. The row with a red trash can looks like{" "}
          <FigureLink to="4.10.4c" />:
        </p>
        <BookFigure
          id="fig-4.10.4c"
          src="/images/book/ch4/figures/fig-4-10-4c-delete-module.png"
          alt="Module title row with a red trash can among the control icons"
          caption="Figure 4.10.4c — Deleting a module"
        />
        <p>
          To practice the row controls, update{" "}
          <code>ModuleControlButtons</code>{" "}as shown below. The pencil
          is included here because the next subsection will call{" "}
          <code>editModule</code>; you can add both icons now so the
          row matches the screenshot, then wire the pencil in{" "}
          <SectionLink to="4.10.4.3" />.
        </p>
        <CodeBlock
          language="tsx"
          name="ModuleControlButtons"
          file="app/(kambaz)/courses/[cid]/modules/ModuleControlButtons.tsx"
        >{`import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";

export default function ModuleControlButtons({
  moduleId,
  deleteModule,
  editModule,
}: {
  moduleId: string;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <FaPencilAlt
        className="cursor-pointer text-blue-600"
        onClick={() => editModule(moduleId)}
      />
      <FaTrash
        className="cursor-pointer text-red-600"
        onClick={() => deleteModule(moduleId)}
      />
      <GreenCheckmark />
      <BsPlus className="text-3xl" />
      <IoEllipsisVertical className="text-xl" />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>deleteModule</code>{" "}filters the modules array by{" "}
          <code>_id</code>, the same pattern{" "}
          <code>deleteCourse</code>{" "}used on the dashboard. Pass both
          the function and <code>module._id</code>{" "}into{" "}
          <code>ModuleControlButtons</code>{" "}from the map so each row
          deletes only itself. Confirm a trash click removes that
          module and leaves the others. Confirm the lessons nested under
          that module disappear with it, because they rendered as
          children of the removed row.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-4-10-4-3"
        title="4.10.4.3 Editing a Module"
      >
        <p>
          In <code>ModuleControlButtons</code>, the pencil icon should
          call <code>editModule</code>{" "}with the{" "}
          <code>moduleId</code>{" "}of the module you want to rename.
          Clicking the icon sets that module&apos;s{" "}
          <code>editing</code>{" "}flag to true. While the flag is false,
          render the name. While it is true, render a text field bound
          to <code>updateModule</code>{" "}so each keystroke writes the new
          title back into the array. Pressing Enter sets{" "}
          <code>editing</code>{" "}back to false so the name shows again
          and the input is hidden. The pencil on the row looks like{" "}
          <FigureLink to="4.10.4d" />; the field that replaces the
          title looks like <FigureLink to="4.10.4e" />:
        </p>
        <BookFigure
          sources={[
            {
              id: "fig-4.10.4d",
              src: "/images/book/ch4/figures/fig-4-10-4d-edit-module.png",
              alt: "Module row with a blue pencil and a red trash can",
              caption: "Figure 4.10.4d — Pencil to edit a module",
            },
            {
              id: "fig-4.10.4e",
              src: "/images/book/ch4/figures/fig-4-10-4e-editing-module.png",
              alt: "Module row showing an input field instead of the title",
              caption: "Figure 4.10.4e — Editing a module name",
            },
          ]}
        />
        <p>
          On the Modules page, implement{" "}
          <code>editModule</code>{" "}and <code>updateModule</code>.{" "}
          <code>editModule</code>{" "}maps the array and sets{" "}
          <code>editing: true</code>{" "}on the matching id so the input
          can appear. <code>updateModule</code>{" "}accepts a whole module
          object and replaces the corresponding object in the array, which
          is how the input writes the new name and how Enter clears the
          flag. Pass <code>editModule</code>{" "}to{" "}
          <code>ModuleControlButtons</code>{" "}so the pencil can turn the
          flag on. In the Modules map, the title is no longer a plain
          string:
        </p>
        <CodeBlock language="tsx">{`title={
  module.editing ? (
    <input
      className="w-1/2 rounded border border-neutral-300 px-2 py-1 text-base"
      defaultValue={module.name}
      onChange={(e) => updateModule({ ...module, name: e.target.value })}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          updateModule({ ...module, editing: false });
        }
      }}
    />
  ) : (
    module.name
  )
}`}</CodeBlock>
        <p>
          If <code>module.editing</code>{" "}is not set, the module name
          is displayed. If the pencil was clicked, the name is replaced
          by an input whose <code>defaultValue</code>{" "}is the current
          name. Each <code>onChange</code>{" "}spreads the module and
          overwrites <code>name</code>. If the Enter key is pressed,{" "}
          <code>editing</code>{" "}is set to false, the input is hidden,
          and the name is shown again. Confirm you can edit the names of
          the modules. Confirm you can rename a module, press Enter, and
          see the new name on both Modules and Home — once the store in{" "}
          <SectionLink to="4.10.4.4" />{" "}is in place. Until then the
          edit only lives on this page.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-4-10-4-4"
        title="4.10.4.4 A Modules Store"
      >
        <p>
          The Modules component seems to be working. You can create new
          modules, edit modules, and remove modules, but those new
          modules and edits cannot be used outside the confines of the
          Modules component even though you want to display the same
          list elsewhere, such as the Home screen. You could use the
          same approach as an early Dashboard sketch, by moving the
          state variables and functions to a higher-level component that
          could share the state. Instead we will use a Zustand store so
          you practice application-level state the same way courses
          moved in <SectionLink to="4.10.1" />. The store below keeps
          add, delete, update, and edit as named functions on the hook.
        </p>
        <p>
          Seed from <code>modules.json</code>. Export{" "}
          <code>addModule</code>, <code>deleteModule</code>,{" "}
          <code>updateModule</code>, and <code>editModule</code> —
          reimplemented so each one calls{" "}
          <code>set</code>{" "}with a new <code>modules</code>{" "}array.
          To practice the store, create{" "}
          <code>app/(kambaz)/store/modulesStore.ts</code>{" "}as shown
          below. Confirm the file compiles and that the initial array is
          the same seed Modules already filtered by{" "}
          <code>cid</code>.
        </p>
        <CodeBlock
          language="tsx"
          name="modulesStore"
          file="app/(kambaz)/store/modulesStore.ts"
        >{`"use client";

import { create } from "zustand";
import modulesJson from "../database/modules.json";

export type CourseModule = {
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons?: { _id: string; name: string; description: string; module: string }[];
  editing?: boolean;
};

export const useModulesStore = create<{
  modules: CourseModule[];
  addModule: (module: { name: string; course: string }) => void;
  deleteModule: (moduleId: string) => void;
  updateModule: (module: CourseModule) => void;
  editModule: (moduleId: string) => void;
}>((set) => ({
  modules: modulesJson as CourseModule[],
  addModule: (module) =>
    set((state) => ({
      modules: [
        ...state.modules,
        {
          _id: crypto.randomUUID(),
          name: module.name,
          description: "",
          course: module.course,
          lessons: [],
        },
      ],
    })),
  deleteModule: (moduleId) =>
    set((state) => ({
      modules: state.modules.filter((m) => m._id !== moduleId),
    })),
  updateModule: (module) =>
    set((state) => ({
      modules: state.modules.map((m) => (m._id === module._id ? module : m)),
    })),
  editModule: (moduleId) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m._id === moduleId ? { ...m, editing: true } : m,
      ),
    })),
}));`}</CodeBlock>
        <p>
          <code>addModule</code>{" "}builds a new object with a generated{" "}
          <code>_id</code>, an empty lessons array, and the{" "}
          <code>name</code>{" "}and <code>course</code>{" "}from the
          dialog. <code>deleteModule</code>{" "}filters by id.{" "}
          <code>updateModule</code>{" "}replaces the object whose{" "}
          <code>_id</code>{" "}matches. <code>editModule</code>{" "}only
          flips <code>editing</code>{" "}to true so the input appears;
          saving the name is still{" "}
          <code>updateModule</code>.
        </p>
        <p>
          Reimplement Modules by removing the local modules array and
          the local add, delete, update, and edit helpers, and replacing
          them with store selectors. The page then keeps only the draft
          name in <code>useState</code>. Filter the store by{" "}
          <code>cid</code>, pass store functions into{" "}
          <code>ModulesControls</code>{" "}and{" "}
          <code>ModuleControlButtons</code>, and wrap each add so it
          also clears <code>moduleName</code>. Home updates for free
          because it already renders <code>Modules</code>. Confirm you
          can still add, remove, and edit modules as before. Also
          confirm the modules still work on the Home screen: add a
          module on Modules, switch to Home without reloading, and
          confirm the new row is there.
        </p>
        <OnYourOwn>
          Add a module on Modules, switch to Home without reloading, and
          confirm the new row is there. Rename it with the pencil, press
          Enter, then delete it with the trash can.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/courses/[cid]/modules/page.tsx, keep any extra field I added. If moduleName is empty, do not call addModule. Do not rename my personal field.`}
        >
          Ask the assistant to skip empty names after your own extra field:
        </WithAI>
      </Section>
    </Section>
  );
}
