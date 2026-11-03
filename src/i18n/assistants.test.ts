import { test } from "node:test";
import assert from "node:assert/strict";
import assistantTranslations from "../data/translations/assistants.en.json" with { type: "json" };
import {
  assistantText,
  assistants,
  localizeAssistant,
} from "../lib/assistants.ts";

const translations = assistantTranslations as Record<
  string,
  { description: string; highlight: string }
>;

test("todo assistente tem texto traduzido para inglês", () => {
  for (const assistant of assistants) {
    const text = translations[assistant.slug];
    assert.ok(text, `falta a tradução de ${assistant.slug}`);
    assert.ok(text.description.length > 0);
    assert.ok(text.highlight.length > 0);
    assert.notEqual(text.description, assistant.description);
  }
});

test("assistantText devolve o português quando o idioma é o padrão", () => {
  const assistant = assistants[0];
  assert.deepEqual(assistantText("pt", assistant), {
    description: assistant.description,
    highlight: assistant.highlight,
  });
});

test("localizeAssistant troca descrição e destaque", () => {
  const assistant = assistants.find((item) => item.slug === "chatgpt");
  assert.ok(assistant);

  const localized = localizeAssistant("en", assistant);
  assert.equal(localized.description, translations.chatgpt.description);
  assert.equal(localized.highlight, translations.chatgpt.highlight);
  assert.equal(localized.name, assistant.name);
});

test("cada assistente tem logo ou marca em texto", () => {
  for (const assistant of assistants) {
    assert.ok(
      assistant.logo || assistant.logoKind === "text",
      `${assistant.slug} sem logo`,
    );
  }
});
