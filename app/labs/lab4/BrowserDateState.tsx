"use client";

import dynamic from "next/dynamic";

const DateStateVariable = dynamic(() => import("./DateStateVariable"), {
  ssr: false,
  loading: () => <div id="wd-date-state-variables" />,
});

/**
 * `DateStateVariable` stores `new Date()` and prints it. Rendering that during
 * static generation mismatches hydration, so the lab pages mount it in the
 * browser only — the same split the book uses for this component.
 */
export default function BrowserDateState() {
  return <DateStateVariable />;
}
