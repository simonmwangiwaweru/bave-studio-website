/* Replaces the degraded PDF-extracted copies of A1 (headshot), A3 and
   A5 (behind-the-scenes) with the real originals -- these five
   WhatsApp-delivered files sitting in the project folder since
   2026-07-25 are exactly what the original audit meant by
   "Original required."
   Run:  SANITY_TOKEN=... node scripts/upgrade-to-originals.mjs */
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

const a1 = await uploadImage(
  "WhatsApp Image 2026-07-25 at 23.20.25.jpeg",
  "a1-original.jpeg",
);
const a3 = await uploadImage(
  "WhatsApp Image 2026-07-25 at 23.20.26.jpeg",
  "a3-original.jpeg",
);
const a5 = await uploadImage(
  "WhatsApp Image 2026-07-25 at 23.20.27.jpeg",
  "a5-original.jpeg",
);

const settings = await client.fetch(
  '*[_id=="siteSettings"][0]{headshot, behindTheScenes}',
);

const behindTheScenes = settings.behindTheScenes.map((img) => {
  if (img._key === "A3") return { ...img, asset: { _type: "reference", _ref: a3._id } };
  if (img._key === "A5") return { ...img, asset: { _type: "reference", _ref: a5._id } };
  return img;
});

await client
  .patch("siteSettings")
  .set({
    headshot: { ...settings.headshot, asset: { _type: "reference", _ref: a1._id } },
    behindTheScenes,
  })
  .commit();

console.log("headshot (A1), A3 and A5 upgraded to full-quality originals");
