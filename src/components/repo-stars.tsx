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
      className="hidden items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition hover:text-foreground sm:inline-flex"
    >
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        className="size-3.5 shrink-0"
      >
        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
      </svg>
      {stars}
    </a>
  );
}
