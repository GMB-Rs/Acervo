import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { domainOf } from "@/components/library-card";
import { getAllAssistantSlugs, getAssistantBySlug } from "@/lib/assistants";
import { getContrastColor, isLightColor } from "@/lib/format";
import { logoBoxClass, isTextMark, textMarkClass } from "@/lib/logo";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { assistantText, localizeAssistant } from "@/lib/assistants";
import { translateTags } from "@/i18n/library-text";

/* eslint-disable @next/next/no-img-element */

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export const instant = false;

export function generateStaticParams() {
  return getAllAssistantSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);
  const assistant = getAssistantBySlug(slug);

  if (!assistant) return { title: dict.notFound.title };

  const text = assistantText(locale, assistant);

  return {
    title: assistant.name,
    description: text.description,
    alternates: {
      canonical: `/${locale}/assistants/${assistant.slug}`,
      languages: {
        "pt-BR": `/pt/assistants/${assistant.slug}`,
        en: `/en/assistants/${assistant.slug}`,
      },
    },
    openGraph: {
      title: `${assistant.name} - Acervo`,
      description: text.description,
      type: "article",
    },
  };
}

export default async function AssistantPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const assistant = getAssistantBySlug(slug);
  if (!assistant) notFound();

  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);
  const localizedAssistant = localizeAssistant(locale, assistant);
  const text = assistantText(locale, assistant);
  const lightBg = isLightColor(assistant.color);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <Suspense fallback={<div className="inline-flex h-[30px] w-[190px] rounded-md border border-border" />}>
        <BackLink locale={locale} label={dict.detail.back} />
      </Suspense>

      <div className="mt-8 grid gap-8 sm:grid-cols-[240px_1fr] sm:items-start">
        <div
          className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-border px-3"
          style={{ backgroundColor: assistant.color }}
        >
          {assistant.logo && !isTextMark(assistant) ? (
            <img
              src={`/logos/${assistant.logo}`}
              alt=""
              width={72}
              height={72}
              className={`${logoBoxClass(assistant, "lg")} opacity-95`}
              style={lightBg ? { filter: "invert(1)" } : {}}
            />
          ) : (
            <span
              className={textMarkClass(assistant.name, "lg")}
              style={{ color: getContrastColor(assistant.color) }}
            >
              {assistant.name}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {assistant.name}
          </h1>
          <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted-foreground">
            {text.description}
          </p>
          <a
            href={assistant.website}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex h-9 items-center rounded-md bg-accent px-4 text-xs font-semibold text-accent-foreground transition hover:opacity-80"
          >
            {domainOf(assistant.website)}
          </a>
        </div>
      </div>

      <section className="mt-12 border-l-2 border-foreground pl-4">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          {dict.detail.highlight}
        </h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed">
          {text.highlight}
        </p>
      </section>

      {localizedAssistant.tags.length > 0 && (
        <section className="mt-10">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {dict.detail.tags}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {translateTags(locale, localizedAssistant.tags).map((tag) => (
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

      <dl className="mt-12 grid grid-cols-2 gap-x-6 border-y border-border py-4 sm:grid-cols-4">
        <div>
          <dt className="font-mono text-[11px] text-muted-foreground">
            {dict.detail.since}
          </dt>
          <dd className="mt-2 text-lg font-semibold tracking-tight">
            {assistant.since}
          </dd>
        </div>
      </dl>
    </div>
  );
}
