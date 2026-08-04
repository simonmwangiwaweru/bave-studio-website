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
    icon: (
      <>
        <path d="M4 8.5a2 2 0 0 1 2-2h1.2l.8-1.3a1.5 1.5 0 0 1 1.3-.7h5.4a1.5 1.5 0 0 1 1.3.7l.8 1.3H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Z" />
        <circle cx="12" cy="13" r="3.2" />
      </>
    ),
  },
  {
    title: "Any platform",
    detail: "YouTube, Facebook Live, Zoom and private streams.",
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="12" rx="2" />
        <path
          d="M10.5 9.3v5.4l4.7-2.7-4.7-2.7Z"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),
  },
  {
    title: "Clean audio",
    detail: "Direct sound-desk feeds and dedicated microphones.",
    icon: (
      <>
        <rect x="9.5" y="3.5" width="5" height="9" rx="2.5" />
        <path d="M6.5 11a5.5 5.5 0 0 0 11 0" />
        <path d="M12 16.5V20M9 20h6" />
      </>
    ),
  },
  {
    title: "Reliable delivery",
    detail: "Redundant internet paths and full HD stream quality.",
    icon: <path d="M5 19v-3M10 19v-6M15 19v-9M20 19v-12" />,
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
        Your event, live for everyone who couldn’t be there.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-graphite">
        We handle cameras, switching, sound and the stream itself — you handle
        the event. Guests watch in real time on the platform of your choice.
      </p>

      {/* Capability statement — white cards on the canvas */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2">
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

      {/* Typical use cases as pill tags */}
      <div className="mt-16">
        <p className="eyebrow">We stream</p>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {useCases.map((u) => (
            <li key={u} className="tag">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-orange align-middle" />
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
                    cs.images &&
                    cs.images.length > 0 &&
                    (cs.images.length === 1 ? (
                      <div className="frame relative aspect-video">
                        <SanityImage
                          image={cs.images[0]}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {cs.images.map((img, i) => (
                          <div key={i} className="frame relative aspect-[4/5]">
                            <SanityImage
                              image={img}
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          </div>
                        ))}
                      </div>
                    ))
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
