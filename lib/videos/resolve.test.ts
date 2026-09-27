import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { COURSE_SECTION_IDS } from "../roster/sections.ts";
import { bookPathForSection, bookSectionNumberLabel } from "./book-section.ts";
import {
  defaultVideoCourseId,
  defaultVideoSemester,
  sourceCourseIdForSyllabusSection,
  videoCourseOptions,
} from "./courses.ts";
import {
  bookSectionHasClip,
  bookSectionTitle,
  defaultBookSectionId,
  lectureClipMap,
  listBookSectionIds,
} from "./map.ts";
import { fullLectureHref } from "./full-lecture.ts";
import { listVideoHubChapters, parentBookSectionId } from "./hub.ts";
import {
  courseTermPlaylists,
  publishedCoursePlaylists,
} from "./playlists.ts";
import { parseVideosQuery, videosHref } from "./query.ts";
import {
  describeClipFallback,
  resolveLectureClip,
} from "./resolve.ts";
import { semesterCodeFromTermLabel, semesterRank } from "./semester.ts";
import type { LectureClipMap } from "./types.ts";
import { CSS_2_1_POSTERS, HTML_1_3_POSTERS, brandedPosterUrl } from "./thumbs.ts";
import { parseLectureClipMap } from "./validate.ts";
import {
  youtubeEmbedUrl,
  youtubePlaylistUrl,
  youtubeThumbUrl,
  youtubeVideoIdFromUrl,
  youtubeWatchUrl,
} from "./youtube.ts";

const root = process.cwd();

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("semester codes", () => {
  it("orders spring, summer, and fall, then the next year", () => {
    const ranks = ["SP26", "SU26", "FA26", "SP27"].map((code) => semesterRank(code));
    assert.deepEqual(ranks, [...ranks].sort((a, b) => a! - b!));
    assert.ok(semesterRank("FA26")! > semesterRank("SP26")!);
    assert.ok(semesterRank("SP26")! > semesterRank("FA25")!);
    assert.equal(semesterRank("Fall 2026"), null);
    assert.equal(semesterCodeFromTermLabel("Fall 2026"), "FA26");
    assert.equal(semesterCodeFromTermLabel("Spring 2026"), "SP26");
  });
});

