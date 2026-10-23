"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_STACK_NEEDS,
  STACK_GOALS,
  STACK_NEEDS,
  recommendStack,
  type StackGoal,
  type StackFramework,
  type StackNeed,
} from "@/lib/stack";
import { FRAMEWORKS, type Library } from "@/types/library";
import { licenseFamily } from "@/lib/license";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/types";
import { formatText } from "@/i18n/format";

/*
  Interface do recomendador. Toda a lógica está em `src/lib/stack.ts`; aqui
  só ficam estado, seleção e a explicação em texto. O resultado é recalculado
  no cliente a cada mudança — nenhuma chamada de rede.
*/
export function StackBuilder({
  libraries,
  locale,
  dict,
}: {
  libraries: Library[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [goal, setGoal] = useState<StackGoal>("dashboard");
  const [framework, setFramework] = useState<StackFramework>("any");
  const [needs, setNeeds] = useState<StackNeed[]>(
    DEFAULT_STACK_NEEDS.dashboard,
  );
  const [openSourceOnly, setOpenSourceOnly] = useState(true);
  const [copied, setCopied] = useState(false);

  const plan = useMemo(() => {
    if (needs.length === 0) return null;
    return recommendStack(libraries, {
      goal,
      framework,
      needs,
      openSourceOnly,
    });
  }, [libraries, goal, framework, needs, openSourceOnly]);

  function changeGoal(nextGoal: StackGoal) {
    setGoal(nextGoal);
    setNeeds(DEFAULT_STACK_NEEDS[nextGoal]);
  }

  function toggleNeed(need: StackNeed) {
    setNeeds((current) =>
      current.includes(need)
        ? current.filter((item) => item !== need)
        : [...current, need],
    );
  }

  function reset() {
    setGoal("dashboard");
    setFramework("any");
    setNeeds(DEFAULT_STACK_NEEDS.dashboard);
    setOpenSourceOnly(true);
    setCopied(false);
  }

  async function copyMarkdown() {
    if (!plan || plan.picks.length === 0) return;

    const origin =
      typeof window === "undefined" ? "" : window.location.origin;
    const lines = [
      `# ${dict.stack.results.title}`,
      "",
      ...plan.picks.map((pick) => {
        const url = `${origin}/${locale}/libraries/${pick.library.slug}`;
        return `- **${dict.stack.needs[pick.need]}**: [${pick.library.name}](${url}) — ${pick.library.description}`;
      }),
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // O navegador pode negar a área de transferência; o botão continua
      // funcional para quem permite.
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:items-start">
      <form
        className="space-y-6 rounded-md border border-border p-4 lg:sticky lg:top-20"
        onSubmit={(event) => event.preventDefault()}
      >
        <div>
          <label
            htmlFor="stack-goal"
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
          >
            {dict.stack.form.goal}
          </label>
          <select
            id="stack-goal"
            value={goal}
            onChange={(event) => changeGoal(event.target.value as StackGoal)}
            className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-foreground/50"
          >
            {STACK_GOALS.map((item) => (
              <option key={item} value={item}>
                {dict.stack.goals[item]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="stack-framework"
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
          >
            {dict.stack.form.framework}
          </label>
          <select
            id="stack-framework"
            value={framework}
            onChange={(event) =>
              setFramework(event.target.value as StackFramework)
            }
            className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-foreground/50"
          >
            <option value="any">{dict.stack.form.anyFramework}</option>
            {FRAMEWORKS.map((item) => (
              <option key={item} value={item}>
                {dict.frameworkLabels[item]}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {dict.stack.form.needs}
          </legend>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {dict.stack.form.needsHint}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {STACK_NEEDS.map((need) => {
              const active = needs.includes(need);
              return (
                <button
                  key={need}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleNeed(need)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                  }`}
                >
                  {dict.stack.needs[need]}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {dict.stack.form.license}
          </span>
          <label className="mt-2 flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={openSourceOnly}
              onChange={(event) => setOpenSourceOnly(event.target.checked)}
              className="mt-0.5 size-4 accent-foreground"
            />
            <span>
              {dict.stack.form.openSource}
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {dict.stack.form.openSourceHint}
              </span>
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={reset}
          className="text-xs text-muted-foreground underline underline-offset-4 transition hover:text-foreground"
        >
          {dict.stack.form.reset}
        </button>
      </form>

      <section aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {dict.stack.results.title}
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {dict.stack.results.intro}
            </p>
          </div>
          {plan && plan.picks.length > 0 && (
            <button
              type="button"
              onClick={copyMarkdown}
              className="rounded-md border border-border px-3 py-2 text-xs transition hover:border-foreground/50"
            >
              {copied ? dict.stack.results.copied : dict.stack.results.copy}
            </button>
          )}
        </div>

        {plan && plan.picks.length > 0 && (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {plan.picks.length === 1
              ? dict.stack.results.countOne
              : formatText(dict.stack.results.countMany, {
                  n: plan.picks.length,
                })}
          </p>
        )}

        {!plan || plan.picks.length === 0 ? (
          <div className="mt-6 border border-dashed border-border px-6 py-16 text-center">
            <p className="text-sm font-medium">{dict.stack.results.empty}</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {dict.stack.results.emptyHint}
            </p>
          </div>
        ) : (
          <>
            {plan.notes.length > 0 && (
              <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
                {plan.notes.map((note) => (
                  <li key={`${note.kind}-${note.need}`} className="rounded border border-border px-3 py-2">
                    {formatText(
                      note.kind === "license"
                        ? dict.stack.results.noteLicense
                        : dict.stack.results.noteMissing,
                      { need: dict.stack.needs[note.need] },
                    )}
                  </li>
                ))}
              </ul>
            )}

            <ol className="mt-6 space-y-4">
              {plan.picks.map((pick) => {
                const library = pick.library;
                const reasons = [
                  formatText(dict.stack.results.reasonCategory, {
                    category: dict.categoryLabels[library.category],
                  }),
                ];
                if (pick.matchedTags.length > 0) {
                  reasons.push(
                    formatText(dict.stack.results.reasonTags, {
                      tags: pick.matchedTags.join(", "),
                    }),
                  );
                }
                if (pick.universal) {
                  reasons.push(dict.stack.results.reasonUniversal);
                }
                if (library.featured) {
                  reasons.push(dict.stack.results.reasonFeatured);
                }

                return (
                  <li
                    key={pick.need}
                    className="rounded-md border border-border p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          {dict.stack.needs[pick.need]}
                        </p>
                        <h3 className="mt-1 text-base font-semibold tracking-tight">
                          <Link
                            href={`/${locale}/libraries/${library.slug}`}
                            className="underline-offset-4 hover:underline"
                          >
                            {library.name}
                          </Link>
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                          {library.description}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {reasons.join(" · ")}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                        <span className="rounded border border-border px-1.5 py-0.5">
                          {dict.frameworkLabels[library.framework]}
                        </span>
                        <span className="rounded border border-border px-1.5 py-0.5">
                          {dict.categoryLabels[library.category]}
                        </span>
                        <span className="rounded border border-border px-1.5 py-0.5">
                          {dict.license.families[licenseFamily(library.license)]}
                        </span>
                      </div>
                    </div>

                    {pick.alternatives.length > 0 && (
                      <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                        <span className="font-mono uppercase tracking-wider">
                          {dict.stack.results.alternatives}
                        </span>
                        <span className="ml-2">
                          {pick.alternatives.map((alternative, index) => (
                            <span key={alternative.slug}>
                              {index > 0 ? ", " : ""}
                              <Link
                                href={`/${locale}/libraries/${alternative.slug}`}
                                className="underline underline-offset-4 transition hover:text-foreground"
                              >
                                {alternative.name}
                              </Link>
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </section>
    </div>
  );
}
