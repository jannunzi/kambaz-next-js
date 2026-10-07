import type { CodeLineMarks } from "@/lib/code-block/lines";

export type { CodeLineMarks, CodeLineRange } from "@/lib/code-block/lines";

export const LECTURE_1_SLUGS = [
  "intro-to-web-development",
  "installing-nodejs",
  "creating-a-nextjs-react-application",
  "commit-to-github",
  "deploying-to-vercel",
] as const;

export const LECTURE_2_SLUGS = [
  "html-and-dom",
  "headings-and-paragraphs",
  "lists-and-tables",
  "web-forms",
  "anchors",
  "single-page-navigation",
] as const;

export const LECTURE_3_SLUGS = [
  "kambaz-overview",
  "kambaz-account",
  "kambaz-dashboard",
  "kambaz-navigation",
  "kambaz-courses",
  "kambaz-modules",
  "kambaz-assignments",
] as const;

export const LECTURE_4_SLUGS = [
  "css-intro",
  "css-colors",
  "css-box-model",
  "css-size-and-position",
  "css-float",
  "css-flex",
  "css-media-queries",
  "css-rotation",
] as const;

export const LECTURE_6_SLUGS = [
  "react-icons",
  "tailwind-intro",
  "tailwind-spacing",
  "tailwind-typography",
  "tailwind-colors",
  "tailwind-responsive",
  "tailwind-filters-and-grid",
] as const;

export const LECTURE_7_SLUGS = [
  "kambaz-styling",
  "kambaz-nav-styling",
  "kambaz-dashboard-styling",
  "kambaz-courses-styling",
  "kambaz-assignments-styling",
  "kambaz-account-styling",
] as const;

/** Chapter 4 decks — events, useState, Context, Zustand, and Kambaz client state (Lab 4 / A4). */
export const CHAPTER_4_SLUGS = [
  "click-events",
  "passing-data-and-functions",
  "usestate-counter",
  "form-state-types",
  "sharing-parent-child",
  "prop-drilling-and-url",
  "react-context",
  "zustand-counter",
  "zustand-todos",
  "use-effect",
  "ch4-check-understanding",
  "kambaz-courses-store",
  "kambaz-dashboard-crud",
  "kambaz-modules-store",
  "kambaz-account-context",
] as const;

/** Chapter 5 decks — Express HTTP, Lab 5 APIs, Next routes, Kambaz server, deploy (Lab 5 / A5). */
export const CHAPTER_5_SLUGS = [
  "http-server",
  "nodemon-es6-routes",
  "lab5-env",
  "path-and-query",
  "remote-objects",
  "remote-arrays",
  "async-http",
  "next-routes",
  "ch5-check-understanding",
  "kambaz-migrate-db",
  "kambaz-account-rest",
  "kambaz-sessions",
  "kambaz-courses-api",
  "deploy-api",
] as const;

/** Chapter 6 decks — local Mongo, Mongoose, Atlas, Kambaz DB (Lab 6 / A6). */
export const CHAPTER_6_SLUGS = [
  "local-mongo",
  "mongoose",
  "mongo-apis",
  "mongo-users-crud",
  "atlas",
  "atlas-compass",
  "atlas-node",
  "atlas-sessions",
  "ch6-check-understanding",
  "kambaz-courses-db",
  "kambaz-modules-db",
  "kambaz-enrollments-db",
] as const;

/** Project-week decks — YouTube, ChatGPT, and Grok APIs (12/7). */
export const PROJECT_SLUGS = [
  "youtube-api",
  "youtube-search",
  "youtube-details",
  "chatgpt-api",
  "chatgpt-text",
  "chatgpt-ui",
  "grok-api",
  "grok-chat",
  "grok-images",
] as const;

/** Chapter 3 decks — JavaScript, data-driven UI, and Kambaz from JSON (Lab 3 / A3). */
export const CHAPTER_3_SLUGS = [
  "intro-to-javascript",
  "variables-and-constants",
  "variable-types",
  "booleans-and-conditionals",
  "null-and-undefined",
  "javascript-functions",
  "javascript-arrays",
  "array-iteration",
  "array-search",
  "reduce-and-json",
  "javascript-objects",
  "spread-and-destructuring",
  "optional-chaining",
  "dynamic-styling",
  "client-and-server",
  "parameterizing-components",
  "path-params-and-todos",
  "kambaz-database",
  "kambaz-dashboard-data",
  "kambaz-courses-data",
  "kambaz-modules-data",
  "kambaz-assignments-data",
] as const;

