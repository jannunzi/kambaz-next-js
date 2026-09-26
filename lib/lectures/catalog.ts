import { COURSE_SITE_ORIGIN } from "@/lib/course-site/origin";
import { lectureTopics } from "@/app/syllabus/data/topics";
import { ANCHORS_SLIDES } from "./decks/anchors";
import { COMMIT_TO_GITHUB_SLIDES } from "./decks/commit-to-github";
import { CREATING_A_NEXTJS_REACT_APPLICATION_SLIDES } from "./decks/creating-a-nextjs-react-application";
import { DEPLOYING_TO_VERCEL_SLIDES } from "./decks/deploying-to-vercel";
import { HEADINGS_AND_PARAGRAPHS_SLIDES } from "./decks/headings-and-paragraphs";
import { HTML_AND_DOM_SLIDES } from "./decks/html-and-dom";
import { INSTALLING_NODEJS_SLIDES } from "./decks/installing-nodejs";
import { INTRO_TO_WEB_DEVELOPMENT_SLIDES } from "./decks/intro-to-web-development";
import { LISTS_AND_TABLES_SLIDES } from "./decks/lists-and-tables";
import { KAMBAZ_ACCOUNT_SLIDES } from "./decks/kambaz-account";
import { KAMBAZ_ASSIGNMENTS_SLIDES } from "./decks/kambaz-assignments";
import { KAMBAZ_COURSES_SLIDES } from "./decks/kambaz-courses";
import { KAMBAZ_DASHBOARD_SLIDES } from "./decks/kambaz-dashboard";
import { KAMBAZ_MODULES_SLIDES } from "./decks/kambaz-modules";
import { KAMBAZ_NAVIGATION_SLIDES } from "./decks/kambaz-navigation";
import { KAMBAZ_OVERVIEW_SLIDES } from "./decks/kambaz-overview";
import { SINGLE_PAGE_NAVIGATION_SLIDES } from "./decks/single-page-navigation";
import { WEB_FORMS_SLIDES } from "./decks/web-forms";
import { CSS_BOX_MODEL_SLIDES } from "./decks/css-box-model";
import { CSS_COLORS_SLIDES } from "./decks/css-colors";
import { CSS_FLEX_SLIDES } from "./decks/css-flex";
import { CSS_FLOAT_SLIDES } from "./decks/css-float";
import { CSS_INTRO_SLIDES } from "./decks/css-intro";
import { CSS_MEDIA_QUERIES_SLIDES } from "./decks/css-media-queries";
import { CSS_ROTATION_SLIDES } from "./decks/css-rotation";
import { CSS_SIZE_AND_POSITION_SLIDES } from "./decks/css-size-and-position";
import { REACT_ICONS_SLIDES } from "./decks/react-icons";
import { TAILWIND_INTRO_SLIDES } from "./decks/tailwind-intro";
import { TAILWIND_SPACING_SLIDES } from "./decks/tailwind-spacing";
import { TAILWIND_TYPOGRAPHY_SLIDES } from "./decks/tailwind-typography";
import { TAILWIND_COLORS_SLIDES } from "./decks/tailwind-colors";
import { TAILWIND_FLEX_AND_GRID_SLIDES } from "./decks/tailwind-flex-and-grid";
import { TAILWIND_RESPONSIVE_SLIDES } from "./decks/tailwind-responsive";
import { KAMBAZ_STYLING_SLIDES } from "./decks/kambaz-styling";
import { KAMBAZ_NAV_STYLING_SLIDES } from "./decks/kambaz-nav-styling";
import { KAMBAZ_DASHBOARD_STYLING_SLIDES } from "./decks/kambaz-dashboard-styling";
import { KAMBAZ_COURSES_STYLING_SLIDES } from "./decks/kambaz-courses-styling";
import { KAMBAZ_ASSIGNMENTS_STYLING_SLIDES } from "./decks/kambaz-assignments-styling";
import { KAMBAZ_ACCOUNT_STYLING_SLIDES } from "./decks/kambaz-account-styling";
import { INTRO_TO_JAVASCRIPT_SLIDES } from "./decks/intro-to-javascript";
import { VARIABLES_AND_CONSTANTS_SLIDES } from "./decks/variables-and-constants";
import { VARIABLE_TYPES_SLIDES } from "./decks/variable-types";
import { BOOLEANS_AND_CONDITIONALS_SLIDES } from "./decks/booleans-and-conditionals";
import { NULL_AND_UNDEFINED_SLIDES } from "./decks/null-and-undefined";
import { JAVASCRIPT_FUNCTIONS_SLIDES } from "./decks/javascript-functions";
import { JAVASCRIPT_ARRAYS_SLIDES } from "./decks/javascript-arrays";
import { ARRAY_ITERATION_SLIDES } from "./decks/array-iteration";
import { ARRAY_SEARCH_SLIDES } from "./decks/array-search";
import { REDUCE_AND_JSON_SLIDES } from "./decks/reduce-and-json";
import { JAVASCRIPT_OBJECTS_SLIDES } from "./decks/javascript-objects";
import { SPREAD_AND_DESTRUCTURING_SLIDES } from "./decks/spread-and-destructuring";
import { OPTIONAL_CHAINING_SLIDES } from "./decks/optional-chaining";
import { DYNAMIC_STYLING_SLIDES } from "./decks/dynamic-styling";
import { CLIENT_AND_SERVER_SLIDES } from "./decks/client-and-server";
import { PARAMETERIZING_COMPONENTS_SLIDES } from "./decks/parameterizing-components";
import { PATH_PARAMS_AND_TODOS_SLIDES } from "./decks/path-params-and-todos";
import { KAMBAZ_DATABASE_SLIDES } from "./decks/kambaz-database";
import { KAMBAZ_DASHBOARD_DATA_SLIDES } from "./decks/kambaz-dashboard-data";
import { KAMBAZ_COURSES_DATA_SLIDES } from "./decks/kambaz-courses-data";
import { KAMBAZ_MODULES_DATA_SLIDES } from "./decks/kambaz-modules-data";
import { KAMBAZ_ASSIGNMENTS_DATA_SLIDES } from "./decks/kambaz-assignments-data";
import { CLICK_EVENTS_SLIDES } from "./decks/click-events";
import { PASSING_DATA_AND_FUNCTIONS_SLIDES } from "./decks/passing-data-and-functions";
import { USESTATE_COUNTER_SLIDES } from "./decks/usestate-counter";
import { FORM_STATE_TYPES_SLIDES } from "./decks/form-state-types";
import { SHARING_PARENT_CHILD_SLIDES } from "./decks/sharing-parent-child";
import { PROP_DRILLING_AND_URL_SLIDES } from "./decks/prop-drilling-and-url";
import { REACT_CONTEXT_SLIDES } from "./decks/react-context";
import { ZUSTAND_COUNTER_SLIDES } from "./decks/zustand-counter";
import { ZUSTAND_TODOS_SLIDES } from "./decks/zustand-todos";
import { USE_EFFECT_SLIDES } from "./decks/use-effect";
import { CH4_CHECK_UNDERSTANDING_SLIDES } from "./decks/ch4-check-understanding";
import { KAMBAZ_COURSES_STORE_SLIDES } from "./decks/kambaz-courses-store";
import { KAMBAZ_DASHBOARD_CRUD_SLIDES } from "./decks/kambaz-dashboard-crud";
import { KAMBAZ_MODULES_STORE_SLIDES } from "./decks/kambaz-modules-store";
import { KAMBAZ_ACCOUNT_CONTEXT_SLIDES } from "./decks/kambaz-account-context";
import { HTTP_SERVER_SLIDES } from "./decks/http-server";
import { NODEMON_ES6_ROUTES_SLIDES } from "./decks/nodemon-es6-routes";
import { LAB5_ENV_SLIDES } from "./decks/lab5-env";
import { PATH_AND_QUERY_SLIDES } from "./decks/path-and-query";
import { REMOTE_OBJECTS_SLIDES } from "./decks/remote-objects";
import { REMOTE_ARRAYS_SLIDES } from "./decks/remote-arrays";
import { ASYNC_HTTP_SLIDES } from "./decks/async-http";
import { NEXT_ROUTES_SLIDES } from "./decks/next-routes";
import { CH5_CHECK_UNDERSTANDING_SLIDES } from "./decks/ch5-check-understanding";
import { KAMBAZ_MIGRATE_DB_SLIDES } from "./decks/kambaz-migrate-db";
import { KAMBAZ_ACCOUNT_REST_SLIDES } from "./decks/kambaz-account-rest";
import { KAMBAZ_SESSIONS_SLIDES } from "./decks/kambaz-sessions";
import { KAMBAZ_COURSES_API_SLIDES } from "./decks/kambaz-courses-api";
import { DEPLOY_API_SLIDES } from "./decks/deploy-api";
import { LOCAL_MONGO_SLIDES } from "./decks/local-mongo";
import { MONGOOSE_SLIDES } from "./decks/mongoose";
import { MONGO_APIS_SLIDES } from "./decks/mongo-apis";
import { MONGO_USERS_CRUD_SLIDES } from "./decks/mongo-users-crud";
import { ATLAS_SLIDES } from "./decks/atlas";
import { ATLAS_COMPASS_SLIDES } from "./decks/atlas-compass";
import { ATLAS_NODE_SLIDES } from "./decks/atlas-node";
import { ATLAS_SESSIONS_SLIDES } from "./decks/atlas-sessions";
import { CH6_CHECK_UNDERSTANDING_SLIDES } from "./decks/ch6-check-understanding";
import { KAMBAZ_COURSES_DB_SLIDES } from "./decks/kambaz-courses-db";
import { KAMBAZ_MODULES_DB_SLIDES } from "./decks/kambaz-modules-db";
import { KAMBAZ_ENROLLMENTS_DB_SLIDES } from "./decks/kambaz-enrollments-db";
import { YOUTUBE_API_SLIDES } from "./decks/youtube-api";
import { YOUTUBE_SEARCH_SLIDES } from "./decks/youtube-search";
import { YOUTUBE_DETAILS_SLIDES } from "./decks/youtube-details";
import { CHATGPT_API_SLIDES } from "./decks/chatgpt-api";
import { CHATGPT_TEXT_SLIDES } from "./decks/chatgpt-text";
import { CHATGPT_UI_SLIDES } from "./decks/chatgpt-ui";
import { GROK_API_SLIDES } from "./decks/grok-api";
import { GROK_CHAT_SLIDES } from "./decks/grok-chat";
import { GROK_IMAGES_SLIDES } from "./decks/grok-images";
import type { AuthoredSlide } from "./blocks";
import {
  BOOK_CHAPTERS,
  LECTURE_SLUGS,
  LECTURE_TOPICS,
  lectureThumbPath,
  type CanvasLectureGroup,
  type LectureChapterGroup,
  type LectureDeck,
  type LectureHubItem,
  type LectureNavChapter,
  type LectureSlug,
  type LectureTopicGroup,
  type LectureTopicId,
} from "./types";

