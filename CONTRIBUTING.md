# Como contribuir

Obrigado por querer ampliar o [Acervo](README.md)! O catálogo vive em um
único arquivo — `src/data/libraries.json` — e o site é gerado a partir dele.
Adicionar uma biblioteca é, em essence, adicionar um objeto ao JSON.

Este projeto segue a [MIT](LICENSE) e tem um
[Código de Conduta](CODE_OF_CONDUCT.md). Problemas de segurança são
reportados em privado, pelo processo descrito em [SECURITY.md](SECURITY.md).

## 1. Rodar o projeto

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | O que faz                                        |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Servidor de desenvolvimento                      |
| `npm run build`     | Build de produção                                |
| `npm run start`     | Sobe o build de produção                         |
| `npm run lint`      | ESLint                                           |
| `npm run typecheck` | `next typegen` + `tsc --noEmit`                  |
| `npm run test`      | Testes da busca e das traduções (`node --test`)  |
| `npm run check`     | `lint` + `typecheck` + `build` + `test`          |
| `npm run sync:github` | Atualiza estrelas/downloads no JSON           |

Antes de abrir o pull request:

```bash
npm run check
```

## 2. Adicionar uma biblioteca

1. Edite `src/data/libraries.json` e adicione um objeto no fim da lista
   (mantenha a ordem alfabética por `slug` quando possível).
