import type { LectureSlide } from "../types";

export const CHATGPT_UI_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "OPENAI USER INTERFACE",
    kind: "title",
    bullets: [
      "Chat · images · vision · TTS · **course AI**",
    ],
  },
  {
    id: "screen",
    title: "OpenAI Screen",
    kind: "demo",
    bullets: [
      "App Router stub — **not** React Router",
    ],
    code: `export default function OpenAI() {
  return (
    <div>
      <h1>OpenAI</h1>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/openai/page.tsx",
  },
  {
    id: "nav",
    title: "Add OpenAI to Your Navigator",
    kind: "demo",
    bullets: ["Kambaz nav already lists Account and Dashboard"],
    code: `{
  segment: "openai",
  id: "wd-openai-link",
  label: "OpenAI",
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/Navigation.tsx",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "chatbot",
    title: "CREATING A CHAT BOT",
    kind: "title",
    bullets: [
      "In-memory **conversation** on Express",
      "Next.js never holds **`OPENAI_API_KEY`**",
    ],
  },
  {
    id: "get-chat",
    title: "Get Chat",
    kind: "demo",
    bullets: ["**GET** returns the transcript so far"],
    code: `import OpenAI from "openai";
const openai = new OpenAI();
const conversation = [];

export default function ChatRoutes(app) {
  const getConversation = (req, res) => res.json(conversation);
  app.get("/api/openai/conversation", getConversation);
}`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/chat/routes.js",
    codeAddedLines: [7],
  },
  {
    id: "post-chat",
    title: "Post Chat",
    kind: "demo",
    bullets: [
      "Push the user turn, call the model, push the **assistant** turn",
    ],
    code: `const postMessage = async (req, res) => {
  const userMessage = req.body;
  conversation.push(userMessage);
  const completion = await openai.chat.completions.create({
    messages: conversation, model: "gpt-4o",
  });
  const choice = completion.choices[0];
  conversation.push(choice.message);
  res.json(choice.message);
};
app.post("/api/openai/conversation", postMessage);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/chat/routes.js",
    codeAddedLines: [[4, 9], 11],
  },
  {
    id: "client",
    title: "Chat Client",
    kind: "demo",
    bullets: [
      "`NEXT_PUBLIC_HTTP_SERVER` is the Express origin, **not** the key",
    ],
    code: `import axios from "axios";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export const getConversation = async () => {
  const response = await axios.get(\`\${HTTP_SERVER}/api/openai/conversation\`);
  return response.data;
};

export const postMessage = async (message: { role: string; content: string }) => {
  const response = await axios.post(
    \`\${HTTP_SERVER}/api/openai/conversation\`, message,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/openai/chat/client.ts",
    codeAddedLines: [[4, 7], [9, 14]],
  },
  {
    id: "page",
    title: "Chat UI",
    kind: "demo",
    bullets: [
      "Append the user turn, **POST**, then append the assistant turn",
    ],
    code: `"use client";
import { useState } from "react";
import * as client from "./client";

interface Message { role: string; content: string }

export default function Chat() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const sendMessage = async () => {
    const userMessage = { role: "user", content: message };
    const response = await client.postMessage(userMessage);
    setConversation([...conversation, userMessage, response]);
    setMessage("");
  };`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/openai/chat/page.tsx",
    codeAddedLines: [[10, 15]],
    embed: "openai-chat",
  },
  {
    id: "render-chat",
    title: "Render Messages",
    kind: "demo",
    bullets: ["**user** = primary. **assistant** = success"],
    code: `{conversation.map((message, index) => (
  <li key={index}
      className={message.role === "user" ? "bg-sky-50" : "bg-emerald-50"}>
    <strong>{message.role}</strong>: {message.content}
  </li>
))}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/openai/chat/page.tsx",
    codeHighlightLines: [3],
  },
  {
    id: "images",
    title: "CREATING AN IMAGE UI",
    kind: "title",
    bullets: [
      "**POST** `/api/openai/conversation/images`",
      "Shape map: square · portrait · landscape",
    ],
  },
  {
    id: "image-route",
    title: "Request Image Route",
    kind: "demo",
    bullets: [
      "Generate images with **`gpt-image-1`**",
    ],
    code: `const shapeMap = {
  square: "1024x1024", portrait: "1024x1792", landscape: "1792x1024",
};
const requestImage = async (req, res) => {
  const promptAndShape = req.body;
  const image = await openai.images.generate({
    prompt: promptAndShape.content,
    model: "gpt-image-1", n: 1, size: shapeMap[promptAndShape.shape],
  });
  const response = {
    ...promptAndShape,
    revisedPrompt: image.data[0].revised_prompt,
    imageUrl: image.data[0].url,
  };
  conversation.push(response);
  res.json(response);
};
app.post("/api/openai/conversation/images", requestImage);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/chat/routes.js",
    codeAddedLines: [[6, 9], 18],
    embed: "openai-images",
  },
  {
    id: "vision-title",
    title: "VISION",
    kind: "title",
    bullets: [
      "Paste a URL. Express calls **vision**. UI shows the description",
    ],
  },
  {
    id: "vision",
    title: "Vision Routes",
    kind: "demo",
    bullets: ["`image_url` plus **Describe this image**"],
    code: `const describe = async (req, res) => {
  const { imageUrl } = req.body;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Describe this image" },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    }],
  });
  res.send(response.choices[0].message.content);
};
app.post("/api/openai/vision", describe);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/vision/routes.js",
    codeHighlightLines: [9],
    embed: "openai-vision",
  },
  {
    id: "tts-title",
    title: "TEXT TO SPEECH",
    kind: "title",
    bullets: [
      "Write an **mp3** on Express. Play it from Next.js",
    ],
  },
  {
    id: "tts",
    title: "Convert Text to Speech Route",
    kind: "demo",
    bullets: [
      "Static `/speech` serves the files. **`fs` stays on the server**",
    ],
    code: `const convertText2Speech = async (req, res) => {
  const { text } = req.body;
  const mp3 = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts", voice: "alloy", input: text,
  });
  const speech = \`speech-\${Date.now()}.mp3\`;
  await fs.promises.writeFile(join(__dirname, speech),
    Buffer.from(await mp3.arrayBuffer()));
  conversation.push({ text, speech });
  res.json(conversation);
};
app.post("/api/openai/tts", convertText2Speech);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/tts/routes.js",
    codeAddedLines: [[3, 5], 11],
  },
  {
    id: "stt-title",
    title: "SPEECH TO TEXT",
    kind: "title",
    bullets: [
      "List mp3s, then **transcribe** one file",
    ],
  },
  {
    id: "stt",
    title: "Transcribe Route",
    kind: "demo",
    bullets: ["Transcribe audio with **`gpt-4o-transcribe`**"],
    code: `const transcribe = async (req, res) => {
  const { audioFile } = req.params;
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(join("openai", "tts", audioFile)),
    model: "gpt-4o-transcribe",
  });
  res.send(transcription.text);
};
app.get("/api/openai/audio/transcribe/:audioFile", transcribe);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/stt/routes.js",
    codeAddedLines: [[3, 6], 9],
  },
  {
    id: "course-ai",
    title: "KAMBAZ SUGGEST COURSE",
    kind: "title",
    bullets: [
      "Dashboard **sparkle** → `POST /api/courses/ai`",
    ],
  },
  {
    id: "suggest-course",
    title: "Add suggestCourse Route",
    kind: "demo",
    bullets: [
      "Respond **JSON only** — name and description",
    ],
    code: `app.post("/api/courses/ai", async (req, res) => {
  const { name, description } = req.body;
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a Web API that only responds in JSON objects with properties name and description." },
      { role: "user", content: \`Give me a course for "\${name}" / "\${description}".\` },
    ],
  });
  res.json(response.choices[0].message.content);
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/Kambaz/Courses/routes.js",
    codeAddedLines: [1, [3, 9]],
  },
  {
    id: "suggest-button",
    title: "Suggest Course Button",
    kind: "demo",
    bullets: [
      "`IoSparkles` on the Dashboard **New Course** form",
    ],
    code: `const suggestCourse = async () => {
  const suggestedCourse = await courseClient.suggestCourse(
    course.name, course.description,
  );
  setCourse(JSON.parse(suggestedCourse));
};

<button onClick={suggestCourse}
  className="float-right ms-2 rounded bg-sky-500 px-3 py-2 text-white">
  <IoSparkles />
</button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeAddedLines: [[1, 6], [8, 11]],
  },
  {
    id: "module-ai",
    title: "KAMBAZ SUGGEST MODULE",
    kind: "demo",
    bullets: [
      "Next module name given the course and **existing modules**",
    ],
    code: `app.post("/api/modules/ai", async (req, res) => {
  const { courseName, courseDescription, modules } = req.body;
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Respond with only the name of a new module." },
      { role: "user", content: \`Follow \${modules.join(", ")} for \${courseName}.\` },
    ],
  });
  res.json(response.choices[0].message.content);
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/Kambaz/Modules/routes.js",
    codeAddedLines: [1],
  },
];
