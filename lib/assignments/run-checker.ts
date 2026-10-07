import { evaluateRubricSpec, specUsesIds } from "./a1-rubric";
import type { A1RubricAutoSpec } from "./a1-rubric-types";
import type { StructureContext } from "./a1-structure";
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
import { NEEDS_RECHECK_ROW_MESSAGE, needsReviewMessage } from "./check-status";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import {
  a2GithubSchemeMessage,
  githubUrlBranch,
  isVercelBranchPreviewHost,
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
  siteHost?: string,
): boolean {
  const allOk = !rule.allIds?.length || htmlHasAllIds(html, rule.allIds).ok;
  const anyOk = !rule.anyIds?.length || htmlHasAnyId(html, rule.anyIds);
  const hrefsOk =
    !rule.allHrefs?.length ||
    rule.allHrefs.every((path) => htmlHasAnchorPath(html, path, siteHost));
  return allOk && anyOk && hrefsOk;
}

/**
 * The deploy could not be opened, so nothing on it was checked. Every
 * deploy-dependent row is skipped and flagged so no score is implied.
 */
function pushNeedsRecheckRows(
  results: AssignmentCheckResult[],
  config: AssignmentChecker,
): void {
  const { delivery } = config;
  const rows: { id: string; label: string; criterionId: string; groupId: string }[] = [
    {
      id: delivery.labsNav.criterionId,
      label: delivery.labsNav.label,
      criterionId: delivery.labsNav.criterionId,
      groupId: delivery.labsNav.groupId,
    },
    {
      id: `${delivery.github.criterionId}-link`,
      label: delivery.github.linkLabel,
      criterionId: delivery.github.criterionId,
      groupId: delivery.github.groupId,
    },
  ];
  if (delivery.name) {
    rows.push({
      id: delivery.name.criterionId,
      label: delivery.name.label,
      criterionId: delivery.name.criterionId,
      groupId: delivery.name.groupId,
    });
  }
  for (const spec of config.autoSpecs) {
    rows.push({
      id: spec.criterionId,
      label: spec.label,
      criterionId: spec.criterionId,
      groupId: spec.groupId,
    });
  }
  for (const row of rows) {
    results.push(
      check(row.id, row.label, false, NEEDS_RECHECK_ROW_MESSAGE, {
        criterionId: row.criterionId,
        groupId: row.groupId,
        skipped: true,
        needsRecheck: true,
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
}

/**
 * Primary rule first (ids and other requirements). When ids are optional and
 * the primary rule misses, fall back to page structure. A miss with no
 * reliable structure is "Needs TA review": not a fail, no points taken off.
 */
function judgeSpec(
  config: AssignmentChecker,
  spec: A1RubricAutoSpec,
  html: string,
  ctx: StructureContext,
): AssignmentCheckResult {
  const extra = { criterionId: spec.criterionId, groupId: spec.groupId };
  const primary = evaluateRubricSpec(spec, html, { siteHost: ctx.siteHost });
  if (primary.passed || !config.idsOptional) {
    return check(spec.criterionId, spec.label, primary.passed, primary.message, extra);
  }
  const fallback = config.structureFallbacks?.[spec.criterionId];
  if (!fallback) {
    if (specUsesIds(spec)) {
      return check(spec.criterionId, spec.label, true, needsReviewMessage(), {
        ...extra,
        needsReview: true,
      });
    }
    return check(spec.criterionId, spec.label, false, primary.message, extra);
  }
  const verdict = fallback.test(ctx);
  if (verdict === true) {
    return check(
      spec.criterionId,
      spec.label,
      true,
      `Found ${fallback.looksFor} on the page.`,
      extra,
    );
  }
  if (verdict === "review" || fallback.onMiss === "review") {
    return check(spec.criterionId, spec.label, true, needsReviewMessage(fallback.looksFor), {
      ...extra,
      needsReview: true,
    });
  }
  // A real structural miss. Keep the book's instruction (which names the id).
  return check(spec.criterionId, spec.label, false, spec.failMessage, extra);
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
    const schemeMessage = githubRaw ? a2GithubSchemeMessage(githubRaw) : null;
    let passed = false;
    let message = branch.missingMessage;
    if (!githubRaw) {
      passed = false;
      message = branch.missingMessage;
    } else if (schemeMessage) {
      passed = false;
      message = schemeMessage;
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
      } else if (probe.status === 403 || probe.status === 429) {
        passed = false;
        message = ASSIGNMENT_STUDENT_COPY.githubRetry;
      } else if (!probe.ok && probe.status === 404) {
        passed = false;
        message = branch.notFoundMessage;
      } else {
        passed = false;
        message = probe.ok
          ? `GitHub /tree/a2 responded HTTP ${probe.status}, not 200.`
          : probe.message || branch.notFoundMessage;
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

  const siteHost = vercel.ok ? new URL(vercel.href).hostname : "";
  if (
    vercel.ok &&
    delivery.previewBranch &&
    !isVercelBranchPreviewHost(siteHost, delivery.previewBranch)
  ) {
    results.push(
      check(
        `${delivery.vercelCriterionId}-branch-host`,
        "Vercel branch deployment",
        false,
        delivery.previewHostMessage ||
          `Submit the ${delivery.previewBranch} branch preview URL on .vercel.app. Staff can override this at grading.`,
        { criterionId: delivery.vercelCriterionId, groupId: "delivery" },
      ),
    );
  }

  if (!vercel.ok) {
    results[results.length - 1] = {
      ...results[results.length - 1],
      needsRecheck: true,
    };
    pushNeedsRecheckRows(results, config);
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
        { criterionId: delivery.vercelCriterionId, groupId: "delivery", needsRecheck: true },
      ),
    );
    pushNeedsRecheckRows(results, config);
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
      {
        criterionId: delivery.vercelCriterionId,
        groupId: "delivery",
        ...(openedOk ? {} : { needsRecheck: true }),
      },
    ),
  );

  if (!openedOk) {
    pushNeedsRecheckRows(results, config);
    return results;
  }

  const labsNav =
    labsNavPassed(crawled.labsHtml, delivery.labsNav, siteHost) ||
    Boolean(delivery.labsNav.structurePassed?.(crawled.labsHtml, siteHost));
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

  const githubById = htmlHasId(crawled.labsHtml, "wd-github");
  const githubHook =
    githubById || Boolean(delivery.github.linkStructurePassed?.(crawled.labsHtml));
  results.push(
    check(
      `${delivery.github.criterionId}-link`,
      delivery.github.linkLabel,
      githubHook,
      githubHook
        ? githubById
          ? delivery.github.linkPassMessage
          : "Found a GitHub link on Labs."
        : delivery.github.linkFailMessage,
      {
        criterionId: delivery.github.criterionId,
        groupId: delivery.github.groupId,
      },
    ),
  );

  if (delivery.name) {
    const canCheckName = Boolean(
      input.nameQuery && hasUsableNameQuery(input.nameQuery),
    );
    if (canCheckName && input.nameQuery) {
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
    } else {
      results.push(
        check(
          delivery.name.criterionId,
          delivery.name.label,
          false,
          ASSIGNMENT_STUDENT_COPY.nameCheckNeedsRoster,
          {
            criterionId: delivery.name.criterionId,
            groupId: delivery.name.groupId,
            skipped: true,
          },
        ),
      );
    }
  }

  const structure: StructureContext = {
    labsHtml: crawled.labsHtml,
    allHtml: crawled.allHtml,
    pages: crawled.pages.flatMap((page) =>
      page.result.ok ? [{ path: page.path, html: page.result.html }] : [],
    ),
    siteHost,
  };

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
    results.push(judgeSpec(config, spec, html, structure));
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
