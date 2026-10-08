import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/lectures/thumbs",
);
mkdirSync(outDir, { recursive: true });

const HTML5 = `
  <g transform="translate(80 90)">
    <path d="M36 12h248l-22 248-102 28-102-28L36 12z" fill="#E44D26"/>
    <path d="M160 32v236l82-22 18-202H160z" fill="#F16529"/>
    <path d="M160 118H92l4 44h64V118zm0 148-56-16-4-40H80l6 72 74 20V266z" fill="#EBEBEB"/>
    <path d="M160 118v44h62l-6 64-56 16v46l74-20 8-92 2-58H160z" fill="#fff"/>
  </g>`;

const NODE = `
  <g transform="translate(70 70)">
    <path d="M180 28 48 104v152l132 76 132-76V104L180 28z" fill="#3C873A"/>
    <path d="M180 52 78 112v128l102 58 102-58V112L180 52z" fill="#68A063"/>
    <text x="180" y="200" text-anchor="middle" fill="#fff" font-family="ui-sans-serif, system-ui, sans-serif" font-size="72" font-weight="800">JS</text>
  </g>`;

const REACT_NEXT = `
  <g transform="translate(70 80)">
    <circle cx="150" cy="180" r="28" fill="#61DAFB"/>
    <ellipse cx="150" cy="180" rx="120" ry="46" fill="none" stroke="#61DAFB" stroke-width="12"/>
    <ellipse cx="150" cy="180" rx="120" ry="46" fill="none" stroke="#61DAFB" stroke-width="12" transform="rotate(60 150 180)"/>
    <ellipse cx="150" cy="180" rx="120" ry="46" fill="none" stroke="#61DAFB" stroke-width="12" transform="rotate(-60 150 180)"/>
    <g transform="translate(300 70)">
      <circle cx="90" cy="90" r="90" fill="#000"/>
      <text x="90" y="118" text-anchor="middle" fill="#fff" font-family="ui-sans-serif, system-ui, sans-serif" font-size="72" font-weight="800">N</text>
    </g>
  </g>`;

const GITHUB = `
  <g transform="translate(90 70)">
    <circle cx="180" cy="180" r="160" fill="#24292F"/>
    <path fill="#fff" d="M180 70c-62 0-112 50-112 112 0 49 32 91 77 106 5 1 8-2 8-6v-22c-31 7-38-13-38-13-5-13-12-16-12-16-10-7 1-7 1-7 11 1 17 12 17 12 10 17 26 12 32 9 1-7 4-12 7-15-25-3-51-12-51-55 0-12 4-22 12-30-1-3-5-16 1-32 0 0 10-3 33 12a114 114 0 0 1 60 0c23-15 33-12 33-12 6 16 2 29 1 32 8 8 12 18 12 30 0 43-26 52-51 55 4 3 8 10 8 21v31c0 4 3 7 8 6 45-15 77-57 77-106 0-62-50-112-112-112z"/>
  </g>`;

const VERCEL = `
  <g transform="translate(90 80)">
    <rect width="360" height="360" rx="48" fill="#000"/>
    <path d="M180 92 292 300H68L180 92z" fill="#fff"/>
  </g>`;

const HEADINGS = `
  <g transform="translate(70 90)" font-family="ui-sans-serif, system-ui, sans-serif" fill="#0F172A">
    <text x="20" y="90" font-size="92" font-weight="800">H1</text>
    <text x="20" y="175" font-size="64" font-weight="700">H2</text>
    <text x="20" y="245" font-size="48" font-weight="700">H3</text>
    <rect x="220" y="48" width="280" height="22" rx="6" fill="#0F172A"/>
    <rect x="220" y="92" width="240" height="16" rx="6" fill="#64748B"/>
    <rect x="220" y="128" width="260" height="16" rx="6" fill="#94A3B8"/>
    <rect x="220" y="188" width="280" height="16" rx="6" fill="#CBD5E1"/>
    <rect x="220" y="224" width="200" height="16" rx="6" fill="#CBD5E1"/>
  </g>`;

