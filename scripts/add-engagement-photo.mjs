/* Adds the engagement/proposal celebration photo to the Wedding Day
   Coverage gallery.
   Run:  SANITY_TOKEN=... node scripts/add-engagement-photo.mjs */
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

const buf = readFileSync("H:/BERRY PORTFOLIO WEBSITE/1000433341.jpg.jpeg");
const asset = await client.assets.upload("image", buf, {
  filename: "w6-engagement.jpg",
});
console.log(`uploaded -> ${asset._id}`);

await client
  .patch("gallery-wedding-day-coverage")
  .append("images", [
    {
      _type: "image",
      _key: "w6",
      asset: { _type: "reference", _ref: asset._id },
      alt: "Woman celebrating her engagement ring in front of a floral arch and neon sign",
    },
  ])
  .commit();
console.log("added to Wedding Day Coverage");
