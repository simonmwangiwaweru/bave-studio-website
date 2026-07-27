"use client";

import { useEffect, useRef } from "react";

export type ParallaxImage = {
  src: string;
  alt: string;
};

const MAX_SHIFT_PERCENT = 10;

/* Horizontal filmstrip with per-image parallax: each photo counter-shifts
   slightly as it passes screen-center, giving a subtle depth feel. Adapted
   from a Codrops demo, rewritten to use a real horizontally-scrollable
   container (native touch/trackpad/keyboard support for free) instead of
   the original's fully virtualized scroll, and to only run the parallax
   recompute while actually scrolling rather than in a permanent rAF loop —
   no extra dependency needed (the original's only runtime dependency was
   two one-line GSAP math helpers). */
export default function ParallaxGallery({ images }: { images: ParallaxImage[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scheduled = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function updateParallax() {
      scheduled.current = false;
      if (reduceMotion) return;
      const center = window.innerWidth / 2;
      for (const frame of frameRefs.current) {
        if (!frame) continue;
        const img = frame.querySelector("img");
        if (!img) continue;
        const rect = frame.getBoundingClientRect();
        const elementCenter = rect.left + rect.width / 2;
        const t = Math.max(-1, Math.min(1, (elementCenter - center) / center));
        const shift = -t * MAX_SHIFT_PERCENT;
        (img as HTMLElement).style.transform = `translate3d(${shift}%, 0, 0)`;
      }
    }

    function scheduleUpdate() {
      if (scheduled.current) return;
      scheduled.current = true;
      requestAnimationFrame(updateParallax);
    }

    // Vertical wheel/trackpad scroll drives this horizontal strip, and
    // releases back to normal page scroll once you reach either end.
    function onWheel(e: WheelEvent) {
      if (!track) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 0;
      const atEnd = track.scrollLeft >= max - 1;
      const forward = e.deltaY > 0;
      if ((forward && atEnd) || (!forward && atStart)) return;
      e.preventDefault();
      track.scrollLeft += e.deltaY;
      scheduleUpdate();
    }

    track.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    updateParallax();

    return () => {
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  function go(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth * 0.7, behavior: "smooth" });
  }

  return (
    <div className="relative -mx-5 md:-mx-8">
      <div ref={trackRef} className="parallax-track px-5 md:px-8">
        {images.map((img, i) => (
          <div
            key={i}
            ref={(el) => {
              frameRefs.current[i] = el;
            }}
            className="parallax-frame"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-resolved Sanity URL */}
            <img src={img.src} alt={img.alt} draggable={false} />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-card/90 text-ink transition-colors hover:border-ink md:flex"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-card/90 text-ink transition-colors hover:border-ink md:flex"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
