import Link from "next/link";
import { RepoStars } from "@/components/repo-stars";
import { repo } from "@/lib/repo";
import { FRAMEWORKS } from "@/types/library";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/types";

/*
  Rodapé do site.

  Três blocos: a marca (com o contador de estrelas, que é o CTA para quem
  chegou pelo GitHub), as rotas de exploração por framework e os links do
  projeto (repositório, contribuição, licença e issues).

  Os links de framework levam para a galeria já filtrada — dá para chegar
  em "React" sem passar pela home.
*/
export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Link
              href={`/${locale}`}
              className="text-sm font-semibold tracking-tight"
            >
              Acervo
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {dict.footer.about}
            </p>
            <div className="mt-4">
              <RepoStars label={dict.nav.stars} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <nav aria-labelledby="footer-explore">
              <h2
                id="footer-explore"
                className="font-mono text-[11px] uppercase tracking-wider text-foreground"
              >
                {dict.footer.explore}
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <FooterLink href={`/${locale}`}>
                    {dict.footer.acervo}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={`/${locale}/stack`}>
                    {dict.nav.stack}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={`/${locale}/ia`}>
                    {dict.nav.ai}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={`/${locale}/contributors`}>
                    {dict.nav.contributors}
                  </FooterLink>
                </li>
                {FRAMEWORKS.map((framework) => (
                  <li key={framework}>
                    <FooterLink href={`/${locale}?framework=${framework}`}>
                      {dict.frameworkLabels[framework]}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="footer-project">
              <h2
                id="footer-project"
                className="font-mono text-[11px] uppercase tracking-wider text-foreground"
              >
                {dict.footer.project}
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <FooterLink href={repo.url} external>
                    GitHub
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={`${repo.url}/blob/main/CONTRIBUTING.md`} external>
                    {dict.footer.contribute}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={`${repo.url}/blob/main/LICENSE`} external>
                    {dict.footer.license}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={`${repo.url}/issues/new`} external>
                    {dict.footer.issues}
                  </FooterLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">{dict.footer.metrics}</p>
          <p>{dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}

/** Link do rodapé: interno com `next/link`, externo em âncora nova. */
function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const className =
    "text-muted-foreground transition hover:text-foreground";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
