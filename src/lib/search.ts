import type { Library } from "@/types/library";
import { licenseFamily } from "./license.ts";

/*
  Busca do explorador.

  O texto digitado é dividido em **termos** e todos precisam casar em algum
  campo da biblioteca, em qualquer ordem ("react form" e "form react" dão o
  mesmo resultado). Cada termo recebe uma nota conforme o campo em que casou
  (nome > tags > descrição > destaque > repositório > site > framework e
  categoria) e a soma das notas é a relevância do resultado.

  O módulo é puro: só importa tipos, então roda igual no app e no runner
  nativo do Node (`npm run test`).
*/

export type SearchLabels = {
  framework?: Record<string, string>;
  category?: Record<string, string>;
  license?: Record<string, string>;
};

export type HighlightSegment = {
  text: string;
  match: boolean;
};

export type ScoredLibrary = {
  library: Library;
  score: number;
};

/* Peso de cada campo, quando o termo casa dentro dele. */
const WEIGHT = {
  name: 100,
  tag: 60,
  description: 30,
  highlight: 25,
  repo: 20,
  website: 15,
  framework: 10,
  category: 10,
} as const;

/** Bônus quando o termo começa o campo (o nome é o sinal mais forte). */
const PREFIX_BONUS = 20;

/**
 * Minúsculas sem acento, preservando o comprimento do texto — assim dá para
 * marcar os trechos casados sem quebrar os índices.
 */
export function normalize(value: string): string {
  let out = "";
  for (const char of value) {
    const stripped = char
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    out += stripped || char;
  }
  return out;
}

/** Divide a query em termos, ignorando acentos, caixa e pontuação. */
export function tokenize(query: string): string[] {
  return normalize(query)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 0);
}

function isWordChar(char: string): boolean {
  return /[a-z0-9]/.test(char);
}

/**
 * O termo casa com o campo?
 * - no começo do campo: sempre (ex.: "ant" em "ant.design");
 * - no meio do campo: só com 4+ letras, para não casar "ant" dentro de "vant";
 * - com 3 letras ou menos: exige fronteira de palavra.
 */
export function matchesTerm(field: string, token: string): boolean {
  if (!field || !token) return false;
  if (field.startsWith(token)) return true;
  if (token.length >= 4) return field.includes(token);

  let index = field.indexOf(token);
  while (index !== -1) {
    const before = index > 0 ? field[index - 1] : "";
    const after =
      index + token.length < field.length ? field[index + token.length] : "";
    if (!isWordChar(before) && !isWordChar(after)) return true;
    index = field.indexOf(token, index + 1);
  }
  return false;
}

/**
 * Versão estrita de `matchesTerm`: exige fronteira de palavra dos dois lados.
 * É a usada pela busca por intenção, para "table" não casar com "Tabler" e
 * "react" não casar com "reactive".
 */
export function matchesTermPrecise(field: string, token: string): boolean {
  if (!field || !token) return false;

  let index = field.indexOf(token);
  while (index !== -1) {
    const before = index > 0 ? field[index - 1] : "";
    const after =
      index + token.length < field.length ? field[index + token.length] : "";
    if (!isWordChar(before) && !isWordChar(after)) return true;
    index = field.indexOf(token, index + 1);
  }

  return false;
}

/** Nota do termo em um campo (0 = não casou). */
function scoreFieldWith(
  field: string,
  token: string,
  weight: number,
  matcher: (field: string, token: string) => boolean,
): number {
  if (!matcher(field, token)) return 0;
  return field.startsWith(token) ? weight + PREFIX_BONUS : weight;
}

function scoreTermWith(
  library: Library,
  token: string,
  labels: SearchLabels,
  matcher: (field: string, token: string) => boolean,
  includeLabels = true,
): number {
  let best = 0;
  const add = (field: string, weight: number) => {
    best = Math.max(best, scoreFieldWith(field, token, weight, matcher));
  };

  add(normalize(library.name), WEIGHT.name);
  for (const tag of library.tags) add(normalize(tag), WEIGHT.tag);

  add(normalize(library.description), WEIGHT.description);
  add(normalize(library.highlight), WEIGHT.highlight);
  add(normalize(library.repo ?? ""), WEIGHT.repo);
  add(normalize(library.website), WEIGHT.website);

  /*
    Os rótulos de categoria são úteis na busca antiga ("Dados & Tabelas"),
    mas na busca por intenção eles ampliam demais: "tabela" casaria com o
    rótulo "Dados & Tabelas" de qualquer biblioteca de gráficos. Os filtros
    de categoria já são tratados como facetas.
  */
  if (includeLabels) {
    const frameworkLabel = labels.framework?.[library.framework];
    if (frameworkLabel) add(normalize(frameworkLabel), WEIGHT.framework);

    const categoryLabel = labels.category?.[library.category];
    if (categoryLabel) add(normalize(categoryLabel), WEIGHT.category);
  }

  return best;
}

/* ------------------------------------------------------------------ *
 * Escopo: termos que designam uma categoria ou um framework
 * ------------------------------------------------------------------ */

export type FacetKind = "category" | "framework" | "license";

export type ScopeEntry = {
  kind: FacetKind;
  value: string;
  label: string;
};

export type ScopeGroup = {
  token: string;
  entries: ScopeEntry[];
};

export type SearchScope = ScopeGroup[];

/** Termo curto demais para designar um grupo. */
const MIN_SCOPE_TOKEN = 3;

