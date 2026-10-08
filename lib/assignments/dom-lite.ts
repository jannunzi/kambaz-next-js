/**
 * A tiny HTML tree and CSS selector matcher for the assignment checkers.
 *
 * Built from server-rendered markup (scripts, styles and comments removed),
 * it is enough to answer "which elements on this page does this CSS rule
 * style?" — the question the A2 checker asks instead of looking for ids.
 * Selector support: type, `*`, `#id`, `.class`, attribute selectors
 * ([attr], [attr=value]), pseudo-classes and pseudo-elements (ignored, so
 * `.a:hover` styles `.a`), and the descendant, child (`>`), next-sibling
 * (`+`) and subsequent-sibling (`~`) combinators.
 */
import { renderedMarkup } from "./html";
import { parseInlineStyle, splitTopLevel } from "./css-rules";

export type DomNode = {
  tag: string;
  id: string;
  classes: string[];
  attrs: Map<string, string>;
  /** Parsed `style="…"` declarations. */
  style: Map<string, string>;
  parent: DomNode | null;
  children: DomNode[];
  /** Text directly inside this element (not in child elements). */
  text: string;
};

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
]);

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;|&#39;|&apos;/gi, "'");
}

function parseAttrs(source: string): Map<string, string> {
  const attrs = new Map<string, string>();
  const re = /([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source))) {
    attrs.set(match[1].toLowerCase(), decodeEntities(match[2] ?? match[3] ?? match[4] ?? ""));
  }
  return attrs;
}

function makeNode(tag: string, attrs: Map<string, string>, parent: DomNode | null): DomNode {
  return {
    tag,
    id: (attrs.get("id") ?? "").trim(),
    classes: (attrs.get("class") ?? "").split(/\s+/).filter(Boolean),
    attrs,
    style: parseInlineStyle(attrs.get("style") ?? ""),
    parent,
    children: [],
    text: "",
  };
}

/** Parse rendered markup into a tree under a synthetic `#root` node. */
export function parseDom(html: string): DomNode {
  const source = renderedMarkup(html ?? "");
  const root = makeNode("#root", new Map(), null);
  const stack: DomNode[] = [root];
  const re = /<(\/?)([a-zA-Z][\w:-]*)((?:\s+[^>]*?)?)\s*(\/?)>|([^<]+)|</g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source))) {
    const top = stack[stack.length - 1];
    if (match[5] !== undefined) {
      top.text += decodeEntities(match[5]);
      continue;
    }
    if (match[2] === undefined) continue;
    const tag = match[2].toLowerCase();
    if (match[1]) {
      // Closing tag: pop to the nearest open element with this name.
      for (let i = stack.length - 1; i > 0; i -= 1) {
        if (stack[i].tag === tag) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    if (tag === "!doctype") continue;
    const node = makeNode(tag, parseAttrs(match[3] ?? ""), top);
    top.children.push(node);
    if (!VOID_TAGS.has(tag) && !match[4]) stack.push(node);
  }
  return root;
}

/** Every element in document order (the synthetic root excluded). */
export function allElements(root: DomNode): DomNode[] {
  const out: DomNode[] = [];
  const walk = (node: DomNode) => {
    for (const child of node.children) {
      out.push(child);
      walk(child);
    }
  };
  walk(root);
  return out;
}

/** Elements rendered inside <body> (html, head and body themselves excluded). */
export function bodyElements(root: DomNode): DomNode[] {
  const body = allElements(root).find((node) => node.tag === "body");
  return body ? allElements(body) : allElements(root).filter((node) => !["html", "head", "body", "meta", "link", "title"].includes(node.tag) && !hasAncestor(node, "head"));
}

function hasAncestor(node: DomNode, tag: string): boolean {
  for (let p = node.parent; p; p = p.parent) if (p.tag === tag) return true;
  return false;
}

/** All visible text inside a node. */
export function textOf(node: DomNode): string {
  let text = node.text;
  for (const child of node.children) text += ` ${textOf(child)}`;
  return text.replace(/\s+/g, " ").trim();
}

/* ------------------------------------------------------------------ */
/* Selectors                                                           */
/* ------------------------------------------------------------------ */

type AttrTest = { name: string; op: string; value: string };

export type Compound = {
  tag: string | null;
  ids: string[];
  classes: string[];
  attrs: AttrTest[];
};

type Combinator = " " | ">" | "+" | "~";

export type ComplexSelector = {
  /** Left to right. */
  compounds: Compound[];
  /** combinators[i] joins compounds[i] and compounds[i + 1]. */
  combinators: Combinator[];
};

function unescapeIdent(text: string): string {
  return text.replace(/\\([0-9a-fA-F]{1,6})\s?|\\(.)/g, (_m, hex: string, ch: string) =>
    hex ? String.fromCodePoint(parseInt(hex, 16)) : ch,
  );
}

/** Read an identifier starting at i (escapes allowed). Returns [ident, next]. */
function readIdent(text: string, i: number): [string, number] {
  let j = i;
  while (j < text.length) {
    const ch = text[j];
    if (ch === "\\") {
      j += 2;
      continue;
    }
    if (/[\w\u00a0-\uffff-]/.test(ch)) {
      j += 1;
      continue;
    }
    break;
  }
  return [unescapeIdent(text.slice(i, j)), j];
}

/** Index just past the matching close of the paren/bracket at i. */
function skipGroup(text: string, i: number): number {
  const open = text[i];
  const close = open === "(" ? ")" : "]";
  let depth = 0;
  for (let j = i; j < text.length; j += 1) {
    if (text[j] === "\\") {
      j += 1;
      continue;
    }
    if (text[j] === open) depth += 1;
    else if (text[j] === close) {
      depth -= 1;
      if (depth === 0) return j + 1;
    }
  }
  return text.length;
}

/** Parse one complex selector (no commas). Null when it can't be read. */
export function parseSelector(selector: string): ComplexSelector | null {
  const text = selector.trim();
  const compounds: Compound[] = [];
  const combinators: Combinator[] = [];
  let current: Compound = { tag: null, ids: [], classes: [], attrs: [] };
  let touched = false;
  let pending: Combinator | null = null;
  const flush = () => {
    if (!touched) return;
    if (compounds.length > 0) combinators.push(pending ?? " ");
    compounds.push(current);
    current = { tag: null, ids: [], classes: [], attrs: [] };
    touched = false;
    pending = null;
  };
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      flush();
      i += 1;
      continue;
    }
    if (ch === ">" || ch === "+" || ch === "~") {
      flush();
      pending = ch;
      i += 1;
      continue;
    }
    if (ch === "#") {
      const [ident, next] = readIdent(text, i + 1);
      current.ids.push(ident);
      touched = true;
      i = next;
      continue;
    }
    if (ch === ".") {
      const [ident, next] = readIdent(text, i + 1);
      current.classes.push(ident);
      touched = true;
      i = next;
      continue;
    }
    if (ch === "[") {
      const end = skipGroup(text, i);
      const inner = text.slice(i + 1, end - 1);
      const m = /^\s*([\w-]+)\s*(?:([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\s\]]+))\s*[is]?)?\s*$/.exec(inner);
      if (m) current.attrs.push({ name: m[1].toLowerCase(), op: m[2] ?? "", value: m[3] ?? m[4] ?? m[5] ?? "" });
      touched = true;
      i = end;
      continue;
    }
    if (ch === ":") {
      // Pseudo-class or pseudo-element: ignored (the element is still styled).
      let j = i + 1;
      if (text[j] === ":") j += 1;
      const [, next] = readIdent(text, j);
      j = next;
      if (text[j] === "(") j = skipGroup(text, j);
      touched = true;
      i = j;
      continue;
    }
    if (ch === "*") {
      touched = true;
      i += 1;
      continue;
    }
    if (ch === "&") return null;
    if (/[\w-]/.test(ch) || ch === "\\") {
      const [ident, next] = readIdent(text, i);
      current.tag = ident.toLowerCase();
      touched = true;
      i = next;
      continue;
    }
    return null;
  }
  flush();
  return compounds.length > 0 ? { compounds, combinators } : null;
}

