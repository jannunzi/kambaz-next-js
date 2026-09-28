import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { COURSE_INFO_LINKS } from "../../app/course-info/links.ts";
import {
  ASSOCIATES_DISCLOSURE,
  BLOG_AFFILIATE_BOOKS,
  DEFAULT_ASSOCIATE_TAG,
  amazonAssociateTag,
  amazonProductUrl,
} from "./affiliate.ts";
import {
  formatBlogDate,
  getBlogPost,
  listBlogPosts,
  listBlogSlugs,
  relatedChapterHref,
  relatedChapterLabel,
} from "./index.ts";
import { BLOG_POSTS } from "./posts.ts";

const REQUIRED_SEED_SOURCES = [
  "https://nextjs.org/blog/next-16-3",
  "https://nextjs.org/blog/next-16-3-ai-improvements",
  "https://nextjs.org/blog/august-2026-security-release",
] as const;

const REQUIRED_CATCHUP_SOURCES = [
  "https://react.dev/blog/2026/09/09/react-19-3",
  "https://vercel.com/blog/ai-sdk-7",
  "https://www.isyncevolution.com/blog/nextjs-security-best-practices",
] as const;

const REQUIRED_DIGEST_2026_09_15 = [
  "https://vercel.com/blog/how-we-cut-cdn-metadata-lookup-latency-by-91-percent",
  "https://cursor.com/blog/projects",
  "https://expressjs.com/en/blog/2026-08-31-security-releases/",
] as const;

const REQUIRED_DIGEST_2026_09_16 = [
  "https://vercel.com/blog/introducing-flat-rate-cdn",
  "https://openai.com/index/introducing-the-agents-api/",
  "https://vercel.com/blog/introducing-run",
] as const;

const REQUIRED_DIGEST_2026_09_17 = [
  "https://vercel.com/blog/fluid-compute-takes-any-shape",
  "https://www.geekygoo.com/blog/claude-code-vs-github-copilot-vs-cursor/",
  "https://www.aikido.dev/blog/shai-hulud-npm-resurfaces",
] as const;

const REQUIRED_DIGEST_2026_09_21 = [
  "https://vercel.com/blog/how-tailscale-built-a-customer-facing-model-router-on-ai-gateway",
  "https://vercel.com/blog/how-our-agents-build-on-brand-pages-with-design-md",
  "https://vercel.com/blog/reproducing-disclosing-and-fixing-the-libheif-vulnerability-with-hacktron-and-the-maintainers",
] as const;

const REQUIRED_DIGEST_2026_09_22 = [
  "https://nextjs.org/blog/upcoming-nextjs-security-release-september-22-2026",
  "https://vercel.com/blog/ai-gateway-production-index-september-2026",
  "https://vercel.com/blog/how-delphi-ships-100-times-a-day-with-its-python-backend-on-vercel",
] as const;

const REQUIRED_DIGEST_2026_09_23 = [
  "https://nextjs.org/blog/nextjs-security-update-september-22-2026",
  "https://vercel.com/blog/ai-gateway-jev-model-launch",
  "https://vercel.com/blog/how-featureds-users-make-100k-media-pitches-per-month-on-vercel",
] as const;

const REQUIRED_DIGEST_2026_09_24 = [
  "https://nextjs.org/blog/turbopack-chunking",
  "https://nextjs.org/blog/how-we-closed-1500-github-issues",
  "https://nextjs.org/blog/upcoming-nextjs-security-release-september-2026",
] as const;

const REQUIRED_DIGEST_2026_09_25 = [
  "https://vercel.com/blog/how-klaviyo-shipped-356-internal-apps-in-two-weeks-on-vercel",
  "https://vercel.com/blog/the-end-of-credential-sprawl-for-agents",
  "https://vercel.com/blog/the-vercel-bug-bounty-program-is-now-publicly-available",
] as const;

const REQUIRED_DIGEST_2026_09_28 = [
  "https://nextjs.org/blog/building-app-like-experiences-with-nextjs-16-3",
  "https://vercel.com/blog/state-of-agent-skills",
  "https://www.aikido.dev/blog/popular-code-generator-for-tanstack-query-hit-by-supply-chain-worm",
] as const;

