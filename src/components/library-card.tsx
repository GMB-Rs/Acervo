import Link from "next/link";
import type { Library } from "@/types/library";
import { FRAMEWORK_LABELS } from "@/types/library";
import { formatCompact, getContrastColor, isLightColor } from "@/lib/format";
import { isTextMark, logoBoxClass, textMarkClass } from "@/lib/logo";

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

export function LibraryCard({ library }: { library: Library }) {
  const lightBg = isLightColor(library.color);
  const contrastColor = getContrastColor(library.color);
  const logoStyle = lightBg ? { filter: "invert(1)" as const } : {};

  return (
    <Link href={`/libraries/${library.slug}`} className="group block">
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
