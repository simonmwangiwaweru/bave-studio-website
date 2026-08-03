import { createClient } from "next-sanity";
const client = createClient({
  projectId: "mg7nrrn9",
  dataset: "production",
  apiVersion: "2026-07-01",
  useCdn: false,
});
const g = await client.fetch(
  '*[_type=="gallery" && featured==true]{title, order, "firstImgAlt": images[0].alt} | order(order asc)',
);
console.log(JSON.stringify(g, null, 2));
