import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

const client = createClient({
  projectId: "mg7nrrn9",
  dataset: "production",
  apiVersion: "2026-07-01",
  useCdn: false,
});
const builder = createImageUrlBuilder(client);

const settings = await client.fetch(
  '*[_id=="siteSettings"][0]{behindTheScenes}',
);
settings.behindTheScenes.forEach((img) => {
  console.log(img._key, "|", img.alt, "|", builder.image(img).width(300).url());
});
