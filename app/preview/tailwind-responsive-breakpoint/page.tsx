import type { Metadata } from "next";
import "@/app/labs/lab2/tailwind/index.css";
import TailwindResponsiveBreakpoint from "@/app/labs/lab2/tailwind/TailwindResponsiveBreakpoint";

export const metadata: Metadata = {
  title: "Tailwind responsive breakpoint preview",
};

export default function TailwindResponsiveBreakpointPreviewPage() {
  return <TailwindResponsiveBreakpoint />;
}
