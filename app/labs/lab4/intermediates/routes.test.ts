import assert from "node:assert/strict";
import { createElement, Fragment, isValidElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it } from "node:test";
import {
  AppRouterContext,
  type AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import ClickEvent from "../ClickEvent";
import PassingDataOnEvent from "../PassingDataOnEvent";
import PassingFunctions from "../PassingFunctions";
import PassingFunctionsDemo from "../PassingFunctionsDemo";
import CounterBroken from "../CounterBroken";
import Counter from "../Counter";
import BooleanStateVariables from "../BooleanStateVariables";
import StringStateVariables from "../StringStateVariables";
import DateStateVariable from "../DateStateVariable";
import ObjectStateVariable from "../ObjectStateVariable";
import ArrayStateVariable from "../ArrayStateVariable";
import ParentStateComponent from "../ParentStateComponent";
import ChildStateComponent from "../ChildStateComponent";
import PropDrilling from "../PropDrilling";
import UrlEncoding from "../UrlEncoding";
import Effect from "../Effect";
import ContextExamples from "../context/ContextExamples";
import ZustandExamples from "../zustand/ZustandExamples";
import ReduxExamples from "../redux/ReduxExamples";
import IntermediateStepPage from "./[slug]/page";
import Lab4IntermediatesIndex from "./page";
import { LAB4_INTERMEDIATES } from "./index";

const clientComponents = new Set<unknown>([
  ClickEvent,
  PassingDataOnEvent,
  PassingFunctions,
  PassingFunctionsDemo,
  CounterBroken,
  Counter,
  BooleanStateVariables,
  StringStateVariables,
  DateStateVariable,
  ObjectStateVariable,
  ArrayStateVariable,
  ParentStateComponent,
  ChildStateComponent,
  PropDrilling,
  UrlEncoding,
  Effect,
  ContextExamples,
  ZustandExamples,
  ReduxExamples,
]);

const router: AppRouterInstance = {
  back() {},
  forward() {},
  refresh() {},
  push() {},
  replace() {},
  prefetch() {},
};

function markup(node: ReactNode): string {
  return renderToStaticMarkup(
    createElement(AppRouterContext.Provider, { value: router }, node),
  );
}

type ElementProps = { children?: ReactNode } & Record<string, unknown>;

function elementProps(node: { props: unknown }): ElementProps {
  return node.props as ElementProps;
}

function functionProp(props: ElementProps): string | undefined {
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === "function") return key;
  }
  return undefined;
}

function isClassComponent(type: (...args: unknown[]) => unknown): boolean {
  const prototype = Object.getOwnPropertyDescriptor(type, "prototype")?.value;
  if (typeof prototype !== "object" || prototype === null) return false;
  return "isReactComponent" in prototype && Boolean(prototype.isReactComponent);
}

async function assertNoServerFunctionProps(node: ReactNode): Promise<void> {
  if (
    node == null ||
    typeof node === "boolean" ||
    typeof node === "string" ||
    typeof node === "number"
  ) {
    return;
  }
  if (Array.isArray(node)) {
    for (const child of node) await assertNoServerFunctionProps(child);
    return;
  }
  if (!isValidElement(node)) return;

  if (node.type === Fragment) {
    await assertNoServerFunctionProps(elementProps(node).children);
    return;
  }

  if (typeof node.type === "function") {
    const props = elementProps(node);
    if (clientComponents.has(node.type)) {
      const key = functionProp(props);
      assert.equal(
        key,
        undefined,
        `${node.type.name || "Client component"} received function prop "${key}" from a Server Component`,
      );
      return;
    }
    if (isClassComponent(node.type as (...args: unknown[]) => unknown)) return;
    const render = node.type as (props: ElementProps) => ReactNode | Promise<ReactNode>;
    const rendered = render(props);
    const next = rendered instanceof Promise ? await rendered : rendered;
    await assertNoServerFunctionProps(next);
    return;
  }

  if (typeof node.type === "string") {
    await assertNoServerFunctionProps(elementProps(node).children);
  }
}

describe("Lab 4 intermediate routes", () => {
  it("renders the index", () => {
    const html = markup(createElement(Lab4IntermediatesIndex));
    assert.match(html, /wd-lab4-intermediates/);
    for (const step of LAB4_INTERMEDIATES) {
      assert.match(html, new RegExp(`/labs/lab4/intermediates/${step.slug}`));
    }
  });

  for (const step of LAB4_INTERMEDIATES) {
    it(`renders ${step.slug} without a server-to-client function prop`, async () => {
      const element = await IntermediateStepPage({
        params: Promise.resolve({ slug: step.slug }),
      });
      await assertNoServerFunctionProps(element);
      const html = markup(element);
      assert.match(html, /\S/);
      if (step.slug === "PassingFunctions") {
        assert.match(html, /id="wd-passing-functions"/);
        assert.match(html, /id="wd-pass-functions-click"/);
        assert.match(html, /Invoke the Function/);
      }
    });
  }
});
