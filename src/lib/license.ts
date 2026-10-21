/*
  O campo `license` do catálogo guarda o valor cru do repositório (vem da
  API do GitHub e do npm). Para o usuário final ele é confuso: existe
  "NOASSERTION" e "GreenSock Standard (grátis) / commercial" no mesmo campo
  em que existe "MIT".

  Aqui as licenças são agrupadas em famílias, para o filtro do explorador e
  para a ficha da biblioteca.
*/

export type LicenseFamily = "mit" | "apache" | "bsd" | "comercial" | "outra";

/** Famílias de licença, na ordem em que aparecem no filtro. */
export const LICENSE_FAMILIES: LicenseFamily[] = [
  "mit",
  "apache",
  "bsd",
  "comercial",
  "outra",
];

/**
 * Descrição completa, usada na ficha da biblioteca. Os rótulos vêm do
 * dicionário do idioma da tela.
 */
export function licenseLabel(
  license: string,
  labels: { commercial: string; undeclared: string },
): string {
  const value = license.trim();
  if (/greensock|comercial|commercial/i.test(value)) {
    return labels.commercial;
  }
  if (/noassertion/i.test(value)) {
    return labels.undeclared;
  }
  return value || labels.undeclared;
}

/** Família de licença a partir do valor cru do catálogo. */
export function licenseFamily(license: string): LicenseFamily {
  const value = license.trim().toLowerCase();
  if (value.includes("mit")) return "mit";
  if (value.includes("apache")) return "apache";
  if (value.includes("bsd")) return "bsd";
  if (/greensock|comercial|commercial/.test(value)) return "comercial";
  return "outra";
}
