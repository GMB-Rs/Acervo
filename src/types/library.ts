export const FRAMEWORKS = [
  "react",
  "vue",
  "svelte",
  "angular",
  "solid",
  "qwik",
  "web-components",
  "vanilla",
] as const;

export type Framework = (typeof FRAMEWORKS)[number];

export const CATEGORIES = [
  "ui-kit",
  "headless",
  "design-system",
  "utility",
  "forms",
  "data",
  "icons",
  "animation",
  "mobile",
  "web",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Library = {
  /** Identificador único usado na URL /libraries/<slug> */
  slug: string;
  name: string;
  /** Descrição curta (1-2 frases), em português */
  description: string;
  /** Destaque/curiosidade sobre a biblioteca */
  highlight: string;
  framework: Framework;
  category: Category;
  /** Site oficial */
  website: string;
  /** Repositório no formato "owner/repo" (usado pela sincronização com o GitHub) */
  repo?: string;
  /** Pacote no npm (usado pela sincronização de downloads) */
  npmPackage?: string;
  /** Documentação */
  docs?: string;
  license: string;
  /** Logo em `public/logos` */
  logo?: string;
  /**
   * Como a marca aparece no tile:
   * - "mark" (padrão): símbolo quadrado, centralizado no tile;
   * - "wide": wordmark horizontal — o SVG tem viewBox largo e a logo
   *   ocupa a largura do tile;
   * - "text": sem imagem — o tile mostra o nome da biblioteca em texto.
   */
  logoKind?: "mark" | "wide" | "text";
  /** Cor de fundo do preview (hex) */
  color: string;
  /** Palavras-chave para busca */
  tags: string[];
  /** Número de estrelas no GitHub (atualizado por `npm run sync:github`) */
  stars?: number;
  /** Downloads mensais no npm (atualizado por `npm run sync:github`) */
  npmDownloads?: number;
  /** Destacado na home */
  featured?: boolean;
  /** Projeto ativamente mantido */
  maintained: boolean;
  /** Ano de lançamento/marco inicial do projeto */
  since: number;
};

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
  angular: "Angular",
  solid: "Solid",
  qwik: "Qwik",
  "web-components": "Web Components",
  vanilla: "Vanilla JS",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  "ui-kit": "UI Kit",
  headless: "Headless",
  "design-system": "Design System",
  utility: "Utilitários / CSS",
  forms: "Formulários",
  data: "Dados & Tabelas",
  icons: "Ícones",
  animation: "Animação",
  mobile: "Mobile / Universal",
  web: "Web Components",
};
