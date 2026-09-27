import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { criterionVerifyUrl } from "./verify-urls";
import {
  a1SeedUrls,
  deployOriginFromUrl,
  htmlLooksLikeVercelAuthWall,
  isBlockedHostname,
  isCourseSiteUrl,
  isVercelAuthWallUrl,
  labsUrlFromDeploy,
  a2GithubSchemeMessage,
  isVercelBranchPreviewHost,
  looksLikeDeployUrl,
  parseGithubRepoUrl,
  parseHttpsUrl,
} from "./urls";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";

describe("parseHttpsUrl", () => {
  it("accepts https and rejects http or garbage", () => {
    assert.equal(parseHttpsUrl("https://example.com/app").ok, true);
    assert.equal(parseHttpsUrl("http://example.com").ok, false);
    assert.equal(parseHttpsUrl("not a url").ok, false);
    assert.equal(parseHttpsUrl("").ok, false);
  });
});

describe("looksLikeDeployUrl", () => {
  it("requires https and rejects localhost", () => {
    assert.equal(looksLikeDeployUrl("https://webdev-a1.vercel.app").ok, true);
    assert.equal(looksLikeDeployUrl("https://my-app.vercel.app/labs").ok, true);
    assert.equal(looksLikeDeployUrl("http://webdev-a1.vercel.app").ok, false);
    assert.equal(looksLikeDeployUrl("https://localhost:3000").ok, false);
    assert.equal(looksLikeDeployUrl("http://localhost:3000").ok, false);
    assert.equal(looksLikeDeployUrl("https://127.0.0.1").ok, false);
    const http = looksLikeDeployUrl("http://localhost:3000");
    assert.equal(http.ok, false);
    if (!http.ok) assert.match(http.message, /localhost/i);
  });

  it("rejects the course website and private hosts", () => {
    assert.equal(looksLikeDeployUrl("https://kambaz.dev").ok, false);
    assert.equal(looksLikeDeployUrl("https://www.kambaz.dev/assignments/a1").ok, false);
    assert.equal(
      looksLikeDeployUrl("https://webdev-client.vercel.app").ok,
      false,
    );
    assert.equal(looksLikeDeployUrl("https://192.168.1.10").ok, false);
    assert.equal(looksLikeDeployUrl("https://10.0.0.5/labs").ok, false);
    assert.equal(looksLikeDeployUrl("https://169.254.169.254").ok, false);
    assert.equal(isBlockedHostname("192.168.0.1"), true);
    assert.equal(isBlockedHostname("example.com"), false);
    assert.equal(
      isCourseSiteUrl(new URL("https://kambaz.dev/assignments/a1")),
      true,
    );
    assert.equal(
      isCourseSiteUrl(new URL("https://webdev-client.vercel.app/assignments/a1")),
      true,
    );
    assert.equal(isCourseSiteUrl(new URL("https://jane-a1.vercel.app/labs")), false);
  });
});

describe("parseGithubRepoUrl", () => {
  it("accepts public github.com repo URLs and normalizes them", () => {
    const parsed = parseGithubRepoUrl(
      "https://github.com/jane-doe/webdev-client.git",
    );
    assert.equal(parsed.ok, true);
    if (parsed.ok) {
      assert.equal(parsed.repo.owner, "jane-doe");
      assert.equal(parsed.repo.repo, "webdev-client");
      assert.equal(parsed.repo.href, "https://github.com/jane-doe/webdev-client");
    }
    assert.equal(
      parseGithubRepoUrl("https://www.github.com/alex/webdev-client/").ok,
      true,
    );
  });

  it("rejects profiles, gists, http, and the course starter repo", () => {
    assert.equal(parseGithubRepoUrl("https://github.com/jane-doe").ok, false);
    assert.equal(parseGithubRepoUrl("http://github.com/jane-doe/repo").ok, false);
    assert.equal(parseGithubRepoUrl("https://gist.github.com/jane/1").ok, false);
    assert.equal(
      parseGithubRepoUrl("https://github.com/jannunzi/webdev-client").ok,
      false,
    );
    const official = parseGithubRepoUrl(
      "https://github.com/jannunzi/webdev-client.git",
    );
    assert.equal(official.ok, false);
    if (!official.ok) assert.match(official.message, /starter repo/i);
  });
});

