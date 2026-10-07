import { evaluateRubricSpec, specUsesIds } from "./a1-rubric";
import type { A1RubricAutoSpec } from "./a1-rubric-types";
import {
  isDefiniteNotFound,
  runFallback,
  targetPages,
  type StructureContext,
  type StructureTarget,
  type AttemptedPage,
  type TargetPages,
} from "./a1-structure";
import { isTemplatePage } from "./a2-structure";
import type { AssignmentChecker, AutoVerdict, FetchTextResult } from "./checker-types";
import type {
  AssignmentCheckProbes,
  AssignmentCheckResult,
} from "./check-types";
import { crawlDeploy, submittedUrlOpens } from "./crawl";
import {
  classifyDeployFetch,
  deployOpenFailureMessage,
} from "./fetch-classify";
import {
  elementsWithId,
  htmlHasAllIds,
  htmlHasAnchorPath,
  htmlHasAnyId,
  htmlHasId,
  isLabsPath,
} from "./html";
import { hasUsableNameQuery, htmlHasStudentName, type NameQuery } from "./names";
import {
  GITHUB_RECHECK_MESSAGE,
  NEEDS_RECHECK_ROW_MESSAGE,
  needsReviewMessage,
} from "./check-status";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import {
  a2GithubSchemeMessage,
  githubUrlBranch,
  isVercelBranchPreviewHost,
  looksLikeDeployUrl,
  parseGithubRepoUrl,
  urlOnDeployOrigin,
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
  hasId: (html: string, id: string) => boolean = htmlHasId,
): boolean {
  const allOk =
    !rule.allIds?.length ||
    (hasId === htmlHasId ? htmlHasAllIds(html, rule.allIds).ok : rule.allIds.every((id) => hasId(html, id)));
  const anyOk =
    !rule.anyIds?.length ||
    (hasId === htmlHasId ? htmlHasAnyId(html, rule.anyIds) : rule.anyIds.some((id) => hasId(html, id)));
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

/** Legacy rule (A2 and any checker without idsOptional): ids as written. */
function judgeLegacySpec(
  spec: A1RubricAutoSpec,
  html: string,
  siteHost: string,
): AssignmentCheckResult {
  const extra = { criterionId: spec.criterionId, groupId: spec.groupId };
  const primary = evaluateRubricSpec(spec, html, { siteHost });
  return check(spec.criterionId, spec.label, primary.passed, primary.message, extra);
}

type Verdict = AutoVerdict;

const DEFAULT_LAB_TARGET: StructureTarget = { kind: "labs" };
const SITE_TARGET: StructureTarget = { kind: "site" };

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function missingPageMessage(target: TargetPages): string {
  const status = target.status ? `returned HTTP ${target.status}` : "was not found";
  return `${capitalize(target.name)} wasn't found on your deploy (${target.example} ${status}), so this item couldn't pass.`;
}

function unreachablePageMessage(target: TargetPages): string {
  const where = target.unreachable.length > 0 ? pathList(target.unreachable) : target.example;
  return `Needs re-check: ${where} on your deploy couldn't be opened (timeout, server error, or login), so this wasn't checked. Not marked wrong; no points taken off.`;
}

/** Paths for messages, e.g. "/labs/lab1" or "/labs/lab1 and /labs/lab2". */
function pathList(pages: readonly { path: string }[]): string {
  const paths = [...new Set(pages.map((page) => page.path))];
  if (paths.length <= 2) return paths.join(" and ");
  return `${paths.slice(0, 2).join(", ")} and ${paths.length - 2} more`;
}

/** Some pages opened, but the one that may hold this item didn't. */
function partlyUnreachableMessage(pages: readonly { path: string }[]): string {
  const list = pathList(pages);
  return `Needs re-check: ${list} on your deploy couldn't be opened (timeout, server error, or login), so this item couldn't be fully checked. Not marked wrong; no points taken off.`;
}

/**
 * A miss is a re-check (points kept) when any page the item may live on
 * couldn't be opened; it is never failed against the pages that did open.
 */
function missVerdict(target: TargetPages, miss: Verdict): Verdict {
  if (miss.kind !== "fail" && miss.kind !== "review") return miss;
  if (target.unreachable.length > 0) {
    return { kind: "unreachable", message: partlyUnreachableMessage(target.unreachable) };
  }
  // A Lab 1 404 is named on every lost Lab item by withLab1NotFoundNote.
  return miss;
}

/**
 * When /labs/lab1 itself returned a definite not-found, every Lab item that
 * lost points says so up front (so the export's shortened feedback keeps it).
 */
function withLab1NotFoundNote(
  results: AssignmentCheckResult[],
  attempted: readonly AttemptedPage[],
): AssignmentCheckResult[] {
  const lab1 = attempted.find((page) => page.path.replace(/\/+$/, "") === "/labs/lab1");
  if (!lab1 || !isDefiniteNotFound(lab1)) return results;
  const note = `The Lab 1 page (/labs/lab1) returned HTTP ${lab1.status ?? 404}.`;
  return results.map((row) => {
    if (row.groupId !== "lab" || row.passed || row.skipped) return row;
    if (/\/labs\/lab1\)? returned HTTP/.test(row.message)) return row;
    return { ...row, message: `${note} ${row.message}` };
  });
}

