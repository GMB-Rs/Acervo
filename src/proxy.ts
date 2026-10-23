import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";

/*
  O idioma vive na URL (`/pt`, `/en`), então a raiz precisa saber para onde
  mandar o visitante: cookie da última escolha, `Accept-Language` do
  navegador ou o idioma padrão.

  O proxy também traduz endereços sem idioma na frente (`/libraries/react`,
  `/qualquer-coisa`) para o formato novo (`/pt/libraries/react`), para os
  links já publicados continuarem funcionando — e para que a página 404 do
  site (com cabeçalho e tema) apareça em vez da 404 genérica do Next.
*/

const COOKIE = "locale";

function preferredLocale(request: NextRequest): string {
  const saved = request.cookies.get(COOKIE)?.value;
  if (saved && isLocale(saved)) return saved;

  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.split(";")[0]?.trim().toLowerCase() ?? "";
    const language = code.split("-")[0] ?? "";
    if (isLocale(language)) return language;
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Raiz: manda para a galeria no idioma do visitante.
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}`;
    return NextResponse.redirect(url);
  }

  const [, first = "", ...rest] = pathname.split("/");

  // O primeiro pedaço da URL é o idioma. Se não for um idioma conhecido,
  // o endereço é de antes da versão com idioma (ou está quebrado) — nos dois
  // casos a gente joga o visitante para a galeria no idioma dele.
  if (!isLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}/${[first, ...rest].join("/")}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  /*
    Tudo entra no proxy, menos os arquivos estáticos: assim qualquer
    endereço sem idioma na frente (incluindo os antigos `/libraries/...`)
    é redirecionado para a rota certa. O `favicon.ico` e o `icon.svg` são
    servidos pelo App Router na raiz e precisam ficar de fora — e o mesmo
    vale para a API (`/api/...`), que não tem idioma.
  */
  matcher: [
    "/((?!_next/|logos/|api/|favicon\\.ico|icon\\.svg|robots\\.txt|sitemap\\.xml).*)",
  ],
};
