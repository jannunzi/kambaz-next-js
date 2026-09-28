"use client";

import type { ReactNode } from "react";
import Environment from "@/app/labs/lab5/intermediates/5-2-1-Environment";
import HelloRoute from "@/app/labs/lab5/intermediates/5-3-1-HelloRoute";
import CalculatorNextWebApiClient from "@/app/labs/lab5/intermediates/5-3-1-Calculator";
import LectureDemoFrame from "./LectureDemoFrame";

function Lab5Demo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <LectureDemoFrame label={label} url="/labs/lab5">
      <div className="font-sans text-base [&_h2]:mt-0 [&_h3]:mt-0 [&_h4]:mt-0 [&_h5]:mt-2">
        {children}
      </div>
    </LectureDemoFrame>
  );
}

export function Lab5EnvEmbed() {
  return (
    <Lab5Demo label="5-2-1-Environment.tsx">
      <Environment />
    </Lab5Demo>
  );
}

export function Lab5HelloEmbed() {
  return (
    <Lab5Demo label="5-3-1-HelloRoute.tsx">
      <HelloRoute />
    </Lab5Demo>
  );
}

export function Lab5CalculatorEmbed() {
  return (
    <Lab5Demo label="5-3-1-Calculator.tsx">
      <CalculatorNextWebApiClient />
    </Lab5Demo>
  );
}
