import type { Metadata } from "next";
import TailwindResponsiveDesign from "@/app/labs/lab2/tailwind/TailwindResponsiveDesign";

export const metadata: Metadata = {
  title: "Tailwind responsive preview",
};

export default function TailwindResponsivePreviewPage() {
  return <TailwindResponsiveDesign />;
}
