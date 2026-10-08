import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import Link from "next/link";
import HandInLink from "../../components/HandInLink";

export default function Conclusion() {
  return (
    <>
      <Section id="sec-5-6" title="5.6 Conclusion">
        <p>
          In this chapter we learned how to create HTTP servers using
          the Node.js JavaScript framework. We implemented RESTful
          services with the Express library and practiced sending,
          retrieving, modifying, and updating data using HTTP requests
          and responses. We then learned how to integrate React Web
          applications with HTTP servers, implementing a client/server
          architecture: the Next.js UI is the client; Express in the
          sibling <code>webdev-server</code>{" "}project is the server.
        </p>
        <p>
          Lab 5 walked through path parameters, query strings, remote
          objects and arrays, AJAX with axios, CORS, and JSON bodies
          with POST, PUT, and DELETE.{" "}
          <SectionLink to="5.3" />{" "}showed Route Handlers as a
          same-app option when you do not need an independent process.{" "}
          <SectionLink to="5.4" />{" "}moved Kambaz courses, modules,
          and account screens onto those same HTTP verbs, with sessions
          so more than one user can be signed in.{" "}
          <SectionLink to="5.5" />{" "}deployed the pair — Vercel for
          the UI, Render (or Heroku) for Express — and pointed{" "}
          <code>NEXT_PUBLIC_HTTP_SERVER</code>{" "}at the public origin.
          In the next chapter we will add database support to the HTTP
          server so we can store data permanently; the URLs and clients
          stay, and MongoDB replaces the in-memory arrays.
        </p>
      </Section>

      <Section id="sec-5-7" title="5.7 Deliverables">
        <p>
          As a deliverable, make sure you complete all the lab
          exercises, the course, module, and assignment routes on the
          server, as well as the client and component refactoring on the
          React project. For both the React and Node repositories, all
          your work should be done in a branch called{" "}
          <code>a5</code>. When done, add, commit, and push both
          branches to their respective GitHub repositories. Deploy the
          new branches to Vercel and Render (or Heroku) and confirm they
          integrate. All the lab exercises should work remotely just as
          well as locally. The Kambaz Dashboard should display the
          courses from the server as well as the modules and
          assignments.
        </p>
        <CodeBlock language="shell">{`# in webdev-client
git checkout -b a5
git add .
git commit -am "a5 HTTP APIs"
git push -u origin a5

# in webdev-server
git checkout -b a5
git add .
git commit -am "a5 HTTP APIs"
git push -u origin a5`}</CodeBlock>
        <ol>
          <li>
            Complete every Lab 5 exercise in{" "}
            <SectionLink to="5.2" />, including multiply and divide on
            both path and query, the module object on your own, todo
            completed and description routes, axios load-on-mount, and
            POST / DELETE / PUT with error handling.
          </li>
          <li>
            Implement course and module routes (and assignment routes)
            on Express, plus the matching clients in the React project,
            so Dashboard and Modules survive a refresh while the server
            is running (
            <SectionLink to="5.4" />
            ).
          </li>
          <li>
            Work on branch{" "}
            <code>a5</code>{" "}in <em>both</em>{" "}repositories — the
            Next.js app and <code>webdev-server</code>.
          </li>
          <li>
            Deploy the UI to Vercel and the API to Render (or Heroku)
            and confirm they integrate (
            <SectionLink to="5.5" />
            ).
          </li>
          <li>
            The Labs TOC still lists every lab, your full name,{" "}
            <code>wd-github</code>{" "}to the Next.js repo, plus links to
            the Node GitHub repo and the Render (or Heroku) root URL.
            Style those links with the existing Tailwind Labs TOC.
          </li>
          <li>
            Disable Vercel Deployment Protection so graders can open
            the <code>a5</code>{" "}preview without signing in (
            <SectionLink to="1.6" />).
          </li>
          <li>
            On <HandInLink id="a5" />{" "}(not in Canvas), submit the Vercel
            URL for the <code>a5</code>{" "}branch deployment. Graders will also use
            the Render API and both GitHub{" "}
            <code>a5</code>{" "}branches.
          </li>
        </ol>
        <p>
          Continue in <Link href="/labs">Labs</Link>, browse{" "}
          <Link href="/labs/lab5/intermediates">Lab 5 steps</Link>, or
          open <Link href="/account/signin">Kambaz</Link>.{" "}
          <ChapterLink to={6} />{" "}replaces the in-memory arrays with
          MongoDB.
        </p>
      </Section>
    </>
  );
}
