import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  activeBreakpoint,
  clampPreviewWidth,
  MEDIA_QUERY_BREAKPOINTS,
  TAILWIND_BREAKPOINTS,
} from "./components/responsive-preview-model.ts";

function read(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

describe("activeBreakpoint", () => {
  it("names the Tailwind screen that contains the width", () => {
    assert.equal(activeBreakpoint(375, TAILWIND_BREAKPOINTS), "base");
    assert.equal(activeBreakpoint(640, TAILWIND_BREAKPOINTS), "sm");
    assert.equal(activeBreakpoint(767, TAILWIND_BREAKPOINTS), "sm");
    assert.equal(activeBreakpoint(768, TAILWIND_BREAKPOINTS), "md");
    assert.equal(activeBreakpoint(1024, TAILWIND_BREAKPOINTS), "lg");
    assert.equal(activeBreakpoint(1280, TAILWIND_BREAKPOINTS), "xl");
    assert.equal(activeBreakpoint(1536, TAILWIND_BREAKPOINTS), "2xl");
  });

  it("names the media-query range, with the later rule at the shared edges", () => {
    assert.equal(activeBreakpoint(375, MEDIA_QUERY_BREAKPOINTS), "default");
    assert.equal(activeBreakpoint(749, MEDIA_QUERY_BREAKPOINTS), "default");
    assert.equal(activeBreakpoint(750, MEDIA_QUERY_BREAKPOINTS), "750–1000");
    assert.equal(activeBreakpoint(1000, MEDIA_QUERY_BREAKPOINTS), "1000–1250");
    assert.equal(activeBreakpoint(1250, MEDIA_QUERY_BREAKPOINTS), "1250+");
  });

  it("clamps a drag between the phone floor and 2xl", () => {
    assert.equal(clampPreviewWidth(100), 320);
    assert.equal(clampPreviewWidth(800.4), 800);
    assert.equal(clampPreviewWidth(4000), 1536);
  });
});

describe("book responsive previews", () => {
  it("frames the Tailwind card with the same source as the lab file", () => {
    const book = read("app/book/ch2/sections/IconsAndTailwind.tsx");
    const student = read("app/labs/lab2/tailwind/TailwindResponsiveDesign.tsx");
    const page = read("app/preview/tailwind-responsive/page.tsx");
    assert.match(book, /<ResponsivePreview/);
    assert.match(book, /src=\{TAILWIND_RESPONSIVE_PREVIEW_SRC\}/);
    assert.doesNotMatch(book, /<TailwindResponsiveDesign/);
    assert.doesNotMatch(book, /defaultWidth/);
    const preview = read("app/book/components/ResponsivePreview.tsx");
    const previewCss = read("app/book/components/responsive-preview.module.css");
    assert.match(preview, /TAILWIND_PREVIEW_FRAMES/);
    assert.match(previewCss, /transform:\s*scale\(calc\(100cqw/);
    assert.match(previewCss, /flex-wrap:\s*wrap/);
    assert.match(read("app/book/components/responsive-preview-model.ts"), /Phone, 375px: stacked/);
    assert.match(read("app/book/components/responsive-preview-model.ts"), /Desktop, 1024px: side by side/);
    assert.match(student, /md:flex/);
    assert.match(student, /md:shrink-0/);
    assert.match(student, /h-56 w-full object-cover/);
    assert.match(student, /md:h-full md:min-h-56 md:w-48/);
    assert.match(student, /An in-depth study of the fundamentals of rocket propulsion/);
    assert.match(student, /\/images\/reactjs\.jpg/);
    const source = student.trim();
    assert.ok(book.includes(source));
    assert.ok(read("lib/lectures/decks/tailwind-responsive.ts").includes(source));
    assert.doesNotMatch(student, /ResponsivePreview|@container|iframe/);
    assert.match(page, /TailwindResponsiveDesign/);
  });

  it("frames the media-query demo without changing the student CSS", () => {
    const book = read("app/book/ch2/sections/CssProperties.tsx");
    const student = read("app/labs/lab2/MediaQueriesDemo.tsx");
    const css = read("app/labs/lab2/MediaQueriesDemo.css");
    const page = read("app/preview/media-queries/page.tsx");
    assert.match(book, /MEDIA_QUERIES_PREVIEW_SRC|\/preview\/media-queries/);
    assert.match(book, /MEDIA_QUERY_PREVIEW_FRAMES/);
    assert.match(read("app/book/components/responsive-preview-model.ts"), /Phone, 375px: green/);
    assert.match(read("app/book/components/responsive-preview-model.ts"), /Desktop, 1024px: blue/);
    assert.doesNotMatch(book, /<MediaQueriesDemo/);
    assert.match(student, /wd-media-queries-demo/);
    assert.match(css, /@media \(min-width: 750px\)/);
    assert.doesNotMatch(css, /@container/);
    assert.match(page, /MediaQueriesDemo/);
  });

  it("loads Tailwind utilities on the preview document", () => {
    const layout = read("app/preview/layout.tsx");
    assert.match(layout, /tailwind\/utilities\.css/);
    assert.match(layout, /id="preview-root"/);
  });
});
