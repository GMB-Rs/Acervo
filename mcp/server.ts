/*
  Servidor MCP local do Acervo (stdio, sem chave e sem rede).

  Ele expõe o mesmo catálogo e a mesma busca por intenção do site para
  clientes MCP como Claude Desktop, Cursor e VS Code. Rode com:

    npm run mcp

  O transporte é JSON-RPC 2.0 por linha no stdin/stdout. Nada é escrito no
  stdout além do protocolo; logs vão para o stderr.
*/

import { createInterface } from "node:readline";
import librariesJson from "../src/data/libraries.json" with { type: "json" };
import { en } from "../src/i18n/dictionaries/en.ts";
import { pt } from "../src/i18n/dictionaries/pt.ts";
import { localizeLibrary } from "../src/i18n/library-text.ts";
import { licenseFamily, LICENSE_FAMILIES } from "../src/lib/license.ts";
import {
  queryFacetLabels,
  searchCatalog,
} from "../src/lib/search.ts";
import {
  DEFAULT_STACK_NEEDS,
  STACK_GOALS,
  STACK_NEEDS,
  recommendStack,
  type StackGoal,
  type StackFramework,
  type StackNeed,
} from "../src/lib/stack.ts";
import {
  CATEGORIES,
  FRAMEWORKS,
  type Category,
  type Framework,
  type Library,
} from "../src/types/library.ts";
import type { Locale } from "../src/i18n/config.ts";

const libraries = librariesJson as unknown as Library[];
const DICTIONARIES = { pt, en } as const;
const BASE_URL =
  process.env.ACERVO_BASE_URL?.replace(/\/$/, "") ??
  "https://acervo-azure.vercel.app";

type JsonRpcId = string | number | null;
type JsonRpcRequest = {
  jsonrpc?: string;
  id?: JsonRpcId;
  method?: string;
  params?: unknown;
};
type ToolArgs = Record<string, unknown>;

const FRAMEWORK_SET = new Set<string>(FRAMEWORKS);
const CATEGORY_SET = new Set<string>(CATEGORIES);
const LICENSE_SET = new Set<string>(LICENSE_FAMILIES);
const GOAL_SET = new Set<string>(STACK_GOALS);
const NEED_SET = new Set<string>(STACK_NEEDS);

function send(message: unknown) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function sendResult(id: JsonRpcId, result: unknown) {
  send({ jsonrpc: "2.0", id, result });
}

function sendError(id: JsonRpcId, code: number, message: string) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

function asRecord(value: unknown): ToolArgs {
  return typeof value === "object" && value !== null
    ? (value as ToolArgs)
    : {};
}

function stringArg(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : undefined;
}

