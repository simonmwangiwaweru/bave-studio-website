import type { Metadata } from "next";
import Link from "next/link";
import LiteVideoEmbed from "@/components/LiteVideoEmbed";
import { getCaseStudies, parseVideoUrl } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Live Streaming",
  description:
    "Multi-camera live streaming for conferences, church services, weddings, launches and graduations.",
};

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
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">03 — Live Streaming</p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight text-paper md:text-5xl">
        Your event, live to everyone who couldn’t be in the room.
      </h1>
      <p className="mt-5 max-w-xl leading-relaxed text-paper-muted">
        We handle cameras, switching, sound and the stream itself — you handle
        the event. Guests watch in real time on the platform of your choice.
      </p>

      {/* Capability statement */}
      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border rule bg-hairline sm:grid-cols-2">
        {capabilities.map((c) => (
          <div key={c.title} className="bg-ink p-6 md:p-8">
            <h2 className="font-display text-lg text-paper">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-paper-muted">
              {c.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Typical use cases */}
      <div className="mt-16">
        <p className="eyebrow">We stream</p>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {useCases.map((u) => (
            <li
              key={u}
              className="rounded-full border rule px-4 py-1.5 text-sm text-paper-muted"
            >
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
                  className="grid gap-8 rounded-lg border rule p-8 md:grid-cols-2 md:p-10"
                >
                  <div>
                    {cs.eventType && <p className="eyebrow">{cs.eventType}</p>}
                    <h2 className="mt-2 font-display text-2xl text-paper">
                      {cs.title}
                    </h2>
                    {cs.brief && (
                      <div className="mt-5">
                        <p className="eyebrow">The brief</p>
                        <p className="mt-2 text-sm leading-relaxed text-paper-muted">
                          {cs.brief}
                        </p>
                      </div>
                    )}
                    {cs.delivered && (
                      <div className="mt-5">
                        <p className="eyebrow">What we delivered</p>
                        <p className="mt-2 text-sm leading-relaxed text-paper-muted">
                          {cs.delivered}
                        </p>
                      </div>
                    )}
                    {cs.viewership && (
                      <p className="mt-5 text-sm text-amber">{cs.viewership}</p>
                    )}
                  </div>
                  {recording && (
                    <LiteVideoEmbed
                      provider={recording.provider}
                      videoId={recording.videoId}
                      title={cs.title}
                    />
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border rule p-8 md:p-10">
            <p className="font-display text-xl text-paper">Case study slot</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper-muted">
              Each case study covers the event, what was required, what we
              delivered, and where possible the recording and viewership
              figures. Real examples will populate here from the CMS.
            </p>
          </div>
        )}
      </div>

      <div className="mt-16 border-t rule pt-10 text-center">
        <p className="text-paper-muted">Planning a broadcast?</p>
        <Link
          href="/contact?service=live-streaming"
          className="mt-4 inline-block rounded-full bg-amber px-6 py-3 font-medium text-ink transition-colors hover:bg-amber-deep"
        >
          Get a streaming quote
        </Link>
      </div>
    </div>
  );
}
