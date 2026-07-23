import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderFrame from "@/components/PlaceholderFrame";
import SanityImage from "@/components/SanityImage";
import { getSiteSettings } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "About",
  description:
    "The photographer and filmmaker behind Bave Studio — approach, equipment and experience.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-12 md:grid-cols-[2fr_3fr] md:gap-16">
        <div>
          {settings?.headshot ? (
            <div className="frame rot-a relative aspect-[3/4]">
              <SanityImage
                image={settings.headshot}
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          ) : (
            /* Studio headshot (asset A1) slots in once the original arrives */
            <PlaceholderFrame
              label="Studio headshot"
              ratio="aspect-[3/4]"
              className="rot-a"
            />
          )}
        </div>

        <div>
          <p className="eyebrow">About</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-tight tracking-tight text-ink md:text-6xl">
            Behind the camera
          </h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-graphite">
            {settings?.aboutBio ? (
              settings.aboutBio
                .split(/\n\s*\n/)
                .map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <>
                <p>
                  Bave Studio is built on a simple idea: the best frame is the
                  honest one. Whether it’s a wedding, a boardroom or a live
                  broadcast, the job is the same — catch people at their best
                  without making them perform.
                </p>
                <p>
                  Biography, approach and background — written in the
                  photographer’s own words — will be added here.
                </p>
              </>
            )}
          </div>

          <div className="mt-10 rounded-lg border rule bg-card p-7">
            <p className="eyebrow">Equipment</p>
            <p className="mt-3 text-sm leading-relaxed text-graphite">
              Professional Nikon camera bodies with prime and telephoto glass,
              dedicated video and streaming rigs. Full list available for
              commercial clients on request.
            </p>
          </div>

          <div className="mt-10">
            <Link href="/contact" className="btn-fill !px-7">
              Work with us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
