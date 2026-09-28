import VariablesAndConstants from "@/app/labs/lab3/VariablesAndConstants";
import VariableTypes from "@/app/labs/lab3/VariableTypes";
import BooleanVariables from "@/app/labs/lab3/BooleanVariables";
import IfElse from "@/app/labs/lab3/IfElse";
import TernaryOperator from "@/app/labs/lab3/TernaryOperator";
import ConditionalOutputIfElse from "@/app/labs/lab3/ConditionalOutputIfElse";
import ConditionalOutputInline from "@/app/labs/lab3/ConditionalOutputInline";
import NullUndefined from "@/app/labs/lab3/NullUndefined";
import LegacyFunctions from "@/app/labs/lab3/LegacyFunctions";
import ArrowFunctions from "@/app/labs/lab3/ArrowFunctions";
import ImpliedReturn from "@/app/labs/lab3/ImpliedReturn";
import TemplateLiterals from "@/app/labs/lab3/TemplateLiterals";
import SimpleArrays from "@/app/labs/lab3/SimpleArrays";
import ArrayIndexAndLength from "@/app/labs/lab3/ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "@/app/labs/lab3/AddingAndRemovingToFromArrays";
import ForLoops from "@/app/labs/lab3/ForLoops";
import MapFunction from "@/app/labs/lab3/MapFunction";
import FindFunction from "@/app/labs/lab3/FindFunction";
import FindIndex from "@/app/labs/lab3/FindIndex";
import FilterFunction from "@/app/labs/lab3/FilterFunction";
import IncludesSomeEvery from "@/app/labs/lab3/IncludesSomeEvery";
import ReduceFunction from "@/app/labs/lab3/ReduceFunction";
import JsonStringify from "@/app/labs/lab3/JsonStringify";
import House from "@/app/labs/lab3/House";
import Spreader from "@/app/labs/lab3/Spreader";
import Destructing from "@/app/labs/lab3/Destructing";
import FunctionDestructing from "@/app/labs/lab3/FunctionDestructing";
import DestructingImports from "@/app/labs/lab3/DestructingImports";
import OptionalChaining from "@/app/labs/lab3/OptionalChaining";
import Classes from "@/app/labs/lab3/Classes";
import Styles from "@/app/labs/lab3/Styles";
import ClientComponentDemo from "@/app/labs/lab3/ClientComponentDemo";
import Add from "@/app/labs/lab3/Add";
import Square from "@/app/labs/lab3/Square";
import Highlight from "@/app/labs/lab3/Highlight";
import PathParameters from "@/app/labs/lab3/PathParameters";
import TodoList from "@/app/labs/lab3/todos/TodoList";
import type { ReactNode } from "react";
import LectureDemoFrame from "./LectureDemoFrame";

function Lab3Demo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <LectureDemoFrame label={label} url="/labs/lab3">
      <div className="font-sans text-base [&_h2]:mt-0 [&_h4]:mt-0 [&_h5]:mt-2">
        {children}
      </div>
    </LectureDemoFrame>
  );
}

export function Lab3StubEmbed() {
  return (
    <Lab3Demo label="app/labs/lab3/page.tsx">
      <div id="wd-lab3">
        <h2>Lab 3</h2>
      </div>
    </Lab3Demo>
  );
}

export function JsVariablesEmbed() {
  return (
    <Lab3Demo label="VariablesAndConstants.tsx">
      <VariablesAndConstants />
    </Lab3Demo>
  );
}

export function JsVariableTypesEmbed() {
  return (
    <Lab3Demo label="VariableTypes.tsx">
      <VariableTypes />
    </Lab3Demo>
  );
}

export function JsBooleansEmbed() {
  return (
    <Lab3Demo label="BooleanVariables.tsx">
      <BooleanVariables />
    </Lab3Demo>
  );
}

export function JsIfElseEmbed() {
  return (
    <Lab3Demo label="IfElse.tsx">
      <IfElse />
    </Lab3Demo>
  );
}

export function JsTernaryEmbed() {
  return (
    <Lab3Demo label="TernaryOperator.tsx">
      <TernaryOperator />
    </Lab3Demo>
  );
}

export function JsConditionalIfElseEmbed() {
  return (
    <Lab3Demo label="ConditionalOutputIfElse.tsx">
      <ConditionalOutputIfElse />
    </Lab3Demo>
  );
}

export function JsConditionalInlineEmbed() {
  return (
    <Lab3Demo label="ConditionalOutputInline.tsx">
      <ConditionalOutputInline />
    </Lab3Demo>
  );
}

export function JsNullUndefinedEmbed() {
  return (
    <Lab3Demo label="NullUndefined.tsx">
      <NullUndefined />
    </Lab3Demo>
  );
}

export function JsLegacyFunctionsEmbed() {
  return (
    <Lab3Demo label="LegacyFunctions.tsx">
      <LegacyFunctions />
    </Lab3Demo>
  );
}

export function JsArrowFunctionsEmbed() {
  return (
    <Lab3Demo label="ArrowFunctions.tsx">
      <ArrowFunctions />
    </Lab3Demo>
  );
}

export function JsImpliedReturnEmbed() {
  return (
    <Lab3Demo label="ImpliedReturn.tsx">
      <ImpliedReturn />
    </Lab3Demo>
  );
}

export function JsTemplateLiteralsEmbed() {
  return (
    <Lab3Demo label="TemplateLiterals.tsx">
      <TemplateLiterals />
    </Lab3Demo>
  );
}

