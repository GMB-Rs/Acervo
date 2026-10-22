import { Suspense } from "react";
import { LibraryExplorer } from "@/components/library-explorer";
import { libraries } from "@/lib/libraries";
import { LOCALES, isLocale } from "@/i18n/config";
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

function ExplorerFallback() {
  return (
    <div className="border-y border-border">
      <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center">
        <div className="h-10 w-full rounded-md border border-border lg:w-[480px] xl:w-[544px]" />
        <div className="h-10 w-full rounded-md border border-border sm:w-[180px] lg:ml-auto" />
      </div>
    </div>
  );
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);

  /*
    A galeria busca no texto do idioma: em inglês, procurar "accessibility"
    acha a biblioteca pela descrição e pelas tags traduzidas.
  */
  const localizedLibraries = libraries.map((library) =>
    localizeLibrary(locale, library),
  );

  /*
    Os rótulos de todos os idiomas entram na busca: assim "forms" ou "data"
    filtram o grupo certo mesmo na interface em português.
  */
  const scopeLabelSets = LOCALES.map((item) => {
    const labels = getDictionary(item);
    return {
      framework: labels.frameworkLabels,
      category: labels.categoryLabels,
    };
  });

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {dict.home.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {formatText(dict.home.intro, { n: libraries.length })}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4">
        <Suspense fallback={<ExplorerFallback />}>
          <LibraryExplorer
            libraries={localizedLibraries}
            locale={locale}
            dict={dict}
            scopeLabelSets={scopeLabelSets}
          />
        </Suspense>
      </div>
    </>
  );
}
