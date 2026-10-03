import DiagramFrame from "./DiagramFrame";

const PREFIXES = [
  { x: 200, label: "640", prefix: "sm", detail: "40rem" },
  { x: 352, label: "768", prefix: "md", detail: "48rem" },
  { x: 504, label: "1024", prefix: "lg", detail: "64rem" },
  { x: 656, label: "1280", prefix: "xl", detail: "80rem" },
  { x: 808, label: "1536", prefix: "2xl", detail: "96rem" },
] as const;

const STOPS = [{ x: 48, label: "0" }, ...PREFIXES];

const LINE_END = 1000;

export default function TailwindBreakpointsDiagram() {
  return (
    <DiagramFrame label="Min-width prefixes">
      <svg
        role="img"
        viewBox="0 0 1040 460"
        className="mx-auto h-auto w-full"
        aria-labelledby="tw-breakpoint-title"
      >
        <title id="tw-breakpoint-title">
          Number line from 0 to 1536 pixels. sm starts at 640, md at 768, lg at 1024, xl at 1280, and 2xl at 1536. Each prefix applies from its mark through wider viewports.
        </title>
        <line
          x1="48"
          y1="78"
          x2={LINE_END - 16}
          y2="78"
          stroke="#171717"
          strokeWidth="4"
        />
        <polygon points={`${LINE_END},78 ${LINE_END - 18},70 ${LINE_END - 18},86`} fill="#171717" />
        {STOPS.map((stop) => (
          <g key={stop.label}>
            <line x1={stop.x} y1="62" x2={stop.x} y2="94" stroke="#171717" strokeWidth="3" />
            <text
              x={stop.x}
              y="48"
              textAnchor="middle"
              fill="#171717"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontSize="22"
              fontWeight="700"
            >
              {stop.label}
            </text>
          </g>
        ))}
        <text
          x="24"
          y="128"
          fill="#404040"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="18"
        >
          px
        </text>
        <g>
          <rect x="48" y="150" width={LINE_END - 48} height="40" rx="6" fill="#f5f5f5" stroke="#171717" />
          <text
            x="64"
            y="176"
            fill="#171717"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontSize="20"
            fontWeight="700"
          >
            unprefixed: every width
          </text>
        </g>
        {PREFIXES.map((stop, index) => {
          const y = 202 + index * 48;
          const fill = ["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#2563eb"][index];
          const ink = index === 4 ? "#ffffff" : "#171717";
          return (
            <g key={stop.prefix}>
              <rect
                x={stop.x}
                y={y}
                width={LINE_END - stop.x}
                height="40"
                rx="6"
                fill={fill}
                stroke="#171717"
              />
              <text
                x={stop.x + 12}
                y={y + 26}
                fill={ink}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontSize="20"
                fontWeight="700"
              >
                {`${stop.prefix} · ${stop.detail}`}
              </text>
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