const REQUIRED_SOURCES = [
  ...REQUIRED_SEED_SOURCES,
  ...REQUIRED_CATCHUP_SOURCES,
  ...REQUIRED_DIGEST_2026_09_15,
  ...REQUIRED_DIGEST_2026_09_16,
  ...REQUIRED_DIGEST_2026_09_17,
  ...REQUIRED_DIGEST_2026_09_21,
  ...REQUIRED_DIGEST_2026_09_22,
  ...REQUIRED_DIGEST_2026_09_23,
  ...REQUIRED_DIGEST_2026_09_24,
  ...REQUIRED_DIGEST_2026_09_25,
  ...REQUIRED_DIGEST_2026_09_28,
] as const;

const ALLOWED_SOURCE_URL =
  /^https:\/\/(nextjs\.org\/blog\/|react\.dev\/blog\/|vercel\.com\/blog\/|www\.isyncevolution\.com\/blog\/|cursor\.com\/blog\/|expressjs\.com\/en\/blog\/|openai\.com\/index\/|www\.geekygoo\.com\/blog\/|www\.aikido\.dev\/blog\/)/;

const BLOG_APP = join(process.cwd(), "app/blog");
const KAMBAZ_APP = join(process.cwd(), "app/(kambaz)");

function read(path: string): string {
  return readFileSync(path, "utf8");
}

function walkTsx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkTsx(path));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) out.push(path);
  }
  return out;
}

