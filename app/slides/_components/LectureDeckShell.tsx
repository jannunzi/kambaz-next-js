"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  authoredSlideDensity,
  isDemoStageSlide,
  isTargetFigureSlide,
  type BlockSlide,
} from "@/lib/lectures/blocks";
import {
  lectureChapterLabel,
  type LectureHubItem,
} from "@/lib/lectures/types";
import {
  LECTURE_PRESENT_STATE,
  exitNativeFullscreen,
  isLecturePresentHistoryState,
  lectureDeckHref,
  lecturePresentHref,
  lectureSearchIsPresent,
  lectureShouldShowContinue,
  nativeFullscreenElement,
  preferNativeFullscreen,
  readPresentEnvironment,
  requestNativeFullscreen,
  swipeSlideDelta,
  swipeTargetIsInteractive,
} from "@/lib/lectures/present-mode";
import {
  slidePaneOverflows,
  slidePaneScrollStep,
} from "@/lib/lectures/slide-pane";
import LectureDiagram from "./diagrams/LectureDiagram";
import LectureFilmstrip from "./LectureFilmstrip";
import LectureSlideImage from "./LectureSlideImage";
import { SlideBlockEditor, SlideBlockView } from "./SlideBlocks";
import SlideText from "./SlideText";

const NEXT_SLIDE_KEYS = new Set(["ArrowRight", "PageDown", " ", "n", "N"]);
const PREV_SLIDE_KEYS = new Set(["ArrowLeft", "PageUp", "Backspace", "p", "P"]);

function kindLabel(kind: BlockSlide["kind"]): string {
  if (kind === "demo") return "Demo";
  if (kind === "break") return "Break";
  if (kind === "title") return "Title";
  return "Slide";
}

function kindFrame(kind: BlockSlide["kind"]): string {
  if (kind === "demo") {
    return "border-amber-400 bg-amber-50";
  }
  if (kind === "break") {
    return "border-sky-300 bg-sky-50";
  }
  if (kind === "title") {
    return "border-neutral-800 bg-neutral-900 text-white";
  }
  return "border-neutral-300 bg-white";
}

