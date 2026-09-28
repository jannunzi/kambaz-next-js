import type { LectureSlide } from "../types";

export const GROK_CHAT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "CHAT",
    kind: "title",
    bullets: [
      "Text in, text out · **completions** · sparkle",
    ],
  },
  {
    id: "chat-intro",
    title: "Introduction",
    kind: "content",
    bullets: [
      "Chat is the most popular feature on the **xAI API**",
      "Summarize, write, answer, support, or help with **code**",
      "You POST a request. The API returns a **complete** response",
    ],
  },
  {
    id: "openai-client",
    title: "Completion API",
    kind: "demo",
    bullets: [
      "`baseURL` is **`https://api.x.ai/v1`** — same shapes as OpenAI",
    ],
    code: `import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
  timeout: 360000,
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/chat.ts",
    codeAddedLines: [[4, 7]],
  },
  {
    id: "completion",
    title: "Completion API",
    kind: "demo",
    bullets: [
      "Model **`grok-4`**. Read `choices[0].message`",
    ],
    code: `const completion = await client.chat.completions.create({
  model: "grok-4",
  messages: [
    {
      role: "system",
      content: "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy.",
    },
    {
      role: "user",
      content: "What is the meaning of life, the universe, and everything?",
    },
  ],
});
console.log(completion.choices[0].message);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/chat.ts",
    codeAddedLines: [[1, 14]],
  },
  {
    id: "stateless",
    title: "Conversations",
    kind: "content",
    bullets: [
      "The xAI API is **stateless**",
      "It does **not** remember the previous request",
      "Resend prior prompts and results if you want **context**",
    ],
  },
  {
    id: "sample",
    title: "Sample Conversation",
    kind: "demo",
    bullets: ["Roles: **system**, **user**, **assistant**"],
    code: `{ "role": "system", "content": [{ "type": "text", "text": "You are a helpful and funny assistant." }] }
{ "role": "user", "content": [{ "type": "text", "text": "Why don't eggs tell jokes?" }] }
{ "role": "assistant", "content": [{ "type": "text", "text": "They'd crack up!" }] }
{ "role": "user", "content": [{ "type": "text", "text": "Can you explain the joke?" }] }`,
    codeLanguage: "json",
  },
  {
    id: "roles",
    title: "Roles",
    kind: "content",
    bullets: [
      "**system** — instructive tone for how the model should respond",
      "**user** — requests or data sent to the model",
      "**assistant** — the model's reply, or history you feed back in",
    ],
  },
  {
    id: "order",
    title: "Message Role Order Flexibility",
    kind: "content",
    bullets: [
      "Unlike some providers, xAI lets you **mix roles in any order**",
      "Two `system` messages, or `user` **before** `system`, both work",
    ],
  },
  {
    id: "course-ai",
    title: "COURSE AI DESCRIPTION",
    kind: "title",
    bullets: [
      "Sparkle button suggests a description from the **title**",
    ],
  },
  {
    id: "server-client",
    title: "Create the Client Instance",
    kind: "demo",
    bullets: ["OpenAI SDK pointed at **`XAI_BASE_URL`**"],
    code: `import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: process.env.XAI_BASE_URL,
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/client.js",
    codeAddedLines: [[4, 7]],
  },
  {
    id: "suggest-desc",
    title: "Describe the System's Purpose",
    kind: "demo",
    bullets: [
      "Faculty system prompt. Return **only one short paragraph**",
    ],
    code: `export const suggestCourseDescription = async (courseName) => {
  const completion = await client.chat.completions.create({
    model: "grok-4",
    messages: [
      { role: "system", content: "You are a faculty developing a course." },
      {
        role: "user",
        content: \`What is a good course description for a course titled "\${courseName}"? Only respond with the description as a single paragraph. Paragraph should be less than 500 characters.\`,
      },
    ],
  });
  return completion.choices[0].message;
};`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/client.js",
    codeAddedLines: [[1, 13]],
  },
  {
    id: "route",
    title: "Suggest Course Content Route",
    kind: "demo",
    bullets: ["**`name`** → description"],
    code: `import { suggestCourseDescription } from "./client.js";

export default function XaiRoutes(app) {
  const suggestCourseContent = async (req, res) => {
    const { name } = req.body;
    const description = await suggestCourseDescription(name);
    res.json(description);
  };
  app.post("/api/xai/course", suggestCourseContent);
}`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/routes.js",
    codeAddedLines: [9],
  },
  {
    id: "next-client",
    title: "Post Course Name From UI",
    kind: "demo",
    bullets: ["`NEXT_PUBLIC_HTTP_SERVER` plus **`/api/xai`**"],
    code: `import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const XAI_API = \`\${HTTP_SERVER}/api/xai\`;

export const suggestCourseDescription = async (courseName: string) => {
  const response = await axios.post(\`\${XAI_API}/course\`, { name: courseName });
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/xAI/client.ts",
    codeAddedLines: [[6, 9]],
  },
  {
    id: "spinner",
    title: "Animate Spinner",
    kind: "demo",
    bullets: ["Use Tailwind **`animate-spin`** for the waiting indicator"],
    code: `.wd-spinner {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
    codeLanguage: "css",
    codeFile: "app/(kambaz)/styles.css",
  },
  {
    id: "sparkle",
    title: "Add AI Sparkle Button to Description",
    kind: "demo",
    bullets: [
      "`PiStarFourFill` while idle. **`ImSpinner3`** while waiting",
    ],
    code: `const [loadingDescription, setLoadingDescription] = useState(false);

<button className="rounded bg-sky-500 px-2 py-2 text-white">
  {loadingDescription ? (
    <ImSpinner3 className="wd-spinner animate-spin" />
  ) : (
    <PiStarFourFill
      onClick={async (event) => {
        event.preventDefault();
        setLoadingDescription(true);
        const message = await xAIClient.suggestCourseDescription(course.name);
        setCourse({ ...course, description: message.content || "" });
        setLoadingDescription(false);
      }}
    />
  )}
</button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeAddedLines: [1, [7, 15]],
    embed: "grok-sparkle",
  },
  {
    id: "title-ai",
    title: "COURSE AI NAME",
    kind: "title",
    bullets: [
      "Sparkle a **title** from the description",
    ],
  },
  {
    id: "title-suggest",
    title: "Request Only the Title",
    kind: "demo",
    bullets: [
      "Same route: send **`{ description }`** when `name` is empty",
    ],
    code: `export const suggestCourseTitle = async (courseTopic) => {
  const completion = await client.chat.completions.create({
    model: "grok-4",
    messages: [
      { role: "system", content: "You are a faculty developing a course." },
      {
        role: "user",
        content: \`What is a good course title for a course about \${courseTopic}? Only respond with the title.\`,
      },
    ],
  });
  return completion.choices[0].message;
};`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/client.js",
    codeAddedLines: [[1, 13]],
  },
];
