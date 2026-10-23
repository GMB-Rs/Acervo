import type { Dictionary } from "./types";

/*
  Português: idioma padrão do diretório. É o mesmo texto que já estava no
  site, agora dentro de um dicionário — o texto das bibliotecas continua
  morando em `src/data/libraries.json`.
*/

export const pt: Dictionary = {
  meta: {
    title: "Acervo - Bibliotecas para web",
    template: "%s - Acervo",
    description:
      "Acervo: catálogo curado de bibliotecas para web — UI kits, formulários, tabelas, gráficos, ícones, editores e utilitários. Filtre por framework, categoria e licença.",
    keywords: [
      "bibliotecas para web",
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
    stars: "Estrelas no GitHub: {n}",
    language: "Idioma",
    contributors: "Contribuidores",
  },
  contributors: {
    title: "Contribuidores",
    intro:
      "O Acervo é open source e feito por gente. Quem entra, ajuda: adicionar uma biblioteca, corrigir uma descrição ou traduzir uma página já conta como contribuição.",
    countOne: "1 pessoa já contribuiu",
    countMany: "{n} pessoas já contribuiram",
    commits: "{n} commits",
    empty: "Ninguém foi registrado ainda — esse é o convite.",
    ctaContribute: "Ver o guia de contribuição",
    ctaIssues: "Abrir uma issue",
    ctaRepo: "Ver o repositório",
  },
  home: {
    title: "As bibliotecas certas para o seu próximo projeto",
    intro:
      "Um acervo curado de {n} bibliotecas para web, de UI kits a validadores, gráficos e utilitários de data. Filtre por framework, categoria e licença.",
  },
  search: {
    placeholder: "Buscar por nome, tag ou necessidade",
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
    smart: "busca por intenção",
    approximate: "aproximados",
    approximateHint:
      "A busca não encontrou todos os termos; estes resultados casam com parte da consulta.",
    showing: "Mostrando {from}–{to} de {total} bibliotecas",
    empty: "Nenhuma biblioteca encontrada",
    emptyWithQuery: "Nenhuma biblioteca encontrada para “{query}”",
    emptyHintMulti:
      "A busca não encontrou todos os termos. Tente remover uma palavra ou descrever o que precisa de forma mais curta.",
    emptyHintSingle:
      "Tente outro termo, uma descrição mais curta ou limpe os filtros aplicados.",
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
    back: "Voltar para o acervo",
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
    cta: "Voltar para o acervo",
  },
  footer: {
    about: "Acervo de bibliotecas para web, mantido pela comunidade.",
    metrics: "estrelas e downloads sincronizados com GitHub e npm",
    explore: "Explorar",
    project: "Projeto",
    acervo: "Acervo",
    contribute: "Como contribuir",
    license: "Licença",
    issues: "Reportar um problema",
    rights: "Código sob licença MIT, feito pela comunidade.",
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
    commercial: "Comercial",
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
