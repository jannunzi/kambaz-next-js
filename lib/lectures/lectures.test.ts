import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  authoredSlideBullets,
  authoredSlideTextParts,
  deckUsesBlockModel,
  isBlockSlide,
  toBlockSlide,
  toBlockSlides,
} from "./blocks";
import { demoFrameClips, MARGINS_LIVE_CLIP_BEFORE } from "./demo-clip";
import {
  COURSE_SITE_ORIGIN,
  adjacentLectureSlugs,
  bookHrefForSection,
  getLecture,
  getLectureDeck,
  isLectureSlug,
  lectureCompanionLinkLabel,
  lectureDeckThumbnail,
  lecturePublicUrl,
  listCanvasLectureGroups,
  listChapterTopicGroups,
  listDecksForBookSection,
  listLectureChapters,
  listLectureDecks,
  listLectureSlugs,
  listLectures,
} from "./catalog";
import {
  BOOK_CHAPTERS,
  LECTURE_1_SLUGS,
  LECTURE_2_SLUGS,
  LECTURE_3_SLUGS,
  LECTURE_4_SLUGS,
  LECTURE_6_SLUGS,
  LECTURE_7_SLUGS,
  CHAPTER_3_SLUGS,
  CHAPTER_4_SLUGS,
  CHAPTER_5_SLUGS,
  CHAPTER_6_SLUGS,
  PROJECT_SLUGS,
  LECTURE_TOPICS,
  LECTURE_DIAGRAM_IDS,
  LECTURE_EMBED_IDS,
  LECTURE_SLUGS,
  LECTURE_TITLE_MAX_CHARS,
  isBookKambazTargetSrc,
  lectureChapterLabel,
  lectureSlideAssetPath,
  lectureSlideDensity,
  lectureSlideCodeBlocks,
  lectureThumbPath,
} from "./types";
import { slidePaneOverflows, slidePaneScrollStep } from "./slide-pane";
import {
  LECTURE_PRESENT_STATE,
  isLectureNextUpSlide,
  isLecturePresentHistoryState,
  lectureDeckHref,
  lecturePresentHref,
  lectureSearchIsPresent,
  lectureShouldShowContinue,
  nativeFullscreenEnabled,
  nativeFullscreenElement,
  preferNativeFullscreen,
  swipeSlideDelta,
  swipeTargetIsInteractive,
} from "./present-mode";

function slideText(deckSlug: string): string {
  const deck = getLectureDeck(deckSlug);
  assert.ok(deck);
  return deck.slides
    .flatMap((slide) => [slide.title, ...authoredSlideTextParts(slide)])
    .join("\n");
}

