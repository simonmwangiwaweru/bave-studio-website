/* Replaces C1 (the smiling-attendee homepage hero image) with the
   client's enhanced edit, keeping the same _key and alt text so no
   other reference (hero, gallery order) needs to change.
   Run:  SANITY_TOKEN=... node scripts/replace-c1.mjs */
import { createClient } from "next-sanity";
import { readFileSync } from "fs";

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

const buf = readFileSync("H:/BERRY PORTFOLIO WEBSITE/enhanced smile.png");
const asset = await client.assets.upload("image", buf, {
  filename: "c1-enhanced.png",
});
console.log(`uploaded enhanced C1 -> ${asset._id}`);

const gallery = await client.fetch(
  '*[_id=="gallery-ai-for-business"][0]{images}',
);
const images = gallery.images.map((img) =>
  img._key === "C1"
    ? { ...img, asset: { _type: "reference", _ref: asset._id } }
    : img,
);

await client.patch("gallery-ai-for-business").set({ images }).commit();
console.log("C1 replaced with the enhanced edit");