/**
 * Ids are optional: an id counts only when its element has real content;
 * otherwise the check reads the structure on the page that should hold it.
 * A page that returned 404 fails; a page that couldn't be fetched is a
 * re-check with points kept. A miss with no reliable structure is a TA
 * review candidate, resolved later against `reviewGates`.
 */
function judgeSpec(
  config: AssignmentChecker,
  spec: A1RubricAutoSpec,
  ctx: StructureContext,
): Verdict {
  const fallback = config.structureFallbacks?.[spec.criterionId];
  const targetSpec: StructureTarget =
    fallback?.target ??
    (spec.pagePath
      ? { kind: "path", path: spec.pagePath, name: spec.pagePath }
      : spec.groupId === "lab"
        ? DEFAULT_LAB_TARGET
        : SITE_TARGET);
  const target = targetPages(ctx, targetSpec);
  if (target.state === "missing") return { kind: "fail", message: missingPageMessage(target) };
  if (target.state === "unreachable") {
    return { kind: "unreachable", message: unreachablePageMessage(target) };
  }
  const html =
    targetSpec.kind === "site" ? ctx.allHtml : target.pages.map((page) => page.html).join("\n");
  const primary = evaluateRubricSpec(spec, html, {
    siteHost: ctx.siteHost,
    idPresent: (source, id) => idPresent(config, source, id),
  });
  if (primary.passed) return { kind: "pass", message: primary.message };

  if (!fallback) {
    if (specUsesIds(spec)) {
      return missVerdict(target, {
        kind: "review",
        message: needsReviewMessage(),
        missMessage: spec.failMessage,
      });
    }
    return missVerdict(target, { kind: "fail", message: primary.message });
  }
  const { verdict } = runFallback(fallback, ctx);
  if (verdict === true) return { kind: "pass", message: `Found ${fallback.looksFor}.` };
  if (verdict === "unreachable") return { kind: "unreachable", message: unreachablePageMessage(target) };
  if (verdict === false && fallback.onMiss === "review") {
    return missVerdict(target, {
      kind: "review",
      message: needsReviewMessage(fallback.looksFor),
      missMessage: fallback.missMessage,
    });
  }
  return missVerdict(target, { kind: "fail", message: fallback.missMessage });
}

/** An id counts only when its element has the content the book asks for. */
function idPresent(config: AssignmentChecker, html: string, id: string): boolean {
  if (!config.idHasContent) return htmlHasId(html, id);
  const contentOk = config.idHasContent;
  return elementsWithId(html, id).some((element) => contentOk(id, element));
}

/**
 * Turn verdicts into rows. A review candidate keeps its points only when
 * its gate passes (an On your own / With AI item needs its core item; a
 * core item needs most of the other reliable checks in its group), so an
 * empty or template site cannot collect review points.
 */
function resolveVerdicts(
  config: AssignmentChecker,
  verdicts: { spec: A1RubricAutoSpec; verdict: Verdict }[],
  earlier: readonly AssignmentCheckResult[],
): AssignmentCheckResult[] {
  const passed = new Map<string, boolean>();
  for (const row of earlier) {
    if (row.criterionId && !row.skipped) {
      passed.set(row.criterionId, (passed.get(row.criterionId) ?? true) && row.passed);
    }
  }
  for (const { spec, verdict } of verdicts) {
    passed.set(spec.criterionId, verdict.kind === "pass" || verdict.kind === "unreachable");
  }
  return verdicts.map(({ spec, verdict }) => {
    const extra = { criterionId: spec.criterionId, groupId: spec.groupId };
    switch (verdict.kind) {
      case "pass":
        return check(spec.criterionId, spec.label, true, verdict.message, extra);
      case "fail":
        return check(spec.criterionId, spec.label, false, verdict.message, extra);
      case "unreachable":
        return check(spec.criterionId, spec.label, true, verdict.message, {
          ...extra,
          needsReview: true,
        });
      case "review": {
        const gate = config.reviewGates?.[spec.criterionId];
        const count = gate ? gate.requires.filter((id) => passed.get(id) === true).length : 0;
        if (!gate || count >= gate.minPassed) {
          return check(spec.criterionId, spec.label, true, verdict.message, {
            ...extra,
            needsReview: true,
          });
        }
        return check(spec.criterionId, spec.label, false, verdict.missMessage, extra);
      }
    }
  });
}

