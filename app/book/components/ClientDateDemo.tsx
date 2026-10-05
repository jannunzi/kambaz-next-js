"use client";

import dynamic from "next/dynamic";

const DateStateVariable = dynamic(
  () => import("@/app/labs/lab4/DateStateVariable"),
  { ssr: false },
);

/**
 * The lab component stores `new Date()` and prints it. Rendering that during
 * static generation mismatches hydration, so this demo mounts it in the browser only.
 */
export default function ClientDateDemo() {
  return <DateStateVariable />;
}
