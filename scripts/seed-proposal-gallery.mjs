/* Creates a dedicated "Marriage Proposal" gallery for this event (a
   different couple than Wedding Day Coverage), and removes the one
   photo from it that got merged into the wrong gallery earlier.
   Curated to 6 of the 11 photos received, following the audit's own
   "tight selection over comprehensive" principle.
   Run:  SANITY_TOKEN=... node scripts/seed-proposal-gallery.mjs */
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

// Remove the misplaced photo from Wedding Day Coverage (different couple)
const wedding = await client.fetch(
  '*[_id=="gallery-wedding-day-coverage"][0]{images}',
);
await client
  .patch("gallery-wedding-day-coverage")
  .set({ images: wedding.images.filter((img) => img._key !== "w6") })
  .commit();
console.log("removed misplaced photo from Wedding Day Coverage");

const images = [
  {
    file: "1000433354.jpg",
    key: "p1",
    alt: "Rose-covered heart-shaped arch with a neon 'will you marry me?' sign, proposal setup",
  },
  {
    file: "1000433358.jpg",
    key: "p2",
    alt: "Man kneeling to propose with a ring in front of a rose arch",
  },
  {
    file: "1000433336.jpg",
    key: "p3",
    alt: "Woman reacting with surprise and joy just after being proposed to",
  },
  {
    // Reuses the asset already uploaded earlier this session
    _existingAssetRef: "image-592e0b19323eb05b75f11139a5b1b0cec366d4de-4000x6000-jpg",
    key: "p4",
    alt: "Woman showing off her engagement ring in front of the rose arch",
  },
  {
    file: "1000433352.jpg",
    key: "p5",
    alt: "Newly engaged couple smiling together in front of the rose arch",
  },
  {
    file: "1000433356.jpg",
    key: "p6",
    alt: "Newly engaged couple sharing an embrace after the proposal",
  },
];

const assets = [];
for (const img of images) {
  const ref = img._existingAssetRef ?? (await uploadImage(img.file, `${img.key}.jpg`))._id;
  assets.push({
    _type: "image",
    _key: img.key,
    asset: { _type: "reference", _ref: ref },
    alt: img.alt,
  });
}

await client.createOrReplace({
  _id: "gallery-marriage-proposal",
  _type: "gallery",
  title: "Marriage Proposal",
  slug: { _type: "slug", current: "marriage-proposal" },
  category: "photography",
  subcategory: "Proposals",
  description:
    "A surprise proposal, from the decor and the moment itself through to the celebration after.",
  images: assets,
  featured: false,
  published: true,
  order: 4,
});
console.log("gallery created: Marriage Proposal");
