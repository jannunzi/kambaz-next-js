"use client";

import { useState } from "react";
import { BsYoutube } from "react-icons/bs";
import { ImSpinner3 } from "react-icons/im";
import { IoChevronBack } from "react-icons/io5";
import { PiStarFourFill } from "react-icons/pi";
import LectureDemoFrame from "./LectureDemoFrame";

const MOCK_VIDEOS = [
  {
    id: "PQ-GWgMnifE",
    title: "BENETEAU Swift Trawler 54",
    description: "Welcome aboard the Swift Trawler 54.",
    thumb: "https://i.ytimg.com/vi/PQ-GWgMnifE/hqdefault.jpg",
  },
  {
    id: "KSfs9fJW1rY",
    title: "Next.js + YouTube classroom demo",
    description: "Search, details, then save a youTubeId.",
    thumb: "https://i.ytimg.com/vi/KSfs9fJW1rY/hqdefault.jpg",
  },
];

export function YouTubeSearchEmbed() {
  const [query, setQuery] = useState("boats");
  const [videos, setVideos] = useState(MOCK_VIDEOS);

  return (
    <LectureDemoFrame
      label="youtube/search/page.tsx"
      url="/courses/CS1234/youtube/search"
    >
      <div className="font-sans text-sm">
        <h3 className="mt-0 mb-2 text-base font-semibold">YouTube Video Search</h3>
        <div className="mb-3 flex gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-3/4 rounded border px-3 py-2"
            aria-label="Search query"
          />
          <button
            type="button"
            className="w-1/4 rounded bg-blue-600 px-3 py-2 text-white"
            onClick={() => setVideos(MOCK_VIDEOS)}
          >
            Search
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {videos.map((video) => (
            <article key={video.id} className="overflow-hidden rounded border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={video.thumb} alt="" className="aspect-video w-full object-cover" />
              <div className="p-2">
                <h4 className="mt-0 mb-1 text-sm font-semibold">{video.title}</h4>
                <p className="mb-2 text-xs text-neutral-600">{video.description}</p>
                <div className="flex gap-2">
                  <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">
                    Watch Video
                  </span>
                  <span className="rounded bg-neutral-600 px-2 py-1 text-xs text-white">
                    View Details
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </LectureDemoFrame>
  );
}

export function YouTubeDetailsEmbed() {
  return (
    <LectureDemoFrame
      label="youtube/details/[vid]/page.tsx"
      url="/courses/CS1234/youtube/details/PQ-GWgMnifE"
    >
      <div className="font-sans text-sm">
        <h3 className="mt-0 mb-2 flex items-center gap-2 text-base font-semibold">
          <IoChevronBack className="text-xl" />
          BENETEAU Swift Trawler 54
        </h3>
        <div className="mb-3 flex aspect-video items-center justify-center rounded bg-neutral-900 text-white">
          youtube.com/embed/PQ-GWgMnifE
        </div>
        <p className="mb-3 text-xs text-neutral-600">
          Welcome aboard the Swift Trawler 54.
        </p>
        <div className="flex gap-2">
          <span className="rounded bg-blue-600 px-3 py-1.5 text-xs text-white">
            Watch on YouTube
          </span>
          <span className="rounded bg-emerald-600 px-3 py-1.5 text-xs text-white">
            Save to Lesson
          </span>
        </div>
      </div>
    </LectureDemoFrame>
  );
}

export function YouTubeLessonEmbed() {
  return (
    <LectureDemoFrame label="modules/LessonControlButtons.tsx" url="/courses/CS1234/modules">
      <ul className="m-0 list-none p-0 font-sans text-sm">
        <li className="flex items-center justify-between border-l-[3px] border-green-600 p-3">
          <span>Introduction to the course</span>
          <span className="flex items-center gap-2 text-red-600">
            <BsYoutube className="text-xl" aria-label="Search YouTube for this lesson" />
            <span className="text-emerald-600">✓</span>
          </span>
        </li>
        <li className="flex items-center justify-between border-l-[3px] border-green-600 p-3">
          <a className="text-red-600 underline" href="#youtube-details">
            Learn what is Web Development
          </a>
          <span className="flex items-center gap-2 text-red-600">
            <BsYoutube className="text-xl" />
            <span className="text-emerald-600">✓</span>
          </span>
        </li>
      </ul>
    </LectureDemoFrame>
  );
}

export function OpenAIChatEmbed() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "user", content: "Hello, ChatGPT" },
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);

  return (
    <LectureDemoFrame label="openai/chat/page.tsx" url="/openai/chat">
      <div className="font-sans text-sm">
        <h3 className="mt-0 mb-2 text-base font-semibold">Chat</h3>
        <ul className="m-0 mb-2 list-none overflow-hidden rounded border p-0">
          {messages.map((message, index) => (
            <li
              key={`${message.role}-${index}`}
              className={`border-b px-3 py-2 last:border-b-0 ${
                message.role === "user" ? "bg-sky-50" : "bg-emerald-50"
              }`}
            >
              <strong>{message.role}</strong>: {message.content}
            </li>
          ))}
          <li className="px-3 py-2">
            <button
              type="button"
              className="mb-2 rounded bg-blue-600 px-3 py-1.5 text-white"
              onClick={() => {
                if (!input.trim()) return;
                setMessages((current) => [
                  ...current,
                  { role: "user", content: input },
                  {
                    role: "assistant",
                    content: "Mock reply — the live call stays on Express.",
                  },
                ]);
                setInput("");
              }}
            >
              Send
            </button>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="lecture-chat-field w-full rounded border px-3 py-2"
              rows={2}
              aria-label="Chat message"
            />
          </li>
        </ul>
      </div>
    </LectureDemoFrame>
  );
}

