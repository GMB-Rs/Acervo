import { test } from "node:test";
import assert from "node:assert/strict";
import libraries from "../data/libraries.json" with { type: "json" };
import enTranslations from "../data/translations/en.json" with { type: "json" };
import enTags from "../data/translations/tags.en.json" with { type: "json" };
import type { Library } from "@/types/library";
import { libraryText, localizeLibrary, translateTags } from "./library-text.ts";

const libs = libraries as unknown as Library[];
const translations = enTranslations as Record<string, { description: string; highlight: string }>;
const tags = enTags as Record<string, string>;

test("toda biblioteca tem texto traduzido para inglês", () => {
  for (const library of libs) {
    const text = translations[library.slug];
    assert.ok(text, `falta a tradução de ${library.slug}`);
    assert.ok(text.description.length > 0);
    assert.ok(text.highlight.length > 0);
    assert.notEqual(text.description, library.description);
  }
});

test("libraryText devolve o português quando o idioma é o padrão", () => {
  const library = libs[0];
  assert.deepEqual(libraryText("pt", library), {
    description: library.description,
    highlight: library.highlight,
  });
});

test("localizeLibrary troca descrição, destaque e tags", () => {
  const library = libs.find((item) => item.tags.includes("acessibilidade"));
  assert.ok(library);

  const localized = localizeLibrary("en", library);
  assert.equal(
    localized.description,
    translations[library.slug].description,
  );
  assert.equal(localized.highlight, translations[library.slug].highlight);
  assert.ok(localized.tags.includes("accessibility"));
  assert.ok(!localized.tags.includes("acessibilidade"));
});

test("translateTags mantém as tags que não precisam de tradução", () => {
  assert.deepEqual(translateTags("en", ["react", "temas"]), ["react", "themes"]);
  assert.deepEqual(translateTags("pt", ["react", "temas"]), ["react", "temas"]);
  assert.equal(tags["temas"], "themes");
});
