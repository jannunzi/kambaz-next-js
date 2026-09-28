import ConnectionStatus from "./intermediates/6-2-1-Connection";
import Lab6Todos from "./intermediates/6-2-5-Todos";
import Lab6Users from "./intermediates/6-2-6-Users";

export default function Lab6() {
  return (
    <div id="wd-lab6">
      <h2>Lab 6</h2>
      <p>
        Programming MongoDB with Mongoose. The demos call same-origin{" "}
        <code>/api/lab6</code> so they render without a local{" "}
        <code>mongod</code>. The sibling Express server implements the
        same routes with Mongoose when{" "}
        <code>DATABASE_CONNECTION_STRING</code> is set, and the
        Chapter 5 in-memory arrays otherwise.
      </p>
      <ConnectionStatus />
      <Lab6Todos />
      <Lab6Users />
    </div>
  );
}
