import Link from "next/link";
import { lectureChapterLabel, listLectureChapters } from "@/lib/lectures";

export default function LectureHubNav({
  current,
  editMode = false,
}: {
  current?: "index" | "deck";
  editMode?: boolean;
}) {
  const chapters = listLectureChapters();

  return (
    <p className="mb-3 font-sans text-sm">
      {current === "deck" ? (
        <>
          <Link href={editMode ? "/slides?edit=1" : "/slides"}>Slides</Link>
          {" · "}
        </>
      ) : null}
      <Link href="/syllabus">Syllabus</Link>
      {" · "}
      <Link href="/book">Course book</Link>
      {" · "}
      <Link href="/blog">Blog</Link>
      {chapters.map((chapter) => (
        <span key={chapter.chapter}>
          {" · "}
          <Link href={`/slides#chapter-${chapter.chapter}-heading`}>
            {lectureChapterLabel(chapter.chapter)}
          </Link>
        </span>
      ))}
      {" · "}
      <Link href="/assignments">Assignments</Link>
    </p>
  );
}