/**
 * O termo designa este rótulo? "mobile" designa "Mobile / Universal",
 * "react" designa "React", "dados" designa "Dados & Tabelas".
 * Só o começo do rótulo conta: "componentes" não designa "Web Components".
 */
function designates(label: string, token: string): boolean {
  if (token.length < MIN_SCOPE_TOKEN) return false;
  const normalized = normalize(label);
  if (!normalized.startsWith(token)) return false;
  const next = normalized[token.length] ?? "";
  return !isWordChar(next);
}

/**
 * Descobre quais termos da query designam um grupo do catálogo (categoria ou
 * framework). "mobile" vira o grupo "Mobile / Universal"; "react" vira o
 * framework "React".
 *
 * Os rótulos podem vir de mais de um idioma: assim "data" também filtra o
 * grupo "Dados & Tabelas" mesmo na interface em português. O rótulo exibido
 * é sempre o do idioma da tela (`displayLabels`).
 */
export function resolveScope(
  tokens: string[],
  labelSets: SearchLabels | SearchLabels[] = {},
  displayLabels?: SearchLabels,
): SearchScope {
  const sets = Array.isArray(labelSets) ? labelSets : [labelSets];
  const scope: SearchScope = [];
  for (const token of tokens) {
    const entries: ScopeEntry[] = [];
    for (const labels of sets) {
      for (const [value, label] of Object.entries(labels.category ?? {})) {
        if (designates(label, token)) {
          entries.push({
            kind: "category",
            value,
            label: displayLabels?.category?.[value] ?? label,
          });
        }
      }
      for (const [value, label] of Object.entries(labels.framework ?? {})) {
        if (designates(label, token)) {
          entries.push({
            kind: "framework",
            value,
            label: displayLabels?.framework?.[value] ?? label,
          });
        }
      }
    }
    if (entries.length > 0) scope.push({ token, entries });
  }
  return scope;
}

/** Rótulos do escopo, para mostrar na interface ("Mobile / Universal"). */
export function scopeLabels(scope: SearchScope): string[] {
  const labels: string[] = [];
  for (const group of scope) {
    const unique = [...new Set(group.entries.map((entry) => entry.label))];
    for (const label of unique) {
      if (!labels.includes(label)) labels.push(label);
    }
  }
  return labels;
}

/**
 * Nota da biblioteca dentro do grupo: 0 = não pertence ao grupo.
 * Além das libs do grupo, entram as que têm o termo como tag explícita
 * (ex.: Ionic tem a tag "mobile" mesmo estando na categoria "web").
 */
function scoreScopeGroup(group: ScopeGroup, library: Library): number {
  let best = 0;
  for (const entry of group.entries) {
    if (entry.kind === "category" && library.category === entry.value) {
      best = Math.max(best, 80);
    }
    if (entry.kind === "framework" && library.framework === entry.value) {
      best = Math.max(best, 90);
    }
  }
  if (library.tags.some((tag) => normalize(tag) === group.token)) {
    best = Math.max(best, 60);
  }
  return best;
}

/** Nota do termo em uma biblioteca — o melhor campo que casou. */
export function scoreTerm(
  token: string,
  library: Library,
  labels: SearchLabels = {},
): number {
  return scoreTermWith(library, token, labels, matchesTerm);
}

/** Versão da nota que exige palavra inteira; usada pela busca por intenção. */
export function scoreTermPrecise(
  token: string,
  library: Library,
  labels: SearchLabels = {},
): number {
  return scoreTermWith(library, token, labels, matchesTermPrecise, false);
}

/**
 * Filtra e pontua as bibliotecas: só entram as que casam com **todos** os
 * termos, e o resultado vem ordenado por relevância.
 *
 * `labels` são os rótulos do idioma da tela (usados na nota e na exibição).
 * `scopeLabelSets` são os rótulos que podem *designar* um grupo — pode
 * incluir os de outros idiomas, para a busca entender "forms" e "data" em
 * qualquer interface.
 */
export function searchLibraries(
  libraries: Library[],
  tokens: string[],
  labels: SearchLabels = {},
  scopeLabelSets: SearchLabels | SearchLabels[] = labels,
): ScoredLibrary[] {
  if (tokens.length === 0) {
    return libraries.map((library) => ({ library, score: 0 }));
  }

  const scope = resolveScope(tokens, scopeLabelSets, labels);

  const results: ScoredLibrary[] = [];
  for (const library of libraries) {
    let score = 0;
    let matchedAll = true;
    for (const token of tokens) {
      // Termo que designa uma categoria ou um framework: a biblioteca precisa
      // estar no grupo (ou ter o termo como tag).
      const group = scope.find((item) => item.token === token);
      const termScore = group
        ? scoreScopeGroup(group, library)
        : scoreTerm(token, library, labels);
      if (termScore === 0) {
        matchedAll = false;
        break;
      }
      score += termScore;
    }
    if (matchedAll) results.push({ library, score });
  }
  return results;
}

/**
 * Divide o texto em trechos, marcando os que casaram com algum termo.
 * Usado para sublinhar o termo buscado no nome da biblioteca.
 */
