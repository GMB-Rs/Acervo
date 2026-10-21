import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LibraryCard, domainOf } from "@/components/library-card";
import {
  getAllSlugs,
  getLibraryBySlug,
  getRelatedLibraries,
} from "@/lib/libraries";
import { formatCompact, formatNumber, getContrastColor, isLightColor } from "@/lib/format";
import { logoBoxClass, isTextMark, textMarkClass } from "@/lib/logo";
import { CATEGORY_LABELS, FRAMEWORK_LABELS } from "@/types/library";

/* eslint-disable @next/next/no-img-element */

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const library = getLibraryBySlug(slug);

  if (!library) {
    return { title: "Biblioteca não encontrada" };
  }

  return {
    title: library.name,
    description: library.description,
    alternates: { canonical: `/libraries/${library.slug}` },
    openGraph: {
      title: `${library.name} — Diretório`,
      description: library.description,
      type: "article",
    },
  };
}

export default function LibraryPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LibraryPageFallback />}>
      <LibraryPageContent params={params} />
    </Suspense>
  );
}

function LibraryPageFallback() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="aspect-[4/3] w-full max-w-[240px] rounded-md border border-border" />
      <div className="mt-8 h-8 w-64 rounded-md bg-muted" />
      <div className="mt-4 h-4 w-full max-w-lg rounded-md bg-muted" />
    </div>
  );
}

async function LibraryPageContent({ params }: PageProps) {
  const { slug } = await params;
  const library = getLibraryBySlug(slug);

  if (!library) {
    notFound();
  }

  const related = getRelatedLibraries(library);
  const githubUrl = library.repo
    ? `https://github.com/${library.repo}`
    : undefined;

  const facts = [
    { label: "estrelas", value: formatCompact(library.stars) },
    { label: "downloads/mês", value: formatCompact(library.npmDownloads) },
    { label: "licença", value: library.license },
    { label: "desde", value: String(library.since) },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <Link
        href="/#galeria"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground"
      >
        <span aria-hidden="true">←</span> galeria
      </Link>

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
              <dt className="text-muted-foreground">framework</dt>
              <dd className="font-mono">{FRAMEWORK_LABELS[library.framework]}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">categoria</dt>
              <dd className="font-mono">{CATEGORY_LABELS[library.category]}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">status</dt>
              <dd className="font-mono">
                {library.maintained ? "mantida" : "pouca atividade"}
              </dd>
            </div>
          </dl>

          <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted-foreground">
            {library.description}
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
                Documentação
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-9 items-center rounded-md border border-border px-4 text-xs font-medium transition hover:border-foreground/40"
              >
                GitHub
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
          Destaque
        </h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed">
          {library.highlight}
        </p>
      </section>

      {library.tags.length > 0 && (
        <section className="mt-10">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            Tags
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {library.tags.map((tag) => (
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
            Bibliotecas relacionadas
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Alternativas da mesma categoria ou stack.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <LibraryCard key={item.slug} library={item} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-14 font-mono text-[11px] text-muted-foreground">
        estrelas no GitHub: {formatNumber(library.stars)}. Métricas podem estar
        defasadas, rode npm run sync:github para atualizar.
      </p>
    </div>
  );
}
