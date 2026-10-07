/**
 * A1 structure fallbacks.
 *
 * wd-* ids are a staff convenience, never a requirement. Every A1 auto check
 * first looks for its ids (fast, precise). When they are missing, the check
 * falls back to the page structure the book asks for: a link to the expected
 * path, rows or links inside a list, headings, form controls by type, and so
 * on. Exact sample text is never required.
 *
 * Each fallback says what a miss means:
 *   - "fail": the structure is reliable, so its absence is a real miss.
 *   - "review": there is no reliable structural signal, so a miss becomes
 *     "Needs TA review" (not a fail, no points taken off).
 */
import {
  anchorHrefs,
  countTag,
  countTagContaining,
  externalAnchorUrls,
  formControlKinds,
  htmlHasAnchorPath,
  htmlHasAnchorPathMatching,
  htmlHasHeadingLevels,
  renderedMarkup,
  renderedText,
  tagInnerHtml,
} from "./html";

export type StructurePage = { path: string; html: string };

export type StructureContext = {
  /** Every successfully fetched /labs page, joined. */
  labsHtml: string;
  /** Every successfully fetched page, joined. */
  allHtml: string;
  /** Successfully fetched pages with their pathnames. */
  pages: readonly StructurePage[];
  /** Hostname of the student deploy. */
  siteHost?: string;
};

/** true = pass, false = the fallback's onMiss, "review" = Needs TA review. */
export type StructureTestResult = boolean | "review";

export type StructureFallback = {
  /** Short description of what the fallback looks for (staff-facing). */
  looksFor: string;
  test: (ctx: StructureContext) => StructureTestResult;
  /** A fail keeps the spec's own failMessage (the book's instruction). */
  onMiss: "fail" | "review";
};

function pagesMatching(ctx: StructureContext, pattern: RegExp): StructurePage[] {
  return ctx.pages.filter((page) => pattern.test(page.path));
}

function pageHtml(ctx: StructureContext, pattern: RegExp): string | null {
  const pages = pagesMatching(ctx, pattern);
  if (pages.length === 0) return null;
  return pages.map((page) => page.html).join("\n");
}

const COURSE_HOME = /^\/courses\/[^/]+\/home$/i;
const COURSE_MODULES = /^\/courses\/[^/]+\/modules$/i;
const COURSE_ASSIGNMENTS = /^\/courses\/[^/]+\/assignments$/i;
const COURSE_EDITOR = /^\/courses\/[^/]+\/assignments\/[^/]+$/i;

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
 * personal link: an anchor with a wd-your-* id, a GitHub profile (not the
 * book author's and not a repository), a LinkedIn profile, or a link to any
 * other site that is not one of the book's sample or course hosts.
 */
export function a1PersonalLinksFound(html: string, siteHost?: string): boolean {
  const markup = renderedMarkup(html);
  if (/<a\b[^>]*\bid\s*=\s*["']wd-your-[^"']+["'][^>]*\bhref\s*=/i.test(markup)) return true;
  if (/<a\b[^>]*\bhref\s*=[^>]*\bid\s*=\s*["']wd-your-[^"']+["']/i.test(markup)) return true;
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
    if (host.endsWith(".vercel.app")) continue;
    return true;
  }
  return false;
}