export function highlightParts(
  text: string,
  tokens: string[],
): HighlightSegment[] {
  if (tokens.length === 0) return [{ text, match: false }];

  const folded = normalize(text);
  const marks = new Array<boolean>(text.length).fill(false);

  for (const token of tokens) {
    let index = folded.indexOf(token);
    while (index !== -1) {
      const before = index > 0 ? folded[index - 1] : "";
      const after =
        index + token.length < folded.length ? folded[index + token.length] : "";
      const ok = token.length >= 4 || (!isWordChar(before) && !isWordChar(after));
      if (ok) {
        for (let i = index; i < index + token.length; i++) marks[i] = true;
      }
      index = folded.indexOf(token, index + 1);
    }
  }

  const segments: HighlightSegment[] = [];
  let current = "";
  let currentMatch = marks[0] ?? false;
  for (let i = 0; i < text.length; i++) {
    if (marks[i] === currentMatch) {
      current += text[i];
    } else {
      segments.push({ text: current, match: currentMatch });
      current = text[i];
      currentMatch = marks[i];
    }
  }
  if (current) segments.push({ text: current, match: currentMatch });
  return segments;
}

/* ------------------------------------------------------------------ *
 * Busca por intenção
 *
 * A busca acima exige todos os termos e entende apenas os rótulos de
 * categoria/framework. Para consultas em linguagem natural ("preciso de uma
 * tabela editável que seja MIT") isso é pouco: sobram palavras vazias e
 * sinônimos que o catálogo não usa.
 *
 * A camada abaixo:
 *  - remove palavras vazias (PT/EN);
 *  - reconhece frases ("react native", "web components", "data grid");
 *  - expande sinônimos e apelidos de framework/categoria/licença;
 *  - tenta a busca estrita e, se ela não retornar nada, relaxa os termos
 *    descritivos (mantendo os filtros de framework/categoria/licença);
 *  - tolera erros de digitação em termos com 5+ letras.
 *
 * Tudo é local e determinístico: nenhuma chamada de rede, nenhuma chave.
 * ------------------------------------------------------------------ */

export type SearchFacet = {
  kind: FacetKind;
  value: string;
};

export type SearchTerm = {
  id: string;
  raw: string;
  alternatives: string[];
  facets: SearchFacet[];
};

export type SearchQuery = {
  terms: SearchTerm[];
  /** Termos para sublinhar no cartão (sem palavras vazias). */
  highlightTokens: string[];
  stopwords: string[];
  /** A consulta usou sinônimos, frases ou removeu palavras vazias. */
  smart: boolean;
};

type SynonymGroup = {
  id: string;
  keys: string[];
  alternatives: string[];
};

type PhraseDefinition = {
  id: string;
  phrase: string;
  alternatives: string[];
  facets: SearchFacet[];
};

/*
  Palavras que não ajudam a escolher uma biblioteca. A lista é deliberadamente
  curta: termos como "web", "data" e "component" continuam valendo.
*/
const SEARCH_STOPWORDS = new Set([
  // Português
  "a", "o", "as", "os", "um", "uma", "uns", "umas", "de", "do", "da", "dos",
  "das", "em", "no", "na", "nos", "nas", "por", "para", "pra", "com", "sem",
  "que", "e", "ou", "se", "ao", "aos", "é", "ser", "sou", "estou", "esta",
  "está", "preciso", "precisa", "quero", "quer", "gostaria", "procuro",
  "procurando", "buscar", "busco", "algo", "alguma", "algum", "algumas",
  "alguns", "biblioteca", "bibliotecas", "lib", "libs", "opção", "opções",
  "opcao", "opcoes", "melhor", "melhores", "bom", "boa", "bons", "boas", "meu",
  "minha", "meus", "minhas", "projeto", "projetos", "fazer", "montar", "criar",
  "usar", "uso", "como", "onde", "qual", "quais", "quando", "tem", "ter",
  "tenho", "seria", "poderia", "pode", "me", "te", "lhe", "isso", "isto",
  "aquilo", "mais", "muito", "muita", "muitos", "muitas", "aguente", "aguentar",
  "suporte", "suporta", "suportar", "funcione", "funciona", "funcionar",
  "robusto", "robusta", "escalável", "escalavel", "fácil", "facil", "simples",
  "seja", "sejam", "licença", "licenca", "preferência", "preferencia",
  // Inglês
  "the", "an", "of", "to", "for", "with", "without", "and", "or", "if", "is",
  "are", "be", "i", "we", "you", "need", "needs", "want", "wants", "looking",
  "look", "search", "searching", "find", "finding", "library", "libraries",
  "lib", "libs", "something", "some", "any", "best", "good", "my", "our",
  "project", "projects", "please", "can", "could", "would", "should", "that",
  "which", "in", "on", "at", "from", "by", "as", "it", "this", "these",
  "those", "build", "building", "create", "creating", "use", "using", "how",
  "what", "where", "when", "have", "has", "do", "does", "make", "more", "most",
  "very", "really", "just", "also", "work", "works", "working", "license",
  "preferably", "something", "like", "want", "need",
]);

