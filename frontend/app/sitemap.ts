import type { MetadataRoute } from "next";

const publicPaths = [
  "/",
  "/about",
  "/corporate",
  "/links",
  "/programmes/software-engineering",
  "/programmes/applied-ai",
  "/programmes/basic-computer-knowledge",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!siteUrl) return [];

  return publicPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/programmes/") ? 0.8 : 0.6,
  }));
}
