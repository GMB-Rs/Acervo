import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/libraries";
import { LOCALES } from "@/i18n/config";

const BASE_URL = "https://diretorio.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs();

  const home = LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    changeFrequency: "daily" as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((item) => [item, `/${item}`])),
    },
  }));

  const libraries = LOCALES.flatMap((locale) =>
    slugs.map((slug) => ({
      url: `${BASE_URL}/${locale}/libraries/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((item) => [item, `/${item}/libraries/${slug}`]),
        ),
      },
    }))
  );

  return [...home, ...libraries];
}
