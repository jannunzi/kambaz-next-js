import Images from "@/app/labs/lab1/Images";
import LectureDemoFrame from "./LectureDemoFrame";

export default function ImagesEmbed() {
  return (
    <LectureDemoFrame label="Images.tsx" url="/labs/lab1">
      <div className="font-sans text-lg [&_h4]:mt-0 [&_img]:max-w-full">
        <Images />
      </div>
    </LectureDemoFrame>
  );
}
