import Link from "next/link";
import type { Library } from "@/types/library";
import { FRAMEWORK_LABELS } from "@/types/library";
import { formatCompact, getContrastColor, isLightColor } from "@/lib/format";

/* eslint-disable @next/next/no-img-element */

/*
  Cada biblioteca é uma "ficha": o tile preto com a marca branca é o
  elemento marcante da galeria; a legenda abaixo carrega os dados em
  tipografia monoespaçada, como um índice de catálogo.
*/

const WORDMARK_STYLES = [
  "font-serif text-2xl font-semibold italic tracking-tight",
  "font-sans text-2xl font-bold tracking-tight",
  "font-mono text-lg font-medium tracking-tight",
  "font-sans text-lg font-semibold uppercase tracking-[0.18em]",
];

function wordmarkStyle(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  }
  return WORDMARK_STYLES[hash % WORDMARK_STYLES.length];
}

export function domainOf(website: string): string {
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

export function LibraryCard({ library }: { library: Library }) {
  const lightBg = isLightColor(library.color);
  const contrastColor = getContrastColor(library.color);
  const logoStyle = lightBg ? { filter: "invert(1)" as const } : {};

  return (
    <Link href={`/libraries/${library.slug}`} className="group block">
      <div
        className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-border transition-colors duration-200 group-hover:border-foreground/40"
        style={{ backgroundColor: library.color }}
      >
        {library.logo ? (
          <img
            src={`/logos/${library.logo}`}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            className="h-10 w-10 opacity-95 transition-transform duration-200 group-hover:scale-105"
            style={logoStyle}
          />
        ) : (
          <span
            className={`px-4 text-center ${wordmarkStyle(library.name)}`}
            style={{ color: contrastColor }}
          >
            {library.name}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-3">
        <span className="truncate text-[13px] font-medium text-foreground">
          {library.name}
        </span>
        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
          {domainOf(library.website)}
        </span>
      </div>

      <div className="mt-0.5 flex items-baseline justify-between gap-3">
        <span className="truncate text-[11px] text-muted-foreground">
          {FRAMEWORK_LABELS[library.framework]}
        </span>
        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
          {formatCompact(library.stars)} estrelas
        </span>
      </div>
    </Link>
  );
}
