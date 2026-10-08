import HighlightedParagraph from "@/app/labs/lab1/HighlightedParagraph";
import LectureDemoFrame from "./LectureDemoFrame";

export default function HighlightedParagraphEmbed() {
  return (
    <LectureDemoFrame label="HighlightedParagraph.tsx" url="/labs/lab1">
      <div className="font-sans text-lg [&_h3]:mt-0">
        <HighlightedParagraph />
      </div>
    </LectureDemoFrame>
  );
}