export function JsSimpleArraysEmbed() {
  return (
    <Lab3Demo label="SimpleArrays.tsx">
      <SimpleArrays />
    </Lab3Demo>
  );
}

export function JsArrayIndexEmbed() {
  return (
    <Lab3Demo label="ArrayIndexAndLength.tsx">
      <ArrayIndexAndLength />
    </Lab3Demo>
  );
}

export function JsArrayAddRemoveEmbed() {
  return (
    <Lab3Demo label="AddingAndRemovingToFromArrays.tsx">
      <AddingAndRemovingToFromArrays />
    </Lab3Demo>
  );
}

export function JsForLoopsEmbed() {
  return (
    <Lab3Demo label="ForLoops.tsx">
      <ForLoops />
    </Lab3Demo>
  );
}

export function JsMapEmbed() {
  return (
    <Lab3Demo label="MapFunction.tsx">
      <MapFunction />
    </Lab3Demo>
  );
}

export function JsFindEmbed() {
  return (
    <Lab3Demo label="FindFunction.tsx">
      <FindFunction />
    </Lab3Demo>
  );
}

export function JsFindIndexEmbed() {
  return (
    <Lab3Demo label="FindIndex.tsx">
      <FindIndex />
    </Lab3Demo>
  );
}

export function JsFilterEmbed() {
  return (
    <Lab3Demo label="FilterFunction.tsx">
      <FilterFunction />
    </Lab3Demo>
  );
}

export function JsIncludesSomeEveryEmbed() {
  return (
    <Lab3Demo label="IncludesSomeEvery.tsx">
      <IncludesSomeEvery />
    </Lab3Demo>
  );
}

export function JsReduceEmbed() {
  return (
    <Lab3Demo label="ReduceFunction.tsx">
      <ReduceFunction />
    </Lab3Demo>
  );
}

export function JsJsonStringifyEmbed() {
  return (
    <Lab3Demo label="JsonStringify.tsx">
      <JsonStringify />
    </Lab3Demo>
  );
}

export function JsHouseEmbed() {
  return (
    <Lab3Demo label="House.tsx">
      <House />
    </Lab3Demo>
  );
}

export function JsSpreaderEmbed() {
  return (
    <Lab3Demo label="Spreader.tsx">
      <Spreader />
    </Lab3Demo>
  );
}

export function JsDestructingEmbed() {
  return (
    <Lab3Demo label="Destructing.tsx">
      <Destructing />
    </Lab3Demo>
  );
}

export function JsFunctionDestructingEmbed() {
  return (
    <Lab3Demo label="FunctionDestructing.tsx">
      <FunctionDestructing />
    </Lab3Demo>
  );
}

export function JsDestructingImportsEmbed() {
  return (
    <Lab3Demo label="DestructingImports.tsx">
      <DestructingImports />
    </Lab3Demo>
  );
}

export function JsOptionalChainingEmbed() {
  return (
    <Lab3Demo label="OptionalChaining.tsx">
      <OptionalChaining />
    </Lab3Demo>
  );
}

export function JsClassesEmbed() {
  return (
    <Lab3Demo label="Classes.tsx">
      <Classes />
    </Lab3Demo>
  );
}

export function JsStylesEmbed() {
  return (
    <Lab3Demo label="Styles.tsx">
      <Styles />
    </Lab3Demo>
  );
}

export function JsClientComponentEmbed() {
  return (
    <Lab3Demo label="ClientComponentDemo.tsx">
      <ClientComponentDemo />
    </Lab3Demo>
  );
}

export function JsServerComponentEmbed() {
  // LectureDeckShell is a Client Component — do not import ServerComponentDemo
  // (it uses node:fs). Show the same shape; open /labs/lab3 for live disk/process.
  const preview = {
    platform: "linux",
    nodeVersion: "v22",
    serverRenderTime: "from process on the server",
  };
  const files = [
    "Add.tsx",
    "Classes.tsx",
    "House.tsx",
    "Math.ts",
    "ServerComponentDemo.tsx",
    "page.tsx",
  ];
  return (
    <Lab3Demo label="ServerComponentDemo.tsx">
      <div id="wd-server-component-demo">
        <h1>Server Component Demo</h1>
        <h2>Server Render Time</h2>
        <p>Rendered on server at: {preview.serverRenderTime}</p>
        <h2>Server Information</h2>
        <pre>{JSON.stringify(preview, null, 2)}</pre>
        <h2>Filesystem Access Demo</h2>
        <pre>{JSON.stringify(files, null, 2)}</pre>
      </div>
    </Lab3Demo>
  );
}

export function JsAddEmbed() {
  return (
    <Lab3Demo label="Add.tsx">
      <Add a={3} b={4} />
    </Lab3Demo>
  );
}

export function JsSquareEmbed() {
  return (
    <Lab3Demo label="Square.tsx">
      <p>
        Square of 4 = <Square>4</Square>
      </p>
    </Lab3Demo>
  );
}

export function JsHighlightEmbed() {
  return (
    <Lab3Demo label="Highlight.tsx">
      <Highlight>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </Highlight>
    </Lab3Demo>
  );
}

export function JsPathParametersEmbed() {
  return (
    <Lab3Demo label="PathParameters.tsx">
      <PathParameters />
    </Lab3Demo>
  );
}

export function JsTodoListEmbed() {
  return (
    <Lab3Demo label="todos/TodoList.tsx">
      <TodoList />
    </Lab3Demo>
  );
}
