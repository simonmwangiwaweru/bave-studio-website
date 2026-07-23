import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

/* All site images flow through this: Sanity's pipeline handles resizing,
   format negotiation (WebP/AVIF) and CDN delivery automatically. */
export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source).auto("format");
}
