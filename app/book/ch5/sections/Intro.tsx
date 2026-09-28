import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import OfficialLink from "../../components/OfficialLink";
import LocalUrl from "../../components/LocalUrl";

export default function Intro() {
  return (
    <>
      <header id="intro" className="scroll-mt-6 mb-8">
        <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
          Developing Full Stack Next.js Web Applications
        </p>
        <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
          Chapter 5 — Implementing RESTful Web APIs with Express.js
        </h1>
        <p className="text-neutral-600">Dr. Jose Annunziato</p>
      </header>

      <section className="space-y-4 text-[1.05rem]">
        <p>
          During the 1990s, the adoption of the World Wide Web grew
          exponentially. A variety of commercial ventures explored
          numerous use cases, revolutionizing interactions between
          companies, their customers, and other businesses. Integration
          points between businesses are often referred to as
          business-to-business (
          <strong>B2B</strong>) interactions. Interactions between
          businesses and customers are commonly known as
          business-to-consumer (
          <strong>B2C</strong>) interactions. Many companies have largely
          automated customer interactions by implementing online
          storefronts where customers can browse products, place orders,
          submit reviews, and process returns without standing at a
          counter.
        </p>
        <p>
          Creating visually appealing user interfaces is essential to
          capture customer attention, encourage purchases through
          marketing ads, and build long-term relationships through
          incentives like discounts and loyalty programs. User
          interfaces, as the name suggests, focus on application aspects
          that interact with users through visually engaging
          representations of data. Up to this point these interfaces
          have used hard-coded JSON files, such as{" "}
          <code>courses.json</code>{" "}and{" "}
          <code>modules.json</code>, to render data. Interfaces have
          been built to render and manipulate this data, updating the
          screen to reflect changes.{" "}
          <ChapterLink to={4} />{" "}taught Kambaz to add, edit, and
          delete courses and modules in the browser, so the Dashboard
          and Modules screens felt like a working product.
        </p>
        <p>
          However, these updates have not been permanent; refreshing the
          browser results in lost changes and a reset application state.
          JavaScript applications running on clients like browsers, game
          consoles, or TV boxes have limited options for retrieving and
          storing data permanently. A client cannot be the permanent
          store: it can crash, it can be closed, and it cannot be
          trusted with every piece of logic a business owns. The next
          chapters address the challenges of retrieving, storing,
          updating, and deleting data permanently on remote servers and
          databases from React applications.
        </p>
        <p>
          This chapter builds the other half of the system: an{" "}
          <OfficialLink href="https://expressjs.com/">
            Express.js
          </OfficialLink>{" "}
          HTTP server in a{" "}
          <strong>sibling project</strong>{" "}named{" "}
          <code>webdev-server</code>{" "}— not inside the Next.js app
          directory. Locally the UI is{" "}
          <code>next dev</code>{" "}on port 3000 and Express is{" "}
          <code>nodemon</code>{" "}/{" "}
          <code>npm start</code>{" "}on port 4000, with{" "}
          <code>NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000</code>.{" "}
          <SectionLink to="5.5" />{" "}deploys that same server to{" "}
          <OfficialLink href="https://render.com/">
            Render
          </OfficialLink>{" "}
          (or Heroku); you do not need a remote host for the labs.{" "}
          <OfficialLink href="https://axios-http.com/">
            axios
          </OfficialLink>{" "}
          talks to Express from the React screens.{" "}
          <SectionLink to="5.3" />{" "}adds App Router Route Handlers as a
          same-app alternative — a section, not the chapter spine.
          MongoDB is{" "}
          <ChapterLink to={6} />; this chapter keeps the collections in
          process memory so the URLs and clients can stay the same when
          the database arrives.
        </p>
      </section>

      <Section id="sec-5-1" title="5.1 Installing and Configuring an HTTP Web Server">
        <p>
          The Kambaz React Web application built so far is the{" "}
          <strong>client</strong>{" "}in a{" "}
          <strong>client/server architecture</strong>. Users interact
          with client applications that implement user interfaces
          relying on servers to store data and execute complex logic
          that would be impractical on the client. Clients and servers
          interact through a sequence of requests and responses.
          Clients send requests to servers, servers execute some logic,
          fulfill the request, and then respond back to the client with
          results. This section discusses implementing HTTP servers
          using{" "}
          <OfficialLink href="https://nodejs.org/">Node.js</OfficialLink>.
        </p>
        <p>
          Glance at the Lab 5 checklist as you go, then confirm coverage
          after you have built each sample —{" "}
          <SectionLink to="5.2" />{" "}is the walkthrough, not a skip
          list. Open{" "}
          <LocalUrl href="/labs/lab5" />{" "}once the companion server is
          running so the interactive demos can reach{" "}
          <code>http://localhost:4000</code>.
        </p>
      </Section>
    </>
  );
}
