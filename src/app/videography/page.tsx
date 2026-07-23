import type { Metadata } from "next";
import Link from "next/link";
import LiteVideoEmbed from "@/components/LiteVideoEmbed";
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

export default async function VideographyPage() {
  const [settings, galleries] = await Promise.all([
    getSiteSettings(),
    getGalleries("videography"),
  ]);

  const showreel = settings?.showreelUrl
    ? parseVideoUrl(settings.showreelUrl)
    : null;

  const projects = galleries.flatMap((g) => {
    const parsed = g.videoUrl ? parseVideoUrl(g.videoUrl) : null;
    return parsed ? [{ ...parsed, title: g.title, id: g._id }] : [];
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">02 — Videography</p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight text-paper md:text-5xl">
        Stories that move.
      </h1>
      <p className="mt-5 max-w-xl leading-relaxed text-paper-muted">
        Event films, promos and produced pieces — shot, edited and delivered
        ready to publish.
      </p>

      {/* Showreel — the highest-conversion asset, so it leads the page */}
      <div className="mt-14">
        <p className="eyebrow mb-4">Showreel</p>
        {showreel ? (
          <LiteVideoEmbed
            provider={showreel.provider}
            videoId={showreel.videoId}
            title="Bave Studio showreel"
          />
        ) : (
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-sm bg-ink-raised">
            <span className="absolute inset-0 bg-gradient-to-br from-ink-overlay to-ink-raised" />
            <span className="relative text-sm text-paper-faint">
              Showreel coming soon
            </span>
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
                className="relative flex aspect-video items-center justify-center overflow-hidden rounded-sm bg-ink-raised"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-ink-overlay to-ink-raised" />
                <span className="relative text-sm text-paper-faint">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 border-t rule pt-10 text-center">
        <p className="text-paper-muted">Need a film made?</p>
        <Link
          href="/contact?service=videography"
          className="mt-4 inline-block rounded-full bg-amber px-6 py-3 font-medium text-ink transition-colors hover:bg-amber-deep"
        >
          Start a project
        </Link>
      </div>
    </div>
  );
}
