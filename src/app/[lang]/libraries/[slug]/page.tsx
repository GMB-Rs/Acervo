import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { LibraryCard, domainOf } from "@/components/library-card";
import {
  getAllSlugs,
  getLibraryBySlug,
  getRelatedLibraries,
} from "@/lib/libraries";
import { formatCompact, formatNumber, getContrastColor, isLightColor } from "@/lib/format";
import { licenseLabel } from "@/lib/license";
import { logoBoxClass, isTextMark, textMarkClass } from "@/lib/logo";
import { HTML_LANG, isLocale } from "@/i18n/config";
import { formatText } from "@/i18n/format";
import { getDictionary } from "@/i18n/get-dictionary";
import { libraryText, translateTags } from "@/i18n/library-text";

/* eslint-disable @next/next/no-img-element */

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

/*
  A rota lê os `params` no topo para decidir se a biblioteca existe: o 404
  precisa ser disparado antes de a resposta começar a ser enviada, senão o
  status vira 200. Isso deixa a navegação para a ficha bloqueando — o que
  `instant = false` assume explicitamente.
*/
export const instant = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);
  const library = getLibraryBySlug(slug);

  if (!library) {
    return { title: dict.notFound.title };
  }

  const text = libraryText(locale, library);

  return {
    title: library.name,
    description: text.description,
    alternates: {
      canonical: `/${locale}/libraries/${library.slug}`,
      languages: {
        "pt-BR": `/pt/libraries/${library.slug}`,
        en: `/en/libraries/${library.slug}`,
      },
    },
    openGraph: {
      title: `${library.name} — Diretório`,
      description: text.description,
      type: "article",
    },
  };
}

/*
  A ficha é montada no servidor. Só o botão de voltar precisa da query
  string (para devolver o usuário à galeria com os mesmos filtros), então
  ele mora num limite de Suspense — a página continua estática e só esse
  pedacinho é renderizado no cliente.
*/
export default async function LibraryPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const library = getLibraryBySlug(slug);

  /*
    O 404 é disparado aqui, fora do Suspense: dentro dele a resposta já
    teria começado a ser enviada e o status não poderia mais ser 404.
  */
  if (!library) {
    notFound();
  }

  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);
  const text = libraryText(locale, library);
  const related = getRelatedLibraries(library);
  const githubUrl = library.repo
    ? `https://github.com/${library.repo}`
    : undefined;
  const numberLocale = HTML_LANG[locale];

  const facts = [
    { label: dict.detail.stars, value: formatCompact(library.stars, numberLocale) },
    {
      label: dict.detail.downloads,
      value: formatCompact(library.npmDownloads, numberLocale),
    },
    { label: dict.detail.license, value: licenseLabel(library.license, dict.license) },
    { label: dict.detail.since, value: String(library.since) },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <Suspense fallback={<BackLinkFallback />}>
        <BackLink locale={locale} label={dict.detail.back} />
      </Suspense>

      <div className="mt-8 grid gap-8 sm:grid-cols-[240px_1fr] sm:items-start">
        <div
          className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-border px-3"
          style={{ backgroundColor: library.color }}
        >
          {library.logo && !isTextMark(library) ? (
            <img
              src={`/logos/${library.logo}`}
              alt=""
              width={72}
              height={72}
              className={`${logoBoxClass(library, "lg")} opacity-95`}
              style={isLightColor(library.color) ? { filter: "invert(1)" } : {}}
            />
          ) : (
            <span
              className={textMarkClass(library.name, "lg")}
              style={{ color: getContrastColor(library.color) }}
            >
              {library.name}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {library.name}
          </h1>

          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">{dict.detail.framework}</dt>
              <dd className="font-mono">{dict.frameworkLabels[library.framework]}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">{dict.detail.category}</dt>
              <dd className="font-mono">{dict.categoryLabels[library.category]}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">{dict.detail.status}</dt>
              <dd className="font-mono">
                {library.maintained
                  ? dict.detail.maintained
                  : dict.detail.lowActivity}
              </dd>
            </div>
          </dl>

          <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted-foreground">
            {text.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={library.website}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-xs font-semibold text-accent-foreground transition hover:opacity-80"
            >
              {domainOf(library.website)}
            </a>
            {library.docs && (
              <a
                href={library.docs}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-9 items-center rounded-md border border-border px-4 text-xs font-medium transition hover:border-foreground/40"
              >
                {dict.detail.docs}
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-9 items-center rounded-md border border-border px-4 text-xs font-medium transition hover:border-foreground/40"
              >
                {dict.detail.github}
              </a>
            )}
          </div>
        </div>
      </div>

      <dl className="mt-12 grid grid-cols-4 gap-x-6 border-t border-border border-b border-border py-4">
        {facts.map((fact) => (
          <div key={fact.label} className="min-w-0">
            <dt className="font-mono text-[11px] text-muted-foreground">
              {fact.label}
            </dt>
            <dd className="mt-2 truncate text-lg font-semibold tracking-tight">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-12 border-l-2 border-foreground pl-4">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          {dict.detail.highlight}
        </h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed">
          {text.highlight}
        </p>
      </section>

      {library.tags.length > 0 && (
        <section className="mt-10">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {dict.detail.tags}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {translateTags(locale, library.tags).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-lg font-semibold tracking-tight">
            {dict.detail.related}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {dict.detail.relatedHint}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <LibraryCard
                key={item.slug}
                library={item}
                locale={locale}
                dict={dict}
              />
            ))}
          </div>
        </section>
      )}

      <p className="mt-14 font-mono text-[11px] text-muted-foreground">
        {formatText(dict.detail.metricsNote, {
          stars: formatNumber(library.stars, numberLocale),
        })}
      </p>
    </div>
  );
}

/* Esqueleto do botão de voltar, mostrado até o cliente hidratar. */
function BackLinkFallback() {
  return (
    <div className="inline-flex h-[30px] w-[190px] items-center rounded-md border border-border px-3" />
  );
}
