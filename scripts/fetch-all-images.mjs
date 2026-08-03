/* Downloads every image currently live on the site back to the project
   folder, with descriptive filenames, so the client can edit any of
   them the same way as the C1 "smiling guy" photo.
   Run:  node scripts/fetch-all-images.mjs */
import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { writeFileSync, mkdirSync } from "fs";

const client = createClient({
  projectId: "mg7nrrn9",
  dataset: "production",
  apiVersion: "2026-07-01",
  useCdn: false,
});
const builder = createImageUrlBuilder(client);

const OUT_DIR = "H:/BERRY PORTFOLIO WEBSITE/photos-for-editing";
mkdirSync(OUT_DIR, { recursive: true });

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function download(image, name) {
  const url = builder.image(image).width(2000).url();
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = url.includes(".png") ? "png" : "jpg";
  const filename = `${name}.${ext}`;
  writeFileSync(`${OUT_DIR}/${filename}`, buf);
  console.log(`saved ${filename}`);
}

const galleries = await client.fetch(
  '*[_type=="gallery"]{title, images}',
);
for (const g of galleries) {
  const gslug = slugify(g.title);
  for (const img of g.images ?? []) {
    await download(img, `${gslug}--${img._key}`);
  }
}

const settings = await client.fetch(
  '*[_type=="siteSettings"][0]{headshot, behindTheScenes}',
);
if (settings?.headshot) await download(settings.headshot, "settings--headshot");
for (const [i, img] of (settings?.behindTheScenes ?? []).entries()) {
  await download(img, `settings--behind-the-scenes-${i + 1}`);
}

const caseStudies = await client.fetch('*[_type=="caseStudy"]{title, images}');
for (const cs of caseStudies) {
  const cslug = slugify(cs.title);
  for (const [i, img] of (cs.images ?? []).entries()) {
    await download(img, `casestudy-${cslug}--${i + 1}`);
  }
}

console.log(`\nDone — everything saved into ${OUT_DIR}`);
