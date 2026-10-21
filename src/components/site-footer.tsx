export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-baseline sm:justify-between">
        <p>Diretório de bibliotecas de componentes web, mantido pela comunidade.</p>
        <p className="font-mono">
          estrelas e downloads sincronizados com GitHub e npm
        </p>
      </div>
    </footer>
  );
}
