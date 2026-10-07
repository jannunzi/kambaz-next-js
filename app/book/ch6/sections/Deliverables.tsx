import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import Link from "next/link";
import HandInLink from "../../components/HandInLink";

export default function Deliverables() {
  return (
    <Section id="sec-6-5" title="6.5 Deliverables">
      <p>
        As a deliverable, make sure you complete all the lab
        exercises, Mongoose schemas, models, DAOs, React components,
        and that they behave as described. For both the React and Node
        repositories, all your work should be done in a branch called{" "}
        <code>a6</code>. When done, add, commit, and push both
        branches to their respective GitHub repositories. Deploy the
        new branches to{" "}
        <OfficialLink href="https://vercel.com/">
          Vercel
        </OfficialLink>{" "}
        and{" "}
        <OfficialLink href="https://render.com/">
          Render
        </OfficialLink>{" "}
        (or Heroku) and confirm they integrate. If you are using
        Render, it does not create a separate branch deployment like
        Vercel, so you will have to deploy to an entirely different
        Web service so that you do not trample the previous assignment
        while the TAs are still grading. Do not overwrite the{" "}
        <ChapterLink to={5} />{" "}
        <code>a5</code>{" "}API URL. The Node server application running
        on Render will need to be configured to interact with the{" "}
        <code>a6</code>{" "}Vercel branch deployment and with the Atlas
        cluster from <SectionLink to="6.3" />. All the exercises
        should work remotely just as well as locally. The Kambaz
        Dashboard should display the courses and modules from the
        database. As the deliverable, submit the URL of the{" "}
        <code>a6</code>{" "}branch deployment of your React application
        running on Vercel. Hand it in on <HandInLink id="a6" />{" "}(not
        in Canvas).
      </p>
      <CodeBlock language="shell">{`# in webdev-client
git checkout -b a6
git add .
git commit -am "a6 MongoDB"
git push -u origin a6

# in webdev-server
git checkout -b a6
git add .
git commit -am "a6 MongoDB"
git push -u origin a6`}</CodeBlock>
      <p>
        After both branches are on GitHub, work through this
        checklist before you submit. Graders will open the Vercel URL
        you turn in, sign in, and confirm the data they see is coming
        from Atlas through the new Render service — not from the
        in-memory arrays of the previous assignment.
      </p>
      <ol>
        <li>
          Finish every Lab 6 exercise on{" "}
          <Link href="/labs/lab6">/labs/lab6</Link>{" "}and confirm the
          interactive demos in this chapter still behave as described.
        </li>
        <li>
          Implement the Mongoose schemas, models, and DAOs for users,
          courses, modules, enrollments, and (on your own)
          assignments. Refactor the Express routes to{" "}
          <code>async</code>{" "}/{" "}
          <code>await</code>{" "}those DAO functions. Confirm Sign in,
          Signup, Profile, the ADMIN Users screen, Dashboard course
          CRUD, module CRUD, and enroll / unenroll all persist in
          Compass.
        </li>
        <li>
          Labs TOC still lists every lab, your full name,{" "}
          <code>wd-github</code>{" "}to the Next.js repo, plus links to
          the Node GitHub repo and the new Render (or Heroku) root
          URL.
        </li>
        <li>
          Create a free{" "}
          <OfficialLink href="https://www.mongodb.com/atlas">
            MongoDB Atlas
          </OfficialLink>{" "}
          cluster named <code>Kambaz</code>, allow access from
          anywhere (<code>0.0.0.0/0</code>), and import the Kambaz
          JSON files into the remote <code>kambaz</code>{" "}database.
        </li>
        <li>
          Deploy a <strong>new</strong>{" "}Render (or Heroku) service
          from the Node <code>a6</code>{" "}branch. On Render, set{" "}
          <code>DATABASE_CONNECTION_STRING</code>{" "}to the Atlas URI
          with <code>kambaz</code>{" "}in the path (
          <SectionLink to="6.3.1.2" />) and the session env vars from{" "}
          <SectionLink to="6.3.2" />:{" "}
          <code>CLIENT_URL</code>, <code>SERVER_URL</code>,{" "}
          <code>SERVER_ENV=production</code>, and{" "}
          <code>SESSION_SECRET</code>. Manual Deploy after you change
          environment variables.
        </li>
        <li>
          Deploy the Next.js <code>a6</code>{" "}branch to Vercel. Set{" "}
          <code>NEXT_PUBLIC_HTTP_SERVER</code>{" "}to the new Express
          origin with no trailing slash, then redeploy so the public
          env var is baked into the client. Disable Vercel Deployment
          Protection so graders can open the{" "}
          <code>a6</code>{" "}preview without signing in (
          <SectionLink to="1.6" />).
        </li>
        <li>
          Confirm the remote app: sign in, open Dashboard, and verify
          courses and modules come from Atlas. Create, edit, and
          delete a course and a module; enroll and unenroll; open
          Users as an ADMIN. Refresh Compass on the Atlas connection
          and confirm the documents changed.
        </li>
        <li>
          On <HandInLink id="a6" />{" "}(not in Canvas), submit the Vercel URL
          for the <code>a6</code>{" "}branch deployment.
        </li>
      </ol>
      <p>
        Continue in <Link href="/labs">Labs</Link>, browse{" "}
        <Link href="/labs/lab6/intermediates">Lab 6 steps</Link>, or
        open <Link href="/account/signin">Kambaz</Link>.
      </p>
    </Section>
  );
}
