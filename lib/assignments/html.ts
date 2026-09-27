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

/** True when an <a href> points at path (relative or absolute, optional trailing slash). */
export function htmlHasAnchorPath(html: string, path: string): boolean {
  const target = anchorPathname(path);
  if (!target) return false;
  const re = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
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
