/**
 * Sincroniza as métricas do diretório com o GitHub e o npm.
 *
 *   npm run sync:github
 *
 * Use GITHUB_TOKEN para aumentar o limite de requisições da API do GitHub:
 *   GITHUB_TOKEN=ghp_xxx npm run sync:github
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Library = {
  slug: string;
  name: string;
  repo?: string;
  npmPackage?: string;
  stars?: number;
  npmDownloads?: number;
  license: string;
  maintained: boolean;
  lastUpdate?: string;
};

const DATA_FILE = path.join(process.cwd(), "src", "data", "libraries.json");
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const INACTIVE_AFTER_MONTHS = 18;
const SLEEP_MS = 250;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class RateLimitError extends Error {}

async function fetchJson<T>(
  url: string,
  headers: Record<string, string> = {},
  { detectRateLimit = false }: { detectRateLimit?: boolean } = {},
) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "diretorio-sync",
      ...headers,
    },
  });

  if (detectRateLimit && (response.status === 403 || response.status === 429)) {
    throw new RateLimitError(
      "limite da API do GitHub atingido — use GITHUB_TOKEN para continuar",
    );
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} — ${url}`);
  }

  return (await response.json()) as T;
}

async function syncGithub(library: Library) {
  if (!library.repo) return;

  try {
    const repo = await fetchJson<{
      stargazers_count: number;
      pushed_at: string;
      archived: boolean;
      license: { spdx_id: string } | null;
    }>(
      `https://api.github.com/repos/${library.repo}`,
      {
        ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
      },
      { detectRateLimit: true },
    );

    library.stars = repo.stargazers_count;
    library.lastUpdate = repo.pushed_at;

    const monthsSincePush =
      (Date.now() - new Date(repo.pushed_at).getTime()) /
      (1000 * 60 * 60 * 24 * 30);
    library.maintained = !repo.archived && monthsSincePush < INACTIVE_AFTER_MONTHS;

    // Só sobrescreve a licença quando o valor atual parece um id SPDX.
    if (repo.license?.spdx_id && /^[A-Za-z0-9.-]+$/.test(library.license)) {
      library.license = repo.license.spdx_id;
    }

    console.log(`  ✓ ${library.name}: ${library.stars} estrelas`);
  } catch (error) {
    if (error instanceof RateLimitError) throw error;
    console.warn(`  ! ${library.name}: ${(error as Error).message}`);
  }

  await sleep(SLEEP_MS);
}

async function syncNpm(library: Library) {
  if (!library.npmPackage) return;

  try {
    const stats = await fetchJson<{ downloads: number }>(
      `https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(
        library.npmPackage,
      )}`,
    );
    library.npmDownloads = stats.downloads;
  } catch {
    // Pacote sem dados no npm — mantém o valor anterior.
  }
}

async function main() {
  const raw = await readFile(DATA_FILE, "utf8");
  const libraries = JSON.parse(raw) as Library[];
  const npmOnly = process.argv.includes("--npm-only");

  console.log(
    `Sincronizando ${libraries.length} bibliotecas${
      GITHUB_TOKEN ? " (com GITHUB_TOKEN)" : " (sem token — limite de 60 req/h)"
    }${npmOnly ? " — apenas npm" : ""}...\n`,
  );

  if (!npmOnly) {
    try {
      for (const library of libraries) {
        await syncGithub(library);
      }
    } catch (error) {
      if (!(error instanceof RateLimitError)) throw error;
      console.warn(
        `\n! ${(error as Error).message}. As estrelas mantêm o valor anterior.`,
      );
    }
  }

  console.log("\nBuscando downloads no npm...");
  await Promise.all(libraries.map((library) => syncNpm(library)));

  await writeFile(DATA_FILE, `${JSON.stringify(libraries, null, 2)}\n`, "utf8");

  const inactive = libraries.filter((library) => !library.maintained);
  console.log(
    `\nPronto. ${libraries.length} bibliotecas atualizadas${
      inactive.length ? ` — ${inactive.length} marcadas como inativas` : ""
    }.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
