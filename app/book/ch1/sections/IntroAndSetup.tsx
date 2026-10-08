import Section from "../../components/Section";
import BookSectionSlidesLink from "../../components/BookSectionSlidesLink";
import SectionLink from "../../components/SectionLink";
import LocalUrl from "../../components/LocalUrl";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import Lab1Starter from "@/app/labs/lab1/intermediates/1-2-4-Lab1Starter";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function IntroAndSetup() {
  return (
    <>
      <header id="intro" className="scroll-mt-6 mb-8">
        <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
          Developing Full Stack Next.js Web Applications
        </p>
        <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
          Chapter 1 — Building Next.js User Interfaces with HTML
        </h1>
        <p className="text-neutral-600">Dr. Jose Annunziato</p>
        <p className="mb-0 mt-2">
          <BookSectionSlidesLink sectionId="intro" />
        </p>
      </header>

      <section className="space-y-4 text-[1.05rem]">
        <p>
          The foundation of our modern digital landscape is the{" "}
          <OfficialLink href="https://en.wikipedia.org/wiki/Internet">
            <strong>Internet</strong>
          </OfficialLink>
          , a global array of interconnected computer networks. It originated in
          the early 1960s as a research project commissioned by the Advanced
          Research Projects Agency (
          <OfficialLink href="https://www.darpa.mil/">
            <strong>ARPA</strong>
          </OfficialLink>
          ), the research arm of the United States Department of Defense (
          <OfficialLink href="https://www.defense.gov/">
            <strong>DoD</strong>
          </OfficialLink>
          ). The initial goal was to build{" "}
          <OfficialLink href="https://en.wikipedia.org/wiki/ARPANET">
            <strong>ARPANET</strong>
          </OfficialLink>
          , a robust, decentralized, and redundant communication infrastructure
          capable of maintaining connectivity even in the event of major
          disruptions. By the 1980s, the standardization of protocols like{" "}
          <OfficialLink href="https://www.ietf.org/">TCP/IP</OfficialLink>{" "}
          allowed these isolated military and academic networks to proliferate
          and connect worldwide, establishing the underlying network of networks
          upon which modern digital communication relies.
        </p>
        <p>
          The{" "}
          <OfficialLink href="https://www.w3.org/">
            <strong>World Wide Web</strong>
          </OfficialLink>{" "}
          was invented in 1989 by British computer scientist{" "}
          <OfficialLink href="https://www.w3.org/People/Berners-Lee/">
            Sir Tim Berners-Lee
          </OfficialLink>{" "}
          during his tenure at{" "}
          <OfficialLink href="https://home.cern/">
            <strong>CERN</strong>
          </OfficialLink>
          , the European particle physics laboratory in Switzerland. The
          objective was to enable the efficient sharing and linking of research
          documents over the existing Internet. In March 1989, Sir Tim
          Berners-Lee proposed a system of hypertext documents connected via
          hyperlinks, which users access through Uniform Resource Locators (
          <OfficialLink href="https://url.spec.whatwg.org/">
            <strong>URL</strong>
          </OfficialLink>s) using the HyperText Transfer Protocol (
          <OfficialLink href="https://httpwg.org/specs/rfc9110.html">
            <strong>HTTP</strong>
          </OfficialLink>
          ). By 1990, he had created the first web browser (named{" "}
          <OfficialLink href="https://en.wikipedia.org/wiki/WorldWideWeb">
            <strong>WorldWideWeb</strong>
          </OfficialLink>
          ), a <strong>web server</strong>, and the foundational HyperText Markup
          Language (
          <OfficialLink href="https://html.spec.whatwg.org/">
            <strong>HTML</strong>
          </OfficialLink>
          ) language to create HTTP <strong>web pages</strong>. Browsers and
          servers connect to one another over the internet in a client-server
          architecture (
          <FigureLink to="1.1" />
          ). Sir Tim Berners-Lee made the Web public in 1991, and on April 30,
          1993, CERN released the technology into the public domain, facilitating
          explosive growth. Presently, billions of static and dynamic pages power
          various systems ranging from simple sites to complex applications.
        </p>

        <BookFigure
          id="fig-1.1"
          src="/images/book/ch1/figures/fig-1.1-client-server.png"
          alt="Client-server architecture: a browser UI with HTML, CSS, JavaScript, and React talks HTTP to a Node.js server with Express, REST APIs, session, and Mongoose; the server reads static files, the cloud, and a database"
          caption="Figure 1.1 — The Client Server Architecture"
        />

        <p>
          Web pages are comprised of plain text documents formatted with{" "}
          <strong>HTML</strong>, a dialect of{" "}
          <OfficialLink href="https://www.w3.org/XML/">
            <strong>XML</strong>
          </OfficialLink>{" "}
          (
          <strong>eXtensible Markup Language</strong>). HTML is a computer
          language utilized to format the content displayed in web pages,
          including properties such as foreground and background color, white
          spaces, text alignment, font, lists, tables, and forms. Browsers
          establish a network connection with servers to send HTTP Requests for
          HTML documents. These requests rely on Uniform Resource Locators (
          <strong>URL</strong>s). A URL such as{" "}
          <code>http://www.nasa.gov</code>{" "}names the{" "}
          <strong>protocol</strong>{" "}(
          <code>http</code> — Hypertext Transfer Protocol), then the{" "}
          <strong>server</strong>{" "}(
          <code>www.nasa.gov</code>). That hostname is mapped to an IP
          address so the browser can find the machine on the network. A{" "}
          <strong>path</strong>{" "}after the server name pinpoints a specific
          document. Local development uses the same pattern:{" "}
          <LocalUrl href="/labs/lab1" /> — here{" "}
          <code>http</code>{" "}is still the protocol,{" "}
          <code>localhost</code>{" "}is the hostname for your own machine,{" "}
          <code>3000</code>{" "}is the <strong>port</strong>{" "}where the Next.js
          dev server listens, and{" "}
          <code>/labs/lab1</code>{" "}is the path to Lab 1. Servers
          locate the requested documents, and then respond with the
          document&apos;s content. Browsers parse HTML documents to create
          in-memory object representations known as the{" "}
          <OfficialLink href="https://dom.spec.whatwg.org/">
            <strong>DOM</strong>
          </OfficialLink>{" "}
          (
          <strong>Document Object Model</strong>). The DOM consists of a
          hierarchical data structure where each node is configured to render
          content in a specific format and style. This chapter examines using
          HTML for formatting web pages and creating user interfaces.
        </p>
        <p>
          Plain HTML documents are static: the same document does not change
          over time, and does not depend on the data or user interactions.
          The Web quickly reached the limit of what could be render on a screen.
           — a list of courses that never changes, a heading that
          never knows who signed in. In the early 1990s, servers began to{" "}
          <em>compute</em>{" "}HTML on request so the content could be data
          driven and interact with users. Scripts on the server —{" "}
          <OfficialLink href="https://datatracker.ietf.org/doc/html/rfc3875">
            CGI
          </OfficialLink>
          , then languages such as{" "}
          <OfficialLink href="https://www.php.net/">
            <strong>PHP</strong>
          </OfficialLink>{" "}
          — could assemble a finished document and send it to the browser. Every
          click still meant a full round trip for a new page.{" "}
          <OfficialLink href="https://tc39.es/ecma262/">
            <strong>JavaScript</strong>
          </OfficialLink>
          , created by Brendan Eich at{" "}
          <OfficialLink href="https://en.wikipedia.org/wiki/Netscape">
            Netscape
          </OfficialLink>{" "}
          in 1995, brought that computation into the browser. HTML documents
          download <code>.js</code>{" "}files from the server; the browser
          runs them to manipulate the DOM and build dynamic user interfaces
          without a full round trip for every change. The same language now
          also runs on the server — in{" "}
          <FigureLink to="1.1" />, the client box is HTML, CSS, JavaScript,
          and React; the Node.js box is JavaScript too. This course uses
          both: later chapters generate HTML on the server and still use
          the browser for clicks, state, and anything that reads the
          address bar.{" "}
          <OfficialLink href="https://www.typescriptlang.org/">
            <strong>TypeScript</strong>
          </OfficialLink>{" "}
          is a version of JavaScript developed by Microsoft that adds static
          types and is quickly becoming the preferred language for web
          development. Later chapters discuss programming server-side logic,
          including{" "}
          <OfficialLink href="https://en.wikipedia.org/wiki/API">
            <strong>API</strong>
          </OfficialLink>{" "}
          (Application Programming Interface) routes and database interactions
          with{" "}
          <OfficialLink href="https://www.mongodb.com/">
            <strong>MongoDB</strong>
          </OfficialLink>
          .
        </p>
        <p>
          <OfficialLink href="https://react.dev/">
            <strong>React</strong>
          </OfficialLink>{" "}
          is a popular JavaScript library developed by
          Meta for building dynamic and interactive user interfaces. It promotes
          a component-based architecture where developers break down complex UIs
          into small and reusable pieces of code called{" "}
          <strong>components</strong>. React efficiently manages the state of
          these components, ensuring that the user interface stays in sync with
          underlying data changes and user interaction. Developers use React to
          build Single Page
          Applications (
          <OfficialLink href="https://en.wikipedia.org/wiki/Single-page_application">
            <strong>SPA</strong>
          </OfficialLink>s), which provide a seamless, fluid
          user experience by updating only the necessary parts of the page
          without requiring full-page reloads — unlike traditional multi-page
          sites, where every link often fetches an entirely new HTML document
          from the server. Its declarative nature simplifies
          the process of creating complex web interfaces by describing what the
          UI should look like for a given state.
        </p>
        <p>
          <OfficialLink href="https://nextjs.org/">
            <strong>Next.js</strong>
          </OfficialLink>{" "}
          is a powerful framework designed to simplify
          the construction of full-stack web applications. Built on top of React,
          it provides an all-in-one solution that includes robust features such
          as server-side rendering (
          <OfficialLink href="https://en.wikipedia.org/wiki/Server-side_rendering">
            <strong>SSR</strong>
          </OfficialLink>
          ), static site generation (
          <OfficialLink href="https://en.wikipedia.org/wiki/Static_site_generator">
            <strong>SSG</strong>
          </OfficialLink>
          ), and seamless API endpoint integration. Next.js
          extends React by offering built-in routing, data fetching, and
          performance optimizations, allowing developers to create highly
          scalable applications that interact efficiently with backend resources,
          such as MongoDB, over HTTP.
        </p>
        <p>
          This chapter describes how to install and configure a local development
          environment for building Next.js applications. Development is done in
          the local environment and then shared in a remote{" "}
          <OfficialLink href="https://github.com/">
            GitHub
          </OfficialLink>{" "}
          source repository. The source in GitHub is then deployed to a remote
          server hosted on{" "}
          <OfficialLink href="https://vercel.com/">Vercel</OfficialLink>{" "}
          which is optimized for Next.js and provides seamless
          serverless deployment. This chapter introduces creating a Next.js
          application and explores building user interfaces using HTML and
          JavaScript. Various HTML elements are described to render user
          interface content, such as headings, paragraphs, lists, tables, and
          form elements. All sections in this chapter contain exercises that
          introduce basic HTML elements and concepts, giving an opportunity to
          learn and practice HTML skills. The exercises provide detailed
          instructions to successfully accomplish the tasks. Make sure to
          complete all exercises described in the book.
        </p>
        <p>
          The <strong>Kambaz</strong>{" "}sections in each chapter contain exercises
          that ask readers to build a fully functional web application inspired
          by a popular Learning Management System (
          <OfficialLink href="https://en.wikipedia.org/wiki/Learning_management_system">
            <strong>LMS</strong>
          </OfficialLink>
          ) with a
          similar name. The exercises provide sample code and requirements but
          deliberately leave out steps where the reader is expected to experiment
          and discover how to implement the requirements using the skills learned
          in prior sections. This chapter focuses on using plain HTML within
          Next.js components to implement a draft, rough prototype of various
          Kambaz screens, which at first won&apos;t look like the target
          product in <FigureLink to="1a" />–<FigureLink to="1d">1d</FigureLink>.
          Later chapters will continue working on the Kambaz
          application, introducing Cascading Style Sheets (
          <OfficialLink href="https://www.w3.org/Style/CSS/">
            <strong>CSS</strong>
          </OfficialLink>
          )
          to style the Web pages so they look more like these screen shots,
          and integrating MongoDB for data persistence.
        </p>
        <BookFigure
          sources={[
            {
              id: "fig-1a",
              src: "/images/book/kambaz/dashboard.png",
              alt: "Kambaz Dashboard target screenshot",
              caption: "Figure 1a — Dashboard Screen",
            },
            {
              id: "fig-1b",
              src: "/images/book/kambaz/modules.png",
              alt: "Kambaz Modules target screenshot",
              caption: "Figure 1b — Modules Screen",
            },
            {
              id: "fig-1c",
              src: "/images/book/kambaz/assignments.png",
              alt: "Kambaz Assignments target screenshot",
              caption: "Figure 1c — Assignments Screen",
            },
            {
              id: "fig-1d",
              src: "/images/book/kambaz/assignment-editor.png",
              alt: "Kambaz Assignment Editor target screenshot",
              caption: "Figure 1d — Assignment Editor",
            },
          ]}
        />
      </section>

      <Section id="sec-1-1" title="1.1 Learning Objectives">
        <p>By the end of this chapter, you will be able to:</p>
        <ul>
          <li>Understand the fundamentals of HTML and how it structures web content.</li>
          <li>Set up a development environment for Next.js applications.</li>
          <li>Install Claude Code in the IDE and sign in with a Claude account.</li>
          <li>Create and organize Next.js components using JSX.</li>
          <li>
            Use{" "}
            <OfficialLink href="https://developer.chrome.com/docs/devtools">
              Chrome DevTools
            </OfficialLink>{" "}
            to inspect and manipulate the DOM.
          </li>
          <li>Implement headings, paragraphs, lists, tables, and images.</li>
          <li>Build interactive web forms with different input types.</li>
          <li>
            Pass props into custom components and wrap nested content with{" "}
            <code>children</code>.
          </li>
          <li>Implement navigation in a Next.js SPA using built-in routing.</li>
          <li>Develop a structured approach to building UIs in Next.js.</li>
        </ul>
        <p>
          Those objectives are best achieved by building along with the
          narration — each lab component and Kambaz screen as it appears —
          rather than reading first and coding later. Glance at the Lab 1
          checklist in <SectionLink to="1.3.12" />{" "}and the Kambaz checklist
          in <SectionLink to="1.4.9" />{" "}so the expected coverage is visible
          from the start. Those lists are recaps, not a reason to skip ahead:
          work through each section, then use them to confirm what stuck.
        </p>
      </Section>

      <Section id="sec-1-2" title="1.2 Setting Up the Development Environment">
        <p>
          HTML practice in this book happens inside Next.js components, so first
          install the tools that run the app on your machine. Later sections
          assume earlier ones, so it helps to keep the project in step as you
          read.
        </p>

        <h3 id="sec-1-2-1" className="scroll-mt-6 font-sans text-xl font-semibold">
          1.2.1 Installing Node.js{" "}
          <BookSectionSlidesLink sectionId="sec-1-2-1" />
        </h3>
        <p>
          <OfficialLink href="https://nodejs.org/">
            <strong>Node.js</strong>
          </OfficialLink>{" "}
          is a JavaScript runtime that lets you run
          JavaScript outside the browser — typically from a terminal or console
          on your computer. It is essential for Next.js development: it powers
          the local development server, installs and manages project
          dependencies, and later enables server-side features such as API
          routes.
        </p>
        <p>
          Installing Node.js also gives you two companion tools,{" "}
          <OfficialLink href="https://www.npmjs.com/">
            <strong>npm</strong>
          </OfficialLink>{" "}
          (Node Package Manager) and{" "}
          <OfficialLink href="https://docs.npmjs.com/cli/v11/commands/npx">
            <strong>npx</strong>
          </OfficialLink>
          . Think of them as the JavaScript ecosystem&apos;s equivalent of build
          and package tools you may already know:{" "}
          <OfficialLink href="https://maven.apache.org/">
            <strong>mvn</strong>
          </OfficialLink>{" "}
          for Java (
          <OfficialLink href="https://maven.apache.org/">Maven</OfficialLink>
          ) or{" "}
          <OfficialLink href="https://pip.pypa.io/">
            <strong>pip</strong>
          </OfficialLink>{" "}
          for Python. With{" "}
          <code>npm</code>{" "}you install libraries, run project scripts (for
          example <code>npm run dev</code>), and manage versions listed in{" "}
          <code>package.json</code>. With <code>npx</code>{" "}you can run a
          one-off package command without installing it globally first — which
          is how we will scaffold the app with{" "}
          <code>npx create-next-app</code>{" "}in <SectionLink to="1.2.4" />.
        </p>
        <p>
          In this chapter we use Node.js mainly to create and host the React
          user interface. Later chapters will use the same runtime to implement
          HTTP servers and{" "}
          <OfficialLink href="https://en.wikipedia.org/wiki/REST">
            <strong>REST</strong>
          </OfficialLink>{" "}
          APIs (Representational State Transfer), and to integrate databases
          such as
          MongoDB. Getting a solid Node.js install now sets you up for both the
          front end and the back end of the stack.
        </p>
        <p>
          Navigate to{" "}
          <a href="https://nodejs.org/" target="_blank" rel="noreferrer">
            https://nodejs.org/
          </a>
          , download the latest{" "}
          <OfficialLink href="https://nodejs.org/en/about/previous-releases">
            <strong>LTS</strong>
          </OfficialLink>{" "}
          (Long Term Support) version
          for your operating system (recommended: version 24.x or later as of
          2026), and install it. Restart your computer if prompted. Confirm the
          install by typing <code>node -v</code>{" "}in a console or terminal. The
          output should show the installed version (for example{" "}
          <code>v24.19.0</code>). Your exact version may differ, but it should be
          at least <strong>20.9</strong>{" "}or later, as required by Next.js.
        </p>
        <CodeBlock language="shell">{`node -v
v24.19.0`}</CodeBlock>

        <h3 id="sec-1-2-2" className="scroll-mt-6 font-sans text-xl font-semibold">
          1.2.2 Installing an Integrated Development Environment (IDE)
        </h3>
        <p>
          You can edit Next.js projects in any text editor, but an{" "}
          <OfficialLink href="https://en.wikipedia.org/wiki/Integrated_development_environment">
            <strong>Integrated Development Environment (IDE)</strong>
          </OfficialLink>{" "}
          makes the work much smoother: syntax highlighting, autocomplete, inline
          errors, debugging, and a built-in terminal in one place. For this
          course,{" "}
          <OfficialLink href="https://code.visualstudio.com">
            <strong>Visual Studio Code</strong>
          </OfficialLink>{" "}
          (<strong>VS Code</strong>) or{" "}
          <OfficialLink href="https://cursor.com">
            <strong>Cursor</strong>
          </OfficialLink>{" "}
          is highly recommended. Both have strong support for JavaScript,
          TypeScript, React, and Next.js — including IntelliSense suggestions
          and debugging integrations. Cursor is built on VS Code, so the menus
          and extensions match the screenshots in this book.
        </p>
        <p>
          Download and install VS Code from{" "}
          <a
            href="https://code.visualstudio.com"
            target="_blank"
            rel="noreferrer"
          >
            https://code.visualstudio.com
          </a>{" "}
          or Cursor from{" "}
          <a href="https://cursor.com" target="_blank" rel="noreferrer">
            https://cursor.com
          </a>
          . Once installed, open the Extensions view and add a few
          useful packages:{" "}
          <OfficialLink href="https://eslint.org/">
            <strong>ESLint</strong>
          </OfficialLink>{" "}
          for catching common code problems,{" "}
          <OfficialLink href="https://prettier.io/">
            <strong>Prettier</strong>
          </OfficialLink>{" "}
          for consistent formatting, and browser{" "}
          <OfficialLink href="https://react.dev/learn/react-developer-tools">
            <strong>React Developer Tools</strong>
          </OfficialLink>{" "}
          for inspecting component trees while you run the app.
        </p>
        <p>
          You will run many commands — <code>npm run dev</code>,{" "}
          <OfficialLink href="https://git-scm.com/">
            <code>git</code>
          </OfficialLink>
          , and others — from a terminal. Prefer the integrated
          terminal inside the IDE (in VS Code or Cursor:{" "}
          <strong>Terminal → New Terminal</strong>) so you stay in the same
          window as your files and do not have to switch back and forth to a
          separate console.
        </p>

        <h3 id="sec-1-2-3" className="scroll-mt-6 font-sans text-xl font-semibold">
          1.2.3 Adding Claude to the IDE
        </h3>
        <p>
          <OfficialLink href="https://claude.ai">
            <strong>Claude</strong>
          </OfficialLink>{" "}
          is an AI assistant from{" "}
          <OfficialLink href="https://www.anthropic.com/">
            Anthropic
          </OfficialLink>
          . In this course you can use it inside the editor to explain code,
          draft a first version, and hunt down errors — still read what it
          writes, and keep the book and labs as the source of truth. If your
          school, employer, or a personal Claude plan already includes access,
          sign in with that account. Otherwise start at{" "}
          <OfficialLink href="https://claude.ai">claude.ai</OfficialLink>.{" "}
          <OfficialLink href="https://code.claude.com/docs/en/vs-code">
            Claude Code
          </OfficialLink>{" "}
          — the editor extension we install next — expects a Claude
          subscription (Pro, Max, Team, or Enterprise) or a Claude Console
          account, not a one-off API key for this setup.
        </p>
        <p>
          Open the Extensions view (
          <strong>Cmd+Shift+X</strong>{" "}on macOS,{" "}
          <strong>Ctrl+Shift+X</strong>{" "}on Windows or Linux), search for{" "}
          <strong>Claude Code</strong>, and install the one published by
          Anthropic. The same extension works in VS Code and in Cursor. Direct
          install links are in the{" "}
          <OfficialLink href="https://code.claude.com/docs/en/vs-code">
            Claude Code for VS Code
          </OfficialLink>{" "}
          docs. If the spark icon does not appear, reload the window from the
          Command Palette: <strong>Developer: Reload Window</strong>.
        </p>
        <p>
          Open Claude from the Command Palette (
          <strong>Cmd+Shift+P</strong>{" "}/{" "}
          <strong>Ctrl+Shift+P</strong>), type{" "}
          <code>Claude Code</code>, and choose{" "}
          <strong>Open in New Tab</strong>. The first time, click{" "}
          <strong>Sign in</strong>{" "}and finish authorization in the browser. In
          Cursor, Claude Code is separate from Cursor&apos;s built-in chat —
          install and sign in even if Cursor AI already works.
        </p>
        <OnYourOwn>
          Install Claude Code, sign in, and confirm the spark icon opens a chat
          tab. This is the assistant you will paste <strong>With AI</strong>{" "}
          prompts into for the rest of the book.
        </OnYourOwn>
        <WithAI
          prompt={`What did node -v print in this project? Look at the terminal output or package engines if needed, and quote the exact version string.`}
        >
          Amber blocks are work you invent by hand. Violet blocks include a
          prompt you can copy into Claude Code (or another assistant). Read the
          result before you keep it. Start with this check — the reply should
          match what you printed in <SectionLink to="1.2.1" />:
        </WithAI>

        <h3 id="sec-1-2-4" className="scroll-mt-6 font-sans text-xl font-semibold">
          1.2.4 Creating a Next.js Application{" "}
          <BookSectionSlidesLink sectionId="sec-1-2-4" />
        </h3>
        <p>
          With <code>npx</code> — the tool that shipped with your Node.js
          install — you can scaffold a new Next.js project from a maintained
          template that already follows current best practices.
        </p>
        <p>
          Start by creating a place on disk for your coursework. From your home
          directory (<code>~</code>), make a folder for the year, the term, and
          the course. On macOS use Terminal; on Windows use Command Prompt or
          PowerShell. For example, to create{" "}
          <code>~/2049/winter/webdev</code>:
        </p>
        <CodeBlock language="shell">{`cd ~
mkdir 2049
mkdir 2049/winter
mkdir 2049/winter/webdev
cd 2049/winter/webdev`}</CodeBlock>
        <p>
          You can pick another location if you prefer. Keep names lowercase,
          avoid spaces, and nest the project only under directories that follow
          the same rules — that prevents a lot of path and tooling headaches
          later.
        </p>
        <p>
          From that folder (or from the IDE&apos;s integrated terminal), create
          the app with:
        </p>
        <CodeBlock language="shell">{`npx create-next-app@16.3 webdev-client`}</CodeBlock>
        <p>
          The <code>@16.3</code>{" "}pins the starter project to Next.js 16.3,
          the version this book is tested with. Don&apos;t use{" "}
          <code>@latest</code>: since October 6, 2026 it installs Next.js 16.4,
          whose starter turns on <strong>Cache Components</strong>, and the
          Kambaz pages you build later in this chapter then fail{" "}
          <code>npm run build</code>{" "}and every Vercel deploy, even though{" "}
          <code>npm run dev</code>{" "}still works.
        </p>
        <p>
          The first time you run this, npm may ask permission to download the{" "}
          <code>create-next-app</code>{" "}package. Accept and continue (the last
          number may be higher; any 16.3.x is fine):
        </p>
        <CodeBlock language="shell">{`Need to install the following packages:
  create-next-app@16.3.8
Ok to proceed? (y)`}</CodeBlock>
        <p>
          Next comes one question. Keep the highlighted answer,{" "}
          <strong>Yes, use recommended defaults</strong>, and press{" "}
          <strong>Enter</strong>. The defaults are what this course uses:
          TypeScript, ESLint, no React Compiler,{" "}
          <OfficialLink href="https://tailwindcss.com/">
            Tailwind CSS
          </OfficialLink>
          , no <code>src/</code>{" "}directory, the App Router, the{" "}
          <code>@/*</code>{" "}import alias, and an <code>AGENTS.md</code>{" "}file
          (with a <code>CLAUDE.md</code>{" "}that points to it) holding Next.js
          notes for AI coding assistants.{" "}
          <OfficialLink href="https://nextjs.org/docs/app/api-reference/turbopack">
            Turbopack
          </OfficialLink>{" "}
          is already the default bundler, so there is no separate question for
          it.
        </p>
        <CodeBlock language="shell">{`? Would you like to use the recommended Next.js defaults? › - Use arrow-keys. Return to submit.
❯   Yes, use recommended defaults
    TypeScript, ESLint, No React Compiler, Tailwind CSS, No src/ directory, App Router, AGENTS.md
    No, customize settings`}</CodeBlock>
        <p>
          If you have run <code>create-next-app</code>{" "}on this computer
          before, the list has a third choice in the middle,{" "}
          <strong>No, reuse previous settings</strong>. Skip it and keep{" "}
          <strong>Yes, use recommended defaults</strong>.
        </p>
        <p>
          If you pick <strong>No, customize settings</strong>{" "}instead, you
          answer each setting yourself. Pressing <strong>Enter</strong>{" "}on
          every question keeps the same answers as the defaults; these are the
          answers to give:
        </p>
        <CodeBlock language="shell">{`✔ Would you like to use the recommended Next.js defaults? › No, customize settings
✔ Would you like to use TypeScript? … Yes
✔ Which linter would you like to use? › ESLint
✔ Would you like to use React Compiler? … No
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a \`src/\` directory? … No
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the import alias (\`@/*\` by default)? … No
✔ Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? … Yes`}</CodeBlock>
        <p id="next-16-4-cache-components-fix">
          <strong>Created your project on or after October 6, 2026?</strong>{" "}
          Open <code>package.json</code>. If it says{" "}
          <code>&quot;next&quot;: &quot;16.4.0&quot;</code>, your project is on
          Next.js 16.4. (Projects created on October 6 before 2:35 PM ET got
          16.3.8 and don&apos;t need this fix.) On 16.4,{" "}
          <code>npm run dev</code>{" "}works, but <code>npm run build</code>{" "}and
          Vercel deploys fail once you add the book&apos;s code. The first error
          you see is usually{" "}
          <em>
            Next.js encountered URL data <code>usePathname()</code>{" "}in a
            Client Component outside of <code>&lt;Suspense&gt;</code>
          </em>
          ; further down the log there is also{" "}
          <em>Next.js encountered uncached or runtime data during prerendering</em>
          .
        </p>
        <p>
          To fix it, open <code>next.config.ts</code>{" "}and delete both the{" "}
          <code>cacheComponents: true,</code>{" "}and the{" "}
          <code>partialPrefetching: true,</code>{" "}lines. Delete both: removing
          only the first one fails with{" "}
          <em>
            <code>partialPrefetching</code>{" "}requires{" "}
            <code>cacheComponents</code>{" "}to be enabled
          </em>
          . Leave everything else in the file alone and commit the change. After
          that, <code>npm run build</code>{" "}and Vercel deploys of the
          book&apos;s code work again.
        </p>
        <CodeBlock language="ts" file="next.config.ts">{`const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,    // delete this line
  partialPrefetching: true, // delete this line
  // ... leave the rest of this file alone
};`}</CodeBlock>
        <p>
          Wait while dependencies install (<code>react</code>,{" "}
          <code>react-dom</code>, <code>next</code>, TypeScript types, Tailwind,
          ESLint, and related packages). When it finishes you should see a
          success message and a new <code>webdev-client</code>{" "}directory. If
          it also says{" "}
          <em>
            A new version of <code>create-next-app</code>{" "}is available
          </em>
          , ignore it: updating <code>create-next-app</code>{" "}puts you back on
          Next.js 16.4. Change into that directory and start the development
          server:
        </p>
        <CodeBlock language="shell">{`cd webdev-client
npm run dev`}</CodeBlock>
        <p>
          The console should report that Next.js is ready and print a local URL,
          usually{" "}
          <LocalUrl href="/" />
          . Open that URL in{" "}
          <OfficialLink href="https://www.google.com/chrome/">
            <strong>Google Chrome</strong>
          </OfficialLink>{" "}
          and confirm the
          default Next.js starter page (logo and getting-started content)
          appears. Stop the server anytime with <strong>Ctrl+C</strong>.
        </p>
        <LiveDemo title="Figure 1.2 — Default Next.js project running in a browser">
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              padding: "1.5rem 1rem",
              textAlign: "center",
              color: "#171717",
            }}
          >
            <div style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Next.js
            </div>
            <p style={{ margin: "0.75rem 0 0", color: "#525252" }}>
              Default starter app at{" "}
              <LocalUrl href="/" />
            </p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", color: "#737373" }}>
              You should see the Next.js logo and welcome content in Chrome.
            </p>
          </div>
        </LiveDemo>
        <p>
          You can start the app from any terminal, but prefer running{" "}
          <code>npm run dev</code>{" "}from the IDE: open the{" "}
          <code>webdev-client</code>{" "}folder in VS Code (or Cursor), show the
          terminal with <strong>View → Terminal</strong>{" "}if needed, and run the
          command there. Other browsers and editors are fine, but this course
          assumes <strong>Google Chrome</strong>{" "}and{" "}
          <strong>VS Code</strong>{" "}or <strong>Cursor</strong>{" "}
          unless noted otherwise.
        </p>

        <h3 id="sec-1-2-5" className="scroll-mt-6 font-sans text-xl font-semibold">
          1.2.5 Creating Pages and Routes with the App Router
        </h3>
        <p>
          Next.js user interfaces are written as JavaScript functions (or
          classes) called <strong>components</strong>. A component{" "}
          <em>computes</em>{" "}HTML: it can choose markup, text, or structure
          from data instead of returning the same static document every time.
          To make that easier to write, the syntax blurs the line between
          JavaScript and HTML — you put HTML-like markup right in the function.
          That mix is called{" "}
          <OfficialLink href="https://react.dev/learn/writing-markup-with-jsx">
            <strong>JSX</strong>
          </OfficialLink>{" "}
          (JavaScript XML). Files that use JSX typically end in{" "}
          <code>.jsx</code>. Chapter 3 covers JavaScript in more depth; for now,
          focus on the HTML-like markup inside each component.
        </p>
        <p>
          <strong>TypeScript</strong>{" "}is a superset of JavaScript that adds
          static typing. It has become the preferred language for many React and
          Next.js projects because types catch mistakes early, make larger
          codebases easier to refactor, and improve editor tooling (autocomplete,
          jump-to-definition, and clearer errors). Next.js supports TypeScript
          out of the box, and it is what this course uses. Component files
          therefore end in <code>.tsx</code>. When people say &quot;JSX&quot; in
          conversation, they often mean the markup syntax itself, whether the
          file is <code>.jsx</code>{" "}or <code>.tsx</code>.
        </p>
        <p>
          Before you create Lab 1, it helps to know how the browser address bar
          connects to files on disk. A <strong>URL path</strong>{" "}(for example{" "}
          <code>/labs/lab1</code>) is what the user opens. In Next.js we call
          that a <strong>route</strong>: a destination your app knows how to
          render. You do not register routes in a central config file for the
          basics of this course. Instead, the shape of folders under{" "}
          <code>app/</code>{" "}defines the routes.
        </p>
        <p>
          That folder-based system is the{" "}
          <OfficialLink href="https://nextjs.org/docs/app">
            <strong>App Router</strong>
          </OfficialLink>{" "}
          — Next.js
          &apos;s current routing model. It is part of the recommended defaults
          you accepted in <code>create-next-app</code>{" "}(the defaults line
          lists App Router; if you customized, you answered Yes to &quot;Would
          you like to use App Router? (recommended)&quot;). An older Next.js style put routes under
          a <code>pages/</code>{" "}directory (the Pages Router). This course uses
          the App Router exclusively: look for an <code>app/</code>{" "}folder, not{" "}
          <code>pages/</code>.
        </p>
        <p>
          Inside <code>app/</code>, the filename{" "}
          <code>page.tsx</code>{" "}is reserved. When a folder contains{" "}
          <code>page.tsx</code>, Next.js exposes that folder as a public route.
          Nested folders become nested path segments:
        </p>
        <ul>
          <li>
            <code>app/page.tsx</code>{" "}→ <code>/</code>{" "}(the site root)
          </li>
          <li>
            <code>app/labs/page.tsx</code>{" "}→ <code>/labs</code>
          </li>
          <li>
            <code>app/labs/lab1/page.tsx</code>{" "}→ <code>/labs/lab1</code>
          </li>
        </ul>
        <p>
          In the IDE Explorer, open the <code>app</code>{" "}directory and create
          Lab 1 at <code>app/labs/lab1/page.tsx</code>{" "}with the following
          source:
        </p>
        <CodeBlock language="tsx" name="Lab1" file="app/labs/lab1/page.tsx">{`export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>Lab1</code>{" "}is a default-exported React component. Because the
          file is named <code>page.tsx</code>{" "}under{" "}
          <code>app/labs/lab1/</code>, the App Router registers the route{" "}
          <code>/labs/lab1</code>. The function returns a <code>div</code>{" "}
          (division element) that contains an <code>h2</code>{" "}heading with the
          text &quot;Lab 1&quot;. Save the file, keep{" "}
          <code>npm run dev</code>{" "}running, and open{" "}
          <LocalUrl href="/labs/lab1" />{" "}in the browser to
          confirm it renders.
        </p>
        <LiveDemo name="Lab1" file="app/labs/lab1/page.tsx">
          <Lab1Starter />
        </LiveDemo>
        <p>
          As you add HTML examples in the next sections, keep{" "}
          <code>page.tsx</code>{" "}as a thin page that imports smaller components
          (one file per exercise) instead of pasting everything into this one
          file. Those exercise files — for example{" "}
          <code>HeadingTags.tsx</code>{" "}later in Lab 1 — are components, not
          new routes. Only <code>page.tsx</code>{" "}creates a URL; other{" "}
          <code>.tsx</code>{" "}files are imported into the page when you need
          them. Lab 1 stays a single URL while its content grows.
        </p>
        <p>
          The starter project also loads Tailwind CSS through{" "}
          <code>app/globals.css</code>. For the HTML exercises in this chapter we
          want the browser&apos;s default styling, so comment out that import in{" "}
          <code>app/layout.tsx</code>{" "}and leave the rest of the file alone:
        </p>
        <CodeBlock language="tsx" name="RootLayout" file="app/layout.tsx">{`import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// ... leave the rest of this file alone`}</CodeBlock>
        <p>
          Later chapters return to CSS and Tailwind when we start styling Kambaz
          and the labs more deliberately.
        </p>
      </Section>
    </>
  );
}
