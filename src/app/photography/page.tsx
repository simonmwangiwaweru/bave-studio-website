import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderFrame from "@/components/PlaceholderFrame";
import SanityImage from "@/components/SanityImage";
import { getGalleries } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "Candid portraits, corporate events and coverage photography by Bave Studio.",
};

export const revalidate = 60;

/* Placeholder set previews how a real masonry grid will read until
   cleared images are published in the CMS. */
const placeholderFrames = [
  { label: "Candid portrait", ratio: "aspect-[4/5]" },
  { label: "Book signing", ratio: "aspect-[3/2]" },
  { label: "At the laptop", ratio: "aspect-[4/5]" },
  { label: "Formal group", ratio: "aspect-[3/2]" },
  { label: "Collaboration", ratio: "aspect-[4/5]" },
  { label: "Speaker", ratio: "aspect-[4/5]" },
];

export default async function PhotographyPage() {
  const galleries = await getGalleries("photography");
  const images = galleries.flatMap((g) =>
    (g.images ?? []).map((image, i) => ({
      image,
      key: `${g._id}-${i}`,
      galleryTitle: g.title,
    })),
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">01 — Photography</p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight text-paper md:text-5xl">
        People at work, caught honestly.
      </h1>
      <p className="mt-5 max-w-xl leading-relaxed text-paper-muted">
        Our strongest work is the candid frame — a genuine reaction, clean
        light, a background that doesn’t fight the subject. Events, corporate
        coverage, portraits.
      </p>

      <div className="mt-14 columns-2 gap-3 md:columns-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4">
        {images.length > 0
          ? images.map((item) => (
              <div
                key={item.key}
                className="frame relative aspect-[4/5] break-inside-avoid rounded-sm"
              >
                <SanityImage
                  image={item.image}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))
          : placeholderFrames.map((f) => (
              <PlaceholderFrame
                key={f.label}
                label={f.label}
                ratio={f.ratio}
                className="break-inside-avoid rounded-sm"
              />
            ))}
      </div>

      <div className="mt-16 border-t rule pt-10 text-center">
        <p className="text-paper-muted">Like what you see?</p>
        <Link
          href="/contact?service=photography"
          className="mt-4 inline-block rounded-full bg-amber px-6 py-3 font-medium text-ink transition-colors hover:bg-amber-deep"
        >
          Book a shoot
        </Link>
      </div>
    </div>
  );
}
