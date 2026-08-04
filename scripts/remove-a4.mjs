/* Removes A4 (blue-toned styled portrait) from behindTheScenes per
   explicit client request.
   Run:  SANITY_TOKEN=... node scripts/remove-a4.mjs */
import { createClient } from "next-sanity";

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

const settings = await client.fetch(
  '*[_id=="siteSettings"][0]{behindTheScenes}',
);
const filtered = settings.behindTheScenes.filter((img) => img._key !== "A4");

await client.patch("siteSettings").set({ behindTheScenes: filtered }).commit();
console.log(`removed A4 -- behindTheScenes now has ${filtered.length} photos`);
