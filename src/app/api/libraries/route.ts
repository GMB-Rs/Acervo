import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import {
  PUBLIC_API_HEADERS,
  queryCatalog,
} from "@/lib/catalog-export";

/*
  Catálogo público em JSON.

  Exemplos:
  - /api/libraries
  - /api/libraries?q=tabela%20edit%C3%A1vel&lang=pt
  - /api/libraries?framework=react&license=mit&limit=10&offset=0

  A consulta usa a mesma busca por intenção do site. Não há chave, login ou
  limite de chamadas no servidor; o cache de borda da Vercel absorve o tráfego.
*/

function readNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const rawLocale = params.get("lang") ?? params.get("language") ?? DEFAULT_LOCALE;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const result = queryCatalog({
    locale,
    query: params.get("q") ?? params.get("query") ?? undefined,
    framework: params.get("framework") ?? undefined,
    category: params.get("category") ?? params.get("categoria") ?? undefined,
    license: params.get("license") ?? params.get("licenca") ?? undefined,
    limit: readNumber(params.get("limit")),
    offset: readNumber(params.get("offset")),
  });

  return Response.json(
    {
      catalog: "Acervo",
      locale,
      ...result,
    },
    { headers: PUBLIC_API_HEADERS },
  );
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: PUBLIC_API_HEADERS,
  });
}
