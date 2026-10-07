import AssignmentItem from "./AssignmentItem";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return (
    <div id="wd-assignments">
      {/* search input, + Group, + Assignment */}
      {/* h3 wd-assignments-title */}
      <ul id="wd-assignment-list">
        <AssignmentItem
          cid={cid}
          aid="123"
          title="A1 - ENV + HTML"
          details="Multiple Modules | Due May 13 at 11:59pm | 100 pts"
        />
        {/* Add more assignments here (three recommended, like A2, A3), each linking to its editor */}
      </ul>
    </div>
  );
}
