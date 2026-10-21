"use client";

import { useEffect, useRef, useState } from "react";

/*
  Copia o texto para a área de transferência. O `navigator.clipboard` só
  funciona em contexto seguro (https), então há um fallback com um textarea
  temporário para o site aberto em http://localhost.
*/
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Clipboard bloqueado — tenta o fallback abaixo.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

type CopyState = "idle" | "copied" | "error";

const LABELS: Record<CopyState, string> = {
  idle: "Copiar link",
  copied: "Link copiado",
  error: "Não foi possível copiar",
};

export function CopyLinkButton() {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function handleClick() {
    const copied = await copyText(window.location.href);
    setState(copied ? "copied" : "error");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Copiar o link desta biblioteca"
      className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-4 text-xs font-medium transition hover:border-foreground/40"
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
        {state === "copied" ? (
          <path d="m4 12 5 5L20 6" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h8" />
          </>
        )}
      </svg>
      {LABELS[state]}
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Link copiado para a área de transferência." : ""}
      </span>
    </button>
  );
}
