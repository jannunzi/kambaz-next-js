/**
 * A2 structure checks: grade what the CSS does on the page, never ids.
 *
 * Chapter 2's lab is about CSS, so the checker reads the compiled
 * stylesheets the student's deploy links from /labs/lab2 (and
 * /labs/lab2/tailwind) and asks which elements on the page those rules
 * style. Each book sample has a fingerprint made of CSS properties applied
 * to real elements (for example "two different border styles", "an
 * element with position: relative moved by top/left", "a flex container
 * with a growing child"). Ids, class names and text are never required:
 *
 *   - a site without any wd-* ids, or with every text changed, scores the
 *     same as the book build;
 *   - empty elements that only carry the book's ids earn nothing, because
 *     no CSS styles them;
 *   - the create-next-app template (and Tailwind utilities it happens to
 *     use) is never evidence: §2.1 samples count only handwritten rules
 *     (rules outside `@layer`, which is where Tailwind puts its utilities)
 *     or inline styles.
 *
 * Students build the samples their own way (inline styles, their own
 * classes, CSS grid or flex-basis instead of floats and percent widths), so
 * each fingerprint has a strong tier (the sample as the book builds it) and
 * a weak tier (the sample's core CSS is there, in a shape we can't tell
 * apart from other samples). Weak evidence is "Needs TA review" with points
 * kept, never a fail; only a sample with no evidence at all fails. A few
 * known alternate builds (a Float sample laid out with grid or flex, a Grid
 * layout sample sized with flex-basis percentages) are always TA review,
 * even when another sample's demo already claims those elements.
 *
 * One sample can't be confirmed without ids: the ID-selector sample (its
 * CSS rules target ids). When the CSS has id rules that no element carries,
 * the sample is "Needs TA review" (points kept), never a fail: we can't
 * tell a missing id from a missing sample.
 *
 * Feedback names the book sample and section, never an id or class.
 */
import {
  parseCss,
  ruleInLayer,
  ruleInMedia,
  type CssRule,
} from "./css-rules";
import {
  bodyElements,
  parseDom,
  parseSelectorList,
  selectorMatches,
  textOf,
  type ComplexSelector,
  type DomNode,
} from "./dom-lite";
import {
  anchorHrefHost,
  anchorPathname,
  externalAnchorUrls,
  renderedMarkup,
  renderedText,
} from "./html";

/* ------------------------------------------------------------------ */
/* Applied styles                                                      */
/* ------------------------------------------------------------------ */

export type AppliedDecl = {
  prop: string;
  value: string;
  /** How the element was selected. "tag" covers `p`, `*`, `:root`, … */
  via: "inline" | "id" | "class" | "tag";
  /** The selector has a combinator (descendant, child, sibling). */
  combinator: boolean;
  /** Inside @media. */
  media: boolean;
  /** Inside @layer (Tailwind utilities, base, components). */
  layer: boolean;
  /** Index of the rule in `StyledPage.rules` (-1 for inline styles). */
  rule: number;
};

export type StyledPage = {
  elements: DomNode[];
  applied: Map<DomNode, AppliedDecl[]>;
  /** Every parsed rule from the page's stylesheets and <style> blocks. */
  rules: CssRule[];
};

function selectorVia(selector: ComplexSelector): AppliedDecl["via"] {
  const subject = selector.compounds[selector.compounds.length - 1];
  if (subject.ids.length > 0) return "id";
  if (subject.classes.length > 0 || subject.attrs.length > 0) return "class";
  if (selector.compounds.some((compound) => compound.ids.length > 0)) return "id";
  if (selector.compounds.some((compound) => compound.classes.length > 0)) return "class";
  return "tag";
}

/** CSS inside <style> elements of the raw page HTML. */
export function inlineStyleBlocks(html: string): string[] {
  const blocks: string[] = [];
  const re = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html ?? ""))) blocks.push(match[1]);
  return blocks;
}

/** Same-origin stylesheet hrefs linked from a page, in order, unique. */
export function stylesheetHrefs(html: string): string[] {
  const hrefs: string[] = [];
  const markup = (html ?? "").replace(/<script\b[\s\S]*?<\/script\s*>/gi, "");
  const re = /<link\b[^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(markup))) {
    const tag = match[0];
    const rel = /\brel\s*=\s*["']?([^"'\s>]+)/i.exec(tag)?.[1]?.toLowerCase() ?? "";
    if (rel !== "stylesheet") continue;
    const href = /\bhref\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1]?.trim();
    if (!href || anchorHrefHost(href)) continue;
    if (!hrefs.includes(href)) hrefs.push(href);
  }
  return hrefs;
}

const MEDIA_TAGS = new Set(["img", "svg", "video", "canvas", "iframe", "input", "picture"]);

/**
 * A box you can see without text: CSS (not a bare tag rule) gives it a
 * width, a height, and a background or border. Tailwind samples are often
 * such colored squares.
 */
function isVisibleBox(decls: readonly AppliedDecl[]): boolean {
  const own = decls.filter((decl) => decl.via !== "tag");
  const set = (props: RegExp) => own.some((decl) => props.test(decl.prop) && !/^(0|0px|auto|none|transparent)$/i.test(decl.value.trim()));
  return set(/^(width|min-width)$/) && set(/^(height|min-height)$/) && set(/^(background|background-color|border(-[a-z]+)*)$/);
}

/**
 * An element with something to show: text, an image or icon, a visible box,
 * or such an element inside it. Empty, unstyled elements never count,
 * whatever ids or classes they carry.
 */
function hasContent(node: DomNode, applied: Map<DomNode, AppliedDecl[]>, memo: Map<DomNode, boolean>): boolean {
  const known = memo.get(node);
  if (known !== undefined) return known;
  const result =
    MEDIA_TAGS.has(node.tag) ||
    Boolean(node.text.trim()) ||
    isVisibleBox(applied.get(node) ?? []) ||
    node.children.some((child) => hasContent(child, applied, memo));
  memo.set(node, result);
  return result;
}