/** Home (`href="/labs"`) must not carry the Lab 1 id. */
const HOME_LABS_AS_LAB1 =
  /<(?:Link|a)\b[^>]*href=["']\/labs["'][^>]*id=["']wd-lab1-link["']|<(?:Link|a)\b[^>]*id=["']wd-lab1-link["'][^>]*href=["']\/labs["']/s;

function sourceFilesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFilesUnder(full));
    else if (/\.(tsx|ts)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function findSlide(deckSlug: string, id: string) {
  const deck = getLectureDeck(deckSlug);
  assert.ok(deck);
  const slide = deck.slides.find((row) => row.id === id);
  assert.ok(slide, `${deckSlug} missing slide ${id}`);
  return slide;
}

describe("lecture catalog", () => {
  it("lists slugs in book-spine order (Ch1–Ch6, then Project decks)", () => {
    assert.deepEqual(listLectureSlugs(), [
      ...LECTURE_1_SLUGS,
      ...LECTURE_2_SLUGS,
      ...LECTURE_3_SLUGS,
      ...LECTURE_4_SLUGS,
      ...LECTURE_6_SLUGS,
      ...LECTURE_7_SLUGS,
      ...CHAPTER_3_SLUGS,
      ...CHAPTER_4_SLUGS,
      ...CHAPTER_5_SLUGS,
      ...CHAPTER_6_SLUGS,
      ...PROJECT_SLUGS,
    ]);
    assert.deepEqual(listLectureSlugs(), [...LECTURE_SLUGS]);
    assert.equal(LECTURE_1_SLUGS.length, 5);
    assert.equal(LECTURE_2_SLUGS.length, 6);
    assert.equal(LECTURE_3_SLUGS.length, 7);
    assert.equal(LECTURE_4_SLUGS.length, 8);
    assert.equal(LECTURE_6_SLUGS.length, 7);
    assert.equal(LECTURE_7_SLUGS.length, 6);
    assert.equal(CHAPTER_3_SLUGS.length, 22);
    assert.equal(CHAPTER_4_SLUGS.length, 15);
    assert.equal(CHAPTER_5_SLUGS.length, 14);
    assert.equal(CHAPTER_6_SLUGS.length, 12);
    assert.equal(PROJECT_SLUGS.length, 9);
    assert.ok(!PROJECT_SLUGS.some((slug) => slug.startsWith("napster")));
  });

  it("marks Lecture 1 entries as Canvas Lecture 1 / Chapter 1", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 1);
    assert.equal(items.length, 5);
    for (const item of items) {
      assert.equal(item.chapter, 1);
      assert.equal(item.canvasLecture, 1);
      assert.equal(item.chapterHref, "/book/ch1");
      assert.ok(item.chapterTitle.length > 0);
      assert.ok(item.title.length > 0);
      assert.ok(item.summary.length > 0);
      assert.equal(item.publicUrl, `${COURSE_SITE_ORIGIN}/slides/${item.slug}`);
      assert.equal(lecturePublicUrl(item.slug), item.publicUrl);
      assert.equal(item.thumbnailSrc, lectureDeckThumbnail(item.slug));
      assert.doesNotMatch(item.thumbnailSrc, /slide-01/);
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
    assert.equal(items[0]?.topicId, "intro");
    assert.equal(items[0]?.topic, "Introduction");
    assert.equal(items[0]?.bookSectionId, "intro");
    assert.equal(items[0]?.bookHref, "/book/ch1#intro");
    assert.equal(items[1]?.topicId, "setup");
    assert.equal(items[2]?.topicId, "setup");
    assert.equal(items[3]?.topicId, "source-control");
    assert.equal(items[3]?.bookSectionId, "sec-1-5");
    assert.equal(items[3]?.bookHref, "/book/ch1#sec-1-5");
    assert.equal(items[4]?.topicId, "deploy");
    assert.equal(items[4]?.bookSectionId, "sec-1-6");
  });

  it("marks Lecture 2 entries as Canvas Lecture 2 / Chapter 1", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 2);
    assert.equal(items.length, 6);
    assert.deepEqual(
      items.map((item) => item.slug),
      [...LECTURE_2_SLUGS],
    );
    for (const item of items) {
      assert.equal(item.chapter, 1);
      assert.equal(item.topicId, "html");
      assert.equal(item.topic, "1.3 Introduction to HTML");
      assert.equal(item.canvasLecture, 2);
      assert.equal(item.chapterHref, "/book/ch1");
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
  });

  it("returns undefined for unknown slugs", () => {
    assert.equal(getLecture("not-a-deck"), undefined);
    assert.equal(getLectureDeck("vite-spa"), undefined);
    assert.equal(isLectureSlug("intro-to-web-development"), true);
    assert.equal(isLectureSlug("html-and-dom"), true);
    assert.equal(isLectureSlug("css-intro"), true);
    assert.equal(isLectureSlug("react-icons"), true);
    assert.equal(isLectureSlug("kambaz-styling"), true);
    assert.equal(isLectureSlug("intro-to-javascript"), true);
    assert.equal(isLectureSlug("javascript-functions"), true);
    assert.equal(isLectureSlug("click-events"), true);
    assert.equal(isLectureSlug("zustand-counter"), true);
    assert.equal(isLectureSlug("kambaz-courses-store"), true);
    assert.equal(isLectureSlug("http-server"), true);
    assert.equal(isLectureSlug("next-routes"), true);
    assert.equal(isLectureSlug("kambaz-account-rest"), true);
    assert.equal(isLectureSlug("deploy-api"), true);
    assert.equal(isLectureSlug("local-mongo"), true);
    assert.equal(isLectureSlug("mongoose"), true);
    assert.equal(isLectureSlug("mongo-apis"), true);
    assert.equal(isLectureSlug("atlas"), true);
    assert.equal(isLectureSlug("atlas-compass"), true);
    assert.equal(isLectureSlug("atlas-node"), true);
    assert.equal(isLectureSlug("atlas-sessions"), true);
    assert.equal(isLectureSlug("kambaz-courses-db"), true);
    assert.equal(isLectureSlug("youtube-api"), true);
    assert.equal(isLectureSlug("chatgpt-api"), true);
    assert.equal(isLectureSlug("grok-api"), true);
    assert.equal(isLectureSlug("napster-api"), false);
    assert.equal(isLectureSlug("intro"), false);
  });

  it("marks Tailwind library decks as Canvas Lecture 6 / Chapter 2", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 6);
    assert.equal(items.length, 7);
    assert.deepEqual(
      items.map((item) => item.slug),
      [...LECTURE_6_SLUGS],
    );
    for (const item of items) {
      assert.equal(item.chapter, 2);
      assert.equal(item.topicId, item.slug === "react-icons" ? "react-icons" : "tailwind");
      assert.equal(
        item.topic,
        item.slug === "react-icons"
          ? "2.2 Decorating Documents with React Icons"
          : "2.3 Styling Webpages with Tailwind CSS",
      );
      assert.equal(item.canvasLecture, 6);
      assert.equal(item.chapterHref, "/book/ch2");
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
  });

  it("marks Kambaz styling decks as Canvas Lecture 7 / Chapter 2", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 7);
    assert.equal(items.length, 6);
    assert.deepEqual(
      items.map((item) => item.slug),
      [...LECTURE_7_SLUGS],
    );
    for (const item of items) {
      assert.equal(item.chapter, 2);
      assert.equal(item.topicId, "kambaz-styling");
      assert.equal(item.topic, "2.4 Styling Kambaz with CSS and Tailwind");
      assert.equal(item.canvasLecture, 7);
      assert.equal(item.chapterHref, "/book/ch2");
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
  });

  it("marks Lecture 4 entries as Canvas Lecture 4 / Chapter 2", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 4);
    assert.equal(items.length, 8);
    assert.deepEqual(
      items.map((item) => item.slug),
      [...LECTURE_4_SLUGS],
    );
    for (const item of items) {
      assert.equal(item.chapter, 2);
      assert.equal(item.topicId, "css");
      assert.equal(item.topic, "2.1 Styling React Components with CSS");
      assert.equal(item.canvasLecture, 4);
      assert.equal(item.chapterHref, "/book/ch2");
      assert.equal(
        item.chapterTitle,
        "Styling User Interfaces with CSS and Tailwind",
      );
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
  });

  it("marks Lecture 3 entries as Canvas Lecture 3 / Chapter 1", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 3);
    assert.equal(items.length, 7);
    assert.deepEqual(
      items.map((item) => item.slug),
      [...LECTURE_3_SLUGS],
    );
    for (const item of items) {
      assert.equal(item.chapter, 1);
      assert.equal(item.topicId, "kambaz-html");
      assert.equal(item.topic, "1.4 Prototyping the React Kambaz User Interface with HTML");
      assert.equal(item.canvasLecture, 3);
      assert.equal(item.chapterHref, "/book/ch1");
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
  });

  it("groups the hub by book chapter and topic, not Canvas lecture folders", () => {
    const groups = listChapterTopicGroups();
    assert.deepEqual(
      groups.map((group) => group.chapter),
      [1, 2, 3, 4, 5, 6, 7],
    );
    assert.equal(groups[0]?.href, "/book/ch1");
    assert.equal(
      groups[0]?.title,
      "Building Next.js User Interfaces with HTML",
    );
    assert.deepEqual(
      groups.map((group) => group.weeks),
      [
        "9/14, 9/21",
        "9/28, 10/5",
        "10/12, 10/19",
        "10/26, 11/2",
        "11/9, 11/16",
        "11/23, 11/30",
        "12/7",
      ],
    );
    assert.deepEqual(
      BOOK_CHAPTERS.map((chapter) => chapter.weeks),
      groups.map((group) => group.weeks),
    );
    assert.deepEqual(
      groups[0]?.topics.map((topic) => topic.topicId),
      ["intro", "setup", "source-control", "deploy", "html", "kambaz-html"],
    );
    assert.deepEqual(
      groups[0]?.topics.map((topic) => topic.title),
      [
        "Introduction",
        "1.2 Setting Up the Development Environment",
        "1.5 Committing Code to Source Control",
        "1.6 Deploying Next.js Projects to the Web",
        "1.3 Introduction to HTML",
        "1.4 Prototyping the React Kambaz User Interface with HTML",
      ],
    );
    assert.deepEqual(
      groups[0]?.topics[0]?.decks.map((deck) => deck.slug),
      ["intro-to-web-development"],
    );
    assert.deepEqual(
      groups[0]?.topics[1]?.decks.map((deck) => deck.slug),
      ["installing-nodejs", "creating-a-nextjs-react-application"],
    );
    assert.deepEqual(
      groups[0]?.topics[2]?.decks.map((deck) => deck.slug),
      ["commit-to-github"],
    );
    assert.deepEqual(
      groups[0]?.topics[3]?.decks.map((deck) => deck.slug),
      ["deploying-to-vercel"],
    );
    assert.deepEqual(
      groups[0]?.topics[4]?.decks.map((deck) => deck.slug),
      [...LECTURE_2_SLUGS],
    );
    assert.deepEqual(
      groups[0]?.topics[5]?.decks.map((deck) => deck.slug),
      [...LECTURE_3_SLUGS],
    );

    assert.equal(groups[1]?.href, "/book/ch2");
    assert.deepEqual(
      groups[1]?.topics.map((topic) => topic.topicId),
      ["css", "react-icons", "tailwind", "kambaz-styling"],
    );
    assert.deepEqual(
      groups[1]?.topics.map((topic) => topic.title),
      [
        "2.1 Styling React Components with CSS",
        "2.2 Decorating Documents with React Icons",
        "2.3 Styling Webpages with Tailwind CSS",
        "2.4 Styling Kambaz with CSS and Tailwind",
      ],
    );
    assert.deepEqual(
      groups[1]?.topics[0]?.decks.map((deck) => deck.slug),
      [...LECTURE_4_SLUGS],
    );
    assert.deepEqual(
      groups[1]?.topics[1]?.decks.map((deck) => deck.slug),
      ["react-icons"],
    );
    assert.deepEqual(
      groups[1]?.topics[2]?.decks.map((deck) => deck.slug),
      LECTURE_6_SLUGS.filter((slug) => slug !== "react-icons"),
    );
    assert.deepEqual(
      groups[1]?.topics[3]?.decks.map((deck) => deck.slug),
      [...LECTURE_7_SLUGS],
    );

    assert.equal(groups[2]?.href, "/book/ch3");
    assert.deepEqual(
      groups[2]?.topics.map((topic) => topic.topicId),
      [
        "js-intro",
        "js-functions",
        "js-data",
        "dynamic-styling",
        "client-server",
        "parameterizing",
        "kambaz-data",
      ],
    );
    assert.deepEqual(
      groups[2]?.topics.map((topic) => topic.title),
      [
        "3.2 Introduction to JavaScript",
        "3.3 JavaScript Functions",
        "3.4 JavaScript Data Structures",
        "3.5 Dynamic Styling",
        "3.6 Client and Server Components",
        "3.7 Parameterizing Components",
        "3.9 Implementing a Data Driven Kambaz Application",
      ],
    );
    assert.equal(groups[2]?.topics[0]?.bookHref, "/book/ch3#sec-3-2");
    assert.deepEqual(
      groups[2]?.topics[0]?.decks.map((deck) => deck.slug),
      CHAPTER_3_SLUGS.slice(0, 5),
    );
    assert.deepEqual(
      groups[2]?.topics[1]?.decks.map((deck) => deck.slug),
      ["javascript-functions"],
    );
    assert.deepEqual(
      groups[2]?.topics[2]?.decks.map((deck) => deck.slug),
      [
        "javascript-arrays",
        "array-iteration",
        "array-search",
        "reduce-and-json",
        "javascript-objects",
        "spread-and-destructuring",
        "optional-chaining",
      ],
    );
    assert.deepEqual(
      groups[2]?.topics[3]?.decks.map((deck) => deck.slug),
      ["dynamic-styling"],
    );
    assert.deepEqual(
      groups[2]?.topics[4]?.decks.map((deck) => deck.slug),
      ["client-and-server"],
    );
    assert.deepEqual(
      groups[2]?.topics[5]?.decks.map((deck) => deck.slug),
      ["parameterizing-components", "path-params-and-todos"],
    );
    assert.deepEqual(
      groups[2]?.topics[6]?.decks.map((deck) => deck.slug),
      [
        "kambaz-database",
        "kambaz-dashboard-data",
        "kambaz-courses-data",
        "kambaz-modules-data",
        "kambaz-assignments-data",
      ],
    );

    assert.equal(groups[3]?.href, "/book/ch4");
    assert.deepEqual(
      groups[3]?.topics.map((topic) => topic.topicId),
      [
        "events-state",
        "sharing-url",
        "react-context",
        "zustand",
        "effects",
        "ch4-check",
        "kambaz-state",
      ],
    );
    assert.deepEqual(
      groups[3]?.topics.map((topic) => topic.title),
      [
        "4.2 Managing State and User Input with Forms",
        "4.3 Sharing State, Prop Drilling, and URLs",
        "4.4 React Context",
        "4.5 Zustand",
        "4.7 Side Effects with useEffect",
        "4.9 Check Your Understanding",
        "4.10 Adding State to the Kambaz User Interface",
      ],
    );
    assert.equal(groups[3]?.topics[0]?.bookHref, "/book/ch4#sec-4-2");
    assert.deepEqual(
      groups[3]?.topics[0]?.decks.map((deck) => deck.slug),
      CHAPTER_4_SLUGS.slice(0, 4),
    );
    assert.deepEqual(
      groups[3]?.topics[1]?.decks.map((deck) => deck.slug),
      ["sharing-parent-child", "prop-drilling-and-url"],
    );
    assert.deepEqual(
      groups[3]?.topics[2]?.decks.map((deck) => deck.slug),
      ["react-context"],
    );
    assert.deepEqual(
      groups[3]?.topics[3]?.decks.map((deck) => deck.slug),
      ["zustand-counter", "zustand-todos"],
    );
    assert.deepEqual(
      groups[3]?.topics[4]?.decks.map((deck) => deck.slug),
      ["use-effect"],
    );
    assert.deepEqual(
      groups[3]?.topics[5]?.decks.map((deck) => deck.slug),
      ["ch4-check-understanding"],
    );
    assert.deepEqual(
      groups[3]?.topics[6]?.decks.map((deck) => deck.slug),
      [
        "kambaz-courses-store",
        "kambaz-dashboard-crud",
        "kambaz-modules-store",
        "kambaz-account-context",
      ],
    );

    assert.equal(groups[4]?.href, "/book/ch5");
    assert.deepEqual(
      groups[4]?.topics.map((topic) => topic.topicId),
      [
        "http-server",
        "lab5-api",
        "next-routes",
        "ch5-check",
        "kambaz-server",
        "deploy-api",
      ],
    );
    assert.deepEqual(
      groups[4]?.topics.map((topic) => topic.title),
      [
        "5.1 Installing and Configuring an HTTP Web Server",
        "5.2 Lab Exercises",
        "5.3 Next.js Server Routes",
        "Check Your Understanding",
        "5.4 Implementing the Kambaz Node.js HTTP Server",
        "5.5 Deploying to a Public Remote Server",
      ],
    );
    assert.equal(groups[4]?.topics[0]?.bookHref, "/book/ch5#sec-5-1");
    assert.deepEqual(
      groups[4]?.topics[0]?.decks.map((deck) => deck.slug),
      ["http-server", "nodemon-es6-routes"],
    );
    assert.deepEqual(
      groups[4]?.topics[1]?.decks.map((deck) => deck.slug),
      [
        "lab5-env",
        "path-and-query",
        "remote-objects",
        "remote-arrays",
        "async-http",
      ],
    );
    assert.deepEqual(
      groups[4]?.topics[2]?.decks.map((deck) => deck.slug),
      ["next-routes"],
    );
    assert.deepEqual(
      groups[4]?.topics[3]?.decks.map((deck) => deck.slug),
      ["ch5-check-understanding"],
    );
    assert.deepEqual(
      groups[4]?.topics[4]?.decks.map((deck) => deck.slug),
      [
        "kambaz-migrate-db",
        "kambaz-account-rest",
        "kambaz-sessions",
        "kambaz-courses-api",
      ],
    );
    assert.deepEqual(
      groups[4]?.topics[5]?.decks.map((deck) => deck.slug),
      ["deploy-api"],
    );

    assert.equal(groups[5]?.href, "/book/ch6");
    assert.deepEqual(
      groups[5]?.topics.map((topic) => topic.topicId),
      [
        "local-mongo",
        "mongoose",
        "mongo-apis",
        "atlas",
        "ch6-check",
        "kambaz-db",
      ],
    );
    assert.deepEqual(
      groups[5]?.topics.map((topic) => topic.title),
      [
        "6.1 Working with a Local MongoDB Instance",
        "6.2 Programming with a MongoDB Database",
        "6.2.6 Implementing APIs to Interact with MongoDB",
        "6.3 Integrating with MongoDB Hosted in Atlas Cloud Service",
        "Check Your Understanding",
        "6.4 Integrating the Kambaz Web Application with a Database",
      ],
    );
    assert.equal(groups[5]?.topics[0]?.bookHref, "/book/ch6#sec-6-1");
    assert.deepEqual(
      groups[5]?.topics[0]?.decks.map((deck) => deck.slug),
      ["local-mongo"],
    );
    assert.deepEqual(
      groups[5]?.topics[1]?.decks.map((deck) => deck.slug),
      ["mongoose"],
    );
    assert.deepEqual(
      groups[5]?.topics[2]?.decks.map((deck) => deck.slug),
      ["mongo-apis", "mongo-users-crud"],
    );
    assert.deepEqual(
      groups[5]?.topics[3]?.decks.map((deck) => deck.slug),
      ["atlas", "atlas-compass", "atlas-node", "atlas-sessions"],
    );
    assert.deepEqual(
      groups[5]?.topics[4]?.decks.map((deck) => deck.slug),
      ["ch6-check-understanding"],
    );
    assert.deepEqual(
      groups[5]?.topics[5]?.decks.map((deck) => deck.slug),
      [
        "kambaz-courses-db",
        "kambaz-modules-db",
        "kambaz-enrollments-db",
      ],
    );

    assert.equal(groups[6]?.href, "/project");
    assert.equal(groups[6]?.title, "Integrating with External APIs");
    assert.equal(groups[6]?.weeks, "12/7");
    assert.deepEqual(
      groups[6]?.topics.map((topic) => topic.topicId),
      ["youtube-api", "chatgpt-api", "grok-api"],
    );
    assert.deepEqual(
      groups[6]?.topics.map((topic) => topic.title),
      [
        "Integrating with the YouTube Video API",
        "Integrating with the ChatGPT API",
        "Integrating with the Grok API",
      ],
    );
    assert.deepEqual(
      groups[6]?.topics[0]?.decks.map((deck) => deck.slug),
      ["youtube-api", "youtube-search", "youtube-details"],
    );
    assert.deepEqual(
      groups[6]?.topics[1]?.decks.map((deck) => deck.slug),
      ["chatgpt-api", "chatgpt-text", "chatgpt-ui"],
    );
    assert.deepEqual(
      groups[6]?.topics[2]?.decks.map((deck) => deck.slug),
      ["grok-api", "grok-chat", "grok-images"],
    );
    for (const topic of groups[6]?.topics ?? []) {
      assert.equal(topic.bookHref, "/project");
    }

    for (const group of groups) {
      assert.doesNotMatch(group.title, /^Lecture \d+$/);
      for (const topic of group.topics) {
        assert.doesNotMatch(topic.title, /^Lecture \d+$/);
      }
    }
  });

  it("lists Lecture 1 setup decks before HTML on the Ch1 hub", () => {
    const ch1 = listChapterTopicGroups()[0];
    assert.ok(ch1);
    const slugs = ch1.topics.flatMap((topic) => topic.decks.map((deck) => deck.slug));
    const intro = slugs.indexOf("intro-to-web-development");
    const node = slugs.indexOf("installing-nodejs");
    const next = slugs.indexOf("creating-a-nextjs-react-application");
    const github = slugs.indexOf("commit-to-github");
    const vercel = slugs.indexOf("deploying-to-vercel");
    const html = slugs.indexOf("html-and-dom");
    assert.ok(intro >= 0 && node > intro && next > node);
    assert.ok(github > next && vercel > github);
    assert.ok(html > vercel);
    const nav = readFileSync(
      join(process.cwd(), "app/slides/_components/LectureHubNav.tsx"),
      "utf8",
    );
    assert.match(nav, /\/slides#chapter-\$\{chapter\.chapter\}-heading/);
    const page = readFileSync(
      join(process.cwd(), "app/slides/_components/SlidesHub.tsx"),
      "utf8",
    );
    assert.match(page, /Lecture 1 setup first/);
  });

  it("renders Canvas module week dates on hub chapter headers, not L# badges", () => {
    const page = readFileSync(
      join(process.cwd(), "app/slides/_components/SlidesHub.tsx"),
      "utf8",
    );
    assert.match(page, /group\.weeks/);
    assert.match(page, /lectureChapterLabel\(group\.chapter\)/);
    assert.doesNotMatch(page, /Canvas L/);
    const groups = listChapterTopicGroups();
    assert.ok(groups.every((group) => Boolean(group.weeks)));
    assert.ok(
      !groups.some((group) => /midterm|final|\bX1\b|\bX2\b/i.test(group.title)),
    );
  });

  it("derives hub nav chapters from published decks, not a hardcoded Ch1/Ch2 list", () => {
    const chapters = listLectureChapters();
    assert.deepEqual(
      chapters.map((entry) => entry.chapter),
      [1, 2, 3, 4, 5, 6, 7],
    );
    assert.deepEqual(
      chapters.map((entry) => entry.href),
      ["/book/ch1", "/book/ch2", "/book/ch3", "/book/ch4", "/book/ch5", "/book/ch6", "/project"],
    );
    assert.equal(chapters[0]?.title, BOOK_CHAPTERS[0]?.title);
    assert.equal(chapters[1]?.title, BOOK_CHAPTERS[1]?.title);
    assert.equal(chapters[2]?.title, BOOK_CHAPTERS[2]?.title);
    assert.equal(chapters[3]?.title, BOOK_CHAPTERS[3]?.title);
    assert.equal(chapters[4]?.title, BOOK_CHAPTERS[4]?.title);
    assert.equal(chapters[5]?.title, BOOK_CHAPTERS[5]?.title);
    assert.equal(chapters[6]?.title, BOOK_CHAPTERS[6]?.title);
    assert.equal(lectureChapterLabel(1), "Chapter 1");
    assert.equal(lectureChapterLabel(6), "Chapter 6");
    assert.equal(lectureChapterLabel(7), "Project");
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "tailwind"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "kambaz-styling"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "react-icons"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "source-control"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "parameterizing"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "js-data"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "events-state"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "zustand"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "kambaz-state"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "http-server"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "lab5-api"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "next-routes"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "kambaz-server"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "deploy-api"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "local-mongo"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "mongoose"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "mongo-apis"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "atlas"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "kambaz-db"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "youtube-api"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "chatgpt-api"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "grok-api"));
    assert.ok(!LECTURE_TOPICS.some((topic) => topic.topicId === "napster-api"));
  });

  it("keeps Book’s preferred Ch1 bookSectionId anchors", () => {
    const preferred = {
      "intro-to-web-development": "/book/ch1#intro",
      "installing-nodejs": "/book/ch1#sec-1-2-1",
      "creating-a-nextjs-react-application": "/book/ch1#sec-1-2-4",
      "commit-to-github": "/book/ch1#sec-1-5",
      "deploying-to-vercel": "/book/ch1#sec-1-6",
      "html-and-dom": "/book/ch1#sec-1-3",
      "headings-and-paragraphs": "/book/ch1#sec-1-3-1",
      "lists-and-tables": "/book/ch1#sec-1-3-3",
      "web-forms": "/book/ch1#sec-1-3-6",
      anchors: "/book/ch1#sec-1-3-9",
      "single-page-navigation": "/book/ch1#sec-1-3-10",
      "kambaz-overview": "/book/ch1#sec-1-4-1",
      "kambaz-account": "/book/ch1#sec-1-4-2",
      "kambaz-dashboard": "/book/ch1#sec-1-4-3",
      "kambaz-navigation": "/book/ch1#sec-1-4-3-1",
      "kambaz-courses": "/book/ch1#sec-1-4-4",
      "kambaz-modules": "/book/ch1#sec-1-4-5",
      "kambaz-assignments": "/book/ch1#sec-1-4-7",
    } as const;
    for (const [slug, href] of Object.entries(preferred)) {
      const item = getLecture(slug);
      assert.ok(item, slug);
      assert.equal(item.bookHref, href, slug);
      assert.equal(item.bookSectionId, href.split("#")[1], slug);
    }
  });

  it("maps Ch1–Ch3 decks to book section anchors for bidirectional links", () => {
    assert.equal(getLecture("installing-nodejs")?.bookHref, "/book/ch1#sec-1-2-1");
    assert.equal(
      getLecture("creating-a-nextjs-react-application")?.bookHref,
      "/book/ch1#sec-1-2-4",
    );
    assert.equal(getLecture("html-and-dom")?.bookHref, "/book/ch1#sec-1-3");
    assert.equal(getLecture("headings-and-paragraphs")?.bookHref, "/book/ch1#sec-1-3-1");
    assert.equal(getLecture("css-intro")?.bookHref, "/book/ch2#sec-2-1");
    assert.equal(getLecture("react-icons")?.bookHref, "/book/ch2#sec-2-2");
    assert.equal(getLecture("tailwind-spacing")?.bookHref, "/book/ch2#sec-2-3-1");
    assert.equal(getLecture("kambaz-nav-styling")?.bookHref, "/book/ch2#sec-2-4-1");
    assert.equal(getLecture("intro-to-javascript")?.bookHref, "/book/ch3#sec-3-2");
    assert.equal(getLecture("javascript-functions")?.bookHref, "/book/ch3#sec-3-3");
    assert.equal(getLecture("javascript-arrays")?.bookHref, "/book/ch3#sec-3-4");
    assert.equal(getLecture("dynamic-styling")?.bookHref, "/book/ch3#sec-3-5");
    assert.equal(getLecture("client-and-server")?.bookHref, "/book/ch3#sec-3-6");
    assert.equal(getLecture("parameterizing-components")?.bookHref, "/book/ch3#sec-3-7");
    assert.equal(getLecture("kambaz-database")?.bookHref, "/book/ch3#sec-3-9");
    assert.equal(getLecture("kambaz-dashboard-data")?.bookHref, "/book/ch3#sec-3-9-3");
    assert.equal(getLecture("click-events")?.bookHref, "/book/ch4#sec-4-2-1");
    assert.equal(getLecture("usestate-counter")?.bookHref, "/book/ch4#sec-4-2-4");
    assert.equal(getLecture("sharing-parent-child")?.bookHref, "/book/ch4#sec-4-3-1");
    assert.equal(getLecture("react-context")?.bookHref, "/book/ch4#sec-4-4");
    assert.equal(getLecture("zustand-counter")?.bookHref, "/book/ch4#sec-4-5-1");
    assert.equal(getLecture("zustand-todos")?.bookHref, "/book/ch4#sec-4-5-2");
    assert.equal(getLecture("use-effect")?.bookHref, "/book/ch4#sec-4-7");
    assert.equal(getLecture("ch4-check-understanding")?.bookHref, "/book/ch4#sec-4-9");
    assert.equal(getLecture("kambaz-courses-store")?.bookHref, "/book/ch4#sec-4-10-1");
    assert.equal(getLecture("kambaz-dashboard-crud")?.bookHref, "/book/ch4#sec-4-10-2");
    assert.equal(getLecture("kambaz-modules-store")?.bookHref, "/book/ch4#sec-4-10-4");
    assert.equal(getLecture("kambaz-account-context")?.bookHref, "/book/ch4#sec-4-10-5");
    assert.equal(getLecture("http-server")?.bookHref, "/book/ch5#sec-5-1");
    assert.equal(getLecture("nodemon-es6-routes")?.bookHref, "/book/ch5#sec-5-1-6");
    assert.equal(getLecture("lab5-env")?.bookHref, "/book/ch5#sec-5-2-1");
    assert.equal(getLecture("path-and-query")?.bookHref, "/book/ch5#sec-5-2-2");
    assert.equal(getLecture("remote-objects")?.bookHref, "/book/ch5#sec-5-2-3");
    assert.equal(getLecture("remote-arrays")?.bookHref, "/book/ch5#sec-5-2-4");
    assert.equal(getLecture("async-http")?.bookHref, "/book/ch5#sec-5-2-5");
    assert.equal(getLecture("next-routes")?.bookHref, "/book/ch5#sec-5-3");
    assert.equal(getLecture("ch5-check-understanding")?.bookHref, "/book/ch5#sec-5-check");
    assert.equal(getLecture("kambaz-migrate-db")?.bookHref, "/book/ch5#sec-5-4-1");
    assert.equal(getLecture("kambaz-account-rest")?.bookHref, "/book/ch5#sec-5-4-2");
    assert.equal(getLecture("kambaz-sessions")?.bookHref, "/book/ch5#sec-5-4-3");
    assert.equal(getLecture("kambaz-courses-api")?.bookHref, "/book/ch5#sec-5-4-5");
    assert.equal(getLecture("deploy-api")?.bookHref, "/book/ch5#sec-5-5");
    assert.equal(getLecture("local-mongo")?.bookHref, "/book/ch6#sec-6-1");
    assert.equal(getLecture("mongoose")?.bookHref, "/book/ch6#sec-6-2");
    assert.equal(getLecture("mongo-apis")?.bookHref, "/book/ch6#sec-6-2-6");
    assert.equal(getLecture("mongo-users-crud")?.bookHref, "/book/ch6#sec-6-2-6-3");
    assert.equal(getLecture("atlas")?.bookHref, "/book/ch6#sec-6-3");
    assert.equal(getLecture("atlas-compass")?.bookHref, "/book/ch6#sec-6-3-1-1");
    assert.equal(getLecture("atlas-node")?.bookHref, "/book/ch6#sec-6-3-1-2");
    assert.equal(getLecture("atlas-sessions")?.bookHref, "/book/ch6#sec-6-3-2");
    assert.equal(getLecture("ch6-check-understanding")?.bookHref, "/book/ch6#sec-6-check");
    assert.equal(getLecture("kambaz-courses-db")?.bookHref, "/book/ch6#sec-6-4-1");
    assert.equal(getLecture("kambaz-modules-db")?.bookHref, "/book/ch6#sec-6-4-2");
    assert.equal(getLecture("kambaz-enrollments-db")?.bookHref, "/book/ch6#sec-6-4-3");
    assert.equal(getLecture("youtube-api")?.bookHref, "/project");
    assert.equal(getLecture("chatgpt-api")?.bookHref, "/project");
    assert.equal(getLecture("grok-api")?.bookHref, "/project");
    assert.equal(getLecture("youtube-api")?.bookSectionId, undefined);
    assert.equal(getLecture("youtube-api")?.chapter, 7);
    assert.equal(getLecture("youtube-api")?.canvasLecture, 25);
    for (const slug of PROJECT_SLUGS) {
      const item = getLecture(slug);
      assert.equal(item?.bookSectionId, undefined);
      assert.equal(item?.bookHref, "/project");
      assert.equal(item?.chapter, 7);
      assert.doesNotMatch(item?.bookHref ?? "", /\/book\/ch/);
    }
    for (const topic of LECTURE_TOPICS.filter((entry) => entry.chapter === 7)) {
      assert.equal(topic.bookSectionId, undefined);
    }
    assert.equal(bookHrefForSection(7), "/project");
    assert.equal(bookHrefForSection(7, "sec-7-1"), "/project");
    assert.equal(lectureCompanionLinkLabel(7), "Open the project");
    assert.equal(
      lectureCompanionLinkLabel(3, "sec-3-2"),
      "§3.2 in the book",
    );
    const deckPage = readFileSync(
      join(process.cwd(), "app/slides/_components/LectureDeckApp.tsx"),
      "utf8",
    );
    assert.match(deckPage, /lectureCompanionLinkLabel/);
    assert.doesNotMatch(deckPage, /Open in the book/);
    const chapterLink = readFileSync(
      join(process.cwd(), "app/slides/_components/LectureChapterLink.tsx"),
      "utf8",
    );
    assert.match(chapterLink, /Open the project page/);
    assert.match(chapterLink, /chapter > 6 \? "Project"/);
    assert.equal(listDecksForBookSection("sec-3-2")[0]?.slug, "intro-to-javascript");
    assert.equal(listDecksForBookSection("sec-4-5-1")[0]?.slug, "zustand-counter");
    assert.equal(listDecksForBookSection("sec-5-1")[0]?.slug, "http-server");
    assert.equal(listDecksForBookSection("sec-5-3")[0]?.slug, "next-routes");
    assert.equal(listDecksForBookSection("sec-5-5")[0]?.slug, "deploy-api");
    assert.equal(listDecksForBookSection("sec-6-1")[0]?.slug, "local-mongo");
    assert.equal(listDecksForBookSection("sec-6-2")[0]?.slug, "mongoose");
    assert.equal(listDecksForBookSection("sec-6-3")[0]?.slug, "atlas");
    assert.equal(listDecksForBookSection("sec-6-3-1-1")[0]?.slug, "atlas-compass");
    assert.equal(listDecksForBookSection("sec-6-3-1-2")[0]?.slug, "atlas-node");
    assert.equal(listDecksForBookSection("sec-6-3-2")[0]?.slug, "atlas-sessions");
    assert.equal(listDecksForBookSection("sec-6-4-1")[0]?.slug, "kambaz-courses-db");
    assert.equal(listDecksForBookSection("sec-1-2-1")[0]?.slug, "installing-nodejs");
    assert.equal(listDecksForBookSection("sec-2-3")[0]?.slug, "tailwind-intro");
    assert.equal(listDecksForBookSection("sec-2-2")[0]?.slug, "react-icons");
    assert.equal(getLecture("css-rotation")?.bookSectionId, undefined);
    assert.equal(getLecture("css-rotation")?.bookHref, "/book/ch2");
    for (const item of listLectures()) {
      if (item.bookSectionId) {
        assert.match(item.bookHref, /^\/book\/ch\d#/);
      }
    }
  });

  it("keeps canvasLecture metadata grouped for Canvas sync", () => {
    const groups = listCanvasLectureGroups();
    assert.ok(groups.length >= 11);
    assert.equal(groups[0]?.title, "Lecture 1");
    assert.equal(groups[0]?.canvasLecture, 1);
    assert.equal(groups[0]?.decks.length, 5);
    assert.deepEqual(
      groups[0]?.decks.map((deck) => deck.slug),
      [...LECTURE_1_SLUGS],
    );
    assert.equal(groups[1]?.title, "Lecture 2");
    assert.equal(groups[1]?.canvasLecture, 2);
    assert.equal(groups[1]?.decks.length, 6);
    assert.deepEqual(
      groups[1]?.decks.map((deck) => deck.slug),
      [...LECTURE_2_SLUGS],
    );
    assert.equal(
      lectureDeckThumbnail(groups[0]!.decks[0]!),
      "/lectures/thumbs/intro-to-web-development.svg",
    );
    assert.equal(
      lectureDeckThumbnail("commit-to-github"),
      "/lectures/thumbs/commit-to-github.svg",
    );
    assert.equal(
      lectureDeckThumbnail("html-and-dom"),
      "/lectures/thumbs/html-and-dom.svg",
    );
    for (const slug of LECTURE_SLUGS) {
      const thumb = lectureDeckThumbnail(slug);
      assert.notEqual(thumb, lectureSlideAssetPath(slug, 1));
      assert.equal(thumb, lectureThumbPath(slug));
      assert.doesNotMatch(thumb, /slide-\d\d/);
      const disk = join(process.cwd(), thumb.replace(/^\//, "public/"));
      assert.ok(existsSync(disk), `${thumb} is missing on disk`);
      const xml = readFileSync(disk, "utf8");
      assert.match(xml, /^<\?xml /);
      assert.doesNotMatch(
        xml,
        /<text\b[^>]*>[^<]*<(?![/])/,
        `${thumb} has unescaped < in a text node`,
      );
      assert.doesNotMatch(xml, /Canvas L\d/);
    }
    assert.equal(groups[2]?.title, "Lecture 3");
    assert.equal(groups[2]?.canvasLecture, 3);
    assert.equal(groups[2]?.decks.length, 7);
    assert.deepEqual(
      groups[2]?.decks.map((deck) => deck.slug),
      [...LECTURE_3_SLUGS],
    );
    assert.equal(
      lectureDeckThumbnail("kambaz-overview"),
      "/lectures/thumbs/kambaz-overview.svg",
    );
    assert.equal(groups[3]?.title, "Lecture 4");
    assert.equal(groups[3]?.canvasLecture, 4);
    assert.equal(groups[3]?.decks.length, 8);
    assert.deepEqual(
      groups[3]?.decks.map((deck) => deck.slug),
      [...LECTURE_4_SLUGS],
    );
    assert.equal(
      lectureDeckThumbnail("css-intro"),
      "/lectures/thumbs/css-intro.svg",
    );
    assert.equal(groups[4]?.title, "Lecture 5");
    assert.equal(groups[4]?.canvasLecture, 5);
    assert.equal(groups[4]?.decks.length, 0);
    assert.equal(groups[5]?.title, "Lecture 6");
    assert.equal(groups[5]?.canvasLecture, 6);
    assert.equal(groups[5]?.decks.length, 7);
    assert.deepEqual(
      groups[5]?.decks.map((deck) => deck.slug),
      [...LECTURE_6_SLUGS],
    );
    assert.equal(groups[6]?.title, "Lecture 7");
    assert.equal(groups[6]?.canvasLecture, 7);
    assert.equal(groups[6]?.decks.length, 6);
    assert.deepEqual(
      groups[6]?.decks.map((deck) => deck.slug),
      [...LECTURE_7_SLUGS],
    );
    assert.equal(
      lectureDeckThumbnail("react-icons"),
      "/lectures/thumbs/react-icons.svg",
    );
    assert.equal(groups[7]?.title, "Lecture 8");
    assert.equal(groups[7]?.canvasLecture, 8);
    assert.equal(groups[7]?.decks.length, 17);
    assert.deepEqual(
      groups[7]?.decks.map((deck) => deck.slug),
      CHAPTER_3_SLUGS.filter((slug) => getLecture(slug)?.canvasLecture === 8),
    );
    assert.equal(groups[8]?.title, "Lecture 9");
    assert.equal(groups[8]?.canvasLecture, 9);
    assert.equal(groups[8]?.decks.length, 5);
    assert.deepEqual(
      groups[8]?.decks.map((deck) => deck.slug),
      [
        "kambaz-database",
        "kambaz-dashboard-data",
        "kambaz-courses-data",
        "kambaz-modules-data",
        "kambaz-assignments-data",
      ],
    );
    assert.equal(
      lectureDeckThumbnail("intro-to-javascript"),
      "/lectures/thumbs/intro-to-javascript.svg",
    );
    assert.equal(groups[9]?.title, "Lecture 10");
    assert.equal(groups[9]?.canvasLecture, 10);
    assert.equal(groups[9]?.decks.length, 4);
    assert.deepEqual(
      groups[9]?.decks.map((deck) => deck.slug),
      CHAPTER_4_SLUGS.filter((slug) => getLecture(slug)?.canvasLecture === 10),
    );
    assert.equal(groups[10]?.title, "Lecture 11");
    assert.equal(groups[10]?.canvasLecture, 11);
    assert.equal(groups[10]?.decks.length, 3);
    assert.equal(groups[11]?.title, "Lecture 12");
    assert.equal(groups[11]?.canvasLecture, 12);
    assert.deepEqual(
      groups[11]?.decks.map((deck) => deck.slug),
      ["zustand-counter", "zustand-todos"],
    );
    assert.equal(groups[12]?.title, "Lecture 13");
    assert.equal(groups[12]?.canvasLecture, 13);
    assert.deepEqual(
      groups[12]?.decks.map((deck) => deck.slug),
      ["use-effect", "ch4-check-understanding"],
    );
    assert.equal(groups[13]?.title, "Lecture 14");
    assert.equal(groups[13]?.canvasLecture, 14);
    assert.deepEqual(
      groups[13]?.decks.map((deck) => deck.slug),
      ["kambaz-courses-store", "kambaz-dashboard-crud"],
    );
    assert.equal(groups[14]?.title, "Lecture 15");
    assert.equal(groups[14]?.canvasLecture, 15);
    assert.deepEqual(
      groups[14]?.decks.map((deck) => deck.slug),
      ["kambaz-modules-store", "kambaz-account-context"],
    );
    assert.equal(
      lectureDeckThumbnail("click-events"),
      "/lectures/thumbs/click-events.svg",
    );
    assert.equal(groups[15]?.title, "Lecture 16");
    assert.equal(groups[15]?.canvasLecture, 16);
    assert.deepEqual(
      groups[15]?.decks.map((deck) => deck.slug),
      ["http-server", "nodemon-es6-routes"],
    );
    assert.equal(groups[16]?.title, "Lecture 17");
    assert.deepEqual(
      groups[16]?.decks.map((deck) => deck.slug),
      ["lab5-env", "path-and-query", "remote-objects"],
    );
    assert.equal(groups[17]?.title, "Lecture 18");
    assert.deepEqual(
      groups[17]?.decks.map((deck) => deck.slug),
      [
        "remote-arrays",
        "async-http",
        "next-routes",
        "ch5-check-understanding",
      ],
    );
    assert.equal(groups[18]?.title, "Lecture 19");
    assert.deepEqual(
      groups[18]?.decks.map((deck) => deck.slug),
      [
        "kambaz-migrate-db",
        "kambaz-account-rest",
        "kambaz-sessions",
        "kambaz-courses-api",
      ],
    );
    assert.equal(groups[19]?.title, "Lecture 20");
    assert.deepEqual(
      groups[19]?.decks.map((deck) => deck.slug),
      ["deploy-api"],
    );
    assert.equal(
      lectureDeckThumbnail("http-server"),
      "/lectures/thumbs/http-server.svg",
    );
    assert.equal(groups[20]?.title, "Lecture 21");
    assert.deepEqual(
      groups[20]?.decks.map((deck) => deck.slug),
      ["local-mongo"],
    );
    assert.equal(groups[21]?.title, "Lecture 22");
    assert.deepEqual(
      groups[21]?.decks.map((deck) => deck.slug),
      ["mongoose", "mongo-apis", "mongo-users-crud"],
    );
    assert.equal(groups[22]?.title, "Lecture 23");
    assert.deepEqual(
      groups[22]?.decks.map((deck) => deck.slug),
      [
        "atlas",
        "atlas-compass",
        "atlas-node",
        "atlas-sessions",
        "ch6-check-understanding",
      ],
    );
    assert.equal(groups[23]?.title, "Lecture 24");
    assert.deepEqual(
      groups[23]?.decks.map((deck) => deck.slug),
      [
        "kambaz-courses-db",
        "kambaz-modules-db",
        "kambaz-enrollments-db",
      ],
    );
    assert.equal(
      lectureDeckThumbnail("local-mongo"),
      "/lectures/thumbs/local-mongo.svg",
    );
    assert.equal(groups[24]?.title, "Lecture 25");
    assert.deepEqual(
      groups[24]?.decks.map((deck) => deck.slug),
      [...PROJECT_SLUGS],
    );
    for (const group of groups.slice(25)) {
      assert.equal(group.title, `Lecture ${group.canvasLecture}`);
      assert.equal(group.decks.length, 0);
    }
  });

  it("walks adjacent decks across Chapter 1 into Chapter 3", () => {
    const first = adjacentLectureSlugs("intro-to-web-development");
    assert.equal(first.prev, undefined);
    assert.equal(first.next?.slug, "installing-nodejs");
    const lastLecture1 = adjacentLectureSlugs("deploying-to-vercel");
    assert.equal(lastLecture1.next?.slug, "html-and-dom");
    assert.equal(lastLecture1.prev?.slug, "commit-to-github");
    const lastLecture2 = adjacentLectureSlugs("single-page-navigation");
    assert.equal(lastLecture2.next?.slug, "kambaz-overview");
    assert.equal(lastLecture2.prev?.slug, "anchors");
    const lastLecture3 = adjacentLectureSlugs("kambaz-assignments");
    assert.equal(lastLecture3.next?.slug, "css-intro");
    assert.equal(lastLecture3.prev?.slug, "kambaz-modules");
    const lastLecture4 = adjacentLectureSlugs("css-rotation");
    assert.equal(lastLecture4.next?.slug, "react-icons");
    assert.equal(lastLecture4.prev?.slug, "css-media-queries");
    const lastLecture6 = adjacentLectureSlugs("tailwind-filters-and-grid");
    assert.equal(lastLecture6.next?.slug, "kambaz-styling");
    const lastCh2 = adjacentLectureSlugs("kambaz-account-styling");
    assert.equal(lastCh2.next?.slug, "intro-to-javascript");
    assert.equal(lastCh2.prev?.slug, "kambaz-assignments-styling");
    const afterFns = adjacentLectureSlugs("javascript-functions");
    assert.equal(afterFns.next?.slug, "javascript-arrays");
    assert.equal(afterFns.prev?.slug, "null-and-undefined");
    const lastCh3 = adjacentLectureSlugs("kambaz-assignments-data");
    assert.equal(lastCh3.next?.slug, "click-events");
    assert.equal(lastCh3.prev?.slug, "kambaz-modules-data");
    const afterZustand = adjacentLectureSlugs("zustand-todos");
    assert.equal(afterZustand.next?.slug, "use-effect");
    assert.equal(afterZustand.prev?.slug, "zustand-counter");
    const lastCh4 = adjacentLectureSlugs("kambaz-account-context");
    assert.equal(lastCh4.next?.slug, "http-server");
    assert.equal(lastCh4.prev?.slug, "kambaz-modules-store");
    const afterHttp = adjacentLectureSlugs("http-server");
    assert.equal(afterHttp.next?.slug, "nodemon-es6-routes");
    assert.equal(afterHttp.prev?.slug, "kambaz-account-context");
    const lastCh5 = adjacentLectureSlugs("deploy-api");
    assert.equal(lastCh5.next?.slug, "local-mongo");
    assert.equal(lastCh5.prev?.slug, "kambaz-courses-api");
    const afterLocal = adjacentLectureSlugs("local-mongo");
    assert.equal(afterLocal.next?.slug, "mongoose");
    assert.equal(afterLocal.prev?.slug, "deploy-api");
    const last = adjacentLectureSlugs("kambaz-enrollments-db");
    assert.equal(last.next?.slug, "youtube-api");
    assert.equal(last.prev?.slug, "kambaz-modules-db");
    const lastProject = adjacentLectureSlugs("grok-images");
    assert.equal(lastProject.next, undefined);
    assert.equal(lastProject.prev?.slug, "grok-chat");
  });
});

describe("lecture decks", () => {
  it("exports typed slides at the expected lengths", () => {
    const decks = listLectureDecks();
    const counts = Object.fromEntries(
      decks.map((deck) => [deck.slug, deck.slides.length]),
    );
    assert.equal(counts["intro-to-web-development"], 16);
    assert.ok((counts["installing-nodejs"] ?? 0) >= 16);
    assert.equal(counts["creating-a-nextjs-react-application"], 17);
    assert.equal(counts["commit-to-github"], 7);
    assert.equal(counts["deploying-to-vercel"], 13);
    assert.equal(counts["html-and-dom"], 16);
    assert.equal(counts["headings-and-paragraphs"], 9);
    assert.equal(counts["lists-and-tables"], 13);
    assert.equal(counts["web-forms"], 21);
    assert.equal(counts["anchors"], 5);
    assert.equal(counts["single-page-navigation"], 14);
    assert.equal(counts["kambaz-overview"], 8);
    assert.equal(counts["kambaz-account"], 15);
    assert.equal(counts["kambaz-dashboard"], 8);
    assert.equal(counts["kambaz-navigation"], 8);
    assert.equal(counts["kambaz-courses"], 8);
    assert.equal(counts["kambaz-modules"], 12);
    assert.equal(counts["kambaz-assignments"], 12);
    assert.equal(counts["css-intro"], 22);
    assert.equal(counts["css-colors"], 10);
    assert.equal(counts["css-box-model"], 18);
    assert.equal(counts["css-size-and-position"], 22);
    assert.equal(counts["css-media-queries"], 8);
    assert.equal(counts["css-float"], 9);
    assert.equal(counts["css-flex"], 12);
    assert.equal(counts["css-rotation"], 6);
    assert.equal(counts["react-icons"], 9);
    assert.equal(counts["tailwind-intro"], 9);
    assert.equal(counts["tailwind-spacing"], 7);
    assert.equal(counts["tailwind-typography"], 6);
    assert.equal(counts["tailwind-colors"], 5);
    assert.equal(counts["tailwind-filters-and-grid"], 13);
    assert.equal(counts["tailwind-responsive"], 7);
    assert.equal(counts["kambaz-styling"], 8);
    assert.equal(counts["kambaz-nav-styling"], 7);
    assert.equal(counts["kambaz-dashboard-styling"], 7);
    assert.equal(counts["kambaz-courses-styling"], 14);
    assert.equal(counts["kambaz-assignments-styling"], 9);
    assert.equal(counts["kambaz-account-styling"], 8);
    assert.equal(counts["intro-to-javascript"], 8);
    assert.equal(counts["variables-and-constants"], 7);
    assert.equal(counts["variable-types"], 6);
    assert.equal(counts["booleans-and-conditionals"], 8);
    assert.equal(counts["null-and-undefined"], 6);
    assert.equal(counts["javascript-functions"], 8);
    assert.equal(counts["javascript-arrays"], 7);
    assert.equal(counts["array-iteration"], 7);
    assert.equal(counts["array-search"], 8);
    assert.equal(counts["reduce-and-json"], 6);
    assert.equal(counts["javascript-objects"], 6);
    assert.equal(counts["spread-and-destructuring"], 8);
    assert.equal(counts["optional-chaining"], 5);
    assert.equal(counts["dynamic-styling"], 7);
    assert.equal(counts["client-and-server"], 7);
    assert.equal(counts["parameterizing-components"], 7);
    assert.equal(counts["path-params-and-todos"], 9);
    assert.equal(counts["kambaz-database"], 8);
    assert.equal(counts["kambaz-dashboard-data"], 6);
    assert.equal(counts["kambaz-courses-data"], 7);
    assert.equal(counts["kambaz-modules-data"], 6);
    assert.equal(counts["kambaz-assignments-data"], 7);
    assert.equal(counts["click-events"], 7);
    assert.equal(counts["passing-data-and-functions"], 8);
    assert.equal(counts["usestate-counter"], 7);
    assert.equal(counts["form-state-types"], 9);
    assert.equal(counts["sharing-parent-child"], 6);
    assert.equal(counts["prop-drilling-and-url"], 8);
    assert.equal(counts["react-context"], 7);
    assert.equal(counts["zustand-counter"], 6);
    assert.equal(counts["zustand-todos"], 7);
    assert.equal(counts["use-effect"], 7);
    assert.equal(counts["ch4-check-understanding"], 7);
    assert.equal(counts["kambaz-courses-store"], 8);
    assert.equal(counts["kambaz-dashboard-crud"], 8);
    assert.equal(counts["kambaz-modules-store"], 7);
    assert.equal(counts["kambaz-account-context"], 7);
    assert.equal(counts["http-server"], 10);
    assert.equal(counts["nodemon-es6-routes"], 8);
    assert.equal(counts["lab5-env"], 10);
    assert.equal(counts["path-and-query"], 9);
    assert.equal(counts["remote-objects"], 8);
    assert.equal(counts["remote-arrays"], 8);
    assert.equal(counts["async-http"], 9);
    assert.equal(counts["next-routes"], 7);
    assert.equal(counts["ch5-check-understanding"], 7);
    assert.equal(counts["kambaz-migrate-db"], 6);
    assert.equal(counts["kambaz-account-rest"], 9);
    assert.equal(counts["kambaz-sessions"], 8);
    assert.equal(counts["kambaz-courses-api"], 9);
    assert.equal(counts["deploy-api"], 8);
    assert.equal(counts["local-mongo"], 12);
    assert.equal(counts["mongoose"], 11);
    assert.equal(counts["mongo-apis"], 11);
    assert.equal(counts["mongo-users-crud"], 11);
    assert.equal(counts["atlas"], 9);
    assert.equal(counts["atlas-compass"], 9);
    assert.equal(counts["atlas-node"], 10);
    assert.equal(counts["atlas-sessions"], 12);
    assert.equal(counts["ch6-check-understanding"], 7);
    assert.equal(counts["kambaz-courses-db"], 10);
    assert.equal(counts["kambaz-modules-db"], 9);
    assert.equal(counts["kambaz-enrollments-db"], 10);
    assert.equal(counts["youtube-api"], 11);
    assert.equal(counts["youtube-search"], 11);
    assert.equal(counts["youtube-details"], 23);
    assert.equal(counts["chatgpt-api"], 14);
    assert.equal(counts["chatgpt-text"], 22);
    assert.equal(counts["chatgpt-ui"], 21);
    assert.equal(counts["grok-api"], 18);
    assert.equal(counts["grok-chat"], 17);
    assert.equal(counts["grok-images"], 16);
    for (const deck of decks) {
      const ids = deck.slides.map((slide) => slide.id);
      assert.equal(new Set(ids).size, ids.length, `${deck.slug} duplicate slide id`);
      for (const slide of deck.slides) {
        assert.ok(slide.id);
        assert.ok(slide.title);
        assert.ok(
          slide.title.length <= LECTURE_TITLE_MAX_CHARS,
          `${deck.slug} ${slide.id} title is ${slide.title.length} chars: ${slide.title}`,
        );
      }
    }
  });

  it("keeps spacious bullets ~50% larger than the crushed post-#31 sizes", () => {
    const css = readFileSync(join(process.cwd(), "app/book/book.css"), "utf8");
    assert.match(css, /\.lecture-slide-title\s*\{[^}]*white-space:\s*nowrap/);
    assert.match(css, /max\(0\.95rem,\s*calc\(100cqi \/ 24\)\)/);
    assert.match(
      css,
      /\.lecture-slide-spacious \.lecture-slide-bullets \{[^}]*font-size:\s*calc\(2\.25rem/,
    );
    assert.match(css, /font-size:\s*calc\(2\.75rem/);
    assert.match(css, /font-size:\s*calc\(3\.15rem/);
    assert.match(
      css,
      /\.lecture-slide-dense \.lecture-slide-bullets \{[^}]*font-size:\s*calc\(1\.7rem/,
    );
    assert.doesNotMatch(
      css,
      /\.lecture-slide-spacious \.lecture-slide-bullets \{[^}]*font-size:\s*1\.5rem/,
    );
    assert.match(css, /--lecture-block-font-scale:\s*1/);
    assert.match(css, /\[data-demo-stage="true"\] \.lecture-demo-frame-body/);
    assert.match(css, /font-size:\s*1\.3em/);
    assert.doesNotMatch(
      css,
      /\.lecture-block-font-md \.lecture-slide-bullets \{[^}]*font-size:\s*1em/,
    );
    assert.doesNotMatch(
      css,
      /\.lecture-block-font-sm \.lecture-slide-bullets \{[^}]*font-size:\s*0\.75em/,
    );
  });

  it("keeps lecture code and live embeds full-slide-width with ~25% larger type", () => {
    const css = readFileSync(join(process.cwd(), "app/book/book.css"), "utf8");
    assert.match(
      css,
      /\.lecture-slide \.book-code-block-body \{[^}]*font-size:\s*calc\(1\.5625rem/,
    );
    assert.match(css, /font-size:\s*calc\(1\.875rem/);
    assert.doesNotMatch(
      css,
      /\.lecture-slide \.book-code-block-body \{[^}]*font-size:\s*calc\(1\.25rem/,
    );
    assert.match(
      css,
      /\.lecture-slide figure \{[^}]*margin-inline:\s*0/,
    );
    assert.match(
      css,
      /\.lecture-slide \.lecture-demo-frame \{[^}]*max-width:\s*100%/,
    );
    assert.match(
      css,
      /\.lecture-block-size-lg \{[^}]*max-width:\s*100%/,
    );
    const blocks = readFileSync(
      join(process.cwd(), "app/slides/_components/SlideBlocks.tsx"),
      "utf8",
    );
    assert.match(blocks, /blockFrameClass/);
    assert.doesNotMatch(blocks, /lecture-block-size-md"/);
  });

  it("lets live-demo frames grow instead of clipping on a max height", () => {
    const css = readFileSync(join(process.cwd(), "app/book/book.css"), "utf8");
    assert.match(
      css,
      /\.lecture-slide \.lecture-demo-frame-body \{[^}]*display:\s*flow-root/,
    );
    assert.match(
      css,
      /\.lecture-slide \.lecture-demo-frame-body > \* \{[^}]*max-height:\s*none/,
    );
    const embedDir = join(process.cwd(), "app/slides/_components/embeds");
    for (const name of readdirSync(embedDir)) {
      if (!name.endsWith(".tsx")) continue;
      const source = readFileSync(join(embedDir, name), "utf8");
      assert.doesNotMatch(
        source,
        /max-h-\d+/,
        `${name} caps a live demo and clips content`,
      );
    }

    const deck = getLectureDeck("css-box-model");
    assert.ok(deck);
    const margins = deck.slides[MARGINS_LIVE_CLIP_BEFORE.slide - 1];
    assert.equal(margins?.id, MARGINS_LIVE_CLIP_BEFORE.id);
    assert.equal(margins?.embed, MARGINS_LIVE_CLIP_BEFORE.embed);
    const embeds = readFileSync(
      join(embedDir, "CssLabEmbeds.tsx"),
      "utf8",
    );
    assert.match(embeds, /function CssMarginsEmbed\(\)[\s\S]*<Margins \/>/);
    assert.doesNotMatch(embeds, /function CssMarginsEmbed\(\)[\s\S]*max-h-/);

    // Known positive: the pre-fix Live Margins.tsx frame. If this stays
    // quiet, the clip check is not actually looking for a scroller or a
    // box past the frame.
    assert.equal(demoFrameClips(MARGINS_LIVE_CLIP_BEFORE), true);
    assert.equal(
      demoFrameClips({
        scrolls: [
          {
            scrollHeight: 590,
            clientHeight: 590,
            scrollWidth: 1178,
            clientWidth: 1178,
            overflowX: "visible",
            overflowY: "visible",
          },
        ],
        boxes: [{ top: -4, right: -8, bottom: -30, left: -8 }],
      }),
      false,
    );
  });

  it("gives every lecture code block a one-click Copy overlay", () => {
    const codeBlock = readFileSync(
      join(process.cwd(), "app/slides/_components/LectureCodeBlock.tsx"),
      "utf8",
    );
    assert.match(codeBlock, /CopyButton/);
    assert.match(codeBlock, /variant="lecture"/);
    const copyButton = readFileSync(
      join(process.cwd(), "app/book/components/CopyButton.tsx"),
      "utf8",
    );
    assert.match(copyButton, /navigator\.clipboard/);
    assert.match(copyButton, /execCommand\("copy"\)/);
    assert.match(copyButton, /stopPropagation/);
    assert.match(copyButton, /variant === "lecture"/);
    const shell = readFileSync(
      join(process.cwd(), "app/slides/_components/LectureDeckShell.tsx"),
      "utf8",
    );
    assert.match(shell, /tagName === "BUTTON"/);
    assert.match(shell, /swipeTargetIsInteractive\(event\.target\)/);
    const css = readFileSync(join(process.cwd(), "app/book/book.css"), "utf8");
    assert.match(css, /\.lecture-code-copy\s*\{/);
    assert.match(css, /\.lecture-code-copy\s*\{[^}]*position:\s*absolute/);
    assert.match(
      css,
      /\.lecture-slide \.book-code-block-body \{[^}]*font-size:\s*calc\(1\.5625rem/,
    );
    assert.doesNotMatch(
      css,
      /\.lecture-code-copy\s*\{[^}]*font-size:\s*calc\(1\.5625rem/,
    );
  });

  it("leaves Chapter 1 authored bullets on the CSS default (no sm/md fontSize)", () => {
    for (const deck of listLectureDecks()) {
      if (deck.chapter !== 1) continue;
      for (const slide of toBlockSlides(deck.slides)) {
        for (const block of slide.blocks) {
          if (block.type === "bullets" || block.type === "code") {
            assert.equal(
              block.fontSize,
              undefined,
              `${deck.slug} ${slide.id} ${block.id} should omit fontSize`,
            );
          }
        }
      }
    }
  });

  it("sizes text-only slides spacious and diagram/embed slides dense", () => {
    const textOnly = findSlide("intro-to-web-development", "internet");
    const diagram = findSlide("intro-to-web-development", "client-server");
    const embed = findSlide("creating-a-nextjs-react-application", "welcome-page");
    const htmlText = findSlide("html-and-dom", "html-means");
    const htmlDiagram = findSlide("html-and-dom", "the-dom");
    const htmlEmbed = findSlide("headings-and-paragraphs", "lab1-nest");
    assert.equal(lectureSlideDensity(textOnly), "spacious");
    assert.equal(lectureSlideDensity(diagram), "dense");
    assert.equal(lectureSlideDensity(embed), "dense");
    assert.equal(lectureSlideDensity(htmlText), "spacious");
    assert.equal(lectureSlideDensity(htmlDiagram), "dense");
    assert.equal(lectureSlideDensity(htmlEmbed), "dense");
    assert.equal(
      lectureSlideDensity({ id: "forced", title: "Forced", density: "dense" }),
      "dense",
    );
  });

  it("teaches App Router only in the Next.js deck", () => {
    const text = slideText("creating-a-nextjs-react-application");
    assert.match(text, /App Router/);
    assert.match(text, /Welcome to Web Dev/);
    assert.match(text, /labs\/lab1/);
    assert.match(text, /globals\.css/);
    assert.match(text, /next\/link/);
    assert.doesNotMatch(text, /npm create vite/i);
    assert.doesNotMatch(text, /create-vite/);
    assert.doesNotMatch(text, /vite\.config/i);
    assert.doesNotMatch(text, /Vite SPA leftover/i);
    assert.doesNotMatch(text, /No Vite SPA setup/i);
  });

  it("drops Vite SPA leftover phrasing from authored decks", () => {
    for (const deck of listLectureDecks()) {
      const text = slideText(deck.slug);
      assert.doesNotMatch(text, /Vite SPA leftover/i);
      assert.doesNotMatch(text, /No Vite SPA setup/i);
      assert.doesNotMatch(text, /Vite-only SPA/i);
    }
    const creating = getLecture("creating-a-nextjs-react-application");
    assert.ok(creating);
    assert.doesNotMatch(creating.summary, /Vite SPA leftover/i);
    const nextUp = findSlide("installing-nodejs", "next-up");
    assert.match(nextUp.title, /Next: create the Next\.js app/);
    assert.ok(!authoredSlideBullets(nextUp).some((row) => /vite/i.test(row)));
  });

  it("embeds live Ch1 demos instead of UI screenshots", () => {
    const expected = {
      "user-component": "user-card",
      "welcome-page": "welcome-home",
      "lab1-route": "lab1-stub",
      "link-to-lab1": "link-nav",
      "user-on-page": "user-card",
    } as const;
    for (const [id, embed] of Object.entries(expected)) {
      const slide = findSlide("creating-a-nextjs-react-application", id);
      assert.equal(slide.embed, embed);
      assert.equal(slide.imageSrc, undefined);
      assert.ok((LECTURE_EMBED_IDS as readonly string[]).includes(embed));
    }
  });

  it("embeds Lab 1 HTML previews on Lecture 2 decks", () => {
    const expected = {
      "html-and-dom": { "hello-html": "html-skeleton", "jsx-lab1": "lab1-stub" },
      "headings-and-paragraphs": {
        "heading-scale": "heading-scale",
        "lab1-nest": "heading-tags",
        "wrap-p": "paragraph-tag",
      },
      "lists-and-tables": {
        "pancakes-after": "list-tags",
        "books-ul": "list-tags",
        "quiz-table": "tables",
      },
      "web-forms": {
        "text-fields-demo": "text-fields",
        textarea: "textarea",
        buttons: "buttons",
        "onclick-alert": "alert-button",
        file: "file-field",
        "radio-same-name": "radio-buttons",
        "checkboxes-multi": "checkboxes",
        "select-one": "dropdowns",
        "select-many": "dropdowns",
        number: "typed-fields",
        range: "typed-fields",
        email: "typed-fields",
        date: "typed-fields",
      },
      anchors: {
        "href-documents": "anchors",
        "mailto-tel": "mailto-tel",
        "hash-toc": "hash-toc",
      },
      "single-page-navigation": {
        "link-toc": "labs-index",
        "labs-index-toc": "labs-index",
        "layout-children": "labs-layout",
        "lab2-page": "labs-layout",
        "lab3-page": "labs-layout",
      },
      "kambaz-overview": { landing: "kambaz-landing" },
      "kambaz-account": {
        "signin-live": "kambaz-signin",
        "signup-live": "kambaz-signup",
        "profile-live": "kambaz-profile",
        "account-layout-live": "kambaz-account-nav",
      },
      "kambaz-dashboard": { "dashboard-page-live": "kambaz-dashboard" },
      "kambaz-navigation": { "layout-live": "kambaz-navigation" },
      "kambaz-courses": { "layout-live": "kambaz-courses" },
      "kambaz-modules": {
        "modules-page-live": "kambaz-modules",
        "home-live": "kambaz-home",
      },
      "kambaz-assignments": {
        "list-screen-live": "kambaz-assignments",
        "editor-live": "kambaz-assignment-editor",
      },
      "css-intro": {
        "style-attr": "css-style-attr",
        "import-live": "css-import",
        "id-live": "css-id-selectors",
        "class-live": "css-class-selectors",
        "structure-live": "css-structure-selectors",
      },
      "css-colors": {
        "fg-demo": "css-foreground",
        "bg-demo": "css-background",
      },
      "css-box-model": {
        "borders-demo": "css-borders",
        "padding-live": "css-padding",
        "margins-live": "css-margins",
        "box-model-demo": "css-box-model",
        "corners-live": "css-corners",
      },
      "css-size-and-position": {
        "dimensions-live": "css-dimensions",
        "display-demo": "css-display",
        "relative-live": "css-position-relative",
        "absolute-live": "css-position-absolute",
        "fixed-live": "css-position-fixed",
        "zindex-live": "css-zindex",
      },
      "css-media-queries": { demo: "css-media-queries" },
      "css-float": {
        "float-demo": "css-float",
        "grid-demo": "css-grid-layout",
      },
      "css-flex": {
        "row-live": "css-flex-row",
        "grow-live": "css-flex-grow",
        "pin-live": "css-flex-width",
      },
      "css-rotation": {
        rotate: "css-rotate",
        gradient: "css-gradient",
      },
      "react-icons": { "sampler-live": "react-icons" },
      "tailwind-spacing": { demo: "tw-spacing" },
      "tailwind-typography": { demo: "tw-typography" },
      "tailwind-colors": {
        demo: "tw-backgrounds",
      },
      "tailwind-filters-and-grid": {
        "filters-demo": "tw-filters",
        "flex-demo": "tw-flex",
        "grid-demo": "tw-grids",
      },
      "tailwind-responsive": { demo: "tw-responsive" },
      "kambaz-nav-styling": { demo: "kambaz-styled-nav" },
      "kambaz-dashboard-styling": { demo: "kambaz-styled-dashboard" },
      "kambaz-courses-styling": {
        "course-nav-demo": "kambaz-styled-course-nav",
        "modules-demo": "kambaz-styled-modules",
        "home-demo": "kambaz-styled-home",
      },
      "kambaz-assignments-styling": {
        "people-demo": "kambaz-styled-people",
        "assignments-demo": "kambaz-styled-assignments",
      },
      "kambaz-account-styling": { demo: "kambaz-styled-signin" },
      "intro-to-javascript": { "lab3-stub": "lab3-stub" },
      "variables-and-constants": { sample: "js-variables" },
      "variable-types": { sample: "js-variable-types" },
      "booleans-and-conditionals": {
        "boolean-sample": "js-booleans",
        "if-else": "js-if-else",
        ternary: "js-ternary",
        "output-if-else": "js-conditional-if-else",
        "output-inline": "js-conditional-inline",
      },
      "null-and-undefined": { sample: "js-null-undefined" },
      "javascript-functions": {
        legacy: "js-legacy-functions",
        arrow: "js-arrow-functions",
        implied: "js-implied-return",
        templates: "js-template-literals",
      },
      "javascript-arrays": {
        simple: "js-simple-arrays",
        index: "js-array-index",
        mutate: "js-array-add-remove",
      },
      "array-iteration": {
        "for-loop": "js-for-loops",
        map: "js-map",
      },
      "array-search": {
        find: "js-find",
        "find-index": "js-find-index",
        filter: "js-filter",
        booleans: "js-includes-some-every",
      },
      "reduce-and-json": {
        reduce: "js-reduce",
        json: "js-json-stringify",
      },
      "javascript-objects": { house: "js-house" },
      "spread-and-destructuring": {
        spread: "js-spreader",
        destruct: "js-destructing",
        "fn-destruct": "js-function-destructing",
        imports: "js-destructing-imports",
      },
      "optional-chaining": { sample: "js-optional-chaining" },
      "dynamic-styling": {
        classes: "js-classes",
        styles: "js-styles",
      },
      "client-and-server": {
        client: "js-client-component",
        server: "js-server-component",
      },
      "parameterizing-components": {
        add: "js-add",
        square: "js-square",
        highlight: "js-highlight",
      },
      "path-params-and-todos": {
        "path-links": "js-path-parameters",
        "todo-list": "js-todo-list",
      },
      "kambaz-database": { nav: "kambaz-styled-nav" },
      "kambaz-dashboard-data": { page: "kambaz-styled-dashboard" },
      "kambaz-courses-data": { "course-nav": "kambaz-styled-course-nav" },
      "kambaz-modules-data": { page: "kambaz-styled-modules" },
      "kambaz-assignments-data": {
        list: "kambaz-styled-assignments",
        people: "kambaz-styled-people",
      },
      "click-events": {
        "lab4-stub": "lab4-stub",
        click: "click-event",
      },
      "passing-data-and-functions": {
        "passing-data": "passing-data",
        "passing-functions": "passing-functions",
      },
      "usestate-counter": {
        broken: "counter-broken",
        working: "counter",
      },
      "form-state-types": {
        boolean: "boolean-state",
        string: "string-state",
        date: "date-state",
        object: "object-state",
        array: "array-state",
      },
      "sharing-parent-child": { parent: "parent-child-state" },
      "prop-drilling-and-url": {
        drilling: "prop-drilling",
        "url-form": "url-encoding",
      },
      "react-context": { siblings: "context-counter" },
      "zustand-counter": { component: "zustand-counter" },
      "zustand-todos": { list: "zustand-todos" },
      "use-effect": { demo: "use-effect" },
      "kambaz-courses-store": { demo: "kambaz-courses-crud" },
      "kambaz-dashboard-crud": {
        add: "kambaz-courses-crud",
        edit: "kambaz-styled-dashboard",
      },
      "kambaz-modules-store": { demo: "kambaz-styled-modules" },
      "kambaz-account-context": { signin: "kambaz-styled-signin" },
      "lab5-env": { environment: "lab5-env" },
      "next-routes": {
        hello: "lab5-hello",
        client: "lab5-calculator",
      },
      "kambaz-account-rest": { "signin-ui": "kambaz-styled-signin" },
      "kambaz-courses-api": { client: "kambaz-styled-dashboard" },
      mongoose: { env: "lab6-status", dao: "lab6-todos" },
      "mongo-apis": {
        async: "kambaz-styled-signin",
        "people-table": "kambaz-styled-people",
      },
      "mongo-users-crud": { create: "lab6-users" },
      "atlas-compass": { import: "kambaz-styled-dashboard" },
      "atlas-node": { env: "lab6-status" },
      "atlas-sessions": { client: "kambaz-styled-signin" },
      "kambaz-courses-db": { "delete-update": "kambaz-styled-dashboard" },
      "kambaz-modules-db": { "delete-update": "kambaz-styled-modules" },
      "kambaz-enrollments-db": {
        people: "kambaz-styled-people",
        assignments: "kambaz-styled-assignments",
      },
      "youtube-search": { field: "youtube-search" },
      "youtube-details": {
        embed: "youtube-details",
        "lesson-icon": "youtube-lesson",
      },
      "chatgpt-ui": {
        page: "openai-chat",
        "image-route": "openai-images",
        vision: "openai-vision",
      },
      "grok-chat": { sparkle: "grok-sparkle" },
      "grok-images": { "modules-ui": "grok-modules" },
    } as const;
    const used = new Set<string>();
    for (const [slug, slides] of Object.entries(expected)) {
      for (const [id, embed] of Object.entries(slides)) {
        const slide = findSlide(slug, id);
        assert.equal(slide.embed, embed);
        assert.equal(slide.imageSrc, undefined);
        assert.ok((LECTURE_EMBED_IDS as readonly string[]).includes(embed));
        used.add(embed);
      }
    }
    for (const deck of listLectureDecks()) {
      for (const slide of deck.slides) {
        if (slide.embed) used.add(slide.embed);
      }
    }
    assert.deepEqual(
      [...LECTURE_EMBED_IDS].sort(),
      [...used].sort(),
      "every embed id should be wired to a slide",
    );
  });

  it("authors Installing Node.js on the block slide model", () => {
    const deck = getLectureDeck("installing-nodejs");
    assert.ok(deck);
    assert.equal(deckUsesBlockModel(deck.slides), true);
    const hello = findSlide("installing-nodejs", "hello-js");
    assert.equal(isBlockSlide(hello), true);
    const adapted = toBlockSlide(findSlide("html-and-dom", "hello-html"));
    assert.equal(adapted.blocks.some((block) => block.type === "code"), true);
    assert.equal(adapted.blocks.some((block) => block.type === "component"), true);
  });

  it("summarizes Installing Node.js as install + hello.js, not Express", () => {
    const item = getLecture("installing-nodejs");
    assert.ok(item);
    assert.match(item.summary, /hello\.js/);
    assert.match(item.summary, /Node/);
    assert.doesNotMatch(item.summary, /Express/i);
    assert.doesNotMatch(item.summary, /4000/);
    assert.equal(item.bookHref, "/book/ch1#sec-1-2-1");
    const text = slideText("installing-nodejs");
    assert.match(text, /localhost:4000\/hello/);
  });

  it("keeps Node deck evergreen and uses kambaz spelling", () => {
    const text = slideText("installing-nodejs");
    assert.match(text, /mkdir -p webdev/);
    assert.match(text, /kambaz-node-server-app/);
    assert.match(text, /localhost:4000\/hello/);
    assert.doesNotMatch(text, /Fall 2026/);
    assert.doesNotMatch(text, /2026\/fall\/webdev/);
    assert.doesNotMatch(text, /Winter 2034/);
    assert.doesNotMatch(text, /kanbas/);
    assert.doesNotMatch(text, /kanbaz-node/);
  });

  it("omits semester and course-section strings from authored slides", () => {
    for (const deck of listLectureDecks()) {
      const text = slideText(deck.slug);
      assert.doesNotMatch(text, /Fall 20\d\d/);
      assert.doesNotMatch(text, /Winter 20\d\d/);
      assert.doesNotMatch(text, /CS 4550/);
      assert.doesNotMatch(text, /CS 5610/);
      assert.doesNotMatch(text, /2026\/fall/);
      assert.doesNotMatch(text, /Kanbas/);
      assert.doesNotMatch(text, /HashRouter/);
      assert.doesNotMatch(text, /src\/Kanbas/);
    }
  });

  it("rewrites deploy notes to Vercel and not Netlify", () => {
    const text = slideText("deploying-to-vercel");
    assert.match(text, /Vercel/);
    assert.match(text, /Deployment Protection/);
    assert.match(text, /Vercel Authentication/);
    assert.match(text, /webdev-client/);
    assert.doesNotMatch(text, /kambaz-next-js/);
    assert.match(text, /OFFICE HOURS/);
    assert.match(text, /BREAK/);
    assert.match(text, /Jose Annunziato/);
    assert.doesNotMatch(text, /netlify\.com/i);
    assert.doesNotMatch(text, /Netlify/);
    assert.doesNotMatch(text, /Deploy to Netlify/);
    assert.doesNotMatch(text, /kanbas/);
    assert.doesNotMatch(text, /Push to update/);
    assert.doesNotMatch(text, /Install Vercel on GitHub/);
  });

  it("names the GitHub repo webdev-client", () => {
    const text = slideText("commit-to-github");
    assert.match(text, /webdev-client/);
    assert.match(text, /node_modules/);
    assert.match(text, /git push -u origin main/);
    assert.doesNotMatch(text, /kambaz-next-js/);
    assert.doesNotMatch(text, /kanbas/);
    assert.doesNotMatch(text, /kanbaz/);
  });

  it("keeps the student project name webdev-client on lecture slides and mocks", () => {
    for (const deck of listLectureDecks()) {
      assert.doesNotMatch(slideText(deck.slug), /kambaz-next-js/, deck.slug);
      const lecture = getLecture(deck.slug);
      assert.ok(lecture);
      assert.doesNotMatch(lecture.summary, /kambaz-next-js/, deck.slug);
    }
    const creating = slideText("creating-a-nextjs-react-application");
    assert.match(creating, /npx create-next-app@latest webdev-client/);
    assert.match(creating, /cd webdev-client/);
    const diagrams = join(process.cwd(), "app/slides/_components/diagrams");
    for (const file of sourceFilesUnder(diagrams)) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /kambaz-next-js/, file);
    }
  });

  it("teaches Chapter 1 HTML topics in the Lecture 2 decks", () => {
    const html = slideText("html-and-dom");
    assert.match(html, /HyperText Markup Language|HTML = HyperText/);
    assert.match(html, /DOCTYPE/);
    assert.match(html, /hello\.html/);
    assert.match(html, /<!--/);
    assert.match(html, /\{\/\*/);
    assert.match(html, /Window/);
    assert.match(html, /wd-lab1/);

    const headings = slideText("headings-and-paragraphs");
    assert.match(headings, /h1/);
    assert.match(headings, /wd-h-tag/);
    assert.match(headings, /wd-p-2/);
    assert.match(headings, /wd-p-4/);

    const lists = slideText("lists-and-tables");
    assert.match(lists, /wd-pancakes/);
    assert.match(lists, /wd-tables/);
    assert.match(lists, /colSpan/);
    assert.match(lists, /not layout|not a layout/i);
    const quizTable = findSlide("lists-and-tables", "quiz-table");
    const quizCode = lectureSlideCodeBlocks(quizTable).map((block) => block.code).join("\n");
    const tablesSource = readFileSync(
      join(process.cwd(), "app/labs/lab1/Tables.tsx"),
      "utf8",
    ).trim();
    assert.equal(quizCode.trim(), tablesSource);
    assert.match(quizCode, /<th align="center">Date<\/th>/);
    assert.match(quizCode, /colSpan=\{3\}/);
    assert.doesNotMatch(quizCode, /colSpan=\{2\}/);

    const forms = slideText("web-forms");
    assert.match(forms, /defaultValue/);
    assert.match(forms, /htmlFor/);
    assert.match(forms, /type="file"/);
    assert.match(forms, /radio-genre/);
    assert.match(forms, /preventDefault/);
    assert.doesNotMatch(forms, /Fall 2026/);

    const anchors = slideText("anchors");
    assert.match(anchors, /wd-lipsum/);
    assert.match(anchors, /mailto:/);
    assert.match(anchors, /tel:/);
    assert.match(anchors, /#wd-anchor-bottom/);

    const spa = slideText("single-page-navigation");
    assert.match(spa, /next\/link/);
    assert.match(spa, /History API/);
    assert.match(spa, /layout\.tsx/);
    assert.match(spa, /app\/labs\/page\.tsx/);
    assert.match(spa, /TOC\.tsx/);
    assert.match(spa, /app\/labs\/lab2\/page\.tsx/);
    assert.match(spa, /app\/labs\/lab3\/page\.tsx/);
    assert.match(spa, /\(kambaz\)/);
    assert.match(spa, /#\/lab1/);
    const tocSlide = findSlide("single-page-navigation", "labs-index-toc");
    const tocFiles = lectureSlideCodeBlocks(tocSlide).map((block) => block.file);
    assert.ok(tocFiles.includes("app/labs/page.tsx"));
    assert.ok(tocFiles.includes("app/labs/TOC.tsx"));
  });

  it("teaches Chapter 1 Kambaz A1 screens in the Lecture 3 decks", () => {
    const overview = slideText("kambaz-overview");
    assert.match(overview, /app\/\(kambaz\)\/page\.tsx/);
    assert.match(overview, /wd-kambaz/);
    assert.match(overview, /wd-kambaz-link/);
    assert.match(overview, /href="\/labs" id="wd-home-link"/);
    assert.match(overview, /next\/navigation/);
    assert.match(overview, /redirect\("\/account\/signin"\)/);
    assert.doesNotMatch(overview, /HashRouter/);
    assert.doesNotMatch(overview, /src\/Kanbas/);
    assert.doesNotMatch(overview, HOME_LABS_AS_LAB1);

    const account = slideText("kambaz-account");
    assert.match(account, /wd-signin-screen/);
    assert.match(account, /wd-signin-btn/);
    assert.match(account, /\/account\/signin/);
    assert.match(account, /wd-password-verify/);
    assert.match(account, /wd-firstname/);
    assert.match(account, /wd-kambaz-account/);
    assert.match(account, /app\/\(kambaz\)\/account\/layout\.tsx/);
    assert.doesNotMatch(account, /next\/dist\/client/);
    assert.doesNotMatch(account, /href=\{?"signin"/);

    const dashboard = slideText("kambaz-dashboard");
    assert.match(dashboard, /CourseCard/);
    assert.match(dashboard, /next\/image/);
    assert.match(dashboard, /\/courses\/\$\{id\}\/home/);
    assert.match(dashboard, /wd-dashboard/);
    assert.match(dashboard, /Published Courses \(3\)/);
    assert.match(dashboard, /wd-signin-btn/);
    assert.doesNotMatch(dashboard, /#\/Kanbas/);

    const navigation = slideText("kambaz-navigation");
    assert.match(navigation, /wd-kambaz-navigation/);
    assert.match(navigation, /wd-neu-link/);
    assert.match(navigation, /app\/not-found\.tsx/);
    assert.match(navigation, /wd-not-found-dashboard-link/);

    const courses = slideText("kambaz-courses");
    assert.match(courses, /\/courses\/\[cid\]\/home/);
    assert.match(courses, /wd-courses-navigation/);
    assert.match(courses, /await params/);
    assert.match(courses, /wd-course-people-link/);
    assert.match(courses, /people\/table/);

    const modules = slideText("kambaz-modules");
    assert.match(modules, /wd-modules/);
    assert.match(modules, /wd-module/);
    assert.match(modules, /LEARNING OBJECTIVES/);
    assert.match(modules, /import Module from "\.\/Module"/);
    assert.match(modules, /import Lesson from "\.\/Lesson"/);
    assert.match(modules, /app\/\(kambaz\)\/courses\/\[cid\]\/modules\/Lesson\.tsx/);
    assert.match(modules, /wd-course-status/);
    assert.match(modules, /import Modules from "\.\.\/modules\/page"/);
    const modulesCode = findSlide("kambaz-modules", "modules-page");
    assert.ok(
      lectureSlideCodeBlocks(modulesCode).some((block) =>
        block.code.includes("<Module title="),
      ),
    );
    const modulesDemo = findSlide("kambaz-modules", "modules-page-live");
    assert.equal(modulesDemo.embed, "kambaz-modules");
    assert.equal(lectureSlideCodeBlocks(modulesDemo).length, 0);

    const assignments = slideText("kambaz-assignments");
    assert.match(assignments, /wd-search-assignment/);
    assert.match(assignments, /wd-assignment-link/);
    assert.match(assignments, /AssignmentItem/);
    assert.match(assignments, /defaultValue/);
    assert.match(assignments, /wd-assignments-editor/);
    assert.match(assignments, /wd-cancel/);
    assert.doesNotMatch(assignments, /<a href="\/courses/);
  });

  it("labels Labs Home as wd-home-link in Chapter 1 teaching snippets", () => {
    const book = readFileSync(
      join(process.cwd(), "app/book/ch1/sections/KambazSections.tsx"),
      "utf8",
    );
    assert.match(book, /href="\/labs" id="wd-home-link"/);
    assert.doesNotMatch(book, HOME_LABS_AS_LAB1);

    const roots = [
      join(process.cwd(), "app/book/ch1"),
      join(process.cwd(), "lib/lectures/decks"),
    ];
    for (const root of roots) {
      for (const file of sourceFilesUnder(root)) {
        assert.doesNotMatch(
          readFileSync(file, "utf8"),
          HOME_LABS_AS_LAB1,
          `${file} must not put wd-lab1-link on the Home /labs link`,
        );
      }
    }

    for (const slug of [
      ...LECTURE_1_SLUGS,
      ...LECTURE_2_SLUGS,
      ...LECTURE_3_SLUGS,
    ]) {
      assert.doesNotMatch(slideText(slug), HOME_LABS_AS_LAB1, slug);
    }
  });

  it("shows book Canvas target screenshots before Ch1 Kambaz screen sequences", () => {
    const expected = {
      "kambaz-account": {
        "target-signin": "/images/book/kambaz/account-signin.png",
        "target-profile": "/images/book/kambaz/account-profile.png",
      },
      "kambaz-dashboard": {
        "target-dashboard": "/images/book/kambaz/dashboard.png",
      },
      "kambaz-navigation": {
        "target-navigation": "/images/book/kambaz/navigation.png",
      },
      "kambaz-courses": {
        "target-course-nav": "/images/book/kambaz/course-navigation.png",
      },
      "kambaz-modules": {
        "target-modules": "/images/book/kambaz/modules.png",
        "target-home": "/images/book/kambaz/home.png",
      },
      "kambaz-assignments": {
        "target-assignments": "/images/book/kambaz/assignments.png",
        "target-editor": "/images/book/kambaz/assignment-editor.png",
      },
    } as const;

    for (const [slug, slides] of Object.entries(expected)) {
      const deck = getLectureDeck(slug);
      assert.ok(deck);
      const ids = deck.slides.map((slide) => slide.id);
      for (const [id, src] of Object.entries(slides)) {
        const slide = findSlide(slug, id);
        assert.equal(slide.imageSrc, src);
        assert.ok(isBookKambazTargetSrc(slide.imageSrc));
        assert.equal(slide.embed, undefined);
        assert.ok(
          existsSync(join(process.cwd(), "public", src.replace(/^\//, ""))),
          `${src} should exist`,
        );
        const targetIndex = ids.indexOf(id);
        const liveId = {
          "target-signin": "signin-live",
          "target-profile": "profile-live",
          "target-dashboard": "dashboard-page-live",
          "target-navigation": "layout-live",
          "target-course-nav": "layout-live",
          "target-modules": "modules-page-live",
          "target-home": "home-live",
          "target-assignments": "list-screen-live",
          "target-editor": "editor-live",
        }[id];
        assert.ok(liveId);
        assert.ok(
          targetIndex < ids.indexOf(liveId),
          `${slug} ${id} should appear before ${liveId}`,
        );
      }
    }
  });

  it("splits Ch1 Kambaz code and live demos onto adjacent slides", () => {
    const pairs = [
      ["kambaz-account", "signin", "signin-live"],
      ["kambaz-account", "signup", "signup-live"],
      ["kambaz-account", "profile", "profile-live"],
      ["kambaz-account", "account-layout", "account-layout-live"],
      ["kambaz-dashboard", "dashboard-page", "dashboard-page-live"],
      ["kambaz-navigation", "layout", "layout-live"],
      ["kambaz-courses", "layout", "layout-live"],
      ["kambaz-modules", "modules-page", "modules-page-live"],
      ["kambaz-modules", "home", "home-live"],
      ["kambaz-assignments", "list-screen", "list-screen-live"],
      ["kambaz-assignments", "editor", "editor-live"],
    ] as const;

    for (const [slug, codeId, liveId] of pairs) {
      const deck = getLectureDeck(slug);
      assert.ok(deck);
      const ids = deck.slides.map((slide) => slide.id);
      const code = findSlide(slug, codeId);
      const live = findSlide(slug, liveId);
      assert.ok(lectureSlideCodeBlocks(code).length > 0, `${slug} ${codeId} needs code`);
      assert.equal(code.embed, undefined, `${slug} ${codeId} should not share an embed`);
      assert.ok(live.embed, `${slug} ${liveId} needs a live embed`);
      assert.equal(lectureSlideCodeBlocks(live).length, 0, `${slug} ${liveId} is demo-only`);
      assert.equal(ids.indexOf(liveId), ids.indexOf(codeId) + 1);
    }
  });

  it("teaches Chapter 2 CSS topics in the Lecture 4 decks", () => {
    const intro = slideText("css-intro");
    assert.match(intro, /backgroundColor/);
    assert.match(intro, /import "\.\/index\.css"/);
    assert.match(intro, /wd-id-selector-1/);
    assert.match(intro, /wd-class-selector/);
    assert.match(intro, /\.wd-selector-1 \.wd-selector-3/);
    assert.match(intro, /Specificity/);
    assert.doesNotMatch(intro, /Bootstrap/);

    const colors = slideText("css-colors");
    assert.match(colors, /wd-fg-color-blue/);
    assert.match(colors, /wd-bg-color-yellow/);
    assert.match(colors, /#7070ff/);
    assert.match(colors, /ForegroundColors\.tsx/);
    assert.match(colors, /BackgroundColors\.tsx/);

    const box = slideText("css-box-model");
    assert.match(box, /wd-border-fat/);
    assert.match(box, /wd-padded-top-left/);
    assert.match(box, /wd-margin-bottom/);
    assert.match(box, /border-box/);
    assert.match(box, /content-box/);
    assert.match(box, /wd-rounded-corners-top/);
    const layers = findSlide("css-box-model", "layers");
    assert.equal(layers.diagram, "box-model");

    const size = slideText("css-size-and-position");
    assert.match(size, /wd-dimension-portrait/);
    assert.match(size, /inline-block/);
    assert.match(size, /wd-pos-relative-nudge-down-right/);
    assert.match(size, /wd-pos-absolute-10-10/);
    assert.match(size, /wd-pos-fixed/);
    assert.match(size, /wd-zindex-bring-to-front/);

    const mq = slideText("css-media-queries");
    assert.match(mq, /@media/);
    assert.match(mq, /750px/);
    assert.match(mq, /MediaQueriesDemo\.tsx/);
    assert.match(mq, /MediaQueriesDemo\.css/);
    assert.doesNotMatch(mq, /@screen-sm-min/);
    assert.doesNotMatch(mq, /min-width: 576px/);

    const float = slideText("css-float");
    assert.match(float, /wd-float-left/);
    assert.match(float, /wd-float-done/);
    assert.match(float, /wd-float-divs/);
    assert.match(float, /STARSHIP/);
    assert.match(float, /staradvertiser/i);
    assert.match(float, /wd-grid-col-half-page/);
    assert.match(float, /wd-grid-col-left-sidebar/);
    assert.doesNotMatch(float, /googleusercontent/i);

    const flex = slideText("css-flex");
    assert.match(flex, /wd-flex-row-container/);
    assert.match(flex, /wd-flex-grow-1/);
    assert.match(flex, /wd-width-75px/);
    assert.match(flex, /Flex\.tsx/);

    const rotation = slideText("css-rotation");
    assert.match(rotation, /transform: rotate/);
    assert.match(rotation, /linear-gradient/);
    assert.match(rotation, /radial-gradient/);
    assert.match(rotation, /Not required for Lab 2/);
  });

  it("teaches Chapter 2 Tailwind and Kambaz styling after Lecture 4", () => {
    const icons = slideText("react-icons");
    assert.match(icons, /npm install react-icons/);
    assert.match(icons, /ReactIconsSampler/);
    assert.match(icons, /react-icons\/fa/);
    assert.match(icons, /text-3xl/);
    assert.doesNotMatch(icons, /kit\.fontawesome/);

    const intro = slideText("tailwind-intro");
    assert.match(intro, /@import "tailwindcss"/);
    assert.match(intro, /app\/labs\/lab2\/tailwind\/index\.css/);
    assert.match(intro, /Preflight/);
    assert.match(intro, /create-next-app/);
    assert.match(intro, /\/labs\/lab2\/tailwind/);
    assert.doesNotMatch(intro, /npm install bootstrap/i);
    assert.doesNotMatch(intro, /from ["']react-bootstrap["']/);

    const spacing = slideText("tailwind-spacing");
    assert.match(spacing, /TailwindSpacing/);
    assert.match(spacing, /mb-4/);
    assert.match(spacing, /ms-4 me-8/);

    const type = slideText("tailwind-typography");
    assert.match(type, /TailwindTypography/);
    assert.match(type, /text-sm/);
    assert.match(type, /font-black/);

    const colors = slideText("tailwind-colors");
    assert.match(colors, /bg-red-500/);
    assert.match(colors, /yellow-500/);
    assert.doesNotMatch(colors, /TailwindFilters/);

    const flexGrid = slideText("tailwind-filters-and-grid");
    assert.match(flexGrid, /shrink-0/);
    assert.match(flexGrid, /blur-lg/);
    assert.match(flexGrid, /TailwindFilters/);
    assert.match(flexGrid, /grid-cols-4/);
    assert.match(flexGrid, /col-span-4/);
    assert.match(flexGrid, /wd-tailwind-grid-system/);
    assert.doesNotMatch(flexGrid, /wd-flex-row-container/);

    const responsive = slideText("tailwind-responsive");
    assert.match(responsive, /md:flex/);
    assert.match(responsive, /TailwindResponsiveDesign/);
    assert.match(responsive, /mobile-first/i);

    const shell = slideText("kambaz-styling");
    assert.match(shell, /tailwindcss\/theme/);
    assert.match(shell, /utilities\.css/);
    assert.match(shell, /kambaz\.css/);
    assert.match(shell, /wd-main-content-offset/);
    assert.match(shell, /font-sans/);

    const nav = slideText("kambaz-nav-styling");
    assert.match(nav, /wd-kambaz-navigation/);
    assert.match(nav, /hidden md:block/);
    assert.match(nav, /FaRegCircleUser/);
    assert.match(nav, /margin-left: 120px/);

    const dash = slideText("kambaz-dashboard-styling");
    assert.match(dash, /CourseCard/);
    assert.match(dash, /wd-dashboard-courses/);
    assert.match(dash, /sm:grid-cols-2/);
    assert.match(dash, /Published Courses \(3\)/);
    assert.doesNotMatch(dash, /Bootstrap/);
    assert.doesNotMatch(dash, /react-bootstrap/i);
    assert.doesNotMatch(dash, /\bd-flex\b/);

    const courses = slideText("kambaz-courses-styling");
    assert.match(courses, /wd-courses-navigation/);
    assert.match(courses, /list-group-item/);
    assert.match(courses, /kambaz\.css/);
    assert.match(courses, /GreenCheckmark/);
    assert.match(courses, /hidden lg:block/);
    assert.match(courses, /wd-course-status/);
    assert.doesNotMatch(courses, /react-bootstrap/i);
    assert.doesNotMatch(courses, /\bd-flex\b/);

    const assignments = slideText("kambaz-assignments-styling");
    assert.match(assignments, /wd-people-table/);
    assert.match(assignments, /odd:bg-neutral-50/);
    assert.match(assignments, /wd-search-assignment/);
    assert.match(assignments, /AssignmentItem/);
    assert.match(assignments, /wd-assignments-editor/);
    assert.match(assignments, /wd-cancel/);

    const account = slideText("kambaz-account-styling");
    assert.match(account, /wd-signin-screen/);
    assert.match(account, /wd-signin-btn/);
    assert.match(account, /max-w-sm/);
    assert.match(account, /kambaz\.css/);
    assert.doesNotMatch(account, /HashRouter/);
    assert.doesNotMatch(account, /react-bootstrap/i);
    assert.doesNotMatch(account, /\bd-flex\b/);
  });

  it("teaches Chapter 3 JavaScript in the first Ch3 decks", () => {
    const intro = slideText("intro-to-javascript");
    assert.match(intro, /ECMAScript/);
    assert.match(intro, /TypeScript/);
    assert.match(intro, /wd-lab3/);
    assert.match(intro, /app\/labs\/lab3/);
    const lab3 = findSlide("intro-to-javascript", "lab3-stub");
    assert.equal(lab3.codeFile, "app/labs/lab3/page.tsx");
    assert.doesNotMatch(intro, /Zustand/);

    const vars = slideText("variables-and-constants");
    assert.match(vars, /functionScoped/);
    assert.match(vars, /VariablesAndConstants/);
    assert.match(vars, /wd-variables-and-constants/);

    const types = slideText("variable-types");
    assert.match(types, /typeof/);
    assert.match(types, /booleanVariable \+ ""/);
    assert.match(types, /wd-variable-types/);

    const cond = slideText("booleans-and-conditionals");
    assert.match(cond, /===/);
    assert.match(cond, /wd-boolean-variables/);
    assert.match(cond, /wd-if-else/);
    assert.match(cond, /loggedIn \? <p>Welcome<\/p>/);
    assert.match(cond, /Welcome If Else/);
    assert.match(cond, /Welcome Inline/);

    const empty = slideText("null-and-undefined");
    assert.match(empty, /typeof null/);
    assert.match(empty, /wd-null-undefined/);
    assert.match(empty, /String\(null\)/);

    const fns = slideText("javascript-functions");
    assert.match(fns, /function add/);
    assert.match(fns, /wd-legacy-functions/);
    assert.match(fns, /const subtract/);
    assert.match(fns, /=> a \* b/);
    assert.match(fns, /Welcome home/);
    assert.match(fns, /wd-template-literals/);

    const arrays = slideText("javascript-arrays");
    assert.match(arrays, /wd-simple-arrays/);
    assert.match(arrays, /indexOf/);
    assert.match(arrays, /numberArray1.push/);
    assert.match(arrays, /wd-adding-removing-from-arrays/);

    const iter = slideText("array-iteration");
    assert.match(iter, /toUpperCase/);
    assert.match(iter, /numberArray1.map/);
    assert.match(iter, /wd-map-function/);

    const search = slideText("array-search");
    assert.match(search, /wd-find-function/);
    assert.match(search, /findIndex/);
    assert.match(search, /wd-filter-function/);
    assert.match(search, /numbers.includes/);

    const json = slideText("reduce-and-json");
    assert.match(json, /numbers.reduce/);
    assert.match(json, /JSON.stringify\(squares\)/);

    const objects = slideText("javascript-objects");
    assert.match(objects, /wd-house/);
    assert.match(objects, /JSON.stringify\(house, null, 2\)/);
    assert.match(objects, /console.log/);

    const spread = slideText("spread-and-destructuring");
    assert.match(spread, /\[\.\.\.arr1, 4, 5, 6\]/);
    assert.match(spread, /const \{ name, age \} = person/);
    assert.match(spread, /export default Math/);

    const opt = slideText("optional-chaining");
    assert.match(opt, /house.address\?\.city/);
    assert.match(opt, /missing\?\.prop \?\? "n\/a"/);

    const styling = slideText("dynamic-styling");
    assert.match(styling, /wd-bg-\$\{color\}/);
    assert.match(styling, /backgroundColor/);
    assert.match(styling, /wd-classes/);

    const csr = slideText("client-and-server");
    assert.match(csr, /"use client"/);
    assert.match(csr, /usePathname/);
    assert.match(csr, /fs.readdirSync/);

    const props = slideText("parameterizing-components");
    assert.match(props, /<Add a=\{3\} b=\{4\} \/>/);
    assert.match(props, /wd-square/);
    assert.match(props, /wd-highlight/);

    const pathTodos = slideText("path-params-and-todos");
    assert.match(pathTodos, /useParams/);
    assert.match(pathTodos, /todos.json/);
    assert.match(pathTodos, /key=\{todo.title\}/);

    const db = slideText("kambaz-database");
    assert.match(db, /LINKS.map/);
    assert.match(db, /database\/index.ts/);
    assert.match(db, /import \* as db/);

    const dash = slideText("kambaz-dashboard-data");
    assert.match(dash, /db.courses/);
    assert.match(dash, /key=\{course._id\}/);
    assert.match(dash, /\/courses\/\$\{_id\}\/home/);

    const courses = slideText("kambaz-courses-data");
    assert.match(courses, /courses.find/);
    assert.match(courses, /await params/);
    assert.match(courses, /course\?\.name/);

    const modules = slideText("kambaz-modules-data");
    assert.match(modules, /module.course === cid/);
    assert.match(modules, /lessons\?\.map/);

    const people = slideText("kambaz-assignments-data");
    assert.match(people, /assignment.course === cid/);
    assert.match(people, /assignment\?\.title \?\? ""/);
    assert.match(people, /enrollments.some/);
  });

  it("teaches Chapter 4 events, stores, and Kambaz state", () => {
    const clicks = slideText("click-events");
    assert.match(clicks, /"use client"/);
    assert.match(clicks, /wd-lab4/);
    assert.match(clicks, /onClick=\{hello\}/);
    assert.match(clicks, /wd-onclick-hello/);
    assert.doesNotMatch(clicks, /HashRouter/);

    const passing = slideText("passing-data-and-functions");
    assert.match(passing, /lifeIs\("Life is Good!"\)/);
    assert.match(passing, /theFunction/);
    assert.match(passing, /Hello from Lab 4/);

    const counter = slideText("usestate-counter");
    assert.match(counter, /useState\(7\)/);
    assert.match(counter, /let count = 7/);
    assert.match(counter, /setCount\(count \+ 1\)/);
    assert.match(counter, /wd-counter/);

    const forms = slideText("form-state-types");
    assert.match(forms, /wd-boolean-checkbox/);
    assert.match(forms, /setFirstName\(e.target.value\)/);
    assert.match(forms, /dateObjectToHtmlDateString/);
    assert.match(forms, /\.\.\.person/);
    assert.match(forms, /array.filter/);

    const sharing = slideText("sharing-parent-child");
    assert.match(sharing, /useState\(123\)/);
    assert.match(sharing, /setCounter=\{setCounter\}/);
    assert.match(sharing, /wd-child-state/);

    const drill = slideText("prop-drilling-and-url");
    assert.match(drill, /only forwards props/);
    assert.match(drill, /URLSearchParams/);
    assert.match(drill, /useSearchParams/);
    assert.match(drill, /encodeURIComponent/);

    const context = slideText("react-context");
    assert.match(context, /createContext/);
    assert.match(context, /useCounterContext/);
    assert.match(context, /CounterProvider/);
    assert.match(context, /do not put Kambaz courses/i);

    const zustand = slideText("zustand-counter");
    assert.match(zustand, /from "zustand"/);
    assert.match(zustand, /useCounterStore/);
    assert.match(zustand, /wd-zustand-up-click/);
    assert.doesNotMatch(zustand, /Lecture \d+/);

    const todos = slideText("zustand-todos");
    assert.match(todos, /crypto.randomUUID/);
    assert.match(todos, /wd-zustand-todo-title/);
    assert.match(todos, /ZustandTodoItem/);

    const effect = slideText("use-effect");
    assert.match(effect, /useEffect/);
    assert.match(effect, /document.title/);
    assert.match(effect, /wd-use-effect/);

    const check = slideText("ch4-check-understanding");
    assert.match(check, /sec-4-9/);
    assert.match(check, /self-check/);
    assert.doesNotMatch(check, /Lecture \d+/);

    const store = slideText("kambaz-courses-store");
    assert.match(store, /useCoursesStore/);
    assert.match(store, /coursesStore.ts/);
    assert.match(store, /emptyCourse/);

    const crud = slideText("kambaz-dashboard-crud");
    assert.match(crud, /wd-add-new-course-click/);
    assert.match(crud, /preventDefault/);
    assert.match(crud, /updateCourse\(course\)/);

    const modules = slideText("kambaz-modules-store");
    assert.match(modules, /ModuleEditor/);
    assert.match(modules, /wd-add-module-dialog/);
    assert.match(modules, /useModulesStore/);

    const account = slideText("kambaz-account-context");
    assert.match(account, /AccountProvider/);
    assert.match(account, /useAccountContext/);
    assert.match(account, /setCurrentUser/);
    assert.match(account, /users.json/);
  });

  it("teaches Chapter 5 HTTP, Lab 5, Next routes, and Kambaz APIs", () => {
    const http = slideText("http-server");
    assert.match(http, /webdev-server/);
    assert.match(http, /sibling/);
    assert.match(http, /Hello\.js/);
    assert.match(http, /app\.get\("\/hello"/);
    assert.match(http, /localhost:4000\/hello/);
    assert.doesNotMatch(http, /Kanbas/);

    const nodemon = slideText("nodemon-es6-routes");
    assert.match(nodemon, /nodemon/);
    assert.match(nodemon, /"type": "module"/);
    assert.match(nodemon, /Hello\(app\)/);
    assert.match(nodemon, /Life is good!/);

    const env = slideText("lab5-env");
    assert.match(env, /NEXT_PUBLIC_HTTP_SERVER/);
    assert.match(env, /httpServer\(\)/);
    assert.match(env, /\/lab5\/welcome/);
    assert.match(env, /wd-welcome-link/);

    const params = slideText("path-and-query");
    assert.match(params, /req\.params/);
    assert.match(params, /req\.query/);
    assert.match(params, /\.toString\(\)/);
    assert.match(params, /wd-path-parameter-add/);
    assert.match(params, /wd-query-parameter-add/);

    const objects = slideText("remote-objects");
    assert.match(objects, /res\.json/);
    assert.match(objects, /\/lab5\/assignment/);
    assert.match(objects, /assignment\.title/);

    const arrays = slideText("remote-arrays");
    assert.match(arrays, /\/lab5\/todos/);
    assert.match(arrays, /todos\.splice/);
    assert.match(arrays, /wd-retrieve-todos/);

    const asyncHttp = slideText("async-http");
    assert.match(asyncHttp, /axios/);
    assert.match(asyncHttp, /cors/);
    assert.match(asyncHttp, /express\.json/);
    assert.match(asyncHttp, /app\.post/);
    assert.match(asyncHttp, /app\.delete/);

    const next = slideText("next-routes");
    assert.match(next, /\/api\/lab5\/hello/);
    assert.match(next, /\/api\/lab5\/calculator/);
    assert.match(next, /searchParams/);
    assert.doesNotMatch(next, /Lecture \d+/);

    const check = slideText("ch5-check-understanding");
    assert.match(check, /sec-5-check/);
    assert.match(check, /self-check/);
    assert.doesNotMatch(check, /Lecture \d+/);

    const migrate = slideText("kambaz-migrate-db");
    assert.match(migrate, /Kambaz\/Database/);
    assert.match(migrate, /export default/);
    assert.match(migrate, /courses\.js/);

    const accountRest = slideText("kambaz-account-rest");
    assert.match(accountRest, /\/api\/users\/signin/);
    assert.match(accountRest, /setCurrentUser/);
    assert.match(accountRest, /findUserByCredentials/);
    assert.match(accountRest, /axiosWithCredentials/);

    const sessions = slideText("kambaz-sessions");
    assert.match(sessions, /express-session/);
    assert.match(sessions, /withCredentials/);
    assert.match(sessions, /req\.session/);
    assert.match(sessions, /CLIENT_URL/);

    const courses = slideText("kambaz-courses-api");
    assert.match(courses, /findCoursesForEnrolledUser/);
    assert.match(courses, /\/api\/users\/current\/courses/);
    assert.match(courses, /\/api\/courses\/:courseId\/modules/);

    const deploy = slideText("deploy-api");
    assert.match(deploy, /Render/);
    assert.match(deploy, /NEXT_PUBLIC_HTTP_SERVER/);
    assert.match(deploy, /webdev-server/);
    assert.doesNotMatch(deploy, /netlify\.com/i);
  });

  it("teaches Chapter 6 MongoDB, Mongoose, Atlas, and Kambaz DB", () => {
    const local = slideText("local-mongo");
    assert.match(local, /mongod/);
    assert.match(local, /27017/);
    assert.match(local, /mongodb:\/\/127\.0\.0\.1:27017/);
    assert.match(local, /kambaz/);
    assert.match(local, /users\.json|users/);
    assert.doesNotMatch(local, /Kanbas/);

    const mongoose = slideText("mongoose");
    assert.match(mongoose, /npm install mongoose/);
    assert.match(mongoose, /DATABASE_CONNECTION_STRING/);
    assert.match(mongoose, /UserModel/);
    assert.match(mongoose, /collection: "users"/);
    assert.match(mongoose, /findUserByCredentials/);
    assert.match(mongoose, /uuidv4/);

    const apis = slideText("mongo-apis");
    assert.match(apis, /async/);
    assert.match(apis, /findUserByCredentials/);
    assert.match(apis, /\/api\/users/);
    assert.match(apis, /findAllUsers/);
    assert.match(apis, /ADMIN/);
    assert.match(apis, /useAccountContext/);
    assert.doesNotMatch(apis, /Lecture \d+/);

    const crud = slideText("mongo-users-crud");
    assert.match(crud, /findUsersByRole/);
    assert.match(crud, /findUsersByPartialName/);
    assert.match(crud, /\$regex/);
    assert.match(crud, /findById/);
    assert.match(crud, /findByIdAndDelete/);
    assert.match(crud, /\$set/);
    assert.match(crud, /app\.post\("\/api\/users"/);

    const atlas = slideText("atlas");
    assert.match(atlas, /mongodb\+srv/);
    assert.match(atlas, /127\.0\.0\.1/);
    assert.match(atlas, /Free/);
    assert.match(atlas, /Kambaz/);
    assert.doesNotMatch(atlas, /netlify\.com/i);
    assert.doesNotMatch(atlas, /OMDb|omdb/i);
    assert.doesNotMatch(atlas, /napster/i);
    assert.doesNotMatch(atlas, /supersecretpassword/);
    assert.match(atlas, /<password>/);

    const compass = slideText("atlas-compass");
    assert.match(compass, /mongodb\+srv/);
    assert.match(compass, /New Window|new window/i);
    assert.match(compass, /users|courses|modules/);
    assert.doesNotMatch(compass, /netlify\.com/i);
    assert.doesNotMatch(compass, /supersecretpassword/);

    const node = slideText("atlas-node");
    assert.match(node, /0\.0\.0\.0\/0/);
    assert.match(node, /\/kambaz\?/);
    assert.match(node, /DATABASE_CONNECTION_STRING/);
    assert.match(node, /NEXT_PUBLIC_HTTP_SERVER/);
    assert.doesNotMatch(node, /netlify\.com/i);

    const sessions = slideText("atlas-sessions");
    assert.match(sessions, /SERVER_ENV=production/);
    assert.match(sessions, /CLIENT_URL/);
    assert.match(sessions, /SESSION_SECRET/);
    assert.match(sessions, /NEXT_PUBLIC_/);
    assert.match(sessions, /12\/7/);
    assert.doesNotMatch(sessions, /netlify\.com/i);

    const check = slideText("ch6-check-understanding");
    assert.match(check, /sec-6-check/);
    assert.match(check, /self-check/);
    assert.doesNotMatch(check, /Lecture \d+/);

    const courses = slideText("kambaz-courses-db");
    assert.match(courses, /CourseModel/);
    assert.match(courses, /model\.find/);
    assert.match(courses, /uuidv4/);
    assert.match(courses, /deleteOne/);
    assert.match(courses, /updateOne/);

    const modules = slideText("kambaz-modules-db");
    assert.match(modules, /one-to-many|1:N|foreign key/i);
    assert.match(modules, /course: String/);
    assert.match(modules, /find\(\{ course: courseId \}\)/);
    assert.match(modules, /\/api\/courses\/:courseId\/modules/);

    const enrollments = slideText("kambaz-enrollments-db");
    assert.match(enrollments, /populate\("course"\)/);
    assert.match(enrollments, /ref: "CourseModel"/);
    assert.match(enrollments, /deleteMany/);
    assert.match(enrollments, /enrollUserInCourse/);
    assert.match(enrollments, /findUsersForCourse/);
  });

  it("teaches YouTube, ChatGPT, and Grok from the Drive decks — no Napster or OMDb", () => {
    assert.deepEqual(
      BOOK_CHAPTERS.map((chapter) => chapter.weeks),
      ["9/14, 9/21", "9/28, 10/5", "10/12, 10/19", "10/26, 11/2", "11/9, 11/16", "11/23, 11/30", "12/7"],
    );

    const youtube = slideText("youtube-api");
    assert.match(youtube, /googleapis/);
    assert.match(youtube, /NEXT_PUBLIC_YOUTUBE_API/);
    assert.match(youtube, /YOUR_YOUTUBE_API_KEY/);
    assert.match(youtube, /YouTube Data API v3/);
    assert.match(youtube, /youtu\.be\/KSfs9fJW1rY/);

    const search = slideText("youtube-search");
    assert.match(search, /\/search\?part=snippet/);
    assert.match(search, /id\.videoId/);

    const details = slideText("youtube-details");
    assert.match(details, /videos\?part=snippet/);
    assert.match(details, /youTubeId/);
    assert.doesNotMatch(details, /napster/i);

    const chatgpt = slideText("chatgpt-api");
    assert.match(chatgpt, /npm install openai/);
    assert.match(chatgpt, /OPENAI_API_KEY/);
    assert.match(chatgpt, /responses\.create/);
    assert.match(chatgpt, /never NEXT_PUBLIC_/);

    const text = slideText("chatgpt-text");
    assert.match(text, /zodTextFormat/);
    assert.match(text, /moderations\.create/);
    assert.match(text, /CalendarEvent/);

    const ui = slideText("chatgpt-ui");
    assert.match(ui, /\/api\/openai\/conversation/);
    assert.match(ui, /\/api\/courses\/ai/);
    assert.match(ui, /\/api\/modules\/ai/);
    assert.match(ui, /images\.generate/);

    const grok = slideText("grok-api");
    assert.match(grok, /api\.x\.ai/);
    assert.match(grok, /XAI_API_KEY/);
    assert.match(grok, /YOUR_XAI_API_KEY/);
    assert.match(grok, /generateText/);
    assert.match(grok, /xai\("grok-4"\)/);
    assert.match(grok, /grok-4-latest/);
    assert.match(grok, /youtu\.be\/rwE57Cdk1fA/);

    const chat = slideText("grok-chat");
    assert.match(chat, /chat\.completions\.create/);
    assert.match(chat, /\/api\/xai\/course/);
    assert.match(chat, /PiStarFourFill/);

    const images = slideText("grok-images");
    assert.match(images, /grok-2-image/);
    assert.match(images, /image_url/);
    assert.match(images, /upsertCourse/);
    assert.match(images, /\/api\/xai\/course\/:cid\/modules/);

    for (const slug of PROJECT_SLUGS) {
      const copy = slideText(slug);
      assert.doesNotMatch(copy, /OMDb|omdb/i);
      assert.doesNotMatch(copy, /napster/i);
      assert.doesNotMatch(copy, /sk-proj-/);
      assert.doesNotMatch(copy, /AIzaSy/);
      assert.doesNotMatch(copy, /xai-W2eC/);
      assert.doesNotMatch(copy, /Kanbas/);
      assert.doesNotMatch(copy, /\/book\/ch7/);
      assert.doesNotMatch(copy, /sec-7-/);
    }
  });

  it("does not surface Lecture N as the product name in slide copy", () => {
    for (const deck of listLectureDecks()) {
      const text = slideText(deck.slug);
      assert.doesNotMatch(text, /Lecture \d+ · Deck/);
      assert.doesNotMatch(text, /Lecture \d+ recap/);
    }
    const intro = getLecture("intro-to-javascript");
    assert.ok(intro);
    assert.equal(intro.chapter, 3);
    assert.equal(intro.bookHref, "/book/ch3#sec-3-2");
    assert.equal(intro.topicId, "js-intro");
  });

  it("scrolls the slide pane with Up\/Down only when content overflows", () => {
    assert.equal(slidePaneOverflows(null), false);
    assert.equal(slidePaneOverflows({ scrollHeight: 400, clientHeight: 400 }), false);
    assert.equal(slidePaneOverflows({ scrollHeight: 401, clientHeight: 400 }), false);
    assert.equal(slidePaneOverflows({ scrollHeight: 480, clientHeight: 400 }), true);
    assert.equal(slidePaneScrollStep(400), 280);
  });

  it("treats missing Fullscreen API as unsupported so phones can use CSS present", () => {
    assert.equal(nativeFullscreenEnabled({}), false);
    assert.equal(nativeFullscreenEnabled({ fullscreenEnabled: false }), false);
    assert.equal(nativeFullscreenEnabled({ fullscreenEnabled: true }), true);
    assert.equal(nativeFullscreenEnabled({ webkitFullscreenEnabled: true }), true);
    assert.equal(nativeFullscreenElement({}), null);
    assert.equal(
      nativeFullscreenElement({ webkitFullscreenElement: null, fullscreenElement: null }),
      null,
    );
    assert.equal(
      preferNativeFullscreen({
        fullscreenEnabled: true,
        coarsePointer: false,
        viewportWidth: 1280,
        userAgent: "Mozilla/5.0 Macintosh",
      }),
      true,
    );
    assert.equal(
      preferNativeFullscreen({
        fullscreenEnabled: true,
        coarsePointer: true,
        viewportWidth: 1280,
        userAgent: "Mozilla/5.0 Macintosh",
      }),
      false,
    );
    assert.equal(
      preferNativeFullscreen({
        fullscreenEnabled: true,
        coarsePointer: false,
        viewportWidth: 390,
        userAgent: "Mozilla/5.0 Macintosh",
      }),
      false,
    );
    assert.equal(
      preferNativeFullscreen({
        fullscreenEnabled: true,
        coarsePointer: false,
        viewportWidth: 1024,
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      }),
      false,
    );
  });

  it("maps present-mode URLs and history state for Back-to-exit", () => {
    assert.equal(lectureSearchIsPresent(""), false);
    assert.equal(lectureSearchIsPresent("slide=2"), false);
    assert.equal(lectureSearchIsPresent("fullscreen=1"), true);
    assert.equal(lectureSearchIsPresent("?fullscreen=1"), true);
    assert.equal(
      lecturePresentHref({
        href: "https://kambaz.dev/slides/html-and-dom#slide-2",
        slideNumber: 3,
        present: true,
      }),
      "/slides/html-and-dom?fullscreen=1#slide-3",
    );
    assert.equal(
      lecturePresentHref({
        href: "https://kambaz.dev/slides/html-and-dom?fullscreen=1#slide-3",
        slideNumber: 3,
        present: false,
      }),
      "/slides/html-and-dom#slide-3",
    );
    assert.equal(isLecturePresentHistoryState(null), false);
    assert.equal(isLecturePresentHistoryState(LECTURE_PRESENT_STATE), true);
  });

  it("builds a Continue href that keeps presenter mode across decks", () => {
    assert.equal(
      lectureDeckHref({ slug: "creating-a-nextjs-react-application" }),
      "/slides/creating-a-nextjs-react-application#slide-1",
    );
    assert.equal(
      lectureDeckHref({
        slug: "creating-a-nextjs-react-application",
        slideNumber: 1,
        present: true,
      }),
      "/slides/creating-a-nextjs-react-application?fullscreen=1#slide-1",
    );
    assert.equal(isLectureNextUpSlide({ id: "next-up", title: "Example DOM" }), true);
    assert.equal(isLectureNextUpSlide({ id: "next-up", title: "Next: colors" }), true);
    assert.equal(isLectureNextUpSlide({ id: "cascade", title: "Next: colors" }), true);
    assert.equal(
      isLectureNextUpSlide({ id: "recap", title: "Next.js routes recap" }),
      false,
    );
    assert.equal(
      lectureShouldShowContinue({
        slide: { id: "next-up", title: "Next: colors" },
        index: 8,
        last: 8,
        hasNextDeck: true,
      }),
      true,
    );
    assert.equal(
      lectureShouldShowContinue({
        slide: { id: "next-up", title: "Next: A6 deliverables" },
        index: 10,
        last: 10,
        hasNextDeck: false,
      }),
      false,
    );
    assert.equal(
      lectureShouldShowContinue({
        slide: { id: "patterns", title: "Design Patterns" },
        index: 12,
        last: 12,
        hasNextDeck: true,
      }),
      true,
    );
    assert.equal(
      lectureShouldShowContinue({
        slide: { id: "title", title: "GENERATING IMAGES" },
        index: 0,
        last: 8,
        hasNextDeck: true,
      }),
      false,
    );
    const shell = readFileSync(
      join(process.cwd(), "app/slides/_components/LectureDeckShell.tsx"),
      "utf8",
    );
    assert.match(shell, /lectureShouldShowContinue/);
    assert.match(shell, /lectureDeckHref/);
    assert.match(shell, />\s*Continue\s*</);
    assert.match(shell, /present: isPresenting/);
    const css = readFileSync(join(process.cwd(), "app/book/book.css"), "utf8");
    assert.match(css, /\.lecture-slide-continue-link/);
    assert.match(css, /\.lecture-slide-continue-link-hero/);
    const presentMode = readFileSync(
      join(process.cwd(), "lib/lectures/present-mode.ts"),
      "utf8",
    );
    assert.doesNotMatch(presentMode, /webdev\.local/);
  });

  it("turns horizontal swipes into slide steps and ignores vertical pans", () => {
    assert.equal(swipeSlideDelta(200, 100, 80, 110), 1);
    assert.equal(swipeSlideDelta(80, 100, 200, 110), -1);
    assert.equal(swipeSlideDelta(200, 100, 180, 110), 0);
    assert.equal(swipeSlideDelta(200, 100, 80, 220), 0);
    assert.equal(swipeTargetIsInteractive(null), false);
  });

  it("uses authored diagrams instead of Google Slides rasters", () => {
    const expected = {
      "intro-to-web-development": {
        "network-of-networks": "network-of-networks",
        "client-server": "client-server",
        ssr: "ssr",
        csr: "csr",
      },
      "installing-nodejs": {
        "course-stack": "course-stack",
      },
      "creating-a-nextjs-react-application": {
        "react-transform": "react-data-ui",
        "npm-run-dev": "npm-run-dev-mock",
        "browser-parses-dom": "dom-tree",
      },
      "commit-to-github": {
        "create-repo": "github-create-repo-mock",
      },
      "deploying-to-vercel": {
        account: "vercel-login-mock",
        "new-project": "vercel-add-project-mock",
        permissions: "vercel-git-provider-mock",
        "select-repo": "vercel-import-mock",
        deploy: "vercel-deploy-mock",
        congratulations: "vercel-success-mock",
        "share-url": "vercel-dashboard-mock",
        protections: "vercel-protect-mock",
        "disable-auth": "vercel-auth-mock",
      },
      "html-and-dom": {
        "the-dom": "dom-tree",
      },
      "css-box-model": {
        layers: "box-model",
      },
      "youtube-api": {
        credentials: "google-cloud-key-mock",
        enable: "youtube-enable-api-mock",
      },
      "youtube-search": { client: "youtube-search-flow" },
      "youtube-details": { dao: "youtube-save-flow" },
      "chatgpt-api": { project: "openai-project-key-mock" },
      "chatgpt-text": { "roles-code": "openai-roles-flow" },
      "grok-api": { tokens: "grok-token-flow", key: "xai-key-mock" },
    } as const;

    const used = new Set<string>();
    for (const [slug, slides] of Object.entries(expected)) {
      for (const [id, diagram] of Object.entries(slides)) {
        const slide = findSlide(slug, id);
        assert.equal(slide.diagram, diagram);
        assert.equal(
          slide.imageSrc,
          undefined,
          `${slug} ${id} should not attach a PNG figure`,
        );
        assert.ok((LECTURE_DIAGRAM_IDS as readonly string[]).includes(diagram));
        used.add(diagram);
      }
    }

    assert.deepEqual(
      [...LECTURE_DIAGRAM_IDS].sort(),
      [...used].sort(),
      "every diagram id should be wired to a slide",
    );

    for (const deck of listLectureDecks()) {
      for (const slide of deck.slides) {
        if (slide.imageSrc) {
          assert.ok(
            isBookKambazTargetSrc(slide.imageSrc),
            `${deck.slug} ${slide.id} may only use a book Kambaz target PNG, got ${slide.imageSrc}`,
          );
          assert.ok(
            existsSync(join(process.cwd(), "public", slide.imageSrc.replace(/^\//, ""))),
            `${deck.slug} ${slide.id} missing ${slide.imageSrc}`,
          );
        }
        if (slide.diagram) {
          assert.ok(
            (LECTURE_DIAGRAM_IDS as readonly string[]).includes(slide.diagram),
          );
        }
      }
    }
  });

  it("keeps commands and source in code blocks, not bullets", () => {
    const hello = findSlide("installing-nodejs", "hello-js");
    const express = findSlide("installing-nodejs", "express");
    const createApp = findSlide(
      "creating-a-nextjs-react-application",
      "create-next-app",
    );
    const welcome = findSlide(
      "creating-a-nextjs-react-application",
      "welcome-page",
    );
    const git = findSlide("commit-to-github", "from-project");
    const ignore = findSlide("commit-to-github", "gitignore");
    const lab1 = findSlide("html-and-dom", "jsx-lab1");

    assert.match(
      lectureSlideCodeBlocks(hello).map((block) => block.code).join("\n"),
      /console\.log/,
    );
    assert.ok(!authoredSlideBullets(hello).some((row) => row.includes("console.log")));

    const expressCode = lectureSlideCodeBlocks(express)
      .map((block) => block.code)
      .join("\n");
    assert.match(expressCode, /npm install express/);
    assert.match(expressCode, /app\.listen\(4000\)/);
    assert.ok(!authoredSlideBullets(express).some((row) => row.includes("app.listen")));

    assert.equal(createApp.code, "npx create-next-app@latest webdev-client");
    assert.equal(createApp.codeLanguage, "bash");
    assert.match(welcome.code ?? "", /Welcome to Web Dev/);
    assert.equal(welcome.codeFile, "app/page.tsx");
    assert.match(git.code ?? "", /git push -u origin main/);
    assert.ok(!(git.bullets ?? []).some((row) => row.startsWith("`git ")));
    assert.match(ignore.code ?? "", /node_modules\//);
    assert.equal(ignore.codeFile, ".gitignore");
    assert.match(lab1.code ?? "", /wd-lab1/);
    assert.equal(lab1.codeFile, "app/labs/lab1/page.tsx");
  });

  it("marks incremental lecture snippets with added or highlight lines", () => {
    const link = findSlide("creating-a-nextjs-react-application", "link-to-lab1");
    const pancakes = findSlide("lists-and-tables", "pancakes-after");
    const signup = findSlide("kambaz-account", "signup");
    const cssImport = findSlide("css-intro", "import-css");
    const express = findSlide("installing-nodejs", "express");

    assert.deepEqual(link.codeAddedLines, [1, [6, 7]]);
    assert.deepEqual(pancakes.codeAddedLines, [[2, 11]]);
    assert.deepEqual(signup.codeAddedLines, [[21, 24]]);
    assert.deepEqual(cssImport.codeAddedLines, [1]);
    const twPage = findSlide("tailwind-intro", "page");
    const navOffset = findSlide("kambaz-nav-styling", "offset");
    assert.deepEqual(twPage.codeAddedLines, [1, [5, 6]]);
    assert.deepEqual(navOffset.codeAddedLines, [[1, 5]]);
    const server = lectureSlideCodeBlocks(express).find((block) =>
      block.file === "server.js",
    );
    assert.ok(server);
    assert.deepEqual(server.addedLines, [[3, 6]]);
  });
});
