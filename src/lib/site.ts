/*
  Domínio canônico do site.

  O Acervo é deployado na Vercel, e cada deploy tem um URL próprio. O
  domínio canônico precisa ser o mesmo em toda parte — `metadataBase`,
  `sitemap.xml` e `robots.txt` — senão o Google indexa URLs diferentes
  para o mesmo conteúdo.

  Hoje o domínio é `acervo.app` (domínio próprio apontando para a Vercel).
  Para trocar, ou para usar um fork em outro domínio, defina a variável
  `NEXT_PUBLIC_SITE_URL` no painel da Vercel (Settings → Environment
  Variables) — ela tem prioridade sobre o valor padrão abaixo.

  A variável precisa existir no momento do build: as rotas `sitemap.xml` e
  `robots.txt` são geradas estaticamente, então o valor é congelado no
  HTML do deploy.
*/

const DEFAULT_SITE_URL = "https://acervo.app";

function withProtocol(host: string): string {
  return host.startsWith("http://") || host.startsWith("https://")
    ? host
    : `https://${host}`;
}

/** Remove a barra final para não duplicar a sepração na hora de juntar. */
function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * URL base do site, sem barra no final.
 *
 * É usada como `metadataBase` e como prefixo das entradas do sitemap.
 */
export function getBaseUrl(): string {
  const custom = process.env.NEXT_PUBLIC_SITE_URL;
  if (custom) return trimTrailingSlash(withProtocol(custom));

  return trimTrailingSlash(DEFAULT_SITE_URL);
}

/** Mesma coisa, já como `URL` — para o `metadataBase` do Next. */
export function getBaseUrlObject(): URL {
  return new URL(getBaseUrl());
}
