import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderFrame from "@/components/PlaceholderFrame";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected photography, videography and live streaming work by Bave Studio.",
};

const categories = [
  {
    href: "/photography",
    title: "Photography",
    blurb: "Candid portraits, events, corporate coverage.",
    label: "Photography",
    rot: "rot-a",
  },
  {
    href: "/videography",
    title: "Videography",
    blurb: "Showreel, event films, promos.",
    label: "Videography",
    rot: "rot-b",
  },
  {
    href: "/live-streaming",
    title: "Live Streaming",
    blurb: "Multi-camera broadcast, case studies.",
    label: "Live streaming",
    rot: "rot-c",
  },
];

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">Portfolio</p>
      <h1 className="mt-4 font-display text-4xl font-light tracking-tight text-ink md:text-6xl">
        The work
      </h1>
      <p className="mt-4 max-w-lg text-lg text-graphite">
        Three disciplines, one standard. Pick a lane or browse everything.
      </p>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.href} href={c.href} className="group">
            <PlaceholderFrame
              label={c.label}
              ratio="aspect-[4/3]"
              className={c.rot}
            />
            <h2 className="mt-5 font-display text-2xl text-ink transition-colors group-hover:text-orange">
              {c.title}
            </h2>
            <p className="mt-1 text-sm text-graphite">{c.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
