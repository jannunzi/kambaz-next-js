import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { ch1EndMatter } from "../../book/ch1/end-matter.ts";
import {
  BOOK_VIDEOS_HEADING,
  BOOK_VIDEOS_NOTE,
  HOW_TO_USE_THE_BOOK_HEADING,
  HOW_TO_USE_THE_BOOK_INTRO,
} from "../../book/videosOptional.ts";

const howToUseTheBook = readFileSync(
  new URL("../components/HowToUseTheBook.tsx", import.meta.url),
  "utf8",
);
const syllabusHeader = readFileSync(
  new URL("../components/SyllabusHeader.tsx", import.meta.url),
  "utf8",
);
const syllabusView = readFileSync(
  new URL("../components/SyllabusView.tsx", import.meta.url),
  "utf8",
);

describe("how to use the book / optional videos", () => {
  it("states that term videos are optional reference, not required viewing", () => {
    assert.match(BOOK_VIDEOS_HEADING, /optional/i);
    assert.match(BOOK_VIDEOS_NOTE, /optional reference material/i);
    assert.match(BOOK_VIDEOS_NOTE, /main book content is required/i);
    assert.match(
      BOOK_VIDEOS_NOTE,
      /unless an assignment explicitly says otherwise/i,
    );
    assert.doesNotMatch(BOOK_VIDEOS_NOTE, /must watch/i);
    assert.doesNotMatch(BOOK_VIDEOS_NOTE, /required viewing/i);
  });

  it("explains the site as a companion and what the book requires", () => {
    assert.match(HOW_TO_USE_THE_BOOK_HEADING, /how to use the book/i);
    assert.match(HOW_TO_USE_THE_BOOK_INTRO, /companion/i);
    assert.match(HOW_TO_USE_THE_BOOK_INTRO, /main book content/i);
    assert.match(HOW_TO_USE_THE_BOOK_INTRO, /chapter text, labs, and interactive demos/i);
    assert.match(HOW_TO_USE_THE_BOOK_INTRO, /assignment explicitly names/i);
  });

  it("softens chapter 1 references so explainer videos are optional", () => {
    assert.match(ch1EndMatter.references.lead, /optional/i);
    assert.doesNotMatch(
      ch1EndMatter.references.lead,
      /you will find the official site and explainer videos/i,
    );
  });

  it("cross-links lecture recordings from How to use the book", () => {
    assert.match(howToUseTheBook, /href="#meetings"/);
    assert.match(howToUseTheBook, /Meeting information/);
    assert.match(howToUseTheBook, /not the same as lecture recordings/);
  });

  it("does not repeat the optional-videos callout on the syllabus", () => {
    assert.doesNotMatch(howToUseTheBook, /BookVideosNote/);
    assert.doesNotMatch(howToUseTheBook, /Book videos are optional/);
    assert.doesNotMatch(howToUseTheBook, /optional reference material/i);
    assert.doesNotMatch(syllabusHeader, /term videos are optional/i);
    assert.doesNotMatch(syllabusHeader, /Book videos are optional/);
    assert.doesNotMatch(syllabusView, /BookVideosNote/);
    assert.match(howToUseTheBook, /id="book"/);
  });
});
