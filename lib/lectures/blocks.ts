import type { CodeLineMarks } from "@/lib/code-block/lines";
import {
  LECTURE_EMBED_IDS,
  lectureSlideCodeBlocks,
  type LectureCodeBlock,
  type LectureDiagramId,
  type LectureEmbedId,
  type LectureSlide,
  type LectureSlideDensity,
  type SlideKind,
} from "./types";
import {
  isSlideComponentId,
  type SlideComponentId,
} from "./component-registry";

export type BlockFontSize = "sm" | "md" | "lg" | "xl";
export type BlockFrameSize = "sm" | "md" | "lg";

export const BLOCK_FONT_SIZES = ["sm", "md", "lg", "xl"] as const;
export const BLOCK_FRAME_SIZES = ["sm", "md", "lg"] as const;

export type BulletsBlock = {
  id: string;
  type: "bullets";
  title?: string;
  items: string[];
  /** Two columns of the same bullet type, for a short side-by-side list. */
  columns?: 2;
  fontSize?: BlockFontSize;
};

export type CodeContentBlock = {
  id: string;
  type: "code";
  code: string;
  language?: string;
  file?: string;
  highlightLines?: CodeLineMarks;
  addedLines?: CodeLineMarks;
  html?: string;
  fontSize?: BlockFontSize;
  size?: BlockFrameSize;
};

export type ComponentBlock = {
  id: string;
  type: "component";
  componentId: SlideComponentId;
  size?: BlockFrameSize;
};

export type SlideBlock = BulletsBlock | CodeContentBlock | ComponentBlock;

/**
 * Typed block slide. Title/kind stay on the slide for filmstrip + chrome
 * (titles never wrap). Leftover `diagram` / `imageSrc` / `interactiveHint`
 * exist so the adapter can keep teaching figures on legacy decks.
 */
export type BlockSlide = {
  id: string;
  title: string;
  kind?: SlideKind;
  blocks: SlideBlock[];
  interactiveHint?: string;
  diagram?: LectureDiagramId;
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: string;
  density?: LectureSlideDensity;
};

export type AuthoredSlide = LectureSlide | BlockSlide;

export function isBlockSlide(slide: AuthoredSlide): slide is BlockSlide {
  return Array.isArray((slide as BlockSlide).blocks);
}

