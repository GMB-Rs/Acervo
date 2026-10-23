# Servidor MCP do Acervo

Servidor MCP local (stdio) para Claude Desktop, Cursor, VS Code e qualquer
cliente compatível. Ele lê o catálogo do repositório, usa a mesma busca por
intenção e o mesmo recomendador de stack do site e **não precisa de chave de
API, login ou LLM pago**.

## Rodar

```bash
npm install
npm run mcp
```

O processo fica ouvindo JSON-RPC no `stdin` e responde no `stdout`; mensagens
de log vão para o `stderr`. Ele encerra quando o cliente fecha o pipe.

Requisitos: Node.js 20+ e as dependências do projeto (`tsx` já está nas
`devDependencies`).

## Configurar no cliente

Troque `/caminho/para/Diretorio` pelo caminho absoluto do checkout.

### Claude Desktop

Arquivo `claude_desktop_config.json`:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "acervo": {
      "command": "npm",
      "args": ["--prefix", "/caminho/para/Diretorio", "run", "mcp"]
    }
  }
}
```

### Cursor

Em `.cursor/mcp.json` (projeto) ou no arquivo global de MCP:

```json
{
  "mcpServers": {
    "acervo": {
      "command": "npm",
      "args": ["--prefix", "/caminho/para/Diretorio", "run", "mcp"]
    }
  }
}
```

### VS Code

Em `.vscode/mcp.json`:

```json
{
  "servers": {
    "acervo": {
      "type": "stdio",
      "command": "npm",
      "args": ["--prefix", "/caminho/para/Diretorio", "run", "mcp"]
    }
  }
}
```

## Ferramentas

| Ferramenta | O que faz |
|------------|-----------|
| `search_libraries` | Busca por nome, tag, descrição ou linguagem natural. Filtros: `framework`, `category`, `license`, `language`, `limit`. |
| `get_library` | Ficha completa de uma biblioteca pelo `slug`. |
| `recommend_stack` | Stack determinística por `goal`, `framework`, `needs[]` e `openSourceOnly`. |

Exemplos de chamadas:

```json
{"name":"search_libraries","arguments":{"query":"tabela editável","license":"mit","limit":5}}
{"name":"get_library","arguments":{"slug":"tanstack-table","language":"pt"}}
{"name":"recommend_stack","arguments":{"goal":"dashboard","framework":"react","needs":["ui","tables","charts"],"openSourceOnly":true}}
```

## Recursos

- `acervo://libraries/pt` — catálogo completo em português (JSON).
- `acervo://libraries/en` — catálogo completo em inglês (JSON).
- `acervo://llms/pt` — índice em texto para LLMs.
- `acervo://llms/en` — o mesmo índice em inglês.

## URLs e ambiente

As URLs devolvidas nas fichas usam `https://acervo-azure.vercel.app` por
padrão. Para apontar para outro deploy ou para o domínio final:

```bash
ACERVO_BASE_URL=https://seu-dominio.example npm run mcp
```

## Privacidade

O servidor não faz requisições de rede e não envia consultas para nenhum
serviço. Ele lê `src/data/libraries.json`, as traduções e os módulos de busca
e recomendação do próprio repositório. As únicas variáveis lidas são
`ACERVO_BASE_URL` (opcional) e o transporte padrão do Node.
