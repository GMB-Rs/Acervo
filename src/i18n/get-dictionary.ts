import { DEFAULT_LOCALE, type Locale } from "./config";
import { en } from "./dictionaries/en";
import { pt } from "./dictionaries/pt";
import type { Dictionary } from "./dictionaries/types";

/*
  Dicionário de cada idioma. O módulo é leve o bastante para ser importado
  direto (sem `await import()` dinâmico): o site já carrega o texto de um
  idioma só, e o HTML já sai traduzido na build.
*/

const DICTIONARIES: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export type { Dictionary };
