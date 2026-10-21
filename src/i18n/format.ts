/*
  Os textos do dicionário são só dados, com placeholders no formato {chave}.
  Esta função troca os placeholders pelos valores — é o que permite ao mesmo
  dicionário atravessar a fronteira servidor/cliente sem função nenhuma.
*/

export type TemplateValues = Record<string, string | number>;

export function formatText(
  template: string,
  values: TemplateValues = {},
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
