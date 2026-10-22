import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
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
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <BrandMark className="size-5 shrink-0" />
          Acervo
        </Link>

        <nav className="flex items-center">
          <Link
            href={`/${locale}/contributors`}
            className="text-[11px] font-medium text-muted-foreground transition hover:text-foreground sm:text-xs"
          >
            {dict.nav.contributors}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <RepoStars label={dict.nav.stars} />
          <LanguageSelect locale={locale} label={dict.nav.language} />
          <ThemeToggle dict={dict} />
        </div>
      </div>
    </header>
  );
}
