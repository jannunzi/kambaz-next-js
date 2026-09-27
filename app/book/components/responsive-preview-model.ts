/** Width presets and breakpoint labels for the book responsive preview. */

export type WidthPreset = {
  label: string;
  width: number;
};

export type Breakpoint = {
  label: string;
  minWidth: number;
};

export const PREVIEW_MIN_WIDTH = 320;
export const PREVIEW_MAX_WIDTH = 1536;

/** Tailwind default screens, plus a phone width below `sm`. */
export const TAILWIND_WIDTH_PRESETS: WidthPreset[] = [
  { label: "Phone 375", width: 375 },
  { label: "sm 640", width: 640 },
  { label: "md 768", width: 768 },
  { label: "lg 1024", width: 1024 },
  { label: "xl 1280", width: 1280 },
];

export const TAILWIND_BREAKPOINTS: Breakpoint[] = [
  { label: "base", minWidth: 0 },
  { label: "sm", minWidth: 640 },
  { label: "md", minWidth: 768 },
  { label: "lg", minWidth: 1024 },
  { label: "xl", minWidth: 1280 },
  { label: "2xl", minWidth: 1536 },
];

/**
 * Widths inside each range of MediaQueriesDemo.css.
 * The queries share their edges (1000px and 1250px match two blocks), so the
 * presets sit strictly inside a range and only one checklist bullet is active.
 */
export const MEDIA_QUERY_WIDTH_PRESETS: WidthPreset[] = [
  { label: "Phone 375", width: 375 },
  { label: "800", width: 800 },
  { label: "1100", width: 1100 },
  { label: "1300", width: 1300 },
];

export const MEDIA_QUERY_BREAKPOINTS: Breakpoint[] = [
  { label: "default", minWidth: 0 },
  { label: "750–1000", minWidth: 750 },
  { label: "1000–1250", minWidth: 1000 },
  { label: "1250+", minWidth: 1250 },
];

export const TAILWIND_RESPONSIVE_PREVIEW_SRC = "/preview/tailwind-responsive";
export const MEDIA_QUERIES_PREVIEW_SRC = "/preview/media-queries";

/** One static iframe. `width` is the iframe viewport, not the painted size. */
export type PreviewFrame = {
  width: number;
  label: string;
  title: string;
};

/** Phone stays below `md`. Desktop is `lg`, so `md:` and `lg:` both apply. */
export const TAILWIND_PREVIEW_FRAMES: PreviewFrame[] = [
  {
    width: 375,
    label: "Phone, 375px: stacked",
    title: "Phone preview, stacked card",
  },
  {
    width: 1024,
    label: "Desktop, 1024px: side by side",
    title: "Desktop preview, side-by-side card",
  },
];

/**
 * 375px is the default green range. 1024px is inside 1000–1250 (blue),
 * clear of the shared edges at 1000px and 1250px.
 */
export const MEDIA_QUERY_PREVIEW_FRAMES: PreviewFrame[] = [
  {
    width: 375,
    label: "Phone, 375px: green",
    title: "Phone preview, green background",
  },
  {
    width: 1024,
    label: "Desktop, 1024px: blue",
    title: "Desktop preview, blue background",
  },
];

export function clampPreviewWidth(width: number): number {
  return Math.min(
    PREVIEW_MAX_WIDTH,
    Math.max(PREVIEW_MIN_WIDTH, Math.round(width)),
  );
}

/** Largest breakpoint whose min width is still within `width`. */
export function activeBreakpoint(width: number, breakpoints: Breakpoint[]): string {
  let label = breakpoints[0]?.label ?? "";
  for (const breakpoint of breakpoints) {
    if (width >= breakpoint.minWidth) label = breakpoint.label;
  }
  return label;
}
