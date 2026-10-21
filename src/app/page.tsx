import { Suspense } from "react";
import { LibraryExplorer } from "@/components/library-explorer";
import { libraries } from "@/lib/libraries";

/*
  O explorador lê a query string (`?q=`, `?framework=`, ...) para manter o
  estado da galeria na URL. Por isso ele precisa de um limite de Suspense:
  a página continua estática e só essa parte é renderizada no cliente.
*/
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

export default function HomePage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Bibliotecas de componentes web
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Galeria de {libraries.length} bibliotecas que já existem: UI kits,
            headless, design systems, formulários, tabelas, ícones e animações.
            Filtre por framework ou categoria e abra a ficha de cada uma.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16">
        <Suspense fallback={<ExplorerFallback />}>
          <LibraryExplorer libraries={libraries} />
        </Suspense>
      </div>
    </>
  );
}
