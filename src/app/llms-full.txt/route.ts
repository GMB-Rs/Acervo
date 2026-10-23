import { buildLlmsFull } from "@/lib/llms";

/* Fichas completas para indexação e uso por agentes. */
export function GET() {
  return new Response(buildLlmsFull("pt"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
