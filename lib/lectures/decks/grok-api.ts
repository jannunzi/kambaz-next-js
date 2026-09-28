import type { LectureSlide } from "../types";

export const GROK_API_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Integrating with **Grok**",
      "xAI · tokens · **grok-4-latest**",
    ],
  },
  {
    id: "grok",
    title: "GROK",
    kind: "title",
    bullets: [
      "A family of LLMs by **xAI**",
      "Optional walkthrough: [youtu.be/rwE57Cdk1fA](https://youtu.be/rwE57Cdk1fA)",
    ],
  },
  {
    id: "intro",
    title: "Introduction",
    kind: "content",
    bullets: [
      "Inspired by the **Hitchhiker's Guide** — maximally truth-seeking",
      "xAI offers an API at **`https://api.x.ai/v1`**",
      "The same models power Grok.com, the apps, and Grok on **X**",
    ],
  },
  {
    id: "pricing",
    title: "Model Pricing",
    kind: "content",
    bullets: [
      "You pay for **input tokens** plus **completion tokens**",
      "Check current prices on the xAI console before class demos",
    ],
  },
  {
    id: "tokens-title",
    title: "TOKENS",
    kind: "title",
    bullets: [
      "The **base unit** of prompt size and price",
    ],
  },
  {
    id: "tokens",
    title: "Tokens",
    kind: "content",
    bullets: [
      "One or more **character(s)/symbol(s)**",
      "A **tokenizer** decomposes the prompt before inference",
      "The model generates **completion tokens**, then aggregates a response",
    ],
    diagram: "grok-token-flow",
  },
  {
    id: "text-tokens",
    title: "Text Tokens",
    kind: "content",
    bullets: [
      "A whole word, or smaller **chunks**",
      "The more common a word, the more likely it is **one token**",
      "**Flint** can be two tokens. **Michigan** can be one",
    ],
  },
  {
    id: "tokenizers",
    title: "Tokenizers",
    kind: "content",
    bullets: [
      "`drafter` → **`dra`** + **`fter`**. `postmaster` → **`post`** + **`master`**",
      "Different Grok models may share or use different tokenizers",
      "Token count is approximately **linear** to sequence length",
    ],
  },
  {
    id: "key-title",
    title: "API KEY",
    kind: "title",
    bullets: [
      "Name it, copy it once, add **paid credits**",
    ],
  },
  {
    id: "key",
    title: "Create API Key",
    kind: "demo",
    bullets: [
      "**Name the key**. Create API key. Copy it",
      "Test with **curl** from your laptop before writing Node",
    ],
    diagram: "xai-key-mock",
  },
  {
    id: "credits",
    title: "Add Paid Credits",
    kind: "content",
    bullets: [
      "Purchase credits in the xAI console",
      "The free quota is **not enough** for class",
    ],
  },
  {
    id: "curl",
    title: "API CURL Test",
    kind: "demo",
    bullets: [
      "Model **`grok-4-latest`**. Bearer is the key — use a placeholder",
    ],
    code: `curl https://api.x.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_XAI_API_KEY" \\
  -d '{
    "messages": [
      { "role": "system", "content": "You are a test assistant." },
      { "role": "user", "content": "Testing. Just say hi and hello world and nothing else." }
    ],
    "model": "grok-4-latest",
    "stream": false,
    "temperature": 0
  }'`,
    codeLanguage: "bash",
    codeHighlightLines: [1, 3, 9],
  },
  {
    id: "response",
    title: "API Response",
    kind: "demo",
    bullets: ["`choices[0].message.content` is **`hi and hello world`**"],
    code: `{
  "id": "84c41e00-0642-f911-0382-8044e4127378",
  "object": "chat.completion",
  "model": "grok-4-0709",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "hi and hello world"
    },
    "finish_reason": "stop"
  }]
}`,
    codeLanguage: "json",
    codeHighlightLines: [[7, 10]],
  },
  {
    id: "api",
    title: "API",
    kind: "title",
    bullets: [
      "`ai` + `@ai-sdk/xai` for **`generateText`**",
      "`openai` + `zod` for chat later",
    ],
  },
  {
    id: "install",
    title: "Install xAI Libraries",
    kind: "demo",
    bullets: ["Install on **`webdev-server`**"],
    code: `cd webdev-server
npm install ai
npm install @ai-sdk/xai
npm install openai
npm install zod`,
    codeLanguage: "bash",
  },
  {
    id: "env",
    title: "Add Key to .env",
    kind: "demo",
    bullets: [
      "Server-only. **Never** `NEXT_PUBLIC_XAI_API_KEY`",
    ],
    code: `XAI_BASE_URL=https://api.x.ai/v1
XAI_API_KEY=YOUR_XAI_API_KEY`,
    codeLanguage: "bash",
    codeFile: "webdev-server/.env",
    codeAddedLines: [[1, 2]],
    interactiveHint:
      "Do not copy any real API key into the repo.",
  },
  {
    id: "meaning",
    title: "Meaning Of Life",
    kind: "demo",
    bullets: [
      "`xai(\"grok-4\")` plus a **system** line and a **prompt**",
    ],
    code: `import "dotenv/config";
import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";

const result = await generateText({
  model: xai("grok-4"),
  system: "You are Grok, a highly intelligent, helpful AI assistant.",
  prompt: "What is the meaning of life, the universe, and everything?",
});

console.log(result.text);`,
    codeLanguage: "typescript",
    codeFile: "webdev-server/xai/meaning.ts",
    codeAddedLines: [2, 3, [5, 9], 11],
  },
  {
    id: "meaning-out",
    title: "Response",
    kind: "content",
    bullets: [
      "`node xai/meaning.js` — Grok answers **42**",
      "Hitchhiker's Guide, then a short philosophical aside",
    ],
  },
];
