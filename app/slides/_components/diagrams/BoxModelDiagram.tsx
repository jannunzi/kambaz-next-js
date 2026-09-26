import DiagramFrame from "./DiagramFrame";

export default function BoxModelDiagram() {
  return (
    <DiagramFrame label="Box model — four layers">
      <svg
        viewBox="0 0 640 320"
        role="img"
        aria-label="Concentric margin, red border line, padding, and content boxes"
        className="mx-auto h-auto w-full max-w-3xl"
      >
        <rect width="640" height="320" fill="#FEF2F2" rx="8" />
        <text x="24" y="40" fill="#9F1239" fontSize="18" fontWeight="700">
          margin
        </text>
        <text
          x="320"
          y="36"
          textAnchor="middle"
          fill="#c41e3a"
          fontSize="16"
          fontWeight="700"
        >
          border
        </text>
        <line
          x1="320"
          y1="42"
          x2="320"
          y2="68"
          stroke="#c41e3a"
          strokeWidth="2"
        />
        <polygon points="314,66 326,66 320,76" fill="#c41e3a" />
        <rect x="40" y="84" width="560" height="208" fill="#DBEAFE" />
        <rect
          x="40"
          y="84"
          width="560"
          height="208"
          fill="none"
          stroke="#c41e3a"
          strokeWidth="16"
        />
        <text x="64" y="124" fill="#1E3A8A" fontSize="16" fontWeight="700">
          padding
        </text>
        <rect x="120" y="148" width="400" height="100" fill="#D1FAE5" rx="4" />
        <text
          x="320"
          y="206"
          textAnchor="middle"
          fill="#14532D"
          fontSize="18"
          fontWeight="800"
        >
          content
        </text>
      </svg>
    </DiagramFrame>
  );
}
