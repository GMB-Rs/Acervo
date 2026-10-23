import { buildLlmsIndex } from "@/lib/llms";

/*
  Índice para LLMs e agentes. É estático: o catálogo muda no build, não na
  requisição. O `llms-full.txt` traz as fichas completas.
*/
export function GET() {
  return new Response(buildLlmsIndex("pt"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