describe("resolveLectureClip", () => {
  const map: LectureClipMap = {
    sections: {
      "sec-1-2-1": [
        {
          youtubeVideoId: "Fa26Stub001",
          startSec: 90,
          endSec: 420,
          sourceCourse: "CS4550",
          semester: "FA26",
          confidence: "placeholder",
        },
        {
          youtubeVideoId: "Fa26Stub002",
          startSec: 40,
          endSec: 260,
          sourceCourse: "CS5610-02",
          semester: "FA26",
          confidence: "high",
        },
        {
          youtubeVideoId: "Sp26Stub001",
          startSec: 10,
          endSec: 80,
          sourceCourse: "CS4550",
          semester: "SP26",
          confidence: "high",
        },
        {
          youtubeVideoId: "Fa25Stub001",
          startSec: 10,
          endSec: 80,
          sourceCourse: "CS4550",
          semester: "FA25",
          confidence: "high",
        },
      ],
      "sec-9-9": [
        {
          url: "https://youtu.be/Sp26Stub001",
          startSec: 5,
          endSec: 15,
          sourceCourse: "CS5610-09",
          semester: "SP26",
          confidence: "medium",
        },
      ],
    },
  };

  it("prefers the same section in the preferred semester", () => {
    const resolved = resolveLectureClip(map, {
      bookSectionId: "sec-1-2-1",
      preferredCourse: "CS4550",
      preferredSemester: "FA26",
    });
    assert.equal(resolved?.tier, "same-section");
    assert.equal(resolved?.youtubeVideoId, "Fa26Stub001");
    assert.match(
      describeClipFallback(resolved!, { course: "CS4550", semester: "FA26" }),
      /CS4550 · FA26/,
    );
  });

  it("uses another section in the same semester before any prior semester", () => {
    const resolved = resolveLectureClip(map, {
      bookSectionId: "sec-1-2-1",
      preferredCourse: "CS5610-09",
      preferredSemester: "FA26",
    });
    assert.equal(resolved?.tier, "same-semester");
    assert.equal(resolved?.clip.semester, "FA26");
    assert.equal(resolved?.youtubeVideoId, "Fa26Stub002");
  });

  it("uses the latest prior semester and keeps the same section inside it", () => {
    const resolved = resolveLectureClip(map, {
      bookSectionId: "sec-1-2-1",
      preferredCourse: "CS4550",
      preferredSemester: "SU26",
    });
    assert.equal(resolved?.tier, "prior-semester");
    assert.equal(resolved?.clip.semester, "SP26");
    assert.equal(resolved?.clip.sourceCourse, "CS4550");
  });

  it("does not use a later semester when the preferred semester has no clip", () => {
    const resolved = resolveLectureClip(map, {
      bookSectionId: "sec-1-2-1",
      preferredCourse: "CS4550",
      preferredSemester: "SP25",
    });
    assert.equal(resolved, null);
  });

  it("returns null for an unknown book section or semester code", () => {
    assert.equal(
      resolveLectureClip(map, {
        bookSectionId: "sec-missing",
        preferredCourse: "CS4550",
        preferredSemester: "FA26",
      }),
      null,
    );
    assert.equal(
      resolveLectureClip(map, {
        bookSectionId: "sec-1-2-1",
        preferredCourse: "CS4550",
        preferredSemester: "Fall 2026",
      }),
      null,
    );
  });

  it("reads a YouTube url when no id is stored", () => {
    const resolved = resolveLectureClip(map, {
      bookSectionId: "sec-9-9",
      preferredCourse: "CS4550",
      preferredSemester: "FA26",
    });
    assert.equal(resolved?.tier, "prior-semester");
    assert.equal(resolved?.youtubeVideoId, "Sp26Stub001");
  });
});

const HTML_PILOT_SECTION_IDS = [
  "sec-1-3",
  "sec-1-3-1",
  "sec-1-3-2",
  "sec-1-3-3",
  "sec-1-3-6",
  "sec-1-3-6-1",
  "sec-1-3-6-3",
  "sec-1-3-6-4",
  "sec-1-3-6-5",
  "sec-1-3-6-6",
  "sec-1-3-6-7",
  "sec-1-3-7",
  "sec-1-3-8",
  "sec-1-3-9",
  "sec-1-3-11",
];