function currentPath(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function replaceLocation({
  present,
  slideNumber,
}: {
  present?: boolean;
  slideNumber: number;
}) {
  const next = lecturePresentHref({
    href: window.location.href,
    slideNumber,
    present,
  });
  if (next !== currentPath()) {
    history.replaceState(history.state, "", next);
  }
}

function titleClasses({
  kind,
}: {
  kind: BlockSlide["kind"];
}): string {
  const hero = kind === "title" ? " lecture-slide-title-hero text-white" : "";
  return `lecture-slide-title${hero}`;
}

export default function LectureDeckShell({
  deckTitle,
  slides,
  prevDeck,
  nextDeck,
  chapter,
  editMode = false,
  onSlideChange,
  onRemoveSlide,
}: {
  deckTitle: string;
  slides: BlockSlide[];
  prevDeck?: LectureHubItem;
  nextDeck?: LectureHubItem;
  chapter?: number;
  editMode?: boolean;
  onSlideChange?: (index: number, slide: BlockSlide) => void;
  onRemoveSlide?: (index: number) => void;
}) {
  const labelId = useId();
  const stageRef = useRef<HTMLElement>(null);
  const pendingNativeUpgrade = useRef(false);
  const fallbackPresentRef = useRef(false);
  const indexRef = useRef(0);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const [index, setIndex] = useState(0);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [fallbackPresent, setFallbackPresent] = useState(false);
  const last = slides.length - 1;
  const slide = slides[index] ?? slides[0];
  const kind = slide?.kind ?? "content";
  const density = slide ? authoredSlideDensity(slide) : "spacious";
  const demoStage = slide ? isDemoStageSlide(slide) : false;
  const targetFigure = slide ? isTargetFigureSlide(slide) : false;
  const chapterNumber = chapter ?? prevDeck?.chapter ?? nextDeck?.chapter;
  const isPresenting = isNativeFullscreen || fallbackPresent;
  fallbackPresentRef.current = fallbackPresent;
  indexRef.current = index;

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.min(last, Math.max(0, next)));
    },
    [last],
  );

  const pushPresentHistory = useCallback((slideNumber: number) => {
    if (lectureSearchIsPresent(window.location.search)) return;
    const next = lecturePresentHref({
      href: window.location.href,
      slideNumber,
      present: true,
    });
    history.pushState(LECTURE_PRESENT_STATE, "", next);
  }, []);

  const enterPresent = useCallback(async () => {
    pushPresentHistory(indexRef.current + 1);
    const el = stageRef.current;
    if (el && preferNativeFullscreen(readPresentEnvironment())) {
      const entered = await requestNativeFullscreen(el);
      if (entered) {
        pendingNativeUpgrade.current = false;
        return;
      }
    }
    setFallbackPresent(true);
  }, [pushPresentHistory]);

  const exitPresent = useCallback(async () => {
    pendingNativeUpgrade.current = false;
    if (nativeFullscreenElement(document)) {
      try {
        await exitNativeFullscreen();
      } catch {
        /* browser may already have left fullscreen */
      }
    }
    if (isLecturePresentHistoryState(history.state)) {
      history.back();
      return;
    }
    setFallbackPresent(false);
    replaceLocation({ present: false, slideNumber: indexRef.current + 1 });
  }, []);

  const togglePresent = useCallback(() => {
    if (isPresenting) {
      void exitPresent();
      return;
    }
    void enterPresent();
  }, [enterPresent, exitPresent, isPresenting]);

  useEffect(() => {
    const raw = window.location.hash.replace(/^#slide-/, "");
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= slides.length) {
      setIndex(parsed - 1);
    }
    if (lectureSearchIsPresent(window.location.search)) {
      pendingNativeUpgrade.current = preferNativeFullscreen(readPresentEnvironment());
      setFallbackPresent(true);
    }
  }, [slides.length]);

  useEffect(() => {
    replaceLocation({
      slideNumber: index + 1,
      present: isPresenting ? true : undefined,
    });
    const pane = stageRef.current;
    if (pane) pane.scrollTop = 0;
  }, [index, isPresenting]);

  useEffect(() => {
    function sync() {
      const active = nativeFullscreenElement(document) === stageRef.current;
      setIsNativeFullscreen(active);
      if (active) {
        pendingNativeUpgrade.current = false;
        setFallbackPresent(false);
      }
      if (!active && !pendingNativeUpgrade.current && !fallbackPresentRef.current) {
        replaceLocation({ present: false, slideNumber: index + 1 });
      }
    }
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, [index]);

  useEffect(() => {
    const pane = stageRef.current;
    if (!pane) return;
    function tryNativeUpgrade(event: PointerEvent) {
      if (swipeTargetIsInteractive(event.target)) return;
      if (!pendingNativeUpgrade.current || nativeFullscreenElement(document)) {
        return;
      }
      const el = stageRef.current;
      if (!el) return;
      pendingNativeUpgrade.current = false;
      void requestNativeFullscreen(el);
    }
    pane.addEventListener("pointerdown", tryNativeUpgrade);
    return () => pane.removeEventListener("pointerdown", tryNativeUpgrade);
  }, []);

  useEffect(() => {
    function onPopState() {
      if (lectureSearchIsPresent(window.location.search)) {
        setFallbackPresent(true);
        return;
      }
      setFallbackPresent(false);
      if (nativeFullscreenElement(document)) {
        void exitNativeFullscreen();
      }
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!fallbackPresent) return;
    const html = document.documentElement;
    html.classList.add("lecture-presenting");
    const chrome = document.querySelectorAll("[data-lecture-deck-chrome]");
    chrome.forEach((node) => {
      node.setAttribute("inert", "");
    });
    return () => {
      html.classList.remove("lecture-presenting");
      chrome.forEach((node) => {
        node.removeAttribute("inert");
      });
    };
  }, [fallbackPresent]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.tagName === "BUTTON" ||
          target.isContentEditable ||
          Boolean(target.closest("button")))
      ) {
        return;
      }
      if (!isPresenting && (event.key === "f" || event.key === "F")) {
        event.preventDefault();
        togglePresent();
        return;
      }
      if (event.key === "Escape") {
        if (isPresenting) {
          event.preventDefault();
          void exitPresent();
        }
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const pane = stageRef.current;
        if (slidePaneOverflows(pane) && pane) {
          pane.scrollBy({ top: slidePaneScrollStep(pane.clientHeight) });
          return;
        }
        goTo(index + 1);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const pane = stageRef.current;
        if (slidePaneOverflows(pane) && pane) {
          pane.scrollBy({ top: -slidePaneScrollStep(pane.clientHeight) });
          return;
        }
        goTo(index - 1);
        return;
      }
      if (NEXT_SLIDE_KEYS.has(event.key)) {
        event.preventDefault();
        goTo(index + 1);
        return;
      }
      if (PREV_SLIDE_KEYS.has(event.key)) {
        event.preventDefault();
        goTo(index - 1);
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        goTo(last);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exitPresent, goTo, index, isPresenting, last, togglePresent]);

  useEffect(() => {
    if (!isPresenting) return;
    const pane = stageRef.current;
    if (!pane) return;

    function onTouchStart(event: TouchEvent) {
      if (swipeTargetIsInteractive(event.target)) {
        swipeStart.current = null;
        return;
      }
      const touch = event.changedTouches[0];
      if (!touch) return;
      swipeStart.current = { x: touch.clientX, y: touch.clientY };
    }

    function onTouchEnd(event: TouchEvent) {
      const start = swipeStart.current;
      swipeStart.current = null;
      if (!start || swipeTargetIsInteractive(event.target)) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const delta = swipeSlideDelta(start.x, start.y, touch.clientX, touch.clientY);
      if (delta !== 0) goTo(index + delta);
    }

    pane.addEventListener("touchstart", onTouchStart, { passive: true });
    pane.addEventListener("touchend", onTouchEnd);
    return () => {
      pane.removeEventListener("touchstart", onTouchStart);
      pane.removeEventListener("touchend", onTouchEnd);
    };
  }, [goTo, index, isPresenting]);

  if (!slide) return null;

  const percent = slides.length === 0 ? 0 : ((index + 1) / slides.length) * 100;
  const titleClass = titleClasses({ kind });
  const hintSize = "lecture-slide-hint";
  const showContinue = lectureShouldShowContinue({
    slide,
    index,
    last,
    hasNextDeck: Boolean(nextDeck),
  });
  const continueHref = nextDeck
    ? lectureDeckHref({
        slug: nextDeck.slug,
        slideNumber: 1,
        present: isPresenting,
      })
    : undefined;
  const stageClass = isPresenting
    ? `lecture-slide lecture-slide-${density} box-border h-full w-full min-w-0 overflow-x-hidden overflow-y-auto px-5 py-6 sm:px-8 sm:py-7 ${kindFrame(kind)}${
        fallbackPresent ? " lecture-slide-present-fallback" : ""
      }`
    : `lecture-slide lecture-slide-${density} box-border min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-lg border-2 px-4 py-4 sm:px-6 sm:py-5 ${kindFrame(kind)}`;

  return (
    <section
      aria-labelledby={labelId}
      className="flex min-h-0 min-w-0 flex-1 gap-2 overflow-hidden"
    >
      {isPresenting ? null : (
        <LectureFilmstrip
          slides={slides}
          currentIndex={index}
          onSelect={goTo}
        />
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <p className="sr-only" id={labelId}>
          {deckTitle}
        </p>
        {isPresenting ? null : (
          <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2 font-sans text-sm text-neutral-600">
            <p className="m-0 tabular-nums" aria-live="polite">
              {index + 1} / {slides.length}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {editMode && onRemoveSlide ? (
                <button
                  type="button"
                  className="rounded border border-neutral-400 bg-white px-3 py-1.5 text-sm disabled:opacity-40"
                  onClick={() => onRemoveSlide(index)}
                  disabled={slides.length <= 1}
                >
                  Remove slide
                </button>
              ) : null}
              <button
                type="button"
                className="rounded border border-neutral-800 bg-white px-3 py-1.5 text-sm"
                onClick={() => togglePresent()}
              >
                Present
              </button>
            </div>
          </div>
        )}

        {isPresenting ? null : (
          <div
            className="mb-2 h-1.5 shrink-0 overflow-hidden rounded-full bg-neutral-200"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={slides.length}
            aria-valuenow={index + 1}
            aria-label="Deck progress"
          >
            <div
              className="h-full bg-neutral-800 transition-[width] duration-200"
              style={{ width: `${percent}%` }}
            />
          </div>
        )}

        <article
          ref={stageRef}
          data-slide-density={density}
          data-slide-kind={kind}
          data-demo-stage={demoStage ? "true" : undefined}
          data-target-figure={targetFigure ? "true" : undefined}
          data-lecture-present={
            fallbackPresent ? "fallback" : isNativeFullscreen ? "native" : undefined
          }
          className={stageClass}
        >
          <p
            className={`m-0 text-sm font-semibold uppercase tracking-wide sm:text-base ${
              kind === "title" ? "text-neutral-300" : "text-neutral-500"
            }`}
          >
            {kindLabel(kind)}
          </p>
          {editMode && onSlideChange ? (
            <input
              className={`${titleClass} w-full border-0 bg-transparent outline-none`}
              value={slide.title}
              onChange={(event) =>
                onSlideChange(index, { ...slide, title: event.target.value })
              }
              aria-label="Slide title"
            />
          ) : (
            <h2 className={titleClass}>{slide.title}</h2>
          )}
          {editMode && onSlideChange ? (
            <SlideBlockEditor
              slide={slide}
              density={density}
              onChange={(next) => onSlideChange(index, next)}
            />
          ) : (
            <SlideBlockView slide={slide} density={density} />
          )}
          {slide.diagram ? <LectureDiagram id={slide.diagram} /> : null}
          {slide.imageSrc ? (
            <LectureSlideImage
              src={slide.imageSrc}
              alt={slide.imageAlt ?? slide.title}
              caption={slide.imageCaption}
              stage={targetFigure}
            />
          ) : null}
          {slide.interactiveHint ? (
            <p
              className={`${hintSize} ${
                kind === "title"
                  ? "border-neutral-600 bg-neutral-800 text-neutral-100"
                  : "border-neutral-300 bg-white text-neutral-800"
              }`}
            >
              <span className="font-semibold">Try this: </span>
              <SlideText text={slide.interactiveHint} density={density} />
            </p>
          ) : null}
          {showContinue && continueHref && nextDeck ? (
            <p className="lecture-slide-continue">
              <Link
                href={continueHref}
                className={`lecture-slide-continue-link${
                  kind === "title" ? " lecture-slide-continue-link-hero" : ""
                }`}
                aria-label={`Continue to ${nextDeck.title}`}
              >
                Continue
              </Link>
            </p>
          ) : null}
        </article>

        {fallbackPresent ? (
          <button
            type="button"
            className="lecture-present-exit"
            onClick={() => void exitPresent()}
          >
            Exit
          </button>
        ) : null}

        {isPresenting ? null : (
          <>
            <div className="mt-2 flex shrink-0 flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className="rounded border border-neutral-800 bg-white px-3 py-2 font-sans text-sm disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
              >
                Previous slide
              </button>
              <p className="m-0 font-sans text-xs text-neutral-500">
                ← → change slides · swipe in present · ↑ ↓ scroll if overflow · space · f present · Esc / back exits
              </p>
              <button
                type="button"
                className="book-practice-cta rounded border border-neutral-800 bg-neutral-800 px-3 py-2 font-sans text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => goTo(index + 1)}
                disabled={index === last}
              >
                Next slide
              </button>
            </div>
            <nav
              aria-label={
                chapterNumber
                  ? `Other ${lectureChapterLabel(chapterNumber)} decks`
                  : "Other slide decks"
              }
              className="mt-2 flex shrink-0 flex-wrap gap-x-4 gap-y-1 border-t border-neutral-200 pt-2 font-sans text-sm"
            >
              {prevDeck ? (
                <Link href={`/slides/${prevDeck.slug}`}>← {prevDeck.title}</Link>
              ) : (
                <span className="text-neutral-500">
                  {chapterNumber ? `${lectureChapterLabel(chapterNumber)} · ` : ""}first deck
                </span>
              )}
              {nextDeck ? (
                <Link href={`/slides/${nextDeck.slug}`}>{nextDeck.title} →</Link>
              ) : (
                <span className="text-neutral-500">
                  {chapterNumber ? `${lectureChapterLabel(chapterNumber)} · ` : ""}last deck
                </span>
              )}
            </nav>
          </>
        )}
      </div>
    </section>
  );
}
