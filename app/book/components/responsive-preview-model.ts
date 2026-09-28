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
export const TAILWIND_RESPONSIVE_BREAKPOINT_PREVIEW_SRC =
  "/preview/tailwind-responsive-breakpoint";
export const TAILWIND_RESPONSIVE_SHOW_HIDE_PREVIEW_SRC =
  "/preview/tailwind-responsive-show-hide";
export const TAILWIND_RESPONSIVE_FLEX_PREVIEW_SRC =
  "/preview/tailwind-responsive-flex";
export const TAILWIND_RESPONSIVE_GRID_PREVIEW_SRC =
  "/preview/tailwind-responsive-grid";
export const TAILWIND_RESPONSIVE_SPACING_TEXT_PREVIEW_SRC =
  "/preview/tailwind-responsive-spacing-text";
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

/** Phone stays below `md`. Desktop is `lg`, so `md:` applies. */
export const TAILWIND_BREAKPOINT_PREVIEW_FRAMES: PreviewFrame[] = [
  {
    width: 375,
    label: "Phone, 375px: red",
    title: "Phone preview, red box",
  },
  {
    width: 1024,
    label: "Desktop, 1024px: green",
    title: "Desktop preview, green box",
  },
];

/** Phone stays below `md`. Desktop is `lg`, so `md:` applies. */
export const TAILWIND_SHOW_HIDE_PREVIEW_FRAMES: PreviewFrame[] = [
  {
    width: 375,
    label: "Phone, 375px: small screen",
    title: "Phone preview, small screen line",
  },
  {
    width: 1024,
    label: "Desktop, 1024px: large screen",
    title: "Desktop preview, large screen line",
  },
];

/** Phone stays below `md`. Desktop is `lg`, so `md:flex-row` applies. */
export const TAILWIND_FLEX_PREVIEW_FRAMES: PreviewFrame[] = [
  {
    width: 375,
    label: "Phone, 375px: stacked",
    title: "Phone preview, stacked boxes",
  },
  {
    width: 1024,
    label: "Desktop, 1024px: side by side",
    title: "Desktop preview, boxes in a row",
  },
];

/**
 * Phone is below `sm` (1 column). 700px is `sm` but not `lg` (2 columns).
 * Desktop is `lg` (4 columns).
 */
export const TAILWIND_GRID_PREVIEW_FRAMES: PreviewFrame[] = [
  {
    width: 375,
    label: "Phone, 375px: 1 column",
    title: "Phone preview, one column",
  },
  {
    width: 700,
    label: "700px: 2 columns",
    title: "700px preview, two columns",
  },
  {
    width: 1024,
    label: "Desktop, 1024px: 4 columns",
    title: "Desktop preview, four columns",
  },
];

/** Phone stays below `md`. Desktop is `lg`, so `md:p-8` and `md:text-2xl` apply. */
export const TAILWIND_SPACING_TEXT_PREVIEW_FRAMES: PreviewFrame[] = [
  {
    width: 375,
    label: "Phone, 375px: compact",
    title: "Phone preview, compact padding and text",
  },
  {
    width: 1024,
    label: "Desktop, 1024px: larger type",
    title: "Desktop preview, larger padding and text",
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
