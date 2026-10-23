import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import {
  getCatalogEntry,
  PUBLIC_API_HEADERS,
} from "@/lib/catalog-export";

/*
  Ficha pública de uma biblioteca. A mesma forma de `/api/libraries`, sem
  paginação. O `lang` aceita `pt` (padrão) e `en`.
*/
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const rawLocale = url.searchParams.get("lang") ?? DEFAULT_LOCALE;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const item = getCatalogEntry(locale, slug);

  if (!item) {
    return Response.json(
      {
        error: "not_found",
        message: `Biblioteca "${slug}" não encontrada.`,
      },
      { status: 404, headers: PUBLIC_API_HEADERS },
    );
  }

  return Response.json(
    {
      catalog: "Acervo",
      locale,
      item,
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
