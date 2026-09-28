import DiagramFrame from "./DiagramFrame";

/** Axis runs past 2xl so the last range is visible. Positions are px / 1700. */
const MAX_PX = 1700;
const VB_W = 1200;
const PAD_L = 56;
const PAD_R = 40;
const AXIS_Y = 96;
const LINE_END = VB_W - PAD_R;

const PREFIXES = [
  { px: 640, prefix: "sm", detail: "40rem" },
  { px: 768, prefix: "md", detail: "48rem" },
  { px: 1024, prefix: "lg", detail: "64rem" },
  { px: 1280, prefix: "xl", detail: "80rem" },
  { px: 1536, prefix: "2xl", detail: "96rem" },
] as const;

const TICKS = [{ px: 0, label: "0" }, ...PREFIXES.map((stop) => ({ px: stop.px, label: String(stop.px) }))];

function xOf(px: number) {
  return PAD_L + (px / MAX_PX) * (LINE_END - PAD_L);
}

export default function TailwindBreakpointsDiagram() {
  return (
    <DiagramFrame label="Min-width: the style applies when the viewport is at least that wide">
      <svg
        role="img"
        viewBox={`0 0 ${VB_W} 500`}
        className="mx-auto h-auto w-full"
        aria-labelledby="tw-breakpoint-title"
      >
        <title id="tw-breakpoint-title">
          Number line to scale from 0 to 1700 pixels. sm starts at 640, md at 768, lg at 1024, xl at 1280, and 2xl at 1536. Each prefix applies from its mark through wider viewports.
        </title>
        <line x1={xOf(0)} y1={AXIS_Y} x2={LINE_END - 16} y2={AXIS_Y} stroke="#171717" strokeWidth="4" />
        <polygon
          points={`${LINE_END},${AXIS_Y} ${LINE_END - 18},${AXIS_Y - 8} ${LINE_END - 18},${AXIS_Y + 8}`}
          fill="#171717"
        />
        {TICKS.map((tick) => {
          const x = xOf(tick.px);
          const stagger = tick.px === 768;
          return (
            <g key={tick.label}>
              <line x1={x} y1={AXIS_Y - 16} x2={x} y2={AXIS_Y + 16} stroke="#171717" strokeWidth="3" />
              <text
                x={x}
                y={stagger ? AXIS_Y + 44 : AXIS_Y - 28}
                textAnchor="middle"
                fill="#171717"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontSize="22"
                fontWeight="700"
              >
                {tick.label}
              </text>
            </g>
          );
        })}
        <text
          x={xOf(0)}
          y={AXIS_Y + 44}
          fill="#404040"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="18"
        >
          px
        </text>
        <g>
          <rect x={xOf(0)} y="168" width={LINE_END - xOf(0)} height="42" rx="6" fill="#f5f5f5" stroke="#171717" />
          <text
            x={xOf(0) + 12}
            y="196"
            fill="#171717"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontSize="20"
            fontWeight="700"
          >
            unprefixed: every width
          </text>
        </g>
        {PREFIXES.map((stop, index) => {
          const x = xOf(stop.px);
          const y = 222 + index * 50;
          const width = LINE_END - x;
          const fill = ["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#2563eb"][index];
          const ink = index === 4 ? "#ffffff" : "#171717";
          const label = `${stop.prefix} · ${stop.detail}`;
          const labelInside = width > 160;
          return (
            <g key={stop.prefix}>
              <rect x={x} y={y} width={width} height="42" rx="6" fill={fill} stroke="#171717" />
              <text
                x={labelInside ? x + 12 : x - 10}
                y={y + 27}
                textAnchor={labelInside ? "start" : "end"}
                fill={labelInside ? ink : "#171717"}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontSize="20"
                fontWeight="700"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
