import type { LectureSlide } from "../types";

export const KAMBAZ_COURSES_STORE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · A Courses Store",
      "§4.10.1 · Zustand holds the published list",
    ],
  },
  {
    id: "purpose",
    title: "JSON is still a snapshot",
    kind: "content",
    bullets: [
      "Chapter 3 made Kambaz data-driven. Add / Edit / Delete still do nothing",
      "A module you type on Modules never appears on Home",
      "Each screen is reading a fixed file. Shared lists need a store",
    ],
  },
  {
    id: "where-each",
    title: "Pick the tool that fits",
    kind: "content",
    bullets: [
      "`useState` — form draft, dialog open, one-screen UI",
      "Context — signed-in user (changes at sign-in / sign-out)",
      "Zustand — courses and modules many screens mutate",
      "Redux — historical literacy. Skip it for Kambaz",
    ],
  },
  {
    id: "why-not-local",
    title: "Dashboard useState is not enough",
    kind: "content",
    bullets: [
      "Add would work on Dashboard and nowhere else",
      "Home and the course layout would still import JSON",
      "A course you just created would have no name in the breadcrumb",
    ],
  },
  {
    id: "store",
    title: "Seed from courses.json",
    kind: "content",
    bullets: [
      "`emptyCourse` is the New Course draft — placeholder name and image",
      "`addCourse` spreads the draft and overrides `_id` with `randomUUID()`",
      "`deleteCourse` filters. `updateCourse` maps the matching `_id`",
      "No Provider. Any Client Component imports `useCoursesStore`",
    ],
    code: `"use client";

import { create } from "zustand";
import coursesJson from "../database/courses.json";

export const useCoursesStore = create<CoursesStore>((set) => ({
  courses: coursesJson,
  addCourse: (course) =>
    set((state) => ({
      courses: [
        ...state.courses,
        { ...emptyCourse, ...course, _id: crypto.randomUUID() },
      ],
    })),
  deleteCourse: (courseId) =>
    set((state) => ({
      courses: state.courses.filter((course) => course._id !== courseId),
    })),
  updateCourse: (course) =>
    set((state) => ({
      courses: state.courses.map((c) => (c._id === course._id ? course : c)),
    })),
}));`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/store/coursesStore.ts",
    codeHighlightLines: [[6, 24]],
  },
  {
    id: "demo",
    title: "The list any screen can share",
    kind: "demo",
    bullets: [
      "This preview keeps a sample course list on the slide",
      "The real store lives in `store/coursesStore.ts` — import the hook",
      "Next deck wires Dashboard Add / Edit / Delete to that hook",
    ],
    embed: "kambaz-courses-crud",
  },
  {
    id: "recap",
    title: "Courses store recap",
    kind: "content",
    bullets: [
      "Same CRUD as the Zustand todo list, with course fields",
      "Draft stays local. The published array lives in the store",
      "Do not wrap the Kambaz layout in a store Provider",
    ],
  },
  {
    id: "next-up",
    title: "Next: Dashboard CRUD",
    kind: "title",
    bullets: [
      "Select the store. Keep a local `course` draft for the form",
      "§4.10.2: Add, Delete with `preventDefault`, Edit then Update",
    ],
  },
];
