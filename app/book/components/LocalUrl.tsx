import type { ReactNode } from "react";
import Link from "next/link";

const ORIGIN = "http://localhost:3000";

/** Turn http://localhost:3000/labs/lab2 (or /labs/lab2) into an in-app path. */
export function localUrlToPath(urlOrPath: string): string {
  const trimmed = urlOrPath.trim();
  if (trimmed.startsWith(ORIGIN)) {
    const path = trimmed.slice(ORIGIN.length);
    return path === "" ? "/" : path;
  }
  if (trimmed.startsWith("/")) return trimmed;
  return `/${trimmed}`;
}

/**
 * Clickable localhost URL that navigates inside the Next.js app
 * (e.g. display http://localhost:3000/labs/lab2 → href /labs/lab2).
 */
export default function LocalUrl({
  href,
  children,
  className = "font-mono text-[0.95em] text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900",
}: {
  /** Full localhost URL or app path — e.g. "http://localhost:3000/labs/lab2" or "/labs/lab2" */
  href: string;
  children?: ReactNode;
  className?: string;
}) {
  const path = localUrlToPath(href);
  const label =
    children ??
    (path === "/" ? ORIGIN : `${ORIGIN}${path}`);
  // Full load into the Tailwind lab. Its CSS includes Preflight, which Next.js
  // keeps in the document after a client-side visit.
  if (path === "/labs/lab2/tailwind" || path.startsWith("/labs/lab2/tailwind/")) {
    return (
      <a href={path} className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={path} className={className}>
      {label}
    </Link>
  );
}
