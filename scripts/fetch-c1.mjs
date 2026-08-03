import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { writeFileSync } from "fs";

const client = createClient({ projectId: "mg7nrrn9", dataset: "production", apiVersion: "2026-07-01", useCdn: false });
const builder = createImageUrlBuilder(client);

const gallery = await client.fetch('*[_id=="gallery-ai-for-business"][0]{images}');
const c1 = gallery.images[0];
const url = builder.image(c1).width(2000).url();
console.log("URL:", url);

const res = await fetch(url);
const buf = Buffer.from(await res.arrayBuffer());
writeFileSync("H:/BERRY PORTFOLIO WEBSITE/smiling-guy-C1.jpg", buf);
console.log("saved to H:/BERRY PORTFOLIO WEBSITE/smiling-guy-C1.jpg");