const LISTS_TABLES = `
  <g transform="translate(70 90)">
    <circle cx="36" cy="56" r="12" fill="#0F172A"/>
    <rect x="64" y="46" width="200" height="20" rx="6" fill="#0F172A"/>
    <circle cx="36" cy="112" r="12" fill="#0F172A"/>
    <rect x="64" y="102" width="170" height="20" rx="6" fill="#334155"/>
    <circle cx="36" cy="168" r="12" fill="#0F172A"/>
    <rect x="64" y="158" width="190" height="20" rx="6" fill="#334155"/>
    <g transform="translate(300 30)">
      <rect width="280" height="200" rx="12" fill="#fff" stroke="#0F172A" stroke-width="8"/>
      <rect x="0" y="0" width="280" height="48" rx="12" fill="#0F172A"/>
      <rect x="0" y="40" width="280" height="8" fill="#0F172A"/>
      <line x1="93" y1="48" x2="93" y2="200" stroke="#94A3B8" stroke-width="4"/>
      <line x1="187" y1="48" x2="187" y2="200" stroke="#94A3B8" stroke-width="4"/>
      <line x1="0" y1="100" x2="280" y2="100" stroke="#CBD5E1" stroke-width="4"/>
      <line x1="0" y1="150" x2="280" y2="150" stroke="#CBD5E1" stroke-width="4"/>
    </g>
  </g>`;

const FORMS = `
  <g transform="translate(90 100)">
    <rect width="500" height="280" rx="24" fill="#fff" stroke="#0F172A" stroke-width="8"/>
    <rect x="36" y="40" width="160" height="18" rx="6" fill="#64748B"/>
    <rect x="36" y="70" width="428" height="48" rx="10" fill="#F1F5F9" stroke="#0F172A" stroke-width="4"/>
    <rect x="36" y="140" width="120" height="18" rx="6" fill="#64748B"/>
    <rect x="36" y="170" width="428" height="48" rx="10" fill="#F1F5F9" stroke="#0F172A" stroke-width="4"/>
  </g>`;

const ANCHORS = `
  <g transform="translate(150 150) rotate(-32 260 140)" fill="none" stroke="#0F172A" stroke-width="32" stroke-linejoin="round">
    <rect x="40" y="90" width="230" height="100" rx="50"/>
    <rect x="210" y="90" width="230" height="100" rx="50"/>
  </g>`;

/** Official Tailwind CSS mark (https://tailwindcss.com/brand), 54×33 viewBox. */
const TAILWIND = `
  <g transform="translate(90 170) scale(8.2)">
    <path fill="#38BDF8" fill-rule="evenodd" clip-rule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"/>
  </g>`;

const PARAMS = `
  <g transform="translate(90 90)">
    <rect width="220" height="88" rx="20" fill="#C4B5FD"/>
    <text x="110" y="58" text-anchor="middle" fill="#111827" font-family="ui-sans-serif, system-ui, sans-serif" font-size="40" font-weight="800">{ props }</text>
    <path d="M110 88v36" stroke="#C4B5FD" stroke-width="12" stroke-linecap="round"/>
    <polygon points="98,124 122,124 110,146" fill="#C4B5FD"/>
    <rect y="146" width="400" height="200" rx="36" fill="#DDD6FE"/>
    <text x="200" y="268" text-anchor="middle" fill="#111827" font-family="ui-sans-serif, system-ui, sans-serif" font-size="64" font-weight="800">&lt;Add /&gt;</text>
  </g>`;

const KAMBAZ = `
  <g transform="translate(70 90)">
    <rect width="150" height="280" rx="18" fill="#111827"/>
    <rect x="22" y="28" width="106" height="14" rx="4" fill="#F8FAFC"/>
    <rect x="22" y="62" width="86" height="10" rx="4" fill="#94A3B8"/>
    <rect x="22" y="88" width="70" height="10" rx="4" fill="#64748B"/>
    <rect x="22" y="114" width="78" height="10" rx="4" fill="#64748B"/>
    <rect x="22" y="140" width="64" height="10" rx="4" fill="#475569"/>
    <rect x="180" y="0" width="430" height="280" rx="18" fill="#fff" stroke="#0F172A" stroke-width="8"/>
    <rect x="208" y="32" width="200" height="16" rx="6" fill="#0F172A"/>
    <rect x="208" y="68" width="370" height="12" rx="6" fill="#94A3B8"/>
    <rect x="208" y="96" width="330" height="12" rx="6" fill="#CBD5E1"/>
    <rect x="208" y="140" width="150" height="100" rx="12" fill="#E2E8F0"/>
    <rect x="372" y="140" width="150" height="100" rx="12" fill="#E2E8F0"/>
  </g>`;

const JS = `
  <g transform="translate(90 80)">
    <rect width="360" height="360" rx="48" fill="#F7DF1E"/>
    <text x="180" y="250" text-anchor="middle" fill="#111827" font-family="ui-sans-serif, system-ui, sans-serif" font-size="160" font-weight="800">JS</text>
  </g>`;

