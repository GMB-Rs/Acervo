import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://diretorio.dev"),
  title: {
    default: "Diretório — Bibliotecas de componentes web",
    template: "%s | Diretório",
  },
  description:
    "Galeria curada de bibliotecas de componentes para web: React, Vue, Svelte, Angular, Solid, Qwik e Web Components. Compare, filtre e escolha a stack certa.",
  keywords: [
    "bibliotecas de componentes",
    "design system",
    "react",
    "vue",
    "svelte",
    "angular",
    "web components",
    "headless ui",
    "tailwind",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Diretório",
    title: "Diretório — Bibliotecas de componentes web",
    description:
      "Galeria curada de bibliotecas de componentes para web, com busca e filtros por framework e categoria.",
  },
};

const themeScript = `(function(){try{var s=localStorage.getItem('diretorio-theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=(s==='light'||s==='dark')?s:(m?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
