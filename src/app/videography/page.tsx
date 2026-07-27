import type { Metadata } from "next";
import Link from "next/link";
import LiteVideoEmbed from "@/components/LiteVideoEmbed";
import ScrollRevealSequence, {
  type RevealSlide,
} from "@/components/ScrollRevealSequence";
import { urlFor } from "@/sanity/client";
import {
  getGalleries,
  getSiteSettings,
  parseVideoUrl,
} from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Videography",
  description: "Event films, promos and produced video work by Bave Studio.",
};

export const revalidate = 60;

/* No videography footage in the CMS yet, so the process sequence below
   is built from real production stills (behind-the-scenes + photography
   coverage) — copy is written to describe the process honestly, without
   implying these are video frames. */
const PROCESS_COPY = [
  { kicker: "The brief", title: "Every event, understood first.", sub: "Run of show, key moments and shot list agreed before anyone picks up a camera." },
  { kicker: "The shoot", title: "Multiple angles, real moments, no restaging.", sub: "Camera and audio rigs positioned to catch the room as it actually happens." },
  { kicker: "The film", title: "Edited, graded, delivered — ready to publish.", sub: "Cut for pace, colour graded, sound mixed, exported for however it needs to be shared." },
] as const;

export default async function VideographyPage() {
  const [settings, galleries, photoGalleries] = await Promise.all([
    getSiteSettings(),
    getGalleries("videography"),
    getGalleries("photography"),
  ]);

  const showreel = settings?.showreelUrl
    ? parseVideoUrl(settings.showreelUrl)
    : null;

  const projects = galleries.flatMap((g) => {
    const parsed = g.videoUrl ? parseVideoUrl(g.videoUrl) : null;
    return parsed ? [{ ...parsed, title: g.title, id: g._id }] : [];
  });

  const processImages = [
    ...(photoGalleries.flatMap((g) => g.images ?? []).slice(0, 1)),
    ...(settings?.behindTheScenes ?? []),
  ].slice(0, 3);

  const processSlides: RevealSlide[] = processImages.map((img, i) => ({
    src: urlFor(img).width(1920).height(1200).url(),
    alt: img.alt ?? PROCESS_COPY[i]?.kicker ?? "",
    kicker: PROCESS_COPY[i]?.kicker ?? "",
    title: PROCESS_COPY[i]?.title ?? "",
    sub: PROCESS_COPY[i]?.sub ?? "",
  }));

  return (
    <>
      <div className="mx-auto max-w-[1200px] px-5 pt-16 md:px-8 md:pt-24">
        <p className="eyebrow">02 — Videography</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-light leading-tight tracking-tight text-ink md:text-6xl">
          Stories that move.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-graphite">
          Event films, promos and produced pieces — shot, edited and
          delivered ready to publish.
        </p>
      </div>

      {/* Full-bleed process sequence — real production stills, since
          there's no video footage in the CMS yet (see PROCESS_COPY note) */}
      {processSlides.length >= 2 && (
        <div className="mt-14">
          <ScrollRevealSequence slides={processSlides} />
        </div>
      )}

    <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
      {/* Showreel leads the page — highest-conversion asset */}
      <div className="mt-14">
        <p className="eyebrow mb-4">Showreel</p>
        {showreel ? (
          <LiteVideoEmbed
            provider={showreel.provider}
            videoId={showreel.videoId}
            title="Bave Studio showreel"
          />
        ) : (
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[18px] border rule bg-linen">
            <span className="text-sm text-graphite">Showreel coming soon</span>
          </div>
        )}
      </div>

      {/* Individual projects from the CMS */}
      <div className="mt-16">
        <p className="eyebrow mb-4">Selected projects</p>
        {projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <LiteVideoEmbed
                key={p.id}
                provider={p.provider}
                videoId={p.videoId}
                title={p.title}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {["Event film", "Promo"].map((label) => (
              <div
                key={label}
                className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[18px] border rule bg-linen"
              >
                <span className="text-sm text-graphite">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 border-t rule pt-10 text-center">
        <p className="text-graphite">Need a film made?</p>
        <Link href="/contact" className="btn-fill mt-5 !px-7">
          Start a project
        </Link>
      </div>
    </div>
    </>
  );
}
