/*
  Formatação de números — o idioma entra como argumento para que a versão
  em inglês use "34.4K" em vez de "34,4 mil".
*/

export function formatNumber(value?: number, locale = "pt-BR"): string {
  if (value === undefined) return "—";
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCompact(value?: number, locale = "pt-BR"): string {
  if (value === undefined) return "—";
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatMonthYear(value?: string, locale = "pt-BR"): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Color utilities for brand color contrast handling
 */

/** Parse hex color to RGB (0-255) */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return { r, g, b };
}

/** Relative luminance (0-1) per WCAG */
function luminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/**
 * Returns true if the color is light (should use dark logo/text)
 * Threshold ~0.5 is the perceptual midpoint
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  return luminance(rgb) > 0.5;
}

/**
 * Returns the appropriate text/logo color for a given background color
 * For light backgrounds: near-black (#0a0a0a)
 * For dark backgrounds: white (#ffffff)
 */
export function getContrastColor(hex: string): string {
  return isLightColor(hex) ? "#0a0a0a" : "#ffffff";
}
