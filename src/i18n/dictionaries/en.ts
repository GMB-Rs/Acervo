import type { Dictionary } from "./types";

/*
  English dictionary. The library descriptions and highlights live in
  `src/data/translations/en.json` (the Portuguese text stays in
  `src/data/libraries.json`).
*/

export const en: Dictionary = {
  meta: {
    title: "Diretório — Web component libraries",
    template: "%s | Diretório",
    description:
      "A curated gallery of web component libraries: React, Vue, Svelte, Angular, Solid, Qwik and Web Components. Compare them, filter by stack and pick the right one.",
    keywords: [
      "component libraries",
      "design system",
      "react",
      "vue",
      "svelte",
      "angular",
      "web components",
      "headless ui",
      "tailwind",
    ],
  },
  nav: {
    libs: "{n} libs",
    language: "Language",
  },
  home: {
    title: "Web component libraries",
    intro:
      "A gallery of {n} libraries that already exist: UI kits, headless, design systems, forms, tables, icons and animations. Filter by framework or category and open each one's page.",
  },
  search: {
    placeholder: "Search by name, tag or description",
    label: "Search libraries",
    clear: "Clear search",
  },
  filters: {
    category: "Filter by category",
    license: "Filter by license",
    sort: "Sort libraries",
    select: "Select",
    allCategories: "All categories ({n})",
    allLicenses: "All licenses ({n})",
    all: "All",
    clearAll: "Clear filters",
  },
  sorts: {
    popular: "Most popular",
    az: "Name (A–Z)",
    za: "Name (Z–A)",
    recent: "Most recent",
  },
  results: {
    countOne: "1 library",
    countMany: "{n} libraries",
    byRelevance: "by relevance",
    showing: "Showing {from}–{to} of {total} libraries",
    empty: "No libraries found",
    emptyWithQuery: "No libraries found for “{query}”",
    emptyHintMulti:
      "The search requires every term: each word has to appear in some field.",
    emptyHintSingle: "Try another term or clear the applied filters.",
  },
  pagination: {
    label: "Pagination",
    previous: "Previous page",
    next: "Next page",
    page: "Page {page}",
  },
  card: {
    stars: "{count} stars",
  },
  detail: {
    back: "Back to the gallery",
    framework: "framework",
    category: "category",
    status: "status",
    maintained: "maintained",
    lowActivity: "low activity",
    docs: "Documentation",
    github: "GitHub",
    stars: "stars",
    downloads: "downloads/mo",
    license: "license",
    since: "since",
    highlight: "Highlight",
    tags: "Tags",
    related: "Related libraries",
    relatedHint: "Alternatives from the same category or stack.",
    metricsNote:
      "GitHub stars: {stars}. Metrics may be out of date — run npm run sync:github to refresh them.",
  },
  notFound: {
    code: "error 404",
    title: "This library does not exist",
    text: "The address may be broken or the library has not been catalogued yet.",
    cta: "Back to the gallery",
  },
  footer: {
    about: "Directory of web component libraries, maintained by the community.",
    metrics: "stars and downloads synced from GitHub and npm",
  },
  theme: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
  },
  license: {
    families: {
      mit: "MIT",
      apache: "Apache-2.0",
      bsd: "BSD-3-Clause",
      comercial: "Commercial",
      outra: "Undeclared",
    },
    commercial: "Commercial (GreenSock Standard)",
    undeclared: "Undeclared",
  },
  frameworkLabels: {
    react: "React",
    vue: "Vue",
    svelte: "Svelte",
    angular: "Angular",
    solid: "Solid",
    qwik: "Qwik",
    "web-components": "Web Components",
    vanilla: "Vanilla JS",
  },
  categoryLabels: {
    "ui-kit": "UI Kit",
    headless: "Headless",
    "design-system": "Design System",
    utility: "Utilities / CSS",
    forms: "Forms",
    data: "Data & Tables",
    icons: "Icons",
    animation: "Animation",
    mobile: "Mobile / Universal",
    web: "Web Components",
  },
  languages: {
    pt: "Português",
    en: "English",
  },
};