export { COURSE_SITE_ORIGIN };
export const SLIDES_PATH = "/slides";

export function bookChapterMeta(chapter: number) {
  return (
    BOOK_CHAPTERS.find((entry) => entry.chapter === chapter) ?? BOOK_CHAPTERS[0]
  );
}

export function lectureTopicMeta(topicId: LectureTopicId | undefined) {
  if (!topicId) return undefined;
  return LECTURE_TOPICS.find((entry) => entry.topicId === topicId);
}

export function lectureTopicByBookSection(sectionId: string) {
  return LECTURE_TOPICS.find((entry) => entry.bookSectionId === sectionId);
}

/** `sec-1-3-1` → `1.3.1`; `intro` → `Introduction`. */
export function bookSectionLabel(sectionId: string): string {
  if (sectionId === "intro") return "Introduction";
  if (sectionId.startsWith("sec-")) {
    return sectionId.slice(4).replaceAll("-", ".");
  }
  return sectionId;
}

export function bookHrefForSection(
  chapter: number,
  sectionId?: string,
): string {
  const href = bookChapterMeta(chapter).href;
  // No Integrating chapter in the book yet — do not invent /book/ch7 or #sec-7-*.
  if (!sectionId || href === "/project") return href;
  return `${href}#${sectionId}`;
}

/** Deck chrome label. Project week links to `/project`, not a book chapter. */
export function lectureCompanionLinkLabel(
  chapter: number,
  bookSectionId?: string,
): string {
  if (chapter > 6) return "Open the project";
  if (bookSectionId) return `§${bookSectionLabel(bookSectionId)} in the book`;
  return "Open in the book";
}

export function slidesHref(slug: LectureSlug): string {
  return `${SLIDES_PATH}/${slug}`;
}

const LECTURE_SUMMARIES: Record<
  LectureSlug,
  {
    title: string;
    summary: string;
    chapter: number;
    topicId?: LectureTopicId;
    bookSectionId?: string;
    canvasLecture: number;
    slides: AuthoredSlide[];
  }
