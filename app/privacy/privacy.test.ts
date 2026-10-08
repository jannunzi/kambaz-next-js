import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it } from "node:test";
import {
  AppRouterContext,
  type AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  isPasswordChangeExemptPath,
  passwordChangeRedirect,
} from "../../lib/auth/must-change-password.ts";
import PrivacyPage from "./page.tsx";

const root = process.cwd();

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

const router: AppRouterInstance = {
  back() {},
  forward() {},
  refresh() {},
  push() {},
  replace() {},
  prefetch() {},
};

function markup(node: ReactNode): string {
  return renderToStaticMarkup(
    createElement(AppRouterContext.Provider, { value: router }, node),
  );
}

describe("privacy policy page", () => {
  it("renders the public policy server-side", () => {
    const page = read("app/privacy/page.tsx");
    const layout = read("app/privacy/layout.tsx");
    assert.doesNotMatch(page, /["']use client["']/);
    assert.doesNotMatch(layout, /["']use client["']/);
    assert.match(layout, /CourseInfoLayout/);

    const html = markup(createElement(PrivacyPage));
    assert.match(html, /<h1[^>]*>Privacy Policy<\/h1>/);
    assert.match(html, /Last updated: October 6, 2026/);
    assert.match(html, /WebDevTV Uploader \(YouTube integration\)/);
    assert.match(html, /jannunzi@gmail\.com/);
    assert.match(html, /@WebDevTV/);
    assert.match(html, /href="https:\/\/myaccount\.google\.com\/permissions"/);
    assert.match(
      html,
      /href="https:\/\/developers\.google\.com\/terms\/api-services-user-data-policy"/,
    );
    assert.match(html, /Limited Use/);
    assert.match(html, /href="https:\/\/www\.youtube\.com\/t\/terms"/);
    assert.match(html, /href="https:\/\/policies\.google\.com\/privacy"/);
    assert.match(html, /The kambaz\.dev course website/);
    assert.match(html, /Clerk/);
    assert.match(html, /session cookie/);
    assert.match(html, /Northeastern University/);
    assert.match(html, /Jose Annunziato/);
    assert.match(html, /MongoDB/);
    assert.match(html, /Vercel/);
    assert.match(html, /xAI/);
    assert.match(html, />Privacy<\/span>/);
    assert.match(html, /href="\/terms"/);
    assert.doesNotMatch(html, /Google sign-in/i);
    assert.doesNotMatch(html, /analytics/i);
    assert.doesNotMatch(html, /late penalt/i);
    assert.doesNotMatch(html, /grading polic/i);
  });

  it("keeps /privacy on the public password-change exemption list", () => {
    assert.equal(isPasswordChangeExemptPath("/privacy"), true);
    assert.equal(isPasswordChangeExemptPath("/privacy/"), true);
    assert.equal(
      passwordChangeRedirect({
        pathname: "/privacy",
        signedIn: false,
        mustChangePassword: false,
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
    const proxy = read("proxy.ts");
    assert.doesNotMatch(proxy, /auth\.protect|createRouteMatcher/);
    assert.match(read("app/course-info/CourseInfoFooter.tsx"), /href="\/privacy"/);
  });
});
