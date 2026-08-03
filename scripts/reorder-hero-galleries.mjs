/* Puts "AI for Business" first among featured galleries so its first
   image (C1, the smiling-attendee shot the client wants leading the
   homepage slideshow) is first in the hero carousel.
   Run:  SANITY_TOKEN=... node scripts/reorder-hero-galleries.mjs */
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

await client.patch("gallery-ai-for-business").set({ order: 0 }).commit();
await client.patch("gallery-wedding-day-coverage").set({ order: 1 }).commit();
await client.patch("gallery-regenesys-corporate").set({ order: 2 }).commit();

console.log("Reordered: AI for Business (0) -> Wedding Day Coverage (1) -> Regenesys (2)");
