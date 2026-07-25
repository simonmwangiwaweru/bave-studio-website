"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

/* Custom CSS properties (view-timeline, animation-timeline, timeline-scope)
   aren't in React's typed CSSProperties — this widens the style object to
   accept them without losing type-checking on the standard properties. */
type CSSVars = CSSProperties & Record<string, string>;

export type HeroSlide = {
  src: string;
  alt: string;
  caption?: string;
};

const AUTOPLAY_MS = 5500;
const RESUME_AFTER_MS = 6000;

/* Full-bleed scroll-driven carousel for the homepage hero. The zoom/reveal
   motion is pure CSS (scroll-timeline/view-timeline) — a progressive
   enhancement that degrades to a plain static image on Safari/Firefox.
   Navigation itself (autoplay, mouse-wheel, arrow buttons) is the one bit
   of real JS here: a horizontal carousel that only responds to clicking
   tiny page numbers isn't usable, so this makes the ordinary vertical
   scroll gesture drive it too, advances on its own, and adds visible
   prev/next controls — falling back to nothing but plain swipe/scroll-snap
   if JS never loads. */
export default function CinematicHero({
  slides,
  children,
}: {
  slides: HeroSlide[];
  children: ReactNode;
}) {
  const names = slides.map((_, i) => `--hero-slide-${i}`);
  const scopeValue = ["--hero-scroll", ...names].join(", ");
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let autoplayTimer: ReturnType<typeof setInterval> | null = null;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;

    function advance() {
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      const next =
        track.scrollLeft >= max - 1 ? 0 : track.scrollLeft + track.clientWidth;
      track.scrollTo({ left: next, behavior: "smooth" });
    }

    function startAutoplay() {
      if (reduceMotion || autoplayTimer) return;
      autoplayTimer = setInterval(advance, AUTOPLAY_MS);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Manual interaction pauses autoplay, then resumes after a quiet period
    function registerInteraction() {
      stopAutoplay();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(startAutoplay, RESUME_AFTER_MS);
    }

    // Let ordinary vertical scroll/wheel drive the horizontal track, but
    // release back to normal page scrolling once you've reached either end
    // — so the hero never traps the visitor.
    function onWheel(e: WheelEvent) {
      if (!track) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // already horizontal, leave it
      const max = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 0;
      const atEnd = track.scrollLeft >= max - 1;
      const forward = e.deltaY > 0;
      if ((forward && atEnd) || (!forward && atStart)) return;
      e.preventDefault();
      track.scrollLeft += e.deltaY;
      registerInteraction();
    }

    track.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("pointerdown", registerInteraction);
    startAutoplay();

    return () => {
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("pointerdown", registerInteraction);
      stopAutoplay();
      if (resumeTimer) clearTimeout(resumeTimer);
    };
  }, []);

  function go(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth, behavior: "smooth" });
  }

  return (
    <section
      className="relative h-[85vh] min-h-[560px] overflow-clip bg-teal md:h-screen"
      style={{ timelineScope: scopeValue } as CSSVars}
    >
      {/* Constant scrim so overlay text stays legible over any photo */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-black/75 via-black/25 to-black/45" />

      <div
        ref={trackRef}
        className="hero-track"
        style={{ scrollTimeline: "--hero-scroll x" } as CSSVars}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            id={`hero-slide-${i}`}
            className="hero-slide"
            style={{ viewTimeline: `${names[i]} x` } as CSSVars}
          >
            <div className="hero-slide-bg" style={{ animationTimeline: names[i] } as CSSVars}>
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-resolved Sanity URL, no next/image benefit here */}
              <img src={s.src} alt={s.alt} />
            </div>
            {s.caption && (
              <p
                className="hero-cap eyebrow !text-white/90"
                style={{ animationTimeline: names[i] } as CSSVars}
              >
                {s.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Persistent brand message — stays put while slides scroll behind it */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5">
        <div className="pointer-events-auto text-center">{children}</div>
      </div>

      {/* Prev / next — visible, discoverable navigation */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="group absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white/80 transition-colors hover:border-white hover:text-white md:left-6"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="group absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white/80 transition-colors hover:border-white hover:text-white md:right-6"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* Slide index + scroll progress */}
      <div className="absolute bottom-7 left-6 right-6 z-10 flex items-center gap-5">
        <nav className="flex gap-3" aria-label="Hero slides">
          {slides.map((_, i) => (
            <a
              key={i}
              href={`#hero-slide-${i}`}
              className="hero-page text-xs text-white/50"
              style={{ animationTimeline: names[i] } as CSSVars}
            >
              {String(i + 1).padStart(2, "0")}
            </a>
          ))}
        </nav>
        <div className="hero-bar-track">
          <div className="hero-bar-fill" style={{ animationTimeline: "--hero-scroll" } as CSSVars} />
        </div>
      </div>
    </section>
  );
}
