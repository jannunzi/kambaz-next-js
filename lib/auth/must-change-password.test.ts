import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  SET_PASSWORD_EXPLANATION,
  SET_PASSWORD_PATH,
  clerkPasswordErrorMessage,
  isPasswordChangeExemptPath,
  metadataRequiresPasswordChange,
  mustChangePasswordClaim,
  passwordChangeIssue,
  passwordChangeIssueMessage,
  passwordChangeRedirect,
  resolveMustChangePassword,
  safeReturnPath,
} from "./must-change-password";

describe("password change allowlist", () => {
  it("exempts the set-password page, privacy policy, sign-out, static files, and API routes", () => {
    for (const path of [
      "/account/set-password",
      "/account/set-password/",
      "/account/set-password/extra",
      "/privacy",
      "/privacy/",
      "/api",
      "/api/lab5/hello",
      "/trpc/quiz",
      "/_next/static/chunk.js",
      "/__clerk/handshake",
      "/sign-out",
      "/sign-out/complete",
      "/favicon.ico",
      "/images/logo.png",
      "/file.css",
    ]) {
      assert.equal(isPasswordChangeExemptPath(path), true, path);
    }
  });

  it("does not exempt public course pages or the logged-out A1 page", () => {
    for (const path of [
      "/",
      "/syllabus",
      "/book",
      "/book/ch1",
      "/slides",
      "/slides/intro-to-web-development",
      "/videos",
      "/assignments",
      "/assignments/a1",
      "/sign-in",
      "/sign-up",
      "/quizzes/take",
      "/account/signin",
      "/account/profile",
      "/dashboard",
    ]) {
      assert.equal(isPasswordChangeExemptPath(path), false, path);
    }
  });
});

describe("password change redirect", () => {
  it("sends a flagged signed-in user to set-password and keeps the return path", () => {
    assert.equal(
      passwordChangeRedirect({
        pathname: "/syllabus",
        search: "",
        signedIn: true,
        mustChangePassword: true,
      }),
      `${SET_PASSWORD_PATH}?redirect_url=%2Fsyllabus`,
    );
    assert.equal(
      passwordChangeRedirect({
        pathname: "/assignments/a1",
        search: "?check=1",
        signedIn: true,
        mustChangePassword: true,
      }),
      `${SET_PASSWORD_PATH}?redirect_url=%2Fassignments%2Fa1%3Fcheck%3D1`,
    );
    assert.equal(
      passwordChangeRedirect({
        pathname: "/",
        signedIn: true,
        mustChangePassword: true,
      }),
      SET_PASSWORD_PATH,
    );
  });

  it("leaves logged-out visitors and users without the flag alone", () => {
    const pages = ["/", "/book", "/slides", "/videos", "/assignments/a1", "/syllabus"];
    for (const pathname of pages) {
      assert.equal(
        passwordChangeRedirect({
          pathname,
          signedIn: false,
          mustChangePassword: true,
        }),
        null,
        pathname,
      );
      assert.equal(
        passwordChangeRedirect({
          pathname,
          signedIn: true,
          mustChangePassword: false,
        }),
        null,
        pathname,
      );
    }
  });

  it("does not redirect exempt paths even when the flag is set", () => {
    assert.equal(
      passwordChangeRedirect({
        pathname: "/account/set-password",
        signedIn: true,
        mustChangePassword: true,
      }),
      null,
    );
    assert.equal(
      passwordChangeRedirect({
        pathname: "/api/lab5/hello",
        signedIn: true,
        mustChangePassword: true,
      }),
      null,
    );
    assert.equal(
      passwordChangeRedirect({
        pathname: "/sign-out",
        signedIn: true,
        mustChangePassword: true,
      }),
      null,
    );
    assert.equal(
      passwordChangeRedirect({
        pathname: "/privacy",
        signedIn: true,
        mustChangePassword: true,
      }),
      null,
    );
  });
});

describe("mustChangePassword claims", () => {
  it("reads public metadata from common session-claim shapes", () => {
    assert.equal(
      mustChangePasswordClaim({ publicMetadata: { mustChangePassword: true } }),
      true,
    );
    assert.equal(
      mustChangePasswordClaim({ publicMetadata: { mustChangePassword: false } }),
      false,
    );
    assert.equal(
      mustChangePasswordClaim({ public_metadata: { mustChangePassword: true } }),
      true,
    );
    assert.equal(
      mustChangePasswordClaim({ metadata: { mustChangePassword: true, provisioned: "2026-09-fa26" } }),
      true,
    );
    assert.equal(mustChangePasswordClaim({ mustChangePassword: true }), true);
    assert.equal(mustChangePasswordClaim({ publicMetadata: { provisioned: "2026-09-fa26" } }), null);
    assert.equal(mustChangePasswordClaim({ sub: "user_1" }), null);
    assert.equal(mustChangePasswordClaim(null), null);
    assert.equal(metadataRequiresPasswordChange({ mustChangePassword: true }), true);
    assert.equal(metadataRequiresPasswordChange({ mustChangePassword: "true" }), false);
    assert.equal(metadataRequiresPasswordChange(null), false);
  });

  it("rechecks a true claim and trusts an explicit false claim", async () => {
    let reads = 0;
    const readUserFlag = async () => {
      reads += 1;
      return false;
    };
    assert.equal(
      await resolveMustChangePassword({
        sessionClaims: { publicMetadata: { mustChangePassword: false } },
        readUserFlag,
      }),
      false,
    );
    assert.equal(reads, 0);

    assert.equal(
      await resolveMustChangePassword({
        sessionClaims: { publicMetadata: { mustChangePassword: true } },
        readUserFlag,
      }),
      false,
    );
    assert.equal(reads, 1);

    assert.equal(
      await resolveMustChangePassword({
        sessionClaims: { sub: "user_1" },
        readUserFlag: async () => true,
      }),
      true,
    );
  });

  it("fails open when the lookup throws unless the claim is explicitly true", async () => {
    const boom = async () => {
      throw new Error("clerk down");
    };
    assert.equal(
      await resolveMustChangePassword({
        sessionClaims: { sub: "user_1" },
        readUserFlag: boom,
      }),
      false,
    );
    assert.equal(
      await resolveMustChangePassword({
        sessionClaims: { publicMetadata: { mustChangePassword: true } },
        readUserFlag: boom,
      }),
      true,
    );
  });
});

