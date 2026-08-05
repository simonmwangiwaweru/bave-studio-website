import Link from "next/link";
import PlaceholderFrame from "@/components/PlaceholderFrame";
import SanityImage from "@/components/SanityImage";
import CinematicHero from "@/components/CinematicHero";
import { urlFor } from "@/sanity/client";
import { getFeaturedImages, getGalleries } from "@/sanity/queries";

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

const rotations = ["rot-a", "rot-b", "rot-c", "rot-d"];

const heroCopy = (
  <>
    <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
      Photography · Videography · Live Streaming
    </p>
    <h1 className="mx-auto mt-7 max-w-3xl font-display text-5xl font-light leading-[0.98] tracking-tight text-white md:text-7xl lg:text-[80px]">
      Moments worth keeping, captured beautifully.
    </h1>
    <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
      Bave Studio covers events, weddings, corporate and commercial briefs —
      stills, film and live broadcast under one roof.
    </p>
    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
      <Link href="/contact" className="btn-fill !bg-white !text-[#111110] hover:!bg-[#e1e1db]">
        Start a project
      </Link>
      <Link href="/work" className="btn-ghost-light">
        See the work&nbsp;&nbsp;▷
      </Link>
    </div>
  </>
);

export default async function Home() {
  const [featured, photoGalleries] = await Promise.all([
    getFeaturedImages(),
    getGalleries("photography"),
  ]);

  const heroSlides = featured.slice(0, 6).map((item) => ({
    src: urlFor(item.image).width(1920).height(1200).url(),
    alt: item.image.alt ?? "",
    caption: item.galleryTitle,
  }));

  // More work, below the fold — every photo not already used in the hero,
  // so the homepage draws from the full range of galleries rather than
  // stopping at whatever made the featured cut.
  const heroRefs = new Set(featured.slice(0, 6).map((f) => f.image.asset._ref));
  const moreWork = photoGalleries
    .flatMap((g) => g.images ?? [])
    .filter((img) => !heroRefs.has(img.asset._ref))
    .slice(0, 8);

  return (
    <>
      {heroSlides.length >= 3 ? (
        <>
          <CinematicHero slides={heroSlides}>{heroCopy}</CinematicHero>
          <p className="mx-auto max-w-[1200px] px-5 pt-6 text-right text-sm text-graphite md:px-8">
            <Link href="/work" className="underline-offset-4 hover:text-ink hover:underline">
              Full portfolio →
            </Link>
          </p>
        </>
      ) : (
        <>
          {/* Deep-teal editorial hero — fallback until 3+ featured images exist */}
          <section className="bg-teal">
            <div className="mx-auto max-w-[1200px] px-5 py-24 text-center md:px-8 md:py-36">
              {heroCopy}
            </div>
          </section>

          {/* Scrapbook work strip on the cream canvas */}
          <section className="mx-auto max-w-[1200px] px-5 pt-20 md:px-8 md:pt-28">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-2">
              {featured.length >= 4
                ? featured.slice(0, 4).map((item, i) => (
                    <div
                      key={i}
                      className={`frame relative aspect-[4/5] ${rotations[i]} md:-mx-1`}
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
                      className={`${rotations[i]} md:-mx-1`}
                    />
                  ))}
            </div>
            <p className="mt-10 text-right text-sm text-graphite">
              <Link href="/work" className="underline-offset-4 hover:text-ink hover:underline">
                Full portfolio →
              </Link>
            </p>
          </section>
        </>
      )}

      {/* Three service lines as white cards */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <p className="eyebrow">What we do</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-lg border rule bg-card p-8 transition-colors hover:border-ink"
            >
              <span className="text-sm font-medium text-orange">{s.number}</span>
              <h2 className="mt-3 font-display text-2xl text-ink">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-graphite">
                {s.blurb}
              </p>
              <span className="mt-6 inline-block text-sm text-ash transition-colors group-hover:text-orange">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* More work — every photo not already used in the hero above */}
      {moreWork.length > 0 && (
        <section className="border-y rule bg-linen/60">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
            <p className="eyebrow">More from the studio</p>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-3">
              {moreWork.map((img, i) => (
                <div
                  key={img.asset._ref}
                  className={`frame relative aspect-[4/5] ${rotations[i % rotations.length]}`}
                >
                  <SanityImage image={img} sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
              ))}
            </div>
            <p className="mt-10 text-right text-sm text-graphite">
              <Link href="/photography" className="underline-offset-4 hover:text-ink hover:underline">
                See the full gallery →
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* Contact band */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl font-light tracking-tight text-ink md:text-4xl">
              Planning something?
            </h2>
            <p className="mt-3 max-w-md text-graphite">
              Tell us the date, the place and what you need — we’ll come back
              with a clear quote.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="btn-fill">
              Start a project
            </Link>
            <a
              href="https://wa.me/254798108543"
              className="text-sm text-graphite underline-offset-4 hover:text-ink hover:underline"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
