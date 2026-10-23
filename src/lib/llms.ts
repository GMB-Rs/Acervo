import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { getBaseUrl } from "@/lib/site";
import { catalogEntries } from "@/lib/catalog-export";

/*
  Arquivos para LLMs e agentes.

  `llms.txt` é o índice enxuto (o padrão proposto por Jeremy Howard/Answer.AI):
  título, resumo, links e uma lista curta. `llms-full.txt` traz a ficha
  completa de cada biblioteca. Ambos são gerados a partir do mesmo JSON do
  site, então não há risco de ficarem desatualizados em relação ao catálogo.
*/

function apiUrl(locale: Locale): string {
  return `${getBaseUrl()}/api/libraries?lang=${locale}`;
}

function line(value: string | undefined): string {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

export function buildLlmsIndex(locale: Locale): string {
  const dict = getDictionary(locale);
  const entries = catalogEntries(locale);
  const base = getBaseUrl();
  const otherLocale = locale === "pt" ? "en" : "pt";
  const languageName = dict.languages[locale];

  const lines: string[] = [
    "# Acervo",
    "",
    `> ${line(dict.meta.description)}`,
    "",
    `Idioma: ${languageName}. Outro idioma: ${base}/${otherLocale}`,
    "",
    "## Acesso",
    "",
    `- [Catálogo completo](${base}/llms-full.txt): todas as fichas, em português.`,
    `- [API JSON](${apiUrl(locale)}): busca por intenção, filtros e paginação.`,
    `- [Página do Acervo](${base}/${locale}): interface para pessoas.`,
    `- [MCP](${base}/${locale}/ia): conecte Claude, Cursor ou VS Code ao catálogo.`,
    "",
    "## Bibliotecas",
    "",
  ];

  for (const entry of entries) {
    const framework = dict.frameworkLabels[entry.framework];
    const category = dict.categoryLabels[entry.category];
    const license = dict.license.families[entry.licenseFamily];
    lines.push(
      `- [${entry.name}](${entry.url}): ${line(entry.description)} (${framework}; ${category}; ${license})`,
    );
  }

  lines.push(
    "",
    "## Observações",
    "",
    "- O catálogo é curado por pessoas; descrições e tags são editoriais, não geradas automaticamente.",
    "- Métricas de estrelas e downloads podem estar defasadas; a data do último sync aparece no README.",
    "- A API aceita `q`, `framework`, `category`, `license`, `lang`, `limit` e `offset`.",
    "",
  );

  return lines.join("\n");
}

export function buildLlmsFull(locale: Locale): string {
  const dict = getDictionary(locale);
  const entries = catalogEntries(locale);
  const base = getBaseUrl();
  const languageName = dict.languages[locale];

  const lines: string[] = [
    "# Acervo — catálogo completo",
    "",
    `> ${line(dict.meta.description)}`,
    "",
    `Idioma: ${languageName}. Índice enxuto: ${base}/llms.txt`,
    `API JSON: ${apiUrl(locale)}`,
    "",
  ];

  for (const entry of entries) {
    const framework = dict.frameworkLabels[entry.framework];
    const category = dict.categoryLabels[entry.category];
    const license = dict.license.families[entry.licenseFamily];

    lines.push(
      `## ${entry.name}`,
      "",
      `- Página: ${entry.url}`,
      `- Framework: ${framework}`,
      `- Categoria: ${category}`,
      `- Licença: ${license}`,
      `- Site: ${entry.website}`,
      `- Repositório: ${entry.repoUrl ?? "não informado"}`,
      `- npm: ${entry.npmUrl ?? "não informado"}`,
      `- Tags: ${entry.tags.join(", ") || "nenhuma"}`,
      `- Mantida: ${entry.maintained ? "sim" : "não"}`,
      `- Desde: ${entry.since}`,
      "",
      `Descrição: ${line(entry.description)}`,
      "",
      `Destaque: ${line(entry.highlight)}`,
      "",
    );
  }

  lines.push(
    "## Como citar",
    "",
    "Acervo — catálogo curado de bibliotecas para web. Link para a página da biblioteca citada.",
    "",
  );

  return lines.join("\n");
}
