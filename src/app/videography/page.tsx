import type { Metadata } from "next";
import Link from "next/link";
import SanityImage from "@/components/SanityImage";
import {
  getGalleries,
  getSiteSettings,
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
    icon: (
      <>
        <rect x="4" y="10" width="16" height="9" rx="1.5" />
        <path d="M4 10 5.5 5.7a1 1 0 0 1 1.2-.6l11.6 2.7a1 1 0 0 1 .7 1.2L18.5 10" />
        <path d="M8 10 9.5 6M13 10l1.5-4" />
      </>
    ),
  },
  {
    title: "Externally hosted",
    detail: "Delivered via YouTube or Vimeo, so playback stays fast wherever it's shared.",
    icon: (
      <>
        <path d="M12 3v10M8 7l4-4 4 4" />
        <path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
      </>
    ),
  },
  {
    title: "Built for social too",
    detail: "Cutdowns and vertical versions available alongside the main edit.",
    icon: (
      <>
        <rect x="8" y="3.5" width="8" height="17" rx="2" />
        <path d="M11 18.2h2" />
      </>
    ),
  },
  {
    title: "Realistic turnaround",
    detail: "Timeline agreed at the brief stage — no surprises at delivery.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
  },
];

export default async function VideographyPage() {
  const [settings, photoGalleries] = await Promise.all([
    getSiteSettings(),
    getGalleries("photography"),
  ]);

  const processImages: GalleryImage[] = [
    ...photoGalleries.flatMap((g) => g.images ?? []).slice(0, 1),
    ...(settings?.behindTheScenes ?? []).slice(0, 2),
  ].slice(0, 3);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">02 — Videography</p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-light leading-tight tracking-tight text-ink md:text-6xl">
        Every story, told in motion.
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
        {capabilities.map((c, i) => (
          <div
            key={c.title}
            className="cap-card rounded-lg border rule bg-card p-7"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="cap-icon flex h-11 w-11 items-center justify-center rounded-lg bg-orange/10 text-orange">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {c.icon}
              </svg>
            </span>
            <h2 className="mt-4 font-display text-xl text-ink">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-graphite">
              {c.detail}
            </p>
          </div>
        ))}
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
