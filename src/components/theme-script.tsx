"use client";

import { useServerInsertedHTML } from "next/navigation";

/*
  Injeta o script de tema no `<head>` do HTML gerado no servidor.

  O script precisa rodar antes da primeira pintura — senão quem escolheu o
  tema escuro vê um flash branco. Mas ele não pode ser um `<script>` renderizado
  pelo React: quando o layout de `[lang]` é remontado (troca de idioma), o
  React recria o elemento no cliente e avisa que scripts dentro de componentes
  nunca executam.

  Com `useServerInsertedHTML` o script entra no HTML do servidor (dentro do
  `<head>`, antes do `</head>`) e não faz parte da árvore do React no cliente:
  some o aviso e o tema continua valendo.
*/

const themeScript = `(function(){try{var s=localStorage.getItem('diretorio-theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=(s==='light'||s==='dark')?s:(m?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export function ThemeScript() {
  useServerInsertedHTML(() => (
    <script dangerouslySetInnerHTML={{ __html: themeScript }} />
  ));

  return null;
}