describe("password rules", () => {
  it("requires 8 characters, a match, and a password that is not the current one or the NUID", () => {
    assert.equal(
      passwordChangeIssue({ currentPassword: "", newPassword: "abcdefgh", confirmPassword: "abcdefgh" }),
      "missing",
    );
    assert.equal(
      passwordChangeIssue({ currentPassword: "001234567", newPassword: "short", confirmPassword: "short" }),
      "too_short",
    );
    assert.equal(
      passwordChangeIssue({
        currentPassword: "001234567",
        newPassword: "abcdefgh",
        confirmPassword: "abcdefgi",
      }),
      "mismatch",
    );
    assert.equal(
      passwordChangeIssue({
        currentPassword: "abcdefgh",
        newPassword: "abcdefgh",
        confirmPassword: "abcdefgh",
      }),
      "same_as_current",
    );
    assert.equal(
      passwordChangeIssue({
        currentPassword: "001234567",
        newPassword: "001234567",
        confirmPassword: "001234567",
      }),
      "nuid_reuse",
    );
    assert.equal(
      passwordChangeIssue({
        currentPassword: "001234567",
        newPassword: "correct horse",
        confirmPassword: "correct horse",
      }),
      null,
    );
    assert.equal(
      passwordChangeIssue({
        currentPassword: "001234567",
        newPassword: "123456789",
        confirmPassword: "123456789",
      }),
      null,
    );
    assert.match(passwordChangeIssueMessage("too_short"), /at least 8 characters/);
    assert.match(passwordChangeIssueMessage("nuid_reuse"), /NUID/);
    assert.equal(
      clerkPasswordErrorMessage([{ code: "form_password_incorrect", message: "Password is incorrect." }]),
      "Current password is incorrect.",
    );
    assert.equal(
      clerkPasswordErrorMessage([{ message: "The current password is wrong." }]),
      "Current password is incorrect.",
    );
  });
});

describe("return path", () => {
  it("keeps same-site paths and drops open redirects", () => {
    assert.equal(safeReturnPath("/book/ch1"), "/book/ch1");
    assert.equal(safeReturnPath("/assignments/a1?check=1"), "/assignments/a1?check=1");
    assert.equal(safeReturnPath("https://evil.example/phish"), "/");
    assert.equal(safeReturnPath("//evil.example"), "/");
    assert.equal(safeReturnPath("/\\evil"), "/");
    assert.equal(safeReturnPath("/account/set-password?redirect_url=%2Fbook"), "/");
    assert.equal(safeReturnPath(""), "/");
    assert.equal(safeReturnPath(undefined), "/");
  });
});

describe("password change wiring", () => {
  const root = process.cwd();

  it("shows the temporary-password explanation on the set-password page", () => {
    const page = readFileSync(join(root, "app/account/set-password/page.tsx"), "utf8");
    const view = readFileSync(
      join(root, "app/account/set-password/PasswordChangeFormView.tsx"),
      "utf8",
    );
    assert.match(page, /SetPasswordForm/);
    assert.match(page, /PasswordChangeFields/);
    assert.match(view, /SET_PASSWORD_EXPLANATION/);
    assert.equal(
      SET_PASSWORD_EXPLANATION,
      "Your account was created for you with your NUID as the temporary password. Please choose a new password.",
    );
  });

  it("enforces the redirect from the Clerk proxy and clears only the signed-in user", () => {
    const proxy = readFileSync(join(root, "proxy.ts"), "utf8");
    const action = readFileSync(join(root, "app/account/set-password/actions.ts"), "utf8");
    const form = readFileSync(join(root, "app/account/set-password/SetPasswordForm.tsx"), "utf8");
    assert.match(proxy, /resolveMustChangePassword/);
    assert.match(proxy, /passwordChangeRedirect/);
    assert.match(proxy, /getUser\(userId\)/);
    assert.match(proxy, /clerkMiddleware/);
    assert.match(action, /auth\(\)/);
    assert.match(action, /updateUserMetadata\(userId/);
    assert.match(action, /mustChangePassword: false/);
    assert.doesNotMatch(action, /userId:\s*string/);
    assert.match(form, /updatePassword\(\{/);
    assert.match(form, /signOutOfOtherSessions:\s*false/);
    assert.match(form, /user\.reload\(\)/);
    assert.match(form, /skipCache:\s*true/);
    assert.match(form, /clearMustChangePassword/);
  });
});
