"use client";

import {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
  type RefObject,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LibraryCard } from "@/components/library-card";
import {
  CATEGORIES,
  FRAMEWORKS,
  type Category,
  type Framework,
  type Library,
} from "@/types/library";
import { CATEGORY_LABELS, FRAMEWORK_LABELS } from "@/types/library";
import {
  LICENSE_FAMILIES,
  licenseFamily,
  type LicenseFamily,
} from "@/lib/license";
import { resolveScope, scopeLabels, searchLibraries, tokenize } from "@/lib/search";

type SortOption = "popular" | "az" | "za" | "recent";

const SORTS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Mais populares" },
  { value: "az", label: "Nome (A–Z)" },
  { value: "za", label: "Nome (Z–A)" },
  { value: "recent", label: "Mais recentes" },
];

/* Parâmetros da query string: a URL é a fonte da verdade do estado. */
const PARAM = {
  query: "q",
  framework: "framework",
  category: "categoria",
  license: "licenca",
  sort: "ordem",
  page: "pagina",
} as const;

function isSortOption(value: string): value is SortOption {
  return SORTS.some((item) => item.value === value);
}

/* Rótulos usados pela busca: framework e categoria também são pesquisáveis. */
const SEARCH_LABELS = {
  framework: FRAMEWORK_LABELS,
  category: CATEGORY_LABELS,
};

type DropdownOption = { value: string; label: string };

