# Acervo

[![CI](https://github.com/GMB-Rs/Diretorio/actions/workflows/ci.yml/badge.svg)](https://github.com/GMB-Rs/Diretorio/actions/workflows/ci.yml)
[![sync:github](https://github.com/GMB-Rs/Diretorio/actions/workflows/sync-github.yml/badge.svg)](https://github.com/GMB-Rs/Diretorio/actions/workflows/sync-github.yml)
[![Licença: MIT](https://img.shields.io/badge/Licença-MIT-yellow.svg)](LICENSE)
[![Estrelas](https://img.shields.io/github/stars/GMB-Rs/Diretorio?style=social)](https://github.com/GMB-Rs/Diretorio)
[![Site](https://img.shields.io/badge/site-acervo.app-0a0a0a)](https://acervo.app)

Acervo de bibliotecas de componentes para **web**. O site cataloga libs de UI
kit, headless, design systems, formulários, tabelas, ícones e animações —
organizadas por framework e categoria, com busca e filtros.

> Escopo atual: **Web UI**. Mobile (React Native, Flutter) entra em uma
> próxima fase, reaproveitando o mesmo schema de dados.

O site é bilíngue: **português** (`/pt`) e **inglês** (`/en`). O código, os
dados e a documentação deste repositório estão em português.

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
| `npm run typecheck`  | `next typegen` + `tsc --noEmit`                        |
| `npm run test`       | Testes da busca e das traduções (`node --test`)        |
| `npm run check`      | `lint` + `typecheck` + `build` + `test`                |
| `npm run sync:github`| Atualiza estrelas/downloads em `src/data/libraries.json`|

## Contribuindo

O catálogo é um arquivo só (`src/data/libraries.json`). O passo a passo para
adicionar uma biblioteca, as regras da logo e o que o CI checa estão no
[CONTRIBUTING.md](CONTRIBUTING.md).

- [CONTRIBUTING.md](CONTRIBUTING.md) — como rodar, adicionar bibliotecas, regras da logo, commits.
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — como o projeto trata as pessoas.
- [SECURITY.md](SECURITY.md) — como reportar uma vulnerabilidade.
- Issues e pull requests têm modelo em `.github/ISSUE_TEMPLATE` e
  `.github/PULL_REQUEST_TEMPLATE.md`.

## Estrutura

```
src/
  app/
    [lang]/                 # site inteiro por idioma (/pt, /en)
      layout.tsx            # shell, header/footer, tema claro/escuro
      page.tsx              # home: hero + galeria
      libraries/[slug]/page.tsx  # página de detalhe (SSG)
    global-not-found.tsx    # 404 para endereços sem rota
    sitemap.ts / robots.ts  # metadados para buscadores
  components/
    library-card.tsx        # card da galeria
    library-explorer.tsx    # busca + filtros (client component)
    language-select.tsx     # seletor de idioma
    back-link.tsx           # "voltar para a galeria" da ficha
    brand-mark.tsx          # logo geométrica (grade 2x2) do Acervo
    site-header.tsx / site-footer.tsx / theme-toggle.tsx
    repo-stars.tsx           # contador de estrelas do repositório
    theme-script.tsx          # script de tema injetado no <head> do servidor
  data/
    libraries.json          # fonte de verdade dos dados (pt-BR)
    repo.json               # métricas deste repositório (estrelas do GitHub)
    translations/
      en.json               # descrição/destaque por slug, em inglês
      tags.en.json          # vocabulário de tags traduzido
  i18n/
    config.ts               # idiomas, rótulos e `html lang`
    dictionaries/           # dicionário de UI por idioma (pt, en)
    library-text.ts         # texto das bibliotecas por idioma
    format.ts               # números e datas por idioma
  lib/
    libraries.ts            # parse/validação e consultas
    search.ts               # busca por termos, relevância e destaque
    format.ts               # formatação de números e datas
    site.ts                 # domínio canônico (metadataBase, sitemap, robots)
    repo.ts                 # dados do repositório (contador de estrelas)
    theme.ts                # tema (escolha salva ou preferência do sistema)
  types/
    library.ts              # schema, frameworks e categorias
scripts/
  sync-github.ts            # sincronização opcional com GitHub/npm
```

## Idiomas

O site fala **português (padrão) e inglês**, e o idioma vive na URL: `/pt` e
`/en`. O seletor de idioma no cabeçalho troca o primeiro segmento da URL
mantendo os filtros da galeria (`/pt?q=mobile` → `/en?q=mobile`), e a
escolha fica num cookie — a raiz do site (`/`) abre direto no idioma
preferido do visitante.

- `src/i18n/config.ts` — lista de idiomas, rótulos e `html lang` (`pt` → `pt-BR`).
- `src/i18n/dictionaries/pt.ts` e `en.ts` — todo o texto de interface
  (botões, rótulos, filtros, metadados). Os dicionários são **dados puros**,
  sem funções, para poderem cruzar a fronteira servidor/cliente.
- `src/data/translations/en.json` — descrição e destaque de cada biblioteca,
  indexados por `slug`. O português continua sendo a fonte de verdade em
  `src/data/libraries.json`; esse arquivo é só a tradução.
- `src/data/translations/tags.en.json` — o vocabulário de tags traduzido.

Ou seja: **tudo** é traduzido — a interface, as descrições, os destaques e as
tags. A busca também indexa o texto do idioma: em inglês, procurar
"accessibility" acha a biblioteca pela descrição e pelas tags traduzidas.
Os nomes dos grupos (categorias e frameworks) são reconhecidos em qualquer
idioma, então "forms" filtra o grupo de formulários mesmo na interface em
português.

Para adicionar um idioma novo: crie o dicionário em `src/i18n/dictionaries/`,
o arquivo de traduções em `src/data/translations/<idioma>.json` e registre o
idioma em `src/i18n/config.ts`.

## Busca

A busca da galeria é por **termos**: a query é dividida em palavras e todas
precisam casar em algum campo da biblioteca (nome, tags, descrição, destaque,
repositório, site, framework e categoria), em qualquer ordem — `react form` e
`form react` dão o mesmo resultado.

Termos que designam um **grupo do catálogo** viram filtro: `mobile` mostra só
as libs da categoria Mobile, `react` só as do framework React, `dados` só as
de Dados & Tabelas. O grupo aparece como etiqueta ao lado do contador. Os
rótulos de todos os idiomas contam: `forms` filtra o grupo de formulários
mesmo na interface em português.

Com busca ativa, a ordenação padrão passa a ser **por relevância**: o nome
casado vale mais que a tag, que vale mais que a descrição. O trecho casado
fica sublinhado no nome do card, para dar para ver por que a biblioteca
apareceu.

Atalhos: `/` foca o campo de busca e `Esc` limpa a busca.

A lógica vive em `src/lib/search.ts` (funções puras, sem React) e é coberta
por `src/lib/search.test.ts` e `src/i18n/i18n.test.ts`, que rodam no runner
nativo do Node:

```bash
npm run test
```

## Voltar para a galeria

A galeria mora na URL (`/pt?q=mobile&framework=react`), então a ficha da
biblioteca carrega a origem no parâmetro `from`. O botão "voltar para a
galeria" devolve o usuário para **aquela** galeria, com os mesmos filtros — e
não para a galeria raiz, que perderia o contexto de onde ele veio.

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
GitHub permite 60 requisições por hora — para as libs do catálogo é
necessário um `GITHUB_TOKEN`.

Com o workflow `sync:github` (`.github/workflows/sync-github.yml`) isso
roda sozinho toda segunda-feira: o job sincroniza e, se alguma métrica mudou,
abre um pull request com o catálogo atualizado. Ele também pode ser disparado
na mão em **Actions → sync:github → Run workflow**.

## Temas

Claro e escuro, com persistência em `localStorage` (`diretorio-theme` — a chave
antiga, mantida para não perder a preferência de quem já visitou o site). A lógica
mora em `src/lib/theme.ts`: a versão inline (`THEME_SCRIPT`) entra no `<head>`
do HTML do servidor pelo `useServerInsertedHTML` e aplica o tema antes da
primeira pintura, para evitar "flash" de tema incorreto. No cliente, um
efeito de layout reaplica o tema quando a troca de idioma remonta o layout e o
`<html>` é recriado.

## Marca

O logo não usa letra: é uma grade 2x2 de quadrados (um preenchido, três
contornados) que remete aos tiles da galeria, na mesma linguagem monocromática
do site. O SVG mora em `src/components/brand-mark.tsx` (usado no cabeçalho) e
a mesma geometria aparece no favicon (`src/app/favicon.ico` e
`src/app/icon.svg`).

## Deploy

Basta conectar o repositório na Vercel.

O domínio canônico vive em `src/lib/site.ts` (`acervo.app` por padrão) e é
usado no `metadataBase`, no `sitemap.xml` e no `robots.txt` — os três precisam
apontar para o mesmo lugar, senão o Google indexa URLs diferentes do mesmo
conteúdo. Para trocar o domínio sem mexer no código, defina
`NEXT_PUBLIC_SITE_URL` no painel da Vercel (Settings → Environment Variables);
a variável tem prioridade sobre o padrão e precisa existir no momento do
build, porque `sitemap.xml` e `robots.txt` são gerados estaticamente.

O DNS do domínio customizado precisa apontar para a Vercel:

| Tipo | Nome | Valor |
| --- | --- | --- |
| `A` | `@` | `76.76.21.21` |
| `AAAA` | `@` | `2606:4700:4700::1111` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Se o domínio estiver atrás do proxy da Cloudflare, o SSL da Cloudflare
precisa estar em modo *Full (strict)*.

## Estrelas do repositório

O cabeçalho mostra o número de estrelas do repositório, ao lado do contador
de bibliotecas. O valor sai de `src/data/repo.json` — atualizado pelo mesmo
job que sincroniza o catálogo (`scripts/sync-github.ts`) — e o componente
`src/components/repo-stars.tsx` pergunta à API do GitHub no navegador para
não ficar defasado entre um sync e outro. Se a API falhar, o número
estático continua na tela.

## Licença

[MIT](LICENSE) — o código do site, o catálogo e a documentação podem ser
usados, alterados e redistribuídos livremente, citando a autoria.

## Suporte

- Dúvidas e ideias: [discussões do repositório](https://github.com/GMB-Rs/Diretorio/discussions).
- Bugs: [issues](https://github.com/GMB-Rs/Diretorio/issues).
- Vulnerabilidades: [Security Advisories](https://github.com/GMB-Rs/Diretorio/security/advisories/new)
  (veja [SECURITY.md](SECURITY.md)).
