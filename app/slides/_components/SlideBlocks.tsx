"use client";

import { useEffect, useRef, useState } from "react";
import {
  BLOCK_FONT_SIZES,
  BLOCK_FRAME_SIZES,
  blockFontClass,
  blockFrameClass,
  createBulletsBlock,
  createCodeBlock,
  createComponentBlock,
  moveItem,
  type BlockFontSize,
  type BlockFrameSize,
  type BlockSlide,
  type SlideBlock,
} from "@/lib/lectures/blocks";
import {
  listSlideComponentOptions,
  type SlideComponentId,
} from "@/lib/lectures/component-registry";
import { htmlToSlideText, slideTextToHtml } from "@/lib/lectures/slide-markup";
import type { LectureSlideDensity } from "@/lib/lectures/types";
import LectureCodeBlock from "./LectureCodeBlock";
import SlideComponent from "./SlideComponent";
import SlideText from "./SlideText";

const CODE_LANGUAGES = [
  "tsx",
  "ts",
  "js",
  "jsx",
  "html",
  "css",
  "bash",
  "json",
  "text",
];

const COMPONENT_OPTIONS = listSlideComponentOptions();

function fontClass(size?: BlockFontSize): string {
  return blockFontClass(size);
}

function frameClass(size?: BlockFrameSize): string {
  return blockFrameClass(size);
}