> = {
  "intro-to-web-development": {
    title: "Introduction to Web Development",
    summary:
      "Internet vs Web, browsers and URLs, client–server HTTP, framework history, and how we engineer large web apps in teams.",
    chapter: 1,
    topicId: "intro",
    bookSectionId: "intro",
    canvasLecture: 1,
    slides: INTRO_TO_WEB_DEVELOPMENT_SLIDES,
  },
  "installing-nodejs": {
    title: "Installing Node.js",
    summary:
      "Install the Node LTS runtime, confirm node --version, create a course folder, and run hello.js.",
    chapter: 1,
    topicId: "setup",
    bookSectionId: "sec-1-2-1",
    canvasLecture: 1,
    slides: INSTALLING_NODEJS_SLIDES,
  },
  "creating-a-nextjs-react-application": {
    title: "Creating a Next.js React Application",
    summary:
      "Scaffold webdev-client with the App Router, replace the home page, add Lab 1, and link routes.",
    chapter: 1,
    topicId: "setup",
    bookSectionId: "sec-1-2-4",
    canvasLecture: 1,
    slides: CREATING_A_NEXTJS_REACT_APPLICATION_SLIDES,
  },
  "commit-to-github": {
    title: "Commit to GitHub",
    summary:
      "Install Git, keep node_modules out of the repo, create an empty GitHub.com repository, and push main.",
    chapter: 1,
    topicId: "source-control",
    bookSectionId: "sec-1-5",
    canvasLecture: 1,
    slides: COMMIT_TO_GITHUB_SLIDES,
  },
  "deploying-to-vercel": {
    title: "Deploying to Vercel",
    summary:
      "Vercel.com account, import webdev-client from GitHub, Deploy, share the URL, turn off Vercel Authentication.",
    chapter: 1,
    topicId: "deploy",
    bookSectionId: "sec-1-6",
    canvasLecture: 1,
    slides: DEPLOYING_TO_VERCEL_SLIDES,
  },
  "html-and-dom": {
    title: "HTML and the DOM",
    summary:
      "Markup, hello.html, DOCTYPE/html/head/body, comments, whitespace, and the Window → Document DOM tree.",
    chapter: 1,
    topicId: "html",
    bookSectionId: "sec-1-3",
    canvasLecture: 2,
    slides: HTML_AND_DOM_SLIDES,
  },
  "headings-and-paragraphs": {
    title: "Headings and Paragraphs",
    summary:
      "h1–h6 sizes, the Lab 1 wd-h-tag nest, and wrapping text in p (wd-p-2…wd-p-4) so vertical gaps stick.",
    chapter: 1,
    topicId: "html",
    bookSectionId: "sec-1-3-1",
    canvasLecture: 2,
    slides: HEADINGS_AND_PARAGRAPHS_SLIDES,
  },
  "lists-and-tables": {
    title: "Lists and Tables",
    summary:
      "ol vs ul, the pancake recipe, favorite-books ul, and a semantic quiz table (thead/tbody/tfoot/colSpan) — not layout.",
    chapter: 1,
    topicId: "html",
    bookSectionId: "sec-1-3-3",
    canvasLecture: 2,
    slides: LISTS_AND_TABLES_SLIDES,
  },
  "web-forms": {
    title: "Web Forms",
    summary:
      "Labels, text/password/textarea, buttons, file, radio vs checkbox, select one/many, and number/range/email/date.",
    chapter: 1,
    topicId: "html",
    bookSectionId: "sec-1-3-6",
    canvasLecture: 2,
    slides: WEB_FORMS_SLIDES,
  },
  anchors: {
    title: "Anchors",
    summary:
      "href to other documents, mailto: and tel:, and same-page TOC hashes that match an element id.",
    chapter: 1,
    topicId: "html",
    bookSectionId: "sec-1-3-9",
    canvasLecture: 2,
    slides: ANCHORS_SLIDES,
  },
  "single-page-navigation": {
    title: "Single-page Navigation",
    summary:
      "Next.js Link TOC, labs layout children swap, and moving Kambaz into app/(kambaz)/ so it can own /.",
    chapter: 1,
    topicId: "html",
    bookSectionId: "sec-1-3-10",
    canvasLecture: 2,
    slides: SINGLE_PAGE_NAVIGATION_SLIDES,
  },
  "kambaz-overview": {
    title: "Kambaz Overview",
    summary:
      "Route group (kambaz) owns /, a landing page with wd-kambaz, a Labs TOC link, then redirect to Sign in.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-1",
    canvasLecture: 3,
    slides: KAMBAZ_OVERVIEW_SLIDES,
  },
  "kambaz-account": {
    title: "Kambaz Account",
    summary:
      "Sign in, redirects, Profile, Sign up, Account Navigation, and a layout that keeps nav on the left.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-2",
    canvasLecture: 3,
    slides: KAMBAZ_ACCOUNT_SLIDES,
  },
  "kambaz-dashboard": {
    title: "Kambaz Dashboard",
    summary:
      "Dashboard course cards with next/image, at least three published courses, and Sign in → /dashboard.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-3",
    canvasLecture: 3,
    slides: KAMBAZ_DASHBOARD_SLIDES,
  },
  "kambaz-navigation": {
    title: "Kambaz Navigation",
    summary:
      "KambazNavigation sidebar, the (kambaz) layout table, and app/not-found.tsx for Calendar and Inbox.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-3-1",
    canvasLecture: 3,
    slides: KAMBAZ_NAVIGATION_SLIDES,
  },
  "kambaz-courses": {
    title: "Kambaz Courses",
    summary:
      "Course screen at /courses/[cid]/home, Course Navigation sidebar, and await params in the layout.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-4",
    canvasLecture: 3,
    slides: KAMBAZ_COURSES_SLIDES,
  },
  "kambaz-modules": {
    title: "Kambaz Modules",
    summary:
      "Create the Modules nested list, Course Status sidebar, then Home as Modules plus Status.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-5",
    canvasLecture: 3,
    slides: KAMBAZ_MODULES_SLIDES,
  },
  "kambaz-assignments": {
    title: "Kambaz Assignments",
    summary:
      "Create the Assignments list and Assignment Editor — on your own, matching wd-* ids.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-7",
    canvasLecture: 3,
    slides: KAMBAZ_ASSIGNMENTS_SLIDES,
  },
  "css-intro": {
    title: "CSS Intro",
    summary:
      "Style attribute vs imported CSS, tag / id / class / structure selectors, and how the cascade picks a winner.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1",
    canvasLecture: 4,
    slides: CSS_INTRO_SLIDES,
  },
  "css-colors": {
    title: "Colors",
    summary:
      "Foreground color, background color, hex and named values, and stacking wd-fg-* / wd-bg-* classes.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1-7",
    canvasLecture: 4,
    slides: CSS_COLORS_SLIDES,
  },
  "css-box-model": {
    title: "Box Model",
    summary:
      "Border, padding, margin, content-box vs border-box, and border-radius — the four layers of every box.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1-10",
    canvasLecture: 4,
    slides: CSS_BOX_MODEL_SLIDES,
  },
  "css-size-and-position": {
    title: "Size and Position",
    summary:
      "Width and height, display, then relative, absolute, fixed, and z-index from Lab 2 Positions.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1-12",
    canvasLecture: 4,
    slides: CSS_SIZE_AND_POSITION_SLIDES,
  },
  "css-media-queries": {
    title: "Media Queries",
    summary:
      "Lab 2 @media breakpoints that restyle a demo at 750, 1000, and 1250 — CSS first, utilities later.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1-20",
    canvasLecture: 4,
    slides: CSS_MEDIA_QUERIES_SLIDES,
  },
  "css-float": {
    title: "Float",
    summary:
      "float left/right, clear both, and percentage columns that fake a grid before flex.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1-17",
    canvasLecture: 4,
    slides: CSS_FLOAT_SLIDES,
  },
  "css-flex": {
    title: "Flex",
    summary:
      "display:flex rows, flex-grow for leftover space, and a pinned column from Lab 2 Flex.tsx.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1-19",
    canvasLecture: 4,
    slides: CSS_FLEX_SLIDES,
  },
  "css-rotation": {
    title: "Rotation and Gradients",
    summary:
      "Optional extras: transform rotate plus linear and radial gradients. Not required for Lab 2.",
    chapter: 2,
    topicId: "css",
    canvasLecture: 4,
    slides: CSS_ROTATION_SLIDES,
  },
  "react-icons": {
    title: "React Icons",
    summary:
      "Install react-icons, import families as components, and size them with className — §2.2 sampler.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "react-icons",
    bookSectionId: "sec-2-2",
    slides: REACT_ICONS_SLIDES,
  },
  "tailwind-intro": {
    title: "Tailwind Intro",
    summary:
      "Utility-first mental model, Preflight vs scoped import, and the Lab 2 /tailwind route.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "tailwind",
    bookSectionId: "sec-2-3",
    slides: TAILWIND_INTRO_SLIDES,
  },
  "tailwind-spacing": {
    title: "Tailwind Spacing",
    summary:
      "m-* and p-* with direction letters from TailwindSpacing — §2.3.1.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "tailwind",
    bookSectionId: "sec-2-3-1",
    slides: TAILWIND_SPACING_SLIDES,
  },
  "tailwind-typography": {
    title: "Tailwind Typography",
    summary:
      "text-* sizes and font-* weights from TailwindTypography — §2.3.2.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "tailwind",
    bookSectionId: "sec-2-3-2",
    slides: TAILWIND_TYPOGRAPHY_SLIDES,
  },
  "tailwind-colors": {
    title: "Tailwind Colors",
    summary:
      "bg-{color}-{shade} bands from TailwindBackgroundColors — §2.3.3.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "tailwind",
    bookSectionId: "sec-2-3-3",
    slides: TAILWIND_COLORS_SLIDES,
  },
  "tailwind-flex-and-grid": {
    title: "Tailwind Filters and Grid",
    summary:
      "blur utilities, then grid-cols / col-span — §2.3.5 and §2.3.6. A flex-class map follows.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "tailwind",
    bookSectionId: "sec-2-3-6",
    slides: TAILWIND_FLEX_AND_GRID_SLIDES,
  },
  "tailwind-responsive": {
    title: "Tailwind Responsive",
    summary:
      "Mobile-first md: prefixes on the Lab 2 card — stacked on phones, row at md — §2.3.4.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "tailwind",
    bookSectionId: "sec-2-3-4",
    slides: TAILWIND_RESPONSIVE_SLIDES,
  },
  "kambaz-styling": {
    title: "Kambaz Styling",
    summary:
      "Wire theme + utilities (no Preflight), kambaz.css, and a table-free Kambaz layout.",
    chapter: 2,
    canvasLecture: 7,
    topicId: "kambaz-styling",
    bookSectionId: "sec-2-4",
    slides: KAMBAZ_STYLING_SLIDES,
  },
  "kambaz-nav-styling": {
    title: "Kambaz Nav Styling",
    summary:
      "Fixed 120px icon sidebar, React Icons tiles, and wd-main-content-offset — §2.4.1.",
    chapter: 2,
    canvasLecture: 7,
    topicId: "kambaz-styling",
    bookSectionId: "sec-2-4-1",
    slides: KAMBAZ_NAV_STYLING_SLIDES,
  },
  "kambaz-dashboard-styling": {
    title: "Dashboard Styling",
    summary:
      "CourseCard borders and a 1/2/3/4-column responsive grid — §2.4.2.",
    chapter: 2,
    canvasLecture: 7,
    topicId: "kambaz-styling",
    bookSectionId: "sec-2-4-2",
    slides: KAMBAZ_DASHBOARD_STYLING_SLIDES,
  },
  "kambaz-courses-styling": {
    title: "Courses Chrome",
    summary:
      "Course Navigation via kambaz.css list-group, Modules, Home flex, and hide-order — §2.4.3–2.4.5.",
    chapter: 2,
    canvasLecture: 7,
    topicId: "kambaz-styling",
    bookSectionId: "sec-2-4-3",
    slides: KAMBAZ_COURSES_STYLING_SLIDES,
  },
  "kambaz-assignments-styling": {
    title: "People and Assignments",
    summary:
      "People table utilities, AssignmentItem rows, and the On-your-own editor — §2.4.6–2.4.8.",
    chapter: 2,
    canvasLecture: 7,
    topicId: "kambaz-styling",
    bookSectionId: "sec-2-4-6",
    slides: KAMBAZ_ASSIGNMENTS_STYLING_SLIDES,
  },
  "kambaz-account-styling": {
    title: "Account Styling",
    summary:
      "Sign in form utilities as the template for Sign up, Profile, and Account Nav — §2.4.9.",
    chapter: 2,
    canvasLecture: 7,
    topicId: "kambaz-styling",
    bookSectionId: "sec-2-4-9",
    slides: KAMBAZ_ACCOUNT_STYLING_SLIDES,
  },
  "intro-to-javascript": {
    title: "Introduction to JavaScript",
    summary:
      "Why JS belongs in the page, ECMAScript vs TypeScript, and a Lab 3 stub you grow one component at a time.",
    chapter: 3,
    topicId: "js-intro",
    bookSectionId: "sec-3-2",
    canvasLecture: 8,
    slides: INTRO_TO_JAVASCRIPT_SLIDES,
  },
  "variables-and-constants": {
    title: "Variables and Constants",
    summary:
      "var vs let vs const, interpolating values in JSX, and the first Lab 3 VariablesAndConstants component.",
    chapter: 3,
    topicId: "js-intro",
    bookSectionId: "sec-3-2-1",
    canvasLecture: 8,
    slides: VARIABLES_AND_CONSTANTS_SLIDES,
  },
  "variable-types": {
    title: "Variable Types",
    summary:
      "number, string, boolean, typeof, and why a bare boolean is invisible in JSX until you coerce it.",
    chapter: 3,
    topicId: "js-intro",
    bookSectionId: "sec-3-2-2",
    canvasLecture: 8,
    slides: VARIABLE_TYPES_SLIDES,
  },
  "booleans-and-conditionals": {
    title: "Booleans and Conditionals",
    summary:
      "&& || ! and ===, then if/else, the ternary, and two ways to render a welcome vs login heading.",
    chapter: 3,
    topicId: "js-intro",
    bookSectionId: "sec-3-2-3",
    canvasLecture: 8,
    slides: BOOLEANS_AND_CONDITIONALS_SLIDES,
  },
  "null-and-undefined": {
    title: "Null and Undefined",
    summary:
      "Assigned empty (null) vs never assigned (undefined), typeof quirks, and String() so they print.",
    chapter: 3,
    topicId: "js-intro",
    bookSectionId: "sec-3-2-7",
    canvasLecture: 8,
    slides: NULL_AND_UNDEFINED_SLIDES,
  },
  "javascript-functions": {
    title: "JavaScript Functions",
    summary:
      "Legacy function add, ES6 arrows, implied return, and template literals with ${} and a ternary.",
    chapter: 3,
    topicId: "js-functions",
    bookSectionId: "sec-3-3",
    canvasLecture: 8,
    slides: JAVASCRIPT_FUNCTIONS_SLIDES,
  },
  "javascript-arrays": {
    title: "JavaScript Arrays",
    summary:
      "Gather values, print them in JSX, then length, indexOf, push, and splice — §3.4–3.4.2.",
    chapter: 3,
    topicId: "js-data",
    bookSectionId: "sec-3-4",
    canvasLecture: 8,
    slides: JAVASCRIPT_ARRAYS_SLIDES,
  },
  "array-iteration": {
    title: "Array Iteration",
    summary:
      "A for loop builds a second array; map returns one — including a todo list of li — §3.4.3–3.4.4.",
    chapter: 3,
    topicId: "js-data",
    bookSectionId: "sec-3-4-3",
    canvasLecture: 8,
    slides: ARRAY_ITERATION_SLIDES,
  },
  "array-search": {
    title: "Array Search",
    summary:
      "find, findIndex, filter, then includes / some / every — the questions Kambaz asks of JSON.",
    chapter: 3,
    topicId: "js-data",
    bookSectionId: "sec-3-4-5",
    canvasLecture: 8,
    slides: ARRAY_SEARCH_SLIDES,
  },
  "reduce-and-json": {
    title: "Reduce and JSON",
    summary:
      "reduce folds an array to one value; JSON.stringify puts brackets and commas back on the page.",
    chapter: 3,
    topicId: "js-data",
    bookSectionId: "sec-3-4-9",
    canvasLecture: 8,
    slides: REDUCE_AND_JSON_SLIDES,
  },
  "javascript-objects": {
    title: "JavaScript Objects",
    summary:
      "A nested house object, pretty-printed JSON, and console.log in DevTools — §3.4.11–3.4.12.",
    chapter: 3,
    topicId: "js-data",
    bookSectionId: "sec-3-4-11",
    canvasLecture: 8,
    slides: JAVASCRIPT_OBJECTS_SLIDES,
  },
  "spread-and-destructuring": {
    title: "Spread and Destructuring",
    summary:
      "Spread copies (last write wins); destructing unpacks objects, arrays, props, and imports.",
    chapter: 3,
    topicId: "js-data",
    bookSectionId: "sec-3-4-13",
    canvasLecture: 8,
    slides: SPREAD_AND_DESTRUCTURING_SLIDES,
  },
  "optional-chaining": {
    title: "Optional Chaining",
    summary:
      "?. stops at missing; ?? fills a default only for null or undefined — §3.4.17.",
    chapter: 3,
    topicId: "js-data",
    bookSectionId: "sec-3-4-17",
    canvasLecture: 8,
    slides: OPTIONAL_CHAINING_SLIDES,
  },
  "dynamic-styling": {
    title: "Dynamic Styling",
    summary:
      "Build className from a variable or ternary, then apply camelCase style objects — §3.5.",
    chapter: 3,
    topicId: "dynamic-styling",
    bookSectionId: "sec-3-5",
    canvasLecture: 8,
    slides: DYNAMIC_STYLING_SLIDES,
  },
  "client-and-server": {
    title: "Client and Server",
    summary:
      "\"use client\" for usePathname; omit it to read process and fs on the server — §3.6.",
    chapter: 3,
    topicId: "client-server",
    bookSectionId: "sec-3-6",
    canvasLecture: 8,
    slides: CLIENT_AND_SERVER_SLIDES,
  },
  "parameterizing-components": {
    title: "Parameterizing Components",
    summary:
      "Destructure props on Add, then children on Square and Highlight — §3.7–3.7.1.",
    chapter: 3,
    topicId: "parameterizing",
    bookSectionId: "sec-3-7",
    canvasLecture: 8,
    slides: PARAMETERIZING_COMPONENTS_SLIDES,
  },
  "path-params-and-todos": {
    title: "Path Parameters and Todos",
    summary:
      "usePathname on the Labs TOC, [a]/[b] path params, then map todos.json — §3.7.2–3.7.4.",
    chapter: 3,
    topicId: "parameterizing",
    bookSectionId: "sec-3-7-2",
    canvasLecture: 8,
    slides: PATH_PARAMS_AND_TODOS_SLIDES,
  },
  "kambaz-database": {
    title: "Kambaz Database",
    summary:
      "Map Kambaz Navigation from LINKS, then collect courses and related JSON under database/.",
    chapter: 3,
    topicId: "kambaz-data",
    bookSectionId: "sec-3-9",
    canvasLecture: 9,
    slides: KAMBAZ_DATABASE_SLIDES,
  },
  "kambaz-dashboard-data": {
    title: "Dashboard from Data",
    summary:
      "Map db.courses onto CourseCard, key by _id, and encode the course in the card href — §3.9.3.",
    chapter: 3,
    topicId: "kambaz-data",
    bookSectionId: "sec-3-9-3",
    canvasLecture: 9,
    slides: KAMBAZ_DASHBOARD_DATA_SLIDES,
  },
  "kambaz-courses-data": {
    title: "Courses from Data",
    summary:
      "Await [cid], find the course, map course nav, and breadcrumb the last segment — §3.9.4–3.9.6.",
    chapter: 3,
    topicId: "kambaz-data",
    bookSectionId: "sec-3-9-4",
    canvasLecture: 9,
    slides: KAMBAZ_COURSES_DATA_SLIDES,
  },
  "kambaz-modules-data": {
    title: "Modules from Data",
    summary:
      "Filter modules by cid, map Module and Lesson with keys, optional-chain lessons — §3.9.7.",
    chapter: 3,
    topicId: "kambaz-data",
    bookSectionId: "sec-3-9-7",
    canvasLecture: 9,
    slides: KAMBAZ_MODULES_DATA_SLIDES,
  },
  "kambaz-assignments-data": {
    title: "Assignments and People",
    summary:
      "Filter assignments, find the editor row, then join users to enrollments with some — §3.9.8–3.9.9.",
    chapter: 3,
    topicId: "kambaz-data",
    bookSectionId: "sec-3-9-8",
    canvasLecture: 9,
    slides: KAMBAZ_ASSIGNMENTS_DATA_SLIDES,
  },
  "click-events": {
    title: "Click Events",
    summary:
      "Lab 4 starts with \"use client\". onClick takes a function reference — parentheses fire during render.",
    chapter: 4,
    topicId: "events-state",
    bookSectionId: "sec-4-2-1",
    canvasLecture: 10,
    slides: CLICK_EVENTS_SLIDES,
  },
  "passing-data-and-functions": {
    title: "Passing Data and Functions",
    summary:
      "Wrap a call in an arrow to pass an argument. Pass a parent function as a prop the child invokes on click.",
    chapter: 4,
    topicId: "events-state",
    bookSectionId: "sec-4-2-2",
    canvasLecture: 10,
    slides: PASSING_DATA_AND_FUNCTIONS_SLIDES,
  },
  "usestate-counter": {
    title: "useState and the Counter",
    summary:
      "A let stays at 7. useState returns a pair; the setter queues a render so the heading moves.",
    chapter: 4,
    topicId: "events-state",
    bookSectionId: "sec-4-2-4",
    canvasLecture: 10,
    slides: USESTATE_COUNTER_SLIDES,
  },
  "form-state-types": {
    title: "Form State Types",
    summary:
      "Boolean checked, string and date value/onChange, then spread objects and copy arrays — §4.2.5–4.2.9.",
    chapter: 4,
    topicId: "events-state",
    bookSectionId: "sec-4-2-5",
    canvasLecture: 10,
    slides: FORM_STATE_TYPES_SLIDES,
  },
  "sharing-parent-child": {
    title: "Sharing Parent and Child",
    summary:
      "Lift the counter to a parent and pass the value plus setter so the child can increment it.",
    chapter: 4,
    topicId: "sharing-url",
    bookSectionId: "sec-4-3-1",
    canvasLecture: 11,
    slides: SHARING_PARENT_CHILD_SLIDES,
  },
  "prop-drilling-and-url": {
    title: "Prop Drilling and URLs",
    summary:
      "A middle component that only forwards props is drilling. Query and path parameters carry the next page.",
    chapter: 4,
    topicId: "sharing-url",
    bookSectionId: "sec-4-3-2",
    canvasLecture: 11,
    slides: PROP_DRILLING_AND_URL_SLIDES,
  },
  "react-context": {
    title: "React Context",
    summary:
      "A provider publishes a stable value. Right for who is signed in; wrong for lists every keystroke rewrites.",
    chapter: 4,
    topicId: "react-context",
    bookSectionId: "sec-4-4",
    canvasLecture: 11,
    slides: REACT_CONTEXT_SLIDES,
  },
  "zustand-counter": {
    title: "Zustand Counter",
    summary:
      "create() returns a hook — no Provider. Select count, up, and down so only that field rerenders.",
    chapter: 4,
    topicId: "zustand",
    bookSectionId: "sec-4-5-1",
    canvasLecture: 12,
    slides: ZUSTAND_COUNTER_SLIDES,
  },
  "zustand-todos": {
    title: "Zustand Todo List",
    summary:
      "Array plus a draft in the store. Form and item call the hook — add, update, and delete without props.",
    chapter: 4,
    topicId: "zustand",
    bookSectionId: "sec-4-5-2",
    canvasLecture: 12,
    slides: ZUSTAND_TODOS_SLIDES,
  },
  "use-effect": {
    title: "Side Effects with useEffect",
    summary:
      "Render computes JSX. useEffect runs after paint. The dependency array says when the title updates.",
    chapter: 4,
    topicId: "effects",
    bookSectionId: "sec-4-7",
    canvasLecture: 13,
    slides: USE_EFFECT_SLIDES,
  },
  "ch4-check-understanding": {
    title: "Check Your Understanding",
    summary:
      "A 10-item self-check on events, useState, Context, Zustand, and useEffect before stateful Kambaz — §4.9.",
    chapter: 4,
    topicId: "ch4-check",
    bookSectionId: "sec-4-9",
    canvasLecture: 13,
    slides: CH4_CHECK_UNDERSTANDING_SLIDES,
  },
  "kambaz-courses-store": {
    title: "A Courses Store",
    summary:
      "Dashboard useState alone would not name a new course on Home. Zustand holds the published list — §4.10.1.",
    chapter: 4,
    topicId: "kambaz-state",
    bookSectionId: "sec-4-10-1",
    canvasLecture: 14,
    slides: KAMBAZ_COURSES_STORE_SLIDES,
  },
  "kambaz-dashboard-crud": {
    title: "Dashboard Create, Edit, Delete",
    summary:
      "Select the store, keep a local form draft, Add a copy, Delete with preventDefault, Edit then Update.",
    chapter: 4,
    topicId: "kambaz-state",
    bookSectionId: "sec-4-10-2",
    canvasLecture: 14,
    slides: KAMBAZ_DASHBOARD_CRUD_SLIDES,
  },
  "kambaz-modules-store": {
    title: "A Modules Store",
    summary:
      "A controlled ModuleEditor dialog, then modulesStore so Home sees the same array as Modules — §4.10.4.",
    chapter: 4,
    topicId: "kambaz-state",
    bookSectionId: "sec-4-10-4",
    canvasLecture: 15,
    slides: KAMBAZ_MODULES_STORE_SLIDES,
  },
  "kambaz-account-context": {
    title: "Account Context",
    summary:
      "AccountProvider around the Kambaz layout. Sign in writes currentUser; Profile and Account Nav read it.",
    chapter: 4,
    topicId: "kambaz-state",
    bookSectionId: "sec-4-10-5",
    canvasLecture: 15,
    slides: KAMBAZ_ACCOUNT_CONTEXT_SLIDES,
  },
  "http-server": {
    title: "HTTP Server",
    summary:
      "Sibling webdev-server, Hello.js, and Express GET /hello on port 4000 — §5.1.",
    chapter: 5,
    topicId: "http-server",
    bookSectionId: "sec-5-1",
    canvasLecture: 16,
    slides: HTTP_SERVER_SLIDES,
  },
  "nodemon-es6-routes": {
    title: "Nodemon, ES6, and Routes",
    summary:
      "Nodemon, \"type\": \"module\", npm scripts, then Hello(app) extracted from index.js — §5.1.6–5.1.8.",
    chapter: 5,
    topicId: "http-server",
    bookSectionId: "sec-5-1-6",
    canvasLecture: 16,
    slides: NODEMON_ES6_ROUTES_SLIDES,
  },
  "lab5-env": {
    title: "Lab 5 Environment",
    summary:
      "Two terminals, /lab5/welcome, NEXT_PUBLIC_HTTP_SERVER, and httpServer() — §5.2.1.",
    chapter: 5,
    topicId: "lab5-api",
    bookSectionId: "sec-5-2-1",
    canvasLecture: 17,
    slides: LAB5_ENV_SLIDES,
  },
  "path-and-query": {
    title: "Path and Query Parameters",
    summary:
      "req.params vs req.query, .toString() on results, then multiply and divide on your own — §5.2.2.",
    chapter: 5,
    topicId: "lab5-api",
    bookSectionId: "sec-5-2-2",
    canvasLecture: 17,
    slides: PATH_AND_QUERY_SLIDES,
  },
  "remote-objects": {
    title: "Remote Objects",
    summary:
      "res.json an assignment, GET a property, then mutate title from the path — §5.2.3.",
    chapter: 5,
    topicId: "lab5-api",
    bookSectionId: "sec-5-2-3",
    canvasLecture: 17,
    slides: REMOTE_OBJECTS_SLIDES,
  },
  "remote-arrays": {
    title: "Remote Arrays",
    summary:
      "CRUD on /lab5/todos — get all, get by id, then create and delete via GET first — §5.2.4.",
    chapter: 5,
    topicId: "lab5-api",
    bookSectionId: "sec-5-2-4",
    canvasLecture: 18,
    slides: REMOTE_ARRAYS_SLIDES,
  },
  "async-http": {
    title: "Async HTTP and JSON",
    summary:
      "axios, CORS, a client library, express.json(), then POST / PUT / DELETE — §5.2.5–5.2.6.",
    chapter: 5,
    topicId: "lab5-api",
    bookSectionId: "sec-5-2-5",
    canvasLecture: 18,
    slides: ASYNC_HTTP_SLIDES,
  },
  "next-routes": {
    title: "Next.js Server Routes",
    summary:
      "Same-origin /api/lab5/hello and a calculator Route Handler — not a replacement for Express — §5.3.",
    chapter: 5,
    topicId: "next-routes",
    bookSectionId: "sec-5-3",
    canvasLecture: 18,
    slides: NEXT_ROUTES_SLIDES,
  },
  "ch5-check-understanding": {
    title: "Check Your Understanding",
    summary:
      "A 10-item self-check on Express setup, CORS, axios, and the Next.js calculator — §5-check.",
    chapter: 5,
    topicId: "ch5-check",
    bookSectionId: "sec-5-check",
    canvasLecture: 18,
    slides: CH5_CHECK_UNDERSTANDING_SLIDES,
  },
  "kambaz-migrate-db": {
    title: "Migrating the Database",
    summary:
      "Copy Chapter 3 JSON into Kambaz/Database as export default modules — §5.4.1.",
    chapter: 5,
    topicId: "kambaz-server",
    bookSectionId: "sec-5-4-1",
    canvasLecture: 19,
    slides: KAMBAZ_MIGRATE_DB_SLIDES,
  },
  "kambaz-account-rest": {
    title: "Account REST APIs",
    summary:
      "Users DAO, POST signin/signup/profile/signout, axios, and setCurrentUser — §5.4.2.",
    chapter: 5,
    topicId: "kambaz-server",
    bookSectionId: "sec-5-4-2",
    canvasLecture: 19,
    slides: KAMBAZ_ACCOUNT_REST_SLIDES,
  },
  "kambaz-sessions": {
    title: "Sessions and Axios",
    summary:
      "express-session, CORS credentials, req.session.currentUser, and axios withCredentials — §5.4.3.",
    chapter: 5,
    topicId: "kambaz-server",
    bookSectionId: "sec-5-4-3",
    canvasLecture: 19,
    slides: KAMBAZ_SESSIONS_SLIDES,
  },
  "kambaz-courses-api": {
    title: "Courses API",
    summary:
      "Courses DAO, GET enrolled courses, POST that enrolls the creator, modules on your own — §5.4.5.",
    chapter: 5,
    topicId: "kambaz-server",
    bookSectionId: "sec-5-4-5",
    canvasLecture: 19,
    slides: KAMBAZ_COURSES_API_SLIDES,
  },
  "deploy-api": {
    title: "Deploy the API",
    summary:
      "Second GitHub repo, Render npm start, then Vercel NEXT_PUBLIC_HTTP_SERVER — §5.5.",
    chapter: 5,
    topicId: "deploy-api",
    bookSectionId: "sec-5-5",
    canvasLecture: 20,
    slides: DEPLOY_API_SLIDES,
  },
  "local-mongo": {
    title: "Local MongoDB",
    summary:
      "Install Community, Compass on 27017, create kambaz, then import the five JSON files — §6.1.",
    chapter: 6,
    topicId: "local-mongo",
    bookSectionId: "sec-6-1",
    canvasLecture: 21,
    slides: LOCAL_MONGO_SLIDES,
  },
  mongoose: {
    title: "Mongoose",
    summary:
      "Install mongoose, connect from env, User schema and model, then a promise DAO — §6.2.1–6.2.5.",
    chapter: 6,
    topicId: "mongoose",
    bookSectionId: "sec-6-2",
    canvasLecture: 22,
    slides: MONGOOSE_SLIDES,
  },
  "mongo-apis": {
    title: "Mongo APIs",
    summary:
      "async account routes, GET /api/users, PeopleTable, and an ADMIN Users screen — §6.2.6.1–6.2.6.2.",
    chapter: 6,
    topicId: "mongo-apis",
    bookSectionId: "sec-6-2-6",
    canvasLecture: 22,
    slides: MONGO_APIS_SLIDES,
  },
  "mongo-users-crud": {
    title: "User CRUD",
    summary:
      "Filter by role and name, findById, then delete, $set update, and create — §6.2.6.3–6.2.6.7.",
    chapter: 6,
    topicId: "mongo-apis",
    bookSectionId: "sec-6-2-6-3",
    canvasLecture: 22,
    slides: MONGO_USERS_CRUD_SLIDES,
  },
  atlas: {
    title: "Integrating with Atlas",
    summary:
      "Why Render cannot use 127.0.0.1, then a free Kambaz cluster and database user — §6.3–6.3.1.",
    chapter: 6,
    topicId: "atlas",
    bookSectionId: "sec-6-3",
    canvasLecture: 23,
    slides: ATLAS_SLIDES,
  },
  "atlas-compass": {
    title: "Atlas Compass",
    summary:
      "Paste the Compass mongodb+srv string, create kambaz, import the five JSON files — §6.3.1.1.",
    chapter: 6,
    topicId: "atlas",
    bookSectionId: "sec-6-3-1-1",
    canvasLecture: 23,
    slides: ATLAS_COMPASS_SLIDES,
  },
  "atlas-node": {
    title: "Atlas from Node.js",
    summary:
      "0.0.0.0/0, Drivers URI with /kambaz?, new Render service, Vercel origin — §6.3.1.2.",
    chapter: 6,
    topicId: "atlas",
    bookSectionId: "sec-6-3-1-2",
    canvasLecture: 23,
    slides: ATLAS_NODE_SLIDES,
  },
  "atlas-sessions": {
    title: "Atlas Remote Sessions",
    summary:
      "Five Render keys, secure cookies, then sign in so 12/7 graders read Atlas — §6.3.2.",
    chapter: 6,
    topicId: "atlas",
    bookSectionId: "sec-6-3-2",
    canvasLecture: 23,
    slides: ATLAS_SESSIONS_SLIDES,
  },
  "ch6-check-understanding": {
    title: "Check Your Understanding",
    summary:
      "A 10-item self-check on schemas, DAOs, async routes, and Atlas — §6-check.",
    chapter: 6,
    topicId: "ch6-check",
    bookSectionId: "sec-6-check",
    canvasLecture: 23,
    slides: CH6_CHECK_UNDERSTANDING_SLIDES,
  },
  "kambaz-courses-db": {
    title: "Kambaz Courses DB",
    summary:
      "Course schema and model, then find / create / delete / update on Mongo — §6.4.1.",
    chapter: 6,
    topicId: "kambaz-db",
    bookSectionId: "sec-6-4-1",
    canvasLecture: 24,
    slides: KAMBAZ_COURSES_DB_SLIDES,
  },
  "kambaz-modules-db": {
    title: "Kambaz Modules 1:N",
    summary:
      "One course, many modules — collection plus course foreign key, then CRUD — §6.4.2.",
    chapter: 6,
    topicId: "kambaz-db",
    bookSectionId: "sec-6-4-2",
    canvasLecture: 24,
    slides: KAMBAZ_MODULES_DB_SLIDES,
  },
  "kambaz-enrollments-db": {
    title: "Kambaz Enrollments M:N",
    summary:
      "Mapping collection, populate, deleteMany, enroll / unenroll, course People — §6.4.3.",
    chapter: 6,
    topicId: "kambaz-db",
    bookSectionId: "sec-6-4-3",
    canvasLecture: 24,
    slides: KAMBAZ_ENROLLMENTS_DB_SLIDES,
  },
  "youtube-api": {
    title: "YouTube Data API Key",
    summary:
      "Jose’s API / API Key sequence: Cloud project, credentials, .env, enable Data API v3 — no live keys.",
    chapter: 7,
    topicId: "youtube-api",
    canvasLecture: 25,
    slides: YOUTUBE_API_SLIDES,
  },
  "youtube-search": {
    title: "YouTube Search",
    summary:
      "SEARCH SCREEN: q/key/part, sample items, course nav, axios client, then cards.",
    chapter: 7,
    topicId: "youtube-api",
    canvasLecture: 25,
    slides: YOUTUBE_SEARCH_SLIDES,
  },
  "youtube-details": {
    title: "YouTube Details",
    summary:
      "DETAILS SCREEN, encode ?search=, VIDEO LESSONS, then STORE VIDEOS IN DB.",
    chapter: 7,
    topicId: "youtube-api",
    canvasLecture: 25,
    slides: YOUTUBE_DETAILS_SLIDES,
  },
  "chatgpt-api": {
    title: "ChatGPT SDK and Tokens",
    summary:
      "GPT-4, tokens, prompt strategies, CONFIGURING OPENAI, then Hello World responses.create.",
    chapter: 7,
    topicId: "chatgpt-api",
    canvasLecture: 25,
    slides: CHATGPT_API_SLIDES,
  },
  "chatgpt-text": {
    title: "ChatGPT Roles and Parse",
    summary:
      "Pirate instructions, roles, vision, TTS, Structured Outputs, then moderation.",
    chapter: 7,
    topicId: "chatgpt-api",
    canvasLecture: 25,
    slides: CHATGPT_TEXT_SLIDES,
  },
  "chatgpt-ui": {
    title: "ChatGPT UI and Course AI",
    summary:
      "Chat bot, image UI, vision, TTS/STT, then Kambaz suggest course and module.",
    chapter: 7,
    topicId: "chatgpt-api",
    canvasLecture: 25,
    slides: CHATGPT_UI_SLIDES,
  },
  "grok-api": {
    title: "Grok xAI Key",
    summary:
      "TOKENS, API KEY, curl grok-4-latest, then generateText meaning-of-life.",
    chapter: 7,
    topicId: "grok-api",
    canvasLecture: 25,
    slides: GROK_API_SLIDES,
  },
  "grok-chat": {
    title: "Grok Chat and Sparkle",
    summary:
      "CHAT completions, stateless roles, COURSE AI DESCRIPTION, then title sparkle.",
    chapter: 7,
    topicId: "grok-api",
    canvasLecture: 25,
    slides: GROK_CHAT_SLIDES,
  },
  "grok-images": {
    title: "Grok Images and Structure",
    summary:
      "GENERATING IMAGES, COURSE AI IMAGE, vision, STRUCTURED OUTPUT, then course modules.",
    chapter: 7,
    topicId: "grok-api",
    canvasLecture: 25,
    slides: GROK_IMAGES_SLIDES,
  },
};