export function newBlockId(prefix = "block"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createBulletsBlock(
  partial?: Partial<Omit<BulletsBlock, "type">>,
): BulletsBlock {
  return {
    id: partial?.id ?? newBlockId("bullets"),
    type: "bullets",
    title: partial?.title,
    items: partial?.items ?? ["New talking point"],
    columns: partial?.columns,
    fontSize: partial?.fontSize,
  };
}

export function createCodeBlock(
  partial?: Partial<Omit<CodeContentBlock, "type">>,
): CodeContentBlock {
  return {
    id: partial?.id ?? newBlockId("code"),
    type: "code",
    code: partial?.code ?? "",
    language: partial?.language ?? "tsx",
    file: partial?.file,
    highlightLines: partial?.highlightLines,
    addedLines: partial?.addedLines,
    html: partial?.html,
    fontSize: partial?.fontSize,
    size: partial?.size,
  };
}

export function createComponentBlock(
  partial?: Partial<Omit<ComponentBlock, "type">>,
): ComponentBlock {
  return {
    id: partial?.id ?? newBlockId("component"),
    type: "component",
    componentId: partial?.componentId ?? "ch1-home",
    size: partial?.size,
  };
}

export function createBlockSlide(
  partial?: Partial<Omit<BlockSlide, "blocks">> & { blocks?: SlideBlock[] },
): BlockSlide {
  return {
    id: partial?.id ?? newBlockId("slide"),
    title: partial?.title ?? "New slide",
    kind: partial?.kind ?? "content",
    blocks: partial?.blocks ?? [createBulletsBlock()],
    interactiveHint: partial?.interactiveHint,
    diagram: partial?.diagram,
    imageSrc: partial?.imageSrc,
    imageAlt: partial?.imageAlt,
    imageCaption: partial?.imageCaption,
    density: partial?.density,
  };
}

export function authoredSlideBullets(slide: AuthoredSlide): string[] {
  if (isBlockSlide(slide)) {
    return slide.blocks.flatMap((block) =>
      block.type === "bullets" ? block.items : [],
    );
  }
  return slide.bullets ?? [];
}

export function authoredSlideEmbed(
  slide: AuthoredSlide,
): LectureEmbedId | undefined {
  if (isBlockSlide(slide)) {
    for (const block of slide.blocks) {
      if (block.type !== "component") continue;
      if ((LECTURE_EMBED_IDS as readonly string[]).includes(block.componentId)) {
        return block.componentId as LectureEmbedId;
      }
    }
    return undefined;
  }
  return slide.embed;
}

export function authoredSlideDiagram(
  slide: AuthoredSlide,
): LectureDiagramId | undefined {
  return slide.diagram;
}

export function authoredSlideTextParts(slide: AuthoredSlide): string[] {
  if (isBlockSlide(slide)) {
    const parts: string[] = [];
    for (const block of slide.blocks) {
      if (block.type === "bullets") {
        if (block.title) parts.push(block.title);
        parts.push(...block.items);
      }
      if (block.type === "code") parts.push(block.code);
    }
    if (slide.interactiveHint) parts.push(slide.interactiveHint);
    return parts;
  }
  return [
    ...(slide.bullets ?? []),
    slide.interactiveHint ?? "",
    ...lectureSlideCodeBlocks(slide).map((block) => block.code),
  ];
}

export function blockSlideCodeBlocks(slide: BlockSlide): LectureCodeBlock[] {
  return slide.blocks.flatMap((block) =>
    block.type === "code"
      ? [
          {
            code: block.code,
            language: block.language,
            file: block.file,
            highlightLines: block.highlightLines,
            addedLines: block.addedLines,
            html: block.html,
          },
        ]
      : [],
  );
}

export function authoredSlideCodeBlocks(slide: AuthoredSlide): LectureCodeBlock[] {
  if (isBlockSlide(slide)) return blockSlideCodeBlocks(slide);
  return lectureSlideCodeBlocks(slide);
}

export function authoredSlideDensity(slide: AuthoredSlide): LectureSlideDensity {
  if (slide.density) return slide.density;
  if (slide.diagram || slide.imageSrc) return "dense";
  if (isBlockSlide(slide)) {
    if (slide.blocks.some((block) => block.type === "component")) return "dense";
    return "spacious";
  }
  if (slide.embed) return "dense";
  return "spacious";
}

export function toBlockSlide(slide: AuthoredSlide): BlockSlide {
  if (isBlockSlide(slide)) return slide;
  const blocks: SlideBlock[] = [];
  if (slide.bullets && slide.bullets.length > 0) {
    blocks.push(
      createBulletsBlock({
        id: `${slide.id}-bullets`,
        items: slide.bullets,
      }),
    );
  }
  lectureSlideCodeBlocks(slide).forEach((block, index) => {
    blocks.push(
      createCodeBlock({
        id: `${slide.id}-code-${index}`,
        code: block.code,
        language: block.language,
        file: block.file,
        highlightLines: block.highlightLines,
        addedLines: block.addedLines,
        html: block.html,
      }),
    );
  });
  if (slide.embed && isSlideComponentId(slide.embed)) {
    blocks.push(
      createComponentBlock({
        id: `${slide.id}-component`,
        componentId: slide.embed,
      }),
    );
  }
  return {
    id: slide.id,
    title: slide.title,
    kind: slide.kind,
    blocks,
    interactiveHint: slide.interactiveHint,
    diagram: slide.diagram,
    imageSrc: slide.imageSrc,
    imageAlt: slide.imageAlt,
    imageCaption: slide.imageCaption,
    density: slide.density,
  };
}

export function toBlockSlides(slides: AuthoredSlide[]): BlockSlide[] {
  return slides.map(toBlockSlide);
}

export function deckUsesBlockModel(slides: AuthoredSlide[]): boolean {
  return slides.length > 0 && slides.every((slide) => isBlockSlide(slide));
}

export function moveItem<T>(items: T[], index: number, delta: -1 | 1): T[] {
  const next = index + delta;
  if (next < 0 || next >= items.length) return items;
  const copy = items.slice();
  const [row] = copy.splice(index, 1);
  copy.splice(next, 0, row);
  return copy;
}

export function stripBlockHtml(slides: BlockSlide[]): BlockSlide[] {
  return slides.map((slide) => ({
    ...slide,
    blocks: slide.blocks.map((block) =>
      block.type === "code" ? { ...block, html: undefined } : block,
    ),
  }));
}

export function createStarterDeckSlides(title: string): BlockSlide[] {
  const short = title.trim() || "Untitled";
  return [
    createBlockSlide({
      id: "title",
      title: short.slice(0, 42).toUpperCase(),
      kind: "title",
      blocks: [
        createBulletsBlock({
          id: "title-bullets",
          items: [short, "Draft deck — edit in ?edit=1"],
        }),
      ],
    }),
    createBlockSlide({
      id: "slide-1",
      title: "First slide",
      kind: "content",
      blocks: [
        createBulletsBlock({
          id: "slide-1-bullets",
          items: [
            "Add **talking points** here",
            "Use + to add code or a live embed",
          ],
        }),
      ],
    }),
  ];
}

export function isBlockFontSize(value: unknown): value is BlockFontSize {
  return (
    value === "sm" || value === "md" || value === "lg" || value === "xl"
  );
}

/**
 * Student/presenter view uses the restored lecture rem defaults when
 * `fontSize` is omitted. `md` is that same default — do not wrap every
 * block in `lecture-block-font-md` or the #83 em overrides win.
 */
export function blockFontClass(size?: BlockFontSize): string {
  return size ? `lecture-block-font-${size}` : "";
}

export function isBlockFrameSize(value: unknown): value is BlockFrameSize {
  return value === "sm" || value === "md" || value === "lg";
}

/**
 * Code and live embeds default to the slide stage width (lg). Instructors
 * can still pick sm/md for a narrower teaching column.
 */
export function blockFrameClass(size?: BlockFrameSize): string {
  return size && size !== "lg"
    ? `lecture-block-size-${size}`
    : "lecture-block-size-lg";
}

/** Filename shown on live lecture embeds (basename, or the whole label). */
export function lectureDemoSourceLabel(label: string): {
  file: string;
  path?: string;
  note?: string;
} {
  const match = label.match(
    /([\w.@()[\]/-]+\.(?:tsx|ts|jsx|js|html|css))\b/i,
  );
  if (!match) return { file: label };
  const path = match[1];
  const file = path.split("/").pop() || path;
  const note = label
    .replace(path, "")
    .replace(/^[—\-\s,]+|[—\-\s,]+$/g, "")
    .trim();
  return {
    file,
    ...(path.includes("/") ? { path } : {}),
    ...(note ? { note } : {}),
  };
}

/** Live embed owns the stage — no code sharing the slide. */
export function isDemoStageSlide(slide: BlockSlide): boolean {
  const hasComponent = slide.blocks.some((block) => block.type === "component");
  const hasCode = slide.blocks.some((block) => block.type === "code");
  return hasComponent && !hasCode;
}

/** Book target screenshot owns the stage — no code or live embed. */
export function isTargetFigureSlide(slide: BlockSlide): boolean {
  if (!slide.imageSrc) return false;
  return !slide.blocks.some(
    (block) => block.type === "code" || block.type === "component",
  );
}