function attrMatches(node: DomNode, test: AttrTest): boolean {
  if (!node.attrs.has(test.name)) return false;
  if (!test.op) return true;
  const value = node.attrs.get(test.name) ?? "";
  switch (test.op) {
    case "=":
      return value === test.value;
    case "~=":
      return value.split(/\s+/).includes(test.value);
    case "^=":
      return value.startsWith(test.value);
    case "$=":
      return value.endsWith(test.value);
    case "*=":
      return value.includes(test.value);
    case "|=":
      return value === test.value || value.startsWith(`${test.value}-`);
    default:
      return true;
  }
}

export function compoundMatches(node: DomNode, compound: Compound): boolean {
  if (compound.tag && compound.tag !== node.tag) return false;
  for (const id of compound.ids) if (node.id !== id) return false;
  for (const cls of compound.classes) if (!node.classes.includes(cls)) return false;
  for (const attr of compound.attrs) if (!attrMatches(node, attr)) return false;
  return true;
}

function previousSiblings(node: DomNode): DomNode[] {
  if (!node.parent) return [];
  const siblings = node.parent.children;
  return siblings.slice(0, siblings.indexOf(node)).reverse();
}

function matchFrom(node: DomNode, selector: ComplexSelector, index: number): boolean {
  if (!compoundMatches(node, selector.compounds[index])) return false;
  if (index === 0) return true;
  const combinator = selector.combinators[index - 1];
  if (combinator === ">") {
    return Boolean(node.parent && node.parent.tag !== "#root" && matchFrom(node.parent, selector, index - 1));
  }
  if (combinator === " ") {
    for (let p = node.parent; p && p.tag !== "#root"; p = p.parent) {
      if (matchFrom(p, selector, index - 1)) return true;
    }
    return false;
  }
  const before = previousSiblings(node);
  if (combinator === "+") return Boolean(before[0] && matchFrom(before[0], selector, index - 1));
  return before.some((sibling) => matchFrom(sibling, selector, index - 1));
}

/** True when this complex selector matches the node. */
export function selectorMatches(node: DomNode, selector: ComplexSelector): boolean {
  return matchFrom(node, selector, selector.compounds.length - 1);
}

/** Parse a selector list; unreadable parts are dropped. */
export function parseSelectorList(list: string): ComplexSelector[] {
  return splitTopLevel(list)
    .map(parseSelector)
    .filter((entry): entry is ComplexSelector => entry !== null);
}
