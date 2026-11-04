import type { Metadata } from "next";
import { Suspense } from "react";
import { ExplorerFallback } from "@/components/explorer-fallback";
import { LibraryExplorer } from "@/components/library-explorer";
import { assistants, assistantToLibrary } from "@/lib/assistants";
import { libraries } from "@/lib/libraries";
import { isLocale } from "@/i18n/config";
import { formatText } from "@/i18n/format";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizeLibrary } from "@/i18n/library-text";

type PageProps = {
  params: Promise<{ lang: string }>;
};

/*
  Página de IA: o recorte de ferramentas do catálogo (categoria `ia`) e os
  assistentes de chat no mesmo explorador da home. Os assistentes são
  adaptados ao formato da galeria, mas o card aponta para o site oficial em
  vez de abrir uma ficha interna.

  Como a rota lê os `params` no topo, a navegação para cá bloqueia até o
  idioma ser resolvido — `instant = false` assume isso, como nas outras
  páginas do site.
*/
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);

  return {
    title: dict.ai.metaTitle,
    description: dict.ai.metaDescription,
    alternates: {
      canonical: `/${locale}/ia`,
      languages: {
        "pt-BR": "/pt/ia",
        en: "/en/ia",
      },
    },
    openGraph: {
      title: `${dict.ai.metaTitle} - Acervo`,
      description: dict.ai.metaDescription,
    },
  };
}

export default async function AiPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);

  const aiEntries = [
    ...libraries
      .filter((library) => library.category === "ia")
      .map((library) => localizeLibrary(locale, library)),
    ...assistants.map((assistant) => assistantToLibrary(locale, assistant)),
  ];

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {dict.ai.eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {dict.ai.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {formatText(dict.ai.intro, { n: aiEntries.length })}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4">
        <Suspense fallback={<ExplorerFallback />}>
          <LibraryExplorer
            libraries={aiEntries}
            locale={locale}
            dict={dict}
            variant="ai"
          />
        </Suspense>
      </div>
    </>
  );
}