/*
  Sinônimos por necessidade. As chaves são comparadas com o termo já
  normalizado; as alternativas entram na mesma condição (OR) e preservam
  hífens porque as tags do catálogo usam esse formato.
*/
const SYNONYM_GROUPS: SynonymGroup[] = [
  {
    id: "table",
    keys: ["tabela", "tabelas", "table", "tables", "grid", "data-grid", "datagrid", "planilha", "spreadsheet"],
    alternatives: ["tabela", "tabelas", "table", "tables", "grid", "data-grid", "datagrid", "planilha", "spreadsheet"],
  },
  {
    id: "editable",
    keys: ["editavel", "editáveis", "editaveis", "editable", "edição", "edicao", "editing"],
    alternatives: ["editavel", "editable", "data-grid", "planilha", "spreadsheet"],
  },
  {
    id: "chart",
    keys: ["gráfico", "gráficos", "grafico", "graficos", "chart", "charts", "dataviz", "visualização", "visualizacao", "plot"],
    alternatives: ["gráfico", "gráficos", "grafico", "graficos", "chart", "charts", "dataviz", "visualização", "visualizacao", "plot"],
  },
  {
    id: "dashboard",
    keys: ["dashboard", "dashboards", "painel", "paineis", "admin", "admins", "backoffice", "analytics"],
    alternatives: ["dashboard", "admin", "painel", "backoffice", "analytics", "chart", "charts", "gráfico", "graficos", "tabela", "tabelas", "table", "tables"],
  },
  {
    id: "form",
    keys: ["formulário", "formularios", "formulario", "form", "forms", "input", "inputs"],
    alternatives: ["formulário", "formularios", "formulario", "form", "forms", "input", "inputs"],
  },
  {
    id: "validation",
    keys: ["validação", "validacao", "validações", "validacoes", "validation", "validar", "schema", "schemas"],
    alternatives: ["validação", "validacao", "validation", "validar", "schema", "schemas", "zod", "yup", "valibot"],
  },
  {
    id: "editor",
    keys: ["editor", "editores", "rich-text", "texto-rico", "wysiwyg", "markdown"],
    alternatives: ["editor", "editores", "rich text", "rich-text", "texto-rico", "wysiwyg", "markdown", "tiptap", "lexical", "slate"],
  },
  {
    id: "calendar",
    keys: ["calendário", "calendario", "calendarios", "calendar", "datepicker", "date-picker", "datas", "date", "dates", "agenda"],
    alternatives: ["calendário", "calendario", "calendar", "datepicker", "date-picker", "datas", "date", "dates", "agenda", "fullcalendar"],
  },
  {
    id: "animation",
    keys: ["animação", "animacao", "animações", "animacoes", "animation", "animations", "transição", "transicao", "transições", "transicoes"],
    alternatives: ["animação", "animacao", "animações", "animacoes", "animation", "animations", "transição", "transicao", "transições", "transicoes", "motion", "lottie"],
  },
  {
    id: "icons",
    keys: ["ícone", "icone", "ícones", "icones", "icon", "icons"],
    alternatives: ["ícone", "icone", "ícones", "icones", "icon", "icons", "svg"],
  },
  {
    id: "accessibility",
    keys: ["acessível", "acessivel", "acessíveis", "acessiveis", "acessibilidade", "accessible", "accessibility", "a11y"],
    alternatives: ["acessível", "acessivel", "acessibilidade", "accessible", "accessibility", "a11y"],
  },
  {
    id: "lightweight",
    keys: ["leve", "leves", "lightweight", "pequeno", "pequena", "small"],
    alternatives: ["leve", "leves", "lightweight", "pequeno", "pequena", "small", "zero dependencies", "sem dependências", "sem dependencias"],
  },
  {
    id: "performance",
    keys: ["performance", "desempenho", "rápido", "rapido", "rápida", "rapida", "fast", "otimizado", "otimizada"],
    alternatives: ["performance", "desempenho", "rápido", "rapido", "rápida", "rapida", "fast", "otimizado", "otimizada"],
  },
  {
    id: "typescript",
    keys: ["typescript", "type-script"],
    alternatives: ["typescript", "type-script", "ts"],
  },
  {
    id: "tailwind",
    keys: ["tailwind", "tailwindcss", "tailwind-css"],
    alternatives: ["tailwind", "tailwindcss", "tailwind-css", "tailwind css"],
  },
  {
    id: "drag",
    keys: ["drag", "drop", "dnd", "sortable", "arrastar", "arraste"],
    alternatives: ["drag", "drop", "dnd", "sortable", "arrastar", "arraste", "drag and drop", "drag-and-drop"],
  },
  {
    id: "theme",
    keys: ["tema", "temas", "theme", "themes", "dark", "darkmode", "escuro"],
    alternatives: ["tema", "temas", "theme", "themes", "dark", "darkmode", "dark mode", "dark-mode", "modo escuro"],
  },
  {
    id: "i18n",
    keys: ["i18n", "internacionalização", "internacionalizacao", "internationalization", "tradução", "traducao", "translation"],
    alternatives: ["i18n", "internacionalização", "internacionalizacao", "internationalization", "tradução", "traducao", "translation"],
  },
  {
    id: "ecommerce",
    keys: ["ecommerce", "e-commerce", "loja", "lojas", "commerce"],
    alternatives: ["ecommerce", "e-commerce", "loja", "lojas", "commerce", "checkout"],
  },
  {
    id: "landing",
    keys: ["landing", "landingpage", "marketing", "institucional"],
    alternatives: ["landing", "landing page", "landing-page", "site institucional", "marketing", "template", "blocos", "blocks"],
  },
  {
    id: "blog",
    keys: ["blog", "blogs", "conteúdo", "conteudo", "content"],
    alternatives: ["blog", "blogs", "conteúdo", "conteudo", "content", "markdown"],
  },
  {
    id: "docs",
    keys: ["documentação", "documentacao", "docs", "documentation"],
    alternatives: ["documentação", "documentacao", "docs", "documentation", "markdown"],
  },
  {
    id: "free",
    keys: ["grátis", "gratis", "gratuito", "gratuita", "free"],
    alternatives: ["grátis", "gratis", "gratuito", "gratuita", "free", "open source", "código aberto", "codigo aberto"],
  },
  {
    id: "no-deps",
    keys: ["sem-dependências", "sem-dependencias", "no-dependencies", "zero-dependencies"],
    alternatives: ["sem dependências", "sem dependencias", "no dependencies", "zero dependencies", "sem dependência"],
  },
  {
    id: "responsive",
    keys: ["responsive", "responsivo", "responsiva", "responsivos"],
    alternatives: ["responsive", "responsivo", "responsiva", "responsivos"],
  },
  {
    id: "material",
    keys: ["material", "materialdesign"],
    alternatives: ["material", "material design", "materialdesign", "mui"],
  },
  {
    id: "bootstrap",
    keys: ["bootstrap", "bootstrap5"],
    alternatives: ["bootstrap", "bootstrap5"],
  },
  {
    id: "enterprise",
    keys: ["enterprise", "corporativo", "corporativa", "empresarial"],
    alternatives: ["enterprise", "corporativo", "corporativa", "empresarial"],
  },
  {
    id: "rtl",
    keys: ["rtl", "right-to-left"],
    alternatives: ["rtl", "right-to-left", "right to left"],
  },
  {
    id: "color",
    keys: ["cor", "cores", "color", "colors", "cor", "paleta", "palette"],
    alternatives: ["cor", "cores", "color", "colors", "paleta", "palette"],
  },
];

