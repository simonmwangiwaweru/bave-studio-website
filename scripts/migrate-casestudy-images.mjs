/* Migrates caseStudy.coverImage (old, single-image field) into the new
   caseStudy.images array, and adds the one photo from the Aug 3 batch that
   got missed the first time ("live stream2.jpg" -- a second angle from the
   same conference as "live stream 3.jpg", never uploaded because the old
   schema only allowed one image per case study).
   Run:  SANITY_TOKEN=... node scripts/migrate-casestudy-images.mjs */
import { createClient } from "next-sanity";
import { readFileSync } from "fs";

const SRC_DIR = "H:/BERRY PORTFOLIO WEBSITE";

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

const docs = await client.fetch(
  '*[_type=="caseStudy"]{_id, title, coverImage}',
);

for (const doc of docs) {
  if (!doc.coverImage) continue;
  await client
    .patch(doc._id)
    .set({
      images: [
        {
          _type: "image",
          _key: "cover",
          asset: doc.coverImage.asset,
          alt: doc.coverImage.alt,
        },
      ],
    })
    .unset(["coverImage"])
    .commit();
  console.log(`migrated coverImage -> images for: ${doc.title}`);
}

// Upload the missed photo and append it to Corporate Conference Coverage
const buf = readFileSync(`${SRC_DIR}/live stream2.jpg`);
const asset = await client.assets.upload("image", buf, {
  filename: "corporate-conference-2.jpg",
});
console.log(`uploaded live stream2.jpg -> ${asset._id}`);

await client
  .patch("casestudy-corporate-conference")
  .append("images", [
    {
      _type: "image",
      _key: "cover2",
      asset: { _type: "reference", _ref: asset._id },
      alt: "Camera operator filming a presentation at a corporate conference, viewfinder showing the stage",
    },
  ])
  .commit();
console.log("appended second image to Corporate Conference Coverage");
