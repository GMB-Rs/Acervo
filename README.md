# Diretório

![sync:github](https://github.com/GMB-Rs/Diretorio/actions/workflows/sync-github.yml/badge.svg)

Galeria de bibliotecas de componentes para **web**. O site cataloga libs de UI
kit, headless, design systems, formulários, tabelas, ícones e animações —
organizadas por framework e categoria, com busca e filtros.

> Escopo atual: **Web UI**. Mobile (React Native, Flutter) entra em uma
> próxima fase, reaproveitando o mesmo schema de dados.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, Cache Components)
- React 19 + TypeScript
- Tailwind CSS v4
- ESLint flat config

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script               | O que faz                                              |
| -------------------- | ------------------------------------------------------ |
| `npm run dev`        | Servidor de desenvolvimento                             |
| `npm run build`      | Build de produção                                      |
| `npm run start`      | Sobe o build de produção                               |
| `npm run lint`       | ESLint                                                 |
| `npm run typecheck`  | `tsc --noEmit`                                         |
| `npm run check`      | `lint` + `typecheck` + `build`                         |
| `npm run sync:github`| Atualiza estrelas/downloads em `src/data/libraries.json`|

## Contribuindo

O catálogo é um arquivo só (`src/data/libraries.json`). O passo a passo para
adicionar uma biblioteca, as regras da logo e o que o CI checa estão no
[CONTRIBUTING.md](CONTRIBUTING.md).

## Estrutura

```
src/
  app/
    layout.tsx              # shell, header/footer, tema claro/escuro
    page.tsx                # home: hero + destaques + galeria
    libraries/[slug]/page.tsx  # página de detalhe (SSG)
    sitemap.ts / robots.ts  # metadados para buscadores
  components/
    library-card.tsx        # card da galeria
    library-explorer.tsx    # busca + filtros (client component)
    site-header.tsx / site-footer.tsx / theme-toggle.tsx
  data/
    libraries.json          # fonte de verdade dos dados
  lib/
    libraries.ts            # parse/validação e consultas
    format.ts               # formatação de números e datas
  types/
    library.ts              # schema, frameworks e categorias
scripts/
  sync-github.ts            # sincronização opcional com GitHub/npm
```

## Dados

O catálogo vive em `src/data/libraries.json` e é **editado à mão**. O schema é
validado em `src/lib/libraries.ts` no boot — framework ou categoria inválidos
quebram o build em vez de vazar para a UI.

Campos principais por biblioteca:

```jsonc
{
  "slug": "shadcn-ui",          // usado na URL
  "name": "shadcn/ui",
  "description": "...",
  "highlight": "...",
  "framework": "react",         // react | vue | svelte | angular | solid | qwik | web-components | vanilla
  "category": "ui-kit",         // ui-kit | headless | design-system | utility | forms | data | icons | animation
  "website": "https://...",
  "repo": "shadcn-ui/ui",       // owner/repo -> GitHub API
  "npmPackage": "shadcn",       // -> api.npmjs.org
  "license": "MIT",
  "tags": ["tailwind", "radix"],
  "stars": 94000,               // <- atualizado pelo sync
  "npmDownloads": 0,            // <- atualizado pelo sync
  "featured": true,
  "maintained": true,           // <- atualizado pelo sync
  "since": 2023
}
```

### Sincronização automática (opcional)

```bash
GITHUB_TOKEN=ghp_xxx npm run sync:github
```

O script busca estrelas, data do último push e status de manutenção no GitHub,
além dos downloads mensais no npm, e reescreve o JSON. Sem token, a API do
GitHub permite 60 requisições por hora — para as 63 libs do catálogo é
necessário um `GITHUB_TOKEN`.

Com o workflow `sync:github` (`.github/workflows/sync-github.yml`) isso
roda sozinho toda segunda-feira: o job sincroniza e, se alguma métrica mudou,
abre um pull request com o catálogo atualizado. Ele também pode ser disparado
na mão em **Actions → sync:github → Run workflow**.

## Temas

Claro e escuro, com persistência em `localStorage` (`diretorio-theme`). O script
inline no `layout.tsx` aplica o tema antes da primeira pintura para evitar
"flash" de tema incorreto.

## Deploy

Basta conectar o repositório na Vercel. O `metadataBase` e as URLs do
`sitemap.ts` / `robots.ts` apontam para `https://diretorio.dev` — ajuste para o
domínio real antes de publicar.
