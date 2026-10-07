import Section from "../../components/Section";
import CodeBlock from "../../components/CodeBlock";
import Link from "next/link";
import HandInLink from "../../components/HandInLink";

export default function ClosingSections() {
  return (
    <>
      <Section id="sec-1-5" title="1.5 Committing Code to Source Control">
        <p>
          So far the app runs only on your machine. To share it — and to deploy
          it in the next section — you put a copy of the source on{" "}
          <strong>GitHub</strong>, a hosting service for{" "}
          <strong>Git</strong>{" "}repositories. Git is the tool that records
          snapshots of your project (commits) and syncs them with a remote
          server. Create a public repository named{" "}
          <code>webdev-client</code>{" "}on GitHub, then push from your project
          folder.
        </p>
        <p>
          Before you commit, confirm the project{" "}
          <code>.gitignore</code>{" "}file lists folders that should{" "}
          <em>not</em>{" "}be uploaded — especially <code>node_modules</code>{" "}
          (huge, regenerable with <code>npm install</code>) and IDE folders such
          as <code>.idea</code>. The starter usually includes a suitable{" "}
          <code>.gitignore</code>; do not remove those entries.
        </p>
        <p>
          The usual flow: <code>git add</code>{" "}stages files for the next
          snapshot, <code>git commit</code>{" "}saves that snapshot with a message,{" "}
          <code>git remote add origin …</code>{" "}points your local repo at GitHub,
          and <code>git push</code>{" "}uploads commits to the{" "}
          <code>main</code>{" "}branch:
        </p>
        <CodeBlock language="shell">{`git add .
git commit -m "first commit"
git remote add origin https://github.com/<you>/webdev-client.git
git push -u origin main`}</CodeBlock>
        <p>
          GitHub no longer accepts account passwords for{" "}
          <code>git push</code>{" "}over HTTPS. If authentication fails, create a{" "}
          <strong>Personal Access Token (PAT)</strong>{" "}under GitHub → Settings →
          Developer settings → Personal access tokens, then paste the token when
          the terminal asks for a password. Keep the token private — treat it
          like a password.
        </p>
      </Section>

      <Section id="sec-1-6" title="1.6 Deploying Next.js Projects to the Web">
        <p>
          <strong>Deploying</strong>{" "}means hosting the running app on a public
          server so anyone with the URL can open it. Create a{" "}
          <a href="https://vercel.com" target="_blank" rel="noreferrer">
            Vercel
          </a>{" "}
          account, import the GitHub <code>webdev-client</code>{" "}repo, and deploy
          with the Next.js preset (Vercel usually detects Next.js
          automatically).
        </p>
        <p>
          After the first deploy, open the project&apos;s settings and disable{" "}
          <strong>Deployment Protection</strong>{" "}(sometimes labeled as a Vercel
          Authentication / password gate on preview or production URLs). Graders
          must open your site without logging into Vercel. Hand in A1 on
          kambaz.dev, not in Canvas: sign in at{" "}
          <HandInLink id="a1" />{" "}and submit both the GitHub repository URL
          and the Vercel deployment URL there. Your grade is posted in Canvas.
        </p>
      </Section>

      <Section id="sec-1-7" title="1.7 Conclusion">
        <p>By the end of this chapter you should have:</p>
        <ol>
          <li>Installed Node.js and created <code>webdev-client</code>.</li>
          <li>Completed all Lab 1 HTML exercises.</li>
          <li>Prototyped Kambaz screens with HTML and React.</li>
          <li>Pushed the project to GitHub.</li>
          <li>
            Ensured Labs lists your full name and a{" "}
            <code>wd-github</code>{" "}repository link.
          </li>
          <li>
            Deployed to Vercel and submitted both URLs on{" "}
            <HandInLink id="a1" />.
          </li>
        </ol>
        <p>
          Continue practicing in{" "}
          <Link href="/labs">Labs</Link>, browse{" "}
          <Link href="/labs/lab1/intermediates">Lab 1 intermediate steps</Link>,
          or open the live{" "}
          <Link href="/account/signin">Kambaz</Link> prototype.
        </p>
      </Section>
    </>
  );
}