function BulletView({
  block,
  density,
  kind,
}: {
  block: Extract<SlideBlock, { type: "bullets" }>;
  density: LectureSlideDensity;
  kind: BlockSlide["kind"];
}) {
  const color = kind === "title" ? "text-neutral-100" : "text-neutral-900";
  return (
    <div className={fontClass(block.fontSize)}>
      {block.title ? (
        <p className="lecture-slide-block-title mb-2 font-sans font-semibold">
          {block.title}
        </p>
      ) : null}
      {block.items.length > 0 ? (
        <ul
          className={`lecture-slide-bullets${block.columns === 2 ? " lecture-slide-bullets-cols" : ""} ${color}`}
        >
          {block.items.map((item, index) => (
            <li key={`${block.id}-${index}`}>
              <SlideText text={item} density={density} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function CodeView({
  block,
}: {
  block: Extract<SlideBlock, { type: "code" }>;
}) {
  return (
    <div className={`${fontClass(block.fontSize)} ${frameClass(block.size)}`}>
      <LectureCodeBlock
        block={{
          code: block.code,
          language: block.language,
          file: block.file,
          highlightLines: block.highlightLines,
          addedLines: block.addedLines,
          html: block.html,
        }}
      />
    </div>
  );
}

function ComponentView({
  block,
}: {
  block: Extract<SlideBlock, { type: "component" }>;
}) {
  return (
    <div className={frameClass(block.size)}>
      <SlideComponent id={block.componentId} />
    </div>
  );
}

export function SlideBlockView({
  slide,
  density,
}: {
  slide: BlockSlide;
  density: LectureSlideDensity;
}) {
  return (
    <>
      {slide.blocks.map((block) => (
        <div key={block.id} className="lecture-block" data-block-type={block.type}>
          {block.type === "bullets" ? (
            <BulletView block={block} density={density} kind={slide.kind} />
          ) : null}
          {block.type === "code" ? <CodeView block={block} /> : null}
          {block.type === "component" ? <ComponentView block={block} /> : null}
        </div>
      ))}
    </>
  );
}

function ToolbarButton({
  children,
  onClick,
  disabled,
  pressed,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      className={`rounded border px-1.5 py-0.5 font-sans text-xs ${
        pressed
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-400 bg-white text-neutral-800"
      } disabled:cursor-not-allowed disabled:opacity-40`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function EditableMarkup({
  value,
  className,
  onChange,
  placeholder,
}: {
  value: string;
  className?: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || focused) return;
    const html = slideTextToHtml(value) || "";
    if (node.innerHTML !== html) node.innerHTML = html;
  }, [value, focused]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={className}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        setFocused(false);
        onChange(htmlToSlideText(event.currentTarget.innerHTML));
      }}
    />
  );
}

function BlockEditor({
  block,
  index,
  total,
  selected,
  density,
  kind,
  onSelect,
  onChange,
  onMove,
  onRemove,
}: {
  block: SlideBlock;
  index: number;
  total: number;
  selected: boolean;
  density: LectureSlideDensity;
  kind: BlockSlide["kind"];
  onSelect: () => void;
  onChange: (next: SlideBlock) => void;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
}) {
  function setFont(fontSize: BlockFontSize) {
    if (block.type === "component") return;
    onChange({
      ...block,
      fontSize: fontSize === "md" ? undefined : fontSize,
    });
  }

  function setSize(size: BlockFrameSize) {
    if (block.type === "bullets") return;
    onChange({ ...block, size });
  }

  return (
    <div
      className="lecture-block lecture-block-edit"
      data-block-type={block.type}
      data-selected={selected ? "true" : undefined}
      onClick={onSelect}
    >
      <div className="lecture-block-toolbar">
        <span className="mr-1 font-semibold uppercase tracking-wide text-neutral-500">
          {block.type}
        </span>
        <ToolbarButton onClick={() => onMove(-1)} disabled={index === 0}>
          Up
        </ToolbarButton>
        <ToolbarButton onClick={() => onMove(1)} disabled={index === total - 1}>
          Down
        </ToolbarButton>
        <ToolbarButton onClick={onRemove}>Remove</ToolbarButton>
        {block.type !== "component" ? (
          <>
            <span className="mx-1 text-neutral-400">Aa</span>
            {BLOCK_FONT_SIZES.map((size) => (
              <ToolbarButton
                key={size}
                pressed={block.fontSize === size || (!block.fontSize && size === "md")}
                onClick={() => setFont(size)}
              >
                {size}
              </ToolbarButton>
            ))}
            {block.type === "bullets" ? (
              <ToolbarButton
                onClick={() => {
                  document.execCommand("bold");
                }}
              >
                Bold
              </ToolbarButton>
            ) : null}
          </>
        ) : null}
        {block.type !== "bullets" ? (
          <>
            <span className="mx-1 text-neutral-400">size</span>
            {BLOCK_FRAME_SIZES.map((size) => (
              <ToolbarButton
                key={size}
                pressed={block.size === size || (!block.size && size === "lg")}
                onClick={() => setSize(size)}
              >
                {size}
              </ToolbarButton>
            ))}
          </>
        ) : null}
      </div>

      {block.type === "bullets" ? (
        <div className={fontClass(block.fontSize)}>
          <EditableMarkup
            value={block.title ?? ""}
            placeholder="Optional title"
            className="lecture-slide-block-title mb-2 min-h-[1.5rem] font-sans font-semibold outline-none"
            onChange={(title) =>
              onChange({ ...block, title: title || undefined })
            }
          />
          <ul
            className={`lecture-slide-bullets${block.columns === 2 ? " lecture-slide-bullets-cols" : ""} ${
              kind === "title" ? "text-neutral-100" : "text-neutral-900"
            }`}
          >
            {block.items.map((item, itemIndex) => (
              <li key={`${block.id}-edit-${itemIndex}`}>
                <EditableMarkup
                  value={item}
                  className="min-h-[1.2em] outline-none"
                  onChange={(next) => {
                    const items = block.items.slice();
                    items[itemIndex] = next;
                    onChange({ ...block, items });
                  }}
                />
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <ToolbarButton
              onClick={() =>
                onChange({ ...block, items: [...block.items, "New bullet"] })
              }
            >
              + Bullet
            </ToolbarButton>
            {block.items.length > 0 ? (
              <ToolbarButton
                onClick={() =>
                  onChange({ ...block, items: block.items.slice(0, -1) })
                }
              >
                − Last bullet
              </ToolbarButton>
            ) : null}
          </div>
        </div>
      ) : null}

      {block.type === "code" ? (
        <div className={`${fontClass(block.fontSize)} ${frameClass(block.size)}`}>
          <div className="mb-2 flex flex-wrap gap-2 font-sans text-xs">
            <label className="flex items-center gap-1">
              Language
              <select
                className="rounded border border-neutral-400 bg-white px-1 py-0.5"
                value={block.language ?? "tsx"}
                onChange={(event) =>
                  onChange({
                    ...block,
                    language: event.target.value,
                    html: undefined,
                  })
                }
              >
                {CODE_LANGUAGES.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1">
              File
              <input
                className="rounded border border-neutral-400 px-1 py-0.5 font-mono"
                value={block.file ?? ""}
                onChange={(event) =>
                  onChange({
                    ...block,
                    file: event.target.value || undefined,
                  })
                }
              />
            </label>
          </div>
          <textarea
            className="min-h-32 w-full rounded border border-neutral-500 bg-[#0d1117] p-3 font-mono text-sm text-neutral-100"
            value={block.code}
            spellCheck={false}
            onChange={(event) =>
              onChange({
                ...block,
                code: event.target.value,
                html: undefined,
              })
            }
          />
        </div>
      ) : null}

      {block.type === "component" ? (
        <div className={frameClass(block.size)}>
          <label className="mb-2 flex flex-wrap items-center gap-2 font-sans text-xs">
            Embed
            <select
              className="max-w-full rounded border border-neutral-400 bg-white px-1 py-0.5"
              value={block.componentId}
              onChange={(event) =>
                onChange({
                  ...block,
                  componentId: event.target.value as SlideComponentId,
                })
              }
            >
              <optgroup label="Chapter 1 book">
                {COMPONENT_OPTIONS.filter((row) => row.group === "Chapter 1 book").map(
                  (row) => (
                    <option key={row.id} value={row.id}>
                      {row.label}
                    </option>
                  ),
                )}
              </optgroup>
              <optgroup label="Lecture embeds">
                {COMPONENT_OPTIONS.filter((row) => row.group === "Lecture embeds").map(
                  (row) => (
                    <option key={row.id} value={row.id}>
                      {row.label}
                    </option>
                  ),
                )}
              </optgroup>
            </select>
          </label>
          <SlideComponent id={block.componentId} />
        </div>
      ) : null}

      {!selected && block.type === "bullets" ? (
        <span className="sr-only">Click to select this block</span>
      ) : null}
      <span className="sr-only">{density}</span>
    </div>
  );
}

export function SlideBlockEditor({
  slide,
  density,
  onChange,
}: {
  slide: BlockSlide;
  density: LectureSlideDensity;
  onChange: (next: BlockSlide) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    slide.blocks[0]?.id ?? null,
  );

  function updateBlock(index: number, next: SlideBlock) {
    const blocks = slide.blocks.slice();
    blocks[index] = next;
    onChange({ ...slide, blocks });
  }

  function addBlock(type: SlideBlock["type"]) {
    const block =
      type === "bullets"
        ? createBulletsBlock()
        : type === "code"
          ? createCodeBlock({ code: "// code" })
          : createComponentBlock();
    onChange({ ...slide, blocks: [...slide.blocks, block] });
    setSelectedId(block.id);
  }

  return (
    <div className="lecture-block-list">
      {slide.blocks.map((block, index) => (
        <BlockEditor
          key={block.id}
          block={block}
          index={index}
          total={slide.blocks.length}
          selected={selectedId === block.id}
          density={density}
          kind={slide.kind}
          onSelect={() => setSelectedId(block.id)}
          onChange={(next) => updateBlock(index, next)}
          onMove={(delta) =>
            onChange({
              ...slide,
              blocks: moveItem(slide.blocks, index, delta),
            })
          }
          onRemove={() => {
            const blocks = slide.blocks.filter((_, i) => i !== index);
            onChange({ ...slide, blocks });
          }}
        />
      ))}
      <div className="mt-3 flex flex-wrap gap-2">
        <ToolbarButton onClick={() => addBlock("bullets")}>+ Bullets</ToolbarButton>
        <ToolbarButton onClick={() => addBlock("code")}>+ Code</ToolbarButton>
        <ToolbarButton onClick={() => addBlock("component")}>+ Component</ToolbarButton>
      </div>
    </div>
  );
}