describe("HTML §1.3 lecture clip map", () => {
  it("keeps Yolanda's 15 HTML §1.3 sections", () => {
    assert.match(lectureClipMap.description ?? "", /HTML §1\.3/);
    assert.doesNotMatch(lectureClipMap.description ?? "", /PLACEHOLDER/);
    const htmlIds = listBookSectionIds().filter((id) => id.startsWith("sec-1-"));
    assert.deepEqual(htmlIds, [...HTML_PILOT_SECTION_IDS].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    ));
    assert.equal(htmlIds.length, 15);
    assert.equal(defaultBookSectionId(), "sec-1-3");
    assert.equal(bookSectionHasClip("sec-1-3-1"), true);
    assert.equal(bookSectionHasClip("sec-1-3-4"), false);
    assert.equal(bookSectionHasClip("sec-1-3-6-2"), false);

    const toc = read("app/book/TOC.tsx");
    for (const id of HTML_PILOT_SECTION_IDS) {
      assert.match(toc, new RegExp(`id:\\s*"${id}"`));
      const clips = lectureClipMap.sections[id] ?? [];
      assert.equal(clips.length, 1, id);
      const score = clips[0]?.confidence;
      assert.equal(typeof score, "number", id);
      assert.ok(typeof score === "number" && score >= 0.7, id);
    }
    assert.equal(bookSectionTitle("sec-1-3-1"), "Headings, div, and span");
    assert.equal(bookPathForSection("sec-1-3-1"), "/book/ch1#sec-1-3-1");
  });

  it("resolves sec-1-3-1 to the SP26 CS4550 clip for a Fall 2026 student", () => {
    const resolved = resolveLectureClip(lectureClipMap, {
      bookSectionId: "sec-1-3-1",
      preferredCourse: "CS4550",
      preferredSemester: "FA26",
    });
    assert.equal(resolved?.tier, "prior-semester");
    assert.equal(resolved?.youtubeVideoId, "LUCofdJQ4qE");
    assert.equal(resolved?.clip.startSec, 960);
    assert.equal(resolved?.clip.endSec, 1298);
    assert.equal(resolved?.clip.semester, "SP26");
    assert.equal(resolved?.clip.sourceCourse, "CS4550");
    assert.equal(resolved?.clip.confidence, 0.82);

    const sameTerm = resolveLectureClip(lectureClipMap, {
      bookSectionId: "sec-1-3-7",
      preferredCourse: "CS4550",
      preferredSemester: "FA26",
    });
    assert.equal(sameTerm?.tier, "same-semester");
    assert.equal(sameTerm?.clip.semester, "FA26");
    assert.equal(sameTerm?.clip.sourceCourse, "CS5610");
    assert.equal(sameTerm?.youtubeVideoId, "i1MK6EwHVoU");
  });

  it("offers the whole SP26 session and keeps FA26 parts as snippets", () => {
    const snippet = resolveLectureClip(lectureClipMap, {
      bookSectionId: "sec-1-3-1",
      preferredCourse: "CS4550",
      preferredSemester: "FA26",
    });
    assert.ok(snippet);
    assert.equal(
      fullLectureHref(snippet),
      "https://www.youtube.com/watch?v=LUCofdJQ4qE",
    );
    assert.doesNotMatch(fullLectureHref(snippet) ?? "", /[?&](?:t|start)=/);
    assert.match(youtubeWatchUrl(snippet.youtubeVideoId, snippet.clip.startSec), /[?&]t=960s/);
    assert.match(youtubeWatchUrl(snippet.youtubeVideoId, snippet.clip.startSec), /[?&]start=960/);

    const part = resolveLectureClip(lectureClipMap, {
      bookSectionId: "sec-1-3-7",
      preferredCourse: "CS4550",
      preferredSemester: "FA26",
    });
    assert.ok(part);
    assert.equal(part.clip.semester, "FA26");
    assert.equal(fullLectureHref(part), null);
    assert.equal(part.clip.parentLectureYoutubeId, undefined);
    assert.equal(part.clip.fullLectureUrl, undefined);
    assert.equal(part.clip.playlistUrl, undefined);

    for (const id of HTML_PILOT_SECTION_IDS) {
      const resolved = resolveLectureClip(lectureClipMap, {
        bookSectionId: id,
        preferredCourse: "CS4550",
        preferredSemester: "FA26",
      });
      assert.ok(resolved, id);
      const href = fullLectureHref(resolved);
      if (resolved.clip.semester === "SP26") {
        assert.equal(href, `https://www.youtube.com/watch?v=${resolved.youtubeVideoId}`, id);
      } else {
        assert.equal(href, null, id);
      }
    }
  });

  it("uses an explicit full lecture and inherits section-level pointers", () => {
    const parsed = parseLectureClipMap({
      sections: {
        "sec-1-3-7": [
          {
            youtubeVideoId: "i1MK6EwHVoU",
            startSec: 35,
            endSec: 250,
            sourceCourse: "CS5610",
            semester: "FA26",
            confidence: 0.78,
            parentLectureYoutubeId: "LUCofdJQ4qE",
          },
        ],
        "sec-1-3-8": {
          fullLectureUrl: "https://www.youtube.com/watch?v=ParentVid01",
          playlistUrl: "https://www.youtube.com/playlist?list=PLcourse123",
          clips: [
            {
              youtubeVideoId: "i1MK6EwHVoU",
              startSec: 168,
              endSec: 550,
              sourceCourse: "CS5610",
              semester: "FA26",
              confidence: 0.85,
            },
            {
              youtubeVideoId: "i1MK6EwHVoU",
              startSec: 10,
              endSec: 20,
              sourceCourse: "CS5610",
              semester: "FA26",
              confidence: 0.8,
              fullLectureUrl: "https://youtu.be/ClipParent1",
            },
          ],
        },
      },
    });
    const parent = parsed.sections["sec-1-3-7"]?.[0];
    assert.ok(parent);
    assert.equal(
      fullLectureHref({ clip: parent, youtubeVideoId: "i1MK6EwHVoU" }),
      "https://www.youtube.com/watch?v=LUCofdJQ4qE",
    );
    const inherited = parsed.sections["sec-1-3-8"]?.[0];
    assert.ok(inherited);
    assert.equal(inherited.fullLectureUrl, "https://www.youtube.com/watch?v=ParentVid01");
    assert.equal(
      fullLectureHref({ clip: inherited, youtubeVideoId: "i1MK6EwHVoU" }),
      "https://www.youtube.com/watch?v=ParentVid01",
    );
    const overridden = parsed.sections["sec-1-3-8"]?.[1];
    assert.ok(overridden);
    assert.equal(
      fullLectureHref({ clip: overridden, youtubeVideoId: "i1MK6EwHVoU" }),
      "https://youtu.be/ClipParent1",
    );

    const playlistOnly = parseLectureClipMap({
      sections: {
        "sec-1-3-11": [
          {
            youtubeVideoId: "q8QebLwQMhM",
            startSec: 0,
            endSec: 255,
            sourceCourse: "CS5610",
            semester: "FA26",
            confidence: 0.75,
            playlistUrl: "https://www.youtube.com/playlist?list=PLlayouts01",
          },
        ],
      },
    }).sections["sec-1-3-11"]?.[0];
    assert.ok(playlistOnly);
    assert.equal(
      fullLectureHref({ clip: playlistOnly, youtubeVideoId: "q8QebLwQMhM" }),
      "https://www.youtube.com/playlist?list=PLlayouts01",
    );

    assert.throws(
      () =>
        parseLectureClipMap({
          sections: {
            "sec-1-3-7": [
              {
                youtubeVideoId: "i1MK6EwHVoU",
                startSec: 1,
                endSec: 2,
                sourceCourse: "CS5610",
                semester: "FA26",
                confidence: 0.8,
                fullLectureUrl: "https://northeastern.box.com/s/archive",
              },
            ],
          },
        }),
      /YouTube/,
    );
  });

  it("rejects archive hosts and inconsistent ids", () => {
    assert.throws(() =>
      parseLectureClipMap({
        sections: {
          "sec-1-1": [
            {
              url: "https://northeastern.box.com/s/archive",
              startSec: 0,
              endSec: 10,
              sourceCourse: "CS4550",
              semester: "FA26",
              confidence: "low",
            },
          ],
        },
      }),
      /YouTube/,
    );
    assert.equal(youtubeVideoIdFromUrl("https://youtu.be/Fa26Stub001?t=12"), "Fa26Stub001");
    assert.equal(
      youtubeVideoIdFromUrl("https://www.youtube.com/watch?v=Fa26Stub002"),
      "Fa26Stub002",
    );
  });
});

