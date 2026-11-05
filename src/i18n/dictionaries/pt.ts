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
    all: "Tudo",
    ai: "IA",
    contributors: "Contribuidores",
  },
  areas: {
    eyebrow: "área do acervo",
    interface: {
      nav: "Interface",
      title: "Interface",
      intro:
        "As {n} bibliotecas de UI kits, componentes headless, design systems, ícones, animação e utilitários de CSS.",
      metaTitle: "Interface: bibliotecas e ferramentas",
      metaDescription:
        "UI kits, componentes headless, design systems, ícones, animação e utilitários de CSS para construir a interface.",
    },
    front: {
      nav: "Front-end",
      title: "Front-end",
      intro:
        "As {n} bibliotecas de formulários, dados, estado, i18n, mobile, web e documentação para montar a aplicação.",
      metaTitle: "Front-end: bibliotecas e ferramentas",
      metaDescription:
        "Formulários, tabelas, estado, internacionalização, mobile, web components e documentação para o front-end.",
    },
    back: {
      nav: "Back-end",
      title: "Back-end",
      intro:
        "As {n} ferramentas de backend, banco, autenticação, segurança, CMS, pagamentos e e-mail para sustentar o produto.",
      metaTitle: "Back-end: bibliotecas e ferramentas",
      metaDescription:
        "Backends, bancos de dados, autenticação, segurança, CMS, pagamentos e e-mail para construir a camada de servidor.",
    },
    devops: {
      nav: "DevOps",
      title: "DevOps",
      intro:
        "As {n} ferramentas de build, qualidade, testes, observabilidade, deploy e analytics para colocar e manter o projeto no ar.",
      metaTitle: "DevOps: bibliotecas e ferramentas",
      metaDescription:
        "Build, lint, testes, observabilidade, deploy e analytics para o ciclo de entrega do projeto.",
    },
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
      "Um acervo curado de {n} bibliotecas e ferramentas para web, de UI kits a validadores, gráficos, utilitários de data e IA — além de {assistants} assistentes de IA. Filtre por framework, categoria e licença.",
  },
  ai: {
    metaTitle: "IA: ferramentas e assistentes",
    metaDescription:
      "Catálogo unificado de ferramentas e assistentes de IA: SDKs, frameworks, componentes de chat, protocolos e chats para conversar, pesquisar e programar.",
    eyebrow: "seção do acervo",
    title: "IA: ferramentas e assistentes",
    intro:
      "{n} recursos de IA em uma única galeria: SDKs de provedores, frameworks de agentes, componentes de chat, protocolos e assistentes.",
    results: {
      countOne: "1 recurso de IA",
      countMany: "{n} recursos de IA",
      showing: "Mostrando {from}–{to} de {total} recursos de IA",
      empty: "Nenhum recurso de IA encontrado",
      emptyWithQuery: "Nenhum recurso de IA encontrado para “{query}”",
    },
    assistantsTitle: "Assistentes de IA",
    assistantsIntro:
      "Os principais chats para conversar, pesquisar, escrever e programar — com link direto para o site oficial.",
  },
  search: {
    placeholder: "Buscar por nome, tag ou necessidade",
    label: "Buscar no acervo",
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
    countOne: "1 recurso",
    countMany: "{n} recursos",
    byRelevance: "por relevância",
    smart: "busca por intenção",
    approximate: "aproximados",
    approximateHint:
      "A busca não encontrou todos os termos; estes resultados casam com parte da consulta.",
    showing: "Mostrando {from}–{to} de {total} recursos",
    empty: "Nenhum recurso encontrado",
    emptyWithQuery: "Nenhum recurso encontrado para “{query}”",
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
    ia: "IA / LLMs",
    state: "Estado",
    testing: "Testes",
    auth: "Autenticação",
    database: "Banco de dados",
    i18n: "Internacionalização",
    build: "Build",
    quality: "Qualidade",
    observability: "Observabilidade",
    security: "Segurança",
    payments: "Pagamentos",
    email: "E-mail",
    cms: "CMS",
    backend: "Backend",
    docs: "Documentação",
    deploy: "Deploy",
    analytics: "Analytics",
  },
  languages: {
    pt: "Português",
    en: "English",
  },
};