/** Which styles reach which elements on a page. */
export function stylePage(html: string, sheets: readonly string[]): StyledPage {
  const root = parseDom(html);
  const all = bodyElements(root);
  const elements = all;
  const rules = [...sheets, ...inlineStyleBlocks(html)].flatMap((css) => parseCss(css));
  const applied = new Map<DomNode, AppliedDecl[]>();
  const push = (node: DomNode, decl: AppliedDecl) => {
    const list = applied.get(node);
    if (list) list.push(decl);
    else applied.set(node, [decl]);
  };
  for (const node of elements) {
    for (const [prop, value] of node.style) {
      push(node, { prop, value, via: "inline", combinator: false, media: false, layer: false, rule: -1 });
    }
  }
  for (const [index, rule] of rules.entries()) {
    const media = ruleInMedia(rule);
    const layer = ruleInLayer(rule);
    for (const selector of parseSelectorList(rule.selector)) {
      const via = selectorVia(selector);
      const combinator = selector.compounds.length > 1;
      for (const node of elements) {
        if (!selectorMatches(node, selector)) continue;
        for (const [prop, value] of rule.decls) {
          push(node, { prop, value, via, combinator, media, layer, rule: index });
        }
      }
    }
  }
  const memo = new Map<DomNode, boolean>();
  const shown = all.filter((node) => hasContent(node, applied, memo));
  for (const node of all) if (!memo.get(node)) applied.delete(node);
  return { elements: shown, applied, rules };
}

type DeclFilter = (decl: AppliedDecl) => boolean;

/** Handwritten CSS (not Tailwind's layers, not bare tag rules) or inline styles. */
const authored: DeclFilter = (decl) => !decl.layer && decl.via !== "tag";
/** Authored and outside @media (a sample's base styles). */
const authoredBase: DeclFilter = (decl) => authored(decl) && !decl.media;
/** Any CSS that reaches the element, Tailwind layers included. */
const anyCss: DeclFilter = () => true;

function declsOf(page: StyledPage, node: DomNode, filter: DeclFilter): AppliedDecl[] {
  return (page.applied.get(node) ?? []).filter(filter);
}

function propValues(page: StyledPage, node: DomNode, filter: DeclFilter, props: readonly string[] | RegExp): string[] {
  return declsOf(page, node, filter)
    .filter((decl) => (Array.isArray(props) ? props.includes(decl.prop) : (props as RegExp).test(decl.prop)))
    .map((decl) => decl.value.trim().toLowerCase());
}

function hasProp(page: StyledPage, node: DomNode, filter: DeclFilter, props: readonly string[] | RegExp): boolean {
  return propValues(page, node, filter, props).length > 0;
}

function normalizeValue(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

/* ------------------------------------------------------------------ */
/* §2.1 fingerprints                                                   */
/* ------------------------------------------------------------------ */

/**
 * Each book sample collects evidence from the page in two tiers:
 *   - strong: elements that show the sample as the book builds it (for
 *     example two different border styles). Any strong evidence passes.
 *   - weak: elements with the sample's core CSS in a shape we can't tell
 *     apart from other samples (a student's own variant). Weak evidence is
 *     "Needs TA review" with points kept, never a fail.
 * Weak evidence that sits only on elements another sample already uses as
 * its strong evidence doesn't count (the margin demo's borders are not a
 * borders sample). A sample with no evidence left is missing and fails.
 *
 * "Own" CSS is what the student wrote: rules outside @layer (Tailwind puts
 * its utilities in layers) that select by class or id, and inline styles.
 * Bare tag rules (`h2 { … }`) never count.
 */

const BORDER_STYLES = ["solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"];
const BORDER_PROPS = /^border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-(style|width|color))?$/;
const RADIUS = /^border(-[a-z]+)*-radius$/;
const SIDE_MARGIN = /^margin-(top|right|bottom|left|inline|block)(-(start|end))?$/;
const OFFSETS = ["top", "right", "bottom", "left", "inset"];
const TEXT_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "a", "em", "strong", "li", "label"]);
const BOX_PROPS = /^(display|width|height|min-|max-|padding|margin|border|position|float|top|right|bottom|left)/;
const COLOR_PROPS = ["color", "background-color", "background"];
const isBackground = (prop: string) => prop === "background-color" || prop === "background";

function isZero(value: string): boolean {
  return value.split(/\s+/).every((part) => /^-?0(\.0+)?([a-z%]+)?$/i.test(part));
}

function borderStyles(page: StyledPage, node: DomNode): Set<string> {
  const styles = new Set<string>();
  for (const value of propValues(page, node, authored, BORDER_PROPS)) {
    for (const token of value.split(/\s+/)) if (BORDER_STYLES.includes(token)) styles.add(token);
  }
  return styles;
}

const hasBorder = (page: StyledPage, node: DomNode) => borderStyles(page, node).size > 0;

/** A non-zero value for any of these props (own CSS). */
function hasNonZero(page: StyledPage, node: DomNode, props: readonly string[] | RegExp): boolean {
  return propValues(page, node, authored, props).some((value) => !isZero(value));
}

const hasBackground = (page: StyledPage, node: DomNode) =>
  hasProp(page, node, authored, ["background-color", "background"]);

function position(page: StyledPage, node: DomNode, filter: DeclFilter = authored): string | null {
  const values = propValues(page, node, filter, ["position"]);
  return values.length ? values[values.length - 1] : null;
}

const hasOffset = (page: StyledPage, node: DomNode) => hasProp(page, node, authored, OFFSETS);

/** Elements a sample's fingerprint found. */
export type Evidence = {
  strong: DomNode[];
  weak: DomNode[];
  /**
   * Containers whose whole demo belongs to this sample (the flex row, the
   * box-model parent, the positioned box holding absolute children). Weak
   * evidence for other samples inside them doesn't count.
   */
  scope?: DomNode[];
  /** Elements inside `scope` that stay visible to other samples. */
  scopeKeeps?: (node: DomNode) => boolean;
  /** ID selectors only: id rules exist but no element carries those ids. */
  idReview?: boolean;
  /**
   * The sample built another known way (a Float sample laid out with grid,
   * Grid layout columns sized with flex-basis). Always "Needs TA review",
   * even when another sample's demo already uses these elements.
   */
  alternate?: DomNode[];
};

/** The result of one book sample's fingerprint. */
export type SampleState = "found" | "weak" | "missing" | "review";

