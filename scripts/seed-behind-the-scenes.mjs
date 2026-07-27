/* One-time: uploads A3 + A5 (the audit's "evidences videography" and
   "strongest credibility image" shots) into siteSettings.behindTheScenes.
   Run:  SANITY_TOKEN=... node scripts/seed-behind-the-scenes.mjs */
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

const images = {
  A3: { file: "p15_img03_606x535.jpeg", alt: "Operating a professional video camera and microphone rig at an event" },
  A5: { file: "p16_img05_600x900.jpeg", alt: "The photographer in formal wear with camera at an evening event" },
};

async function uploadImage(code) {
  const { file, alt } = images[code];
  const buf = readFileSync(path.join(EXTRACT_DIR, file));
  const asset = await client.assets.upload("image", buf, {
    filename: `${code.toLowerCase()}.jpeg`,
  });
  console.log(`uploaded ${code} -> ${asset._id}`);
  return {
    _type: "image",
    _key: code,
    asset: { _type: "reference", _ref: asset._id },
    alt,
  };
}

const btsImages = [await uploadImage("A3"), await uploadImage("A5")];

await client
  .patch("siteSettings")
  .setIfMissing({ behindTheScenes: [] })
  .set({ behindTheScenes: btsImages })
  .commit();

console.log("siteSettings.behindTheScenes updated");
