import HeadingTags from "@/app/labs/lab1/HeadingTags";
import LectureDemoFrame from "./LectureDemoFrame";

export default function HeadingPracticeEmbed() {
  return (
    <LectureDemoFrame label="HeadingTags.tsx" url="/labs/lab1">
      <div className="font-sans text-lg [&_h4]:mt-0">
        <HeadingTags />
        <h1>h1</h1>
        <h2>h2</h2>
        <h3>h3</h3>
        <h4>h4</h4>
        <h5>h5</h5>
        <h6>h6</h6>
      </div>
    </LectureDemoFrame>
  );
}
