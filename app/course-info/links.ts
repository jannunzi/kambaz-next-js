export const COURSE_INFO_LINKS = [
  { href: "/syllabus", label: "Syllabus" },
  { href: "/book", label: "Book" },
  { href: "/blog", label: "Blog" },
  { href: "/slides", label: "Slides" },
  { href: "/videos", label: "Videos" },
  { href: "/assignments", label: "Assignments" },
  { href: "/labs", label: "Labs" },
  { href: "/account/signin", label: "Kambaz" },
  { href: "/office-hours", label: "Office Hours" },
  { href: "/project", label: "Project" },
] as const;

export type CourseInfoHref = (typeof COURSE_INFO_LINKS)[number]["href"];

export function isCourseInfoCurrent(
  pathname: string,
  href: CourseInfoHref,
): boolean {
  if (href === "/account/signin") {
    return pathname === "/account" || pathname.startsWith("/account/");
  }
  if (href === "/book") {
    return pathname === "/book" || pathname.startsWith("/book/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
