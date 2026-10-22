"use client";

import { useEffect, useState } from "react";
import { repo, repoApiUrl } from "@/lib/repo";
import { formatText } from "@/i18n/format";

/*
  Contador de estrelas do repositório do Acervo.

  O número do servidor (`src/data/repo.json`) entra na primeira pintura, sem
  layout shift. Depois, no navegador, o componente pergunta à API do GitHub
  e atualiza o valor — assim o contador não fica preso ao sync semanal.

  Se a API falhar (repo privado, limite de requisições, offline), o valor
  estático continua na tela: falhar de leve é melhor do que quebrar a página.
*/

export function RepoStars({ label }: { label: string }) {
  // O servidor renderiza o último valor sincronizado; o navegador troca pelo
  // número atual assim que a API responde. Se a API falhar (repositório
  // privado, limite de requisições, offline), o valor antigo fica na tela.
  const [stars, setStars] = useState(repo.stars);

  useEffect(() => {
    let cancelled = false;

    fetch(repoApiUrl, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { stargazers_count?: number } | null) => {
        if (cancelled) return;
        const count = data?.stargazers_count;
        if (typeof count === "number") setStars(count);
      })
      .catch(() => {
        // Sem rede ou API fora do ar: mantém o valor estático.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      title={formatText(label, { n: stars })}
      aria-label={formatText(label, { n: stars })}
      className="hidden items-center gap-1 font-mono text-[11px] text-muted-foreground transition hover:text-foreground sm:inline-flex"
    >
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        className="size-3 shrink-0"
      >
        <path d="M8 .25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V1A.75.75 0 0 1 8 .25Zm0 10.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 8 10.75Zm3.25-1.5a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5H12v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5a.75.75 0 0 1 .75-.75ZM5 9.5a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 5 9.5Z" />
      </svg>
      <span>{stars}</span>
    </a>
  );
}