describe("blog posts", () => {
  it("keeps required seed, catch-up, and digest source URLs with no empty sources", () => {
    assert.equal(BLOG_POSTS.length, REQUIRED_SOURCES.length);
    const urls = BLOG_POSTS.map((post) => post.source.url);
    assert.equal(new Set(urls).size, urls.length, "source URLs must be unique");
    assert.deepEqual([...urls].sort(), [...REQUIRED_SOURCES].sort());
    for (const required of REQUIRED_SEED_SOURCES) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_CATCHUP_SOURCES) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_DIGEST_2026_09_15) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_DIGEST_2026_09_16) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_DIGEST_2026_09_17) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_DIGEST_2026_09_21) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_DIGEST_2026_09_22) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_DIGEST_2026_09_23) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_DIGEST_2026_09_24) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_DIGEST_2026_09_25) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_DIGEST_2026_09_28) {
      assert.ok(urls.includes(required), required);
    }

    for (const post of BLOG_POSTS) {
      assert.ok(post.slug.length > 0, "slug");
      assert.ok(post.title.length > 0, "title");
      assert.ok(!Number.isNaN(Date.parse(post.publishedAt)), post.publishedAt);
      assert.ok(post.tags.length > 0, `tags for ${post.slug}`);
      assert.ok(post.intro.length >= 1 && post.intro.length <= 3, post.slug);
      for (const paragraph of post.intro) {
        assert.ok(paragraph.trim().length > 40, `intro too short: ${post.slug}`);
      }
      assert.ok(post.source.title.trim(), `source.title ${post.slug}`);
      assert.ok(post.source.publisher.trim(), `source.publisher ${post.slug}`);
      assert.match(post.source.url, ALLOWED_SOURCE_URL);
    }
  });

  it("lists newest first and looks up by slug", () => {
    const listed = listBlogPosts();
    assert.equal(listed.length, REQUIRED_SOURCES.length);
    const times = listed.map((post) => Date.parse(post.publishedAt));
    assert.deepEqual(
      times,
      [...times].sort((a, b) => b - a),
    );
    assert.deepEqual(
      listed.slice(0, 3).map((post) => post.slug),
      [
        "nextjs-16-3-app-like-experiences",
        "state-of-agent-skills-one-million",
        "tanstack-query-codegen-supply-chain-worm",
      ],
    );
    assert.deepEqual(
      listed.slice(0, 3).map((post) => post.source.url).sort(),
      [...REQUIRED_DIGEST_2026_09_28].sort(),
    );
    assert.deepEqual(
      listed.slice(3, 6).map((post) => post.source.url).sort(),
      [...REQUIRED_DIGEST_2026_09_25].sort(),
    );
    assert.deepEqual(
      listed.slice(6, 9).map((post) => post.source.url).sort(),
      [...REQUIRED_DIGEST_2026_09_24].sort(),
    );
    assert.deepEqual(
      listed.slice(9, 12).map((post) => post.source.url).sort(),
      [...REQUIRED_DIGEST_2026_09_23].sort(),
    );
    assert.deepEqual(
      listed.slice(12, 15).map((post) => post.source.url).sort(),
      [...REQUIRED_DIGEST_2026_09_22].sort(),
    );
    assert.deepEqual(
      listed.slice(15, 18).map((post) => post.source.url).sort(),
      [...REQUIRED_DIGEST_2026_09_21].sort(),
    );
    assert.deepEqual(
      listed.slice(18, 21).map((post) => post.source.url).sort(),
      [...REQUIRED_DIGEST_2026_09_17].sort(),
    );
    assert.deepEqual(
      listed.slice(21, 24).map((post) => post.source.url).sort(),
      [...REQUIRED_DIGEST_2026_09_16].sort(),
    );
    assert.deepEqual(
      listed.slice(24, 27).map((post) => post.source.url).sort(),
      [...REQUIRED_DIGEST_2026_09_15].sort(),
    );
    assert.deepEqual(
      listed.slice(27, 30).map((post) => post.source.url).sort(),
      [...REQUIRED_CATCHUP_SOURCES].sort(),
    );
    assert.equal(listed[30]?.slug, "august-2026-nextjs-security-release");
    assert.equal(listed[31]?.slug, "nextjs-16-3-instant-navigations");
    assert.equal(listed[32]?.slug, "nextjs-16-3-ai-improvements");

    assert.equal(listBlogSlugs().length, REQUIRED_SOURCES.length);
    assert.equal(
      getBlogPost("nextjs-16-3-instant-navigations")?.source.url,
      "https://nextjs.org/blog/next-16-3",
    );
    assert.equal(
      getBlogPost("react-19-3")?.source.url,
      "https://react.dev/blog/2026/09/09/react-19-3",
    );
    assert.equal(getBlogPost("does-not-exist"), undefined);
  });

  it("formats published dates in UTC and maps related chapters", () => {
    assert.equal(formatBlogDate("2026-09-28T12:00:00.000Z"), "September 28, 2026");
    assert.equal(formatBlogDate("2026-09-25T12:00:00.000Z"), "September 25, 2026");
    assert.equal(formatBlogDate("2026-09-24T12:00:00.000Z"), "September 24, 2026");
    assert.equal(formatBlogDate("2026-09-23T12:00:00.000Z"), "September 23, 2026");
    assert.equal(formatBlogDate("2026-09-22T12:00:00.000Z"), "September 22, 2026");
    assert.equal(formatBlogDate("2026-09-21T12:00:00.000Z"), "September 21, 2026");
    assert.equal(formatBlogDate("2026-09-17T12:00:00.000Z"), "September 17, 2026");
    assert.equal(formatBlogDate("2026-09-16T12:00:00.000Z"), "September 16, 2026");
    assert.equal(formatBlogDate("2026-09-15T12:00:00.000Z"), "September 15, 2026");
    assert.equal(formatBlogDate("2026-09-14T16:00:00.000Z"), "September 14, 2026");
    assert.equal(formatBlogDate("2026-08-25T18:00:00.000Z"), "August 25, 2026");
    assert.equal(formatBlogDate("2026-08-03T17:00:00.000Z"), "August 3, 2026");
    assert.equal(formatBlogDate("2026-06-26T15:00:00.000Z"), "June 26, 2026");
    assert.equal(relatedChapterHref("ch3"), "/book/ch3");
    assert.equal(relatedChapterHref("ch5"), "/book/ch5");
  });

  it("names related chapters in prose without course-disclaimer copy", () => {
    const banned =
      /optional further reading|not required for (?:labs or )?grades|CS 4550|CS 5610/i;
    for (const post of BLOG_POSTS) {
      const body = post.intro.join(" ");
      assert.doesNotMatch(body, banned, post.slug);
      for (const chapter of post.relatedChapters ?? []) {
        assert.match(
          body,
          new RegExp(`\\b${relatedChapterLabel(chapter)}\\b`),
          `${post.slug} ${chapter}`,
        );
      }
    }
  });

  it("does not invent quotes or unstated dates in intros", () => {
    for (const post of BLOG_POSTS) {
      const body = post.intro.join(" ");
      assert.doesNotMatch(body, /[“”]/);
      assert.doesNotMatch(body, /\b20\d{2}-\d{2}-\d{2}\b/);
    }
    const security = getBlogPost("august-2026-nextjs-security-release");
    assert.match(security?.intro.join(" ") ?? "", /August 25, 2026/);
    assert.match(security?.intro.join(" ") ?? "", /v16\.3\.3/);
    assert.match(security?.intro.join(" ") ?? "", /v15\.5\.24/);
    const release = getBlogPost("nextjs-16-3-instant-navigations");
    assert.match(release?.intro.join(" ") ?? "", /Instant Navigations/);
    assert.match(release?.intro.join(" ") ?? "", /90%/);
    const ai = getBlogPost("nextjs-16-3-ai-improvements");
    assert.match(ai?.intro.join(" ") ?? "", /AGENTS\.md/);
    assert.match(ai?.intro.join(" ") ?? "", /next-dev-loop/);

    const react = getBlogPost("react-19-3");
    assert.match(react?.intro.join(" ") ?? "", /View Transition/);
    assert.match(react?.intro.join(" ") ?? "", /FragmentInstance/);
    assert.match(react?.intro.join(" ") ?? "", /use\(browser\(\)\)/);
    assert.match(react?.intro.join(" ") ?? "", /Trusted Types/);
    const sdk = getBlogPost("ai-sdk-7-agent-platform");
    assert.match(sdk?.intro.join(" ") ?? "", /WorkflowAgent/);
    assert.match(sdk?.intro.join(" ") ?? "", /realtime/);
    const proxy = getBlogPost("nextjs-security-middleware-proxy");
    assert.match(proxy?.intro.join(" ") ?? "", /CVE-2025-29927/);
    assert.match(proxy?.intro.join(" ") ?? "", /proxy\.ts/);

    const cdn = getBlogPost("vercel-cdn-metadata-shards-91");
    assert.match(cdn?.intro.join(" ") ?? "", /91%/);
    assert.match(cdn?.intro.join(" ") ?? "", /indexed shards/);
    const projects = getBlogPost("cursor-projects-coordinator");
    assert.match(projects?.intro.join(" ") ?? "", /Projects coordinator/);
    assert.match(projects?.intro.join(" ") ?? "", /Cursor reports/);
    const express = getBlogPost("express-august-2026-security-releases");
    assert.match(express?.intro.join(" ") ?? "", /multer 2\.3\.0/);
    assert.match(express?.intro.join(" ") ?? "", /CVE-2026-77078/);

    const flatRate = getBlogPost("vercel-flat-rate-cdn");
    assert.match(flatRate?.intro.join(" ") ?? "", /Flat Rate CDN/);
    assert.match(flatRate?.intro.join(" ") ?? "", /Jas Garcha/);
    const agentsApi = getBlogPost("openai-agents-api");
    assert.match(agentsApi?.intro.join(" ") ?? "", /Agents API/);
    assert.match(agentsApi?.intro.join(" ") ?? "", /Codex harness/);
    const runSdk = getBlogPost("vercel-run-sdk");
    assert.match(runSdk?.intro.join(" ") ?? "", /QuickJS/);
    assert.match(runSdk?.intro.join(" ") ?? "", /hostFunctions/);

    const fluid = getBlogPost("vercel-fluid-compute-any-shape");
    assert.match(fluid?.intro.join(" ") ?? "", /Luke Phillips-Sheard/);
    assert.match(fluid?.intro.join(" ") ?? "", /Active CPU/);
    const codingTools = getBlogPost("claude-code-vs-copilot-vs-cursor-2026");
    assert.match(codingTools?.intro.join(" ") ?? "", /Claude Code/);
    assert.match(codingTools?.intro.join(" ") ?? "", /GitHub Copilot/);
    const shaiHulud = getBlogPost("shai-hulud-npm-resurfaces-111-days");
    assert.match(shaiHulud?.intro.join(" ") ?? "", /111 days/);
    assert.match(
      shaiHulud?.intro.join(" ") ?? "",
      /e37e3ddeeaaa9e0c4fdbcb829b4895a6521031c80053fc436625b61e6ee5b1a6/,
    );

    const tailscale = getBlogPost("tailscale-aperture-ai-gateway");
    assert.match(tailscale?.intro.join(" ") ?? "", /Eric Dodds/);
    assert.match(tailscale?.intro.join(" ") ?? "", /AI Gateway/);
    assert.match(tailscale?.intro.join(" ") ?? "", /lethal trifecta/);
    const designMd = getBlogPost("vercel-design-md-agents");
    assert.match(designMd?.intro.join(" ") ?? "", /John Phamous/);
    assert.match(designMd?.intro.join(" ") ?? "", /design\.md/);
    assert.match(designMd?.intro.join(" ") ?? "", /57%/);
    const libheif = getBlogPost("libheif-avif-rce-disclosure");
    assert.match(libheif?.intro.join(" ") ?? "", /Karim Rahal/);
    assert.match(libheif?.intro.join(" ") ?? "", /libheif/);
    assert.match(libheif?.intro.join(" ") ?? "", /v1\.23\.2/);

    const nextSecurity = getBlogPost("nextjs-upcoming-security-release-sept-22-2026");
    assert.match(nextSecurity?.intro.join(" ") ?? "", /16\.3\.6/);
    assert.match(nextSecurity?.intro.join(" ") ?? "", /15\.5\.26/);
    assert.match(nextSecurity?.intro.join(" ") ?? "", /GHSA-vcvr-r3jv-pc5j/);
    const aiGatewayIndex = getBlogPost("ai-gateway-production-index-september-2026");
    assert.match(aiGatewayIndex?.intro.join(" ") ?? "", /Amelia Charles/);
    assert.match(aiGatewayIndex?.intro.join(" ") ?? "", /56%/);
    assert.match(aiGatewayIndex?.intro.join(" ") ?? "", /GPT-6 Astra/);
    const delphi = getBlogPost("delphi-100-deploys-day-python-vercel");
    assert.match(delphi?.intro.join(" ") ?? "", /Susan Aziz/);
    assert.match(delphi?.intro.join(" ") ?? "", /Spencer Schoeben/);
    assert.match(delphi?.intro.join(" ") ?? "", /100\+/);

    const nextPatch = getBlogPost("nextjs-security-update-sept-22-2026");
    assert.match(nextPatch?.intro.join(" ") ?? "", /16\.3\.6/);
    assert.match(nextPatch?.intro.join(" ") ?? "", /ImageResponse/);
    assert.match(nextPatch?.intro.join(" ") ?? "", /GHSA-vcvr/);
    const jev = getBlogPost("ai-gateway-jev-fastest-adopted");
    assert.match(jev?.intro.join(" ") ?? "", /Jev/);
    assert.match(jev?.intro.join(" ") ?? "", /13%/);
    assert.match(jev?.intro.join(" ") ?? "", /Amelia Charles/);
    const featured = getBlogPost("featured-100k-media-pitches-vercel");
    assert.match(featured?.intro.join(" ") ?? "", /Featured/);
    assert.match(featured?.intro.join(" ") ?? "", /Susan Aziz/);
    assert.match(featured?.intro.join(" ") ?? "", /100,000/);
    assert.match(featured?.intro.join(" ") ?? "", /Workflow SDK/);

    const chunking = getBlogPost("turbopack-chunking-nextjs-16-3");
    assert.match(chunking?.intro.join(" ") ?? "", /generateComponentChunks/);
    assert.match(chunking?.intro.join(" ") ?? "", /38 requests/);
    assert.match(chunking?.intro.join(" ") ?? "", /Turbopack defaults/);
    const closability = getBlogPost("nextjs-closed-1500-github-issues-agent");
    assert.match(closability?.intro.join(" ") ?? "", /1,462/);
    assert.match(closability?.intro.join(" ") ?? "", /closability/);
    assert.match(closability?.intro.join(" ") ?? "", /eve/);
    const sept30 = getBlogPost("nextjs-upcoming-security-release-sept-30-2026");
    assert.match(sept30?.intro.join(" ") ?? "", /16\.3\.7/);
    assert.match(sept30?.intro.join(" ") ?? "", /15\.5\.27/);
    assert.match(sept30?.intro.join(" ") ?? "", /September 30/);

    const klaviyo = getBlogPost("klaviyo-356-internal-apps-vercel");
    assert.match(klaviyo?.intro.join(" ") ?? "", /Susan Aziz/);
    assert.match(klaviyo?.intro.join(" ") ?? "", /Kevin Sundstrom/);
    assert.match(klaviyo?.intro.join(" ") ?? "", /356/);
    assert.match(klaviyo?.intro.join(" ") ?? "", /K:Forge/);
    const connect = getBlogPost("vercel-connect-credential-sprawl-ga");
    assert.match(connect?.intro.join(" ") ?? "", /Hedi Zandi/);
    assert.match(connect?.intro.join(" ") ?? "", /getToken/);
    assert.match(connect?.intro.join(" ") ?? "", /100 connectors/);
    const bounty = getBlogPost("vercel-bug-bounty-public");
    assert.match(bounty?.intro.join(" ") ?? "", /Caleb An/);
    assert.match(bounty?.intro.join(" ") ?? "", /Talha Tariq/);
    assert.match(bounty?.intro.join(" ") ?? "", /HackerOne/);
    assert.match(bounty?.intro.join(" ") ?? "", /React2Shell/);

    const instantNav = getBlogPost("nextjs-16-3-app-like-experiences");
    assert.match(instantNav?.intro.join(" ") ?? "", /Instant Navigations/);
    assert.match(instantNav?.intro.join(" ") ?? "", /Partial Prefetching/);
    assert.match(instantNav?.intro.join(" ") ?? "", /instant\(\)/);
    const agentSkills = getBlogPost("state-of-agent-skills-one-million");
    assert.match(agentSkills?.intro.join(" ") ?? "", /Amelia Charles/);
    assert.match(agentSkills?.intro.join(" ") ?? "", /280 million/);
    assert.match(agentSkills?.intro.join(" ") ?? "", /skills\.sh/);
    const tanstackWorm = getBlogPost("tanstack-query-codegen-supply-chain-worm");
    assert.match(tanstackWorm?.intro.join(" ") ?? "", /Ilyas Makari/);
    assert.match(tanstackWorm?.intro.join(" ") ?? "", /Trinitite/);
    assert.match(tanstackWorm?.intro.join(" ") ?? "", /binding\.gyp/);
  });

  it("dates the September 14 catch-up posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "react-19-3",
      "ai-sdk-7-agent-platform",
      "nextjs-security-middleware-proxy",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 14, 2026");
    }
  });

  it("dates the September 28 digest posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "nextjs-16-3-app-like-experiences",
      "state-of-agent-skills-one-million",
      "tanstack-query-codegen-supply-chain-worm",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(post.publishedAt, "2026-09-28T12:00:00.000Z");
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 28, 2026");
    }
  });

  it("dates the September 25 digest posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "klaviyo-356-internal-apps-vercel",
      "vercel-connect-credential-sprawl-ga",
      "vercel-bug-bounty-public",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(post.publishedAt, "2026-09-25T12:00:00.000Z");
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 25, 2026");
    }
  });

  it("dates the September 24 digest posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "turbopack-chunking-nextjs-16-3",
      "nextjs-closed-1500-github-issues-agent",
      "nextjs-upcoming-security-release-sept-30-2026",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(post.publishedAt, "2026-09-24T12:00:00.000Z");
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 24, 2026");
    }
  });

  it("dates the September 23 digest posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "nextjs-security-update-sept-22-2026",
      "ai-gateway-jev-fastest-adopted",
      "featured-100k-media-pitches-vercel",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(post.publishedAt, "2026-09-23T12:00:00.000Z");
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 23, 2026");
    }
  });

  it("dates the September 22 digest posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "nextjs-upcoming-security-release-sept-22-2026",
      "ai-gateway-production-index-september-2026",
      "delphi-100-deploys-day-python-vercel",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(post.publishedAt, "2026-09-22T12:00:00.000Z");
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 22, 2026");
    }
  });

  it("dates the September 21 digest posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "tailscale-aperture-ai-gateway",
      "vercel-design-md-agents",
      "libheif-avif-rce-disclosure",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(post.publishedAt, "2026-09-21T12:00:00.000Z");
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 21, 2026");
    }
  });

  it("dates the September 17 digest posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "vercel-fluid-compute-any-shape",
      "claude-code-vs-copilot-vs-cursor-2026",
      "shai-hulud-npm-resurfaces-111-days",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(post.publishedAt, "2026-09-17T12:00:00.000Z");
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 17, 2026");
    }
  });

  it("dates the September 16 digest posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "vercel-flat-rate-cdn",
      "openai-agents-api",
      "vercel-run-sdk",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(post.publishedAt, "2026-09-16T12:00:00.000Z");
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 16, 2026");
    }
  });

  it("dates the September 15 digest posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "vercel-cdn-metadata-shards-91",
      "cursor-projects-coordinator",
      "express-august-2026-security-releases",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(post.publishedAt, "2026-09-15T12:00:00.000Z");
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 15, 2026");
    }
  });
});

