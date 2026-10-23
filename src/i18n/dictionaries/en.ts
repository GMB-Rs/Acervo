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
    stack: "Build a stack",
    ai: "AI",
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
  stack: {
    metaTitle: "Build a stack",
    metaDescription:
      "Build a stack of web libraries by project type, framework and needs. Deterministic picks, no API key.",
    title: "Build the stack for your next project",
    intro:
      "Choose the project type, framework and what you need. Acervo crosses categories, tags, license and compatibility to suggest one library per need — no generative AI and no key.",
    form: {
      goal: "Project type",
      framework: "Framework",
      needs: "Needs",
      needsHint: "Select everything the project needs.",
      license: "License",
      openSource: "Open source only",
      openSourceHint:
        "Removes commercial options such as Handsontable and GSAP.",
      anyFramework: "Any",
      reset: "Clear selection",
    },
    goals: {
      dashboard: "Dashboard / internal panel",
      site: "Marketing site / landing page",
      ecommerce: "Store / e-commerce",
      forms: "Form-heavy application",
      docs: "Documentation / content",
      app: "Mobile / universal app",
    },
    needs: {
      ui: "UI kit",
      forms: "Forms",
      tables: "Tables",
      charts: "Charts",
      icons: "Icons",
      animation: "Animation",
      editor: "Rich text editor",
      dates: "Dates",
      validation: "Validation",
      drag: "Drag and drop",
      i18n: "Internationalization",
      accessibility: "Accessibility",
    },
    results: {
      title: "Suggested stack",
      intro:
        "One pick per need, with alternatives. Order and notes are deterministic.",
      countOne: "1 pick",
      countMany: "{n} picks",
      empty: "No picks for these filters",
      emptyHint:
        "Select fewer needs, change the framework or uncheck “open source only”.",
      alternatives: "Alternatives",
      view: "View details",
      reasonCategory: "category {category}",
      reasonTags: "tags {tags}",
      reasonUniversal: "works with any stack",
      reasonFeatured: "catalog highlight",
      copy: "Copy stack as Markdown",
      copied: "copied",
      noteMissing: "No option for {need} with these filters.",
      noteLicense:
        "{need} options are commercial. Uncheck “open source only” to see them.",
    },
  },
  ai: {
    metaTitle: "AI without a key",
    metaDescription:
      "Catalog, JSON API, llms.txt, JSON-LD, intent search, stack recommender and MCP server. No API key required.",
    title: "AI without a key",
    intro:
      "Acervo is built to be read by people and agents. The surfaces below are deterministic and work without a key, sign-up or paid LLM.",
    catalogTitle: "Catalog for agents",
    catalogText:
      "Text and JSON follow the same contract as the site. Use the concise index for discovery and the full catalog for details.",
    llms: "Concise index: title, summary, links and one line per library.",
    llmsFull:
      "Full entries: description, highlight, tags, license, links and metrics.",
    api: "Public JSON API. Intent search, filters and pagination.",
    apiDetail: "Individual entry by slug, same shape.",
    apiExample:
      "Example: /api/libraries?q=editable%20table&framework=react&license=mit&limit=5",
    jsonLd:
      "Pages include JSON-LD (WebSite, ItemList and SoftwareApplication) for search engines and agents.",
    searchTitle: "Intent search",
    searchText:
      "Search removes stopwords, understands synonyms and phrases, treats framework, category and license as filters and tolerates typos. All in the browser, with no external call.",
    stackTitle: "Stack recommender",
    stackText:
      "Choose the project type, framework and needs. Acervo returns one library per need, with alternatives and a deterministic rationale.",
    stackCta: "Build a stack",
    mcpTitle: "Local MCP server",
    mcpText:
      "Connect the catalog to Claude Desktop, Cursor or VS Code. The server runs over stdio on your machine, reads the repository JSON and sends nothing outside.",
    mcpCommand: "In the repository, run:",
    mcpConfig: "Configuration (Claude Desktop / Cursor):",
    mcpTools: "Tools:",
    mcpToolSearch: "intent search with filters.",
    mcpToolLibrary: "full entry by slug.",
    mcpToolStack: "deterministic stack by goal.",
    mcpResources:
      "Resources: acervo://libraries/pt, acervo://libraries/en, acervo://llms/pt and acervo://llms/en.",
    privacyTitle: "Privacy and limits",
    privacyText:
      "No surface requires a key or sends your query to an LLM. The catalog is curated; metrics may be stale and a recommendation is a suggestion, not a benchmark.",
    limitsTitle: "What it is not",
    limitsText:
      "It is not a chatbot, it does not generate descriptions and it does not invent libraries. If something is not in the catalog, the honest answer is that it is not there.",
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
