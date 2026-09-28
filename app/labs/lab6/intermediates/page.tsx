import Link from "next/link";
import { LAB6_INTERMEDIATES } from "./index";

export default function Lab6IntermediatesIndex() {
  return (
    <div id="wd-lab6-intermediates">
      <h2>Lab 6 Intermediate Steps</h2>
      <p>
        Mongoose CRUD against the same-origin <code>/api/lab6</code>{" "}
        routes. Run{" "}
        <code>cd webdev-server && npm run dev</code>{" "}
        when you want the sibling server on port 4000.
      </p>
      <ul>
        <li>
          <Link href="/labs/lab6" id="wd-lab6-final-link">
            Final Lab 6 (complete)
          </Link>
        </li>
        {LAB6_INTERMEDIATES.map((step) => (
          <li key={step.slug}>
            <Link href={`/labs/lab6/intermediates/${step.slug}`}>
              {step.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
