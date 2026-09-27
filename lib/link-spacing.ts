/**
 * Missing spaces where prose meets an anchor.
 *
 * JSX drops a newline (and its indent) between a word and a tag, so
 * `from\\n<ChapterLink />` renders as "fromChapter". A space, a block
 * boundary, or a link sitting next to another link is not this bug.
 */

export type LinkGlue = {
  /** "before" — prose runs into the link; "after" — the link runs into prose. */
  side: "before" | "after";
  /** Short rendered snippet with the missing space marked by "|". */
  snippet: string;
};

const BLOCK_TAGS = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "br",
  "caption",
  "dd",
  "details",
  "div",
  "dl",
  "dt",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
]);

type Segment =
  | { kind: "text"; text: string }
  | { kind: "link"; text: string }
  | { kind: "break" };

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (match, body: string) => {
    if (body[0] === "#") {
      const code =
        body[1] === "x" || body[1] === "X"
          ? Number.parseInt(body.slice(2), 16)
          : Number.parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[body] ?? match;
  });
}

function visibleText(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, ""),
  );
}

type Token =
  | { type: "text"; value: string }
  | { type: "start"; name: string }
  | { type: "end"; name: string };

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  const re =
    /<!--[\s\S]*?-->|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)\b([^>]*?)(\/?)>|[^<]+/g;
  for (const match of html.matchAll(re)) {
    const raw = match[0];
    if (raw.startsWith("<!--")) continue;
    if (match[1]) {
      tokens.push({ type: "end", name: match[1].toLowerCase() });
      continue;
    }
    if (match[2]) {
      const name = match[2].toLowerCase();
      tokens.push({ type: "start", name });
      if (match[4] === "/" || name === "br" || name === "hr") {
        tokens.push({ type: "end", name });
      }
      continue;
    }
    tokens.push({ type: "text", value: decodeHtmlEntities(raw) });
  }
  return tokens;
}

function pushText(segments: Segment[], value: string) {
  if (!value) return;
  const last = segments[segments.length - 1];
  if (last?.kind === "text") last.text += value;
  else segments.push({ kind: "text", text: value });
}

/** Split rendered HTML into prose, anchors, and block breaks. */
export function linkSegments(html: string): Segment[] {
  const tokens = tokenize(html);
  const segments: Segment[] = [];
  const skipStack: string[] = [];
  let linkDepth = 0;
  let linkBuf = "";

  const pushBreak = () => {
    if (segments[segments.length - 1]?.kind !== "break") {
      segments.push({ kind: "break" });
    }
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    if (skipStack.length > 0) {
      if (token.type === "start" && (token.name === "script" || token.name === "style")) {
        skipStack.push(token.name);
      } else if (token.type === "end" && token.name === skipStack[skipStack.length - 1]) {
        skipStack.pop();
      }
      continue;
    }

    if (token.type === "start" && (token.name === "script" || token.name === "style")) {
      skipStack.push(token.name);
      continue;
    }

    if (linkDepth > 0) {
      if (token.type === "start" && token.name === "a") {
        linkDepth += 1;
        continue;
      }
      if (token.type === "end" && token.name === "a") {
        linkDepth -= 1;
        if (linkDepth === 0) {
          segments.push({ kind: "link", text: visibleText(linkBuf) });
          linkBuf = "";
        }
        continue;
      }
      if (token.type === "text") linkBuf += token.value;
      else if (token.type === "start" && BLOCK_TAGS.has(token.name)) linkBuf += " ";
      continue;
    }

    if (token.type === "start" && token.name === "a") {
      // Self-closing anchors are not produced by the tokenizer as a
      // separate shape; a following end tag closes them. Treat a start
      // whose raw tag ended in /> as empty — the tokenizer already
      // consumed it as a start, so an immediate end is the normal case.
      linkDepth = 1;
      linkBuf = "";
      continue;
    }

    if (token.type === "start" && BLOCK_TAGS.has(token.name)) {
      pushBreak();
      continue;
    }
    if (token.type === "end" && BLOCK_TAGS.has(token.name)) {
      pushBreak();
      continue;
    }
    if (token.type === "text") pushText(segments, token.value);
  }

  return segments;
}

function glueSnippet(left: string, right: string): string {
  const l = left.slice(-24);
  const r = right.slice(0, 24);
  return `${l}|${r}`;
}

/**
 * Lowercase letter immediately followed by an uppercase letter or digit
 * where prose touches link text. Link-to-link pairs are ignored.
 */
export function gluedLinkBoundaries(html: string): LinkGlue[] {
  const hits: LinkGlue[] = [];
  let prev: Segment | null = null;

  for (const segment of linkSegments(html)) {
    if (segment.kind === "break") {
      prev = null;
      continue;
    }
    if (!segment.text || /^\s*$/.test(segment.text)) {
      if (/\S/.test(segment.text) === false && segment.text.length > 0) {
        prev = null;
      }
      continue;
    }

    if (prev && prev.kind !== segment.kind) {
      const left = prev.text;
      const right = segment.text;
      const leftTouches = !/\s$/.test(left);
      const rightTouches = !/^\s/.test(right);
      const a = left.at(-1) ?? "";
      const b = right.at(0) ?? "";
      if (leftTouches && rightTouches && /[a-z]/.test(a) && /[A-Z0-9]/.test(b)) {
        hits.push({
          side: segment.kind === "link" ? "before" : "after",
          snippet: glueSnippet(left, right),
        });
      }
    }

    prev = segment;
  }

  return hits;
}
