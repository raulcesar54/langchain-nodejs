# Study

API de RAG (Retrieval-Augmented Generation) em TypeScript. Faz upload de PDFs, gera embeddings, armazena no ChromaDB e responde perguntas com base no conteúdo.

## Stack

- Node.js + Express 5 + TypeScript
- LangChain (Anthropic, Ollama, Community)
- ChromaDB (banco vetorial)
- Embeddings via `@huggingface/transformers`
- Swagger UI para documentação

## Pré-requisitos

- Node.js 18+
- Docker (para o ChromaDB)
- [Ollama](https://ollama.com) com o modelo `deepseek-r1:7b` (`ollama pull deepseek-r1:7b`)
- Chave da API da Anthropic **ou** o modelo `qwen3` no Ollama (para o agente)

## Configuração

```bash
npm install
cp .env.example .env   # preencha as variáveis
```

| Variável            | Descrição                                |
| ------------------- | ---------------------------------------- |
| `ANTHROPIC_API_KEY` | Chave da API da Anthropic (opcional, veja abaixo) |
| `ANTHROPIC_MODEL`   | Modelo Claude do agente (padrão: `claude-haiku-4-5`) |
| `OLLAMA_MODEL`      | Modelo Ollama do agente (padrão: `qwen3`) |
| `CHROMA_DB_URL`     | URL do ChromaDB (ex.: `http://localhost:8000`) |

### Modelo do agente (Anthropic ou Ollama)

O agente (LangGraph) escolhe o modelo automaticamente em `src/agente/modelo.ts`:

- **`ANTHROPIC_API_KEY` preenchida no `.env`** → usa o Claude (`ANTHROPIC_MODEL`).
- **`ANTHROPIC_API_KEY` vazia ou ausente** → usa o Ollama local (`OLLAMA_MODEL`).

Para usar o Ollama, baixe um modelo com suporte a *tool calling*:

```bash
ollama pull qwen3
```

> O `deepseek-r1:7b` (usado na rota `/perguntar`) **não** suporta tool calling, por isso o agente usa outro modelo.

## Executando

Suba o ChromaDB:

```bash
docker build -t study-chroma .
docker run -p 8000:8000 study-chroma
```

Inicie a API:

```bash
npm run dev     # desenvolvimento (hot reload)
npm run build && npm start   # produção
```

## Endpoints

| Método | Rota                | Descrição                                  |
| ------ | ------------------- | ------------------------------------------ |
| GET    | `/health`           | Verifica se a API está no ar               |
| POST   | `/treinar`          | Upload de PDF (campo `pdf`) e indexação    |
| POST   | `/perguntar`        | Faz uma pergunta e recebe a resposta       |
| GET    | `/docs`             | Documentação Swagger                       |

## Estrutura

```
src/
├── index.ts    # servidor Express e rotas
├── config.ts   # configuração do modelo LLM
├── rag.ts      # lógica de recuperação e resposta
├── treinar.ts  # indexação de PDFs no ChromaDB
├── pdf.ts      # leitura de PDFs
├── swagger.ts  # especificação OpenAPI
└── agente/
    ├── modelo.ts  # escolhe Claude (se houver ANTHROPIC_API_KEY) ou Ollama
    └── tools.ts   # ferramentas do agente (RAG, calculadora, data/hora)
```

## Sobre o projeto

Projeto rápido feito para estudo, sem uso de IA para escrever o código.

## Referências

- [ChromaDB Docs](https://docs.trychroma.com)
- [LangChain Docs](https://js.langchain.com/docs)
- [Ollama](https://ollama.com)
- [Building a Production-Ready RAG System with Node.js, LangChain, Ollama and ChromaDB](https://medium.com/simform-engineering/building-a-production-ready-rag-system-with-node-js-langchain-ollama-and-chromadb-8fefefede6be)
- [LangChain Basics with Node.js - Part 1](https://medium.com/@bharathy.poovalingam/langchain-basics-with-nodejs-part-1-a0163e463c18)
