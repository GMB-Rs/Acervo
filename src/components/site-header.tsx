import Link from "next/link";
import { LanguageSelect } from "@/components/language-select";
import { ThemeToggle } from "@/components/theme-toggle";
import { RepoStars } from "@/components/repo-stars";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/types";

export function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:gap-6">
        <Link
          href={`/${locale}`}
          className="shrink-0 text-base font-semibold tracking-tight"
        >
          Acervo
        </Link>

        {/*
          "Tudo" leva ao catálogo completo na home. As áreas são recortes por
          etapa do projeto: a IA tem página própria e Interface, Front, Back e
          DevOps caem na rota dinâmica `[area]`. No mobile a lista rola na
          horizontal em vez de quebrar a altura fixa da navbar.
        */}
        <nav className="scrollbar-hide flex min-w-0 items-center gap-3 overflow-x-auto whitespace-nowrap sm:gap-4">
          <NavLink href={`/${locale}`}>{dict.nav.all}</NavLink>
          <NavLink href={`/${locale}/ia`}>{dict.nav.ai}</NavLink>
          <NavLink href={`/${locale}/interface`}>
            {dict.areas.interface.nav}
          </NavLink>
          <NavLink href={`/${locale}/front`}>{dict.areas.front.nav}</NavLink>
          <NavLink href={`/${locale}/back`}>{dict.areas.back.nav}</NavLink>
          <NavLink href={`/${locale}/devops`}>
            {dict.areas.devops.nav}
          </NavLink>
          <NavLink href={`/${locale}/contributors`} className="hidden sm:inline">
            {dict.nav.contributors}
          </NavLink>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
          <RepoStars label={dict.nav.stars} />
          <LanguageSelect locale={locale} label={dict.nav.language} />
          <ThemeToggle dict={dict} />
        </div>
      </div>
    </header>
  );
}

/** Link de navegação da navbar, com o mesmo peso visual em todas as áreas. */
function NavLink({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-[11px] font-medium text-muted-foreground transition hover:text-foreground sm:text-xs ${className}`}
    >
      {children}
    </Link>
  );
}
