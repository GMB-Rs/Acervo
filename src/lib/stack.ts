import { licenseFamily } from "./license.ts";
import { matchesTermPrecise, normalize } from "./search.ts";
import type { Category, Framework, Library } from "../types/library.ts";

/*
  Recomendador determinístico de stack.

  A ideia é responder "o que eu uso para montar X?" sem LLM e sem chave:
  cada necessidade (tabela, gráfico, formulário, ícone...) tem categorias e
  tags no catálogo; a função pontua as bibliotecas compatíveis com o
  framework escolhido, remove comerciais quando o usuário pede open source e
  devolve uma escolha + alternativas. O texto da explicação fica na UI, para
  o módulo continuar puro e testável.
*/

export const STACK_GOALS = [
  "dashboard",
  "site",
  "ecommerce",
  "forms",
  "docs",
  "app",
] as const;

export type StackGoal = (typeof STACK_GOALS)[number];

export const STACK_NEEDS = [
  "ui",
  "forms",
  "tables",
  "charts",
  "icons",
  "animation",
  "editor",
  "dates",
  "validation",
  "drag",
  "i18n",
  "accessibility",
] as const;

export type StackNeed = (typeof STACK_NEEDS)[number];

export type StackFramework = Framework | "any";

export type StackInput = {
  goal: StackGoal;
  framework: StackFramework;
  needs: StackNeed[];
  openSourceOnly: boolean;
};

export type StackPick = {
  need: StackNeed;
  library: Library;
  score: number;
  /** Tags da biblioteca que casaram com a necessidade (já no idioma da tela). */
  matchedTags: string[];
  /** A biblioteca não é do framework escolhido, mas é vanilla/web component. */
  universal: boolean;
  alternatives: Library[];
};

export type StackNote =
  | { kind: "missing"; need: StackNeed }
  | { kind: "license"; need: StackNeed };

export type StackPlan = {
  input: StackInput;
  picks: StackPick[];
  notes: StackNote[];
};

export const DEFAULT_STACK_NEEDS: Record<StackGoal, StackNeed[]> = {
  dashboard: ["ui", "tables", "charts", "icons"],
  site: ["ui", "icons", "animation"],
  ecommerce: ["ui", "forms", "icons"],
  forms: ["forms", "validation", "ui"],
  docs: ["ui", "editor", "icons"],
  app: ["ui", "icons", "forms"],
};

type NeedDefinition = {
  categories: Category[];
  /** Tags em PT e EN: a biblioteca chega localizada, então testamos as duas. */
  tags: string[];
  keywords: string[];
  /** Categorias amplas (ex.: utility) só valem com uma tag específica. */
  tagOnly?: boolean;
  /** Validadores e utilitários não perdem para a versão nativa do framework. */
  frameworkAgnostic?: boolean;
};

const NEEDS: Record<StackNeed, NeedDefinition> = {
  ui: {
    categories: ["ui-kit", "design-system", "headless"],
    tags: [
      "componentes",
      "components",
      "ui",
      "design system",
      "temas",
      "themes",
      "universal",
      "react-native",
      "mobile",
    ],
    keywords: ["componentes", "components", "ui", "design system"],
  },
  forms: {
    categories: ["forms", "headless"],
    tags: ["formulários", "formularios", "forms", "form", "input", "inputs"],
    keywords: ["formulário", "formulario", "form", "input"],
  },
  tables: {
    categories: ["data"],
    tags: ["tabelas", "tables", "data-grid", "datagrid", "planilha", "spreadsheet"],
    keywords: ["tabela", "table", "grid", "planilha"],
  },
  charts: {
    categories: ["data"],
    tags: ["gráficos", "graficos", "charts", "chart", "dataviz", "gráfico"],
    keywords: ["gráfico", "grafico", "chart", "visualização", "visualizacao"],
  },
  icons: {
    categories: ["icons"],
    tags: ["ícones", "icones", "icons", "icon", "svg"],
    keywords: ["ícone", "icone", "icon"],
  },
  animation: {
    categories: ["animation"],
    tags: ["animação", "animacao", "animation", "motion", "lottie"],
    keywords: ["animação", "animacao", "animation", "motion"],
  },
  editor: {
    categories: ["headless", "forms"],
    tags: ["editor", "texto-rico", "rich text", "rich-text", "markdown"],
    keywords: ["editor", "texto rico", "rich text", "markdown"],
  },
  dates: {
    categories: ["utility"],
    tags: ["datas", "date", "dates", "calendário", "calendario", "calendar"],
    keywords: ["data", "date", "calendário", "calendario", "calendar"],
    tagOnly: true,
  },
  validation: {
    categories: ["forms"],
    tags: ["validação", "validacao", "validation", "schema", "schemas"],
    keywords: ["validação", "validacao", "validation", "schema"],
    frameworkAgnostic: true,
  },
  drag: {
    categories: [],
    tags: ["drag", "drop", "dnd", "sortable"],
    keywords: ["drag", "drop", "arrastar", "sortable"],
  },
  i18n: {
    categories: [],
    tags: ["i18n", "internacionalização", "internacionalizacao", "translation"],
    keywords: ["i18n", "internacionalização", "internacionalizacao", "tradução"],
  },
  accessibility: {
    categories: ["headless", "ui-kit", "design-system"],
    tags: ["acessibilidade", "accessibility", "a11y", "acessível", "acessivel"],
    keywords: ["acessibilidade", "accessibility", "a11y", "acessível"],
  },
};

