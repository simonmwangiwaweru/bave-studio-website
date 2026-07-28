import type { Metadata } from "next";
import Link from "next/link";
import LiteVideoEmbed from "@/components/LiteVideoEmbed";
import SanityImage from "@/components/SanityImage";
import {
  getGalleries,
  getSiteSettings,
  parseVideoUrl,
  type GalleryImage,
} from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Videography",
  description: "Event films, promos and produced video work by Bave Studio.",
};

export const revalidate = 60;

/* No videography footage in the CMS yet, so this static process strip runs
   on real production stills (behind-the-scenes + photography coverage) —
   copy describes the process honestly, without implying these are frames
   from an actual film. */
const PROCESS_COPY = [
  {
    kicker: "The brief",
    title: "Every event, understood first.",
    sub: "Run of show, key moments and shot list agreed before anyone picks up a camera.",
  },
  {
    kicker: "The shoot",
    title: "Multiple angles, real moments, no restaging.",
    sub: "Camera and audio rigs positioned to catch the room as it actually happens.",
  },
  {
    kicker: "The film",
    title: "Edited, graded, delivered — ready to publish.",
    sub: "Cut for pace, colour graded, sound mixed, exported for however it needs to be shared.",
  },
] as const;

const capabilities = [
  {
    title: "Full production",
    detail: "Filming through to a graded, sound-mixed final export — one team, start to finish.",
  },
  {
    title: "Externally hosted",
    detail: "Delivered via YouTube or Vimeo, so playback stays fast wherever it's shared.",
  },
  {
    title: "Built for social too",
    detail: "Cutdowns and vertical versions available alongside the main edit.",
  },
  {
    title: "Realistic turnaround",
    detail: "Timeline agreed at the brief stage — no surprises at delivery.",
  },
];

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

  const processImages: GalleryImage[] = [
    ...photoGalleries.flatMap((g) => g.images ?? []).slice(0, 1),
    ...(settings?.behindTheScenes ?? []).slice(0, 2),
  ].slice(0, 3);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">02 — Videography</p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-light leading-tight tracking-tight text-ink md:text-6xl">
        Stories that move.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-graphite">
        Event films, promos and produced pieces — shot, edited and delivered
        ready to publish.
      </p>

      {/* How a film gets made — real stills, since there's no video
          footage in the CMS yet (see PROCESS_COPY note above) */}
      {processImages.length >= 2 && (
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {processImages.map((img, i) => (
            <div key={i}>
              <div className="frame relative aspect-[4/5]">
                <SanityImage
                  image={img}
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <p className="eyebrow mt-4">{PROCESS_COPY[i]?.kicker}</p>
              <h2 className="mt-2 font-display text-xl text-ink">
                {PROCESS_COPY[i]?.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-graphite">
                {PROCESS_COPY[i]?.sub}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Capability statement */}
      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {capabilities.map((c) => (
          <div key={c.title} className="rounded-lg border rule bg-card p-7">
            <h2 className="font-display text-xl text-ink">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-graphite">
              {c.detail}
            </p>
          </div>
        ))}
      </div>

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
  );
}
