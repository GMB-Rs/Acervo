/*
  O campo `license` do catálogo guarda o valor cru do repositório (vem da
  API do GitHub e do npm). Para o usuário final ele é confuso: existe
  "NOASSERTION" e "GreenSock Standard (grátis) / commercial" no mesmo campo
  em que existe "MIT".

  Aqui as licenças são agrupadas em famílias, para o filtro do explorador e
  para a ficha da biblioteca.
*/

export type LicenseFamily = "mit" | "apache" | "bsd" | "comercial" | "outra";

export const LICENSE_FAMILIES: Array<{
  value: LicenseFamily;
  label: string;
}> = [
  { value: "mit", label: "MIT" },
  { value: "apache", label: "Apache-2.0" },
  { value: "bsd", label: "BSD-3-Clause" },
  { value: "comercial", label: "Comercial" },
  { value: "outra", label: "Não declarada" },
];

/** Rótulo curto de uma família de licença. */
export function licenseFamilyLabel(family: LicenseFamily): string {
  return (
    LICENSE_FAMILIES.find((item) => item.value === family)?.label ?? "Não declarada"
  );
}

/** Descrição completa, usada na ficha da biblioteca. */
export function licenseLabel(license: string): string {
  const value = license.trim();
  if (/greensock|comercial|commercial/i.test(value)) {
    return "Comercial (GreenSock Standard)";
  }
  if (/noassertion/i.test(value)) {
    return "Não declarada";
  }
  return value || "Não declarada";
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
