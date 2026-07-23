"use client";

import { useState } from "react";

/* Facade pattern: renders a static poster until clicked, then swaps in the
   real iframe. Keeps YouTube/Vimeo player JS off the critical path. */
export default function LiteVideoEmbed({
  provider,
  videoId,
  title,
  poster,
}: {
  provider: "youtube" | "vimeo";
  videoId: string;
  title: string;
  poster?: string;
}) {
  const [active, setActive] = useState(false);

  const src =
    provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${videoId}?autoplay=1`;

  const posterUrl =
    poster ??
    (provider === "youtube"
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      : undefined);

  if (active) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-[18px] bg-ink">
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={`Play video: ${title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-[18px] border rule bg-linen"
    >
      {posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote poster, facade only
        <img
          src={posterUrl}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-90"
        />
      ) : (
        <span className="absolute inset-0 bg-gradient-to-br from-linen to-mist" />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        {/* Orange square play control — the design system's one loud moment */}
        <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-orange transition-transform group-hover:scale-105">
          <svg
            viewBox="0 0 24 24"
            className="ml-0.5 h-6 w-6 fill-white"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      <span className="absolute bottom-3 left-4 text-xs text-ink">
        {title}
      </span>
    </button>
  );
}
