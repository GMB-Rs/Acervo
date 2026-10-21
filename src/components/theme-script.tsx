"use client";

import { useEffect, useLayoutEffect } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { THEME_SCRIPT, applyTheme } from "@/lib/theme";

/*
  Aplica o tema antes da primeira pintura.

  O script inline entra no HTML do servidor (dentro do `<head>`, antes do
  `</head>`) pelo `useServerInsertedHTML`: ele precisa estar no HTML pronto
  para não piscar o tema errado, mas não pode ser um `<script>` renderizado
  pelo React — quando o layout de `[lang]` é remontado (troca de idioma), o
  React recriaria o elemento no cliente e avisaria que scripts dentro de
  componentes nunca executam.

  No cliente o componente não renderiza nada: o script sai da árvore do React
  e o aviso some. O efeito abaixo cobre o outro lado da troca de idioma — o
  layout remontado recria o <html> e o atributo `data-theme` se perde, então o
  tema é reaplicado assim que o novo <html> entra no documento.
*/

/**
 * `useLayoutEffect` roda logo depois das mutações do DOM (antes da pintura),
 * mas não existe no servidor — lá usamos `useEffect`, que o React aceita sem
 * aviso.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function ThemeScript() {
  useServerInsertedHTML(() => (
    <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
  ));

  useIsomorphicLayoutEffect(() => {
    applyTheme();
  }, []);

  return null;
}
