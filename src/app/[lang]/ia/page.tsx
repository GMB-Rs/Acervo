import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { HTML_LANG, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getBaseUrl } from "@/lib/site";

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
    title: dict.ai.metaTitle,
    description: dict.ai.metaDescription,
    alternates: {
      canonical: `/${locale}/ia`,
      languages: {
        "pt-BR": "/pt/ia",
        en: "/en/ia",
      },
    },
    openGraph: {
      title: `${dict.ai.metaTitle} - Acervo`,
      description: dict.ai.metaDescription,
    },
  };
}

export default async function AiPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);
  const base = getBaseUrl();
  const path = locale === "pt" ? "/caminho/para/Diretorio" : "/path/to/Diretorio";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: dict.ai.title,
          description: dict.ai.metaDescription,
          inLanguage: HTML_LANG[locale],
          url: `${base}/${locale}/ia`,
          isPartOf: {
            "@type": "WebSite",
            name: "Acervo",
            url: `${base}/${locale}`,
          },
        }}
      />

      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          {dict.ai.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {dict.ai.intro}
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          {dict.ai.catalogTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {dict.ai.catalogText}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            href="/llms.txt"
            className="rounded-md border border-border p-4 transition hover:border-foreground/50"
          >
            <span className="font-mono text-xs">/llms.txt</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {dict.ai.llms}
            </span>
          </a>
          <a
            href="/llms-full.txt"
            className="rounded-md border border-border p-4 transition hover:border-foreground/50"
          >
            <span className="font-mono text-xs">/llms-full.txt</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {dict.ai.llmsFull}
            </span>
          </a>
          <Link
            href="/api/libraries"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border p-4 transition hover:border-foreground/50"
          >
            <span className="font-mono text-xs">GET /api/libraries</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {dict.ai.api}
            </span>
          </Link>
          <Link
            href="/api/libraries/shadcn-ui"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border p-4 transition hover:border-foreground/50"
          >
            <span className="font-mono text-xs">GET /api/libraries/[slug]</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {dict.ai.apiDetail}
            </span>
          </Link>
        </div>

        <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-muted/30 p-3 font-mono text-xs leading-relaxed">
          <code>{dict.ai.apiExample}</code>
        </pre>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {dict.ai.jsonLd}
        </p>
      </section>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            {dict.ai.searchTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {dict.ai.searchText}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            {dict.ai.stackTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {dict.ai.stackText}
          </p>
          <Link
            href={`/${locale}/stack`}
            className="mt-3 inline-block rounded-md border border-border px-3 py-2 text-xs transition hover:border-foreground/50"
          >
            {dict.ai.stackCta}
          </Link>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          {dict.ai.mcpTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {dict.ai.mcpText}
        </p>

        <p className="mt-4 text-sm text-muted-foreground">
          {dict.ai.mcpCommand}
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-muted/30 p-3 font-mono text-xs">
          <code>npm run mcp</code>
        </pre>

        <p className="mt-4 text-sm text-muted-foreground">
          {dict.ai.mcpConfig}
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-muted/30 p-3 font-mono text-xs leading-relaxed">
          <code>{`{
  "mcpServers": {
    "acervo": {
      "command": "npm",
      "args": ["--prefix", "${path}", "run", "mcp"]
    }
  }
}`}</code>
        </pre>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {dict.ai.mcpTools}
            </h3>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <code className="text-foreground">search_libraries</code> —{" "}
                {dict.ai.mcpToolSearch}
              </li>
              <li>
                <code className="text-foreground">get_library</code> —{" "}
                {dict.ai.mcpToolLibrary}
              </li>
              <li>
                <code className="text-foreground">recommend_stack</code> —{" "}
                {dict.ai.mcpToolStack}
              </li>
            </ul>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {dict.ai.mcpResources}
          </p>
        </div>
      </section>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            {dict.ai.privacyTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {dict.ai.privacyText}
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            {dict.ai.limitsTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {dict.ai.limitsText}
          </p>
        </section>
      </div>
    </div>
  );
}
