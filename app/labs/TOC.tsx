"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/labs", id: "wd-home-link", label: "Home", match: (p: string) => p === "/labs" },
  { href: "/syllabus", id: "wd-syllabus-link", label: "Syllabus", match: (p: string) => p.startsWith("/syllabus") },
  { href: "/labs/lab1", id: "wd-lab1-link", label: "Lab 1", match: (p: string) => p.endsWith("/lab1") || p.includes("/lab1/") },
  { href: "/labs/lab2", id: "wd-lab2-link", label: "Lab 2", match: (p: string) => p.includes("/lab2") },
  { href: "/labs/lab3", id: "wd-lab3-link", label: "Lab 3", match: (p: string) => p.includes("/lab3") },
  { href: "/labs/lab4", id: "wd-lab4-link", label: "Lab 4", match: (p: string) => p.includes("/lab4") },
  { href: "/labs/lab5", id: "wd-lab5-link", label: "Lab 5", match: (p: string) => p.includes("/lab5") },
  { href: "/labs/lab6", id: "wd-lab6-link", label: "Lab 6", match: (p: string) => p.includes("/lab6") },
  { href: "/account/signin", id: "wd-kambaz-link", label: "Kambaz", match: () => false },
] as const;

export default function TOC() {
  const pathname = usePathname() ?? "";
  // /labs/lab2/tailwind imports full Tailwind, including Preflight. Leaving that
  // route with <Link> keeps the reset in the document, so Kambaz stays unstyled.
  const hard = pathname.startsWith("/labs/lab2/tailwind");
  return (
    <ul>
      {LINKS.map((link) => (
        <li key={link.id}>
          <TocAnchor
            href={link.href}
            id={link.id}
            hard={hard}
            className={
              link.match(pathname)
                ? "rounded bg-blue-600 px-2 py-0.5 text-white no-underline"
                : undefined
            }
          >
            {link.label}
          </TocAnchor>
        </li>
      ))}
      <li>
        <TocAnchor href="/labs/lab1/intermediates" id="wd-lab1-intermediates-link" hard={hard}>
          Lab 1 Steps
        </TocAnchor>
      </li>
      <li>
        <TocAnchor href="/book/ch1" id="wd-book-ch1-link" hard={hard}>
          Book Ch1
        </TocAnchor>
      </li>
      <li>
        <TocAnchor href="/labs/lab2/intermediates" id="wd-lab2-intermediates-link" hard={hard}>
          Lab 2 Steps
        </TocAnchor>
      </li>
      <li>
        <TocAnchor href="/book/ch2" id="wd-book-ch2-link" hard={hard}>
          Book Ch2
        </TocAnchor>
      </li>
      <li>
        <TocAnchor href="/labs/lab3/intermediates" id="wd-lab3-intermediates-link" hard={hard}>
          Lab 3 Steps
        </TocAnchor>
      </li>
      <li>
        <TocAnchor href="/book/ch3" id="wd-book-ch3-link" hard={hard}>
          Book Ch3
        </TocAnchor>
      </li>
      <li>
        <TocAnchor href="/labs/lab4/intermediates" id="wd-lab4-intermediates-link" hard={hard}>
          Lab 4 Steps
        </TocAnchor>
      </li>
      <li>
        <TocAnchor href="/book/ch4" id="wd-book-ch4-link" hard={hard}>
          Book Ch4
        </TocAnchor>
      </li>
      <li>
        <TocAnchor href="/labs/lab5/intermediates" id="wd-lab5-intermediates-link" hard={hard}>
          Lab 5 Steps
        </TocAnchor>
      </li>
      <li>
        <TocAnchor href="/book/ch5" id="wd-book-ch5-link" hard={hard}>
          Book Ch5
        </TocAnchor>
      </li>
      <li>
        <TocAnchor href="/labs/lab6/intermediates" id="wd-lab6-intermediates-link" hard={hard}>
          Lab 6 Steps
        </TocAnchor>
      </li>
      <li>
        <TocAnchor href="/book/ch6" id="wd-book-ch6-link" hard={hard}>
          Book Ch6
        </TocAnchor>
      </li>
    </ul>
  );
}

function TocAnchor({
  href,
  id,
  className,
  hard,
  children,
}: {
  href: string;
  id: string;
  className?: string;
  hard: boolean;
  children: ReactNode;
}) {
  if (hard) {
    return (
      <a href={href} id={id} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} id={id} className={className}>
      {children}
    </Link>
  );
}
