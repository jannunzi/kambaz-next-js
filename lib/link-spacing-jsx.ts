/**
 * Applies the JSX text-trimming rules (the same ones SWC uses) and reports
 * prose that will render glued to link text: a lowercase letter immediately
 * followed by an uppercase letter or a digit.
 */
import ts from "typescript";
import { decodeHtmlEntities, type LinkGlue } from "./link-spacing";

export type JsxLinkGlue = LinkGlue & {
  line: number;
};

/** Babel/SWC `cleanJSXElementLiteralChild`. */
export function cleanJsxText(value: string): string {
  const lines = value.split(/\r\n|\n|\r/);
  let lastNonEmptyLine = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/[^ \t]/.test(lines[i] ?? "")) lastNonEmptyLine = i;
  }

  let str = "";
  for (let i = 0; i < lines.length; i++) {
    const isFirstLine = i === 0;
    const isLastLine = i === lines.length - 1;
    const isLastNonEmptyLine = i === lastNonEmptyLine;
    let trimmed = (lines[i] ?? "").replace(/\t/g, " ");
    if (!isFirstLine) trimmed = trimmed.replace(/^[ ]+/, "");
    if (!isLastLine) trimmed = trimmed.replace(/[ ]+$/, "");
    if (trimmed) {
      if (!isLastNonEmptyLine) trimmed += " ";
      str += trimmed;
    }
  }
  return decodeHtmlEntities(str);
}

function isLinkTag(name: string): boolean {
  return name === "a" || name === "Link" || name.endsWith("Link");
}

function tagName(node: ts.Node): string | null {
  if (ts.isJsxElement(node)) return tagName(node.openingElement);
  if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
    const tag = node.tagName;
    if (ts.isIdentifier(tag)) return tag.text;
    return null;
  }
  return null;
}

function propValue(node: ts.JsxAttribute): string | number | null {
  const init = node.initializer;
  if (!init) return null;
  if (ts.isStringLiteral(init)) return init.text;
  if (ts.isJsxExpression(init) && init.expression) {
    const expr = init.expression;
    if (ts.isStringLiteral(expr)) return expr.text;
    if (ts.isNumericLiteral(expr)) return Number(expr.text);
    if (ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
  }
  return null;
}

function attr(
  node: ts.JsxOpeningLikeElement,
  name: string,
): ts.JsxAttribute | undefined {
  for (const prop of node.attributes.properties) {
    if (ts.isJsxAttribute(prop) && prop.name.getText() === name) return prop;
  }
  return undefined;
}

type KnownText = { known: true; text: string } | { known: false };

function textOfExpression(expr: ts.Expression): KnownText {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) {
    return { known: true, text: expr.text };
  }
  if (ts.isNumericLiteral(expr)) return { known: true, text: expr.text };
  if (ts.isJsxElement(expr) || ts.isJsxSelfClosingElement(expr) || ts.isJsxFragment(expr)) {
    return elementText(expr);
  }
  if (ts.isParenthesizedExpression(expr)) return textOfExpression(expr.expression);
  return { known: false };
}

function elementText(node: ts.Node): KnownText {
  if (ts.isJsxText(node)) return { known: true, text: cleanJsxText(node.getText()) };
  if (ts.isJsxExpression(node)) {
    if (!node.expression) return { known: true, text: "" };
    return textOfExpression(node.expression);
  }
  if (ts.isJsxSelfClosingElement(node)) {
    if (isLinkTag(tagName(node) ?? "")) return linkLabel(node);
    return { known: false };
  }
  if (ts.isJsxElement(node)) {
    if (isLinkTag(tagName(node) ?? "")) return linkLabel(node);
    return joinChildren(node.children);
  }
  if (ts.isJsxFragment(node)) return joinChildren(node.children);
  return { known: false };
}

function joinChildren(children: readonly ts.Node[]): KnownText {
  let text = "";
  for (const child of children) {
    const part = elementText(child);
    if (!part.known) return { known: false };
    text += part.text;
  }
  return { known: true, text };
}

function openingOf(node: ts.JsxElement | ts.JsxSelfClosingElement): ts.JsxOpeningLikeElement {
  return ts.isJsxElement(node) ? node.openingElement : node;
}

