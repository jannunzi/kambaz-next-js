import Link from "next/link";
import { COURSE_INFO_LINKS, type CourseInfoHref } from "./links";

export { COURSE_INFO_LINKS, isCourseInfoCurrent } from "./links";
export type { CourseInfoHref } from "./links";

export default function CourseInfoFooter({
  current,
}: {
  current?: CourseInfoHref | "/privacy";
}) {
  return (
    <nav
      aria-label="Course pages"
      className="mt-10 border-t border-neutral-200 pt-3 font-sans text-sm text-neutral-600"
    >
      {COURSE_INFO_LINKS.map((link, index) => (
        <span key={link.href}>
          {index > 0 ? " · " : null}
          {link.href === current ? (
            <span className="text-neutral-800">{link.label}</span>
          ) : (
            <Link href={link.href}>{link.label}</Link>
          )}
        </span>
      ))}
      {" · "}
      {current === "/privacy" ? (
        <span className="text-neutral-800">Privacy</span>
      ) : (
        <Link href="/privacy">Privacy</Link>
      )}
    </nav>
  );
}