const GOAL_BOOST: Record<StackGoal, Partial<Record<StackNeed, number>>> = {
  dashboard: { ui: 8, tables: 14, charts: 14, icons: 6 },
  site: { ui: 12, icons: 8, animation: 10 },
  ecommerce: { ui: 10, forms: 12, icons: 6 },
  forms: { forms: 16, validation: 14, ui: 6 },
  docs: { ui: 8, editor: 14, icons: 6 },
  app: { ui: 12, icons: 8, forms: 10 },
};

function compatible(library: Library, framework: StackFramework): boolean {
  if (framework === "any") return true;
  if (library.framework === framework) return true;
  // Bibliotecas vanilla e web components funcionam em qualquer stack.
  return library.framework === "vanilla" || library.framework === "web-components";
}

function includesKeyword(haystack: string, keyword: string): boolean {
  const normalized = normalize(keyword);
  // Palavras curtas ("form", "ui", "date") exigem fronteira; senão "form"
  // casaria com "transforma" e "ui" com "build".
  if (normalized.length <= 4) {
    return matchesTermPrecise(haystack, normalized);
  }
  return haystack.includes(normalized);
}

function scoreNeed(
  library: Library,
  need: StackNeed,
  input: StackInput,
): { score: number; matchedTags: string[]; relevant: boolean } {
  const definition = NEEDS[need];
  let score = 0;
  const matchedTags: string[] = [];

  const isMobileUi =
    input.goal === "app" && need === "ui" && library.category === "mobile";
  if (isMobileUi) {
    score += 90;
  } else if (definition.categories.includes(library.category)) {
    score += 60;
  }

  for (const tag of library.tags) {
    const normalized = normalize(tag);
    if (
      definition.tags.some((candidate) => normalize(candidate) === normalized)
    ) {
      matchedTags.push(tag);
      score += 22;
    }
  }

  const haystack = normalize(
    `${library.name} ${library.description} ${library.highlight}`,
  );
  for (const keyword of new Set(definition.keywords.map(normalize))) {
    if (includesKeyword(haystack, keyword)) score += 8;
  }

  score += GOAL_BOOST[input.goal][need] ?? 0;
  if (library.featured) score += 8;
  if (library.maintained) score += 4;
  if (input.framework !== "any" && !definition.frameworkAgnostic) {
    // A escolha nativa do framework vem antes de uma vanilla compatível.
    score += library.framework === input.framework ? 60 : 6;
  }

  // Popularidade entra como desempate suave, não como critério dominante.
  score += Math.min(8, Math.round(Math.log10((library.stars ?? 0) + 1) * 2));

  const relevant =
    matchedTags.length > 0 ||
    isMobileUi ||
    (!definition.tagOnly && definition.categories.includes(library.category));

  return { score, matchedTags, relevant };
}

function byScore(
  a: { library: Library; score: number },
  b: { library: Library; score: number },
): number {
  return (
    b.score - a.score ||
    (b.library.stars ?? 0) - (a.library.stars ?? 0) ||
    a.library.name.localeCompare(b.library.name)
  );
}

export function recommendStack(
  libraries: Library[],
  input: StackInput,
): StackPlan {
  const needs =
    input.needs.length > 0 ? input.needs : DEFAULT_STACK_NEEDS[input.goal];
  const used = new Set<string>();
  const picks: StackPick[] = [];
  const notes: StackNote[] = [];

  for (const need of needs) {
    const compatibleLibraries = libraries.filter((library) =>
      compatible(library, input.framework),
    );
    const openLibraries = compatibleLibraries.filter(
      (library) =>
        !input.openSourceOnly ||
        licenseFamily(library.license) !== "comercial",
    );

    const ranked = openLibraries
      .map((library) => ({
        library,
        ...scoreNeed(library, need, input),
      }))
      .filter((item) => item.relevant && item.score > 0)
      .sort(byScore);

    const available = ranked.filter((item) => !used.has(item.library.slug));
    const pick = available[0];

    if (!pick) {
      const hasRelevantCommercial = compatibleLibraries
        .filter((library) => licenseFamily(library.license) === "comercial")
        .map((library) => scoreNeed(library, need, input))
        .some((item) => item.relevant && item.score > 0);
      notes.push({
        kind:
          input.openSourceOnly && hasRelevantCommercial ? "license" : "missing",
        need,
      });
      continue;
    }

    used.add(pick.library.slug);
    picks.push({
      need,
      library: pick.library,
      score: pick.score,
      matchedTags: pick.matchedTags,
      universal:
        input.framework !== "any" &&
        pick.library.framework !== input.framework,
      alternatives: available.slice(1, 3).map((item) => item.library),
    });
  }

  /*
    Remove das alternativas quem já virou escolha em outra necessidade. Sem
    isso, Zod podia aparecer como alternativa de "formulários" e como escolha
    de "validação" na mesma stack.
  */
  const chosen = new Set(picks.map((pick) => pick.library.slug));
  for (const pick of picks) {
    pick.alternatives = pick.alternatives
      .filter((alternative) => !chosen.has(alternative.slug))
      .slice(0, 2);
  }

  return { input, picks, notes };
}
