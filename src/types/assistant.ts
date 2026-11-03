/*
  Assistentes de IA são produtos, não bibliotecas: não têm framework,
  categoria nem licença de código. Por isso vivem em um dataset próprio
  (`src/data/assistants.json`), mas compartilham a galeria unificada da página
  de IA com as bibliotecas e ferramentas.
*/

export type Assistant = {
  /** Identificador único usado no âncora e nas traduções */
  slug: string;
  name: string;
  /** Descrição curta (1-2 frases), em português */
  description: string;
  /** Destaque/curiosidade sobre o assistente */
  highlight: string;
  /** Site oficial do chat */
  website: string;
  /** Logo em `public/logos` */
  logo?: string;
  /**
   * Como a marca aparece no tile:
   * - "mark" (padrão): símbolo quadrado, centralizado;
   * - "wide": wordmark horizontal;
   * - "text": sem imagem — o nome é escrito no tile.
   */
  logoKind?: "mark" | "wide" | "text";
  /** Cor de fundo do tile (hex) */
  color: string;
  /** Palavras-chave exibidas no card */
  tags: string[];
  /** Ano de lançamento */
  since: number;
};
