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

const socialLinks = [
  "https://www.facebook.com/profile.php?id=61592669317843",
  "https://www.instagram.com/berryironside/",
  "https://vt.tiktok.com/ZS4PwBBj3/",
  "https://www.youtube.com/@BAVEStudio",
];

await client.patch("siteSettings").set({ socialLinks }).commit();
console.log("socialLinks set:", socialLinks);
