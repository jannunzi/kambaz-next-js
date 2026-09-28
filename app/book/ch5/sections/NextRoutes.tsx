import Section from "../../components/Section";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import LocalUrl from "../../components/LocalUrl";
import { OnYourOwn, WithAI } from "../../components/Practice";
import HelloRoute from "@/app/labs/lab5/intermediates/5-3-1-HelloRoute";
import CalculatorNextWebApiClient from "@/app/labs/lab5/intermediates/5-3-1-Calculator";

export default function NextRoutes() {
  return (
    <Section id="sec-5-3" title="5.3 Next.js Server Routes">
      <p>
        Express is this chapter&apos;s spine: a separate process, a
        separate host, a sibling{" "}
        <code>webdev-server</code>{" "}project that Lab 5 and Kambaz
        already talk to on port 4000.{" "}
        <OfficialLink href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers">
          Route Handlers
        </OfficialLink>{" "}
        are the other server model — useful, not a replacement for Lab
        5. Next.js API routes provide a powerful, built-in way to create
        server-side endpoints directly within a Next.js application,
        eliminating the need for a separate backend server in many
        cases. Defined by simply creating files inside the{" "}
        <code>app/api/</code>{" "}directory, each file automatically
        becomes an API endpoint. For example, a file at{" "}
        <code>app/api/hello/route.ts</code>{" "}becomes accessible at{" "}
        <code>/api/hello</code>. These routes support all standard HTTP
        methods (GET, POST, PUT, DELETE, and so on) and give developers
        full control over the request and response objects, making it
        straightforward to handle form submissions, authentication,
        database operations, third-party API proxying, or any custom
        server logic — all while staying inside the same Next.js
        project.
      </p>
      <p>
        You stay inside the App Router when you do not need an
        independent API process. These LiveDemos fetch{" "}
        <code>/api/lab5/...</code>{" "}on the Next.js origin — they work
        with only <code>npm run dev</code>. Express Lab 5 still needs
        the companion on 4000. Same-origin{" "}
        <code>/api</code>{" "}does not need CORS, because the browser
        considers the page and the handler one origin.
      </p>
      <p>
        The example below demonstrates a trivial hello world route that
        responds with a simple JSON object when accessing{" "}
        <LocalUrl href="/api/lab5/hello" />. Create{" "}
        <code>app/api/lab5/hello/route.ts</code>{" "}and confirm the
        browser displays the JSON message. This greeting is{" "}
        <em>not</em>{" "}the Express{" "}
        <code>/lab5/welcome</code>; it is a same-app handler that
        Next.js serves on port 3000.
      </p>
      <CodeBlock
        language="ts"
        name="hello"
        file="app/api/lab5/hello/route.ts"
      >{`export async function GET() {
  return Response.json({ message: "Hello from Lab 5 API!" });
}`}</CodeBlock>
      <p>
        Exporting a function named{" "}
        <code>GET</code>{" "}is how the App Router maps the HTTP method
        to the file.{" "}
        <code>Response.json</code>{" "}sets the{" "}
        <code>Content-Type</code>{" "}and serializes the object. The
        live sample uses the Web{" "}
        <code>Response</code>{" "}constructor. Next.js 16 accepts that
        the same way it accepts{" "}
        <code>NextResponse.json</code>{" "}from{" "}
        <code>next/server</code>. To practice the hello route, confirm the
        LiveDemo below fetches that JSON and prints the message without
        leaving the Labs page.
      </p>
      <LiveDemo
        name="HelloRoute"
        file="app/labs/lab5/intermediates/5-3-1-HelloRoute.tsx"
        mode="styled"
      >
        <HelloRoute />
      </LiveDemo>

      <Section
        level={3}
        id="sec-5-3-1"
        title="5.3.1 Next.js Calculator Web API"
      >
        <p>
          To practice Next.js API routes in the App Router, let us
          implement a simple yet practical Web API that defines a basic
          calculator endpoint. Create a route in{" "}
          <code>app/api/lab5/calculator/route.ts</code>{" "}that
          implements a server-side calculator accessible via a GET
          request at the URL path{" "}
          <code>/api/lab5/calculator</code>. The handler reads query
          parameters from the request URL —{" "}
          <code>a</code>, <code>b</code>, and{" "}
          <code>operation</code> — performs basic arithmetic (addition
          or subtraction to start), validates the inputs, and returns a
          JSON response with the operands, operation, and computed
          result.
        </p>
        <p>
          In Next.js 16 the search string lives on{" "}
          <code>request.nextUrl.searchParams</code>{" "}rather than
          constructing a new{" "}
          <code>URL(request.url)</code>, but the meaning is the same:
          read three strings, parse the numbers, and decide what to do.
          Invalid inputs like missing numbers or an unrecognized
          operation return error messages with the appropriate status
          code — 400 for a bad request. A request to{" "}
          <LocalUrl href="/api/lab5/calculator?a=10&b=5&operation=add" />{" "}
          should produce{" "}
          <code>{`{ "a": 10, "b": 5, "operation": "add", "result": 15 }`}</code>
          . Extend the switch with multiply and divide so the four
          operations match the Express calculator you already built in{" "}
          <code>Lab5/QueryParameters.js</code>.
        </p>
        <CodeBlock
          language="ts"
          name="calculator"
          file="app/api/lab5/calculator/route.ts"
        >{`export async function GET(request: NextRequest) {
  const a = parseFloat(request.nextUrl.searchParams.get("a") ?? "");
  const b = parseFloat(request.nextUrl.searchParams.get("b") ?? "");
  const operation = request.nextUrl.searchParams.get("operation");
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return Response.json({ error: "Invalid numbers" }, { status: 400 });
  }
  let result: number;
  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      result = b === 0 ? Number.NaN : a / b;
      break;
    default:
      return Response.json({ error: "Invalid operation" }, { status: 400 });
  }
  if (Number.isNaN(result)) {
    return Response.json({ error: "Invalid operation" }, { status: 400 });
  }
  return Response.json({ a, b, operation, result });
}`}</CodeBlock>
        <p>
          The component below implements a client user interface to the
          server calculator Web API. The React client component is
          marked <code>&quot;use client&quot;</code>{" "}and provides an
          interactive frontend that integrates with the server through
          the <code>/api/lab5/calculator</code>{" "}endpoint we built
          earlier, demonstrating a complete full-stack workflow of
          Next.js API routes. The component uses React&apos;s{" "}
          <code>useState</code>{" "}hooks to manage inputs for two
          numbers (<code>a</code>{" "}and{" "}
          <code>b</code>), the selected{" "}
          <code>operation</code>, and dynamic states for the result and
          any errors. It triggers a simple{" "}
          <code>fetch</code>{" "}call to the{" "}
          <code>/api/lab5/calculator</code>{" "}route whenever the user
          switches operations via the dropdown or clicks the Calculate
          button. Parameters are encoded as query parameters. JSON
          responses are parsed and displayed as formatted output such as{" "}
          <code>3 + 5 = 8</code>{" "}in a read-only field. Tailwind
          classes style the inputs: rounded
          borders and a blue button so it matches the rest of Lab 5.
        </p>
        <p>
          Create the{" "}
          <code>CalculatorNextWebApiClient</code>{" "}component (this
          book keeps it under{" "}
          <code>app/labs/lab5/intermediates/</code>) and import it from
          the Lab 5 page. Confirm the browser displays as shown. Type
          two numbers, choose an operation, and confirm the JSON from
          the route appears as an equation. Because the request stays
          on <code>/api/lab5/...</code>, you do not need Express
          running for this demo — only{" "}
          <code>npm run dev</code>.
        </p>
        <LiveDemo
          name="CalculatorNextWebApiClient"
          file="app/labs/lab5/intermediates/5-3-1-Calculator.tsx"
          mode="styled"
        >
          <CalculatorNextWebApiClient />
        </LiveDemo>
        <OnYourOwn>
          Divide by zero and an unknown operation should show the error
          string, not a thrown page.
        </OnYourOwn>
        <WithAI
          prompt={`In app/api/lab5/calculator/route.ts, keep add and subtract. Add multiply and divide cases. Return 400 for unknown operations. Do not change the hello route.`}
        >
          Ask the assistant to finish the switch — you still try × and ÷:
        </WithAI>
      </Section>
    </Section>
  );
}