describe("blog affiliate", () => {
  it("tags curated ASINs with the Associates tag and disclosure", () => {
    assert.equal(DEFAULT_ASSOCIATE_TAG, "jannunzi04-20");
    assert.equal(amazonAssociateTag(undefined), "jannunzi04-20");
    assert.equal(amazonAssociateTag("  custom-20  "), "custom-20");
    assert.equal(BLOG_AFFILIATE_BOOKS.length, 2);
    for (const book of BLOG_AFFILIATE_BOOKS) {
      assert.match(book.asin, /^[A-Z0-9]{10}$/);
      assert.match(book.coverUrl, /^https:\/\/covers\.openlibrary\.org\/b\/id\/\d+-M\.jpg$/);
      assert.equal(
        amazonProductUrl(book.asin),
        `https://www.amazon.com/dp/${book.asin}?tag=jannunzi04-20`,
      );
    }
    assert.match(ASSOCIATES_DISCLOSURE, /Amazon Associate/i);
  });
});

describe("blog routes and nav", () => {
  it("adds Blog to the main course nav near Book", () => {
    const hrefs = COURSE_INFO_LINKS.map((link) => link.href);
    assert.ok(hrefs.includes("/blog"));
    assert.ok(hrefs.indexOf("/blog") === hrefs.indexOf("/book") + 1);
    assert.equal(
      COURSE_INFO_LINKS.find((link) => link.href === "/blog")?.label,
      "Blog",
    );
    assert.match(
      read(join(process.cwd(), "app/syllabus/components/SyllabusNav.tsx")),
      /href="\/blog">Blog</,
    );
  });

  it("keeps index and slug route modules that render posts and source links", () => {
    const index = read(join(BLOG_APP, "page.tsx"));
    const post = read(join(BLOG_APP, "[slug]/page.tsx"));
    const ad = read(join(BLOG_APP, "components/BlogAdSlot.tsx"));
    const source = read(join(BLOG_APP, "components/BlogSourceLink.tsx"));

    assert.match(index, /listBlogPosts/);
    assert.match(index, /BlogAdSlot/);
    assert.match(index, /instructor-curated digests, not original reporting/i);
    assert.match(index, /always links to the original source/);
    assert.doesNotMatch(index, /optional further reading/i);
    assert.doesNotMatch(index, /not required for grades/i);
    assert.doesNotMatch(index, /CS 4550|CS 5610/);
    assert.match(index, /href=\{`\/blog\/\$\{post\.slug\}`\}/);

    assert.match(post, /generateStaticParams/);
    assert.match(post, /getBlogPost/);
    assert.match(post, /notFound/);
    assert.match(post, /BlogAdSlot/);
    assert.match(post, /BlogSourceLink/);
    assert.match(post, /Instructor-curated digest, not original reporting/);
    assert.doesNotMatch(post, /optional further reading/i);
    assert.doesNotMatch(post, /not required for grades/i);
    assert.doesNotMatch(post, /CS 4550|CS 5610/);
    const layout = read(join(BLOG_APP, "layout.tsx"));
    assert.match(layout, /Instructor-curated news digests\./);
    assert.doesNotMatch(layout, /optional further reading/i);
    assert.doesNotMatch(layout, /not required for grades/i);

    assert.match(source, /rel="noopener noreferrer"/);
    assert.match(source, /Read original/);
    assert.match(ad, /Sponsored \/ further reading/);
    assert.match(ad, /SponsoredBookItem/);
    assert.match(ad, /ASSOCIATES_DISCLOSURE/);
    assert.doesNotMatch(ad, /import .*BookAffiliateBanner/);
    const item = read(
      join(process.cwd(), "app/course-info/SponsoredBookItem.tsx"),
    );
    const cover = read(
      join(process.cwd(), "app/course-info/SponsoredBookCover.tsx"),
    );
    assert.match(item, /SponsoredBookCover/);
    assert.match(item, /noopener noreferrer nofollow sponsored/);
    assert.match(cover, /alt=\{title\}/);
    assert.match(cover, /affiliateCoverSources/);
    assert.doesNotMatch(index + post, /import .*BookAffiliateBanner/);

    const bookLayout = read(join(process.cwd(), "app/book/layout.tsx"));
    assert.match(bookLayout, /BookAffiliateBanner/);
    assert.doesNotMatch(bookLayout, /BlogAdSlot/);
  });

  it("does not mount blog ads on Kambaz LMS routes", () => {
    for (const file of walkTsx(KAMBAZ_APP)) {
      const source = read(file);
      assert.doesNotMatch(source, /BlogAdSlot/);
      assert.doesNotMatch(source, /lib\/blog\/affiliate/);
      assert.doesNotMatch(source, /from ["']@\/lib\/blog/);
    }
  });
});
