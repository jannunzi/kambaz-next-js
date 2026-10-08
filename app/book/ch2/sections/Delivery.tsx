import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import Link from "next/link";

export default function Delivery() {
  return (
    <Section id="sec-2-5" title="2.5 Delivery">
      <p>
        Submit this chapter&apos;s work as a new branch on the same{" "}
        <code>webdev-client</code>{" "}repository and deployment from Chapter
        1, so graders can compare <ChapterLink to={1} />&apos;s HTML-only prototype against
        this chapter&apos;s version styled with CSS and Tailwind, side by
        side.
      </p>
      <ol>
        <li>
          Finish every exercise described in this chapter inside the same{" "}
          <code>webdev-client</code>{" "}project used in <ChapterLink to={1} />.
        </li>
        <li>
          Create a branch named <code>a2</code>, then add, commit, and push
          it to the same GitHub repository from <SectionLink to="1.5" />:
        </li>
      </ol>
      <CodeBlock language="shell">{`git checkout -b a2
git add .
git commit -am "a2 CSS and Tailwind"
git push -u origin a2`}</CodeBlock>
      <ol start={3}>
        <li>
          Vercel builds every branch you push as a <strong>Preview</strong>{" "}
          deployment, separate from your <ChapterLink to={1} />{" "}
          <code>main</code>{" "}(Production) deployment; you don&apos;t need to
          change any setting. Open your project on Vercel, go to{" "}
          <strong>Deployments</strong>, and click the newest deployment of the{" "}
          <code>a2</code>{" "}branch. Its <strong>Domains</strong>{" "}list shows a{" "}
          <strong>branch URL</strong>{" "}like{" "}
          <code>webdev-client-git-a2-&lt;your-vercel-team&gt;.vercel.app</code>
          , with <code>-git-a2-</code>{" "}in the name. <strong>That branch URL
          is the one to submit for A2.</strong>{" "}It always shows the latest
          push to <code>a2</code>. Don&apos;t submit your production URL (that
          is your A1 site from <code>main</code>) or a per-deployment URL with
          a random code, such as{" "}
          <code>webdev-client-8f3k2j1x9-&lt;your-vercel-team&gt;.vercel.app</code>
          ; neither one contains <code>-git-a2-</code>.
        </li>
        <li>
          Confirm <code>app/labs/TOC.tsx</code>{" "}and{" "}
          <code>app/labs/page.tsx</code>{" "}still list every lab and Kambaz,
          plus a link to your GitHub repository with id{" "}
          <code>wd-github</code>{" "}and your full name (first name first,
          last name second, matching Canvas) on the Labs page — the same
          requirements from <SectionLink to="1.7" />, now revisited for this chapter.
        </li>
        <li>
          Push any remaining changes to the <code>a2</code>{" "}branch and
          confirm the branch deployment on Vercel reflects them.
        </li>
        <li>
          In Canvas, submit both the GitHub repository URL (pointed at the{" "}
          <code>a2</code>{" "}branch) and the Vercel deployment URL for that
          branch. Disable Vercel&apos;s Deployment Protection on that
          deployment, as in <SectionLink to="1.6" />, so graders can open it without signing in.
        </li>
      </ol>
      <p>
        Continue practicing in{" "}
        <Link href="/labs">Labs</Link>, browse{" "}
        <Link href="/labs/lab2/intermediates">Lab 2 intermediate steps</Link>,
        or open the live{" "}
        <Link href="/account/signin">Kambaz</Link>{" "}prototype to see this chapter&apos;s
        styling applied.
      </p>
    </Section>
  );
}
