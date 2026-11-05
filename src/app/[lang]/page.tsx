import { Suspense } from "react";
import { ExplorerFallback } from "@/components/explorer-fallback";
import { LibraryExplorer } from "@/components/library-explorer";
import { assistants, localizeAssistant } from "@/lib/assistants";
import { libraries } from "@/lib/libraries";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatText } from "@/i18n/format";
import { localizeLibrary } from "@/i18n/library-text";

/*
  O explorador lê a query string (`?q=`, `?framework=`, ...) para manter o
  estado da galeria na URL. Por isso ele precisa de um limite de Suspense:
  a página continua estática e só essa parte é renderizada no cliente.

  O idioma, por outro lado, é lido no topo — a página inteira depende dele.
*/
export const instant = false;

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);

  /*
    A galeria busca no texto do idioma: em inglês, procurar "accessibility"
    acha a biblioteca pela descrição e pelas tags traduzidas.

    Os assistentes de IA entram na mesma galeria da home: são produtos, então
    abrem a ordem padrão e aparecem também no filtro da categoria IA.
  */
  const localizedLibraries = libraries.map((library) =>
    localizeLibrary(locale, library),
  );
  const localizedAssistants = assistants.map((assistant) =>
    localizeAssistant(locale, assistant),
  );

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {dict.home.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {formatText(dict.home.intro, {
              n: libraries.length + assistants.length,
            })}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4">
        <Suspense fallback={<ExplorerFallback />}>
          <LibraryExplorer
            libraries={localizedLibraries}
            assistants={localizedAssistants}
            locale={locale}
            dict={dict}
          />
        </Suspense>
      </div>
    </>
  );
}
