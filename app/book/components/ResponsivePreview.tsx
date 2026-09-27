"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  activeBreakpoint,
  clampPreviewWidth,
  TAILWIND_BREAKPOINTS,
  TAILWIND_WIDTH_PRESETS,
  type Breakpoint,
  type WidthPreset,
} from "./responsive-preview-model";
import styles from "./responsive-preview.module.css";

/**
 * Renders `src` in an iframe whose width is the preview, so viewport
 * breakpoints (`sm:`, `@media (min-width)`) follow this frame.
 */
export default function ResponsivePreview({
  src,
  title = "Responsive preview",
  presets = TAILWIND_WIDTH_PRESETS,
  breakpoints = TAILWIND_BREAKPOINTS,
}: {
  src: string;
  title?: string;
  presets?: WidthPreset[];
  breakpoints?: Breakpoint[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dragStart = useRef<{ x: number; width: number } | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);
  const [fitted, setFitted] = useState(375);
  const [frameHeight, setFrameHeight] = useState(480);

  const frameWidth = chosen ?? fitted;
  const breakpoint = activeBreakpoint(frameWidth, breakpoints);
  const handleLeft = Math.max(0, Math.min(frameWidth, fitted) - 12);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || chosen !== null) return;
    const update = () => {
      setFitted(Math.max(1, Math.round(scroller.clientWidth)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [chosen]);

  const measureContent = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    const root = doc?.getElementById("preview-root");
    const height = root?.scrollHeight ?? doc?.body?.scrollHeight ?? 0;
    if (height > 0) setFrameHeight(Math.ceil(height) + 2);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let observer: ResizeObserver | undefined;
    const attach = () => {
      measureContent();
      const root = iframe.contentDocument?.getElementById("preview-root");
      if (!root) return;
      observer?.disconnect();
      observer = new ResizeObserver(() => measureContent());
      observer.observe(root);
    };
    iframe.addEventListener("load", attach);
    return () => {
      iframe.removeEventListener("load", attach);
      observer?.disconnect();
    };
  }, [measureContent, src]);

  useEffect(() => {
    measureContent();
  }, [frameWidth, measureContent]);

  function currentFrameWidth(): number {
    return iframeRef.current?.offsetWidth || frameWidth;
  }

  function onHandlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, width: currentFrameWidth() };
  }

  function onHandlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = dragStart.current;
    if (!start) return;
    setChosen(clampPreviewWidth(start.width + event.clientX - start.x));
  }

  function onHandlePointerUp() {
    dragStart.current = null;
  }

  function onHandleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 80 : 16;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setChosen(clampPreviewWidth(currentFrameWidth() - step));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setChosen(clampPreviewWidth(currentFrameWidth() + step));
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.toolbar} role="toolbar" aria-label="Preview width">
        <button
          type="button"
          className={styles.button}
          aria-pressed={chosen === null}
          onClick={() => setChosen(null)}
        >
          Fit
        </button>
        {presets.map((preset) => (
          <button
            key={preset.width}
            type="button"
            className={styles.button}
            aria-pressed={chosen === preset.width}
            onClick={() => setChosen(preset.width)}
          >
            {preset.label}
          </button>
        ))}
        <span className={styles.readout}>
          {frameWidth}px · {breakpoint}
        </span>
      </div>
      <div className={styles.viewport}>
        <div className={styles.scroller} ref={scrollerRef}>
          <div
            className={styles.stage}
            style={{ width: chosen === null ? "100%" : frameWidth }}
          >
            <iframe
              ref={iframeRef}
              className={styles.frame}
              src={src}
              title={title}
              style={{
                width: chosen === null ? "100%" : frameWidth,
                height: frameHeight,
              }}
            />
          </div>
        </div>
        <div
          className={styles.handle}
          style={{ left: handleLeft }}
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          aria-valuemin={320}
          aria-valuemax={1536}
          aria-valuenow={frameWidth}
          aria-label="Drag to resize the preview"
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerUp}
          onPointerCancel={onHandlePointerUp}
          onKeyDown={onHandleKeyDown}
        />
      </div>
    </div>
  );
}
