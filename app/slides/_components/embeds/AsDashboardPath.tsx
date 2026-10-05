"use client";

import {
  NavigationPromisesContext,
  PathnameContext,
} from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import type { ReactNode } from "react";

/**
 * Demo-only. The chapter 3 nav listing calls `usePathname()` and must stay
 * identical to `app/(kambaz)/Navigation.tsx`, so the slide pretends the URL
 * is `/dashboard` from outside that file.
 */
export default function AsDashboardPath({ children }: { children: ReactNode }) {
  return (
    <NavigationPromisesContext.Provider value={null}>
      <PathnameContext.Provider value="/dashboard">{children}</PathnameContext.Provider>
    </NavigationPromisesContext.Provider>
  );
}
