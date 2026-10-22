# Segurança

## Reportando uma vulnerabilidade

Se você encontrou uma falha de segurança no Acervo — no site, no catálogo ou
no código deste repositório — **não abra uma issue pública**.

Use a aba **Security** do repositório:

> [Report a vulnerability](https://github.com/GMB-Rs/Diretorio/security/advisories/new)

Descreva o que acontece, como reproduzir e o impacto que você percebeu. Você
recebe um recibo automático e um aviso assim que a triagem começar.

## O que esperar

| Etapa | Prazo |
| ----- | ----- |
| Triagem inicial | até 7 dias |
| Confirmação e plano de correção | até 30 dias |
| Aviso público (se aplicável) | junto com a correção |

A correção entra no repositório antes da divulgação, e o advisory público é
aberto em seguida — com crédito para quem reportou, se a pessoa quiser.

## Versões suportadas

| Versão | Suportada |
| ------ | --------- |
| `main` / `feat/*` | sim |
| Último deploy em produção | sim |
| Releases antigas | não |

## Escopo

Entram no escopo: o código deste repositório, o deploy e a infraestrutura da
Vercel, e os dados do catálogo (`src/data/libraries.json`).

Fora do escopo: problemas de terceiros (uma biblioteca listada com XSS no
site dela, por exemplo) e Vulnerabilidades em domínios de terceiros usados
pelos sites catalogados.
