import Link from "next/link";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import CourseInfoSection from "@/app/course-info/CourseInfoSection";

export default function TermsPage() {
  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Terms of Service"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            Effective date: October 7, 2026
          </p>
        }
      />

      <CourseInfoSection id="agreement" title="Agreement">
        <p>
          These terms cover your use of kambaz.dev (the &quot;site&quot;) and
          the WebDevTV Uploader YouTube integration. By using the site you
          agree to these terms and to the{" "}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree,
          please do not use the site.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="about" title="About the site">
        <p>
          kambaz.dev is Jose Annunziato&apos;s course website for the
          Northeastern University web development courses CS 4550 and CS 5610.
          It hosts the online book, slides, videos, labs, assignments and
          their automated checkers, quizzes, and grading tools. It is run by
          Jose Annunziato, not by Northeastern University, and is not an
          official Northeastern service. Northeastern policies still apply to
          students enrolled in the courses.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="accounts" title="Accounts">
        <p>
          Anyone may read the public pages. Some features, such as graded
          quizzes and assignment submissions, need an account, and graded
          quizzes are open only to students on the course roster. Sign-in is
          handled by Clerk.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Give accurate information. Use your Northeastern email address so
            your account matches the course roster.
          </li>
          <li>
            Use one account, and only your own. Do not share your account or
            sign in as someone else.
          </li>
          <li>
            Keep your password secure. If course staff create your account
            with a temporary password, change it when asked.
          </li>
          <li>
            Tell course staff right away if you think someone else has used
            your account.
          </li>
        </ul>
      </CourseInfoSection>

      <CourseInfoSection id="acceptable-use" title="Acceptable use">
        <p>When you use the site, do not:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Cheat, or share quiz or exam questions or answers with anyone, on
            this site or anywhere else.
          </li>
          <li>
            Submit work that is not your own, except as the course syllabus
            allows.
          </li>
          <li>
            Attack, probe, overload, or try to break into the site, its
            accounts, or its data.
          </li>
          <li>
            Try to trick, reverse-engineer, or abuse the automated checkers and
            graders, or submit code or links meant to harm them.
          </li>
          <li>
            Scrape or bulk-download the site, or use bots to submit work or
            take quizzes.
          </li>
          <li>Impersonate another student, course staff, or anyone else.</li>
          <li>Break the law or the rights of others.</li>
        </ul>
      </CourseInfoSection>

      <CourseInfoSection id="academic-integrity" title="Academic integrity">
        <p>
          The <Link href="/syllabus">course syllabus</Link>, including its AI
          policy, and the{" "}
          <a href="https://catalog.northeastern.edu/handbook/policies-regulations/academic-integrity/">
            Northeastern Academic Integrity Policy
          </a>{" "}
          decide what help is allowed on coursework and what happens when
          those rules are broken. Nothing in these terms loosens them.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="your-work" title="Your work and submissions">
        <p>
          You keep ownership of the work you submit, such as code, GitHub
          repository links, deployed site URLs, and quiz answers. You give
          Jose Annunziato and course staff permission to store, copy, run,
          view, and grade that work, and to share it with the services listed
          below, only as needed to run the course. Automated checkers may
          visit the links you submit. A coding answer the local grader cannot
          score may be sent to xAI for grading when that service is
          configured.
        </p>
        <p>
          Only submit work you have the right to share. Do not put passwords,
          API keys, or other secrets in submitted code or public repositories.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="course-materials" title="Course materials">
        <p>
          The book, slides, videos, labs, assignments, quizzes, and code
          samples on the site are created by Jose Annunziato, who owns them
          and keeps all rights. They are not released under an open-source
          license. You may use them for your own learning, and you may use and
          adapt the code samples in your coursework. Do not republish, sell,
          or redistribute the materials without permission. Names and logos
          of other products belong to their owners.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="third-party" title="Third-party services and links">
        <p>
          The site relies on Clerk for sign-in, Vercel for hosting, and
          MongoDB Atlas for data. It links to and embeds content from other
          services, including YouTube, GitHub, and Google. Each of those
          services has its own terms and privacy policy, which apply when you
          use them. The site does not control them and is not responsible for
          their content or availability.
        </p>
        <p>
          Some book recommendations use Amazon affiliate links. As an Amazon
          Associate I earn from qualifying purchases. Those books are optional
          reading and are never required for the course.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="youtube" title="YouTube API Services">
        <p>
          The site uses YouTube API Services to show related videos, and the
          WebDevTV Uploader uses them to upload and manage videos on the
          @WebDevTV YouTube channel. By using those features you agree to be
          bound by the{" "}
          <a href="https://www.youtube.com/t/terms">YouTube Terms of Service</a>
          . See the{" "}
          <a href="https://policies.google.com/privacy">
            Google Privacy Policy
          </a>{" "}
          and this site&apos;s <Link href="/privacy">Privacy Policy</Link> for
          how that information is handled.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="no-warranty" title="Availability and no warranty">
        <p>
          The site is provided &quot;as is&quot; and &quot;as available.&quot;
          It may change, be slow, go offline, or contain mistakes, including
          in automated checker and grader results. If you think a score is
          wrong, tell course staff as the syllabus describes. To the fullest
          extent the law allows, Jose Annunziato makes no warranties of any
          kind, express or implied, about the site.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="liability" title="Limitation of liability">
        <p>
          To the fullest extent the law allows, Jose Annunziato is not liable
          for any indirect, incidental, special, or consequential damages, or
          for any loss of data, that comes from your use of the site or from
          not being able to use it. Keep your own copies of your work.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="termination" title="Suspension and termination">
        <p>
          Access may be suspended or ended for anyone who breaks these terms
          or puts the site or other users at risk. Possible academic
          integrity violations are handled under the syllabus and Northeastern
          policy. You may stop using the site at any time.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="changes" title="Changes to these terms">
        <p>
          These terms may be updated. The new version will be posted on this
          page with a new effective date. Using the site after a change means
          you accept the updated terms.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="governing-law" title="Governing law">
        <p>
          These terms are governed by the laws of the Commonwealth of
          Massachusetts, United States.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="contact" title="Contact">
        <p>
          <a href="mailto:jannunzi@gmail.com">jannunzi@gmail.com</a>
        </p>
      </CourseInfoSection>

      <CourseInfoFooter current="/terms" />
    </article>
  );
}
