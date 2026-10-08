import Link from "next/link";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" />
      <br />
      <br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
        your Web application running on Vercel.
      </textarea>
      <br />
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>
          {/* ...remaining fields from Chapter 1... */}
        </tbody>
      </table>
      <br />
      <Link href="/courses/1234/assignments" id="wd-cancel">Cancel</Link>{" "}
      <Link href="/courses/1234/assignments" id="wd-save">Save</Link>
    </div>
  );
}
