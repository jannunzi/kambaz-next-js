import type { Metadata } from "next";
import "@/app/labs/lab2/tailwind/index.css";
import TailwindResponsiveSpacingText from "@/app/labs/lab2/tailwind/TailwindResponsiveSpacingText";

export const metadata: Metadata = {
  title: "Tailwind responsive spacing and text preview",
};

export default function TailwindResponsiveSpacingTextPreviewPage() {
  return <TailwindResponsiveSpacingText />;
}
