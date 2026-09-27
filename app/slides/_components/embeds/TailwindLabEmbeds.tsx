import ReactIconsSampler from "@/app/labs/lab2/ReactIconsSampler";
import TailwindBackgroundColors from "@/app/labs/lab2/tailwind/TailwindBackgroundColors";
import TailwindFilters from "@/app/labs/lab2/tailwind/TailwindFilters";
import TailwindGrids from "@/app/labs/lab2/tailwind/TailwindGrids";
import TailwindResponsiveDesign from "@/app/labs/lab2/tailwind/TailwindResponsiveDesign";
import TailwindSpacing from "@/app/labs/lab2/tailwind/TailwindSpacing";
import TailwindTypography from "@/app/labs/lab2/tailwind/TailwindTypography";
import type { ReactNode } from "react";
import LectureDemoFrame from "./LectureDemoFrame";

function TailwindDemo({
  label,
  url = "/labs/lab2/tailwind",
  children,
}: {
  label: string;
  url?: string;
  children: ReactNode;
}) {
  return (
    <LectureDemoFrame label={label} url={url}>
      <div className="max-h-72 overflow-auto font-sans text-base [&_h2]:mt-0 [&_h3]:mt-2">
        {children}
      </div>
    </LectureDemoFrame>
  );
}

export function ReactIconsEmbed() {
  return (
    <TailwindDemo label="ReactIconsSampler.tsx" url="/labs/lab2">
      <ReactIconsSampler />
    </TailwindDemo>
  );
}

export function TailwindSpacingEmbed() {
  return (
    <TailwindDemo label="TailwindSpacing.tsx">
      <TailwindSpacing />
    </TailwindDemo>
  );
}

export function TailwindTypographyEmbed() {
  return (
    <TailwindDemo label="TailwindTypography.tsx">
      <TailwindTypography />
    </TailwindDemo>
  );
}

export function TailwindBackgroundsEmbed() {
  return (
    <TailwindDemo label="TailwindBackgroundColors.tsx">
      <TailwindBackgroundColors />
    </TailwindDemo>
  );
}

export function TailwindFiltersEmbed() {
  return (
    <TailwindDemo label="TailwindFilters.tsx">
      <TailwindFilters />
    </TailwindDemo>
  );
}

export function TailwindFlexEmbed() {
  return (
    <TailwindDemo label="flex / grow / shrink-0">
      <div id="wd-tw-flex" className="flex flex-row gap-0">
        <div className="w-[110px] shrink-0 bg-yellow-300 p-2.5">Column 1</div>
        <div className="bg-blue-400 p-2.5 text-white">Column 2</div>
        <div className="grow bg-red-400 p-2.5 text-white">Column 3</div>
      </div>
    </TailwindDemo>
  );
}

export function TailwindGridsEmbed() {
  return (
    <TailwindDemo label="TailwindGrids.tsx">
      <TailwindGrids />
    </TailwindDemo>
  );
}

export function TailwindResponsiveEmbed() {
  return (
    <TailwindDemo label="TailwindResponsiveDesign.tsx">
      <TailwindResponsiveDesign />
    </TailwindDemo>
  );
}
