import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { localizeLibrary } from "@/i18n/library-text";
import { getBaseUrl } from "@/lib/site";
import {
  CATEGORIES,
  FRAMEWORKS,
  type Category,
  type Framework,
  type Library,
} from "@/types/library";
import {
  LICENSE_FAMILIES,
  licenseFamily,
  type LicenseFamily,
} from "@/lib/license";
import {
  queryFacetLabels,
  searchCatalog,
  type SearchLabels,
} from "@/lib/search";
import { getLibraryBySlug, libraries } from "@/lib/libraries";

/*
  Representação pública do catálogo.

  É a mesma forma usada por:
  - `/api/libraries` e `/api/libraries/[slug]`;
  - `llms.txt` / `llms-full.txt`;
  - o servidor MCP e o recomendador de stack.

  Nada aqui é gerado por IA: os campos vêm do JSON curado e das traduções.
  A camada de IA (MCP/LLM) consome este contrato.
*/

export type CatalogEntry = {
  slug: string;
  name: string;
  description: string;
  highlight: string;
  framework: Framework;
  category: Category;
  license: string;
  licenseFamily: LicenseFamily;
  tags: string[];
  website: string;
  docs?: string;
  repo?: string;
  npmPackage?: string;
  stars?: number;
  npmDownloads?: number;
  maintained: boolean;
  since: number;
  featured: boolean;
  /** Página da biblioteca no Acervo. */
  url: string;
  repoUrl?: string;
  npmUrl?: string;
};

export type CatalogQueryOptions = {
  locale: Locale;
  query?: string;
  framework?: string;
  category?: string;
  license?: string;
  limit?: number;
  offset?: number;
};

export type CatalogQueryResult = {
  total: number;
  count: number;
  offset: number;
  limit: number;
  relaxed: boolean;
  smart: boolean;
  facets: string[];
  items: CatalogEntry[];
};

const FRAMEWORK_SET = new Set<string>(FRAMEWORKS);
const CATEGORY_SET = new Set<string>(CATEGORIES);
const LICENSE_SET = new Set<string>(LICENSE_FAMILIES);

function repoUrl(repo?: string): string | undefined {
  return repo ? `https://github.com/${repo}` : undefined;
}

function npmUrl(pkg?: string): string | undefined {
  return pkg ? `https://www.npmjs.com/package/${pkg}` : undefined;
}

function entryFromLocalized(
  library: Library,
  locale: Locale,
): CatalogEntry {
  const base = getBaseUrl();

  return {
    slug: library.slug,
    name: library.name,
    description: library.description,
    highlight: library.highlight,
    framework: library.framework,
    category: library.category,
    license: library.license,
    licenseFamily: licenseFamily(library.license),
    tags: library.tags,
    website: library.website,
    docs: library.docs,
    repo: library.repo,
    npmPackage: library.npmPackage,
    stars: library.stars,
    npmDownloads: library.npmDownloads,
    maintained: library.maintained,
    since: library.since,
    featured: Boolean(library.featured),
    url: `${base}/${locale}/libraries/${library.slug}`,
    repoUrl: repoUrl(library.repo),
    npmUrl: npmUrl(library.npmPackage),
  };
}

export function catalogEntry(
  locale: Locale,
  library: Library,
): CatalogEntry {
  return entryFromLocalized(localizeLibrary(locale, library), locale);
}

export function getCatalogEntry(
  locale: Locale,
  slug: string,
): CatalogEntry | undefined {
  const library = getLibraryBySlug(slug);
  return library ? catalogEntry(locale, library) : undefined;
}

export function catalogEntries(locale: Locale): CatalogEntry[] {
  return libraries.map((library) => catalogEntry(locale, library));
}

export function searchLabelsFor(locale: Locale): SearchLabels {
  const dict = getDictionary(locale);
  return {
    framework: dict.frameworkLabels,
    category: dict.categoryLabels,
    license: dict.license.families,
  };
}

function normalizeLimit(value: number | undefined): number {
  if (!Number.isFinite(value) || !value || value <= 0) return 50;
  return Math.min(Math.floor(value), 200);
}

function normalizeOffset(value: number | undefined): number {
  if (!Number.isFinite(value) || !value || value <= 0) return 0;
  return Math.floor(value);
}

/**
 * Consulta o catálogo com busca por intenção + filtros. É a função que
 * alimenta a API pública e o `llms.txt`.
 */
export function queryCatalog(options: CatalogQueryOptions): CatalogQueryResult {
  const locale = options.locale;
  const labels = searchLabelsFor(locale);
  const framework = options.framework?.trim();
  const category = options.category?.trim();
  const license = options.license?.trim();
  const limit = normalizeLimit(options.limit);
  const offset = normalizeOffset(options.offset);

  const filtered = libraries.filter((library) => {
    if (framework && FRAMEWORK_SET.has(framework)) {
      if (library.framework !== framework) return false;
    }
    if (category && CATEGORY_SET.has(category)) {
      if (library.category !== category) return false;
    }
    if (license && LICENSE_SET.has(license)) {
      if (licenseFamily(library.license) !== license) return false;
    }
    return true;
  });

  const localized = filtered.map((library) =>
    localizeLibrary(locale, library),
  );
  const result = searchCatalog(localized, options.query ?? "", labels);
  const entries = result.results.map((item) =>
    entryFromLocalized(item.library, locale),
  );

  return {
    total: entries.length,
    count: entries.slice(offset, offset + limit).length,
    offset,
    limit,
    relaxed: result.relaxed,
    smart: result.query.smart,
    facets: queryFacetLabels(result.query, labels),
    items: entries.slice(offset, offset + limit),
  };
}

/** Cabeçalhos CORS para a API pública (somente leitura). */
export const PUBLIC_API_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control":
    "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
} as const;
