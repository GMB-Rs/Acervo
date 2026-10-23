import type { Dictionary } from "./types";

/*
  English dictionary. The library descriptions and highlights live in
  `src/data/translations/en.json` (the Portuguese text stays in
  `src/data/libraries.json`).
*/

export const en: Dictionary = {
  meta: {
    title: "Acervo - Libraries for the web",
    template: "%s - Acervo",
    description:
      "Acervo: a curated catalog of libraries for the web — UI kits, forms, tables, charts, icons, editors and utilities. Filter by framework, category and license.",
    keywords: [
      "web libraries",
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
    stars: "GitHub stars: {n}",
    language: "Language",
    contributors: "Contributors",
  },
  contributors: {
    title: "Contributors",
    intro:
      "Acervo is open source and made by people. Joining in is easy: adding a library, fixing a description or translating a page all count as a contribution.",
    countOne: "1 person has contributed",
    countMany: "{n} people have contributed",
    commits: "{n} commits",
    empty: "Nobody has been credited yet — that is an open invitation.",
    ctaContribute: "Read the contributing guide",
    ctaIssues: "Open an issue",
    ctaRepo: "See the repository",
  },
  home: {
    title: "The right libraries for your next project",
    intro:
      "A curated collection of {n} libraries for the web, from UI kits to validators, charts and date utilities. Filter by framework, category and license.",
  },
  search: {
    placeholder: "Search by name, tag or need",
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
    smart: "intent search",
    approximate: "approximate",
    approximateHint:
      "The search couldn't match every term; these results match part of your query.",
    showing: "Showing {from}–{to} of {total} libraries",
    empty: "No libraries found",
    emptyWithQuery: "No libraries found for “{query}”",
    emptyHintMulti:
      "The search couldn't match every term. Try removing a word or describing what you need more briefly.",
    emptyHintSingle:
      "Try another term, a shorter description or clear the applied filters.",
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
    back: "Back to Acervo",
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
    cta: "Back to Acervo",
  },
  footer: {
    about: "Acervo, a community-maintained collection of libraries for the web.",
    metrics: "stars and downloads synced from GitHub and npm",
    explore: "Explore",
    project: "Project",
    acervo: "Acervo",
    contribute: "How to contribute",
    license: "License",
    issues: "Report an issue",
    rights: "Code under the MIT license, built by the community.",
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
    commercial: "Commercial",
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
