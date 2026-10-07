import Forms from "@/app/labs/lab1/forms/Forms";
import LectureDemoFrame from "./LectureDemoFrame";

export default function FormsEmbed() {
  return (
    <LectureDemoFrame label="Forms.tsx" url="/labs/lab1">
      <div className="font-sans text-lg [&_h4]:mt-0">
        <Forms />
      </div>
    </LectureDemoFrame>
  );
}
