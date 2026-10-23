import type { Dictionary } from "./types";

/*
  English dictionary. The library descriptions and highlights live in
  `src/data/translations/en.json` (the Portuguese text stays in
  `src/data/libraries.json`).
*/

export const en: Dictionary = {
  meta: {
    title: "Acervo - Web component libraries",
    template: "%s | Acervo",
    description:
      "Acervo: a curated gallery of web component libraries — React, Vue, Svelte, Angular, Solid, Qwik and Web Components. Compare them, filter by stack and pick the right one.",
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
    joinTitle: "Want to join in?",
    joinText:
      "You do not need to know React, Next.js or advanced Git. One issue, one translation or one small copy fix already moves Acervo forward.",
    steps: [
      {
        title: "Add a library",
        text: "Open an issue with the library name and repository. We catalog it and the sync takes care of the metrics.",
      },
      {
        title: "Fix what is wrong",
        text: "Outdated description, swapped license, misaligned logo: every pull request is welcome.",
      },
      {
        title: "Polish the wording",
        text: "The site is bilingual. Some pages are missing in Portuguese and English — and every new text needs both.",
      },
    ],
    ctaContribute: "Read the contributing guide",
    ctaIssues: "Open an issue",
    ctaRepo: "See the repository",
  },
  home: {
    title: "Acervo: web component libraries",
    intro:
      "Acervo gathers {n} libraries that already exist: UI kits, headless, design systems, forms, tables, icons and animations. Filter by framework or category and open each one's page.",
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
    about: "Acervo, a curated collection of web component libraries maintained by the community.",
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
