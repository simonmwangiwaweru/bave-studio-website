import type { Metadata } from "next";
import Link from "next/link";
import LiteVideoEmbed from "@/components/LiteVideoEmbed";
import SanityImage from "@/components/SanityImage";
import { getCaseStudies, parseVideoUrl } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Live Streaming",
  description:
    "Multi-camera live streaming for conferences, church services, weddings, launches and graduations.",
};

export const revalidate = 60;

const capabilities = [
  {
    title: "Multi-camera setups",
    detail: "Switched multi-angle coverage, not a phone on a tripod.",
  },
  {
    title: "Any platform",
    detail: "YouTube, Facebook Live, Zoom and private streams.",
  },
  {
    title: "Clean audio",
    detail: "Direct sound-desk feeds and dedicated microphones.",
  },
  {
    title: "Reliable delivery",
    detail: "Redundant internet paths and full HD stream quality.",
  },
];

const useCases = [
  "Conferences",
  "Church services",
  "Weddings",
  "Product launches",
  "Graduations",
  "Funerals & memorials",
];

export default async function LiveStreamingPage() {
  const caseStudies = await getCaseStudies();

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">03 — Live Streaming</p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-light leading-tight tracking-tight text-ink md:text-6xl">
        Your event, live to everyone who couldn’t be in the room.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-graphite">
        We handle cameras, switching, sound and the stream itself — you handle
        the event. Guests watch in real time on the platform of your choice.
      </p>

      {/* Capability statement — white cards on the canvas */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {capabilities.map((c) => (
          <div key={c.title} className="rounded-lg border rule bg-card p-7">
            <h2 className="font-display text-xl text-ink">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-graphite">
              {c.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Typical use cases as pill tags */}
      <div className="mt-16">
        <p className="eyebrow">We stream</p>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {useCases.map((u) => (
            <li key={u} className="tag">
              {u}
            </li>
          ))}
        </ul>
      </div>

      {/* Case studies from the CMS */}
      <div className="mt-16">
        <p className="eyebrow mb-5">Case studies</p>
        {caseStudies.length > 0 ? (
          <div className="space-y-6">
            {caseStudies.map((cs) => {
              const recording = cs.recordingUrl
                ? parseVideoUrl(cs.recordingUrl)
                : null;
              return (
                <article
                  key={cs._id}
                  className="grid gap-8 rounded-lg border rule bg-card p-8 md:grid-cols-2 md:p-10"
                >
                  <div>
                    {cs.eventType && <p className="eyebrow">{cs.eventType}</p>}
                    <h2 className="mt-2 font-display text-2xl text-ink">
                      {cs.title}
                    </h2>
                    {cs.brief && (
                      <div className="mt-5">
                        <p className="eyebrow">The brief</p>
                        <p className="mt-2 text-sm leading-relaxed text-graphite">
                          {cs.brief}
                        </p>
                      </div>
                    )}
                    {cs.delivered && (
                      <div className="mt-5">
                        <p className="eyebrow">What we delivered</p>
                        <p className="mt-2 text-sm leading-relaxed text-graphite">
                          {cs.delivered}
                        </p>
                      </div>
                    )}
                    {cs.viewership && (
                      <p className="mt-5 text-sm font-medium text-orange">
                        {cs.viewership}
                      </p>
                    )}
                  </div>
                  {recording ? (
                    <LiteVideoEmbed
                      provider={recording.provider}
                      videoId={recording.videoId}
                      title={cs.title}
                    />
                  ) : (
                    cs.coverImage && (
                      <div className="frame relative aspect-video">
                        <SanityImage
                          image={cs.coverImage}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border rule bg-card p-8 md:p-10">
            <p className="font-display text-xl text-ink">Case study slot</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graphite">
              Each case study covers the event, what was required, what we
              delivered, and where possible the recording and viewership
              figures. Real examples will populate here from the CMS.
            </p>
          </div>
        )}
      </div>

      <div className="mt-16 border-t rule pt-10 text-center">
        <p className="text-graphite">Planning a broadcast?</p>
        <Link href="/contact" className="btn-fill mt-5 !px-7">
          Get a streaming quote
        </Link>
      </div>
    </div>
  );
}