export const LECTURE_SLUGS = [
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
] as const;

/**
 * Book chapter grouping used by the slides hub and nav.
 * `weeks` is the Canvas module Monday dates for that chapter (not lecture numbers).
 */
export const BOOK_CHAPTERS = [
  {
    chapter: 1,
    href: "/book/ch1",
    title: "Building Next.js User Interfaces with HTML",
    weeks: "9/14, 9/21",
  },
  {
    chapter: 2,
    href: "/book/ch2",
    title: "Styling User Interfaces with CSS and Tailwind",
    weeks: "9/28, 10/5",
  },
  {
    chapter: 3,
    href: "/book/ch3",
    title: "Creating Single Page Applications with JavaScript",
    weeks: "10/12, 10/19",
  },
  {
    chapter: 4,
    href: "/book/ch4",
    title: "Managing Client State",
    weeks: "10/26, 11/2",
  },
  {
    chapter: 5,
    href: "/book/ch5",
    title: "Implementing RESTful Web APIs with Express.js",
    weeks: "11/9, 11/16",
  },
  {
    chapter: 6,
    href: "/book/ch6",
    title: "Integrating React with MongoDB",
    weeks: "11/23, 11/30",
  },
  {
    // Hub grouping for project week — not a book chapter. Book will add
    // real /book/chN + section anchors when the Integrating chapter lands.
    chapter: 7,
    href: "/project",
    title: "Integrating with External APIs",
    weeks: "12/7",
  },
] as const;

/**
 * Topic subgroups within a chapter (Jose’s book spine).
 * Slides: add a row here, then set `topicId` and `bookSectionId` on each new deck.
 * Hub group titles are the book section title + numbering.
 */
