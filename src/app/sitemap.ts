import type { MetadataRoute } from "next";

const BASE = "https://bavestudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/work",
    "/photography",
    "/videography",
    "/live-streaming",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
