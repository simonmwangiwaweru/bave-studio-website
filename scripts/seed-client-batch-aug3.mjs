/* One-time: seeds the client's Aug 3 photo batch.
   - New "Wedding Day Coverage" photography gallery (first Weddings content)
   - Three live-streaming case studies (first ever): concert, corporate
     conference, memorial service — cover images only, per the caseStudy
     schema; copy is deliberately generic/honest since no client-supplied
     event names, dates or viewership figures exist yet.
   Excludes the marketing flyer graphic (not a portfolio photo).
   Run:  SANITY_TOKEN=... node scripts/seed-client-batch-aug3.mjs */
import { createClient } from "next-sanity";
import { readFileSync } from "fs";

const SRC_DIR = "H:/BERRY PORTFOLIO WEBSITE";

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error("Set SANITY_TOKEN first");
  process.exit(1);
}

const client = createClient({
  projectId: "mg7nrrn9",
  dataset: "production",
  apiVersion: "2026-07-01",
  token,
  useCdn: false,
});

async function uploadImage(file, filename) {
  const buf = readFileSync(`${SRC_DIR}/${file}`);
  const asset = await client.assets.upload("image", buf, { filename });
  console.log(`uploaded ${file} -> ${asset._id}`);
  return asset;
}

// ---- Wedding Day Coverage gallery ----
const weddingImages = [
  {
    file: "e6ca39a7-255d-4047-bb69-0667da319bff.jpg",
    key: "w1",
    alt: "Bride and groom sharing a candid moment in a hallway, wedding day",
  },
  {
    file: "252491e1-6555-4725-8228-9e328f1eac2e.jpg",
    key: "w2",
    alt: "Groom and bride portrait, editorial black-and-white style, wedding day",
  },
  {
    file: "8a3d195e-3615-4e30-bafe-9494451924c1.jpg",
    key: "w3",
    alt: "Groom in a white tuxedo walking through a doorway before the ceremony",
  },
  {
    file: "3da8b0b5-e3f3-4051-a670-605e27889b9f.jpg",
    key: "w4",
    alt: "Emcee and guest sharing a light moment during a wedding reception",
  },
  {
    file: "12f84d86-6c27-4e8e-9264-23fe0262f444.jpg",
    key: "w5",
    alt: "Reception table styling with African-print runner and floral centerpiece",
  },
];

const weddingAssets = [];
for (const img of weddingImages) {
  const asset = await uploadImage(img.file, `${img.key}.jpg`);
  weddingAssets.push({
    _type: "image",
    _key: img.key,
    asset: { _type: "reference", _ref: asset._id },
    alt: img.alt,
  });
}

await client.createOrReplace({
  _id: "gallery-wedding-day-coverage",
  _type: "gallery",
  title: "Wedding Day Coverage",
  slug: { _type: "slug", current: "wedding-day-coverage" },
  category: "photography",
  subcategory: "Weddings",
  description:
    "Portraits, candid reception moments and styling details from a wedding day.",
  images: weddingAssets,
  featured: true,
  published: true,
  order: 0,
});
console.log("gallery created: Wedding Day Coverage");

// ---- Live-streaming case studies ----
const caseStudies = [
  {
    id: "casestudy-live-event-broadcast",
    file: "live stream.jpg",
    title: "Live Event Broadcast",
    slug: "live-event-broadcast",
    eventType: "Live event / concert",
    brief:
      "Live video coverage of an outdoor evening event, with camera coverage of the performance and crowd.",
    delivered:
      "On-site camera operation and crew coverage capturing the performance as it happened.",
    alt: "Bave Studio crew operating a camera at an outdoor live event",
  },
  {
    id: "casestudy-corporate-conference",
    file: "live stream 3.jpg",
    title: "Corporate Conference Coverage",
    slug: "corporate-conference-coverage",
    eventType: "Conference",
    brief:
      "Full-day camera coverage of a corporate conference, including stage presentations and audience shots.",
    delivered:
      "Live camera operation and stage-screen coverage throughout the conference programme.",
    alt: "Wide view of a corporate conference stage and screens during a live broadcast",
  },
  {
    id: "casestudy-community-memorial-service",
    file: "9d991978-be9f-478a-acc0-3fcef9571252.jpg",
    title: "Community Memorial Service",
    slug: "community-memorial-service",
    eventType: "Funeral / memorial service",
    brief:
      "Respectful live coverage of a memorial service, including tribute displays for attendees.",
    delivered:
      "On-site filming and tribute-screen operation for family and community members.",
    alt: "Bave Studio crew managing the tribute display at a memorial service",
  },
];

for (const cs of caseStudies) {
  const asset = await uploadImage(cs.file, `${cs.slug}.jpg`);
  await client.createOrReplace({
    _id: cs.id,
    _type: "caseStudy",
    title: cs.title,
    slug: { _type: "slug", current: cs.slug },
    eventType: cs.eventType,
    brief: cs.brief,
    delivered: cs.delivered,
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: cs.alt,
    },
    published: true,
  });
  console.log(`case study created: ${cs.title}`);
}

console.log("\nDone.");
