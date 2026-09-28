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
    const outsideListings = book.replace(/\{`[\s\S]*?`\}/g, "");
    assert.doesNotMatch(outsideListings, /<TailwindResponsiveDesign/);
    assert.doesNotMatch(book, /defaultWidth/);
    const preview = read("app/book/components/ResponsivePreview.tsx");
    const previewCss = read("app/book/components/responsive-preview.module.css");
    assert.match(preview, /TAILWIND_PREVIEW_FRAMES/);
    assert.match(previewCss, /transform:\s*scale\(calc\(100cqw/);
    assert.match(previewCss, /flex-wrap:\s*wrap/);
    assert.match(previewCss, /@container \(max-width: 52rem\)/);
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

  it("loads one Tailwind entry on the responsive preview so Preflight does not follow utilities", () => {
    const layout = read("app/preview/layout.tsx");
    const page = read("app/preview/tailwind-responsive/page.tsx");
    const media = read("app/preview/media-queries/page.tsx");
    const mediaDemo = read("app/labs/lab2/MediaQueriesDemo.tsx");
    assert.match(layout, /id="preview-root"/);
    assert.doesNotMatch(layout, /tailwind/);
    assert.match(page, /tailwind\/index\.css/);
    assert.doesNotMatch(page, /utilities\.css/);
    assert.doesNotMatch(media, /tailwind/);
    assert.doesNotMatch(mediaDemo, /tailwind/);
    assert.match(read("app/labs/lab2/tailwind/index.css"), /@import "tailwindcss"/);
    assert.match(read("app/labs/lab2/tailwind/page.tsx"), /import "\.\/index\.css"/);
    const student = read("app/labs/lab2/tailwind/TailwindResponsiveDesign.tsx");
    assert.match(student, /font-sans/);
    assert.match(student, /no-underline/);
    assert.match(student, /min-w-0/);
  });

  it("teaches one responsive idea at a time before the card", () => {
    const book = read("app/book/ch2/sections/IconsAndTailwind.tsx");
    const model = read("app/book/components/responsive-preview-model.ts");
    const lab = read("app/labs/lab2/tailwind/page.tsx");
    const section = book.slice(
      book.indexOf("2.3.4 Responsive Design"),
      book.indexOf("2.3.5 Filters"),
    );
    assert.ok(section.length > 0);
    assert.match(section, /48rem \(768px\)/);
    assert.match(section, /combines the ideas above/);
    assert.match(section, /md:max-w-2xl/);
    assert.match(section, /md:shrink-0/);
    assert.doesNotMatch(book, /defaultWidth/);

    const demos = [
      {
        name: "TailwindResponsiveBreakpoint",
        src: "TAILWIND_RESPONSIVE_BREAKPOINT_PREVIEW_SRC",
        frames: "TAILWIND_BREAKPOINT_PREVIEW_FRAMES",
        route: "app/preview/tailwind-responsive-breakpoint/page.tsx",
        id: "wd-tailwind-responsive-breakpoint",
        labels: [/Phone, 375px: red/, /Desktop, 1024px: green/],
        classes: /bg-red-500 md:bg-green-500/,
      },
      {
        name: "TailwindResponsiveShowHide",
        src: "TAILWIND_RESPONSIVE_SHOW_HIDE_PREVIEW_SRC",
        frames: "TAILWIND_SHOW_HIDE_PREVIEW_FRAMES",
        route: "app/preview/tailwind-responsive-show-hide/page.tsx",
        id: "wd-tailwind-responsive-show-hide",
        labels: [/Phone, 375px: small screen/, /Desktop, 1024px: large screen/],
        classes: /block md:hidden[\s\S]*hidden md:block/,
      },
      {
        name: "TailwindResponsiveFlex",
        src: "TAILWIND_RESPONSIVE_FLEX_PREVIEW_SRC",
        frames: "TAILWIND_FLEX_PREVIEW_FRAMES",
        route: "app/preview/tailwind-responsive-flex/page.tsx",
        id: "wd-tailwind-responsive-flex",
        labels: [/Phone, 375px: stacked/, /Desktop, 1024px: side by side/],
        classes: /flex flex-col md:flex-row gap-4/,
      },
      {
        name: "TailwindResponsiveGrid",
        src: "TAILWIND_RESPONSIVE_GRID_PREVIEW_SRC",
        frames: "TAILWIND_GRID_PREVIEW_FRAMES",
        route: "app/preview/tailwind-responsive-grid/page.tsx",
        id: "wd-tailwind-responsive-grid",
        labels: [/Phone, 375px: 1 column/, /700px: 2 columns/, /Desktop, 1024px: 4 columns/],
        classes: /grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4/,
      },
      {
        name: "TailwindResponsiveSpacingText",
        src: "TAILWIND_RESPONSIVE_SPACING_TEXT_PREVIEW_SRC",
        frames: "TAILWIND_SPACING_TEXT_PREVIEW_FRAMES",
        route: "app/preview/tailwind-responsive-spacing-text/page.tsx",
        id: "wd-tailwind-responsive-spacing-text",
        labels: [/Phone, 375px: compact/, /Desktop, 1024px: larger type/],
        classes: /p-2 text-base md:p-8 md:text-2xl/,
      },
    ] as const;

    const headings = [
      "2.3.4.1 One breakpoint",
      "2.3.4.2 Show and hide by width",
      "2.3.4.3 Stack, then side by side",
      "2.3.4.4 Grid columns by breakpoint",
      "2.3.4.5 Spacing and text size",
      "2.3.4.6 A responsive card",
    ];
    let cursor = 0;
    for (const heading of headings) {
      const at = section.indexOf(heading);
      assert.ok(at > cursor, heading);
      cursor = at;
    }
    assert.match(section, /40rem \(640px\)/);
    assert.match(section, /64rem \(1024px\)/);
    assert.match(section, /80rem \(1280px\)/);
    assert.match(section, /96rem \(1536px\)/);
    assert.match(section, /<strong>breakpoint<\/strong>/);
    assert.match(section, /to="2\.1\.20"/);
    assert.match(section, /1rem is usually 16px, so 48rem is 768px/);
    assert.match(section, /to="2\.1\.17"/);
    const css = read("app/book/ch2/sections/CssProperties.tsx");
    const remAt = css.search(
      /relative to the\s+root font size, usually\s+16px, so 2rem = 32px/,
    );
    assert.ok(remAt >= 0 && remAt < css.indexOf("margin: 0 1rem"));
    const breakpointAt = css.search(/viewport width at\s+which styles change/);
    assert.ok(
      breakpointAt >= 0 &&
        breakpointAt < css.indexOf("one more <code>@media</code>"),
    );
    const throughCard = lab
      .replace(/\nimport TailwindFilters from "\.\/TailwindFilters";/, "")
      .replace(/\nimport TailwindGrids from "\.\/TailwindGrids";/, "")
      .replace(
        /\n\s*<hr className="my-8" \/>\n\s*<TailwindFilters \/>\n\s*<hr className="my-8" \/>\n\s*<TailwindGrids \/>/,
        "",
      )
      .trim();
    assert.match(section, /flex-direction: column/);
    assert.match(section, /flex-direction: row/);
    assert.match(section, /CSS Grid/);
    assert.match(section, /to="2\.3\.6"/);
    assert.match(section, /object-cover/);
    assert.match(section, /fixed width of 12rem/);
    assert.match(section, /minimum height of 14rem/);
    assert.match(section, /fit="natural"/);
    assert.doesNotMatch(section, /gutter/);
    assert.match(read("app/book/components/ResponsivePreview.tsx"), /fit\?: "contain" \| "natural"/);
    assert.match(read("app/book/components/responsive-preview.module.css"), /overflow-x:\s*auto/);
    assert.ok(section.includes(throughCard));
    assert.doesNotMatch(section, /TailwindFilters|TailwindGrids/);

    let labAt = 0;
    let demoAt = 0;
    for (const demo of demos) {
      const at = section.indexOf(`name="${demo.name}"`);
      assert.ok(at > demoAt, demo.name);
      demoAt = at;
      assert.match(
        section,
        new RegExp(
          `src=\\{${demo.src}\\}[\\s\\S]*?frames=\\{${demo.frames}\\}`,
        ),
      );
      assert.doesNotMatch(
        book.replace(/\{`[\s\S]*?`\}/g, ""),
        new RegExp(`<${demo.name}[\\s/>]`),
      );
      const student = read(`app/labs/lab2/tailwind/${demo.name}.tsx`);
      assert.match(student, new RegExp(`id="${demo.id}"`));
      assert.match(student, demo.classes);
      assert.ok(book.includes(student.trim()), demo.name);
      const preview = read(demo.route);
      assert.match(preview, new RegExp(demo.name));
      assert.match(preview, /tailwind\/index\.css/);
      assert.doesNotMatch(preview, /utilities\.css/);
      for (const label of demo.labels) assert.match(model, label);
      const rendered = lab.indexOf(`<${demo.name} />`);
      assert.ok(rendered > labAt, demo.name);
      labAt = rendered;
    }
    const card = lab.indexOf("<TailwindResponsiveDesign />");
    assert.ok(card > labAt);
    assert.ok(section.indexOf('name="TailwindResponsiveDesign"') > demoAt);
    assert.ok(section.indexOf('name="TailwindResponsiveDesign"') > section.indexOf("2.3.4.6"));
  });
});
