import type { CSSProperties } from "react";
import Link from "next/link";
import PlaceholderFrame from "@/components/PlaceholderFrame";

type CSSVars = CSSProperties & Record<string, string>;

export type GalleryTileItem = {
  href: string;
  label: string;
  blurb: string;
  tag: string;
  src?: string;
  alt?: string;
};

/* Moody ink-ground scroll gallery for /work — each tile desaturates until
   scrolled into view, then resolves to full color. Same progressive-
   enhancement CSS motion as the homepage hero; a plain dark grid on
   browsers without scroll-timeline support. */
export default function DarkGalleryTiles({ items }: { items: GalleryTileItem[] }) {
  const names = items.map((_, i) => `--wk-${i}`);
  const scopeValue = ["--wk-scroll", ...names].join(", ");

  return (
    <div
      className="relative -mx-5 overflow-clip bg-[#111110] py-10 md:-mx-8"
      style={{ timelineScope: scopeValue } as CSSVars}
    >
      <div
        className="hero-track gap-4 px-5 md:px-8"
        style={{ scrollTimeline: "--wk-scroll x" } as CSSVars}
      >
        {items.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative aspect-[335/511] w-[70vw] max-w-[360px] flex-shrink-0 snap-start overflow-hidden rounded-sm sm:w-[42vw] md:w-[300px]"
            style={{ scrollSnapAlign: "start", viewTimeline: `${names[i]} x` } as CSSVars}
          >
            {item.src ? (
              // eslint-disable-next-line @next/next/no-img-element -- pre-resolved Sanity URL
              <img
                src={item.src}
                alt={item.alt ?? ""}
                className="gallery-tile-img"
                style={{ animationTimeline: names[i] } as CSSVars}
              />
            ) : (
              <PlaceholderFrame label={item.label} ratio="aspect-[335/511]" className="!rounded-none" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <span className="gallery-tag">{item.tag}</span>
            <div className="absolute inset-x-4 bottom-9 z-[2]">
              <h2 className="font-display text-xl text-white transition-colors group-hover:text-orange">
                {item.label}
              </h2>
              <p className="mt-1 text-sm text-white/70">{item.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
