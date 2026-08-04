/* Adds the black-and-white stylish portrait to siteSettings.behindTheScenes.
   Run:  SANITY_TOKEN=... node scripts/add-bw-portrait.mjs */
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

const buf = readFileSync(
  "H:/BERRY PORTFOLIO WEBSITE/WhatsApp Image 2026-07-25 at 22.59.46.jpeg",
);
const asset = await client.assets.upload("image", buf, {
  filename: "bw-styled-portrait.jpeg",
});
console.log(`uploaded -> ${asset._id}`);

await client
  .patch("siteSettings")
  .append("behindTheScenes", [
    {
      _type: "image",
      _key: "bw-portrait",
      asset: { _type: "reference", _ref: asset._id },
      alt: "Black-and-white styled portrait of the photographer",
    },
  ])
  .commit();
console.log("added to behindTheScenes");
