import type { LectureSlide } from "../types";

export const YOUTUBE_SEARCH_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "SEARCH SCREEN",
    kind: "title",
    bullets: [
      "**Keyword search**, axios client, then cards",
      "Kambaz course nav gets a **YouTube** link",
    ],
  },
  {
    id: "endpoint",
    title: "Search API",
    kind: "demo",
    bullets: [
      "URL: `https://www.googleapis.com/youtube/v3/search`",
      "Required: **q** — search keyword · **key** — API key · **part** — e.g. `snippet`",
    ],
    code: `https://www.googleapis.com/youtube/v3/search?q=boats&key=YOUR_KEY&part=snippet`,
    codeLanguage: "text",
  },
  {
    id: "response",
    title: "Sample Response",
    kind: "demo",
    bullets: [
      "`kind` is `youtube#searchListResponse`",
      "`items` are on the **next slide**",
    ],
    code: `{
  "kind": "youtube#searchListResponse",
  "etag": "l1AScKaPwzdjB63pqQ9_CJvdBS0",
  "nextPageToken": "CAUQAA",
  "regionCode": "US",
  "pageInfo": { "totalResults": 467105, "resultsPerPage": 5 },
  "items": [ ... ]
}`,
    codeLanguage: "json",
    codeHighlightLines: [7],
  },
  {
    id: "items",
    title: "Sample Response Items",
    kind: "demo",
    bullets: [
      "Each item: **`id.videoId`** plus `snippet.title` and thumbnails",
    ],
    code: `{
  "kind": "youtube#searchResult",
  "id": { "kind": "youtube#video", "videoId": "PQ-GWgMnifE" },
  "snippet": {
    "publishedAt": "2024-10-08T13:40:01Z",
    "title": "BENETEAU Swift Trawler 54: ...",
    "description": "Welcome aboard the Swift Trawler 54 ...",
    "thumbnails": {
      "default": { "width": 120, "height": 90,
        "url": "https://i.ytimg.com/vi/PQ-GWgMnifE/default.jpg" },
      "medium": { }, "high": { }
    },
    "channelTitle": "BENETEAU America"
  }
}`,
    codeLanguage: "json",
    codeHighlightLines: [3, [6, 10]],
  },
  {
    id: "nav",
    title: "Add a New YouTube Link to Kambaz",
    kind: "demo",
    bullets: [
      "Course nav already lists Home, Modules, Assignments",
      "Path is **`youtube/search`** under the course id",
    ],
    code: `{
  segment: "youtube/search",
  id: "wd-course-youtube-link",
  label: "YouTube",
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/Navigation.tsx",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "placeholder",
    title: "Add a YouTube Screen Placeholder",
    kind: "demo",
    bullets: ["Stub the route before the client exists"],
    code: `export default function YouTubeSearch() {
  return (
    <div>
      <h2>YouTube Search</h2>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
  },
  {
    id: "client",
    title: "Create a YouTube API Client",
    kind: "demo",
    bullets: [
      "Read the env base and key. Return **`response.data.items`**",
    ],
    code: `import axios from "axios";
const YOUTUBE_API = process.env.NEXT_PUBLIC_YOUTUBE_API;
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export const search = async (query: string) => {
  const response = await axios.get(
    \`\${YOUTUBE_API}/search?part=snippet&q=\${query}&key=\${YOUTUBE_API_KEY}\`,
  );
  return response.data.items;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/client.ts",
    codeAddedLines: [[5, 10]],
    diagram: "youtube-search-flow",
  },
  {
    id: "screen",
    title: "Create Search Screen",
    kind: "demo",
    bullets: [
      `**"use client"** because \`useState\` and the click handler`,
      "`searchVideos` calls the client and **`setVideos`**",
    ],
    code: `"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import * as ytClient from "../client";

export default function YouTubeSearch() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const { cid } = useParams();
  const searchVideos = async () => {
    const videos = await ytClient.search(query);
    setVideos(videos);
  };`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    codeAddedLines: [[8, 14]],
  },
  {
    id: "field",
    title: "Create a Search Field",
    kind: "demo",
    bullets: [
      "Controlled input. Button calls **`searchVideos`**",
      "A rounded bordered input and a blue `bg-blue-600` Search button",
    ],
    code: `return (
  <div>
    <h2>YouTube Video Search</h2>
    <button
      className="mb-2 float-right w-1/4 rounded bg-blue-600 px-3 py-2 text-white"
      onClick={() => { searchVideos(); }}
    >
      Search
    </button>
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="mb-2 w-3/4 rounded border px-3 py-2"
    />`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    embed: "youtube-search",
  },
  {
    id: "cards",
    title: "Iterate Over Videos showing Videos",
    kind: "demo",
    bullets: [
      "Key is **`video.id.videoId`**. Thumb is `snippet.thumbnails.high.url`",
    ],
    code: `{videos && videos.length > 0 && (
  <div className="grid grid-cols-3 gap-4">
    {videos.map((video) => (
      <div key={video.id.videoId}>
        <img
          src={video.snippet.thumbnails.high.url}
          alt={video.snippet.title}
          className="w-full"
        />`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    codeHighlightLines: [3, 5],
  },
  {
    id: "links",
    title: "Render Video Title, Description and Link",
    kind: "demo",
    bullets: [
      "**Watch** opens YouTube. **Details** stays in Kambaz",
    ],
    code: `<h5>{video.snippet.title}</h5>
<p>{video.snippet.description}</p>
<a href={\`https://www.youtube.com/watch?v=\${video.id.videoId}\`}
   target="_blank">
  Watch Video
</a>
<Link href={\`/courses/\${cid}/youtube/details/\${video.id.videoId}\`}>
  View Details
</Link>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    codeHighlightLines: [[3, 6], [7, 9]],
  },
];
