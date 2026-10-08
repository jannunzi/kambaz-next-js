/**
 * A small, tolerant CSS reader for the assignment checkers.
 *
 * It turns a compiled stylesheet (what Next.js serves from /_next/static)
 * into flat style rules: one selector list, its declarations, and the
 * at-rules around it (@media, @supports, @layer, …). Nesting (`&`, nested
 * @media) is flattened. Blocks that hold no element styles (@font-face,
 * @keyframes, @property, …) are skipped. It never throws: malformed input
 * just yields fewer rules.
 */

export type CssRule = {
  /** Selector list as written, e.g. ".a .b, p#c". */
  selector: string;
  /** Lower-case property name -> value (without !important). */
  decls: Map<string, string>;
  /** Enclosing at-rule preludes, outermost first, e.g. ["@layer utilities"]. */
  atRules: string[];
};

const SKIPPED_AT_RULES = new Set([
  "font-face",
  "keyframes",
  "-webkit-keyframes",
  "page",
  "property",
  "counter-style",
  "font-feature-values",
  "font-palette-values",
  "view-transition",
  "position-try",
]);

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/**
 * Index of the next `{`, `;` or `}` at depth 0 (outside strings, parens and
 * brackets), starting at `from`. Returns css.length when none.
 */
function nextDelimiter(css: string, from: number): number {
  let paren = 0;
  let bracket = 0;
  let quote: string | null = null;
  for (let i = from; i < css.length; i += 1) {
    const ch = css[i];
    if (ch === "\\") {
      i += 1;
      continue;
    }
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(") paren += 1;
    else if (ch === ")") paren = Math.max(0, paren - 1);
    else if (ch === "[") bracket += 1;
    else if (ch === "]") bracket = Math.max(0, bracket - 1);
    else if (paren === 0 && bracket === 0 && (ch === "{" || ch === ";" || ch === "}")) return i;
  }
  return css.length;
}

/** Index just past the `}` that closes the block opened at `open`. */
function skipBlock(css: string, open: number): number {
  let depth = 0;
  let i = open;
  while (i < css.length) {
    const at = nextDelimiter(css, i);
    if (at >= css.length) return css.length;
    if (css[at] === "{") depth += 1;
    else if (css[at] === "}") {
      depth -= 1;
      if (depth === 0) return at + 1;
    }
    i = at + 1;
  }
  return css.length;
}

/** Split on commas at depth 0 (outside parens, brackets and strings). */
export function splitTopLevel(text: string, separator = ","): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = 0;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "\\") {
      i += 1;
      continue;
    }
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(" || ch === "[") depth += 1;
    else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
    else if (ch === separator && depth === 0) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(text.slice(start));
  return parts.map((part) => part.trim()).filter(Boolean);
}

function atRuleName(prelude: string): string {
  return /^@([\w-]+)/.exec(prelude)?.[1]?.toLowerCase() ?? "";
}

/** Resolve a nested selector against its parent selector list. */
function nestSelector(parent: string, nested: string): string {
  if (!parent) return nested;
  const parents = splitTopLevel(parent);
  const out: string[] = [];
  for (const child of splitTopLevel(nested)) {
    for (const outer of parents) {
      out.push(child.includes("&") ? child.split("&").join(outer) : `${outer} ${child}`);
    }
  }
  return out.join(", ");
}

function addDeclaration(decls: Map<string, string>, text: string): void {
  const colon = text.indexOf(":");
  if (colon <= 0) return;
  const prop = text.slice(0, colon).trim().toLowerCase();
  if (!/^-?-?[a-z][\w-]*$/i.test(prop)) return;
  const value = text
    .slice(colon + 1)
    .replace(/!\s*important\s*$/i, "")
    .trim();
  decls.set(prop, value);
}

/**
 * Parse a block body (top level of a sheet, an at-rule body, or a style
 * rule body). `selector` is the enclosing style rule ("" at top level).
 */
function parseBody(
  css: string,
  start: number,
  end: number,
  selector: string,
  atRules: string[],
  out: CssRule[],
): void {
  const decls = new Map<string, string>();
  let i = start;
  while (i < end) {
    const at = Math.min(nextDelimiter(css, i), end);
    const prelude = css.slice(i, at).trim();
    if (at >= end) {
      if (selector && prelude) addDeclaration(decls, prelude);
      break;
    }
    const ch = css[at];
    if (ch === ";") {
      if (selector && prelude && !prelude.startsWith("@")) addDeclaration(decls, prelude);
      i = at + 1;
      continue;
    }
    if (ch === "}") {
      // Stray closer: stop this body.
      if (selector && prelude) addDeclaration(decls, prelude);
      break;
    }
    // ch === "{"
    const close = skipBlock(css, at);
    const bodyEnd = Math.max(at + 1, close - 1);
    if (prelude.startsWith("@")) {
      const name = atRuleName(prelude);
      if (!SKIPPED_AT_RULES.has(name)) {
        parseBody(css, at + 1, bodyEnd, selector, [...atRules, prelude.replace(/\s+/g, " ")], out);
      }
    } else if (prelude) {
      parseBody(css, at + 1, bodyEnd, nestSelector(selector, prelude), atRules, out);
    }
    i = close;
  }
  if (selector && decls.size > 0) {
    out.push({ selector: selector.replace(/\s+/g, " ").trim(), decls, atRules });
  }
}

/** Every style rule in a stylesheet, nesting flattened, in source order. */
export function parseCss(css: string): CssRule[] {
  const source = stripComments(css ?? "");
  const out: CssRule[] = [];
  parseBody(source, 0, source.length, "", [], out);
  return out;
}

/** Declarations of a `style="…"` attribute. */
export function parseInlineStyle(style: string): Map<string, string> {
  const decls = new Map<string, string>();
  for (const part of splitTopLevel(style ?? "", ";")) addDeclaration(decls, part);
  return decls;
}

/** True when the rule sits inside @media (directly or nested). */
export function ruleInMedia(rule: CssRule): boolean {
  return rule.atRules.some((at) => atRuleName(at) === "media");
}

/** True when the rule sits inside @layer (Tailwind utilities, base, …). */
export function ruleInLayer(rule: CssRule): boolean {
  return rule.atRules.some((at) => atRuleName(at) === "layer");
}
