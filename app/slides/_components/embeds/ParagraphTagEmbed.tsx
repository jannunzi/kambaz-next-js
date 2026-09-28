import ParagraphTag from "@/app/labs/lab1/ParagraphTag";
import LectureDemoFrame from "./LectureDemoFrame";

export default function ParagraphTagEmbed() {
  return (
    <LectureDemoFrame label="ParagraphTag.tsx" url="/labs/lab1">
      <div className="font-sans text-lg [&_h4]:mt-0">
        <ParagraphTag />
      </div>
    </LectureDemoFrame>
  );
}
