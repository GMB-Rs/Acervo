import librariesJson from "@/data/libraries.json";
import {
  CATEGORIES,
  FRAMEWORKS,
  type Category,
  type Framework,
  type Library,
} from "@/types/library";

type RawLibrary = Omit<Library, "framework" | "category"> & {
  framework: string;
  category: string;
};

const FRAMEWORK_SET = new Set<string>(FRAMEWORKS);
const CATEGORY_SET = new Set<string>(CATEGORIES);

/**
 * Valida e normaliza o JSON bruto, garantindo que o dado carregado em build
 * sempre bater com o schema de `Library`.
 */
function parseLibraries(raw: RawLibrary[]): Library[] {
  return raw.map((item) => {
    if (!FRAMEWORK_SET.has(item.framework)) {
      throw new Error(`Framework inválido "${item.framework}" em "${item.slug}"`);
    }
    if (!CATEGORY_SET.has(item.category)) {
      throw new Error(`Categoria inválida "${item.category}" em "${item.slug}"`);
    }
    if (!/^#[0-9a-f]{6}$/i.test(item.color)) {
      throw new Error(`Cor inválida "${item.color}" em "${item.slug}"`);
    }
    return {
      ...item,
      framework: item.framework as Framework,
      category: item.category as Category,
    };
  });
}

export const libraries: Library[] = parseLibraries(
  librariesJson as unknown as RawLibrary[],
);

export const featuredLibraries = libraries.filter((item) => item.featured);

export function getLibraryBySlug(slug: string): Library | undefined {
  return libraries.find((item) => item.slug === slug);
}

export function getAllSlugs(): string[] {
  return libraries.map((item) => item.slug);
}

/** Bibliotecas relacionadas: mesma categoria, framework em comum ou tags parecidas. */
export function getRelatedLibraries(library: Library, limit = 4): Library[] {
  const score = (other: Library) => {
    let points = 0;
    if (other.category === library.category) points += 3;
    if (other.framework === library.framework) points += 2;
    const sharedTags = other.tags.filter((tag) => library.tags.includes(tag));
    points += sharedTags.length;
    return points;
  };

  return libraries
    .filter((other) => other.slug !== library.slug)
    .map((other) => ({ other, points: score(other) }))
    .filter(({ points }) => points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
    .map(({ other }) => other);
}

export function countByFramework(): Record<string, number> {
  return libraries.reduce<Record<string, number>>((acc, item) => {
    acc[item.framework] = (acc[item.framework] ?? 0) + 1;
    return acc;
  }, {});
}

export function countByCategory(): Record<string, number> {
  return libraries.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});
}
