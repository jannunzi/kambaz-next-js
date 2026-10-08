import DemoSignin from "./DemoSignin";
import DemoSignup from "./DemoSignup";
import DemoProfile from "./DemoProfile";
import AccountNavigation from "./_styled/AccountNavigation";

/** Account screens side-by-side for §1.4.2 — book stubs, not live auth pages. */
export default function AccountScreensDemo() {
  return (
    <table width="100%">
      <tbody>
        <tr>
          <td valign="top" width="25%">
            <AccountNavigation />
          </td>
          <td valign="top" width="25%">
            <DemoSignin />
          </td>
          <td valign="top" width="25%">
            <DemoSignup />
          </td>
          <td valign="top" width="25%">
            <DemoProfile />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
