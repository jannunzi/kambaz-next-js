"use client";

import ClickEvent from "@/app/labs/lab4/ClickEvent";
import PassingDataOnEvent from "@/app/labs/lab4/PassingDataOnEvent";
import PassingFunctionsDemo from "@/app/labs/lab4/PassingFunctionsDemo";
import CounterBroken from "@/app/labs/lab4/CounterBroken";
import Counter from "@/app/labs/lab4/Counter";
import BooleanStateVariables from "@/app/labs/lab4/BooleanStateVariables";
import StringStateVariables from "@/app/labs/lab4/StringStateVariables";
import DateStateVariable from "@/app/labs/lab4/DateStateVariable";
import ObjectStateVariable from "@/app/labs/lab4/ObjectStateVariable";
import ArrayStateVariable from "@/app/labs/lab4/ArrayStateVariable";
import ParentStateComponent from "@/app/labs/lab4/ParentStateComponent";
import PropDrilling from "@/app/labs/lab4/PropDrilling";
import UrlEncoding from "@/app/labs/lab4/UrlEncoding";
import Effect from "@/app/labs/lab4/Effect";
import ContextExamples from "@/app/labs/lab4/context/ContextExamples";
import ZustandCounter from "@/app/labs/lab4/zustand/ZustandCounter";
import ZustandTodoList from "@/app/labs/lab4/zustand/ZustandTodoList";
import type { ReactNode } from "react";
import { useState } from "react";
import LectureDemoFrame from "./LectureDemoFrame";

function Lab4Demo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <LectureDemoFrame label={label} url="/labs/lab4">
      <div className="font-sans text-base [&_h2]:mt-0 [&_h3]:mt-0 [&_h4]:mt-0 [&_h5]:mt-2">
        {children}
      </div>
    </LectureDemoFrame>
  );
}

export function Lab4StubEmbed() {
  return (
    <Lab4Demo label="app/labs/lab4/page.tsx">
      <div id="wd-lab4">
        <h2>Lab 4</h2>
      </div>
    </Lab4Demo>
  );
}

export function ClickEventEmbed() {
  return (
    <Lab4Demo label="ClickEvent.tsx">
      <ClickEvent />
    </Lab4Demo>
  );
}

export function PassingDataEmbed() {
  return (
    <Lab4Demo label="PassingDataOnEvent.tsx">
      <PassingDataOnEvent />
    </Lab4Demo>
  );
}

export function PassingFunctionsEmbed() {
  return (
    <Lab4Demo label="PassingFunctionsDemo.tsx">
      <PassingFunctionsDemo />
    </Lab4Demo>
  );
}

export function CounterBrokenEmbed() {
  return (
    <Lab4Demo label="CounterBroken.tsx">
      <CounterBroken />
    </Lab4Demo>
  );
}

export function CounterEmbed() {
  return (
    <Lab4Demo label="Counter.tsx">
      <Counter />
    </Lab4Demo>
  );
}

export function BooleanStateEmbed() {
  return (
    <Lab4Demo label="BooleanStateVariables.tsx">
      <BooleanStateVariables />
    </Lab4Demo>
  );
}

export function StringStateEmbed() {
  return (
    <Lab4Demo label="StringStateVariables.tsx">
      <StringStateVariables />
    </Lab4Demo>
  );
}

export function DateStateEmbed() {
  return (
    <Lab4Demo label="DateStateVariable.tsx">
      <DateStateVariable />
    </Lab4Demo>
  );
}

export function ObjectStateEmbed() {
  return (
    <Lab4Demo label="ObjectStateVariable.tsx">
      <ObjectStateVariable />
    </Lab4Demo>
  );
}

export function ArrayStateEmbed() {
  return (
    <Lab4Demo label="ArrayStateVariable.tsx">
      <ArrayStateVariable />
    </Lab4Demo>
  );
}

export function ParentChildStateEmbed() {
  return (
    <Lab4Demo label="ParentStateComponent.tsx">
      <ParentStateComponent />
    </Lab4Demo>
  );
}

export function PropDrillingEmbed() {
  return (
    <Lab4Demo label="PropDrilling.tsx">
      <PropDrilling />
    </Lab4Demo>
  );
}

export function UrlEncodingEmbed() {
  return (
    <Lab4Demo label="UrlEncoding.tsx">
      <UrlEncoding />
    </Lab4Demo>
  );
}

export function ContextCounterEmbed() {
  return (
    <Lab4Demo label="context/ContextExamples.tsx">
      <ContextExamples />
    </Lab4Demo>
  );
}

export function ZustandCounterEmbed() {
  return (
    <Lab4Demo label="zustand/ZustandCounter.tsx">
      <ZustandCounter />
    </Lab4Demo>
  );
}

export function ZustandTodosEmbed() {
  return (
    <Lab4Demo label="zustand/ZustandTodoList.tsx">
      <ZustandTodoList />
    </Lab4Demo>
  );
}

export function UseEffectEmbed() {
  return (
    <Lab4Demo label="Effect.tsx">
      <Effect />
    </Lab4Demo>
  );
}

type DemoCourse = {
  _id: string;
  name: string;
  description: string;
};

const seedCourses: DemoCourse[] = [
  { _id: "RS101", name: "Rocket Propulsion", description: "Fundamentals" },
  { _id: "RS102", name: "Aerodynamics", description: "Airflow and lift" },
];

/**
 * Isolated dashboard CRUD — local useState only.
 * Do not import the live Kambaz Dashboard (HTTP client) or coursesStore
 * (shared singleton) into the slide bundle.
 */
export function KambazCoursesCrudEmbed() {
  const [courses, setCourses] = useState(seedCourses);
  const [draft, setDraft] = useState<DemoCourse>({
    _id: "0",
    name: "New Course",
    description: "New Description",
  });

  return (
    <LectureDemoFrame label="Dashboard CRUD preview" url="/dashboard">
      <div id="wd-dashboard" className="font-sans text-base">
        <h2 className="mt-0">New Course</h2>
        <div className="mb-2 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
            id="wd-add-new-course-click"
            onClick={() =>
              setCourses([
                ...courses,
                { ...draft, _id: crypto.randomUUID() },
              ])
            }
          >
            Add
          </button>
          <button
            type="button"
            className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
            id="wd-update-course-click"
            onClick={() =>
              setCourses(
                courses.map((course) =>
                  course._id === draft._id ? draft : course,
                ),
              )
            }
          >
            Update
          </button>
        </div>
        <input
          className="mb-2 block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          id="wd-course-name"
        />
        <p id="wd-dashboard-published" className="mb-2 font-semibold">
          Published Courses ({courses.length})
        </p>
        <ul className="m-0 list-none p-0">
          {courses.map((course) => (
            <li
              key={course._id}
              className="mb-1 flex items-center justify-between rounded border border-neutral-200 px-3 py-1"
            >
              <span>{course.name}</span>
              <span className="flex gap-2">
                <button
                  type="button"
                  className="rounded bg-yellow-400 px-2 py-0.5 text-sm"
                  onClick={() => setDraft(course)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded bg-red-600 px-2 py-0.5 text-sm font-medium text-white"
                  id="wd-delete-course-click"
                  onClick={() =>
                    setCourses(courses.filter((row) => row._id !== course._id))
                  }
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </LectureDemoFrame>
  );
}