function linkLabel(node: ts.JsxElement | ts.JsxSelfClosingElement): KnownText {
  const name = tagName(node) ?? "";
  const nested = ts.isJsxElement(node) ? joinChildren(node.children) : { known: true, text: "" };
  const childrenProp = attr(openingOf(node), "children");
  let explicit: KnownText = nested;
  if (childrenProp) {
    const value = childrenProp.initializer;
    if (value && ts.isStringLiteral(value)) explicit = { known: true, text: value.text };
    else if (value && ts.isJsxExpression(value) && value.expression) {
      explicit = textOfExpression(value.expression);
    } else explicit = { known: false };
  }
  const meaningful =
    explicit.known && explicit.text.trim().length > 0 ? explicit : explicit.known ? null : explicit;
  if (meaningful && !meaningful.known) return meaningful;
  if (meaningful && meaningful.known) return meaningful;

  const to = attr(openingOf(node), "to");
  const toValue = to ? propValue(to) : null;
  if (name === "ChapterLink" && toValue != null) {
    return { known: true, text: `Chapter ${toValue}` };
  }
  if (name === "SectionLink" && toValue != null) {
    return { known: true, text: `§${String(toValue).replace(/^§/, "")}` };
  }
  if (name === "FigureLink" && toValue != null) {
    return { known: true, text: `Figure ${toValue}` };
  }
  if (name === "BookSectionSlidesLink") return { known: true, text: "Slides" };
  if (name === "BookSectionVideosLink") return { known: true, text: "Videos" };
  if (name === "BookSectionClipLink") return { known: true, text: "Clip" };
  return { known: true, text: "" };
}

const INLINE_TAGS = new Set([
  "a",
  "abbr",
  "b",
  "cite",
  "code",
  "em",
  "i",
  "mark",
  "q",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
]);

/** Text that can sit on the same line as a link, or a hard gap. */
function siblingEdge(node: ts.Node): KnownText | "gap" {
  if (ts.isJsxText(node) || ts.isJsxExpression(node)) return elementText(node);
  const name = tagName(node);
  if (!name || isLinkTag(name)) return "gap";
  if (INLINE_TAGS.has(name)) return elementText(node);
  return "gap";
}

function touches(left: string, right: string): boolean {
  if (!left || !right) return false;
  if (/\s$/.test(left) || /^\s/.test(right)) return false;
  const a = left.at(-1) ?? "";
  const b = right.at(0) ?? "";
  return /[a-z]/.test(a) && /[A-Z0-9]/.test(b);
}

function snippet(left: string, right: string): string {
  return `${left.slice(-24)}|${right.slice(0, 24)}`;
}

function lineOf(node: ts.Node, source: ts.SourceFile): number {
  return source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
}

/**
 * Significant JSX children. Newline-only text is dropped, matching the
 * compiler (it does not emit a space for that gap).
 */
function significantChildren(children: readonly ts.Node[]): ts.Node[] {
  return children.filter((child) => {
    if (!ts.isJsxText(child)) return true;
    return cleanJsxText(child.getText()).length > 0;
  });
}

function scanChildren(
  children: readonly ts.Node[],
  source: ts.SourceFile,
  hits: JsxLinkGlue[],
) {
  const kids = significantChildren(children);
  for (let i = 0; i < kids.length; i++) {
    const child = kids[i]!;
    if (!ts.isJsxElement(child) && !ts.isJsxSelfClosingElement(child)) continue;
    if (!isLinkTag(tagName(child) ?? "")) continue;

    const label = linkLabel(child);
    if (!label.known || !label.text.trim()) continue;

    const prev = kids[i - 1];
    if (prev) {
      const prevText = siblingEdge(prev);
      if (prevText !== "gap" && prevText.known && touches(prevText.text, label.text)) {
        hits.push({
          side: "before",
          snippet: snippet(prevText.text, label.text),
          line: lineOf(child, source),
        });
      }
    }

    const next = kids[i + 1];
    if (next) {
      const nextText = siblingEdge(next);
      if (nextText !== "gap" && nextText.known && touches(label.text, nextText.text)) {
        hits.push({
          side: "after",
          snippet: snippet(label.text, nextText.text),
          line: lineOf(child, source),
        });
      }
    }
  }
}

export function gluedJsxLinkBoundaries(filename: string, code: string): JsxLinkGlue[] {
  const source = ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const hits: JsxLinkGlue[] = [];

  function visit(node: ts.Node) {
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      scanChildren(node.children, source, hits);
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return hits;
}