export const LECTURE_TOPICS = [
  {
    topicId: "intro",
    chapter: 1,
    title: "Introduction",
    bookSectionId: "intro",
  },
  {
    topicId: "setup",
    chapter: 1,
    title: "1.2 Setting Up the Development Environment",
    bookSectionId: "sec-1-2",
  },
  {
    topicId: "source-control",
    chapter: 1,
    title: "1.5 Committing Code to Source Control",
    bookSectionId: "sec-1-5",
  },
  {
    topicId: "deploy",
    chapter: 1,
    title: "1.6 Deploying Next.js Projects to the Web",
    bookSectionId: "sec-1-6",
  },
  {
    topicId: "html",
    chapter: 1,
    title: "1.3 Introduction to HTML",
    bookSectionId: "sec-1-3",
  },
  {
    topicId: "kambaz-html",
    chapter: 1,
    title: "1.4 Prototyping the React Kambaz User Interface with HTML",
    bookSectionId: "sec-1-4",
  },
  {
    topicId: "css",
    chapter: 2,
    title: "2.1 Styling React Components with CSS",
    bookSectionId: "sec-2-1",
  },
  {
    topicId: "react-icons",
    chapter: 2,
    title: "2.2 Decorating Documents with React Icons",
    bookSectionId: "sec-2-2",
  },
  {
    topicId: "tailwind",
    chapter: 2,
    title: "2.3 Styling Webpages with Tailwind CSS",
    bookSectionId: "sec-2-3",
  },
  {
    topicId: "kambaz-styling",
    chapter: 2,
    title: "2.4 Styling Kambaz with CSS and Tailwind",
    bookSectionId: "sec-2-4",
  },
  {
    topicId: "js-intro",
    chapter: 3,
    title: "3.2 Introduction to JavaScript",
    bookSectionId: "sec-3-2",
  },
  {
    topicId: "js-functions",
    chapter: 3,
    title: "3.3 JavaScript Functions",
    bookSectionId: "sec-3-3",
  },
  {
    topicId: "js-data",
    chapter: 3,
    title: "3.4 JavaScript Data Structures",
    bookSectionId: "sec-3-4",
  },
  {
    topicId: "dynamic-styling",
    chapter: 3,
    title: "3.5 Dynamic Styling",
    bookSectionId: "sec-3-5",
  },
  {
    topicId: "client-server",
    chapter: 3,
    title: "3.6 Client and Server Components",
    bookSectionId: "sec-3-6",
  },
  {
    topicId: "parameterizing",
    chapter: 3,
    title: "3.7 Parameterizing Components",
    bookSectionId: "sec-3-7",
  },
  {
    topicId: "kambaz-data",
    chapter: 3,
    title: "3.9 Implementing a Data Driven Kambaz Application",
    bookSectionId: "sec-3-9",
  },
  {
    topicId: "events-state",
    chapter: 4,
    title: "4.2 Managing State and User Input with Forms",
    bookSectionId: "sec-4-2",
  },
  {
    topicId: "sharing-url",
    chapter: 4,
    title: "4.3 Sharing State, Prop Drilling, and URLs",
    bookSectionId: "sec-4-3",
  },
  {
    topicId: "react-context",
    chapter: 4,
    title: "4.4 React Context",
    bookSectionId: "sec-4-4",
  },
  {
    topicId: "zustand",
    chapter: 4,
    title: "4.5 Zustand",
    bookSectionId: "sec-4-5",
  },
  {
    topicId: "effects",
    chapter: 4,
    title: "4.7 Side Effects with useEffect",
    bookSectionId: "sec-4-7",
  },
  {
    topicId: "ch4-check",
    chapter: 4,
    title: "4.9 Check Your Understanding",
    bookSectionId: "sec-4-9",
  },
  {
    topicId: "kambaz-state",
    chapter: 4,
    title: "4.10 Adding State to the Kambaz User Interface",
    bookSectionId: "sec-4-10",
  },
  {
    topicId: "http-server",
    chapter: 5,
    title: "5.1 Installing and Configuring an HTTP Web Server",
    bookSectionId: "sec-5-1",
  },
  {
    topicId: "lab5-api",
    chapter: 5,
    title: "5.2 Lab Exercises",
    bookSectionId: "sec-5-2",
  },
  {
    topicId: "next-routes",
    chapter: 5,
    title: "5.3 Next.js Server Routes",
    bookSectionId: "sec-5-3",
  },
  {
    topicId: "ch5-check",
    chapter: 5,
    title: "Check Your Understanding",
    bookSectionId: "sec-5-check",
  },
  {
    topicId: "kambaz-server",
    chapter: 5,
    title: "5.4 Implementing the Kambaz Node.js HTTP Server",
    bookSectionId: "sec-5-4",
  },
  {
    topicId: "deploy-api",
    chapter: 5,
    title: "5.5 Deploying to a Public Remote Server",
    bookSectionId: "sec-5-5",
  },
  {
    topicId: "local-mongo",
    chapter: 6,
    title: "6.1 Working with a Local MongoDB Instance",
    bookSectionId: "sec-6-1",
  },
  {
    topicId: "mongoose",
    chapter: 6,
    title: "6.2 Programming with a MongoDB Database",
    bookSectionId: "sec-6-2",
  },
  {
    topicId: "mongo-apis",
    chapter: 6,
    title: "6.2.6 Implementing APIs to Interact with MongoDB",
    bookSectionId: "sec-6-2-6",
  },
  {
    topicId: "atlas",
    chapter: 6,
    title: "6.3 Integrating with MongoDB Hosted in Atlas Cloud Service",
    bookSectionId: "sec-6-3",
  },
  {
    topicId: "ch6-check",
    chapter: 6,
    title: "Check Your Understanding",
    bookSectionId: "sec-6-check",
  },
  {
    topicId: "kambaz-db",
    chapter: 6,
    title: "6.4 Integrating the Kambaz Web Application with a Database",
    bookSectionId: "sec-6-4",
  },
  // Project-week topics only. Do not invent sec-7-* until Book lands anchors.
  {
    topicId: "youtube-api",
    chapter: 7,
    title: "Integrating with the YouTube Video API",
    bookSectionId: undefined,
  },
  {
    topicId: "chatgpt-api",
    chapter: 7,
    title: "Integrating with the ChatGPT API",
    bookSectionId: undefined,
  },
  {
    topicId: "grok-api",
    chapter: 7,
    title: "Integrating with the Grok API",
    bookSectionId: undefined,
  },
] as const;

