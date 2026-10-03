import type { Metadata } from "next";
import "@/app/labs/lab2/tailwind/index.css";
import TailwindResponsiveGrid from "@/app/labs/lab2/tailwind/TailwindResponsiveGrid";

export const metadata: Metadata = {
  title: "Tailwind responsive grid preview",
};

export default function TailwindResponsiveGridPreviewPage() {
  return <TailwindResponsiveGrid />;
}
