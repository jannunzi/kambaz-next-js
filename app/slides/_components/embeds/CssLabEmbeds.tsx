import "@/app/labs/lab2/index.css";
import BackgroundColors from "@/app/labs/lab2/intermediates/2-1-8-BackgroundColors";
import Borders from "@/app/labs/lab2/intermediates/2-1-9-Borders";
import BoxModel from "@/app/labs/lab2/intermediates/2-1-10c-BoxModel";
import ClassSelectors from "@/app/labs/lab2/intermediates/2-1-4-ClassSelectors";
import Corners from "@/app/labs/lab2/intermediates/2-1-11-Corners";
import CssImport from "@/app/labs/lab2/intermediates/2-1-2-CssImport";
import Dimensions from "@/app/labs/lab2/intermediates/2-1-12-Dimensions";
import Display from "@/app/labs/lab2/intermediates/2-1-12b-Display";
import DocumentStructureSelectors from "@/app/labs/lab2/intermediates/2-1-5-DocumentStructureSelectors";
import FlexGrow from "@/app/labs/lab2/intermediates/2-1-19b-FlexGrow";
import FlexRow from "@/app/labs/lab2/intermediates/2-1-19a-FlexRow";
import FlexWidth from "@/app/labs/lab2/intermediates/2-1-19c-FlexWidth";
import ForegroundColors from "@/app/labs/lab2/intermediates/2-1-7-ForegroundColors";
import GridLayout from "@/app/labs/lab2/intermediates/2-1-18-GridLayout";
import IdSelectors from "@/app/labs/lab2/intermediates/2-1-3-IdSelectors";
import Margins from "@/app/labs/lab2/intermediates/2-1-10b-Margins";
import MediaQueriesDemo from "@/app/labs/lab2/intermediates/2-1-20-MediaQueries";
import Padding from "@/app/labs/lab2/intermediates/2-1-10a-Padding";
import PositionAbsolute from "@/app/labs/lab2/intermediates/2-1-14-PositionAbsolute";
import PositionRelative from "@/app/labs/lab2/intermediates/2-1-13-PositionRelative";
import StyleAttribute from "@/app/labs/lab2/intermediates/2-1-1-StyleAttribute";
import Zindex from "@/app/labs/lab2/intermediates/2-1-16-Zindex";
import ContainFixed from "@/app/book/components/ContainFixed";
import type { ReactNode } from "react";
import LectureDemoFrame from "./LectureDemoFrame";

function CssDemo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <LectureDemoFrame label={label} url="/labs/lab2">
      <div className="max-h-72 overflow-auto font-sans text-base [&_h2]:mt-0 [&_h3]:mt-2">
        {children}
      </div>
    </LectureDemoFrame>
  );
}

export function CssStyleAttrEmbed() {
  return (
    <CssDemo label="page.tsx">
      <StyleAttribute />
    </CssDemo>
  );
}

export function CssImportEmbed() {
  return (
    <CssDemo label="index.css">
      <CssImport />
    </CssDemo>
  );
}

export function CssIdSelectorsEmbed() {
  return (
    <CssDemo label="page.tsx">
      <IdSelectors />
    </CssDemo>
  );
}

export function CssClassSelectorsEmbed() {
  return (
    <CssDemo label="page.tsx">
      <ClassSelectors />
    </CssDemo>
  );
}

export function CssStructureSelectorsEmbed() {
  return (
    <CssDemo label="page.tsx">
      <DocumentStructureSelectors />
    </CssDemo>
  );
}

export function CssForegroundEmbed() {
  return (
    <CssDemo label="ForegroundColors.tsx">
      <ForegroundColors />
    </CssDemo>
  );
}

export function CssBackgroundEmbed() {
  return (
    <CssDemo label="BackgroundColors.tsx">
      <BackgroundColors />
    </CssDemo>
  );
}

export function CssBordersEmbed() {
  return (
    <CssDemo label="Borders.tsx">
      <Borders />
    </CssDemo>
  );
}

export function CssPaddingEmbed() {
  return (
    <CssDemo label="Padding.tsx">
      <Padding />
    </CssDemo>
  );
}

export function CssMarginsEmbed() {
  return (
    <CssDemo label="Margins.tsx">
      <Margins />
    </CssDemo>
  );
}

export function CssBoxModelEmbed() {
  return (
    <CssDemo label="BoxModel.tsx">
      <BoxModel />
    </CssDemo>
  );
}

export function CssCornersEmbed() {
  return (
    <CssDemo label="Corners.tsx">
      <Corners />
    </CssDemo>
  );
}

