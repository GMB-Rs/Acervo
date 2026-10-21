import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { THEME_SCRIPT, applyTheme } from "./theme.ts";

type Scenario = { stored: string | null; prefersDark: boolean };

/** Um <html> de mentira, com o atributo que a gente quer observar. */
function fakeDom(stored: string | null, prefersDark: boolean) {
  const state = { theme: null as string | null };
  const window = {
    localStorage: { getItem: () => stored },
    matchMedia: () => ({ matches: prefersDark }),
  };
  const document = {
    documentElement: {
      setAttribute: (name: string, value: string) => {
        if (name === "data-theme") state.theme = value;
      },
    },
  };
  return { state, window, document };
}

/** Roda o script que vai para o <head> do servidor. */
function runInlineScript(scenario: Scenario) {
  const fake = fakeDom(scenario.stored, scenario.prefersDark);
  vm.runInNewContext(THEME_SCRIPT, {
    window: fake.window,
    document: fake.document,
    localStorage: fake.window.localStorage,
  });
  return fake.state.theme;
}

/** Roda a função que o cliente usa. */
function runApplyTheme(scenario: Scenario) {
  const fake = fakeDom(scenario.stored, scenario.prefersDark);
  const globals = globalThis as unknown as { window: unknown; document: unknown };
  const previousWindow = globals.window;
  const previousDocument = globals.document;
  globals.window = fake.window;
  globals.document = fake.document;
  try {
    applyTheme();
  } finally {
    globals.window = previousWindow;
    globals.document = previousDocument;
  }
  return fake.state.theme;
}

const SCENARIOS: Scenario[] = [
  { stored: "dark", prefersDark: false },
  { stored: "light", prefersDark: true },
  { stored: null, prefersDark: true },
  { stored: null, prefersDark: false },
  { stored: "arco-íris", prefersDark: true },
];

test("o script inline escolhe o tema salvo antes da preferência do sistema", () => {
  assert.equal(runInlineScript({ stored: "dark", prefersDark: false }), "dark");
  assert.equal(runInlineScript({ stored: "light", prefersDark: true }), "light");
});

test("o script inline segue o sistema quando ninguém escolheu um tema", () => {
  assert.equal(runInlineScript({ stored: null, prefersDark: true }), "dark");
  assert.equal(runInlineScript({ stored: null, prefersDark: false }), "light");
});

test("o script inline ignora um tema salvo inválido", () => {
  assert.equal(runInlineScript({ stored: "arco-íris", prefersDark: true }), "dark");
});

test("o script inline e a função do cliente escolhem o mesmo tema", () => {
  for (const scenario of SCENARIOS) {
    assert.equal(
      runInlineScript(scenario),
      runApplyTheme(scenario),
      `divergência no cenário ${JSON.stringify(scenario)}`,
    );
  }
});
