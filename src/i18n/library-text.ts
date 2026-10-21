/*
  Texto das bibliotecas por idioma.

  O português é a fonte da verdade: `description` e `highlight` moram em
  `src/data/libraries.json`. Os demais idiomas ficam em
  `src/data/translations/<idioma>.json`, mapeados por slug — assim o JSON do
  catálogo continua sendo o arquivo que o `sync:github` mexe.

  As tags seguem a mesma regra: o vocabulário traduzido fica em
  `src/data/translations/tags.<idioma>.json`.

  Os imports aqui são relativos de propósito: é o que deixa o módulo
  rodável no runner nativo do Node (`npm run test`), sem alias.
*/

import enTranslations from "../data/translations/en.json" with { type: "json" };
import enTags from "../data/translations/tags.en.json" with { type: "json" };
import { DEFAULT_LOCALE, type Locale } from "./config.ts";
import type { Library } from "../types/library.ts";

export type LibraryText = {
  description: string;
  highlight: string;
};

const TRANSLATIONS: Partial<Record<Locale, Record<string, LibraryText>>> = {
  en: enTranslations as Record<string, LibraryText>,
};

const TAG_TRANSLATIONS: Partial<Record<Locale, Record<string, string>>> = {
  en: enTags as Record<string, string>,
};

export function libraryText(locale: Locale, library: Library): LibraryText {
  const translated = TRANSLATIONS[locale]?.[library.slug];
  if (translated) return translated;
  return {
    description: library.description,
    highlight: library.highlight,
  };
}

/** Traduz as tags: o vocabulário vem do dicionário de tags do idioma. */
export function translateTags(locale: Locale, tags: string[]): string[] {
  const dictionary = TAG_TRANSLATIONS[locale];
  if (!dictionary) return tags;
  return tags.map((tag) => dictionary[tag] ?? tag);
}

/**
 * Cópia da biblioteca com o texto do idioma: é ela que a busca indexa, de
 * modo que procurar "accessibility" acha a biblioteca também na versão em
 * inglês.
 */
export function localizeLibrary(locale: Locale, library: Library): Library {
  if (locale === DEFAULT_LOCALE) return library;
  const text = libraryText(locale, library);
  return {
    ...library,
    description: text.description,
    highlight: text.highlight,
    tags: translateTags(locale, library.tags),
  };
}
