/* One-time: seeds the studio portrait session (2 images) as a new
   "Portrait" sub-category gallery — the scope doc explicitly calls out
   Portrait as an expected photography sub-category alongside Weddings
   and Corporate, and this is the first content for it.
   Run:  SANITY_TOKEN=... node scripts/seed-portrait-session.mjs */
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

const images = [
  {
    file: "f3b8bbc3-7dff-40c1-a767-9f25e55951de.jpg",
    key: "p1",
    alt: "Two women in matching orange and gold outfits posing together for a studio portrait",
  },
  {
    file: "c9881b67-bf1b-4ef2-9ff3-0c7ed2a46f73.jpg",
    key: "p2",
    alt: "Woman in an orange and gold gown smiling during a studio portrait session",
  },
];

const assets = [];
for (const img of images) {
  const asset = await uploadImage(img.file, `${img.key}.jpg`);
  assets.push({
    _type: "image",
    _key: img.key,
    asset: { _type: "reference", _ref: asset._id },
    alt: img.alt,
  });
}

await client.createOrReplace({
  _id: "gallery-studio-portrait-session",
  _type: "gallery",
  title: "Studio Portrait Session",
  slug: { _type: "slug", current: "studio-portrait-session" },
  category: "photography",
  subcategory: "Portrait",
  description: "A studio portrait session with clean light and colour.",
  images: assets,
  featured: false,
  published: true,
  order: 3,
});
console.log("gallery created: Studio Portrait Session");
