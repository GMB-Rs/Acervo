import repoJson from "@/data/repo.json";

/*
  Dados do repositório do próprio Acervo.

  O catálogo (`src/data/libraries.json`) guarda as métricas das bibliotecas
  listadas; aqui ficam as do repositório do site — o contador de estrelas que
  aparece no cabeçalho.

  `stars` e `forks` são atualizados por `scripts/sync-github.ts` (mesmo job
  que sincroniza o catálogo). O valor no arquivo é o que o servidor renderiza
  na primeira pintura; o componente `RepoStars` atualiza o número no
  navegador, direto da API do GitHub, para não ficar defasado entre um sync
  e outro.
*/

export type RepoInfo = {
  /** `owner/repo`. */
  repo: string;
  /** URL do repositório no GitHub. */
  url: string;
  stars: number;
  forks: number;
  /** ISO date da última sincronização. */
  updatedAt: string | null;
};

export const repo: RepoInfo = repoJson as RepoInfo;

/** Endpoint da API do GitHub usado para o contador se atualizar ao vivo. */
export const repoApiUrl = `https://api.github.com/repos/${repo.repo}`;