export function CssDimensionsEmbed() {
  return (
    <CssDemo label="Dimensions.tsx">
      <Dimensions />
    </CssDemo>
  );
}

export function CssDisplayEmbed() {
  return (
    <CssDemo label="Display.tsx">
      <Display />
    </CssDemo>
  );
}

export function CssPositionRelativeEmbed() {
  return (
    <CssDemo label="Positions.tsx">
      <PositionRelative />
    </CssDemo>
  );
}

export function CssPositionAbsoluteEmbed() {
  return (
    <CssDemo label="Positions.tsx">
      <PositionAbsolute />
    </CssDemo>
  );
}

export function CssPositionFixedEmbed() {
  return (
    <CssDemo label="Positions.tsx">
      <ContainFixed height={200}>
        <div id="wd-css-position-fixed">
          <h2>Fixed position</h2>
          Checkout the blue square that says &quot;Fixed position&quot; stuck
          on the right. In Lab 2 it anchors to the browser window; here it
          stays inside this figure.
          <div className="wd-pos-fixed wd-dimension-square wd-bg-color-blue wd-fg-color-white">
            Fixed position
          </div>
        </div>
      </ContainFixed>
    </CssDemo>
  );
}

export function CssZindexEmbed() {
  return (
    <CssDemo label="Zindex.tsx">
      <Zindex />
    </CssDemo>
  );
}

export function CssFloatEmbed() {
  return (
    <CssDemo label="Float.tsx">
      <div id="wd-float-divs">
        <h2>Float</h2>
        <div>
          <div className="wd-float-left wd-dimension-portrait wd-bg-color-yellow">
            Yellow
          </div>
          <div className="wd-float-left wd-dimension-portrait wd-bg-color-blue wd-fg-color-white">
            Blue
          </div>
          <div className="wd-float-left wd-dimension-portrait wd-bg-color-red">
            Red
          </div>
          <div className="wd-float-right wd-dimension-square wd-bg-color-gray">
            Wrap
          </div>
          <p>
            Floated boxes leave the normal stack so this paragraph can sit
            beside them. Lab 2 uses the same <code>wd-float-left</code> and{" "}
            <code>wd-float-right</code> classes.
          </p>
          <div className="wd-float-done" />
        </div>
      </div>
    </CssDemo>
  );
}

export function CssGridLayoutEmbed() {
  return (
    <CssDemo label="GridLayout.tsx">
      <GridLayout />
    </CssDemo>
  );
}

export function CssFlexRowEmbed() {
  return (
    <CssDemo label="Flex.tsx">
      <FlexRow />
    </CssDemo>
  );
}

export function CssFlexGrowEmbed() {
  return (
    <CssDemo label="Flex.tsx">
      <FlexGrow />
    </CssDemo>
  );
}

export function CssFlexWidthEmbed() {
  return (
    <CssDemo label="Flex.tsx">
      <FlexWidth />
    </CssDemo>
  );
}

export function CssMediaQueriesEmbed() {
  return (
    <CssDemo label="MediaQueriesDemo.tsx">
      <MediaQueriesDemo />
    </CssDemo>
  );
}

export function CssRotateEmbed() {
  return (
    <CssDemo label="transform: rotate">
      <div className="flex flex-wrap items-center gap-10 py-6">
        <div
          className="flex items-center justify-center rounded-md px-4 py-6 font-semibold text-white"
          style={{
            width: 160,
            height: 100,
            backgroundColor: "#7070ff",
            transform: "rotate(12deg)",
          }}
        >
          rotate(12deg)
        </div>
        <div
          className="flex items-center justify-center rounded-md px-3 py-3 text-center font-semibold"
          style={{
            width: 110,
            height: 110,
            backgroundColor: "#ffff07",
            transform: "rotate(90deg)",
          }}
        >
          rotate(90deg)
        </div>
      </div>
    </CssDemo>
  );
}

export function CssGradientEmbed() {
  return (
    <CssDemo label="linear-gradient / radial-gradient">
      <div className="flex flex-wrap gap-6 py-2">
        <div
          className="flex items-end p-3 font-semibold"
          style={{
            width: 200,
            height: 140,
            background: "linear-gradient(yellow, red)",
          }}
        >
          linear
        </div>
        <div
          className="flex items-end p-3 font-semibold"
          style={{
            width: 200,
            height: 140,
            background: "radial-gradient(yellow, green)",
          }}
        >
          radial
        </div>
      </div>
    </CssDemo>
  );
}
