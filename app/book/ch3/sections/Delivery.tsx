import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import Link from "next/link";

export default function Delivery() {
  return (
    <Section id="sec-3-10" title="3.10 Delivery">
      <p>
        Submit this chapter&apos;s work as a new branch on the same{" "}
        <code>webdev-client</code>{" "}repository and deployment from earlier
        chapters, so graders can compare <ChapterLink to={2} />&apos;s styled
        prototype against this chapter&apos;s JavaScript and data-driven
        screens side by side.
      </p>
      <ol>
        <li>
          Finish every exercise described in this chapter inside the same{" "}
          <code>webdev-client</code>{" "}project used in <ChapterLink to={1} />{" "}
          and <ChapterLink to={2} />.
        </li>
        <li>
          Create a branch named <code>a3</code>, then add, commit, and push
          it to the same GitHub repository from <SectionLink to="1.5" />:
        </li>
      </ol>
      <CodeBlock language="shell">{`git checkout -b a3
git add .
git commit -am "a3 JavaScript"
git push -u origin a3`}</CodeBlock>
      <ol start={3}>
        <li>
          In Vercel, configure the project to deploy every branch to its own
          URL: open the project&apos;s <strong>Settings → Git</strong>{" "}and
          enable deployments for all branches (some Vercel plans expose this
          under <strong>Build & Deployment → Branches</strong>). From then on,
          each push to <code>a3</code>{" "}gets its own preview URL that
          contains the branch name, separate from your <ChapterLink to={2} />{" "}
          <code>a2</code>{" "}deployment.
        </li>
        <li>
          Confirm <code>app/labs/TOC.tsx</code>{" "}and{" "}
          <code>app/labs/page.tsx</code>{" "}still link Lab 1, Lab 2, Lab 3,
          and Kambaz, plus a link to your GitHub repository
          (<code>https://github.com/&lt;you&gt;/&lt;repo&gt;</code>; keep the id{" "}
          <code>wd-github</code>, which helps us test your work) and your
          full name (first name first, last name second, matching Canvas)
          on the Labs page — the same requirements from{" "}
          <SectionLink to="1.7" />, now revisited for this chapter. Run{" "}
          <code>npm run build</code>{" "}before you push: a page that works in{" "}
          <code>npm run dev</code>{" "}can still fail the build, and then the
          Vercel deployment fails too.
        </li>
        <li>
          Push any remaining changes to the <code>a3</code>{" "}branch and
          confirm the branch deployment on Vercel reflects them.
        </li>
        <li>
          In Canvas, submit both the GitHub repository URL (pointed at the{" "}
          <code>a3</code>{" "}branch) and the Vercel deployment URL for that
          branch. Disable Vercel&apos;s Deployment Protection on that
          deployment, as in <SectionLink to="1.6" />, so graders can open it without signing in.
        </li>
      </ol>
      <p>
        Continue practicing in{" "}
        <Link href="/labs">Labs</Link>, browse{" "}
        <Link href="/labs/lab3/intermediates">Lab 3 intermediate steps</Link>,
        or open the live{" "}
        <Link href="/account/signin">Kambaz</Link>{" "}prototype to see this chapter&apos;s
        data-driven screens.
      </p>
    </Section>
  );
}