describe("auth-wall helpers", () => {
  it("detects Vercel login redirects and SSO html", () => {
    assert.equal(
      isVercelAuthWallUrl("https://vercel.com/sso-api?url=https://x.vercel.app"),
      true,
    );
    assert.equal(isVercelAuthWallUrl("https://my-app.vercel.app/labs"), false);
    assert.equal(
      htmlLooksLikeVercelAuthWall(
        '<a href="https://vercel.com/sso-api">Continue</a>',
      ),
      true,
    );
    assert.equal(
      htmlLooksLikeVercelAuthWall(
        "Turn off Deployment Protection on Vercel as described in the book.",
      ),
      false,
    );
  });

  it("builds a /labs URL from a deploy origin", () => {
    assert.equal(
      labsUrlFromDeploy("https://my-app.vercel.app/"),
      "https://my-app.vercel.app/labs",
    );
    assert.equal(
      labsUrlFromDeploy(
        "https://kambaz-next-js-sp26-git-a1-kenneth-aldridges-projects.vercel.app/account/signin",
      ),
      "https://kambaz-next-js-sp26-git-a1-kenneth-aldridges-projects.vercel.app/labs",
    );
    assert.equal(labsUrlFromDeploy("http://localhost:3000"), null);
  });
});

describe("deploy origin normalization", () => {
  it("strips the submitted path down to the origin", () => {
    const origin = deployOriginFromUrl(
      "https://kambaz-next-js-sp26-git-a1-kenneth-aldridges-projects.vercel.app/account/signin",
    );
    assert.equal(origin.ok, true);
    if (origin.ok) {
      assert.equal(
        origin.href,
        "https://kambaz-next-js-sp26-git-a1-kenneth-aldridges-projects.vercel.app/",
      );
    }
  });

  it("always seeds /, /labs, /labs/lab1, and account screens", () => {
    const seeds = a1SeedUrls(
      "https://kambaz-next-js-sp26-git-a1-kenneth-aldridges-projects.vercel.app/account/signin",
    );
    assert.ok(
      seeds.includes(
        "https://kambaz-next-js-sp26-git-a1-kenneth-aldridges-projects.vercel.app/account/signin",
      ),
    );
    assert.ok(
      seeds.includes(
        "https://kambaz-next-js-sp26-git-a1-kenneth-aldridges-projects.vercel.app/",
      ),
    );
    assert.ok(
      seeds.includes(
        "https://kambaz-next-js-sp26-git-a1-kenneth-aldridges-projects.vercel.app/labs",
      ),
    );
    assert.ok(
      seeds.includes(
        "https://kambaz-next-js-sp26-git-a1-kenneth-aldridges-projects.vercel.app/labs/lab1",
      ),
    );
  });
});