export type LectureTopicId = (typeof LECTURE_TOPICS)[number]["topicId"];

/** Slide headings stay on one line — keep titles at or under this length. */
export const LECTURE_TITLE_MAX_CHARS = 42;

/** Hub/nav label — book chapters stay `Chapter N`; chapter 7 is Project. */
export function lectureChapterLabel(chapter: number): string {
  return chapter > 6 ? "Project" : `Chapter ${chapter}`;
}

export type LectureSlug = (typeof LECTURE_SLUGS)[number];

export type SlideKind = "title" | "content" | "demo" | "break";

export type LectureSlideDensity = "dense" | "spacious";

export const LECTURE_EMBED_IDS = [
  "user-card",
  "welcome-home",
  "lab1-stub",
  "link-nav",
  "heading-tags",
  "paragraph-tag",
  "list-tags",
  "tables",
  "text-fields",
  "anchors",
  "labs-index",
  "html-skeleton",
  "heading-scale",
  "radio-buttons",
  "file-field",
  "typed-fields",
  "mailto-tel",
  "hash-toc",
  "textarea",
  "checkboxes",
  "dropdowns",
  "alert-button",
  "buttons",
  "labs-layout",
  "kambaz-landing",
  "kambaz-signin",
  "kambaz-signup",
  "kambaz-profile",
  "kambaz-account-nav",
  "kambaz-dashboard",
  "kambaz-navigation",
  "kambaz-courses",
  "kambaz-modules",
  "kambaz-home",
  "kambaz-assignments",
  "kambaz-assignment-editor",
  "css-style-attr",
  "css-import",
  "css-id-selectors",
  "css-class-selectors",
  "css-structure-selectors",
  "css-foreground",
  "css-background",
  "css-borders",
  "css-padding",
  "css-margins",
  "css-box-model",
  "css-corners",
  "css-dimensions",
  "css-display",
  "css-position-relative",
  "css-position-absolute",
  "css-position-fixed",
  "css-zindex",
  "css-float",
  "css-grid-layout",
  "css-flex-row",
  "css-flex-grow",
  "css-flex-width",
  "css-media-queries",
  "css-rotate",
  "css-gradient",
  "react-icons",
  "tw-spacing",
  "tw-typography",
  "tw-backgrounds",
  "tw-filters",
  "tw-flex",
  "tw-grids",
  "tw-responsive-breakpoint",
  "tw-responsive-show-hide",
  "tw-responsive-flex",
  "tw-responsive-grid",
  "tw-responsive-spacing",
  "tw-responsive",
  "kambaz-styled-nav",
  "kambaz-links-nav",
  "kambaz-styled-dashboard",
  "kambaz-styled-course-nav",
  "kambaz-styled-modules",
  "kambaz-styled-home",
  "kambaz-styled-people",
  "kambaz-styled-assignments",
  "kambaz-ch3-dashboard",
  "kambaz-ch3-modules",
  "kambaz-ch3-assignments",
  "kambaz-ch3-people",
  "kambaz-styled-signin",
  "lab3-stub",
  "js-variables",
  "js-variable-types",
  "js-booleans",
  "js-if-else",
  "js-ternary",
  "js-conditional-if-else",
  "js-conditional-inline",
  "js-null-undefined",
  "js-legacy-functions",
  "js-arrow-functions",
  "js-implied-return",
  "js-template-literals",
  "js-simple-arrays",
  "js-array-index",
  "js-array-add-remove",
  "js-for-loops",
  "js-map",
  "js-find",
  "js-find-index",
  "js-filter",
  "js-includes-some-every",
  "js-reduce",
  "js-json-stringify",
  "js-house",
  "js-spreader",
  "js-destructing",
  "js-function-destructing",
  "js-destructing-imports",
  "js-optional-chaining",
  "js-classes",
  "js-styles",
  "js-client-component",
  "js-server-component",
  "js-add",
  "js-square",
  "js-highlight",
  "js-path-parameters",
  "js-todo-list",
  "lab4-stub",
  "click-event",
  "passing-data",
  "passing-functions",
  "counter-broken",
  "counter",
  "boolean-state",
  "string-state",
  "date-state",
  "object-state",
  "array-state",
  "parent-child-state",
  "prop-drilling",
  "url-encoding",
  "context-counter",
  "zustand-counter",
  "zustand-todos",
  "use-effect",
  "kambaz-courses-crud",
  "lab5-env",
  "lab5-hello",
  "lab5-calculator",
  "lab6-status",
  "lab6-todos",
  "lab6-users",
  "youtube-search",
  "youtube-details",
  "youtube-lesson",
  "openai-chat",
  "openai-images",
  "openai-vision",
  "grok-sparkle",
  "grok-modules",
] as const;

