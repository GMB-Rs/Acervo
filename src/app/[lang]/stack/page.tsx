import type { Metadata } from "next";
import { StackBuilder } from "@/components/stack-builder";
import { libraries } from "@/lib/libraries";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizeLibrary } from "@/i18n/library-text";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);

  return {
    title: dict.stack.metaTitle,
    description: dict.stack.metaDescription,
    alternates: {
      canonical: `/${locale}/stack`,
      languages: {
        "pt-BR": "/pt/stack",
        en: "/en/stack",
      },
    },
    openGraph: {
      title: `${dict.stack.metaTitle} - Acervo`,
      description: dict.stack.metaDescription,
    },
  };
}

export default async function StackPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);
  const localizedLibraries = libraries.map((library) =>
    localizeLibrary(locale, library),
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          {dict.stack.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {dict.stack.intro}
        </p>
      </header>

      <div className="mt-10">
        <StackBuilder
          libraries={localizedLibraries}
          locale={locale}
          dict={dict}
        />
      </div>
    </div>
  );
}
