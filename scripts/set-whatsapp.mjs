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

await client.patch("siteSettings").set({ whatsapp: "254798108543" }).commit();
console.log("siteSettings.whatsapp set to 254798108543");
