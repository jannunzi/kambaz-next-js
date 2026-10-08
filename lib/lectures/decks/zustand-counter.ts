import type { LectureSlide } from "../types";

export const ZUSTAND_COUNTER_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Zustand Counter",
      "§4.5.1 · a store hook with no Provider",
    ],
  },
  {
    id: "purpose",
    title: "Bear-bones shared state",
    kind: "content",
    bullets: [
      "Zustand’s own joke about bears — not a misspelling of bare",
      "German for state. This is the store Kambaz will keep",
      "`create` returns a hook. No Provider around the tree",
      "Select each field so a todo title does not re-render a counter",
      "Install once from §4.2: `npm install zustand`",
    ],
  },
  {
    id: "store",
    title: "State and functions on one object",
    kind: "content",
    bullets: [
      "`set` takes a partial next state or a function of the previous",
      "`up` / `down` use the function form so they never close over a stale count",
      "Seed `count: 7` — same integer as Context and `useState`",
    ],
    code: `"use client";

import { create } from "zustand";

type CounterStore = {
  count: number;
  up: () => void;
  down: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 7,
  up: () => set((state) => ({ count: state.count + 1 })),
  down: () => set((state) => ({ count: state.count - 1 })),
}));`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/zustand/counterStore.ts",
    codeHighlightLines: [[11, 15]],
  },
  {
    id: "component",
    title: "Select count, up, and down",
    kind: "demo",
    bullets: [
      "Three selector calls — this component rerenders when `count` changes",
      "`onClick={up}` — the store already owns the increment",
      "Import through `ZustandExamples` on the Lab 4 page",
    ],
    code: `"use client";

import { useCounterStore } from "./counterStore";

export default function ZustandCounter() {
  const count = useCounterStore((state) => state.count);
  const up = useCounterStore((state) => state.up);
  const down = useCounterStore((state) => state.down);
  return (
    <div id="wd-zustand-counter">
      <h3>Zustand Counter: {count}</h3>
      <button type="button" onClick={up} id="wd-zustand-up-click">
        Up
      </button>
      <button type="button" onClick={down} id="wd-zustand-down-click">
        Down
      </button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/zustand/ZustandCounter.tsx",
    codeHighlightLines: [[6, 8], 12, 15],
    embed: "zustand-counter",
  },
  {
    id: "recap",
    title: "Zustand counter recap",
    kind: "content",
    bullets: [
      "Import the hook. No wrap. Select the slices you read",
      "`set((state) => …)` when the next value depends on the last",
      "Context still wins for a rare, tree-wide value like who is signed in",
    ],
  },
  {
    id: "next-up",
    title: "Next: a Zustand todo list",
    kind: "title",
    bullets: [
      "Array plus a draft, then add / update / delete",
      "§4.5.2: the CRUD Kambaz will reuse for courses",
    ],
  },
];
