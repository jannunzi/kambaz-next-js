/**
 * A1 structure and content checks.
 *
 * wd-* ids are a staff convenience, never a requirement. Every A1 auto check
 * grades structure and content:
 *   1. An element with the book's id counts only when it has real content
 *      (a table id needs rows with cells, a list id needs items, a form id
 *      needs controls, a link id needs a real href, …). An empty element
 *      with the right id does not pass.
 *   2. With no id (or an empty one), the check falls back to the structure
 *      the book asks for, read on the page that should contain it: one Lab
 *      page at a time (counts never add up across pages), or the Kambaz
 *      screen itself. Lab checks never read the home page.
 *
 * create-next-app boilerplate (the Next.js / Vercel logos, links to
 * vercel.com and the nextjs.org learn/docs/templates pages, the "edit
 * page.tsx" text) is never evidence.
 *
 * Each fallback says what a miss means:
 *   - "fail": the structure is reliable, so its absence is a real miss.
 *   - "review": no reliable structural signal. The miss becomes "Needs TA
 *     review" with points kept, but only when the work around it is clearly
 *     there (see `reviewGates` in the checker config); otherwise it fails.
 *
 * A page that was fetched and returned 404 (or another definite not-found)
 * fails its items. Only a page that could not be fetched (timeout, network
 * error, 5xx, login wall) is "can't judge".
 */
import {
  anchorHrefs,
  externalAnchorUrls,
  formControlKinds,
  htmlHasAnchorPath,
  htmlHasAnchorPathMatching,
  isLabsPath,
  renderedMarkup,
  renderedText,
  startTagAttr,
  tagInnerHtml,
  type IdElement,
} from "./html";

export type StructurePage = { path: string; html: string };

/** Every page the crawl tried, including failed fetches. */
export type AttemptedPage = {
  path: string;
  ok: boolean;
  status?: number;
  code?: string;
};

export type StructureContext = {
  /** Every successfully fetched /labs page, joined. Never other pages. */
  labsHtml: string;
  /** Every successfully fetched page, joined. */
  allHtml: string;
  /** Successfully fetched pages with their pathnames. */
  pages: readonly StructurePage[];
  /** Every page the crawl tried (ok or not). */
  attempted?: readonly AttemptedPage[];
  /** Hostname of the student deploy. */
  siteHost?: string;
};

/** Where a check reads. */
export type StructureTarget =
  /** Each Lab page on its own; passes when one page has everything. */
  | { kind: "labPage" }
  /** Lab pages joined (presence of links only, never counts). */
  | { kind: "labs" }
  /** One exact path. */
  | { kind: "path"; path: string; name: string }
  /** A Kambaz screen; passes when one matching page has everything. */
  | { kind: "screen"; pattern: RegExp; name: string; example: string }
  /** Every fetched page joined (navigation links). */
  | { kind: "site" };

export type StructureFallback = {
  /** Short description of what the check looks for (staff-facing). */
  looksFor: string;
  /** Student-facing: what we looked for and did not find. Never names an id. */
  missMessage: string;
  target: StructureTarget;
  test: (html: string, ctx: StructureContext) => boolean;
  onMiss: "fail" | "review";
};

export type PageState = "ok" | "missing" | "unreachable";

export type TargetPages = {
  state: PageState;
  pages: StructurePage[];
  /** Student-facing page name, e.g. "the Lab pages (/labs/…)". */
  name: string;
  /** Example path for messages. */
  example: string;
  /** HTTP status of a definite not-found, when there was one. */
  status?: number;
  /**
   * Pages in this target that the crawl tried but couldn't open (timeout,
   * network, 5xx, login wall). A miss with any of these is a re-check, never
   * a fail: the item may be on the page we couldn't read.
   */
  unreachable: AttemptedPage[];
  /** For the Lab 1 target: /labs/lab1 itself returned a definite not-found. */
  lab1NotFound?: number;
};

/** A tried page that couldn't be opened (not a definite not-found). */
export function isUnreachable(page: AttemptedPage): boolean {
  return !page.ok && !isDefiniteNotFound(page);
}

/** A fetched page that definitely does not exist (404, 410, other 4xx). */
export function isDefiniteNotFound(page: AttemptedPage): boolean {
  if (page.ok) return false;
  if (page.code === "network" || page.code === "auth_wall") return false;
  const status = page.status ?? 0;
  return status >= 400 && status < 500 && ![401, 403, 408, 425, 429].includes(status);
}