describe("videos query and course ids", () => {
  it("matches Fall 2026 roster section ids and builds a YouTube deep link", () => {
    assert.deepEqual(
      videoCourseOptions().map((option) => option.id),
      [...COURSE_SECTION_IDS],
    );
    assert.equal(
      sourceCourseIdForSyllabusSection({ code: "CS 5610", sectionNumber: "09" }),
      "CS5610-09",
    );
    assert.equal(defaultVideoCourseId(), "CS4550");
    assert.equal(defaultVideoSemester(), "FA26");
    assert.equal(bookSectionNumberLabel("sec-1-2-1"), "1.2.1");
    assert.equal(bookPathForSection("sec-1-3"), "/book/ch1#sec-1-3");
    assert.equal(bookPathForSection("sec-1-3-1"), "/book/ch1#sec-1-3-1");
    assert.equal(bookPathForSection("sec-2-1-10"), "/book/ch2#sec-2-1-10");

    const href = videosHref("sec-1-2-1", { course: "CS4550", semester: "FA26" });
    assert.equal(href, "/videos?section=sec-1-2-1&course=CS4550&semester=FA26");
    assert.match(youtubeEmbedUrl("Fa26Stub001", 90, 420), /start=90/);
    assert.match(youtubeEmbedUrl("Fa26Stub001", 90, 420), /end=420/);
    assert.match(youtubeEmbedUrl("Fa26Stub001", 90, 420), /youtube-nocookie\.com\/embed\//);
    assert.match(youtubeWatchUrl("Fa26Stub001", 90), /[?&]start=90/);
    assert.equal(
      youtubeThumbUrl("LUCofdJQ4qE"),
      "https://img.youtube.com/vi/LUCofdJQ4qE/hqdefault.jpg",
    );
    assert.doesNotMatch(youtubeThumbUrl("LUCofdJQ4qE"), /embed|iframe/);
    assert.match(youtubeWatchUrl("Fa26Stub001", 90), /[?&]t=90s/);
    assert.doesNotMatch(youtubeWatchUrl("Fa26Stub001", 90), /mux|blob/i);
  });

  it("canonicalizes bookSectionId, course case, and semester case", () => {
    const defaults = { section: "sec-1-2-1", course: "CS4550", semester: "FA26" };
    const known = ["CS4550", "CS5610-02", "CS5610-09"];
    const fromBook = parseVideosQuery(
      { bookSectionId: "sec-1-3" },
      defaults,
      known,
    );
    assert.equal(fromBook.canonical, false);
    assert.equal(fromBook.section, "sec-1-3");
    assert.equal(fromBook.course, "CS4550");
    assert.equal(fromBook.semester, "FA26");

    const cased = parseVideosQuery(
      { section: "sec-1-2-1", course: "cs5610-02", semester: "fa26" },
      defaults,
      known,
    );
    assert.equal(cased.canonical, false);
    assert.equal(cased.course, "CS5610-02");
    assert.equal(cased.semester, "FA26");
    assert.equal(cased.semesterValid, true);

    const ready = parseVideosQuery(
      { section: "sec-1-2-1", course: "CS4550", semester: "FA26" },
      defaults,
      known,
    );
    assert.equal(ready.canonical, true);

    const badSemester = parseVideosQuery(
      { section: "sec-1-2-1", course: "CS4550", semester: "2026" },
      defaults,
      known,
    );
    assert.equal(badSemester.semesterValid, false);
    assert.equal(badSemester.semester, "2026");

    const hub = parseVideosQuery({}, defaults, known);
    assert.equal(hub.hub, true);
    assert.equal(hub.section, "");
    assert.equal(hub.canonical, true);

    const deepLink = parseVideosQuery({ section: "sec-1-3-1" }, defaults, known);
    assert.equal(deepLink.hub, false);
    assert.equal(deepLink.canonical, true);
    assert.equal(deepLink.course, "CS4550");
    assert.equal(deepLink.semester, "FA26");
  });
});

describe("videos hub", () => {
  it("groups mapped clips like the slides hub, HTML then CSS §2.1", () => {
    assert.equal(parentBookSectionId("sec-1-3-6-1"), "sec-1-3");
    assert.equal(parentBookSectionId("sec-1-3"), "sec-1-3");
    const chapters = listVideoHubChapters(lectureClipMap, {
      course: "CS4550",
      semester: "FA26",
    });
    assert.equal(chapters.length, 2);
    assert.equal(chapters[0]?.chapter, 1);
    assert.equal(chapters[0]?.title, "Building Next.js User Interfaces with HTML");
    assert.equal(chapters[0]?.sections.length, 1);
    assert.equal(chapters[0]?.sections[0]?.id, "sec-1-3");
    assert.equal(chapters[0]?.sections[0]?.title, "1.3 Introduction to HTML");
    assert.equal(chapters[0]?.sections[0]?.clips.length, 15);
    const headings = chapters[0]?.sections[0]?.clips.find(
      (clip) => clip.id === "sec-1-3-1",
    );
    assert.equal(headings?.heading, "1.3.1 Headings, div, and span");
    assert.match(headings?.embedUrl ?? "", /start=960/);
    assert.match(headings?.embedUrl ?? "", /end=1298/);
    assert.equal(
      headings?.fullLectureUrl,
      "https://www.youtube.com/watch?v=LUCofdJQ4qE",
    );
    const part = chapters[0]?.sections[0]?.clips.find(
      (clip) => clip.id === "sec-1-3-7",
    );
    assert.equal(part?.fullLectureUrl, null);
    assert.equal(part?.posterUrl, null);
    assert.match(part?.embedUrl ?? "", /youtube-nocookie\.com\/embed\//);
    assert.equal(
      headings?.posterUrl,
      "/videos/thumbs/html-1-3/02-headings-div.jpg",
    );
    assert.equal(
      chapters[0]?.sections[0]?.clips.find((clip) => clip.id === "sec-1-3")
        ?.posterUrl,
      "/videos/thumbs/html-1-3/01-html-overview.jpg",
    );
    const css = chapters[1];
    assert.equal(css?.chapter, 2);
    assert.equal(css?.title, "Styling User Interfaces with CSS and Tailwind");
    assert.equal(css?.sections.length, 1);
    assert.equal(css?.sections[0]?.id, "sec-2-1");
    assert.equal(css?.sections[0]?.title, "2.1 Styling React Components with CSS");
    assert.equal(css?.sections[0]?.clips.length, 21);
    const flex = css?.sections[0]?.clips.find((clip) => clip.id === "sec-2-1-19");
    assert.equal(flex?.youtubeVideoId, "y0Y2ZHeu6us");
    assert.equal(flex?.posterUrl, "/videos/thumbs/css-2-1/20-flexbox.jpg");
    assert.equal(
      flex?.fullLectureUrl,
      "https://www.youtube.com/watch?v=wBh_OSjiRqY",
    );
    assert.equal(
      css?.sections[0]?.clips.some(
        (clip) => clip.id === "sec-2-1-21" || clip.id === "sec-2-2",
      ),
      false,
    );
  });
});

describe("videos page shell", () => {
  it("links the book to a slides-style thumbnail hub and plays one clip at a time", () => {
    const links = read("app/course-info/links.ts");
    assert.match(links, /href: "\/videos", label: "Videos"/);
    assert.match(read("app/book/components/Section.tsx"), /BookSectionVideosLink/);
    assert.match(read("app/book/components/BookSectionVideosLink.tsx"), /Videos/);
    assert.match(
      read("app/book/ch1/sections/HtmlSections.tsx"),
      /BookSectionVideosLink sectionId="sec-1-3-6-1"/,
    );

    const page = read("app/videos/page.tsx");
    assert.match(page, /VideosHub/);
    assert.doesNotMatch(page, /VideoPlaybackForm|<select/);
    const hub = read("app/videos/components/VideosHub.tsx");
    assert.match(hub, /aspect-video/);
    assert.match(hub, /grid-cols-1 gap-4/);
    assert.match(hub, /LectureChapterLink/);
    assert.match(hub, /youtubeThumbUrl/);
    assert.match(hub, /posterUrl/);
    assert.match(hub, /CoursePlaylists/);
    assert.match(hub, /<iframe/);
    assert.match(hub, /Watch full lecture/);
    assert.match(hub, /Open in the book/);
    assert.match(read("lib/videos/hub.ts"), /youtubeEmbedUrl/);
    assert.doesNotMatch(`${page}\n${hub}`, /mux|vercel\/blob|@mux/i);
    assert.match(page, /publishedCoursePlaylists/);
  });
});

describe("HTML §1.3 branded posters", () => {
  it("maps each sample to its book section and leaves the other clips on YouTube", () => {
    const expected: Record<string, string> = {
      "sec-1-3": "01-html-overview.jpg",
      "sec-1-3-1": "02-headings-div.jpg",
      "sec-1-3-2": "03-paragraphs.jpg",
      "sec-1-3-3": "04-lists.jpg",
      "sec-1-3-6": "05-html-forms.jpg",
      "sec-1-3-6-1": "06-text-inputs.jpg",
      "sec-1-3-6-3": "09-radio-buttons.jpg",
      "sec-1-3-6-4": "10-checkboxes.jpg",
      "sec-1-3-6-5": "11-dropdowns.jpg",
      "sec-1-3-6-7": "12-buttons.jpg",
      "sec-1-3-9": "07-anchors.jpg",
      "sec-1-3-11": "08-layouts.jpg",
    };
    assert.deepEqual(
      Object.fromEntries(
        Object.entries(HTML_1_3_POSTERS).map(([id, path]) => [
          id,
          path.split("/").pop(),
        ]),
      ),
      expected,
    );
    for (const [id, file] of Object.entries(expected)) {
      assert.ok(lectureClipMap.sections[id]?.length, `${id} has a clip`);
      const path = brandedPosterUrl(id);
      assert.equal(path, `/videos/thumbs/html-1-3/${file}`);
      const disk = join(root, "public", path!.slice(1));
      assert.ok(existsSync(disk), `${path} is missing on disk`);
      const size = jpegSize(disk);
      assert.deepEqual(size, { width: 1280, height: 720 });
    }

    for (const id of listBookSectionIds()) {
      if (id in expected || id in CSS_2_1_POSTERS) continue;
      assert.equal(brandedPosterUrl(id), null, `${id} stays on hqdefault`);
    }
    assert.equal(brandedPosterUrl("sec-1-3-7"), null);
    assert.equal(brandedPosterUrl("sec-1-3-8"), null);
  });
});

const CSS_2_1_SECTION_IDS = [
  "sec-2-1",
  "sec-2-1-1",
  "sec-2-1-2",
  "sec-2-1-3",
  "sec-2-1-4",
  "sec-2-1-5",
  "sec-2-1-6",
  "sec-2-1-7",
  "sec-2-1-8",
  "sec-2-1-9",
  "sec-2-1-10",
  "sec-2-1-11",
  "sec-2-1-12",
  "sec-2-1-13",
  "sec-2-1-14",
  "sec-2-1-15",
  "sec-2-1-16",
  "sec-2-1-17",
  "sec-2-1-18",
  "sec-2-1-19",
  "sec-2-1-20",
];

describe("CSS §2.1 lecture clips", () => {
  it("resolves sec-2-1-19 to the standalone Flex upload", () => {
    const resolved = resolveLectureClip(lectureClipMap, {
      bookSectionId: "sec-2-1-19",
      preferredCourse: "CS4550",
      preferredSemester: "FA26",
    });
    assert.ok(resolved);
    assert.equal(resolved.tier, "prior-semester");
    assert.equal(resolved.youtubeVideoId, "y0Y2ZHeu6us");
    assert.equal(resolved.clip.startSec, 0);
    assert.equal(resolved.clip.endSec, 993);
    assert.equal(resolved.clip.parentLectureYoutubeId, "wBh_OSjiRqY");
    assert.equal(resolved.clip.sourceCourse, "CS5610");
    assert.equal(resolved.clip.semester, "FA25");
    assert.equal(resolved.clip.confidence, 0.9);
    assert.equal(
      brandedPosterUrl("sec-2-1-19"),
      "/videos/thumbs/css-2-1/20-flexbox.jpg",
    );
    assert.equal(
      fullLectureHref(resolved),
      "https://www.youtube.com/watch?v=wBh_OSjiRqY",
    );
  });

  it("leaves Check Your Understanding, React Icons, Tailwind, Kambaz styling, and Delivery empty", () => {
    for (const id of ["sec-2-1-21", "sec-2-2", "sec-2-3", "sec-2-4", "sec-2-5"]) {
      assert.equal(bookSectionHasClip(id), false, id);
      assert.equal(lectureClipMap.sections[id], undefined, id);
      assert.equal(lectureClipMap.titles?.[id], undefined, id);
    }
  });

  it("maps 21 standalone uploads and validates them through the clip parser", () => {
    assert.match(
      lectureClipMap.description ?? "",
      /CSS §2\.1 is mapped to 21 standalone @WebDevTV uploads/,
    );
    assert.equal(CSS_2_1_SECTION_IDS.length, 21);
    assert.equal(Object.keys(CSS_2_1_POSTERS).length, 21);
    assert.deepEqual(Object.keys(CSS_2_1_POSTERS), CSS_2_1_SECTION_IDS);
    for (const id of CSS_2_1_SECTION_IDS) {
      const clips = lectureClipMap.sections[id] ?? [];
      assert.equal(clips.length, 1, id);
      const clip = clips[0]!;
      assert.equal(clip.startSec, 0, id);
      assert.ok(clip.endSec > 0, id);
      assert.equal(clip.sourceCourse, "CS5610", id);
      assert.match(clip.semester, /^(FA25|FA24|SP23)$/, id);
      assert.equal(typeof clip.confidence, "number", id);
      assert.ok(typeof clip.confidence === "number" && clip.confidence >= 0.7, id);
      assert.match(clip.parentLectureYoutubeId ?? "", /^[A-Za-z0-9_-]{11}$/, id);
      assert.match(clip.youtubeVideoId ?? "", /^[A-Za-z0-9_-]{11}$/, id);
      const path = CSS_2_1_POSTERS[id];
      assert.equal(brandedPosterUrl(id), path, id);
      const disk = join(root, "public", path.slice(1));
      assert.ok(existsSync(disk), `${path} is missing on disk`);
      assert.deepEqual(jpegSize(disk), { width: 1280, height: 720 });
    }
  });
});

describe("course playlists", () => {
  it("keeps the hub hook and hides rows until a live playlist URL is set", () => {
    assert.ok(courseTermPlaylists.length > 0);
    assert.equal(publishedCoursePlaylists().length, 0);
    assert.equal(
      publishedCoursePlaylists([
        {
          scope: "term",
          semester: "FA26",
          label: "Fall 2026",
          url: "https://www.youtube.com/playlist?list=PLexampleterm",
        },
      ])[0]?.url,
      "https://www.youtube.com/playlist?list=PLexampleterm",
    );
    assert.equal(
      youtubePlaylistUrl("https://www.youtube.com/watch?v=LUCofdJQ4qE"),
      null,
    );
    assert.throws(() =>
      publishedCoursePlaylists([
        {
          scope: "course",
          label: "Bad",
          url: "https://example.com/playlist?list=nope",
        },
      ]),
    );
  });
});

function jpegSize(file: string): { width: number; height: number } {
  const buf = readFileSync(file);
  let i = 2;
  while (i + 8 < buf.length) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1] ?? 0;
    if (marker === 0xd8 || marker === 0xd9) {
      i += 2;
      continue;
    }
    const length = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc2) {
      return {
        height: buf.readUInt16BE(i + 5),
        width: buf.readUInt16BE(i + 7),
      };
    }
    i += 2 + length;
  }
  throw new Error(`No JPEG size in ${file}`);
}