const STATE = `
  <g transform="translate(90 80)">
    <rect width="360" height="360" rx="48" fill="#38BDF8"/>
    <text x="180" y="230" text-anchor="middle" fill="#0F172A" font-family="ui-sans-serif, system-ui, sans-serif" font-size="88" font-weight="800">use</text>
    <text x="180" y="310" text-anchor="middle" fill="#0F172A" font-family="ui-sans-serif, system-ui, sans-serif" font-size="72" font-weight="800">State</text>
  </g>`;

const STORE = `
  <g transform="translate(90 80)">
    <rect width="360" height="360" rx="48" fill="#F59E0B" stroke="#FDE68A" stroke-width="10"/>
    <text x="180" y="250" text-anchor="middle" fill="#111827" font-family="ui-sans-serif, system-ui, sans-serif" font-size="96" font-weight="800">Z</text>
  </g>`;

const SPA = `
  <g transform="translate(80 110)">
    <rect width="240" height="200" rx="20" fill="#fff" stroke="#0F172A" stroke-width="8"/>
    <rect x="24" y="28" width="140" height="16" rx="6" fill="#0F172A"/>
    <rect x="24" y="64" width="190" height="12" rx="6" fill="#94A3B8"/>
    <rect x="24" y="92" width="160" height="12" rx="6" fill="#CBD5E1"/>
    <path d="M280 100h80" stroke="#0F172A" stroke-width="10" stroke-linecap="round"/>
    <polygon points="360,86 390,100 360,114" fill="#0F172A"/>
    <rect x="410" y="0" width="240" height="200" rx="20" fill="#111827" stroke="#0F172A" stroke-width="8"/>
    <rect x="434" y="28" width="140" height="16" rx="6" fill="#61DAFB"/>
    <rect x="434" y="64" width="190" height="12" rx="6" fill="#94A3B8"/>
    <rect x="434" y="92" width="160" height="12" rx="6" fill="#64748B"/>
  </g>`;

