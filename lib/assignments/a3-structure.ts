/**
 * A3 structure and content checks.
 *
 * A3 never reads wd-* ids: every item is graded on what the deployed page
 * shows (element, count, content) and on consistency between screens (the
 * card title appears in the course heading, two courses show different
 * lists, /labs/lab3/add/12/30 shows 42). Students may rename labels and
 * sample values; only structure and computed results count. An element
 * that carries the book's id but has no content earns nothing.
 *
 * A check that needs a second page:
 *   - the page returned 404 (or another definite not-found) → fail;
 *   - the page couldn't be opened (timeout, 5xx, login) → re-check, points kept;
 *   - the crawl never reached it (e.g. renamed course ids) → TA review.
 *
 * Student-facing messages never name an id.
 */
import { a1IdHasContent, isDefiniteNotFound, type StructureContext, type StructureFallback, type StructureTarget, type StructureVerdict } from "./a1-structure";
import { renderedMarkup, renderedText, startTagAttr, type IdElement } from "./html";

/* ------------------------------------------------------------------ */
/* markup helpers                                                      */
/* ------------------------------------------------------------------ */

type El = { tag: string; open: string; inner: string; index: number };

const VOID_TAGS = new Set(["area", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

export function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&");
}

/** Elements of one tag in rendered markup (scripts, styles, comments removed). */
function elements(html: string, tag: string, rendered = false): El[] {
  const source = rendered ? html : renderedMarkup(html);
  const out: El[] = [];
  const openRe = new RegExp(`<${tag}\\b[^>]*>`, "gi");
  let match: RegExpExecArray | null;
  while ((match = openRe.exec(source))) {
    const open = match[0];
    if (VOID_TAGS.has(tag) || /\/\s*>$/.test(open)) {
      out.push({ tag, open, inner: "", index: match.index });
      continue;
    }
    const start = match.index + open.length;
    const tagRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    tagRe.lastIndex = start;
    let depth = 1;
    let end = source.length;
    let closer: RegExpExecArray | null;
    while ((closer = tagRe.exec(source))) {
      if (!closer[1] && /\/\s*>$/.test(closer[0])) continue;
      depth += closer[1] ? -1 : 1;
      if (depth === 0) {
        end = closer.index;
        break;
      }
    }
    out.push({ tag, open, inner: source.slice(start, end), index: match.index });
  }
  return out;
}

/** Direct child elements of a fragment (any tag). */
function children(inner: string): El[] {
  const out: El[] = [];
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g;
  let depth = 0;
  let current: { tag: string; open: string; start: number; index: number } | null = null;
  let match: RegExpExecArray | null;
  while ((match = re.exec(inner))) {
    const [whole, closing, rawTag] = match;
    const tag = rawTag.toLowerCase();
    const selfClosing = VOID_TAGS.has(tag) || /\/\s*>$/.test(whole);
    if (!closing) {
      if (depth === 0) {
        if (selfClosing) {
          out.push({ tag, open: whole, inner: "", index: match.index });
          continue;
        }
        current = { tag, open: whole, start: match.index + whole.length, index: match.index };
      }
      if (!selfClosing) depth += 1;
    } else {
      depth -= 1;
      if (depth === 0 && current) {
        out.push({ tag: current.tag, open: current.open, inner: inner.slice(current.start, match.index), index: current.index });
        current = null;
      }
      if (depth < 0) depth = 0;
    }
  }
  return out;
}

function attr(open: string, name: string): string {
  return decodeEntities(startTagAttr(open, name) ?? "");
}

export function textOf(html: string): string {
  return decodeEntities(renderedText(html));
}

function removeNested(inner: string, tag: string): string {
  let out = inner;
  for (const nested of elements(inner, tag, true)) {
    out = out.replace(`${nested.open}${nested.inner}`, "");
  }
  return out;
}

/** Body text minus the template copy; boilerplate means not real work. */
const BOILERPLATE_TEXT =
  /(to get started, edit|get started by editing|looking for a starting point or more instructions|save and see your changes instantly)/i;

export function isBoilerplatePage(html: string): boolean {
  const body = /<body\b[\s\S]*<\/body>/i.exec(html)?.[0] ?? html;
  const text = textOf(body);
  return BOILERPLATE_TEXT.test(text) || text.length < 40;
}

/** A same-site link's pathname (no trailing slash), or null. */
export function localPath(href: string, siteHost?: string): string | null {
  const raw = decodeEntities(href.trim());
  if (!raw || raw.startsWith("#") || /^(mailto|tel|javascript):/i.test(raw)) return null;
  try {
    const url = new URL(raw, "https://deploy.invalid");
    if (url.hostname !== "deploy.invalid") {
      if (!siteHost || url.hostname.toLowerCase() !== siteHost.toLowerCase()) return null;
    }
    return decodeURIComponent(url.pathname).replace(/\/+$/, "") || "/";
  } catch {
    return null;
  }
}

type Anchor = { href: string; path: string | null; open: string; inner: string; text: string; index: number };

function anchors(html: string, siteHost?: string): Anchor[] {
  return elements(html, "a").map((element) => {
    const href = attr(element.open, "href");
    return {
      href,
      path: localPath(href, siteHost),
      open: element.open,
      inner: element.inner,
      text: textOf(element.inner),
      index: element.index,
    };
  });
}

function headingTexts(html: string, levels = [1, 2, 3, 4, 5, 6]): string[] {
  return levels
    .flatMap((level) => elements(html, `h${level}`).map((element) => ({ index: element.index, text: textOf(element.inner) })))
    .filter((heading) => heading.text.length > 0)
    .sort((a, b) => a.index - b.index)
    .map((heading) => heading.text);
}

function samePath(a: string, b: string): boolean {
  return a.replace(/\/+$/, "").toLowerCase() === b.replace(/\/+$/, "").toLowerCase();
}

/** How a link is marked: class, style, and aria-current together. */
function markOf(anchor: Anchor): string {
  return [attr(anchor.open, "class"), attr(anchor.open, "style"), attr(anchor.open, "aria-current")].join("|");
}

/* ------------------------------------------------------------------ */
/* pages                                                               */
/* ------------------------------------------------------------------ */

type Lookup =
  | { state: "ok"; html: string }
  | { state: "missing" }
  | { state: "unreachable" }
  | { state: "untried" };

function lookup(ctx: StructureContext, path: string): Lookup {
  const page = ctx.pages.find((entry) => samePath(entry.path, path));
  if (page) return { state: "ok", html: page.html };
  const tried = (ctx.attempted ?? []).filter((entry) => samePath(entry.path, path));
  if (tried.length === 0) return { state: "untried" };
  if (tried.every((entry) => isDefiniteNotFound(entry))) return { state: "missing" };
  return { state: "unreachable" };
}

/** Folds the states of pages a check needed but couldn't read. */
function notOk(states: readonly Lookup["state"][]): StructureVerdict {
  if (states.includes("missing")) return false;
  if (states.includes("unreachable")) return "unreachable";
  return "review";
}

const memo = new WeakMap<StructureContext, Map<string, StructureVerdict>>();

/** Cross-page checks ignore the page they are handed; run them once per crawl. */
function once(key: string, ctx: StructureContext, run: () => StructureVerdict): StructureVerdict {
  let cache = memo.get(ctx);
  if (!cache) {
    cache = new Map();
    memo.set(ctx, cache);
  }
  if (!cache.has(key)) cache.set(key, run());
  return cache.get(key)!;
}

/* ------------------------------------------------------------------ */
/* Delivery                                                            */
/* ------------------------------------------------------------------ */

/** Lab 1, Lab 2, Lab 3, and a link into Kambaz (any same-site page outside /labs). */
export function a3LabsNavStructurePassed(labsHtml: string, siteHost?: string): boolean {
  const paths = anchors(labsHtml, siteHost)
    .map((anchor) => anchor.path)
    .filter((path): path is string => Boolean(path));
  const labs = ["/labs/lab1", "/labs/lab2", "/labs/lab3"].every((lab) => paths.some((path) => samePath(path, lab)));
  const kambaz = paths.some((path) => !/^\/labs(\/|$)/i.test(path));
  return labs && kambaz;
}

/** A link to a GitHub repository: https://github.com/<owner>/<repo>. */
export function a3GithubLinkStructurePassed(labsHtml: string): boolean {
  return anchors(labsHtml).some((anchor) => isStudentRepoUrl(anchor.href));
}

/* ------------------------------------------------------------------ */
/* Lab 3                                                               */
/* ------------------------------------------------------------------ */

export const A3_MIN_LAB_HEADINGS = 20;

export function lab3HasSections(html: string): boolean {
  return !isBoilerplatePage(html) && headingTexts(html).length >= A3_MIN_LAB_HEADINGS;
}

function preJson(html: string): unknown[] {
  return elements(html, "pre").flatMap((pre) => {
    try {
      return [JSON.parse(decodeEntities(pre.inner.replace(/<[^>]+>/g, "")))];
    } catch {
      return [];
    }
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function lab3HasPrettyJson(html: string): boolean {
  return preJson(html).some((value) => {
    if (!isPlainObject(value)) return false;
    const values = Object.values(value);
    return values.some((entry) => Array.isArray(entry)) && values.some((entry) => isPlainObject(entry));
  });
}

/** Rows that belong to this table (nested tables removed) with ≥ minCells cells. */
function ownRows(tableInner: string, minCells: number): number {
  const own = removeNested(tableInner, "table");
  return elements(own, "tr", true).filter((row) => elements(row.inner, "td", true).length >= minCells).length;
}

export function lab3HasImportsTable(html: string): boolean {
  return elements(html, "table").some((table) => ownRows(table.inner, 3) >= 4);
}

const BOX_TAGS = ["div", "p", "span", "section", "article", "li"];
const INLINE_BACKGROUND = /(^|;)\s*background(-color)?\s*:/i;

export function lab3InlineStyledBoxes(html: string): number {
  return BOX_TAGS.flatMap((tag) => elements(html, tag)).filter(
    (element) => INLINE_BACKGROUND.test(attr(element.open, "style")) && textOf(element.inner).length > 0,
  ).length;
}

/**
 * Boxes colored by classes: one container with at least four child boxes
 * that have text and a class, and no inline background.
 */
export function lab3ClassBoxes(html: string): number {
  let best = 0;
  for (const tag of ["div", "section", "td", "ul", "body"]) {
    for (const container of elements(html, tag)) {
      const boxes = children(container.inner).filter(
        (child) =>
          (child.tag === "div" || child.tag === "p" || child.tag === "li") &&
          attr(child.open, "class").trim().length > 0 &&
          !INLINE_BACKGROUND.test(attr(child.open, "style")) &&
          textOf(child.inner).length > 0 &&
          textOf(child.inner).length <= 200,
      );
      best = Math.max(best, boxes.length);
    }
  }
  return best;
}

const FILE_NAME = /^[\w@()[\]+-][\w@()[\]. +-]*\.[a-z0-9]{1,6}$/i;

export function lab3HasClientAndServer(html: string): boolean {
  const client = textOf(html).includes("/labs/lab3");
  const fromPre = preJson(html).some(
    (value) => Array.isArray(value) && value.length >= 3 && value.every((entry) => typeof entry === "string"),
  );
  const fromList = ["ul", "ol"].some((tag) =>
    elements(html, tag).some(
      (list) => elements(list.inner, "li", true).filter((li) => FILE_NAME.test(textOf(li.inner))).length >= 3,
    ),
  );
  return client && (fromPre || fromList);
}

export function lab3TocHighlight(lab3Html: string, ctx: StructureContext): StructureVerdict {
  const first = (html: string, path: string) =>
    anchors(html, ctx.siteHost).find((anchor) => anchor.path !== null && samePath(anchor.path, path));
  const on3 = { lab3: first(lab3Html, "/labs/lab3"), lab1: first(lab3Html, "/labs/lab1") };
  if (!on3.lab3 || !on3.lab1 || markOf(on3.lab3) === markOf(on3.lab1)) return false;
  const lab1 = lookup(ctx, "/labs/lab1");
  if (lab1.state !== "ok") return notOk([lab1.state]);
  const on1 = { lab3: first(lab1.html, "/labs/lab3"), lab1: first(lab1.html, "/labs/lab1") };
  if (!on1.lab3 || !on1.lab1) return false;
  // The current lab is marked on its own page, and the marking moves.
  return markOf(on1.lab1) !== markOf(on1.lab3) && markOf(on1.lab1) === markOf(on3.lab3);
}

const ADD_LINK = /^\/labs\/lab3\/add\/-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/i;
export const A3_ADD_PROBES: readonly { path: string; sum: string }[] = [
  { path: "/labs/lab3/add/12/30", sum: "42" },
  { path: "/labs/lab3/add/7/8", sum: "15" },
];

function showsNumber(text: string, value: string): boolean {
  return new RegExp(`(^|[^\\d.])${value}([^\\d.]|$)`).test(text);
}

export function lab3PathParameters(lab3Html: string, ctx: StructureContext): StructureVerdict {
  const links = new Set(
    anchors(lab3Html, ctx.siteHost)
      .map((anchor) => anchor.path)
      .filter((path): path is string => Boolean(path && ADD_LINK.test(path))),
  );
  if (links.size < 2) return false;
  const pages = A3_ADD_PROBES.map((probe) => ({ probe, page: lookup(ctx, probe.path) }));
  const unread = pages.filter(({ page }) => page.state !== "ok").map(({ page }) => page.state);
  if (unread.length > 0) return notOk(unread);
  return pages.every(({ probe, page }) => page.state === "ok" && showsNumber(textOf(page.html), probe.sum));
}

function isChecked(open: string): boolean {
  return /\schecked(\s|=|\/|>)/i.test(open);
}

export function lab3HasTodoList(html: string): boolean {
  return ["ul", "ol"].some((tag) =>
    elements(html, tag).some((list) => {
      const boxes = elements(list.inner, "input", true).filter((input) => attr(input.open, "type").toLowerCase() === "checkbox");
      return boxes.length >= 3 && boxes.some((box) => isChecked(box.open)) && boxes.some((box) => !isChecked(box.open));
    }),
  );
}

/* ------------------------------------------------------------------ */
/* Kambaz                                                              */
/* ------------------------------------------------------------------ */

const COURSE_HOME_LINK = /^\/courses\/([^/]+)\/home$/i;

/** Distinct course ids linked from the Dashboard (/courses/<id>/home). */
export function dashboardCourseIds(dashboardHtml: string, siteHost?: string): string[] {
  const ids: string[] = [];
  for (const anchor of anchors(dashboardHtml, siteHost)) {
    const id = anchor.path ? COURSE_HOME_LINK.exec(anchor.path)?.[1] : undefined;
    if (id && !ids.some((known) => known.toLowerCase() === id.toLowerCase())) ids.push(id);
  }
  return ids;
}

export const A3_MIN_DASHBOARD_COURSES = 3;

export function dashboardHasCourses(html: string, ctx: StructureContext): boolean {
  return dashboardCourseIds(html, ctx.siteHost).length >= A3_MIN_DASHBOARD_COURSES;
}

/**
 * Two courses to compare: Dashboard courses whose home page opened, then any
 * other course home the crawl reached (so one broken card grid doesn't
 * zero every Kambaz item).
 */
function compareCourses(ctx: StructureContext): { ids: string[]; fromDashboard: string[]; states: Lookup["state"][] } {
  const dashboard = lookup(ctx, "/dashboard");
  const fromDashboard = dashboard.state === "ok" ? dashboardCourseIds(dashboard.html, ctx.siteHost) : [];
  const ids: string[] = [];
  const states: Lookup["state"][] = [];
  for (const id of fromDashboard) {
    const home = lookup(ctx, `/courses/${id}/home`);
    if (home.state === "ok") ids.push(id);
    else states.push(home.state);
  }
  for (const page of ctx.pages) {
    const id = COURSE_HOME_LINK.exec(page.path.replace(/\/+$/, ""))?.[1];
    if (id && !ids.some((known) => known.toLowerCase() === id.toLowerCase())) ids.push(id);
  }
  return { ids, fromDashboard, states };
}

function pageOf(ctx: StructureContext, id: string, screen: string): Lookup {
  return lookup(ctx, `/courses/${id}/${screen}`);
}

const NAV_PATH = /^\/(dashboard|calendar|inbox|labs|courses|account)(\/[^/]*)?$/i;

/** Kambaz sidebar links on a page that are marked differently from the rest. */
function highlightedNavItems(html: string, siteHost?: string): { key: string; path: string }[] | null {
  const seen = new Map<string, { key: string; path: string; mark: string }>();
  for (const anchor of anchors(html, siteHost)) {
    if (!anchor.path || !NAV_PATH.test(anchor.path) || /^\/labs\/.+/i.test(anchor.path)) continue;
    if (/^\/courses\/[^/]+/i.test(anchor.path)) continue;
    const key = `${anchor.path.toLowerCase()}|${anchor.text.toLowerCase()}`;
    if (!seen.has(key)) seen.set(key, { key, path: anchor.path, mark: markOf(anchor) });
  }
  const items = [...seen.values()];
  if (items.length < 4) return null;
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.mark, (counts.get(item.mark) ?? 0) + 1);
  const common = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  return items.filter((item) => item.mark !== common);
}

export function kambazNavHighlight(dashboardHtml: string, ctx: StructureContext): StructureVerdict {
  const onDashboard = highlightedNavItems(dashboardHtml, ctx.siteHost);
  if (!onDashboard || onDashboard.length !== 1 || !samePath(onDashboard[0].path, "/dashboard")) return false;
  const { ids, states } = compareCourses(ctx);
  if (ids.length === 0) return notOk(states.length ? states : ["untried"]);
  const home = pageOf(ctx, ids[0], "home");
  if (home.state !== "ok") return notOk([home.state]);
  const inCourse = highlightedNavItems(home.html, ctx.siteHost);
  return Boolean(inCourse && inCourse.length === 1 && inCourse[0].key !== onDashboard[0].key);
}

function cardTitles(dashboardHtml: string, id: string, siteHost?: string): string[] {
  const titles = new Set<string>();
  for (const anchor of anchors(dashboardHtml, siteHost)) {
    if (!anchor.path || !samePath(anchor.path, `/courses/${id}/home`)) continue;
    for (const heading of headingTexts(anchor.inner)) titles.add(heading);
    for (const image of elements(anchor.inner, "img", true)) {
      const alt = attr(image.open, "alt").trim();
      if (alt) titles.add(alt);
    }
    if (anchor.text.length >= 3 && anchor.text.length <= 80 && !/^(go|open|view|enter)$/i.test(anchor.text)) {
      titles.add(anchor.text);
    }
  }
  return [...titles].filter((title) => title.length >= 3);
}

export function coursesFromUrl(_html: string, ctx: StructureContext): StructureVerdict {
  return once("courses", ctx, () => {
    const dashboard = lookup(ctx, "/dashboard");
    if (dashboard.state !== "ok") return notOk([dashboard.state]);
    const { fromDashboard } = compareCourses(ctx);
    const opened: { id: string; headings: string[] }[] = [];
    const states: Lookup["state"][] = [];
    for (const id of fromDashboard) {
      const home = pageOf(ctx, id, "home");
      if (home.state === "ok") opened.push({ id, headings: headingTexts(home.html, [1, 2, 3, 4]).map((text) => text.toLowerCase()) });
      else states.push(home.state);
      if (opened.length === 2) break;
    }
    if (opened.length < 2) return fromDashboard.length < 2 ? false : notOk(states);
    const [a, b] = opened;
    const titlesA = cardTitles(dashboard.html, a.id, ctx.siteHost).map((title) => title.toLowerCase());
    const titlesB = cardTitles(dashboard.html, b.id, ctx.siteHost).map((title) => title.toLowerCase());
    const shows = (headings: string[], titles: string[]) => titles.some((title) => headings.some((heading) => heading.includes(title)));
    const distinctA = titlesA.filter((title) => !titlesB.includes(title));
    const distinctB = titlesB.filter((title) => !titlesA.includes(title));
    if (distinctA.length === 0 || distinctB.length === 0) return "review";
    return shows(a.headings, distinctA) && shows(b.headings, distinctB) && !shows(b.headings, distinctA) && !shows(a.headings, distinctB);
  });
}

const COURSE_SCREENS = ["home", "modules", "assignments"];

export function courseNavigationKeepsId(_html: string, ctx: StructureContext): StructureVerdict {
  return once("course-nav", ctx, () => {
    const { ids, states } = compareCourses(ctx);
    if (ids.length === 0) return notOk(states.length ? states : ["untried"]);
    return ids.slice(0, 2).every((id) => {
      const home = pageOf(ctx, id, "home");
      if (home.state !== "ok") return false;
      const paths = anchors(home.html, ctx.siteHost)
        .map((anchor) => anchor.path)
        .filter((path): path is string => Boolean(path));
      const has = (screen: string) => paths.some((path) => samePath(path, `/courses/${id}/${screen}`));
      const people = paths.some((path) => path.toLowerCase().startsWith(`/courses/${id}/people`.toLowerCase()));
      return COURSE_SCREENS.every(has) && people;
    });
  });
}

function courseHeading(html: string): string {
  return headingTexts(html, [1, 2, 3])[0] ?? "";
}

export function breadcrumbTracksSection(_html: string, ctx: StructureContext): StructureVerdict {
  return once("breadcrumb", ctx, () => {
    const { ids, states } = compareCourses(ctx);
    if (ids.length === 0) return notOk(states.length ? states : ["untried"]);
    const pages = COURSE_SCREENS.map((screen) => pageOf(ctx, ids[0], screen));
    const unread = pages.filter((page) => page.state !== "ok").map((page) => page.state);
    if (unread.length > 0) return notOk(unread);
    const headings = pages.map((page) => (page.state === "ok" ? courseHeading(page.html) : ""));
    return headings.every(Boolean) && new Set(headings).size === headings.length;
  });
}

/** Two courses' versions of a screen, both readable, or why not. */
function twoCourses(ctx: StructureContext, screen: string): { a: string; b: string; ids: string[] } | StructureVerdict {
  const { ids, states } = compareCourses(ctx);
  const read: { id: string; html: string }[] = [];
  const unread: Lookup["state"][] = [...states];
  for (const id of ids) {
    const page = pageOf(ctx, id, screen);
    if (page.state === "ok") read.push({ id, html: page.html });
    else unread.push(page.state);
    if (read.length === 2) break;
  }
  if (read.length < 2) return ids.length < 2 ? false : notOk(unread);
  return { a: read[0].html, b: read[1].html, ids: [read[0].id, read[1].id] };
}

function listItemText(html: string): string {
  return elements(html, "li")
    .map((li) => textOf(li.inner))
    .filter(Boolean)
    .sort()
    .join("|");
}

export function modulesDifferByCourse(_html: string, ctx: StructureContext): StructureVerdict {
  return once("modules", ctx, () => {
    const pair = twoCourses(ctx, "modules");
    if (typeof pair !== "object") return pair;
    const a = listItemText(pair.a);
    const b = listItemText(pair.b);
    return a !== "" && b !== "" && a !== b;
  });
}

function assignmentLinks(html: string, id: string, siteHost?: string): Anchor[] {
  const pattern = new RegExp(`^/courses/${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/assignments/[^/]+$`, "i");
  const seen = new Set<string>();
  return anchors(html, siteHost).filter((anchor) => {
    if (!anchor.path || !pattern.test(anchor.path)) return false;
    const key = anchor.path.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function assignmentsDifferByCourse(_html: string, ctx: StructureContext): StructureVerdict {
  return once("assignments", ctx, () => {
    const pair = twoCourses(ctx, "assignments");
    if (typeof pair !== "object") return pair;
    const tail = (anchor: Anchor) => anchor.path!.split("/").pop()!.toLowerCase();
    const a = assignmentLinks(pair.a, pair.ids[0], ctx.siteHost).map(tail).sort().join(",");
    const b = assignmentLinks(pair.b, pair.ids[1], ctx.siteHost).map(tail).sort().join(",");
    return a !== "" && b !== "" && a !== b;
  });
}

function fieldValues(html: string): string[] {
  const inputs = elements(html, "input").map((input) => attr(input.open, "value"));
  const areas = elements(html, "textarea").map((area) => decodeEntities(area.inner));
  return [...inputs, ...areas].map((value) => value.trim().toLowerCase()).filter(Boolean);
}

function editorShows(html: string, title: string): boolean {
  const wanted = title.trim().toLowerCase();
  if (wanted.length < 2) return false;
  return fieldValues(html).some((value) => value === wanted || (value.length >= 2 && (wanted.includes(value) || value.includes(wanted))));
}

/** The editor shows the clicked assignment: two assignments, two titles. */
export function editorShowsClickedAssignment(_html: string, ctx: StructureContext): StructureVerdict {
  return once("editor", ctx, () => {
    const { ids } = compareCourses(ctx);
    const unread: Lookup["state"][] = [];
    for (const id of ids) {
      const list = pageOf(ctx, id, "assignments");
      if (list.state !== "ok") continue;
      const checked: { title: string; ok: boolean }[] = [];
      for (const link of assignmentLinks(list.html, id, ctx.siteHost)) {
        if (!link.text) continue;
        const page = lookup(ctx, link.path!);
        if (page.state !== "ok") {
          unread.push(page.state);
          continue;
        }
        checked.push({ title: link.text.toLowerCase(), ok: editorShows(page.html, link.text) });
        if (checked.length === 2) break;
      }
      if (checked.some((entry) => !entry.ok)) return false;
      if (checked.length === 2) return checked[0].title !== checked[1].title;
    }
    // Fewer than two editors were reachable: never a fail on the crawl's account.
    return unread.includes("unreachable") ? "unreachable" : "review";
  });
}

function rosterText(html: string): string {
  const bodies = elements(html, "tbody");
  const rows = (bodies.length ? bodies.flatMap((body) => elements(body.inner, "tr", true)) : elements(html, "tr")).filter(
    (row) => elements(row.inner, "td", true).length > 0,
  );
  return rows
    .map((row) => textOf(row.inner))
    .filter(Boolean)
    .sort()
    .join("|");
}

export function peopleDifferByCourse(_html: string, ctx: StructureContext): StructureVerdict {
  return once("people", ctx, () => {
    const pair = twoCourses(ctx, "people/table");
    if (typeof pair !== "object") return pair;
    const a = rosterText(pair.a);
    const b = rosterText(pair.b);
    return a !== "" && b !== "" && a !== b;
  });
}

/* ------------------------------------------------------------------ */
/* fallbacks by A3 criterion                                           */
/* ------------------------------------------------------------------ */

const LAB3: StructureTarget = { kind: "path", path: "/labs/lab3", name: "the Lab 3 page" };
const DASHBOARD: StructureTarget = { kind: "path", path: "/dashboard", name: "the Dashboard" };
const screen = (pattern: RegExp, name: string, example: string): StructureTarget => ({ kind: "screen", pattern, name, example });
const COURSE_HOME = screen(/^\/courses\/[^/]+\/home$/i, "the course Home screens", "/courses/RS101/home");
const COURSE_MODULES = screen(/^\/courses\/[^/]+\/modules$/i, "the Modules screens", "/courses/RS101/modules");
const COURSE_ASSIGNMENTS = screen(/^\/courses\/[^/]+\/assignments$/i, "the Assignments screens", "/courses/RS101/assignments");
const COURSE_PEOPLE = screen(/^\/courses\/[^/]+\/people\/table$/i, "the People screens", "/courses/RS101/people/table");

function fallback(entry: Omit<StructureFallback, "structureOnly" | "onMiss"> & { onMiss?: StructureFallback["onMiss"] }): StructureFallback {
  return { onMiss: "fail", ...entry, structureOnly: true };
}

export const A3_STRUCTURE_FALLBACKS: Readonly<Record<string, StructureFallback>> = {
  "a3-lab-page": fallback({
    looksFor: `the Lab 3 page with its sections (at least ${A3_MIN_LAB_HEADINGS} section headings)`,
    missMessage: `/labs/lab3 should show a titled section for each exercise in §3.2–§3.7 (we found fewer than ${A3_MIN_LAB_HEADINGS} section headings, or the starter page).`,
    target: LAB3,
    test: (html) => lab3HasSections(html),
  }),
  "a3-lab-json": fallback({
    looksFor: "an object pretty-printed in a <pre> (with a nested object and an array)",
    missMessage: "We couldn't find a <pre> on /labs/lab3 that pretty-prints an object with a nested object and an array (JSON.stringify(obj, null, 2)).",
    target: LAB3,
    test: (html) => lab3HasPrettyJson(html),
  }),
  "a3-lab-imports-table": fallback({
    looksFor: "a table with at least 4 rows of 3 cells",
    missMessage: "We couldn't find the import-styles table on /labs/lab3 (a table with at least 4 rows of 3 cells).",
    target: LAB3,
    test: (html) => lab3HasImportsTable(html),
  }),
  "a3-lab-styles": fallback({
    looksFor: "at least 3 boxes with an inline background color",
    missMessage: "We couldn't find at least 3 boxes on /labs/lab3 colored with inline style={{ backgroundColor: … }} objects.",
    target: LAB3,
    test: (html) => lab3InlineStyledBoxes(html) >= 3,
  }),
  "a3-lab-classes": fallback({
    looksFor: "at least 4 boxes styled by CSS classes",
    missMessage: "We couldn't find at least 4 boxes on /labs/lab3 styled with className (classes from a stylesheet, not inline styles).",
    target: LAB3,
    test: (html) => lab3ClassBoxes(html) >= 4,
  }),
  "a3-lab-client-server": fallback({
    looksFor: "the current pathname and a list of at least 3 server file names",
    missMessage: "/labs/lab3 should show the current pathname (/labs/lab3) from a Client Component and a list of at least 3 file names from a Server Component.",
    target: LAB3,
    test: (html) => lab3HasClientAndServer(html),
  }),
  "a3-lab-toc-highlight": fallback({
    looksFor: "the current lab's TOC link marked differently, moving between Lab 1 and Lab 3",
    missMessage: "On /labs/lab3 the Lab 3 TOC link should be marked differently from the others (style, class, or aria-current), and on /labs/lab1 the Lab 1 link should carry that marking instead.",
    target: LAB3,
    test: (html, ctx) => lab3TocHighlight(html, ctx),
  }),
  "a3-lab-path-params": fallback({
    looksFor: "two /labs/lab3/add/<a>/<b> links and a page that adds them",
    missMessage: "/labs/lab3 should link to at least two /labs/lab3/add/<a>/<b> URLs, and /labs/lab3/add/12/30 should show 42 (and /labs/lab3/add/7/8 show 15).",
    target: LAB3,
    test: (html, ctx) => lab3PathParameters(html, ctx),
  }),
  "a3-lab-todos": fallback({
    looksFor: "a list of at least 3 todo checkboxes, some checked and some not",
    missMessage: "We couldn't find the todo list on /labs/lab3 (a list of at least 3 checkboxes, at least one checked and one unchecked).",
    target: LAB3,
    test: (html) => lab3HasTodoList(html),
  }),
  "a3-kambaz-nav": fallback({
    looksFor: "one highlighted sidebar item: Dashboard on /dashboard, Courses inside a course",
    missMessage: "Only one Kambaz sidebar item should be highlighted: Dashboard on /dashboard, and Courses (not Dashboard too) on a course screen.",
    target: DASHBOARD,
    test: (html, ctx) => kambazNavHighlight(html, ctx),
  }),
  "a3-kambaz-dashboard": fallback({
    looksFor: `at least ${A3_MIN_DASHBOARD_COURSES} course cards linking to /courses/<id>/home`,
    missMessage: `The Dashboard should show at least ${A3_MIN_DASHBOARD_COURSES} course cards from courses.json, each linking to /courses/<course _id>/home.`,
    target: DASHBOARD,
    test: (html, ctx) => dashboardHasCourses(html, ctx),
  }),
  "a3-kambaz-courses": fallback({
    looksFor: "each card's course name in the heading of the course it opens",
    missMessage: "Opening two different Dashboard cards should show two different course names in the course heading, each matching its card.",
    target: COURSE_HOME,
    test: coursesFromUrl,
  }),
  "a3-kambaz-course-nav": fallback({
    looksFor: "course links that keep the course _id",
    missMessage: "Course Navigation on /courses/<_id>/home should link Home, Modules, Assignments, and People under that same /courses/<_id>/.",
    target: COURSE_HOME,
    test: courseNavigationKeepsId,
  }),
  "a3-kambaz-breadcrumb": fallback({
    looksFor: "a course heading that changes with the section",
    missMessage: "The course heading should show the current section and change between Home, Modules, and Assignments.",
    target: COURSE_HOME,
    test: breadcrumbTracksSection,
  }),
  "a3-kambaz-modules": fallback({
    looksFor: "module lists that differ by course",
    missMessage: "Two courses should show different module lists on /courses/<_id>/modules (only that course's modules from modules.json).",
    target: COURSE_MODULES,
    test: modulesDifferByCourse,
  }),
  "a3-kambaz-assignments": fallback({
    looksFor: "assignment lists that differ by course and link to the editor",
    missMessage: "Two courses should show different assignment lists on /courses/<_id>/assignments, each linking to /courses/<_id>/assignments/<assignment _id>.",
    target: COURSE_ASSIGNMENTS,
    test: assignmentsDifferByCourse,
  }),
  "a3-kambaz-editor": fallback({
    looksFor: "the clicked assignment's title in the editor's name field",
    missMessage: "The Assignment Editor's name field should show the title of the assignment you clicked (two assignments, two different titles).",
    // Read from the Assignments screens: the editor pages it opens are
    // looked up by the test, so an editor the crawl never reached is review.
    target: COURSE_ASSIGNMENTS,
    test: editorShowsClickedAssignment,
  }),
  "a3-kambaz-people": fallback({
    looksFor: "rosters that differ by course",
    missMessage: "Two courses should show different rosters on /courses/<_id>/people/table (only the users enrolled in that course).",
    target: COURSE_PEOPLE,
    test: peopleDifferByCourse,
  }),
};

/** Book samples link to the author's GitHub; that is not the student's repo. */
const SAMPLE_GITHUB_OWNERS = new Set(["jannunzi"]);

function isStudentRepoUrl(href: string): boolean {
  try {
    const url = new URL(href);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const [owner, repo] = url.pathname.split("/").filter(Boolean);
    return host === "github.com" && Boolean(owner && repo) && !SAMPLE_GITHUB_OWNERS.has(owner.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Delivery reads two ids as hints only: the GitHub link counts when it
 * points at a repository (not a book sample), the Kambaz link when it is a
 * real link. Everything else uses the A1 content rules.
 */
export function a3IdHasContent(id: string, element: IdElement): boolean {
  if (id.toLowerCase() === "wd-github") {
    const hrefs = element.tag === "a" ? [attr(element.open, "href")] : anchors(element.inner).map((anchor) => anchor.href);
    return hrefs.some(isStudentRepoUrl);
  }
  return a1IdHasContent(id, element);
}