export function lecturePublicUrl(slug: LectureSlug): string {
  return `${COURSE_SITE_ORIGIN}${slidesHref(slug)}`;
}

export function listLectureSlugs(): LectureSlug[] {
  return [...LECTURE_SLUGS];
}

export function isLectureSlug(value: string): value is LectureSlug {
  return (LECTURE_SLUGS as readonly string[]).includes(value);
}

export function getLecture(slug: string): LectureHubItem | undefined {
  if (!isLectureSlug(slug)) return undefined;
  const entry = LECTURE_SUMMARIES[slug];
  const chapter = bookChapterMeta(entry.chapter);
  const topic = lectureTopicMeta(entry.topicId);
  return {
    slug,
    chapter: entry.chapter,
    topicId: entry.topicId,
    topic: topic?.title,
    bookSectionId: entry.bookSectionId,
    bookHref: bookHrefForSection(entry.chapter, entry.bookSectionId),
    canvasLecture: entry.canvasLecture,
    title: entry.title,
    summary: entry.summary,
    chapterHref: chapter.href,
    chapterTitle: chapter.title,
    publicUrl: lecturePublicUrl(slug),
    thumbnailSrc: lectureThumbPath(slug),
  };
}

/** Decks whose `bookSectionId` exactly matches a book TOC anchor. */
export function listDecksForBookSection(sectionId: string): LectureHubItem[] {
  return listLectures().filter((item) => item.bookSectionId === sectionId);
}

