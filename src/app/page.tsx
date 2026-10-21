import { LibraryExplorer } from "@/components/library-explorer";
import { libraries } from "@/lib/libraries";

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
        <LibraryExplorer libraries={libraries} />
      </div>
    </>
  );
}