function stateOf(
  okPages: StructurePage[],
  attempted: readonly AttemptedPage[],
): { state: PageState; status?: number } {
  if (okPages.length > 0) return { state: "ok" };
  const failed = attempted.filter((page) => !page.ok);
  if (failed.some((page) => !isDefiniteNotFound(page))) return { state: "unreachable" };
  return { state: "missing", status: failed.find((page) => page.status)?.status };
}

export function targetPages(ctx: StructureContext, target: StructureTarget): TargetPages {
  const attempted = ctx.attempted ?? [];
  if (target.kind === "site") {
    return {
      state: "ok",
      pages: [...ctx.pages],
      name: "your deploy",
      example: "/",
      unreachable: attempted.filter(isUnreachable),
    };
  }
  if (target.kind === "labPage" || target.kind === "labs") {
    const pages = ctx.pages.filter((page) => isLabsPath(page.path));
    // Prefer Lab 1, where the book puts these components.
    pages.sort((a, b) => Number(b.path === "/labs/lab1") - Number(a.path === "/labs/lab1"));
    const tried = attempted.filter((page) => isLabsPath(page.path));
    const named =
      target.kind === "labPage"
        ? { name: "the Lab 1 page", example: "/labs/lab1" }
        : { name: "the Labs pages", example: "/labs" };
    const lab1 = tried.find((page) => page.path === "/labs/lab1");
    return {
      ...stateOf(pages, tried),
      pages,
      ...named,
      unreachable: tried.filter(isUnreachable),
      ...(target.kind === "labPage" && lab1 && isDefiniteNotFound(lab1)
        ? { lab1NotFound: lab1.status }
        : {}),
    };
  }
  if (target.kind === "path") {
    const pages = ctx.pages.filter((page) => page.path === target.path);
    const tried = attempted.filter((page) => page.path === target.path);
    return {
      ...stateOf(pages, tried),
      pages,
      name: target.name,
      example: target.path,
      unreachable: tried.filter(isUnreachable),
    };
  }
  const pages = ctx.pages.filter((page) => target.pattern.test(page.path));
  const tried = attempted.filter((page) => target.pattern.test(page.path));
  return {
    ...stateOf(pages, tried),
    pages,
    name: target.name,
    example: target.example,
    unreachable: tried.filter(isUnreachable),
  };
}

/** Runs a fallback on its target. "missing"/"unreachable" when no page to read. */
export function runFallback(
  fallback: StructureFallback,
  ctx: StructureContext,
): { verdict: boolean | PageState; target: TargetPages } {
  const target = targetPages(ctx, fallback.target);
  if (target.state !== "ok") return { verdict: target.state, target };
  if (fallback.target.kind === "labs") {
    return { verdict: fallback.test(target.pages.map((page) => page.html).join("\n"), ctx), target };
  }
  if (fallback.target.kind === "site") {
    return { verdict: fallback.test(ctx.allHtml, ctx), target };
  }
  return { verdict: target.pages.some((page) => fallback.test(page.html, ctx)), target };
}

const COURSE_HOME = /^\/courses\/[^/]+\/home$/i;
const COURSE_MODULES = /^\/courses\/[^/]+\/modules$/i;
const COURSE_ASSIGNMENTS = /^\/courses\/[^/]+\/assignments$/i;
const COURSE_EDITOR = /^\/courses\/[^/]+\/assignments\/[^/]+$/i;
const ACCOUNT = /^\/account(\/|$)/i;
const DASHBOARD = /^\/dashboard$/i;

/**
 * The Assignments list needs at least this many assignment links. The book
 * recommends three (A1, A2, A3), but one real assignment linking to its
 * editor is the Assignments screen: unclear instructions never cost points.
 */
export const MIN_ASSIGNMENT_LINKS = 1;

/** Feedback when the Assignments screen lists no assignment links. */
export const ASSIGNMENTS_MISS_MESSAGE =
  "The Assignments screen doesn't list any assignments yet. Add at least one assignment whose title links to its editor at /courses/:cid/assignments/:aid (three, like A1, A2, A3, are recommended).";

/* ------------------------------------------------------------------ */
/* create-next-app boilerplate                                         */
/* ------------------------------------------------------------------ */

