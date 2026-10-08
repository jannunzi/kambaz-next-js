import Link from "next/link";

export default function AccountNavigation() {
  return (
    <div id="wd-account-navigation">
      <Link href="/account/signin">Signin</Link> <br />
      <Link href="/account/signup">Signup</Link> <br />
      <Link href="/account/profile">Profile</Link> <br />
    </div>
  );
}
