import {
  createBlockSlide,
  createBulletsBlock,
  createCodeBlock,
  type BlockSlide,
} from "../blocks";

export const INSTALLING_NODEJS_SLIDES: BlockSlide[] = [
  createBlockSlide({
    id: "title",
    title: "NODE.JS",
    kind: "title",
    blocks: [
      createBulletsBlock({
        id: "title-bullets",
        items: ["Jose Annunziato"],
      }),
    ],
  }),
  createBlockSlide({
    id: "client-server-reminder",
    title: "The Client Server Architecture",
    kind: "content",
    diagram: "client-server",
    blocks: [
      createBulletsBlock({
        id: "client-server-reminder-bullets",
        items: [
          "**CLIENTS** — HTML, CSS, JavaScript, React",
          "**SERVERS** — Node, Express, HTTP",
          "**RESOURCES** — Mongo, files",
          "**HTTP REQUEST** / **HTTP RESPONSE** over the Internet",
        ],
      }),
    ],
  }),
  createBlockSlide({
    id: "course-stack",
    title: "Our Development Environment",
    kind: "content",
    diagram: "course-stack",
    blocks: [
      createBulletsBlock({
        id: "course-stack-bullets",
        items: [
          "**CLIENTS** — **HTML**, **CSS**, **JavaScript**, **React.js** & **Next.js**",
          "**SERVERS** — **HTTP**, Ajax, REST · **Express** & **Node.js**",
          "**RESOURCES** — **MongoDB**, Mongoose, files",
        ],
      }),
    ],
  }),
  createBlockSlide({
    id: "first-client",
    title: "First Client User Interface",
    kind: "content",
    diagram: "course-stack",
    blocks: [
      createBulletsBlock({
        id: "first-client-bullets",
        items: [
          "The **1st** UI we build is the **client** — React.js & Node.js",
          "Same architecture drawing. **Node.js** is the runtime on your laptop",
        ],
      }),
    ],
  }),
  createBlockSlide({
    id: "languages",
    title: "Web Development Languages",
    kind: "content",
    blocks: [
      createBulletsBlock({
        id: "languages-bullets",
        items: [
          "**HTML** — building Web pages, front end, main content, layout and structure",
          "**CSS** — styling Web pages, look and feel",
          "**JavaScript** — controlling the browser, dynamic content. Now also **back end**",
          "Other languages — C#, Python, PHP, Java, Visual Basic",
        ],
      }),
    ],
  }),
  createBlockSlide({
    id: "js-vs-ts",
    title: "JavaScript",
    kind: "content",
    blocks: [
      createBulletsBlock({
        id: "js-vs-ts-bullets",
        items: [
          "Programming language for the Web",
          "Originally just executed by **Browsers**, for controlling the Browser and creating dynamic content",
          "**TypeScript** is a superset of JavaScript",
          "Introduces **type safety**",
        ],
      }),
    ],
  }),
  createBlockSlide({
    id: "what-is-node",
    title: "Node.js",
    kind: "content",
    blocks: [
      createBulletsBlock({
        id: "what-is-node-bullets",
        items: [
          "Now JavaScript is also for **back end** development, like C#, Python, Java",
          "Need infrastructure to execute on the backend, on desktops: **Node.js**",
          "**Node.js** — JavaScript **runtime** to execute **outside** the browser",
        ],
      }),
    ],
  }),
  createBlockSlide({
    id: "download",
    title: "Download Node.js",
    kind: "content",
    interactiveHint:
      "Open nodejs.org and use the LTS button.",
    blocks: [
      createBulletsBlock({
        id: "download-bullets",
        items: [
          "Navigate to [https://nodejs.org/en/](https://nodejs.org/en/)",
          "Download the **recommended** **LTS** version for your OS",
          "Windows downloads **MSI** · macOS downloads **DMG**",
          "Follow the installer instructions",
        ],
      }),
    ],
  }),
  createBlockSlide({
    id: "version",
    title: "Test Installation",
    kind: "demo",
    interactiveHint:
      "Your number will differ. Need **20.9+** for Next.js. Not found? Reopen the terminal.",
    blocks: [
      createBulletsBlock({
        id: "version-bullets",
        items: [
          "Once installed, test at the command line. **CMD** on Windows or **Terminal** on macOS",
          "`node` is the new command. `--version` displays the version",
        ],
      }),
      createCodeBlock({
        id: "version-code",
        language: "bash",
        code: `node --version
v20.17.0`,
      }),
    ],
  }),
  createBlockSlide({
    id: "course-folder",
    title: "Create a Course Folder",
    kind: "demo",
    blocks: [
      createBulletsBlock({
        id: "course-folder-bullets",
        items: [
          "Create a folder for this semester. Lowercase, no spaces",
        ],
      }),
      createCodeBlock({
        id: "course-folder-code",
        language: "bash",
        code: `cd ~
mkdir -p webdev
cd webdev`,
      }),
    ],
  }),
  createBlockSlide({
    id: "demo",
    title: "DEMO",
    kind: "demo",
    blocks: [
      createBulletsBlock({
        id: "demo-bullets",
        items: [
          "Live: `node --version` prints, we are in the course folder",
        ],
      }),
    ],
  }),
  createBlockSlide({
    id: "npm-init",
    title: "Creating a Node Project",
    kind: "demo",
    blocks: [
      createBulletsBlock({
        id: "npm-init-bullets",
        items: [
          "Create a directory, then initialize it from within",
          "Answer questions and confirm the new `package.json` file",
        ],
      }),
      createCodeBlock({
        id: "npm-init-code",
        language: "bash",
        code: `mkdir kambaz-node-server-app
cd kambaz-node-server-app
npm init -y`,
      }),
    ],
  }),
  createBlockSlide({
    id: "hello-js",
    title: "Hello World",
    kind: "demo",
    blocks: [
      createBulletsBlock({
        id: "hello-js-bullets",
        items: [
          "Create `hello.js` with any text editor. Save, then run. Confirm the message",
        ],
      }),
      createCodeBlock({
        id: "hello-js-code",
        language: "js",
        file: "hello.js",
        code: `console.log("hello world!");`,
      }),
      createCodeBlock({
        id: "hello-js-run",
        language: "bash",
        code: "node hello.js",
      }),
    ],
  }),
  createBlockSlide({
    id: "express",
    title: "Creating a Simple Server",
    kind: "demo",
    blocks: [
      createBulletsBlock({
        id: "express-bullets",
        items: [
          "Install **express**. Create `server.js` with one **GET** `/hello` route",
        ],
      }),
      createCodeBlock({
        id: "express-npm",
        language: "bash",
        code: "npm install express",
      }),
      createCodeBlock({
        id: "express-server",
        language: "js",
        file: "server.js",
        addedLines: [[3, 6]],
        code: `import express from "express";
const app = express();
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});
app.listen(4000);`,
      }),
    ],
  }),
  createBlockSlide({
    id: "visit",
    title: "Using the Server",
    kind: "demo",
    interactiveHint: "Stop the server with Ctrl+C when you are done.",
    blocks: [
      createBulletsBlock({
        id: "visit-bullets",
        items: [
          "Start the server. It listens at port **4000**",
          "Point the browser at the URL. The server responds **Hello World!**",
        ],
      }),
      createCodeBlock({
        id: "visit-run",
        language: "bash",
        code: "node server.js",
      }),
      createCodeBlock({
        id: "visit-url",
        language: "text",
        code: "http://localhost:4000/hello",
      }),
    ],
  }),
  createBlockSlide({
    id: "next-up",
    title: "Next: create the Next.js app",
    kind: "title",
    blocks: [
      createBulletsBlock({
        id: "next-up-bullets",
        items: [
          "**Node.js** is installed. You ran `hello.js` outside the browser",
          "Next deck: `npx create-next-app@latest` and the **App Router**",
        ],
      }),
    ],
  }),
];
