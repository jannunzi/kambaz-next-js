/**
 * Forced password change for pre-provisioned Clerk accounts.
 *
 * Clerk has no native "must change password" session task. Accounts created
 * with a temporary NUID password set `publicMetadata.mustChangePassword`
 * to true. The proxy redirects those sessions to `/account/set-password`
 * until a server action clears the flag.
 */

export const SET_PASSWORD_PATH = "/account/set-password";

export const SET_PASSWORD_EXPLANATION =
  "Your account was created for you with your NUID as the temporary password. Please choose a new password.";

export const MIN_PASSWORD_LENGTH = 8;

const STATIC_FILE =
  /\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|txt|xml|json)$/i;

/** Paths a signed-in user may hit while `mustChangePassword` is still true. */
export function isPasswordChangeExemptPath(pathname: string): boolean {
  const path = (pathname.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  if (path === SET_PASSWORD_PATH || path.startsWith(`${SET_PASSWORD_PATH}/`)) {
    return true;
  }
  if (path === "/api" || path.startsWith("/api/")) return true;
  if (path === "/trpc" || path.startsWith("/trpc/")) return true;
  if (path === "/_next" || path.startsWith("/_next/")) return true;
  if (path === "/__clerk" || path.startsWith("/__clerk/")) return true;
  if (path === "/sign-out" || path.startsWith("/sign-out/")) return true;
  // Public legal page. Stay reachable during the password-change gate.
  if (path === "/privacy" || path.startsWith("/privacy/")) return true;
  if (STATIC_FILE.test(path)) return true;
  return false;
}

/**
 * Read `mustChangePassword` from a session token.
 * Returns null when the claim is absent (Clerk does not include
 * publicMetadata unless the session token is customized).
 */
export function mustChangePasswordClaim(sessionClaims: unknown): boolean | null {
  if (!sessionClaims || typeof sessionClaims !== "object") return null;
  const claims = sessionClaims as Record<string, unknown>;
  const containers = ["publicMetadata", "public_metadata", "metadata"] as const;
  for (const key of containers) {
    const value = claims[key];
    if (!value || typeof value !== "object") continue;
    if (!Object.prototype.hasOwnProperty.call(value, "mustChangePassword")) continue;
    return (value as { mustChangePassword?: unknown }).mustChangePassword === true;
  }
  if (Object.prototype.hasOwnProperty.call(claims, "mustChangePassword")) {
    return claims.mustChangePassword === true;
  }
  return null;
}

export function metadataRequiresPasswordChange(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== "object") return false;
  return (metadata as { mustChangePassword?: unknown }).mustChangePassword === true;
}

/**
 * Confirm the flag against a fresh Clerk user (`currentUser()` / `getUser()`).
 * An explicit `false` claim skips the lookup. A `true` claim is rechecked so
 * a stale JWT cannot keep redirecting after the flag is cleared. If the
 * lookup fails and the claim is not explicitly true, fail open.
 */
export async function resolveMustChangePassword(input: {
  sessionClaims: unknown;
  readUserFlag: () => Promise<boolean>;
}): Promise<boolean> {
  const claim = mustChangePasswordClaim(input.sessionClaims);
  if (claim === false) return false;
  try {
    return await input.readUserFlag();
  } catch {
    return claim === true;
  }
}

export function passwordChangeRedirect(input: {
  pathname: string;
  search?: string;
  signedIn: boolean;
  mustChangePassword: boolean;
}): string | null {
  if (!input.signedIn || !input.mustChangePassword) return null;
  if (isPasswordChangeExemptPath(input.pathname)) return null;
  const search = input.search ?? "";
  const from = `${input.pathname}${search}`;
  if (from === "/" || from === "") return SET_PASSWORD_PATH;
  const params = new URLSearchParams();
  params.set("redirect_url", from);
  return `${SET_PASSWORD_PATH}?${params.toString()}`;
}

/** Same-origin relative return path. Anything else goes home. */
export function safeReturnPath(value: string | null | undefined): string {
  if (!value) return "/";
  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return "/";
  }
  if (trimmed.includes("://")) return "/";
  let pathname = trimmed;
  let search = "";
  try {
    const url = new URL(trimmed, "https://kambaz.dev");
    if (url.origin !== "https://kambaz.dev") return "/";
    pathname = url.pathname;
    search = url.search;
  } catch {
    return "/";
  }
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return "/";
  if (pathname === SET_PASSWORD_PATH || pathname.startsWith(`${SET_PASSWORD_PATH}/`)) {
    return "/";
  }
  return `${pathname}${search}`;
}

export type PasswordChangeIssue =
  | "missing"
  | "too_short"
  | "mismatch"
  | "same_as_current"
  | "nuid_reuse";

export function passwordChangeIssue(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): PasswordChangeIssue | null {
  const current = input.currentPassword;
  const next = input.newPassword;
  const confirm = input.confirmPassword;
  if (!current || !next || !confirm) return "missing";
  if (next.length < MIN_PASSWORD_LENGTH) return "too_short";
  if (next !== confirm) return "mismatch";
  if (/^\d+$/.test(next) && next === current) return "nuid_reuse";
  if (next === current) return "same_as_current";
  return null;
}

export function passwordChangeIssueMessage(issue: PasswordChangeIssue): string {
  switch (issue) {
    case "missing":
      return "Enter your current password, a new password, and a confirmation.";
    case "too_short":
      return "New password must be at least 8 characters.";
    case "mismatch":
      return "New password and confirmation do not match.";
    case "same_as_current":
      return "New password must be different from your current password.";
    case "nuid_reuse":
      return "New password cannot be your NUID. Choose a password that is not all digits matching your current password.";
  }
}

const INCORRECT_PASSWORD_CODES = new Set([
  "form_password_incorrect",
  "incorrect_password",
  "form_password_or_identifier_incorrect",
]);

export function clerkPasswordErrorMessage(
  errors: { code?: string; message?: string; longMessage?: string }[],
): string {
  if (errors.some((error) => error.code && INCORRECT_PASSWORD_CODES.has(error.code))) {
    return "Current password is incorrect.";
  }
  const text = errors
    .map((error) => `${error.longMessage ?? ""} ${error.message ?? ""}`)
    .join(" ");
  if (/current password|password is incorrect|incorrect password/i.test(text)) {
    return "Current password is incorrect.";
  }
  if (
    errors.some((error) =>
      error.code === "form_password_length_too_short" ||
      error.code === "form_password_size_in_bytes_exceeded",
    )
  ) {
    return "New password must be at least 8 characters.";
  }
  if (errors.some((error) => error.code === "form_password_pwned")) {
    return "That password is too common. Choose a different one.";
  }
  if (errors.some((error) => error.code === "form_password_validation_failed")) {
    return "Choose a stronger password that is not your current password.";
  }
  return "Could not update the password. Check the current password and try again.";
}
