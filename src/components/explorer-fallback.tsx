/*
  Esqueleto da barra de busca/filtros enquanto o explorador (que lê a query
  string no cliente) é hidratado. Mantém a altura da barra para a página não
  pular quando o componente real entra.
*/
export function ExplorerFallback() {
  return (
    <div className="border-y border-border">
      <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center">
        <div className="h-10 w-full rounded-md border border-border lg:w-[480px] xl:w-[544px]" />
        <div className="h-10 w-full rounded-md border border-border sm:w-[180px] lg:ml-auto" />
      </div>
    </div>
  );
}
