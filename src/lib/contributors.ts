import { cacheLife } from "next/cache";
import contributorsJson from "@/data/contributors.json";
import { repo } from "@/lib/repo";

/*
  Quem já contribuiu com o Acervo.

  A lista vem da API de contribuidores do GitHub, com cache no servidor: a
  versão anônima da API responde 403 quando o limite de 60 requisições por
  hora por IP acaba, e num servidor com IP compartilhado isso acontece
  sempre. Com `GITHUB_TOKEN` o limite sobe para 5000/hora.

  Se a API falhar (limite, repo privado, rede), a lista do último sync
  (`src/data/contributors.json`) é a que fica — falhar de leve é melhor do
  que uma página vazia.

  Robôs ficam de fora: o Dependabot aparece na API, mas ninguém acha útil
  ver um bot na lista de pessoas.
*/

export type Contributor = {
  /** Usuário no GitHub. */
  login: string;
  /** Avatar (URL absoluto do GitHub). */
  avatar: string;
  /** Perfil no GitHub. */
  url: string;
  /** Commits no repositório. */
  contributions: number;
};

type GithubContributor = {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
};

export async function getContributors(): Promise<Contributor[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 3600, expire: 86400 });

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo.repo}/contributors?per_page=100`,
      {
        headers,
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!response.ok) {
      throw new Error(`a API do GitHub respondeu ${response.status}`);
    }

    const data = (await response.json()) as GithubContributor[];
    const contributors = data
      .filter((item) => item.type === "User" || item.type === "Organization")
      .map((item) => ({
        login: item.login,
        avatar: item.avatar_url,
        url: item.html_url,
        contributions: item.contributions,
      }));

    if (contributors.length === 0) {
      throw new Error("a API do GitHub não devolveu nenhum contribuidor");
    }

    return contributors;
  } catch {
    // API fora do ar, sem limite ou repo privado: fica a lista do sync.
    return contributorsJson.contributors;
  }
}
