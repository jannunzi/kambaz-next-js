import Link from "next/link";

export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <h2>Jose Annunziato</h2>
      <p>CS4550 Section 01</p>
      <ul>
        <li>
          <Link href="/labs/lab1">Lab 1: HTML Examples</Link>
        </li>
        <li>
          <Link href="/labs/lab2">Lab 2: CSS Basics</Link>
        </li>
        <li>
          <Link href="/labs/lab3">Lab 3: JavaScript Fundamentals</Link>
        </li>
        {/* your Lab 4 / Lab 5 links */}
        <li>
          <Link href="/" id="wd-kambaz-link">
            Kambaz
          </Link>
        </li>
        <li>
          <a
            href="https://github.com/jannunzi/webdev-client"
            id="wd-github"
            target="_blank"
            rel="noreferrer"
          >
            GitHub repository
          </a>
        </li>
      </ul>
    </div>
  );
}
