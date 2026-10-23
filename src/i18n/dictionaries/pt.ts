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
    stack: "Montar stack",
    ai: "IA",
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
  stack: {
    metaTitle: "Montar stack",
    metaDescription:
      "Monte uma stack de bibliotecas para web por tipo de projeto, framework e necessidades. Escolhas determinísticas, sem chave de API.",
    title: "Monte a stack do seu próximo projeto",
    intro:
      "Escolha o tipo de projeto, o framework e o que você precisa. O Acervo cruza categorias, tags, licença e compatibilidade para sugerir uma biblioteca por necessidade — sem IA generativa e sem chave.",
    form: {
      goal: "Tipo de projeto",
      framework: "Framework",
      needs: "Necessidades",
      needsHint: "Marque tudo o que o projeto precisa.",
      license: "Licença",
      openSource: "Somente licença aberta",
      openSourceHint:
        "Remove opções comerciais, como Handsontable e GSAP.",
      anyFramework: "Tanto faz",
      reset: "Limpar seleção",
    },
    goals: {
      dashboard: "Dashboard / painel interno",
      site: "Site institucional / landing page",
      ecommerce: "Loja / e-commerce",
      forms: "Aplicação com muitos formulários",
      docs: "Documentação / conteúdo",
      app: "App mobile / universal",
    },
    needs: {
      ui: "UI kit",
      forms: "Formulários",
      tables: "Tabelas",
      charts: "Gráficos",
      icons: "Ícones",
      animation: "Animação",
      editor: "Editor de texto",
      dates: "Datas",
      validation: "Validação",
      drag: "Arrastar e soltar",
      i18n: "Internacionalização",
      accessibility: "Acessibilidade",
    },
    results: {
      title: "Stack sugerida",
      intro:
        "Uma escolha por necessidade, com alternativas. A ordem e as notas são determinísticas.",
      countOne: "1 escolha",
      countMany: "{n} escolhas",
      empty: "Nenhuma escolha para esses filtros",
      emptyHint:
        "Marque menos necessidades, troque o framework ou desmarque “somente licença aberta”.",
      alternatives: "Alternativas",
      view: "Ver ficha",
      reasonCategory: "categoria {category}",
      reasonTags: "tags {tags}",
      reasonUniversal: "funciona em qualquer stack",
      reasonFeatured: "destaque do catálogo",
      copy: "Copiar stack em Markdown",
      copied: "copiado",
      noteMissing: "Não encontramos uma opção para {need} com esses filtros.",
      noteLicense:
        "As opções de {need} são comerciais. Desmarque “somente licença aberta” para vê-las.",
    },
  },
  ai: {
    metaTitle: "IA sem chave",
    metaDescription:
      "Catálogo, API JSON, llms.txt, JSON-LD, busca por intenção, recomendador de stack e servidor MCP. Tudo sem chave de API.",
    title: "IA sem chave",
    intro:
      "O Acervo foi feito para ser lido por pessoas e por agentes. As superfícies abaixo são determinísticas e funcionam sem chave, sem cadastro e sem LLM pago.",
    catalogTitle: "Catálogo para agentes",
    catalogText:
      "Texto e JSON no mesmo contrato do site. Use o índice enxuto para descoberta e o catálogo completo para fichas.",
    llms: "Índice enxuto: título, resumo, links e uma linha por biblioteca.",
    llmsFull:
      "Fichas completas: descrição, destaque, tags, licença, links e métricas.",
    api: "API JSON pública. Busca por intenção, filtros e paginação.",
    apiDetail: "Ficha individual por slug, com o mesmo formato.",
    apiExample:
      "Exemplo: /api/libraries?q=tabela%20edit%C3%A1vel&framework=react&license=mit&limit=5",
    jsonLd:
      "As páginas trazem JSON-LD (WebSite, ItemList e SoftwareApplication) para buscadores e agentes.",
    searchTitle: "Busca por intenção",
    searchText:
      "A busca remove palavras vazias, entende sinônimos e frases, trata framework, categoria e licença como filtros e tolera erro de digitação. Tudo no navegador, sem chamada externa.",
    stackTitle: "Recomendador de stack",
    stackText:
      "Escolha o tipo de projeto, o framework e as necessidades. O Acervo devolve uma biblioteca por necessidade, com alternativas e justificativa determinística.",
    stackCta: "Montar uma stack",
    mcpTitle: "Servidor MCP local",
    mcpText:
      "Conecte o catálogo ao Claude Desktop, Cursor ou VS Code. O servidor roda via stdio no seu computador, lê o JSON do repositório e não envia nada para fora.",
    mcpCommand: "No repositório, rode:",
    mcpConfig: "Configuração (Claude Desktop / Cursor):",
    mcpTools: "Ferramentas:",
    mcpToolSearch: "busca por intenção com filtros.",
    mcpToolLibrary: "ficha completa por slug.",
    mcpToolStack: "stack determinística por objetivo.",
    mcpResources:
      "Recursos: acervo://libraries/pt, acervo://libraries/en, acervo://llms/pt e acervo://llms/en.",
    privacyTitle: "Privacidade e limites",
    privacyText:
      "Nenhuma superfície exige chave ou envia sua consulta para um LLM. O catálogo é curado; as métricas podem estar defasadas e a recomendação é uma sugestão, não um benchmark.",
    limitsTitle: "O que não é",
    limitsText:
      "Não é um chatbot, não gera descrições e não inventa bibliotecas. Se algo não está no catálogo, a resposta honesta é que não está.",
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