export type SampleCheck = {
  /** Student-facing sample name with its book section, e.g. "Borders (§2.1.9)". */
  name: string;
  evidence: (page: StyledPage) => Evidence;
  /**
   * A demo sample (a box or layout you build once): its strong evidence
   * and scope hide other samples' weak evidence. Cross-cutting samples
   * (selectors, colors, media queries, Tailwind) style
   * elements all over the page, so they never hide anything.
   */
  demo?: boolean;
};

const where = (page: StyledPage, test: (node: DomNode) => boolean) => page.elements.filter(test);
const unique = <T,>(items: Iterable<T>): T[] => [...new Set(items)];
const parents = (nodes: DomNode[]) => unique(nodes.flatMap((node) => (node.parent ? [node.parent] : [])));

/**
 * Elements whose source (one rule, or the element's style attribute) sets
 * the text color but no background ("color"), or the background but no
 * text color ("background"), keyed by value. `tags` limits it to those
 * elements, which must then have no box styling of their own.
 */
function singlePropValues(
  page: StyledPage,
  kind: "color" | "background",
  tags: ReadonlySet<string> | null,
): Map<string, DomNode[]> {
  const byValue = new Map<string, DomNode[]>();
  const wantedProp = (prop: string) => (kind === "color" ? prop === "color" : isBackground(prop));
  const otherProp = (prop: string) => (kind === "color" ? isBackground(prop) : prop === "color");
  for (const node of page.elements) {
    if (tags && !tags.has(node.tag)) continue;
    const decls = declsOf(page, node, (decl) => authoredBase(decl) && !decl.combinator);
    if (tags && decls.some((decl) => BOX_PROPS.test(decl.prop))) continue;
    // A text-color sample has no background of its own (that is the
    // background sample), and a value set by several competing rules is a
    // cascade experiment, not a color sample.
    if (kind === "color" && declsOf(page, node, authored).some((decl) => otherProp(decl.prop))) continue;
    if (new Set(decls.filter((decl) => wantedProp(decl.prop)).map((decl) => decl.rule)).size > 1) continue;
    for (const decl of decls) {
      const wanted = kind === "color" ? decl.prop === "color" : isBackground(decl.prop);
      if (!wanted) continue;
      const other = decls.some(
        (o) => o.rule === decl.rule && (kind === "color" ? isBackground(o.prop) : o.prop === "color"),
      );
      if (other) continue;
      const value = normalizeValue(decl.value);
      byValue.set(value, [...(byValue.get(value) ?? []), node]);
    }
  }
  return byValue;
}

/** Authored id rules (outside @layer) that style nothing on the page. */
function hasUnmatchedIdRule(page: StyledPage): boolean {
  const matched = new Set<number>();
  for (const decls of page.applied.values()) for (const decl of decls) if (decl.via === "id") matched.add(decl.rule);
  return page.rules.some(
    (rule, index) =>
      !ruleInLayer(rule) &&
      !matched.has(index) &&
      parseSelectorList(rule.selector).some((selector) => selectorVia(selector) === "id"),
  );
}

/**
 * Elements an id rule styles on its own: no class or inline style on the
 * element sets the same property (that is the cascade experiment, where an
 * id rule and a class rule compete).
 */
function idStyled(page: StyledPage, node: DomNode): boolean {
  const decls = declsOf(page, node, (decl) => authored(decl) && !decl.media);
  const byId = decls.filter((decl) => decl.via === "id" && !decl.combinator);
  return byId.some((decl) => !decls.some((other) => other.via !== "id" && other.prop === decl.prop));
}

export const A2_SELECTOR_SAMPLES: SampleCheck[] = [
  {
    name: "ID selectors (§2.1.3)",
    // Strong: an element styled by its own id rule (not a cascade
    // experiment where a class rule sets the same property).
    evidence: (page) => ({
      strong: where(page, (node) => idStyled(page, node)),
      weak: [],
      // The CSS has id rules that nothing on the page carries: the ids are
      // missing or the sample is. A missing id is never a deduction, so a TA
      // confirms this one by hand.
      idReview: hasUnmatchedIdRule(page),
    }),
  },
  {
    name: "Class selectors (§2.1.4)",
    // Strong: one class rule that sets both text and background color,
    // used on two different kinds of element (a paragraph and a heading).
    evidence: (page) => {
      const byRule = new Map<number, DomNode[]>();
      const colored: DomNode[] = [];
      for (const node of page.elements) {
        const decls = declsOf(page, node, (decl) => authoredBase(decl) && decl.via === "class" && !decl.combinator);
        if (decls.some((decl) => COLOR_PROPS.includes(decl.prop))) colored.push(node);
        for (const decl of decls) {
          if (decl.prop !== "color") continue;
          if (!decls.some((other) => other.rule === decl.rule && isBackground(other.prop))) continue;
          byRule.set(decl.rule, [...(byRule.get(decl.rule) ?? []), node]);
        }
      }
      const strong = [...byRule.values()].filter((nodes) => new Set(nodes.map((node) => node.tag)).size >= 2).flat();
      return { strong: unique(strong), weak: colored };
    },
  },
  {
    name: "Document structure selectors (§2.1.5)",
    // Strong: a descendant or child selector that colors an element.
    evidence: (page) => {
      const combined = (node: DomNode) => declsOf(page, node, (decl) => authoredBase(decl) && decl.combinator);
      return {
        strong: where(page, (node) => combined(node).some((decl) => COLOR_PROPS.includes(decl.prop))),
        weak: where(page, (node) => combined(node).length > 0),
      };
    },
  },
];