/**
 * Same-origin fetches for resources a page links (stylesheets), through the
 * checker's probes, cached per run. Only paths on the deploy are fetched.
 */
function textFetcher(
  origin: string,
  probes: AssignmentCheckProbes,
): (pathOrUrl: string) => Promise<FetchTextResult> {
  const cache = new Map<string, Promise<FetchTextResult>>();
  return (pathOrUrl) => {
    let url: string;
    try {
      const resolved = new URL(pathOrUrl, origin);
      if (resolved.origin !== new URL(origin).origin) {
        return Promise.resolve({ ok: false, missing: false });
      }
      url = urlOnDeployOrigin(origin, resolved.pathname + resolved.search);
    } catch {
      return Promise.resolve({ ok: false, missing: false });
    }
    const hit = cache.get(url);
    if (hit) return hit;
    const pending = probes
      .getHtml(url)
      .then((result): FetchTextResult => {
        if (result.ok) return { ok: true, text: result.html };
        const missing = isDefiniteNotFound({
          path: url,
          ok: false,
          status: result.status,
          code: result.code,
        });
        return { ok: false, status: result.status, missing };
      })
      .catch((): FetchTextResult => ({ ok: false, missing: false }));
    cache.set(url, pending);
    return pending;
  };
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
      // Only a 404 means "not found or private". Rate limits, 5xx and network
      // errors keep the points and are flagged for a re-check.
      const transient = !probe.ok && probe.status !== 404;
      results.push({
        ...check(
          "github-public",
          "GitHub repository is public",
          probe.ok || transient,
          probe.ok
            ? ASSIGNMENT_STUDENT_COPY.githubOk
            : transient
              ? GITHUB_RECHECK_MESSAGE
              : ASSIGNMENT_STUDENT_COPY.githubPrivate,
          { criterionId: delivery.github.criterionId, groupId: delivery.github.groupId },
        ),
        ...(transient ? { needsReview: true } : {}),
      });
    }
  }

  if (delivery.branch) {
    const branch = delivery.branch;
    const parsed = githubRaw ? parseGithubRepoUrl(githubRaw) : null;
    const named = githubRaw ? githubUrlBranch(githubRaw) : null;
    const schemeMessage = githubRaw ? a2GithubSchemeMessage(githubRaw) : null;
    let passed = false;
    let message = branch.missingMessage;
    let branchTransient = false;
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
      } else if (
        !probe.ok &&
        (probe.transient || probe.status === 403 || probe.status === 429 || (probe.status ?? 0) >= 500)
      ) {
        // GitHub was busy: keep the points and flag it, never a deduction.
        passed = true;
        branchTransient = true;
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
    results.push({
      ...check(branch.criterionId, branch.label, passed, message, {
        criterionId: branch.criterionId,
        groupId: branch.groupId,
      }),
      ...(branchTransient ? { needsReview: true } : {}),
    });
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

  // Ids-optional checkers read Lab pages only (never the home page) and
  // count an id only when its element has content (a real link).
  const labsOnlyHtml = crawled.pages
    .filter((page) => page.result.ok && isLabsPath(page.path))
    .map((page) => (page.result.ok ? page.result.html : ""))
    .join("\n");
  const deliveryHtml = config.idsOptional ? labsOnlyHtml : crawled.labsHtml;
  const hasId = (html: string, id: string) => idPresent(config, html, id);
  const attempted: AttemptedPage[] = crawled.pages.map((page) => ({
    path: page.path,
    ok: page.result.ok,
    status: page.result.status,
    code: page.result.ok ? undefined : page.result.code,
  }));
  // Ids-optional delivery checks read only the Lab pages: a miss there is a
  // re-check when a Lab page couldn't be opened, and says the pages weren't
  // found when none of them exist.
  const labsTarget = targetPages(
    { labsHtml: labsOnlyHtml, allHtml: crawled.allHtml, pages: [], attempted },
    { kind: "labs" },
  );
  const labPagesOk = crawled.pages.some((page) => page.result.ok && isLabsPath(page.path));
  const deliveryMiss = (
    id: string,
    label: string,
    message: string,
    extra: { criterionId: string; groupId: AssignmentCheckResult["groupId"] },
  ): AssignmentCheckResult => {
    if (config.idsOptional && labsTarget.unreachable.length > 0) {
      return check(id, label, true, partlyUnreachableMessage(labsTarget.unreachable), {
        ...extra,
        needsReview: true,
      });
    }
    if (config.idsOptional && !labPagesOk) {
      return check(id, label, false, missingPageMessage(labsTarget), extra);
    }
    return check(id, label, false, message, extra);
  };
  if (delivery.labsContent) {
    // The deploy must show the student's own Labs pages: a bare
    // create-next-app starter (or 404s everywhere under /labs) earns nothing.
    const content = delivery.labsContent;
    const extra = { criterionId: delivery.vercelCriterionId, groupId: "delivery" as const };
    const id = `${delivery.vercelCriterionId}-content`;
    const ownLabs = crawled.pages.some(
      (page) => page.result.ok && isLabsPath(page.path) && !isTemplatePage(page.result.html),
    );
    results.push(
      ownLabs
        ? check(id, content.label, true, content.passMessage, extra)
        : labsTarget.unreachable.length > 0
          ? check(id, content.label, true, partlyUnreachableMessage(labsTarget.unreachable), {
              ...extra,
              needsReview: true,
            })
          : check(id, content.label, false, content.failMessage, extra),
    );
  }

  const labsNav = delivery.labsNav.test
    ? delivery.labsNav.test(deliveryHtml, siteHost)
    : labsNavPassed(deliveryHtml, delivery.labsNav, siteHost, config.idHasContent ? hasId : htmlHasId) ||
      Boolean(delivery.labsNav.structurePassed?.(deliveryHtml, siteHost));
  {
    const extra = { criterionId: delivery.labsNav.criterionId, groupId: delivery.labsNav.groupId };
    results.push(
      labsNav
        ? check(delivery.labsNav.criterionId, delivery.labsNav.label, true, delivery.labsNav.passMessage, extra)
        : deliveryMiss(delivery.labsNav.criterionId, delivery.labsNav.label, delivery.labsNav.failMessage, extra),
    );
  }

  const githubById = hasId(deliveryHtml, "wd-github");
  const githubHook =
    githubById || Boolean(delivery.github.linkStructurePassed?.(deliveryHtml));
  {
    const extra = { criterionId: delivery.github.criterionId, groupId: delivery.github.groupId };
    const id = `${delivery.github.criterionId}-link`;
    results.push(
      githubHook
        ? check(
            id,
            delivery.github.linkLabel,
            true,
            githubById ? delivery.github.linkPassMessage : "Found a GitHub link on Labs.",
            extra,
          )
        : deliveryMiss(id, delivery.github.linkLabel, delivery.github.linkFailMessage, extra),
    );
  }

  if (delivery.name) {
    const canCheckName = Boolean(
      input.nameQuery && hasUsableNameQuery(input.nameQuery),
    );
    if (canCheckName && input.nameQuery) {
      const named = htmlHasStudentName(crawled.labsHtml, input.nameQuery);
      const extra = { criterionId: delivery.name.criterionId, groupId: delivery.name.groupId };
      results.push(
        named
          ? check(delivery.name.criterionId, delivery.name.label, true, ASSIGNMENT_STUDENT_COPY.nameOk, extra)
          : deliveryMiss(
              delivery.name.criterionId,
              delivery.name.label,
              ASSIGNMENT_STUDENT_COPY.nameMissing,
              extra,
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

  if (!config.idsOptional) {
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
      results.push(judgeLegacySpec(spec, html, siteHost));
    }
  } else {
    const structure: StructureContext = {
      labsHtml: labsOnlyHtml,
      allHtml: crawled.allHtml,
      pages: crawled.pages.flatMap((page) =>
        page.result.ok ? [{ path: page.path, html: page.result.html }] : [],
      ),
      attempted,
      siteHost,
    };
    const custom = config.judgeAutoSpecs
      ? await config.judgeAutoSpecs({
          structure,
          attempted,
          fetchText: textFetcher(crawled.origin, input.probes),
        })
      : {};
    const verdicts = config.autoSpecs.map((spec) => ({
      spec,
      verdict: custom[spec.criterionId] ?? judgeSpec(config, spec, structure),
    }));
    results.push(...withLab1NotFoundNote(resolveVerdicts(config, verdicts, results), attempted));
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
