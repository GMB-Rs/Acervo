import type { Category, Framework } from "@/types/library";
import type { LicenseFamily } from "@/lib/license";
import type { Locale } from "@/i18n/config";

/*
  Um dicionário por idioma. O tipo é o mesmo para todos: o português é a
  fonte (o texto vive em `src/data/libraries.json`) e o inglês traz a
  tradução em `src/data/translations/en.json`.

  O dicionário é **só dado** — nenhuma função — para poder atravessar a
  fronteira servidor/cliente. Números entram por placeholder: "{n} libs".
*/

export type Dictionary = {
  meta: {
    title: string;
    template: string;
    description: string;
    keywords: string[];
  };
  nav: {
    /** Contador da navbar: "{n} libs". */
    libs: string;
    language: string;
  };
  home: {
    title: string;
    /** Intro: "Galeria de {n} bibliotecas que já existem: ...". */
    intro: string;
  };
  search: {
    placeholder: string;
    label: string;
    clear: string;
  };
  filters: {
    category: string;
    license: string;
    sort: string;
    select: string;
    allCategories: string;
    allLicenses: string;
    all: string;
    clearAll: string;
  };
  sorts: {
    popular: string;
    az: string;
    za: string;
    recent: string;
  };
  results: {
    /** Contador de resultados: um plural e o singular. */
    countOne: string;
    countMany: string;
    byRelevance: string;
    showing: string;
    empty: string;
    emptyWithQuery: string;
    emptyHintMulti: string;
    emptyHintSingle: string;
  };
  pagination: {
    label: string;
    previous: string;
    next: string;
    page: string;
  };
  card: {
    /** "{count} estrelas". */
    stars: string;
  };
  detail: {
    back: string;
    framework: string;
    category: string;
    status: string;
    maintained: string;
    lowActivity: string;
    docs: string;
    github: string;
    stars: string;
    downloads: string;
    license: string;
    since: string;
    highlight: string;
    tags: string;
    related: string;
    relatedHint: string;
    metricsNote: string;
  };
  notFound: {
    code: string;
    title: string;
    text: string;
    cta: string;
  };
  footer: {
    about: string;
    metrics: string;
  };
  theme: {
    toLight: string;
    toDark: string;
  };
  license: {
    families: Record<LicenseFamily, string>;
    commercial: string;
    undeclared: string;
  };
  frameworkLabels: Record<Framework, string>;
  categoryLabels: Record<Category, string>;
  languages: Record<Locale, string>;
};
