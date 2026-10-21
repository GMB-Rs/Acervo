import Link from "next/link";
import { LanguageSelect } from "@/components/language-select";
import { ThemeToggle } from "@/components/theme-toggle";
import { libraries } from "@/lib/libraries";
import type { Locale } from "@/i18n/config";
import { formatText } from "@/i18n/format";
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
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="inline-flex size-5 items-center justify-center bg-foreground text-[10px] font-bold text-background">
            D
          </span>
          Diretório
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
            {formatText(dict.nav.libs, { n: libraries.length })}
          </span>
          <LanguageSelect locale={locale} label={dict.nav.language} />
          <ThemeToggle dict={dict} />
        </div>
      </div>
    </header>
  );
}
