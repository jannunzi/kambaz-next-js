import type { ReactNode } from "react";
import "@/app/labs/lab2/tailwind/utilities.css";
import "./preview.css";

export default function PreviewLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div id="preview-root">{children}</div>;
}
