"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  TAILWIND_PREVIEW_FRAMES,
  type PreviewFrame,
} from "./responsive-preview-model";
import styles from "./responsive-preview.module.css";

/**
 * Two iframes at real viewport widths, shown together. The wide frame is
 * painted smaller with a CSS transform so it fits the book column; `md:`
 * and `@media (min-width)` still follow the iframe's own width.
 */
export default function ResponsivePreview({
  src,
  frames = TAILWIND_PREVIEW_FRAMES,
}: {
  src: string;
  frames?: PreviewFrame[];
}) {
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);
  const [heights, setHeights] = useState<number[]>(() => frames.map(() => 640));

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    frames.forEach((_, index) => {
      const iframe = iframeRefs.current[index];
      if (!iframe) return;
      let observer: ResizeObserver | undefined;
      const measure = () => {
        const doc = iframe.contentDocument;
        const root = doc?.getElementById("preview-root");
        const height = root?.scrollHeight ?? doc?.body?.scrollHeight ?? 0;
        if (height <= 0) return;
        const next = Math.ceil(height) + 2;
        setHeights((prev) => {
          if (prev[index] === next) return prev;
          const copy = prev.slice();
          copy[index] = next;
          return copy;
        });
      };
      const attach = () => {
        measure();
        const root = iframe.contentDocument?.getElementById("preview-root");
        if (!root) return;
        observer?.disconnect();
        observer = new ResizeObserver(() => measure());
        observer.observe(root);
      };
      iframe.addEventListener("load", attach);
      attach();
      cleanups.push(() => {
        iframe.removeEventListener("load", attach);
        observer?.disconnect();
      });
    });
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [frames, src]);

  return (
    <div className={styles.pair}>
      {frames.map((frame, index) => (
        <div
          key={frame.width}
          className={`${styles.pane} ${frame.width < 768 ? styles.phone : styles.desktop}`}
        >
          <p className={styles.label}>{frame.label}</p>
          <div
            className={styles.scaler}
            style={
              {
                "--frame-width": `${frame.width}px`,
                "--frame-height": `${heights[index] ?? 640}px`,
              } as CSSProperties
            }
          >
            <div className={styles.slot}>
              <iframe
                ref={(node) => {
                  iframeRefs.current[index] = node;
                }}
                className={styles.frame}
                src={src}
                title={frame.title}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
