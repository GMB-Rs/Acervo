import { test } from "node:test";
import assert from "node:assert/strict";
import libraries from "../data/libraries.json" with { type: "json" };
import { pt } from "../i18n/dictionaries/pt.ts";
import { en } from "../i18n/dictionaries/en.ts";
import type { Library } from "@/types/library";
import {
  highlightParts,
  normalize,
  resolveScope,
  scopeLabels,
  searchLibraries,
  tokenize,
} from "./search.ts";

const libs = libraries as unknown as Library[];
const labels = {
  framework: pt.frameworkLabels,
  category: pt.categoryLabels,
};
const englishLabels = {
  framework: en.frameworkLabels,
  category: en.categoryLabels,
};

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

test("termo de categoria vira filtro: mobile mostra só mobile", () => {
  const result = names(tokenize("mobile"));
  assert.ok(result.includes("Tamagui"));
  assert.ok(result.includes("NativeBase"));
  assert.ok(result.includes("React Native Paper"));
  assert.ok(result.includes("Ionic")); // tag "mobile"
  assert.ok(!result.includes("Material UI (MUI)"));
  assert.ok(!result.includes("shadcn/ui"));
});

test("termo de framework vira filtro: react mostra só React", () => {
  const result = names(tokenize("react"));
  const frameworks = new Set(
    searchLibraries(libs, tokenize("react"), labels).map(
      (item) => item.library.framework,
    ),
  );
  assert.deepEqual([...frameworks], ["react"]);
  assert.ok(result.includes("shadcn/ui"));
  assert.ok(!result.includes("Vuetify"));
});

test("só o começo do rótulo designa um grupo", () => {
  // "componentes" não designa "Web Components": a busca continua pelo texto.
  const result = names(tokenize("componentes"));
  assert.ok(result.includes("React Aria Components"));
  assert.ok(!result.includes("Lit")); // a ficha do Lit está em inglês
  assert.deepEqual(resolveScope(tokenize("componentes"), labels), []);

  // "components" também não: o prefixo do rótulo é "web".
  assert.deepEqual(resolveScope(tokenize("components"), labels), []);
  assert.ok(names(tokenize("components")).includes("Lit"));
});

test("resolveScope encontra os grupos do catálogo", () => {
  assert.deepEqual(scopeLabels(resolveScope(tokenize("mobile"), labels)), [
    "Mobile / Universal",
  ]);
  assert.deepEqual(scopeLabels(resolveScope(tokenize("react"), labels)), [
    "React",
  ]);
  assert.deepEqual(scopeLabels(resolveScope(tokenize("dados"), labels)), [
    "Dados & Tabelas",
  ]);
  assert.deepEqual(resolveScope(tokenize("css"), labels), []);
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

test("os rótulos de outro idioma também designam um grupo", () => {
  // Na interface em português, "forms" (inglês) ainda filtra o grupo.
  const scope = resolveScope(tokenize("forms"), [labels, englishLabels], labels);
  assert.deepEqual(scopeLabels(scope), ["Formulários"]);

  // E "data" acha o mesmo grupo que "dados".
  assert.deepEqual(
    scopeLabels(resolveScope(tokenize("data"), [labels, englishLabels], labels)),
    ["Dados & Tabelas"],
  );
});

test("a busca filtra pelo grupo mesmo com os rótulos em inglês", () => {
  const result = searchLibraries(
    libs,
    tokenize("forms"),
    labels,
    [labels, englishLabels],
  ).map((item) => item.library.name);
  assert.ok(result.includes("React Hook Form"));
  assert.ok(!result.includes("shadcn/ui"));
});