function Dropdown<T extends string>({
  value,
  options,
  onChange,
  label,
  placeholder,
  className = "",
}: {
  value: T;
  options: Array<DropdownOption & { value: T }>;
  onChange: (value: T) => void;
  label: string;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const openDropdown = useCallback(() => {
    setOpen(true);
    const idx = options.findIndex((o) => o.value === value);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [options, value]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        close();
        triggerRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, options.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          close();
        }
      } else if (e.key === "Tab") {
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, options, highlightedIndex, onChange, close]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        panelRef.current?.contains(e.target as Node)
      )
        return;
      close();
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [close]);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        onClick={open ? close : openDropdown}
        className={`flex items-center gap-3 h-10 rounded-md border border-border bg-background px-3 pr-10 text-sm outline-none transition focus:border-foreground/50 hover:border-border/80 w-full sm:w-[140px] md:w-[160px] lg:w-[150px] xl:w-[180px] justify-between ${className}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${label.replace(/\s+/g, "-")}-listbox`}
        aria-label={label}
      >
        <span className="truncate">{selectedOption?.label ?? placeholder ?? "Selecionar"}</span>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center pr-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>

      {open && (
        <div
          ref={panelRef}
          role="listbox"
          aria-label={label}
          id={`${label.replace(/\s+/g, "-")}-listbox`}
          className="absolute z-50 mt-1.5 min-w-full sm:min-w-[140px] md:min-w-[160px] lg:min-w-[150px] xl:min-w-[180px] max-w-[90vw] sm:max-w-[300px] md:max-w-[320px] lg:max-w-[300px] xl:max-w-[340px] max-h-56 overflow-auto rounded-md border border-border bg-background shadow-lg py-1 scrollbar-hide"
        >
          {options.map((option, index) => (
            <button
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              type="button"
              role="option"
              aria-selected={option.value === value}
              key={option.value}
              onClick={() => {
                onChange(option.value as T);
                close();
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full px-3 py-1.5 text-sm text-left transition-colors whitespace-normal break-words ${
                option.value === value
                  ? "bg-muted font-medium text-foreground"
                  : index === highlightedIndex
                  ? "bg-muted/50 text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  onClear,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          // Esc limpa a busca e tira o foco do campo.
          if (e.key === "Escape" && value) {
            e.preventDefault();
            onClear();
            e.currentTarget.blur();
          }
        }}
        placeholder="Buscar nome, tag ou descrição"
        aria-label="Buscar bibliotecas"
        className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-10 text-sm outline-none transition placeholder:text-muted-foreground focus:border-foreground/50"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 size-5 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
          aria-label="Limpar busca"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ) : (
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground sm:block"
        >
          /
        </kbd>
      )}
    </div>
  );
}

export function LibraryExplorer({ libraries }: { libraries: Library[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
    A URL é a fonte da verdade: busca, filtros, ordenação e página são lidos
    de `searchParams`. Assim o estado pode ser compartilhado por link e o botão
    "voltar" do navegador volta ao filtro anterior.
  */
  const urlQuery = searchParams.get(PARAM.query) ?? "";
  const rawFramework = searchParams.get(PARAM.framework) ?? "all";
  const framework: Framework | "all" = FRAMEWORKS.includes(
    rawFramework as Framework,
  )
    ? (rawFramework as Framework)
    : "all";
  const rawCategory = searchParams.get(PARAM.category) ?? "all";
  const category: Category | "all" = CATEGORIES.includes(
    rawCategory as Category,
  )
    ? (rawCategory as Category)
    : "all";
  const rawSort = searchParams.get(PARAM.sort) ?? "popular";
  const sort: SortOption = isSortOption(rawSort) ? rawSort : "popular";
  const rawLicense = searchParams.get(PARAM.license) ?? "all";
  const license: LicenseFamily | "all" = LICENSE_FAMILIES.some(
    (item) => item.value === rawLicense,
  )
    ? (rawLicense as LicenseFamily)
    : "all";
  const rawPage = Number(searchParams.get(PARAM.page) ?? "1");
  const requestedPage =
    Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  /*
    O campo de busca é controlado localmente e só vai para a URL depois de
    300ms sem digitação, para não disparar uma navegação a cada tecla.
  */
  const [query, setQuery] = useState(urlQuery);
  const pushedQuery = useRef(urlQuery);

  useEffect(() => {
    // Sincroniza o campo quando a URL muda por fora (botão "voltar", link).
    if (urlQuery === pushedQuery.current) return;
    pushedQuery.current = urlQuery;
    setQuery(urlQuery);
  }, [urlQuery]);

  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        // Valores padrão não ficam na URL: ela fica limpa e compartilhável.
        const isDefault =
          !value || value === "all" || (key === PARAM.page && value === "1");
        if (isDefault) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const search = params.toString();
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (query === urlQuery) return;
    const timer = setTimeout(() => {
      pushedQuery.current = query;
      pushParams({ [PARAM.query]: query || null, [PARAM.page]: null });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, urlQuery, pushParams]);

  const itemsPerPage = 20;

  /*
    A busca é por termos: "react form" exige os dois termos, em qualquer
    ordem, e os resultados saem ordenados por relevância.
  */
  const tokens = useMemo(() => tokenize(query), [query]);
  /*
    Termos que designam uma categoria ou um framework viram filtro:
    buscar "mobile" mostra só as libs de mobile, buscar "react" só as de React.
  */
  const scope = useMemo(() => resolveScope(tokens, SEARCH_LABELS), [tokens]);
  const scopeNames = useMemo(() => scopeLabels(scope), [scope]);

  const searchRef = useRef<HTMLInputElement>(null);

  // "/" foca a busca, a não ser que o usuário esteja digitando em outro campo.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const frameworkCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of libraries) {
      counts.set(item.framework, (counts.get(item.framework) ?? 0) + 1);
    }
    return counts;
  }, [libraries]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of libraries) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
    return counts;
  }, [libraries]);

  const licenseCounts = useMemo(() => {
    const counts = new Map<LicenseFamily, number>();
    for (const item of libraries) {
      const family = licenseFamily(item.license);
      counts.set(family, (counts.get(family) ?? 0) + 1);
    }
    return counts;
  }, [libraries]);

  const filteredResults = useMemo(() => {
    const filtered = libraries.filter((item) => {
      if (framework !== "all" && item.framework !== framework) return false;
      if (category !== "all" && item.category !== category) return false;
      if (license !== "all" && licenseFamily(item.license) !== license) {
        return false;
      }
      return true;
    });

    // Só entram as libs que casam com todos os termos, com a nota de relevância.
    const scored = searchLibraries(filtered, tokens, SEARCH_LABELS);

    const sorted = [...scored];
    sorted.sort((a, b) => {
      // Com busca ativa, a ordenação padrão vira "por relevância".
      if (tokens.length > 0 && sort === "popular") {
        return (
          b.score - a.score ||
          (b.library.stars ?? 0) - (a.library.stars ?? 0) ||
          a.library.name.localeCompare(b.library.name, "pt-BR")
        );
      }
      switch (sort) {
        case "az":
          return a.library.name.localeCompare(b.library.name, "pt-BR");
        case "za":
          return b.library.name.localeCompare(a.library.name, "pt-BR");
        case "recent":
          return (
            b.library.since - a.library.since ||
            a.library.name.localeCompare(b.library.name, "pt-BR")
          );
        case "popular":
        default:
          return (b.library.stars ?? 0) - (a.library.stars ?? 0);
      }
    });

    return sorted.map((item) => item.library);
  }, [libraries, tokens, framework, category, license, sort]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  // Uma página fora do intervalo (link antigo, filtro alterado) é ajustada.
  const page = Math.min(requestedPage, Math.max(totalPages, 1));
  const paginatedResults = filteredResults.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Com busca ativa, a ordenação padrão vira "por relevância".
  const byRelevance =
    tokens.length > 0 && sort === "popular" && filteredResults.length > 0;

  const hasActiveFilter =
    query.trim() !== "" ||
    framework !== "all" ||
    category !== "all" ||
    license !== "all";

  const filterButton = (active: boolean) =>
    `text-xs transition-colors ${
      active
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  const filterButtonLabel = (active: boolean) =>
    active
      ? "underline underline-offset-4 decoration-foreground/40"
      : "";

  const categoryOptions = useMemo<Array<DropdownOption & { value: Category | "all" }>>(() => [
    { value: "all", label: `Todas as categorias (${libraries.length})` },
    ...CATEGORIES.map((item) => ({
      value: item,
      label: `${CATEGORY_LABELS[item]} (${categoryCounts.get(item) ?? 0})`,
    })),
  ], [libraries.length, categoryCounts]);

  const sortOptions = useMemo<Array<DropdownOption & { value: SortOption }>>(() =>
    SORTS.map((item) => ({ value: item.value, label: item.label })),
  []);

  const licenseOptions = useMemo<
    Array<DropdownOption & { value: LicenseFamily | "all" }>
  >(() => [
    { value: "all", label: `Todas as licenças (${libraries.length})` },
    ...LICENSE_FAMILIES.map((item) => ({
      value: item.value,
      label: `${item.label} (${licenseCounts.get(item.value) ?? 0})`,
    })),
  ], [libraries.length, licenseCounts]);

  return (
    <section id="galeria" className="scroll-mt-16">
      <div className="border-y border-border">
        <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center">
          <div className="relative lg:w-[480px] xl:w-[544px]">
            <SearchInput
              value={query}
              onChange={setQuery}
              onClear={() => setQuery("")}
              inputRef={searchRef}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:ml-auto">
            <Dropdown<Category | "all">
              value={category}
              options={categoryOptions}
              onChange={(value) =>
                pushParams({
                  [PARAM.category]: value,
                  [PARAM.page]: null,
                })
              }
              label="Filtrar por categoria"
              placeholder="Categoria"
              className="w-full sm:w-[180px] md:w-[200px] lg:w-[200px] xl:w-[220px]"
            />

            <Dropdown<LicenseFamily | "all">
              value={license}
              options={licenseOptions}
              onChange={(value) =>
                pushParams({ [PARAM.license]: value, [PARAM.page]: null })
              }
              label="Filtrar por licença"
              placeholder="Licença"
              className="w-full sm:w-[160px] md:w-[170px] lg:w-[160px] xl:w-[180px]"
            />

            <Dropdown<SortOption>
              value={sort}
              options={sortOptions}
              onChange={(value) =>
                pushParams({ [PARAM.sort]: value, [PARAM.page]: null })
              }
              label="Ordenar bibliotecas"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border py-3">
          <button
            type="button"
            onClick={() =>
              pushParams({ [PARAM.framework]: null, [PARAM.page]: null })
            }
            className={filterButton(framework === "all")}
          >
            <span className={filterButtonLabel(framework === "all")}>Todos</span>
            <span className="ml-1.5 font-mono text-[11px] opacity-60">
              {libraries.length}
            </span>
          </button>
          {FRAMEWORKS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                pushParams({ [PARAM.framework]: item, [PARAM.page]: null })
              }
              className={filterButton(framework === item)}
            >
              <span className={filterButtonLabel(framework === item)}>{FRAMEWORK_LABELS[item]}</span>
              <span className="ml-1.5 font-mono text-[11px] opacity-60">
                {frameworkCounts.get(item) ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="font-mono">
            {filteredResults.length} {filteredResults.length === 1 ? "biblioteca" : "bibliotecas"}
          </span>
          {byRelevance && <span className="opacity-70">por relevância</span>}
          {scopeNames.map((name) => (
            <span
              key={name}
              className="rounded border border-border px-1.5 py-0.5 font-sans"
            >
              {name}
            </span>
          ))}
        </span>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              pushedQuery.current = "";
              pushParams({
                [PARAM.query]: null,
                [PARAM.framework]: null,
                [PARAM.category]: null,
                [PARAM.license]: null,
                [PARAM.page]: null,
              });
            }}
            className="underline underline-offset-4 transition hover:text-foreground"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {filteredResults.length === 0 ? (
        <div className="border border-dashed border-border px-6 py-20 text-center">
          <p className="text-sm font-medium">
            {query.trim() ? (
              <>
                Nenhuma biblioteca encontrada para{" "}
                <span className="font-mono">“{query.trim()}”</span>
              </>
            ) : (
              "Nenhuma biblioteca encontrada"
            )}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {tokens.length > 1
              ? "A busca exige todos os termos: cada palavra precisa aparecer em algum campo."
              : "Tente outro termo ou limpe os filtros aplicados."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {paginatedResults.map((library) => (
              <LibraryCard
                key={library.slug}
                library={library}
                highlight={tokens}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-center gap-1"
              aria-label="Paginação"
            >
              <button
                type="button"
                onClick={() =>
                  pushParams({ [PARAM.page]: String(Math.max(1, page - 1)) })
                }
                disabled={page === 1}
                className="h-10 px-3 rounded-md border border-border bg-background text-sm font-mono transition disabled:opacity-40 disabled:cursor-not-allowed hover:border-foreground/50"
                aria-label="Página anterior"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => pushParams({ [PARAM.page]: String(p) })}
                  className={`h-10 w-10 rounded-md text-sm font-mono transition ${
                    p === page
                      ? "bg-foreground text-background"
                      : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
                  }`}
                  aria-label={`Página ${p}`}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  pushParams({ [PARAM.page]: String(Math.min(totalPages, page + 1)) })
                }
                disabled={page === totalPages}
                className="h-10 px-3 rounded-md border border-border bg-background text-sm font-mono transition disabled:opacity-40 disabled:cursor-not-allowed hover:border-foreground/50"
                aria-label="Próxima página"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </button>
            </nav>
          )}

          <p className="mt-4 text-xs text-muted-foreground text-center font-mono">
            Mostrando {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, filteredResults.length)} de {filteredResults.length} bibliotecas
          </p>
        </>
      )}
    </section>
  );
}