export const A2_BOX_MODEL_SAMPLES: SampleCheck[] = [
  {
    name: "Foreground colors (§2.1.7)",
    // Strong: three different text colors on elements with no background of
    // their own (text on a colored background is the background sample).
    // Weak: one or two such colors.
    evidence: (page) => {
      const values = singlePropValues(page, "color", null);
      const colored = unique([...values.values()].flat());
      return { strong: values.size >= 3 ? colored : [], weak: colored };
    },
  },
  {
    name: "Background colors (§2.1.8)",
    // Strong: text (headings, paragraphs, spans) on two different
    // backgrounds, each set by one rule without a text color and without
    // box styling. Weak: one such background. Colored boxes (padding,
    // borders, sizes) belong to the box samples, and a background set by
    // competing rules is the cascade experiment.
    evidence: (page) => {
      const values = singlePropValues(page, "background", TEXT_TAGS);
      const shaded = unique([...values.values()].flat());
      return { strong: values.size >= 2 ? shaded : [], weak: shaded };
    },
  },
  {
    name: "Borders (§2.1.9)",
    demo: true,
    // Strong: two different border styles (solid and dashed in the book).
    // The evidence is the plain bordered boxes (no padding, margin,
    // corners or size of their own), which belong to no other sample.
    evidence: (page) => {
      const bordered = where(page, (node) => hasBorder(page, node));
      const styles = new Set(bordered.flatMap((node) => [...borderStyles(page, node)]));
      const plain = bordered.filter(
        (node) =>
          !hasNonZero(page, node, /^(padding|margin)/) &&
          !hasNonZero(page, node, RADIUS) &&
          !hasProp(page, node, authored, ["width", "height"]),
      );
      return { strong: styles.size >= 2 ? (plain.length ? plain : bordered) : [], weak: bordered };
    },
  },
  {
    name: "Padding (§2.1.10)",
    demo: true,
    // Strong: a bordered box with padding, no margin, no rounded corners
    // and no fixed width (those are the margin, corner and box-sizing
    // samples).
    evidence: (page) => ({
      strong: where(
        page,
        (node) =>
          hasNonZero(page, node, /^padding/) &&
          hasBorder(page, node) &&
          !hasNonZero(page, node, /^margin/) &&
          !hasNonZero(page, node, RADIUS) &&
          !hasProp(page, node, authored, ["width"]),
      ),
      weak: where(page, (node) => hasNonZero(page, node, /^padding/)),
    }),
  },
  {
    name: "Margins (§2.1.10)",
    demo: true,
    // Strong: a bordered box without a fixed size and with a margin on
    // chosen sides, or a margin all around and no padding (the box-model
    // sample has margin, border and padding together).
    evidence: (page) => ({
      strong: where(
        page,
        (node) =>
          hasBorder(page, node) &&
          !hasProp(page, node, authored, ["width", "height"]) &&
          (hasNonZero(page, node, SIDE_MARGIN) ||
            (hasNonZero(page, node, ["margin"]) && !hasNonZero(page, node, /^padding/))),
      ),
      weak: where(page, (node) => hasNonZero(page, node, /^margin/)),
    }),
  },
  {
    name: "Box model (§2.1.10)",
    demo: true,
    // Strong: box-sizing, or one box with margin, border, padding and a
    // background inside a colored parent. Weak: margin, border and padding
    // on one box.
    evidence: (page) => {
      const fullBox = (node: DomNode) =>
        hasNonZero(page, node, /^margin/) && hasNonZero(page, node, /^padding/) && hasBorder(page, node);
      const evidence: Evidence = {
        strong: where(
          page,
          (node) =>
            hasProp(page, node, authored, ["box-sizing"]) ||
            (fullBox(node) && hasBackground(page, node) && node.parent !== null && hasBackground(page, node.parent)),
        ),
        weak: where(page, fullBox),
      };
      return { ...evidence, scope: parents(evidence.strong) };
    },
  },
  {
    name: "Rounded corners (§2.1.11)",
    demo: true,
    evidence: (page) => {
      const rounded = where(page, (node) => hasNonZero(page, node, RADIUS));
      return { strong: rounded.length >= 2 ? rounded : [], weak: rounded };
    },
  },
  {
    name: "Dimensions (§2.1.12)",
    demo: true,
    // Strong: sibling boxes with their own width and height, not
    // positioned or floated, in a plain (unstyled) parent.
    evidence: (page) => {
      const sized = (node: DomNode) =>
        hasProp(page, node, authored, ["width"]) && hasProp(page, node, authored, ["height"]);
      const strong: DomNode[] = [];
      for (const parent of page.elements) {
        if (hasBackground(page, parent) || position(page, parent)) continue;
        const kids = parent.children.filter(
          (node) => sized(node) && !position(page, node) && !hasProp(page, node, authored, ["float", "display"]),
        );
        if (kids.length >= 2) strong.push(...kids);
      }
      return { strong, weak: where(page, sized), scope: parents(strong) };
    },
  },
  {
    name: "Display (§2.1.12)",
    demo: true,
    // Strong: two of inline, inline-block and block.
    evidence: (page) => {
      const boxy = (node: DomNode) =>
        propValues(page, node, authoredBase, ["display"]).filter((value) => ["inline", "inline-block", "block"].includes(value));
      const shown = where(page, (node) => boxy(node).length > 0);
      const values = new Set(shown.flatMap(boxy));
      return {
        strong: values.size >= 2 ? shown : [],
        weak: where(page, (node) => hasProp(page, node, authoredBase, ["display"])),
      };
    },
  },
];

const PICTURE_TAGS = new Set(["img", "picture", "svg", "video"]);

/** A picture, or a wrapper that only holds one. */
function isPicture(node: DomNode): boolean {
  if (PICTURE_TAGS.has(node.tag)) return true;
  return !node.text.trim() && node.children.length === 1 && isPicture(node.children[0]);
}

/**
 * Grid or flex containers (own CSS) that put a picture next to text: the
 * Float sample's "text wraps beside an image" built without float.
 */
function pictureBesideText(page: StyledPage): DomNode[] {
  const out: DomNode[] = [];
  for (const parent of page.elements) {
    const display = propValues(page, parent, authored, ["display"]);
    if (!display.some((value) => /grid|flex/.test(value))) continue;
    if (propValues(page, parent, authored, ["flex-direction"]).some((value) => value.startsWith("column"))) continue;
    const pictures = parent.children.filter(isPicture);
    const texts = parent.children.filter((node) => !isPicture(node) && textOf(node).length > 0);
    if (pictures.length > 0 && texts.length > 0) out.push(parent, ...pictures, ...texts);
  }
  return out;
}

