import type { Dictionary } from "./types";

/*
  Português: idioma padrão do diretório. É o mesmo texto que já estava no
  site, agora dentro de um dicionário — o texto das bibliotecas continua
  morando em `src/data/libraries.json`.
*/

export const pt: Dictionary = {
  meta: {
    title: "Acervo — Bibliotecas de componentes web",
    template: "%s | Acervo",
    description:
      "Acervo: galeria curada de bibliotecas de componentes para web — React, Vue, Svelte, Angular, Solid, Qwik e Web Components. Compare, filtre e escolha a stack certa.",
    keywords: [
      "bibliotecas de componentes",
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
    stars: "{n} estrelas no GitHub",
    language: "Idioma",
  },
  home: {
    title: "Acervo: bibliotecas de componentes web",
    intro:
      "O Acervo reúne {n} bibliotecas que já existem: UI kits, headless, design systems, formulários, tabelas, ícones e animações. Filtre por framework ou categoria e abra a ficha de cada uma.",
  },
  search: {
    placeholder: "Buscar nome, tag ou descrição",
    label: "Buscar bibliotecas",
    clear: "Limpar busca",
  },
  filters: {
    category: "Filtrar por categoria",
    license: "Filtrar por licença",
    sort: "Ordenar bibliotecas",
    select: "Selecionar",
    allCategories: "Todas as categorias ({n})",
    allLicenses: "Todas as licenças ({n})",
    all: "Todos",
    clearAll: "Limpar filtros",
  },
  sorts: {
    popular: "Mais populares",
    az: "Nome (A–Z)",
    za: "Nome (Z–A)",
    recent: "Mais recentes",
  },
  results: {
    countOne: "1 biblioteca",
    countMany: "{n} bibliotecas",
    byRelevance: "por relevância",
    showing: "Mostrando {from}–{to} de {total} bibliotecas",
    empty: "Nenhuma biblioteca encontrada",
    emptyWithQuery: "Nenhuma biblioteca encontrada para “{query}”",
    emptyHintMulti:
      "A busca exige todos os termos: cada palavra precisa aparecer em algum campo.",
    emptyHintSingle: "Tente outro termo ou limpe os filtros aplicados.",
  },
  pagination: {
    label: "Paginação",
    previous: "Página anterior",
    next: "Próxima página",
    page: "Página {page}",
  },
  card: {
    stars: "{count} estrelas",
  },
  detail: {
    back: "Voltar para a galeria",
    framework: "framework",
    category: "categoria",
    status: "status",
    maintained: "mantida",
    lowActivity: "pouca atividade",
    docs: "Documentação",
    github: "GitHub",
    stars: "estrelas",
    downloads: "downloads/mês",
    license: "licença",
    since: "desde",
    highlight: "Destaque",
    tags: "Tags",
    related: "Bibliotecas relacionadas",
    relatedHint: "Alternativas da mesma categoria ou stack.",
    metricsNote:
      "estrelas no GitHub: {stars}. Métricas podem estar defasadas, rode npm run sync:github para atualizar.",
  },
  notFound: {
    code: "erro 404",
    title: "Essa biblioteca não existe",
    text: "O endereço pode estar quebrado ou a biblioteca ainda não foi catalogada.",
    cta: "Voltar para a galeria",
  },
  footer: {
    about: "Acervo de bibliotecas de componentes web, mantido pela comunidade.",
    metrics: "estrelas e downloads sincronizados com GitHub e npm",
  },
  theme: {
    toLight: "Alternar para tema claro",
    toDark: "Alternar para tema escuro",
  },
  license: {
    families: {
      mit: "MIT",
      apache: "Apache-2.0",
      bsd: "BSD-3-Clause",
      comercial: "Comercial",
      outra: "Não declarada",
    },
    commercial: "Comercial (GreenSock Standard)",
    undeclared: "Não declarada",
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
    utility: "Utilitários / CSS",
    forms: "Formulários",
    data: "Dados & Tabelas",
    icons: "Ícones",
    animation: "Animação",
    mobile: "Mobile / Universal",
    web: "Web Components",
  },
  languages: {
    pt: "Português",
    en: "English",
  },
};
