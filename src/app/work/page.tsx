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
  },
  {
    href: "/videography",
    title: "Videography",
    blurb: "Showreel, event films, promos.",
    label: "Videography",
  },
  {
    href: "/live-streaming",
    title: "Live Streaming",
    blurb: "Multi-camera broadcast, case studies.",
    label: "Live streaming",
  },
];

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">Portfolio</p>
      <h1 className="mt-4 font-display text-4xl tracking-tight text-paper md:text-5xl">
        The work
      </h1>
      <p className="mt-4 max-w-lg text-paper-muted">
        Three disciplines, one standard. Pick a lane or browse everything.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.href} href={c.href} className="group">
            <PlaceholderFrame label={c.label} ratio="aspect-[4/3]" />
            <h2 className="mt-4 font-display text-xl text-paper transition-colors group-hover:text-amber">
              {c.title}
            </h2>
            <p className="mt-1 text-sm text-paper-muted">{c.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
