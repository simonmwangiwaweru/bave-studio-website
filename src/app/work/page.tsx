import type { Metadata } from "next";
import DarkGalleryTiles from "@/components/DarkGalleryTiles";
import { urlFor } from "@/sanity/client";
import { getCaseStudies, getGalleries, getSiteSettings } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected photography, videography and live streaming work by Bave Studio.",
};

export const revalidate = 60;

const categories = [
  {
    href: "/photography",
    category: "photography",
    label: "Photography",
    blurb: "Candid portraits, events, corporate coverage.",
    tag: "01 — Stills",
  },
  {
    href: "/videography",
    category: "videography",
    label: "Videography",
    blurb: "Showreel, event films, promos.",
    tag: "02 — Motion",
  },
  {
    href: "/live-streaming",
    category: "live-streaming",
    label: "Live Streaming",
    blurb: "Multi-camera broadcast, case studies.",
    tag: "03 — Live",
  },
];

export default async function WorkPage() {
  const [galleries, settings, caseStudies] = await Promise.all([
    Promise.all(categories.map((c) => getGalleries(c.category))),
    getSiteSettings(),
    getCaseStudies(),
  ]);

  // Videography and live-streaming don't have their own gallery documents
  // yet, so fall back to real photos from elsewhere rather than a
  // placeholder: the behind-the-scenes shot of the camera rig, and the
  // first live-streaming case study's photo.
  const videographyFallback = settings?.behindTheScenes?.[0];
  const liveStreamingFallback = caseStudies.flatMap((cs) => cs.images ?? [])[0];

  const items = categories.map((c, i) => {
    const image =
      galleries[i][0]?.images?.[0] ??
      (c.category === "videography"
        ? videographyFallback
        : c.category === "live-streaming"
          ? liveStreamingFallback
          : undefined);
    return {
      href: c.href,
      label: c.label,
      blurb: c.blurb,
      tag: c.tag,
      src: image ? urlFor(image).width(700).height(1070).url() : undefined,
      alt: image?.alt,
    };
  });

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">Portfolio</p>
      <h1 className="mt-4 font-display text-4xl font-light tracking-tight text-ink md:text-6xl">
        A closer look at the work
      </h1>
      <p className="mt-4 max-w-lg text-lg text-graphite">
        Three disciplines, one standard. Pick a lane or browse everything.
      </p>

      <div className="mt-14">
        <DarkGalleryTiles items={items} />
      </div>
    </div>
  );
}