const SYNONYM_BY_KEY = new Map<string, SynonymGroup>();
for (const group of SYNONYM_GROUPS) {
  for (const key of group.keys) {
    SYNONYM_BY_KEY.set(normalize(key), group);
  }
}

/*
  Frases que precisam ser reconhecidas antes da tokenização. Sem isso,
  "react native" seria lido como "react" (framework) + "native" (texto) e
  filtraria justamente as bibliotecas mobile.
*/
const PHRASES: PhraseDefinition[] = [
  {
    id: "phrase-react-native",
    phrase: "react native",
    alternatives: ["react native", "react-native", "reactnative", "mobile", "universal"],
    facets: [{ kind: "category", value: "mobile" }],
  },
  {
    id: "phrase-web-components",
    phrase: "web components",
    alternatives: ["web components", "web-components", "webcomponents", "custom elements", "componentes web"],
    facets: [
      { kind: "category", value: "web" },
      { kind: "framework", value: "web-components" },
    ],
  },
  {
    id: "phrase-custom-elements",
    phrase: "custom elements",
    alternatives: ["custom elements", "web components", "web-components", "webcomponents"],
    facets: [{ kind: "framework", value: "web-components" }],
  },
  {
    id: "phrase-componentes-web",
    phrase: "componentes web",
    alternatives: ["componentes web", "web components", "web-components"],
    facets: [{ kind: "category", value: "web" }],
  },
  {
    id: "phrase-design-system",
    phrase: "design system",
    alternatives: ["design system", "design-system", "designsystems", "sistema de design"],
    facets: [{ kind: "category", value: "design-system" }],
  },
  {
    id: "phrase-ui-kit",
    phrase: "ui kit",
    alternatives: ["ui kit", "ui-kit", "uikit", "kit de ui"],
    facets: [{ kind: "category", value: "ui-kit" }],
  },
  {
    id: "phrase-headless-ui",
    phrase: "headless ui",
    alternatives: ["headless ui", "headless", "unstyled", "sem estilo"],
    facets: [],
  },
  {
    id: "phrase-data-grid",
    phrase: "data grid",
    alternatives: ["data grid", "data-grid", "datagrid", "grid", "tabela", "table"],
    facets: [],
  },
  {
    id: "phrase-form-validation",
    phrase: "form validation",
    alternatives: ["form validation", "validação de formulário", "validacao de formulario", "validation", "validação", "validacao", "schema"],
    facets: [],
  },
  {
    id: "phrase-rich-text",
    phrase: "rich text",
    alternatives: ["rich text", "rich-text", "texto-rico", "texto rico", "editor", "wysiwyg"],
    facets: [],
  },
  {
    id: "phrase-date-picker",
    phrase: "date picker",
    alternatives: ["date picker", "date-picker", "datepicker", "calendário", "calendario", "calendar"],
    facets: [],
  },
  {
    id: "phrase-drag-drop",
    phrase: "drag and drop",
    alternatives: ["drag and drop", "drag-and-drop", "dnd", "sortable", "arrastar", "arraste e solte"],
    facets: [],
  },
  {
    id: "phrase-dark-mode",
    phrase: "dark mode",
    alternatives: ["dark mode", "dark-mode", "darkmode", "modo escuro", "tema escuro"],
    facets: [],
  },
  {
    id: "phrase-css-in-js",
    phrase: "css in js",
    alternatives: ["css in js", "css-in-js", "cssinjs"],
    facets: [],
  },
  {
    id: "phrase-open-source",
    phrase: "open source",
    alternatives: ["open source", "open-source", "código aberto", "codigo aberto", "free", "grátis", "gratis"],
    facets: [],
  },
  {
    id: "phrase-no-deps",
    phrase: "sem dependencias",
    alternatives: ["sem dependências", "sem dependencias", "no dependencies", "zero dependencies", "sem dependência"],
    facets: [],
  },
  {
    id: "phrase-landing-page",
    phrase: "landing page",
    alternatives: ["landing page", "landing-page", "landing", "site institucional", "marketing"],
    facets: [],
  },
  /*
    Nomes de bibliotecas que contêm "ui" ou "css" precisam vencer o filtro
    genérico antes que ele transforme "ui" em categoria ui-kit.
  */
  {
    id: "phrase-material-ui",
    phrase: "material ui",
    alternatives: ["material ui", "material-ui", "mui"],
    facets: [],
  },
  {
    id: "phrase-radix-ui",
    phrase: "radix ui",
    alternatives: ["radix ui", "radix-ui", "radix"],
    facets: [],
  },
  {
    id: "phrase-chakra-ui",
    phrase: "chakra ui",
    alternatives: ["chakra ui", "chakra-ui", "chakra"],
    facets: [],
  },
  {
    id: "phrase-base-ui",
    phrase: "base ui",
    alternatives: ["base ui", "base-ui", "baseui"],
    facets: [],
  },
  {
    id: "phrase-ark-ui",
    phrase: "ark ui",
    alternatives: ["ark ui", "ark-ui", "arkui"],
    facets: [],
  },
  {
    id: "phrase-qwik-ui",
    phrase: "qwik ui",
    alternatives: ["qwik ui", "qwik-ui", "qwikui"],
    facets: [],
  },
  {
    id: "phrase-hope-ui",
    phrase: "hope ui",
    alternatives: ["hope ui", "hope-ui", "hopeui"],
    facets: [],
  },
  {
    id: "phrase-naive-ui",
    phrase: "naive ui",
    alternatives: ["naive ui", "naive-ui", "naiveui"],
    facets: [],
  },
  {
    id: "phrase-semantic-ui",
    phrase: "semantic ui",
    alternatives: ["semantic ui", "semantic-ui", "semanticui"],
    facets: [],
  },
  {
    id: "phrase-shadcn-ui",
    phrase: "shadcn ui",
    alternatives: ["shadcn ui", "shadcn/ui", "shadcn"],
    facets: [],
  },
  {
    id: "phrase-tailwind-css",
    phrase: "tailwind css",
    alternatives: ["tailwind css", "tailwindcss", "tailwind"],
    facets: [],
  },
  {
    id: "phrase-date-fns",
    phrase: "date fns",
    alternatives: ["date fns", "date-fns", "datefns"],
    facets: [],
  },
  {
    id: "phrase-day-js",
    phrase: "day js",
    alternatives: ["day js", "day.js", "dayjs"],
    facets: [],
  },
  {
    id: "phrase-framer-motion",
    phrase: "framer motion",
    alternatives: ["framer motion", "framer-motion", "motion"],
    facets: [],
  },
  {
    id: "phrase-react-js",
    phrase: "react js",
    alternatives: ["react js", "react.js", "reactjs", "react"],
    facets: [{ kind: "framework", value: "react" }],
  },
  {
    id: "phrase-next-js",
    phrase: "next js",
    alternatives: ["next js", "next.js", "nextjs"],
    facets: [{ kind: "framework", value: "react" }],
  },
  {
    id: "phrase-vue-js",
    phrase: "vue js",
    alternatives: ["vue js", "vue.js", "vuejs", "vue"],
    facets: [{ kind: "framework", value: "vue" }],
  },
  {
    id: "phrase-svelte-kit",
    phrase: "svelte kit",
    alternatives: ["svelte kit", "sveltekit", "svelte"],
    facets: [{ kind: "framework", value: "svelte" }],
  },
  {
    id: "phrase-solid-js",
    phrase: "solid js",
    alternatives: ["solid js", "solid.js", "solidjs", "solid"],
    facets: [{ kind: "framework", value: "solid" }],
  },
  {
    id: "phrase-angular-js",
    phrase: "angular js",
    alternatives: ["angular js", "angular.js", "angularjs", "angular"],
    facets: [{ kind: "framework", value: "angular" }],
  },
];

