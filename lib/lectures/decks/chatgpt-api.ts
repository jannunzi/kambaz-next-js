import type { LectureSlide } from "../types";

export const CHATGPT_API_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "OPENAI",
    kind: "title",
    bullets: [
      "Integrating with the **ChatGPT API**",
      "GPT-4 · tokens · OpenAI SDK",
    ],
  },
  {
    id: "gpt",
    title: "GPT-4",
    kind: "content",
    bullets: [
      "A large **multimodal** model — text or image in, text out",
      "Broader knowledge, advanced **reasoning**, better accuracy",
      "Available in the OpenAI API to paying customers. Optimized for **chat**",
      "[platform.openai.com/docs/overview](https://platform.openai.com/docs/overview)",
    ],
  },
  {
    id: "text-models",
    title: "Text generation models",
    kind: "content",
    bullets: [
      "Generative Pre-trained Transformers — **\"GPT\"**",
      "Inputs are **prompts**. Designing prompts is how you **\"program\" GPT-4**",
      "Instructions or **examples** of how to complete a task",
      "Content, code, summarization, conversation, creative writing",
      "**Prompt engineering**",
    ],
  },
  {
    id: "assistants",
    title: "Assistants",
    kind: "content",
    bullets: [
      "Assistants powered by **GPT-4**, performing tasks for users",
      "Operate from **instructions** in the context window",
      "Tools let them run code or retrieve information from a file",
    ],
  },
  {
    id: "tokens",
    title: "Tokens",
    kind: "content",
    bullets: [
      "Models process text in chunks — **\"tokens\"**",
      "`tokenization` is two tokens: **`token`** and **`ization`**. `the` is one",
      "Rule of thumb: **1 token ≈ 4 characters** or **0.75 words** in English",
      "Prompt + output must stay under the model's **maximum context length**",
    ],
  },
  {
    id: "models",
    title: "Models",
    kind: "content",
    bullets: [
      "[platform.openai.com/docs/models](https://platform.openai.com/docs/models)",
      "These examples use **`gpt-4o`** for the hello-world call",
      "Mini / reasoning models trade **speed, cost, and intelligence**",
      "Cookbooks: [cookbook.openai.com](https://cookbook.openai.com/)",
    ],
  },
  {
    id: "prompt-strategies",
    title: "Prompt engineering strategies",
    kind: "content",
    bullets: [
      "**Write clear instructions**",
      "Provide **reference text**",
      "Split complex tasks into simpler **subtasks**",
      "Give the model time to **\"think\"**",
      "Use **external tools**. Test changes systematically",
    ],
  },
  {
    id: "clear-instructions",
    title: "Write clear instructions",
    kind: "content",
    bullets: [
      "Include **details** to get more relevant answers",
      "Ask the model to adopt a **persona**",
      "Use **delimiters** for distinct parts of the input",
      "Specify **steps**, **examples**, and the desired **length**",
    ],
  },
  {
    id: "configuring",
    title: "CONFIGURING OPENAI",
    kind: "title",
    bullets: [
      "Install the SDK on **`webdev-server`**",
      "The key stays in Express — **never NEXT_PUBLIC_**",
    ],
  },
  {
    id: "install",
    title: "Step 1: Install OpenAI API",
    kind: "demo",
    bullets: [
      "Install OpenAI Library — on the **server**, not in Next.js",
      "[platform.openai.com/docs/quickstart](https://platform.openai.com/docs/quickstart)",
    ],
    code: `cd webdev-server
npm install openai`,
    codeLanguage: "bash",
  },
  {
    id: "project",
    title: "Step 2: Create a New Project",
    kind: "demo",
    bullets: [
      "Create a project, then **Create new secret key**",
      "Copy once. Store in server **`.env`**",
    ],
    diagram: "openai-project-key-mock",
  },
  {
    id: "env",
    title: "Step 3: Set up your API key",
    kind: "demo",
    bullets: [
      "Course stack: **`webdev-server/.env`**, not `~/.zshrc`",
      "A public prefix would ship the key to every **browser**",
    ],
    code: `OPENAI_API=https://api.openai.com/v1
OPENAI_API_KEY=your-api-key-here`,
    codeLanguage: "bash",
    codeFile: "webdev-server/.env",
    codeAddedLines: [[1, 2]],
    interactiveHint:
      "Do not copy any real API key into the repo.",
  },
  {
    id: "hello",
    title: "Step 4: Hello World!",
    kind: "demo",
    bullets: ["**`output_text`** aggregates the completion string"],
    code: `import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-4o",
  input: "Write a one-sentence bedtime story about a unicorn.",
});

console.log(response.output_text);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/hello.js",
    codeAddedLines: [1, [4, 7], 9],
  },
  {
    id: "run",
    title: "Running Hello World!",
    kind: "demo",
    bullets: [
      "Typical output: a one-sentence **unicorn** bedtime story",
    ],
    code: `cd webdev-server
node openai/hello.js
# In a meadow where moonbeams danced like whispers on water,
# a brave unicorn named Luna discovered a hidden grove
# where dreams blossomed into stars.`,
    codeLanguage: "bash",
  },
];