const BOILERPLATE_IMAGE_SRC = /(^|\/)(next|vercel|file|window|globe|turbopack)\.svg(\?|#|$)/i;
const BOILERPLATE_IMAGE_ALT = /^(next\.js logo|vercel logo(mark)?|file icon|window icon|globe icon)$/i;
const BOILERPLATE_TEXT =
  /(to get started, edit|get started by editing|looking for a starting point or more instructions|save and see your changes instantly)/i;
const NEXTJS_TEMPLATE_PATHS = new Set(["/", "/docs", "/learn", "/templates", "/showcase"]);

/** True for the create-next-app template's own links. */
export function isBoilerplateUrl(url: URL): boolean {
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (url.searchParams.get("utm_source") === "create-next-app") return true;
  if (host === "vercel.com" || host.endsWith(".vercel.com")) return true;
  if (host === "nextjs.org") {
    const path = url.pathname.replace(/\/+$/, "") || "/";
    return NEXTJS_TEMPLATE_PATHS.has(path);
  }
  return false;
}

/** Absolute links that are not create-next-app boilerplate. */
function contentLinks(html: string): URL[] {
  return externalAnchorUrls(html).filter((url) => !isBoilerplateUrl(url));
}

function imgTags(html: string): string[] {
  return renderedMarkup(html).match(/<img\b[^>]*>/gi) ?? [];
}

function isRealImage(tag: string): boolean {
  const src = (startTagAttr(tag, "src") ?? "").trim();
  if (!src) return false;
  const alt = (startTagAttr(tag, "alt") ?? "").trim();
  // The template's own logos and icons (alt text as create-next-app writes
  // it). A student who reuses /next.svg with their own alt still counts.
  if (BOILERPLATE_IMAGE_ALT.test(alt)) return false;
  // next/image rewrites src to /_next/image?url=%2Fnext.svg
  const templateSrc =
    BOILERPLATE_IMAGE_SRC.test(src) || /[?&]url=[^&]*(next|vercel|file|window|globe)\.svg/i.test(src);
  if (templateSrc && !alt) return false;
  return true;
}

/** Images with a real src that are not the template's logos. */
export function realImageCount(html: string): number {
  return imgTags(html).filter(isRealImage).length;
}

function hasText(html: string): boolean {
  return renderedText(html).length > 0;
}

/** Paragraphs with visible text that is not template copy. */
export function realParagraphCount(html: string): number {
  return tagInnerHtml(html, "p").filter((inner) => {
    const text = renderedText(inner);
    return text.length > 0 && !BOILERPLATE_TEXT.test(text);
  }).length;
}

/* ------------------------------------------------------------------ */
/* structure helpers                                                   */
/* ------------------------------------------------------------------ */

/** Hosts used by the book's own samples and course sites; not personal. */
const SAMPLE_HOSTS = new Set([
  "lipsum.com",
  "www.lipsum.com",
  "developer.mozilla.org",
  "www.w3schools.com",
  "w3schools.com",
  "react.dev",
  "nextjs.org",
  "vercel.com",
  "kambaz.dev",
  "www.kambaz.dev",
  "webdev-client.vercel.app",
  "github.com",
]);

const SAMPLE_GITHUB_USERS = new Set(["jannunzi"]);

const DOCS_HOSTS = new Set([
  "developer.mozilla.org",
  "www.w3schools.com",
  "w3schools.com",
  "react.dev",
  "nextjs.org",
  "www.w3.org",
  "html.spec.whatwg.org",
  "web.dev",
  "css-tricks.com",
]);

function githubPathSegments(url: URL): string[] {
  return url.pathname.split("/").filter(Boolean);
}

/**
 * Personal links (Lab 1 AnchorTag, On your own).
 *
 * Single place for this rule so it is easy to change. Passes on any real
 * personal link: an anchor with a wd-your-* id and a real href, a GitHub
 * profile (not the book author's and not a repository), a LinkedIn
 * profile, or a link to any other site that is not one of the book's sample
 * or course hosts.
 */
export function a1PersonalLinksFound(html: string, siteHost?: string): boolean {
  const markup = renderedMarkup(html);
  const yourAnchor = /<a\b[^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = yourAnchor.exec(markup))) {
    const id = startTagAttr(match[0], "id") ?? "";
    const href = (startTagAttr(match[0], "href") ?? "").trim();
    if (/^wd-your-/i.test(id) && href && href !== "#") return true;
  }
  const ownHost = siteHost?.toLowerCase();
  for (const url of externalAnchorUrls(html)) {
    const host = url.hostname.toLowerCase();
    if (ownHost && host === ownHost) continue;
    if (host === "github.com" || host === "www.github.com") {
      const segments = githubPathSegments(url);
      // A profile is one path segment; repositories are the GitHub delivery check.
      if (segments.length === 1 && !SAMPLE_GITHUB_USERS.has(segments[0].toLowerCase())) {
        return true;
      }
      continue;
    }
    if (host.endsWith("linkedin.com")) return true;
    if (SAMPLE_HOSTS.has(host)) continue;
    if (host.endsWith(".vercel.app") || host.endsWith(".vercel.com")) continue;
    return true;
  }
  return false;
}

