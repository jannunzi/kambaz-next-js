const ESCAPE_RE = /[.*+?^${}()|[\]\\]/g;

export function escapeRegExp(value: string): string {
  return value.replace(ESCAPE_RE, "\\$&");
}

export function htmlHasId(html: string, id: string): boolean {
  const safe = escapeRegExp(id);
  return (
    new RegExp(`id=["']${safe}["']`, "i").test(html) ||
    new RegExp(`\\sid=${safe}(?:\\s|/|>)`, "i").test(html)
  );
}

export function htmlHasAllIds(
  html: string,
  ids: readonly string[],
): { ok: boolean; missing: string[] } {
  const missing = ids.filter((id) => !htmlHasId(html, id));
  return { ok: missing.length === 0, missing };
}

export function htmlHasAnyId(html: string, ids: readonly string[]): boolean {
  return ids.some((id) => htmlHasId(html, id));
}

export function htmlHasAllSnippets(
  html: string,
  snippets: readonly string[],
): { ok: boolean; missing: string[] } {
  const missing = snippets.filter((snippet) => !html.includes(snippet));
  return { ok: missing.length === 0, missing };
}

/** Pathname of an anchor href, ignoring origin, query, hash, and a trailing slash. */
export function anchorPathname(href: string): string | null {
  const trimmed = href.trim();
  if (
    !trimmed ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("javascript:")
  ) {
    return null;
  }
  try {
    const url = new URL(trimmed, "https://deploy.local");
    let path = url.pathname;
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    return path.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Host of an absolute or protocol-relative href. Relative hrefs have no host.
 */
export function anchorHrefHost(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed) return null;
  try {
    if (trimmed.startsWith("//")) {
      return new URL(`https:${trimmed}`).hostname.toLowerCase().replace(/\.$/, "");
    }
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
      return new URL(trimmed).hostname.toLowerCase().replace(/\.$/, "");
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * True when an <a href> points at path (relative or absolute, optional trailing slash).
 * When siteHost is set, only relative hrefs and absolute hrefs on that host count.
 */
export function htmlHasAnchorPath(
  html: string,
  path: string,
  siteHost?: string,
): boolean {
  const target = anchorPathname(path);
  if (!target) return false;
  const expected = siteHost?.trim().toLowerCase().replace(/\.$/, "") ?? "";
  const re = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    if (expected) {
      const host = anchorHrefHost(match[1]);
      if (host && host !== expected) continue;
    }
    if (anchorPathname(match[1]) === target) return true;
  }
  return false;
}

/** Whole tokens from class and className attributes. Not prose, not substrings. */
export function htmlClassTokens(html: string): string[] {
  const tokens: string[] = [];
  const re = /\b(?:className|class)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const value = match[1] ?? match[2] ?? "";
    for (const token of value.split(/\s+/)) {
      if (token) tokens.push(token);
    }
  }
  return tokens;
}

function elementInnerHtml(html: string, id: string): string[] {
  const safe = escapeRegExp(id);
  const openRe = new RegExp(
    `<([a-zA-Z][\\w:-]*)\\b([^>]*?)\\bid\\s*=\\s*["']${safe}["']([^>]*)>`,
    "gi",
  );
  const inners: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = openRe.exec(html))) {
    const tag = match[1];
    const full = match[0];
    if (/\/\s*>$/.test(full)) {
      inners.push("");
      continue;
    }
    const start = match.index + full.length;
    const tagRe = new RegExp(`<(/?)${escapeRegExp(tag)}\\b[^>]*>`, "gi");
    tagRe.lastIndex = start;
    let depth = 1;
    let closer: RegExpExecArray | null;
    let end = html.length;
    while ((closer = tagRe.exec(html))) {
      if (!closer[1] && /\/\s*>$/.test(closer[0])) continue;
      depth += closer[1] ? -1 : 1;
      if (depth === 0) {
        end = closer.index;
        break;
      }
    }
    inners.push(html.slice(start, end));
    openRe.lastIndex = end;
  }
  return inners;
}

/** True when any element with id contains a start tag for tagName. */
export function htmlIdContainsTag(html: string, id: string, tagName: string): boolean {
  const tagRe = new RegExp(`<${escapeRegExp(tagName)}\\b`, "i");
  return elementInnerHtml(html, id).some((inner) => tagRe.test(inner));
}

export function htmlHasTag(html: string, tag: string): boolean {
  return new RegExp(`<${escapeRegExp(tag)}\\b`, "i").test(html);
}

export function htmlHasHeadingLevels(
  html: string,
  levels: readonly number[],
): { ok: boolean; missing: number[] } {
  const missing = levels.filter((level) => !htmlHasTag(html, `h${level}`));
  return { ok: missing.length === 0, missing };
}

export function pathnameOf(url: string): string {
  try {
    const path = new URL(url).pathname;
    if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
    return path || "/";
  } catch {
    return "";
  }
}

export function extractInternalHrefs(html: string): string[] {
  const hrefs: string[] = [];
  const re = /href=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const href = match[1];
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("javascript:")
    ) {
      continue;
    }
    hrefs.push(href);
  }
  return hrefs;
}

export function extractCourseIds(html: string): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  const re = /\/courses\/([^/"'#?\s]+)(?:\/|$)/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const id = match[1];
    if (!id || seen.has(id.toLowerCase())) continue;
    seen.add(id.toLowerCase());
    ids.push(id);
  }
  return ids;
}

