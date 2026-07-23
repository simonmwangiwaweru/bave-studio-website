import Link from "next/link";
import PlaceholderFrame from "@/components/PlaceholderFrame";
import SanityImage from "@/components/SanityImage";
import { getFeaturedImages, getTestimonials } from "@/sanity/queries";

export const revalidate = 60;

const services = [
  {
    href: "/photography",
    number: "01",
    title: "Photography",
    blurb:
      "Candid portraits and event coverage that catch people at their best — clean, honest, well-lit.",
  },
  {
    href: "/videography",
    number: "02",
    title: "Videography",
    blurb:
      "Edited films, promos and event stories. From single-camera shoots to full production.",
  },
  {
    href: "/live-streaming",
    number: "03",
    title: "Live Streaming",
    blurb:
      "Multi-camera broadcast of conferences, services, weddings and launches — reliable, broadcast-ready.",
  },
];

export default async function Home() {
  const [featured, testimonials] = await Promise.all([
    getFeaturedImages(),
    getTestimonials(),
  ]);
  const testimonial = testimonials[0];

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
        <p className="eyebrow">Photography · Videography · Live Streaming</p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight text-paper md:text-6xl">
          Work worth remembering, captured properly.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-paper-muted md:text-lg">
          Bave Studio covers events, weddings, corporate and commercial briefs —
          stills, film and live broadcast under one roof.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-amber px-6 py-3 font-medium text-ink transition-colors hover:bg-amber-deep"
          >
            Start a project
          </Link>
          <Link
            href="/work"
            className="text-sm text-paper-muted underline-offset-4 transition-colors hover:text-paper hover:underline"
          >
            See the work →
          </Link>
        </div>
      </section>

      {/* Curated work strip */}
      <section className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {featured.length >= 4
            ? featured.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  className={`frame relative aspect-[4/5] ${
                    i % 2 === 1 ? "md:translate-y-8" : ""
                  }`}
                >
                  <SanityImage image={item.image} priority={i < 2} />
                </div>
              ))
            : [
                "Candid portrait",
                "Corporate event",
                "Collaboration",
                "Group work",
              ].map((label, i) => (
                <PlaceholderFrame
                  key={label}
                  label={label}
                  ratio="aspect-[4/5]"
                  className={i % 2 === 1 ? "md:translate-y-8" : ""}
                />
              ))}
        </div>
        <p className="mt-12 text-right text-sm text-paper-muted md:mt-16">
          <Link
            href="/work"
            className="underline-offset-4 hover:text-paper hover:underline"
          >
            Full portfolio →
          </Link>
        </p>
      </section>

      {/* Three service lines */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <p className="eyebrow">What we do</p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border rule bg-hairline md:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group bg-ink p-7 transition-colors hover:bg-ink-raised md:p-9"
            >
              <span className="font-display text-sm text-amber">
                {s.number}
              </span>
              <h2 className="mt-3 font-display text-2xl text-paper">
                {s.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-paper-muted">
                {s.blurb}
              </p>
              <span className="mt-6 inline-block text-sm text-paper-faint transition-colors group-hover:text-amber">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Social proof slot — populated from Sanity testimonials */}
      <section className="border-y rule bg-ink-raised">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center md:px-8 md:py-20">
          <p className="eyebrow">What clients say</p>
          <blockquote className="mx-auto mt-6 max-w-2xl font-display text-xl leading-relaxed text-paper md:text-2xl">
            {testimonial
              ? `“${testimonial.quote}”`
              : "“Testimonial from a real client will appear here — professional, attributed, and specific about the work delivered.”"}
          </blockquote>
          <p className="mt-5 text-sm text-paper-muted">
            {testimonial
              ? [testimonial.author, testimonial.organisation]
                  .filter(Boolean)
                  .join(" · ")
              : "Client name · Organisation"}
          </p>
        </div>
      </section>

      {/* Contact band */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl tracking-tight text-paper md:text-4xl">
              Planning something?
            </h2>
            <p className="mt-3 max-w-md text-paper-muted">
              Tell us the date, the place and what you need — we’ll come back
              with a clear quote.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-amber px-6 py-3 font-medium text-ink transition-colors hover:bg-amber-deep"
            >
              Start a project
            </Link>
            <a
              href="https://wa.me/254798108543"
              className="text-sm text-paper-muted underline-offset-4 hover:text-paper hover:underline"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