function hasDocsLink(html: string): boolean {
  return contentLinks(html).some(
    (url) =>
      DOCS_HOSTS.has(url.hostname.toLowerCase()) || /\/docs?(\/|$)/i.test(url.pathname),
  );
}

function hasGithubLink(html: string): boolean {
  return externalAnchorUrls(html).some((url) => {
    const host = url.hostname.toLowerCase();
    return host === "github.com" || host === "www.github.com";
  });
}

function hasExternalLink(html: string, siteHost?: string): boolean {
  const own = siteHost?.toLowerCase();
  return contentLinks(html).some((url) => url.hostname.toLowerCase() !== own);
}

/** Heading levels present with visible text. */
function headingLevelsWithText(html: string): Set<number> {
  const levels = new Set<number>();
  for (const level of [1, 2, 3, 4, 5, 6]) {
    if (tagInnerHtml(html, `h${level}`).some(hasText)) levels.add(level);
  }
  return levels;
}

function headingContainsSpan(html: string): boolean {
  return [1, 2, 3, 4, 5, 6].some((level) =>
    tagInnerHtml(html, `h${level}`).some((inner) =>
      tagInnerHtml(inner, "span").some(hasText),
    ),
  );
}

function headingCountWithText(html: string, level: number): number {
  return tagInnerHtml(html, `h${level}`).filter(hasText).length;
}

function styledParagraph(html: string): boolean {
  const markup = renderedMarkup(html);
  const re = /<p\b[^>]*\bstyle\s*=\s*["'][^"']*(?:color|background)[^"']*["'][^>]*>([\s\S]*?)<\/p\s*>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(markup))) {
    if (hasText(match[1])) return true;
  }
  return false;
}

function styledBoxWithChildren(html: string): boolean {
  return /<div\b[^>]*\bstyle\s*=\s*["'][^"']*(?:color|background|border|padding)[^"']*["'][^>]*>\s*<(?!\/)/i.test(
    renderedMarkup(html),
  );
}

/** Lists of this tag (ol/ul) that hold at least one non-empty item. */
export function listsWithItems(html: string, tag: "ol" | "ul"): number {
  return tagInnerHtml(html, tag).filter((inner) =>
    tagInnerHtml(inner, "li").some((li) => hasText(li) || /<(img|a|input)\b/i.test(li)),
  ).length;
}

/** <tr> elements that hold at least one <td> or <th>. */
function rowsWithCells(html: string): number {
  const rows = html.match(/<tr\b[^>]*>[\s\S]*?(?=<tr\b|<\/tbody|<\/thead|<\/tfoot|<\/table|$)/gi) ?? [];
  return rows.filter((row) => /<t[dh]\b/i.test(row)).length;
}

/**
 * Rows (with cells) that belong to each table itself, not to tables nested
 * inside it. Many students lay out the Labs TOC with a one-row <table>;
 * that must not count as a data table.
 */
function tableOwnRowCounts(html: string): number[] {
  return tagInnerHtml(html, "table").map((inner) => {
    let own = inner;
    let previous = "";
    while (own !== previous) {
      previous = own;
      own = own.replace(/<table\b(?:(?!<table\b)[\s\S])*?<\/table\s*>/gi, "");
    }
    return rowsWithCells(own);
  });
}

function dataTableCount(html: string, minRows: number): number {
  return tableOwnRowCounts(html).filter((rows) => rows >= minRows).length;
}

function quizTableExtended(html: string): boolean {
  const text = renderedText(html);
  if (/\bQ4\b/.test(text) && /\bQ10\b/.test(text) && dataTableCount(html, 2) > 0) return true;
  return dataTableCount(html, 11) > 0;
}

function formsWithControls(html: string, minControls: number): number {
  return tagInnerHtml(html, "form").filter(
    (inner) => (renderedMarkup(inner).match(/<(input|select|textarea)\b/gi)?.length ?? 0) >= minControls,
  ).length;
}

/**
 * Anchors whose href points at an assignment (/assignments/<something>) and
 * that show something (text or an image), so an empty link is not an entry.
 */
