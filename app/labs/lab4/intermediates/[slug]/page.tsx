import type { ComponentType } from "react";
import ClickEvent from "../../ClickEvent";
import PassingDataOnEvent from "../../PassingDataOnEvent";
import PassingFunctionsDemo from "../../PassingFunctionsDemo";
import CounterBroken from "../../CounterBroken";
import Counter from "../../Counter";
import BooleanStateVariables from "../../BooleanStateVariables";
import StringStateVariables from "../../StringStateVariables";
import BrowserDateState from "../../BrowserDateState";
import ObjectStateVariable from "../../ObjectStateVariable";
import ArrayStateVariable from "../../ArrayStateVariable";
import ParentStateComponent from "../../ParentStateComponent";
import PropDrilling from "../../PropDrilling";
import UrlEncoding from "../../UrlEncoding";
import Effect from "../../Effect";
import ContextExamples from "../../context/ContextExamples";
import ZustandExamples from "../../zustand/ZustandExamples";
import ReduxExamples from "../../redux/ReduxExamples";
import { notFound } from "next/navigation";

const STEPS: Record<string, ComponentType> = {
  ClickEvent,
  PassingDataOnEvent,
  PassingFunctions: PassingFunctionsDemo,
  CounterBroken,
  Counter,
  BooleanStateVariables,
  StringStateVariables,
  DateStateVariable: BrowserDateState,
  ObjectStateVariable,
  ArrayStateVariable,
  ParentStateComponent,
  PropDrilling,
  UrlEncoding,
  Effect,
  ContextExamples,
  ZustandExamples,
  ReduxExamples,
};

export default async function IntermediateStepPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const Step = STEPS[slug];
  if (!Step) notFound();
  return <Step />;
}
