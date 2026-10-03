/** Clip rules for a live-demo frame. The presenter audit uses the same
 * thresholds: a scroller that is not overflow:visible, or a descendant
 * whose box sticks out of the frame. */

export type DemoScrollBox = {
  scrollHeight: number;
  clientHeight: number;
  scrollWidth: number;
  clientWidth: number;
  overflowX: string;
  overflowY: string;
};

export type DemoBoxPast = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const SCROLL_SLACK_PX = 2;
const BOX_SLACK_PX = 1;

export function demoScrollClips(box: DemoScrollBox): boolean {
  const clipsY =
    box.scrollHeight > box.clientHeight + SCROLL_SLACK_PX &&
    box.overflowY !== "visible";
  const clipsX =
    box.scrollWidth > box.clientWidth + SCROLL_SLACK_PX &&
    box.overflowX !== "visible";
  return clipsY || clipsX;
}

export function demoBoxOverflows(past: DemoBoxPast): boolean {
  return Math.max(past.top, past.right, past.bottom, past.left) > BOX_SLACK_PX;
}

export function demoFrameClips(input: {
  scrolls: DemoScrollBox[];
  boxes: DemoBoxPast[];
}): boolean {
  return input.scrolls.some(demoScrollClips) || input.boxes.some(demoBoxOverflows);
}

/** css-box-model slide 11, Live Margins.tsx (`css-margins`). Presenter
 * measurement at 1280×800 and 1920×1080 before the frame grew: `max-h-72`
 * held the demo at 288px while the three margin boxes were 590px tall, and
 * the last box (margin on every side) stuck out of the frame. */
export const MARGINS_LIVE_CLIP_BEFORE = {
  slug: "css-box-model",
  slide: 11,
  id: "margins-live",
  embed: "css-margins",
  scrolls: [
    {
      scrollHeight: 590,
      clientHeight: 288,
      scrollWidth: 1178,
      clientWidth: 1178,
      overflowX: "auto",
      overflowY: "auto",
    },
  ],
  boxes: [
    { top: -66.3, right: -38.6, bottom: 251.5, left: -23.6 },
    { top: -306.1, right: -88.6, bottom: 51.5, left: -73.6 },
  ],
};
