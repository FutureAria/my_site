import fs from "fs";
import path from "path";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const raw = fs.readFileSync(path.join(process.cwd(), "data", "portfolio.json"), "utf-8");
  const data = JSON.parse(raw);

  const baseUrl = "https://juyoung-portfolio.duckdns.org";

  const projectRoutes: MetadataRoute.Sitemap = (data.projects || []).map(
    (_: unknown, i: number) => ({
      url: `${baseUrl}/projects/${i}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  const blogRoutes: MetadataRoute.Sitemap = (data.blog || []).map(
    (_: unknown, i: number) => ({
      url: `${baseUrl}/blog/${i}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectRoutes,
    ...blogRoutes,
  ];
}
