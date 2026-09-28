import type { Metadata } from "next";
import "@/app/labs/lab2/tailwind/index.css";
import TailwindResponsiveFlex from "@/app/labs/lab2/tailwind/TailwindResponsiveFlex";

export const metadata: Metadata = {
  title: "Tailwind responsive flex preview",
};

export default function TailwindResponsiveFlexPreviewPage() {
  return <TailwindResponsiveFlex />;
}
