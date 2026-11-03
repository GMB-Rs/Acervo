import { domainOf } from "@/components/library-card";
import { getContrastColor, isLightColor } from "@/lib/format";
import { isTextMark, logoBoxClass, textMarkClass } from "@/lib/logo";
import { translateTags } from "@/i18n/library-text";
import type { Locale } from "@/i18n/config";
import type { Assistant } from "@/types/assistant";

/* eslint-disable @next/next/no-img-element */

/*
  Card de um assistente de IA. Segue a linguagem visual da ficha de
  biblioteca — tile colorido com a marca branca e legenda monoespaçada —
  mas o link leva direto para o site do produto, não para uma página interna.
*/
export function AssistantCard({
  assistant,
  locale,
}: {
  assistant: Assistant;
  locale: Locale;
}) {
  const lightBg = isLightColor(assistant.color);
  const contrastColor = getContrastColor(assistant.color);
  const logoStyle = lightBg ? { filter: "invert(1)" as const } : {};
  const tags = translateTags(locale, assistant.tags);

  return (
    <a
      href={assistant.website}
      target="_blank"
      rel="noreferrer"
      className="group block"
    >
      <div
        className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-border px-3 transition-colors duration-200 group-hover:border-foreground/40"
        style={{ backgroundColor: assistant.color }}
      >
        {assistant.logo && !isTextMark(assistant) ? (
          <img
            src={`/logos/${assistant.logo}`}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            className={`${logoBoxClass(assistant, "sm")} opacity-95 transition-transform duration-200 group-hover:scale-105`}
            style={logoStyle}
          />
        ) : (
          <span
            className={textMarkClass(assistant.name, "sm")}
            style={{ color: contrastColor }}
          >
            {assistant.name}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-3">
        <span className="min-w-0 truncate text-[13px] font-medium text-foreground">
          {assistant.name}
        </span>
        <span className="max-w-[45%] truncate font-mono text-[11px] text-muted-foreground">
          {domainOf(assistant.website)}
        </span>
      </div>

      <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
        {tags.join(" · ")}
      </p>
    </a>
  );
}
