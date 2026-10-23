# Acervo

[![CI](https://github.com/GMB-Rs/Diretorio/actions/workflows/ci.yml/badge.svg)](https://github.com/GMB-Rs/Diretorio/actions/workflows/ci.yml)
[![sync:github](https://github.com/GMB-Rs/Diretorio/actions/workflows/sync-github.yml/badge.svg)](https://github.com/GMB-Rs/Diretorio/actions/workflows/sync-github.yml)
[![Licença: MIT](https://img.shields.io/badge/Licença-MIT-yellow.svg)](LICENSE)
[![Estrelas](https://img.shields.io/github/stars/GMB-Rs/Diretorio?style=social)](https://github.com/GMB-Rs/Diretorio)
[![Site](https://img.shields.io/badge/site-online-0a0a0a)](https://acervo-azure.vercel.app/)

Acervo de bibliotecas para **web**. O site cataloga libs de UI kit, headless, design systems, formulários, tabelas, gráficos, ícones, editores, animações e utilitários — organizadas por framework e categoria, com busca e filtros.

> Cobertura: UI kits, headless, design systems, formulários, tabelas, gráficos, ícones, animação, mobile/universal e utilitários de data.

O site é bilíngue: **português** (`/pt`) e **inglês** (`/en`). O código, os dados e a documentação deste repositório estão em português.

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components)
- React 19 + TypeScript
- Tailwind CSS v4
- ESLint flat config

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | O que faz |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |
| `npm run test` | Testes da busca e das traduções (`node --test`) |
| `npm run check` | `lint` + `typecheck` + `build` + `test` |
| `npm run mcp` | Servidor MCP local (stdio) para agentes |
| `npm run sync:github` | Atualiza estrelas/downloads em `src/data/libraries.json` |

## Contribuindo

O catálogo é um arquivo só (`src/data/libraries.json`). O passo a passo para adicionar uma biblioteca, as regras da logo e o que o CI checa estão no [CONTRIBUTING.md](CONTRIBUTING.md).

- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — como o projeto trata as pessoas
- [SECURITY.md](SECURITY.md) — como reportar uma vulnerabilidade
- Issues e pull requests têm modelo em `.github/ISSUE_TEMPLATE` e `.github/PULL_REQUEST_TEMPLATE.md`

## Estrutura principal

```
src/
  app/
    [lang]/                 # site inteiro por idioma (/pt, /en)
    [lang]/stack/           # recomendador de stack
    [lang]/ia/              # documentação de IA/API/MCP
    api/libraries/          # API JSON pública do catálogo
    api/stars/route.ts      # contador de estrelas (cache no servidor)
    llms.txt/               # índice para LLMs
    llms-full.txt/          # fichas completas para LLMs
    sitemap.ts / robots.ts  # metadados para buscadores
  components/               # UI components
  data/
    libraries.json          # fonte de verdade dos dados (pt-BR)
    repo.json               # métricas deste repositório
    contributors.json       # lista de contribuidores (/contributors)
    translations/           # descrições e tags em inglês
  i18n/                     # config e dicionários de idiomas
  lib/                      # lógica de negócio (busca, stack, catálogo, tema, site)
  types/                    # schema das bibliotecas
mcp/
  server.ts                 # servidor MCP local (stdio)
scripts/
  sync-github.ts            # sincronização com GitHub/npm
```

## Busca

A busca entende **linguagem natural** sem chave e sem chamada externa:

- remove palavras vazias (`preciso de uma...`);
- reconhece sinônimos e frases (`tabela`/`table`, `react native`, `data grid`);
- trata framework, categoria e licença como filtros (`react`, `mobile`, `MIT`);
- usa correspondência de palavra inteira e tolera erro de digitação (`tailwnd`);
- se a busca estrita não achar nada, relaxa os termos descritivos e avisa que os resultados são aproximados.

Atalhos: `/` foca o campo, `Esc` limpa. Essa é a camada semântica local do projeto: ela não baixa modelo de embedding e roda inteira no navegador. Lógica em `src/lib/search.ts` (funções puras, sem React), coberta por testes (`npm run test`).

## IA sem chave

O catálogo também é uma superfície para agentes. Tudo é determinístico e não
exige chave de API, cadastro ou LLM pago:

- [`/llms.txt`](https://acervo-azure.vercel.app/llms.txt) e
  [`/llms-full.txt`](https://acervo-azure.vercel.app/llms-full.txt) — índice e
  fichas completas em texto;
- `/api/libraries` e `/api/libraries/[slug]` — catálogo em JSON com busca por
  intenção, filtros e paginação;
- JSON-LD (`WebSite`, `ItemList` e `SoftwareApplication`) nas páginas;
- `/pt/stack` e `/en/stack` — recomendador determinístico de stack;
- `npm run mcp` — servidor MCP local (stdio) com `search_libraries`,
  `get_library` e `recommend_stack`.

A página `/pt/ia` (ou `/en/ia`) documenta as superfícies e mostra a
configuração do MCP. O guia do servidor está em [mcp/README.md](mcp/README.md).

## Sincronização automática (opcional)

```bash
GITHUB_TOKEN=ghp_xxx npm run sync:github
```

Busca estrelas, último push, status de manutenção no GitHub e downloads no npm, reescrevendo o JSON. Sem token: 60 req/h da API anônima. Com o workflow `sync:github` roda sozinho toda segunda-feira e abre PR se algo mudou.

## Estrelas do repositório

O cabeçalho mostra o número de estrelas. O valor sai de `src/data/repo.json` (sync diário) e é confirmado em tempo real pela rota `/api/stars`, que o componente consulta no navegador. A busca é no servidor (cache de 5 min) para evitar o 403 da API anônima do GitHub. Para o limite maior (5000/h), defina `GITHUB_TOKEN` na Vercel.

## Página de contribuidores

`/pt/contributors` lista quem já contribuiu (avatar + commits). Dados da API do GitHub com cache de 1h, reserva em `src/data/contributors.json` (sync diário). Robôs (Dependabot) são filtrados.

## Licença

[MIT](LICENSE) — código, catálogo e documentação podem ser usados, alterados e redistribuídos livremente, citando a autoria.

## Suporte

- Dúvidas e ideias: [discussões](https://github.com/GMB-Rs/Diretorio/discussions)
- Bugs: [issues](https://github.com/GMB-Rs/Diretorio/issues)
- Vulnerabilidades: [Security Advisories](https://github.com/GMB-Rs/Diretorio/security/advisories/new) (veja [SECURITY.md](SECURITY.md))