2. Coloque a logo em `public/logos/<slug>.svg` (veja [as regras da logo](#3-regras-da-logo)).
3. Traduza a entrada em `src/data/translations/en.json` (veja
   [as traduções](#7-traduções)) — o teste falha se a tradução faltar.
4. Rode `npm run check`.

Exemplo completo:

```json
{
  "slug": "exemplo",
  "name": "Exemplo",
  "description": "Descrição de uma ou duas frases, em português.",
  "highlight": "Um detalhe ou curiosidade sobre a biblioteca.",
  "framework": "react",
  "category": "ui-kit",
  "website": "https://exemplo.dev",
  "repo": "owner/exemplo",
  "docs": "https://exemplo.dev/docs",
  "license": "MIT",
  "logo": "exemplo.svg",
  "color": "#111111",
  "tags": ["formulários", "acessível"],
  "stars": 1234,
  "npmDownloads": 50000,
  "featured": false,
  "maintained": true,
  "since": 2024,
  "npmPackage": "exemplo"
}
```

## 3. Campos do catálogo

O schema está em `src/types/library.ts` e é **validado no boot** por
`src/lib/libraries.ts` — um `framework`, `category` ou `color` inválido faz o
build falhar com o nome da biblioteca.

| Campo           | Obrigatório | Observações                                             |
| --------------- | ----------- | ------------------------------------------------------- |
| `slug`          | sim         | id único na URL, em `kebab-case`                       |
| `name`          | sim         | nome como aparece no site                               |
| `description`   | sim         | 1–2 frases, em português                                 |
| `highlight`     | sim         | o diferencial da biblioteca                              |
| `framework`     | sim         | um valor de `FRAMEWORKS` (ver `src/types/library.ts`)   |
| `category`      | sim         | um valor de `CATEGORIES` (ver `src/types/library.ts`)   |
| `website`       | sim         | site oficial (https)                                    |
| `color`         | sim         | cor de fundo do tile, em hex (`#RRGGBB`)                |
| `maintained`    | sim         | `true`/`false` — atualizado pelo sync                  |
| `since`         | sim         | ano do marco inicial do projeto                        |
| `license`       | sim         | SPDX quando possível (`MIT`, `Apache-2.0`, …)          |
| `tags`          | sim         | palavras-chave, em minúsculas                           |
| `repo`          | não         | `owner/repo` — usado pelo sync para buscar as estrelas |
| `npmPackage`    | não         | nome do pacote no npm — usado pelo sync                |
| `docs`          | não         | link da documentação                                     |
| `logo`          | não         | arquivo em `public/logos`                               |
| `logoKind`      | não         | `mark` (padrão), `wide` ou `text`                       |
| `stars`         | não         | atualizado pelo sync                                    |
| `npmDownloads`  | não         | atualizado pelo sync                                    |
| `featured`      | não         | destaca a biblioteca na home                            |
| `lastUpdate`    | não         | data do último push no GitHub                           |

`stars`, `npmDownloads` e `lastUpdate` **não precisam ser preenchidos
manualmente**: o workflow `sync:github` atualiza esses campos toda segunda
e abre um pull request com as mudanças.

## 4. Regras da logo

- A logo vai em `public/logos/<slug>.svg`, em SVG quadrado com
  `viewBox="0 0 24 24"`.
- O preenchimento é **branco** (`#ffffff`): o contraste com a cor de fundo do
  tile é ajustado em runtime (a logo é invertida quando o fundo é claro).
- Nada de fundo ou cor na imagem — só a marca.

```svg
<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <title>Nome da biblioteca</title>
  <path fill="#ffffff" d="..." />
</svg>
```

E o `logoKind` define como a marca aparece no tile:

| `logoKind` | quando usar                                                      |
| ---------- | ---------------------------------------------------------------- |
| `mark`     | símbolo quadrado (padrão) — não precisa declarar                |
| `wide`     | wordmark horizontal: o SVG tem viewBox largo e ocupa a largura   |
| `text`     | a marca **é** um texto (AG Grid, Recharts, styled-components)   |

Quando a marca é um texto, **não crie um SVG**: use `logoKind: "text"` e o
site escreve o nome da biblioteca dentro do tile, com o tamanho adaptado ao
comprimento do nome.

## 5. O que o CI checa

O workflow `ci` (`.github/workflows/ci.yml`) roda em todo push na `main` e em
todo pull request:

- `npm run lint` — ESLint (flat config do Next).
- `npm run typecheck` — `next typegen` + `tsc --noEmit`.
- `npm run build` — build de produção (as fichas do catálogo são pré-renderizadas).
- `npm run test` — testes da busca e das traduções.
- O schema do JSON é validado no boot do site.

## 6. Commits e pull requests

Commits no formato [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

```
feat(logos): adiciona a logo da biblioteca X
fix(card): corrige o contraste da logo em fundos claros
docs: explica as regras da logo no CONTRIBUTING
chore(deps): atualiza o Next.js
```

No pull request:

1. Descreva **o que** mudou e **por quê**;
2. Ligue a issue correspondente (`Closes #12`);
3. Cole o resultado de `npm run check`;
4. Se mudou o catálogo, diga quais bibliotecas entraram ou saíram.

O modelo em `.github/PULL_REQUEST_TEMPLATE.md` já traz esses campos — é só
preencher.

### A `main` é protegida

A branch `main` tem proteção de branch no GitHub, e vale saber o que isso
significa na prática:

- **Nada entra por push direto.** Toda mudança passa por pull request — o
  mesmo fluxo que o repositório usa. Nenhuma aprovação de outra pessoa é
  exigida: o merge acontece assim que o CI passa.
- **O CI precisa passar.** O merge só acontece com o check
  `Lint, tipos, build e testes` verde — o mesmo que roda no PR.
- **Sem force push e sem deletar a branch.** Se algo precisar ser
  desfeito, o caminho é um novo PR revertendo o commit.
- **Conversas resolvidas.** Todo comentário do review precisa ser marcado
  como resolvido antes do merge.

Se o CI quebrar por um motivo alheio à mudança, avise nos comentários do
pull request — a proteção pode ser desligada temporariamente em
*Settings → Branches*, e religada em seguida.

## 7. Traduções

O site tem dois idiomas: **português** (padrão) e **inglês**. O português é a
fonte da verdade — `description` e `highlight` vivem em
`src/data/libraries.json`. A tradução vive em
`src/data/translations/en.json`, indexada por `slug`:

```jsonc
{
  "shadcn-ui": {
    "description": "Copy-and-paste components built on top of Radix UI.",
    "highlight": "You own the code: the components land in your own repo."
  }
}
```

As **tags** têm vocabulário próprio: `src/data/translations/tags.en.json`
muda tag por tag (`acessibilidade` → `accessibility`), e a tag original que
não está no mapa continua como está.

Ao adicionar ou renomear uma tag no catálogo, atualize também esse arquivo —
é o que mantém a busca em inglês funcionando. O teste
`src/i18n/i18n.test.ts` cobra que **toda** biblioteca do catálogo tem texto
traduzido.

O texto de interface fica em `src/i18n/dictionaries/pt.ts` e `en.ts`. São
dicionários de **dados puros** (sem funções), com números em templates
(`"{n} bibliotecas"`) resolvidos por `formatText` — assim o mesmo dicionário
serve ao servidor e ao cliente.
