import { HTML_LANG, type Locale } from "@/i18n/config";
import { libraryText, translateTags } from "@/i18n/library-text";
import { getBaseUrl } from "@/lib/site";
import type { Library } from "@/types/library";
import { libraries } from "@/lib/libraries";

/*
  Dados estruturados (JSON-LD) para buscadores e agentes.

  O Google lê o `SoftwareApplication` da ficha e o `ItemList` da home; LLMs
  costumam usar os mesmos campos para entender que o Acervo é um catálogo,
  não uma lista solta de links.
*/

export function websiteJsonLd(
  locale: Locale,
  description: string,
): Record<string, unknown> {
  const base = getBaseUrl();
  const home = `${base}/${locale}`;
  const websiteId = `${base}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "Acervo",
        url: home,
        description,
        inLanguage: HTML_LANG[locale],
      },
      {
        "@type": "CollectionPage",
        "@id": `${home}#catalog`,
        name: "Bibliotecas para web",
        url: home,
        isPartOf: { "@id": websiteId },
        inLanguage: HTML_LANG[locale],
      },
      {
        "@type": "ItemList",
        "@id": `${home}#libraries`,
        name: "Bibliotecas para web",
        numberOfItems: libraries.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: libraries.map((library, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${base}/${locale}/libraries/${library.slug}`,
          name: library.name,
        })),
      },
    ],
  };
}

export function libraryJsonLd(
  locale: Locale,
  library: Library,
): Record<string, unknown> {
  const base = getBaseUrl();
  const text = libraryText(locale, library);
  const pageUrl = `${base}/${locale}/libraries/${library.slug}`;
  const sameAs = [
    library.website,
    library.repo ? `https://github.com/${library.repo}` : undefined,
    library.docs,
  ].filter((value): value is string => Boolean(value));

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: library.name,
    description: text.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: pageUrl,
    sameAs,
    keywords: translateTags(locale, library.tags).join(", "),
    license: library.license,
    inLanguage: HTML_LANG[locale],
    isPartOf: {
      "@type": "WebSite",
      name: "Acervo",
      url: `${base}/${locale}`,
    },
  };
}
