import Link from "next/link";

/*
  404 dentro de um idioma: biblioteca que não existe no catálogo. A página é
  desenhada dentro do layout de `[lang]`, então herda cabeçalho e tema.
*/
export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-start px-4 py-24">
      <p className="font-mono text-xs text-muted-foreground">erro 404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Essa biblioteca não existe
      </h1>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
        O endereço pode estar quebrado ou a biblioteca ainda não foi catalogada.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-9 items-center rounded-md bg-accent px-4 text-xs font-semibold text-accent-foreground transition hover:opacity-80"
      >
        Voltar para a galeria
      </Link>
    </div>
  );
}
