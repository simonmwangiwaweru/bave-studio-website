"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type RevealSlide = {
  src: string;
  alt: string;
  kicker: string;
  title: string;
  sub: string;
};

const BAND_COUNT = 14;

/* Scroll-pinned image sequence, adapted from a Codrops "blinds" transition
   demo — rewritten without Lenis (ScrollTrigger's own `scrub` smoothing
   gives the same buttery feel without taking over the page's native
   scroll) and with the blinds rendered declaratively via refs instead of
   imperative DOM building. Progressive enhancement: server-rendered state
   has every image fully visible (no-JS visitors just see a stacked block
   of real photography), and only once GSAP mounts does it snap the bands
   closed and reveal them progressively as the visitor scrolls. */
export default function ScrollRevealSequence({ slides }: { slides: RevealSlide[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const bandRefs = useRef<SVGRectElement[][]>(slides.map(() => []));
  const fillRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return; // leave the no-JS fully-visible state as-is

    const ctx = gsap.context(() => {
      // Snap every band closed before the first paint of this effect
      bandRefs.current.forEach((bands) => {
        gsap.set(bands, { attr: { height: 0 } });
      });

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          pin: ".reveal-layers",
          anticipatePin: 1,
        },
      });

      slides.forEach((_, i) => {
        const bands = bandRefs.current[i];
        const bandHeight = 100 / BAND_COUNT;
        // y is fixed at each band's top edge (set in JSX) — height alone
        // must grow back to a full band (+ overlap) to fully reveal it.
        master.to(
          bands,
          {
            attr: { height: bandHeight + 1 },
            ease: "power2.out",
            stagger: { each: 0.03, from: "start" },
          },
          i === 0 ? 0 : "+=0.15",
        );
        const fill = fillRefs.current[i];
        if (fill) {
          master.fromTo(
            fill,
            { scaleX: 0 },
            { scaleX: 1, ease: "none" },
            "<",
          );
        }
      });
    }, stage);

    return () => ctx.revert();
  }, [slides]);

  return (
    <div ref={stageRef} className="reveal-stage" style={{ height: `${slides.length * 100}vh` }}>
      <div className="reveal-layers">
        {slides.map((slide, i) => {
          const bandHeight = 100 / BAND_COUNT;
          return (
            <div key={i} className="reveal-layer">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="reveal-svg">
                <defs>
                  <mask id={`reveal-mask-${i}`} maskUnits="userSpaceOnUse">
                    {Array.from({ length: BAND_COUNT }).map((_, b) => {
                      const centerY = bandHeight * b + bandHeight / 2;
                      return (
                        <rect
                          key={b}
                          ref={(el) => {
                            if (el) bandRefs.current[i][b] = el;
                          }}
                          x={0}
                          y={centerY - bandHeight / 2 - 0.5}
                          width={100}
                          height={bandHeight + 1}
                          fill="white"
                        />
                      );
                    })}
                  </mask>
                </defs>
                <image
                  href={slide.src}
                  x={0}
                  y={0}
                  width={100}
                  height={100}
                  preserveAspectRatio="xMidYMid slice"
                  mask={`url(#reveal-mask-${i})`}
                />
              </svg>

              <div className="reveal-text">
                <p className="eyebrow !text-white/60">{slide.kicker}</p>
                <h2 className="mt-3 font-display text-4xl font-light leading-[0.95] text-white md:text-6xl">
                  {slide.title}
                </h2>
                <p className="mt-4 max-w-[24ch] text-sm leading-relaxed text-white/75">
                  {slide.sub}
                </p>
              </div>
            </div>
          );
        })}

        <div className="reveal-progress">
          {slides.map((_, i) => (
            <div key={i} className="reveal-segment">
              <div
                ref={(el) => {
                  fillRefs.current[i] = el;
                }}
                className="reveal-fill"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
