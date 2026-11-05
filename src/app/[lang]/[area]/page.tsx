import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExplorerFallback } from "@/components/explorer-fallback";
import { LibraryExplorer } from "@/components/library-explorer";
import {
  AREAS,
  areaCategories,
  isArea,
  librariesForArea,
} from "@/lib/areas";
import { libraries } from "@/lib/libraries";
import { isLocale } from "@/i18n/config";
import { formatText } from "@/i18n/format";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizeLibrary } from "@/i18n/library-text";

type PageProps = {
  params: Promise<{ lang: string; area: string }>;
};

/*
  Página de uma área do catálogo (Front, Back, DevOps).

  O recorte é feito pelas categorias da área e passado para o explorador,
  que mantém busca, filtros de categoria/framework/licença, ordenação e
  paginação. Como a rota lê os `params` no topo, a navegação bloqueia até o
  idioma ser resolvido — `instant = false` assume isso, como nas outras
  páginas do site.
*/
export const instant = false;

export function generateStaticParams() {
  return AREAS.map((area) => ({ area }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, area } = await params;
  if (!isArea(area)) return {};

  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);
  const copy = dict.areas[area];

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: `/${locale}/${area}`,
      languages: {
        "pt-BR": `/pt/${area}`,
        en: `/en/${area}`,
      },
    },
    openGraph: {
      title: `${copy.metaTitle} - Acervo`,
      description: copy.metaDescription,
    },
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { lang, area } = await params;
  if (!isArea(area)) notFound();

  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);
  const copy = dict.areas[area];
  const categories = areaCategories(area);
  const areaLibraries = librariesForArea(area, libraries).map((library) =>
    localizeLibrary(locale, library),
  );

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {dict.areas.eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {formatText(copy.intro, { n: areaLibraries.length })}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4">
        <Suspense fallback={<ExplorerFallback />}>
          <LibraryExplorer
            libraries={areaLibraries}
            locale={locale}
            dict={dict}
            categories={categories}
          />
        </Suspense>
      </div>
    </>
  );
}
