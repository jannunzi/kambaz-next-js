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
import TermsPage from "./page.tsx";

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

describe("terms of service page", () => {
  it("renders the public terms server-side", () => {
    const page = read("app/terms/page.tsx");
    const layout = read("app/terms/layout.tsx");
    assert.doesNotMatch(page, /["']use client["']/);
    assert.doesNotMatch(layout, /["']use client["']/);
    assert.match(layout, /CourseInfoLayout/);

    const html = markup(createElement(TermsPage));
    assert.match(html, /<h1[^>]*>Terms of Service<\/h1>/);
    assert.match(html, /Effective date: October 7, 2026/);
    assert.match(html, /Northeastern University/);
    assert.match(html, /CS 4550 and CS 5610/);
    assert.match(html, /not an\s+official Northeastern service/);
    assert.match(html, /Jose Annunziato/);
    for (const service of ["Clerk", "Vercel", "MongoDB Atlas", "YouTube", "GitHub", "Google", "xAI"]) {
      assert.match(html, new RegExp(service));
    }
    assert.match(html, /href="https:\/\/www\.youtube\.com\/t\/terms"/);
    assert.match(html, /href="https:\/\/policies\.google\.com\/privacy"/);
    assert.match(
      html,
      /href="https:\/\/catalog\.northeastern\.edu\/handbook\/policies-regulations\/academic-integrity\/"/,
    );
    assert.match(html, /As an Amazon Associate I earn from qualifying purchases\./);
    assert.match(html, /Commonwealth of\s+Massachusetts/);
    assert.match(html, /href="mailto:jannunzi@gmail\.com"/);
    assert.match(html, /href="\/privacy"/);
    assert.match(html, /href="\/syllabus"/);
    assert.match(html, />Terms<\/span>/);
  });

  it("keeps /terms public and linked from the course footer", () => {
    assert.equal(isPasswordChangeExemptPath("/terms"), true);
    assert.equal(isPasswordChangeExemptPath("/terms/"), true);
    assert.equal(
      passwordChangeRedirect({
        pathname: "/terms",
        signedIn: true,
        mustChangePassword: true,
      }),
      null,
    );
    assert.match(read("app/course-info/CourseInfoFooter.tsx"), /href="\/terms"/);
  });
});