/** flex-basis (or the flex shorthand's basis) set to a percentage. */
function flexBasisPercent(page: StyledPage, node: DomNode): boolean {
  if (propValues(page, node, authored, ["flex-basis"]).some((value) => /%$/.test(value))) return true;
  return propValues(page, node, authored, ["flex"]).some((value) => /(^|\s)\d+(\.\d+)?%$/.test(value));
}

export const A2_LAYOUT_SAMPLES: SampleCheck[] = [
  {
    name: "Relative position (§2.1.13)",
    demo: true,
    // Strong: position: relative moved by top/left/bottom/right.
    // The scope is the row of boxes the moved box sits in.
    evidence: (page) => {
      const strong = where(page, (node) => position(page, node) === "relative" && hasOffset(page, node));
      return {
        strong,
        weak: where(page, (node) => position(page, node) === "relative"),
        scope: parents(strong),
        // An absolute box in the same container is its own sample.
        scopeKeeps: (node) => ["absolute", "fixed"].includes(position(page, node) ?? ""),
      };
    },
  },
  {
    name: "Absolute position (§2.1.14)",
    demo: true,
    // Strong: a positioned container with two sized, absolutely
    // positioned boxes and no z-index (the z-index sample is the same
    // layout plus z-index).
    evidence: (page) => {
      const strong: DomNode[] = [];
      for (const parent of page.elements) {
        const own = position(page, parent);
        if (!own || own === "static") continue;
        const placed = parent.children.filter(
          (node) =>
            position(page, node) === "absolute" &&
            hasOffset(page, node) &&
            hasProp(page, node, authored, ["width", "height"]),
        );
        if (placed.length >= 2 && !parent.children.some((node) => hasProp(page, node, authored, ["z-index"]))) {
          strong.push(...placed);
        }
      }
      return { strong, weak: where(page, (node) => position(page, node) === "absolute"), scope: parents(strong) };
    },
  },
  {
    name: "Fixed position (§2.1.15)",
    demo: true,
    evidence: (page) => ({
      strong: where(page, (node) => position(page, node) === "fixed"),
      weak: where(page, (node) => position(page, node, anyCss) === "fixed"),
    }),
  },
  {
    name: "Z-index (§2.1.16)",
    demo: true,
    // The scope is the stack of absolute boxes the z-index element sits in.
    evidence: (page) => {
      const strong = where(page, (node) => hasProp(page, node, authored, ["z-index"]) && position(page, node) !== null);
      const stacks = parents(strong.filter((node) => position(page, node) === "absolute")).filter(
        (parent) => parent.children.filter((node) => position(page, node) === "absolute").length >= 2,
      );
      return { strong, weak: where(page, (node) => hasProp(page, node, anyCss, ["z-index"])), scope: stacks };
    },
  },
  {
    name: "Float (§2.1.17)",
    demo: true,
    // Strong: floats to both sides, or a floated image. Alternate: a
    // picture with text beside it laid out with grid or flex instead of
    // float (TA review, points kept).
    evidence: (page) => {
      const side = (node: DomNode) =>
        propValues(page, node, authored, ["float"]).filter((value) => value === "left" || value === "right");
      const floated = where(page, (node) => side(node).length > 0);
      const sides = new Set(floated.flatMap(side));
      const strong = sides.size >= 2 || floated.some((node) => node.tag === "img") ? floated : [];
      return { strong, weak: floated, scope: parents(strong), alternate: pictureBesideText(page) };
    },
  },
  {
    name: "Grid layout (§2.1.18)",
    demo: true,
    // Strong: a row of columns sized in percentages, or a CSS grid with
    // columns. Weak: a percentage width. Alternate: flex columns sized with
    // a flex-basis percentage (TA review, points kept).
    evidence: (page) => {
      const percent = (node: DomNode) =>
        propValues(page, node, authored, ["width"]).some((value) => /%$/.test(value));
      const basis = (node: DomNode) => flexBasisPercent(page, node);
      const strong: DomNode[] = [];
      const scope: DomNode[] = [];
      const alternate: DomNode[] = [];
      for (const parent of page.elements) {
        const columns = parent.children.filter(percent);
        const flexColumns = parent.children.filter(basis);
        if (flexColumns.length >= 2) alternate.push(...flexColumns);
        if (columns.length >= 2) strong.push(...columns);
        else if (
          propValues(page, parent, authored, ["display"]).some((value) => /grid/.test(value)) &&
          hasProp(page, parent, authored, ["grid-template-columns", "grid-template", "grid"])
        ) {
          strong.push(parent);
          scope.push(parent);
        }
      }
      return {
        strong,
        weak: where(page, percent),
        scope: unique([...scope, ...parents(strong.filter(percent))]),
        alternate,
      };
    },
  },
  {
    name: "Flex (§2.1.19)",
    demo: true,
    // Strong: a flex container with a child that grows.
    evidence: (page) => {
      const flexBox = (node: DomNode) =>
        propValues(page, node, authored, ["display"]).some((value) => value.includes("flex"));
      const strong: DomNode[] = [];
      for (const parent of page.elements) {
        if (!flexBox(parent)) continue;
        const growing = parent.children.filter((node) => hasProp(page, node, authored, ["flex-grow", "flex"]));
        if (growing.length) strong.push(parent, ...growing);
      }
      return { strong, weak: where(page, flexBox), scope: strong.filter(flexBox) };
    },
  },
  {
    name: "Media queries (§2.1.20)",
    evidence: (page) => ({
      strong: where(page, (node) => declsOf(page, node, authored).some((decl) => decl.media)),
      weak: [],
    }),
  },
];

/** Every §2.1 sample on the Lab 2 page. */
export const A2_LAB2_SAMPLES: readonly SampleCheck[] = [
  ...A2_SELECTOR_SAMPLES,
  ...A2_BOX_MODEL_SAMPLES,
  ...A2_LAYOUT_SAMPLES,
];

/** react-icons render an <svg> with shapes inside. */
export function iconCount(page: StyledPage): number {
  return page.elements.filter(
    (node) =>
      node.tag === "svg" &&
      node.children.some((child) => ["path", "circle", "rect", "polygon", "polyline", "line", "ellipse", "g"].includes(child.tag)),
  ).length;
}

/* ------------------------------------------------------------------ */
/* §2.3 Tailwind                                                       */
/* ------------------------------------------------------------------ */

