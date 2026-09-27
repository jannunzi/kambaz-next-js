"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  courseSiteHrefForLocation,
  shouldShowCourseHostBanner,
} from "@/lib/course-site/origin";
import "./legacy-course-host-banner.css";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  window.addEventListener("popstate", onStoreChange);
  return () => {
    window.removeEventListener("hashchange", onStoreChange);
    window.removeEventListener("popstate", onStoreChange);
  };
}

/** Hostname, search, and hash. Path comes from usePathname so App Router navigations update the link. */
function clientLocationSnapshot(): string {
  const { hostname, search, hash } = window.location;
  return `${hostname}\n${search}\n${hash}`;
}

/**
 * kambaz.dev and webdev-client.vercel.app are one production deployment.
 * The host comes from `window.location.hostname` at runtime, not from a
 * build-time env var. Does not redirect. The link keeps path, query, and hash.
 */
export default function LegacyCourseHostBanner() {
  const pathname = usePathname() || "/";
  const snapshot = useSyncExternalStore(
    subscribe,
    clientLocationSnapshot,
    () => "",
  );
  if (pathname.startsWith("/preview")) return null;
  if (!snapshot) return null;

  const [hostname, search = "", hash = ""] = snapshot.split("\n");
  if (!hostname || !shouldShowCourseHostBanner(hostname)) return null;

  const href = courseSiteHrefForLocation({ pathname, search, hash });

  return (
    <p className="legacy-course-host-banner" role="status">
      Sign in and submit at <a href={href}>{href}</a>.
    </p>
  );
}
