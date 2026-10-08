/**
 * Judges the A2 lab rows from page structure and compiled CSS (see
 * a2-structure.ts). Ids are never read and feedback never names one.
 *
 *   - A page that returned 404 fails its rows.
 *   - A page or stylesheet that couldn't be fetched (timeout, network, 5xx,
 *     login wall) is "Needs re-check": points kept, nothing marked wrong.
 *   - A page that still shows the create-next-app starter fails its rows.
 *   - A sample with no evidence at all fails the row and is named in the
 *     feedback by its book section.
 *   - A sample with only weak evidence (the student's own variant), and the
 *     ID-selector sample when no element carries the ids its rules target,
 *     make the row "Needs TA review": points kept, a TA confirms by hand.
 */
import { isDefiniteNotFound, type AttemptedPage } from "./a1-structure";
import {
  A2_BOX_MODEL_SAMPLES,
  A2_LAB2_SAMPLES,
  A2_LAYOUT_SAMPLES,
  A2_SELECTOR_SAMPLES,
  A2_TAILWIND_SAMPLES,
  hasAuthoredStylesheet,
  hasPageContent,
  iconCount,
  isTemplatePage,
  runSamples,
  stylePage,
  stylesheetHrefs,
  type SampleCheck,
  type StyledPage,
} from "./a2-structure";
import type { AutoJudgeContext, AutoVerdict } from "./checker-types";
import { needsReviewMessage } from "./check-status";

export const A2_LAB2_PATH = "/labs/lab2";
export const A2_TAILWIND_PATH = "/labs/lab2/tailwind";

/** Most stylesheets read per page (Next links a handful). */
const MAX_SHEETS = 12;

const RECHECK_TAIL = "so this wasn't checked. Not marked wrong; no points taken off.";

type PageRead =
  | { state: "ok"; html: string; page: StyledPage | null; cssUnreachable: string[] }
  | { state: "missing"; status?: number }
  | { state: "unreachable"; why: string }
  | { state: "template" };

function listNames(names: readonly string[]): string {
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function samePath(a: string, b: string): boolean {
  const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p).toLowerCase();
  return clean(a) === clean(b);
}

async function readPage(ctx: AutoJudgeContext, path: string): Promise<PageRead> {
  const page = ctx.structure.pages.find((entry) => samePath(entry.path, path));
  if (!page) {
    const tried: AttemptedPage[] = ctx.attempted.filter((entry) => samePath(entry.path, path));
    if (tried.length > 0 && tried.every(isDefiniteNotFound)) {
      return { state: "missing", status: tried.find((entry) => entry.status)?.status };
    }
    if (tried.length === 0) return { state: "missing" };
    return { state: "unreachable", why: `${path} on your deploy couldn't be opened (timeout, server error, or login)` };
  }
  if (isTemplatePage(page.html)) return { state: "template" };
  const sheets: string[] = [];
  const cssUnreachable: string[] = [];
  for (const href of stylesheetHrefs(page.html).slice(0, MAX_SHEETS)) {
    const fetched = await ctx.fetchText(href);
    if (fetched.ok) sheets.push(fetched.text);
    else cssUnreachable.push(href);
  }
  return { state: "ok", html: page.html, page: stylePage(page.html, sheets), cssUnreachable };
}

function missingMessage(path: string, status?: number): string {
  return status
    ? `Your Lab 2 page wasn't found: ${path} returned HTTP ${status}, so this item couldn't pass.`
    : `Your Lab 2 page wasn't found at ${path}, so this item couldn't pass.`;
}

function templateMessage(path: string): string {
  return `${path} still shows the create-next-app starter page, so this item couldn't pass. Replace it with your Lab 2 work.`;
}

/** Verdict for rows that need the page (and maybe its CSS) when the page isn't usable. */
function pageProblem(read: PageRead, path: string, needsCss: boolean): AutoVerdict | null {
  if (read.state === "missing") return { kind: "fail", message: missingMessage(path, read.status) };
  if (read.state === "unreachable") return { kind: "unreachable", message: `Needs re-check: ${read.why}, ${RECHECK_TAIL}` };
  if (read.state === "template") return { kind: "fail", message: templateMessage(path) };
  if (needsCss && read.cssUnreachable.length > 0) {
    return {
      kind: "unreachable",
      message: `Needs re-check: the stylesheet for ${path} couldn't be downloaded from your deploy, ${RECHECK_TAIL}`,
    };
  }
  return null;
}

