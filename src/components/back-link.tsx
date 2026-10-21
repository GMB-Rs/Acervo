"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";

/*
  Botão de voltar da ficha da biblioteca.

  A galeria mora na URL (`/pt?q=mobile&framework=react`), então o link para
  voltar precisa levar esses filtros junto — senão o usuário cai na galeria
  sem filtro e perde o contexto de onde veio.

  O link de origem viaja no parâmetro `from` (montado pelo explorador ao
  gerar o link da ficha). Sem ele — página aberta direto pelo link — o botão
  leva para a galeria raiz.
*/

function safeFrom(value: string | null): string | null {
  // Só aceitamos caminhos internos: nada de "//site-de-um-third-party".
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export function BackLink({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const searchParams = useSearchParams();
  const from = safeFrom(searchParams.get("from"));
  const href = from ? `${from}#galeria` : `/${locale}#galeria`;

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
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
        <path d="m15 18-6-6 6-6" />
        <path d="M9 12h10" />
      </svg>
      {label}
    </Link>
  );
}