export type LectureEmbedId = (typeof LECTURE_EMBED_IDS)[number];

export const LECTURE_DIAGRAM_IDS = [
  "network-of-networks",
  "client-server",
  "ssr",
  "csr",
  "course-stack",
  "react-data-ui",
  "dom-tree",
  "npm-run-dev-mock",
  "github-create-repo-mock",
  "vercel-login-mock",
  "vercel-add-project-mock",
  "vercel-git-provider-mock",
  "vercel-import-mock",
  "vercel-deploy-mock",
  "vercel-success-mock",
  "vercel-dashboard-mock",
  "vercel-protect-mock",
  "vercel-auth-mock",
  "box-model",
  "tailwind-breakpoints",
  "google-cloud-key-mock",
  "youtube-enable-api-mock",
  "youtube-search-flow",
  "youtube-save-flow",
  "openai-project-key-mock",
  "openai-roles-flow",
  "xai-key-mock",
  "grok-token-flow",
] as const;

export type LectureDiagramId = (typeof LECTURE_DIAGRAM_IDS)[number];

export type LectureCodeBlock = {
  code: string;
  language?: string;
  file?: string;
  /** 1-based lines to call out (amber). Same API as the book CodeBlock. */
  highlightLines?: CodeLineMarks;
  /** 1-based lines added vs the prior example (green). */
  addedLines?: CodeLineMarks;
  /** Server-rendered Shiki HTML. Set by `withHighlightedLectureCode`. */
  html?: string;
};

export type LectureSlide = {
  id: string;
  title: string;
  bullets?: string[];
  kind?: SlideKind;
  interactiveHint?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Caption under a book target screenshot (`imageSrc`). */
  imageCaption?: string;
  /** Single snippet. Prefer this (or `codeBlocks`) over putting source in `bullets`. */
  code?: string;
  /** Highlight hint for `code`. Defaults to `tsx` in the shell. */
  codeLanguage?: string;
  /** Optional path shown above `code`, e.g. `app/page.tsx`. */
  codeFile?: string;
  /** `highlightLines` for `code`. */
  codeHighlightLines?: CodeLineMarks;
  /** `addedLines` for `code`. */
  codeAddedLines?: CodeLineMarks;
  /** Extra snippets when a slide needs more than one block. */
  codeBlocks?: LectureCodeBlock[];
  /** Live React demo under the authored slide. Prefer this over a UI screenshot. */
  embed?: LectureEmbedId;
  /** Authored SVG/React figure — not a Google Slides raster. */
  diagram?: LectureDiagramId;
  /**
   * Force dense/spacious type. Default: dense when a diagram or embed is present.
   * Spacious is for text-only slides (larger bullets). Dense stays a step
   * tighter so diagrams/embeds still fit, but does not shrink-to-avoid-scroll.
   */
  density?: LectureSlideDensity;
};

export type LectureHubItem = {
  slug: LectureSlug;
  chapter: number;
  /** Book-spine topic within the chapter, when set. */
  topicId?: LectureTopicId;
  topic?: string;
  /** Book TOC anchor (`intro` or `sec-1-3-1`) when a section mapping exists. */
  bookSectionId?: string;
  /** `/book/chN#sec-…` when a book section exists; `/project` for API week. */
  bookHref: string;
  /** Canvas week mapping — metadata / badge only, not a hub heading. */
  canvasLecture: number;
  title: string;
  summary: string;
  chapterHref: string;
  chapterTitle: string;
  publicUrl: string;
  /** Authored logo card under `/public/lectures/thumbs`. */
  thumbnailSrc: string;
};

