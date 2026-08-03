/* Replicates page.tsx's exact hero + "more from the studio" selection
   logic, to know precisely which image refs are landing-page images. */
import { createClient } from "next-sanity";

const client = createClient({
  projectId: "mg7nrrn9",
  dataset: "production",
  apiVersion: "2026-07-01",
  useCdn: false,
});

const featuredGalleries = await client.fetch(
  '*[_type == "gallery" && featured == true && published == true] | order(order asc) { title, images }',
);
const featured = featuredGalleries.flatMap((g) =>
  (g.images ?? []).slice(0, 2).map((image) => ({ image, galleryTitle: g.title })),
);
const heroSlides = featured.slice(0, 6);
const heroRefs = new Set(heroSlides.map((f) => f.image.asset._ref));

const photoGalleries = await client.fetch(
  '*[_type == "gallery" && category == "photography" && published == true] | order(order asc) { title, images }',
);
const moreWork = photoGalleries
  .flatMap((g) => (g.images ?? []).map((img) => ({ img, gallery: g.title })))
  .filter((x) => !heroRefs.has(x.img.asset._ref))
  .slice(0, 8);

console.log("HERO SLIDES:");
heroSlides.forEach((f) =>
  console.log(`  ${f.galleryTitle} / ${f.image._key} (${f.image.asset._ref.slice(0, 12)})`),
);
console.log("\nMORE FROM THE STUDIO:");
moreWork.forEach((x) =>
  console.log(`  ${x.gallery} / ${x.img._key} (${x.img.asset._ref.slice(0, 12)})`),
);
