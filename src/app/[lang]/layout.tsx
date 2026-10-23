import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeScript } from "@/components/theme-script";
import { HTML_LANG, LOCALES, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getBaseUrlObject } from "@/lib/site";
import "../globals.css";

/*
  Layout raiz do site — ele mora dentro de `[lang]` para que o atributo
  `lang` do <html> e o idioma da página venham da URL (`/pt`, `/en`).

  O idioma é lido no topo do layout (é ele que escolhe o dicionário inteiro),
  então a navegação para dentro de um idioma bloqueia — `instant = false`
  assume isso na cara.
*/
export const instant = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "pt";
  const dict = getDictionary(locale);

  return {
    metadataBase: getBaseUrlObject(),
    title: {
      default: dict.meta.title,
      template: dict.meta.template,
    },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    openGraph: {
      type: "website",
      locale: HTML_LANG[locale].replace("-", "_"),
      siteName: "Acervo",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "pt-BR": "/pt",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <>
      <html
        lang={HTML_LANG[lang]}
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          <ThemeScript />
          {/* Descoberta por agentes: índice em texto e catálogo em JSON. */}
          <link
            rel="alternate"
            type="text/markdown"
            href="/llms.txt"
            title="Acervo para LLMs"
          />
          <link
            rel="alternate"
            type="application/json"
            href="/api/libraries"
            title="Catálogo Acervo em JSON"
          />
        </head>
        <body className="flex min-h-full flex-col">
          <SiteHeader locale={lang} dict={dict} />
          <main className="flex-1">{children}</main>
          <SiteFooter locale={lang} dict={dict} />
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </>
  );
}
