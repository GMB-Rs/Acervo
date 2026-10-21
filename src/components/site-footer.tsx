import type { Dictionary } from "@/i18n/dictionaries/types";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-baseline sm:justify-between">
        <p>{dict.footer.about}</p>
        <p className="font-mono">{dict.footer.metrics}</p>
      </div>
    </footer>
  );
}
