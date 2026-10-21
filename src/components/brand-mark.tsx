/*
  Marca do Acervo: uma grade 2x2 de quadrados — um preenchido, três
  contornados — que faz referência aos tiles da galeria. Sem letra, só
  geometria, na mesma linguagem monocromática do site (fio de 1px, preto no
  claro e branco no escuro via `currentColor`).
*/

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 21 21"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <rect
        x="0.75"
        y="0.75"
        width="8"
        height="8"
        fill="currentColor"
        stroke="none"
      />
      <rect x="12.25" y="0.75" width="8" height="8" />
      <rect x="0.75" y="12.25" width="8" height="8" />
      <rect x="12.25" y="12.25" width="8" height="8" />
    </svg>
  );
}
