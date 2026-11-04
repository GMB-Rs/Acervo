/*
  Áreas do catálogo.

  A home lista tudo; as áreas são recortes por etapa do projeto. Cada
  categoria pertence a uma área só (a IA tem página própria), então a
  navbar consegue oferecer Interface, Front, Back e DevOps sem repetir
  ferramenta.

  Os imports são relativos de propósito: é o que deixa o módulo rodável no
  runner nativo do Node (`npm run test`), sem alias.
*/

import { CATEGORIES, type Category, type Library } from "../types/library.ts";

export const AREAS = ["interface", "front", "back", "devops"] as const;

export type Area = (typeof AREAS)[number];

export const AREA_CATEGORIES: Record<Area, Category[]> = {
  interface: [
    "ui-kit",
    "headless",
    "design-system",
    "utility",
    "icons",
    "animation",
  ],
  front: ["forms", "data", "state", "i18n", "mobile", "web", "docs"],
  back: [
    "backend",
    "database",
    "auth",
    "security",
    "cms",
    "payments",
    "email",
  ],
  devops: [
    "build",
    "quality",
    "testing",
    "observability",
    "deploy",
    "analytics",
  ],
};

export function isArea(value: string): value is Area {
  return (AREAS as readonly string[]).includes(value);
}

export function areaCategories(area: Area): Category[] {
  return AREA_CATEGORIES[area];
}

/** Bibliotecas da área, na ordem original do catálogo. */
export function librariesForArea(area: Area, libraries: Library[]): Library[] {
  const categories = new Set<Category>(AREA_CATEGORIES[area]);
  return libraries.filter((library) => categories.has(library.category));
}

/** Categorias que não entram em nenhuma área (a página de IA cobre `ia`). */
export const CATEGORIES_OUTSIDE_AREAS: Category[] = CATEGORIES.filter(
  (category) =>
    !Object.values(AREA_CATEGORIES).some((items) => items.includes(category)),
);
