import { test } from "node:test";
import assert from "node:assert/strict";
import libraries from "../data/libraries.json" with { type: "json" };
import { CATEGORIES, type Library } from "../types/library.ts";
import {
  AREAS,
  AREA_CATEGORIES,
  CATEGORIES_OUTSIDE_AREAS,
  isArea,
  librariesForArea,
} from "./areas.ts";

const libs = libraries as unknown as Library[];

test("toda categoria tem uma área, exceto IA", () => {
  const assigned = new Set(Object.values(AREA_CATEGORIES).flat());

  for (const category of CATEGORIES) {
    if (category === "ia") {
      assert.ok(!assigned.has(category), "IA não deveria estar em uma área");
      continue;
    }
    assert.ok(assigned.has(category), `categoria ${category} sem área`);
  }

  assert.deepEqual(CATEGORIES_OUTSIDE_AREAS, ["ia"]);
});

test("cada categoria pertence a uma única área", () => {
  const seen = new Map<string, string>();

  for (const area of AREAS) {
    for (const category of AREA_CATEGORIES[area]) {
      assert.ok(
        !seen.has(category),
        `${category} aparece em ${area} e em ${seen.get(category)}`,
      );
      seen.set(category, area);
    }
  }
});

test("isArea reconhece as áreas e rejeita o resto", () => {
  for (const area of AREAS) assert.ok(isArea(area));
  assert.ok(!isArea("ia"));
  assert.ok(!isArea("qualquer"));
});

test("as áreas cobrem todas as bibliotecas fora da IA, sem repetir", () => {
  const seen = new Set<string>();

  for (const area of AREAS) {
    for (const library of librariesForArea(area, libs)) {
      assert.ok(
        !seen.has(library.slug),
        `${library.slug} aparece em mais de uma área`,
      );
      seen.add(library.slug);
    }
  }

  for (const library of libs) {
    if (library.category === "ia") continue;
    assert.ok(seen.has(library.slug), `${library.slug} ficou fora das áreas`);
  }
});

test("cada área tem pelo menos uma biblioteca", () => {
  for (const area of AREAS) {
    assert.ok(
      librariesForArea(area, libs).length > 0,
      `área ${area} está vazia`,
    );
  }
});