export function assignmentLinkCount(html: string): number {
  // The course id in the href is not compared: a wrong id is a broken link
  // for a TA to note, not a missing Assignments list.
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;
  const source = renderedMarkup(html);
  let count = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source))) {
    const href = startTagAttr(`<a${match[1]}>`, "href") ?? "";
    if (!/\/assignments\/[^/?#\s]+/i.test(href)) continue;
    if (hasText(match[2]) || /<img\b/i.test(match[2])) count += 1;
  }
  return count;
}

/* ------------------------------------------------------------------ */
/* ids count only with content                                         */
/* ------------------------------------------------------------------ */

const LINK_IDS = new Set([
  "wd-lipsum",
  "wd-github",
  "wd-your-link",
  "wd-your-github",
  "wd-ai-link",
]);
const LINK_CONTAINER_IDS = new Set([
  "wd-kambaz-navigation",
  "wd-courses-navigation",
  "wd-account-navigation",
  "wd-labs",
  "wd-toc",
  "wd-dashboard",
  "wd-kambaz",
]);
const ASSIGNMENT_LIST_IDS = new Set(["wd-assignments", "wd-assignment-list"]);
const LIST_IDS = new Set([
  "wd-lists",
  "wd-pancakes",
  "wd-your-favorite-recipe",
  "wd-your-books",
  "wd-ai-html-tags",
  "wd-modules",
  "wd-module-list",
]);
const TABLE_IDS = new Set(["wd-tables", "wd-your-table"]);
const FORM_IDS = new Set([
  "wd-forms",
  "wd-your-form",
  "wd-assignments-editor",
  "wd-signin-screen",
  "wd-signup-screen",
  "wd-profile-screen",
  "wd-text-fields-username",
  "wd-textarea",
  "wd-radio-comedy",
  "wd-select-one-genre",
  "wd-name",
]);
const IMAGE_IDS = new Set(["wd-images", "wd-starship", "wd-teslabot", "wd-your-image", "wd-ai-image"]);
const HEADING_IDS = new Set(["wd-h-tag", "wd-ai-headings"]);
const TEXT_IDS = new Set([
  // Some students put the personal heading in a div; its text is the work.
  "wd-your-heading",
  "wd-your-span",
  "wd-p-tag",
  "wd-p-1",
  "wd-p-2",
  "wd-p-your-1",
  "wd-p-your-2",
  "wd-ai-p",
  "wd-highlighted-paragraph",
]);

const CONTENT_TAG = /<(img|input|select|textarea|button|a|li|tr|svg|video|iframe|h[1-6]|p|span|label)\b/i;
const CONTROL_TAGS = new Set(["input", "select", "textarea"]);

function isOrHasAnchor(element: IdElement): boolean {
  if (element.tag === "a") {
    const href = (startTagAttr(element.open, "href") ?? "").trim();
    return href !== "" && href !== "#";
  }
  return anchorHrefs(element.inner).some((href) => href.trim() !== "" && href.trim() !== "#");
}

/**
 * Does this element (found by its wd-* id) hold the content the book asks
 * for? An empty element with the right id is not the work.
 */
export function a1IdHasContent(id: string, element: IdElement): boolean {
  const key = id.toLowerCase();
  const { tag, inner, open } = element;
  if (LINK_IDS.has(key) || /-link$/.test(key)) return isOrHasAnchor(element);
  if (ASSIGNMENT_LIST_IDS.has(key)) return assignmentLinkCount(inner) >= MIN_ASSIGNMENT_LINKS;
  if (LINK_CONTAINER_IDS.has(key)) return isOrHasAnchor(element);
  if (LIST_IDS.has(key)) {
    return tagInnerHtml(inner, "li").some((li) => hasText(li) || /<(img|a|input)\b/i.test(li));
  }
  if (TABLE_IDS.has(key)) return rowsWithCells(inner) >= 2;
  if (FORM_IDS.has(key)) {
    return CONTROL_TAGS.has(tag) || /<(input|select|textarea)\b/i.test(inner);
  }
  if (IMAGE_IDS.has(key)) return (tag === "img" && isRealImage(open)) || realImageCount(inner) > 0;
  if (HEADING_IDS.has(key)) {
    return (/^h[1-6]$/.test(tag) && hasText(inner)) || headingLevelsWithText(inner).size > 0;
  }
  if (TEXT_IDS.has(key)) return hasText(inner);
  if (key === "wd-highlighted-box") return /<[a-z]/i.test(inner) && hasText(inner);
  if (tag === "img") return isRealImage(open);
  if (CONTROL_TAGS.has(tag)) return true;
  return hasText(inner) || CONTENT_TAG.test(inner);
}

/* ------------------------------------------------------------------ */
/* fallbacks by A1 criterion                                           */
/* ------------------------------------------------------------------ */

const LAB_PAGE: StructureTarget = { kind: "labPage" };
const LABS: StructureTarget = { kind: "labs" };

/**
 * Fallbacks by A1 criterion id. A spec that reads wd-* ids and has no entry
 * here (paragraph On your own / With AI, HTML-tags list With AI) has no
 * reliable structural signal: a miss there is "Needs TA review" when its
 * core item passed, and a fail otherwise.
 */
export const A1_STRUCTURE_FALLBACKS: Readonly<Record<string, StructureFallback>> = {
  // 1.3.1 HeadingTags
  "a1-lab-heading-tags": {
    looksFor: "headings h1–h6",
    missMessage: "Lab 1 doesn't show the h1–h6 headings you add as practice (all six levels, on top of the Heading Tags sample) yet.",
    // Presence of each level, not a count: the Labs pages are read together
    // (the id rule does the same), so a page heading in the Labs layout
    // counts. The home page is never read.
    target: LABS,
    test: (html) => headingLevelsWithText(html).size === 6,
    onMiss: "fail",
  },
  "a1-lab-heading-tags-oyo": {
    looksFor: "a heading that contains a span",
    missMessage: "We couldn't find your personal heading with a span inside it on Lab 1.",
    target: LAB_PAGE,
    test: (html) => headingContainsSpan(html),
    onMiss: "review",
  },
  "a1-lab-heading-tags-ai": {
    looksFor: "a second h6 (the sample outline after the practice headings)",
    missMessage: "We couldn't find the With AI sample outline (h4, h5, h6) after the practice headings on Lab 1.",
    target: LAB_PAGE,
    test: (html) => headingCountWithText(html, 6) >= 2,
    onMiss: "review",
  },
  // 1.3.2 ParagraphTag
  "a1-lab-paragraph": {
    looksFor: "paragraphs with text",
    missMessage: "Lab 1 doesn't have the sample paragraphs (at least two p elements with text).",
    target: LAB_PAGE,
    test: (html) => realParagraphCount(html) >= 2,
    onMiss: "fail",
  },
  // 1.3.3 ListTags
  "a1-lab-lists": {
    looksFor: "an ordered list and an unordered list with items",
    missMessage: "Lab 1 needs both an ordered list and an unordered list, each with items.",
    target: LAB_PAGE,
    test: (html) => listsWithItems(html, "ol") >= 1 && listsWithItems(html, "ul") >= 1,
    onMiss: "fail",
  },
  "a1-lab-lists-oyo": {
    looksFor: "a second ordered list with items",
    missMessage: "We couldn't find your own recipe list (a second ordered list with items) on Lab 1.",
    target: LAB_PAGE,
    test: (html) => listsWithItems(html, "ol") >= 2,
    onMiss: "review",
  },
  // 1.3.4 Tables
  "a1-lab-tables": {
    looksFor: "a data table with at least three rows of cells",
    missMessage: "Lab 1 doesn't have the quiz table (a table with at least three rows of cells).",
    target: LAB_PAGE,
    test: (html) => dataTableCount(html, 3) >= 1,
    onMiss: "fail",
  },
  "a1-lab-tables-oyo": {
    looksFor: "a second data table",
    missMessage: "We couldn't find your own table (a second table with rows of cells) on Lab 1.",
    target: LAB_PAGE,
    test: (html) => dataTableCount(html, 2) >= 2,
    onMiss: "review",
  },
  "a1-lab-tables-ai": {
    looksFor: "quiz rows Q4–Q10 or a table with at least 11 rows",
    missMessage: "The quiz table doesn't have rows Q4 through Q10 yet.",
    target: LAB_PAGE,
    test: (html) => quizTableExtended(html),
    onMiss: "review",
  },
  // 1.3.5 Images
  "a1-lab-images": {
    looksFor: "images",
    missMessage: "Lab 1 doesn't show the sample images yet.",
    target: LAB_PAGE,
    test: (html) => realImageCount(html) >= 1,
    onMiss: "fail",
  },
  "a1-lab-images-oyo": {
    looksFor: "a third image (after the two samples)",
    missMessage: "We couldn't find your own image (a third image after the two samples) on Lab 1.",
    target: LAB_PAGE,
    test: (html) => realImageCount(html) >= 3,
    onMiss: "review",
  },
  "a1-lab-images-ai": {
    looksFor: "a fourth image",
    missMessage: "We couldn't find the With AI sample image (a fourth image) on Lab 1.",
    target: LAB_PAGE,
    test: (html) => realImageCount(html) >= 4,
    onMiss: "review",
  },
  // 1.3.6 Forms
  "a1-lab-forms": {
    looksFor: "at least three kinds of form controls (text, textarea, radio, select)",
    missMessage: "Lab 1 needs the sample form controls (at least three of: text field, textarea, radio buttons, dropdown).",
    target: LAB_PAGE,
    test: (html) => {
      const kinds = formControlKinds(html);
      return ["text", "textarea", "radio", "select"].filter((kind) =>
        kinds.has(kind as "text"),
      ).length >= 3;
    },
    onMiss: "fail",
  },
  "a1-lab-forms-oyo": {
    looksFor: "a form with fields",
    missMessage: "We couldn't find your Student Profile form (a form with fields) on Lab 1.",
    target: LAB_PAGE,
    test: (html) => formsWithControls(html, 2) >= 1,
    onMiss: "review",
  },
  // 1.3.7 / 1.3.8 Highlighted components
  "a1-lab-highlighted-paragraph": {
    looksFor: "a paragraph with an inline color or background style",
    missMessage: "We couldn't find a highlighted paragraph (a paragraph with a color or background style) on Lab 1.",
    target: LAB_PAGE,
    test: (html) => styledParagraph(html),
    onMiss: "review",
  },
  "a1-lab-highlighted-box": {
    looksFor: "a styled box that wraps other elements",
    missMessage: "We couldn't find a highlighted box (a styled box that wraps other elements) on Lab 1.",
    target: LAB_PAGE,
    test: (html) => styledBoxWithChildren(html),
    onMiss: "review",
  },
  // 1.3.9 AnchorTag
  "a1-lab-anchor": {
    looksFor: "a link to another site",
    missMessage: "Lab 1 doesn't have a link to another site (for example the lipsum link).",
    target: LAB_PAGE,
    test: (html, ctx) => hasExternalLink(html, ctx.siteHost),
    onMiss: "fail",
  },
  "a1-lab-anchor-oyo": {
    looksFor: "a personal link (GitHub profile, LinkedIn, portfolio, …)",
    missMessage: "We couldn't find a personal link (your GitHub profile, LinkedIn, or portfolio) on Lab 1.",
    target: LAB_PAGE,
    test: (html, ctx) => a1PersonalLinksFound(html, ctx.siteHost),
    onMiss: "fail",
  },
  "a1-lab-anchor-ai": {
    looksFor: "a link to documentation (MDN or similar)",
    missMessage: "We couldn't find the With AI documentation link (for example MDN) on Lab 1.",
    target: LAB_PAGE,
    test: (html) => hasDocsLink(html),
    onMiss: "review",
  },
  // 1.3.10 Labs navigation
  "a1-lab-labs-nav-oyo": {
    looksFor: "a link to /labs/lab4",
    missMessage: "The Labs index doesn't link to Lab 4 (/labs/lab4).",
    target: LABS,
    test: (html, ctx) => htmlHasAnchorPath(renderedMarkup(html), "/labs/lab4", ctx.siteHost),
    onMiss: "fail",
  },
  // 1.3.11 Labs TOC
  "a1-lab-toc": {
    looksFor: "TOC links (to /labs, /labs/lab2, or /labs/lab3) on the Lab 1 page",
    missMessage:
      "The Lab 1 page doesn't show the Labs table of contents (links to the other labs). Put the TOC in app/labs/layout.tsx so it wraps every lab page.",
    target: { kind: "path", path: "/labs/lab1", name: "the Lab 1 page" },
    test: (html, ctx) => {
      const markup = renderedMarkup(html);
      return ["/labs", "/labs/lab2", "/labs/lab3"].some((path) =>
        htmlHasAnchorPath(markup, path, ctx.siteHost),
      );
    },
    onMiss: "fail",
  },
  "a1-lab-toc-ai": {
    // No id: a link to /book/ch1 (https://kambaz.dev/book/ch1 or relative).
    looksFor: "a link to the book (/book/ch1)",
    missMessage: "The Labs table of contents doesn't link to Chapter 1 of the book (https://kambaz.dev/book/ch1).",
    target: LABS,
    test: (html) => htmlHasAnchorPathMatching(renderedMarkup(html), /^\/book\/ch1(\/|$)/i),
    onMiss: "fail",
  },
  // Kambaz screens
  "a1-kambaz-account": {
    looksFor: "a password field and a link or page for Sign up / Profile",
    missMessage:
      "The Account screens need a Sign in form with a password field, plus a Sign up or Profile screen.",
    target: { kind: "screen", pattern: ACCOUNT, name: "the Account screens", example: "/account/signin" },
    test: (html, ctx) => {
      if (!formControlKinds(html).has("password")) return false;
      return (
        htmlHasAnchorPathMatching(ctx.allHtml, /^\/account\/(signup|profile)$/i) ||
        ctx.pages
          .filter((page) => /^\/account\/(signup|profile)$/i.test(page.path))
          .some((page) => formControlKinds(page.html).size > 0)
      );
    },
    onMiss: "fail",
  },
  "a1-kambaz-dashboard": {
    looksFor: "course links on /dashboard",
    missMessage: "The Dashboard doesn't link to any courses (/courses/…/home).",
    target: { kind: "screen", pattern: DASHBOARD, name: "the Dashboard", example: "/dashboard" },
    test: (html) => htmlHasAnchorPathMatching(html, /^\/courses\/[^/]+(\/home)?$/i),
    onMiss: "fail",
  },
  "a1-kambaz-nav": {
    looksFor: "Kambaz navigation links to /dashboard and /account",
    missMessage: "We couldn't find the Kambaz navigation (links to /dashboard and /account).",
    target: { kind: "site" },
    test: (html) =>
      htmlHasAnchorPathMatching(html, /^\/dashboard$/i) &&
      htmlHasAnchorPathMatching(html, /^\/account(\/|$)/i),
    onMiss: "fail",
  },
  "a1-kambaz-course-nav": {
    looksFor: "course navigation links (Home and Modules)",
    missMessage: "We couldn't find the course navigation (links to the course Home and Modules screens).",
    target: { kind: "site" },
    test: (html) =>
      htmlHasAnchorPathMatching(html, /^\/courses\/[^/]+\/modules$/i) &&
      htmlHasAnchorPathMatching(html, /^\/courses\/[^/]+\/(home|assignments|piazza)$/i),
    onMiss: "fail",
  },
  "a1-kambaz-modules": {
    looksFor: "a list with items on the Modules screen",
    missMessage: "The Modules screen doesn't show a list of modules.",
    target: { kind: "screen", pattern: COURSE_MODULES, name: "the Modules screen", example: "/courses/1234/modules" },
    test: (html) => listsWithItems(html, "ul") >= 1 || listsWithItems(html, "ol") >= 1,
    onMiss: "review",
  },
  "a1-kambaz-home": {
    looksFor: "content (a list or buttons) on the course Home screen",
    missMessage: "The course Home screen doesn't show the modules or the course status buttons.",
    target: { kind: "screen", pattern: COURSE_HOME, name: "the course Home screen", example: "/courses/1234/home" },
    test: (html) =>
      listsWithItems(html, "ul") >= 1 ||
      listsWithItems(html, "ol") >= 1 ||
      tagInnerHtml(html, "button").some(hasText),
    onMiss: "review",
  },
  "a1-kambaz-assignments": {
    looksFor: "at least one assignment linking to its editor (/assignments/:aid) on the Assignments screen",
    missMessage: ASSIGNMENTS_MISS_MESSAGE,
    target: {
      kind: "screen",
      pattern: COURSE_ASSIGNMENTS,
      name: "the Assignments screen",
      example: "/courses/1234/assignments",
    },
    test: (html) => assignmentLinkCount(html) >= MIN_ASSIGNMENT_LINKS,
    onMiss: "fail",
  },
  "a1-kambaz-editor": {
    looksFor: "form fields on the Assignment Editor screen",
    missMessage: "The Assignment Editor needs its form fields (a name field plus a description or dropdowns).",
    target: {
      kind: "screen",
      pattern: COURSE_EDITOR,
      name: "the Assignment Editor",
      example: "/courses/1234/assignments/123",
    },
    test: (html) => {
      const kinds = formControlKinds(html);
      return kinds.has("text") && (kinds.has("textarea") || kinds.has("select"));
    },
    onMiss: "fail",
  },
};

/** Labs navigation (delivery): a link to any lab page from the Labs pages. */
export function a1LabsNavStructurePassed(labsHtml: string, siteHost?: string): boolean {
  const markup = renderedMarkup(labsHtml);
  return ["/labs/lab1", "/labs/lab2", "/labs/lab3"].some((path) =>
    htmlHasAnchorPath(markup, path, siteHost),
  );
}

/** GitHub link on Labs (delivery): any link to github.com, like wd-github. */
export function a1GithubLinkStructurePassed(labsHtml: string): boolean {
  return hasGithubLink(labsHtml);
}