/** `.cls` as it appears in compiled CSS (`md:flex` is `.md\:flex`). */
function classSelectorPattern(cls: string): RegExp {
  const escaped = cls.replace(/[^\w-]/g, (ch) => `\\${ch}`);
  return new RegExp(`\\.${escaped.replace(/[\\^$.*+?()[\]{}|/]/g, "\\$&")}(?![\\w-]|\\\\)`);
}

/** Declarations reaching `node` from rules that select it by `cls`. */
function classDecls(page: StyledPage, node: DomNode, cls: string): AppliedDecl[] {
  const pattern = classSelectorPattern(cls);
  return declsOf(page, node, (decl) => decl.rule >= 0 && pattern.test(page.rules[decl.rule].selector));
}

/**
 * Elements using a utility class whose own CSS rule sets one of `props`,
 * grouped by class. A class with no rule (a typo, or prose) never counts.
 */
function styledClass(
  page: StyledPage,
  pattern: RegExp,
  props: RegExp,
  test: (decl: AppliedDecl) => boolean = () => true,
): Map<string, DomNode[]> {
  const hits = new Map<string, DomNode[]>();
  for (const node of page.elements) {
    for (const cls of node.classes) {
      if (!pattern.test(cls)) continue;
      if (!classDecls(page, node, cls).some((decl) => props.test(decl.prop) && test(decl))) continue;
      hits.set(cls, [...(hits.get(cls) ?? []), node]);
    }
  }
  return hits;
}

const usingClass = (page: StyledPage, pattern: RegExp) =>
  where(page, (node) => node.classes.some((cls) => pattern.test(cls)));

const FONT_WEIGHT = /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/;
const FONT_SIZE = /^text-(xs|sm|base|lg|[2-9]?xl)$/;
const FILTERS = /^(blur|brightness|contrast|grayscale|sepia|invert|saturate|hue-rotate|drop-shadow)/;
const RESPONSIVE = /^(sm|md|lg|xl|2xl):/;

/**
 * The demo a Tailwind sample's elements sit in: the largest ancestor (or
 * the element) that is still one component: a small subtree with at most
 * two top-level titles (h1/h2; the book's spacing and type components each have two), so a compact page never becomes one
 * "section". Every element inside it counts as that sample's; other
 * samples' weak evidence in there doesn't count, the way §2.1 demo scopes
 * work.
 */
function tailwindSection(nodes: readonly DomNode[]): DomNode[] {
  const titles = (node: DomNode) => descendants(node).filter((inner) => inner.tag === "h1" || inner.tag === "h2").length;
  const out = new Set<DomNode>();
  for (const node of nodes) {
    let top = node;
    while (top.parent && descendants(top.parent).length <= MAX_SCOPE && titles(top.parent) <= 2) top = top.parent;
    for (const inner of descendants(top)) out.add(inner);
  }
  return [...out];
}

/** Elements that can be a Tailwind sample (not headings, rules, or page-wide wrappers). */
function sampleElement(node: DomNode): boolean {
  return !/^(h[1-6]|hr)$/.test(node.tag) && descendants(node).length <= MAX_SCOPE;
}

const MARGIN_CLASS = /^-?m[trblxyse]?-/;
const SIDE_MARGIN_CLASS = /^-?m[lrxse]-/;
const PADDING_CLASS = /^p[trblxyse]?-/;
const SIDE_PADDING_CLASS = /^p[trblse]-/;
const BG_CLASS = /^bg-[a-z]+(-\d{2,3})?$/;
const notAuto = (decl: AppliedDecl) => !/^(auto|0|0px)$/.test(decl.value.trim());

/** Utility classes on `node` (matching `pattern`) whose own rule sets one of `props`. */
function nodeUtilities(
  page: StyledPage,
  node: DomNode,
  pattern: RegExp,
  props: RegExp,
  test: (decl: AppliedDecl) => boolean = () => true,
): string[] {
  return node.classes.filter(
    (cls) => pattern.test(cls) && classDecls(page, node, cls).some((decl) => props.test(decl.prop) && test(decl)),
  );
}

/** Responsive (sm:, md:, …) utilities on `node` whose @media rule sets one of `props`. */
function responsiveUtilities(page: StyledPage, node: DomNode, props: RegExp, value?: RegExp): string[] {
  return nodeUtilities(page, node, RESPONSIVE, props, (decl) => decl.media && (!value || value.test(decl.value.trim())));
}

/** CSS that selects the element itself (utilities, own rules, inline), not `*` or base resets. */
const selected: DeclFilter = (decl) => decl.via !== "tag";

const isFlexOrGrid = (page: StyledPage, node: DomNode) =>
  propValues(page, node, (decl) => selected(decl) && !decl.media, ["display"]).some((value) => /flex|grid/.test(value));

/** A cell of a flex row or grid: its spacing and colors belong to that layout sample. */
const isLayoutCell = (page: StyledPage, node: DomNode) => node.parent !== null && isFlexOrGrid(page, node.parent);

/**
 * A Tailwind section sample. `strong` finds the book's demo; its whole
 * component then counts as that sample's (see tailwindSection). `weak`
 * finds the sample's utilities used some other way.
 */
function tailwindSample(
  name: string,
  strong: (page: StyledPage) => DomNode[],
  weak: (page: StyledPage) => DomNode[],
  options: { responsive?: boolean } = {},
): SampleCheck {
  return {
    name,
    demo: true,
    evidence: (page) => {
      const found = strong(page);
      return {
        strong: found.length ? tailwindSection(found) : [],
        weak: weak(page).filter(sampleElement),
        // The five responsive samples joined the book on Sep 28 (before
        // that, §2.3 had only the responsive card), and students also built
        // "responsive prefixes" their own way. When one is missing but the
        // page uses responsive utilities elsewhere, we can't tell a skipped
        // sample from one built on the earlier book: TA review, points kept.
        alternate: options.responsive && !found.length ? where(page, (node) => responsiveUtilities(page, node, /./).length > 0) : [],
      };
    },
  };
}

/**
 * The §2.3 Tailwind page, one sample per book section. Each section is
 * found by the utilities it uses and how its elements sit together, never
 * by ids or text; removing a section fails the row unless its utilities
 * still show up somewhere no other section explains (then TA review).
 */
