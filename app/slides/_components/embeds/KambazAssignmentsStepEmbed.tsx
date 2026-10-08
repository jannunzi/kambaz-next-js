"use client";

import { Suspense, use } from "react";
import AssignmentsStep from "@/app/book/ch1/embeds/assignments-step/Assignments";
import LectureDemoFrame from "./LectureDemoFrame";

/**
 * The 1.4.7 starter page exactly as the book lists it. It is an async server
 * page (it awaits `params`), so the slide awaits it once with `cid: "1234"`,
 * the same params the book's live demo passes, and renders the result.
 */
const rendered = AssignmentsStep({ params: Promise.resolve({ cid: "1234" }) });

function Step() {
  return use(rendered);
}

export default function KambazAssignmentsStepEmbed() {
  return (
    <LectureDemoFrame
      label="app/(kambaz)/courses/[cid]/assignments/page.tsx"
      url="/courses/1234/assignments"
    >
      <div className="font-sans text-xl [&_a]:underline">
        <Suspense fallback={null}>
          <Step />
        </Suspense>
      </div>
    </LectureDemoFrame>
  );
}