export function getLectureDeck(slug: string): LectureDeck | undefined {
  const item = getLecture(slug);
  if (!item) return undefined;
  return {
    ...item,
    slides: LECTURE_SUMMARIES[item.slug].slides as LectureDeck["slides"],
  };
}

export function listLectures(): LectureHubItem[] {
  return listLectureSlugs()
    .map((slug) => getLecture(slug))
    .filter((item): item is LectureHubItem => Boolean(item));
}

export function listLectureDecks(): LectureDeck[] {
  return listLectureSlugs()
    .map((slug) => getLectureDeck(slug))
    .filter((deck): deck is LectureDeck => Boolean(deck));
}

export function lectureDeckThumbnail(
  deck: LectureHubItem | LectureSlug,
): string {
  if (typeof deck !== "string" && deck.thumbnailSrc) {
    return deck.thumbnailSrc;
  }
  const slug = typeof deck === "string" ? deck : deck.slug;
  return lectureThumbPath(slug);
}

/** Canvas week buckets — keep for tests / future Canvas sync. Hub uses chapters. */
export function listCanvasLectureGroups(): CanvasLectureGroup[] {
  const items = listLectures();
  const maxFromCatalog = items.reduce(
    (max, item) => Math.max(max, item.canvasLecture),
    0,
  );
  const count = Math.max(lectureTopics.length, maxFromCatalog, 1);
  return Array.from({ length: count }, (_, index) => {
    const canvasLecture = index + 1;
    const groupDecks = items.filter(
      (item) => item.canvasLecture === canvasLecture,
    );
    return {
      canvasLecture,
      title: `Lecture ${canvasLecture}`,
      topic: lectureTopics[index]?.topic,
      decks: groupDecks,
    };
  });
}

