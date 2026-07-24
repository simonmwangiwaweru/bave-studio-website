/* One-time seeder: uploads the rights-cleared images extracted from the scope
   PDF into Sanity and creates the gallery/settings documents around them.
   Run:  SANITY_TOKEN=... node scripts/seed-from-pdf.mjs
   Excluded per the document's own audit: BLOCKED (B4, B9), REJECT (A2, B3,
   B6, B10, C6), social-only (A4), branding-clearance-pending (B5, B8). */
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

// file → audit code + alt text (degraded WhatsApp/PDF copies; replaced by
// originals later — good enough to exercise the full pipeline now)
const images = {
  A1: { file: "p14_img01_606x822.jpeg", alt: "Studio portrait of the photographer with camera strap" },
  B1: { file: "p16_img06_606x404.jpeg", alt: "Attendees reacting during a corporate training session" },
  B2: { file: "p17_img07_606x404.jpeg", alt: "Documentary coverage of a corporate workshop in progress" },
  B7: { file: "p18_img12_606x404.jpeg", alt: "Well-lit professional coverage of a corporate event" },
  C1: { file: "p21_img16_600x900.jpeg", alt: "Smiling attendee in a blue shirt at a business event" },
  C2: { file: "p22_img17_600x900.jpeg", alt: "Candid attendee listening intently at a business seminar" },
  C3: { file: "p23_img18_600x900.jpeg", alt: "Warm direct portrait of a participant at a business event" },
  C4: { file: "p23_img19_606x404.jpeg", alt: "Two colleagues collaborating over a laptop at an event" },
  C5: { file: "p24_img20_600x900.jpeg", alt: "Attendee at work during a business event" },
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

const galleries = [
  {
    _id: "gallery-ai-for-business",
    title: "AI for Business — Event Coverage",
    slug: "ai-for-business",
    subcategory: "Corporate",
    description:
      "Candid coverage of the AI for Business event, May 2026 — genuine reactions, clean light, single-session shoot.",
    date: "2026-05-09",
    order: 1,
    codes: ["C1", "C2", "C3", "C4", "C5"],
  },
  {
    _id: "gallery-regenesys-corporate",
    title: "Regenesys Corporate Event",
    slug: "regenesys-corporate-event",
    subcategory: "Corporate",
    description:
      "Corporate training coverage — layered documentary frames and clean professional light.",
    order: 2,
    codes: ["B1", "B7", "B2"],
  },
];

for (const g of galleries) {
  const imgs = [];
  for (const code of g.codes) imgs.push(await uploadImage(code));
  await client.createOrReplace({
    _id: g._id,
    _type: "gallery",
    title: g.title,
    slug: { _type: "slug", current: g.slug },
    category: "photography",
    subcategory: g.subcategory,
    description: g.description,
    ...(g.date ? { date: g.date } : {}),
    images: imgs,
    featured: true,
    published: true,
    order: g.order,
  });
  console.log(`gallery created: ${g.title}`);
}

// Site settings with the A1 headshot
const headshot = await uploadImage("A1");
await client.createOrReplace({
  _id: "siteSettings",
  _type: "siteSettings",
  phone: "0798 108 543",
  email: "studiobave9@gmail.com",
  headshot: { _type: "image", asset: headshot.asset },
});
console.log("site settings created (headshot, phone, email)");
console.log("\nDone — refresh localhost:3000");
