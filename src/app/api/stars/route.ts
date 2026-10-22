import { cacheLife } from "next/cache";
import { repo, repoApiUrl } from "@/lib/repo";

/*
  Quantas estrelas o repositório do Acervo tem no GitHub.

  O navegador não pode buscar isso direto na API do GitHub: a versão
  anônima responde 403 (limite de 60 requisições por hora por IP) sempre que
  o IP é compartilhado — e em rede corporativa, VPN e provedor de nuvem isso
  acontece o tempo todo. Buscando pelo site, o limite vira um por servidor,
  e a resposta fica em cache por alguns minutos.

  Sem `GITHUB_TOKEN` o limite do servidor é o mesmo de 60/hora; com o token
  (ver README → Deploy) ele sobe para 5000/hora. Se a API falhar, o valor
  do último sync (`src/data/repo.json`) é o que fica.
*/

export async function GET() {
  return Response.json({ stars: await getStars() });
}

async function getStars(): Promise<number> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(repoApiUrl, {
      headers,
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`a API do GitHub respondeu ${response.status}`);
    }

    const data = (await response.json()) as { stargazers_count?: number };
    if (typeof data.stargazers_count !== "number") {
      throw new Error("a resposta do GitHub não tem stargazers_count");
    }

    return data.stargazers_count;
  } catch {
    // API fora do ar, sem limite ou repo privado: fica o valor do sync.
    return repo.stars;
  }
}
