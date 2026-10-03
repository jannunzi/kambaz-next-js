import Link from "next/link";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import CourseInfoSection from "@/app/course-info/CourseInfoSection";
import AcademicCalendarTable from "@/app/syllabus/components/AcademicCalendarTable";
import { academicCalendarIntro } from "@/app/syllabus/data/academicCalendar";
import { quizWeekOfLabel } from "@/lib/quiz-exam/schedule";
import { holidayMeetingNote } from "@/app/syllabus/data/holidays";

export default function AcademicCalendarPage() {
  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Academic Calendar"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            Fall 2026 university dates that affect this course. All times are
            America/New_York (Eastern Time).
          </p>
        }
      />

      <CourseInfoSection id="dates" title="Registrar dates">
        <p>{academicCalendarIntro}</p>
        <p>{holidayMeetingNote}</p>
        <p>
          Chapter weeks and meeting days are on the{" "}
          <Link href="/syllabus#agenda">syllabus agenda</Link>. Quiz weeks are
          on{" "}
          <Link href="/syllabus#deadlines">shared deadlines</Link>. Q1 is the
          week of {quizWeekOfLabel("q1")}. This table is the university
          calendar, not a replacement for section meetings.
        </p>
        <AcademicCalendarTable />
      </CourseInfoSection>

      <CourseInfoFooter />
    </article>
  );
}
