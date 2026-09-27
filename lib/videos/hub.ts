import { BOOK_CHAPTERS, LECTURE_TOPICS } from "@/lib/lectures/types";
import { bookPathForSection, bookSectionNumberLabel } from "./book-section";
import { fullLectureHref } from "./full-lecture";
import { bookSectionTitle, listBookSectionIds } from "./map";
import { videosHref } from "./query";
import { fallbackTierLabel, resolveLectureClip } from "./resolve";
import type { LectureClipMap } from "./types";
import { brandedPosterUrl } from "./thumbs";
import { formatClipClock, youtubeEmbedUrl } from "./youtube";

export type VideoHubCard = {
  id: string;
  number: string;
  title: string;
  /** Card heading, section number plus the UI label. */
  heading: string;
  href: string;
  bookHref: string;
  youtubeVideoId: string | null;
  /**
   * Branded still for this book section. Null keeps the YouTube hqdefault poster.
   */
  posterUrl: string | null;
  /** Timed snippet player. Null until a clip resolves. */
  embedUrl: string | null;
  /** Whole-lecture URL with no start time, or null for a short part. */
  fullLectureUrl: string | null;
  /** One or two lines under the thumb, same role as a slides deck summary. */
  summary: string;
};

export type VideoHubSection = {
  id: string;
  title: string;
  bookHref: string;
  clips: VideoHubCard[];
};

export type VideoHubChapter = {
  chapter: number;
  href: string;
  title: string;
  weeks?: string;
  sections: VideoHubSection[];
};

/** `sec-1-3-6-1` → chapter 1. `intro` is chapter 1. */
export function chapterNumberForSection(sectionId: string): number | null {
  if (sectionId === "intro") return 1;
  const match = /^sec-(\d+)/.exec(sectionId);
  if (!match) return null;
  const chapter = Number(match[1]);
  return chapter >= 1 && chapter <= 6 ? chapter : null;
}

/**
 * Book section that owns this id. `sec-1-3-6-1` and `sec-1-3` both sit under
 * `sec-1-3`, matching how the slides hub groups a topic’s decks.
 */
export function parentBookSectionId(sectionId: string): string {
  const parts = sectionId.split("-");
  if (parts[0] !== "sec" || parts.length < 3) return sectionId;
  return `${parts[0]}-${parts[1]}-${parts[2]}`;
}

function chapterMeta(chapter: number) {
  return BOOK_CHAPTERS.find((entry) => entry.chapter === chapter) ?? BOOK_CHAPTERS[0]!;
}

function sectionGroupTitle(sectionId: string, map: LectureClipMap): string {
  const topic = LECTURE_TOPICS.find((entry) => entry.bookSectionId === sectionId);
  if (topic) return topic.title;
  const number = bookSectionNumberLabel(sectionId);
  const title = bookSectionTitle(sectionId, map);
  if (title === number || title.startsWith(`${number} `) || title.startsWith(`${number}.`)) {
    return title;
  }
  return `${number} · ${title}`;
}

/**
 * Mapped clips only, grouped like the slides hub: chapter, then book section.
 * Unmapped ids are left out.
 */
export function listVideoHubChapters(
  map: LectureClipMap,
  preferred: { course: string; semester: string },
): VideoHubChapter[] {
  const chapters = new Map<number, Map<string, string[]>>();
  for (const id of listBookSectionIds(map)) {
    const chapter = chapterNumberForSection(id);
    if (chapter == null) continue;
    const parent = parentBookSectionId(id);
    const sections = chapters.get(chapter) ?? new Map<string, string[]>();
    const clips = sections.get(parent) ?? [];
    clips.push(id);
    sections.set(parent, clips);
    chapters.set(chapter, sections);
  }

  return [...chapters.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([chapter, sections]) => {
      const meta = chapterMeta(chapter);
      return {
        chapter,
        href: meta.href,
        title: meta.title,
        weeks: meta.weeks,
        sections: [...sections.entries()].map(([id, clipIds]) => ({
          id,
          title: sectionGroupTitle(id, map),
          bookHref: bookPathForSection(id),
          clips: clipIds.map((clipId) => {
            const resolved = resolveLectureClip(map, {
              bookSectionId: clipId,
              preferredCourse: preferred.course,
              preferredSemester: preferred.semester,
            });
            const number = bookSectionNumberLabel(clipId);
            const title = bookSectionTitle(clipId, map);
            const heading =
              title === number ||
              title.startsWith(`${number} `) ||
              title.startsWith(`${number}.`)
                ? title
                : `${number} ${title}`;
            const summary = resolved
              ? `${formatClipClock(resolved.clip.startSec)}–${formatClipClock(resolved.clip.endSec)} · ${fallbackTierLabel(resolved.tier)} · ${resolved.clip.sourceCourse} ${resolved.clip.semester}`
              : "No clip for this semester";
            return {
              id: clipId,
              number,
              title,
              heading,
              href: videosHref(clipId),
              bookHref: bookPathForSection(clipId),
              youtubeVideoId: resolved?.youtubeVideoId ?? null,
              posterUrl: brandedPosterUrl(clipId),
              embedUrl: resolved
                ? youtubeEmbedUrl(
                    resolved.youtubeVideoId,
                    resolved.clip.startSec,
                    resolved.clip.endSec,
                  )
                : null,
              fullLectureUrl: resolved ? fullLectureHref(resolved) : null,
              summary,
            };
          }),
        })),
      };
    });
}
