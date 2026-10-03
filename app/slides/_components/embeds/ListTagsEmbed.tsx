import ListTags from "@/app/labs/lab1/ListTags";
import LectureDemoFrame from "./LectureDemoFrame";

export default function ListTagsEmbed() {
  return (
    <LectureDemoFrame label="ListTags.tsx" url="/labs/lab1">
      <div className="font-sans text-lg [&_h4]:mt-0 [&_h5]:mt-3">
        <ListTags />
      </div>
    </LectureDemoFrame>
  );
}
