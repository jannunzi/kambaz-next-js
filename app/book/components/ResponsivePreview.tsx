"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  TAILWIND_PREVIEW_FRAMES,
  type PreviewFrame,
} from "./responsive-preview-model";
import styles from "./responsive-preview.module.css";

/**
 * Iframes at real viewport widths, shown together. `contain` paints a wide
 * frame smaller so it fits the column. `natural` keeps CSS pixels and scrolls
 * sideways, so a larger font stays visually larger. `md:` and
 * `@media (min-width)` follow the iframe's own width either way.
 */
export default function ResponsivePreview({
  src,
  frames = TAILWIND_PREVIEW_FRAMES,
  fit = "contain",
}: {
  src: string;
  frames?: PreviewFrame[];
  fit?: "contain" | "natural";
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

  const natural = fit === "natural";

  return (
    <div className={natural ? `${styles.pair} ${styles.naturalPair}` : styles.pair}>
      {frames.map((frame, index) => {
        const height = heights[index] ?? 640;
        return (
          <div
            key={frame.width}
            className={
              natural
                ? `${styles.pane} ${styles.naturalPane}`
                : `${styles.pane} ${frame.width < 768 ? styles.phone : styles.desktop}`
            }
          >
            <p className={styles.label}>{frame.label}</p>
            {natural ? (
              <div className={styles.naturalScroll}>
                <iframe
                  ref={(node) => {
                    iframeRefs.current[index] = node;
                  }}
                  className={styles.naturalFrame}
                  style={{ width: frame.width, height }}
                  src={src}
                  title={frame.title}
                />
              </div>
            ) : (
              <div
                className={styles.scaler}
                style={
                  {
                    "--frame-width": `${frame.width}px`,
                    "--frame-height": `${height}px`,
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
            )}
          </div>
        );
      })}
    </div>
  );
}
