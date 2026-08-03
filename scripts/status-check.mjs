import { createClient } from "next-sanity";

const client = createClient({
  projectId: "mg7nrrn9",
  dataset: "production",
  apiVersion: "2026-07-01",
  useCdn: false,
});

const galleries = await client.fetch(
  '*[_type=="gallery"]{title, category, subcategory, featured, "imgCount": count(images)} | order(category asc, order asc)',
);
const caseStudies = await client.fetch(
  '*[_type=="caseStudy"]{title, eventType, "hasCover": defined(coverImage)}',
);
const testimonials = await client.fetch('count(*[_type=="testimonial"])');
const settings = await client.fetch(
  '*[_type=="siteSettings"][0]{phone, email, whatsapp, showreelUrl, aboutBio, socialLinks, "hasHeadshot": defined(headshot), "btsCount": count(behindTheScenes)}',
);

console.log("GALLERIES:", JSON.stringify(galleries, null, 2));
console.log("CASE STUDIES:", JSON.stringify(caseStudies, null, 2));
console.log("TESTIMONIALS:", testimonials);
console.log("SETTINGS:", JSON.stringify(settings, null, 2));
