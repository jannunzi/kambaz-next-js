import Link from "next/link";

export default function AssignmentItem({
  cid,
  aid,
  title,
  details,
}: {
  cid: string;
  aid: string;
  title: string;
  details: string;
}) {
  return (
    <li className="wd-assignment-list-item">
      <Link
        href={`/courses/${cid}/assignments/${aid}`}
        className="wd-assignment-link"
      >
        {title}
      </Link>
      <div>{details}</div>
    </li>
  );
}
