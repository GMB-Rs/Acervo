"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { LibraryCard } from "@/components/library-card";
import {
  CATEGORIES,
  FRAMEWORKS,
  type Category,
  type Framework,
  type Library,
} from "@/types/library";
import { CATEGORY_LABELS, FRAMEWORK_LABELS } from "@/types/library";

type SortOption = "popular" | "az" | "za" | "recent";

const SORTS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Mais populares" },
  { value: "az", label: "Nome (A–Z)" },
  { value: "za", label: "Nome (Z–A)" },
  { value: "recent", label: "Mais recentes" },
];

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type DropdownOption = { value: string; label: string };

function Dropdown<T extends string>({
  value,
  options,
  onChange,
  label,
  placeholder,
}: {
  value: T;
  options: Array<DropdownOption & { value: T }>;
  onChange: (value: T) => void;
  label: string;
  placeholder?: string;
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
        className="flex items-center gap-3 h-10 rounded-md border border-border bg-background px-3 pr-10 text-sm outline-none transition focus:border-foreground/50 hover:border-border/80 w-full sm:w-[140px] md:w-[160px] lg:w-[150px] xl:w-[180px] justify-between"
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
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
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
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar biblioteca"
        aria-label="Buscar bibliotecas"
        className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-10 text-sm outline-none transition placeholder:text-muted-foreground focus:border-foreground/50"
      />
      {value && (
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
      )}
    </div>
  );
}

export function LibraryExplorer({ libraries }: { libraries: Library[] }) {
  const [query, setQuery] = useState("");
  const [framework, setFramework] = useState<Framework | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [sort, setSort] = useState<SortOption>("popular");

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

  const results = useMemo(() => {
    const term = normalize(query.trim());

    const filtered = libraries.filter((item) => {
      if (framework !== "all" && item.framework !== framework) return false;
      if (category !== "all" && item.category !== category) return false;
      if (!term) return true;

      const haystack = normalize(
        [item.name, item.description, item.highlight, ...item.tags].join(" "),
      );
      return haystack.includes(term);
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      switch (sort) {
        case "az":
          return a.name.localeCompare(b.name, "pt-BR");
        case "za":
          return b.name.localeCompare(a.name, "pt-BR");
        case "recent":
          return b.since - a.since || a.name.localeCompare(b.name, "pt-BR");
        case "popular":
        default:
          return (b.stars ?? 0) - (a.stars ?? 0);
      }
    });

    return sorted;
  }, [libraries, query, framework, category, sort]);

  const hasActiveFilter =
    query.trim() !== "" || framework !== "all" || category !== "all";

  const filterButton = (active: boolean) =>
    `text-xs transition-colors ${
      active
        ? "text-foreground underline underline-offset-4 decoration-foreground/40"
        : "text-muted-foreground hover:text-foreground"
    }`;

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

  return (
    <section id="galeria" className="scroll-mt-16">
      <div className="border-y border-border">
        <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center">
          <div className="relative lg:w-96">
            <SearchInput
              value={query}
              onChange={setQuery}
              onClear={() => setQuery("")}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:ml-auto">
            <Dropdown<Category | "all">
              value={category}
              options={categoryOptions}
              onChange={setCategory}
              label="Filtrar por categoria"
              placeholder="Categoria"
            />

            <Dropdown<SortOption>
              value={sort}
              options={sortOptions}
              onChange={setSort}
              label="Ordenar bibliotecas"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border py-3">
          <button
            type="button"
            onClick={() => setFramework("all")}
            className={filterButton(framework === "all")}
          >
            Todos
            <span className="ml-1.5 font-mono text-[11px] opacity-60">
              {libraries.length}
            </span>
          </button>
          {FRAMEWORKS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFramework(item)}
              className={filterButton(framework === item)}
            >
              {FRAMEWORK_LABELS[item]}
              <span className="ml-1.5 font-mono text-[11px] opacity-60">
                {frameworkCounts.get(item) ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between py-3 text-xs text-muted-foreground">
        <span className="font-mono">
          {results.length} {results.length === 1 ? "biblioteca" : "bibliotecas"}
        </span>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFramework("all");
              setCategory("all");
            }}
            className="underline underline-offset-4 transition hover:text-foreground"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="border border-dashed border-border px-6 py-20 text-center">
          <p className="text-sm font-medium">Nenhuma biblioteca encontrada</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente outro termo ou limpe os filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((library) => (
            <LibraryCard key={library.slug} library={library} />
          ))}
        </div>
      )}
    </section>
  );
}