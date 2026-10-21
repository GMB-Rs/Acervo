/** Chave do localStorage onde a escolha de tema fica salva. */
export const THEME_STORAGE_KEY = "diretorio-theme";

/** Media query usada para seguir a preferência do sistema quando não há escolha. */
const DARK_MEDIA = "(prefers-color-scheme: dark)";

/**
 * Aplica o tema no atributo `data-theme` do <html>: a escolha salva no
 * localStorage ou, quando ninguém escolheu, a preferência do sistema.
 *
 * Esta é a versão do cliente. A mesma lógica roda inline no <head> (veja
 * `THEME_SCRIPT`) para o tema já estar aplicado antes da primeira pintura.
 */
export function applyTheme(): void {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia(DARK_MEDIA).matches;
    const theme =
      stored === "light" || stored === "dark"
        ? stored
        : prefersDark
          ? "dark"
          : "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

/**
 * O mesmo `applyTheme` em forma de script inline.
 *
 * Ele roda antes do bundle do React, então não pode depender de import — a
 * lógica fica repetida aqui e o teste `theme.test.ts` garante que as duas
 * versões escolhem sempre o mesmo tema.
 */
export const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var m=window.matchMedia('${DARK_MEDIA}').matches;var t=(s==='light'||s==='dark')?s:(m?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;