function sampleVerdict(
  samples: readonly SampleCheck[],
  page: StyledPage,
  path: string,
  passMessage: string,
  all: readonly SampleCheck[] = samples,
): AutoVerdict {
  const result = runSamples(samples, page, all);
  if (result.missing.length > 0) {
    const what = result.missing.length === 1 ? "sample" : "samples";
    return {
      kind: "fail",
      message: `Missing on ${path}: the ${listNames(result.missing)} ${what}. We look for your CSS styling elements on the page the way each book sample does; text and ids don't matter.`,
    };
  }
  const unsure = [...result.review, ...result.weak];
  if (unsure.length > 0) {
    const what = unsure.length === 1 ? "sample" : "samples";
    const parts: string[] = [];
    if (result.weak.length > 0) {
      parts.push(`the ${listNames(result.weak)} ${result.weak.length === 1 ? "sample" : "samples"} (the CSS is there, built differently from the book)`);
    }
    if (result.review.length > 0) {
      parts.push(`the ${listNames(result.review)} sample (your CSS has id rules, but no element on ${path} matched them)`);
    }
    return {
      kind: "review",
      message: needsReviewMessage(`${parts.join(" and ")} on ${path}`),
      missMessage: `Couldn't confirm on ${path}: the ${listNames(unsure)} ${what}. Build each one as the book sample does; text and ids don't matter.`,
    };
  }
  return { kind: "pass", message: passMessage };
}

export async function judgeA2Labs(ctx: AutoJudgeContext): Promise<Record<string, AutoVerdict>> {
  const lab2 = await readPage(ctx, A2_LAB2_PATH);
  const tailwind = await readPage(ctx, A2_TAILWIND_PATH);
  const out: Record<string, AutoVerdict> = {};

  // Lab 2 page and CSS file.
  {
    const problem = pageProblem(lab2, A2_LAB2_PATH, true);
    if (problem) out["a2-lab-page"] = problem;
    else if (lab2.state === "ok" && lab2.page) {
      const content = hasPageContent(lab2.page);
      const css = hasAuthoredStylesheet(lab2.page);
      out["a2-lab-page"] =
        content && css
          ? { kind: "pass", message: "Found your Lab 2 page at /labs/lab2, styled by your Lab 2 stylesheet." }
          : {
              kind: "fail",
              message: !content
                ? "/labs/lab2 opened but shows almost nothing. Add the Lab 2 samples from §2.1."
                : "/labs/lab2 opened, but no rules from a Lab 2 stylesheet style anything on it. Create app/labs/lab2/index.css and import it in the page (§2.1.2).",
            };
    }
  }

  const rows: [string, readonly SampleCheck[], string][] = [
    ["a2-lab-selectors", A2_SELECTOR_SAMPLES, "Found the ID, class, and document-structure selector samples."],
    ["a2-lab-box-model", A2_BOX_MODEL_SAMPLES, "Found the color, border, spacing, box-model, corner, dimension, and display samples."],
    ["a2-lab-layout", A2_LAYOUT_SAMPLES, "Found the position, z-index, float, grid, flex, and media-query samples."],
  ];
  for (const [criterionId, samples, pass] of rows) {
    const problem = pageProblem(lab2, A2_LAB2_PATH, true);
    if (problem) out[criterionId] = problem;
    else if (lab2.state === "ok" && lab2.page) out[criterionId] = sampleVerdict(samples, lab2.page, A2_LAB2_PATH, pass, A2_LAB2_SAMPLES);
  }

  // React Icons: HTML only (no CSS needed).
  {
    const problem = pageProblem(lab2, A2_LAB2_PATH, false);
    if (problem) out["a2-lab-icons"] = problem;
    else if (lab2.state === "ok" && lab2.page) {
      out["a2-lab-icons"] =
        iconCount(lab2.page) > 0
          ? { kind: "pass", message: "Found React icons on Lab 2." }
          : {
              kind: "fail",
              message: "No icons found on /labs/lab2. Import ReactIconsSampler on the Lab 2 page so its React icons show (§2.2).",
            };
    }
  }

  // Tailwind samples.
  {
    const problem = pageProblem(tailwind, A2_TAILWIND_PATH, true);
    if (problem) {
      out["a2-lab-tailwind"] =
        problem.kind === "fail" && tailwind.state === "missing"
          ? {
              kind: "fail",
              message: tailwind.status
                ? `The Tailwind lab page wasn't found: ${A2_TAILWIND_PATH} returned HTTP ${tailwind.status}. Add the §2.3 samples there.`
                : `The Tailwind lab page wasn't found at ${A2_TAILWIND_PATH}. Add the §2.3 samples there.`,
            }
          : problem;
    } else if (tailwind.state === "ok" && tailwind.page) {
      out["a2-lab-tailwind"] = sampleVerdict(
        A2_TAILWIND_SAMPLES,
        tailwind.page,
        A2_TAILWIND_PATH,
        "Found the Tailwind spacing, type, color, responsive, filter, and grid samples.",
      );
    }
  }
  return out;
}
