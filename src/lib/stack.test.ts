import { test } from "node:test";
import assert from "node:assert/strict";
import libraries from "../data/libraries.json" with { type: "json" };
import type { Library } from "@/types/library";
import { licenseFamily } from "./license.ts";
import {
  DEFAULT_STACK_NEEDS,
  recommendStack,
  type StackNeed,
} from "./stack.ts";

const libs = libraries as unknown as Library[];

function plan(
  goal: Parameters<typeof recommendStack>[1]["goal"],
  framework: Parameters<typeof recommendStack>[1]["framework"],
  needs: StackNeed[] = DEFAULT_STACK_NEEDS[goal],
  openSourceOnly = true,
) {
  return recommendStack(libs, { goal, framework, needs, openSourceOnly });
}

test("dashboard React escolhe bibliotecas nativas e abertas", () => {
  const result = plan("dashboard", "react");
  const names = result.picks.map((pick) => pick.library.name);

  assert.ok(names.includes("TanStack Table"));
  assert.ok(names.includes("Recharts"));
  assert.ok(
    result.picks.every(
      (pick) => licenseFamily(pick.library.license) !== "comercial",
    ),
  );
});

test("a escolha de UI respeita o framework", () => {
  const result = plan("site", "vue");
  const ui = result.picks.find((pick) => pick.need === "ui");

  assert.ok(ui);
  assert.ok(["vue", "vanilla", "web-components"].includes(ui.library.framework));
  assert.notEqual(ui.library.framework, "react");
});

test("app React prioriza a categoria mobile", () => {
  const result = plan("app", "react");
  const ui = result.picks.find((pick) => pick.need === "ui");

  assert.equal(ui?.library.category, "mobile");
  assert.ok(ui?.library.framework === "react");
});

test("validação usa um validador, não o formulário nativo", () => {
  const result = plan("forms", "react", ["forms", "validation"]);
  const validation = result.picks.find((pick) => pick.need === "validation");

  assert.ok(validation);
  assert.ok(["Zod", "Yup", "Valibot"].includes(validation.library.name));
});

test("necessidade sem biblioteca vira uma nota, não um resultado aleatório", () => {
  const result = plan("site", "react", ["drag"]);

  assert.deepEqual(result.picks, []);
  assert.deepEqual(result.notes, [{ kind: "missing", need: "drag" }]);
});

test("lista vazia de necessidades usa o padrão do objetivo", () => {
  const result = plan("docs", "any", []);
  const needs = result.picks.map((pick) => pick.need);

  assert.deepEqual(needs, DEFAULT_STACK_NEEDS.docs);
});
