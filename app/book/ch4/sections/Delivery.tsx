import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import Link from "next/link";
import HandInLink from "../../components/HandInLink";

export default function Delivery() {
  return (
    <Section id="sec-4-12" title="4.12 Delivery">
      <p>
        In the same Next.js application created in earlier chapters,{" "}
        <code>webdev-client</code>, complete all the exercises described
        in this chapter — the Lab 4 components and the stateful Kambaz
        screens in <SectionLink to="4.10" />. Submit the work as a new
        branch on the same repository and Vercel project from earlier
        chapters, so graders can compare <ChapterLink to={3} />&apos;s
        data-driven screens against this chapter&apos;s client state side
        by side. Do not open a second repository and do not deploy to a
        different host. The preview URL for branch{" "}
        <code>a4</code>{" "}should sit next to your{" "}
        <code>a3</code>{" "}deployment so a grader can open both.
      </p>
      <ol>
        <li>
          Finish every exercise described in this chapter inside the same{" "}
          <code>webdev-client</code>{" "}project used in <ChapterLink to={1} />
          , <ChapterLink to={2} />, and <ChapterLink to={3} />. That
          includes the Lab 4 event, form, Context, and Zustand practice
          components and the Kambaz stores, dashboard CRUD, module
          dialog, account context, and the On-your-own assignment and
          enrollment work. Confirm the screens in the browser on
          localhost before you branch.
        </li>
        <li>
          Create a branch named <code>a4</code>, then add, commit, and
          push it to the same GitHub repository from{" "}
          <SectionLink to="1.5" />. Work on{" "}
          <code>a4</code>{" "}for the rest of the chapter so the{" "}
          <code>a3</code>{" "}branch stays a snapshot of the data-driven
          screens. Here is an example of how to add, commit, and push
          your code:
        </li>
      </ol>
      <CodeBlock language="shell">{`git checkout -b a4
git add .
git commit -am "a4 client state"
git push -u origin a4`}</CodeBlock>
      <ol start={3}>
        <li>
          Deploy the <code>a4</code>{" "}branch to the same Vercel project
          created in an earlier chapter. Configure the project to deploy
          every branch to its own URL: open the project&apos;s{" "}
          <strong>Settings → Git</strong>{" "}and enable deployments for
          all branches (some Vercel plans expose this under{" "}
          <strong>Build & Deployment → Branches</strong>). From then on,
          each push to <code>a4</code>{" "}gets its own preview URL that
          contains the branch name, separate from your{" "}
          <ChapterLink to={3} />{" "}
          <code>a3</code>{" "}deployment. Confirm the preview loads and
          that you can sign in, add a course, and add a module on that
          URL — not only on localhost.
        </li>
        <li>
          Confirm <code>app/labs/TOC.tsx</code>{" "}and{" "}
          <code>app/labs/page.tsx</code>{" "}still list every lab and
          Kambaz, plus a link to your GitHub repository with id{" "}
          <code>wd-github</code>{" "}and your full name (first name first,
          last name second, matching Canvas) on the Labs page — the same
          requirements from <SectionLink to="1.7" />, now revisited for
          this chapter. Style the Labs table of contents with the
          existing Tailwind pills; do not switch the course navigation
          to a different CSS framework for this deliverable.
        </li>
        <li>
          Push any remaining changes to the <code>a4</code>{" "}branch and
          confirm the branch deployment on Vercel reflects them. If you
          fixed a store or a button after the first push, wait for the
          new preview to finish building before you copy the URL.
        </li>
        <li>
          On <HandInLink id="a4" />{" "}(not in Canvas), submit both the
          GitHub repository URL (pointed at the <code>a4</code>{" "}branch)
          and the Vercel deployment URL for that branch. Disable Vercel&apos;s Deployment Protection
          on that deployment, as in <SectionLink to="1.6" />, so graders
          can open it without signing in. A protected preview that
          redirects to a Vercel login will not be graded as a working
          site.
        </li>
      </ol>
      <p>
        Continue practicing in{" "}
        <Link href="/labs">Labs</Link>, browse{" "}
        <Link href="/labs/lab4/intermediates">Lab 4 intermediate steps</Link>
        , or open the live{" "}
        <Link href="/account/signin">Kambaz</Link>{" "}prototype to create
        courses and modules from the Zustand stores.
      </p>
    </Section>
  );
}
