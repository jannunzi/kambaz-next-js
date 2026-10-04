import Modules from "../modules/page";
import CourseStatus from "./Status";

export default function Home() {
  return (
    <div id="wd-home" className="flex gap-4">
      <div className="min-w-0 flex-1">
        <Modules />
      </div>
      <div className="hidden w-[250px] shrink-0 lg:block">
        <CourseStatus />
      </div>
    </div>
  );
}
