import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import NestedExerciseList from "../../components/NestedExerciseList";
import { CH5_LAB_EXERCISES } from "../../exercise-lists/catalogs";
import Environment from "@/app/labs/lab5/intermediates/5-2-1-Environment";
import PathParameters from "@/app/labs/lab5/intermediates/5-2-2-1-PathParameters";
import QueryParameters from "@/app/labs/lab5/intermediates/5-2-2-2-QueryParameters";
import WorkingWithObjects from "@/app/labs/lab5/intermediates/5-2-3-WorkingWithObjects";
import WorkingWithArrays from "@/app/labs/lab5/intermediates/5-2-4-WorkingWithArrays";
import HttpClient from "@/app/labs/lab5/intermediates/5-2-5-HttpClient";
import WorkingWithObjectsAsynchronously from "@/app/labs/lab5/intermediates/5-2-5-WorkingWithObjectsAsync";
import WorkingWithArraysAsynchronously from "@/app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync";

export default function LabExercises() {
  return (
    <Section id="sec-5-2" title="5.2 Lab Exercises">
      <p>
        The following are a set of exercises to practice creating and
        integrating with an HTTP server from a React Web application.
        You need{" "}
        <strong>two terminals</strong>: one for the Next.js user
        interface on port 3000 and one for the sibling Express server
        on port 4000. Leave both running for the rest of the chapter.
        Express LiveDemos below call the companion through{" "}
        <code>httpServer()</code>.{" "}
        <SectionLink to="5.3" />{" "}Route Handler demos stay on
        same-origin <code>/api/...</code>{" "}and do not need port 4000.
      </p>
      <CodeBlock language="shell">{`# terminal 1 — Next.js UI (port 3000), from webdev-client
npm run dev

# terminal 2 — sibling Express (port 4000), from webdev-server
cd webdev-server
npm run dev          # nodemon index.js
# or: npm start      # node index.js`}</CodeBlock>
      <p>
        In your server application, create and import file{" "}
        <code>Lab5/index.js</code>{" "}where we will be implementing
        several server-side exercises. Create a route that welcomes
        users to Lab 5. Export a default function that accepts the
        shared <code>app</code>{" "}reference — the same pattern as{" "}
        <code>Hello.js</code>{" "}in{" "}
        <SectionLink to="5.1.8" />.
      </p>
      <CodeBlock
        language="js"
        name="Lab5"
        file="webdev-server/Lab5/index.js"
      >{`export default function Lab5(app) {
  app.get("/lab5/welcome", (req, res) => {
    res.send("Welcome to Lab 5");
  });
}`}</CodeBlock>
      <p>
        Import <code>Lab5/index.js</code>{" "}into the server{" "}
        <code>index.js</code>{" "}and pass it a reference to express as
        shown below. Restart the server and confirm that{" "}
        <code>http://localhost:4000/lab5/welcome</code>{" "}responds with
        the expected greeting.
      </p>
      <CodeBlock
        language="js"
        name="index"
        file="webdev-server/index.js"
      >{`import express from "express";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
const app = express();
Lab5(app);
Hello(app);
app.listen(4000);`}</CodeBlock>
      <p>
        In the React Web app project, create a Lab 5 React component to
        test the Node HTTP server. Import the new component into the
        existing set of labs and add a new link in the Labs TOC so you
        can navigate to Lab 5 by selecting the corresponding tab. The
        example below creates a hyperlink that navigates to the{" "}
        <code>http://localhost:4000/lab5/welcome</code>{" "}URL. Confirm
        the link navigates to the expected response. Do not hard-code
        the host for long — the next subsection replaces it with an
        environment variable. Style the link with Tailwind — a simple
        underline or list item.
      </p>
      <CodeBlock
        language="tsx"
        name="Lab5 page"
        file="app/labs/lab5/page.tsx"
      >{`export default function Lab5() {
  return (
    <div id="wd-lab5">
      <h2>Lab 5</h2>
      <a id="wd-welcome-link" href="http://localhost:4000/lab5/welcome">
        Welcome
      </a>
    </div>
  );
}`}</CodeBlock>

      <Section
        level={3}
        id="sec-5-2-1"
        title="5.2.1 Environment Variables"
      >
        <p>
          Currently we are integrating the React user interface with a
          Node server, both running locally on our development
          computers, but ultimately these will both be running on
          remote servers. Let us configure the local environment so
          that it will be easy later on to configure our source code to
          run in any environment. There are two environments to
          consider: the local development environment and the remote
          production environment. The local development environment
          consists of our computer where we do our development running
          two Node servers, one hosting the React user interface Web
          application, and the other hosting the Express HTTP server.
          The remote production environments will consist of the React
          user interface running on Vercel, and the Express HTTP server
          running on Render.com, Heroku, or AWS (your choice).
        </p>
        <p>
          Environments can be configured with environment variables
          declared in your operating system or as environment files in
          your project. Environment files are named{" "}
          <code>.env</code>{" "}(with a leading period) and can be
          defined for each environment by appending{" "}
          <code>.development</code>{" "}for the local development
          environment, <code>.test</code>{" "}for the test environment,
          and <code>.production</code>{" "}for the production
          environment. Instead of hardcoding{" "}
          <code>http://localhost:4000</code>{" "}everywhere in our source
          code, instead, declare an environment variable in the local
          environment file as shown below. Create the{" "}
          <code>.env.development</code>{" "}file at the root of your
          React project and copy the following content.
        </p>
        <CodeBlock language="shell">{`NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000`}</CodeBlock>
        <p>
          In Next.js React projects, all environment variables that
          must reach the browser start with{" "}
          <OfficialLink href="https://nextjs.org/docs/app/building-your-application/configuring/environment-variables">
            <code>NEXT_PUBLIC_</code>
          </OfficialLink>{" "}
          so that they are exported to client components. Each line
          declares a variable, followed by an equal sign, followed by
          the value of the variable. Make sure not to use extra spaces
          or unnecessary extra characters such as quotes, commas, or
          colons. Every time a new variable is added, removed, or
          changed in an environment file, the React user interface Web
          application needs to be restarted. Environment variables can
          be accessed from the React source code through the global{" "}
          <code>process</code>{" "}object, in its{" "}
          <code>env</code>{" "}property. For instance, to access the
          value of{" "}
          <code>NEXT_PUBLIC_HTTP_SERVER</code>{" "}declared above, use{" "}
          <code>process.env.NEXT_PUBLIC_HTTP_SERVER</code>.
        </p>
        <p>
          The variable is{" "}
          <code>NEXT_PUBLIC_HTTP_SERVER</code>. Wrap it in{" "}
          <code>httpServer()</code>{" "}so every Express LiveDemo uses
          the same client code — locally{" "}
          <code>http://localhost:4000</code>, and later whatever origin
          you set for deploy. Unset, the helper still points at the
          companion on 4000, which is enough for every LiveDemo in this
          chapter. <SectionLink to="5.5" />{" "}is when you point the
          same helper at a deployed origin. Do not hard-code the host
          in screens.
        </p>
        <CodeBlock
          language="ts"
          name="httpServer"
          file="app/lib/httpServer.ts"
        >{`export function httpServer(): string {
  const raw =
    process.env.NEXT_PUBLIC_HTTP_SERVER ??
    "http://localhost:4000";
  return raw.replace(/\\/$/, "");
}`}</CodeBlock>
        <p>
          To practice declaring and using environment variables, create
          the <code>Environment</code>{" "}component below and import it
          from the Lab 5 page. Confirm the browser displays the remote
          server URL as shown. Make sure the URL to the remote server
          is never used as a literal in the React source code; instead
          prefer the environment variable. Replace the{" "}
          <code>http://localhost:4000</code>{" "}in the previous Welcome
          hyperlink with the helper (or a constant assigned from{" "}
          <code>process.env.NEXT_PUBLIC_HTTP_SERVER</code>). Confirm
          that the Welcome hyperlink still works.
        </p>
        <CodeBlock
          language="tsx"
          name="Environment"
          file="app/labs/lab5/intermediates/5-2-1-Environment.tsx"
        >{`import { httpServer } from "@/app/lib/httpServer";
export default function Environment() {
  const HTTP_SERVER = httpServer();
  return (
    <div id="wd-lab5-environment">
      <h4>Environment</h4>
      <p>
        <code>NEXT_PUBLIC_HTTP_SERVER</code> = <code>{HTTP_SERVER}</code>
      </p>
      <a id="wd-welcome-link" className="text-blue-700 underline"
        href={\`\${HTTP_SERVER}/lab5/welcome\`}>
        Welcome
      </a>
    </div>
  );
}`}</CodeBlock>
        <p>
          Similarly, the Node Express server needs to be configured to
          run locally on your computer as well as when it is deployed
          in the remote environment. Refactor{" "}
          <code>index.js</code>{" "}so that it uses the remote{" "}
          <code>PORT</code>{" "}environment variable if available, or
          port 4000 when running locally:{" "}
          <code>app.listen(process.env.PORT || 4000)</code>.
        </p>
        <LiveDemo
          name="Environment"
          file="app/labs/lab5/intermediates/5-2-1-Environment.tsx"
          mode="styled"
        >
          <Environment />
        </LiveDemo>
        <OnYourOwn>
          Click Welcome and confirm the Express greeting — not a Next.js
          page.
        </OnYourOwn>
        <WithAI
          prompt={`Do not hard-code localhost:4000 in my Lab 5 Welcome link. Use process.env.NEXT_PUBLIC_HTTP_SERVER (or httpServer()) and keep id wd-welcome-link.`}
        >
          Ask the assistant to use the env var — you still click Welcome:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-2-2"
        title="5.2.2 Sending Data to a Server via HTTP Requests"
      >
        <p>
          Let us explore how we can integrate the React user interface
          with the Node server by sending information to the server
          from the browser. There are three ways to send information to
          the server:
        </p>
        <ol>
          <li>
            <strong>Path parameters</strong> — parameters are encoded
            as segments of the path itself, e.g.,{" "}
            <code>/lab5/add/2/5</code>.
          </li>
          <li>
            <strong>Query parameters</strong> — parameters are encoded
            as name value pairs in the query string after the{" "}
            <code>?</code>{" "}character at the end of a URL, e.g.,{" "}
            <code>/lab5/add?a=2&amp;b=5</code>.
          </li>
          <li>
            <strong>Request body</strong> — data is sent as a string
            representation of data encoded in some format such as XML
            or JSON containing properties and their values, e.g.,{" "}
            <code>{`{a: 2, b: 5}`}</code>.
          </li>
        </ol>
        <p>
          We will explore the first two in this section, and address
          the last one towards the end of the labs in{" "}
          <SectionLink to="5.2.6" />.
        </p>

        <Section
          level={3}
          id="sec-5-2-2-1"
          title="5.2.2.1 Sending Data to a Server with Path Parameters"
        >
          <p>
            React applications can pass data to servers by embedding it
            in a URL path as path parameters part of a URL. For
            instance the last two integers — 2 and 4 — at the end of
            the following URL can be parsed by a corresponding matching
            route on the server, add the two integers, and respond with
            the result of 6:{" "}
            <code>/lab5/add/2/4</code>. The following route
            declarations can parse path parameters{" "}
            <code>a</code>{" "}and{" "}
            <code>b</code>{" "}encoded in paths{" "}
            <code>/lab5/add/:a/:b</code>{" "}and{" "}
            <code>/lab5/subtract/:a/:b</code>. In{" "}
            <code>PathParameters.js</code>, implement the routes below
            and import it in{" "}
            <code>Lab5/index.js</code>. On your own create routes{" "}
            <code>/lab5/multiply/:a/:b</code>{" "}and{" "}
            <code>/lab5/divide/:a/:b</code>{" "}that calculate the
            arithmetic multiplication and division.
          </p>
          <p>
            Retrieve path parameters as strings from{" "}
            <code>req.params</code>, parse them as integers, then send
            the result as a <em>string</em>. Do not send a bare
            integer: browsers and some HTTP clients treat a numeric
            body as a status code, so{" "}
            <code>res.send(6)</code>{" "}can look like a 6 status
            instead of the text six. Convert with{" "}
            <code>.toString()</code>.
          </p>
          <CodeBlock
            language="js"
            name="PathParameters"
            file="webdev-server/Lab5/PathParameters.js"
          >{`export default function PathParameters(app) {
  const add = (req, res) => {
    const { a, b } = req.params;
    const sum = parseInt(a) + parseInt(b);
    res.send(sum.toString());
  };
  const subtract = (req, res) => {
    const { a, b } = req.params;
    res.send((parseInt(a) - parseInt(b)).toString());
  };
  app.get("/lab5/add/:a/:b", add);
  app.get("/lab5/subtract/:a/:b", subtract);
}`}</CodeBlock>
          <p>
            Note when you import, make sure to include the extension{" "}
            <code>.js</code>. Pass a reference of{" "}
            <code>app</code>{" "}to the PathParameters function. Confirm
            that <code>http://localhost:4000/lab5/add/6/4</code>{" "}
            responds with 10 and{" "}
            <code>http://localhost:4000/lab5/subtract/6/4</code>{" "}
            responds with 2. Also confirm the routes you implemented
            on your own.
          </p>
          <CodeBlock
            language="js"
            name="Lab5"
            file="webdev-server/Lab5/index.js"
          >{`import PathParameters from "./PathParameters.js";
export default function Lab5(app) {
  app.get("/lab5/welcome", (req, res) => {
    res.send("Welcome to Lab 5");
  });
  PathParameters(app);
}`}</CodeBlock>
          <p>
            Meanwhile, in the React Web application, let us create a
            React component to test the new routes from our Web
            application. Web applications that interact with server
            applications are often referred to as client applications
            since they are the client in an application built using a
            client/server architecture. Create the component below that
            declares state variables{" "}
            <code>a</code>{" "}and{" "}
            <code>b</code>, encodes the values in hyperlinks, and when
            you click them, the server responds with the addition or
            subtraction of the parameters. Note that the name of the
            component is arbitrary. The fact that it is called the same
            as the routes in the server is a coincidence. It also
            helps us keep track of which UI components on the client
            are related to the server resources. On your own, create
            links that invoke the multiply and divide routes you
            implemented earlier. Import the new component in your Lab
            5 component and confirm that clicking the links generates
            the expected response. Use Tailwind inputs and colored
            buttons: rounded borders and{" "}
            <code>bg-blue-600</code>.
          </p>
          <CodeBlock
            language="tsx"
            name="PathParameters"
            file="app/labs/lab5/intermediates/5-2-2-1-PathParameters.tsx"
          >{`const HTTP_SERVER = httpServer();
const [a, setA] = useState("34");
const [b, setB] = useState("23");
<a id="wd-path-parameter-add"
  href={\`\${HTTP_SERVER}/lab5/add/\${a}/\${b}\`}>
  Add {a} + {b}
</a>`}</CodeBlock>
          <LiveDemo
            name="PathParameters"
            file="app/labs/lab5/intermediates/5-2-2-1-PathParameters.tsx"
            mode="styled"
          >
            <PathParameters />
          </LiveDemo>
          <OnYourOwn>
            Implement multiply and divide path routes and matching
            links with ids starting <code>wd-path-parameter-</code>.
          </OnYourOwn>
        </Section>

        <Section
          level={3}
          id="sec-5-2-2-2"
          title="5.2.2.2 Sending Data to a Server with Query Parameters"
        >
          <p>
            React applications can also send data to servers by
            encoding it as a query string after the question mark
            character (<code>?</code>) at the end of a URL. A query
            string consists of a list of name value pairs separated by
            the ampersand character (
            <code>&amp;</code>) as shown below:{" "}
            <code>/lab5/calculator?operation=add&amp;a=2&amp;b=4</code>.
            In <code>Lab5/QueryParameters.js</code>, in your server
            application, create a route that can parse an operation and
            its parameters <code>a</code>{" "}and{" "}
            <code>b</code>. If the operation is add the route responds
            with the addition of the parameters. If the operation is
            subtract, the route responds with the subtraction of the
            parameters. On your own, also handle operations multiply
            and divide. Import{" "}
            <code>QueryParameters.js</code>{" "}in{" "}
            <code>Lab5/index.js</code>{" "}and pass it a reference of{" "}
            <code>app</code>. Read the values from{" "}
            <code>req.query</code>{" "}— they arrive as strings, the
            same as path parameters — and send the result as a string
            so the browser does not treat it as a status code.
          </p>
          <CodeBlock
            language="js"
            name="QueryParameters"
            file="webdev-server/Lab5/QueryParameters.js"
          >{`export default function QueryParameters(app) {
  const calculator = (req, res) => {
    const { a, b, operation } = req.query;
    let result = 0;
    switch (operation) {
      case "add":
        result = parseInt(a) + parseInt(b);
        break;
      case "subtract":
        result = parseInt(a) - parseInt(b);
        break;
      default:
        result = "Invalid operation";
    }
    res.send(result.toString());
  };
  app.get("/lab5/calculator", calculator);
}`}</CodeBlock>
          <p>
            In a new component{" "}
            <code>QueryParameters.tsx</code>, in your React Web
            application, create hyperlinks to test the new route.
            You will need a constant initialized to the environment
            variable through{" "}
            <code>httpServer()</code>. Confirm the following
            hyperlinks work as expected: add with 34 and 23 should
            respond 57; subtract should respond 11. Create additional
            links to test multiply and divide, using IDs starting with{" "}
            <code>wd-query-parameter-</code>.
          </p>
          <CodeBlock
            language="tsx"
            name="QueryParameters"
            file="app/labs/lab5/intermediates/5-2-2-2-QueryParameters.tsx"
          >{`<a id="wd-query-parameter-add"
  href={\`\${HTTP_SERVER}/lab5/calculator?operation=add&a=\${a}&b=\${b}\`}>
  Add {a} + {b}
</a>`}</CodeBlock>
          <LiveDemo
            name="QueryParameters"
            file="app/labs/lab5/intermediates/5-2-2-2-QueryParameters.tsx"
            mode="styled"
          >
            <QueryParameters />
          </LiveDemo>
        </Section>

        <Section
          level={3}
          id="sec-5-2-2-3"
          title="5.2.2.3 On Your Own"
        >
          <p>
            On your own, remember to implement multiply and divide
            requests on the client and server that demonstrate
            multiplying and dividing numbers encoded in the
            request&apos;s path. Now implement the same operations
            again, multiply and divide on the server and client, but
            multiplying and dividing parameters encoded in the query
            string. Both pairs of links should appear in the LiveDemos
            above once you finish — path IDs start with{" "}
            <code>wd-path-parameter-</code>, query IDs with{" "}
            <code>wd-query-parameter-</code>.
          </p>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-5-2-3"
        title="5.2.3 Working with Remote Objects on a Server"
      >
        <p>
          The examples so far have demonstrated working with integers
          and strings, but all primitive datatypes work as well,
          including objects and arrays. The example below declares an
          assignment object accessible at the route{" "}
          <code>/lab5/assignment</code>. Import it into your{" "}
          <code>Lab5/index.js</code>{" "}in your server. The object
          state persists as long as the server is running; changes to
          the object persist until you reboot, which resets the object
          to the seed values. Use{" "}
          <code>res.json</code>{" "}instead of{" "}
          <code>res.send</code>{" "}when you know the response is
          formatted as JSON so Express sets the content type and
          serializes the object for you.
        </p>
        <CodeBlock
          language="js"
          name="WorkingWithObjects"
          file="webdev-server/Lab5/WorkingWithObjects.js"
        >{`const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};
export default function WorkingWithObjects(app) {
  const getAssignment = (req, res) => {
    res.json(assignment);
  };
  app.get("/lab5/assignment", getAssignment);
}`}</CodeBlock>

        <Section
          level={3}
          id="sec-5-2-3-1"
          title="5.2.3.1 Retrieving Objects from a Server"
        >
          <p>
            In your React project, create a{" "}
            <code>WorkingWithObjects</code>{" "}component to test the
            new route as shown below. Import it in Lab 5 and confirm
            that <code>http://localhost:4000/lab5/assignment</code>{" "}
            responds with the assignment object. The Get Assignment
            hyperlink navigates the browser to that URL so you can see
            the raw JSON — later sections will fetch the same object
            without leaving the page.
          </p>
          <CodeBlock
            language="tsx"
            name="Retrieving Objects"
            file="app/labs/lab5/intermediates/5-2-3-WorkingWithObjects.tsx"
          >{`<h4>Retrieving Objects</h4>
<a id="wd-retrieve-assignments"
  className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
  href={\`\${HTTP_SERVER}/lab5/assignment\`}>
  Get Assignment
</a>`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-3-2"
          title="5.2.3.2 Retrieving Object Properties from a Server"
        >
          <p>
            We can retrieve individual properties in an object such as
            the title shown below. Add a{" "}
            <code>getAssignmentTitle</code>{" "}handler that responds
            with only <code>assignment.title</code>, mapped to{" "}
            <code>/lab5/assignment/title</code>. Confirm that{" "}
            <code>http://localhost:4000/lab5/assignment/title</code>{" "}
            retrieves the assignment&apos;s title. In{" "}
            <code>WorkingWithObjects</code>, add a link that retrieves
            the title as shown below. Confirm that clicking the link
            retrieves the assignment&apos;s title as a JSON string.
          </p>
          <CodeBlock
            language="js"
            name="getAssignmentTitle"
            file="webdev-server/Lab5/WorkingWithObjects.js"
          >{`const getAssignmentTitle = (req, res) => {
  res.json(assignment.title);
};
app.get("/lab5/assignment/title", getAssignmentTitle);
app.get("/lab5/assignment", getAssignment);`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="Retrieving Properties"
            file="app/labs/lab5/intermediates/5-2-3-WorkingWithObjects.tsx"
          >{`<h4>Retrieving Properties</h4>
<a id="wd-retrieve-assignment-title"
  href={\`\${HTTP_SERVER}/lab5/assignment/title\`}>
  Get Title
</a>`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-3-3"
          title="5.2.3.3 Modifying Objects in a Server"
        >
          <p>
            We can also use routes to modify objects or individual
            properties as shown below. The route retrieves the new
            title from the path and updates the assignment object&apos;s
            title property. Changes to objects in the server persist as
            long as the server is running; rebooting the server resets
            the object state to the constants at the top of the file.
          </p>
          <CodeBlock
            language="js"
            name="setAssignmentTitle"
            file="webdev-server/Lab5/WorkingWithObjects.js"
          >{`const setAssignmentTitle = (req, res) => {
  const { newTitle } = req.params;
  assignment.title = newTitle;
  res.json(assignment);
};
app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);`}</CodeBlock>
          <p>
            In the{" "}
            <code>WorkingWithObjects</code>{" "}component in your React
            project, create an assignment state variable to test
            editing the assignment object on the server. Create an
            input field where we can type the new assignment title, and
            a link that invokes the route that updates the title.
            Eventually we will fetch this initial data from the server
            and populate the form with the remote data so we can
            modify it here in the UI; for now the seed matches the
            server object so the first click is a no-op until you type.
            Confirm that you can change the assignment&apos;s title:
            type a new string, click Update Title, then click Get
            Assignment and see the new title in the JSON.
          </p>
          <CodeBlock
            language="tsx"
            name="Modifying Properties"
            file="app/labs/lab5/intermediates/5-2-3-WorkingWithObjects.tsx"
          >{`const [assignment, setAssignment] = useState({
  id: 1, title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10", completed: false, score: 0,
});
const ASSIGNMENT_API_URL = \`\${HTTP_SERVER}/lab5/assignment\`;
<a id="wd-update-assignment-title"
  href={\`\${ASSIGNMENT_API_URL}/title/\${assignment.title}\`}>
  Update Title
</a>
<input id="wd-assignment-title" value={assignment.title}
  onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} />`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-3-4"
          title="5.2.3.4 On Your Own"
        >
          <p>
            Now, on your own, create a module object with string
            properties <code>id</code>,{" "}
            <code>name</code>,{" "}
            <code>description</code>, and{" "}
            <code>course</code>. Feel free to use values of your
            choice. Create a route that responds with the module
            object, mapped to{" "}
            <code>/lab5/module</code>. In the UI, create a link
            labeled Get Module that retrieves the module object from
            the server. Confirm that clicking the link retrieves the
            module. Create another route mapped to{" "}
            <code>/lab5/module/name</code>{" "}that retrieves the name
            of the module created earlier. In the UI, create a
            hyperlink labeled Get Module Name that retrieves the name
            of the module object. Confirm that clicking the link
            retrieves the module&apos;s name.
          </p>
          <p>
            On your own, in{" "}
            <code>WorkingWithObjects.tsx</code>, create a module state
            variable to test editing the module object on the server.
            Create an input field where we can type the new module
            name, and a link that invokes the route that updates the
            name. Confirm that you can change the module&apos;s name.
            Create routes and a corresponding UI that can modify the
            score and completed properties of the assignment object. In
            the React application, create an input field of type
            number where you can type the new score and an input field
            of type checkbox where you can select the completed
            property. Create a link that updates the score and another
            link that updates the completed property. For the module,
            create routes and UI to edit the module&apos;s description.
          </p>
          <LiveDemo
            name="WorkingWithObjects"
            file="app/labs/lab5/intermediates/5-2-3-WorkingWithObjects.tsx"
            mode="styled"
          >
            <WorkingWithObjects />
          </LiveDemo>
          <OnYourOwn>
            Add a module object at <code>/lab5/module</code>, Get Module
            Name, and routes that edit assignment score/completed and the
            module description.
          </OnYourOwn>
          <WithAI
            prompt={`Do not implement my module routes. List the /lab5/module URLs I still need (object, name, update name, update description) as a short checklist.`}
          >
            Ask the assistant for a URL checklist — you still write the
            routes:
          </WithAI>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-5-2-4"
        title="5.2.4 Working with Remote Arrays on a Server"
      >
        <p>
          Now let us work with something a little more challenging.
          Create an array of objects and explore how to retrieve, add,
          remove, and update the array. Working with a collection of
          objects requires a general set of operations often referred
          to as{" "}
          <strong>CRUD</strong>{" "}or create, read, update, and
          delete. These operations capture common interactions with
          any collection of data such as creating and adding new
          instances to the collection, reading or retrieving items in a
          collection, updating or modifying items in a collection, and
          deleting or removing items from a collection. Same process
          memory as the assignment object — reboot resets the seed.
        </p>

        <Section
          level={3}
          id="sec-5-2-4-1"
          title="5.2.4.1 Retrieving Arrays from a Server"
        >
          <p>
            Let us first create the array data structure containing
            several todo objects. The most common integration between a
            client and server application is for a client application
            to retrieve all the instances of some collection. To
            illustrate this, create a route that retrieves the array of
            todo objects as shown below. Import the new route to{" "}
            <code>Lab5/index.js</code>. Point the browser to{" "}
            <code>http://localhost:4000/lab5/todos</code>{" "}and confirm
            the server responds with the array of todos.
          </p>
          <CodeBlock
            language="js"
            name="WorkingWithArrays"
            file="webdev-server/Lab5/WorkingWithArrays.js"
          >{`let todos = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: true },
];
export default function WorkingWithArrays(app) {
  const getTodos = (req, res) => {
    res.json(todos);
  };
  app.get("/lab5/todos", getTodos);
}`}</CodeBlock>
          <p>
            In a new React component, create a hyperlink to test
            retrieving all todo objects in the array from the client.
            Add the new component to the Lab 5 component and confirm
            that clicking the link retrieves the array.
          </p>
          <CodeBlock
            language="tsx"
            name="Retrieving Arrays"
            file="app/labs/lab5/intermediates/5-2-4-WorkingWithArrays.tsx"
          >{`const API = \`\${HTTP_SERVER}/lab5/todos\`;
<a id="wd-retrieve-todos" href={API}>Get Todos</a>`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-4-2"
          title="5.2.4.2 Retrieving Data From a Server by Primary Key"
        >
          <p>
            Another common operation is to retrieve a particular item
            from an array by its primary key, e.g., its ID property.
            The convention is to encode the ID of the item of interest
            as a path parameter. Note that we could have chosen to
            encode the ID as a query parameter instead, but it is best
            practice to encode identifiers in the path instead. The
            example below parses the ID as a path parameter, finds the
            corresponding item, and responds with the item. Add a
            hyperlink to the React component to test retrieving an
            item from the array by its primary key. Confirm that you
            can type the ID in the UI and clicking the hyperlink
            retrieves the corresponding item.
          </p>
          <CodeBlock
            language="js"
            name="getTodoById"
            file="webdev-server/Lab5/WorkingWithArrays.js"
          >{`const getTodoById = (req, res) => {
  const { id } = req.params;
  const todo = todos.find((t) => t.id === parseInt(id));
  res.json(todo);
};
app.get("/lab5/todos", getTodos);
app.get("/lab5/todos/:id", getTodoById);`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="Get Todo by ID"
            file="app/labs/lab5/intermediates/5-2-4-WorkingWithArrays.tsx"
          >{`const [todo, setTodo] = useState({ id: "1" });
<a id="wd-retrieve-todo-by-id" href={\`\${API}/\${todo.id}\`}>
  Get Todo by ID
</a>
<input id="wd-todo-id" value={todo.id}
  onChange={(e) => setTodo({ ...todo, id: e.target.value })} />`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-4-3"
          title="5.2.4.3 Filtering Data From a Server With a Query String"
        >
          <p>
            The convention for retrieving a particular item from a
            collection is to encode the item&apos;s ID as a path
            parameter, e.g.,{" "}
            <code>/todos/123</code>. Another convention is that if the
            primary key is not provided, then the interpretation is
            that we want the entire collection of items, e.g.,{" "}
            <code>/todos</code>. We can also want to retrieve items by
            some other criteria other than the item&apos;s ID such as
            the item&apos;s title or completed properties. The best
            practice in this case is to use query strings instead of
            path parameters when filtering items by properties other
            than the primary key, e.g.,{" "}
            <code>/todos?completed=true</code>. The example below
            refactors <code>/lab5/todos</code>{" "}to handle the case
            when we want to filter the array by the completed query
            parameter. Add a hyperlink to the React component to test
            retrieving all completed todos.
          </p>
          <CodeBlock
            language="js"
            name="filter todos"
            file="webdev-server/Lab5/WorkingWithArrays.js"
          >{`const getTodos = (req, res) => {
  const { completed } = req.query;
  if (completed !== undefined) {
    const completedBool = completed === "true";
    res.json(todos.filter((t) => t.completed === completedBool));
    return;
  }
  res.json(todos);
};`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="Filtering Array Items"
            file="app/labs/lab5/intermediates/5-2-4-WorkingWithArrays.tsx"
          >{`<a id="wd-retrieve-completed-todos" href={\`\${API}?completed=true\`}>
  Get Completed Todos
</a>`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-4-4"
          title="5.2.4.4 Creating New Data in a Server"
        >
          <p>
            The examples we have seen so far have illustrated various
            read operations in our exploration of possible CRUD
            operations. Let us now take a look at the create operation.
            The example below demonstrates a route that creates a new
            item in the array and responds with the array now
            containing the new item. Note that it is implemented{" "}
            <em>before</em>{" "}the{" "}
            <code>/lab5/todos/:id</code>{" "}route, otherwise the{" "}
            <code>:id</code>{" "}path parameter would interpret the
            word <code>create</code>{" "}in{" "}
            <code>/lab5/todos/create</code>{" "}as an ID, which would
            certainly create an error trying to parse it as an integer.
            Also note that the new todo creates default values
            including a unique identifier field{" "}
            <code>id</code>{" "}based on a timestamp. Eventually
            primary keys will be handled by a database later in the
            course. Finally note that the response consists of the
            entire todos array, which is convenient for us for now, but
            a more common implementation would be to respond with only{" "}
            <code>newTodo</code>.
          </p>
          <CodeBlock
            language="js"
            name="createNewTodo"
            file="webdev-server/Lab5/WorkingWithArrays.js"
          >{`const createNewTodo = (req, res) => {
  const newTodo = {
    id: new Date().getTime(),
    title: "New Task",
    completed: false,
  };
  todos.push(newTodo);
  res.json(todos);
};
app.get("/lab5/todos/create", createNewTodo);
app.get("/lab5/todos/:id", getTodoById);`}</CodeBlock>
          <p>
            Add a Create Todo hyperlink to the{" "}
            <code>WorkingWithArrays</code>{" "}component to test the new
            route. Confirm that clicking the link creates the new item
            in the array — Get Todos afterwards should include New
            Task.
          </p>
          <CodeBlock
            language="tsx"
            name="Creating new Items"
            file="app/labs/lab5/intermediates/5-2-4-WorkingWithArrays.tsx"
          >{`<a id="wd-create-todo" href={\`\${API}/create\`}>Create Todo</a>`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-4-5"
          title="5.2.4.5 Deleting Data from a Server"
        >
          <p>
            Next let us consider the delete operation in the CRUD
            family of operations. The convention is to encode the ID of
            the item to delete as a path parameter as shown below. We
            search for the item in the set of items and remove it.
            Typically we would respond with a status of success or
            failure, but for now we are responding with all the todos.
            To test the new route, create a link that encodes the
            todo&apos;s ID in a hyperlink to delete the corresponding
            item. We will use the todo state variable created earlier
            to type the ID of the item we want to remove. Confirm that
            you can type the ID of an item, click the hyperlink, and
            that the corresponding item is removed from the array.
          </p>
          <CodeBlock
            language="js"
            name="removeTodo"
            file="webdev-server/Lab5/WorkingWithArrays.js"
          >{`const removeTodo = (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
  todos.splice(todoIndex, 1);
  res.json(todos);
};
app.get("/lab5/todos/:id/delete", removeTodo);`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="Removing from an Array"
            file="app/labs/lab5/intermediates/5-2-4-WorkingWithArrays.tsx"
          >{`<a id="wd-remove-todo" href={\`\${API}/\${todo.id}/delete\`}>
  Remove Todo with ID = {todo.id}
</a>`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-4-6"
          title="5.2.4.6 Updating Data on a Server"
        >
          <p>
            Finally let us consider the update operation in the CRUD
            family of operations. The convention is to encode the ID of
            the item to update as a path parameter as shown below. We
            search for the item in the set of items and update it.
            Typically we would respond with a status of success or
            failure, but for now we are responding with all the todos.
            Group the callback functions together towards the top of
            the routing file and the route declarations grouped towards
            the bottom of the file. To test the new route, add an input
            field to edit the title property and a link that encodes
            both the ID of the item and the new value of the title
            property as shown below.
          </p>
          <CodeBlock
            language="js"
            name="updateTodoTitle"
            file="webdev-server/Lab5/WorkingWithArrays.js"
          >{`const updateTodoTitle = (req, res) => {
  const { id, title } = req.params;
  const todo = todos.find((t) => t.id === parseInt(id));
  todo.title = title;
  res.json(todos);
};
app.get("/lab5/todos/:id/title/:title", updateTodoTitle);`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="Updating an Item"
            file="app/labs/lab5/intermediates/5-2-4-WorkingWithArrays.tsx"
          >{`<a href={\`\${API}/\${todo.id}/title/\${todo.title}\`} id="wd-update-todo-title">
  Update Todo
</a>
<input value={todo.id} onChange={(e) => setTodo({ ...todo, id: e.target.value })} />
<input value={todo.title} onChange={(e) => setTodo({ ...todo, title: e.target.value })} />`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-4-7"
          title="5.2.4.7 On Your Own"
        >
          <p>
            Using the exercises so far as examples, implement routes
            and corresponding UI that allows editing completed and
            description properties of todo items identified by their
            ID. Create the routes below in the Node.js HTTP server
            project. In the{" "}
            <code>WorkingWithArrays</code>{" "}component, add a text
            input field to edit the description and a checkbox input
            field to edit the completed property. Create a link that
            updates the description of the todo item whose id is
            encoded in the URL and another link that updates the
            completed property of the todo item whose id is encoded in
            the URL.
          </p>
          <ul>
            <li>
              completed —{" "}
              <code>/lab5/todos/:id/completed/:completed</code>{" "}—
              responds with todos — test link Complete Todo ID = 1
            </li>
            <li>
              description —{" "}
              <code>/lab5/todos/:id/description/:description</code>{" "}—
              responds with todos — test link Describe Todo ID = 1
            </li>
          </ul>
          <LiveDemo
            name="WorkingWithArrays"
            file="app/labs/lab5/intermediates/5-2-4-WorkingWithArrays.tsx"
            mode="styled"
          >
            <WorkingWithArrays />
          </LiveDemo>
          <OnYourOwn>
            Add{" "}
            <code>/lab5/todos/:id/completed/:completed</code>{" "}and{" "}
            <code>/lab5/todos/:id/description/:description</code>{" "}plus
            matching links.
          </OnYourOwn>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-5-2-5"
        title="5.2.5 Asynchronous Communication with HTTP Servers"
      >
        <p>
          The exercises explored so far sent data encoded in the URL of
          hyperlinks. The links navigated to a separate browser window
          that displayed the server response. Even though we were able
          to send data to the server and affect changes to the server
          data, we have not considered how those changes can affect the
          user interface. Let us explore how to fully integrate the
          user interface with the server by sending and receiving HTTP
          requests and responses asynchronously.
        </p>

        <Section
          level={3}
          id="sec-5-2-5-1"
          title="5.2.5.1 Asynchronous JavaScript and XML"
        >
          <p>
            JavaScript Web applications, such as React applications,
            can communicate with server applications using a technology
            called{" "}
            <OfficialLink href="https://en.wikipedia.org/wiki/Ajax_(programming)">
              AJAX
            </OfficialLink>{" "}
            or Asynchronous JavaScript and XML. Using AJAX, JavaScript
            applications can send and retrieve HTTP requests and
            responses asynchronously from client JavaScript
            applications to a remote HTTP server. Although XML was the
            original data format in AJAX, JSON has overtaken as the
            dominant data format in modern Web applications, but the
            AJAX label still applies nevertheless.{" "}
            <OfficialLink href="https://axios-http.com/">
              Axios
            </OfficialLink>{" "}
            is a popular JavaScript library that React user interface
            applications can use to communicate with servers using
            AJAX. Install the library at the root of the React Web
            application project as shown below.
          </p>
          <CodeBlock language="shell">{`npm install axios`}</CodeBlock>
          <p>
            Let us use the same server routes implemented in earlier
            exercises, but instead of clicking on hyperlinks in the
            React client, we will use axios to programmatically invoke
            the URLs, giving us a chance to capture and handle the
            responses from the server and render the response in the
            user interface. The code below illustrates how to use the
            axios library to send an asynchronous request to the
            server and then capture the response in the user
            interface, without navigating to the URL, away from the
            current window. The{" "}
            <code>fetchWelcomeOnClick</code>{" "}function is tagged as{" "}
            <code>async</code>{" "}since it uses{" "}
            <code>axios.get()</code>{" "}to asynchronously send a
            request to the server, and returns the response from the
            server. Create the component below and import it in the
            Lab 5 component. Open the Web Dev Tools and confirm that
            clicking the Fetch Welcome button causes a CORS error the
            first time — that is expected until the next subsection.
          </p>
          <CodeBlock
            language="tsx"
            name="HttpClient"
            file="app/labs/lab5/intermediates/5-2-5-HttpClient.tsx"
          >{`import axios from "axios";
const HTTP_SERVER = httpServer();
const [welcomeOnClick, setWelcomeOnClick] = useState("");
const fetchWelcomeOnClick = async () => {
  const response = await axios.get(\`\${HTTP_SERVER}/lab5/welcome\`);
  setWelcomeOnClick(response.data);
};
<button type="button" onClick={fetchWelcomeOnClick}>Fetch Welcome</button>
<p>Response from server: <b>{welcomeOnClick}</b></p>`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-5-2"
          title="5.2.5.2 Configuring Cross Origin Request Sharing (CORS)"
        >
          <p>
            Servers and browsers limit JavaScript programs to only be
            able to communicate with the servers from where they are
            downloaded. Since our React application is running locally
            from <code>localhost:3000</code>, then they would only be
            able to communicate back to a server running on{" "}
            <code>localhost:3000</code>, but our server is running on{" "}
            <code>localhost:4000</code>, so when our JavaScript
            components try to communicate with{" "}
            <code>localhost:4000</code>, the browser considers a
            different origin as a security risk, stops the
            communication, and throws a{" "}
            <OfficialLink href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">
              CORS
            </OfficialLink>{" "}
            exception. This course&apos;s Next.js UI is port 3000. The
            mismatch with Express on 4000 is the same problem any
            two-origin setup has.
          </p>
          <p>
            CORS stands for Cross-Origin Resource Sharing, which
            governs the policies and mechanisms of how various
            resources can be shared across different domains or
            origins. Browsers enforce CORS policies by first checking
            with the server if they are okay with receiving requests
            from different domains. If the server responds
            affirmatively, then browsers let the requests go through,
            otherwise they will consider the attempt as a violation of
            CORS security policy, abort the request, and throw the
            exception. We can configure the CORS security policies by
            installing the cors Node.js library as shown below.
          </p>
          <CodeBlock language="shell">{`npm install cors`}</CodeBlock>
          <p>
            In <code>index.js</code>, import the cors library and
            configure it as shown below to allow all requests from any
            origin. We will narrow down this policy in a later section
            when sessions and cookies arrive. Make sure cors is used
            right after creating the{" "}
            <code>app</code>{" "}express instance and before the
            routes. Restart the server and refresh the React
            application. Confirm that the user interface is able to
            retrieve the Welcome to Lab 5 message from the server
            without errors.
          </p>
          <CodeBlock
            language="js"
            name="cors"
            file="webdev-server/index.js"
          >{`import cors from "cors";
const app = express();
app.use(cors());
Lab5(app);`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-5-3"
          title="5.2.5.3 Creating a Client Library"
        >
          <p>
            The current HttpClient implementation makes a request to
            the server from the component itself using the axios
            library. In addition to retrieving (or reading) data from
            the server, there will be other CRUD operations to create,
            update, and delete needed to interact with the server.
            Instead of implementing these in a React component, it is
            better to implement these in a reusable client library that
            can be shared across several user interface components.
            Move the <code>axios.get()</code>{" "}in HttpClient to a
            separate file called{" "}
            <code>app/labs/lab5/client.ts</code>{" "}as shown below.
          </p>
          <CodeBlock
            language="ts"
            name="client"
            file="app/labs/lab5/client.ts"
          >{`import axios from "axios";
import { httpServer } from "@/app/lib/httpServer";
const HTTP_SERVER = httpServer();
export const fetchWelcomeMessage = async () => {
  const response = await axios.get(\`\${HTTP_SERVER}/lab5/welcome\`);
  return response.data;
};`}</CodeBlock>
          <p>
            Now refactor HttpClient to use the client as shown below.
            Confirm that clicking on Fetch Welcome still works. Screens
            share one library so when the welcome URL or the helper
            changes, you edit one file.
          </p>
          <CodeBlock
            language="tsx"
            name="HttpClient uses client"
            file="app/labs/lab5/intermediates/5-2-5-HttpClient.tsx"
          >{`import * as client from "../client";
const fetchWelcomeOnClick = async () => {
  const message = await client.fetchWelcomeMessage();
  setWelcomeOnClick(message);
};`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-5-4"
          title="5.2.5.4 Retrieving Data from a Server on Component Load"
        >
          <p>
            The previous exercise fetched data from the server when the
            user requested it. Often times we need to retrieve data
            from the server when you first navigate to a screen or a
            component is first loaded and displayed. Use React&apos;s{" "}
            <code>useEffect</code>{" "}hook function as shown below to
            invoke <code>fetchWelcomeOnLoad</code>{" "}when a component
            or screen first loads. Now, when the HttpClient loads, the{" "}
            <code>useEffect</code>{" "}invokes{" "}
            <code>fetchWelcomeOnLoad</code>{" "}which retrieves the
            message from the server and sets the new{" "}
            <code>welcomeOnLoad</code>{" "}state variable. Confirm that
            if you refresh the screen, the welcome message appears
            without having to click on the Fetch Welcome button.
          </p>
          <CodeBlock
            language="tsx"
            name="useEffect load"
            file="app/labs/lab5/intermediates/5-2-5-HttpClient.tsx"
          >{`const [welcomeOnLoad, setWelcomeOnLoad] = useState("");
const fetchWelcomeOnLoad = async () => {
  const welcome = await client.fetchWelcomeMessage();
  setWelcomeOnLoad(welcome);
};
useEffect(() => {
  fetchWelcomeOnLoad();
}, []);`}</CodeBlock>
          <LiveDemo
            name="HttpClient"
            file="app/labs/lab5/intermediates/5-2-5-HttpClient.tsx"
            mode="styled"
          >
            <HttpClient />
          </LiveDemo>
        </Section>

        <Section
          level={3}
          id="sec-5-2-5-5"
          title="5.2.5.5 Working with Remote Objects on a Server Asynchronously"
        >
          <p>
            Let us now revisit the APIs that worked with the
            assignment object in WorkingWithObjects and create an
            asynchronous version. Let us add client functions to{" "}
            <code>client.ts</code>{" "}to fetch the assignment object
            from the server and update its title as shown below.
          </p>
          <CodeBlock
            language="ts"
            name="assignment client"
            file="app/labs/lab5/client.ts"
          >{`const ASSIGNMENT_API = \`\${HTTP_SERVER}/lab5/assignment\`;
export const fetchAssignment = async () => {
  const response = await axios.get(ASSIGNMENT_API);
  return response.data;
};
export const updateTitle = async (title: string) => {
  const response = await axios.get(\`\${ASSIGNMENT_API}/title/\${title}\`);
  return response.data;
};`}</CodeBlock>
          <p>
            Then, in a new{" "}
            <code>WorkingWithObjectsAsynchronously</code>{" "}component,
            create a UI that fetches the assignment on load and then
            allows you to edit its title. Import the component in Lab
            5 and confirm that the assignment is displayed on load.
            The form fields bind to local state so you can type; the{" "}
            <code>pre</code>{" "}shows the JSON snapshot so you can see
            every property the server sent. Now add a button to update
            the assignment&apos;s title. Change the assignment&apos;s
            title, click Update Title, refresh the screen, and confirm
            that the title has changed — the new title is still on the
            server.
          </p>
          <CodeBlock
            language="tsx"
            name="WorkingWithObjectsAsynchronously"
            file="app/labs/lab5/intermediates/5-2-5-WorkingWithObjectsAsync.tsx"
          >{`const [assignment, setAssignment] = useState({});
const fetchAssignment = async () => {
  setAssignment(await client.fetchAssignment());
};
const updateTitle = async () => {
  setAssignment(await client.updateTitle(assignment.title));
};
useEffect(() => { fetchAssignment(); }, []);`}</CodeBlock>
          <LiveDemo
            name="WorkingWithObjectsAsynchronously"
            file="app/labs/lab5/intermediates/5-2-5-WorkingWithObjectsAsync.tsx"
            mode="styled"
          >
            <WorkingWithObjectsAsynchronously />
          </LiveDemo>
          <OnYourOwn>
            Change the assignment title, click Update Title, refresh, and
            confirm the new title is still on the server.
          </OnYourOwn>
        </Section>

        <Section
          level={3}
          id="sec-5-2-5-6"
          title="5.2.5.6 Working with Remote Arrays on a Server Asynchronously"
        >
          <p>
            Now let us do the same thing to the arrays. Let us use
            axios so that we can manipulate remote arrays on the server
            from the user interface and update a user interface to
            reflect the changes in the remote array. We will implement
            several client functions in{" "}
            <code>client.ts</code>{" "}that use axios to communicate
            with the server and we will use them from a new component
            that will render the remote array in the user interface.
            The exercise below fetches the todos from the server and
            populates a todos state variable which we can then render
            as a list of todos when the component loads. Confirm that
            the todos render when the component first loads. Strike
            through completed titles so the list reads like a
            checklist. The finished LiveDemo for this component waits
            until{" "}
            <SectionLink to="5.2.6.4" />, after POST, DELETE, PUT, and
            error handling are on the same screen.
          </p>
          <CodeBlock
            language="ts"
            name="fetchTodos"
            file="app/labs/lab5/client.ts"
          >{`const TODOS_API = \`\${HTTP_SERVER}/lab5/todos\`;
export const fetchTodos = async () => {
  const response = await axios.get(TODOS_API);
  return response.data;
};`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="WorkingWithArraysAsynchronously"
            file="app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync.tsx"
          >{`const [todos, setTodos] = useState([]);
const fetchTodos = async () => {
  setTodos(await client.fetchTodos());
};
useEffect(() => { fetchTodos(); }, []);
{todos.map((todo) => (
  <li key={todo.id}>
    <input type="checkbox" defaultChecked={todo.completed} />
    <span className={todo.completed ? "line-through" : ""}>{todo.title}</span>
  </li>
))}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-5-7"
          title="5.2.5.7 Deleting Data from a Server Asynchronously"
        >
          <p>
            In <code>client.ts</code>, add a{" "}
            <code>removeTodo</code>{" "}client function that sends a
            delete request to the server. The server will respond with
            an array with the surviving todos. In the
            WorkingWithArraysAsynchronously component, add remove
            buttons to each of the todos that invoke a new{" "}
            <code>removeTodo</code>{" "}function that uses the client to
            send an asynchronous delete request to the server and
            updates the todos state variable with the surviving todos.
            Use a trashcan icon to represent the remove button.
            Confirm that clicking on the new remove buttons actually
            removes the corresponding todo.
          </p>
          <CodeBlock
            language="ts"
            name="removeTodo"
            file="app/labs/lab5/client.ts"
          >{`export const removeTodo = async (todo: { id: number }) => {
  const response = await axios.get(\`\${TODOS_API}/\${todo.id}/delete\`);
  return response.data;
};`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="remove button"
            file="app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync.tsx"
          >{`const removeTodo = async (todo) => {
  setTodos(await client.removeTodo(todo));
};
<FaTrash onClick={() => removeTodo(todo)} id="wd-remove-todo"
  className="cursor-pointer text-red-600" />`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-5-8"
          title="5.2.5.8 Creating New Data in a Server Asynchronously"
        >
          <p>
            A previous exercise implemented a server route to create
            new todo items. In the React project{" "}
            <code>client.ts</code>{" "}implement a{" "}
            <code>createNewTodo</code>{" "}client function that requests
            creating a new todo item from the server as shown below. In
            the WorkingWithArraysAsynchronously component, add a +
            button icon to invoke the{" "}
            <code>createNewTodo</code>{" "}client function and update
            the todos state variable with the todos from the server.
            Confirm that clicking the + button icon actually creates a
            new todo.
          </p>
          <CodeBlock
            language="ts"
            name="createNewTodo"
            file="app/labs/lab5/client.ts"
          >{`export const createNewTodo = async () => {
  const response = await axios.get(\`\${TODOS_API}/create\`);
  return response.data;
};`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="create button"
            file="app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync.tsx"
          >{`const createNewTodo = async () => {
  setTodos(await client.createNewTodo());
};
<FaPlusCircle onClick={createNewTodo} id="wd-create-todo"
  className="cursor-pointer text-green-600" />`}</CodeBlock>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-5-2-6"
        title="5.2.6 Passing JSON Data to a Server in an HTTP Body"
      >
        <p>
          The exercises so far have sent data to the server as path
          and query parameters. This approach is limited to the
          maximum length of the URL string, and only string data
          types. Another concern is that data in the URL is sent over
          a network in clear text, so anyone snooping around between
          the client and server can see the data as plain text which
          is not a good option for exchanging sensitive information
          such as passwords and other personal data. A better approach
          is to encode the data as JSON in the HTTP request body which
          allows for arbitrarily large amounts of data as well as
          secure data encryption. To enable the server to parse JSON
          data from the request body, add the following{" "}
          <code>app.use()</code>{" "}statement in{" "}
          <code>index.js</code>. Make sure that it is implemented
          right after the CORS configuration statement. Now JSON data
          coming from the client is available in the request body in
          the <code>request.body</code>{" "}property in the server
          routes.
        </p>
        <CodeBlock
          language="js"
          name="express.json"
          file="webdev-server/index.js"
        >{`app.use(cors());
app.use(express.json());
Lab5(app);`}</CodeBlock>
        <p>
          The hyperlinks and{" "}
          <code>axios.get()</code>{" "}in the exercises so far have
          sent data to the server using the HTTP GET method or verb.
          HTTP defines several other HTTP methods or verbs including:
        </p>
        <ul>
          <li>
            <strong>GET</strong> — for retrieving data, but we have
            been also misusing it for creating, modifying and deleting
            data on the server. We will start using it properly only
            for retrieving data.
          </li>
          <li>
            <strong>POST</strong> — for creating new data typically
            embedded in the HTTP body
          </li>
          <li>
            <strong>PUT</strong> — for modifying existing data where
            updates are typically embedded in the HTTP body
          </li>
          <li>
            <strong>DELETE</strong> — for removing existing data
          </li>
          <li>
            <strong>OPTIONS</strong> — for retrieving allowed
            operations. Used to figure out if CORS policy allows
            communication with the other methods such as GET, POST,
            PUT and DELETE
          </li>
        </ul>
        <p>
          The GET method, as the name suggests, is meant for only
          getting data from the server. We have been misusing it to
          implement routes that also create, update, and delete data
          on the server. We did this mostly for academic purposes
          since it is the easiest HTTP method to work with. From now
          on we will use the proper HTTP method for the right purpose.
          Keep the older GET create/delete routes so earlier links
          still work.
        </p>

        <Section
          level={3}
          id="sec-5-2-6-1"
          title="5.2.6.1 Posting Data to Servers with HTTP POST Requests"
        >
          <p>
            To illustrate using the HTTP POST method, let us
            re-implement the route that creates new todos as shown
            below. The HTTP POST method takes the role of the verb
            meaning create. Add the new{" "}
            <code>app.post</code>{" "}implementation. Do not remove the
            old GET version so we do not break the other lab
            exercises. Note how the new implementation grabs the
            posted JSON data from{" "}
            <code>req.body</code>{" "}and uses it to define{" "}
            <code>newTodo</code>. Also note that this version does
            not respond with the entire todos array and instead only
            responds with the newly created todo object instance. This
            is more reasonable since arrays can potentially be large
            and it would be expensive to transfer such large data
            structures over a network, especially if the client UI
            already has most of this data already displayed.
          </p>
          <CodeBlock
            language="js"
            name="postNewTodo"
            file="webdev-server/Lab5/WorkingWithArrays.js"
          >{`const postNewTodo = (req, res) => {
  const newTodo = { ...req.body, id: new Date().getTime() };
  todos.push(newTodo);
  res.json(newTodo);
};
app.get("/lab5/todos/create", createNewTodo);
app.post("/lab5/todos", postNewTodo);`}</CodeBlock>
          <p>
            Back in the user interface, add a new{" "}
            <code>postNewTodo</code>{" "}client function in{" "}
            <code>client.ts</code>{" "}that posts new todo objects to
            the server. Note the second argument in the{" "}
            <code>axios.post()</code>{" "}method containing the new
            todo object instance sent to the server. The response this
            time contains the todo instance added to the todos array
            in the server instead of all the todos on the server. In
            the WorkingWithArraysAsynchronously component, create a
            new + button icon to invoke the new{" "}
            <code>postNewTodo</code>{" "}client function to send a new
            todo object to the server containing a default title and
            completed properties. Append the new todo object created
            on the server to the local todos state variable to update
            the user interface with the new todo. Color the new +
            button icon a different color so it is distinguishable
            from the <code>createNewTodo</code>{" "}button. Confirm that
            you can add new items to the array when you click on the
            new + button icon.
          </p>
          <CodeBlock
            language="ts"
            name="postNewTodo client"
            file="app/labs/lab5/client.ts"
          >{`export const postNewTodo = async (todo: { title: string; completed: boolean }) => {
  const response = await axios.post(TODOS_API, todo);
  return response.data;
};`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="post button"
            file="app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync.tsx"
          >{`const postNewTodo = async () => {
  const newTodo = await client.postNewTodo({
    title: "New Posted Todo",
    completed: false,
  });
  setTodos([...todos, newTodo]);
};
<FaPlusCircle onClick={postNewTodo} id="wd-post-todo"
  className="cursor-pointer text-blue-600" />`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-6-2"
          title="5.2.6.2 Deleting Data from Servers with HTTP DELETE Requests"
        >
          <p>
            Now that we have axios we can implement a better version
            of the remove operation. The current{" "}
            <code>removeTodo</code>{" "}implementation uses the HTTP GET
            method to request the server to remove data. The HTTP
            DELETE method is specifically suited for removing data
            from remote servers. In the server project, implement a
            better version of the delete operation as shown below. The
            new implementation uses the HTTP DELETE method declared in{" "}
            <code>app.delete()</code>{" "}which is distinct from{" "}
            <code>app.get()</code>{" "}for which we do not need the
            trailing <code>/delete</code>{" "}at the end of the URL.
            Removing the element from the array is the same either
            way. Although we could again respond with the entire array
            of surviving todos, it is better to just respond with a
            success status and let the user interface update its state
            variable. This reduces unnecessary data communication
            between the client and server.
          </p>
          <CodeBlock
            language="js"
            name="deleteTodo"
            file="webdev-server/Lab5/WorkingWithArrays.js"
          >{`const deleteTodo = (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
  todos.splice(todoIndex, 1);
  res.sendStatus(200);
};
app.delete("/lab5/todos/:id", deleteTodo);
app.get("/lab5/todos/:id/delete", removeTodo);`}</CodeBlock>
          <p>
            In the React project create a new client function called{" "}
            <code>deleteTodo</code>. Note how it is implemented using{" "}
            <code>axios.delete</code>{" "}instead of{" "}
            <code>axios.get</code>{" "}so that it matches the
            server&apos;s <code>app.delete</code>{" "}as well as the URL
            format without the trailing{" "}
            <code>/delete</code>. In the user interface component, add
            another delete button to try this new{" "}
            <code>deleteTodo</code>{" "}client function, but use a
            different icon, say an X so as to not confuse it with the
            trash. Note that the new implementation ignores the
            response from the server and instead filters the removed
            todo from the local state variable. This is fine for now,
            but the operation is too optimistic assuming the server
            successfully deleted the item from the array and updating
            the user interface without confirmation. Later we will
            deal with errors from the server to make sure the local
            state variable in the user interface is in synch with the
            remote array on the server.
          </p>
          <CodeBlock
            language="ts"
            name="deleteTodo client"
            file="app/labs/lab5/client.ts"
          >{`export const deleteTodo = async (todo: { id: number }) => {
  const response = await axios.delete(\`\${TODOS_API}/\${todo.id}\`);
  return response.data;
};`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="X delete"
            file="app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync.tsx"
          >{`const deleteTodo = async (todo) => {
  await client.deleteTodo(todo);
  setTodos(todos.filter((t) => t.id !== todo.id));
};
<TiDelete onClick={() => deleteTodo(todo)} id="wd-delete-todo"
  className="cursor-pointer text-2xl text-red-600" />`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-6-3"
          title="5.2.6.3 Updating Data on Servers with HTTP PUT Requests"
        >
          <p>
            Use HTTP PUT to reimplement the route that updates an item
            in an array as shown below. The route replaces the todo
            item whose ID matches the id path parameter with a
            combination of the original todo object and properties in
            the <code>req.body</code>. This overrides any properties
            in the original todo object with matching properties in
            the request body. Note that this new implementation does
            not respond with the todos array, but instead responds
            with a simple OK status code of 200. This is more
            reasonable since there is no need to respond with an
            entire array since the user interface already has the
            array cached in the browser and it can just update the
            item in the todos state variable.
          </p>
          <CodeBlock
            language="js"
            name="updateTodo PUT"
            file="webdev-server/Lab5/WorkingWithArrays.js"
          >{`const updateTodo = (req, res) => {
  const { id } = req.params;
  todos = todos.map((t) => {
    if (t.id === parseInt(id)) {
      return { ...t, ...req.body };
    }
    return t;
  });
  res.sendStatus(200);
};
app.put("/lab5/todos/:id", updateTodo);`}</CodeBlock>
          <p>
            Back in the user interface, in{" "}
            <code>client.ts</code>{" "}add a new{" "}
            <code>updateTodo</code>{" "}function that puts updates to
            the server. Note the second argument in the{" "}
            <code>axios.put()</code>{" "}method containing the updated
            todo object instance sent to the server. The response
            contains a status. In the
            WorkingWithArraysAsynchronously component, add an input
            field that shows up when you click a new pencil icon by
            setting the todo&apos;s{" "}
            <code>editing</code>{" "}property to true. Pressing the
            Enter key sets the todo&apos;s{" "}
            <code>editing</code>{" "}property to false, and shows the
            updated title again. Add an{" "}
            <code>onChange</code>{" "}attribute to the completed
            checkbox so that it updates the corresponding property of
            the todo object. Confirm you can edit the title and
            completed properties of the todos, and that the changes
            persist after refreshing the page.
          </p>
          <CodeBlock
            language="ts"
            name="updateTodo client"
            file="app/labs/lab5/client.ts"
          >{`export const updateTodo = async (todo: { id: number }) => {
  const response = await axios.put(\`\${TODOS_API}/\${todo.id}\`, todo);
  return response.data;
};`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="edit and PUT"
            file="app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync.tsx"
          >{`const editTodo = (todo) => {
  setTodos(todos.map((t) => (t.id === todo.id ? { ...todo, editing: true } : t)));
};
const updateTodo = async (todo) => {
  await client.updateTodo(todo);
  setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
};
<FaPencilAlt onClick={() => editTodo(todo)} className="cursor-pointer text-blue-600" />
<input type="checkbox" checked={todo.completed}
  onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })} />`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-5-2-6-4"
          title="5.2.6.4 Handling Errors"
        >
          <p>
            The exercises so far have been very optimistic when
            interacting with the server, but it is good practice to
            handle edge cases and the unforeseen. In this section we
            are going to add error handling to some of the routes and
            user interface. For instance, the exercise below throws
            exceptions if the items being deleted or updated do not
            actually exist. Errors are reported by the server as
            status codes, where 404 is the infamous NOT FOUND error.
            Additionally a JSON object can be sent back as part of the
            response that can be used by user interfaces to better
            inform the user of what went wrong.
          </p>
          <CodeBlock
            language="js"
            name="404 handling"
            file="webdev-server/Lab5/WorkingWithArrays.js"
          >{`const deleteTodo = (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
  if (todoIndex === -1) {
    res.status(404).json({ message: \`Unable to delete Todo with ID \${id}\` });
    return;
  }
  todos.splice(todoIndex, 1);
  res.sendStatus(200);
};
const updateTodo = (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
  if (todoIndex === -1) {
    res.status(404).json({ message: \`Unable to update Todo with ID \${id}\` });
    return;
  }
  todos = todos.map((t) => (t.id === parseInt(id) ? { ...t, ...req.body } : t));
  res.sendStatus(200);
};`}</CodeBlock>
          <p>
            In the user interface we can catch the errors by wrapping
            the request in a <code>try</code>/<code>catch</code>{" "}
            clause as shown below. If the request fails with an HTTP
            error response, then the body of the try block is aborted
            and the body of the catch clause executes instead. The
            exercise below declares an{" "}
            <code>errorMessage</code>{" "}state variable that we
            populate with the error from the server if an error
            occurs. The error is rendered as a red alert box using
            Tailwind:{" "}
            <code>bg-red-100</code>{" "}and{" "}
            <code>text-red-800</code>. To test, remove an item using
            the{" "}
            <code>http://localhost:4000/lab5/todos/:id/delete</code>{" "}
            GET route and then try to update or delete the same item
            using the user interface. Confirm you get an error if you
            try to delete or update a todo that does not exist.
          </p>
          <CodeBlock
            language="tsx"
            name="try/catch"
            file="app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync.tsx"
          >{`const [errorMessage, setErrorMessage] = useState(null);
const deleteTodo = async (todo) => {
  try {
    await client.deleteTodo(todo);
    setTodos(todos.filter((t) => t.id !== todo.id));
  } catch (error) {
    setErrorMessage(error.response.data.message);
  }
};
{errorMessage && (
  <p id="wd-todo-error-message" className="rounded bg-red-100 px-3 py-2 text-red-800">
    {errorMessage}
  </p>
)}`}</CodeBlock>
          <LiveDemo
            name="WorkingWithArraysAsynchronously"
            file="app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync.tsx"
            mode="styled"
          >
            <WorkingWithArraysAsynchronously />
          </LiveDemo>
          <OnYourOwn>
            Delete a todo with the GET{" "}
            <code>/delete</code>{" "}link, then try the X (HTTP DELETE) on
            the same id and confirm the 404 alert.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync.tsx, keep my deleteTodo try/catch. If the catch runs, keep showing errorMessage. Do not remove the FaPlusCircle POST button.`}
          >
            Ask the assistant not to strip error handling — you still
            trigger the 404:
          </WithAI>
        </Section>
      </Section>
        <p>
          Use this checklist to confirm Lab 5 covers the HTTP topics in{" "}
          <SectionLink to="5.2.1" />–<SectionLink to="5.2.6" />. Each
          topic is listed once, with Lab, <strong>On your own</strong>,
          and <strong>With AI</strong>{" "}nested as a/b/c when that
          section has those blocks. The walkthroughs above are the
          source — this list is for checking coverage.
        </p>
        <NestedExerciseList groups={CH5_LAB_EXERCISES} />
    </Section>
  );
}
