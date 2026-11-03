import type { Metadata } from "next";
import { Suspense } from "react";
import { AssistantCard } from "@/components/assistant-card";
import { ExplorerFallback } from "@/components/explorer-fallback";
import { LibraryExplorer } from "@/components/library-explorer";
import { assistants, localizeAssistant } from "@/lib/assistants";
import { libraries } from "@/lib/libraries";
import { isLocale } from "@/i18n/config";
import { formatText } from "@/i18n/format";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizeLibrary } from "@/i18n/library-text";

type PageProps = {
  params: Promise<{ lang: string }>;
};

/*
  Recorte do catálogo só com ferramentas de IA (categoria `ia`). A galeria é
  a mesma da home, com o explorador no modo "tools": fala em ferramentas e
  esconde o filtro de categoria, já que a página inteira é uma categoria só.

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

  const aiLibraries = libraries
    .filter((library) => library.category === "ia")
    .map((library) => localizeLibrary(locale, library));
  const aiAssistants = assistants.map((assistant) =>
    localizeAssistant(locale, assistant),
  );

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
            {formatText(dict.ai.intro, { n: aiLibraries.length })}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4">
        <Suspense fallback={<ExplorerFallback />}>
          <LibraryExplorer
            libraries={aiLibraries}
            locale={locale}
            dict={dict}
            variant="tools"
          />
        </Suspense>
      </div>

      <section className="mt-14 border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {dict.ai.eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
            {dict.ai.assistantsTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {dict.ai.assistantsIntro}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {aiAssistants.map((assistant) => (
              <AssistantCard
                key={assistant.slug}
                assistant={assistant}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