export function extractAssignmentIds(html: string, courseId: string): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  const re = new RegExp(
    `/courses/${escapeRegExp(courseId)}/assignments/([^/"'#?\\s]+)`,
    "gi",
  );
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const id = match[1];
    if (!id || id.toLowerCase() === "editor" || seen.has(id.toLowerCase())) {
      continue;
    }
    seen.add(id.toLowerCase());
    ids.push(id);
  }
  return ids;
}

export function isLabsPath(path: string): boolean {
  return path === "/labs" || path.startsWith("/labs/");
}

export function isCourseScreenPath(path: string): boolean {
  return /^\/courses\/[^/]+\/(home|modules|assignments)(\/|$)/i.test(path);
}

export function uniqueUrls(urls: readonly (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const raw of urls) {
    if (!raw) continue;
    let href = raw;
    try {
      href = new URL(raw).href;
    } catch {
      continue;
    }
    if (seen.has(href)) continue;
    seen.add(href);
    next.push(href);
  }
  return next;
}

/*
 * Structure helpers for checks that must not depend on wd-* ids.
 * They read rendered markup only: <script> (RSC payloads) and <style> blocks
 * are removed first so text inside them cannot count as page structure.
 */

/** Rendered markup without <script>, <style>, <template>, or HTML comments. */
export function renderedMarkup(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, "")
    .replace(/<template\b[\s\S]*?<\/template\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

/** Number of start tags for tagName in rendered markup. */
export function countTag(html: string, tagName: string): number {
  const re = new RegExp(`<${escapeRegExp(tagName)}\\b`, "gi");
  return renderedMarkup(html).match(re)?.length ?? 0;
}

/** Inner HTML of every element with this tag name (nesting-aware). */
export function tagInnerHtml(html: string, tagName: string): string[] {
  const source = renderedMarkup(html);
  const tag = escapeRegExp(tagName);
  const openRe = new RegExp(`<${tag}\\b[^>]*>`, "gi");
  const inners: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = openRe.exec(source))) {
    if (/\/\s*>$/.test(match[0])) {
      inners.push("");
      continue;
    }
    const start = match.index + match[0].length;
    const tagRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    tagRe.lastIndex = start;
    let depth = 1;
    let closer: RegExpExecArray | null;
    let end = source.length;
    while ((closer = tagRe.exec(source))) {
      if (!closer[1] && /\/\s*>$/.test(closer[0])) continue;
      depth += closer[1] ? -1 : 1;
      if (depth === 0) {
        end = closer.index;
        break;
      }
    }
    inners.push(source.slice(start, end));
  }
  return inners;
}

/** How many <outer> elements contain at least one <inner> start tag. */
export function countTagContaining(html: string, outer: string, inner: string): number {
  const innerRe = new RegExp(`<${escapeRegExp(inner)}\\b`, "i");
  return tagInnerHtml(html, outer).filter((body) => innerRe.test(body)).length;
}

/** Every <a href> value in rendered markup, in document order. */
export function anchorHrefs(html: string): string[] {
  const hrefs: string[] = [];
  const re = /<a\b[^>]*\bhref\s*=\s*["']([^"']*)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  const source = renderedMarkup(html);
  while ((match = re.exec(source))) hrefs.push(match[1]);
  return hrefs;
}

/** True when any <a href> pathname matches pattern (on siteHost when given). */
export function htmlHasAnchorPathMatching(
  html: string,
  pattern: RegExp,
  siteHost?: string,
): boolean {
  const expected = siteHost?.trim().toLowerCase().replace(/\.$/, "") ?? "";
  return anchorHrefs(html).some((href) => {
    if (expected) {
      const host = anchorHrefHost(href);
      if (host && host !== expected) return false;
    }
    const path = anchorPathname(href);
    return path != null && pattern.test(path);
  });
}

/** Absolute http(s) anchors as URL objects. */
export function externalAnchorUrls(html: string): URL[] {
  const urls: URL[] = [];
  for (const href of anchorHrefs(html)) {
    const trimmed = href.trim();
    if (!/^https?:\/\//i.test(trimmed)) continue;
    try {
      urls.push(new URL(trimmed));
    } catch {
      // ignore malformed hrefs
    }
  }
  return urls;
}

/** Form controls by kind in rendered markup. */
export function formControlKinds(html: string): Set<"text" | "textarea" | "radio" | "checkbox" | "select" | "password"> {
  const kinds = new Set<"text" | "textarea" | "radio" | "checkbox" | "select" | "password">();
  const source = renderedMarkup(html);
  if (/<textarea\b/i.test(source)) kinds.add("textarea");
  if (/<select\b/i.test(source)) kinds.add("select");
  const inputRe = /<input\b([^>]*)>/gi;
  let match: RegExpExecArray | null;
  while ((match = inputRe.exec(source))) {
    const type = /\btype\s*=\s*["']?([a-z-]+)/i.exec(match[1])?.[1]?.toLowerCase() ?? "text";
    if (type === "radio") kinds.add("radio");
    else if (type === "checkbox") kinds.add("checkbox");
    else if (type === "password") kinds.add("password");
    else if (["text", "email", "search", "tel", "url", "number"].includes(type)) kinds.add("text");
  }
  return kinds;
}

/** Visible text (tags removed, entities for spaces collapsed). */
export function renderedText(html: string): string {
  return renderedMarkup(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Remove every wd-* id attribute (and RSC payload ids) from HTML. Used to
 * prove a check grades structure rather than the book's ids.
 */
export function stripWdIds(html: string): string {
  return html
    .replace(/\s+id\s*=\s*(["'])wd-[^"']*\1/gi, "")
    .replace(/\s+id\s*=\s*wd-[^\s/>]+/gi, "")
    .replace(/\\?"id\\?"\s*:\s*\\?"wd-[^"\\]*\\?"/g, '"id":""');
}
