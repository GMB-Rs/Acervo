import type { Category, Framework } from "@/types/library";
import type { LicenseFamily } from "@/lib/license";
import type { Locale } from "@/i18n/config";

/*
  Um dicionário por idioma. O tipo é o mesmo para todos: o português é a
  fonte (o texto vive em `src/data/libraries.json`) e o inglês traz a
  tradução em `src/data/translations/en.json`.

  O dicionário é **só dado** — nenhuma função — para poder atravessar a
  fronteira servidor/cliente. Números entram por placeholder: "Estrelas no
  GitHub: {n}".
*/

export type Dictionary = {
  meta: {
    title: string;
    template: string;
    description: string;
    keywords: string[];
  };
  nav: {
    /** Contador de estrelas do repositório: "Estrelas no GitHub: {n}". */
    stars: string;
    language: string;
    /** Link da navbar para a página de contribuidores. */
    contributors: string;
  };
  contributors: {
    title: string;
    intro: string;
    /** "1 pessoa já contribuiu" / "{n} pessoas já contribuiram". */
    countOne: string;
    countMany: string;
    /** "{n} commits". */
    commits: string;
    empty: string;
    joinTitle: string;
    joinText: string;
    /** Passos para contribuir (título + texto). */
    steps: Array<{ title: string; text: string }>;
    ctaContribute: string;
    ctaIssues: string;
    ctaRepo: string;
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
    /** Título da coluna de links do rodapé. */
    explore: string;
    /** Título da coluna de links do projeto. */
    project: string;
    gallery: string;
    contribute: string;
    license: string;
    issues: string;
    rights: string;
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
