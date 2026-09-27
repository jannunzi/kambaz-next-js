import { evaluateRubricSpec } from "./a1-rubric";
import type { AssignmentChecker } from "./checker-types";
import type {
  AssignmentCheckProbes,
  AssignmentCheckResult,
} from "./check-types";
import { crawlDeploy, submittedUrlOpens } from "./crawl";
import {
  classifyDeployFetch,
  deployOpenFailureMessage,
} from "./fetch-classify";
import { htmlHasAllIds, htmlHasAnchorPath, htmlHasAnyId, htmlHasId } from "./html";
import { hasUsableNameQuery, htmlHasStudentName, type NameQuery } from "./names";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import {
  githubUrlBranch,
  looksLikeDeployUrl,
  parseGithubRepoUrl,
} from "./urls";

function check(
  id: string,
  label: string,
  passed: boolean,
  message: string,
  extra: Partial<AssignmentCheckResult> = {},
): AssignmentCheckResult {
  return { id, label, passed, message, ...extra };
}

function labsNavPassed(
  html: string,
  rule: AssignmentChecker["delivery"]["labsNav"],
): boolean {
  const allOk = !rule.allIds?.length || htmlHasAllIds(html, rule.allIds).ok;
  const anyOk = !rule.anyIds?.length || htmlHasAnyId(html, rule.anyIds);
  const hrefsOk =
    !rule.allHrefs?.length ||
    rule.allHrefs.every((path) => htmlHasAnchorPath(html, path));
  return allOk && anyOk && hrefsOk;
}

