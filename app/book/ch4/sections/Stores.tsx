import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import OfficialLink from "../../components/OfficialLink";
import { OnYourOwn, WithAI } from "../../components/Practice";
import ContextExamples from "@/app/labs/lab4/context/ContextExamples";
import ZustandExamples from "@/app/labs/lab4/zustand/ZustandExamples";
import ReduxExamples from "@/app/labs/lab4/redux/ReduxExamples";

export default function Stores() {
  return (
    <>
      <Section id="sec-4-4" title="4.4 React Context">
        <p>
          React Context provides a way to share state across the component
          tree without manually passing props through every level, the
          problem known as prop drilling that{" "}
          <SectionLink to="4.3.2" />{" "}just made visible. Unlike Redux,
          React Context is built directly into React. A parent publishes a
          value that any descendant can read without listing it on every
          component in between. That is the right tool for a theme, the
          signed-in user, or the current course id — data that is stable
          and read in a subtree. It is the wrong tool for a list that
          every keystroke rewrites: every consumer re-renders when the
          value changes. Put todos, modules, and courses in Zustand
          instead. Kambaz will use this same provider pattern for who is
          signed in (<SectionLink to="4.10.5" />
          ), not for the course list.
        </p>
        <p>
          The pattern is a context, a provider that holds{" "}
          <code>useState</code>, and a hook that throws if you forget the
          provider. You create the context with{" "}
          <code>createContext</code>, wrap the subtree that should see
          the value in a <code>Provider</code>, and read the value with{" "}
          <code>useContext</code>{" "}or a small custom hook that checks
          the provider is present. To practice, we will reimplement the
          Counter using React Context, then you will rebuild the todo list
          on your own so you can feel the difference between Context and
          the stores that follow.
        </p>

        <Section
          level={3}
          id="sec-4-4-1"
          title="4.4.1 Counter Context"
        >
          <p>
            To practice, let&apos;s reimplement the Counter using React
            Context. Create a <code>CounterContext.tsx</code>{" "}that
            defines the state and functions, then provides them to child
            components. The provider holds the same{" "}
            <code>useState(7)</code>{" "}you already wrote in{" "}
            <SectionLink to="4.2.4" />, but any descendant can now call{" "}
            <code>useCounterContext</code>{" "}instead of receiving{" "}
            <code>count</code>{" "}as a prop. Implement the context file
            below, then the two sibling components that read and write
            through it.
          </p>
          <CodeBlock
            language="tsx"
            name="CounterContext"
            file="app/labs/lab4/context/CounterContext.tsx"
          >{`"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type CounterContextValue = {
  count: number;
  setCount: (count: number) => void;
};

const CounterContext = createContext<CounterContextValue | null>(null);

export function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(7);
  return (
    <CounterContext.Provider value={{ count, setCount }}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounterContext() {
  const value = useContext(CounterContext);
  if (!value) {
    throw new Error("useCounterContext must be used inside CounterProvider");
  }
  return value;
}`}</CodeBlock>
          <p>
            The custom hook is a small courtesy: if you render a reader
            or writer outside the provider, you get a clear error instead
            of a silent <code>null</code>. Two siblings can then share
            the counter without either receiving <code>count</code>{" "}as
            a prop. Create <code>ContextCounterRead</code>{" "}and{" "}
            <code>ContextCounterWrite</code>{" "}as shown, then gather
            them inside a <code>ContextExamples</code>{" "}page wrapped in{" "}
            <code>CounterProvider</code>. Import{" "}
            <code>ContextExamples</code>{" "}from the Lab 4 page and
            confirm you can increment and decrement the counter.
          </p>
          <CodeBlock
            language="tsx"
            name="ContextCounterRead"
            file="app/labs/lab4/context/ContextCounterRead.tsx"
          >{`"use client";

import { useCounterContext } from "./CounterContext";

export default function ContextCounterRead() {
  const { count } = useCounterContext();
  return (
    <div id="wd-context-counter-read">
      <h3>Reader: {count}</h3>
    </div>
  );
}`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="ContextCounterWrite"
            file="app/labs/lab4/context/ContextCounterWrite.tsx"
          >{`"use client";

import { useCounterContext } from "./CounterContext";

export default function ContextCounterWrite() {
  const { count, setCount } = useCounterContext();
  return (
    <div id="wd-context-counter-write">
      <h3>Writer</h3>
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        id="wd-context-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => setCount(count - 1)}
        id="wd-context-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
    </div>
  );
}`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="ContextExamples"
            file="app/labs/lab4/context/ContextExamples.tsx"
          >{`"use client";

import { CounterProvider } from "./CounterContext";
import ContextCounterRead from "./ContextCounterRead";
import ContextCounterWrite from "./ContextCounterWrite";

export default function ContextExamples() {
  return (
    <div id="wd-context-examples">
      <h2>React Context</h2>
      <p>
        Two siblings share one counter without the parent passing props
        through the middle.
      </p>
      <CounterProvider>
        <ContextCounterRead />
        <ContextCounterWrite />
      </CounterProvider>
      <hr />
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="ContextExamples"
            file="app/labs/lab4/context/ContextExamples.tsx"
            mode="styled"
          >
            <ContextExamples />
          </LiveDemo>
          <p>
            Click Up in the writer and confirm the reader heading
            updates. The middle of the tree —{" "}
            <code>ContextExamples</code>{" "}itself — never received{" "}
            <code>count</code>{" "}as a prop. The official{" "}
            <OfficialLink href="https://react.dev/learn/passing-data-deeply-with-context">
              Context
            </OfficialLink>{" "}
            guide covers the same provider / consumer split. That is the
            pattern Kambaz will use for the signed-in user: a provider
            near the layout, and screens that call a hook instead of
            threading a user object through Dashboard, Profile, and the
            navigation.
          </p>
          <OnYourOwn>
            Add a Reset control that sets the context count back to 7. Keep
            the Kambaz database out of Context — that list belongs in the
            Zustand store in <SectionLink to="4.5" />.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab4/context/ContextCounterWrite.tsx, keep any extra button I added. After Down, add a sample button id="wd-context-reset-click" that calls setCount(7). Do not put courses or todos in this context. Do not rename my personal button.`}
          >
            Ask the assistant to add a sample Reset on the writer:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-4-4-2"
          title="4.4.2 Implementing a React Context Todo List (On Your Own)"
        >
          <p>
            To practice creating stateful components with React Context,
            create a Todo List component like the one you will later
            create with Redux and Zustand. The component should allow
            creating new todo items, updating their title, and deleting
            the todos. Rebuild that list with Context
            so you can feel the difference: a{" "}
            <code>todosContext</code>{" "}holds the array and the add /
            update / delete functions, and a{" "}
            <code>ReactContextTodoList</code>{" "}renders the list. Wrap
            it in the provider on the Context examples page. Your
            implementation should have at least the following files, but
            feel free to create additional files if you think you need
            more: <code>todosContext.ts</code>{" "}implements the context
            and provider that maintains the state for the todos, and{" "}
            <code>ReactContextTodoList.tsx</code>{" "}renders the todos
            allowing users to create, update, and delete them. Add the
            list to <code>ContextExamples</code>{" "}and confirm you can
            navigate and interact with it. Do not put Kambaz courses in
            this context — that list belongs in Zustand.
          </p>
          <OnYourOwn>
            Implement <code>todosContext.ts</code> and{" "}
            <code>ReactContextTodoList.tsx</code>. Add, edit titles,
            and delete items. Do not put Kambaz courses in this
            context.
          </OnYourOwn>
          <WithAI
            prompt={`Create app/labs/lab4/context/todosContext.ts and ReactContextTodoList.tsx with add/update/delete for { id, title } todos, wrap the list in a provider, and import it from ContextExamples. Keep any extra context I already added. Do not store Kambaz courses here.`}
          >
            After you sketch the context, you can ask the assistant
            for a sample list — leave the design as yours:
          </WithAI>
        </Section>
      </Section>

      <Section id="sec-4-5" title="4.5 Zustand">
        <p>
          Zustand is a lightweight, fast, and scalable state management
          library for React applications. Often described as
          &quot;bear-bones&quot; state management — the library&apos;s
          own joke about bears, not a typo for bare — it provides a
          simple hook-based API that eliminates much of the boilerplate
          found in alternatives like Redux. You create a store using the{" "}
          <code>create</code>{" "}function from Zustand, and the resulting
          hook lets you read and update state anywhere in your app
          without needing a Provider component or complex setup. There is
          no provider to wrap the tree, no action types, and no
          boilerplate slice file unless you want one. Components
          subscribe to the fields they read, so a todo title change does
          not have to re-render a counter. This is the store Kambaz will
          use for courses and modules in <SectionLink to="4.10" />,
          while the signed-in user lives in Context. First, install
          Zustand from the root of your project if you have not already
          — the install command in <SectionLink to="4.2" />{" "}already
          included it:
        </p>
        <CodeBlock language="shell">{`npm install zustand`}</CodeBlock>
        <p>
          The library&apos;s name is Zustand — German for state — and
          that is the spelling this book uses from here on.
        </p>

        <Section
          level={3}
          id="sec-4-5-1"
          title="4.5.1 Zustand Counter"
        >
          <p>
            Let&apos;s reimplement the same counter example to compare
            Zustand with the equivalent implementations already written
            with React Context and, in the next section, Redux. Create
            the Zustand store shown below where we will keep the state of
            the counter. The store is created with <code>create</code>.
            State and functions live on the same object, and you select
            each field so the component re-renders only when that field
            changes. Implement <code>counterStore.ts</code>, then a{" "}
            <code>ZustandCounter</code>{" "}component that uses the hook
            to access the state in the store. Import both through{" "}
            <code>ZustandExamples</code>{" "}from the Lab 4 page and
            confirm you can update the Zustand counter.
          </p>
          <CodeBlock
            language="tsx"
            name="counterStore"
            file="app/labs/lab4/zustand/counterStore.ts"
          >{`"use client";

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
}));`}</CodeBlock>
          <p>
            The <code>set</code>{" "}function receives either a partial
            next state or a function of the previous state.{" "}
            <code>up</code>{" "}and <code>down</code>{" "}use the function
            form so they can read <code>state.count</code>{" "}without
            closing over a stale value. Now create the component that
            uses the hook:
          </p>
          <CodeBlock
            language="tsx"
            name="ZustandCounter"
            file="app/labs/lab4/zustand/ZustandCounter.tsx"
          >{`"use client";

import { useCounterStore } from "./counterStore";

export default function ZustandCounter() {
  const count = useCounterStore((state) => state.count);
  const up = useCounterStore((state) => state.up);
  const down = useCounterStore((state) => state.down);
  return (
    <div id="wd-zustand-counter">
      <h3>Zustand Counter: {count}</h3>
      <button
        type="button"
        onClick={up}
        id="wd-zustand-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={down}
        id="wd-zustand-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
    </div>
  );
}`}</CodeBlock>
          <p>
            Each call to <code>useCounterStore</code>{" "}passes a
            selector. Selecting <code>state.count</code>{" "}means this
            component rerenders when the count changes, not when some
            other field on a larger store would change. That is the
            difference from Context, where every consumer of the provider
            value rerenders together. Click Up and Down once the examples
            page is wired and confirm the heading moves the same way the{" "}
            <code>useState</code>{" "}counter did.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-5-2"
          title="4.5.2 Zustand Todo List"
        >
          <p>
            To practice creating stateful components with Zustand, create
            a Todo List component like the one you will also build with
            Redux as literacy. The component should allow creating new
            todo items, updating their title, and deleting the todos. The
            worked example below puts the same CRUD in front of you
            before Kambaz uses it for courses. The list is an array in
            the store, a draft object for the form, and functions that
            add, update, and delete.{" "}
            <code>ZustandTodoForm</code>{" "}and{" "}
            <code>ZustandTodoItem</code>{" "}do not receive those functions
            as props — they call the store hook themselves. Your
            implementation should have at least a store file and a list
            component; the worked example also splits the form and the
            item so each file stays small. Implement{" "}
            <code>todoStore.ts</code>, the form, the item, and the list,
            then add <code>ZustandTodoList</code>{" "}to{" "}
            <code>ZustandExamples</code>{" "}and confirm you can navigate
            and interact with it.
          </p>
          <CodeBlock
            language="tsx"
            name="todoStore"
            file="app/labs/lab4/zustand/todoStore.ts"
          >{`"use client";

import { create } from "zustand";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
};

type TodoStore = {
  todos: Todo[];
  todo: Todo;
  setTodo: (todo: Todo) => void;
  addTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (todo: Todo) => void;
};

const emptyTodo: Todo = { id: "-1", title: "Learn Zustand", done: false };

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [
    { id: "1", title: "Learn HTML", done: true },
    { id: "2", title: "Learn CSS", done: true },
    { id: "3", title: "Learn JavaScript", done: false },
  ],
  todo: emptyTodo,
  setTodo: (todo) => set({ todo }),
  addTodo: (todo) =>
    set((state) => ({
      todos: [...state.todos, { ...todo, id: crypto.randomUUID() }],
      todo: emptyTodo,
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
  updateTodo: (todo) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todo.id ? todo : t)),
      todo: emptyTodo,
    })),
}));`}</CodeBlock>
          <p>
            <code>addTodo</code>{" "}spreads the previous array and
            appends a copy of the draft with a new id, then clears the
            draft. <code>deleteTodo</code>{" "}filters by id.{" "}
            <code>updateTodo</code>{" "}maps over the array and replaces
            the matching item. Those are the same three array operations
            you practiced in <SectionLink to="4.2.9" />, now living in a
            store any Client Component can import. The form binds the
            draft title and calls add or update; the item calls set and
            delete:
          </p>
          <CodeBlock
            language="tsx"
            name="ZustandTodoForm"
            file="app/labs/lab4/zustand/ZustandTodoForm.tsx"
          >{`"use client";

import { useTodoStore } from "./todoStore";

export default function ZustandTodoForm() {
  const todo = useTodoStore((state) => state.todo);
  const setTodo = useTodoStore((state) => state.setTodo);
  const addTodo = useTodoStore((state) => state.addTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  return (
    <div id="wd-zustand-todo-form" className="mb-3 flex flex-wrap gap-2">
      <input
        className="rounded border border-neutral-300 px-3 py-1.5"
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
        id="wd-zustand-todo-title"
      />
      <button
        type="button"
        onClick={() => addTodo(todo)}
        id="wd-zustand-add-todo-click"
        className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Add
      </button>
      <button
        type="button"
        onClick={() => updateTodo(todo)}
        id="wd-zustand-update-todo-click"
        className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
      >
        Update
      </button>
    </div>
  );
}`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="ZustandTodoItem"
            file="app/labs/lab4/zustand/ZustandTodoItem.tsx"
          >{`"use client";

import { useTodoStore, type Todo } from "./todoStore";

export default function ZustandTodoItem({ todo }: { todo: Todo }) {
  const setTodo = useTodoStore((state) => state.setTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  return (
    <li
      id={\`wd-zustand-todo-\${todo.id}\`}
      className="mb-1 flex items-center justify-between rounded border border-neutral-200 px-3 py-1"
    >
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={todo.done} readOnly />
        <span className={todo.done ? "line-through" : undefined}>{todo.title}</span>
      </label>
      <span className="flex gap-2">
        <button
          type="button"
          onClick={() => setTodo(todo)}
          className="rounded bg-yellow-400 px-2 py-0.5 text-sm"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => deleteTodo(todo.id)}
          className="rounded bg-red-600 px-2 py-0.5 text-sm font-medium text-white"
        >
          Delete
        </button>
      </span>
    </li>
  );
}`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="ZustandTodoList"
            file="app/labs/lab4/zustand/ZustandTodoList.tsx"
          >{`"use client";

import { useTodoStore } from "./todoStore";
import ZustandTodoForm from "./ZustandTodoForm";
import ZustandTodoItem from "./ZustandTodoItem";

export default function ZustandTodoList() {
  const todos = useTodoStore((state) => state.todos);
  return (
    <div id="wd-zustand-todo-list">
      <h3>Zustand Todo List</h3>
      <ZustandTodoForm />
      <ul className="m-0 max-w-lg list-none p-0">
        {todos.map((todo) => (
          <ZustandTodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}`}</CodeBlock>
          <p>
            Gather the counter and list in{" "}
            <code>ZustandExamples</code>{" "}and import that from Lab 4:
          </p>
          <CodeBlock
            language="tsx"
            name="ZustandExamples"
            file="app/labs/lab4/zustand/ZustandExamples.tsx"
          >{`"use client";

import ZustandCounter from "./ZustandCounter";
import ZustandTodoList from "./ZustandTodoList";

export default function ZustandExamples() {
  return (
    <div id="wd-zustand-examples">
      <h2>Zustand</h2>
      <ZustandCounter />
      <ZustandTodoList />
      <hr />
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="ZustandExamples"
            file="app/labs/lab4/zustand/ZustandExamples.tsx"
            mode="styled"
          >
            <ZustandExamples />
          </LiveDemo>
          <p>
            Add a todo, click Edit, change the title, click Update, then
            Delete. Confirm the list redraws without props from a parent.
            The form and the item never received{" "}
            <code>addTodo</code>{" "}or <code>deleteTodo</code>{" "}as
            attributes; they imported the store. That is the same shape
            Dashboard and Modules will use for Kambaz courses: a store
            file, screens that select the array, and functions that
            spread, map, and filter. See the{" "}
            <OfficialLink href="https://zustand.docs.pmnd.rs/">
              Zustand documentation
            </OfficialLink>{" "}
            for selectors and the <code>set</code>{" "}API.
          </p>
          <OnYourOwn>
            Add a <code>toggleDone(id)</code>{" "}function to the store and a
            checkbox in <code>ZustandTodoItem</code>{" "}that calls it instead
            of a read-only box.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab4/zustand/todoStore.ts and ZustandTodoItem.tsx, keep any extra function I added. Add a sample toggleDone(id: string) that maps todos and flips done for the matching id. Wire the item checkbox onChange to toggleDone(todo.id). Do not rename my personal function.`}
          >
            Ask the assistant to add a sample toggle after your own extra
            action:
          </WithAI>
        </Section>
      </Section>

      <Section id="sec-4-6" title="4.6 Redux Toolkit">
        <p>
          <strong>Managing Application State
          with Redux</strong> covers install, a Hello reducer, a counter that
          dispatches events, passing data to a reducer, then a todo
          list split into form / item / list. Those labs are here so
          you can read a slice when you meet one. You will not port Kambaz to Redux —
          Zustand holds courses and modules, Context holds who is
          signed in. Kambaz courses, modules, and
          account use Zustand stores and an Account Context for the same
          screens and CRUD.
        </p>
        <p>
          The <code>useState</code>{" "}hook is used to maintain the state
          within a component. State can be shared across components by
          passing references to state variables and mutators to other
          components. Although this approach is sufficient as a general
          approach to share state among multiple components, it is
          fraught with challenges when building larger, more complex
          applications. The downside of using <code>useState</code>{" "}
          across multiple components is that it creates an explicit
          dependency between these components, making it hard to
          refactor them as requirements change. The solution is to
          eliminate the dependency using a library such as Redux. This
          section explores the Redux library to manage state that is
          meant to be used across a large set of components, and even an
          entire application. We will keep using <code>useState</code>{" "}
          to manage state within individual components, but use Redux
          here to practice application-level state — the same role
          Zustand plays for Kambaz later in the chapter.
        </p>
        <p>
          To learn about Redux, we will create a Redux examples
          component that will contain several simple Redux examples.
          Create the files under <code>app/labs/lab4/redux/</code>{" "}as
          shown in the subsections that follow. Import the new Redux
          examples component into the Lab 4 component so we can see how
          it renders as we add new examples. Reload the browser and
          confirm the new component renders as expected. The finished
          examples page wraps Hello, Counter, Add, and Todos in a single{" "}
          <code>Provider</code>; we will build the store up one reducer
          at a time.
        </p>

        <Section
          level={3}
          id="sec-4-6-1"
          title="4.6.1 Installing Redux and a Hello World reducer"
        >
          <p>
            As mentioned earlier we will use the Redux state management
            library to handle application state in these literacy labs.
            You already ran the install in <SectionLink to="4.2" />:
          </p>
          <CodeBlock language="shell">{`npm install @reduxjs/toolkit react-redux`}</CodeBlock>
          <p>
            After Redux Toolkit and <code>react-redux</code>{" "}have
            installed, we can declare state outside any particular
            component. Instead of maintaining state within a component,
            Redux declares and manages state in separate{" "}
            <strong>reducers</strong>{" "}which then provide the state to
            the entire application. To learn about Redux, let&apos;s
            start with a simple Hello World example. Create{" "}
            <code>helloReducer</code>{" "}as shown below, maintaining a
            state that consists of just a <code>message</code>{" "}string
            initialized to <code>&quot;Hello Redux&quot;</code>. A Hello
            reducer is a store field with no actions — proof the
            provider and selector are wired. Implement the reducer,
            add it to the store, wrap the examples in a{" "}
            <code>Provider</code>, create <code>HelloRedux</code>,
            import it from <code>ReduxExamples</code>, and confirm it
            renders as shown.
          </p>
          <CodeBlock
            language="tsx"
            name="helloReducer"
            file="app/labs/lab4/redux/helloReducer.ts"
          >{`"use client";
import { createSlice } from "@reduxjs/toolkit";
const helloSlice = createSlice({
  name: "hello",
  initialState: { message: "Hello Redux" },
  reducers: {},
});
export default helloSlice.reducer;`}</CodeBlock>
          <p>
            Application state can maintain data from various components
            or screens across an entire application. Each would have a
            separate reducer that can be combined into a single{" "}
            <strong>store</strong>{" "}where reducers come together to
            create a complex, application-wide state. The{" "}
            <code>store.ts</code>{" "}below demonstrates adding the hello
            reducer to the store. Later exercises add the counter, add,
            and todos reducers to the same object. The application state
            can then be shared with the Web application by wrapping it
            with a <code>Provider</code>{" "}component that makes the
            state data in the store available to all components within
            the Provider&apos;s body.
          </p>
          <CodeBlock
            language="tsx"
            name="store"
            file="app/labs/lab4/redux/store.ts"
          >{`"use client";

import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "./helloReducer";
import counterReducer from "./counterReducer";
import addReducer from "./addReducer";
import todosReducer from "./todosReducer";

export const store = configureStore({
  reducer: {
    helloReducer,
    counterReducer,
    addReducer,
    todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`}</CodeBlock>
          <p>
            Components within the body of the Provider can then select
            the state data they want using the{" "}
            <code>useSelector</code>{" "}hook as shown below. Add the{" "}
            <code>HelloRedux</code>{" "}component to{" "}
            <code>ReduxExamples</code>{" "}and confirm it renders the
            message from the reducer, not a string hardcoded in the
            component.
          </p>
          <CodeBlock
            language="tsx"
            name="HelloRedux"
            file="app/labs/lab4/redux/HelloRedux.tsx"
          >{`"use client";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

export default function HelloRedux() {
  const { message } = useSelector((state: RootState) => state.helloReducer);
  return (
    <div id="wd-hello-redux">
      <h3>Hello Redux</h3>
      <h4>{message}</h4>
    </div>
  );
}`}</CodeBlock>
          <p>
            The selector receives the whole store and returns{" "}
            <code>state.helloReducer</code>. Destructuring{" "}
            <code>message</code>{" "}from that slice is how a component
            reads application state without owning it. There is nothing
            to click yet; the next exercise adds actions.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-6-2"
          title="4.6.2 Counter Redux — dispatching events to reducers"
        >
        <p>
          To practice with Redux, let&apos;s reimplement the Counter
          component using Redux. First create{" "}
          <code>counterReducer</code>{" "}responsible for maintaining the
          counter&apos;s state. Initialize the state variable{" "}
          <code>count</code>{" "}to 7, and reducer functions{" "}
          <code>up</code>{" "}and <code>down</code>{" "}can update the
          state variable by manipulating their <code>state</code>{" "}
          parameter. A slice groups a piece of state with the functions
          that update it. Inside those functions you may write what looks
          like a mutation; Immer, bundled with Toolkit, turns it into a
          new object. The counter you already built with{" "}
          <code>useState</code>{" "}becomes <code>up</code>{" "}and{" "}
          <code>down</code>{" "}actions. Implement the reducer, add it to
          the store, create <code>CounterRedux</code>, add it to{" "}
          <code>ReduxExamples</code>, and confirm it works as expected.
        </p>
        <CodeBlock
          language="tsx"
          name="counterReducer"
          file="app/labs/lab4/redux/counterReducer.ts"
        >{`"use client";

import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 7 },
  reducers: {
    up: (state) => {
      state.count += 1;
    },
    down: (state) => {
      state.count -= 1;
    },
  },
});

export const { up, down } = counterSlice.actions;
export default counterSlice.reducer;`}</CodeBlock>
        <p>
          Exporting <code>up</code>{" "}and <code>down</code>{" "}from{" "}
          <code>counterSlice.actions</code>{" "}gives the user interface
          functions it can dispatch. Adding the reducer to the store —
          already shown in the store file above — makes the
          counter&apos;s state available to all components within the
          body of the Provider. Unlike Zustand, Redux needs a{" "}
          <code>Provider</code>{" "}around the components that call{" "}
          <code>useSelector</code>. Wrap the demo in that provider so
          Lab 4 does not have to wrap the whole page.
        </p>
        <p>
          The <code>CounterRedux</code>{" "}component below can then
          select the <code>count</code>{" "}state from the store using
          the <code>useSelector</code>{" "}hook. To invoke the reducer
          functions <code>up</code>{" "}and <code>down</code>, use a{" "}
          <code>dispatch</code>{" "}function obtained from{" "}
          <code>useDispatch</code>{" "}as shown below. Clicking Up does
          not call <code>setCount</code>; it dispatches the{" "}
          <code>up</code>{" "}action, the reducer updates{" "}
          <code>state.count</code>, and every component that selected
          that slice renders again.
        </p>
        <CodeBlock
          language="tsx"
          name="CounterRedux"
          file="app/labs/lab4/redux/CounterRedux.tsx"
        >{`"use client";

import { useDispatch, useSelector } from "react-redux";
import { down, up } from "./counterReducer";
import type { RootState } from "./store";

export default function CounterRedux() {
  const { count } = useSelector((state: RootState) => state.counterReducer);
  const dispatch = useDispatch();
  return (
    <div id="wd-redux-counter">
      <h3>Redux Counter: {count}</h3>
      <button
        type="button"
        onClick={() => dispatch(up())}
        id="wd-redux-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => dispatch(down())}
        id="wd-redux-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
    </div>
  );
}`}</CodeBlock>
          <p>
            Notice the extra ceremony compared with Zustand: an action
            creator, a dispatch call, a Provider, and a typed{" "}
            <code>RootState</code>. That ceremony is why this course
            puts Kambaz lists on Zustand. The Redux version is still
            worth building once so the vocabulary — slice, action,
            reducer, selector, dispatch — is not a surprise when you
            read someone else&apos;s code.
          </p>
          <OnYourOwn>
            Add a <code>reset</code> reducer that sets{" "}
            <code>count</code> back to 7, export it from the slice,
            and dispatch it from a button.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab4/redux/counterReducer.ts and CounterRedux.tsx, keep any extra reducer I added. Add a sample reset reducer that sets state.count = 7, export it, and add a button id="wd-redux-reset-click" that dispatches reset(). Do not rename my personal reducer.`}
          >
            Ask the assistant to add a sample Reset after your own extra
            action:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-4-6-3"
          title="4.6.3 Passing Data to Reducers"
        >
          <p>
            Now let&apos;s explore how the user interface can pass data
            to reducer functions. Create a reducer that can keep track of
            the arithmetic addition of two parameters. When we call the{" "}
            <code>add</code>{" "}reducer function below, the parameters
            are encoded as an object into a <code>payload</code>{" "}
            property found in the <code>action</code>{" "}parameter passed
            to the reducer. Functions can extract parameters{" "}
            <code>a</code>{" "}and <code>b</code>{" "}as{" "}
            <code>action.payload.a</code>{" "}and{" "}
            <code>action.payload.b</code>{" "}and then use the parameters
            to update the <code>sum</code>{" "}state variable. Add the new
            reducer to the store so it is available throughout the
            examples. Keep <code>a</code>{" "}and <code>b</code>{" "}as
            local <code>useState</code>, then dispatch one object to
            the <code>add</code>{" "}reducer that writes{" "}
            <code>sum</code>. Implement the reducer and the{" "}
            <code>AddRedux</code>{" "}component, add{" "}
            <code>AddRedux</code>{" "}to <code>ReduxExamples</code>, and
            confirm it works as expected.
          </p>
          <CodeBlock
            language="tsx"
            name="addReducer"
            file="app/labs/lab4/redux/addReducer.ts"
          >{`"use client";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
const addSlice = createSlice({
  name: "add",
  initialState: { sum: 0 },
  reducers: {
    add: (state, action: PayloadAction<{ a: number; b: number }>) => {
      state.sum = action.payload.a + action.payload.b;
    },
  },
});
export const { add } = addSlice.actions;
export default addSlice.reducer;`}</CodeBlock>
          <p>
            To try out the new reducer, import the{" "}
            <code>add</code>{" "}action as shown in the{" "}
            <code>AddRedux</code>{" "}component below. Maintain the values
            of <code>a</code>{" "}and <code>b</code>{" "}as local
            component state variables — they are only relevant while
            you are typing in this form — and then pass them to{" "}
            <code>add</code>{" "}as a single object. The heading reads{" "}
            <code>sum</code>{" "}from the store with{" "}
            <code>useSelector</code>. On click,{" "}
            <code>{`dispatch(add({ a, b }))`}</code>{" "}sends the payload
            to the reducer, which computes the arithmetic addition and
            stores it in the application state variable{" "}
            <code>sum</code>.
          </p>
          <CodeBlock
            language="tsx"
            name="AddRedux"
            file="app/labs/lab4/redux/AddRedux.tsx"
          >{`"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add } from "./addReducer";
import type { RootState } from "./store";

export default function AddRedux() {
  const [a, setA] = useState(12);
  const [b, setB] = useState(23);
  const { sum } = useSelector((state: RootState) => state.addReducer);
  const dispatch = useDispatch();
  return (
    <div id="wd-add-redux">
      <h3>Add Redux</h3>
      <input
        type="number"
        id="wd-add-redux-a"
        className="me-2 rounded border border-neutral-300 px-2 py-1"
        value={a}
        onChange={(e) => setA(Number(e.target.value))}
      />
      <input
        type="number"
        id="wd-add-redux-b"
        className="me-2 rounded border border-neutral-300 px-2 py-1"
        value={b}
        onChange={(e) => setB(Number(e.target.value))}
      />
      <button
        type="button"
        id="wd-add-redux-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        onClick={() => dispatch(add({ a, b }))}
      >
        Add Redux
      </button>
      <h4 id="wd-add-redux-sum">Sum: {sum}</h4>
    </div>
  );
}`}</CodeBlock>
          <p>
            Change the two numbers and click Add Redux. The inputs are
            local; the sum is application state. That split — draft in{" "}
            <code>useState</code>, shared result in the store — is
            the same split you will use when a Kambaz form holds a
            course name locally until Add writes it into the Zustand
            courses array.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-6-4"
          title="4.6.4 Implementing a Todo List with Redux"
        >
          <p>
            Let&apos;s practice using local component state as well as
            application-level state to implement a simple Todo List
            component. First we will think through the component using
            only component state with <code>useState</code>, which
            would limit the todos to only being available within the
            Todo List. We will then add application state support to
            demonstrate how the todos can be shared with any component
            or screen in the application. Build that path in
            three steps: a single <code>TodoList</code>{" "}with{" "}
            <code>useState</code>, then a split into{" "}
            <code>TodoForm</code>{" "}and <code>TodoItem</code>, then a{" "}
            <code>todosReducer</code>{" "}so the array lives in the store.
            The worked example here is already on the third step — a
            slice with <code>addTodo</code>,{" "}
            <code>deleteTodo</code>, and <code>updateTodo</code>, and
            a component that dispatches those actions — but the
            reasoning of the first two steps still matters, so we will
            walk them before the code.
          </p>
          <p>
            With only <code>useState</code>, you would declare a{" "}
            <code>todos</code>{" "}array initialized with a couple of
            items, a draft <code>todo</code>{" "}object for the form, and
            three handlers. <code>addTodo</code>{" "}would spread the
            existing todos, append a copy of the draft with a new id,
            and clear the draft. <code>deleteTodo</code>{" "}would filter
            the array by id. <code>updateTodo</code>{" "}would map over
            the array and replace the matching item. The form would bind
            the draft title; each row would offer Edit, which copies the
            row into the draft, and Delete. That is exactly the array
            work from <SectionLink to="4.2.9" />{" "}and the object work
            from <SectionLink to="4.2.8" />. It works, and it might be
            all you need if the list never leaves this screen.
          </p>
          <p>
            The next step, Breaking up Large Components,
            splits that one file into <code>TodoItem</code>{" "}and{" "}
            <code>TodoForm</code>. The item accepts references to the
            todo object as well as <code>deleteTodo</code>{" "}and{" "}
            <code>setTodo</code>. The form accepts{" "}
            <code>todo</code>, <code>setTodo</code>,{" "}
            <code>addTodo</code>, and <code>updateTodo</code>. The
            list then renders the form once and maps the array to items,
            passing state variables and event handlers so the smaller
            components can communicate with the list&apos;s data. That
            split is good structure, but it is also prop drilling: every
            handler has to travel through the list even though the form
            and the item are the ones that click.
          </p>
          <p>
            Although that Todo List might work as expected, its
            implementation makes it difficult to share the local state
            data — the todos — outside its context with other
            components or screens. For instance, how would we go about
            accessing and displaying the todos in Lab 3 or in Kambaz? We
            would have to move the todos state variable and mutator
            functions to a component that is parent to both screens, for
            example Labs or even the root layout. Instead, let&apos;s
            move the state and functions from the list into a reducer
            and store so that the todos can be accessed from anywhere
            within the labs. Create <code>todosReducer</code>{" "}as shown
            below, moving the todos array to the reducer&apos;s{" "}
            <code>initialState</code>. Also move{" "}
            <code>addTodo</code>, <code>deleteTodo</code>, and{" "}
            <code>updateTodo</code>{" "}into the <code>reducers</code>{" "}
            property, reimplementing them to use the{" "}
            <code>state</code>{" "}and <code>action</code>{" "}parameters
            of the new reducer functions. Add the new{" "}
            <code>todosReducer</code>{" "}to the store so that it can be
            provided to the rest of the examples. Implement the reducer
            and <code>ReduxTodos</code>, import them through{" "}
            <code>ReduxExamples</code>, and confirm the list behaves as
            before.
          </p>
          <CodeBlock
            language="tsx"
            name="todosReducer"
            file="app/labs/lab4/redux/todosReducer.ts"
          >{`"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ReduxTodo = { id: string; title: string };

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [
      { id: "1", title: "Learn HTML" },
      { id: "2", title: "Learn CSS" },
      { id: "3", title: "Learn JavaScript" },
    ] as ReduxTodo[],
  },
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({ id: crypto.randomUUID(), title: action.payload });
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },
    updateTodo: (state, action: PayloadAction<ReduxTodo>) => {
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) todo.title = action.payload.title;
    },
  },
});

