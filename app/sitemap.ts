import type { MetadataRoute } from "next";
import { listPublicProducts } from "@/lib/repo";
import { baseUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = baseUrl();
  return [
    { url, changeFrequency: "daily", priority: 1 },
    ...listPublicProducts().map((p) => ({
      url: `${url}/produto/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
