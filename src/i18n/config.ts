/*
  Idiomas do diretório.

  O site é bilíngue: português (padrão) e inglês. O idioma vive na URL
  (`/pt/...`, `/en/...`), então a página é gerada por idioma e o link pode
  ser compartilhado já no idioma de quem lê.
*/

export const LOCALES = ["pt", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt";

/** Nome do idioma, no próprio idioma (como manda a boa prática). */
export const LOCALE_LABELS: Record<Locale, string> = {
  pt: "Português",
  en: "English",
};

/** Sigla curta, para o botão do seletor. */
export const LOCALE_SHORT: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
};

/** Valor do atributo `lang` do <html> em cada idioma. */
export const HTML_LANG: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
