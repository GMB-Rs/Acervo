import type { Library } from "@/types/library";

/*
  Três modos de exibição da marca no tile:

  - mark (padrão): símbolo quadrado, centralizado, 40x40;
  - wide: wordmark horizontal (o SVG tem viewBox largo) — precisa ocupar a
    largura do tile, senão as letras ficam minúsculas;
  - text: sem imagem — o nome da biblioteca é escrito no tile.
*/

/** Classe do <img> da logo, conforme o modo de exibição. */
export function logoBoxClass(library: Library, size: "sm" | "lg"): string {
  if (library.logoKind === "wide") {
    return size === "sm"
      ? "h-10 w-full max-w-[13rem] object-contain"
      : "h-18 w-full max-w-[22rem] object-contain";
  }
  return size === "sm" ? "h-10 w-10 object-contain" : "h-18 w-18 object-contain";
}

/** A logo é exibida como texto (sem imagem)? */
export function isTextMark(library: Library): boolean {
  return library.logoKind === "text";
}

/**
 * Texto corrido no lugar da logo. O corpo da fonte acompanha o tamanho
 * do nome para que ele sempre caiba no tile sem ser cortado.
 */
export function textMarkClass(name: string, size: "sm" | "lg"): string {
  const base = "text-center font-semibold leading-tight tracking-tight";
  if (size === "sm") {
    if (name.length <= 8) return `px-2 text-3xl ${base}`;
    if (name.length <= 12) return `px-2 text-2xl ${base}`;
    return `px-2 text-lg ${base}`;
  }
  if (name.length <= 8) return `px-2 text-4xl ${base}`;
  if (name.length <= 12) return `px-2 text-3xl ${base}`;
  return `px-2 text-xl ${base}`;
}
