import Link from "next/link";
import { COURSE_WEBSITE_ACCOUNT_COPY } from "@/lib/course-site/account-copy";

export default function CourseWebsiteAccountNote({
  variant,
}: {
  variant: "syllabus" | "sign-in" | "sign-up";
}) {
  if (variant === "syllabus") {
    return (
      <>
        <aside
          role="note"
          aria-label={COURSE_WEBSITE_ACCOUNT_COPY.heading}
          className="rounded-lg border-2 border-sky-400 bg-sky-50 px-4 py-3 text-sky-950"
        >
          <p className="m-0">{COURSE_WEBSITE_ACCOUNT_COPY.separateFromCanvas}</p>
          <p className="mb-0 mt-2">
            {COURSE_WEBSITE_ACCOUNT_COPY.notPreProvisioned}
          </p>
          <p className="mb-0 mt-2">
            {COURSE_WEBSITE_ACCOUNT_COPY.signUpThenSignIn}{" "}
            <Link href="/sign-up">Sign up</Link>
            {" · "}
            <Link href="/sign-in">Sign in</Link>.
          </p>
          <p className="mb-0 mt-2">{COURSE_WEBSITE_ACCOUNT_COPY.readOnlyBackup}</p>
        </aside>
        <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">
          <span className="font-sans font-semibold">Quizzes and site accounts. </span>
          {COURSE_WEBSITE_ACCOUNT_COPY.quizRosterSeparate}
        </p>
      </>
    );
  }

  const hint =
    variant === "sign-in"
      ? COURSE_WEBSITE_ACCOUNT_COPY.signInPageHint
      : COURSE_WEBSITE_ACCOUNT_COPY.signUpPageHint;
  const crossLink =
    variant === "sign-in" ? (
      <>
        <Link href="/sign-up">Sign up</Link>{" "}
        {COURSE_WEBSITE_ACCOUNT_COPY.signUpCtaSuffix}
      </>
    ) : (
      <>
        <Link href="/sign-in">Sign in</Link>{" "}
        {COURSE_WEBSITE_ACCOUNT_COPY.signInCtaSuffix}
      </>
    );

  return (
    <aside
      role="note"
      aria-label={COURSE_WEBSITE_ACCOUNT_COPY.heading}
      className="mb-4 max-w-md rounded-lg border-2 border-sky-400 bg-sky-50 px-4 py-3 text-left text-sm text-sky-950"
    >
      <p className="m-0 font-sans font-semibold">
        {COURSE_WEBSITE_ACCOUNT_COPY.heading}
      </p>
      <p className="mb-0 mt-1">{hint}</p>
      <p className="mb-0 mt-2">{crossLink}</p>
    </aside>
  );
}
