import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import Link from "next/link";
import HandInLink from "../../components/HandInLink";
import LabsNameGithub from "@/app/labs/lab1/intermediates/1-5-LabsNameGithub";

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
        <p id="labs-name-github">
          Now that the repository exists, put your name, your section, and a
          link to the repository on the Labs index, so graders can tell whose
          deploy they are looking at and find its source. Open{" "}
          <code>app/labs/page.tsx</code>{" "}and add three things to the page
          from <SectionLink to="1.3.10" />:
        </p>
        <ul>
          <li>
            An <code>h2</code>{" "}with your full name exactly as it appears in
            Canvas, first name first and last name second.
          </li>
          <li>
            A paragraph with your course and section from Canvas, such as{" "}
            <code>CS4550 Section 01</code>{" "}or <code>CS5610 Section 09</code>.
          </li>
          <li>
            A link to your <code>webdev-client</code>{" "}repository on GitHub
            with id <code>wd-github</code>. Use your own repository URL, not the
            one in the sample.
          </li>
        </ul>
        <p>
          Keep the lab links you already have: your Lab 4 and Lab 5 links go
          where the comment is, and keep the Kambaz link from{" "}
          <SectionLink to="1.4.1" />. Replace the name, section, and GitHub URL
          below with your own:
        </p>
        <CodeBlock
          language="tsx"
          name="LabsNameGithub"
          file="app/labs/page.tsx"
        >{`import Link from "next/link";

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
}`}</CodeBlock>
        <p>
          Your name and section sit under the Labs heading, and the GitHub link
          opens your repository in a new tab:
        </p>
        <LiveDemo name="LabsNameGithub" file="app/labs/page.tsx">
          <LabsNameGithub />
        </LiveDemo>
        <p>Commit and push the change:</p>
        <CodeBlock language="shell">{`git add .
git commit -m "Add name, section, and GitHub link to Labs"
git push`}</CodeBlock>
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
            Added your full name, your section, and a{" "}
            <code>wd-github</code>{" "}link to your repository on the Labs page (
            <a href="#labs-name-github">§1.5</a>).
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