export type LectureDeck = LectureHubItem & {
  /** Legacy `LectureSlide` or block-model slides (`lib/lectures/blocks.ts`). */
  slides: LectureSlide[];
};

/** Kept for Canvas sync / tests. The hub groups with `LectureChapterGroup`. */
export type CanvasLectureGroup = {
  canvasLecture: number;
  title: string;
  topic?: string;
  decks: LectureHubItem[];
};

export type LectureTopicGroup = {
  topicId: string;
  title: string;
  bookSectionId?: string;
  bookHref?: string;
  decks: LectureHubItem[];
};

export type LectureChapterGroup = {
  chapter: number;
  href: string;
  title: string;
  /** Canvas module week dates, e.g. `"9/14, 9/21"`. */
  weeks?: string;
  topics: LectureTopicGroup[];
};

export type LectureNavChapter = {
  chapter: number;
  href: string;
  title: string;
};

/**
 * Decks are authored TypeScript — titles, bullets, code, embeds, and SVG
 * diagrams. Index thumbs are branded logo cards, not Google Slides rasters.
 */
export function lectureSlideAssetPath(
  slug: LectureSlug,
  slideNumber: number,
): string {
  return `/lectures/${slug}/slide-${String(slideNumber).padStart(2, "0")}.png`;
}

/** Legacy PNG figure path — do not use for new index cards. */
export function lectureSlideFigurePath(
  slug: LectureSlug,
  slideNumber: number,
): string {
  return `/lectures/${slug}/slide-${String(slideNumber).padStart(2, "0")}-figure.png`;
}

/** Book Kambaz / Canvas target screenshots under `/public/images/book`. */
export const BOOK_KAMBAZ_TARGET_PREFIX = "/images/book/kambaz/";

export function isBookKambazTargetSrc(src: string | undefined): boolean {
  return Boolean(src?.startsWith(BOOK_KAMBAZ_TARGET_PREFIX));
}

/** Authored 16:9 logo card for the slides index. */
export function lectureThumbPath(slug: LectureSlug): string {
  return `/lectures/thumbs/${slug}.svg`;
}

type SlideDensityInput = Pick<
  LectureSlide,
  "density" | "diagram" | "embed" | "imageSrc"
> & {
  id?: string;
  title?: string;
  blocks?: { type: string }[];
};

export function lectureSlideDensity(
  slide: SlideDensityInput,
): LectureSlideDensity {
  if (slide.density) return slide.density;
  if (slide.diagram || slide.embed || slide.imageSrc) return "dense";
  if (slide.blocks?.some((block) => block.type === "component")) return "dense";
  return "spacious";
}

type SlideCodeInput = Pick<
  LectureSlide,
  | "code"
  | "codeLanguage"
  | "codeFile"
  | "codeHighlightLines"
  | "codeAddedLines"
  | "codeBlocks"
> & {
  blocks?: Array<{
    type: string;
    code?: string;
    language?: string;
    file?: string;
    highlightLines?: CodeLineMarks;
    addedLines?: CodeLineMarks;
    html?: string;
  }>;
};

export function lectureSlideCodeBlocks(slide: SlideCodeInput): LectureCodeBlock[] {
  if (slide.blocks) {
    return slide.blocks.flatMap((block) =>
      block.type === "code" && typeof block.code === "string"
        ? [
            {
              code: block.code,
              language: block.language,
              file: block.file,
              highlightLines: block.highlightLines,
              addedLines: block.addedLines,
              html: block.html,
            },
          ]
        : [],
    );
  }
  const blocks: LectureCodeBlock[] = [];
  if (slide.code) {
    blocks.push({
      code: slide.code,
      language: slide.codeLanguage,
      file: slide.codeFile,
      highlightLines: slide.codeHighlightLines,
      addedLines: slide.codeAddedLines,
    });
  }
  if (slide.codeBlocks) {
    blocks.push(...slide.codeBlocks);
  }
  return blocks;
}