function numberArg(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function booleanArg(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function localeArg(value: unknown): Locale {
  return value === "en" ? "en" : "pt";
}

function dictFor(locale: Locale) {
  return DICTIONARIES[locale];
}

function labelsFor(locale: Locale) {
  const dict = dictFor(locale);
  return {
    framework: dict.frameworkLabels,
    category: dict.categoryLabels,
    license: dict.license.families,
  };
}

function localizedLibraries(locale: Locale): Library[] {
  return libraries.map((library) => localizeLibrary(locale, library));
}

function entry(library: Library, locale: Locale) {
  return {
    slug: library.slug,
    name: library.name,
    description: library.description,
    highlight: library.highlight,
    framework: library.framework,
    category: library.category,
    license: library.license,
    licenseFamily: licenseFamily(library.license),
    tags: library.tags,
    website: library.website,
    docs: library.docs,
    repo: library.repo,
    npmPackage: library.npmPackage,
    stars: library.stars,
    npmDownloads: library.npmDownloads,
    maintained: library.maintained,
    since: library.since,
    featured: Boolean(library.featured),
    url: `${BASE_URL}/${locale}/libraries/${library.slug}`,
    repoUrl: library.repo ? `https://github.com/${library.repo}` : undefined,
    npmUrl: library.npmPackage
      ? `https://www.npmjs.com/package/${library.npmPackage}`
      : undefined,
  };
}

function validateFramework(value: string | undefined): Framework | undefined {
  if (!value) return undefined;
  if (!FRAMEWORK_SET.has(value)) {
    throw new Error(
      `Framework inválido: ${value}. Use um de: ${FRAMEWORKS.join(", ")}.`,
    );
  }
  return value as Framework;
}

function validateCategory(value: string | undefined): Category | undefined {
  if (!value) return undefined;
  if (!CATEGORY_SET.has(value)) {
    throw new Error(
      `Categoria inválida: ${value}. Use uma de: ${CATEGORIES.join(", ")}.`,
    );
  }
  return value as Category;
}

function validateLicense(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (!LICENSE_SET.has(value)) {
    throw new Error(
      `Licença inválida: ${value}. Use uma de: ${LICENSE_FAMILIES.join(", ")}.`,
    );
  }
  return value;
}

function searchTool(args: ToolArgs) {
  const locale = localeArg(args.language);
  const framework = validateFramework(stringArg(args.framework));
  const category = validateCategory(stringArg(args.category));
  const license = validateLicense(stringArg(args.license));
  const limit = Math.min(Math.max(numberArg(args.limit) ?? 10, 1), 50);

  const filtered = localizedLibraries(locale).filter((library) => {
    if (framework && library.framework !== framework) return false;
    if (category && library.category !== category) return false;
    if (license && licenseFamily(library.license) !== license) return false;
    return true;
  });
  const result = searchCatalog(
    filtered,
    stringArg(args.query) ?? "",
    labelsFor(locale),
  );

  return {
    locale,
    query: stringArg(args.query) ?? "",
    total: result.results.length,
    relaxed: result.relaxed,
    smart: result.query.smart,
    facets: queryFacetLabels(result.query, labelsFor(locale)),
    results: result.results
      .slice(0, limit)
      .map((item) => entry(item.library, locale)),
  };
}

function getLibraryTool(args: ToolArgs) {
  const locale = localeArg(args.language);
  const slug = stringArg(args.slug);
  if (!slug) throw new Error("O campo `slug` é obrigatório.");

  const library = libraries.find((item) => item.slug === slug);
  if (!library) {
    throw new Error(`Biblioteca "${slug}" não encontrada no Acervo.`);
  }

  return { locale, item: entry(localizeLibrary(locale, library), locale) };
}

function recommendStackTool(args: ToolArgs) {
  const locale = localeArg(args.language);
  const rawGoal = stringArg(args.goal) ?? "dashboard";
  if (!GOAL_SET.has(rawGoal)) {
    throw new Error(
      `Objetivo inválido: ${rawGoal}. Use um de: ${STACK_GOALS.join(", ")}.`,
    );
  }
  const goal = rawGoal as StackGoal;

  const rawFramework = stringArg(args.framework) ?? "any";
  if (rawFramework !== "any" && !FRAMEWORK_SET.has(rawFramework)) {
    throw new Error(
      `Framework inválido: ${rawFramework}. Use "any" ou um de: ${FRAMEWORKS.join(", ")}.`,
    );
  }
  const framework = rawFramework as StackFramework;

  const rawNeeds = Array.isArray(args.needs)
    ? args.needs.filter((item): item is string => typeof item === "string")
    : [];
  for (const need of rawNeeds) {
    if (!NEED_SET.has(need)) {
      throw new Error(
        `Necessidade inválida: ${need}. Use uma de: ${STACK_NEEDS.join(", ")}.`,
      );
    }
  }
  const needs = rawNeeds.length > 0
    ? (rawNeeds as StackNeed[])
    : DEFAULT_STACK_NEEDS[goal];

  const plan = recommendStack(localizedLibraries(locale), {
    goal,
    framework,
    needs,
    openSourceOnly: booleanArg(args.openSourceOnly, true),
  });

  return {
    locale,
    goal,
    framework,
    picks: plan.picks.map((pick) => ({
      need: pick.need,
      library: entry(pick.library, locale),
      score: pick.score,
      matchedTags: pick.matchedTags,
      universal: pick.universal,
      alternatives: pick.alternatives.map((item) => entry(item, locale)),
    })),
    notes: plan.notes,
  };
}

const TOOLS = [
  {
    name: "search_libraries",
    description:
      "Busca bibliotecas no catálogo Acervo por nome, tag, descrição ou linguagem natural. Aceita filtros de framework, categoria e licença.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Texto livre. Ex.: 'tabela editável', 'formulário acessível', 'gráficos para dashboard'.",
        },
        framework: { type: "string", enum: [...FRAMEWORKS] },
        category: { type: "string", enum: [...CATEGORIES] },
        license: { type: "string", enum: [...LICENSE_FAMILIES] },
        language: { type: "string", enum: ["pt", "en"], default: "pt" },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 50,
          default: 10,
        },
      },
      required: [],
    },
  },
  {
    name: "get_library",
    description:
      "Retorna a ficha completa de uma biblioteca do Acervo pelo slug (ex.: shadcn-ui, tanstack-table).",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Slug da biblioteca." },
        language: { type: "string", enum: ["pt", "en"], default: "pt" },
      },
      required: ["slug"],
    },
  },
  {
    name: "recommend_stack",
    description:
      "Monta uma stack determinística de bibliotecas para um tipo de projeto, framework e necessidades. Não usa LLM nem chave.",
    inputSchema: {
      type: "object",
      properties: {
        goal: {
          type: "string",
          enum: [...STACK_GOALS],
          default: "dashboard",
        },
        framework: {
          type: "string",
          enum: ["any", ...FRAMEWORKS],
          default: "any",
        },
        needs: {
          type: "array",
          items: { type: "string", enum: [...STACK_NEEDS] },
          description: "Necessidades do projeto. Sem `needs`, usa o padrão do objetivo.",
        },
        openSourceOnly: { type: "boolean", default: true },
        language: { type: "string", enum: ["pt", "en"], default: "pt" },
      },
      required: [],
    },
  },
] as const;

