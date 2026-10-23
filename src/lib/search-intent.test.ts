import { test } from "node:test";
import assert from "node:assert/strict";
import libraries from "../data/libraries.json" with { type: "json" };
import { pt } from "../i18n/dictionaries/pt.ts";
import type { Library } from "@/types/library";
import { licenseFamily } from "./license.ts";
import {
  buildSearchQuery,
  queryFacetLabels,
  searchCatalog,
} from "./search.ts";

const libs = libraries as unknown as Library[];
const labels = {
  framework: pt.frameworkLabels,
  category: pt.categoryLabels,
  license: pt.license.families,
};

function names(query: string): string[] {
  return searchCatalog(libs, query, labels)
    .results.map((item) => item.library.name)
    .sort();
}

test("a busca por intenção remove palavras vazias", () => {
  const query = buildSearchQuery(
    "preciso de uma tabela editável para o projeto",
  );

  assert.deepEqual(
    query.terms.map((term) => term.id),
    ["table", "editable"],
  );
  assert.ok(query.stopwords.includes("preciso"));
  assert.ok(query.stopwords.includes("projeto"));
  assert.ok(query.smart);
});

test("frases conhecidas não viram dois termos independentes", () => {
  const query = buildSearchQuery("react native");

  assert.equal(query.terms.length, 1);
  assert.deepEqual(query.terms[0]?.facets, [
    { kind: "category", value: "mobile" },
  ]);
  assert.ok(names("react native").includes("NativeBase"));
  assert.ok(names("react native").includes("React Native Paper"));
  assert.ok(!names("react native").includes("shadcn/ui"));
});

test("sinônimos encontram a mesma biblioteca em PT e EN", () => {
  assert.ok(names("tabela").includes("TanStack Table"));
  assert.ok(names("table").includes("TanStack Table"));
  assert.ok(names("gráficos").includes("Chart.js"));
  assert.ok(names("charts").includes("Chart.js"));
});

test("framework com apelido funciona como filtro", () => {
  const result = searchCatalog(libs, "reactjs form", labels);
  const frameworks = new Set(
    result.results.map((item) => item.library.framework),
  );

  assert.ok(result.results.some((item) => item.library.name === "React Hook Form"));
  assert.deepEqual([...frameworks], ["react"]);
  assert.deepEqual(queryFacetLabels(result.query, labels), [
    "React",
    "Formulários",
  ]);
});

test("licença vira filtro e aparece nos rótulos da consulta", () => {
  const result = searchCatalog(libs, "com licença MIT", labels);

  assert.ok(result.results.length > 0);
  assert.ok(
    result.results.every(
      (item) => licenseFamily(item.library.license) === "mit",
    ),
  );
  assert.deepEqual(queryFacetLabels(result.query, labels), ["MIT"]);
});

test("busca em linguagem natural mantém os filtros e relaxa o resto", () => {
  const result = searchCatalog(
    libs,
    "preciso de uma tabela editável que aguente muitos dados e seja MIT",
    labels,
  );
  const resultNames = result.results.map((item) => item.library.name);

  assert.equal(result.relaxed, true);
  assert.ok(resultNames.includes("TanStack Table"));
  assert.ok(resultNames.includes("DataTables"));
  assert.ok(!resultNames.includes("Handsontable")); // licença comercial
  assert.ok(
    result.results.every(
      (item) => licenseFamily(item.library.license) === "mit",
    ),
  );
});

test("nome exato da biblioteca não é relaxado", () => {
  const result = searchCatalog(libs, "react hook form", labels);

  assert.equal(result.relaxed, false);
  assert.equal(result.results[0]?.library.name, "React Hook Form");
});

test("nome com 'ui' não é interpretado como categoria ui-kit", () => {
  const query = buildSearchQuery("material ui");
  const result = searchCatalog(libs, "material ui", labels);

  assert.deepEqual(query.terms[0]?.facets, []);
  assert.equal(result.results[0]?.library.name, "Material UI (MUI)");
});

test("erro de digitação ainda encontra a biblioteca", () => {
  const tailwind = searchCatalog(libs, "tailwnd", labels);
  const angular = searchCatalog(libs, "angualr", labels);

  assert.equal(tailwind.relaxed, true);
  assert.equal(tailwind.results[0]?.library.name, "Tailwind CSS");
  assert.ok(
    angular.results.some((item) => item.library.name === "Angular Material"),
  );
});

test("css é uma faceta de utilitários na busca por intenção", () => {
  const query = buildSearchQuery("css");

  assert.deepEqual(query.terms[0]?.facets, [
    { kind: "category", value: "utility" },
  ]);
  assert.ok(names("css").includes("Tailwind CSS"));
  assert.ok(names("css").includes("styled-components"));
});