export const { addTodo, deleteTodo, updateTodo } = todosSlice.actions;
export default todosSlice.reducer;`}</CodeBlock>
          <p>
            <code>addTodo</code>{" "}receives the new title as the
            payload and pushes a todo with a generated id.{" "}
            <code>deleteTodo</code>{" "}receives the id and filters it
            out. <code>updateTodo</code>{" "}receives the whole todo and
            overwrites the matching title. Immer lets those reducers
            look like mutations; the store still stores a new state
            object. Now that we have moved the state and mutator
            functions to the reducer, the list component selects{" "}
            <code>todos</code>{" "}and dispatches the actions instead of
            owning <code>useState</code>. The draft title can stay
            local — it is only relevant while you are typing — the
            same way <code>a</code>{" "}and <code>b</code>{" "}stayed
            local in Add Redux.
          </p>
          <CodeBlock
            language="tsx"
            name="ReduxTodos"
            file="app/labs/lab4/redux/ReduxTodos.tsx"
          >{`"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, deleteTodo, updateTodo } from "./todosReducer";
import type { RootState } from "./store";

export default function ReduxTodos() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("Learn Mongo");
  const [editingId, setEditingId] = useState<string | null>(null);
  return (
    <div id="wd-redux-todos">
      <h3>Redux Todo List</h3>
      <div className="mb-2 flex flex-wrap gap-2">
        <input
          id="wd-redux-todo-title"
          className="rounded border border-neutral-300 px-2 py-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="button"
          id="wd-redux-add-todo"
          className="rounded bg-green-600 px-3 py-1.5 text-sm text-white"
          onClick={() => {
            if (editingId) {
              dispatch(updateTodo({ id: editingId, title }));
              setEditingId(null);
            } else {
              dispatch(addTodo(title));
            }
            setTitle("Learn Mongo");
          }}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>
      <ul className="m-0 max-w-lg list-none p-0">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="mb-1 flex items-center justify-between rounded border border-neutral-200 px-3 py-1"
          >
            <span>{todo.title}</span>
            <span className="flex gap-2">
              <button
                type="button"
                className="rounded bg-yellow-400 px-2 py-0.5 text-sm"
                onClick={() => {
                  setTitle(todo.title);
                  setEditingId(todo.id);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded bg-red-600 px-2 py-0.5 text-sm text-white"
                onClick={() => dispatch(deleteTodo(todo.id))}
              >
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}`}</CodeBlock>
          <p>
            Gather Hello, the counter, Add with a payload, and the todo
            list in <code>ReduxExamples</code>, wrap them in the{" "}
            <code>Provider</code>, and import that from Lab 4. Confirm
            you can add, edit, and delete todos, and that the Hello
            message and the counter still render from the same store.
          </p>
          <CodeBlock
            language="tsx"
            name="ReduxExamples"
            file="app/labs/lab4/redux/ReduxExamples.tsx"
          >{`"use client";
import { Provider } from "react-redux";
import { store } from "./store";
import HelloRedux from "./HelloRedux";
import CounterRedux from "./CounterRedux";
import AddRedux from "./AddRedux";
import ReduxTodos from "./ReduxTodos";

export default function ReduxExamples() {
  return (
    <Provider store={store}>
      <div id="wd-redux-examples">
        <h2>Redux Toolkit</h2>
        <HelloRedux />
        <CounterRedux />
        <AddRedux />
        <ReduxTodos />
        <hr />
      </div>
    </Provider>
  );
}`}</CodeBlock>
          <LiveDemo
            name="ReduxExamples"
            file="app/labs/lab4/redux/ReduxExamples.tsx"
            mode="styled"
          >
            <ReduxExamples />
          </LiveDemo>
          <p>
            Hello, counter, add-with-payload, and todos share one
            store and one <code>Provider</code>. Now the todos are
            available to any component in the body of that Provider.
            You can illustrate the point by selecting the same{" "}
            <code>todos</code>{" "}from inside the Lab 4{" "}
            <code>ArrayStateVariable</code>{" "}component so the titles
            appear under the integer list. Try that as an
            extra: import <code>useSelector</code>, read{" "}
            <code>state.todosReducer.todos</code>, and render the
            titles — but only if you also wrap that part of the tree in
            the same Provider. That extra setup is why Kambaz uses
            Zustand. You will implement those screens with Zustand
            in <SectionLink to="4.10" />. The{" "}
            <OfficialLink href="https://redux-toolkit.js.org/">
              Redux Toolkit
            </OfficialLink>{" "}
            quick start matches this slice-and-store shape.
          </p>
          <OnYourOwn>
            Split <code>ReduxTodos</code> into a form component and
            an item component.
          </OnYourOwn>
        </Section>
      </Section>
    </>
  );
}