export const A2_TAILWIND_SAMPLES: SampleCheck[] = [
  tailwindSample(
    "Tailwind margins",
    // Strong: margin on chosen sides (start and end, or several sides on one box).
    (page) =>
      where(
        page,
        (node) =>
          nodeUtilities(page, node, SIDE_MARGIN_CLASS, /^margin/, notAuto).length > 0 ||
          nodeUtilities(page, node, MARGIN_CLASS, /^margin/, notAuto).length >= 2,
      ),
    (page) =>
      where(
        page,
        (node) => !isLayoutCell(page, node) && nodeUtilities(page, node, MARGIN_CLASS, /^margin/, notAuto).length > 0,
      ),
  ),
  tailwindSample(
    "Tailwind padding",
    // Strong: padding on two or more chosen sides of one box.
    (page) => where(page, (node) => nodeUtilities(page, node, SIDE_PADDING_CLASS, /^padding/).length >= 2),
    (page) =>
      where(page, (node) => !isLayoutCell(page, node) && nodeUtilities(page, node, PADDING_CLASS, /^padding/).length > 0),
  ),
  tailwindSample(
    "Tailwind font size and weight",
    // Strong: three sibling elements in three font sizes, or in three weights.
    (page) => {
      const out: DomNode[] = [];
      for (const parent of page.elements) {
        const kids = parent.children.filter((node) => page.elements.includes(node));
        for (const [pattern, prop] of [[FONT_SIZE, /^font-size$/], [FONT_WEIGHT, /^font-weight$/]] as const) {
          const styled = kids.filter((node) => nodeUtilities(page, node, pattern, prop).length > 0);
          const values = new Set(styled.flatMap((node) => nodeUtilities(page, node, pattern, prop)));
          if (values.size >= 3) out.push(...styled);
        }
      }
      return unique(out);
    },
    (page) =>
      where(
        page,
        (node) =>
          nodeUtilities(page, node, FONT_SIZE, /^font-size$/).length > 0 ||
          nodeUtilities(page, node, FONT_WEIGHT, /^font-weight$/).length > 0,
      ),
  ),
  tailwindSample(
    "Tailwind background colors",
    // Strong: three sibling boxes in three background colors, stacked (not
    // cells of a flex row or grid, which are those samples).
    (page) => {
      const out: DomNode[] = [];
      for (const parent of page.elements) {
        if (isFlexOrGrid(page, parent)) continue;
        const kids = parent.children.filter(
          (node) => nodeUtilities(page, node, BG_CLASS, /^background/).length > 0 && responsiveUtilities(page, node, /./).length === 0,
        );
        const values = new Set(kids.flatMap((node) => nodeUtilities(page, node, BG_CLASS, /^background/)));
        if (values.size >= 3) out.push(...kids);
      }
      return out;
    },
    (page) =>
      where(page, (node) => !isLayoutCell(page, node) && nodeUtilities(page, node, BG_CLASS, /^background/).length > 0),
  ),
  tailwindSample(
    "Tailwind responsive breakpoint (background changes at md:)",
    (page) => where(page, (node) => responsiveUtilities(page, node, /^background/).length > 0),
    (page) => where(page, (node) => responsiveUtilities(page, node, /^(color|--tw-text)/).length > 0),
    { responsive: true },
  ),
  tailwindSample(
    "Tailwind responsive show and hide",
    // Strong: an element hidden at a breakpoint, or hidden until one.
    (page) =>
      where(
        page,
        (node) =>
          responsiveUtilities(page, node, /^display$/, /^none$/).length > 0 ||
          (propValues(page, node, (decl) => !decl.media, ["display"]).includes("none") &&
            responsiveUtilities(page, node, /^display$/).length > 0),
      ),
    (page) => where(page, (node) => responsiveUtilities(page, node, /^display$/).length > 0),
    { responsive: true },
  ),
  tailwindSample(
    "Tailwind responsive flex (row at md:)",
    (page) => where(page, (node) => responsiveUtilities(page, node, /^flex-direction$/).length > 0),
    (page) => where(page, (node) => responsiveUtilities(page, node, /^(display|flex-wrap)$/, /flex|wrap/).length > 0),
    { responsive: true },
  ),
  tailwindSample(
    "Tailwind responsive grid (more columns at sm:, lg:)",
    (page) => where(page, (node) => responsiveUtilities(page, node, /^grid-template-columns$/).length > 0),
    (page) => where(page, (node) => responsiveUtilities(page, node, /^(gap|grid)/).length > 0),
    { responsive: true },
  ),
  tailwindSample(
    "Tailwind responsive spacing and text size",
    // Strong: padding (or margin) and font size that both grow at a breakpoint.
    (page) =>
      where(
        page,
        (node) =>
          responsiveUtilities(page, node, /^(padding|margin)/).length > 0 &&
          responsiveUtilities(page, node, /^font-size$/).length > 0,
      ),
    (page) =>
      where(
        page,
        (node) =>
          responsiveUtilities(page, node, /^(padding|margin)/).length > 0 ||
          responsiveUtilities(page, node, /^font-size$/).length > 0,
      ),
    { responsive: true },
  ),
  tailwindSample(
    "Tailwind responsive design (card that turns into a row)",
    // Strong: a container that becomes flex at a breakpoint, holding an
    // element whose size changes at that breakpoint.
    (page) =>
      where(
        page,
        (node) =>
          responsiveUtilities(page, node, /^display$/, /flex|grid/).length > 0 &&
          descendants(node).some(
            (inner) => inner !== node && responsiveUtilities(page, inner, /^(width|height|max-width|min-height|flex-shrink)$/).length > 0,
          ),
      ),
    (page) => where(page, (node) => responsiveUtilities(page, node, /^(width|max-width|height|min-height)$/).length > 0),
    { responsive: true },
  ),
  {
    name: "Tailwind filters (blur)",
    evidence: (page) => ({
      strong: unique([...styledClass(page, FILTERS, /^(filter|--tw-)/).values()].flat()),
      weak: usingClass(page, FILTERS),
    }),
  },
  {
    name: "Tailwind grid system (columns that span)",
    demo: true,
    // Strong: a grid whose children span different numbers of columns.
    evidence: (page) => {
      const grids = where(
        page,
        (parent) =>
          propValues(page, parent, selected, ["display"]).includes("grid") &&
          hasProp(page, parent, selected, ["grid-template-columns"]),
      );
      const spans = (parent: DomNode) =>
        new Set(parent.children.flatMap((node) => propValues(page, node, selected, ["grid-column"])));
      const strong = grids.filter((parent) => spans(parent).size >= 2);
      return {
        strong: strong.length ? tailwindSection(strong) : [],
        weak: grids,
        // A grid with one spanning column is this sample built smaller, even
        // inside another sample's section: TA review.
        alternate: grids.filter((parent) => spans(parent).size === 1),
      };
    },
  },
];

