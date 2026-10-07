/**
 * A2 book build used by checker tests.
 *
 * `a2-book-build/` holds the server-rendered HTML (scripts removed) and the
 * compiled CSS of a Next 16.3 student project built from the book alone:
 * Chapter 1, then §2.1–§2.3 with every On your own / With AI step (QA
 * walkthrough, Oct 7 2026). The student, repo and deploy are made up.
 *
 * Variants (ids stripped, text replaced, one sample removed, template,
 * ids-only skeleton, …) are small edits of this build, so each test shows
 * exactly what differs. Removals delete a DOM subtree and keep the CSS, the
 * way a student who never imported a component would ship it.
 */
import { readFileSync, readdirSync } from "node:fs";
import type { AssignmentCheckProbes, HtmlFetchResult } from "../check-types";

export const A2_FIXTURE_ORIGIN = "https://webdev-client-git-a2-qstudent.vercel.app";
export const A2_FIXTURE_TREE = "https://github.com/qa-student/webdev-client/tree/a2";
export const A2_FIXTURE_NAME = "Quentin Student";

const DIR = new URL("./a2-book-build/", import.meta.url);

function read(name: string): string {
  return readFileSync(new URL(name, DIR), "utf8");
}

/** Book-build pages by pathname. "/" redirects to /account/signin (not part of the lab). */
export const A2_BOOK_PAGES: Readonly<Record<string, string>> = {
  "/labs": read("labs.html"),
  "/labs/lab1": read("labs-lab1.html"),
  "/labs/lab2": read("labs-lab2.html"),
  "/labs/lab2/tailwind": read("labs-lab2-tailwind.html"),
};

/** Compiled stylesheets by file name (Next serves them from /_next/static/chunks/). */
export const A2_BOOK_CSS: Readonly<Record<string, string>> = Object.fromEntries(
  readdirSync(DIR)
    .filter((name) => name.endsWith(".css"))
    .map((name) => [name, read(name)]),
);

export type FixtureResponse = { status: number; body: string } | { network: true };

/** A deploy as a function of pathname. */
export type FixtureSite = (path: string) => FixtureResponse;

const NOT_FOUND = "<!DOCTYPE html><html><head><title>404</title></head><body><h1>404</h1><h2>This page could not be found.</h2></body></html>";

/** The book build as served: pages, CSS chunks, everything else 404. */
export const bookSite: FixtureSite = (path) => {
  const clean = path.length > 1 ? path.replace(/\/+$/, "") : path;
  const css = /\/_next\/static\/.*?([^/]+\.css)$/.exec(clean)?.[1];
  if (css) return css in A2_BOOK_CSS ? { status: 200, body: A2_BOOK_CSS[css] } : { status: 404, body: "" };
  if (clean in A2_BOOK_PAGES) return { status: 200, body: A2_BOOK_PAGES[clean] };
  return { status: 404, body: NOT_FOUND };
};

/** Probes for runChecker over a fixture site; GitHub always answers 200. */
export function fixtureProbes(site: FixtureSite, log?: string[]): AssignmentCheckProbes {
  return {
    getHtml: async (url: string): Promise<HtmlFetchResult> => {
      const path = new URL(url).pathname;
      log?.push(path);
      const res = site(path);
      if ("network" in res) {
        return { ok: false, code: "network", message: "The deployment timed out." };
      }
      if (res.status === 401 || res.status === 403) {
        return {
          ok: false,
          status: res.status,
          finalUrl: url,
          html: res.body,
          code: "auth_wall",
          message: "Login required",
        };
      }
      if (res.status >= 400) {
        return {
          ok: false,
          status: res.status,
          finalUrl: url,
          html: res.body,
          code: "http_error",
          message: `HTTP ${res.status}`,
        };
      }
      return { ok: true, status: res.status, finalUrl: url, html: res.body };
    },
    probeUrl: async () => ({ ok: true, status: 200 }),
  };
}

/* ------------------------------------------------------------------ */
/* Edits                                                               */
/* ------------------------------------------------------------------ */

const isCss = (path: string) => /\.css$/.test(path);
const clean = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

/** Apply an HTML edit to pages (CSS untouched). `only` limits it to one path or a prefix test. */
export function editPages(
  site: FixtureSite,
  edit: (html: string, path: string) => string,
  only?: string | ((path: string) => boolean),
): FixtureSite {
  return (path) => {
    const res = site(path);
    if ("network" in res || isCss(path) || res.status >= 400) return res;
    const p = clean(path);
    const applies = only === undefined ? true : typeof only === "string" ? p === only : only(p);
    return applies ? { ...res, body: edit(res.body, p) } : res;
  };
}

