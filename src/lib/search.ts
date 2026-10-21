import type { Library } from "@/types/library";

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

/** Nota do termo em um campo (0 = não casou). */
function scoreField(field: string, token: string, weight: number): number {
  if (!matchesTerm(field, token)) return 0;
  return field.startsWith(token) ? weight + PREFIX_BONUS : weight;
}

/* ------------------------------------------------------------------ *
 * Escopo: termos que designam uma categoria ou um framework
 * ------------------------------------------------------------------ */

export type FacetKind = "category" | "framework";

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
 */
export function resolveScope(
  tokens: string[],
  labels: SearchLabels = {},
): SearchScope {
  const scope: SearchScope = [];
  for (const token of tokens) {
    const entries: ScopeEntry[] = [];
    for (const [value, label] of Object.entries(labels.category ?? {})) {
      if (designates(label, token)) {
        entries.push({ kind: "category", value, label });
      }
    }
    for (const [value, label] of Object.entries(labels.framework ?? {})) {
      if (designates(label, token)) {
        entries.push({ kind: "framework", value, label });
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
  let best = 0;

  best = Math.max(best, scoreField(normalize(library.name), token, WEIGHT.name));

  for (const tag of library.tags) {
    best = Math.max(best, scoreField(normalize(tag), token, WEIGHT.tag));
  }

  best = Math.max(
    best,
    scoreField(normalize(library.description), token, WEIGHT.description),
    scoreField(normalize(library.highlight), token, WEIGHT.highlight),
    scoreField(normalize(library.repo ?? ""), token, WEIGHT.repo),
    scoreField(normalize(library.website), token, WEIGHT.website),
  );

  const frameworkLabel = labels.framework?.[library.framework];
  if (frameworkLabel) {
    best = Math.max(
      best,
      scoreField(normalize(frameworkLabel), token, WEIGHT.framework),
    );
  }

  const categoryLabel = labels.category?.[library.category];
  if (categoryLabel) {
    best = Math.max(
      best,
      scoreField(normalize(categoryLabel), token, WEIGHT.category),
    );
  }

  return best;
}

/**
 * Filtra e pontua as bibliotecas: só entram as que casam com **todos** os
 * termos, e o resultado vem ordenado por relevância.
 */
export function searchLibraries(
  libraries: Library[],
  tokens: string[],
  labels: SearchLabels = {},
): ScoredLibrary[] {
  if (tokens.length === 0) {
    return libraries.map((library) => ({ library, score: 0 }));
  }

  const scope = resolveScope(tokens, labels);

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
