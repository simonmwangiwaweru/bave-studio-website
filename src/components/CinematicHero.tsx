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

/* Full-bleed scroll-driven carousel for the homepage hero. Motion is pure
   CSS (scroll-timeline/view-timeline) — progressive enhancement only; on
   browsers without support (Safari, Firefox) this is still a fully working
   swipeable gallery via scroll-snap alone, just without the zoom/reveal. */
export default function CinematicHero({
  slides,
  children,
}: {
  slides: HeroSlide[];
  children: ReactNode;
}) {
  const names = slides.map((_, i) => `--hero-slide-${i}`);
  const scopeValue = ["--hero-scroll", ...names].join(", ");

  return (
    <section
      className="relative h-[85vh] min-h-[560px] overflow-clip bg-teal md:h-screen"
      style={{ timelineScope: scopeValue } as CSSVars}
    >
      {/* Constant scrim so overlay text stays legible over any photo */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-black/75 via-black/25 to-black/45" />

      <div className="hero-track" style={{ scrollTimeline: "--hero-scroll x" } as CSSVars}>
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
