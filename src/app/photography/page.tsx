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

const placeholderFrames = [
  { label: "Candid portrait", ratio: "aspect-[4/5]" },
  { label: "Book signing", ratio: "aspect-[3/2]" },
  { label: "At the laptop", ratio: "aspect-[4/5]" },
  { label: "Formal group", ratio: "aspect-[3/2]" },
  { label: "Collaboration", ratio: "aspect-[4/5]" },
  { label: "Speaker", ratio: "aspect-[4/5]" },
];

const rotations = ["rot-a", "rot-b", "rot-c", "rot-d", "rot-b", "rot-a"];

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
    <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">01 — Photography</p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-light leading-tight tracking-tight text-ink md:text-6xl">
        People at work, caught honestly.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-graphite">
        Our strongest work is the candid frame — a genuine reaction, clean
        light, a background that doesn’t fight the subject. Events, corporate
        coverage, portraits.
      </p>

      {/* Gallery presented as objects in a white card, scrapbook-style */}
      <div className="mt-14 rounded-lg border rule bg-card p-5 md:p-8">
        <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {images.length > 0
            ? images.map((item, i) => (
                <div
                  key={item.key}
                  className={`frame relative aspect-[4/5] break-inside-avoid ${
                    rotations[i % rotations.length]
                  }`}
                >
                  <SanityImage
                    image={item.image}
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))
            : placeholderFrames.map((f, i) => (
                <PlaceholderFrame
                  key={f.label}
                  label={f.label}
                  ratio={f.ratio}
                  className={`break-inside-avoid ${rotations[i]}`}
                />
              ))}
        </div>
      </div>

      <div className="mt-16 border-t rule pt-10 text-center">
        <p className="text-graphite">Like what you see?</p>
        <Link
          href="/contact?service=photography"
          className="btn-fill mt-5 !px-7"
        >
          Book a shoot
        </Link>
      </div>
    </div>
  );
}
