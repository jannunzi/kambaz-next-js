import Link from "next/link";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import CourseInfoSection from "@/app/course-info/CourseInfoSection";

export default function PrivacyPage() {
  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Privacy Policy"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            Last updated: October 6, 2026
          </p>
        }
      />

      <CourseInfoSection
        id="youtube"
        title="WebDevTV Uploader (YouTube integration)"
      >
        <p>
          This app is used only by Jose Annunziato (
          <a href="mailto:jannunzi@gmail.com">jannunzi@gmail.com</a>) to upload
          and manage videos on his own @WebDevTV YouTube channel. It uses
          Google and YouTube API access only for that purpose. It does not
          collect, sell, or share personal data from other users. OAuth tokens
          are stored privately and can be revoked at any time at{" "}
          <a href="https://myaccount.google.com/permissions">
            https://myaccount.google.com/permissions
          </a>
          .
        </p>
        <p>
          Its use of information received from Google APIs complies with the{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements, and with the{" "}
          <a href="https://www.youtube.com/t/terms">
            YouTube API Services Terms of Service
          </a>
          . See also{" "}
          <a href="https://policies.google.com/privacy">
            Google&apos;s Privacy Policy
          </a>
          .
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="website" title="The kambaz.dev course website">
        <p>
          Sign-in is handled by Clerk, which keeps a session cookie. The site
          stores what students need for the course: account name and email,
          course roster and section, assignment submissions, and quiz attempts
          and grades. That information is used only to run Northeastern
          University courses taught by Jose Annunziato. It is not sold or
          shared beyond course staff and the services that host the site
          (Clerk for sign-in, Vercel for hosting, and MongoDB for data). A
          coding answer the local grader cannot score may also be sent to xAI
          for grading when that service is configured.
        </p>
      </CourseInfoSection>

      <CourseInfoSection id="contact" title="Contact">
        <p>
          <a href="mailto:jannunzi@gmail.com">jannunzi@gmail.com</a>
        </p>
        <p>
          See also the <Link href="/terms">Terms of Service</Link>.
        </p>
      </CourseInfoSection>

      <CourseInfoFooter current="/privacy" />
    </article>
  );
}
