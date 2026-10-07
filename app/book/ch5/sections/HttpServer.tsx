import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function HttpServer() {
  return (
    <>
      <Section
        level={3}
        id="sec-5-1-1"
        title="5.1.1 Introduction to Node.js"
      >
        <p>
          JavaScript is generally recognized as a programming language
          designed to execute in browsers, but it has been rescued from
          its browser confines by{" "}
          <OfficialLink href="https://nodejs.org/">
            Node.js
          </OfficialLink>
          . Node.js is a JavaScript runtime that interprets and executes
          applications written in JavaScript{" "}
          <em>outside</em>{" "}of browsers, such as from a desktop
          console or terminal. This allows JavaScript applications
          written for the desktop to overcome many limitations faced by
          those in the browser.
        </p>
        <p>
          JavaScript running in a browser is restricted, with no access
          to the filesystem or databases, and limited network
          capabilities. In contrast, JavaScript running on a desktop
          has full access to the filesystem, databases, and unrestricted
          network access. Conversely, desktop JavaScript applications
          generally lack a user interface and offer limited user
          interaction, while browser-based JavaScript applications
          provide rich and sophisticated interfaces for user
          interaction. That split is why this chapter keeps React in
          the browser and moves storage and request handling into a
          Node process: each runtime does the work it is good at.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-1-2"
        title="5.1.2 Installing Node.js"
      >
        <p>
          Node.js is a JavaScript runtime that can execute JavaScript
          on a desktop, allowing JavaScript programs to break out from
          the confines and limitations of a browser. Node.js was
          installed during previous chapters while implementing the
          React Web application. Confirm the installation and check the
          version by typing the following in your computer terminal or
          console application.
        </p>
        <CodeBlock language="shell">{`node -v
# v22.11.0`}</CodeBlock>
        <p>
          If a Node installation is present, its version will be
          displayed on the console; otherwise, an error message will be
          shown, indicating that Node.js needs to be downloaded and
          installed from{" "}
          <OfficialLink href="https://nodejs.org/en">
            nodejs.org
          </OfficialLink>
          . As of this writing, Node.js 22.11.0 was a current long-term
          support release, but any version recommended on Node&apos;s
          website can be installed. Once downloaded, double-click the
          installer, give the operating system the permissions it
          requests, accept the defaults, let the installer complete, and
          restart the computer if the installer asks. Once the computer
          is up and running again, confirm Node.js installed properly by
          running <code>node -v</code>{" "}again from the command line.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-1-3"
        title="5.1.3 Creating a Node.js Project"
      >
        <p>
          Another tool installed along with Node.js is{" "}
          <OfficialLink href="https://docs.npmjs.com/about-npm">
            npm
          </OfficialLink>{" "}
          — Node Package Manager — which has been used thus far to run
          React applications in previous chapters. The{" "}
          <code>npm</code>{" "}command can also install and execute
          Node.js packages on the local computer as well as create brand
          new Node.js projects. To create a Node.js project, create a
          directory with the name of the desired project and then change
          into that directory as shown below. Choose a directory name
          that does not contain any spaces, is all lowercase, and uses
          dashes between words.
        </p>
        <p>
          <strong>NOTE: DO NOT</strong>{" "}create the Node.js project
          directory inside the existing Next.js React project directory.
          The Next.js React project should be in a directory called{" "}
          <code>webdev-client</code>{" "}(or similar) and the new{" "}
          <code>webdev-server</code>{" "}directory{" "}
          <strong>SHOULD NOT</strong>{" "}be inside the Next.js React
          project directory. Instead, the two directories should be{" "}
          <strong>siblings</strong>{" "}— they should have the same
          parent directory.
        </p>
        <CodeBlock language="shell">{`mkdir webdev-server
cd webdev-server
npm init`}</CodeBlock>
        <p>
          Again: do not nest the server inside the Next.js tree. Once
          in the Node.js project directory,{" "}
          <code>npm init</code>{" "}kicks off an interactive session
          asking details about the project such as the name of the
          project and the author. Each question provides a default
          answer which can be accepted or skipped by just pressing
          enter. It is fine to initially keep all the default values
          since they can be configured later. A sample interaction looks
          like this:
        </p>
        <CodeBlock language="shell">{`package name: (webdev-server)
version: (1.0.0)
description: Node.js HTTP Web server for the Kambaz application
entry point: (index.js)
test command:
git repository: https://github.com/<you>/webdev-server
keywords: Node, REST, Server, HTTP, Web Development
author: Jose Annunziato
license: (ISC)`}</CodeBlock>
        <p>
          The configuration will be written into a new file called{" "}
          <code>package.json</code>{" "}in a JSON format and it is
          distinctive of Node.js projects, the way a{" "}
          <code>pom.xml</code>{" "}might be distinctive for Java
          projects. This interactive book ships a working copy at the
          repo root as <code>webdev-server/</code>{" "}so the interactive demos can
          call <code>http://localhost:4000</code>{" "}without cloning a
          second remote. It is still a{" "}
          <strong>separate project</strong>: own{" "}
          <code>package.json</code>, own{" "}
          <code>.gitignore</code>, own README. For the A5 hand-in you{" "}
          <code>git init</code>{" "}that folder and push a{" "}
          <strong>second</strong>{" "}GitHub repository named{" "}
          <code>webdev-server</code>{" "}(
          <SectionLink to="5.5.1" />) — do not treat it as Next.js app
          source.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-1-4"
        title="5.1.4 Creating a Simple Hello World Node.js Program"
      >
        <p>
          Open the Node.js project directory created earlier with an
          IDE such as Visual Studio Code or IntelliJ, and at the root of
          the project, create a JavaScript file called{" "}
          <code>Hello.js</code>{" "}with the content shown below. The
          script uses the <code>console.log()</code>{" "}function to
          print the string{" "}
          <code>Hello World!</code>{" "}to the console and it is a
          common first program to write when learning a new language or
          infrastructure.
        </p>
        <CodeBlock language="js" name="Hello" file="webdev-server/Hello.js">{`console.log("Hello World!");`}</CodeBlock>
        <p>
          At the command line, run the{" "}
          <code>Hello.js</code>{" "}application by using the{" "}
          <code>node</code>{" "}command and confirm the application
          prints Hello World! to the console as shown below.
        </p>
        <CodeBlock language="shell">{`node Hello.js
# Hello World!`}</CodeBlock>
        <p>
          Node.js programs consist of JavaScript files that are executed
          with the <code>node</code>{" "}command-line interpreter. The
          following sections describe writing JavaScript applications
          that implement HTTP Web servers and RESTful Web APIs to
          integrate with React user interfaces. Upcoming chapters
          describe writing JavaScript applications that store and
          retrieve data from databases such as{" "}
          <OfficialLink href="https://www.mongodb.com/">
            MongoDB
          </OfficialLink>
          . Later files turn this hello script into HTTP routes; the
          file name stays because we will export a function from it.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-1-5"
        title="5.1.5 Creating a Node.js HTTP Web Server"
      >
        <p>
          <OfficialLink href="https://expressjs.com/">
            Express
          </OfficialLink>{" "}
          is a very popular Node.js library that simplifies creating
          HTTP servers and Web APIs. Express HTTP servers can respond
          to HTTP requests from HTTP clients such as the React user
          interface implemented in earlier chapters. From the root
          directory of the Node.js project, install the express library
          from the terminal as shown below so it is listed in{" "}
          <code>package.json</code>:
        </p>
        <CodeBlock language="shell">{`npm install express`}</CodeBlock>
        <p>
          Confirm that an <code>express</code>{" "}entry appears in{" "}
          <code>package.json</code>{" "}in the{" "}
          <code>dependencies</code>{" "}property. It is important these
          dependencies are listed in{" "}
          <code>package.json</code>{" "}so that they can be re-installed
          by other colleagues or when deploying to remote servers and
          cloud platforms such as AWS, Heroku, or Render. New libraries
          are installed in a new folder called{" "}
          <code>node_modules</code>. More Node.js packages can be found
          at{" "}
          <OfficialLink href="https://www.npmjs.com/">
            npmjs.com
          </OfficialLink>
          .
        </p>
        <p>
          The following{" "}
          <code>index.js</code>{" "}implements an HTTP server that
          responds Hello World! when the server receives an HTTP request
          at the URL{" "}
          <code>http://localhost:4000/hello</code>. Copy and paste the
          URL in a browser to send the HTTP request and the browser
          will render the response from the server. The{" "}
          <code>require</code>{" "}function is equivalent to the{" "}
          <code>import</code>{" "}keyword and loads a library into the
          local source — we start with{" "}
          <code>require</code>{" "}so you see the older Node style, then{" "}
          <SectionLink to="5.1.7" />{" "}switches the project to ES
          modules. The <code>express()</code>{" "}function call creates
          an instance of the express library and assigns it to a local
          constant <code>app</code>. The{" "}
          <code>app</code>{" "}instance is used to configure the server
          on what to do when various types of requests are received. For
          instance the example below uses the{" "}
          <code>app.get()</code>{" "}function to configure an HTTP GET
          request handler by mapping the URL pattern{" "}
          <code>/hello</code>{" "}to a function that handles the HTTP
          request.
        </p>
        <CodeBlock
          language="js"
          name="index"
          file="webdev-server/index.js"
        >{`import express from "express";
const app = express();
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});
app.listen(4000);`}</CodeBlock>
        <p>
          A request to URL{" "}
          <code>http://localhost:4000/hello</code>{" "}triggers the
          function implemented in the second argument of{" "}
          <code>app.get()</code>. The handler function receives
          parameters <code>req</code>{" "}and{" "}
          <code>res</code>{" "}which allow the function to participate
          in the request/response interaction, common in client/server
          applications. The <code>res.send()</code>{" "}function
          responds to the request with the text Hello World! Use{" "}
          <code>node</code>{" "}to run the server from the root of the
          project as shown below.
        </p>
        <CodeBlock language="shell">{`node index.js`}</CodeBlock>
        <p>
          The application will run, start the server, and wait at port
          4000 for incoming HTTP requests. Point your browser to{" "}
          <code>http://localhost:4000/hello</code>{" "}and confirm the
          server responds with Hello World! Stop the server by pressing
          Ctrl+C. The string{" "}
          <code>http://localhost:4000/hello</code>{" "}is referred to as
          a URL (Uniform Resource Locator) and is used to locate a
          resource on the server. Local labs stay on 4000; a host can
          later set <code>PORT</code>{" "}so the same{" "}
          <code>listen</code>{" "}call works remotely.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-1-6"
        title="5.1.6 Configuring Nodemon to Automatically Restart Node.js Server"
      >
        <p>
          React Web applications automatically transpile and restart
          every time code changes. Node.js can be configured to behave
          the same way by installing a tool called{" "}
          <OfficialLink href="https://nodemon.io/">
            nodemon
          </OfficialLink>{" "}
          which monitors file changes and automatically restarts the
          Node application. Install nodemon as a development dependency
          of the server project — that way colleagues and Render get the
          same script without a global install:
        </p>
        <CodeBlock language="shell">{`npm install nodemon --save-dev
npx nodemon index.js
# later: npm run dev   (same command, after the script in 5.1.7)`}</CodeBlock>
        <p>
          You can also install nodemon globally with{" "}
          <code>npm install nodemon -g</code>{" "}(and{" "}
          <code>sudo</code>{" "}on macOS). Either works; this book
          prefers the project-local install so{" "}
          <code>package.json</code>{" "}records the tool. Now instead of
          using the <code>node</code>{" "}command to start the server,
          use nodemon. Confirm the server is still responding Hello
          World!. Change the response string to{" "}
          <code>Life is good!</code>{" "}and without stopping and
          restarting the server, refresh the browser and confirm that
          the server now responds with the new string. Keep this process
          running in the Node folder while{" "}
          <code>next dev</code>{" "}runs in the Next.js folder.
        </p>
        <p>
          To practice, create another endpoint mapped to the root of
          the application, e.g.,{" "}
          <code>/</code>. Navigate to{" "}
          <code>http://localhost:4000</code>{" "}with your browser and
          confirm the server responds with Welcome to Full Stack
          Development!
        </p>
        <CodeBlock
          language="js"
          name="index"
          file="webdev-server/index.js"
        >{`import express from "express";
const app = express();
app.get("/hello", (req, res) => {
  res.send("Life is good!");
});
app.get("/", (req, res) => {
  res.send("Welcome to Full Stack Development!");
});
app.listen(4000);`}</CodeBlock>
        <OnYourOwn>
          Hit{" "}
          <code>http://localhost:4000</code>{" "}and{" "}
          <code>/hello</code>{" "}in two tabs and confirm both strings.
        </OnYourOwn>
        <WithAI
          prompt={`In webdev-server/index.js, keep my /hello route. Add a sample GET / that sends Welcome to Full Stack Development! Do not remove hello.`}
        >
          Ask the assistant to add the root route — you still refresh
          both tabs:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-1-7"
        title="5.1.7 Configuring Node.js to Use ES6"
      >
        <p>
          The React Web application created in earlier chapters has
          used the <code>import</code>{" "}keyword to load ES6 modules,
          but older Node samples used the{" "}
          <code>require</code>{" "}keyword instead to accomplish the
          same thing. Since Node version 12, ES6 syntax is supported by
          configuring the <code>package.json</code>{" "}file and adding a
          new <code>&quot;type&quot;</code>{" "}property with value{" "}
          <code>&quot;module&quot;</code>{" "}as shown below. Add a{" "}
          <code>start</code>{" "}script so{" "}
          <code>npm start</code>{" "}runs the server the same way
          Render will, and a{" "}
          <code>dev</code>{" "}script so nodemon is one command:
        </p>
        <CodeBlock language="json" name="package" file="webdev-server/package.json">{`{
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}`}</CodeBlock>
        <p>
          Now, instead of using{" "}
          <code>require()</code>{" "}to load libraries, the familiar{" "}
          <code>import</code>{" "}statement can be used instead. Here is{" "}
          <code>index.js</code>{" "}refactored to use{" "}
          <code>import</code>{" "}instead of{" "}
          <code>require</code>. Restart the server, refresh the
          browser, and confirm that the server responds as expected.
          From here on every server file in this chapter is an ES
          module, including the{" "}
          <code>.js</code>{" "}extension on relative imports — Node
          requires that extension when{" "}
          <code>&quot;type&quot;: &quot;module&quot;</code>{" "}is set.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-1-8"
        title="5.1.8 Creating HTTP Routes"
      >
        <p>
          The <code>index.js</code>{" "}file creates and configures an
          HTTP server listening for incoming HTTP requests. So far we
          have created a simple hello HTTP route that responds with a
          simple string. Throughout this and later chapters, we are
          going to create quite a few other HTTP routes, too many to
          define them all in{" "}
          <code>index.js</code>. Instead, it is best practice to group
          routes into dedicated routing files that collect related HTTP
          routes. To illustrate this principle, move the routes defined
          in <code>index.js</code>{" "}to the{" "}
          <code>Hello.js</code>{" "}file created earlier.
        </p>
        <p>
          In our case{" "}
          <code>Hello.js</code>{" "}handles HTTP requests for a hello
          greeting and responds with a friendly reply. We are not done
          though. Notice that{" "}
          <code>Hello.js</code>{" "}would reference{" "}
          <code>app</code>{" "}which is undefined in that file if we
          merely copy the two{" "}
          <code>app.get</code>{" "}calls. The{" "}
          <code>app</code>{" "}variable represents an express instance
          which we would be tempted to create in the file, but instead
          only one instance should be shared across all routes
          implemented per server instance. Instead of creating a new
          express instance, pass{" "}
          <code>app</code>{" "}as a parameter in a function we can
          import and invoke from{" "}
          <code>index.js</code>{" "}as shown below.
        </p>
        <CodeBlock
          language="js"
          name="Hello"
          file="webdev-server/Hello.js"
        >{`export default function Hello(app) {
  const sayHello = (req, res) => {
    res.send("Life is good!");
  };
  const sayWelcome = (req, res) => {
    res.send("Welcome to Full Stack Development!");
  };
  app.get("/hello", sayHello);
  app.get("/", sayWelcome);
}`}</CodeBlock>
        <p>
          Although embedding the callback function declaration within
          the route definition is perfectly fine, that syntax can be
          challenging for some. An alternative — arguably better —
          syntax is to declare the callback functions on their own and
          then reference them in the route declarations, which is what
          the listing above does. Import{" "}
          <code>Hello.js</code>{" "}and pass{" "}
          <code>app</code>{" "}to the function as shown below. Note the{" "}
          <code>.js</code>{" "}extension on the import statement. Test{" "}
          <code>http://localhost:4000/hello</code>{" "}from the browser
          and confirm the reply is still friendly.
        </p>
        <CodeBlock
          language="js"
          name="index"
          file="webdev-server/index.js"
        >{`import express from "express";
import Hello from "./Hello.js";
const app = express();
Hello(app);
app.listen(4000);`}</CodeBlock>
        <p>
          Confirm{" "}
          <code>/hello</code>{" "}still replies Life is good! and the
          root still welcomes you to full stack development.{" "}
          <SectionLink to="5.2" />{" "}adds{" "}
          <code>Lab5/index.js</code>{" "}the same way: export a function
          that receives <code>app</code>, register it from{" "}
          <code>index.js</code>, and keep{" "}
          <code>index.js</code>{" "}as the one place that creates the
          server.
        </p>
      </Section>
    </>
  );
}
