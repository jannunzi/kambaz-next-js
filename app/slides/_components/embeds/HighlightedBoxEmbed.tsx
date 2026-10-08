import HighlightedBox from "@/app/labs/lab1/HighlightedBox";
import LectureDemoFrame from "./LectureDemoFrame";

export default function HighlightedBoxEmbed() {
  return (
    <LectureDemoFrame label="HighlightedBox.tsx" url="/labs/lab1">
      <div className="font-sans text-lg [&_h3]:mt-0 [&_h4]:mt-0">
        <HighlightedBox />
      </div>
    </LectureDemoFrame>
  );
}
