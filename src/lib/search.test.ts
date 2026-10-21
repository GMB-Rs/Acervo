import { test } from "node:test";
import assert from "node:assert/strict";
import libraries from "../data/libraries.json" with { type: "json" };
import { CATEGORY_LABELS, FRAMEWORK_LABELS } from "../types/library.ts";
import type { Library } from "@/types/library";
import {
  highlightParts,
  normalize,
  searchLibraries,
  tokenize,
} from "./search.ts";

const libs = libraries as unknown as Library[];
const labels = { framework: FRAMEWORK_LABELS, category: CATEGORY_LABELS };

function names(tokens: string[]): string[] {
  return searchLibraries(libs, tokens, labels)
    .map((item) => item.library.name)
    .sort();
}

test("tokenize quebra a query em termos", () => {
  assert.deepEqual(tokenize("React Form"), ["react", "form"]);
  assert.deepEqual(tokenize("  styled-components  "), ["styled", "components"]);
  assert.deepEqual(tokenize("ANT.DESIGN"), ["ant", "design"]);
  assert.deepEqual(tokenize("   "), []);
});

test("normalize tira acento e caixa sem mudar o tamanho", () => {
  assert.equal(normalize("Bibliotecas"), "bibliotecas");
  assert.equal(normalize("Coração"), "coracao");
  assert.equal(normalize("Coração").length, "Coração".length);
});

test("a ordem dos termos não muda o resultado", () => {
  assert.deepEqual(names(tokenize("react form")), names(tokenize("form react")));
  assert.ok(names(tokenize("react form")).includes("React Hook Form"));
});

test("todos os termos precisam casar", () => {
  const result = names(tokenize("react form"));
  assert.ok(result.includes("React Hook Form"));
  assert.ok(result.includes("TanStack Form")); // framework React
  assert.ok(!result.includes("Radix UI")); // tem "react", não tem "form"
  assert.ok(!result.includes("Vuetify")); // Vue: não casa com "react"
});

test("a busca alcança nome, tags, descrição e domínio", () => {
  assert.ok(names(tokenize("ant design")).includes("Ant Design"));
  assert.ok(names(tokenize("ant.design")).includes("Ant Design"));
  assert.ok(names(tokenize("tabela dados")).includes("TanStack Table"));
});

test("termo curto não casa dentro de outra palavra", () => {
  const result = names(tokenize("ant"));
  assert.ok(result.includes("Ant Design"));
  assert.ok(!result.includes("Vuetify")); // "vant" não é "ant"
});

test("a relevância põe o nome mais próximo primeiro", () => {
  const ranked = searchLibraries(libs, tokenize("gsap"), labels);
  assert.equal(ranked[0]?.library.name, "GSAP");
  assert.ok((ranked[0]?.score ?? 0) > 0);
});

test("highlightParts marca só o trecho casado", () => {
  assert.deepEqual(highlightParts("Ant Design", []), [
    { text: "Ant Design", match: false },
  ]);
  assert.deepEqual(highlightParts("Ant Design", ["ant", "design"]), [
    { text: "Ant", match: true },
    { text: " ", match: false },
    { text: "Design", match: true },
  ]);
  assert.deepEqual(highlightParts("Ant Design", ["xyz"]), [
    { text: "Ant Design", match: false },
  ]);
});