export async function runChecker(
  config: AssignmentChecker,
  input: {
    githubUrl?: string;
    vercelUrl: string;
    nameQuery?: NameQuery;
    probes: AssignmentCheckProbes;
  },
): Promise<AssignmentCheckResult[]> {
  const results: AssignmentCheckResult[] = [];
  const githubRaw = input.githubUrl?.trim() ?? "";
  const { delivery } = config;

  if (githubRaw && !delivery.branch) {
    const github = parseGithubRepoUrl(githubRaw);
    results.push(
      check(
        "github-url",
        "GitHub repository URL",
        github.ok,
        github.ok ? ASSIGNMENT_STUDENT_COPY.githubOk : github.message,
        { criterionId: delivery.github.criterionId, groupId: delivery.github.groupId },
      ),
    );
    if (github.ok && input.probes.probeUrl) {
      const probe = await input.probes.probeUrl(github.repo.href);
      results.push(
        check(
          "github-public",
          "GitHub repository is public",
          probe.ok,
          probe.ok
            ? ASSIGNMENT_STUDENT_COPY.githubOk
            : probe.status === 404
              ? ASSIGNMENT_STUDENT_COPY.githubPrivate
              : probe.message || ASSIGNMENT_STUDENT_COPY.githubUnreachable,
          { criterionId: delivery.github.criterionId, groupId: delivery.github.groupId },
        ),
      );
    }
  }

  if (delivery.branch) {
    const branch = delivery.branch;
    const parsed = githubRaw ? parseGithubRepoUrl(githubRaw) : null;
    const named = githubRaw ? githubUrlBranch(githubRaw) : null;
    let passed = false;
    let message = branch.missingMessage;
    if (!githubRaw) {
      passed = false;
      message = branch.missingMessage;
    } else if (!parsed || !parsed.ok) {
      passed = false;
      message = parsed && !parsed.ok ? parsed.message : branch.missingMessage;
    } else if (named !== branch.branch) {
      passed = false;
      message = branch.wrongBranchMessage;
    } else if (!input.probes.probeUrl) {
      passed = false;
      message = branch.notFoundMessage;
    } else {
      const treeUrl = `https://github.com/${parsed.repo.owner}/${parsed.repo.repo}/tree/${encodeURIComponent(branch.branch)}`;
      const probe = await input.probes.probeUrl(treeUrl);
      if (probe.ok && probe.status === 200) {
        passed = true;
        message = branch.passMessage;
      } else if (probe.status === 404) {
        passed = false;
        message = branch.notFoundMessage;
      } else {
        passed = false;
        message = probe.message || branch.notFoundMessage;
      }
    }
    results.push(
      check(branch.criterionId, branch.label, passed, message, {
        criterionId: branch.criterionId,
        groupId: branch.groupId,
      }),
    );
  }

  const vercel = looksLikeDeployUrl(input.vercelUrl);
  results.push(
    check(
      delivery.vercelCriterionId,
      "Vercel deployment",
      vercel.ok,
      vercel.ok ? ASSIGNMENT_STUDENT_COPY.vercelOk : vercel.message,
      { criterionId: delivery.vercelCriterionId, groupId: "delivery" },
    ),
  );

  if (
    vercel.ok &&
    delivery.previewHostIncludes &&
    !new URL(vercel.href).hostname.toLowerCase().includes(delivery.previewHostIncludes.toLowerCase())
  ) {
    results.push(
      check(
        `${delivery.vercelCriterionId}-branch-host`,
        "Vercel branch deployment",
        false,
        delivery.previewHostMessage ||
          `Submit the branch preview URL (hostname contains ${delivery.previewHostIncludes}).`,
        { criterionId: delivery.vercelCriterionId, groupId: "delivery" },
      ),
    );
  }

  if (!vercel.ok) {
    return results;
  }

  const crawled = await crawlDeploy({
    deployUrl: vercel.href,
    seedPaths: config.seedPaths,
    verifyPaths: Object.values(config.verifyPaths),
    followupCap: config.followupCap,
    extraCourseScreens: config.extraCourseScreens,
    getHtml: async (url) => classifyDeployFetch(await input.probes.getHtml(url)),
  });
  if (!crawled.ok) {
    results.push(
      check(
        `${delivery.vercelCriterionId}-open`,
        "Deployment opens without signing in",
        false,
        crawled.message,
        { criterionId: delivery.vercelCriterionId, groupId: "delivery" },
      ),
    );
    return results;
  }

  const opened = submittedUrlOpens(vercel.href, crawled.pages);
  const openedOk = Boolean(opened?.ok);
  results.push(
    check(
      `${delivery.vercelCriterionId}-open`,
      "Deployment opens without signing in",
      openedOk,
      openedOk
        ? "The deployment responded successfully."
        : deployOpenFailureMessage(opened),
      { criterionId: delivery.vercelCriterionId, groupId: "delivery" },
    ),
  );

  if (!openedOk) {
    return results;
  }

  const labsNav = labsNavPassed(crawled.labsHtml, delivery.labsNav);
  results.push(
    check(
      delivery.labsNav.criterionId,
      delivery.labsNav.label,
      labsNav,
      labsNav ? delivery.labsNav.passMessage : delivery.labsNav.failMessage,
      {
        criterionId: delivery.labsNav.criterionId,
        groupId: delivery.labsNav.groupId,
      },
    ),
  );

  const githubHook = htmlHasId(crawled.labsHtml, "wd-github");
  results.push(
    check(
      `${delivery.github.criterionId}-link`,
      delivery.github.linkLabel,
      githubHook,
      githubHook ? delivery.github.linkPassMessage : delivery.github.linkFailMessage,
      {
        criterionId: delivery.github.criterionId,
        groupId: delivery.github.groupId,
      },
    ),
  );

  if (
    delivery.name &&
    input.nameQuery &&
    hasUsableNameQuery(input.nameQuery)
  ) {
    const named = htmlHasStudentName(crawled.labsHtml, input.nameQuery);
    results.push(
      check(
        delivery.name.criterionId,
        delivery.name.label,
        named,
        named ? ASSIGNMENT_STUDENT_COPY.nameOk : ASSIGNMENT_STUDENT_COPY.nameMissing,
        { criterionId: delivery.name.criterionId, groupId: delivery.name.groupId },
      ),
    );
  }

  for (const spec of config.autoSpecs) {
    let html: string;
    if (spec.pagePath) {
      const page = crawled.pages.find((entry) => entry.path === spec.pagePath);
      if (!page?.result.ok) {
        const status = page && !page.result.ok ? page.result.status : undefined;
        const message =
          status === 404
            ? `${spec.failMessage} ${spec.pagePath} returned HTTP 404.`
            : `${spec.failMessage} Could not open ${spec.pagePath}.`;
        results.push(
          check(spec.criterionId, spec.label, false, message, {
            criterionId: spec.criterionId,
            groupId: spec.groupId,
          }),
        );
        continue;
      }
      html = page.result.html;
    } else {
      const scope = spec.htmlScope ?? (spec.groupId === "lab" ? "labs" : "all");
      html = scope === "labs" ? crawled.labsHtml || crawled.allHtml : crawled.allHtml;
    }
    const judged = evaluateRubricSpec(spec, html);
    results.push(
      check(spec.criterionId, spec.label, judged.passed, judged.message, {
        criterionId: spec.criterionId,
        groupId: spec.groupId,
      }),
    );
  }

  for (const row of config.manualRows) {
    results.push(
      check(row.id, row.label, false, ASSIGNMENT_STUDENT_COPY.manualCheckHint, {
        criterionId: row.id,
        groupId: row.groupId,
        skipped: true,
      }),
    );
  }

  return results;
}
