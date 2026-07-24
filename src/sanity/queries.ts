import { client } from "./client";
import { sanityConfigured } from "./env";

/* Every fetcher returns empty data until a Sanity project is connected,
   so pages render their placeholder state instead of erroring. */

export type GalleryImage = {
  asset: { _ref: string };
  alt?: string;
};

export type Gallery = {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  subcategory?: string;
  images?: GalleryImage[];
  videoUrl?: string;
  client?: string;
  description?: string;
};

export type Testimonial = {
  _id: string;
  quote: string;
  author: string;
  organisation?: string;
};

export type CaseStudy = {
  _id: string;
  title: string;
  eventType?: string;
  brief?: string;
  delivered?: string;
  recordingUrl?: string;
  viewership?: string;
  coverImage?: GalleryImage;
};

export type SiteSettings = {
  showreelUrl?: string;
  aboutBio?: string;
  headshot?: GalleryImage;
  phone?: string;
  email?: string;
  whatsapp?: string;
  socialLinks?: string[];
};

const galleryFields = `
  _id, title, slug, category, subcategory, videoUrl, client, description,
  images[]{ asset, alt }
`;

export async function getFeaturedImages(): Promise<
  { image: GalleryImage; galleryTitle: string }[]
> {
  if (!sanityConfigured) return [];
  const galleries = await client.fetch<Gallery[]>(
    `*[_type == "gallery" && featured == true && published == true]
      | order(order asc) { ${galleryFields} }`,
  );
  return galleries.flatMap((g) =>
    (g.images ?? []).slice(0, 2).map((image) => ({
      image,
      galleryTitle: g.title,
    })),
  );
}

export async function getGalleries(category: string): Promise<Gallery[]> {
  if (!sanityConfigured) return [];
  return client.fetch(
    `*[_type == "gallery" && category == $category && published == true]
      | order(order asc) { ${galleryFields} }`,
    { category },
  );
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!sanityConfigured) return [];
  return client.fetch(
    `*[_type == "testimonial" && published == true]{
      _id, quote, author, organisation
    }`,
  );
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  if (!sanityConfigured) return [];
  return client.fetch(
    `*[_type == "caseStudy" && published == true]{
      _id, title, eventType, brief, delivered, recordingUrl, viewership,
      coverImage{ asset, alt }
    }`,
  );
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!sanityConfigured) return null;
  return client.fetch(
    `*[_type == "siteSettings"][0]{
      showreelUrl, aboutBio, headshot, phone, email, whatsapp, socialLinks
    }`,
  );
}

/* Turns a raw profile URL into a friendly label for display. */
export function labelForSocialUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("instagram")) return "Instagram";
    if (host.includes("facebook")) return "Facebook";
    if (host.includes("tiktok")) return "TikTok";
    if (host.includes("youtube")) return "YouTube";
    if (host.includes("linkedin")) return "LinkedIn";
    if (host.includes("x.com") || host.includes("twitter")) return "X";
    return host;
  } catch {
    return "Link";
  }
}

/* Parses a pasted YouTube/Vimeo URL into what LiteVideoEmbed needs. */
export function parseVideoUrl(
  url: string,
): { provider: "youtube" | "vimeo"; videoId: string } | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (yt) return { provider: "youtube", videoId: yt[1] };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { provider: "vimeo", videoId: vimeo[1] };
  return null;
}
