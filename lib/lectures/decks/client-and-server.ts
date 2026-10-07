import type { LectureSlide } from "../types";

export const CLIENT_AND_SERVER_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Client and Server",
      "§3.6 · where the component is allowed to run",
    ],
  },
  {
    id: "purpose",
    title: "Server by default, client on purpose",
    kind: "content",
    bullets: [
      "Next.js components are **Server Components** unless you say otherwise",
      "They render on the server, send HTML, and can read disk and env",
      "They cannot use hooks, clicks, or `usePathname`",
      "Add `\"use client\"` as the **first** statement to make a **Client Component**",
      "A Client Component still renders once on the server for the first HTML, then **hydrates** — React attaches to that HTML and keeps it running in the browser",
    ],
  },
  {
    id: "client",
    title: "usePathname needs a Client Component",
    kind: "demo",
    bullets: [
      "`usePathname` reads the address bar — hooks only work in Client Components",
      "Remove the directive and `next dev` or `next build` stops: the hook needs `\"use client\"`",
      "View Source on `/labs/lab3` still shows the pathname text — rendered on the server first",
      "Embedded here the path is the slides route; Lab 3 shows `/labs/lab3`",
    ],
    code: `"use client";

import { usePathname } from "next/navigation";

export default function ClientComponentDemo() {
  const pathname = usePathname();
  return (
    <div id="wd-client-component-demo">
      <h1>Client Component Demo</h1>
      <p>Current pathname: {pathname}</p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ClientComponentDemo.tsx",
    codeHighlightLines: [1, 6],
    embed: "js-client-component",
  },
  {
    id: "lab3-page-3-6-1",
    title: "Add ClientComponentDemo to Lab 3",
    kind: "content",
    bullets: [
      "Import `ClientComponentDemo` and render it last. The Lab 3 page stays a Server Component — no `\"use client\"` there — and can still render a Client Component",
    ],
    code: `import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";
import Styles from "./Styles";
import ClientComponentDemo from "./ClientComponentDemo";

export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
      <Styles />
      <ClientComponentDemo />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [32, 70],
  },
  {
    id: "server",
    title: "The server can read the disk",
    kind: "demo",
    bullets: [
      "`process.platform` and `fs.readdirSync` exist only on Node",
      "Adding `\"use client\"` here would fail — the browser has no `fs`",
      "`try` / `catch` leaves `files` empty if the folder is missing",
      "On Vercel, Lab 3 is prerendered at build time: the time and file list don’t change on refresh. `npm run dev` re-renders every request",
    ],
    code: `import fs from "node:fs";
import path from "node:path";

export default function ServerComponentDemo() {
  const platform = process.platform;
  const nodeVersion = process.version;
  const serverRenderTime = new Date().toLocaleTimeString();
  const lab3Dir = path.join(process.cwd(), "app/labs/lab3");
  let files: string[] = [];
  try {
    files = fs.readdirSync(lab3Dir);
  } catch (error) {
    console.error("Error reading lab3 directory:", error);
    files = [];
  }
  return (
    <div id="wd-server-component-demo">
      <h1>Server Component Demo</h1>
      <h2>Server Render Time</h2>
      <p>Rendered on server at: {serverRenderTime}</p>
      <h2>Server Information</h2>
      <pre>
        {JSON.stringify({ platform, nodeVersion, serverRenderTime }, null, 2)}
      </pre>
      <h2>Filesystem Access Demo</h2>
      <pre>{JSON.stringify(files, null, 2)}</pre>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ServerComponentDemo.tsx",
    codeHighlightLines: [[5, 14], 26],
    embed: "js-server-component",
  },
  {
    id: "lab3-page-3-6-2",
    title: "Add ServerComponentDemo to Lab 3",
    kind: "content",
    bullets: [
      "Import `ServerComponentDemo` after `ClientComponentDemo`, so both demos are on the page",
    ],
    code: `import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";
import Styles from "./Styles";
import ClientComponentDemo from "./ClientComponentDemo";
import ServerComponentDemo from "./ServerComponentDemo";

export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
      <Styles />
      <ClientComponentDemo />
      <ServerComponentDemo />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
    codeAddedLines: [33, 72],
  },
  {
    id: "split",
    title: "A useful mental box",
    kind: "content",
    bullets: [
      "Server components **fetch and format** data",
      "Client components handle **hooks, clicks, and the address bar**",
      "Import both demos into Lab 3 and compare what each can print",
    ],
  },
  {
    id: "recap",
    title: "Client and server recap",
    kind: "content",
    bullets: [
      "Default = server. `\"use client\"` = Client Component, first line of the file",
      "`usePathname` / `useParams` / `onClick` need a client component",
      "`fs`, `process`, and secrets stay on the server",
    ],
  },
  {
    id: "next-up",
    title: "Next: pass data into a component",
    kind: "title",
    bullets: [
      "Attributes become a props object. Children are the body",
      "§3.7: `<Add a={3} b={4} />`, then `Square` and `Highlight`",
    ],
  },
];