const FACET_BY_ALIAS = new Map<string, SearchFacet[]>();

function addFacetAliases(
  kind: FacetKind,
  aliases: string[],
  value: string,
): void {
  for (const alias of aliases) {
    const key = foldQuery(alias);
    if (!key || key.includes(" ")) continue;
    const facets = FACET_BY_ALIAS.get(key) ?? [];
    if (!facets.some((facet) => facet.kind === kind && facet.value === value)) {
      facets.push({ kind, value });
    }
    FACET_BY_ALIAS.set(key, facets);
  }
}

/* Apelidos de uma palavra. Frases ficam em `PHRASES`. */
addFacetAliases("framework", ["react", "reactjs", "nextjs", "remix"], "react");
addFacetAliases("framework", ["vue", "vuejs", "nuxt", "nuxtjs"], "vue");
addFacetAliases("framework", ["svelte", "sveltejs", "sveltekit"], "svelte");
addFacetAliases("framework", ["angular", "angularjs", "ng"], "angular");
addFacetAliases("framework", ["solid", "solidjs"], "solid");
addFacetAliases("framework", ["qwik", "qwikjs"], "qwik");
addFacetAliases("framework", ["webcomponents", "wc"], "web-components");
addFacetAliases("framework", ["vanilla", "vanillajs"], "vanilla");

addFacetAliases("category", ["ui", "uikit"], "ui-kit");
addFacetAliases("category", ["headless", "unstyled", "primitivas", "primitives"], "headless");
addFacetAliases("category", ["designsystem", "designsystems"], "design-system");
addFacetAliases("category", ["utility", "utilities", "utilitário", "utilitario", "utilitários", "utilitarios", "css", "estilos", "styling"], "utility");
addFacetAliases("category", ["forms", "form", "formulário", "formulario", "formulários", "formularios", "input", "inputs"], "forms");
addFacetAliases("category", ["data", "dados"], "data");
addFacetAliases("category", ["icons", "icon", "ícone", "icone", "ícones", "icones"], "icons");
addFacetAliases("category", ["animation", "animations", "animação", "animacao", "animações", "animacoes"], "animation");
addFacetAliases("category", ["mobile", "ios", "android"], "mobile");