/** Most elements in one sample's demo container. */
const MAX_SCOPE = 25;

function isStyledBox(page: StyledPage, node: DomNode): boolean {
  return hasProp(page, node, authored, /^(position|background|background-color|border|border-[a-z-]+|display|width|height)$/);
}

function descendants(node: DomNode): DomNode[] {
  return [node, ...node.children.flatMap(descendants)];
}

export type SampleRun = { found: string[]; weak: string[]; missing: string[]; review: string[] };

/**
 * Run `samples` on a page. `all` is every sample on that page (defaults to
 * `samples`): weak evidence that only sits on elements another sample
 * uses as strong evidence doesn't count.
 */
export function runSamples(
  samples: readonly SampleCheck[],
  page: StyledPage,
  all: readonly SampleCheck[] = samples,
): SampleRun {
  const pool = unique([...all, ...samples]);
  const evidence = new Map(pool.map((sample) => [sample, sample.evidence(page)] as const));
  const out: SampleRun = { found: [], weak: [], missing: [], review: [] };
  for (const sample of samples) {
    const own = evidence.get(sample)!;
    if (own.strong.length > 0) {
      out.found.push(sample.name);
      continue;
    }
    const taken = new Set<DomNode>();
    for (const [other, ev] of evidence) {
      if (other === sample || !other.demo) continue;
      for (const node of ev.strong) taken.add(node);
      for (const container of ev.scope ?? []) {
        // Only a styled box is a demo container; a plain wrapper may hold
        // several samples.
        if (!isStyledBox(page, container)) continue;
        const subtree = descendants(container);
        // A container holding much of the page is page layout, not a demo.
        if (subtree.length > MAX_SCOPE) continue;
        for (const node of subtree) if (!ev.scopeKeeps?.(node)) taken.add(node);
      }
    }
    if (own.idReview) out.review.push(sample.name);
    else if ((own.alternate?.length ?? 0) > 0 || own.weak.some((node) => !taken.has(node))) out.weak.push(sample.name);
    else out.missing.push(sample.name);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Page-level checks                                                   */
/* ------------------------------------------------------------------ */

const TEMPLATE_TEXT =
  /(to get started, edit|get started by editing|looking for a starting point or more instructions|save and see your changes instantly)/i;

/** The create-next-app starter page (any version). */
export function isTemplatePage(html: string): boolean {
  const markup = renderedMarkup(html ?? "");
  if (TEMPLATE_TEXT.test(renderedText(markup))) return true;
  return /<img\b[^>]*\balt\s*=\s*["'](next\.js logo|vercel logo(mark)?)["']/i.test(markup);
}

/** A real page: not the template, with a heading and some content. */
export function hasPageContent(page: StyledPage): boolean {
  const headings = page.elements.filter((node) => /^h[1-6]$/.test(node.tag) && textOf(node).length > 0);
  return headings.length >= 1 && page.elements.length >= 5;
}

/** Handwritten CSS from a stylesheet (not inline) reaches something on the page. */
export function hasAuthoredStylesheet(page: StyledPage): boolean {
  return page.elements.some((node) =>
    (page.applied.get(node) ?? []).some((decl) => authored(decl) && decl.via !== "inline"),
  );
}

/* ------------------------------------------------------------------ */
/* Delivery (Labs page)                                                */
/* ------------------------------------------------------------------ */

function sameSite(href: string, siteHost?: string): boolean {
  const host = anchorHrefHost(href);
  if (!host) return true;
  return Boolean(siteHost) && host === siteHost?.toLowerCase();
}

function internalPaths(html: string, siteHost?: string): string[] {
  const paths: string[] = [];
  const re = /<a\b[^>]*\bhref\s*=\s*["']([^"']*)["'][^>]*>/gi;
  const markup = renderedMarkup(html ?? "");
  let match: RegExpExecArray | null;
  while ((match = re.exec(markup))) {
    const href = match[1];
    if (/^(mailto|tel|javascript):/i.test(href.trim()) || href.trim().startsWith("#")) continue;
    if (!sameSite(href, siteHost)) continue;
    const path = anchorPathname(href);
    if (path) paths.push(path);
  }
  return paths;
}

/**
 * Labs still lists Lab 1, Lab 2 and Kambaz: links to /labs/lab1 and
 * /labs/lab2, plus a link into the Kambaz app (any page on the site
 * outside /labs, such as /, /account/signin or /dashboard).
 */
export function a2LabsNavParts(labsHtml: string, siteHost?: string): { lab1: boolean; lab2: boolean; kambaz: boolean } {
  const paths = internalPaths(labsHtml, siteHost);
  return {
    lab1: paths.includes("/labs/lab1"),
    lab2: paths.includes("/labs/lab2"),
    kambaz: paths.some((path) => !/^\/labs(\/|$)/.test(path)),
  };
}

export function a2LabsNavPassed(labsHtml: string, siteHost?: string): boolean {
  const parts = a2LabsNavParts(labsHtml, siteHost);
  return parts.lab1 && parts.lab2 && parts.kambaz;
}

/** A link to a GitHub repository (github.com/<owner>/<repo>) on Labs. */
export function a2GithubLinkPassed(labsHtml: string): boolean {
  return externalAnchorUrls(labsHtml).some((url) => {
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== "github.com") return false;
    const parts = url.pathname.split("/").filter(Boolean);
    return parts.length >= 2;
  });
}
