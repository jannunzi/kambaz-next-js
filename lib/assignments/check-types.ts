export type AssignmentCheckResult = {
  id: string;
  label: string;
  passed: boolean;
  message: string;
  criterionId?: string;
  groupId?: string;
  skipped?: boolean;
  /**
   * No wd-* id and no reliable structural match. Not a fail and no points
   * are taken off (the row counts as passed); staff confirm it by hand.
   */
  needsReview?: boolean;
  /**
   * The deploy could not be opened (login wall, 401/403/404, network, or an
   * unusable URL). Nothing was scored; the submission must be re-checked.
   */
  needsRecheck?: boolean;
};

export type HtmlFetchResult =
  | { ok: true; status: number; finalUrl: string; html: string }
  | {
      ok: false;
      status?: number;
      finalUrl?: string;
      html?: string;
      code: "auth_wall" | "http_error" | "network";
      message: string;
    };

export type UrlProbeResult =
  | { ok: true; status: number }
  | {
      ok: false;
      status?: number;
      message: string;
      /** Rate limit, 5xx, or network error: not evidence the repo is missing. */
      transient?: boolean;
    };

export type AssignmentCheckProbes = {
  getHtml: (url: string) => Promise<HtmlFetchResult>;
  probeUrl?: (url: string) => Promise<UrlProbeResult>;
};