export function OpenAIImagesEmbed() {
  const [prompt, setPrompt] = useState("a white siamese cat");
  const [shape, setShape] = useState("square");

  return (
    <LectureDemoFrame label="openai/images/page.tsx" url="/openai/images">
      <div className="font-sans text-sm">
        <h3 className="mt-0 mb-2 text-base font-semibold">Images</h3>
        <div className="mb-3 flex items-center justify-center rounded border bg-neutral-100 py-8 text-neutral-500">
          {shape} · mock DALL·E / gpt-image result
        </div>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="lecture-chat-field mb-2 w-full rounded border px-3 py-2"
          placeholder="Describe the image to generate"
        />
        <select
          value={shape}
          onChange={(event) => setShape(event.target.value)}
          className="rounded border px-3 py-2"
          aria-label="Image shape"
        >
          <option value="square">Square</option>
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>
    </LectureDemoFrame>
  );
}

export function OpenAIVisionEmbed() {
  const [imageUrl, setImageUrl] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/640px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
  );
  const [description, setDescription] = useState("");

  return (
    <LectureDemoFrame label="openai/vision/page.tsx" url="/openai/vision">
      <div className="font-sans text-sm">
        <h3 className="mt-0 mb-2 text-base font-semibold">Vision</h3>
        <div className="mb-2 flex gap-2">
          <input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            className="lecture-chat-field flex-1 rounded border px-3 py-2"
            aria-label="Image URL"
          />
          <button
            type="button"
            className="rounded bg-neutral-900 px-3 py-2 text-white"
            onClick={() =>
              setDescription(
                "A wooden boardwalk through green grass under a blue sky — mock vision reply.",
              )
            }
          >
            Describe
          </button>
        </div>
        <textarea
          readOnly
          value={description}
          rows={3}
          className="lecture-chat-field mb-2 w-full rounded border px-3 py-2"
          aria-label="Description"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="h-24 rounded object-cover" />
      </div>
    </LectureDemoFrame>
  );
}

export function GrokSparkleEmbed() {
  const [name, setName] = useState("Web Development");
  const [description, setDescription] = useState("");
  const [loadingTitle, setLoadingTitle] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState(false);

  return (
    <LectureDemoFrame label="Dashboard/page.tsx" url="/dashboard">
      <div className="font-sans text-sm">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
          New Course
        </label>
        <div className="mb-3 flex gap-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="flex-1 rounded border px-3 py-2"
            aria-label="Course title"
          />
          <button
            type="button"
            className="rounded bg-sky-500 px-3 py-2 text-white"
            aria-label="Suggest title"
            onClick={() => {
              setLoadingTitle(true);
              window.setTimeout(() => {
                setName("Full-Stack Web Development with Next.js");
                setLoadingTitle(false);
              }, 400);
            }}
          >
            {loadingTitle ? (
              <ImSpinner3 className="animate-spin text-lg" />
            ) : (
              <PiStarFourFill className="text-lg" />
            )}
          </button>
        </div>
        <div className="flex gap-2">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="flex-1 rounded border px-3 py-2"
            aria-label="Course description"
          />
          <button
            type="button"
            className="self-start rounded bg-sky-500 px-3 py-3 text-white"
            aria-label="Suggest description"
            onClick={() => {
              setLoadingDescription(true);
              window.setTimeout(() => {
                setDescription(
                  `A mock Grok suggestion for "${name}": build Next.js screens, then call Express so the xAI key never ships to the browser.`,
                );
                setLoadingDescription(false);
              }, 400);
            }}
          >
            {loadingDescription ? (
              <ImSpinner3 className="animate-spin text-lg" />
            ) : (
              <PiStarFourFill className="text-lg" />
            )}
          </button>
        </div>
      </div>
    </LectureDemoFrame>
  );
}

export function GrokModulesEmbed() {
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<string[]>([]);

  return (
    <LectureDemoFrame label="modules/page.tsx" url="/courses/CS1234/modules">
      <div className="font-sans text-sm">
        <button
          type="button"
          className="mb-3 rounded bg-green-600 px-3 py-2 text-white"
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => {
              setModules([
                "HTML and the DOM",
                "Styling with Tailwind",
                "React state and APIs",
              ]);
              setLoading(false);
            }, 400);
          }}
        >
          {loading && <ImSpinner3 className="me-2 inline animate-spin" />}
          Suggest Course Structure
        </button>
        <ul className="m-0 list-none p-0">
          {modules.map((name) => (
            <li key={name} className="border-l-[3px] border-green-600 p-3">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </LectureDemoFrame>
  );
}