function card({
  slug,
  title,
  chapter,
  lecture,
  bg,
  accent,
  art,
  titleFill = "#F8FAFC",
  subtitleFill = "#CBD5E1",
}) {
  const chapterNumber = chapter ?? lecture;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-labelledby="title">
  <title id="title">${title}</title>
  <rect width="1280" height="720" fill="${bg}"/>
  <rect x="0" y="0" width="18" height="720" fill="${accent}"/>
  <text x="72" y="64" fill="${subtitleFill}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="28" font-weight="700" letter-spacing="4">WEB DEV · CHAPTER ${chapterNumber}</text>
  ${art}
  <text x="72" y="640" fill="${titleFill}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="56" font-weight="800">${title}</text>
</svg>
`;
}

const thumbs = [
  {
    slug: "intro-to-web-development",
    title: "Introduction to Web Development",
    lecture: 1,
    bg: "#1C1917",
    accent: "#E44D26",
    art: HTML5,
  },
  {
    slug: "installing-nodejs",
    title: "Installing Node.js",
    lecture: 1,
    bg: "#052E16",
    accent: "#68A063",
    art: NODE,
  },
  {
    slug: "creating-a-nextjs-react-application",
    title: "Creating a Next.js React App",
    lecture: 1,
    bg: "#0B1220",
    accent: "#61DAFB",
    art: REACT_NEXT,
  },
  {
    slug: "commit-to-github",
    title: "Commit to GitHub",
    lecture: 1,
    bg: "#0D1117",
    accent: "#F0F6FC",
    art: GITHUB,
  },
  {
    slug: "deploying-to-vercel",
    title: "Deploying to Vercel",
    lecture: 1,
    bg: "#111111",
    accent: "#FFFFFF",
    art: VERCEL,
  },
  {
    slug: "html-and-dom",
    title: "HTML and the DOM",
    chapter: 1,
    bg: "#1C1917",
    accent: "#E44D26",
    art: HTML5,
  },
  {
    slug: "headings-and-paragraphs",
    title: "Headings and Paragraphs",
    chapter: 1,
    bg: "#F8FAFC",
    accent: "#E44D26",
    art: HEADINGS,
    titleFill: "#0F172A",
    subtitleFill: "#64748B",
  },
  {
    slug: "lists-and-tables",
    title: "Lists and Tables",
    chapter: 1,
    bg: "#F1F5F9",
    accent: "#0F172A",
    art: LISTS_TABLES,
    titleFill: "#0F172A",
    subtitleFill: "#64748B",
  },
  {
    slug: "web-forms",
    title: "Web Forms",
    chapter: 1,
    bg: "#EEF2FF",
    accent: "#4F46E5",
    art: FORMS,
    titleFill: "#1E1B4B",
    subtitleFill: "#6366F1",
  },
  {
    slug: "anchors",
    title: "Anchors",
    chapter: 1,
    bg: "#FFF7ED",
    accent: "#EA580C",
    art: ANCHORS,
    titleFill: "#7C2D12",
    subtitleFill: "#C2410C",
  },
  {
    slug: "tailwind-intro",
    title: "Tailwind Intro",
    chapter: 2,
    bg: "#0F172A",
    accent: "#38BDF8",
    art: TAILWIND,
    subtitleFill: "#7DD3FC",
  },
  {
    slug: "parameterizing-components",
    title: "Parameterizing Components",
    chapter: 3,
    bg: "#111827",
    accent: "#C4B5FD",
    art: PARAMS,
  },
  {
    slug: "single-page-navigation",
    title: "Single-page Navigation",
    chapter: 1,
    bg: "#ECFEFF",
    accent: "#0891B2",
    art: SPA,
    titleFill: "#164E63",
    subtitleFill: "#0E7490",
  },
  {
    slug: "kambaz-overview",
    title: "Kambaz Overview",
    chapter: 1,
    bg: "#1C1917",
    accent: "#F59E0B",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-account",
    title: "Kambaz Account",
    chapter: 1,
    bg: "#0F172A",
    accent: "#38BDF8",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-dashboard",
    title: "Kambaz Dashboard",
    chapter: 1,
    bg: "#14532D",
    accent: "#86EFAC",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-navigation",
    title: "Kambaz Navigation",
    chapter: 1,
    bg: "#1E1B4B",
    accent: "#A78BFA",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-courses",
    title: "Kambaz Courses",
    chapter: 1,
    bg: "#7C2D12",
    accent: "#FDBA74",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-modules",
    title: "Kambaz Modules",
    chapter: 1,
    bg: "#134E4A",
    accent: "#5EEAD4",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-assignments",
    title: "Kambaz Assignments",
    chapter: 1,
    bg: "#4C0519",
    accent: "#FB7185",
    art: KAMBAZ,
  },
  {
    slug: "intro-to-javascript",
    title: "Introduction to JavaScript",
    chapter: 3,
    bg: "#111827",
    accent: "#F7DF1E",
    art: JS,
  },
  {
    slug: "variables-and-constants",
    title: "Variables and Constants",
    chapter: 3,
    bg: "#1E293B",
    accent: "#38BDF8",
    art: JS,
  },
  {
    slug: "variable-types",
    title: "Variable Types",
    chapter: 3,
    bg: "#0F172A",
    accent: "#A78BFA",
    art: JS,
  },
  {
    slug: "booleans-and-conditionals",
    title: "Booleans and Conditionals",
    chapter: 3,
    bg: "#14532D",
    accent: "#86EFAC",
    art: JS,
  },
  {
    slug: "null-and-undefined",
    title: "Null and Undefined",
    chapter: 3,
    bg: "#4C0519",
    accent: "#FB7185",
    art: JS,
  },
  {
    slug: "javascript-functions",
    title: "JavaScript Functions",
    chapter: 3,
    bg: "#1E1B4B",
    accent: "#C4B5FD",
    art: JS,
  },
  {
    slug: "click-events",
    title: "Click Events",
    chapter: 4,
    bg: "#111827",
    accent: "#F97316",
    art: STATE,
  },
  {
    slug: "passing-data-and-functions",
    title: "Passing Data and Functions",
    chapter: 4,
    bg: "#1E293B",
    accent: "#38BDF8",
    art: STATE,
  },
  {
    slug: "usestate-counter",
    title: "useState and the Counter",
    chapter: 4,
    bg: "#0F172A",
    accent: "#A78BFA",
    art: STATE,
  },
  {
    slug: "form-state-types",
    title: "Form State Types",
    chapter: 4,
    bg: "#14532D",
    accent: "#86EFAC",
    art: STATE,
  },
  {
    slug: "sharing-parent-child",
    title: "Sharing Parent and Child",
    chapter: 4,
    bg: "#1E1B4B",
    accent: "#C4B5FD",
    art: STATE,
  },
  {
    slug: "prop-drilling-and-url",
    title: "Prop Drilling and URLs",
    chapter: 4,
    bg: "#4C0519",
    accent: "#FB7185",
    art: STATE,
  },
  {
    slug: "react-context",
    title: "React Context",
    chapter: 4,
    bg: "#0B1220",
    accent: "#61DAFB",
    art: STATE,
  },
  {
    slug: "zustand-counter",
    title: "Zustand Counter",
    chapter: 4,
    bg: "#111827",
    accent: "#F8FAFC",
    art: STORE,
  },
  {
    slug: "zustand-todos",
    title: "Zustand Todo List",
    chapter: 4,
    bg: "#1C1917",
    accent: "#F59E0B",
    art: STORE,
  },
  {
    slug: "use-effect",
    title: "Side Effects with useEffect",
    chapter: 4,
    bg: "#134E4A",
    accent: "#5EEAD4",
    art: STATE,
  },
  {
    slug: "ch4-check-understanding",
    title: "Check Your Understanding",
    chapter: 4,
    bg: "#1E1B4B",
    accent: "#F7DF1E",
    art: STATE,
  },
  {
    slug: "kambaz-courses-store",
    title: "A Courses Store",
    chapter: 4,
    bg: "#14532D",
    accent: "#86EFAC",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-dashboard-crud",
    title: "Dashboard Create, Edit, Delete",
    chapter: 4,
    bg: "#0F172A",
    accent: "#38BDF8",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-modules-store",
    title: "A Modules Store",
    chapter: 4,
    bg: "#134E4A",
    accent: "#5EEAD4",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-account-context",
    title: "Account Context",
    chapter: 4,
    bg: "#4C0519",
    accent: "#FB7185",
    art: KAMBAZ,
  },
  {
    slug: "http-server",
    title: "HTTP Server",
    chapter: 5,
    bg: "#052E16",
    accent: "#68A063",
    art: NODE,
  },
  {
    slug: "nodemon-es6-routes",
    title: "Nodemon, ES6, and Routes",
    chapter: 5,
    bg: "#14532D",
    accent: "#86EFAC",
    art: NODE,
  },
  {
    slug: "lab5-env",
    title: "Lab 5 Environment",
    chapter: 5,
    bg: "#0F172A",
    accent: "#38BDF8",
    art: NODE,
  },
  {
    slug: "path-and-query",
    title: "Path and Query Parameters",
    chapter: 5,
    bg: "#1E293B",
    accent: "#7DD3FC",
    art: NODE,
  },
  {
    slug: "remote-objects",
    title: "Remote Objects",
    chapter: 5,
    bg: "#1E1B4B",
    accent: "#C4B5FD",
    art: NODE,
  },
  {
    slug: "remote-arrays",
    title: "Remote Arrays",
    chapter: 5,
    bg: "#4C0519",
    accent: "#FB7185",
    art: NODE,
  },
  {
    slug: "async-http",
    title: "Async HTTP and JSON",
    chapter: 5,
    bg: "#134E4A",
    accent: "#5EEAD4",
    art: NODE,
  },
  {
    slug: "next-routes",
    title: "Next.js Server Routes",
    chapter: 5,
    bg: "#0B1220",
    accent: "#61DAFB",
    art: REACT_NEXT,
  },
  {
    slug: "ch5-check-understanding",
    title: "Check Your Understanding",
    chapter: 5,
    bg: "#1E1B4B",
    accent: "#F7DF1E",
    art: NODE,
  },
  {
    slug: "kambaz-migrate-db",
    title: "Migrating the Database",
    chapter: 5,
    bg: "#14532D",
    accent: "#86EFAC",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-account-rest",
    title: "Account REST APIs",
    chapter: 5,
    bg: "#0F172A",
    accent: "#38BDF8",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-sessions",
    title: "Sessions and Axios",
    chapter: 5,
    bg: "#1C1917",
    accent: "#F59E0B",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-courses-api",
    title: "Courses API",
    chapter: 5,
    bg: "#134E4A",
    accent: "#5EEAD4",
    art: KAMBAZ,
  },
  {
    slug: "deploy-api",
    title: "Deploy the API",
    chapter: 5,
    bg: "#111111",
    accent: "#FFFFFF",
    art: VERCEL,
  },
];

for (const thumb of thumbs) {
  writeFileSync(join(outDir, `${thumb.slug}.svg`), card(thumb));
}

console.log(`Wrote ${thumbs.length} lecture thumbs to ${outDir}`);
