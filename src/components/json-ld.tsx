/*
  Um bloco JSON-LD. O JSON é serializado no servidor; o `<` vira `\u003c`
  para que nenhum texto do catálogo consiga fechar o `<script>`.
*/
export function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
