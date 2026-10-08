import Link from "next/link";
import { formatSectionMeetsSentence } from "../data/dates";
import type { CourseInfo, CourseSection } from "../data/types";

function levelLabel(level: CourseSection["level"]): string {
  return level === "undergraduate" ? "Undergrad" : "Grad";
}

function modalityLabel(modality: CourseSection["modality"]): string {
  return modality === "in-person" ? "In person" : "Online";
}

export default function SyllabusHeader({
  course,
  section,
}: {
  course: CourseInfo;
  section: CourseSection;
}) {
  return (
    <header id="overview" className="scroll-mt-32 mb-6">
      <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
        {course.college}
      </p>
      <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
        {section.code}-{section.sectionNumber} {course.title}
      </h1>
      <p className="mt-2 text-lg text-neutral-700">
        CRN {section.crn} · {levelLabel(section.level)} ·{" "}
        {modalityLabel(section.modality)} · {section.campus} · {course.term} ·{" "}
        {course.credits} credits
      </p>
      <p className="text-neutral-600">
        {course.instructor.name}
        {" · "}
        <a href={`mailto:${course.instructor.email}`}>{course.instructor.email}</a>
      </p>
      <p className="mt-4 text-[1.05rem] text-neutral-800">
        Companion to{" "}
        <Link href="/book">{course.bookTitle}</Link>.{" "}
        <Link href="#book">How to use the book</Link>
        {". "}
        <Link href="#accounts">Course website accounts</Link>
        {" (Sign up first with your Canvas email — this site is not Canvas). "}
        {formatSectionMeetsSentence(section.daysOfWeek, section.firstClass)}{" "}
        <Link href="#meetings">Lecture recordings</Link> appear in Canvas →
        Zoom Meetings → Cloud Recordings after each lecture finishes
        processing (an empty list before or during the class day is
        expected). They are available to enrolled students for a
        legitimate absence — not as a replacement for class.
      </p>
    </header>
  );
}
