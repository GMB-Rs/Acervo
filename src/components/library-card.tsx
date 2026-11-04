import Link from "next/link";
import type { Library } from "@/types/library";
import { formatCompact, getContrastColor, isLightColor } from "@/lib/format";
import { isTextMark, logoBoxClass, textMarkClass } from "@/lib/logo";
import { highlightParts } from "@/lib/search";
import { HTML_LANG, type Locale } from "@/i18n/config";
import { formatText } from "@/i18n/format";
import type { Dictionary } from "@/i18n/dictionaries/types";

/* eslint-disable @next/next/no-img-element */

/*
  Cada biblioteca é uma "ficha": o tile preto com a marca branca é o
  elemento marcante da galeria; a legenda abaixo carrega os dados em
  tipografia monoespaçada, como um índice de catálogo.
*/

export function domainOf(website: string): string {
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

export function LibraryCard({
  library,
  highlight = [],
  locale,
  dict,
  from,
}: {
  library: Library;
  /** Termos buscados: o trecho casado no nome fica sublinhado. */
  highlight?: string[];
  /** Idioma da página — o link da ficha carrega o idioma. */
  locale: Locale;
  dict: Dictionary;
  /** Endereço da galeria de origem, para o botão de voltar da ficha. */
  from?: string;
}) {
  const lightBg = isLightColor(library.color);
  const contrastColor = getContrastColor(library.color);
  const logoStyle = lightBg ? { filter: "invert(1)" as const } : {};
  const isAssistant = library.kind === "assistant";

  const href = from
    ? `/${locale}/libraries/${library.slug}?from=${encodeURIComponent(from)}`
    : `/${locale}/libraries/${library.slug}`;

  const content = (
    <>
      <div
        className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-border px-3 transition-colors duration-200 group-hover:border-foreground/40"
        style={{ backgroundColor: library.color }}
      >
        {library.logo && !isTextMark(library) ? (
          <img
            src={`/logos/${library.logo}`}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            className={`${logoBoxClass(library, "sm")} opacity-95 transition-transform duration-200 group-hover:scale-105`}
            style={logoStyle}
          />
        ) : (
          <span
            className={textMarkClass(library.name, "sm")}
            style={{ color: contrastColor }}
          >
            {library.name}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-3">
        <span className="min-w-0 truncate text-[13px] font-medium text-foreground">
          {highlightParts(library.name, highlight).map((part, index) =>
            part.match ? (
              <mark
                key={index}
                className="bg-transparent text-foreground underline decoration-foreground/50 underline-offset-4"
              >
                {part.text}
              </mark>
            ) : (
              <span key={index}>{part.text}</span>
            ),
          )}
        </span>
        <span className="max-w-[45%] truncate font-mono text-[11px] text-muted-foreground">
          {domainOf(library.website)}
        </span>
      </div>

      <div className="mt-0.5 flex items-baseline justify-between gap-3">
        {isAssistant ? (
          <>
            <span className="truncate text-[11px] text-muted-foreground">
              {dict.card.assistant}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
              {formatText(dict.card.since, { year: library.since })}
            </span>
          </>
        ) : (
          <>
            <span className="truncate text-[11px] text-muted-foreground">
              {dict.frameworkLabels[library.framework]}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
              {formatText(dict.card.stars, {
                count: formatCompact(library.stars, HTML_LANG[locale]),
              })}
            </span>
          </>
        )}
      </div>
    </>
  );

  if (isAssistant) {
    return (
      <a
        href={library.website}
        target="_blank"
        rel="noreferrer"
        className="group block"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="group block">
      {content}
    </Link>
  );
}
