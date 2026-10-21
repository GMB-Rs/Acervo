import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/libraries";

const BASE_URL = "https://diretorio.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const libraries = getAllSlugs().map((slug) => ({
    url: `${BASE_URL}/libraries/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...libraries,
  ];
}