/**
 * Hub grouping: book chapter, then optional topic sections in spine order.
 * Empty registered topics stay visible so Slides can drop in new decks.
 */
export function listChapterTopicGroups(): LectureChapterGroup[] {
  const items = listLectures();
  const chapterNumbers = new Set<number>();
  for (const item of items) chapterNumbers.add(item.chapter);
  for (const topic of LECTURE_TOPICS) chapterNumbers.add(topic.chapter);

  return [...chapterNumbers]
    .sort((a, b) => a - b)
    .filter((chapter) => {
      const hasDecks = items.some((item) => item.chapter === chapter);
      const hasTopics = LECTURE_TOPICS.some((topic) => topic.chapter === chapter);
      return hasDecks || hasTopics;
    })
    .map((chapter) => {
      const meta = bookChapterMeta(chapter);
      const decks = items.filter((item) => item.chapter === chapter);
      const registered = LECTURE_TOPICS.filter((topic) => topic.chapter === chapter);
      const topics: LectureTopicGroup[] = registered.map((topic) => ({
        topicId: topic.topicId,
        title: topic.title,
        bookSectionId: topic.bookSectionId,
        bookHref: bookHrefForSection(chapter, topic.bookSectionId),
        decks: decks.filter((item) => item.topicId === topic.topicId),
      }));
      const knownIds = new Set(registered.map((topic) => topic.topicId));
      const leftovers = decks.filter(
        (item) => !item.topicId || !knownIds.has(item.topicId),
      );
      if (leftovers.length > 0) {
        topics.push({
          topicId: "more",
          title: "More",
          decks: leftovers,
        });
      }
      return {
        chapter,
        href: meta.href,
        title: meta.title,
        weeks: meta.weeks,
        topics,
      };
    });
}

/** Chapters that already have published decks — drives hub nav. */
export function listLectureChapters(): LectureNavChapter[] {
  const seen = new Set<number>();
  const chapters: LectureNavChapter[] = [];
  for (const item of listLectures()) {
    if (seen.has(item.chapter)) continue;
    seen.add(item.chapter);
    chapters.push({
      chapter: item.chapter,
      href: item.chapterHref,
      title: item.chapterTitle,
    });
  }
  return chapters.sort((a, b) => a.chapter - b.chapter);
}

export function adjacentLectureSlugs(slug: LectureSlug): {
  prev?: LectureHubItem;
  next?: LectureHubItem;
} {
  const slugs = listLectureSlugs();
  const index = slugs.indexOf(slug);
  return {
    prev: index > 0 ? getLecture(slugs[index - 1]) : undefined,
    next: index >= 0 && index < slugs.length - 1 ? getLecture(slugs[index + 1]) : undefined,
  };
}