/** Replace one path's response. */
export function override(site: FixtureSite, target: string, res: FixtureResponse): FixtureSite {
  return (path) => (clean(path) === target ? res : site(path));
}

/** Every wd-* id attribute removed. */
export function stripIds(html: string): string {
  return html.replace(/\s+id\s*=\s*(["'])wd-[^"']*\1/gi, "");
}

/** Every visible letter replaced (structure, classes and the student's name kept). */
export function replaceText(html: string, keep = A2_FIXTURE_NAME): string {
  return html.replace(/(<body[\s\S]*?)(<\/body>)/, (_all, body: string, end: string) =>
    body.replace(/>([^<>]*[A-Za-z][^<>]*)</g, (_m, text: string) =>
      `>${text.includes(keep) ? text : text.replace(/[A-Za-z]/g, "x")}<`,
    ) + end,
  );
}

/**
 * Remove the element (and its subtree) found by `#id` or `.class`, the
 * first match only.
 */
export function removeElement(html: string, target: string): string {
  const attr = target.startsWith(".")
    ? `class="(?:[^"]* )?${target.slice(1)}(?: [^"]*)?"`
    : `id="${target.replace(/^#/, "")}"`;
  const open = new RegExp(`<([a-zA-Z0-9]+)\\b[^>]*\\b${attr}[^>]*>`).exec(html);
  if (!open) throw new Error(`fixture: ${target} not found`);
  const tag = open[1].toLowerCase();
  if (/^(img|input|br|hr)$/.test(tag) || open[0].endsWith("/>")) {
    return html.slice(0, open.index) + html.slice(open.index + open[0].length);
  }
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  re.lastIndex = open.index + open[0].length;
  let depth = 1;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    if (!match[1] && match[0].endsWith("/>")) continue;
    depth += match[1] ? -1 : 1;
    if (depth === 0) return html.slice(0, open.index) + html.slice(re.lastIndex);
  }
  throw new Error(`fixture: ${target} is not closed`);
}

/** Remove several elements from one page. */
export function removeFrom(site: FixtureSite, path: string, targets: readonly string[]): FixtureSite {
  return editPages(site, (html) => targets.reduce(removeElement, html), path);
}

/** create-next-app 16 starter page (Tailwind classes, logos, "To get started"). */
export const TEMPLATE_HTML = `<!DOCTYPE html><html lang="en" class="h-full antialiased"><head><title>Create Next App</title><link rel="stylesheet" href="/_next/static/chunks/0s7j125h0yumc.css" data-precedence="next"/></head><body class="min-h-full flex flex-col"><div class="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans"><main class="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start"><img alt="Next.js logo" src="/next.svg" class="dark:invert"/><div class="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left"><h1 class="max-w-xs text-3xl font-semibold leading-10 tracking-tight">To get started, edit the page.tsx file.</h1><p class="max-w-md text-lg leading-8">Looking for a starting point or more instructions? Head over to <a href="https://vercel.com/templates?utm_source=create-next-app">Templates</a> or the <a href="https://nextjs.org/learn?utm_source=create-next-app">Learning</a> center.</p></div><div class="flex flex-col gap-4 text-base font-medium sm:flex-row"><a class="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5" href="https://vercel.com/new?utm_source=create-next-app"><img class="dark:invert" src="/vercel.svg" alt="Vercel logomark" width="16" height="16"/>Deploy Now</a><a class="flex h-12 w-full items-center justify-center rounded-full border border-solid px-5" href="https://nextjs.org/docs?utm_source=create-next-app">Documentation</a></div></main></div></body></html>`;

/** The starter app on every path (the Tailwind CSS chunk still loads). */
export const templateSite: FixtureSite = (path) => {
  if (isCss(path)) return bookSite(path);
  return { status: 200, body: TEMPLATE_HTML };
};

/** Every path 404. */
export const emptySite: FixtureSite = () => ({ status: 404, body: NOT_FOUND });

/**
 * Every wd-* id from the book build on an empty element, plus one empty
 * element per class list the page uses (so every CSS rule still matches
 * something), and an empty <svg>. No text, no real content.
 */
export function idsOnlySkeleton(html: string): string {
  const ids = [...new Set([...html.matchAll(/\sid="(wd-[^"]+)"/g)].map((m) => m[1]))];
  const classLists = [...new Set([...html.matchAll(/\sclass="([^"]*)"/g)].map((m) => m[1]))];
  const head = /<head>[\s\S]*?<\/head>/.exec(html)?.[0] ?? "<head></head>";
  const divs = ids.map((id) => `<div id="${id}"></div>`).join("");
  return `<!DOCTYPE html><html>${head}<body><div>${divs}${classLists.map((list) => `<div class="${list}"></div>`).join("")}<svg></svg></div></body></html>`;
}
