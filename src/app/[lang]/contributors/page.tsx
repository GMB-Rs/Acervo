import type { Metadata } from "next";
import { getContributors } from "@/lib/contributors";
import { repo } from "@/lib/repo";
import { formatNumber } from "@/lib/format";
import { HTML_LANG, isLocale } from "@/i18n/config";
import { formatText } from "@/i18n/format";
import { getDictionary } from "@/i18n/get-dictionary";

/* eslint-disable @next/next/no-img-element */

type PageProps = {
  params: Promise<{ lang: string }>;
};

/*
  Quem já contribuiu com o Acervo.

  A lista vem do servidor (API do GitHub com cache, e o arquivo do sync como
  reserva) — assim a página é estática e não depende do navegador para
  mostrar quem contribuiu.
*/
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);

  return {
    title: dict.contributors.title,
    description: dict.contributors.intro,
    alternates: {
      canonical: `/${locale}/contributors`,
      languages: {
        "pt-BR": "/pt/contributors",
        en: "/en/contributors",
      },
    },
    openGraph: {
      title: `${dict.contributors.title} — Acervo`,
      description: dict.contributors.intro,
    },
  };
}

export default async function ContributorsPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);
  const contributors = await getContributors();
  const numberLocale = HTML_LANG[locale];

  const count =
    contributors.length === 1
      ? dict.contributors.countOne
      : formatText(dict.contributors.countMany, { n: contributors.length });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {dict.nav.contributors}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        {dict.contributors.title}
      </h1>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
        {dict.contributors.intro}
      </p>

      <section className="mt-12">
        <div className="border-b border-border pb-3">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {count}
          </h2>
        </div>

        {contributors.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            {dict.contributors.empty}
          </p>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contributors.map((contributor) => (
              <li key={contributor.login}>
                <a
                  href={contributor.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-3 rounded-md border border-border px-3 py-3 transition hover:border-foreground/40"
                >
                  <img
                    src={contributor.avatar}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="size-10 shrink-0 rounded-full border border-border bg-muted"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {contributor.login}
                    </span>
                    <span className="block font-mono text-[11px] text-muted-foreground">
                      {formatText(dict.contributors.commits, {
                        n: formatNumber(contributor.contributions, numberLocale),
                      })}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 font-mono text-[11px] text-muted-foreground">
          {dict.contributors.botsNote}
        </p>
      </section>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          {dict.contributors.joinTitle}
        </h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
          {dict.contributors.joinText}
        </p>

        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {dict.contributors.steps.map((step, index) => (
            <li key={step.title}>
              <span className="font-mono text-[11px] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-sm font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-2">
          <a
            href={`${repo.url}/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-xs font-semibold text-accent-foreground transition hover:opacity-80"
          >
            {dict.contributors.ctaContribute}
          </a>
          <a
            href={`${repo.url}/issues/new`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-9 items-center rounded-md border border-border px-4 text-xs font-medium transition hover:border-foreground/40"
          >
            {dict.contributors.ctaIssues}
          </a>
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-9 items-center rounded-md border border-border px-4 text-xs font-medium transition hover:border-foreground/40"
          >
            {dict.contributors.ctaRepo}
          </a>
        </div>
      </section>
    </div>
  );
}