function hasDocsLink(html: string): boolean {
  return externalAnchorUrls(html).some(
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
  return externalAnchorUrls(html).some((url) => url.hostname.toLowerCase() !== own);
}

function headingContainsSpan(html: string): boolean {
  return [1, 2, 3, 4, 5, 6].some((level) =>
    tagInnerHtml(html, `h${level}`).some((inner) => /<span\b/i.test(inner)),
  );
}

function styledParagraph(html: string): boolean {
  return /<p\b[^>]*\bstyle\s*=\s*["'][^"']*(?:color|background)/i.test(renderedMarkup(html));
}

function styledBoxWithChildren(html: string): boolean {
  return /<div\b[^>]*\bstyle\s*=\s*["'][^"']*(?:color|background|border|padding)[^"']*["'][^>]*>\s*<(?!\/)/i.test(
      renderedMarkup(html),
    );
}

/**
 * Rows that belong to each table itself, not to tables nested inside it.
 * Many students lay out the Labs TOC with a one-row <table>; that must not
 * count as a data table.
 */
function tableOwnRowCounts(html: string): number[] {
  return tagInnerHtml(html, "table").map((inner) => {
    let own = inner;
    let previous = "";
    while (own !== previous) {
      previous = own;
      own = own.replace(/<table\b(?:(?!<table\b)[\s\S])*?<\/table\s*>/gi, "");
    }
    return own.match(/<tr\b/gi)?.length ?? 0;
  });
}

function dataTableCount(html: string, minRows: number): number {
  return tableOwnRowCounts(html).filter((rows) => rows >= minRows).length;
}

function quizTableExtended(html: string): boolean {
  const text = renderedText(html);
  if (/\bQ4\b/.test(text) && /\bQ10\b/.test(text)) return true;
  return dataTableCount(html, 11) > 0;
}

function assignmentLinksOnAssignmentsPage(ctx: StructureContext): StructureTestResult {
  const pages = pagesMatching(ctx, COURSE_ASSIGNMENTS);
  if (pages.length === 0) return "review";
  // Any link to an assignment under /assignments/<something>. The course
  // id in the href is not compared: a wrong id is a broken link for a TA to
  // note, not a missing Assignments list.
  return pages.some((page) =>
    anchorHrefs(page.html).some((href) => /\/assignments\/[^/?#\s]+/i.test(href)),
  );
}

/**
 * Fallbacks by A1 criterion id. A spec that reads wd-* ids and has no entry
 * here (paragraph On your own / With AI, HTML-tags list With AI) has no
 * reliable structural signal, so a missing id there is "Needs TA review".
 * Delivery rows (Labs navigation, GitHub link) are handled in the shared
 * runner via the checker config.
 */
export const A1_STRUCTURE_FALLBACKS: Readonly<Record<string, StructureFallback>> = {
  // 1.3.1 HeadingTags
  "a1-lab-heading-tags": {
    looksFor: "headings h1–h6",
    test: (ctx) => htmlHasHeadingLevels(renderedMarkup(ctx.labsHtml), [1, 2, 3, 4, 5, 6]).ok,
    onMiss: "fail",
  },
  "a1-lab-heading-tags-oyo": {
    looksFor: "a heading that contains a span",
    test: (ctx) => headingContainsSpan(ctx.labsHtml),
    onMiss: "review",
  },
  "a1-lab-heading-tags-ai": {
    looksFor: "a second h5/h6 (the sample outline after the practice headings)",
    test: (ctx) => countTag(ctx.labsHtml, "h6") >= 2,
    onMiss: "review",
  },
  // 1.3.2 ParagraphTag
  "a1-lab-paragraph": {
    looksFor: "paragraph elements",
    test: (ctx) => countTag(ctx.labsHtml, "p") >= 2,
    onMiss: "fail",
  },
  // 1.3.3 ListTags
  "a1-lab-lists": {
    looksFor: "an ordered list and an unordered list with items",
    test: (ctx) =>
      countTagContaining(ctx.labsHtml, "ol", "li") >= 1 &&
      countTagContaining(ctx.labsHtml, "ul", "li") >= 1,
    onMiss: "fail",
  },
  "a1-lab-lists-oyo": {
    looksFor: "a second ordered list with items",
    test: (ctx) => countTagContaining(ctx.labsHtml, "ol", "li") >= 2,
    onMiss: "review",
  },
  // 1.3.4 Tables
  "a1-lab-tables": {
    looksFor: "a data table with at least three rows",
    test: (ctx) => dataTableCount(ctx.labsHtml, 3) >= 1,
    onMiss: "fail",
  },
  "a1-lab-tables-oyo": {
    looksFor: "a second data table",
    test: (ctx) => dataTableCount(ctx.labsHtml, 2) >= 2,
    onMiss: "review",
  },
  "a1-lab-tables-ai": {
    looksFor: "quiz rows Q4–Q10 or a table with at least 11 rows",
    test: (ctx) => quizTableExtended(ctx.labsHtml),
    onMiss: "review",
  },
  // 1.3.5 Images
  "a1-lab-images": {
    looksFor: "images",
    test: (ctx) => countTag(ctx.labsHtml, "img") >= 1,
    onMiss: "fail",
  },
  "a1-lab-images-oyo": {
    looksFor: "a third image (after the two samples)",
    test: (ctx) => countTag(ctx.labsHtml, "img") >= 3,
    onMiss: "review",
  },
  "a1-lab-images-ai": {
    looksFor: "a fourth image",
    test: (ctx) => countTag(ctx.labsHtml, "img") >= 4,
    onMiss: "review",
  },
  // 1.3.6 Forms
  "a1-lab-forms": {
    looksFor: "at least three kinds of form controls (text, textarea, radio, select)",
    test: (ctx) => {
      const kinds = formControlKinds(ctx.labsHtml);
      return ["text", "textarea", "radio", "select"].filter((kind) =>
        kinds.has(kind as "text"),
      ).length >= 3;
    },
    onMiss: "fail",
  },
  "a1-lab-forms-oyo": {
    looksFor: "a form element",
    test: (ctx) => countTag(ctx.labsHtml, "form") >= 1,
    onMiss: "review",
  },
  // 1.3.7 / 1.3.8 Highlighted components
  "a1-lab-highlighted-paragraph": {
    looksFor: "a paragraph with an inline color or background style",
    test: (ctx) => styledParagraph(ctx.labsHtml),
    onMiss: "review",
  },
  "a1-lab-highlighted-box": {
    looksFor: "a styled box that wraps other elements",
    test: (ctx) => styledBoxWithChildren(ctx.labsHtml),
    onMiss: "review",
  },
  // 1.3.9 AnchorTag
  "a1-lab-anchor": {
    looksFor: "a link to another site",
    test: (ctx) => hasExternalLink(ctx.labsHtml, ctx.siteHost),
    onMiss: "fail",
  },
  "a1-lab-anchor-oyo": {
    looksFor: "a personal link (GitHub profile, LinkedIn, portfolio, …)",
    test: (ctx) => a1PersonalLinksFound(ctx.labsHtml, ctx.siteHost),
    onMiss: "fail",
  },
  "a1-lab-anchor-ai": {
    looksFor: "a link to documentation (MDN or similar)",
    test: (ctx) => hasDocsLink(ctx.labsHtml),
    onMiss: "review",
  },
  // 1.3.10 Labs navigation
  "a1-lab-labs-nav-oyo": {
    looksFor: "a link to /labs/lab4",
    test: (ctx) => htmlHasAnchorPath(renderedMarkup(ctx.labsHtml), "/labs/lab4", ctx.siteHost),
    onMiss: "fail",
  },
  // 1.3.11 Labs TOC
  "a1-lab-toc": {
    looksFor: "TOC links (to /labs, /labs/lab2, or /labs/lab3) on the Lab 1 page",
    test: (ctx) => {
      const lab1 = pageHtml(ctx, /^\/labs\/lab1$/i);
      if (lab1 == null) return false;
      const markup = renderedMarkup(lab1);
      return ["/labs", "/labs/lab2", "/labs/lab3"].some((path) =>
        htmlHasAnchorPath(markup, path, ctx.siteHost),
      );
    },
    onMiss: "fail",
  },
  "a1-lab-toc-ai": {
    // No id: a link to /book/ch1 (https://kambaz.dev/book/ch1 or relative).
    looksFor: "a link to the book (/book/ch1)",
    test: (ctx) =>
      htmlHasAnchorPathMatching(renderedMarkup(ctx.labsHtml), /^\/book\/ch1(\/|$)/i),
    onMiss: "fail",
  },
  // Kambaz screens
  "a1-kambaz-account": {
    looksFor: "a password field and a link or page for Sign up / Profile",
    test: (ctx) => {
      const account = pageHtml(ctx, /^\/account(\/|$)/i);
      if (account == null) return "review";
      if (!formControlKinds(account).has("password")) return false;
      return (
        htmlHasAnchorPathMatching(ctx.allHtml, /^\/account\/(signup|profile)$/i) ||
        pagesMatching(ctx, /^\/account\/(signup|profile)$/i).some(
          (page) => formControlKinds(page.html).size > 0,
        )
      );
    },
    onMiss: "fail",
  },
  "a1-kambaz-dashboard": {
    looksFor: "course links on /dashboard",
    test: (ctx) => {
      const dashboard = pageHtml(ctx, /^\/dashboard$/i);
      if (dashboard == null) return "review";
      return htmlHasAnchorPathMatching(dashboard, /^\/courses\/[^/]+(\/home)?$/i);
    },
    onMiss: "fail",
  },
  "a1-kambaz-nav": {
    looksFor: "Kambaz navigation links to /dashboard and /account",
    test: (ctx) =>
      htmlHasAnchorPathMatching(ctx.allHtml, /^\/dashboard$/i) &&
      htmlHasAnchorPathMatching(ctx.allHtml, /^\/account(\/|$)/i),
    onMiss: "fail",
  },
  "a1-kambaz-course-nav": {
    looksFor: "course navigation links (Home and Modules)",
    test: (ctx) =>
      htmlHasAnchorPathMatching(ctx.allHtml, /^\/courses\/[^/]+\/modules$/i) &&
      htmlHasAnchorPathMatching(ctx.allHtml, /^\/courses\/[^/]+\/(home|assignments|piazza)$/i),
    onMiss: "fail",
  },
  "a1-kambaz-modules": {
    looksFor: "a list with items on the Modules screen",
    test: (ctx) => {
      const modules = pageHtml(ctx, COURSE_MODULES);
      if (modules == null) return "review";
      return countTagContaining(modules, "ul", "li") >= 1;
    },
    onMiss: "review",
  },
  "a1-kambaz-home": {
    looksFor: "content (a list or buttons) on the course Home screen",
    test: (ctx) => {
      const home = pageHtml(ctx, COURSE_HOME);
      if (home == null) return "review";
      return countTagContaining(home, "ul", "li") >= 1 || countTag(home, "button") >= 1;
    },
    onMiss: "review",
  },
  "a1-kambaz-assignments": {
    looksFor: "assignment links (/assignments/:aid) on the Assignments screen",
    test: assignmentLinksOnAssignmentsPage,
    onMiss: "fail",
  },
  "a1-kambaz-editor": {
    looksFor: "form fields on the Assignment Editor screen",
    test: (ctx) => {
      const editor = pageHtml(ctx, COURSE_EDITOR);
      if (editor == null) return "review";
      const kinds = formControlKinds(editor);
      return kinds.has("text") && (kinds.has("textarea") || kinds.has("select"));
    },
    onMiss: "fail",
  },
};

/** Labs navigation (delivery): a link to any lab page from the Labs index. */
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
