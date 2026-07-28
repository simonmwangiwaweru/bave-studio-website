/* One-time: appends A4 (styled portrait, per the audit "off-message /
   social media only" — no rights blocker, just not lead-image material)
   to the existing behindTheScenes array, alongside A3 and A5.
   Run:  SANITY_TOKEN=... node scripts/add-a4-behind-the-scenes.mjs */
import { createClient } from "next-sanity";
import { readFileSync } from "fs";
import path from "path";

const EXTRACT_DIR =
  "C:/Users/ADMIN/AppData/Local/Temp/claude/h--BERRY-PORTFOLIO-WEBSITE/aa17ae10-48f4-48b5-9440-11dc161ee053/scratchpad/extracted";

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

const file = "p15_img04_606x646.jpeg";
const alt = "Styled portrait of the photographer";

const buf = readFileSync(path.join(EXTRACT_DIR, file));
const asset = await client.assets.upload("image", buf, { filename: "a4.jpeg" });
console.log(`uploaded A4 -> ${asset._id}`);

await client
  .patch("siteSettings")
  .setIfMissing({ behindTheScenes: [] })
  .append("behindTheScenes", [
    {
      _type: "image",
      _key: "A4",
      asset: { _type: "reference", _ref: asset._id },
      alt,
    },
  ])
  .commit();

console.log("siteSettings.behindTheScenes updated (A4 appended)");
