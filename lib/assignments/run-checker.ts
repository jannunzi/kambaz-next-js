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
import { htmlHasAllIds, htmlHasAnyId, htmlHasId } from "./html";
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
  return allOk && anyOk;
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

  if (githubRaw) {
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
    } else if (parsed && !parsed.ok) {
      passed = false;
      message = parsed.message;
    } else if (named !== branch.branch) {
      passed = false;
      message = branch.wrongBranchMessage;
    } else {
      passed = true;
      message = branch.passMessage;
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

  if (!vercel.ok) {
    return results;
  }

  const crawled = await crawlDeploy({
    deployUrl: vercel.href,
    seedPaths: config.seedPaths,
    verifyPaths: Object.values(config.verifyPaths),
    followupCap: config.followupCap,
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
    const scope = spec.htmlScope ?? (spec.groupId === "lab" ? "labs" : "all");
    const html =
      scope === "labs" ? crawled.labsHtml || crawled.allHtml : crawled.allHtml;
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