addFacetAliases("license", ["mit"], "mit");
addFacetAliases("license", ["apache", "apache2"], "apache");
addFacetAliases("license", ["bsd", "bsd3"], "bsd");
addFacetAliases("license", ["comercial", "commercial", "pago", "paid", "proprietária", "proprietaria", "proprietary"], "comercial");
addFacetAliases("license", ["undeclared", "noassertion", "naodeclarada"], "outra");

/** Minúsculas, sem acento e com pontuação virando espaço. */
function foldQuery(value: string): string {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

/**
 * Converte a consulta em termos pesquisáveis. As frases são removidas antes
 * da tokenização para não virarem dois termos independentes.
 */
export function buildSearchQuery(query: string): SearchQuery {
  const folded = foldQuery(query);
  let remaining = ` ${folded} `;
  const terms: SearchTerm[] = [];
  const phraseIds = new Set<string>();
  const phraseHighlights: string[] = [];

  for (const phrase of PHRASES) {
    const needle = ` ${foldQuery(phrase.phrase)} `;
    if (!remaining.includes(needle)) continue;

    remaining = remaining.split(needle).join(" ");
    if (phraseIds.has(phrase.id)) continue;

    phraseIds.add(phrase.id);
    terms.push({
      id: phrase.id,
      raw: phrase.phrase,
      alternatives: unique(
        [phrase.phrase, ...phrase.alternatives].map(normalize).filter(Boolean),
      ),
      facets: phrase.facets,
    });

    for (const word of foldQuery(phrase.phrase).split(" ")) {
      if (word && !SEARCH_STOPWORDS.has(word) && !phraseHighlights.includes(word)) {
        phraseHighlights.push(word);
      }
    }
  }

  const tokens = remaining.trim().split(/\s+/).filter(Boolean);
  const highlightTokens: string[] = [...phraseHighlights];
  const stopwords: string[] = [];
  const seen = new Set(terms.map((term) => term.id));

  for (const token of tokens) {
    // Números soltos ("apache 2.0") e letras soltas não ajudam.
    if (/^\d+$/.test(token) || token.length < 2) continue;
    if (SEARCH_STOPWORDS.has(token)) {
      stopwords.push(token);
      continue;
    }

    if (!highlightTokens.includes(token)) highlightTokens.push(token);

    const facets = FACET_BY_ALIAS.get(token) ?? [];
    const group = SYNONYM_BY_KEY.get(token);
    const id =
      group?.id ??
      (facets.length > 0
        ? [...facets]
            .sort((a, b) => `${a.kind}:${a.value}`.localeCompare(`${b.kind}:${b.value}`))
            .map((facet) => `${facet.kind}:${facet.value}`)
            .join("|")
        : token);

    if (seen.has(id)) continue;
    seen.add(id);

    terms.push({
      id,
      raw: token,
      alternatives: unique(
        [token, ...(group?.alternatives ?? [])].map(normalize).filter(Boolean),
      ),
      facets,
    });
  }

  return {
    terms,
    highlightTokens,
    stopwords,
    smart:
      stopwords.length > 0 ||
      phrasesCount(terms) > 0 ||
      terms.some((term) => term.id !== term.raw),
  };
}

function phrasesCount(terms: SearchTerm[]): number {
  return terms.filter((term) => term.id.startsWith("phrase-")).length;
}

/** Rótulos dos filtros detectados, para mostrar na interface. */
export function queryFacetLabels(
  query: SearchQuery,
  labels: SearchLabels = {},
): string[] {
  const result: string[] = [];
  for (const term of query.terms) {
    for (const facet of term.facets) {
      const label = labels[facet.kind]?.[facet.value] ?? facet.value;
      if (!result.includes(label)) result.push(label);
    }
  }
  return result;
}

/** Distância de Damerau-Levenshtein (transposição de vizinhos conta 1). */
function editDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () =>
    new Array<number>(cols).fill(0),
  );

  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );

      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }

  return dp[a.length][b.length];
}

function wordsOf(value: string): string[] {
  return normalize(value)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 3);
}

/** Nota baixa para um termo que quase casa (erro de digitação). */
function fuzzyScoreTerm(alternatives: string[], library: Library): number {
  let best = 0;

  for (const alternative of alternatives) {
    const token = normalize(alternative);
    if (token.length < 5) continue;
    const maxDistance = token.length >= 8 ? 2 : 1;

    for (const word of wordsOf(library.name)) {
      if (editDistance(word, token) <= maxDistance) {
        best = Math.max(best, 30);
      }
    }

    for (const tag of library.tags) {
      for (const word of wordsOf(tag)) {
        if (editDistance(word, token) <= maxDistance) {
          best = Math.max(best, 20);
        }
      }
    }

    for (const word of wordsOf(library.description)) {
      if (editDistance(word, token) <= maxDistance) {
        best = Math.max(best, 10);
      }
    }
  }

  return best;
}

