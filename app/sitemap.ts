import type { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const data = getPortfolioData();

  return [
    "",
    "/about",
    "/projects",
    "/journal",
    "/contact",
    ...data.projects.map((_, index) => `/projects/${index}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
