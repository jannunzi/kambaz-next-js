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
  return /^\/courses\/[^/]+\/(home|modules|assignments|people)(\/|$)/i.test(path);
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
