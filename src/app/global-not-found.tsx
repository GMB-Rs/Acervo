import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

/*
  404 global: endereço que não casa com nenhuma rota (o layout raiz mora em
  `[lang]`, então este arquivo é o único jeito de responder a URL solta).
  Ele desenha o documento inteiro — estilos e fontes inclusos.
*/

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Página não encontrada - Acervo",
};

export default function GlobalNotFound() {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start px-4 py-24">
          <p className="font-mono text-xs text-muted-foreground">erro 404</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Essa página não existe
          </h1>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
            O endereço pode estar quebrado ou a página ainda não existe.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-9 items-center rounded-md bg-accent px-4 text-xs font-semibold text-accent-foreground transition hover:opacity-80"
          >
            Voltar para o acervo
          </Link>
        </main>
      </body>
    </html>
  );
}