describe("criterion verify URLs", () => {
  it("joins the student deploy origin with the criterion path and check id", () => {
    const origin = "https://jane-a1.vercel.app/account/signin";
    assert.equal(
      criterionVerifyUrl(origin, "a1-lab-heading-tags"),
      "https://jane-a1.vercel.app/labs/lab1#wd-h-tag",
    );
    assert.equal(
      criterionVerifyUrl(origin, "a1-lab-heading-tags-ai"),
      "https://jane-a1.vercel.app/labs/lab1#wd-ai-headings",
    );
    assert.equal(
      criterionVerifyUrl(origin, "a1-lab-forms-oyo"),
      "https://jane-a1.vercel.app/labs/lab1#wd-your-form",
    );
    assert.equal(
      criterionVerifyUrl(origin, "a1-lab-forms-ai"),
      "https://jane-a1.vercel.app/labs/lab1#wd-your-form",
    );
    assert.equal(
      criterionVerifyUrl(origin, "a1-lab-tables-ai"),
      "https://jane-a1.vercel.app/labs/lab1#wd-tables",
    );
    assert.equal(
      criterionVerifyUrl(origin, "a1-lab-anchor"),
      "https://jane-a1.vercel.app/labs/lab1#wd-lipsum",
    );
    assert.equal(
      criterionVerifyUrl(origin, "a1-lab-toc-ai"),
      "https://jane-a1.vercel.app/labs#wd-toc-book-link",
    );
    assert.equal(
      criterionVerifyUrl(origin, "a1-lab-toc-oyo"),
      "https://jane-a1.vercel.app/labs",
    );
    assert.equal(
      criterionVerifyUrl(origin, "a1-kambaz-home"),
      "https://jane-a1.vercel.app/courses/1234/home#wd-home",
    );
    assert.equal(
      criterionVerifyUrl(origin, "a1-kambaz-nav"),
      "https://jane-a1.vercel.app/dashboard",
    );
    assert.equal(
      criterionVerifyUrl(origin, "a1-kambaz-course-nav"),
      "https://jane-a1.vercel.app/courses/1234/home",
    );
    assert.equal(
      criterionVerifyUrl(origin, "a1-delivery-name-section"),
      "https://jane-a1.vercel.app/labs",
    );
    assert.equal(criterionVerifyUrl("", "a1-lab-heading-tags"), null);
    assert.equal(criterionVerifyUrl("not a url", "a1-lab-forms"), null);
    assert.equal(
      criterionVerifyUrl("http://jane-a1.vercel.app", "a1-lab-forms"),
      null,
    );
  });
});

describe("A2 Vercel branch host", () => {
  it("matches -git-a2 on the first label of a .vercel.app host", () => {
    assert.equal(
      isVercelBranchPreviewHost("webdev-client-git-a2-jane.vercel.app", "a2"),
      true,
    );
    assert.equal(isVercelBranchPreviewHost("my-app-git-a2.vercel.app", "a2"), true);
    const truncated = `${"n".repeat(63 - "-git-a2".length)}-git-a2`;
    assert.equal(truncated.length, 63);
    assert.equal(isVercelBranchPreviewHost(`${truncated}.vercel.app`, "a2"), true);
    assert.equal(isVercelBranchPreviewHost("jane-a1.vercel.app", "a2"), false);
    assert.equal(isVercelBranchPreviewHost("foo-git-a20.vercel.app", "a2"), false);
    assert.equal(
      isVercelBranchPreviewHost("webdev-client-git-a2-jane.example.com", "a2"),
      false,
    );
    assert.equal(
      isVercelBranchPreviewHost("preview.my-app-git-a2.vercel.app", "a2"),
      false,
    );
  });
});

describe("A2 GitHub scheme messages", () => {
  it("suggests …/tree/a2 for http and schemeless URLs only", () => {
    assert.equal(
      a2GithubSchemeMessage("http://github.com/jane-doe/webdev-client/tree/a2"),
      ASSIGNMENT_STUDENT_COPY.a2GithubBranchUrl,
    );
    assert.match(ASSIGNMENT_STUDENT_COPY.a2GithubBranchUrl, /tree\/a2/);
    assert.notEqual(
      ASSIGNMENT_STUDENT_COPY.a2GithubBranchUrl,
      ASSIGNMENT_STUDENT_COPY.githubFormat,
    );
    assert.equal(
      a2GithubSchemeMessage("github.com/jane-doe/webdev-client/tree/a2"),
      ASSIGNMENT_STUDENT_COPY.a2GithubBranchUrl,
    );
    assert.equal(
      a2GithubSchemeMessage("https://github.com/jane-doe/webdev-client/tree/a2"),
      null,
    );
  });
});