function llmsText(locale: Locale): string {
  const dict = dictFor(locale);
  const entries = localizedLibraries(locale).map((library) =>
    entry(library, locale),
  );
  return [
    "# Acervo",
    "",
    `> ${dict.meta.description}`,
    "",
    `Idioma: ${dict.languages[locale]}`,
    "",
    "## Bibliotecas",
    "",
    ...entries.map(
      (item) =>
        `- [${item.name}](${item.url}): ${item.description} (${dict.frameworkLabels[item.framework]}; ${dict.categoryLabels[item.category]}; ${dict.license.families[item.licenseFamily]})`,
    ),
    "",
  ].join("\n");
}

function resourceContent(uri: string) {
  const match = /^acervo:\/\/(libraries|llms)\/(pt|en)$/.exec(uri);
  if (!match) throw new Error(`Recurso desconhecido: ${uri}`);

  const [, kind, rawLocale] = match;
  const locale = rawLocale === "en" ? "en" : "pt";

  if (kind === "libraries") {
    return {
      uri,
      mimeType: "application/json",
      text: JSON.stringify(
        {
          locale,
          total: libraries.length,
          items: localizedLibraries(locale).map((library) =>
            entry(library, locale),
          ),
        },
        null,
        2,
      ),
    };
  }

  return {
    uri,
    mimeType: "text/plain",
    text: llmsText(locale),
  };
}

function handleToolCall(name: string, args: ToolArgs) {
  switch (name) {
    case "search_libraries":
      return searchTool(args);
    case "get_library":
      return getLibraryTool(args);
    case "recommend_stack":
      return recommendStackTool(args);
    default:
      throw new Error(`Ferramenta desconhecida: ${name}`);
  }
}

function handleRequest(request: JsonRpcRequest) {
  const id = request.id ?? null;
  const method = request.method;
  const params = asRecord(request.params);

  if (method === "initialize") {
    sendResult(id, {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: { listChanged: false },
        resources: { listChanged: false, subscribe: false },
      },
      serverInfo: { name: "acervo", version: "1.0.0" },
    });
    return;
  }

  if (method === "notifications/initialized" || method === "notifications/cancelled") {
    return;
  }

  if (method === "ping") {
    sendResult(id, {});
    return;
  }

  if (method === "tools/list") {
    sendResult(id, { tools: TOOLS });
    return;
  }

  if (method === "tools/call") {
    const name = stringArg(params.name);
    if (!name) {
      sendError(id, -32602, "O nome da ferramenta é obrigatório.");
      return;
    }

    try {
      const payload = handleToolCall(name, asRecord(params.arguments));
      sendResult(id, {
        content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
        structuredContent: payload,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendResult(id, {
        content: [{ type: "text", text: message }],
        isError: true,
      });
    }
    return;
  }

  if (method === "resources/list") {
    sendResult(id, {
      resources: ["pt", "en"].flatMap((locale) => [
        {
          uri: `acervo://libraries/${locale}`,
          name: `Catálogo Acervo (${locale})`,
          mimeType: "application/json",
        },
        {
          uri: `acervo://llms/${locale}`,
          name: `Acervo llms.txt (${locale})`,
          mimeType: "text/plain",
        },
      ]),
    });
    return;
  }

  if (method === "resources/read") {
    const uri = stringArg(params.uri);
    if (!uri) {
      sendError(id, -32602, "O campo `uri` é obrigatório.");
      return;
    }
    try {
      sendResult(id, { contents: [resourceContent(uri)] });
    } catch (error) {
      sendError(
        id,
        -32602,
        error instanceof Error ? error.message : String(error),
      );
    }
    return;
  }

  if (request.id !== undefined) {
    sendError(id, -32601, `Método não suportado: ${method ?? "(vazio)"}`);
  }
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });

rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let request: JsonRpcRequest;
  try {
    request = JSON.parse(trimmed) as JsonRpcRequest;
  } catch {
    sendError(null, -32700, "JSON inválido.");
    return;
  }

  try {
    handleRequest(request);
  } catch (error) {
    sendError(
      request.id ?? null,
      -32603,
      error instanceof Error ? error.message : String(error),
    );
  }
});

process.stdout.on("error", (error: NodeJS.ErrnoException) => {
  // O cliente fechou o pipe: encerra sem stack trace no stderr.
  if (error.code === "EPIPE") process.exit(0);
  throw error;
});

process.stderr.write(
  `Acervo MCP server pronto (stdio, ${libraries.length} bibliotecas).\n`,
);
