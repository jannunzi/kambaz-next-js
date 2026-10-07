"use client";

import {
  NavigationPromisesContext,
  PathParamsContext,
  PathnameContext,
} from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import type { ReactNode } from "react";

/**
 * Demo-only. Chapter 3 Modules listing calls `useParams()` for `cid` and must
 * stay identical to `app/(kambaz)/courses/[cid]/modules/page.tsx`, so the
 * slide pretends the route params are `{ cid }` from outside that file.
 */
export default function AsCourseParams({
  cid,
  path = "modules",
  children,
}: {
  cid: string;
  path?: string;
  children: ReactNode;
}) {
  return (
    <NavigationPromisesContext.Provider value={null}>
      <PathParamsContext.Provider value={{ cid }}>
        <PathnameContext.Provider value={`/courses/${cid}/${path}`}>
          {children}
        </PathnameContext.Provider>
      </PathParamsContext.Provider>
    </NavigationPromisesContext.Provider>
  );
}
