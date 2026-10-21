"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_SHORT,
  type Locale,
} from "@/i18n/config";

/*
  Seletor de idioma.

  O idioma mora na URL: trocar de idioma é trocar o primeiro segmento
  (`/pt/libraries/react` → `/en/libraries/react`), mantendo os filtros da
  galeria. A escolha também fica num cookie, para a raiz do site abrir
  direto no idioma preferido.
*/
function saveLocale(locale: Locale) {
  document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageSelect({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function choose(next: Locale) {
    setOpen(false);
    if (next === locale) return;

    const segments = pathname.split("/");
    segments[1] = next;
    const target = segments.join("/") || `/${next}`;

    saveLocale(next);
    router.push(`${target}${window.location.search}`);
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2 font-mono text-[11px] text-foreground transition hover:border-foreground/40"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
        </svg>
        {LOCALE_SHORT[locale]}
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute right-0 z-50 mt-1.5 min-w-[10rem] overflow-auto rounded-md border border-border bg-background py-1 shadow-lg"
        >
          {LOCALES.map((item) => (
            <button
              key={item}
              type="button"
              role="option"
              aria-selected={item === locale}
              onClick={() => choose(item)}
              className={`flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left text-sm transition-colors ${
                item === locale
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {LOCALE_LABELS[item]}
              <span className="font-mono text-[11px] opacity-60">
                {LOCALE_SHORT[item]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
