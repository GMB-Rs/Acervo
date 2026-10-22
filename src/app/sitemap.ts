import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/libraries";
import { getBaseUrl } from "@/lib/site";
import { LOCALES } from "@/i18n/config";

const BASE_URL = getBaseUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs();

  const home = LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    changeFrequency: "daily" as const,
    priority: 1,
    alternates: {
      /*
        O `hreflang` precisa de URL absoluta — o Google não resolve
        caminho relativo dentro do sitemap.
      */
      languages: Object.fromEntries(
        LOCALES.map((item) => [item, `${BASE_URL}/${item}`]),
      ),
    },
  }));

  const libraries = LOCALES.flatMap((locale) =>
    slugs.map((slug) => ({
      url: `${BASE_URL}/${locale}/libraries/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((item) => [
            item,
            `${BASE_URL}/${item}/libraries/${slug}`,
          ]),
        ),
      },
    }))
  );

  return [...home, ...libraries];
}