function scoreSearchTerm(
  term: SearchTerm,
  library: Library,
  labels: SearchLabels,
  fuzzy = false,
): number {
  /*
    Termos que designam framework/categoria/licença são filtros: só contam
    se a biblioteca pertence ao grupo ou tem a tag explícita. Assim "react"
    não casa com uma biblioteca Vue só porque a descrição cita React.
  */
  if (term.facets.length > 0) {
    let best = 0;

    for (const facet of term.facets) {
      if (facet.kind === "category" && library.category === facet.value) {
        best = Math.max(best, 90);
      }
      if (facet.kind === "framework" && library.framework === facet.value) {
        best = Math.max(best, 95);
      }
      if (
        facet.kind === "license" &&
        licenseFamily(library.license) === facet.value
      ) {
        best = Math.max(best, 85);
      }
    }

    for (const alternative of term.alternatives) {
      if (library.tags.some((tag) => normalize(tag) === alternative)) {
        best = Math.max(best, 70);
      }
    }

    return best;
  }

  if (fuzzy) return fuzzyScoreTerm(term.alternatives, library);

  let best = 0;
  for (const alternative of term.alternatives) {
    best = Math.max(best, scoreTermPrecise(alternative, library, labels));
  }

  return best;
}

function evaluateQuery(
  libraries: Library[],
  terms: SearchTerm[],
  labels: SearchLabels,
  strict: boolean,
  fuzzy = false,
): ScoredLibrary[] {
  const facetTerms = terms.filter((term) => term.facets.length > 0);
  const coreTerms = terms.filter((term) => term.facets.length === 0);
  const results: ScoredLibrary[] = [];

  for (const library of libraries) {
    let score = 0;
    let facetMatched = true;

    for (const term of facetTerms) {
      const termScore = scoreSearchTerm(term, library, labels, fuzzy);
      if (termScore === 0) {
        facetMatched = false;
        break;
      }
      score += termScore;
    }

    if (!facetMatched) continue;

    let coreMatches = 0;
    for (const term of coreTerms) {
      const termScore = scoreSearchTerm(term, library, labels, fuzzy);
      if (termScore > 0) {
        coreMatches += 1;
        score += termScore;
      }
    }

    if (strict && coreMatches < coreTerms.length) continue;
    if (!strict && coreTerms.length > 0 && coreMatches === 0) continue;

    // Na busca aproximada, casar mais termos vale mais que casar só um.
    if (!strict) score += coreMatches * 25;

    results.push({ library, score });
  }

  return results;
}

function sortScored(results: ScoredLibrary[]): ScoredLibrary[] {
  return [...results].sort(
    (a, b) =>
      b.score - a.score ||
      (b.library.stars ?? 0) - (a.library.stars ?? 0) ||
      a.library.name.localeCompare(b.library.name),
  );
}

/** A consulta inteira (ou o nome inteiro) aparece no nome da biblioteca? */
function nameMatchesQuery(rawQuery: string, library: Library): boolean {
  const query = foldQuery(rawQuery);
  const name = foldQuery(library.name);
  if (!query || !name) return false;
  return name.includes(query) || query.includes(name);
}

export type CatalogSearchResult = {
  results: ScoredLibrary[];
  query: SearchQuery;
  /**
   * A busca estrita não bastou: os termos descritivos foram relaxados e/ou
   * a grafia foi corrigida. A interface avisa que os resultados são aproximados.
   */
  relaxed: boolean;
};

/**
 * Busca principal do catálogo. Primeiro tenta casar todos os termos; se não
 * houver resultado, mantém os filtros (framework/categoria/licença) e relaxa
 * os termos descritivos. Se ainda assim não houver nada, tenta corrigir a
 * grafia. É determinística e não faz nenhuma chamada externa.
 */
export function searchCatalog(
  libraries: Library[],
  query: string,
  labels: SearchLabels = {},
): CatalogSearchResult {
  const searchQuery = buildSearchQuery(query);

  if (searchQuery.terms.length === 0) {
    return {
      results: libraries.map((library) => ({ library, score: 0 })),
      query: searchQuery,
      relaxed: false,
    };
  }

  const strict = evaluateQuery(libraries, searchQuery.terms, labels, true);
  if (strict.length > 0) {
    /*
      Uma consulta com vários termos pode ter um único resultado exato (por
      exemplo, "tabela editável" → Handsontable). Nesse caso vale mostrar
      também os resultados que casam com parte da consulta, desde que o nome
      do resultado exato não seja a própria consulta (aí o usuário está
      procurando uma biblioteca específica).
    */
    const shouldBroaden =
      strict.length < 2 &&
      searchQuery.terms.length > 1 &&
      !nameMatchesQuery(query, strict[0].library);

    if (shouldBroaden) {
      const relaxedExact = evaluateQuery(
        libraries,
        searchQuery.terms,
        labels,
        false,
      );
      const seen = new Set(strict.map((item) => item.library.slug));
      const extras = relaxedExact.filter(
        (item) => !seen.has(item.library.slug),
      );

      if (extras.length > 0) {
        return {
          results: sortScored([...strict, ...extras]),
          query: searchQuery,
          relaxed: true,
        };
      }
    }

    return {
      results: sortScored(strict),
      query: searchQuery,
      relaxed: false,
    };
  }

  const relaxed = evaluateQuery(libraries, searchQuery.terms, labels, false);
  if (relaxed.length > 0) {
    return {
      results: sortScored(relaxed),
      query: searchQuery,
      relaxed: true,
    };
  }

  /* Último recurso: erro de digitação em um dos termos. */
  const fuzzyStrict = evaluateQuery(
    libraries,
    searchQuery.terms,
    labels,
    true,
    true,
  );
  if (fuzzyStrict.length > 0) {
    return {
      results: sortScored(fuzzyStrict),
      query: searchQuery,
      relaxed: true,
    };
  }

  const fuzzyRelaxed = evaluateQuery(
    libraries,
    searchQuery.terms,
    labels,
    false,
    true,
  );
  return {
    results: sortScored(fuzzyRelaxed),
    query: searchQuery,
    relaxed: fuzzyRelaxed.length > 0,
  };
}
