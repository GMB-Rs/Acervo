/*
  Dataset dos assistentes de IA (ChatGPT, Claude, Gemini…).

  Eles são produtos, não bibliotecas: não entram em `libraries.json`, mas
  aparecem na galeria unificada de IA. O texto em português vive em
  `src/data/assistants.json` e a tradução em
  `src/data/translations/assistants.en.json`, pelo slug.

  Os imports são relativos de propósito: é o que deixa o módulo rodável no
  runner nativo do Node (`npm run test`), sem alias.
*/

import assistantsJson from "../data/assistants.json" with { type: "json" };
import assistantTranslations from "../data/translations/assistants.en.json" with { type: "json" };
import { DEFAULT_LOCALE, type Locale } from "../i18n/config.ts";
import type { Assistant } from "../types/assistant.ts";

const LOGO_KINDS = new Set(["mark", "wide", "text"]);

type RawAssistant = Omit<Assistant, "logoKind"> & { logoKind?: string };

type AssistantText = {
  description: string;
  highlight: string;
};

const TRANSLATIONS: Partial<Record<Locale, Record<string, AssistantText>>> = {
  en: assistantTranslations as Record<string, AssistantText>,
};

function parseAssistants(raw: RawAssistant[]): Assistant[] {
  const seen = new Set<string>();

  return raw.map((item) => {
    if (seen.has(item.slug)) {
      throw new Error(`Assistente duplicado "${item.slug}"`);
    }
    seen.add(item.slug);

    if (!/^#[0-9a-f]{6}$/i.test(item.color)) {
      throw new Error(`Cor inválida "${item.color}" em "${item.slug}"`);
    }
    if (item.logoKind && !LOGO_KINDS.has(item.logoKind)) {
      throw new Error(`logoKind inválido "${item.logoKind}" em "${item.slug}"`);
    }
    if (!item.logo && item.logoKind !== "text") {
      throw new Error(`Assistente "${item.slug}" precisa de logo ou logoKind "text"`);
    }

    return {
      ...item,
      logoKind: item.logoKind as Assistant["logoKind"],
    };
  });
}

export const assistants: Assistant[] = parseAssistants(
  assistantsJson as unknown as RawAssistant[],
);

export function getAllAssistantSlugs(): string[] {
  return assistants.map((assistant) => assistant.slug);
}

export function getAssistantBySlug(slug: string): Assistant | undefined {
  return assistants.find((assistant) => assistant.slug === slug);
}

/** Texto do assistente no idioma pedido, com o português como reserva. */
export function assistantText(
  locale: Locale,
  assistant: Assistant,
): AssistantText {
  const translated = TRANSLATIONS[locale]?.[assistant.slug];
  if (translated) return translated;
  return {
    description: assistant.description,
    highlight: assistant.highlight,
  };
}

/** Cópia do assistente com o texto do idioma. */
export function localizeAssistant(
  locale: Locale,
  assistant: Assistant,
): Assistant {
  if (locale === DEFAULT_LOCALE) return assistant;
  const text = assistantText(locale, assistant);
  return {
    ...assistant,
    description: text.description,
    highlight: text.highlight,
  };
}
