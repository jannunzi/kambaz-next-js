import LabsNameGithub from "@/app/labs/lab1/intermediates/1-5-LabsNameGithub";
import LectureDemoFrame from "./LectureDemoFrame";

export default function LabsNameGithubEmbed() {
  return (
    <LectureDemoFrame label="app/labs/page.tsx" url="/labs">
      <div className="font-sans text-xl [&_h1]:mt-0 [&_a]:underline">
        <LabsNameGithub />
      </div>
    </LectureDemoFrame>
  );
}
