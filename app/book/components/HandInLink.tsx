import { handInUrl, type HandInAssignmentId } from "./hand-in";

/** Link to the kambaz.dev assignment page where students hand in A1–A6.
 *  Always absolute (https://kambaz.dev) so the backup vercel.app host,
 *  where sign-in and submit do not work, still sends students to kambaz.dev.
 *  Mid-sentence: use `{" "}` after the tag.
 */
export default function HandInLink({
  id,
  className = "text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900",
}: {
  id: HandInAssignmentId;
  className?: string;
}) {
  const url = handInUrl(id);
  return (
    <a href={url} className={className}>
      {url.replace(/^https:\/\//, "")}
    </a>
  );
}
