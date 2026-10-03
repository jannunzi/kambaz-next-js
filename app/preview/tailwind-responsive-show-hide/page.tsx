import type { Metadata } from "next";
import "@/app/labs/lab2/tailwind/index.css";
import TailwindResponsiveShowHide from "@/app/labs/lab2/tailwind/TailwindResponsiveShowHide";

export const metadata: Metadata = {
  title: "Tailwind responsive show-hide preview",
};

export default function TailwindResponsiveShowHidePreviewPage() {
  return <TailwindResponsiveShowHide />;
}
